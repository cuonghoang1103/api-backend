// scripts/cham-lab-2.mjs — the grader of Lab 2 (LabFlow ID's password module). 9 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-2.mjs <folder with index.js>      e.g.  node scripts/cham-lab-2.mjs lab2/my
// It only CALLS your four functions with a fake in-memory user store (no database needed) and reads your source last.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

const dir = path.resolve(process.argv[2] ?? 'lab2/my');
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
const safely = async (fn) => { try { return { v: await fn() }; } catch (e) { return { e }; } };
const params = (s) => Object.fromEntries((/^\$argon2id\$v=19\$([^$]+)\$/.exec(s ?? '')?.[1] ?? '').split(',').map((kv) => kv.split('=')).map(([k, v]) => [k, Number(v)]));
const BLOCK = new Set(fs.existsSync('wordlists/10k-most-common.txt')
  ? fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\n').filter(Boolean) : ['password', '123456', 'qwerty', 'iloveyou']);
const median = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
const fakeStore = (rows) => {
  const updates = [];
  return { updates, rows,
    async findByEmail(email) { return rows.find((r) => r.email === email) ?? null; },
    async updateHash(id, h) { updates.push([id, h]); rows.find((r) => r.id === id).passwordHash = h; } };
};

// ── T1 format ──
await check('T1 argon2id, self-describing, OWASP minimum or above, salted', 1, async () => {
  const a = await m.hashPassword('an-lab-2026'), b = await m.hashPassword('an-lab-2026');
  expect(typeof a === 'string' && a.startsWith('$argon2id$v=19$'), `expected a "$argon2id$v=19$…" string, got ${JSON.stringify(String(a).slice(0, 24))}…`);
  const p = params(a);
  expect(p.m >= 19456 && p.t >= 2 || p.m >= 47104 && p.t >= 1, `parameters m=${p.m}, t=${p.t} are below OWASP's minimum (m=19456 t=2, or m=47104 t=1)`);
  expect(a !== b, 'the same password hashed twice gave the same string: no random salt');
});

// ── T2 the stolen table ──
await check('T2 a stolen row resists fast cracking (no plain/MD5/SHA, ≥ 10 ms per guess)', 1.5, async () => {
  const row = await m.hashPassword('123456');
  for (const alg of ['md5', 'sha1', 'sha256']) for (const enc of ['hex', 'base64']) {
    expect(!row.includes(createHash(alg).update('123456').digest(enc)), `the row contains ${alg}("123456") — crackable at billions of guesses per second`);
  }
  expect(!row.includes('123456'), 'the row contains the password itself');
  const times = [];
  for (const g of ['password', 'qwerty', '12345678', 'iloveyou', 'abc123']) {
    const t0 = performance.now(); await m.verifyPassword(row, g); times.push(performance.now() - t0);
  }
  expect(median(times) >= 10, `one wrong guess costs ${median(times).toFixed(1)} ms — an attacker tries the 10k list in ${(median(times) * 10).toFixed(0)} ms per account`);
});

// ── T3 verify ──
await check('T3 verifyPassword: right/wrong, never throws, Unicode NFC', 1, async () => {
  const s = await m.hashPassword('an-lab-2026');
  expect((await m.verifyPassword(s, 'an-lab-2026'))?.ok === true, 'the right password was rejected');
  for (const bad of ['an-lab-2027', '', 'AN-LAB-2026']) expect((await m.verifyPassword(s, bad))?.ok === false, `${JSON.stringify(bad)} was accepted`);
  for (const [st, pw] of [[s, undefined], [s, 42], ['not-a-hash', 'x'], [undefined, 'x']]) {
    const r = await safely(() => m.verifyPassword(st, pw));
    expect(!r.e && r.v?.ok === false, `verifyPassword(${JSON.stringify(st)?.slice(0, 12)}, ${JSON.stringify(pw)}) should be { ok: false }, ${r.e ? 'it threw ' + r.e.name : 'got ' + JSON.stringify(r.v)}`);
  }
  const vi = 'Bình-thích-hoa-sen-2026';
  const t = await m.hashPassword(vi.normalize('NFC'));
  expect((await m.verifyPassword(t, vi.normalize('NFD')))?.ok === true, 'the same Vietnamese password typed as "Unicode tổ hợp" (NFD) was rejected — normalise to NFC');
});

// ── T4 rehash ──
await check('T4 old shapes verify and ask for a rehash (old params, bcrypt, wrapped MD5)', 1.5, async () => {
  const cur = await m.hashPassword('lan-lab-2026');
  const r0 = await m.verifyPassword(cur, 'lan-lab-2026');
  expect(r0?.ok === true && r0.rehash === false, `today's hash should give { ok: true, rehash: false }, got ${JSON.stringify(r0)}`);
  const md5 = createHash('md5').update('lan-lab-2026').digest('hex');
  const shapes = [
    ['argon2id m=8 MiB t=1', await argon2.hash('lan-lab-2026', { type: argon2.argon2id, memoryCost: 8192, timeCost: 1, parallelism: 1 })],
    ['bcrypt cost 10', await bcrypt.hash('lan-lab-2026', 10)],
    ['md5 wrapped in argon2id', (await argon2.hash(md5, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 })).replace('$argon2id$', '$md5-argon2id$')],
  ];
  for (const [label, stored] of shapes) {
    const ok = await safely(() => m.verifyPassword(stored, 'lan-lab-2026'));
    expect(!ok.e && ok.v?.ok === true && ok.v.rehash === true, `${label}: expected { ok: true, rehash: true }, ${ok.e ? 'it threw ' + ok.e.name : 'got ' + JSON.stringify(ok.v)}`);
    const bad = await safely(() => m.verifyPassword(stored, 'wrong-password-1'));
    expect(!bad.e && bad.v?.ok === false && !bad.v.rehash, `${label} + wrong password: expected { ok: false, rehash: false }`);
  }
});

