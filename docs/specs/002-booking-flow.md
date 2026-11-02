# 002 — Booking flow: package → enquiry, quick contact, availability

**Status:** draft · **Depends on:** 001 · **Route(s):** `/`, `/rates/`, `/contact/`, header on every page

## Goal
A visitor picks a package, sees whether the date is free, and reaches the photographer in one tap — by form (already filled in), phone, WhatsApp or Messenger. In the demo this is the main story: *"fewer vague messages, more booked dates."*

## Scope
- In: plan ids and `?plan=` prefill of the enquiry form; a quick-contact dialog (Call / WhatsApp / Messenger / Form) opened from the header, the packages and the hero; a WhatsApp message pre-written with the date and package when known; an availability calendar on `/contact/` from static data; the `site.demo` flag.
- Out: price totals and add-ons (003), real calendar sync (Google Calendar / iCal — later, listed in setup), payments, booking without a conversation.

## Data
`src/data/site.ts`:
- `site.demo: boolean` (true here).
- `site.whatsapp` (international number, digits only), `site.messenger` (m.me username, optional); empty = that channel isn't shown.
- `Plan.id` (`half-day`, `whole-day`, `family`), stable, used in URLs.
- `availability`: `{ booked: string[]; limited?: string[] }` ISO dates, plus how many months ahead to show. Demo data looks plausible (Saturdays in summer mostly booked).

Scripts: `src/scripts/booking.ts` (prefill, dialog, calendar), wired from `site.ts`. URL params: `plan`, `date` (ISO). Unknown values are ignored.

## Slices

### [ ] 1. Package → prefilled enquiry
- **Build:** plan ids; each package CTA links to `/contact/?plan=<id>`; the contact form gets a "Collection" select (plans + "Not sure yet") that is preselected from `?plan=`, and `?date=` fills the date; a short line above the form confirms the choice ("Whole day — 9 800 zł") with a way to change it.
- **Files:** `src/data/site.ts`, `src/components/Packages.astro`, `src/components/ContactForm.astro`, `src/scripts/booking.ts`, `src/scripts/site.ts`
- **Agent:** frontend → designer (the confirmation line)
- **Accept:**
  - [ ] each package's CTA opens `/contact/` with that package selected; an unknown `plan` is ignored without errors
  - [ ] the selected package is in the submitted form data (endpoint and `mailto:`)
  - [ ] without JS the links still lead to the form and the select works by hand
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 2. Quick-contact dialog
- **Build:** `QuickContact.astro` (native `<dialog>`, outside `<main>` so it persists) with Call (`tel:`), WhatsApp (`https://wa.me/<number>?text=…`), Messenger (`https://m.me/<user>`) and "Write a message" (→ `/contact/`, carrying `plan`/`date`). Opened from a header button ("Talk to us"), each package card and the hero. The WhatsApp text is pre-written: "Hi! Is <date> free for a <package>?" when known, a neutral line otherwise. Without JS the openers are plain links to `/contact/`.
- **Files:** `src/components/QuickContact.astro`, `src/components/Header.astro`, `src/components/Packages.astro`, `src/components/Hero.astro`, `src/layouts/BaseLayout.astro`, `src/scripts/booking.ts`, `src/styles/site.css`, `src/data/site.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the dialog traps focus, closes on Escape and backdrop click, and returns focus to its opener, also after a client-side navigation
  - [ ] the WhatsApp link contains the package and date when they are known, URL-encoded
  - [ ] an empty `whatsapp` / `messenger` hides that option; targets ≥ 44px
  - [ ] works at 375px as a bottom sheet, at 1280px as a centered dialog, both themes

### [ ] 3. Availability calendar
- **Build:** `AvailabilityCalendar.astro` on `/contact/` above or beside the form: a month grid (Mon-first) from `availability`, days marked free / few left / booked / past, previous-next month buttons within the configured range, legend. Choosing a free day fills the form's date and moves focus to the form; it also updates the WhatsApp text in the quick-contact dialog. In demo mode a small note says "Demo dates — in your site this shows your real calendar." Without JS the calendar renders the current month statically.
- **Files:** `src/components/AvailabilityCalendar.astro`, `src/pages/contact.astro`, `src/scripts/booking.ts`, `src/styles/site.css`, `src/data/site.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the grid is keyboard usable (arrow keys move between days, Enter picks), each day has an accessible name ("Saturday 12 June 2027, booked")
  - [ ] booked and past days can't be picked; picking a free day fills the date field
  - [ ] states: a month with everything booked shows a line pointing to the form/quick contact
  - [ ] 375px without horizontal scroll, Night and Day

## External needs
- The client's WhatsApp number and (optionally) Messenger username.
- Later: the client's calendar source if availability should be real (Google Calendar public iCal), see [setup.md](../setup.md).

## Open questions
- Show Messenger at all, or Call / WhatsApp / Form only? Recommended: keep it optional in data, shown when set; demo sets it.
- A small marquee item or home teaser for the calendar ("Four Saturdays left in June") — in this spec or later? Recommended: reuse the existing marquee items from data, no new component.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
