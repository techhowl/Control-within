"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const POINTS = [
  "Safe while breastfeeding",
  "Periods get stable",
  "Minimal Pain",
  "Easily Removable",
  "Long-term relief",
  "Over 99% effective",
];

const DESCRIPTION =
  "With long acting reversible contraceptives like implants and hIUS, you can get over 99% protection for years, and discreet control over your menstrual cycle.";

const INTERVAL_MS = 3500;
const EASE = [0.22, 1, 0.36, 1];

// 1x1 transparent GIF: the <img> fallback inside each <picture> below, so a
// phone only downloads the mobile photo and a desktop only the desktop one.
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const pointAt = (k) => POINTS[((k % POINTS.length) + POINTS.length) % POINTS.length];

// Desktop: look of a pill by its distance from the highlighted (centre) slot.
// `x` pushes the outer pills right so the stack fans out off the edge.
function slotStyle(offset) {
  const d = Math.abs(offset);
  if (d === 0) return { opacity: 1, x: "0vw", scale: 1 };
  if (d === 1) return { opacity: 0.55, x: "5.5vw", scale: 0.94 };
  return { opacity: 0.2, x: "7vw", scale: 0.9 };
}

/**
 * Desktop: vertical carousel of benefit pills. Keys are absolute (ever-increasing)
 * slot numbers rather than indexes into POINTS, so a pill always enters at the
 * bottom and leaves through the top instead of sweeping back across the stack
 * when the list wraps.
 */
