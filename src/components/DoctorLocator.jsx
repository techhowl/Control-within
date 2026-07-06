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

  const [open, setOpen] = useState(false);
  // status: "idle" | "locating" | "saving" | "error"
  const [status, setStatus] = useState("idle");
  const journeyStarted = useRef(false);

  // Auto-open on QR arrival, and start a journey so the locator event stitches
  // to the same visitor.
  useEffect(() => {
    if (!isQr || journeyStarted.current) return;
    journeyStarted.current = true;
    setOpen(true);
    fetch("/api/journey/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry_path: "/", utm_source: "qr", utm_creative: src }),
    }).catch(() => {});
  }, [isQr, src]);

  const submit = useCallback(
    async (payload) => {
      setStatus("saving");
      try {
        const res = await fetch("/api/locate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, src }),
        });
        if (!res.ok) throw new Error("failed");
        // Stored in CRM — close the modal so the visitor sees the home page.
        setOpen(false);
      } catch {
        setStatus("error");
      }
    },
    [src]
  );

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => submit({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setStatus("error"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [submit]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share your location"
    >
      <div className="relative w-full max-w-md rounded-[2rem] bg-surface p-7 shadow-hover md:p-9">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-5 top-5 text-2xl leading-none text-muted transition-colors hover:text-dark"
        >
          ×
        </button>

        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Find a doctor
        </span>

        {/* --- Ask for location --- */}
        {(status === "idle" || status === "locating") && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">
              Find a gynaecologist near you
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Share your location and we’ll connect you with the closest trained
              doctor.
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
          </>
        )}

        {/* --- Saving --- */}
        {status === "saving" && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">One moment…</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">Saving your location.</p>
          </>
        )}

        {/* --- Error / denied --- */}
        {status === "error" && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">
              We couldn’t read your location
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Please allow location access and try again.
            </p>
            <button
              type="button"
              onClick={requestLocation}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-center text-sm text-muted underline underline-offset-4 hover:text-dark"
            >
              Skip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
