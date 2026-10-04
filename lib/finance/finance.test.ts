import { describe, expect, it } from "vitest";
import { formatAxisINR, formatCompactINR, formatINR, formatNumberIN } from "./format";
import { sipCurve, sipFutureValue } from "./sip";
import { monthlyForGoal } from "./goal";
import { emi } from "./emi";
import { computeTax } from "./tax";

describe("format", () => {
  it("groups rupees in the Indian system", () => {
    expect(formatINR(1234567)).toBe("₹12,34,567");
  });
  it("compacts to lakh and crore", () => {
    expect(formatCompactINR(2323391)).toBe("₹23.23 L");
    expect(formatCompactINR(16400000)).toBe("₹1.64 Cr");
  });
  it("leaves small amounts and zero uncompacted", () => {
    expect(formatCompactINR(0)).toBe("₹0");
    expect(formatCompactINR(9999)).toBe("₹9,999");
  });
});

describe("sipFutureValue", () => {
  it("computes 10k/month for 10 years at 12%", () => {
    const r = sipFutureValue(10000, 10, 12);
    expect(Math.round(r.corpus)).toBe(2323391);
    expect(r.invested).toBe(1200000);
    expect(r.series).toHaveLength(10);
    expect(r.series[9].corpus).toBeCloseTo(r.corpus, 5);
  });
  it("stays finite at 0% return", () => {
    expect(sipFutureValue(10000, 10, 0).corpus).toBe(1200000);
  });
});

describe("emi", () => {
  it("computes a 60L loan at 8.5% over 20 years", () => {
    expect(Math.abs(emi(6000000, 8.5, 20).emi - 52073)).toBeLessThan(50);
  });
  it("stays finite at 0% interest", () => {
    expect(emi(1200000, 0, 10).emi).toBe(10000);
  });
});

describe("computeTax", () => {
  it("gives zero new-regime tax at the 87A rebate edge", () => {
    expect(computeTax(1275000, "new")).toEqual({ taxable: 1200000, tax: 0 });
  });
  it("taxes a 15L new-regime income", () => {
    expect(computeTax(1500000, "new")).toEqual({ taxable: 1425000, tax: 97500 });
  });
  it("taxes a 10L old-regime income", () => {
    expect(computeTax(1000000, "old")).toEqual({ taxable: 950000, tax: 106600 });
  });
  it("never returns negative tax", () => {
    expect(computeTax(0, "new").tax).toBe(0);
    expect(computeTax(200000, "old").tax).toBe(0);
  });
});

describe("review fixes", () => {
  it("applies 87A marginal relief just above the new-regime limit", () => {
    expect(computeTax(1300000, "new")).toEqual({ taxable: 1225000, tax: 26000 });
    expect(computeTax(1325000, "new")).toEqual({ taxable: 1250000, tax: 52000 });
  });
  it("stops marginal relief once the slab tax is lower than the excess", () => {
    expect(computeTax(1350000, "new")).toEqual({ taxable: 1275000, tax: 74100 });
  });
  it("applies marginal relief in the old regime too", () => {
    expect(computeTax(555000, "old")).toEqual({ taxable: 505000, tax: 5200 });
  });
  it("never shows 100 lakh; rolls over to crore", () => {
    expect(formatCompactINR(9999600)).toBe("₹1.00 Cr");
    expect(formatCompactINR(99999999)).toBe("₹10.00 Cr");
    expect(formatCompactINR(99999.6)).toBe("₹1.00 L");
  });
  it("returns zeros for a zero-year loan", () => {
    expect(emi(100000, 8, 0)).toEqual({ emi: 0, totalInterest: 0, totalPayable: 0 });
  });
});

describe("formatAxisINR", () => {
  it("keeps chart axis labels short", () => {
    expect(formatAxisINR(0)).toBe("0");
    expect(formatAxisINR(581000)).toBe("5.8 L");
    expect(formatAxisINR(2323391)).toBe("23 L");
    expect(formatAxisINR(2336100000)).toBe("234 Cr");
    expect(formatAxisINR(9999600)).toBe("1.0 Cr");
    expect(formatAxisINR(4500)).toBe("4,500");
  });
});

describe("formatNumberIN", () => {
  it("groups digits the Indian way without a currency sign", () => {
    expect(formatNumberIN(10000)).toBe("10,000");
    expect(formatNumberIN(1234567)).toBe("12,34,567");
    expect(formatNumberIN(12.5)).toBe("12.5");
  });
});

describe("monthlyForGoal", () => {
  it("is the inverse of the SIP formula", () => {
    const m = monthlyForGoal(2000000, 5, 12);
    expect(sipFutureValue(m, 5, 12).corpus).toBeCloseTo(2000000, 2);
    expect(Math.round(m)).toBe(24246);
  });
  it("splits the target evenly at 0% return", () => {
    expect(monthlyForGoal(1200000, 10, 0)).toBe(10000);
  });
  it("returns 0 for a zero-year goal", () => {
    expect(monthlyForGoal(1000000, 0, 12)).toBe(0);
  });
});

describe("sipCurve", () => {
  it("samples a fixed number of points from today to the end", () => {
    const c = sipCurve(10000, 10, 12, 24);
    expect(c).toHaveLength(25);
    expect(c[0]).toEqual({ t: 0, invested: 0, corpus: 0 });
    expect(c[24].t).toBe(10);
    expect(c[24].corpus).toBeCloseTo(sipFutureValue(10000, 10, 12).corpus, 5);
  });
  it("keeps the same length when the years change", () => {
    expect(sipCurve(10000, 3, 12, 24)).toHaveLength(25);
  });
});
