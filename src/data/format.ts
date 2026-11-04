// The one place for currency and locale, and the one price formatter. No imports on purpose:
// client scripts can import this file without pulling in site.ts (and its images).
export const money = { currency: 'GBP', locale: 'en-GB' } as const;

const formatter = new Intl.NumberFormat(money.locale, {
  style: 'currency',
  currency: money.currency,
  maximumFractionDigits: 0,
});

// 1750 -> "£1,750"
export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

export interface PriceTextOptions {
  // Put "from" in front: "from £300".
  from?: boolean;
  // Put a unit after the price: "£25 per image".
  unit?: string;
}

// A price as shown in a list: "£200", "from £300", "£25 per image".
export function priceText(amount: number, { from = false, unit }: PriceTextOptions = {}): string {
  return `${from ? 'from ' : ''}${formatPrice(amount)}${unit ? ` ${unit}` : ''}`;
}
