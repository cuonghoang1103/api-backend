// Lab 3 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { toMinutes, validate, maxSeats, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

declare const input: BookingInput;

validate(input, [(seats: number) => null]);                  // S1 TS2322 a rule receives the whole request
validate(input, [() => 'TOO_LONG']);                         // S2 TS2322 a rule returns a Problem or null
const one: number = toMinutes(['08:00']);                    // S3 TS2322 a list in, a list out
toMinutes(480);                                              // S4 TS2769 minutes are not "HH:MM"
maxSeats('30');                                              // S5 TS2345 the limit is a number
totalMinutes([480, 600], 720);                               // S6 TS2345 every argument is a [start, end] range
validate(input);                                             // S7 TS2554 which rules?
const run = createValidator(RULES).run; run(input);          // S8 TS2684 run must be called on its validator
