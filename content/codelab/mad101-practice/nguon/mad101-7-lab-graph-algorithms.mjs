/** MAD101 · Lab ch.7 — Graph algorithms: components, Euler test, bipartite colouring, DFS, topological order, planarity facts. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);

function componentSizes(n, edges) {
  var parent = [], i;
  for (i = 0; i < n; i++) parent.push(i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  edges.forEach(function (e) { parent[find(e[0])] = find(e[1]); });
  var size = {};
  for (i = 0; i < n; i++) { var r = find(i); size[r] = (size[r] || 0) + 1; }
  return Object.keys(size).map(function (k) { return size[k]; }).sort(function (a, b) { return b - a; });
}
const L1 = jsDe({
  tieuDe: 'Graph lab 1 — Sizes of the connected components',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>A graph has vertices 0…n−1 and the undirected edges <code>[u, v]</code>. Write <code>componentSizes(n, edges)</code> returning the sizes of its connected components in <em>descending</em> order (an isolated vertex is a component of size 1). Use union–find or a search. For n = 0 return an empty array.</p>', '<p>Đồ thị có đỉnh 0…n−1 và các cạnh vô hướng <code>[u, v]</code>. Viết <code>componentSizes(n, edges)</code> trả kích thước các thành phần liên thông theo thứ tự <em>giảm dần</em> (đỉnh cô lập là thành phần cỡ 1). Dùng union–find hoặc tìm kiếm. Với n = 0 trả mảng rỗng.</p>'),
  yeuCau: [bi('Sort numerically, not as strings.', 'Sắp theo số, không sắp theo chuỗi.')],
  viDu: [{ input: 'componentSizes(6, [[0,1],[1,2],[3,4]])', output: JSON.stringify(componentSizes(6, [[0, 1], [1, 2], [3, 4]])), explanation: '{0,1,2}, {3,4}, {5}.|||{0,1,2}, {3,4}, {5}.' }],
  goiY: ['Union the endpoints of each edge, then count members per representative.', 'Path compression makes find nearly constant time.'],
  loiHayGap: ['Counting only components with at least one edge.', 'Sorting with the default comparator (10 sorts before 2).'],
  giaiThich: '<p>Connectedness is an equivalence relation; its classes are the components, and union–find maintains the classes under merging.</p>',
  khaiNiem: ['connected components', 'union–find'],
  fn: 'componentSizes',
  dau: 'function componentSizes(n, edges) {\n  return [];\n}\n',
  giaiMa: dat(componentSizes, 'componentSizes'),
  ref: componentSizes,
  cases: [{ args: [6, [[0, 1], [1, 2], [3, 4]]] }, { args: [0, []] }, { args: [4, []] }, { args: [12, [[0, 1], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 9], [9, 5]]], an: true }, { args: [3, [[0, 1], [1, 2], [2, 0]]], an: true }],
});

function hasEulerCircuit(n, edges) {
  var deg = [], i;
  for (i = 0; i < n; i++) deg.push(0);
  var parent = [];
  for (i = 0; i < n; i++) parent.push(i);
  function find(x) { while (parent[x] !== x) x = parent[x]; return x; }
  edges.forEach(function (e) { deg[e[0]]++; deg[e[1]]++; parent[find(e[0])] = find(e[1]); });
  var roots = {};
  for (i = 0; i < n; i++) { if (deg[i] % 2 !== 0) return false; if (deg[i] > 0) roots[find(i)] = true; }
  return Object.keys(roots).length <= 1;
}
const L2 = jsDe({
  tieuDe: 'Graph lab 2 — Does an Euler circuit exist?',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>hasEulerCircuit(n, edges)</code> returning <code>true</code> when the undirected multigraph on vertices 0…n−1 (parallel edges and loops allowed; a loop adds 2 to its vertex’s degree) has a closed walk using every edge exactly once. Rule: every vertex has even degree <em>and</em> all vertices with at least one edge lie in one connected component. A graph with no edges counts as having an (empty) Euler circuit.</p>', '<p>Viết <code>hasEulerCircuit(n, edges)</code> trả <code>true</code> khi đa đồ thị vô hướng trên các đỉnh 0…n−1 (cho phép cạnh song song và khuyên; khuyên cộng 2 vào bậc đỉnh) có đường đi đóng dùng mỗi cạnh đúng một lần. Quy tắc: mọi đỉnh bậc chẵn <em>và</em> mọi đỉnh có ít nhất một cạnh nằm trong một thành phần liên thông. Đồ thị không có cạnh được coi là có chu trình Euler (rỗng).</p>'),
  yeuCau: [bi('Isolated vertices do not matter.', 'Đỉnh cô lập không ảnh hưởng.')],
  viDu: [{ input: 'hasEulerCircuit(4, [[0,1],[1,2],[2,3],[3,0]])', output: 'true', explanation: 'A 4-cycle.|||Chu trình 4 đỉnh.' }, { input: 'hasEulerCircuit(6, [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]])', output: 'false', explanation: 'Even degrees but two components with edges.|||Bậc chẵn nhưng có hai thành phần có cạnh.' }],
  goiY: ['Count degrees (loops add 2), check parity, then check how many components contain an edge.', 'A loop [v, v] increases deg[v] by 2: in the code deg[e[0]]++ and deg[e[1]]++ does exactly that.'],
  loiHayGap: ['Ignoring connectivity (two disjoint cycles are not one circuit).', 'Requiring the isolated vertices to be in the same component.'],
  giaiThich: '<p>Euler’s theorem: a graph whose edges form one connected piece has an Euler circuit iff all degrees are even.</p>',
  khaiNiem: ['Euler circuit'],
  fn: 'hasEulerCircuit',
  dau: 'function hasEulerCircuit(n, edges) {\n  return false;\n}\n',
  giaiMa: dat(hasEulerCircuit, 'hasEulerCircuit'),
  ref: hasEulerCircuit,
  cases: [{ args: [4, [[0, 1], [1, 2], [2, 3], [3, 0]]] }, { args: [6, [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]]] }, { args: [3, [[0, 1], [1, 2]]] }, { args: [5, []], an: true }, { args: [5, [[0, 1], [0, 1], [2, 2]]], an: true }, { args: [4, [[0, 1], [1, 2], [2, 0], [0, 3], [3, 0]]], an: true }],
});

function isBipartite(n, edges) {
  var adj = [], color = [], i;
  for (i = 0; i < n; i++) { adj.push([]); color.push(-1); }
  edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
  for (var s = 0; s < n; s++) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    var queue = [s];
    while (queue.length) {
      var u = queue.shift();
      for (i = 0; i < adj[u].length; i++) {
        var v = adj[u][i];
        if (color[v] === -1) { color[v] = 1 - color[u]; queue.push(v); } else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}
const L3 = jsDe({
  tieuDe: 'Graph lab 3 — Two-colour a graph (bipartite test)',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Write <code>isBipartite(n, edges)</code> for an undirected graph on vertices 0…n−1 (several components, loops possible). Colour each component with a BFS: give a neighbour the opposite colour; if an edge joins two vertices of the same colour (a loop does!), the graph is not bipartite. Return a boolean.</p>', '<p>Viết <code>isBipartite(n, edges)</code> cho đồ thị vô hướng trên các đỉnh 0…n−1 (nhiều thành phần, có thể có khuyên). Tô màu mỗi thành phần bằng BFS: láng giềng nhận màu ngược lại; nếu có cạnh nối hai đỉnh cùng màu (khuyên cũng vậy!) thì đồ thị không hai phía. Trả boolean.</p>'),
  yeuCau: [bi('Start a fresh search from every uncoloured vertex.', 'Bắt đầu tìm kiếm mới từ mỗi đỉnh chưa tô màu.')],
  viDu: [{ input: 'isBipartite(4, [[0,1],[1,2],[2,3],[3,0]])', output: 'true', explanation: 'Even cycle.|||Chu trình chẵn.' }, { input: 'isBipartite(3, [[0,1],[1,2],[2,0]])', output: 'false', explanation: 'Odd cycle.|||Chu trình lẻ.' }],
  goiY: ['colour[v] = −1 means unvisited.', 'Remember that a self-loop makes u adjacent to itself, hence the same colour.'],
  loiHayGap: ['Starting the search only from vertex 0 (misses other components).', 'Not detecting conflicts on non-tree edges.'],
  giaiThich: '<p>A graph is bipartite iff it has no odd cycle; BFS colouring finds a conflict exactly when an odd cycle exists.</p>',
  khaiNiem: ['bipartite', 'graph colouring'],
  fn: 'isBipartite',
  dau: 'function isBipartite(n, edges) {\n  return false;\n}\n',
  giaiMa: dat(isBipartite, 'isBipartite'),
  ref: isBipartite,
  cases: [{ args: [4, [[0, 1], [1, 2], [2, 3], [3, 0]]] }, { args: [3, [[0, 1], [1, 2], [2, 0]]] }, { args: [0, []] }, { args: [5, [[0, 1], [2, 3], [3, 4], [4, 2]]], an: true }, { args: [6, [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]]], an: true }, { args: [2, [[1, 1]]], an: true }],
});

function dfsOrder(edges, start) {
  var adj = {};
  edges.forEach(function (e) { (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); });
  Object.keys(adj).forEach(function (k) { adj[k].sort(); });
  var seen = {}, order = [];
  function go(u) {
    seen[u] = true; order.push(u);
    var nb = adj[u] || [];
    for (var i = 0; i < nb.length; i++) if (!seen[nb[i]]) go(nb[i]);
  }
  go(start);
  return order;
}
const L4 = jsDe({
  tieuDe: 'Graph lab 4 — Depth-first order',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Write <code>dfsOrder(edges, start)</code> for an undirected graph (edges <code>[u, v]</code> of string vertices) returning the vertices in the order a recursive DFS from <code>start</code> first visits them, taking neighbours in alphabetical order. Unreachable vertices are omitted.</p>', '<p>Viết <code>dfsOrder(edges, start)</code> cho đồ thị vô hướng (cạnh <code>[u, v]</code> giữa các đỉnh chuỗi) trả các đỉnh theo thứ tự DFS đệ quy từ <code>start</code> thăm lần đầu, lấy láng giềng theo thứ tự chữ cái. Bỏ các đỉnh không tới được.</p>'),
  yeuCau: [bi('A start vertex that is in no edge gives [start].', 'Đỉnh bắt đầu không thuộc cạnh nào cho [start].')],
  viDu: [{ input: 'dfsOrder([["A","B"],["A","C"],["B","D"],["C","D"]],"A")', output: JSON.stringify(dfsOrder([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']], 'A')), explanation: 'A → B → D → C: after D the search backtracks to A and takes C.|||A → B → D → C: sau D quay lại A rồi sang C.' }],
  goiY: ['Mark when entering the vertex (before the recursive calls on neighbours).', 'Sort the neighbour lists once.'],
  loiHayGap: ['Marking a vertex only after its recursive calls (infinite recursion on cycles).', 'Visiting neighbours in input order instead of alphabetical.'],
  giaiThich: '<p>DFS pushes as deep as possible; the recursion stack is the path from the start to the current vertex.</p>',
  khaiNiem: ['DFS', 'recursion'],
  fn: 'dfsOrder',
  dau: 'function dfsOrder(edges, start) {\n  return [];\n}\n',
  giaiMa: dat(dfsOrder, 'dfsOrder'),
  ref: dfsOrder,
  cases: [{ args: [[['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']], 'A'] }, { args: [[['A', 'B']], 'Z'] }, { args: [[['A', 'D'], ['A', 'B'], ['B', 'C'], ['B', 'E'], ['C', 'F'], ['D', 'E'], ['E', 'F'], ['D', 'G']], 'A'] }, { args: [[['C', 'A'], ['A', 'B'], ['B', 'C'], ['C', 'D']], 'D'], an: true }, { args: [[['M', 'N'], ['O', 'P']], 'M'], an: true }],
});

function topologicalOrder(n, edges) {
  var indeg = [], adj = [], i;
  for (i = 0; i < n; i++) { indeg.push(0); adj.push([]); }
  edges.forEach(function (e) { adj[e[0]].push(e[1]); indeg[e[1]]++; });
  var ready = [], order = [];
  for (i = 0; i < n; i++) if (indeg[i] === 0) ready.push(i);
  while (ready.length) {
    ready.sort(function (a, b) { return a - b; });
    var u = ready.shift();
    order.push(u);
    adj[u].forEach(function (v) { indeg[v]--; if (indeg[v] === 0) ready.push(v); });
  }
  return order.length === n ? order : null;
}
const L5 = jsDe({
  tieuDe: 'Graph lab 5 — Topological sorting (build order)',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Tasks 0…n−1 have prerequisites: an edge <code>[a, b]</code> means task a must come before task b. Write <code>topologicalOrder(n, edges)</code> returning an order in which all prerequisites are respected, using Kahn’s algorithm and always choosing the <em>smallest-numbered</em> available task, so the answer is unique. If the prerequisites contain a cycle return <code>null</code>.</p>', '<p>Các công việc 0…n−1 có tiên quyết: cạnh <code>[a, b]</code> nghĩa là việc a phải đứng trước việc b. Viết <code>topologicalOrder(n, edges)</code> trả thứ tự tôn trọng mọi tiên quyết, dùng thuật toán Kahn và luôn chọn việc <em>có số nhỏ nhất</em> trong số các việc sẵn sàng để đáp án duy nhất. Nếu tiên quyết chứa chu trình trả <code>null</code>.</p>'),
  yeuCau: [bi('Duplicate edges may appear; they must not break the in-degree counting.', 'Có thể có cạnh trùng; chúng không được làm hỏng việc đếm bậc vào.')],
  viDu: [{ input: 'topologicalOrder(4, [[0,1],[0,2],[1,3],[2,3]])', output: JSON.stringify(topologicalOrder(4, [[0, 1], [0, 2], [1, 3], [2, 3]])), explanation: '0 first, then 1 and 2, then 3.|||0 trước, rồi 1 và 2, cuối cùng 3.' }, { input: 'topologicalOrder(2, [[0,1],[1,0]])', output: 'null', explanation: 'A cycle has no valid order.|||Chu trình không có thứ tự hợp lệ.' }],
  goiY: ['In-degree of every task; a task is ready when its in-degree is 0.', 'If fewer than n tasks were output, a cycle blocked the rest.'],
  loiHayGap: ['Not re-sorting the ready list after adding new ready tasks.', 'Using in-degree 1 instead of 0 as the ready condition.'],
  giaiThich: '<p>A directed graph has a topological order iff it is acyclic; Kahn repeatedly removes a source (a vertex with no incoming edge).</p>',
  khaiNiem: ['topological sort', 'DAG'],
  fn: 'topologicalOrder',
  dau: 'function topologicalOrder(n, edges) {\n  return null;\n}\n',
  giaiMa: dat(topologicalOrder, 'topologicalOrder'),
  ref: topologicalOrder,
  cases: [{ args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]] }, { args: [2, [[0, 1], [1, 0]]] }, { args: [3, []] }, { args: [6, [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]], an: true }, { args: [5, [[0, 1], [0, 1], [1, 2], [3, 2]]], an: true }, { args: [3, [[0, 1], [1, 2], [2, 1]]], an: true }],
});

/* topological-order validity table */
const TD = { n: 6, e: [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]] };
const valid = (ord) => ord.every((v, i) => TD.e.every(([a, b]) => b !== v || ord.indexOf(a) < i));
const CANDS = [[4, 5, 0, 2, 3, 1], [5, 4, 2, 3, 1, 0], [5, 2, 4, 0, 3, 1], [4, 5, 2, 0, 1, 3], [0, 1, 2, 3, 4, 5], [5, 4, 0, 2, 3, 1]];
assert.deepEqual(CANDS.map(valid), [true, true, true, false, false, true]);
const L6 = tinh({
  tieuDe: 'Graph lab 6 — Is this a valid topological order?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>Directed prerequisites: ${TD.e.map(([a, b]) => `${a}→${b}`).join(', ')} (tasks 0…5). A listing is a valid topological order if for every edge a→b, a appears before b. Decide for each candidate.</p>`, `<p>Tiên quyết có hướng: ${TD.e.map(([a, b]) => `${a}→${b}`).join(', ')} (việc 0…5). Một thứ tự là sắp xếp tô pô hợp lệ nếu với mọi cạnh a→b, a đứng trước b. Quyết định cho từng ứng viên.</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Candidate orders', 'Các thứ tự ứng viên'], [{ ma: 'o', ten: 'Order' }, { ma: 'v', ten: 'Valid?', luaChon: ['Yes', 'No'] }],
    CANDS.map((c) => ({ o: { o: c.join(' ') }, a: { v: valid(c) ? 'Yes' : 'No' } })),
    [CANDS.map((c) => `${c.join(' ')}: ${valid(c) ? 'valid' : 'INVALID (' + TD.e.filter(([a, b]) => c.indexOf(a) > c.indexOf(b)).map(([a, b]) => `${a}→${b}`).join(', ') + ' violated)'}`).join('; ') + '.', CANDS.map((c) => `${c.join(' ')}: ${valid(c) ? 'hợp lệ' : 'KHÔNG hợp lệ'}`).join('; ') + '.'])],
  goiY: ['For each edge a→b check that the position of a is smaller than the position of b.', 'A single violated edge makes the whole order invalid.'],
  loiHayGap: ['Checking only some of the edges.', 'Thinking the order must be sorted by number.'],
  thuatNgu: [tn('topological order', 'thứ tự tô pô')],
  khaiNiem: ['topological order'],
});

