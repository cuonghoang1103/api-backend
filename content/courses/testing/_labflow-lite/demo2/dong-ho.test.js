import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { canCancel } from '../src/rules/cancel.js';
import { createLoginGuard } from '../src/auth/login-guard.js';

describe('canCancel (Lite-3: until 60 minutes before)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T07:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('“now” is frozen: new Date() returns the time we set', () => {
    expect(new Date().toISOString()).toBe('2026-11-16T00:00:00.000Z');
  });

  it.each([
    ['07:59', true],  // 61 minutes before 09:00
    ['08:00', true],  // exactly 60 minutes before 09:00
    ['08:01', false], // 59 minutes before
  ])('at %s a 09:00 booking can be cancelled: %s', (clock, expected) => {
    vi.setSystemTime(new Date('2026-11-16T' + clock + ':00+07:00'));
    expect(canCancel(new Date('2026-11-16T09:00:00+07:00'))).toBe(expected);
  });
});

describe('login guard (BR-02) with fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-16T07:00:00+07:00'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('unlocks exactly 15 minutes after the 5th failure', () => {
    const guard = createLoginGuard();
    for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

    vi.advanceTimersByTime(15 * 60 * 1000 - 1); // 14:59.999 later
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);

    vi.advanceTimersByTime(1); // exactly 15:00 later
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });
});
