// demo4/_util.mjs — one place the Chapter 4 demos build a keyring + issuer, so every demo uses the same setup.
import { accessTokens, eddsa, newEd25519 } from '../src/jwt/index.js';

export const ISSUER = 'https://id.labflow.example';
export const AUDIENCE = 'labflow-api';
export const KID = 'ed-2026-11';

/** A fresh issuer with one Ed25519 key, ready to issue() and verify(). */
export function makeIssuer(kid = KID) {
  const kp = newEd25519();
  const keyring = { [kid]: eddsa(kp) };
  const tokens = accessTokens({ keyring, activeKid: kid, issuer: ISSUER, audience: AUDIENCE });
  return { tokens, keyring, kp, kid };
}

/** Pretty one-line JSON. */
export const j = (o) => JSON.stringify(o);
/** Cut a long base64url string so a demo never prints a full forgeable token. */
export const cut = (s, n = 16) => (s.length > n ? s.slice(0, n) + '…' : s);
