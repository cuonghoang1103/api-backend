// lab4/yeu/index.js — a first attempt that "works": it signs people in and rejects a tampered token. It verifies
// the signature and calls it a day — the mistake almost every first JWT integration makes.
import { decodeJwt } from '../../src/jwt/base64url.js';

export function makeVerifier({ keyring, issuer, audience, skewSec = 60 }) {
  return (token, { now = Date.now(), revoked = new Set() } = {}) => {
    const { header, payload, signingInput, signature } = decodeJwt(token);
    if (header.alg === 'none') return payload;          // "the token says it is unsigned, so there is nothing to check"
    const key = keyring[header.kid];
    if (key && !key.verify(signingInput, signature)) throw new Error('bad signature');
    return payload;                                     // signature checks out ⇒ trusted. But which claims?
  };
}
