// src/crypto/signed.js — lessons 1.4 and Lab 1: a value the client may hold but cannot change.
// Format: <value as base64url>.<expiry, unix seconds>.<key id>.<HMAC-SHA256 of the first three parts, base64url>
import { createHmac } from 'node:crypto';
import { safeEqual } from './compare.js';

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
const mac = (key, data) => createHmac('sha256', key).update(data).digest('base64url');

/** keys: { kid: secret, … }; kid: the key to sign with; ttlSec: lifetime; now: ms (inject it in tests). */
export function signValue(value, { keys, kid, ttlSec, now = Date.now() }) {
  if (typeof value !== 'string') throw new TypeError('value must be a string');
  if (!keys?.[kid]) throw new Error(`unknown key id: ${kid}`);
  if (!Number.isInteger(ttlSec) || ttlSec <= 0) throw new RangeError('ttlSec must be a positive integer');
  const body = `${b64(value)}.${Math.floor(now / 1000) + ttlSec}.${kid}`;
  return `${body}.${mac(keys[kid], body)}`;
}

/** The value, or null if the string was changed, expired, signed with an unknown key, or is not ours at all. */
export function verifyValue(signed, { keys, now = Date.now() }) {
  if (typeof signed !== 'string') return null;
  const parts = signed.split('.');
  if (parts.length !== 4) return null;
  const [v, exp, kid, sig] = parts;
  const key = Object.hasOwn(keys, kid) ? keys[kid] : undefined;
  if (!key || !/^\d+$/.test(exp)) return null;
  if (!safeEqual(sig, mac(key, `${v}.${exp}.${kid}`))) return null; // signature first …
  if (Math.floor(now / 1000) >= Number(exp)) return null; // … then expiry (the exp is now trusted)
  return Buffer.from(v, 'base64url').toString('utf8');
}
