// demo2/crack-table.mjs — lesson 2.1: how long to try EVERY password of a kind, for one salted account.
// CPU rates are measured here; GPU rates are hashcat 6.2.6 on one RTX 4090 (public benchmark, see the lesson's sources).
import { createHash } from 'node:crypto';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import { fmt as fmt1 } from '../demo1/fmt.mjs';
const YEAR = 365.25 * 24 * 3600;
const fmt = (s) => (s >= YEAR && s < 1000 * YEAR ? `${(s / YEAR).toFixed(0)} years` : fmt1(s));

const words = ['password', '123456', 'an-lab-2026', 'qwerty'].map((w) => '9f2c4e7a1b3d5f60' + w); // salt + guess
let n = 0; const end = performance.now() + 1000;
while (performance.now() < end) for (let i = 0; i < 1000; i++, n++) createHash('sha256').update(words[n & 3]).digest('hex');
const shaCpu = n;                                                  // per second, one core

const P = { type: argon2.argon2id, memoryCost: 65536, timeCost: 2, parallelism: 1 };
const h = await argon2.hash('x', P);
let t0 = performance.now();
await Promise.all(Array.from({ length: 40 }, (_, i) => argon2.verify(h, 'g' + i)));
const argonCpu = 40 / ((performance.now() - t0) / 1000);
const b = await bcrypt.hash('x', 12);
t0 = performance.now();
await Promise.all(Array.from({ length: 20 }, (_, i) => bcrypt.compare('g' + i, b)));
const bcryptCpu = 20 / ((performance.now() - t0) / 1000);

const RATES = [
  ['sha256 · 1 CPU core', shaCpu],
  ['sha256 · RTX 4090', 21975.5e6],
  ['bcrypt-12 · RTX 4090', 184.0e3 / 2 ** 7],                 // benchmark is cost 5 (32 rounds); cost 12 = 4,096 rounds
  ['bcrypt-12 · this Mac', bcryptCpu],
  ['argon2id · this Mac', argonCpu],                          // m=64 MiB, t=2, p=1 — LabFlow ID v0.2
];
const SPACES = [['top-10k', 10001], ['8 a-z', 26 ** 8], ['4 words', 7776 ** 4], ['12 a-zA-Z0-9', 62 ** 12]];
console.log('guesses/s'.padEnd(36) + SPACES.map(([k]) => k.padEnd(15)).join(''));
for (const [name, rate] of RATES) {
  console.log(`${name.padEnd(21)}${(rate >= 1e5 ? rate.toExponential(2) : rate.toFixed(rate < 100 ? 1 : 0)).padStart(13)}  ` + SPACES.map(([, g]) => fmt(g / rate).padEnd(15)).join(''));
}
console.log(`(${process.env.UV_THREADPOOL_SIZE ?? 4} threads; time to try the WHOLE space for ONE salted account)`);
