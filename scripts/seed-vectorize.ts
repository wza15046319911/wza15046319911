import { readFileSync } from "node:fs";
import path from "node:path";

const KB_INDEX = path.join(process.cwd(), "src/lib/rag/kb-index.json");
const INDEX_NAME = process.env.VECTORIZE_INDEX_NAME ?? "zane-kb";

interface KbIndexChunk {
  id: string;
  topic: string;
  source: string;
  text: string;
  vector: number[];
}

async function main() {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_WORKERS_AI_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("CF_ACCOUNT_ID and CF_WORKERS_AI_TOKEN are required to seed Vectorize");
  }

  const kb = JSON.parse(readFileSync(KB_INDEX, "utf8")) as {
    placeholder?: boolean;
    chunks: KbIndexChunk[];
  };
  if (kb.placeholder) {
    throw new Error(
      "kb-index.json is a placeholder with fake vectors; run `pnpm kb:build` with real credentials before seeding Vectorize",
    );
  }

  const ndjson = kb.chunks
    .map((chunk) =>
      JSON.stringify({
        id: chunk.id,
        values: chunk.vector,
        metadata: { id: chunk.id, topic: chunk.topic, source: chunk.source, text: chunk.text },
      }),
    )
    .join("\n");

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/vectorize/v2/indexes/${INDEX_NAME}/upsert`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/x-ndjson",
    },
    body: ndjson,
  });

  const json = (await res.json()) as { success?: boolean; errors?: unknown };
  if (!res.ok || json.success === false) {
    throw new Error(`Vectorize upsert failed: ${JSON.stringify(json.errors ?? json)}`);
  }

  console.log(`Upserted ${kb.chunks.length} vectors into ${INDEX_NAME}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
