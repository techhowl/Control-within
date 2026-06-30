"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DURATION = 6500;

const SLIDES = [
  {
    title: "Experience Control Within",
    asterisk: true,
    sub: "Long-acting, reversible contraceptives. With one simple step, you get years of protection and control over your menstrual cycle.",
    cta: { label: "Find a doctor near you", href: "#consult", icon: "→" },
  },
  {
    eyebrow: "Contraceptive Implant",
    title: "A contraceptive that fits your terms & conditions.",
    sub: "Imagine not having to think about a pill daily, worrying about your partner carrying a condom, or committing to a permanent and often regrettable decision. The Contraceptive Implant solves all these problems.",
    tags: [
      "3 years — no daily effort",
      "Over 99% effective",
      "Discreet",
      "Reversible",
      "No recurring costs",
    ],
    cta: { label: "Watch a video on implants", href: "#videos", icon: "▶" },
  },
  {
    eyebrow: "Hormonal IUS",
    title: "Do heavy, painful periods ruin your plans? Now you have the upper hand.",
    sub: "Regain control over your body and cycle with the Hormonal IUS — a small T-shaped device placed in the uterus to help alleviate period pains, heavy menstrual bleeding, and more.",
    tags: [
      "Heavy bleeding & endometriosis",
      "Reduces blood loss",
      "Manages period pains",
      "Also a contraceptive",
      "Fertility returns within weeks",
    ],
    cta: { label: "Watch a video on hIUS", href: "#videos", icon: "▶" },
  },
  {
    title: "Be it periods or contraception, you should have the control you deserve.",
    sub: "Explore long-term hormonal contraceptive solutions that work quietly while you live your life.",
    cta: { label: "Know more", href: "#methods", icon: "→" },
  },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1400&auto=format&fit=crop",
];

const GRADIENT =
  "linear-gradient(160deg,rgba(96,76,145,0.10),rgba(8,151,157,0.06))";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchX = useRef(null);

  const count = SLIDES.length;
  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Drive both the progress bar and autoplay advance from one rAF loop.
  useEffect(() => {
    setProgress(0);
    if (paused || reduce) return;

    let raf;
    let start = null;
    const tick = (t) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setIndex((i) => (i + 1) % count);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, paused, reduce, count]);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchX.current = null;
  };

  const active = SLIDES[index];

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Hero"
      className="relative overflow-hidden bg-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto grid max-w-310 grid-cols-1 items-center gap-10 px-[5%] py-12 lg:min-h-[calc(100vh-110px)] lg:grid-cols-2 lg:py-16">
        {/* LEFT — slide content */}
        <div className="order-2 lg:order-1">
          <div key={index} className="animate-[fadeUp_0.6s_ease-out]">
            {active.eyebrow && (
              <span className="mb-4 inline-block rounded-full bg-accent-light-2/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {active.eyebrow}
              </span>
            )}
            <h1 className="font-clash text-4xl font-semibold leading-[1.08] tracking-tight text-dark md:text-6xl">
              {active.title}
              {active.asterisk && <span className="text-accent">*</span>}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {active.sub}
            </p>

            {active.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-dark/10 bg-surface px-3.5 py-1.5 text-xs font-medium text-text/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={active.cta.href}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-2 pr-6 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-base transition-transform group-hover:translate-x-0.5">
                {active.cta.icon}
              </span>
              {active.cta.label}
            </a>
          </div>

          {/* Nav: dots + count + progress */}
          <div className="mt-10 flex items-center gap-5">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-selected={i === index}
                  role="tab"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-7 bg-accent"
                      : "w-2 bg-dark/20 hover:bg-dark/40"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-muted">
              <b className="text-dark">{String(index + 1).padStart(2, "0")}</b> / {String(count).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-4 h-0.5 w-full max-w-xs overflow-hidden rounded-full bg-dark/10">
            <i
              className="block h-full rounded-full bg-accent"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* RIGHT — crossfading image stack */}
        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-hover sm:aspect-[5/4] lg:aspect-[4/5]">
            {IMAGES.map((src, i) => (
              <div
                key={src}
                aria-hidden={i !== index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `${GRADIENT},url('${src}')` }}
              />
            ))}

            {/* Arrows */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-dark shadow-soft backdrop-blur transition-colors hover:bg-surface"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-dark shadow-soft backdrop-blur transition-colors hover:bg-surface"
            >
              →
            </button>

            {/* Trust badge */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-surface/90 px-4 py-3 shadow-soft backdrop-blur">
              <div className="flex -space-x-2">
                <i
                  className="h-7 w-7 rounded-full border-2 border-surface"
                  style={{ background: "linear-gradient(135deg,#9b89c4,#604c91)" }}
                />
                <i
                  className="h-7 w-7 rounded-full border-2 border-surface"
                  style={{ background: "linear-gradient(135deg,#6ec6ca,#08979d)" }}
                />
                <i
                  className="h-7 w-7 rounded-full border-2 border-surface"
                  style={{ background: "linear-gradient(135deg,#d7ceeb,#9b89c4)" }}
                />
              </div>
              <span className="text-xs font-semibold text-dark">
                Trained gynaecologists.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
