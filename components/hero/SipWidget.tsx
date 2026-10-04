"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GrowthChart } from "./GrowthChart";
import { sipFutureValue } from "@/lib/finance/sip";
import { formatCompactINR, formatINR } from "@/lib/finance/format";

export function SipWidget() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [showFormula, setShowFormula] = useState(false);

  const result = useMemo(
    () => sipFutureValue(monthly, years, rate),
    [monthly, years, rate],
  );
  const months = years * 12;
  const r = rate / 12;

  return (
    <div className="border border-rule bg-white/60 p-5 sm:p-7">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-soft">
        If you invest every month
      </p>

      <div className="mt-6 space-y-6">
        <Slider
          label="Monthly investment"
          prefix="₹"
          value={monthly}
          min={500}
          max={100000}
          step={500}
          onChange={setMonthly}
        />
        <Slider
          label="For"
          suffix="years"
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
        />
        <Slider
          label="Expected return"
          suffix="% / yr"
          value={rate}
          min={1}
          max={20}
          step={0.5}
          onChange={setRate}
        />
      </div>

      <div className="mt-8 border-t border-rule pt-6">
        <p className="text-sm text-ink-soft">You could have</p>
        <AnimatedNumber
          value={result.corpus}
          format={formatCompactINR}
          className="block font-mono text-4xl tabular-nums tracking-tight text-accent sm:text-5xl"
        />
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="flex items-center gap-2 text-ink-soft">
              <span className="inline-block h-0 w-4 border-t-2 border-dashed border-ink" />
              You invest
            </dt>
            <dd className="font-mono tabular-nums">{formatCompactINR(result.invested)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-ink-soft">
              <span className="inline-block h-0 w-4 border-t-2 border-accent" />
              Gains
            </dt>
            <dd className="font-mono tabular-nums text-gain">
              +{formatCompactINR(result.gains)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <GrowthChart series={result.series} />
      </div>

      <button
        type="button"
        onClick={() => setShowFormula((v) => !v)}
        aria-expanded={showFormula}
        aria-controls="sip-formula"
        className="mt-4 text-sm underline underline-offset-4 hover:text-accent"
      >
        {showFormula ? "Hide the formula" : "Show the formula"}
      </button>

      {showFormula && (
        <div
          id="sip-formula"
          className="mt-3 space-y-2 border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-ink-soft"
        >
          <p className="text-ink">FV = P × [((1 + r)ⁿ − 1) / r] × (1 + r)</p>
          <p>P = {formatINR(monthly)} per month</p>
          <p>
            r = {rate}% ÷ 12 = {r.toFixed(3)}% per month
          </p>
          <p>n = {years} × 12 = {months} months</p>
          {rate === 0 ? (
            <p>At 0% return there is no growth: FV = P × n.</p>
          ) : null}
          <p className="text-ink">FV = {formatINR(Math.round(result.corpus))}</p>
        </div>
      )}
    </div>
  );
}
