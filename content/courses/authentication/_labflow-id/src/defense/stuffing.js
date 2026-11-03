// src/defense/stuffing.js — Chapter 10 = Lab 10 reference: defend against credential stuffing WITHOUT locking real users.
// A classic account lockout ("5 wrong ⇒ lock the account") hands the attacker a denial-of-service: they lock every
// account by failing it on purpose. The modern answer defends the IP and the global failure pattern, challenges the
// suspicious, and lets a real user who mistypes their own password keep trying. One pure decision function, decide().
//
// signal = {
//   accountFails,   // consecutive failed logins for THIS account (resets on success)
//   ipFails,        // failed logins from THIS ip in the window (across all accounts)
//   ipAccounts,     // DISTINCT accounts this ip has tried in the window
//   breached,       // is the SUBMITTED password in a breach corpus? (k-anonymity, Ch2)
//   solvedChallenge // did this request carry a solved CAPTCHA / proof-of-work token?
// }
// ⇒ 'allow' | 'challenge' | 'block'. Order matters: a solved challenge clears the soft signals; the hard IP-spray
// signal still blocks even with a challenge, because a solver farm can pass CAPTCHAs.

export const DEFAULTS = {
  ipFailBlock: 100,      // this many failures from one ip in the window ⇒ block (a human never fails 100×)
  ipAccountsBlock: 50,   // one ip touching this many DISTINCT accounts ⇒ spraying ⇒ block
  ipFailChallenge: 20,   // softer: challenge the ip before it reaches the block threshold
  accountFailChallenge: 10, // challenge (not lock) an account after many consecutive fails — the mistyping user is NOT locked out, just asked to prove human
};

/** ⇒ 'allow' | 'challenge' | 'block'. Deny-by-spread, never lock a single account outright. */
export function decide(signal, cfg = DEFAULTS) {
  const s = signal || {};
  // 1. Hard block: a spraying IP. These never relent — a solved CAPTCHA does not clear them, because solver farms exist.
  if (s.ipFails >= cfg.ipFailBlock) return 'block';
  if (s.ipAccounts >= cfg.ipAccountsBlock) return 'block';
  // 2. A breached password being tried is the signature of stuffing (the creds came from a dump) — challenge it.
  //    (We never reveal WHY; the user just sees a challenge.)
  if (s.breached && !s.solvedChallenge) return 'challenge';
  // 3. Soft signals: challenge the suspicious IP or the many-times-failed account — a solved challenge clears these.
  if (!s.solvedChallenge && (s.ipFails >= cfg.ipFailChallenge || s.accountFails >= cfg.accountFailChallenge)) return 'challenge';
  // 4. Otherwise let the login proceed to the password check. A real user who mistypes a few times is here — never locked.
  return 'allow';
}
