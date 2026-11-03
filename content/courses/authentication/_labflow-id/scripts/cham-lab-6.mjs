// scripts/cham-lab-6.mjs — the grader of Lab 6 (LabFlow ID's account-lifecycle layer). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-6.mjs <folder with index.js>     e.g.  node scripts/cham-lab-6.mjs lab6/my
// It gives YOUR lifecycle() an in-memory store, a fake clock and a recording mailer, then drives verification, reset,
// single-use, purpose and the enumeration-safe reset request. No database, no real email.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { memoryStore } from '../src/lifecycle/memory-store.js';

const dir = path.resolve(process.argv[2] ?? 'lab6/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);

let CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
const now = () => CLOCK;
const tick = (ms) => (CLOCK += ms);
const layer = () => m.lifecycle({ store: memoryStore(), now, verifyTtlMs: 30 * 60e3, resetTtlMs: 15 * 60e3 });
const usersWith = (list) => ({ findByEmail: async (e) => list.find((u) => u.email === e) ?? null });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name ?? 'Error'}: ${String(e?.message ?? e).split('\n')[0]}`; }
  results.push({ name, points, ok: !why, why });
}

// ── T1 issue + consume round trip ──
await check('T1 issueToken + consumeToken: a token verifies the right user', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const v = await life.issueToken('usr_1', 'verify_email');
  expect(typeof v.token === 'string' && v.token.length > 20, 'issueToken must return a { token }');
  tick(1000);
  expect((await life.consumeToken('verify_email', v.token)).userId === 'usr_1', 'a fresh token must consume to its user');
});

// ── T2 single-use ──
await check('T2 a token is single-use: the second consume fails', 2, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const v = await life.issueToken('usr_1', 'verify_email');
  tick(1000);
  expect((await life.consumeToken('verify_email', v.token)).userId === 'usr_1', 'the first consume must succeed');
  expect((await life.consumeToken('verify_email', v.token)).error === 'USED', 'the second consume must return USED');
});

// ── T3 purpose-bound ──
await check('T3 a token is purpose-bound: a reset token cannot verify an email', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const r = await life.issueToken('usr_2', 'reset_password');
  tick(1000);
  expect((await life.consumeToken('verify_email', r.token)).error === 'INVALID', 'a reset token used to verify must be INVALID');
  expect((await life.consumeToken('reset_password', r.token)).userId === 'usr_2', 'the same token must consume for its own purpose');
});

// ── T4 expiry ──
await check('T4 tokens expire: reset after 15 min, verify after 30 min', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const r = await life.issueToken('usr_1', 'reset_password');
  expect((await life.consumeToken('reset_password', r.token, { at: CLOCK + 16 * 60e3 })).error === 'EXPIRED', 'a reset token must be EXPIRED after 16 min');
  const v = await life.issueToken('usr_1', 'verify_email');
  expect((await life.consumeToken('verify_email', v.token, { at: CLOCK + 29 * 60e3 })).userId === 'usr_1', 'a verify token must still work at 29 min');
  const v2 = await life.issueToken('usr_1', 'verify_email');
  expect((await life.consumeToken('verify_email', v2.token, { at: CLOCK + 31 * 60e3 })).error === 'EXPIRED', 'a verify token must be EXPIRED after 31 min');
});

// ── T5 enumeration-safe reset: only a real, active account is mailed ──
await check('T5 requestPasswordReset mails a real account and NOTHING to a non-existent one', 2, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const users = usersWith([{ id: 'usr_1', email: 'an@x', status: 'active' }]);
  const sent = [];
  await life.requestPasswordReset(users, 'an@x', { send: (msg) => sent.push(msg), sync: true });
  await life.requestPasswordReset(users, 'nobody@x', { send: (msg) => sent.push(msg), sync: true });
  expect(sent.length === 1, `exactly one email should be sent (to the real account), got ${sent.length} — a "no account" email to a stranger leaks which emails exist`);
  expect(sent[0].to === 'an@x', 'the one email must go to the real account');
});

// ── T6 deleted account, and a bad token ──
await check('T6 a deleted account is not mailed; a bad token never crashes', 1.5, async () => {
  const life = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const users = usersWith([{ id: 'usr_9', email: 'gone@x', status: 'deleted' }]);
  const sent = [];
  await life.requestPasswordReset(users, 'gone@x', { send: (msg) => sent.push(msg), sync: true });
  expect(sent.length === 0, 'a deleted account must not receive a reset email');
  expect((await life.consumeToken('reset_password', 'lfid_reset_nope')).error === 'INVALID', 'an unknown token must be INVALID, not a crash');
});

const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 6 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(68)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
if (/No account|no such account|does not exist/i.test(src)) console.log('! your source emails a "no account" message — never tell a stranger whether an email is registered (lesson 6.4)');
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
