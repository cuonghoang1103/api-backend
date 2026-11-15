/** 8.4 — Bộ luyện 8: tám đề quay lui có lời giải từng bước. Mã/output đọc từ ../ma/ch08/luyen (chạy thật). */
import { maHai, ketQua, lc, nguon, gap, lienKet, baiNay } from '../_chung.mjs';

const DE = [
  [lc(1863, 'sum-of-all-subset-xor-totals', 'Sum of All Subset XOR Totals', 'Easy'), 'Easy', '15′', 'take / skip, carry a value down', 'lấy / bỏ, mang một giá trị xuống'],
  [lc(784, 'letter-case-permutation', 'Letter Case Permutation', 'Medium'), 'Medium', '25′', 'a level per character, 1 or 2 choices', 'mỗi ký tự một tầng, 1 hoặc 2 lựa chọn'],
  [lc(47, 'permutations-ii', 'Permutations II', 'Medium'), 'Medium', '25′', 'permutations + duplicates', 'hoán vị + phần tử trùng'],
  [lc(1079, 'letter-tile-possibilities', 'Letter Tile Possibilities', 'Medium'), 'Medium', '25′', 'choose by value (a count array), count every node', 'chọn theo giá trị (mảng đếm), đếm mọi nút'],
  [lc(1593, 'split-a-string-into-the-max-number-of-unique-substrings', 'Split a String Into the Max Number of Unique Substrings', 'Medium'), 'Medium', '25′', 'partition + Set + an upper bound', 'phân tách + Set + một cận trên'],
  [lc(1219, 'path-with-maximum-gold', 'Path with Maximum Gold', 'Medium'), 'Medium', '25′', 'grid DFS, mark and restore, keep the best', 'DFS lưới, đánh dấu rồi trả, giữ cái tốt nhất'],
  [lc(473, 'matchsticks-to-square', 'Matchsticks to Square', 'Medium'), 'Medium', '25′', 'k buckets with three prunings', 'k xô với ba nhát cắt'],
  [lc(282, 'expression-add-operators', 'Expression Add Operators', 'Hard'), 'Hard', '40′', 'two choices per level + undoing a product', 'hai lựa chọn mỗi tầng + hoàn tác một phép nhân'],
];
const BANG_THU_TU = (vi) => `<table class="bang-de">\n<thead><tr><th>#</th><th>${vi ? 'Đề' : 'Problem'}</th><th>${vi ? 'Mức' : 'Level'}</th><th>${vi ? 'Mục tiêu' : 'Target'}</th><th>${vi ? 'Mẫu' : 'Pattern'}</th></tr></thead>\n<tbody>\n` +
  DE.map((d, i) => `<tr><td>${i + 1}</td><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${vi ? d[4] : d[3]}</td></tr>`).join('\n') + `\n</tbody></table>`;

