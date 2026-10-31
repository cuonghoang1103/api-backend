// BR-02: 5 wrong passwords in a row lock the account for 15 minutes.
export const MAX_FAILURES = 5;
export const LOCK_MINUTES = 15;

export function createLoginGuard(now = () => Date.now()) {
  const state = new Map(); // email -> { failures, lockedUntil }
  return {
    isLocked(email) {
      const s = state.get(email);
      return Boolean(s && s.lockedUntil > now());
    },
    recordFailure(email) {
      const s = state.get(email) ?? { failures: 0, lockedUntil: 0 };
      s.failures += 1;
      if (s.failures >= MAX_FAILURES) {
        s.lockedUntil = now() + LOCK_MINUTES * 60000;
        s.failures = 0;
      }
      state.set(email, s);
    },
    recordSuccess(email) {
      state.delete(email);
    },
  };
}
