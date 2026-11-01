// Practice solution: a readonly labelled tuple says "exactly two numbers, start then end".
import { parseTime } from '../../../../src/rules/time.ts';

export type TimeRange = readonly [start: number, end: number];

export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

export function minutesOf(range: TimeRange): number {
  return range[1] - range[0];
}

console.log(minutesOf(toRange('08:00-10:00')));
