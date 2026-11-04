// Reads the price data that the build hands to client scripts as JSON data attributes (the scripts never
// import site.ts: it pulls in images). No DOM here. Shared by the calculator, the brief form and the
// quick-contact dialog. Everything is checked field by field; bad data gives null or empty lists.
import type { AddOn, BudgetRange, Plan, Quantity, QuoteCopy } from '../data/site';

export type PlanData = Pick<Plan, 'id' | 'name' | 'price' | 'qty'>;
export type AddOnData = Pick<AddOn, 'id' | 'name' | 'price' | 'priceFrom' | 'qty'>;

export const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function isQuantity(v: unknown): v is Quantity {
  return isRecord(v) && typeof v.min === 'number' && typeof v.max === 'number'
    && typeof v.one === 'string' && typeof v.many === 'string';
}

function isPriced(v: unknown): v is { id: string; name: string; price: number } {
  return isRecord(v) && typeof v.id === 'string' && typeof v.name === 'string' && typeof v.price === 'number'
    && (v.qty === undefined || isQuantity(v.qty));
}

export const text = (v: unknown) => (typeof v === 'string' ? v : '');

export function readQuoteCopy(c: Record<string, unknown>): QuoteCopy {
  return { for: text(c.for), from: text(c.from), exVat: text(c.exVat), times: text(c.times) };
}

/** Plans, add-ons and the quote words from a parsed JSON object; null when the shape is wrong. */
export function readPriceLists(parsed: Record<string, unknown>): { plans: PlanData[]; addOns: AddOnData[]; copy: QuoteCopy } | null {
  if (!Array.isArray(parsed.plans) || !Array.isArray(parsed.addOns) || !isRecord(parsed.copy)) return null;
  // Narrowed field by field above; the ids come from the build (site.ts types), so the casts only restore the id unions.
  const plans = parsed.plans.filter(isPriced) as PlanData[];
  const addOns = parsed.addOns.filter(isPriced) as AddOnData[];
  return { plans, addOns, copy: readQuoteCopy(parsed.copy) };
}

export function readBudgets(v: unknown): BudgetRange[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((b: unknown) => {
    if (!isRecord(b) || typeof b.label !== 'string') return [];
    const range: BudgetRange = { label: b.label };
    if (typeof b.max === 'number') range.max = b.max;
    if (b.notSure === true) range.notSure = true;
    return [range];
  });
}

/** What the form and the dialog need to describe a quote: lists, words and the budget ranges. */
export interface QuoteData {
  plans: PlanData[];
  addOns: AddOnData[];
  copy: QuoteCopy;
  budgets: BudgetRange[];
}

export function readQuoteData(json: string | undefined): QuoteData | null {
  try {
    const parsed: unknown = JSON.parse(json ?? '');
    if (!isRecord(parsed)) return null;
    const lists = readPriceLists(parsed);
    return lists ? { ...lists, budgets: readBudgets(parsed.budgets) } : null;
  } catch {
    return null;
  }
}
