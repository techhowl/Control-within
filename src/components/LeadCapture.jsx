"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Invisible attribution capture for paid arrivals.
 *
 * When a visitor lands with campaign params (utm_*, placement, platform), this
 * POSTs to /api/lead — which mints an 8-char chatId, creates a Zoho Lead, and
 * drops the client-readable `cw_chat` cookie so the WhatsApp buttons can embed
 * the chatId in their prefilled message.
 *
 * QR arrivals (?src=qr...) are owned by <DoctorLocator/>, which calls /api/lead
 * itself as part of its modal → geolocation → locate sequence. We skip them
 * here to avoid a duplicate Lead.
 *
 * Renders nothing. Must sit inside a <Suspense> boundary (useSearchParams).
 */
export default function LeadCapture() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    const src = searchParams.get("src");
    if (typeof src === "string" && src.startsWith("qr")) return; // QR → DoctorLocator

    const params = {
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
      utm_content: searchParams.get("utm_content"),
      utm_term: searchParams.get("utm_term"),
      placement: searchParams.get("placement"),
      platform: searchParams.get("platform"),
      src,
    };

    // Only fire when there is real attribution to capture.
    const hasAttribution = Object.values(params).some((v) => v);
    if (!hasAttribution) return;

    fired.current = true;
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...params, entry_path: pathname || "/" }),
      keepalive: true,
    }).catch(() => {});
  }, [searchParams, pathname]);

  return null;
}
