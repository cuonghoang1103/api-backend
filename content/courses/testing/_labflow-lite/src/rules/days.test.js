import { describe, it, expect } from 'vitest';
import { daysAheadVN } from './days.js';

describe('daysAheadVN (BR-05 counted in Viet Nam time)', () => {
  it.each([
    ['2026-11-02T06:30:00+07:00', '2026-11-16', 14], // early morning in VN = previous day in UTC
    ['2026-11-02T23:59:00+07:00', '2026-11-16', 14],
    ['2026-11-03T00:00:00+07:00', '2026-11-16', 13], // midnight in VN starts a new day
    ['2026-11-02T06:30:00+07:00', '2026-11-02', 0],
  ])('now %s → %s is %i days ahead', (now, date, expected) => {
    expect(daysAheadVN(date, new Date(now))).toBe(expected);
  });
});
