# 002 — Booking flow: package → enquiry, quick contact, availability

**Status:** ready · **Depends on:** 001, 008 · **Route(s):** `/`, `/rates/`, `/contact/`, header on every page

## Goal
A visitor picks a package, sees whether the date is free, and reaches me in one tap — by brief (already filled in), phone or WhatsApp. In the demo this is the main story: *"fewer vague emails, more booked shoots."*

## Scope
- In: plan ids and `?plan=` prefill of the brief form; a quick-contact dialog (Call / WhatsApp / Email / Brief form, Messenger when set) opened from the header, the packages and the hero; a WhatsApp message pre-written with the shoot date and package when known; an availability calendar on `/contact/` from static data; the `site.demo` flag.
- Out: price totals and add-ons (003), real calendar sync (Google Calendar / iCal — later, listed in setup), payments, booking without a conversation.

## Data
`src/data/site.ts`:
- `site.demo: boolean` (true here).
- `site.whatsapp` (international number, digits only; demo: `447700900321`, an Ofcom drama number), `site.messenger` (m.me username, optional, empty in the demo); empty = that channel isn't shown.
- `Plan.id` (`half-day`, `full-day`, `headshots`), stable, used in URLs.
- `availability`: `{ from: string; months: number; booked: string[]; halfDay?: string[] }`: `from` is the first month (`2027-01`), `months` how many to show (4), ISO dates for booked days and days with only half a day left. The calendar starts at the later of `from` and the current month. Demo data looks plausible from January 2027 to April 2027 (a few booked days, a few half days).
- WhatsApp message copy (with date and package, with package only, neutral) lives in `src/data/site.ts`.

Scripts: `src/scripts/booking.ts` (prefill, dialog, calendar), wired from `site.ts`. URL params: `plan`, `date` (ISO). Unknown values are ignored.

## Slices

### [ ] 1. Package → prefilled brief
- **Build:** plan ids; each package CTA reads "Book this" (the featured one stays primary) and links to `/contact/?plan=<id>`; the contact form gets a "Package" select (plans + "Not sure yet", `name="package"`) next to "Preferred date", with "Shoot type" and "Budget" in the other row; it is preselected from `?plan=`, and `?date=` (ISO) fills the date as a readable English date ("12 June 2027"); a short line above the form confirms the choice ("Full day — £1,750 ex VAT · Change"), where "Change" focuses the select. Changing the package or date keeps `?plan`/`?date` in the URL (`replaceState`).
- **Files:** `src/data/site.ts`, `src/components/Packages.astro`, `src/components/ContactForm.astro`, `src/scripts/booking.ts`, `src/scripts/site.ts`
- **Agent:** frontend → designer (the confirmation line)
- **Accept:**
  - [ ] each package's CTA opens `/contact/` with that package selected; an unknown `plan` is ignored without errors
  - [ ] the selected package is in the submitted form data (endpoint and `mailto:`)
  - [ ] without JS the links still lead to the form and the select works by hand
  - [ ] 375px without horizontal scroll, Night and Day

### [ ] 2. Quick-contact dialog
- **Build:** `QuickContact.astro` (native `<dialog>`, outside `<main>` so it persists) with Call (`tel:`), WhatsApp (`https://wa.me/<number>?text=…`), Messenger (`https://m.me/<user>`) and "Write a message" (→ `/contact/`, carrying `plan`/`date`). Plus "Email" (`mailto:`). Messenger only when `site.messenger` is set (empty in the demo). Opened from: the header (a quiet "Call or message" button before "Book a shoot" on desktop; a 44px phone icon button with `aria-label` next to the burger on phones; also a button in the drawer foot), an "or call / WhatsApp" text link under each package CTA (opens the dialog with that package), and a third quiet action "Call or message" in the hero. The WhatsApp text is pre-written: "Hi Robin, is 12 June 2027 free for a full day shoot?" with date and package, "Hi Robin, I'd like to ask about a full day shoot. Which dates are free?" with a package only, a neutral line otherwise. Without JS the openers are plain links to `/contact/`.
- **Files:** `src/components/QuickContact.astro`, `src/components/Header.astro`, `src/components/Packages.astro`, `src/components/Hero.astro`, `src/layouts/BaseLayout.astro`, `src/scripts/booking.ts`, `src/styles/site.css`, `src/data/site.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the dialog traps focus, closes on Escape and backdrop click, and returns focus to its opener, also after a client-side navigation
  - [ ] the WhatsApp link contains the package and date when they are known, URL-encoded
  - [ ] an empty `whatsapp` / `messenger` hides that option; targets ≥ 44px
  - [ ] works at 375px as a bottom sheet, at 1280px as a centered dialog, both themes

### [ ] 3. Availability calendar
- **Build:** `AvailabilityCalendar.astro` on `/contact/` in the right column (desktop: direct contacts → calendar → photo; phones: intro → direct contacts → calendar → form): a month grid (Mon-first) from `availability`, days marked free / half day left / booked / past (a half-day-left day can be picked), previous-next month buttons within the configured range, legend. Choosing a free day fills the form's date (readable English date) and `?date=` in the URL and moves focus to the form; it also updates the WhatsApp text in the quick-contact dialog. In demo mode a small note says "Demo dates — in your site this shows your real calendar." Without JS the calendar renders the first month of the range statically. The calendar is shown for a real client too (dates kept in data); only the note depends on `site.demo`.
- **Files:** `src/components/AvailabilityCalendar.astro`, `src/pages/contact.astro`, `src/scripts/booking.ts`, `src/styles/site.css`, `src/data/site.ts`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the grid is keyboard usable (arrow keys move between days, Enter picks), each day has an accessible name ("Friday 12 March 2027, booked")
  - [ ] booked and past days can't be picked; picking a free day fills the date field
  - [ ] states: a month with everything booked shows a line pointing to the form/quick contact
  - [ ] 375px without horizontal scroll, Night and Day

## External needs
- The client's WhatsApp number and (optionally) Messenger username.
- Later: the client's calendar source if availability should be real (Google Calendar public iCal), see [setup.md](../setup.md).

## Open questions
- **Note (2026-11-03):** the contact form's preferred date is a text field now (`type="text"`, `name="preferred_date"`), so the browser's locale never shows. `?date=` and a picked calendar day should fill it with a readable English date (`Intl.DateTimeFormat('en-GB')`, e.g. "12 June 2027"), not the ISO value.
- **Decided (2026-11-03):** channels are Call, WhatsApp, Email and the brief form; Messenger stays an optional data field, empty in the demo (UK marketing clients rarely use it).
- **Decided (2026-11-03):** no marquee or home teaser for the calendar in this spec; later idea.
- **Decided (2026-11-03):** header opener is text on desktop, a phone icon on phones, plus the drawer; calendar in the right column of `/contact/`; "few left" becomes "half day left" (a solo photographer's day is either free, half taken or booked).

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
