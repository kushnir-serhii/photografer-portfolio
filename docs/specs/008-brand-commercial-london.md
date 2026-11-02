# 008 — Repositioning: brand & commercial photographer in London

**Status:** in-progress · **Depends on:** 001 · **Route(s):** every page (`/`, `/work/`, `/studio/`, `/rates/`, `/contact/`, `/privacy/`, `404`)

## Goal
The demo becomes the site of a fictional **brand and commercial photographer in London**, branded under the photographer's own name. The dark, lime, high-motion design stays as it is: it reads as a creative studio, which fits brand work and did not fit weddings. A marketing manager or a founder landing on the site sees, within two seconds, who this is, what they shoot and for whom, and how to book a shoot. A photographer watching the demo sees a site that looks like a studio's, with their own name in the logo.

Why: in review the design read as "not a wedding photographer", the name "Still Hours" said nothing about photography, and an English site with Polish couples and złoty read as a mix. One coherent story (one city, one currency, one niche, one person) fixes all three.

## Scope
- In:
  - Identity: the photographer's name as the brand, with a one-line descriptor ("Brand & commercial photography, London") in the header area, hero, `<title>` and meta.
  - All visible copy rewritten for brand & commercial work: hero, intro, how it works, packages, FAQ, testimonial, closing CTA, studio page, contact page, 404, privacy wording.
  - Data reshaped for the niche: `days` → `projects` (client, sector, deliverables), new work categories, packages in £ with usage (licensing) terms, marquee and testimonial moved into data.
  - London details: £ prices, UK phone format (Ofcom drama range), London areas in project captions.
  - Placeholder photography that looks like real brand work (free-licence stock), replacing the 2–3 KB generated blurs, served through `astro:assets`.
  - Fixes found in review that sit on the same pages: the contact form `<select>` misalignment, direct contacts placed before the photo on phones, a branded `::selection`, no horizontal scroll at 375px, one label for the main CTA across header and hero.
  - Docs brought in line: `product.md`, `CLAUDE.md` overview, `README.md`, `setup.md`, and the wording of specs 002–007.
- Out:
  - Visual redesign: tokens, colours, type and motion stay as they are.
  - Renaming the `sh-*` class prefix, the `still-hours.js` runtime or the design system's internal name (code-level names, invisible to visitors).
  - Keeping the wedding content as a live variant. It stays in git history; spec 007 may bring it back as a niche variant.
  - Multilingual pages.

