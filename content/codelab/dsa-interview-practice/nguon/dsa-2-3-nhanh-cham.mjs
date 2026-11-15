/** Coding Interview Prep · 2.3 — Con trỏ nhanh chậm: cách nhau k nút, điểm giữa (chia đôi, xoá giữa), chu trình trên danh sách ẩn (Floyd: đuôi μ + vòng λ). Đề tự soạn. */
import { mod, bai, tn, nguon, boc } from './_dsa.mjs';

/* ── 1. Hai con trỏ cách nhau k nút: phần tử thứ k từ cuối ── */
function kthFromEnd(head, k) {
  var fast = head;
  for (var i = 0; i < k; i++) {      // move `fast` k nodes ahead
    if (fast === null) return null;  // the list is shorter than k
    fast = fast.next;
  }
  var slow = head;
  while (fast !== null) {            // keep the k-node gap until fast falls off the end
    fast = fast.next;
    slow = slow.next;
  }
  return slow.val;                   // slow is now exactly k nodes before the end
}
const F1 = bai({
  ten: 'Print queue: the k-th job from the end, in one pass', kho: 'EASY', phut: 10, ham: 'kthFromEnd',
  en: `<p>The library printer keeps its jobs in a <b>singly linked list</b>: each node is <code>{ val, next }</code>, <code>val</code> is the job name and the last node has <code>next === null</code>. The display wants to show the job that is <code>k</code>-th from the end (k = 1 is the last job), but the list does not store its length.</p>
<p>Write <code>kthFromEnd(head, k)</code> returning that node's <code>val</code>, or <code>null</code> if the list has fewer than k jobs. Try to do it in <b>one pass</b> without counting the length first.</p>`,
  vi: `<p>Máy in thư viện giữ các lệnh in trong một <b>danh sách liên kết đơn</b>: mỗi nút là <code>{ val, next }</code>, <code>val</code> là tên lệnh in và nút cuối có <code>next === null</code>. Màn hình muốn hiện lệnh in thứ <code>k</code> tính từ cuối (k = 1 là lệnh cuối), nhưng danh sách không lưu độ dài.</p>
<p>Viết <code>kthFromEnd(head, k)</code> trả về <code>val</code> của nút đó, hoặc <code>null</code> nếu danh sách có ít hơn k lệnh. Cố gắng làm trong <b>một lượt</b>, không đếm độ dài trước.</p>`,
  dauVao: ['head — first node { val, next } or null; k — integer ≥ 1.', 'head — nút đầu { val, next } hoặc null; k — số nguyên ≥ 1.'],
  dauRa: ['The val of the k-th node from the end, or null.', 'val của nút thứ k từ cuối, hoặc null.'],
  rangBuoc: [['0 ≤ length ≤ 10⁵; 1 ≤ k ≤ 10⁵. Tests build the list from an array: <code>__ds(["a","b","c"])</code>.', '0 ≤ độ dài ≤ 10⁵; 1 ≤ k ≤ 10⁵. Ca kiểm dựng danh sách từ mảng: <code>__ds(["a","b","c"])</code>.'], ['Target: O(n) time, O(1) memory.', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ.']],
  goiY: [
    ['Two pointers that stay exactly k nodes apart: when the front one falls off the end, where is the back one?', 'Hai con trỏ luôn cách nhau đúng k nút: khi con trỏ trước rơi khỏi cuối, con trỏ sau đang ở đâu?'],
    ['Move <code>fast</code> k steps first (if it hits null before that, return null). Then move both one step at a time until <code>fast === null</code>; answer <code>slow.val</code>.', 'Cho <code>fast</code> đi trước k bước (gặp null trước khi đủ thì trả null). Rồi cho cả hai đi từng bước tới khi <code>fast === null</code>; đáp án là <code>slow.val</code>.'],
  ],
  loi: [
    ['Stopping when <code>fast.next === null</code> instead of <code>fast === null</code>: you land one node too early (the (k+1)-th from the end).', 'Dừng khi <code>fast.next === null</code> thay vì <code>fast === null</code>: dừng sớm một nút (thành nút thứ k+1 từ cuối).'],
    ['Not checking for null while moving <code>fast</code> k steps: <code>k &gt; length</code> crashes with "Cannot read properties of null".', 'Không kiểm null khi cho <code>fast</code> đi k bước: <code>k &gt; độ dài</code> làm chương trình ném lỗi "Cannot read properties of null".'],
  ],
  gt: ['When fast is k nodes ahead and reaches null (one past the last node), slow is k nodes before that null, i.e. the k-th node from the end. One pass over the list ⇒ O(n) time, two pointers ⇒ O(1) memory. Counting the length then walking again is also O(n) but needs two passes — fine, but the gap trick is what the interviewer is looking for.', 'Khi fast đi trước k nút và chạm null (sau nút cuối một bước), slow cách null đó k nút, tức là nút thứ k từ cuối. Một lượt qua danh sách ⇒ O(n) thời gian, hai con trỏ ⇒ O(1) bộ nhớ. Đếm độ dài rồi đi lại cũng O(n) nhưng hai lượt — vẫn được, nhưng mẹo giữ khoảng cách mới là thứ người phỏng vấn tìm.'],
  kn: ['two pointers with a gap', 'linked list'],
  tns: [tn('singly linked list', 'danh sách liên kết đơn'), tn('node', 'nút'), tn('gap', 'khoảng cách cố định giữa hai con trỏ')],
  dau: `/**
 * head: { val, next } | null — a singly linked list, k >= 1
 * returns the val of the k-th node from the end (k = 1 -> last), or null if the list is shorter
 */
function kthFromEnd(head, k) {
  // Write your solution here
  return head === null ? null : head.val;
}
`,
  giai: '// Reference solution — fast goes k nodes ahead, then both move until fast is null.\n' + nguon(kthFromEnd),
  cases: [
    { goi: boc('kthFromEnd(__ds(["J1", "J2", "J3", "J4", "J5"]), 2)'), hien: 'kthFromEnd(list ["J1","J2","J3","J4","J5"], 2)', moTa: ['2nd from the end ⇒ "J4"', 'Thứ 2 từ cuối ⇒ "J4"'] },
    { goi: boc('kthFromEnd(__ds(["only"]), 1)'), hien: 'kthFromEnd(list ["only"], 1)' },
    { goi: boc('kthFromEnd(__ds(["a", "b"]), 3)'), hien: 'kthFromEnd(list ["a","b"], 3)', moTa: ['k > length ⇒ null', 'k > độ dài ⇒ null'] },
    { goi: boc('kthFromEnd(null, 1)'), an: true, moTa: ['Empty list ⇒ null', 'Danh sách rỗng ⇒ null'] },
    { goi: boc('kthFromEnd(__ds(["a", "b", "c"]), 3)'), an: true, moTa: ['k = length ⇒ the head', 'k = độ dài ⇒ nút đầu'] },
    { goi: boc('kthFromEnd(__ds(["a", "b", "c", "d"]), 1)'), an: true },
    { goi: boc('(function () { var a = []; for (var i = 0; i < 100000; i++) a.push("job" + i); return kthFromEnd(__ds(a), 77777); })()'), an: true, moTa: ['100 000 jobs', '100 000 lệnh in'] },
  ],
  saiMau: [
    { ten: ['Stops at fast.next === null (one node early)', 'Dừng khi fast.next === null (sớm một nút)'], ma: 'function kthFromEnd(head, k) {\n  var f = head;\n  for (var i = 0; i < k; i++) { if (!f) return null; f = f.next; }\n  if (!f) return head.val;\n  var s = head;\n  while (f.next) { f = f.next; s = s.next; }\n  return s.val;\n}\n' },
  ],
});

/* ── 2. Nhanh chậm tìm điểm giữa: chia danh sách làm đôi ── */
function splitHalves(head) {
  if (head === null) return [null, null];
  var slow = head, fast = head.next;   // fast starts one ahead ⇒ slow stops at the END of the first half
  while (fast !== null && fast.next !== null) {
    slow = slow.next;                  // 1 step
    fast = fast.next.next;             // 2 steps
  }
  var second = slow.next;
  slow.next = null;                    // cut the link: the first half now ends here
  return [head, second];
}
const F2 = bai({
  ten: 'Two lab assistants: split the queue into halves', kho: 'MEDIUM', phut: 15, ham: 'splitHalves',
  en: `<p>The queue of students waiting for PE re-checks is a singly linked list (<code>{ val, next }</code>). A second lab assistant arrives, so the queue is split: the <b>first half</b> stays with assistant 1, the second half moves to assistant 2. If the number of students is odd, the extra student stays in the first half.</p>
<p>Write <code>splitHalves(head)</code> returning <code>[firstHead, secondHead]</code> — two separate lists made of the <b>original nodes</b> (cut the link, do not copy). For an empty queue return <code>[null, null]</code>; for one student, <code>[thatNode, null]</code>.</p>`,
  vi: `<p>Hàng sinh viên chờ phúc khảo PE là một danh sách liên kết đơn (<code>{ val, next }</code>). Có thêm một trợ giảng nên hàng được chia: <b>nửa đầu</b> ở lại với trợ giảng 1, nửa sau chuyển sang trợ giảng 2. Số sinh viên lẻ thì người dư ở lại nửa đầu.</p>
<p>Viết <code>splitHalves(head)</code> trả về <code>[firstHead, secondHead]</code> — hai danh sách tách rời làm từ <b>chính các nút cũ</b> (cắt liên kết, không sao chép). Hàng rỗng trả <code>[null, null]</code>; một sinh viên trả <code>[nútĐó, null]</code>.</p>`,
  dauVao: ['head — first node or null.', 'head — nút đầu hoặc null.'],
  dauRa: ['[firstHead, secondHead] (the checks print both lists as arrays).', '[firstHead, secondHead] (ca kiểm in cả hai danh sách thành mảng).'],
  rangBuoc: [['0 ≤ length ≤ 10⁵.', '0 ≤ độ dài ≤ 10⁵.'], ['Target: one pass, O(1) extra memory.', 'Mục tiêu: một lượt, O(1) bộ nhớ phụ.']],
  goiY: [
    ['Slow moves 1 node, fast moves 2: when fast reaches the end, slow is in the middle. The only question is which middle for even lengths.', 'Chậm đi 1 nút, nhanh đi 2: khi nhanh tới cuối, chậm ở giữa. Câu hỏi duy nhất là "giữa" nào khi độ dài chẵn.'],
    ['Start <code>fast = head.next</code> so that slow stops on the LAST node of the first half; then <code>second = slow.next</code> and <code>slow.next = null</code>.', 'Bắt đầu <code>fast = head.next</code> để chậm dừng ở nút CUỐI của nửa đầu; rồi <code>second = slow.next</code> và <code>slow.next = null</code>.'],
  ],
  loi: [
    ['Forgetting <code>slow.next = null</code>: the first "half" still runs into the second one, so it contains everybody.', 'Quên <code>slow.next = null</code>: "nửa đầu" vẫn nối sang nửa sau nên chứa tất cả mọi người.'],
    ['Starting both pointers at head: for an even length slow stops on the first node of the SECOND half and the first half gets one student too many.', 'Cho cả hai con trỏ bắt đầu ở head: độ dài chẵn thì chậm dừng ở nút đầu của nửa SAU, nửa đầu bị dư một người.'],
  ],
  gt: ['After t loop iterations slow is at index t and fast at index 2t + 1. The loop stops when fast is the last node or null, i.e. 2t + 1 ≥ n − 1, so slow ends at index ⌈n/2⌉ − 1 — the last node of a first half of size ⌈n/2⌉. Cutting <code>slow.next</code> splits the list in place. One pass ⇒ O(n) time, O(1) memory.', 'Sau t vòng, chậm ở chỉ số t và nhanh ở chỉ số 2t + 1. Vòng dừng khi nhanh là nút cuối hoặc null, tức 2t + 1 ≥ n − 1, nên chậm dừng ở chỉ số ⌈n/2⌉ − 1 — nút cuối của nửa đầu kích thước ⌈n/2⌉. Cắt <code>slow.next</code> chia danh sách tại chỗ. Một lượt ⇒ O(n) thời gian, O(1) bộ nhớ.'],
  kn: ['fast and slow pointers', 'middle of a linked list'],
  tns: [tn('fast and slow pointers', 'con trỏ nhanh chậm'), tn('middle node', 'nút giữa'), tn('in place', 'tại chỗ', 'dùng lại nút cũ, không tạo danh sách mới.')],
  dau: `/**
 * head: { val, next } | null
 * returns [firstHead, secondHead]; the first half gets the extra node when the length is odd
 */
function splitHalves(head) {
  // Write your solution here
  return [head, null];
}
`,
  giai: '// Reference solution — slow/fast with fast starting one ahead, then cut after slow.\n' + nguon(splitHalves),
  cases: [
    { goi: boc('splitHalves(__ds([1, 2, 3, 4, 5])).map(__raDs)'), hien: 'splitHalves(list [1,2,3,4,5])', moTa: ['Odd: [1,2,3] and [4,5]', 'Lẻ: [1,2,3] và [4,5]'] },
    { goi: boc('splitHalves(__ds([1, 2, 3, 4])).map(__raDs)'), hien: 'splitHalves(list [1,2,3,4])', moTa: ['Even: [1,2] and [3,4]', 'Chẵn: [1,2] và [3,4]'] },
    { goi: boc('splitHalves(__ds(["solo"])).map(__raDs)'), hien: 'splitHalves(list ["solo"])' },
    { goi: boc('splitHalves(null).map(__raDs)'), an: true, moTa: ['Empty queue', 'Hàng rỗng'] },
    { goi: boc('splitHalves(__ds(["a", "b"])).map(__raDs)'), an: true },
    { goi: boc('(function () { var h = __ds([10, 20, 30, 40, 50, 60, 70]); var p = splitHalves(h); return { sameNode: p[0] === h, halves: p.map(__raDs) }; })()'), an: true, moTa: ['Reuses the original nodes', 'Dùng lại chính các nút cũ'] },
    { goi: boc('(function () { var a = []; for (var i = 0; i < 100001; i++) a.push(i); var p = splitHalves(__ds(a)).map(__raDs); return [p[0].length, p[1].length, p[0][p[0].length - 1], p[1][0]]; })()'), an: true, moTa: ['100 001 students', '100 001 sinh viên'] },
  ],
  saiMau: [
    { ten: ['Both pointers start at head (even lengths split wrong)', 'Hai con trỏ cùng bắt đầu ở head (độ dài chẵn chia sai)'], ma: 'function splitHalves(head) {\n  if (!head) return [null, null];\n  var s = head, f = head;\n  while (f && f.next) { s = s.next; f = f.next.next; }\n  var b = s.next; s.next = null; return [head, b];\n}\n' },
    { ten: ['Forgets to cut slow.next', 'Quên cắt slow.next'], ma: 'function splitHalves(head) {\n  if (!head) return [null, null];\n  var s = head, f = head.next;\n  while (f && f.next) { s = s.next; f = f.next.next; }\n  return [head, s.next];\n}\n' },
  ],
});

/* ── 3. Nhanh chậm + con trỏ "trước": xoá người đứng giữa ── */
function removeMiddle(head) {
  if (head === null || head.next === null) return null; // 0 or 1 node: removing the middle empties the list
  var prev = head, fast = head.next.next;  // prev will stop just BEFORE the middle node
  while (fast !== null && fast.next !== null) {
    prev = prev.next;
    fast = fast.next.next;
  }
  prev.next = prev.next.next;              // unlink the middle node
  return head;
}
const F3 = bai({
  ten: 'Photo line-up: remove the student standing in the middle', kho: 'MEDIUM', phut: 15, ham: 'removeMiddle',
  en: `<p>The class photo line-up is a singly linked list of names. The student in the <b>middle</b> is called away to hold the banner. With n students (indexes 0..n−1) the middle one is at index <code>⌊n / 2⌋</code> — for 4 students that is index 2, the second of the two middle ones.</p>
<p>Write <code>removeMiddle(head)</code> that removes that node and returns the head of the remaining line (<code>null</code> if nobody is left). Use one pass.</p>`,
  vi: `<p>Hàng chụp ảnh lớp là một danh sách liên kết đơn chứa tên. Người đứng <b>giữa</b> được gọi ra cầm băng rôn. Với n sinh viên (chỉ số 0..n−1), người giữa ở chỉ số <code>⌊n / 2⌋</code> — 4 người thì là chỉ số 2, người thứ hai trong hai người giữa.</p>
<p>Viết <code>removeMiddle(head)</code> xoá nút đó và trả về đầu hàng còn lại (<code>null</code> nếu không còn ai). Làm trong một lượt.</p>`,
  dauVao: ['head — first node or null.', 'head — nút đầu hoặc null.'],
  dauRa: ['The head of the list after removal (checks print it as an array).', 'Đầu danh sách sau khi xoá (ca kiểm in thành mảng).'],
  rangBuoc: [['0 ≤ length ≤ 10⁵.', '0 ≤ độ dài ≤ 10⁵.'], ['Target: one pass, O(1) memory.', 'Mục tiêu: một lượt, O(1) bộ nhớ.']],
  goiY: [
    ['To delete a node in a singly linked list you need the node BEFORE it. So aim slow at the node just before index ⌊n/2⌋.', 'Muốn xoá một nút trong danh sách liên kết đơn thì cần nút ĐỨNG TRƯỚC nó. Vậy hãy cho con trỏ chậm dừng ngay trước chỉ số ⌊n/2⌋.'],
    ['Give fast a head start of two nodes: <code>prev = head, fast = head.next.next</code>, then the usual loop; finally <code>prev.next = prev.next.next</code>. Handle n ≤ 1 first.', 'Cho nhanh đi trước hai nút: <code>prev = head, fast = head.next.next</code>, rồi vòng lặp quen thuộc; cuối cùng <code>prev.next = prev.next.next</code>. Xử lý n ≤ 1 trước.'],
  ],
  loi: [
    ['Removing the FIRST of the two middle nodes for even n (index n/2 − 1).', 'Xoá người THỨ NHẤT trong hai người giữa khi n chẵn (chỉ số n/2 − 1).'],
    ['Forgetting the one-node case: the answer is an empty list (<code>null</code>), not the same node.', 'Quên trường hợp một nút: đáp án là danh sách rỗng (<code>null</code>), không phải chính nút đó.'],
  ],
  gt: ['With prev starting at index 0 and fast at index 2, after t iterations prev is at t and fast at 2t + 2; the loop stops when fast is the last node or null, which leaves prev at index ⌊n/2⌋ − 1 — right before the middle. Unlinking is O(1). One pass ⇒ O(n) time, O(1) memory.', 'Với prev bắt đầu ở chỉ số 0 và fast ở chỉ số 2, sau t vòng prev ở t và fast ở 2t + 2; vòng dừng khi fast là nút cuối hoặc null, để prev ở chỉ số ⌊n/2⌋ − 1 — ngay trước người giữa. Bỏ liên kết tốn O(1). Một lượt ⇒ O(n) thời gian, O(1) bộ nhớ.'],
  kn: ['fast and slow pointers', 'delete a node'],
  tns: [tn('predecessor', 'nút đứng trước'), tn('unlink', 'bỏ liên kết'), tn('floor', 'làm tròn xuống (⌊ ⌋)')],
  dau: `/**
 * head: { val, next } | null
 * removes the node at index floor(n / 2) and returns the new head (null if empty)
 */
function removeMiddle(head) {
  // Write your solution here
  return head;
}
`,
  giai: '// Reference solution — prev stops right before the middle (fast starts two nodes ahead).\n' + nguon(removeMiddle),
  cases: [
    { goi: boc('__raDs(removeMiddle(__ds(["An", "Binh", "Chi", "Dung", "Em"])))'), hien: 'removeMiddle(list ["An","Binh","Chi","Dung","Em"])', moTa: ['n = 5 ⇒ remove index 2 ("Chi")', 'n = 5 ⇒ xoá chỉ số 2 ("Chi")'] },
    { goi: boc('__raDs(removeMiddle(__ds(["An", "Binh", "Chi", "Dung"])))'), hien: 'removeMiddle(list ["An","Binh","Chi","Dung"])', moTa: ['n = 4 ⇒ remove index 2 ("Chi")', 'n = 4 ⇒ xoá chỉ số 2 ("Chi")'] },
    { goi: boc('__raDs(removeMiddle(__ds(["solo"])))'), hien: 'removeMiddle(list ["solo"])', moTa: ['One student ⇒ []', 'Một người ⇒ []'] },
    { goi: boc('__raDs(removeMiddle(null))'), an: true },
    { goi: boc('__raDs(removeMiddle(__ds(["a", "b"])))'), an: true, moTa: ['n = 2 ⇒ remove index 1', 'n = 2 ⇒ xoá chỉ số 1'] },
    { goi: boc('__raDs(removeMiddle(__ds([1, 2, 3])))'), an: true },
    { goi: boc('(function () { var a = []; for (var i = 0; i < 100000; i++) a.push(i); var r = __raDs(removeMiddle(__ds(a))); return [r.length, r[49999], r[50000]]; })()'), an: true, moTa: ['100 000 students', '100 000 sinh viên'] },
  ],
  saiMau: [
    { ten: ['Removes the first of the two middles', 'Xoá người giữa thứ nhất'], ma: 'function removeMiddle(head) {\n  var n = 0; for (var c = head; c; c = c.next) n++;\n  if (n <= 1) return null;\n  var idx = Math.floor((n - 1) / 2);\n  if (idx === 0) return head.next;\n  var p = head; for (var i = 0; i < idx - 1; i++) p = p.next;\n  p.next = p.next.next; return head;\n}\n' },
    { ten: ['One node: returns the node instead of null', 'Một nút: trả lại chính nút thay vì null'], ma: 'function removeMiddle(head) {\n  if (!head || !head.next) return head;\n  var p = head, f = head.next.next;\n  while (f && f.next) { p = p.next; f = f.next.next; }\n  p.next = p.next.next; return head;\n}\n' },
  ],
});

/* ── 4. Floyd trên danh sách ẩn: đuôi μ và vòng λ của chuỗi chuyển hướng ── */
function redirectLoop(next, start) {
  // the "list" is implicit: node i -> next[i], -1 = no further redirect
  var step = function (i) { return i === -1 ? -1 : next[i]; };
  var slow = start, fast = start;
  do { slow = step(slow); fast = step(step(fast)); }
  while (fast !== -1 && slow !== fast);
  if (fast === -1) {                       // no loop: count the pages on the path
    var len = 0;
    for (var p = start; p !== -1; p = next[p]) len++;
    return [len, 0];
  }
  var mu = 0;                              // phase 2: one pointer from start, one from the meeting point
  slow = start;
  while (slow !== fast) { slow = next[slow]; fast = next[fast]; mu++; }
  var lam = 1;                             // phase 3: walk once around the loop
  for (var q = next[slow]; q !== slow; q = next[q]) lam++;
  return [mu, lam];
}
const F4 = bai({
  ten: 'Redirect chain: how far until the loop, and how long is it', kho: 'HARD', phut: 30, ham: 'redirectLoop',
  en: `<p>A misconfigured web server rewrites URLs: page <code>i</code> redirects to page <code>next[i]</code>, and <code>next[i] === −1</code> means page i is served normally. A browser that starts at page <code>start</code> keeps following redirects. The incident report needs two numbers:</p>
<ul><li><code>μ</code> — how many redirects happen before the browser first enters a loop (the length of the "tail");</li>
<li><code>λ</code> — the length of the loop.</li></ul>
<p>Write <code>redirectLoop(next, start)</code> returning <code>[μ, λ]</code>. If the chain ends (reaches −1), return <code>[pagesVisited, 0]</code> where pagesVisited counts every page on the path including <code>start</code>. Aim for O(n) time and <b>O(1) extra memory</b> (Floyd).</p>`,
  vi: `<p>Một máy chủ web cấu hình sai viết lại URL: trang <code>i</code> chuyển hướng sang trang <code>next[i]</code>, còn <code>next[i] === −1</code> nghĩa là trang i được trả bình thường. Trình duyệt bắt đầu ở trang <code>start</code> cứ đi theo các lượt chuyển hướng. Báo cáo sự cố cần hai con số:</p>
<ul><li><code>μ</code> — số lượt chuyển hướng trước khi trình duyệt lần đầu đi vào vòng lặp (độ dài "đuôi");</li>
<li><code>λ</code> — độ dài vòng lặp.</li></ul>
<p>Viết <code>redirectLoop(next, start)</code> trả về <code>[μ, λ]</code>. Nếu chuỗi kết thúc (chạm −1) thì trả <code>[pagesVisited, 0]</code> với pagesVisited đếm mọi trang trên đường đi kể cả <code>start</code>. Cố gắng O(n) thời gian và <b>O(1) bộ nhớ phụ</b> (Floyd).</p>`,
  dauVao: ['next — array of integers in [−1, n); start — index in [0, n).', 'next — mảng số nguyên trong [−1, n); start — chỉ số trong [0, n).'],
  dauRa: ['[μ, λ] or [pagesVisited, 0].', '[μ, λ] hoặc [pagesVisited, 0].'],
  rangBuoc: [['1 ≤ next.length ≤ 300 000.', '1 ≤ next.length ≤ 300 000.'], ['Target: O(n) time, O(1) extra memory.', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ phụ.']],
  goiY: [
    ['Treat <code>next</code> as a linked list where node i points to next[i]. Tortoise (1 step) and hare (2 steps): if they meet, there is a loop; if the hare reaches −1, there is not.', 'Coi <code>next</code> là một danh sách liên kết, nút i trỏ tới next[i]. Rùa (1 bước) và thỏ (2 bước): gặp nhau thì có vòng; thỏ chạm −1 thì không.'],
    ['After they meet, put one pointer back at <code>start</code> and move both ONE step at a time: they meet again exactly at the loop entry, after μ steps. Then walk once around the loop to measure λ.', 'Sau khi gặp, đưa một con trỏ về <code>start</code> và cho cả hai đi MỘT bước mỗi lần: chúng gặp lại đúng ở cửa vào vòng, sau μ bước. Rồi đi một vòng để đo λ.'],
  ],
  loi: [
    ['Recording visited pages in an array and calling <code>indexOf</code> each step: correct, but O(n²) — the 300 000-page check times out (a Set is O(n) time but O(n) memory).', 'Ghi các trang đã qua vào mảng rồi gọi <code>indexOf</code> mỗi bước: đúng, nhưng O(n²) — kiểm 300 000 trang hết giờ (dùng Set thì O(n) thời gian nhưng O(n) bộ nhớ).'],
    ['Taking the first meeting point as the loop entry: the tortoise and hare meet somewhere INSIDE the loop, usually not at its start.', 'Lấy điểm gặp đầu tiên làm cửa vào vòng: rùa và thỏ gặp nhau ở đâu đó TRONG vòng, thường không phải điểm bắt đầu của nó.'],
    ['Calling <code>next[next[fast]]</code> without checking −1: <code>next[-1]</code> is <code>undefined</code> and the loop never ends.', 'Gọi <code>next[next[fast]]</code> mà không kiểm −1: <code>next[-1]</code> là <code>undefined</code> và vòng lặp không bao giờ dừng.'],
  ],
  gt: ['Let the tail have length μ and the loop length λ. The tortoise and hare meet after k steps, when both are on the loop and the hare\'s extra k steps are a whole number of laps: k ≥ μ and k is a multiple of λ. From the meeting point (position k), μ more steps reach position k + μ, which is the same node as position μ because k is a multiple of λ — that node is the loop entry. A pointer starting at <code>start</code> also reaches the entry after exactly μ steps, so in phase 2 the two pointers meet at the entry and the step counter is μ. Phase 3 walks once round the loop to get λ. Every phase is O(μ + λ) ≤ O(n) and uses a constant number of indexes ⇒ O(1) extra memory.', 'Gọi đuôi dài μ và vòng dài λ. Rùa và thỏ gặp nhau sau k bước, khi cả hai đã ở trong vòng và k bước thỏ đi thêm là một số nguyên vòng: k ≥ μ và k là bội của λ. Từ điểm gặp (vị trí k), thêm μ bước tới vị trí k + μ — trùng nút với vị trí μ vì k là bội của λ — và nút đó chính là cửa vào vòng. Một con trỏ đi từ <code>start</code> cũng tới cửa vào sau đúng μ bước, nên ở pha 2 hai con trỏ gặp nhau tại cửa vào và bộ đếm bước là μ. Pha 3 đi một vòng để có λ. Mỗi pha O(μ + λ) ≤ O(n) và chỉ dùng hằng số chỉ số ⇒ O(1) bộ nhớ phụ.'],
  kn: ['Floyd cycle detection', 'implicit linked list', 'functional graph'],
  tns: [tn("Floyd's cycle detection", 'thuật toán phát hiện chu trình Floyd (rùa và thỏ)'), tn('tail (μ)', 'đuôi', 'đoạn trước khi vào vòng.'), tn('cycle length (λ)', 'độ dài vòng'), tn('implicit list', 'danh sách ẩn', 'không có nút thật, "next" là một mảng hay một hàm.')],
  dau: `/**
 * next: number[] — page i redirects to next[i], -1 = no redirect; start: number
 * returns [mu, lambda] (tail length, loop length), or [pagesVisited, 0] if the chain ends
 */
function redirectLoop(next, start) {
  // Write your solution here
  return [0, 0];
}
`,
  giai: '// Reference solution — Floyd: meet inside the loop, restart one pointer to find the entry (mu), walk the loop (lambda).\n' + nguon(redirectLoop),
  cases: [
    { args: [[1, 2, 3, 1], 0], moTa: ['0 → 1 → 2 → 3 → 1 …: tail 1, loop 3', '0 → 1 → 2 → 3 → 1 …: đuôi 1, vòng 3'] },
    { args: [[1, 2, -1], 0], moTa: ['No loop: 3 pages', 'Không có vòng: 3 trang'] },
    { args: [[0], 0], moTa: ['A page redirecting to itself: [0, 1]', 'Trang tự chuyển về chính nó: [0, 1]'] },
    { args: [[-1], 0], an: true, moTa: ['A single normal page ⇒ [1, 0]', 'Một trang bình thường ⇒ [1, 0]'] },
    { args: [[3, 0, 1, 4, 2], 2], an: true },
    { args: [[1, 2, 3, 4, 5, 6, 7, 4], 0], an: true },
    { args: [[2, 2, 3, 4, 5, 3], 1], an: true },
    { args: [[1, 0, 1, 2], 3], an: true },
  ],
  perf: [{
    moTa: ['Performance: 300 000 pages, tail ≈ 150 000 and loop ≈ 150 000 (indexOf over the visited path times out)', 'Hiệu năng: 300 000 trang, đuôi ≈ 150 000 và vòng ≈ 150 000 (indexOf trên đường đã đi hết giờ)'],
    than: 'var n = 300000, order = []; for (var i = 0; i < n; i++) order.push(i); for (var t = n - 1; t > 0; t--) { var u = R(t + 1), x = order[t]; order[t] = order[u]; order[u] = x; } var nx = new Array(n).fill(-1); var tail = 140000 + R(20000); for (var j = 0; j < n - 1; j++) nx[order[j]] = order[j + 1]; nx[order[n - 1]] = order[tail]; return redirectLoop(nx, order[0]);',
  }],
  saiMau: [
    { ten: ['O(n²): visited array + indexOf', 'O(n²): mảng đã qua + indexOf'], chiHieuNang: true, ma: 'function redirectLoop(next, start) {\n  var path = [], p = start;\n  while (p !== -1) { var at = path.indexOf(p); if (at >= 0) return [at, path.length - at]; path.push(p); p = next[p]; }\n  return [path.length, 0];\n}\n' },
    { ten: ['Uses the first meeting point as the loop entry', 'Lấy điểm gặp đầu tiên làm cửa vào vòng'], ma: 'function redirectLoop(next, start) {\n  var s = start, f = start, st = function (i) { return i === -1 ? -1 : next[i]; };\n  do { s = st(s); f = st(st(f)); } while (f !== -1 && s !== f);\n  if (f === -1) { var n = 0; for (var p = start; p !== -1; p = next[p]) n++; return [n, 0]; }\n  var mu = 0; for (var q = start; q !== s; q = next[q]) mu++;\n  var l = 1; for (var r = next[s]; r !== s; r = next[r]) l++;\n  return [mu, l];\n}\n' },
  ],
});

export default mod('dsa-2-3-nhanh-cham', '2.3 Fast and slow pointers: cycles, middles, hidden lists', [F1, F2, F3, F4]);
