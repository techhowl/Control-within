"use client";

import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Implant page — Section 4: "The Process".
 * A 5-step carousel. Shows up to 4 cards per view on desktop and slides
 * one card at a time; fewer cards per view on smaller screens.
 */
const STEPS = [
  {
    title: "Consultation",
    body: "Your gynaecologist reviews your health history, cycle details, and any conditions.",
    image: "/IUS-process-1.webp",
  },
  {
    title: "Prep",
    body: "You lie down comfortably. The doctor performs a pelvic exam and determines the size and position of the uterus. A speculum is gently placed, the cervix is cleaned and stabilized.",
    image: "/ius_process_2.png",
  },
  {
    title: "Insertion",
    body: "The doctor measures the depth and direction of the cervical canal and uterine cavity. The IUS is gently guided through the cervix into the uterus, the applicator removed, and the threads are trimmed.During insertion, most women feel a sharp, intense cramp that lasts about 30 to 90 seconds — the time it takes to place the device.",
    image: "/ius_process_3.png",
  },
  {
    title: "Confirmation",
    body: "The doctor checks placement. Two thin strings remain in the cervix (not visible externally).",
    image: "/ius_process_4.png",
  },
  {
    title: "Recovery",
    body: "The cramping fades to a dull ache for a few hours, similar to the first day of a period. Some cramping and light spotting for a day or two is normal. You can resume normal activity the same day.",
    image: "/IUS-process-5.png",
  },
];

export default function Process() {
  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);

  // Responsive cards-per-view.
  useEffect(() => { 
    const update = () => {
      const w = window.innerWidth;
      setPerView(w < 640 ? 1 : w < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, STEPS.length - perView);
  const clamped = Math.min(index, maxIndex);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <section id="implant-process" className="bg-surface py-10 md:py-20">
      <div className="mx-auto w-full px-[5%]">
        <div className="text-center">
          <span className="text-xm font-semibold uppercase tracking-[0.18em] text-accent">
            The Process
          </span>
          <h2 className="mx-auto mt-3 max-w-2xl font-clash text-3xl font-semibold text-dark md:text-4xl">
            Experience 5 Years Of Control With A Few Simple Steps.
          </h2>
        </div>

        {/* Carousel — full-width lavender panel */}
        <div className="relative mt-12 rounded-[2rem] bg-[#E9E5F3] p-5 md:p-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${clamped * (100 / perView)}%)` }}
            >
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="flex-none px-2.5 md:px-3"
                  style={{ width: `${100 / perView}%` }}
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#FBF7F2] shadow-soft">
                    <div className="flex-1 p-6 md:p-7">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <h3 className="mt-5 text-base font-bold uppercase tracking-wide text-dark">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {step.body}
                      </p>
                    </div>
                    <div className="h-52 overflow-hidden bg-surface md:h-64">
                      <img
                        src={step.image}
                        alt={`Step ${i + 1}: ${step.title}`}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Floating controls */}
          <button
            type="button"
            onClick={prev}
            disabled={clamped === 0}
            aria-label="Previous step"
            className="absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-dark shadow-soft transition-all hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-0"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            disabled={clamped >= maxIndex}
            aria-label="Next step"
            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-surface text-dark shadow-soft transition-all hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-0"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-base text-muted md:text-lg">
            You can reach your doctor any time with questions.
          </p>
          <WhatsAppButton className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-teal-hover">
            Chat On WhatsApp <span aria-hidden="true">→</span>
          </WhatsAppButton>
        </div>
      </div>
    </section>
  );
}
