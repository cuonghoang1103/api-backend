import { describe, it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking } from './booking.js';

describe('checkSlot', () => {
  describe('accepts', () => {
    it.each([
      { start: '07:00', end: '08:00', minutes: 60, rule: 'BR-04' },   // opens exactly at 07:00
      { start: '20:00', end: '21:00', minutes: 60, rule: 'BR-04' },   // ends exactly at 21:00
      { start: '08:00', end: '08:30', minutes: 30, rule: 'BR-04' },   // shortest: one grid cell
      { start: '08:00', end: '12:00', minutes: 240, rule: 'Lite-1' }, // longest: exactly 4 hours
    ])('$start–$end ($minutes min) $rule', ({ start, end, minutes }) => {   // $rule: traceability (lesson 11.1)
      expect(checkSlot(start, end)).toEqual({ ok: true, minutes });
    });
  });

  describe('rejects', () => {
    it.each([
      { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS', rule: 'BR-04' },    // before opening
      { start: '20:00', end: '21:30', code: 'OUTSIDE_HOURS', rule: 'BR-04' },    // after closing
      { start: '08:15', end: '09:00', code: 'OFF_GRID', rule: 'BR-04' },         // off the 30-minute grid
      { start: '08:00', end: '09:10', code: 'OFF_GRID', rule: 'BR-04' },
      { start: '10:00', end: '09:00', code: 'END_BEFORE_START', rule: 'BR-04' },
      { start: '09:00', end: '09:00', code: 'END_BEFORE_START', rule: 'BR-04' }, // zero minutes long
      { start: '08:00', end: '12:30', code: 'TOO_LONG', rule: 'Lite-1' },        // 4 h 30
    ])('$start–$end with $code $rule', ({ start, end, code }) => {
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
    { role: 'STUDENT', seats: 30, expected: false, also: '' },
    { role: 'STUDENT', seats: 31, expected: true, also: '' },
    { role: 'LECTURER', seats: 31, expected: false, also: 'Lite-2' },
    { role: 'ADMIN', seats: 31, expected: false, also: 'Lite-2' },
  ])('$role, $seats seats → $expected $also', ({ role, seats, expected }) => {
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
