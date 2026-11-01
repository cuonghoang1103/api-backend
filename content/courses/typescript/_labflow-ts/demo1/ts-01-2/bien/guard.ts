import type { BookingInput } from '../../../src/rules/booking.ts';

const ROLES: readonly string[] = ['STUDENT', 'LECTURER', 'ADMIN'];

// A type guard: real JavaScript checks that run at RUNTIME.
// If it returns true, TypeScript treats x as a BookingInput afterwards.
export function isBookingInput(x: unknown): x is BookingInput {
  return (
    typeof x === 'object' && x !== null &&
    'lab' in x && typeof x.lab === 'string' &&
    'seats' in x && typeof x.seats === 'number' && Number.isInteger(x.seats) && x.seats >= 1 &&
    'role' in x && typeof x.role === 'string' && ROLES.includes(x.role) &&
    'start' in x && typeof x.start === 'string' &&
    'end' in x && typeof x.end === 'string'
  );
}
