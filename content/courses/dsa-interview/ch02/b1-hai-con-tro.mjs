/** 2.1 — Hai con trỏ. Mọi mã/output đọc từ ../ma/ch02 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { vetTwoSumII } from '../ma/ch02/two-sum-ii.vet.mjs';
import { vetContainer } from '../ma/ch02/container.vet.mjs';
import { vetTrap } from '../ma/ch02/trap.vet.mjs';
import { vetRemoveDup } from '../ma/ch02/remove-dup.vet.mjs';

/* Bảng vết 1 — Two Sum II, nums = [1,3,4,6,8,11,14], target = 10. */
const NUMS = [1, 3, 4, 6, 8, 11, 14];
const BANG_TS = bangVet(['step', 'nums', 'l', 'r', 'nums[l] + nums[r]', 'move'],
  vetTwoSumII(NUMS, 10).map((h, k) => [
    String(k + 1),
    oMang(NUMS, { to: h.viec === 'found' ? { [h.l]: 'ok', [h.r]: 'ok' } : { [h.l]: 'l', [h.r]: 'r' }, nhan: { [h.l]: 'L', [h.r]: 'R' }, tu: h.l, den: h.r }),
    String(h.l), String(h.r),
    `${NUMS[h.l]} + ${NUMS[h.r]} = ${h.sum}`,
    h.viec === 'found' ? `✅ [${h.l + 1}, ${h.r + 1}]` : h.viec === 'l++' ? `${h.sum} &lt; 10 ⇒ l++` : `${h.sum} &gt; 10 ⇒ r--`,
  ]));

/* Bảng vết 2 — Container With Most Water. */
const H = [1, 8, 6, 2, 5, 4, 8, 3, 7];
const BANG_CW = bangVet(['step', 'height', 'l', 'r', 'min(h) × width', 'best', 'move'],
  vetContainer(H).map((h, k) => [
    String(k + 1),
    oMang(H, { to: { [h.l]: 'l', [h.r]: 'r' }, nhan: { [h.l]: 'L', [h.r]: 'R' }, tu: h.l, den: h.r }),
    String(h.l), String(h.r),
    `${Math.min(H[h.l], H[h.r])} × ${h.r - h.l} = ${h.area}`,
    h.moi ? `<strong>${h.best}</strong>` : String(h.best),
    h.viec === 'l++' ? `h[l]=${H[h.l]} &lt; h[r]=${H[h.r]} ⇒ l++` : `h[r]=${H[h.r]} ≤ h[l]=${H[h.l]} ⇒ r--`,
  ]));

/* Bảng vết 3 — Trapping Rain Water, [4,2,0,3,2,5]. */
const TR = [4, 2, 0, 3, 2, 5];
const BANG_TR = bangVet(['step', 'height', 'side', 'level (max so far)', 'water added', 'total'],
  vetTrap(TR).map((h, k) => [
    String(k + 1),
    oMang(TR, { to: { [h.i]: h.ben === 'L' ? 'l' : 'r' }, tu: h.l, den: h.r, nhan: { [h.l]: 'L', [h.r]: 'R' } }),
    h.ben === 'L' ? `h[l]=${TR[h.l]} &lt; h[r]=${TR[h.r]} ⇒ left, i=${h.i}` : `right, i=${h.i}`,
    String(h.muc),
    `${h.muc} − ${TR[h.i]} = ${h.them}`,
    String(h.water),
  ]));

/* Bảng vết 4 — Remove Duplicates (đọc r / ghi w), [1,1,2,2,2,3,4,4]. */
const RD = [1, 1, 2, 2, 2, 3, 4, 4];
const vetRd = vetRemoveDup(RD);
const BANG_RD = bangVet(['r', 'nums[r]', 'compare with nums[w−1]', 'array after the step', 'w'],
  vetRd.hang.map((h) => [
    String(h.r), String(h.x),
    h.moi ? `${h.x} ≠ ${h.mang[h.wTruoc - 1]} ⇒ write at ${h.wTruoc}` : `${h.x} = ${h.mang[h.wTruoc - 1]} ⇒ skip`,
    oMang(h.mang, { to: { ...Object.fromEntries(Array.from({ length: h.w }, (_, i) => [i, 'cs'])), [h.r]: 'r', ...(h.moi ? { [h.wTruoc]: 'ok' } : {}) }, nhan: { [h.r]: 'r' } }),
    String(h.w),
  ]));

const DE = [
  [lc(344, 'reverse-string', 'Reverse String', 'Easy'), 'Warm-up: swap the two ends and walk inward — the skeleton of every converging-pointer problem.', 'Khởi động: đổi chỗ hai đầu rồi đi vào giữa — bộ xương của mọi bài hai con trỏ đối đầu.'],
  [lc(125, 'valid-palindrome', 'Valid Palindrome', 'Easy'), 'Compare the two ends, skip what does not count; the inner loops also need l &lt; r.', 'So hai đầu, bỏ qua thứ không tính; vòng lặp bên trong cũng phải có l &lt; r.'],
  [lc(26, 'remove-duplicates-from-sorted-array', 'Remove Duplicates from Sorted Array', 'Easy'), 'Sorted ⇒ duplicates are neighbours. Read pointer scans, write pointer keeps.', 'Đã sắp xếp ⇒ phần tử trùng nằm cạnh nhau. Con trỏ đọc quét, con trỏ ghi giữ lại.'],
  [lc(283, 'move-zeroes', 'Move Zeroes', 'Easy'), 'In place and order-preserving ⇒ read/write pointers with a swap.', 'Tại chỗ và giữ thứ tự ⇒ con trỏ đọc/ghi kèm đổi chỗ.'],
  [lc(88, 'merge-sorted-array', 'Merge Sorted Array', 'Easy'), 'The free space is at the END ⇒ fill from the back so nothing gets overwritten.', 'Chỗ trống nằm ở CUỐI ⇒ điền từ sau ra trước để không ghi đè gì.'],
  [lc(167, 'two-sum-ii-input-array-is-sorted', 'Two Sum II - Input Array Is Sorted', 'Medium'), 'Sorted + pair with a sum + O(1) memory ⇒ the textbook converging pointers.', 'Đã sắp xếp + cặp có tổng + bộ nhớ O(1) ⇒ hai con trỏ đối đầu mẫu mực.'],
  [lc(15, '3sum', '3Sum', 'Medium'), 'Fix one number, Two Sum II on the rest; dedup at all three positions.', 'Cố định một số, chạy Two Sum II trên phần còn lại; khử trùng ở cả ba vị trí.'],
  [lc(11, 'container-with-most-water', 'Container With Most Water', 'Medium'), 'Start widest, always move the shorter wall — be ready to prove why.', 'Bắt đầu rộng nhất, luôn dời bức tường thấp hơn — chuẩn bị chứng minh vì sao.'],
  [lc(18, '4sum', '4Sum', 'Medium'), '3Sum with one more fixed loop; watch for overflow in Java (use long).', '3Sum thêm một vòng cố định; cẩn thận tràn số trong Java (dùng long).'],
  [lc(42, 'trapping-rain-water', 'Trapping Rain Water', 'Hard'), 'Water at i = min(max left, max right) − h[i]; the lower side is the one you can settle.', 'Nước tại i = min(max trái, max phải) − h[i]; bên thấp hơn là bên chốt được ngay.'],
];

