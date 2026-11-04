// Booking flow: package and date prefill of the brief form from the URL, and the quick-contact dialog.
// initBooking() is called from site.ts on astro:page-load (the form lives inside <main>); the dialog
// persists across navigations, so it is wired once, at module level, at the bottom of this file.
// The date helpers live in dates.ts (no DOM), so the calendar component can use them at build time.
import { parseIsoDate, formatDate } from './dates';
import { budgetIndex, parseBuiltQuote, quoteQuery, quoteSummary, quoteTotal, type Quote } from '../data/quote';
import { readQuoteData } from './price-data';

export function setParam(name: string, value: string | null) {
  const url = new URL(location.href);
  if (value) url.searchParams.set(name, value);
  else url.searchParams.delete(name);
  history.replaceState(history.state, '', url);
}

/** Reads a slug -> name map from a data attribute; anything else gives an empty map. */
function readAreas(json: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const parsed: unknown = JSON.parse(json ?? '{}');
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      for (const [slug, name] of Object.entries(parsed)) if (typeof name === 'string') map.set(slug, name);
    }
  } catch {
    // Malformed data: no areas.
  }
  return map;
}

export function initBooking() {
  document.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
    const select = form.querySelector<HTMLSelectElement>('[data-plan-select]');
    const dateInput = form.querySelector<HTMLInputElement>('input[name="preferred_date"]');
    const choice = form.querySelector<HTMLElement>('[data-plan-choice]');
    const choiceText = form.querySelector<HTMLElement>('[data-plan-choice-text]');
    const change = form.querySelector<HTMLButtonElement>('[data-plan-change]');
    const params = new URLSearchParams(location.search);

    if (select) {
      const options = Array.from(select.options);
      const data = readQuoteData(form.dataset.quoteData);
      const quoteField = form.querySelector<HTMLInputElement>('[data-quote-field]');
      const editWrap = form.querySelector<HTMLElement>('[data-quote-edit-wrap]');
      const editLink = form.querySelector<HTMLAnchorElement>('[data-quote-edit]');
      const budget = form.querySelector<HTMLSelectElement>('select[name="budget"]');
      const defaultBudget = Math.max(0, Array.from(budget?.options ?? []).findIndex((o) => o.defaultSelected));

      // The add-ons and the plan quantity from the address, kept in memory so that switching the package
      // back and forth does not lose them. "Not sure yet" clears them (there is no package to quote).
      const raw: { qty: string | null; addons: string | null } = { qty: params.get('qty'), addons: params.get('addons') };
      // The budget follows the total until the visitor picks one themselves (a user `change`; setting
      // selectedIndex from here fires none). `budgetAuto`: the current value was set by us.
      let budgetTouched = false;
      let budgetAuto = false;
      budget?.addEventListener('change', () => (budgetTouched = true));

      const planId = () => select.selectedOptions[0]?.dataset.plan || '';

      // The quote of the selected package plus the remembered add-ons; null for a package alone.
      const currentQuote = (): Quote | null => {
        const id = planId();
        if (!data || !id) return null;
        const p = new URLSearchParams({ plan: id });
        if (raw.qty !== null) p.set('qty', raw.qty);
        if (raw.addons !== null) p.set('addons', raw.addons);
        return parseBuiltQuote(p, data.plans, data.addOns);
      }

      // plan / qty / addons in the address, readable like the calculator writes them; other params stay.
      const writeUrl = (quote: Quote | null) => {
        const url = new URL(location.href);
        ['plan', 'qty', 'addons'].forEach((k) => url.searchParams.delete(k));
        const rest = url.searchParams.toString();
        const id = planId();
        const own = quote ? quoteQuery(quote) : id ? `plan=${encodeURIComponent(id)}` : '';
        const query = [rest, own].filter(Boolean).join('&');
        history.replaceState(history.state, '', `${url.pathname}${query ? `?${query}` : ''}${url.hash}`);
      }

      // The confirmation line, the submitted `quote` field and the budget, all from the current selection.
      const refresh = (syncUrl: boolean) => {
        const quote = currentQuote();
        const summary = quote && data ? quoteSummary(quote, data.plans, data.addOns, data.copy) : '';
        const planText = select.selectedOptions[0]?.dataset.choice;
        const text = summary || planText;
        if (choice && choiceText) {
          choiceText.textContent = text ?? '';
          choice.hidden = !text;
        }
        if (editWrap) editWrap.hidden = !quote;
        if (editLink && quote) editLink.href = `/rates/?${quoteQuery(quote)}#quote`;
        // Disabled while empty: the email then carries no empty `quote` line.
        if (quoteField) {
          quoteField.value = summary;
          quoteField.disabled = !summary;
        }
        if (budget && data && !budgetTouched) {
          const index = quote ? budgetIndex(quoteTotal(quote, data.plans, data.addOns).amount, data.budgets) : -1;
          if (index >= 0 && index < budget.options.length) {
            budget.selectedIndex = index;
            budgetAuto = true;
          } else if (budgetAuto) {
            budget.selectedIndex = defaultBudget;
            budgetAuto = false;
          }
        }
        if (syncUrl) writeUrl(quote);
      }

      // ?plan=full-day preselects that package. Unknown ids are ignored.
      const wanted = params.get('plan');
      const match = wanted ? options.find((o) => o.dataset.plan === wanted) : undefined;
      if (match && match.dataset.plan) select.value = match.value;
      // A shared link with unknown ids or out-of-range numbers: the address shows the quote as read.
      refresh(currentQuote() !== null);

      select.addEventListener('change', () => {
        if (!planId()) {
          raw.qty = null;
          raw.addons = null;
        }
        refresh(true);
      });
      change?.addEventListener('click', () => select.focus());
      // form.reset() after a sent brief puts the select back to "Not sure yet"; the reset fires before
      // the fields change, so sync the line on the next tick. The quote and its params go too.
      form.addEventListener('reset', () => setTimeout(() => {
        raw.qty = null;
        raw.addons = null;
        budgetTouched = false;
        budgetAuto = false;
        refresh(true);
      }));
    }

    // ?area=shoreditch starts an empty brief with "Shoot in Shoreditch: ". Unknown slugs are ignored; typed text is kept.
    const briefInput = form.querySelector<HTMLTextAreaElement>('textarea[name="brief"]');
    const areaWanted = params.get('area');
    const areaName = areaWanted ? readAreas(form.dataset.areas).get(areaWanted) : undefined;
    if (briefInput && areaName && form.dataset.areaBrief && !briefInput.value.trim()) {
      briefInput.value = form.dataset.areaBrief.replace('{area}', () => areaName);
    }
    // After a sent brief the form is empty again; the area is not asked for twice.
    form.addEventListener('reset', () => setTimeout(() => setParam('area', null)));

    if (dateInput) {
      // ?date=2027-06-12 fills the field as "12 June 2027". Invalid dates are ignored.
      const readable = formatDate(params.get('date'));
      if (readable && !dateInput.value) dateInput.value = readable;
      // A hand-typed date is free text, so it no longer matches ?date=.
      dateInput.addEventListener('input', () => setParam('date', null));
    }
  });
}

