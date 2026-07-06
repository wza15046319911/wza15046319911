import { describe, it, expect, vi } from "vitest";
import { runChat, getWorkerRuntime } from "./runtime";
import { InMemoryStore } from "./store";
import type { EmbeddedChunk } from "./types";

const index: EmbeddedChunk[] = [
  { id: "p#0", topic: "p", source: "Project - Piggy Way", text: "BFF layer proxies backend", vector: [1, 0] },
];
const deps = (embed: number[], stream: string[]) => ({
  embedder: { embed: async () => [embed] },
  store: new InMemoryStore(index),
  deepseek: {
    apiKey: "k",
    fetchImpl: vi.fn(async () => {
      const enc = new TextEncoder();
      const body = new ReadableStream<Uint8Array>({
        start(c) {
          for (const s of stream) c.enqueue(enc.encode(`data: {"choices":[{"delta":{"content":"${s}"}}]}\n\n`));
          c.enqueue(enc.encode("data: [DONE]\n\n"));
          c.close();
        },
      });
      return new Response(body, { status: 200 });
    }) as unknown as typeof fetch,
  },
});

async function collect(gen: AsyncGenerator<{ type: string }>) {
  const out: { type: string }[] = [];
  for await (const e of gen) out.push(e);
  return out;
}

describe("runChat", () => {
  it("short-circuits contact questions without calling DeepSeek", async () => {
    const d = deps([1, 0], ["should not appear"]);
    const events = await collect(runChat({ question: "what is your email?", history: [] }, d));
    const text = events.filter((e) => e.type === "token").map((e) => (e as { text: string }).text).join("");
    expect(text.toLowerCase()).toContain("email");
    expect(d.deepseek.fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses off-topic questions via the answerability gate", async () => {
    const d = deps([0, 1], ["nope"]);
    const events = await collect(runChat({ question: "what is the weather?", history: [] }, d));
    const text = events.filter((e) => e.type === "token").map((e) => (e as { text: string }).text).join("");
    expect(text).toContain("only answer questions about Zane");
  });

  it("emits citations then streamed tokens for a covered question", async () => {
    const d = deps([1, 0], ["Piggy ", "Way"]);
    const events = await collect(runChat({ question: "tell me about Piggy Way", history: [] }, d));
    expect(events[0]).toEqual({ type: "citations", sources: ["Project - Piggy Way"] });
    const text = events.filter((e) => e.type === "token").map((e) => (e as { text: string }).text).join("");
    expect(text).toBe("Piggy Way");
    expect(events[events.length - 1]).toEqual({ type: "done" });
  });
});

describe("getWorkerRuntime", () => {
  const ai = { run: vi.fn(async () => ({ data: [[1, 0]] })) };
  const vectorize = { query: vi.fn(async () => ({ matches: [] })) };

  it("builds a ChatDeps from Cloudflare bindings", async () => {
    const deps = getWorkerRuntime({ AI: ai, VECTORIZE: vectorize, DEEPSEEK_API_KEY: "k" });
    expect(deps.deepseek.apiKey).toBe("k");
    await deps.embedder.embed(["hello"]);
    expect(ai.run).toHaveBeenCalled();
    await deps.store.query([1, 0], 1);
    expect(vectorize.query).toHaveBeenCalled();
  });

  it("throws when the DeepSeek key is missing", () => {
    expect(() => getWorkerRuntime({ AI: ai, VECTORIZE: vectorize, DEEPSEEK_API_KEY: "" })).toThrow(
      "DEEPSEEK_API_KEY is required",
    );
  });
});
