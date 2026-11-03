// src/ops/rotation.js — Chapter 11 (11.2): rotate a signing key without logging everyone out. The trick is an OVERLAP:
// for a window, BOTH the new key (kidNew, used to sign) and the old key (kidOld, verify-only) are LIVE, so tokens
// already minted under the old key keep verifying until they expire; only then is the old key retired. A keyring is a
// map kid → key; liveKids() says which may still VERIFY, activeKid says which SIGNS.
/** ⇒ true if a token with header.kid can still be verified in this ring state. */
export function canVerify(ring, kid) {
  return Boolean(ring && ring.live && ring.live.includes(kid));
}
/** The kid new tokens are signed with — always the newest live key. */
export function signingKid(ring) {
  return ring && ring.active;
}
/**
 * Advance the rotation by one step given the phase:
 *  'introduce' — add the new key as live but KEEP signing with the old (clients learn the new key via JWKS first);
 *  'activate'  — switch signing to the new key; the old key stays live for verify during the overlap;
 *  'retire'    — drop the old key; only the new key remains. Call this only after the old key's tokens have expired.
 */
export function rotate(ring, phase, newKid) {
  const live = ring.live.slice();
  if (phase === 'introduce') return { active: ring.active, live: live.includes(newKid) ? live : [...live, newKid] };
  if (phase === 'activate') return { active: newKid, live: live.includes(newKid) ? live : [...live, newKid] };
  if (phase === 'retire') return { active: ring.active, live: [ring.active] };
  return ring;
}
