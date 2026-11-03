// demo5/two-tokens.mjs — lesson 5.1: two tokens, because one cannot do both jobs.
// The access token is short, stateless and self-describing (a JWT, Chapter 4). The refresh token is long-lived, opaque,
// stored only as a digest, and revocable. Put the long life on the JWT and a stolen one lives 30 days; put the short
// life on the refresh token and the user signs in every 15 minutes. So you need both.
import { accessTokens, eddsa, newEd25519, decodeJwt } from '../src/jwt/index.js';
import { refreshLayer, memoryStore } from '../src/refresh/index.js';
import { tokenDigest } from '../src/crypto/index.js';

const tokens = accessTokens({ keyring: { 'ed-2026-11': eddsa(newEd25519()) }, activeKid: 'ed-2026-11', issuer: 'https://id.labflow.example', audience: 'labflow-api' });
const refresh = refreshLayer({ store: memoryStore() });

const access = tokens.issue('usr_1', { role: 'STUDENT' });
const { token: rt, row } = await refresh.issue('usr_1', { ua: 'laptop' });

console.log('ACCESS token (a JWT — Chapter 4):');
console.log('  shape    :', access.split('.').length, 'base64url parts, ' + access.length + ' chars');
console.log('  readable :', JSON.stringify({ sub: decodeJwt(access).payload.sub, role: decodeJwt(access).payload.role }));
console.log('  lifetime : 15 minutes · stateless (no DB lookup) · cannot be revoked before it expires');

console.log('\nREFRESH token (opaque, Chapter 5):');
console.log('  shape    :', rt.slice(0, 12) + '… — one opaque secret, no readable claims');
console.log('  stored   : only its SHA-256 digest', tokenDigest(rt).slice(0, 16) + '… (never the token, lesson 1.3)');
console.log('  lifetime : 30 days · stateful (one row) · revocable instantly, and rotated on every use');

console.log('\nwhy not one token for both jobs:');
console.log('  long-lived JWT  ⇒ a stolen token is valid for 30 days and cannot be revoked (4.3)');
console.log('  short-lived refresh ⇒ the user would re-enter their password every 15 minutes');
console.log('  so: a short access token for every request, a long refresh token used only at /refresh');
