import Reveal from "@/components/ui/Reveal";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

/**
 * Implant page — "Side Effects Vary Significantly Between Women".
 * Clean section containing only the transitional reassurance copy and the WhatsApp CTA.
 */
export default function SideEffects() {
  return (
    <section
      id="implant-side-effects"
      className="relative overflow-hidden bg-surface py-10 md:py-10"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-[5%]">
        <Reveal
          delay={120}
          className="flex flex-col items-center text-center"
        >
          <p className="max-w-xl font-author text-lg leading-relaxed text-dark md:text-xl">
            The adjustment period is temporary. What comes after for most women is significantly less bleeding, less pain, and far more control over their bodies.
          </p>
          <WhatsAppButton className="mt-7 inline-flex items-center justify-center rounded-full bg-teal px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-teal-hover">
            Chat On WhatsApp
          </WhatsAppButton>
        </Reveal>
      </div>
    </section>
  );
}