"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ----------------------------------------------------------------------------
 * Icons used as floating "ingredient" orbs around the central anchor.
 * -------------------------------------------------------------------------- */
const Shield = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const Heart = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
  </svg>
);
const Infinity = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M7 9a3 3 0 1 0 0 6c2 0 3-2 5-3s3-3 5-3a3 3 0 1 1 0 6c-2 0-3-2-5-3S9 9 7 9z" />
  </svg>
);
const Droplet = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
  </svg>
);
const Sparkle = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
  </svg>
);
const Leaf = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" />
    <path d="M5 19c4-4 7-6 10-7" />
  </svg>
);

/* Three fixed anchor spots around the central image; icon/colour vary by slide. */
const FLOAT_SPOTS = [
  { top: "24%", left: "31%", from: { x: -70, y: -50 }, dur: 4.2 },
  { top: "33%", left: "64%", from: { x: 80, y: -36 }, dur: 5.1 },
  { top: "62%", left: "57%", from: { x: 64, y: 70 }, dur: 4.6 },
];

const SLIDES = [
  {
    bg: "#ede6d9",
    accent: "#614c91",
    bgText: "CONTROL",
    heading: "Experience Control Within",
    paragraph:
      "Long-acting, reversible contraceptives. One simple step for years of protection and control over your cycle.",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop",
    label: "Control Within",
    sublabel: "Long-term & reversible",
    cta: { label: "Find a doctor", href: "#consult" },
    floats: [Shield, Heart, Infinity],
  },
  {
    bg: "#d7cfeb",
    accent: "#614c91",
    bgText: "IMPLANT",
    heading: "A contraceptive that fits your terms & conditions",
    paragraph:
      "A tiny rod under the skin of your upper arm. Set it once and forget about contraception for years — discreet, reversible, no daily effort.",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
    label: "Contraceptive Implant",
    sublabel: "Up to 3 years of cover",
    cta: { label: "Explore the implant", href: "#methods" },
    floats: [Shield, Droplet, Sparkle],
  },
  {
    bg: "#faf8f5",
    accent: "#085b5c",
    bgText: "RELIEF",
    heading: "Heavy, painful periods? Now you have the upper hand",
    paragraph:
      "The Hormonal IUS — a small T-shaped device placed in the uterus that lightens periods, calms cramps, and protects, all at once.",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
    label: "Hormonal IUS",
    sublabel: "Lighter, calmer periods",
    cta: { label: "Explore the hIUS", href: "#methods" },
    floats: [Droplet, Heart, Leaf],
  },
  {
    bg: "#ede6d9",
    accent: "#4aa3ac",
    bgText: "CHOICE",
    heading: "The control you deserve — for periods or contraception",
    paragraph:
      "Explore long-term hormonal solutions that work quietly in the background while you live your life. A gynaecologist helps you choose.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1200&auto=format&fit=crop",
    label: "Implant or hIUS",
    sublabel: "Your choice, your control",
    cta: { label: "Know more", href: "#methods" },
    floats: [Infinity, Sparkle, Leaf],
  },
];

const EASE = [0.22, 1, 0.36, 1];

/* Text/content blocks: leave by sliding down + fading, enter by rising + fading. */
const contentVariants = {
  initial: { y: 36, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { y: 36, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } },
};

/* Massive background word: enters from below, exits upward; rests faint. */
const bgTextVariants = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 0.08, transition: { duration: 0.7, ease: EASE } },
  exit: { y: -120, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
};

