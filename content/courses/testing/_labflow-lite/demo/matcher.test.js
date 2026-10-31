import { describe, it, expect } from 'vitest';
import { createBooking, checkSlot, usageRate } from '../src/rules/booking.js';
import { parseTime } from '../src/rules/time.js';

const input = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('toBe vs toEqual', () => {
  it('toBe on an object', () => {
    expect(createBooking(input)).toBe({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });
  it('toEqual on an object', () => {
    expect(createBooking(input)).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });
});

describe('numbers', () => {
  it('usage of 30 + 120 + 60 minutes is 25% (toBe)', () => {
    expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }])).toBe(0.25);
  });
  it('usage of 30 + 120 + 60 minutes is 25% (toBeCloseTo)', () => {
    expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }])).toBeCloseTo(0.25);
  });
});

describe('truthy trap', () => {
  it('an invalid slot is still truthy', () => {
    expect(checkSlot('06:30', '08:00')).toBeTruthy();
  });
});

describe('errors', () => {
  it('without a wrapper function', () => {
    expect(parseTime('7h')).toThrow();
  });
  it('with a wrapper function', () => {
    expect(() => parseTime('7h')).toThrow(TypeError);
    expect(() => parseTime('7h')).toThrow(/expected HH:MM/);
  });
});
