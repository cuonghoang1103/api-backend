// @java: CourseSchedule.java
// LC 207 / 210 · Course Schedule I & II — Kahn's algorithm: repeatedly take a course with no unmet prerequisite.
// prerequisites[i] = [a, b] means "take b BEFORE a" ⇒ the arrow is b → a.

// #region kahn
function findOrder(n: number, prerequisites: number[][]): number[] {
  const out: number[][] = Array.from({ length: n }, () => []);
  const indeg = new Array<number>(n).fill(0);
  for (const [a, b] of prerequisites) { out[b].push(a); indeg[a]++; }   // b → a
  const q: number[] = [];
  for (let v = 0; v < n; v++) if (indeg[v] === 0) q.push(v);          // nothing required: can start now
  const order: number[] = [];
  for (let head = 0; head < q.length; head++) {
    const u = q[head];
    order.push(u);
    for (const v of out[u]) {
      indeg[v]--;                                                      // one prerequisite of v is done
      if (indeg[v] === 0) q.push(v);                                   // all of them done: v is unlocked
    }
  }
  return order.length === n ? order : [];                              // leftovers sit on a cycle
}
const canFinish = (n: number, pre: number[][]): boolean => findOrder(n, pre).length === n;
// #endregion

console.log(JSON.stringify(findOrder(2, [[1, 0]])), canFinish(2, [[1, 0]]));
console.log(JSON.stringify(findOrder(2, [[1, 0], [0, 1]])), canFinish(2, [[1, 0], [0, 1]]));
console.log(JSON.stringify(findOrder(4, [[1, 0], [2, 0], [3, 1], [3, 2]])), canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]));
console.log(JSON.stringify(findOrder(6, [[1, 0], [2, 0], [3, 1], [3, 2], [5, 4]])), canFinish(6, [[1, 0], [2, 0], [3, 1], [3, 2], [5, 4]]));
console.log(JSON.stringify(findOrder(3, [[1, 0], [2, 1], [0, 2]])), canFinish(3, [[1, 0], [2, 1], [0, 2]]));
