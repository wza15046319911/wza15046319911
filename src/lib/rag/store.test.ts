import { describe, it, expect } from "vitest";
import { cosineSimilarity, InMemoryStore } from "./store";
import type { EmbeddedChunk } from "./types";

describe("cosineSimilarity", () => {
  it("is 1 for identical vectors and 0 for orthogonal", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
  it("returns 0 when a vector is all zeros", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
});

describe("InMemoryStore", () => {
  const index: EmbeddedChunk[] = [
    { id: "a#0", topic: "a", source: "A", text: "alpha", vector: [1, 0] },
    { id: "b#0", topic: "b", source: "B", text: "beta", vector: [0, 1] },
  ];
  it("ranks by cosine and returns topK with scores", async () => {
    const store = new InMemoryStore(index);
    const out = await store.query([0.9, 0.1], 1);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("a#0");
    expect(out[0].score).toBeGreaterThan(0.9);
  });
});
