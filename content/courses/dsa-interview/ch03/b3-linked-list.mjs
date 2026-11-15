/** 3.3 — Danh sách liên kết và LRU cache. Mọi mã/output đọc từ ../ma/ch03 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetReverse } from '../ma/ch03/reverse-list.vet.mjs';
import { vetLru } from '../ma/ch03/lru.vet.mjs';

const vr = vetReverse([1, 2, 3, 4, 5]);
const BANG_DAO = bangVet(['step', 'prev', 'curr', 'next pointer of every node (in memory order)'],
  vr.map((h) => [h.buoc, `<code>${h.prev}</code>`, `<code>${h.curr}</code>`, `<code>${h.arrows}</code>`]));

const OPS = [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]];
const vl = vetLru(2, OPS);
const BANG_LRU = bangVet(['#', 'operation', 'what happens', 'list: most recent → least recent'],
  vl.map((h, i) => [String(i + 1), `<code>${h.op}</code>`, h.kq, oMang(h.ds.length ? h.ds : ['∅'], { to: h.ds.length ? { 0: 'ok', [h.ds.length - 1]: h.ds.length > 1 ? 'mo' : 'ok' } : {} })]));

const DE = [
  [lc(206, 'reverse-linked-list', 'Reverse Linked List', 'Easy'), 'prev / curr / next — save next before you turn the arrow.', 'prev / curr / next — cất next trước khi quay mũi tên.'],
  [lc(21, 'merge-two-sorted-lists', 'Merge Two Sorted Lists', 'Easy'), 'Dummy head + tail pointer; splice the leftover in O(1).', 'Nút giả + con trỏ tail; nối phần còn lại trong O(1).'],
  [lc(203, 'remove-linked-list-elements', 'Remove Linked List Elements', 'Easy'), 'Deleting possibly the head ⇒ dummy node; do not advance after a deletion.', 'Có thể phải xoá cả head ⇒ nút giả; xoá xong thì đừng bước tiếp.'],
  [lc(83, 'remove-duplicates-from-sorted-list', 'Remove Duplicates from Sorted List', 'Easy'), 'Sorted ⇒ duplicates are neighbours; skip while next has the same value.', 'Đã sắp xếp ⇒ phần tử trùng đứng cạnh nhau; bỏ qua chừng nào next cùng giá trị.'],
  [lc(19, 'remove-nth-node-from-end-of-list', 'Remove Nth Node From End of List', 'Medium'), 'Two pointers n + 1 apart, starting at a dummy.', 'Hai con trỏ cách nhau n + 1, xuất phát từ nút giả.'],
  [lc(143, 'reorder-list', 'Reorder List', 'Medium'), 'Middle + reverse second half + weave — three classic moves in one.', 'Tìm giữa + đảo nửa sau + đan xen — ba nước kinh điển trong một bài.'],
  [lc(24, 'swap-nodes-in-pairs', 'Swap Nodes in Pairs', 'Medium'), 'Dummy + rewire three pointers per pair; draw it before coding.', 'Nút giả + nối lại ba con trỏ mỗi cặp; vẽ ra giấy trước khi code.'],
  [lc(92, 'reverse-linked-list-ii', 'Reverse Linked List II', 'Medium'), 'Reverse only [left, right]: stop at the node before left, reverse, reconnect both ends.', 'Chỉ đảo đoạn [left, right]: dừng ở nút trước left, đảo, nối lại hai đầu.'],
  [lc(2, 'add-two-numbers', 'Add Two Numbers', 'Medium'), 'Dummy + carry; loop while either list or the carry remains.', 'Nút giả + số nhớ; lặp khi còn một trong hai danh sách hoặc còn nhớ.'],
  [lc(138, 'copy-list-with-random-pointer', 'Copy List with Random Pointer', 'Medium'), 'Map old → new, two passes (or interleave copies for O(1) extra).', 'Map cũ → mới, hai lượt (hoặc chèn bản sao xen kẽ để chỉ tốn O(1)).'],
  [lc(146, 'lru-cache', 'LRU Cache', 'Medium'), 'Hash map key → node + doubly linked list with two sentinels.', 'Hash map khoá → nút + danh sách liên kết đôi có hai nút lính canh.'],
  [lc(25, 'reverse-nodes-in-k-group', 'Reverse Nodes in k-Group', 'Hard'), 'Check k nodes exist, reverse the block, reconnect, move "before" to the block tail.', 'Kiểm đủ k nút, đảo khối, nối lại, dời "before" tới đuôi khối.'],
  [lc(460, 'lfu-cache', 'LFU Cache', 'Hard'), 'One doubly linked list per frequency + a min-frequency pointer.', 'Mỗi tần suất một danh sách liên kết đôi + con trỏ tần suất nhỏ nhất.'],
];

export default {
  title: '3.3 — Linked lists: reversing, dummy nodes and the LRU cache|||3.3 — Danh sách liên kết: đảo ngược, nút giả và LRU cache',
  slug: 'dsa-3-3-linked-list',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đảo danh sách (vòng lặp + đệ quy), nút giả cho merge và xoá nút thứ n từ cuối, reorder list, LRU cache bằng map + danh sách đôi — đối chiếu cache FIFO và LRU có thật trong repo, kèm tấn công quét làm trôi cache.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Linked lists: reversing, dummy nodes and the LRU cache</h2>
<p class="lead">Linked-list questions are not about clever algorithms — almost all of them are O(n) time and O(1) memory. They test something else: <strong>can you change pointers without losing part of the list?</strong> Five moves cover nearly every problem: reverse with three pointers, a dummy head, two pointers a fixed gap apart, "split–reverse–merge", and the hash map + doubly linked list behind an LRU cache. We will run each one, watch the arrows turn, and finish with the cache code that is actually running on this website.</p>

<h3>The everyday picture</h3>
<p>Think of a treasure hunt in the school campus: each note only says where the next note is hidden. To reach note 7 you must follow notes 1 to 6 — there is no shortcut (no index). But inserting a new stop is easy: change one note to point to the new place, and let the new note point where the old one did. That is a <strong>singly linked list</strong>: each <strong>node</strong> holds a value and a pointer <code>next</code>; the first node is the <code>head</code>; the last node points to <code>null</code>. A <strong>doubly linked list</strong> also has <code>prev</code>, so you can walk backwards and unlink a node in O(1) when you hold it.</p>
<table>
<thead><tr><th></th><th>Array</th><th>Linked list</th></tr></thead>
<tbody>
<tr><td>read element i</td><td>O(1)</td><td>O(n) — walk from the head</td></tr>
<tr><td>insert / delete at the front</td><td>O(n) — shift everything</td><td>O(1)</td></tr>
<tr><td>insert / delete next to a node you hold</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>memory and CPU cache</td><td>compact, contiguous — fast to scan</td><td>one object per node, scattered — slower to scan</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">head</span><span class="lz-t">1 → </span><span class="lz-d">value + next</span></div>
  <div class="lz-step"><span class="lz-k">node</span><span class="lz-t">2 → </span><span class="lz-d">only knows its successor</span></div>
  <div class="lz-step"><span class="lz-k">node</span><span class="lz-t">3 → </span><span class="lz-d">no index, no way back</span></div>
  <div class="lz-step"><span class="lz-k">tail</span><span class="lz-t">4 → null</span><span class="lz-d">the end</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Danh sách liên kết: đảo ngược, nút giả và LRU cache</h2>
<p class="lead">Đề danh sách liên kết (linked list) không xoay quanh thuật toán thông minh — gần như tất cả đều O(n) thời gian và O(1) bộ nhớ. Chúng kiểm tra một thứ khác: <strong>bạn có đổi được con trỏ mà không làm rơi mất một phần danh sách không?</strong> Năm nước đi phủ gần hết các đề: đảo bằng ba con trỏ, nút đầu giả (dummy head), hai con trỏ cách nhau một khoảng cố định, "tách – đảo – trộn", và hash map + danh sách liên kết đôi đứng sau LRU cache. Ta sẽ chạy từng nước, nhìn mũi tên quay đầu, và kết thúc bằng đoạn code cache đang chạy thật trên chính trang này.</p>

<h3>Hình dung đời thường</h3>
<p>Nghĩ tới trò truy tìm kho báu trong khuôn viên trường: mỗi tờ giấy chỉ ghi chỗ giấu tờ tiếp theo. Muốn tới tờ số 7 bạn phải đi qua tờ 1 tới tờ 6 — không có lối tắt (không có chỉ số). Nhưng chèn thêm một điểm dừng thì dễ: sửa một tờ để chỉ tới chỗ mới, và cho tờ mới chỉ tới chỗ tờ cũ từng chỉ. Đó là <strong>danh sách liên kết đơn</strong> (singly linked list): mỗi <strong>nút</strong> (node) giữ một giá trị và một con trỏ <code>next</code> (kế tiếp); nút đầu là <code>head</code>; nút cuối chỉ tới <code>null</code>. <strong>Danh sách liên kết đôi</strong> (doubly linked list) có thêm <code>prev</code> (trước đó), nên đi lùi được và gỡ một nút trong O(1) khi bạn đang cầm nó.</p>
<table>
<thead><tr><th></th><th>Mảng</th><th>Danh sách liên kết</th></tr></thead>
<tbody>
<tr><td>đọc phần tử thứ i</td><td>O(1)</td><td>O(n) — đi từ head</td></tr>
<tr><td>chèn / xoá ở đầu</td><td>O(n) — dời mọi thứ</td><td>O(1)</td></tr>
<tr><td>chèn / xoá cạnh một nút đang cầm</td><td>O(n)</td><td>O(1)</td></tr>
<tr><td>bộ nhớ và cache của CPU</td><td>gọn, liền mạch — quét nhanh</td><td>mỗi nút một đối tượng, nằm rải rác — quét chậm hơn</td></tr>
</tbody></table>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">head</span><span class="lz-t">1 → </span><span class="lz-d">giá trị + next</span></div>
  <div class="lz-step"><span class="lz-k">nút</span><span class="lz-t">2 → </span><span class="lz-d">chỉ biết nút sau nó</span></div>
  <div class="lz-step"><span class="lz-k">nút</span><span class="lz-t">3 → </span><span class="lz-d">không chỉ số, không đường lùi</span></div>
  <div class="lz-step"><span class="lz-k">tail</span><span class="lz-t">4 → null</span><span class="lz-d">hết</span></div>
</div>
${csd('csd201-linked-list', 'vi', '1.2 Danh sách liên kết đơn, vòng &amp; đôi', '<p>Ở CSD201 bạn đã cài danh sách liên kết đơn, vòng và đôi bằng Java, với các thao tác chèn/xoá đầu, cuối, giữa. Ôn nhanh: chèn/xoá cạnh nút đang cầm là O(1), tìm theo vị trí là O(n). <strong>Ở đây đi sâu thêm:</strong> năm "nước đi con trỏ" giải gần hết đề phỏng vấn, cách chạy tay để không làm rơi nút, và vì sao bản đệ quy đẹp nhưng sập ở 10⁵ nút.</p>')}
${csd('csd201-doubly-sentinel', 'vi', '1.3 Danh sách liên kết đôi &amp; nút lính canh', '<p>Bài CSD201 dùng nút lính canh (sentinel) để bỏ các trường hợp đặc biệt ở đầu/cuối. Ở đây đó chính là "nút giả" (dummy node) của phỏng vấn, và ta dùng một cặp lính canh để dựng LRU cache trong khoảng 30 dòng.</p>')}
${csd('csd201-luyen-tap-list', 'vi', '1.5 Ba bài toán danh sách kinh điển, có lời giải', '<p>Nếu bạn muốn ôn thêm trước khi vào phần dưới: bài CSD201 giải ba bài danh sách kinh điển bằng Java theo kiểu giáo trình; bài này giải cùng họ đề theo kiểu phỏng vấn, có cả TypeScript.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when the problem is about pointer moves</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">the input is a <code>ListNode head</code></span><span class="v">Obvious, but it tells you the expected solution is O(1) extra memory — copying into an array is the "brute force" the interviewer wants you to beat.</span></div>
  <div class="kv"><span class="k">"reverse", "in groups of k", "between positions"</span><span class="v">The three-pointer reversal, applied to the whole list or a sublist.</span></div>
  <div class="kv"><span class="k">the head itself may change or be deleted</span><span class="v">A dummy node before the head removes the special case.</span></div>
  <div class="kv"><span class="k">"n-th from the end", "middle", "cycle"</span><span class="v">Two pointers: a fixed gap, or fast/slow (Chapter 2).</span></div>
  <div class="kv"><span class="k">"get and put in O(1)" with an eviction rule</span><span class="v">Hash map for lookup + doubly linked list for order: LRU (and, with more lists, LFU).</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào đề xoay quanh nước đi con trỏ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">đầu vào là một <code>ListNode head</code></span><span class="v">Hiển nhiên, nhưng nó cho biết lời giải mong đợi chỉ tốn O(1) bộ nhớ phụ — chép ra mảng chính là "vét cạn" mà người phỏng vấn muốn bạn vượt qua.</span></div>
  <div class="kv"><span class="k">"đảo ngược", "theo từng nhóm k", "giữa hai vị trí"</span><span class="v">Phép đảo ba con trỏ, áp cho cả danh sách hoặc một đoạn.</span></div>
  <div class="kv"><span class="k">chính head có thể đổi hoặc bị xoá</span><span class="v">Một nút giả đứng trước head xoá bỏ trường hợp đặc biệt.</span></div>
  <div class="kv"><span class="k">"thứ n từ cuối", "điểm giữa", "chu trình"</span><span class="v">Hai con trỏ: một khoảng cách cố định, hoặc nhanh/chậm (Chương 2).</span></div>
  <div class="kv"><span class="k">"get và put trong O(1)" kèm luật loại bỏ</span><span class="v">Hash map để tra + danh sách liên kết đôi để giữ thứ tự: LRU (thêm nhiều danh sách nữa là LFU).</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Reverse Linked List (LC 206)</h3>
<p><strong>Problem.</strong> Reverse a singly linked list and return the new head: <code>1→2→3→4→5</code> becomes <code>5→4→3→2→1</code>.</p>
<p><strong>Brute force.</strong> Copy the values into an array, then write them back reversed — O(n) time, O(n) memory. Correct, and a fine first sentence; the interviewer will ask for O(1) memory.</p>
<p><strong>The insight.</strong> Nodes do not need to move; only the arrows do. Walk the list once and turn each <code>next</code> around to point at the previous node. The danger is in the order: the moment you set <code>curr.next = prev</code>, the rest of the list is unreachable — unless you saved it first. Hence three pointers and four lines, in exactly this order: <em>save next, turn the arrow, step prev, step curr</em>.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Reverse Linked List (LC 206)</h3>
<p><strong>Đề.</strong> Đảo ngược một danh sách liên kết đơn và trả về head mới: <code>1→2→3→4→5</code> thành <code>5→4→3→2→1</code>.</p>
<p><strong>Vét cạn.</strong> Chép giá trị ra một mảng rồi ghi ngược lại — O(n) thời gian, O(n) bộ nhớ. Đúng, và là câu mở đầu ổn; người phỏng vấn sẽ đòi O(1) bộ nhớ.</p>
<p><strong>Ý chính.</strong> Các nút không cần di chuyển; chỉ mũi tên cần đổi. Đi qua danh sách một lượt và quay mỗi <code>next</code> lại để chỉ vào nút đứng trước. Nguy hiểm nằm ở thứ tự: ngay khi bạn gán <code>curr.next = prev</code>, phần còn lại của danh sách không còn với tới được — trừ khi bạn đã cất nó trước. Vì thế mới có ba con trỏ và bốn dòng, đúng thứ tự này: <em>cất next, quay mũi tên, bước prev, bước curr</em>.</p>
</div>
${maHai('ch03/reverse-list.ts', 'ch03/ReverseList.java', { vung: 'lap' })}
${ketQua('ch03/reverse-list.ts')}
${ketQua('ch03/ReverseList.java')}
<div class="ml-en">
<h3>Watch the arrows turn</h3>
<p>The nodes stay at the same place in memory; the table shows every node's <code>next</code> after each step, produced by running the loop.</p>
</div>
<div class="ml-vi">
<h3>Nhìn mũi tên quay đầu</h3>
<p>Các nút đứng yên trong bộ nhớ; bảng cho thấy <code>next</code> của mọi nút sau từng bước, sinh ra bằng cách chạy chính vòng lặp đó.</p>
</div>
${BANG_DAO}
<div class="ml-en">
<p>Step 1 makes <code>1→null</code>: node 1 will be the tail. In step 2, <code>2→1</code> — and notice that 2 is no longer reachable from 1; it is reachable only because <code>prev</code> holds it. After step 5, <code>curr</code> is <code>null</code> and <code>prev</code> is node 5, the new head. Five steps for five nodes: O(n) time, three variables: O(1) memory.</p>
${moPhong('ch03/reverse-list.sim.js', 'en', 'Reverse a linked list — the next[] array turning around', 'Values stay put, the next pointers flip one by one; prev is highlighted, curr is selected.')}
</div>
<div class="ml-vi">
<p>Bước 1 tạo <code>1→null</code>: nút 1 sẽ là đuôi. Ở bước 2, <code>2→1</code> — và để ý rằng từ 1 không còn đi tới 2 được nữa; 2 còn với tới được chỉ vì <code>prev</code> đang giữ nó. Sau bước 5, <code>curr</code> là <code>null</code> và <code>prev</code> là nút 5, head mới. Năm bước cho năm nút: O(n) thời gian, ba biến: O(1) bộ nhớ.</p>
${moPhong('ch03/reverse-list.sim.js', 'vi', 'Đảo danh sách liên kết — mảng next[] quay đầu', 'Giá trị đứng yên, các con trỏ next lật lần lượt; prev được tô, curr được chọn.')}
</div>

<div class="ml-en">
<h3>The recursive version — and its price</h3>
<p>Interviewers often ask for it as a follow-up. The idea: trust that <code>reverseRec(head.next)</code> reverses everything after head and returns the new head; then <code>head.next</code> is now the <em>tail</em> of that reversed part, so hang head after it (<code>head.next.next = head</code>) and cut head's own arrow (<code>head.next = null</code>).</p>
</div>
<div class="ml-vi">
<h3>Bản đệ quy — và cái giá của nó</h3>
<p>Người phỏng vấn hay hỏi nó như câu nối tiếp. Ý tưởng: tin rằng <code>reverseRec(head.next)</code> đảo được mọi thứ sau head và trả về head mới; khi đó <code>head.next</code> giờ là <em>đuôi</em> của phần đã đảo, nên treo head vào sau nó (<code>head.next.next = head</code>) và cắt mũi tên của chính head (<code>head.next = null</code>).</p>
</div>
${maHai('ch03/reverse-list.ts', 'ch03/ReverseList.java', { vung: 'dequy' })}
<div class="ml-en">
<p>Elegant, but it uses one stack frame per node: O(n) memory on the call stack. Two traps, both run for real below — the first is what happens when the four lines of the loop are written in the wrong order (the arrow is turned before <code>next</code> is saved), the second is the recursive version on 100,000 nodes:</p>
</div>
<div class="ml-vi">
<p>Đẹp, nhưng nó tốn một khung stack cho mỗi nút: O(n) bộ nhớ trên call stack. Hai cái bẫy, cả hai đều chạy thật dưới đây — cái thứ nhất là chuyện xảy ra khi bốn dòng của vòng lặp bị viết sai thứ tự (quay mũi tên trước khi cất <code>next</code>), cái thứ hai là bản đệ quy trên 100.000 nút:</p>
</div>
${ma('ch03/bay-con-tro.ts', { vung: 'sai', nhan: 'TypeScript — wrong order' })}
${ketQua('ch03/bay-con-tro.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap — turning the arrow before saving the rest.</strong></p><p>With <code>curr.next = prev</code> first, the next line <code>curr = curr.next</code> walks to <code>prev</code> — backwards, into <code>null</code>. The function returns <code>1</code> and the other three nodes are lost (in Java or C they would be garbage or a leak). No exception, no warning: just a wrong answer that passes the one-node test.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — recursion depth equals list length.</strong></p><p>1,000 nodes reverse fine; 100,000 nodes throw <code>RangeError: Maximum call stack size exceeded</code> while the iterative version is instant. LeetCode's lists are at most 5,000 nodes, so the recursive version passes there — in a real system with user-sized data it is a crash (see lesson 3.1 on stack overflow). Say this trade-off when you present the recursive solution.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay mũi tên trước khi cất phần còn lại.</strong></p><p>Nếu <code>curr.next = prev</code> đứng trước, dòng sau <code>curr = curr.next</code> sẽ đi tới <code>prev</code> — đi lùi, rơi vào <code>null</code>. Hàm trả về <code>1</code> và ba nút còn lại bị mất (trong Java hay C chúng thành rác hoặc rò bộ nhớ). Không ngoại lệ, không cảnh báo: chỉ là một đáp án sai mà vẫn qua test một nút.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — độ sâu đệ quy bằng độ dài danh sách.</strong></p><p>1.000 nút đảo bình thường; 100.000 nút ném <code>RangeError: Maximum call stack size exceeded</code> trong khi bản vòng lặp xong tức thì. Danh sách trên LeetCode tối đa 5.000 nút nên bản đệ quy vẫn qua — trong hệ thống thật với dữ liệu cỡ người dùng thì đó là một cú sập (xem bài 3.1 về tràn stack). Hãy nói ra sự đánh đổi này khi trình bày bản đệ quy.</p></div>
</div>

<div class="ml-en">
<h3>Move 2 — the dummy node (and a fixed gap): Merge Two Sorted Lists and Remove N-th From End</h3>
<p>Whenever the head of the answer is not known in advance (merge) or the head itself may be deleted (remove n-th from end, remove elements), create a fake node <code>dummy</code> in front and return <code>dummy.next</code> at the end. Every real node then has a predecessor, so "the first node" stops being a special case.</p>
<p><em>Merge</em>: a <code>tail</code> pointer starts at the dummy; repeatedly attach the smaller head; when one list runs out, attach the rest of the other in one assignment. Using <code>&lt;=</code> keeps equal values in their original order — a <em>stable</em> merge, the property merge sort relies on.</p>
<p><em>Remove the n-th node from the end, in one pass</em>: move <code>fast</code> n + 1 steps ahead of <code>slow</code> (both start at the dummy), then move both until <code>fast</code> falls off the end. Now <code>slow</code> stands exactly <em>before</em> the node to delete. Starting from the dummy is what makes "delete the head" (n = length) work without an <code>if</code>.</p>
</div>
<div class="ml-vi">
<h3>Nước 2 — nút giả (và một khoảng cách cố định): Merge Two Sorted Lists và Remove N-th From End</h3>
<p>Mỗi khi head của đáp án chưa biết trước (trộn) hoặc chính head có thể bị xoá (xoá nút thứ n từ cuối, xoá phần tử), hãy tạo một nút giả <code>dummy</code> đứng trước và cuối cùng trả về <code>dummy.next</code>. Khi đó mọi nút thật đều có một nút đứng trước, nên "nút đầu tiên" thôi là trường hợp đặc biệt.</p>
<p><em>Trộn</em>: con trỏ <code>tail</code> bắt đầu ở nút giả; lặp lại việc gắn head nhỏ hơn vào; khi một danh sách hết, gắn phần còn lại của danh sách kia bằng một phép gán. Dùng <code>&lt;=</code> giữ các giá trị bằng nhau theo đúng thứ tự ban đầu — phép trộn <em>ổn định</em> (stable), tính chất mà merge sort dựa vào.</p>
<p><em>Xoá nút thứ n từ cuối, chỉ một lượt</em>: cho <code>fast</code> đi trước <code>slow</code> n + 1 bước (cả hai xuất phát từ nút giả), rồi cho cả hai cùng đi tới khi <code>fast</code> rơi khỏi cuối. Lúc đó <code>slow</code> đứng ngay <em>trước</em> nút cần xoá. Xuất phát từ nút giả chính là thứ giúp ca "xoá head" (n = độ dài) chạy đúng mà không cần một câu <code>if</code>.</p>
</div>
${maHai('ch03/merge-dummy.ts', 'ch03/MergeDummy.java', { vung: 'merge' })}
${maHai('ch03/merge-dummy.ts', 'ch03/MergeDummy.java', { vung: 'nth' })}
${ketQua('ch03/merge-dummy.ts')}
${ketQua('ch03/MergeDummy.java')}
<div class="ml-en">
<p>The last two lines are the edge cases that break solutions without a dummy: removing the only node returns <code>null</code>, and removing the 2nd from the end of <code>1→2</code> removes the head and returns <code>2</code>. Both work with zero special cases.</p>
</div>
<div class="ml-vi">
<p>Hai dòng cuối là các ca biên làm hỏng lời giải không có nút giả: xoá nút duy nhất trả về <code>null</code>, và xoá nút thứ 2 từ cuối của <code>1→2</code> là xoá head, trả về <code>2</code>. Cả hai chạy đúng mà không cần trường hợp đặc biệt nào.</p>
</div>

<div class="ml-en">
<h3>Move 3 — split, reverse, merge: Reorder List (LC 143)</h3>
<p>Rearrange <code>L0 → L1 → … → Ln</code> into <code>L0 → Ln → L1 → Ln−1 → …</code>, in place. Copying into an array solves it in O(n) memory; the O(1) solution is three moves you already know: find the middle with fast/slow pointers (lesson 2.3), reverse the second half (above), then weave the two halves together. Interviewers like it precisely because it checks whether you can <em>compose</em> techniques — and whether you remember to cut the first half (<code>slow.next = null</code>), without which the weave creates a cycle.</p>
</div>
<div class="ml-vi">
<h3>Nước 3 — tách, đảo, trộn: Reorder List (LC 143)</h3>
<p>Sắp lại <code>L0 → L1 → … → Ln</code> thành <code>L0 → Ln → L1 → Ln−1 → …</code>, ngay tại chỗ. Chép ra mảng thì giải được với O(n) bộ nhớ; lời giải O(1) là ba nước bạn đã biết: tìm điểm giữa bằng con trỏ nhanh/chậm (bài 2.3), đảo nửa sau (ở trên), rồi đan hai nửa vào nhau. Người phỏng vấn thích đề này chính vì nó kiểm tra bạn có <em>ghép</em> được các kỹ thuật không — và có nhớ cắt nửa đầu (<code>slow.next = null</code>) không, thiếu nó thì bước đan sẽ tạo ra chu trình.</p>
${lienKet({ bai: 'dsa-2-3-nhanh-cham', title: '2.3 — Con trỏ nhanh chậm', sub: 'Tìm điểm giữa, phát hiện chu trình (Floyd) và điểm vào chu trình', cta: 'Ôn lại' })}
</div>
${maHai('ch03/reorder-list.ts', 'ch03/ReorderList.java', { vung: 'giai' })}
${ketQua('ch03/reorder-list.ts')}

<div class="ml-en">
<h3>Move 4 — hash map + doubly linked list: LRU Cache (LC 146)</h3>
<p><strong>Problem.</strong> A cache with a fixed capacity. <code>get(key)</code> returns the value or −1; <code>put(key, value)</code> inserts or updates. When full, evict the <strong>least recently used</strong> key — "used" meaning either a get or a put. Both operations must be O(1).</p>
<p><strong>Why two structures.</strong> A hash map alone finds a key in O(1) but has no idea which key is the oldest. A list alone keeps the order but needs O(n) to find a key. Together: the map stores <code>key → node</code>, and the doubly linked list keeps nodes in order of use, most recent at the front. Touching a key = unlink its node (O(1), because it is doubly linked and we hold it) + insert at the front (O(1)). Evicting = remove the node at the back. Two <strong>sentinel</strong> nodes, <code>head</code> and <code>tail</code>, mean the list is never empty and no pointer is ever <code>null</code> during an unlink.</p>
<p>One detail decides whether the code works: the node must store its <strong>key</strong>, not only its value — when you evict the last node you must also delete it from the map, and the map is keyed by key.</p>
</div>
<div class="ml-vi">
<h3>Nước 4 — hash map + danh sách liên kết đôi: LRU Cache (LC 146)</h3>
<p><strong>Đề.</strong> Một bộ đệm (cache) có sức chứa cố định. <code>get(key)</code> trả về giá trị hoặc −1; <code>put(key, value)</code> thêm mới hoặc cập nhật. Khi đầy, loại bỏ khoá <strong>lâu nhất chưa được dùng</strong> (LRU — least recently used) — "dùng" nghĩa là get hoặc put. Cả hai thao tác phải O(1).</p>
<p><strong>Vì sao cần hai cấu trúc.</strong> Chỉ hash map thì tìm khoá trong O(1) nhưng không biết khoá nào cũ nhất. Chỉ danh sách thì giữ được thứ tự nhưng tìm khoá mất O(n). Ghép lại: map lưu <code>khoá → nút</code>, còn danh sách liên kết đôi giữ các nút theo thứ tự được dùng, mới nhất ở đầu. Chạm vào một khoá = gỡ nút của nó (O(1), vì là danh sách đôi và ta đang cầm nút) + chèn lên đầu (O(1)). Loại bỏ = gỡ nút ở cuối. Hai nút <strong>lính canh</strong> (sentinel), <code>head</code> và <code>tail</code>, khiến danh sách không bao giờ rỗng và không con trỏ nào là <code>null</code> khi gỡ nút.</p>
<p>Một chi tiết quyết định code có chạy hay không: nút phải lưu cả <strong>khoá</strong>, không chỉ giá trị — khi loại nút cuối, bạn còn phải xoá nó khỏi map, mà map lại tra theo khoá.</p>
</div>
${maHai('ch03/lru-cache.ts', 'ch03/LruCache.java', { vung: 'giai' })}
${ketQua('ch03/lru-cache.ts')}
${ketQua('ch03/LruCache.java')}
<div class="ml-en">
<h3>Watch the recency list</h3>
<p>Capacity 2, the same operations as the program above. Green = most recent (front), grey = next to be evicted (back).</p>
</div>
<div class="ml-vi">
<h3>Nhìn danh sách độ mới</h3>
<p>Sức chứa 2, đúng các thao tác của chương trình trên. Xanh lá = mới nhất (đầu), xám = kẻ tiếp theo bị loại (cuối).</p>
</div>
${BANG_LRU}
<div class="ml-en">
<p>Row 3 is the whole idea: <code>get(1)</code> moves 1 to the front, so at row 4 the victim is 2, not 1 — even though 1 was inserted first. A FIFO cache would have evicted 1. Rows 7–9 show that hits move keys too: after <code>get(3)</code> then <code>get(4)</code>, 4 is the most recent.</p>
${moPhong('ch03/lru.sim.js', 'en', 'LRU cache — the recency list', 'Capacity 3: hits move to the front, a full cache evicts from the back; edit OPS and run your own sequence.')}
</div>
<div class="ml-vi">
<p>Dòng 3 là toàn bộ ý tưởng: <code>get(1)</code> đưa 1 lên đầu, nên tới dòng 4 nạn nhân là 2, không phải 1 — dù 1 được chèn trước. Một cache FIFO sẽ loại 1. Dòng 7–9 cho thấy lần trúng (hit) cũng di chuyển khoá: sau <code>get(3)</code> rồi <code>get(4)</code>, 4 là mới nhất.</p>
${moPhong('ch03/lru.sim.js', 'vi', 'LRU cache — danh sách độ mới', 'Sức chứa 3: lần trúng chuyển lên đầu, cache đầy thì loại ở cuối; sửa OPS để chạy chuỗi thao tác của bạn.')}
</div>

<div class="ml-en">
<h3>The short versions — and when you may use them</h3>
<p>Both languages have the doubly linked list built in. A JavaScript <code>Map</code> iterates in insertion order, so "delete then set" moves a key to the newest end, and <code>map.keys().next().value</code> is the oldest. Java's <code>LinkedHashMap</code> with <code>accessOrder = true</code> reorders on every access and calls <code>removeEldestEntry</code> after each insert:</p>
</div>
<div class="ml-vi">
<h3>Bản ngắn — và khi nào được dùng</h3>
<p>Cả hai ngôn ngữ đều có sẵn danh sách liên kết đôi bên trong. <code>Map</code> của JavaScript duyệt theo thứ tự chèn, nên "xoá rồi set lại" đưa một khoá về đầu mới nhất, và <code>map.keys().next().value</code> là khoá cũ nhất. <code>LinkedHashMap</code> của Java với <code>accessOrder = true</code> tự sắp lại sau mỗi lần truy cập và gọi <code>removeEldestEntry</code> sau mỗi lần chèn:</p>
</div>
${maHai('ch03/lru-ngan.ts', 'ch03/LruNgan.java', { vung: 'giai' })}
${ketQua('ch03/lru-ngan.ts')}
<div class="ml-en">
<p>In an interview, mention the short version first ("in production I would use a <code>LinkedHashMap</code>"), then expect "now implement it without that" — which is why you need the long version in your fingers. In production, the short version is what you should write, and it is exactly what this website does.</p>
</div>
<div class="ml-vi">
<p>Khi phỏng vấn, hãy nhắc bản ngắn trước ("ở production em sẽ dùng <code>LinkedHashMap</code>"), rồi chờ câu "giờ cài lại mà không dùng nó" — vì thế bạn cần thuộc bản dài trong tay. Ở production, bản ngắn mới là thứ nên viết, và đó đúng là việc chính trang này làm.</p>
</div>

<div class="ml-en">
<h3>Where this lives in real systems: three caches in this repo, two policies</h3>
<ul>
<li><strong>LRU</strong> — <code>src/services/sachRieng/ielts.ts › anhTrangIelts</code> caches decrypted PDF page images. On a hit it does <code>trangDem.delete(key); trangDem.set(key, hit)</code> (move to newest), and after inserting it runs <code>while (trangDem.size &gt; 40) trangDem.delete(trangDem.keys().next().value)</code>. That is the short LRU above, line for line.</li>
<li><strong>FIFO</strong> — <code>src/routes/gifs.routes.ts</code> (GIPHY results, <code>CACHE_MAX_ENTRIES = 200</code>) and <code>src/services/work/projectCache.ts</code> (heavy CT Work reports, <code>MAX_ENTRIES = 500</code>) evict <code>keys().next()</code> too — but they <em>never</em> move a key on a hit, so the victim is the oldest <em>inserted</em>, not the least recently <em>used</em>. Both also expire entries by time (5 min / 15 s), which matters more there than the eviction rule.</li>
</ul>
<p>Does the difference matter? Same capacity (6), same 6,000 requests — three "hot" keys requested all the time, mixed with keys requested once:</p>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật: ba cache trong repo này, hai chính sách</h3>
<ul>
<li><strong>LRU</strong> — <code>src/services/sachRieng/ielts.ts › anhTrangIelts</code> đệm ảnh các trang PDF đã giải mã. Khi trúng nó làm <code>trangDem.delete(key); trangDem.set(key, hit)</code> (chuyển về mới nhất), và sau khi chèn nó chạy <code>while (trangDem.size &gt; 40) trangDem.delete(trangDem.keys().next().value)</code>. Đó chính là bản LRU ngắn ở trên, từng dòng một.</li>
<li><strong>FIFO</strong> — <code>src/routes/gifs.routes.ts</code> (kết quả GIPHY, <code>CACHE_MAX_ENTRIES = 200</code>) và <code>src/services/work/projectCache.ts</code> (báo cáo nặng của CT Work, <code>MAX_ENTRIES = 500</code>) cũng loại <code>keys().next()</code> — nhưng KHÔNG BAO GIỜ di chuyển khoá khi trúng, nên nạn nhân là khoá <em>chèn</em> sớm nhất, không phải khoá lâu nhất chưa <em>dùng</em>. Cả hai còn cho mục hết hạn theo thời gian (5 phút / 15 giây), thứ quan trọng hơn luật loại bỏ ở đó.</li>
</ul>
<p>Khác biệt đó có đáng kể không? Cùng sức chứa (6), cùng 6.000 request — ba khoá "nóng" được hỏi liên tục, xen với các khoá chỉ được hỏi một lần:</p>
</div>
${ma('ch03/fifo-vs-lru.ts', { vung: 'mo-phong', nhan: 'TypeScript — one line of difference' })}
${ketQua('ch03/fifo-vs-lru.ts', { lenh: '$ npx tsx fifo-vs-lru.ts' })}
<div class="ml-en">
<p>LRU hits 2,997 of the 3,000 hot requests (only the 3 cold starts miss); FIFO hits exactly half — every hot key is evicted after a fixed number of insertions no matter how popular it is, then has to be fetched again. One line (<code>delete</code> + <code>set</code> on a hit) doubles the hit rate on this workload. For the GIF cache that is fine (results expire after 5 minutes anyway); for a cache in front of a slow database it is the difference between a quiet database and a busy one.</p>
</div>
<div class="ml-vi">
<p>LRU trúng 2.997 trên 3.000 request nóng (chỉ 3 lần khởi động lạnh bị trượt); FIFO trúng đúng một nửa — mỗi khoá nóng bị loại sau một số lần chèn cố định dù nó được ưa chuộng tới đâu, rồi phải lấy lại. Một dòng (<code>delete</code> + <code>set</code> khi trúng) nhân đôi tỉ lệ trúng trên khối việc này. Với cache GIF thì không sao (kết quả vẫn hết hạn sau 5 phút); với một cache đứng trước cơ sở dữ liệu chậm thì đó là khác biệt giữa một CSDL thảnh thơi và một CSDL quá tải.</p>
${lienKet({ khoa: 'redis', bai: 'rd-9-2-day-khoa', title: 'Redis 9.2 — maxmemory và tám chính sách đẩy khoá', sub: 'allkeys-lru, LFU và vì sao Redis chỉ xấp xỉ LRU bằng lấy mẫu', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: flushing an LRU cache</h3>
<p>LRU has a well-known weakness: <strong>one scan of new keys pushes out everything</strong>. Look at the last two lines of the output above: right after warm-up, all 3 hot keys hit; right after a scan of 6 one-time keys (the capacity), they all miss. A scan can be innocent (a crawler, a nightly report, a data export) or deliberate: an attacker requests URLs with random query strings (<code>/api/x?r=81723</code>, <code>?r=81724</code>…) so each one is a new cache key. Every legitimate request then misses and goes to the origin — a "cache-busting" attack that turns your cache off without touching it.</p>
<p>Defences: <strong>normalise the cache key</strong> (drop query parameters the handler does not read — the same "choose the key" skill as Group Anagrams in lesson 1.1); rate-limit per client; and use <strong>scan-resistant policies</strong> where it matters — LFU (Redis <code>allkeys-lfu</code>), segmented LRU / 2Q (a new key must be hit twice before it can evict a proven one), or PostgreSQL's trick of reading big sequential scans through a small ring buffer so they cannot flush the shared buffer cache.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: xả trôi một LRU cache</h3>
<p>LRU có một điểm yếu nổi tiếng: <strong>chỉ một lượt quét các khoá mới là đẩy bay mọi thứ</strong>. Nhìn hai dòng cuối của output trên: ngay sau khi làm nóng, cả 3 khoá nóng đều trúng; ngay sau một lượt quét 6 khoá dùng-một-lần (bằng sức chứa), cả 3 đều trượt. Lượt quét có thể vô tình (một con bot thu thập dữ liệu, một báo cáo chạy đêm, một lần xuất dữ liệu) hoặc cố ý: kẻ tấn công gọi URL với query string ngẫu nhiên (<code>/api/x?r=81723</code>, <code>?r=81724</code>…) để mỗi lần là một khoá cache mới. Mọi request hợp lệ sau đó đều trượt và đổ về máy chủ gốc — kiểu tấn công "cache-busting" (phá cache) vô hiệu hoá cache của bạn mà không cần chạm vào nó.</p>
<p>Cách phòng: <strong>chuẩn hoá khoá cache</strong> (bỏ các tham số query mà handler không đọc — đúng kỹ năng "chọn khoá" của Group Anagrams ở bài 1.1); giới hạn tốc độ theo client; và dùng <strong>chính sách chống quét</strong> ở chỗ quan trọng — LFU (Redis <code>allkeys-lfu</code>), segmented LRU / 2Q (khoá mới phải trúng hai lần mới được quyền đẩy một khoá đã chứng minh giá trị), hoặc mẹo của PostgreSQL: đọc các lượt quét tuần tự lớn qua một ring buffer nhỏ để chúng không xả trôi bộ đệm dùng chung.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LRU Cache</h3>
${hoiThoai([
  ['I', 'Design an LRU cache with get and put in O(1).'],
  ['C', 'Does a get count as a use, and does put on an existing key update the value and count as a use? What should get return on a miss? Is the capacity at least 1?'],
  ['N', 'These three answers decide where you call "move to front" — the bug-prone part.'],
  ['I', 'Yes, yes, −1, and capacity ≥ 1.'],
  ['C', 'A hash map alone gives O(1) lookup but no order; a list alone gives order but O(n) lookup. So I combine them: a map from key to a node in a doubly linked list, ordered by recency, most recent at the front. A use is unlink plus insert-at-front, both O(1) because I hold the node and it has prev and next. Eviction removes the node before the tail.'],
  ['N', 'Explain why each structure is needed — that is the design question being asked.'],
  ['I', 'Why doubly linked?'],
  ['C', 'To unlink a node I need its predecessor. In a singly linked list finding it costs O(n). With prev it is O(1).'],
  ['C', '(coding) I use two sentinels so unlink never sees null… the node stores its key, because when I evict the last node I must also delete it from the map.'],
  ['N', 'Name the two details that make it work: sentinels and the key in the node.'],
  ['C', 'Test with capacity 2: put 1, put 2, get 1 → 1, put 3 evicts 2, get 2 → −1. Then put on an existing key with a full cache must not evict anything.'],
  ['I', 'In production, would you write this?'],
  ['C', 'No — LinkedHashMap with access order in Java, or a Map with delete-and-set in JavaScript, plus a TTL. And I would ask whether LRU is right at all: if scans are common, LFU or a two-queue policy holds the hot keys better.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: LRU Cache</h3>
<p>Cùng mạch hội thoại bằng tiếng Việt, kèm các cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Thiết kế một LRU cache có get và put O(1).'],
  ['C', 'Get có tính là một lần dùng không ạ, và put vào khoá đã có thì cập nhật giá trị và tính là dùng chứ? Get trượt thì trả gì? Sức chứa ít nhất là 1 phải không? <em>("Does a get count as a use?")</em>'],
  ['N', 'Ba câu trả lời này quyết định bạn gọi "chuyển lên đầu" ở đâu — phần dễ sai nhất.'],
  ['I', 'Có, có, −1, và sức chứa ≥ 1.'],
  ['C', 'Chỉ hash map thì tra O(1) nhưng không có thứ tự; chỉ danh sách thì có thứ tự nhưng tra O(n). Nên em ghép lại: một map từ khoá tới nút trong danh sách liên kết đôi, sắp theo độ mới, mới nhất ở đầu. Một lần dùng là gỡ nút rồi chèn lên đầu, cả hai O(1) vì em đang cầm nút và nó có prev lẫn next. Loại bỏ là gỡ nút đứng trước tail. <em>("A map from key to node, plus a doubly linked list ordered by recency.")</em>'],
  ['N', 'Giải thích vì sao cần từng cấu trúc — đó chính là câu hỏi thiết kế đang được hỏi.'],
  ['I', 'Sao phải là danh sách đôi?'],
  ['C', 'Muốn gỡ một nút em cần nút đứng trước nó. Danh sách đơn thì tìm nút đó mất O(n). Có prev thì O(1).'],
  ['C', '(vừa code vừa nói) Em dùng hai nút lính canh để lúc gỡ không bao giờ gặp null… nút lưu cả khoá, vì khi loại nút cuối em còn phải xoá nó khỏi map.'],
  ['N', 'Gọi tên hai chi tiết làm nó chạy được: lính canh và khoá nằm trong nút.'],
  ['C', 'Test với sức chứa 2: put 1, put 2, get 1 → 1, put 3 loại 2, get 2 → −1. Rồi put vào khoá đã có khi cache đầy thì không được loại ai cả.'],
  ['I', 'Đi làm thật thì em có tự viết cái này không?'],
  ['C', 'Không ạ — Java thì LinkedHashMap với access order, JavaScript thì Map với xoá-rồi-set, cộng thêm TTL (thời gian sống). Và em sẽ hỏi LRU có hợp không: nếu hay có lượt quét, LFU hoặc chính sách hai hàng đợi giữ khoá nóng tốt hơn. <em>("If scans are common, LFU holds the hot keys better.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Turning <code>curr.next</code> before saving it — the rest of the list is lost.</li>
<li>Special-casing the head with a pile of <code>if</code>s instead of one dummy node.</li>
<li>Off-by-one in "n-th from the end": the gap must be n + 1 when <code>slow</code> has to stop <em>before</em> the target.</li>
<li>Forgetting to cut the first half in Reorder List / Palindrome List — the weave builds a cycle and printing loops forever.</li>
<li>LRU: storing only the value in the node (cannot delete the evicted key from the map); moving to front on put-new but not on get or on put-update.</li>
<li>Presenting a recursive list solution without mentioning its O(n) call-stack cost.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Quay <code>curr.next</code> trước khi cất nó — mất phần còn lại của danh sách.</li>
<li>Xử lý riêng head bằng một đống <code>if</code> thay vì một nút giả.</li>
<li>Lệch một ở "thứ n từ cuối": khoảng cách phải là n + 1 khi <code>slow</code> cần dừng <em>trước</em> nút đích.</li>
<li>Quên cắt nửa đầu trong Reorder List / Palindrome List — bước đan tạo chu trình và in ra lặp vô tận.</li>
<li>LRU: nút chỉ lưu giá trị (không xoá được khoá bị loại khỏi map); chuyển lên đầu khi put khoá mới mà quên khi get hoặc khi put cập nhật.</li>
<li>Trình bày lời giải đệ quy trên danh sách mà không nhắc tới chi phí O(n) trên call stack.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>LC 2, 138 và 25 có lời giải từng bước ở <a href="${baiNay('dsa-3-4-luyen')}">bài 3.4 (Bộ luyện 3)</a>; LC 23 (gộp k danh sách) cần heap nên để tới <a href="${baiNay('dsa-6-1-heap')}">bài 6.1</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>On paper, draw <code>1→2→3→4</code> and run the reversal loop by hand, rewriting all four arrows after each step. Compare with the table above.</li>
<li>Swap the first two lines of the loop on purpose, run it on <code>[1, 2, 3, 4]</code>, and explain the output <code>1</code> in one sentence.</li>
<li>Submit LC 206 (both versions), LC 21 and LC 19. For LC 19, write down why the gap is n + 1.</li>
<li>Write LRU Cache from scratch in 20 minutes without looking (LC 146), then rewrite it with <code>Map</code>/<code>LinkedHashMap</code> in 5.</li>
</ol>
<p><strong>Done when:</strong> four accepted submissions, the swapped-lines bug explained, and both LRU versions pass the same capacity-2 test sequence.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">node / head / tail</span><span class="v">A value plus pointer(s); the first node; the last node (its next is null).</span></div>
  <div class="kv"><span class="k">singly / doubly linked list</span><span class="v">Only next / next and prev; doubly lets you unlink a held node in O(1).</span></div>
  <div class="kv"><span class="k">dummy node / sentinel</span><span class="v">A fake node that removes head/tail special cases.</span></div>
  <div class="kv"><span class="k">in place</span><span class="v">Rearranging existing nodes with O(1) extra memory.</span></div>
  <div class="kv"><span class="k">LRU / FIFO eviction</span><span class="v">Evict the least recently used / the earliest inserted entry.</span></div>
  <div class="kv"><span class="k">hit rate</span><span class="v">Share of requests served from the cache.</span></div>
  <div class="kv"><span class="k">cache busting / scan pollution</span><span class="v">Unique keys that push hot entries out of an LRU cache.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>List problems test pointer discipline: save next, turn the arrow, step.</li>
<li>A dummy node makes "the head may change" a non-issue.</li>
<li>Two pointers n + 1 apart find the node before the n-th from the end in one pass.</li>
<li>Complex list problems are compositions: middle + reverse + merge.</li>
<li>LRU = hash map (key → node) + doubly linked list with sentinels; the node stores its key.</li>
<li>Recursion on lists costs O(n) stack; LRU can be flushed by scans — know both limits.</li>
</ul>
${nguon('🎬', 'VisuAlgo — Linked List', 'Animated singly/doubly linked lists, stacks and deques built on them', 'https://visualgo.net/en/list')}
${nguon('📙', 'Java LinkedHashMap (Java SE 21 API)', 'accessOrder and removeEldestEntry — the five-line LRU', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html')}
${nguon('📕', 'Redis — Key eviction', 'Approximated LRU, LFU and the eviction policies of a real cache', 'https://redis.io/docs/latest/develop/reference/eviction/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trên giấy, vẽ <code>1→2→3→4</code> và chạy tay vòng lặp đảo, viết lại cả bốn mũi tên sau mỗi bước. So với bảng ở trên.</li>
<li>Cố ý đổi chỗ hai dòng đầu của vòng lặp, chạy với <code>[1, 2, 3, 4]</code>, và giải thích output <code>1</code> trong một câu.</li>
<li>Nộp LC 206 (cả hai bản), LC 21 và LC 19. Với LC 19, ghi lại vì sao khoảng cách là n + 1.</li>
<li>Tự viết LRU Cache từ đầu trong 20 phút không nhìn bài (LC 146), rồi viết lại bằng <code>Map</code>/<code>LinkedHashMap</code> trong 5 phút.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn lượt nộp Accepted, giải thích được lỗi đổi chỗ hai dòng, và cả hai bản LRU qua cùng một chuỗi test sức chứa 2.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">node / head / tail (nút / đầu / đuôi)</span><span class="v">Một giá trị kèm con trỏ; nút đầu tiên; nút cuối (next của nó là null).</span></div>
  <div class="kv"><span class="k">singly / doubly linked list (danh sách liên kết đơn / đôi)</span><span class="v">Chỉ có next / có cả next và prev; danh sách đôi gỡ được nút đang cầm trong O(1).</span></div>
  <div class="kv"><span class="k">dummy node / sentinel (nút giả / lính canh)</span><span class="v">Nút giả để bỏ các trường hợp đặc biệt ở đầu/cuối.</span></div>
  <div class="kv"><span class="k">in place (tại chỗ)</span><span class="v">Sắp lại các nút sẵn có với O(1) bộ nhớ phụ.</span></div>
  <div class="kv"><span class="k">LRU / FIFO eviction (loại theo lâu-nhất-chưa-dùng / vào-trước-ra-trước)</span><span class="v">Loại mục lâu nhất chưa được dùng / mục được chèn sớm nhất.</span></div>
  <div class="kv"><span class="k">hit rate (tỉ lệ trúng)</span><span class="v">Phần request được phục vụ thẳng từ cache.</span></div>
  <div class="kv"><span class="k">cache busting / scan pollution (phá cache / ô nhiễm do quét)</span><span class="v">Các khoá mới toanh đẩy những mục nóng ra khỏi LRU cache.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Đề danh sách kiểm tra kỷ luật con trỏ: cất next, quay mũi tên, bước tiếp.</li>
<li>Nút giả biến "head có thể đổi" thành chuyện không đáng lo.</li>
<li>Hai con trỏ cách nhau n + 1 tìm được nút đứng trước nút thứ n từ cuối trong một lượt.</li>
<li>Đề danh sách phức tạp là phép ghép: tìm giữa + đảo + trộn.</li>
<li>LRU = hash map (khoá → nút) + danh sách liên kết đôi có lính canh; nút lưu cả khoá.</li>
<li>Đệ quy trên danh sách tốn O(n) stack; LRU có thể bị xả trôi bởi lượt quét — biết cả hai giới hạn.</li>
</ul>
${nguon('🎬', 'VisuAlgo — Linked List', 'Hoạt hình danh sách liên kết đơn/đôi, stack và deque dựng trên nó', 'https://visualgo.net/en/list')}
${nguon('📙', 'Java LinkedHashMap (Java SE 21 API)', 'accessOrder và removeEldestEntry — LRU năm dòng', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/LinkedHashMap.html')}
${nguon('📕', 'Redis — Key eviction', 'LRU xấp xỉ, LFU và các chính sách loại khoá của một cache thật', 'https://redis.io/docs/latest/develop/reference/eviction/')}
</div>
`,
};
