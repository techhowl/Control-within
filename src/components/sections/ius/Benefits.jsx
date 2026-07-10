import Reveal from "@/components/ui/Reveal";

/**
 * Implant page — Section 2: "The Difference When You Choose".
 * Feature list radiating around a central circular implant visual, matching
 * the figma reference: each feature is centre-aligned with a thin divider
 * under its title.
 */
const LEFT = [
  {
    title: "Reduces Heavy Bleeding by 80–90%",
    body: "Most women see a significant reduction in bleeding. In clinical trials, nearly 9 in 10 women experienced meaningful improvement within 6 months.",
  },
  {
    title: "Relieves Period Pain",
    body: "Reduces menstrual cramps and pelvic pain associated with endometriosis.",
  },
  {
    title: "Clinically Used to Manage Endometriosis",
    body: "Suppresses the growth of endometrium-like tissue.",
  },
];

const RIGHT = [
  {
    title: "Protects Against Anaemia",
    body: "Protects against iron-deficiency anaemia by reducing blood loss.",
  },
  {
    title: "Up to 5 Years of Contraception",
    body: "Over 99% effective. No daily pill. No partner involvement.",
  },
  {
    title: "Fully Reversible",
    body: "Normal cycles return quickly after removal.",
  },
];

const OESTROGEN = {
  title: "Locally Acting Hormone",
  body: "Releases low-dose progestin directly in the uterus.",
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
            What Changes When You Choose
          </h2>
          <span className="mt-3 block text-xm font-semibold uppercase tracking-[0.22em] text-accent md:text-base">
            The Hormonal IUS
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
                src="/ius_2ndfold.webp"
                alt="Illustration of the hormonal IUS placed inside the uterus"
                className="h-56 w-56 rounded-full object-cover"
                draggable={false}
              />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10">
            {[...LEFT, ...RIGHT].map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
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
                key={item.title}
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
                src="/ius_2ndfold.png"
                alt="Illustration of the hormonal IUS placed inside the uterus"
                className="h-64 w-64 rounded-full object-cover md:h-72 md:w-72 lg:h-80 lg:w-80"
                draggable={false}
              />
            </div>
          </Reveal>

          <div className="order-3 flex flex-col gap-12">
            {RIGHT.map((item, i) => (
              <Reveal
                key={item.title}
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
