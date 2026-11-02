# 003 — Price calculator

**Status:** draft · **Depends on:** 002 · **Route(s):** `/rates/`, `/contact/`

## Goal
A visitor builds their own quote on `/rates/` — package plus add-ons — sees the total change live, and sends it to me in one click. In the demo: *"clients arrive already knowing the price."*

## Scope
- In: numeric prices for plans and add-ons, one price formatter, the calculator on `/rates/`, passing the selection to `/contact/` (`?plan=&addons=`) and showing it above the form and in the WhatsApp text.
- Out: discounts, deposits and payments, distance-based travel pricing (a fixed note stays: travel within the M25 is included, further out is quoted at cost), VAT (every price is ex VAT and says so), currency switching.

## Data
`src/data/site.ts`:
- `site.currency` (`GBP`), `site.locale` (`en-GB`; formatting matches the current "£1,750").
- `Plan.price: number` (was a string); `addOns` moved from `rates.astro` into data: `{ id, name, price: number, priceFrom?: boolean, note }`.
- `formatPrice(amount)` helper in `src/data/format.ts` using `Intl.NumberFormat`.

## Slices

### [ ] 1. Numeric prices + formatter
- **Build:** move add-ons into `site.ts`, make plan and add-on prices numbers, add `formatPrice`, render every price through it. The page looks the same as before.
- **Files:** `src/data/site.ts`, `src/data/format.ts`, `src/components/Packages.astro`, `src/pages/rates.astro`
- **Agent:** frontend · **Model:** haiku
- **Accept:**
  - [ ] no price string is left in markup; all prices render through `formatPrice`
  - [ ] home and rates look unchanged (compare UI check screenshots before / after)

### [ ] 2. Calculator on /rates/
- **Build:** a `PriceCalculator.astro` section: package choice (radio cards), add-on toggles, a sticky (on mobile: bottom) total with `aria-live="polite"`, "from" prices marked as such, and a CTA "Send this to us" → `/contact/?plan=…&addons=…`. Without JS it shows the price list and a link to the form.
- **Files:** `src/components/PriceCalculator.astro`, `src/pages/rates.astro`, `src/scripts/calculator.ts`, `src/scripts/site.ts`, `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [ ] the total updates on every change and is announced politely
  - [ ] keyboard: every option reachable and toggleable; labels on all controls
  - [ ] 375px without horizontal scroll, the total never covers content; Night and Day

### [ ] 3. Selection in the enquiry
- **Build:** `/contact/` reads `addons` too; the confirmation line from 002 shows package + add-ons + total; the form submits them (hidden fields or a readable summary field); the quick-contact WhatsApp text includes the total.
- **Files:** `src/components/ContactForm.astro`, `src/scripts/booking.ts`
- **Agent:** frontend
- **Accept:**
  - [ ] unknown add-on ids are ignored; the total matches the calculator
  - [ ] the submitted data contains the package, add-ons and total

## External needs
The client's real prices, add-ons and usage terms.

## Open questions
- Should the calculator replace the add-ons block on `/rates/` or sit below the packages? Recommended: replace the add-ons block, keep the three package cards above as they are.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
