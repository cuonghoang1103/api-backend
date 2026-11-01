// js/booking.js's usageRate with one typo: b.minute instead of b.minutes.
const OPEN = 7 * 60;
const CLOSE = 21 * 60;

export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minute / (CLOSE - OPEN);   // typo
  return rate;
}

console.log('usage today:', usageRate([{ lab: 'BE-201', minutes: 120 }, { lab: 'BE-201', minutes: 90 }]));
