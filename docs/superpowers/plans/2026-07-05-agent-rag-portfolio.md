# Agent Mode - RAG Q&A Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a default ChatGPT-style Agent mode to the portfolio that answers questions about Zane using real vector RAG (bge-m3 embeddings + retrieval + DeepSeek generation), with the existing Swiss portfolio moved to `/portfolio` behind a toggle.

**Architecture:** A small, framework-free RAG library (`src/lib/rag/*`) is built and unit-tested in isolation: chunk KB markdown, embed with Workers AI bge-m3, retrieve top-k with cosine, gate on answerability, build a grounded DeepSeek prompt, stream the answer. A Next.js route (`/api/chat`) wires those pieces behind an SSE stream. A client chat UI (`/`) consumes the stream. The vector store is an interface with an in-memory implementation for local dev and a Cloudflare Vectorize implementation for production; both are seeded from one generated `kb-index.json`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Vitest, react-markdown, Cloudflare Workers AI (`@cf/baai/bge-m3`) via REST + binding, Cloudflare Vectorize, DeepSeek chat API (OpenAI-compatible), Cloudflare AI Gateway, Turnstile, `@opennextjs/cloudflare`.

## Global Constraints

- Language: English only across UI, KB content, and generated answers.
- Reuse existing Swiss design tokens only (`--color-base #10100e`, `--color-ink #e8e6dd`, `--color-dim #9b9789`, `--color-line`, `--color-line-strong`, `--color-blue #5c7cff`, `--font-schibsted`). No new fonts or colors.
- No emoji anywhere in code, copy, or commits. No em dashes in copy (use plain dash).
- No inline comments or docstrings unless a step explicitly includes them.
- Contact facts (email, phone, GitHub, resume link) come from deterministic code reading `src/lib/data.ts`, never from the model.
- Secrets never reach the client bundle. Only `NEXT_PUBLIC_*` vars are client-visible.
- Deliver local end-to-end first; Cloudflare deploy is the final phase.
- `pnpm lint` and `pnpm build` must pass clean at the end of every task that touches app code.
- The repository is not yet a git repo; Task 1 runs `git init`. All commits are local only. Never push to any branch as part of this plan.

---

## Phase A - Foundation

### Task 1: Project setup (git, test runner, deps, OpenNext smoke build)

**Files:**
- Create: `.env.local.example`
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/rag/.gitkeep`

**Interfaces:**
- Consumes: nothing.
- Produces: `pnpm test` (vitest), `pnpm kb:build` (tsx script runner) scripts; deps `react-markdown`, `vitest`, `tsx`, `@cloudflare/workers-types`, `@opennextjs/cloudflare`, `wrangler`.

- [ ] **Step 1: Initialize git**

Run:
```bash
cd /Users/lewisan/Desktop/zane-portfolio && git init && git add -A && git commit -m "chore: baseline before agent mode"
```
Expected: a repo is created and the current portfolio is committed.

- [ ] **Step 2: Install dependencies**

Run:
```bash
pnpm add react-markdown && pnpm add -D vitest tsx @cloudflare/workers-types @opennextjs/cloudflare wrangler
```
Expected: installs succeed, `package.json` updated.

- [ ] **Step 3: Add scripts to package.json**

In `package.json` `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest",
"kb:build": "tsx scripts/build-kb-index.ts",
"cf:build": "opennextjs-cloudflare build"
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.join(__dirname, "src") },
  },
});
```

- [ ] **Step 5: Create env example**

Create `.env.local.example`:
```bash
# Cloudflare Workers AI REST (used by kb:build and local embedding)
CF_ACCOUNT_ID=
CF_API_TOKEN=
# DeepSeek generation
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
# Turnstile (leave DEV_SKIP_TURNSTILE=1 for local dev)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
DEV_SKIP_TURNSTILE=1
```
Create `src/lib/rag/.gitkeep` (empty file) so the directory exists.

- [ ] **Step 6: Verify lint, test, and OpenNext build all run**

Run:
```bash
pnpm lint && pnpm test && pnpm cf:build
```
Expected: lint passes, vitest reports "No test files found" (exit 0), and `opennextjs-cloudflare build` completes on the current unchanged app. This de-risks the Next 16 + OpenNext adapter before any feature work. If `cf:build` fails, STOP and resolve the adapter issue (pin adapter version / add `nodejs_compat`) before continuing; this is the plan's single biggest risk.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "chore: add test runner, RAG deps, and OpenNext smoke build"
```

---

### Task 2: Knowledge base content drafts

**Files:**
- Create: `src/content/kb/intro.md`
- Create: `src/content/kb/career-switch.md`
- Create: `src/content/kb/project-piggy-way.md`
- Create: `src/content/kb/project-study-pilot.md`
- Create: `src/content/kb/project-uq-ask-anything.md`
- Create: `src/content/kb/experience.md`
- Create: `src/content/kb/tech-opinions.md`
- Create: `src/content/kb/faq.md`
- Test: `src/content/kb/kb.test.ts`

**Interfaces:**
- Consumes: facts from `src/lib/data.ts` and `public/Zane-Wang-Resume.pdf`.
- Produces: markdown KB files, each starting with a `# Title` line, then first-person prose in blank-line-separated paragraphs. Consumed by Task 6 chunker.

- [ ] **Step 1: Write the failing test**

Create `src/content/kb/kb.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/content/kb");

describe("kb content", () => {
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));

  it("has at least 8 markdown files", () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
  });

  it("every file starts with a heading and has body text", () => {
    for (const f of files) {
      const raw = readFileSync(path.join(dir, f), "utf8").trim();
      expect(raw.startsWith("# ")).toBe(true);
      expect(raw.length).toBeGreaterThan(200);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/content/kb/kb.test.ts`
Expected: FAIL (files do not exist).

- [ ] **Step 3: Draft the KB files**

Write each file below. These are drafts grounded in `data.ts`; keep first person, English, no emoji, no em dashes. Placeholders marked `[[ASK ZANE: ...]]` are intentional and must be surfaced to Zane in Step 5, not left in the final KB.

`src/content/kb/intro.md`:
```markdown
# Who is Zane Wang

I am Zane Wang, a full stack developer based in Melbourne, Australia. I have more than five years of experience designing, building, and running scalable web systems in production. On the front end I work with React and Next.js; on the back end with Node.js and Python; PostgreSQL is my default database, and I deploy on AWS and GCP.

I like owning services end to end, from the data model to the deployed endpoint. I use AI tooling such as Claude Code, Codex, and Cursor every day to ship faster, and I keep the quality bar high with code review and testing standards.

I hold a Master of Information Technology in Artificial Intelligence from the University of Melbourne and a Bachelor of Engineering in Electrical Engineering from the University of Queensland.
```

`src/content/kb/career-switch.md`:
```markdown
# Why I moved from electrical engineering to software

I started in electrical engineering at the University of Queensland. [[ASK ZANE: the real story of why you switched, what pulled you toward software, the moment it clicked]].

The engineering background still helps me: I am comfortable reasoning about systems, constraints, and trade-offs, and I am not afraid of the maths behind machine learning. I later formalized the software side with a Master of Information Technology in Artificial Intelligence at the University of Melbourne.
```

