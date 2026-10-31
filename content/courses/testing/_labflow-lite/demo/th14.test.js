import { describe, it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

describe('checkSlot — length boundary (Lite-1: at most 240 minutes)', () => {
  it.each([
    { start: '08:00', end: '08:30', expected: { ok: true, minutes: 30 } },        // shortest valid
    { start: '08:00', end: '12:00', expected: { ok: true, minutes: 240 } },       // upper boundary: exactly 4 h
    { start: '08:00', end: '12:30', expected: { ok: false, code: 'TOO_LONG' } },  // boundary + one grid step
    { start: '08:00', end: '08:00', expected: { ok: false, code: 'END_BEFORE_START' } }, // zero minutes
  ])('$start–$end', ({ start, end, expected }) => {
    expect(checkSlot(start, end)).toEqual(expected);
  });
});
