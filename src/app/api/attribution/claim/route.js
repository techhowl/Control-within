import crypto from "node:crypto";
import { after } from "next/server";
import {
  claimSession,
  clean,
  defaultZohoFields,
  hashMobile,
  parseCreatedAt,
  phoneVariants,
  pushAudit,
  recallClaim,
  restoreSession,
  rememberClaim,
  resolveAnchor,
  sessionToZohoFields,
} from "@/lib/attribution";
import { searchZohoRecords, updateZohoRecord } from "@/lib/zoho";

/**
 * POST /api/attribution/claim
 *
 * Called by Interakt after the Meta form is submitted and the Zoho Flow node
 * has created the Lead. Given the contact's mobile and the UTC timestamp of
 * when they were created on WhatsApp, this finds the website session that most
 * likely belongs to them and writes its campaign params onto the Lead.
 *
 * Body:    { "mobile": "919999999999", "Created_at": "2026-07-27T10:31:00Z" }
 * Header:  x-api-key: <ATTRIBUTION_API_KEY>
 *
 * Rules:
 *   - a matched session overwrites the Lead's existing UTM values (last touch
 *     wins), so a contact who returns through a later campaign is re-attributed
 *     instead of staying frozen on the campaign that first found them
 *   - with no match, only BLANK fields are filled — the neutral placeholder set
 *     can never clobber a real campaign value
 *   - when no session matches, the neutral Whatsapp placeholder set is written
 *     so every Lead still carries a source
 *   - never 500s: a failure returns success:false with a reason, so the
 *     Interakt workflow step does not error out and stall the user's chat
 *
 * The response is intentionally flat — every key maps straight to an Interakt
 * workflow variable, same as /api/nearest-doctor.
 */

// Fields this route is allowed to write. UTM_Source is deliberately absent —
// it is owned by the WhatsApp phrase system, so we never create or update it,
// matched or not. The matched value is still reported in the response.
const ZOHO_UTM_FIELDS = [
  "UTM_Medium",
  "UTM_Campaign",
  "UTM_Content",
  "UTM_Term",
  "Placement",
  "Platform",
  "Src",
];

/**
 * Zoho's /search endpoint reads an index that is populated asynchronously after
 * a record is written, so a Lead that Zoho Flow created seconds ago is often
 * not findable yet — observed missing for well over 6s, then present. Retrying
 * inside the request would blow Interakt's webhook timeout, so the search is
 * split in two:
 *
 *   FAST   one attempt inline. Covers the common case where the Lead predates
 *          this call (a returning contact, or a slow form).
 *   SLOW   the rest, run by `after()` once the response is already on the wire.
 *          Interakt gets its answer in ~1s while we keep trying for ~2.5 min.
 *
 * `after()` needs a live process to finish the work, which Dokploy's long-lived
 * Node server provides. On a freeze-after-response serverless host this would
 * need a queue instead.
 */
const SEARCH_DELAYS_FAST_MS = [0];
const SEARCH_DELAYS_SLOW_MS = [8000, 15000, 30000, 45000, 60000];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

/**
 * Step logging. Every line is prefixed with a short per-request id so
 * concurrent claims stay readable when they interleave in the container log.
 */
function makeLogger(startedAt) {
  const rid = crypto.randomBytes(3).toString("hex");
  return (step, detail) => {
    const ms = Date.now() - startedAt;
    console.log(
      `[claim ${rid} +${ms}ms] ${step}${detail === undefined ? "" : " " + (typeof detail === "string" ? detail : JSON.stringify(detail))}`
    );
  };
}

/** Mask any run of 7+ digits down to its last 4, so logs never carry a number. */
function maskDigits(text) {
  return String(text).replace(/\d{7,}/g, (m) => `…${m.slice(-4)}`);
}

/**
 * Shape of an inbound body, safe to log: keys plus masked, truncated values.
 * This is the line that tells you what Interakt actually sent when the mapping
 * is wrong — the whole reason a 400 is hard to diagnose otherwise.
 */
function describeBody(body) {
  if (!body || typeof body !== "object") return { type: typeof body, value: String(body).slice(0, 80) };
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    out[k] =
      v === null || v === undefined
        ? String(v)
        : maskDigits(String(v)).slice(0, 60);
  }
  return out;
}

