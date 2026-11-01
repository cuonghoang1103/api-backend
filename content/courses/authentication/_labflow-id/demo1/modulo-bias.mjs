// demo1/modulo-bias.mjs — lesson 1.2: turning random BYTES into a digit 0–9 with % 10 is biased. randomInt() is not.
import { randomBytes, randomInt } from 'node:crypto';
const N = 1_000_000;
const count = (pick) => { const c = new Array(10).fill(0); for (let i = 0; i < N; i++) c[pick(i)]++; return c; };
const bytes = randomBytes(N);
const biased = count((i) => bytes[i] % 10); // 256 = 25 × 10 + 6, so digits 0–5 get one extra byte value each
const fair = count(() => randomInt(10));
console.log(`digit · byte % 10 · randomInt(10)   (${N.toLocaleString('en-US')} draws each)`);
for (let d = 0; d < 10; d++) console.log(`  ${d}   · ${String(biased[d]).padStart(9)} · ${String(fair[d]).padStart(9)}`);
console.log(`expected with % 10: digits 0–5 → 26/256 = ${(26 / 256 * 100).toFixed(2)}%, digits 6–9 → 25/256 = ${(25 / 256 * 100).toFixed(2)}%`);
