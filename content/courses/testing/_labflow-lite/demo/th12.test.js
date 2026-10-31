import { it, expect } from 'vitest';
import { needsApproval, usageRate, checkSlot } from '../src/rules/booking.js';

it('rejects 0 seats with a RangeError that explains why', () => {
  expect(() => needsApproval({ role: 'STUDENT', seats: 0 })).toThrow(RangeError);
  expect(() => needsApproval({ role: 'STUDENT', seats: 0 })).toThrow(/positive integer/);
});

it('usage of 120 + 30 minutes is about 17.86% of the day', () => {
  expect(usageRate([{ minutes: 120 }, { minutes: 30 }])).toBeCloseTo(0.1786, 4);
});

it('an off-grid slot is not ok', () => {
  expect(checkSlot('08:10', '09:00')).toMatchObject({ ok: false });
  expect(checkSlot('08:10', '09:00')).not.toHaveProperty('minutes');
});

it('06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten)', () => {
  expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
});
