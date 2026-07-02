"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SLIDES = [
  {
    bg: "#ede6d9",
    accent: "#614c91",
    bgText: "CONTROL",
    heading: "Experience Control Within",
    paragraph:
      "Long acting reversible contraceptives. With one simple step, you get years of protection and control over your menstrual cycle.",
    image:"hero_1.png",
    label: "Control Within",
    sublabel: "Long-term & reversible",
    cta: { label: "Find A Doctor Near You", href: "#consult" },
  },
  {
    bg: "#d7cfeb",
    accent: "#614c91",
    bgText: "IMPLANT",
    heading: "A Contraceptive That Fits Your Terms And Conditions.",
    paragraph:
      "Imagine not having to think about a pill daily, worrying about your partner carrying a condom, or having to commit to a permanent and often regrettable decision. The Contraceptive Implant solves all these problems.",
    image:
      "hero_2.png",
    label: "Contraceptive Implant",
    sublabel: "Up to 3 years of protection",
    tags: [
      "Works for 3 years once inserted — no daily or monthly effort",
      "Over 99% effective",
      "Discreet",
      "Reversible — return to fertility is quick once removed",
      "No recurring costs",
    ],
    cta: { label: "Watch A Video On Contraceptive Implants", href: "#videos" },
  },
  {
    bg: "#faf8f5",
    accent: "#085b5c",
    bgText: "RELIEF",
    heading:
      "Do Heavy and Painful Periods Ruin All Your Plans? Now, You Have The Upper Hand.",
    paragraph:
      "Regain control over your body and cycle with the Hormonal IUS — a small T-shaped device placed in the uterus to help alleviate period pains, heavy menstrual bleeding, and more.",
    image:
      "hero_3.png",
    label: "Hormonal IUS",
    sublabel: "Lighter, calmer periods",
    tags: [
      "Helps with heavy menstrual bleeding and endometriosis",
      "Reduces menstrual blood loss significantly",
      "Effectively manages period pains",
      "Dual functionality as a contraceptive",
      "Fertility returns within weeks, after removal",
    ],
    cta: { label: "Watch A Video On Hormonal IUS", href: "#videos" },
  },
  {
    bg: "#ede6d9",
    accent: "#4aa3ac",
    bgText: "CHOICE",
    heading:
      "Be It Periods Or Contraception, You Should Have The Control You Deserve.",
    paragraph:
      "Explore long-term hormonal contraceptive solutions that work quietly while you live your life.",
    image:
      "hero_4.png",
    label: "Implant or hIUS",
    sublabel: "Your choice, your control",
    cta: { label: "Know More", href: "#methods" },
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
      className="absolute max-md:hidden"
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
      className="relative min-h-svh overflow-hidden md:h-svh"
    >
      {/* ---- MOBILE ONLY: active slide image as a faint full-bleed background ---- */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`mbg-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.22 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="pointer-events-none absolute inset-0 md:hidden"
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* ---- CENTER LAYER: bg word + anchor image + floating orbs (behind UI) ---- */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center max-md:items-end max-md:pb-28"
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
        <div className="absolute h-40 w-72 translate-y-28 rounded-[50%] bg-white/30 blur-2xl max-md:hidden sm:w-96" />

        {/* Central anchor image — flips in 3D on change */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`img-${active}`}
            initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative h-[280px] w-[210px] overflow-hidden rounded-[2.5rem] shadow-hover max-md:hidden sm:h-[420px] sm:w-[320px]"
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
      <div className="relative z-10 flex h-full flex-col px-[5%] pb-7 pt-35 max-md:pb-10 md:pb-14">
        {/* Top: heading + trust avatars */}
        <header className="flex items-start justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-xl font-author text-2xl font-medium leading-[1.05] sm:text-4xl lg:text-5xl"
              style={{ color: slide.accent }}
            >
              {slide.heading}
            </motion.h1>
          </AnimatePresence>
        </header>

        {/* Middle: left paragraph card + right CTA/label (desktop) */}
        {/* On desktop, top-align left copy with the right bullet card (tagged folds only). */}
        <div
          className={`flex flex-1 items-center max-md:items-start ${
            slide.tags ? "md:items-start" : ""
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`p-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-sm rounded-3xl bg-white/55 p-6 backdrop-blur-sm max-md:mt-8 max-md:w-full md:mt-12 md:block md:self-start md:bg-white/45 md:p-8"
            >
              {/* Mobile-only: product label above the copy (hidden on desktop where it lives on the right) */}
              <div className="mb-3 md:hidden">
                <div className="font-author text-2xl font-medium" style={{ color: slide.accent }}>
                  {slide.label}
                </div>
                <div className="mt-0.5 text-sm text-dark/60">{slide.sublabel}</div>
              </div>
              <p className="text-sm leading-relaxed text-dark/75 sm:text-base">{slide.paragraph}</p>
              {/* Mobile: tags stay in the left card. On desktop they move to the right (see below). */}
              {slide.tags && (
                <ul className="mt-4 flex flex-col gap-1.5 md:hidden">
                  {slide.tags.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm leading-snug text-dark/70 sm:text-xs">
                      <span
                        className="mt-1.5 h-1 w-1 flex-none rounded-full"
                        style={{ backgroundColor: slide.accent }}
                      />
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              
              {/* Only show Learn More link on the 2nd and 3rd slides (index 1 and 2) */}
              {(active === 1 || active === 2) && (
                <a
                  href="#methods"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: slide.accent }}
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex-1" />

          <div className="hidden flex-col items-end gap-7 md:flex">
            {/* Desktop: bullet points on the right (folds with tags only) */}
            {slide.tags && (
              <AnimatePresence mode="wait">
                <motion.ul
                  key={`tags-${active}`}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex max-w-sm flex-col gap-2.5 text-[0.85rem] rounded-3xl bg-white/55 p-8 text-left backdrop-blur-sm md:mt-12"
                >
                  {slide.tags.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 text-sm leading-snug text-dark/75"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                        style={{ backgroundColor: slide.accent }}
                      />
                      {t}
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            )}
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
                <div className="font-author text-4xl font-medium" style={{ color: slide.accent }}>
                  {slide.label}
                </div>
                <div className="mt-1 text-base text-dark/60">{slide.sublabel}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: thumbnails + mobile CTA */}
        <footer className="flex items-end justify-between gap-4 max-md:mt-10 max-md:flex-col max-md:items-center max-md:gap-7">
          <div className="flex gap-3 sm:gap-3 max-md:hidden" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.label}
                onClick={() => setActive(i)}
                className={`relative h-16 w-14 overflow-hidden rounded-2xl transition-all duration-300 sm:h-30 sm:w-26 ${
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

          {/* Mobile-only carousel dots — signal that the hero is a carousel */}
          <div
            className="flex items-center gap-2 md:hidden"
            role="tablist"
            aria-label="Choose slide"
          >
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.label}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6" : "w-2 opacity-40"
                }`}
                style={{ backgroundColor: slide.accent }}
              />
            ))}
          </div>
        </footer>
      </div>
    </motion.section>
  );
}