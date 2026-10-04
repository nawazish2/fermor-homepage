"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Section } from "@/components/Section";
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

  return (
    <Section id="calculators">
      <h2 className="max-w-3xl font-display text-3xl leading-[1.1] sm:text-4xl">
        Start with numbers you already know. Change one at a time.
      </h2>

      <div
        role="tablist"
        aria-label="Calculators"
        onKeyDown={onKeyDown}
        className="mt-10 inline-flex gap-1 rounded-full bg-paper-deep p-1"
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
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "bg-accent text-white"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={i !== active}
          className="pt-10"
        >
          <t.Panel />
        </div>
      ))}

      <div className="mt-14 border-t border-rule pt-6">
        <p className="text-sm text-ink-soft">
          More calculators on{" "}
          <a
            href="https://www.fermor.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent"
          >
            fermor.in
          </a>
          , all free and without a login:
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <li
              key={o}
              className="rounded-full border border-rule bg-white px-3 py-1.5 text-sm"
            >
              {o}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
