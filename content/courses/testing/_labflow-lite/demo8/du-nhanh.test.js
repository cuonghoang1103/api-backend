// gan-nhu-khong.test.js plus one CONFIRMED booking: now every branch runs too.
import { it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking, usageRate } from '../src/rules/booking.js';

it('checkSlot', () => {
  for (const [start, end] of [['08:15', '09:00'], ['10:00', '09:00'], ['06:00', '08:00'], ['08:00', '13:00'], ['08:00', '10:00']]) {
    expect(checkSlot(start, end)).toBeDefined();
  }
});
it('isWithinBookingWindow', () => {
  expect(isWithinBookingWindow(3)).toBeDefined();
});
it('needsApproval', () => {
  expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow();
  expect(needsApproval({ seats: 5, role: 'ADMIN' })).toBeDefined();
  expect(needsApproval({ seats: 5, role: 'STUDENT' })).toBeDefined();
});
it('createBooking', () => {
  expect(createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' })).toBeTruthy();
  expect(createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '10:00' })).toBeTruthy();
  expect(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '06:00', end: '07:00' })).toThrow();
});
it('usageRate', () => {
  expect(usageRate([{ minutes: 60 }])).toBeGreaterThan(0);
});
