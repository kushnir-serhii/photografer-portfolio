# Roadmap

The single source of truth for what is done, what is next, and in which order. `/run-implement` (`/run-impl`) reads this file. The process behind it is in [process.md](process.md).

Already built before the process existed: the demo site (home, work, studio, rates, contact, privacy, 404) on the Still Hours design system, repositioned as Robin Hale, a London brand & commercial photographer (spec 008). Specs below build on it. Feature research behind them: [reference/bemazal-analysis.md](reference/bemazal-analysis.md).

## Status

| # | Spec | Status | Depends on |
| --- | --- | --- | --- |
| 001 | [Playwright UI check](specs/001-ui-check.md) | done | — |
| 002 | [Booking flow: package → enquiry, quick contact, availability](specs/002-booking-flow.md) | done | 001, 008 |
| 003 | [Price calculator](specs/003-price-calculator.md) | in-progress | 002 |
| 004 | [Area pages + SEO](specs/004-city-pages-seo.md) | done | 001, 008 |
| 005 | [Film reel](specs/005-film-reel.md) | draft | 001, 008 |
| 006 | [Client gallery (demo)](specs/006-client-gallery.md) | draft | 001, 008 |
| 007 | [Niche variants](specs/007-niche-variants.md) | draft | 002, 003, 004 |
| 008 | [Repositioning: brand & commercial photographer in London](specs/008-brand-commercial-london.md) | done | 001 |

Statuses: `draft` → `ready` → `in-progress` → `done` (meaning in [process.md](process.md#statuses)). The status here and in the spec's header must match.

## Plan

Read top to bottom; the next spec is the first one that isn't `done`. Specs in one wave don't depend on each other and can run in parallel; otherwise they are built in the listed order.

| Wave | Specs (in order) |
| --- | --- |
| 1 | 001 |
| 2 | 008 |
| 3 | 002, 004 |
| 4 | 003, 005, 006 |
| 5 | 007 |

- To change the order, edit this table.
- To make a spec buildable, review it and set it to `ready` here and in the spec.
- New spec: copy [specs/_template.md](specs/_template.md), take the next number, add a row to **Status** and put it in a wave.

## Later (not specced)
Journal / blog (content collections), more testimonials with a reviews block, buyer-tips page ("how to choose a photographer", "where you can save"), Instagram feed, multilingual pages, Lighthouse report page for the pitch.
