// The price calculator on /rates/ (src/components/PriceCalculator.astro). Called from site.ts on
// astro:page-load. Enables the controls the markup renders disabled, keeps the total, the panel lines,
// the "Send this" links, the quick-contact opener and ?plan=&qty=&addons= in step with the choice.
// The price data comes as JSON in data-calc, never by importing site.ts (which pulls in images).
import { formatPrice, priceText } from '../data/format';
import { parseQuote, quoteQuery, quoteTotal, type Quote } from '../data/quote';
import type { AddOn, Plan, PlanId, Quantity, QuoteCopy } from '../data/site';

type PlanData = Pick<Plan, 'id' | 'name' | 'price' | 'qty'>;
type AddOnData = Pick<AddOn, 'id' | 'name' | 'price' | 'priceFrom' | 'qty'>;

interface CalcData {
  defaultPlan: PlanId;
  plans: PlanData[];
  addOns: AddOnData[];
  copy: QuoteCopy & { totalFrom: string };
}

const QUOTE_PARAMS = ['plan', 'qty', 'addons'];

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function isQuantity(v: unknown): v is Quantity {
  return isRecord(v) && typeof v.min === 'number' && typeof v.max === 'number'
    && typeof v.one === 'string' && typeof v.many === 'string';
}

function isPriced(v: unknown): v is { id: string; name: string; price: number } {
  return isRecord(v) && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.price === 'number'
    && (v.qty === undefined || isQuantity(v.qty));
}

// The ids come from the build (site.ts types), so a priced entry with a string id is trusted as one.
function readData(json: string | undefined): CalcData | null {
  try {
    const parsed: unknown = JSON.parse(json ?? '');
    if (!isRecord(parsed) || !Array.isArray(parsed.plans) || !Array.isArray(parsed.addOns) || !isRecord(parsed.copy)) return null;
    // Narrowed field by field above; the casts only restore the id unions written by the build.
    const plans = parsed.plans.filter(isPriced) as PlanData[];
    const addOns = parsed.addOns.filter(isPriced) as AddOnData[];
    const c = parsed.copy;
    const text = (v: unknown) => (typeof v === 'string' ? v : '');
    const copy = { for: text(c.for), from: text(c.from), exVat: text(c.exVat), times: text(c.times), totalFrom: text(c.totalFrom) };
    const defaultPlan = plans.find((p) => p.id === parsed.defaultPlan)?.id ?? plans[0]?.id;
    return defaultPlan ? { defaultPlan, plans, addOns, copy } : null;
  } catch {
    return null;
  }
}

const unitWord = (n: number, q: Quantity) => (n === 1 ? q.one : q.many);

/* ---------- the phone bar: shown while the options are on screen and the full panel is not ---------- */

let barCleanup: (() => void) | null = null;
document.addEventListener('astro:before-swap', () => {
  barCleanup?.();
  barCleanup = null;
});

function wireBar(root: HTMLElement) {
  const bar = root.querySelector<HTMLElement>('[data-calc-bar]');
  const options = root.querySelector<HTMLElement>('[data-calc-options]');
  // The panel's own total: once it is in view above the bar, the bar has nothing to add.
  const total = root.querySelector<HTMLElement>('[data-calc-total]');
  if (!bar || !options || !total || !('IntersectionObserver' in window)) return;
  bar.hidden = false;
  let optionsIn = false;
  let totalIn = false;
  const html = document.documentElement;
  const apply = () => {
    const shown = optionsIn && !totalIn;
    bar.classList.toggle('is-shown', shown);
    bar.inert = !shown;
    // Keyboard focus and in-page jumps stop above the bar instead of under it.
    html.classList.toggle('has-calc-bar', shown);
  };
  const seeOptions = new IntersectionObserver(([e]) => {
    optionsIn = e.isIntersecting;
    apply();
  });
  // Bottom margin: the bar's height, so the swap happens as the panel's total clears the bar.
  const seeTotal = new IntersectionObserver(([e]) => {
    totalIn = e.isIntersecting;
    apply();
  }, { rootMargin: `0px 0px -${bar.offsetHeight || 80}px 0px` });
  seeOptions.observe(options);
  seeTotal.observe(total);
  apply();
  barCleanup = () => {
    seeOptions.disconnect();
    seeTotal.disconnect();
    html.classList.remove('has-calc-bar');
  };
}

