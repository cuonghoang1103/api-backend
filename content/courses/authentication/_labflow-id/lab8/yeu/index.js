// lab8/yeu/index.js — a first attempt that "logs the user in": it checks the issuer and the expiry, which is enough for
// the happy path. But it never checks the signature (so a forged token is accepted), never checks the audience (so a
// token minted for another client works here), and never checks the nonce (so an old token can be replayed).
export function verifyIdToken(payload, { expectedIssuer, now = Math.floor(Date.now() / 1000) }) {
  if (!payload) return { error: 'malformed' };
  if (payload.iss !== expectedIssuer) return { error: 'bad_iss' };
  if (payload.exp <= now) return { error: 'expired' };
  return { ok: true, sub: payload.sub };   // BUG: no signature, no audience, no nonce check
}
