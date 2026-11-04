// Client gallery (demo, spec 006): the code screen on /clients/ and the photo viewer on /clients/<slug>/.
// initClientGallery() is called from site.ts on astro:page-load; both live inside <main>.
// The code check runs in the browser against codes in the page: a demo, not protection (the page says so).
import { navigate } from 'astro:transitions/client';
import { fillText, readSelectsCopy, selectsMessage } from './gallery-selects';

export function initClientGallery() {
  document.querySelectorAll<HTMLFormElement>('form[data-gate]').forEach(wireGate);
  // The selects first: the viewer's own toggle follows them.
  const grid = document.querySelector<HTMLElement>('[data-cgallery]');
  const selects = grid ? wireSelects(grid) : null;
  document.querySelectorAll<HTMLDialogElement>('dialog[data-viewer]').forEach((d) => wireViewer(d, selects));
}

/* ---------- code screen ---------- */

const normalise = (code: string) => code.trim().toUpperCase();

/** Reads a code -> slug map from a data attribute; anything malformed is skipped. */
function readCodes(json: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const parsed: unknown = JSON.parse(json ?? '{}');
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      for (const [code, slug] of Object.entries(parsed)) {
        if (typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug)) map.set(normalise(code), slug);
      }
    }
  } catch {
    // Malformed data: no code opens a gallery; the error points to the email.
  }
  return map;
}

function wireGate(form: HTMLFormElement) {
  const input = form.querySelector<HTMLInputElement>('[data-gate-input]');
  const error = form.querySelector<HTMLElement>('[data-gate-error]');
  if (!input) return;
  const codes = readCodes(form.dataset.codes);
  const field = input.closest('.sh-field');

  // The form needs this script; the no-JS note gives way to it.
  form.hidden = false;
  const note = form.parentElement?.querySelector<HTMLElement>('[data-gate-nojs]');
  if (note) note.hidden = true;

  const setError = (on: boolean) => {
    field?.classList.toggle('sh-field--error', on);
    if (on) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
    if (error) error.hidden = !on;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const slug = codes.get(normalise(input.value));
    if (!slug) {
      // Hide first so a repeated wrong code is announced again.
      if (error) error.hidden = true;
      requestAnimationFrame(() => setError(true));
      input.focus();
      return;
    }
    setError(false);
    navigate(`/clients/${slug}/`);
  });
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid')) setError(false);
  });

  // Demo: the code on screen fills the field.
  form.querySelector<HTMLButtonElement>('[data-gate-fill]')?.addEventListener('click', (e) => {
    const code = e.currentTarget instanceof HTMLElement ? e.currentTarget.dataset.gateFill : undefined;
    if (!code) return;
    input.value = code;
    setError(false);
    input.focus();
  });
}

/* ---------- selects ---------- */

const positive = (value: string | undefined): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** What the viewer needs from the selects: the state of a photo and a way to change it. */
interface Selects {
  has(id: string): boolean;
  toggle(id: string): void;
  onChange(callback: () => void): void;
  /** The accessible name of a photo's mark ("Add to selects: <alt>"). */
  markLabel(alt: string): string;
}

type Filter = 'all' | 'selects';

/** The saved ids of a gallery; only ids that exist in it, anything else ignored. Storage may be blocked. */
function loadSelects(key: string, known: Set<string>): Set<string> {
  const chosen = new Set<string>();
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    if (Array.isArray(parsed)) {
      for (const id of parsed) if (typeof id === 'string' && known.has(id)) chosen.add(id);
    }
  } catch {
    // Unreadable or blocked: start with none.
  }
  return chosen;
}

function saveSelects(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Blocked or full: the selects live in memory until the page closes.
  }
}

