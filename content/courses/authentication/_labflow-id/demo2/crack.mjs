// demo2/crack.mjs — lesson 2.1: the attacker already HAS the users table. Four ways it could have been stored,
// one attacker with the 10,001 most common passwords. Same people, same list — only the storage changes.
import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { population, WORDS } from './population.mjs';

const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const people = population();
const ms = (t0) => (performance.now() - t0).toFixed(0).padStart(6) + ' ms';
console.log(`${people.length} accounts · attacker list: ${WORDS.length} passwords`);

// 1. plain text: nothing to crack
console.log(`plain        read all ${people.length} passwords: no work at all`);

// 2. SHA-256, no salt: hash the list ONCE, then every account is a lookup
let t0 = performance.now();
const table = new Map(WORDS.map((w) => [sha256(w), w]));
const unsalted = people.map((p) => sha256(p.password));
const hit2 = unsalted.filter((h) => table.has(h)).length;
const same = unsalted.filter((h, i) => unsalted.indexOf(h) !== i).length;
console.log(`sha256       ${WORDS.length} hashes${ms(t0)} → cracked ${hit2}/${people.length} (and ${same} rows repeat another row's hash)`);

// 3. SHA-256 with a 16-byte salt per account: the list must be hashed again for EVERY account
t0 = performance.now();
let hit3 = 0, n3 = 0;
for (const p of people) {
  const salt = randomBytes(16).toString('hex');
  const stored = sha256(salt + p.password);
  for (const w of WORDS) { n3++; if (sha256(salt + w) === stored) { hit3++; break; } }
}
console.log(`sha256+salt  ${n3} hashes${ms(t0)} → cracked ${hit3}/${people.length}`);

// 4. argon2id (LabFlow ID v0.2 parameters): measure the rate on 40 guesses, then try the list on Binh only
const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };
const binh = await argon2.hash('123456', P);
t0 = performance.now();
let guesses = 0, found = null;
for (const w of WORDS) { guesses++; if (await argon2.verify(binh, w)) { found = w; break; } }
console.log(`argon2id     Binh: "${found}" after ${guesses} guesses${ms(t0)}`);
t0 = performance.now();
await Promise.all(WORDS.slice(0, 40).map((w) => argon2.verify(binh, w + '!')));
const perSec = 40 / ((performance.now() - t0) / 1000);
const hours = (WORDS.length * people.length) / perSec / 3600;
console.log(`argon2id     ${perSec.toFixed(1)} guesses/s with ${process.env.UV_THREADPOOL_SIZE ?? 4} threads → whole list × ${people.length} accounts ≈ ${hours.toFixed(0)} h`);
