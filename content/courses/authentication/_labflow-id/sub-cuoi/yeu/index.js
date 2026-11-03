// sub-cuoi/yeu/index.js — a WEAK LabFlow ID: it gets the "basics" right (modern hashing, cookie flags, refresh reuse)
// but misses the hardening the course spent its later chapters on. It runs and passes a happy-path demo, yet fails
// most of the 12 attack scenarios. Expected grade: measurably low — well under the 70 pass line.
export { needsRehash } from '../../src/passwords/index.js';     // ✓ Ch2 — got hashing right
export const passwordScheme = 'argon2id';                       // ✓ Ch2
export function cookieAttrs() { return { httpOnly: true, secure: true, sameSite: 'Lax', hostPrefix: true }; } // ✓ Ch3
export function refreshReuseAction() { return 'revoke_family'; } // ✓ Ch5

export function normalizeEmail(raw) { return String(raw).toLowerCase(); }  // ❌ lowercase only — homographs slip through (Ch6)
export function verifyIdToken(payload) { return { ok: true, sub: payload && payload.sub }; }  // ❌ trusts any token, no signature check (Ch8)
export function can() { return true; }                          // ❌ allows everything — no tenant, no role (Ch9)
export function decide() { return 'allow'; }                    // ❌ never challenges or blocks a spray (Ch10)
export function safeAudit(event) { return { ...event }; }       // ❌ logs the whole event, secrets and all (Ch11)
export const sessionIdEntropyBits = 32;                         // ❌ guessable session id (Ch1/3)
export function signupMessage(exists) { return exists ? 'Email already registered' : 'Verification sent'; } // ❌ enumeration (Ch6)
export function acceptAlg() { return true; }                    // ❌ accepts alg:none (Ch4)
export function phishingResistant(factor) { return factor === 'totp' || factor === 'passkey'; }  // ❌ thinks TOTP resists phishing (Ch7/10)
export const secretsFromEnv = false;                            // (posture, not scored directly)
