import { describe, it, expect, beforeEach } from 'vitest';
import { createLoginGuard } from './login-guard.js';

describe('createLoginGuard (BR-02: 5 failures → locked 15 minutes)', () => {
  let clock;
  let guard;
  beforeEach(() => {
    clock = 1_000_000;                  // a fake clock we move by hand
    guard = createLoginGuard(() => clock);
  });
  const fail = (n) => { for (let i = 0; i < n; i++) guard.recordFailure('an@fpt.edu.vn'); };

  it('4 failures do not lock', () => {
    fail(4);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('the 5th failure locks', () => {
    fail(5);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
  });

  it('still locked at 14:59.999, unlocked at exactly 15:00', () => {
    fail(5);
    clock += 15 * 60 * 1000 - 1;
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
    clock += 1;
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('a successful login resets the counter', () => {
    fail(4);
    guard.recordSuccess('an@fpt.edu.vn');
    fail(1);
    expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
  });

  it('locks only the account that failed', () => {
    fail(5);
    expect(guard.isLocked('binh@fpt.edu.vn')).toBe(false);
  });
});