export default {
  title: '2.1 — Two pointers: one pass instead of two nested loops|||2.1 — Hai con trỏ: một lượt thay cho hai vòng lồng',
  slug: 'dsa-2-1-hai-con-tro',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Hai con trỏ đối đầu (Two Sum II, 3Sum khử trùng, Container, Palindrome, Trapping Rain Water) và cùng chiều (xoá trùng, dồn số 0, trộn mảng đã sắp) — kèm chứng minh vì sao được dời con trỏ, bảng vết, mô phỏng và số đo O(n²) vs O(n log n) vs O(n).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Two pointers: one pass instead of two nested loops</h2>
<p class="lead">Chapter 1 replaced a searching loop with a hash map that <em>remembers</em>. This chapter replaces it with something cheaper still: two indices that <strong>only ever move forward</strong>, where every step throws away at least one candidate for good. The result is O(n) time and O(1) extra memory — the answer interviewers hope for when they add "the array is sorted" or "do it in place" to a problem. The pattern is short to code, but people fail it because they cannot say <em>why</em> it is allowed to skip pairs. This lesson gives you the code and, more importantly, the one-sentence proof for each problem.</p>

<h3>The everyday picture</h3>
<p>You have a 500k voucher and a shop list sorted by price, cheapest first. You want exactly two items that use the voucher completely. Put your left finger on the cheapest item and your right finger on the most expensive. If the two together cost more than 500k, the expensive item cannot work with <em>anything</em> left on the list — even the cheapest one is too much — so you move the right finger down. If they cost less, the cheap item is hopeless even with the most expensive partner, so you move the left finger up. Each glance removes one item from consideration forever, so you finish after at most one pass over the list.</p>
<p>A second picture, for the other family: the class monitor copies a sorted attendance list into a clean sheet, writing each name only once. One eye <em>reads</em> the old list line by line; the pen <em>writes</em> only when the name differs from the last one written. The reader always moves; the writer moves only sometimes. That is the read/write pointer pair.</p>
<p>Formally, <strong>two pointers</strong> means two indices into the same sequence (or two sequences) that move <strong>monotonically</strong> — never backwards — according to a rule that discards impossible candidates. Because each pointer moves at most n times, the whole loop is O(n). There are two families:</p>
<ul>
<li><strong>Converging (opposite ends)</strong>: <code>l = 0</code>, <code>r = n − 1</code>, move toward each other. Needs a <em>monotonic</em> structure — usually a sorted array, or a symmetric property such as a palindrome.</li>
<li><strong>Same direction (read/write, or slow/fast)</strong>: both start on the left; one scans, the other marks a boundary. Used for in-place filtering, merging, and — in lesson 2.3 — cycle detection.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Hai con trỏ: một lượt thay cho hai vòng lồng</h2>
<p class="lead">Chương 1 thay một vòng lặp đi TÌM bằng một hash map biết NHỚ. Chương này thay nó bằng một thứ còn rẻ hơn: hai chỉ số <strong>chỉ đi tới, không bao giờ lùi</strong>, mà mỗi bước đi loại hẳn ít nhất một ứng viên. Kết quả là O(n) thời gian và O(1) bộ nhớ phụ — đúng câu trả lời người phỏng vấn chờ khi họ thêm "mảng đã được sắp xếp" hay "làm tại chỗ (in place)" vào đề. Mẫu này code rất ngắn, nhưng người ta hay trượt vì không nói được <em>vì sao</em> được phép bỏ qua các cặp. Bài này đưa bạn mã nguồn và — quan trọng hơn — câu chứng minh một dòng cho từng đề.</p>

<h3>Hình dung đời thường</h3>
<p>Bạn có voucher 500k và danh sách hàng đã "sắp xếp theo giá tăng dần" trên Shopee. Bạn muốn mua đúng hai món tiêu vừa hết voucher. Đặt ngón tay trái lên món rẻ nhất, ngón tay phải lên món đắt nhất. Nếu hai món cộng lại quá 500k thì món đắt kia không ghép được với <em>bất kỳ</em> món nào còn lại — ghép với món rẻ nhất còn vượt — nên bạn dời ngón phải xuống. Nếu cộng lại còn thiếu thì món rẻ kia vô vọng kể cả khi ghép với món đắt nhất, nên bạn dời ngón trái lên. Mỗi lần liếc mắt loại vĩnh viễn một món, nên bạn xong sau tối đa một lượt nhìn danh sách.</p>
<p>Hình dung thứ hai, cho họ còn lại: lớp trưởng chép danh sách điểm danh (đã xếp theo tên) sang tờ giấy sạch, mỗi tên chỉ viết một lần. Một mắt <em>đọc</em> danh sách cũ từng dòng; cây bút chỉ <em>viết</em> khi tên khác tên vừa viết. Mắt đọc luôn đi; cây bút thỉnh thoảng mới đi. Đó là cặp con trỏ đọc/ghi.</p>
<p>Nói cho chuẩn: <strong>two pointers</strong> (hai con trỏ) là hai chỉ số trên cùng một dãy (hoặc hai dãy) di chuyển <strong>đơn điệu (monotonic)</strong> — không bao giờ lùi — theo một quy tắc loại bỏ các ứng viên không thể là đáp án. Vì mỗi con trỏ đi tối đa n bước, cả vòng lặp là O(n). Có hai họ:</p>
<ul>
<li><strong>Đối đầu (converging, từ hai đầu)</strong>: <code>l = 0</code>, <code>r = n − 1</code>, đi về phía nhau. Cần một cấu trúc <em>đơn điệu</em> — thường là mảng đã sắp xếp, hoặc tính đối xứng như chuỗi đối xứng (palindrome).</li>
<li><strong>Cùng chiều (same direction: đọc/ghi, hoặc chậm/nhanh)</strong>: cả hai xuất phát bên trái; một con quét, con kia đánh dấu một ranh giới. Dùng để lọc tại chỗ, trộn hai dãy, và — ở bài 2.3 — phát hiện chu trình.</li>
</ul>
${csd('csd201-slide-cs2-1', 'vi', '⭐ CS.2 — Kỹ thuật mảng (1): hai con trỏ, cửa sổ', '<p>Deck ⭐ Chuyên sâu 2 của CSD201 đã giới thiệu hai con trỏ hội tụ (two-sum trên mảng đã sắp, container, 3-sum loại trùng) và con trỏ nhanh/chậm bằng Java có test PASS/FAIL. Ôn nhanh một câu: hai chỉ số đi về phía nhau, mỗi bước loại một đầu. <strong>Ở đây đi sâu thêm:</strong> câu chứng minh "vì sao được bỏ qua" cho từng đề (thứ người phỏng vấn hỏi tiếp), bản TypeScript song song, số đo thật ba mức O(n²)/O(n log n)/O(n), và cách nói to lời giải bằng tiếng Anh.</p>')}
</div>

<div class="ml-en">
<h3>The converging template in four moves</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Put the pointers at the extremes</span><span class="lz-d"><code>l = 0</code>, <code>r = n − 1</code>: the widest range, the smallest and the largest value.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Evaluate the pair</span><span class="lz-d">A sum, an area, a character comparison — one O(1) computation.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Discard one end with a reason</span><span class="lz-d">"<code>nums[l]</code> is too small for every partner still in range" ⇒ <code>l++</code>. No reason, no move.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Stop when they meet</span><span class="lz-d"><code>while (l &lt; r)</code>: at most n − 1 moves, so O(n) time and O(1) memory.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Khuôn đối đầu trong bốn nước đi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đặt hai con trỏ ở hai cực</span><span class="lz-d"><code>l = 0</code>, <code>r = n − 1</code>: khoảng rộng nhất, giá trị nhỏ nhất và lớn nhất.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đánh giá cặp hiện tại</span><span class="lz-d">Một tổng, một diện tích, một phép so ký tự — một phép tính O(1).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Loại một đầu, CÓ lý do</span><span class="lz-d">"<code>nums[l]</code> quá nhỏ với mọi bạn ghép còn trong khoảng" ⇒ <code>l++</code>. Không nói được lý do thì không được dời.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dừng khi gặp nhau</span><span class="lz-d"><code>while (l &lt; r)</code>: tối đa n − 1 lần dời, nên O(n) thời gian và O(1) bộ nhớ.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Signals: when to reach for two pointers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"sorted array" + "pair / triple with a sum"</span><span class="v">The sort order tells you which way to move. Two Sum II, 3Sum, 4Sum, "pairs with difference k".</span></div>
  <div class="kv"><span class="k">"in place", "O(1) extra space"</span><span class="v">A hash map is ruled out; a write pointer inside the same array is the usual answer (remove duplicates, move zeroes, partition).</span></div>
  <div class="kv"><span class="k">"compare from both ends"</span><span class="v">Palindromes, reversing, "valid after deleting one character".</span></div>
  <div class="kv"><span class="k">a quantity limited by the smaller of two sides</span><span class="v">Container with most water, trapping rain water: the shorter side decides, so it is the one you can settle and move.</span></div>
  <div class="kv"><span class="k">two sorted inputs</span><span class="v">Merge, intersect, "is s a subsequence of t" — one pointer per input, advance the smaller.</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ (or 10⁶) with a nested-loop idea</span><span class="v">You need O(n) or O(n log n). "Sort once (n log n), then two pointers (n)" is a classic way to get there.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm hai con trỏ lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"mảng đã sắp xếp" + "cặp / bộ ba có tổng"</span><span class="v">Thứ tự sắp xếp chỉ cho bạn nên dời về phía nào. Two Sum II, 3Sum, 4Sum, "các cặp có hiệu bằng k".</span></div>
  <div class="kv"><span class="k">"in place" (tại chỗ), "O(1) bộ nhớ phụ"</span><span class="v">Hash map bị loại; một con trỏ ghi ngay trong mảng là câu trả lời quen thuộc (xoá trùng, dồn số 0, phân hoạch).</span></div>
  <div class="kv"><span class="k">"so từ hai đầu"</span><span class="v">Chuỗi đối xứng, đảo chuỗi, "đối xứng sau khi xoá tối đa một ký tự".</span></div>
  <div class="kv"><span class="k">một đại lượng bị chặn bởi bên NHỎ hơn trong hai bên</span><span class="v">Bể chứa nhiều nước nhất, hứng nước mưa: bên thấp hơn quyết định, nên đó là bên chốt được và dời đi.</span></div>
  <div class="kv"><span class="k">hai đầu vào đã sắp xếp</span><span class="v">Trộn, giao, "s có phải dãy con của t" — mỗi đầu vào một con trỏ, dời con đang trỏ vào giá trị nhỏ hơn.</span></div>
  <div class="kv"><span class="k">n ≤ 10⁵ (hoặc 10⁶) mà ý tưởng là hai vòng lồng</span><span class="v">Bạn cần O(n) hoặc O(n log n). "Sắp xếp một lần (n log n) rồi hai con trỏ (n)" là đường kinh điển để tới đó.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Worked example: Two Sum II — three answers, three complexities</h3>
<p><strong>Problem (in our words).</strong> <code>nums</code> is sorted in non-decreasing order. Return the <strong>1-based</strong> positions of the two different elements that add up to <code>target</code> (exactly one answer exists), using only O(1) extra memory. Example: <code>nums = [1, 3, 4, 6, 8, 11, 14]</code>, <code>target = 10</code> → <code>[3, 4]</code> (4 + 6).</p>
<p><strong>Answer 1 — brute force.</strong> Every pair i &lt; j: O(n²) time, O(1) memory. Correct, and you should say it first.</p>
<p><strong>Answer 2 — Chapter 1 thinking.</strong> A hash map gives O(n) time — but O(n) memory, which the problem forbids. A middle road that respects the memory limit: for each i, <em>binary search</em> <code>target − nums[i]</code> to the right of i. O(n log n) time, O(1) memory. This is a perfectly good second answer.</p>
<p><strong>Answer 3 — use the order fully.</strong> Binary search uses the sorting <em>once per element</em>. Two pointers use it <em>across</em> elements. Look at the pair (l, r) = (smallest, largest):</p>
<ul>
<li>If <code>nums[l] + nums[r] &gt; target</code>: the smallest available partner is already too big for <code>nums[r]</code>, so <code>nums[r]</code> belongs to <strong>no</strong> valid pair. Drop it: <code>r--</code>.</li>
<li>If <code>nums[l] + nums[r] &lt; target</code>: the largest available partner is still too small for <code>nums[l]</code>, so drop <code>nums[l]</code>: <code>l++</code>.</li>
</ul>
<p>Either way the search range shrinks by one and we have <em>proved</em> the discarded element is useless. The real pair is never discarded, so we must meet it. That argument — "the dropped element cannot be part of any answer" — is the whole proof, and it is what the interviewer wants to hear.</p>
</div>
<div class="ml-vi">
<h3>Giải mẫu: Two Sum II — ba lời giải, ba độ phức tạp</h3>
<p><strong>Đề (diễn đạt lại).</strong> <code>nums</code> đã sắp xếp không giảm. Trả về vị trí <strong>đánh số từ 1</strong> của hai phần tử khác nhau có tổng bằng <code>target</code> (đề đảm bảo có đúng một đáp án), chỉ được dùng O(1) bộ nhớ phụ. Ví dụ: <code>nums = [1, 3, 4, 6, 8, 11, 14]</code>, <code>target = 10</code> → <code>[3, 4]</code> (4 + 6).</p>
<p><strong>Lời giải 1 — vét cạn (brute force).</strong> Mọi cặp i &lt; j: O(n²) thời gian, O(1) bộ nhớ. Đúng, và bạn nên nói nó ra trước.</p>
<p><strong>Lời giải 2 — tư duy Chương 1.</strong> Hash map cho O(n) thời gian — nhưng tốn O(n) bộ nhớ, đề cấm. Một đường giữa vẫn tôn trọng giới hạn bộ nhớ: với mỗi i, <em>tìm kiếm nhị phân</em> <code>target − nums[i]</code> ở bên phải i. O(n log n) thời gian, O(1) bộ nhớ. Đây là câu trả lời thứ hai hoàn toàn ổn.</p>
<p><strong>Lời giải 3 — dùng hết thứ tự.</strong> Tìm nhị phân dùng tính sắp xếp <em>riêng cho từng phần tử</em>. Hai con trỏ dùng nó <em>xuyên qua</em> các phần tử. Nhìn cặp (l, r) = (nhỏ nhất, lớn nhất):</p>
<ul>
<li>Nếu <code>nums[l] + nums[r] &gt; target</code>: người bạn ghép nhỏ nhất còn lại đã quá lớn so với <code>nums[r]</code>, nên <code>nums[r]</code> không thuộc <strong>bất kỳ</strong> cặp hợp lệ nào. Bỏ nó: <code>r--</code>.</li>
<li>Nếu <code>nums[l] + nums[r] &lt; target</code>: người bạn ghép lớn nhất còn lại vẫn quá nhỏ so với <code>nums[l]</code>, nên bỏ <code>nums[l]</code>: <code>l++</code>.</li>
</ul>
<p>Cách nào thì khoảng tìm kiếm cũng co lại một phần tử, và ta đã <em>chứng minh</em> phần tử bị bỏ là vô dụng. Cặp đáp án không bao giờ bị bỏ, nên chắc chắn sẽ gặp nó. Lập luận đó — "phần tử bị loại không thể nằm trong đáp án nào" — là toàn bộ chứng minh, và đó là câu người phỏng vấn muốn nghe.</p>
</div>

${maHai('ch02/two-sum-ii.ts', 'ch02/TwoSumII.java', { vung: 'two' })}
${ma('ch02/two-sum-ii.ts', { vung: 'binary', nhan: 'TypeScript — answer 2: binary search, O(n log n)' })}
${ketQua('ch02/two-sum-ii.ts')}
${ketQua('ch02/TwoSumII.java')}

<div class="ml-en">
<p>Line by line: <code>while (l &lt; r)</code> uses a strict <code>&lt;</code> because the two indices must be <em>different</em> elements — with <code>&lt;=</code>, the array <code>[5]</code> with target 10 would pair 5 with itself. The <code>+ 1</code> on return is only there because this problem numbers positions from 1; forgetting it is the most common wrong answer on LeetCode 167. The last test case (<code>target = 100</code>) shows what happens without a valid pair: the pointers meet and we return an empty array instead of crashing. In Java, use <code>&gt;&gt;&gt; 1</code> (or <code>lo + (hi − lo) / 2</code>) in the binary-search version: <code>lo + hi</code> can overflow an <code>int</code> when the array is huge — Chapter 4 returns to that.</p>
</div>
<div class="ml-vi">
<p>Từng dòng: <code>while (l &lt; r)</code> dùng <code>&lt;</code> chặt vì hai chỉ số phải là hai phần tử <em>khác nhau</em> — với <code>&lt;=</code>, mảng <code>[5]</code> và target 10 sẽ ghép 5 với chính nó. <code>+ 1</code> khi trả về chỉ vì đề này đánh số từ 1; quên nó là đáp án sai phổ biến nhất ở LeetCode 167. Ca test cuối (<code>target = 100</code>) cho thấy điều xảy ra khi không có cặp nào: hai con trỏ gặp nhau và ta trả mảng rỗng thay vì văng lỗi. Trong Java, bản tìm nhị phân dùng <code>&gt;&gt;&gt; 1</code> (hoặc <code>lo + (hi − lo) / 2</code>): <code>lo + hi</code> có thể tràn <code>int</code> khi mảng rất lớn — Chương 4 sẽ quay lại chuyện này.</p>
</div>

<div class="ml-en">
<h3>Watch it run: the pointers after every step</h3>
<p>Input <code>[1, 3, 4, 6, 8, 11, 14]</code>, <code>target = 10</code>. Blue = <code>l</code>, orange = <code>r</code>, green background = the range still alive, bright green = the answer. The table was produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nó chạy: hai con trỏ sau từng bước</h3>
<p>Đầu vào <code>[1, 3, 4, 6, 8, 11, 14]</code>, <code>target = 10</code>. Xanh dương = <code>l</code>, cam = <code>r</code>, nền xanh nhạt = khoảng còn sống, xanh lá đậm = đáp án. Bảng sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_TS}
<div class="ml-en">
<p>Six checks instead of 21 pairs. Read the "move" column as a sequence of mini-proofs: step 1 throws out 14 (too big even with 1), step 2 throws out 11, step 3 throws out 1 (1 + 8 = 9 is too small and 8 is now the biggest partner left), and so on. Notice that both pointers move — neither one "owns" the search.</p>
${moPhong('ch02/two-sum-ii.sim.js', 'en', 'Two Sum II with two pointers — step by step', 'Same array and target: watch each step discard one end and read why in the log. Change the data and run again.')}
</div>
<div class="ml-vi">
<p>Sáu lần kiểm thay vì 21 cặp. Đọc cột "move" như một chuỗi chứng minh nhỏ: bước 1 loại 14 (ghép với 1 còn quá lớn), bước 2 loại 11, bước 3 loại 1 (1 + 8 = 9 còn thiếu mà 8 giờ đã là bạn ghép lớn nhất còn lại), cứ thế. Để ý cả hai con trỏ đều đi — không con nào "độc quyền" cuộc tìm kiếm.</p>
${moPhong('ch02/two-sum-ii.sim.js', 'vi', 'Two Sum II bằng hai con trỏ — chạy từng bước', 'Cùng mảng và target: xem mỗi bước loại một đầu và đọc lý do trong log. Đổi dữ liệu rồi chạy lại.')}
</div>

