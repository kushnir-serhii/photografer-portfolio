// A visitor's quote: one package plus add-ons, with quantities where the price is per unit.
// Pure functions, no DOM: used at build time and by client scripts (which receive the price data as
// JSON, never by importing site.ts). The words in the summary come in as a QuoteCopy argument
// (quoteCopy in site.ts), so this file holds no client-facing copy.
// URL form: ?plan=headshots&qty=8&addons=retouching:20,extra-hour:2,short-video
import type { AddOn, AddOnId, Plan, PlanId, Quantity, QuoteCopy } from './site';
import { formatPrice } from './format';

export interface QuoteAddOn {
  id: AddOnId;
  qty?: number;
}

export interface Quote {
  plan: PlanId;
  // The plan's quantity (people); only set when the plan has one.
  qty?: number;
  addOns: QuoteAddOn[];
}

export interface QuoteTotal {
  amount: number;
  // True when any chosen add-on is a "from" price: the real total can be higher.
  from: boolean;
}

// The structural subset of Plan / AddOn the helpers need, so scripts can pass trimmed JSON.
type PlanLike = Pick<Plan, 'id' | 'name' | 'price' | 'qty'>;
type AddOnLike = Pick<AddOn, 'id' | 'name' | 'price' | 'priceFrom' | 'qty'>;

// A missing, non-numeric or out-of-range quantity becomes a valid one: NaN -> min, otherwise clamped.
function clampQty(raw: string | number | null | undefined, q: Quantity): number {
  const n = typeof raw === 'number' ? Math.trunc(raw) : Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(n)) return q.min;
  return Math.min(q.max, Math.max(q.min, n));
}

export function parseQuote(
  params: URLSearchParams,
  plans: readonly PlanLike[],
  addOns: readonly AddOnLike[],
  fallbackPlan?: PlanId,
): Quote | null {
  const wanted = params.get('plan');
  const plan = plans.find((p) => p.id === wanted) ?? plans.find((p) => p.id === fallbackPlan);
  if (!plan) return null;

  const quote: Quote = { plan: plan.id, addOns: [] };
  if (plan.qty) quote.qty = clampQty(params.get('qty'), plan.qty);

  for (const part of (params.get('addons') ?? '').split(',')) {
    const [id, rawQty] = part.trim().split(':');
    const addOn = addOns.find((a) => a.id === id);
    if (!addOn || quote.addOns.some((a) => a.id === addOn.id)) continue;
    quote.addOns.push(addOn.qty ? { id: addOn.id, qty: clampQty(rawQty, addOn.qty) } : { id: addOn.id });
  }
  return quote;
}

export function quoteTotal(quote: Quote, plans: readonly PlanLike[], addOns: readonly AddOnLike[]): QuoteTotal {
  const plan = plans.find((p) => p.id === quote.plan);
  let amount = plan ? plan.price * (quote.qty ?? 1) : 0;
  let from = false;
  for (const chosen of quote.addOns) {
    const addOn = addOns.find((a) => a.id === chosen.id);
    if (!addOn) continue;
    amount += addOn.price * (chosen.qty ?? 1);
    if (addOn.priceFrom) from = true;
  }
  return { amount, from };
}

// "Full day, extra hour ×2, short video — from £2,400 ex VAT"
// "Headshots for 8 people, extra retouching ×20 — £1,460 ex VAT"
export function quoteSummary(
  quote: Quote,
  plans: readonly PlanLike[],
  addOns: readonly AddOnLike[],
  copy: QuoteCopy,
): string {
  const plan = plans.find((p) => p.id === quote.plan);
  if (!plan) return '';
  const head = plan.qty && quote.qty !== undefined
    ? `${plan.name} ${copy.for} ${quote.qty} ${quote.qty === 1 ? plan.qty.one : plan.qty.many}`
    : plan.name;
  const lines = quote.addOns.flatMap((chosen) => {
    const addOn = addOns.find((a) => a.id === chosen.id);
    if (!addOn) return [];
    const name = addOn.name.toLowerCase();
    return [chosen.qty !== undefined && chosen.qty > 1 ? `${name} ${copy.times}${chosen.qty}` : name];
  });
  const total = quoteTotal(quote, plans, addOns);
  return `${[head, ...lines].join(', ')} — ${total.from ? `${copy.from} ` : ''}${formatPrice(total.amount)} ${copy.exVat}`;
}

export function quoteParams(quote: Quote): URLSearchParams {
  const params = new URLSearchParams({ plan: quote.plan });
  if (quote.qty !== undefined) params.set('qty', String(quote.qty));
  if (quote.addOns.length > 0) {
    params.set('addons', quote.addOns.map((a) => (a.qty !== undefined ? `${a.id}:${a.qty}` : a.id)).join(','));
  }
  return params;
}

// The same query, kept readable for links and the address bar: "plan=headshots&qty=8&addons=retouching:20,extra-hour:2".
// URLSearchParams would write ":" and "," as %3A / %2C; ids are slugs and quantities are numbers, so neither needs it.
export function quoteQuery(quote: Quote): string {
  const parts = [`plan=${encodeURIComponent(quote.plan)}`];
  if (quote.qty !== undefined) parts.push(`qty=${quote.qty}`);
  if (quote.addOns.length > 0) {
    const list = quote.addOns.map((a) => (a.qty !== undefined ? `${encodeURIComponent(a.id)}:${a.qty}` : encodeURIComponent(a.id)));
    parts.push(`addons=${list.join(',')}`);
  }
  return parts.join('&');
}
