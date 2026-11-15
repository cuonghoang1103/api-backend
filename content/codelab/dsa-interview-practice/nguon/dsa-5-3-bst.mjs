/** Coding Interview Prep · 5.3 — BST: đếm trong khoảng có cắt nhánh O(h + k), floor/ceil O(h), tìm hai khoá bị đổi chỗ bằng in-order. Đề tự soạn. */
import { mod, bai, tn, nguon, boc } from './_dsa.mjs';

const T = (fn, arr, ...rest) => {
  const a = typeof arr === 'string' ? arr : JSON.stringify(arr);
  const r = rest.map((x) => `, ${JSON.stringify(x)}`).join('');
  return { goi: boc(`${fn}(__cay(${a})${r})`), hien: `${fn}(${typeof arr === 'string' ? '<sorted chain of 1000 keys>' : a}${r})` };
};
/** BST lệch phải 1000 khoá 0, 10, 20, … (như chèn theo thứ tự tăng dần). */
const XICH = '(function () { var a = [0]; for (var i = 1; i < 1000; i++) a.push(null, i * 10); return a; })()';
/** Thân kiểm hiệu năng: BST cân bằng 200 000 khoá 0, 5, 10, … dựng từ mảng sắp sẵn (độ sâu 18). */
const CAY_LON = 'var n = 200000, keys = new Array(n); for (var i = 0; i < n; i++) keys[i] = i * 5; function build(lo, hi) { if (lo > hi) return null; var m = (lo + hi) >> 1; return { val: keys[m], left: build(lo, m - 1), right: build(m + 1, hi) }; } var root = build(0, n - 1);';

