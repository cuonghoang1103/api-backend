/** 2.3 — Con trỏ nhanh chậm. Mọi mã/output đọc từ ../ma/ch02 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetFloyd } from '../ma/ch02/cycle-entry.vet.mjs';
import { vetFindDuplicate } from '../ma/ch02/find-duplicate.vet.mjs';

/* Bảng vết 1 — Floyd trên danh sách 8 nút, đuôi trỏ về nút 2 (hình chữ "6"). */
const N = 8, POS = 2;
const NUT = Array.from({ length: N }, (_, i) => i);
const fl = vetFloyd(N, POS);
const BANG_P1 = bangVet(['step', 'nodes 0…7 (tail 0–1, cycle 2…7)', 'slow', 'fast', 'note'],
  fl.pha1.map((h) => [
    String(h.buoc),
    oMang(NUT, { to: h.slow === h.fast ? { [h.slow]: 'ok' } : { [h.slow]: 'l', [h.fast]: 'r' }, nhan: h.slow === h.fast ? { [h.slow]: 'S=F' } : { [h.slow]: 'S', [h.fast]: 'F' }, tu: POS, den: N - 1 }),
    String(h.slow), String(h.fast),
    h.buoc === 0 ? 'both at the head' : h.slow === h.fast ? `meet at node ${h.slow}` : (h.slow >= POS ? `gap fast→slow = ${(h.slow - h.fast + (N - POS)) % (N - POS)}` : 'slow still in the tail'),
  ]));
const BANG_P2 = bangVet(['step', 'nodes', 'p (from head)', 'q (from meeting point)', 'note'],
  fl.pha2.map((h) => [
    String(h.buoc),
    oMang(NUT, { to: h.p === h.q ? { [h.p]: 'ok' } : { [h.p]: 'l', [h.q]: 'r' }, nhan: h.p === h.q ? { [h.p]: 'p=q' } : { [h.p]: 'p', [h.q]: 'q' }, tu: POS, den: N - 1 }),
    String(h.p), String(h.q),
    h.p === h.q ? `entry = node ${h.p}` : '',
  ]));

/* Bảng vết 2 — Find the Duplicate Number, [1,3,4,2,2]. */
const FD = [1, 3, 4, 2, 2];
const fd = vetFindDuplicate(FD);
const BANG_FD = bangVet(['phase', 'nums (index below)', 'pointer A', 'pointer B', 'note'],
  fd.hang.map((h) => [
    String(h.pha),
    oMang(FD, { chiSo: true, to: h.a === h.b ? { [h.a]: 'ok' } : { [h.a]: 'l', [h.b]: 'r' } }),
    h.pha === 1 ? `slow = ${h.a}` : `p = ${h.a}`,
    h.pha === 1 ? `fast = ${h.b}` : `slow = ${h.b}`,
    h.ghi === 'start' ? (h.pha === 1 ? 'slow = fast = nums[0]' : 'p restarts at nums[0]') : h.ghi === 'meet' ? 'meet inside the cycle' : h.ghi === 'entry' ? `entry ⇒ duplicate = ${h.a}` : '',
  ]));

const DE = [
  [lc(876, 'middle-of-the-linked-list', 'Middle of the Linked List', 'Easy'), 'Fast moves 2, slow moves 1; when fast falls off the end, slow is in the middle.', 'Nhanh đi 2, chậm đi 1; khi nhanh rơi khỏi cuối danh sách, chậm đứng giữa.'],
  [lc(141, 'linked-list-cycle', 'Linked List Cycle', 'Easy'), 'Floyd phase 1 only. Say the Set version first, then remove the memory.', 'Chỉ cần pha 1 của Floyd. Nói bản Set trước, rồi bỏ phần bộ nhớ.'],
  [lc(202, 'happy-number', 'Happy Number', 'Easy'), 'No list in sight: x → sum of squared digits IS the list. Cycle without 1 ⇒ unhappy.', 'Không thấy danh sách nào: x → tổng bình phương các chữ số CHÍNH LÀ danh sách. Có chu trình mà không có 1 ⇒ không vui.'],
  [lc(234, 'palindrome-linked-list', 'Palindrome Linked List', 'Easy'), 'First middle + reverse the second half + compare: O(1) extra memory.', 'Điểm giữa thứ nhất + đảo nửa sau + so sánh: O(1) bộ nhớ phụ.'],
  [lc(142, 'linked-list-cycle-ii', 'Linked List Cycle II', 'Medium'), 'Phase 2: one pointer from head, one from the meeting point, same speed ⇒ entry. Know the a = kL − b proof.', 'Pha 2: một con từ đầu, một con từ điểm gặp, cùng tốc độ ⇒ điểm vào. Thuộc chứng minh a = kL − b.'],
  [lc(287, 'find-the-duplicate-number', 'Find the Duplicate Number', 'Medium'), 'n + 1 values in 1..n, no modifying, O(1) memory ⇒ i → nums[i] is a list with a cycle.', 'n + 1 giá trị trong 1..n, không sửa mảng, bộ nhớ O(1) ⇒ i → nums[i] là danh sách có chu trình.'],
  [lc(143, 'reorder-list', 'Reorder List', 'Medium'), 'Three steps you know: first middle, reverse the second half, merge alternately.', 'Ba bước đã biết: điểm giữa thứ nhất, đảo nửa sau, trộn xen kẽ.'],
  [lc(457, 'circular-array-loop', 'Circular Array Loop', 'Medium'), 'Fast/slow on an array with wrap-around; a valid loop keeps one direction and has length &gt; 1.', 'Nhanh/chậm trên mảng vòng; vòng hợp lệ phải đi một chiều và dài hơn 1.'],
];

