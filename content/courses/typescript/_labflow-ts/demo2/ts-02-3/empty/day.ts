// A day in one lab starts empty; bookings are added during the day.
import type { Booking } from '../../../src/rules/booking.ts';
import { createBooking } from '../../../src/rules/booking.ts';

const day = { lab: 'BE-201', bookings: [] };

const b: Booking = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' });
day.bookings.push(b);

// A local variable is different: an empty array "evolves" as you push.
const ids = [];
ids.push(b.minutes);
const total: number = ids[0] ?? 0;
console.log(day.bookings.length, total);
