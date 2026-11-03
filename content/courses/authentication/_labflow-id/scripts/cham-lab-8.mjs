// scripts/cham-lab-8.mjs — grader of Lab 8 (LabFlow API's ID-token check). 6 checks, 10 points, pass = 7.
// Usage: node scripts/cham-lab-8.mjs <folder with index.js>
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab8/my', 'index.js')).href);
const NOW = 1_700_000_000;
const good = { iss: 'https://id.labflow.example', aud: 'labflow-api', exp: NOW + 300, iat: NOW, nonce: 'n1', sub: 'usr_1' };
const ctx = { signatureValid: true, expectedIssuer: 'https://id.labflow.example', expectedAudience: 'labflow-api', nonce: 'n1', now: NOW };
const v = (p, c = {}) => m.verifyIdToken(p, { ...ctx, ...c });

const results = [];
const expect = (cond, why) => { if (!cond) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) { let why = ''; try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `threw ${e?.name}: ${String(e?.message).split('\n')[0]}`; } results.push({ name, points, ok: !why, why }); }

await check('T1 a valid token is accepted', 1.5, async () => { const r = v(good); expect(r.ok === true, 'a fully valid token must return { ok: true }'); expect(r.sub === 'usr_1', 'it should return the subject'); });
await check('T2 a bad signature is rejected (the critical one)', 2, async () => { expect(v(good, { signatureValid: false }).error === 'bad_signature', 'signatureValid:false must give bad_signature — a forged token must not be accepted'); });
await check('T3 the wrong issuer is rejected', 1.5, async () => { expect(v({ ...good, iss: 'https://evil.example' }).error === 'bad_iss', 'a token from another issuer must give bad_iss'); });
await check('T4 the wrong audience is rejected (string or array aud)', 2, async () => {
  expect(v({ ...good, aud: 'other-app' }).error === 'bad_aud', 'a token minted for another client must give bad_aud');
  expect(v({ ...good, aud: ['x', 'labflow-api'] }).ok === true, 'an array aud containing our id must be accepted');
});
await check('T5 expired and future-dated are rejected', 1.5, async () => {
  expect(v({ ...good, exp: NOW - 1 }).error === 'expired', 'an expired token must give expired');
  expect(v({ ...good, iat: NOW + 3600 }).error === 'bad_iat', 'a future-dated token must give bad_iat');
});
await check('T6 a wrong nonce is rejected; malformed never crashes', 1.5, async () => {
  expect(v({ ...good, nonce: 'n2' }).error === 'bad_nonce', 'a token whose nonce is not ours must give bad_nonce (replay)');
  expect(v(null).error === 'malformed', 'a null payload must give malformed, not a crash');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(`Lab 8 — ${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab8/my', 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(56)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
