// Client gallery selects (spec 006, slice 2): the message that lists the chosen photos and the small data
// blobs the gallery page and the contact form hand to the scripts. No DOM, so both pages share it.
// The copy and the gallery list come from src/data/client-galleries.ts, serialised into data attributes
// at build time (no images are shipped to the browser for this).

/** The copy the scripts need (a subset of gallerySelects in the data file). */
export interface SelectsCopy {
  counter: string;
  counterNone: string;
  over: string;
  overOne: string;
  filterSelects: string;
  message: string;
  photoOne: string;
  photoMany: string;
  mailSubject: string;
}

/** One gallery as the contact page needs it to check a shared link. */
export interface SelectsGallery {
  slug: string;
  // "Harbour & Co — Content day"
  shoot: string;
  // "14 October 2026"
  date: string;
  ids: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const text = (value: unknown): string | null => (typeof value === 'string' ? value : null);

/** Parses the copy blob; null when anything is missing, so the feature stays off rather than half-working. */
export function readSelectsCopy(json: string | undefined): SelectsCopy | null {
  try {
    const v: unknown = JSON.parse(json ?? 'null');
    if (!isRecord(v)) return null;
    const copy = {
      counter: text(v.counter),
      counterNone: text(v.counterNone),
      over: text(v.over),
      overOne: text(v.overOne),
      filterSelects: text(v.filterSelects),
      message: text(v.message),
      photoOne: text(v.photoOne),
      photoMany: text(v.photoMany),
      mailSubject: text(v.mailSubject),
    };
    const { counter, counterNone, over, overOne, filterSelects, message, photoOne, photoMany, mailSubject } = copy;
    if (counter === null || counterNone === null || over === null || overOne === null || filterSelects === null
      || message === null || photoOne === null || photoMany === null || mailSubject === null) return null;
    return { counter, counterNone, over, overOne, filterSelects, message, photoOne, photoMany, mailSubject };
  } catch {
    return null;
  }
}

/** Parses the gallery list of the contact form; malformed entries are skipped. */
export function readSelectsGalleries(json: string | undefined): SelectsGallery[] {
  try {
    const v: unknown = JSON.parse(json ?? '[]');
    if (!Array.isArray(v)) return [];
    const out: SelectsGallery[] = [];
    for (const item of v) {
      if (!isRecord(item)) continue;
      const { slug, shoot, date, ids } = item;
      if (typeof slug !== 'string' || typeof shoot !== 'string' || typeof date !== 'string' || !Array.isArray(ids)) continue;
      out.push({ slug, shoot, date, ids: ids.filter((id): id is string => typeof id === 'string') });
    }
    return out;
  } catch {
    return [];
  }
}

/** Fills {name} placeholders; a replacer function keeps "$" in the values literal. */
export function fillText(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => (key in values ? String(values[key]) : whole));
}

/** "My selects from Harbour & Co — Content day (14 October 2026): RH_0412, RH_0419 (2 photos)." */
export function selectsMessage(copy: SelectsCopy, shoot: string, date: string, ids: string[]): string {
  const count = ids.length === 1 ? copy.photoOne : fillText(copy.photoMany, { n: ids.length });
  return fillText(copy.message, { shoot, date, ids: ids.join(', '), count });
}

/** The ids of ?selects=, kept only when the gallery has them, once each, in gallery order. */
export function validSelects(gallery: SelectsGallery, param: string | null): string[] {
  const asked = new Set((param ?? '').split(',').map((id) => id.trim()));
  return gallery.ids.filter((id) => asked.has(id));
}