<div class="ml-en">
<h3>The three answers, measured</h3>
<p>Worst case for all three (nums = 0 … n−1, the only pair is the last two numbers), Apple M1 Max, best of several runs:</p>
</div>
<div class="ml-vi">
<h3>Ba lời giải, đo bằng số</h3>
<p>Trường hợp xấu nhất cho cả ba (nums = 0 … n−1, cặp duy nhất là hai số cuối), Apple M1 Max, lấy lần nhanh nhất trong vài lượt:</p>
</div>
${ma('ch02/hai-con-tro-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch02/hai-con-tro-do.ts')}
${ketQua('ch02/HaiConTroDo.java')}
<div class="ml-en">
<p>Read the growth, not the absolute numbers. From 10⁴ to 10⁵ (10× more input) the brute force went from 27.8 ms to 3,457.6 ms in Node — about <strong>124×</strong>, the n² curve (a single run of a few seconds easily varies by ±20 %, so 100× and 124× tell the same story). Binary search went from 1.55 ms to 23.46 ms between 10⁵ and 10⁶ — about 15×, which is "10× for n, a bit more for log n". Two pointers went from 0.10 ms to 0.95 ms: almost exactly 10×, the straight line O(n) promises. At n = 10⁶ two pointers finish in under a millisecond while the brute force would need several minutes. Java's absolute numbers differ (the JIT makes the brute force about 3× faster), but the three shapes are the same — and at small n (10³) all three are below a millisecond, which is why you can never judge an algorithm by trying it on the examples.</p>
</div>
<div class="ml-vi">
<p>Đọc tốc độ tăng, đừng đọc con số tuyệt đối. Từ 10⁴ lên 10⁵ (đầu vào gấp 10), vét cạn tăng từ 27,8 ms lên 3.457,6 ms trên Node — khoảng <strong>124 lần</strong>, đúng đường cong n² (một lần chạy vài giây dễ lệch ±20 %, nên 100 lần hay 124 lần đều kể cùng một câu chuyện). Tìm nhị phân tăng từ 1,55 ms lên 23,46 ms giữa 10⁵ và 10⁶ — khoảng 15 lần, tức "10 lần cho n, thêm một chút cho log n". Hai con trỏ tăng từ 0,10 ms lên 0,95 ms: gần đúng 10 lần, đường thẳng mà O(n) hứa. Ở n = 10⁶, hai con trỏ xong dưới một mili-giây trong khi vét cạn sẽ cần vài phút. Số tuyệt đối của Java khác (JIT làm vét cạn nhanh hơn khoảng 3 lần), nhưng ba hình dạng y hệt — và ở n nhỏ (10³) cả ba đều dưới một mili-giây, nên đừng bao giờ đánh giá thuật toán bằng cách chạy thử trên ví dụ của đề. Xem lại bảng giới hạn n ↔ độ phức tạp ở <a href="${baiNay('dsa-0-1-big-o')}">bài 0.1 — Big-O</a>.</p>
</div>

