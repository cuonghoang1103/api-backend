// A method handed to a timer: Node calls it later, with its own Timeout object as this.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

setTimeout(validator.run, 0, bad);
console.log('timer scheduled');
