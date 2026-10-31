import { it, expect } from 'vitest';
import { daysAheadNaive } from './days-sai.js';
import { daysAheadVN } from '../src/rules/days.js';

// 06:30 on 2 November in Viet Nam = 23:30 on 1 November in UTC
const now = new Date('2026-11-02T06:30:00+07:00');

it('naive: 16 November is 14 days ahead', () => {
  expect(daysAheadNaive('2026-11-16', now)).toBe(14);
});

it('VN calendar: 16 November is 14 days ahead', () => {
  expect(daysAheadVN('2026-11-16', now)).toBe(14);
});
