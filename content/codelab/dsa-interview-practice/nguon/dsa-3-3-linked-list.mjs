/** Coding Interview Prep · 3.3 — Danh sách liên kết: nút giả khi chèn, cắt-nối khi xoay, hai danh sách phụ khi tách ổn định, merge sort trên danh sách. Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon, TAO } from './_dsa.mjs';

const NUT = `<p>A node is <code>{ val, next }</code>; the list ends with <code>next === null</code>, and an empty list is <code>null</code>. The grader builds the list from an array, calls your function, and reads the returned list back into an array.</p>`;
const NUT_VI = `<p>Một nút là <code>{ val, next }</code>; danh sách kết thúc khi <code>next === null</code>, danh sách rỗng là <code>null</code>. Máy chấm dựng danh sách từ một mảng, gọi hàm của bạn, rồi đọc danh sách trả về thành mảng.</p>`;
const ds = (fn, a, ...rest) => `__raDs(${fn}(__ds(${JSON.stringify(a)})${rest.map((x) => `, ${JSON.stringify(x)}`).join('')}))`;
const hienDs = (fn, a, ...rest) => `${fn}(list ${JSON.stringify(a)}${rest.map((x) => `, ${JSON.stringify(x)}`).join('')})`;
/** ca danh sách: goi dùng __ds/__raDs (boc), hien là chữ dễ đọc */
const ca = (o, fn, a, ...rest) => ({ ...o, goi: `(function () {\n${TAO}\nreturn (${ds(fn, a, ...rest)});\n})()`, hien: hienDs(fn, a, ...rest) });

/* ── 1. Nút giả: chèn một đăng ký vào danh sách đã sắp ── */
function insertSorted(head, val) {
  var dummy = { val: 0, next: head }; // a fake node BEFORE the head: inserting at the front is no longer a special case
  var prev = dummy;
  // walk while the next node is <= val, so equal values keep their order (the new one goes after them)
  while (prev.next !== null && prev.next.val <= val) prev = prev.next;
  prev.next = { val: val, next: prev.next };
  return dummy.next; // the head may have changed
}

/* ── 2. Cắt và nối: đưa k bài cuối của playlist lên đầu ── */
function moveLastToFront(head, k) {
  if (head === null) return null;
  var n = 1, tail = head;
  while (tail.next !== null) { tail = tail.next; n++; } // one pass: length + tail
  k = k % n;                                           // k may be far larger than the list
  if (k === 0) return head;
  var newTail = head;
  for (var i = 1; i < n - k; i++) newTail = newTail.next; // the (n-k)-th node becomes the new tail
  var newHead = newTail.next;
  newTail.next = null; // cut…
  tail.next = head;    // …and glue the old tail to the old head
  return newHead;
}

/* ── 3. Hai danh sách phụ: tách ổn định theo mức ưu tiên ── */
function priorityFirst(head, x) {
  var lowDummy = { val: 0, next: null }, highDummy = { val: 0, next: null };
  var low = lowDummy, high = highDummy; // tails of the two lists being built
  for (var cur = head; cur !== null; cur = cur.next) {
    if (cur.val < x) { low.next = cur; low = cur; }   // append at the TAIL ⇒ relative order is kept
    else { high.next = cur; high = cur; }
  }
  high.next = null;         // the last "high" node may still point into the old list — cut it, or you get a cycle
  low.next = highDummy.next; // glue: all urgent tickets, then the rest
  return lowDummy.next;
}

/* ── 4. Merge sort trên danh sách liên kết ── */
function mergeLists(a, b) {
  var dummy = { val: 0, next: null }, tail = dummy;
  while (a !== null && b !== null) {      // ITERATIVE merge: a recursive one is n frames deep
    if (a.val <= b.val) { tail.next = a; a = a.next; } // <= keeps equal timestamps in their original order (stable)
    else { tail.next = b; b = b.next; }
    tail = tail.next;
  }
  tail.next = a !== null ? a : b;
  return dummy.next;
}
function sortLog(head) {
  if (head === null || head.next === null) return head;
  var slow = head, fast = head.next;      // fast starts one ahead ⇒ slow stops at the END of the left half
  while (fast !== null && fast.next !== null) { slow = slow.next; fast = fast.next.next; }
  var right = slow.next;
  slow.next = null;                        // split into two lists
  return mergeLists(sortLog(head), sortLog(right)); // recursion depth is only log2(n)
}

