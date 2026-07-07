import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Hero() {
  return (
    <section id="implant-hero" className="relative overflow-hidden bg-[#FCF8F5]">
      {/* Decorative ribbon swirl — mix-blend-multiply drops the white matte so
          only the purple line shows over the background. */}
      <img
        src="/implant_hero_loop.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute -top-4 right-0 z-0 w-[55%] max-w-[720px] select-none mix-blend-multiply md:w-[46%]"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40 lg:px-16 lg:pt-44">
        <div className="relative">
          {/* Heading — in flow on mobile, absolute-left & vertically centred on lg+ */}
          <div className="lg:absolute lg:left-0 lg:top-1/2 lg:z-20 lg:max-w-[38%] lg:-translate-y-1/2">
            <h1 className="font-author font-bold leading-[1.05] text-dark text-[clamp(2.2rem,3.5vw,4rem)]">
              The
              <br />
              Contraceptive
              <br />
              Implant
            </h1>
            
            {/* Teal separator line */}
            <div className="mt-6 h-[5px] w-40 rounded-full bg-teal" />
            
            <p className="mt-6 font-author font-bold leading-[1.15] text-muted text-[clamp(1.2rem,2vw,2rem)]">
              One Decision.
              <br />
              Three Years.
              <br />
              99% Effective.
            </p>
          </div>

          {/* Centred visual — the purple card is anchored to it so the two stay
              merged at any width. */}
          <div className="relative mx-auto mt-12 w-[clamp(300px,82vw,480px)] lg:mt-0 lg:w-[clamp(360px,38vw,560px)]">
            <div className="overflow-hidden rounded-[2rem] shadow-soft md:rounded-[2.5rem]">
              <img
                src="/implant_hero.webp"
                alt="A hand holding the matchstick-sized contraceptive implant rod"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>

            {/* Purple info card — stacks below the visual on mobile, overlaps its
                right edge, centered vertically from lg up. */}
            <div className="mt-6 rounded-[1.75rem] bg-accent p-6 text-white shadow-hover lg:absolute lg:left-[90%] lg:right-auto lg:top-1/2 lg:z-20 lg:mt-0 lg:w-[20rem] lg:-translate-y-1/2 lg:p-7 xl:w-[22rem] xl:p-8">
              <p className="text-[0.95rem] leading-relaxed text-white/95">
                The Contraceptive Implant is a matchstick-sized rod placed under
                the skin of your upper arm. A 10-minute procedure and
                you&rsquo;re protected for up to 3 years. No daily pill. No
                partner dependency. No mental load.
              </p>
              
              <WhatsAppButton className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-2.5 text-[0.8rem] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-hover">
                CHAT ON WHATSAPP
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}