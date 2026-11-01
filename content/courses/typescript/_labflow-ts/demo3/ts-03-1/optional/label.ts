import { formatTime } from '../../../src/rules/time.ts';

// The end may not be known yet (a booking that is still "open").
export function rangeLabel(start: number, end?: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

export function lengthOf(start: number, end?: number): number {
  return end - start;
}

rangeLabel(480, 600);
rangeLabel(480);
rangeLabel(480, 600, 'BE-201');
