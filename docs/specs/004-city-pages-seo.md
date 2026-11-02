# 004 — City pages + SEO

**Status:** draft · **Depends on:** 001 · **Route(s):** `/cities/[slug]/` (name to confirm), `/rates/`, `/studio/`, every page (`<head>`)

## Goal
A couple searching "wedding photographer Wrocław" lands on a page made for Wrocław, and Google shows the studio's FAQ and details as rich results. In the demo: *"people searching in my city find me"* — shown with a Rich Results preview and the city pages.

## Scope
- In: JSON-LD (`ProfessionalService` / `LocalBusiness` with prices and area served, `FAQPage` on `/rates/`, `BreadcrumbList` on city pages); FAQ moved into data; a city data set and static city pages; a service-area section linking to them; sitemap.
- Out: blog, reviews schema (no real reviews), multilingual pages, a real map tile service.

## Data
- `src/data/site.ts`: `faq` (moved from `rates.astro`), business details for schema (city, region, country, price range).
- `src/data/cities.ts`: `{ slug, name, region, intro, travel: string, venues?: string[], faq?: Faq[], image, alt }`; demo set: Poznań, Wrocław, Kraków, Warszawa, Gdańsk, plus "Dolomites" as a destination example.
- Days (`days` in `site.ts`) link to a city by slug where they match.

## Slices

### [ ] 1. Structured data
- **Build:** move the FAQ into data; a `JsonLd.astro` helper; business JSON-LD in `BaseLayout` from `site.ts`; `FAQPage` on `/rates/`.
- **Files:** `src/components/JsonLd.astro`, `src/layouts/BaseLayout.astro`, `src/pages/rates.astro`, `src/data/site.ts`
- **Agent:** frontend
- **Accept:**
  - [ ] the JSON-LD on `/` and `/rates/` parses and uses valid schema.org types (checked with the Rich Results / Schema validator by hand, noted in the log)
  - [ ] one block per type per page; nothing duplicated across client-side navigations

### [ ] 2. City pages
- **Build:** `src/pages/cities/[slug].astro` with `getStaticPaths` from `cities.ts`: hero image, H1 ("Wedding photographer in Wrocław"), local intro, days shot there (from `days`), travel note and price hint, local FAQ (+ `FAQPage`), CTA to the quick contact / form with the city filled in the message, breadcrumbs (+ `BreadcrumbList`), own title, description and canonical.
- **Files:** `src/pages/cities/[slug].astro`, `src/data/cities.ts`, `src/data/site.ts`, components it needs
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every city builds to its own static page with a unique title, description and canonical
  - [ ] a city with no days shows a designed empty state, not an empty section
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 3. Service area + sitemap
- **Build:** a "Where we work" section (on `/studio/` and as a footer list) linking to every city page; a simple stylised map or list (SVG from data, no map service); `sitemap.xml` and `robots.txt`.
- **Files:** `src/components/ServiceArea.astro`, `src/pages/studio.astro`, `src/components/Footer.astro`, `astro.config.mjs` or `src/pages/sitemap.xml.ts`, `public/robots.txt`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] every city page is linked from the service-area section and the footer
  - [ ] `sitemap.xml` lists every page including city pages, with absolute URLs from `site`

## External needs
- The client's real cities, travel terms and local venues.
- Submit the sitemap in Google Search Console after launch ([setup.md](../setup.md)).

## Open questions
- Route: `/cities/wroclaw/`, `/wedding-photographer-wroclaw/` (keyword in the slug), or Polish slugs? Recommended: `/wedding-photographer/wroclaw/` — keyword-rich, still clean, and the segment can change per niche in 007.
- Sitemap: add `@astrojs/sitemap` (new dependency) or a small hand-written `sitemap.xml.ts` endpoint? Recommended: `@astrojs/sitemap`, it's the standard and tiny.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
