// Client galleries (demo, spec 006). One mocked gallery a client opens with a code, and the copy of
// the code screen, the gallery page and the photo viewer. Shown only when site.demo is true: in a real
// build the galleries live in a gallery service or a private store (see docs/setup.md).
// The photographs reuse the /work/ placeholders (Unsplash, sources in docs/setup.md).
import type { ImageMetadata } from 'astro';
import heroTeamPortraitStudio from '../assets/work/hero-team-portrait-studio.jpg';
import northlineTeamReviewingPrints from '../assets/work/northline-team-reviewing-prints.jpg';
import northlineHeadshotLaughing from '../assets/work/northline-headshot-laughing.jpg';
import portraitByTheWindow from '../assets/work/portrait-by-the-window.jpg';
import studioSetArmchair from '../assets/work/studio-set-armchair.jpg';
import marlowFinchStreetCoat from '../assets/work/marlow-finch-street-coat.jpg';
import trenchCoatEmptyStreet from '../assets/work/trench-coat-empty-street.jpg';
import orielAmberDroppersWindowLight from '../assets/work/oriel-amber-droppers-window-light.jpg';
import amberDropperWindowShadow from '../assets/work/amber-dropper-window-shadow.jpg';
import coffeeBeansSampleScoop from '../assets/work/coffee-beans-sample-scoop.jpg';
import foldDrumRoasterFloor from '../assets/work/fold-drum-roaster-floor.jpg';
import saltroomLongTable from '../assets/work/saltroom-long-table.jpg';
import kilnHandsOnWheel from '../assets/work/kiln-hands-on-wheel.jpg';
import choosingPrintsTable from '../assets/work/choosing-prints-table.jpg';

export interface GalleryFrame {
  // The camera file name (RH_0412). Unique within a gallery; it is what a selection lists.
  id: string;
  src: ImageMetadata;
  alt: string;
}

export interface ClientGallery {
  // The URL: /clients/<slug>/. Stable once sent to a client.
  slug: string;
  // What the client types on /clients/. Matched case-insensitively, spaces trimmed.
  code: string;
  client: string;
  title: string;
  // The shoot day, yyyy-mm-dd.
  date: string;
  place: string;
  // Retouched frames included in the package; selects above it are quoted separately (slice 2).
  included: number;
  frames: GalleryFrame[];
}

export const clientGalleries: ClientGallery[] = [
  {
    slug: 'harbour-content-day',
    code: 'HALE-2027',
    client: 'Harbour & Co',
    title: 'Content day',
    date: '2026-10-14',
    place: 'Coal Drops Yard, London',
    included: 10,
    frames: [
      { id: 'RH_0412', src: heroTeamPortraitStudio, alt: 'Five people in black posing together on a bench in a photo studio, lit by a warm lamp, light stands around them' },
      { id: 'RH_0418', src: northlineTeamReviewingPrints, alt: 'Four colleagues leaning over a wooden table, talking through a spread of printouts' },
      { id: 'RH_0423', src: northlineHeadshotLaughing, alt: 'A woman in a checked shirt laughing towards the camera against a dark grey backdrop' },
      { id: 'RH_0431', src: portraitByTheWindow, alt: 'A bearded man in a dark room, lit from the side by a tall window' },
      { id: 'RH_0437', src: studioSetArmchair, alt: 'An empty studio set: a white armchair and a plant between two lamps on a grey backdrop' },
      { id: 'RH_0446', src: marlowFinchStreetCoat, alt: 'A woman in a black coat and sunglasses standing in a cobbled street lined with parked cars' },
      { id: 'RH_0452', src: trenchCoatEmptyStreet, alt: 'A woman in a beige trench coat standing in an empty city street at sunrise' },
      { id: 'RH_0460', src: orielAmberDroppersWindowLight, alt: 'Three amber dropper bottles on a white ledge, crossed by low window light and long shadows' },
      { id: 'RH_0467', src: amberDropperWindowShadow, alt: 'An amber dropper bottle on a wooden stand, striped by shadows from a window' },
      { id: 'RH_0471', src: coffeeBeansSampleScoop, alt: "A hand holding a roaster's sample scoop full of coffee beans against a dark background" },
      { id: 'RH_0484', src: foldDrumRoasterFloor, alt: 'A large drum roaster turning freshly roasted beans in its cooling tray on a roastery floor under hanging lamps' },
      { id: 'RH_0490', src: saltroomLongTable, alt: 'A long restaurant table laid with glasses and napkins, running towards a bright front window' },
      { id: 'RH_0503', src: kilnHandsOnWheel, alt: 'Clay-covered hands shaping a terracotta pot on a spinning wheel' },
      { id: 'RH_0511', src: choosingPrintsTable, alt: 'Two people laying out printed photographs and colour swatches on a dark table' },
    ],
  },
];