/* ---------- the calculator ---------- */

export function initCalculator() {
  document.querySelectorAll<HTMLElement>('[data-calculator]').forEach((root) => {
    const data = readData(root.dataset.calc);
    if (!data) return;
    const { plans, addOns, copy, defaultPlan } = data;

    const planInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-calc-plan]'));
    const addOnInputs = Array.from(root.querySelectorAll<HTMLInputElement>('input[data-calc-addon]'));
    const steppers = new Map<string, HTMLElement>();
    root.querySelectorAll<HTMLElement>('[data-qty-for]').forEach((s) => steppers.set(s.dataset.qtyFor ?? '', s));
    const amounts = root.querySelectorAll<HTMLElement>('[data-calc-amount]');
    const announce = root.querySelector<HTMLElement>('[data-calc-announce]');
    const sends = root.querySelectorAll<HTMLAnchorElement>('[data-calc-send]');
    const opener = root.querySelector<HTMLAnchorElement>('[data-quick-contact]');

    const qtyInput = (id: string) => steppers.get(id)?.querySelector<HTMLInputElement>('[data-qty-input]') ?? null;
    const clamp = (n: number, q: Quantity) => Math.min(q.max, Math.max(q.min, Math.trunc(n)));
    // The number in a stepper; while someone is mid-typing ("" or "0") the last valid value counts.
    const lastValid = new Map<string, number>();
    function readQty(id: string, q: Quantity): number {
      const raw = Number.parseInt(qtyInput(id)?.value ?? '', 10);
      if (!Number.isNaN(raw) && raw >= q.min && raw <= q.max) lastValid.set(id, raw);
      return lastValid.get(id) ?? q.min;
    }

    function current(): Quote {
      const planId = planInputs.find((i) => i.checked)?.value;
      const plan = plans.find((p) => p.id === planId) ?? plans.find((p) => p.id === defaultPlan) ?? plans[0];
      const quote: Quote = { plan: plan.id, addOns: [] };
      if (plan.qty) quote.qty = readQty(plan.id, plan.qty);
      for (const a of addOns) {
        if (!addOnInputs.find((i) => i.value === a.id)?.checked) continue;
        quote.addOns.push(a.qty ? { id: a.id, qty: readQty(a.id, a.qty) } : { id: a.id });
      }
      return quote;
    }

    function setStepper(id: string, q: Quantity | undefined, on: boolean) {
      const s = steppers.get(id);
      if (!s || !q) return;
      s.hidden = !on;
      const n = readQty(id, q);
      s.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) => {
        b.disabled = !on;
        // aria-disabled, not disabled, at the limits: focus stays on the button that was pressed.
        const atLimit = b.dataset.step === '-1' ? n <= q.min : n >= q.max;
        b.setAttribute('aria-disabled', String(atLimit));
      });
      const input = qtyInput(id);
      if (input) input.disabled = !on;
    }

    let announceTimer = 0;

    function render(quote: Quote, syncUrl: boolean) {
      const plan = plans.find((p) => p.id === quote.plan);
      if (!plan) return;

      for (const p of plans) setStepper(p.id, p.qty, p.id === plan.id);
      for (const a of addOns) setStepper(a.id, a.qty, quote.addOns.some((c) => c.id === a.id));

      // Panel lines: the plan, then each chosen add-on, with "8 people × £120" under per-unit ones.
      root.querySelectorAll<HTMLElement>('[data-line-plan]').forEach((line) => {
        const p = plans.find((x) => x.id === line.dataset.linePlan);
        line.hidden = p?.id !== plan.id;
        if (!p || line.hidden) return;
        const n = p.qty ? quote.qty ?? p.qty.min : 1;
        setLine(line, p.qty ? `${n} ${unitWord(n, p.qty)} ${copy.times} ${formatPrice(p.price)}` : '', formatPrice(p.price * n));
      });
      root.querySelectorAll<HTMLElement>('[data-line-addon]').forEach((line) => {
        const a = addOns.find((x) => x.id === line.dataset.lineAddon);
        const chosen = quote.addOns.find((c) => c.id === a?.id);
        line.hidden = !chosen;
        if (!a || !chosen) return;
        const n = chosen.qty ?? 1;
        setLine(line, a.qty ? `${n} ${unitWord(n, a.qty)} ${copy.times} ${formatPrice(a.price)}` : '',
          priceText(a.price * n, { from: a.priceFrom }));
      });

      const total = quoteTotal(quote, plans, addOns);
      const amount = `${total.from ? `${copy.totalFrom} ` : ''}${formatPrice(total.amount)}`;
      amounts.forEach((el) => (el.textContent = amount));
      // One short sentence, once the visitor pauses: not the whole panel on every keystroke.
      window.clearTimeout(announceTimer);
      if (syncUrl && announce) announceTimer = window.setTimeout(() => (announce.textContent = `${amount} ${copy.exVat}`), 450);

      const query = quoteQuery(quote);
      sends.forEach((a) => (a.href = `/contact/?${query}`));
      if (opener) {
        opener.dataset.plan = quote.plan;
        if (quote.qty !== undefined) opener.dataset.qty = String(quote.qty);
        else delete opener.dataset.qty;
        const list = query.match(/(?:^|&)addons=([^&]*)/)?.[1];
        if (list) opener.dataset.addons = list;
        else delete opener.dataset.addons;
      }

      if (syncUrl) {
        // Other parameters stay; the quote's three are written readably, after them.
        const url = new URL(location.href);
        QUOTE_PARAMS.forEach((k) => url.searchParams.delete(k));
        const rest = url.searchParams.toString();
        history.replaceState(history.state, '', `${url.pathname}?${[rest, query].filter(Boolean).join('&')}${url.hash}`);
      }
    }

    function setLine(line: HTMLElement, meta: string, price: string) {
      const metaEl = line.querySelector<HTMLElement>('[data-line-meta]');
      const priceEl = line.querySelector<HTMLElement>('[data-line-price]');
      if (metaEl) {
        metaEl.textContent = meta;
        metaEl.hidden = !meta;
      }
      if (priceEl) priceEl.textContent = price;
    }

    const update = () => render(current(), true);

    // Opening state: ?plan=&qty=&addons= of the address, else the featured package. Unknown ids are ignored.
    const initial = parseQuote(new URLSearchParams(location.search), plans, addOns, defaultPlan);
    if (initial) {
      planInputs.forEach((i) => (i.checked = i.value === initial.plan));
      const planData = plans.find((p) => p.id === initial.plan);
      if (planData?.qty && initial.qty !== undefined) {
        const input = qtyInput(planData.id);
        if (input) input.value = String(initial.qty);
      }
      addOnInputs.forEach((i) => {
        const chosen = initial.addOns.find((c) => c.id === i.value);
        i.checked = Boolean(chosen);
        const input = qtyInput(i.value);
        if (chosen?.qty !== undefined && input) input.value = String(chosen.qty);
      });
    }

    [...planInputs, ...addOnInputs].forEach((i) => {
      i.disabled = false;
      i.addEventListener('change', update);
    });

    steppers.forEach((stepper, id) => {
      const q = plans.find((p) => p.id === id)?.qty ?? addOns.find((a) => a.id === id)?.qty;
      const input = qtyInput(id);
      if (!q || !input) return;
      stepper.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
        b.addEventListener('click', () => {
          if (b.getAttribute('aria-disabled') === 'true') return;
          input.value = String(clamp(readQty(id, q) + Number(b.dataset.step), q));
          update();
        }),
      );
      input.addEventListener('input', update);
      // Leaving the field puts any out-of-range or empty value back inside min–max.
      input.addEventListener('change', () => {
        const n = Number.parseInt(input.value, 10);
        input.value = String(Number.isNaN(n) ? readQty(id, q) : clamp(n, q));
        update();
      });
      // Enter in the number field must not do anything surprising; arrow keys already step natively.
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.dispatchEvent(new Event('change'));
        }
      });
    });

    // A shared link with unknown ids or out-of-range numbers: the address shows the quote as read.
    const params = new URLSearchParams(location.search);
    render(current(), QUOTE_PARAMS.some((k) => params.has(k)));
    window.clearTimeout(announceTimer);
    root.querySelector<HTMLElement>('[data-calc-nojs]')?.setAttribute('hidden', '');
    root.querySelector<HTMLElement>('[data-calc-live]')?.removeAttribute('hidden');
    root.dataset.ready = '';
    wireBar(root);
  });
}
