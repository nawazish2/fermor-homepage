import { Hero } from "@/components/hero/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { AskFermor } from "@/components/sections/AskFermor";
import { Calculators } from "@/components/sections/Calculators";
import { TrustBand } from "@/components/sections/TrustBand";

export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Pillars />
      <AskFermor />
      <Calculators />
      <TrustBand />
    </div>
  );
}
