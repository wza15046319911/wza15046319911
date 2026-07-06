import { describe, it, expect, vi } from "vitest";
import { createRestEmbedder } from "./embed";

describe("createRestEmbedder", () => {
  it("posts texts to the bge-m3 endpoint and returns vectors", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({ result: { data: [[0.1, 0.2], [0.3, 0.4]] }, success: true }),
        { status: 200 },
      ),
    );
    const embedder = createRestEmbedder({
      accountId: "acc",
      apiToken: "tok",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    const out = await embedder.embed(["a", "b"]);
    expect(out).toEqual([[0.1, 0.2], [0.3, 0.4]]);

    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toContain("/accounts/acc/ai/run/@cf/baai/bge-m3");
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: "Bearer tok",
    });
  });

  it("throws when the API reports failure", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(JSON.stringify({ success: false, errors: ["bad"] }), { status: 400 }),
    );
    const embedder = createRestEmbedder({
      accountId: "acc",
      apiToken: "tok",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(embedder.embed(["a"])).rejects.toThrow();
  });
});
