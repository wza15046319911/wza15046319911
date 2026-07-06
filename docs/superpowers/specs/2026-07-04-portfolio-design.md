# Zane Wang Portfolio - Design Spec (2026-07-04)

## Revision 2026-07-05

The first version read as AI-generated (charcoal + chartreuse, mono uppercase labels, numbered sections, serif italic accent word, pill buttons, grain and glows).
Four alternative directions were built and compared; the final site merges the Swiss direction with the dark base.
Final design: Swiss typographic structure (thick and thin rules, tabular experience, dl rows, flat framed figures, disc lists, underlined links) on a warm near-black ground, ivory ink, blue `#5c7cff` as the only accent, Schibsted Grotesk as the only family.
Removed entirely: motion, lenis, lucide-react, marquee, grain, glows, dot grid, scroll reveals, magnetic buttons; the only animation is a one-shot CSS fade on load and hover states.
The four unused candidates are archived in `../zane-portfolio-candidates/`.
Everything below this line describes the superseded first version.

## Goal

A single-page personal portfolio for Zane Wang, Full Stack Developer, built from his resume.
It must feel modern and premium, feature three personal projects, and run on Next.js + TailwindCSS with popular open-source animation libraries.

## Aesthetic direction

Dark editorial dossier.
The page reads like a designed magazine feature about an engineer: warm charcoal background, ivory ink, one sharp chartreuse accent, hairline rules, mono annotations, oversized display type, film grain overlay.

- Base `#0E0E0C`, panel `#161613`, ink `#ECE9DF`, accent `#D7F53F`.
- Type: Bricolage Grotesque (display), Geist (body), Geist Mono (labels), Instrument Serif italic (accent words).
- Motion: Lenis smooth scroll, Motion (framer-motion v12) staggered hero entrance and scroll reveals, CSS marquee, magnetic CTAs.
- Reduced motion respected via MotionConfig `reducedMotion="user"` and CSS media queries.

## Structure

1. Fixed nav: name mark, section links (lenis scrollTo), Resume link, "Get in touch" CTA, full-screen mobile menu.
2. Hero: availability badge, three-line display headline with serif italic accent word, summary, CTAs, meta strip.
3. Stack marquee: technology ticker between hairlines.
4. Selected work (01): three alternating project features, each with mono index, tagline, description, highlights, tech chips, links, and a CSS-drawn app mock (no fake screenshots).
5. Experience (02): five roles as editorial rows with condensed highlights and tech lines.
6. About (03): summary, education, grouped skill chips.
7. Contact (04) + footer: large CTA, email with copy button, phone, GitHub, resume download.

## Content sources

- Resume PDF (copied to `public/Zane-Wang-Resume.pdf`).
- Project repos on disk: piggy-frontend (guinea pig e-commerce, BFF + Directus + Stripe), study-pilot (past-exam practice platform on Supabase), uq-course-qa (agentic RAG service, FastAPI + LangGraph + pgvector).
- All copy lives in `src/lib/data.ts` so it can be edited in one place.

## Tech decisions

- Next.js 16 App Router, React 19, Tailwind v4 tokens in `globals.css` `@theme`.
- `motion` (framer-motion v12), `lenis`, `lucide-react`: same families Zane already uses in his own repos.
- Server components by default; `"use client"` only for nav, hero, reveals, magnetic wrapper, contact copy button, lenis provider.
- No backend, no CMS, static single page.

## Assumptions to confirm

- GitHub profile: https://github.com/wza15046319911 (from study-pilot remote).
- Study Pilot repo link is included; Piggy Way is shown as a private production build (no public repo); UQ Ask Anything repo URL is unknown and left without a code link.
- Availability badge says "Open to opportunities" since the Broadsheet role ends Jun 2026.

## Success criteria

- `pnpm lint` and `pnpm build` pass clean.
- Renders correctly at 390px and 1440px with no horizontal scroll and no console errors.
- All resume facts reproduced without invention; no emoji, no em dashes in copy.
