// The same arrow function, once inside .map() and once on its own.
import { createBooking } from '../../src/rules/booking.ts';

const bookings = [createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' })];
export const inMap = bookings.map((b) => b.minutes);   // context: map gives b its type
export const alone = (b) => b.minutes;                  // no context: where would the type come from?