<div class="ml-en">
<h3>Pattern 2 — 3Sum: reduce to a problem you already solved</h3>
<p><strong>Problem.</strong> Return all <em>distinct</em> triples <code>[a, b, c]</code> from <code>nums</code> (different positions) with <code>a + b + c = 0</code>. Example: <code>[-1, 0, 1, 2, -1, -4]</code> → <code>[[-1, -1, 2], [-1, 0, 1]]</code>.</p>
<p>Brute force is three loops, O(n³). The move that interviewers wait for: <strong>sort, fix the first number <code>a[i]</code>, and run Two Sum II on the rest with target <code>−a[i]</code></strong>. That is n iterations × O(n) each = O(n²), and sorting costs only O(n log n). The hard part is not the sum — it is the word <em>distinct</em>. After sorting, equal values sit next to each other, so duplicates can be skipped at three places: the fixed number (<code>a[i] === a[i−1]</code> ⇒ continue) and both pointers after a hit. An early <code>break</code> when <code>a[i] &gt; 0</code> is a free bonus: three numbers that are all positive cannot sum to zero.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 2 — 3Sum: quy về bài đã giải</h3>
<p><strong>Đề.</strong> Trả về mọi bộ ba <em>khác nhau</em> <code>[a, b, c]</code> lấy từ <code>nums</code> (ở các vị trí khác nhau) có <code>a + b + c = 0</code>. Ví dụ: <code>[-1, 0, 1, 2, -1, -4]</code> → <code>[[-1, -1, 2], [-1, 0, 1]]</code>.</p>
<p>Vét cạn là ba vòng lặp, O(n³). Nước đi người phỏng vấn chờ: <strong>sắp xếp, cố định số đầu <code>a[i]</code>, rồi chạy Two Sum II trên phần còn lại với target <code>−a[i]</code></strong>. Tức n vòng × O(n) mỗi vòng = O(n²), còn sắp xếp chỉ tốn O(n log n). Phần khó không phải là tổng — mà là chữ <em>khác nhau</em>. Sau khi sắp xếp, các giá trị bằng nhau nằm cạnh nhau, nên bỏ trùng được ở ba chỗ: số cố định (<code>a[i] === a[i−1]</code> ⇒ bỏ qua) và cả hai con trỏ sau mỗi lần trúng. Thêm một cú <code>break</code> sớm khi <code>a[i] &gt; 0</code> là quà miễn phí: ba số đều dương thì không thể cộng ra 0.</p>
</div>
${maHai('ch02/three-sum.ts', 'ch02/ThreeSum.java', { vung: 'dung' })}
${ketQua('ch02/three-sum.ts')}
${ketQua('ch02/ThreeSum.java')}
<div class="ml-en">
<p>The "without dedup" lines come from the same algorithm with the three skip lines deleted (region <code>sai</code> in the same files). On <code>[-1, 0, 1, 2, -1, -4]</code> it reports <code>[-1, 0, 1]</code> twice, because there are two −1s that can play the role of <code>a</code>. On <code>[-2, 0, 0, 2, 2]</code> it reports <code>[-2, 0, 2]</code> twice for the same reason on the pointer side. A LeetCode judge marks that "Wrong Answer", and the bug is invisible on inputs without repeated values — exactly the inputs people test by hand.</p>
<p>Why not just put the triples in a <code>Set</code>? You can (as strings, since arrays compare by reference in TS), and it works — but it costs extra memory, and the interviewer will ask you to remove it. Skipping duplicates in the sorted array is the expected answer.</p>
</div>
<div class="ml-vi">
<p>Các dòng "without dedup" lấy từ đúng thuật toán đó nhưng xoá ba dòng bỏ trùng (vùng <code>sai</code> trong cùng tệp). Với <code>[-1, 0, 1, 2, -1, -4]</code> nó báo <code>[-1, 0, 1]</code> hai lần, vì có hai số −1 cùng đóng được vai <code>a</code>. Với <code>[-2, 0, 0, 2, 2]</code> nó báo <code>[-2, 0, 2]</code> hai lần vì cùng lý do nhưng ở phía hai con trỏ. Máy chấm LeetCode cho "Wrong Answer", và lỗi này vô hình trên các đầu vào không có giá trị lặp — đúng loại đầu vào người ta hay thử bằng tay.</p>
<p>Sao không bỏ hết bộ ba vào một <code>Set</code>? Được (đổi thành chuỗi, vì mảng trong TS so theo tham chiếu), và chạy đúng — nhưng tốn thêm bộ nhớ, và người phỏng vấn sẽ bảo bạn bỏ nó đi. Bỏ trùng ngay trên mảng đã sắp xếp mới là đáp án mong đợi.</p>
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>JavaScript/TypeScript: <code>sort()</code> without a comparator sorts numbers as strings.</strong></p><p>Every converging-pointer solution starts by sorting. In JS the default comparison converts elements to strings, so −4 lands after −1 and 10 before 2. Two pointers on that array silently miss a pair that exists:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>JavaScript/TypeScript: <code>sort()</code> không có hàm so sánh sẽ sắp số như sắp CHUỖI.</strong></p><p>Mọi lời giải hai con trỏ đối đầu đều bắt đầu bằng sắp xếp. Trong JS, phép so mặc định đổi phần tử thành chuỗi, nên −4 đứng sau −1 và 10 đứng trước 2. Hai con trỏ chạy trên mảng đó lặng lẽ bỏ sót một cặp có thật:</p></div>
</div>
${ma('ch02/bay-sort.ts', { nhan: 'TypeScript — trap' })}
${ketQua('ch02/bay-sort.ts')}
<div class="ml-en">
<p>No error, no warning — just <code>[]</code> instead of <code>[-4, 1]</code>. Java's <code>Arrays.sort(int[])</code> is numeric, so this trap is JS-only; always write <code>(x, y) =&gt; x - y</code>, and say it out loud in the interview ("numeric comparator, because the default sorts strings") — it signals you have been bitten before.</p>
</div>
<div class="ml-vi">
<p>Không lỗi, không cảnh báo — chỉ có <code>[]</code> thay cho <code>[-4, 1]</code>. <code>Arrays.sort(int[])</code> của Java so theo số nên bẫy này chỉ có ở JS; luôn viết <code>(x, y) =&gt; x - y</code>, và nói to khi phỏng vấn ("hàm so sánh số, vì mặc định nó sắp theo chuỗi") — câu đó cho thấy bạn từng dính và nhớ.</p>
</div>

