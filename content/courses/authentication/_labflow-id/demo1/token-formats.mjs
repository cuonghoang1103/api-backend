// demo1/token-formats.mjs — lesson 1.2: the same random bytes, written three ways. Length is NOT the number of bits.
import { randomBytes, randomUUID } from 'node:crypto';
import { newToken } from '../src/crypto/index.js';

const b16 = randomBytes(16);
const rows = [
  ['randomBytes(16) hex', b16.toString('hex'), 128],
  ['randomBytes(16) base64url', b16.toString('base64url'), 128],
  ['randomBytes(32) base64url', randomBytes(32).toString('base64url'), 256],
  ['randomUUID() (v4)', randomUUID(), 122],
  ["newToken('lfid_ses')", newToken('lfid_ses'), 256],
  ['Math.random().toString(36).slice(2)', Math.random().toString(36).slice(2), 0],
];
for (const [how, value, bits] of rows) {
  console.log(`${how.padEnd(36)} ${String(value.length).padStart(2)} chars · ${String(bits).padStart(3)} random bits · ${value.slice(0, 12)}…`);
}
