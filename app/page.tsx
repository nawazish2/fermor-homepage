import { Hero } from "@/components/hero/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { TrustBand } from "@/components/sections/TrustBand";

export default function Home() {
  return (
    <div id="top">
      <Hero />
      <Pillars />
      <TrustBand />
    </div>
  );
}
