// Model answer of the 20-minute live-coding exercise (lesson 10.4).
import { describe, it, expect } from 'vitest';
import { mergeBusy } from './busy.js';

const r = (start, end) => ({ start, end });

describe('mergeBusy', () => {
  it('returns no blocks for a day without bookings', () => {
    expect(mergeBusy([])).toEqual([]);
  });

  it('keeps separate bookings apart, sorted by start', () => {
    expect(mergeBusy([r('13:00', '14:00'), r('08:00', '09:00')])).toEqual([r('08:00', '09:00'), r('13:00', '14:00')]);
  });

  it.each([
    ['overlapping', [r('08:00', '10:00'), r('09:00', '11:00')], [r('08:00', '11:00')]],
    ['touching (10:00 ends, 10:00 starts)', [r('08:00', '10:00'), r('10:00', '11:00')], [r('08:00', '11:00')]],
    ['one inside the other', [r('08:00', '12:00'), r('09:00', '10:00')], [r('08:00', '12:00')]],
    ['inside, listed first', [r('09:00', '10:00'), r('08:00', '12:00')], [r('08:00', '12:00')]],
  ])('merges %s bookings into one block', (_, input, expected) => {
    expect(mergeBusy(input)).toEqual(expected);
  });

  it('does not change the array it was given', () => {
    const input = [r('10:00', '11:00'), r('08:00', '09:00')];
    mergeBusy(input);
    expect(input).toEqual([r('10:00', '11:00'), r('08:00', '09:00')]);
  });

  it('rejects a time that is not HH:MM', () => {
    expect(() => mergeBusy([r('8:00', '09:00')])).toThrow(TypeError);
  });
});
