import { cookies } from "next/headers";
import { JOURNEY_COOKIE, getJourney, logEvent } from "@/lib/journey";
import { getSupabase } from "@/lib/supabase";

const DEFAULT_MESSAGE =
  "Hi! I'd like to know more about long-term, reversible contraception options.";

/**
 * GET /api/whatsapp/handoff
 * Builds the wa.me deep link, embedding the journey's short_ref in delimiters
 * (e.g. [h7k2q9]) so Interakt/Zoho can stitch the conversation back later.
 *
 * Query params:
 *   journey_id  optional — falls back to the cookie
 *   consent=1   optional — stamps consent_at (DPDP opt-in at the WhatsApp step)
 *   redirect=1  optional — 302 to WhatsApp instead of returning JSON
 *
 * Returns (default): { url, short_ref }
 */
export async function GET(request) {
  const number = process.env.WHATSAPP_NUMBER;
  if (!number) {
    return Response.json(
      { error: "whatsapp_not_configured", message: "Set WHATSAPP_NUMBER in .env.local." },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const cookieStore = await cookies();
  const journeyId =
    url.searchParams.get("journey_id") || cookieStore.get(JOURNEY_COOKIE)?.value;

  if (!journeyId) {
    return Response.json({ error: "no_journey" }, { status: 400 });
  }

  try {
    const journey = await getJourney(journeyId);
    if (!journey || journey.erased_at) {
      return Response.json({ error: "unknown_journey" }, { status: 404 });
    }

    // Record explicit consent if the click came from the opt-in CTA.
    if (url.searchParams.get("consent") === "1" && !journey.consent_at) {
      await getSupabase()
        .from("journeys")
        .update({ consent_at: new Date().toISOString() })
        .eq("journey_id", journeyId);
    }

    await logEvent(journeyId, "cta_click", { target: "whatsapp_handoff" });

    const text = `${DEFAULT_MESSAGE} [${journey.short_ref}]`;
    const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

    if (url.searchParams.get("redirect") === "1") {
      return Response.redirect(waUrl, 302);
    }
    return Response.json({ url: waUrl, short_ref: journey.short_ref });
  } catch (err) {
    return Response.json(
      { error: "handoff_failed", message: err.message },
      { status: 500 }
    );
  }
}
