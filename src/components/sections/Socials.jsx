import Reveal from "@/components/ui/Reveal";

const InstaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

export default function Socials() {
  return (
    <section className="bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-310 px-[5%]">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Community
          </span>
          <h2 className="mt-3 font-clash text-3xl font-semibold text-dark md:text-5xl">
            Stay Within Reach Of Our Socials
          </h2>
          <p className="mt-4 text-base text-muted">
            Follow us <strong className="text-dark">@controlwithin</strong> for
            real conversations about contraception, menstrual health, and what
            control actually looks like.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Reveal
              key={i}
              delay={(i + 1) * 80}
              className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[1.75rem] border border-dashed border-dark/15 bg-surface text-muted"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream">
                <InstaIcon />
              </span>
              <p className="text-sm font-medium">Instagram Post</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
