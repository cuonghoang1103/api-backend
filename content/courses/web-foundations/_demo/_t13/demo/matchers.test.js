import { it, expect } from 'vitest';

it('toBe compares with Object.is — fine for numbers and strings', () => {
  expect(2 + 2).toBe(4);
});

it('toBe fails for two look-alike objects', () => {
  expect({ id: 1 }).toBe({ id: 1 });
});

it('toEqual compares contents', () => {
  expect({ id: 1, tags: ['a'] }).toEqual({ id: 1, tags: ['a'] });
});

it('0.1 + 0.2 is not exactly 0.3', () => {
  expect(0.1 + 0.2).toBe(0.3);
});

it('toBeCloseTo for decimals', () => {
  expect(0.1 + 0.2).toBeCloseTo(0.3);
});
