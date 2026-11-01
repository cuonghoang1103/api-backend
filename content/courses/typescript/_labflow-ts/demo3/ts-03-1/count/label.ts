import { formatTime } from '../../../src/rules/time.ts';

export function rangeLabel(start: number, end: number): string {
  return formatTime(start) + '–' + formatTime(end);
}

rangeLabel(480, 600);
rangeLabel(480);
rangeLabel(480, 600, 'BE-201');
