/**
 * _ma.mjs (Chương 10) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  stuffing: `// src/defense/stuffing.js — Chapter 10 = Lab 10 reference: defend against credential stuffing WITHOUT locking real users.
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
}`,
  grader10: `// scripts/cham-lab-10.mjs — grader of Lab 10 (credential-stuffing defense). 6 checks, 10 points, pass = 7.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab10/my', 'index.js')).href);
const decide = m.decide;
const base = { accountFails: 0, ipFails: 0, ipAccounts: 0, breached: false, solvedChallenge: false };
const sig = (o) => ({ ...base, ...o });
const results = [];
const expect = (c, why) => { if (!c) throw Object.assign(new Error(why), { name: 'Expected' }); };
function check(name, points, fn) { let why = ''; try { why = fn() || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`threw \${e?.name}: \${String(e?.message).split('\\n')[0]}\`; } results.push({ name, points, ok: !why, why }); }

check('T1 a flooding IP is blocked', 2, () => {
  expect(decide(sig({ ipFails: 100 })) === 'block', 'ipFails ≥ 100 must block (a human never fails 100×)');
  expect(decide(sig({ ipFails: 250 })) === 'block', 'a worse flood must still block');
});
check('T2 a spraying IP (many accounts) is blocked', 2, () => {
  expect(decide(sig({ ipAccounts: 50 })) === 'block', 'one IP touching 50 distinct accounts is spraying ⇒ block');
  expect(decide(sig({ ipAccounts: 200 })) === 'block', 'more spread must still block');
});
check('T3 a breached password is challenged (not allowed, not blocked)', 1.5, () => {
  expect(decide(sig({ breached: true })) === 'challenge', 'a breached password with no solved challenge ⇒ challenge');
  expect(decide(sig({ breached: true, solvedChallenge: true })) === 'allow', 'a solved challenge clears the breached soft signal ⇒ allow');
});
check('T4 a real user who mistypes is CHALLENGED, never blocked', 2, () => {
  expect(decide(sig({ accountFails: 10 })) === 'challenge', 'many account fails ⇒ challenge (prove human), NOT block');
  expect(decide(sig({ accountFails: 999 })) !== 'block', 'a single account must NEVER be hard-blocked by its own fail count (that is the attacker\\'s DoS)');
});
check('T5 a clean login is allowed', 1, () => {
  expect(decide(sig({})) === 'allow', 'a clean signal must allow the password check to proceed');
  expect(decide(sig({ accountFails: 1, ipFails: 2 })) === 'allow', 'a couple of fails is normal ⇒ allow');
});
check('T6 a solved challenge clears soft signals but NOT the hard IP block', 1.5, () => {
  expect(decide(sig({ ipFails: 20, solvedChallenge: true })) === 'allow', 'a solved challenge clears a soft IP signal');
  expect(decide(sig({ accountFails: 10, solvedChallenge: true })) === 'allow', 'a solved challenge clears the account signal');
  expect(decide(sig({ ipFails: 100, solvedChallenge: true })) === 'block', 'a solved challenge must NOT clear a hard IP flood (solver farms pass CAPTCHAs)');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 10 — \${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab10/my', 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(62)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu10: `// lab10/yeu/index.js — a defense that "stops the attack" on a quick test, but LOCKS the account after 5 fails — so the
// attacker can lock every real user on purpose (a denial-of-service), and it has no IP-spread signal at all.
export const DEFAULTS = { ipFailBlock: 100, ipAccountsBlock: 50, ipFailChallenge: 20, accountFailChallenge: 10 };
export function decide(signal, cfg = DEFAULTS) {
  const s = signal || {};
  if (s.accountFails >= 5) return 'block';            // ❌ naive lockout — locks the real owner too (a DoS)
  if (s.ipFails >= cfg.ipFailBlock) return 'block';
  if (s.breached) return 'challenge';                 // ❌ ignores solvedChallenge
  return 'allow';                                     // ❌ no spread (ipAccounts) signal
}`,
};
export const OUT = {
  '101-stuffing': `$ node demo10/stuffing-run.mjs
Replaying 10009 login attempts: a 10k-password spray (3 IPs, 2/3 breached) + real users, one mistyping 6×.

A) Naive per-account lockout (5 strikes ⇒ lock the account):
   attacker logins that succeeded : 1   (the breached reuse got in before lockout)
   REAL users locked out of their own account : 2   ← the attacker DoS-locked them

B) decide() — defend the IP/spread, challenge the breached, never lock an account:
   attacker logins that succeeded : 0
   REAL users locked out : 0   ← the mistyping user kept trying and got in
   attacker requests challenged : 128 · hard-blocked (IP spray) : 9854

⇒ A lockout stops the spray but lets the attacker lock every real account on purpose (a DoS). decide()
  challenges the breached-password spray, escalates a flooding IP to a hard block, and a real user who
  mistypes is never locked out.`,
  '102-relay': `$ node demo10/relay.mjs
AiTM relay: victim on https://login.labflovv.example, attacker replays to https://id.labflow.example

  password  → attacker STEALS the session  (a replayable secret: the relay captures it and replays it verbatim ⇒ session stolen)
  totp      → attacker STEALS the session  (a replayable secret: the relay captures it and replays it verbatim ⇒ session stolen)
  passkey   → attacker gets NOTHING  (the assertion was signed over the phishing origin; the real RP demands its own origin ⇒ REJECTED)

⇒ TLS and "look at the URL" do not stop a relay; the victim is on a real TLS connection to the attacker.
  Only a factor bound to the ORIGIN — a passkey (WebAuthn, Chapter 7) — survives, because its signature
  is over the phishing domain and the real server rejects it. That is what "phishing-resistant" means.`,
  '103-channels': `$ node demo10/session-channels.mjs
Which channel can steal the session token, by where you keep it?

store \\ channel                     XSS         Network     Malware     Log/URL     
cookie (JS-readable)                STOLEN      —           —           —           
cookie (__Host-, HttpOnly, Secure)  —           —           —           —           
localStorage                        STOLEN      —           STOLEN      —           
token in the URL                    STOLEN      —           —           STOLEN      

What closes each channel:
  XSS (JavaScript in the page)       HttpOnly (JS cannot read the cookie)
  Network sniff (no TLS)             Secure + HTTPS everywhere (never sent in clear)
  Malware / shared machine           short TTL + re-auth + device binding (limits the blast radius)
  Leaked in a log / URL              token in a cookie, never a URL; redact logs (Chapter 1)

⇒ The HttpOnly + Secure + __Host- cookie (Chapter 3) is unreadable by XSS and never sent in clear.
  localStorage is the worst place for a session token — any XSS reads it. A token in a URL leaks to logs,
  history and the Referer header (Chapter 1). None of these channels needed the password or the 2nd factor.`,
  '104-fatigue': `$ node demo10/mfa-fatigue.mjs
Push bombing: attacker has the password, spams "Approve this login?" to the victim.

A) Tap-to-approve  → pushes 12 · attacker IN  (the victim tapped Approve on prompt 12)
B) Number matching → over 1000 fatigue events, attacker got in 6×  (only on a 1-in-100 guess of the hidden number)

⇒ Tap-to-approve turns a tired human into the bypass. Number matching makes "just tap yes" useless: the
  victim must read a number off the ATTACKER's screen, which they never see. Also rate-limit prompts and
  show WHERE the login is from. The help desk and the phone carrier are the other two human channels (10.4).`,
  '105-prehijack-race': `$ node demo10/pre-hijack-race.mjs
PRE-HIJACKING: attacker pre-created victim@ (unverified); victim later signs in with Google.
  A) naive "attach by email"   → attacker retains access: true
  B) discard-stale-unverified  → attacker retains access: false

TOCTOU RACE: two concurrent redemptions of a ONE-time reset token.
  A) check-then-act   → successful redemptions: 2   (both passed the check — the token was used twice)
  B) atomic consume   → successful redemptions: 1   (UPDATE ... WHERE used_at IS NULL RETURNING — exactly one)

⇒ Pre-hijacking: never merge a federated login into an UNVERIFIED pre-existing account (Chapter 6 verification,
  Chapter 8 link-on-sub). Races: make the one-time action ATOMIC at the database, not a check then a write.`,
  'lab-bat-dau': `$ node scripts/cham-lab-10.mjs lab10/starter
Lab 10 — lab10/starter/index.js
✗ T1 a flooding IP is blocked                                    0/2
    ↳ ipFails ≥ 100 must block (a human never fails 100×)
✗ T2 a spraying IP (many accounts) is blocked                    0/2
    ↳ one IP touching 50 distinct accounts is spraying ⇒ block
✗ T3 a breached password is challenged (not allowed, not blocked) 0/1.5
    ↳ a breached password with no solved challenge ⇒ challenge
✗ T4 a real user who mistypes is CHALLENGED, never blocked       0/2
    ↳ many account fails ⇒ challenge (prove human), NOT block
✓ T5 a clean login is allowed                                    1/1
✗ T6 a solved challenge clears soft signals but NOT the hard IP block 0/1.5
    ↳ a solved challenge must NOT clear a hard IP flood (solver farms pass CAPTCHAs)
TOTAL 1/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test
…
ℹ tests 49
ℹ pass 49
ℹ fail 0`,
  'lab-tham-khao': `$ node scripts/cham-lab-10.mjs lab10/tham-khao
Lab 10 — lab10/tham-khao/index.js
✓ T1 a flooding IP is blocked                                    2/2
✓ T2 a spraying IP (many accounts) is blocked                    2/2
✓ T3 a breached password is challenged (not allowed, not blocked) 1.5/1.5
✓ T4 a real user who mistypes is CHALLENGED, never blocked       2/2
✓ T5 a clean login is allowed                                    1/1
✓ T6 a solved challenge clears soft signals but NOT the hard IP block 1.5/1.5
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-10.mjs lab10/yeu
Lab 10 — lab10/yeu/index.js
✓ T1 a flooding IP is blocked                                    2/2
✗ T2 a spraying IP (many accounts) is blocked                    0/2
    ↳ one IP touching 50 distinct accounts is spraying ⇒ block
✗ T3 a breached password is challenged (not allowed, not blocked) 0/1.5
    ↳ a solved challenge clears the breached soft signal ⇒ allow
✗ T4 a real user who mistypes is CHALLENGED, never blocked       0/2
    ↳ many account fails ⇒ challenge (prove human), NOT block
✓ T5 a clean login is allowed                                    1/1
✗ T6 a solved challenge clears soft signals but NOT the hard IP block 0/1.5
    ↳ a solved challenge clears the account signal
TOTAL 3/10 — NOT YET (pass = 7)`,
};
