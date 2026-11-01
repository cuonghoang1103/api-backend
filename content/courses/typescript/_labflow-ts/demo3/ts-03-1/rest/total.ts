import type { TimeRange } from '../../../src/rules/schedule.ts';

// Any number of ranges — zero included. Inside, ranges is an ordinary array: TimeRange[].
export function totalMinutes(...ranges: TimeRange[]): number {
  let total = 0;
  for (const [start, end] of ranges) total += end - start;
  return total;
}

