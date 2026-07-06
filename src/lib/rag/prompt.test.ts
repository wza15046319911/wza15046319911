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
