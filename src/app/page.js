import Hero from "@/components/sections/Hero";
import Ticker from "@/components/layout/Ticker";
import Methods from "@/components/sections/Methods";
import IsThisForYou from "@/components/sections/IsThisForYou";
import Videos from "@/components/sections/Videos";
import Science from "@/components/sections/Science";
import Faq from "@/components/sections/Faq";
import About from "@/components/sections/About";
import Socials from "@/components/sections/Socials";
import Trust from "@/components/sections/Trust";
import Safety from "@/components/sections/Safety";
import CTA from "@/components/sections/CTA";

const MID_TICKER = [
  "One step. Years of peace.",
  "Reversible. Reliable. Yours.",
  "No daily reminders. No partner dependence.",
  "Control that stays with you.",
];

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker items={MID_TICKER} variant="mid" />
      <Methods />
      <IsThisForYou />
      <Videos />
      <Science />
      <Faq />
      <About />
      <Socials />
      <Trust />
      <Safety />
      <CTA />
    </>
  );
}
