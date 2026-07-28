import crypto from "node:crypto";
import {
  getValkey,
  K,
  SESSION_TTL_SEC,
  IDEMPOTENCY_TTL_SEC,
  AUDIT_MAX,
} from "@/lib/valkey";

/**
 * UTM attribution — session capture on the website, time-proximity matching
 * when Interakt reports a new WhatsApp contact.
 *
 * The problem: campaign params live in the landing URL, the visitor then leaves
 * for WhatsApp, and WhatsApp carries nothing forward. Interakt's webhook knows
 * the phone number and when the contact was created, but nothing about the ad
 * that brought them. We bridge the two by timestamp proximity:
 *
 *   landing  → store utm params under a session id, anchored at server time
 *   wa click → move the anchor to the moment the visitor left for WhatsApp
 *   claim    → find the unclaimed session whose anchor sits closest to the
 *              expected lag before Interakt's Created_at, and claim it
 *
 * Deliberately a heuristic. It is wrong when two visitors overlap inside the
 * matching window; it is never wrong in a way that invents data, because an
 * unmatched claim writes the neutral Whatsapp placeholder set instead.
 */

// Params we accept from the browser. Anything else in the body is dropped.
export const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  // Which method the ad was about (Implant | hIUS). Drives the prefilled
  // WhatsApp message in src/lib/campaign.js; stored here too so the session
  // carries it. Deliberately absent from the Zoho map in sessionToZohoFields —
  // there is no UTM_Method field in the CRM, and writing an unknown field name
  // fails the whole update.
  "utm_method",
  "placement",
  "platform",
  "src",
];

const EXTRA_FIELDS = ["entry_path"];

// nanoid(12) from the client, but stay permissive about length.
const SID_RE = /^[A-Za-z0-9_-]{8,32}$/;

const MAX_VALUE_LEN = 256;

// Interakt clocks can run slightly ahead of ours; tolerate that much drift
// before deciding a Created_at is nonsense.
const CLOCK_SKEW_MS = 120 * 1000;

