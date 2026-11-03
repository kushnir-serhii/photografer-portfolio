// Site content. Every photograph in src/assets/work is an Unsplash placeholder (sources in
// docs/setup.md): replace them with the photographer's own work before launch.
import type { ImageMetadata } from 'astro';
import type { AreaSlug } from './areas';
import { formatPrice, priceText } from './format';
import type { FilmSource } from './film';
import heroTeamPortraitStudio from '../assets/work/hero-team-portrait-studio.jpg';
import foldDrumRoasterFloor from '../assets/work/fold-drum-roaster-floor.jpg';
import marlowFinchStreetCoat from '../assets/work/marlow-finch-street-coat.jpg';
import orielAmberDroppersWindowLight from '../assets/work/oriel-amber-droppers-window-light.jpg';
import northlineHeadshotLaughing from '../assets/work/northline-headshot-laughing.jpg';
import northlineTeamReviewingPrints from '../assets/work/northline-team-reviewing-prints.jpg';
import saltroomLongTable from '../assets/work/saltroom-long-table.jpg';
import kilnHandsOnWheel from '../assets/work/kiln-hands-on-wheel.jpg';
import trenchCoatEmptyStreet from '../assets/work/trench-coat-empty-street.jpg';
import amberDropperWindowShadow from '../assets/work/amber-dropper-window-shadow.jpg';
import portraitByTheWindow from '../assets/work/portrait-by-the-window.jpg';
import cameraOperatorWarehouse from '../assets/work/camera-operator-warehouse.jpg';
import coffeeBeansSampleScoop from '../assets/work/coffee-beans-sample-scoop.jpg';
import filmSetFirelight from '../assets/work/film-set-firelight.jpg';
import photographerInStudio from '../assets/work/photographer-in-studio.jpg';
import onSetFashionShoot from '../assets/work/on-set-fashion-shoot.jpg';
import reviewingTakesOnMonitor from '../assets/work/reviewing-takes-on-monitor.jpg';
import studioSetArmchair from '../assets/work/studio-set-armchair.jpg';
import choosingPrintsTable from '../assets/work/choosing-prints-table.jpg';

export const site = {
  name: 'Robin Hale',
  descriptor: 'Brand & commercial photography, London',
  city: 'London',
  description:
    'Robin Hale photographs brands, food, products and teams in London, for websites, campaigns and social.',
  email: 'hello@robinhale.studio',
  phone: '020 7946 0321',
  phoneHref: 'tel:+442079460321',
  // WhatsApp number in international form, digits only (no +, spaces or leading 0). Empty hides WhatsApp.
  whatsapp: '447700900321',
  // Facebook Messenger username for m.me links. Empty hides Messenger.
  messenger: '',
  instagram: 'https://instagram.com/',
  clientGalleries: '#',
  // The next bookable period; used in the hero, marquee and footer instead of a hard-coded date.
  season: 'January 2027',
  // Where the enquiry form posts (e.g. a Formspree endpoint). Set PUBLIC_FORM_ENDPOINT in .env.
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined,
  // Shows demo-only features and their labels; set false for a real client's site.
  demo: true,
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Studio', href: '/studio/' },
  { label: 'Rates', href: '/rates/' },
  { label: 'Contact', href: '/contact/' },
];

export type Category = 'brand' | 'food' | 'product' | 'portraits' | 'film';

export interface Project {
  slug: string;
  client: string;
  title: string;
  sector: Category;
  month: string;
  year: number;
  area: string;
  // The area page this project is listed on (/brand-photographer/<slug>/), when it was shot in one.
  areaSlug?: AreaSlug;
  deliverables: string[];
  image: ImageMetadata;
  alt: string;
  // Optional CSS object-position for the tight 4:5 slide on phones, e.g. '70% 50%'.
  focus?: string;
  cta: string;
}