export default {
  title: '2.3 — Fast and slow pointers: cycles, middles and hidden lists|||2.3 — Con trỏ nhanh chậm: chu trình, điểm giữa và danh sách ẩn',
  slug: 'dsa-2-3-nhanh-cham',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thuật toán rùa và thỏ của Floyd: phát hiện chu trình với O(1) bộ nhớ, tìm điểm vào chu trình (chứng minh a = kL − b), điểm giữa danh sách, Happy Number và Find the Duplicate Number như danh sách ẩn — kèm bảng vết, mô phỏng đồ thị, số đo Set vs Floyd và chuỗi trang cha–con của chính repo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Fast and slow pointers: cycles, middles and hidden lists</h2>
<p class="lead">Two pointers again, same direction again — but now they move at <strong>different speeds</strong>. That one change answers questions that look impossible with O(1) memory: does this chain loop back on itself, where does the loop start, where is the middle of a list whose length you do not know? It also solves problems where no linked list is visible at all, like Happy Number and Find the Duplicate Number. Interviewers love it because the code is ten lines and the <em>proof</em> is the real test.</p>

<h3>The everyday picture</h3>
<p>Two friends run on a track, one twice as fast as the other. If the track is a straight road, the fast one reaches the end and they never meet again. If the track is a <strong>loop</strong> — a stadium ring — the fast runner eventually laps the slow one and they stand side by side. So "do they ever meet?" answers "is there a loop?" without anyone writing down where they have been.</p>
<p>And a second use of the same pair: walk along a queue of people you cannot count in advance. You move one person per step, your friend two. When your friend reaches the end of the queue, you are standing at the middle.</p>
<h3>A linked list in one paragraph</h3>
<p>A <strong>linked list</strong> is a chain of nodes; each node holds a value and a reference <code>next</code> to the following node; the last node’s <code>next</code> is <code>null</code>. There is no index: to reach the k-th node you follow <code>next</code> k times. A <strong>cycle</strong> means some node’s <code>next</code> points back to an earlier node, so following <code>next</code> never reaches <code>null</code>. LeetCode describes such input as "values + <code>pos</code>": the index the last node points back to, or −1 for no cycle. (Chapter 3 goes deep into linked-list surgery; here we only need to walk them.)</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Con trỏ nhanh chậm: chu trình, điểm giữa và danh sách ẩn</h2>
<p class="lead">Vẫn là hai con trỏ, vẫn cùng chiều — nhưng giờ chúng đi với <strong>tốc độ khác nhau</strong>. Chỉ một thay đổi đó trả lời được những câu tưởng như không thể làm với bộ nhớ O(1): chuỗi này có vòng lại chính nó không, vòng bắt đầu ở đâu, điểm giữa của một danh sách không biết trước độ dài nằm ở đâu? Nó còn giải được những đề mà nhìn vào chẳng thấy danh sách liên kết nào, như Happy Number và Find the Duplicate Number. Người phỏng vấn mê mẫu này vì code chỉ mười dòng còn <em>chứng minh</em> mới là bài kiểm tra thật.</p>

<h3>Hình dung đời thường</h3>
<p>Hai người bạn chạy bộ, một người nhanh gấp đôi người kia. Nếu đường chạy là một con đường thẳng, người nhanh tới cuối đường và họ không bao giờ gặp lại. Nếu đường chạy là một <strong>vòng</strong> — vòng sân vận động Mỹ Đình — người nhanh sớm muộn sẽ bắt kịp người chậm từ phía sau và hai người đứng cạnh nhau. Vậy câu hỏi "họ có gặp nhau không?" trả lời luôn câu "có vòng không?", mà không ai phải ghi lại mình đã đi qua những đâu.</p>
<p>Và công dụng thứ hai của cùng cặp đó: đi dọc một hàng người mà bạn không đếm trước được. Bạn đi một người mỗi bước, bạn của bạn đi hai. Khi bạn kia tới cuối hàng, bạn đang đứng ở chính giữa.</p>
<h3>Danh sách liên kết trong một đoạn</h3>
<p><strong>Linked list</strong> (danh sách liên kết) là một chuỗi nút; mỗi nút giữ một giá trị và một tham chiếu <code>next</code> tới nút kế tiếp; <code>next</code> của nút cuối là <code>null</code>. Không có chỉ số: muốn tới nút thứ k phải đi theo <code>next</code> k lần. <strong>Cycle</strong> (chu trình) nghĩa là <code>next</code> của một nút nào đó trỏ ngược về một nút phía trước, nên đi theo <code>next</code> không bao giờ gặp <code>null</code>. LeetCode mô tả đầu vào kiểu này bằng "các giá trị + <code>pos</code>": chỉ số mà nút cuối trỏ ngược về, hoặc −1 nếu không có chu trình. (Chương 3 đi sâu vào "phẫu thuật" danh sách liên kết; ở đây ta chỉ cần đi trên nó.)</p>
${csd('csd201-luyen-tap-list', 'vi', '1.5 Ba bài toán danh sách kinh điển', '<p>Bài 1.5 của CSD201 có Problem 2 — phát hiện chu trình bằng rùa và thỏ (Floyd) bằng Java. Ôn nhanh một câu: chậm đi 1, nhanh đi 2, gặp nhau ⇒ có chu trình. <strong>Ở đây đi sâu thêm:</strong> vì sao chắc chắn gặp và không "nhảy qua" nhau, tìm ĐIỂM VÀO chu trình với chứng minh a = kL − b, điểm giữa thứ nhất/thứ hai, và hai đề không có danh sách nào nhìn thấy được (Happy Number, Find the Duplicate Number).</p>')}
</div>

<div class="ml-en">
<h3>Floyd’s algorithm in four moves</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start together</span><span class="lz-d"><code>slow = fast = head</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Run at speeds 1 and 2</span><span class="lz-d"><code>while (fast &amp;&amp; fast.next)</code>: <code>slow = slow.next</code>, <code>fast = fast.next.next</code>. Fast hits <code>null</code> ⇒ no cycle.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Meet ⇒ cycle</span><span class="lz-d"><code>slow === fast</code> (same node, not same value) ⇒ there is a cycle, and the meeting point is inside it.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Find the entry</span><span class="lz-d">Restart one pointer at <code>head</code>, keep the other at the meeting point, move both one step at a time: they meet at the entry.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Thuật toán Floyd trong bốn nước đi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xuất phát cùng nhau</span><span class="lz-d"><code>slow = fast = head</code>.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Chạy với tốc độ 1 và 2</span><span class="lz-d"><code>while (fast &amp;&amp; fast.next)</code>: <code>slow = slow.next</code>, <code>fast = fast.next.next</code>. Nhanh gặp <code>null</code> ⇒ không có chu trình.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Gặp nhau ⇒ có chu trình</span><span class="lz-d"><code>slow === fast</code> (cùng NÚT, không phải cùng giá trị) ⇒ có chu trình, và điểm gặp nằm trong nó.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tìm điểm vào</span><span class="lz-d">Đưa một con trỏ về <code>head</code>, giữ con kia ở điểm gặp, cho cả hai đi từng bước một: chúng gặp nhau tại điểm vào.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Signals: when to reach for fast and slow</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"linked list" + "cycle" / "loop"</span><span class="v">Detect it (141), find where it starts (142), measure its length (keep one pointer, count steps until it returns).</span></div>
  <div class="kv"><span class="k">"middle", "split in half", "second half" of a list</span><span class="v">One pass instead of "count, then walk n/2". Palindrome list, reorder list, merge sort on a list.</span></div>
  <div class="kv"><span class="k">a function x → f(x) applied repeatedly on a finite set</span><span class="v">The sequence must eventually repeat ⇒ it is a "rho"-shaped list. Happy Number, PRNG periods, Pollard’s rho.</span></div>
  <div class="kv"><span class="k">"n + 1 numbers in 1..n", "do not modify", "O(1) space"</span><span class="v">Read the array as i → nums[i]: the duplicate value is where two arrows enter — the cycle entry.</span></div>
  <div class="kv"><span class="k">"O(1) memory" ruled out the visited Set</span><span class="v">The Set version is the brute force; fast/slow is the memory-free upgrade.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm nhanh chậm lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"linked list" + "cycle" / "loop" (chu trình / vòng)</span><span class="v">Phát hiện nó (141), tìm nơi nó bắt đầu (142), đo độ dài (giữ một con trỏ, đếm số bước tới khi nó quay lại).</span></div>
  <div class="kv"><span class="k">"middle", "split in half", "second half" (điểm giữa, chia đôi, nửa sau)</span><span class="v">Một lượt thay vì "đếm rồi đi n/2". Danh sách đối xứng, sắp xếp lại danh sách, merge sort trên danh sách.</span></div>
  <div class="kv"><span class="k">một hàm x → f(x) áp lặp lại trên một tập hữu hạn</span><span class="v">Dãy giá trị chắc chắn có lúc lặp lại ⇒ nó là một danh sách hình chữ "rho" (ρ). Happy Number, chu kỳ bộ sinh số ngẫu nhiên, Pollard’s rho.</span></div>
  <div class="kv"><span class="k">"n + 1 số trong 1..n", "không sửa mảng", "O(1) bộ nhớ"</span><span class="v">Đọc mảng thành i → nums[i]: giá trị trùng là chỗ có hai mũi tên cùng đi vào — điểm vào chu trình.</span></div>
  <div class="kv"><span class="k">"O(1) bộ nhớ" đã loại Set "đã thăm"</span><span class="v">Bản Set là vét cạn; nhanh/chậm là bản nâng cấp không tốn bộ nhớ.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example 1: Linked List Cycle — Set first, then Floyd</h3>
<p><strong>Problem.</strong> Given the head of a linked list, return whether it contains a cycle.</p>
<p><strong>First answer.</strong> Walk the list and store every <em>node</em> in a Set; if you see a node twice, there is a cycle; if you reach <code>null</code>, there is none. O(n) time and O(n) memory. Store nodes, not values — the last test below has four nodes with the value 1 and no cycle.</p>
<p><strong>Second answer.</strong> Floyd: slow moves one node, fast moves two. If there is no cycle, fast reaches <code>null</code> first. If there is one, both eventually enter it; from then on, every step fast gains exactly one node on slow, so the gap (measured along the cycle from fast to slow) shrinks by one per step and reaches 0 within one lap. Fast cannot "jump over" slow: a gap that shrinks by exactly 1 cannot skip 0. O(n) time, <strong>O(1)</strong> memory.</p>
</div>
<div class="ml-vi">
<h3>Giải mẫu 1: Linked List Cycle — Set trước, rồi Floyd</h3>
<p><strong>Đề.</strong> Cho nút đầu (head) của một danh sách liên kết, trả lời nó có chứa chu trình không.</p>
<p><strong>Lời giải đầu.</strong> Đi dọc danh sách và cất mọi <em>nút</em> vào một Set; gặp lại một nút ⇒ có chu trình; tới <code>null</code> ⇒ không có. O(n) thời gian và O(n) bộ nhớ. Cất nút, không cất giá trị — ca test cuối bên dưới có bốn nút cùng giá trị 1 mà không có chu trình nào.</p>
<p><strong>Lời giải thứ hai.</strong> Floyd: chậm đi một nút, nhanh đi hai. Không có chu trình thì nhanh gặp <code>null</code> trước. Có chu trình thì cả hai sớm muộn đều vào trong nó; từ lúc đó, mỗi bước nhanh rút ngắn khoảng cách thêm đúng một nút, nên khoảng cách (đo dọc chu trình từ nhanh tới chậm) giảm 1 mỗi bước và về 0 trong vòng một lượt. Nhanh không thể "nhảy qua" chậm: một khoảng cách giảm đúng 1 mỗi lần thì không bỏ qua được số 0. O(n) thời gian, bộ nhớ <strong>O(1)</strong>.</p>
</div>
${ma('ch02/has-cycle.ts', { vung: 'node', nhan: 'TypeScript — the node and LeetCode’s (values, pos) input' })}
${maHai('ch02/has-cycle.ts', 'ch02/HasCycle.java', { vung: 'set' })}
${maHai('ch02/has-cycle.ts', 'ch02/HasCycle.java', { vung: 'floyd' })}
${ketQua('ch02/has-cycle.ts')}
${ketQua('ch02/HasCycle.java')}
<div class="ml-en">
<p>Three details. The loop condition <code>fast !== null &amp;&amp; fast.next !== null</code> checks the road two steps ahead, and <em>in that order</em> (more on that in the trap below). <code>slow === fast</code> compares references — two different nodes with the same value are not a meeting. And in Java, <code>HashSet&lt;ListNode&gt;</code> works by identity only because <code>ListNode</code> does not override <code>equals</code>/<code>hashCode</code>; a node class that compares by value would make the Set version report false cycles (lesson 1.1’s hashCode contract, seen from the other side).</p>
</div>
<div class="ml-vi">
<p>Ba chi tiết. Điều kiện vòng lặp <code>fast !== null &amp;&amp; fast.next !== null</code> dò đường trước hai bước, và <em>đúng thứ tự đó</em> (xem bẫy ở dưới). <code>slow === fast</code> so tham chiếu — hai nút khác nhau cùng giá trị không phải là "gặp nhau". Còn trong Java, <code>HashSet&lt;ListNode&gt;</code> chạy theo danh tính chỉ vì <code>ListNode</code> không ghi đè <code>equals</code>/<code>hashCode</code>; một lớp nút so theo giá trị sẽ làm bản Set báo chu trình giả (giao ước hashCode của bài 1.1, nhìn từ phía bên kia).</p>
</div>

<div class="ml-en">
<h3>Worked example 2: Linked List Cycle II — where does the cycle start?</h3>
<p><strong>Problem.</strong> Return the node where the cycle begins, or <code>null</code>. The Set answer is immediate (the first node you see twice is the entry). The O(1)-memory answer needs the most famous proof in this chapter. Name three distances: <strong>a</strong> = steps from head to the entry, <strong>b</strong> = steps from the entry forward to the meeting point, <strong>L</strong> = length of the cycle.</p>
<ul>
<li>When they meet, slow has walked <code>a + b</code> steps. Fast has walked twice as many, <code>2(a + b)</code>, and it covered the same path plus some whole laps: <code>2(a + b) = a + b + kL</code> for some k ≥ 1.</li>
<li>So <code>a + b = kL</code>, i.e. <strong><code>a = kL − b</code></strong>.</li>
<li>From the meeting point (b steps past the entry), walking <code>kL − b</code> more steps brings you back to the entry. And walking <code>a</code> steps from the head also lands on the entry. Since those are the same number of steps, two pointers — one from head, one from the meeting point, both speed 1 — meet <em>exactly</em> at the entry.</li>
</ul>
<p>Slow is caught before it completes one lap of the cycle, so phase 1 takes at most a + L steps and phase 2 takes a steps: O(n) total.</p>
</div>
<div class="ml-vi">
<h3>Giải mẫu 2: Linked List Cycle II — chu trình bắt đầu ở đâu?</h3>
<p><strong>Đề.</strong> Trả về nút nơi chu trình bắt đầu, hoặc <code>null</code>. Lời giải bằng Set có ngay (nút đầu tiên gặp lại chính là điểm vào). Lời giải bộ nhớ O(1) cần chứng minh nổi tiếng nhất chương này. Đặt tên ba khoảng cách: <strong>a</strong> = số bước từ head tới điểm vào, <strong>b</strong> = số bước từ điểm vào đi tới điểm gặp, <strong>L</strong> = độ dài chu trình.</p>
<ul>
<li>Lúc gặp nhau, chậm đã đi <code>a + b</code> bước. Nhanh đi gấp đôi, <code>2(a + b)</code>, và nó đi đúng con đường đó cộng thêm vài vòng trọn: <code>2(a + b) = a + b + kL</code> với một k ≥ 1 nào đó.</li>
<li>Suy ra <code>a + b = kL</code>, tức là <strong><code>a = kL − b</code></strong>.</li>
<li>Từ điểm gặp (đã qua điểm vào b bước), đi thêm <code>kL − b</code> bước là quay về đúng điểm vào. Còn đi <code>a</code> bước từ head cũng tới điểm vào. Vì hai số bước đó bằng nhau, hai con trỏ — một từ head, một từ điểm gặp, cùng tốc độ 1 — gặp nhau <em>đúng</em> tại điểm vào.</li>
</ul>
<p>Chậm bị bắt kịp trước khi đi hết một vòng chu trình, nên pha 1 tốn tối đa a + L bước và pha 2 tốn a bước: tổng O(n).</p>
</div>
${maHai('ch02/cycle-entry.ts', 'ch02/CycleEntry.java', { vung: 'entry' })}
${ketQua('ch02/cycle-entry.ts')}
<div class="ml-en">
<h3>Watch it run: phase 1, then phase 2</h3>
<p>A list of 8 nodes shaped like the digit 6: tail 0 → 1, then the cycle 2 → 3 → … → 7 → 2. So a = 2 and L = 6. Green background = the cycle; blue S = slow, orange F = fast. Both tables come from running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: pha 1, rồi pha 2</h3>
<p>Danh sách 8 nút hình chữ số 6: đuôi 0 → 1, rồi chu trình 2 → 3 → … → 7 → 2. Vậy a = 2 và L = 6. Nền xanh nhạt = chu trình; S xanh dương = chậm, F cam = nhanh. Cả hai bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_P1}
${BANG_P2}
<div class="ml-en">
<p>Phase 1: slow enters the cycle at step 2; at that moment fast is at node 4 and the gap from fast to slow is 4. It goes 4 → 3 (step 3) → 2 → 1 → 0: they meet at node 6 after 6 steps. Check the proof with real numbers: slow walked a + b = 6, so b = 4 (node 2 + 4 = node 6), and a = kL − b = 6 − 4 = 2 with k = 1. Phase 2 takes exactly a = 2 steps: p goes 0 → 1 → 2, q goes 6 → 7 → 2. Entry = node 2 = <code>pos</code>.</p>
${moPhong('ch02/floyd.sim.js', 'en', 'Floyd’s tortoise and hare on a “6”-shaped list', 'A real graph of the list: watch fast lap slow, then the two phase-2 pointers meet at the entry.')}
</div>
<div class="ml-vi">
<p>Pha 1: chậm vào chu trình ở bước 2; lúc đó nhanh ở nút 4 và khoảng cách từ nhanh tới chậm là 4. Nó giảm 4 → 3 (bước 3) → 2 → 1 → 0: hai bên gặp nhau ở nút 6 sau 6 bước. Kiểm chứng minh bằng số thật: chậm đã đi a + b = 6, nên b = 4 (nút 2 + 4 = nút 6), và a = kL − b = 6 − 4 = 2 với k = 1. Pha 2 tốn đúng a = 2 bước: p đi 0 → 1 → 2, q đi 6 → 7 → 2. Điểm vào = nút 2 = <code>pos</code>.</p>
${moPhong('ch02/floyd.sim.js', 'vi', 'Rùa và thỏ của Floyd trên danh sách hình chữ “6”', 'Đồ thị thật của danh sách: xem nhanh bắt kịp chậm, rồi hai con trỏ pha 2 gặp nhau ở điểm vào.')}
</div>

