import { describe, it, expect } from "vitest";
import { retrieve } from "./retrieve";
import { InMemoryStore } from "./store";
import type { EmbeddedChunk } from "./types";
import type { Embedder } from "./embed";

const index: EmbeddedChunk[] = [
  { id: "a#0", topic: "a", source: "A", text: "alpha", vector: [1, 0] },
  { id: "b#0", topic: "b", source: "B", text: "beta", vector: [0, 1] },
];
const store = new InMemoryStore(index);
const fakeEmbedder = (vec: number[]): Embedder => ({ embed: async () => [vec] });

describe("retrieve", () => {
  it("returns answerable=true when top score clears the threshold", async () => {
    const out = await retrieve("q", fakeEmbedder([1, 0]), store, { threshold: 0.4 });
    expect(out.answerable).toBe(true);
    expect(out.chunks[0].id).toBe("a#0");
  });

  it("returns answerable=false when nothing clears the threshold", async () => {
    const out = await retrieve("q", fakeEmbedder([0.2, 0.2]), store, { threshold: 0.99 });
    expect(out.answerable).toBe(false);
  });
});
