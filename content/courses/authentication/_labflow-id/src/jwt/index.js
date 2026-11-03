// src/jwt/index.js — LabFlow ID v0.4: issue and verify its own access tokens (Chapter 4).
// A short-lived JWT access token says "the bearer is user X, proven at time T, for 15 minutes". Chapter 5 adds the
// long-lived refresh token and rotation; Chapter 8 turns this issuer into an OpenID Connect provider for LabFlow API.
import { randomBytes } from 'node:crypto';
import { sign } from './sign.js';
import { verify, JwtError } from './verify.js';

export { sign } from './sign.js';
export { verify, JwtError } from './verify.js';
export { decodeJwt, b64url, b64urlJson, unb64url } from './base64url.js';
export { hs256, eddsa, newEd25519 } from './keyring.js';

export const ACCESS_TTL_SEC = 15 * 60; // 15 minutes — the number the whole platform shares (lesson 1.1, api-design 6.1)

/**
 * An issuer over a keyring with a current signing kid.
 *   keyring   { kid: entry }   — all keys that are still trusted to VERIFY (old + new during a rotation, lesson 4.4)
 *   activeKid                  — the key new tokens are SIGNED with
 *   issuer, audience           — the fixed iss and aud of this deployment
 */
export function accessTokens({ keyring, activeKid, issuer, audience, ttlSec = ACCESS_TTL_SEC, now = () => Date.now(), skewSec = 60 }) {
  const revoked = new Set(); // jti denylist (process-local for now; Chapter 11 moves it to Redis)

  function issue(userId, { role, ttl = ttlSec } = {}) {
    const iat = Math.floor(now() / 1000);
    const payload = {
      iss: issuer, sub: userId, aud: audience,          // who minted it / who it is about / who it is for
      iat, nbf: iat, exp: iat + ttl,                    // when it was minted / is valid from / expires
      jti: randomBytes(16).toString('base64url'),       // a unique id, so one token can be revoked (lesson 4.3)
      ...(role ? { role } : {}),
    };
    return sign(payload, { key: keyring[activeKid], kid: activeKid });
  }

  const check = (token, opts = {}) => verify(token, { keyring, issuer, audience, now: now(), skewSec, revoked, ...opts });
  const revoke = (jti) => revoked.add(jti);
  return { issue, verify: check, revoke, revoked, keyring, activeKid };
}
