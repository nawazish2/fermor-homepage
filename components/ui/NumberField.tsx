"use client";

import { useState } from "react";
import { snap } from "@/lib/clamp";

type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  className?: string;
  /** Size the field to its text, for use inside a sentence. */
  autoWidth?: boolean;
};

export function NumberField({
  value,
  min,
  max,
  step,
  onChange,
  label,
  className = "",
  autoWidth,
}: Props) {
  // Text being typed; null means show the committed value.
  const [draft, setDraft] = useState<string | null>(null);

  function handle(raw: string) {
    const n = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(n)) {
      setDraft(raw);
      return;
    }
    setDraft(n > max ? String(max) : raw);
    onChange(snap(n, min, max, step));
  }

  const shown = draft ?? String(value);

  const input = (
    <input
      type="number"
      inputMode="decimal"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={shown}
      onChange={(e) => handle(e.target.value)}
      onBlur={() => setDraft(null)}
      className={`bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none ${
        autoWidth ? "absolute inset-0 w-full" : ""
      } ${className}`}
    />
  );

  if (!autoWidth) return input;

  // Auto-size: a hidden copy of the text sets the width, the input sits on top.
  return (
    <span className="relative inline-block">
      <span
        aria-hidden="true"
        className={`invisible block whitespace-pre ${className}`}
      >
        {shown || " "}
      </span>
      {input}
    </span>
  );
}
