import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

const input = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('toEqual ignores an undefined property', () => {
  expect({ ...createBooking(input), note: undefined })
    .toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toStrictEqual does not', () => {
  expect({ ...createBooking(input), note: undefined })
    .toStrictEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toMatchObject checks only the fields you name', () => {
  expect(createBooking(input)).toMatchObject({ status: 'CONFIRMED', minutes: 120 });
});

it('inline snapshot', () => {
  expect(createBooking(input)).toMatchInlineSnapshot(`
    {
      "end": "10:00",
      "lab": "BE-201",
      "minutes": 120,
      "start": "08:00",
      "status": "CONFIRMED",
    }
  `);
});
