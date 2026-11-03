// Areas and cities the studio works in: one static page each at /brand-photographer/<slug>/.
// Slugs are stable once published (they are URLs and the ?area= value on /contact/).
// Every photograph is an Unsplash placeholder (sources in docs/setup.md).
import type { ImageMetadata } from 'astro';
import type { FaqItem } from './site';
import shoreditchHighStreet from '../assets/work/area-shoreditch-high-street.jpg';
import sohoRainReflection from '../assets/work/area-soho-rain-reflection.jpg';
import kingsCrossCoalDropsYard from '../assets/work/area-kings-cross-coal-drops-yard.jpg';
import hackneyWickGraffitiWall from '../assets/work/area-hackney-wick-graffiti-wall.jpg';
import peckhamShopfront from '../assets/work/area-peckham-shopfront.jpg';
import manchesterFoggyStreet from '../assets/work/area-manchester-foggy-street.jpg';
import bristolHarbourside from '../assets/work/area-bristol-harbourside.jpg';
import edinburghOldTown from '../assets/work/area-edinburgh-old-town.jpg';
import cotswoldsCastleCombe from '../assets/work/area-cotswolds-castle-combe.jpg';

export type AreaSlug =
  | 'shoreditch'
  | 'soho'
  | 'kings-cross'
  | 'hackney'
  | 'peckham'
  | 'manchester'
  | 'bristol'
  | 'edinburgh'
  | 'cotswolds';

export type AreaRegion = 'london' | 'uk' | 'destination';

export const regionLabels: Record<AreaRegion, string> = {
  london: 'London',
  uk: 'UK cities',
  destination: 'Destinations',
};

export interface Area {
  slug: AreaSlug;
  name: string;
  region: AreaRegion;
  // Two or three sentences, first person: who I shoot for there, and what the place gives a picture.
  intro: string;
  // How travel works and who pays for it.
  travel: string;
  // Prices as shown, ex VAT (strings until spec 003 makes prices numeric).
  priceHint: string;
  // Kinds of places or named public places; never a business presented as a client.
  venues?: string[];
  faq?: FaqItem[];
  image: ImageMetadata;
  alt: string;
  // Optional CSS object-position for the wide crop, e.g. '50% 70%'.
  focus?: string;
  // Where the point sits on the schematic service-area map (spec 004 slice 3): the place's real
  // latitude and longitude (any map app shows them). London areas go in the London inset, the rest
  // on the country map; both fit themselves to the points, so new areas need no other change.
  // `label` moves the name to another side of the dot when two names would touch (default 'right').
  map: GeoPoint & { label?: MapLabelSide };
}

export interface GeoPoint {
  lat: number;
  lon: number;
}

export type MapLabelSide = 'left' | 'right' | 'above' | 'below';

const londonTravel = 'Inside the M25, so travel is included in every package.';
const londonPrice = 'Half day £950, full day £1,750, ex VAT.';
const ukPrice = 'Half day £950, full day £1,750, ex VAT, plus travel at cost.';

