import { it, expect } from 'vitest';
import { isWithinBookingWindow } from '../src/rules/booking.js';

it('test 2', () => {
  expect(isWithinBookingWindow(14)).toBe(true);
});
