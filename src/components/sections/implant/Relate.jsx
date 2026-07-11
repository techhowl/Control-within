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
    text: "I keep forgetting my pill or worrying I missed one.",
    response: "Implants require a one-time procedure. No daily stress.",
    icon: "/calender.png",
  },
  {
    text: "Contraception takes up too much mental space.",
    response: "Once inserted, you can forget about it. No more worrying.",
    icon: "/brain.png",
  },
  // {
  //   text: "I'm worried about taking long-term contraceptives pre-marriage.",
  //   response: "Easily removable and fertility returns quickly.",
  //   icon: "/sad.png",
  // },
  {
    text: "I want something that doesn't depend on my partner",
    response: "It's in your body. The control stays with you.",
    icon: "/couple.png",
  },
  {
    text: "I want to delay pregnancy, but not permanently",
    response: "Reversible, it fits your family planning schedule.",
    icon: "/time.png",
  },
  {
    text: "I just had a baby and need reliable protection",
    response: "The implant is safe for breastfeeding mothers.",
    icon: "/shield.png",
  },
  {
    text: "I just had a miscarriage and don't want to have another pregnancy soon",
    response: "Up to 3 years of protection. Take the time you need, on your terms.",
    icon: "/disappointed.png",
  },
  {
    text: "I'm too busy to manage something daily",
    response: "10 minutes once. Then it just works, while you live your life.",
    icon: "/hourglass.png",
  },
  {
    text: "I want something private",
    response: "Invisible under the skin. No packaging or constant pharmacy run.",
    icon: "/lock.png",
  },
  {
    text: "I can't or don't want to use oestrogen-based methods",
    response: "Suitable for women who don't prefer oestrogen.",
    icon: "/syringe.png",
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
            Tap to see how the implant solves for it
          </h2>
        </div>

        {/* ── Flip pills ── content-width pills wrap and centre, giving the
            organic zigzag placement. Each flips on click; both faces share one
            grid cell so the pill sizes to whichever face is wider (both fit). ── */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-x-5 md:gap-y-5">
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
                  <div className="col-start-1 row-start-1 inline-flex items-center gap-2.5 rounded-full bg-[#E6E2F1] px-5 py-3 text-left text-sm font-medium text-[#614D92] backface-hidden md:whitespace-nowrap md:px-7 md:py-4 md:text-sm">
                    <img
                      src={pill.icon}
                      alt=""
                      aria-hidden="true"
                      className="hidden shrink-0 object-contain md:inline-block md:h-6 md:w-6"
                    />
                    <span>&ldquo;{pill.text}&rdquo;</span>
                  </div>

                  {/* Back — how the implant solves it */}
                  <div className="col-start-1 row-start-1 inline-flex items-center justify-center rounded-full bg-[#614D92] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#614D92]/20 backface-hidden rotate-y-180 md:whitespace-nowrap md:px-7 md:py-4 md:text-sm">
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