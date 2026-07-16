"use client";

import { useEffect } from "react";

export default function VideoModal({ open, title, lang = "en", videoUrl, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-dark/70 p-4 backdrop-blur-sm animate-[fadeUp_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-surface shadow-hover bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/70 backdrop-blur-md"
        >
          ✕
        </button>

        {videoUrl ? (
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`${videoUrl}?autoplay=1&rel=0`}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent/15 to-teal-deep/10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-soft">
              <svg viewBox="0 0 24 24" className="h-7 w-7 ml-1" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <p className="px-6 font-clash text-lg font-semibold text-dark">{title}</p>
            <p className="text-sm text-muted">
              {lang === "hi" ? "हिंदी संस्करण जल्द आ रहा है" : "English version coming soon"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}