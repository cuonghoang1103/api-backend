/** 4.4 — Bộ luyện 4: 8 đề tìm nhị phân có lời giải từng bước. Mã/output đọc từ ../ma/ch04/luyen (chạy thật). */
import { maHai, ketQua, oMang, bangVet, lc, nguon, gap, lienKet, baiNay } from '../_chung.mjs';
import { vetFirstTrue } from '../ma/ch04/nhi-phan.vet.mjs';

const S = [2, 2, 5, 6, 6, 9, 9, 12, 12];
const vs = vetFirstTrue(0, (S.length - 1) / 2, (q) => S[2 * q] !== S[2 * q + 1]);
const BANG_540 = bangVet(['round', 'pairs [lo, hi) · mid pair', 'a[2·mid], a[2·mid+1]', 'ok = different?', 'next [lo, hi)'],
  [...vs.hang.map((h) => [String(h.vong),
    oMang(S, { tu: 2 * h.lo, den: 2 * h.hi - 1, to: { [2 * h.mid]: 'r', [2 * h.mid + 1]: 'r' }, chiSo: true }),
    `${S[2 * h.mid]}, ${S[2 * h.mid + 1]}`, h.t ? 'T ⇒ hi = mid' : 'F ⇒ lo = mid + 1', `[${h.loMoi}, ${h.hiMoi})`]),
  ['end', oMang(S, { to: { [2 * vs.ketQua]: 'ok' }, chiSo: true }), '', 'lo == hi', `pair ${vs.ketQua} ⇒ a[${2 * vs.ketQua}] = ${S[2 * vs.ketQua]}`]]);

