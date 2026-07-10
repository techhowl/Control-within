"use client";

import { useState } from "react";

/**
 * Implant page — Section 5: "Placement Done. Now What?".
 * Three full-width flip cards. On desktop they flip on hover to reveal the
 * detail; on touch devices tapping a card toggles it (uses the .preserve-3d /
 * .rotate-y-180 / .backface-hidden utilities defined in globals.css).
 */
const CARDS = [
  {
    title: "Immediate",
    subtitle: "(First Few Days)",
    front: "bg-[#D8CDEB]",
    items: [
      "Mild bruising, swelling, or soreness at the insertion site. It settles within days",
      "The rod is small and under the skin; the area may feel slightly tender",
    ],
  },
  {
    title: "First\n1–3 Months",
    subtitle: "",
    front: "bg-[#9A8BC4]",
    items: [
      "Irregular spotting or bleeding is the most common change.",
      "Some women experience breast tenderness or mild nausea, usually temporary, settles within the first month.",
      "Periods may become lighter, irregular, or stop altogether. This is a known hormonal effect, not a health warning.",
      "Some women report headaches, mood changes, or acne. These vary by individual.",
      "Some women may develop cysts on the ovaries. These usually resolve on their own, but occasionally medical attention is needed.",
      "Weight gain, typically a few pounds over the first year or two, usually gradual, is reported by some women. Review your diet with your doctor to know more.",
    ],
  },
  {
    title: "What To\nWatch For",
    subtitle: "(Contact Your Doctor If)",
    front: "bg-[#614D92]",
    items: [
      "The rod feels bent, broken, or you see it coming out",
      "You can no longer feel the rod under the skin",
      "You can see the rod poking out",
      "You feel pain, heat, pus or redness at the insertion site that does not resolve on its own",
      "You wish to remove the implant or get a new implant",
    ],
  },
];

function FlipCard({ card, flipped, onToggle }) {
  return (
    <div
      className="group h-56 cursor-pointer perspective-[1600px] md:h-136"
      onClick={onToggle}
    >
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-500 group-hover:rotate-y-180 ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div
          className={`backface-hidden absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] p-8 text-center text-white shadow-soft ${card.front}`}
        >
          <h3 className="whitespace-pre-line font-clash text-3xl font-bold leading-[1.15] md:text-4xl">
            {card.title}
          </h3>
          {card.subtitle && (
            <span className="mt-2 text-lg font-bold md:text-xl">
              {card.subtitle}
            </span>
          )}
          <span className="absolute bottom-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/40 text-dark">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        {/* Back */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 overflow-y-auto rounded-[1.75rem] bg-[#FBF7F0] p-6 shadow-hover md:p-8">
          <ul className="space-y-4">
            {card.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-dark/85 md:text-[0.95rem]"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-dark/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Aftercare() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  return (
    <section id="implant-aftercare" className="bg-bg">
      {/* Lavender band — title + flip cards, full width */}
      <div className="bg-[#EDE9F6] py-10 md:py-20">
        <div className="w-full px-[5%]">
          <h2 className="text-center font-clash text-3xl font-semibold text-dark md:text-4xl">
            Placement Done. Now What?
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {CARDS.map((card, i) => (
              <FlipCard
                key={card.title}
                card={card}
                flipped={flippedIndex === i}
                onToggle={() =>
                  setFlippedIndex((cur) => (cur === i ? null : i))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
