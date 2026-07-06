import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  getLocalRuntime,
  getWorkerRuntime,
  runChat,
  type ChatDeps,
  type WorkerRuntimeEnv,
} from "@/lib/rag/runtime";
import { fixedWindowLimit } from "@/lib/rag/ratelimit";
import type { ChatTurn } from "@/lib/rag/prompt";

export const runtime = "nodejs";

const MAX_QUESTION = 500;
const MAX_HISTORY = 8;

function getWorkerEnv(): Partial<WorkerRuntimeEnv> | null {
  try {
    return getCloudflareContext().env as Partial<WorkerRuntimeEnv>;
  } catch {
    return null;
  }
}

function resolveRuntime(): ChatDeps {
  const env = getWorkerEnv();
  if (env?.AI && env?.VECTORIZE) {
    if (!env.DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not set in the worker environment");
    }
    return getWorkerRuntime({
      AI: env.AI,
      VECTORIZE: env.VECTORIZE,
      DEEPSEEK_API_KEY: env.DEEPSEEK_API_KEY,
      DEEPSEEK_BASE_URL: env.DEEPSEEK_BASE_URL,
      DEEPSEEK_MODEL: env.DEEPSEEK_MODEL,
    });
  }
  return getLocalRuntime();
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "local";

  if (!fixedWindowLimit(ip, { limit: 15, windowMs: 60_000 })) {
    return new Response("Too many requests", { status: 429 });
  }

  let body: { question?: string; history?: ChatTurn[] };
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

  const deps = resolveRuntime();
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
