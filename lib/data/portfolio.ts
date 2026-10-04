export type Holding = {
  name: string;
  type: "Stock" | "Mutual fund" | "ETF";
  invested: number;
  current: number;
};

// Illustrative figures only.
export const holdings: Holding[] = [
  { name: "HDFC Bank", type: "Stock", invested: 120000, current: 138400 },
  { name: "Reliance Industries", type: "Stock", invested: 150000, current: 171200 },
  { name: "Infosys", type: "Stock", invested: 90000, current: 82300 },
  { name: "Parag Parikh Flexi Cap Fund", type: "Mutual fund", invested: 300000, current: 392500 },
  { name: "UTI Nifty 50 Index Fund", type: "Mutual fund", invested: 250000, current: 289100 },
  { name: "Gold BeES", type: "ETF", invested: 80000, current: 108900 },
  { name: "Nifty BeES", type: "ETF", invested: 100000, current: 118600 },
];

export function portfolioTotals(items: Holding[]) {
  const invested = items.reduce((s, h) => s + h.invested, 0);
  const current = items.reduce((s, h) => s + h.current, 0);
  const gain = current - invested;
  return { invested, current, gain, gainPct: invested === 0 ? 0 : (gain / invested) * 100 };
}
