import { createBooking } from '../../src/rules/booking.ts';

const bookings = [
  createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' }),
  createBooking({ lab: 'BE-305', seats: 12, role: 'LECTURER', start: '13:00', end: '15:30' }),
];

// No annotation on b, m or total — the context tells TypeScript what they are.
export const minutes = bookings.map((b) => b.minutes);
export const total = minutes.reduce((sum, m) => sum + m, 0);
export const labs = bookings.filter((b) => b.status === 'PENDING').map((b) => b.lab);
console.log(minutes, total, labs);
