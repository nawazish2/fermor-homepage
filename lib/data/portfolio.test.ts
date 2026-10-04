import { describe, expect, it } from "vitest";
import { holdings, portfolioTotals } from "./portfolio";

describe("portfolioTotals", () => {
  it("sums holdings instead of using hardcoded totals", () => {
    const t = portfolioTotals(holdings);
    expect(t.invested).toBe(holdings.reduce((s, h) => s + h.invested, 0));
    expect(t.current).toBe(holdings.reduce((s, h) => s + h.current, 0));
    expect(t.gain).toBe(t.current - t.invested);
  });
  it("computes gain percent from invested", () => {
    const t = portfolioTotals([
      { name: "A", type: "Stock", invested: 1000, current: 1100 },
    ]);
    expect(t.gainPct).toBeCloseTo(10, 5);
  });
  it("returns zero percent for an empty portfolio", () => {
    expect(portfolioTotals([])).toEqual({ invested: 0, current: 0, gain: 0, gainPct: 0 });
  });
});
