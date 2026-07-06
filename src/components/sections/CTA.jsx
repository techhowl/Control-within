import Reveal from "@/components/ui/Reveal";

const ASSURANCES = ["Free first consult", "100% private", "Trained gynaecologists"];

export default function CTA() {
  return (
    <section id="consult" className="bg-bg px-[5%] py-20 md:py-28">
      <Reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-accent px-8 py-16 text-center text-white md:px-16">
        {/* glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[140%] w-[80%] -translate-x-1/2 rounded-full bg-accent-light-1/30 blur-3xl"
        />
        <div className="relative">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-light-2">
            Get Started
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold md:text-5xl">
            Control that stays <em className="font-author not-italic text-accent-light-2">with you.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85">
            We’ll connect you to a trained gynaecologist in your city over
            WhatsApp — to walk you through your options, privately and at your
            pace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#methods"
              className="inline-flex items-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore methods
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/75">
            {ASSURANCES.map((a) => (
              <span key={a} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-accent-light-2">✓</span>
                {a}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
