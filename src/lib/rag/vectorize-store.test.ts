import { describe, it, expect } from "vitest";
import { VectorizeStore } from "./vectorize-store";

describe("VectorizeStore", () => {
  it("queries the binding and maps matches into RetrievedChunk[]", async () => {
    const binding = {
      query: async (vector: number[], opts: { topK: number; returnMetadata: "all" | "none" }) => {
        expect(vector).toEqual([1, 0]);
        expect(opts).toEqual({ topK: 2, returnMetadata: "all" });
        return {
          matches: [
            { score: 0.9, metadata: { id: "a#0", topic: "a", source: "A", text: "alpha" } },
            { score: 0.5, metadata: { id: "b#0", topic: "b", source: "B", text: "beta" } },
          ],
        };
      },
    };

    const store = new VectorizeStore(binding);
    const out = await store.query([1, 0], 2);

    expect(out).toEqual([
      { id: "a#0", topic: "a", source: "A", text: "alpha", score: 0.9 },
      { id: "b#0", topic: "b", source: "B", text: "beta", score: 0.5 },
    ]);
  });

  it("defaults missing metadata fields to empty strings", async () => {
    const binding = {
      query: async () => ({ matches: [{ score: 0.1 }] }),
    };

    const store = new VectorizeStore(binding);
    const out = await store.query([0, 1], 1);

    expect(out).toEqual([{ id: "", topic: "", source: "", text: "", score: 0.1 }]);
  });
});
