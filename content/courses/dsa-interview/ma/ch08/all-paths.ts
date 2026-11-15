// @java: AllPaths.java
// LC 797 · All Paths From Source to Target — every route through a menu, from "Home" to one page.

// #region all-paths
function allPathsSourceTarget(graph: number[][]): number[][] {
  const target = graph.length - 1;
  const res: number[][] = [];
  const path: number[] = [0];                     // we always start at node 0
  function dfs(u: number): void {
    if (u === target) { res.push([...path]); return; }
    for (const v of graph[u]) {
      path.push(v);                               // choose the edge u -> v
      dfs(v);
      path.pop();                                 // come back to u, try the next edge
    }
  }
  dfs(0);
  return res;
}
// #endregion

console.log(JSON.stringify(allPathsSourceTarget([[1, 2], [3], [3], []])));
console.log(JSON.stringify(allPathsSourceTarget([[4, 3, 1], [3, 2, 4], [3], [4], []])));

// A site menu (a DAG: one page can be reached from several menus). Which ways lead to the Node.js course?
const names = ['Home', 'Courses', 'Academy', 'Programming', 'Back-end', 'SDN302', 'Node.js'];
const menu = [[1, 2], [3, 4], [5], [6], [6], [6], []];
const routes = allPathsSourceTarget(menu);
console.log(routes.length + ' routes to "' + names[6] + '":');
for (const r of routes) console.log('  ' + r.map((i) => names[i]).join(' > '));
