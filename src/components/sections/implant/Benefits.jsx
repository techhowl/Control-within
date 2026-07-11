import Reveal from "@/components/ui/Reveal";

/**
 * Implant page — Section 2: "The Difference When You Choose".
 * Feature list radiating around a central circular implant visual, matching
 * the figma reference: each feature is centre-aligned with a thin divider
 * under its title.
 */
const LEFT = [
  {
    title: "99% Effective",
    body: "Fewer than 1 in 100 women using the implant become pregnant each year.",
  },
  {
    title: "Discreet",
    body: "Placed under the skin of your upper arm. Invisible to others and easy to forget about.",
  },
  {
    title: "No Recurring Costs",
    body: "One procedure. No pharmacy runs, no monthly spend.",
  },
];

const RIGHT = [
  {
    titleStr: "No Daily Action",
    title: (
      <>
        No Daily <br className="md:hidden" /> Action
      </>
    ),
    body: "Once it's in place, it works continuously for up to 3 years. No pills. No reminders.",
  },
  {
    titleStr: "Fully Reversible",
    title: (
      <>
        Fully <br className="md:hidden" /> Reversible
      </>
    ),
    body: "Want to plan a pregnancy? The implant can be removed at any time, with fertility returning quickly.",
  },
  {
    titleStr: "Safe for Breastfeeding",
    title: "Safe for Breastfeeding",
    body: "Can be used while breastfeeding. No interference with milk production.",
  },
];

const OESTROGEN = {
  title: "No Oestrogen",
  body: "Can be used throughout breastfeeding and by women who cannot use methods containing estrogen.",
};

function Feature({ item }) {
  return (
    <div className="text-center">
      <h3 className="font-clash text-lg font-semibold text-dark md:text-xl">
        {item.title}
      </h3>
      <div className="mx-auto mt-3 h-px w-24 bg-dark/15" />
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
    </div>
  );
}

export default function Benefits() {
  return (
    <section id="implant-benefits" className="bg-surface py-10 md:py-20">
      <div className="mx-auto max-w-6xl px-[5%]">
        <Reveal className="text-center">
          <h2 className="font-clash text-3xl font-semibold text-dark md:text-4xl">
            The Difference When You Choose
          </h2>
          <span className="mt-3 block text-xm font-semibold uppercase tracking-[0.22em] text-accent md:text-base">
            The Contraceptive Implant
          </span>
        </Reveal>

        {/* Mobile layout — centred visual, points 2-per-row (desktop untouched) */}
        <div className="mt-12 md:hidden">
          <Reveal delay={100}>
            <div className="relative mx-auto w-max">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 scale-110 rounded-full bg-accent-light-2/40 blur-2xl"
              />
              <img
                src="/implant_2ndfold.png"
                alt="Illustration of the contraceptive implant placed just under the skin of the upper arm"
                className="h-56 w-56 rounded-full object-cover"
                draggable={false}
              />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {[...LEFT, ...RIGHT].map((item, i) => (
              <Reveal key={item.titleStr || item.title} delay={i * 60}>
                <Feature item={item} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Radial layout — features left / centre visual / features right */}
        <div className="mt-14 hidden items-center gap-y-12 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-10 lg:gap-x-16">
          <div className="order-2 flex flex-col gap-12 md:order-1">
            {LEFT.map((item, i) => (
              <Reveal
                key={item.titleStr || item.title}
                delay={i * 80}
                className={i === 1 ? "md:-translate-x-22 lg:-translate-x-30" : ""}
              >
                <Feature item={item} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="order-1 md:order-2">
            <div className="relative mx-auto">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 scale-110 rounded-full bg-accent-light-2/40 blur-2xl"
              />
              <img
                src="/implant_2ndfold.png"
                alt="Illustration of the contraceptive implant placed just under the skin of the upper arm"
                className="h-64 w-64 rounded-full object-cover md:h-72 md:w-72 lg:h-80 lg:w-80"
                draggable={false}
              />
            </div>
          </Reveal>

          <div className="order-3 flex flex-col gap-12">
            {RIGHT.map((item, i) => (
              <Reveal
                key={item.titleStr || item.title}
                delay={i * 80}
                className={i === 1 ? "md:translate-x-22 lg:translate-x-30" : ""}
              >
                <Feature item={item} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* No Oestrogen — centred beneath */}
        <Reveal delay={120} className="mx-auto mt-12 max-w-md">
          <Feature item={OESTROGEN} />
        </Reveal>
      </div>
    </section>
  );
}