// "{email}" is replaced with site.email where it appears.
export const galleryGate = {
  title: 'Your gallery',
  description: 'Open your gallery with the code from my email.',
  eyebrow: 'Client galleries',
  lead: 'Type the code from my email and your photos open.',
  label: 'Gallery code',
  placeholder: 'HALE-0000',
  submit: 'Open my gallery',
  demoCode: 'Demo code:',
  error: "That code doesn't open a gallery. Check my email for it, or write to me at {email}.",
  noJs: "The gallery needs JavaScript to open. Turn it on, or write to me at {email} and I'll send you a link.",
  demoNote: 'Demo: a code screen, not real protection. In your site this connects to a gallery service or a private store.',
};

export const galleryPage = {
  eyebrow: 'Your gallery',
  shoot: 'Shoot',
  date: 'Date',
  place: 'Place',
  count: 'Photos',
  lead: 'Tap a photo to see it large. Use the arrows or swipe to move through the set.',
  back: 'Open another gallery',
  empty: "The photos aren't here yet. I'll email you as soon as they are; questions in the meantime to {email}.",
  foot: 'A question about a photo? Quote its file name and write to me at {email}.',
  demoNote: 'Demo: this page opens from its link, no code needed. It is not real protection; in your site the gallery lives in a gallery service or a private store.',
  // The cursor label over a photo.
  open: 'View',
};

// Selects (slice 2): the marks, the counter, the filter and the message that goes back to the photographer.
// Placeholders: {alt} {n} {included} {extra} {shoot} {date} {ids} {count}.
export const gallerySelects = {
  // The mark on a photo; the accessible name stays the same whether it is set or not (aria-pressed says it).
  mark: 'Add to selects: {alt}',
  barLabel: 'Your selects',
  filterLabel: 'Show',
  filterAll: 'All photos',
  filterSelects: 'Selects ({n})',
  // "7 of 10 included"
  counter: '{n} of {included} included',
  counterNone: 'No selects yet — {included} included',
  // Above the package: selecting more stays possible.
  over: "{extra} beyond your package — I'll quote them separately",
  overOne: "{extra} beyond your package — I'll quote it separately",
  emptyText: 'Nothing in your selects yet. Tap the + under a photo to pick it.',
  emptyAction: 'Show all photos',
  send: 'Send my selection',
  sendNone: 'Pick at least one photo, then you can send your selection.',
  email: 'or email them',
  // The message that fills the brief (and the email): "My selects from Harbour & Co — Content day (14 October 2026): RH_0412, RH_0419 (2 photos)."
  message: 'My selects from {shoot} ({date}): {ids} ({count}).',
  photoOne: '1 photo',
  photoMany: '{n} photos',
  mailSubject: 'My selects from {shoot}',
};
export type GallerySelectsCopy = typeof gallerySelects;

export const galleryViewer = {
  previous: 'Previous photo',
  next: 'Next photo',
  close: 'Close',
  // "3 of 14"
  of: 'of',
  error: "This photo didn't load. Try the next one, or close and open it again.",
};
