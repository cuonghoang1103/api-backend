// Practice 1.1 — starting point. The parameter is "any", so the typo below goes unnoticed.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: any): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}

console.log(usageRate([{ minutes: 420 }]));
