// src/passwords/hash.js — lessons 2.2, 2.3, 2.5 and Lab 2: store a password as a slow, salted, self-describing hash.
import { createHash } from 'node:crypto';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

// Chosen by `node demo2/tune.mjs 100 256` on the machine that runs LabFlow ID (lesson 2.2): ≤ 100 ms, ≤ 64 MiB per thread.
export const PARAMS = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };

/** NIST SP 800-63B-4: normalise Unicode to NFC before hashing, so "ì" typed on any keyboard is the same bytes. */
export const normalize = (password) => password.normalize('NFC');

export const hashPassword = (password) => argon2.hash(normalize(password), PARAMS);

/** What a stored string says about itself: scheme + parameters (lesson 2.2). The argon2 package writes "m=…,p=…,t=…" —
 *  read the parameters by NAME, never by position. */
export function describe(stored) {
  let m;
  if ((m = /^\$(argon2id|md5-argon2id)\$v=19\$([^$]+)\$/.exec(stored ?? ''))) {
    const p = Object.fromEntries(m[2].split(',').map((kv) => kv.split('=')).map(([k, v]) => [k, Number(v)]));
    return { scheme: m[1], m: p.m, t: p.t, p: p.p };
  }
  if ((m = /^\$2[aby]\$(\d\d)\$/.exec(stored ?? ''))) return { scheme: 'bcrypt', cost: Number(m[1]) };
  return { scheme: 'unknown' };
}

/** True when the stored hash is not today's scheme with today's parameters (lesson 2.5). */
export function needsRehash(stored) {
  const d = describe(stored);
  return !(d.scheme === 'argon2id' && d.m >= PARAMS.memoryCost && d.t >= PARAMS.timeCost && d.p >= PARAMS.parallelism);
}

const md5 = (s) => createHash('md5').update(s).digest('hex');

/** ⇒ { ok, rehash }. Understands today's argon2id, older argon2id parameters, bcrypt, and wrapped legacy MD5. */
export async function verifyPassword(stored, password) {
  if (typeof stored !== 'string' || typeof password !== 'string') return { ok: false, rehash: false };
  const d = describe(stored);
  let ok = false;
  if (d.scheme === 'argon2id') ok = await argon2.verify(stored, normalize(password));
  else if (d.scheme === 'bcrypt') ok = await bcrypt.compare(normalize(password), stored);
  else if (d.scheme === 'md5-argon2id') {
    // lesson 2.5: md5(password) from the old system, wrapped in argon2id the day we migrated. The old system hashed raw input.
    ok = await argon2.verify(stored.replace('$md5-argon2id$', '$argon2id$'), md5(password));
  }
  return { ok, rehash: ok && needsRehash(stored) };
}

/** lesson 2.5: wrap an unsalted legacy MD5 hex digest without knowing the password. */
export async function wrapLegacyMd5(md5hex) {
  return (await argon2.hash(md5hex, PARAMS)).replace('$argon2id$', '$md5-argon2id$');
}
