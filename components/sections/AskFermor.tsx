"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { askScript } from "@/lib/data/ask-script";

const STEP_MS = 650;

export function AskFermor() {
  const [activeId, setActiveId] = useState(askScript[0].id);
  const active = askScript.find((e) => e.id === activeId)!;
  const total = active.steps.length + 1; // working lines, then the answer
  const [shown, setShown] = useState(total);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  function play(id: string) {
    if (timer.current) clearInterval(timer.current);
    const entry = askScript.find((e) => e.id === id)!;
    const count = entry.steps.length + 1;
    setActiveId(id);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(count);
      return;
    }
    setShown(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= count && timer.current) clearInterval(timer.current);
    }, STEP_MS);
  }

  return (
    <Section id="ask">
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Ask Fermor
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Ask a money question. Get the working, not just the answer.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              Every reply lists the numbers it used, so you can check the
              arithmetic yourself. This is a scripted demo of how Ask will
              respond.
            </p>
            <ul className="mt-8 space-y-2">
              {askScript.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => play(e.id)}
                    aria-pressed={e.id === activeId}
                    className={`w-full border px-4 py-3 text-left text-sm transition-colors ${
                      e.id === activeId
                        ? "border-ink bg-ink text-paper"
                        : "border-rule hover:border-ink"
                    }`}
                  >
                    {e.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="border border-rule bg-white/60 p-5 sm:p-7"
            aria-live="polite"
          >
            <div className="ml-auto w-fit max-w-[90%] bg-ink px-4 py-3 text-sm text-paper">
              {active.question}
            </div>

            <div className="mt-6 min-h-72">
              <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                Working
              </p>
              <dl className="mt-3 divide-y divide-rule border-y border-rule">
                {active.steps.map((s, i) =>
                  i < shown ? (
                    <div
                      key={s.label}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm"
                    >
                      <dt className="text-ink-soft">{s.label}</dt>
                      <dd className="font-mono tabular-nums">{s.value}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              {shown >= total && (
                <p className="mt-5 leading-relaxed">{active.answer}</p>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
