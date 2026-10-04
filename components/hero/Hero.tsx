import { Section } from "@/components/Section";
import { SipWidget } from "./SipWidget";

export function Hero() {
  return (
    <div className="graph-paper border-b border-rule">
      <Section className="pb-14 pt-10 md:pb-20 md:pt-16">
        <SipWidget />
      </Section>
    </div>
  );
}
