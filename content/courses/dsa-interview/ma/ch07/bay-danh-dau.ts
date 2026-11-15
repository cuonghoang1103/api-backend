// @java: BayDanhDau.java
// BFS on an open N × N grid from (0,0). Same answer either way — but WHEN you mark "visited" decides how much work.
function bfs(N: number, markWhenEnqueued: boolean): { visited: number; enqueued: number; maxQueue: number } {
  const seen = new Uint8Array(N * N);
  const q: number[] = [0];
  if (markWhenEnqueued) seen[0] = 1;
  let head = 0, visited = 0, maxQueue = 1;
  while (head < q.length) {
    const cell = q[head++];
    // #region sai
    if (!markWhenEnqueued) {
      if (seen[cell]) continue;          // a duplicate copy: discovered earlier, dequeued again now
      seen[cell] = 1;                    // marked only when DEQUEUED
    }
    // #endregion
    visited++;
    const r = Math.floor(cell / N), c = cell % N;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
      const nb = nr * N + nc;
      if (seen[nb]) continue;
      if (markWhenEnqueued) seen[nb] = 1;
      q.push(nb);
    }
    maxQueue = Math.max(maxQueue, q.length - head);
  }
  return { visited, enqueued: q.length, maxQueue };
}
for (const N of [10, 100, 1000]) {
  const a = bfs(N, true), b = bfs(N, false);
  console.log(`N=${N}: mark on enqueue -> visited ${a.visited}, enqueued ${a.enqueued}, max queue ${a.maxQueue} | mark on dequeue -> visited ${b.visited}, enqueued ${b.enqueued}, max queue ${b.maxQueue}`);
}
