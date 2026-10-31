import { describe, it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking } from './booking.js';

describe('checkSlot', () => {
  describe('accepts', () => {
    it.each([
      { start: '07:00', end: '08:00', minutes: 60 },   // opens exactly at 07:00
      { start: '20:00', end: '21:00', minutes: 60 },   // ends exactly at 21:00
      { start: '08:00', end: '08:30', minutes: 30 },   // shortest: one grid cell
      { start: '08:00', end: '12:00', minutes: 240 },  // longest: exactly 4 hours
    ])('$start–$end ($minutes min)', ({ start, end, minutes }) => {
      expect(checkSlot(start, end)).toEqual({ ok: true, minutes });
    });
  });

  describe('rejects', () => {
    it.each([
      { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS' },    // before opening
      { start: '20:00', end: '21:30', code: 'OUTSIDE_HOURS' },    // after closing
      { start: '08:15', end: '09:00', code: 'OFF_GRID' },         // off the 30-minute grid
      { start: '08:00', end: '09:10', code: 'OFF_GRID' },
      { start: '10:00', end: '09:00', code: 'END_BEFORE_START' },
      { start: '09:00', end: '09:00', code: 'END_BEFORE_START' }, // zero minutes long
      { start: '08:00', end: '12:30', code: 'TOO_LONG' },         // 4 h 30
    ])('$start–$end with $code', ({ start, end, code }) => {
      expect(checkSlot(start, end)).toEqual({ ok: false, code });
    });
  });
});

describe('isWithinBookingWindow (BR-05)', () => {
  it.each([[-1, false], [0, true], [14, true], [15, false]])('%i days → %s', (days, ok) => {
    expect(isWithinBookingWindow(days)).toBe(ok);
  });
  it.each([1.5, NaN, '3', null])('rejects %s', (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });
});

describe('needsApproval (BR-06 decision table)', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role, $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });
  it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);
  });
});

describe('createBooking', () => {
  it('builds a PENDING booking for 31 seats', () => {
    const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
    expect(b).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'PENDING' });
  });
  it('throws the rule code for a bad slot', () => {
    expect(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '06:00', end: '07:00' }))
      .toThrow('OUTSIDE_HOURS');
  });
});
