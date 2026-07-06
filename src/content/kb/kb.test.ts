import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/content/kb");

describe("kb content", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));

  it("has at least 8 markdown files", () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
  });

  it("every file starts with a heading and has body text", () => {
    for (const f of files) {
      const raw = readFileSync(path.join(dir, f), "utf8").trim();
      expect(raw.startsWith("# ")).toBe(true);
      expect(raw.length).toBeGreaterThan(200);
    }
  });
});