function FloatingOrb({ Icon, spot, accent, reduce }) {
  return (
    <motion.div
      className="absolute"
      style={{ top: spot.top, left: spot.left }}
      initial={{ x: spot.from.x, y: spot.from.y, scale: 0.4, opacity: 0 }}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      exit={{ x: spot.from.x, y: spot.from.y, scale: 0.3, opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: spot.dur, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/70 shadow-soft backdrop-blur-sm"
        style={{ color: accent }}
      >
        <Icon className="h-6 w-6" />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const slide = SLIDES[active];
  const n = SLIDES.length;

  // Gentle autoplay; thumbnails are the primary control.
  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), 7000);
    return () => clearTimeout(t);
  }, [active, paused, reduce, n]);

  const Cta = ({ className = "" }) => (
    <a
      href={slide.cta.href}
      className={`inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 ${className}`}
      style={{ backgroundColor: slide.accent }}
    >
      {slide.cta.label}
      <span aria-hidden="true">→</span>
    </a>
  );

  return (
    <motion.section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Hero"
      initial={{ backgroundColor: SLIDES[0].bg }}
      animate={{ backgroundColor: slide.bg }}
      transition={{ duration: 0.8, ease: EASE }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-svh overflow-hidden"
    >
      {/* ---- CENTER LAYER: bg word + anchor image + floating orbs (behind UI) ---- */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ perspective: 1200 }}
      >
        {/* Massive background typography */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`txt-${active}`}
            variants={bgTextVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute select-none whitespace-nowrap font-clash text-[24vw] font-bold leading-none tracking-tight md:text-[20vw]"
            style={{ color: slide.accent }}
          >
            {slide.bgText}
          </motion.span>
        </AnimatePresence>

        {/* Soft platform under the anchor */}
        <div className="absolute h-40 w-72 translate-y-28 rounded-[50%] bg-white/30 blur-2xl sm:w-96" />

        {/* Floating orbs */}
        <AnimatePresence>
          {slide.floats.map((Icon, i) => (
            <FloatingOrb
              key={`orb-${active}-${i}`}
              Icon={Icon}
              spot={FLOAT_SPOTS[i]}
              accent={slide.accent}
              reduce={reduce}
            />
          ))}
        </AnimatePresence>

        {/* Central anchor image — flips in 3D on change */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`img-${active}`}
            initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative h-[340px] w-[260px] overflow-hidden rounded-[2.5rem] shadow-hover sm:h-[420px] sm:w-[320px]"
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- FOREGROUND UI ---- */}
      <div className="relative z-10 flex h-full flex-col px-[5%] pb-7 pt-28">
        {/* Top: heading + trust avatars */}
        <header className="flex items-start justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-xl font-author text-4xl font-medium leading-[1.05] sm:text-5xl lg:text-6xl"
              style={{ color: slide.accent }}
            >
              {slide.heading}
            </motion.h1>
          </AnimatePresence>

        </header>

        {/* Middle: left paragraph card + right CTA/label (desktop) */}
        <div className="flex flex-1 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`p-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="hidden max-w-xs rounded-3xl bg-white/45 p-6 backdrop-blur-sm md:block"
            >
              <p className="text-sm leading-relaxed text-dark/75">{slide.paragraph}</p>
              <a
                href="#methods"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
                style={{ color: slide.accent }}
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="flex-1" />

          <div className="hidden flex-col items-end gap-7 md:flex">
            <Cta />
            <AnimatePresence mode="wait">
              <motion.div
                key={`l-${active}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-right"
              >
                <div className="font-author text-3xl font-medium" style={{ color: slide.accent }}>
                  {slide.label}
                </div>
                <div className="mt-1 text-sm text-dark/60">{slide.sublabel}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: thumbnails + mobile CTA */}
        <footer className="flex items-end justify-between gap-4">
          <div className="flex gap-2 sm:gap-3" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.label}
                onClick={() => setActive(i)}
                className={`relative h-16 w-14 overflow-hidden rounded-2xl transition-all duration-300 sm:h-20 sm:w-16 ${
                  i === active ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
                style={
                  i === active
                    ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${s.accent}` }
                    : undefined
                }
              >
                <img src={s.image} alt="" className="h-full w-full object-cover" draggable={false} />
              </button>
            ))}
          </div>

          <Cta className="md:hidden" />
        </footer>
      </div>
    </motion.section>
  );
}
