/** Coding Interview Prep · 5.2 — Đệ quy trên cây: "hàm trả gì cho cha?" — tổng cây con (dựng cây mới), truyền xuống + trả lên, đường dài nhất qua nút, trạng thái 3 giá trị. Đề tự soạn. */
import { mod, bai, tn, nguon, boc } from './_dsa.mjs';

const T = (fn, arr, ...rest) => {
  const a = typeof arr === 'string' ? arr : JSON.stringify(arr);
  const r = rest.map((x) => `, ${JSON.stringify(x)}`).join('');
  return { goi: boc(`${fn}(__cay(${a})${r})`), hien: `${fn}(${typeof arr === 'string' ? '<chain of 1000 nodes>' : a}${r})` };
};
/** Kết quả là CÂY ⇒ in ra mảng theo tầng. */
const TC = (fn, arr) => ({ goi: boc(`__raCay(${fn}(__cay(${JSON.stringify(arr)})))`), hien: `${fn}(${JSON.stringify(arr)})  →  as level-order array` });
const XICH = (n, f) => `(function () { var a = [${f.replace(/i/g, '0')}]; for (var i = 1; i < ${n}; i++) a.push(null, ${f}); return a; })()`;

/* ── 1. Trả tổng lên cha, dựng cây MỚI ── */
function subtreeTotals(root) {
  // returns a NEW node whose val = total of the subtree; the input tree is left untouched
  if (root === null) return null;
  var left = subtreeTotals(root.left);
  var right = subtreeTotals(root.right);
  var total = root.val + (left ? left.val : 0) + (right ? right.val : 0); // children already hold THEIR totals
  return { val: total, left: left, right: right };
}
const D1 = bai({
  ten: 'Department headcount: replace every node by its subtree total', kho: 'EASY', phut: 15,
  en: `<p>A company stores its departments as a binary tree: <code>node.val</code> is the number of people working <i>directly</i> in that department, and the children are its sub-departments. For the yearly report, every department must show its <b>total</b> headcount — itself plus everything below it.</p>
<p>Write <code>subtreeTotals(root)</code> that returns the root of a <b>new</b> tree with the same shape, where each node's value is the sum of its whole subtree in the original. <b>Do not modify the input tree</b> — the original numbers are still needed by payroll. The grader prints your tree in level-order form.</p>`,
  vi: `<p>Một công ty lưu các phòng ban dạng cây nhị phân: <code>node.val</code> là số người làm <i>trực tiếp</i> ở phòng đó, các con là phòng ban cấp dưới. Trong báo cáo năm, mỗi phòng phải ghi <b>tổng</b> quân số — chính nó cộng mọi thứ bên dưới.</p>
<p>Viết <code>subtreeTotals(root)</code> trả về gốc của một cây <b>mới</b> cùng hình dạng, giá trị mỗi nút là tổng cả cây con của nó trong cây gốc. <b>Không được sửa cây đầu vào</b> — phòng lương vẫn cần số gốc. Máy chấm in cây của bạn theo dạng mảng theo tầng.</p>`,
  dauVao: ['root — tree node or null.', 'root — nút cây hoặc null.'],
  dauRa: ['The root of a new tree (or null).', 'Gốc của cây mới (hoặc null).'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁴; depth ≤ 1000; 0 ≤ val ≤ 1000.', '0 ≤ số nút ≤ 10⁴; độ sâu ≤ 1000; 0 ≤ val ≤ 1000.']],
  goiY: [
    ['Ask the template question: what should the call on a child hand back to its parent? Here: the new child node, already carrying the child\'s total.', 'Hỏi câu của khuôn: lời gọi trên con nên trả gì cho cha? Ở đây: nút con MỚI, đã mang sẵn tổng của con.'],
    ['Post-order: build the left and right results first, then <code>total = root.val + left.val + right.val</code>, then create <code>{ val: total, left, right }</code>.', 'Hậu thứ tự (post-order): dựng kết quả trái và phải trước, rồi <code>total = root.val + left.val + right.val</code>, rồi tạo <code>{ val: total, left, right }</code>.'],
  ],
  loi: [
    ['Overwriting <code>root.val</code> in place and returning <code>root</code>: the output is right but the input tree is destroyed (a hidden check reads the original tree after your call).', 'Ghi đè <code>root.val</code> tại chỗ rồi trả <code>root</code>: đầu ra đúng nhưng cây đầu vào bị phá (một ca ẩn đọc lại cây gốc sau khi gọi hàm của bạn).'],
    ['Calling a separate <code>sum(node)</code> helper for every node: correct but O(n·h) — each node is re-added once per ancestor.', 'Gọi riêng hàm <code>sum(node)</code> cho từng nút: đúng nhưng O(n·h) — mỗi nút bị cộng lại một lần cho mỗi tổ tiên.'],
  ],
  gt: ['The return value does double duty: it is the piece of the new tree <i>and</i> it carries the child\'s total, so the parent gets everything it needs in O(1). Each original node is visited once ⇒ O(n) time; the recursion is as deep as the tree ⇒ O(h) stack, plus O(n) for the new nodes. Creating new nodes instead of writing into <code>root.val</code> is what keeps the caller\'s data intact — "do not mutate the input" is a normal requirement in real code reviews.', 'Giá trị trả về làm hai việc: nó là một mảnh của cây mới <i>và</i> mang tổng của con, nên cha có đủ thứ cần trong O(1). Mỗi nút gốc được thăm một lần ⇒ O(n) thời gian; đệ quy sâu bằng chiều cao cây ⇒ O(h) ngăn xếp, cộng O(n) cho các nút mới. Tạo nút mới thay vì ghi vào <code>root.val</code> giữ nguyên dữ liệu của bên gọi — "không sửa đầu vào" là yêu cầu bình thường khi review code thật.'],
  kn: ['tree recursion', 'post-order'],
  tns: [tn('post-order', 'hậu thứ tự (con trước, cha sau)'), tn('subtree', 'cây con'), tn('mutate', 'sửa tại chỗ (làm thay đổi đối tượng)')],
  dau: `/**
 * root: { val, left, right } | null
 * returns a NEW tree of the same shape, each val = total of that subtree (input unchanged)
 */
function subtreeTotals(root) {
  // Write your solution here
  return root;
}
`,
  giai: '// Reference solution — post-order: children return their new node (carrying their total).\n' + nguon(subtreeTotals),
  cases: [
    { ...TC('subtreeTotals', [5, 3, 8, 1, 2]), moTa: ['Root total 5+3+8+1+2 = 19', 'Tổng ở gốc 5+3+8+1+2 = 19'] },
    { ...TC('subtreeTotals', [4, null, 6, 2]) },
    { ...TC('subtreeTotals', []), moTa: ['Empty tree ⇒ null ⇒ []', 'Cây rỗng ⇒ null ⇒ []'] },
    { goi: boc('(function () { var t = __cay([5, 3, 8, 1, 2]); subtreeTotals(t); return __raCay(t); })()'), an: true, moTa: ['The input tree must be unchanged after the call', 'Cây đầu vào phải giữ nguyên sau khi gọi'] },
    { ...TC('subtreeTotals', [7]), an: true },
    { ...TC('subtreeTotals', [0, 0, 0, 0, null, null, 0]), an: true },
    { goi: boc(`(function () { var r = subtreeTotals(__cay(${XICH(1000, '1')})); var d = 0, s = []; while (r && d < 3) { s.push(r.val); r = r.right; d++; } return s; })()`), an: true, moTa: ['Depth 1000 chain of ones ⇒ 1000, 999, 998, …', 'Chuỗi 1000 số 1 ⇒ 1000, 999, 998, …'] },
  ],
  saiMau: [
    { ten: ['Overwrites root.val in place', 'Ghi đè root.val tại chỗ'], ma: 'function subtreeTotals(root) {\n  if (!root) return null;\n  subtreeTotals(root.left); subtreeTotals(root.right);\n  root.val += (root.left ? root.left.val : 0) + (root.right ? root.right.val : 0);\n  return root;\n}\n' },
  ],
});

/* ── 2. Truyền xuống + trả lên: chuỗi phiên bản liên tiếp dài nhất ── */
function longestStepChain(root) {
  var best = 0;
  // run = length of the consecutive chain that ENDS at `node` (passed DOWN from the parent)
  function go(node, parentVal, run) {
    if (node === null) return;
    run = (parentVal !== null && node.val === parentVal + 1) ? run + 1 : 1; // extend or restart here
    if (run > best) best = run;
    go(node.left, node.val, run);
    go(node.right, node.val, run);
  }
  go(root, null, 0);
  return best;
}
const D2 = bai({
  ten: 'Release tree: the longest chain of consecutive versions', kho: 'MEDIUM', phut: 20,
  en: `<p>An internal tool records how builds were forked: each build is a node, its children are builds created from it, and <code>node.val</code> is the build number. A <b>clean upgrade chain</b> is a downward path (parent → child → grandchild …) where every next build number is exactly one more than the previous: 41 → 42 → 43.</p>
<p>Write <code>longestStepChain(root)</code> returning the number of nodes on the longest clean upgrade chain. The chain may start at any node, not only at the root. Empty tree ⇒ <code>0</code>.</p>`,
  vi: `<p>Một công cụ nội bộ ghi lại cách các bản build được rẽ nhánh: mỗi build là một nút, con của nó là các build tạo ra từ nó, <code>node.val</code> là số hiệu build. Một <b>chuỗi nâng cấp sạch</b> là đường đi xuống (cha → con → cháu …) mà số hiệu sau luôn lớn hơn số trước đúng 1: 41 → 42 → 43.</p>
<p>Viết <code>longestStepChain(root)</code> trả về số nút trên chuỗi nâng cấp sạch dài nhất. Chuỗi có thể bắt đầu ở bất kỳ nút nào, không nhất thiết ở gốc. Cây rỗng ⇒ <code>0</code>.</p>`,
  dauVao: ['root — tree node or null; values are integers (may repeat).', 'root — nút cây hoặc null; giá trị là số nguyên (có thể trùng).'],
  dauRa: ['number — nodes on the longest chain.', 'number — số nút trên chuỗi dài nhất.'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵; depth ≤ 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu ≤ 1000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Information flows DOWN here: whether a node extends a chain depends on its parent. Pass the parent\'s value and the current chain length as parameters.', 'Ở đây thông tin chảy XUỐNG: một nút có nối dài chuỗi hay không phụ thuộc vào cha. Truyền giá trị của cha và độ dài chuỗi hiện tại làm tham số.'],
    ['At each node: <code>run = (val === parentVal + 1) ? run + 1 : 1</code>, update a global best, recurse into both children with the new run.', 'Ở mỗi nút: <code>run = (val === parentVal + 1) ? run + 1 : 1</code>, cập nhật biến best chung, đệ quy xuống cả hai con với run mới.'],
  ],
  loi: [
    ['Only counting chains that start at the root: when the chain breaks you must <b>restart at 1</b>, not stop.', 'Chỉ đếm chuỗi bắt đầu từ gốc: khi chuỗi đứt phải <b>bắt đầu lại từ 1</b>, không phải dừng.'],
    ['Accepting <code>child.val === parent.val</code> or <code>parent.val − 1</code>: the chain must go up by exactly one, downward.', 'Chấp nhận <code>child.val === parent.val</code> hay <code>parent.val − 1</code>: chuỗi phải tăng đúng 1, theo chiều đi xuống.'],
    ['Starting a fresh search from every node: O(n·h) — fine on small trees, wasteful in general.', 'Bắt đầu tìm lại từ mỗi nút: O(n·h) — ổn với cây nhỏ, lãng phí nói chung.'],
  ],
  gt: ['The length of the best chain that ends at a node depends only on its parent (extend by one, or restart at 1), so we compute it on the way down and keep the maximum. Every node is visited once ⇒ O(n) time, O(h) recursion stack. This is the "pass information down" half of the template; the next two problems use the "return information up" half.', 'Độ dài chuỗi tốt nhất kết thúc tại một nút chỉ phụ thuộc vào cha (nối thêm một, hoặc bắt đầu lại từ 1), nên ta tính nó trên đường đi xuống và giữ giá trị lớn nhất. Mỗi nút thăm một lần ⇒ O(n) thời gian, O(h) ngăn xếp đệ quy. Đây là nửa "truyền thông tin xuống" của khuôn; hai đề sau dùng nửa "trả thông tin lên".'],
  kn: ['tree recursion', 'top-down state'],
  tns: [tn('downward path', 'đường đi xuống', 'từ cha tới con, không quay lên.'), tn('top-down', 'từ trên xuống', 'thông tin truyền qua tham số.'), tn('global best', 'biến kết quả chung')],
  dau: `/**
 * root: { val, left, right } | null
 * returns the number of nodes on the longest downward path where each child = parent + 1
 */
function longestStepChain(root) {
  // Write your solution here
  return root ? 1 : 0;
}
`,
  giai: '// Reference solution — pass (parent value, current run) down; restart the run when it breaks.\n' + nguon(longestStepChain),
  cases: [
    { ...T('longestStepChain', [41, 42, 50, 43, null, null, 51]), moTa: ['41 → 42 → 43', '41 → 42 → 43'] },
    { ...T('longestStepChain', [1, 5, null, 6, null, 7, null, 8]), moTa: ['Chain 5 → 6 → 7 → 8 does not start at the root', 'Chuỗi 5 → 6 → 7 → 8 không bắt đầu ở gốc'] },
    { ...T('longestStepChain', []), moTa: ['Empty ⇒ 0', 'Rỗng ⇒ 0'] },
    { ...T('longestStepChain', [3, 2, 4, 1, null, null, 5]), an: true, moTa: ['Going down by one does not count', 'Giảm dần không tính'] },
    { ...T('longestStepChain', [2, 2, 2, 3]), an: true, moTa: ['Equal values break the chain', 'Giá trị bằng nhau làm đứt chuỗi'] },
    { ...T('longestStepChain', [10, 11, 11, 12, 9, 12, 13, null, null, null, null, null, null, 14]), an: true },
    { ...T('longestStepChain', [-2, -1, null, 0, null, 1]), an: true, moTa: ['Negative build numbers', 'Số hiệu âm'] },
    { ...T('longestStepChain', XICH(1000, 'i')), an: true, moTa: ['0 → 1 → … → 999 (depth 1000)', '0 → 1 → … → 999 (sâu 1000)'] },
  ],
  saiMau: [
    { ten: ['Stops counting when the chain breaks (only chains from the root)', 'Dừng đếm khi chuỗi đứt (chỉ chuỗi từ gốc)'], ma: 'function longestStepChain(root) {\n  function go(n, prev) { if (!n || (prev !== null && n.val !== prev + 1)) return 0; return 1 + Math.max(go(n.left, n.val), go(n.right, n.val)); }\n  return go(root, null);\n}\n' },
  ],
});

