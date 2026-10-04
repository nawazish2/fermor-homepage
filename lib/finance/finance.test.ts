import { describe, expect, it } from "vitest";
import { formatCompactINR, formatINR } from "./format";
import { sipFutureValue } from "./sip";
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
