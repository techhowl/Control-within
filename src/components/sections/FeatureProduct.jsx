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
  { Icon: Clock, text: "One step. Years of peace." },
  { Icon: ShieldCheck, text: "Reversible. Reliable. Yours." },
];
const RIGHT = [
  { Icon: BellOff, text: "No daily reminders. No partner dependence." },
  { Icon: Refresh, text: "Control that stays with you." },
];

const SPRING = { type: "spring", stiffness: 120, damping: 18 };
const VIEWPORT = { once: true, amount: 0.3 };

function FeatureItem({ Icon, text, side, reduce }) {
  const offset = reduce ? 0 : side === "left" ? -20 : 20;
  const alignment =
    side === "left"
      ? "items-center text-center lg:items-end lg:text-right"
      : "items-center text-center lg:items-start lg:text-left";
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
      <p className="max-w-[13rem] text-[0.85rem] leading-relaxed text-muted">{text}</p>
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
    <section className="bg-surface py-10 md:py-15">
      <div className="mx-auto max-w-310 px-[5%]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xm font-semibold uppercase tracking-[0.22em] text-accent">
            Why It Works
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-4xl">
            Designed around your life
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-3 lg:gap-8">
          {/* Left features - Updated for 2-column mobile layout */}
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="order-2 grid grid-cols-2 gap-4 lg:order-1 lg:flex lg:flex-col lg:items-end lg:gap-12"
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
              {/* Reduced default (mobile) height and width, kept md: variables identical */}
              <div className="relative mx-auto h-[220px] w-[120px] overflow-hidden rounded-[7rem] shadow-hover md:h-[460px] md:w-[250px]">
                <img
                  src="/2ndfold.png"
                  alt="Living confidently with long-term contraception"
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Right features - Updated for 2-column mobile layout */}
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="order-3 grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:items-start lg:gap-12"
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