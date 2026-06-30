"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import VideoModal from "@/components/ui/VideoModal";

const VIDEOS = [
  {
    theme: "purple",
    title: "What is a Contraceptive Implant",
    desc: "A short walkthrough of how the implant works and what to expect.",
  },
  {
    theme: "teal",
    title: "What is an hIUS",
    desc: "Understand how the hormonal IUS protects and eases your periods.",
  },
];

export default function Videos() {
  const [active, setActive] = useState(null);

  return (
    <section id="videos" className="bg-dark py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            Watch &amp; Learn
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-white md:text-5xl">
            Different Processes. Different Purposes. One Goal: Control.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {VIDEOS.map((video, i) => {
            const grad =
              video.theme === "purple"
                ? "from-accent/40 to-accent/10"
                : "from-teal-deep/40 to-teal-deep/10";
            return (
              <Reveal key={video.title} delay={(i + 1) * 80}>
                <button
                  type="button"
                  onClick={() => setActive(video.title)}
                  aria-label={`Play: ${video.title}`}
                  className={`group relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-7 text-left ${grad}`}
                >
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-hover transition-transform group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <div className="relative">
                    <h3 className="font-clash text-xl font-semibold text-white">
                      {video.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/80">{video.desc}</p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <VideoModal open={active !== null} title={active} onClose={() => setActive(null)} />
    </section>
  );
}
