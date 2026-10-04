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
