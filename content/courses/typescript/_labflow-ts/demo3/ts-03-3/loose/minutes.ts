// An overload can promise more than the implementation keeps.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(text: string): number;
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(x: string | readonly string[]): number | number[] | undefined {
  if (x === '') return undefined;                // "no time yet" on a half-filled form
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}

const start = toMinutes('');                     // overload 1 says: number
console.log('ends at', start + 120, '| label', start.toFixed(0));
