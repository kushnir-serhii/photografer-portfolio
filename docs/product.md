# Product

## What it is

**Still Hours** is a fictional wedding and family photographer in Poznań. The site is a **sales demo**: it is shown to real photographers to sell them a website like it. "Still Hours", the people, the days and every photograph are placeholders.

The site has to work on two levels at once:

1. **As a real photographer's site.** A couple or a family lands on it, sees the work, understands the price, and gets in touch. If this doesn't feel real, the demo fails.
2. **As a pitch.** A photographer clicking through it in two minutes recognises their own problems (vague "how much?" messages, no-shows on the form, not found on Google) and sees each one solved on screen.

## Who it's for

| Audience | What they want | What they must see |
| --- | --- | --- |
| **Photographer (the buyer)** | More bookings with less back-and-forth; a site that looks like their work, not a template; something they can update. | Features that clearly lead to enquiries; speed and mobile quality; their niche (wedding, newborn, events) reflected; how easy swapping content is. |
| **Visitor (the photographer's client)** | To know quickly whether this person is right, affordable and free on the date. | Work first; prices in the open; one-tap contact; whether the date is free. |

## The demo story

The walkthrough a photographer gets, in order. Features earn their place by fitting into it.

1. **Home:** full-bleed hero, motion, selected days. *"This looks like a studio, not a template."*
2. **Work:** filterable gallery, a film reel. *"My stills and my video both have a place."*
3. **Rates:** packages, a live price calculator, honest FAQ. *"Clients arrive already knowing the price."*
4. **Booking:** "Check this date" on a package → enquiry already filled in; availability calendar; quick contact by phone, WhatsApp or Messenger. *"Fewer vague messages, more booked dates."*
5. **Found locally:** a page per city plus structured data for Google. *"People searching 'wedding photographer Wrocław' find me."*
6. **Client gallery:** a private gallery where clients pick favourites (mocked). *"It could replace the gallery service I pay for."*
7. **Your niche:** the same site re-dressed for newborn or events. *"It would fit my business, not someone else's."*
8. **Under the hood:** Lighthouse, phone, and how content lives in one data file. *"Launch in a week, and I can change prices myself."*

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero, marquee, intro, selected days slider, index list, how it works, packages, testimonial, closing CTA. |
| `/work/` | Gallery with category filters (weddings, families, elopements, film). |
| `/studio/` | Who the photographer is and how they work. |
| `/rates/` | Packages, add-ons, FAQ. |
| `/contact/` | Enquiry form, direct contacts, what happens next. |
| `/privacy/`, `404` | Legal page, not found. |

Planned routes are listed in each spec and in [roadmap.md](roadmap.md).

## Design principles

- **Work first.** Photographs are big and uncropped by UI; chrome stays quiet. The site sells pictures.
- **Still Hours system.** Dark first (Night) with a Day theme, ink + electric lime, a heavy grotesk (Bricolage Grotesque), Instrument Sans for text, JetBrains Mono for meta. Motion is small and purposeful (reveal, split headings, magnetic buttons) and turns off under reduced motion.
- **Calm, honest voice.** Short sentences, numbers in the open, no hype, no emoji. Advice that helps the client even when it costs a sale.
- **One tap to a human.** Phone, WhatsApp and the form are never more than one tap away, on any page, on a phone.
- **Finished in every state.** Empty filters, form errors, missing images and both themes look designed, because a photographer will click the odd thing.
- **Swappable.** Anything a client changes (names, contacts, prices, cities, days, photos, niche copy) is data, not markup.

## Technical frame

- **Astro 7**, fully static (`astro build` → `dist/`), `ClientRouter` view transitions. TypeScript strict. npm.
- No backend, no database. The enquiry form posts to `PUBLIC_FORM_ENDPOINT` (e.g. Formspree) or falls back to `mailto:`.
- Content in `src/data/`, components in `src/components/`, pages in `src/pages/`, styles in `src/styles/` (`tokens.css`, `components.css`, `site.css`), behaviour in `src/scripts/` (`still-hours.js` motion runtime + `site.ts`).
- Demo-only features sit behind `site.demo` (see [conventions.md](conventions.md) → Demo features).
- Hosting is undecided; any static host works. See [setup.md](setup.md).
