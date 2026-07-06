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

  const run = useCallback((question: string, history: ChatTurn[], botId: string) => {
    setStatus("streaming");

    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, history }),
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
                if (payload.type === "error") {
                  console.error(payload.message);
                  return { ...m, content: m.content || "Something went wrong. Please try again.", pending: false };
                }
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

      run(q, history, botId);
    },
    [messages, status, run],
  );

  const regenerate = useCallback(() => {
    if (status === "streaming") return;
    setMessages((prev) => {
      const lastUserIndex = prev.findLastIndex((m) => m.role === "user");
      if (lastUserIndex === -1) return prev;
      const lastUser = prev[lastUserIndex];
      const trimmed = prev.slice(0, lastUserIndex + 1);
      const history: ChatTurn[] = trimmed
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));
      const botId = nextId();
      queueMicrotask(() => run(lastUser.content, history, botId));
      return [...trimmed, { id: botId, role: "assistant", content: "", pending: true }];
    });
  }, [status, run]);

  return { messages, status, send, stop, regenerate };
}
