import { parseTime } from './time.js';

/** @typedef {'STUDENT' | 'LECTURER' | 'ADMIN'} Role */

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

/** @param {string} start  @param {string} end */
export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

/** @param {number} daysAhead */
export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

/** @param {{ seats: number, role: Role }} input */
export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

/** @param {{ lab: string, seats: number, role: Role, start: string, end: string }} input */
export function createBooking({ lab, seats, role, start, end }) {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
/** @param {{ minutes: number }[]} bookings */
export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}
