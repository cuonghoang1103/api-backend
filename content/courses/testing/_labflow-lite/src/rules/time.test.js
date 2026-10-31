import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseTime, formatTime } from './time.js';

describe('parseTime', () => {
  it.each([['00:00', 0], ['07:00', 420], ['21:30', 1290], ['23:59', 1439]])('%s → %i', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });
  it.each(['7:00', '07-00', '', 'abc'])('throws TypeError for "%s"', (text) => {
    expect(() => parseTime(text)).toThrow(TypeError);
  });
  it.each(['24:00', '07:60'])('throws RangeError for %s', (text) => {
    expect(() => parseTime(text)).toThrow(RangeError);
  });
});

describe('formatTime', () => {
  it('pads to HH:MM', () => {
    expect(formatTime(450)).toBe('07:30');
  });
  it('round-trips with parseTime for every minute of the day', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1439 }), (m) => {
        expect(parseTime(formatTime(m))).toBe(m); // an expect inside, so requireAssertions is satisfied
      }),
    );
  });
});
