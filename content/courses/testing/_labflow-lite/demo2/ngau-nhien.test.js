import { describe, it, expect, vi, afterEach } from 'vitest';
import { makeBookingCode, seededRandom, newBookingRecord, ALPHABET } from '../src/rules/code.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('makeBookingCode', () => {
  it('inject the randomness: first and last letter of the alphabet', () => {
    expect(makeBookingCode(() => 0)).toBe('LF-AAAAAA');
    expect(makeBookingCode(() => 0.999999)).toBe('LF-999999');
  });

  it('a seeded generator gives the same codes on every run', () => {
    const random = seededRandom(42);
    expect([makeBookingCode(random), makeBookingCode(random)]).toEqual(['LF-VQ5XFS', 'LF-JV5RH6']);
  });

  it('spy on Math.random when the code does not take a parameter', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(makeBookingCode()).toBe('LF-' + ALPHABET[16].repeat(6));
  });

  it('assert the shape when the value is truly random', () => {
    expect(makeBookingCode()).toMatch(/^LF-[A-HJ-NP-Z2-9]{6}$/);
  });
});

describe('newBookingRecord', () => {
  it('fixed id and clock make the whole record predictable', () => {
    const record = newBookingRecord(
      { lab: 'BE-201', start: '08:00' },
      { newId: () => 'id-1', now: () => new Date('2026-11-16T01:00:00Z') },
    );
    expect(record).toEqual({
      id: 'id-1',
      code: expect.stringMatching(/^LF-/),
      createdAt: '2026-11-16T01:00:00.000Z',
      lab: 'BE-201',
      start: '08:00',
    });
  });
});
