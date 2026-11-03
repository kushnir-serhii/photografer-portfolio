// Site content. Every photograph in src/assets/work is an Unsplash placeholder (sources in
// docs/setup.md): replace them with the photographer's own work before launch.
import type { ImageMetadata } from 'astro';
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
  instagram: 'https://instagram.com/',
  clientGalleries: '#',
  // The next bookable period; used in the hero, marquee and footer instead of a hard-coded date.
  season: 'January 2027',
  // Where the enquiry form posts (e.g. a Formspree endpoint). Set PUBLIC_FORM_ENDPOINT in .env.
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined,
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
    sector: 'food', month: 'March', year: 2026, area: 'Hackney Wick',
    deliverables: ['Website', 'Menu boards', 'Social'], cta: 'See the project',
    focus: '92% 50%',
    image: foldDrumRoasterFloor, alt: 'A large drum roaster turning freshly roasted beans in its cooling tray on a roastery floor under hanging lamps',
  },
  {
    slug: 'marlow-finch', client: 'Marlow & Finch', title: 'A new collection, shot on the street',
    sector: 'brand', month: 'April', year: 2026, area: 'Shoreditch',
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
    sector: 'portraits', month: 'January', year: 2026, area: "King's Cross",
    deliverables: ['Team headshots', 'About page'], cta: 'See the project',
    image: northlineTeamReviewingPrints, alt: 'Four colleagues leaning over a wooden table, talking through a spread of printouts',
  },
  {
    slug: 'saltroom', client: 'Saltroom', title: 'A new menu and a long table',
    sector: 'food', month: 'November', year: 2025, area: 'Peckham',
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
  { src: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel', size: 'default', category: 'film' },
  { src: portraitByTheWindow, alt: 'A bearded man in a dark room, lit from the side by a tall window', size: 'half', category: 'portraits' },
  { src: cameraOperatorWarehouse, alt: 'A camera operator checking the monitor of a cinema camera beside an actor in a warehouse', size: 'half', category: 'film' },
  { src: amberDropperWindowShadow, alt: 'An amber dropper bottle on a wooden stand, striped by shadows from a window', size: 'tall', category: 'product' },
  { src: foldDrumRoasterFloor, alt: 'A large drum roaster turning freshly roasted beans in its cooling tray on a roastery floor under hanging lamps', size: 'wide', category: 'food' },
  { src: marlowFinchStreetCoat, alt: 'A woman in a black coat and sunglasses standing in a cobbled street lined with parked cars', size: 'default', category: 'brand' },
  { src: coffeeBeansSampleScoop, alt: "A hand holding a roaster's sample scoop full of coffee beans against a dark background", size: 'default', category: 'food' },
  { src: filmSetFirelight, alt: 'A small film crew around a cinema camera in a firelit wooden room', size: 'default', category: 'film' },
];

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


export interface Plan {
  no: string;
  name: string;
  price: string;
  // What the price buys, shown under it: "per shoot", "per person, min. 5".
  unit: string;
  items: string[];
  // Licence terms included in the price.
  usage: string;
  featured?: boolean;
}

// Placeholder prices, ex VAT.
export const plans: Plan[] = [
  {
    no: '01', name: 'Half day', price: '£950', unit: 'per shoot',
    items: ['Four hours on location or in studio', 'About 40 edited images', 'First edit in five working days'],
    usage: '12 months, web and social',
  },
  {
    no: '02', name: 'Full day', price: '£1,750', unit: 'per shoot', featured: true,
    items: ['Eight hours, up to three set-ups', 'About 80 edited images', 'Shot list planned with you'],
    usage: '12 months, web and social',
  },
  {
    no: '03', name: 'Headshots', price: '£120', unit: 'per person, min. 5',
    items: ['On site at your office', 'Two retouched images each', 'Matching light for the whole team'],
    usage: '12 months, web and social',
  },
];

// ---------- /rates/ copy ----------

export interface AddOn {
  name: string;
  // Price as shown, ex VAT: "from £300", "£25 per image", "at cost".
  price: string;
  detail?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export const ratesPage = {
  title: 'Rates',
  description:
    'Brand and commercial photography rates in London: half day £950, full day £1,750, headshots £120 per person. Ex VAT, 12 months of web and social usage included.',
  eyebrow: 'Rates — 2026 / 2027',
  heading: 'What it costs, plainly',
  lead: 'Three ways to book, the numbers in the open. Every price is ex VAT and includes 12 months of web and social usage, so you can get sign-off before you write.',
  note: 'Prices ex VAT · travel within the M25 included',
  addOnsEyebrow: 'Add-ons',
  addOnsTitle: 'What clients usually add',
  addOnsNote: 'All ex VAT, quoted in writing before you book.',
  faqEyebrow: 'Questions',
  faqTitle: 'Asked most often',
};

export const addOns: AddOn[] = [
  { name: 'Extra usage', price: 'from £300', detail: 'Print, paid ads, out-of-home or longer terms' },
  { name: 'Extra retouching', price: '£25 per image' },
  { name: 'Short video', price: 'from £650', detail: 'A 30–60 second cut for social' },
  { name: 'Extra hour', price: '£200' },
  { name: 'Travel outside the M25', price: 'at cost' },
];

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

// Options for the "budget" field, ex VAT.
export const budgetRanges: string[] = ['Under £1,000', '£1,000–2,500', '£2,500–5,000', '£5,000+', 'Not sure yet'];

export const enquiryForm = {
  namePlaceholder: 'Alex Morgan',
  companyPlaceholder: 'Saltroom',
  emailPlaceholder: 'alex@saltroom.co.uk',
  datePlaceholder: 'Week of 12 March',
  dateHelp: 'A rough week is fine. Not fixed yet? Leave it empty.',
  briefPlaceholder: 'A spring menu launch, 12 dishes, at our place in Peckham. Pictures for the website and Instagram.',
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
  'Half day from £950',
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
