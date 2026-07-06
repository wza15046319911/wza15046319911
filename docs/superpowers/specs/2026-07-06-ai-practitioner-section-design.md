# AI Practitioner Section - Design

Date: 2026-07-06

## Goal

Add a portfolio section that establishes Zane as a heavy, deliberate AI practitioner:
daily use of Claude Code, Codex and Cursor, real usage numbers from Claude Code and Codex,
and a curated set of principles from his personal CLAUDE.md.
The same material feeds the site's RAG chat so "how do you use AI?" is answerable.

## Decisions (from brainstorming)

- Data source: build-time snapshot. A script pulls real aggregates and commits a JSON file. No runtime cost, no live CI.
- Metrics: show tokens, sessions, model count and timespan. Do NOT publish dollar cost.
- CLAUDE.md: curated principles only, not the full file.
- Placement: a new `#ai` section right after the hero, before Selected work.
- Style: reuse the existing editorial system (SectionRule, Reveal, NumberTicker, ink/dim/line tokens). No new aesthetic.

## Real data basis (as of 2026-07-06)

- Claude Code: 835 session transcripts, ~2.56B tokens, 6 models (Opus 4.8/4.7, Sonnet 5/4.6, Fable 5, Haiku 4.5).
- Codex: 265 sessions, ~733M tokens, 10 models (gpt-5-codex through gpt-5.5), since 2025-09.
- Combined displayed figures (rounded): ~3.3B tokens, 1,100+ sessions, 16 models, agentic tools since 2025.
- Cursor: usage lives in the cloud dashboard, not extractable locally. Shown qualitatively, no numbers.

## Components

### 1. Extraction script - `scripts/build-ai-usage.ts`

Run manually via a new `ai:build` npm script, alongside `kb:build`.

- Claude Code: shell out to `ccusage --json`; sum input + output + cache read + cache creation tokens;
  union of `modelsUsed`; session count from the number of `*.jsonl` files under `~/.claude/projects`.
- Codex: parse `~/.codex/sessions/**/*.jsonl` and `~/.codex/archived_sessions/*.jsonl`;
  take the last `total_token_usage` per file for tokens; count files for sessions; union of `model` values;
  earliest date from filenames for `since`.
- Output: `src/content/ai-usage.json`.

Output schema (aggregates only):

```json
{
  "generatedAt": "2026-07-06",
  "combined": { "tokens": 3300000000, "sessions": 1100, "models": 16, "since": "2025-09" },
  "tools": [
    { "key": "claude-code", "sessions": 835, "tokens": 2560000000, "models": 6 },
    { "key": "codex", "sessions": 265, "tokens": 733000000, "models": 10, "since": "2025-09" }
  ]
}
```

Privacy: the script emits ONLY aggregate counts. It never writes dollar cost, cwd paths,
prompts, responses, file names, or any transcript text. A test asserts this.

### 2. Static content - `src/lib/data.ts`

New types and exports (prose is hand-written, numbers come from the JSON):

- `AiTool { key, name, role, description }` - the Claude Code / Codex / Cursor triad copy.
- `AiPrinciple { title, body }` - 4 to 6 curated CLAUDE.md principles.
- `aiPractice { headline, intro }` - the section's opening statement.

### 3. UI - `#ai` section in `src/app/portfolio/page.tsx`

Rendered after the hero `</section>`, before `#work`. Four blocks, all using existing primitives:

1. Headline + intro paragraph (SectionRule "AI practice" + a strong one-liner and a short paragraph).
2. Stat tiles: tokens, sessions, models, timespan - animated with NumberTicker. No cost.
3. Tool triad: three cards (Claude Code, Codex, Cursor) with role label and description;
   Claude Code and Codex also show `sessions / tokens / models`, Cursor is qualitative.
4. Curated CLAUDE.md principles as a titled list / code-style cards.

Add an `#ai` link to the header nav and `FloatingNav` links.

### 4. NumberTicker enhancement

Add an optional `decimals` prop (default 0) and format with `toLocaleString` so the ticker can
render `3.3B` and `1,100`. Backward compatible: existing integer stats are unaffected.

### 5. RAG chat - `src/content/kb/ai-practice.md`

New KB doc describing the AI workflow, tools, rounded usage figures and the guiding principles,
so the chat can answer AI-usage questions. Rebuild the index with `kb:build`.

## Testing

- Vitest for the Codex parsing / aggregation helper: correct sums and counts on a small fixture,
  and an assertion that the emitted object contains no `cost`/`text`/`cwd` keys.
- `pnpm lint` and existing `pnpm test` stay green.
- Manual: screenshot the `#ai` section on `/portfolio` to confirm layout and animation.

## Out of scope

- Live / scheduled updates (would need usage data inside CI).
- Cursor numbers (cloud-only).
- Publishing dollar spend.
- Showing the full CLAUDE.md.
