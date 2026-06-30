import { cookies } from "next/headers";
import { JOURNEY_COOKIE } from "@/lib/journey";
import { getSupabase } from "@/lib/supabase";

/**
 * POST /api/journey/erase
 * DPDP right-to-erasure. Hard-deletes the journey row; the FK ON DELETE CASCADE
 * wipes all of its events too. Clears the cookie so the next visit starts fresh.
 * Body (optional): { journey_id }  — falls back to the cookie.
 *
 * Phase 2: also push an erasure signal to Zoho here.
 * Returns: { ok: true, erased: boolean }
 */
export async function POST(request) {
  const cookieStore = await cookies();

  let bodyId;
  try {
    bodyId = (await request.json())?.journey_id;
  } catch {
    bodyId = undefined;
  }

  const journeyId = cookieStore.get(JOURNEY_COOKIE)?.value || bodyId;

  // Always clear the cookie, even if there's nothing to delete.
  cookieStore.delete(JOURNEY_COOKIE);

  if (!journeyId) {
    return Response.json({ ok: true, erased: false });
  }

  try {
    const { error, count } = await getSupabase()
      .from("journeys")
      .delete({ count: "exact" })
      .eq("journey_id", journeyId);

    if (error) throw new Error(error.message);
    return Response.json({ ok: true, erased: (count ?? 0) > 0 });
  } catch (err) {
    return Response.json(
      { error: "erase_failed", message: err.message },
      { status: 500 }
    );
  }
}
