"use client";

import { useId, useState } from "react";
import { clamp } from "@/lib/clamp";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Text shown beside the number input, e.g. "₹", "yrs", "%". */
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
};

export function Slider({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: Props) {
  const id = useId();
  // Text being typed; null means show the committed value.
  const [draft, setDraft] = useState<string | null>(null);

  function commit(raw: string) {
    setDraft(raw);
    if (raw.trim() === "") return;
    const n = Number(raw);
    if (Number.isFinite(n)) onChange(clamp(n, min, max));
  }

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-ink-soft">
          {label}
        </label>
        <div className="flex items-baseline gap-1 border-b border-rule font-mono text-base focus-within:border-accent">
          {prefix && <span className="text-ink-soft">{prefix}</span>}
          <input
            type="number"
            inputMode="decimal"
            aria-label={`${label} value`}
            className="w-24 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            min={min}
            max={max}
            step={step}
            value={draft ?? String(value)}
            onChange={(e) => commit(e.target.value)}
            onBlur={() => setDraft(null)}
          />
          {suffix && <span className="text-ink-soft">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
        className="fermor-range mt-3 h-1 w-full cursor-pointer appearance-none bg-rule"
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-rule) ${pct}%)`,
        }}
      />
    </div>
  );
}
