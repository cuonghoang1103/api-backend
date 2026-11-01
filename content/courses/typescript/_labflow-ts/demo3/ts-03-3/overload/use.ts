import { toMinutes } from './minutes.ts';

const start: number = toMinutes('08:00');                 // overload 1
const all: number[] = toMinutes(['08:00', '10:00']);      // overload 2
console.log(start + 30, all.length);
