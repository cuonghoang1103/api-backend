import { checkSlot } from '../../../../src/rules/booking.ts';
import type { SlotResult } from '../../../../src/rules/booking.ts';

// Turn a SlotResult into a line for the UI. tsc refuses this — minutes is not on every member.
export function line(r: SlotResult): string {
  return 'OK, ' + r.minutes + ' minutes';
}

console.log(line(checkSlot('08:00', '10:00')));
console.log(line(checkSlot('08:15', '10:00')));
