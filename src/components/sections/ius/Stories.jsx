import Reveal from "@/components/ui/Reveal";

/**
 * Implant page — Section 6: "Real Stories From Women Who've Been There".
 */
const STORIES = [
  {
    quote:
      '"I had been managing endometriosis for six years. Every month was a countdown to pain. My gynaecologist suggested the hIUS as part of managing it. Within four months, the difference was real. I stopped dreading my cycle."',
    who: "Sheetal",
    meta: "29 | Hyderabad",
  },
  {
    quote:
      '"After my second baby, my periods came back heavier than ever. I was anemic, exhausted, and going through pads at a rate that was genuinely affecting my life. The hIUS brought it down to almost nothing within three months."',
    who: "Aaliyah",
    meta: "31 | Chennai",
  },
  {
    quote:
      '"I didn\'t even know the IUS could help with period pain — I thought it was just a contraceptive device. Once my doctor explained the dual benefit, it felt like an obvious choice. I\'d been living on ibuprofen for years."',
    who: "Ira",
    meta: "24 | Bengaluru",
  },
];

export default function Stories() {
  return (
    <section id="implant-stories" className="bg-[#FAF6F0] py-10 md:py-20">
      <div className="mx-auto w-full px-[5%]">
        {/* ── Heading ── */}
        <Reveal className="text-center">
          <span className="text-xm font-bold uppercase tracking-[0.18em] text-accent">
            Real Stories
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-4xl">
            From Women Who&rsquo;ve Been There
          </h2>
        </Reveal>

        {/* ── Cards ── */}
        {/* Mobile: horizontal snap carousel. Desktop (md+): unchanged 3-col grid. */}
        <div className="mt-12 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto scrollbar-none pb-4 md:grid md:grid-cols-3 md:gap-18 md:overflow-visible md:pb-0">
          {STORIES.map((story, i) => (
            <Reveal
              key={story.who}
              delay={i * 100}
              // FIX: Replaced `h-full` with `md:h-full` to allow mobile cards to stretch properly.
              className="flex min-h-[28rem] w-[80%] shrink-0 snap-start flex-col rounded-[1.75rem] bg-teal p-8 text-white md:h-full md:min-h-[34rem] md:w-auto md:shrink md:p-10"
            >
              {/* Quote-mark image */}
              <img
                src="/%E2%80%9C.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-auto self-start opacity-50 md:h-14"
                draggable={false}
              />

              {/* Increased top margin to match the design's breathing room */}
              <p className="mb-8 mt-14 text-[0.95rem] leading-relaxed text-white md:mt-16 md:text-base">
                {story.quote}
              </p>

              {/* Attribution bar pushed to the bottom */}
              <div className="mt-auto flex items-stretch gap-3 pt-6 md:pt-8">
                <span
                  aria-hidden="true"
                  className="w-[3px] shrink-0 rounded-full bg-white"
                />
                <div className="text-sm font-bold uppercase leading-snug tracking-wide">
                  <div>{story.who}</div>
                  <div>{story.meta}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}