# Still Hours — photographer portfolio

Astro site built from the Still Hours design system: dark first, ink + electric lime, a heavy grotesk, and a small motion runtime.

## Commands

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm install`     | Install dependencies                      |
| `npm run dev`     | Dev server at http://localhost:4321       |
| `npm run build`   | Type-check and build the static site to `dist/` |
| `npm run preview` | Serve the built site                      |

## Structure

```
src/
  data/site.ts          all copy that repeats: contact details, days, gallery frames, rates
  layouts/BaseLayout    <head>, theme restore before paint, header + footer
  components/           Header, Hero, Marquee, Slider, IndexList, StoryBlock,
                        Packages, Testimonial, GalleryGrid, ContactForm, ClosingCta, Footer
  pages/                / (home), /work, /studio, /rates, /contact, /privacy, 404
  styles/tokens.css     design tokens (Night default, Day via data-theme="day")
  styles/components.css the design system stylesheet (sh-* classes)
  styles/site.css       site additions: mobile drawer, filters, FAQ, skip link
  scripts/still-hours.js the design system motion runtime (data-split, data-reveal, slider…)
  scripts/site.ts       drawer, gallery filters, enquiry form
public/images/          PLACEHOLDER photographs — replace before launch
```

## Before launch

- Replace every image in `public/images/` with real work (keep the file names, or update `src/data/site.ts`). The layouts expect 4:5 for people, 3:2 for rooms, 16:9 for slides.
- Set the real phone number, Instagram and client-gallery links in `src/data/site.ts`, and `site` in `astro.config.mjs`.
- Enquiry form: set `PUBLIC_FORM_ENDPOINT` in `.env` (e.g. a Formspree URL). Without it the form falls back to `mailto:`.
- Have the privacy page copy reviewed.
