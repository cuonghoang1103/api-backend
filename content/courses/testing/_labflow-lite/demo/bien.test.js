import { describe, it, expect } from 'vitest';
import { isWithinBookingWindow, needsApproval } from '../src/rules/booking.js';

describe('isWithinBookingWindow (BR-05: at most 14 days ahead)', () => {
  it.each([
    [-1, false],   // lower boundary - 1
    [0, true],     // lower boundary: today
    [1, true],     // lower boundary + 1
    [13, true],    // upper boundary - 1
    [14, true],    // upper boundary: "exactly 14 is still valid"
    [15, false],   // upper boundary + 1
  ])('%i days ahead → %s', (days, expected) => {
    expect(isWithinBookingWindow(days)).toBe(expected);
  });

  it.each([1.5, NaN, '3', null])('rejects a non-integer input: %s', (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });
});

describe('needsApproval — decision table (role × seats > 30)', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 30, expected: false },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 30, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role with $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });

  it.each([0, -5, 2.5])('throws RangeError for seats = %s', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);
  });
});
