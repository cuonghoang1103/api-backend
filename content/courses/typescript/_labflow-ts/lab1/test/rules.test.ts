// Lab 1 — behaviour must not change while you add types. Run: node --test --test-reporter=spec lab1/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTime, formatTime } from '../src/time.ts';
import { checkSlot, needsApproval, createBooking, usageRate, isWithinBookingWindow } from '../src/booking.ts';

test('parseTime: 07:00 is minute 420', () => assert.equal(parseTime('07:00'), 420));
test('parseTime: rejects 7:00', () => assert.throws(() => parseTime('7:00'), TypeError));
test('parseTime: rejects 23:60', () => assert.throws(() => parseTime('23:60'), RangeError));
test('formatTime: 1290 is 21:30', () => assert.equal(formatTime(1290), '21:30'));
test('checkSlot: 08:00–10:00 lasts 120 minutes', () =>
  assert.deepEqual(checkSlot('08:00', '10:00'), { ok: true, minutes: 120 }));
test('checkSlot: 06:30 starts before opening', () =>
  assert.deepEqual(checkSlot('06:30', '08:00'), { ok: false, code: 'OUTSIDE_HOURS' }));
test('checkSlot: 08:00–12:30 is too long', () =>
  assert.deepEqual(checkSlot('08:00', '12:30'), { ok: false, code: 'TOO_LONG' }));
test('needsApproval: 31 student seats', () => assert.equal(needsApproval({ seats: 31, role: 'STUDENT' }), true));
test('needsApproval: 30 student seats', () => assert.equal(needsApproval({ seats: 30, role: 'STUDENT' }), false));
test('needsApproval: admins never wait', () => assert.equal(needsApproval({ seats: 200, role: 'ADMIN' }), false));
test('needsApproval: 0 seats is a RangeError', () =>
  assert.throws(() => needsApproval({ seats: 0, role: 'STUDENT' }), RangeError));
test('createBooking: off-grid slot throws OFF_GRID', () =>
  assert.throws(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:15', end: '09:00' }), /OFF_GRID/));
test('createBooking: a lecturer with 31 seats is CONFIRMED', () =>
  assert.equal(createBooking({ lab: 'BE-201', seats: 31, role: 'LECTURER', start: '13:00', end: '15:30' }).status, 'CONFIRMED'));
test('usageRate: 210 + 210 minutes is half a day', () => assert.equal(usageRate([{ minutes: 210 }, { minutes: 210 }]), 0.5));
test('isWithinBookingWindow: 14 days ahead is allowed, 15 is not', () => {
  assert.equal(isWithinBookingWindow(14), true);
  assert.equal(isWithinBookingWindow(15), false);
});
