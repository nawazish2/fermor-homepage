"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { sipFutureValue } from "@/lib/finance/sip";
import { formatCompactINR, formatINR } from "@/lib/finance/format";
import { ResultRow } from "./ResultRow";

export function SipCalc() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const r = sipFutureValue(monthly, years, rate);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <Slider
          label="Monthly investment"
          prefix="₹"
          format={formatINR}
          value={monthly}
          min={500}
          max={100000}
          step={500}
          onChange={setMonthly}
        />
        <Slider
          label="Time period"
          suffix="years"
          format={(v) => `${v} years`}
          value={years}
          min={1}
          max={30}
          step={1}
          onChange={setYears}
        />
        <Slider
          label="Expected return"
          suffix="% / yr"
          format={(v) => `${v}% a year`}
          value={rate}
          min={1}
          max={20}
          step={0.5}
          onChange={setRate}
        />
      </div>
      <div className="self-start">
        <dl className="divide-y divide-rule border-y border-rule">
          <ResultRow
            label="Invested"
            value={formatINR(Math.round(r.invested))}
          />
          <ResultRow
            label="Gains"
            value={`+${formatINR(Math.round(r.gains))}`}
            tone="gain"
          />
          <ResultRow
            label="Future value"
            value={formatINR(Math.round(r.corpus))}
            strong
          />
        </dl>
        <p className="mt-3 text-xs text-ink-soft">
          About {formatCompactINR(r.corpus)}, with monthly compounding.
        </p>
      </div>
    </div>
  );
}
