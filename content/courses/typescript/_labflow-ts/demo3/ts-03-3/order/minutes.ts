// The same overloads in the WRONG order: the broad signature first.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(x: string | readonly string[]): number | number[];   // broad — tsc tries this one first…
export function toMinutes(text: string): number;                               // …so these two are never reached
export function toMinutes(texts: readonly string[]): number[];
export function toMinutes(x: string | readonly string[]): number | number[] {
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}

const start: number = toMinutes('08:00');