/* ── 1. Đếm trong khoảng: cắt nhánh nhờ tính chất BST ── */
function countInRange(root, lo, hi) {
  if (root === null) return 0;
  if (root.val < lo) return countInRange(root.right, lo, hi); // whole left subtree is even smaller: skip it
  if (root.val > hi) return countInRange(root.left, lo, hi);  // whole right subtree is even larger: skip it
  return 1 + countInRange(root.left, lo, hi) + countInRange(root.right, lo, hi);
}
const D1 = bai({
  ten: 'Grade index: count the scores inside a range', kho: 'EASY', phut: 15,
  en: `<p>The exam office indexes final scores (×10, so 85 means 8.5) in a binary search tree: for every node, all keys in the left subtree are smaller and all keys in the right subtree are larger; keys are distinct. Lecturers keep asking "how many students scored between <code>lo</code> and <code>hi</code>?" — thousands of times a day.</p>
<p>Write <code>countInRange(root, lo, hi)</code> returning how many keys <code>k</code> satisfy <code>lo ≤ k ≤ hi</code>. Use the BST ordering: a query must not walk the whole tree when the range is narrow.</p>`,
  vi: `<p>Phòng khảo thí lập chỉ mục điểm tổng kết (×10, nên 85 nghĩa là 8.5) bằng cây nhị phân tìm kiếm (BST): với mọi nút, mọi khoá ở cây con trái nhỏ hơn, mọi khoá ở cây con phải lớn hơn; các khoá đôi một khác nhau. Giảng viên liên tục hỏi "bao nhiêu sinh viên có điểm từ <code>lo</code> đến <code>hi</code>?" — hàng nghìn lần mỗi ngày.</p>
<p>Viết <code>countInRange(root, lo, hi)</code> trả về số khoá <code>k</code> thoả <code>lo ≤ k ≤ hi</code>. Hãy dùng thứ tự của BST: khi khoảng hẹp, một truy vấn không được đi hết cả cây.</p>`,
  dauVao: ['root — BST node or null; lo ≤ hi integers.', 'root — nút BST hoặc null; lo ≤ hi là số nguyên.'],
  dauRa: ['number', 'number'],
  rangBuoc: [['0 ≤ nodes ≤ 2·10⁵; the performance check runs 20 000 queries on a balanced tree.', '0 ≤ số nút ≤ 2·10⁵; kiểm hiệu năng chạy 20 000 truy vấn trên cây cân bằng.'], ['Target: O(h + k) per query (h = height, k = answer).', 'Mục tiêu: O(h + k) mỗi truy vấn (h = chiều cao, k = đáp án).']],
  goiY: [
    ['If <code>root.val &lt; lo</code>, can anything in the LEFT subtree be inside the range?', 'Nếu <code>root.val &lt; lo</code>, có khoá nào ở cây con TRÁI nằm trong khoảng được không?'],
    ['Three cases: below the range ⇒ go right only; above ⇒ go left only; inside ⇒ count 1 and go both ways.', 'Ba trường hợp: dưới khoảng ⇒ chỉ sang phải; trên khoảng ⇒ chỉ sang trái; trong khoảng ⇒ đếm 1 và đi cả hai phía.'],
  ],
  loi: [
    ['Visiting every node and testing <code>lo ≤ val ≤ hi</code>: correct but O(n) per query — 20 000 queries × 200 000 nodes runs out of time.', 'Thăm mọi nút rồi thử <code>lo ≤ val ≤ hi</code>: đúng nhưng O(n) mỗi truy vấn — 20 000 truy vấn × 200 000 nút hết giờ.'],
    ['Using <code>&lt;</code> instead of <code>≤</code> at the ends: the range is inclusive on both sides.', 'Dùng <code>&lt;</code> thay cho <code>≤</code> ở hai đầu: khoảng bao gồm cả hai đầu mút.'],
  ],
  gt: ['The BST property lets us discard a whole subtree with one comparison. The nodes we actually visit are the two search paths towards lo and hi (≤ 2h nodes) plus the k nodes inside the range, so a query costs O(h + k) instead of O(n); on a balanced tree h ≈ log₂ n ≈ 18 for n = 2·10⁵. Recursion depth is h.', 'Tính chất BST cho phép bỏ cả một cây con chỉ bằng một phép so. Các nút thật sự được thăm là hai đường tìm về phía lo và hi (≤ 2h nút) cộng k nút trong khoảng, nên một truy vấn tốn O(h + k) thay vì O(n); trên cây cân bằng h ≈ log₂ n ≈ 18 với n = 2·10⁵. Độ sâu đệ quy là h.'],
  kn: ['binary search tree', 'pruning'],
  tns: [tn('binary search tree (BST)', 'cây nhị phân tìm kiếm'), tn('pruning', 'cắt nhánh', 'bỏ qua cả cây con chắc chắn không chứa đáp án.'), tn('inclusive', 'bao gồm hai đầu mút')],
  dau: `/**
 * root: BST node { val, left, right } | null; lo <= hi
 * returns how many keys k satisfy lo <= k <= hi
 */
function countInRange(root, lo, hi) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — prune with the BST property: O(h + k) per query.\n' + nguon(countInRange),
  cases: [
    { ...T('countInRange', [70, 50, 85, 40, 60, 80, 95], 55, 82), moTa: ['60, 70, 80', '60, 70, 80'] },
    { ...T('countInRange', [70, 50, 85, 40, 60, 80, 95], 85, 85), moTa: ['Both ends are inclusive', 'Hai đầu mút đều tính'] },
    { ...T('countInRange', [], 0, 100) },
    { ...T('countInRange', [70, 50, 85, 40, 60, 80, 95], 0, 39), an: true },
    { ...T('countInRange', [70, 50, 85, 40, 60, 80, 95], 0, 100), an: true },
    { ...T('countInRange', [20, 10, 30, 5, 15, 25, 35, null, null, 12, 18], 11, 19), an: true },
    { ...T('countInRange', XICH, 4995, 9990), an: true, moTa: ['Sorted-insert chain (depth 1000)', 'Chuỗi do chèn tăng dần (sâu 1000)'] },
  ],
  perf: [{
    moTa: ['Performance: balanced BST of 200 000 keys, 20 000 narrow queries (visiting every node per query times out)', 'Hiệu năng: BST cân bằng 200 000 khoá, 20 000 truy vấn hẹp (mỗi truy vấn đi hết cây thì hết giờ)'],
    than: CAY_LON + ' var tot = 0; for (var q = 0; q < 20000; q++) { var lo = R(n * 5); tot += countInRange(root, lo, lo + 40); } return tot;',
  }],
  saiMau: [
    { ten: ['O(n) per query: visits every node', 'O(n) mỗi truy vấn: thăm mọi nút'], chiHieuNang: true, ma: 'function countInRange(root, lo, hi) {\n  if (!root) return 0;\n  return (root.val >= lo && root.val <= hi ? 1 : 0) + countInRange(root.left, lo, hi) + countInRange(root.right, lo, hi);\n}\n' },
  ],
});

/* ── 2. Floor/ceil: đi một đường từ gốc ── */
function lockerFloorCeil(root, x) {
  var floor = null, ceil = null;
  var node = root;
  while (node !== null) {          // one root-to-leaf path: O(h), no recursion needed
    if (node.val === x) return [x, x];
    if (node.val < x) { floor = node.val; node = node.right; } // best "≤ x" so far; anything closer is to the right
    else { ceil = node.val; node = node.left; }                // best "≥ x" so far; anything closer is to the left
  }
  return [floor, ceil];
}
const D2 = bai({
  ten: 'Locker desk: nearest free locker below and above', kho: 'MEDIUM', phut: 20,
  en: `<p>The library keeps the numbers of its <b>free</b> lockers in a BST (distinct keys). A student asks for locker <code>x</code>; if it is taken, the desk offers the closest free locker number on each side.</p>
<p>Write <code>lockerFloorCeil(root, x)</code> returning <code>[floor, ceil]</code>: <code>floor</code> = the largest key <code>≤ x</code>, <code>ceil</code> = the smallest key <code>≥ x</code>; use <code>null</code> for a side that has no such key. If <code>x</code> itself is free, the answer is <code>[x, x]</code>.</p>`,
  vi: `<p>Thư viện lưu số các tủ đồ <b>còn trống</b> trong một BST (khoá đôi một khác nhau). Sinh viên xin tủ <code>x</code>; nếu tủ đó đã có người, quầy gợi ý số tủ trống gần nhất ở mỗi phía.</p>
<p>Viết <code>lockerFloorCeil(root, x)</code> trả về <code>[floor, ceil]</code>: <code>floor</code> = khoá lớn nhất <code>≤ x</code>, <code>ceil</code> = khoá nhỏ nhất <code>≥ x</code>; phía nào không có thì dùng <code>null</code>. Nếu chính <code>x</code> còn trống, đáp án là <code>[x, x]</code>.</p>`,
  dauVao: ['root — BST node or null; x — integer.', 'root — nút BST hoặc null; x — số nguyên.'],
  dauRa: ['[floor, ceil] — numbers or null.', '[floor, ceil] — số hoặc null.'],
  rangBuoc: [['0 ≤ nodes ≤ 2·10⁵; the performance check runs 20 000 lookups on a balanced tree.', '0 ≤ số nút ≤ 2·10⁵; kiểm hiệu năng chạy 20 000 lần tra trên cây cân bằng.'], ['Target: O(h) per call.', 'Mục tiêu: O(h) mỗi lần gọi.']],
  goiY: [
    ['Walk down from the root as if searching for x. Every node you pass is a candidate for floor or for ceil.', 'Đi xuống từ gốc như đang tìm x. Mỗi nút đi qua là ứng viên cho floor hoặc ceil.'],
    ['If <code>node.val &lt; x</code> it is the best floor so far (anything better is on its right) ⇒ record it and go right; otherwise it is the best ceil so far ⇒ record it and go left.', 'Nếu <code>node.val &lt; x</code> thì nó là floor tốt nhất tới giờ (cái tốt hơn nằm bên phải) ⇒ ghi lại rồi sang phải; ngược lại nó là ceil tốt nhất tới giờ ⇒ ghi lại rồi sang trái.'],
  ],
  loi: [
    ['Building the in-order list on every call and scanning it: O(n) per call ⇒ the 20 000-lookup check times out.', 'Dựng danh sách in-order mỗi lần gọi rồi quét: O(n) mỗi lần ⇒ kiểm 20 000 lần tra hết giờ.'],
    ['Using <code>0</code> or <code>-1</code> for "no locker": 0 can be a real locker number — return <code>null</code>.', 'Dùng <code>0</code> hay <code>-1</code> cho "không có tủ": 0 có thể là số tủ thật — hãy trả <code>null</code>.'],
    ['Stopping at the first node smaller than x: a closer floor may still be in its right subtree.', 'Dừng ở nút đầu tiên nhỏ hơn x: floor gần hơn có thể vẫn nằm trong cây con phải của nó.'],
  ],
  gt: ['The search path for x passes, by the BST property, through the closest smaller key and the closest larger key (one of them is the last node where the path turned right, the other where it turned left). Recording candidates while walking therefore finds both in one root-to-leaf walk: O(h) time and O(1) memory with a loop. Twenty thousand lookups on a balanced tree of 2·10⁵ keys cost about 20 000 × 18 steps.', 'Theo tính chất BST, đường tìm x đi qua khoá nhỏ hơn gần nhất và khoá lớn hơn gần nhất (một cái là nút cuối cùng đường đi rẽ phải, cái kia là nút cuối cùng rẽ trái). Ghi ứng viên trong lúc đi nên tìm được cả hai trong một lượt gốc → lá: O(h) thời gian và O(1) bộ nhớ với vòng lặp. Hai mươi nghìn lần tra trên cây cân bằng 2·10⁵ khoá tốn khoảng 20 000 × 18 bước.'],
  kn: ['binary search tree', 'floor and ceiling'],
  tns: [tn('floor', 'cận dưới', 'khoá lớn nhất ≤ x.'), tn('ceiling', 'cận trên', 'khoá nhỏ nhất ≥ x.'), tn('search path', 'đường tìm kiếm')],
  dau: `/**
 * root: BST node | null, x: number
 * returns [largest key <= x, smallest key >= x], null where none exists
 */
function lockerFloorCeil(root, x) {
  // Write your solution here
  return [null, null];
}
`,
  giai: '// Reference solution — one walk down the search path, recording floor/ceil candidates.\n' + nguon(lockerFloorCeil),
  cases: [
    { ...T('lockerFloorCeil', [40, 20, 60, 10, 30, 50, 70], 33), moTa: ['33 is taken ⇒ 30 and 40', '33 đã có người ⇒ 30 và 40'] },
    { ...T('lockerFloorCeil', [40, 20, 60, 10, 30, 50, 70], 50), moTa: ['50 is free ⇒ [50, 50]', '50 còn trống ⇒ [50, 50]'] },
    { ...T('lockerFloorCeil', [40, 20, 60, 10, 30, 50, 70], 5), moTa: ['Nothing below ⇒ floor null', 'Không có tủ nhỏ hơn ⇒ floor null'] },
    { ...T('lockerFloorCeil', [], 7), an: true },
    { ...T('lockerFloorCeil', [40, 20, 60, 10, 30, 50, 70], 99), an: true },
    { ...T('lockerFloorCeil', [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], 12), an: true, moTa: ['Ceil 13 sits in the left subtree of 14', 'Ceil 13 nằm trong cây con trái của 14'] },
    { ...T('lockerFloorCeil', [5, 0, 9], 2), an: true, moTa: ['Locker 0 is a real locker', 'Tủ số 0 là tủ thật'] },
    { ...T('lockerFloorCeil', XICH, 9985), an: true },
  ],
  perf: [{
    moTa: ['Performance: balanced BST of 200 000 keys, 20 000 lookups (an in-order list per call times out)', 'Hiệu năng: BST cân bằng 200 000 khoá, 20 000 lần tra (dựng danh sách in-order mỗi lần thì hết giờ)'],
    than: CAY_LON + ' var s = 0, nulls = 0; for (var q = 0; q < 20000; q++) { var r = lockerFloorCeil(root, R(n * 5 + 10) - 5); if (r[0] === null) nulls++; else s += r[0]; if (r[1] === null) nulls++; else s += r[1]; } return [s, nulls];',
  }],
  saiMau: [
    { ten: ['O(n) per call: in-order list + linear scan', 'O(n) mỗi lần: danh sách in-order + quét tuyến tính'], chiHieuNang: true, ma: 'function lockerFloorCeil(root, x) {\n  var a = [];\n  (function io(n) { if (!n) return; io(n.left); a.push(n.val); io(n.right); })(root);\n  var f = null, c = null;\n  for (var v of a) { if (v <= x) f = v; if (v >= x && c === null) c = v; }\n  return [f, c];\n}\n' },
    { ten: ['Uses 0 for "none"', 'Dùng 0 cho "không có"'], ma: 'function lockerFloorCeil(root, x) {\n  var f = 0, c = 0, n = root;\n  while (n) { if (n.val === x) return [x, x]; if (n.val < x) { f = n.val; n = n.right; } else { c = n.val; n = n.left; } }\n  return [f || null, c || null];\n}\n' },
  ],
});

/* ── 3. In-order phải tăng dần: tìm hai khoá bị đổi chỗ ── */
function findSwapped(root) {
  var prev = null, first = null, second = null;
  var stack = [], node = root;
  while (node !== null || stack.length) { // iterative in-order: safe for deep trees
    while (node !== null) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (prev !== null && prev.val > node.val) { // a "descent" in what must be an increasing sequence
      if (first === null) first = prev;         // first descent: the bigger one is misplaced
      second = node;                            // last descent: the smaller one is misplaced
    }
    prev = node;
    node = node.right;
  }
  if (first === null) return [];
  return [second.val, first.val]; // ascending
}
const D3 = bai({
  ten: 'Data-entry slip: find the two swapped keys in a BST', kho: 'HARD', phut: 25,
  en: `<p>A night job rebuilt the student-ID index (a BST with distinct keys) and a bug <b>swapped the keys of exactly two nodes</b> — or, on a lucky night, did nothing. The shape of the tree is fine; only two values are in each other's place.</p>
<p>Write <code>findSwapped(root)</code> returning the two swapped keys in ascending order <code>[small, big]</code>, or <code>[]</code> if the tree is a valid BST. Do not modify the tree.</p>`,
  vi: `<p>Một job chạy đêm dựng lại chỉ mục mã sinh viên (BST, khoá đôi một khác nhau) và một lỗi đã <b>đổi chỗ khoá của đúng hai nút</b> — hoặc, đêm may mắn, không làm gì. Hình dạng cây vẫn đúng; chỉ có hai giá trị nằm nhầm chỗ của nhau.</p>
<p>Viết <code>findSwapped(root)</code> trả về hai khoá bị đổi theo thứ tự tăng <code>[nhỏ, lớn]</code>, hoặc <code>[]</code> nếu cây là BST hợp lệ. Không sửa cây.</p>`,
  dauVao: ['root — tree node or null.', 'root — nút cây hoặc null.'],
  dauRa: ['[small, big] or [].', '[nhỏ, lớn] hoặc [].'],
  rangBuoc: [['0 ≤ nodes ≤ 10⁵; depth up to 1000.', '0 ≤ số nút ≤ 10⁵; độ sâu tới 1000.'], ['Target: O(n) time, O(h) memory.', 'Mục tiêu: O(n) thời gian, O(h) bộ nhớ.']],
  goiY: [
    ['The in-order traversal of a valid BST is strictly increasing. What does the sequence look like after swapping two values?', 'Duyệt giữa (in-order) một BST hợp lệ cho dãy tăng ngặt. Sau khi đổi chỗ hai giá trị, dãy trông thế nào?'],
    ['Look for "descents" (<code>prev &gt; cur</code>). Two non-adjacent keys give two descents: the big key is <code>prev</code> of the FIRST descent, the small key is <code>cur</code> of the LAST. Adjacent keys give only one descent — then both come from it.', 'Tìm các chỗ "giảm" (<code>prev &gt; cur</code>). Hai khoá không kề nhau cho hai chỗ giảm: khoá lớn là <code>prev</code> của chỗ giảm ĐẦU, khoá nhỏ là <code>cur</code> của chỗ giảm CUỐI. Hai khoá kề nhau chỉ cho một chỗ giảm — khi đó cả hai lấy từ chỗ đó.'],
  ],
  loi: [
    ['Checking each node only against its own children (<code>left.val &lt; val &lt; right.val</code>): a swap between distant nodes passes that local test — the same trap as in Validate BST.', 'Chỉ so mỗi nút với hai con của nó (<code>left.val &lt; val &lt; right.val</code>): đổi chỗ giữa hai nút xa nhau vẫn qua phép thử cục bộ đó — đúng cái bẫy của Validate BST.'],
    ['Taking both keys from the first descent only: wrong when the swapped keys are not neighbours in sorted order.', 'Lấy cả hai khoá từ chỗ giảm đầu tiên: sai khi hai khoá bị đổi không đứng cạnh nhau trong thứ tự sắp.'],
  ],
  gt: ['In-order turns the BST into its sorted sequence. Swapping two values creates either one descent (if they were adjacent in sorted order) or two descents; in both cases the larger misplaced key is the left element of the first descent and the smaller one is the right element of the last descent, which is exactly what the two variables record. An explicit stack keeps memory at O(h) and avoids recursion; one pass ⇒ O(n) time.', 'In-order biến BST thành dãy đã sắp. Đổi chỗ hai giá trị tạo ra hoặc một chỗ giảm (nếu chúng kề nhau trong thứ tự sắp), hoặc hai chỗ giảm; trong cả hai trường hợp, khoá lớn nằm sai là phần tử trái của chỗ giảm đầu, khoá nhỏ là phần tử phải của chỗ giảm cuối — đúng thứ hai biến ghi lại. Ngăn xếp tự quản giữ bộ nhớ O(h) và không cần đệ quy; một lượt ⇒ O(n) thời gian.'],
  kn: ['in-order traversal', 'binary search tree'],
  tns: [tn('in-order', 'duyệt giữa (trái–gốc–phải)'), tn('descent', 'chỗ giảm', 'cặp liền nhau mà phần tử trước lớn hơn phần tử sau.'), tn('invariant', 'bất biến')],
  dau: `/**
 * root: { val, left, right } | null — a BST in which the keys of two nodes may have been swapped
 * returns [small, big] (the swapped keys, ascending) or [] if the tree is a valid BST
 */
function findSwapped(root) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — iterative in-order; first descent gives the big key, last descent the small key.\n' + nguon(findSwapped),
  cases: [
    { ...T('findSwapped', [40, 20, 60, 10, 50, 30, 70]), moTa: ['30 and 50 swapped across the root', '30 và 50 bị đổi qua hai phía gốc'] },
    { ...T('findSwapped', [40, 30, 60, 10, 20]), moTa: ['Neighbours 20 and 30 swapped: one descent', 'Hai khoá kề nhau 20 và 30: một chỗ giảm'] },
    { ...T('findSwapped', [40, 20, 60, 10, 30, 50, 70]), moTa: ['Valid BST ⇒ []', 'BST hợp lệ ⇒ []'] },
    { ...T('findSwapped', []), an: true },
    { ...T('findSwapped', [10, 40]), an: true, moTa: ['Two nodes, swapped root and child', 'Hai nút, đổi gốc với con'] },
    { ...T('findSwapped', [70, 20, 60, 10, 30, 50, 40]), an: true, moTa: ['The root itself is misplaced', 'Chính gốc nằm sai chỗ'] },
    { ...T('findSwapped', [8, 3, 10, 1, 6, null, 14, null, null, 4, 13, 7]), an: true },
    { goi: boc('findSwapped(__cay((function () { var a = [0]; for (var i = 1; i < 1000; i++) a.push(null, i * 10); var t = a[2]; a[2] = a[1996]; a[1996] = t; return a; })()))'), an: true, moTa: ['Depth 1000 chain, keys 10 and 9980 swapped', 'Chuỗi sâu 1000, đổi khoá 10 và 9980'] },
  ],
  saiMau: [
    { ten: ['Local check against children only', 'Chỉ so cục bộ với hai con'], ma: 'function findSwapped(root) {\n  var bad = [];\n  (function go(n) { if (!n) return; if (n.left && n.left.val > n.val) bad.push(n.left.val, n.val); if (n.right && n.right.val < n.val) bad.push(n.val, n.right.val); go(n.left); go(n.right); })(root);\n  if (!bad.length) return [];\n  return [Math.min.apply(null, bad), Math.max.apply(null, bad)];\n}\n' },
    { ten: ['Both keys from the first descent', 'Lấy cả hai khoá từ chỗ giảm đầu'], ma: 'function findSwapped(root) {\n  var a = [];\n  (function io(n) { if (!n) return; io(n.left); a.push(n.val); io(n.right); })(root);\n  for (var i = 1; i < a.length; i++) if (a[i - 1] > a[i]) return [a[i], a[i - 1]];\n  return [];\n}\n' },
  ],
});

export default mod('dsa-5-3-bst', '5.3 Binary search trees: prune, floor/ceil, in-order', [D1, D2, D3]);
