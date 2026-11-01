// A candidate's tests after 20 minutes, the WEAK version (lesson 10.4): two happy paths.
import { it, expect } from 'vitest';
import { mergeBusy } from '../../src/rules/busy.js';

it('test mergeBusy', () => {
  const result = mergeBusy([{ start: '08:00', end: '10:00' }, { start: '09:00', end: '11:00' }]);
  expect(result.length).toBe(1);
});

it('test mergeBusy 2', () => {
  expect(mergeBusy([{ start: '08:00', end: '09:00' }, { start: '13:00', end: '14:00' }])).toBeTruthy();
});
