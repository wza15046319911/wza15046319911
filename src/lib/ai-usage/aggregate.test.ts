import { describe, it, expect } from "vitest";
import {
  aggregateClaude,
  aggregateCodex,
  buildUsage,
  extractCodexSession,
} from "./aggregate";

describe("aggregateClaude", () => {
  it("sums all token buckets and unions models", () => {
    const ccusage = {
      totals: {
        inputTokens: 100,
        outputTokens: 200,
        cacheReadTokens: 4000,
        cacheCreationTokens: 700,
      },
      daily: [
        { modelsUsed: ["opus-4-8", "sonnet-5"] },
        { modelsUsed: ["sonnet-5", "haiku-4-5"] },
      ],
    };
    const r = aggregateClaude(ccusage, 42);
    expect(r.tokens).toBe(5000);
    expect(r.sessions).toBe(42);
    expect(r.models.sort()).toEqual(["haiku-4-5", "opus-4-8", "sonnet-5"]);
  });

  it("treats missing fields as zero", () => {
    expect(aggregateClaude({}, 0)).toEqual({
      sessions: 0,
      tokens: 0,
      models: [],
    });
  });
});

describe("extractCodexSession", () => {
  it("takes the last total_token_usage and collects models", () => {
    const content = [
      '{"payload":{"model":"gpt-5-codex","total_token_usage":{"total_tokens":10}}}',
      '{"payload":{"model":"gpt-5.1-codex","total_token_usage":{"total_tokens":250}}}',
    ].join("\n");
    const r = extractCodexSession(content);
    expect(r.tokens).toBe(250);
    expect(r.models.sort()).toEqual(["gpt-5-codex", "gpt-5.1-codex"]);
  });

  it("returns zero tokens when no usage block is present", () => {
    expect(extractCodexSession("{}").tokens).toBe(0);
  });
});

describe("aggregateCodex", () => {
  it("sums per-session totals and picks the earliest date", () => {
    const sessions = [
      {
        content: '{"total_token_usage":{"total_tokens":100},"model":"gpt-5-codex"}',
        date: "2026-01-05",
      },
      {
        content: '{"total_token_usage":{"total_tokens":50},"model":"gpt-5.2-codex"}',
        date: "2025-09-04",
      },
    ];
    const r = aggregateCodex(sessions);
    expect(r.sessions).toBe(2);
    expect(r.tokens).toBe(150);
    expect(r.since).toBe("2025-09-04");
    expect(r.models.length).toBe(2);
  });
});

describe("buildUsage", () => {
  const usage = buildUsage({
    generatedAt: "2026-07-06",
    claude: { sessions: 835, tokens: 2_561_804_978, models: ["a", "b"] },
    codex: {
      sessions: 265,
      tokens: 733_373_649,
      models: ["c", "d", "b"],
      since: "2025-09-04",
    },
  });

  it("combines totals and de-duplicates the model count", () => {
    expect(usage.combined.sessions).toBe(1100);
    expect(usage.combined.tokens).toBe(3_295_178_627);
    expect(usage.combined.models).toBe(4);
    expect(usage.combined.since).toBe("2025-09");
  });

  it("emits only aggregate keys, never cost or transcript text", () => {
    const serialized = JSON.stringify(usage);
    for (const forbidden of ["cost", "cwd", "prompt", "text", "input_tokens"]) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
