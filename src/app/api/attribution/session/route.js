import { isValidSid, pickParams, recordLand, recordWaClick } from "@/lib/attribution";

/**
 * POST /api/attribution/session
 *
 * Browser-only tracking ping for UTM attribution. Two events:
 *
 *   land      first page view — stores the campaign params for this session id
 *   wa_click  the visitor is leaving for WhatsApp — moves the session's anchor
 *             to this instant, which is what /api/attribution/claim matches on
 *
 * Body: { session_id, event, utm_source, utm_medium, utm_campaign, utm_content,
 *         utm_term, placement, platform, src, entry_path }
 *
 * Always answers 204, including when Valkey is unreachable or the body is junk.
 * A tracking ping must never surface an error to a visitor, and the wa_click
 * ping fires via sendBeacon during navigation where nothing reads the response.
 *
 * Timestamps are taken here, server-side. Client clocks are not trusted.
 */

const noContent = () => new Response(null, { status: 204 });

export async function POST(request) {
  try {
    const body = await request.json();
    const sid = body?.session_id;
    if (!isValidSid(sid)) return noContent();

    const params = pickParams(body);

    if (body?.event === "wa_click") {
      await recordWaClick(sid, params);
    } else {
      await recordLand(sid, params);
    }
  } catch (err) {
    // Bad JSON, Valkey down, anything — swallow it. Attribution is best-effort.
    console.error("attribution_session_failed:", err?.message);
  }

  return noContent();
}
