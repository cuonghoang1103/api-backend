// Lesson 8.2: one test per gap that Stryker's survivors pointed at. Each comment names the mutant it kills.
import { describe, it, expect } from 'vitest';
import { needsApproval, createBooking, usageRate } from './booking.js';
import { parseTime } from './time.js';
import { newBookingRecord } from './code.js';

describe('booking rules: the cases nobody wrote', () => {
  it('one seat is a valid booking', () => {                      // seats < 1  →  seats <= 1
    expect(needsApproval({ seats: 1, role: 'STUDENT' })).toBe(false);
  });
  it('the error says what was wrong', () => {                      // message → ""
    expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow('seats must be a positive integer, got 0');
  });
  it('a small student booking is CONFIRMED', () => {               // 'CONFIRMED' → ""
    expect(createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '08:00', end: '09:00' }).status).toBe('CONFIRMED');
  });
  it('usageRate adds up the booked share of the 14 opening hours', () => {   // += → -=, / → *, CLOSE - OPEN → CLOSE + OPEN
    expect(usageRate([{ minutes: 420 }, { minutes: 210 }])).toBe(0.75);
  });
});

describe('parseTime: only exactly HH:MM', () => {
  it.each(['08:000', '108:00'])('refuses %s', (text) => {        // ^ and $ removed from the regex
    expect(() => parseTime(text)).toThrow('Invalid time "' + text + '", expected HH:MM');
  });
  it('the TypeError is ours, not a crash on null', () => {          // if (!m) → if (false)
    expect(() => parseTime('7:00')).toThrow('expected HH:MM');
  });
  it('says which time is out of range', () => {                    // message → ""
    expect(() => parseTime('24:00')).toThrow('Time out of range: 24:00');
  });
});

describe('newBookingRecord without injected helpers', () => {
  it('makes a UUID and stamps the current time', () => {           // default newId / now → () => undefined
    const before = Date.now();
    const record = newBookingRecord({ lab: 'BE-201' });
    expect(record.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Date.parse(record.createdAt)).toBeGreaterThanOrEqual(before);
  });
});
