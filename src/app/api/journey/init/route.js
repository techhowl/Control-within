import { cookies } from "next/headers";
import {
  JOURNEY_COOKIE,
  COOKIE_MAX_AGE,
  createJourney,
  getJourney,
  logEvent,
  pickJourneyFields,
} from "@/lib/journey";

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/**
 * POST /api/journey/init
 * Creates (or resumes) a journey and stamps an httpOnly cookie.
 * Body (all optional): { entry_path, profile_hint, age_band, gender,
 *                        utm_source, utm_medium, utm_creative }
 * Returns: { journey_id, short_ref, resumed }
 */
export async function POST(request) {
  const cookieStore = await cookies();
  const body = await readBody(request);

  try {
    // Resume an existing, non-erased journey if the cookie is still valid.
    const existingId = cookieStore.get(JOURNEY_COOKIE)?.value;
    if (existingId) {
      const existing = await getJourney(existingId);
      if (existing && !existing.erased_at) {
        await logEvent(existing.journey_id, "repeat_visit", pickJourneyFields(body));
        return Response.json({
          journey_id: existing.journey_id,
          short_ref: existing.short_ref,
          resumed: true,
        });
      }
    }

    // Otherwise mint a fresh journey.
    const { journey_id, short_ref } = await createJourney(pickJourneyFields(body));

    cookieStore.set(JOURNEY_COOKIE, journey_id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    await logEvent(journey_id, "page_view", {
      entry_path: body?.entry_path ?? null,
    });

    return Response.json({ journey_id, short_ref, resumed: false });
  } catch (err) {
    return Response.json(
      { error: "journey_init_failed", message: err.message },
      { status: 500 }
    );
  }
}
