// demo4/perf.mjs — lesson 4.4: how fast each algorithm signs and verifies, and how big the token is. Verify is the
// hot path (every request), so it is the number that matters. Measured 3 times; all rounds printed (machine-dependent).
import { createHmac, timingSafeEqual, generateKeyPairSync, sign as nSign, verify as nVerify, randomBytes } from 'node:crypto';

const INPUT = Buffer.from('eyJhbGciOiJFZERTQSJ9.' + randomBytes(120).toString('base64url')); // a realistic header.payload
const ROUNDS = 3, N = 20000;

const hsKey = randomBytes(32);
const ed = generateKeyPairSync('ed25519');
const ec = generateKeyPairSync('ec', { namedCurve: 'P-256' });
const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 });

const algs = {
  HS256: { sign: () => createHmac('sha256', hsKey).update(INPUT).digest(), verify: (s) => { const w = createHmac('sha256', hsKey).update(INPUT).digest(); return w.length === s.length && timingSafeEqual(w, s); } },
  EdDSA: { sign: () => nSign(null, INPUT, ed.privateKey), verify: (s) => nVerify(null, INPUT, ed.publicKey, s) },
  ES256: { sign: () => nSign('sha256', INPUT, ec.privateKey), verify: (s) => nVerify('sha256', INPUT, ec.publicKey, s) },
  RS256: { sign: () => nSign('sha256', INPUT, rsa.privateKey), verify: (s) => nVerify('sha256', INPUT, rsa.publicKey, s) },
};

const perSec = (fn) => { const a = process.hrtime.bigint(); for (let i = 0; i < N; i++) fn(); const ms = Number(process.hrtime.bigint() - a) / 1e6; return Math.round(N / (ms / 1000)); };

console.log('ops/sec over', N, 'iterations, 3 rounds (macOS arm64, Node 22.23.3):');
console.log('alg     sig bytes        sign/s (r1·r2·r3)                 verify/s (r1·r2·r3)');
for (const [name, a] of Object.entries(algs)) {
  const s = a.sign();
  for (let w = 0; w < 2000; w++) { a.sign(); a.verify(s); } // warm up the JIT
  const signs = Array.from({ length: ROUNDS }, () => perSec(() => a.sign()));
  const vers = Array.from({ length: ROUNDS }, () => perSec(() => a.verify(s)));
  console.log(name.padEnd(7), String(s.length).padStart(3), '         ', signs.map((x) => x.toLocaleString('en-US')).join(' · ').padEnd(30), '  ', vers.map((x) => x.toLocaleString('en-US')).join(' · '));
}