<div class="ml-en">
<h3>Pattern 3 — Container With Most Water: move the shorter wall, and prove it</h3>
<p><strong>Problem.</strong> <code>height[i]</code> is a vertical wall at x = i. Pick two walls; together with the x-axis they hold water of area <code>min(height[l], height[r]) × (r − l)</code>. Return the maximum area. Example: <code>[1, 8, 6, 2, 5, 4, 8, 3, 7]</code> → 49 (walls 8 and 7, width 7).</p>
<p>This array is <em>not</em> sorted, so the Two Sum argument does not apply directly. Start with the widest container (l = 0, r = n−1). Suppose <code>height[l] &lt; height[r]</code>. Every other container that uses wall l has a <strong>smaller width</strong> (r moves inward) and a height of at most <code>height[l]</code> (the short wall still limits it). So none of them can beat the area we just computed. Wall l has given its best; discard it with <code>l++</code>. The symmetric argument discards r when it is the shorter one. That one paragraph is the answer to "why is it safe to skip pairs?" — learn to say it in two sentences.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 3 — Container With Most Water: dời bức tường thấp hơn, và chứng minh</h3>
<p><strong>Đề.</strong> <code>height[i]</code> là một bức tường đứng tại x = i. Chọn hai bức tường; cùng trục hoành chúng chứa được lượng nước có diện tích <code>min(height[l], height[r]) × (r − l)</code>. Trả về diện tích lớn nhất. Ví dụ: <code>[1, 8, 6, 2, 5, 4, 8, 3, 7]</code> → 49 (tường 8 và 7, rộng 7).</p>
<p>Mảng này <em>không</em> sắp xếp, nên lập luận Two Sum không áp thẳng được. Bắt đầu từ bể rộng nhất (l = 0, r = n−1). Giả sử <code>height[l] &lt; height[r]</code>. Mọi bể khác có dùng tường l đều <strong>hẹp hơn</strong> (r đi vào trong) và cao tối đa <code>height[l]</code> (tường thấp vẫn chặn). Vậy không bể nào trong số đó hơn được diện tích vừa tính. Tường l đã cho hết khả năng của nó; loại nó bằng <code>l++</code>. Lập luận đối xứng loại r khi r là tường thấp hơn. Đúng một đoạn đó là câu trả lời cho "vì sao bỏ qua các cặp mà vẫn đúng?" — hãy tập nói nó trong hai câu.</p>
</div>
${maHai('ch02/container.ts', 'ch02/Container.java', { vung: 'two' })}
${ketQua('ch02/container.ts')}
${BANG_CW}
<div class="ml-en">
<p>Step 1 is the widest container but the shortest wall (1), area 8. Moving the 1 immediately finds 49 at step 2; the remaining six steps can only shrink the width, and no wall left in the middle is tall enough to compensate. Eight steps for nine walls instead of 36 pairs. In the simulation the walls are bars, so you can see the shorter one leave each time.</p>
${moPhong('ch02/container.sim.js', 'en', 'Container With Most Water — walls as bars', 'The two selected bars are the current container; the log shows the area, the record and which wall leaves.')}
</div>
<div class="ml-vi">
<p>Bước 1 là bể rộng nhất nhưng tường thấp nhất (1), diện tích 8. Dời số 1 đi là gặp ngay 49 ở bước 2; sáu bước còn lại chỉ làm bể hẹp đi, và không tường nào ở giữa đủ cao để bù lại. Tám bước cho chín bức tường thay vì 36 cặp. Trong mô phỏng các bức tường là các cột, nên bạn thấy tận mắt bức tường thấp hơn rời đi mỗi lượt.</p>
${moPhong('ch02/container.sim.js', 'vi', 'Container With Most Water — tường thành cột', 'Hai cột được chọn là bể hiện tại; log ghi diện tích, kỷ lục và bức tường nào rời đi.')}
</div>

<div class="ml-en">
<h3>Pattern 4 — Valid Palindrome: compare the ends, skip what does not count</h3>
<p>A phrase is a palindrome if, after lower-casing and keeping only letters and digits, it reads the same both ways ("A man, a plan, a canal: Panama"). Building the cleaned string and reversing it is O(n) time and O(n) memory; two pointers do it in O(1) memory: skip non-alphanumerics from each end, compare, move inward. Two details decide whether your code is right. First, the inner skipping loops must also check <code>l &lt; r</code> — otherwise a string made only of punctuation (<code>".,"</code>) walks off the end. Second, digits count: <code>"0P"</code> is <em>not</em> a palindrome, and a helper that only accepts letters says it is.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 4 — Valid Palindrome: so hai đầu, bỏ qua thứ không tính</h3>
<p>Một câu là palindrome (đối xứng) nếu sau khi đổi về chữ thường và chỉ giữ chữ cái, chữ số, nó đọc xuôi ngược như nhau ("A man, a plan, a canal: Panama"). Dựng chuỗi đã làm sạch rồi đảo ngược là O(n) thời gian và O(n) bộ nhớ; hai con trỏ làm được với O(1) bộ nhớ: bỏ qua ký tự không phải chữ/số ở mỗi đầu, so sánh, đi vào trong. Hai chi tiết quyết định code đúng hay sai. Một, các vòng lặp bỏ qua bên trong cũng phải kiểm <code>l &lt; r</code> — không thì chuỗi toàn dấu câu (<code>".,"</code>) chạy ra ngoài mảng. Hai, chữ số cũng tính: <code>"0P"</code> <em>không</em> đối xứng, còn hàm phụ chỉ nhận chữ cái thì bảo nó đối xứng.</p>
</div>
${maHai('ch02/palindrome.ts', 'ch02/Palindrome.java', { vung: 'dung' })}
${ketQua('ch02/palindrome.ts')}
<div class="ml-en">
<p>We wrote <code>isAlnum</code> by hand for ASCII on purpose. Java's <code>Character.isLetterOrDigit</code> also accepts Unicode letters such as "Ừ", while a TS regex like <code>/[a-z0-9]/i</code> does not — two "correct" solutions that disagree on Vietnamese input. LeetCode's constraints promise printable ASCII, so either passes there; in a real product (a search box that checks palindromic usernames, say) you would first decide what "a letter" means and normalise Unicode. Asking "ASCII only?" is a good clarifying question.</p>
</div>
<div class="ml-vi">
<p>Ta tự viết <code>isAlnum</code> cho ASCII là có chủ ý. <code>Character.isLetterOrDigit</code> của Java nhận cả chữ Unicode như "Ừ", còn một regex TS kiểu <code>/[a-z0-9]/i</code> thì không — hai lời giải "đúng" mà cho kết quả khác nhau trên chữ tiếng Việt. Ràng buộc của LeetCode hứa chỉ có ASCII in được, nên cách nào cũng qua; trong sản phẩm thật (ví dụ một ô kiểm tên đăng nhập đối xứng) bạn phải quyết định trước "chữ cái" nghĩa là gì và chuẩn hoá Unicode. Hỏi "chỉ ASCII thôi phải không ạ?" là một câu hỏi làm rõ hay.</p>
</div>

