import { durationOf } from './duration.ts';

const one: number = durationOf([480, 600]);                       // one range: its length in minutes
const many: number[] = durationOf([[480, 600], [600, 690]]);      // a day: one length per range
console.log(one, many);
