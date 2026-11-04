# 003 — Price calculator

**Status:** done · **Depends on:** 002 · **Route(s):** `/rates/`, `/contact/`

## Goal
A visitor builds their own quote on `/rates/` — package plus add-ons, with quantities where the price is per unit — sees the total change live, and sends it to me in one click: the brief on `/contact/` and the WhatsApp text arrive with the quote already in them. In the demo: *"clients arrive already knowing the price"*, and the photographer changes every price in one data file.

## Scope
- In: numeric prices for plans and add-ons, one price formatter, quantities for per-unit prices (headshots per person, retouching per image, extra hours), every price on the site built from those numbers (cards, marquee, `/rates/` description, area price hints, `priceRange`), one schema.org `Offer` per package on `/rates/`, the calculator on `/rates/` in place of the add-ons block, passing the selection to `/contact/` (`?plan=&qty=&addons=`) and showing it above the form, in the submitted brief, in the budget field and in the WhatsApp text.
- Out: discounts, deposits and payments, distance-based travel pricing (a fixed note stays: travel within the M25 is included, further out is quoted at cost), VAT (every price is ex VAT and says so), currency switching, a calculator on the home page.

## Data
- `src/data/format.ts` (no imports, so client scripts can use it): `money = { currency: 'GBP', locale: 'en-GB' } as const` and `formatPrice(amount: number): string` via `Intl.NumberFormat(money.locale, { style: 'currency', currency: money.currency, maximumFractionDigits: 0 })` → "£1,750". This is the one place for currency and locale (instead of `site.currency` / `site.locale`, see Decided).
- `src/data/site.ts`:
  - `interface Quantity { min: number; max: number; one: string; many: string }` (`one`/`many`: "person"/"people", "image"/"images", "hour"/"hours").
  - `Plan.price: number` (was a string); `Plan.qty?: Quantity` (headshots: 5–50 people). `unit` stays as copy ("per person, min. 5").
  - `type AddOnId = 'extra-usage' | 'retouching' | 'short-video' | 'extra-hour'`; `AddOn { id: AddOnId; name: string; price: number; priceFrom?: boolean; unit?: string /* shown after the price: "per image" */; qty?: Quantity; detail?: string }`. Retouching 1–200 images, extra hour 1–4 hours; extra usage and short video are `priceFrom`.
  - Travel outside the M25 is no longer an add-on: it becomes copy (`ratesPage.travel = { name, price: 'at cost' }`), shown as a note.
  - `budgetRanges` become `{ label: string; max?: number }[]` (upper bound ex VAT; "Not sure yet" has none) so a total can pick one.
  - Copy for the calculator and the quote line goes into `site.ts` (`calculatorCopy`, `enquiryForm`, `quickContact.whatsappText.quote`).
- `src/data/quote.ts` (pure, no DOM, imports only types from `site.ts` and `formatPrice`): the quote shape `{ plan: PlanId; qty?: number; addOns: { id: AddOnId; qty?: number }[] }`, `parseQuote(params, plans, addOns)` (unknown ids ignored, quantities clamped to min–max, missing or bad quantity → min, duplicates → first wins), `quoteTotal` (`{ amount, from: boolean }`), `quoteSummary` ("Full day, extra hour ×2, short video — from £2,800 ex VAT"), `quoteParams` (back to a query string). Used at build time and by the scripts; the price data reaches the client through a JSON data attribute, never by importing `site.ts`.
- URL: `?plan=headshots&qty=8&addons=retouching:20,extra-hour:2,short-video`. `qty` is the plan's quantity; an add-on's quantity follows a colon.

## Slices

