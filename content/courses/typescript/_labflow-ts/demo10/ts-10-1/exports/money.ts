// Named exports, a default export, and a type export — all from one module.
export type Money = { amount: number; currency: string };
export function add(a: Money, b: Money): Money {
  return { amount: a.amount + b.amount, currency: a.currency };
}
export default function format(m: Money): string {
  return m.amount + ' ' + m.currency;
}
