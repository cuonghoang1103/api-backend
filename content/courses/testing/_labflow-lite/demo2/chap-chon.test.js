import { it, expect } from 'vitest';
import { makeBookingCode } from '../src/rules/code.js';

it('20 short codes are all different', () => {
  const codes = Array.from({ length: 20 }, () => makeBookingCode(Math.random, 2));
  expect(new Set(codes).size).toBe(20);
});
