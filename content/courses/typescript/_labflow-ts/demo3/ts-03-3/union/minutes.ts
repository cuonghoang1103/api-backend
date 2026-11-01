// One helper, two call shapes: the booking form sends ONE time, the CSV import sends a LIST of times.
// First try: a union in, a union out.
import { parseTime } from '../../../src/rules/time.ts';

export function toMinutes(x: string | readonly string[]): number | number[] {
  return typeof x === 'string' ? parseTime(x) : x.map((t) => parseTime(t));
}
