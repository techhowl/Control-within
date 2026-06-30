import Reveal from "@/components/ui/Reveal";

const CARDS = [
  {
    num: "01",
    theme: "purple",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400&auto=format&fit=crop",
    tag: "Hormonal Implant",
    title: "How the Implant works",
    lead: "The implant releases a low, steady dose of progestin.",
    steps: [
      "Ovulation stops and cervical mucus thickens — sperm cannot reach the egg.",
      "The uterine lining thins — a fertilised egg cannot attach.",
      "Once removed, fertility returns quickly.",
    ],
  },
  {
    num: "02",
    theme: "teal",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop",
    tag: "Hormonal IUS (hIUS)",
    title: "How the hIUS works",
    lead: "The hIUS releases a small amount of hormone locally inside the uterus.",
    steps: [
      "The uterine lining thins, significantly reducing bleeding and pain.",
      "Sperm is prevented from reaching the egg.",
    ],
  },
];

export default function Science() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            The Science
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Behind The Scenes.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {CARDS.map((card, i) => {
            const accent = card.theme === "purple" ? "bg-accent" : "bg-teal-deep";
            const tagChip =
              card.theme === "purple"
                ? "bg-accent-light-2/60 text-accent"
                : "bg-teal/20 text-teal-deep";
            return (
              <Reveal
                key={card.num}
                delay={(i + 1) * 80}
                as="article"
                className="overflow-hidden rounded-[1.75rem] border border-dark/8 bg-bg shadow-soft"
              >
                <div className="relative h-44">
                  <img
                    src={card.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-5 top-4 font-clash text-4xl font-semibold text-white drop-shadow">
                    {card.num}
                  </span>
                </div>
                <div className="p-7">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tagChip}`}>
                    {card.tag}
                  </span>
                  <h3 className="mt-3 font-clash text-xl font-semibold text-dark">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{card.lead}</p>
                  <ul className="mt-5 space-y-3">
                    {card.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-text">
                        <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-semibold text-white ${accent}`}>
                          {idx + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
