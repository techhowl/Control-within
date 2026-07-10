import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Hero() {
  return (
    <section id="implant-hero" className="relative overflow-hidden bg-[#FCF8F5] lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
      {/* Decorative ribbon swirl — desktop only. mix-blend-multiply drops the
          white matte so only the purple line shows over the background. */}
      <img
        src="/implant_hero_loop.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute -top-4 right-0 z-0 hidden w-[55%] max-w-[720px] select-none mix-blend-multiply md:block md:w-[46%]"
      />

      {/* Mobile only — hero image as a full-bleed background behind the copy. */}
      <img
        src="/ius_hero.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover opacity-10 md:hidden"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40 lg:px-16 lg:pb-20 lg:pt-28">
        {/* Below lg: the three blocks stack in flow (mobile/tablet — unchanged).
            lg+: a symmetric 3-column grid — [text · image · card]. The image
            sits in the auto-width centre column; the two 1fr side columns are
            always equal, so the layout stays balanced left-to-right and cannot
            overflow at any desktop width. */}
        <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8">
          {/* Heading */}
          <div className="lg:justify-self-start lg:max-w-104">
            <h1 className="font-author font-bold leading-[1.05] text-dark text-[clamp(2.2rem,3vw,3.5rem)]">
              Hormonal
              <br />
              IUS
            </h1>

            {/* Teal separator line */}
            <div className="mt-6 h-[5px] w-40 rounded-full bg-teal" />

            <p className="mt-6 font-author font-bold leading-[1.15] text-muted text-[clamp(1.2rem,2vw,2rem)]">
              Say Goodbye To
              <br />
              Heavy, Painful
              <br />
              Periods
            </p>
          </div>

          {/* Centred visual */}
          <div className="relative mx-auto mt-12 w-[clamp(300px,82vw,480px)] lg:mt-0 lg:w-[clamp(360px,38vw,640px)]">
            <div className="hidden overflow-hidden rounded-[2rem] shadow-soft md:block md:rounded-[2.5rem]">
              <img
                src="/ius_hero.webp"
                alt="The small T-shaped hormonal IUS device"
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Purple info card — stacks below the visual on mobile (same width &
              centring as before). On lg+ its right edge is pinned to the right
              column (mirroring the heading on the left), while the extra ~4rem
              of width spills left so the card overlaps the image edge by a few
              percent — the "merged" look, without ever overflowing the screen. */}
          <div className="relative z-10 mx-auto mt-6 w-[clamp(300px,82vw,480px)] rounded-[1.75rem] bg-accent p-6 text-white shadow-hover lg:mx-0 lg:mt-0 lg:w-[calc(100%+4rem)] lg:justify-self-end lg:p-7 xl:p-8">
            <p className="text-[0.95rem] leading-relaxed text-white/95">
              The Hormonal IUS is a small T-shaped device placed inside the
              uterus. It significantly reduces heavy menstrual bleeding, and
              manages endometriosis, while also providing up to 5 years of
              contraception.
            </p>

            <WhatsAppButton className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-teal px-6 py-2.5 text-[0.8rem] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-hover">
              CHAT ON WHATSAPP
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}