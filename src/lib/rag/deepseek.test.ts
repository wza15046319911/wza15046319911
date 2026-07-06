import { describe, it, expect, vi } from "vitest";
import { streamDeepSeek } from "./deepseek";

function sseStream(lines: string[]): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const l of lines) controller.enqueue(enc.encode(l));
      controller.close();
    },
  });
}

describe("streamDeepSeek", () => {
  it("yields content deltas and stops at [DONE]", async () => {
    const body = sseStream([
      'data: {"choices":[{"delta":{"content":"Hel"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":"lo"}}]}\n\n',
      "data: [DONE]\n\n",
    ]);
    const fetchImpl = vi.fn(async () => new Response(body, { status: 200 }));
    const chunks: string[] = [];
    for await (const t of streamDeepSeek(
      { apiKey: "k", fetchImpl: fetchImpl as unknown as typeof fetch },
      [{ role: "user", content: "hi" }],
    )) {
      chunks.push(t);
    }
    expect(chunks.join("")).toBe("Hello");
  });

  it("throws on a non-ok response", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 401 }));
    const gen = streamDeepSeek(
      { apiKey: "k", fetchImpl: fetchImpl as unknown as typeof fetch },
      [{ role: "user", content: "hi" }],
    );
    await expect(gen.next()).rejects.toThrow();
  });
});
