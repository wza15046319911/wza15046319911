import type { Embedder } from "./embed";
import type { VectorStore } from "./store";
import type { RetrievedChunk } from "./types";

export interface RetrieveResult {
  answerable: boolean;
  chunks: RetrievedChunk[];
}

export async function retrieve(
  query: string,
  embedder: Embedder,
  store: VectorStore,
  opts: { topK?: number; threshold?: number } = {},
): Promise<RetrieveResult> {
  const topK = opts.topK ?? 4;
  const threshold = opts.threshold ?? 0.4;
  const [vector] = await embedder.embed([query]);
  const chunks = await store.query(vector, topK);
  const answerable = chunks.length > 0 && chunks[0].score >= threshold;
  return { answerable, chunks };
}
