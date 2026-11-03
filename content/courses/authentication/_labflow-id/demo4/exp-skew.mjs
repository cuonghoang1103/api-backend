// demo4/exp-skew.mjs — lesson 4.3: exp is a boundary, and clock skew is a real tolerance (RFC 7519 §4.1.4).
import { sign } from '../src/jwt/index.js';
import { verify, JwtError } from '../src/jwt/verify.js';
import { makeIssuer, ISSUER, AUDIENCE } from './_util.mjs';

const { keyring, kid } = makeIssuer();
const t0 = Date.UTC(2026, 10, 3, 9, 0, 0);
const s0 = Math.floor(t0 / 1000);
const base = { iss: ISSUER, sub: 'usr_1', aud: AUDIENCE, iat: s0, nbf: s0, exp: s0 + 900, jti: 'x' };
const token = sign(base, { key: keyring[kid], kid });            // valid 09:00 → 09:15
const at = (deltaSec, skewSec) => {
  const now = t0 + deltaSec * 1000;
  try { verify(token, { keyring, issuer: ISSUER, audience: AUDIENCE, now, skewSec }); return 'accepted'; }
  catch (e) { return 'rejected ' + (e instanceof JwtError ? e.code : e.message); }
};

console.log('token valid from 09:00:00, exp 09:15:00 (900 s). skewSec = 0 (strict):');
console.log('  at 09:14:59 (exp − 1 s) :', at(899, 0));
console.log('  at 09:15:00 (exp exactly):', at(900, 0), '  ← exp == now is already expired');
console.log('  at 09:15:01 (exp + 1 s) :', at(901, 0));

console.log('\nreal deployments allow a little clock skew. skewSec = 60:');
console.log('  at 09:15:30 (30 s late) :', at(930, 60), '  ← within the 60 s leeway');
console.log('  at 09:16:01 (61 s late) :', at(961, 60));

const future = sign({ ...base, nbf: s0 + 120, iat: s0 }, { key: keyring[kid], kid }); // not valid before 09:02
const atF = (deltaSec, skewSec) => { const now = t0 + deltaSec * 1000; try { verify(future, { keyring, issuer: ISSUER, audience: AUDIENCE, now, skewSec }); return 'accepted'; } catch (e) { return 'rejected ' + e.code; } };
console.log('\nnbf (not before) 09:02:00, skewSec = 60:');
console.log('  at 09:00:30 (90 s early):', atF(30, 60));
console.log('  at 09:01:05 (55 s early):', atF(65, 60), '  ← inside the leeway');
