import { describe, it, expect } from 'vitest';
import { makeBookingCode, seededRandom } from '../src/rules/code.js';

describe('practice 2.4', () => {
  it('20 short codes from seed 7 are all different — the same 20 on every run', () => {
    const random = seededRandom(7);
    const codes = Array.from({ length: 20 }, () => makeBookingCode(random, 2));
    expect(new Set(codes).size).toBe(20);
  });

  it('the same seed gives the same first code', () => {
    expect(makeBookingCode(seededRandom(7))).toBe(makeBookingCode(seededRandom(7)));
  });
});
