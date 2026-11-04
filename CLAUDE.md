# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`photografer-portfolio` is **Robin Hale**, a fictional brand and commercial photographer in London. It is a **sales demo**: the site shows real photographers what kind of website can be built for them. The design system is still called Still Hours internally (the `sh-*` classes and `still-hours.js`). Every feature is judged by how clearly it shows its value to a photographer in a two-minute walkthrough, and every piece of content must be easy to swap for a real client's. Product and demo story: `docs/product.md`. Feature research: `docs/reference/`.

One static Astro site at the repo root (no backend, no database). Copy that repeats lives in `src/data/site.ts`; the design system is the `sh-*` classes in `src/styles/` plus the motion runtime `src/scripts/still-hours.js`.

## Talking to the user

Talk to the user in Ukrainian: all replies, reports, summaries and questions (in chat and in `AskUserQuestion`: question, options, descriptions). Code, commits, docs and the site's UI copy stay in English.

## Working rules

- **Opus thinks, Sonnet/Haiku execute.** Opus does the analysis, reasoning, planning, design decisions and review (the `designer` agent stays on Opus). Carrying out an accepted decision or plan runs on Sonnet, or Haiku for mechanical work. This holds in `/run-implement`, in `awos` flows and commands, and in any other task (see `docs/process.md` → Models and delegation).
- **Reuse existing styles and components** (`sh-*` classes, tokens, `src/components/`, `src/data/`, script helpers) before creating new ones.
- **Follow best practices of the stack** (Astro, TypeScript, plain CSS): static first, typed, semantic, accessible, fast.
- **Ask the user when something is unclear** or a decision is theirs; don't guess.

## Commands

Use npm.

```sh
npm install
npm run dev        # astro dev, http://localhost:4321
npm run build      # astro check (types) + astro build → dist/
npm run preview    # serve dist/
npm run ui-check   # Playwright UI check (after spec 001), see docs/process.md → step 8
```

`npm run build` is the verification gate: it type-checks (`astro check`) and builds. Agents never deploy, push, or touch remote accounts (hosting, form services, domains); that is the user's job.

## Architecture notes

- **Static first.** Everything is prerendered. Interactivity is small TypeScript in `src/scripts/site.ts` (or a module it imports), wired on `astro:page-load` because the `ClientRouter` swaps pages without a reload. The header and drawer persist across navigations; anything inside `<main>` is wired again on every page load.
- **Content is data.** Names, contacts, prices, projects, frames, areas and niche copy live in `src/data/`. Components take props; pages compose components. Swapping a client means editing data and images, not components.
- **Demo-only features** (mocked client gallery, fake availability) sit behind `site.demo` and say plainly in the UI that they are a demo.
- **Works without JavaScript.** Every page is readable and the enquiry form submits without JS; scripts add to it.
- External services (form endpoint, WhatsApp, video hosts) are links or optional env vars with a working fallback when empty (the form falls back to `mailto:`).

## Specs and process

All process documents live in `docs/`:

- `docs/product.md`: what the demo is, who it's for, the demo story, pages, design principles, technical frame.
- `docs/roadmap.md`: status of every spec and the build plan (waves, order). The single source of truth for what's next.
- `docs/process.md`: statuses, what a slice is, models and delegation, the loop, Definition of Done.
- `docs/conventions.md`: the rules every slice is checked against.
- `docs/setup.md`: what to change when the demo becomes a real client's site, and what to connect.
- `docs/specs/`: one spec per task, split into slices (`_template.md` for new ones).

`/run-implement` (short: `/run-impl`) runs one step of the loop in `docs/process.md`. Key rules: before any code the agent reads the main docs, pins down the spec's purpose and aims, and asks all questions for the whole spec once, up front (a `draft` spec is moved to `ready` in that same round, after the user approves); then its slices run one after another without stopping (each verified and committed on the spec's branch, which is created from the previous spec's branch, not from `main`) and are reported once at the end; Opus orchestrates, subagents implement (`designer` for pages, layout and visuals, `frontend` for scripts, data and SEO), Haiku takes mechanical work; the user merges branches into `main` (PRs).