<div class="ml-en">
<h3>Pattern 5 — Trapping Rain Water: the Hard problem that is two pointers in disguise</h3>
<p><strong>Problem.</strong> Bars of width 1 with heights <code>height[i]</code>; how many units of rain water stay trapped between them? Example: <code>[4, 2, 0, 3, 2, 5]</code> → 9.</p>
<p><strong>Think per index first.</strong> Water above bar i rises to the lower of the tallest bar on its left and the tallest bar on its right: <code>water[i] = min(maxLeft[i], maxRight[i]) − height[i]</code>. Computing <code>maxLeft</code> and <code>maxRight</code> with two prefix passes gives an O(n) time, O(n) memory solution — a fine first answer.</p>
<p><strong>Then remove the arrays.</strong> Keep <code>l</code>, <code>r</code>, and the best heights seen so far from each side. If <code>height[l] &lt; height[r]</code>, there is a wall at least <code>height[r]</code> somewhere on the right, so the right side is <em>not</em> the limit for index l — only <code>leftMax</code> is. We can settle index l now: add <code>leftMax − height[l]</code> and move on. Same argument mirrored for r. It is Container's "the shorter side decides" again.</p>
</div>
<div class="ml-vi">
<h3>Mẫu 5 — Trapping Rain Water: đề Hard thật ra là hai con trỏ đội lốt</h3>
<p><strong>Đề.</strong> Các cột rộng 1 có chiều cao <code>height[i]</code>; mưa xong thì bao nhiêu đơn vị nước đọng lại giữa chúng? Ví dụ: <code>[4, 2, 0, 3, 2, 5]</code> → 9.</p>
<p><strong>Nghĩ theo từng ô trước.</strong> Nước trên cột i dâng tới mức thấp hơn giữa cột cao nhất bên trái và cột cao nhất bên phải: <code>water[i] = min(maxLeft[i], maxRight[i]) − height[i]</code>. Tính <code>maxLeft</code> và <code>maxRight</code> bằng hai lượt quét tiền tố cho lời giải O(n) thời gian, O(n) bộ nhớ — một câu trả lời đầu tiên rất ổn.</p>
<p><strong>Rồi bỏ hai mảng đi.</strong> Giữ <code>l</code>, <code>r</code>, và chiều cao lớn nhất đã thấy ở mỗi bên. Nếu <code>height[l] &lt; height[r]</code> thì chắc chắn có một bức tường cao ít nhất <code>height[r]</code> ở bên phải, nên bên phải <em>không</em> phải giới hạn của ô l — chỉ <code>leftMax</code> mới là. Ta chốt được ô l ngay: cộng <code>leftMax − height[l]</code> rồi đi tiếp. Lập luận đối xứng cho r. Chính là "bên thấp hơn quyết định" của bài Container, lặp lại.</p>
</div>
${ma('ch02/trap.ts', { vung: 'mang', nhan: 'TypeScript — answer 1: prefix/suffix max, O(n) memory' })}
${maHai('ch02/trap.ts', 'ch02/Trap.java', { vung: 'two' })}
${ketQua('ch02/trap.ts')}
${BANG_TR}
<div class="ml-en">
<p>Here <code>height[r] = 5</code> is the tallest bar, so the left side is always the lower one and <code>l</code> does all the walking: the level stays 4 (the first bar), and the water added is 0, 2, 4, 1, 2 — total 9, the same as the array version prints. On the classic <code>[0,1,0,2,1,0,1,3,2,1,2,1]</code> both pointers move, and both versions agree on 6.</p>
</div>
<div class="ml-vi">
<p>Ở đây <code>height[r] = 5</code> là cột cao nhất, nên bên trái luôn là bên thấp hơn và <code>l</code> đi hết: mức nước đứng ở 4 (cột đầu tiên), lượng nước cộng thêm là 0, 2, 4, 1, 2 — tổng 9, khớp với bản dùng mảng in ra. Với ví dụ kinh điển <code>[0,1,0,2,1,0,1,3,2,1,2,1]</code> thì cả hai con trỏ cùng đi, và hai bản cùng ra 6.</p>
</div>

