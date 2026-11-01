import { checkSlot } from '../../../src/rules/booking.ts';
import { SLOT_MESSAGES } from './messages.ts';

// as const here too: each pair stays a 2-element tuple of strings.
const CASES = [['08:15', '10:00'], ['10:00', '08:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']] as const;

for (const [start, end] of CASES) {
  const slot = checkSlot(start, end);
  console.log(start + '–' + end, '→', slot.ok ? slot.minutes + ' minutes, OK' : SLOT_MESSAGES[slot.code]);
}
