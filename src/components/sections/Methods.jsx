"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

const METHODS = [
  {
    title: "Contraceptive Implant",
    badge: "Doctor-placed",
    meta: "Reversible • In-clinic placement",
    duration: "3 years",
    description:
      "A tiny rod placed under the skin of your upper arm — set it once and forget about contraception for years.",
    feats: [
      "Discreet & fully reversible",
      "No daily effort or pharmacy runs",
      "Fertility returns quickly after removal",
    ],
    tags: ["Reversible", "Discreet"],
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop",
    accent: "#614c91",
    href: "#consult",
  },
  {
    title: "Hormonal IUS",
    badge: "Doctor-placed",
    meta: "Reversible • In-clinic placement",
    duration: "5 years",
    description:
      "A small T-shaped device placed in the uterus that lightens periods, calms cramps, and protects — all at once.",
    feats: [
      "Reduces heavy bleeding & cramps",
      "Eases endometriosis symptoms",
      "Fully reversible within weeks",
    ],
    tags: ["Reversible", "Eases periods"],
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop",
    accent: "#085b5c",
    href: "#consult",
  },
];

const SPRING = { type: "spring", stiffness: 260, damping: 26 };

const imageV = { hide: { opacity: 1, scale: 1 }, show: { opacity: 0.12, scale: 1.08 } };
const minimalV = { hide: { opacity: 1 }, show: { opacity: 0 } };
const panelV = { hide: { y: 44, opacity: 0 }, show: { y: 0, opacity: 1 } };

function MethodCard({ m }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const state = open ? "show" : "hide";
  const transition = reduce ? { duration: 0.2 } : SPRING;

  return (
    <motion.article
      tabIndex={0}
      aria-label={m.title}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      className="relative h-[460px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-soft outline-none transition-shadow hover:shadow-hover focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Background image */}
      <motion.div
        variants={imageV}
        animate={state}
        transition={transition}
        className="absolute inset-0"
      >
        <img src={m.image} alt="" className="h-full w-full object-cover" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-dark/30" />
      </motion.div>

      {/* Minimal details (default state) */}
      <motion.div
        variants={minimalV}
        animate={state}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {m.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Shield /> {m.duration}
          </span>
        </div>
        <h3 className="font-clash text-2xl font-semibold text-white drop-shadow">{m.title}</h3>
      </motion.div>

      {/* Revealed white content block */}
      <motion.div
        variants={panelV}
        animate={state}
        transition={transition}
        style={{ pointerEvents: open ? "auto" : "none" }}
        className="absolute inset-0 flex flex-col bg-surface p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-clash text-2xl font-semibold text-dark">{m.title}</h3>
          <span className="shrink-0 rounded-full border border-dark/15 px-3 py-1 text-xs font-medium text-muted">
            {m.badge}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-muted">{m.meta}</p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-text">{m.description}</p>

        <ul className="mt-5 space-y-2.5">
          {m.feats.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-text">
              <span
                className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white"
                style={{ backgroundColor: m.accent }}
              >
                <Check />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <span className="font-clash text-3xl font-semibold" style={{ color: m.accent }}>
              99%+
            </span>
            <span className="ml-1 text-sm text-muted">effective</span>
          </div>
          <a
            href={m.href}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 rounded-full bg-dark py-2 pl-5 pr-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Know more
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-dark">
              <Arrow />
            </span>
          </a>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function Methods() {
  return (
    <section id="methods" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The Methods
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Make The Choice That Fits Your Life
          </h2>
          <p className="mt-4 text-base text-muted">
            Two long-term, reversible, doctor-placed options. Hover a card to see
            how each one works.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {METHODS.map((m) => (
            <Reveal key={m.title} delay={80}>
              <MethodCard m={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
