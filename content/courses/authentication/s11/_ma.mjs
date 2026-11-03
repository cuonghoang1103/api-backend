/**
 * _ma.mjs (Chương 11) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  secrets: `// src/secrets/load.js — Chapter 11 (11.1): get secrets to the process without putting them in the repo. loadConfig()
// reads from the environment, FAILS FAST on a missing required secret (a clear startup error beats a 3am 500), and
// never returns the raw values in a form you would log — redactedConfig() replaces each secret value before it is
// printed, so a startup banner can show WHICH config is set without ever leaking WHAT it is set to.

const REQUIRED = ['DATABASE_URL', 'JWT_SIGNING_KEY', 'SESSION_SECRET'];

/** ⇒ { config, missing }. config has the values; missing lists required keys that were absent. Caller fails if missing. */
export function loadConfig(env = {}) {
  const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim() === '');
  const config = {};
  for (const k of REQUIRED) config[k] = env[k];
  config.PORT = env.PORT || '4800';
  return { config, missing };
}

/** A version of the config that is safe to print in a startup log — every secret value replaced by set/MISSING. */
export function redactedConfig(config) {
  const out = {};
  for (const [k, v] of Object.entries(config || {})) {
    out[k] = REQUIRED.includes(k) ? (v ? '[set]' : '[MISSING]') : v;   // secrets: show whether set, never the value
  }
  return out;
}`,
  rotation: `// src/ops/rotation.js — Chapter 11 (11.2): rotate a signing key without logging everyone out. The trick is an OVERLAP:
// for a window, BOTH the new key (kidNew, used to sign) and the old key (kidOld, verify-only) are LIVE, so tokens
// already minted under the old key keep verifying until they expire; only then is the old key retired. A keyring is a
// map kid → key; liveKids() says which may still VERIFY, activeKid says which SIGNS.
/** ⇒ true if a token with header.kid can still be verified in this ring state. */
export function canVerify(ring, kid) {
  return Boolean(ring && ring.live && ring.live.includes(kid));
}
/** The kid new tokens are signed with — always the newest live key. */
export function signingKid(ring) {
  return ring && ring.active;
}
/**
 * Advance the rotation by one step given the phase:
 *  'introduce' — add the new key as live but KEEP signing with the old (clients learn the new key via JWKS first);
 *  'activate'  — switch signing to the new key; the old key stays live for verify during the overlap;
 *  'retire'    — drop the old key; only the new key remains. Call this only after the old key's tokens have expired.
 */
export function rotate(ring, phase, newKid) {
  const live = ring.live.slice();
  if (phase === 'introduce') return { active: ring.active, live: live.includes(newKid) ? live : [...live, newKid] };
  if (phase === 'activate') return { active: newKid, live: live.includes(newKid) ? live : [...live, newKid] };
  if (phase === 'retire') return { active: ring.active, live: [ring.active] };
  return ring;
}`,
  ratelimit: `// src/ops/ratelimit.js — Chapter 11 (11.3): rate limiting that survives real traffic. A FIXED-WINDOW counter per key
// (in production this counter lives in Redis so every instance shares it — an in-process counter lets one node's share
// of the traffic through N times over). allow() increments the key's count in the current window and says whether the
// request is under the limit. The store is injected (a Map here; a Redis client in production) and the clock too.
/**
 * allow(store, key, { limit, windowMs, now }) ⇒ { ok, remaining, count }.
 * store: a Map of \`\${key}:\${windowStart}\` → count. Fixed window: count resets when the window rolls over.
 */
