import { Hero } from "@/components/hero/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { AskFermor } from "@/components/sections/AskFermor";
import { Calculators } from "@/components/sections/Calculators";
import { Portfolio } from "@/components/sections/Portfolio";
import { TrustBand } from "@/components/sections/TrustBand";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Pillars />
      <AskFermor />
      <Calculators />
      <Portfolio />
      <TrustBand />
      <Faq />
      <FinalCta />
    </div>
  );
}
