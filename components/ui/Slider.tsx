"use client";

import { useId } from "react";
import { NumberField } from "./NumberField";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  /** Spoken value for screen readers, e.g. "₹10,000". */
  format?: (value: number) => string;
  /** Hide the number box when the value is shown elsewhere. */
  hideValue?: boolean;
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
  format,
  hideValue,
  onChange,
}: Props) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-ink-soft">
          {label}
        </label>
        {!hideValue && (
          <div className="flex items-baseline gap-1 border-b border-rule text-base tabular-nums focus-within:border-accent">
            {prefix && <span className="text-ink-soft">{prefix}</span>}
            <NumberField
              label={`${label} value`}
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={onChange}
              className="w-24 text-right"
            />
            {suffix && <span className="text-ink-soft">{suffix}</span>}
          </div>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format?.(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fermor-range mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-rule) ${pct}%)`,
        }}
      />
    </div>
  );
}
