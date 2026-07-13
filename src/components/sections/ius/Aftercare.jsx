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
      { type: "point", text: "Cramping and light spotting are common and expected because your uterus is adjusting to the device. Doctors will suggest paracetamol (325–1,000 mg), or other pain reliever as needed" },
      { type: "point", text: "Most women feel mild discomfort or a dull ache for 1–2 days; rest helps" },
    ],
  },
  {
    title: "3-6 Months",
    subtitle: "",
    front: "bg-[#9A8BC4]",
    items: [
      { type: "heading", text: "First 1-3 months (adjustment phase)" },
      { type: "point", text: "Bleeding may be lighter, heavier, or completely unpredictable." },
      { type: "point", text: "Light spotting between your expected periods is very common early on." },
      { type: "point", text: "Few women may notice temporary hormonal shifts like mild mood changes, headaches, or acne. These typically improve over time" },
      { type: "point", text: "A follow-up visit after her first monthly bleeding or 3 to 6 weeks after IUD insertion is recommended" },
      { type: "heading", text: "Months 3 to 6 (Settling In)" },
      { type: "point", text: "Significant reduction in bleeding by month 3; full effect typically established by month 6" },
      { type: "point", text: "A small majority of women notice gradual weight changes or low mood during use. These vary between individuals — speak to your doctor if either becomes a concern." },
      { type: "point", text: "Most women experience much lighter periods or none at all. This is the intended outcome, not a problem" },
      { type: "point", text: "For a small number of women, the hormonal shifts like mood changes, headaches, or acne, can persist long-term. If these do not improve after 6 months and become bothersome, speak with your doctor about management options" },
    ],
  },
  {
    title: "What To\nWatch For",
    subtitle: "(Contact Your Doctor If)",
    front: "bg-[#614D92]",
    items: [
      { type: "point", text: "Severe ongoing cramping that isn't improving" },
      { type: "point", text: "You can't feel the strings during a check" },
      { type: "point", text: "Heavy bleeding that's increasing rather than decreasing after 6 months" },
      { type: "point", text: "Any signs of infection (fever, unusual discharge, tenderness)" },
      { type: "point", text: "You think the hIUS might have slipped out of your uterus" },
      { type: "point", text: "You experience symptoms of Pelvic Inflammatory Disease, such as intense lower abdominal pain, painful intercourse, unusual vaginal discharge, fever, chills, nausea etc. " },
      { type: "point", text: "You experience symptoms of pregnancy" },
      { type: "point", text: "You wish to remove the hIUS or get a new one" },
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
          <div className="space-y-4">
            {card.items.map((item, idx) => {
              if (item.type === "heading") {
                return (
                  <h4 
                    key={idx} 
                    className={`font-clash text-[1.05rem] font-bold text-dark/95 ${idx > 0 ? "pt-3" : ""}`}
                  >
                    {item.text}
                  </h4>
                );
              }
              
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-dark/85 md:text-[0.95rem]"
                >
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-dark/70" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
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