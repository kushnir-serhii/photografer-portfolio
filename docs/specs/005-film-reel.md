# 005 — Film reel

**Status:** draft · **Depends on:** 001 · **Route(s):** `/`, `/work/`

## Goal
Video has its own place: a short reel on the home page and film entries in the work gallery, loading only when played so the site stays fast. In the demo: *"my stills and my video both have a place"* — many brand and commercial clients need film as well as stills.

## Scope
- In: a reel section on the home page (poster + play, click-to-load); film items in the `/work/` gallery (`film` category) that play in a dialog; video sources from data (self-hosted mp4 or a Vimeo/YouTube id).
- Out: video upload or hosting, autoplaying background video in the hero, live streaming.

## Data
`src/data/site.ts`: `films: { id, title, kind, place, poster, alt, source: { type: 'file'; src: string } | { type: 'vimeo' | 'youtube'; id: string } }[]`; `Frame` gets an optional `film` id.

## Slices

### [ ] 1. Home reel
- **Build:** `FilmReel.astro`: a 16:9 poster with title and a play button; on click it swaps in `<video controls>` (file) or the provider iframe (privacy-friendly `youtube-nocookie` / `dnt=1`), nothing loaded before. Placed on the home page between "Selected projects" and "What I shoot".
- **Files:** `src/components/FilmReel.astro`, `src/pages/index.astro`, `src/scripts/film.ts`, `src/scripts/site.ts`, `src/data/site.ts`, `src/assets/work/*` (poster)
- **Agent:** designer → frontend
- **Accept:**
  - [ ] no video or iframe request is made before play (checked in the network panel)
  - [ ] play button has an accessible name; works with the keyboard; captions slot if the file has a track
  - [ ] without JS the poster links to the video source
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 2. Film in the work gallery
- **Build:** film frames in `/work/` show a play badge; opening one plays it in a native `<dialog>` (focus trap, Escape, focus return); the `film` filter shows them.
- **Files:** `src/components/GalleryGrid.astro`, `src/scripts/film.ts`, `src/data/site.ts`, `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the video stops when the dialog closes
  - [ ] filters still work; the empty-filter state is unchanged

## External needs
A placeholder reel for the demo (licence-free) and, for a client, their film work as video files or Vimeo/YouTube links.

## Open questions
- Demo video source: a short licence-free stock clip self-hosted in `public/` (heavier repo, works offline) or a public Vimeo/YouTube video (light, depends on a third party)? Recommended: a public stock clip on Vimeo/YouTube for the demo, the component supports both.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
