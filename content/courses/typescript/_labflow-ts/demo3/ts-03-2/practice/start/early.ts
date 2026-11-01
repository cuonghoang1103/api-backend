// Practice — a rule factory: notBefore('09:00') makes a rule that refuses bookings starting earlier.
import { parseTime } from '../../../../src/rules/time.ts';

export function notBefore(time) {
  return (input) =>
    parseTime(input.start) < parseTime(time) ? { code: 'OUTSIDE_HOURS', message: 'Not before ' + time } : null;
}
