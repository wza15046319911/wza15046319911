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
