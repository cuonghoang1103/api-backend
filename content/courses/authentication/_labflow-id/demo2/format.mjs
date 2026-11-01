// demo2/format.mjs — lesson 2.2: a password hash is a self-describing string. Read it by name, not by position.
import argon2 from 'argon2';
import { hashPassword, describe, needsRehash } from '../src/passwords/index.js';

const stored = await hashPassword('an-lab-2026');
console.log(stored);
const [, id, v, params, salt, hash] = stored.split('$');
console.log(JSON.stringify({ id, v, params, saltBytes: Buffer.from(salt, 'base64').length, hashBytes: Buffer.from(hash, 'base64').length }));

// The bug: a regex that assumes the order m, t, p (the order most blog posts print).
const naive = /m=(\d+),t=(\d+),p=(\d+)/.exec(stored);
console.log('naive parse:', naive, '⇒ needsRehash would be true on EVERY login');
console.log('by name    :', describe(stored), '⇒ needsRehash', needsRehash(stored));
console.log('argon2.needsRehash(stored, {memoryCost: 65536, timeCost: 3}) =', argon2.needsRehash(stored, { memoryCost: 65536, timeCost: 3 }));