## Data
- `src/data/site.ts`:
  - `site`: `name` (photographer's name), `descriptor`, `city: 'London'`, `email`, `phone`, `phoneHref`, `season` (the next bookable period, replacing the hard-coded `year` in copy), `formEndpoint` unchanged.
  - `Day` → `Project`: `{ slug, client, title, sector, month, year, area, deliverables: string[], image, alt, cta }`.
  - `Category`: `brand`, `food`, `product`, `portraits`, `film` (labels: Brand, Food & hospitality, Product, Portraits & teams, Film).
  - `plans`: in £, each with `usage` (licence terms, e.g. "12 months, web and social").
  - New: `marquee: string[]`, `testimonial: { quote, by, role }`, `hero: { eyebrow, title, lead }`.
- `src/components/Hero.astro`: optional `lead` prop.
- `src/components/ContactForm.astro`: fields for a business brief (see slice 5).
- Images: `src/assets/work/*` (through `astro:assets`), sources and licences listed in `docs/setup.md`.

## Slices

### [x] 1. Identity and data
- **Build:** reshape `site.ts` as in **Data** with the new content (name, descriptor, London contacts, projects, categories, plans in £, marquee, testimonial, hero copy). Header, footer and `BaseLayout` meta read the new identity. Pages keep compiling with the renamed shapes; their prose is rewritten in later slices. The marquee no longer holds any hard-coded date ("Four days left in June").
- **Files:** `src/data/site.ts`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, every page that imports `days`/`plans` (mechanical renames only)
- **Agent:** frontend
- **Accept:**
  - [x] no "Still Hours", "Poznań", "zł", "wedding" or Polish names left in `src/data/`, header, footer or `<head>`
  - [x] logo shows the photographer's name; descriptor visible next to it from 1280px, and in the drawer on phones
  - [x] the phone number is in the 020 7946 0xxx range and the `tel:` link works
  - [x] `npm run build` green

### [x] 2. Placeholder photography
- **Build:** pick free-licence photos (Unsplash or Pexels licence) that look like one photographer's brand and commercial work: about 6 project covers, 12 gallery frames, a hero, a studio portrait, a contact image. Consistent grade, people not identifiable as celebrities, no brand logos visible. Serve them through `astro:assets` (`<Image>` with widths and AVIF/WebP); delete the old blurs.
- **Files:** `src/assets/work/*`, components that render images (`Hero`, `Slider`, `IndexList`, `GalleryGrid`, `StoryBlock`), `src/data/site.ts`, `docs/setup.md` (sources, licences, "replace with the client's own work")
- **Agent:** designer
- **Accept:**
  - [x] every image has its source URL and licence in `docs/setup.md`
  - [x] hero image under 300 KB at 1440px; no layout shift on load
  - [x] eyebrow and heading on the hero photo pass AA contrast over the actual image (scrim adjusted if needed)
  - [x] alt texts describe the picture, not the file name

### [x] 3. Home page
- **Build:** hero with eyebrow, a new headline and the `lead` line (who, what, where), CTA pair; intro; selected projects slider; replace the duplicate index list with a clients/sectors index (different data from the slider); how it works rewritten for a commercial shoot (brief → call → shoot → delivery); packages; testimonial from a client's marketing lead; closing CTA. Header CTA and hero CTA share one label.
- **Files:** `src/pages/index.astro`, `src/components/Hero.astro`, `src/components/IndexList.astro`, `src/components/Testimonial.astro`, `src/components/ClosingCta.astro`
- **Agent:** designer
- **Accept:**
  - [x] a first-time reader can say who, what and where from the first screen alone (no scroll) at 375px and 1280px
  - [x] slider and index show different content; each item links to something specific (project anchor or filtered category), not just `/work/`
  - [x] no inline `style=` layout values added; new spacing goes through `sh-*` classes and tokens
  - [x] Night and Day, reduced motion checked

### [ ] 4. Work and studio
- **Build:** `/work/` with the new categories and the projects' anchors; `/studio/` rewritten: who the photographer is, which clients and sectors, how a shoot runs, what a client gets (formats, usage rights, turnaround).
- **Files:** `src/pages/work.astro`, `src/pages/studio.astro`, `src/components/GalleryGrid.astro`, `src/scripts/site.ts`
- **Agent:** designer · **Model:** sonnet
- **Accept:**
  - [ ] every category filter has at least two frames; empty state still designed
  - [ ] `/work/?category=food` opens with that filter pressed; an unknown value shows everything
  - [ ] `/work/#<slug>` from the home page lands on the right project

### [ ] 5. Rates and contact
- **Build:** `/rates/` with packages in £ (e.g. half day, full day, headshots per person), add-ons (extra usage, retouching, short video), FAQ for commercial clients (usage rights, VAT, deposits, travel within the M25). `/contact/` with a business brief: name, company, email, shoot type, preferred date, budget range, brief. Fix the `<select>` misalignment (`.sh-field { align-content: start; }`, native padding removed with a custom chevron). On phones the direct contacts come before the photo. Branded `::selection` site-wide.
- **Files:** `src/pages/rates.astro`, `src/pages/contact.astro`, `src/components/ContactForm.astro`, `src/components/Packages.astro`, `src/styles/components.css`, `src/data/site.ts`
- **Agent:** designer
- **Accept:**
  - [ ] in a two-column row the fields' bottom lines align, with or without help text, at 1280px
  - [ ] select text starts at the same x as the other inputs
  - [ ] the form still submits without JS (mailto fallback) with the new fields in the body
  - [ ] on a 375px screen, email and phone are visible before the contact photo

### [ ] 6. Remaining pages and docs
- **Build:** 404 and privacy wording for a UK business (UK GDPR wording, no legal claims beyond a placeholder); `product.md` (what it is, audiences, demo story, pages), `CLAUDE.md` overview, `README.md`, `setup.md`; specs 002–007 reworded for the new niche (004: London areas and UK cities instead of Polish cities; 007: brand & commercial as the base niche, wedding as a possible variant).
- **Files:** `src/pages/404.astro`, `src/pages/privacy.astro`, `docs/*.md`, `docs/specs/00{2..7}-*.md`, `CLAUDE.md`, `README.md`
- **Model:** haiku
- **Accept:**
  - [ ] `grep -ri "wedding\|poznań\|zł\|couple"` over `src/` returns nothing
  - [ ] docs describe one product: a London brand & commercial photographer

## External needs
- A real client later supplies: name, descriptor, contacts, prices and usage terms, their own photos (the stock placeholders must be replaced before launch). Listed in `docs/setup.md`.

## Open questions
- **Decided (2026-11-02):** photographer's name **Robin Hale**; "Photography" only in the descriptor; example domain and email `robinhale.studio` / `hello@robinhale.studio`.
- **Decided:** hero headline **"Your brand, on its best day."**
- **Decided:** prices are placeholders; use Half day £950 · Full day £1,750 · Headshots £120 per person (min. 5); usage: 12 months, web and social, included.
- **Decided:** photos from Unsplash, picked by the agent for one consistent grade; the user approves the set after slice 2, before slice 3 starts.
- **Decided:** order: after 001, before 002 and 004.
- **Decided (2026-11-02):** voice is first person singular ("I"), since the brand is one person's name.
- **Decided:** one main CTA label everywhere (header, hero, drawer, footer, closing CTA): **"Book a shoot"**, to `/contact/`.
- **Decided:** no stop after slice 2; the user reviews the photo set with the final report, replacements go in as a `fix:` commit.
- **Decided:** the home index lists the work categories (sectors), with client names in the meta line; each row links to `/work/?category=<id>`, and `/work/` reads that parameter to preselect the filter (unknown values ignored; without JS the full gallery shows). The param support is built in slice 4.
- **Decided (defaults):** client names are fictional (no real companies); prices are shown ex VAT and say so; prices stay strings until spec 003; budget ranges: Under £1,000 · £1,000–2,500 · £2,500–5,000 · £5,000+; `astro.config.mjs` `site` becomes `https://robinhale.studio`; images move to `src/assets/work/` via `astro:assets` and the conventions' Images row is updated in slice 2.

- **Open (photos):** `on-set-fashion-shoot.jpg` has a small light-maker mark on a softbox, cropped out at 4:5 but in the source file; on phones the hero group's faces sit behind the headline (contrast passes). Review with the photo set.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
| 2026-11-02 | 1 | done | `site.ts` reshaped (Robin Hale, projects, categories, £ plans with usage, hero, marquee, testimonial); header descriptor (`.sh-brandline`), footer, BaseLayout, Packages, Slider, IndexList, Testimonial, ClosingCta, index, work, astro.config |
| 2026-11-02 | 2 | done | 18 Unsplash photos in `src/assets/work/` via `<Picture>` (AVIF/WebP); hero 43 KB AVIF at 1440px, contrast measured ≥5.2:1; old `public/images/` deleted; credits in `setup.md`; conventions Images row; `.sh-pic` |
| 2026-11-02 | 3 | done | Home: hero `lead`, intro, Selected projects, sectors index → `/work/?category=`, how it works (brief→call→shoot→delivery), packages head, testimonial, closing CTA; copy in `site.ts` (`intro`, `howItWorks`, `packagesIntro`, `closingCta`, `IndexRow`); inline styles moved to `site.css` |
