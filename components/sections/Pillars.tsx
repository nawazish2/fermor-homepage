import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    n: "01",
    name: "Understand",
    promise: "See where you stand before you decide anything.",
    detail:
      "Track stocks, mutual funds and ETFs in one place, and run the numbers on any money decision with calculators that show their working.",
  },
  {
    n: "02",
    name: "Act",
    promise: "Move from a plan to a purchase without friction.",
    detail:
      "Start a SIP from ₹500, pick direct mutual funds, or buy stocks and ETFs, with the costs shown up front.",
  },
  {
    n: "03",
    name: "Grow",
    promise: "Let compounding do the slow work.",
    detail:
      "Set goals, forecast where your money is heading, and see how one change in amount, time or return moves the result.",
  },
];

export function Pillars() {
  return (
    <Section>
      <Reveal>
        <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Three steps, one clear line from where you are to where you want to
          be.
        </h2>
        <div className="mt-12 grid border-t border-rule md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={p.name}
              className={`py-8 md:px-8 md:py-10 ${i > 0 ? "border-t border-rule md:border-l md:border-t-0" : "md:pl-0"}`}
            >
              <p className="font-mono text-sm text-accent">{p.n}</p>
              <h3 className="mt-4 font-display text-3xl">{p.name}</h3>
              <p className="mt-3 text-lg leading-snug">{p.promise}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {p.detail}
              </p>
            </article>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
