/** 8.2 — Tổ hợp, combination sum, khử trùng. Mọi mã/output đọc từ ../ma/ch08 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { oDay, duong } from './_rieng.mjs';
import { vetSubsetsDup, vetComboSum } from '../ma/ch08/khu-trung.vet.mjs';

const vc = vetComboSum([2, 3, 6, 7], 7);
const BANG_COMBO = bangVet(['call', 'path', 'remain', 'branches taken', 'loop stopped by', 'never tried'],
  vc.hang.map((h, k) => [
    `#${k + 1}`,
    duong(h.path),
    h.remain === 0 ? '<strong>0 ✅</strong>' : String(h.remain),
    h.remain === 0 ? '<em>record</em>' : (h.thu.length ? h.thu.join(', ') : '—'),
    h.dung !== null ? `break at ${h.dung} &gt; ${h.remain}` : (h.remain === 0 ? '' : 'end of array'),
    h.boQua ? oMang(vc.a, { to: Object.fromEntries([...Array(h.boQua).keys()].map((j) => [vc.a.length - h.boQua + j, 'mo'])) }) : '',
  ]));

const vd = vetSubsetsDup([2, 1, 2]);
const BANG_TRUNG = bangVet(['#', 'event', 'level (start)', 'path', 'sorted a = [1, 2, 2]'],
  vd.hang.map((h, k) => [
    String(k + 1),
    h.loai === 'ghi' ? 'record' : `<strong>skip</strong> i = ${h.i}`,
    String(h.start),
    oDay(h.path),
    h.loai === 'ghi'
      ? oMang(vd.a, { to: Object.fromEntries([...Array(vd.a.length - h.start).keys()].map((j) => [h.start + j, 'l'])), chiSo: true })
      : oMang(vd.a, { to: { [h.i]: 'x', [h.i - 1]: 'mo' }, chiSo: true }),
  ]));

const DE = [
  [lc(77, 'combinations', 'Combinations', 'Medium'), 'Subsets of size exactly k; stop the loop when too few numbers are left.', 'Tập con đúng k phần tử; dừng vòng lặp khi không còn đủ số.'],
  [lc(39, 'combination-sum', 'Combination Sum', 'Medium'), 'Reuse allowed ⇒ recurse with i; sort + break when too big.', 'Được dùng lại ⇒ đệ quy với i; sort + break khi quá lớn.'],
  [lc(40, 'combination-sum-ii', 'Combination Sum II', 'Medium'), 'Each once ⇒ i + 1; duplicates in input ⇒ skip a twin at the same level.', 'Mỗi số một lần ⇒ i + 1; đầu vào có trùng ⇒ bỏ anh em trùng ở cùng tầng.'],
  [lc(90, 'subsets-ii', 'Subsets II', 'Medium'), 'Subsets + the same skip rule: i &gt; start, not i &gt; 0.', 'Subsets + đúng luật bỏ trùng đó: i &gt; start, không phải i &gt; 0.'],
  [lc(216, 'combination-sum-iii', 'Combination Sum III', 'Medium'), 'Two limits at once: exactly k numbers and sum n, digits 1–9.', 'Hai giới hạn cùng lúc: đúng k số và tổng n, chữ số 1–9.'],
  [lc(17, 'letter-combinations-of-a-phone-number', 'Letter Combinations of a Phone Number', 'Medium'), 'A cartesian product: level i = digit i, choices = its letters.', 'Tích Đề-các: tầng i = chữ số i, lựa chọn = các chữ cái của nó.'],
  [lc(22, 'generate-parentheses', 'Generate Parentheses', 'Medium'), 'Prune with two counters: open &lt; n, close &lt; open.', 'Cắt nhánh bằng hai bộ đếm: open &lt; n, close &lt; open.'],
  [lc(131, 'palindrome-partitioning', 'Palindrome Partitioning', 'Medium'), 'The choice is where the next piece ends; precompute which pieces are palindromes.', 'Lựa chọn là mảnh kế tiếp kết thúc ở đâu; tính trước mảnh nào là palindrome.'],
  [lc(93, 'restore-ip-addresses', 'Restore IP Addresses', 'Medium'), 'Partitioning with rules: 4 pieces, 0–255, no leading zero.', 'Phân tách có luật: 4 mảnh, 0–255, không số 0 đứng đầu.'],
];

export default {
  title: '8.2 — Combinations, combination sum and duplicate-free answers|||8.2 — Tổ hợp, combination sum và đáp án không trùng',
  slug: 'dsa-8-2-to-hop',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bốn núm vặn của khuôn quay lui (start là i hay i + 1, khi nào ghi, khi nào break, bỏ trùng cùng tầng) phủ Combinations, Combination Sum I/II, Subsets II, bàn phím điện thoại, sinh ngoặc, phân tách palindrome — bảng vết cho thấy nhánh nào bị bỏ, đo số lời gọi khi sort + break, và tổ hợp test SWT301 thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>Combinations, combination sum and duplicate-free answers</h2>
<p class="lead">Lesson 8.1 gave you one template. This lesson turns it into a family by changing four small knobs: where the next level starts (<code>i</code> or <code>i + 1</code>), when an answer is recorded, when the loop can <code>break</code>, and how to skip duplicates. Those four knobs solve Combinations, Combination Sum I and II, Subsets II, the phone keypad, Generate Parentheses and Palindrome Partitioning — about a third of all backtracking questions asked in interviews. The hardest knob, "no duplicate answers when the input has duplicates", gets a trace table that shows exactly which branches are cut.</p>

<h3>The everyday picture: picking a project team, paying an exact amount</h3>
<p>Your class must form SWP391 project groups of 3 from 6 friends. A group of {An, Bình, Chi} is the same group as {Chi, An, Bình}: <strong>order does not matter</strong>, so this is a <em>combination</em>. If instead you assign three roles — leader, developer, tester — then An-as-leader and Chi-as-leader are different teams: order matters, that is a <em>permutation</em> (lesson 8.1). The code difference is one line: combinations only look <em>forward</em> (from <code>start</code>), so each group is produced in exactly one order.</p>
<p>Now the canteen: you must pay exactly 70k. If the cashier has an unlimited supply of 20k, 30k and 50k notes, the same note value may be used again — that is <strong>Combination Sum</strong>. If instead you pay from your own wallet, which holds two 10k notes, one 20k and one 50k, each <em>physical</em> note is used at most once, and swapping your two identical 10k notes does not create a new way to pay. That is <strong>Combination Sum II</strong>, and "identical notes must not create duplicate answers" is the duplicate-skipping rule of this lesson.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Tổ hợp, combination sum và đáp án không trùng</h2>
<p class="lead">Bài 8.1 cho bạn một khuôn. Bài này biến nó thành cả một họ bằng cách vặn bốn núm nhỏ: tầng sau bắt đầu từ đâu (<code>i</code> hay <code>i + 1</code>), khi nào ghi đáp án, khi nào vòng lặp được <code>break</code>, và bỏ phần tử trùng thế nào. Bốn núm đó giải Combinations, Combination Sum I và II, Subsets II, bàn phím điện thoại, Generate Parentheses và Palindrome Partitioning — khoảng một phần ba số câu quay lui hay gặp khi phỏng vấn. Núm khó nhất, "đầu vào có phần tử trùng mà đáp án không được trùng", có một bảng vết cho thấy chính xác nhánh nào bị cắt.</p>

<h3>Hình dung đời thường: chọn nhóm đồ án, trả đúng số tiền</h3>
<p>Lớp bạn phải chia nhóm đồ án SWP391 mỗi nhóm 3 người từ 6 người bạn. Nhóm {An, Bình, Chi} là cùng một nhóm với {Chi, An, Bình}: <strong>thứ tự không quan trọng</strong>, nên đây là <em>tổ hợp</em> (combination). Còn nếu bạn giao ba vai — trưởng nhóm, lập trình, kiểm thử — thì An làm trưởng nhóm và Chi làm trưởng nhóm là hai đội khác nhau: thứ tự có nghĩa, đó là <em>hoán vị</em> (bài 8.1). Khác biệt trong code chỉ là một dòng: tổ hợp chỉ nhìn <em>về phía trước</em> (từ <code>start</code>), nên mỗi nhóm được sinh ra đúng theo một thứ tự.</p>
<p>Giờ tới căng-tin: bạn phải trả đúng 70k. Nếu thu ngân có vô hạn tờ 20k, 30k và 50k, cùng một mệnh giá được dùng lại — đó là <strong>Combination Sum</strong>. Còn nếu bạn trả từ chính ví mình, trong ví có hai tờ 10k, một tờ 20k và một tờ 50k, thì mỗi tờ <em>vật lý</em> dùng tối đa một lần, và đổi chỗ hai tờ 10k giống hệt nhau không tạo ra cách trả mới. Đó là <strong>Combination Sum II</strong>, và "những tờ giống hệt nhau không được tạo đáp án trùng" chính là luật bỏ trùng của bài này.</p>
${csd('csd201-cs6-on', 'vi', 'CS.6 Bài tập: 7 bài quay lui kiểu phỏng vấn', '<p>Bộ bài tập CS.6 của CSD201 có Subsets II, Combination Sum III, tổ hợp chữ trên phím và khôi phục địa chỉ IP, giải bằng Java. Ôn nhanh một câu: tập con có trùng thì sort rồi bỏ phần tử giống phần tử ngay trước. <strong>Ở đây đi sâu thêm:</strong> vì sao điều kiện là <code>i &gt; start</code> chứ không phải <code>i &gt; 0</code> (chạy thật bản sai), bảng vết chỉ đúng nhánh bị bỏ, đo số lời gọi khi sort + break, và cách gom cả họ đề vào bốn núm vặn.</p>')}
</div>

<div class="ml-en">
<h3>The four knobs</h3>
<table>
<thead><tr><th>Knob</th><th>Setting</th><th>Problems</th></tr></thead>
<tbody>
<tr><td>1. Next level starts at</td><td><code>i</code> = the same element may be reused · <code>i + 1</code> = each element at most once · <code>0</code> + <code>used[]</code> = order matters</td><td>Combination Sum (i) · Combinations, Subsets, Combination Sum II (i + 1) · Permutations (0)</td></tr>
<tr><td>2. Record when</td><td>every node · path length = k · remaining target = 0 · position = end of string</td><td>Subsets · Combinations · Combination Sum · Partitioning, keypad</td></tr>
<tr><td>3. Stop the loop when</td><td>sorted and the current value is already too big (<code>break</code>) · not enough elements left</td><td>Combination Sum I/II · Combinations</td></tr>
<tr><td>4. Skip duplicates</td><td>sorted, and <code>i &gt; start &amp;&amp; a[i] == a[i − 1]</code> ⇒ <code>continue</code></td><td>Subsets II, Combination Sum II (and Permutations II, lesson 8.4)</td></tr>
</tbody></table>
<p>In an interview, say which setting you picked for each knob before writing code. It is a 20-second summary that shows you understand the family, not one memorised solution.</p>
</div>
<div class="ml-vi">
<h3>Bốn núm vặn</h3>
<table>
<thead><tr><th>Núm</th><th>Thiết lập</th><th>Đề</th></tr></thead>
<tbody>
<tr><td>1. Tầng sau bắt đầu từ</td><td><code>i</code> = được dùng lại cùng phần tử · <code>i + 1</code> = mỗi phần tử tối đa một lần · <code>0</code> + <code>used[]</code> = thứ tự có nghĩa</td><td>Combination Sum (i) · Combinations, Subsets, Combination Sum II (i + 1) · Permutations (0)</td></tr>
<tr><td>2. Ghi đáp án khi</td><td>mọi nút · đường đi dài k · phần target còn lại = 0 · vị trí = cuối chuỗi</td><td>Subsets · Combinations · Combination Sum · phân tách chuỗi, bàn phím</td></tr>
<tr><td>3. Dừng vòng lặp khi</td><td>đã sort và giá trị hiện tại đã quá lớn (<code>break</code>) · không còn đủ phần tử</td><td>Combination Sum I/II · Combinations</td></tr>
<tr><td>4. Bỏ trùng</td><td>đã sort, và <code>i &gt; start &amp;&amp; a[i] == a[i − 1]</code> ⇒ <code>continue</code></td><td>Subsets II, Combination Sum II (và Permutations II, bài 8.4)</td></tr>
</tbody></table>
<p>Khi phỏng vấn, hãy nói mình chọn thiết lập nào cho từng núm trước khi viết code. Đó là một bản tóm tắt 20 giây cho thấy bạn hiểu cả họ đề, không phải thuộc một lời giải.</p>
</div>

<div class="ml-en">
<h3>Signals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"combinations", "choose k", "groups", "order does not matter"</span><span class="v">Loop from <code>start</code>; next level from <code>i + 1</code>.</span></div>
  <div class="kv"><span class="k">"the same number may be chosen an unlimited number of times"</span><span class="v">Next level from <code>i</code>, not <code>i + 1</code>. A target sum ⇒ sort and <code>break</code>.</span></div>
  <div class="kv"><span class="k">"may contain duplicates" + "must not contain duplicate combinations"</span><span class="v">Sort, skip a twin at the same level. Never deduplicate with a Set of answers afterwards — it works but explores every duplicate subtree first.</span></div>
  <div class="kv"><span class="k">"all ways to split / partition the string"</span><span class="v">The choice is where the next piece ends; a validity check per piece prunes.</span></div>
  <div class="kv"><span class="k">"all strings of length n with rule…"</span><span class="v">Each position is a level; a counter (open/close, remaining budget) decides which characters are legal.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"combinations", "chọn k", "nhóm", "thứ tự không quan trọng"</span><span class="v">Vòng lặp từ <code>start</code>; tầng sau từ <code>i + 1</code>.</span></div>
  <div class="kv"><span class="k">"một số được chọn không giới hạn số lần"</span><span class="v">Tầng sau từ <code>i</code>, không phải <code>i + 1</code>. Có target tổng ⇒ sort và <code>break</code>.</span></div>
  <div class="kv"><span class="k">"có thể chứa phần tử trùng" + "không được có tổ hợp trùng"</span><span class="v">Sort, bỏ anh em trùng ở cùng tầng. Đừng bao giờ khử trùng bằng một Set đáp án sau khi sinh — chạy được nhưng phải đi hết mọi cây con trùng trước đã.</span></div>
  <div class="kv"><span class="k">"mọi cách tách / phân hoạch chuỗi"</span><span class="v">Lựa chọn là mảnh kế tiếp kết thúc ở đâu; kiểm tính hợp lệ từng mảnh là cắt nhánh.</span></div>
  <div class="kv"><span class="k">"mọi chuỗi dài n theo luật…"</span><span class="v">Mỗi vị trí là một tầng; một bộ đếm (số ngoặc mở/đóng, ngân sách còn lại) quyết định ký tự nào hợp lệ.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Warm-up: Combinations — knob 3 in its simplest form</h3>
<p>Return every set of k numbers chosen from 1…n. It is Subsets that records only at depth k. One more line makes it faster: if we still need <code>need</code> numbers and start at x, the last useful x is <code>n − need + 1</code> — any later and there are not enough numbers left to finish. That bound cuts every branch that could only end too short.</p>
</div>
<div class="ml-vi">
<h3>Khởi động: Combinations — núm 3 ở dạng đơn giản nhất</h3>
<p>Trả về mọi bộ k số chọn từ 1…n. Đó là Subsets nhưng chỉ ghi ở độ sâu k. Thêm một dòng cho nhanh hơn: nếu còn cần <code>need</code> số và bắt đầu từ x, thì x cuối cùng còn có ích là <code>n − need + 1</code> — muộn hơn thì không còn đủ số để hoàn tất. Cận đó cắt mọi nhánh chắc chắn sẽ kết thúc thiếu.</p>
</div>
${maHai('ch08/to-hop.ts', 'ch08/ToHop.java', { vung: 'combine' })}

<div class="ml-en">
<h3>Worked example: Combination Sum (reuse allowed)</h3>
<p><strong>Problem (in our words).</strong> Distinct positive integers <code>candidates</code> and a <code>target</code>; return every combination whose sum is target, where a number may be used any number of times. Combinations that differ only in order count once. Example: <code>[2, 3, 6, 7]</code>, target 7 → <code>[[2,2,3], [7]]</code>.</p>
<p><strong>Brute force, said out loud.</strong> Try every multiset of candidates up to sum target — the tree of "how many of each number" — and keep those that hit target exactly. Correct, but it explores sums far above target before rejecting them.</p>
<p><strong>The four knobs.</strong> Path: chosen numbers. Knob 1: the next level starts at <code>i</code> (reuse allowed), which also keeps each combination in non-decreasing order, so <code>[3,2,2]</code> is never generated after <code>[2,2,3]</code>. Knob 2: record when <code>remain === 0</code>. Knob 3: <strong>sort first</strong>; then if <code>a[i] &gt; remain</code>, every later candidate is bigger too, so <code>break</code> — not <code>continue</code>. Knob 4: inputs are distinct, nothing to skip.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Combination Sum (được dùng lại)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho các số nguyên dương đôi một khác nhau <code>candidates</code> và một <code>target</code>; trả về mọi tổ hợp có tổng bằng target, mỗi số được dùng bao nhiêu lần cũng được. Các tổ hợp chỉ khác thứ tự tính là một. Ví dụ: <code>[2, 3, 6, 7]</code>, target 7 → <code>[[2,2,3], [7]]</code>.</p>
<p><strong>Vét cạn, nói to ra.</strong> Thử mọi "túi" số (multiset) có tổng tới target — cây "mỗi số lấy mấy cái" — và giữ những túi chạm đúng target. Đúng, nhưng nó đi qua cả những tổng vượt xa target rồi mới loại.</p>
<p><strong>Bốn núm vặn.</strong> Đường đi: các số đã chọn. Núm 1: tầng sau bắt đầu từ <code>i</code> (được dùng lại), điều này cũng giữ mỗi tổ hợp theo thứ tự không giảm, nên <code>[3,2,2]</code> không bao giờ được sinh sau <code>[2,2,3]</code>. Núm 2: ghi khi <code>remain === 0</code>. Núm 3: <strong>sort trước</strong>; khi đó nếu <code>a[i] &gt; remain</code> thì mọi ứng viên phía sau cũng lớn hơn, nên <code>break</code> — không phải <code>continue</code>. Núm 4: đầu vào khác nhau, không có gì để bỏ.</p>
</div>
${maHai('ch08/to-hop.ts', 'ch08/ToHop.java', { vung: 'combination-sum' })}
${ketQua('ch08/to-hop.ts')}
${ketQua('ch08/ToHop.java')}

<div class="ml-en">
<h3>Watch the break: one row per call</h3>
<p><code>[2, 3, 6, 7]</code>, target 7. "Branches taken" are the values this call recursed into; "loop stopped by" is the value that triggered <code>break</code>; the last column greys out the candidates that this call never even looked at. Produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Nhìn lệnh break làm việc: mỗi lời gọi một hàng</h3>
<p><code>[2, 3, 6, 7]</code>, target 7. "Branches taken" là các giá trị lời gọi này đã đệ quy vào; "loop stopped by" là giá trị làm <code>break</code> xảy ra; cột cuối tô xám các ứng viên mà lời gọi này không thèm nhìn tới. Sinh ra bằng cách chạy thuật toán thật.</p>
</div>
${BANG_COMBO}
<div class="ml-en">
<p>Ten calls in total, two of them answers (#5 and #10). Look at call #4, path <code>[2,2,2]</code> with 1 left: the very first candidate, 2, is already too big, so the loop ends after one comparison and all four candidates are skipped. Without sorting, the loop could not stop there — 7 might come before 2 in the array — and every one of those calls would scan to the end. Call #2 shows the common case: after trying 2 and 3, it meets 6 &gt; 5 and abandons 6 and 7 together.</p>
</div>
<div class="ml-vi">
<p>Tổng cộng mười lời gọi, hai trong số đó là đáp án (#5 và #10). Nhìn lời gọi #4, đường đi <code>[2,2,2]</code> còn thiếu 1: ứng viên đầu tiên, số 2, đã quá lớn, nên vòng lặp kết thúc sau đúng một phép so sánh và cả bốn ứng viên bị bỏ. Không sort thì vòng lặp không thể dừng ở đó — số 7 có thể đứng trước số 2 trong mảng — và mỗi lời gọi như vậy phải quét tới cuối. Lời gọi #2 là trường hợp thường gặp: thử 2 và 3 xong, gặp 6 &gt; 5 và bỏ luôn cả 6 lẫn 7.</p>
</div>

<div class="ml-en">
<h3>How much does sort + break save? Measured</h3>
<p>Three ways to reject a number that is too big, on 38 candidates (40 down to 3) and targets 40, 60, 80. <strong>A</strong>: no sort, call first and return when <code>remain &lt; 0</code>. <strong>B</strong>: sort, then <code>continue</code> past a too-big value. <strong>C</strong>: sort, then <code>break</code>. "Calls" are nodes of the tree; "loop checks" are iterations of the <code>for</code>.</p>
</div>
<div class="ml-vi">
<h3>Sort + break tiết kiệm bao nhiêu? Đo thật</h3>
<p>Ba cách loại một số quá lớn, trên 38 ứng viên (từ 40 xuống 3) với target 40, 60, 80. <strong>A</strong>: không sort, gọi trước rồi trả về khi <code>remain &lt; 0</code>. <strong>B</strong>: sort, rồi <code>continue</code> qua giá trị quá lớn. <strong>C</strong>: sort, rồi <code>break</code>. "Calls" là số nút của cây; "loop checks" là số vòng của <code>for</code>.</p>
</div>
${ma('ch08/combo-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch08/combo-do.ts')}
${ketQua('ch08/ComboDo.java')}
<div class="ml-en">
<p>Read it honestly, because the result is not the one most people expect:</p>
<ul>
<li><strong>B vs C is the big win: about 10× fewer loop checks and 6–10× less time</strong> (target 80: 69 million checks vs 6.8 million). Sorting without <code>break</code> is the worst of the three — you paid for the sort and still scan every too-big candidate at every node.</li>
<li><strong>A vs C: C makes about 27 % fewer calls</strong> (3.6 million vs 5.0 million at target 80) because it rejects before calling, but the times are close. Rejecting on entry costs one cheap call per too-big candidate; here that is about as cheap as the comparison. So "sort + break" is not magic: its value is that it lets you stop the <em>whole loop</em>, and that matters most when each node has many candidates and the tree is deep.</li>
<li>Combination Sum II needs the sort anyway (for knob 4), so there the <code>break</code> is free.</li>
</ul>
</div>
<div class="ml-vi">
<p>Đọc thật trung thực, vì kết quả không giống điều phần lớn mọi người chờ đợi:</p>
<ul>
<li><strong>B so với C mới là chỗ thắng lớn: số vòng lặp ít hơn khoảng 10 lần và thời gian ít hơn 6–10 lần</strong> (target 80: 69 triệu lượt kiểm so với 6,8 triệu). Sort mà không <code>break</code> là cách tệ nhất trong ba — bạn đã trả tiền sort mà vẫn quét mọi ứng viên quá lớn ở mọi nút.</li>
<li><strong>A so với C: C ít hơn khoảng 27 % lời gọi</strong> (3,6 triệu so với 5,0 triệu ở target 80) vì nó loại trước khi gọi, nhưng thời gian xấp xỉ nhau. Loại ở đầu hàm tốn một lời gọi rẻ cho mỗi ứng viên quá lớn; ở đây cái giá đó cũng rẻ cỡ phép so sánh. Vậy "sort + break" không phải phép màu: giá trị của nó là cho phép dừng <em>cả vòng lặp</em>, và điều đó quan trọng nhất khi mỗi nút có nhiều ứng viên và cây sâu.</li>
<li>Combination Sum II vốn đã phải sort (cho núm 4), nên ở đó <code>break</code> là miễn phí.</li>
</ul>
</div>

<div class="ml-en">
<h3>The hard knob: duplicates in the input, no duplicate answers</h3>
<p><strong>Subsets II (in our words).</strong> The array may contain equal values; return every subset, but never the same subset twice. For <code>[2, 1, 2]</code> the answer has 6 subsets, not 8. First, see the problem: the plain template on the sorted array <code>[1, 2, 2]</code>, then the fix, then the most common wrong fix.</p>
</div>
<div class="ml-vi">
<h3>Núm khó: đầu vào có trùng, đáp án không được trùng</h3>
<p><strong>Subsets II (diễn đạt lại).</strong> Mảng có thể có các giá trị bằng nhau; trả về mọi tập con, nhưng không bao giờ trả cùng một tập con hai lần. Với <code>[2, 1, 2]</code> đáp án có 6 tập con, không phải 8. Trước hết hãy THẤY vấn đề: khuôn thường chạy trên mảng đã sort <code>[1, 2, 2]</code>, rồi cách sửa, rồi cách sửa sai phổ biến nhất.</p>
</div>
${maHai('ch08/khu-trung.ts', 'ch08/KhuTrung.java', { vung: 'subsets-dup' })}
${ketQua('ch08/khu-trung.ts')}
<div class="ml-en">
<p>The naive line has <code>[1,2]</code> twice and <code>[2]</code> twice: one copy built with the first 2, one with the second. The rule that removes them: <strong>at one level of the tree, never start two branches with the same value.</strong> The first 2 at a level already explored "everything that starts with 2 here"; a second 2 at the same level would explore the exact same subtree again. But going <em>deeper</em> with the second 2 — choosing 2 and then 2 again — is a different subset (<code>[2,2]</code>) and must stay. That is why the condition is <code>i &gt; start</code>: <code>i == start</code> is the first candidate of this level and is always allowed, even if it equals the element just above it on the path.</p>
</div>
<div class="ml-vi">
<p>Dòng naive có <code>[1,2]</code> hai lần và <code>[2]</code> hai lần: một bản dựng bằng số 2 thứ nhất, một bản bằng số 2 thứ hai. Luật loại bỏ chúng: <strong>ở cùng một tầng của cây, không bao giờ mở hai nhánh bằng cùng một giá trị.</strong> Số 2 đầu tiên ở một tầng đã đi hết "mọi thứ bắt đầu bằng 2 ở đây"; số 2 thứ hai ở cùng tầng sẽ đi lại đúng cây con đó lần nữa. Nhưng đi <em>sâu xuống</em> bằng số 2 thứ hai — chọn 2 rồi lại chọn 2 — là một tập con khác (<code>[2,2]</code>) và phải giữ. Vì vậy điều kiện là <code>i &gt; start</code>: <code>i == start</code> là ứng viên đầu tiên của tầng này và luôn được phép, kể cả khi nó bằng phần tử ngay phía trên nó trên đường đi.</p>
</div>
${BANG_TRUNG}
<div class="ml-en">
<p>The table lists every event in order: six records and two skips. Row 5 is the skip under <code>[1]</code> (level start = 1): index 2 holds a 2, and index 1 at the same level already started a branch with 2, so the subtree <code>[1,2]…</code> is not walked again. Row 8 is the same thing at the root: the second 2 would rebuild <code>[2]</code> and <code>[2,2]</code>. Rows 3–4 and 6–7 show what the rule does <em>not</em> touch: <code>[1,2,2]</code> and <code>[2,2]</code> use index 2 at a deeper level, where it is the first candidate (<code>i == start</code>).</p>
${moPhong('ch08/khu-trung.sim.js', 'en', 'Subsets II: the tree and the two branches that are cut', 'Nodes ending in x are the skipped twins; the log explains each skip. Try [1,2,2,2] and count the cuts.')}
</div>
<div class="ml-vi">
<p>Bảng liệt kê mọi sự kiện theo thứ tự: sáu lần ghi và hai lần bỏ qua. Hàng 5 là lần bỏ dưới <code>[1]</code> (tầng có start = 1): chỉ số 2 chứa số 2, mà chỉ số 1 ở cùng tầng đã mở một nhánh bằng 2, nên cây con <code>[1,2]…</code> không bị đi lại. Hàng 8 là cùng chuyện đó ở gốc: số 2 thứ hai sẽ dựng lại <code>[2]</code> và <code>[2,2]</code>. Hàng 3–4 và 6–7 cho thấy luật này KHÔNG đụng tới đâu: <code>[1,2,2]</code> và <code>[2,2]</code> dùng chỉ số 2 ở một tầng sâu hơn, nơi nó là ứng viên đầu tiên (<code>i == start</code>).</p>
${moPhong('ch08/khu-trung.sim.js', 'vi', 'Subsets II: cái cây và hai nhánh bị cắt', 'Nút có đuôi x là anh em trùng bị bỏ; ô log giải thích từng lần bỏ. Thử [1,2,2,2] và đếm số nhát cắt.')}
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Writing <code>i &gt; 0</code> instead of <code>i &gt; start</code>.</strong></p><p>It looks like a harmless simplification and it compiles, but it also forbids going deeper with a twin:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Viết <code>i &gt; 0</code> thay vì <code>i &gt; start</code>.</strong></p><p>Trông như một chỗ rút gọn vô hại và vẫn biên dịch được, nhưng nó cấm luôn việc đi sâu xuống bằng anh em trùng:</p></div>
</div>
${maHai('ch08/khu-trung.ts', 'ch08/KhuTrung.java', { vung: 'sai-i-gt-0' })}
<div class="ml-en">
<p>Look again at the third output line: <code>i &gt; 0 [1,2,2]: [[],[1],[1,2],[2]]</code>. Two answers vanished, <code>[1,2,2]</code> and <code>[2,2]</code>, because the second 2 is skipped even when it is the first candidate of a deeper level. The output has no duplicates, so a quick glance says "looks deduplicated" — test with a case where the duplicate must be used twice.</p>
</div>
<div class="ml-vi">
<p>Nhìn lại dòng output thứ ba: <code>i &gt; 0 [1,2,2]: [[],[1],[1,2],[2]]</code>. Mất hai đáp án, <code>[1,2,2]</code> và <code>[2,2]</code>, vì số 2 thứ hai bị bỏ cả khi nó là ứng viên đầu tiên của một tầng sâu hơn. Output không có gì trùng, nên liếc nhanh sẽ thấy "khử trùng ổn rồi" — hãy test bằng một ca mà phần tử trùng buộc phải dùng hai lần.</p>
</div>

<div class="ml-en">
<h3>Combination Sum II: knobs 1, 2, 3 and 4 together</h3>
<p>Each candidate may be used once (next level from <code>i + 1</code>), the input may contain duplicates (skip a twin at the same level), record at remaining 0, and the sort needed for knob 4 gives knob 3's <code>break</code> for free. Notice the order of the two checks in the loop: the twin skip first, then the break. Swapping them is also correct here; what matters is that both run <em>before</em> the push.</p>
</div>
<div class="ml-vi">
<h3>Combination Sum II: núm 1, 2, 3 và 4 cùng lúc</h3>
<p>Mỗi ứng viên dùng tối đa một lần (tầng sau từ <code>i + 1</code>), đầu vào có thể trùng (bỏ anh em trùng ở cùng tầng), ghi khi phần còn lại bằng 0, và việc sort cần cho núm 4 cho luôn <code>break</code> của núm 3 miễn phí. Để ý thứ tự hai phép kiểm trong vòng lặp: bỏ anh em trùng trước, rồi mới break. Đổi chỗ chúng ở đây vẫn đúng; điều quan trọng là cả hai chạy <em>trước</em> lệnh push.</p>
</div>
${maHai('ch08/khu-trung.ts', 'ch08/KhuTrung.java', { vung: 'combo2' })}
<div class="ml-en">
<p>From the output above: <code>[10,1,2,7,6,1,5]</code> with target 8 gives four combinations, and <code>[1,1,6]</code> appears exactly once even though the input has two 1s — because using "both 1s" is going deeper, which is allowed, while starting a second branch with the other 1 is not.</p>
</div>
<div class="ml-vi">
<p>Từ output ở trên: <code>[10,1,2,7,6,1,5]</code> với target 8 cho bốn tổ hợp, và <code>[1,1,6]</code> xuất hiện đúng một lần dù đầu vào có hai số 1 — vì dùng "cả hai số 1" là đi sâu xuống, được phép, còn mở một nhánh thứ hai bằng số 1 kia thì không.</p>
</div>

<div class="ml-en">
<h3>Variant 1 — Letter Combinations of a Phone Number: a cartesian product</h3>
<p>Each digit 2–9 maps to 3 or 4 letters; return every string you can type. Level i is digit i; its choices are that digit's letters; record at the end. There is no start index and no skipping: every combination of one choice per level is valid. This shape — a list of lists of options, pick one from each — is called a <strong>cartesian product</strong>, and it is the most common backtracking you will write at work, as the SWT301 section below shows. Edge case: an empty input returns <code>[]</code>, not <code>[""]</code>.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Letter Combinations of a Phone Number: tích Đề-các</h3>
<p>Mỗi chữ số 2–9 ứng với 3 hoặc 4 chữ cái; trả về mọi chuỗi có thể gõ ra. Tầng i là chữ số i; lựa chọn là các chữ cái của chữ số đó; ghi ở cuối. Không có start, không có bỏ trùng: mọi tổ hợp "mỗi tầng một lựa chọn" đều hợp lệ. Hình dạng này — một danh sách các danh sách lựa chọn, mỗi danh sách chọn một — gọi là <strong>tích Đề-các</strong> (cartesian product), và là kiểu quay lui bạn sẽ viết nhiều nhất khi đi làm, như phần SWT301 bên dưới cho thấy. Ca biên: đầu vào rỗng trả <code>[]</code>, không phải <code>[""]</code>.</p>
</div>
${maHai('ch08/ngoac-chu.ts', 'ch08/NgoacChu.java', { vung: 'letters' })}

<div class="ml-en">
<h3>Variant 2 — Generate Parentheses: pruning with two counters</h3>
<p>Return every balanced string of n pairs of parentheses. The naive tree tries both characters at each of the 2n positions (2²ⁿ leaves) and filters at the end. The pruned tree only allows <code>(</code> while fewer than n are open, and <code>)</code> while there is an unmatched <code>(</code> — so it never builds an invalid prefix and every leaf is an answer. The table at the end of the output counts nodes for n = 1…10:</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Generate Parentheses: cắt nhánh bằng hai bộ đếm</h3>
<p>Trả về mọi chuỗi cân bằng gồm n cặp ngoặc. Cây ngây thơ thử cả hai ký tự ở mỗi vị trí trong 2n vị trí (2²ⁿ lá) rồi lọc ở cuối. Cây có cắt nhánh chỉ cho <code>(</code> khi số ngoặc mở còn ít hơn n, và <code>)</code> khi còn một <code>(</code> chưa được đóng — nên nó không bao giờ dựng một tiền tố sai và mọi lá đều là đáp án. Bảng cuối output đếm số nút với n = 1…10:</p>
</div>
${maHai('ch08/ngoac-chu.ts', 'ch08/NgoacChu.java', { vung: 'parens' })}
${ketQua('ch08/ngoac-chu.ts')}
<div class="ml-en">
<p>At n = 10, 2,097,151 nodes shrink to 82,499 — 25× fewer — and the gap widens with n. The number of answers (1, 2, 5, 14, 42, …) is the Catalan number C(n), about 4ⁿ / (n^1.5·√π), so the honest complexity is O(4ⁿ / √n) answers of length 2n. In the interview, "it is the n-th Catalan number" is a nice touch; "exponential, bounded by the number of valid strings times 2n" is the part you must say.</p>
</div>
<div class="ml-vi">
<p>Ở n = 10, 2.097.151 nút co lại còn 82.499 — ít hơn 25 lần — và khoảng cách càng lớn khi n tăng. Số đáp án (1, 2, 5, 14, 42, …) là số Catalan C(n), khoảng 4ⁿ / (n^1,5·√π), nên độ phức tạp trung thực là O(4ⁿ / √n) đáp án, mỗi đáp án dài 2n. Khi phỏng vấn, "đó là số Catalan thứ n" là điểm cộng; "hàm mũ, bị chặn bởi số chuỗi hợp lệ nhân 2n" là phần bạn bắt buộc phải nói.</p>
</div>

<div class="ml-en">
<h3>Variant 3 — Palindrome Partitioning: the choice is where the piece ends</h3>
<p>Split a string into pieces so that every piece is a palindrome; return every split. Level = the start position of the next piece; choices = every possible end position; prune any piece that is not a palindrome (it can never be fixed by later choices). The check would cost O(n) each time, so we precompute <code>pal[i][j]</code> once in O(n²) — a small dynamic-programming table inside a backtracking solution, which interviewers love as a follow-up. Worst case <code>"aaaa…a"</code>: every one of the n − 1 gaps can be cut or not, 2ⁿ⁻¹ partitions (the output confirms 32,768 for 16 letters).</p>
</div>
<div class="ml-vi">
<h3>Biến thể 3 — Palindrome Partitioning: lựa chọn là mảnh kết thúc ở đâu</h3>
<p>Tách một chuỗi thành các mảnh sao cho mỗi mảnh là palindrome (đọc xuôi ngược như nhau); trả về mọi cách tách. Tầng = vị trí bắt đầu của mảnh kế tiếp; lựa chọn = mọi vị trí kết thúc có thể; cắt mọi mảnh không phải palindrome (lựa chọn sau này không cứu được nó). Kiểm mỗi lần tốn O(n), nên ta tính trước <code>pal[i][j]</code> một lần trong O(n²) — một bảng quy hoạch động nhỏ nằm trong lời giải quay lui, câu hỏi nối tiếp người phỏng vấn rất thích. Trường hợp xấu nhất <code>"aaaa…a"</code>: mỗi khe trong n − 1 khe đều được cắt hoặc không, 2ⁿ⁻¹ cách tách (output xác nhận 32.768 với 16 chữ cái).</p>
</div>
${maHai('ch08/palindrome-partition.ts', 'ch08/PalindromePartition.java', { vung: 'partition' })}
${ketQua('ch08/palindrome-partition.ts')}

<div class="ml-en">
<h3>Where this pattern lives in real systems: test combinations (SWT301)</h3>
<p>"Test the login page on every browser, every OS, every role and both languages" is Letter Combinations with other labels. Backtracking lists the exhaustive suite in a few lines:</p>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật: tổ hợp test (SWT301)</h3>
<p>"Test trang đăng nhập trên mọi trình duyệt, mọi hệ điều hành, mọi vai trò và cả hai ngôn ngữ" chính là Letter Combinations với nhãn khác. Quay lui liệt kê bộ test vét cạn trong vài dòng:</p>
</div>
${ma('ch08/test-to-hop.ts', { vung: 'cartesian', nhan: 'TypeScript' })}
${ketQua('ch08/test-to-hop.ts')}
<div class="ml-en">
<p>54 cases for four small parameters, 1,024 for ten on/off switches — the product grows exactly like the trees of this chapter, and nobody runs that by hand. The SWT301 answer is <strong>pairwise testing</strong>: most bugs are triggered by one value or by an interaction of two, so cover every <em>pair</em> of values at least once. CT Work on this site has it: <code>generatePairwise()</code> and <code>allPairs()</code> in <code>src/services/work/testDesign.ts</code> (IPOG algorithm). Running that function on the same shapes gave 10 cases instead of 54 for 3·3·3·2, 11 instead of 1,024 for ten switches, and 28 instead of 4,096 for six parameters of four values, with every pair covered. Know both sides for an interview: generating all combinations is backtracking; deciding you should <em>not</em> run all of them is engineering.</p>
</div>
<div class="ml-vi">
<p>54 ca cho bốn tham số nhỏ, 1.024 ca cho mười công tắc bật/tắt — tích tăng đúng như các cái cây của chương này, và không ai chạy tay chừng đó. Câu trả lời của SWT301 là <strong>pairwise testing</strong> (kiểm thử theo cặp): phần lớn lỗi bị kích hoạt bởi một giá trị hoặc bởi tương tác của hai giá trị, nên chỉ cần phủ mọi <em>cặp</em> giá trị ít nhất một lần. CT Work trên chính trang này có sẵn: <code>generatePairwise()</code> và <code>allPairs()</code> trong <code>src/services/work/testDesign.ts</code> (thuật toán IPOG). Chạy hàm đó trên đúng các hình dạng này cho 10 ca thay vì 54 với 3·3·3·2, 11 thay vì 1.024 với mười công tắc, và 28 thay vì 4.096 với sáu tham số bốn giá trị, mọi cặp đều được phủ. Hãy biết cả hai mặt khi phỏng vấn: sinh mọi tổ hợp là quay lui; quyết định KHÔNG chạy hết chúng là kỹ năng kỹ sư.</p>
${lienKet({ bai: 'dsa-8-3-cat-nhanh', title: '8.3 — Cắt nhánh: N-Queens, Word Search, Sudoku', sub: 'Đo số nút có và không cắt nhánh; xếp lịch thi không trùng bằng quay lui', cta: 'Học tiếp' })}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: a password built from your life is a tiny cartesian product</h3>
<p>Password-guessing tools that "profile" a target (CUPP is a well-known open-source one) do exactly Variant 1: a list of name forms (cuong, Cuong, CUONG, cuongthai…), a list of years (1995…2010), a list of endings (!, @, 123, nothing), and every combination. Five name forms × 16 years × 4 endings is 320 guesses, not 26⁸ — the tree is tiny because each level has few choices. That is why the length rule alone is not enough: <code>Cuong2006!</code> is long but sits in that small tree. The registration route of this site asks for 12+ characters <em>and</em> an uppercase letter (<code>src/routes/auth.routes.ts</code>), but no rule can see that a password is your name and birth year. A password manager's random string has no such small tree.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: mật khẩu ghép từ đời bạn là một tích Đề-các bé xíu</h3>
<p>Các công cụ đoán mật khẩu kiểu "lập hồ sơ" một người (CUPP là một công cụ mã nguồn mở nổi tiếng) làm đúng Biến thể 1: một danh sách dạng tên (cuong, Cuong, CUONG, cuongthai…), một danh sách năm (1995…2010), một danh sách đuôi (!, @, 123, không gì), và mọi tổ hợp của chúng. Năm dạng tên × 16 năm × 4 đuôi là 320 lần đoán, không phải 26⁸ — cái cây bé xíu vì mỗi tầng có ít lựa chọn. Đó là lý do luật độ dài thôi chưa đủ: <code>Cuong2006!</code> dài nhưng nằm gọn trong cái cây nhỏ đó. Route đăng ký của trang này đòi từ 12 ký tự <em>và</em> có chữ hoa (<code>src/routes/auth.routes.ts</code>), nhưng không luật nào nhìn ra được mật khẩu là tên cộng năm sinh của bạn. Chuỗi ngẫu nhiên do trình quản lý mật khẩu sinh ra không có cái cây nhỏ nào như vậy.</p>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: Combination Sum II</h3>
${hoiThoai([
  ['I', 'Given candidate numbers, possibly with duplicates, and a target, return all unique combinations that sum to the target. Each number may be used once.'],
  ['C', 'Are all numbers positive? And by unique you mean [1,7] and [7,1] count as one, and two equal 1s must not produce [1,7] twice?'],
  ['N', 'Positivity matters: it is what makes "too big, break" valid. Restating "unique" shows you spotted the duplicate trap.'],
  ['I', 'All positive, yes, exactly.'],
  ['C', 'Then I will sort and backtrack. Path is the chosen numbers; the next level starts at i + 1 because each is used once; I record when the remaining sum is zero; since it is sorted, a value bigger than the remainder lets me break; and to avoid duplicate combinations I skip a value equal to the previous one at the same level — i greater than start, not greater than zero.'],
  ['N', 'The four knobs in one breath. Saying "i > start, not i > 0" pre-empts the most common bug.'],
  ['I', 'Why not just put the answers in a Set?'],
  ['C', 'It would be correct, but the search would still walk every duplicate subtree before discarding the result, and I would need to sort each answer to compare them. Skipping at the level never builds them.'],
  ['C', '(after coding) Testing [1,1,2] with target 3: sorted, root tries the first 1, then 1+2 is 3 — record. Back at the root, the second 1 is skipped, then 2 alone needs 1 more, nothing fits. One answer, [1,2]. And [1,1] with target 2 gives [1,1], so going deeper with a twin still works.'],
  ['I', 'Complexity?'],
  ['C', 'Exponential: in the worst case O(2ⁿ) subsets, each copied in O(n), plus O(n log n) for the sort. Pruning makes it much faster in practice but does not change the worst case.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: Combination Sum II</h3>
${hoiThoai([
  ['I', 'Cho các số ứng viên, có thể có số trùng, và một target, trả về mọi tổ hợp không trùng có tổng bằng target. Mỗi số dùng một lần.'],
  ['C', 'Các số đều dương ạ? Và "không trùng" nghĩa là [1,7] với [7,1] tính là một, còn hai số 1 bằng nhau không được sinh [1,7] hai lần đúng không ạ? <em>("Are all numbers positive? Two equal 1s must not produce [1,7] twice?")</em>'],
  ['N', 'Số dương là quan trọng: chính nó làm "quá lớn thì break" hợp lệ. Nhắc lại "không trùng" cho thấy bạn đã thấy cái bẫy.'],
  ['I', 'Đều dương, đúng vậy.'],
  ['C', 'Vậy em sort rồi quay lui. Đường đi là các số đã chọn; tầng sau bắt đầu từ i + 1 vì mỗi số dùng một lần; ghi khi phần còn lại bằng 0; vì đã sort nên gặp giá trị lớn hơn phần còn lại thì break; và để không trùng tổ hợp em bỏ qua giá trị bằng giá trị ngay trước ở cùng tầng — i lớn hơn start, không phải lớn hơn 0. <em>("Skip a value equal to the previous one at the same level — i greater than start.")</em>'],
  ['N', 'Bốn núm vặn trong một hơi. Nói "i > start, không phải i > 0" là chặn trước lỗi phổ biến nhất.'],
  ['I', 'Sao không bỏ hết đáp án vào một Set cho xong?'],
  ['C', 'Vẫn đúng, nhưng cuộc tìm kiếm vẫn phải đi hết mọi cây con trùng rồi mới vứt kết quả, và em phải sort từng đáp án để so. Bỏ ở tầng thì không bao giờ dựng chúng ra. <em>("Skipping at the level never builds them.")</em>'],
  ['C', '(code xong) Test [1,1,2] với target 3: sort xong, gốc thử số 1 đầu, rồi 1+2 bằng 3 — ghi. Về gốc, số 1 thứ hai bị bỏ, rồi riêng số 2 cần thêm 1, không còn gì vừa. Một đáp án, [1,2]. Và [1,1] với target 2 cho ra [1,1], nên đi sâu bằng anh em trùng vẫn chạy.'],
  ['I', 'Độ phức tạp?'],
  ['C', 'Hàm mũ: xấu nhất O(2ⁿ) tập con, mỗi cái chép O(n), cộng O(n log n) cho sort. Cắt nhánh làm nó nhanh hơn nhiều trong thực tế nhưng không đổi trường hợp xấu nhất. <em>("Pruning helps in practice but does not change the worst case.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li><code>i &gt; 0</code> instead of <code>i &gt; start</code> in the duplicate skip ⇒ answers that reuse a twin disappear.</li>
<li>Forgetting to sort before the skip rule or the <code>break</code> ⇒ equal values are not neighbours; <code>break</code> stops too early.</li>
<li>Recursing with <code>i + 1</code> in Combination Sum I (reuse allowed) or with <code>i</code> in II (once only).</li>
<li><code>continue</code> where <code>break</code> was possible ⇒ correct but 10× more loop checks (measured above).</li>
<li>Deduplicating with a Set of answers after the fact ⇒ slow, and in Java a <code>Set&lt;List&lt;Integer&gt;&gt;</code> only works if each list is in a canonical (sorted) order.</li>
<li>Letter Combinations: returning <code>[""]</code> for empty input.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li><code>i &gt; 0</code> thay vì <code>i &gt; start</code> trong luật bỏ trùng ⇒ mất các đáp án dùng lại anh em trùng.</li>
<li>Quên sort trước luật bỏ trùng hoặc trước <code>break</code> ⇒ các giá trị bằng nhau không nằm cạnh nhau; <code>break</code> dừng quá sớm.</li>
<li>Đệ quy với <code>i + 1</code> ở Combination Sum I (được dùng lại) hoặc với <code>i</code> ở bản II (chỉ một lần).</li>
<li>Dùng <code>continue</code> ở chỗ đã có thể <code>break</code> ⇒ đúng nhưng số vòng lặp nhiều gấp 10 (đo ở trên).</li>
<li>Khử trùng bằng một Set đáp án sau khi sinh ⇒ chậm, và trong Java <code>Set&lt;List&lt;Integer&gt;&gt;</code> chỉ đúng khi mỗi danh sách ở dạng chuẩn hoá (đã sort).</li>
<li>Letter Combinations: trả <code>[""]</code> khi đầu vào rỗng.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>LC 216 và LC 93 có lời giải Java trong bộ bài tập CSD201 CS.6 — làm bằng ngôn ngữ phỏng vấn của bạn trước, rồi mới mở ra so.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Write Combination Sum II from memory. Before coding, write one comment per knob (start, record, break, skip).</li>
<li>Change <code>i &gt; start</code> to <code>i &gt; 0</code> and find the smallest input where an answer disappears. Then change <code>bt(i + 1, …)</code> to <code>bt(i, …)</code> and explain the new output.</li>
<li>Draw the tree of <code>generateParenthesis(2)</code>: how many nodes does the pruned version visit? Check against the table (8).</li>
<li>Submit LC 39, LC 40 and LC 90.</li>
</ol>
<p><strong>Done when:</strong> three accepted submissions, a two-element counter-example for <code>i &gt; 0</code>, and the four knobs of each problem written in your notebook.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">combination</span><span class="v">A selection where order does not matter; generated by looking only forward from <code>start</code>.</span></div>
  <div class="kv"><span class="k">multiset</span><span class="v">A collection where values may repeat (Combination Sum's answers).</span></div>
  <div class="kv"><span class="k">same-level duplicate skip</span><span class="v">Sorted input, <code>i &gt; start &amp;&amp; a[i] == a[i − 1]</code> ⇒ do not open a second branch with that value.</span></div>
  <div class="kv"><span class="k">pruning</span><span class="v">Not exploring a branch that cannot lead to an answer (<code>break</code>, counters, validity checks).</span></div>
  <div class="kv"><span class="k">cartesian product</span><span class="v">Every way to pick one option from each list.</span></div>
  <div class="kv"><span class="k">Catalan number</span><span class="v">1, 2, 5, 14, 42…: the count of balanced parentheses strings, binary trees, and more.</span></div>
  <div class="kv"><span class="k">pairwise testing</span><span class="v">A test suite that covers every pair of parameter values at least once.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Four knobs: start at <code>i</code>/<code>i + 1</code>/<code>0</code>, when to record, when to break, how to skip duplicates.</li>
<li>Reuse allowed ⇒ <code>i</code>; once each ⇒ <code>i + 1</code>; order matters ⇒ <code>0</code> + <code>used[]</code>.</li>
<li>Duplicates in input: sort, skip a twin at the same level with <code>i &gt; start</code>; going deeper with a twin is allowed.</li>
<li>Sort + <code>break</code> saves the whole tail of the loop; measured, the win is mostly over sort + <code>continue</code>.</li>
<li>Keypad and test combinations are cartesian products; pairwise testing shrinks them in practice.</li>
<li>Generate Parentheses and Palindrome Partitioning prune with a rule per step: never build an invalid prefix.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Backtracking', 'Combination Sum I/II, Subsets II, Letter Combinations, Palindrome Partitioning in order, with videos', 'https://neetcode.io/roadmap')}
${nguon('📘', 'All-pairs testing — Wikipedia', 'Why covering every pair of values finds most interaction bugs with far fewer tests', 'https://en.wikipedia.org/wiki/All-pairs_testing')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Viết Combination Sum II không nhìn bài. Trước khi code, viết mỗi núm một dòng chú thích (start, ghi, break, bỏ trùng).</li>
<li>Đổi <code>i &gt; start</code> thành <code>i &gt; 0</code> và tìm đầu vào nhỏ nhất làm mất một đáp án. Rồi đổi <code>bt(i + 1, …)</code> thành <code>bt(i, …)</code> và giải thích output mới.</li>
<li>Vẽ cây của <code>generateParenthesis(2)</code>: bản có cắt nhánh đi qua bao nhiêu nút? So với bảng (8).</li>
<li>Nộp LC 39, LC 40 và LC 90.</li>
</ol>
<p><strong>Đạt khi:</strong> ba lượt nộp Accepted, một phản ví dụ hai phần tử cho <code>i &gt; 0</code>, và bốn núm vặn của từng đề được ghi vào sổ.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">combination (tổ hợp)</span><span class="v">Một cách chọn mà thứ tự không quan trọng; sinh bằng cách chỉ nhìn về phía trước từ <code>start</code>.</span></div>
  <div class="kv"><span class="k">multiset (đa tập, "túi")</span><span class="v">Tập mà giá trị được lặp lại (đáp án của Combination Sum).</span></div>
  <div class="kv"><span class="k">same-level duplicate skip (bỏ trùng cùng tầng)</span><span class="v">Đầu vào đã sort, <code>i &gt; start &amp;&amp; a[i] == a[i − 1]</code> ⇒ không mở nhánh thứ hai bằng giá trị đó.</span></div>
  <div class="kv"><span class="k">pruning (cắt nhánh)</span><span class="v">Không đi vào một nhánh không thể dẫn tới đáp án (<code>break</code>, bộ đếm, kiểm hợp lệ).</span></div>
  <div class="kv"><span class="k">cartesian product (tích Đề-các)</span><span class="v">Mọi cách chọn một phương án từ mỗi danh sách.</span></div>
  <div class="kv"><span class="k">Catalan number (số Catalan)</span><span class="v">1, 2, 5, 14, 42…: số chuỗi ngoặc cân bằng, số cây nhị phân, và nhiều thứ khác.</span></div>
  <div class="kv"><span class="k">pairwise testing (kiểm thử theo cặp)</span><span class="v">Bộ test phủ mọi cặp giá trị tham số ít nhất một lần.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bốn núm vặn: bắt đầu từ <code>i</code>/<code>i + 1</code>/<code>0</code>, khi nào ghi, khi nào break, bỏ trùng thế nào.</li>
<li>Được dùng lại ⇒ <code>i</code>; mỗi cái một lần ⇒ <code>i + 1</code>; thứ tự có nghĩa ⇒ <code>0</code> + <code>used[]</code>.</li>
<li>Đầu vào có trùng: sort, bỏ anh em trùng ở cùng tầng bằng <code>i &gt; start</code>; đi sâu xuống bằng anh em trùng thì được.</li>
<li>Sort + <code>break</code> bỏ được cả phần đuôi vòng lặp; đo thật thì thắng lớn chủ yếu so với sort + <code>continue</code>.</li>
<li>Bàn phím điện thoại và tổ hợp test là tích Đề-các; pairwise testing thu nhỏ chúng khi làm thật.</li>
<li>Generate Parentheses và Palindrome Partitioning cắt nhánh bằng một luật ở mỗi bước: không bao giờ dựng một tiền tố sai.</li>
</ul>
${lienKet({ bai: 'dsa-8-1-mau', title: '8.1 — Khuôn quay lui', sub: 'Ôn lại bốn câu hỏi và hai cái bẫy (tham chiếu, quên bỏ chọn) nếu bài này còn lấn cấn', cta: 'Ôn lại' })}
${nguon('📗', 'NeetCode roadmap — Backtracking', 'Combination Sum I/II, Subsets II, Letter Combinations, Palindrome Partitioning theo thứ tự, có video (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📘', 'All-pairs testing — Wikipedia', 'Vì sao phủ mọi cặp giá trị bắt được phần lớn lỗi tương tác với ít test hơn hẳn', 'https://en.wikipedia.org/wiki/All-pairs_testing')}
<p>Câu hỏi ôn: <a href="${baiNay('dsa-8-5-quiz')}">bài 8.5 — Quiz Chương 8</a>.</p>
</div>
`,
};
