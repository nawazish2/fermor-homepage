import { Section } from "@/components/Section";

const statements = [
  {
    title: "This is not investment advice",
    body: "Fermor is educational and is not a SEBI-registered investment adviser. We show the arithmetic; the decision is yours.",
  },
  {
    title: "Calculators run on your device",
    body: "The numbers you enter in the calculators never leave your browser.",
  },
  {
    title: "We only ask for your email",
    body: "The waitlist is the only form on this page, and it asks for nothing else.",
  },
];

export function TrustBand() {
  return (
    <Section className="!py-12 md:!py-16">
      <div className="grid gap-8 border-t border-rule pt-10 md:grid-cols-3 md:gap-12">
        {statements.map((s) => (
          <div key={s.title}>
            <h3 className="font-display text-xl">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
