// How long is a booking? One range in ⇒ minutes; a list of ranges in ⇒ a list of minutes.
import type { TimeRange } from '../../../../src/rules/schedule.ts';

export function durationOf(x: TimeRange | readonly TimeRange[]): number | number[] {
  if (typeof x[0] === 'number') {
    const [start, end] = x as TimeRange;
    return end - start;
  }
  return (x as readonly TimeRange[]).map(([start, end]) => end - start);
}
