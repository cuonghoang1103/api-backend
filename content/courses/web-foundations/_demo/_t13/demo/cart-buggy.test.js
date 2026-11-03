import { it, expect } from 'vitest';
import { shipping } from '../src/cart-buggy.js';

// The same boundary test, pointed at the teammate's refactor
it('an order of exactly 500 000đ ships free', () => {
  expect(shipping(500_000)).toBe(0);
});
