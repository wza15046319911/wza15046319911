import type { EmbeddedChunk, RetrievedChunk } from "./types";

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export interface VectorStore {
  query(vector: number[], topK: number): Promise<RetrievedChunk[]>;
}

export class InMemoryStore implements VectorStore {
  private index: EmbeddedChunk[];

  constructor(index: EmbeddedChunk[]) {
    this.index = index;
  }

  async query(vector: number[], topK: number): Promise<RetrievedChunk[]> {
    return this.index
      .map((c) => ({
        id: c.id,
        topic: c.topic,
        source: c.source,
        text: c.text,
        score: cosineSimilarity(vector, c.vector),
      }))
      .sort((x, y) => y.score - x.score)
      .slice(0, topK);
  }
}
