// Site content. Every photograph in src/assets/work is an Unsplash placeholder (sources in
// docs/setup.md): replace them with the photographer's own work before launch.
import type { ImageMetadata } from 'astro';
import heroTeamPortraitStudio from '../assets/work/hero-team-portrait-studio.jpg';
import foldCoffeeRoaster from '../assets/work/fold-coffee-roaster.jpg';
import marlowFinchStreetCoat from '../assets/work/marlow-finch-street-coat.jpg';
import orielAmberBottleMarble from '../assets/work/oriel-amber-bottle-marble.jpg';
import northlineHeadshotLaughing from '../assets/work/northline-headshot-laughing.jpg';
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
  cta: string;
}

export const projects: Project[] = [
  {
    slug: 'fold-coffee', client: 'Fold Coffee', title: 'A roastery at six in the morning',
    sector: 'food', month: 'March', year: 2026, area: 'Hackney Wick',
    deliverables: ['Website', 'Menu boards', 'Social'], cta: 'See the project',
    image: foldCoffeeRoaster, alt: 'Roasted coffee beans pouring from a drum roaster into the cooling tray under a wall lamp',
  },
  {
    slug: 'marlow-finch', client: 'Marlow & Finch', title: 'Spring collection, shot on the street',
    sector: 'brand', month: 'April', year: 2026, area: 'Shoreditch',
    deliverables: ['Lookbook', 'Campaign', 'E-commerce'], cta: 'See the project',
    image: marlowFinchStreetCoat, alt: 'A woman in a black coat and sunglasses standing in a cobbled street lined with parked cars',
  },
  {
    slug: 'oriel-skincare', client: 'Oriel Skincare', title: 'Glass, water and one good window',
    sector: 'product', month: 'February', year: 2026, area: 'Clerkenwell',
    deliverables: ['Packshots', 'Launch campaign'], cta: 'See the project',
    image: orielAmberBottleMarble, alt: 'An amber glass dropper bottle on a marble table against a plain grey wall',
  },
  {
    slug: 'northline-architects', client: 'Northline Architects', title: 'Twenty-four people, one afternoon',
    sector: 'portraits', month: 'January', year: 2026, area: "King's Cross",
    deliverables: ['Team headshots', 'About page'], cta: 'See the project',
    image: northlineHeadshotLaughing, alt: 'A woman in a checked shirt laughing towards the camera against a dark grey backdrop',
  },
  {
    slug: 'saltroom', client: 'Saltroom', title: 'A new menu and a long table',
    sector: 'food', month: 'November', year: 2025, area: 'Peckham',
    deliverables: ['Menu', 'Press kit'], cta: 'See the project',
    image: saltroomLongTable, alt: 'A long restaurant table laid with glasses and napkins, running towards a bright front window',
  },
  {
    slug: 'kiln-ceramics', client: 'Kiln Ceramics', title: 'Hands, clay and the kiln opening',
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
  { src: orielAmberBottleMarble, alt: 'An amber glass dropper bottle on a marble table against a plain grey wall', size: 'default', category: 'product' },
  { src: northlineHeadshotLaughing, alt: 'A woman in a checked shirt laughing towards the camera against a dark grey backdrop', size: 'default', category: 'portraits' },
  { src: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel', size: 'default', category: 'film' },
  { src: portraitByTheWindow, alt: 'A bearded man in a dark room, lit from the side by a tall window', size: 'half', category: 'portraits' },
  { src: cameraOperatorWarehouse, alt: 'A camera operator checking the monitor of a cinema camera beside an actor in a warehouse', size: 'half', category: 'film' },
  { src: amberDropperWindowShadow, alt: 'An amber dropper bottle on a wooden stand, striped by shadows from a window', size: 'tall', category: 'product' },
  { src: foldCoffeeRoaster, alt: 'Roasted coffee beans pouring from a drum roaster into the cooling tray under a wall lamp', size: 'wide', category: 'food' },
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
  // Shown after the price, e.g. "per person, min. 5".
  unit?: string;
  items: string[];
  // Licence terms included in the price.
  usage: string;
  featured?: boolean;
}

// Placeholder prices, ex VAT.
export const plans: Plan[] = [
  {
    no: '01', name: 'Half day', price: '£950',
    items: ['Four hours on location or in studio', 'About 40 edited images', 'First edit in five working days'],
    usage: '12 months, web and social',
  },
  {
    no: '02', name: 'Full day', price: '£1,750', featured: true,
    items: ['Eight hours, up to three set-ups', 'About 80 edited images', 'Shot list planned with you'],
    usage: '12 months, web and social',
  },
  {
    no: '03', name: 'Headshots', price: '£120', unit: 'per person, min. 5',
    items: ['On site at your office', 'Two retouched images each', 'Matching light for the whole team'],
    usage: '12 months, web and social',
  },
];

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
