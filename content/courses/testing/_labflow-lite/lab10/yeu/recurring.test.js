// Lab 10 — FIRST ATTEMPT (weak): written after the code, two happy paths.
import { it, expect } from 'vitest';
import { weeklyDates } from '../../src/rules/recurring.js';

it('creates weekly dates', () => {
  const r = weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: '2026-12-31' });
  expect(r.ok).toBe(true);
  expect(r.dates.length).toBe(3);
});

it('skips holidays', () => {
  const r = weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: '2026-12-31', holidays: ['2026-11-09'] });
  expect(r.dates).not.toContain('2026-11-09');
});
