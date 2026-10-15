import Reveal from "@/components/ui/Reveal";

const BADGES = [
  { name: "WHO", label: "Recommended", img: "/WHO_logo.webp" },
  { name: "US FDA", label: "Approved", img: "/USFDA.jpg" },
  { name: "CDSCO", label: "Approved", img: "/Central_Drugs_Standard_Control_Organization.jpg" },
  { name: "FOGSI", label: "Endorsed*", img: "/fogsi-logo.png" },
];

function Badge({ badge, size = "lg" }) {
  const sm = size === "sm";
  return (
    <div className={`flex flex-col items-center text-center ${sm ? "w-28 shrink-0" : ""}`}>
      {/* Logo Container */}
      <div className={`flex items-center justify-center ${sm ? "mb-2 h-14 w-24" : "mb-4 h-20 w-32"}`}>
        <img
          src={badge.img}
          alt={`${badge.name} logo`}
          className="max-h-full max-w-full object-contain mix-blend-multiply grayscale transition-all duration-300 hover:grayscale-0"
        />
      </div>
      <div className={`font-clash font-semibold text-dark ${sm ? "text-lg" : "text-2xl"}`}>{badge.name}</div>
      <div className={`font-medium uppercase tracking-wide text-muted ${sm ? "mt-0.5 text-[0.65rem]" : "mt-1 text-xs"}`}>
        {badge.label}
      </div>
    </div>
  );
}

export default function Trust() {
  return (
    <section className="bg-surface py-8 md:py-16">
      {/* Mobile: one row of badges scrolling on a loop (the track holds two copies
          and slides by half its width, so the wrap is seamless). */}
      <div
        className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:hidden"
        role="marquee"
        aria-label="Approvals and endorsements"
      >
        <div className="flex w-max animate-marquee gap-6 pr-6 [animation-duration:16s] motion-reduce:animate-none">
          {[...BADGES, ...BADGES].map((badge, i) => (
            <div key={i} aria-hidden={i >= BADGES.length || undefined}>
              <Badge badge={badge} size="sm" />
            </div>
          ))}
        </div>
      </div>

      <Reveal className="mx-auto max-w-310 px-[5%]">
        <div className="hidden flex-wrap items-center justify-center gap-x-12 gap-y-10 md:flex md:justify-between">
          {BADGES.map((badge) => (
            <Badge key={badge.name} badge={badge} />
          ))}
        </div>
        {/* NOTE: Confirm FOGSI endorsement status before publishing (FOGSI badge shows an asterisk). */}
        <p className="mx-auto mt-5 max-w-3xl text-center text-xs text-muted md:mt-12 md:text-sm">
          Both contraceptive implants and hormonal IUS are globally recognised,
          clinically studied, and placed by trained gynaecologists.
        </p>
      </Reveal>
    </section>
  );
}
