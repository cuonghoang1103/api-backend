// src/jwt/keyring.js — lessons 4.1, 4.2, 4.4: the keys LabFlow ID signs and verifies with.
// A keyring is { kid: entry }. Each entry knows ONE algorithm and how to sign/verify with it. The verifier
// chooses the algorithm from the KEY it looked up by kid, never from the token's header — that is what makes
// "alg: none" and HS↔RS confusion (lesson 4.2) impossible.
import { createHmac, timingSafeEqual, sign as nodeSign, verify as nodeVerify, generateKeyPairSync } from 'node:crypto';
import { unb64url } from './base64url.js';

/** A symmetric HS256 key — HMAC-SHA256 (lesson 1.4). One secret signs AND verifies: only its holder can do either. */
export function hs256(secret) {
  return {
    alg: 'HS256',
    sign: (input) => createHmac('sha256', secret).update(input).digest('base64url'),
    verify(input, sig) {
      const want = createHmac('sha256', secret).update(input).digest();
      const got = unb64url(sig);
      return got.length === want.length && timingSafeEqual(got, want); // constant time, same length (lesson 1.3)
    },
  };
}

/** An asymmetric EdDSA (Ed25519) key — LabFlow ID's production default. The PRIVATE key signs; the PUBLIC key,
 *  which anyone may hold, only verifies. Ed25519 signatures are a fixed 64 raw bytes — no DER, no curve tricks. */
export function eddsa({ publicKey, privateKey }) {
  return {
    alg: 'EdDSA',
    sign: (input) => nodeSign(null, Buffer.from(input), privateKey).toString('base64url'),
    verify: (input, sig) => { try { return nodeVerify(null, Buffer.from(input), publicKey, unb64url(sig)); } catch { return false; } },
    publicKey, // kept so lesson 4.4 can publish it as a JWKS
  };
}

/** A fresh Ed25519 key pair (KeyObjects). */
export const newEd25519 = () => generateKeyPairSync('ed25519');
