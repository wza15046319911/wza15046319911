export interface Embedder {
  embed(texts: string[]): Promise<number[][]>;
}

const DEFAULT_MODEL = "@cf/baai/bge-m3";

export function createRestEmbedder(cfg: {
  accountId: string;
  apiToken: string;
  model?: string;
  fetchImpl?: typeof fetch;
}): Embedder {
  const model = cfg.model ?? DEFAULT_MODEL;
  const doFetch = cfg.fetchImpl ?? fetch;
  const url = `https://api.cloudflare.com/client/v4/accounts/${cfg.accountId}/ai/run/${model}`;

  return {
    async embed(texts: string[]): Promise<number[][]> {
      const res = await doFetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: texts }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        result?: { data?: number[][] };
        errors?: unknown;
      };
      if (!res.ok || json.success === false || !json.result?.data) {
        throw new Error(`Workers AI embed failed: ${JSON.stringify(json.errors ?? json)}`);
      }
      return json.result.data;
    },
  };
}

export function createBindingEmbedder(
  ai: { run: (model: string, input: unknown) => Promise<unknown> },
  model = DEFAULT_MODEL,
): Embedder {
  return {
    async embed(texts: string[]): Promise<number[][]> {
      const out = (await ai.run(model, { text: texts })) as { data?: number[][] };
      if (!out?.data) throw new Error("Workers AI binding returned no data");
      return out.data;
    },
  };
}