<div class="ml-en">
<h3>Family 2 — same-direction pointers: read and write</h3>
<p>Three Easy problems with one idea: a <strong>read</strong> pointer <code>r</code> visits every element; a <strong>write</strong> pointer <code>w</code> marks the end of the part you have decided to keep. Everything before <code>w</code> is the answer so far; everything from <code>w</code> to <code>r</code> is garbage you are allowed to overwrite.</p>
<ul>
<li><strong>Remove Duplicates from Sorted Array</strong>: keep <code>nums[r]</code> when it differs from the last kept value <code>nums[w − 1]</code>.</li>
<li><strong>Move Zeroes</strong>: keep non-zeros in order; swapping instead of overwriting pushes the zeros right in the same pass.</li>
<li><strong>Merge Sorted Array</strong>: two read pointers (one per array) and one write pointer — but writing from the front would destroy unread values of <code>nums1</code>, so all three pointers start at the <em>back</em>, where the free space is.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Họ thứ hai — con trỏ cùng chiều: đọc và ghi</h3>
<p>Ba đề Easy chung một ý: con trỏ <strong>đọc</strong> <code>r</code> ghé mọi phần tử; con trỏ <strong>ghi</strong> <code>w</code> đánh dấu cuối phần bạn đã quyết định giữ. Mọi thứ trước <code>w</code> là đáp án tới giờ; từ <code>w</code> tới <code>r</code> là rác, được phép ghi đè.</p>
<ul>
<li><strong>Remove Duplicates from Sorted Array</strong> (xoá trùng trong mảng đã sắp): giữ <code>nums[r]</code> khi nó khác giá trị giữ lại gần nhất <code>nums[w − 1]</code>.</li>
<li><strong>Move Zeroes</strong> (dồn số 0): giữ các số khác 0 theo đúng thứ tự; đổi chỗ thay vì ghi đè sẽ đẩy số 0 sang phải ngay trong cùng lượt.</li>
<li><strong>Merge Sorted Array</strong> (trộn hai mảng đã sắp): hai con trỏ đọc (mỗi mảng một) và một con trỏ ghi — nhưng ghi từ đầu sẽ phá các giá trị chưa đọc của <code>nums1</code>, nên cả ba con trỏ xuất phát từ <em>cuối</em>, nơi có chỗ trống.</li>
</ul>
</div>
${maHai('ch02/cung-chieu.ts', 'ch02/CungChieu.java')}
${ketQua('ch02/cung-chieu.ts')}
<div class="ml-en">
<p>The trace of Remove Duplicates on <code>[1, 1, 2, 2, 2, 3, 4, 4]</code>: light green = the kept prefix <code>[0, w)</code>, orange = the read pointer, bright green = a value just written.</p>
</div>
<div class="ml-vi">
<p>Vết của Remove Duplicates trên <code>[1, 1, 2, 2, 2, 3, 4, 4]</code>: xanh nhạt = phần đầu đã giữ <code>[0, w)</code>, cam = con trỏ đọc, xanh lá đậm = giá trị vừa được ghi.</p>
</div>
${BANG_RD}
<div class="ml-en">
<p>The function returns k = ${vetRd.k}. Look at the last row: the array still ends in <code>…, 2, 3, 4, 4</code> — the tail after <code>w</code> is leftover garbage, and that is allowed: the problem only checks the first k elements. In the merge, the loop runs <code>while (j &gt;= 0)</code> rather than until both arrays are empty, because once <code>nums2</code> is used up, the remaining elements of <code>nums1</code> are already in their final places (second test: 4, 5, 6 were moved, 1, 2, 3 copied in, and nothing else needed to move).</p>
</div>
<div class="ml-vi">
<p>Hàm trả về k = ${vetRd.k}. Nhìn dòng cuối: mảng vẫn kết thúc bằng <code>…, 2, 3, 4, 4</code> — phần đuôi sau <code>w</code> là rác còn sót, và điều đó được phép: đề chỉ chấm k phần tử đầu. Ở bài trộn, vòng lặp chạy <code>while (j &gt;= 0)</code> chứ không chạy tới khi cả hai mảng hết, vì khi <code>nums2</code> đã dùng xong thì các phần tử còn lại của <code>nums1</code> đã nằm đúng chỗ cuối cùng rồi (ca test thứ hai: 4, 5, 6 được dời, 1, 2, 3 được chép vào, không còn gì phải dời nữa).</p>
${csd('csd201-mergesort', 'vi', '6.4 Merge-sort & tính ổn định', '<p>Bước TRỘN của merge sort chính là hai con trỏ cùng chiều trên hai mảng đã sắp. Ở CSD201 bạn trộn vào một mảng phụ; ở đây Merge Sorted Array bắt bạn trộn <strong>tại chỗ</strong> — và lời giải là đổi hướng đi (từ cuối lên) chứ không phải thêm bộ nhớ.</p>')}
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong><code>sort file | uniq</code>.</strong> The Unix <code>uniq</code> command removes only <em>adjacent</em> duplicate lines — it is exactly Remove Duplicates from Sorted Array, a read pointer and a "last kept line". That is why every tutorial sorts first; <code>uniq</code> on an unsorted file is a classic mistake that leaves duplicates in place.</li>
<li><strong>Merge join in databases.</strong> When both inputs of a JOIN are sorted on the key, PostgreSQL can walk them with one pointer each and advance the smaller key — the merge step above, at the scale of millions of rows. It wins when the data is already sorted by an index.</li>
<li><strong>Merging sorted logs and streams.</strong> Combining two log files ordered by timestamp, or two pages of a feed ordered by date, is a two-pointer merge — no need to concatenate and re-sort.</li>
<li><strong>In-place filtering.</strong> Compaction in storage engines and "delete all matching items without allocating a new array" in performance-sensitive code use the read/write pair; JS's <code>filter</code> allocates a new array instead, which is usually fine — until it is called in a hot loop over millions of elements.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong><code>sort file | uniq</code>.</strong> Lệnh <code>uniq</code> của Unix chỉ xoá các dòng trùng <em>đứng cạnh nhau</em> — đúng y Remove Duplicates from Sorted Array: một con trỏ đọc và một "dòng giữ lại gần nhất". Vì vậy mọi hướng dẫn đều sắp xếp trước; chạy <code>uniq</code> trên tệp chưa sắp là lỗi kinh điển, các dòng trùng vẫn nằm nguyên.</li>
<li><strong>Merge join trong cơ sở dữ liệu.</strong> Khi cả hai đầu vào của một phép JOIN đã sắp theo khoá, PostgreSQL đi trên chúng bằng mỗi bên một con trỏ và dời con đang ở khoá nhỏ hơn — đúng bước trộn ở trên, ở quy mô hàng triệu dòng. Nó thắng khi dữ liệu đã được sắp sẵn nhờ chỉ mục.</li>
<li><strong>Trộn log và luồng đã sắp.</strong> Gộp hai tệp log theo thời gian, hay hai trang bảng tin theo ngày, là một phép trộn hai con trỏ — không cần nối lại rồi sắp xếp lại.</li>
<li><strong>Lọc tại chỗ.</strong> Việc "nén" dữ liệu trong các bộ máy lưu trữ, hay "xoá mọi phần tử thoả điều kiện mà không cấp phát mảng mới" ở code cần hiệu năng, đều dùng cặp đọc/ghi; <code>filter</code> của JS thì cấp phát mảng mới, thường không sao — cho tới khi nó bị gọi trong một vòng lặp nóng trên hàng triệu phần tử.</li>
</ul>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-10-2-chien-luoc-join', title: 'PostgreSQL 10.2 — Chiến lược JOIN: Nested Loop, Hash &amp; Merge', sub: 'Merge join = hai con trỏ trên hai bảng đã sắp, thấy trong EXPLAIN', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: when your O(n²) meets their n</h3>
<p>The measurement above is also a security fact. If an endpoint runs a pairwise loop over a list the <em>client</em> sends (find duplicate pairs in an uploaded list, compare every row with every other row), the attacker controls n. This server accepts JSON bodies up to 10 MB (<code>express.json({ limit: '10mb' })</code> in <code>src/index.ts</code>) — that is enough for roughly a million small numbers, and at n = 10⁵ the brute force above already costs 3.5 seconds of a single-threaded Node process during which no other request is served. Defences: choose the O(n) or O(n log n) algorithm (that is what this chapter is for), cap the number of items per request separately from the byte limit, and move heavy work off the request thread.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: khi O(n²) của bạn gặp n của họ</h3>
<p>Số đo ở trên cũng là một sự thật về bảo mật. Nếu một endpoint chạy vòng lặp từng cặp trên danh sách do <em>client</em> gửi lên (tìm cặp trùng trong danh sách tải lên, so mỗi dòng với mọi dòng khác), thì kẻ tấn công nắm n. Máy chủ của chính trang này nhận body JSON tới 10 MB (<code>express.json({ limit: '10mb' })</code> trong <code>src/index.ts</code>) — đủ cho khoảng một triệu số nhỏ, mà ở n = 10⁵ vét cạn ở trên đã tốn 3,5 giây của một tiến trình Node đơn luồng, trong lúc đó không request nào khác được phục vụ. Cách phòng: chọn thuật toán O(n) hoặc O(n log n) (chương này sinh ra để làm việc đó), đặt trần SỐ PHẦN TỬ mỗi request tách khỏi trần số byte, và đẩy việc nặng ra khỏi luồng xử lý request.</p>
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-3-dau-vao-doc-hai', title: 'Node.js 9.3 — Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn body, SSRF', sub: 'Giới hạn body và các kiểu đầu vào làm treo máy chủ', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'You get a sorted array and a target. Return the 1-based indices of two numbers that add up to the target. Use constant extra space.'],
  ['C', 'Let me confirm: sorted ascending, duplicates possible, exactly one answer, and I can’t use the same element twice?'],
  ['N', 'Restating the constraints shows you noticed "sorted" and "constant space" — the two words that decide the solution.'],
  ['I', 'Yes to all.'],
  ['C', 'Brute force checks all pairs, O(n²). A hash map would be O(n) but uses O(n) space, which breaks the constraint. Since it’s sorted I can binary search the complement for each element — O(n log n), O(1) space. Even better: two pointers from both ends.'],
  ['C', 'If the sum is too big, the right element is too big even with the smallest partner left, so it can’t be in any answer and I move r left. Symmetric for too small. Each step discards one element, so it’s O(n) time, O(1) space. Shall I code it?'],
  ['N', 'The two-sentence elimination proof is the part that separates "memorised" from "understood".'],
  ['I', 'Go ahead.'],
  ['C', '(coding) The loop is while l &lt; r, strictly, so I never pair an element with itself… and I return l + 1, r + 1 because the output is 1-based. Let me trace [2, 7, 11, 15] with 9: 2 + 15 is 17, too big, r moves; 2 + 11 is 13, r moves; 2 + 7 is 9, return [1, 2].'],
  ['N', 'Narrate the two details that cause most wrong answers (strict &lt; and 1-based), then trace a small case.'],
  ['I', 'Now find all unique triples that sum to zero.'],
  ['C', 'Sort, fix the first number, and run this same two-pointer search for minus that number on the rest — O(n²) overall. To keep triples unique I skip equal values for the fixed number and for both pointers after a match.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
<p>Cùng mạch hội thoại ở khối tiếng Anh, bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Cho mảng đã sắp xếp và một target. Trả về chỉ số (đánh từ 1) của hai số có tổng bằng target. Chỉ dùng bộ nhớ phụ hằng số.'],
  ['C', 'Em xác nhận lại: sắp tăng dần, có thể có số trùng, đúng một đáp án, và không dùng một phần tử hai lần ạ? <em>("Let me confirm: sorted ascending, exactly one answer?")</em>'],
  ['N', 'Nhắc lại ràng buộc cho thấy bạn đã để ý "đã sắp xếp" và "bộ nhớ hằng số" — hai cụm từ quyết định lời giải.'],
  ['I', 'Đúng hết.'],
  ['C', 'Vét cạn thử mọi cặp, O(n²). Hash map cho O(n) nhưng tốn O(n) bộ nhớ, phạm ràng buộc. Vì mảng đã sắp nên em có thể tìm nhị phân phần bù cho từng phần tử — O(n log n), O(1) bộ nhớ. Tốt hơn nữa: hai con trỏ từ hai đầu.'],
  ['C', 'Nếu tổng quá lớn thì phần tử bên phải quá lớn kể cả với bạn ghép nhỏ nhất còn lại, nên nó không thể nằm trong đáp án nào, em dời r sang trái. Quá nhỏ thì đối xứng. Mỗi bước loại một phần tử nên O(n) thời gian, O(1) bộ nhớ. Em code nhé? <em>("Each step discards one element, so it’s O(n) time, O(1) space.")</em>'],
  ['N', 'Câu chứng minh loại trừ hai câu là thứ phân biệt "học thuộc" với "hiểu".'],
  ['I', 'Ừ, làm đi.'],
  ['C', '(vừa code vừa nói) Vòng lặp là while l &lt; r, dấu bé hơn chặt, nên không bao giờ ghép một phần tử với chính nó… và em trả l + 1, r + 1 vì đầu ra đánh số từ 1. Em chạy tay [2, 7, 11, 15] với 9: 2 + 15 là 17, quá lớn, r lùi; 2 + 11 là 13, r lùi; 2 + 7 là 9, trả [1, 2].'],
  ['N', 'Thuật lại đúng hai chi tiết gây nhiều đáp án sai nhất (dấu &lt; chặt và đánh số từ 1), rồi chạy tay một ca nhỏ.'],
  ['I', 'Giờ tìm mọi bộ ba khác nhau có tổng bằng 0.'],
  ['C', 'Sắp xếp, cố định số đầu, rồi chạy đúng phép tìm hai con trỏ này cho số đối của nó trên phần còn lại — tổng cộng O(n²). Để bộ ba không trùng, em bỏ qua các giá trị bằng nhau ở số cố định và ở cả hai con trỏ sau mỗi lần trúng. <em>("I skip equal values to keep the triples unique.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Moving a pointer without a reason ("let’s try moving l") — if you cannot state which candidates you just discarded and why they are useless, the algorithm is probably wrong.</li>
<li><code>while (l &lt;= r)</code> in a pair problem: an element pairs with itself.</li>
<li>Default <code>sort()</code> in JS (string order), or forgetting to sort at all before converging pointers.</li>
<li>3Sum: deduplicating only the fixed number, or comparing the fixed number with the <em>next</em> one (<code>a[i] === a[i + 1]</code>) instead of the previous one — that skips the first −1 and loses the valid triple <code>[-1, -1, 2]</code>.</li>
<li>Inner skip loops without <code>l &lt; r</code> (palindrome) — index out of range on all-punctuation input.</li>
<li>Merge Sorted Array filled from the front — it overwrites values of <code>nums1</code> you have not read yet.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Dời con trỏ không có lý do ("thử dời l xem") — nếu không nói được mình vừa loại những ứng viên nào và vì sao chúng vô dụng, thuật toán gần như chắc chắn sai.</li>
<li><code>while (l &lt;= r)</code> trong bài tìm cặp: một phần tử tự ghép với chính nó.</li>
<li><code>sort()</code> mặc định của JS (thứ tự chuỗi), hoặc quên sắp xếp trước khi chạy hai con trỏ đối đầu.</li>
<li>3Sum: chỉ khử trùng ở số cố định, hoặc so số cố định với số <em>kế sau</em> (<code>a[i] === a[i + 1]</code>) thay vì số liền trước — cách đó bỏ qua số −1 đầu tiên và làm mất bộ ba hợp lệ <code>[-1, -1, 2]</code>.</li>
<li>Vòng lặp bỏ qua bên trong thiếu <code>l &lt; r</code> (bài palindrome) — chạy ra ngoài mảng khi chuỗi toàn dấu câu.</li>
<li>Merge Sorted Array điền từ đầu — ghi đè lên giá trị của <code>nums1</code> chưa kịp đọc.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Tên đề giữ nguyên tiếng Anh để bạn tìm được trên LeetCode/NeetCode. Lời giải từng bước của 8 đề tổng hợp cả chương nằm ở bài 2.4 (Bộ luyện 2).</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write Two Sum II with two pointers in your interview language. Run it on <code>[2,7,11,15], 9</code>, <code>[2,3,4], 6</code>, <code>[-1,0], -1</code>.</li>
<li>Change <code>l &lt; r</code> to <code>l &lt;= r</code> and find an input (with no valid pair) where the result becomes wrong. Write the input down.</li>
<li>Submit LC 167, LC 15 and LC 11. For LC 11, write the "shorter wall" proof in your notebook in at most two sentences.</li>
<li>Bonus: LC 42 — write the O(n) memory version first, then remove the arrays.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, one input that breaks <code>&lt;=</code>, and the Container proof written in ≤ 2 sentences.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">two pointers</span><span class="v">Two indices moving monotonically through a sequence; each move discards candidates.</span></div>
  <div class="kv"><span class="k">converging pointers</span><span class="v">Start at both ends and move toward each other; needs sorted or symmetric data.</span></div>
  <div class="kv"><span class="k">read / write pointers</span><span class="v">Same direction: one scans every element, one marks the end of the kept part.</span></div>
  <div class="kv"><span class="k">elimination argument</span><span class="v">The proof that a discarded element cannot be part of any answer.</span></div>
  <div class="kv"><span class="k">in place</span><span class="v">Modifying the input array itself with O(1) extra memory.</span></div>
  <div class="kv"><span class="k">deduplication</span><span class="v">Skipping equal neighbours in sorted data so each answer is reported once.</span></div>
  <div class="kv"><span class="k">merge</span><span class="v">Combining two sorted sequences with one pointer each, advancing the smaller.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Two pointers turn many O(n²) pair searches into O(n) with O(1) memory.</li>
<li>Every move needs a reason: the discarded element cannot be in any answer.</li>
<li>Sorted + pair sum ⇒ converging pointers; 3Sum = sort + fix one + Two Sum II, dedup at three places.</li>
<li>"Limited by the shorter side" (Container, Trapping Rain Water) ⇒ settle and move the shorter side.</li>
<li>Read/write pointers filter and merge in place; merge from the back when free space is at the end.</li>
<li>In JS always sort numbers with <code>(x, y) =&gt; x - y</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Two Pointers', 'The standard order of the two-pointer problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java Arrays (Java SE 21 API)', 'Arrays.sort for primitives (dual-pivot quicksort) and for objects (stable merge sort)', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết Two Sum II bằng hai con trỏ bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn. Chạy với <code>[2,7,11,15], 9</code>, <code>[2,3,4], 6</code>, <code>[-1,0], -1</code>.</li>
<li>Đổi <code>l &lt; r</code> thành <code>l &lt;= r</code> rồi tìm một đầu vào (không có cặp hợp lệ) làm kết quả sai. Ghi đầu vào đó lại.</li>
<li>Nộp LC 167, LC 15 và LC 11. Với LC 11, ghi vào sổ câu chứng minh "dời tường thấp hơn" trong tối đa hai câu.</li>
<li>Thêm: LC 42 — viết bản dùng O(n) bộ nhớ trước, rồi bỏ hai mảng đi.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, một đầu vào làm hỏng <code>&lt;=</code>, và câu chứng minh của bài Container viết trong ≤ 2 câu.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">two pointers (hai con trỏ)</span><span class="v">Hai chỉ số đi đơn điệu trên một dãy; mỗi lần dời loại bỏ một số ứng viên.</span></div>
  <div class="kv"><span class="k">converging pointers (con trỏ đối đầu / hội tụ)</span><span class="v">Xuất phát ở hai đầu, đi về phía nhau; cần dữ liệu đã sắp hoặc đối xứng.</span></div>
  <div class="kv"><span class="k">read / write pointers (con trỏ đọc / ghi)</span><span class="v">Cùng chiều: một con quét mọi phần tử, một con đánh dấu cuối phần được giữ.</span></div>
  <div class="kv"><span class="k">elimination argument (lập luận loại trừ)</span><span class="v">Chứng minh rằng phần tử bị loại không thể nằm trong đáp án nào.</span></div>
  <div class="kv"><span class="k">in place (tại chỗ)</span><span class="v">Sửa ngay trên mảng đầu vào, bộ nhớ phụ O(1).</span></div>
  <div class="kv"><span class="k">deduplication (khử trùng)</span><span class="v">Bỏ qua các phần tử bằng nhau đứng cạnh nhau trong dữ liệu đã sắp để mỗi đáp án chỉ báo một lần.</span></div>
  <div class="kv"><span class="k">merge (trộn)</span><span class="v">Gộp hai dãy đã sắp bằng mỗi dãy một con trỏ, dời con đang trỏ vào giá trị nhỏ hơn.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai con trỏ biến nhiều bài tìm cặp O(n²) thành O(n) với O(1) bộ nhớ.</li>
<li>Mỗi lần dời phải có lý do: phần tử bị loại không thể nằm trong đáp án nào.</li>
<li>Đã sắp + tổng một cặp ⇒ hai con trỏ đối đầu; 3Sum = sắp xếp + cố định một số + Two Sum II, khử trùng ở ba chỗ.</li>
<li>"Bị chặn bởi bên thấp hơn" (Container, Trapping Rain Water) ⇒ chốt và dời bên thấp hơn.</li>
<li>Con trỏ đọc/ghi lọc và trộn tại chỗ; trộn từ cuối khi chỗ trống nằm ở cuối.</li>
<li>Trong JS luôn sắp số bằng <code>(x, y) =&gt; x - y</code>.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Two Pointers', 'Thứ tự chuẩn các đề hai con trỏ, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java Arrays (Java SE 21 API)', 'Arrays.sort cho kiểu nguyên thuỷ (quicksort hai chốt) và cho đối tượng (merge sort ổn định)', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html')}
</div>
`,
};
