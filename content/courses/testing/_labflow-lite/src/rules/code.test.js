// Promoted from practice 2.4 (demo2/th24.test.js) in lesson 8.1: a test in a demo folder protects nothing in CI.
import { describe, it, expect } from 'vitest';
import { makeBookingCode, seededRandom, ALPHABET, newBookingRecord } from './code.js';

describe('makeBookingCode', () => {
  it('is "LF-" and 6 characters from the readable alphabet', () => {
    expect(makeBookingCode(seededRandom(7))).toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/);
  });
  it('the same seed gives the same code; 20 codes from one seed are all different', () => {
    expect(makeBookingCode(seededRandom(7))).toBe(makeBookingCode(seededRandom(7)));
    const random = seededRandom(7);
    expect(new Set(Array.from({ length: 20 }, () => makeBookingCode(random, 2))).size).toBe(20);
  });
  it('can produce the first and the last character of the alphabet', () => {
    expect(makeBookingCode(() => 0, 1)).toBe('LF-' + ALPHABET[0]);
    expect(makeBookingCode(() => 0.9999, 1)).toBe('LF-' + ALPHABET.at(-1));
  });
});

describe('newBookingRecord', () => {
  it('takes its id and clock from the caller', () => {
    const record = newBookingRecord({ lab: 'BE-201' }, { newId: () => 'b-1', now: () => new Date('2026-11-16T01:00:00Z') });
    expect(record).toMatchObject({ id: 'b-1', createdAt: '2026-11-16T01:00:00.000Z', lab: 'BE-201' });
  });
});
