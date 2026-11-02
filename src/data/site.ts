// Site content. Every photograph in public/images is a generated placeholder:
// replace them with the photographer's own work before launch.

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
  image: string;
  alt: string;
  cta: string;
}

// Images are placeholders until slice 2 replaces them.
export const projects: Project[] = [
  {
    slug: 'fold-coffee', client: 'Fold Coffee', title: 'A roastery at six in the morning',
    sector: 'food', month: 'March', year: 2026, area: 'Hackney Wick',
    deliverables: ['Website', 'Menu boards', 'Social'], cta: 'See the project',
    image: '/images/morning-light.jpg', alt: 'Early light falling across a table',
  },
  {
    slug: 'marlow-finch', client: 'Marlow & Finch', title: 'Spring collection, shot on the street',
    sector: 'brand', month: 'April', year: 2026, area: 'Shoreditch',
    deliverables: ['Lookbook', 'Campaign', 'E-commerce'], cta: 'See the project',
    image: '/images/a-sunday-at-home.jpg', alt: 'A figure in a bright room',
  },
  {
    slug: 'oriel-skincare', client: 'Oriel Skincare', title: 'Glass, water and one good window',
    sector: 'product', month: 'February', year: 2026, area: 'Clerkenwell',
    deliverables: ['Packshots', 'Launch campaign'], cta: 'See the project',
    image: '/images/rings-on-linen.jpg', alt: 'Small objects arranged on linen',
  },
  {
    slug: 'northline-architects', client: 'Northline Architects', title: 'Twenty-four people, one afternoon',
    sector: 'portraits', month: 'January', year: 2026, area: "King's Cross",
    deliverables: ['Team headshots', 'About page'], cta: 'See the project',
    image: '/images/grandmother-laughing.jpg', alt: 'A person laughing in natural light',
  },
  {
    slug: 'saltroom', client: 'Saltroom', title: 'A new menu and a long table',
    sector: 'food', month: 'November', year: 2025, area: 'Peckham',
    deliverables: ['Menu', 'Press kit'], cta: 'See the project',
    image: '/images/a-long-table-after-dark.jpg', alt: 'A long table lit after dark',
  },
  {
    slug: 'kiln-ceramics', client: 'Kiln Ceramics', title: 'Hands, clay and the kiln opening',
    sector: 'film', month: 'October', year: 2025, area: 'Walthamstow',
    deliverables: ['30-second film', 'Stills'], cta: 'See the project',
    image: '/images/an-elopement-at-dusk.jpg', alt: 'A figure walking at dusk',
  },
];

export type GallerySize = 'default' | 'tall' | 'wide' | 'half';

export interface Frame {
  src: string;
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

// Placeholder frames, remapped mechanically; slice 2 replaces them.
export const frames: Frame[] = [
  { src: '/images/morning-light.jpg', alt: 'Early light falling across a table', size: 'tall', category: 'food' },
  { src: '/images/ceremony-under-the-trees.jpg', alt: 'People gathered under tall trees', size: 'wide', category: 'brand' },
  { src: '/images/rings-on-linen.jpg', alt: 'Small objects arranged on linen', size: 'default', category: 'product' },
  { src: '/images/grandmother-laughing.jpg', alt: 'A person laughing in natural light', size: 'default', category: 'portraits' },
  { src: '/images/first-dance.jpg', alt: 'Two figures in motion, softly blurred', size: 'half', category: 'film' },
  { src: '/images/the-table-after-dark.jpg', alt: 'A table lit after dark', size: 'half', category: 'food' },
  { src: '/images/reading-a-letter.jpg', alt: 'A person reading by a window', size: 'tall', category: 'portraits' },
  { src: '/images/children-in-the-garden.jpg', alt: 'Figures in a green garden', size: 'default', category: 'brand' },
  { src: '/images/an-elopement-at-dusk.jpg', alt: 'A figure walking at dusk', size: 'wide', category: 'film' },
];

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
