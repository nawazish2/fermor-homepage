"use client";

import { useState, type KeyboardEvent } from "react";
import { snap } from "@/lib/clamp";
import { formatNumberIN } from "@/lib/finance/format";

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
  // Text being typed; null means show the committed value, grouped ("10,000").
  const [draft, setDraft] = useState<string | null>(null);

  function handle(raw: string) {
    const cleaned = raw.replace(/,/g, "").trim();
    const n = Number(cleaned);
    if (cleaned === "" || !Number.isFinite(n)) {
      setDraft(raw);
      return;
    }
    setDraft(n > max ? formatNumberIN(max) : raw);
    onChange(snap(n, min, max, step));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    setDraft(null);
    onChange(
      snap(value + (e.key === "ArrowUp" ? step : -step), min, max, step),
    );
  }

  const shown = draft ?? formatNumberIN(value);

  const input = (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={label}
      value={shown}
      onChange={(e) => handle(e.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => setDraft(null)}
      className={`bg-transparent outline-none ${
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
