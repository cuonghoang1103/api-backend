// demo1/timing-naive.mjs — lesson 1.3: the SAME benchmark with one guess object per position. Looks fine. Lies.
// In-process, no network. Every round times every position (in a shuffled order, so JIT warm-up and
// CPU drift hit all positions alike); we print the median of 21 rounds × 1,000,000 comparisons.
import { randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

const LEN = Number(process.env.LEN ?? 64);
const secret = Buffer.from(randomBytes(LEN).toString('base64url').slice(0, LEN)).toString();
const positions = (process.env.POS ?? '0,1,8,16,32,48,63,64').split(',').map(Number).filter((p) => p <= LEN);
const ROUNDS = 21;
const N = 1_000_000;

// A guess with exactly m leading characters right (m = LEN: the whole token, as a separate string).
const flat = (s) => Buffer.from(s).toString(); // a fresh, flat copy — like a header value from a request
const guess = (m) => flat(m === LEN ? secret : secret.slice(0, m) + (secret[m] === 'A' ? 'B' : 'A') + secret.slice(m + 1));

const mode = process.argv[2] ?? 'strict';
const sb = Buffer.from(secret);
const compare = mode === 'strict'
  ? (g) => g === secret
  : (g) => g.length === sb.length && timingSafeEqual(g, sb);
const inputs = positions.map((m) => (mode === 'strict' ? guess(m) : Buffer.from(guess(m))));

const samples = positions.map(() => []);
let hits = 0;
for (let r = 0; r < ROUNDS; r++) {
  const order = positions.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = randomInt(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  for (const k of order) {
    const g = inputs[k];
    const t = process.hrtime.bigint();
    for (let i = 0; i < N; i++) if (compare(g)) hits++; // same g every time: the JIT may compute it ONCE
    samples[k].push(Number(process.hrtime.bigint() - t) / N);
  }
}
const median = (a) => a.sort((x, y) => x - y)[a.length >> 1];
console.log(`Node ${process.version} · ${mode === 'strict' ? '===' : 'timingSafeEqual'} · ${LEN}-char token · median of ${ROUNDS} rounds × ${N.toLocaleString('en-US')}`);
positions.forEach((m, k) => console.log(`${String(m).padStart(2)} leading chars right → ${median(samples[k]).toFixed(2)} ns`));
console.log(`(${hits.toLocaleString('en-US')} comparisons returned true — only the 'all right' row)`);
