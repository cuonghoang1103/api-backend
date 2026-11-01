import { describe, it, expect } from 'vitest';
import { canCancel, cancelDecision, startsAtVN } from './cancel.js';

const at = (clock) => new Date('2026-11-16T' + clock + ':00+07:00');

describe('canCancel (Lite-3: until 60 minutes before the start)', () => {
  it.each([
    ['07:00', true],  // 2 hours before
    ['08:00', true],  // exactly 60 minutes before — still allowed
    ['08:01', false], // 59 minutes before
    ['09:30', false], // after the start
  ])('at %s, a 09:00 booking can be cancelled → %s', (clock, expected) => {
    expect(canCancel(at('09:00'), at(clock))).toBe(expected);
  });
});

// US-11 "My bookings" (Chapter 11). Decision table: who asks × booking status × time left before the start.
describe('cancelDecision — who may cancel, and until when (US-11)', () => {
  const booking = { id: 7, userId: 'an', status: 'CONFIRMED', date: '2026-11-16', start: '09:00' };
  const an = { id: 'an', role: 'STUDENT' };
  const binh = { id: 'binh', role: 'STUDENT' };
  const thay = { id: 'thay', role: 'LECTURER' };
  const boss = { id: 'boss', role: 'ADMIN' };

  it.each([
    ['the owner, 2 hours before (AC2)', booking, an, '07:00', { ok: true }],
    ['the owner, exactly 60 minutes before (Lite-3, AC2)', booking, an, '08:00', { ok: true }],
    ['the owner, 59 minutes before (Lite-3, AC2)', booking, an, '08:01', { ok: false, code: 'TOO_LATE_TO_CANCEL' }],
    ['the owner, PENDING booking', { ...booking, status: 'PENDING' }, an, '07:00', { ok: true }],
    ['another student (AC3)', booking, binh, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['a lecturer who does not own it (AC3)', booking, thay, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['an admin, 2 hours before (AC6)', booking, boss, '07:00', { ok: true }],
    ['an admin, 30 minutes before — admins are not bound by Lite-3 (AC6)', booking, boss, '08:30', { ok: true }],
    ['the owner, already cancelled (AC4)', { ...booking, status: 'CANCELLED' }, an, '07:00', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['the owner, already cancelled AND too late → ALREADY_CANCELLED', { ...booking, status: 'CANCELLED' }, an, '08:30', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['an admin, already cancelled', { ...booking, status: 'CANCELLED' }, boss, '07:00', { ok: false, code: 'ALREADY_CANCELLED' }],
    ['anyone, a booking that does not exist', null, an, '07:00', { ok: false, code: 'NOT_FOUND' }],
    ['another student, a cancelled booking → NOT_FOUND, no leak (AC3)', { ...booking, status: 'CANCELLED' }, binh, '07:00', { ok: false, code: 'NOT_FOUND' }],
  ])('%s', (_, b, user, clock, expected) => {
    expect(cancelDecision(b, user, at(clock))).toEqual(expected);
  });
});

describe('startsAtVN', () => {
  it('reads date and start as Viet Nam time: 09:00 in Ha Noi is 02:00 UTC', () => {
    expect(startsAtVN('2026-11-16', '09:00').toISOString()).toBe('2026-11-16T02:00:00.000Z');
  });
});
