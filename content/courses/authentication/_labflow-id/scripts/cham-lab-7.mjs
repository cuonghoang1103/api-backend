// scripts/cham-lab-7.mjs — grader of Lab 7 (LabFlow ID's TOTP). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-7.mjs <folder with index.js>     e.g.  node scripts/cham-lab-7.mjs lab7/my
// It drives YOUR hotp/totp/verifyTotp against the RFC 4226 and RFC 6238 published test vectors and a skew window.
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dir = path.resolve(process.argv[2] ?? 'lab7/my');
const m = await import(pathToFileURL(path.join(dir, 'index.js')).href);
const RFC_KEY = Buffer.from('12345678901234567890');                     // the RFC's ASCII secret
let B32 = null; try { B32 = m.base32Encode(RFC_KEY); } catch { /* starter: base32 not implemented yet */ }

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) {
  let why = '';
  try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `your code threw ${e?.name}: ${String(e?.message).split('\n')[0]}`; }
  results.push({ name, points, ok: !why, why });
}

await check('T1 base32Encode/Decode round-trip', 1, async () => {
  expect(typeof m.base32Encode === 'function' && typeof m.base32Decode === 'function', 'export base32Encode and base32Decode');
  expect(m.base32Decode(m.base32Encode(Buffer.from('hello'))).toString() === 'hello', 'decode(encode(x)) must equal x');
});

await check('T2 hotp matches the RFC 4226 vectors (counter 0–9)', 2, async () => {
  const want = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
  for (let c = 0; c < want.length; c++) expect(m.hotp(RFC_KEY, c, { digits: 6 }) === want[c], `hotp(key, ${c}) must be ${want[c]}`);
});

await check('T3 totp matches the RFC 6238 vectors (SHA-1, 8 digits)', 2.5, async () => {
  for (const [t, w] of [[59, '94287082'], [1111111109, '07081804'], [1234567890, '89005924'], [20000000000, '65353130']])
    expect(m.totp(B32, { time: t, digits: 8 }) === w, `totp at t=${t} must be ${w}`);
});

await check('T4 totp default is 6 digits over a 30-second step', 1.5, async () => {
  const a = m.totp(B32, { time: 1700000040 }), b = m.totp(B32, { time: 1700000069 }), c = m.totp(B32, { time: 1700000070 });
  expect(/^\d{6}$/.test(a), 'a 6-digit code');
  expect(a === b, 'codes in the same 30s step (…040–…069) must match');
  expect(a !== c, 'the next step (…070) must give a different code');
});

await check('T5 verifyTotp accepts ±1 step of skew, rejects beyond', 2, async () => {
  const now = 1700000055;
  expect(m.verifyTotp(B32, m.totp(B32, { time: now - 30 }), { time: now, window: 1 }).ok, 'the previous step must be accepted');
  expect(m.verifyTotp(B32, m.totp(B32, { time: now }), { time: now, window: 1 }).ok, 'the current step must be accepted');
  expect(!m.verifyTotp(B32, m.totp(B32, { time: now - 90 }), { time: now, window: 1 }).ok, 'three steps away must be rejected');
});

await check('T6 verifyTotp rejects a wrong code and never crashes', 1, async () => {
  expect(!m.verifyTotp(B32, '000000', { time: 1700000000, window: 1 }).ok, 'a wrong code must be rejected');
  expect(!m.verifyTotp(B32, '', { time: 1700000000 }).ok, 'an empty code must be rejected, not throw');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 7 — ${path.relative(process.cwd(), path.join(dir, 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(62)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
