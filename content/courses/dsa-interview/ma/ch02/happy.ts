// @java: Happy.java
// LC 202 · Happy Number — the numbers form an IMPLICIT linked list x -> next(x); Floyd finds the cycle without a Set.

// #region happy
function next(x: number): number {           // sum of the squares of the digits
  let s = 0;
  while (x > 0) { const d = x % 10; s += d * d; x = Math.floor(x / 10); }
  return s;
}
function isHappy(n: number): boolean {
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) {       // 1 -> 1 is a cycle too: reaching 1 means happy
    slow = next(slow);
    fast = next(next(fast));
  }
  return fast === 1;
}
// #endregion

function chain(n: number): number[] {         // only for printing: follow next() until a value repeats
  const seen: number[] = [];
  while (!seen.includes(n)) { seen.push(n); n = next(n); }
  seen.push(n);
  return seen;
}
for (const n of [19, 2, 7, 1, 1111111]) console.log(`isHappy(${n}) = ${isHappy(n)}   chain: ${chain(n).join(' -> ')}`);
