// RED SOMETIMES: the answer depends on the real clock of the machine.
import { it, expect } from 'vitest';
import { daysAheadVN } from '../src/rules/days.js';

it('a booking for tomorrow is 1 day ahead', () => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  expect(daysAheadVN(tomorrow)).toBe(1);
});