const DE = [
  [lc(69, 'sqrtx', 'Sqrt(x)', 'Easy'), 'Easy', '15′', 'last T on values (− 1 trick), overflow'],
  [lc(744, 'find-smallest-letter-greater-than-target', 'Find Smallest Letter Greater Than Target', 'Easy'), 'Easy', '15′', 'upper bound + wrap-around'],
  [lc(1539, 'kth-missing-positive-number', 'Kth Missing Positive Number', 'Easy'), 'Easy', '15′', 'search a computed array'],
  [lc(2300, 'successful-pairs-of-spells-and-potions', 'Successful Pairs of Spells and Potions', 'Medium'), 'Medium', '25′', 'sort once + many lower bounds'],
  [lc(540, 'single-element-in-a-sorted-array', 'Single Element in a Sorted Array', 'Medium'), 'Medium', '25′', 'search over pair indices'],
  [lc(981, 'time-based-key-value-store', 'Time Based Key-Value Store', 'Medium'), 'Medium', '25′', 'design + last ≤ t'],
  [lc(1552, 'magnetic-force-between-two-balls', 'Magnetic Force Between Two Balls', 'Medium'), 'Medium', '25′', 'answer space, maximise the minimum'],
  [lc(4, 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard'), 'Hard', '40′', 'binary search on a split point'],
];
const BANG_THU_TU = (vi) => `<table class="bang-de">\n<thead><tr><th>#</th><th>${vi ? 'Đề' : 'Problem'}</th><th>${vi ? 'Mức' : 'Level'}</th><th>${vi ? 'Mục tiêu' : 'Target'}</th><th>${vi ? 'Mẫu' : 'Pattern'}</th></tr></thead>\n<tbody>\n` +
  DE.map((d, i) => `<tr><td>${i + 1}</td><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td>${vi ? ['T cuối trên giá trị (mẹo − 1), tràn số', 'cận trên + quay vòng', 'tìm trên mảng tính ra', 'sắp một lần + nhiều lần lower bound', 'tìm trên chỉ số cặp', 'thiết kế + cuối cùng ≤ t', 'không gian đáp án, lớn nhất của nhỏ nhất', 'tìm nhị phân trên điểm chia'][i] : d[3]}</td></tr>`).join('\n') + `\n</tbody></table>`;

export default {
  title: '4.4 — Practice set 4: eight binary search problems, solved step by step|||4.4 — Bộ luyện 4: tám đề tìm nhị phân có lời giải từng bước',
  slug: 'dsa-4-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề dễ → khó phủ cả chương (Sqrt, chữ cái kế tiếp, số dương thiếu thứ k, phép thuật và thuốc, phần tử đơn, kho khoá-giá trị theo thời gian, lực từ giữa hai quả bóng, trung vị hai mảng) — mỗi đề gợi ý hai tầng, lời giải bằng đúng khuôn firstTrue, mã TS + Java chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4 · Practice set</span>
<h2>Practice set 4: eight binary search problems, solved step by step</h2>
<p class="lead">Eight problems from easy to hard that together cover every idea of the chapter: "last T" with the − 1 trick, upper bound with wrap-around, searching a computed array, many lower bounds after one sort, a search over pairs, a design problem, the answer space with "maximise the minimum", and the famous Hard — median of two sorted arrays — which turns out to be <em>the same template</em> once you find the right question. Every solution uses the unchanged <code>firstTrue</code> from lesson 4.1. That is the point: by the end, you should feel that each problem is only "which F/T row, which [lo, hi), what to do with lo".</p>
<h3>How to practise this page</h3>
<ul>
<li><strong>Time yourself</strong>: Easy 15 minutes, Medium 25, Hard 40, from reading the statement to an accepted submission.</li>
<li><strong>Say it out loud</strong> (or write it): the F/T row in words, the bounds, the complexity — before code.</li>
<li>Open <em>Hint 1</em> only after 5 minutes stuck, <em>Hint 2</em> after 10, the full solution only after you have submitted or the timer ran out.</li>
<li><strong>Submit on LeetCode</strong>, then compare your code with the one here: if yours has a different loop, rewrite it with the template.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4 · Bộ luyện</span>
<h2>Bộ luyện 4: tám đề tìm nhị phân có lời giải từng bước</h2>
<p class="lead">Tám đề từ dễ tới khó, gộp lại phủ mọi ý của chương: "T cuối cùng" bằng mẹo − 1, cận trên có quay vòng, tìm trên một mảng tính ra, nhiều lần lower bound sau một lần sắp, tìm trên các cặp, một đề thiết kế, không gian đáp án với "lớn nhất của nhỏ nhất", và đề Hard nổi tiếng — trung vị của hai mảng đã sắp — hoá ra là <em>cùng một khuôn</em> khi tìm đúng câu hỏi. Mọi lời giải dùng <code>firstTrue</code> của bài 4.1, không sửa một chữ. Đó chính là mục đích: tới cuối trang, bạn phải thấy mỗi đề chỉ còn là "hàng F/T nào, [lo, hi) nào, làm gì với lo".</p>
<h3>Cách luyện trang này</h3>
<ul>
<li><strong>Bấm giờ</strong>: Easy 15 phút, Medium 25, Hard 40, tính từ lúc đọc đề tới khi nộp Accepted.</li>
<li><strong>Nói to</strong> (hoặc viết ra): hàng F/T bằng lời, các cận, độ phức tạp — trước khi code.</li>
<li>Chỉ mở <em>Gợi ý 1</em> sau 5 phút bí, <em>Gợi ý 2</em> sau 10 phút, lời giải đầy đủ chỉ khi đã nộp hoặc hết giờ.</li>
<li><strong>Nộp trên LeetCode</strong>, rồi so code của bạn với code ở đây: nếu vòng lặp của bạn khác, viết lại bằng khuôn.</li>
</ul>
</div>

<div class="ml-en">
${BANG_THU_TU(false)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">What is searched?</span><span class="lz-d">An index, a value, a pair, a split point? Write "x = …".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">The F/T row</span><span class="lz-d">ok(x) in words, and one sentence for why it never goes back from T to F.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">[lo, hi)</span><span class="lz-d">hi = the "none" slot, or a value known to be T.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Interpret lo</span><span class="lz-d">The first T as is, or − 1 for the last F, or "is it really equal?".</span></div>
</div>
</div>
<div class="ml-vi">
${BANG_THU_TU(true)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đang tìm cái gì?</span><span class="lz-d">Một chỉ số, một giá trị, một cặp, một điểm chia? Viết "x = …".</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hàng F/T</span><span class="lz-d">ok(x) bằng lời, và một câu giải thích vì sao nó không bao giờ quay từ T về F.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">[lo, hi)</span><span class="lz-d">hi = ô "không có", hoặc một giá trị đã biết là T.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Diễn giải lo</span><span class="lz-d">T đầu tiên giữ nguyên, hoặc − 1 để lấy F cuối, hoặc "có thật sự bằng không?".</span></div>
</div>
</div>

<div class="ml-en">
<h3>1. ${lc(69, 'sqrtx', 'Sqrt(x)', 'Easy')}</h3>
<p><strong>Problem (in our words).</strong> Given a non-negative int x, return ⌊√x⌋ without any built-in power or square-root function. Example: x = 17 → 4 (4² = 16 ≤ 17 &lt; 25).</p>
<p><strong>Recognising the pattern.</strong> "The largest r with r² ≤ x" — a largest-such-that over a range of values, no array. "r² ≤ x" is T…T F…F, so ask the opposite, "r² &gt; x", and take the cell before its first T.</p>
${gap('💡 Hint 1', '<p>Which r are candidates? 0 up to x — but can you shrink that? √(2³¹ − 1) ≈ 46,340.95.</p>')}
${gap('💡 Hint 2', '<p>answer = firstTrue(0, hi, r ⇒ r·r &gt; x) − 1. In Java, what is 46,341 · 46,341 as an int?</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> The row "r·r &gt; x" over r = 0, 1, 2, … is F…F T…T. Its first T is the smallest r that is too big; one less is ⌊√x⌋. Bounds: lo = 0; hi = min(x, 46340) + 1, because no int has a square root above 46,340, and hi is a "one past" slot (for x = 0 and 1 the answer is x itself, and the formula still works: firstTrue(0, 1) − 1 = 0, firstTrue(0, 2) − 1 = 1). <strong>Overflow:</strong> in Java, <code>r * r</code> for r = 46,341 is 2,147,488,281 &gt; 2³¹ − 1 and wraps negative, so the comparison is done in <code>long</code>. Capping hi at 46,341 also keeps TypeScript exact. <strong>Complexity:</strong> O(log min(x, 46,341)) ≈ 16 rounds, O(1) space. <strong>Edge cases tested:</strong> 0, 1, perfect squares (4, 16), one below and above a square (15, 17), 2,147,395,599 (= 46,340² − 1) and 2³¹ − 1; plus every x up to 20,000 compared with <code>Math.sqrt</code>.</p>')}
</div>
<div class="ml-vi">
<h3>1. ${lc(69, 'sqrtx', 'Sqrt(x)', 'Easy')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho số nguyên không âm x, trả về ⌊√x⌋ (phần nguyên căn bậc hai) mà không dùng hàm luỹ thừa hay căn có sẵn. Ví dụ: x = 17 → 4 (4² = 16 ≤ 17 &lt; 25).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "r lớn nhất sao cho r² ≤ x" — một "lớn nhất sao cho" trên một khoảng giá trị, không có mảng. "r² ≤ x" có dạng T…T F…F, nên hỏi câu ngược lại, "r² &gt; x", rồi lấy ô ngay trước T đầu tiên của nó.</p>
${gap('💡 Gợi ý 1', '<p>Những r nào là ứng viên? Từ 0 tới x — nhưng thu hẹp được không? √(2³¹ − 1) ≈ 46.340,95.</p>')}
${gap('💡 Gợi ý 2', '<p>đáp án = firstTrue(0, hi, r ⇒ r·r &gt; x) − 1. Trong Java, 46.341 · 46.341 là bao nhiêu khi tính bằng int?</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Hàng "r·r &gt; x" trên r = 0, 1, 2, … có dạng F…F T…T. T đầu tiên là r nhỏ nhất đã quá lớn; trừ một là ⌊√x⌋. Cận: lo = 0; hi = min(x, 46340) + 1, vì không số int nào có căn lớn hơn 46.340, và hi là ô "ngay sau" (với x = 0 và 1 đáp án chính là x, công thức vẫn đúng: firstTrue(0, 1) − 1 = 0, firstTrue(0, 2) − 1 = 1). <strong>Tràn số:</strong> trong Java, <code>r * r</code> với r = 46.341 là 2.147.488.281 &gt; 2³¹ − 1 và quay thành số âm, nên phép so sánh làm bằng <code>long</code>. Chặn hi ở 46.341 cũng giữ TypeScript luôn chính xác. <strong>Độ phức tạp:</strong> O(log min(x, 46.341)) ≈ 16 vòng, bộ nhớ O(1). <strong>Ca biên đã thử:</strong> 0, 1, số chính phương (4, 16), ngay dưới và trên một số chính phương (15, 17), 2.147.395.599 (= 46.340² − 1) và 2³¹ − 1; cộng mọi x tới 20.000 so với <code>Math.sqrt</code>.</p>')}
</div>
${maHai('ch04/luyen/l1-sqrt.ts', 'ch04/luyen/L1Sqrt.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l1-sqrt.ts')}

<div class="ml-en">
<h3>2. ${lc(744, 'find-smallest-letter-greater-than-target', 'Find Smallest Letter Greater Than Target', 'Easy')}</h3>
<p><strong>Problem (in our words).</strong> A sorted array of lowercase letters (repeats allowed) and a target letter. Return the smallest letter strictly greater than the target; if there is none, wrap around and return the first letter. Example: <code>[b, e, e, h, q]</code>, target e → h; target q → b.</p>
<p><strong>Recognising the pattern.</strong> "Smallest strictly greater" is exactly upper bound — first index with letter &gt; target. The only new part is the wrap.</p>
${gap('💡 Hint 1', '<p>Write the row "letters[i] &gt; target" for target e: F F F T T. Where is the answer?</p>')}
${gap('💡 Hint 2', '<p>If the first T is n (no letter is greater), the answer is index 0. One operator handles both cases.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> i = firstTrue(0, n, k ⇒ letters[k] &gt; target); return letters[i % n]: when i &lt; n the modulo changes nothing, when i = n it becomes 0. The duplicates (e, e) do not matter: upper bound jumps past all of them, which is exactly why "&gt;" and not "≥". Letters compare like numbers in both languages (<code>&gt;</code> on strings of one char in TS, on <code>char</code> in Java). <strong>Complexity:</strong> O(log n), O(1). <strong>Edge cases tested:</strong> target before the first letter (a → b), equal to a repeated letter (e → h), equal to the last (q → b, wrap), after the last (z → b).</p>')}
</div>
<div class="ml-vi">
<h3>2. ${lc(744, 'find-smallest-letter-greater-than-target', 'Find Smallest Letter Greater Than Target', 'Easy')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một mảng chữ thường đã sắp (được lặp) và một chữ target. Trả về chữ nhỏ nhất lớn hơn hẳn target; nếu không có thì quay vòng, trả về chữ đầu tiên. Ví dụ: <code>[b, e, e, h, q]</code>, target e → h; target q → b.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Nhỏ nhất mà lớn hơn hẳn" chính là upper bound — chỉ số đầu tiên có chữ &gt; target. Phần mới duy nhất là quay vòng.</p>
${gap('💡 Gợi ý 1', '<p>Viết hàng "letters[i] &gt; target" với target e: F F F T T. Đáp án ở đâu?</p>')}
${gap('💡 Gợi ý 2', '<p>Nếu T đầu tiên là n (không chữ nào lớn hơn), đáp án là chỉ số 0. Một toán tử xử lý được cả hai trường hợp.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> i = firstTrue(0, n, k ⇒ letters[k] &gt; target); trả về letters[i % n]: khi i &lt; n phép chia lấy dư không đổi gì, khi i = n nó thành 0. Chữ lặp (e, e) không ảnh hưởng: upper bound nhảy qua hết chúng, đó chính là lý do dùng "&gt;" chứ không phải "≥". Chữ cái so sánh như số ở cả hai ngôn ngữ (<code>&gt;</code> trên chuỗi một ký tự trong TS, trên <code>char</code> trong Java). <strong>Độ phức tạp:</strong> O(log n), O(1). <strong>Ca biên đã thử:</strong> target trước chữ đầu (a → b), bằng một chữ bị lặp (e → h), bằng chữ cuối (q → b, quay vòng), sau chữ cuối (z → b).</p>')}
</div>
${maHai('ch04/luyen/l2-next-letter.ts', 'ch04/luyen/L2NextLetter.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l2-next-letter.ts')}

<div class="ml-en">
<h3>3. ${lc(1539, 'kth-missing-positive-number', 'Kth Missing Positive Number', 'Easy')}</h3>
<p><strong>Problem (in our words).</strong> A strictly increasing array of positive integers; return the k-th positive integer that is <em>not</em> in it. Example: <code>[3, 4, 7, 12, 13]</code> — missing are 1, 2, 5, 6, 8, 9, 10, 11, 14, … so k = 3 → 5.</p>
<p><strong>Recognising the pattern.</strong> An O(n) walk is the easy solution; the follow-up asks for better. The array is sorted, but you are not searching for a value in it. You need a <em>computed</em> array that is sorted: how many numbers are missing before position i.</p>
${gap('💡 Hint 1', '<p>If nothing were missing, arr[i] would be i + 1. So how many are missing before arr[i]?</p>')}
${gap('💡 Hint 2', '<p>missing(i) = arr[i] − (i + 1) never decreases. Find the first i with missing(i) ≥ k. How many array elements are below the answer then?</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> missing(i) = arr[i] − (i + 1) counts the positive integers smaller than arr[i] that are absent; for the example it is [2, 2, 4, 8, 8] — sorted, because the array is strictly increasing. The first i with missing(i) ≥ k means the k-th missing number lies before arr[i], and exactly i array elements are below it. So the answer is i + k: count k missing numbers plus the i present ones. If no such i exists, i = n and the answer is n + k — the same formula, no special case. <strong>Complexity:</strong> O(log n), O(1); we never build the missing array, we compute one cell per probe. <strong>Edge cases tested:</strong> answer before the first element (k = 1, 2), between elements, after the last (k = 9 → 14), and <code>[1, 2, 3]</code> with k = 2 → 5.</p>')}
</div>
<div class="ml-vi">
<h3>3. ${lc(1539, 'kth-missing-positive-number', 'Kth Missing Positive Number', 'Easy')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một mảng số nguyên dương tăng ngặt; trả về số nguyên dương thứ k <em>không</em> có trong mảng. Ví dụ: <code>[3, 4, 7, 12, 13]</code> — các số thiếu là 1, 2, 5, 6, 8, 9, 10, 11, 14, … nên k = 3 → 5.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đi một lượt O(n) là cách dễ; câu hỏi nối tiếp đòi tốt hơn. Mảng đã sắp, nhưng bạn không tìm một giá trị trong nó. Bạn cần một mảng <em>tính ra</em> (computed array) có thứ tự: có bao nhiêu số bị thiếu trước vị trí i.</p>
${gap('💡 Gợi ý 1', '<p>Nếu không thiếu số nào thì arr[i] sẽ là i + 1. Vậy trước arr[i] thiếu bao nhiêu số?</p>')}
${gap('💡 Gợi ý 2', '<p>missing(i) = arr[i] − (i + 1) không bao giờ giảm. Tìm i đầu tiên có missing(i) ≥ k. Khi đó có bao nhiêu phần tử của mảng nằm dưới đáp án?</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> missing(i) = arr[i] − (i + 1) đếm số nguyên dương nhỏ hơn arr[i] mà vắng mặt; với ví dụ là [2, 2, 4, 8, 8] — có thứ tự, vì mảng tăng ngặt. i đầu tiên có missing(i) ≥ k nghĩa là số thiếu thứ k nằm trước arr[i], và có đúng i phần tử của mảng nhỏ hơn nó. Nên đáp án là i + k: k số thiếu cộng i số có mặt. Nếu không có i như vậy thì i = n và đáp án là n + k — cùng công thức, không cần trường hợp riêng. <strong>Độ phức tạp:</strong> O(log n), O(1); ta không bao giờ dựng mảng missing, mỗi lần dò chỉ tính một ô. <strong>Ca biên đã thử:</strong> đáp án trước phần tử đầu (k = 1, 2), giữa các phần tử, sau phần tử cuối (k = 9 → 14), và <code>[1, 2, 3]</code> với k = 2 → 5.</p>')}
</div>
${maHai('ch04/luyen/l3-kth-missing.ts', 'ch04/luyen/L3KthMissing.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l3-kth-missing.ts')}

<div class="ml-en">
<h3>4. ${lc(2300, 'successful-pairs-of-spells-and-potions', 'Successful Pairs of Spells and Potions', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Two arrays of positive integers, spells (n of them) and potions (m), and a threshold. A pair is successful if spell · potion ≥ threshold. For each spell, return how many potions make a successful pair with it. Example: spells <code>[4, 1, 7]</code>, potions <code>[2, 9, 5, 1, 6]</code>, threshold 20 → <code>[3, 0, 3]</code>.</p>
<p><strong>Recognising the pattern.</strong> n · m pairs is 10¹⁰ at the limits — too many. Many questions against the same array is the classic signal for "sort once, binary search many times".</p>
${gap('💡 Hint 1', '<p>For one spell s, which potions work? If potion p works, does every bigger potion work?</p>')}
${gap('💡 Hint 2', '<p>Sort potions. Count = m − (first index j with s · potions[j] ≥ threshold).</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> For a fixed spell s, "s · p ≥ threshold" is monotone in p, so after sorting the potions the row is F…F T…T and every T is a success: count = m − firstTrue. Sorting costs O(m log m) once; each spell costs O(log m); total O((n + m) log m) instead of O(n · m). <strong>Overflow:</strong> s and p go up to 10⁵ and the threshold to 10¹⁰, so in Java the product is done in <code>long</code> (the code makes <code>s</code> a long before multiplying) and the threshold parameter is a long. Comparing with the product avoids division and its rounding question (the alternative is "p ≥ ceil(threshold / s)"). <strong>Edge cases tested:</strong> a spell with no success (1 → 0), the big-values line (10⁵ · 10⁵ = 10¹⁰ exactly reaches the threshold), and the brute force on the example.</p>')}
</div>
<div class="ml-vi">
<h3>4. ${lc(2300, 'successful-pairs-of-spells-and-potions', 'Successful Pairs of Spells and Potions', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Hai mảng số nguyên dương, spells (n phần tử, phép thuật) và potions (m phần tử, thuốc), và một ngưỡng. Một cặp thành công nếu spell · potion ≥ ngưỡng. Với mỗi spell, trả về số potion tạo cặp thành công với nó. Ví dụ: spells <code>[4, 1, 7]</code>, potions <code>[2, 9, 5, 1, 6]</code>, ngưỡng 20 → <code>[3, 0, 3]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> n · m cặp là 10¹⁰ ở giới hạn — quá nhiều. Nhiều câu hỏi trên cùng một mảng là tín hiệu kinh điển cho "sắp một lần, tìm nhị phân nhiều lần".</p>
${gap('💡 Gợi ý 1', '<p>Với một spell s, potion nào dùng được? Nếu potion p được thì mọi potion lớn hơn có được không?</p>')}
${gap('💡 Gợi ý 2', '<p>Sắp potions. Số lượng = m − (chỉ số j đầu tiên có s · potions[j] ≥ ngưỡng).</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Với spell s cố định, "s · p ≥ ngưỡng" đơn điệu theo p, nên sau khi sắp potions hàng có dạng F…F T…T và mọi T đều là thành công: số lượng = m − firstTrue. Sắp tốn O(m log m) một lần; mỗi spell tốn O(log m); tổng O((n + m) log m) thay vì O(n · m). <strong>Tràn số:</strong> s và p tới 10⁵, ngưỡng tới 10¹⁰, nên trong Java phép nhân làm bằng <code>long</code> (code đổi <code>s</code> sang long trước khi nhân) và tham số ngưỡng là long. So bằng phép nhân tránh được phép chia và câu hỏi làm tròn của nó (cách khác là "p ≥ ceil(ngưỡng / s)"). <strong>Ca biên đã thử:</strong> spell không có cặp nào (1 → 0), dòng giá trị lớn (10⁵ · 10⁵ = 10¹⁰ chạm đúng ngưỡng), và vét cạn trên ví dụ.</p>')}
</div>
${maHai('ch04/luyen/l4-spells.ts', 'ch04/luyen/L4Spells.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l4-spells.ts')}

<div class="ml-en">
<h3>5. ${lc(540, 'single-element-in-a-sorted-array', 'Single Element in a Sorted Array', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> A sorted array where every value appears exactly twice except one value that appears once. Find it in O(log n) time and O(1) space. Example: <code>[2, 2, 5, 6, 6, 9, 9, 12, 12]</code> → 5.</p>
<p><strong>Recognising the pattern.</strong> XOR of everything finds it in O(n) (Chapter 1, bit tricks); O(log n) needs a monotone question. The values themselves are not what you search — the <em>pairing</em> is.</p>
${gap('💡 Hint 1', '<p>Look at positions (0, 1), (2, 3), (4, 5)… Before the single element, what is true about each such pair? After it?</p>')}
${gap('💡 Hint 2', '<p>Search over pair indices p = 0 … (n − 1) / 2 with ok(p) = "a[2p] ≠ a[2p + 1]". The last pair index is a known T.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Before the single element, every pair starts on an even index: a[2p] = a[2p + 1]. The single element shifts everything after it by one, so from it on a[2p] ≠ a[2p + 1]. Over pair indices the row is F…F T…T, and the first T pair starts with the single element. There are (n − 1) / 2 full pairs; the index (n − 1) / 2 itself is the lonely last cell, a known T (if no earlier pair broke, the single one is the last element), so it is hi and is never read as a pair — no out-of-bounds at 2p + 1. Answer: a[2 · firstTrue]. <strong>Complexity:</strong> O(log n), O(1). <strong>Edge cases tested:</strong> one element, single at the start, at the end, in the middle.</p>')}
</div>
<div class="ml-vi">
<h3>5. ${lc(540, 'single-element-in-a-sorted-array', 'Single Element in a Sorted Array', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một mảng đã sắp trong đó mọi giá trị xuất hiện đúng hai lần trừ một giá trị chỉ xuất hiện một lần. Tìm nó trong O(log n) thời gian và O(1) bộ nhớ. Ví dụ: <code>[2, 2, 5, 6, 6, 9, 9, 12, 12]</code> → 5.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> XOR tất cả tìm ra nó trong O(n) (Chương 1, mẹo bit); O(log n) cần một câu hỏi đơn điệu. Thứ bạn tìm không phải bản thân các giá trị — mà là <em>cách ghép cặp</em>.</p>
${gap('💡 Gợi ý 1', '<p>Nhìn các vị trí (0, 1), (2, 3), (4, 5)… Trước phần tử đơn, điều gì đúng với mỗi cặp như vậy? Sau nó thì sao?</p>')}
${gap('💡 Gợi ý 2', '<p>Tìm trên chỉ số cặp p = 0 … (n − 1) / 2 với ok(p) = "a[2p] ≠ a[2p + 1]". Chỉ số cặp cuối cùng là một T đã biết.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Trước phần tử đơn, mọi cặp bắt đầu ở chỉ số chẵn: a[2p] = a[2p + 1]. Phần tử đơn đẩy mọi thứ phía sau lệch một ô, nên từ nó trở đi a[2p] ≠ a[2p + 1]. Trên chỉ số cặp hàng có dạng F…F T…T, và cặp T đầu tiên bắt đầu bằng chính phần tử đơn. Có (n − 1) / 2 cặp đầy đủ; chỉ số (n − 1) / 2 chính là ô lẻ loi cuối cùng, một T đã biết (nếu không cặp nào trước đó bị lệch thì phần tử đơn là phần tử cuối), nên nó là hi và không bao giờ bị đọc như một cặp — không ra ngoài mảng ở 2p + 1. Đáp án: a[2 · firstTrue]. <strong>Độ phức tạp:</strong> O(log n), O(1). <strong>Ca biên đã thử:</strong> một phần tử, phần tử đơn ở đầu, ở cuối, ở giữa.</p>')}
</div>
${maHai('ch04/luyen/l5-single.ts', 'ch04/luyen/L5Single.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l5-single.ts')}
<div class="ml-en">
<p>The search over pairs on the example, round by round (green = the cells of the pairs still in play, orange = the mid pair):</p>
</div>
<div class="ml-vi">
<p>Phép tìm trên các cặp với ví dụ, từng vòng (xanh = các ô thuộc những cặp còn đang xét, cam = cặp mid):</p>
</div>
${BANG_540}

<div class="ml-en">
<h3>6. ${lc(981, 'time-based-key-value-store', 'Time Based Key-Value Store', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Design a store with <code>set(key, value, timestamp)</code> and <code>get(key, timestamp)</code>: get returns the value set for that key at the largest timestamp ≤ the given one, or "" if none. Timestamps of set calls are strictly increasing. Example: price = 100k at t = 10, 120k at t = 20 ⇒ get(price, 19) = 100k, get(price, 5) = "".</p>
<p><strong>Recognising the pattern.</strong> "The value as of time t" is "the last entry with time ≤ t" — the subtitle question of lesson 4.1. The design part is noticing that the history of each key is <em>already sorted</em> for free, because timestamps only grow.</p>
${gap('💡 Hint 1', '<p>What structure per key? Do you need a TreeMap, or is an append-only list enough?</p>')}
${gap('💡 Hint 2', '<p>get = firstTrue(0, len, k ⇒ times[k] &gt; t) − 1; −1 means "nothing yet".</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> A hash map from key to two parallel lists (timestamps, values). set appends: O(1), and the lists stay sorted because timestamps strictly increase — say this assumption out loud, it is what makes the design simple. get runs upper bound on the timestamp list and steps back one: O(log h) for a key with h versions. Without the increasing-timestamp guarantee you would need a sorted structure (Java <code>TreeMap.floorEntry</code>) or an insertion in the middle. <strong>Edge cases tested:</strong> before the first set (""), exactly at a timestamp (≤, not &lt;), between, after the last, unknown key.</p><p><strong>Where it lives:</strong> this is how "configuration as of time t", price history in a shop, feature-flag audit logs and versioned documents are read. PostgreSQL MVCC answers "which row version is visible to my snapshot?" with the same idea.</p>')}
</div>
<div class="ml-vi">
<h3>6. ${lc(981, 'time-based-key-value-store', 'Time Based Key-Value Store', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Thiết kế một kho có <code>set(key, value, timestamp)</code> và <code>get(key, timestamp)</code>: get trả về giá trị được set cho khoá đó ở mốc thời gian lớn nhất ≤ mốc đã cho, không có thì "". Mốc thời gian của các lần set tăng ngặt. Ví dụ: giá = 100k lúc t = 10, 120k lúc t = 20 ⇒ get(giá, 19) = 100k, get(giá, 5) = "".</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Giá trị tại thời điểm t" là "mục cuối cùng có thời gian ≤ t" — đúng câu hỏi phụ đề của bài 4.1. Phần thiết kế là nhận ra lịch sử của mỗi khoá <em>tự nó đã sắp</em>, không tốn gì, vì mốc thời gian chỉ tăng.</p>
${gap('💡 Gợi ý 1', '<p>Mỗi khoá dùng cấu trúc gì? Cần TreeMap không, hay một danh sách chỉ thêm vào cuối là đủ?</p>')}
${gap('💡 Gợi ý 2', '<p>get = firstTrue(0, len, k ⇒ times[k] &gt; t) − 1; −1 nghĩa là "chưa có gì".</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Một hash map từ khoá tới hai danh sách song song (mốc thời gian, giá trị). set thêm vào cuối: O(1), và danh sách vẫn có thứ tự vì mốc thời gian tăng ngặt — hãy nói giả thiết này ra, chính nó làm thiết kế đơn giản. get chạy upper bound trên danh sách mốc thời gian rồi lùi một: O(log h) với khoá có h phiên bản. Không có đảm bảo mốc tăng dần thì bạn cần một cấu trúc có thứ tự (Java <code>TreeMap.floorEntry</code>) hoặc chèn vào giữa. <strong>Ca biên đã thử:</strong> trước lần set đầu (""), đúng bằng một mốc (≤, không phải &lt;), ở giữa, sau mốc cuối, khoá không tồn tại.</p><p><strong>Nó sống ở đâu:</strong> đây là cách đọc "cấu hình tại thời điểm t", lịch sử giá trong một cửa hàng, nhật ký thay đổi cờ tính năng (feature flag) và tài liệu có phiên bản. MVCC của PostgreSQL trả lời câu "phiên bản dòng nào nhìn thấy được với ảnh chụp (snapshot) của tôi?" bằng cùng ý tưởng.</p>')}
</div>
${maHai('ch04/luyen/l6-time-map.ts', 'ch04/luyen/L6TimeMap.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l6-time-map.ts')}

<div class="ml-en">
<h3>7. ${lc(1552, 'magnetic-force-between-two-balls', 'Magnetic Force Between Two Balls', 'Medium')}</h3>
<p><strong>Problem (in our words).</strong> Baskets sit at distinct positions on a line; put m balls into m different baskets so that the <em>smallest</em> distance between any two balls is as <em>large</em> as possible. Return that distance. Example: positions <code>[2, 3, 5, 9, 10]</code>, m = 3 → 3 (balls at 2, 5, 9).</p>
<p><strong>Recognising the pattern.</strong> "Maximise the minimum" over a range of distances, with an easy check — the answer space, in the reverse direction.</p>
${gap('💡 Hint 1', '<p>Given a gap g, can you decide in O(n) whether m balls fit with every gap ≥ g? (Sort first.)</p>')}
${gap('💡 Hint 2', '<p>canPlace(g) is T…T F…F. Search for the first g where it is impossible, then subtract one.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Sort the positions. canPlace(g): put a ball in the first basket, then greedily in the next basket at distance ≥ g from the last ball; count balls ≥ m? The greedy is optimal because placing a ball as early as possible never leaves less room for the rest. Monotone: if every gap can be ≥ g, it can certainly be ≥ g − 1, so canPlace is T…T F…F. Ask "is g impossible?" (F…F T…T) over [1, span + 1), where span = last − first and span + 1 is surely impossible for m ≥ 2; the answer is firstTrue − 1. No second template, no <code>mid</code> rounding up. <strong>Complexity:</strong> O(n log n) for sorting + O(n log span) for the search. <strong>Edge cases tested:</strong> m = 2 (answer = span), m = n (answer = smallest neighbour gap), positions up to 10⁹ (29 checks).</p>')}
</div>
<div class="ml-vi">
<h3>7. ${lc(1552, 'magnetic-force-between-two-balls', 'Magnetic Force Between Two Balls', 'Medium')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Các giỏ nằm ở những vị trí khác nhau trên một đường thẳng; đặt m quả bóng vào m giỏ khác nhau sao cho khoảng cách <em>nhỏ nhất</em> giữa hai quả bất kỳ là <em>lớn nhất</em> có thể. Trả về khoảng cách đó. Ví dụ: vị trí <code>[2, 3, 5, 9, 10]</code>, m = 3 → 3 (bóng ở 2, 5, 9).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Lớn nhất của nhỏ nhất" trên một khoảng các khoảng cách, với một hàm kiểm dễ — không gian đáp án, theo chiều ngược lại.</p>
${gap('💡 Gợi ý 1', '<p>Cho một khoảng cách g, có quyết định được trong O(n) rằng m quả bóng vừa với mọi khoảng cách ≥ g không? (Sắp trước.)</p>')}
${gap('💡 Gợi ý 2', '<p>canPlace(g) có dạng T…T F…F. Tìm g đầu tiên mà nó bất khả thi, rồi trừ một.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Sắp các vị trí. canPlace(g): đặt một quả vào giỏ đầu tiên, rồi tham lam đặt vào giỏ kế tiếp cách quả trước ≥ g; đếm được ≥ m quả không? Tham lam là tối ưu vì đặt một quả càng sớm càng tốt không bao giờ chừa ít chỗ hơn cho các quả còn lại. Đơn điệu: nếu mọi khoảng cách được ≥ g thì chắc chắn được ≥ g − 1, nên canPlace là T…T F…F. Hỏi "g có bất khả thi không?" (F…F T…T) trên [1, span + 1), với span = cuối − đầu và span + 1 chắc chắn bất khả thi khi m ≥ 2; đáp án là firstTrue − 1. Không khuôn thứ hai, không làm tròn <code>mid</code> lên. <strong>Độ phức tạp:</strong> O(n log n) để sắp + O(n log span) cho phép tìm. <strong>Ca biên đã thử:</strong> m = 2 (đáp án = span), m = n (đáp án = khoảng cách kề nhỏ nhất), vị trí tới 10⁹ (29 lần check).</p>')}
</div>
${maHai('ch04/luyen/l7-magnetic.ts', 'ch04/luyen/L7Magnetic.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l7-magnetic.ts')}

<div class="ml-en">
<h3>8. ${lc(4, 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard')}</h3>
<p><strong>Problem (in our words).</strong> Two sorted arrays A (size m) and B (size n), not both empty. Return the median of all m + n numbers in O(log(m + n)). Example: <code>[1, 4, 9]</code> and <code>[2, 3]</code> → all = 1, 2, 3, 4, 9 → 3; <code>[1, 4]</code> and <code>[2, 3]</code> → (2 + 3) / 2 = 2.5.</p>
<p><strong>Recognising the pattern.</strong> Merging is O(m + n) and is the right first answer. The required log means you must not look at most elements, so you search for <em>where to cut</em>: the median splits the combined sorted list into a left half and a right half.</p>
${gap('💡 Hint 1', '<p>Suppose the left half takes i elements from A and j from B, with i + j = half = ⌊(m + n + 1) / 2⌋. When is this split correct?</p>')}
${gap('💡 Hint 2', '<p>The split is correct when A[i − 1] ≤ B[j] and B[j − 1] ≤ A[i]. As i grows, A[i] grows and B[j − 1] shrinks — so "A[i] ≥ B[j − 1]" is F…F T…T in i. Search i over [0, m) in the SHORTER array; treat outside cells as −∞ / +∞.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>Thinking.</strong> Make A the shorter array. For a split i (elements A[0..i) go left) let j = half − i. Define ok(i) = A[i] ≥ B[j − 1], with A[m] = +∞ and B[−1] = −∞. Increasing i moves A[i] right (bigger) and B[j − 1] left (smaller), so ok is F…F T…T, and i = m is always T: <code>firstTrue(0, m, ok)</code>. At the first T, ok(i) gives B[j − 1] ≤ A[i]; ok(i − 1) being F gives A[i − 1] &lt; B[j]. Both conditions of a correct split hold. Then the left half’s largest element is max(A[i − 1], B[j − 1]); for odd m + n that is the median (half is rounded up, so the left half has the extra element), for even it is averaged with min(A[i], B[j]). <strong>Why j stays in range:</strong> m ≤ n gives 0 ≤ half − m and half ≤ n. <strong>Complexity:</strong> O(log min(m, n)), O(1). <strong>Edge cases tested:</strong> one array empty, all of A before all of B and the reverse, negatives, odd and even totals, plus 3,000 random cases against merge-and-sort.</p>')}
</div>
<div class="ml-vi">
<h3>8. ${lc(4, 'median-of-two-sorted-arrays', 'Median of Two Sorted Arrays', 'Hard')}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Hai mảng đã sắp A (m phần tử) và B (n phần tử), không cùng rỗng. Trả về trung vị (median) của cả m + n số trong O(log(m + n)). Ví dụ: <code>[1, 4, 9]</code> và <code>[2, 3]</code> → gộp = 1, 2, 3, 4, 9 → 3; <code>[1, 4]</code> và <code>[2, 3]</code> → (2 + 3) / 2 = 2,5.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Trộn hai mảng là O(m + n) và là câu trả lời đầu tiên đúng đắn. Yêu cầu log nghĩa là bạn không được nhìn phần lớn các phần tử, nên bạn tìm <em>chỗ cắt</em>: trung vị chia danh sách gộp đã sắp thành nửa trái và nửa phải.</p>
${gap('💡 Gợi ý 1', '<p>Giả sử nửa trái lấy i phần tử từ A và j phần tử từ B, với i + j = half = ⌊(m + n + 1) / 2⌋. Khi nào cách chia này đúng?</p>')}
${gap('💡 Gợi ý 2', '<p>Cách chia đúng khi A[i − 1] ≤ B[j] và B[j − 1] ≤ A[i]. Khi i tăng, A[i] tăng còn B[j − 1] giảm — nên "A[i] ≥ B[j − 1]" có dạng F…F T…T theo i. Tìm i trên [0, m) ở mảng NGẮN hơn; coi ô ngoài mảng là −∞ / +∞.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Cách nghĩ.</strong> Cho A là mảng ngắn hơn. Với một điểm chia i (A[0..i) sang trái) đặt j = half − i. Định nghĩa ok(i) = A[i] ≥ B[j − 1], với A[m] = +∞ và B[−1] = −∞. Tăng i làm A[i] dời sang phải (lớn hơn) và B[j − 1] dời sang trái (nhỏ hơn), nên ok có dạng F…F T…T, và i = m luôn là T: <code>firstTrue(0, m, ok)</code>. Tại T đầu tiên, ok(i) cho B[j − 1] ≤ A[i]; ok(i − 1) là F cho A[i − 1] &lt; B[j]. Cả hai điều kiện của một cách chia đúng đều thoả. Khi đó phần tử lớn nhất của nửa trái là max(A[i − 1], B[j − 1]); với m + n lẻ đó là trung vị (half làm tròn lên, nên nửa trái giữ phần tử dư), với chẵn thì lấy trung bình với min(A[i], B[j]). <strong>Vì sao j luôn hợp lệ:</strong> m ≤ n cho 0 ≤ half − m và half ≤ n. <strong>Độ phức tạp:</strong> O(log min(m, n)), O(1). <strong>Ca biên đã thử:</strong> một mảng rỗng, toàn bộ A đứng trước toàn bộ B và ngược lại, số âm, tổng lẻ và chẵn, cộng 3.000 ca ngẫu nhiên so với trộn rồi sắp.</p>')}
</div>
${maHai('ch04/luyen/l8-median.ts', 'ch04/luyen/L8Median.java', { vung: 'giai' })}
${ketQua('ch04/luyen/l8-median.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>LC 4: sentinels and integer division are where solutions break.</strong></p><p>Three classic failures: searching the <em>longer</em> array (then j = half − i goes negative), using <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> as ±∞ in Java when the arrays themselves may contain those values (the code uses <code>long</code> sentinels), and returning <code>(a + b) / 2</code> with two ints — integer division turns 2.5 into 2. Print the median with one decimal in tests so 2 and 2.5 cannot look alike.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>LC 4: lính canh (sentinel) và phép chia nguyên là chỗ lời giải hay gãy.</strong></p><p>Ba kiểu hỏng kinh điển: tìm trên mảng <em>dài</em> hơn (khi đó j = half − i thành số âm), dùng <code>Integer.MIN_VALUE</code>/<code>MAX_VALUE</code> làm ±∞ trong Java khi chính mảng có thể chứa các giá trị đó (code dùng lính canh kiểu <code>long</code>), và trả về <code>(a + b) / 2</code> với hai int — chia nguyên biến 2,5 thành 2. Khi test hãy in trung vị với một chữ số thập phân để 2 và 2,5 không thể trông giống nhau.</p></div>
</div>

<div class="ml-en">
<h3>🧪 Practice (one session ≈ 3 hours)</h3>
<div class="callout ok"><ol>
<li>Do problems 1–8 in order with the timer. For each, write the four lines (x, F/T row, [lo, hi), interpret lo) before coding.</li>
<li>After each accepted submission, compare your loop with the template; rewrite it if it differs.</li>
<li>For problem 8, explain the split condition to an imaginary interviewer in two minutes, out loud, before looking at Hint 2.</li>
<li>Write one notebook line per problem: <em>signal → question → complexity</em>, and one line for every bug you hit (off-by-one, overflow, wrong bound).</li>
</ol>
<p><strong>Done when:</strong> 8 accepted submissions, all with the identical <code>firstTrue</code> loop, Easy within 15′, Medium within 25′, and the bug log has an entry for every failed submission.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">computed array</span><span class="v">Values you can compute per index on demand (missing(i)) and search without building.</span></div>
  <div class="kv"><span class="k">wrap-around</span><span class="v">Index n maps back to 0: i % n.</span></div>
  <div class="kv"><span class="k">append-only log</span><span class="v">A list only ever extended at the end; sorted for free when keys only grow.</span></div>
  <div class="kv"><span class="k">split point / partition</span><span class="v">Where to cut two sorted arrays so every left element ≤ every right element.</span></div>
  <div class="kv"><span class="k">sentinel</span><span class="v">A fake ±∞ value for positions outside the array, to remove special cases.</span></div>
  <div class="kv"><span class="k">MVCC</span><span class="v">Multi-version concurrency control: a database keeps row versions and picks the one visible at a snapshot.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Eight problems, one loop: every difference is in ok(x), [lo, hi) and how lo is read.</li>
<li>"Largest such that" ⇒ first T of the opposite question − 1 (Sqrt, magnetic force, time map).</li>
<li>Sorted structure + many questions ⇒ sort once, binary search per question (spells).</li>
<li>Search what is monotone, not necessarily the values: missing counts, pairs, split points.</li>
<li>Java: long for products and sums, long sentinels; print decimals to catch integer division.</li>
</ul>
${nguon('📗', 'NeetCode roadmap — Binary Search', 'More problems in the same order, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'floorEntry / ceilingEntry: the library version of "last ≤ t" for LC 981 without increasing timestamps', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (một buổi ≈ 3 giờ)</h3>
<div class="callout ok"><ol>
<li>Làm đề 1–8 theo thứ tự, có bấm giờ. Mỗi đề viết bốn dòng (x, hàng F/T, [lo, hi), diễn giải lo) trước khi code.</li>
<li>Sau mỗi lượt nộp Accepted, so vòng lặp của bạn với khuôn; khác thì viết lại.</li>
<li>Với đề 8, giải thích điều kiện cắt cho một người phỏng vấn tưởng tượng trong hai phút, nói to, trước khi mở Gợi ý 2.</li>
<li>Mỗi đề ghi một dòng vào sổ: <em>dấu hiệu → câu hỏi → độ phức tạp</em>, và một dòng cho mỗi bug gặp phải (lệch một, tràn số, sai cận).</li>
</ol>
<p><strong>Đạt khi:</strong> 8 lượt nộp Accepted, tất cả dùng vòng <code>firstTrue</code> giống hệt nhau, Easy trong 15′, Medium trong 25′, và nhật ký lỗi có một dòng cho mỗi lần nộp hỏng.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">computed array (mảng tính ra)</span><span class="v">Giá trị tính được theo từng chỉ số khi cần (missing(i)) và tìm trên nó mà không phải dựng ra.</span></div>
  <div class="kv"><span class="k">wrap-around (quay vòng)</span><span class="v">Chỉ số n quay về 0: i % n.</span></div>
  <div class="kv"><span class="k">append-only log (nhật ký chỉ ghi thêm)</span><span class="v">Danh sách chỉ được nối vào cuối; tự có thứ tự khi khoá chỉ tăng.</span></div>
  <div class="kv"><span class="k">split point / partition (điểm chia)</span><span class="v">Chỗ cắt hai mảng đã sắp sao cho mọi phần tử bên trái ≤ mọi phần tử bên phải.</span></div>
  <div class="kv"><span class="k">sentinel (lính canh)</span><span class="v">Giá trị ±∞ giả cho vị trí ngoài mảng, để bỏ các trường hợp đặc biệt.</span></div>
  <div class="kv"><span class="k">MVCC (điều khiển đồng thời đa phiên bản)</span><span class="v">CSDL giữ nhiều phiên bản của một dòng và chọn phiên bản nhìn thấy được tại một ảnh chụp.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tám đề, một vòng lặp: mọi khác biệt nằm ở ok(x), [lo, hi) và cách đọc lo.</li>
<li>"Lớn nhất sao cho" ⇒ T đầu tiên của câu hỏi ngược − 1 (Sqrt, lực từ, kho theo thời gian).</li>
<li>Cấu trúc có thứ tự + nhiều câu hỏi ⇒ sắp một lần, mỗi câu hỏi một lần tìm nhị phân (spells).</li>
<li>Tìm trên thứ đơn điệu, không nhất thiết là chính các giá trị: số bị thiếu, cặp, điểm chia.</li>
<li>Java: long cho tích và tổng, lính canh long; in số thập phân để bắt lỗi chia nguyên.</li>
</ul>
${lienKet({ bai: 'dsa-4-1-co-ban', title: '4.1 — Khuôn firstTrue và bốn lỗi lệch một', sub: 'Quay lại nếu vòng lặp của bạn khác khuôn: bảng vết và bốn bản sai chạy thật', cta: 'Ôn lại' })}
${nguon('📗', 'NeetCode roadmap — Binary Search', 'Thêm đề theo cùng thứ tự, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📙', 'Java TreeMap (Java SE 21 API)', 'floorEntry / ceilingEntry: bản thư viện của "cuối cùng ≤ t" cho LC 981 khi mốc không tăng dần', 'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/TreeMap.html')}
<p>Làm xong bộ này thì vào <a href="${baiNay('dsa-4-5-quiz')}">bài 4.5 — Quiz Chương 4</a>.</p>
</div>
`,
};
