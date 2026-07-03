"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Auto-opening "find your nearest doctor" modal.
 *
 * When a visitor lands on the home page from a printed QR (URL carries
 * ?src=qr_<campaign>), this pops a modal, asks for the browser location, calls
 * POST /api/locate, and shows the single nearest doctor. Visitors without the
 * QR tag never see it. Data stored is anonymous (location + matched doctor).
 *
 * Must be rendered inside a <Suspense> boundary (useSearchParams requirement).
 */
export default function DoctorLocator() {
  const searchParams = useSearchParams();
  const src = searchParams.get("src");
  const isQr = typeof src === "string" && src.startsWith("qr");

  const [open, setOpen] = useState(false);
  // status: "idle" | "locating" | "loading" | "result" | "denied" | "error"
  const [status, setStatus] = useState("idle");
  const [doctor, setDoctor] = useState(null);
  const [cities, setCities] = useState([]);
  const [cityChoice, setCityChoice] = useState("");
  const journeyStarted = useRef(false);

  // Auto-open on QR arrival, and start a journey so the locator event + the
  // later WhatsApp handoff stitch to the same visitor.
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
      setStatus("loading");
      try {
        const res = await fetch("/api/locate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, src }),
        });
        const data = await res.json();
        if (!res.ok || !data.doctor) throw new Error(data.error || "failed");
        setDoctor(data.doctor);
        setStatus("result");
      } catch {
        setStatus("error");
      }
    },
    [src]
  );

  const loadCities = useCallback(() => {
    if (cities.length) return;
    fetch("/api/locate")
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .catch(() => {});
  }, [cities.length]);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      loadCities();
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => submit({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setStatus("denied");
        loadCities();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [submit, loadCities]);

  if (!open) return null;

  const mapsUrl = doctor
    ? `https://www.google.com/maps/dir/?api=1&destination=${doctor.lat},${doctor.lng}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Find your nearest doctor"
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
              Share your location and we’ll show you the closest trained doctor.
            </p>
            <button
              type="button"
              onClick={requestLocation}
              disabled={status === "locating"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {status === "locating" ? "Getting your location…" : "Find nearest doctor"}
              {status !== "locating" && <span aria-hidden="true">→</span>}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("denied");
                loadCities();
              }}
              className="mt-3 w-full text-center text-sm text-muted underline underline-offset-4 hover:text-dark"
            >
              Or pick your city instead
            </button>
          </>
        )}

        {/* --- Submitting --- */}
        {status === "loading" && (
          <p className="mt-6 text-sm text-muted">Finding your nearest doctor…</p>
        )}

        {/* --- Manual city fallback --- */}
        {status === "denied" && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">Pick your city</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We couldn’t read your location. Choose the nearest city and we’ll
              find a doctor there.
            </p>
            <select
              value={cityChoice}
              onChange={(e) => setCityChoice(e.target.value)}
              className="mt-5 w-full rounded-2xl border border-cream bg-bg px-4 py-3 text-sm text-dark focus:border-accent focus:outline-none"
            >
              <option value="">Select a city…</option>
              {cities.map((c) => (
                <option key={`${c.city}-${c.state}`} value={c.city}>
                  {c.city}
                  {c.state ? `, ${c.state}` : ""}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => cityChoice && submit({ city: cityChoice })}
              disabled={!cityChoice}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              Find doctor <span aria-hidden="true">→</span>
            </button>
          </>
        )}

        {/* --- Result --- */}
        {status === "result" && doctor && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">{doctor.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {doctor.city}
              {doctor.state ? `, ${doctor.state}` : ""}
              {typeof doctor.distance_km === "number" && (
                <span> · ~{doctor.distance_km} km away (approx.)</span>
              )}
            </p>
            {doctor.address && (
              <p className="mt-3 text-sm leading-relaxed text-dark">{doctor.address}</p>
            )}
            {/* No phone on file — the address + directions are the way to reach
                this doctor, so make that explicit instead of just dropping the
                Call button. */}
            {!doctor.phone && doctor.address && (
              <p className="mt-2 text-xs text-muted">
                Phone not listed — use the address above or get directions below.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3">
              {doctor.phone && (
                <a
                  href={`tel:${doctor.phone}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  Call {doctor.phone}
                </a>
              )}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent px-7 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/5"
              >
                Get directions
              </a>
              <a
                href="/api/whatsapp/handoff?consent=1&redirect=1"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-cream px-7 py-3.5 text-sm font-semibold text-dark transition-colors hover:bg-cream/40"
              >
                Chat on WhatsApp
              </a>
            </div>
          </>
        )}

        {/* --- Error --- */}
        {status === "error" && (
          <>
            <h2 className="mt-3 text-2xl font-semibold text-dark">Something went wrong</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              We couldn’t find a doctor just now. Please try again.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-soft"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
