# Turning the demo into a client's site

Everything runs locally and needs no accounts. This file collects what changes when the demo becomes a real photographer's site, and what the user connects. Agents never do these steps; they add to this file when a spec needs new client data, an account or an env var.

## Status

| What | Status | Needed from |
| --- | --- | --- |
| Photographs | placeholders in `public/images/` | launch |
| Studio name, copy, contacts | Still Hours placeholders in `src/data/site.ts` | launch |
| Enquiry form endpoint | not set — falls back to `mailto:` | launch |
| Site URL | `https://stillhours.co` placeholder in `astro.config.mjs` | launch |
| Hosting | not chosen (any static host) | launch |
| WhatsApp / Messenger | not set | 002 |
| Availability dates | demo data | 002 |
| City list | — | 004 |
| Video hosting | — | 005 |
| Client gallery service | — (demo only) | 006 |

## Content to swap

1. **Photographs:** replace every file in `public/images/` with the client's work. Keep the file names or update `src/data/site.ts`. Ratios: 4:5 for people, 3:2 for rooms, 16:9 for slides. The `/work/` gallery packs without holes only for the current mix and order of frame sizes (default, tall, wide, half); when the frame list changes, run `npm run ui-check` and look at the work screenshots.
2. **`src/data/site.ts`:** name, description, email, phone, Instagram, client-galleries link, days, frames, plans. Set `demo: false` (once spec 002 adds the flag) so demo-only features disappear.
3. **Copy in pages:** home, studio, rates (add-ons, FAQ) and contact still hold some copy in markup; specs move it into `src/data/` as they touch it.
4. **Privacy page:** have the text reviewed for the client's country (GDPR for Poland / EU).

## Enquiry form

Set `PUBLIC_FORM_ENDPOINT` in `.env` (and in the host's build env) to a form service URL that accepts `POST` with `Accept: application/json` (e.g. Formspree). Empty = the form opens the visitor's mail app (`mailto:`), which works but loses more enquiries.

## Site URL

Set `site` in `astro.config.mjs` to the production domain (no trailing path). It sets canonical URLs and Open Graph image URLs.

## Deploy

Any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages): build command `npm run build`, output `dist/`. Set `PUBLIC_*` env vars as **build** variables (they are inlined at build time).
