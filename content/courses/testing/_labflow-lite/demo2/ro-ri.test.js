import { it, expect, vi } from 'vitest';
import { makeBookingCode } from '../src/rules/code.js';

it('A: Math.random mocked to 0 (and never restored)', () => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  expect(makeBookingCode()).toBe('LF-AAAAAA');
});

it('B: two fresh codes are different', () => {
  expect(makeBookingCode()).not.toBe(makeBookingCode());
});
