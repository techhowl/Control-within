/**
 * Campaign params → prefilled WhatsApp message.
 *
 * Client-side only (no server imports), because the message is built at the
 * moment the visitor taps a WhatsApp button.
 *
 * The message is the one piece of attribution that survives the jump to
 * WhatsApp: the counsellor sees where the person came from and which method
 * they were reading about, before anyone has typed anything. Everything else
 * (Valkey session → Zoho Lead) is best-effort time matching behind the scenes.
 *
 * The field list is duplicated from UTM_FIELDS in src/lib/attribution.js on
 * purpose — that module pulls in node:crypto and ioredis and cannot be imported
 * from a client component. Keep the two lists in step.
 */

export const CAMPAIGN_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_method",
  "placement",
  "platform",
  "src",
];

/** Unchanged fallback: used whenever the URL says nothing about a campaign. */
export const DEFAULT_MESSAGE = "Hi, I would like to know more information.";

// Landing params, kept so the message still works after in-site navigation.
// The campaign params only exist in the URL of the *first* page view; a visitor
// who lands on "/?utm_source=…" and clicks through to /ius before tapping
// WhatsApp has a bare URL by then.
export const UTM_KEY = "cw_utm";

// hIUS is written every which way in ad platforms (hiUS, hIUS, h-ius). Strip to
// letters and compare lowercase, then render the one spelling the brand uses.
const METHOD_LABELS = {
  implant: "Implant",
  hius: "hIUS",
  ius: "hIUS",
};

const TEMPLATES = {
  meta: (m) => `Hi, I saw your ad on META and would like to know more about ${m}.`,
  google: (m) => `Hi, I saw your ad on Google and would like to know more about ${m}.`,
  chemist: (m) =>
    `Hi, I scanned the QR code at the chemist and would like to know more about ${m}.`,
  clinic: (m) =>
    `Hi, I scanned the QR code at the clinic and would like to know more about ${m}.`,
};

// Meta fills utm_source from {{site_source_name}}, which resolves to fb / ig /
// msg / an — never the string "meta". `platform=meta` is the hardcoded part of
// the paid URL and the most reliable signal.
//
// Checked against utm_source *and* utm_medium, because hand-built links name the
// network in whichever slot the author felt like: a bio or offline-shared link
// reads utm_source=offline&utm_medium=instagram, where the only mention of Meta
// is the medium. Both slots count as Meta.
const META_HINTS = ["fb", "ig", "facebook", "instagram", "messenger", "meta"];

const lower = (v) => String(v ?? "").trim().toLowerCase();

/** "hiUS" | "implant" → the brand's spelling, or null when unrecognised. */
export function methodLabel(raw) {
  const key = lower(raw).replace(/[^a-z]/g, "");
  return METHOD_LABELS[key] ?? null;
}

/** /implant and /ius imply the method even when utm_method is missing. */
function methodFromPath(pathname) {
  const p = lower(pathname);
  if (p.startsWith("/implant")) return METHOD_LABELS.implant;
  if (p.startsWith("/ius")) return METHOD_LABELS.hius;
  return null;
}

/**
 * Which of the four campaign routes this visitor arrived by, or null.
 *
 * QR is tested first because it is the only one that names a physical place,
 * and its `utm_source` (chemist / clinic) is what distinguishes the two
 * messages — a QR link missing that is not enough to say where it was scanned.
 */
export function resolveChannel(params = {}) {
  const src = lower(params.src);
  const source = lower(params.utm_source);
  const medium = lower(params.utm_medium);
  const platform = lower(params.platform);

  if (src.startsWith("qr") || medium === "scan") {
    if (source === "chemist") return "chemist";
    if (source === "clinic") return "clinic";
    return null;
  }
  if (
    platform === "meta" ||
    medium === "paid_social" ||
    META_HINTS.includes(source) ||
    META_HINTS.includes(medium)
  ) {
    return "meta";
  }
  if (source === "google" || medium === "paid_search") return "google";
  return null;
}

/**
 * The prefilled message for these params, or null when the params do not
 * describe a campaign we have wording for — the caller then keeps
 * DEFAULT_MESSAGE. Returning null rather than a half-built sentence is
 * deliberate: no invented copy, ever.
 */
export function buildCampaignMessage(params = {}, pathname = "") {
  const channel = resolveChannel(params);
  if (!channel) return null;

  const method = methodLabel(params.utm_method) || methodFromPath(pathname);
  if (!method) return null;

  return TEMPLATES[channel](method);
}

/** Pull the campaign fields out of a query string. */
export function paramsFromSearch(search) {
  const q = new URLSearchParams(search || "");
  const out = {};
  for (const field of CAMPAIGN_FIELDS) {
    const v = q.get(field);
    if (v) out[field] = v;
  }
  return out;
}

/**
 * Remember the landing params for the rest of the visit. Only called with
 * params that actually carry a campaign, so an organic page view never wipes
 * the campaign a visitor arrived on.
 */
export function storeParams(params) {
  if (typeof window === "undefined" || !params || !Object.keys(params).length) return;
  try {
    window.localStorage.setItem(UTM_KEY, JSON.stringify(params));
  } catch {
    // Private mode / storage full — the message just falls back to the default.
  }
}

export function readStoredParams() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTM_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * The message for right now: the live URL wins, then the stored landing params.
 * A visitor who lands on a campaign URL and browses to another page still sends
 * the campaign message, but arriving fresh on a *new* campaign URL overrides
 * whatever was stored.
 */
export function currentCampaignMessage(search, pathname) {
  const live = paramsFromSearch(search);
  const params = Object.keys(live).length ? live : readStoredParams();
  return buildCampaignMessage(params, pathname);
}
