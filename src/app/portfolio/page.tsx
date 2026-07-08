"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { FloatingNav } from "@/components/floating-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { NumberTicker } from "@/components/number-ticker";
import { Reveal } from "@/components/reveal";
import {
  aiPractice,
  aiPrinciples,
  aiTools,
  degrees,
  profile,
  projects,
  roles,
  skillGroups,
  stats,
  type Role,
} from "@/lib/data";
import usage from "../../content/ai-usage.json";
import nbfShot from "../../../public/nothing-but-fun.png";
import piggywayShot from "../../../public/piggyway.png";
import studyPilotShot from "../../../public/study-pilot.png";
import uqAskShot from "../../../public/uq-ask-anything.png";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const screenshots: Record<string, StaticImageData> = {
  piggyway: piggywayShot,
  studypilot: studyPilotShot,
  uqask: uqAskShot,
  nbf: nbfShot,
};

const toolKeys = ["claude-code", "codex", "cursor"];

function formatTokens(tokens: number): string {
  if (tokens >= 1e9) return `${(tokens / 1e9).toFixed(1)}B`;
  if (tokens >= 1e6) return `${Math.round(tokens / 1e6)}M`;
  if (tokens >= 1e3) return `${Math.round(tokens / 1e3)}K`;
  return `${tokens}`;
}

function monthsBetween(since: string, until: string): number {
  const [sy, sm] = since.split("-").map(Number);
  const [uy, um] = until.split("-").map(Number);
  return Math.max(0, (uy - sy) * 12 + (um - sm));
}

function SectionRule({ title, meta }: { title: string; meta?: string }) {
  return (
    <Reveal>
      <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {meta ? <span className="text-sm text-dim">{meta}</span> : null}
      </div>
    </Reveal>
  );
}