function envInt(name, fallback) {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Undo percent-encoding that survived the query string.
 *
 * `URLSearchParams.get()` already decodes once, so a normally-encoded param
 * arrives clean. What still shows up is a campaign name that was pasted into
 * Meta Ads *already encoded* — the ad URL literally carries
 * `Control%20Within%20|%20July`, which survives one decode unchanged and lands
 * in Zoho with the `%20`s intact.
 *
 * Decoded at most twice, since a genuinely double-encoded value (`%2520`) needs
 * the second pass, and only while a `%XX` sequence is actually present. A
 * malformed sequence (a bare `%`, a `%` in a real campaign name) makes
 * decodeURIComponent throw — keep what we had at that point rather than losing
 * the value.
 */
function decodePercent(s) {
  let out = s;
  for (let i = 0; i < 2 && /%[0-9A-Fa-f]{2}/.test(out); i++) {
    try {
      const next = decodeURIComponent(out);
      if (next === out) break;
      out = next;
    } catch {
      break;
    }
  }
  return out;
}

/**
 * An ad-platform macro the platform never expanded — the whole value is nothing
 * but braces and a token. Google ValueTrack `{keyword}`, `{campaignid}`; Meta
 * `{{campaign.name}}`; percent-encoded as `%7Bkeyword%7D`, already decoded by
 * the time this runs.
 *
 * These arrive on a real click whenever the tracking template is wrong, or on
 * any hand-tested link, and `{keyword}` in the CRM's UTM_Term is worse than an
 * empty UTM_Term: it looks like data. Only a value that is *entirely* a macro is
 * rejected, so a campaign name that happens to contain a brace still gets
 * through.
 */
const UNEXPANDED_MACRO = /^\{+[^{}]*\}+$/;

/**
 * Trim a value, rejecting empties and unexpanded ad-platform macros.
 * Percent-escapes are decoded and runs of whitespace collapsed first, so the
 * macro checks still catch a `%7B%7B` and Zoho never receives `%20`.
 */
export function clean(value) {
  const raw = (value ?? "").toString().trim();
  if (!raw) return null;
  const s = decodePercent(raw).replace(/\s+/g, " ").trim();
  if (!s || s.includes("{{") || UNEXPANDED_MACRO.test(s)) return null;
  return s.slice(0, MAX_VALUE_LEN);
}

export function isValidSid(sid) {
  return typeof sid === "string" && SID_RE.test(sid);
}

/** Whitelist + trim the campaign params out of a request body. */
export function pickParams(body = {}) {
  const out = {};
  for (const key of [...UTM_FIELDS, ...EXTRA_FIELDS]) {
    const v = clean(body[key]);
    if (v) out[key] = v;
  }
  return out;
}

export function hashMobile(mobile) {
  const digits = String(mobile ?? "").replace(/\D/g, "");
  return crypto
    .createHash("sha256")
    .update(`${process.env.ATTR_MOBILE_SALT || ""}:${digits}`)
    .digest("hex");
}

/**
 * Every shape the same Indian number might be stored as in Zoho: as received,
 * with the 91 country code, and bare 10-digit.
 */
export function phoneVariants(mobile) {
  const digits = String(mobile ?? "").replace(/\D/g, "");
  if (!digits) return [];
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  return [...new Set([digits, local, `91${local}`])].filter((v) => v.length >= 10);
}

/**
 * Parse Interakt's Created_at (UTC). Its exact format is not contractually
 * fixed, so accept the plausible shapes rather than trusting one:
 *   ISO-8601 with Z or an offset, "YYYY-MM-DD HH:mm:ss" (read as UTC),
 *   epoch seconds (10 digits), epoch milliseconds (13 digits).
 * @returns {number|null} epoch ms, or null when unusable
 */
export function parseCreatedAt(raw) {
  const s = clean(raw);
  if (!s) return null;

  // Sanity bounds. A bare 10-digit string is ambiguous: it can be epoch
  // seconds, but it is also exactly the shape of an Indian mobile number, and
  // a mis-mapped Interakt variable sends the phone number here. Anything
  // outside a plausible date range is rejected rather than silently believed —
  // 8999431754 as epoch seconds is the year 2255.
  const MIN_MS = Date.UTC(2020, 0, 1);
  const MAX_MS = Date.UTC(2100, 0, 1);
  const bounded = (ms) => (ms >= MIN_MS && ms <= MAX_MS ? ms : null);

  if (/^\d{10}$/.test(s)) return bounded(Number(s) * 1000);
  if (/^\d{13}$/.test(s)) return bounded(Number(s));

  // A bare "YYYY-MM-DD HH:mm:ss" has no zone; Interakt documents these as UTC,
  // but Date.parse would read it as local time. Normalise before parsing.
  let candidate = s;
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(s)) {
    candidate = `${s.replace(" ", "T")}Z`;
  }

  const ms = Date.parse(candidate);
  return Number.isFinite(ms) ? bounded(ms) : null;
}

/**
 * Decide which instant to match against and how wide the window should be.
 *
 * Created_at is the moment the contact was created on WhatsApp — for a
 * first-time messager that is seconds after they tapped the WhatsApp button, so
 * it is a tight, high-signal anchor. A returning contact carries an old
 * Created_at, which would match nothing; in that case fall back to the API
 * arrival time, where the usable signal is the slower form-submit lag.
 */
export function resolveAnchor(createdAtMs, arrivedAtMs) {
  const staleMs = envInt("ATTR_STALE_SEC", 900) * 1000;
  const age = createdAtMs === null ? null : arrivedAtMs - createdAtMs;

  if (age !== null && age <= staleMs && age >= -CLOCK_SKEW_MS) {
    const maxLag = envInt("ATTR_CREATED_MAX_LAG_SEC", 600) * 1000;
    return {
      mode: "created_at",
      ref: createdAtMs,
      lo: createdAtMs - maxLag,
      // The click always precedes contact creation; the only reason to look
      // past `ref` is clock skew between Interakt and this server.
      hi: createdAtMs + CLOCK_SKEW_MS,
      expectedLag: envInt("ATTR_CREATED_EXPECTED_LAG_SEC", 25) * 1000,
    };
  }

  const minLag = envInt("ATTR_ARRIVAL_MIN_LAG_SEC", 10) * 1000;
  const maxLag = envInt("ATTR_ARRIVAL_MAX_LAG_SEC", 420) * 1000;
  return {
    mode: "arrival",
    ref: arrivedAtMs,
    lo: arrivedAtMs - maxLag,
    hi: arrivedAtMs - minLag,
    expectedLag: envInt("ATTR_ARRIVAL_EXPECTED_LAG_SEC", 70) * 1000,
  };
}

