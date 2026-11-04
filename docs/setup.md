# Turning the demo into a client's site

Everything runs locally and needs no accounts. This file collects what changes when the demo becomes a real photographer's site, and what the user connects. Agents never do these steps; they add to this file when a spec needs new client data, an account or an env var.

## Status

| What | Status | Needed from |
| --- | --- | --- |
| Photographs | Unsplash placeholders in `src/assets/work/` (see [Placeholder photographs](#placeholder-photographs)) | launch |
| Studio name, copy, contacts | Robin Hale placeholders in `src/data/site.ts` | launch |
| Enquiry form endpoint | not set — falls back to `mailto:` | launch |
| Site URL | `SITE_URL` env var; empty = Vercel's production domain on Vercel, else the `https://robinhale.studio` placeholder | launch |
| Hosting | not chosen (any static host) | launch |
| WhatsApp / Messenger | placeholder WhatsApp number (`site.whatsapp`), Messenger empty | launch |
| Availability dates | demo data (`availability` in `src/data/site.ts`) | launch |
| Area and city list | demo set of 9 (5 London areas, 3 UK cities, the Cotswolds) in `src/data/areas.ts` | launch |
| Films | three Pexels placeholder clips in `public/films/` (see [Placeholder films](#placeholder-films)) | launch |
| Client gallery service | demo gallery at `/clients/` (`src/data/client-galleries.ts`); `site.clientGalleries` empty | launch |

## Content to swap

1. **Photographs:** put the client's work into `src/assets/work/` (JPG, kebab-case names, about 2400px on the long edge) and point the imports at the top of `src/data/site.ts` to them: project covers (`projects`), the `/work/` gallery (`frames`), the hero (`hero.image`) and the page photos (`pictures`); each has an `alt` that describes what is in the picture. `astro:assets` builds the AVIF/WebP sizes; the default share image is the hero at 1200px. Delete the placeholders listed below. Ratios: 4:5 for people, 3:2 for rooms, 16:9 for slides; keep the subject near the centre, the slider crops to 4:5 on phones. The `/work/` gallery packs without holes only for certain mixes and orders of frame sizes (default, tall, wide, half); when the frame list changes, run `npm run ui-check` and look at the work screenshots at 375px and 1280px.
2. **`src/data/site.ts`:** name, description, email, phone, Instagram, client-galleries link, projects, frames, pictures, plans. Set `demo: false` so demo-only labels disappear.
3e. **Client galleries:** while `site.demo` is true the footer's "Client galleries" links to the mocked gallery (`/clients/`, code screen, data in `src/data/client-galleries.ts`; the code check is a demo, not protection). With `demo: false` no gallery pages are built: set `site.clientGalleries` to the client's gallery service (Pixieset, Pic-Time or a private store) and the footer links there and `/clients/` redirects to it; leave it empty and the footer link disappears and `/clients/` redirects home.
3a. **Quick contact and availability:** `site.whatsapp` is the client's WhatsApp number in international form, digits only (`447700900123`); empty hides the option. `site.messenger` is an m.me username, optional. The WhatsApp message templates are in `quickContact`. `availability` holds the first month (`from`), how many months to show, and the ISO dates that are booked or have only half a day left; the client (or you) updates it and rebuilds. Later it can be fed from the client's public Google Calendar iCal.
3c. **Prices and the calculator:** every price is a number, ex VAT, in `src/data/site.ts`: `plans[].price` (a per-unit plan such as headshots also gets `qty` with min / max and the unit words) and `addOns` (`id` stable once published, it is in `?addons=`; `price`, `priceFrom` for "from" prices, `unit` such as "per image", optional `qty`). The marquee, the rates description, area price hints, `priceRange` and the `Offer` JSON-LD are built from these numbers. Currency and locale are `money` in `src/data/format.ts`. `budgetRanges` need a `max` per range so a quote can pick the budget on the brief. Calculator copy is in `calculatorCopy`.
3b. **Areas:** `src/data/areas.ts` holds one entry per area page (`/brand-photographer/<slug>/`): `slug` (stable once published: it is the URL and the `?area=` value on `/contact/`), `name`, `region` (London, UK city or destination), a short first-person `intro`, the `travel` terms, a `priceHint`, optional `venues` (kinds of places or public places, never a business shown as a client) and an optional local `faq` (also published as `FAQPage` data), a street or city `image` with `alt` (optional `focus` for the wide crop), and `map` coordinates for the service-area map. Page copy is in `areaPage`. Link a project to an area with `areaSlug` in `projects`; an area without one shows recent work from elsewhere.
3d. **Films:** `films` in `src/data/site.ts`: one entry per film with `client`, `title`, `duration`, a `poster` photo with `alt`, and a `source`: a self-hosted file (`{ type: 'file', src: '/films/<name>.mp4', captions?: '/films/<name>.vtt' }`, H.264 MP4, 720p, a few MB) or a hosted video (`{ type: 'vimeo' | 'youtube', id }`; YouTube plays from youtube-nocookie, Vimeo with `dnt=1`). Nothing loads before the visitor presses play. `filmReel.film` picks the film on the home page; a gallery frame plays a film when it has `film: '<id>'`. Add captions (WebVTT) for any film with speech.
3. **Copy in pages:** home, studio, rates (FAQ) and contact still hold some copy in markup; specs move it into `src/data/` as they touch it.
4. **Privacy page:** have the text reviewed for the client's country (UK GDPR for the UK; the EU's GDPR elsewhere in the EU).

## Placeholder photographs

Every photograph in `src/assets/work/` is a stand-in from [Unsplash](https://unsplash.com), free to use under the [Unsplash License](https://unsplash.com/license). **Replace them all with the client's own work before launch**: the demo must never go live with stock photos presented as the photographer's.

| File | Used on | Source | Photographer | Licence |
| --- | --- | --- | --- | --- |
| `hero-team-portrait-studio.jpg` | Home hero, default share image | https://unsplash.com/photos/a-group-of-people-sitting-on-a-stage-80sYJlDB9mM | [isaac macdonald](https://unsplash.com/@isaacmacdonald) | Unsplash License |

| `fold-drum-roaster-floor.jpg` | Fold Coffee cover; /work/ | https://unsplash.com/photos/a-coffee-roaster-roasts-coffee-beans-in-a-large-factory-4DnLpTVy13s | [Zoshua Colah](https://unsplash.com/@zoshuacolah) | Unsplash License |

| `marlow-finch-street-coat.jpg` | Marlow & Finch cover; /work/ | https://unsplash.com/photos/a-woman-in-a-black-coat-and-sunglasses-standing-in-the-middle-of-a-street-onp4bTOtQO8 | [Dawid Kalinowski](https://unsplash.com/@kalinoovsky) | Unsplash License |

| `oriel-amber-droppers-window-light.jpg` | Oriel Skincare cover; /work/ | https://unsplash.com/photos/three-bottles-of-essential-oils-sitting-on-a-shelf-yoxlQMq-Sbk | [Cosmin Ursea](https://unsplash.com/@cosminursea) | Unsplash License |

| `northline-headshot-laughing.jpg` | /work/ | https://unsplash.com/photos/smiling-woman-in-white-and-black-checkered-dress-shirt-MQ2xYBHImKM | [Compagnons](https://unsplash.com/@sigmund) | Unsplash License |

| `northline-team-reviewing-prints.jpg` | Northline Architects cover | https://unsplash.com/photos/people-reviewing-documents-in-workspace-wR56AUlEsE4 | [Andreea Avramescu](https://unsplash.com/@minakko) | Unsplash License |

| `saltroom-long-table.jpg` | Saltroom cover; /work/ | https://unsplash.com/photos/clear-glass-cup-on-brown-wooden-table-sQopSb2K0CU | [Andrew Seaman](https://unsplash.com/@amseaman) | Unsplash License |

| `kiln-hands-on-wheel.jpg` | Kiln Ceramics cover; /work/ | https://unsplash.com/photos/person-making-clay-pot-with-clay-urvFvoiK1f4 | [Earl Wilcox](https://unsplash.com/@earl_plannerzone) | Unsplash License |

| `trench-coat-empty-street.jpg` | /work/ | https://unsplash.com/photos/woman-in-brown-coat-standing-on-road-during-daytime-w-83h_clkvI | [weston m](https://unsplash.com/@shootnmatch) | Unsplash License |

| `amber-dropper-window-shadow.jpg` | /work/ | https://unsplash.com/photos/brown-glass-bottle-on-white-table-b9KAwJRBXgw | [Kadarius Seegars](https://unsplash.com/@kseegars) | Unsplash License |

| `portrait-by-the-window.jpg` | /work/ | https://unsplash.com/photos/a-man-sitting-in-a-chair-looking-at-a-laptop-LfHnDDULNBY | [Richard Stachmann](https://unsplash.com/@stachmann) | Unsplash License |

| `camera-operator-warehouse.jpg` | /work/ | https://unsplash.com/photos/man-holding-camcorder-with-man-near-wall-9pRbuWJ6TvQ | [Jakob Owens](https://unsplash.com/@jakobowens1) | Unsplash License |

| `coffee-beans-sample-scoop.jpg` | /work/ | https://unsplash.com/photos/hand-holding-a-scoop-of-roasted-coffee-beans-tnilk4TohRQ | [Navid Abedi](https://unsplash.com/@inaveed) | Unsplash License |

| `film-set-firelight.jpg` | /work/ | https://unsplash.com/photos/a-couple-of-people-standing-in-front-of-a-camera-t5xk1J6zaH8 | [Oleg Brovchenko](https://unsplash.com/@olegbrovchenko) | Unsplash License |

| `photographer-in-studio.jpg` | Studio, portrait | https://unsplash.com/photos/man-in-black-t-shirt-holding-black-dslr-camera-UOBgu1hEj0o | [Colin Lloyd](https://unsplash.com/@onthesearchforpineapples) | Unsplash License |

| `on-set-fashion-shoot.jpg` | Home, how it works | https://unsplash.com/photos/a-photographer-taking-a-picture-of-a-woman-in-a-black-outfit-Qy-LgJuED0o | [Lana Mattice](https://unsplash.com/@lanamattice) | Unsplash License |

| `reviewing-takes-on-monitor.jpg` | Studio, second block | https://unsplash.com/photos/man-in-white-crew-neck-t-shirt-wearing-black-sunglasses-JbcOtH0W6UQ | [Gordon Cowie](https://unsplash.com/@gcowie) | Unsplash License |

| `studio-set-armchair.jpg` | Contact | https://unsplash.com/photos/a-white-chair-and-a-lamp-in-a-room-SIkG917dQ90 | [isaac macdonald](https://unsplash.com/@isaacmacdonald) | Unsplash License |

| `choosing-prints-table.jpg` | Rates | https://unsplash.com/photos/people-are-arranging-photos-on-a-table-7Q31yspx1tQ | [Vitaly Gariev](https://unsplash.com/@silverkblack) | Unsplash License |

| `area-shoreditch-high-street.jpg` | /brand-photographer/shoreditch/ (photo, share image) | https://unsplash.com/photos/man-walking-near-road-looking-up-kdbx8bXzKBk | [Sandro Cenni](https://unsplash.com/@sandrocenni) | Unsplash License |

| `area-soho-rain-reflection.jpg` | /brand-photographer/soho/ (photo, share image) | https://unsplash.com/photos/city-street-with-reflections-in-puddles-after-rain-4dhpODMJ4As | see source | Unsplash License |

| `area-kings-cross-coal-drops-yard.jpg` | /brand-photographer/kings-cross/ (photo, share image) | https://unsplash.com/photos/2SXbQFPrbnk | Marek Lumi | Unsplash License |

| `area-hackney-wick-graffiti-wall.jpg` | /brand-photographer/hackney/ (photo, share image) | https://unsplash.com/photos/K4FABOBPd98 | Josh Aarons | Unsplash License |

| `area-peckham-shopfront.jpg` | /brand-photographer/peckham/ (photo, share image) | https://unsplash.com/photos/person-standing-in-front-of-store-8wMflrTLm2g | Alistair MacRobert | Unsplash License |

| `area-manchester-foggy-street.jpg` | /brand-photographer/manchester/ (photo, share image) | https://unsplash.com/photos/a-street-filled-with-lots-of-traffic-on-a-foggy-day-1iuHFs5vW3I | Tuna Ekici | Unsplash License |

| `area-bristol-harbourside.jpg` | /brand-photographer/bristol/ (photo, share image) | https://unsplash.com/photos/julE5PYPHFI | Mikey Harris | Unsplash License |

| `area-edinburgh-old-town.jpg` | /brand-photographer/edinburgh/ (photo, share image) | https://unsplash.com/photos/vehicles-traveling-on-street-in-between-buildings-during-daytime-7EMiFX17Eeg | Carly Reeves | Unsplash License |

| `area-cotswolds-castle-combe.jpg` | /brand-photographer/cotswolds/ (photo, share image) | https://unsplash.com/photos/a-street-lined-with-old-stone-houses-under-a-blue-sky-SgqFUY7lT1o | George Ciobra | Unsplash License |

## Placeholder films

The clips in `public/films/` are stand-ins from [Pexels](https://www.pexels.com), free to use under the [Pexels License](https://www.pexels.com/license/). Replace them with the client's own films (or Vimeo/YouTube ids) before launch.

| File | Used on | Source | Author | Licence |
| --- | --- | --- | --- | --- |
| `kiln-ceramics.mp4` | Home film reel; /work/ (Kiln frame) | https://www.pexels.com/video/molding-a-clay-pot-using-pottery-wheel-9363336/ | Mikhail Nilov | Pexels License |
| `camera-operator-prep.mp4` | /work/ (camera operator frame) | https://www.pexels.com/video/a-cameraman-preparing-for-the-shooting-production-8089126/ | Ron Lach | Pexels License |
| `crew-on-set.mp4` | /work/ (crew on set frame) | https://www.pexels.com/video/a-videographer-and-director-shooting-a-production-8089118/ | Ron Lach | Pexels License |

## Enquiry form

Set `PUBLIC_FORM_ENDPOINT` in `.env` (and in the host's build env) to a form service URL that accepts `POST` with `Accept: application/json` (e.g. Formspree). Empty = the form opens the visitor's mail app (`mailto:`), which works but loses more enquiries.

## Site URL

Set `SITE_URL` (in `.env` locally, see `.env.example`, and in the host's build env) to the production domain, no trailing path. On Vercel it can stay empty: `astro.config.mjs` then uses the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`). It sets canonical URLs and Open Graph image URLs, and the sitemap (`/sitemap-index.xml`) and `robots.txt` take the domain from it too.

## Search

The demo is closed to search engines, AI crawlers and other robots (`site.indexable: false` in `src/data/site.ts`: `robots.txt` disallows everything and names the AI bots, every page has `noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai`, and the sitemap link is dropped). Set it to `true` at launch.

After launch, submit `https://<domain>/sitemap-index.xml` in Google Search Console. Check `/`, `/rates/` and an area page in Google's Rich Results Test.

## Deploy

Any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages): build command `npm run build`, output `dist/`. Set `PUBLIC_*` env vars as **build** variables (they are inlined at build time).
