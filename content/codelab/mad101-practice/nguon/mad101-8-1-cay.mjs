/** MAD101 · 8.1 — Trees: properties, m-ary trees, traversal, expression trees, spanning trees, Huffman. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum, dec } from './_md.mjs';

const f2 = (x) => String(x);
const spaced = (a) => [a.join(' '), a.join(','), a.join(', '), a.join('')];

const T1 = tinh({
  tieuDe: 'Trees 1 — Definitions and basic facts',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>A tree is a connected undirected graph with no simple circuits (Rosen §11.1). Check the facts you will use all chapter.</p>', '<p>Cây là đồ thị vô hướng liên thông không có chu trình đơn (Rosen §11.1). Kiểm tra các sự kiện bạn sẽ dùng suốt chương.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A tree with n vertices has exactly … edges.', 'Cây có n đỉnh có đúng … cạnh.'], ['n − 1', 'n', 'n + 1', '2n'], ['Adding any edge to a tree makes a cycle; removing any edge disconnects it.', 'Thêm cạnh nào vào cây cũng tạo chu trình; bỏ cạnh nào cũng làm mất liên thông.']),
    q('c2', ['Between any two vertices of a tree there is …', 'Giữa hai đỉnh bất kỳ của cây có …'], ['exactly one simple path', 'at least two simple paths', 'no path', 'a Hamilton cycle'], ['Uniqueness of the path is equivalent to having no cycle.', 'Đường đi duy nhất tương đương với không có chu trình.']),
    q('c3', ['A full m-ary tree with i internal vertices has … vertices.', 'Cây m-phân đầy đủ có i đỉnh trong có … đỉnh.'], ['m·i + 1', 'm·i', 'i + m', 'i²'], ['Every vertex except the root is a child: n = m·i + 1.', 'Mọi đỉnh trừ gốc đều là con: n = m·i + 1.']),
    q('c4', ['A binary tree of height h has at most … leaves.', 'Cây nhị phân chiều cao h có tối đa … lá.'], ['2ʰ', 'h²', '2h', 'h'], ['Each level at most doubles the number of nodes.', 'Mỗi mức tối đa gấp đôi số nút.']),
    q('c5', ['In-order traversal of a binary SEARCH tree visits keys …', 'Duyệt trung thứ tự (in-order) cây tìm kiếm nhị phân thăm các khoá …'], ['in increasing order', 'in decreasing order', 'level by level', 'in insertion order'], ['Left subtree < root < right subtree, recursively.', 'Cây con trái < gốc < cây con phải, đệ quy.']),
    q('c6', ['A spanning tree of a connected graph G is …', 'Cây khung của đồ thị liên thông G là …'], ['a subgraph that is a tree containing every vertex of G', 'any tree inside G', 'a Hamilton path only', 'the set of leaves'], ['It spans (touches) all the vertices, uses |V| − 1 edges, and is acyclic.', 'Nó chứa mọi đỉnh, dùng |V| − 1 cạnh và không có chu trình.']),
  ],
  goiY: ['Memorise: edges = vertices − 1.', 'For m-ary trees: n = m·i + 1 and l = (m − 1)·i + 1.'],
  loiHayGap: ['Counting n edges for a tree on n vertices.', 'Confusing “full” (every internal node has m children) with “complete”.'],
  thuatNgu: [tn('spanning tree', 'cây khung'), tn('full m-ary tree', 'cây m-phân đầy đủ'), tn('leaf', 'lá'), tn('internal vertex', 'đỉnh trong')],
  khaiNiem: ['trees'],
});

const MA = [{ m: 2, i: 10 }, { m: 3, i: 7 }, { m: 4, i: 5 }, { m: 5, i: 12 }];
const MB = [{ m: 2, l: 33 }, { m: 3, l: 25 }, { m: 4, l: 19 }];
const T2 = tinh({
  tieuDe: 'Trees 2 — Full m-ary tree counts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>For a full m-ary tree: n = m·i + 1 vertices, l = (m − 1)·i + 1 leaves, n = i + l. Complete the table; the second table starts from the number of leaves, and the last column gives the minimum possible height ⌈log_m l⌉.</p>', '<p>Với cây m-phân đầy đủ: n = m·i + 1 đỉnh, l = (m − 1)·i + 1 lá, n = i + l. Hoàn thành bảng; bảng thứ hai xuất phát từ số lá, cột cuối cho chiều cao tối thiểu ⌈log_m l⌉.</p>'),
  loai: 'table',
  bang: [
    bang1('b1', ['From the internal vertices', 'Từ số đỉnh trong'], [{ ma: 'g', ten: 'm, i' }, { ma: 'n', ten: 'vertices n' }, { ma: 'l', ten: 'leaves l' }], MA.map(({ m, i }) => { const t = S.fullTree(m, i); return { o: { g: `m = ${m},  i = ${i}` }, a: { n: String(t.n), l: String(t.leaves) } }; }), [MA.map(({ m, i }) => { const t = S.fullTree(m, i); return `m=${m}, i=${i}: n=${t.n}, l=${t.leaves}`; }).join('; ') + '.', MA.map(({ m, i }) => { const t = S.fullTree(m, i); return `m=${m}, i=${i}: n=${t.n}, l=${t.leaves}`; }).join('; ') + '.']),
    bang1('b2', ['From the leaves', 'Từ số lá'], [{ ma: 'g', ten: 'm, l' }, { ma: 'i', ten: 'internal i' }, { ma: 'n', ten: 'vertices n' }, { ma: 'h', ten: 'min height' }], MB.map(({ m, l }) => { const i = (l - 1) / (m - 1); return { o: { g: `m = ${m},  l = ${l}` }, a: { i: String(i), n: String(m * i + 1), h: String(S.minHeight(m, l)) } }; }), [MB.map(({ m, l }) => { const i = (l - 1) / (m - 1); return `m=${m}, l=${l}: i=${i}, n=${m * i + 1}, h≥${S.minHeight(m, l)}`; }).join('; ') + '.', MB.map(({ m, l }) => { const i = (l - 1) / (m - 1); return `m=${m}, l=${l}: i=${i}, n=${m * i + 1}, h≥${S.minHeight(m, l)}`; }).join('; ') + '.']),
  ],
  goiY: ['From l: i = (l − 1)/(m − 1), then n = m·i + 1.', 'Height: the smallest h with mʰ ≥ l.'],
  loiHayGap: ['Using n = m·i instead of m·i + 1 (forgetting the root).', 'Rounding the minimum height down instead of up.'],
  thuatNgu: [tn('height', 'chiều cao')],
  khaiNiem: ['m-ary trees'],
});
MB.forEach(({ m, l }) => assert.ok(Number.isInteger((l - 1) / (m - 1))));

const BS = [[8, 3, 10, 1, 6, 14, 4, 7, 13], [5, 2, 8, 1, 4, 7, 9, 3], [10, 5, 15, 3, 7, 12, 20, 1]];
const bsTr = (v) => S.bstBuild(v);
const T3 = tinh({
  tieuDe: 'Trees 3 — Binary search tree: insert, traverse, measure',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Insert the keys one by one into an empty binary search tree (smaller to the left, larger-or-equal to the right). Then give the pre-order, in-order and post-order traversals (comma-separated), the height (edges on the longest root-to-leaf path) and the number of leaves.</p>', '<p>Chèn lần lượt các khoá vào cây tìm kiếm nhị phân rỗng (nhỏ hơn sang trái, lớn hơn hoặc bằng sang phải). Cho các phép duyệt tiền thứ tự, trung thứ tự, hậu thứ tự (cách nhau dấu phẩy), chiều cao (số cạnh của đường dài nhất từ gốc đến lá) và số lá.</p>'),
  loai: 'table',
  bang: BS.map((v, k) => bang1('b' + (k + 1), [`Insert order: ${v.join(', ')}`, `Thứ tự chèn: ${v.join(', ')}`], [{ ma: 'w', ten: 'Quantity' }, { ma: 'a', ten: 'Answer' }],
    [{ o: { w: 'Pre-order' }, a: { a: spaced(S.traverse(bsTr(v), 'pre')) } }, { o: { w: 'In-order' }, a: { a: spaced(S.traverse(bsTr(v), 'in')) } }, { o: { w: 'Post-order' }, a: { a: spaced(S.traverse(bsTr(v), 'post')) } }, { o: { w: 'Height' }, a: { a: String(S.treeHeight(bsTr(v))) } }, { o: { w: 'Leaves' }, a: { a: String(S.leaves(bsTr(v))) } }],
    [`pre ${S.traverse(bsTr(v), 'pre').join(',')}; in ${S.traverse(bsTr(v), 'in').join(',')}; post ${S.traverse(bsTr(v), 'post').join(',')}; height ${S.treeHeight(bsTr(v))}; leaves ${S.leaves(bsTr(v))}.`, `tiền ${S.traverse(bsTr(v), 'pre').join(',')}; trung ${S.traverse(bsTr(v), 'in').join(',')}; hậu ${S.traverse(bsTr(v), 'post').join(',')}.`])),
  goiY: ['The first key is the root; each later key walks down comparing with the node it meets.', 'In-order of a BST is the sorted list — use it to check your tree.'],
  loiHayGap: ['Mixing pre-order (root, left, right) with post-order (left, right, root).', 'Counting height in vertices instead of edges.'],
  thuatNgu: [tn('pre-order', 'duyệt tiền thứ tự'), tn('in-order', 'duyệt trung thứ tự'), tn('post-order', 'duyệt hậu thứ tự')],
  khaiNiem: ['BST', 'tree traversal'],
});

const EX = [['+', ['*', 2, 3], ['-', 8, 4]], ['*', ['+', 3, 4], ['-', 9, ['/', 6, 2]]], ['-', ['/', ['*', 4, 5], 2], ['+', 1, ['*', 2, 3]]]];
const T4 = tinh({
  tieuDe: 'Trees 4 — Expression trees: prefix, postfix and value',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Each expression is given fully parenthesised (so its tree is unambiguous). Write the prefix (Polish) and postfix (reverse Polish) forms with the tokens separated by single spaces, and the value.</p>', '<p>Mỗi biểu thức cho dạng đầy đủ ngoặc (cây rõ ràng). Viết dạng tiền tố (Ba Lan) và hậu tố (Ba Lan đảo) với các token cách nhau một dấu cách, và giá trị.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Expression trees', 'Cây biểu thức'], [{ ma: 'e', ten: 'Infix' }, { ma: 'pre', ten: 'Prefix' }, { ma: 'post', ten: 'Postfix' }, { ma: 'v', ten: 'Value' }],
    EX.map((t) => ({ o: { e: S.exprString(t, 'infix') }, a: { pre: S.exprString(t, 'prefix'), post: S.exprString(t, 'postfix'), v: String(S.expressionEval(t)) } })),
    [EX.map((t) => `${S.exprString(t, 'infix')}: prefix ${S.exprString(t, 'prefix')}; postfix ${S.exprString(t, 'postfix')}; value ${S.expressionEval(t)}`).join(' | ') + '.', EX.map((t) => `prefix ${S.exprString(t, 'prefix')}; postfix ${S.exprString(t, 'postfix')}; = ${S.expressionEval(t)}`).join(' | ') + '.'])],
  goiY: ['Draw the tree: the main operator is the root; pre-order gives prefix, post-order gives postfix.', 'Evaluate postfix with a stack: push numbers; on an operator pop two, apply, push the result.'],
  loiHayGap: ['Swapping operand order for − and ÷ in postfix (the left operand comes first).', 'Using in-order for “prefix”.'],
  thuatNgu: [tn('Polish notation', 'ký pháp Ba Lan'), tn('reverse Polish notation', 'ký pháp Ba Lan đảo')],
  khaiNiem: ['expression trees'],
});
assert.equal(S.expressionEval(EX[1]), 42); assert.equal(S.expressionEval(EX[2]), 3);

const WG = { v: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], e: [['A', 'B', 7], ['A', 'D', 5], ['B', 'C', 8], ['B', 'D', 9], ['B', 'E', 7], ['C', 'E', 5], ['D', 'E', 15], ['D', 'F', 6], ['E', 'F', 8], ['E', 'G', 9], ['F', 'G', 11]] };
const KR = S.kruskal(WG.e, WG.v), PR = S.prim(WG.e, WG.v, 'A');
assert.equal(KR.weight, PR.weight);
const T5 = tinh({
  tieuDe: 'Trees 5 — Minimum spanning trees by Kruskal and Prim',
  doKho: 'HARD', phut: 18,
  moTa: bi(`<p>Weighted graph on A–G with edges (weight): ${WG.e.map(([a, b, w]) => `${a}${b}(${w})`).join(', ')}. Kruskal: sort the edges by weight and add each one that does not close a cycle. Prim from A: repeatedly add the cheapest edge leaving the tree. Give the number of edges of any spanning tree, the minimum total weight, and the first five edges Kruskal adds in order (ties broken alphabetically; edge names like <code>AD</code>).</p>`, `<p>Đồ thị có trọng số trên A–G với các cạnh (trọng số): ${WG.e.map(([a, b, w]) => `${a}${b}(${w})`).join(', ')}. Kruskal: sắp cạnh theo trọng số và thêm cạnh nào không tạo chu trình. Prim từ A: liên tục thêm cạnh rẻ nhất rời khỏi cây. Cho số cạnh của mọi cây khung, tổng trọng số nhỏ nhất, và năm cạnh đầu Kruskal thêm theo thứ tự (hoà thì theo chữ cái; tên cạnh như <code>AD</code>).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Minimum spanning tree', 'Cây khung nhỏ nhất'], [{ ma: 'k', ten: 'Question' }, { ma: 'a', ten: 'Answer' }],
    [{ o: { k: 'Edges in a spanning tree' }, a: { a: String(WG.v.length - 1) } }, { o: { k: 'Minimum total weight' }, a: { a: String(KR.weight) } }, { o: { k: 'Kruskal: edge 1' }, a: { a: KR.picked[0][0] + KR.picked[0][1] } }, { o: { k: 'Kruskal: edge 2' }, a: { a: KR.picked[1][0] + KR.picked[1][1] } }, { o: { k: 'Kruskal: edge 3' }, a: { a: KR.picked[2][0] + KR.picked[2][1] } }, { o: { k: 'Kruskal: edge 4' }, a: { a: KR.picked[3][0] + KR.picked[3][1] } }, { o: { k: 'Kruskal: edge 5' }, a: { a: KR.picked[4][0] + KR.picked[4][1] } }, { o: { k: 'Prim from A: weight of the 3rd edge added' }, a: { a: String(PR.picked[2][2]) } }],
    [`Kruskal picks ${KR.picked.map((e) => `${e[0]}${e[1]}(${e[2]})`).join(', ')} = ${KR.weight}. Prim from A adds ${PR.picked.map((e) => `${e[0]}${e[1]}(${e[2]})`).join(', ')}.`, `Kruskal chọn ${KR.picked.map((e) => `${e[0]}${e[1]}(${e[2]})`).join(', ')} = ${KR.weight}.`])],
  goiY: ['Skip an edge when both ends are already in the same component.', 'Both algorithms give the same total weight (the tree may differ when weights tie).'],
  loiHayGap: ['Adding an edge that closes a cycle: after AB and BE, the edge BC(8) must be skipped because B and C are already joined through E.', 'Stopping before n − 1 edges are chosen.'],
  thuatNgu: [tn('Kruskal’s algorithm', 'thuật toán Kruskal'), tn('Prim’s algorithm', 'thuật toán Prim'), tn('minimum spanning tree', 'cây khung nhỏ nhất')],
  khaiNiem: ['MST'],
});

const T6 = tinh({
  tieuDe: 'Trees 6 — Order the algorithm steps',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Arrange the steps of the tree algorithms.</p>', '<p>Sắp các bước của thuật toán trên cây.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Kruskal’s algorithm.', 'Thuật toán Kruskal.'], ['Sort all edges by weight (ascending).', 'Start with every vertex in its own component and T = ∅.', 'Take the next edge; if its ends are in different components, add it to T and merge them.', 'Otherwise skip the edge (it would create a cycle).', 'Stop when T has n − 1 edges.'], ['The disjoint-set structure makes the cycle test almost constant time.', 'Cấu trúc tập rời làm phép kiểm chu trình gần như hằng.'], 2),
    ord('q2', ['Prim’s algorithm.', 'Thuật toán Prim.'], ['Start the tree with an arbitrary vertex.', 'Look at all edges with exactly one end in the tree.', 'Add the cheapest of them together with its new vertex.', 'Repeat until all vertices are in the tree.'], ['Prim grows one tree; Kruskal merges a forest.', 'Prim lớn dần một cây; Kruskal gộp một rừng.'], 1),
    ord('q3', ['Insert key 6 into a BST whose root is 8 (left child 3, right child 10).', 'Chèn khoá 6 vào BST có gốc 8 (con trái 3, con phải 10).'], ['Compare 6 with the root 8: 6 < 8, go left.', 'Compare 6 with 3: 6 ≥ 3, go right.', 'The right child of 3 is empty.', 'Create the new node 6 there.'], ['A new key always ends as a leaf.', 'Khoá mới luôn kết thúc ở vị trí lá.'], 1),
  ],
  goiY: ['Kruskal sorts first; Prim picks a start vertex first.', 'In a BST insertion you stop at the first empty position.'],
  loiHayGap: ['Starting Kruskal without sorting.', 'Placing a new BST key at the root.'],
  thuatNgu: [tn('disjoint set', 'tập rời nhau')],
  khaiNiem: ['MST algorithms', 'BST insertion'],
});

const HF = [{ a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 }, { a: 40, b: 20, c: 15, d: 15, e: 10 }, { a: 5, b: 9, c: 12, d: 13, e: 16, f: 45 }, { x: 1, y: 1, z: 2, w: 4 }];
const hfRow = (fr) => { const total = Object.values(fr).reduce((a, b) => a + b, 0); const h = S.huffman(fr); const k = Object.keys(fr).length; const bits = Math.ceil(Math.log2(k)); return { total, h, fixed: total * bits, avg: h.cost / total }; };
assert.equal(hfRow(HF[0]).h.cost, 224);
const T7 = tinh({
  tieuDe: 'Trees 7 — Huffman coding: how many bits?',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>Frequencies are counts of each symbol in a message. Build the Huffman tree (repeatedly merge the two smallest weights). The total length of the Huffman-coded message in bits is Σ frequency × code length — equal to the sum of all merged weights. A fixed-length code needs ⌈log₂ k⌉ bits per symbol for k symbols. Give both totals and the average Huffman bits per symbol (2 decimals).</p>', '<p>Tần số là số lần mỗi ký hiệu trong thông điệp. Dựng cây Huffman (liên tục gộp hai trọng số nhỏ nhất). Tổng độ dài thông điệp mã Huffman theo bit là Σ tần số × độ dài mã — bằng tổng các trọng số được gộp. Mã độ dài cố định cần ⌈log₂ k⌉ bit mỗi ký hiệu với k ký hiệu. Cho cả hai tổng và số bit Huffman trung bình mỗi ký hiệu (2 chữ số thập phân).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Huffman totals', 'Tổng Huffman'], [{ ma: 'f', ten: 'Frequencies' }, { ma: 'h', ten: 'Huffman bits' }, { ma: 'x', ten: 'Fixed-length bits' }, { ma: 'avg', ten: 'Avg bits/symbol' }],
    HF.map((fr) => { const r = hfRow(fr); return { o: { f: Object.entries(fr).map(([k, v]) => `${k}:${v}`).join('  ') }, a: { h: String(r.h.cost), x: String(r.fixed), avg: dec(r.avg) } }; }),
    [HF.map((fr) => { const r = hfRow(fr); return `${Object.entries(fr).map(([k, v]) => `${k}:${v}`).join(' ')}: Huffman ${r.h.cost} bits, fixed ${r.fixed}, avg ${r.avg.toFixed(2)}`; }).join('; ') + '.', HF.map((fr) => { const r = hfRow(fr); return `Huffman ${r.h.cost} bit, cố định ${r.fixed}, trung bình ${r.avg.toFixed(2)}`; }).join('; ') + '.'])],
  goiY: ['Keep a sorted list; replace the two smallest by their sum; the sum of all the sums you create is the total bit count.', 'Ties between equal weights change the tree but never the total cost.'],
  loiHayGap: ['Counting the number of merges instead of summing the merged weights.', 'Using ⌊log₂ k⌋ instead of ⌈log₂ k⌉ for the fixed-length code.'],
  thuatNgu: [tn('prefix code', 'mã tiền tố'), tn('Huffman coding', 'mã hoá Huffman')],
  khaiNiem: ['Huffman', 'prefix codes'],
});

function treeTraversals(values) {
  var root = null;
  values.forEach(function (v) {
    var node = { v: v, l: null, r: null };
    if (!root) { root = node; return; }
    var cur = root;
    for (;;) {
      if (v < cur.v) { if (!cur.l) { cur.l = node; break; } cur = cur.l; } else { if (!cur.r) { cur.r = node; break; } cur = cur.r; }
    }
  });
  var pre = [], inn = [], post = [];
  function go(n) { if (!n) return; pre.push(n.v); go(n.l); inn.push(n.v); go(n.r); post.push(n.v); }
  go(root);
  function h(n) { return n ? 1 + Math.max(h(n.l), h(n.r)) : -1; }
  return { pre: pre, inOrder: inn, post: post, height: h(root) };
}
const T8 = jsDe({
  tieuDe: 'Trees 8 — Build a BST and traverse it',
  doKho: 'MEDIUM', phut: 20,
  moTa: bi('<p>Write <code>treeTraversals(values)</code>. Insert the numbers one by one into an initially empty binary search tree (keys smaller than a node go left; equal or larger go right) and return <code>{ pre, inOrder, post, height }</code> where the three traversals are arrays of keys and <code>height</code> is the number of edges on the longest root-to-leaf path (−1 for the empty tree).</p>', '<p>Viết <code>treeTraversals(values)</code>. Chèn lần lượt các số vào cây tìm kiếm nhị phân ban đầu rỗng (khoá nhỏ hơn nút đi trái; bằng hoặc lớn hơn đi phải) và trả <code>{ pre, inOrder, post, height }</code> với ba phép duyệt là mảng khoá và <code>height</code> là số cạnh của đường dài nhất từ gốc tới lá (−1 cho cây rỗng).</p>'),
  yeuCau: [bi('Duplicates are inserted to the right.', 'Khoá trùng được chèn sang phải.')],
  viDu: [{ input: 'treeTraversals([5,3,8])', output: JSON.stringify(treeTraversals([5, 3, 8])), explanation: 'Root 5 with children 3 and 8.|||Gốc 5 với hai con 3 và 8.' }],
  goiY: ['Represent nodes as objects { v, l, r }; insertion is a loop or recursion.', 'A recursive helper that pushes into three arrays gives all traversals in one go (pre before, in between, post after the recursive calls).'],
  loiHayGap: ['Pushing the node value in the wrong place of the recursion.', 'Returning height in vertices (an empty tree is −1, a single node 0).'],
  giaiThich: '<p>The same recursion visits the root three times; where you record it decides the traversal.</p>',
  khaiNiem: ['BST', 'traversals'],
  fn: 'treeTraversals',
  dau: 'function treeTraversals(values) {\n  return { pre: [], inOrder: [], post: [], height: -1 };\n}\n',
  giaiMa: dat(treeTraversals, 'treeTraversals'),
  ref: treeTraversals,
  cases: [{ args: [[5, 3, 8]] }, { args: [[]] }, { args: [[8, 3, 10, 1, 6, 14, 4, 7, 13]] }, { args: [[1, 2, 3, 4, 5]], an: true }, { args: [[4, 4, 4]], an: true }, { args: [[10, 5, 15, 3, 7, 12, 20, 1]], an: true }],
});

function kruskalWeight(n, edges) {
  var parent = [], i;
  for (i = 0; i < n; i++) parent.push(i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  var sorted = edges.slice().sort(function (a, b) { return a[2] - b[2]; });
  var weight = 0, used = 0;
  sorted.forEach(function (e) {
    var a = find(e[0]), b = find(e[1]);
    if (a !== b) { parent[a] = b; weight += e[2]; used++; }
  });
  return { weight: weight, edgesUsed: used, spanning: used === n - 1 };
}
const T9 = jsDe({
  tieuDe: 'Trees 9 — Kruskal’s algorithm in code',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Write <code>kruskalWeight(n, edges)</code> for a weighted undirected graph on vertices 0…n−1 (<code>edges</code> are <code>[u, v, w]</code>, weights may repeat; loops and parallel edges are possible). Return <code>{ weight, edgesUsed, spanning }</code>: the total weight of the minimum spanning <em>forest</em> found by Kruskal, how many edges it uses, and whether those edges form a spanning tree (edgesUsed === n − 1). Use union–find for the cycle test.</p>', '<p>Viết <code>kruskalWeight(n, edges)</code> cho đồ thị vô hướng có trọng số trên các đỉnh 0…n−1 (<code>edges</code> là <code>[u, v, w]</code>, trọng số có thể trùng; có thể có khuyên và cạnh song song). Trả <code>{ weight, edgesUsed, spanning }</code>: tổng trọng số của <em>rừng</em> khung nhỏ nhất Kruskal tìm được, số cạnh dùng, và các cạnh đó có tạo thành cây khung không (edgesUsed === n − 1). Dùng union–find để kiểm chu trình.</p>'),
  yeuCau: [bi('A disconnected graph gives spanning = false.', 'Đồ thị không liên thông cho spanning = false.')],
  viDu: [{ input: 'kruskalWeight(4, [[0,1,1],[1,2,2],[2,3,3],[3,0,4],[0,2,5]])', output: JSON.stringify(kruskalWeight(4, [[0, 1, 1], [1, 2, 2], [2, 3, 3], [3, 0, 4], [0, 2, 5]])), explanation: 'Edges 1, 2, 3 form a spanning tree; the rest close cycles.|||Các cạnh 1, 2, 3 tạo cây khung; còn lại đóng chu trình.' }],
  goiY: ['Sort a copy of the edge list by weight (numeric comparator).', 'Union the two roots when they differ; skip loops automatically (same root).'],
  loiHayGap: ['Sorting the original input array (mutating the caller’s data).', 'Comparing find(u) with v instead of find(v).'],
  giaiThich: '<p>The cut property: the lightest edge crossing any cut belongs to some MST, so the greedy choice is safe.</p>',
  khaiNiem: ['Kruskal', 'union–find'],
  fn: 'kruskalWeight',
  dau: 'function kruskalWeight(n, edges) {\n  return { weight: 0, edgesUsed: 0, spanning: false };\n}\n',
  giaiMa: dat(kruskalWeight, 'kruskalWeight'),
  ref: kruskalWeight,
  cases: [{ args: [4, [[0, 1, 1], [1, 2, 2], [2, 3, 3], [3, 0, 4], [0, 2, 5]]] }, { args: [3, [[0, 1, 5]]] }, { args: [1, []] }, { args: [7, [[0, 1, 7], [0, 3, 5], [1, 2, 8], [1, 3, 9], [1, 4, 7], [2, 4, 5], [3, 4, 15], [3, 5, 6], [4, 5, 8], [4, 6, 9], [5, 6, 11]]], an: true }, { args: [4, [[0, 0, 1], [0, 1, 2], [0, 1, 1], [2, 3, 4]]], an: true }, { args: [5, [[0, 1, 2], [2, 3, 2], [1, 2, 2], [3, 4, 2], [0, 4, 2]]], an: true }],
});
void mcNum; void f2;

export default doiDau({
  slug: 'mad101-8-1-cay',
  ten: '8.1 Trees & spanning trees',
  khoa: KHOA,
  baiHoc: 'mad101-8-1-cay',
  de: [T1, T2, T3, T4, T5, T6, T7, T8, T9],
});