function wireSelects(grid: HTMLElement): Selects | null {
  const scope = grid.closest('main') ?? document;
  const bar = scope.querySelector<HTMLElement>('[data-selects-bar]');
  const tools = scope.querySelector<HTMLElement>('[data-selects-tools]');
  const emptyBox = scope.querySelector<HTMLElement>('[data-selects-empty]');
  const count = bar?.querySelector<HTMLElement>('[data-selects-count]');
  const note = bar?.querySelector<HTMLElement>('[data-selects-note]');
  const send = bar?.querySelector<HTMLAnchorElement>('[data-selects-send]');
  const mail = bar?.querySelector<HTMLAnchorElement>('[data-selects-mail]');
  const hint = bar?.querySelector<HTMLElement>('[data-selects-hint]');
  const chipAll = tools?.querySelector<HTMLButtonElement>('[data-selects-filter="all"]');
  const chipSelects = tools?.querySelector<HTMLButtonElement>('[data-selects-filter="selects"]');
  if (!bar || !tools || !count || !note || !send || !mail || !chipAll || !chipSelects) return null;

  const copy = readSelectsCopy(bar.dataset.copy);
  const { slug = '', shoot = '', date = '', email = '', mark = '' } = bar.dataset;
  const included = positive(bar.dataset.included);
  if (!copy || !/^[a-z0-9-]+$/.test(slug) || !included) return null;

  // Every photo, in gallery order.
  const items = new Map<string, { item: HTMLElement; button: HTMLButtonElement }>();
  grid.querySelectorAll<HTMLButtonElement>('button[data-select-toggle]').forEach((button) => {
    const id = button.dataset.selectToggle;
    const item = button.closest<HTMLElement>('li');
    if (id && item) items.set(id, { item, button });
  });
  if (items.size === 0) return null;

  const key = `sh-fav-${slug}`;
  const chosen = loadSelects(key, new Set(items.keys()));
  let filter: Filter = 'all';
  const listeners: Array<() => void> = [];
  const ordered = () => Array.from(items.keys()).filter((id) => chosen.has(id));

  // A link with no target looks and reads as unavailable and points at the explanation.
  const setHref = (link: HTMLAnchorElement, href: string | null) => {
    if (href) {
      link.href = href;
      link.removeAttribute('aria-disabled');
      link.removeAttribute('aria-describedby');
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      if (hint) link.setAttribute('aria-describedby', hint.id);
    }
    link.classList.toggle('is-disabled', !href);
  };

  const render = () => {
    const ids = ordered();
    const n = ids.length;
    for (const [id, { item, button }] of items) {
      const on = chosen.has(id);
      button.setAttribute('aria-pressed', String(on));
      item.classList.toggle('is-selected', on);
      item.hidden = filter === 'selects' && !on;
    }
    chipAll.setAttribute('aria-pressed', String(filter === 'all'));
    chipSelects.setAttribute('aria-pressed', String(filter === 'selects'));
    chipSelects.textContent = fillText(copy.filterSelects, { n });
    const empty = filter === 'selects' && n === 0;
    grid.hidden = empty;
    if (emptyBox) emptyBox.hidden = !empty;

    count.textContent = n === 0 ? fillText(copy.counterNone, { included }) : fillText(copy.counter, { n, included });
    const extra = n - included;
    note.hidden = extra <= 0;
    note.textContent = extra > 0 ? fillText(extra === 1 ? copy.overOne : copy.over, { extra }) : '';
    setHref(send, n > 0 ? `/contact/?gallery=${encodeURIComponent(slug)}&selects=${ids.map(encodeURIComponent).join(',')}` : null);
    const body = n > 0 ? selectsMessage(copy, shoot, date, ids) : '';
    const subject = fillText(copy.mailSubject, { shoot });
    setHref(mail, n > 0 && email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : null);
    if (hint) hint.hidden = n > 0;
    listeners.forEach((cb) => cb());
  };

  const visibleButtons = () => Array.from(items.values()).filter((v) => !v.item.hidden).map((v) => v.button);

  const toggle = (id: string) => {
    if (!items.has(id)) return;
    // Under the Selects filter an unselected photo leaves the grid: keep keyboard focus nearby.
    const focused = document.activeElement;
    const at = focused instanceof HTMLButtonElement ? visibleButtons().indexOf(focused) : -1;
    if (chosen.has(id)) chosen.delete(id);
    else chosen.add(id);
    saveSelects(key, ordered());
    render();
    if (at >= 0 && focused instanceof HTMLElement && focused.closest('li')?.hidden) {
      const after = visibleButtons();
      (after[Math.min(at, after.length - 1)] ?? chipAll).focus();
    }
  };

  for (const [id, { button }] of items) button.addEventListener('click', () => toggle(id));
  chipAll.addEventListener('click', () => {
    filter = 'all';
    render();
  });
  chipSelects.addEventListener('click', () => {
    filter = 'selects';
    render();
  });
  emptyBox?.querySelector('[data-selects-reset]')?.addEventListener('click', () => {
    filter = 'all';
    render();
    chipAll.focus();
  });
  // An unavailable link does nothing.
  for (const link of [send, mail]) {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('aria-disabled') === 'true') e.preventDefault();
    });
  }

  // Reveal: all of this needs the script.
  tools.hidden = false;
  bar.hidden = false;
  items.forEach(({ button }) => (button.hidden = false));
  render();

  return {
    has: (id) => chosen.has(id),
    toggle,
    onChange: (callback) => {
      listeners.push(callback);
    },
    markLabel: (alt) => fillText(mark, { alt }),
  };
}

/* ---------- viewer ---------- */

interface ViewerFrame {
  link: HTMLAnchorElement;
  id: string;
  alt: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
}

/** A grid link with everything the viewer needs; null leaves it a plain link to the image. */
function readFrame(link: HTMLAnchorElement): ViewerFrame | null {
  const { id, srcset, width, height } = link.dataset;
  const src = link.getAttribute('href');
  if (!id || !src) return null;
  return {
    link,
    id,
    alt: link.querySelector('img')?.alt ?? '',
    src,
    srcset: srcset ?? '',
    width: positive(width),
    height: positive(height),
  };
}

