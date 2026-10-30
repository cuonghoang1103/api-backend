/** MAD101 · 7.1 — Graphs: degrees, representations, traversal, Euler, bipartite, shortest paths. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum, listAns } from './_md.mjs';

const f2 = (x) => String(x);
const seqAns = (a) => [a.join(','), a.join(', '), a.join(' '), a.join('-'), a.join(' - '), a.join(' → '), a.join('->'), a.join(' -> '), a.join('')];

const G1 = tinh({
  tieuDe: 'Graphs 1 — Vocabulary and basic facts',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Terminology of graph theory (Rosen §10.1–10.5).</p>', '<p>Thuật ngữ lý thuyết đồ thị (Rosen §10.1–10.5).</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The Handshaking Theorem says the sum of the degrees equals …', 'Định lý bắt tay nói tổng bậc bằng …'], ['2·|E|', '|E|', '|V|', '|V|·|E|'], ['Each edge contributes 1 to the degree of each of its two ends.', 'Mỗi cạnh đóng góp 1 vào bậc của mỗi đầu mút.']),
    q('c2', ['In any undirected graph the number of vertices of odd degree is …', 'Trong đồ thị vô hướng mọi số đỉnh bậc lẻ …'], ['even', 'odd', 'zero', 'at least 2'], ['The degree sum 2|E| is even, so odd terms must come in pairs.', 'Tổng bậc 2|E| chẵn nên số số hạng lẻ phải chẵn.']),
    q('c3', ['A simple graph has no …', 'Đồ thị đơn không có …'], ['loops or multiple edges', 'cycles', 'isolated vertices', 'odd degrees'], ['“Simple” forbids self-loops and parallel edges.', '“Đơn” cấm khuyên và cạnh song song.']),
    q('c4', ['A path that uses every edge exactly once and returns to its start is …', 'Đường đi dùng mỗi cạnh đúng một lần và quay về điểm đầu là …'], ['an Euler circuit', 'a Hamilton cycle', 'a spanning tree', 'a simple path'], ['Euler circuit: every edge once. Hamilton cycle: every vertex once.', 'Chu trình Euler: mỗi cạnh một lần. Chu trình Hamilton: mỗi đỉnh một lần.']),
    q('c5', ['A connected graph has an Euler circuit iff …', 'Đồ thị liên thông có chu trình Euler khi và chỉ khi …'], ['every vertex has even degree', 'exactly two vertices have odd degree', 'it has a cycle', 'it is complete'], ['Exactly two odd vertices gives an Euler path (not a circuit).', 'Đúng hai đỉnh bậc lẻ cho đường Euler (không phải chu trình).']),
    q('c6', ['A graph is bipartite iff …', 'Đồ thị là hai phía khi và chỉ khi …'], ['it has no odd cycle', 'it has no cycle', 'every vertex has degree 2', 'it is a tree only'], ['Equivalent: its vertices can be 2-coloured so every edge joins different colours.', 'Tương đương: có thể tô 2 màu sao cho mọi cạnh nối hai màu khác nhau.']),
  ],
  goiY: ['Euler concerns edges, Hamilton concerns vertices.', 'Handshake: count each edge from both ends.'],
  loiHayGap: ['Mixing Euler and Hamilton.', 'Thinking a graph with two odd vertices has an Euler circuit (only a path).'],
  thuatNgu: [tn('degree', 'bậc'), tn('Euler circuit', 'chu trình Euler'), tn('bipartite', 'hai phía'), tn('simple graph', 'đồ thị đơn')],
  khaiNiem: ['graph vocabulary'],
});

const E1 = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['D', 'E'], ['E', 'F']];
const V1 = ['A', 'B', 'C', 'D', 'E', 'F'];
const dg = S.degrees(E1);
const FAM = [['K', 6, 0, 'K₆'], ['Kmn', 3, 4, 'K₃,₄'], ['C', 7, 0, 'C₇'], ['W', 6, 0, 'W₆ (6 vertices)'], ['Q', 4, 0, 'Q₄']];
const G2 = tinh({
  tieuDe: 'Graphs 2 — Degrees and edge counts',
  doKho: 'EASY', phut: 10,
  moTa: bi(`<p>Graph: edges ${E1.map((e) => e.join('')).join(', ')}. Give the degree of each vertex. Then give the number of edges of the standard graph families K<sub>n</sub> (complete), K<sub>m,n</sub>, C<sub>n</sub> (cycle), W<sub>n</sub> (wheel on n vertices) and Q<sub>n</sub> (hypercube).</p>`, `<p>Đồ thị: các cạnh ${E1.map((e) => e.join('')).join(', ')}. Cho bậc của từng đỉnh. Sau đó cho số cạnh của các họ đồ thị chuẩn K<sub>n</sub> (đầy đủ), K<sub>m,n</sub>, C<sub>n</sub> (chu trình), W<sub>n</sub> (bánh xe n đỉnh) và Q<sub>n</sub> (siêu lập phương).</p>`),
  loai: 'table',
  bang: [
    bang1('b1', ['Degrees', 'Bậc'], [{ ma: 'v', ten: 'Vertex' }, { ma: 'd', ten: 'degree' }], V1.map((v) => ({ o: { v }, a: { d: String(dg[v]) } })), [`Degrees: ${V1.map((v) => `${v}=${dg[v]}`).join(', ')}; sum ${V1.reduce((s, v) => s + dg[v], 0)} = 2·${E1.length}.`, `Bậc: ${V1.map((v) => `${v}=${dg[v]}`).join(', ')}; tổng ${V1.reduce((s, v) => s + dg[v], 0)} = 2·${E1.length}.`]),
    bang1('b2', ['Edges of standard graphs', 'Số cạnh của các đồ thị chuẩn'], [{ ma: 'g', ten: 'Graph' }, { ma: 'e', ten: '|E|' }], FAM.map(([k, a, b, nm]) => ({ o: { g: nm }, a: { e: String(S.edgesOf(k, a, b)) } })), [FAM.map(([k, a, b, nm]) => `${nm}: ${S.edgesOf(k, a, b)}`).join('; ') + '. K_n: n(n−1)/2; K_{m,n}: mn; C_n: n; W_n: 2(n−1); Q_n: n·2^(n−1).', FAM.map(([k, a, b, nm]) => `${nm}: ${S.edgesOf(k, a, b)}`).join('; ') + '.']),
  ],
  goiY: ['Degree = number of edge ends at the vertex.', 'For the families use the formulas; Q₄ has 16 vertices each of degree 4: 16·4/2 edges.'],
  loiHayGap: ['Counting a vertex’s neighbours but forgetting an edge that appears later in the list.', 'Using n(n−1) (ordered pairs) for K_n.'],
  thuatNgu: [tn('wheel', 'đồ thị bánh xe'), tn('hypercube', 'siêu lập phương')],
  khaiNiem: ['degree', 'graph families'],
});
assert.equal(V1.reduce((s, v) => s + dg[v], 0), 2 * E1.length);

const AM = [['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D'], ['D', 'A']];
const AV = ['A', 'B', 'C', 'D'];
const AMAT = S.adjMatrix(AM, AV);
const PAIRS = [[0, 0], [0, 2], [1, 3], [2, 2], [3, 1]];
const G3 = tinh({
  tieuDe: 'Graphs 3 — Adjacency matrix and walk counts',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>Graph on A, B, C, D with edges ${AM.map((e) => e.join('')).join(', ')} (undirected). Fill its adjacency matrix (rows and columns in the order A, B, C, D). Then, using powers of the matrix, give the number of walks of length 2 and length 3 between the listed vertex pairs (indices 1–4 are A–D).</p>`, `<p>Đồ thị trên A, B, C, D với các cạnh ${AM.map((e) => e.join('')).join(', ')} (vô hướng). Điền ma trận kề (dòng và cột theo thứ tự A, B, C, D). Sau đó dùng luỹ thừa ma trận để cho số đường đi (walk) độ dài 2 và 3 giữa các cặp đỉnh liệt kê (chỉ số 1–4 là A–D).</p>`),
  loai: 'table',
  bang: [
    bang1('b1', ['Adjacency matrix', 'Ma trận kề'], [{ ma: 'r', ten: 'row' }, ...AV.map((v, j) => ({ ma: 'c' + j, ten: v, luaChon: ['0', '1', '2'] }))], AMAT.map((row, i) => ({ o: { r: AV[i] }, a: Object.fromEntries(row.map((v, j) => ['c' + j, String(v)])) })), [`Rows: ${AMAT.map((r) => r.join('')).join(' / ')}.`, `Các dòng: ${AMAT.map((r) => r.join('')).join(' / ')}.`]),
    bang1('b2', ['Walk counts', 'Số walk'], [{ ma: 'p', ten: 'From → to' }, { ma: 'w2', ten: 'length 2' }, { ma: 'w3', ten: 'length 3' }], PAIRS.map(([i, j]) => ({ o: { p: `${AV[i]} → ${AV[j]}` }, a: { w2: String(S.walks(AMAT, 2, i, j)), w3: String(S.walks(AMAT, 3, i, j)) } })), [PAIRS.map(([i, j]) => `${AV[i]}→${AV[j]}: A²=${S.walks(AMAT, 2, i, j)}, A³=${S.walks(AMAT, 3, i, j)}`).join('; ') + '.', PAIRS.map(([i, j]) => `${AV[i]}→${AV[j]}: A²=${S.walks(AMAT, 2, i, j)}, A³=${S.walks(AMAT, 3, i, j)}`).join('; ') + '.']),
  ],
  goiY: ['For an undirected simple graph the matrix is symmetric with zeros on the diagonal.', 'Entry (i, j) of Aᵏ counts walks of length k; the diagonal of A² is the degree sequence.'],
  loiHayGap: ['Filling only the upper triangle.', 'Counting only simple paths when the question asks for walks (vertices may repeat).'],
  thuatNgu: [tn('adjacency matrix', 'ma trận kề'), tn('walk', 'đường đi (cho phép lặp)')],
  khaiNiem: ['adjacency matrix', 'walks'],
});

const GB = [
  { e: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F']] },
  { e: [['A', 'D'], ['A', 'B'], ['B', 'C'], ['B', 'E'], ['C', 'F'], ['D', 'E'], ['E', 'F'], ['D', 'G']] },
];
const G4 = tinh({
  tieuDe: 'Graphs 4 — Breadth-first and depth-first order',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Start both searches at A and always visit neighbours in alphabetical order. Give the order in which vertices are first visited (BFS uses a queue, DFS a stack/recursion). Write the vertices separated by commas, e.g. <code>A,B,C</code>.</p>', '<p>Cả hai tìm kiếm bắt đầu từ A và luôn thăm láng giềng theo thứ tự chữ cái. Cho thứ tự các đỉnh được thăm lần đầu (BFS dùng hàng đợi, DFS dùng ngăn xếp/đệ quy). Viết các đỉnh cách nhau bằng dấu phẩy, vd <code>A,B,C</code>.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['BFS and DFS orders', 'Thứ tự BFS và DFS'], [{ ma: 'g', ten: 'Graph (edges)' }, { ma: 'bfs', ten: 'BFS order' }, { ma: 'dfs', ten: 'DFS order' }],
    GB.map((g) => ({ o: { g: g.e.map((x) => x.join('')).join(' ') }, a: { bfs: seqAns(S.bfsOrder(g.e, 'A')), dfs: seqAns(S.dfsOrder(g.e, 'A')) } })),
    [GB.map((g) => `${g.e.map((x) => x.join('')).join(' ')}: BFS ${S.bfsOrder(g.e, 'A').join(',')}; DFS ${S.dfsOrder(g.e, 'A').join(',')}`).join(' | ') + '.', GB.map((g) => `BFS ${S.bfsOrder(g.e, 'A').join(',')}; DFS ${S.dfsOrder(g.e, 'A').join(',')}`).join(' | ') + '.'])],
  goiY: ['BFS: finish all neighbours of a vertex (in order) before going deeper.', 'DFS: go as deep as possible on the first unvisited neighbour, then backtrack.'],
  loiHayGap: ['Marking vertices visited when they are popped instead of when first discovered (changes BFS order on some graphs).', 'Mixing the BFS and DFS orders.'],
  thuatNgu: [tn('breadth-first search', 'tìm kiếm theo chiều rộng'), tn('depth-first search', 'tìm kiếm theo chiều sâu')],
  khaiNiem: ['BFS', 'DFS'],
});

const GE = [
  { n: 'triangle + pendant', e: [['a', 'b'], ['b', 'c'], ['c', 'a'], ['c', 'd']], v: ['a', 'b', 'c', 'd'] },
  { n: '4-cycle', e: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'a']], v: ['a', 'b', 'c', 'd'] },
  { n: 'K4', e: [['a', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'c'], ['b', 'd'], ['c', 'd']], v: ['a', 'b', 'c', 'd'] },
  { n: '5-cycle', e: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'a']], v: ['a', 'b', 'c', 'd', 'e'] },
  { n: 'two triangles', e: [['a', 'b'], ['b', 'c'], ['c', 'a'], ['d', 'e'], ['e', 'f'], ['f', 'd']], v: ['a', 'b', 'c', 'd', 'e', 'f'] },
  { n: 'path of 5', e: [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e']], v: ['a', 'b', 'c', 'd', 'e'] },
];
const G5 = tinh({
  tieuDe: 'Graphs 5 — Euler, bipartite and connected components',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each graph decide: does it have an Euler <b>circuit</b>, only an Euler <b>path</b>, or <b>none</b>? Is it <b>bipartite</b>? How many connected components does it have?</p>', '<p>Với mỗi đồ thị quyết định: có <b>chu trình</b> Euler, chỉ có <b>đường</b> Euler, hay <b>không có</b>? Có <b>hai phía</b> không? Có bao nhiêu thành phần liên thông?</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Graph properties', 'Tính chất đồ thị'], [{ ma: 'g', ten: 'Graph' }, { ma: 'eu', ten: 'Euler', luaChon: ['circuit', 'path', 'none'] }, { ma: 'bi', ten: 'Bipartite?', luaChon: ['Yes', 'No'] }, { ma: 'cc', ten: '# components' }],
    GE.map((g) => ({ o: { g: `${g.n}: ${g.e.map((x) => x.join('')).join(' ')}` }, a: { eu: S.eulerType(g.e, g.v), bi: S.isBipartite(g.e, g.v) ? 'Yes' : 'No', cc: String(S.components(g.e, g.v)) } })),
    [GE.map((g) => `${g.n}: Euler ${S.eulerType(g.e, g.v)}, bipartite ${S.isBipartite(g.e, g.v)}, components ${S.components(g.e, g.v)}`).join('; ') + '.', GE.map((g) => `${g.n}: Euler ${S.eulerType(g.e, g.v)}, hai phía ${S.isBipartite(g.e, g.v)}, ${S.components(g.e, g.v)} thành phần`).join('; ') + '.'])],
  goiY: ['Count odd-degree vertices: 0 → circuit, 2 → path, otherwise none (the graph must also be connected on its edges).', 'An odd cycle (triangle, 5-cycle) forbids bipartiteness.'],
  loiHayGap: ['Declaring “two triangles” Eulerian: each triangle has an Euler circuit but the graph is disconnected.', 'Calling the 4-cycle non-bipartite.'],
  thuatNgu: [tn('connected component', 'thành phần liên thông')],
  khaiNiem: ['Euler', 'bipartite', 'components'],
});

const DJ = [['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]];
const DR = S.dijkstra(DJ, 'A');
const DV = ['B', 'C', 'D', 'E', 'F'];
const G6 = tinh({
  tieuDe: 'Graphs 6 — Dijkstra’s shortest paths',
  doKho: 'HARD', phut: 18,
  moTa: bi(`<p>Weighted undirected graph with edges (weight): ${DJ.map(([a, b, w]) => `${a}${b}(${w})`).join(', ')}. Run Dijkstra’s algorithm from A. Give the shortest distance to every vertex, the vertex order in which they are finalised (ties by letter), and the shortest path to F (vertices separated by commas).</p>`, `<p>Đồ thị vô hướng có trọng số với các cạnh (trọng số): ${DJ.map(([a, b, w]) => `${a}${b}(${w})`).join(', ')}. Chạy thuật toán Dijkstra từ A. Cho khoảng cách ngắn nhất tới mỗi đỉnh, thứ tự các đỉnh được chốt (hoà thì theo chữ cái) và đường đi ngắn nhất tới F (các đỉnh cách nhau bằng dấu phẩy).</p>`),
  loai: 'table',
  bang: [
    bang1('b1', ['Distances from A', 'Khoảng cách từ A'], [{ ma: 'v', ten: 'Vertex' }, { ma: 'd', ten: 'dist(A, v)' }], DV.map((v) => ({ o: { v }, a: { d: String(DR.dist[v]) } })), [`Distances: ${DV.map((v) => `${v}=${DR.dist[v]}`).join(', ')}.`, `Khoảng cách: ${DV.map((v) => `${v}=${DR.dist[v]}`).join(', ')}.`]),
    bang1('b2', ['Order and path', 'Thứ tự và đường đi'], [{ ma: 'k', ten: 'Question' }, { ma: 'a', ten: 'Answer' }], [{ o: { k: 'Order in which vertices are finalised (starting with A)' }, a: { a: seqAns(DR.order) } }, { o: { k: 'Shortest path from A to F' }, a: { a: seqAns(S.pathTo(DR.prev, 'F')) } }], [`Order: ${DR.order.join(',')}; path to F: ${S.pathTo(DR.prev, 'F').join(',')} (length ${DR.dist.F}).`, `Thứ tự: ${DR.order.join(',')}; đường tới F: ${S.pathTo(DR.prev, 'F').join(',')} (độ dài ${DR.dist.F}).`]),
  ],
  goiY: ['Maintain tentative distances; repeatedly finalise the smallest tentative vertex and relax its edges.', 'The path comes from the “previous” pointers recorded at the last improvement.'],
  loiHayGap: ['Finalising a vertex before comparing all tentative distances.', 'Adding the edge weights of a non-shortest path.'],
  thuatNgu: [tn('relaxation', 'nới lỏng cạnh'), tn('tentative distance', 'khoảng cách tạm thời')],
  khaiNiem: ['Dijkstra'],
});
assert.ok(DR.dist.F > 0);

function bfsOrder(edges, start) {
  var adj = {}, i;
  edges.forEach(function (e) { (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); });
  Object.keys(adj).forEach(function (k) { adj[k].sort(); });
  if (!adj[start]) return [start];
  var seen = {}, queue = [start], order = [];
  seen[start] = true;
  while (queue.length) {
    var u = queue.shift();
    order.push(u);
    for (i = 0; i < adj[u].length; i++) if (!seen[adj[u][i]]) { seen[adj[u][i]] = true; queue.push(adj[u][i]); }
  }
  return order;
}
const G7 = jsDe({
  tieuDe: 'Graphs 7 — Implement breadth-first search',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Write <code>bfsOrder(edges, start)</code> for an undirected graph given as an array of <code>[u, v]</code> edges between string vertices. Return the array of vertices in the order a BFS from <code>start</code> visits them, always taking neighbours in alphabetical order. Vertices not reachable from <code>start</code> are not included. If <code>start</code> does not appear in any edge, the result is just <code>[start]</code>.</p>', '<p>Viết <code>bfsOrder(edges, start)</code> cho đồ thị vô hướng cho bởi mảng các cạnh <code>[u, v]</code> giữa các đỉnh dạng chuỗi. Trả mảng đỉnh theo thứ tự BFS từ <code>start</code> thăm, luôn lấy láng giềng theo thứ tự chữ cái. Đỉnh không tới được từ <code>start</code> không đưa vào. Nếu <code>start</code> không xuất hiện trong cạnh nào, kết quả chỉ là <code>[start]</code>.</p>'),
  yeuCau: [bi('Mark a vertex as seen when it is enqueued.', 'Đánh dấu đã thấy khi đỉnh được đưa vào hàng đợi.')],
  viDu: [{ input: 'bfsOrder([["A","B"],["A","C"],["B","D"],["C","D"]],"A")', output: JSON.stringify(bfsOrder([['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']], 'A')), explanation: 'Level 0: A; level 1: B, C; level 2: D.|||Mức 0: A; mức 1: B, C; mức 2: D.' }],
  goiY: ['Build an adjacency map with both directions; sort each neighbour list.', 'Use an array as a queue: push at the back, shift from the front.'],
  loiHayGap: ['Adding the edge in one direction only.', 'Marking visited on dequeue: a vertex can be enqueued twice.'],
  giaiThich: '<p>BFS discovers vertices in non-decreasing distance (in edges) from the start; the queue keeps the frontier in order.</p>',
  khaiNiem: ['BFS', 'adjacency list'],
  fn: 'bfsOrder',
  dau: 'function bfsOrder(edges, start) {\n  return [];\n}\n',
  giaiMa: dat(bfsOrder, 'bfsOrder'),
  ref: bfsOrder,
  cases: [{ args: [[['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D']], 'A'] }, { args: [[['A', 'B']], 'Z'] }, { args: [[['B', 'A'], ['C', 'A'], ['D', 'B'], ['E', 'C'], ['F', 'E']], 'A'] }, { args: [[['A', 'D'], ['A', 'B'], ['B', 'C'], ['B', 'E'], ['C', 'F'], ['D', 'E'], ['E', 'F'], ['D', 'G']], 'A'], an: true }, { args: [[['X', 'Y'], ['Y', 'Z'], ['P', 'Q']], 'Y'], an: true }, { args: [[], 'A'], an: true }],
});

function shortestDistances(edges, source) {
  var adj = {}, dist = {}, done = {};
  edges.forEach(function (e) {
    (adj[e[0]] = adj[e[0]] || []).push([e[1], e[2]]);
    (adj[e[1]] = adj[e[1]] || []).push([e[0], e[2]]);
  });
  Object.keys(adj).forEach(function (v) { dist[v] = -1; });
  if (dist[source] === undefined) { dist[source] = 0; return dist; }
  dist[source] = 0;
  for (;;) {
    var best = null;
    Object.keys(dist).forEach(function (v) { if (!done[v] && dist[v] >= 0 && (best === null || dist[v] < dist[best])) best = v; });
    if (best === null) break;
    done[best] = true;
    (adj[best] || []).forEach(function (p) {
      var nd = dist[best] + p[1];
      if (dist[p[0]] === -1 || nd < dist[p[0]]) dist[p[0]] = nd;
    });
  }
  return dist;
}
const G8 = jsDe({
  tieuDe: 'Graphs 8 — Implement Dijkstra’s algorithm',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Write <code>shortestDistances(edges, source)</code> for an undirected weighted graph: <code>edges</code> is an array of <code>[u, v, w]</code> with positive integer weights. Return an object mapping every vertex that appears in the edges (and the source) to its shortest distance from <code>source</code>; use <code>-1</code> for unreachable vertices. A simple O(V²) Dijkstra (scan for the unfinished vertex with the smallest tentative distance) is enough.</p>', '<p>Viết <code>shortestDistances(edges, source)</code> cho đồ thị vô hướng có trọng số: <code>edges</code> là mảng các <code>[u, v, w]</code> với trọng số nguyên dương. Trả đối tượng ánh xạ mỗi đỉnh xuất hiện trong cạnh (và nguồn) tới khoảng cách ngắn nhất từ <code>source</code>; dùng <code>-1</code> cho đỉnh không tới được. Dijkstra O(V²) đơn giản (quét tìm đỉnh chưa chốt có khoảng cách tạm nhỏ nhất) là đủ.</p>'),
  yeuCau: [bi('Weights are positive, so a finalised vertex never improves.', 'Trọng số dương nên đỉnh đã chốt không thể tốt hơn.')],
  viDu: [{ input: 'shortestDistances([["A","B",4],["A","C",2],["B","C",1]],"A")', output: JSON.stringify(shortestDistances([['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1]], 'A')), explanation: 'A→C→B costs 3 < 4.|||A→C→B tốn 3 < 4.' }],
  goiY: ['Keep dist (−1 = unknown) and done flags; loop: pick the smallest unfinished known vertex, finalise it, relax its neighbours.', 'Stop when no unfinished vertex has a known distance.'],
  loiHayGap: ['Treating −1 as the smallest distance when picking the next vertex.', 'Relaxing with the edge weight alone instead of dist[u] + w.'],
  giaiThich: '<p>With non-negative weights, the unfinished vertex with the smallest tentative distance can no longer be improved: any other route to it must leave the finished set through a vertex that is at least as far.</p>',
  khaiNiem: ['Dijkstra', 'shortest path'],
  fn: 'shortestDistances',
  dau: 'function shortestDistances(edges, source) {\n  return {};\n}\n',
  giaiMa: dat(shortestDistances, 'shortestDistances'),
  ref: shortestDistances,
  cases: [{ args: [[['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1]], 'A'] }, { args: [DJ, 'A'] }, { args: [[['A', 'B', 1], ['C', 'D', 1]], 'A'] }, { args: [DJ, 'F'], an: true }, { args: [[['S', 'A', 7], ['S', 'B', 2], ['B', 'A', 3], ['A', 'T', 1], ['B', 'T', 8]], 'S'], an: true }, { args: [[], 'A'], an: true }],
});
void ord; void listAns; void mcNum; void f2;

export default doiDau({
  slug: 'mad101-7-1-do-thi',
  ten: '7.1 Graphs & shortest paths',
  khoa: KHOA,
  baiHoc: 'mad101-7-1-do-thi',
  de: [G1, G2, G3, G4, G5, G6, G7, G8],
});
