// lab4/tham-khao/index.js — the reference solution: LabFlow ID's real verifier, src/jwt/verify.js, wrapped in the
// makeVerifier() shape the grader expects. The logic is shown line by line in lessons 4.2 and 4.3.
import { verify } from '../../src/jwt/verify.js';

export function makeVerifier({ keyring, issuer, audience, skewSec = 60 }) {
  return (token, { now = Date.now(), revoked = new Set() } = {}) =>
    verify(token, { keyring, issuer, audience, skewSec, now, revoked });
}
