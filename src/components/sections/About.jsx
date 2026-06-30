"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { delayChildren: 0.1, staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
};

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.55]);

  return (
    <section id="about" ref={ref} className="relative">
      {/* FOLD 1 — sticky hero */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ scale, opacity }} className="absolute inset-0">
          <img src="/wecare.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-dark/45" />
        </motion.div>

        <div className="relative z-10 flex h-full flex-col justify-between px-[5%] pb-8 pt-28">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-xs text-sm font-medium uppercase tracking-[0.18em] text-white/85">
              Your body. Your timeline.
            </p>
            <a
              href="#consult"
              className="shrink-0 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              Find a doctor
            </a>
          </div>

          <h2 className="font-clash text-[15vw] font-bold uppercase leading-[0.85] tracking-tight text-white">
            Own{" "}
            <span className="font-author text-[11vw] font-medium italic text-accent-light-2">
              your
            </span>{" "}
            control.
          </h2>
        </div>
      </div>

      {/* FOLD 2 — about reveal rising over the hero */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative z-10 rounded-t-[3rem] bg-accent-light-2/60 px-[5%] py-20 md:py-28"
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h3
            variants={item}
            className="font-clash text-3xl font-bold uppercase leading-tight tracking-tight text-dark sm:text-4xl md:text-5xl"
          >
            Control Within was built{" "}
            <span className="font-author lowercase italic text-accent">for</span> women
            who want <span className="text-accent">peace of mind.</span>
          </motion.h3>

          <motion.p
            variants={item}
            className="mt-6 font-medium text-muted"
          >
            Long-term. Reversible. Completely private.
          </motion.p>

          <motion.p
            variants={item}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-dark/70"
          >
            Most contraception puts the effort on you — daily pills, pharmacy runs,
            hoping your partner cooperates. Control Within is about long-term,
            reversible, doctor-placed methods that work quietly in the background.
            No daily reminders. No dependence. No permanent decisions.
          </motion.p>

          <motion.div variants={item} className="mt-8">
            <a
              href="#consult"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
            >
              Chat with a doctor <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
