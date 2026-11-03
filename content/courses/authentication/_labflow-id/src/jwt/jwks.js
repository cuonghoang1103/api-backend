// src/jwt/jwks.js — lesson 4.4: publish the PUBLIC half of the signing keys as a JWKS, and cross-check our own
// EdDSA tokens against the `jose` library. A JWKS (JSON Web Key Set) is the standard way a verifier discovers a
// signer's public keys by kid; Chapter 8 serves it at /.well-known/jwks.json for LabFlow API to fetch.
import { exportJWK, importJWK, jwtVerify, SignJWT } from 'jose';

/** Turn our keyring (keyring.js) into a public JWKS: one JWK per EdDSA key, each carrying its kid and use. */
export async function publicJwks(keyring) {
  const keys = [];
  for (const [kid, entry] of Object.entries(keyring)) {
    if (entry.alg !== 'EdDSA' || !entry.publicKey) continue; // never publish HS256 secrets — they verify AND sign
    const jwk = await exportJWK(entry.publicKey);            // { kty:'OKP', crv:'Ed25519', x:'…' } — public only
    keys.push({ ...jwk, kid, use: 'sig', alg: 'EdDSA' });
  }
  return { keys };
}

/** A verifier that resolves a token's kid against a JWKS object (what a CLIENT of LabFlow ID does). */
export function jwksVerifier(jwks) {
  const byKid = new Map(jwks.keys.map((k) => [k.kid, k]));
  return async (token, { issuer, audience }) => {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    const jwk = byKid.get(header.kid);
    if (!jwk) throw new Error('unknown kid — not in the JWKS');
    const key = await importJWK(jwk, 'EdDSA');
    const { payload } = await jwtVerify(token, key, { issuer, audience, algorithms: ['EdDSA'] });
    return payload;
  };
}

/** Sign a token with `jose` (to prove our hand-rolled verifier accepts a standard library's output, and vice versa). */
export async function signWithJose(payload, { privateKey, kid, issuer, audience, ttlSec = 900 }) {
  return new SignJWT({ ...(payload.role ? { role: payload.role } : {}) })
    .setProtectedHeader({ alg: 'EdDSA', typ: 'JWT', kid })
    .setIssuer(issuer).setSubject(payload.sub).setAudience(audience)
    .setIssuedAt().setNotBefore('0s').setExpirationTime(`${ttlSec}s`).setJti(payload.jti ?? crypto.randomUUID())
    .sign(privateKey);
}
