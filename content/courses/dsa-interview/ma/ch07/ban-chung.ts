// @java: BanChung.java
// "People you may know": BFS two levels out on the FOLLOW graph, ranked by how many of the people you follow
// already follow them (= number of length-2 paths). Same idea as getSuggestedUsers in follow.service.ts, plus ranking.
const follows = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 4], [3, 0], [4, 7]];

// #region giai
function suggest(n: number, edges: number[][], me: number): string[] {
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) out[a].push(b);              // directed: a follows b
  const level1 = new Set(out[me]);                          // BFS level 1 = people I follow
  const mutual = new Map<number, number[]>();
  for (const f of out[me]) {                                // BFS level 2, counting HOW we got there
    for (const x of out[f]) {
      if (x === me || level1.has(x)) continue;              // visited: myself and level 1
      if (!mutual.has(x)) mutual.set(x, []);
      mutual.get(x)!.push(f);
    }
  }
  return [...mutual.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0] - b[0])   // most mutual first, then by id
    .map(([x, via]) => `${x} (via ${via.join(', ')})`);
}
// #endregion

console.log('suggestions for 0:', JSON.stringify(suggest(8, follows, 0)));
console.log('suggestions for 1:', JSON.stringify(suggest(8, follows, 1)));
