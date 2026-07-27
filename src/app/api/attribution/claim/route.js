import crypto from "node:crypto";
import {
  claimSession,
  clean,
  defaultZohoFields,
  hashMobile,
  parseCreatedAt,
  phoneVariants,
  pushAudit,
  recallClaim,
  releaseClaim,
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
 *   - only BLANK Lead fields are written; anything already populated is left
 *     alone, so a re-run or a manual correction is never clobbered
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

// The Lead is created by Zoho Flow at almost the same instant Interakt calls
// us, so the first search can legitimately find nothing. Back off and retry —
// but the whole handler has to answer well inside Interakt's webhook timeout,
// and each search round trip is ~1s, so the total budget stays under ~10s.
const SEARCH_RETRY_DELAYS_MS = [0, 1500, 3500];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function json(payload, status = 200) {
  return Response.json(payload, { status });
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
async function findLead(moduleName, mobile) {
  const variants = phoneVariants(mobile);
  if (!variants.length) return null;

  const criteria =
    "(" +
    variants
      .flatMap((v) => [`(Mobile:equals:${v})`, `(Phone:equals:${v})`])
      .join("or") +
    ")";

  for (const delay of SEARCH_RETRY_DELAYS_MS) {
    if (delay) await sleep(delay);
    try {
      const lead = await searchZohoRecords(moduleName, criteria);
      if (lead) return lead;
    } catch (err) {
      console.error("attribution_zoho_search_failed:", err.message);
    }
  }
  return null;
}

export async function POST(request) {
  const arrivedAt = Date.now();

  if (!authorized(request)) {
    return json({ success: false, error: "unauthorized" }, 401);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "invalid_json" }, 400);
  }

  const mobile = clean(body?.mobile ?? body?.Mobile ?? body?.phone ?? body?.Phone);
  if (!mobile || phoneVariants(mobile).length === 0) {
    return json({ success: false, error: "missing_mobile" }, 400);
  }

  const createdAtRaw =
    body?.Created_at ?? body?.created_at ?? body?.created_at_utc ?? body?.createdAt;
  const createdAt = parseCreatedAt(createdAtRaw);
  const mobileHash = hashMobile(mobile);

  // --- Idempotency: Interakt retries must not re-run the match or the write --
  try {
    const cached = await recallClaim(mobileHash);
    if (cached) return json({ ...cached, cached: true });
  } catch (err) {
    console.error("attribution_recall_failed:", err.message);
  }

  const anchor = resolveAnchor(createdAt, arrivedAt);

  // --- Match ---------------------------------------------------------------
  let claimed = { sid: null, lagMs: 0, candidates: 0, session: {} };
  try {
    claimed = await claimSession({ mobileHash, anchor });
  } catch (err) {
    // Valkey down: fall through with no match. The Lead still gets the
    // placeholder set, which is better than leaving it blank.
    console.error("attribution_claim_failed:", err.message);
  }

  const sessionFields = sessionToZohoFields(claimed.session);
  const matched = Boolean(claimed.sid) && Object.keys(sessionFields).length > 0;
  const fields = matched ? sessionFields : defaultZohoFields();

  let confidence = "none";
  if (matched) confidence = claimed.candidates > 1 ? "low" : "high";

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
  const lead = await findLead(moduleName, mobile);

  if (!lead?.id) {
    // Nothing to patch. Give the session back so a retry can use it.
    await releaseClaim(claimed.sid).catch(() => {});
    const miss = {
      ...base,
      success: false,
      error: "lead_not_found",
      zoho_updated: false,
      zoho_lead_id: "",
      fields_written: "",
    };
    await pushAudit({ at: new Date(arrivedAt).toISOString(), ...miss }).catch(() => {});
    return json(miss);
  }

  // Fill-if-blank: never overwrite a value that is already on the record.
  const patch = {};
  const skipped = [];
  for (const key of ZOHO_UTM_FIELDS) {
    if (fields[key] === undefined) continue;
    if (isBlank(lead[key])) patch[key] = fields[key];
    else skipped.push(key);
  }

  let zohoUpdated = false;
  let error = null;
  if (Object.keys(patch).length === 0) {
    // Distinguish "the record already had everything" from "the session only
    // carried fields this route is not allowed to write" (e.g. utm_source
    // alone) — otherwise the audit trail misreports why nothing happened.
    error = skipped.length ? "already_filled" : "nothing_to_write";
  } else {
    try {
      await updateZohoRecord(moduleName, lead.id, patch);
      zohoUpdated = true;
    } catch (err) {
      console.error("attribution_zoho_update_failed:", err.message);
      error = "zoho_update_failed";
      await releaseClaim(claimed.sid).catch(() => {});
    }
  }

  const result = {
    ...base,
    success: error !== "zoho_update_failed",
    zoho_lead_id: lead.id,
    zoho_updated: zohoUpdated,
    fields_written: Object.keys(patch).join(","),
    fields_skipped: skipped.join(","),
    ...(error ? { error } : {}),
  };

  // Only remember outcomes that actually landed — a failed write must stay
  // retryable.
  if (error !== "zoho_update_failed") {
    await rememberClaim(mobileHash, result).catch((err) =>
      console.error("attribution_remember_failed:", err.message)
    );
  }
  await pushAudit({
    at: new Date(arrivedAt).toISOString(),
    created_at_raw: clean(createdAtRaw) || null,
    ...result,
  }).catch(() => {});

  return json(result);
}