export const areas: Area[] = [
  {
    slug: 'shoreditch', name: 'Shoreditch', region: 'london',
    intro:
      "Most of my brand work happens within a mile of Shoreditch High Street. Studios, agencies and small labels here want pictures that look like the street they sit on: brick, shopfronts, people going somewhere. I know which corners get soft light in the morning and which yards stay quiet enough to shoot in.",
    travel: londonTravel,
    priceHint: londonPrice,
    venues: ['Redchurch Street shopfronts', 'The Old Truman Brewery yards', 'Railway arches on Bethnal Green Road', 'Your own office or studio'],
    faq: [
      {
        q: 'Do we need a permit to shoot on the street in Shoreditch?',
        a: 'Not for a small crew with handheld kit on a public pavement. Tripods, lights or anything that blocks the pavement need permission from Hackney or Tower Hamlets council, depending on the side of the street. I check before the day and tell you if we need it.',
      },
      {
        q: 'Can we shoot in our own office?',
        a: "Yes, most of my Shoreditch shoots are in the client's own space. I visit, or ask for a few phone photos, to check the light and the room, and bring what it takes to make a small office work.",
      },
    ],
    image: shoreditchHighStreet,
    alt: 'A man in a denim jacket looking up on a busy high street, a crate of flowers on a café table in front of him',
    map: { lat: 51.5246, lon: -0.0783 },
  },
  {
    slug: 'soho', name: 'Soho', region: 'london',
    intro:
      'Soho is restaurants, post-production houses and agencies packed into a few streets. Shoots here are about working small: a dining room before service, a team on a narrow staircase, a shopfront between deliveries. I plan around the early hours, when the streets are quiet and the light is clean.',
    travel: londonTravel,
    priceHint: londonPrice,
    venues: ['Dining rooms before service', 'Kingly Court and Carnaby Street', 'Golden Square', 'Agency and post-production offices'],
    faq: [
      {
        q: 'Can you shoot a restaurant before service?',
        a: 'Yes, that is when I prefer to. A half day from about 8am usually covers the room, the dishes and the team, and we are packed away before lunch prep gets busy.',
      },
      {
        q: 'Where do we park?',
        a: "We don't, if we can help it. I come by train with a small kit. For a bigger set-up I book a loading bay or a nearby car park and put the cost in the quote.",
      },
    ],
    image: sohoRainReflection,
    alt: 'A low view across a wet street, shopfronts and people reflected in a puddle',
    map: { lat: 51.5136, lon: -0.1365 },
  },
  {
    slug: 'kings-cross', name: "King's Cross", region: 'london',
    intro:
      "King's Cross is architects, tech offices and the restaurants around Granary Square and Coal Drops Yard. Glass, brick and wide paved squares that work for team portraits outside. The estate is privately managed, so I arrange permission for the squares before we book the day.",
    travel: londonTravel,
    priceHint: londonPrice,
    venues: ['Granary Square', 'Coal Drops Yard', "Regent's Canal towpath", 'Your office and meeting rooms'],
    image: kingsCrossCoalDropsYard,
    alt: 'A paved square with planted beds and benches, a person walking past brick buildings',
    map: { lat: 51.5347, lon: -0.1246 },
  },
  {
    slug: 'hackney', name: 'Hackney', region: 'london',
    intro:
      "Hackney Wick and the canal are roasters, breweries, makers and studios in old warehouses. The rooms are big, raw and often dark, which suits food and product work with some grit in it. I shot Fold Coffee's roastery here at six in the morning.",
    travel: londonTravel,
    priceHint: londonPrice,
    venues: ['Canal-side warehouses', "Hackney Wick's painted walls", 'Queen Elizabeth Olympic Park', "Makers' studios and workshops"],
    image: hackneyWickGraffitiWall,
    alt: 'A man in a cap and green jacket walking past a long graffiti wall',
    map: { lat: 51.5433, lon: -0.0225, label: 'left' },
  },
  {
    slug: 'peckham', name: 'Peckham', region: 'london',
    intro:
      "Peckham is restaurants, bars, small shops and a lot of colour. Railway arches, rooftops and bright shopfronts give brand work a warmth that is hard to fake in a studio. I photographed Saltroom's new menu here.",
    travel: londonTravel,
    priceHint: londonPrice,
    venues: ['Rye Lane shopfronts', 'Railway arches', 'Peckham Levels', 'Rooftops before opening'],
    image: peckhamShopfront,
    alt: 'A man in the doorway of a bright money-transfer shopfront with yellow and blue signs',
    map: { lat: 51.4740, lon: -0.0690 },
  },
  {
    slug: 'manchester', name: 'Manchester', region: 'uk',
    intro:
      'I shoot in Manchester for brands with a team or a shop in the north that want it to match their London work. The Northern Quarter, Ancoats and the old mills by the canals give brick, iron and big windows. Overcast light here is soft and even, which is kind to people.',
    travel:
      'Train from London Euston, about two hours. Travel is at cost and agreed in the quote; for a full day or an early start I stay the night before.',
    priceHint: ukPrice,
    venues: ['Northern Quarter', 'Ancoats mills and canals', 'Your office or shop'],
    faq: [
      {
        q: 'Is it worth bringing you up from London?',
        a: 'Often, if you want your northern pictures to match the rest. Travel and a night usually add £150–250. If you only need a few headshots, a local photographer may be better value, and I will tell you so.',
      },
      {
        q: 'Can we do two locations in one day?',
        a: 'Yes, if they are close. Two places in the city centre fit in a full day; further apart, I would plan two half days.',
      },
    ],
    image: manchesterFoggyStreet,
    alt: 'Cars with headlights on driving down a wide road that disappears into fog, bare trees on either side',
    map: { lat: 53.4808, lon: -2.2426 },
  },
  {
    slug: 'bristol', name: 'Bristol', region: 'uk',
    intro:
      'Bristol is food, independent brands and creative studios around the harbour. Painted terraces, the docks and old warehouses make easy, honest backdrops. I come down for half and full days, mostly for product and team work.',
    travel:
      'Train from London Paddington, about 1 hour 40. Travel is at cost and agreed in the quote; I stay over only if we start early.',
    priceHint: ukPrice,
    venues: ['Harbourside and Wapping Wharf', 'Stokes Croft', 'Studios in old warehouses'],
    image: bristolHarbourside,
    alt: 'A row of colourful terraced houses above the harbour at dusk, boats and their reflections on the water',
    map: { lat: 51.4545, lon: -2.5879 },
  },
  {
    slug: 'edinburgh', name: 'Edinburgh', region: 'uk',
    intro:
      'Edinburgh is for brands that need Scotland in the picture: distilleries, hotels, makers and the agencies in Leith. Stone streets, steep closes and light that changes by the hour, so I plan every shoot here with spare time for the weather.',
    travel:
      "Train from London King's Cross, about four and a half hours, or a short flight. Travel and a night's stay are at cost and agreed in the quote.",
    priceHint: ukPrice,
    venues: ['Old Town closes', 'Leith Shore', 'Stockbridge'],
    image: edinburghOldTown,
    alt: 'Looking down a narrow street between tall stone buildings, cars and buses on the road below',
    focus: '50% 62%',
    map: { lat: 55.9533, lon: -3.1883 },
  },
  {
    slug: 'cotswolds', name: 'the Cotswolds', region: 'destination',
    intro:
      'The Cotswolds are where London brands go for countryside: homeware, fashion and food in stone villages, farm shops and rented houses. It is a full-day job with a night before, so the morning light is ours.',
    travel:
      "A destination shoot, about two hours by car from London. Travel and one night's stay are at cost and agreed in the quote.",
    priceHint: ukPrice,
    venues: ['Castle Combe and Bibury', 'Rented country houses', 'Farm shops and kitchens'],
    faq: [
      {
        q: 'Do we need permission to shoot in a village?',
        a: "For a small crew on a public road, usually not, but people live there. In places like Castle Combe I let the parish council know and avoid weekends. On private land we need the owner's written permission, and I sort it before the day.",
      },
      {
        q: 'What if it rains?',
        a: 'We agree a back-up in the quote: a room indoors nearby, or a second date. Light rain often helps. If we decide 48 hours ahead, moving the day costs nothing.',
      },
    ],
    image: cotswoldsCastleCombe,
    alt: 'A village road lined with honey-coloured stone cottages under a blue sky',
    map: { lat: 51.8330, lon: -1.8433 },
  },
];