const D1 = bai({
  ten: 'Exam registration: insert into a sorted linked list', kho: 'EASY', phut: 15,
  en: `<p>The exam office keeps re-take registrations as a singly linked list ordered by registration number (ascending). Late registrations arrive one at a time and must be inserted <b>in place</b>, keeping the order; if the number already exists, the new node goes <b>after</b> the existing ones.</p>
<p>Write <code>insertSorted(head, val)</code> that inserts a new node with value <code>val</code> and returns the head of the list (which changes when the new value is the smallest).</p>${NUT}`,
  vi: `<p>Phòng khảo thí giữ danh sách đăng ký thi lại dưới dạng danh sách liên kết đơn sắp theo số đăng ký (tăng dần). Đăng ký muộn đến từng cái một và phải được chèn <b>tại chỗ</b>, giữ thứ tự; nếu số đó đã có, nút mới đứng <b>sau</b> các nút sẵn có.</p>
<p>Viết <code>insertSorted(head, val)</code> chèn một nút mới giá trị <code>val</code> và trả về đầu danh sách (đầu đổi khi giá trị mới là nhỏ nhất).</p>${NUT_VI}`,
  dauVao: ['head — a sorted list (or null); val — an integer.', 'head — danh sách đã sắp (hoặc null); val — số nguyên.'],
  dauRa: ['The head of the list after insertion.', 'Đầu danh sách sau khi chèn.'],
  rangBuoc: [['0 ≤ length ≤ 10⁴.', '0 ≤ độ dài ≤ 10⁴.'], ['O(n) time, O(1) extra memory — do not copy into an array.', 'O(n) thời gian, O(1) bộ nhớ phụ — đừng chép ra mảng.']],
  goiY: [
    ['There are three cases: empty list, insert before the head, insert somewhere after it. A <b>dummy node</b> in front of the head turns them into one case.', 'Có ba trường hợp: danh sách rỗng, chèn trước đầu, chèn đâu đó phía sau. Một <b>nút giả</b> đặt trước đầu biến chúng thành một trường hợp.'],
    ['Walk a pointer <code>prev</code> from the dummy while <code>prev.next.val &lt;= val</code>; then link the new node between <code>prev</code> and <code>prev.next</code>; return <code>dummy.next</code>.', 'Đi con trỏ <code>prev</code> từ nút giả khi <code>prev.next.val &lt;= val</code>; rồi nối nút mới giữa <code>prev</code> và <code>prev.next</code>; trả về <code>dummy.next</code>.'],
  ],
  loi: [
    ['Returning the old <code>head</code> unconditionally: when <code>val</code> is the smallest the new node is lost.', 'Luôn trả về <code>head</code> cũ: khi <code>val</code> nhỏ nhất thì nút mới bị mất.'],
    ['Reading <code>cur.next.val</code> without checking <code>cur.next !== null</code> ⇒ <code>TypeError</code> when inserting at the end or into an empty list.', 'Đọc <code>cur.next.val</code> mà không kiểm <code>cur.next !== null</code> ⇒ <code>TypeError</code> khi chèn ở cuối hoặc vào danh sách rỗng.'],
    ['Overwriting <code>prev.next</code> before saving it: the rest of the list is cut off. Create the node as <code>{ val, next: prev.next }</code> first.', 'Ghi đè <code>prev.next</code> trước khi giữ lại nó: phần còn lại của danh sách bị cắt mất. Tạo nút <code>{ val, next: prev.next }</code> trước.'],
  ],
  gt: ['The dummy node guarantees every real node, including the head, has a predecessor, so "insert after prev" covers all positions. The loop stops at the last node whose value is ≤ val, which puts duplicates in arrival order. One walk ⇒ O(n) time, O(1) extra memory (one new node).', 'Nút giả bảo đảm mọi nút thật, kể cả đầu, đều có nút đứng trước, nên "chèn sau prev" phủ mọi vị trí. Vòng lặp dừng ở nút cuối cùng có giá trị ≤ val, nên giá trị trùng đứng theo thứ tự đến. Một lượt đi ⇒ O(n) thời gian, O(1) bộ nhớ phụ (một nút mới).'],
  kn: ['linked list', 'dummy node'],
  tns: [tn('dummy (sentinel) node', 'nút giả (lính canh)', 'nút đặt trước đầu để mọi nút đều có nút đứng trước.'), tn('singly linked list', 'danh sách liên kết đơn'), tn('in place', 'tại chỗ', 'sửa liên kết, không dựng cấu trúc mới.')],
  dau: `/**
 * head: { val, next } | null — sorted ascending; val: number
 * returns the head after inserting a new node with value val (after any equal values)
 */
function insertSorted(head, val) {
  // Write your solution here
  return head;
}
`,
  giai: '// Reference solution — dummy node, one walk.\n' + nguon(insertSorted),
  cases: [
    ca({}, 'insertSorted', [101, 105, 110], 107),
    ca({ moTa: ['New smallest value ⇒ new head', 'Giá trị nhỏ nhất mới ⇒ đầu mới'] }, 'insertSorted', [101, 105], 99),
    ca({ moTa: ['Empty list', 'Danh sách rỗng'] }, 'insertSorted', [], 5),
    ca({ an: true, moTa: ['Insert at the end', 'Chèn ở cuối'] }, 'insertSorted', [1, 2, 3], 9),
    ca({ an: true }, 'insertSorted', [4, 4, 4], 4),
    ca({ an: true }, 'insertSorted', [-5, 0, 5], -1),
    ca({ an: true }, 'insertSorted', [7], 7),
  ],
  saiMau: [
    { ten: ['Always returns the old head', 'Luôn trả về đầu cũ'], ma: 'function insertSorted(head, val) {\n  if (!head) return { val: val, next: null };\n  var cur = head;\n  while (cur.next && cur.next.val <= val) cur = cur.next;\n  cur.next = { val: val, next: cur.next };\n  return head;\n}\n' },
  ],
});

