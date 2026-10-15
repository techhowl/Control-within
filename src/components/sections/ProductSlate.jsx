"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

const LANGS = [
  ["en", "English"],
  ["hi", "हिंदी"],
];

const Play = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Ribbon placement from the design, as fractions of the video width (--cw on
// desktop, 70vw on mobile). "top" tucks behind the video; "bottom" and "mobile"
// loop over its lower corner.
// Each ribbon also carries its image's pixel size: the <img> needs real
// dimensions before it loads, otherwise a ribbon starting in a clipped area has
// zero height there and lazy loading never fires.
const RIBBONS = {
  implant: {
    size: { top: [388, 572], bottom: [310, 536] },
    top: "left-[40.7%] top-[calc(var(--cw)*-0.381)] w-[44.7%]",
    bottom: "left-[72.1%] top-[calc(var(--cw)*0.247)] w-[35.7%]",
    mobile: "left-[76.3%] top-[10.4vw] w-[38.9%]",
  },
  ius: {
    size: { top: [389, 571], bottom: [323, 534] },
    top: "left-[27.7%] top-[calc(var(--cw)*-0.383)] w-[44.9%]",
    bottom: "left-[-7.8%] top-[calc(var(--cw)*0.239)] w-[37.3%]",
    mobile: "left-[-12.1%] top-[10.4vw] w-[38.9%]",
  },
};

/**
 * Classes for one bullet. Mobile centres each bullet with its dot inline before
 * the first word; desktop is left-aligned with a hanging dot, or right-aligned
 * with an inline dot when `reverse`.
 */
function bulletClasses(reverse) {
  const mobile = "text-center text-pretty";
  const mobileDot = "mb-[0.15em] mr-[0.45em] inline-block align-middle";
  const desktop = reverse ? "lg:block lg:text-right" : "lg:flex lg:items-start lg:gap-3 lg:text-left";
  const desktopDot = reverse
    ? "lg:mb-[0.15em] lg:mr-[0.5em] lg:mt-0 lg:inline-block lg:align-middle"
    : "lg:mb-0 lg:mr-0 lg:mt-[0.55em] lg:block lg:flex-none";
  return { item: `${mobile} ${desktop}`, dot: `${mobileDot} ${desktopDot}` };
}

/**
 * Product fold: headline, a purple panel of benefit bullets that runs off one
 * screen edge, and a bilingual YouTube explainer overlapping the panel's inner
 * edge with a teal ribbon curling round it. `reverse` mirrors it (hIUS: video
 * left, panel right, bullets right-aligned) and uses the darker panel.
 * `mobileOrder` lists the tag indexes in the order the mobile list shows them
 * (defaults to the given order). On mobile the bullets are one centred column.
 *
 * Desktop: heading, then the panel (in flow, at least 0.72 × the video width tall,
 * growing with its text) with the video overlapping its inner edge. Everything is
 * sized from --cw, the video width (40vw, at most 48rem). The top ribbon rises
 * 0.3 × --cw above the panel; the implant fold sits right under the hero, which
 * clips it, so that fold's top padding grows enough to keep the ribbon inside.
 */
export default function ProductSlate({ id, slug, title, tags, videos, cover, reverse = false, mobileOrder }) {
  const [lang, setLang] = useState("en");
  const [playing, setPlaying] = useState(false);
  const src = videos[lang];
  const order = mobileOrder ?? tags.map((_, i) => i);
  const ribbon = RIBBONS[slug];

  return (
    <section
      id={id}
      aria-labelledby={`${slug}-slate-title`}
      className="relative overflow-x-clip pb-[7vw] lg:scroll-mt-32 lg:pb-[clamp(2rem,3vw,3.5rem)] lg:[--cw:min(40vw,48rem)]"
    >
      <Reveal
        className={`relative z-10 px-[5%] pt-8 text-center ${
          reverse
            ? "lg:pt-[clamp(2rem,3vw,3.5rem)]"
            : "lg:pt-[max(clamp(2rem,3vw,3.5rem),calc(var(--cw)*0.27-2.5rem-clamp(2rem,3.5vw,4rem)))]"
        }`}
      >
        <h2 id={`${slug}-slate-title`} className="font-clash text-[min(6.2vw,1.875rem)] font-semibold text-dark md:text-4xl">
          {title}
        </h2>
      </Reveal>

      {/* Stage: panel + video. Mobile stacks them; desktop positions them absolutely. */}
      <div className="relative mx-[4.5%] mt-6 lg:mx-0 lg:mt-[clamp(2rem,3.5vw,4rem)] lg:pb-[max(0px,calc(3.5rem-var(--cw)*0.03))]">
        <div
          className={`rounded-2xl px-[3.5vw] pb-[23.5vw] pt-[4.5vw] lg:flex lg:min-h-[calc(var(--cw)*0.72)] lg:items-center lg:py-[calc(var(--cw)*0.05)] ${
            reverse
              ? "bg-accent lg:ml-auto lg:w-[calc(100%-3.5vw-var(--cw)*0.927)] lg:justify-end lg:rounded-r-none lg:pl-[calc(var(--cw)*0.073+3vw)] lg:pr-[3.6vw]"
              : "bg-accent-light-1 lg:left-0 lg:w-[calc(100%-3.6vw-var(--cw)*0.941)] lg:rounded-l-none lg:pl-[3.3vw] lg:pr-[calc(var(--cw)*0.059+3vw)]"
          }`}
        >
          <ul
            className={`flex flex-col items-center gap-[2.6vw] text-[clamp(0.75rem,3.4vw,1.125rem)] leading-snug text-white lg:gap-[min(2vw,2.25rem)] lg:text-[clamp(1rem,1.75vw,2.1rem)] ${
              reverse ? "lg:items-end" : "lg:items-stretch"
            }`}
          >
            {tags.map((t, i) => {
              const pos = order.indexOf(i);
              const c = bulletClasses(reverse);
              return (
                <Reveal
                  as="li"
                  key={t}
                  delay={i * 80}
                  className={`order-(--mo) lg:order-0 ${c.item}`}
                  style={{ "--mo": pos }}
                >
                  <span className={`h-[0.3em] w-[0.3em] rounded-full bg-white ${c.dot}`} />
                  <span>{t}</span>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <div
          className={`relative z-10 mx-auto mt-[-20.5vw] flex w-[70vw] flex-col items-center lg:absolute lg:top-[calc(var(--cw)*0.08)] lg:mt-0 lg:w-(--cw) ${
            reverse ? "lg:left-[3.5vw]" : "lg:right-[3.6vw]"
          }`}
        >
          <img
            src={`/home/${slug}/ribbon-top.png`}
            width={ribbon.size.top[0]}
            height={ribbon.size.top[1]}
            alt=""
            draggable={false}
            loading="lazy"
            className={`pointer-events-none absolute z-0 hidden lg:block ${ribbon.top}`}
          />

          <div className="relative z-10 aspect-video w-full overflow-hidden rounded-[clamp(0.75rem,1.4vw,1.75rem)] bg-cream shadow-soft">
            {playing && src ? (
              <iframe
                key={src}
                src={`${src}?autoplay=1&rel=0`}
                title={`${title} (${lang === "hi" ? "Hindi" : "English"})`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                id={`btn_home_watchvideo_${slug}_${lang === "hi" ? "hin" : "eng"}`}
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${title}`}
                className="btn-video group absolute inset-0"
              >
                <img src={cover} alt="" draggable={false} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 bg-dark/15 transition-colors group-hover:bg-dark/25" />
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-accent shadow-hover transition-transform group-hover:scale-110 lg:h-16 lg:w-16">
                  <Play />
                </span>
              </button>
            )}
          </div>

          {/* Ribbon loop over the video's lower corner (pointer-events off so the player stays clickable). */}
          <img
            src={`/home/${slug}/ribbon-bottom.png`}
            width={ribbon.size.bottom[0]}
            height={ribbon.size.bottom[1]}
            alt=""
            draggable={false}
            loading="lazy"
            className={`pointer-events-none absolute z-20 hidden lg:block ${ribbon.bottom}`}
          />
          <img
            src={`/home/${slug}/ribbon-mobile.png`}
            width={254}
            height={463}
            alt=""
            draggable={false}
            loading="lazy"
            className={`pointer-events-none absolute z-20 lg:hidden ${ribbon.mobile}`}
          />

          <div
            className="relative z-10 mt-[3vw] inline-flex rounded-full bg-accent p-1 lg:mt-[calc(var(--cw)*0.048)]"
            role="group"
            aria-label="Video language"
          >
            {LANGS.map(([code, label]) => (
              <button
                key={code}
                id={`btn_home_videolang_${slug}_${code}`}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`btn-lang rounded-full px-[1.4em] py-[0.5em] text-xs font-semibold transition-colors sm:text-sm lg:text-[clamp(0.8rem,1.1vw,1.3rem)] ${
                  lang === code ? "bg-white text-dark" : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
