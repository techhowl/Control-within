import Reveal from "@/components/ui/Reveal";

const Check = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const CARDS = [
  {
    theme: "purple",
    title: "The Contraceptive Implant may be right for you if:",
    items: [
      'The "did I take my pill?" anxiety is a daily ritual you’re tired of',
      "You depend on your partner for contraception",
      "You want long-term protection with zero recurring effort or cost",
      "You want privacy. Nothing to carry, hide, or explain",
      "You’re not ready for a baby, but you’re not ready to make that permanent either",
    ],
  },
  {
    theme: "teal",
    title: "The Hormonal IUS may be right for you if:",
    items: [
      "Your periods are heavy, painful, or unpredictable — and costing you days every month",
      "You have PCOS, endometriosis, or fibroids",
      "You want contraception that offers relief too",
      "Your cramping and fatigue are dismissed as normal",
      "You want long-term protection with a lower hormonal load than a daily pill",
    ],
  },
];

export default function IsThisForYou() {
  return (
    <section
      id="for-you"
      className="bg-gradient-to-b from-accent-light-2 to-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            <span aria-hidden="true">✱</span> Is This For You?
          </span>
          <h2 className="mt-4 font-clash text-3xl font-semibold text-dark md:text-5xl">
            If Any Of This Sounds Like You, Keep Reading.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {CARDS.map((card, i) => {
            const accent = card.theme === "purple" ? "bg-accent" : "bg-teal-deep";
            return (
              <Reveal
                key={card.title}
                delay={(i + 1) * 80}
                className="rounded-[1.75rem] border border-dark/8 bg-surface p-7 shadow-soft"
              >
                <div className="flex items-start gap-3">
                  <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-2xl text-white ${accent}`}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <h3 className="font-clash text-lg font-semibold text-dark">
                    {card.title}
                  </h3>
                </div>
                <ul className="mt-5 space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-text">
                      <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-white ${accent}`}>
                        <Check />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={240} className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-base text-muted">
            Both methods are reversible, doctor-placed, and require no daily
            action. A gynaecologist can help you decide which fits your life.
          </p>
          {/* <a
            href="#consult"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
          >
            Chat Now <span aria-hidden="true">→</span>
          </a> */}
        </Reveal>
      </div>
    </section>
  );
}
