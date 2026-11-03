// scripts/cham-lab-11.mjs — grader of Lab 11 (audit log + runbook). 6 checks, 10 points, pass = 7.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab11/my', 'index.js')).href);
const { safeAudit, triage } = m;
const results = [];
const expect = (c, why) => { if (!c) throw Object.assign(new Error(why), { name: 'Expected' }); };
const deepHas = (o, val) => JSON.stringify(o).includes(val);
function check(name, points, fn) { let why = ''; try { why = fn() || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `threw ${e?.name}: ${String(e?.message).split('\n')[0]}`; } results.push({ name, points, ok: !why, why }); }

const base = { ts: 1700000000, actor: 'usr_1', action: 'login_ok', outcome: 'ok', ip: '203.0.113.5', requestId: 'req-9' };
check('T1 safeAudit keeps the safe, necessary fields', 2, () => {
  const a = safeAudit({ ...base });
  for (const k of ['ts', 'actor', 'action', 'outcome', 'ip', 'requestId']) expect(a[k] === base[k], `must keep ${k}`);
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
console.log(`Lab 11 — ${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab11/my', 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(58)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
