// demo1/bits.mjs — lesson 1.2: how long to guess ONE token of b random bits, at a rate far beyond any real attacker.
import { fmt } from './fmt.mjs';
const RATE = 1e12; // guesses per second (an absurdly generous attacker)
for (const b of [20, 32, 40, 64, 80, 122, 128, 256]) {
  const half = 2 ** (b - 1) / RATE; // on average you find it after trying half of the space
  console.log(`${String(b).padStart(3)} bits · ${(2 ** b).toExponential(2).padStart(9)} values · average ${fmt(half)}`);
}
console.log('(age of the universe ≈ 1.4e10 years)');
