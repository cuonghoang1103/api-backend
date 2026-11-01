import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

validator.run(bad);                         // fine: called on the object
const run = validator.run;
run(bad);                                   // no object in front of the call
validator.run.call(validator, bad);         // fine: this given explicitly
const bound = validator.run.bind(validator);
bound(bad);                                 // fine: bind fixed this
[bad, bad].map(validator.run);              // passed as a callback
setTimeout(validator.run, 0, bad);          // passed to a timer
