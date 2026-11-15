/** Coding Interview Prep · 5.1 — Duyệt cây: BFS theo tầng (chụp kích thước tầng), BFS mang theo cha, BFS mang theo cột. Đề tự soạn. */
import { mod, bai, tn, nguon, boc } from './_dsa.mjs';

/** Ca kiểm trên cây: T('f', [mảng theo tầng], ...tham số khác) ⇒ { goi (dựng nút thật), hien (chữ cho người học) } */
const T = (fn, arr, ...rest) => {
  const a = typeof arr === 'string' ? arr : JSON.stringify(arr);
  const r = rest.map((x) => `, ${JSON.stringify(x)}`).join('');
  return { goi: boc(`${fn}(__cay(${a})${r})`), hien: `${fn}(${typeof arr === 'string' ? '<chain of 1000 nodes>' : a}${r})` };
};
/** Chuỗi lệch phải 1000 nút (độ sâu 1000): [v0, null, v1, null, v2, …] */
const XICH = (n, f = 'i') => `(function () { var a = [0]; for (var i = 1; i < ${n}; i++) a.push(null, ${f}); return a; })()`;

/* ── 1. BFS theo tầng: tổng ngân sách mỗi cấp quản lý ── */
function levelSums(root) {
  var out = [];
  if (root === null) return out;
  var queue = [root], head = 0; // an array + a moving head index: O(1) "dequeue" without shift()
  while (head < queue.length) {
    var size = queue.length - head; // SNAPSHOT the level size before adding children
    var sum = 0;
    for (var i = 0; i < size; i++) {
      var node = queue[head++];
      sum += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    out.push(sum);
  }
  return out;
}
const D1 = bai({
  ten: 'Org chart budget: total salary per management level', kho: 'EASY', phut: 10,
  en: `<p>The HR team of a software company stores its org chart as a binary tree: every node is an employee and <code>node.val</code> is their monthly salary (million VND); the CEO is the root, each manager has at most two direct reports (<code>left</code>, <code>right</code>).</p>
<p>Write <code>levelSums(root)</code> returning an array whose element <code>d</code> is the total salary of everyone at depth <code>d</code> (the CEO is depth 0). An empty company (<code>root === null</code>) gives <code>[]</code>.</p>
<p>Tests describe trees in LeetCode level-order form, e.g. <code>[30, 20, 25, null, 12]</code>; the grader builds real nodes <code>{ val, left, right }</code> before calling you.</p>`,
  vi: `<p>Phòng nhân sự của một công ty phần mềm lưu sơ đồ tổ chức dạng cây nhị phân: mỗi nút là một nhân viên, <code>node.val</code> là lương tháng (triệu đồng); giám đốc là gốc, mỗi quản lý có tối đa hai cấp dưới trực tiếp (<code>left</code>, <code>right</code>).</p>
<p>Viết <code>levelSums(root)</code> trả về mảng mà phần tử thứ <code>d</code> là tổng lương của mọi người ở độ sâu <code>d</code> (giám đốc ở độ sâu 0). Công ty rỗng (<code>root === null</code>) cho <code>[]</code>.</p>
<p>Ca kiểm mô tả cây theo dạng mảng theo tầng của LeetCode, vd <code>[30, 20, 25, null, 12]</code>; máy chấm dựng nút thật <code>{ val, left, right }</code> rồi mới gọi hàm của bạn.</p>`,
  dauVao: ['root — a tree node { val, left, right } or null.', 'root — nút cây { val, left, right } hoặc null.'],
  dauRa: ['number[] — one total per depth, from the root down.', 'number[] — mỗi độ sâu một tổng, từ gốc xuống.'],
  rangBuoc: [['0 ≤ number of nodes ≤ 10⁵; depth up to 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu tới 1000.']],
  goiY: [
    ['"Per depth" is the signal for BFS by level (breadth-first search — duyệt theo chiều rộng): process the tree one level at a time.', '"Theo từng độ sâu" là tín hiệu của BFS theo tầng (breadth-first search — duyệt theo chiều rộng): xử lý cây từng tầng một.'],
    ['At the start of each round, the queue holds exactly one level. Read its size ONCE into a variable, pop that many nodes, push their children.', 'Đầu mỗi vòng, hàng đợi chứa đúng một tầng. Đọc kích thước MỘT lần vào biến, lấy ra đúng ngần ấy nút, đẩy con của chúng vào.'],
  ],
  loi: [
    ['Looping <code>for (i = 0; i &lt; queue.length; i++)</code> while pushing children into the same queue: the loop swallows the next levels and you get one big sum.', 'Viết <code>for (i = 0; i &lt; queue.length; i++)</code> trong khi đẩy con vào cùng hàng đợi: vòng lặp nuốt luôn các tầng sau và ra một tổng to duy nhất.'],
    ['Forgetting <code>root === null</code> ⇒ <code>TypeError: Cannot read properties of null</code>.', 'Quên <code>root === null</code> ⇒ <code>TypeError: Cannot read properties of null</code>.'],
  ],
  gt: ['The level-size snapshot is the whole trick: when a round starts the queue contains exactly the nodes of depth d (and nothing else), so popping <code>size</code> nodes visits that level and leaves exactly depth d+1 behind. Every node is pushed and popped once ⇒ O(n) time; the queue holds at most one or two levels ⇒ O(w) extra memory, w = widest level. Using a head index instead of <code>shift()</code> keeps each dequeue O(1).', 'Chụp kích thước tầng là toàn bộ mẹo: lúc một vòng bắt đầu, hàng đợi chứa đúng các nút độ sâu d (và không gì khác), nên lấy ra <code>size</code> nút là đi hết tầng đó và để lại đúng tầng d+1. Mỗi nút vào và ra hàng đợi một lần ⇒ O(n) thời gian; hàng đợi giữ tối đa một–hai tầng ⇒ O(w) bộ nhớ phụ, w = tầng rộng nhất. Dùng chỉ số đầu thay cho <code>shift()</code> giữ mỗi lần lấy ra là O(1).'],
  kn: ['BFS', 'level order'],
  tns: [tn('breadth-first search (BFS)', 'duyệt theo chiều rộng'), tn('level', 'tầng', 'các nút cùng độ sâu.'), tn('queue', 'hàng đợi'), tn('snapshot', 'chụp lại giá trị tại một thời điểm')],
  dau: `/**
 * root: { val, left, right } | null — org chart, val = salary
 * returns the total salary at each depth, root first
 */
function levelSums(root) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — BFS, snapshot the level size before adding children.\n' + nguon(levelSums),
  cases: [
    { ...T('levelSums', [30, 20, 25, null, 12]), moTa: ['CEO 30, two managers, one engineer', 'Giám đốc 30, hai quản lý, một kỹ sư'] },
    { ...T('levelSums', [1, 2, 3, 4, 5, null, 6]) },
    { ...T('levelSums', []), moTa: ['Empty company ⇒ []', 'Công ty rỗng ⇒ []'] },
    { ...T('levelSums', [7]), an: true },
    { ...T('levelSums', [5, 4, null, 3, null, 2, null, 1]), an: true, moTa: ['A left-leaning chain', 'Một chuỗi lệch trái'] },
    { ...T('levelSums', [10, -3, 3, 1, null, null, -1, 8, 9]), an: true, moTa: ['Negative values (salary adjustments)', 'Giá trị âm (điều chỉnh lương)'] },
    { ...T('levelSums', XICH(1000)), an: true, moTa: ['Depth 1000 chain', 'Chuỗi sâu 1000'] },
  ],
  saiMau: [
    { ten: ['Reads queue.length inside the loop (levels merge)', 'Đọc queue.length trong vòng lặp (các tầng dính nhau)'], ma: 'function levelSums(root) {\n  if (!root) return [];\n  var out = [], q = [root];\n  while (q.length) {\n    var s = 0;\n    for (var i = 0; i < q.length; i++) { var n = q[i]; s += n.val; if (n.left) q.push(n.left); if (n.right) q.push(n.right); }\n    q = q.slice(q.length);\n    out.push(s);\n  }\n  return out;\n}\n' },
  ],
});

/* ── 2. BFS mang theo cha: bạn cùng khoá, khác người hướng dẫn ── */
function cohortPeers(root, x) {
  if (root === null) return [];
  var level = [{ node: root, parent: null }];
  while (level.length) {
    var target = null;
    for (var i = 0; i < level.length; i++) if (level[i].node.val === x) target = level[i];
    if (target) {
      // same depth, different parent (siblings share the mentor, so they are not "peers" here)
      return level.filter(function (e) { return e !== target && e.parent !== target.parent; }).map(function (e) { return e.node.val; });
    }
    var next = [];
    for (var j = 0; j < level.length; j++) {
      var n = level[j].node;
      if (n.left) next.push({ node: n.left, parent: n });
      if (n.right) next.push({ node: n.right, parent: n });
    }
    level = next;
  }
  return []; // x is not in the tree
}
const D2 = bai({
  ten: 'Mentoring tree: same-cohort peers with a different mentor', kho: 'MEDIUM', phut: 20,
  en: `<p>In the FPTU buddy programme every student mentors at most two juniors, forming a binary tree (student codes as numbers, all distinct). Students at the same depth joined in the same cohort. For a study group, the coordinator wants for student <code>x</code> the list of <b>cohort peers who have a different mentor</b> than <code>x</code> — siblings (same mentor) already meet each other.</p>
<p>Write <code>cohortPeers(root, x)</code>: the values at the same depth as <code>x</code>, excluding <code>x</code> and its sibling, from left to right. If <code>x</code> is the root or is not in the tree, return <code>[]</code>.</p>`,
  vi: `<p>Trong chương trình buddy của FPTU, mỗi sinh viên kèm tối đa hai đàn em, tạo thành một cây nhị phân (mã sinh viên là số, đôi một khác nhau). Sinh viên cùng độ sâu là cùng một khoá. Để lập nhóm học, điều phối viên muốn biết với sinh viên <code>x</code> danh sách <b>bạn cùng khoá có người kèm khác</b> với <code>x</code> — anh em ruột (cùng người kèm) thì vốn đã gặp nhau.</p>
<p>Viết <code>cohortPeers(root, x)</code>: các giá trị cùng độ sâu với <code>x</code>, bỏ <code>x</code> và anh em của nó, từ trái sang phải. Nếu <code>x</code> là gốc hoặc không có trong cây, trả <code>[]</code>.</p>`,
  dauVao: ['root — tree node or null; x — a number.', 'root — nút cây hoặc null; x — một số.'],
  dauRa: ['number[] — peers left to right.', 'number[] — các bạn cùng khoá từ trái sang phải.'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵, values distinct; depth up to 1000.', '0 ≤ số nút ≤ 10⁵, giá trị đôi một khác nhau; độ sâu tới 1000.']],
  goiY: [
    ['Same depth ⇒ BFS by level. You need one extra piece of information per node in the queue: who its parent is.', 'Cùng độ sâu ⇒ BFS theo tầng. Mỗi phần tử trong hàng đợi cần mang thêm một thông tin: cha của nó là ai.'],
    ['Store pairs <code>{ node, parent }</code>. When the level containing x is reached, keep the entries whose parent is not x\'s parent — and stop, deeper levels are irrelevant.', 'Lưu cặp <code>{ node, parent }</code>. Khi tới tầng có x, giữ các phần tử có cha khác cha của x — rồi dừng, các tầng sâu hơn không liên quan.'],
  ],
  loi: [
    ['Excluding only x and forgetting the sibling: the sibling has the same depth but the same mentor.', 'Chỉ bỏ x mà quên anh em: anh em cùng độ sâu nhưng cùng người kèm.'],
    ['Comparing parents by value without handling the root: the root has no parent, so <code>parent.val</code> crashes on <code>cohortPeers(root, root.val)</code>.', 'So cha bằng giá trị mà không xử lý gốc: gốc không có cha, nên <code>parent.val</code> sập khi gọi <code>cohortPeers(root, root.val)</code>.'],
    ['Returning the moment x is popped from the queue: the peers to the RIGHT of x on that level have not been looked at yet — finish the whole level first.', 'Trả về ngay lúc lấy x ra khỏi hàng đợi: các bạn bên PHẢI x trong tầng đó chưa được xét — phải đi hết cả tầng trước.'],
  ],
  gt: ['BFS hands us the tree one level at a time, already ordered left to right, so "the nodes at x\'s depth" is simply the level in which x appears. Carrying the parent pointer with each queue entry turns "different mentor" into a reference comparison (<code>e.parent !== target.parent</code>), which also works for the root (parent <code>null</code>, the level contains only the root ⇒ empty answer). We stop at x\'s level, so the work is O(n) in the worst case and O(w) memory.', 'BFS đưa cây cho ta từng tầng một, đã theo thứ tự trái → phải, nên "các nút cùng độ sâu với x" chính là tầng có x. Mang theo con trỏ cha trong mỗi phần tử hàng đợi biến "khác người kèm" thành phép so tham chiếu (<code>e.parent !== target.parent</code>), đúng cả với gốc (cha <code>null</code>, tầng chỉ có gốc ⇒ đáp án rỗng). Dừng ngay ở tầng của x, nên tệ nhất O(n) thời gian và O(w) bộ nhớ.'],
  kn: ['BFS', 'parent tracking'],
  tns: [tn('sibling', 'anh em (cùng cha)'), tn('cousin', 'anh em họ (cùng tầng, khác cha)'), tn('reference equality', 'so sánh tham chiếu', 'hai biến trỏ cùng một đối tượng.')],
  dau: `/**
 * root: { val, left, right } | null, x: number
 * returns values at x's depth with a different parent than x, left to right
 */
function cohortPeers(root, x) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — BFS level by level, each entry carries its parent.\n' + nguon(cohortPeers),
  cases: [
    { ...T('cohortPeers', [1, 2, 3, 4, 5, 6, 7], 5), moTa: ['5 has sibling 4; peers 6, 7', '5 có anh em 4; bạn cùng khoá 6, 7'] },
    { ...T('cohortPeers', [1, 2, 3, null, 4, null, 5], 4), moTa: ['Only child of 2; 5 is a cousin', 'Con một của 2; 5 là anh em họ'] },
    { ...T('cohortPeers', [1, 2, 3], 1), moTa: ['The root has no peers', 'Gốc không có bạn cùng khoá'] },
    { ...T('cohortPeers', [1, 2, 3], 9), an: true, moTa: ['x not in the tree', 'x không có trong cây'] },
    { ...T('cohortPeers', [], 1), an: true },
    { ...T('cohortPeers', [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150], 110), an: true },
    { ...T('cohortPeers', [10, 20, 30, 40, 50, 60, 70], 20), an: true, moTa: ['Depth 1: only the sibling ⇒ []', 'Độ sâu 1: chỉ có anh em ⇒ []'] },
    { ...T('cohortPeers', XICH(1000, 'i'), 999), an: true, moTa: ['Deep chain: the last node', 'Chuỗi sâu: nút cuối cùng'] },
  ],
  saiMau: [
    { ten: ['Excludes only x, keeps the sibling', 'Chỉ bỏ x, giữ lại anh em'], ma: 'function cohortPeers(root, x) {\n  if (!root) return [];\n  var lv = [root];\n  while (lv.length) {\n    var vals = lv.map(function (n) { return n.val; });\n    if (vals.indexOf(x) >= 0) return vals.filter(function (v) { return v !== x; });\n    var nx = []; lv.forEach(function (n) { if (n.left) nx.push(n.left); if (n.right) nx.push(n.right); }); lv = nx;\n  }\n  return [];\n}\n' },
  ],
});

/* ── 3. BFS mang theo cột: in sơ đồ tổ chức theo cột dọc ── */
function columnView(root) {
  if (root === null) return [];
  var cols = new Map(), minC = 0, maxC = 0;
  var queue = [{ node: root, col: 0 }], head = 0;
  while (head < queue.length) {
    var e = queue[head++]; // BFS order = top to bottom, and left to right inside a row
    if (!cols.has(e.col)) cols.set(e.col, []);
    cols.get(e.col).push(e.node.val);
    if (e.col < minC) minC = e.col;
    if (e.col > maxC) maxC = e.col;
    if (e.node.left) queue.push({ node: e.node.left, col: e.col - 1 });
    if (e.node.right) queue.push({ node: e.node.right, col: e.col + 1 });
  }
  var out = [];
  for (var c = minC; c <= maxC; c++) out.push(cols.get(c)); // columns are contiguous: no gaps between minC and maxC
  return out;
}
const D3 = bai({
  ten: 'Wall chart: print the tree column by column', kho: 'HARD', phut: 25,
  en: `<p>The office wants the org chart printed as vertical strips on a narrow wall. Put the root in column 0; a left child is one column to the left of its parent (<code>col − 1</code>), a right child one column to the right (<code>col + 1</code>).</p>
<p>Write <code>columnView(root)</code> returning the columns from the leftmost to the rightmost; each column lists its values <b>top to bottom</b>, and two nodes in the same row and the same column appear <b>left to right</b> (the order a level-by-level reading would meet them). Empty tree ⇒ <code>[]</code>.</p>`,
  vi: `<p>Văn phòng muốn in sơ đồ tổ chức thành các dải dọc trên một bức tường hẹp. Đặt gốc ở cột 0; con trái lệch một cột sang trái so với cha (<code>col − 1</code>), con phải lệch một cột sang phải (<code>col + 1</code>).</p>
<p>Viết <code>columnView(root)</code> trả về các cột từ trái nhất tới phải nhất; mỗi cột liệt kê giá trị <b>từ trên xuống dưới</b>, và hai nút cùng hàng, cùng cột thì xếp <b>từ trái sang phải</b> (đúng thứ tự khi đọc từng tầng).</p>`,
  dauVao: ['root — tree node or null.', 'root — nút cây hoặc null.'],
  dauRa: ['number[][] — columns, leftmost first.', 'number[][] — các cột, trái nhất trước.'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵; depth up to 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu tới 1000.'], ['Target: O(n) — no sorting needed.', 'Mục tiêu: O(n) — không cần sắp xếp.']],
  goiY: [
    ['Each node needs a column number, inherited from the parent ± 1. Which traversal already produces "top to bottom, then left to right"?', 'Mỗi nút cần số cột, thừa hưởng từ cha ± 1. Kiểu duyệt nào tự sinh ra thứ tự "trên xuống dưới, rồi trái sang phải"?'],
    ['BFS with entries <code>{ node, col }</code>, appending each value to <code>cols[col]</code>. Track the min and max column — the columns in between are never empty.', 'BFS với phần tử <code>{ node, col }</code>, thêm mỗi giá trị vào <code>cols[col]</code>. Theo dõi cột nhỏ nhất và lớn nhất — các cột ở giữa không bao giờ rỗng.'],
  ],
  loi: [
    ['Collecting columns with a recursive DFS (pre-order): a deep node in the left subtree is visited before a shallow node of the right subtree in the same column, so "top to bottom" breaks — see <code>[1, 2, 3, null, 4, null, null, null, 8]</code>: column 1 must be <code>[3, 8]</code>.', 'Gom cột bằng DFS đệ quy (pre-order): nút sâu bên cây con trái được thăm trước nút nông bên cây con phải cùng cột, nên "trên xuống dưới" hỏng — xem <code>[1, 2, 3, null, 4, null, null, null, 8]</code>: cột 1 phải là <code>[3, 8]</code>.'],
    ['Storing columns in a plain array indexed by <code>col</code>: negative indices become object properties and are lost when you iterate.', 'Lưu cột vào mảng thường đánh chỉ số theo <code>col</code>: chỉ số âm thành thuộc tính object và bị mất khi duyệt.'],
    ['Sorting each column by value instead of keeping the visiting order.', 'Sắp mỗi cột theo giá trị thay vì giữ thứ tự thăm.'],
  ],
  gt: ['BFS visits nodes row by row and, inside a row, left to right — exactly the order the problem asks for within a column — so appending in visiting order needs no sort at all. Columns form a contiguous range [minC, maxC] (a child is always one step from its parent), so a final loop over that range outputs them in order. O(n) time, O(n) memory. A DFS would need (row, order) pairs plus a sort, O(n log n).', 'BFS thăm nút theo từng hàng và, trong một hàng, từ trái sang phải — đúng thứ tự đề đòi trong một cột — nên thêm theo thứ tự thăm là xong, không cần sắp. Các cột tạo thành một dải liền [minC, maxC] (con luôn cách cha đúng một bước), nên vòng lặp cuối qua dải đó in đúng thứ tự. O(n) thời gian, O(n) bộ nhớ. DFS sẽ phải lưu cặp (hàng, thứ tự) rồi sắp, O(n log n).'],
  kn: ['BFS', 'vertical order'],
  tns: [tn('column', 'cột'), tn('pre-order', 'duyệt trước (gốc–trái–phải)'), tn('contiguous range', 'dải liên tục')],
  dau: `/**
 * root: { val, left, right } | null
 * returns the columns, leftmost first; each column top to bottom, ties left to right
 */
function columnView(root) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — BFS carrying the column; a Map from column to values.\n' + nguon(columnView),
  cases: [
    { ...T('columnView', [3, 9, 20, null, null, 15, 7]), moTa: ['15 sits under the root', '15 nằm ngay dưới gốc'] },
    { ...T('columnView', [1, 2, 3, 4, 5, 6, 7]), moTa: ['5 and 6 share column 0 and row 2 ⇒ left to right', '5 và 6 cùng cột 0, cùng hàng 2 ⇒ trái sang phải'] },
    { ...T('columnView', []) },
    { ...T('columnView', [1, 2, 3, null, 4, null, null, null, 8]), an: true, moTa: ['Deep left-subtree node vs shallow right-subtree node', 'Nút sâu cây trái và nút nông cây phải'] },
    { ...T('columnView', [5]), an: true },
    { ...T('columnView', [1, 2, null, 3, null, 4]), an: true, moTa: ['All to the left (negative columns)', 'Toàn lệch trái (cột âm)'] },
    { ...T('columnView', [1, 2, 3, 4, 5, 6, 7, null, 8, 9, null, null, 10, 11]), an: true },
    { ...T('columnView', XICH(1000)), an: true, moTa: ['Depth 1000 right chain ⇒ 1000 columns', 'Chuỗi phải sâu 1000 ⇒ 1000 cột'] },
  ],
  saiMau: [
    { ten: ['Recursive pre-order DFS collecting columns', 'DFS đệ quy pre-order gom cột'], ma: 'function columnView(root) {\n  var m = new Map();\n  (function go(n, c) { if (!n) return; if (!m.has(c)) m.set(c, []); m.get(c).push(n.val); go(n.left, c - 1); go(n.right, c + 1); })(root, 0);\n  return [...m.keys()].sort(function (a, b) { return a - b; }).map(function (k) { return m.get(k); });\n}\n' },
  ],
});

export default mod('dsa-5-1-duyet', '5.1 Tree traversal: DFS orders and BFS by level', [D1, D2, D3]);
