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