/* ---------- quick-contact dialog ---------- */

// The day the visitor has picked (the availability calendar, slice 3, calls setBookingDate).
// Read when the dialog opens; forgotten on navigation, where the URL's ?date= takes over again.
let bookingDate: string | null = null;

/** Remembers a picked ISO day (or clears it) so the pre-written WhatsApp message follows it. */
export function setBookingDate(iso: string | null) {
  bookingDate = parseIsoDate(iso) ? iso : null;
}

interface QuickPlan {
  id: string;
  name: string;
  ask: string;
}

function isQuickPlan(value: unknown): value is QuickPlan {
  if (typeof value !== 'object' || value === null) return false;
  const v: Record<string, unknown> = { ...value };
  return typeof v.id === 'string' && typeof v.name === 'string' && typeof v.ask === 'string';
}

function readPlans(json: string | undefined): QuickPlan[] {
  try {
    const parsed: unknown = JSON.parse(json ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isQuickPlan) : [];
  } catch {
    return [];
  }
}

const fill = (template: string, date: string, plan: string, area = '') =>
  template.replace('{date}', () => date).replace('{plan}', () => plan).replace('{area}', () => area);

function wireQuickContact(dialog: HTMLDialogElement) {
  const plans = readPlans(dialog.dataset.plans);
  const quoteData = readQuoteData(dialog.dataset.quoteData);
  const areaNames = readAreas(dialog.dataset.areas);
  const context = dialog.querySelector<HTMLElement>('[data-quick-context]');
  const whatsapp = dialog.querySelector<HTMLAnchorElement>('[data-quick-whatsapp]');
  const brief = dialog.querySelector<HTMLAnchorElement>('[data-quick-brief]');
  let opener: HTMLElement | null = null;
  // Where focus goes on close when it should not return to the opener (navigation, the form).
  let focusOnClose: HTMLElement | null = null;

  // Package and date for this opening: the opener's data-plan first, then the URL; unknown values are ignored.
  function update(from: HTMLElement) {
    const params = new URLSearchParams(location.search);
    const plan = plans.find((p) => p.id === (from.dataset.plan ?? params.get('plan')));
    // A quote the visitor built: the opener's own (the calculator keeps its data-* current) or, for any
    // other opener, the address (/contact/, /rates/). A package alone is not a quote.
    let quote: Quote | null = null;
    if (quoteData) {
      let source = params;
      if (from.dataset.plan !== undefined) {
        source = new URLSearchParams({ plan: from.dataset.plan });
        if (from.dataset.qty !== undefined) source.set('qty', from.dataset.qty);
        if (from.dataset.addons !== undefined) source.set('addons', from.dataset.addons);
      }
      quote = parseBuiltQuote(source, quoteData.plans, quoteData.addOns);
    }
    const summary = quote && quoteData ? quoteSummary(quote, quoteData.plans, quoteData.addOns, quoteData.copy) : '';
    const iso = bookingDate ?? (parseIsoDate(params.get('date')) ? params.get('date') : null);
    const date = formatDate(iso);
    const areaId = from.dataset.area ?? params.get('area') ?? '';
    const areaName = areaNames.get(areaId);

    if (context) {
      context.textContent = [plan?.name, date].filter(Boolean).join(' · ');
      context.hidden = !plan && !date;
    }
    if (whatsapp && dialog.dataset.waNumber) {
      const d = dialog.dataset;
      const { waBoth = '', waPlan = '', waDate = '', waNone = '' } = d;
      const { waBothArea = waBoth, waPlanArea = waPlan, waDateArea = waDate, waNoneArea = waNone } = d;
      const a = areaName ?? '';
      const text = plan && date ? fill(areaName ? waBothArea : waBoth, date, plan.ask, a)
        : plan ? fill(areaName ? waPlanArea : waPlan, '', plan.ask, a)
        : date ? fill(areaName ? waDateArea : waDate, date, '', a)
        : fill(areaName ? waNoneArea : waNone, '', '', a);
      const withQuote = summary && dialog.dataset.waQuote ? text + dialog.dataset.waQuote.replace('{quote}', () => summary) : text;
      whatsapp.href = `https://wa.me/${dialog.dataset.waNumber}?text=${encodeURIComponent(withQuote)}`;
    }
    if (brief) {
      // The quote's three params are written readably ("retouching:20,short-video"), like the calculator does.
      const query = [
        quote ? quoteQuery(quote) : plan ? `plan=${encodeURIComponent(plan.id)}` : '',
        iso ? `date=${encodeURIComponent(iso)}` : '',
        areaName ? `area=${encodeURIComponent(areaId)}` : '',
      ].filter(Boolean).join('&');
      brief.href = `/contact/${query ? `?${query}` : ''}`;
    }
  }

  function open(from: HTMLElement) {
    // An opener in the mobile drawer: close the drawer first and hand focus back to the burger later.
    const drawer = document.querySelector<HTMLElement>('[data-drawer]');
    if (drawer && from.closest('[data-drawer]')) {
      if (drawer.classList.contains('is-open')) document.querySelector<HTMLButtonElement>('[data-drawer-close]')?.click();
      opener = document.querySelector<HTMLElement>('[data-drawer-open]');
    } else {
      opener = from;
    }
    update(from);
    focusOnClose = null;
    dialog.showModal();
  }

  // Capture phase: the ClientRouter's own click listener would otherwise take the link first and navigate.
  // It skips clicks that are already defaultPrevented.
  document.addEventListener('click', (e) => {
    // Let new-tab and modified clicks follow the link to /contact/.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!(e.target instanceof Element)) return;
    const from = e.target.closest<HTMLElement>('[data-quick-contact]');
    if (!from) return;
    e.preventDefault();
    open(from);
  }, true);

  // A click on the ::backdrop lands on the <dialog> itself; the panel fills the dialog's box.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector('[data-quick-close]')?.addEventListener('click', () => dialog.close());

  // Already on a page with the brief form: close and start the form instead of reloading the page.
  brief?.addEventListener('click', (e) => {
    const field = document.querySelector<HTMLElement>('form[data-enquiry] :is(.sh-input, .sh-select, .sh-textarea)');
    if (!field || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    focusOnClose = field;
    dialog.close();
  });

  let navigating = false;

  dialog.addEventListener('close', () => {
    const main = document.getElementById('main-content');
    const target = focusOnClose ?? (opener?.isConnected ? opener : main);
    opener = null;
    focusOnClose = null;
    // Closed by a navigation: the page being left takes no focus; the router handles the new one.
    if (navigating) {
      navigating = false;
      return;
    }
    if (target === main) main?.setAttribute('tabindex', '-1');
    target?.focus();
  });

  // A link in the dialog (the brief) navigates: close it before the new page is swapped in.
  document.addEventListener('astro:before-swap', () => {
    bookingDate = null;
    if (!dialog.open) return;
    navigating = true;
    dialog.close();
  });

  // Openers on the new page announce that they open a dialog (only once the script can open it).
  const markOpeners = () =>
    document.querySelectorAll('[data-quick-contact]').forEach((a) => a.setAttribute('aria-haspopup', 'dialog'));
  markOpeners();
  document.addEventListener('astro:page-load', markOpeners);
}

const quickDialog = document.querySelector<HTMLDialogElement>('dialog[data-quick-dialog]');
if (quickDialog) wireQuickContact(quickDialog);