/** Constant-time comparison so the shared secret can't be probed by timing. */
function authorized(request) {
  const expected = process.env.ATTRIBUTION_API_KEY;
  if (!expected) return false;
  const got = request.headers.get("x-api-key") || "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** A Zoho field counts as fillable when it is empty, null, or literal "null". */
function isBlank(value) {
  if (value === null || value === undefined) return true;
  const s = String(value).trim();
  return s === "" || s.toLowerCase() === "null";
}

/**
 * Find the Lead for this mobile. No `fields` param: Zoho's search returns the
 * full record, which is what the fill-if-blank check needs, and it avoids
 * failing outright if one custom field is named differently in the CRM.
 */
async function findLead(moduleName, mobile, log, delays, phase) {
  const variants = phoneVariants(mobile);
  if (!variants.length) return null;

  const criteria =
    "(" +
    variants
      .flatMap((v) => [`(Mobile:equals:${v})`, `(Phone:equals:${v})`])
      .join("or") +
    ")";

  log(`zoho.search.${phase}`, maskDigits(criteria));

  for (let i = 0; i < delays.length; i++) {
    const delay = delays[i];
    if (delay) {
      log("zoho.search.backoff", `${delay}ms before attempt ${i + 1}/${delays.length}`);
      await sleep(delay);
    }
    try {
      const lead = await searchZohoRecords(moduleName, criteria);
      if (lead) {
        log("zoho.search.hit", { phase, attempt: i + 1, lead_id: lead.id });
        return lead;
      }
      log("zoho.search.miss", `${phase} attempt ${i + 1} of ${delays.length}`);
    } catch (err) {
      log("zoho.search.error", `${phase} attempt ${i + 1}: ${err.message}`);
      console.error("attribution_zoho_search_failed:", err.message);
    }
  }
  return null;
}

/**
 * Given a Lead, work out which fields to write and write them.
 * Shared by the inline path and the deferred `after()` path.
 *
 * Two policies, decided by whether a real session matched:
 *
 *   matched    last-touch wins. A populated field is overwritten with the new
 *              campaign's value. Without this a contact who came back through a
 *              later campaign would keep their first campaign forever, because
 *              the Lead already exists and every UTM field is already filled —
 *              the new campaign's spend would attribute to nothing.
 *   no match   fill-if-blank, as before. The neutral Whatsapp placeholder set
 *              must never clobber a real campaign value.
 *
 * A field whose stored value already equals what we would write is left alone,
 * so a re-run is a no-op rather than a pointless Zoho update.
 */
async function patchLead({ moduleName, lead, fields, matched, log }) {
  const patch = {};
  const skipped = [];
  const overwritten = [];
  const unchanged = [];
  for (const key of ZOHO_UTM_FIELDS) {
    if (fields[key] === undefined) continue;
    if (isBlank(lead[key])) {
      patch[key] = fields[key];
      continue;
    }
    if (!matched) {
      skipped.push(key);
      continue;
    }
    if (String(lead[key]).trim() === fields[key]) {
      unchanged.push(key);
      continue;
    }
    patch[key] = fields[key];
    overwritten.push(key);
  }
  log("lead.current", Object.fromEntries(ZOHO_UTM_FIELDS.map((k) => [k, lead[k] ?? null])));
  log("patch.built", {
    policy: matched ? "overwrite (matched session — last touch wins)" : "fill-if-blank (defaults)",
    write: patch,
    overwriting_existing: overwritten,
    skipped_because_filled: skipped,
    already_current: unchanged,
  });

  if (Object.keys(patch).length === 0) {
    // Three different reasons for writing nothing, and the audit trail is
    // useless if they collapse into one: a filled record we refused to touch,
    // a record that already carries exactly this campaign, or a session that
    // only carried fields this route is not allowed to write (utm_source alone).
    const error = skipped.length
      ? "already_filled"
      : unchanged.length
        ? "already_current"
        : "nothing_to_write";
    log("zoho.update.skipped", error);
    return { patch, skipped, overwritten, zohoUpdated: false, error };
  }

  try {
    await updateZohoRecord(moduleName, lead.id, patch);
    log("zoho.update.ok", { lead_id: lead.id, wrote: Object.keys(patch), overwrote: overwritten });
    return { patch, skipped, overwritten, zohoUpdated: true, error: null };
  } catch (err) {
    log("zoho.update.error", err.message);
    console.error("attribution_zoho_update_failed:", err.message);
    return { patch, skipped, overwritten, zohoUpdated: false, error: "zoho_update_failed" };
  }
}

export async function POST(request) {
  const arrivedAt = Date.now();
  const log = makeLogger(arrivedAt);
  log("start", { ua: request.headers.get("user-agent")?.slice(0, 60) || "-" });

  if (!authorized(request)) {
    log("auth.reject", process.env.ATTRIBUTION_API_KEY ? "bad x-api-key" : "ATTRIBUTION_API_KEY unset");
    return json({ success: false, error: "unauthorized" }, 401);
  }
  log("auth.ok");

  let body;
  try {
    body = await request.json();
  } catch (err) {
    log("body.invalid_json", err.message);
    return json({ success: false, error: "invalid_json" }, 400);
  }
  log("body.received", describeBody(body));

  // Interakt's variable picker names this field differently depending on where
  // it is inserted from, so accept every plausible spelling rather than 400.
  const MOBILE_KEYS = [
    "mobile",
    "Mobile",
    "phone",
    "Phone",
    "phone_number",
    "phoneNumber",
    "Phone_Number",
    "contact",
    "Contact",
  ];
  const mobileKey = MOBILE_KEYS.find((k) => clean(body?.[k]));
  const mobile = mobileKey ? clean(body[mobileKey]) : null;

  if (!mobile || phoneVariants(mobile).length === 0) {
    log("mobile.missing", {
      keys: Object.keys(body || {}),
      accepted: MOBILE_KEYS,
      hint: "need a 10+ digit number under one of the accepted keys; an unresolved {{n}} is ignored",
    });
    return json({ success: false, error: "missing_mobile" }, 400);
  }
  log("mobile.source", `from body.${mobileKey}`);
  log("mobile.ok", { variants: phoneVariants(mobile).map(maskDigits) });

  const createdAtRaw =
    body?.Created_at ?? body?.created_at ?? body?.created_at_utc ?? body?.createdAt;
  const createdAt = parseCreatedAt(createdAtRaw);
  log("created_at.parsed", {
    // Masked: a mis-mapped Interakt variable puts the phone number here.
    raw: createdAtRaw === undefined ? "(absent)" : maskDigits(String(createdAtRaw)).slice(0, 40),
    parsed: createdAt ? new Date(createdAt).toISOString() : null,
    age_sec: createdAt ? Math.round((arrivedAt - createdAt) / 1000) : null,
    ...(createdAtRaw !== undefined && createdAt === null
      ? { warning: "unparseable or out of range — falling back to arrival-time matching" }
      : {}),
  });

  const mobileHash = hashMobile(mobile);

  // --- Idempotency: Interakt retries must not re-run the match or the write --
  try {
    const cached = await recallClaim(mobileHash);
    if (cached) {
      log("idempotency.hit", { session_id: cached.session_id, zoho_lead_id: cached.zoho_lead_id });
      return json({ ...cached, cached: true });
    }
    log("idempotency.miss");
  } catch (err) {
    log("idempotency.error", err.message);
    console.error("attribution_recall_failed:", err.message);
  }

  const anchor = resolveAnchor(createdAt, arrivedAt);
  log("anchor.resolved", {
    mode: anchor.mode,
    ref: new Date(anchor.ref).toISOString(),
    window_sec: `${Math.round((anchor.ref - anchor.lo) / 1000)}s..${Math.round((anchor.ref - anchor.hi) / 1000)}s before ref`,
    expected_lag_sec: Math.round(anchor.expectedLag / 1000),
  });

  // --- Match ---------------------------------------------------------------
  let claimed = { sid: null, lagMs: 0, candidates: 0, session: {} };
  try {
    claimed = await claimSession({ anchor });
    log("match.result", {
      session_id: claimed.sid || "(none)",
      candidates: claimed.candidates,
      lag_sec: claimed.sid ? Math.round(claimed.lagMs / 1000) : null,
      session: claimed.sid ? claimed.session : undefined,
      consumed: claimed.sid ? "session deleted from Valkey" : undefined,
    });
  } catch (err) {
    // Valkey down: fall through with no match. The Lead still gets the
    // placeholder set, which is better than leaving it blank.
    log("match.error", err.message);
    console.error("attribution_claim_failed:", err.message);
  }

  // The exact anchor score the session had, so a failed write can put it back
  // in the same place on the timeline. lag = ref - score, so score = ref - lag.
  const claimedAnchorMs = anchor.ref - claimed.lagMs;

  const sessionFields = sessionToZohoFields(claimed.session);
  const matched = Boolean(claimed.sid) && Object.keys(sessionFields).length > 0;

  let fields = sessionFields;
  if (!matched) {
    const { fields: defaults, missing } = defaultZohoFields();
    fields = defaults;
    if (missing.length) {
      log("defaults.env_missing", {
        vars: missing,
        effect: "using the built-in literal for these; set them in .env",
      });
    }
  }

  let confidence = "none";
  if (matched) confidence = claimed.candidates > 1 ? "low" : "high";

  log("fields.chosen", {
    source: matched ? "session" : "defaults (.env)",
    confidence,
    fields,
    note: "UTM_Source is reported but never written",
  });

  const base = {
    success: true,
    matched,
    confidence,
    anchor_mode: anchor.mode,
    lag_sec: claimed.sid ? Math.round(claimed.lagMs / 1000) : 0,
    candidates: claimed.candidates,
    session_id: claimed.sid || "",
    utm_source: fields.UTM_Source || "",
    utm_medium: fields.UTM_Medium || "",
    utm_campaign: fields.UTM_Campaign || "",
  };

  // --- Write to the Lead ---------------------------------------------------
  const moduleName = process.env.ZOHO_LEADS_MODULE || "Leads";

  // Zoho Flow can hand us the Lead id directly; then no lookup is needed and
  // the search index can lag as much as it likes.
  const givenLeadId = clean(body?.lead_id ?? body?.leadId ?? body?.zoho_lead_id);

  /** Finish the job once a Lead is in hand: patch, cache, audit. */
  const finish = async (lead) => {
    const { patch, skipped, overwritten, zohoUpdated, error } = await patchLead({
      moduleName,
      lead,
      fields,
      matched,
      log,
    });

    const result = {
      ...base,
      success: error !== "zoho_update_failed",
      zoho_lead_id: lead.id,
      zoho_updated: zohoUpdated,
      fields_written: Object.keys(patch).join(","),
      fields_skipped: skipped.join(","),
      fields_overwritten: overwritten.join(","),
      ...(error ? { error } : {}),
    };

    // Only remember outcomes that landed — a failed write must stay retryable.
    if (error !== "zoho_update_failed") {
      await rememberClaim(mobileHash, result).catch((err) => {
        log("idempotency.store.error", err.message);
      });
    } else {
      log("idempotency.store.skipped", "failed write stays retryable");
      // The session was consumed by the claim; put it back so the retry has
      // something to match instead of silently losing the attribution.
      await restoreSession(claimed.sid, claimed.session, claimedAnchorMs)
        .then(() => claimed.sid && log("session.restored", claimed.sid))
        .catch((err) => log("session.restore.error", err.message));
    }

    await pushAudit({
      at: new Date(arrivedAt).toISOString(),
      created_at_raw: maskDigits(clean(createdAtRaw) ?? ""),
      ...result,
    }).catch(() => {});

    return result;
  };

  if (givenLeadId) {
    log("lead.provided", givenLeadId);
    const result = await finish({ id: givenLeadId });
    log("done", result);
    return json(result);
  }

  const lead = await findLead(moduleName, mobile, log, SEARCH_DELAYS_FAST_MS, "inline");
  if (lead?.id) {
    const result = await finish(lead);
    log("done", result);
    return json(result);
  }

  // --- Not indexed yet: answer now, keep trying in the background ----------
  // The consumed session is NOT restored here — the deferred pass still holds
  // its data and owns it. It goes back only if every retry fails.
  log("lead.deferred", "not in the search index yet; retrying after the response");

  after(async () => {
    const late = await findLead(moduleName, mobile, log, SEARCH_DELAYS_SLOW_MS, "deferred");
    if (!late?.id) {
      log("lead.not_found", "deferred retries exhausted; restoring the session");
      await restoreSession(claimed.sid, claimed.session, claimedAnchorMs).catch((err) =>
        log("session.restore.error", err.message)
      );
      await pushAudit({
        at: new Date(arrivedAt).toISOString(),
        ...base,
        success: false,
        error: "lead_not_found",
        zoho_updated: false,
        zoho_lead_id: "",
        fields_written: "",
        fields_overwritten: "",
      }).catch(() => {});
      return;
    }
    const result = await finish(late);
    log("done.deferred", result);
  });

  const pending = {
    ...base,
    deferred: true,
    zoho_updated: false,
    zoho_lead_id: "",
    fields_written: "",
    fields_overwritten: "",
    note: "lead not in Zoho's search index yet; the update is retrying in the background",
  };
  log("done", pending);
  return json(pending);
}