/** Drop anchors older than the session TTL so the sorted set stays small. */
async function trimAnchor(r, nowMs) {
  await r.zremrangebyscore(K.anchor, "-inf", nowMs - SESSION_TTL_SEC * 1000);
}

/**
 * First page view of a session: store the campaign params and anchor the
 * session at the landing time. Repeat pings for a known session only refresh
 * the TTL — the original landing context wins, and an in-page navigation must
 * not drag the anchor forward past a wa_click that already happened.
 */
export async function recordLand(sid, params, nowMs = Date.now()) {
  const r = getValkey();
  const key = K.session(sid);

  const isNew = await r.hsetnx(key, "landed_at", String(nowMs));
  if (!isNew) {
    await r.expire(key, SESSION_TTL_SEC);
    return { created: false };
  }

  const hasUtm = UTM_FIELDS.some((f) => params[f]);
  const pipe = r.pipeline();
  pipe.hset(key, { ...params, has_utm: hasUtm ? "1" : "0" });
  pipe.expire(key, SESSION_TTL_SEC);
  // GT: the anchor only ever moves forward, so a late land ping can never
  // rewind a session that has already recorded its WhatsApp click.
  pipe.zadd(K.anchor, "GT", nowMs, sid);
  await pipe.exec();
  await trimAnchor(r, nowMs);

  return { created: true };
}

/**
 * The visitor is leaving for WhatsApp. This is the anchor that matters: the
 * gap between this instant and the contact showing up in Interakt is short and
 * predictable, unlike the open-ended time someone spends reading the page.
 */
export async function recordWaClick(sid, params, nowMs = Date.now()) {
  const r = getValkey();
  const key = K.session(sid);

  const pipe = r.pipeline();
  pipe.hset(key, "wa_click_at", String(nowMs));
  // The land ping can be lost (blocked beacon, hard reload); keep whatever
  // params came with the click so the session is still usable.
  const hasUtm = UTM_FIELDS.some((f) => params[f]);
  if (hasUtm) {
    for (const f of UTM_FIELDS) {
      if (params[f]) pipe.hsetnx(key, f, params[f]);
    }
    pipe.hset(key, "has_utm", "1");
  }
  pipe.hsetnx(key, "landed_at", String(nowMs));
  pipe.expire(key, SESSION_TTL_SEC);
  pipe.zadd(K.anchor, "GT", nowMs, sid);
  await pipe.exec();
  await trimAnchor(r, nowMs);
}

function flatArrayToObject(flat) {
  const out = {};
  if (!Array.isArray(flat)) return out;
  for (let i = 0; i < flat.length - 1; i += 2) out[flat[i]] = flat[i + 1];
  return out;
}

/**
 * Claim the best-matching session for a lead and consume it. See CLAIM_LUA in
 * lib/valkey.js — selection and deletion happen atomically, so a session is
 * handed out exactly once and concurrent leads can never share one.
 *
 * @returns {Promise<{sid:string|null, lagMs:number, candidates:number, session:object}>}
 */
export async function claimSession({ anchor }) {
  const r = getValkey();
  const res = await r.attrClaim(
    K.anchor,
    String(Math.round(anchor.lo)),
    String(Math.round(anchor.hi)),
    String(Math.round(anchor.ref)),
    String(Math.round(anchor.expectedLag))
  );

  const [sid, lagMs, candidates, flat] = res || [];
  return {
    sid: sid || null,
    lagMs: Number(lagMs) || 0,
    candidates: Number(candidates) || 0,
    session: flatArrayToObject(flat),
  };
}

