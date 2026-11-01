// demo1/predict-math-random.mjs — lesson 1.2: Math.random() is a formula, not a coin. From SEEN outputs we compute the next ones.
// V8 (Node 22) uses xorshift128+ state, refills a cache of 64 numbers at a time and hands them out LAST-FIRST;
// each number is the top 52 bits of the 64-bit word "state0". Every step is XOR and shifts — linear over bits —
// so each output gives 52 linear equations about the 128 unknown state bits. Solve them, then run the generator.
import { execFileSync } from 'node:child_process';

// The "victim": a separate Node process that prints 8 Math.random() values (think: 8 tokens issued in a row).
const SEEN = Number(process.argv[2] ?? 3);
const PRED = 5;
const victim = execFileSync(process.execPath, ['-e', `for (let i = 0; i < ${SEEN + PRED}; i++) console.log(Math.random())`], { encoding: 'utf8' })
  .trim().split('\n').map(Number);
const seen = victim.slice(0, SEEN); // what the attacker observed
const hidden = victim.slice(SEEN); // what it will try to predict

// ── symbolic state: each bit is a set of unknowns (a BigInt bitmask over 128 variables) ──
const M64 = (1n << 64n) - 1n;
const word = (base) => Array.from({ length: 64 }, (_, i) => 1n << BigInt(base + i)); // bit i ← variable base+i
const shl = (w, n) => w.map((_, i) => (i >= n ? w[i - n] : 0n));
const shr = (w, n) => w.map((_, i) => (i + n < 64 ? w[i + n] : 0n));
const xor = (a, b) => a.map((x, i) => x ^ b[i]);
function step([s0, s1]) { // exactly V8's XorShift128
  let x = s0; const y = s1;
  x = xor(x, shl(x, 23)); x = xor(x, shr(x, 17)); x = xor(x, y); x = xor(x, shr(y, 26));
  return [y, x];
}
// Unknown base state B = the state behind the LAST number we want to predict. Outputs go backwards in generator
// time, so the newest-seen number is T^(SEEN+PRED-1)(B) and the last prediction is B itself.
const TOP = SEEN + PRED - 1;
let st = [word(0), word(64)];
const states = [st];
for (let t = 1; t <= TOP; t++) states.push(st = step(st)); // states[t] = T^t(B)
const mantissa = (x) => BigInt(x * 2 ** 52); // exact: x = mantissa / 2^52
const rows = [];
seen.forEach((x, i) => {
  const s0 = states[TOP - i][0];
  const m = mantissa(x);
  for (let j = 0; j < 52; j++) rows.push(s0[j + 12] | (((m >> BigInt(j)) & 1n) << 128n));
});
// ── Gaussian elimination over GF(2) ──
const solved = new Array(128).fill(null);
let r = 0;
for (let v = 0; v < 128; v++) {
  const bit = 1n << BigInt(v);
  const p = rows.findIndex((row, k) => k >= r && (row & bit));
  if (p < 0) continue;
  [rows[r], rows[p]] = [rows[p], rows[r]];
  for (let k = 0; k < rows.length; k++) if (k !== r && (rows[k] & bit)) rows[k] ^= rows[r];
  solved[v] = r++;
}
let B = 0n;
for (let v = 0; v < 128; v++) if (solved[v] !== null && (rows[solved[v]] >> 128n) & 1n) B |= 1n << BigInt(v);
// ── run the real generator forward from B and read the numbers it will hand out next ──
let s0 = B & M64, s1 = (B >> 64n) & M64;
const real = [s0];
for (let t = 1; t < PRED; t++) {
  let x = s0; const y = s1;
  x ^= (x << 23n) & M64; x ^= x >> 17n; x ^= y; x ^= y >> 26n;
  s0 = y; s1 = x; real.push(s0);
}
const toDouble = (w) => Number(w >> 12n) / 2 ** 52;
const predicted = real.map(toDouble).reverse(); // B was the furthest one
console.log(`solved ${r} of 128 state bits from ${rows.length} equations`);
seen.forEach((x, i) => console.log(`seen      #${i + 1}  ${x}`));
predicted.forEach((x, i) => console.log(`predicted #${i + SEEN + 1}  ${x}  ${x === hidden[i] ? '✓ matches' : '✗ actual ' + hidden[i]}`));
