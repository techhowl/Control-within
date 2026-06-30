import Reveal from "@/components/ui/Reveal";

const BADGES = [
  { name: "WHO", label: "Recommended" },
  { name: "US FDA", label: "Approved" },
  { name: "CDSCO", label: "Approved" },
  { name: "FOGSI", label: "Endorsed*" },
];

export default function Trust() {
  return (
    <section className="bg-surface py-16">
      <Reveal className="mx-auto max-w-310 px-[5%]">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:justify-between">
          {BADGES.map((badge) => (
            <div key={badge.name} className="text-center">
              <div className="font-clash text-2xl font-semibold text-dark">
                {badge.name}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          Both contraceptive implants and the hormonal IUS are globally
          recognised, clinically studied, and placed by trained gynaecologists.
        </p>
      </Reveal>
    </section>
  );
}
