import { describe, it, expect } from 'vitest';
import { subtotal, shipping, applyCoupon, total } from '../src/cart.js';

const pen = { name: 'pen', price: 15_000, qty: 2 };
const book = { name: 'book', price: 120_000, qty: 1 };

describe('subtotal', () => {
  it('adds price × qty for every item', () => {
    // Arrange
    const items = [pen, book];
    // Act
    const result = subtotal(items);
    // Assert
    expect(result).toBe(150_000);
  });

  it('is 0 for an empty cart', () => {
    expect(subtotal([])).toBe(0);
  });
});

describe('shipping', () => {
  it.each([
    [0, 30_000],
    [499_999, 30_000],
    [500_000, 0],        // the boundary: exactly the threshold ships free
    [1_200_000, 0],
  ])('order of %i đ ships for %i đ', (amount, expected) => {
    expect(shipping(amount)).toBe(expected);
  });
});

describe('applyCoupon', () => {
  it('takes the percentage off and rounds to a whole đồng', () => {
    expect(applyCoupon(99_999, 10)).toBe(89_999);
  });

  it.each([0, 51, 12.5, -5])('rejects %s', (bad) => {
    expect(() => applyCoupon(100_000, bad)).toThrow(RangeError);
  });
});

describe('total', () => {
  it('free shipping applies AFTER the coupon', () => {
    const items = [{ name: 'shoes', price: 520_000, qty: 1 }];
    // 520 000 − 10% = 468 000 < 500 000 ⇒ shipping is charged again
    expect(total(items, 10)).toBe(498_000);
  });

  it('returns a plain object comparison example', () => {
    const order = { items: [pen], total: total([pen]) };
    expect(order).toEqual({ items: [{ name: 'pen', price: 15_000, qty: 2 }], total: 60_000 });
  });
});
