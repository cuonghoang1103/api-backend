// Lab 3 — CORRECT uses. They must keep compiling with your types (part B).
import { toMinutes, validate, maxSeats, onGrid, totalMinutes, createValidator, RULES } from '../src/validate.ts';
import type { Problem, Rule } from '../src/validate.ts';
import type { BookingInput } from '../src/booking.ts';

const input: BookingInput = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

const start: number = toMinutes('08:00');                    // one time in, one number out
const all: number[] = toMinutes(['08:00', '10:00']);          // a list in, a list out
const problems: Problem[] = validate(input, RULES);

const log: Problem[] = [];
validate(input, [onGrid, maxSeats(30)], (p) => log.push(p)); // the callback's result (push returns a number) is ignored

const studentLimit: Rule = (b) =>
  b.role === 'STUDENT' && b.seats > 35 ? { code: 'TOO_MANY_SEATS', message: 'Students: at most 35 seats' } : null;
validate(input, [...RULES, studentLimit]);

const none: number = totalMinutes();                          // no range at all is fine: 0
const two: number = totalMinutes([480, 600], [600, 720]);

const v = createValidator(RULES);
const fromValidator: Problem[] = v.run(input);                // called ON the validator
console.log(start, all, problems, log, none, two, fromValidator);
