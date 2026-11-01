// The same typo, but the parameter now has a type.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings: readonly { minutes: number }[]): number {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}
