// Practice 1.3 — removing one annotation too many.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

// KEEP: an exported function's parameter (nothing to infer from) and its return type (the contract).
export function totalMinutes(bookings: readonly { minutes: number }[]): number {
  let total = 0;
  for (const b of bookings) total += b.minutes;
  return total;
}

const label = 'Monday';
// Too far: the annotation on day removed as well.
const day = [
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' },
];
const bookings = day.map((input) => createBooking(input));
const minutes = bookings.map((b) => b.minutes);
const rate = usageRate(bookings);
const pending = bookings.filter((b) => b.status === 'PENDING');
console.log(label, totalMinutes(bookings), minutes, rate.toFixed(3), pending.length);

// This call is wrong and must stay refused after your edits:
// @ts-expect-error — "minute" is not "minutes"
totalMinutes([{ minute: 60 }]);
