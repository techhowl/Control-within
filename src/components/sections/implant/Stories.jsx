import Reveal from "@/components/ui/Reveal";

/**
 * Implant page — Section 6: "Real Stories From Women Who've Been There".
 */
const STORIES = [
  {
    quote:
      '"I was on the pill for four years. The mental load of tracking it every single day, the anxiety when I missed one, it was exhausting. The implant changed that completely. 10 minutes in the doctor\'s chair and I haven\'t thought about contraception since."',
    who: "Young Professional",
    meta: "27 | Mumbai",
  },
  {
    quote:
      '"I had my second baby and knew I needed something reliable but wasn\'t ready for anything permanent. The doctor inserted it while I was still in hospital recovery. I didn\'t even realise how easy it would be."',
    who: "New Mother",
    meta: "31 | Pune",
  },
  {
    quote:
      '"I wasn\'t even sure I could get one because I\'d never been pregnant. Turns out that doesn\'t matter at all. My doctor explained everything clearly and I walked out feeling like I\'d made the most sensible decision of my adult life." — Someone who thought it wasn\'t for her',
    who: "Graduate Student",
    meta: "24 | Delhi",
  },
];

export default function Stories() {
  return (
    <section id="implant-stories" className="bg-[#FAF6F0] py-14 md:py-20">
      <div className="mx-auto w-full px-[5%]">
        {/* ── Heading ── */}
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
            Real Stories
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            From Women Who&rsquo;ve Been There
          </h2>
        </Reveal>

        {/* ── Cards ── */}
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3 md:gap-8">
          {STORIES.map((story, i) => (
            <Reveal
              key={story.who}
              delay={i * 100}
              className="flex h-full flex-col rounded-[1.75rem] bg-teal p-8 text-white md:p-10"
            >
              {/* Quote-mark image — matches design sizing */}
              <img
                src="/%E2%80%9C.png"
                alt=""
                aria-hidden="true"
                className="h-10 w-auto self-start opacity-50 md:h-14"
                draggable={false}
              />

              <p className="mt-6 flex-1 text-[0.95rem] leading-relaxed text-white md:text-base">
                {story.quote}
              </p>

              {/* Attribution bar */}
              <div className="mt-auto flex items-stretch gap-3 pt-10">
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