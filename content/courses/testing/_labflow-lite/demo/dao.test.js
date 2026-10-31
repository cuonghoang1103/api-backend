import { it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

it('07:30 is 420 minutes (wrong expectation, arguments swapped)', () => {
  expect(420).toBe(parseTime('07:30'));
});
