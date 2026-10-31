// Free half-hour slots of one lab on one day, given that day's bookings. A pure function: unit-test it.
import { OPEN, CLOSE, STEP } from '../../../src/rules/booking.js';
import { parseTime, formatTime } from '../../../src/rules/time.js';

export function freeSlots(bookings) {
  const taken = bookings.map((b) => [parseTime(b.start), parseTime(b.end)]);
  const free = [];
  for (let t = OPEN; t < CLOSE; t += STEP) {
    const busy = taken.some(([start, end]) => t < end && t + STEP > start);
    if (!busy) free.push(formatTime(t));
  }
  return free;
}
