// Site behaviour on top of the Still Hours motion runtime.
import './still-hours.js';

type Runtime = { init(root?: ParentNode): unknown; theme: { get(): string } };
const runtime = (window as unknown as { StillHours?: Runtime }).StillHours;

// This module runs once; the ClientRouter swaps page content without a reload.
// The header and drawer persist across navigations, so they are wired here once,
// while everything inside <main> is wired again on every astro:page-load.

// The theme was restored inline before paint; bring the toggle labels in line with it.
if (runtime) {
  const id = runtime.theme.get();
  document.querySelectorAll('[data-theme-label]').forEach((l) => (l.textContent = id === 'night' ? 'Day' : 'Night'));
  document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(id === 'day')));
}

/* ---------- mobile drawer ---------- */

const drawer = document.querySelector<HTMLElement>('[data-drawer]');
const opener = document.querySelector<HTMLButtonElement>('[data-drawer-open]');
const closer = document.querySelector<HTMLButtonElement>('[data-drawer-close]');

function setDrawer(open: boolean) {
  if (!drawer || !opener) return;
  drawer.classList.toggle('is-open', open);
  drawer.inert = !open;
  opener.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('has-drawer', open);
  (open ? closer : opener)?.focus();
}

opener?.addEventListener('click', () => setDrawer(true));
closer?.addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer?.classList.contains('is-open')) setDrawer(false);
});
matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
  if (e.matches) setDrawer(false);
});
document.addEventListener('astro:before-swap', () => {
  if (drawer?.classList.contains('is-open')) setDrawer(false);
});

/* ---------- current nav item (the header is not re-rendered) ---------- */

function markCurrentNav() {
  const path = location.pathname.replace(/\/?$/, '/');
  document.querySelectorAll<HTMLAnchorElement>('.sh-nav__link, .sh-drawer__links a').forEach((link) => {
    if (new URL(link.href).pathname === path) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

document.addEventListener('astro:page-load', () => {
  runtime?.init(document);
  markCurrentNav();
  initGalleries();
  initEnquiryForms();
});

/* ---------- gallery filters ---------- */

function initGalleries() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
    const chips = gallery.querySelectorAll<HTMLButtonElement>('[data-filter]');
    const items = gallery.querySelectorAll<HTMLElement>('[data-category]');
    const empty = gallery.querySelector<HTMLElement>('[data-gallery-empty]');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.filter;
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        let shown = 0;
        items.forEach((item) => {
          const match = id === 'all' || item.dataset.category === id;
          item.hidden = !match;
          if (match) {
            item.classList.add('is-in');
            shown++;
          }
        });
        if (empty) empty.hidden = shown > 0;
      });
    });
  });
}

/* ---------- enquiry form ---------- */

function initEnquiryForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
    const success = form.querySelector<HTMLElement>('[data-form-success]');
    const failure = form.querySelector<HTMLElement>('[data-form-failure]');
    const endpoint = form.dataset.endpoint;

    function check(input: HTMLInputElement): boolean {
      const valid = input.type === 'checkbox' ? input.checked : input.value.trim() !== '' && input.checkValidity();
      const field = input.closest('.sh-field');
      const errId = input.getAttribute('aria-describedby');
      const err = errId ? document.getElementById(errId) : null;
      field?.classList.toggle('sh-field--error', !valid);
      if (valid) input.removeAttribute('aria-invalid');
      else input.setAttribute('aria-invalid', 'true');
      if (err) err.hidden = valid;
      return valid;
    }

    const required = Array.from(form.querySelectorAll<HTMLInputElement>('[required]'));
    required.forEach((input) =>
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'blur', () => {
        if (input.getAttribute('aria-invalid') || input.value) check(input);
      }),
    );

    form.addEventListener('submit', async (e) => {
      if (success) success.hidden = true;
      if (failure) failure.hidden = true;
      const results = required.map(check);
      const firstBad = required[results.indexOf(false)];
      if (firstBad) {
        e.preventDefault();
        firstBad.focus();
        return;
      }
      const data = new FormData(form);
      if (data.get('website')) {
        e.preventDefault();
        return;
      }
      // Without an endpoint the form falls back to the browser's mailto: handling.
      if (!endpoint) return;
      e.preventDefault();
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (button) button.disabled = true;
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        if (success) success.hidden = false;
      } catch {
        if (failure) failure.hidden = false;
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}
