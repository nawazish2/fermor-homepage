"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
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
    <div className="graph-paper border-y border-rule">
      <Section id="ask">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl leading-[1.1] sm:text-4xl">
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
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      e.id === activeId
                        ? "border-accent bg-accent text-white"
                        : "border-rule bg-white hover:border-accent"
                    }`}
                  >
                    {e.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border border-rule bg-white p-5 sm:p-7"
            aria-live="polite"
          >
            <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-accent px-4 py-3 text-sm text-white">
              {active.question}
            </div>

            <div className="mt-6 min-h-72">
              <p className="font-medium">Working</p>
              <dl className="mt-3 divide-y divide-dashed divide-rule border-y border-dashed border-rule">
                {active.steps.map((s, i) =>
                  i < shown ? (
                    <div
                      key={s.label}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-sm"
                    >
                      <dt className="text-ink-soft">{s.label}</dt>
                      <dd className="font-medium tabular-nums">{s.value}</dd>
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
      </Section>
    </div>
  );
}
