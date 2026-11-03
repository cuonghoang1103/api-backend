// demo4/revoke.mjs — lesson 4.3: a JWT cannot be un-issued. The best you can do before exp is a jti denylist —
// and the service that does not share the denylist keeps trusting the token. This is the price for skipping the
// per-request lookup a session pays (lesson 3.5).
import { makeIssuer, ISSUER, AUDIENCE } from './_util.mjs';
import { decodeJwt } from '../src/jwt/index.js';
import { verify } from '../src/jwt/verify.js';

const { tokens } = makeIssuer();
const token = tokens.issue('usr_3', { role: 'LAB_MANAGER' });
const { jti } = decodeJwt(token).payload;

console.log('issued a token, jti =', jti);
console.log('  verify →', tokens.verify(token).sub, '(accepted)');

tokens.revoke(jti);                 // e.g. the user clicked "sign out" or an admin disabled the account
console.log('\nadded the jti to the denylist (one Set.add):');
try { tokens.verify(token); console.log('  verify → still accepted (broken)'); }
catch (e) { console.log('  verify → rejected', e.code); }

console.log('\nbut a SECOND service shares the key (same JWKS) and keeps its OWN, empty denylist:');
try {
  verify(token, { keyring: tokens.keyring, issuer: ISSUER, audience: AUDIENCE, revoked: new Set() });
  console.log('  it still accepts the revoked token until it expires (15 min) — the JWT trade-off vs a session DELETE');
} catch (e) { console.log('  rejected', e.code); }