export function allow(store, key, { limit, windowMs, now }) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const bucket = \`\${key}:\${windowStart}\`;
  const count = (store.get(bucket) || 0) + 1;
  store.set(bucket, count);
  return { ok: count <= limit, remaining: Math.max(0, limit - count), count };
}`,
  audit: `// src/ops/audit.js — Chapter 11 = Lab 11 reference: turn a raw event into an audit-log entry that is SAFE to write.
// An audit log is the record you reach for after an incident, so two rules fight each other: write ENOUGH to
// reconstruct what happened (who, what, when, where, outcome), and write NOTHING that is itself a secret — a logged
// token or password is a second breach waiting in your log store. safeAudit() keeps the safe fields, strips every
// sensitive one (by name AND by value), and tags a severity the runbook (src/ops/triage.js) acts on.

// Field names whose VALUES must never reach the log, however they are spelled.
const SENSITIVE = new Set(['password', 'newpassword', 'oldpassword', 'token', 'accesstoken', 'refreshtoken',
  'cookie', 'authorization', 'secret', 'otp', 'totp', 'recoverycode', 'sessionid', 'apikey']);
// The fields that are safe — and necessary — to keep.
const KEEP = ['ts', 'actor', 'action', 'outcome', 'ip', 'requestId', 'userAgent'];
// How loud each event is. Anything unlisted is 'info' (deny-by-default toward quiet, but never dropped).
const SEVERITY = {
  refresh_reuse_detected: 'alert',   // a stolen refresh token was replayed (Chapter 5) — page someone
  mfa_disabled: 'alert',             // a second factor was turned off — often the first step of a takeover
  password_reset: 'warn',
  email_changed: 'warn',
  admin_action: 'warn',
  login_failed: 'info',
  login_ok: 'info',
  logout: 'info',
};

const isSensitiveKey = (k) => SENSITIVE.has(String(k).toLowerCase().replace(/[_-]/g, ''));

/** ⇒ a log-safe audit entry: safe fields kept, sensitive fields dropped, a severity tag added. */
export function safeAudit(event) {
  const e = event || {};
  const out = {};
  for (const k of KEEP) if (e[k] !== undefined) out[k] = e[k];
  // Any EXTRA field the caller passed: keep it only if its name is not sensitive; otherwise drop it entirely.
  for (const [k, v] of Object.entries(e)) {
    if (KEEP.includes(k) || isSensitiveKey(k)) continue;        // sensitive ⇒ never copied (not even redacted-in-place)
    if (v && typeof v === 'object') continue;                   // no nested objects — they can hide a secret
    out[k] = v;
  }
  out.severity = SEVERITY[e.action] ?? 'info';
  return out;
}`,
  triage: `// src/ops/triage.js — Chapter 11 (11.5): the runbook as a function. A monitoring SIGNAL fires; triage() says what to
// DO about it, so the on-call response is written down and testable, not improvised at 3am. Six signals the platform
// watches, mapped to one of four actions: page (wake someone), investigate (look now, no page), auto (the system
// already responded, just record), ignore (expected noise).
const RUNBOOK = {
  refresh_reuse_spike: 'page',       // many stolen-token replays — an active session-theft campaign
  failed_login_burst:  'auto',       // the stuffing defence (Chapter 10) already throttles; record, do not page
  new_country_logins:  'investigate',// could be travel or takeover — look, do not wake anyone yet
  error_5xx_spike:     'page',       // the service itself is failing — logins are down
  breached_pw_rate:    'investigate',// users trying known-breached passwords — a stuffing tell
  admin_action:        'auto',       // expected; recorded in the audit log, reviewed, not paged
};
/** ⇒ 'page' | 'investigate' | 'auto' | 'ignore'. Unknown signal ⇒ 'investigate' (never silently ignore). */
export function triage(signal) {
  const name = signal && signal.name;
  if (!name) return 'ignore';
  return RUNBOOK[name] ?? 'investigate';
}`,
  grader11: `// scripts/cham-lab-11.mjs — grader of Lab 11 (audit log + runbook). 6 checks, 10 points, pass = 7.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab11/my', 'index.js')).href);
const { safeAudit, triage } = m;
const results = [];
const expect = (c, why) => { if (!c) throw Object.assign(new Error(why), { name: 'Expected' }); };
const deepHas = (o, val) => JSON.stringify(o).includes(val);
function check(name, points, fn) { let why = ''; try { why = fn() || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`threw \${e?.name}: \${String(e?.message).split('\\n')[0]}\`; } results.push({ name, points, ok: !why, why }); }

const base = { ts: 1700000000, actor: 'usr_1', action: 'login_ok', outcome: 'ok', ip: '203.0.113.5', requestId: 'req-9' };
check('T1 safeAudit keeps the safe, necessary fields', 2, () => {
  const a = safeAudit({ ...base });
  for (const k of ['ts', 'actor', 'action', 'outcome', 'ip', 'requestId']) expect(a[k] === base[k], \`must keep \${k}\`);
});
check('T2 safeAudit never writes a token value', 2, () => {
  const a = safeAudit({ ...base, token: 'tok-SECRET-abc', accessToken: 'at-SECRET' });
  expect(!deepHas(a, 'SECRET'), 'a token value must never appear anywhere in the entry');
});
check('T3 safeAudit never writes a password value (any spelling)', 1.5, () => {
  expect(!deepHas(safeAudit({ ...base, password: 'hunter2xyz' }), 'hunter2xyz'), 'password must be dropped');
  expect(!deepHas(safeAudit({ ...base, newPassword: 'np-LEAK' }), 'np-LEAK'), 'newPassword must be dropped');
  expect(!deepHas(safeAudit({ ...base, recovery_code: 'rc-LEAK' }), 'rc-LEAK'), 'recovery_code must be dropped');
});
check('T4 safeAudit drops nested objects (a secret can hide inside)', 1, () => {
  expect(!deepHas(safeAudit({ ...base, extra: { secret: 'NESTED-LEAK' } }), 'NESTED-LEAK'), 'a nested object must not be copied');
});
check('T5 safeAudit tags severity by event type', 1.5, () => {
  expect(safeAudit({ ...base, action: 'refresh_reuse_detected' }).severity === 'alert', 'refresh_reuse_detected ⇒ alert');
  expect(safeAudit({ ...base, action: 'password_reset' }).severity === 'warn', 'password_reset ⇒ warn');
  expect(safeAudit({ ...base, action: 'login_ok' }).severity === 'info', 'login_ok ⇒ info');
});
check('T6 triage routes each signal to the right runbook action', 2, () => {
  expect(triage({ name: 'refresh_reuse_spike' }) === 'page', 'reuse spike ⇒ page');
  expect(triage({ name: 'failed_login_burst' }) === 'auto', 'the stuffing defence already handled it ⇒ auto, not page');
  expect(triage({ name: 'new_country_logins' }) === 'investigate', 'new country ⇒ investigate');
  expect(triage({ name: 'totally_new_signal' }) === 'investigate', 'an unknown signal ⇒ investigate, never ignore');
  expect(triage({}) === 'ignore', 'a nameless signal ⇒ ignore');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 11 — \${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab11/my', 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(58)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu11: `// lab11/yeu/index.js — an audit function that "logs everything for completeness" — which is exactly how a token and a
