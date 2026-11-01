// demo1/shared-key.mjs — lesson 1.4: with HMAC, every service that can CHECK a token can also MAKE one.
// Tokens here are "<payload>.<tag>", the same shape as a JWT (Chapter 4 builds the real thing).
import { createHmac, generateKeyPairSync, sign, verify, timingSafeEqual } from 'node:crypto';

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const read = (t) => JSON.parse(Buffer.from(t.split('.')[0], 'base64url'));

// ── Design A: one shared HMAC key, given to LabFlow ID (issues) and to the billing service (only needs to check) ──
const SHARED = Buffer.from(process.env.DEMO_SHARED_KEY);
const macA = (p) => createHmac('sha256', SHARED).update(p).digest('base64url');
const issueA = (claims) => { const p = b64(claims); return `${p}.${macA(p)}`; };
const checkA = (t) => { const [p, s] = t.split('.'); const good = Buffer.from(macA(p)); const got = Buffer.from(s); return good.length === got.length && timingSafeEqual(good, got); };

const anA = issueA({ sub: 'usr_1', role: 'STUDENT' }); // by LabFlow ID
const evilA = issueA({ sub: 'usr_1', role: 'LAB_MANAGER' }); // by the BILLING service — it has the key, so it can
console.log('A · An’s token checks out          →', checkA(anA), read(anA));
console.log('A · token made by billing checks out →', checkA(evilA), read(evilA));

// ── Design B: LabFlow ID keeps an Ed25519 PRIVATE key; billing only gets the PUBLIC key ──
const { privateKey, publicKey } = generateKeyPairSync('ed25519');
const issueB = (claims) => { const p = b64(claims); return `${p}.${sign(null, Buffer.from(p), privateKey).toString('base64url')}`; };
const checkB = (t) => { const [p, s] = t.split('.'); return verify(null, Buffer.from(p), publicKey, Buffer.from(s, 'base64url')); };

const anB = issueB({ sub: 'usr_1', role: 'STUDENT' });
console.log('B · billing checks An’s token       →', checkB(anB), read(anB));
try {
  const p = b64({ sub: 'usr_1', role: 'LAB_MANAGER' });
  console.log(`${p}.${sign(null, Buffer.from(p), publicKey).toString('base64url')}`);
} catch (e) {
  console.log('B · billing tries to make a token   →', e.code);
}
const tampered = b64({ sub: 'usr_1', role: 'LAB_MANAGER' }) + '.' + anB.split('.')[1]; // old signature, new payload
console.log('B · reuse An’s signature on a new payload →', checkB(tampered));
