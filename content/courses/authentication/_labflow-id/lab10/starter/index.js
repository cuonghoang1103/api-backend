// lab10/starter/index.js — Lab 10 starter. Defend against credential stuffing WITHOUT locking real users.
// decide(signal) ⇒ 'allow' | 'challenge' | 'block'. signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }.
// Rules (see 10.1): a flooding IP (ipFails ≥ 100) or a spraying IP (ipAccounts ≥ 50) ⇒ 'block' even with a solved
// challenge (solver farms exist). A breached password with no solved challenge ⇒ 'challenge'. A suspicious IP
// (ipFails ≥ 20) or a many-times-failed account (accountFails ≥ 10) with no solved challenge ⇒ 'challenge' — NOT 'block'
// (a real user who mistypes must never be locked out). Otherwise ⇒ 'allow'.
export const DEFAULTS = { ipFailBlock: 100, ipAccountsBlock: 50, ipFailChallenge: 20, accountFailChallenge: 10 };
export function decide(signal, cfg = DEFAULTS) {
  // Write your solution here
  return 'allow';
}
