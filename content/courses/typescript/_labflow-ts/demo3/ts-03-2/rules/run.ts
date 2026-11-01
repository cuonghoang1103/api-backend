import { validate, endAfterStart, notTooLong, maxSeats } from './rules.ts';
import type { Rule } from './rules.ts';

const RULES: readonly Rule[] = [endAfterStart, notTooLong, maxSeats(40)];

const ok = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' } as const;
const bad = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '10:00', end: '08:00' } as const;

console.log('ok  →', validate(ok, RULES));
console.log('bad →', validate(bad, RULES).map((p) => p.code));
console.log('lecture hall rule →', validate(bad, [maxSeats(60)]).length, 'problems');