### [x] 1. Numeric prices + formatter
- **Build:** add `format.ts`; make plan and add-on prices numbers with ids, quantities and units as in **Data**; render every price through `formatPrice` (package cards on home and rates, the add-ons list, the form's package options). Build the price copy from the numbers: the marquee's "Half day from £950", `ratesPage.description`, the area `priceHint`s (`areas.ts`), `business.priceRange` (cheapest to dearest plan). Add `offersSchema(plans, siteUrl)` to `schema.ts`: an `OfferCatalog` whose items are one `Offer` per package (`price`, `priceCurrency`, `UnitPriceSpecification` with `valueAddedTaxIncluded: false` and the unit text, `itemOffered` a `Service`, `offeredBy` the business `@id`), on `/rates/`. Add `quote.ts` with its helpers (used from slice 2 on). `budgetRanges` get their `max`. The page looks the same as before.
- **Files:** `src/data/format.ts`, `src/data/quote.ts`, `src/data/site.ts`, `src/data/areas.ts`, `src/data/schema.ts`, `src/components/Packages.astro`, `src/components/ContactForm.astro`, `src/pages/rates.astro`
- **Agent:** frontend · **Model:** sonnet
- **Accept:**
  - [x] no price string is left in markup or in copy that repeats a package price; all prices render through `formatPrice`
  - [x] home, rates, contact and area pages look unchanged (same text, compare UI check screenshots before / after)
  - [x] `/rates/` has one `OfferCatalog` JSON-LD block with an `Offer` per package; `priceRange` still reads "£120–£1,750"
  - [x] `parseQuote` ignores unknown ids and clamps quantities (checked with a few inputs in the report)

### [x] 2. Calculator on /rates/
- **Build:** a `PriceCalculator.astro` section that replaces the add-ons block on `/rates/` (the three package cards above stay as they are):
  - package choice as compact radio cards (name, price, unit); Full day (the featured plan) is chosen by default, `?plan=` overrides it; Headshots shows a people stepper (5–50) when chosen;
  - add-ons as toggles with name, detail and price; retouching and extra hour show a − / + stepper (with a labelled number input) once on; "from" prices say "from";
  - a total panel: the chosen lines, the total ("£2,150", or "From £2,800" when any chosen price is "from"), "ex VAT", the travel note (inside the M25 included, further out at cost), a CTA "Send this to me" → `/contact/?plan=…&qty=…&addons=…`, and an "or call / WhatsApp" quick-contact opener carrying the same quote (`data-plan`, `data-qty`, `data-addons`);
  - desktop: two columns, the total panel sticky in the right one; phones: a compact bottom bar (total + CTA) while the calculator is on screen, the full panel at the end of the section, and enough space that the bar never covers content;
  - the calculator keeps `?plan=&qty=&addons=` of `/rates/` in step (`replaceState`), so a reload or a shared link shows the same quote;
  - without JS: the same section reads as a price list (packages and add-ons with prices), the controls stay disabled and the panel shows a link to the brief form.
- **Files:** `src/components/PriceCalculator.astro`, `src/pages/rates.astro`, `src/scripts/calculator.ts`, `src/scripts/site.ts`, `src/data/site.ts` (copy), `src/styles/site.css`
- **Agent:** designer → frontend
- **Accept:**
  - [x] the total updates on every change (package, toggle, quantity) and is announced politely (`aria-live="polite"`)
  - [x] keyboard: every option reachable and toggleable; labels on all controls; steppers have labelled buttons and stay within min–max
  - [x] 375px without horizontal scroll, the bottom bar never covers content; Night and Day; reduced motion
  - [x] `/rates/?plan=headshots&qty=8&addons=retouching:20,bogus` opens with that quote (the unknown id ignored); no JS shows a readable price list and a link to the form

### [x] 3. Selection in the enquiry
- **Build:** `/contact/` reads `qty` and `addons` as well as `plan`:
  - the confirmation line from 002 shows package + add-ons + total ("Full day, extra hour ×2 — £2,150 ex VAT") with an "Edit quote" link back to `/rates/?…` (the calculator); with a plan alone it stays as in 002;
  - changing the package in the form keeps the add-ons and recomputes the total; form reset clears the quote and its params;
  - the form submits one readable `quote` field (a hidden input with the summary, filled by the script);
  - the budget select is set to the range that holds the total, unless the visitor has changed it themselves;
  - the quick-contact WhatsApp text adds " My quote from your site: {quote}." when the visitor built a quote (add-ons or a plan quantity); otherwise the 002 texts stay.
- **Files:** `src/components/ContactForm.astro`, `src/components/QuickContact.astro`, `src/scripts/booking.ts`, `src/data/site.ts` (copy)
- **Agent:** frontend
- **Accept:**
  - [x] unknown add-on ids and bad quantities are ignored; the total matches the calculator for the same URL
  - [x] the submitted data contains the package, add-ons and total (in `quote`); the budget follows the total until the visitor changes it
  - [x] the WhatsApp text from `/rates/` (calculator opener) and from `/contact/?plan=…&addons=…` includes the summary and total

## External needs
The client's real prices, add-ons (with units and quantity limits) and usage terms.

## Open questions
- **Decided (2026-11-03):** the calculator replaces the add-ons block on `/rates/`; the three package cards above stay as they are.
- **Decided (2026-11-03):** per-unit prices get − / + steppers (headshots people 5–50, retouching images, extra hour 1–4); "from" add-ons are toggles marked "from"; travel outside the M25 is a note, not a toggle.
- **Decided (2026-11-03):** the brief carries one readable `quote` field; the line above the form shows the quote with "Edit quote" back to `/rates/`; the budget select follows the total until the visitor changes it.
- **Decided (2026-11-03):** default package is the featured one (Full day) unless `?plan=`; the total says "From" when any chosen price is "from"; URL `?plan=&qty=&addons=id:qty,…`; the WhatsApp text adds the quote; all price copy is built from numbers; one `Offer` per package in JSON-LD on `/rates/`; slice 1 runs on Sonnet (the data shape is not mechanical).
- **Decided (2026-11-03):** currency and locale live in `src/data/format.ts` (`money`), not in `site`: client scripts import the formatter, and importing `site.ts` there would bundle the image imports.

## Log
| Date | Slice | Result | Notes / files |
| --- | --- | --- | --- |
| 2026-11-03 | 1 | done: `format.ts` (`money`, `formatPrice`, `priceText`), numeric plan/add-on prices with ids, quantities and units, travel as `ratesPage.travel`, price copy (marquee, rates description, area hints, `priceRange`) built from numbers, `OfferCatalog` JSON-LD on `/rates/`, `quote.ts` helpers (checked: unknown ids dropped, qty clamped, duplicates first wins, round-trip), `budgetRanges` with `max` / `notSure`. Built pages diffed against the baseline: identical except the new JSON-LD on rates. | `format.ts`, `quote.ts`, `site.ts`, `areas.ts`, `schema.ts`, `Packages.astro`, `ContactForm.astro`, `rates.astro` |
| 2026-11-03 | 2 | done: `PriceCalculator` replaces the add-ons block (the rates photo dropped: two columns with a sticky panel, work first); package radio cards, add-on checkboxes, `QtyStepper` (reused three times, `aria-disabled` at limits, clamp on blur/Enter), panel with lines and unit maths, total announced after a 450 ms pause, "Send this to me" (first person, instead of "to us") and the quick-contact opener with `data-plan/qty/addons`; phone bar via IntersectionObserver with scroll padding; URL kept in step with `quoteQuery` (readable); no JS: disabled price list + link to the form. Checked 375/1280, Night/Day, `?plan=headshots&qty=8&addons=retouching:20,bogus` → £1,460, bogus dropped. | `PriceCalculator.astro`, `QtyStepper.astro`, `Icon.astro` (minus/plus), `calculator.ts`, `site.ts` (script, copy), `quote.ts`, `rates.astro`, `site.css` |
| 2026-11-03 | 3 | done: `/contact/` reads `qty`/`addons` (`parseBuiltQuote`: a plan alone stays 002), line "Headshots for 8 people, extra retouching ×20 — £1,460 ex VAT · Change · Edit quote" (→ `/rates/?…#quote`), package change keeps add-ons, "Not sure yet" and reset clear the quote; hidden `quote` field (disabled when empty); budget follows the total (`budgetIndex`) until changed by hand; WhatsApp adds " My quote from your site: …" from the calculator opener or the URL; the dialog's brief link carries the quote. Shared JSON guards in `price-data.ts`. Checked in Playwright via `FormData` and the WhatsApp href. | `ContactForm.astro`, `QuickContact.astro`, `booking.ts`, `calculator.ts`, `price-data.ts`, `quote.ts`, `site.ts` (copy), `rates.astro` |
| 2026-11-03 | — | UI check passed (root, rates, contact, brand-photographer/shoreditch · 375/1280 · Night/Day); screenshots reviewed. `docs/setup.md` → 3c. Spec done. | `setup.md` |
