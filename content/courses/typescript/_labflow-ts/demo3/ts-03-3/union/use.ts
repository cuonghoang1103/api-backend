import { toMinutes } from './minutes.ts';

const start: number = toMinutes('08:00');                 // the form: one time
const all: number[] = toMinutes(['08:00', '10:00']);      // the import: a list
console.log(start + 30, all.length);
