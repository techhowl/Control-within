"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// High-end, lifestyle-focused placeholder data matching the design reference
const PANELS = [
  {
    side: "left",
    title: "we are kind.",
    brand: "west elm",
    bg: "#614C91", // brand purple (primary)
    textColor: "#FFFFFF",
    steps: [
      {
        n: 1,
        text: "Choose your case, it comes in five eye-popping colours.",
        img: "https://images.unsplash.com/photo-1615397323136-1e0e8549e31d?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 2,
        text: "Choose from five refined scents that you'll want to sniff on repeat.",
        img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 3,
        text: "Choose from a flexible subscription plan or make a one-off purchase.",
        img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    side: "right",
    title: "we are optimistic.",
    brand: "west elm",
    bg: "#085B5C", // brand deep teal
    textColor: "#FFFFFF",
    steps: [
      {
        n: 1,
        text: "Sustainably sourced materials designed for a lifetime of use.",
        img: "https://images.unsplash.com/photo-1615397323136-1e0e8549e31d?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 2,
        text: "Zero-waste packaging delivered straight to your doorstep.",
        img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
      },
      {
        n: 3,
        text: "Carbon-neutral shipping on every single refill order.",
        img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop",
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
      <div className="p-5 flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            {step.n}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-800 font-medium">{step.text}</p>
      </div>
      {/* 
        Using standard <img> for quick copy-paste capability. 
        Swap to Next.js <Image /> in production for optimization. 
      */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
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
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
        <span className="text-xl font-medium tracking-tight text-white">How it works:</span>
        <span className="text-2xl italic font-serif text-white">Refill, Reuse, Repeat</span>
      </motion.div>

      <div className="grid grid-cols-3 gap-6 h-full max-h-[400px]">
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