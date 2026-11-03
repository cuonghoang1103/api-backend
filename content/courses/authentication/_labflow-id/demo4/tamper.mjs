// demo4/tamper.mjs — lesson 4.1: change one character of the payload and the signature no longer fits.
import { decodeJwt, b64urlJson } from '../src/jwt/index.js';
import { JwtError } from '../src/jwt/verify.js';
import { makeIssuer } from './_util.mjs';

const { tokens } = makeIssuer();
const token = tokens.issue('usr_1', { role: 'STUDENT' }); // An, a plain student

console.log('An has a valid token, verified:');
console.log('  sub =', tokens.verify(token).sub, '/ role =', tokens.verify(token).role);

// The attacker reads the payload (that is free), edits the role to LAB_MANAGER, and re-encodes it —
// but leaves the signature as it was, because they cannot produce a new one without the private key.
const d = decodeJwt(token);
const forgedPayload = b64urlJson({ ...d.payload, role: 'LAB_MANAGER', sub: 'usr_1' });
const [h, , s] = token.split('.');
const forged = `${h}.${forgedPayload}.${s}`;

console.log('\nthe attacker rewrites role=LAB_MANAGER and keeps the old signature:');
console.log('  forged payload decodes to role =', decodeJwt(forged).payload.role, '(they can write anything here)');
try {
  tokens.verify(forged);
  console.log('  VERIFY ACCEPTED THE FORGERY — the server is broken');
} catch (e) {
  console.log('  verify →', e instanceof JwtError ? e.code : e.message, '— the signature covers the payload, so editing it breaks it');
}
