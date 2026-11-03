// demo4/jose.mjs — lesson 4.4: cross-check. The point of a standard is interop. A token we sign must verify with a
// library we did not write, and a token that library signs must verify with ours. If either fails, we are off-spec.
import { publicJwks, jwksVerifier, signWithJose } from '../src/jwt/jwks.js';
import { makeIssuer, ISSUER, AUDIENCE } from './_util.mjs';

const { tokens, keyring, kp, kid } = makeIssuer();

// 1) our token → verified by jose (via the JWKS)
const ours = tokens.issue('usr_3', { role: 'LAB_MANAGER' });
const viaJose = await jwksVerifier(await publicJwks(keyring))(ours, { issuer: ISSUER, audience: AUDIENCE });
console.log('our EdDSA token, verified by jose : sub =', viaJose.sub, 'role =', viaJose.role);

// 2) jose's token → verified by our own verifier
const theirs = await signWithJose({ sub: 'usr_1', role: 'STUDENT' }, { privateKey: kp.privateKey, kid, issuer: ISSUER, audience: AUDIENCE });
const viaOurs = tokens.verify(theirs);
console.log('jose EdDSA token, verified by ours : sub =', viaOurs.sub, 'role =', viaOurs.role);
console.log('\nboth directions pass ⇒ LabFlow ID speaks the same JWS/JWT as any compliant client (RFC 7515, 7519).');
