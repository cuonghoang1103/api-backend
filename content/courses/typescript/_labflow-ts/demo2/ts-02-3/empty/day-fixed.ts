// Say what the empty list WILL hold, and the trap disappears.
import type { Booking } from '../../../src/rules/booking.ts';
import { createBooking } from '../../../src/rules/booking.ts';

type LabDay = { lab: string; bookings: Booking[] };
const day: LabDay = { lab: 'BE-201', bookings: [] };

const b: Booking = createBooking({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' });
day.bookings.push(b);
console.log(day.bookings.length, day.bookings[0]?.minutes);
