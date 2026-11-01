// How long is a booking? One range in ⇒ minutes; a list of ranges in ⇒ a list of minutes.
import type { TimeRange } from '../../../../src/rules/schedule.ts';

export function durationOf(range: TimeRange): number;
export function durationOf(ranges: readonly TimeRange[]): number[];
export function durationOf(x: TimeRange | readonly TimeRange[]): number | number[] {
  if (isRange(x)) return x[1] - x[0];
  return x.map(([start, end]) => end - start);
}

// A range is two numbers; a list of ranges holds arrays. Checking the first element tells them apart.
function isRange(x: TimeRange | readonly TimeRange[]): x is TimeRange {
  return typeof x[0] === 'number';
}
