import { it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

it('unit: 06:30 is before opening time', () => {
  expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
});
