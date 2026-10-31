import { describe, it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

describe('parseTime', () => {
  it.each([
    ['00:00', 0],    // midnight
    ['07:00', 420],  // opening time
    ['12:30', 750],
    ['21:00', 1260], // closing time
    ['23:59', 1439], // last minute of the day
  ])('converts %s to %i minutes', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });
});
