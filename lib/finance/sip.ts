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

export type CurvePoint = { t: number; invested: number; corpus: number };

/**
 * Evenly spaced points from today to `years`. The length depends only on
 * `samples`, so a chart can tween between curves when the years change.
 */
export function sipCurve(
  monthly: number,
  years: number,
  annualReturnPct: number,
  samples = 24,
): CurvePoint[] {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const t = (years * i) / samples;
    const months = Math.round(t * 12);
    return {
      t,
      invested: monthly * months,
      corpus: corpusAfter(monthly, months, annualReturnPct),
    };
  });
}
