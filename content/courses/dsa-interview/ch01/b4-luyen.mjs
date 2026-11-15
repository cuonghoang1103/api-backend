/** 1.5 — Bộ luyện 1: tám đề có lời giải từng bước. Mọi mã/output đọc từ ../ma/ch01/luyen-* và Luyen*.java (chạy thật bằng _chay.mjs, Node 26 + Java 21). */
import { maHai, ma, ketQua, oMang, bangVet, lc, moPhong, nguon, gap, baiNay } from '../_chung.mjs';
import { vet523 } from '../ma/ch01/luyen-523.vet.mjs';

const N523 = [2, 5, 3, 0, 4];
const K523 = 6;
const vet = vet523(N523, K523);
const BANG = bangVet(['i', 'nums', 'nums[i]', 'remainder', 'first (before)', 'result'],
  vet.map((h) => [
    String(h.i),
    oMang(N523, {
      to: h.kq === 'ok' ? Object.fromEntries(N523.map((_, t) => [t, t > h.j && t <= h.i ? 'ok' : null]).filter((e) => e[1]))
        : h.kq === 'ngan' ? { [h.i]: 'x' } : { [h.i]: 'l' },
    }),
    String(h.x),
    String(h.rem),
    `<code>${h.truoc}</code>`,
    h.kq === 'moi' ? `new ⇒ first.set(${h.rem}, ${h.i})`
      : h.kq === 'ngan' ? `seen @ ${h.j}, length ${h.i - h.j} &lt; 2 ⇒ keep ${h.j}`
        : `✅ seen @ ${h.j}, length ${h.i - h.j} ⇒ true`,
  ]));

const L = {
  p1: lc(219, 'contains-duplicate-ii', 'Contains Duplicate II', 'Easy'),
  p2: lc(1413, 'minimum-value-to-get-positive-step-by-step-sum', 'Minimum Value to Get Positive Step by Step Sum', 'Easy'),
  p3: lc(389, 'find-the-difference', 'Find the Difference', 'Easy'),
  p4: lc(1679, 'max-number-of-k-sum-pairs', 'Max Number of K-Sum Pairs', 'Medium'),
  p5: lc(523, 'continuous-subarray-sum', 'Continuous Subarray Sum', 'Medium'),
  p6: lc(1029, 'two-city-scheduling', 'Two City Scheduling', 'Medium'),
  p7: lc(137, 'single-number-ii', 'Single Number II', 'Medium'),
  p8: lc(1074, 'number-of-submatrices-that-sum-to-target', 'Number of Submatrices That Sum to Target', 'Hard'),
};
const B11 = baiNay('dsa-1-1-hash-map');
const B12 = baiNay('dsa-1-2-prefix-sum');
const B13 = baiNay('dsa-1-3-sap-xep');
const B14 = baiNay('dsa-1-5-bit');

