"use client";
import { useState } from "react";

/**
 * Implant page — Section 3: "Should You Take The Implant?".
 * A grid of relatable statements. Clicking a card flips it (3D rotateY) to
 * reveal how the implant solves that concern. Same interaction on every
 * breakpoint. Cards are a fixed size so a flip never shifts its neighbours.
 */
const PILLS = [
  {
    text: "My periods are so heavy I have to plan my life around them",
    response:
      "Reduces menstrual blood loss by up to 90%. Your period stops running the calendar.",
    icon: "🩸",
  },
  {
    text: "I have severe cramps that painkillers barely touch",
    response:
      "It doesn’t just mask the pain, it reduces menstrual cramps at the source.",
    icon: "😣",
  },
  {
    text: "I've been diagnosed with endometriosis or suspected it",
    response: "Suppresses the tissue growth that causes endometriosis pain.",
    icon: "🩺",
  },
  {
    text: "I experience extreme, lingering tiredness and exhaustion every month",
    response: "Heavy bleeding causes iron loss. The hIUS reduces blood loss.",
    icon: "😴",
  },
  {
    text: "I need long-term contraception without daily effort",
    response:
      "One insertion. Five years of protection. Nothing to track or remember.",
    icon: "📅",
  },
  {
    text: "I want to space out pregnancies, but not close a door permanently",
    response: "Fully reversible. Remove it when you're ready.",
    icon: "🤰",
  },
  {
    text: "I've been told surgery might be the next step for my periods but I want to explore non-surgical alternatives",
    response: "The hIUS is a clinically endorsed, non-surgical alternative.",
    icon: "🏥",
  },
  {
    text: "I'm tired of just regularly taking prescribed painkillers for period pain",
    response: "Painkillers manage symptoms. The hIUS addresses the cause.",
    icon: "💊",
  },
];

export default function Relate() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="implant-relate" className="bg-surface py-10 md:py-2">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* ── Heading ── */}
        <div className="text-center">
          <span className="text-xm font-bold uppercase tracking-[0.18em] text-[#614D92] md:text-base">
            No problem is too small
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#333] md:text-4xl">
            Tap to see how the hIUS solves for it
          </h2>
        </div>

        {/* ── Flip pills ── content-width pills wrap and centre, giving the
            organic zigzag placement. Each flips on click; both faces share one
            grid cell so the pill sizes to whichever face is wider (both fit). ── */}
        <div className="mt-14 flex flex-wrap justify-center gap-3 md:gap-x-5 md:gap-y-5">
          {PILLS.map((pill, i) => {
            const active = activeIndex === i;

            return (
              <button
                key={i}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveIndex(active ? null : i)}
                className="cursor-pointer rounded-full perspective-distant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#614D92]/40 focus-visible:ring-offset-2"
              >
                {/* Rotating inner — both faces stacked in one grid cell */}
                <div
                  className={`grid transition-transform duration-900 ease-in-out transform-3d ${
                    active ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front — the concern */}
                  <div className="col-start-1 row-start-1 inline-flex max-w-[16rem] items-center gap-2.5 rounded-3xl bg-[#E6E2F1] px-5 py-3 text-left text-xs font-medium text-[#614D92] backface-hidden md:max-w-[20rem] md:px-7 md:py-4 md:text-sm">
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 text-xl leading-none md:inline-block"
                    >
                      {pill.icon}
                    </span>
                    <span>&ldquo;{pill.text}&rdquo;</span>
                  </div>

                  {/* Back — how the hIUS solves it */}
                  <div className="col-start-1 row-start-1 inline-flex max-w-[16rem] items-center justify-center rounded-3xl bg-[#614D92] px-5 py-3 text-center text-xs font-medium text-white shadow-lg shadow-[#614D92]/20 backface-hidden rotate-y-180 md:max-w-[20rem] md:px-7 md:py-4 md:text-sm">
                    <span>{pill.response}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}