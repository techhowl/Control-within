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
  const wantsRedirect = url.searchParams.get("redirect") === "1";
  const cookieStore = await cookies();
  const journeyId =
    url.searchParams.get("journey_id") || cookieStore.get(JOURNEY_COOKIE)?.value;

  // Opening WhatsApp is the whole point of the click, so it must always
  // succeed — exactly like the plain wa.me links elsewhere on the site. The
  // journey lookup, consent stamp, and cta_click log are best-effort
  // enrichment layered on top: when a journey resolves we append its short_ref
  // (so Interakt/Zoho can stitch the chat back) and record consent, but any
  // failure there falls through to the plain deep link rather than dead-ending
  // the user on a JSON error page.
  let shortRef = null;
  if (journeyId) {
    try {
      const journey = await getJourney(journeyId);
      if (journey && !journey.erased_at) {
        shortRef = journey.short_ref;
        if (url.searchParams.get("consent") === "1" && !journey.consent_at) {
          await getSupabase()
            .from("journeys")
            .update({ consent_at: new Date().toISOString() })
            .eq("journey_id", journeyId);
        }
        await logEvent(journeyId, "cta_click", { target: "whatsapp_handoff" });
      }
    } catch (err) {
      console.error("whatsapp_handoff_enrich_failed:", err.message);
    }
  }

  const text = shortRef ? `${DEFAULT_MESSAGE} [${shortRef}]` : DEFAULT_MESSAGE;
  const waUrl = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  if (wantsRedirect) {
    return Response.redirect(waUrl, 302);
  }
  return Response.json({ url: waUrl, short_ref: shortRef });
}
