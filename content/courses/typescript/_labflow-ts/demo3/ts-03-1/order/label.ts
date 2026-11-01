import { formatTime } from '../../../src/rules/time.ts';

// "Optional first, it is the less important one" — tsc does not allow it.
export function timeText(withSeconds?: boolean, minutes: number): string {
  return withSeconds ? formatTime(minutes) + ':00' : formatTime(minutes);
}