export const projects: Project[] = [
  {
    slug: 'fold-coffee', client: 'Fold Coffee', title: 'A roastery at six in the morning',
    sector: 'food', month: 'March', year: 2026, area: 'Hackney Wick', areaSlug: 'hackney',
    deliverables: ['Website', 'Menu boards', 'Social'], cta: 'See the project',
    focus: '92% 50%',
    image: foldDrumRoasterFloor, alt: 'A large drum roaster turning freshly roasted beans in its cooling tray on a roastery floor under hanging lamps',
  },
  {
    slug: 'marlow-finch', client: 'Marlow & Finch', title: 'A new collection, shot on the street',
    sector: 'brand', month: 'April', year: 2026, area: 'Shoreditch', areaSlug: 'shoreditch',
    deliverables: ['Lookbook', 'Campaign', 'E-commerce'], cta: 'See the project',
    image: marlowFinchStreetCoat, alt: 'A woman in a black coat and sunglasses standing in a cobbled street lined with parked cars',
  },
  {
    slug: 'oriel-skincare', client: 'Oriel Skincare', title: 'Amber glass and one good window',
    sector: 'product', month: 'February', year: 2026, area: 'Clerkenwell',
    deliverables: ['Packshots', 'Launch campaign'], cta: 'See the project',
    image: orielAmberDroppersWindowLight, alt: 'Three amber dropper bottles on a white ledge, crossed by low window light and long shadows',
  },
  {
    slug: 'northline-architects', client: 'Northline Architects', title: 'A team, a table and one afternoon',
    sector: 'portraits', month: 'January', year: 2026, area: "King's Cross", areaSlug: 'kings-cross',
    deliverables: ['Team headshots', 'About page'], cta: 'See the project',
    image: northlineTeamReviewingPrints, alt: 'Four colleagues leaning over a wooden table, talking through a spread of printouts',
  },
  {
    slug: 'saltroom', client: 'Saltroom', title: 'A new menu and a long table',
    sector: 'food', month: 'November', year: 2025, area: 'Peckham', areaSlug: 'peckham',
    deliverables: ['Menu', 'Press kit'], cta: 'See the project',
    image: saltroomLongTable, alt: 'A long restaurant table laid with glasses and napkins, running towards a bright front window',
  },
  {
    slug: 'kiln-ceramics', client: 'Kiln Ceramics', title: 'Hands, clay and a slow wheel',
    sector: 'film', month: 'October', year: 2025, area: 'Walthamstow',
    deliverables: ['30-second film', 'Stills'], cta: 'See the project',
    image: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel',
  },
];

export type GallerySize = 'default' | 'tall' | 'wide' | 'half';

export interface Frame {
  src: ImageMetadata;
  alt: string;
  size: GallerySize;
  category: Category;
  // Id of a film in `films`: the frame plays it (film frames on /work/).
  film?: string;
}

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'brand', label: 'Brand' },
  { id: 'food', label: 'Food & hospitality' },
  { id: 'product', label: 'Product' },
  { id: 'portraits', label: 'Portraits & teams' },
  { id: 'film', label: 'Film' },
];

