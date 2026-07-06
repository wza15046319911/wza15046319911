import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chunkDoc } from "../src/lib/rag/chunk";
import { createRestEmbedder } from "../src/lib/rag/embed";
import type { EmbeddedChunk } from "../src/lib/rag/types";

const KB_DIR = path.join(process.cwd(), "src/content/kb");
const OUT = path.join(process.cwd(), "src/lib/rag/kb-index.json");

const SOURCE_LABELS: Record<string, string> = {
  intro: "About Zane",
  "career-switch": "Career switch",
  "project-piggy-way": "Project - Piggy Way",
  "project-study-pilot": "Project - Study Pilot",
  "project-uq-ask-anything": "Project - UQ Ask Anything",
  experience: "Work experience",
  "tech-opinions": "How Zane thinks about technology",
  faq: "FAQ",
};

async function main() {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_WORKERS_AI_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("CF_ACCOUNT_ID and CF_WORKERS_AI_TOKEN are required to build the KB index");
  }
  const embedder = createRestEmbedder({ accountId, apiToken });

  const files = readdirSync(KB_DIR).filter((f) => f.endsWith(".md"));
  const chunks = files.flatMap((f) => {
    const topic = f.replace(/\.md$/, "");
    const text = readFileSync(path.join(KB_DIR, f), "utf8");
    return chunkDoc({ topic, source: SOURCE_LABELS[topic] ?? topic, text });
  });

  const vectors = await embedder.embed(chunks.map((c) => c.text));
  const embedded: EmbeddedChunk[] = chunks.map((c, i) => ({ ...c, vector: vectors[i] }));

  const out = { model: "@cf/baai/bge-m3", dim: vectors[0].length, chunks: embedded };
  writeFileSync(OUT, JSON.stringify(out));
  console.log(`Wrote ${embedded.length} chunks (dim ${out.dim}) to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