<div class="ml-en">
<h3>Measured: the Set costs memory and time, Floyd costs two variables</h3>
<p>A list of n nodes whose tail points back to the middle (so a = n/2, L = n/2):</p>
</div>
<div class="ml-vi">
<h3>Đo bằng số: Set tốn bộ nhớ và thời gian, Floyd tốn hai biến</h3>
<p>Danh sách n nút có đuôi trỏ ngược về giữa (nên a = n/2, L = n/2):</p>
</div>
${ma('ch02/nhanh-cham-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch02/nhanh-cham-do.ts')}
${ketQua('ch02/NhanhChamDo.java')}
<div class="ml-en">
<p>Both are O(n) — the times grow roughly 10–15× per 10× of n (the Set a bit faster, as its table outgrows the caches) — but the constants are very different: at a million nodes the Set needs ~59 ms in Node (~86 ms in Java) and holds a million entries, while Floyd needs ~1.6 ms (~2.1 ms) and two references. The "slow steps" column also confirms the proof: slow walked exactly 500,000 = n/2 steps, i.e. a + b = kL with b = 0 here (they meet at the entry because a happens to equal L). The time gap comes from what the Set must do per node: hash a reference, probe a table, grow the table and copy it several times. Lesson: "same Big-O" does not mean "same cost", and memory is a resource the interviewer will ask about.</p>
</div>
<div class="ml-vi">
<p>Cả hai đều O(n) — thời gian tăng khoảng 10–15 lần mỗi khi n tăng 10 lần (Set tăng nhanh hơn một chút khi bảng của nó phình ra khỏi bộ đệm CPU) — nhưng hằng số khác hẳn: với một triệu nút, Set tốn khoảng 59 ms trên Node (khoảng 86 ms trên Java) và giữ một triệu mục, còn Floyd tốn khoảng 1,6 ms (2,1 ms) và hai tham chiếu. Cột "slow steps" còn xác nhận chứng minh: chậm đi đúng 500.000 = n/2 bước, tức a + b = kL với b = 0 ở đây (gặp ngay tại điểm vào vì a tình cờ bằng L). Khoảng chênh thời gian đến từ việc Set phải làm cho mỗi nút: băm một tham chiếu, dò bảng, nới bảng và chép lại nhiều lần. Bài học: "cùng Big-O" không có nghĩa là "cùng chi phí", và bộ nhớ là tài nguyên người phỏng vấn sẽ hỏi tới.</p>
</div>

