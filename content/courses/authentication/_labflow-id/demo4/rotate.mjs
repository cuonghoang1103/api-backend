// demo4/rotate.mjs — lesson 4.4: rotate the signing key without signing anyone out. Two keys are live at once:
// the NEW one signs, BOTH verify, and the old one is dropped only after every token it signed has expired.
import { accessTokens, eddsa, newEd25519 } from '../src/jwt/index.js';
import { JwtError } from '../src/jwt/verify.js';
import { ISSUER, AUDIENCE } from './_util.mjs';

const oldKey = eddsa(newEd25519());
const newKey = eddsa(newEd25519());

// Day 1: only the old key exists.
let keyring = { 'ed-2026-10': oldKey };
let iss = accessTokens({ keyring, activeKid: 'ed-2026-10', issuer: ISSUER, audience: AUDIENCE });
const tokenFromOld = iss.issue('usr_1', { role: 'STUDENT' });
console.log('day 1: token signed with kid ed-2026-10 →', iss.verify(tokenFromOld).sub, '(accepted)');

// Day 2, step 1: add the new key to the JWKS but keep signing with the old one (clients refresh their JWKS cache).
keyring = { 'ed-2026-10': oldKey, 'ed-2026-11': newKey };
console.log('\nday 2: publish both keys in the JWKS, still sign with the old one — clients pick up the new key');

// Day 2, step 2: switch the ACTIVE key to the new one. Tokens from the old key MUST still verify.
iss = accessTokens({ keyring, activeKid: 'ed-2026-11', issuer: ISSUER, audience: AUDIENCE });
const tokenFromNew = iss.issue('usr_1', { role: 'STUDENT' });
console.log('  new tokens signed with kid ed-2026-11 →', iss.verify(tokenFromNew).sub, '(accepted)');
console.log('  old tokens (kid ed-2026-10) still    →', iss.verify(tokenFromOld).sub, '(accepted — no one is signed out)');

// Day 3: every token the old key could have signed has expired (15 min). Drop it from the JWKS.
keyring = { 'ed-2026-11': newKey };
iss = accessTokens({ keyring, activeKid: 'ed-2026-11', issuer: ISSUER, audience: AUDIENCE });
console.log('\nday 3: 15 min after the switch, remove the old key from the JWKS');
try { iss.verify(tokenFromOld); console.log('  old token still accepted (broken)'); }
catch (e) { console.log('  an old token now →', e instanceof JwtError ? e.code : e.message, '(its kid is gone)'); }
console.log('  new tokens →', iss.verify(tokenFromNew).sub, '(accepted)');