`src/content/kb/project-piggy-way.md`:
```markdown
# Piggy Way - production e-commerce

Piggy Way is a production e-commerce platform for guinea pig and rabbit supplies, built on Next.js 16 and React 19. The front end acts as a backend-for-frontend layer that proxies a dedicated backend with a Directus CMS upstream, so editors publish content without deploys.

The BFF keeps credentials server side, with silent token refresh and guest cart sessions that survive refreshes through session tokens. Stripe powers checkout, NextAuth handles Google and email sign-in, and Cloudflare Turnstile guards forms. The component library is documented in Storybook and tested with Vitest browser mode.

[[ASK ZANE: the hardest problem in Piggy Way and how you solved it; anything you would do differently]].

It is a private production codebase, so there is no public repository.
```

`src/content/kb/project-study-pilot.md`:
```markdown
# Study Pilot - exam practice platform

Study Pilot is a bilingual past-exam practice platform for university subjects. Students drill past papers under real constraints: weekly unlock schedules, timed sessions, and a single active device per account, enforced through Supabase Realtime.

The single-device session guard kicks a stale login within seconds over Realtime. Questions are embedded with bge-m3 for semantic search. Server actions with tagged caches and a mapper layer keep database shapes out of the UI, and English and Chinese locales have translation key parity enforced in CI.

The code is on GitHub at https://github.com/wza15046319911/study-pilot.

[[ASK ZANE: why you built it, who uses it, the trickiest constraint to enforce]].
```

`src/content/kb/project-uq-ask-anything.md`:
```markdown
# UQ Ask Anything - agentic RAG

UQ Ask Anything is a planner-routed agentic RAG service that answers University of Queensland course questions, grounded by design. It runs over Postgres and pgvector with six retrieval modes, from SQL filtering to bge-m3 semantic search and RRF hybrid search.

The design draws a strict boundary between deterministic code and the model. The LLM planner only fills validated filter slots, and SQL is assembled from bound parameters. High-risk enrolment facts such as prerequisites and fees come from deterministic code, never from the model. An answerability gate refuses to answer when evidence is missing, and answer drafting is citation guarded. The model backend is pluggable across Ollama, DeepSeek, and Bedrock.

This project is the direct inspiration for the chat you are using now: same bge-m3 embeddings, same answerability gate, same deterministic-versus-model discipline.

[[ASK ZANE: what you learned building it; the retrieval mode that mattered most]].
```

`src/content/kb/experience.md`:
```markdown
# Work experience

At Broadsheet Media in Melbourne (Feb 2025 to Jun 2026) I built and ran the publisher web platform: a responsive Next.js front end, Node.js APIs, and an event-bus service on GCP. I shipped scalable REST APIs in Node.js and TypeScript with Redis in front for performance, and deployed on Cloud Run, GKE, and Pub/Sub with Docker and Kubernetes CI/CD pipelines for the CMS.

At AnyStay in Brisbane (Dec 2023 to Dec 2024) I built a stays marketplace across hosts, guests, and memberships on React, GraphQL, and an AWS serverless backend. I designed DynamoDB tables and access patterns for high-throughput, low-latency workloads and decoupled core systems with an event-driven service bus deployed via Amplify and Lambda pipelines.

At TikTok in Beijing (Jul 2023 to Dec 2023) I built web middleware and APIs at social-media scale. I cut middleware latency by 60 percent with a Redis-backed queue and introduced Kafka-based event-driven architecture, running consistent dev, staging, and prod on Docker, Kubernetes, and Terraform.

At Kexing EasyGo in Brisbane (Nov 2020 to Nov 2022) I led front-end and back-end developers building an academic companion app for University of Queensland students, using React, React Native, and Node.js with a Kafka event bus between microservices. I established the Jest testing standard with coverage thresholds in CI and provisioned AWS with Terraform.

At Graviti in Shanghai (Jan 2021 to Jan 2022) I built dataset tooling for AI development: a React dashboard and a distributed Python web-crawling system coordinated through a RabbitMQ job queue, with Golang APIs behind a custom gateway and crawler workers scaled elastically on Kubernetes.
```

`src/content/kb/tech-opinions.md`:
```markdown
# How I think about technology

I prefer explicit, deterministic code for anything that must be correct: routing logic, retry policy, thresholds, and escalation rules. I let a model handle classification, summarization, drafting, and ambiguity, but I never let it decide facts that have a right answer.

I reach for boring, proven tools first: PostgreSQL before exotic stores, REST before novelty, managed platforms before bespoke infrastructure. I search for an existing open-source solution before building one. I care about simplicity, robustness, and long-term maintainability more than short-term development speed.

[[ASK ZANE: a strong opinion you hold about testing, AI tooling, or architecture that you want the bot to voice]].
```

`src/content/kb/faq.md`:
```markdown
# Frequently asked questions

Am I open to opportunities? Yes. I am open to opportunities, based in Melbourne, Australia.

Which clouds do I know? AWS and GCP in depth, with some Azure. I am comfortable with Docker, Kubernetes, Terraform, and CI/CD on GitHub Actions and Jenkins.

Which languages do I use? TypeScript and JavaScript daily, Python often, and Golang when it fits.

Can I work across the stack? Yes. I have shipped front end, back end, data modelling, messaging, and infrastructure in production roles.

[[ASK ZANE: three more questions you actually get asked, with your real answers]].
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/content/kb/kb.test.ts`
Expected: PASS.

- [ ] **Step 5: Surface placeholders to Zane and commit**

List every `[[ASK ZANE: ...]]` marker to the user and ask for the real details. Replace them with Zane's answers before the KB is treated as final. Then commit:
```bash
git add -A && git commit -m "feat: add knowledge base content drafts"
```

---

## Phase B - RAG library (framework-free, unit tested)

### Task 3: Chunking

