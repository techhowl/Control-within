import { cookies } from "next/headers";
import {
  JOURNEY_COOKIE,
  COOKIE_MAX_AGE,
  createJourney,
  getJourney,
  logEvent,
  newShortRef,
  pickJourneyFields,
} from "@/lib/journey";
import { createZohoRecord, updateZohoRecord } from "@/lib/zoho";

// Client-readable companion to cw_journey: holds the chatId (= short_ref) so
// WhatsAppButton can embed it in the prefilled message without an extra fetch.
// NOT httpOnly on purpose — the ref is a non-secret stitch id, not a credential.
const CHAT_COOKIE = "cw_chat";
// Holds the created Zoho Lead record id so a later call (QR geolocation) can
// patch the visitor's Latitude/Longitude onto the same Lead.
const LEAD_COOKIE = "cw_lead";

// Address - Latitude/Longitude are double fields; browser geolocation is
// higher precision than needed. 6 dp ≈ 0.1 m.
function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}
function coord(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? round6(n) : null;
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function trimField(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v.slice(0, 256) : null;
}

/**
 * POST /api/lead
 * Attribution capture for paid + QR arrivals. Mints (or resumes) a journey to
 * get a unique 8-char chatId (= short_ref), then best-effort creates a Zoho
 * Leads record carrying the UTM params. One Lead per visitor: on a resumed
 * journey we skip the Zoho write and just return the existing chatId.
 *
 * Body (all optional): { utm_source, utm_medium, utm_campaign, utm_content,
 *                        utm_term, placement, platform, src, entry_path }
 * Returns: { chatId, resumed }
 */
export async function POST(request) {
  const cookieStore = await cookies();
  const body = await readBody(request);

  // The journeys table only has utm_source/medium/creative columns; fold the
  // richer paid params into utm_creative so the journey still carries context.
  const journeyBody = {
    entry_path: body?.entry_path ?? "/",
    utm_source: body?.utm_source,
    utm_medium: body?.utm_medium,
    utm_creative: body?.utm_content || body?.utm_campaign || body?.src,
  };

  // Visitor coordinates (QR journey only — sent later on geolocation success).
  const lat = coord(body?.lat, -90, 90);
  const lng = coord(body?.lng, -180, 180);
  const zohoModule = process.env.ZOHO_LEADS_MODULE || "Leads";

  let chatId = null;
  let resumed = false;
  let leadId = null;

  try {
    const existingId = cookieStore.get(JOURNEY_COOKIE)?.value;
    if (existingId) {
      const existing = await getJourney(existingId);
      if (existing && !existing.erased_at) {
        chatId = existing.short_ref;
        resumed = true;
        await logEvent(existing.journey_id, "repeat_visit", pickJourneyFields(journeyBody));
      }
    }

    if (!resumed) {
      const journey = await createJourney(pickJourneyFields(journeyBody));
      chatId = journey.short_ref;
      cookieStore.set(JOURNEY_COOKIE, journey.journey_id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
      await logEvent(journey.journey_id, "page_view", { entry_path: journeyBody.entry_path });
    }
  } catch (err) {
    // Supabase down / misconfigured — still hand back a chatId so WhatsApp and
    // the client flow never dead-end. This visit just won't be journey-stitched.
    console.error("lead_journey_failed:", err.message);
    chatId = newShortRef();
    resumed = false;
  }

  // Expose the chatId to the client (readable cookie) for the WhatsApp message.
  cookieStore.set(CHAT_COOKIE, chatId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  if (!resumed) {
    // --- First visit: create the Lead (best-effort; one Lead per visitor) ---
    const record = {
      // Last_Name is Zoho's mandatory primary field; we have no real name yet,
      // so the chatId doubles as the dummy last name (also stored in Chat_ID).
      Last_Name: chatId,
      Chat_ID: chatId,
      UTM_Source: trimField(body?.utm_source),
      UTM_Medium: trimField(body?.utm_medium),
      UTM_Campaign: trimField(body?.utm_campaign),
      UTM_Content: trimField(body?.utm_content),
      UTM_Term: trimField(body?.utm_term),
      Placement: trimField(body?.placement),
      Platform: trimField(body?.platform),
      Src: trimField(body?.src),
      // Coordinates are usually absent at creation (arrive later on QR
      // geolocation); include them if already known so no update is needed.
      Latitude: lat,
      Longitude: lng,
    };
    try {
      leadId = await createZohoRecord(zohoModule, record);
      if (leadId) {
        // Remember the Lead id so a later geolocation call can patch its coords.
        cookieStore.set(LEAD_COOKIE, leadId, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: COOKIE_MAX_AGE,
        });
      }
    } catch (err) {
      // A CRM outage must not block the visitor; the chatId is already set.
      console.error("lead_zoho_write_failed:", err.message);
    }
  } else if (lat !== null && lng !== null) {
    // --- Repeat call carrying coordinates (QR geolocation) → patch the Lead ---
    leadId = body?.leadId || cookieStore.get(LEAD_COOKIE)?.value || null;
    if (leadId) {
      try {
        await updateZohoRecord(zohoModule, leadId, { Latitude: lat, Longitude: lng });
      } catch (err) {
        console.error("lead_zoho_geo_update_failed:", err.message);
      }
    }
  }

  return Response.json({ chatId, resumed, leadId });
}
