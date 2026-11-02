# 006 — Client gallery (demo)

**Status:** draft · **Depends on:** 001 · **Route(s):** `/clients/`, `/clients/[gallery]/`

## Goal
A couple opens their private gallery with a code, hearts their favourites, and sends the selection for the album. It's a mock in the demo — no real storage — but it lets the photographer see that their site could replace the gallery service they pay for.

## Scope
- In: a sign-in screen (gallery code, demo code shown on screen), one demo gallery from data, favourites saved in the visitor's browser, a favourites filter and counter, "Send my selection" via the enquiry form or email, `noindex`, everything behind `site.demo`.
- Out: real authentication, uploads, downloads of originals, payment for prints, multiple real clients. In a real build this is a separate service (listed in setup).

## Data
`src/data/client-galleries.ts`: `{ slug, code, couple, date, place, frames: { id, src, alt }[] }`, one demo gallery reusing images from `public/images/`. Favourites in `localStorage['sh-fav-<slug>']`.

## Slices

### [ ] 1. Gate + gallery
- **Build:** `/clients/`: a short screen ("Your gallery") with a code field; in demo mode the code is shown ("Demo code: STILL-2026"); a correct code goes to `/clients/<slug>/`, a wrong one shows an inline error. The gallery page: couple, date, place, a full-width grid, a viewer dialog with keyboard and swipe. Both pages `noindex`, not in the nav (linked from the footer "Client galleries" when `site.demo`).
- **Files:** `src/pages/clients/index.astro`, `src/pages/clients/[gallery].astro`, `src/data/client-galleries.ts`, `src/scripts/client-gallery.ts`, `src/components/Footer.astro`, `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the demo label states plainly that this is not real protection
  - [ ] viewer: arrows, Escape, swipe; focus returns to the opened photo
  - [ ] both pages carry `noindex`; turning `site.demo` off removes the link
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 2. Favourites + send selection
- **Build:** a heart on every photo (grid and viewer), a counter, a "Favourites" filter, and "Send my selection" → `/contact/` with the selected file names in the message (or `mailto:`). Favourites survive a reload; storage errors fall back to in-memory.
- **Files:** `src/scripts/client-gallery.ts`, `src/pages/clients/[gallery].astro`, `src/components/ContactForm.astro`
- **Agent:** frontend → designer
- **Accept:**
  - [ ] hearts are toggle buttons with `aria-pressed` and a label ("Add to favourites: <alt>")
  - [ ] empty favourites filter shows a designed empty state
  - [ ] the sent message lists exactly the hearted photos

## External needs
For a real client: a gallery backend (e.g. Pixieset, Pic-Time, or a custom store) — decided per client, see [setup.md](../setup.md).

## Open questions
- Should the demo gallery be reachable from the main nav, or only from the footer and the pitch? Recommended: footer only, it isn't for the photographer's visitors.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