// ── T5 signIn upgrades ──
await check('T5 signIn upgrades an old hash on success, and only on success', 1, async () => {
  const store = fakeStore([{ id: 'usr_3', email: 'lan@labflow.example', passwordHash: await bcrypt.hash('lan-lab-2026', 10) }]);
  await m.signIn(store, 'lan@labflow.example', 'wrong-password-1');
  expect(store.updates.length === 0, 'a FAILED sign-in rewrote the stored hash');
  const ok = await m.signIn(store, 'lan@labflow.example', 'lan-lab-2026');
  expect(ok?.user?.id === 'usr_3', `the right password should give { user }, got ${JSON.stringify(ok)?.slice(0, 80)}`);
  expect(store.updates.length === 1 && store.updates[0][1].startsWith('$argon2id$'), 'the bcrypt hash was not replaced by an argon2id hash');
  const again = await m.signIn(store, 'lan@labflow.example', 'lan-lab-2026');
  expect(again?.user && store.updates.length === 1, 'the upgraded hash was rewritten again on the next sign-in');
});

// ── T6 timing ──
await check('T6 "no such email" and "wrong password" take the same time (ratio < 1.5×)', 1.5, async () => {
  const store = fakeStore([{ id: 'usr_1', email: 'an@student.labflow.example', passwordHash: await m.hashPassword('an-lab-2026') }]);
  const a = [], b = [];
  for (let i = 0; i < 15; i++) {
    let t0 = performance.now(); await m.signIn(store, `nobody${i}@student.labflow.example`, 'wrong-password-' + i); a.push(performance.now() - t0);
    t0 = performance.now(); await m.signIn(store, 'an@student.labflow.example', 'wrong-password-' + i); b.push(performance.now() - t0);
  }
  const ra = median(a), rb = median(b), ratio = Math.max(ra, rb) / Math.max(Math.min(ra, rb), 0.001);
  expect(ratio < 1.5, `no such email ${ra.toFixed(1)} ms vs wrong password ${rb.toFixed(1)} ms — ${ratio.toFixed(1)}×: the clock tells who has an account`);
});

// ── T7 one answer ──
await check('T7 one answer for both failures; email matched trimmed + lower-case', 0.5, async () => {
  const store = fakeStore([{ id: 'usr_1', email: 'an@student.labflow.example', passwordHash: await m.hashPassword('an-lab-2026') }]);
  const x = await m.signIn(store, 'nobody@student.labflow.example', 'wrong-password-1');
  const y = await m.signIn(store, 'an@student.labflow.example', 'wrong-password-1');
  expect(!x?.user && !y?.user && JSON.stringify(x) === JSON.stringify(y), `different answers: ${JSON.stringify(x)} vs ${JSON.stringify(y)}`);
  expect((await m.signIn(store, ' An@Student.LabFlow.example ', 'an-lab-2026'))?.user?.id === 'usr_1', '" An@Student.LabFlow.example " should find An');
});

// ── T8 policy ──
await check('T8 checkNewPassword follows NIST 800-63B-4 (length, blocklist, context, no composition rules)', 1, async () => {
  const c = (pw, email = 'an@student.labflow.example') => m.checkNewPassword(pw, { email, blocklist: BLOCK });
  const rejected = [['123456', 'COMMON'], ['an-lab-2026', 'TOO_SHORT'], ['x'.repeat(129), 'TOO_LONG'], ['LabFlow2026!!!!!', 'CONTEXT_WORD']];
  for (const [pw, code] of rejected) {
    const r = c(pw);
    expect(Array.isArray(r) && r.includes(code), `${JSON.stringify(pw.slice(0, 20))} should include ${code}, got ${JSON.stringify(r)}`);
  }
  for (const pw of ['tram nam trong coi nguoi ta', 'correct horse battery staple', 'ờ'.repeat(15).normalize('NFD')]) {
    const r = c(pw);
    expect(Array.isArray(r) && r.length === 0, `${JSON.stringify(pw.slice(0, 20))} is long and uncommon — it should be accepted (no composition rules), got ${JSON.stringify(r)}`);
  }
});

// ── T9 source ──
await check('T9 source: no blocking *Sync hashing, no Math.random, no password in a log line', 1, async () => {
  expect(typeof (await m.hashPassword('x-x-x-x-x-x-x-x')) === 'string', 'hashPassword is not written yet — the source checks start counting once it works');
  const src = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  expect(!/\b(hashSync|compareSync|verifySync|scryptSync|pbkdf2Sync)\b/.test(src), 'a *Sync hash call blocks the event loop for every user (nodejs 8.1: /health 2,784 ms)');
  expect(!/Math\.random/.test(src), 'Math.random in a password module');
  expect(!/console\.\w+\([^)\n]*\b(password|pw)\b/i.test(src), 'a console call prints a password (lesson 1.5: logs are read by many people)');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 2 — ${path.relative(process.cwd(), file)}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(86)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
