import { durationOf } from './duration.ts';

// Another file, another person: the error shows up HERE, far from the line that caused it.
const minutes: number = durationOf('08:00', '10:00');
console.log(minutes);
