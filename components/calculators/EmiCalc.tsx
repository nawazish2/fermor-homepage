"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { emi } from "@/lib/finance/emi";
import { formatINR } from "@/lib/finance/format";
import { ResultRow } from "./ResultRow";

export function EmiCalc() {
  const [principal, setPrincipal] = useState(6000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const r = emi(principal, rate, years);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <Slider label="Loan amount" prefix="₹" value={principal} min={100000} max={50000000} step={100000} onChange={setPrincipal} />
        <Slider label="Interest rate" suffix="% / yr" value={rate} min={5} max={15} step={0.1} onChange={setRate} />
        <Slider label="Tenure" suffix="years" value={years} min={1} max={30} step={1} onChange={setYears} />
      </div>
      <dl className="divide-y divide-rule border-y border-rule self-start">
        <ResultRow label="Monthly EMI" value={formatINR(Math.round(r.emi))} strong />
        <ResultRow label="Total interest" value={formatINR(Math.round(r.totalInterest))} tone="loss" />
        <ResultRow label="Total payable" value={formatINR(Math.round(r.totalPayable))} />
      </dl>
    </div>
  );
}
