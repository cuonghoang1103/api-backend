import { formatTime } from '../../../src/rules/time.ts';

export function rangeLabel(start: number, end?: number): string {
  if (end === undefined) return 'from ' + formatTime(start);   // after this line, end is a number
  return formatTime(start) + '–' + formatTime(end);
}

console.log(rangeLabel(480, 600));
console.log(rangeLabel(480));
