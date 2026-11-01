import { createBooking } from '../../src/rules/booking.ts';

// The object is built first, passed later — a very common shape in real code.
const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };
console.log(createBooking(input));