/**
 * Put a consumed session back, exactly as it was. Called when the CRM step
 * fails after the session was already claimed — without this, a Zoho hiccup
 * would silently destroy the attribution and the Interakt retry would find
 * nothing to match.
 *
 * The original anchor score is restored (not "now"), so the session stays in
 * the same position on the timeline and can only be matched by a claim whose
 * reference instant genuinely lines up with it.
 */
export async function restoreSession(sid, session, anchorMs) {
  if (!sid || !session || !Object.keys(session).length) return;
  const r = getValkey();
  const pipe = r.pipeline();
  pipe.hset(K.session(sid), session);
  pipe.expire(K.session(sid), SESSION_TTL_SEC);
  pipe.zadd(K.anchor, Math.round(anchorMs), sid);
  await pipe.exec();
}

/** Remember the outcome for this mobile so Interakt retries are free. */
export async function rememberClaim(mobileHash, payload) {
  const r = getValkey();
  await r.set(K.mobile(mobileHash), JSON.stringify(payload), "EX", IDEMPOTENCY_TTL_SEC);
}

export async function recallClaim(mobileHash) {
  const r = getValkey();
  const raw = await r.get(K.mobile(mobileHash));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Capped ring of recent claim outcomes — read back by /api/attribution/debug. */
export async function pushAudit(entry) {
  const r = getValkey();
  const pipe = r.pipeline();
  pipe.lpush(K.audit, JSON.stringify(entry));
  pipe.ltrim(K.audit, 0, AUDIT_MAX - 1);
  await pipe.exec();
}

/**
 * Map a matched session's stored params onto Zoho Lead field API names.
 * Returns {} when the session carries no campaign data at all (an organic
 * landing), which sends the caller down the placeholder path.
 */
export function sessionToZohoFields(session = {}) {
  const map = {
    utm_source: "UTM_Source",
    utm_medium: "UTM_Medium",
    utm_campaign: "UTM_Campaign",
    utm_content: "UTM_Content",
    utm_term: "UTM_Term",
    placement: "Placement",
    platform: "Platform",
    src: "Src",
  };
  const out = {};
  for (const [from, to] of Object.entries(map)) {
    const v = clean(session[from]);
    if (v) out[to] = v;
  }
  return out;
}

// Fallback values live in .env so they can be changed without a code edit.
// Each entry is [Zoho field, env var, last-resort literal].
const DEFAULT_FIELD_ENV = [
  ["UTM_Source", "ATTR_DEFAULT_UTM_SOURCE", "Whatsapp"],
  ["UTM_Medium", "ATTR_DEFAULT_UTM_MEDIUM", "Whatsapp"],
  ["Platform", "ATTR_DEFAULT_PLATFORM", "Whatsapp"],
  ["UTM_Campaign", "ATTR_DEFAULT_UTM_CAMPAIGN", "Connexi * Howl"],
];

/**
 * Neutral fallback written when no session matched, so every Lead still carries
 * campaign context rather than a row of blanks.
 *
 * Values come from .env. A var that is unset or blank falls back to the literal
 * and is reported in `missing` — the caller logs that, because silently writing
 * a hardcoded value when the environment was meant to supply it is exactly the
 * kind of drift that goes unnoticed for weeks.
 *
 * UTM_Source is included for the response payload only — the claim route's
 * write whitelist excludes it, because the WhatsApp phrase system owns that
 * field and must not be overwritten by attribution.
 *
 * @returns {{fields: object, missing: string[]}}
 */
export function defaultZohoFields() {
  const fields = {};
  const missing = [];
  for (const [field, envVar, literal] of DEFAULT_FIELD_ENV) {
    const value = (process.env[envVar] ?? "").trim();
    if (value) {
      fields[field] = value;
    } else {
      fields[field] = literal;
      missing.push(envVar);
    }
  }
  return { fields, missing };
}