**Files:**
- Create: `src/lib/rag/types.ts`
- Create: `src/lib/rag/chunk.ts`
- Test: `src/lib/rag/chunk.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `types.ts`: `KbChunk { id: string; topic: string; source: string; text: string }`, `EmbeddedChunk extends KbChunk { vector: number[] }`, `RetrievedChunk extends KbChunk { score: number }`.
  - `chunk.ts`: `RawDoc { topic: string; source: string; text: string }`; `chunkDoc(doc: RawDoc, maxChars = 700): KbChunk[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/chunk.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { chunkDoc } from "./chunk";

const doc = {
  topic: "demo",
  source: "Demo",
  text: "# Title\n\nFirst para.\n\nSecond para.\n\nThird para.",
};

describe("chunkDoc", () => {
  it("drops the heading and packs paragraphs", () => {
    const chunks = chunkDoc(doc, 30);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks[0].text).not.toContain("# Title");
    expect(chunks[0].text).toContain("First para.");
  });

  it("assigns stable ids and carries source/topic", () => {
    const chunks = chunkDoc(doc, 1000);
    expect(chunks[0].id).toBe("demo#0");
    expect(chunks[0].source).toBe("Demo");
    expect(chunks[0].topic).toBe("demo");
  });

  it("keeps each chunk within roughly maxChars", () => {
    const chunks = chunkDoc(doc, 20);
    for (const c of chunks) expect(c.text.length).toBeLessThanOrEqual(40);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/chunk.test.ts`
Expected: FAIL ("Cannot find module ./chunk").

- [ ] **Step 3: Implement types and chunker**

Create `src/lib/rag/types.ts`:
```ts
export interface KbChunk {
  id: string;
  topic: string;
  source: string;
  text: string;
}

export interface EmbeddedChunk extends KbChunk {
  vector: number[];
}

export interface RetrievedChunk extends KbChunk {
  score: number;
}
```

Create `src/lib/rag/chunk.ts`:
```ts
import type { KbChunk } from "./types";

export interface RawDoc {
  topic: string;
  source: string;
  text: string;
}

export function chunkDoc(doc: RawDoc, maxChars = 700): KbChunk[] {
  const paragraphs = doc.text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("#"));

  const chunks: string[] = [];
  let buffer = "";
  for (const para of paragraphs) {
    if (para.length >= maxChars) {
      if (buffer) {
        chunks.push(buffer);
        buffer = "";
      }
      chunks.push(para.slice(0, maxChars));
      continue;
    }
    if (buffer && buffer.length + para.length + 1 > maxChars) {
      chunks.push(buffer);
      buffer = para;
    } else {
      buffer = buffer ? `${buffer}\n${para}` : para;
    }
  }
  if (buffer) chunks.push(buffer);

  return chunks.map((text, i) => ({
    id: `${doc.topic}#${i}`,
    topic: doc.topic,
    source: doc.source,
    text,
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/chunk.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add KB chunker and RAG types"
```

---

### Task 4: Cosine similarity and in-memory vector store

**Files:**
- Create: `src/lib/rag/store.ts`
- Test: `src/lib/rag/store.test.ts`

**Interfaces:**
- Consumes: `EmbeddedChunk`, `RetrievedChunk` from `types.ts`.
- Produces:
  - `cosineSimilarity(a: number[], b: number[]): number`.
  - `VectorStore { query(vector: number[], topK: number): Promise<RetrievedChunk[]> }`.
  - `InMemoryStore` class implementing `VectorStore`, constructed from `EmbeddedChunk[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/store.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { cosineSimilarity, InMemoryStore } from "./store";
import type { EmbeddedChunk } from "./types";

describe("cosineSimilarity", () => {
  it("is 1 for identical vectors and 0 for orthogonal", () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
  it("returns 0 when a vector is all zeros", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
});

describe("InMemoryStore", () => {
  const index: EmbeddedChunk[] = [
    { id: "a#0", topic: "a", source: "A", text: "alpha", vector: [1, 0] },
    { id: "b#0", topic: "b", source: "B", text: "beta", vector: [0, 1] },
  ];
  it("ranks by cosine and returns topK with scores", async () => {
    const store = new InMemoryStore(index);
    const out = await store.query([0.9, 0.1], 1);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("a#0");
    expect(out[0].score).toBeGreaterThan(0.9);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/store.test.ts`
Expected: FAIL ("Cannot find module ./store").

- [ ] **Step 3: Implement store**

Create `src/lib/rag/store.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/store.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add cosine similarity and in-memory vector store"
```

---

### Task 5: Embedding client (Workers AI bge-m3)

**Files:**
- Create: `src/lib/rag/embed.ts`
- Test: `src/lib/rag/embed.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `Embedder { embed(texts: string[]): Promise<number[][]> }`.
  - `createRestEmbedder(cfg: { accountId: string; apiToken: string; model?: string; fetchImpl?: typeof fetch }): Embedder` - calls Workers AI REST `@cf/baai/bge-m3`.
  - `createBindingEmbedder(ai: { run: (model: string, input: unknown) => Promise<unknown> }, model?: string): Embedder` - for the Workers runtime AI binding.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/embed.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/embed.test.ts`
Expected: FAIL ("Cannot find module ./embed").

- [ ] **Step 3: Implement embedder**

Create `src/lib/rag/embed.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/embed.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Workers AI bge-m3 embedding client"
```

---

### Task 6: Build the KB index (chunk + embed to JSON)

**Files:**
- Create: `scripts/build-kb-index.ts`
- Create: `src/lib/rag/kb-index.json` (generated)
- Test: `src/lib/rag/kb-index.test.ts`

**Interfaces:**
- Consumes: `chunkDoc` (Task 3), `createRestEmbedder` (Task 5), KB files (Task 2).
- Produces: `kb-index.json` shaped as `{ model: string; dim: number; chunks: EmbeddedChunk[] }`, imported by later tasks as the local store seed and the Vectorize seed source. A `SOURCE_LABELS` map from topic slug to human label lives at the top of the script.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/kb-index.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src/lib/rag/kb-index.json");

describe("kb-index.json", () => {
  it("exists and has embedded chunks with a consistent dimension", () => {
    expect(existsSync(file)).toBe(true);
    const idx = JSON.parse(readFileSync(file, "utf8")) as {
      dim: number;
      chunks: { id: string; text: string; vector: number[] }[];
    };
    expect(idx.chunks.length).toBeGreaterThan(5);
    for (const c of idx.chunks) {
      expect(c.vector.length).toBe(idx.dim);
      expect(c.text.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/kb-index.test.ts`
Expected: FAIL (file does not exist).

- [ ] **Step 3: Implement the build script**

Create `scripts/build-kb-index.ts`:
```ts
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
  const apiToken = process.env.CF_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new Error("CF_ACCOUNT_ID and CF_API_TOKEN are required to build the KB index");
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
```

- [ ] **Step 4: Generate the index**

Ensure `.env.local` has real `CF_ACCOUNT_ID` and `CF_API_TOKEN` (Workers AI enabled). Run:
```bash
set -a && . ./.env.local && set +a && pnpm kb:build
```
Expected: prints "Wrote N chunks (dim 1024) ..." and creates `src/lib/rag/kb-index.json`. If Zane has not provided a token yet, STOP and request it; the rest of the local pipeline depends on this file.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/lib/rag/kb-index.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add KB index build script and generated index"
```

---

### Task 7: Retrieval with answerability gate

**Files:**
- Create: `src/lib/rag/retrieve.ts`
- Test: `src/lib/rag/retrieve.test.ts`

**Interfaces:**
- Consumes: `Embedder` (Task 5), `VectorStore` (Task 4), `RetrievedChunk` (Task 3).
- Produces:
  - `RetrieveResult { answerable: boolean; chunks: RetrievedChunk[] }`.
  - `retrieve(query: string, embedder: Embedder, store: VectorStore, opts?: { topK?: number; threshold?: number }): Promise<RetrieveResult>` - defaults `topK = 4`, `threshold = 0.4`. `answerable` is true when the best score is at or above `threshold`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/retrieve.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { retrieve } from "./retrieve";
import { InMemoryStore } from "./store";
import type { EmbeddedChunk } from "./types";
import type { Embedder } from "./embed";

const index: EmbeddedChunk[] = [
  { id: "a#0", topic: "a", source: "A", text: "alpha", vector: [1, 0] },
  { id: "b#0", topic: "b", source: "B", text: "beta", vector: [0, 1] },
];
const store = new InMemoryStore(index);
const fakeEmbedder = (vec: number[]): Embedder => ({ embed: async () => [vec] });

describe("retrieve", () => {
  it("returns answerable=true when top score clears the threshold", async () => {
    const out = await retrieve("q", fakeEmbedder([1, 0]), store, { threshold: 0.4 });
    expect(out.answerable).toBe(true);
    expect(out.chunks[0].id).toBe("a#0");
  });

  it("returns answerable=false when nothing clears the threshold", async () => {
    const out = await retrieve("q", fakeEmbedder([0.2, 0.2]), store, { threshold: 0.99 });
    expect(out.answerable).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/retrieve.test.ts`
Expected: FAIL ("Cannot find module ./retrieve").

- [ ] **Step 3: Implement retrieve**

Create `src/lib/rag/retrieve.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/retrieve.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add retrieval with answerability gate"
```

---

### Task 8: Prompt builder and deterministic contact facts

**Files:**
- Create: `src/lib/rag/prompt.ts`
- Test: `src/lib/rag/prompt.test.ts`

**Interfaces:**
- Consumes: `profile` from `src/lib/data.ts`, `RetrievedChunk` (Task 3).
- Produces:
  - `ChatTurn { role: "user" | "assistant"; content: string }`.
  - `ChatMessage { role: "system" | "user" | "assistant"; content: string }`.
  - `REFUSAL_TEXT: string`.
  - `STARTER_QUESTIONS: string[]`.
  - `contactAnswer(question: string): string | null` - deterministic contact reply, or null.
  - `buildMessages(input: { question: string; history: ChatTurn[]; chunks: RetrievedChunk[] }): ChatMessage[]`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/prompt.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildMessages, contactAnswer, REFUSAL_TEXT } from "./prompt";
import { profile } from "@/lib/data";

describe("contactAnswer", () => {
  it("returns the real email for an email question", () => {
    const out = contactAnswer("what is your email?");
    expect(out).toContain(profile.email);
  });
  it("returns null for a non-contact question", () => {
    expect(contactAnswer("what is your hardest project?")).toBeNull();
  });
});

describe("buildMessages", () => {
  it("puts retrieved context and contact facts in the system message and ends with the question", () => {
    const msgs = buildMessages({
      question: "tell me about Piggy Way",
      history: [],
      chunks: [{ id: "p#0", topic: "p", source: "Project - Piggy Way", text: "BFF details", score: 0.7 }],
    });
    expect(msgs[0].role).toBe("system");
    expect(msgs[0].content).toContain("Project - Piggy Way");
    expect(msgs[0].content).toContain(profile.email);
    expect(msgs[msgs.length - 1]).toEqual({ role: "user", content: "tell me about Piggy Way" });
  });

  it("includes prior history between system and the new question", () => {
    const msgs = buildMessages({
      question: "and Study Pilot?",
      history: [
        { role: "user", content: "hi" },
        { role: "assistant", content: "hello" },
      ],
      chunks: [],
    });
    expect(msgs.map((m) => m.role)).toEqual(["system", "user", "assistant", "user"]);
  });
});

describe("REFUSAL_TEXT", () => {
  it("is a non-empty string", () => {
    expect(REFUSAL_TEXT.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/prompt.test.ts`
Expected: FAIL ("Cannot find module ./prompt").

- [ ] **Step 3: Implement prompt builder**

Create `src/lib/rag/prompt.ts`:
```ts
import { profile } from "@/lib/data";
import type { RetrievedChunk } from "./types";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const STARTER_QUESTIONS = [
  "Who are you?",
  "What is your most challenging project?",
  "Why did you switch from electrical engineering to software?",
  "Which clouds and tools do you know?",
];

export const REFUSAL_TEXT =
  "I can only answer questions about Zane's background, projects, and experience. Try asking about his work, his tech stack, or why he moved into software.";

const CONTACT_FACTS = [
  `Email: ${profile.email}`,
  `Phone: ${profile.phone}`,
  `GitHub: ${profile.github}`,
  `Resume: ${profile.resume}`,
  `Location: ${profile.location}`,
  `Availability: ${profile.availability}`,
].join("\n");

export function contactAnswer(question: string): string | null {
  const q = question.toLowerCase();
  const wants = (words: string[]) => words.some((w) => q.includes(w));
  if (wants(["email", "e-mail", "reach you", "contact"])) {
    return `You can reach Zane by email at ${profile.email}.`;
  }
  if (wants(["phone", "call you", "number"])) {
    return `Zane's phone number is ${profile.phone}.`;
  }
  if (wants(["github", "git hub", "repositories", "repos"])) {
    return `Zane's GitHub is ${profile.github}.`;
  }
  if (wants(["resume", "cv", "curriculum"])) {
    return `You can download Zane's resume at ${profile.resume}.`;
  }
  return null;
}

const SYSTEM_PREAMBLE =
  "You are the portfolio assistant for Zane Wang, a full stack developer. " +
  "Answer in the first person as Zane, in English, in a concise and grounded way. " +
  "Only use the context below and the contact facts. If the context does not cover the question, " +
  "say you can only speak to Zane's background and suggest a related question. Never invent facts, " +
  "employers, dates, or numbers. Keep answers to a few short paragraphs.";

export function buildMessages(input: {
  question: string;
  history: ChatTurn[];
  chunks: RetrievedChunk[];
}): ChatMessage[] {
  const context = input.chunks
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.text}`)
    .join("\n\n");

  const system =
    `${SYSTEM_PREAMBLE}\n\n` +
    `Contact facts (authoritative):\n${CONTACT_FACTS}\n\n` +
    `Context:\n${context || "No relevant context was retrieved."}`;

  return [
    { role: "system", content: system },
    ...input.history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: input.question },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/prompt.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add prompt builder and deterministic contact facts"
```

---

### Task 9: DeepSeek streaming client

**Files:**
- Create: `src/lib/rag/deepseek.ts`
- Test: `src/lib/rag/deepseek.test.ts`

**Interfaces:**
- Consumes: `ChatMessage` (Task 8).
- Produces:
  - `DeepSeekConfig { apiKey: string; baseUrl?: string; model?: string; fetchImpl?: typeof fetch }`.
  - `streamDeepSeek(cfg: DeepSeekConfig, messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string>` - yields text deltas parsed from the OpenAI-compatible SSE stream.

- [ ] **Step 1: Write the failing test**

Create `src/lib/rag/deepseek.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/deepseek.test.ts`
Expected: FAIL ("Cannot find module ./deepseek").

- [ ] **Step 3: Implement DeepSeek client**

Create `src/lib/rag/deepseek.ts`:
```ts
import type { ChatMessage } from "./prompt";

export interface DeepSeekConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  fetchImpl?: typeof fetch;
}

export async function* streamDeepSeek(
  cfg: DeepSeekConfig,
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const doFetch = cfg.fetchImpl ?? fetch;
  const baseUrl = cfg.baseUrl ?? "https://api.deepseek.com";
  const res = await doFetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    signal,
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: cfg.model ?? "deepseek-chat",
      messages,
      stream: true,
      temperature: 0.3,
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`DeepSeek request failed: ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        continue;
      }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/deepseek.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add DeepSeek streaming client"
```

---

## Phase C - API and orchestration

### Task 10: Chat runtime wiring and the `/api/chat` route

**Files:**
- Create: `src/lib/rag/runtime.ts`
- Create: `src/lib/rag/ratelimit.ts`
- Create: `src/app/api/chat/route.ts`
- Test: `src/lib/rag/runtime.test.ts`
- Test: `src/lib/rag/ratelimit.test.ts`

**Interfaces:**
- Consumes: `retrieve` (7), `buildMessages`/`contactAnswer`/`REFUSAL_TEXT`/`STARTER_QUESTIONS` (8), `streamDeepSeek` (9), `InMemoryStore` (4), `createRestEmbedder` (5), `kb-index.json` (6).
- Produces:
  - `ChatEvent = { type: "citations"; sources: string[] } | { type: "token"; text: string } | { type: "done" } | { type: "error"; message: string }`.
  - `runChat(input: { question: string; history: ChatTurn[] }, deps: ChatDeps): AsyncGenerator<ChatEvent>` where `ChatDeps { embedder: Embedder; store: VectorStore; deepseek: DeepSeekConfig }`.
  - `getLocalRuntime(): ChatDeps` - builds deps from env + `kb-index.json` (used by the route in local/dev).
  - `fixedWindowLimit(key: string, opts: { limit: number; windowMs: number }): boolean` in `ratelimit.ts` - returns true when allowed.

- [ ] **Step 1: Write the failing runtime test**

Create `src/lib/rag/runtime.test.ts`:
```ts
import { describe, it, expect, vi } from "vitest";
import { runChat } from "./runtime";
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/rag/runtime.test.ts`
Expected: FAIL ("Cannot find module ./runtime").

- [ ] **Step 3: Implement runtime**

Create `src/lib/rag/runtime.ts`:
```ts
import kbIndex from "./kb-index.json";
import { createRestEmbedder, type Embedder } from "./embed";
import { InMemoryStore, type VectorStore } from "./store";
import { retrieve } from "./retrieve";
import {
  buildMessages,
  contactAnswer,
  REFUSAL_TEXT,
  type ChatTurn,
} from "./prompt";
import { streamDeepSeek, type DeepSeekConfig } from "./deepseek";
import type { EmbeddedChunk } from "./types";

export type ChatEvent =
  | { type: "citations"; sources: string[] }
  | { type: "token"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export interface ChatDeps {
  embedder: Embedder;
  store: VectorStore;
  deepseek: DeepSeekConfig;
}

export async function* runChat(
  input: { question: string; history: ChatTurn[] },
  deps: ChatDeps,
  signal?: AbortSignal,
): AsyncGenerator<ChatEvent> {
  try {
    const direct = contactAnswer(input.question);
    if (direct) {
      yield { type: "token", text: direct };
      yield { type: "done" };
      return;
    }

    const { answerable, chunks } = await retrieve(input.question, deps.embedder, deps.store);
    if (!answerable) {
      yield { type: "token", text: REFUSAL_TEXT };
      yield { type: "done" };
      return;
    }

    const sources = [...new Set(chunks.map((c) => c.source))];
    yield { type: "citations", sources };

    const messages = buildMessages({ question: input.question, history: input.history, chunks });
    for await (const delta of streamDeepSeek(deps.deepseek, messages, signal)) {
      yield { type: "token", text: delta };
    }
    yield { type: "done" };
  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : "chat failed" };
  }
}

export function getLocalRuntime(): ChatDeps {
  const accountId = process.env.CF_ACCOUNT_ID;
  const apiToken = process.env.CF_API_TOKEN;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!accountId || !apiToken) throw new Error("CF_ACCOUNT_ID and CF_API_TOKEN are required");
  if (!deepseekKey) throw new Error("DEEPSEEK_API_KEY is required");

  return {
    embedder: createRestEmbedder({ accountId, apiToken }),
    store: new InMemoryStore(kbIndex.chunks as EmbeddedChunk[]),
    deepseek: {
      apiKey: deepseekKey,
      baseUrl: process.env.DEEPSEEK_BASE_URL,
      model: process.env.DEEPSEEK_MODEL,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/rag/runtime.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing ratelimit test**

Create `src/lib/rag/ratelimit.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { fixedWindowLimit } from "./ratelimit";

describe("fixedWindowLimit", () => {
  it("allows up to the limit then blocks within the window", () => {
    const opts = { limit: 2, windowMs: 60000 };
    expect(fixedWindowLimit("ip-a", opts)).toBe(true);
    expect(fixedWindowLimit("ip-a", opts)).toBe(true);
    expect(fixedWindowLimit("ip-a", opts)).toBe(false);
    expect(fixedWindowLimit("ip-b", opts)).toBe(true);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `pnpm test src/lib/rag/ratelimit.test.ts`
Expected: FAIL ("Cannot find module ./ratelimit").

- [ ] **Step 7: Implement ratelimit**

Create `src/lib/rag/ratelimit.ts`:
```ts
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function fixedWindowLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }
  if (bucket.count >= opts.limit) return false;
  bucket.count += 1;
  return true;
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `pnpm test src/lib/rag/ratelimit.test.ts`
Expected: PASS.

- [ ] **Step 9: Implement the route**

Create `src/app/api/chat/route.ts`:
```ts
import { NextRequest } from "next/server";
import { getLocalRuntime, runChat } from "@/lib/rag/runtime";
import { fixedWindowLimit } from "@/lib/rag/ratelimit";
import type { ChatTurn } from "@/lib/rag/prompt";

export const runtime = "nodejs";

const MAX_QUESTION = 500;
const MAX_HISTORY = 8;

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (process.env.DEV_SKIP_TURNSTILE === "1") return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "local";

  if (!fixedWindowLimit(ip, { limit: 15, windowMs: 60_000 })) {
    return new Response("Too many requests", { status: 429 });
  }

  let body: { question?: string; history?: ChatTurn[]; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question || question.length > MAX_QUESTION) {
    return new Response("Invalid question", { status: 400 });
  }
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY) : [];

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return new Response("Verification failed", { status: 403 });
  }

  const deps = getLocalRuntime();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const event of runChat({ question, history }, deps, req.signal)) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

- [ ] **Step 10: Manually verify the endpoint end to end**

Ensure `.env.local` has `CF_ACCOUNT_ID`, `CF_API_TOKEN`, `DEEPSEEK_API_KEY`, and `DEV_SKIP_TURNSTILE=1`. Run `pnpm dev`, then:
```bash
curl -N -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d '{"question":"tell me about Piggy Way","history":[]}'
```
Expected: an SSE stream with a `citations` event, several `token` events forming a coherent grounded answer, then `done`. Then test a refusal:
```bash
curl -N -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d '{"question":"what is the weather in Paris?","history":[]}'
```
Expected: a single token event containing the refusal, then `done`.

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: add chat runtime, rate limiting, and /api/chat SSE route"
```

---

## Phase D - Frontend

### Task 11: Move portfolio to `/portfolio` and add the mode toggle

**Files:**
- Create: `src/app/portfolio/page.tsx` (moved from `src/app/page.tsx`)
- Create: `src/components/mode-toggle.tsx`
- Modify: `src/app/portfolio/page.tsx` (add toggle to its header)
- Delete-then-replace: `src/app/page.tsx` (becomes the chat page in Task 12; leave a temporary redirect here for this task)

**Interfaces:**
- Consumes: existing portfolio component (current `page.tsx` body).
- Produces: `ModeToggle({ current }: { current: "ask" | "portfolio" })` linking `/` and `/portfolio`.

- [ ] **Step 1: Move the portfolio page**

Run:
```bash
mkdir -p src/app/portfolio && git mv src/app/page.tsx src/app/portfolio/page.tsx
```
In `src/app/portfolio/page.tsx`, rename the default export function from `Home` to `PortfolioPage`.

- [ ] **Step 2: Create the mode toggle**

Create `src/components/mode-toggle.tsx`:
```tsx
import Link from "next/link";

export function ModeToggle({ current }: { current: "ask" | "portfolio" }) {
  const base =
    "px-3 py-1 text-sm transition-colors underline-offset-4";
  const active = "text-ink underline";
  const idle = "text-dim hover:text-ink hover:underline";
  return (
    <div className="inline-flex items-center gap-1 border border-line rounded-full px-1 py-0.5">
      <Link href="/" className={`${base} ${current === "ask" ? active : idle}`}>
        Ask me
      </Link>
      <Link
        href="/portfolio"
        className={`${base} ${current === "portfolio" ? active : idle}`}
      >
        Portfolio
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Add the toggle to the portfolio header**

In `src/app/portfolio/page.tsx`, import the toggle at the top:
```tsx
import { ModeToggle } from "@/components/mode-toggle";
```
Inside the `<nav>` element in the header (the one containing Work/Experience/Contact/CV links), add as the first child:
```tsx
<ModeToggle current="portfolio" />
```

- [ ] **Step 4: Add a temporary root redirect**

Create `src/app/page.tsx` (temporary, replaced in Task 12):
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/portfolio");
}
```

- [ ] **Step 5: Verify build and both routes**

Run:
```bash
pnpm lint && pnpm build
```
Expected: passes. Run `pnpm dev`, open `/portfolio` (renders the full Swiss site with a working toggle) and `/` (redirects to `/portfolio`).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: move portfolio to /portfolio and add mode toggle"
```

---

### Task 12: Chat page shell (empty state, input, starter chips, non-streaming submit)

**Files:**
- Create: `src/lib/chat/useChat.ts`
- Create: `src/components/chat/composer.tsx`
- Create: `src/app/page.tsx` (replace the redirect with the chat page)

**Interfaces:**
- Consumes: `STARTER_QUESTIONS` (Task 8), `/api/chat` SSE (Task 10), `ModeToggle` (Task 11).
- Produces:
  - `ChatMessageView { id: string; role: "user" | "assistant"; content: string; sources?: string[]; pending?: boolean }`.
  - `useChat(): { messages: ChatMessageView[]; status: "idle" | "streaming"; send(question: string): void; stop(): void }`.
  - `Composer({ onSubmit, disabled }: { onSubmit: (q: string) => void; disabled: boolean })`.

- [ ] **Step 1: Implement the chat hook (streaming-capable)**

Create `src/lib/chat/useChat.ts`:
```ts
"use client";

import { useCallback, useRef, useState } from "react";
import type { ChatTurn } from "@/lib/rag/prompt";

export interface ChatMessageView {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  pending?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessageView[]>([]);
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  const abortRef = useRef<AbortController | null>(null);
  const idRef = useRef(0);

  const nextId = () => `m${idRef.current++}`;

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
    setMessages((prev) =>
      prev.map((m) => (m.pending ? { ...m, pending: false } : m)),
    );
  }, []);

  const send = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q || status === "streaming") return;

      const history: ChatTurn[] = messages.map((m) => ({ role: m.role, content: m.content }));
      const userMsg: ChatMessageView = { id: nextId(), role: "user", content: q };
      const botId = nextId();
      setMessages((prev) => [
        ...prev,
        userMsg,
        { id: botId, role: "assistant", content: "", pending: true },
      ]);
      setStatus("streaming");

      const controller = new AbortController();
      abortRef.current = controller;

      (async () => {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q, history }),
            signal: controller.signal,
          });
          if (!res.ok || !res.body) throw new Error(`Request failed: ${res.status}`);

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split("\n\n");
            buffer = events.pop() ?? "";
            for (const event of events) {
              const line = event.trim();
              if (!line.startsWith("data:")) continue;
              const payload = JSON.parse(line.slice(5).trim()) as
                | { type: "citations"; sources: string[] }
                | { type: "token"; text: string }
                | { type: "done" }
                | { type: "error"; message: string };
              setMessages((prev) =>
                prev.map((m) => {
                  if (m.id !== botId) return m;
                  if (payload.type === "citations") return { ...m, sources: payload.sources };
                  if (payload.type === "token") return { ...m, content: m.content + payload.text };
                  if (payload.type === "error")
                    return { ...m, content: m.content || "Something went wrong. Please try again.", pending: false };
                  return m;
                }),
              );
            }
          }
        } catch (err) {
          if ((err as Error).name !== "AbortError") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId
                  ? { ...m, content: m.content || "Something went wrong. Please try again." }
                  : m,
              ),
            );
          }
        } finally {
          setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, pending: false } : m)));
          setStatus("idle");
          abortRef.current = null;
        }
      })();
    },
    [messages, status],
  );

  return { messages, status, send, stop };
}
```

- [ ] **Step 2: Implement the composer**

Create `src/components/chat/composer.tsx`:
```tsx
"use client";

