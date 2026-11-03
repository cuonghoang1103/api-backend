// lab8/starter/index.js — Lab 8 starter. Write the client's ID-token check: the SEVEN checks (lesson 8.4).
// verifyIdToken(payload, { signatureValid, expectedIssuer, expectedAudience, nonce, now }) ⇒ { ok, sub } or { error }.
// Order: malformed → bad_signature → bad_iss → bad_aud → expired → bad_iat → bad_nonce. aud may be a string OR an array.
// The signature is checked elsewhere and its result is passed in as `signatureValid` — do not skip it.
export function verifyIdToken(payload, ctx) {
  // Write your solution here
  return { ok: true };
}
