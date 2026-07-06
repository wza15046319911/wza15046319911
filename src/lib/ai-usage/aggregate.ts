export interface ToolUsage {
  key: string;
  sessions: number;
  tokens: number;
  models: number;
  since?: string;
}

export interface AiUsage {
  generatedAt: string;
  combined: {
    tokens: number;
    sessions: number;
    models: number;
    since: string;
  };
  tools: ToolUsage[];
}

interface CcusageTotals {
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
}

interface CcusageJson {
  totals?: CcusageTotals;
  daily?: { modelsUsed?: string[] }[];
}

export function aggregateClaude(
  ccusage: CcusageJson,
  sessionCount: number,
): { sessions: number; tokens: number; models: string[] } {
  const t = ccusage.totals ?? {};
  const tokens =
    (t.inputTokens ?? 0) +
    (t.outputTokens ?? 0) +
    (t.cacheReadTokens ?? 0) +
    (t.cacheCreationTokens ?? 0);
  const models = new Set<string>();
  for (const day of ccusage.daily ?? []) {
    for (const m of day.modelsUsed ?? []) models.add(m);
  }
  return { sessions: sessionCount, tokens, models: [...models] };
}

const TOKEN_USAGE_RE = /"total_token_usage":\s*(\{[^}]*\})/g;
const MODEL_RE = /"model":\s*"([^"]+)"/g;

export function extractCodexSession(content: string): {
  tokens: number;
  models: string[];
} {
  let last: number | null = null;
  let match: RegExpExecArray | null;
  TOKEN_USAGE_RE.lastIndex = 0;
  while ((match = TOKEN_USAGE_RE.exec(content))) {
    try {
      const obj = JSON.parse(match[1]) as { total_tokens?: number };
      if (typeof obj.total_tokens === "number") last = obj.total_tokens;
    } catch {
      // ignore malformed usage blocks
    }
  }
  const models = new Set<string>();
  MODEL_RE.lastIndex = 0;
  while ((match = MODEL_RE.exec(content))) models.add(match[1]);
  return { tokens: last ?? 0, models: [...models] };
}

export function aggregateCodex(
  sessions: { content: string; date: string | null }[],
): { sessions: number; tokens: number; models: string[]; since: string | null } {
  let tokens = 0;
  const models = new Set<string>();
  const dates: string[] = [];
  for (const session of sessions) {
    const r = extractCodexSession(session.content);
    tokens += r.tokens;
    for (const m of r.models) models.add(m);
    if (session.date) dates.push(session.date);
  }
  dates.sort();
  return {
    sessions: sessions.length,
    tokens,
    models: [...models],
    since: dates[0] ?? null,
  };
}

export function buildUsage(params: {
  generatedAt: string;
  claude: { sessions: number; tokens: number; models: string[] };
  codex: { sessions: number; tokens: number; models: string[]; since: string | null };
}): AiUsage {
  const { generatedAt, claude, codex } = params;
  const modelSet = new Set<string>([...claude.models, ...codex.models]);
  const since = (codex.since ?? "").slice(0, 7) || "2025-09";
  return {
    generatedAt,
    combined: {
      tokens: claude.tokens + codex.tokens,
      sessions: claude.sessions + codex.sessions,
      models: modelSet.size,
      since,
    },
    tools: [
      {
        key: "claude-code",
        sessions: claude.sessions,
        tokens: claude.tokens,
        models: claude.models.length,
      },
      {
        key: "codex",
        sessions: codex.sessions,
        tokens: codex.tokens,
        models: codex.models.length,
        since,
      },
    ],
  };
}