// A horizontal move this long (px), and longer than it is tall, is a swipe.
const SWIPE = 48;

function wireViewer(dialog: HTMLDialogElement, selects: Selects | null) {
  const scope = dialog.closest('main') ?? document;
  const all = Array.from(scope.querySelectorAll<HTMLAnchorElement>('a[data-viewer-open]'))
    .map(readFrame)
    .filter((f): f is ViewerFrame => f !== null);
  const img = dialog.querySelector<HTMLImageElement>('[data-viewer-img]');
  const stage = dialog.querySelector<HTMLElement>('[data-viewer-stage]');
  const name = dialog.querySelector<HTMLElement>('[data-viewer-name]');
  const count = dialog.querySelector<HTMLElement>('[data-viewer-count]');
  const error = dialog.querySelector<HTMLElement>('[data-viewer-error]');
  const mark = dialog.querySelector<HTMLButtonElement>('[data-viewer-select]');
  if (!img || !stage || all.length === 0) return;
  const of = count?.dataset.of ?? 'of';
  // The photos the viewer steps through: those the grid shows when it opens (the Selects filter hides the rest).
  let frames = all;
  let index = 0;
  // Each show() bumps this, so a slow image never replaces a later one.
  let request = 0;

  const preload = (i: number) => {
    const f = frames[(i + frames.length) % frames.length];
    if (!f) return;
    const pre = new Image();
    pre.sizes = '100vw';
    if (f.srcset) pre.srcset = f.srcset;
    pre.src = f.src;
  };

  // The select mark follows the shown photo and the selects.
  function syncMark() {
    const f = frames[index];
    if (!mark || !selects || !f) return;
    mark.setAttribute('aria-pressed', String(selects.has(f.id)));
    mark.setAttribute('aria-label', selects.markLabel(f.alt));
  }
  if (mark && selects) {
    mark.hidden = false;
    mark.addEventListener('click', () => {
      const f = frames[index];
      if (f) selects.toggle(f.id);
    });
    selects.onChange(syncMark);
  }

  function show(i: number) {
    index = (i + frames.length) % frames.length;
    const f = frames[index];
    if (!f || !img) return;
    const mine = ++request;
    if (name) name.textContent = f.id;
    syncMark();
    if (count) count.textContent = `${index + 1} ${of} ${frames.length}`;
    if (error) error.hidden = true;
    img.classList.add('is-loading');

    // Load off-screen, then swap: the old photo stays until the new one is ready.
    const next = new Image();
    next.sizes = '100vw';
    if (f.srcset) next.srcset = f.srcset;
    next.src = f.src;
    next
      .decode()
      .then(() => {
        if (mine !== request) return;
        img.hidden = false;
        if (f.width && f.height) {
          img.width = f.width;
          img.height = f.height;
        }
        img.sizes = '100vw';
        img.srcset = f.srcset;
        img.src = f.src;
        img.alt = f.alt;
        img.classList.remove('is-loading');
      })
      .catch(() => {
        if (mine !== request) return;
        img.hidden = true;
        img.classList.remove('is-loading');
        if (error) error.hidden = false;
      });
    preload(index + 1);
    preload(index - 1);
  }

  all.forEach((f) => {
    f.link.addEventListener('click', (e) => {
      // Let modified clicks (new tab, download) open the image file.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      frames = all.filter((v) => !v.link.closest('li')?.hidden);
      const i = frames.indexOf(f);
      if (i < 0) return;
      img.removeAttribute('src');
      img.removeAttribute('srcset');
      img.alt = '';
      show(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-viewer-prev]')?.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-viewer-next]')?.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-viewer-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(index + 1);
    }
  });

  // Swipe left / right on the photo. Escape closes natively (the dialog's cancel).
  let start: { x: number; y: number; id: number } | null = null;
  let swiped = false;
  stage.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary) return;
    start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    swiped = false;
  });
  stage.addEventListener('pointerup', (e) => {
    if (!start || e.pointerId !== start.id) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(dy)) {
      swiped = true;
      show(dx < 0 ? index + 1 : index - 1);
    }
  });
  stage.addEventListener('pointercancel', () => (start = null));

  // A click on the empty space around the photo closes, as a backdrop would (not right after a swipe).
  dialog.addEventListener('click', (e) => {
    if (swiped) {
      swiped = false;
      return;
    }
    if (e.target === dialog || e.target === stage) dialog.close();
  });

  // Back to the photo last shown, in the grid.
  dialog.addEventListener('close', () => {
    request++;
    // Back to the photo last shown; if the Selects filter has hidden it meanwhile, to the filter.
    const link = frames[index]?.link;
    if (link && !link.closest('li')?.hidden) link.focus();
    else document.querySelector<HTMLElement>('[data-selects-filter][aria-pressed="true"]')?.focus();
  });
}
