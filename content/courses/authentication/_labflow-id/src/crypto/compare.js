// src/crypto/compare.js — lesson 1.3: compare two secrets without leaking where they differ.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const KEY = randomBytes(32); // per process, never stored: an attacker cannot predict either MAC

/** true if a and b are the same string. Any length, never throws, time does not depend on the content. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ma = createHmac('sha256', KEY).update(a).digest(); // always 32 bytes …
  const mb = createHmac('sha256', KEY).update(b).digest(); // … so timingSafeEqual never sees two lengths
  return timingSafeEqual(ma, mb);
}