import { useState } from "react";

export function Composer({
  onSubmit,
  disabled,
}: {
  onSubmit: (q: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="flex items-end gap-2 border border-line-strong rounded-2xl bg-base px-4 py-3 focus-within:border-ink/60">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={1}
        maxLength={500}
        placeholder="Ask me anything about Zane"
        className="max-h-40 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-dim"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-base transition-opacity disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Implement the chat page (empty state + submit; message rendering finished in Task 13)**

Replace `src/app/page.tsx`:
```tsx
"use client";

import { useChat } from "@/lib/chat/useChat";
import { Composer } from "@/components/chat/composer";
import { ModeToggle } from "@/components/mode-toggle";
import { STARTER_QUESTIONS } from "@/lib/rag/prompt";

export default function Home() {
  const { messages, status, send } = useChat();
  const empty = messages.length === 0;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[760px] flex-col px-5 md:px-8">
      <header className="flex items-center justify-between py-6">
        <span className="text-xl font-bold tracking-tight">Zane Wang</span>
        <ModeToggle current="ask" />
      </header>

      {empty ? (
        <div className="flex flex-1 flex-col justify-center pb-24">
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-tight">
            Ask me anything about Zane
          </h1>
          <p className="mt-3 text-dim">
            A grounded assistant that answers from Zane&apos;s work, projects, and experience.
          </p>
          <div className="mt-8">
            <Composer onSubmit={send} disabled={status === "streaming"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-ink/50 hover:text-ink"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col">
          <div
            data-lenis-prevent
            className="flex-1 space-y-6 overflow-y-auto py-6"
          >
            {messages.map((m) => (
              <div key={m.id} className="text-[15px] leading-relaxed">
                <div className="mb-1 text-xs text-dim">
                  {m.role === "user" ? "You" : "Zane"}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 bg-base pb-6 pt-2">
            <Composer onSubmit={send} disabled={status === "streaming"} />
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify the flow works**

Run `pnpm lint && pnpm build`, then `pnpm dev`. On `/`: the empty state shows the headline, input, and 4 starter chips. Click a chip and confirm the conversation view appears and the answer streams in (plain text is acceptable at this task; rich rendering comes next). Confirm the toggle switches to `/portfolio` and back.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add chat page shell, composer, and streaming hook"
```

---

### Task 13: Rich answer rendering (markdown, citations, interactions)

**Files:**
- Create: `src/components/chat/message.tsx`
- Modify: `src/app/page.tsx` (use `Message` in the conversation view; add stop/regenerate controls)
- Modify: `src/lib/chat/useChat.ts` (add `regenerate()` and expose `stop()` in the page)
- Modify: `src/app/globals.css` (minimal markdown typography rules scoped to `.answer`)

**Interfaces:**
- Consumes: `ChatMessageView` (Task 12), `react-markdown`.
- Produces: `Message({ message, streaming }: { message: ChatMessageView; streaming: boolean })`; `useChat` additionally returns `regenerate(): void`.

- [ ] **Step 1: Add regenerate to the hook**

In `src/lib/chat/useChat.ts`, refactor so the network logic is a private `run(question, history, botId)` helper, and `send` calls it. Add and return `regenerate`:
```ts
const regenerate = useCallback(() => {
  if (status === "streaming") return;
  setMessages((prev) => {
    const lastUser = [...prev].reverse().find((m) => m.role === "user");
    if (!lastUser) return prev;
    const trimmed = prev.slice(0, prev.findLastIndex((m) => m.role === "user") + 1);
    const history = trimmed
      .slice(0, -1)
      .map((m) => ({ role: m.role, content: m.content }));
    const botId = nextId();
    queueMicrotask(() => run(lastUser.content, history, botId));
    return [...trimmed, { id: botId, role: "assistant", content: "", pending: true }];
  });
}, [status]);
```
Return `{ messages, status, send, stop, regenerate }`. (Extract the async body from Step 1 of Task 12 into `run(q, history, botId)` and set `setStatus("streaming")` inside it.)

- [ ] **Step 2: Implement the Message component**

Create `src/components/chat/message.tsx`:
```tsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessageView } from "@/lib/chat/useChat";

export function Message({
  message,
  streaming,
}: {
  message: ChatMessageView;
  streaming: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="text-[15px] leading-relaxed">
      <div className="mb-1 text-xs text-dim">{isUser ? "You" : "Zane"}</div>
      {isUser ? (
        <p className="whitespace-pre-wrap">{message.content}</p>
      ) : (
        <div className="answer">
          <ReactMarkdown>{message.content}</ReactMarkdown>
          {message.pending && streaming ? (
            <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-ink align-middle" />
          ) : null}
          {message.sources && message.sources.length > 0 ? (
            <p className="mt-3 text-xs text-dim">
              Source: {message.sources.join(", ")}
            </p>
          ) : null}
          {!message.pending && message.content ? (
            <button
              type="button"
              onClick={copy}
              className="mt-2 text-xs text-dim underline-offset-4 hover:text-ink hover:underline"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add scoped markdown typography**

Append to `src/app/globals.css`:
```css
.answer p { margin: 0 0 0.75rem; }
.answer p:last-child { margin-bottom: 0; }
.answer ul { list-style: disc; padding-left: 1.25rem; margin: 0 0 0.75rem; }
.answer ol { list-style: decimal; padding-left: 1.25rem; margin: 0 0 0.75rem; }
.answer li { margin-bottom: 0.25rem; }
.answer strong { font-weight: 700; }
.answer a { color: var(--color-blue); text-decoration: underline; text-underline-offset: 4px; }
.answer code {
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
  background: var(--color-line);
  padding: 0.1em 0.35em;
  border-radius: 4px;
}
.answer pre {
  background: var(--color-line);
  padding: 0.75rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0 0 0.75rem;
}
.answer pre code { background: transparent; padding: 0; }
```

- [ ] **Step 4: Wire Message, stop, and regenerate into the page**

In `src/app/page.tsx`, pull `stop` and `regenerate` from `useChat`, replace the inline message markup in the conversation view with `<Message message={m} streaming={status === "streaming"} />`, and under the message list add controls:
```tsx
{status === "streaming" ? (
  <button
    type="button"
    onClick={stop}
    className="text-sm text-dim underline-offset-4 hover:text-ink hover:underline"
  >
    Stop
  </button>
) : messages.length > 0 ? (
  <button
    type="button"
    onClick={regenerate}
    className="text-sm text-dim underline-offset-4 hover:text-ink hover:underline"
  >
    Regenerate
  </button>
) : null}
```
Also auto-scroll: add a `ref` div at the end of the message list and `useEffect(() => ref.current?.scrollIntoView({ block: "end" }), [messages])`.

- [ ] **Step 5: Verify rendering and interactions**

Run `pnpm lint && pnpm build`, then `pnpm dev`. Ask "tell me about UQ Ask Anything" and confirm: markdown renders (lists/bold), a "Source: ..." line appears, the typing caret shows while streaming, Stop halts generation, Copy works, and Regenerate re-asks the last question. Check 390px width has no horizontal scroll.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: render markdown answers with citations and chat controls"
```

---

### Task 14: Turnstile widget and client integration

**Files:**
- Create: `src/components/chat/turnstile.tsx`
- Modify: `src/lib/chat/useChat.ts` (send `turnstileToken`)
- Modify: `src/app/page.tsx` (mount the widget, gate the first send)

**Interfaces:**
- Consumes: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Produces: `Turnstile({ onToken }: { onToken: (t: string) => void })`; `useChat.send(question, token?)` accepts an optional token forwarded to `/api/chat`.

- [ ] **Step 1: Implement the Turnstile widget**

Create `src/components/chat/turnstile.tsx`:
```tsx
"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void }) => void;
    };
  }
}

export function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current || !window.turnstile) return;
    window.turnstile.render(ref.current, { sitekey: siteKey, callback: onToken });
  }, [siteKey, onToken]);

  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <div ref={ref} className="mt-3" />
    </>
  );
}
```

- [ ] **Step 2: Forward the token through the hook**

In `src/lib/chat/useChat.ts`, change `send` to `send(question: string, token?: string)` and include `turnstileToken: token` in the `/api/chat` request body. Keep `regenerate` reusing the last known token via a `tokenRef` updated on each send.

- [ ] **Step 3: Mount the widget and gate sends**

In `src/app/page.tsx`, add a `token` state and `<Turnstile onToken={setToken} />` below the composer in the empty state. Change `onSubmit={send}` to `onSubmit={(q) => send(q, token ?? undefined)}`. When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set and no token yet, disable Send. In local dev (`DEV_SKIP_TURNSTILE=1`, no site key), the widget renders nothing and sends proceed.

- [ ] **Step 4: Verify both modes**

Local (no site key): run `pnpm dev`, confirm sending still works with no widget. If a test site key is available, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, remove `DEV_SKIP_TURNSTILE`, and confirm the widget renders and a send without solving it returns 403.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Turnstile verification to the chat"
```

---

### Task 15: Degradation, metadata, and reduced motion

**Files:**
- Modify: `src/app/page.tsx` (SSR fallback content, reduced-motion caret)
- Modify: `src/app/layout.tsx` (metadata already global; verify)
- Create: `src/app/portfolio/layout.tsx` (optional per-route metadata) OR modify root metadata

**Interfaces:**
- Consumes: nothing new.
- Produces: a `<noscript>` block on `/` linking to `/portfolio`, and a reduced-motion guard on the typing caret.

- [ ] **Step 1: Add a no-JS fallback**

In `src/app/page.tsx`, add near the top of the returned tree:
```tsx
<noscript>
  <div className="py-6 text-sm text-dim">
    This assistant needs JavaScript. Visit{" "}
    <a href="/portfolio" className="text-blue underline underline-offset-4">
      the portfolio
    </a>{" "}
    instead.
  </div>
</noscript>
```

- [ ] **Step 2: Respect reduced motion for the caret**

In `src/app/globals.css`, append:
```css
@media (prefers-reduced-motion: reduce) {
  .answer .animate-pulse { animation: none; }
}
```

- [ ] **Step 3: Confirm metadata**

Confirm the root `metadata` in `src/app/layout.tsx` still describes Zane. Optionally give `/` a chat-focused title by exporting `metadata` from a small server wrapper; if the chat page must stay a client component, leave the shared metadata as is.

- [ ] **Step 4: Verify**

Run `pnpm lint && pnpm build`. In dev, toggle the OS "reduce motion" setting and confirm the caret stops animating. Disable JS in the browser and confirm the noscript message links to `/portfolio`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add no-JS fallback and reduced-motion handling"
```

---

## Phase E - Cloudflare deployment

### Task 16: Vectorize store, OpenNext config, seed, and deploy

**Files:**
- Create: `src/lib/rag/vectorize-store.ts`
- Create: `scripts/seed-vectorize.ts`
- Create: `wrangler.toml`
- Create: `open-next.config.ts`
- Modify: `src/lib/rag/runtime.ts` (add `getWorkerRuntime(env)` using bindings)
- Modify: `src/app/api/chat/route.ts` (select worker vs local runtime)

**Interfaces:**
- Consumes: `kb-index.json` (Task 6), Cloudflare bindings `AI` (Workers AI), `VECTORIZE` (Vectorize index), and secrets.
- Produces:
  - `VectorizeStore` implementing `VectorStore` over a Vectorize binding.
  - `getWorkerRuntime(env): ChatDeps` building `createBindingEmbedder(env.AI)` + `VectorizeStore(env.VECTORIZE)` + DeepSeek via AI Gateway URL.

- [ ] **Step 1: Implement the Vectorize store**

Create `src/lib/rag/vectorize-store.ts`:
```ts
import type { VectorStore } from "./store";
import type { RetrievedChunk } from "./types";

interface VectorizeBinding {
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
```

- [ ] **Step 2: Add the worker runtime selector**

In `src/lib/rag/runtime.ts`, add:
```ts
import { createBindingEmbedder } from "./embed";
import { VectorizeStore } from "./vectorize-store";

export function getWorkerRuntime(env: {
  AI: { run: (m: string, i: unknown) => Promise<unknown> };
  VECTORIZE: ConstructorParameters<typeof VectorizeStore>[0];
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL?: string;
  DEEPSEEK_MODEL?: string;
}): ChatDeps {
  return {
    embedder: createBindingEmbedder(env.AI),
    store: new VectorizeStore(env.VECTORIZE),
    deepseek: {
      apiKey: env.DEEPSEEK_API_KEY,
      baseUrl: env.DEEPSEEK_BASE_URL,
      model: env.DEEPSEEK_MODEL,
    },
  };
}
```
In `src/app/api/chat/route.ts`, use `getCloudflareContext()` from `@opennextjs/cloudflare` when available to pick `getWorkerRuntime(env)`, else fall back to `getLocalRuntime()`. Route Turnstile secret and DeepSeek base URL (AI Gateway endpoint) through env.

- [ ] **Step 3: Create the Vectorize index and wrangler config**

Run:
```bash
npx wrangler vectorize create zane-kb --dimensions=1024 --metric=cosine
```
Create `wrangler.toml`:
```toml
name = "zane-portfolio"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]

[ai]
binding = "AI"

[[vectorize]]
binding = "VECTORIZE"
index_name = "zane-kb"
```

- [ ] **Step 4: Implement and run the Vectorize seed**

Create `scripts/seed-vectorize.ts` that reads `src/lib/rag/kb-index.json` and upserts each chunk as `{ id, values: vector, metadata: { id, topic, source, text } }` via wrangler or the Vectorize HTTP API. Run it:
```bash
set -a && . ./.env.local && set +a && tsx scripts/seed-vectorize.ts
```
Expected: prints the number of vectors upserted; `npx wrangler vectorize get zane-kb` shows a non-zero count.

- [ ] **Step 5: Configure OpenNext and secrets**

Create `open-next.config.ts`:
```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({});
```
Set production secrets:
```bash
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
```
Set `DEEPSEEK_BASE_URL` to the AI Gateway DeepSeek endpoint and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in the deploy env.

- [ ] **Step 6: Build, preview, and deploy**

Run:
```bash
pnpm cf:build && npx wrangler dev
```
Verify `/`, `/portfolio`, and a real chat answer work against Vectorize + Workers AI locally through wrangler. Then deploy:
```bash
npx opennextjs-cloudflare deploy
```
Expected: a live URL. Confirm chat answers stream, citations show, off-topic questions refuse, contact questions return exact facts, and Turnstile is enforced.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Vectorize store and Cloudflare deployment"
```

---

## Self-Review

**Spec coverage:**
- Real vector RAG showcase: Tasks 3-10, 16 (chunk, embed, Vectorize, retrieve, gate, DeepSeek).
- Cloudflare + OpenNext: Tasks 1 (smoke), 16 (deploy).
- Vectorize store: Task 16; in-memory dev store: Task 4/10.
- bge-m3 embeddings: Tasks 5, 6, 16.
- DeepSeek via AI Gateway: Tasks 9, 16.
- Rich first-person KB: Task 2 (drafts + Zane refinement gate).
- Chat default at `/`, portfolio at `/portfolio`, toggle: Tasks 11-13.
- English only: enforced in KB (Task 2) and prompt (Task 8).
- Answerability gate: Tasks 7, 10.
- Citations: Tasks 10, 13.
- Deterministic contact facts: Tasks 8, 10.
- Multi-turn client history: Tasks 10, 12.
- Streaming SSE: Tasks 9, 10, 12.
- Turnstile + AI Gateway + rate limit: Tasks 10, 14, 16.
- Reduced motion + no-JS degradation: Task 15.
- Local end-to-end before deploy: Phases A-D before Phase E.

**Placeholder scan:** The only intentional placeholders are `[[ASK ZANE: ...]]` markers in Task 2, which Task 2 Step 5 requires resolving with Zane before the KB is final. No `TODO`/`TBD` in code steps.

**Type consistency:** `KbChunk`/`EmbeddedChunk`/`RetrievedChunk` (Task 3) are used consistently through Tasks 4-16. `Embedder.embed(string[]) => number[][]` (Task 5) matches all callers. `VectorStore.query(number[], number)` (Task 4) matches `InMemoryStore` and `VectorizeStore`. `ChatMessage`/`ChatTurn` (Task 8) match `buildMessages`, `streamDeepSeek`, and the route. `ChatEvent` (Task 10) matches the SSE producer and the `useChat` consumer (Task 12). `ChatMessageView` (Task 12) matches `Message` (Task 13).

All private constants are self-contained within their task and do not cross task boundaries.
