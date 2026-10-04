/** Monthly SIP needed to reach `target` in `years` at `annualReturnPct`. */
export function monthlyForGoal(
  target: number,
  years: number,
  annualReturnPct: number,
): number {
  const n = Math.round(years * 12);
  if (n === 0) return 0;
  const r = annualReturnPct / 12 / 100;
  if (r === 0) return target / n;
  return target / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}
