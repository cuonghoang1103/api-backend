// Practice 1.3 — too many annotations. Remove the ones inference already gives; keep the ones that carry information.
import { createBooking, usageRate } from '../../../src/rules/booking.ts';
import type { Booking, BookingInput } from '../../../src/rules/booking.ts';

export function totalMinutes(bookings: readonly { minutes: number }[]): number {
  let total: number = 0;
  for (const b of bookings) total += b.minutes;
  return total;
}

const label: string = 'Monday';
const day: BookingInput[] = [
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' },
  { lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' },
];
const bookings: Booking[] = day.map((input: BookingInput): Booking => createBooking(input));
const minutes: number[] = bookings.map((b: Booking): number => b.minutes);
const rate: number = usageRate(bookings);
const pending: Booking[] = bookings.filter((b: Booking): boolean => b.status === 'PENDING');
console.log(label, totalMinutes(bookings), minutes, rate.toFixed(3), pending.length);

// This call is wrong and must stay refused after your edits:
// @ts-expect-error — "minute" is not "minutes"
totalMinutes([{ minute: 60 }]);
