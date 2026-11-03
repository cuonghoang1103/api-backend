// demo10/pre-hijack-race.mjs — account pre-hijacking and a TOCTOU race, with the fixes (Chapter 10, 10.5).
// PRE-HIJACKING: the attacker creates an account with the VICTIM's email BEFORE the victim ever signs up, and sits on
// it. When the victim later "Signs in with Google" (OIDC, Chapter 8), a naive server finds a local account with that
// email and ATTACHES the federated identity to it — the attacker's pre-existing session/password still works, so they
// keep access. The fix: an unverified pre-existing account must not be merged into; verify ownership first (or discard
// the stale unverified record on federated first-login). We model both.
function federatedFirstLogin(mode, pre) {
  // pre = the pre-existing local account (attacker's), unverified. The victim federates with the same email.
  if (mode === 'naive') return { account: pre, attackerRetainsAccess: true };             // attach to the stale record
  // defended: an UNVERIFIED pre-existing account is discarded; a fresh, verified-by-the-IdP account is created.
  if (!pre.verified) return { account: { id: 'fresh', verified: true, owner: 'victim' }, attackerRetainsAccess: false };
  return { account: pre, attackerRetainsAccess: false };
}
const pre = { id: 'preacct', email: 'victim@labflow.example', verified: false, owner: 'attacker' };
console.log('PRE-HIJACKING: attacker pre-created victim@ (unverified); victim later signs in with Google.');
console.log(`  A) naive "attach by email"   → attacker retains access: ${federatedFirstLogin('naive', pre).attackerRetainsAccess}`);
console.log(`  B) discard-stale-unverified  → attacker retains access: ${federatedFirstLogin('defended', pre).attackerRetainsAccess}\n`);

// TOCTOU RACE: a one-time password-reset token redeemed by two concurrent requests. Check-then-act ("is it unused? then
// use it") lets BOTH pass the check before either marks it used. An ATOMIC consume (mark used and return the prior
// state in one step — SQL: UPDATE ... WHERE used_at IS NULL RETURNING) lets exactly one win.
function raceCheckThenAct() {
  const token = { usedAt: null };
  const redeem = () => { if (token.usedAt === null) { /* ... async gap ... */ return true; } return false; };
  const a = redeem(), b = redeem();                 // both read usedAt === null before either writes
  token.usedAt = Date.now();
  return [a, b].filter(Boolean).length;             // how many "succeeded"
}
function raceAtomic() {
  const token = { usedAt: null };
  const consume = () => { if (token.usedAt === null) { token.usedAt = Date.now(); return true; } return false; };  // check+write together
  const a = consume(), b = consume();
  return [a, b].filter(Boolean).length;
}
console.log('TOCTOU RACE: two concurrent redemptions of a ONE-time reset token.');
console.log(`  A) check-then-act   → successful redemptions: ${raceCheckThenAct()}   (both passed the check — the token was used twice)`);
console.log(`  B) atomic consume   → successful redemptions: ${raceAtomic()}   (UPDATE ... WHERE used_at IS NULL RETURNING — exactly one)`);
console.log('\n⇒ Pre-hijacking: never merge a federated login into an UNVERIFIED pre-existing account (Chapter 6 verification,');
console.log('  Chapter 8 link-on-sub). Races: make the one-time action ATOMIC at the database, not a check then a write.');
