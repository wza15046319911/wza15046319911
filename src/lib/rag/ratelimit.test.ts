import { describe, it, expect } from "vitest";
import { fixedWindowLimit } from "./ratelimit";

describe("fixedWindowLimit", () => {
  it("allows up to the limit then blocks within the window", () => {
    const opts = { limit: 2, windowMs: 60000 };
    expect(fixedWindowLimit("ip-a", opts)).toBe(true);
    expect(fixedWindowLimit("ip-a", opts)).toBe(true);
    expect(fixedWindowLimit("ip-a", opts)).toBe(false);
    expect(fixedWindowLimit("ip-b", opts)).toBe(true);
  });
});
