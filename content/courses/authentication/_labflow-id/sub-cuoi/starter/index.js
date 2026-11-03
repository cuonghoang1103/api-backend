// sub-cuoi/starter/index.js — Lab 12 starter. Build LabFlow ID v1.0 by wiring each decision to the module you built
// across the course (or re-implement it). The grader runs ~12 attack scenarios; aim for ≥ 70/100, target 100.
// Fill each export with the hardened choice. The empty starter below scores near zero on purpose.
export function needsRehash() { return false; }
export function normalizeEmail(raw) { return String(raw); }
export function verifyIdToken() { return { ok: true }; }
export function can() { return true; }
export function decide() { return 'allow'; }
export function safeAudit(e) { return e; }
export const passwordScheme = '';
export const sessionIdEntropyBits = 0;
export function signupMessage() { return ''; }
export function acceptAlg() { return true; }
export function refreshReuseAction() { return ''; }
export function cookieAttrs() { return {}; }
export function phishingResistant() { return false; }
export const secretsFromEnv = false;
