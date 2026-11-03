import { checkSlot } from '../../../src/rules/booking.ts';

// Test the ok flag and tsc narrows the whole object: minutes on one side, code on the other.
const r = checkSlot('08:00', '10:00');
if (r.ok) {
  console.log('booked', r.minutes, 'minutes'); // r: { ok: true; minutes: number }
} else {
  console.log('refused:', r.code);              // r: { ok: false; code: SlotCode }
}

const bad = checkSlot('08:15', '10:00');
console.log(bad.ok ? bad.minutes + ' min' : 'refused ' + bad.code);
