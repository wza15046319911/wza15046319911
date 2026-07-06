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
