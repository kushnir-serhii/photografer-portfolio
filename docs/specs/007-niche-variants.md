# 007 — Niche variants

**Status:** draft · **Depends on:** 002, 003, 004 · **Route(s):** `/`, `/rates/`, `/work/` and their variants (route shape to decide)

## Goal
The same site, re-dressed for a different kind of photographer — wedding (today), newborn & family, events — with its own copy, packages, photos and palette, switched from a small demo bar. In the pitch: *"it would fit my business, not someone else's."*

## Scope
- In: one content shape per niche in `src/data/niches/`; the current wedding content moved into it unchanged; a newborn & family variant (softer, Day-first palette); an events variant (corporate, birthdays, ceremonies); a demo switcher bar shown only when `site.demo`.
- Out: a CMS, per-niche city pages beyond what 004 already generates, more than three niches.

## Data
`src/data/niches/<id>.ts` (`wedding`, `newborn`, `events`), each exporting the same `Niche` interface: hero, intro, days, frames, categories, plans, add-ons, FAQ, testimonial, marquee items, theme (`night` | `day` default + optional accent override token values). `src/data/niches/index.ts` lists them. Pages read the active niche.

## Slices

### [ ] 1. Content into the niche shape
- **Build:** define `Niche`, move every niche-specific value from `site.ts` and the pages into `niches/wedding.ts`; pages render from it. Nothing looks different.
- **Files:** `src/data/niches/*`, `src/data/site.ts`, `src/pages/*.astro`
- **Agent:** frontend
- **Accept:**
  - [ ] UI check screenshots before / after are the same
  - [ ] no niche copy left in page markup

### [ ] 2. Newborn & family variant
- **Build:** `niches/newborn.ts` with its copy, packages (in-home session, studio session, first-year), FAQ and placeholder photos; a softer accent through token overrides, Day as default; the variant's pages under the chosen route shape.
- **Files:** `src/data/niches/newborn.ts`, `src/styles/tokens.css`, routes per the decision, `public/images/newborn/*`
- **Agent:** designer
- **Accept:**
  - [ ] every page of the variant passes the UI check at 375 / 1280, Night and Day
  - [ ] contrast stays AA with the new accent in both themes

### [ ] 3. Events variant
- **Build:** `niches/events.ts`: corporate events, birthdays, ceremonies; hourly packages; same mechanics.
- **Files:** `src/data/niches/events.ts`, `public/images/events/*`
- **Agent:** designer · **Model:** sonnet
- **Accept:**
  - [ ] every page of the variant passes the UI check

### [ ] 4. Demo switcher
- **Build:** a slim bar (top or bottom) visible only with `site.demo`: "Demo — see this site for: Wedding · Newborn · Events", keeps the current page when switching, remembers the choice, can be dismissed.
- **Files:** `src/components/DemoBar.astro`, `src/layouts/BaseLayout.astro`, `src/scripts/site.ts`, `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] switching keeps the visitor on the equivalent page
  - [ ] the bar doesn't cover content or the quick-contact button at 375px
  - [ ] turning `site.demo` off removes it and leaves one clean niche

## External needs
Placeholder photography for newborn and events (licence-free or generated), as for the current images.

## Open questions
- Route shape: prefix routes (`/newborn/`, `/newborn/rates/`, …) generated from the same pages, or a separate build per niche (`NICHE=newborn npm run build`, deployed to subdomains)? Recommended: prefix routes in one build — one URL to share in the pitch, and the switcher is just links.
- Which niches besides wedding? Recommended: newborn & family and events (closest to the Bemazal research); others later.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
