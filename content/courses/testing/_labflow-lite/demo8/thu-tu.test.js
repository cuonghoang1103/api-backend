// RED SOMETIMES: two tests share one login guard, so the result depends on their order.
import { it, expect } from 'vitest';
import { createLoginGuard } from '../src/auth/login-guard.js';

const guard = createLoginGuard(() => Date.parse('2026-11-16T08:00:00Z'));   // shared by every test below

it('a user with no failures is not locked', () => {
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(false);
});

it('5 wrong passwords lock the account', () => {
  for (let i = 0; i < 5; i++) guard.recordFailure('an@fpt.edu.vn');
  expect(guard.isLocked('an@fpt.edu.vn')).toBe(true);
});

it('one wrong password does not lock', () => {
  guard.recordFailure('binh@fpt.edu.vn');
  expect(guard.isLocked('binh@fpt.edu.vn')).toBe(false);
});
