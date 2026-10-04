"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SipCalc } from "@/components/calculators/SipCalc";
import { EmiCalc } from "@/components/calculators/EmiCalc";
import { TaxCalc } from "@/components/calculators/TaxCalc";

const tabs = [
  { id: "sip", label: "SIP", Panel: SipCalc },
  { id: "emi", label: "EMI", Panel: EmiCalc },
  { id: "tax", label: "Tax regime", Panel: TaxCalc },
] as const;

const others = [
  "PPF",
  "FD",
  "Lumpsum",
  "Gratuity",
  "SWP",
  "NPS",
  "Home loan",
  "HRA",
];

export function Calculators() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent) {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  const Panel = tabs[active].Panel;

  return (
    <Section id="calculators">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Calculators
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Start with numbers you already know. Change one at a time.
        </h2>

        <div
          role="tablist"
          aria-label="Calculators"
          onKeyDown={onKeyDown}
          className="mt-10 flex gap-6 border-b border-rule"
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`-mb-px border-b-2 pb-3 text-sm ${
                i === active
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tabs[active].id}`}
          aria-labelledby={`tab-${tabs[active].id}`}
          className="pt-10"
        >
          <Panel />
        </div>

        <div className="mt-14 border-t border-rule pt-6">
          <p className="text-sm text-ink-soft">
            And 20+ more, all free, no login:
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o}>
                <a
                  href="#calculators"
                  className="block border border-rule px-3 py-1.5 text-sm hover:border-ink"
                >
                  {o}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
