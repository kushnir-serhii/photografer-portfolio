# 001 — Playwright UI check

**Status:** draft · **Depends on:** — · **Route(s):** all existing (`root`, `work`, `studio`, `rates`, `contact`, `privacy`, `404`)

## Goal
Every spec ends with an automatic check that each of its pages opens at phone and desktop width, in both themes, without console errors or horizontal scroll, and leaves screenshots to review. The demo is judged on a phone in a meeting, so layout breaks must be caught before the photographer sees them.

## Scope
- In: Playwright as a dev dependency (Chromium only), `playwright.config.ts` that builds and serves the site with `astro preview`, `e2e/ui-check.spec.ts` driven by `SPEC` and `ROUTES`, `npm run ui-check`, git-ignored outputs; a first run over the existing pages and fixes for what it finds.
- Out: functional end-to-end tests of forms and scripts (each spec may add its own later), visual-diff baselines, CI.

## Data
None. New files: `playwright.config.ts`, `e2e/ui-check.spec.ts`. `package.json` script `ui-check`. `.gitignore`: `e2e/screenshots/`, `test-results/`, `playwright-report/`.

- **Routes:** `ROUTES` is a comma list without slashes; `root` → `/`; `404` → a route that doesn't exist (e.g. `/this-page-does-not-exist/`, expecting the 404 page). Empty `ROUTES` → every route listed in the spec file's default list (all existing pages).
- **Matrix:** each route × width (375, 1280) × theme (`night`, `day`, set through `localStorage['sh-theme']` before load). Reduced motion emulated so `data-reveal` content is visible in screenshots.
- **Fails on:** `console.error`, `pageerror`, failed same-origin requests, `document.documentElement.scrollWidth > window.innerWidth`.
- **Screenshots:** full page, `e2e/screenshots/<SPEC or "all">/<route>-<width>-<theme>.png`.
- **Server:** Playwright `webServer` runs `npm run build && npm run preview -- --port 4321` and reuses a running server locally.

## Slices

### [ ] 1. Playwright + ui-check
- **Build:** add `@playwright/test` (dev) and Chromium, the config, the spec file as described in **Data**, the npm script and gitignore entries. Document the PowerShell form of the env vars in `docs/process.md` step 8 if it differs from what is written there.
- **Files:** `package.json`, `package-lock.json`, `playwright.config.ts`, `e2e/ui-check.spec.ts`, `.gitignore`
- **Agent:** frontend
- **Accept:**
  - [ ] `SPEC=001 ROUTES=root,contact npm run ui-check` runs 8 checks and writes 8 screenshots
  - [ ] a page with a forced `console.error` or a 2000px-wide element fails the check (tried locally, not committed)
  - [ ] screenshots and reports are git-ignored; `npm run build` still green

### [ ] 2. First run over the existing site
- **Build:** run the check over every existing route, review all screenshots, fix layout problems it finds (overflow, contrast, cut-off text, broken Day theme) within the existing design system.
- **Files:** whatever the fixes touch (`src/styles/*`, `src/components/*`, `src/pages/*`)
- **Agent:** designer
- **Accept:**
  - [ ] the full check passes for all routes at 375 and 1280, Night and Day
  - [ ] every screenshot reviewed; fixes listed in the log

## External needs
None.

## Open questions
- Chromium only, or also WebKit (iPhone Safari is what photographers will hold)? Recommended: Chromium now, WebKit as a later option because the download is large.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
