"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { customAlphabet } from "nanoid";
import { CAMPAIGN_FIELDS, storeParams } from "@/lib/campaign";

/**
 * Invisible attribution capture.
 *
 * Mints a session id on first arrival, keeps it in localStorage, and reports
 * the landing (plus any campaign params) to /api/attribution/session. The
 * server stamps the time. When the visitor later leaves for WhatsApp,
 * <WhatsAppButton/> pings the same session id with a `wa_click` event, and
 * /api/attribution/claim matches that moment against Interakt's Created_at to
 * attribute the Lead.
 *
 * Every landing is reported, not only campaign ones: an organic session that
 * goes unrecorded can be mistaken for someone else's paid session inside the
 * matching window.
 *
 * Renders nothing. Must sit inside a <Suspense> boundary (useSearchParams).
 */

export const SID_KEY = "cw_sid";

const nano = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

/** Stable per-browser session id, created on first visit. */
export function getSessionId() {
  if (typeof window === "undefined") return null;
  try {
    let sid = window.localStorage.getItem(SID_KEY);
    if (!sid) {
      sid = nano();
      window.localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    // Private mode / storage disabled — attribution degrades, nothing breaks.
    return null;
  }
}

export default function LeadCapture() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const sid = getSessionId();
    if (!sid) return;

    const params = {};
    for (const field of CAMPAIGN_FIELDS) {
      const v = searchParams.get(field);
      if (v) params[field] = v;
    }

    // Keep the campaign for the rest of the visit, so the WhatsApp button still
    // knows where this person came from after they click through to another
    // page and the params drop off the URL. Only written when the landing
    // actually carried a campaign — an organic view must not wipe it.
    storeParams(params);

    fetch("/api/attribution/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sid,
        event: "land",
        ...params,
        entry_path: pathname || "/",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [searchParams, pathname]);

  return null;
}
