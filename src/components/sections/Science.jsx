"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Campaign content for the two methods
const PANELS = [
  {
    side: "left",
    // Added a break tag here to split the title into two lines
    title: (
      <>
        Contraceptive <br /> Implants
      </>
    ),
    lead: "", // Left blank since the previous lead is now Step 1
    bg: "#D7CFEB", // light brand lavender
    textColor: "#FFFFFF",
    steps: [
      {
        n: 1,
        text: "The implant releases a low, steady dose of etonogestrel.",
        img: "/implant_process_1.png",
      },
      {
        n: 2,
        text: "Ovulation stops, cervical mucus thickens - sperm cannot reach the egg.",
        img: "/implant_process_2.png",
      },
      {
        n: 3,
        text: "Thins uterine lining - fertilized egg cannot attach.",
        img: "/implant_process_3.png",
      },
      {
        n: 4,
        text: "Once removed, fertility returns quickly.",
        img: "/implant_process_4.png",
      },
    ],
  },
  {
    side: "right",
    // Added a break tag here to split the title into two lines
    title: (
      <>
        Contraceptive <br /> IUS
      </>
    ),
    lead: "", // Left blank since the previous lead is now Step 1
    bg: "#4AA3AC", // light brand teal
    textColor: "#FFFFFF",
    steps: [
      {
        n: 1,
        text: "The hIUS releases a small amount of hormone locally inside the uterus.",
        img: "IUS_process.png",
      },
      {
        n: 2,
        text: "Uterine lining thins, significantly reducing bleeding and pain.",
        img: "implant_process_3.png",
      },
      {
        n: 3,
        text: "Sperm is prevented from reaching the egg.",
        img: "implant_process_2.png",
      },
    ],
  },
];

// Refined physics for a premium, weighty slide
const SPRING_CONFIG = { type: "spring", stiffness: 60, damping: 15, mass: 0.8 };

// Staggered reveal for the inner content
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

function StepTile({ step }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 md:p-5 flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            {step.n}
          </span>
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-gray-800 font-medium">{step.text}</p>
      </div>
      {/* 
        Using standard <img> for quick copy-paste capability. 
        Swap to Next.js <Image /> in production for optimization. 
      */}
      <div className="relative w-full h-40 md:h-48 bg-gray-100 overflow-hidden shrink-0">
        <img
          src={step.img}
          alt={`Step ${step.n}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function ExpandedProcess({ panel }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="absolute inset-0 flex flex-col justify-center px-12 py-8"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <span
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: panel.textColor }}
        >
          How it works
        </span>
        {panel.lead && (
          <p
            className="mt-2 max-w-2xl text-2xl md:text-3xl font-medium"
            style={{ color: panel.textColor }}
          >
            {panel.lead}
          </p>
        )}
      </motion.div>

      {/* Dynamic grid to support both 3 and 4 steps properly without wrapping */}
      <div className={`grid gap-4 md:gap-6 h-full max-h-[400px] ${panel.steps.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
        {panel.steps.map((s) => (
          <motion.div key={s.n} variants={itemVariants} className="h-full">
            <StepTile step={s} />
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
      transition={SPRING_CONFIG}
      style={{
        flexGrow: mode === "expanded" ? 3.5 : 1,
        backgroundColor: panel.bg,
      }}
      className="relative h-[650px] overflow-hidden cursor-pointer"
    >
      {/* Default State Content (Centered Text) */}
      <AnimatePresence>
        {mode === "default" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <h3
              className="text-5xl md:text-6xl font-bold tracking-tight mb-8"
              style={{ color: panel.textColor }}
            >
              {panel.title}
            </h3>
            <span
              className="text-lg font-medium tracking-widest uppercase"
              style={{ color: panel.textColor }}
            >
              {panel.brand}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded State Content (The Process) */}
      <AnimatePresence>
        {mode === "expanded" && <ExpandedProcess panel={panel} />}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SplitProcessScreen() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="w-full bg-bg py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">

        {/* Section headline */}
        <div className="text-center mb-12">
          <span className="text-xm font-semibold uppercase tracking-[0.18em] text-accent">
            The Process
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-4xl">
            Behind The Scenes.
          </h2>
        </div>

        {/* Desktop interactive split-screen */}
        <div className="hidden md:flex w-full rounded-2xl overflow-hidden shadow-2xl">
          {PANELS.map((panel) => (
            <DesktopPanel
              key={panel.side}
              panel={panel}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </div>

        {/* Mobile Fallback: Stacked layout */}
        <div className="flex flex-col md:hidden gap-8">
          {PANELS.map((panel) => (
            <div
              key={panel.side}
              className="rounded-2xl p-6"
              style={{ backgroundColor: panel.bg }}
            >
              <h3 className="text-4xl font-bold text-center mb-8 text-white">
                {panel.title}
              </h3>
              <div className="flex flex-col gap-6">
                {panel.steps.map((s) => (
                  <StepTile key={s.n} step={s} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}