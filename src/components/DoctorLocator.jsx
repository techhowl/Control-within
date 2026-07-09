"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Auto-opening location-capture modal.
 *
 * When a visitor lands on the home page from a printed QR (URL carries
 * ?src=qr_connexi_campaign), this pops a modal that asks only for the browser
 * location. On share, it POSTs to /api/locate — which stores an anonymous
 * record in the Zoho CRM — then closes so the visitor sees the normal home
 * page. No doctor details or chat CTA are shown. Visitors without the QR tag
 * never see it.
 *
 * Must be rendered inside a <Suspense> boundary (useSearchParams requirement).
 */
export default function DoctorLocator() {
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const isQr = typeof src === "string" && src.startsWith("qr");
  // QR links carry the real campaign params (utm_source=clinic|chemist,
  // utm_medium=scan, utm_campaign=qrcode) — forward them to the Lead.
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");

  const [open, setOpen] = useState(false);
  // status: "idle" | "locating" | "error"
  const [status, setStatus] = useState("idle");
  const journeyStarted = useRef(false);
  // Zoho Lead id returned by the arrival /api/lead call — used to patch the
  // visitor's coordinates onto the same Lead once geolocation resolves.
  const leadIdRef = useRef(null);

  // Auto-open on QR arrival, and create the Lead (mints chatId + starts the
  // journey) so the locator event and the WhatsApp chatId stitch to the same
  // visitor: chatId → lead → locate.
  useEffect(() => {
    if (!isQr || journeyStarted.current) return;
    journeyStarted.current = true;
    setOpen(true);
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry_path: "/",
        utm_source: utmSource || "qr",
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        src,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        leadIdRef.current = d?.leadId ?? null;
      })
      .catch(() => {});
  }, [isQr, src, utmSource, utmMedium, utmCampaign]);

  // Close the modal and jump the visitor to the contraceptive-implant videos.
  const goToVideos = useCallback(() => {
    setOpen(false);
    if (typeof document === "undefined") return;
    document.getElementById("videos")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const submit = useCallback(
    (payload) => {
      // Fire-and-forget: the CRM write runs in the background so the visitor is
      // never blocked on Zoho's token refresh + insert. keepalive lets it finish
      // even though we navigate away immediately. Same-page scroll keeps the tab
      // alive, so the request completes regardless.
      fetch("/api/locate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, src, utm_source: utmSource }),
        keepalive: true,
      }).catch(() => {});
      // Patch the visitor's coordinates onto their Lead (Address Latitude/
      // Longitude). resumed:true path in /api/lead runs the Zoho update.
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: payload.lat,
          lng: payload.lng,
          leadId: leadIdRef.current,
        }),
        keepalive: true,
      }).catch(() => {});
      goToVideos();
    },
    [src, utmSource, goToVideos]
  );

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      goToVideos();
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => submit({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      // Denied / timed out / any error → still take the visitor to the videos.
      (err) => {
        console.error("geolocation_failed:", err.code, err.message, "secureContext:", window.isSecureContext);
        goToVideos();
      },
      // maximumAge:0 forces a live read every time — never silently reuses a
      // cached fix — so the browser/OS location prompt always fires. Longer
      // timeout gives the user time to respond to that system dialog.
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, [submit, goToVideos]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share your location"
    >
      <div className="relative w-full max-w-md rounded-[2rem] bg-surface p-7 shadow-hover md:p-9">
        {/* Any dismissal (× or Skip) still takes the visitor to the videos. */}
        <button
          type="button"
          onClick={goToVideos}
          aria-label="Close"
          className="absolute right-5 top-5 text-2xl leading-none text-muted transition-colors hover:text-dark"
        >
          ×
        </button>

        <h2 className="mt-3 text-2xl font-semibold text-dark">
          Get to know more about contraceptive implants
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Start your journey towards experiencing control within
        </p>
        <button
          type="button"
          onClick={requestLocation}
          disabled={status === "locating"}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "locating" ? "Getting your location…" : "Share my location"}
          {status !== "locating" && <span aria-hidden="true">→</span>}
        </button>
        <button
          type="button"
          onClick={goToVideos}
          className="mt-3 w-full text-center text-sm text-muted underline underline-offset-4 hover:text-dark"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
