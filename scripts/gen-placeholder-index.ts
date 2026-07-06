import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chunkDoc } from "../src/lib/rag/chunk";
import type { EmbeddedChunk } from "../src/lib/rag/types";

const KB_DIR = path.join(process.cwd(), "src/content/kb");
const OUT = path.join(process.cwd(), "src/lib/rag/kb-index.json");
const DIM = 1024;

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

function seeded(seedStr: string) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function fakeVector(id: string): number[] {
  const rnd = seeded(id);
  const v = Array.from({ length: DIM }, () => rnd() * 2 - 1);
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

const files = readdirSync(KB_DIR).filter((f) => f.endsWith(".md"));
const chunks = files.flatMap((f) => {
  const topic = f.replace(/\.md$/, "");
  const text = readFileSync(path.join(KB_DIR, f), "utf8");
  return chunkDoc({ topic, source: SOURCE_LABELS[topic] ?? topic, text });
});

const embedded: EmbeddedChunk[] = chunks.map((c) => ({ ...c, vector: fakeVector(c.id) }));

const out = {
  model: "@cf/baai/bge-m3",
  dim: DIM,
  placeholder: true,
  note: "PLACEHOLDER index with deterministic fake vectors. Retrieval quality is meaningless. Regenerate real embeddings with `pnpm kb:build` once CF_ACCOUNT_ID and CF_API_TOKEN are set.",
  chunks: embedded,
};

writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote PLACEHOLDER index: ${embedded.length} chunks (dim ${DIM}) to ${OUT}`);
