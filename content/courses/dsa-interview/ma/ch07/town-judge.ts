// @java: TownJudge.java
// LC 997 · Find the Town Judge — a graph problem that needs NO adjacency list: only in-degree and out-degree.

// #region giai
function findJudge(n: number, trust: number[][]): number {
  const score = new Array<number>(n + 1).fill(0);   // people are 1..n
  for (const [a, b] of trust) {
    score[a]--;                                     // a trusts someone: out-degree +1
    score[b]++;                                     // b is trusted: in-degree +1
  }
  for (let p = 1; p <= n; p++) if (score[p] === n - 1) return p;   // in = n − 1 AND out = 0
  return -1;
}
// #endregion

console.log(findJudge(2, [[1, 2]]));
console.log(findJudge(3, [[1, 3], [2, 3]]));
console.log(findJudge(3, [[1, 3], [2, 3], [3, 1]]));
console.log(findJudge(1, []));
