import crypto from "node:crypto";
import { getValkey, K } from "@/lib/valkey";

/**
 * GET /api/attribution/debug?key=<ATTRIBUTION_API_KEY>
 *
 * Recent claim outcomes plus live counts. Exists so the matching windows can be
 * tuned against real traffic (compare `lag_sec` across real leads, then adjust
 * ATTR_CREATED_EXPECTED_LAG_SEC) without digging through container logs.
 */

// Reads the query string, so it must never be prerendered.
export const dynamic = "force-dynamic";

function authorized(request) {
  const expected = process.env.ATTRIBUTION_API_KEY;
  if (!expected) return false;
  const got = new URL(request.url).searchParams.get("key") || "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(request) {
  if (!authorized(request)) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const r = getValkey();
    const [raw, liveSessions] = await Promise.all([
      r.lrange(K.audit, 0, 49),
      r.zcard(K.anchor),
    ]);

    const entries = raw.map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { unparseable: line };
      }
    });

    return Response.json({
      success: true,
      live_sessions: liveSessions,
      window: {
        stale_sec: Number(process.env.ATTR_STALE_SEC || 900),
        created_max_lag_sec: Number(process.env.ATTR_CREATED_MAX_LAG_SEC || 600),
        created_expected_lag_sec: Number(process.env.ATTR_CREATED_EXPECTED_LAG_SEC || 25),
        arrival_min_lag_sec: Number(process.env.ATTR_ARRIVAL_MIN_LAG_SEC || 10),
        arrival_max_lag_sec: Number(process.env.ATTR_ARRIVAL_MAX_LAG_SEC || 420),
        arrival_expected_lag_sec: Number(process.env.ATTR_ARRIVAL_EXPECTED_LAG_SEC || 70),
      },
      entries,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: "valkey_unavailable", message: err.message },
      { status: 200 }
    );
  }
}