export default {
  title: '8.4 — Practice set 8: eight backtracking problems, solved step by step|||8.4 — Bộ luyện 8: tám đề quay lui có lời giải từng bước',
  slug: 'dsa-8-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề dễ → khó phủ cả chương (XOR mọi tập con, hoán vị chữ hoa/thường, hoán vị có trùng, đếm chuỗi từ quân chữ, tách chuỗi thành mảnh khác nhau, đường nhiều vàng nhất, xếp que diêm thành hình vuông, chèn toán tử) — mỗi đề hai tầng gợi ý, lời giải bốn câu hỏi, mã TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4 · Practice set</span>
<h2>Practice set 8: eight backtracking problems, solved step by step</h2>
<p class="lead">Eight problems from easy to hard that together cover every idea of the chapter: take/skip with a carried value, a level per character, duplicates in permutations, choosing by value with a count array, partitioning with an upper bound, a grid walk that keeps the best answer, buckets with three prunings, and the famous Hard "Expression Add Operators", where the undo is not a pop but an arithmetic correction. Every solution is written with the four questions of lesson 8.1 — path, choices, record, undo — so the difference between problems is in the answers, never in the shape of the code.</p>
<h3>How to practise this page</h3>
<ul>
<li><strong>Time yourself</strong>: Easy 15 minutes, Medium 25, Hard 40, from reading the statement to an accepted submission.</li>
<li><strong>Say it out loud</strong> (or write it): the four answers and the complexity, before code.</li>
<li>Open <em>Hint 1</em> only after 5 minutes stuck, <em>Hint 2</em> after 10, the full solution only after you have submitted or the timer ran out.</li>
<li><strong>Submit on LeetCode</strong>, then compare: if your recursion has a different shape, rewrite it with the template — the goal is one shape for every problem.</li>
</ul>
${BANG_THU_TU(false)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Path</span><span class="lz-d">What do I carry: a list, a string, a running value, the state of k buckets?</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Choices</span><span class="lz-d">At this level: take/skip, from start, any unused, any letter left, any end position, 4 directions.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Record</span><span class="lz-d">Every node, a leaf, a target hit, a best-so-far update — and copy if it is a list.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Undo + prune</span><span class="lz-d">What exactly is restored, and which cheap test stops a branch early.</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4 · Bộ luyện</span>
<h2>Bộ luyện 8: tám đề quay lui có lời giải từng bước</h2>
<p class="lead">Tám đề từ dễ tới khó, gộp lại phủ mọi ý của chương: lấy/bỏ có mang giá trị theo, mỗi ký tự một tầng, hoán vị có phần tử trùng, chọn theo giá trị bằng mảng đếm, phân tách có cận trên, đi lưới giữ đáp án tốt nhất, chia xô với ba nhát cắt, và đề Hard nổi tiếng "Expression Add Operators", nơi bước hoàn tác không phải một lệnh pop mà là một phép sửa số học. Mọi lời giải đều viết bằng bốn câu hỏi của bài 8.1 — đường đi, lựa chọn, ghi, hoàn tác — nên khác biệt giữa các đề nằm ở câu trả lời, không bao giờ nằm ở hình dạng code.</p>
<h3>Cách luyện trang này</h3>
<ul>
<li><strong>Bấm giờ</strong>: Easy 15 phút, Medium 25, Hard 40, tính từ lúc đọc đề tới khi nộp Accepted.</li>
<li><strong>Nói to</strong> (hoặc viết ra): bốn câu trả lời và độ phức tạp, trước khi code.</li>
<li>Chỉ mở <em>Gợi ý 1</em> sau 5 phút bí, <em>Gợi ý 2</em> sau 10 phút, lời giải đầy đủ chỉ sau khi đã nộp hoặc hết giờ.</li>
<li><strong>Nộp trên LeetCode</strong>, rồi so: nếu đệ quy của bạn có hình dạng khác, viết lại theo khuôn — mục tiêu là một hình dạng cho mọi đề.</li>
</ul>
${BANG_THU_TU(true)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đường đi</span><span class="lz-d">Mình mang theo gì: một danh sách, một chuỗi, một giá trị đang tích luỹ, trạng thái của k xô?</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Lựa chọn</span><span class="lz-d">Ở tầng này: lấy/bỏ, từ start, mọi cái chưa dùng, mọi chữ còn lại, mọi vị trí kết thúc, 4 hướng.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi</span><span class="lz-d">Mọi nút, ở lá, khi chạm đích, khi cập nhật "tốt nhất tới giờ" — và chép nếu là danh sách.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hoàn tác + cắt</span><span class="lz-d">Chính xác trả lại cái gì, và phép thử rẻ nào dừng một nhánh sớm.</span></div>
</div>
</div>

<div class="ml-en">
<h3>1. ${lc(1863, 'sum-of-all-subset-xor-totals', 'Sum of All Subset XOR Totals', 'Easy')}</h3>
<p><strong>Problem (in our words).</strong> The XOR total of a subset is the XOR of all its elements (0 for the empty one). Return the sum of the XOR totals of every subset. Example: <code>[1, 3]</code> → subsets <code>[], [1], [3], [1,3]</code> → 0 + 1 + 3 + 2 = 6. n ≤ 12.</p>
<p><strong>Recognising the pattern.</strong> "Every subset" and n ≤ 12 ⇒ 2¹² = 4,096 subsets, enumerate them. We do not need the subsets themselves, only a value computed along the way.</p>
${gap('💡 Hint 1', '<p>Use the take/skip tree of lesson 8.1. What do you need to know at a leaf to add its contribution?</p>')}
${gap('💡 Hint 2', '<p>Pass the running XOR down as a parameter: go(i, x) = go(i + 1, x ^ nums[i]) + go(i + 1, x). Nothing to undo — parameters are restored for free.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Four answers.</strong> Path: not stored — only the running XOR <code>x</code> is carried, as a parameter. Choices at level i: take nums[i] or skip it. Record: at a leaf, return x. Undo: none, because x is a value parameter, each call has its own copy — this is the cleanest way to avoid undo bugs. <strong>Complexity:</strong> 2ⁿ leaves, O(1) per node ⇒ O(2ⁿ) time, O(n) stack. <strong>Follow-up the interviewer may ask:</strong> an O(n) formula. Each bit that is set in at least one number is set in exactly half of the subsets XOR totals, so the answer is (OR of all numbers) × 2ⁿ⁻¹ — the program prints both and they agree on every test. <strong>Edge cases tested:</strong> one element, the examples, n = 6.</p>')}
</div>
<div class="ml-vi">
<h3>1. ${lc(1863, 'sum-of-all-subset-xor-totals', 'Sum of All Subset XOR Totals', 'Easy')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Tổng XOR của một tập con là XOR của mọi phần tử trong nó (tập rỗng là 0). Trả về tổng các tổng XOR của mọi tập con. Ví dụ: <code>[1, 3]</code> → các tập con <code>[], [1], [3], [1,3]</code> → 0 + 1 + 3 + 2 = 6. n ≤ 12.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mọi tập con" và n ≤ 12 ⇒ 2¹² = 4.096 tập con, liệt kê hết. Ta không cần chính các tập con, chỉ cần một giá trị tính dọc đường.</p>
${gap('💡 Gợi ý 1', '<p>Dùng cây lấy/bỏ của bài 8.1. Ở một lá bạn cần biết gì để cộng phần đóng góp của nó?</p>')}
${gap('💡 Gợi ý 2', '<p>Truyền XOR đang tích luỹ xuống bằng tham số: go(i, x) = go(i + 1, x ^ nums[i]) + go(i + 1, x). Không có gì để hoàn tác — tham số tự được trả lại.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Bốn câu trả lời.</strong> Đường đi: không lưu — chỉ mang XOR đang tích luỹ <code>x</code>, dưới dạng tham số. Lựa chọn ở tầng i: lấy nums[i] hoặc bỏ. Ghi: ở lá, trả về x. Hoàn tác: không cần, vì x là tham số giá trị, mỗi lời gọi có bản riêng — đây là cách gọn nhất để tránh lỗi hoàn tác. <strong>Độ phức tạp:</strong> 2ⁿ lá, mỗi nút O(1) ⇒ O(2ⁿ) thời gian, O(n) ngăn xếp. <strong>Câu hỏi nối tiếp có thể gặp:</strong> một công thức O(n). Mỗi bit có mặt trong ít nhất một số sẽ bật trong đúng một nửa số tổng XOR của các tập con, nên đáp án là (OR của mọi số) × 2ⁿ⁻¹ — chương trình in cả hai và chúng khớp ở mọi test. <strong>Ca biên đã thử:</strong> một phần tử, các ví dụ, n = 6.</p>')}
</div>
${maHai('ch08/luyen/l1-xor-subsets.ts', 'ch08/luyen/L1XorSubsets.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l1-xor-subsets.ts')}

<div class="ml-en">
<h3>2. ${lc(784, 'letter-case-permutation', 'Letter Case Permutation', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> A string of letters and digits; return every string obtained by changing the case of any of its letters. Example: <code>"a1b2"</code> → <code>"a1b2", "a1B2", "A1b2", "A1B2"</code>. Length ≤ 12.</p>
<p><strong>Recognising the pattern.</strong> "Every string you can get" ⇒ enumerate. Each position is an independent decision: a cartesian product like the phone keypad of lesson 8.2, where a letter offers 2 choices and a digit offers 1.</p>
${gap('💡 Hint 1', '<p>Level i = character i. How many choices does a digit have? A letter?</p>')}
${gap('💡 Hint 2', '<p>Work on a char array. Set position i to lower case, recurse; set it to upper case, recurse. Do you need to restore it afterwards?</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Four answers.</strong> Path: a char array, modified in place. Choices: a digit has one (recurse unchanged), a letter has two (lower, then upper). Record: at i = length, join the array. Undo: not needed here, and it is worth saying why — position i is overwritten by both branches before anything reads it, and the caller never reads positions ≥ i again. If you are not sure, restoring is never wrong. <strong>Complexity:</strong> with L letters there are 2^L strings of length n ⇒ O(n · 2^L); the program confirms 4,096 strings for 12 letters. <strong>Edge cases tested:</strong> all digits (one answer, itself), a single upper-case letter (lower first, then upper), letters only.</p>')}
</div>
<div class="ml-vi">
<h3>2. ${lc(784, 'letter-case-permutation', 'Letter Case Permutation', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một chuỗi gồm chữ cái và chữ số; trả về mọi chuỗi nhận được bằng cách đổi hoa/thường của các chữ cái bất kỳ. Ví dụ: <code>"a1b2"</code> → <code>"a1b2", "a1B2", "A1b2", "A1B2"</code>. Độ dài ≤ 12.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mọi chuỗi có thể nhận được" ⇒ liệt kê. Mỗi vị trí là một quyết định độc lập: một tích Đề-các như bàn phím điện thoại ở bài 8.2, trong đó chữ cái có 2 lựa chọn còn chữ số có 1.</p>
${gap('💡 Gợi ý 1', '<p>Tầng i = ký tự thứ i. Chữ số có mấy lựa chọn? Chữ cái thì sao?</p>')}
${gap('💡 Gợi ý 2', '<p>Làm trên mảng ký tự. Đặt vị trí i thành chữ thường, đệ quy; đặt thành chữ hoa, đệ quy. Sau đó có cần trả lại không?</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Bốn câu trả lời.</strong> Đường đi: một mảng ký tự, sửa tại chỗ. Lựa chọn: chữ số có một (đệ quy, giữ nguyên), chữ cái có hai (thường, rồi hoa). Ghi: khi i = độ dài, nối mảng lại. Hoàn tác: ở đây không cần, và nên nói rõ vì sao — vị trí i bị cả hai nhánh ghi đè trước khi có ai đọc nó, còn nơi gọi không bao giờ đọc lại các vị trí ≥ i. Nếu không chắc, trả lại thì không bao giờ sai. <strong>Độ phức tạp:</strong> có L chữ cái thì có 2^L chuỗi dài n ⇒ O(n · 2^L); chương trình xác nhận 4.096 chuỗi với 12 chữ cái. <strong>Ca biên đã thử:</strong> toàn chữ số (một đáp án, chính nó), một chữ hoa đơn lẻ (thường trước, hoa sau), toàn chữ cái.</p>')}
</div>
${maHai('ch08/luyen/l2-letter-case.ts', 'ch08/luyen/L2LetterCase.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l2-letter-case.ts')}

<div class="ml-en">
<h3>3. ${lc(47, 'permutations-ii', 'Permutations II', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> A list of numbers that may contain duplicates; return every <em>distinct</em> ordering. Example: <code>[1, 1, 2]</code> → <code>[1,1,2], [1,2,1], [2,1,1]</code> (3, not 3! = 6). n ≤ 8.</p>
<p><strong>Recognising the pattern.</strong> Permutations (lesson 8.1) + duplicates in the input (lesson 8.2's knob 4). But the "skip a twin at the same level" rule needs a different form, because permutations do not have a <code>start</code>.</p>
${gap('💡 Hint 1', '<p>Sort. Two equal values are interchangeable; the duplicates appear because the two copies can be placed in either order. Can you force one order?</p>')}
${gap('💡 Hint 2', '<p>Allow the second copy of a value only after the first copy is already on the path: skip i when a[i] == a[i − 1] and used[i − 1] is false.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> After sorting, equal values sit next to each other. If twins could appear on the path in any order, each arrangement of the twins would produce the same permutation again. Rule: a twin may be used only if the twin just before it is already used — so twins always enter the path in index order, and each distinct permutation is built exactly once. In code: <code>if (i &gt; 0 &amp;&amp; a[i] == a[i − 1] &amp;&amp; !used[i − 1]) continue;</code>. It is the same-level rule in disguise: when <code>used[i − 1]</code> is false, the previous twin was already tried in this very slot and then un-chosen, so trying a[i] here would repeat that whole subtree. <strong>Four answers:</strong> path + used[] (undo both), choices = any unused index passing the rule, record at length n. <strong>Complexity:</strong> O(n · n!) worst case (all distinct); far fewer leaves with many duplicates — [2,2,2] gives one. <strong>Edge cases tested:</strong> all equal, two pairs (4!/(2!·2!) = 6), all distinct (6).</p>')}
</div>
<div class="ml-vi">
<h3>3. ${lc(47, 'permutations-ii', 'Permutations II', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một danh sách số có thể có phần tử trùng; trả về mọi cách sắp thứ tự <em>khác nhau</em>. Ví dụ: <code>[1, 1, 2]</code> → <code>[1,1,2], [1,2,1], [2,1,1]</code> (3 cách, không phải 3! = 6). n ≤ 8.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Hoán vị (bài 8.1) + đầu vào có trùng (núm 4 của bài 8.2). Nhưng luật "bỏ anh em trùng ở cùng tầng" cần một dạng khác, vì hoán vị không có <code>start</code>.</p>
${gap('💡 Gợi ý 1', '<p>Sort. Hai giá trị bằng nhau là thay thế được cho nhau; đáp án trùng xuất hiện vì hai bản có thể đặt theo thứ tự nào cũng được. Bạn có ép được một thứ tự không?</p>')}
${gap('💡 Gợi ý 2', '<p>Chỉ cho bản thứ hai của một giá trị vào sau khi bản thứ nhất đã nằm trên đường đi: bỏ qua i khi a[i] == a[i − 1] và used[i − 1] là false.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Sau khi sort, các giá trị bằng nhau nằm cạnh nhau. Nếu các bản trùng được lên đường đi theo thứ tự nào cũng được, mỗi cách sắp các bản trùng lại sinh ra đúng hoán vị đó thêm một lần. Luật: một bản trùng chỉ được dùng nếu bản ngay trước nó đã được dùng — nên các bản trùng luôn vào đường đi theo thứ tự chỉ số, và mỗi hoán vị khác nhau được dựng đúng một lần. Trong code: <code>if (i &gt; 0 &amp;&amp; a[i] == a[i − 1] &amp;&amp; !used[i − 1]) continue;</code>. Đó chính là luật cùng tầng đội lốt: khi <code>used[i − 1]</code> là false, bản trùng trước đã được thử ở đúng vị trí này rồi bị bỏ chọn, nên thử a[i] ở đây sẽ lặp lại cả cây con đó. <strong>Bốn câu trả lời:</strong> path + used[] (hoàn tác cả hai), lựa chọn = mọi chỉ số chưa dùng qua được luật, ghi khi độ dài n. <strong>Độ phức tạp:</strong> xấu nhất O(n · n!) (khi mọi phần tử khác nhau); ít lá hơn hẳn khi có nhiều trùng — [2,2,2] chỉ có một. <strong>Ca biên đã thử:</strong> toàn bằng nhau, hai cặp (4!/(2!·2!) = 6), toàn khác nhau (6).</p>')}
</div>
${maHai('ch08/luyen/l3-perm-unique.ts', 'ch08/luyen/L3PermUnique.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l3-perm-unique.ts')}

<div class="ml-en">
<h3>4. ${lc(1079, 'letter-tile-possibilities', 'Letter Tile Possibilities', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> You have letter tiles (some letters repeated); count every non-empty sequence of letters you can lay out, using each tile at most once. Example: <code>"AAB"</code> → 8 (A, B, AA, AB, BA, AAB, ABA, BAA). Length ≤ 7.</p>
<p><strong>Recognising the pattern.</strong> Sequences (order matters) of any length, with duplicate tiles that must not double-count — Permutations II, but every node counts, not only leaves.</p>
${gap('💡 Hint 1', '<p>Instead of choosing a tile, choose a <em>letter</em>: keep a count of how many of each letter are left. Two identical tiles then cannot create two branches.</p>')}
${gap('💡 Hint 2', '<p>bt() returns how many sequences start from the current prefix: for each letter with count &gt; 0, take one, add 1 (the sequence ending here) + bt(), put it back.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Choosing by <em>value</em> instead of by <em>index</em> removes duplicates for free: with <code>cnt[A] = 2</code>, the choice "A" exists once per level no matter how many A tiles there are. That is a second way to deduplicate, and often simpler than the sort-and-skip rule. <strong>Four answers.</strong> Path: implicit (only counts matter). Choices: each letter with a remaining count. Record: every node except the root is a sequence — hence <code>1 + bt()</code> per choice. Undo: <code>cnt[c]++</code>. <strong>Complexity:</strong> bounded by the number of sequences, at most Σ n!/(n − k)! ≈ e·n! for distinct tiles; for n = 7 distinct tiles the program prints 13,699. <strong>Edge cases tested:</strong> one tile (1), the two LeetCode examples (8 and 188), all distinct (13,699).</p>')}
</div>
<div class="ml-vi">
<h3>4. ${lc(1079, 'letter-tile-possibilities', 'Letter Tile Possibilities', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn có các quân chữ (vài chữ lặp lại); đếm mọi dãy chữ không rỗng có thể xếp ra, mỗi quân dùng tối đa một lần. Ví dụ: <code>"AAB"</code> → 8 (A, B, AA, AB, BA, AAB, ABA, BAA). Độ dài ≤ 7.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Dãy (thứ tự có nghĩa) với độ dài bất kỳ, có quân trùng mà không được đếm đôi — chính là Permutations II, nhưng mọi nút đều được đếm, không chỉ lá.</p>
${gap('💡 Gợi ý 1', '<p>Thay vì chọn một quân, hãy chọn một <em>chữ</em>: giữ bộ đếm mỗi chữ còn bao nhiêu quân. Khi đó hai quân giống hệt nhau không thể tạo hai nhánh.</p>')}
${gap('💡 Gợi ý 2', '<p>bt() trả về số dãy bắt đầu bằng tiền tố hiện tại: với mỗi chữ còn đếm &gt; 0, lấy một quân, cộng 1 (dãy kết thúc ngay đây) + bt(), rồi trả quân lại.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Chọn theo <em>giá trị</em> thay vì theo <em>chỉ số</em> thì tự khử trùng: với <code>cnt[A] = 2</code>, lựa chọn "A" chỉ có một ở mỗi tầng dù có bao nhiêu quân A. Đó là cách khử trùng thứ hai, và thường gọn hơn luật sort-rồi-bỏ. <strong>Bốn câu trả lời.</strong> Đường đi: ngầm định (chỉ bộ đếm là quan trọng). Lựa chọn: mỗi chữ còn đếm. Ghi: mọi nút trừ gốc đều là một dãy — nên mỗi lựa chọn cộng <code>1 + bt()</code>. Hoàn tác: <code>cnt[c]++</code>. <strong>Độ phức tạp:</strong> bị chặn bởi số dãy, tối đa Σ n!/(n − k)! ≈ e·n! khi các quân khác nhau; với 7 quân khác nhau chương trình in 13.699. <strong>Ca biên đã thử:</strong> một quân (1), hai ví dụ của LeetCode (8 và 188), toàn khác nhau (13.699).</p>')}
</div>
${maHai('ch08/luyen/l4-tiles.ts', 'ch08/luyen/L4Tiles.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l4-tiles.ts')}

<div class="ml-en">
<h3>5. ${lc(1593, 'split-a-string-into-the-max-number-of-unique-substrings', 'Split a String Into the Max Number of Unique Substrings', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Split a string into non-empty pieces that are all different from each other; return the largest possible number of pieces. Example: <code>"ababccc"</code> → 5 (a, b, ab, c, cc). Length ≤ 16.</p>
<p><strong>Recognising the pattern.</strong> Palindrome Partitioning of lesson 8.2 with a different validity rule (piece not used before) and an optimisation goal (maximum) instead of "list all". n ≤ 16 ⇒ 2¹⁵ ways to cut, fine — but a bound makes it much faster.</p>
${gap('💡 Hint 1', '<p>Level = start of the next piece, choices = every end. Keep the pieces used so far in a Set; skip a piece already in it.</p>')}
${gap('💡 Hint 2', '<p>Upper bound: from position start, at best every remaining character becomes its own piece. If seen.size + (n − start) ≤ best, this branch cannot win.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Four answers.</strong> Path: the Set of pieces used. Choices: <code>end</code> from start + 1 to n; skip if the piece is in the Set. Record: at start = n, update <code>best</code> with the Set size. Undo: delete the piece from the Set (in Java, <code>seen.add</code> returns false when the piece is already there, which merges the check and the insert). <strong>Pruning by bound</strong>, the new idea of this problem: the most pieces a branch can still reach is <code>seen.size + (n − start)</code>; if that is not more than the best found, cut. The program measures it on 16 different letters: 65,536 calls without the bound, 137 with it — the very first path (every letter alone) already reaches 16, and the bound then kills almost every other branch at once. <strong>Complexity:</strong> O(2ⁿ · n) worst case (n − 1 gaps, each cut or not, substring cost n). <strong>Edge cases tested:</strong> "aa" → 1 (cannot split into a, a), the LeetCode examples, the 16-letter string.</p>')}
</div>
<div class="ml-vi">
<h3>5. ${lc(1593, 'split-a-string-into-the-max-number-of-unique-substrings', 'Split a String Into the Max Number of Unique Substrings', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Tách một chuỗi thành các mảnh không rỗng, đôi một khác nhau; trả về số mảnh lớn nhất có thể. Ví dụ: <code>"ababccc"</code> → 5 (a, b, ab, c, cc). Độ dài ≤ 16.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Palindrome Partitioning của bài 8.2 với luật hợp lệ khác (mảnh chưa từng dùng) và mục tiêu tối ưu (lớn nhất) thay vì "liệt kê hết". n ≤ 16 ⇒ 2¹⁵ cách cắt, chạy được — nhưng một cận làm nó nhanh hơn rất nhiều.</p>
${gap('💡 Gợi ý 1', '<p>Tầng = vị trí bắt đầu mảnh kế tiếp, lựa chọn = mọi vị trí kết thúc. Giữ các mảnh đã dùng trong một Set; bỏ qua mảnh đã có.</p>')}
${gap('💡 Gợi ý 2', '<p>Cận trên: từ vị trí start, tốt nhất là mỗi ký tự còn lại thành một mảnh riêng. Nếu seen.size + (n − start) ≤ best thì nhánh này không thể thắng.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Bốn câu trả lời.</strong> Đường đi: Set các mảnh đã dùng. Lựa chọn: <code>end</code> từ start + 1 tới n; bỏ nếu mảnh đã nằm trong Set. Ghi: khi start = n, cập nhật <code>best</code> bằng kích thước Set. Hoàn tác: xoá mảnh khỏi Set (trong Java, <code>seen.add</code> trả false khi mảnh đã có, gộp luôn phép kiểm và phép thêm). <strong>Cắt nhánh bằng cận</strong>, ý mới của đề này: số mảnh nhiều nhất một nhánh còn đạt được là <code>seen.size + (n − start)</code>; nếu con số đó không lớn hơn kỷ lục thì cắt. Chương trình đo trên 16 chữ cái khác nhau: 65.536 lời gọi khi không có cận, 137 khi có — đường đầu tiên (mỗi chữ một mảnh) đã đạt 16, và cận lập tức giết gần như mọi nhánh khác. <strong>Độ phức tạp:</strong> xấu nhất O(2ⁿ · n) (n − 1 khe, mỗi khe cắt hoặc không, cắt chuỗi tốn n). <strong>Ca biên đã thử:</strong> "aa" → 1 (không tách được thành a, a), các ví dụ LeetCode, chuỗi 16 chữ.</p>')}
</div>
${maHai('ch08/luyen/l5-split-unique.ts', 'ch08/luyen/L5SplitUnique.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l5-split-unique.ts')}

<div class="ml-en">
<h3>6. ${lc(1219, 'path-with-maximum-gold', 'Path with Maximum Gold', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> A grid where each cell holds some gold (0 = empty, cannot enter). Start anywhere with gold, move up/down/left/right, never revisit a cell on the same path, collect the gold of every cell you visit; return the maximum total. Example: <code>[[0,6,0],[5,8,7],[0,9,0]]</code> → 24 (9 → 8 → 7). At most 25 cells contain gold.</p>
<p><strong>Recognising the pattern.</strong> Word Search's grid DFS from lesson 8.3, but instead of "does a path exist", "which path is best": no early return, take the maximum over the four directions.</p>
${gap('💡 Hint 1', '<p>The same mark-and-restore as Word Search. What should dfs(r, c) return?</p>')}
${gap('💡 Hint 2', '<p>dfs(r, c) = gold here + max of dfs over the four neighbours, with the cell set to 0 while its neighbours are explored, then restored.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Four answers.</strong> Path: the cells currently zeroed in the grid. Choices: four directions. Record: the return value carries "best total from here", the outer loop keeps the global maximum over all starts. Undo: write the gold back. Setting the cell to 0 doubles as "visited" because 0 already means "cannot enter" — the grid is its own visited array. <strong>Why not memoise?</strong> The best path from a cell depends on which cells are already used, so (r, c) alone is not a state: this is genuinely exponential, and the limit of 25 gold cells is what makes it feasible (each step has at most 3 new directions). <strong>Edge cases tested:</strong> both LeetCode examples (24, 28) and a grid with no gold (0).</p>')}
</div>
<div class="ml-vi">
<h3>6. ${lc(1219, 'path-with-maximum-gold', 'Path with Maximum Gold', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một lưới mà mỗi ô có một lượng vàng (0 = trống, không được vào). Bắt đầu ở ô có vàng bất kỳ, đi lên/xuống/trái/phải, không quay lại ô nào trên cùng một đường, nhặt vàng của mọi ô đi qua; trả về tổng lớn nhất. Ví dụ: <code>[[0,6,0],[5,8,7],[0,9,0]]</code> → 24 (9 → 8 → 7). Tối đa 25 ô có vàng.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> DFS trên lưới của Word Search ở bài 8.3, nhưng thay vì "có tồn tại đường không", là "đường nào tốt nhất": không trả về sớm, lấy max qua bốn hướng.</p>
${gap('💡 Gợi ý 1', '<p>Đúng kiểu đánh dấu-rồi-trả của Word Search. dfs(r, c) nên trả về gì?</p>')}
${gap('💡 Gợi ý 2', '<p>dfs(r, c) = vàng ở đây + max của dfs qua bốn ô kề, ô hiện tại bị đặt thành 0 trong lúc đi các ô kề, rồi trả lại.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Bốn câu trả lời.</strong> Đường đi: các ô đang bị đặt thành 0 trong lưới. Lựa chọn: bốn hướng. Ghi: giá trị trả về mang "tổng tốt nhất từ đây", vòng ngoài giữ max chung qua mọi ô xuất phát. Hoàn tác: ghi vàng trở lại. Đặt ô thành 0 kiêm luôn "đã thăm" vì 0 vốn đã nghĩa là "không được vào" — lưới chính là mảng đã thăm của nó. <strong>Sao không ghi nhớ (memoise)?</strong> Đường tốt nhất từ một ô phụ thuộc vào những ô nào đã bị dùng, nên riêng (r, c) không phải là một trạng thái: bài này thật sự là hàm mũ, và giới hạn 25 ô có vàng là thứ làm nó chạy được (mỗi bước tối đa 3 hướng mới). <strong>Ca biên đã thử:</strong> hai ví dụ LeetCode (24, 28) và một lưới không có vàng (0).</p>')}
</div>
${maHai('ch08/luyen/l6-gold.ts', 'ch08/luyen/L6Gold.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l6-gold.ts')}

<div class="ml-en">
<h3>7. ${lc(473, 'matchsticks-to-square', 'Matchsticks to Square', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Matchstick lengths; can you form a square using every stick exactly once (sticks cannot be broken)? Example: <code>[1,1,2,2,2]</code> → true (sides 2, 2, 1+1, 2). n ≤ 15.</p>
<p><strong>Recognising the pattern.</strong> Assign each stick to one of 4 sides: 4ⁿ ≈ 10⁹ for n = 15 without pruning. A Medium only because three cheap prunings make it fast — this is the "buckets" pattern (also LC 698 with k buckets).</p>
${gap('💡 Hint 1', '<p>Quick rejections first: total not divisible by 4, or a stick longer than a side. Then level i = stick i, choices = the 4 sides that still have room.</p>')}
${gap('💡 Hint 2', '<p>Three prunings: sort the sticks longest first; if two sides currently have the same length, trying the second is identical to the first; if a stick failed on an empty side, it fails on every empty side.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Four answers.</strong> Path: the current length of the four sides. Choices: any side k where <code>sides[k] + stick ≤ side</code>. Record: all sticks placed ⇒ true (each side is then exactly <code>side</code>, because no side ever exceeded it and the total is 4·side). Undo: subtract the stick. <strong>Prunings, each with its reason.</strong> (1) Longest first: a long stick has few places to go, so impossible branches fail near the root instead of near the leaves — the "most constrained first" of Sudoku. (2) <code>sides[k] == sides[k − 1]</code> ⇒ skip: putting the stick on either of two equal sides leads to symmetric, identical subtrees — knob 4 of lesson 8.2 applied to buckets. (3) After undoing, if the side is back to 0 ⇒ <code>break</code>: all empty sides are interchangeable, so if an empty side could not complete the square, no other empty side can. <strong>Complexity:</strong> O(4ⁿ) worst case, tiny in practice. <strong>Edge cases tested:</strong> both LeetCode examples, 12 sticks forming 5+4+3 four times, and a 102-long stick that is longer than the side (29) — rejected before any search.</p>')}
</div>
<div class="ml-vi">
<h3>7. ${lc(473, 'matchsticks-to-square', 'Matchsticks to Square', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho độ dài các que diêm; có xếp được một hình vuông dùng mỗi que đúng một lần không (không bẻ que)? Ví dụ: <code>[1,1,2,2,2]</code> → true (các cạnh 2, 2, 1+1, 2). n ≤ 15.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Gán mỗi que vào một trong 4 cạnh: 4ⁿ ≈ 10⁹ với n = 15 nếu không cắt nhánh. Đề chỉ là Medium vì ba nhát cắt rẻ tiền làm nó nhanh — đây là mẫu "chia xô" (cũng là LC 698 với k xô).</p>
${gap('💡 Gợi ý 1', '<p>Loại nhanh trước: tổng không chia hết cho 4, hoặc có que dài hơn một cạnh. Rồi tầng i = que thứ i, lựa chọn = 4 cạnh còn chỗ.</p>')}
${gap('💡 Gợi ý 2', '<p>Ba nhát cắt: sort que dài trước; nếu hai cạnh đang dài bằng nhau thì thử cạnh thứ hai y hệt cạnh thứ nhất; nếu một que đặt vào một cạnh rỗng mà thất bại, nó thất bại ở mọi cạnh rỗng.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Bốn câu trả lời.</strong> Đường đi: độ dài hiện tại của bốn cạnh. Lựa chọn: mọi cạnh k có <code>sides[k] + que ≤ side</code>. Ghi: đặt hết que ⇒ true (khi đó mỗi cạnh đúng bằng <code>side</code>, vì không cạnh nào từng vượt và tổng là 4·side). Hoàn tác: trừ que ra. <strong>Các nhát cắt, mỗi nhát một lý do.</strong> (1) Que dài trước: que dài có ít chỗ đặt, nên nhánh bất khả thất bại gần gốc thay vì gần lá — chính là "ràng buộc nhiều nhất trước" của Sudoku. (2) <code>sides[k] == sides[k − 1]</code> ⇒ bỏ: đặt que vào một trong hai cạnh bằng nhau dẫn tới hai cây con đối xứng, y hệt nhau — núm 4 của bài 8.2 áp lên các xô. (3) Sau khi hoàn tác, nếu cạnh trở về 0 ⇒ <code>break</code>: mọi cạnh rỗng thay thế được cho nhau, nên nếu một cạnh rỗng không hoàn tất được hình vuông thì cạnh rỗng khác cũng không. <strong>Độ phức tạp:</strong> xấu nhất O(4ⁿ), thực tế rất nhỏ. <strong>Ca biên đã thử:</strong> hai ví dụ LeetCode, 12 que xếp thành 5+4+3 bốn lần, và một que dài 102 dài hơn cạnh (29) — bị loại trước khi tìm.</p>')}
</div>
${maHai('ch08/luyen/l7-matchsticks.ts', 'ch08/luyen/L7Matchsticks.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l7-matchsticks.ts')}

<div class="ml-en">
<h3>8. ${lc(282, 'expression-add-operators', 'Expression Add Operators', 'Hard')}</h3>
<p><strong>Problem (in our words).</strong> A string of digits and a target; insert <code>+</code>, <code>-</code> or <code>*</code> between digits (or nothing, to make multi-digit numbers) so that the expression evaluates to target with normal precedence. Return every such expression. Numbers must not have leading zeros. Example: <code>"123"</code>, 6 → <code>"1+2+3", "1*2*3"</code>. Length ≤ 10.</p>
<p><strong>Recognising the pattern.</strong> "Return all expressions" ⇒ backtracking. At each gap between digits there are 4 choices (+, −, ×, or glue), so about 4ⁿ⁻¹ expressions. The difficulty is not the search — it is evaluating with precedence <em>incrementally</em>, without building and parsing each string.</p>
${gap('💡 Hint 1', '<p>Choose the next number (digits i..j) and the operator before it. Keep the value of the expression so far. What goes wrong with "2+3*2" if you just do value * 2?</p>')}
${gap('💡 Hint 2', '<p>Also carry the last term (with its sign). For *: value − last + last · x, and the new last is last · x.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Left to right, + and − are easy: value ± x. Multiplication binds tighter: after "2+3" the value is 5, and "*2" must turn it into 2 + 3·2 = 8, not 5·2 = 10. So we carry <code>last</code>, the most recent term with its sign (3 here): undo it and put back the product, <code>value − last + last · x</code>; the new last term is <code>last · x</code> (so "2*3*4" keeps multiplying). This is the "unchoose" of this problem — an arithmetic correction instead of a pop, and everything else is carried as parameters so there is nothing else to undo. <strong>Four answers.</strong> Path: the expression string, value, last (all parameters). Choices: end index j of the next number × three operators (only the number for the first one). Record: at the end of the string, if value equals target. Prune: a number starting with 0 can only be "0" itself — <code>break</code> as soon as j &gt; i with a leading zero. <strong>Java detail:</strong> use <code>long</code>; "2147483648" alone does not fit in an int, and a product of two 5-digit pieces can exceed 2³¹ too. <strong>Complexity:</strong> O(4ⁿ · n) (4ⁿ expressions, O(n) to build each string). <strong>Edge cases tested:</strong> the LeetCode examples (including "105" where "1*05" must not appear), "00" with target 0 (three answers, no "00"), a 10-digit string with no answer, and the int-overflow case.</p>')}
</div>
<div class="ml-vi">
<h3>8. ${lc(282, 'expression-add-operators', 'Expression Add Operators', 'Hard')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một chuỗi chữ số và một target; chèn <code>+</code>, <code>-</code> hoặc <code>*</code> vào giữa các chữ số (hoặc không chèn gì, để ghép thành số nhiều chữ số) sao cho biểu thức có giá trị bằng target theo thứ tự ưu tiên thông thường. Trả về mọi biểu thức như vậy. Số không được có chữ số 0 đứng đầu. Ví dụ: <code>"123"</code>, 6 → <code>"1+2+3", "1*2*3"</code>. Độ dài ≤ 10.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Trả về mọi biểu thức" ⇒ quay lui. Ở mỗi khe giữa hai chữ số có 4 lựa chọn (+, −, ×, hoặc ghép liền), nên khoảng 4ⁿ⁻¹ biểu thức. Cái khó không nằm ở việc tìm — mà ở chỗ tính giá trị có thứ tự ưu tiên một cách <em>tăng dần</em> (incremental), không dựng rồi phân tích từng chuỗi.</p>
${gap('💡 Gợi ý 1', '<p>Chọn số kế tiếp (chữ số i..j) và toán tử đứng trước nó. Giữ giá trị của biểu thức tới giờ. "2+3*2" sẽ sai ở đâu nếu bạn chỉ làm value * 2?</p>')}
${gap('💡 Gợi ý 2', '<p>Mang thêm số hạng cuối (kèm dấu). Với *: value − last + last · x, và last mới là last · x.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Từ trái sang phải, + và − dễ: value ± x. Phép nhân ưu tiên hơn: sau "2+3" giá trị là 5, và "*2" phải biến nó thành 2 + 3·2 = 8, không phải 5·2 = 10. Vậy ta mang theo <code>last</code>, số hạng gần nhất kèm dấu (ở đây là 3): gỡ nó ra rồi đặt tích vào, <code>value − last + last · x</code>; số hạng cuối mới là <code>last · x</code> (để "2*3*4" nhân tiếp được). Đó chính là bước "bỏ chọn" của đề này — một phép sửa số học thay cho lệnh pop, còn mọi thứ khác đều là tham số nên không có gì khác phải hoàn tác. <strong>Bốn câu trả lời.</strong> Đường đi: chuỗi biểu thức, value, last (đều là tham số). Lựa chọn: vị trí kết thúc j của số kế tiếp × ba toán tử (số đầu tiên thì chỉ có số). Ghi: ở cuối chuỗi, nếu value bằng target. Cắt nhánh: một số bắt đầu bằng 0 chỉ được là chính "0" — <code>break</code> ngay khi j &gt; i mà có số 0 đứng đầu. <strong>Chi tiết Java:</strong> dùng <code>long</code>; riêng "2147483648" đã không vừa int, và tích của hai mảnh 5 chữ số cũng có thể vượt 2³¹. <strong>Độ phức tạp:</strong> O(4ⁿ · n) (4ⁿ biểu thức, O(n) để dựng mỗi chuỗi). <strong>Ca biên đã thử:</strong> các ví dụ LeetCode (kể cả "105" nơi "1*05" không được xuất hiện), "00" với target 0 (ba đáp án, không có "00"), một chuỗi 10 chữ số không có đáp án, và ca tràn int.</p>')}
</div>
${maHai('ch08/luyen/l8-add-operators.ts', 'ch08/luyen/L8AddOperators.java', { vung: 'giai' })}
${ketQua('ch08/luyen/l8-add-operators.ts')}
${ketQua('ch08/luyen/L8AddOperators.java')}

<div class="ml-en">
<h3>🧪 Practice (one session ≈ 3 hours)</h3>
<div class="callout ok"><ol>
<li>Do problems 1–8 in order, timed. For each, write the four answers (path, choices, record, undo + prune) before coding.</li>
<li>After each accepted submission, compare your recursion with the one here; if the shape differs, rewrite it with the template.</li>
<li>For problem 7, remove one pruning at a time and note which one makes LeetCode time out.</li>
<li>One notebook line per problem: <em>signal → four answers → complexity</em>, and one line per bug you hit (missing copy, missing undo, i &gt; 0, leading zero, int overflow).</li>
</ol>
<p><strong>Done when:</strong> 8 accepted submissions, Easy within 15′, Medium within 25′, and a bug log with one line per failed submission.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">value parameter</span><span class="v">State passed down by value (running XOR, value/last): each call has its own copy, nothing to undo.</span></div>
  <div class="kv"><span class="k">choose by value</span><span class="v">Branch on distinct values with a count array instead of on indices: duplicates disappear by construction.</span></div>
  <div class="kv"><span class="k">upper bound (branch and bound)</span><span class="v">The best a branch could still achieve; cut it when that cannot beat the best found.</span></div>
  <div class="kv"><span class="k">symmetry breaking</span><span class="v">Skipping branches that are mirror images of one already tried (equal buckets, empty buckets).</span></div>
  <div class="kv"><span class="k">incremental evaluation</span><span class="v">Updating the value of a partial expression in O(1) per step instead of re-evaluating it.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Every problem is the same shape; only the four answers change.</li>
<li>Carry values as parameters when you can: no undo, no undo bugs.</li>
<li>Two ways to deduplicate: sort + skip a twin at the level, or branch on values with a count array.</li>
<li>Optimisation problems prune with a bound (pieces left) and with symmetry (equal or empty buckets).</li>
<li>Hard problems hide the difficulty in the undo: here, an arithmetic correction for multiplication.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Backtracking', 'More problems in the same order, with video solutions', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một buổi ≈ 3 giờ)</h3>
<div class="callout ok"><ol>
<li>Làm đề 1–8 theo thứ tự, có bấm giờ. Mỗi đề viết bốn câu trả lời (đường đi, lựa chọn, ghi, hoàn tác + cắt) trước khi code.</li>
<li>Sau mỗi lượt nộp Accepted, so đệ quy của bạn với bản ở đây; khác hình dạng thì viết lại theo khuôn.</li>
<li>Với đề 7, lần lượt bỏ từng nhát cắt và ghi lại nhát nào làm LeetCode báo quá giờ.</li>
<li>Mỗi đề một dòng vào sổ: <em>dấu hiệu → bốn câu trả lời → độ phức tạp</em>, và mỗi lỗi gặp phải một dòng (thiếu bản sao, thiếu hoàn tác, i &gt; 0, số 0 đứng đầu, tràn int).</li>
</ol>
<p><strong>Đạt khi:</strong> 8 lượt nộp Accepted, Easy trong 15′, Medium trong 25′, và nhật ký lỗi có một dòng cho mỗi lần nộp hỏng.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">value parameter (tham số giá trị)</span><span class="v">Trạng thái truyền xuống theo giá trị (XOR đang tích luỹ, value/last): mỗi lời gọi có bản riêng, không cần hoàn tác.</span></div>
  <div class="kv"><span class="k">choose by value (chọn theo giá trị)</span><span class="v">Rẽ nhánh theo các giá trị khác nhau bằng mảng đếm thay vì theo chỉ số: phần tử trùng tự biến mất.</span></div>
  <div class="kv"><span class="k">upper bound / branch and bound (cận trên / nhánh và cận)</span><span class="v">Mức tốt nhất một nhánh còn có thể đạt; cắt khi nó không thể vượt kỷ lục.</span></div>
  <div class="kv"><span class="k">symmetry breaking (phá đối xứng)</span><span class="v">Bỏ những nhánh là ảnh gương của một nhánh đã thử (xô bằng nhau, xô rỗng).</span></div>
  <div class="kv"><span class="k">incremental evaluation (tính tăng dần)</span><span class="v">Cập nhật giá trị của biểu thức dang dở trong O(1) mỗi bước thay vì tính lại từ đầu.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi đề có cùng một hình dạng; chỉ bốn câu trả lời thay đổi.</li>
<li>Mang giá trị bằng tham số khi được: không phải hoàn tác, không có lỗi hoàn tác.</li>
<li>Hai cách khử trùng: sort + bỏ anh em trùng ở cùng tầng, hoặc rẽ nhánh theo giá trị với mảng đếm.</li>
<li>Đề tối ưu cắt nhánh bằng cận (số mảnh còn lại) và bằng đối xứng (xô bằng nhau hoặc rỗng).</li>
<li>Đề Hard giấu cái khó trong bước hoàn tác: ở đây là một phép sửa số học cho phép nhân.</li>
</ul>
${lienKet({ bai: 'dsa-8-3-cat-nhanh', title: '8.3 — Cắt nhánh', sub: 'Quay lại nếu đề 6–7 còn khó: N-Queens, Word Search và Sudoku với số nút đo thật', cta: 'Ôn lại' })}
${nguon('📗', 'NeetCode roadmap — Backtracking', 'Thêm đề theo cùng thứ tự, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
<p>Làm xong bộ này thì vào <a href="${baiNay('dsa-8-5-quiz')}">bài 8.5 — Quiz Chương 8</a>.</p>
</div>
`,
};
