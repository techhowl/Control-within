"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

/* Header + step icons (minimalist line style). */
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
const Ban = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M6 6l12 12" />
  </svg>
);
const Layers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M12 4l8 4-8 4-8-4 8-4z" />
    <path d="M4 12l8 4 8-4M4 16l8 4 8-4" />
  </svg>
);
const Refresh = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
    <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.5 5.8L4 16M4 20v-4h4" />
  </svg>
);

const PANELS = [
  {
    side: "left",
    Icon: Shield,
    title: "How the Implant works",
    tagline: "Set it. Forget it.",
    lead: "The implant releases a low, steady dose of progestin.",
    bg: "#ece3f7",
    accent: "#614c91",
    steps: [
      { n: 1, Icon: Ban, text: "Ovulation stops and cervical mucus thickens — sperm cannot reach the egg." },
      { n: 2, Icon: Layers, text: "The uterine lining thins — a fertilised egg cannot attach." },
      { n: 3, Icon: Refresh, text: "Once removed, fertility returns quickly." },
    ],
  },
  {
    side: "right",
    Icon: Droplet,
    title: "How the hIUS works",
    tagline: "Lighter. Calmer.",
    lead: "The hIUS releases a small amount of hormone locally inside the uterus.",
    bg: "#dcefec",
    accent: "#085b5c",
    steps: [
      { n: 1, Icon: Layers, text: "The uterine lining thins, significantly reducing bleeding and pain." },
      { n: 2, Icon: Ban, text: "Sperm is prevented from reaching the egg." },
      { n: 3, Icon: Refresh, text: "Fully reversible — fertility returns within weeks of removal." },
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

function StepTile({ step, accent }) {
  return (
    <div className="flex flex-col">
      <span
        className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: accent }}
      >
        {step.n}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-text">{step.text}</p>
      <div
        className="mt-4 flex h-24 items-center justify-center rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${accent}24, ${accent}0d)` }}
      >
        <step.Icon className="h-8 w-8" style={{ color: accent }} />
      </div>
    </div>
  );
}

function Process({ panel }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className="absolute inset-0 flex flex-col justify-center p-10"
    >
      <motion.div variants={stepV}>
        <span className="font-author text-xl italic" style={{ color: panel.accent }}>
          {panel.tagline}
        </span>
        <h3 className="mt-1 font-clash text-3xl font-semibold" style={{ color: panel.accent }}>
          {panel.title}
        </h3>
        <p className="mt-2 max-w-md text-sm text-muted">{panel.lead}</p>
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-5">
        {panel.steps.map((s) => (
          <motion.div key={s.n} variants={stepV}>
            <StepTile step={s} accent={panel.accent} />
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
      style={{ flexGrow: mode === "expanded" ? 3 : 1, backgroundColor: panel.bg }}
      className="relative h-full overflow-hidden"
    >
      <motion.div
        animate={{ opacity: mode === "expanded" ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
      >
        <panel.Icon className="h-9 w-9" style={{ color: panel.accent }} />
        <h3
          className={`font-clash text-2xl font-semibold ${
            mode === "shrunk" ? "[writing-mode:vertical-rl]" : ""
          }`}
          style={{ color: panel.accent }}
        >
          {panel.title}
        </h3>
        {mode === "default" && (
          <span className="font-author text-lg italic text-muted">{panel.tagline}</span>
        )}
      </motion.div>

      <AnimatePresence>{mode === "expanded" && <Process panel={panel} />}</AnimatePresence>
    </motion.div>
  );
}

function MobileCard({ panel }) {
  return (
    <div className="rounded-3xl p-7" style={{ backgroundColor: panel.bg }}>
      <panel.Icon className="h-8 w-8" style={{ color: panel.accent }} />
      <span className="mt-4 block font-author text-lg italic text-muted">{panel.tagline}</span>
      <h3 className="mt-1 font-clash text-2xl font-semibold" style={{ color: panel.accent }}>
        {panel.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{panel.lead}</p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {panel.steps.map((s) => (
          <StepTile key={s.n} step={s} accent={panel.accent} />
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
