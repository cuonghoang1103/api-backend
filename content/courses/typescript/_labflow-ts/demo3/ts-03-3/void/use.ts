import { validate } from './validate.ts';
import type { Problem, Rule } from './validate.ts';

const tooMany: Rule = (b) => (b.seats > 40 ? { code: 'TOO_MANY_SEATS', message: 'At most 40 seats' } : null);
const input = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' } as const;

const log: Problem[] = [];
validate(input, [tooMany], (p) => log.push(p));          // push returns a number — accepted in a void slot

const report2: (p: Problem) => void = (p) => p.code;    // the same body, typed by a function TYPE — accepted

function report(p: Problem): void {
  return p.code;                                         // a function DECLARED void must not return a value
}
const printed = validate(input, [tooMany], report);
validate(input, [tooMany], report2);
console.log(log.length, printed.length);
