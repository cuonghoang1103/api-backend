// sub-cuoi/tham-khao/index.js — the reference LabFlow ID v1.0 posture: every decision wired to the hardened module the
// course built. cham-cuoi-khoa.mjs runs ~12 real attack scenarios against this; the reference scores 100/100.
export { needsRehash } from '../../src/passwords/index.js';     // Chapter 2 — flag an old/weak stored hash
export { normalizeEmail } from '../../src/email/normalize.js';  // Chapter 6 — fold confusables so two "same" emails collide
export { verifyIdToken } from '../../src/oidc/verify.js';       // Chapter 8 — the seven ID-token checks
export { can } from '../../src/authz/policy.js';                // Chapter 9 — tenant-first authorization gate
export { decide } from '../../src/defense/stuffing.js';         // Chapter 10 — credential-stuffing defence
export { safeAudit } from '../../src/ops/audit.js';             // Chapter 11 — audit entry that leaks nothing

// Posture declarations — the production choices the course argued for.
export const passwordScheme = 'argon2id';                       // Chapter 2
export const sessionIdEntropyBits = 256;                        // Chapter 1/3 — CSPRNG, unguessable
export function signupMessage() {                               // Chapter 6 — enumeration-safe: SAME message either way
  return 'If that email is not already registered, we have sent a verification link.';
}
export function acceptAlg(alg, expected) {                       // Chapter 4 — reject alg:none and algorithm confusion
  if (alg === 'none') return false;
  return alg === expected;
}
export function refreshReuseAction() { return 'revoke_family'; } // Chapter 5 — a replayed refresh revokes the whole family
export function cookieAttrs() {                                  // Chapter 3 — the one safe place for a session
  return { httpOnly: true, secure: true, sameSite: 'Lax', hostPrefix: true };
}
export function phishingResistant(factor) { return factor === 'passkey'; }  // Chapter 7/10 — only origin-bound survives a relay
export const secretsFromEnv = true;                             // Chapter 11 — secrets from the environment, never the repo
