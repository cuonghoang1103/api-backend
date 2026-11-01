// Practice start: a range typed as a plain number[].
import { parseTime } from '../../../../src/rules/time.ts';

export function toRange(text: string): number[] {
  const [from, to] = text.split('-');
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

export function minutesOf(range: number[]): number {
  return range[1] - range[0];
}

console.log(minutesOf(toRange('08:00-10:00')));
console.log(minutesOf([600, 480, 30]));          // nonsense, accepted
