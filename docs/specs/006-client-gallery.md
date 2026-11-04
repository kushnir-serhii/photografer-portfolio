# 006 — Client gallery (demo)

**Status:** in-progress · **Depends on:** 001 · **Route(s):** `/clients/`, `/clients/[gallery]/`

## Goal
A client opens their private gallery with a code, picks the selects for a shoot, and sends the selection back for retouching. It's a mock in the demo — no real storage — but it lets the photographer see that their site could replace the gallery service they pay for.

## Scope
- In: a sign-in screen (gallery code, demo code shown on screen), one demo gallery from data, selects saved in the visitor's browser, a selects filter and counter, "Send my selection" via the brief form or email, `noindex`, everything behind `site.demo`.
- Out: real authentication, uploads, downloads of originals, payment for prints, multiple real clients. In a real build this is a separate service (listed in setup).

## Data
`src/data/client-galleries.ts`: `{ slug, code, client, title, date, place, included, frames: { id, src, alt }[] }` plus the gallery copy. One demo gallery: a fictional agency's content day ("Harbour & Co — content day", October 2026), about 14 frames reusing the non-area images in `src/assets/work/` (mixed brands read naturally for an agency). Each frame `id` is a camera-style file name (`RH_0412`); that name is what the selection message lists. `included` is the number of retouched frames in the package (10). Selects in `localStorage['sh-fav-<slug>']` (the key keeps the design system's prefix).

## Slices

### [x] 1. Gate + gallery
- **Build:** `/clients/`: a short screen ("Your gallery") with a code field; in demo mode the code is shown ("Demo code: HALE-2027"); a correct code goes to `/clients/<slug>/`, a wrong one shows an inline error. The code check is case-insensitive and trims spaces; without JS the screen says the gallery needs JavaScript and gives the email. The gallery page opens from its URL without a code (the demo label says so). The gallery page: client, shoot date, place, a full-width grid with the file name on each frame, a viewer dialog (new native `<dialog>`, not reused on `/work/`) with arrows, Escape and swipe. Both pages `noindex` and left out of the sitemap, not in the nav. Footer "Client galleries": `/clients/` when `site.demo`; otherwise `site.clientGalleries` (the client's gallery service URL) when set, hidden when empty. With `site.demo` off, no gallery pages are built and `/clients/` redirects to `site.clientGalleries` (or `/` when empty).
- **Files:** `src/pages/clients/index.astro`, `src/pages/clients/[gallery].astro`, `src/data/client-galleries.ts`, `src/data/site.ts`, `src/scripts/client-gallery.ts`, `src/scripts/site.ts`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `src/styles/site.css`, `astro.config.mjs`, `e2e/ui-check.spec.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [x] the demo label states plainly that this is not real protection
  - [x] viewer: arrows, Escape, swipe; focus returns to the opened photo
  - [x] both pages carry `noindex`; turning `site.demo` off removes the link
  - [x] 375px without horizontal scroll, Night and Day

### [ ] 2. Selects + send selection
- **Build:** a select mark on every photo (grid and viewer), a counter against the soft limit ("7 of 10 included"; above it a calm note that the extra frames are quoted separately; selecting more stays possible), a "Selects" filter, and "Send my selection" → `/contact/?gallery=<slug>&selects=RH_0412,…` with the brief textarea prefilled (client, shoot, the file names; ids checked against the gallery, unknown ones ignored), plus a secondary "or email them" `mailto:` link with the same text. Selects survive a reload; storage errors fall back to in-memory.
- **Files:** `src/scripts/client-gallery.ts`, `src/scripts/booking.ts`, `src/pages/clients/[gallery].astro`, `src/components/ContactForm.astro`, `src/data/client-galleries.ts`, `src/styles/site.css`
- **Agent:** frontend → designer
- **Accept:**
  - [ ] select marks are toggle buttons with `aria-pressed` and a label ("Add to selects: <alt>")
  - [ ] empty selects filter shows a designed empty state
  - [ ] the sent message lists exactly the selected photos

## External needs
For a real client: a gallery backend (e.g. Pixieset, Pic-Time, or a custom store) — decided per client, see [setup.md](../setup.md).

## Open questions
- Should the demo gallery be reachable from the main nav, or only from the footer and the pitch? **Decided:** footer only.
- Slice 1 notes: focus returns to the photo last shown in the viewer (not the first one opened). With `site.demo` off, `/clients/` is Astro's static redirect page (a short "Redirecting…" before it goes); a server redirect would need the host's config. A shared `.sh-demo-note` class was added; the calendar's demo note could move to it later.
- **Decided (2026-11-04):** demo gallery content = existing images as an agency content day; footer link and `site.demo` off as in slice 1; soft limit from data; send via `/contact/` prefill plus `mailto:`; the code gate needs JS (no-JS note with the email); spec moved to `ready`.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
| 2026-11-04 | 1 | done: `/clients/` code screen, `/clients/harbour-content-day/` grid + viewer, footer link, noindex, sitemap filter | client-galleries.ts, clients/index.astro, clients/[gallery].astro, client-gallery.ts, site.ts (script + data), Footer, BaseLayout, site.css, astro.config.mjs, ui-check.spec.ts, setup.md |
