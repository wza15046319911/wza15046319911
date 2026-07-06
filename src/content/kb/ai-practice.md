# How I work with AI

I am a heavy, deliberate user of agentic coding tools, not as an autocomplete toy but as a disciplined part of how I deliver software. Across Claude Code and Codex I have run more than 1,100 coding sessions and about 3.3 billion tokens, working with 16 different models, from Claude Opus 4.8, Sonnet 5 and Haiku 4.5 to the GPT-5 Codex line. I have been building with these agents since 2025.

Claude Code is my primary agentic pair for end-to-end feature work, refactors and debugging, where multi-file edits, skills and test loops run. Codex I run alongside as an independent second agent to cross-check changes and explore alternative approaches. Cursor I use for fast inline edits when the change is small and I want to stay in the file.

The way I use AI is governed by my personal CLAUDE.md. The core rules: deterministic decisions such as routing, retry policy, thresholds and escalation rules live in explicit code, and the model only classifies, summarizes, drafts and resolves ambiguity, never deciding facts that have a right answer. Errors are always thrown, returned or reported, never swallowed behind default values. Every iteration loop has a defined budget in iterations, tokens or time. I search for an existing open-source solution before building one, write the minimum code needed, and keep tests focused on real behaviour rather than "runs without throwing".

This portfolio's chat is itself an example of that discipline: a grounded RAG service where high-risk facts come from retrieval, not from the model, with an answerability gate that refuses to answer when evidence is missing.

[[ASK ZANE: a concrete example of AI speeding you up without lowering the bar, and where you draw the line on trusting a model]].
