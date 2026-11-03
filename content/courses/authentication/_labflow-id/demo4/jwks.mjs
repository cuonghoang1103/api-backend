// demo4/jwks.mjs — lesson 4.4: publish the public key as a JWKS and let a client verify by kid, with `jose`.
import { publicJwks, jwksVerifier } from '../src/jwt/jwks.js';
import { makeIssuer, ISSUER, AUDIENCE, cut } from './_util.mjs';

const { tokens, keyring, kid } = makeIssuer();
const jwks = await publicJwks(keyring);

console.log('GET /.well-known/jwks.json  (public — safe to cache and share):');
const k = jwks.keys[0];
console.log('  { kty:', JSON.stringify(k.kty) + ', crv:', JSON.stringify(k.crv) + ', kid:', JSON.stringify(k.kid) + ',');
console.log('    use:', JSON.stringify(k.use) + ', alg:', JSON.stringify(k.alg) + ', x:', JSON.stringify(cut(k.x, 20)), '}');
console.log('  no "d" field — the private half never leaves LabFlow ID.');

const token = tokens.issue('usr_3', { role: 'LAB_MANAGER' });
console.log('\nLabFlow API fetches that JWKS once, then verifies tokens by the kid in each header:');
const verifyByJwks = jwksVerifier(jwks);
const payload = await verifyByJwks(token, { issuer: ISSUER, audience: AUDIENCE });
console.log('  token kid =', kid, '→ matched a JWK → verified. sub =', payload.sub, 'role =', payload.role);

console.log('\na token whose kid is not in the JWKS is rejected before any crypto runs:');
const [, p, s] = token.split('.');
const badHeader = Buffer.from(JSON.stringify({ alg: 'EdDSA', typ: 'JWT', kid: 'ed-unknown' })).toString('base64url');
try { await verifyByJwks(`${badHeader}.${p}.${s}`, { issuer: ISSUER, audience: AUDIENCE }); console.log('  accepted (broken)'); }
catch (e) { console.log('  rejected:', e.message); }
