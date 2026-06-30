"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const Shield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const Droplet = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
  </svg>
);

const PANELS = [
  {
    side: "left",
    Icon: Shield,
    title: "How the Implant works",
    tagline: "Set it. Forget it.",
    lead: "The implant releases a low, steady dose of progestin.",
    bg: "bg-accent",
    steps: [
      {
        n: 1,
        text: "Ovulation stops and cervical mucus thickens — sperm cannot reach the egg.",
        img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 2,
        text: "The uterine lining thins — a fertilised egg cannot attach.",
        img: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 3,
        text: "Once removed, fertility returns quickly.",
        img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    side: "right",
    Icon: Droplet,
    title: "How the hIUS works",
    tagline: "Lighter. Calmer.",
    lead: "The hIUS releases a small amount of hormone locally inside the uterus.",
    bg: "bg-teal-deep",
    steps: [
      {
        n: 1,
        text: "The uterine lining thins, significantly reducing bleeding and pain.",
        img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 2,
        text: "Sperm is prevented from reaching the egg.",
        img: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 3,
        text: "Fully reversible — fertility returns within weeks of removal.",
        img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
];

const PANEL_SPRING = { type: "spring", stiffness: 90, damping: 20 };
const stagger = {
  hidden: {},
  show: { transition: { delayChildren: 0.15, staggerChildren: 0.1 } },
};
const stepV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

function Process({ panel }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="absolute inset-0 flex flex-col justify-center p-10 text-white"
    >
      <motion.div variants={stepV}>
        <span className="font-author text-xl italic text-white/80">{panel.tagline}</span>
        <h3 className="mt-1 font-clash text-3xl font-semibold">{panel.title}</h3>
        <p className="mt-2 max-w-md text-sm text-white/75">{panel.lead}</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        {panel.steps.map((s) => (
          <motion.div key={s.n} variants={stepV} className="flex flex-col">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
              {s.n}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{s.text}</p>
            <div className="mt-4 h-24 overflow-hidden rounded-2xl">
              <img src={s.img} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DesktopPanel({ panel, hovered, setHovered }) {
  const mode =
    hovered === panel.side ? "expanded" : hovered === null ? "default" : "shrunk";

  return (
    <motion.div
      layout
      onMouseEnter={() => setHovered(panel.side)}
      onMouseLeave={() => setHovered(null)}
      transition={PANEL_SPRING}
      style={{ flexGrow: mode === "expanded" ? 3 : 1 }}
      className={`relative h-full overflow-hidden ${panel.bg}`}
    >
      {/* Collapsed / shrunk header */}
      <motion.div
        animate={{ opacity: mode === "expanded" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center text-white"
      >
        <panel.Icon className="h-9 w-9" />
        <h3
          className={`font-clash text-2xl font-semibold ${
            mode === "shrunk" ? "[writing-mode:vertical-rl]" : ""
          }`}
        >
          {panel.title}
        </h3>
        {mode === "default" && (
          <span className="font-author text-lg italic text-white/80">{panel.tagline}</span>
        )}
      </motion.div>

      {/* Expanded process */}
      <AnimatePresence>{mode === "expanded" && <Process panel={panel} />}</AnimatePresence>
    </motion.div>
  );
}

function MobileCard({ panel }) {
  return (
    <div className={`rounded-3xl p-7 text-white ${panel.bg}`}>
      <panel.Icon className="h-8 w-8" />
      <span className="mt-4 block font-author text-lg italic text-white/80">{panel.tagline}</span>
      <h3 className="mt-1 font-clash text-2xl font-semibold">{panel.title}</h3>
      <p className="mt-2 text-sm text-white/75">{panel.lead}</p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {panel.steps.map((s) => (
          <div key={s.n} className="flex flex-col">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
              {s.n}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-white/90">{s.text}</p>
            <div className="mt-4 h-28 overflow-hidden rounded-2xl">
              <img src={s.img} alt="" className="h-full w-full object-cover" draggable={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Science() {
  const [hovered, setHovered] = useState(null);
  const reduce = useReducedMotion();

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The Science
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Behind The Scenes.
          </h2>
          <p className="mt-4 text-base text-muted">
            Hover a side to see exactly how each method works.
          </p>
        </Reveal>

        {/* Desktop split-screen accordion */}
        {!reduce && (
          <div className="mt-12 hidden h-[600px] overflow-hidden rounded-3xl shadow-soft lg:flex">
            {PANELS.map((panel) => (
              <DesktopPanel
                key={panel.side}
                panel={panel}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))}
          </div>
        )}

        {/* Mobile (and reduced-motion) stacked cards */}
        <div className={`mt-12 grid grid-cols-1 gap-5 ${reduce ? "" : "lg:hidden"}`}>
          {PANELS.map((panel) => (
            <MobileCard key={panel.side} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
