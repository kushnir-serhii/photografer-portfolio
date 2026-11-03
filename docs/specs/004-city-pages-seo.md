# 004 — Area pages + SEO

**Status:** ready · **Depends on:** 001, 008 · **Route(s):** `/brand-photographer/[slug]/`, `/rates/`, `/studio/`, every page (`<head>`)

## Goal
A marketing manager searching "brand photographer Shoreditch" lands on a page made for Shoreditch, and Google shows the studio's FAQ and details as rich results. In the demo: *"people searching in my area find me"* — shown with a Rich Results preview and the area pages.

## Scope
- In: JSON-LD (`ProfessionalService` with `priceRange` and area served (per-package `Offer`s come in 003, when prices are numbers), `FAQPage` on `/rates/`, `BreadcrumbList` on area pages); an area data set and static area pages; `?area=` prefill of the brief and the WhatsApp text; a service-area section (schematic SVG map from data + list) linking to them; sitemap (`@astrojs/sitemap`) and `robots.txt`.
- Out: blog, reviews schema (no real reviews), multilingual pages, a real map tile service.

## Data
- `src/data/site.ts`: `faq` (already data), business details for schema (city, region, country, price range).
- `src/data/areas.ts`: `{ slug, name, region, intro, travel: string, venues?: string[], faq?: FaqItem[], image, alt }` plus map coordinates for slice 3; demo set: London areas (Shoreditch, Soho, King's Cross, Hackney, Peckham) and UK cities (Manchester, Bristol, Edinburgh), plus "Cotswolds" as a destination example. Each area gets its own new Unsplash placeholder photo (street or city, in `src/assets/work/`, listed in `setup.md`).
- Projects (`projects` in `site.ts`) link to an area by slug where they match (`areaSlug?`): Marlow & Finch → Shoreditch, Northline → King's Cross, Saltroom → Peckham, Fold Coffee (Hackney Wick) → Hackney.
- URL param on `/contact/`: `area` (an area slug). Unknown values are ignored.

## Slices

### [ ] 1. Structured data
- **Build:** a `JsonLd.astro` helper (the FAQ is already in `site.ts`); business JSON-LD in `BaseLayout` from `site.ts`; `FAQPage` on `/rates/`.
- **Files:** `src/components/JsonLd.astro`, `src/layouts/BaseLayout.astro`, `src/pages/rates.astro`, `src/data/site.ts`
- **Agent:** frontend
- **Accept:**
  - [ ] the JSON-LD on `/` and `/rates/` parses and uses valid schema.org types (checked with the Rich Results / Schema validator by hand, noted in the log)
  - [ ] one block per type per page; nothing duplicated across client-side navigations

### [ ] 2. Area pages
- **Build:** `src/pages/brand-photographer/[slug].astro` with `getStaticPaths` from `areas.ts`: hero image, H1 ("Brand photographer in Shoreditch"), local intro, projects shot there (from `projects`), travel note and price hint, local FAQ (+ `FAQPage`, only when the area has one), CTA to the form (`/contact/?area=<slug>`: an empty brief field starts with "Shoot in Shoreditch: ", and the quick-contact WhatsApp text names the area) and to the quick contact, breadcrumbs (+ `BreadcrumbList`), own title, description and canonical.
- **Files:** `src/pages/brand-photographer/[slug].astro`, `src/data/areas.ts`, `src/data/site.ts`, components it needs
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every area builds to its own static page with a unique title, description and canonical
  - [ ] an area with no projects shows a designed empty state: a short line ("No project from Soho on the site yet") and 2–3 recent projects from elsewhere, plus the CTA
  - [ ] `?area=` fills an empty brief and the WhatsApp text; an unknown area is ignored; without JS the CTA still opens the form
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 3. Service area + sitemap
- **Build:** a "Where we work" section (on `/studio/` and as a footer list) linking to every area page; a schematic, stylised SVG map built from area coordinates in data (no map service, no tiles) with the grouped list (London areas, UK cities, Destinations) under it; `@astrojs/sitemap` and a `robots.txt` endpoint that takes the domain from `site`.
- **Files:** `src/components/ServiceArea.astro`, `src/pages/studio.astro`, `src/components/Footer.astro`, `astro.config.mjs`, `package.json`, `src/pages/robots.txt.ts`, `src/data/areas.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every area page is linked from the service-area section and the footer
  - [ ] the map reads at 375px and 1280px in Night and Day; every point is a labelled link; the list carries the same links for keyboard and screen readers
  - [ ] `sitemap.xml` lists every page including area pages, with absolute URLs from `site`

## External needs
- The client's real areas and cities, travel terms and local venues.
- Submit the sitemap in Google Search Console after launch ([setup.md](../setup.md)).

## Open questions
- **Decided (2026-11-03):** route `/brand-photographer/<slug>/` (keyword in the path; 007 may change the segment).
- **Decided (2026-11-03):** sitemap via `@astrojs/sitemap` (new dependency, approved); `robots.txt` as an endpoint built from `site`.
- **Decided (2026-11-03):** business JSON-LD carries `priceRange` only; per-package `Offer`s wait for numeric prices in 003.
- **Decided (2026-11-03):** every area gets a new Unsplash placeholder photo; areas with no projects show a line plus recent work from elsewhere.
- **Decided (2026-11-03):** the service area is a schematic SVG map from data plus a grouped list.
- **Decided (2026-11-03):** the area CTA passes `?area=<slug>` to the brief form and the WhatsApp text.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
