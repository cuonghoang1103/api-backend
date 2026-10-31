import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('booking fields (soft)', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  expect.soft(b.status).toBe('CONFIRMED');
  expect.soft(b.minutes).toBe(90);
  expect.soft(b.lab).toBe('BE-201');
});
