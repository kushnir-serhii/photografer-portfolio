# Development process

How work moves from a spec to code. What to build and in which order lives in [roadmap.md](roadmap.md); the rules the code is checked against live in [conventions.md](conventions.md).

Every task gets one spec file in [specs/](specs/). Every spec is split into **slices**. A slice is the unit of work, review and commit.

## Statuses

**Spec:** `draft` → `ready` → `in-progress` → `done`

- `draft`: still being shaped. Not built.
- `ready`: you have approved the scope and slices. It can be built.
- `in-progress`: at least one slice is done.
- `done`: every slice is done and the Definition of Done holds.

**Slices and acceptance criteria:** `[ ]` not done · `[x]` done. A slice is `[x]` only when every one of its criteria is `[x]`. To drop a slice, delete it and say why in the log.

## What a slice is

- A vertical increment you can see or check. Not a layer ("all data", then "all UI").
- It leaves the site building and type-checking green (`npm run build`).
- It can be reviewed in about 15 minutes and is about one commit.
- It has its own acceptance criteria that can be verified.
- It may name a model or agent (`**Model:** haiku`, `**Agent:** frontend`); see **Models and delegation**.

## Models and delegation

- The main session (Opus) orchestrates: it picks and plans slices, delegates the implementation to subagents, reviews their diffs against the spec and the conventions, runs the verification, and records the result. It doesn't write slice code itself unless a fix is trivial.
- **Opus thinks, Sonnet/Haiku execute.** Analysis, reasoning, planning, design decisions and review are Opus's work. Carrying out a decision or plan that is already accepted goes to Sonnet (Haiku for mechanical work). This holds for every way of working on the repo: `/run-implement`, flows and commands from the `awos` plugin, and one-off tasks.
- Implementation goes to subagents. Use the `designer` agent (Opus: it makes design decisions, and visual quality is what sells the demo) for slices that are mostly pages, sections, layout and visuals; the `frontend` agent (Sonnet) for scripts, data shapes, routes, SEO and tooling. When a visual slice is fully decided (exact layout, classes and copy already settled), it can run as `designer` on Sonnet via the slice's `**Model:**` line.
- The simplest mechanical work goes to **Haiku**: moving or renaming files, copy changes, moving hardcoded values into `src/data/`.
- A slice's `**Model:**` / `**Agent:**` line overrides this choice.
- Subagents can run in parallel when their slices are independent: their dependencies are `done` and they don't touch the same files. Each parallel agent works in its own worktree (`isolation: "worktree"`). Their results are verified and reported together.

## Safety rules (every agent)

- Never deploy, push, or touch remote accounts (hosting, domains, form services, video hosts, analytics). The user connects and deploys.
- Never commit `.env*` (except `.env.example`). A new env var goes into `.env.example` with a comment.
- Never send real data to an external service from a test or a script; the UI check runs against the local preview only.
- Anything a real client would have to provide or connect (numbers, accounts, keys, photos) also goes into [setup.md](setup.md).

## The loop (`/run-implement`, `/run-impl`)

Arguments: none (next slice from the plan) · `002` (next open slice of that spec) · `002 slice 3` (exactly that slice) · `parallel` (also the other independent specs of the current wave).

1. **Pick.** Read [roadmap.md](roadmap.md). Walk the **Plan** top to bottom and take the first spec that isn't `done` (or the one from the arguments), then its first `[ ]` slice. Stop without writing code, and say why, if:
   - a dependency in **Status** isn't `done`: name it;
   - every spec in the plan is `done`.

   A `draft` spec doesn't stop the loop: it goes through step 2, which ends by moving it to `ready`.
