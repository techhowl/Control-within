"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Minimalist line icons. */
const Clock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const ShieldCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);
const BellOff = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M8.7 5.2A5 5 0 0 1 17 9c0 4 1.5 5 1.5 5M5.5 9c0 4-1.5 5-1.5 5h11" />
    <path d="M10 19a2 2 0 0 0 4 0M3 3l18 18" />
  </svg>
);
const Refresh = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.5 5.8L4 16M4 20v-4h4" />
  </svg>
);

const LEFT = [
  { Icon: Clock, text: "Up to 5 years of protection from a single placement." },
  { Icon: ShieldCheck, text: "Over 99% effective — among the most reliable methods available." },
];
const RIGHT = [
  { Icon: BellOff, text: "No daily pills, no pharmacy runs, no reminders." },
  { Icon: Refresh, text: "Fully reversible — fertility returns quickly after removal." },
];

const SPRING = { type: "spring", stiffness: 120, damping: 18 };
const VIEWPORT = { once: true, amount: 0.3 };

function FeatureItem({ Icon, text, side, reduce }) {
  const offset = reduce ? 0 : side === "left" ? -20 : 20;
  const alignment =
    side === "left" ? "items-end text-right" : "items-start text-left";
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: offset },
        show: { opacity: 1, x: 0, transition: SPRING },
      }}
      className={`flex flex-col gap-3 ${alignment}`}
    >
      <span className="text-dark/70">
        <Icon className="h-6 w-6" />
      </span>
      <span className="h-px w-12 bg-dark/15" />
      <p className="max-w-[13rem] text-sm leading-relaxed text-muted">{text}</p>
    </motion.div>
  );
}

export default function FeatureProduct() {
  const reduce = useReducedMotion();
  const group = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            Why It Works
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Designed around your life
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Left features */}
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="order-2 flex flex-col gap-12 lg:order-1 lg:items-end"
          >
            {LEFT.map((f) => (
              <FeatureItem key={f.text} {...f} side="left" reduce={reduce} />
            ))}
          </motion.div>

          {/* Center image (capsule silhouette) */}
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 mx-auto lg:order-2"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-[6rem] bg-accent-light-2/30 blur-2xl" aria-hidden="true" />
              <div className="relative mx-auto h-[380px] w-[210px] overflow-hidden rounded-[7rem] shadow-hover sm:h-[460px] sm:w-[250px]">
                <img
                  src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=900&auto=format&fit=crop"
                  alt="Living confidently with long-term contraception"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Right features */}
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="order-3 flex flex-col gap-12 lg:items-start"
          >
            {RIGHT.map((f) => (
              <FeatureItem key={f.text} {...f} side="right" reduce={reduce} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
