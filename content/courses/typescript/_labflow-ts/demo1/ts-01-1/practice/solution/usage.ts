// Practice 1.1 — solution. Step 1: give the parameter a real type. Step 2: tsc points at the typo; fix it.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}

console.log(usageRate([{ minutes: 420 }]));
