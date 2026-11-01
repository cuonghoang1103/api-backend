// demo2/long-password.mjs — lesson 2.3: how much does a LONG password cost the server? (argon2 pre-hashes its input)
import argon2 from 'argon2';
import { PARAMS } from '../src/passwords/index.js';
for (const n of [16, 128, 1e5, 1e6, 1e7]) {
  const pw = 'a'.repeat(n);
  const t0 = performance.now();
  await argon2.hash(pw, PARAMS);
  console.log(`${String(n).padStart(9)} chars → ${(performance.now() - t0).toFixed(0).padStart(4)} ms`);
}
