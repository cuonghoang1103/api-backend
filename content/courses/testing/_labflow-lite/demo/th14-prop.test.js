import { it } from 'vitest';
import fc from 'fast-check';
import { checkSlot, MAX_MINUTES } from '../src/rules/booking.js';
import { formatTime } from '../src/rules/time.js';

// any time of day on the 30-minute grid: 00:00, 00:30, … 23:30
const gridTime = fc.integer({ min: 0, max: 47 }).map((i) => formatTime(i * 30));

it('never accepts a slot longer than MAX_MINUTES', () => {
  fc.assert(
    fc.property(gridTime, gridTime, (start, end) => {
      const result = checkSlot(start, end);
      return !result.ok || result.minutes <= MAX_MINUTES;
    }),
  );
});
