// @java: TlGas.java
// LC 134 Gas Station: one pass, reset the start whenever the tank goes negative.

// #region lc134
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const gain = gas[i] - cost[i];
    total += gain;                    // the whole loop: is there enough fuel at all?
    tank += gain;                     // fuel left since `start`
    if (tank < 0) {                   // cannot reach i + 1 from `start` (nor from anything in between)
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}
// #endregion

// #region sai
function forgetTotal(gas: number[], cost: number[]): number {
  let tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return start < gas.length ? start : -1;   // bug: never checks that the whole loop has enough fuel
}
// #endregion

// #region brute
// O(n^2) brute force: try every start and drive the full loop.
function brute(gas: number[], cost: number[]): number {
  const n = gas.length;
  for (let s = 0; s < n; s++) {
    let tank = 0, ok = true;
    for (let k = 0; k < n && ok; k++) { const i = (s + k) % n; tank += gas[i] - cost[i]; if (tank < 0) ok = false; }
    if (ok) return s;
  }
  return -1;
}
// #endregion

const cases: [number[], number[]][] = [
  [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]],
  [[2, 3, 4], [3, 4, 3]],
  [[5, 1, 2, 3, 4], [4, 4, 1, 5, 1]],
  [[3, 1, 1], [1, 2, 2]],
];
for (const [g, c] of cases)
  console.log(`gas=${JSON.stringify(g)} cost=${JSON.stringify(c)} -> greedy ${canCompleteCircuit(g, c)}, brute ${brute(g, c)}, forgot-total ${forgetTotal(g, c)}`);

let seed = 11;
const rnd = (m: number) => { seed = (seed * 48271) % 2147483647; return seed % m; };
let bad = 0, badWrong = 0;
for (let t = 0; t < 3000; t++) {
  const n = 1 + rnd(7);
  const g = Array.from({ length: n }, () => rnd(6)), c = Array.from({ length: n }, () => rnd(6));
  const b = brute(g, c);
  if (canCompleteCircuit(g, c) !== b) bad++;
  if (forgetTotal(g, c) !== b) badWrong++;
}
console.log(`random check vs brute force: 3000 cases, greedy ${bad} mismatches, forgot-total ${badWrong} mismatches`);
