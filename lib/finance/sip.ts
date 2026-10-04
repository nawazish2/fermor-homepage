export type SipPoint = { year: number; invested: number; corpus: number };

function corpusAfter(monthly: number, months: number, annualReturnPct: number) {
  const r = annualReturnPct / 12 / 100;
  if (r === 0) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

export function sipFutureValue(
  monthly: number,
  years: number,
  annualReturnPct: number,
): { invested: number; corpus: number; gains: number; series: SipPoint[] } {
  const months = Math.round(years * 12);
  const invested = monthly * months;
  const corpus = corpusAfter(monthly, months, annualReturnPct);
  const series: SipPoint[] = [];
  for (let y = 1; y <= Math.floor(years); y++) {
    series.push({
      year: y,
      invested: monthly * y * 12,
      corpus: corpusAfter(monthly, y * 12, annualReturnPct),
    });
  }
  return { invested, corpus, gains: corpus - invested, series };
}