<div class="ml-en">
<h3>Pattern 2 — Middle of the Linked List: which middle?</h3>
<p>Fast at speed 2 reaches the end when slow has covered half the list. For an odd length there is one middle. For an even length there are two, and the loop condition decides which one you get: <code>while (fast &amp;&amp; fast.next)</code> stops with slow on the <strong>second</strong> middle (what LC 876 wants); <code>while (fast.next &amp;&amp; fast.next.next)</code> stops on the <strong>first</strong> middle — the one you need to cut a list into two halves of equal size (or the left half one longer), for Palindrome Linked List, Reorder List and merge sort on lists.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — Middle of the Linked List: điểm giữa nào?</h3>
<p>Nhanh tốc độ 2 tới cuối đúng lúc chậm đi được nửa danh sách. Độ dài lẻ thì có một điểm giữa. Độ dài chẵn thì có hai, và điều kiện vòng lặp quyết định bạn nhận cái nào: <code>while (fast &amp;&amp; fast.next)</code> dừng với chậm ở điểm giữa <strong>thứ hai</strong> (đúng thứ LC 876 muốn); <code>while (fast.next &amp;&amp; fast.next.next)</code> dừng ở điểm giữa <strong>thứ nhất</strong> — cái bạn cần để cắt danh sách thành hai nửa bằng nhau (hoặc nửa trái dài hơn một), dùng cho Palindrome Linked List, Reorder List và merge sort trên danh sách.</p>
</div>
${maHai('ch02/middle.ts', 'ch02/Middle.java', { vung: 'giua' })}
${ketQua('ch02/middle.ts')}
<div class="ml-en">
<p>Read the second and fourth lines: on <code>[1..6]</code> the two loops give 4 and 3; on <code>[7, 8]</code> they give 8 and 7. If you split at the second middle when you needed the first, the halves are uneven and a palindrome check compares the wrong pair. Say which middle you want before writing the condition.</p>
</div>
<div class="ml-vi">
<p>Đọc dòng thứ hai và thứ tư: với <code>[1..6]</code> hai vòng lặp cho 4 và 3; với <code>[7, 8]</code> cho 8 và 7. Cắt ở điểm giữa thứ hai trong khi lẽ ra cần điểm thứ nhất thì hai nửa lệch nhau và phép kiểm đối xứng so nhầm cặp. Hãy nói rõ bạn muốn điểm giữa nào trước khi viết điều kiện.</p>
</div>