// password end up sitting in the log store forever. And a runbook that pages on everything, so the on-call ignores it.
export function safeAudit(event) {
  return { ...event, severity: 'info' };     // ❌ copies token/password straight into the log; severity always info
}
export function triage(signal) {
  return 'page';                             // ❌ pages on every signal — alert fatigue, the 10.4 problem for on-call
}`,
};
export const OUT = {
  '111-secrets': `$ node demo11/secrets.mjs
Startup with DATABASE_URL and SESSION_SECRET unset:
  missing required secrets: ["DATABASE_URL","SESSION_SECRET"]  ⇒ refuse to start (exit non-zero)

Startup with all secrets set — the banner you CAN log:
  {"DATABASE_URL":"[set]","JWT_SIGNING_KEY":"[set]","SESSION_SECRET":"[set]","PORT":"4800"}
  (DATABASE_URL shows [set], never postgres://…:s3cr3t-pw@…)

⇒ Secrets reach the process from the environment (the VPS .env, a secrets manager), never the repo.
  A missing one is a loud startup failure; a present one is logged as [set], never as its value.`,
  '112-rotate': `$ node demo11/rotate.mjs
Rotating the signing key k1 → k2, with an overlap:

  start (only k1)                    sign with k1 · old k1 still verifies? true
  introduce k2 (JWKS now lists both) sign with k1 · old k1 still verifies? true
  activate k2 (new tokens use k2)    sign with k2 · old k1 still verifies? true
    ↳ the in-the-wild token (kid k1) still verifies: true  ← nobody logged out
  retire k1 (after its tokens expired) sign with k2 · old k1 still verifies? false
    ↳ the in-the-wild token (kid k1) now verifies: false  ← only expired ones remain

⇒ Keep BOTH keys live during the overlap: sign with the new one, still VERIFY the old one, and retire the
  old key only after every token it signed has expired. Rotate without a mass logout, and without a gap.`,
  '113-ratelimit': `$ node demo11/ratelimit.mjs
Fixed window: 5 requests per 1000ms, per key.

Seven requests from ip-A inside one window:
  #1 → allow (count 1, remaining 4)
  #2 → allow (count 2, remaining 3)
  #3 → allow (count 3, remaining 2)
  #4 → allow (count 4, remaining 1)
  #5 → allow (count 5, remaining 0)
  #6 → BLOCK (count 6, remaining 0)
  #7 → BLOCK (count 7, remaining 0)

ip-B in the same window is independent:
  ip-B #1 → allow   (one key's flood does not throttle another)

ip-A in the NEXT window resets:
  ip-A #1 → allow

⇒ The counter MUST be shared across instances (Redis), or each of N nodes lets the limit through N times.
  Rate-limit by the right key (IP, account, route), fail OPEN if the store is down (never lock out everyone),
  and return 429 with Retry-After — a limit the client cannot see is a limit it cannot back off from.`,
  '114-audit': `$ node demo11/audit.mjs
The naive "log the whole event for completeness":
  {"ts":1700000000,"actor":"usr_1","action":"password_reset","outcome":"ok","ip":"203.0.113.5","requestId":"req-42","tok…
  ↳ a reset token, a plaintext password and a session cookie now live in your log store forever.

safeAudit(event) — keep what reconstructs the incident, drop every secret:
  {"ts":1700000000,"actor":"usr_1","action":"password_reset","outcome":"ok","ip":"203.0.113.5","requestId":"req-42","severity":"warn"}
  ↳ secret substrings remaining in the entry: none

⇒ Write who/what/when/where/outcome and a severity; NEVER a token, password, cookie, OTP or recovery code,
  not even nested. The audit log is read after a breach — it must not be able to CAUSE the next one.`,
  '115-signals': `$ node demo11/signals.mjs
Six signals LabFlow watches, and the runbook action for each:

  refresh_reuse_spike  → PAGE on-call               (stolen refresh tokens being replayed (Chapter 5) — an active session-theft campaign)
  error_5xx_spike      → PAGE on-call               (the service itself is failing — logins are down)
  new_country_logins   → investigate now (no page)  (logins from a new country — travel, or the start of a takeover)
  breached_pw_rate     → investigate now (no page)  (users submitting known-breached passwords — a stuffing tell (Chapter 10))
  failed_login_burst   → already handled — record   (a burst of failed logins — the stuffing defence already throttled it)
  admin_action         → already handled — record   (an administrator changed something — expected, recorded, reviewed)

⇒ The runbook turns a signal into a DECISION written down in advance: page only for what needs a human now
  (active theft, service down); investigate the ambiguous; let the automated defences record the rest.
  Paging on everything (the "yeu" runbook) trains the on-call to ignore the page — the 10.4 problem, inside the team.`,
  'lab-bat-dau': `$ node scripts/cham-lab-11.mjs lab11/starter
Lab 11 — lab11/starter/index.js
✓ T1 safeAudit keeps the safe, necessary fields              2/2
✗ T2 safeAudit never writes a token value                    0/2
    ↳ a token value must never appear anywhere in the entry
✗ T3 safeAudit never writes a password value (any spelling)  0/1.5
    ↳ password must be dropped
✗ T4 safeAudit drops nested objects (a secret can hide inside) 0/1
    ↳ a nested object must not be copied
✗ T5 safeAudit tags severity by event type                   0/1.5
    ↳ refresh_reuse_detected ⇒ alert
✗ T6 triage routes each signal to the right runbook action   0/2
    ↳ reuse spike ⇒ page
TOTAL 2/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test
…
ℹ tests 54
ℹ pass 54
ℹ fail 0`,
  'lab-tham-khao': `$ node scripts/cham-lab-11.mjs lab11/tham-khao
Lab 11 — lab11/tham-khao/index.js
✓ T1 safeAudit keeps the safe, necessary fields              2/2
✓ T2 safeAudit never writes a token value                    2/2
✓ T3 safeAudit never writes a password value (any spelling)  1.5/1.5
✓ T4 safeAudit drops nested objects (a secret can hide inside) 1/1
✓ T5 safeAudit tags severity by event type                   1.5/1.5
✓ T6 triage routes each signal to the right runbook action   2/2
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-11.mjs lab11/yeu
Lab 11 — lab11/yeu/index.js
✓ T1 safeAudit keeps the safe, necessary fields              2/2
✗ T2 safeAudit never writes a token value                    0/2
    ↳ a token value must never appear anywhere in the entry
✗ T3 safeAudit never writes a password value (any spelling)  0/1.5
    ↳ password must be dropped
✗ T4 safeAudit drops nested objects (a secret can hide inside) 0/1
    ↳ a nested object must not be copied
✗ T5 safeAudit tags severity by event type                   0/1.5
    ↳ refresh_reuse_detected ⇒ alert
✗ T6 triage routes each signal to the right runbook action   0/2
    ↳ the stuffing defence already handled it ⇒ auto, not page
TOTAL 2/10 — NOT YET (pass = 7)`,
};
