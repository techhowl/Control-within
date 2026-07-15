"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const Arrow = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

const METHODS = [
  {
    headline: "Control Over Contraception",
    productLabel: "Contraceptive Implant",
    productName: "Implant",
    duration: "3 years",
    details: [
      "Inserted under the skin of the upper arm",
      "Works up to 3 years",
      "Under 10 minutes to insert or remove",
      "No daily action required",
      "Fertility returns quickly after removal",
      "Discreet. Fully invisible once placed",
      "No recurring pharmacy costs",
      "Helps reduce risk of iron-deficiency anaemia",
    ],
    cta: "Know More About Implants",
    image: "/implant_1.png",
    imageMobile: "/implant_mobile.png",
    accent: "#614c91",
    href: "/implant",
  },
  {
    headline: "Control Over Heavy Menstrual Bleeding And Endometriosis",
    productLabel: "Hormonal IUS",
    productName: "hIUS",
    duration: "5 years",
    details: [
      "Small T-shaped device placed in the uterus",
      "Works up to 5 years",
      "Reduces Heavy Menstrual Bleeding",
      "Effectively manages endometriosis symptoms",
      "Relieves severe cramps and pelvic pain, during periods",
      "Helps protect against iron-deficiency anaemia",
      "Fully reversible. Fertility returns within weeks after removal",
      "No daily action required",
      "Lower hormone exposure than a daily pill",
    ],
    cta: "Know More About hIUS",
    image: "/IUS_1.png",
    imageMobile: "/IUS_mobile.png",
    accent: "#085b5c",
    href: "/ius",
  },
];

const SPRING = { type: "spring", stiffness: 260, damping: 26 };
const imageV = { hide: { opacity: 1, scale: 1 }, show: { opacity: 0.12, scale: 1.08 } };
const minimalV = { hide: { opacity: 1 }, show: { opacity: 0 } };
const panelV = { hide: { y: 44, opacity: 0 }, show: { y: 0, opacity: 1 } };

function MethodCard({ m }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const state = open ? "show" : "hide";
  const transition = reduce ? { duration: 0.2 } : SPRING;

  return (
    <motion.article
      tabIndex={0}
      aria-label={m.productLabel}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      className={`relative ${
        open ? "h-auto" : "aspect-[351/240]"
      } md:aspect-auto md:h-[560px] w-full cursor-pointer overflow-hidden rounded-3xl shadow-soft outline-none transition-shadow hover:shadow-hover focus-visible:ring-2 focus-visible:ring-accent`}
    >
      {/* Background container holding the image */}
      <motion.div
        variants={imageV}
        animate={state}
        transition={transition}
        className={`absolute inset-0 ${open ? "hidden md:block" : "block"}`}
        style={{ backgroundColor: `${m.accent}50` }}
      >
        <img
          src={m.image}
          alt=""
          className="hidden h-full w-full object-contain p-10 pb-36 md:block"
          draggable={false}
        />
        <img
          src={m.imageMobile}
          alt=""
          className="block h-full w-full object-contain p-12 md:hidden"
          draggable={false}
        />
      </motion.div>

      {/* Minimal details (default state) */}
      <motion.div
        variants={minimalV}
        animate={state}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-5"
      >
        <div className="flex justify-end">
          <span className="flex items-center gap-1 rounded-full bg-dark/10 px-3 py-1 text-xm font-semibold text-white backdrop-blur-sm">
            <Shield /> {m.duration}
          </span>
        </div>
        
        <div className="flex w-full flex-col">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-white/80">
              {m.productLabel}
            </span>
            <h3 className="font-clash text-xl md:text-2xl font-semibold text-white">
              {m.headline}
              {/* Mobile simple arrow indicator appended strictly inline */}
              <span className="inline-block md:hidden align-middle ml-2">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/90" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Revealed white content block */}
      <motion.div
        variants={panelV}
        animate={state}
        transition={transition}
        style={{ pointerEvents: open ? "auto" : "none" }}
        className={`${
          open ? "static overflow-visible" : "absolute inset-0 overflow-hidden"
        } flex flex-col bg-surface p-5 md:absolute md:inset-0 md:overflow-y-auto md:p-7`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: m.accent }}>
          {m.productLabel} · {m.productName}
        </span>
        <h3 className="mt-2 font-clash text-xl font-semibold leading-tight text-dark">{m.headline}</h3>
        <ul className="mt-5 space-y-2">
          {m.details.map((d) => (
            <li key={d} className="flex items-start gap-2.5 text-[0.85rem] leading-snug text-text">
              <span
                className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white"
                style={{ backgroundColor: m.accent }}
              >
                <Check />
              </span>
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex justify-end pt-5 pb-2 md:pb-0">
          {m.href.includes("wa.me") ? (
            <WhatsAppButton
              onClick={(e) => e.stopPropagation()} // Prevents the card from closing when clicked
              className="inline-flex items-center gap-2 rounded-full bg-dark py-2 pl-5 pr-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {m.cta}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-dark">
                <Arrow />
              </span>
            </WhatsAppButton>
          ) : (
            <a
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-full bg-dark py-2 pl-5 pr-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              {m.cta}
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-dark">
                <Arrow />
              </span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function Methods() {
  return (
    <section id="methods" className="bg-bg py-10 md:py-15">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xm font-semibold uppercase tracking-[0.18em] text-accent">
            The Methods
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-4xl">
            Make The Choice That Fits Your Life
          </h2>
          <p className="mt-4 text-base text-muted">
            Two long-term, reversible, doctor-placed options.
          </p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {METHODS.map((m) => (
            <Reveal key={m.productName} delay={80}>
              <MethodCard m={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}