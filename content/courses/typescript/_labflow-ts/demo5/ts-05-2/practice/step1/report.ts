import { checkSlot } from '../../../../src/rules/booking.ts';
import type { SlotResult } from '../../../../src/rules/booking.ts';

export function line(r: SlotResult): string {
  if (r.ok) return 'OK, ' + r.minutes + ' minutes';
  return 'REFUSED: ' + r.code;
}

console.log(line(checkSlot('08:00', '10:00')));
console.log(line(checkSlot('08:15', '10:00')));
