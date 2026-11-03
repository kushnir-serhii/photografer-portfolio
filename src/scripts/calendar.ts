// Availability calendar on /contact/ (AvailabilityCalendar.astro). initCalendar() runs on every
// astro:page-load from site.ts: the calendar lives in <main>, so nothing here is wired at module level.
// The component's static month stays as it is when the data attribute can't be read.
import type { Availability } from '../data/site';
import {
  buildMonth, canPick, dayState, daysInMonth, formatDate, isoInMonth, localIsoDate, monthOfIso, monthRange,
  parseIsoDate, shiftIso, weekdayIndex,
} from './dates';
import type { DayState, MonthRange } from './dates';
import { setBookingDate, setParam } from './booking';

interface CalendarCopy {
  states: Record<DayState, string>;
  picked: string;
}

interface CalendarConfig {
  data: Availability;
  copy: CalendarCopy;
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((s) => typeof s === 'string');

function readConfig(json: string | undefined): CalendarConfig | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json ?? '');
  } catch {
    return null;
  }
  if (!isRecord(parsed) || !isRecord(parsed.data) || !isRecord(parsed.copy)) return null;
  const { from, months, booked, halfDay } = parsed.data;
  const { states, picked } = parsed.copy;
  if (typeof from !== 'string' || typeof months !== 'number' || !isStringArray(booked)) return null;
  if (halfDay !== undefined && !isStringArray(halfDay)) return null;
  if (typeof picked !== 'string' || !isRecord(states)) return null;
  const { free, half, booked: bookedWord, past } = states;
  if (typeof free !== 'string' || typeof half !== 'string' || typeof bookedWord !== 'string' || typeof past !== 'string') return null;
  return {
    data: { from, months, booked, halfDay },
    copy: { states: { free, half, booked: bookedWord, past }, picked },
  };
}

export function initCalendar() {
  document.querySelectorAll<HTMLElement>('[data-calendar]').forEach((root) => {
    const config = readConfig(root.dataset.calendar);
    if (config) wireCalendar(root, config);
  });
}

