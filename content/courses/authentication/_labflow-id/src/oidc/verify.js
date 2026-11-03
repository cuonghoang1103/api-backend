// src/oidc/verify.js — the SEVEN checks a client runs on an ID token (lesson 8.4), as a pure function. The signature
// is checked separately (it needs the provider's JWKS) and the result passed in as `signatureValid`; everything else is
// a claim check. Accepting an ID token you did not fully check is how "sign in with…" turns into an auth bypass.
export function verifyIdToken(payload, { signatureValid, expectedIssuer, expectedAudience, nonce, now = Math.floor(Date.now() / 1000) }) {
  if (!payload || typeof payload !== 'object') return { error: 'malformed' };        // 1. it decoded to claims
  if (!signatureValid) return { error: 'bad_signature' };                            // 2. signed by the provider (JWKS)
  if (payload.iss !== expectedIssuer) return { error: 'bad_iss' };                   // 3. from the issuer we expect
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(expectedAudience)) return { error: 'bad_aud' };                  // 4. minted for US
  if (typeof payload.exp !== 'number' || payload.exp <= now) return { error: 'expired' };     // 5. not expired
  if (typeof payload.iat !== 'number' || payload.iat > now + 60) return { error: 'bad_iat' }; // 6. not future-dated
  if (nonce !== undefined && payload.nonce !== nonce) return { error: 'bad_nonce' }; // 7. our nonce (replay defence)
  return { ok: true, sub: payload.sub };
}
