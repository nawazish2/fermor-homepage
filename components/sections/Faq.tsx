"use client";

import { useState } from "react";
import { Section } from "@/components/Section";

const faqs = [
  {
    q: "What is Fermor?",
    a: "A place to invest, track and plan your money, built around showing the arithmetic behind every number. It covers stocks, mutual funds, ETFs, portfolio tracking and calculators.",
  },
  {
    q: "Are the calculators free?",
    a: "Yes. There are 20+ calculators for SIPs, loans, tax and more. They need no login and no payment.",
  },
  {
    q: "Is this investment advice?",
    a: "No. Fermor is educational and is not a SEBI-registered investment adviser. The calculators show what the numbers do; the decision is yours.",
  },
  {
    q: "What happens to the numbers I enter?",
    a: "The calculators run in your browser, and the numbers you enter never leave your device. The only thing we collect is the email you give the waitlist.",
  },
  {
    q: "How do I get started?",
    a: "Join the waitlist below. Until Fermor opens up, you can use every calculator on this page right away.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
          Questions, answered plainly.
        </h2>
        <div className="border-t border-rule">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium"
                  >
                    {f.q}
                    <span aria-hidden="true" className="text-xl text-accent">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={!isOpen}>
                  <p className="max-w-xl pb-5 leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
