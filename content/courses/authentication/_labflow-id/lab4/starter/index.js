// lab4/starter/index.js — Lab 4 starter. Write LabFlow ID's JWT verifier.
//
// makeVerifier(config) returns a function verify(token, { now, revoked }) that RETURNS the payload for a valid
// token and THROWS for anything wrong. config = { keyring, issuer, audience, skewSec }.
//   keyring  { kid: { alg, verify(signingInput, signatureB64url) } }  — the only keys you accept.
//            IMPORTANT: choose the algorithm from the KEY you look up by kid, never from the token's header.
//   issuer, audience  the exact iss / aud you require.   skewSec  clock-skew leeway on exp and nbf.
// You may import ../../src/jwt/base64url.js for decodeJwt. Do NOT import ../../src/jwt/verify.js — that is the answer.
import { decodeJwt } from '../../src/jwt/base64url.js';

export function makeVerifier({ keyring, issuer, audience, skewSec = 60 }) {
  return (token, { now = Date.now(), revoked = new Set() } = {}) => {
    // TODO: parse the token, pick the key by kid, check header.alg === key.alg, verify the signature,
    //       then check iss, aud, sub, exp (with skew), nbf (with skew), iat, jti (present and not revoked).
    throw new Error('not implemented');
  };
}
