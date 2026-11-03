# 007 — Niche variants

**Status:** draft · **Depends on:** 002, 003, 004 · **Route(s):** `/`, `/rates/`, `/work/` and their variants (route shape to decide)

## Goal
The same site, re-dressed for a different kind of photographer, with its own copy, packages, photos and palette, switched from a small demo bar. Brand & commercial is the base niche (today's site). Wedding is a possible variant; food and events can follow the same shape. In the pitch: *"it would fit my business, not someone else's."*

## Scope
- In: one content shape per niche in `src/data/niches/`; the current brand & commercial content moved into it unchanged; a wedding variant (softer, Day-first palette); an events variant (corporate launches, parties, private events); a demo switcher bar shown only when `site.demo`.
- Out: a CMS, per-niche area pages beyond what 004 already generates, more than three niches.

## Data
`src/data/niches/<id>.ts` (`brand`, `wedding`, `events`), each exporting the same `Niche` interface: hero, intro, projects, frames, categories, plans, add-ons, FAQ, testimonial, marquee items, theme (`night` | `day` default + optional accent override token values). `src/data/niches/index.ts` lists them. Pages read the active niche.

## Slices

### [ ] 1. Content into the niche shape
- **Build:** define `Niche`, move every niche-specific value from `site.ts` and the pages into `niches/brand.ts`; pages render from it. Nothing looks different.
- **Files:** `src/data/niches/*`, `src/data/site.ts`, `src/pages/*.astro`
- **Agent:** frontend
- **Accept:**
  - [ ] UI check screenshots before / after are the same
  - [ ] no niche copy left in page markup

### [ ] 2. Wedding variant
- **Build:** `niches/wedding.ts` with its copy, packages (e.g. whole day, ceremony only, engagement session), FAQ and placeholder photos; a softer accent through token overrides, Day as default; the variant's pages under the chosen route shape.
- **Files:** `src/data/niches/wedding.ts`, `src/styles/tokens.css`, routes per the decision, `src/assets/work/*`
- **Agent:** designer
- **Accept:**
  - [ ] every page of the variant passes the UI check at 375 / 1280, Night and Day
  - [ ] contrast stays AA with the new accent in both themes

### [ ] 3. Events variant
- **Build:** `niches/events.ts`: corporate launches and events, parties, private celebrations; hourly packages; same mechanics.
- **Files:** `src/data/niches/events.ts`, `src/assets/work/*`
- **Agent:** designer · **Model:** sonnet
- **Accept:**
  - [ ] every page of the variant passes the UI check

### [ ] 4. Demo switcher
- **Build:** a slim bar (top or bottom) visible only with `site.demo`: "Demo — see this site for: Brand · Wedding · Events", keeps the current page when switching, remembers the choice, can be dismissed.
- **Files:** `src/components/DemoBar.astro`, `src/layouts/BaseLayout.astro`, `src/scripts/site.ts`, `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] switching keeps the visitor on the equivalent page
  - [ ] the bar doesn't cover content or the quick-contact button at 375px
  - [ ] turning `site.demo` off removes it and leaves one clean niche

## External needs
Placeholder photography for the variants (licence-free or generated), as for the current images.

## Open questions
- Route shape: prefix routes (`/wedding/`, `/wedding/rates/`, …) generated from the same pages, or a separate build per niche (`NICHE=wedding npm run build`, deployed to subdomains)? Recommended: prefix routes in one build — one URL to share in the pitch, and the switcher is just links.
- Which niches besides brand? Recommended: wedding and events (food & hospitality can reuse the brand site's food sector copy and photos); others later.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
