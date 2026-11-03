// src/oidc/provider.js — LabFlow ID as an OpenID Connect provider (Chapter 8). Authorization-code flow + PKCE only
// (OAuth 2.1: implicit and plain-PKCE are gone). A one-time code is bound to the client, the exact redirect_uri and the
// PKCE challenge; the token endpoint trades it — with the matching verifier — for an access token and a signed ID token.
import { randomBytes, createHash } from 'node:crypto';
import { sign } from '../jwt/index.js';

const s256 = (v) => createHash('sha256').update(String(v ?? '')).digest('base64url');

export function oidcProvider({ issuer, keyring, activeKid, now = () => Date.now(), codeTtlMs = 60_000, idTokenTtlSec = 300 }) {
  const codes = new Map();                                   // code → one-time grant (process-local; Chapter 11 → Redis)

  return {
    // The discovery document a client reads once to learn every endpoint and the algorithms we support.
    discovery() {
      return {
        issuer,
        authorization_endpoint: `${issuer}/oauth/authorize`,
        token_endpoint: `${issuer}/oauth/token`,
        userinfo_endpoint: `${issuer}/oauth/userinfo`,
        jwks_uri: `${issuer}/.well-known/jwks.json`,
        response_types_supported: ['code'],                  // only code — implicit is dead (8.1)
        grant_types_supported: ['authorization_code'],
        id_token_signing_alg_values_supported: ['EdDSA'],
        code_challenge_methods_supported: ['S256'],          // PKCE required; 'plain' deliberately absent (OAuth 2.1)
        scopes_supported: ['openid', 'email', 'profile'],
        subject_types_supported: ['public'],
      };
    },

    // The user is already signed in to the provider (a Chapter 3 session). authorize() mints a one-time code bound to
    // this client, this redirect_uri and this PKCE challenge, and returns where to send the browser back.
    authorize(client, p, userId) {
      if (!client) return { error: 'invalid_client' };
      if (p.response_type !== 'code') return { error: 'unsupported_response_type' };
      if (!client.redirectUris.includes(p.redirect_uri)) return { error: 'invalid_redirect_uri' };  // EXACT match, never prefix (8.3)
      if (p.code_challenge_method !== 'S256' || !p.code_challenge) return { error: 'invalid_request' }; // PKCE mandatory
      const code = 'lfc_' + randomBytes(24).toString('base64url');
      codes.set(code, { clientId: client.clientId, userId, redirectUri: p.redirect_uri, codeChallenge: p.code_challenge, nonce: p.nonce, scope: p.scope ?? 'openid', exp: now() + codeTtlMs });
      const url = new URL(p.redirect_uri);
      url.searchParams.set('code', code);
      if (p.state != null) url.searchParams.set('state', p.state);        // echoed back unchanged — the client checks it (8.3)
      return { code, redirect: url.toString() };
    },

    // Exchange the code for tokens. Everything is re-checked: same client, same redirect_uri, not expired, single-use,
    // and the PKCE verifier must hash to the challenge the code was bound to.
    async token(client, p, findUser) {
      if (p.grant_type !== 'authorization_code') return { error: 'unsupported_grant_type' };
      const rec = codes.get(p.code);
      if (!rec || !client || rec.clientId !== client.clientId) return { error: 'invalid_grant' };
      codes.delete(p.code);                                              // single-use: a replayed code is already gone
      if (now() >= rec.exp) return { error: 'invalid_grant' };           // 60-second life
      if (rec.redirectUri !== p.redirect_uri) return { error: 'invalid_grant' };
      if (s256(p.code_verifier) !== rec.codeChallenge) return { error: 'invalid_grant' };  // the PKCE proof (8.2)
      const user = (await findUser(rec.userId)) ?? { email: '', name: '' };
      const t = Math.floor(now() / 1000);
      const id_token = sign({
        iss: issuer, sub: rec.userId, aud: client.clientId, iat: t, exp: t + idTokenTtlSec,
        ...(rec.nonce ? { nonce: rec.nonce } : {}), email: user.email, name: user.name,
      }, { key: keyring[activeKid], kid: activeKid });
      return { access_token: 'lfa_' + randomBytes(24).toString('base64url'), token_type: 'Bearer', expires_in: idTokenTtlSec, id_token, scope: rec.scope };
    },
  };
}
