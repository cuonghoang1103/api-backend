// The return type does NOT depend on the argument ⇒ a union parameter is enough. No overloads.
import { formatTime } from '../../../src/rules/time.ts';
import type { TimeRange } from '../../../src/rules/schedule.ts';

export function rangeLabel(r: TimeRange | string): string {
  if (typeof r === 'string') return r;                    // already "08:00-10:00"
  return formatTime(r[0]) + '-' + formatTime(r[1]);
}
console.log(rangeLabel([480, 600]), '|', rangeLabel('09:00-11:00'));