const D2 = bai({
  ten: 'Playlist: move the last k songs to the front', kho: 'MEDIUM', phut: 20,
  en: `<p>The campus radio stores tonight's playlist as a singly linked list. The DJ wants the last <code>k</code> songs moved to the front, in the same order (a "rotation"). <code>k</code> comes from a slider and can be much larger than the playlist — rotating by the list length gives the same playlist back.</p>
<p>Write <code>moveLastToFront(head, k)</code> that does this by <b>relinking</b> nodes and returns the new head.</p>${NUT}`,
  vi: `<p>Đài phát thanh của trường lưu playlist tối nay dưới dạng danh sách liên kết đơn. DJ muốn đưa <code>k</code> bài cuối lên đầu, giữ nguyên thứ tự (một phép "xoay"). <code>k</code> lấy từ một thanh trượt và có thể lớn hơn nhiều so với playlist — xoay đúng bằng độ dài danh sách thì ra lại playlist cũ.</p>
<p>Viết <code>moveLastToFront(head, k)</code> làm việc đó bằng cách <b>nối lại</b> các nút và trả về đầu mới.</p>${NUT_VI}`,
  dauVao: ['head — a list (or null); k — integer ≥ 0.', 'head — danh sách (hoặc null); k — số nguyên ≥ 0.'],
  dauRa: ['The new head.', 'Đầu mới.'],
  rangBuoc: [['0 ≤ length ≤ 200 000; 0 ≤ k ≤ 2·10⁹.', '0 ≤ độ dài ≤ 200 000; 0 ≤ k ≤ 2·10⁹.'], ['Target: O(n) time, O(1) extra memory.', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ phụ.']],
  goiY: [
    ['Rotating one song at a time is k walks to the tail. Instead: how many songs stay at the back? <code>n − (k mod n)</code>.', 'Xoay từng bài một là k lần đi tới đuôi. Thay vào đó: bao nhiêu bài ở lại phía sau? <code>n − (k mod n)</code>.'],
    ['One pass finds n and the tail. Reduce <code>k %= n</code> (0 ⇒ unchanged). Walk to node number n − k: it becomes the new tail, its <code>next</code> is the new head; cut there and attach the old tail to the old head.', 'Một lượt tìm n và đuôi. Rút gọn <code>k %= n</code> (0 ⇒ giữ nguyên). Đi tới nút thứ n − k: nó thành đuôi mới, <code>next</code> của nó là đầu mới; cắt ở đó và nối đuôi cũ vào đầu cũ.'],
  ],
  loi: [
    ['Forgetting <code>k %= n</code>: with k = 2·10⁹ the "walk n − k steps" goes negative, or a step-by-step loop runs two billion times.', 'Quên <code>k %= n</code>: với k = 2·10⁹ thì "đi n − k bước" thành số âm, hoặc vòng xoay từng bước chạy hai tỉ lần.'],
    ['Not cutting <code>newTail.next = null</code>: the list becomes a cycle and anything that walks it never ends.', 'Không cắt <code>newTail.next = null</code>: danh sách thành vòng và mọi thứ đi trên nó chạy mãi.'],
    ['Off-by-one when walking to the new tail (n − k nodes, i.e. n − k − 1 steps from the head): the playlist is rotated by k ± 1.', 'Lệch một khi đi tới đuôi mới (n − k nút, tức n − k − 1 bước từ đầu): playlist bị xoay k ± 1.'],
    ['Rotating one song per step (walk to the tail, move it to the front) k mod n times: O(n·k) — the 200 000-song check times out.', 'Xoay từng bài (đi tới đuôi, đưa lên đầu) k mod n lần: O(n·k) — kiểm 200 000 bài hết giờ.'],
  ],
  gt: ['A rotation by k is one cut and one glue: the last k nodes keep their order and the first n − k keep theirs. After reducing k modulo n (rotating by n is the identity) we need the node at position n − k, which takes at most one more walk. Total two passes ⇒ O(n) time, O(1) extra memory, no node is copied. The step-by-step version costs O(n) per song moved ⇒ O(n·k).', 'Xoay k là một lần cắt và một lần nối: k nút cuối giữ thứ tự của chúng, n − k nút đầu giữ thứ tự của chúng. Sau khi rút k modulo n (xoay n là giữ nguyên) ta cần nút ở vị trí n − k, tốn thêm tối đa một lượt đi. Tổng hai lượt ⇒ O(n) thời gian, O(1) bộ nhớ phụ, không chép nút nào. Bản xoay từng bước tốn O(n) cho mỗi bài được chuyển ⇒ O(n·k).'],
  kn: ['linked list', 'rotation'],
  tns: [tn('rotate', 'xoay'), tn('tail', 'đuôi (nút cuối)'), tn('relink', 'nối lại liên kết'), tn('cycle', 'vòng (chu trình)')],
  dau: `/**
 * head: { val, next } | null, k: number
 * returns the new head after moving the last k nodes to the front
 */
function moveLastToFront(head, k) {
  // Write your solution here
  return head;
}
`,
  giai: '// Reference solution — length + tail in one pass, k %= n, cut once, glue once.\n' + nguon(moveLastToFront),
  cases: [
    ca({}, 'moveLastToFront', ['intro', 'song A', 'song B', 'song C', 'outro'], 2),
    ca({ moTa: ['k larger than the playlist (7 % 3 = 1)', 'k lớn hơn playlist (7 % 3 = 1)'] }, 'moveLastToFront', [1, 2, 3], 7),
    ca({ moTa: ['k = 0 ⇒ unchanged', 'k = 0 ⇒ giữ nguyên'] }, 'moveLastToFront', [1, 2, 3], 0),
    ca({ an: true }, 'moveLastToFront', [], 5),
    ca({ an: true, moTa: ['k = n ⇒ unchanged', 'k = n ⇒ giữ nguyên'] }, 'moveLastToFront', [1, 2, 3, 4], 4),
    ca({ an: true }, 'moveLastToFront', [9], 1000000000),
    ca({ an: true, moTa: ['Huge k', 'k rất lớn'] }, 'moveLastToFront', [1, 2, 3, 4, 5, 6], 2000000001),
    ca({ an: true }, 'moveLastToFront', [1, 2], 1),
  ],
  perf: [{
    moTa: ['Performance: 200 000 songs, k = 100 000 (rotating one song at a time is O(n·k))', 'Hiệu năng: 200 000 bài, k = 100 000 (xoay từng bài là O(n·k))'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = i; var r = __raDs(moveLastToFront(__ds(a), 100000 + 3 * n)), s = 0; for (var j = 0; j < r.length; j += 1000) s += r[j] * (j + 1); return { length: r.length, first: r.slice(0, 3), last: r[r.length - 1], checksum: s };',
  }],
  saiMau: [
    { ten: ['O(n·k): move the tail to the front k % n times', 'O(n·k): đưa đuôi lên đầu k % n lần'], chiHieuNang: true, ma: 'function moveLastToFront(head, k) {\n  if (!head || !head.next) return head;\n  var n = 0; for (var c = head; c; c = c.next) n++;\n  for (var s = 0; s < k % n; s++) { var p = head; while (p.next.next) p = p.next; var t = p.next; p.next = null; t.next = head; head = t; }\n  return head;\n}\n' },
    { ten: ['Walks one node too far (rotates by k − 1)', 'Đi quá một nút (xoay k − 1)'], ma: 'function moveLastToFront(head, k) {\n  if (!head) return null;\n  var n = 1, tail = head; while (tail.next) { tail = tail.next; n++; }\n  k %= n; if (!k) return head;\n  var nt = head; for (var i = 0; i < n - k; i++) nt = nt.next;\n  if (!nt || !nt.next) return head;\n  var nh = nt.next; nt.next = null; tail.next = head; return nh;\n}\n' },
  ],
});

const D3 = bai({
  ten: 'Help desk: urgent tickets first, order kept', kho: 'MEDIUM', phut: 20,
  en: `<p>The IT help desk queue is a linked list of ticket priority numbers (smaller = more urgent). Before the morning stand-up, every ticket with priority <b>below</b> <code>x</code> must move ahead of the others. Inside each part the original order must stay the same — people who reported first are served first.</p>
<p>Write <code>priorityFirst(head, x)</code> that rearranges the <b>existing nodes</b> and returns the new head.</p>${NUT}`,
  vi: `<p>Hàng đợi bộ phận hỗ trợ IT là danh sách liên kết các số ưu tiên của phiếu (số nhỏ = gấp hơn). Trước buổi họp sáng, mọi phiếu có ưu tiên <b>nhỏ hơn</b> <code>x</code> phải lên trước các phiếu còn lại. Trong mỗi phần, thứ tự ban đầu giữ nguyên — ai báo trước được xử lý trước.</p>
<p>Viết <code>priorityFirst(head, x)</code> sắp lại <b>các nút có sẵn</b> và trả về đầu mới.</p>${NUT_VI}`,
  dauVao: ['head — a list (or null); x — an integer.', 'head — danh sách (hoặc null); x — số nguyên.'],
  dauRa: ['The new head.', 'Đầu mới.'],
  rangBuoc: [['0 ≤ length ≤ 200 000.', '0 ≤ độ dài ≤ 200 000.'], ['O(n) time, O(1) extra memory.', 'O(n) thời gian, O(1) bộ nhớ phụ.']],
  goiY: [
    ['Build two separate lists while you walk: "urgent" and "the rest". Two dummy heads make the first append easy.', 'Vừa đi vừa dựng hai danh sách riêng: "gấp" và "còn lại". Hai nút giả làm lần thêm đầu tiên dễ dàng.'],
    ['Always append at the TAIL of each list (keep a tail pointer) — that is what keeps the order. At the end set the last node of "the rest" to <code>null</code> and glue the two lists.', 'Luôn thêm vào ĐUÔI mỗi danh sách (giữ con trỏ đuôi) — chính điều đó giữ thứ tự. Cuối cùng đặt nút cuối của "còn lại" trỏ <code>null</code> rồi nối hai danh sách.'],
  ],
  loi: [
    ['Moving urgent nodes to the FRONT of the list one by one: they end up in reverse order (<code>[5, 1, 2]</code>, x = 3 gives <code>[2, 1, 5]</code>).', 'Đưa từng nút gấp lên ĐẦU danh sách: chúng bị đảo ngược thứ tự (<code>[5, 1, 2]</code>, x = 3 ra <code>[2, 1, 5]</code>).'],
    ['Forgetting <code>high.next = null</code>: the last "rest" node still points to an urgent node behind it ⇒ a cycle.', 'Quên <code>high.next = null</code>: nút "còn lại" cuối vẫn trỏ tới một nút gấp phía sau nó ⇒ thành vòng.'],
    ['Using <code>&lt;=</code>: priority exactly <code>x</code> is not urgent.', 'Dùng <code>&lt;=</code>: ưu tiên đúng bằng <code>x</code> không phải gấp.'],
  ],
  gt: ['Every node is visited once and appended to the tail of exactly one of two lists, so each list keeps the original relative order (a stable partition). The dummies remove the "first node of a list" special case; cutting the tail of the second list prevents a cycle, because that node\'s old <code>next</code> may point to a node that moved. O(n) time, O(1) extra memory — no new nodes.', 'Mỗi nút được thăm một lần và gắn vào đuôi đúng một trong hai danh sách, nên mỗi danh sách giữ thứ tự tương đối ban đầu (tách ổn định). Nút giả bỏ trường hợp đặc biệt "nút đầu của danh sách"; cắt đuôi danh sách thứ hai chặn vòng lặp, vì <code>next</code> cũ của nút đó có thể trỏ tới một nút đã bị chuyển đi. O(n) thời gian, O(1) bộ nhớ phụ — không tạo nút mới.'],
  kn: ['linked list', 'stable partition', 'dummy node'],
  tns: [tn('stable partition', 'tách ổn định', 'chia hai nhóm mà giữ thứ tự trong mỗi nhóm.'), tn('tail pointer', 'con trỏ đuôi'), tn('cycle', 'vòng (chu trình)')],
  dau: `/**
 * head: { val, next } | null, x: number
 * returns the head after moving every node with val < x before the others (stable)
 */
function priorityFirst(head, x) {
  // Write your solution here
  return head;
}
`,
  giai: '// Reference solution — two dummy-headed lists appended at the tail, then glued.\n' + nguon(priorityFirst),
  cases: [
    ca({}, 'priorityFirst', [4, 1, 3, 2, 5, 2], 3),
    ca({ moTa: ['Order inside each part is kept', 'Thứ tự trong mỗi phần giữ nguyên'] }, 'priorityFirst', [5, 1, 2], 3),
    ca({ an: true }, 'priorityFirst', [], 3),
    ca({ an: true, moTa: ['Everything urgent', 'Tất cả đều gấp'] }, 'priorityFirst', [1, 2, 1], 9),
    ca({ an: true, moTa: ['Nothing urgent', 'Không có gì gấp'] }, 'priorityFirst', [7, 8, 9], 1),
    ca({ an: true, moTa: ['Priority equal to x is not urgent', 'Ưu tiên bằng x không gấp'] }, 'priorityFirst', [3, 3, 2, 3, 1], 3),
    ca({ an: true, moTa: ['The last node is urgent (cycle trap)', 'Nút cuối là gấp (bẫy thành vòng)'] }, 'priorityFirst', [6, 7, 1], 5),
  ],
  saiMau: [
    { ten: ['Moves urgent nodes to the front (reverses them)', 'Đưa nút gấp lên đầu (đảo ngược chúng)'], ma: 'function priorityFirst(head, x) {\n  var d = { next: head }, prev = d, cur = head;\n  while (cur) { var nx = cur.next; if (cur.val < x && prev !== d) { prev.next = nx; cur.next = d.next; d.next = cur; } else prev = cur; cur = nx; }\n  return d.next;\n}\n' },
    { ten: ['Forgets to cut the tail (cycle)', 'Quên cắt đuôi (thành vòng)'], ma: 'function priorityFirst(head, x) {\n  var ld = { next: null }, hd = { next: null }, l = ld, h = hd;\n  for (var c = head; c; c = c.next) { if (c.val < x) { l.next = c; l = c; } else { h.next = c; h = c; } }\n  l.next = hd.next;\n  return ld.next;\n}\n' },
  ],
});

const D4 = bai({
  ten: 'Lab logs: sort a linked list of timestamps', kho: 'HARD', phut: 35,
  en: `<p>Each PC in a lab streams its log lines into one shared singly linked list, so the timestamps (seconds, integers) arrive out of order. Write <code>sortLog(head)</code> that sorts the list ascending by <b>relinking nodes</b> and returns the new head. Equal timestamps must keep their original relative order.</p>
<p>The list can hold 200 000 lines. Interview follow-up you should be ready for: "now do it without copying the values into an array".</p>${NUT}`,
  vi: `<p>Mỗi máy trong phòng lab đẩy dòng log vào một danh sách liên kết đơn dùng chung, nên các mốc thời gian (giây, số nguyên) đến lộn xộn. Viết <code>sortLog(head)</code> sắp danh sách tăng dần bằng cách <b>nối lại các nút</b> và trả về đầu mới. Mốc bằng nhau phải giữ thứ tự tương đối ban đầu.</p>
<p>Danh sách có thể dài 200 000 dòng. Câu hỏi nối tiếp nên chuẩn bị: "giờ làm mà không chép giá trị ra mảng".</p>${NUT_VI}`,
  dauVao: ['head — a list (or null).', 'head — danh sách (hoặc null).'],
  dauRa: ['The head of the sorted list.', 'Đầu danh sách đã sắp.'],
  rangBuoc: [['0 ≤ length ≤ 200 000; 0 ≤ val ≤ 10⁹.', '0 ≤ độ dài ≤ 200 000; 0 ≤ val ≤ 10⁹.'], ['Target: O(n log n) time; recursion depth must stay small.', 'Mục tiêu: O(n log n) thời gian; độ sâu đệ quy phải nhỏ.']],
  goiY: [
    ['Insertion sort is natural on a list but O(n²). Merge sort only needs "split in half" and "merge two sorted lists" — both are cheap on linked lists (no random access needed).', 'Sắp xếp chèn rất tự nhiên trên danh sách nhưng O(n²). Merge sort chỉ cần "chia đôi" và "trộn hai danh sách đã sắp" — cả hai đều rẻ trên danh sách liên kết (không cần truy cập ngẫu nhiên).'],
    ['Split with slow/fast pointers (start fast one node ahead so slow stops at the end of the left half), cut, sort both halves recursively (depth log n), then merge with a dummy node.', 'Chia bằng con trỏ chậm/nhanh (cho nhanh đi trước một nút để chậm dừng ở cuối nửa trái), cắt, sắp hai nửa bằng đệ quy (sâu log n), rồi trộn với nút giả.'],
    ['Write the MERGE as a loop. A recursive merge goes one frame deeper per node: 200 000 frames overflow the call stack.', 'Viết bước TRỘN bằng vòng lặp. Trộn đệ quy sâu thêm một tầng mỗi nút: 200 000 tầng làm tràn call stack.'],
  ],
  loi: [
    ['Recursive <code>merge(a, b)</code>: correct and pretty, but its depth is the length of the result — <code>RangeError: Maximum call stack size exceeded</code> on the 200 000-line check.', '<code>merge(a, b)</code> đệ quy: đúng và đẹp, nhưng độ sâu bằng độ dài kết quả — <code>RangeError: Maximum call stack size exceeded</code> ở kiểm 200 000 dòng.'],
    ['Splitting with slow = fast = head on a 2-node list: slow ends on the 2nd node, the "left half" is the whole list ⇒ infinite recursion. Start <code>fast = head.next</code>.', 'Chia với slow = fast = head trên danh sách 2 nút: slow dừng ở nút thứ 2, "nửa trái" là cả danh sách ⇒ đệ quy vô hạn. Bắt đầu <code>fast = head.next</code>.'],
    ['Merging with <code>&lt;</code> instead of <code>&lt;=</code>: equal timestamps from the right half jump ahead — the sort is no longer stable.', 'Trộn bằng <code>&lt;</code> thay vì <code>&lt;=</code>: mốc bằng nhau ở nửa phải nhảy lên trước — phép sắp không còn ổn định.'],
    ['Insertion sort: O(n²) ≈ 10¹⁰ steps for 200 000 lines.', 'Sắp xếp chèn: O(n²) ≈ 10¹⁰ bước với 200 000 dòng.'],
  ],
  gt: ['Top-down merge sort: each level of recursion splits every sublist in half with slow/fast pointers (O(n) per level) and merges pairs back (O(n) per level); there are ⌈log₂ n⌉ levels ⇒ O(n log n) time. Recursion depth is log₂ n ≈ 18 for 200 000 nodes, and the merge is a loop, so the call stack stays tiny; extra memory is O(log n). Taking from the left list on ties (<code>&lt;=</code>) makes it stable. (Bottom-up merge sort reaches O(1) extra memory — a good follow-up answer.)', 'Merge sort từ trên xuống: mỗi tầng đệ quy chia mọi danh sách con làm đôi bằng con trỏ chậm/nhanh (O(n) mỗi tầng) rồi trộn lại từng cặp (O(n) mỗi tầng); có ⌈log₂ n⌉ tầng ⇒ O(n log n) thời gian. Độ sâu đệ quy là log₂ n ≈ 18 với 200 000 nút, và bước trộn là vòng lặp, nên call stack rất nhỏ; bộ nhớ phụ O(log n). Lấy từ danh sách trái khi bằng nhau (<code>&lt;=</code>) làm phép sắp ổn định. (Merge sort từ dưới lên đạt O(1) bộ nhớ phụ — một câu trả lời tốt cho câu hỏi nối tiếp.)'],
  kn: ['linked list', 'merge sort', 'slow/fast pointers'],
  tns: [tn('merge sort', 'sắp xếp trộn'), tn('stable sort', 'sắp xếp ổn định', 'phần tử bằng nhau giữ thứ tự ban đầu.'), tn('call stack overflow', 'tràn ngăn xếp lời gọi'), tn('slow/fast pointers', 'con trỏ chậm/nhanh')],
  dau: `/**
 * head: { val, next } | null
 * returns the head of the list sorted ascending (stable), by relinking nodes
 */
function sortLog(head) {
  // Write your solution here
  return head;
}
`,
  giai: '// Reference solution — top-down merge sort: split with slow/fast, ITERATIVE stable merge.\n' + nguon(mergeLists, sortLog),
  cases: [
    ca({}, 'sortLog', [1730, 1712, 1745, 1700, 1712]),
    ca({ moTa: ['Already sorted', 'Đã sắp sẵn'] }, 'sortLog', [1, 2, 3, 4]),
    ca({ an: true }, 'sortLog', []),
    ca({ an: true }, 'sortLog', [42]),
    ca({ an: true, moTa: ['Two nodes (split trap)', 'Hai nút (bẫy khi chia)'] }, 'sortLog', [9, 3]),
    ca({ an: true }, 'sortLog', [5, 4, 3, 2, 1, 0]),
    ca({ an: true }, 'sortLog', [7, 7, 1, 7, 1, 0, 7]),
  ],
  perf: [{
    moTa: ['Performance: 200 000 log lines (insertion sort is O(n²); a recursive merge overflows the stack)', 'Hiệu năng: 200 000 dòng log (sắp chèn là O(n²); trộn đệ quy làm tràn stack)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = R(1000000000); var r = __raDs(sortLog(__ds(a))), ok = r.length === n, s = 0; for (var j = 1; j < r.length; j++) if (r[j - 1] > r[j]) ok = false; for (var k = 0; k < r.length; k += 1000) s = (s + r[k]) % 1000000007; return { length: r.length, sorted: ok, first: r[0], last: r[r.length - 1], checksum: s };',
  }],
  saiMau: [
    { ten: ['O(n²): insertion sort on the list', 'O(n²): sắp chèn trên danh sách'], chiHieuNang: true, ma: 'function sortLog(head) {\n  var d = { next: null };\n  while (head) { var nx = head.next, p = d; while (p.next && p.next.val <= head.val) p = p.next; head.next = p.next; p.next = head; head = nx; }\n  return d.next;\n}\n' },
    { ten: ['Recursive merge (call stack overflows at 200 000 nodes)', 'Trộn đệ quy (tràn call stack ở 200 000 nút)'], chiHieuNang: true, ma: 'function merge(a, b) {\n  if (!a) return b; if (!b) return a;\n  if (a.val <= b.val) { a.next = merge(a.next, b); return a; }\n  b.next = merge(a, b.next); return b;\n}\nfunction sortLog(head) {\n  if (!head || !head.next) return head;\n  var s = head, f = head.next; while (f && f.next) { s = s.next; f = f.next.next; }\n  var r = s.next; s.next = null;\n  return merge(sortLog(head), sortLog(r));\n}\n' },
  ],
});

export default mod('dsa-3-3-linked-list', '3.3 Linked list: dummy nodes, cut & glue, merge sort', [D1, D2, D3, D4]);
