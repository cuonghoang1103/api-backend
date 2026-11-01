import { parseTime } from '../../../../src/rules/time.ts';

// The return type is part of the contract: the wrong line is refused where it is written.
export function durationOf(start: string, end: string): number {
  const s = parseTime(start);
  const e = parseTime(end);
  if (e <= s) return 'invalid';
  return e - s;
}