function PointsTicker({ active }) {
  const slots = [];
  for (let k = active - 2; k <= active + 2; k++) slots.push(k);

  return (
    <ul aria-hidden="true" className="relative h-[calc(5*var(--pill-step))] w-full">
      <AnimatePresence initial={false}>
        {slots.map((k) => {
          const offset = k - active;
          return (
            <motion.li
              key={k}
              initial={{ y: "375%", ...slotStyle(3), opacity: 0 }}
              animate={{ y: `${offset * 125}%`, ...slotStyle(offset) }}
              exit={{ y: "-375%", opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`absolute left-0 top-1/2 -mt-[calc(var(--pill-h)/2)] flex h-(--pill-h) origin-left items-center whitespace-nowrap rounded-full px-[1.6em] text-accent ${
                offset === 0 ? "border-2 border-accent font-normal" : "border border-accent/60 font-light"
              }`}
            >
              {pointAt(k)}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

// Mobile slots: a vertical stack on the left. The highlighted pill is full size
// and nudged right; the previous/next sit above/below at 76% size, scaled from
// their left edge. Each step moves everything up (as on desktop). y and x are
// percentages of the pill's own size, so they scale with it.
const MOBILE_SLOTS = {
  "-2": { x: "0%", y: "-230%", scale: 0.76, opacity: 0 },
  "-1": { x: "0%", y: "-114%", scale: 0.76, opacity: 0.6 },
  0: { x: "6.4%", y: "0%", scale: 1, opacity: 1 },
  1: { x: "0%", y: "116%", scale: 0.76, opacity: 0.6 },
  2: { x: "0%", y: "232%", scale: 0.76, opacity: 0 },
};

function MobilePointsTicker({ active }) {
  const slots = [active - 1, active, active + 1];

  return (
    <ul aria-hidden="true" className="relative h-[calc(var(--u)*7.3)] w-[calc(var(--u)*53.3)]">
      <AnimatePresence initial={false}>
        {slots.map((k) => {
          const offset = k - active;
          return (
            <motion.li
              key={k}
              initial={MOBILE_SLOTS[2]}
              animate={MOBILE_SLOTS[offset]}
              exit={MOBILE_SLOTS[-2]}
              transition={{ duration: 0.8, ease: EASE }}
              className={`absolute inset-0 flex origin-left items-center justify-center whitespace-nowrap rounded-full text-[calc(var(--u)*3.2)] text-accent ${
                offset === 0 ? "border-2 border-accent font-normal" : "border border-accent/70 font-light"
              }`}
            >
              {pointAt(k)}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((a) => a + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section
      id="hero"
      aria-label="Long Acting Reversible Contraceptives"
      // Mobile (as in the design): the photo spans the screen width under the 7.5rem
      // navbar and everything is laid over it, positioned in --u = 1% of the photo's
      // width, so the layout scales identically on every phone. The photo always
      // spans the full width so she stays against the right edge, as designed.
      className="relative flex flex-col overflow-hidden bg-[#f8e7cf] pt-30 [--u:1vw] md:min-h-svh md:bg-[#d4c5b0] md:pt-0"
    >
      <picture className="contents">
        <source media="(min-width: 768px)" srcSet="/home/hero/background.webp" />
        <img
          src={BLANK}
          alt=""
          draggable={false}
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        />
      </picture>

      {/* Mobile photo: 100u × 118.68u (1151×1366), directly under the navbar. */}
      <picture className="contents">
        <source media="(max-width: 767.98px)" srcSet="/home/hero/background-mobile.webp" />
        <img
          src={BLANK}
          alt=""
          draggable={false}
          fetchPriority="high"
          className="pointer-events-none absolute left-1/2 top-30 h-[calc(var(--u)*118.68)] w-[calc(var(--u)*100)] max-w-none -translate-x-1/2 object-cover md:hidden"
        />
      </picture>
      {/* Mobile: blend the photo's top edge into the cream behind the navbar. */}
      <div className="pointer-events-none absolute inset-x-0 top-30 h-[calc(var(--u)*8)] bg-linear-to-b from-[#f8e7cf] to-transparent md:hidden" />

      <div className="relative z-10 mx-auto h-[calc(var(--u)*118.68)] w-[calc(var(--u)*100)] md:mx-0 md:flex md:h-auto md:w-auto md:flex-1 md:flex-row md:items-start md:px-[4%] md:pb-24">
        {/* Mobile: heading centred at the top, points and CTA pinned on the left
            beside her (positions from the design). Desktop: left column. */}
        {/* Desktop: the heading's first line ends just above her hair. The photo is
            object-cover, so her hair top (30.9% down the 16:9 photo) lands at
            50svh - 0.1908 × max(56.28vw, 100svh); the column's top padding puts the
            first line 1.75rem above that, but never closer than 1.25rem under the
            8rem navbar. --f is the heading size. */}
        <div className="relative flex h-full flex-col items-center px-[calc(var(--u)*3)] pt-[calc(var(--u)*7.5)] text-center md:static md:block md:h-auto md:flex-initial md:px-0 md:pb-0 md:pt-[max(9.25rem,calc(50svh-0.1908*max(56.28vw,100svh)-1.75rem-1.02*var(--f)))] md:text-left md:[--f:clamp(1.875rem,min(4.2vw,7.5svh),5.25rem)]">
          <div className="flex w-full flex-col items-center md:block md:w-auto">
            <h1 className="font-display text-[calc(var(--u)*7.35)] font-bold leading-[1.02] tracking-[-0.01em] text-accent md:text-(length:--f) md:font-black">
              Long Acting Reversible <br />
              Contraceptives
            </h1>
            <p className="mt-[calc(var(--u)*2.6)] text-[calc(var(--u)*4.25)] font-light leading-[1.15] text-dark md:mt-[0.6em] md:text-[clamp(1.2rem,2.5vw,3rem)] md:leading-[1.2]">
              Contraception Designed <br />
              For Your Peace Of Mind
            </p>

            <div className="pointer-events-none absolute left-[calc(var(--u)*3.2)] top-[calc(var(--u)*48.1)] md:hidden">
              <MobilePointsTicker active={active} />
            </div>
          </div>

          <WhatsAppButton
            id="btn_home_finddoctor_hero_banner"
            className="btn-cta absolute left-[calc(var(--u)*5)] top-[calc(var(--u)*75.6)] inline-flex h-[calc(var(--u)*12.6)] w-[calc(var(--u)*30.7)] items-center justify-center rounded-[calc(var(--u)*3.6)] bg-accent-light-1 text-center text-[calc(var(--u)*3.95)] font-normal leading-[1.25] text-white shadow-soft transition-colors hover:bg-accent md:static md:mt-[clamp(1.5rem,3.5vw,3.5rem)] md:h-auto md:w-auto md:rounded-full md:px-[1.6em] md:py-[0.55em] md:leading-normal md:text-[clamp(1rem,1.65vw,2rem)]"
          >
            Find A Doctor <br className="md:hidden" />
            Near You
          </WhatsAppButton>
        </div>

        {/* Desktop: rotating benefit pills on the right */}
        <div className="pointer-events-none absolute right-0 top-1/2 hidden w-[33vw] -translate-y-[45%] text-[clamp(1rem,1.75vw,2.15rem)] [--pill-h:2.35em] [--pill-step:calc(var(--pill-h)*1.25)] md:block">
          <PointsTicker active={active} />
        </div>
      </div>

      {/* Screen-reader version of the rotating points. */}
      <ul className="sr-only">
        {POINTS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      {/* Desktop: static description strip */}
      <p
        className="relative z-10 hidden px-[2%] text-center leading-snug text-accent md:mb-[1.2vw] md:block md:py-[0.85em] md:text-sm lg:whitespace-nowrap lg:text-[1.22vw]"
        style={{ backgroundImage: "url(/home/hero/bottom-strip.png)", backgroundSize: "100% 100%" }}
      >
        {DESCRIPTION}
      </p>

      {/* Mobile: the description scrolls like the top ticker */}
      <div
        className="relative z-10 -mt-[calc(var(--u)*3.7)] overflow-hidden md:hidden"
        style={{ backgroundImage: "url(/home/hero/bottom-strip.png)", backgroundSize: "100% 100%" }}
      >
        <div className="flex w-max animate-marquee whitespace-nowrap py-[calc(var(--u)*1.8)] text-[calc(var(--u)*3.2)] text-accent will-change-transform motion-reduce:animate-none">
          <span className="px-8">{DESCRIPTION}</span>
          <span className="px-8" aria-hidden="true">
            {DESCRIPTION}
          </span>
        </div>
      </div>
    </section>
  );
}
