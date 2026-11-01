import type { BookingInput } from '../../../src/rules/booking.ts';

// A guard that FORGETS to check role. tsc cannot tell — it trusts "x is BookingInput".
export function isBookingInput(x: unknown): x is BookingInput {
  return (
    typeof x === 'object' && x !== null &&
    'lab' in x && typeof x.lab === 'string' &&
    'seats' in x && typeof x.seats === 'number' && Number.isInteger(x.seats) && x.seats >= 1 &&
    'start' in x && typeof x.start === 'string' &&
    'end' in x && typeof x.end === 'string'
  );
}