/* ── 3. Trả lên một "cánh tay", cập nhật đáp án bằng hai cánh tay ── */
function longestSameFirmware(root) {
  var best = 0; // in EDGES
  // arm(node) = longest downward path (in edges) starting at node where every node has node.val
  function arm(node) {
    if (node === null) return 0;
    var l = arm(node.left), r = arm(node.right);
    var goLeft = (node.left && node.left.val === node.val) ? l + 1 : 0;
    var goRight = (node.right && node.right.val === node.val) ? r + 1 : 0;
    if (goLeft + goRight > best) best = goLeft + goRight; // a path may bend here: use BOTH arms
    return Math.max(goLeft, goRight);                      // but the parent can only continue ONE arm
  }
  arm(root);
  return best;
}
const D3 = bai({
  ten: 'Network closet: the longest cable path on one firmware version', kho: 'MEDIUM', phut: 25,
  en: `<p>The switches of a campus building are wired as a binary tree, and <code>node.val</code> is the firmware version installed on each switch. Before an upgrade window, the network team wants the longest stretch of cable where <b>every switch on the path runs the same version</b>, so they can test a broadcast storm on it.</p>
<p>Write <code>longestSameFirmware(root)</code> returning the length of the longest such path, counted in <b>edges</b> (cables). The path may go up through a switch and down the other side — it does not have to pass through the root. Empty tree or a single switch ⇒ <code>0</code>.</p>`,
  vi: `<p>Các switch của một toà nhà trong trường được nối thành cây nhị phân, <code>node.val</code> là phiên bản firmware cài trên mỗi switch. Trước đợt nâng cấp, đội mạng muốn tìm đoạn cáp dài nhất mà <b>mọi switch trên đường đi đều chạy cùng một phiên bản</b>, để thử bão broadcast trên đó.</p>
<p>Viết <code>longestSameFirmware(root)</code> trả về độ dài đường đi dài nhất như vậy, tính bằng <b>số cạnh</b> (số đoạn cáp). Đường đi có thể đi lên qua một switch rồi xuống phía bên kia — không bắt buộc đi qua gốc. Cây rỗng hoặc một switch ⇒ <code>0</code>.</p>`,
  dauVao: ['root — tree node or null.', 'root — nút cây hoặc null.'],
  dauRa: ['number — edges on the longest same-value path.', 'number — số cạnh trên đường cùng giá trị dài nhất.'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵; depth ≤ 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu ≤ 1000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Same shape as the diameter problem of the lesson: the answer path has a highest node where it bends. At that node it uses a left arm and a right arm.', 'Cùng dạng với bài đường kính trong bài học: đường đáp án có một nút cao nhất nơi nó gập lại. Tại nút đó nó dùng một cánh tay trái và một cánh tay phải.'],
    ['Let <code>arm(node)</code> return the longest same-value path going DOWN from node, in edges. An arm only extends into a child with the same value. Update <code>best</code> with <code>left arm + right arm</code>, return <code>max(left arm, right arm)</code>.', 'Cho <code>arm(node)</code> trả về đường cùng giá trị dài nhất đi XUỐNG từ node, tính bằng cạnh. Cánh tay chỉ kéo dài vào con có cùng giá trị. Cập nhật <code>best</code> bằng <code>tay trái + tay phải</code>, trả về <code>max(tay trái, tay phải)</code>.'],
  ],
  loi: [
    ['Returning <code>left + right</code> to the parent: a path cannot fork, so the parent may extend only ONE of the two arms — the answer comes out too long.', 'Trả <code>left + right</code> cho cha: đường đi không thể rẽ đôi, nên cha chỉ được nối MỘT trong hai cánh tay — đáp án ra dài quá.'],
    ['Counting nodes instead of edges (off by one), or forgetting that a child with a different value resets its arm to 0 for this parent even if the child has a long arm of its own.', 'Đếm nút thay vì cạnh (lệch một), hoặc quên rằng con khác giá trị thì cánh tay về 0 đối với cha này, dù bản thân con có cánh tay dài.'],
  ],
  gt: ['Every path has a unique highest node; at that node it is "left arm + right arm". So one post-order pass that, at every node, combines the two arms into a candidate answer, and returns only the longer arm upward (because a parent can extend a single direction), sees every possible path exactly once. O(n) time, O(h) stack. This "return one thing, record another" split is the same as in Diameter and Maximum Path Sum.', 'Mỗi đường đi có duy nhất một nút cao nhất; tại đó nó là "tay trái + tay phải". Nên một lượt hậu thứ tự, ở mỗi nút ghép hai cánh tay thành ứng viên đáp án, và chỉ trả cánh tay dài hơn lên trên (vì cha chỉ nối được một hướng), sẽ thấy mọi đường đi đúng một lần. O(n) thời gian, O(h) ngăn xếp. Cách tách "trả về một thứ, ghi nhận thứ khác" này giống hệt Diameter và Maximum Path Sum.'],
  kn: ['tree recursion', 'diameter pattern'],
  tns: [tn('arm', 'cánh tay (đường đi xuống từ một nút)'), tn('edge', 'cạnh'), tn('bend', 'điểm gập', 'nút cao nhất của một đường đi.')],
  dau: `/**
 * root: { val, left, right } | null — val = firmware version
 * returns the number of EDGES on the longest path whose nodes all have the same value
 */
function longestSameFirmware(root) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — arm(node) returns the longer arm; best records left arm + right arm.\n' + nguon(longestSameFirmware),
  cases: [
    { ...T('longestSameFirmware', [5, 4, 5, 1, 1, null, 5]), moTa: ['5 → 5 → 5 on the right: 2 edges', '5 → 5 → 5 bên phải: 2 cạnh'] },
    { ...T('longestSameFirmware', [1, 4, 5, 4, 4, null, 5]), moTa: ['4 – 4 – 4 bends at the left child: 2 edges', '4 – 4 – 4 gập ở con trái: 2 cạnh'] },
    { ...T('longestSameFirmware', [7]), moTa: ['One switch ⇒ 0', 'Một switch ⇒ 0'] },
    { ...T('longestSameFirmware', []), an: true },
    { ...T('longestSameFirmware', [2, 2, 2, 2, 2, 2, 2]), an: true, moTa: ['All equal: the best path bends at the root (4 edges)', 'Tất cả bằng nhau: đường tốt nhất gập ở gốc (4 cạnh)'] },
    { ...T('longestSameFirmware', [1, 1, 3, 1, 1, null, null, 1, null, null, 1]), an: true, moTa: ['The bend is below the root', 'Điểm gập nằm dưới gốc'] },
    { ...T('longestSameFirmware', [3, 9, 3, 9, 9, 3]), an: true, moTa: ['A child with another value resets the arm', 'Con khác giá trị làm cánh tay về 0'] },
    { ...T('longestSameFirmware', XICH(1000, '8')), an: true, moTa: ['Depth 1000, all 8 ⇒ 999 edges', 'Sâu 1000, toàn số 8 ⇒ 999 cạnh'] },
  ],
  saiMau: [
    { ten: ['Returns left + right to the parent (a forked path)', 'Trả left + right cho cha (đường rẽ đôi)'], ma: 'function longestSameFirmware(root) {\n  var best = 0;\n  function arm(n) { if (!n) return 0; var l = arm(n.left), r = arm(n.right);\n    var a = (n.left && n.left.val === n.val) ? l + 1 : 0, b = (n.right && n.right.val === n.val) ? r + 1 : 0;\n    best = Math.max(best, a + b); return a + b; }\n  arm(root); return best;\n}\n' },
  ],
});

/* ── 4. Trạng thái ba giá trị trả lên cha: đặt camera ít nhất ── */
function minCameras(root) {
  var NEED = 0, HAS_CAM = 1, COVERED = 2; // what a node tells its parent
  var cams = 0;
  function go(node) {
    if (node === null) return COVERED;    // an empty spot needs nothing and offers nothing
    var l = go(node.left), r = go(node.right);
    if (l === NEED || r === NEED) { cams++; return HAS_CAM; } // a child is uncovered: only a camera HERE can see it
    if (l === HAS_CAM || r === HAS_CAM) return COVERED;       // a child's camera sees me
    return NEED;                                               // let my parent cover me (greedy: cameras as high as possible)
  }
  if (go(root) === NEED) cams++; // the root has no parent to rely on
  return cams;
}
const D4 = bai({
  ten: 'Security cameras on a lab corridor tree: the minimum number', kho: 'HARD', phut: 35,
  en: `<p>The rooms of a new lab building are connected by corridors that form a binary tree (each node is a room; values do not matter). A camera installed in a room watches <b>that room, its parent room and its child rooms</b>. The facility manager wants every room watched using as few cameras as possible.</p>
<p>Write <code>minCameras(root)</code> returning the minimum number of cameras. An empty building needs <code>0</code>.</p>`,
  vi: `<p>Các phòng của một toà lab mới nối với nhau bằng hành lang tạo thành cây nhị phân (mỗi nút là một phòng; giá trị không quan trọng). Một camera lắp trong một phòng quan sát được <b>phòng đó, phòng cha và các phòng con</b>. Quản lý toà nhà muốn mọi phòng đều được quan sát với ít camera nhất.</p>
<p>Viết <code>minCameras(root)</code> trả về số camera ít nhất. Toà nhà rỗng cần <code>0</code>.</p>`,
  dauVao: ['root — tree node or null.', 'root — nút cây hoặc null.'],
  dauRa: ['number — minimum cameras.', 'number — số camera ít nhất.'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵; depth ≤ 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu ≤ 1000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Never put a camera on a leaf: its parent covers the leaf AND more. Work bottom-up and decide each room only after its children have answered.', 'Đừng bao giờ đặt camera ở lá: phòng cha phủ được lá VÀ nhiều hơn. Làm từ dưới lên, chỉ quyết định cho một phòng sau khi các con đã trả lời.'],
    ['Let each call return one of three states to its parent: NEED (I am not covered), HAS_CAM (I hold a camera), COVERED (covered, no camera). An empty child counts as COVERED.', 'Cho mỗi lời gọi trả về cho cha một trong ba trạng thái: NEED (tôi chưa được phủ), HAS_CAM (tôi có camera), COVERED (đã phủ, không camera). Con rỗng tính là COVERED.'],
    ['Rules: any child NEED ⇒ camera here (return HAS_CAM); else any child HAS_CAM ⇒ COVERED; else NEED. After the walk, if the root says NEED, add one more camera.', 'Luật: có con NEED ⇒ đặt camera ở đây (trả HAS_CAM); ngược lại có con HAS_CAM ⇒ COVERED; còn lại NEED. Sau khi duyệt, nếu gốc báo NEED thì thêm một camera.'],
  ],
  loi: [
    ['Forgetting the root at the end: <code>[0]</code> (one room) or <code>[0, 0, 0, 0]</code> leave the root in state NEED with nobody above to cover it.', 'Quên gốc ở cuối: <code>[0]</code> (một phòng) hay <code>[0, 0, 0, 0]</code> để gốc ở trạng thái NEED mà không còn ai bên trên phủ nó.'],
    ['Treating an empty child as NEED: every leaf would then get a camera.', 'Coi con rỗng là NEED: thế là lá nào cũng bị gắn camera.'],
    ['Alternating levels (camera on every other level): looks plausible, but is not minimal on unbalanced trees.', 'Đặt xen kẽ theo tầng (camera mỗi tầng cách một): trông hợp lý nhưng không tối thiểu với cây lệch.'],
  ],
  gt: ['Greedy bottom-up: a leaf is best covered by its parent, because a camera there also covers the grandparent side; so we postpone every decision as high as possible. Each node reports one of three states, and the three rules place a camera only when a child would otherwise stay uncovered — an exchange argument shows no solution can use fewer. One post-order pass ⇒ O(n) time, O(h) stack. The interview lesson: when two values ("covered or not") are not enough for the parent to decide, return a richer state.', 'Tham lam từ dưới lên: lá được phủ tốt nhất bởi cha, vì camera ở đó còn phủ được cả phía ông; nên ta hoãn mọi quyết định lên cao nhất có thể. Mỗi nút báo một trong ba trạng thái, và ba luật chỉ đặt camera khi một con sẽ bị bỏ trống nếu không đặt — lập luận hoán đổi cho thấy không lời giải nào dùng ít hơn. Một lượt hậu thứ tự ⇒ O(n) thời gian, O(h) ngăn xếp. Bài học phỏng vấn: khi hai giá trị ("được phủ hay không") không đủ để cha quyết định, hãy trả về một trạng thái giàu hơn.'],
  kn: ['tree recursion', 'greedy on trees', 'state machine'],
  tns: [tn('state', 'trạng thái'), tn('greedy', 'tham lam'), tn('exchange argument', 'lập luận hoán đổi', 'chứng minh thay lựa chọn tối ưu bằng lựa chọn tham lam không làm tệ hơn.')],
  dau: `/**
 * root: { val, left, right } | null — rooms; a camera watches its room, the parent and the children
 * returns the minimum number of cameras so that every room is watched
 */
function minCameras(root) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — post-order with three states: NEED / HAS_CAM / COVERED.\n' + nguon(minCameras),
  cases: [
    { ...T('minCameras', [0, 0, null, 0, 0]), moTa: ['One camera in the middle room', 'Một camera ở phòng giữa'] },
    { ...T('minCameras', [0, 0, null, 0, null, 0, null, null, 0]), moTa: ['A corridor of 5 rooms ⇒ 2', 'Hành lang 5 phòng ⇒ 2'] },
    { ...T('minCameras', [0]), moTa: ['A single room still needs one', 'Một phòng vẫn cần một camera'] },
    { ...T('minCameras', []), an: true },
    { ...T('minCameras', [0, 0, 0, 0]), an: true, moTa: ['The root is left uncovered by the children', 'Gốc không được các con phủ'] },
    { ...T('minCameras', [0, 0, 0, 0, 0, 0, 0]), an: true },
    { ...T('minCameras', [0, 0, 0, null, 0, 0, null, 0, null, null, 0]), an: true },
    { ...T('minCameras', XICH(1000, '0')), an: true, moTa: ['Corridor of 1000 rooms ⇒ 334', 'Hành lang 1000 phòng ⇒ 334'] },
  ],
  saiMau: [
    { ten: ['Forgets to cover the root at the end', 'Quên phủ gốc ở cuối'], ma: 'function minCameras(root) {\n  var c = 0;\n  function go(n) { if (!n) return 2; var l = go(n.left), r = go(n.right); if (l === 0 || r === 0) { c++; return 1; } return (l === 1 || r === 1) ? 2 : 0; }\n  go(root); return c;\n}\n' },
    { ten: ['Camera on every other level', 'Camera ở mỗi tầng cách một'], ma: 'function minCameras(root) {\n  if (!root) return 0;\n  var lv = [root], d = 0, a = 0, b = 0;\n  while (lv.length) { if (d % 2) a += lv.length; else b += lv.length; var nx = []; lv.forEach(function (n) { if (n.left) nx.push(n.left); if (n.right) nx.push(n.right); }); lv = nx; d++; }\n  return Math.min(a || b, b);\n}\n' },
  ],
});

export default mod('dsa-5-2-de-quy', '5.2 Recursion on trees: what do you return to the parent?', [D1, D2, D3, D4]);
