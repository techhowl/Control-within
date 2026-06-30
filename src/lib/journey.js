import { customAlphabet } from "nanoid";
import { getSupabase } from "@/lib/supabase";

// Cookie that carries the journey_id across visits. httpOnly so the browser
// can't read it from JS — events are attributed server-side from this cookie.
export const JOURNEY_COOKIE = "cw_journey";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Unambiguous lowercase + digits (no 0/1/o/i/l). 8 chars ≈ 30^8 keyspace.
const SHORT_REF_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const nano = customAlphabet(SHORT_REF_ALPHABET, 8);

export function newShortRef() {
  return nano();
}

// Allowed event types. Kept in code (not a DB CHECK) so the list can evolve
// without a migration; the /journey/event route rejects anything not here.
export const EVENT_TYPES = [
  "page_view",
  "module_view",
  "cta_click",
  "clinic_locator_click",
  "repeat_visit",
  "path_merge",
];

export function isValidEventType(type) {
  return typeof type === "string" && EVENT_TYPES.includes(type);
}

// Only these visitor-context fields are accepted on journey creation.
const JOURNEY_FIELDS = [
  "entry_path",
  "profile_hint",
  "age_band",
  "gender",
  "utm_source",
  "utm_medium",
  "utm_creative",
];

export function pickJourneyFields(body = {}) {
  const out = {};
  for (const key of JOURNEY_FIELDS) {
    const value = body[key];
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim().slice(0, 256);
    }
  }
  return out;
}

/**
 * Create a journey row, retrying on the (extremely unlikely) short_ref
 * collision. Returns { journey_id, short_ref }.
 */
export async function createJourney(fields = {}) {
  const supabase = getSupabase();

  for (let attempt = 0; attempt < 5; attempt++) {
    const short_ref = newShortRef();
    const { data, error } = await supabase
      .from("journeys")
      .insert({ ...fields, short_ref })
      .select("journey_id, short_ref")
      .single();

    if (!error) return data;
    // 23505 = unique_violation (short_ref clash) → try a new ref.
    if (error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("Could not allocate a unique short_ref after 5 attempts.");
}

/** Fetch a journey by id, or null if missing/erased. */
export async function getJourney(journeyId) {
  if (!journeyId) return null;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("journeys")
    .select("journey_id, short_ref, consent_at, erased_at")
    .eq("journey_id", journeyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

/** Append an event to a journey. */
export async function logEvent(journeyId, eventType, metadata = {}) {
  const supabase = getSupabase();
  const { error } = await supabase.from("journey_events").insert({
    journey_id: journeyId,
    event_type: eventType,
    metadata: metadata && typeof metadata === "object" ? metadata : {},
  });
  if (error) throw new Error(error.message);
}
