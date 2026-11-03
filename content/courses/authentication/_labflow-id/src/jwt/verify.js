// src/jwt/verify.js — lessons 4.2 and 4.3: ONE strict verifier. The order of the checks is the lesson.
import { decodeJwt } from './base64url.js';

/** Thrown with a stable .code so callers log a reason without leaking it to the client. */
export class JwtError extends Error {
  constructor(code) { super(code); this.name = 'JwtError'; this.code = code; }
}

/**
 * Verify a LabFlow ID token, or throw a JwtError.
 *   keyring   { kid: entry }  — the only keys we accept (keyring.js)
 *   issuer    string          — exact iss we require
 *   audience  string          — must appear in aud
 *   now       ms               — inject in tests
 *   skewSec   seconds of clock skew allowed on exp/nbf (default 60; RFC 7519 lets each side pick "a small leeway")
 *   revoked   Set of jti that must be rejected (lesson 4.3; the denylist Chapter 5 fills)
 */
export function verify(token, { keyring, issuer, audience, now = Date.now(), skewSec = 60, revoked = new Set() }) {
  let d;
  try { d = decodeJwt(token); } catch { throw new JwtError('MALFORMED'); }
  const { header, payload, signingInput, signature } = d;

  // 1) ALGORITHM — decided by the key we hold, never by the attacker-supplied header.
  //    This one rule defeats "alg": "none" (there is no key whose alg is none) and HS/RS confusion
  //    (a token claiming HS256 against an EdDSA kid is an ALG_MISMATCH, so the public key is never used as an HMAC secret).
  if (header.typ && header.typ !== 'JWT') throw new JwtError('BAD_TYP');
  if (!header.kid) throw new JwtError('NO_KID');
  const key = keyring[header.kid]; // a plain object lookup — NEVER a file path (lesson 4.4: kid path traversal)
  if (!key) throw new JwtError('UNKNOWN_KID');
  if (header.alg !== key.alg) throw new JwtError('ALG_MISMATCH');

  // 2) SIGNATURE — before any claim is trusted.
  if (!key.verify(signingInput, signature)) throw new JwtError('BAD_SIGNATURE');

  // 3) CLAIMS — the seven of lesson 4.3. Only now is the payload trustworthy.
  const nowSec = Math.floor(now / 1000);
  if (payload.iss !== issuer) throw new JwtError('BAD_ISS');                 // who minted it
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(audience)) throw new JwtError('BAD_AUD');                // who it is for
  if (typeof payload.sub !== 'string' || !payload.sub) throw new JwtError('NO_SUB'); // who it is about
  if (typeof payload.exp !== 'number' || nowSec - skewSec >= payload.exp) throw new JwtError('EXPIRED');
  if (typeof payload.nbf === 'number' && nowSec + skewSec < payload.nbf) throw new JwtError('NOT_YET');
  if (typeof payload.iat !== 'number') throw new JwtError('NO_IAT');
  if (!payload.jti) throw new JwtError('NO_JTI');
  if (revoked.has(payload.jti)) throw new JwtError('REVOKED');
  return payload;
}
