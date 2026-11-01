// A time range is exactly two numbers, and position matters: [start, end].
import { parseTime } from '../../../src/rules/time.ts';

export type TimeRange = [start: number, end: number];   // a labelled tuple

export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');                  // '08:00-10:00'
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

const [start, end] = toRange('08:00-10:00');           // destructure by position
console.log('start', start, 'end', end, 'minutes', end - start);
