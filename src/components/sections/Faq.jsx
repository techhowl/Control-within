"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  { q: "Is it permanent?", a: "No. Both methods are fully reversible. You choose when to have them removed." },
  { q: "Will my fertility be affected?", a: "No. Your fertility returns quickly — most women can get pregnant within a few weeks to months after removal." },
  { q: "Will it change my hormones?", a: "The hormone dose is much lower than a standard daily pill. Changes to your natural hormone levels are small and steady." },
  { q: "Are there any side effects?", a: "Your periods will likely change — they may become lighter, less frequent, or in some cases stop altogether — and this is completely normal and safe. Some women also notice mild and temporary side effects in the first few months, which usually settle as the body adjusts." },
  { q: "How effective is it really?", a: "They are among the most effective contraceptive methods available — over 99% effective." },
  { q: "Is it safe for young women?", a: "Yes. Both methods are suitable for adult women of reproductive age. A doctor will review your health history before recommending the right option." },
  { q: "What is the difference between the Implant and hIUS?", a: "The implant is placed in the arm and lasts up to 3 years. It is best for women who want a low-maintenance option. The hIUS is placed in the uterus, lasts up to 5 years, and also reduces heavy bleeding and cramps. Both are over 99% effective." },
  { q: "Can anyone tell if it’s there?", a: "No, they are designed to be completely discreet. It is entirely your private choice, with no visible signs from the outside." },
  { q: "Can I use it after having a baby?", a: "Yes. Both methods are commonly used postpartum. A gynaecologist will advise on the right timing based on your delivery and recovery." },
  { q: "How simple is the procedure?", a: "The procedure is done by a trained doctor and is usually over in minutes. Most women are able to resume their normal routine the same day or the next day." },
  { q: "How much does it cost?", a: "There is an upfront cost for getting it placed and no recurring purchases after that. A doctor consultation will give you exact pricing for your city and clinic." },
  { q: "How do I find a trained doctor near me?", a: "We will connect you to a trained gynaecologist in your city via WhatsApp." },
];

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-dark/5 bg-[#f6f4fb]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-base font-medium text-dark">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors ${
            isOpen ? "bg-accent text-white" : "bg-accent-light-2 text-accent"
          }`}
        >
          <Chevron />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-[5%] lg:grid-cols-2 lg:gap-16">
        {/* Left column — text */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light-2 px-3 py-1 text-xs font-semibold text-accent">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.7M12 17h.01" />
            </svg>
            Frequently asked questions
          </span>
          <h2 className="mt-5 font-clash text-4xl font-semibold leading-tight text-dark md:text-5xl">
            Frequently asked <span className="text-accent">questions</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Everything worth knowing before you talk to a doctor — clear and
            judgement-free. Still unsure? We’ll connect you to a gynaecologist on
            WhatsApp.
          </p>
          <a
            href="#consult"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
          >
            Chat with a doctor <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Right column — accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
