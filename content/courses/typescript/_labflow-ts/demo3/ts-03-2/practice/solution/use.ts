import { notBefore } from './early.ts';
import { validate, maxSeats } from '../../rules/rules.ts';

const morningExam = { lab: 'AL-301', seats: 35, role: 'LECTURER', start: '08:00', end: '10:00' } as const;
console.log(validate(morningExam, [notBefore('09:00'), maxSeats(40)]));
console.log(validate(morningExam, [notBefore('07:30'), maxSeats(40)]));
