// demo2/scrypt-maxmem.mjs — lesson 2.2: scrypt is built into node:crypto, but OWASP's parameters do not run by default.
import { scrypt, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);
const salt = randomBytes(16);
const N = 2 ** 17, r = 8, p = 1;                 // OWASP minimum: 128 × N × r bytes = 128 MiB
for (const opts of [{ N, r, p }, { N, r, p, maxmem: 129 * 2 ** 20 }]) {
  const t0 = performance.now();
  try {
    const key = await scryptAsync('an-lab-2026', salt, 32, opts);
    console.log(`maxmem ${opts.maxmem ?? 'default (32 MiB)'}: ok in ${(performance.now() - t0).toFixed(0)} ms, ${key.toString('base64').slice(0, 16)}…`);
  } catch (e) {
    console.log(`maxmem ${opts.maxmem ?? 'default (32 MiB)'}: ${e.code} — ${e.message}`);
  }
}
