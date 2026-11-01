// Run each way of calling run() for real. Node strips the this parameter and checks nothing.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';

const bad: BookingInput = { lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:15', end: '10:00' };

function attempt(label: string, call: () => unknown): void {
  try {
    console.log(label.padEnd(40), '→', JSON.stringify(call()));
  } catch (e) {
    console.log(label.padEnd(40), '→ throws', String(e));
  }
}

attempt('validator.run(bad)', () => validator.run(bad));
attempt('validator.run.call(validator, bad)', () => validator.run.call(validator, bad));
attempt('validator.run.bind(validator)(bad)', () => validator.run.bind(validator)(bad));
attempt('[bad].map(validator.run)', () => [bad].map(validator.run));
attempt('[bad].map(validator.run, validator)', () => [bad].map(validator.run, validator));
attempt('[bad].map((b) => validator.run(b))', () => [bad].map((b) => validator.run(b)));
console.log('validator.run.length =', validator.run.length, '(the this parameter is not a real parameter)');
