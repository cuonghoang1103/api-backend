import { validator } from './validator.ts';
console.log(validator.run({ lab: 'BE-201', seats: 45, role: 'STUDENT', start: '08:00', end: '10:00' }));
