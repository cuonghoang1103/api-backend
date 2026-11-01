import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

console.log('validator.run(bad) →', validator.run(bad).map((p) => p.code));

const run = validator.run;            // the same function, taken off its object
console.log('run(bad)           →', run(bad));
