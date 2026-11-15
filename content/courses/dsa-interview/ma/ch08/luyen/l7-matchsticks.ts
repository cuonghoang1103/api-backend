// @java: L7Matchsticks.java
// LC 473 · Matchsticks to Square — put each stick on one of 4 sides; three prunings make it fast.

// #region giai
function makesquare(sticks: number[]): boolean {
  const total = sticks.reduce((a, b) => a + b, 0);
  if (sticks.length < 4 || total % 4 !== 0) return false;
  const side = total / 4;
  const a = [...sticks].sort((x, y) => y - x);        // 1. longest first: big sticks fail early
  if (a[0] > side) return false;
  const sides = [0, 0, 0, 0];
  function bt(i: number): boolean {
    if (i === a.length) return true;                    // all sticks placed, sums were never exceeded
    for (let k = 0; k < 4; k++) {
      if (sides[k] + a[i] > side) continue;
      if (k > 0 && sides[k] === sides[k - 1]) continue; // 2. two sides with equal length: trying both is the same
      sides[k] += a[i];
      if (bt(i + 1)) return true;
      sides[k] -= a[i];
      if (sides[k] === 0) break;                        // 3. an empty side failed ⇒ every other empty side fails too
    }
    return false;
  }
  return bt(0);
}
// #endregion

for (const s of [[1, 1, 2, 2, 2], [3, 3, 3, 3, 4], [5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 102]]) {
  console.log(JSON.stringify(s) + ' -> ' + makesquare(s));
}
