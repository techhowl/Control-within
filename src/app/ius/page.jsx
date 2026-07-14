import { Suspense } from "react";
import DoctorLocator from "@/components/DoctorLocator";
import Hero from "@/components/sections/ius/Hero";
import Benefits from "@/components/sections/ius/Benefits";
import Relate from "@/components/sections/ius/Relate";
import Process from "@/components/sections/ius/Process";
import Aftercare from "@/components/sections/ius/Aftercare";
import SideEffects from "@/components/sections/ius/SideEffects";
import Stories from "@/components/sections/ius/Stories";
import Faq from "@/components/sections/Faq";
import { IUS_FAQS } from "@/components/sections/ius/faqData";

export const metadata = {
  title: "The Hormonal IUS | Control Within",
  description:
    "The Hormonal IUS — a small T-shaped device that reduces heavy, painful periods, manages endometriosis, and provides up to 5 years of over 99% effective, reversible contraception.",
};

export default function IusPage() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <Benefits />
      <Relate />
      <Process />
      <Aftercare />
      <SideEffects />
      {/* <Stories /> */}
      <Faq faqs={IUS_FAQS} heading="Every Question You've Been Sitting On" />
      <Suspense fallback={null}>
        <DoctorLocator />
      </Suspense>
    </main>
  );
}
