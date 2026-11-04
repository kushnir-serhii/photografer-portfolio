# Product

## What it is

**Robin Hale** is a fictional brand and commercial photographer in London. The site is a **sales demo**: it is shown to real photographers to sell them a website like it. The name, clients, projects and every photograph are placeholders. The photographs are free-licence stock (Unsplash, see [setup.md](setup.md)), and the clients are made up.

The site has to work on two levels at once:

1. **As a real photographer's site.** A marketing manager, founder or agency producer lands on it, sees relevant work, understands the price and the usage terms, and gets a shoot booked. If this doesn't feel real, the demo fails.
2. **As a pitch.** A photographer clicking through it in two minutes recognises their own problems (vague "how much?" emails, a brief that arrives half-written, not found on Google) and sees each one solved on screen.

## Who it's for

| Audience | What they want | What they must see |
| --- | --- | --- |
| **Photographer (the buyer)** | More booked shoots with less back-and-forth; a site that looks like a studio, not a template; something they can update. Brand and commercial photographers first; another niche gets the same site with its own data and photos. | Features that clearly lead to enquiries; speed and mobile quality; their niche reflected; how easy swapping content is. |
| **Visitor (the photographer's client)** | Marketing managers, founders and agency producers. To know quickly whether this person fits the brief, what it costs, what they can do with the pictures, how soon the files arrive, and how to book. | Relevant work first; prices and usage terms in the open; turnaround; one-tap contact; a brief that is quick to send. |

## The demo story

The walkthrough a photographer gets, in order. Features earn their place by fitting into it.

1. **Home:** full-bleed hero, motion, selected projects. *"This looks like a studio, not a template."*
2. **Work:** gallery filtered by sector, project entries, a film reel. *"My stills and my video both have a place."*
3. **Rates:** packages with usage, a live price calculator, honest FAQ. *"Clients arrive knowing the price and the licence."*
4. **Booking:** "Book this" on a package → brief already filled in; availability calendar; quick contact by phone or WhatsApp. *"Fewer vague emails, more booked shoots."*
5. **Found locally:** a page per London area and UK city, plus structured data for Google. *"People searching 'brand photographer Shoreditch' find me."*
6. **Client gallery:** a private gallery where the client picks selects for a shoot (mocked). *"Approvals without a separate gallery service."*
7. **Under the hood:** Lighthouse, phone, and how content lives in one data file. *"Launch in a week, and I can change prices myself."*

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Hero, marquee, intro, selected projects slider, what I shoot index, how it works, packages, testimonial, closing CTA. |
| `/work/` | Gallery with sector filters (brand, food & hospitality, product, portraits & teams, film), `?category=` preselects a filter; projects with anchors. |
| `/studio/` | Who the photographer is, which clients and sectors, how a shoot runs, what a client gets (formats, usage, turnaround). |
| `/rates/` | Packages in £ with usage terms, add-ons, FAQ. |
| `/contact/` | Business brief form, direct contacts, what happens next. |
| `/privacy/`, `404` | What is done with the details a brief contains (UK GDPR), not found. |

Planned routes are listed in each spec and in [roadmap.md](roadmap.md).

## Design principles

- **Work first.** Photographs are big and uncropped by UI; chrome stays quiet. The site sells pictures.
- **Still Hours system.** The design system's name, kept in code (`sh-*` classes, `still-hours.js`). Dark first (Night) with a Day theme, ink + electric lime, a heavy grotesk (Bricolage Grotesque), Instrument Sans for text, JetBrains Mono for meta. Motion is small and purposeful (reveal, split headings, magnetic buttons) and turns off under reduced motion.
- **Calm, honest voice.** First person singular ("I"), short sentences, prices and licence terms in the open, no hype, no emoji. Advice that helps the client even when it costs a sale.
- **One tap to a human.** Phone, WhatsApp and the form are never more than one tap away, on any page, on a phone.
- **Finished in every state.** Empty filters, form errors, missing images and both themes look designed, because a photographer will click the odd thing.
- **Swappable.** Anything a client changes (name, contacts, prices, usage terms, areas, projects, photos, niche copy) is data, not markup.

## Technical frame

- **Astro 7**, fully static (`astro build` → `dist/`), `ClientRouter` view transitions. TypeScript strict. npm.
- No backend, no database. The enquiry form posts to `PUBLIC_FORM_ENDPOINT` (e.g. Formspree) or falls back to `mailto:`.
- Content in `src/data/`, components in `src/components/`, pages in `src/pages/`, styles in `src/styles/` (`tokens.css`, `components.css`, `site.css`), behaviour in `src/scripts/` (`still-hours.js` motion runtime + `site.ts`).
- Demo-only features sit behind `site.demo` (see [conventions.md](conventions.md) → Demo features).
- Hosting is undecided; any static host works. See [setup.md](setup.md).