function ExperienceRow({
  role,
  index,
  isLast,
}: {
  role: Role;
  index: number;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const city = role.location
    .replace(", Australia", "")
    .replace(", China (Hybrid)", "")
    .replace(", China", "");

  return (
    <Reveal delay={Math.min(index * 0.05, 0.2)}>
      <div className="grid grid-cols-[1.25rem_1fr] gap-x-4 md:grid-cols-[11rem_2rem_1fr] md:gap-x-0">
        <div className="hidden pt-[22px] pr-8 text-right text-sm whitespace-nowrap text-dim tabular-nums md:block">
          {role.period}
        </div>
        <div className="relative">
          <span
            className={`absolute left-1/2 w-px -translate-x-1/2 bg-line ${
              index === 0 ? "top-[28px]" : "top-0"
            } ${isLast ? "h-[28px]" : "bottom-0"}`}
          />
          <span className="absolute top-[24px] left-1/2 h-2 w-2 -translate-x-1/2 bg-ink" />
        </div>
        <div className={index > 0 ? "border-t border-line" : ""}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="w-full cursor-pointer py-4 text-left transition-colors hover:bg-ink/[0.04]"
          >
            <div className="text-xs text-dim tabular-nums md:hidden">
              {role.period}
            </div>
            <div className="mt-1 flex items-start justify-between gap-4 md:mt-0">
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold text-ink md:text-base">
                  {role.company}
                </span>
                <span className="mt-0.5 block text-sm text-dim">
                  {role.role}
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-4 pt-0.5">
                <span className="hidden text-sm text-dim sm:block">{city}</span>
                <span className="text-sm text-dim">{open ? "−" : "+"}</span>
              </span>
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                key="detail"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="pb-5">
                  <p className="max-w-2xl text-sm leading-relaxed text-dim">
                    {role.summary}
                  </p>
                  <ul className="mt-2 max-w-2xl list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-dim">
                    {role.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="mt-3 max-w-2xl text-xs text-dim">
                    {role.tech.join(", ")}
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </Reveal>
  );
}

export default function PortfolioPage() {
  const lenis = useLenis();

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(href === "#top" ? 0 : href, {
        offset: -16,
        duration: 1.2,
      });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const featuredCompanies = ["Broadsheet Media", "TikTok", "Kexing EasyGo"];
  const featuredRoles = roles.filter((role) =>
    featuredCompanies.includes(role.company),
  );

  const headlineLines = ["Full-stack developer", "in Melbourne."];
  const monthsWithAgents = monthsBetween(
    usage.combined.since,
    usage.generatedAt,
  );

  return (
    <div id="top" className="mx-auto max-w-[1100px] px-5 md:px-8">
      <FloatingNav />
      <ModeToggle current="portfolio" />
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="pt-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <a
            href="#top"
            onClick={(e) => goTo(e, "#top")}
            className="text-xl font-bold tracking-tight"
          >
            Zane Wang
          </a>
          <nav className="flex gap-6 text-sm">
            <a
              href="#ai"
              onClick={(e) => goTo(e, "#ai")}
              className="underline-offset-4 hover:underline"
            >
              AI
            </a>
            <a
              href="#work"
              onClick={(e) => goTo(e, "#work")}
              className="underline-offset-4 hover:underline"
            >
              Work
            </a>
            <a
              href="#experience"
              onClick={(e) => goTo(e, "#experience")}
              className="underline-offset-4 hover:underline"
            >
              Experience
            </a>
            <a
              href="#contact"
              onClick={(e) => goTo(e, "#contact")}
              className="underline-offset-4 hover:underline"
            >
              Contact
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="text-blue underline underline-offset-4 hover:no-underline"
            >
              CV
            </a>
          </nav>
        </div>
        <div className="mt-4 border-b-2 border-ink" />
      </motion.header>

      <section className="py-14 md:py-24">
        <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.02em]">
          {headlineLines.map((line, i) => (
            <span
              key={line}
              className="-mb-[0.12em] block overflow-hidden pb-[0.12em]"
            >
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="md:col-span-7"
          >
            <p className="max-w-xl text-lg leading-relaxed">{profile.intro}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
              I drive delivery in Agile teams through clear technical decisions
              and honest trade-offs. AI tooling such as Claude Code, Codex and
              Cursor is part of my daily workflow; code review and testing
              standards keep the bar where it belongs.
            </p>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
            className="text-sm md:col-span-5"
          >
            {[
              { dt: "Currently", dd: profile.availability },
              {
                dt: "Email",
                dd: profile.email,
                href: `mailto:${profile.email}`,
              },
              { dt: "GitHub", dd: "lewiswang0516", href: profile.github },
              { dt: "LinkedIn", dd: "zian-wang", href: profile.linkedin },
              { dt: "Phone", dd: profile.phone, href: profile.phoneHref },
            ].map((row) => (
              <div
                key={row.dt}
                className="flex justify-between gap-6 border-t border-line py-2.5 last:border-b"
              >
                <dt className="text-dim">{row.dt}</dt>
                <dd className="text-right">
                  {row.href ? (
                    <a
                      href={row.href}
                      target={
                        row.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        row.href.startsWith("http") ? "noreferrer" : undefined
                      }
                      className="underline underline-offset-4 hover:text-blue"
                    >
                      {row.dd}
                    </a>
                  ) : (
                    row.dd
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
          className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-6"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold tracking-tight tabular-nums md:text-3xl">
                <NumberTicker value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-xs text-dim">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <section id="ai" className="pb-16">
        <SectionRule title="AI practice" meta="Practitioner, not spectator" />
        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <Reveal delay={0.05} className="md:col-span-7">
            <p className="text-2xl leading-snug font-bold tracking-tight md:text-3xl">
              {aiPractice.headline}
            </p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dim">
              {aiPractice.intro}
            </p>
          </Reveal>
          <Reveal delay={0.15} className="md:col-span-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              {[
                {
                  value: usage.combined.tokens / 1e9,
                  decimals: 1,
                  suffix: "B",
                  label: "Tokens with agents",
                },
                {
                  value: usage.combined.sessions,
                  decimals: 0,
                  suffix: "+",
                  label: "Coding sessions",
                },
                {
                  value: usage.combined.models,
                  decimals: 0,
                  suffix: "",
                  label: "Models used",
                },
                {
                  value: monthsWithAgents,
                  decimals: 0,
                  suffix: "+",
                  label: "Months in the loop",
                },
              ].map((tile) => (
                <div key={tile.label} className="border-t border-line pt-3">
                  <div className="text-2xl font-bold tracking-tight md:text-3xl">
                    <NumberTicker
                      value={tile.value}
                      suffix={tile.suffix}
                      decimals={tile.decimals}
                    />
                  </div>
                  <div className="mt-1 text-xs text-dim">{tile.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-dim">
              Claude Code and Codex, measured to {usage.generatedAt}. Spend
              withheld.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {aiTools.map((tool, i) => {
            const stat = usage.tools[i];
            const showStats = stat && stat.key === toolKeys[i];
            return (
              <Reveal key={tool.name} delay={0.1 + i * 0.05}>
                <div className="h-full border border-line p-5 transition-colors duration-300 hover:border-ink/50">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-lg font-bold tracking-tight">
                      {tool.name}
                    </h3>
                    <span className="text-xs text-dim">{tool.role}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-dim">
                    {tool.description}
                  </p>
                  <p className="mt-4 border-t border-line pt-3 text-xs text-dim">
                    {showStats
                      ? `${stat.sessions} sessions · ${formatTokens(stat.tokens)} tokens · ${stat.models} models`
                      : "Cloud-side usage, numbers not shown"}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex items-baseline justify-between border-t border-line pt-3">
            <h3 className="text-sm font-semibold">
              Principles from my CLAUDE.md
            </h3>
            <span className="text-xs text-dim">How I keep the bar high</span>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {aiPrinciples.map((principle, i) => (
            <Reveal key={principle.title} delay={0.1 + (i % 2) * 0.05}>
              <div className="flex gap-4">
                <span className="text-sm text-dim tabular-nums">
                  0{i + 1}
                </span>
                <div>
                  <h4 className="text-[15px] font-semibold">
                    {principle.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-dim">
                    {principle.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="work" className="pb-6">
        <SectionRule title="Selected work" meta="(4 projects)" />
        {projects.map((project, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              key={project.name}
              className={`grid gap-8 py-12 md:grid-cols-12 md:gap-10 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <Reveal
                delay={0.1}
                className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}
              >
                <div className="text-sm text-dim tabular-nums">
                  0{i + 1} / {project.label}
                </div>
                <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-1 text-dim">{project.tagline}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-dim">
                  {project.description}
                </p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed marker:text-dim">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-dim">
                  {project.tech.join(", ")}
                </p>
                <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  {project.live ? (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue underline underline-offset-4 hover:no-underline"
                    >
                      Visit site &#8599;
                    </a>
                  ) : null}
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue underline underline-offset-4 hover:no-underline"
                    >
                      View code &#8599;
                    </a>
                  ) : null}
                  {project.wechat ? (
                    <span className="text-dim">{project.wechat}</span>
                  ) : null}
                </p>
              </Reveal>
              <Reveal className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="border border-line-strong transition-colors duration-300 hover:border-ink/60"
                >
                  <Image
                    src={screenshots[project.image]}
                    alt={`${project.name} interface screenshot`}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 620px, 100vw"
                    placeholder="blur"
                  />
                </motion.div>
                <div className="mt-2 flex justify-between text-xs text-dim">
                  <span>{project.name} / production interface</span>
                  <span className="tabular-nums">Fig. 0{i + 1}</span>
                </div>
              </Reveal>
            </article>
          );
        })}
      </section>

      <section id="experience" className="pb-16">
        <SectionRule title="Work I'm proud of" meta="2020 to present" />
        <div className="mt-10">
          {featuredRoles.map((role, i) => (
            <ExperienceRow
              key={`${role.company}-${role.period}`}
              role={role}
              index={i}
              isLast={i === featuredRoles.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="pb-16">
        <SectionRule title="Skills" />
        <Reveal delay={0.1}>
          <dl className="mt-8">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="grid border-t border-line py-3 last:border-b md:grid-cols-[10rem_1fr]"
              >
                <dt className="text-sm text-dim">{group.title}</dt>
                <dd className="text-sm">{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="pb-16">
        <SectionRule title="Education" />
        <Reveal delay={0.1}>
          <dl className="mt-8">
            {degrees.map((degree) => (
              <div
                key={degree.degree}
                className="grid border-t border-line py-3 last:border-b md:grid-cols-[minmax(10rem,16rem)_1fr]"
              >
                <dt className="text-sm text-dim">{degree.school}</dt>
                <dd className="text-sm">{degree.degree}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section id="github" className="pb-16">
        <SectionRule title="GitHub activity" meta="@lewiswang0516" />
        <Reveal delay={0.1}>
          <div className="mt-8 border border-line-strong p-4 transition-colors duration-300 hover:border-ink/60 md:p-6">
            <Image
              src="/assets/github-snake.svg"
              alt="Animated snake eating my GitHub contribution graph"
              width={880}
              height={192}
              unoptimized
              className="h-auto w-full"
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-dim">
            <span>Contribution snake / regenerated every 6 hours</span>
            <span className="tabular-nums">Fig. 05</span>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.15}>
            <Image
              src="/assets/github-stats/tokyonight/3-stats.svg"
              alt="GitHub stats: stars, commits, pull requests, issues and contributed repositories"
              width={340}
              height={200}
              unoptimized
              className="h-auto w-full"
            />
          </Reveal>
          <Reveal delay={0.2}>
            <Image
              src="/assets/github-stats/tokyonight/4-productive-time.svg"
              alt="Commit distribution across the hours of the day"
              width={340}
              height={200}
              unoptimized
              className="h-auto w-full"
            />
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-sm">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="text-blue underline underline-offset-4 hover:no-underline"
            >
              Follow me on GitHub &#8599;
            </a>
          </p>
        </Reveal>
      </section>

      <section id="contact" className="pb-20">
        <SectionRule title="Contact" meta={profile.availability} />
        <Reveal delay={0.1}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-10 block text-[clamp(1.6rem,4.6vw,3.6rem)] font-bold tracking-tight break-all underline decoration-2 underline-offset-8 transition-colors hover:text-blue"
          >
            {profile.email}
          </a>
          <p className="mt-8 text-sm text-dim">
            <a
              href={profile.phoneHref}
              className="underline-offset-4 hover:underline"
            >
              {profile.phone}
            </a>
            {" / "}
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            {" / "}
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
            {" / "}
            <a
              href={profile.instagram}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              Instagram
            </a>
            {" / "}
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              Resume PDF
            </a>
            {" / "}
            {profile.location}
          </p>
        </Reveal>
      </section>

      <footer className="flex flex-wrap justify-between gap-2 border-t-2 border-ink py-6 text-xs text-dim">
        <span>&copy; 2026 Zane Wang</span>
        <a
          href="#top"
          onClick={(e) => goTo(e, "#top")}
          className="underline-offset-4 hover:underline"
        >
          Top &#8593;
        </a>
      </footer>
    </div>
  );
}
