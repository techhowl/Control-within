"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const FEATURES = [
  "Fully reversible, whenever you choose",
  "Invisible and completely private",
  "No daily pills or pharmacy runs",
];

function CountUp({ target = 99, suffix = "%+", duration = 1500 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      let raf;
      let start = null;
      const tick = (t) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }

    let cleanup;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cleanup = run();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup?.();
    };
  }, [target, duration]);

  return (
    <span ref={ref} className="font-clash text-6xl font-semibold text-accent">
      {value}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Visual */}
          <Reveal className="relative">
            <div className="overflow-hidden rounded-[2rem] shadow-hover">
              <img
                src="/wecare.jpg"
                alt="A woman feeling confident and in control of her health choices"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 max-w-[15rem] rounded-3xl bg-surface p-5 shadow-hover sm:right-6">
              <h4 className="font-clash text-lg font-semibold text-dark">
                Your timeline, your call.
              </h4>
              <p className="mt-2 text-sm text-muted">
                Long-term protection that bends to your life — not the other way
                around.
              </p>
              <a
                href="#methods"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
              >
                Read More <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal delay={80}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <span aria-hidden="true">✱</span> Why We’re Here
            </span>
            <h2 className="mt-3 font-clash text-3xl font-semibold leading-tight text-dark md:text-4xl">
              Women Don’t Lack Options. They Lack Peace Of Mind.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Most contraception puts the effort on you. Remember the pill. Buy
              condoms. Hope your partner cooperates. And for many women, every
              month comes with days lost to heavy bleeding, debilitating cramps,
              and fatigue that gets dismissed as normal. Control Within exists to
              solve these problems — to bring awareness about two long-term,
              reversible, doctor-placed contraceptives that work quietly in the
              background. No daily reminders, no dependence on anyone else, no
              permanent decisions.
            </p>
            <p className="mt-5 font-author text-xl italic text-dark">
              Your body. Your timeline. Your control.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-clash text-base font-semibold text-dark">
                  What Sets It Apart
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-text">
                      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-white">
                        <Check />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#methods"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
                >
                  Know More <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="flex flex-col justify-center rounded-3xl border border-dark/8 bg-surface p-6 text-center shadow-soft">
                <CountUp />
                <div className="mt-1 text-sm font-semibold text-dark">Effective</div>
                <p className="mt-2 text-xs text-muted">
                  Among the most reliable contraceptive options available today.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
