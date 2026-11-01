// scripts/cham-lab-1.mjs — the grader of Lab 1 (LabFlow ID's toolkit of primitives). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-1.mjs <folder with index.js>      e.g.  node scripts/cham-lab-1.mjs lab1/my
// It only CALLS your functions (and reads your source for Math.random); it never edits your files.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = path.resolve(process.argv[2] ?? 'lab1/my');
const file = path.join(dir, 'index.js');
const m = await import(pathToFileURL(file).href);
const results = [];

async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) {
    why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name ?? 'Error'}: ${String(e?.message ?? e).split('\n')[0]}`;
  }
  results.push({ name, points, ok: !why, why });
}
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
const nothrow = (fn) => { try { return { v: fn() }; } catch (e) { return { e }; } };

// ── T1 token format ──
await check('T1 newToken format and argument checks', 1, () => {
  const t = m.newToken('lfid_ses');
  expect(/^lfid_ses_[A-Za-z0-9_-]{43}$/.test(t), `"lfid_ses" + 32 bytes should be lfid_ses_ + 43 base64url chars, got ${JSON.stringify(t.slice(0, 30))}… (${t.length} chars)`);
  expect(/^lfid_key_[A-Za-z0-9_-]{22}$/.test(m.newToken('lfid_key', 16)), '16 bytes should give 22 base64url chars');
  for (const bad of ['', 'LFID', 'lfid ses', 'lfid__ses', '_ses', 42]) {
    const r = nothrow(() => m.newToken(bad));
    expect(r.e instanceof TypeError, `prefix ${JSON.stringify(bad)} should throw TypeError`);
  }
  for (const bad of [8, 15, 16.5, '32']) {
    const r = nothrow(() => m.newToken('lfid_ses', bad));
    expect(r.e instanceof RangeError, `bytes = ${JSON.stringify(bad)} should throw RangeError`);
  }
});

// ── T2 randomness source ──
await check('T2 newToken uses the CSPRNG, never Math.random', 1.5, () => {
  const real = Math.random;
  Math.random = () => { throw new Error('Math.random was called (the grader replaced it with a trap)'); };
  try { m.newToken('lfid_ses'); } finally { Math.random = real; }
  const run = () => execFileSync(process.execPath, ['--random-seed=7', '--input-type=module', '-e',
    `const m = await import(${JSON.stringify(pathToFileURL(file).href)}); console.log(m.newToken('lfid_ses'))`], { encoding: 'utf8' }).trim();
  expect(run() !== run(), 'two processes with the same --random-seed produced the same token');
  const seen = new Set(Array.from({ length: 10000 }, () => m.newToken('lfid_ses')));
  expect(seen.size === 10000, `10,000 tokens, only ${seen.size} distinct`);
});

// ── T3 digest ──
await check('T3 tokenDigest = SHA-256 hex', 0.5, () => {
  const t = 'lfid_ses_' + 'A'.repeat(43);
  expect(m.tokenDigest(t) === createHash('sha256').update(t).digest('hex'), 'not the SHA-256 hex of the token');
});

// ── T4 safeEqual correctness ──
await check('T4 safeEqual answers correctly and never throws', 1.5, () => {
  const t = 'lfid_ses_' + 'x'.repeat(43);
  const cases = [[t, 'lfid_ses_' + 'x'.repeat(43), true], [t, 'lfid_ses_' + 'x'.repeat(42) + 'y', false], [t, 'y' + t.slice(1), false],
    [t, 'lfid_ses_x', false], [t, t + 'x', false], ['', '', true], [t, '', false], ['é', 'é', true], ['é', 'é', false],
    [t, undefined, false], [undefined, undefined, false], [null, null, false], [123, 123, false]];
  for (const [a, b, want] of cases) {
    const r = nothrow(() => m.safeEqual(a, b));
    expect(!r.e, `safeEqual(${JSON.stringify(a)?.slice(0, 20)}, ${JSON.stringify(b)?.slice(0, 20)}) threw`);
    expect(r.v === want, `safeEqual(${JSON.stringify(a)?.slice(0, 20)}, ${JSON.stringify(b)?.slice(0, 20)}) should be ${want}`);
  }
});

// ── T5 safeEqual timing ──
await check('T5 safeEqual time does not depend on where strings differ', 1, () => {
  const secret = Buffer.from('s'.repeat(1024)).toString();
  const first = Array.from({ length: 8 }, () => Buffer.from('t' + 's'.repeat(1023)).toString());
  const last = Array.from({ length: 8 }, () => Buffer.from('s'.repeat(1023) + 't').toString());
  let hits = 0; // USE every result — otherwise the JIT may delete the comparison and time an empty loop (lesson 1.3)
  const time = (gs) => { const t = process.hrtime.bigint(); for (let i = 0; i < 20000; i++) if (m.safeEqual(gs[i & 7], secret)) hits++; return Number(process.hrtime.bigint() - t); };
  const a = []; const b = [];
  for (let r = 0; r < 15; r++) { if (r & 1) { b.push(time(last)); a.push(time(first)); } else { a.push(time(first)); b.push(time(last)); } }
  const med = (x) => x.sort((p, q) => p - q)[7];
  const ratio = med(b) / med(a);
  expect(hits === 0, 'safeEqual said two different strings are equal');
  expect(ratio < 1.5, `differs-at-the-end / differs-at-the-start = ${ratio.toFixed(2)}× (needs < 1.5×) on 1024-char strings`);
});

const KEYS = { k1: 'demo-key-one-not-secret', k2: 'demo-key-two-not-secret' };
const NOW = Date.UTC(2026, 10, 1, 6, 0, 0); // 2026-11-01T06:00:00Z

// ── T6 signed values: round trip + tampering ──
await check('T6 signValue / verifyValue: round trip, tampered value / expiry / signature', 1.5, () => {
  const s = m.signValue('usr_1|STUDENT', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  expect(m.verifyValue(s, { keys: KEYS, now: NOW }) === 'usr_1|STUDENT', 'a fresh value does not verify');
  const p = s.split('.');
  const other = Buffer.from('usr_3|LAB_MANAGER').toString('base64url');
  expect(m.verifyValue([other, ...p.slice(1)].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed VALUE was accepted');
  expect(m.verifyValue([p[0], String(Number(p[1]) + 86400), ...p.slice(2)].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed EXPIRY was accepted');
  const sig = p.at(-1);
  const flipped = sig.slice(0, -1) + (sig.at(-1) === 'A' ? 'B' : 'A');
  expect(m.verifyValue([...p.slice(0, -1), flipped].join('.'), { keys: KEYS, now: NOW }) === null, 'a changed SIGNATURE was accepted');
  const tricky = 'a.b.c|ñ✓';
  expect(m.verifyValue(m.signValue(tricky, { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW }), { keys: KEYS, now: NOW }) === tricky, 'a value with dots / unicode does not round-trip');
});

// ── T7 expiry boundaries ──
await check('T7 expiry: valid until exp − 1 s, null from exp on', 1, () => {
  const s = m.signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 900, now: NOW });
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 899_000 }) === 'usr_1', '899 s later it should still be valid');
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 900_000 }) === null, 'exactly at exp it must be null (now ≥ exp)');
  expect(m.verifyValue(s, { keys: KEYS, now: NOW + 86_400_000 }) === null, 'a day later it must be null');
});

// ── T8 format, key rotation, malformed input ──
await check('T8 format with kid, key rotation, malformed input never throws', 1, () => {
  const s = m.signValue('usr_1', { keys: KEYS, kid: 'k2', ttlSec: 60, now: NOW });
  expect(/^[A-Za-z0-9_-]+\.\d+\.k2\.[A-Za-z0-9_-]{43}$/.test(s), `format should be value.exp.kid.sig, got ${JSON.stringify(s)}`);
  const old = m.signValue('usr_1', { keys: KEYS, kid: 'k1', ttlSec: 60, now: NOW });
  expect(m.verifyValue(old, { keys: KEYS, now: NOW }) === 'usr_1', 'a value signed with k1 must verify while k1 is still in keys');
  expect(m.verifyValue(old, { keys: { k2: KEYS.k2 }, now: NOW }) === null, 'after k1 is removed, its values must be rejected');
  const forgedKid = old.replace('.k1.', '.k9.');
  expect(m.verifyValue(forgedKid, { keys: KEYS, now: NOW }) === null, 'unknown kid accepted');
  expect(m.verifyValue(old.replace('.k1.', '.toString.'), { keys: KEYS, now: NOW }) === null, 'kid "toString" must not find a key on the prototype');
  for (const bad of ['', 'abc', 'a.b.c', 'a.b.c.d.e', '...', '.1.k1.', 'x.NaN.k1.' + 'A'.repeat(43), undefined, null, 42, {}]) {
    const r = nothrow(() => m.verifyValue(bad, { keys: KEYS, now: NOW }));
    expect(!r.e, `verifyValue(${JSON.stringify(bad)}) threw ${r.e?.name}`);
    expect(r.v === null, `verifyValue(${JSON.stringify(bad)}) should be null`);
  }
});

// ── T9 redact ──
await check('T9 redact: allow-list, deep, input untouched', 1, () => {
  const input = { method: 'POST', headers: { 'user-agent': 'curl/8.7.1', authorization: 'Bearer x', 'x-session': 'lfid_ses_x', Cookie: 'sid=1' },
    body: { email: 'an@student.labflow.example', password: 'p', matKhau: 'p', items: [{ email: 'b@x', pwd: 'p' }] } };
  const before = JSON.stringify(input);
  const out = m.redact(input, ['method', 'headers', 'user-agent', 'body', 'email', 'items']);
  expect(JSON.stringify(input) === before, 'the input object was changed');
  const want = { method: 'POST', headers: { 'user-agent': 'curl/8.7.1', authorization: '[redacted]', 'x-session': '[redacted]', Cookie: '[redacted]' },
    body: { email: 'an@student.labflow.example', password: '[redacted]', matKhau: '[redacted]', items: [{ email: 'b@x', pwd: '[redacted]' }] } };
  expect(JSON.stringify(out) === JSON.stringify(want), `got ${JSON.stringify(out)}`);
});

// ── report ──
const src = fs.readFileSync(file, 'utf8');
const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 1 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(76)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
if (/Math\.random/.test(src)) console.log('! the source mentions Math.random — tokens, codes and ids must come from node:crypto');
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
