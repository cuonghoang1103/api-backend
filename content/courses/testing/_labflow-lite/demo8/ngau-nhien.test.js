// RED SOMETIMES: random test data.
import { it, expect } from 'vitest';
import { needsApproval } from '../src/rules/booking.js';

it('a student booking for a normal class is confirmed', () => {
  const seats = 1 + Math.floor(Math.random() * 40);       // "any realistic class size"
  expect(needsApproval({ seats, role: 'STUDENT' })).toBe(false);
});
