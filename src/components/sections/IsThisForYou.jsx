"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const CARDS = [
  {
    theme: "purple",
    title: "The Contraceptive Implant may be right for you if:",
    items: [
      'The "did I take my pill?" anxiety is a daily ritual you’re tired of',
      "You depend on your partner for contraception",
      "You want long-term protection with zero recurring effort or cost",
      "You want privacy. Nothing to carry, hide, or explain",
      "You’re not ready for a baby, but you’re not ready to make that permanent either",
    ],
  },
  {
    theme: "teal",
    title: "The Hormonal IUS may be right for you if:",
    items: [
      "Your periods are heavy, painful, or unpredictable — and costing you days every month",
      "You have PCOS, endometriosis, or fibroids",
      "You want contraception that offers relief too",
      "Your cramping and fatigue are dismissed as normal",
      "You want long-term protection with a lower hormonal load than a daily pill",
    ],
  },
];

const Chevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);

function Item({ item, accent }) {
  return (
    <li className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-text">
      <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white ${accent}`}>
        <Check />
      </span>
      {item}
    </li>
  );
}

/**
 * One "may be right for you if" card. Mobile shows the first point and folds
 * the rest behind a "read more" toggle (like the process cards); md+ always
 * shows every point. The fold animates grid rows 0fr→1fr so it opens to the
 * content's natural height.
 */
function Card({ card, delay }) {
  const [open, setOpen] = useState(false);
  const accent = card.theme === "purple" ? "bg-accent" : "bg-teal-deep";
  const textAccent = card.theme === "purple" ? "text-accent" : "text-teal-deep";
  const [first, ...rest] = card.items;
  const restId = `for-you-${card.theme}-more`;

  return (
    <Reveal delay={delay} className="rounded-[1.75rem] border border-dark/8 bg-surface p-5 shadow-soft md:p-7">
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-white ${accent}`}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <h3 className="font-clash text-lg font-semibold text-dark">{card.title}</h3>
      </div>

      <ul className="mt-4 md:mt-5">
        <Item item={first} accent={accent} />
      </ul>
      <div
        id={restId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out md:visible md:grid-rows-[1fr] ${
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="space-y-3 pt-3">
            {rest.map((item) => (
              <Item key={item} item={item} accent={accent} />
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        id={`btn_home_readmore_foryou_${card.theme}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={restId}
        className={`btn-readmore -mb-3 -mt-1 flex min-h-11 w-full items-center justify-end gap-1.5 text-[13px] font-semibold tracking-wide md:hidden ${textAccent}`}
      >
        {open ? "Show less" : "Click to read more"}
        <Chevron open={open} />
      </button>
    </Reveal>
  );
}

export default function IsThisForYou() {
  return (
    <section
      id="for-you"
      className="bg-gradient-to-b from-accent-light-2 to-bg pb-6 pt-8 md:pb-8 md:pt-15"
    >
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <span aria-hidden="true">✱</span> Is This For You?
          </span>
          <h2 className="mt-3 text-balance font-clash text-[min(6.2vw,1.875rem)] font-semibold text-dark md:mt-4 md:text-4xl">
            If Any Of This Sounds Like You, Keep Reading.
          </h2>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {CARDS.map((card, i) => (
            <Card key={card.title} card={card} delay={(i + 1) * 80} />
          ))}
        </div>

        <Reveal delay={240} className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-4 text-center md:mt-10 md:gap-5">
          <p className="text-sm text-muted md:text-base">
            Both methods are reversible, doctor-placed, and require no daily
            action. A gynaecologist can help you decide which fits your life.
          </p>
          <WhatsAppButton
            id="btn_home_chat_isthisforyou"
            className="btn-chat inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
          >
            Chat On WhatsApp <span aria-hidden="true">→</span>
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}
