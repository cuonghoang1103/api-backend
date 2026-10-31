import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('booking works', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  expect(b.status).toBe('CONFIRMED');   // wrong expectation here…
  expect(b.minutes).toBe(120);          // …so these two lines
  expect(b.lab).toBe('BE-201');         // never run
});
