"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Staggered animation for the About section content
const containerVariants = {
  hidden: {},
  show: { transition: { delayChildren: 0.1, staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 20 } },
};

export default function ControlWithinHero() {
  const ref = useRef(null);
  
  // Track scroll progress within this specific section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80px", "end start"],
  });

  // 👇 CHANGED: Removed the 'scale' transform so the image doesn't shrink and cause black side borders
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <section ref={ref} className="relative w-full bg-[#111111]">
      
      {/* =========================================
          FOLD 1 — STICKY HERO
      ========================================= */}
      <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full overflow-hidden">
        
        {/* Parallax Background */}
        {/* 👇 CHANGED: Removed 'scale' from the style prop here 👇 */}
        <motion.div style={{ opacity }} className="absolute inset-0">
          <img
            src="/about.avif"
            alt="Woman looking peaceful and confident"
            className="h-full w-full object-cover object-top"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent" />
        </motion.div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex h-full flex-col justify-start px-6 pt-16 md:px-12 md:pt-24 lg:pt-32">

          {/* Top Area: Tag + headline on the image */}
          <div className="flex w-full max-w-4xl flex-col">
            <span className="mb-4 text-sm md:text-base font-bold uppercase tracking-[0.2em] text-[#F9F6F0]">
              Why We're Here
            </span>
            <h2 className="font-author text-4xl font-bold leading-[1.15] text-[#F9F6F0] sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              Women Don't Lack Options.<br className="hidden md:block" /> They Lack Peace Of Mind.
            </h2>
          </div>

        </div>
      </div>

      {/* =========================================
          FOLD 2 — ABOUT REVEAL (Overlaps Hero)
      ========================================= */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 w-full rounded-t-[2.5rem] md:rounded-t-[4rem] bg-gradient-to-b from-bg to-accent-light-2 px-6 py-15 -mt-12 md:-mt-24 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          
          <motion.div variants={itemVariants} className="flex flex-col gap-6 text-lg md:text-xl leading-relaxed text-[#444444] max-w-3xl">
            <p>
              Most contraception puts the effort on you. Remember the pill. Buy condoms. Hope your partner cooperates. Additionally, for many women, every month comes with days lost to heavy bleeding, debilitating cramps, and fatigue that gets dismissed as normal. 
            </p>
            <p>
              Control Within exists to solve these problems. To bring awareness about two long-term, reversible, doctor-placed contraceptives that work quietly in the background. No daily reminders, no dependence on anyone else, no permanent decisions.
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-10 font-author text-2xl italic text-[#4A5D58]"
          >
            Your body. Your timeline. Your control.
          </motion.p>
          
        </div>
      </motion.div>
      
    </section>
  );
}