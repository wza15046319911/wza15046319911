import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src/lib/rag/kb-index.json");

describe("kb-index.json", () => {
  it("exists and has embedded chunks with a consistent dimension", () => {
    expect(existsSync(file)).toBe(true);
    const idx = JSON.parse(readFileSync(file, "utf8")) as {
      dim: number;
      chunks: { id: string; text: string; vector: number[] }[];
    };
    expect(idx.chunks.length).toBeGreaterThan(5);
    for (const c of idx.chunks) {
      expect(c.vector.length).toBe(idx.dim);
      expect(c.text.length).toBeGreaterThan(0);
    }
  });
});
