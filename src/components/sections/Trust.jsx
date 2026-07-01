import Reveal from "@/components/ui/Reveal";

const BADGES = [
  { name: "WHO", label: "Recommended", img: "/WHO_logo.webp" },
  { name: "US FDA", label: "Approved", img: "/USFDA.jpg" },
  { name: "CDSCO", label: "Approved", img: "/Central_Drugs_Standard_Control_Organization.jpg" },
  { name: "FOGSI", label: "Endorsed*", img: "/fogsi-logo.png" },
];

export default function Trust() {
  return (
    <section className="bg-surface py-16">
      <Reveal className="mx-auto max-w-310 px-[5%]">
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 md:justify-between">
          {BADGES.map((badge) => (
            <div key={badge.name} className="flex flex-col items-center text-center">
              {/* Logo Container */}
              <div className="mb-4 flex h-20 w-32 items-center justify-center">
                <img 
                  src={badge.img} 
                  alt={`${badge.name} logo`} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply grayscale transition-all duration-300 hover:grayscale-0"
                />
              </div>
              <div className="font-clash text-2xl font-semibold text-dark">
                {badge.name}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                {badge.label}
              </div>
            </div>
          ))}
        </div>
        {/* NOTE: Confirm FOGSI endorsement status before publishing (FOGSI badge shows an asterisk). */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-muted">
          Both contraceptive implants and hormonal IUS are globally recognised,
          clinically studied, and placed by trained gynaecologists.
        </p>
      </Reveal>
    </section>
  );
}