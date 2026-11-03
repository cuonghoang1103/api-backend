// src/oidc/client.js — LabFlow API as an OIDC client (relying party), Chapter 8. It starts a login (PKCE verifier +
// state + nonce), then verifies the ID token: the signature against the provider's JWKS, and the claims with the pure
// seven-check core (src/oidc/verify.js, lesson 8.4).
import { randomBytes, createHash } from 'node:crypto';
import { decodeJwt } from '../jwt/index.js';
import { verifyIdToken as checkClaims } from './verify.js';

const s256 = (v) => createHash('sha256').update(v).digest('base64url');

export function oidcClient({ clientId, redirectUri, issuer }) {
  return {
    begin(scope = 'openid email profile') {
      const codeVerifier = randomBytes(32).toString('base64url');
      const state = randomBytes(16).toString('base64url');
      const nonce = randomBytes(16).toString('base64url');
      const authUrl = `${issuer}/oauth/authorize?` + new URLSearchParams({
        response_type: 'code', client_id: clientId, redirect_uri: redirectUri, scope,
        state, nonce, code_challenge: s256(codeVerifier), code_challenge_method: 'S256',
      });
      return { codeVerifier, state, nonce, authUrl };
    },
    // verifySig(token) ⇒ Promise<boolean> validates the signature against the provider's JWKS.
    async verifyIdToken(idToken, ctx, verifySig) {
      let payload;
      try { payload = decodeJwt(idToken).payload; } catch { return { error: 'malformed' }; }
      const signatureValid = await verifySig(idToken);
      const r = checkClaims(payload, { ...ctx, signatureValid });
      return r.ok ? { ok: true, sub: payload.sub, email: payload.email, name: payload.name } : r;
    },
  };
}
