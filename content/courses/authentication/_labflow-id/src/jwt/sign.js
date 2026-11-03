// src/jwt/sign.js — lesson 4.1: build a JWS compact token by hand. header.payload.signature, each base64url.
import { b64urlJson } from './base64url.js';

/** key: a keyring entry (keyring.js); kid: its id, copied into the header so the verifier knows which key to use. */
export function sign(payload, { key, kid }) {
  const header = { alg: key.alg, typ: 'JWT', ...(kid ? { kid } : {}) };
  const signingInput = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  return `${signingInput}.${key.sign(signingInput)}`;
}