// Gallery on /work/. The grid packs without holes only for some orders of sizes (see docs/setup.md):
// this one is tall+wide, three defaults, two halves, tall+wide, three defaults (checked at 375px and 1280px).
export const frames: Frame[] = [
  { src: trenchCoatEmptyStreet, alt: 'A woman in a beige trench coat standing in an empty city street at sunrise', size: 'tall', category: 'brand' },
  { src: saltroomLongTable, alt: 'A long restaurant table laid with glasses and napkins, running towards a bright front window', size: 'wide', category: 'food' },
  { src: orielAmberDroppersWindowLight, alt: 'Three amber dropper bottles on a white ledge, crossed by low window light and long shadows', size: 'default', category: 'product' },
  { src: northlineHeadshotLaughing, alt: 'A woman in a checked shirt laughing towards the camera against a dark grey backdrop', size: 'default', category: 'portraits' },
  { src: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel', size: 'default', category: 'film', film: 'kiln-ceramics' },
  { src: portraitByTheWindow, alt: 'A bearded man in a dark room, lit from the side by a tall window', size: 'half', category: 'portraits' },
  { src: cameraOperatorWarehouse, alt: 'A camera operator checking the monitor of a cinema camera beside an actor in a warehouse', size: 'half', category: 'film', film: 'camera-operator' },
  { src: amberDropperWindowShadow, alt: 'An amber dropper bottle on a wooden stand, striped by shadows from a window', size: 'tall', category: 'product' },
  { src: foldDrumRoasterFloor, alt: 'A large drum roaster turning freshly roasted beans in its cooling tray on a roastery floor under hanging lamps', size: 'wide', category: 'food' },
  { src: marlowFinchStreetCoat, alt: 'A woman in a black coat and sunglasses standing in a cobbled street lined with parked cars', size: 'default', category: 'brand' },
  { src: coffeeBeansSampleScoop, alt: "A hand holding a roaster's sample scoop full of coffee beans against a dark background", size: 'default', category: 'food' },
  { src: filmSetFirelight, alt: 'A small film crew around a cinema camera in a firelit wooden room', size: 'default', category: 'film', film: 'crew-on-set' },
];

// ---------- films (home reel, film frames on /work/) ----------

export type { FilmSource };

export interface Film {
  // Stable id, used by Frame.film and filmReel.film.
  id: string;
  client: string;
  title: string;
  // Length shown on the poster, "0:23".
  duration: string;
  // Poster: one of the gallery photos. Nothing of the film loads until it is played.
  poster: ImageMetadata;
  alt: string;
  source: FilmSource;
}

// Demo clips are Pexels videos in public/films/ (720p, no sound; sources in docs/setup.md). For a client,
// swap in their own mp4 files (add `captions: '/films/name.vtt'` for a WebVTT track) or a Vimeo / YouTube id:
// `source: { type: 'vimeo', id: '76979871' }`.
export const films: Film[] = [
  {
    id: 'kiln-ceramics', client: 'Kiln Ceramics', title: 'Hands, clay and a slow wheel', duration: '0:23',
    poster: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel',
    source: { type: 'file', src: '/films/kiln-ceramics.mp4' },
  },
  {
    id: 'camera-operator', client: 'Behind the scenes', title: 'Lining up the first shot', duration: '0:25',
    poster: cameraOperatorWarehouse, alt: 'A camera operator checking the monitor of a cinema camera beside an actor in a warehouse',
    source: { type: 'file', src: '/films/camera-operator-prep.mp4' },
  },
  {
    id: 'crew-on-set', client: 'Behind the scenes', title: 'A small crew, one long day', duration: '0:37',
    poster: filmSetFirelight, alt: 'A small film crew around a cinema camera in a firelit wooden room',
    source: { type: 'file', src: '/films/crew-on-set.mp4' },
  },
];

// The reel on the home page. `film`: the id of the film it plays.
export const filmReel = {
  eyebrow: 'Film',
  title: 'Stills and film, one crew',
  lead: 'Short films for launches, websites and social, shot on the same day as the stills.',
  film: 'kiln-ceramics',
  play: 'Play film',
};

// Film frames in the /work/ gallery: the badge on the photograph and the dialog that plays them.
export const filmDialog = {
  badge: 'Film',
  close: 'Close film',
};

export interface Picture {
  src: ImageMetadata;
  alt: string;
}

// Photographs used by pages outside the work lists.
export const pictures = {
  howItWorks: { src: onSetFashionShoot, alt: 'A photographer crouching to shoot a model against a white backdrop in a loft studio, a camera operator beside him' },
  studioPortrait: { src: photographerInStudio, alt: 'A photographer in black raising a camera to his eye against a dark grey backdrop' },
  studioOnSet: { src: reviewingTakesOnMonitor, alt: 'Two crew members in caps reviewing a take on a camera monitor on set' },
  contact: { src: studioSetArmchair, alt: 'An empty studio set: a white armchair and a plant between two lamps on a grey backdrop' },
  rates: { src: choosingPrintsTable, alt: 'Two people laying out printed photographs and colour swatches on a dark table' },
} satisfies Record<string, Picture>;


// Stable ids used in URLs (?plan=full-day).
export type PlanId = 'half-day' | 'full-day' | 'headshots';

// A count the visitor can choose for a per-unit price. `one` / `many`: "person" / "people".
export interface Quantity {
  min: number;
  max: number;
  one: string;
  many: string;
}

export interface Plan {
  id: PlanId;
  no: string;
  name: string;
  // Ex VAT, in pounds; shown through formatPrice (src/data/format.ts).
  price: number;
  // Set when the price is per unit (headshots: per person) and the visitor picks how many.
  qty?: Quantity;
  // What the price buys, shown under it: "per shoot", "per person, min. 5".
  unit: string;
  items: string[];
  // Licence terms included in the price.
  usage: string;
  // How a client names this package in a message: "is 12 June 2027 free for {ask}?".
  ask: string;
  featured?: boolean;
}

// Placeholder prices, ex VAT.
export const plans: Plan[] = [
  {
    id: 'half-day', no: '01', name: 'Half day', price: 950, unit: 'per shoot',
    items: ['Four hours on location or in studio', 'About 40 edited images', 'First edit in five working days'],
    usage: '12 months, web and social', ask: 'a half day shoot',
  },
  {
    id: 'full-day', no: '02', name: 'Full day', price: 1750, unit: 'per shoot', featured: true,
    items: ['Eight hours, up to three set-ups', 'About 80 edited images', 'Shot list planned with you'],
    usage: '12 months, web and social', ask: 'a full day shoot',
  },
  {
    id: 'headshots', no: '03', name: 'Headshots', price: 120, unit: 'per person, min. 5',
    qty: { min: 5, max: 50, one: 'person', many: 'people' },
    items: ['On site at your office', 'Two retouched images each', 'Matching light for the whole team'],
    usage: '12 months, web and social', ask: 'team headshots',
  },
];

// Looks a package up by id for copy built from prices (marquee, descriptions, hints).
export function planPrice(id: PlanId): number {
  const plan = plans.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan.price;
}

// Details used only for schema.org structured data (src/data/schema.ts). No street address: fictional.
export const business = {
  region: 'Greater London',
  country: 'GB',
  // Ex VAT, from the cheapest to the dearest package: "£120–£1,750".
  priceRange: `${formatPrice(Math.min(...plans.map((p) => p.price)))}–${formatPrice(Math.max(...plans.map((p) => p.price)))}`,
};

// ---------- quick contact (the "Call or message" dialog) ----------

export const quickContact = {
  title: 'Call or message',
  lead: 'Calls Mon–Fri, 9–6. Messages any time; I reply the same day.',
  // Opener labels: header, drawer and hero; under each package; the phone icon button on phones.
  opener: 'Call or message',
  planOpener: 'or call / WhatsApp',
  iconLabel: 'Call or message',
  close: 'Close',
  call: 'Call',
  whatsapp: 'WhatsApp',
  whatsappDetail: 'Pre-written message',
  email: 'Email',
  messenger: 'Messenger',
  messengerDetail: 'Message on Facebook',
  brief: 'Send a brief',
  briefDetail: 'The full form, about two minutes',
  // The WhatsApp message, pre-written from what the visitor has chosen. {date}: "12 June 2027"; {plan}: Plan.ask.
  whatsappText: {
    both: 'Hi Robin, is {date} free for {plan}?',
    plan: "Hi Robin, I'd like to ask about {plan}. Which dates are free?",
    date: 'Hi Robin, is {date} free for a shoot?',
    none: "Hi Robin, I'd like to ask about a shoot.",
    // The same four with an area (from an area page or ?area=). {area}: Area.name, "Shoreditch" or "the Cotswolds".
    bothArea: 'Hi Robin, is {date} free for {plan} in {area}?',
    planArea: "Hi Robin, I'd like to ask about {plan} in {area}. Which dates are free?",
    dateArea: 'Hi Robin, is {date} free for a shoot in {area}?',
    noneArea: "Hi Robin, I'd like to ask about a shoot in {area}. Which dates are free?",
    // Added to any of the eight when the visitor built a quote on /rates/. {quote}: the summary, "Full day, extra hour ×2 — £2,150 ex VAT".
    quote: ' My quote from your site: {quote}.',
  },
};

// ---------- availability calendar (/contact/) ----------

export interface Availability {
  // First month shown, 'yyyy-mm'. The calendar starts at the later of this and the visitor's current month.
  from: string;
  // How many months from `from` can be browsed.
  months: number;
  // ISO days (yyyy-mm-dd) that are taken. Any day not listed is free, weekends included.
  booked: string[];
  // ISO days with only half a day left; these can still be picked.
  halfDay?: string[];
}

// Demo dates. For a real client, keep this in step with their diary (or connect a calendar later, see docs/setup.md).
export const availability: Availability = {
  from: '2027-01',
  months: 4,
  booked: [
    '2027-01-06', '2027-01-07', '2027-01-13', '2027-01-14', '2027-01-15', '2027-01-20', '2027-01-27', '2027-01-28',
    '2027-02-03', '2027-02-04', '2027-02-09', '2027-02-10', '2027-02-11', '2027-02-17', '2027-02-18', '2027-02-24',
    '2027-02-25',
    '2027-03-01', '2027-03-02', '2027-03-03', '2027-03-04', '2027-03-05', '2027-03-09', '2027-03-10', '2027-03-11',
    '2027-03-12', '2027-03-16', '2027-03-17', '2027-03-18', '2027-03-19', '2027-03-23', '2027-03-24', '2027-03-25',
    '2027-03-26', '2027-03-30',
    '2027-04-01', '2027-04-07', '2027-04-08', '2027-04-14', '2027-04-15', '2027-04-21', '2027-04-22', '2027-04-28',
    '2027-04-29',
  ],
  halfDay: [
    '2027-01-11', '2027-01-22',
    '2027-02-01', '2027-02-15', '2027-02-26',
    '2027-03-08', '2027-03-22', '2027-03-31',
    '2027-04-06', '2027-04-20',
  ],
};

export const availabilityCopy = {
  title: 'Free days',
  hint: 'Pick a day and it goes straight into the brief.',
  // Shown only when site.demo is true.
  demoNote: 'Demo dates — in your site this shows your real calendar.',
  prev: 'Previous month',
  next: 'Next month',
  legendLabel: 'Legend',
  legend: { free: 'Free', half: 'Half day left', booked: 'Booked' },
  // Ends each day's accessible name: "Friday 12 March 2027, booked".
  states: { free: 'free', half: 'half day left', booked: 'booked', past: 'past' },
  // Announced after a pick. {date}: "12 June 2027".
  picked: '{date} added to the brief',
  // A month with no free day left, and the case where every listed month is over.
  // Each line ends with the two ways out: the brief form and the quick-contact dialog.
  full: 'Every day this month is taken. I keep a waiting list:',
  closed: 'I have not opened these months yet. Ask me directly:',
  briefLink: 'send a brief',
  or: 'or',
  callLink: 'call',
};

// ---------- /rates/ copy ----------

export type AddOnId = 'extra-usage' | 'retouching' | 'short-video' | 'extra-hour';

export interface AddOn {
  id: AddOnId;
  name: string;
  // Ex VAT, in pounds. Shown with priceText(price, { from: priceFrom, unit }): "from £300", "£25 per image".
  price: number;
  // The real price depends on the job: shown as "from £…".
  priceFrom?: boolean;
  // Shown after the price: "per image".
  unit?: string;
  // Set when the visitor picks how many (retouched images, extra hours).
  qty?: Quantity;
  detail?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const ratesPage = {
  title: 'Rates',
  description:
    `Brand and commercial photography rates in London: half day ${formatPrice(planPrice('half-day'))}, full day ${formatPrice(planPrice('full-day'))}, headshots ${formatPrice(planPrice('headshots'))} per person. Ex VAT, 12 months of web and social usage included.`,
  eyebrow: 'Rates — 2026 / 2027',
  heading: 'What it costs, plainly',
  lead: 'Three ways to book, the numbers in the open. Every price is ex VAT and includes 12 months of web and social usage, so you can get sign-off before you write.',
  note: 'Prices ex VAT · travel within the M25 included',
  faqEyebrow: 'Questions',
  faqTitle: 'Asked most often',
  // Not an add-on: it has no price to add up. Shown as a note in the calculator's total panel.
  travel: { name: 'Travel outside the M25', price: 'at cost' },
};

// Placeholder prices, ex VAT.
export const addOns: AddOn[] = [
  { id: 'extra-usage', name: 'Extra usage', price: 300, priceFrom: true, detail: 'Print, paid ads, out-of-home or longer terms' },
  { id: 'retouching', name: 'Extra retouching', price: 25, unit: 'per image', qty: { min: 1, max: 200, one: 'image', many: 'images' } },
  { id: 'short-video', name: 'Short video', price: 650, priceFrom: true, detail: 'A 30–60 second cut for social' },
  { id: 'extra-hour', name: 'Extra hour', price: 200, qty: { min: 1, max: 4, one: 'hour', many: 'hours' } },
];

// The words in a quote summary (src/data/quote.ts): "Full day, extra hour ×2 — from £2,400 ex VAT".
export interface QuoteCopy {
  for: string;
  from: string;
  exVat: string;
  times: string;
}

export const quoteCopy: QuoteCopy = { for: 'for', from: 'from', exVat: 'ex VAT', times: '×' };

// ---------- price calculator on /rates/ (src/components/PriceCalculator.astro) ----------

export const calculatorCopy = {
  eyebrow: 'Build a quote',
  title: 'Add it up yourself',
  lead: 'Pick a package, tick what you need on top and the total follows. Send it to me and the brief arrives already filled in.',
  planLegend: 'Package',
  addOnsLegend: 'Add-ons',
  // Stepper label and help: "How many people", "5 to 50 people". {min} / {max} / {many} come from Quantity.
  howMany: 'How many',
  range: '{min} to {max} {many}',
  // Stepper buttons' accessible names: "Fewer people", "More images".
  fewer: 'Fewer',
  more: 'More',
  panelTitle: 'Your quote',
  total: 'Total',
  // In front of a total that holds a "from" price: "From £2,800".
  totalFrom: 'From',
  travel: `Travel within the M25 included. ${ratesPage.travel.name}: ${ratesPage.travel.price}.`,
  written: 'I confirm every quote in writing before you book.',
  send: 'Send this to me',
  // The phone bar's shorter button.
  sendShort: 'Send this',
  // Shown instead of the live total when scripts are off.
  noJs: 'Every price here is ex VAT. Tell me what you need and I will send you a written quote.',
  noJsLink: 'Send a brief',
};

// "from £300", "£25 per image", "£200".
export function addOnPriceText(a: AddOn): string {
  return priceText(a.price, { from: a.priceFrom, unit: a.unit });
}

export const faq: FaqItem[] = [
  {
    q: 'What do usage rights mean, and what is included?',
    a: 'Usage is where and for how long you can publish the pictures. Every package includes 12 months on your website and social channels. Print, paid ads, out-of-home and longer terms are extra usage, quoted before you book. I keep the copyright; you never pay twice for the same use.',
  },
  {
    q: 'Do your prices include VAT?',
    a: 'No. Every price on this site is ex VAT; VAT is added at the standard rate on the invoice.',
  },
  {
    q: 'How do deposits work?',
    a: 'A 25% deposit holds the date. The balance is due on delivery of the final files.',
  },
  {
    q: 'Do you charge for travel?',
    a: 'Not within the M25. Further out, travel is charged at cost and agreed in the quote.',
  },
  {
    q: 'What if we need to reschedule or cancel?',
    a: 'You can move the shoot once, free, with 7 days’ notice. For later changes or a cancellation the deposit is kept.',
  },
  {
    q: 'How fast do the files arrive?',
    a: 'The first edit arrives within five working days, the final files within ten.',
  },
  {
    q: 'Can you shoot at our office? Do you have a studio?',
    a: 'Most shoots happen on location: your office, kitchen, shop or workshop. When a job needs a studio, I book a day-hire one and quote it at cost.',
  },
];

// ---------- /contact/ copy ----------

export interface NextStep {
  no: string;
  title: string;
  body: string;
}

export const contactPage = {
  title: 'Contact',
  description: 'Send Robin Hale a brief for a brand, food, product or team shoot in London. Every brief gets a reply and a quote within two working days.',
  eyebrow: 'Book a shoot',
  heading: 'Tell me about the shoot',
  lead: 'A few lines are enough. I reply within two working days with a quote and the dates I have free.',
  directTitle: 'Directly',
  directNote: `${site.city} · replies Mon–Fri`,
  nextTitle: 'What happens next',
  steps: [
    { no: '01', title: 'A reply', body: 'Within two working days, with a quote and the dates I have free.' },
    { no: '02', title: 'A call', body: 'Thirty minutes to agree the shot list, the location and where the pictures will be used.' },
    { no: '03', title: 'The booking', body: 'A short agreement and a 25% deposit, and the date is yours.' },
  ] satisfies NextStep[],
};

// Options for the "shoot type" field: the work categories without "Everything", plus "Not sure yet".
export const shootTypes: string[] = [
  ...categories.filter((c) => c.id !== 'all').map((c) => c.label),
  'Not sure yet',
];

export interface BudgetRange {
  label: string;
  // Upper bound, ex VAT. A total belongs to the first range whose `max` it does not exceed.
  max?: number;
  // The "no figure" option. Without `max` and not `notSure`, a range is open-ended ("£5,000+"):
  // it takes any total above the last bound. (Infinity is not JSON-safe, so open ends have no `max`.)
  notSure?: boolean;
}

// Options for the "budget" field, ex VAT.
export const budgetRanges: BudgetRange[] = [
  { label: 'Under £1,000', max: 1000 },
  { label: '£1,000–2,500', max: 2500 },
  { label: '£2,500–5,000', max: 5000 },
  { label: '£5,000+' },
  { label: 'Not sure yet', notSure: true },
];

export const enquiryForm = {
  namePlaceholder: 'Alex Morgan',
  companyPlaceholder: 'Saltroom',
  emailPlaceholder: 'alex@saltroom.co.uk',
  datePlaceholder: 'Week of 12 March',
  packageLabel: 'Package',
  packageNone: 'Not sure yet',
  packageChange: 'Change',
  // Link on the confirmation line back to the calculator, when the package comes with add-ons or a quantity.
  quoteEdit: 'Edit quote',
  dateHelp: 'A rough week is fine. Not fixed yet? Leave it empty.',
  briefPlaceholder: 'A spring menu launch, 12 dishes, at our place in Peckham. Pictures for the website and Instagram.',
  // Starts an empty brief when the visitor arrives from an area page (?area=). {area}: Area.name.
  briefArea: 'Shoot in {area}: ',
  briefHelp: 'What the pictures are for, where, and roughly how many.',
  consent: 'I agree that my details are used to answer this brief.',
  submit: 'Send the brief',
  success: 'Brief sent. I will reply within two working days.',
  failure: 'That did not go through. Write to me at',
};

export const hero = {
  image: heroTeamPortraitStudio,
  alt: 'Five people in black posing together on a bench in a photo studio, lit by a warm lamp, light stands around them',
  eyebrow: `${site.city} — brand & commercial — booking from ${site.season}`,
  title: 'Your brand, on its best day.',
  lead: "I'm Robin Hale. I photograph brands, food, products and teams for websites, campaigns and social — across London and wherever the work is.",
};

export const marquee: string[] = [
  `Booking from ${site.season}`,
  `Half day from ${formatPrice(planPrice('half-day'))}`,
  'Usage rights included',
  'First edit in five working days',
];

export interface TestimonialData {
  quote: string;
  by: string;
  role: string;
}

export const testimonial: TestimonialData = {
  quote: 'Robin understood the brief in one call and gave us a year of pictures in a single day.',
  by: 'Priya Shah',
  role: 'Head of Brand, Fold Coffee',
};

// ---------- home page copy ----------

export const intro = {
  title: 'Pictures your team will actually use.',
  lead:
    'For websites, menus, launches and the About page nobody has updated in years. I work with small brands and busy marketing teams: every shoot is planned around your brief, delivered in a week and licensed in plain English.',
};

export interface Step {
  title: string;
  text: string;
}

export const howItWorks: { eyebrow: string; title: string; steps: Step[] } = {
  eyebrow: 'How it works',
  title: 'From brief to files in two weeks',
  steps: [
    { title: 'The brief', text: 'You send what the pictures are for: a launch, a new menu, a website, a team page.' },
    { title: 'A 30-minute call', text: 'We agree the shot list, the locations and where the pictures will be used.' },
    { title: 'The shoot', text: 'Half a day or a full one, at your place or in a studio. I bring the light.' },
    { title: 'Delivery', text: 'First edit in five working days. Final files licensed for 12 months, web and social.' },
  ],
};

export const packagesIntro = {
  eyebrow: 'Rates',
  title: 'Prices in the open',
  lead: 'Ex VAT, usage included — so you can get sign-off before you write.',
};

export const closingCta = {
  eyebrow: 'Next',
  title: "Tell me what you're launching",
  cta: 'Book a shoot',
  meta: 'Every brief answered within two working days',
};

// ---------- index lists ----------

// One row of an IndexList: the home page maps sectors to it, /work/ maps projects.
export interface IndexRow {
  title: string;
  meta: string;
  href: string;
  image: ImageMetadata;
}

// Home page index: one row per work category, client names from its projects,
// preview from the first gallery frame in that category (falls back to a project cover).
export const sectorRows: IndexRow[] = categories.flatMap((c) => {
  if (c.id === 'all') return [];
  const id = c.id;
  const inSector = projects.filter((p) => p.sector === id);
  const image = frames.find((f) => f.category === id)?.src ?? inSector[0]?.image;
  if (!image) return [];
  return [{
    title: c.label,
    meta: inSector.length > 0 ? inSector.map((p) => p.client).join(' · ') : 'New work coming',
    href: `/work/?category=${id}`,
    image,
  }];
});

// /work/ index: every project, linking to its anchor in the gallery.
export const projectRows: IndexRow[] = projects.map((p) => ({
  title: p.title,
  meta: `${p.client} · ${p.area} · ${p.year}`,
  href: `/work/#${p.slug}`,
  image: p.image,
}));

// ---------- /work/ copy ----------

export const workPage = {
  eyebrow: 'Work — 2025 / 2026',
  title: 'Recent work for London brands',
  lead: 'Brand, food, product, team and film work for small brands and marketing teams. A selection of the last year; full sets on request.',
  projectsTitle: 'Projects',
  projectsLead: 'Who it was for, where we shot and what they got.',
  galleryNote: `${frames.length} frames · ${projects.length} projects · full sets on request`,
  galleryCta: 'Ask for a full set',
  emptyText: 'Nothing in this set yet.',
  emptyAction: 'See everything',
};

// ---------- /studio/ copy ----------

export const studioPage = {
  title: 'Studio',
  description: 'Robin Hale is a London brand and commercial photographer: one person with a camera and a small freelance crew when a job needs it.',
  eyebrow: 'Studio',
  heading: 'One person, one camera, a crew when the job needs it',
  lead: "I'm Robin. For ten years I've photographed brands in London: food, products, teams and the odd film.",
  about:
    'I work with small brands, restaurants, product makers, studios and in-house marketing teams. When a shoot needs more hands, a stylist, assistant or sound recordist from my freelance crew joins. You always deal with me.',
  principles: [
    { no: '01 — Planned', title: 'A shot list before the day', body: 'We agree every picture and where it will be used in a 30-minute call, so the day is spent shooting, not guessing.' },
    { no: '02 — Licensed', title: 'Usage in plain English', body: '12 months on web and social are included. Print, paid ads, out-of-home and longer terms are quoted as extra usage, before you commit.' },
    { no: '03 — Quick', title: 'First edit in five working days', body: 'Final files within ten. Web-sized and full-resolution JPG, with crops for social.' },
  ],
  marquee: ['No stock-looking smiles', 'No surprise licence fees', 'No three-week wait'],
  clients: {
    title: 'Who I work with',
    text: 'Small brands launching a range, restaurants with a new menu, makers who need packshots, studios and teams who need a website that looks like them.',
  },
  run: {
    title: 'How a shoot runs',
    steps: [
      { title: 'Brief', text: 'You tell me what the pictures are for and who will see them.' },
      { title: 'Call', text: 'Thirty minutes to agree the shot list, locations and usage.' },
      { title: 'Shot list', text: 'I send it in writing, with references, a few days ahead.' },
      { title: 'The day', text: 'I bring the light and keep to the list. You approve on a monitor as we go.' },
      { title: 'Edit', text: 'First edit in five working days, final files within ten.' },
    ],
    cta: 'See the rates',
  },
  gets: {
    title: 'What you get',
    items: [
      { label: 'Formats', text: 'Web-sized and full-resolution JPG, plus crops for social: 4:5 and 9:16.' },
      { label: 'Usage rights', text: '12 months, web and social, included. Print, paid ads, out-of-home and longer terms are quoted as extra usage.' },
      { label: 'Turnaround', text: 'First edit in five working days, final files within ten.' },
    ],
  },
};
