import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkSlot, needsApproval, createBooking, usageRate } from './booking.ts';

test('08:00–10:00 is a 120-minute slot', () => {
  assert.deepEqual(checkSlot('08:00', '10:00'), { ok: true, minutes: 120 });
});

test('08:15 is off the 30-minute grid', () => {
  assert.deepEqual(checkSlot('08:15', '09:00'), { ok: false, code: 'OFF_GRID' });
});

test('a student needs approval above 30 seats (BR-06)', () => {
  assert.equal(needsApproval({ seats: 31, role: 'STUDENT' }), true);
});

test('a lecturer never needs approval', () => {
  assert.equal(needsApproval({ seats: 31, role: 'LECTURER' }), false);
});

test('createBooking returns a PENDING 31-seat student booking', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  assert.deepEqual(b, { lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'PENDING' });
});

test('two 7-hour days fill the lab once', () => {
  assert.equal(usageRate([{ minutes: 420 }, { minutes: 420 }]), 1);
});
