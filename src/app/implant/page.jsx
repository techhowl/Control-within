import { Suspense } from "react";
import Script from "next/script";
import DoctorLocator from "@/components/DoctorLocator";
import Hero from "@/components/sections/implant/Hero";
import Benefits from "@/components/sections/implant/Benefits";
import Relate from "@/components/sections/implant/Relate";
import Process from "@/components/sections/implant/Process";
import Aftercare from "@/components/sections/implant/Aftercare";
import SideEffects from "@/components/sections/implant/SideEffects";
import Stories from "@/components/sections/implant/Stories";
import Faq from "@/components/sections/Faq";
import { IMPLANT_FAQS } from "@/components/sections/implant/faqData";

export const metadata = {
  title: "The Contraceptive Implant | Control Within",
  description:
    "The Contraceptive Implant — one 10-minute procedure, up to 3 years of over 99% effective, reversible protection. No daily pill, no partner dependency.",
};

export default function ImplantPage() {
  return (
    <>
      {/* Microsoft Clarity — loads only on /implant */}
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "xwhzbek4ne");`}
      </Script>
      <main className="overflow-x-hidden">
        <Hero />
        <Benefits />
        <Relate />
        <Process />
        <Aftercare />
        <SideEffects />
        {/* <Stories /> */}
        <Faq faqs={IMPLANT_FAQS} heading="Every Question You've Been Sitting On" />
        <Suspense fallback={null}>
          <DoctorLocator />
        </Suspense>
      </main>
    </>
  );
}
