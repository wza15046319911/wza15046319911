import Link from "next/link";

export function ModeToggle({ current }: { current: "ask" | "portfolio" }) {
  const base =
    "px-3 py-1 text-sm transition-colors underline-offset-4";
  const active = "text-ink underline";
  const idle = "text-dim hover:text-ink hover:underline";
  return (
    <div className="inline-flex items-center gap-1 border border-line rounded-full px-1 py-0.5">
      <Link href="/" className={`${base} ${current === "ask" ? active : idle}`}>
        Ask me
      </Link>
      <Link
        href="/portfolio"
        className={`${base} ${current === "portfolio" ? active : idle}`}
      >
        Portfolio
      </Link>
    </div>
  );
}
