import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

const run = validator.run;
console.log('run(bad)                 →', run(bad).map((p) => p.code));
console.log('[bad].map(validator.run) →', [bad].map(validator.run).map((ps) => ps.length));
setTimeout(() => console.log('inside setTimeout         →', validator.run(bad).length), 0);
