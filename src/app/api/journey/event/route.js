import { cookies } from "next/headers";
import { JOURNEY_COOKIE, isValidEventType, logEvent, getJourney } from "@/lib/journey";

/**
 * POST /api/journey/event
 * Logs an event against the current journey (read from the cookie, or the
 * journey_id in the body as a fallback).
 * Body: { event_type: string, metadata?: object, journey_id?: string }
 * Returns: { ok: true }
 */
export async function POST(request) {
  const cookieStore = await cookies();

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const { event_type, metadata, journey_id: bodyId } = body ?? {};

  if (!isValidEventType(event_type)) {
    return Response.json({ error: "invalid_event_type" }, { status: 400 });
  }

  const journeyId = cookieStore.get(JOURNEY_COOKIE)?.value || bodyId;
  if (!journeyId) {
    return Response.json({ error: "no_journey" }, { status: 400 });
  }

  try {
    const journey = await getJourney(journeyId);
    if (!journey || journey.erased_at) {
      return Response.json({ error: "unknown_journey" }, { status: 404 });
    }

    await logEvent(journeyId, event_type, metadata);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: "event_log_failed", message: err.message },
      { status: 500 }
    );
  }
}
