import Reveal from "@/components/ui/Reveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Implant page — "Side Effects Vary Significantly Between Women".
 * Heading + three reassurance points over a faint hand watermark, closing
 * with supporting copy and the WhatsApp CTA. Fully responsive.
 */
const POINTS = [
  {
    icon: "/people.png",
    title: "Varies by person",
    body: "Some feel period changes and others – bleeding, mood, or weight.",
  },
  {
    icon: "/calendar_new.png",
    title: "Settles in 3–6 months",
    body: "For most who experience side effects.",
  },
  {
    icon: "/protection.png",
    title: "Fertility unaffected",
    body: "No impact long term, or on future pregnancy.",
  },
];

export default function SideEffects() {
  return (
    <section
      id="implant-side-effects"
      className="relative overflow-hidden bg-surface py-10 md:py-24"
    >
      {/* Faint hand watermark — decorative, sits behind the copy. */}
      <img
        src="/newsection_implant_bg.png"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover object-center"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-[5%]">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-3xl font-author text-3xl font-bold leading-[1.15] text-dark md:text-4xl">
            Side Effects Vary Significantly Between Women.
          </h2>
        </Reveal>

        {/* Three reassurance points */}
        <div className="mt-10 grid gap-12 sm:grid-cols-3 sm:gap-8 md:mt-20 md:gap-10">
          {POINTS.map((point, i) => (
            <Reveal
              key={point.title}
              delay={i * 80}
              className="flex flex-col items-center text-center"
            >
              <img
                src={point.icon}
                alt=""
                aria-hidden="true"
                draggable={false}
                // Applies h-16 w-16 to /people.png on mobile, h-14 w-14 to the rest.
                // Desktop remains md:h-16 md:w-16 for all.
                className={`object-contain md:h-16 md:w-16 ${
                  point.icon === "/people.png" ? "h-16 w-16" : "h-14 w-14"
                }`}
              />
              {/* Conditional top margin: shrinks gap on mobile for /people.png only, keeps md:mt-6 for desktop */}
              <h3 
                className={`font-clash text-lg font-bold text-dark md:text-xl ${
                  point.icon === "/people.png" ? "mt-2 md:mt-6" : "mt-6"
                }`}
              >
                {point.title}
              </h3>
              <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-muted md:text-base">
                {point.body}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Supporting copy + CTA */}
        <Reveal
          delay={120}
          className="mt-16 flex flex-col items-center text-center md:mt-20"
        >
          <p className="max-w-xl font-author text-lg leading-relaxed text-dark md:text-xl">
            Any discomfort or apprehensions, your doctor is a call away. Removal
            is always an option.
          </p>
          <WhatsAppButton className="mt-7 inline-flex items-center justify-center rounded-full bg-teal px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-hover">
            Chat On WhatsApp
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}