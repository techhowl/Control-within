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
    image: "hero_1.png",
    label: "Control Within",
    sublabel: "Long-term & reversible",
    cta: { label: "Find A Doctor Near You", href: "https://wa.me/918452926740" },
  },
  {
    bg: "#d7cfeb",
    accent: "#614c91",
    bgText: "IMPLANT",
    heading: "A Contraceptive That Fits Your Terms And Conditions.",
    paragraph:
      "Imagine not having to think about a pill daily, worrying about your partner carrying a condom, or having to commit to a permanent and often regrettable decision. The Contraceptive Implant solves all these problems.",
    image: "hero_2.png",
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
    image: "hero_3.png",
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
    image: "hero_4.png",
    label: "Implant or hIUS",
    sublabel: "Your choice, your control",
    cta: { label: "Know More", href: "#methods" },
  },
];

const EASE = [0.22, 1, 0.36, 1];

const contentVariants = {
  initial: { y: 36, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { y: 36, opacity: 0, transition: { duration: 0.35, ease: "easeIn" } },
};

const bgTextVariants = {
  initial: { y: 120, opacity: 0 },
  animate: { y: 0, opacity: 0.08, transition: { duration: 0.7, ease: EASE } },
  exit: { y: -120, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } },
};

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Swipe State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const reduce = useReducedMotion();
  const slide = SLIDES[active];
  const n = SLIDES.length;

  // Detect Mobile device to stop autoplay
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (paused || reduce || isManualOverride || isMobile) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), 7000);
    return () => clearTimeout(t);
  }, [active, paused, reduce, n, isManualOverride, isMobile]);

  // Arrow Nav Handlers
  const nextSlide = () => {
    setActive((a) => (a + 1) % n);
    setIsManualOverride(true);
  };
  
  const prevSlide = () => {
    setActive((a) => (a === 0 ? n - 1 : a - 1));
    setIsManualOverride(true);
  };

  // Swipe Handlers
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActive((a) => (a + 1) % n);
      setIsManualOverride(true);
    }
    if (isRightSwipe) {
      setActive((a) => (a === 0 ? n - 1 : a - 1));
      setIsManualOverride(true);
    }
  };

  // Click handler for manual slide selection
  const handleManualSelect = (index) => {
    setActive(index);
    setIsManualOverride(true);
  };

  const Cta = ({ className = "" }) => {
    const isExternal = slide.cta.href.startsWith("http");
    return (
      <a
        href={slide.cta.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 ${className}`}
        style={{ backgroundColor: slide.accent }}
      >
        {slide.cta.label}
        <span aria-hidden="true">→</span>
      </a>
    );
  };

  const isContentHeavy = active === 1 || active === 2;
  const mobileHeadingSize = isContentHeavy ? "max-md:text-xl" : "max-md:text-4xl";
  const mobileCardMargin = isContentHeavy ? "max-md:mt-3" : "max-md:mt-8";

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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      // Added `group` here to track desktop hover state for the arrows
      className="group relative min-h-svh overflow-hidden flex flex-col"
    >
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

      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center max-md:items-end max-md:pb-28"
        style={{ perspective: 1200 }}
      >
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

        <div className="absolute h-40 w-72 translate-y-28 rounded-[50%] bg-white/30 blur-2xl max-md:hidden sm:w-96" />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`img-${active}`}
            initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative overflow-hidden rounded-[2.5rem] shadow-hover max-md:hidden md:h-[280px] md:w-[210px] lg:h-[420px] lg:w-[320px]"
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

      <div className="relative z-10 flex h-full flex-1 flex-col px-[5%] pb-7 pt-24 max-md:pb-16 md:pt-24 lg:pt-35 md:pb-16 lg:pb-30">
        
        <header className="flex items-start justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`max-w-xl font-author font-medium leading-[1.05] sm:text-4xl lg:text-5xl ${mobileHeadingSize}`}
              style={{ color: slide.accent }}
            >
              {slide.heading}
            </motion.h1>
          </AnimatePresence>
        </header>

        <div className={`flex flex-1 items-center max-md:items-start my-6 lg:my-0 ${slide.tags ? "md:items-start" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`p-${active}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`max-w-sm rounded-3xl bg-white/55 p-6 backdrop-blur-sm max-md:w-full md:mt-6 lg:mt-12 md:block md:self-start md:bg-white/45 lg:p-8 ${mobileCardMargin}`}
            >
              <div className="mb-3 md:hidden">
                <div className="font-author text-xl font-medium" style={{ color: slide.accent }}>
                  {slide.label}
                </div>
                <div className="mt-0.5 text-sm text-dark/60">{slide.sublabel}</div>
              </div>
              
              <p className="text-sm leading-relaxed text-dark/75 sm:text-base">{slide.paragraph}</p>
              
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

          <div className="hidden flex-col items-end gap-5 lg:gap-7 md:flex">
            {slide.tags && (
              <AnimatePresence mode="wait">
                <motion.ul
                  key={`tags-${active}`}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="flex max-w-sm flex-col gap-2 lg:gap-2.5 text-[0.85rem] rounded-3xl bg-white/55 p-5 lg:p-8 text-left backdrop-blur-sm md:mt-6 lg:mt-12"
                >
                  {slide.tags.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm leading-snug text-dark/75">
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
                <div className="font-author text-3xl lg:text-4xl font-medium" style={{ color: slide.accent }}>
                  {slide.label}
                </div>
                <div className="mt-1 text-sm lg:text-base text-dark/60">{slide.sublabel}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <footer className="flex items-end justify-between gap-4 max-md:mt-10 max-md:flex-col max-md:items-center max-md:gap-7 z-10 w-full">
          {/* Desktop Slide Selector Tabs */}
          <div className="flex gap-3 sm:gap-3 max-md:hidden" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.label}
                onClick={() => handleManualSelect(i)}
                className={`relative overflow-hidden rounded-xl lg:rounded-2xl transition-all duration-300 md:h-20 md:w-16 lg:h-30 lg:w-26 ${
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

          {/* Mobile Dot Nav */}
          <div className="flex items-center gap-2 md:hidden" role="tablist" aria-label="Choose slide">
            {SLIDES.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.label}
                onClick={() => handleManualSelect(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6" : "w-2 opacity-40"
                }`}
                style={{ backgroundColor: slide.accent }}
              />
            ))}
          </div>
          
          {/* Desktop Hover Arrows */}
          <div className="hidden md:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pb-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
              style={{ color: slide.accent }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
              style={{ color: slide.accent }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
        </footer>
      </div>
    </motion.section>
  );
}