// Slabs for FY 2025-26 (AY 2026-27); Budget 2026 left them unchanged for FY 2026-27.
// Salaried individual, below 60, no deductions beyond the standard deduction.
// 87A marginal relief is applied: tax above the rebate limit never exceeds
// the income above that limit.

type Regime = "old" | "new";

// [upper bound of slab, rate]
const SLABS: Record<Regime, [number, number][]> = {
  new: [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ],
  old: [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.2],
    [Infinity, 0.3],
  ],
};

const STANDARD_DEDUCTION: Record<Regime, number> = { new: 75000, old: 50000 };
const REBATE_LIMIT: Record<Regime, number> = { new: 1200000, old: 500000 };
const CESS = 0.04;

export function computeTax(
  grossIncome: number,
  regime: Regime,
): { taxable: number; tax: number } {
  const taxable = Math.max(0, grossIncome - STANDARD_DEDUCTION[regime]);
  if (taxable <= REBATE_LIMIT[regime]) return { taxable, tax: 0 };

  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of SLABS[regime]) {
    if (taxable > lower) tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  tax = Math.min(tax, taxable - REBATE_LIMIT[regime]);
  return { taxable, tax: Math.round(tax * (1 + CESS)) };
}
