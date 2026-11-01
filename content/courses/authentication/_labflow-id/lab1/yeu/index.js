// lab1/yeu/index.js — a FIRST ATTEMPT that "works": every happy-path call returns the right thing.
// Lesson Lab 1 runs the grader on it to show what the happy path does not prove.
import { createHash, createHmac } from 'node:crypto';

export function newToken(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function tokenDigest(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function safeEqual(a, b) {
  return a === b;
}

export function signValue(value, { keys, ttlSec, now = Date.now() }) {
  const key = Object.values(keys)[0];
  const exp = Math.floor(now / 1000) + ttlSec;
  const sig = createHmac('sha256', key).update(value + '.' + exp).digest('base64url');
  return `${Buffer.from(value).toString('base64url')}.${exp}.${sig}`;
}

export function verifyValue(signed, { keys, now = Date.now() }) {
  const [v, exp, sig] = signed.split('.');
  if (Math.floor(now / 1000) > Number(exp)) return null;
  const value = Buffer.from(v, 'base64url').toString();
  const key = Object.values(keys)[0];
  const good = createHmac('sha256', key).update(value + '.' + exp).digest('base64url');
  return sig === good ? value : null;
}

export function redact(value) {
  const copy = JSON.parse(JSON.stringify(value));
  if (copy.body?.password) copy.body.password = '[redacted]';
  if (copy.headers?.authorization) copy.headers.authorization = '[redacted]';
  return copy;
}
