"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const METHODS = {
  implant: {
    label: "Implant",
    small: "Contraceptive Implant",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop",
    imageAlt: "Person living confidently with the contraceptive implant",
    badgeTL: "Discreet & invisible",
    badgeTR: "Under the skin · upper arm",
    vfNum: "3",
    vfUnit: "years of protection",
    vfCap: "One quick placement. Years of cover with no daily action.",
    eyebrow: "Contraceptive Implant · Implant",
    title: "Control Over Contraception",
    lead: "A tiny rod placed under the skin of your upper arm — set it once and forget about contraception for years.",
    stats: [
      { num: "3 yr", label: "Duration", back: "Up to 3 years of continuous protection from one placement." },
      { num: "<10", label: "Minutes", back: "Insertion or removal takes under 10 minutes in-clinic." },
      { num: "0", label: "Daily effort", back: "No pills, no reminders. Fertility returns quickly after removal." },
    ],
    feats: [
      "Inserted under the skin of the upper arm",
      "Fertility returns quickly after removal",
      "Discreet — fully invisible once placed",
      "No recurring pharmacy costs",
      "Helps reduce risk of iron-deficiency anaemia",
    ],
    cta: "Know More About Implants",
  },
  hius: {
    label: "hIUS",
    small: "Hormonal IUS",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop",
    imageAlt: "Person living free from heavy, painful periods",
    badgeTL: "Eases heavy periods",
    badgeTR: "T-shaped · in the uterus",
    vfNum: "5",
    vfUnit: "years of protection",
    vfCap: "Contraception plus relief from heavy bleeding and period pain.",
    eyebrow: "Hormonal IUS · hIUS",
    title: "Control Over Heavy Bleeding & Endometriosis",
    lead: "A small T-shaped device placed in the uterus that lightens periods, calms cramps, and protects — all at once.",
    stats: [
      { num: "5 yr", label: "Duration", back: "Works up to 5 years from a single placement." },
      { num: "↓", label: "Bleeding", back: "Significantly reduces heavy menstrual bleeding and cramps." },
      { num: "↺", label: "Reversible", back: "Fully reversible — fertility returns within weeks of removal." },
    ],
    feats: [
      "Reduces heavy menstrual bleeding",
      "Effectively manages endometriosis symptoms",
      "Relieves severe cramps and pelvic pain during periods",
      "Helps protect against iron-deficiency anaemia",
      "Lower hormone exposure than a daily pill",
    ],
    cta: "Know More About hIUS",
  },
};

export default function Methods() {
  const [active, setActive] = useState("implant");
  const data = METHODS[active];
  const isPurple = active === "implant";
  const theme = isPurple
    ? { ring: "from-accent/10 to-teal-deep/5", accentText: "text-accent", accentBg: "bg-accent", accentHover: "hover:bg-accent-hover", chip: "bg-accent-light-2/60 text-accent" }
    : { ring: "from-teal-deep/10 to-accent/5", accentText: "text-teal-deep", accentBg: "bg-teal-deep", accentHover: "hover:bg-teal-hover", chip: "bg-teal/20 text-teal-deep" };

  return (
    <section id="methods" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The Methods
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Make The Choice That Fits Your Life
          </h2>
        </Reveal>

        {/* Segmented switch */}
        <Reveal delay={80} className="mt-10 flex justify-center">
          <div
            className="relative grid w-full max-w-md grid-cols-2 rounded-full bg-cream p-1.5"
            role="tablist"
            aria-label="Choose a method"
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-surface shadow-soft transition-transform duration-300 ${
                isPurple ? "" : "translate-x-full"
              }`}
            />
            {Object.entries(METHODS).map(([key, m]) => (
              <button
                key={key}
                role="tab"
                aria-selected={active === key}
                onClick={() => setActive(key)}
                className={`relative z-10 rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                  active === key ? "text-dark" : "text-muted"
                }`}
              >
                {m.label}{" "}
                <small className="block text-[0.7rem] font-medium opacity-70">
                  {m.small}
                </small>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Panel */}
        <div key={active} className="mt-12 grid animate-[fadeUp_0.5s_ease-out] grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Visual */}
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src={data.image}
              alt={data.imageAlt}
              loading="lazy"
              className="h-full min-h-80 w-full object-cover"
            />
            <span className={`absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${theme.chip} backdrop-blur`}>
              {data.badgeTL}
            </span>
            <span className="absolute right-4 top-4 rounded-full bg-surface/85 px-3 py-1.5 text-xs font-medium text-dark backdrop-blur">
              {data.badgeTR}
            </span>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/85 to-transparent p-6 pt-16 text-white">
              <div className="flex items-end gap-2">
                <span className="font-clash text-4xl font-semibold leading-none">{data.vfNum}</span>
                <span className="mb-1 text-sm opacity-90">{data.vfUnit}</span>
              </div>
              <p className="mt-2 text-sm opacity-85">{data.vfCap}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${theme.accentText}`}>
              {data.eyebrow}
            </span>
            <h3 className="mt-2 font-clash text-2xl font-semibold text-dark md:text-3xl">
              {data.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">{data.lead}</p>

            {/* Flip stat cards */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {data.stats.map((stat) => (
                <div
                  key={stat.label}
                  tabIndex={0}
                  className="group h-28 [perspective:1000px] focus:outline-none"
                >
                  <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
                    {/* front */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-dark/8 bg-surface p-3 text-center [backface-visibility:hidden]">
                      <span className="absolute right-2 top-2 text-[0.6rem] font-medium uppercase tracking-wide text-muted/60">
                        hover
                      </span>
                      <div className={`font-clash text-2xl font-semibold ${theme.accentText}`}>
                        {stat.num}
                      </div>
                      <div className="mt-1 text-xs font-medium text-muted">{stat.label}</div>
                    </div>
                    {/* back */}
                    <div className={`absolute inset-0 flex items-center justify-center rounded-2xl p-3 text-center text-xs leading-snug text-white [backface-visibility:hidden] [transform:rotateY(180deg)] ${theme.accentBg}`}>
                      {stat.back}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-2.5">
              {data.feats.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-text">
                  <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white ${theme.accentBg}`}>
                    <Check />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#consult"
              className={`mt-7 inline-flex w-fit items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors ${theme.accentBg} ${theme.accentHover}`}
            >
              {data.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
