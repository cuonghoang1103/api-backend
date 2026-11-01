// Practice 1.1 — step 1 only: the type is added, the typo is still there.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);
  return rate;
}
