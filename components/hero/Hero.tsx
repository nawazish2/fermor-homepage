import { Section } from "@/components/Section";
import { SipWidget } from "./SipWidget";

export function Hero() {
  return (
    <Section className="grid items-start gap-12 pt-12 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div className="lg:pt-6">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Invest · Track · Plan
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          The math behind your money, made visible.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
          Fermor shows the working behind every number: what you put in, what
          it grows to, and why. Move a slider and watch it change.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#calculators"
            className="bg-ink px-6 py-3 text-sm text-paper hover:bg-accent"
          >
            Try the calculators
          </a>
          <a
            href="#waitlist"
            className="text-sm underline underline-offset-4 hover:text-accent"
          >
            Join the waitlist
          </a>
        </div>
      </div>
      <SipWidget />
    </Section>
  );
}
