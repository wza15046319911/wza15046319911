"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@/lib/chat/useChat";
import { Composer } from "@/components/chat/composer";
import { Message } from "@/components/chat/message";
import { ModeToggle } from "@/components/mode-toggle";
import { STARTER_QUESTIONS } from "@/lib/rag/prompt";

export default function Home() {
  const { messages, status, send, stop, regenerate } = useChat();
  const empty = messages.length === 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-[760px] flex-col px-5 md:px-8">
      <noscript>
        <div className="py-6 text-sm text-dim">
          This assistant needs JavaScript. Visit{" "}
          <a href="/portfolio" className="text-blue underline underline-offset-4">
            the portfolio
          </a>{" "}
          instead.
        </div>
      </noscript>
      <ModeToggle current="ask" offset="bottom-24 min-[960px]:bottom-6" />
      <header className="flex items-center justify-between py-6">
        <span className="text-xl font-bold tracking-tight">Zane Wang</span>
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
              <Message key={m.id} message={m} streaming={status === "streaming"} />
            ))}
            <div ref={scrollRef} />
          </div>
          <div className="flex justify-end pb-2">
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
          </div>
          <div className="sticky bottom-0 bg-canvas pb-6 pt-2">
            <Composer onSubmit={send} disabled={status === "streaming"} />
          </div>
        </div>
      )}
    </div>
  );
}
