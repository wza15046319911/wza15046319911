import Link from "next/link";

export function ModeToggle({
  current,
  offset = "bottom-6",
}: {
  current: "ask" | "portfolio";
  offset?: string;
}) {
  const base = "rounded-full px-3.5 py-1.5 transition-colors";
  const active = "bg-ink text-canvas";
  const idle = "text-dim hover:text-ink";
  return (
    <div
      className={`fixed right-5 z-50 inline-flex items-center rounded-full border border-line bg-canvas/90 p-1 text-sm backdrop-blur-sm md:right-8 ${offset}`}
    >
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
