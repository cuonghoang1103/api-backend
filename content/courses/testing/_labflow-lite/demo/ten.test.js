import { describe, it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

describe('checkSlot', () => {
  describe('when the slot is valid', () => {
    it('returns ok with the length in minutes', () => {
      expect(checkSlot('08:00', '10:00')).toEqual({ ok: true, minutes: 120 });
    });
  });

  describe('when the slot breaks a rule', () => {
    it.each([
      { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS' },
      { start: '20:00', end: '21:30', code: 'OUTSIDE_HOURS' },
      { start: '08:15', end: '09:00', code: 'OFF_GRID' },
      { start: '10:00', end: '09:00', code: 'END_BEFORE_START' },
      { start: '08:00', end: '12:30', code: 'TOO_LONG' },
    ])('rejects $start–$end with $code', ({ start, end, code }) => {
      expect(checkSlot(start, end)).toEqual({ ok: false, code });
    });
  });

  it.todo('rejects a slot on a day the lab is closed');
});
