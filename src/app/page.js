import { Suspense } from "react";
import DoctorLocator from "@/components/DoctorLocator";
import Hero from "@/components/sections/Hero";
import ProductSlate from "@/components/sections/ProductSlate";
import Trust from "@/components/sections/Trust";
import Methods from "@/components/sections/Methods";
import Influencers from "@/components/sections/Influencers";
import IsThisForYou from "@/components/sections/IsThisForYou";
import Science from "@/components/sections/Science";
import Faq from "@/components/sections/Faq";
import About from "@/components/sections/About";
import Socials from "@/components/sections/Socials";
import Safety from "@/components/sections/Safety";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Folds 2–3. Clipped so their ribbons can cross between the two folds but
          never spill into the hero or the certifications; on desktop the bottom
          edge fades so a ribbon tail that reaches it trails off instead of being cut. */}
      <div className="overflow-clip lg:[mask-image:linear-gradient(to_bottom,black_calc(100%-3rem),transparent)]">
        {/* id="videos" is the scroll target DoctorLocator uses after a lead submit. */}
        <ProductSlate
          id="videos"
          slug="implant"
          title="The Contraceptive Implant"
          tags={[
            "Works for 3 years once inserted - no daily or monthly effort",
            "Over 99% effective",
            "Discreet",
            "Reversible - return to fertility is quick once removed",
            "No recurring costs",
          ]}
          videos={{
            en: "https://www.youtube.com/embed/chLNL-Gtre4",
            hi: "https://www.youtube.com/embed/G26ELHghoTY",
          }}
          cover="/video_cover_implant.jpg"
          // Mobile order from the design: Discreet, Works for 3 years, Reversible, Over 99%, No recurring costs.
          mobileOrder={[2, 0, 3, 1, 4]}
        />
        <ProductSlate
          id="ius-video"
          slug="ius"
          title="The Hormonal IUS"
          tags={[
            "Helps with heavy menstrual bleeding and endometriosis",
            "Reduces menstrual blood loss significantly",
            "Effectively manages period pains",
            "Dual functionality as a contraceptive",
            "Fertility returns within weeks, after removal",
          ]}
          videos={{
            en: "https://www.youtube.com/embed/ZmAoVaYVTMg",
            hi: "https://www.youtube.com/embed/0wcKta-bj0s",
          }}
          cover="/video_cover_IUS.jpg"
          reverse
        />
      </div>
      <Trust />
      <Methods />
      <Influencers />
      <IsThisForYou />
      <Science />
      <Faq />
      <About />
      <Socials />
      <Safety />
      <Suspense fallback={null}>
        <DoctorLocator />
      </Suspense>
    </>
  );
}
