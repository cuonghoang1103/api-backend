// demo0/th09.mjs — practice (Start here 2/2): add a per-user salt. The shared table dies; guessing ONE user does not.
import fs from 'node:fs';
import { createHash, randomBytes } from 'node:crypto';
const sha1 = (s) => createHash('sha1').update(s).digest('hex');
const list = fs.readFileSync('wordlists/10k-most-common.txt', 'utf8').split('\n').filter(Boolean);
const table = new Map(list.map((p) => [sha1(p), p]));

const salt = randomBytes(16).toString('hex'); // stored next to the hash, different for every user
const binh = { salt, hash: sha1(salt + '123456') };
console.log('salted hash in the precomputed table?', table.has(binh.hash));
const t0 = performance.now();
const found = list.findIndex((p) => sha1(binh.salt + p) === binh.hash);
console.log(`guessing Binh alone with her salt: found ${JSON.stringify(list[found])} at guess ${found + 1} in ${(performance.now() - t0).toFixed(2)} ms`);
