"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { monthlyForGoal } from "@/lib/finance/goal";
import { formatINR } from "@/lib/finance/format";
import { ResultRow } from "./ResultRow";

export function GoalCalc() {
  const [target, setTarget] = useState(2000000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);
  const monthly = monthlyForGoal(target, years, rate);
  const putIn = monthly * years * 12;

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <Slider
          label="Goal amount"
          prefix="₹"
          format={formatINR}
          value={target}
          min={100000}
          max={50000000}
          step={100000}
          onChange={setTarget}
        />
        <Slider
          label="Reach it in"
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
            label="Invest every month"
            value={formatINR(Math.round(monthly))}
            strong
          />
          <ResultRow label="You put in" value={formatINR(Math.round(putIn))} />
          <ResultRow
            label="Growth adds"
            value={`+${formatINR(Math.round(target - putIn))}`}
            tone="gain"
          />
        </dl>
        <p className="mt-3 text-xs text-ink-soft">
          A monthly SIP at a steady {rate}% a year, compounded monthly. Real
          returns move around year to year.
        </p>
      </div>
    </div>
  );
}
