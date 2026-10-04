export function emi(
  principal: number,
  annualRatePct: number,
  years: number,
): { emi: number; totalInterest: number; totalPayable: number } {
  const n = Math.round(years * 12);
  const r = annualRatePct / 12 / 100;
  const monthly =
    n === 0
      ? 0
      : r === 0
        ? principal / n
        : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = monthly * n;
  return { emi: monthly, totalInterest: totalPayable - principal, totalPayable };
}
