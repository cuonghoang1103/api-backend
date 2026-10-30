/** MAD101 · Lab ch.8 — Trees in code: tree test, height from parents, Prim, Huffman cost, postfix evaluation, counting trees. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);

function isTree(n, edges) {
  if (n === 0) return false;
  if (edges.length !== n - 1) return false;
  var parent = [], i;
  for (i = 0; i < n; i++) parent.push(i);
  function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
  for (i = 0; i < edges.length; i++) {
    var a = find(edges[i][0]), b = find(edges[i][1]);
    if (a === b) return false;
    parent[a] = b;
  }
  return true;
}
const L1 = jsDe({
  tieuDe: 'Tree lab 1 — Is this graph a tree?',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>Write <code>isTree(n, edges)</code> for an undirected graph on vertices 0…n−1. A tree is connected and acyclic; equivalently it has exactly n − 1 edges and no cycle. Return a boolean (n = 0 is not a tree). Loops and repeated edges count as cycles.</p>', '<p>Viết <code>isTree(n, edges)</code> cho đồ thị vô hướng trên các đỉnh 0…n−1. Cây liên thông và không có chu trình; tương đương có đúng n − 1 cạnh và không có chu trình. Trả boolean (n = 0 không là cây). Khuyên và cạnh lặp được coi là chu trình.</p>'),
  yeuCau: [bi('Check the edge count first, then detect cycles with union–find.', 'Kiểm số cạnh trước, rồi phát hiện chu trình bằng union–find.')],
  viDu: [{ input: 'isTree(4, [[0,1],[1,2],[1,3]])', output: 'true', explanation: 'A star: 3 edges, no cycle.|||Hình sao: 3 cạnh, không chu trình.' }, { input: 'isTree(4, [[0,1],[1,2],[2,0]])', output: 'false', explanation: 'A triangle plus an isolated vertex: vertex 3 is disconnected.|||Tam giác cộng đỉnh cô lập: đỉnh 3 không liên thông.' }],
  goiY: ['n − 1 edges and no cycle together imply connected.', 'When union finds both ends already joined, a cycle exists.'],
  loiHayGap: ['Checking only the edge count.', 'Checking only for cycles (a forest with fewer than n − 1 edges is not a tree).'],
  giaiThich: '<p>For n vertices, any two of {connected, acyclic, n − 1 edges} imply the third.</p>',
  khaiNiem: ['tree characterisation'],
  fn: 'isTree',
  dau: 'function isTree(n, edges) {\n  return false;\n}\n',
  giaiMa: dat(isTree, 'isTree'),
  ref: isTree,
  cases: [{ args: [4, [[0, 1], [1, 2], [1, 3]]] }, { args: [4, [[0, 1], [1, 2], [2, 0]]] }, { args: [1, []] }, { args: [0, []] }, { args: [5, [[0, 1], [2, 3], [3, 4], [4, 2]]], an: true }, { args: [3, [[0, 1], [0, 1]]], an: true }, { args: [6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]], an: true }],
});

function treeStats(parent) {
  var n = parent.length, depth = [], root = -1, i, hasChild = [];
  for (i = 0; i < n; i++) { depth.push(-1); hasChild.push(false); }
  for (i = 0; i < n; i++) { if (parent[i] === -1) root = i; else hasChild[parent[i]] = true; }
  function d(v) { if (depth[v] !== -1) return depth[v]; depth[v] = parent[v] === -1 ? 0 : d(parent[v]) + 1; return depth[v]; }
  var height = 0, leaves = 0;
  for (i = 0; i < n; i++) { if (d(i) > height) height = d(i); if (!hasChild[i]) leaves++; }
  return { root: root, height: height, leaves: leaves };
}
const L2 = jsDe({
  tieuDe: 'Tree lab 2 — Root, height and leaves from a parent array',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>A rooted tree on vertices 0…n−1 is stored as <code>parent</code>, where <code>parent[v]</code> is the parent of v and the root has parent −1. Write <code>treeStats(parent)</code> returning <code>{ root, height, leaves }</code>: the root index, the height (edges on the longest root-to-leaf path) and the number of leaves (vertices with no child). A single vertex has height 0 and counts as a leaf.</p>', '<p>Cây có gốc trên các đỉnh 0…n−1 lưu bằng <code>parent</code>, trong đó <code>parent[v]</code> là cha của v và gốc có cha −1. Viết <code>treeStats(parent)</code> trả <code>{ root, height, leaves }</code>: chỉ số gốc, chiều cao (số cạnh của đường dài nhất từ gốc tới lá) và số lá (đỉnh không có con). Một đỉnh đơn có chiều cao 0 và tính là lá.</p>'),
  yeuCau: [bi('Parents may appear after their children in the array (not sorted by depth).', 'Cha có thể đứng sau con trong mảng (không sắp theo độ sâu).')],
  viDu: [{ input: 'treeStats([-1,0,0,1,1])', output: JSON.stringify(treeStats([-1, 0, 0, 1, 1])), explanation: 'Root 0; children 1, 2; vertex 1 has children 3, 4.|||Gốc 0; con 1, 2; đỉnh 1 có con 3, 4.' }],
  goiY: ['Mark vertices that appear as somebody’s parent: the others are leaves.', 'Compute depth with memoised recursion up the parent chain.'],
  loiHayGap: ['Assuming parent[v] < v.', 'Counting the root as a leaf when it has children.'],
  giaiThich: '<p>Depth(v) = depth(parent) + 1; the height is the maximum depth over all vertices.</p>',
  khaiNiem: ['rooted trees', 'height'],
  fn: 'treeStats',
  dau: 'function treeStats(parent) {\n  return { root: -1, height: 0, leaves: 0 };\n}\n',
  giaiMa: dat(treeStats, 'treeStats'),
  ref: treeStats,
  cases: [{ args: [[-1, 0, 0, 1, 1]] }, { args: [[-1]] }, { args: [[2, 2, -1, 0, 3]] }, { args: [[3, 3, 3, -1, 0, 1]], an: true }, { args: [[-1, 0, 1, 2, 3, 4, 5, 6]], an: true }],
});

function primWeight(n, edges) {
  if (n <= 1) return 0;
  var inTree = [], i, total = 0, count = 1;
  for (i = 0; i < n; i++) inTree.push(false);
  inTree[0] = true;
  while (count < n) {
    var best = null;
    edges.forEach(function (e) {
      if (inTree[e[0]] !== inTree[e[1]] && (best === null || e[2] < best[2])) best = e;
    });
    if (best === null) return -1;
    inTree[best[0]] = true; inTree[best[1]] = true;
    total += best[2]; count++;
  }
  return total;
}
const L3 = jsDe({
  tieuDe: 'Tree lab 3 — Prim’s algorithm',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Write <code>primWeight(n, edges)</code> returning the total weight of a minimum spanning tree of the connected weighted graph on vertices 0…n−1, grown from vertex 0 (<code>edges</code> are <code>[u, v, w]</code>). Return −1 when the graph is not connected, and 0 when n ≤ 1. An O(V·E) implementation (rescan all edges each round) is acceptable.</p>', '<p>Viết <code>primWeight(n, edges)</code> trả tổng trọng số cây khung nhỏ nhất của đồ thị có trọng số liên thông trên các đỉnh 0…n−1, mọc từ đỉnh 0 (<code>edges</code> là <code>[u, v, w]</code>). Trả −1 khi đồ thị không liên thông, trả 0 khi n ≤ 1. Cài O(V·E) (quét lại mọi cạnh mỗi vòng) là chấp nhận được.</p>'),
  yeuCau: [bi('Only edges with exactly one endpoint in the tree are candidates.', 'Chỉ các cạnh có đúng một đầu trong cây là ứng viên.')],
  viDu: [{ input: 'primWeight(4, [[0,1,1],[1,2,2],[2,3,3],[3,0,4],[0,2,5]])', output: '6', explanation: 'Edges 1 + 2 + 3.|||Các cạnh 1 + 2 + 3.' }],
  goiY: ['Maintain inTree[]; each round choose the cheapest crossing edge.', 'If no crossing edge exists while vertices remain, the graph is disconnected.'],
  loiHayGap: ['Choosing the cheapest edge overall (it may be inside the tree).', 'Forgetting to return −1 for disconnected graphs.'],
  giaiThich: '<p>Cut property again: the cheapest edge between the tree and the rest is always safe.</p>',
  khaiNiem: ['Prim', 'greedy'],
  fn: 'primWeight',
  dau: 'function primWeight(n, edges) {\n  return 0;\n}\n',
  giaiMa: dat(primWeight, 'primWeight'),
  ref: primWeight,
  cases: [{ args: [4, [[0, 1, 1], [1, 2, 2], [2, 3, 3], [3, 0, 4], [0, 2, 5]]] }, { args: [1, []] }, { args: [3, [[0, 1, 4]]] }, { args: [7, [[0, 1, 7], [0, 3, 5], [1, 2, 8], [1, 3, 9], [1, 4, 7], [2, 4, 5], [3, 4, 15], [3, 5, 6], [4, 5, 8], [4, 6, 9], [5, 6, 11]]], an: true }, { args: [5, [[0, 1, 3], [1, 2, 3], [2, 3, 3], [3, 4, 3], [0, 4, 1]]], an: true }],
});

function huffmanCost(freqs) {
  var w = freqs.slice().sort(function (a, b) { return a - b; }), total = 0;
  if (w.length < 2) return 0;
  while (w.length > 1) {
    var a = w.shift(), b = w.shift(), s = a + b;
    total += s;
    var i = 0;
    while (i < w.length && w[i] < s) i++;
    w.splice(i, 0, s);
  }
  return total;
}
const L4 = jsDe({
  tieuDe: 'Tree lab 4 — Total cost of a Huffman code',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>huffmanCost(freqs)</code> for an array of positive symbol frequencies, returning the total number of bits Σ f<sub>i</sub>·len<sub>i</sub> of an optimal prefix code. Repeatedly remove the two smallest weights, add their sum to the total, and insert the sum back. With zero or one symbol the cost is 0.</p>', '<p>Viết <code>huffmanCost(freqs)</code> cho mảng tần số ký hiệu dương, trả tổng số bit Σ f<sub>i</sub>·len<sub>i</sub> của mã tiền tố tối ưu. Liên tục lấy hai trọng số nhỏ nhất, cộng tổng của chúng vào kết quả và đưa tổng đó trở lại. Với 0 hoặc 1 ký hiệu thì chi phí là 0.</p>'),
  yeuCau: [bi('Do not mutate the input array.', 'Không sửa mảng đầu vào.')],
  viDu: [{ input: 'huffmanCost([45,13,12,16,9,5])', output: String(huffmanCost([45, 13, 12, 16, 9, 5])), explanation: 'The textbook example: 224 bits.|||Ví dụ giáo trình: 224 bit.' }, { input: 'huffmanCost([1,1,2,4])', output: String(huffmanCost([1, 1, 2, 4])), explanation: 'Merges: 2, 4, 8 ⇒ 14.|||Các lần gộp: 2, 4, 8 ⇒ 14.' }],
  goiY: ['The sum of the merged weights equals Σ f·depth: each merge adds one bit to every symbol beneath it.', 'A sorted array plus splice is enough for small inputs.'],
  loiHayGap: ['Sorting with the default (string) comparator.', 'Forgetting to put the merged weight back.'],
  giaiThich: '<p>Greedy merging of the two rarest symbols is optimal (Huffman’s theorem); the cost equals the weighted external path length.</p>',
  khaiNiem: ['Huffman', 'greedy'],
  fn: 'huffmanCost',
  dau: 'function huffmanCost(freqs) {\n  return 0;\n}\n',
  giaiMa: dat(huffmanCost, 'huffmanCost'),
  ref: huffmanCost,
  cases: [{ args: [[45, 13, 12, 16, 9, 5]] }, { args: [[1, 1, 2, 4]] }, { args: [[5]] }, { args: [[]] }, { args: [[3, 3, 3, 3]], an: true }, { args: [[10, 1, 1, 1, 1, 100, 7]], an: true }],
});
assert.equal(huffmanCost([45, 13, 12, 16, 9, 5]), S.huffman({ a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 }).cost);

function evalPostfix(tokens) {
  var st = [];
  tokens.forEach(function (t) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      var b = st.pop(), a = st.pop();
      st.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : a / b);
    } else st.push(Number(t));
  });
  return st.pop();
}
const L5 = jsDe({
  tieuDe: 'Tree lab 5 — Evaluate a postfix expression with a stack',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Write <code>evalPostfix(tokens)</code> for a valid postfix (reverse Polish) expression given as an array of strings: numbers and the operators <code>+ - * /</code>. Push numbers on a stack; on an operator pop the <em>right</em> operand first, then the left one, apply the operator and push the result. Return the single value left on the stack. Division is ordinary floating-point division.</p>', '<p>Viết <code>evalPostfix(tokens)</code> cho biểu thức hậu tố (Ba Lan đảo) hợp lệ là mảng chuỗi: số và các toán tử <code>+ - * /</code>. Đẩy số vào ngăn xếp; gặp toán tử thì lấy toán hạng <em>phải</em> trước rồi đến toán hạng trái, áp toán tử và đẩy kết quả. Trả giá trị duy nhất còn lại. Phép chia là chia dấu phẩy động thông thường.</p>'),
  yeuCau: [bi('Tokens like "12" or "-3" are numbers; use Number(token).', 'Token như "12" hoặc "-3" là số; dùng Number(token).')],
  viDu: [{ input: 'evalPostfix(["2","3","*","8","4","-","+"])', output: '10', explanation: '(2·3) + (8 − 4).|||(2·3) + (8 − 4).' }],
  goiY: ['The top of the stack is the right operand.', 'A negative number token "-3" has length 2; test the operator by equality, not by the first character.'],
  loiHayGap: ['Swapping the operands of − and /.', 'Treating "-3" as an operator because it starts with "-".'],
  giaiThich: '<p>Postfix is the post-order traversal of the expression tree; the stack mimics the recursion.</p>',
  khaiNiem: ['expression trees', 'stack'],
  fn: 'evalPostfix',
  dau: 'function evalPostfix(tokens) {\n  return 0;\n}\n',
  giaiMa: dat(evalPostfix, 'evalPostfix'),
  ref: evalPostfix,
  cases: [{ args: [['2', '3', '*', '8', '4', '-', '+']] }, { args: [['5']] }, { args: [['9', '3', '/', '2', '-']] }, { args: [['-3', '4', '+']], an: true }, { args: [['1', '2', '3', '4', '*', '+', '-']], an: true }, { args: [['10', '4', '-', '3', '2', '*', '/']], an: true }],
});

const SN = [3, 4, 5, 6, 7, 8, 9, 10];
const lb = (n) => Math.ceil(Math.log2(S.factorial(n)));
const L6 = tinh({
  tieuDe: 'Tree lab 6 — Decision trees and the sorting lower bound',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A comparison sort is a binary decision tree with at least n! leaves, so its height is at least ⌈log₂ n!⌉. Compute n!, that bound, and the comparisons n·⌈log₂ n⌉ − 2^⌈log₂ n⌉ + 1 used by binary insertion sort, for comparison.</p>', '<p>Sắp xếp so sánh là cây quyết định nhị phân có ít nhất n! lá nên chiều cao ít nhất ⌈log₂ n!⌉. Tính n!, cận đó, và số so sánh n·⌈log₂ n⌉ − 2^⌈log₂ n⌉ + 1 của sắp xếp chèn nhị phân để đối chiếu.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Lower bound for comparison sorts', 'Cận dưới cho sắp xếp so sánh'], [{ ma: 'n', ten: 'n' }, { ma: 'f', ten: 'n!' }, { ma: 'l', ten: '⌈log₂ n!⌉' }, { ma: 'm', ten: 'n·⌈log₂ n⌉ − 2^⌈log₂ n⌉ + 1' }],
    SN.map((n) => { const c = Math.ceil(Math.log2(n)); return { o: { n: String(n) }, a: { f: String(S.factorial(n)), l: String(lb(n)), m: String(n * c - 2 ** c + 1) } }; }),
    [SN.map((n) => { const c = Math.ceil(Math.log2(n)); return `n=${n}: n!=${S.factorial(n)}, bound ${lb(n)}, binary insertion ${n * c - 2 ** c + 1}`; }).join('; ') + '. The two columns are close for small n, and the bound is Θ(n log n).', SN.map((n) => { const c = Math.ceil(Math.log2(n)); return `n=${n}: ${S.factorial(n)}, ${lb(n)}, ${n * c - 2 ** c + 1}`; }).join('; ') + '.'])],
  goiY: ['⌈log₂ x⌉ is the number of bits needed to write x − 1 in binary… or simply find the smallest k with 2ᵏ ≥ x.', 'For n! compute successive products.'],
  loiHayGap: ['Using log₂ n instead of log₂ n! for the bound.', 'Rounding down instead of up.'],
  thuatNgu: [tn('decision tree', 'cây quyết định')],
  khaiNiem: ['decision trees', 'lower bounds'],
});
assert.equal(lb(4), 5); assert.equal(lb(5), 7); assert.equal(lb(10), 22);

const L7 = tinh({
  tieuDe: 'Tree lab 7 — Counting trees',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Classic counts: labelled trees (Cayley), binary tree shapes (Catalan), and edges of spanning forests.</p>', '<p>Các phép đếm kinh điển: cây có nhãn (Cayley), hình dạng cây nhị phân (Catalan) và số cạnh rừng khung.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['How many different labelled trees exist on 6 labelled vertices (Cayley: nⁿ⁻²)?', 'Có bao nhiêu cây có nhãn khác nhau trên 6 đỉnh có nhãn (Cayley: nⁿ⁻²)?'], 6 ** 4, [6 ** 6, 6 * 5, 2 ** 6], f2, ['6⁴ = 1296.', '6⁴ = 1296.']),
    mcNum('c2', ['How many different shapes of binary search trees can be built from 5 distinct keys (all insertion orders considered)?', 'Có bao nhiêu hình dạng cây tìm kiếm nhị phân khác nhau từ 5 khoá phân biệt (xét mọi thứ tự chèn)?'], S.catalan(5), [S.factorial(5), 2 ** 5, 14], f2, ['The Catalan number C₅ = 42 (choose the root, then multiply the counts for the two subtrees).', 'Số Catalan C₅ = 42 (chọn gốc rồi nhân số cách của hai cây con).']),
    mcNum('c3', ['A forest has 20 vertices and 4 trees. How many edges does it have?', 'Một rừng có 20 đỉnh và 4 cây. Rừng có bao nhiêu cạnh?'], 16, [19, 20, 24], f2, ['Each tree has (vertices − 1) edges: 20 − 4 = 16.', 'Mỗi cây có (số đỉnh − 1) cạnh: 20 − 4 = 16.']),
    mcNum('c4', ['A full binary tree has 31 vertices. How many leaves does it have?', 'Cây nhị phân đầy đủ có 31 đỉnh. Có bao nhiêu lá?'], 16, [15, 31, 8], f2, ['n = 2i + 1 ⇒ i = 15 internal, l = i + 1 = 16.', 'n = 2i + 1 ⇒ i = 15 đỉnh trong, l = i + 1 = 16.']),
    mcNum('c5', ['What is the maximum number of vertices of a binary tree of height 5?', 'Số đỉnh tối đa của cây nhị phân chiều cao 5 là?'], 2 ** 6 - 1, [2 ** 5, 2 ** 5 - 1, 5 * 2], f2, ['1 + 2 + 4 + 8 + 16 + 32 = 63 = 2⁶ − 1.', '1 + 2 + 4 + 8 + 16 + 32 = 63.']),
    q('c6', ['Every tree with at least two vertices has …', 'Mọi cây có ít nhất hai đỉnh có …'], ['at least two leaves', 'exactly one leaf', 'a cycle of length 3', 'no leaves at all'], ['Take a longest path: both its ends have degree 1.', 'Lấy đường đi dài nhất: hai đầu của nó có bậc 1.']),
  ],
  goiY: ['Cayley: nⁿ⁻² labelled trees; Catalan for unlabelled binary shapes.', 'Forest: edges = vertices − number of trees.'],
  loiHayGap: ['Using nⁿ instead of nⁿ⁻².', 'Counting 2ʰ instead of 2^(h+1) − 1 vertices.'],
  thuatNgu: [tn('Cayley’s formula', 'công thức Cayley'), tn('forest', 'rừng')],
  khaiNiem: ['counting trees'],
});

export default doiDau({
  slug: 'mad101-8-lab-spanning-trees-and-codes',
  ten: '8.L Lab: trees in code',
  khoa: KHOA,
  baiHoc: 'mad101-8-1-cay',
  de: [L1, L2, L3, L4, L5, L6, L7],
});