const THU_TU = (lang) => {
  const en = lang === 'en';
  const rows = [
    [L.p1, en ? 'hash map: value → last index' : 'hash map: giá trị → chỉ số gần nhất', B11, '1.1', 'Easy', '15′'],
    [L.p2, en ? 'prefix sum: lowest running total' : 'tổng tiền tố: tổng chạy thấp nhất', B12, '1.2', 'Easy', '15′'],
    [L.p3, en ? 'XOR cancels pairs (or count 26)' : 'XOR triệt tiêu từng cặp (hoặc đếm 26)', B14, '1.4', 'Easy', '15′'],
    [L.p4, en ? 'hash map with counts (or sort + two pointers)' : 'hash map đếm (hoặc sắp xếp + hai con trỏ)', B11, '1.1 / 1.3', 'Medium', '25′'],
    [L.p5, en ? 'prefix remainders + FIRST index' : 'số dư tiền tố + chỉ số ĐẦU TIÊN', B12, '1.2', 'Medium', '25′'],
    [L.p6, en ? 'sort by a custom key, then split' : 'sắp xếp theo khoá tự chọn rồi chia đôi', B13, '1.3', 'Medium', '25′'],
    [L.p7, en ? 'count each bit mod 3' : 'đếm từng bit theo mod 3', B14, '1.4', 'Medium', '25′'],
    [L.p8, en ? '2-D prefix + "subarray sum = k" map' : 'tiền tố 2 chiều + map "subarray sum = k"', B12, '1.2', 'Hard', '40′'],
  ];
  const head = en ? ['#', 'Problem', 'Pattern', 'Lesson', 'Level', 'Target'] : ['#', 'Đề', 'Mẫu', 'Bài', 'Mức', 'Thời gian đích'];
  return `<table>\n<thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r[0]}</td><td>${r[1]}</td><td><a href="${r[2]}">${r[3]}</a></td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('\n') +
    '\n</tbody></table>';
};

export default {
  title: '1.5 — Practice set 1: eight problems with step-by-step solutions|||1.5 — Bộ luyện 1: tám đề có lời giải từng bước',
  slug: 'dsa-1-4-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề LeetCode từ dễ tới khó phủ cả Chương 1 — hash map, tổng tiền tố, sắp xếp, thao tác bit — mỗi đề có hai gợi ý gập, lời giải từng bước, mã TS + Java chạy thật và các bẫy đã thử.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Practice set</span>
<h2>Practice set 1: eight problems with step-by-step solutions</h2>
<p class="lead">Reading a pattern is not the same as owning it. This set gives you eight problems you have <em>not</em> seen solved in this chapter, ordered from easy to hard, each one a different face of the four tools you just learned: the hash map (1.1), the prefix sum (1.2), sorting as a tool (1.3) and bit tricks (1.4). Every solution is hidden behind two hints, so you can stop as soon as you are unstuck. Every line of code and output below was produced by running it.</p>

<h3>The order, and the time to aim for</h3>
${THU_TU('en')}
<p>Target times are what a mid-level interviewer expects for the <em>whole</em> loop — clarify, brute force, improve, code, test. Easy 15 minutes, Medium 25, Hard 40. If you go over, that is data, not failure: write down <em>where</em> the time went.</p>

<h3>How to practise each problem</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start a timer, read only the statement</span><span class="lz-d">Write the constraints down and turn n into a target complexity with the table from lesson 0.1.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Say the brute force out loud</span><span class="lz-d">One sentence plus its complexity. Talking alone feels strange; do it anyway — it is the skill being tested.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Stuck for 5 minutes? Open hint 1. Another 5? Hint 2.</span><span class="lz-d">Hints are graded: the first one names the direction, the second one names the data structure and the invariant.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Code, then test by hand before you submit</span><span class="lz-d">Empty input, one element, duplicates, negatives, the largest value. Then submit on LeetCode.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Compare with the step-by-step solution, log one line</span><span class="lz-d">In your notebook: <em>signal → tool → complexity</em>, plus the bug you made, if any. That log is what you revise in Chapter 11.</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bộ luyện 1.5</span>
<h2>Bộ luyện 1: tám đề có lời giải từng bước</h2>
<p class="lead">Đọc hiểu một mẫu bài khác hẳn với làm chủ nó. Bộ này cho bạn tám đề <em>chưa</em> được giải trong chương, xếp từ dễ tới khó, mỗi đề là một gương mặt khác của bốn công cụ vừa học: hash map (1.1), tổng tiền tố (1.2), sắp xếp làm công cụ (1.3) và mẹo bit (1.4). Lời giải nào cũng giấu sau hai gợi ý, để bạn dừng lại ngay khi đã gỡ được nút thắt. Mọi dòng mã và output bên dưới đều sinh ra bằng cách chạy thật.</p>

<h3>Thứ tự làm, và thời gian nên nhắm tới</h3>
${THU_TU('vi')}
<p>Thời gian đích là thứ người phỏng vấn tầm trung kỳ vọng cho <em>cả</em> vòng — hỏi làm rõ, vét cạn, cải tiến, code, test. Easy 15 phút, Medium 25, Hard 40. Lố giờ thì đó là dữ liệu, không phải thất bại: ghi lại thời gian đã đi <em>đâu</em> mất.</p>

<h3>Cách luyện từng đề</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bấm giờ, chỉ đọc đề</span><span class="lz-d">Chép ràng buộc ra giấy và đổi n thành độ phức tạp đích bằng bảng ở bài 0.1.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nói to bản vét cạn</span><span class="lz-d">Một câu kèm độ phức tạp. Nói một mình nghe kỳ, cứ nói — đó chính là kỹ năng được chấm.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Kẹt 5 phút? Mở gợi ý 1. Thêm 5 phút? Gợi ý 2.</span><span class="lz-d">Gợi ý có bậc: cái đầu chỉ hướng, cái thứ hai gọi tên cấu trúc dữ liệu và bất biến (invariant — điều luôn đúng ở mỗi vòng).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Code, rồi test bằng tay TRƯỚC khi nộp</span><span class="lz-d">Mảng rỗng, một phần tử, phần tử trùng, số âm, giá trị lớn nhất. Rồi nộp trên LeetCode.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">So với lời giải từng bước, ghi một dòng vào sổ</span><span class="lz-d">Trong sổ: <em>dấu hiệu → công cụ → độ phức tạp</em>, cộng lỗi bạn đã mắc nếu có. Cuốn sổ đó là thứ bạn ôn lại ở Chương 11.</span></div>
</div>
<p>Nếu bạn làm đề này lần đầu ở mức khó, cứ mở gợi ý sớm — mục tiêu của bộ luyện là để lần thứ hai bạn làm được mà không cần gợi ý, không phải để chứng minh gì ở lần đầu. Mẹo nhỏ của người luyện lâu năm: làm lại đúng đề đó sau 3 ngày và sau 1 tuần, từ tệp trắng. Lần lặp lại có khoảng cách (spaced repetition) là thứ biến "đã hiểu" thành "viết ra được dưới áp lực".</p>
</div>

<div class="ml-en">
<h3>1 · ${L.p1}</h3>
<p><strong>Problem (in our words).</strong> Given an integer array <code>nums</code> and a number <code>k</code>, answer whether two <em>different</em> positions hold the same value and are at most <code>k</code> apart. Example: <code>[4, 9, 2, 4]</code> with k = 3 → true (the two 4s are 3 apart); the same array with k = 2 → false.</p>
<p><strong>How to recognise the pattern.</strong> "Have I seen this value before — and where?" is a hash map from value to index. The distance condition only adds one comparison.</p>
${gap('💡 Hint 1', '<p>For each position i, the only earlier occurrence of nums[i] worth checking is the <em>closest</em> one. Why?</p>')}
${gap('💡 Hint 2', '<p>Keep a map value → most recent index. Check the distance, then overwrite the index with i.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: every pair (i, j) with j − i ≤ k and equal values — O(n·k), which is O(n²) when k is close to n. With n up to 10⁵ that is too slow.</li><li>The waste: for a fixed i we scan back up to k positions looking for one value. A map remembers it instead.</li><li>Key observation: if the closest earlier copy is more than k away, every older copy is even further. So we only store the <strong>latest</strong> index — overwriting is correct here (remember this: problem 5 needs the opposite).</li><li>Complexity: O(n) time, O(n) space (O(min(n, k)) if you also delete entries older than k — that turns the map into a sliding window, Chapter 2).</li><li>Edge cases tested below: k = 0 (never true, two positions cannot be 0 apart), a single element, a value that repeats but always too far apart (<code>[1, 2, 1, 3, 1]</code>, k = 1).</li></ol>')}
</div>
<div class="ml-vi">
<h3>1 · ${L.p1}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên <code>nums</code> và số <code>k</code>, trả lời xem có hai vị trí <em>khác nhau</em> mang cùng giá trị và cách nhau không quá <code>k</code> hay không. Ví dụ: <code>[4, 9, 2, 4]</code> với k = 3 → true (hai số 4 cách nhau 3); cùng mảng đó với k = 2 → false.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Giá trị này đã gặp chưa — và gặp ở đâu?" chính là hash map từ giá trị sang chỉ số. Điều kiện khoảng cách chỉ thêm một phép so sánh. Đời thật: hệ thống chống gửi trùng (dedup) "cùng một đơn hàng gửi lại trong vòng k giây thì bỏ" làm đúng việc này — map từ mã đơn sang lần gửi gần nhất.</p>
${gap('💡 Gợi ý 1', '<p>Với mỗi vị trí i, trong các lần xuất hiện trước đó của nums[i], lần nào là lần duy nhất đáng kiểm? Vì sao?</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ map giá trị → chỉ số GẦN NHẤT. Kiểm khoảng cách, rồi ghi đè chỉ số bằng i.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: mọi cặp (i, j) có j − i ≤ k và cùng giá trị — O(n·k), tức O(n²) khi k gần bằng n. Với n tới 10⁵ là quá chậm.</li><li>Chỗ phí: với i cố định ta quét lùi tối đa k ô để tìm đúng một giá trị. Map nhớ giùm ta.</li><li>Nhận xét then chốt: nếu bản sao gần nhất phía trước đã cách hơn k, mọi bản sao cũ hơn còn xa hơn nữa. Vậy chỉ cần lưu chỉ số <strong>mới nhất</strong> — ghi đè là ĐÚNG ở đề này (nhớ kỹ: đề 5 cần điều ngược lại).</li><li>Độ phức tạp: O(n) thời gian, O(n) bộ nhớ (O(min(n, k)) nếu bạn xoá luôn các mục cũ hơn k — khi đó map thành một cửa sổ trượt, Chương 2).</li><li>Ca biên đã thử bên dưới: k = 0 (không bao giờ true, hai vị trí khác nhau không thể cách nhau 0), mảng một phần tử, giá trị lặp lại nhưng luôn quá xa (<code>[1, 2, 1, 3, 1]</code>, k = 1).</li></ol>')}
</div>
${maHai('ch01/luyen-219.ts', 'ch01/Luyen219.java', { vung: 'giai' })}
${ketQua('ch01/luyen-219.ts')}
${ketQua('ch01/Luyen219.java')}

<div class="ml-en">
<h3>2 · ${L.p2}</h3>
<p><strong>Problem (in our words).</strong> You start with a positive integer <code>start</code> and add the numbers of <code>nums</code> one by one. The running total must never drop below 1. Return the smallest <code>start</code> that works. Example: <code>[-3, 2, -3, 4, 2]</code> → 5 (the running totals with start 5 are 2, 4, 1, 5, 7).</p>
<p><strong>How to recognise the pattern.</strong> "Running total" is literally a prefix sum. The only question is which prefix is the dangerous one — the lowest.</p>
${gap('💡 Hint 1', '<p>The running total after step i is start + (prefix sum of the first i numbers). Which i is the hardest to keep ≥ 1?</p>')}
${gap('💡 Hint 2', '<p>Track the minimum prefix sum, counting the empty prefix 0. You need start + minimum ≥ 1.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: try start = 1, 2, 3, … and simulate; stop at the first start that never dips below 1. Each try is O(n) and the answer can be as large as 1 + n·100 for this problem’s limits, so this is O(n²·100) in the worst case. It is a perfect <em>checker</em> though — the code below runs both and compares.</li><li>Observation: every running total is start + P[i]. All of them are ≥ 1 exactly when the smallest one is: start + min(P) ≥ 1.</li><li>So answer = 1 − min(P), where min includes the empty prefix 0. That inclusion is what makes the answer at least 1 when every number is positive (<code>[2, 3]</code> → 1).</li><li>O(n) time, O(1) space — no array of prefixes is needed, a running sum and a running minimum suffice.</li><li>Edge cases tested: all positive, a single negative (<code>[-5]</code> → 6), all zeros (→ 1).</li></ol>')}
</div>
<div class="ml-vi">
<h3>2 · ${L.p2}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn bắt đầu với một số nguyên dương <code>start</code> rồi cộng lần lượt các số trong <code>nums</code>. Tổng đang chạy không bao giờ được tụt dưới 1. Trả về <code>start</code> nhỏ nhất thoả. Ví dụ: <code>[-3, 2, -3, 4, 2]</code> → 5 (với start 5 các tổng chạy là 2, 4, 1, 5, 7).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Tổng đang chạy" (running total) chính là tổng tiền tố. Câu hỏi duy nhất là tiền tố nào nguy hiểm nhất — tiền tố thấp nhất. Đời thật: số dư tối thiểu phải nạp sẵn vào ví điện tử để chuỗi giao dịch nạp/rút trong tháng không lần nào bị "số dư không đủ" — đúng bài toán này.</p>
${gap('💡 Gợi ý 1', '<p>Tổng chạy sau bước i bằng start + (tổng tiền tố của i số đầu). Với i nào thì khó giữ ≥ 1 nhất?</p>')}
${gap('💡 Gợi ý 2', '<p>Theo dõi tổng tiền tố nhỏ nhất, tính cả tiền tố rỗng bằng 0. Cần start + nhỏ nhất ≥ 1.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: thử start = 1, 2, 3, … và mô phỏng; dừng ở start đầu tiên không lần nào tụt dưới 1. Mỗi lần thử O(n) và đáp án có thể lớn tới 1 + n·100 theo giới hạn của đề, nên trường hợp xấu là O(n²·100). Nhưng nó là bộ <em>kiểm chứng</em> tuyệt vời — mã bên dưới chạy cả hai và so.</li><li>Nhận xét: mọi tổng chạy đều bằng start + P[i]. Tất cả ≥ 1 khi và chỉ khi cái nhỏ nhất ≥ 1: start + min(P) ≥ 1.</li><li>Vậy đáp án = 1 − min(P), với min tính cả tiền tố rỗng 0. Chính việc tính cả 0 làm đáp án luôn ≥ 1 khi mọi số đều dương (<code>[2, 3]</code> → 1).</li><li>O(n) thời gian, O(1) bộ nhớ — không cần mảng tiền tố, một biến tổng chạy và một biến min chạy là đủ.</li><li>Ca biên đã thử: toàn số dương, một số âm duy nhất (<code>[-5]</code> → 6), toàn số 0 (→ 1).</li></ol>')}
</div>
${maHai('ch01/luyen-1413.ts', 'ch01/Luyen1413.java', { vung: 'giai' })}
${ketQua('ch01/luyen-1413.ts')}
${ketQua('ch01/Luyen1413.java')}

<div class="ml-en">
<h3>3 · ${L.p3}</h3>
<p><strong>Problem (in our words).</strong> String <code>t</code> is string <code>s</code> shuffled, plus one extra lowercase letter inserted somewhere. Return that extra letter. Example: <code>s = "abcd"</code>, <code>t = "dbcea"</code> → <code>"e"</code>.</p>
<p><strong>How to recognise the pattern.</strong> "Everything appears in pairs except one thing" is the XOR signature from lesson 1.4: x ^ x = 0, x ^ 0 = x, and order does not matter. A count array of 26 is the safe second answer.</p>
${gap('💡 Hint 1', '<p>Think of every character code in s and t as one bag of numbers. Every letter of s appears in that bag twice — except one letter.</p>')}
${gap('💡 Hint 2', '<p>XOR all character codes of both strings together; what is left is the code of the extra letter.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: sort both strings and find the first position where they differ — O(n log n). Or count letters of s, subtract letters of t, the one that goes negative is the answer — O(n) time, O(26) space. Both are fine answers; say one of them first.</li><li>The XOR version: every letter of s cancels its copy in t (a ^ a = 0, and XOR is commutative so the shuffle does not matter). The survivor is the extra letter. O(n) time, O(1) space, no array at all.</li><li>Notice the last output line: after XOR-ing only "abcd" the accumulator holds 4, which is not a letter at all. Intermediate values of a XOR fold have no meaning — only the final one does. Do not try to "debug" by reading them.</li><li>Edge cases tested: s empty (t is one letter), the extra letter duplicates an existing one (<code>"aab"</code> → <code>"abab"</code> gives b), the extra letter at the end.</li><li>Follow-up you may get: "what if t could have an extra letter <em>and</em> be missing another?" — then XOR mixes two unknowns and you need counting.</li></ol>')}
</div>
<div class="ml-vi">
<h3>3 · ${L.p3}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Chuỗi <code>t</code> là chuỗi <code>s</code> bị xáo trộn rồi chèn thêm đúng một chữ thường ở đâu đó. Trả về chữ bị chèn thêm. Ví dụ: <code>s = "abcd"</code>, <code>t = "dbcea"</code> → <code>"e"</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mọi thứ đều đi theo cặp trừ một thứ" là dấu hiệu của XOR ở <a href="${B14}">bài 1.4</a>: x ^ x = 0, x ^ 0 = x, và thứ tự không quan trọng. Mảng đếm 26 ô là câu trả lời an toàn thứ hai. Đời thật: đối chiếu hai bản danh sách (bản kiểm kê kho trước/sau) để tìm đúng một món bị thêm vào — cùng ý đó; phép XOR các byte cũng là nền của mã chẵn lẻ (parity) trong RAID 5, nơi mất một ổ vẫn dựng lại được dữ liệu.</p>
${gap('💡 Gợi ý 1', '<p>Coi mọi mã ký tự của s và t là một túi số. Mỗi chữ của s xuất hiện trong túi đó hai lần — trừ một chữ.</p>')}
${gap('💡 Gợi ý 2', '<p>XOR tất cả mã ký tự của cả hai chuỗi lại với nhau; thứ còn lại là mã của chữ thừa.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: sắp xếp cả hai chuỗi rồi tìm vị trí đầu tiên khác nhau — O(n log n). Hoặc đếm chữ của s, trừ chữ của t, chữ nào bị âm là đáp án — O(n) thời gian, O(26) bộ nhớ. Cả hai đều là câu trả lời tốt; nói một trong hai trước.</li><li>Bản XOR: mỗi chữ của s triệt tiêu bản sao của nó trong t (a ^ a = 0, và XOR giao hoán nên việc xáo trộn không ảnh hưởng). Kẻ sống sót là chữ thừa. O(n) thời gian, O(1) bộ nhớ, không cần mảng nào.</li><li>Để ý dòng output cuối: sau khi XOR riêng "abcd" bộ tích luỹ đang giữ 4, chẳng phải chữ cái nào. Giá trị trung gian của một chuỗi XOR không mang nghĩa gì — chỉ giá trị cuối mới có nghĩa. Đừng cố "gỡ lỗi" bằng cách đọc chúng.</li><li>Ca biên đã thử: s rỗng (t là một chữ), chữ thừa trùng với chữ đã có (<code>"aab"</code> → <code>"abab"</code> cho b), chữ thừa nằm cuối.</li><li>Câu hỏi nối tiếp có thể gặp: "nếu t vừa thừa một chữ vừa thiếu một chữ khác thì sao?" — khi đó XOR trộn lẫn hai ẩn số và bạn phải quay về đếm.</li></ol>')}
</div>
${maHai('ch01/luyen-389.ts', 'ch01/Luyen389.java', { vung: 'xor' })}
${ketQua('ch01/luyen-389.ts')}
${ketQua('ch01/Luyen389.java')}

<div class="ml-en">
<h3>4 · ${L.p4}</h3>
<p><strong>Problem (in our words).</strong> In one operation you pick two numbers from the array whose sum is <code>k</code> and remove both. Return the maximum number of operations. Example: <code>[2, 7, 4, 5, 3]</code>, k = 9 → 2 (pairs 2+7 and 4+5; 3 is left alone).</p>
<p><strong>How to recognise the pattern.</strong> It is Two Sum (1.1) with two twists: we want <em>all</em> pairs, and each number can be used only once. So the map must store <em>how many copies are still waiting</em>, not an index.</p>
${gap('💡 Hint 1', '<p>Walk left to right. When x arrives, is there an unused k − x waiting? If yes, pairing them now is never worse than waiting.</p>')}
${gap('💡 Hint 2', '<p>Map value → count of unpaired copies. Pair: decrement the partner. No partner: increment x. Alternative: sort, then two pointers from both ends.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: repeatedly search for any pair with sum k and remove it — O(n²) or worse.</li><li>Greedy with a map: when x arrives and a k − x is waiting, pair them. Could pairing now ever lose an operation? No — any optimal pairing that uses this waiting copy differently can swap partners without changing the count (all copies of the same value are interchangeable).</li><li>Why counts and not a Set: <code>[3, 3, 3, 1, 4]</code> with k = 6 — the first 3 waits, the second 3 pairs with it, the third 3 must wait again. A Set would forget that the count went back to zero. Output: 1.</li><li>The special case x = k − x (e.g. 2 + 2 = 4) needs no extra code: x checks the map <em>before</em> adding itself, exactly the "check, then insert" rule of Two Sum.</li><li>Complexity: O(n) time, O(n) space. The sort + two pointers version is O(n log n) time but O(1) extra space if you may sort in place — mention it as the memory trade-off; it is Chapter 2’s pattern.</li></ol>')}
</div>
<div class="ml-vi">
<h3>4 · ${L.p4}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Mỗi thao tác bạn chọn hai số trong mảng có tổng bằng <code>k</code> rồi xoá cả hai. Trả về số thao tác nhiều nhất. Ví dụ: <code>[2, 7, 4, 5, 3]</code>, k = 9 → 2 (cặp 2+7 và 4+5; số 3 bị bỏ lại).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đây là Two Sum (<a href="${B11}">bài 1.1</a>) thêm hai khúc quanh: ta muốn <em>mọi</em> cặp, và mỗi số chỉ được dùng một lần. Nên map phải lưu <em>còn bao nhiêu bản đang chờ ghép</em>, không phải lưu chỉ số. Đời thật: ghép đôi bạn học nhóm sao cho tổng "điểm mạnh" mỗi cặp đạt chuẩn, hoặc khớp lệnh mua/bán cùng mệnh giá trên sàn — hàng chờ đếm theo giá.</p>
${gap('💡 Gợi ý 1', '<p>Đi từ trái sang phải. Khi x tới, có bản k − x nào đang rảnh không? Nếu có, ghép ngay không bao giờ tệ hơn đợi.</p>')}
${gap('💡 Gợi ý 2', '<p>Map giá trị → số bản chưa ghép. Ghép được: giảm bản của "người kia". Không ghép được: tăng bản của x. Cách khác: sắp xếp rồi hai con trỏ từ hai đầu.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: lặp đi lặp lại việc tìm một cặp bất kỳ có tổng k và xoá nó — O(n²) hoặc tệ hơn.</li><li>Tham lam với map: x tới mà có một k − x đang chờ thì ghép luôn. Ghép ngay có khi nào làm mất một thao tác? Không — mọi cách ghép tối ưu dùng bản đang chờ đó theo kiểu khác đều đổi được "người kia" mà không đổi số cặp (các bản cùng giá trị thay thế được cho nhau).</li><li>Vì sao phải đếm, không dùng Set: <code>[3, 3, 3, 1, 4]</code> với k = 6 — số 3 thứ nhất chờ, số 3 thứ hai ghép với nó, số 3 thứ ba lại phải chờ. Set sẽ quên rằng số đếm đã về 0. Output: 1.</li><li>Trường hợp x = k − x (vd 2 + 2 = 4) không cần mã riêng: x tra map <em>trước khi</em> tự thêm mình vào, đúng luật "tra trước, cất sau" của Two Sum.</li><li>Độ phức tạp: O(n) thời gian, O(n) bộ nhớ. Bản sắp xếp + hai con trỏ là O(n log n) thời gian nhưng chỉ O(1) bộ nhớ phụ nếu được sắp tại chỗ — nhắc nó như một đánh đổi bộ nhớ; đó là mẫu của Chương 2. Lưu ý bản TS sắp trên BẢN SAO và dùng comparator số <code>(x, y) =&gt; x - y</code> — <code>sort()</code> trần sẽ so chuỗi (<a href="${B13}">bài 1.3</a>).</li></ol>')}
</div>
${maHai('ch01/luyen-1679.ts', 'ch01/Luyen1679.java', { vung: 'map' })}
${maHai('ch01/luyen-1679.ts', 'ch01/Luyen1679.java', { vung: 'sort' })}
${ketQua('ch01/luyen-1679.ts')}
${ketQua('ch01/Luyen1679.java')}

<div class="ml-en">
<h3>5 · ${L.p5}</h3>
<p><strong>Problem (in our words).</strong> Given non-negative integers <code>nums</code> and a positive <code>k</code>, answer whether there is a contiguous piece of <em>length at least 2</em> whose sum is a multiple of k (0 counts as a multiple). Example: <code>[2, 5, 3, 0, 4]</code>, k = 6 → true, because 5 + 3 + 0 + 4 = 12.</p>
<p><strong>How to recognise the pattern.</strong> "Contiguous subarray" + "sum" is prefix sum (1.2). "Multiple of k" means we only care about sums <em>modulo</em> k: two prefixes with the same remainder enclose a multiple of k. It is LC 560’s map with remainders as keys — and a different rule for what the map stores.</p>
${gap('💡 Hint 1', '<p>If P[i] and P[j] leave the same remainder when divided by k, what can you say about P[i] − P[j]?</p>')}
${gap('💡 Hint 2', '<p>Map remainder → the FIRST prefix index where it appeared, starting with {0: −1}. Never overwrite. A repeat at distance ≥ 2 is the answer.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: every (start, end) with end − start ≥ 1, sum with a running total — O(n²). n can be 10⁵, so no.</li><li>Prefix idea: sum(j+1 .. i) = P[i] − P[j]. It is divisible by k exactly when P[i] mod k = P[j] mod k. So we look for two prefix indices with the same remainder, at least 2 apart (length i − j ≥ 2).</li><li>Which index to store? The <strong>first</strong> one. A later repeat gives the longest possible piece, so if the first one is too close, no other one can be farther. This is the exact opposite of problem 1, where the newest index was the best. Overwriting here is a real bug — see the trap demo below.</li><li>Why {0: −1}: the empty prefix (sum 0, "before index 0") lets a piece that starts at index 0 be found. Without it, <code>[2, 4]</code> with k = 6 returns false.</li><li>We store <code>rem = (rem + x) % k</code>, never the full sum, so the numbers stay below k — no overflow even in Java. Negative remainders cannot appear here because nums are non-negative; if a variant allows negatives (LC 974), fix them with <code>((x % k) + k) % k</code>, lesson 1.2.</li><li>O(n) time, O(min(n, k)) space. Edge cases tested: one element (<code>[0]</code>, k = 1 → false, length 1), zeros (<code>[5, 0, 0, 0]</code>, k = 3 → true thanks to [0, 0]), <code>[1, 0]</code> with k = 2 → false.</li></ol>')}
</div>
<div class="ml-vi">
<h3>5 · ${L.p5}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên không âm <code>nums</code> và số dương <code>k</code>, trả lời xem có một đoạn liên tiếp <em>dài ít nhất 2</em> có tổng là bội của k không (0 cũng tính là bội). Ví dụ: <code>[2, 5, 3, 0, 4]</code>, k = 6 → true, vì 5 + 3 + 0 + 4 = 12.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mảng con liên tiếp" + "tổng" là tổng tiền tố (<a href="${B12}">bài 1.2</a>). "Bội của k" nghĩa là ta chỉ quan tâm tới tổng <em>theo modulo</em> k: hai tiền tố có cùng số dư thì phần kẹp giữa là bội của k. Đây chính là cái map của LC 560 với khoá là số dư — nhưng luật "map lưu gì" thì khác. Đời thật: kế toán đối soát tiền theo chu kỳ (vd hàng đóng theo thùng 6 chai, hỏi có chuỗi ngày liên tiếp nào xuất kho tròn thùng không) — mọi bài "tròn chu kỳ" đều quy về số dư tiền tố.</p>
${gap('💡 Gợi ý 1', '<p>Nếu P[i] và P[j] chia cho k có cùng số dư, bạn nói được gì về P[i] − P[j]?</p>')}
${gap('💡 Gợi ý 2', '<p>Map số dư → chỉ số tiền tố ĐẦU TIÊN có số dư đó, khởi tạo {0: −1}. Không bao giờ ghi đè. Gặp lại ở khoảng cách ≥ 2 là có đáp án.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: mọi cặp (đầu, cuối) với cuối − đầu ≥ 1, cộng dồn bằng tổng chạy — O(n²). n có thể tới 10⁵, nên không.</li><li>Ý tiền tố: sum(j+1 .. i) = P[i] − P[j]. Nó chia hết cho k đúng khi P[i] mod k = P[j] mod k. Vậy ta tìm hai chỉ số tiền tố cùng số dư, cách nhau ít nhất 2 (độ dài i − j ≥ 2).</li><li>Lưu chỉ số nào? Chỉ số <strong>đầu tiên</strong>. Một lần lặp lại về sau sẽ cho đoạn dài nhất có thể, nên nếu lần đầu đã quá gần thì không lần nào khác xa hơn được. Đây là điều NGƯỢC HẲN với đề 1, nơi chỉ số mới nhất là tốt nhất. Ghi đè ở đây là lỗi thật — xem phần demo bẫy bên dưới.</li><li>Vì sao {0: −1}: tiền tố rỗng (tổng 0, "trước chỉ số 0") giúp tìm được đoạn bắt đầu từ chỉ số 0. Thiếu nó, <code>[2, 4]</code> với k = 6 trả về false.</li><li>Ta lưu <code>rem = (rem + x) % k</code>, không bao giờ lưu tổng đầy đủ, nên số luôn nhỏ hơn k — không tràn số kể cả trong Java. Số dư âm không xuất hiện ở đây vì nums không âm; nếu biến thể cho phép số âm (LC 974), sửa bằng <code>((x % k) + k) % k</code>, bài 1.2.</li><li>O(n) thời gian, O(min(n, k)) bộ nhớ. Ca biên đã thử: một phần tử (<code>[0]</code>, k = 1 → false, dài 1), toàn số 0 (<code>[5, 0, 0, 0]</code>, k = 3 → true nhờ đoạn [0, 0]), <code>[1, 0]</code> với k = 2 → false.</li></ol>')}
</div>
${maHai('ch01/luyen-523.ts', 'ch01/Luyen523.java', { vung: 'giai' })}
${ketQua('ch01/luyen-523.ts')}
${ketQua('ch01/Luyen523.java')}

<div class="ml-en">
<h4>Watch it run: remainders and first indices</h4>
<p>Input <code>[2, 5, 3, 0, 4]</code>, k = 6. Blue = the element we add; red = a remainder seen before but too close; green = the subarray found. The table was produced by running the algorithm (<code>luyen-523.vet.mjs</code>).</p>
</div>
<div class="ml-vi">
<h4>Xem nó chạy: số dư và chỉ số đầu tiên</h4>
<p>Đầu vào <code>[2, 5, 3, 0, 4]</code>, k = 6. Ô xanh dương = phần tử vừa cộng; ô đỏ = số dư đã gặp nhưng quá gần; ô xanh lá = đoạn tìm được. Bảng sinh ra bằng cách chạy thuật toán thật (<code>luyen-523.vet.mjs</code>).</p>
</div>
${BANG}
<div class="ml-en">
<p>Read the row i = 3: the remainder 4 was already stored at index 2, so the piece between them is just <code>[0]</code> — a multiple of 6 (zero) but of length 1. We do <em>not</em> overwrite: index 2 stays. The row i = 4 then finds remainder 2, first seen at index 0, length 4: the piece 5 + 3 + 0 + 4 = 12. Five steps, and the map never held more than k entries.</p>
${moPhong('ch01/luyen-523.sim.js', 'en', 'Continuous Subarray Sum — remainders step by step', 'Watch the remainder of each prefix, the map of first indices, and the "too short" case being skipped.')}
</div>
<div class="ml-vi">
<p>Đọc dòng i = 3: số dư 4 đã được lưu ở chỉ số 2, nên đoạn kẹp giữa chỉ là <code>[0]</code> — đúng là bội của 6 (bằng 0) nhưng dài 1. Ta <em>không</em> ghi đè: chỉ số 2 được giữ nguyên. Dòng i = 4 gặp số dư 2, lần đầu ở chỉ số 0, dài 4: đoạn 5 + 3 + 0 + 4 = 12. Năm bước, và map không bao giờ giữ quá k mục.</p>
${moPhong('ch01/luyen-523.sim.js', 'vi', 'Continuous Subarray Sum — số dư từng bước', 'Xem số dư của từng tiền tố, map chỉ số đầu tiên, và trường hợp "quá ngắn" bị bỏ qua.')}
</div>

<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Two one-line changes that break LC 523.</strong></p><p>(1) Overwriting the index on every step — the habit you just built in problem 1. (2) Forgetting the empty prefix <code>{0: −1}</code>. Each bug passes some tests and fails others, which is exactly why they survive until submission:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Hai thay đổi một dòng làm hỏng LC 523.</strong></p><p>(1) Ghi đè chỉ số ở mỗi bước — đúng thói quen bạn vừa tập ở đề 1. (2) Quên tiền tố rỗng <code>{0: −1}</code>. Mỗi lỗi qua được vài test và trượt test khác, nên chúng sống sót tới tận lúc nộp:</p></div>
</div>
${ma('ch01/luyen-523-bay.ts', { vung: 'ghi-de', nhan: 'TypeScript — bug 1' })}
${ma('ch01/luyen-523-bay.ts', { vung: 'thieu-0', nhan: 'TypeScript — bug 2' })}
${ketQua('ch01/luyen-523-bay.ts')}
<div class="ml-en">
<p>Overwriting fails on <code>[5, 0, 0, 0]</code>: the "start" index creeps forward one step at a time, so the distance is always 1 and the piece [0, 0] is never seen. The missing <code>{0: −1}</code> fails on <code>[2, 4]</code> and <code>[1, 2, 3]</code>, where the only good piece starts at index 0. The last row passes all three versions — if that were your only test you would submit with confidence and fail.</p>
</div>
<div class="ml-vi">
<p>Ghi đè hỏng ở <code>[5, 0, 0, 0]</code>: chỉ số "đầu đoạn" nhích lên từng bước, nên khoảng cách luôn là 1 và đoạn [0, 0] không bao giờ được thấy. Thiếu <code>{0: −1}</code> hỏng ở <code>[2, 4]</code> và <code>[1, 2, 3]</code>, nơi đoạn tốt duy nhất bắt đầu từ chỉ số 0. Dòng cuối qua cả ba phiên bản — nếu đó là test duy nhất của bạn, bạn sẽ tự tin nộp và trượt. Bài học chung: một quyết định nhỏ ("ghi đè hay giữ lần đầu") phải được NÓI RA và kiểm bằng đúng ca biên sinh ra nó.</p>
</div>

<div class="ml-en">
<h3>6 · ${L.p6}</h3>
<p><strong>Problem (in our words).</strong> A company interviews 2n candidates and must fly exactly n of them to city A and n to city B. <code>costs[i] = [a, b]</code> is the ticket price of candidate i to each city. Return the minimum total price. Example: <code>[[50, 30], [20, 80], [60, 70], [40, 10]]</code> → 120 (A: 20 + 60, B: 30 + 10).</p>
<p><strong>How to recognise the pattern.</strong> "Assign each item to one of two groups of fixed size, minimise the total" — before reaching for DP, ask whether one number per item decides its group. Here it does: the <em>difference</em> a − b. Sorting by a custom key is lesson 1.3.</p>
${gap('💡 Hint 1', '<p>Pretend everybody goes to B first. Moving person i to A changes the total by how much?</p>')}
${gap('💡 Hint 2', '<p>Moving i to A costs a − b (often negative = a saving). Choose the n people with the smallest a − b: sort by a − b, first half to A, second half to B.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: try every set of n people for A — C(2n, n) sets, exponential (for 2n = 100 that is about 10²⁹). The code below still runs it with a bitmask (lesson 1.4) on tiny inputs, as a checker: <em>greedy</em> and <em>brute</em> agree on all four cases.</li><li>Reframe: start from "all to B", total = Σ b. Sending person i to A adds (a − b). We must send exactly n people, so we want the n smallest values of a − b. Sort by a − b ascending; the first n go to A.</li><li>Why greedy is right (exchange argument): suppose an optimal plan sends x to A and y to B with (a − b) of x larger than that of y. Swap them: the total changes by (a<sub>y</sub> − b<sub>y</sub>) − (a<sub>x</sub> − b<sub>x</sub>) ≤ 0. Swapping never hurts, so the sorted plan is optimal. Say this argument out loud in an interview — "it is greedy because…" is what separates a guess from a solution.</li><li>Comparator details: TS <code>(x, y) =&gt; (x[0] − x[1]) − (y[0] − y[1])</code>, Java <code>Integer.compare(…)</code> (prices are ≤ 1000, so even a − b could not overflow here, but <code>Integer.compare</code> is the habit from 1.3). We sort a copy so the caller’s array is not reordered.</li><li>O(n log n) time for the sort, O(n) for the copy. Edge cases tested: ties (<code>[[10, 10], [10, 10]]</code>), people who strongly prefer one city.</li></ol>')}
</div>
<div class="ml-vi">
<h3>6 · ${L.p6}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Một công ty phỏng vấn 2n ứng viên và phải đưa đúng n người bay tới văn phòng A, n người tới văn phòng B. <code>costs[i] = [a, b]</code> là giá vé của ứng viên i tới từng nơi. Trả về tổng chi phí nhỏ nhất. Ví dụ: <code>[[50, 30], [20, 80], [60, 70], [40, 10]]</code> → 120 (A: 20 + 60, B: 30 + 10).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Chia mỗi phần tử vào một trong hai nhóm có kích thước cố định, tổng nhỏ nhất" — trước khi vớ lấy quy hoạch động, hãy hỏi xem có một con số nào cho mỗi phần tử quyết định nhóm của nó không. Ở đây có: <em>hiệu</em> a − b. Sắp xếp theo khoá tự chọn là <a href="${B13}">bài 1.3</a>. Đời thật: phân công trực lab cho hai cơ sở, chia ca cho hai kho hàng — mọi bài "chia đôi theo chi phí chênh lệch" đều có dáng này.</p>
${gap('💡 Gợi ý 1', '<p>Giả sử ban đầu mọi người đều đi B. Chuyển người i sang A thì tổng thay đổi bao nhiêu?</p>')}
${gap('💡 Gợi ý 2', '<p>Chuyển i sang A tốn a − b (thường âm = tiết kiệm). Chọn n người có a − b nhỏ nhất: sắp theo a − b, nửa đầu đi A, nửa sau đi B.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: thử mọi tập n người đi A — C(2n, n) tập, hàm mũ (với 2n = 100 là khoảng 10²⁹). Mã bên dưới vẫn chạy nó bằng bitmask (bài 1.4) trên đầu vào tí hon, làm bộ kiểm chứng: <em>greedy</em> và <em>brute</em> khớp nhau ở cả bốn ca.</li><li>Đổi góc nhìn: bắt đầu từ "tất cả đi B", tổng = Σ b. Đưa người i sang A cộng thêm (a − b). Ta phải đưa đúng n người, nên ta muốn n giá trị a − b nhỏ nhất. Sắp a − b tăng dần; n người đầu đi A.</li><li>Vì sao tham lam (greedy) đúng — lập luận đổi chỗ (exchange argument): giả sử một phương án tối ưu đưa x đi A và y đi B mà (a − b) của x lớn hơn của y. Đổi chỗ hai người: tổng thay đổi (a<sub>y</sub> − b<sub>y</sub>) − (a<sub>x</sub> − b<sub>x</sub>) ≤ 0. Đổi chỗ không bao giờ làm tệ đi, nên phương án đã sắp là tối ưu. Hãy nói to lập luận này khi phỏng vấn — "nó tham lam được vì…" là thứ phân biệt một phỏng đoán với một lời giải.</li><li>Chi tiết comparator: TS <code>(x, y) =&gt; (x[0] − x[1]) − (y[0] − y[1])</code>, Java <code>Integer.compare(…)</code> (giá ≤ 1000 nên a − b ở đây không thể tràn số, nhưng <code>Integer.compare</code> là thói quen từ bài 1.3). Ta sắp một bản sao để mảng của người gọi không bị đổi thứ tự.</li><li>O(n log n) thời gian cho phép sắp, O(n) cho bản sao. Ca biên đã thử: hoà nhau (<code>[[10, 10], [10, 10]]</code>), người rất "nghiêng" về một thành phố.</li></ol>')}
</div>
${maHai('ch01/luyen-1029.ts', 'ch01/Luyen1029.java', { vung: 'giai' })}
${ketQua('ch01/luyen-1029.ts')}
${ketQua('ch01/Luyen1029.java')}
<div class="ml-en">
<p>The last output line shows the sorted order with its keys: −60, −10, 20, 30. The two negative keys go to A (they save 60 and 10), the two positive keys stay in B. That one line is the whole proof made visible.</p>
</div>
<div class="ml-vi">
<p>Dòng output cuối cho thấy thứ tự sau khi sắp cùng khoá của nó: −60, −10, 20, 30. Hai khoá âm đi A (tiết kiệm 60 và 10), hai khoá dương ở lại B. Một dòng đó là cả phép chứng minh hiện ra trước mắt.</p>
</div>

<div class="ml-en">
<h3>7 · ${L.p7}</h3>
<p><strong>Problem (in our words).</strong> Every value in <code>nums</code> appears exactly three times, except one value that appears once. Return it, in O(n) time and O(1) extra space. Values are 32-bit signed integers. Example: <code>[4, −1, 4, 4]</code> → −1.</p>
<p><strong>How to recognise the pattern.</strong> "Appears k times except one" + "O(1) space" = bits. Plain XOR only works for pairs (k = 2): three copies of x XOR to x, not 0. Instead, count each bit position over all numbers: the counts of the triple values are multiples of 3; whatever is left over belongs to the single number.</p>
${gap('💡 Hint 1', '<p>Look at one bit position b. Across all numbers, how many have bit b set? What do you know about that count modulo 3?</p>')}
${gap('💡 Hint 2', '<p>For b = 0 … 31: count = number of x with bit b set; if count % 3 ≠ 0, set bit b in the answer. Do not forget b = 31.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force: a count map — O(n) time but O(n) space, which the problem forbids. Sorting then scanning in steps of 3 is O(1) space but O(n log n) time. Say both, then aim for O(n)/O(1).</li><li>Bit counting: for each of the 32 positions, sum bit b of every number. The three copies of each repeated value add 0 or 3 to that sum, so sum % 3 is exactly bit b of the single number. 32 · n steps = O(n).</li><li>Negative numbers: <code>(x &gt;&gt; b) &amp; 1</code> reads the true bit b of the two’s-complement representation in both languages, sign bit included. Setting bit 31 with <code>ans |= 1 &lt;&lt; 31</code> makes ans negative — which is correct, because the single number is negative. The tests include −1 and −2147483648 (the most negative int).</li><li>The bonus <code>fsm</code> version keeps two masks, <em>ones</em> and <em>twos</em>, that count every bit modulo 3 at once — O(1) work per element. Learn the bit-counting version first: it is the one you can derive and explain under pressure.</li><li>O(32·n) = O(n) time, O(1) space.</li></ol>')}
</div>
<div class="ml-vi">
<h3>7 · ${L.p7}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Mọi giá trị trong <code>nums</code> xuất hiện đúng ba lần, trừ một giá trị chỉ xuất hiện một lần. Trả về giá trị đó, trong O(n) thời gian và O(1) bộ nhớ phụ. Các giá trị là số nguyên có dấu 32 bit. Ví dụ: <code>[4, −1, 4, 4]</code> → −1.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Xuất hiện k lần trừ một" + "bộ nhớ O(1)" = bit. XOR trơn chỉ dùng được cho cặp (k = 2): ba bản x XOR lại ra x, không ra 0. Thay vào đó, đếm từng vị trí bit trên mọi số: số đếm của các giá trị lặp ba lần là bội của 3; phần dư thuộc về số đơn lẻ. Đời thật: cùng ý "đếm theo từng bit rồi lấy dư" là nền của mã sửa lỗi và bỏ phiếu đa số (majority vote) giữa ba bản sao dữ liệu — hệ thống ba máy chạy song song (TMR) trên vệ tinh lấy bit đa số để chống nhiễu.</p>
${gap('💡 Gợi ý 1', '<p>Nhìn một vị trí bit b. Trên tất cả các số, có bao nhiêu số bật bit b? Bạn biết gì về số đó khi chia lấy dư cho 3?</p>')}
${gap('💡 Gợi ý 2', '<p>Với b = 0 … 31: count = số phần tử x bật bit b; nếu count % 3 ≠ 0 thì bật bit b trong đáp án. Đừng quên b = 31.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn: map đếm — O(n) thời gian nhưng O(n) bộ nhớ, đề cấm. Sắp xếp rồi quét từng bước 3 là O(1) bộ nhớ nhưng O(n log n) thời gian. Nói cả hai, rồi nhắm tới O(n)/O(1).</li><li>Đếm bit: với từng vị trí trong 32 vị trí, cộng bit b của mọi số. Ba bản của mỗi giá trị lặp cộng thêm 0 hoặc 3, nên tổng % 3 chính là bit b của số đơn lẻ. 32 · n bước = O(n).</li><li>Số âm: <code>(x &gt;&gt; b) &amp; 1</code> đọc đúng bit b của biểu diễn bù hai (two’s complement) ở cả hai ngôn ngữ, kể cả bit dấu. Bật bit 31 bằng <code>ans |= 1 &lt;&lt; 31</code> làm ans thành số âm — và như thế là ĐÚNG, vì số đơn lẻ đang âm. Bộ test có −1 và −2147483648 (số int âm nhất).</li><li>Bản <code>fsm</code> thêm giữ hai mặt nạ <em>ones</em> và <em>twos</em>, đếm mọi bit theo mod 3 cùng lúc — O(1) việc mỗi phần tử. Học bản đếm bit trước: đó là bản bạn tự suy ra và giải thích được dưới áp lực.</li><li>O(32·n) = O(n) thời gian, O(1) bộ nhớ.</li></ol>')}
</div>
${maHai('ch01/luyen-137.ts', 'ch01/Luyen137.java', { vung: 'giai' })}
${ketQua('ch01/luyen-137.ts')}
${ketQua('ch01/Luyen137.java')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>JavaScript and bit 31: two ways to get a huge positive number instead of −1.</strong></p><p>Stop the loop at bit 30, or build the answer with <code>+ 2 ** b</code> (a 64-bit float, not a 32-bit int), and the sign is lost. Run on <code>[4, −1, 4, 4]</code>:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>JavaScript và bit 31: hai cách nhận về một số dương khổng lồ thay vì −1.</strong></p><p>Dừng vòng lặp ở bit 30, hoặc dựng đáp án bằng <code>+ 2 ** b</code> (số thực 64 bit, không phải int 32 bit), là mất dấu. Chạy với <code>[4, −1, 4, 4]</code>:</p></div>
</div>
${ma('ch01/luyen-137-bay.ts', { vung: 'bay', nhan: 'TypeScript — wrong' })}
${ketQua('ch01/luyen-137-bay.ts')}
<div class="ml-en">
<p>2147483647 is −1 without its sign bit; 4294967295 is all 32 bits read as an <em>unsigned</em> number. <code>| 0</code> reinterprets it as a signed 32-bit int and gives −1 back. The last line is the root cause in one picture: <code>1 &lt;&lt; 31</code> is −2147483648 in JavaScript (bitwise operators work on signed 32-bit ints), while <code>2 ** 31</code> is the ordinary number 2147483648. Java has no such trap here because <code>int</code> is always 32-bit — its trap is the opposite one, overflow (lesson 1.4).</p>
</div>
<div class="ml-vi">
<p>2147483647 là −1 bị mất bit dấu; 4294967295 là cả 32 bit được đọc như số <em>không dấu</em>. <code>| 0</code> diễn giải lại nó thành int có dấu 32 bit và trả về −1. Dòng cuối là gốc rễ trong một hình: trong JavaScript <code>1 &lt;&lt; 31</code> là −2147483648 (toán tử bit làm việc trên int có dấu 32 bit), còn <code>2 ** 31</code> là con số bình thường 2147483648. Java không có bẫy này ở đây vì <code>int</code> luôn 32 bit — bẫy của Java là chiều ngược lại, tràn số (<a href="${B14}">bài 1.4</a>). Chính repo này có đúng loại lỗi đó được chú thích sẵn: <code>src/utils/cidr.ts</code> phải ép <code>&gt;&gt;&gt; 0</code> cả hai vế, vì IP 203.x.x.x sau phép <code>&amp;</code> thành số âm và phép so sánh bằng sai.</p>
</div>

<div class="ml-en">
<h3>8 · ${L.p8}</h3>
<p><strong>Problem (in our words).</strong> Given an m × n integer matrix (values may be negative) and a <code>target</code>, count the rectangular submatrices whose elements sum to target. Two submatrices are different if any corner differs. Example: <code>[[1, 1, 1], [1, 1, 1]]</code> with target 2 → 7 (four horizontal pairs, three vertical pairs).</p>
<p><strong>How to recognise the pattern.</strong> "Count subarrays with sum = target, negatives allowed" is LC 560: a prefix-sum map with {0: 1} (lesson 1.2). This is the same question in 2-D. The trick that turns 2-D into 1-D: fix the top and bottom rows; the band between them squashes into one array of column sums.</p>
${gap('💡 Hint 1', '<p>The 2-D prefix sum gives any rectangle in O(1), but there are O(m²·n²) rectangles — too many for 100 × 100 at the upper limit? Count: 100⁴/4 ≈ 2.5·10⁷ is borderline; can you remove one factor of n?</p>')}
${gap('💡 Hint 2', '<p>For every pair (top, bottom) keep col[c] = sum of rows top..bottom in column c. Now "rectangles in this band with sum = target" = "subarrays of col with sum = target". Run LC 560 on col.</p>')}
${gap('✅ Step-by-step solution', '<ol><li>Brute force with the 2-D prefix sum from lesson 1.2: P has (m+1)×(n+1) cells, every rectangle (r1, r2, c1, c2) is P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]. O(m²·n²) rectangles × O(1). The code keeps it as <code>bruteWith2D</code> and the outputs match the fast version on every case.</li><li>Remove a factor: fix top. Then grow bottom from top to m − 1, adding row bottom into col[] — O(n) per step. col is the band squashed into one row.</li><li>For each band, run Subarray Sum Equals K on col: running sum, map {sum: count} starting with {0: 1}, add map[sum − target] at each column. O(n) per band.</li><li>Bands: m(m+1)/2. Total O(m²·n) time, O(n) space. If m &gt; n, transpose first (or swap the roles of rows and columns) so the squared dimension is the smaller one — a good follow-up answer.</li><li>Why not a sliding window? Negative numbers: growing a window can decrease the sum, so "shrink when too big" has no meaning (lesson 1.2). The map is the tool that survives negatives.</li><li>Edge cases tested: 1 × 1 matrix, sums that cancel to 0 (<code>[[2, −2], [−2, 2]]</code>, target 0 → 5: two rows, two columns and the whole matrix), all equal values.</li></ol>')}
</div>
<div class="ml-vi">
<h3>8 · ${L.p8}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho ma trận số nguyên m × n (có thể có số âm) và một <code>target</code>, đếm số ma trận con hình chữ nhật có tổng phần tử bằng target. Hai ma trận con khác nhau nếu khác ít nhất một góc. Ví dụ: <code>[[1, 1, 1], [1, 1, 1]]</code> với target 2 → 7 (bốn cặp nằm ngang, ba cặp đứng dọc).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Đếm mảng con có tổng = target, cho phép số âm" là LC 560: map tổng tiền tố khởi tạo {0: 1} (<a href="${B12}">bài 1.2</a>). Đề này là đúng câu hỏi đó trong 2 chiều. Mẹo biến 2 chiều thành 1 chiều: cố định hàng trên và hàng dưới; dải hàng giữa chúng "ép dẹt" thành một mảng tổng theo cột. Đời thật: bản đồ nhiệt doanh thu theo (ngày × giờ), hỏi có bao nhiêu khung chữ nhật (dải ngày × dải giờ) đạt đúng chỉ tiêu; xử lý ảnh dùng ảnh tích phân (integral image) — tổng tiền tố 2 chiều — để tính tổng một ô chữ nhật trong O(1).</p>
${gap('💡 Gợi ý 1', '<p>Tổng tiền tố 2 chiều cho mọi hình chữ nhật trong O(1), nhưng có O(m²·n²) hình chữ nhật — với 100 × 100 ở giới hạn trên là bao nhiêu? Đếm: 100⁴/4 ≈ 2,5·10⁷, sát nút; bạn bỏ được một thừa số n không?</p>')}
${gap('💡 Gợi ý 2', '<p>Với mỗi cặp (top, bottom) giữ col[c] = tổng các hàng top..bottom ở cột c. Khi đó "hình chữ nhật trong dải này có tổng = target" = "mảng con của col có tổng = target". Chạy LC 560 trên col.</p>')}
${gap('✅ Lời giải từng bước', '<ol><li>Vét cạn bằng tổng tiền tố 2 chiều của bài 1.2: P có (m+1)×(n+1) ô, mọi hình chữ nhật (r1, r2, c1, c2) bằng P[r2+1][c2+1] − P[r1][c2+1] − P[r2+1][c1] + P[r1][c1]. O(m²·n²) hình × O(1). Mã giữ nó lại thành <code>bruteWith2D</code> và output khớp bản nhanh ở mọi ca.</li><li>Bỏ một thừa số: cố định top. Rồi nới bottom từ top tới m − 1, cộng hàng bottom vào col[] — O(n) mỗi bước. col là cả dải bị ép thành một hàng.</li><li>Với mỗi dải, chạy Subarray Sum Equals K trên col: tổng chạy, map {sum: count} khởi tạo {0: 1}, cộng map[sum − target] ở mỗi cột. O(n) mỗi dải.</li><li>Số dải: m(m+1)/2. Tổng O(m²·n) thời gian, O(n) bộ nhớ. Nếu m &gt; n thì chuyển vị trước (hoặc đổi vai hàng và cột) để chiều bị bình phương là chiều nhỏ hơn — một câu trả lời tốt cho câu hỏi nối tiếp.</li><li>Vì sao không cửa sổ trượt? Số âm: nới cửa sổ có thể làm tổng GIẢM, nên luật "quá lớn thì co lại" mất nghĩa (bài 1.2). Map là công cụ sống sót được với số âm.</li><li>Ca biên đã thử: ma trận 1 × 1, tổng triệt tiêu về 0 (<code>[[2, −2], [−2, 2]]</code>, target 0 → 5: hai hàng, hai cột và cả ma trận), mọi giá trị bằng nhau.</li></ol>')}
</div>
${maHai('ch01/luyen-1074.ts', 'ch01/Luyen1074.java', { vung: 'giai' })}
${ketQua('ch01/luyen-1074.ts')}
${ketQua('ch01/Luyen1074.java')}
<div class="ml-en">
<p>On the first matrix the fast and brute versions both find 10 submatrices with sum 2. The simulation below runs the same 3 × 3 matrix: for each of the 6 bands it shows the squashed <code>col</code> array and how many column ranges hit the target, so you can watch the total climb to 10.</p>
${moPhong('ch01/luyen-1074.sim.js', 'en', 'Submatrices that sum to target — band by band', 'Select a band of rows, squash it into column sums, run "subarray sum = k" on them; 6 bands, total 10.')}
</div>
<div class="ml-vi">
<p>Với ma trận đầu tiên, bản nhanh và bản vét cạn cùng tìm ra 10 ma trận con có tổng 2. Mô phỏng bên dưới chạy đúng ma trận 3 × 3 đó: với từng dải trong 6 dải, nó hiện mảng <code>col</code> đã ép dẹt và số đoạn cột chạm target, để bạn nhìn tổng leo dần lên 10.</p>
${moPhong('ch01/luyen-1074.sim.js', 'vi', 'Ma trận con có tổng bằng target — từng dải một', 'Chọn một dải hàng, ép thành tổng theo cột, chạy "subarray sum = k" trên đó; 6 dải, tổng 10.')}
</div>

<div class="ml-en">
<h3>What these eight problems have in common</h3>
<ul>
<li><strong>The map always stores what you will search for.</strong> Problem 1: value → newest index. Problem 4: value → copies waiting. Problem 5: remainder → first index. Problem 8: prefix sum → count. Before coding, say out loud what the key is, what the value is, and whether you overwrite.</li>
<li><strong>Prefix sums turn "a range" into "a difference of two points".</strong> Problems 2, 5 and 8. Add the empty prefix (0 or {0: …}) every time.</li>
<li><strong>Sorting is only allowed when order does not matter to the answer.</strong> Problems 4 and 6 sort freely; problems 5 and 8 cannot (the subarray must stay contiguous).</li>
<li><strong>Bits shine when "everything comes in groups except one" and memory is O(1).</strong> Problems 3 and 7 — and in JavaScript, every bitwise result is a signed 32-bit int.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Tám đề này có điểm gì chung</h3>
<ul>
<li><strong>Map luôn lưu thứ bạn sẽ đi tìm.</strong> Đề 1: giá trị → chỉ số mới nhất. Đề 4: giá trị → số bản đang chờ. Đề 5: số dư → chỉ số đầu tiên. Đề 8: tổng tiền tố → số lần. Trước khi code, nói to khoá là gì, giá trị là gì, và có ghi đè hay không.</li>
<li><strong>Tổng tiền tố biến "một đoạn" thành "hiệu của hai điểm".</strong> Đề 2, 5 và 8. Lần nào cũng thêm tiền tố rỗng (0 hoặc {0: …}).</li>
<li><strong>Chỉ được sắp xếp khi thứ tự không ảnh hưởng đáp án.</strong> Đề 4 và 6 sắp thoải mái; đề 5 và 8 thì không được (mảng con phải liên tiếp).</li>
<li><strong>Bit toả sáng khi "mọi thứ đi theo nhóm trừ một" và bộ nhớ phải O(1).</strong> Đề 3 và 7 — và trong JavaScript, mọi kết quả phép bit đều là int có dấu 32 bit.</li>
</ul>
</div>

<div class="ml-en">
<h3>🧪 Practice (spread over 3–4 days)</h3>
<div class="callout ok"><ol>
<li>Day 1: problems 1–3 with a timer, no hints. Submit on LeetCode. One notebook line each: <em>signal → tool → complexity</em>.</li>
<li>Day 2: problems 4–6. For problem 6, write the exchange argument in three sentences before you look at the solution.</li>
<li>Day 3: problems 7–8. For problem 7, run your own solution on <code>[−5, −5, −5, 2]</code> and <code>[−2147483648, 0, 0, 0]</code>; for problem 8, check yourself against the brute force on a random 4 × 4 matrix.</li>
<li>Day 4 (or one week later): redo problems 5 and 8 from a blank file, out loud, in the language you will interview in.</li>
</ol>
<p><strong>Done when:</strong> eight accepted submissions, eight notebook lines, each problem within its target time on the second attempt, and you can explain without notes why problem 1 overwrites the index and problem 5 must not.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">running total</span><span class="v">The sum of everything so far; a prefix sum computed on the fly.</span></div>
  <div class="kv"><span class="k">remainder (modulo)</span><span class="v">What is left after dividing by k; equal remainders mean the difference is a multiple of k.</span></div>
  <div class="kv"><span class="k">empty prefix</span><span class="v">The sum 0 "before index 0"; the seed {0: 1} or {0: −1} of every prefix-sum map.</span></div>
  <div class="kv"><span class="k">greedy + exchange argument</span><span class="v">Take the locally best choice, and prove that swapping any two decisions of an optimal plan into greedy order never hurts.</span></div>
  <div class="kv"><span class="k">two’s complement</span><span class="v">How signed integers are stored in bits; bit 31 is the sign bit of a 32-bit int.</span></div>
  <div class="kv"><span class="k">band of rows</span><span class="v">The rows top..bottom of a matrix squashed into one array of column sums.</span></div>
  <div class="kv"><span class="k">spaced repetition</span><span class="v">Redoing a problem after growing gaps (3 days, 1 week) so it sticks.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Eight problems, four tools: hash map, prefix sum, sorting, bits.</li>
<li>Decide what the map stores and whether to overwrite; problems 1 and 5 need opposite answers.</li>
<li>Seed every prefix-sum map with the empty prefix.</li>
<li>Greedy by sorting needs a one-sentence proof (swap two people, the total cannot rise).</li>
<li>Bit counting handles "three times except one"; in JS, keep bit 31 with <code>|</code>, not <code>+</code>.</li>
<li>2-D sum problems: fix two rows, squash, and reuse the 1-D tool.</li>
</ul>
${nguon('📗', 'NeetCode — practice list', 'The problem list by pattern, with video solutions for each problem', 'https://neetcode.io/practice')}
${nguon('📘', 'Grind 75 — Tech Interview Handbook', 'A week-by-week study schedule you can set to your own hours', 'https://www.techinterviewhandbook.org/grind75/')}
${nguon('🎯', 'Coding interview prep — Tech Interview Handbook', 'How to practise: timing, talking aloud, reviewing mistakes', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (rải trong 3–4 ngày)</h3>
<div class="callout ok"><ol>
<li>Ngày 1: đề 1–3, bấm giờ, không mở gợi ý. Nộp trên LeetCode. Mỗi đề một dòng sổ: <em>dấu hiệu → công cụ → độ phức tạp</em>.</li>
<li>Ngày 2: đề 4–6. Với đề 6, viết lập luận đổi chỗ trong ba câu TRƯỚC khi xem lời giải.</li>
<li>Ngày 3: đề 7–8. Với đề 7, chạy lời giải của chính bạn trên <code>[−5, −5, −5, 2]</code> và <code>[−2147483648, 0, 0, 0]</code>; với đề 8, tự đối chiếu với bản vét cạn trên một ma trận 4 × 4 ngẫu nhiên.</li>
<li>Ngày 4 (hoặc một tuần sau): làm lại đề 5 và 8 từ tệp trắng, nói to, bằng ngôn ngữ bạn sẽ dùng khi phỏng vấn.</li>
</ol>
<p><strong>Đạt khi:</strong> tám lượt nộp Accepted, tám dòng trong sổ, lần làm thứ hai đề nào cũng trong thời gian đích, và bạn giải thích được không cần nhìn vì sao đề 1 ghi đè chỉ số còn đề 5 thì không được.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">running total (tổng đang chạy)</span><span class="v">Tổng mọi thứ tới hiện tại; tổng tiền tố tính ngay trên đường đi.</span></div>
  <div class="kv"><span class="k">remainder / modulo (số dư / phép chia lấy dư)</span><span class="v">Phần còn lại sau khi chia cho k; hai số dư bằng nhau nghĩa là hiệu là bội của k.</span></div>
  <div class="kv"><span class="k">empty prefix (tiền tố rỗng)</span><span class="v">Tổng 0 "trước chỉ số 0"; hạt giống {0: 1} hoặc {0: −1} của mọi map tổng tiền tố.</span></div>
  <div class="kv"><span class="k">greedy + exchange argument (tham lam + lập luận đổi chỗ)</span><span class="v">Chọn cái tốt nhất tại chỗ, và chứng minh rằng đổi hai quyết định của một phương án tối ưu về thứ tự tham lam không bao giờ làm tệ đi.</span></div>
  <div class="kv"><span class="k">two’s complement (bù hai)</span><span class="v">Cách lưu số nguyên có dấu bằng bit; bit 31 là bit dấu của int 32 bit.</span></div>
  <div class="kv"><span class="k">band of rows (dải hàng)</span><span class="v">Các hàng top..bottom của ma trận được ép thành một mảng tổng theo cột.</span></div>
  <div class="kv"><span class="k">spaced repetition (lặp lại có khoảng cách)</span><span class="v">Làm lại một đề sau những khoảng giãn dần (3 ngày, 1 tuần) để nó bám chắc.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Tám đề, bốn công cụ: hash map, tổng tiền tố, sắp xếp, bit.</li>
<li>Quyết định map lưu gì và có ghi đè không; đề 1 và đề 5 cần hai câu trả lời ngược nhau.</li>
<li>Mọi map tổng tiền tố đều gieo sẵn tiền tố rỗng.</li>
<li>Tham lam bằng sắp xếp cần một câu chứng minh (đổi chỗ hai người, tổng không thể tăng).</li>
<li>Đếm bit xử lý "ba lần trừ một"; trong JS giữ bit 31 bằng <code>|</code>, không dùng <code>+</code>.</li>
<li>Bài tổng 2 chiều: cố định hai hàng, ép dẹt, rồi dùng lại công cụ 1 chiều.</li>
</ul>
${nguon('📗', 'NeetCode — practice list', 'Danh sách đề theo mẫu bài, mỗi đề có video lời giải (tiếng Anh)', 'https://neetcode.io/practice')}
${nguon('📘', 'Grind 75 — Tech Interview Handbook', 'Lịch luyện theo tuần, chỉnh được theo số giờ bạn có', 'https://www.techinterviewhandbook.org/grind75/')}
${nguon('🎯', 'Coding interview prep — Tech Interview Handbook', 'Cách luyện: bấm giờ, nói to, ôn lại lỗi sai (tiếng Anh)', 'https://www.techinterviewhandbook.org/coding-interview-prep/')}
</div>
`,
};