<div class="ml-en">
<h3>Pattern 3 — Happy Number: the list you cannot see</h3>
<p>A number is <em>happy</em> if repeatedly replacing it by the sum of the squares of its digits reaches 1 (19 → 82 → 68 → 100 → 1). Otherwise the sequence loops forever. There is no linked list in the statement — but <code>x → next(x)</code> <em>is</em> one: every number points to exactly one next number. So "happy" means "the walk reaches the node 1" (which points to itself), and "unhappy" means "it falls into a cycle that does not contain 1".</p>
<p>Why must it loop at all? A number with d digits maps to at most 81·d. For four or more digits that is smaller than the number itself (81·4 = 324 &lt; 1000), so every sequence drops below 1000 and then stays there (a 3-digit number maps to at most 243) — a finite set, and a walk in a finite set must eventually repeat. That two-line argument is a good answer to "how do you know your loop terminates?". The Set version stores the values seen; Floyd removes the Set.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 3 — Happy Number: danh sách không nhìn thấy</h3>
<p>Một số là <em>happy</em> (số vui) nếu cứ thay nó bằng tổng bình phương các chữ số mãi thì sẽ tới 1 (19 → 82 → 68 → 100 → 1). Không thì dãy lặp vòng mãi. Đề không có danh sách liên kết nào — nhưng <code>x → next(x)</code> <em>chính là</em> một danh sách: mỗi số trỏ tới đúng một số kế tiếp. Vậy "vui" nghĩa là "đi tới được nút 1" (nút tự trỏ vào chính nó), còn "không vui" nghĩa là "rơi vào một chu trình không chứa 1".</p>
<p>Vì sao chắc chắn có vòng? Một số có d chữ số biến thành tối đa 81·d. Với từ bốn chữ số trở lên, con số đó nhỏ hơn chính nó (81·4 = 324 &lt; 1000), nên mọi dãy đều tụt xuống dưới 1000 rồi ở luôn dưới đó (số có 3 chữ số biến thành tối đa 243) — một tập hữu hạn — mà đi mãi trong một tập hữu hạn thì sớm muộn phải lặp lại. Lập luận hai dòng đó là câu trả lời tốt cho "sao em biết vòng lặp của em dừng?". Bản Set lưu các giá trị đã thấy; Floyd bỏ được Set.</p>
</div>
${maHai('ch02/happy.ts', 'ch02/Happy.java', { vung: 'happy' })}
${ketQua('ch02/happy.ts')}
<div class="ml-en">
<p>The chain for 2 is the textbook unhappy cycle: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, eight numbers, and every unhappy number ends in it. The loop condition <code>fast !== 1</code> matters: 1 maps to itself, so without it slow and fast would also "meet" at 1 — fine for the answer, but stopping at 1 says what you mean.</p>
</div>
<div class="ml-vi">
<p>Chuỗi của 2 là chu trình "không vui" kinh điển: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4, tám số, và mọi số không vui đều rơi vào nó. Điều kiện <code>fast !== 1</code> có ý nghĩa: 1 biến thành chính nó, nên thiếu điều kiện đó thì chậm và nhanh cũng sẽ "gặp nhau" ở 1 — đáp án vẫn đúng, nhưng dừng ở 1 thì code nói đúng điều bạn muốn.</p>
</div>