// Copy for /brand-photographer/<slug>/. {name} is the area's name, {region} its region label.
export const areaPage = {
  eyebrow: 'Where I work — {region}',
  title: 'Brand photographer in {name}',
  description:
    'Brand and commercial photographer in {name}: recent work, travel, prices and how to book a shoot there. {price}',
  breadcrumb: {
    label: 'Breadcrumb',
    home: 'Home',
    parent: { label: 'Studio', href: '/studio/' },
  },
  workTitle: 'Shot in {name}',
  // Under the title when fewer than three local projects are padded with recent work from elsewhere.
  workMore: 'Then recent work from elsewhere.',
  emptyTitle: 'Recent work',
  empty: 'No project from {name} on the site yet. Here is recent work from elsewhere.',
  allWork: 'All work',
  projectCta: 'See the project',
  detailsTitle: 'Travel, price and places',
  detailsCta: 'See all rates',
  travelLabel: 'Travel',
  priceLabel: 'Price',
  venuesLabel: 'Where I shoot',
  faqEyebrow: 'Questions',
  faqTitle: 'Shooting in {name}',
  cta: {
    eyebrow: 'Next',
    title: 'Planning a shoot in {name}?',
    primary: 'Send a brief',
    call: 'or call / WhatsApp',
    meta: 'Every brief answered within two working days',
  },
};

// The "Where I work" section on /studio/ and the footer column: a schematic map plus a grouped list.
export const serviceArea = {
  eyebrow: 'Where I work',
  title: 'London first, the rest of the UK when the work calls',
  lead: 'Travel inside the M25 is included in every package. Further out, travel is at cost and agreed in the quote.',
  listLabel: 'Areas and cities',
  footerTitle: 'Where I work',
  // The map: the country around the cities, and an inset for the areas inside the home city.
  map: {
    countryCaption: 'Great Britain',
    home: { name: 'London', ring: 'M25', caption: 'Inside the M25: travel included' },
    // A river through the home inset, drawn from these points (west to east); leave empty for none.
    river: {
      name: 'Thames',
      points: [
        { lat: 51.468, lon: -0.214 },
        { lat: 51.482, lon: -0.168 },
        { lat: 51.486, lon: -0.127 },
        { lat: 51.502, lon: -0.121 },
        { lat: 51.509, lon: -0.104 },
        { lat: 51.507, lon: -0.077 },
        { lat: 51.503, lon: -0.052 },
        { lat: 51.508, lon: -0.030 },
        { lat: 51.500, lon: -0.024 },
        { lat: 51.486, lon: -0.012 },
        { lat: 51.494, lon: 0.006 },
        { lat: 51.508, lon: 0.008 },
        { lat: 51.503, lon: 0.050 },
        { lat: 51.495, lon: 0.080 },
      ] satisfies GeoPoint[],
    },
    note: 'Schematic, not to scale',
  },
};

// The name as a label on its own (breadcrumbs, lists): "the Cotswolds" -> "The Cotswolds".
export function areaLabel(area: Area): string {
  return area.name.charAt(0).toUpperCase() + area.name.slice(1);
}

// Fills {name}, {region} and {price} in an areaPage template; a name at the start of a sentence gets a capital.
export function areaText(template: string, area: Area): string {
  return template
    .replace(/(^|[.:?!]\s+)\{name\}/g, (_m, lead: string) => lead + areaLabel(area))
    .replace(/\{name\}/g, area.name)
    .replace(/\{region\}/g, regionLabels[area.region])
    .replace(/\{price\}/g, area.priceHint);
}