function wireCalendar(root: HTMLElement, { data, copy }: CalendarConfig) {
  const body = root.querySelector<HTMLElement>('[data-cal-body]');
  const monthEl = root.querySelector<HTMLElement>('[data-cal-month]');
  const nav = root.querySelector<HTMLElement>('[data-cal-nav]');
  const prev = root.querySelector<HTMLButtonElement>('[data-cal-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-cal-next]');
  const grid = root.querySelector<HTMLTableElement>('[data-cal-grid]');
  const weeks = root.querySelector<HTMLTableSectionElement>('[data-cal-weeks]');
  const line = root.querySelector<HTMLElement>('[data-cal-line]');
  const fullText = root.querySelector<HTMLElement>('[data-cal-full]');
  const closedText = root.querySelector<HTMLElement>('[data-cal-closed]');
  const hint = root.querySelector<HTMLElement>('[data-cal-hint]');
  const status = root.querySelector<HTMLElement>('[data-cal-status]');
  const dateInput = document.querySelector<HTMLInputElement>('form[data-enquiry] input[name="preferred_date"]');
  if (!body || !monthEl || !nav || !prev || !next || !grid || !weeks || !line || !fullText || !closedText) return;

  const today = localIsoDate();
  const range: MonthRange | null = monthRange(data, today);

  // Every listed month is over: no grid, just the way out.
  if (!range) {
    body.hidden = true;
    fullText.hidden = true;
    closedText.hidden = false;
    line.hidden = false;
    return;
  }

  const firstIso = isoInMonth(range.first, 1);
  const lastIso = isoInMonth(range.last, daysInMonth(range.last));
  const inRange = (iso: string) => iso >= firstIso && iso <= lastIso;
  const stateOf = (iso: string) => dayState(iso, data, today);

  // ?date=2027-03-12 within the range opens that month, and selects the day when it can be picked.
  const wanted = new URLSearchParams(location.search).get('date');
  const wantedIso = wanted && parseIsoDate(wanted) && inRange(wanted) ? wanted : null;
  let selected: string | null = wantedIso && canPick(stateOf(wantedIso)) ? wantedIso : null;
  let view = wantedIso ? monthOfIso(wantedIso) : range.first;
  // The day that holds the grid's single tab stop (roving tabindex).
  let active = selected ?? '';

  /** The tab stop when a month opens: the selected day, today, the first day that can be picked, or the 1st. */
  const defaultActive = (index: number): string => {
    const model = buildMonth(index, data, today, copy.states);
    const days = model.weeks.flat().filter((d) => d !== null);
    return (days.find((d) => d.iso === selected) ?? days.find((d) => d.iso === today) ?? days.find((d) => canPick(d.state)) ?? days[0])?.iso ?? '';
  };

  const render = (focus: boolean) => {
    const model = buildMonth(view, data, today, copy.states);
    if (monthOfIso(active || '0000-00-00') !== view) active = defaultActive(view);

    monthEl.textContent = model.label;
    setStep(prev, view > range.first);
    setStep(next, view < range.last);

    weeks.replaceChildren(...model.weeks.map((week) => {
      const row = document.createElement('tr');
      week.forEach((d) => {
        const cell = document.createElement('td');
        if (d) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'sh-cal__day';
          button.dataset.state = d.state;
          button.dataset.iso = d.iso;
          button.textContent = String(d.day);
          button.setAttribute('aria-label', d.label);
          button.setAttribute('aria-pressed', String(d.iso === selected));
          button.tabIndex = d.iso === active ? 0 : -1;
          // Booked and past days stay focusable so their state can be read, but don't pick.
          if (!canPick(d.state)) button.setAttribute('aria-disabled', 'true');
          if (d.iso === today) button.setAttribute('aria-current', 'date');
          cell.append(button);
        }
        row.append(cell);
      });
      return row;
    }));

    fullText.hidden = false;
    closedText.hidden = true;
    line.hidden = !model.full;
    if (focus) dayButton(active)?.focus();
  };

  const setStep = (button: HTMLButtonElement, enabled: boolean) => {
    // aria-disabled, not disabled: a focused button that reaches the end of the range keeps focus.
    if (enabled) button.removeAttribute('aria-disabled');
    else button.setAttribute('aria-disabled', 'true');
  };

  const dayButton = (iso: string) => weeks.querySelector<HTMLButtonElement>(`button[data-iso="${iso}"]`) ?? null;

  const step = (by: number) => {
    const to = view + by;
    if (to < range.first || to > range.last) return;
    view = to;
    render(false);
  };

  /** Moves the tab stop to a day, switching months when it crosses one; days outside the range are ignored. */
  const moveTo = (iso: string) => {
    if (!inRange(iso)) return;
    active = iso;
    const month = monthOfIso(iso);
    if (month !== view) {
      view = month;
      render(true);
      return;
    }
    weeks.querySelectorAll<HTMLButtonElement>('button[data-iso]').forEach((b) => (b.tabIndex = b.dataset.iso === iso ? 0 : -1));
    dayButton(iso)?.focus();
  };

  const markSelected = () =>
    weeks.querySelectorAll<HTMLButtonElement>('button[data-iso]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.iso === selected)));

  const pick = (iso: string) => {
    const readable = formatDate(iso);
    if (!readable || !canPick(stateOf(iso))) return;
    selected = iso;
    active = iso;
    markSelected();
    setParam('date', iso);
    setBookingDate(iso);
    if (status) status.textContent = copy.picked.replace('{date}', readable);
    if (dateInput) {
      // Setting .value fires no input event, so ?date= set above stays.
      dateInput.value = readable;
      dateInput.focus();
    }
  };

  const clearPick = () => {
    selected = null;
    markSelected();
    setBookingDate(null);
    if (status) status.textContent = '';
  };

  weeks.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest<HTMLButtonElement>('button[data-iso]');
    if (!button?.dataset.iso || button.getAttribute('aria-disabled') === 'true') return;
    pick(button.dataset.iso);
  });

  weeks.addEventListener('keydown', (e) => {
    if (!(e.target instanceof Element)) return;
    const iso = e.target.closest<HTMLButtonElement>('button[data-iso]')?.dataset.iso;
    if (!iso || e.altKey || e.ctrlKey || e.metaKey) return;
    let to: string | null = null;
    switch (e.key) {
      case 'ArrowLeft': to = shiftIso(iso, -1); break;
      case 'ArrowRight': to = shiftIso(iso, 1); break;
      case 'ArrowUp': to = shiftIso(iso, -7); break;
      case 'ArrowDown': to = shiftIso(iso, 7); break;
      case 'Home': to = shiftIso(iso, -weekdayIndex(iso)); break;
      case 'End': to = shiftIso(iso, 6 - weekdayIndex(iso)); break;
      case 'PageUp':
      case 'PageDown': {
        const month = monthOfIso(iso) + (e.key === 'PageUp' ? -1 : 1);
        to = isoInMonth(month, Math.min(Number(iso.slice(8, 10)), daysInMonth(month)));
        break;
      }
      default: return;
    }
    e.preventDefault();
    // Home/End stop at the ends of the range instead of doing nothing.
    if ((e.key === 'Home' || e.key === 'End') && !inRange(to)) to = e.key === 'Home' ? firstIso : lastIso;
    moveTo(to);
  });

  prev.addEventListener('click', () => {
    if (prev.getAttribute('aria-disabled') !== 'true') step(-1);
  });
  next.addEventListener('click', () => {
    if (next.getAttribute('aria-disabled') !== 'true') step(1);
  });

  // A hand-typed date or a reset form no longer matches the picked day.
  dateInput?.addEventListener('input', clearPick);
  dateInput?.form?.addEventListener('reset', clearPick);

  grid.setAttribute('role', 'grid');
  body.hidden = false;
  nav.hidden = false;
  if (hint) hint.hidden = false;
  render(false);
}
