"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { computeTax } from "@/lib/finance/tax";
import { formatINR } from "@/lib/finance/format";

export function TaxCalc() {
  const [income, setIncome] = useState(1200000);
  const oldR = computeTax(income, "old");
  const newR = computeTax(income, "new");
  const better =
    newR.tax === oldR.tax ? null : newR.tax < oldR.tax ? "new" : "old";

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <Slider
          label="Annual salary"
          prefix="₹"
          format={formatINR}
          value={income}
          min={300000}
          max={5000000}
          step={25000}
          onChange={setIncome}
        />
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Salaried, under 60, standard deduction only. 80C, HRA and other
          deductions are not included. FY 2025-26 slabs with 87A rebate and
          marginal relief, plus 4% cess.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 self-start">
        {(
          [
            ["Old regime", oldR, "old"],
            ["New regime", newR, "new"],
          ] as const
        ).map(([name, r, key]) => (
          <div
            key={key}
            className={`rounded-xl border p-4 sm:p-5 ${better === key ? "border-accent bg-white" : "border-rule bg-white"}`}
          >
            <p className="text-sm text-ink-soft">{name}</p>
            <p className="mt-2 text-xl tabular-nums sm:text-2xl">
              {formatINR(r.tax)}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              on {formatINR(r.taxable)} taxable
            </p>
            {better === key && (
              <p className="mt-3 inline-block rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                Lower tax
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
