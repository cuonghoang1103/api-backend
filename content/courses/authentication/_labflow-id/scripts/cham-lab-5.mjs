// scripts/cham-lab-5.mjs — the grader of Lab 5 (LabFlow ID's refresh-token layer). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-5.mjs <folder with index.js>     e.g.  node scripts/cham-lab-5.mjs lab5/my
// It passes YOUR refreshLayer an in-memory store and a fake clock, then drives rotation, reuse and the race. No database.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { tokenDigest } from '../src/crypto/index.js';
import { memoryStore } from '../src/refresh/memory-store.js';

const dir = path.resolve(process.argv[2] ?? 'lab5/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);

let CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
const now = () => CLOCK;
const tick = (ms) => (CLOCK += ms);
function layer(graceMs = 10e3, familyTtlMs = 30 * 24 * 3600e3) {
  const store = memoryStore();
  return { rl: m.refreshLayer({ store, now, graceMs, familyTtlMs }), store };
}

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name ?? 'Error'}: ${String(e?.message ?? e).split('\n')[0]}`; }
  results.push({ name, points, ok: !why, why });
}

// ── T1 issue + rotate: fresh token, same family ──
await check('T1 issue returns a token + family; rotate gives a new token in the same family', 1.5, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  expect(a && typeof a.token === 'string' && a.row && a.row.familyId, 'issue must return { token, row } with a familyId');
  tick(60e3);
  const r1 = await rl.rotate(a.token);
  expect(r1.token && r1.token !== a.token, 'rotate must return a new token');
  expect(r1.row.familyId === a.row.familyId, 'the rotated token must stay in the same family');
});

// ── T2 the token is stored as a digest, never in the clear ──
await check('T2 the store keeps a SHA-256 digest, never the token itself', 1, async () => {
  const { rl, store } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  const row = [...store.rows.values()][0];
  expect(row.digest === tokenDigest(a.token), 'the stored digest must be the SHA-256 of the token');
  expect(!JSON.stringify(row).includes(a.token), 'the raw token must not be stored anywhere on the row');
});

// ── T3 reuse of a rotated token revokes the whole family ──
await check('T3 reusing a rotated token revokes the whole family (theft)', 2, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3); const r1 = await rl.rotate(a.token);
  tick(60e3); const r2 = await rl.rotate(r1.token);
  tick(3600e3); // long past the grace window
  const reuse = await rl.rotate(a.token);
  expect(reuse.error === 'REUSE_DETECTED', `reusing an old token must return REUSE_DETECTED, got ${JSON.stringify(reuse)}`);
  const dead = await rl.rotate(r2.token);
  expect(dead.error === 'REVOKED', 'after reuse, even the current token must be REVOKED');
});

// ── T4 the race: same token within grace ⇒ same child ──
await check('T4 the race: the same token rotated twice within grace returns the same child', 1.5, async () => {
  const { rl } = layer(10e3); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3);
  const x1 = await rl.rotate(a.token);
  tick(50); // 50 ms later — a second tab with the same cookie
  const x2 = await rl.rotate(a.token);
  expect(x1.token && x2.token && x1.token === x2.token, `within grace, both must get the same token (got ${x1.token} vs ${x2.token})`);
});

// ── T5 outside grace ⇒ theft ──
await check('T5 outside the grace window, the same second use is theft', 1, async () => {
  const { rl } = layer(10e3); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1');
  tick(60e3); await rl.rotate(a.token);
  tick(11000); // past the 10 s grace
  expect((await rl.rotate(a.token)).error === 'REUSE_DETECTED', 'a reuse 11 s later (grace 10 s) must be REUSE_DETECTED');
});

// ── T6 invalid / expired / revoked, without flagging theft ──
await check('T6 invalid, expired and revoked tokens are rejected (not flagged as theft)', 1, async () => {
  const { rl } = layer(10e3, 5000); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  expect((await rl.rotate('lfid_rt_nope')).error === 'INVALID', 'an unknown token must be INVALID');
  const a = await rl.issue('usr_1');
  tick(6000);
  expect((await rl.rotate(a.token)).error === 'EXPIRED', 'past the family ttl, a token must be EXPIRED');
  const b = await rl.issue('usr_2');
  await rl.revokeFamily(b.row.familyId);
  expect((await rl.rotate(b.token)).error === 'REVOKED', 'a revoked family must give REVOKED');
});

// ── T7 device list: one row per family ──
await check('T7 listDevices: one row per live family, not one per rotation', 1, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  tick(1000); await rl.issue('usr_1', { ua: 'phone' });
  tick(1000); const r = await rl.rotate(a.token); await rl.rotate(r.token); // rotate the laptop twice
  const devices = await rl.listDevices('usr_1');
  expect(devices.length === 2, `two logins should be two devices despite rotation, got ${devices.length}`);
});

// ── T8 revoke one device, and all ──
await check('T8 revokeDevice revokes one family; revokeAll revokes every family', 1, async () => {
  const { rl } = layer(); CLOCK = Date.UTC(2026, 10, 3, 9, 0, 0);
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  tick(1000); const b = await rl.issue('usr_1', { ua: 'phone' });
  await rl.revokeDevice('usr_1', a.row.familyId);
  expect((await rl.rotate(a.token)).error === 'REVOKED', 'the revoked device must be dead');
  expect((await rl.rotate(b.token)).token, 'the other device must still work');
  await rl.revokeAll('usr_1');
  expect((await rl.rotate(b.token)).error === 'REVOKED', 'revokeAll must revoke the rest');
});

const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 5 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(72)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
if (/Math\.random/.test(src)) console.log('! the source mentions Math.random — tokens must come from node:crypto (lesson 1.2)');
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
