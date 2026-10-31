import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { canCancel } from '../src/rules/cancel.js';
import { createLoginGuard } from '../src/auth/login-guard.js';

describe('practice 2.2', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T08:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    [59, false],
    [60, true],
    [61, true],
  ])('a booking %i minutes from now can be cancelled → %s', (minutes, expected) => {
    const startsAt = new Date(Date.now() + minutes * 60000);
    expect(canCancel(startsAt)).toBe(expected);
  });

  it('after the lock expires, 5 new failures lock the account again', () => {
    const guard = createLoginGuard();
    for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
    for (let i = 0; i < 4; i++) guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
    guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
  });
});
