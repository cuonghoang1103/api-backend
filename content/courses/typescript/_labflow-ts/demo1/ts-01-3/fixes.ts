import { createBooking } from '../../src/rules/booking.ts';
import type { BookingInput } from '../../src/rules/booking.ts';

// Fix 1 — annotate the variable: the object must BE a BookingInput.
export const input1: BookingInput =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

// Fix 2 — as const: every property becomes readonly and keeps its literal type.
export const input2 =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

// Fix 3 — satisfies: checked against BookingInput, keeps its own narrower type.
export const input3 =
  { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } satisfies BookingInput;

console.log(createBooking(input1).status, createBooking(input2).status, createBooking(input3).status);
