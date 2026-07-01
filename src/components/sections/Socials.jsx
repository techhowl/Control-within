"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CARDS = [
  { label: "Myth vs fact: the implant", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=900&auto=format&fit=crop" },
  { label: "What to expect at placement", img: "/hero_4.png" },
  { label: "Heavy periods? You’re not alone", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop" },
];

const CARD_W = 280;
const SPACING = 212;
const SPRING = { type: "spring", stiffness: 100, damping: 20 };

const AVATARS = [
  "linear-gradient(135deg,#9b8ac4,#614c91)",
  "linear-gradient(135deg,#4aa3ac,#085b5c)",
  "linear-gradient(135deg,#d7cfeb,#9b8ac4)",
  "linear-gradient(135deg,#4aa3ac,#614c91)",
];

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
  </svg>
);

export default function Socials() {
  const [active, setActive] = useState(1);
  const n = CARDS.length;
  const go = (i) => setActive(Math.max(0, Math.min(n - 1, i)));

  return (
    <section className="relative overflow-hidden bg-bg py-20 md:py-28">
      {/* Faint dot-matrix overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(59,54,48,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-[5%] text-center">
        <h2 className="font-author text-3xl font-medium leading-tight text-teal-deep md:text-5xl">
          Stay Within Reach Of Our Socials
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
          Follow us <strong className="text-dark">@Control_within_Official</strong> for real
          conversations about contraception, menstrual health, and what control
          actually looks like.
        </p>

        <a
          href="https://www.instagram.com/control_within_official/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-teal-deep py-2 pl-6 pr-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-hover"
        >
          Follow @Control_within_Official
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Arrow dir="right" />
          </span>
        </a>
      </div>

      {/* Cover-flow carousel */}
      <div className="relative mx-auto mt-14 flex h-100 max-w-5xl items-center justify-center sm:h-110">
        {CARDS.map((card, i) => {
          const offset = i - active;
          const abs = Math.abs(offset);
          const scale = abs === 0 ? 1 : abs === 1 ? 0.84 : abs === 2 ? 0.68 : 0.6;
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.5 : 0;
          const zIndex = 30 - abs * 10;

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => go(i)}
              aria-label={card.label}
              animate={{ x: offset * SPACING, scale, opacity, zIndex }}
              transition={SPRING}
              style={{
                position: "absolute",
                width: CARD_W,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
              className="aspect-3/4 overflow-hidden rounded-3xl shadow-hover"
            >
              <img src={card.img} alt="" className="h-full w-full object-cover" draggable={false} />
              <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                <span className="text-xs font-medium text-white/70">@Control_within_Official</span>
                <p className="mt-1 font-clash text-lg font-semibold text-white">{card.label}</p>
              </div>
            </motion.button>
          );
        })}

        {/* Arrows */}
        <button
          type="button"
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Previous"
          className="absolute left-2 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-dark text-white shadow-soft transition-opacity hover:bg-accent-hover disabled:opacity-30 sm:left-8"
        >
          <Arrow dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          disabled={active === n - 1}
          aria-label="Next"
          className="absolute right-2 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-dark text-white shadow-soft transition-opacity hover:bg-accent-hover disabled:opacity-30 sm:right-8"
        >
          <Arrow dir="right" />
        </button>
      </div>
    </section>
  );
}