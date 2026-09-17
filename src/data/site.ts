// Site content. Every photograph in public/images is a generated placeholder:
// replace them with the photographer's own work before launch.

export const site = {
  name: 'Still Hours',
  description:
    'Wedding and family photographer in Poznań. We photograph the parts of a day nobody thinks to ask for.',
  email: 'hello@stillhours.co',
  phone: '+48 000 000 000',
  phoneHref: 'tel:+48000000000',
  instagram: 'https://instagram.com/',
  clientGalleries: '#',
  year: 2026,
  // Where the enquiry form posts (e.g. a Formspree endpoint). Set PUBLIC_FORM_ENDPOINT in .env.
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined,
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Studio', href: '/studio/' },
  { label: 'Rates', href: '/rates/' },
  { label: 'Contact', href: '/contact/' },
];

export interface Day {
  title: string;
  kind: string;
  month: string;
  place: string;
  venue: string;
  year: number;
  image: string;
  alt: string;
  cta: string;
}

export const days: Day[] = [
  {
    title: 'Ola & Piotr', kind: 'Wedding', month: 'June', place: 'Wielkopolska',
    venue: 'Barn · Poznań', year: 2026, cta: 'See the day',
    image: '/images/a-barn-outside-poznan.jpg', alt: 'A barn outside Poznań',
  },
  {
    title: 'The Nowaks at home', kind: 'Family', month: 'March', place: 'Wrocław',
    venue: 'Family · Wrocław', year: 2026, cta: 'See the session',
    image: '/images/a-sunday-at-home.jpg', alt: 'A Sunday at home',
  },
  {
    title: 'Two people, one witness', kind: 'Elopement', month: 'October', place: 'Dolomites',
    venue: 'Elopement · Dolomites', year: 2025, cta: 'See the day',
    image: '/images/an-elopement-at-dusk.jpg', alt: 'An elopement at dusk',
  },
  {
    title: 'One long table', kind: 'Wedding', month: 'August', place: 'Kraków',
    venue: 'Wedding · Kraków', year: 2025, cta: 'See the day',
    image: '/images/a-long-table-after-dark.jpg', alt: 'A long table after dark',
  },
];

export type GallerySize = 'default' | 'tall' | 'wide' | 'half';
export type Category = 'weddings' | 'families' | 'elopements' | 'film';

export interface Frame {
  src: string;
  alt: string;
  size: GallerySize;
  category: Category;
}

export const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'weddings', label: 'Weddings' },
  { id: 'families', label: 'Families' },
  { id: 'elopements', label: 'Elopements' },
  { id: 'film', label: 'Film' },
];

export const frames: Frame[] = [
  { src: '/images/morning-light.jpg', alt: 'Morning light', size: 'tall', category: 'weddings' },
  { src: '/images/ceremony-under-the-trees.jpg', alt: 'Ceremony under the trees', size: 'wide', category: 'weddings' },
  { src: '/images/rings-on-linen.jpg', alt: 'Rings on linen', size: 'default', category: 'film' },
  { src: '/images/grandmother-laughing.jpg', alt: 'Grandmother laughing', size: 'default', category: 'families' },
  { src: '/images/first-dance.jpg', alt: 'First dance', size: 'half', category: 'weddings' },
  { src: '/images/the-table-after-dark.jpg', alt: 'The table after dark', size: 'half', category: 'weddings' },
  { src: '/images/reading-a-letter.jpg', alt: 'Reading a letter', size: 'tall', category: 'elopements' },
  { src: '/images/children-in-the-garden.jpg', alt: 'Children in the garden', size: 'default', category: 'families' },
  { src: '/images/an-elopement-at-dusk.jpg', alt: 'Walking home', size: 'wide', category: 'elopements' },
];

export interface Plan {
  no: string;
  name: string;
  price: string;
  items: string[];
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    no: '01', name: 'Half day', price: '6 400 zł',
    items: ['Six hours of coverage', 'About 400 edited frames', 'Gallery in four weeks'],
  },
  {
    no: '02', name: 'Whole day', price: '9 800 zł', featured: true,
    items: ['Morning to the last song', 'About 800 edited frames', 'Engagement session included'],
  },
  {
    no: '03', name: 'Family', price: '1 200 zł',
    items: ['Ninety minutes, anywhere', 'About 60 edited frames', 'Print file for every image'],
  },
];
