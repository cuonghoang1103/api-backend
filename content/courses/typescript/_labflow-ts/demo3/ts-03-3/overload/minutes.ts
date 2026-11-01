// The same helper with OVERLOADS: two public signatures, then one implementation.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(text: string): number;                       // overload 1: one time in, one number out
export function toMinutes(texts: readonly string[]): number[];          // overload 2: a list in, a list out
export function toMinutes(x: string | readonly string[]): number | number[] {   // implementation (not callable from outside)
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}
