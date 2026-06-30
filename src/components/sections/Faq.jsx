"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

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

export default function Faq() {
  const [open, setOpen] = useState(null);

  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-[5%]">
        <Reveal className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Your Questions
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Still Thinking It Over?
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-10 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-dark/8 bg-surface"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-dark"
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent-light-2/60 text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
