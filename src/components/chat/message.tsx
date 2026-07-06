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
