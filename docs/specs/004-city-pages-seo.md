# 004 — Area pages + SEO

**Status:** draft · **Depends on:** 001 · **Route(s):** `/brand-photographer/[slug]/` (name to confirm), `/rates/`, `/studio/`, every page (`<head>`)

## Goal
A marketing manager searching "brand photographer Shoreditch" lands on a page made for Shoreditch, and Google shows the studio's FAQ and details as rich results. In the demo: *"people searching in my area find me"* — shown with a Rich Results preview and the area pages.

## Scope
- In: JSON-LD (`ProfessionalService` / `LocalBusiness` with prices and area served, `FAQPage` on `/rates/`, `BreadcrumbList` on area pages); FAQ moved into data; an area data set and static area pages; a service-area section linking to them; sitemap.
- Out: blog, reviews schema (no real reviews), multilingual pages, a real map tile service.

## Data
- `src/data/site.ts`: `faq` (moved from `rates.astro`), business details for schema (city, region, country, price range).
- `src/data/areas.ts`: `{ slug, name, region, intro, travel: string, venues?: string[], faq?: Faq[], image, alt }`; demo set: London areas (Shoreditch, Soho, King's Cross, Hackney, Peckham) and UK cities (Manchester, Bristol, Edinburgh), plus "Cotswolds" as a destination example.
- Projects (`projects` in `site.ts`) link to an area by slug where they match.

## Slices

### [ ] 1. Structured data
- **Build:** move the FAQ into data; a `JsonLd.astro` helper; business JSON-LD in `BaseLayout` from `site.ts`; `FAQPage` on `/rates/`.
- **Files:** `src/components/JsonLd.astro`, `src/layouts/BaseLayout.astro`, `src/pages/rates.astro`, `src/data/site.ts`
- **Agent:** frontend
- **Accept:**
  - [ ] the JSON-LD on `/` and `/rates/` parses and uses valid schema.org types (checked with the Rich Results / Schema validator by hand, noted in the log)
  - [ ] one block per type per page; nothing duplicated across client-side navigations

### [ ] 2. Area pages
- **Build:** `src/pages/brand-photographer/[slug].astro` with `getStaticPaths` from `areas.ts`: hero image, H1 ("Brand photographer in Shoreditch"), local intro, projects shot there (from `projects`), travel note and price hint, local FAQ (+ `FAQPage`), CTA to the quick contact / form with the area filled in the message, breadcrumbs (+ `BreadcrumbList`), own title, description and canonical.
- **Files:** `src/pages/brand-photographer/[slug].astro`, `src/data/areas.ts`, `src/data/site.ts`, components it needs
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every area builds to its own static page with a unique title, description and canonical
  - [ ] an area with no projects shows a designed empty state, not an empty section
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 3. Service area + sitemap
- **Build:** a "Where we work" section (on `/studio/` and as a footer list) linking to every area page; a simple stylised map or list (SVG from data, no map service); `sitemap.xml` and `robots.txt`.
- **Files:** `src/components/ServiceArea.astro`, `src/pages/studio.astro`, `src/components/Footer.astro`, `astro.config.mjs` or `src/pages/sitemap.xml.ts`, `public/robots.txt`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every area page is linked from the service-area section and the footer
  - [ ] `sitemap.xml` lists every page including area pages, with absolute URLs from `site`

## External needs
- The client's real areas and cities, travel terms and local venues.
- Submit the sitemap in Google Search Console after launch ([setup.md](../setup.md)).

## Open questions
- Route: `/brand-photographer/shoreditch/` (the keyword in the path, the segment can change per niche in 007), or a bare `/shoreditch/`? Recommended: `/brand-photographer/shoreditch/` — keyword-rich, still clean.
- Sitemap: add `@astrojs/sitemap` (new dependency) or a small hand-written `sitemap.xml.ts` endpoint? Recommended: `@astrojs/sitemap`, it's the standard and tiny.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