2. **Ask up front (once per spec).** The first time a spec is taken up, before its first slice is delegated:
   - **Read the frame.** Read [product.md](product.md), [roadmap.md](roadmap.md), [conventions.md](conventions.md), the whole spec, the specs it depends on, the relevant part of [reference/](reference/), and the code it touches.
   - **Pin down purpose and aims.** State in a few lines what the spec is for: which step of the demo story it serves, what a visitor and a photographer see when it's done, why it matters, how it fits the plan. Check the spec's **Goal**, **Scope** and slices against that and against [product.md](product.md); a gap or conflict becomes a question.
   - **Collect every question for the whole spec**, for **all** remaining slices: scope, slice split and order, unclear criteria, open questions, choices between options, copy, edge cases, what needs a client decision. Ask them all in one batch, grouped by slice, each with a recommended answer. The goal: you are interrupted once at the start, not slice by slice.
   - **Write the answers into the spec** (**Goal**, **Scope**, slices and criteria, or **Decided:** under Open questions) before any code.
   - **Move a `draft` to `ready`.** If the spec is `draft`, the same batch ends by asking whether it can move to `ready` (with the changes shown). On yes, set `ready` in the spec header and in [roadmap.md](roadmap.md) and go on; on no, stop and report what's left.
   - In `parallel` mode, do this for every spec of the batch at once.
   - A question that only shows up during the work is still asked: collect them and bring them with the report; stop early only when the slice can't go on without the answer.
3. **Plan.** Re-read the spec, [conventions.md](conventions.md) and the files the slice touches. If something step 2 missed is unclear or conflicts with the code, stop and ask. Don't guess. Choose the model and agent.
4. **Delegate.** Start a subagent with a self-contained prompt:
   - the spec path, the slice number and its full text (Build, Files, Accept), plus facts from the plan it would otherwise rediscover;
   - follow `docs/conventions.md` and `CLAUDE.md`; change only what this slice needs, and report anything else as an open question;
   - don't commit, create branches, or touch the spec's checkboxes and log; follow the safety rules;
   - run `npm run build` and fix failures; report the files changed, how each criterion was met, and open questions.
5. **Verify.** Don't trust the report. Read the diff and check it against every criterion and the conventions. From the repo root:
   ```sh
   npm run build
   ```
   For UI slices also check 375px width, both themes (Night, Day), reduced motion, and every state in the slice; check that the page still reads and the form still submits with JS off where the slice touches them. Send problems back to the agent with specifics; after two rounds, report what still fails.
6. **Record.** In the spec: mark the criteria and the slice `[x]`, add one **Log** row (date, slice, result, files touched), add new **Open questions** and **External needs**. Update the status in the spec header and in [roadmap.md](roadmap.md).
7. **Commit and go on.** Work on a branch per spec (`spec/<NNN>-<slug>`). Create it from the **previous spec's branch** (the last spec built), not from `main`, so it already has the work that isn't merged yet; only the first spec branches from `main`. In `parallel` mode every spec of the batch branches from that same previous branch. Commit the slice (`feat: <spec #> slice <n> — <summary>`) and start the next `[ ]` slice at step 3, without stopping.
8. **UI check (end of spec, Playwright; after spec 001).** After the last slice of a spec that changes UI:
   ```sh
   SPEC=<spec #> ROUTES=<route>,<route> npm run ui-check
   ```
   (PowerShell: `$env:SPEC='002'; $env:ROUTES='root,contact'; npm run ui-check`.) Routes go without the leading or trailing slash (`rates,cities/wroclaw`; `root` is `/`). Every route is opened at 375px and 1280px, in Night and Day. It fails on console or page errors and on horizontal scroll, and saves full-page screenshots to `e2e/screenshots/<spec #>/` (git-ignored). Look at every screenshot against the spec and [conventions.md](conventions.md). Fix what's wrong like a slice (commit `fix: <spec #> — <summary>`), then run it again.
9. **Report once, when the spec is done** (or blocked): what was built per slice, the commits, open questions, external needs (client data, accounts), what to look at (and where it fits in the demo story), and what comes next. You merge the branch (PR) into `main`.

Scope changes go into the spec first, then into the code.

## Other commands you can give

- `spec <topic>`: draft a new spec from the template for review. No code.
- `questions <spec #>`: step 2 on its own. No code.
- `status`: summarize [roadmap.md](roadmap.md) and the open slices.

## Definition of Done (every spec)

- All slices `[x]`.
- `npm run build` is green (type check + build).
- UI specs: the Playwright UI check passes for the spec's routes, and its screenshots were reviewed.
- Follows [conventions.md](conventions.md).
- Every UI state is designed: empty, error with a way out, long values, many items, missing image; Night and Day; reduced motion.
- WCAG 2.1 AA: labels, visible focus, contrast, 44px touch targets, keyboard use.
- Works without JS where it can (content readable, form submits); demo-only parts sit behind `site.demo`.
- New client-facing content lives in `src/data/`, and whatever a real client must provide is listed under **External needs** and in [setup.md](setup.md).
