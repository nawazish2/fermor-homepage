export function emi(
  principal: number,
  annualRatePct: number,
  years: number,
): { emi: number; totalInterest: number; totalPayable: number } {
  const n = Math.round(years * 12);
  if (n === 0) return { emi: 0, totalInterest: 0, totalPayable: 0 };
  const r = annualRatePct / 12 / 100;
  const monthly =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayable = monthly * n;
  return { emi: monthly, totalInterest: totalPayable - principal, totalPayable };
}
