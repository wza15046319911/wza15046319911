import type { VectorStore } from "./store";
import type { RetrievedChunk } from "./types";

export interface VectorizeBinding {
  query: (
    vector: number[],
    opts: { topK: number; returnMetadata: "all" | "none" },
  ) => Promise<{ matches: { score: number; metadata?: Record<string, string> }[] }>;
}

export class VectorizeStore implements VectorStore {
  constructor(private index: VectorizeBinding) {}

  async query(vector: number[], topK: number): Promise<RetrievedChunk[]> {
    const res = await this.index.query(vector, { topK, returnMetadata: "all" });
    return res.matches.map((m) => ({
      id: m.metadata?.id ?? "",
      topic: m.metadata?.topic ?? "",
      source: m.metadata?.source ?? "",
      text: m.metadata?.text ?? "",
      score: m.score,
    }));
  }
}
