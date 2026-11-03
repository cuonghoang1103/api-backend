// src/jwt/base64url.js — lesson 4.1: a JWT is three base64url strings. Nothing here is encryption.
// base64url is plain base64 with +/ replaced by -_ and the = padding dropped (RFC 7515 §2, RFC 4648 §5).

/** Encode a Buffer or a string as base64url (no padding). */
export function b64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8');
  return buf.toString('base64url'); // Node knows base64url since v14 — identical to the hand-rolled replace
}

/** Encode a JS value as the base64url of its JSON — used for the header and the payload. */
export const b64urlJson = (obj) => b64url(JSON.stringify(obj));

/** Decode a base64url string back to a Buffer. Anyone can do this; it proves nothing. */
export const unb64url = (s) => Buffer.from(String(s), 'base64url');

/** Split "header.payload.signature" and decode the two JSON parts WITHOUT checking the signature.
 *  This is exactly what an attacker — or your browser's devtools — can read. Never trust it. */
export function decodeJwt(token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) throw new TypeError('a JWS compact token has three dot-separated parts');
  const [h, p, s] = parts;
  return {
    header: JSON.parse(unb64url(h).toString('utf8')),
    payload: JSON.parse(unb64url(p).toString('utf8')),
    signingInput: `${h}.${p}`, // the bytes the signature actually covers
    signature: s,              // still base64url; meaningless until verified
  };
}
