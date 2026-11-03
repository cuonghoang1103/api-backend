// lab10/yeu/index.js — a defense that "stops the attack" on a quick test, but LOCKS the account after 5 fails — so the
// attacker can lock every real user on purpose (a denial-of-service), and it has no IP-spread signal at all.
export const DEFAULTS = { ipFailBlock: 100, ipAccountsBlock: 50, ipFailChallenge: 20, accountFailChallenge: 10 };
export function decide(signal, cfg = DEFAULTS) {
  const s = signal || {};
  if (s.accountFails >= 5) return 'block';            // ❌ naive lockout — locks the real owner too (a DoS)
  if (s.ipFails >= cfg.ipFailBlock) return 'block';
  if (s.breached) return 'challenge';                 // ❌ ignores solvedChallenge
  return 'allow';                                     // ❌ no spread (ipAccounts) signal
}
