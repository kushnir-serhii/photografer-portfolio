// Client gallery (demo, spec 006): the code screen on /clients/ and the photo viewer on /clients/<slug>/.
// initClientGallery() is called from site.ts on astro:page-load; both live inside <main>.
// The code check runs in the browser against codes in the page: a demo, not protection (the page says so).
import { navigate } from 'astro:transitions/client';

export function initClientGallery() {
  document.querySelectorAll<HTMLFormElement>('form[data-gate]').forEach(wireGate);
  document.querySelectorAll<HTMLDialogElement>('dialog[data-viewer]').forEach(wireViewer);
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

const positive = (value: string | undefined): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

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

function wireViewer(dialog: HTMLDialogElement) {
  const scope = dialog.closest('main') ?? document;
  const frames = Array.from(scope.querySelectorAll<HTMLAnchorElement>('a[data-viewer-open]'))
    .map(readFrame)
    .filter((f): f is ViewerFrame => f !== null);
  const img = dialog.querySelector<HTMLImageElement>('[data-viewer-img]');
  const stage = dialog.querySelector<HTMLElement>('[data-viewer-stage]');
  const name = dialog.querySelector<HTMLElement>('[data-viewer-name]');
  const count = dialog.querySelector<HTMLElement>('[data-viewer-count]');
  const error = dialog.querySelector<HTMLElement>('[data-viewer-error]');
  if (!img || !stage || frames.length === 0) return;
  const of = count?.dataset.of ?? 'of';
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

  function show(i: number) {
    index = (i + frames.length) % frames.length;
    const f = frames[index];
    if (!f || !img) return;
    const mine = ++request;
    if (name) name.textContent = f.id;
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

  frames.forEach((f, i) => {
    f.link.addEventListener('click', (e) => {
      // Let modified clicks (new tab, download) open the image file.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
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
    frames[index]?.link.focus();
  });
}
