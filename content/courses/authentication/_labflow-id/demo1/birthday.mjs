// demo1/birthday.mjs — lesson 1.2: when do two random tokens collide? About after 2^(bits/2) tokens.
import { fmt } from './fmt.mjs';
for (const b of [32, 64, 122, 128]) {
  const n = 2 ** (b / 2) * Math.sqrt(2 * Math.log(2)); // tokens until P(any collision) = 50%
  console.log(`${String(b).padStart(3)} bits: 50% chance of a collision after ${n.toExponential(2)} tokens = ${fmt(n / 1000)} at 1,000 new tokens/s`);
}
