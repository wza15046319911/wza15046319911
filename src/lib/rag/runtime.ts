import kbIndex from "./kb-index.json";
import { createBindingEmbedder, createRestEmbedder, type Embedder } from "./embed";
import { InMemoryStore, type VectorStore } from "./store";
import { VectorizeStore, type VectorizeBinding } from "./vectorize-store";
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
  const apiToken = process.env.CF_WORKERS_AI_TOKEN;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!accountId || !apiToken) throw new Error("CF_ACCOUNT_ID and CF_WORKERS_AI_TOKEN are required");
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

export interface WorkerRuntimeEnv {
  AI: { run: (model: string, input: unknown) => Promise<unknown> };
  VECTORIZE: VectorizeBinding;
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_BASE_URL?: string;
  DEEPSEEK_MODEL?: string;
}

export function getWorkerRuntime(env: WorkerRuntimeEnv): ChatDeps {
  if (!env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY is required");

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
