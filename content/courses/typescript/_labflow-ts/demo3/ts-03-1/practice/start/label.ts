// "BE-201 08:00–10:00", or "BE-201 from 08:00" while the end is not decided yet.
import { formatTime } from '../../../../src/rules/time.ts';

export function bookingLabel(lab, start, end) {
  if (end === undefined) return lab + ' from ' + formatTime(start);
  return lab + ' ' + formatTime(start) + '–' + formatTime(end);
}

console.log(bookingLabel('BE-201', 480, 600));
console.log(bookingLabel('BE-201', 480));
