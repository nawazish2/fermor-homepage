import { describe, expect, it } from "vitest";
import { clamp } from "./clamp";

describe("clamp", () => {
  it("keeps in-range values", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  it("limits values to the range", () => {
    expect(clamp(-3, 1, 10)).toBe(1);
    expect(clamp(99, 1, 10)).toBe(10);
  });
  it("returns min for NaN", () => {
    expect(clamp(NaN, 1, 10)).toBe(1);
  });
});

import { snap } from "./clamp";

describe("snap", () => {
  it("rounds to the nearest step and clamps", () => {
    expect(snap(2.55, 1, 30, 1)).toBe(3);
    expect(snap(200000, 500, 100000, 500)).toBe(100000);
    expect(snap(NaN, 1, 30, 1)).toBe(1);
  });
  it("avoids floating-point residue", () => {
    expect(snap(8.57, 5, 15, 0.1)).toBe(8.6);
    expect(snap(12.34, 1, 20, 0.5)).toBe(12.5);
  });
});
