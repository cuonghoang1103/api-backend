import { it, expect, vi } from 'vitest';

it('A: freezes the clock in 2020 (and forgets useRealTimers)', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2020-01-01T00:00:00Z'));
  expect(new Date().getFullYear()).toBe(2020);
});

it('B: today is in 2026 or later', () => {
  expect(new Date().getFullYear()).toBeGreaterThanOrEqual(2026);
});
