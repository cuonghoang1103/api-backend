import { parseTime } from '../../../../src/rules/time.ts';

// No return type: tsc infers it from every return statement — including the one a teammate added last week.
export function durationOf(start: string, end: string) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (e <= s) return 'invalid';
  return e - s;
}
