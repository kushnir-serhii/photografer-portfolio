// Date helpers and the availability calendar's month model. Pure functions, no DOM: the Astro component
// renders the first month at build time with them and calendar.ts re-renders in the browser.
// Days are ISO strings (yyyy-mm-dd) handled in UTC, so a day never shifts with the visitor's time zone;
// only "today" comes from the local clock (localIsoDate).
import type { Availability } from '../data/site';

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const weekdayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Parses yyyy-mm-dd into a UTC date; null when malformed or not a real calendar day (2027-02-30). */
export function parseIsoDate(value: string | null | undefined): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  const real = date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
  return real ? date : null;
}

/** "12 June 2027" for an ISO date, or null when the date is invalid. */
export function formatDate(iso: string | null | undefined): string | null {
  const date = parseIsoDate(iso);
  return date ? dateFormat.format(date) : null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (y: number, m0: number, d: number) => `${y}-${pad(m0 + 1)}-${pad(d)}`;

/** Today in the local calendar (the visitor's, or the build machine's at build time). */
export function localIsoDate(now = new Date()): string {
  return isoOf(now.getFullYear(), now.getMonth(), now.getDate());
}

/* ---------- months as one number: year * 12 + month (0-based) ---------- */

/** 'yyyy-mm' → month index; null when malformed. */
export function parseMonth(value: string): number | null {
  const m = /^(\d{4})-(\d{2})$/.exec(value);
  if (!m) return null;
  const mo = Number(m[2]);
  return mo >= 1 && mo <= 12 ? Number(m[1]) * 12 + mo - 1 : null;
}

/** Month index of an ISO day (which must already be valid). */
export const monthOfIso = (iso: string) => Number(iso.slice(0, 4)) * 12 + Number(iso.slice(5, 7)) - 1;

/** "March 2027". */
export const monthLabel = (index: number) => monthFormat.format(new Date(Date.UTC(Math.floor(index / 12), index % 12, 1)));

export const daysInMonth = (index: number) => new Date(Date.UTC(Math.floor(index / 12), (index % 12) + 1, 0)).getUTCDate();

export const isoInMonth = (index: number, day: number) => isoOf(Math.floor(index / 12), index % 12, day);

/** Moves an ISO day by whole days (UTC, so no daylight-saving drift). */
export function shiftIso(iso: string, days: number): string {
  const date = parseIsoDate(iso) ?? new Date(0);
  date.setUTCDate(date.getUTCDate() + days);
  return isoOf(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/** 0 = Monday … 6 = Sunday. */
export const weekdayIndex = (iso: string) => ((parseIsoDate(iso)?.getUTCDay() ?? 1) + 6) % 7;

/* ---------- the calendar model ---------- */

export type DayState = 'free' | 'half' | 'booked' | 'past';

export interface CalendarDay {
  iso: string;
  day: number;
  state: DayState;
  // "Friday 12 March 2027, booked"
  label: string;
}

export interface MonthModel {
  index: number;
  label: string;
  // Mon-first weeks; null pads the days of the neighbouring months.
  weeks: (CalendarDay | null)[][];
  // No free or half day left in the month (everything booked or past).
  full: boolean;
}

/** The months that can be shown: from the later of `from` and today's month to the end of the data. */
export interface MonthRange {
  first: number;
  last: number;
}

/** null when the data is unusable or every listed month is already over. */
export function monthRange(data: Availability, today: string): MonthRange | null {
  const from = parseMonth(data.from);
  if (from === null || !Number.isInteger(data.months) || data.months < 1) return null;
  const last = from + data.months - 1;
  const first = Math.max(from, monthOfIso(today));
  return first <= last ? { first, last } : null;
}

export const canPick = (state: DayState) => state === 'free' || state === 'half';

export function dayState(iso: string, data: Availability, today: string): DayState {
  // ISO strings compare in calendar order.
  if (iso < today) return 'past';
  if (data.booked.includes(iso)) return 'booked';
  if (data.halfDay?.includes(iso)) return 'half';
  return 'free';
}

export function buildMonth(index: number, data: Availability, today: string, states: Record<DayState, string>): MonthModel {
  const total = daysInMonth(index);
  const cells: (CalendarDay | null)[] = Array.from({ length: weekdayIndex(isoInMonth(index, 1)) }, () => null);
  for (let day = 1; day <= total; day++) {
    const iso = isoInMonth(index, day);
    const state = dayState(iso, data, today);
    const date = parseIsoDate(iso);
    const name = date ? `${weekdayFormat.format(date)} ${dateFormat.format(date)}` : iso;
    cells.push({ iso, day, state, label: `${name}, ${states[state]}` });
  }
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const full = !cells.some((c) => c && canPick(c.state));
  return { index, label: monthLabel(index), weeks, full };
}

/** "Monday" … "Sunday", Mon-first, for the weekday header. */
export const weekdayNames = Array.from({ length: 7 }, (_, i) => weekdayFormat.format(new Date(Date.UTC(2024, 0, 1 + i))));
