# Conventions

Every slice is checked against these rules. If a rule gets in the way, raise it in the spec's open questions instead of breaking it quietly.

## General
- **Reuse first.** Before writing anything new, look for an existing component, `sh-*` class, token, data shape or script helper that does the job, and use or extend it. A new one is added only when nothing fits, and the reason goes in the slice report.
- **Best practices of the stack.** Follow current Astro, TypeScript and CSS best practices (static rendering, typed props, semantic HTML, accessibility, performance); the sections below are the project's specific form of them.
- **Ask when unsure.** If a requirement is unclear, two approaches are equally valid, or a rule here gets in the way, ask the user instead of guessing.

## Stack (don't add libraries without asking)
Astro 7 · TypeScript (strict, `astro/tsconfigs/strict`) · `@astrojs/check` · plain CSS with the Still Hours tokens · the Still Hours motion runtime (`src/scripts/still-hours.js`) · Playwright (UI check only, spec 001). No UI framework (React, Vue, Svelte), no CSS framework, no client-side libraries without asking. Astro integrations (e.g. `@astrojs/sitemap`) count as libraries.

## Files and folders

| What | Where | Inside |
| --- | --- | --- |
| Page | `src/pages/<route>.astro`, dynamic: `src/pages/<segment>/[slug].astro` | `BaseLayout` with `title` + `description`; static routes via `getStaticPaths` |
| Component | `src/components/PascalCase.astro` | `interface Props` in the frontmatter |
| Layout | `src/layouts/BaseLayout.astro` | `<head>`, theme restore, header + footer |
| Content and settings | `src/data/site.ts`; a new topic in `src/data/<topic>.ts` (kebab-case) | `export const` data + `export interface` / `type` next to it |
| Client behaviour | `src/scripts/site.ts`; a bigger feature in `src/scripts/<feature>.ts` imported by it | functions wired on `astro:page-load` |
| Tokens | `src/styles/tokens.css` | Night (default) and Day for every token |
| Design system | `src/styles/components.css` | `sh-*` classes; change only to extend the system |
| Site additions | `src/styles/site.css` | `sh-*` classes for site-only pieces |
| Images | `public/images/kebab-case.jpg` | placeholders until a client's photos arrive |
| UI check | `e2e/`, `playwright.config.ts` | spec 001 |

- Components are `PascalCase.astro` (Astro's convention); data, scripts and image files are `kebab-case`.
- Identifiers: types and interfaces `PascalCase`; variables and functions `camelCase`. Data exports follow the existing `site.ts` style (`site`, `nav`, `days`, `plans`).
- Import with relative paths, as the existing code does.

## TypeScript
- No `any`. Use `unknown` and narrow; parse URL params and `localStorage` values defensively (unknown values are ignored, never thrown).
- `import type` for type-only imports. No `enum`: use `as const` arrays or string unions (`type Category = 'weddings' | …`).
- Data shapes are interfaces in the same `src/data/` file as the data; components take those types as props instead of redeclaring them.
- State as unions, not boolean flags, when there are more than two states. Exhaustive `switch` ends with a `never` check.
- No `as` casts without a comment saying why (DOM queries use `querySelector<HTMLElement>` generics instead).

## Astro and scripts
- Everything is static. No SSR adapter, no `output: 'server'`.
- Scripts run once per full load; the `ClientRouter` swaps `<main>`. Wire page content in an `initX()` called from the `astro:page-load` listener in `site.ts`; wire persistent elements (header, drawer, dialogs outside `<main>`) once at module level.
- After a swap, call `runtime.init(document)` so `data-*` motion attributes work on new content (already done in `site.ts`).
- The page reads fully and the enquiry form submits without JS. Script-only controls render hidden or disabled until the script enables them, or are progressive enhancements of a link or form.
- State that crosses pages goes in the URL (`/contact/?plan=whole-day&date=2027-06-12`). `localStorage` only for per-visitor conveniences (theme, favourites in the demo gallery), every read and write in `try/catch`.
- Native elements first: `<dialog>` for modals, `<details>` for disclosures, `<form>` and inputs with real validation attributes.

## Content and data
- Anything a client would change (names, contacts, prices, add-ons, FAQ, days, frames, cities, niche copy, video links) lives in `src/data/`, not in markup or scripts.
- Prices are stored as numbers (`9800`) with one currency (`site.currency`), formatted through one helper (spec 003) using `Intl.NumberFormat`. Until then the existing strings stay as they are.
- Copy is English, in the Still Hours voice: short, plain, honest, no hype, no emoji.
- Image `alt` text describes the photograph. Decorative images get `alt=""`.

## Demo features
- Features that only make sense in the pitch (niche switcher, mocked client gallery, fake availability data) are shown only when `site.demo` is `true`, and say in the UI that they are a demo ("Demo: in your site this connects to …").
- Turning `site.demo` off leaves a clean, real-client site: no dead links, no demo labels.

## SEO
- Every page passes `title` and `description` to `BaseLayout`; canonical and Open Graph come from it.
- Structured data is JSON-LD in a `<script type="application/ld+json">`, built from `src/data/`, one block per type per page.
- Slugs (cities, days) are stable once published.

## Styling
- Only `sh-*` classes and CSS custom properties from `tokens.css`. No raw colors, fonts or shadows in components or pages. New tokens go into `tokens.css` first, for Night and Day.
- Inline `style` only for one-off layout spacing (margins, max-width, gaps), as the existing pages do; anything repeated becomes a class in `site.css`.
- Mobile-first; the layout works at 375px with no horizontal scroll. Prices use `font-variant-numeric: tabular-nums`.
- Motion through the runtime's `data-*` attributes; new motion respects `prefers-reduced-motion`.

## Accessibility
- WCAG 2.1 AA contrast in both themes, visible focus (`--focus`), labels on all inputs (`<label for>`), help and errors linked with `aria-describedby`.
- Touch targets ≥ 44px; icon-only buttons have `aria-label`; galleries, sliders, dialogs and the calendar work with the keyboard.
- Form results and errors are announced (`role="status"` / `role="alert"`), live totals with `aria-live="polite"`.
- Dialogs trap focus (native `<dialog>` + `showModal()`), close on Escape, and return focus to the opener.

## States (every screen)
Empty (explanation + next action) · error (message + a way out, e.g. the email) · long values (wrap) · many items · missing image (placeholder) · Night and Day · reduced motion · no JS.