<div class="ml-en">
<h3>Pattern 4 — Find the Duplicate Number: an array that is secretly a list</h3>
<p><strong>Problem.</strong> <code>nums</code> has n + 1 integers, each in <code>1..n</code>, so at least one value repeats (pigeonhole); exactly one value repeats (possibly many times). Find it <em>without modifying the array</em> and with O(1) extra memory. Sorting modifies, a Set uses O(n) memory, and binary search on the value range (Chapter 4) costs O(n log n). The O(n) answer reads the array as a list: index i points to index <code>nums[i]</code>.</p>
<ul>
<li>No value is 0, so nothing points to index 0: index 0 is the start of a tail.</li>
<li>Every index points somewhere inside <code>0..n</code>, so the walk never ends: there is a cycle.</li>
<li>The duplicate value v appears at two indices, so <strong>two arrows enter v</strong> — one from the tail, one from inside the cycle. A node with two incoming arrows on a "ρ" shape is exactly the cycle entry.</li>
</ul>
<p>So Floyd’s phase 2 returns the duplicate. Below, on <code>[1, 3, 4, 2, 2]</code>, with the index under each cell: the path is 0 → 1 → 3 → 2 → 4 → 2 → 4 …, and 2 is entered from index 3 and from index 4.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 4 — Find the Duplicate Number: một mảng thật ra là danh sách</h3>
<p><strong>Đề.</strong> <code>nums</code> có n + 1 số nguyên, mỗi số trong <code>1..n</code>, nên ít nhất một giá trị lặp (nguyên lý chuồng bồ câu); đề đảm bảo đúng một giá trị lặp (có thể lặp nhiều lần). Tìm nó <em>mà không sửa mảng</em> và chỉ dùng O(1) bộ nhớ phụ. Sắp xếp thì sửa mảng, Set thì tốn O(n) bộ nhớ, tìm nhị phân trên miền giá trị (Chương 4) thì tốn O(n log n). Lời giải O(n) đọc mảng thành một danh sách: chỉ số i trỏ tới chỉ số <code>nums[i]</code>.</p>
<ul>
<li>Không giá trị nào bằng 0, nên không gì trỏ tới chỉ số 0: chỉ số 0 là đầu của một cái đuôi.</li>
<li>Chỉ số nào cũng trỏ vào đâu đó trong <code>0..n</code>, nên đi mãi không hết: có chu trình.</li>
<li>Giá trị trùng v xuất hiện ở hai chỉ số, nên <strong>có hai mũi tên cùng đi vào v</strong> — một từ cái đuôi, một từ trong chu trình. Trên hình chữ "ρ", nút có hai mũi tên đi vào chính là điểm vào chu trình.</li>
</ul>
<p>Vậy pha 2 của Floyd trả về đúng số trùng. Dưới đây, với <code>[1, 3, 4, 2, 2]</code>, chỉ số ghi dưới mỗi ô: đường đi là 0 → 1 → 3 → 2 → 4 → 2 → 4 …, và 2 được đi vào từ chỉ số 3 và từ chỉ số 4.</p>
</div>
${maHai('ch02/find-duplicate.ts', 'ch02/FindDuplicate.java', { vung: 'floyd' })}
${ketQua('ch02/find-duplicate.ts')}
${BANG_FD}
<div class="ml-en">
<p>Read the pointers as <em>indices</em> (the highlighted cells). Phase 1 meets at index 2 after two steps; phase 2 restarts p at <code>nums[0]</code> = 1 and both walk 1 → 3 → 2 and 2 → 4 → 2: they meet at 2, the duplicate (= ${fd.dup}). Notice the <code>do … while</code> in phase 1: both pointers start at the same place, so a plain <code>while (slow !== fast)</code> would stop before moving.</p>
</div>
<div class="ml-vi">
<p>Đọc các con trỏ như <em>chỉ số</em> (các ô được tô). Pha 1 gặp nhau ở chỉ số 2 sau hai bước; pha 2 đưa p về <code>nums[0]</code> = 1 và cả hai đi 1 → 3 → 2 và 2 → 4 → 2: gặp nhau ở 2, chính là số trùng (= ${fd.dup}). Để ý vòng <code>do … while</code> ở pha 1: hai con trỏ xuất phát cùng chỗ, nên một vòng <code>while (slow !== fast)</code> thường sẽ dừng ngay trước khi kịp đi.</p>
<p>Cách tìm nhị phân trên miền giá trị (đếm bao nhiêu số ≤ mid) là một lời giải thứ hai rất đáng nói khi phỏng vấn — bạn sẽ gặp nó ở <a href="${baiNay('dsa-4-3-khong-gian-dap-an')}">bài 4.3 — Nhị phân trên đáp án</a>.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Two fast/slow bugs that pass half the tests.</strong></p><p>(1) The null checks in the wrong order: <code>fast.next !== null &amp;&amp; fast !== null</code> reads <code>fast.next</code> before knowing <code>fast</code> exists. (2) Starting phase 1 with <code>fast = head.next</code> "so the loop can be a plain while" — then phase 2 never meets. Both run for real here:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Hai lỗi nhanh/chậm qua được một nửa số test.</strong></p><p>(1) Kiểm null sai thứ tự: <code>fast.next !== null &amp;&amp; fast !== null</code> đọc <code>fast.next</code> trước khi biết <code>fast</code> có tồn tại. (2) Bắt đầu pha 1 với <code>fast = head.next</code> "cho vòng lặp viết được bằng while thường" — rồi pha 2 không bao giờ gặp nhau. Cả hai chạy thật ở đây:</p></div>
</div>
${ma('ch02/bay-diem-vao.ts', { vung: 'sai1', nhan: 'TypeScript — bug 1' })}
${ma('ch02/bay-diem-vao.ts', { vung: 'sai2', nhan: 'TypeScript — bug 2 (capped so it terminates)' })}
${ketQua('ch02/bay-diem-vao.ts')}
<div class="ml-en">
<p>Bug 1 survives every odd-length test (fast stops on the last node and <code>fast.next</code> is <code>null</code>) and crashes on every even-length one (fast jumps to <code>null</code>, then <code>null.next</code> throws). In Java it is a <code>NullPointerException</code>. Bug 2 shifts the meeting point by one, so in phase 2 the two pointers circle the cycle one step apart forever — on LeetCode that is "Time Limit Exceeded", in production a request that never returns. The <code>a = kL − b</code> proof assumed both pointers started at head; change the start and you must redo the proof.</p>
</div>
<div class="ml-vi">
<p>Lỗi 1 sống sót qua mọi test độ dài lẻ (nhanh dừng ở nút cuối và <code>fast.next</code> là <code>null</code>) và sập ở mọi test độ dài chẵn (nhanh nhảy vào <code>null</code>, rồi <code>null.next</code> ném lỗi). Trong Java nó là <code>NullPointerException</code>. Lỗi 2 làm lệch điểm gặp một bước, nên ở pha 2 hai con trỏ đi vòng quanh chu trình cách nhau một bước mãi mãi — trên LeetCode là "Time Limit Exceeded", ở production là một request không bao giờ trả về. Chứng minh <code>a = kL − b</code> giả định hai con trỏ cùng xuất phát ở head; đổi điểm xuất phát thì phải chứng minh lại.</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives: parent pointers in this repo</h3>
<p>The most common "linked list" in real backends is not a <code>ListNode</code> class — it is a <code>parentId</code> column. Pages inside pages, folders inside folders, a manager chain, replies to replies. "Show the breadcrumb" means "walk up <code>parentId</code> until <code>null</code>" — and a cycle (A’s parent is B, B’s parent is A) turns that walk into an infinite loop.</p>
<p>This repository defends in two places. <code>src/services/notesHierarchy.service.ts</code> › <code>setNoteParent</code> guards the <strong>write</strong>: before moving a note under a new parent, it walks up from the proposed parent and rejects the move with <code>PARENT_CYCLE</code> if it meets the note itself (and <code>SELF_PARENT</code> / <code>MAX_DEPTH</code> for the other two bad cases). Its <code>ancestorsOf</code>, and the CT Work version in <code>src/services/work/pages.service.ts</code> (<code>for (let i = 0; cur &amp;&amp; i &lt; MAX_DEPTH + 2; i++)</code>), guard the <strong>read</strong> with a depth cap, so even corrupted rows cannot hang a request. Floyd is the third tool: when you cannot cap the depth (unknown, unbounded chains) and cannot afford a Set, it detects the ring with two variables. The program below reproduces all three on a small tree:</p>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu: con trỏ cha trong chính repo này</h3>
<p>"Danh sách liên kết" hay gặp nhất ở backend thật không phải một lớp <code>ListNode</code> — mà là một cột <code>parentId</code>. Trang lồng trong trang, thư mục trong thư mục, chuỗi quản lý cấp trên, trả lời của trả lời. "Hiện breadcrumb (đường dẫn trang cha)" nghĩa là "đi ngược theo <code>parentId</code> tới khi gặp <code>null</code>" — và một chu trình (cha của A là B, cha của B là A) biến cuộc đi đó thành vòng lặp vô hạn.</p>
<p>Repo này phòng ở hai chỗ. <code>src/services/notesHierarchy.service.ts</code> › <code>setNoteParent</code> canh lúc <strong>ghi</strong>: trước khi chuyển một ghi chú vào dưới trang cha mới, nó đi ngược từ trang cha đề xuất và từ chối với mã <code>PARENT_CYCLE</code> nếu gặp lại chính ghi chú đó (cùng <code>SELF_PARENT</code> / <code>MAX_DEPTH</code> cho hai ca xấu còn lại). Hàm <code>ancestorsOf</code> của nó, và bản CT Work trong <code>src/services/work/pages.service.ts</code> (<code>for (let i = 0; cur &amp;&amp; i &lt; MAX_DEPTH + 2; i++)</code>), canh lúc <strong>đọc</strong> bằng trần độ sâu, nên kể cả dữ liệu đã hỏng cũng không treo được request. Floyd là công cụ thứ ba: khi không đặt trần được (chuỗi không biết dài bao nhiêu) và không đủ bộ nhớ cho một Set, nó phát hiện vòng chỉ với hai biến. Chương trình dưới đây tái hiện cả ba trên một cây nhỏ:</p>
</div>
${ma('ch02/parent-chain.ts', { vung: 'ghi', nhan: 'TypeScript — guard on write (like setNoteParent)' })}
${ma('ch02/parent-chain.ts', { vung: 'doc', nhan: 'TypeScript — Floyd on read, for data that may already be corrupted' })}
${ketQua('ch02/parent-chain.ts')}
<div class="ml-en">
<p>Other real places: browsers stop following HTTP redirects after a fixed number of hops (that is a depth cap — Chrome reports <code>ERR_TOO_MANY_REDIRECTS</code>); a pseudo-random generator <code>x → f(x)</code> on a finite state space always ends in a cycle, and Floyd (or Brent’s variant) measures its period; <strong>Pollard’s rho</strong> factors integers by running Floyd on <code>x → x² + c (mod n)</code> — the "ρ" shape is where the name comes from.</p>
</div>
<div class="ml-vi">
<p>Những chỗ thật khác: trình duyệt ngừng theo chuyển hướng HTTP sau một số bước cố định (đó là trần độ sâu — Chrome báo <code>ERR_TOO_MANY_REDIRECTS</code>); một bộ sinh số giả ngẫu nhiên <code>x → f(x)</code> trên tập trạng thái hữu hạn luôn kết thúc trong một chu trình, và Floyd (hoặc biến thể của Brent) đo được chu kỳ của nó; <strong>Pollard’s rho</strong> phân tích số nguyên ra thừa số bằng cách chạy Floyd trên <code>x → x² + c (mod n)</code> — hình chữ "ρ" chính là gốc của cái tên.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: a loop the attacker builds for you</h3>
<p>If users can set a parent (move a page, choose a manager, reply to a comment by id) and the server walks the chain without a guard, a cycle is a denial-of-service you invite by API: two requests make A the parent of B and B the parent of A, then every breadcrumb, permission check or "inherit settings from parent" call on A spins until the process is killed. Sometimes the attacker does not even need a race — a direct <code>PATCH</code> with <code>parentId</code> set to its own descendant is enough when the server only checks "does the parent exist?". Defences, in order: validate on write by walking up from the new parent (what <code>setNoteParent</code> does); cap every read walk (what both <code>ancestorsOf</code> functions do); and make the write atomic with the check, since two concurrent moves can each pass the check and together create a ring.</p>
<p>The same algorithm also serves attackers. Rho-style collision search runs Floyd on <code>x → H(x)</code> to find two inputs with the same <em>truncated</em> hash using almost no memory — one reason security reviews reject 32-bit or 64-bit "short hashes" as identifiers for anything that must not collide.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: một vòng lặp do kẻ tấn công dựng giúp bạn</h3>
<p>Nếu người dùng được tự đặt trang cha (chuyển một trang, chọn người quản lý, trả lời một bình luận theo id) mà máy chủ đi theo chuỗi không có chốt chặn, thì chu trình là một vụ từ chối dịch vụ (DoS) bạn tự mời vào qua API: hai request làm A thành cha của B và B thành cha của A, rồi mọi lời gọi breadcrumb, kiểm quyền hay "thừa hưởng cài đặt từ trang cha" trên A cứ quay mãi tới khi tiến trình bị giết. Có khi kẻ tấn công chẳng cần chạy đua — một lệnh <code>PATCH</code> đặt <code>parentId</code> bằng chính hậu duệ của nó là đủ, nếu máy chủ chỉ kiểm "trang cha có tồn tại không?". Cách phòng, theo thứ tự: kiểm lúc ghi bằng cách đi ngược từ trang cha mới (việc <code>setNoteParent</code> làm); đặt trần cho mọi cuộc đi ngược lúc đọc (việc cả hai hàm <code>ancestorsOf</code> làm); và làm phép ghi nguyên tử cùng phép kiểm, vì hai lần chuyển chạy đồng thời có thể cùng qua phép kiểm rồi chung tay tạo ra một vòng.</p>
<p>Chính thuật toán này cũng phục vụ kẻ tấn công. Tìm va chạm kiểu rho chạy Floyd trên <code>x → H(x)</code> để tìm hai đầu vào có cùng giá trị băm <em>bị cắt ngắn</em> mà gần như không tốn bộ nhớ — một lý do các đợt rà soát bảo mật bác bỏ "mã băm ngắn" 32 hay 64 bit làm định danh cho thứ không được phép trùng.</p>
${csd('csd201-linked-list', 'vi', '1.2 Danh sách liên kết đơn, vòng & đôi', '<p>Bài 1.2 có danh sách liên kết VÒNG làm có chủ đích (nút cuối trỏ về đầu). Ở đây là mặt tối của nó: một vòng KHÔNG ai định tạo ra, và cách phát hiện nó khi không biết trước danh sách dài bao nhiêu.</p>')}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given the head of a linked list, return the node where a cycle begins, or null if there is no cycle.'],
  ['C', 'Can I modify the list? And is there a memory constraint?'],
  ['N', 'If modification were allowed, marking visited nodes would work; asking shows you know the options.'],
  ['I', 'Don’t modify it. Try for constant memory.'],
  ['C', 'The simple way is a hash set of visited nodes — the first node I see twice is the entry, O(n) time and space. For constant space I’ll use Floyd: slow moves one, fast moves two; if fast hits null there’s no cycle, otherwise they meet inside it.'],
  ['C', 'Then I reset one pointer to head and move both one step at a time; they meet at the entry. Why: if a is the tail length, b the distance from the entry to the meeting point and L the cycle length, fast walked twice slow’s distance, so a + b is a multiple of L, which means a equals kL minus b.'],
  ['N', 'Give the proof before you are asked: it is the follow-up in almost every interview.'],
  ['I', 'Good. Code it.'],
  ['C', '(coding) The loop checks fast and fast.next, in that order… slow equals fast compares references, not values. Test: a single node with no cycle — fast.next is null, return null. Two nodes pointing at each other — they meet at the head, phase 2 returns the head immediately.'],
  ['N', 'Pick the smallest cases: one node, and a cycle that starts at the head (a = 0).'],
  ['I', 'Where else does this idea show up?'],
  ['C', 'Any function applied repeatedly on a finite set — Happy Number, or Find the Duplicate Number where index i points to nums[i] and the duplicate is the cycle entry. In real systems, parent-id chains: you validate on write and cap the walk on read.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Cùng mạch hội thoại ở khối tiếng Anh, bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho head của một danh sách liên kết, trả về nút nơi chu trình bắt đầu, hoặc null nếu không có chu trình.'],
  ['C', 'Em có được sửa danh sách không ạ? Và có ràng buộc bộ nhớ không? <em>("Can I modify the list? Is there a memory constraint?")</em>'],
  ['N', 'Nếu được sửa thì đánh dấu nút đã thăm cũng xong; hỏi câu này cho thấy bạn biết các lựa chọn.'],
  ['I', 'Không sửa. Cố dùng bộ nhớ hằng số.'],
  ['C', 'Cách đơn giản là hash set các nút đã thăm — nút đầu tiên gặp lại là điểm vào, O(n) thời gian và bộ nhớ. Để bộ nhớ hằng số em dùng Floyd: chậm đi một, nhanh đi hai; nhanh gặp null là không có chu trình, không thì hai bên gặp nhau bên trong nó.'],
  ['C', 'Rồi em đưa một con trỏ về head và cho cả hai đi từng bước; chúng gặp nhau ở điểm vào. Vì sao: gọi a là độ dài đuôi, b là khoảng từ điểm vào tới điểm gặp, L là độ dài chu trình, nhanh đi gấp đôi chậm nên a + b là bội của L, tức a bằng kL trừ b. <em>("a equals kL minus b.")</em>'],
  ['N', 'Đưa ra chứng minh trước khi bị hỏi: đó là câu hỏi nối tiếp của gần như mọi buổi phỏng vấn.'],
  ['I', 'Tốt. Code đi.'],
  ['C', '(vừa code vừa nói) Vòng lặp kiểm fast rồi mới tới fast.next, đúng thứ tự đó… slow bằng fast là so tham chiếu, không so giá trị. Test: một nút không chu trình — fast.next là null, trả null. Hai nút trỏ vào nhau — gặp nhau ở head, pha 2 trả head ngay.'],
  ['N', 'Chọn các ca nhỏ nhất: một nút, và chu trình bắt đầu ngay ở head (a = 0).'],
  ['I', 'Ý tưởng này còn xuất hiện ở đâu nữa?'],
  ['C', 'Ở mọi hàm áp lặp trên một tập hữu hạn — Happy Number, hay Find the Duplicate Number, nơi chỉ số i trỏ tới nums[i] và số trùng là điểm vào chu trình. Trong hệ thống thật là chuỗi parentId: kiểm lúc ghi và đặt trần lúc đọc. <em>("Validate on write, cap the walk on read.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Checking <code>fast.next</code> before <code>fast</code> — crashes on even-length lists only.</li>
<li>Comparing values instead of nodes (<code>slow.val === fast.val</code>): repeated values look like a meeting.</li>
<li>Changing the starting positions (fast = head.next) and keeping the old phase 2 — infinite loop.</li>
<li>Using the second middle when you need to split (or the reverse): halves of the wrong size.</li>
<li>Find the Duplicate: starting phase 2 at index 0 in one version and at <code>nums[0]</code> in another — both pointers must be the same number of steps from the entry; pick one convention and apply it to both phases.</li>
<li>Forgetting the termination argument for implicit lists (Happy Number): say why the sequence must repeat.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Kiểm <code>fast.next</code> trước <code>fast</code> — chỉ sập trên danh sách độ dài chẵn.</li>
<li>So giá trị thay vì so nút (<code>slow.val === fast.val</code>): giá trị lặp trông như "gặp nhau".</li>
<li>Đổi điểm xuất phát (fast = head.next) mà giữ nguyên pha 2 cũ — lặp vô hạn.</li>
<li>Dùng điểm giữa thứ hai khi cần cắt đôi (hoặc ngược lại): hai nửa sai kích thước.</li>
<li>Find the Duplicate: một chỗ bắt đầu pha 2 ở chỉ số 0, chỗ khác ở <code>nums[0]</code> — hai con trỏ phải cách điểm vào cùng số bước; chọn một quy ước và áp cho cả hai pha.</li>
<li>Quên lập luận dừng cho danh sách ẩn (Happy Number): hãy nói vì sao dãy chắc chắn lặp lại.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>LC 234 có lời giải từng bước ở bài 2.4 (Bộ luyện 2). LC 143 cần thêm thao tác đảo danh sách — làm sau <a href="${baiNay('dsa-3-3-linked-list')}">bài 3.3 — Thao tác danh sách liên kết</a> nếu bạn chưa quen.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>From memory, write <code>detectCycle</code> (both phases). Test: no cycle, one node, a cycle that starts at the head, the 8-node "6" from this lesson.</li>
<li>On paper, for a = 3 and L = 4, compute where phase 1 meets and check that phase 2 takes exactly 3 steps.</li>
<li>Submit LC 141, LC 142, LC 876 and LC 287. For LC 287, write the "two arrows enter the duplicate" argument in one sentence.</li>
<li>Bonus: write the read-side guard for a <code>parentId</code> chain twice — once with a depth cap, once with Floyd — and say in one line when you would choose each.</li>
</ol>
<p><strong>Done when:</strong> four accepted submissions, the paper check for a = 3, L = 4 matches your code’s output, and one sentence each for the LC 287 argument and the cap-vs-Floyd choice.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fast and slow pointers</span><span class="v">Two pointers in the same direction at speeds 2 and 1.</span></div>
  <div class="kv"><span class="k">Floyd’s cycle detection (tortoise and hare)</span><span class="v">Meet ⇒ cycle; restart one at head, speed 1 both ⇒ entry.</span></div>
  <div class="kv"><span class="k">cycle entry</span><span class="v">The first node of the cycle; the node with two incoming arrows.</span></div>
  <div class="kv"><span class="k">a = kL − b</span><span class="v">Tail length = whole laps minus the entry-to-meeting distance; the proof of phase 2.</span></div>
  <div class="kv"><span class="k">implicit linked list</span><span class="v">x → f(x) on a finite set (Happy Number, i → nums[i]).</span></div>
  <div class="kv"><span class="k">first / second middle</span><span class="v">Which of the two middle nodes an even-length list yields, decided by the loop condition.</span></div>
  <div class="kv"><span class="k">depth cap</span><span class="v">A maximum number of steps for walking a chain whose data may be corrupted.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Speeds 1 and 2: fast hits null ⇒ no cycle; they meet ⇒ cycle, in O(n) time and O(1) memory.</li>
<li>Entry: restart one pointer at head, both speed 1 — because a = kL − b.</li>
<li>Middle: <code>fast &amp;&amp; fast.next</code> ⇒ second middle; <code>fast.next &amp;&amp; fast.next.next</code> ⇒ first middle.</li>
<li>Any repeated function on a finite set is a hidden list: Happy Number, Find the Duplicate Number.</li>
<li>Check <code>fast</code> before <code>fast.next</code>, compare nodes not values, and redo the proof if you change the start.</li>
<li>In real systems: parent chains — validate on write, cap on read, Floyd when you cannot cap.</li>
</ul>
${nguon('📘', 'cp-algorithms — Floyd’s Linked List Cycle Finding Algorithm', 'Both phases with the proof, and the link to Brent’s variant', 'https://cp-algorithms.com/others/tortoise_and_hare.html')}
${nguon('📖', 'Wikipedia — Cycle detection', 'Floyd, Brent, the "ρ" shape, and applications: PRNG periods, Pollard’s rho, hash collisions', 'https://en.wikipedia.org/wiki/Cycle_detection')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Từ trí nhớ, viết <code>detectCycle</code> (cả hai pha). Thử: không chu trình, một nút, chu trình bắt đầu ngay ở head, danh sách 8 nút hình "6" của bài.</li>
<li>Trên giấy, với a = 3 và L = 4, tính chỗ pha 1 gặp nhau và kiểm rằng pha 2 tốn đúng 3 bước.</li>
<li>Nộp LC 141, LC 142, LC 876 và LC 287. Với LC 287, viết lập luận "hai mũi tên cùng đi vào số trùng" trong một câu.</li>
<li>Thêm: viết chốt chặn lúc đọc cho chuỗi <code>parentId</code> hai lần — một lần bằng trần độ sâu, một lần bằng Floyd — và nói trong một dòng khi nào chọn cách nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn lượt nộp Accepted, phép kiểm trên giấy với a = 3, L = 4 khớp output code của bạn, và mỗi thứ một câu: lập luận LC 287 và lựa chọn trần độ sâu vs Floyd.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fast and slow pointers (con trỏ nhanh chậm)</span><span class="v">Hai con trỏ cùng chiều với tốc độ 2 và 1.</span></div>
  <div class="kv"><span class="k">Floyd’s cycle detection / tortoise and hare (rùa và thỏ)</span><span class="v">Gặp nhau ⇒ có chu trình; đưa một con về head, cả hai tốc độ 1 ⇒ điểm vào.</span></div>
  <div class="kv"><span class="k">cycle entry (điểm vào chu trình)</span><span class="v">Nút đầu tiên của chu trình; nút có hai mũi tên đi vào.</span></div>
  <div class="kv"><span class="k">a = kL − b</span><span class="v">Độ dài đuôi = số vòng trọn trừ khoảng từ điểm vào tới điểm gặp; chứng minh của pha 2.</span></div>
  <div class="kv"><span class="k">implicit linked list (danh sách liên kết ẩn)</span><span class="v">x → f(x) trên một tập hữu hạn (Happy Number, i → nums[i]).</span></div>
  <div class="kv"><span class="k">first / second middle (điểm giữa thứ nhất / thứ hai)</span><span class="v">Danh sách độ dài chẵn cho ra nút giữa nào, do điều kiện vòng lặp quyết định.</span></div>
  <div class="kv"><span class="k">depth cap (trần độ sâu)</span><span class="v">Số bước tối đa khi đi trên một chuỗi mà dữ liệu có thể đã hỏng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tốc độ 1 và 2: nhanh gặp null ⇒ không có chu trình; gặp nhau ⇒ có chu trình, O(n) thời gian, O(1) bộ nhớ.</li>
<li>Điểm vào: đưa một con trỏ về head, cả hai tốc độ 1 — vì a = kL − b.</li>
<li>Điểm giữa: <code>fast &amp;&amp; fast.next</code> ⇒ điểm giữa thứ hai; <code>fast.next &amp;&amp; fast.next.next</code> ⇒ điểm giữa thứ nhất.</li>
<li>Mọi hàm áp lặp trên tập hữu hạn là một danh sách ẩn: Happy Number, Find the Duplicate Number.</li>
<li>Kiểm <code>fast</code> trước <code>fast.next</code>, so nút chứ không so giá trị, và chứng minh lại nếu đổi điểm xuất phát.</li>
<li>Trong hệ thống thật: chuỗi trang cha — kiểm lúc ghi, đặt trần lúc đọc, dùng Floyd khi không đặt trần được.</li>
</ul>
${nguon('📘', 'cp-algorithms — Floyd’s Linked List Cycle Finding Algorithm', 'Hai pha kèm chứng minh, và liên hệ với biến thể của Brent (tiếng Anh)', 'https://cp-algorithms.com/others/tortoise_and_hare.html')}
${nguon('📖', 'Wikipedia — Cycle detection', 'Floyd, Brent, hình chữ "ρ", và ứng dụng: chu kỳ bộ sinh số ngẫu nhiên, Pollard’s rho, va chạm băm', 'https://en.wikipedia.org/wiki/Cycle_detection')}
</div>
`,
};
