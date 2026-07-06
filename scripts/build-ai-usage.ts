import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { aggregateClaude, aggregateCodex, buildUsage } from "../src/lib/ai-usage/aggregate";

const OUT = path.join(process.cwd(), "src/content/ai-usage.json");
const HOME = os.homedir();

function walkJsonl(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJsonl(full));
    else if (entry.isFile() && entry.name.endsWith(".jsonl")) out.push(full);
  }
  return out;
}

function readClaude() {
  const raw = execSync("ccusage --json", { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const ccusage = JSON.parse(raw);
  const sessionCount = walkJsonl(path.join(HOME, ".claude/projects")).length;
  return aggregateClaude(ccusage, sessionCount);
}

function readCodex() {
  const files = [
    ...walkJsonl(path.join(HOME, ".codex/sessions")),
    ...walkJsonl(path.join(HOME, ".codex/archived_sessions")),
  ];
  const sessions = files.map((fp) => {
    const content = readFileSync(fp, "utf8");
    const dateMatch = path.basename(fp).match(/(\d{4}-\d{2}-\d{2})/);
    return { content, date: dateMatch ? dateMatch[1] : null };
  });
  return aggregateCodex(sessions);
}

function main() {
  const claude = readClaude();
  const codex = readCodex();
  const generatedAt = new Date().toISOString().slice(0, 10);
  const usage = buildUsage({ generatedAt, claude, codex });
  writeFileSync(OUT, JSON.stringify(usage, null, 2) + "\n");
  console.log(
    `Wrote ${OUT}: ${usage.combined.tokens} tokens, ${usage.combined.sessions} sessions, ${usage.combined.models} models`,
  );
}

main();
