import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./validate-email";

describe("normalizeEmail", () => {
  it("trims and lowercases a valid address", () => {
    expect(normalizeEmail("  Foo@Bar.com ")).toBe("foo@bar.com");
  });
  it("rejects malformed input", () => {
    expect(normalizeEmail("nope")).toBeNull();
    expect(normalizeEmail("a@b")).toBeNull();
    expect(normalizeEmail("")).toBeNull();
  });
  it("rejects non-strings", () => {
    expect(normalizeEmail(42)).toBeNull();
    expect(normalizeEmail(undefined)).toBeNull();
  });
});