/* planarity */
const L7 = tinh({
  tieuDe: 'Graph lab 7 — Planarity, colouring and Hamilton facts',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Euler’s formula v − e + f = 2 for connected planar graphs, and the bounds e ≤ 3v − 6 (v ≥ 3), e ≤ 2v − 4 (bipartite).</p>', '<p>Công thức Euler v − e + f = 2 cho đồ thị phẳng liên thông, và các cận e ≤ 3v − 6 (v ≥ 3), e ≤ 2v − 4 (hai phía).</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['A connected planar graph has 8 vertices and 14 edges. How many faces (regions)?', 'Đồ thị phẳng liên thông có 8 đỉnh, 14 cạnh. Có bao nhiêu miền (mặt)?'], S.planarFaces(8, 14), [14 - 8, 8 + 14, 8 + 2], f2, ['f = 2 − v + e = 2 − 8 + 14 = 8.', 'f = 2 − v + e = 8.']),
    q('c2', ['Is K₅ planar?', 'K₅ có phẳng không?'], ['No: it has 10 edges > 3·5 − 6 = 9', 'Yes: every graph with 5 vertices is planar', 'Yes: 10 edges is below the limit 3·5 = 15', 'It depends on how the graph is drawn'], ['The bound e ≤ 3v − 6 fails, so K₅ cannot be drawn without crossings.', 'Cận e ≤ 3v − 6 không thoả nên K₅ không vẽ được không giao nhau.']),
    q('c3', ['Is K₃,₃ planar?', 'K₃,₃ có phẳng không?'], ['No: bipartite with 9 edges > 2·6 − 4 = 8', 'Yes: it has no triangles, so nothing blocks it', 'Yes: 9 ≤ 3·6 − 6', 'It depends on how the graph is drawn'], ['It has no triangles, so the stronger bound e ≤ 2v − 4 applies and is violated.', 'Không có tam giác nên áp dụng cận mạnh hơn e ≤ 2v − 4 và bị vi phạm.']),
    q('c4', ['The chromatic number of an odd cycle C₅ is …', 'Sắc số của chu trình lẻ C₅ là …'], ['3', '2', '4', '5'], ['Two colours alternate around an even cycle but fail on an odd one.', 'Hai màu xen kẽ được trên chu trình chẵn nhưng hỏng ở chu trình lẻ.']),
    q('c5', ['The chromatic number of K₆ is …', 'Sắc số của K₆ là …'], ['6', '3', '2', '5'], ['Every pair of vertices is adjacent, so all colours differ.', 'Mọi cặp đỉnh kề nhau nên mọi màu khác nhau.']),
    q('c6', ['Dirac’s theorem: a simple graph with n ≥ 3 vertices and every degree ≥ n/2 has …', 'Định lý Dirac: đồ thị đơn n ≥ 3 đỉnh và mọi bậc ≥ n/2 có …'], ['a Hamilton cycle', 'an Euler circuit', 'a bridge', 'no cycle'], ['It is a sufficient condition for a Hamilton cycle, not a necessary one.', 'Đó là điều kiện đủ cho chu trình Hamilton, không phải điều kiện cần.']),
  ],
  goiY: ['Use the edge bounds as quick non-planarity certificates; they do not prove planarity.', 'Chromatic number ≥ clique size; odd cycles need 3.'],
  loiHayGap: ['Using e ≤ 3v − 6 to conclude a graph is planar (it is only a necessary condition).', 'Confusing Euler (edges) and Hamilton (vertices) conditions.'],
  thuatNgu: [tn('chromatic number', 'sắc số'), tn('planar graph', 'đồ thị phẳng')],
  khaiNiem: ['planar graphs', 'colouring'],
});
assert.ok(S.edgesOf('K', 5) > 3 * 5 - 6 && S.edgesOf('Kmn', 3, 3) > 2 * 6 - 4);

export default doiDau({
  slug: 'mad101-7-lab-graph-algorithms',
  ten: '7.L Lab: graph algorithms',
  khoa: KHOA,
  baiHoc: 'mad101-7-1-do-thi',
  de: [L1, L2, L3, L4, L5, L6, L7],
});
