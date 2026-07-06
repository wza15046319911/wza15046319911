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
    <div className="flex items-end gap-2 border border-line-strong rounded-2xl bg-canvas px-4 py-3 focus-within:border-ink/60">
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
        className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-canvas transition-opacity disabled:opacity-40"
      >
        Send
      </button>
    </div>
  );
}
