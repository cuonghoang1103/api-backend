import { toRange, type TimeRange } from './range.ts';

const tooLong: TimeRange = [480, 600, 660];      // three numbers
const wrongType: TimeRange = ['08:00', '10:00']; // strings, not minutes
const third = toRange('08:00-10:00')[2];         // there is no position 2

const guess = [480, 600];                         // what does tsc infer here?
const r: TimeRange = guess;
