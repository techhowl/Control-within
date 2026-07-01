import Hero from "@/components/sections/Hero";
import FeatureProduct from "@/components/sections/FeatureProduct";
import Methods from "@/components/sections/Methods";
import IsThisForYou from "@/components/sections/IsThisForYou";
import Videos from "@/components/sections/Videos";
import Science from "@/components/sections/Science";
import Faq from "@/components/sections/Faq";
import About from "@/components/sections/About";
import Socials from "@/components/sections/Socials";
import Trust from "@/components/sections/Trust";
import Safety from "@/components/sections/Safety";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureProduct />
      <Methods />
      <IsThisForYou />
      <Videos />
      <Science />
      <Faq />
      <About />
      <Socials />
      <Trust />
      <Safety />
    </>
  );
}
