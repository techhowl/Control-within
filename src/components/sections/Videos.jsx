"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import VideoModal from "@/components/ui/VideoModal";

const VIDEOS = [
  {
    theme: "purple",
    title: "What is a Contraceptive Implant",
    img: "/video_cover_implant.jpg",
    sources: { en: "https://www.youtube.com/embed/chLNL-Gtre4" }
  },
  {
    theme: "teal",
    title: "What is an hIUS",
    img: "/video_cover_IUS.jpg",
    sources: {}
  },
];

const LANGS = [
  ["en", "English"],
  ["hi", "हिंदी"],
];

const Play = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function Videos() {
  const [lang, setLang] = useState("en");
  const [active, setActive] = useState(null);

  return (
    <section id="videos" className="bg-accent py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        {/* Header: headline + language toggle (top-right) */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <Reveal className="max-w-2xl">
            <h2 className="font-clash text-3xl font-semibold text-white md:text-5xl">
              Different Processes. Different Purposes.<br /> One Goal: Control.
            </h2>
          </Reveal>

          <div className="inline-flex shrink-0 rounded-full bg-white/10 p-1" role="group" aria-label="Video language">
            {LANGS.map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  lang === code ? "bg-white text-dark" : "text-white/70 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {VIDEOS.map((video, i) => {
            const grad = "from-teal-deep/40 to-teal-deep/10";
            
            // DYNAMIC CHECK: Check if a URL exists for the current language
            const isAvailable = !!video.sources?.[lang];

            if (!isAvailable) {
              return (
                <Reveal key={video.title} delay={(i + 1) * 80}>
                  <div
                    className={`relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-linear-to-br p-7 text-left ${grad}`}
                  >
                    <img
                      src={video.img}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-dark/45" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                      Coming soon
                    </span>
                    <h3 className="relative font-clash text-xl font-semibold text-white/90">
                      {video.title}
                    </h3>
                  </div>
                </Reveal>
              );
            }

            return (
              <Reveal key={video.title} delay={(i + 1) * 80}>
                <button
                  type="button"
                  onClick={() => setActive(video.title)}
                  aria-label={`Play: ${video.title}`}
                  className={`group relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-linear-to-br p-7 text-left ${grad}`}
                >
                  <img
                    src={video.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-hover transition-transform group-hover:scale-110">
                    <Play />
                  </span>
                  <h3 className="relative font-clash text-xl font-semibold text-white">
                    {video.title}
                  </h3>
                  <p className="relative mt-1.5 text-sm text-white/80">
                    {lang === "hi" ? "हिंदी" : "English"}
                  </p>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <VideoModal
        open={active !== null}
        title={active}
        lang={lang}
        videoUrl={active ? VIDEOS.find(v => v.title === active)?.sources?.[lang] : null}
        onClose={() => setActive(null)}
      />
    </section>
  );
}