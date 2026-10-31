import { it } from 'vitest';
import fc from 'fast-check';
import { parseTime, formatTime } from '../src/rules/time.js';

it('formatTime then parseTime gives back the same minute (0..1439)', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 1439 }), (minutes) => {
      return parseTime(formatTime(minutes)) === minutes;
    }),
  );
});
