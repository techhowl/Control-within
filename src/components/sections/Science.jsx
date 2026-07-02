"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Campaign content for the two methods
const PANELS = [
  {
    side: "left",
    title: (
      <>
        Contraceptive <br /> Implants
      </>
    ),
    lead: "",
    bg: "#D7CFEB",
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
    title: (
      <>
        Hormonal <br /> IUS
      </>
    ),
    lead: "",
    bg: "#4AA3AC",
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

      <AnimatePresence>
        {mode === "expanded" && <ExpandedProcess panel={panel} />}
      </AnimatePresence>
    </motion.div>
  );
}

// Mobile Panel Component
function MobilePanel({ panel }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setOpen(!open)}
      className="relative rounded-2xl cursor-pointer overflow-hidden shadow-sm"
      style={{ backgroundColor: panel.bg }}
    >
      {/* Header Area */}
      <div className="p-8 pb-10 text-center flex flex-col items-center relative z-10">
        <h3 className={`text-4xl font-bold text-white leading-tight transition-all duration-300 ${open ? "mb-0" : "mb-2"}`}>
          {panel.title}
        </h3>
      </div>

      {/* Bottom Right CTA Text & Circular Arrow (Hidden when open) */}
      {!open && (
        <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
          <span className="text-[13px] font-semibold tracking-wide text-white/95">
            Click to read more
          </span>
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      )}

      {/* Expandable Process Steps */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 pb-6"
          >
            <div className="flex flex-col gap-6 pt-2">
              {panel.steps.map((s) => (
                <StepTile key={s.n} step={s} />
              ))}
            </div>
            
            {/* Small close icon at the bottom of the fold */}
            <div className="mt-4 flex justify-center">
              {/* <svg viewBox="0 0 24 24" className="h-7 w-7 text-black/40 transition-transform hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg> */}
            </div>
          </motion.div>
        )}
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

        {/* Mobile Fallback: Interactive stacked layout */}
        <div className="flex flex-col md:hidden gap-6">
          {PANELS.map((panel) => (
            <MobilePanel key={panel.side} panel={panel} />
          ))}
        </div>

      </div>
    </section>
  );
}