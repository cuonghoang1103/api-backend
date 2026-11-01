// Lab 1 — the same 8 wrong calls, run against the ORIGINAL JavaScript rules (js/). What would a user see?
import { parseTime, formatTime } from '../../js/time.js';
import { checkSlot, needsApproval, createBooking, usageRate } from '../../js/booking.js';

const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };
const calls = [
  ['S1', () => parseTime(420)],
  ['S2', () => formatTime('07:30')],
  ['S3', () => checkSlot('08:00')],
  ['S4', () => needsApproval({ seat: 31, role: 'STUDENT' })],
  ['S5', () => needsApproval({ seats: 31, role: 'lecturer' })],
  ['S6', () => createBooking(input).minute],
  ['S7', () => (createBooking(input).status === 'APPROVED' ? 'branch ran' : 'branch skipped')],
  ['S8', () => usageRate([{ minute: 60 }])],
];
for (const [id, call] of calls) {
  try {
    const v = call();
    console.log(id, 'returned', typeof v === 'string' ? JSON.stringify(v) : String(v));
  } catch (e) {
    console.log(id, 'threw', e.constructor.name + ':', e.message);
  }
}
