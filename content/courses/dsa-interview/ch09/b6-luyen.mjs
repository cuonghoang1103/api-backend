/** 9.6 — Bộ luyện 9 (bài MỚI ★, slug dsa-9-6-luyen). Mã/output đọc từ ../ma/ch09/b6 (chạy thật bằng _chay.mjs). */
import { ma, maHai, ketQua, lc, nguon, gap, oMang, bangVet, baiNay } from '../_chung.mjs';
import { bangDP } from './_rieng.mjs';
import { bangLps } from '../ma/ch09/b6/lps.vet.mjs';
import { vetPartition } from '../ma/ch09/b6/partition.vet.mjs';

const L = {
  pascal: lc(118, 'pascals-triangle', "Pascal's Triangle", 'Easy'),
  prod: lc(152, 'maximum-product-subarray', 'Maximum Product Subarray', 'Medium'),
  sq: lc(279, 'perfect-squares', 'Perfect Squares', 'Medium'),
  ts: lc(494, 'target-sum', 'Target Sum', 'Medium'),
  il: lc(97, 'interleaving-string', 'Interleaving String', 'Medium'),
  lps: lc(516, 'longest-palindromic-subsequence', 'Longest Palindromic Subsequence', 'Medium'),
  pl: lc(763, 'partition-labels', 'Partition Labels', 'Medium'),
  re: lc(10, 'regular-expression-matching', 'Regular Expression Matching', 'Hard'),
};

/* Bảng DP của LC 516 cho "agbcba" — sinh bằng chạy công thức thật (lps.vet.mjs). */
const S_LPS = 'agbcba';
const { dp: DP_LPS, tu: TU_LPS } = bangLps(S_LPS);
const toLps = { '0,5': 'ok' };
for (let i = 0; i < S_LPS.length; i++) toLps[`${i},${i}`] = 'mo';
for (const [k, v] of Object.entries(TU_LPS)) if (v === 'both' && k !== '0,5') toLps[k] = 'cs';
const chuLps = {};
for (const [k, v] of Object.entries(TU_LPS)) if (v === 'both') chuLps[k] = '↙+2';
const NHAN = [...S_LPS].map((c, i) => `${i}:${c}`);
const BANG_LPS = bangDP(DP_LPS, { hang: NHAN.map((x) => `i=${x}`), cot: NHAN.map((x) => `j=${x}`), goc: 'dp[i][j]', to: toLps, chu: chuLps });

/* Bảng vết LC 763 cho "abacdcdefe" (partition.vet.mjs chạy đúng thuật toán). */
const S_PL = 'abacdcdefe';
const VET_PL = vetPartition(S_PL);
const CAT_PL = Object.fromEntries(VET_PL.filter((h) => h.cat).map((h) => [h.i, 'ok']));
const CHUOI_PL = `<p style="text-align:center">${oMang([...S_PL], { to: CAT_PL, chiSo: true })}</p>`;
const BANG_PL = bangVet(['i', 's[i]', 'last[s[i]]', 'current part [start..end]', 'cut?'],
  VET_PL.map((h) => [
    String(h.i),
    h.ch,
    String(h.last),
    `[${h.start}..${h.end}]`,
    h.cat ? `✅ i == end ⇒ size ${h.size}` : '—',
  ]));

const BANG = (en) => `<table>
<thead><tr><th>#</th><th>${en ? 'Problem' : 'Đề'}</th><th>${en ? 'Pattern' : 'Mẫu'}</th><th>${en ? 'Target time' : 'Thời gian mục tiêu'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${L.pascal}</td><td>${en ? '2D table: a cell = the two cells above' : 'bảng 2 chiều: một ô = hai ô phía trên'}</td><td>15′</td></tr>
<tr><td>2</td><td>${L.prod}</td><td>${en ? 'Kadane with two states (max and min)' : 'Kadane với hai trạng thái (lớn nhất và nhỏ nhất)'}</td><td>25′</td></tr>
<tr><td>3</td><td>${L.sq}</td><td>${en ? 'Coin Change in disguise (unbounded)' : 'Coin Change trá hình (dùng lại không giới hạn)'}</td><td>25′</td></tr>
<tr><td>4</td><td>${L.ts}</td><td>${en ? 'algebra → 0/1 knapsack that counts' : 'biến đổi đại số → cái túi 0/1 đếm cách'}</td><td>25′</td></tr>
<tr><td>5</td><td>${L.il}</td><td>${en ? '2D DP over two strings' : 'DP 2 chiều trên hai chuỗi'}</td><td>25′</td></tr>
<tr><td>6</td><td>${L.lps}</td><td>${en ? 'interval DP by length · LCS with the reverse' : 'DP khoảng theo độ dài · LCS với chuỗi đảo'}</td><td>25′</td></tr>
<tr><td>7</td><td>${L.pl}</td><td>${en ? 'greedy: last occurrence' : 'tham lam: vị trí xuất hiện cuối'}</td><td>25′</td></tr>
<tr><td>8</td><td>${L.re}</td><td>${en ? '2D DP with a star that stays · ReDoS' : 'DP 2 chiều với dấu sao "đứng yên" · ReDoS'}</td><td>40′</td></tr>
</tbody></table>`;

export default {
  title: '9.6 — Practice set 9: eight DP and greedy problems with step-by-step solutions|||9.6 — Bộ luyện 9: tám đề quy hoạch động và tham lam có lời giải từng bước',
  slug: 'dsa-9-6-luyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tám đề từ dễ tới khó phủ cả chương: Pascal, tích con lớn nhất, số chính phương, Target Sum, xen kẽ chuỗi, xâu con đối xứng, chia nhãn (tham lam), khớp biểu thức chính quy — mỗi lời giải nói 4 câu hỏi trước khi code, TS + Java chạy thật, kèm đo ReDoS.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Practice set 9: eight DP and greedy problems with step-by-step solutions</h2>
<p class="lead">Eight problems, easy to hard, chosen so that every shape of this chapter shows up at least once in a skin you have not seen yet: a first 2D table, Kadane with two states, Coin Change in disguise, a knapsack hidden behind algebra, two strings walked together, an interval DP, one greedy, and the regex matcher that interviewers use to separate "I memorised DP" from "I can define a state". Every solution starts with the same four answers — <strong>state · transition · base case · order</strong> — before any code. The last problem ends with a real measurement of a security bug that exists because people do not use DP.</p>
${BANG(true)}
<h3>How to practise with this page</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Start a timer</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′ — one problem slot in a real interview.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Say the four answers first</span><span class="lz-d">"dp[…] means ___; it comes from ___; the base case is ___; I fill it in ___ order." Write them as a comment before the first line of code (lesson 9.4).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Open hints one at a time</span><span class="lz-d">Only after 5 stuck minutes. Hint 1 names the pattern, hint 2 gives the state.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Submit, then compare</span><span class="lz-d">Submit on LeetCode, then read the solution here and write one notebook line: signal → state → complexity.</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Bộ luyện 9: tám đề quy hoạch động và tham lam có lời giải từng bước</h2>
<p class="lead">Tám đề, từ dễ tới khó, chọn sao cho mọi "hình dạng" của chương xuất hiện ít nhất một lần dưới một lớp vỏ bạn chưa gặp: bảng 2 chiều đầu tiên, Kadane với hai trạng thái, Coin Change trá hình, một bài cái túi giấu sau phép biến đổi đại số, hai chuỗi đi cùng nhau, một DP khoảng, một bài tham lam, và bài khớp biểu thức chính quy (regex) mà người phỏng vấn hay dùng để tách "tôi học thuộc DP" khỏi "tôi định nghĩa được trạng thái". Mọi lời giải đều mở đầu bằng cùng bốn câu trả lời — <strong>trạng thái · chuyển · cơ sở · thứ tự tính</strong> — trước bất kỳ dòng code nào. Đề cuối kết thúc bằng một phép đo thật về một lỗi bảo mật tồn tại chính vì người ta KHÔNG dùng DP.</p>
${BANG(false)}
<h3>Cách luyện với trang này</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bấm giờ</span><span class="lz-d">Easy 15′, Medium 25′, Hard 40′ — đúng độ dài một lượt đề trong buổi phỏng vấn thật.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nói bốn câu trả lời trước</span><span class="lz-d">"dp[…] nghĩa là ___; nó tính từ ___; ca cơ sở là ___; tôi điền theo thứ tự ___." Viết thành chú thích trước dòng code đầu tiên (bài 9.4).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Mở gợi ý từng cái một</span><span class="lz-d">Chỉ khi bí quá 5 phút. Gợi ý 1 gọi tên mẫu, gợi ý 2 cho luôn trạng thái.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nộp rồi mới so</span><span class="lz-d">Nộp trên LeetCode, sau đó đọc lời giải ở đây và ghi một dòng vào sổ: dấu hiệu → trạng thái → độ phức tạp.</span></div>
</div>
<p>Mỗi lời giải bên dưới có một <strong>phép tự kiểm ngẫu nhiên</strong> (random self-test) so với cách vét cạn chậm nhưng chắc đúng — dòng cuối của mỗi output in ra số ca đã thử và số ca lệch. Đó cũng là thói quen nên mang vào phòng phỏng vấn khi được chạy code: "em kiểm bằng một bản brute force nhỏ".</p>
</div>

<div class="ml-en">
<h3>1 · Pascal's Triangle — ${L.pascal}</h3>
<p><strong>Problem (in our words).</strong> Build the first <code>numRows</code> rows of the triangle where each row starts and ends with 1 and every inner number is the sum of the two numbers directly above it. With 4 rows: <code>[1]</code>, <code>[1,1]</code>, <code>[1,2,1]</code>, <code>[1,3,3,1]</code>.</p>
<p><strong>Recognise the pattern.</strong> "Every cell is computed from cells already computed" is the definition of a DP table. Here the problem even tells you the transition — your only jobs are the base case and the indices.</p>
${gap('💡 Hint 1', '<p>Row r has r + 1 cells. Which cells do not have two parents above them?</p>')}
${gap('💡 Hint 2', '<p>Fill a row with 1s first (that handles both ends), then overwrite cells 1 … r − 1 from the previous row.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>rows[r][c]</code> = the number in row r, column c. <strong>Transition:</strong> <code>rows[r][c] = rows[r−1][c−1] + rows[r−1][c]</code>. <strong>Base case:</strong> the first and last cell of every row is 1. <strong>Order:</strong> row by row, top to bottom. Time and output size are both O(n²) — you cannot do better because you must print n(n+1)/2 numbers. Edge cases tried: <code>numRows = 1</code>, and the largest row LeetCode allows (30 rows, middle cell 77,558,760 — still fits in an <code>int</code>). The self-test compares every cell with the binomial coefficient C(r, c).</p>')}
</div>
<div class="ml-vi">
<h3>1 · Pascal's Triangle — ${L.pascal}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Dựng <code>numRows</code> hàng đầu tiên của tam giác mà mỗi hàng mở đầu và kết thúc bằng 1, còn mỗi số bên trong bằng tổng hai số nằm ngay phía trên nó. Với 4 hàng: <code>[1]</code>, <code>[1,1]</code>, <code>[1,2,1]</code>, <code>[1,3,3,1]</code>.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Mỗi ô tính từ những ô đã tính xong" chính là định nghĩa của một bảng DP. Ở đây đề còn đưa sẵn công thức chuyển — việc của bạn chỉ là ca cơ sở và chỉ số.</p>
${gap('💡 Gợi ý 1', '<p>Hàng r có r + 1 ô. Những ô nào KHÔNG có đủ hai "cha" phía trên?</p>')}
${gap('💡 Gợi ý 2', '<p>Đổ đầy hàng bằng số 1 trước (lo luôn hai đầu), rồi ghi đè các ô 1 … r − 1 từ hàng trước.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>rows[r][c]</code> = số ở hàng r, cột c. <strong>Chuyển:</strong> <code>rows[r][c] = rows[r−1][c−1] + rows[r−1][c]</code>. <strong>Cơ sở:</strong> ô đầu và ô cuối mỗi hàng là 1. <strong>Thứ tự:</strong> từng hàng, từ trên xuống. Thời gian và kích thước output đều O(n²) — không thể nhanh hơn vì phải in ra n(n+1)/2 con số. Ca biên đã thử: <code>numRows = 1</code>, và hàng lớn nhất LeetCode cho phép (30 hàng, ô giữa 77.558.760 — vẫn vừa <code>int</code>). Phép tự kiểm so từng ô với tổ hợp C(r, c).</p>')}
</div>
${maHai('ch09/b6/pascal.ts', 'ch09/b6/LuPascal.java', { vung: 'giai' })}
${ketQua('ch09/b6/pascal.ts')}
<div class="ml-en">
<p>Why start a DP practice set with something this easy? Because it is the cleanest picture of the idea you will use seven more times on this page: a cell never recomputes anything — it <em>reads</em> two answers that already exist. In real life this exact table is how you count paths in a grid (each cell = paths from above + paths from the left) and how probability libraries compute binomial coefficients without factorials (which overflow long before row 30).</p>
</div>
<div class="ml-vi">
<p>Vì sao mở đầu bộ luyện DP bằng một đề dễ như vậy? Vì đó là hình ảnh sạch nhất của ý tưởng bạn sẽ dùng thêm bảy lần trên trang này: một ô không bao giờ tính lại gì cả — nó chỉ <em>đọc</em> hai đáp án đã có sẵn. Ngoài đời, đúng bảng này là cách đếm số đường đi trên lưới (mỗi ô = số đường từ trên xuống + số đường từ trái sang) và là cách các thư viện xác suất tính tổ hợp mà không cần giai thừa (giai thừa tràn số từ lâu trước hàng 30).</p>
</div>

<div class="ml-en">
<h3>2 · Maximum Product Subarray — ${L.prod}</h3>
<p><strong>Problem (in our words).</strong> Find the largest product of a contiguous, non-empty piece of an integer array. <code>[-2, 3, -4]</code> → 24 (the whole array: two negatives cancel). <code>[-2, 0, -1]</code> → 0.</p>
<p><strong>Recognise the pattern.</strong> "Best contiguous subarray" is Kadane's algorithm (lesson 9.2): keep the best answer <em>ending at i</em>. The twist is the sign: multiplying by a negative number turns the smallest product into the largest one. So one state is not enough.</p>
${gap('💡 Hint 1', '<p>What would you need to know at index i − 1 so that multiplying by a negative <code>nums[i]</code> gives the best product ending at i?</p>')}
${gap('💡 Hint 2', '<p>Keep two numbers: <code>hi</code> = largest product ending here, <code>lo</code> = smallest (most negative) product ending here. The new <code>hi</code> is the max of three candidates: x, hi·x, lo·x.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>hi[i]</code>, <code>lo[i]</code> = max and min product of a subarray that ends exactly at i. <strong>Transition:</strong> both are chosen among <code>x</code> (start fresh), <code>hi[i−1]·x</code>, <code>lo[i−1]·x</code>. <strong>Base case:</strong> <code>hi = lo = best = nums[0]</code>. <strong>Order:</strong> left to right, only the previous column is needed ⇒ two variables, O(1) memory, O(n) time. Compute both products <em>before</em> overwriting <code>hi</code> — overwriting first is a classic bug. Edge cases tried: a single negative <code>[-3]</code> (answer −3, so never start <code>best</code> at 0), zeros that reset everything, and an even number of negatives.</p>')}
</div>
<div class="ml-vi">
<h3>2 · Maximum Product Subarray — ${L.prod}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Tìm tích lớn nhất của một đoạn con liên tiếp, không rỗng, của mảng số nguyên. <code>[-2, 3, -4]</code> → 24 (cả mảng: hai số âm triệt dấu nhau). <code>[-2, 0, -1]</code> → 0.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Đoạn con liên tiếp tốt nhất" là thuật toán Kadane (bài 9.2): giữ đáp án tốt nhất <em>kết thúc tại i</em>. Điểm xoắn là dấu: nhân với một số âm biến tích nhỏ nhất thành tích lớn nhất. Nên một trạng thái là không đủ.</p>
${gap('💡 Gợi ý 1', '<p>Ở chỉ số i − 1 bạn cần biết gì để khi nhân với <code>nums[i]</code> âm thì ra tích tốt nhất kết thúc tại i?</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ hai số: <code>hi</code> = tích lớn nhất kết thúc ở đây, <code>lo</code> = tích nhỏ nhất (âm nhất) kết thúc ở đây. <code>hi</code> mới là max của ba ứng viên: x, hi·x, lo·x.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>hi[i]</code>, <code>lo[i]</code> = tích lớn nhất và nhỏ nhất của một đoạn con kết thúc ĐÚNG tại i. <strong>Chuyển:</strong> cả hai chọn trong <code>x</code> (bắt đầu lại), <code>hi[i−1]·x</code>, <code>lo[i−1]·x</code>. <strong>Cơ sở:</strong> <code>hi = lo = best = nums[0]</code>. <strong>Thứ tự:</strong> trái sang phải, chỉ cần cột trước ⇒ hai biến, bộ nhớ O(1), thời gian O(n). Tính cả hai tích <em>trước</em> khi ghi đè <code>hi</code> — ghi đè trước là lỗi kinh điển. Ca biên đã thử: một số âm duy nhất <code>[-3]</code> (đáp án −3, nên đừng bao giờ khởi tạo <code>best</code> bằng 0), số 0 làm mọi thứ về lại từ đầu, và số lượng số âm chẵn.</p>')}
</div>
${maHai('ch09/b6/max-product.ts', 'ch09/b6/LuMaxProduct.java', { vung: 'giai' })}
${ketQua('ch09/b6/max-product.ts')}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Copying Kadane from Maximum Subarray and keeping only the maximum.</strong></p><p>It passes the first example (<code>[2,3,-2,4]</code> → 6 either way), which is exactly why it is dangerous. On <code>[-2, 3, -4]</code> it answers 3 instead of 24: at index 1 it throws away −6 (the "worst" product), and −6 is the one that becomes +24 after multiplying by −4. The random self-test above says it bluntly: the one-state version is wrong on 1,040 of 3,000 small arrays.</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Chép Kadane của Maximum Subarray sang và chỉ giữ giá trị lớn nhất.</strong></p><p>Nó qua ví dụ đầu (<code>[2,3,-2,4]</code> → 6 ở cả hai bản), và chính vì thế mà nguy hiểm. Với <code>[-2, 3, -4]</code> nó trả 3 thay vì 24: ở chỉ số 1 nó vứt đi −6 (tích "tệ nhất"), mà −6 lại là thứ hoá thành +24 sau khi nhân với −4. Phép tự kiểm ngẫu nhiên ở trên nói thẳng: bản một trạng thái sai 1.040 trên 3.000 mảng nhỏ.</p></div>
</div>
${ma('ch09/b6/max-product.ts', { vung: 'sai', nhan: 'TypeScript — wrong (one state)' })}
<div class="ml-en">
<p>The general lesson for DP: when the transition can flip "best" and "worst" (a negative factor, a "buy" that becomes a "sell", a move that helps the opponent), your state needs <em>both</em> extremes. Kadane itself is in ${'<a href="' + baiNay('dsa-9-2-mot-chieu') + '">lesson 9.2</a>'}.</p>
</div>
<div class="ml-vi">
<p>Bài học chung của DP: khi phép chuyển có thể đảo "tốt nhất" thành "tệ nhất" (một thừa số âm, một lần "mua" trở thành "bán", một nước đi giúp đối thủ), trạng thái của bạn cần giữ <em>cả hai</em> cực trị. Kadane gốc nằm ở ${'<a href="' + baiNay('dsa-9-2-mot-chieu') + '">bài 9.2</a>'}.</p>
</div>

<div class="ml-en">
<h3>3 · Perfect Squares — ${L.sq}</h3>
<p><strong>Problem (in our words).</strong> Write a positive integer n as a sum of perfect squares (1, 4, 9, 16, …) using as few terms as possible, and return how many terms. 12 = 4 + 4 + 4 → 3; 13 = 4 + 9 → 2.</p>
<p><strong>Recognise the pattern.</strong> "Fewest pieces that add up to an amount, each piece may be reused" is Coin Change (lesson 9.2) word for word. The coins are not given — they are every square ≤ n.</p>
${gap('💡 Hint 1', '<p>Try the greedy idea first on 12: take the biggest square (9), then what is left. Count the terms. Is it optimal?</p>')}
${gap('💡 Hint 2', '<p><code>dp[i]</code> = fewest squares that sum to i. The last square used is some s² ≤ i, so <code>dp[i] = 1 + min over s of dp[i − s²]</code>.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>dp[i]</code> = minimum number of squares summing to i. <strong>Transition:</strong> <code>dp[i] = min(dp[i − s·s] + 1)</code> for every s with s·s ≤ i. <strong>Base case:</strong> <code>dp[0] = 0</code>; everything else starts at n + 1 ("impossible", because n ones always work). <strong>Order:</strong> i from 1 to n. Time O(n·√n), memory O(n). Use n + 1, not <code>Integer.MAX_VALUE</code>, as the sentinel in Java: <code>MAX_VALUE + 1</code> overflows to a negative number and wins every <code>min</code>. Edge cases tried: n = 1, n = 7 (needs 4: 4+1+1+1), and n = 10,000 (a square, answer 1). The self-test checks all n up to 10,000 against a theorem from number theory (Legendre: exactly the numbers of the form 4ᵃ(8b + 7) need four squares).</p>')}
</div>
<div class="ml-vi">
<h3>3 · Perfect Squares — ${L.sq}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Viết số nguyên dương n thành tổng các số chính phương (1, 4, 9, 16, …) với ít số hạng nhất, trả về số số hạng. 12 = 4 + 4 + 4 → 3; 13 = 4 + 9 → 2.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Ít mảnh nhất cộng lại thành một số tiền, mỗi mảnh được dùng lại" là Coin Change (bài 9.2) không sai một chữ. Đồng xu không được cho sẵn — chúng là mọi số chính phương ≤ n.</p>
${gap('💡 Gợi ý 1', '<p>Thử ý tham lam trước với 12: lấy số chính phương lớn nhất (9), rồi phần còn lại. Đếm số hạng. Có tối ưu không?</p>')}
${gap('💡 Gợi ý 2', '<p><code>dp[i]</code> = số số chính phương ít nhất có tổng i. Số chính phương dùng cuối là một s² ≤ i nào đó, nên <code>dp[i] = 1 + min theo s của dp[i − s²]</code>.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>dp[i]</code> = số số chính phương ít nhất có tổng bằng i. <strong>Chuyển:</strong> <code>dp[i] = min(dp[i − s·s] + 1)</code> với mọi s mà s·s ≤ i. <strong>Cơ sở:</strong> <code>dp[0] = 0</code>; mọi ô khác khởi đầu bằng n + 1 ("không thể", vì n số 1 luôn được). <strong>Thứ tự:</strong> i từ 1 tới n. Thời gian O(n·√n), bộ nhớ O(n). Trong Java dùng n + 1 làm lính canh (sentinel), đừng dùng <code>Integer.MAX_VALUE</code>: <code>MAX_VALUE + 1</code> tràn thành số âm và thắng mọi phép <code>min</code>. Ca biên đã thử: n = 1, n = 7 (cần 4: 4+1+1+1), và n = 10.000 (chính phương, đáp án 1). Phép tự kiểm đối chiếu mọi n tới 10.000 với một định lý số học (Legendre: đúng những số có dạng 4ᵃ(8b + 7) mới cần bốn số chính phương).</p>')}
</div>
${maHai('ch09/b6/perfect-squares.ts', 'ch09/b6/LuPerfectSquares.java', { vung: 'giai' })}
${ketQua('ch09/b6/perfect-squares.ts')}
<div class="ml-en">
<p>Read the "greedy" column: 12 → 4 (9+1+1+1) and 43 → 5 (36+4+1+1+1), while the DP finds 3 for both (4+4+4 and 25+9+9). Over all n ≤ 10,000, "take the biggest square" is wrong <strong>6,440 times</strong> — most of the time. That is the same trap as greedy Coin Change with coins [1, 3, 4] (lesson 9.5): greedy is only safe when you can prove it, and here you cannot.</p>
</div>
<div class="ml-vi">
<p>Đọc cột "greedy": 12 → 4 (9+1+1+1) và 43 → 5 (36+4+1+1+1), trong khi DP tìm ra 3 cho cả hai (4+4+4 và 25+9+9). Trên mọi n ≤ 10.000, "lấy số chính phương lớn nhất" sai <strong>6.440 lần</strong> — tức là đa số trường hợp. Đó đúng là cái bẫy Coin Change tham lam với mệnh giá [1, 3, 4] (bài 9.5): tham lam chỉ an toàn khi bạn chứng minh được, và ở đây thì không.</p>
</div>

<div class="ml-en">
<h3>4 · Target Sum — ${L.ts}</h3>
<p><strong>Problem (in our words).</strong> Put a + or − in front of every number of <code>nums</code> (order fixed) and count how many sign choices make the expression equal <code>target</code>. <code>[2, 1, 3]</code>, target 0 → 2 (+2 +1 −3 and −2 −1 +3).</p>
<p><strong>Recognise the pattern.</strong> Brute force is 2ⁿ sign patterns — the backtracking tree of Chapter 8. Every number is "in" one of two groups exactly once ⇒ 0/1 choices ⇒ knapsack. The trick that makes it clean is one line of algebra.</p>
${gap('💡 Hint 1', '<p>Call the numbers with + the group P and the numbers with − the group M. You know P + M (the total S) and you want P − M = target. Solve for P.</p>')}
${gap('💡 Hint 2', '<p>P = (S + target) / 2. Now the question is "how many subsets have sum P?" — a counting 0/1 knapsack. If S + target is odd or |target| > S, the answer is 0.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>dp[j]</code> = number of subsets of the numbers seen so far whose sum is j. <strong>Transition:</strong> for each number x, <code>dp[j] += dp[j − x]</code> (either x is not in the subset, the old <code>dp[j]</code>, or it is). <strong>Base case:</strong> <code>dp[0] = 1</code> (the empty subset). <strong>Order:</strong> numbers one by one, and for each number <strong>j from P down to x</strong>, so that <code>dp[j − x]</code> still means "without x". Time O(n·P), memory O(P). Edge cases tried: zeros (<code>[0, 0, 1]</code>, target 1 → 4, because +0 and −0 are different choices — the loop handles it since <code>dp[j] += dp[j]</code> doubles), |target| larger than the sum, odd S + target, and a single negative target (<code>[7]</code>, −7 → 1). The other valid approach is memoisation on the pair (index, running sum) with a map; it is closer to the brute force and fine when sums are small.</p>')}
</div>
<div class="ml-vi">
<h3>4 · Target Sum — ${L.ts}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Đặt dấu + hoặc − trước mỗi số của <code>nums</code> (thứ tự giữ nguyên) và đếm có bao nhiêu cách chọn dấu làm biểu thức bằng <code>target</code>. <code>[2, 1, 3]</code>, target 0 → 2 (+2 +1 −3 và −2 −1 +3).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Vét cạn là 2ⁿ cách chọn dấu — đúng cây quay lui của Chương 8. Mỗi số nằm trong một trong hai nhóm đúng một lần ⇒ lựa chọn 0/1 ⇒ cái túi (knapsack). Mẹo làm bài gọn gàng là một dòng đại số.</p>
${gap('💡 Gợi ý 1', '<p>Gọi các số mang dấu + là nhóm P, mang dấu − là nhóm M. Bạn biết P + M (tổng S) và muốn P − M = target. Giải ra P.</p>')}
${gap('💡 Gợi ý 2', '<p>P = (S + target) / 2. Giờ câu hỏi thành "có bao nhiêu tập con có tổng P?" — cái túi 0/1 dạng đếm. Nếu S + target lẻ hoặc |target| > S thì đáp án là 0.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>dp[j]</code> = số tập con (của các số đã xét) có tổng j. <strong>Chuyển:</strong> với mỗi số x, <code>dp[j] += dp[j − x]</code> (hoặc x không nằm trong tập — giữ <code>dp[j]</code> cũ, hoặc có). <strong>Cơ sở:</strong> <code>dp[0] = 1</code> (tập rỗng). <strong>Thứ tự:</strong> lần lượt từng số, và với mỗi số cho <strong>j chạy từ P XUỐNG x</strong>, để <code>dp[j − x]</code> vẫn còn nghĩa là "chưa có x". Thời gian O(n·P), bộ nhớ O(P). Ca biên đã thử: số 0 (<code>[0, 0, 1]</code>, target 1 → 4, vì +0 và −0 là hai lựa chọn khác nhau — vòng lặp tự xử lý vì <code>dp[j] += dp[j]</code> nhân đôi), |target| lớn hơn tổng, S + target lẻ, và target âm (<code>[7]</code>, −7 → 1). Cách đúng còn lại là nhớ (memo) theo cặp (chỉ số, tổng hiện tại) bằng một map; gần với vét cạn hơn và vẫn ổn khi tổng nhỏ.</p>')}
</div>
${maHai('ch09/b6/target-sum.ts', 'ch09/b6/LuTargetSum.java', { vung: 'giai' })}
${ketQua('ch09/b6/target-sum.ts')}
<div class="ml-en">
<p>Look at the last column: with j going <em>up</em>, <code>[1,1,1,1,1]</code> target 3 gives 70 instead of 5. Going up, <code>dp[j − x]</code> has already been updated with the same x, so one number is counted as if it could be used again and again — that loop solves the <em>unbounded</em> problem (Coin Change II style), not this one. Direction of the inner loop is the entire difference between "each item once" and "each item any number of times"; lesson 9.3 shows it on the classic knapsack.</p>
</div>
<div class="ml-vi">
<p>Nhìn cột cuối: khi j chạy <em>lên</em>, <code>[1,1,1,1,1]</code> target 3 ra 70 thay vì 5. Chạy lên thì <code>dp[j − x]</code> đã được cập nhật bằng chính x đó rồi, nên một số được tính như thể dùng lại được nhiều lần — vòng lặp đó giải bài <em>không giới hạn</em> (kiểu Coin Change II), không phải bài này. Chiều của vòng lặp trong là toàn bộ sự khác nhau giữa "mỗi món một lần" và "mỗi món bao nhiêu lần cũng được"; bài 9.3 cho thấy điều này trên bài cái túi kinh điển.</p>
</div>

<div class="ml-en">
<h3>5 · Interleaving String — ${L.il}</h3>
<p><strong>Problem (in our words).</strong> Can <code>s3</code> be made by shuffling <code>s1</code> and <code>s2</code> together like two decks of cards — keeping the order inside each deck? <code>s1 = "ab"</code>, <code>s2 = "cd"</code>: <code>"acbd"</code> yes, <code>"adbc"</code> no (d came before c).</p>
<p><strong>Recognise the pattern.</strong> Two strings walked with two pointers, and at each step a <em>choice</em> (take from s1 or from s2) that can be wrong only later ⇒ greedy fails, backtracking repeats work, a 2D DP over (how much of s1, how much of s2) fits exactly.</p>
${gap('💡 Hint 1', '<p>Why does a greedy "take from s1 whenever it matches" fail? Try s1 = "aab", s2 = "ab", s3 = "abaab".</p>')}
${gap('💡 Hint 2', '<p><code>dp[i][j]</code> = can the first i chars of s1 and the first j chars of s2 form the first i + j chars of s3? The last char placed came from s1 or from s2.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>dp[i][j]</code> as in hint 2 — note that the position in s3 is not a third dimension, it is always i + j. <strong>Transition:</strong> <code>dp[i][j]</code> is true if (<code>dp[i−1][j]</code> and <code>s1[i−1] == s3[i+j−1]</code>) or (<code>dp[i][j−1]</code> and <code>s2[j−1] == s3[i+j−1]</code>). <strong>Base case:</strong> <code>dp[0][0] = true</code>. <strong>Order:</strong> row by row; each cell needs the cell above and the cell to the left. Time and memory O(n·m) (memory can be one row). <strong>First line of the function:</strong> if the lengths do not add up, return false — without it the index i + j − 1 can run past the end of s3. Edge cases tried: an empty s1, lengths that do not add up, and the greedy trap from hint 1 (the answer is true, but taking "a" from s1 first leads to a dead end).</p>')}
</div>
<div class="ml-vi">
<h3>5 · Interleaving String — ${L.il}</h3>
<p><strong>Đề (diễn đạt lại).</strong> <code>s3</code> có tạo được bằng cách xào <code>s1</code> và <code>s2</code> vào nhau như xào hai cỗ bài — giữ nguyên thứ tự bên trong mỗi cỗ — không? <code>s1 = "ab"</code>, <code>s2 = "cd"</code>: <code>"acbd"</code> được, <code>"adbc"</code> không (d đứng trước c).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Hai chuỗi đi bằng hai con trỏ, và mỗi bước có một <em>lựa chọn</em> (lấy từ s1 hay từ s2) mà chỉ về sau mới biết là sai ⇒ tham lam trượt, quay lui làm lặp việc, còn DP 2 chiều theo (đã dùng bao nhiêu của s1, bao nhiêu của s2) thì vừa khít.</p>
${gap('💡 Gợi ý 1', '<p>Vì sao tham lam "khớp với s1 thì cứ lấy từ s1" trượt? Thử s1 = "aab", s2 = "ab", s3 = "abaab".</p>')}
${gap('💡 Gợi ý 2', '<p><code>dp[i][j]</code> = i ký tự đầu của s1 và j ký tự đầu của s2 có ghép thành i + j ký tự đầu của s3 không? Ký tự đặt sau cùng đến từ s1 hoặc từ s2.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>dp[i][j]</code> như gợi ý 2 — để ý vị trí trong s3 KHÔNG phải chiều thứ ba, nó luôn là i + j. <strong>Chuyển:</strong> <code>dp[i][j]</code> đúng nếu (<code>dp[i−1][j]</code> và <code>s1[i−1] == s3[i+j−1]</code>) hoặc (<code>dp[i][j−1]</code> và <code>s2[j−1] == s3[i+j−1]</code>). <strong>Cơ sở:</strong> <code>dp[0][0] = true</code>. <strong>Thứ tự:</strong> từng hàng; mỗi ô cần ô phía trên và ô bên trái. Thời gian và bộ nhớ O(n·m) (bộ nhớ thu được về một hàng). <strong>Dòng đầu tiên của hàm:</strong> nếu độ dài cộng lại không khớp thì trả false — thiếu nó thì chỉ số i + j − 1 có thể vượt quá cuối s3. Ca biên đã thử: s1 rỗng, độ dài không khớp, và cái bẫy tham lam của gợi ý 1 (đáp án là true, nhưng lấy "a" từ s1 trước thì đi vào ngõ cụt).</p>')}
</div>
${maHai('ch09/b6/interleave.ts', 'ch09/b6/LuInterleave.java', { vung: 'giai' })}
${ketQua('ch09/b6/interleave.ts')}
<div class="ml-en">
<p>"Two sequences merged while each keeps its own order" is not just a puzzle: it is what a log aggregator checks when it merges two services' logs by timestamp, and what a test for a concurrent queue checks ("is this output a legal interleaving of what thread A and thread B pushed?").</p>
</div>
<div class="ml-vi">
<p>"Hai dãy gộp lại mà mỗi dãy giữ thứ tự riêng" không chỉ là câu đố: đó là thứ một hệ thống gom log kiểm khi trộn log của hai dịch vụ theo thời gian, và thứ một bài test cho hàng đợi chạy song song kiểm ("output này có phải một cách xen kẽ hợp lệ của những gì luồng A và luồng B đã đẩy vào không?").</p>
</div>

<div class="ml-en">
<h3>6 · Longest Palindromic Subsequence — ${L.lps}</h3>
<p><strong>Problem (in our words).</strong> Delete some characters (possibly none) from <code>s</code> without reordering the rest, so that what remains reads the same both ways. Return the longest possible length. <code>"agbcba"</code> → 5 (<code>"abcba"</code>).</p>
<p><strong>Recognise the pattern.</strong> "Subsequence" (not substring) + a property that depends on <em>both ends</em> ⇒ a DP on intervals <code>[i..j]</code>, filled from short intervals to long ones. There is also a shortcut worth knowing: a palindromic subsequence of s is a common subsequence of s and its reverse.</p>
${gap('💡 Hint 1', '<p>Look only at the two ends s[i] and s[j]. If they are equal, what can you say? If they are not, one of them is useless — which one?</p>')}
${gap('💡 Hint 2', '<p><code>dp[i][j]</code> = answer for the piece s[i..j]. Equal ends: <code>dp[i+1][j−1] + 2</code>. Different ends: <code>max(dp[i+1][j], dp[i][j−1])</code>.</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>dp[i][j]</code> = longest palindromic subsequence inside s[i..j]. <strong>Transition:</strong> hint 2. <strong>Base case:</strong> <code>dp[i][i] = 1</code>; an empty piece (j &lt; i) is 0 — that is what makes "two equal neighbours" give 2. <strong>Order:</strong> every cell needs cells that are <em>shorter</em> intervals: below it (i + 1) and to its left (j − 1). So loop i from n − 1 <strong>down</strong> to 0 and j from i + 1 <strong>up</strong>. Time and memory O(n²). The alternative LCS(s, reverse(s)) gives the same numbers (the output prints both) — say it as the "I recognise this as LCS" move, then code whichever you trust more. Edge cases tried: a single character, all different characters (answer 1), and a string that is already a palindrome.</p>')}
</div>
<div class="ml-vi">
<h3>6 · Longest Palindromic Subsequence — ${L.lps}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Xoá một số ký tự (có thể không xoá) của <code>s</code> mà không đổi thứ tự phần còn lại, sao cho phần còn lại đọc xuôi ngược như nhau (đối xứng — palindrome). Trả về độ dài dài nhất có thể. <code>"agbcba"</code> → 5 (<code>"abcba"</code>).</p>
<p><strong>Nhận ra mẫu thế nào.</strong> "Dãy con" (subsequence — không cần liền nhau, khác với substring) + một tính chất phụ thuộc <em>cả hai đầu</em> ⇒ DP trên khoảng <code>[i..j]</code>, điền từ khoảng ngắn tới khoảng dài. Còn một đường tắt nên biết: dãy con đối xứng của s chính là dãy con chung của s và chuỗi đảo của nó.</p>
${gap('💡 Gợi ý 1', '<p>Chỉ nhìn hai đầu s[i] và s[j]. Nếu chúng bằng nhau thì nói được gì? Nếu khác nhau thì một trong hai vô dụng — cái nào?</p>')}
${gap('💡 Gợi ý 2', '<p><code>dp[i][j]</code> = đáp án cho đoạn s[i..j]. Hai đầu bằng nhau: <code>dp[i+1][j−1] + 2</code>. Khác nhau: <code>max(dp[i+1][j], dp[i][j−1])</code>.</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>dp[i][j]</code> = độ dài dãy con đối xứng dài nhất trong s[i..j]. <strong>Chuyển:</strong> gợi ý 2. <strong>Cơ sở:</strong> <code>dp[i][i] = 1</code>; đoạn rỗng (j &lt; i) là 0 — chính điều này làm "hai ký tự kề nhau bằng nhau" ra 2. <strong>Thứ tự:</strong> mỗi ô cần các ô là khoảng <em>ngắn hơn</em>: phía dưới (i + 1) và bên trái (j − 1). Nên cho i chạy từ n − 1 <strong>xuống</strong> 0 và j từ i + 1 <strong>lên</strong>. Thời gian và bộ nhớ O(n²). Cách khác LCS(s, đảo(s)) cho cùng con số (output in cả hai) — hãy nói nó ra như nước đi "em nhận ra đây là LCS", rồi code cách nào bạn chắc tay hơn. Ca biên đã thử: một ký tự, toàn ký tự khác nhau (đáp án 1), và chuỗi vốn đã đối xứng.</p>')}
</div>
${maHai('ch09/b6/lps.ts', 'ch09/b6/LuLps.java', { vung: 'giai' })}
${ketQua('ch09/b6/lps.ts')}
<div class="ml-en">
<h3>The table for "agbcba", cell by cell</h3>
<p>Rows are i, columns are j; only the upper triangle (i ≤ j) is used. Grey = the diagonal base cases (1). Light green with "↙+2" = the two ends are equal, so the cell took the value diagonally down-left and added 2; every other cell copied the larger of "below" and "left". Dark green = the answer <code>dp[0][5] = 5</code>. Follow it back: a = a at (0, 5) → (1, 4) "gbcb" → b = b at (2, 4) → (3, 3) the middle c. Those are the five letters a·b·c·b·a. This table was produced by running the transition, not typed.</p>
</div>
<div class="ml-vi">
<h3>Bảng của "agbcba", từng ô một</h3>
<p>Hàng là i, cột là j; chỉ dùng tam giác trên (i ≤ j). Ô xám = ca cơ sở trên đường chéo (1). Ô xanh nhạt có "↙+2" = hai đầu bằng nhau, nên ô lấy giá trị ở chéo dưới-trái rồi cộng 2; mọi ô khác chép số lớn hơn giữa "phía dưới" và "bên trái". Ô xanh đậm = đáp án <code>dp[0][5] = 5</code>. Lần ngược lại: a = a ở (0, 5) → (1, 4) "gbcb" → b = b ở (2, 4) → (3, 3) chữ c ở giữa. Đó là năm chữ a·b·c·b·a. Bảng này sinh ra bằng cách chạy công thức chuyển, không gõ tay.</p>
</div>
${BANG_LPS}
<div class="ml-en">
<p>Notice the order rule in action: cell (1, 4) (ends g ≠ b) needs (2, 4) = 3, which is in a <em>lower</em> row. If you loop i upwards from 0, that cell is still 0 when you read it — the answer silently comes out too small. "Which cells does a cell read, and are they already filled?" is the fourth question, and in interval DP it is the one people get wrong.</p>
</div>
<div class="ml-vi">
<p>Để ý luật thứ tự đang làm việc: ô (1, 4) (hai đầu g ≠ b) cần ô (2, 4) = 3, nằm ở một hàng <em>thấp hơn</em>. Nếu bạn cho i chạy lên từ 0 thì lúc đọc, ô đó vẫn là 0 — đáp án lặng lẽ ra nhỏ hơn thật. "Một ô đọc những ô nào, và chúng đã được điền chưa?" là câu hỏi thứ tư, và với DP khoảng, đó là câu người ta hay trả lời sai nhất.</p>
</div>

<div class="ml-en">
<h3>7 · Partition Labels — ${L.pl}</h3>
<p><strong>Problem (in our words).</strong> Cut a lowercase string into as many consecutive pieces as possible so that every letter appears in at most one piece. Return the piece sizes. <code>"abacdcdefe"</code> → <code>[3, 4, 3]</code> ("aba" | "cdcd" | "efe").</p>
<p><strong>Recognise the pattern.</strong> This is the one greedy problem of the set, placed here on purpose: after six DPs your hand wants to build a table. Ask first whether a local rule can be <em>proved</em> safe. The rule: a piece that contains letter c cannot end before the last c.</p>
${gap('💡 Hint 1', '<p>Precompute, for every letter, the index of its last occurrence. Then walk left to right.</p>')}
${gap('💡 Hint 2', '<p>Keep <code>end</code> = the furthest last-occurrence of any letter in the current piece. When i reaches <code>end</code>, nothing inside needs to go further: cut.</p>')}
${gap('✅ Step-by-step solution', '<p>Two passes. First: <code>last[c]</code> for every letter. Second: <code>end = max(end, last[s[i]])</code>; when <code>i == end</code>, record <code>end − start + 1</code> and start a new piece at i + 1. <strong>Why greedy is safe:</strong> cutting at the first moment it is legal never hurts — any valid partition must keep everything up to <code>end</code> together, so cutting there is forced, and cutting as early as possible leaves the most room for later cuts (an "exchange argument", lesson 9.5). Time O(n), memory O(26). The self-test compares the number of pieces with a brute force that tries all 2ⁿ⁻¹ cut sets. Edge cases tried: one repeated letter (one piece), all distinct letters (n pieces), and a string whose first and last letters are equal (one piece).</p>')}
</div>
<div class="ml-vi">
<h3>7 · Partition Labels — ${L.pl}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cắt một chuỗi chữ thường thành nhiều đoạn liên tiếp nhất có thể sao cho mỗi chữ cái chỉ xuất hiện trong tối đa một đoạn. Trả về kích thước các đoạn. <code>"abacdcdefe"</code> → <code>[3, 4, 3]</code> ("aba" | "cdcd" | "efe").</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Đây là đề tham lam duy nhất của bộ, đặt ở đây có chủ đích: sau sáu bài DP, tay bạn sẽ muốn dựng bảng. Hãy hỏi trước: có luật cục bộ nào <em>chứng minh</em> được là an toàn không? Luật: một đoạn chứa chữ c không thể kết thúc trước chữ c cuối cùng.</p>
${gap('💡 Gợi ý 1', '<p>Tính trước, với mỗi chữ cái, vị trí xuất hiện cuối cùng của nó. Rồi đi từ trái sang phải.</p>')}
${gap('💡 Gợi ý 2', '<p>Giữ <code>end</code> = vị trí xuất hiện cuối xa nhất của mọi chữ trong đoạn hiện tại. Khi i tới <code>end</code>, không chữ nào bên trong cần kéo dài hơn nữa: cắt.</p>')}
${gap('✅ Lời giải từng bước', '<p>Hai lượt. Lượt một: <code>last[c]</code> cho mọi chữ. Lượt hai: <code>end = max(end, last[s[i]])</code>; khi <code>i == end</code> thì ghi <code>end − start + 1</code> và mở đoạn mới tại i + 1. <strong>Vì sao tham lam an toàn:</strong> cắt ngay lúc đầu tiên được phép không bao giờ thiệt — mọi cách chia hợp lệ đều phải giữ mọi thứ tới <code>end</code> chung một đoạn, nên chỗ cắt đó là bắt buộc, và cắt sớm nhất có thể để lại nhiều chỗ nhất cho các nhát cắt sau (lập luận đổi chỗ — exchange argument, bài 9.5). Thời gian O(n), bộ nhớ O(26). Phép tự kiểm so số đoạn với một bản vét cạn thử cả 2ⁿ⁻¹ cách đặt nhát cắt. Ca biên đã thử: một chữ lặp lại (một đoạn), toàn chữ khác nhau (n đoạn), và chuỗi có chữ đầu bằng chữ cuối (một đoạn).</p>')}
</div>
${maHai('ch09/b6/partition-labels.ts', 'ch09/b6/LuPartitionLabels.java', { vung: 'giai' })}
${ketQua('ch09/b6/partition-labels.ts')}
<div class="ml-en">
<h3>Watch the greedy cut</h3>
<p>The strip shows the string with its indices; dark green marks the three places where a piece closes (indices 2, 6, 9). In the table, the column "current part" is the piece being built and how far <code>end</code> reaches; a cut happens exactly when <code>i == end</code>. Note row 3: reaching "c" (last at 5) stretches <code>end</code>, and at row 4 "d" (last at 6) stretches it again — a piece can only grow until i catches up. This table was produced by running the algorithm.</p>
</div>
<div class="ml-vi">
<h3>Xem nhát cắt tham lam</h3>
<p>Dải ô cho thấy chuỗi kèm chỉ số; ô xanh đậm đánh dấu ba chỗ một đoạn khép lại (chỉ số 2, 6, 9). Trong bảng, cột "current part" là đoạn đang dựng và <code>end</code> đang với tới đâu; nhát cắt xảy ra đúng khi <code>i == end</code>. Để ý dòng 3: gặp "c" (cuối ở 5) kéo <code>end</code> ra, và dòng 4 gặp "d" (cuối ở 6) kéo tiếp — một đoạn chỉ có thể dài thêm cho tới khi i đuổi kịp. Bảng này sinh ra bằng cách chạy thuật toán.</p>
</div>
${CHUOI_PL}
${BANG_PL}
<div class="ml-en">
<p>Where you meet this shape at work: splitting a batch of database rows into independent transactions so that all rows of one customer land in the same transaction, or splitting a monorepo build so that files that import each other stay in one job. "Extend the group until it is closed under the relation" — then cut.</p>
</div>
<div class="ml-vi">
<p>Ở chỗ làm bạn gặp hình dạng này khi: chia một lô dòng dữ liệu thành các giao dịch (transaction) độc lập sao cho mọi dòng của một khách hàng nằm chung một giao dịch, hay chia bản build của một monorepo sao cho các tệp import lẫn nhau nằm chung một job. "Kéo dài nhóm cho tới khi nó khép kín theo quan hệ" — rồi cắt. Bài 9.5 dạy kỹ khi nào tham lam đúng: ${'<a href="' + baiNay('dsa-9-5-greedy') + '">9.5 — Tham lam</a>'}.</p>
</div>

<div class="ml-en">
<h3>8 · Regular Expression Matching — ${L.re}</h3>
<p><strong>Problem (in our words).</strong> Implement a tiny regex matcher. The pattern has letters, <code>.</code> (any one character) and <code>x*</code> (zero or more copies of the character just before the star). The whole string must match the whole pattern. <code>("abbb", "ab*")</code> → true; <code>("ac", "a.c")</code> → false; <code>("", "x*y*")</code> → true.</p>
<p><strong>Recognise the pattern.</strong> Two strings, a pointer in each, and a choice at every star ("use it zero times or eat one more char") ⇒ the same 2D shape as problem 5. The recursion is short and correct — and exponential. The table is O(n·m).</p>
${gap('💡 Hint 1', '<p>Treat <code>x*</code> as ONE token. When the pattern is at a star token, you have exactly two moves: skip the token, or (if s[i] matches x) consume one character of s and stay on the same token.</p>')}
${gap('💡 Hint 2', '<p><code>dp[i][j]</code> = does the prefix s[0..i) match the prefix p[0..j)? The first row is not all false: an empty string matches "a*b*".</p>')}
${gap('✅ Step-by-step solution', '<p><strong>State:</strong> <code>dp[i][j]</code> as in hint 2. <strong>Transition:</strong> if <code>p[j−1]</code> is a letter or a dot: <code>dp[i][j] = matches(s[i−1], p[j−1]) &amp;&amp; dp[i−1][j−1]</code>. If <code>p[j−1] == "*"</code> with x = <code>p[j−2]</code>: <code>dp[i][j] = dp[i][j−2]</code> (zero copies) <strong>or</strong> (<code>matches(s[i−1], x) &amp;&amp; dp[i−1][j]</code>) — note <code>j</code>, not <code>j − 1</code>: after eating one character you stay on the star, which is how "one or more" is expressed without a loop. <strong>Base case:</strong> <code>dp[0][0] = true</code>, and <code>dp[0][j] = dp[0][j−2]</code> when <code>p[j−1]</code> is a star. <strong>Order:</strong> row by row, left to right. Time and memory O(n·m). The self-test compares the result with the language&#39;s own regex engine on 3,000 random pairs: 0 mismatches. Edge cases tried: empty s, a pattern that is only stars, <code>".*"</code> followed by a letter that is missing.</p>')}
</div>
<div class="ml-vi">
<h3>8 · Regular Expression Matching — ${L.re}</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cài một bộ khớp biểu thức chính quy tí hon. Mẫu (pattern) gồm chữ cái, <code>.</code> (một ký tự bất kỳ) và <code>x*</code> (không hoặc nhiều bản sao của ký tự ngay trước dấu sao). Phải khớp TOÀN BỘ chuỗi với TOÀN BỘ mẫu. <code>("abbb", "ab*")</code> → true; <code>("ac", "a.c")</code> → false; <code>("", "x*y*")</code> → true.</p>
<p><strong>Nhận ra mẫu thế nào.</strong> Hai chuỗi, mỗi chuỗi một con trỏ, và ở mỗi dấu sao có một lựa chọn ("dùng nó không lần nào, hay ăn thêm một ký tự") ⇒ cùng hình dạng 2 chiều với đề 5. Bản đệ quy thì ngắn và đúng — và bùng nổ. Bảng thì O(n·m).</p>
${gap('💡 Gợi ý 1', '<p>Coi <code>x*</code> là MỘT ký hiệu. Khi mẫu đang ở một ký hiệu có sao, bạn có đúng hai nước: bỏ qua ký hiệu đó, hoặc (nếu s[i] khớp x) ăn một ký tự của s và VẪN ĐỨNG trên ký hiệu đó.</p>')}
${gap('💡 Gợi ý 2', '<p><code>dp[i][j]</code> = tiền tố s[0..i) có khớp tiền tố p[0..j) không? Hàng đầu tiên KHÔNG toàn false: chuỗi rỗng khớp "a*b*".</p>')}
${gap('✅ Lời giải từng bước', '<p><strong>Trạng thái:</strong> <code>dp[i][j]</code> như gợi ý 2. <strong>Chuyển:</strong> nếu <code>p[j−1]</code> là chữ hoặc dấu chấm: <code>dp[i][j] = khớp(s[i−1], p[j−1]) &amp;&amp; dp[i−1][j−1]</code>. Nếu <code>p[j−1] == "*"</code> với x = <code>p[j−2]</code>: <code>dp[i][j] = dp[i][j−2]</code> (không bản sao nào) <strong>hoặc</strong> (<code>khớp(s[i−1], x) &amp;&amp; dp[i−1][j]</code>) — để ý là <code>j</code>, không phải <code>j − 1</code>: ăn một ký tự xong vẫn đứng ở dấu sao, đó là cách diễn đạt "một hoặc nhiều" mà không cần vòng lặp. <strong>Cơ sở:</strong> <code>dp[0][0] = true</code>, và <code>dp[0][j] = dp[0][j−2]</code> khi <code>p[j−1]</code> là dấu sao. <strong>Thứ tự:</strong> từng hàng, trái sang phải. Thời gian và bộ nhớ O(n·m). Phép tự kiểm so kết quả với chính bộ regex của ngôn ngữ trên 3.000 cặp ngẫu nhiên: 0 ca lệch. Ca biên đã thử: s rỗng, mẫu chỉ toàn ký hiệu có sao, <code>".*"</code> theo sau là một chữ không có trong s.</p>')}
</div>
${maHai('ch09/b6/regex-dp.ts', 'ch09/b6/LuRegex.java', { vung: 'giai' })}
${ketQua('ch09/b6/regex-dp.ts')}

<div class="ml-en">
<h3>🕵️ The attacker's view: ReDoS — when the regex engine does not use DP</h3>
<p>The regex engines in JavaScript (V8's irregexp) and in Java (<code>java.util.regex</code>) are <strong>backtracking</strong> engines: they try one way to match, and on failure go back and try the next, exactly like the naive recursion of problem 8. They support features (back-references, look-arounds) that a pure table cannot, and on normal input they are fast. On a carefully chosen input they explore an exponential or very high-polynomial number of paths. An attacker who controls the input — a form field, a header, a JSON value — sends that input and one request pins a CPU core. In Node, one blocked event loop means <em>every</em> user waits. This attack is called <strong>ReDoS</strong> (Regular expression Denial of Service). It is not theoretical: Stack Overflow went down for 34 minutes on 20 July 2016 because a whitespace-trimming regex met a post with about 20,000 spaces, and Cloudflare&#39;s whole network served errors for about 27 minutes on 2 July 2019 because of one regex in a firewall rule.</p>
<p>Measured on this machine (Apple M1 Max) — the classic evil pattern <code>(a+)+</code> against <code>"aaa…a!"</code>, which can never match, and part B: the naive recursion of problem 8 versus the DP on an LC 10 pattern with eight stars:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: ReDoS — khi bộ regex KHÔNG dùng DP</h3>
<p>Bộ regex của JavaScript (irregexp trong V8) và của Java (<code>java.util.regex</code>) là bộ máy <strong>quay lui</strong> (backtracking): thử một cách khớp, hỏng thì lùi lại thử cách kế tiếp, y hệt bản đệ quy ngây thơ của đề 8. Chúng hỗ trợ những tính năng (tham chiếu ngược, nhìn trước/nhìn sau) mà một cái bảng thuần tuý không làm được, và với input bình thường thì chúng nhanh. Với một input chọn kỹ, chúng duyệt một số đường đi theo hàm mũ hoặc đa thức bậc rất cao. Kẻ tấn công điều khiển input — một ô form, một header, một giá trị JSON — gửi đúng input đó và một request làm một nhân CPU chạy hết công suất. Trong Node, một event loop bị chặn nghĩa là <em>mọi</em> người dùng phải chờ. Kiểu tấn công này gọi là <strong>ReDoS</strong> (từ chối dịch vụ bằng biểu thức chính quy). Nó không phải lý thuyết: Stack Overflow sập 34 phút ngày 20/7/2016 vì một regex cắt khoảng trắng gặp một bài đăng có khoảng 20.000 dấu cách, và cả mạng lưới Cloudflare trả lỗi khoảng 27 phút ngày 2/7/2019 chỉ vì một regex trong một luật tường lửa.</p>
<p>Đo trên máy này (Apple M1 Max) — mẫu độc kinh điển <code>(a+)+</code> với <code>"aaa…a!"</code> (không bao giờ khớp), và phần B: bản đệ quy ngây thơ của đề 8 so với DP, trên một mẫu LC 10 có tám dấu sao:</p>
</div>
${ma('ch09/b6/redos-do.ts', { vung: 'naive', nhan: 'TypeScript — the naive recursion measured in part B' })}
${ketQua('ch09/b6/redos-do.ts')}
${ketQua('ch09/b6/LuRedosDo.java')}
<div class="ml-en">
<p>Read the numbers like an engineer. <strong>Node, part A:</strong> every extra "a" exactly <strong>doubles</strong> the time — 1.8 ms at 18 characters, 909 ms at 27. Extrapolate: 37 characters ≈ 15 minutes, a 40-character form field ≈ two hours of CPU for one request. <strong>Part B</strong> shows the same disease in our own code: the naive LC 10 recursion makes 110 million calls for a 30-character string (about 1 second in Node), while the DP fills 558 cells in 0.006 ms — five orders of magnitude, from writing down the answers instead of rediscovering them. <strong>Java</strong> is a useful surprise: Java 21 shrugs off <code>(a+)+</code> (0.02–0.08 ms at every n — the engine has optimisations for this textbook shape), but <code>(.*a){12}</code> still blows up (5 ms at 16 characters, 1.1 s at 28, roughly ×3 per two extra characters). A patched engine protects against the famous pattern, not against the class of bug.</p>
<p><strong>Defences you can name, checked against what we measured:</strong> (1) never run a regex with nested quantifiers (<code>(a+)+</code>, <code>(.*x){k}</code>, <code>(a|aa)+</code>) on input you do not control; (2) <strong>cap the input length before</strong> any super-linear work — this repository does exactly that before its own O(n·m) DP: <code>src/services/ctlanguage/thiNoiThuan.ts › sachBanGhiNoi</code> keeps at most 80 transcript entries of at most 4,000 characters each before <code>doKhopNhacLai</code> runs an LCS table on them, and the text normaliser it uses, <code>chuanHoaDapAn</code> in <code>thiThuan.ts</code>, is one plain character class with no nesting — linear by construction; (3) run risky matching off the main thread with a timeout (a worker you can kill); (4) when you need guaranteed linear time, use an engine built on automata instead of backtracking (Google&#39;s RE2 is the reference; the first link below explains the theory). And the interview take-away: when someone asks "why learn DP if the language has regex?", you now have a measured answer.</p>
</div>
<div class="ml-vi">
<p>Đọc số như một kỹ sư. <strong>Node, phần A:</strong> mỗi chữ "a" thêm vào làm thời gian <strong>nhân đôi</strong> chính xác — 1,8 ms ở 18 ký tự, 909 ms ở 27. Ngoại suy: 37 ký tự ≈ 15 phút, một ô form 40 ký tự ≈ hai giờ CPU cho một request. <strong>Phần B</strong> cho thấy cùng căn bệnh trong chính code của ta: bản đệ quy LC 10 ngây thơ gọi 110 triệu lần với chuỗi 30 ký tự (khoảng 1 giây trên Node), trong khi DP điền 558 ô trong 0,006 ms — chênh năm bậc độ lớn, chỉ nhờ ghi lại đáp án thay vì tìm lại. <strong>Java</strong> là một bất ngờ đáng giá: Java 21 bỏ qua <code>(a+)+</code> dễ dàng (0,02–0,08 ms ở mọi n — bộ máy có tối ưu riêng cho dạng kinh điển này), nhưng <code>(.*a){12}</code> vẫn nổ (5 ms ở 16 ký tự, 1,1 giây ở 28, cỡ ×3 mỗi khi thêm hai ký tự). Một bộ máy đã vá chỉ chống được mẫu nổi tiếng, không chống được cả LOẠI lỗi.</p>
<p><strong>Cách phòng có thể kể ra, đối chiếu với những gì vừa đo:</strong> (1) không bao giờ chạy regex có lượng từ lồng nhau (<code>(a+)+</code>, <code>(.*x){k}</code>, <code>(a|aa)+</code>) trên input bạn không kiểm soát; (2) <strong>chặn độ dài input TRƯỚC</strong> mọi việc tốn hơn tuyến tính — chính repo này làm đúng như vậy trước DP O(n·m) của nó: <code>src/services/ctlanguage/thiNoiThuan.ts › sachBanGhiNoi</code> chỉ giữ tối đa 80 bản ghi, mỗi bản tối đa 4.000 ký tự, trước khi <code>doKhopNhacLai</code> chạy bảng LCS trên chúng, và hàm chuẩn hoá chữ nó dùng, <code>chuanHoaDapAn</code> trong <code>thiThuan.ts</code>, chỉ là một lớp ký tự đơn, không lồng — tuyến tính ngay từ thiết kế; (3) chạy phép khớp rủi ro ngoài luồng chính, có giới hạn thời gian (một worker giết được); (4) khi cần bảo đảm thời gian tuyến tính, dùng bộ máy dựng trên ô-tô-mát (automata) thay vì quay lui (RE2 của Google là chuẩn tham chiếu; đường link đầu tiên bên dưới giải thích lý thuyết). Và điều mang vào phòng phỏng vấn: khi ai đó hỏi "ngôn ngữ có regex rồi, học DP làm gì?", giờ bạn có câu trả lời đo bằng số.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min per problem, one sitting of 2 hours)</h3>
<div class="callout ok"><ol>
<li>Do problems 1–4 against the timer, saying the four answers out loud before coding. Submit each on LeetCode.</li>
<li>For problem 2, deliberately submit the one-state version first, read the failing test, and explain the failure in one sentence.</li>
<li>For problem 6, fill the table for <code>"abcab"</code> by hand (rows i, columns j), then check with the code.</li>
<li>For problem 8, run <code>/^(a+)+$/.test("a".repeat(25) + "!")</code> in your own Node and write down the time; then run your DP on <code>"a".repeat(25)</code> with <code>"a*a*a*a*a*a*a*a*b"</code>.</li>
</ol>
<p><strong>Done when:</strong> 8 accepted submissions, each with one notebook line "signal → state → complexity", one hand-filled table, and your own ReDoS number written next to the one on this page.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state / transition / base case / order</span><span class="v">The four answers you say before any DP code.</span></div>
  <div class="kv"><span class="k">two-state Kadane</span><span class="v">Keeping both the max and the min "ending here" when a step can flip signs.</span></div>
  <div class="kv"><span class="k">sentinel value</span><span class="v">A stand-in for "impossible" (n + 1, amount + 1) that cannot overflow.</span></div>
  <div class="kv"><span class="k">0/1 vs unbounded knapsack</span><span class="v">Inner loop downwards = each item once; upwards = reuse allowed.</span></div>
  <div class="kv"><span class="k">interval DP</span><span class="v"><code>dp[i][j]</code> over a piece s[i..j], filled from short pieces to long ones.</span></div>
  <div class="kv"><span class="k">exchange argument</span><span class="v">A proof that a greedy choice is never worse than any other choice.</span></div>
  <div class="kv"><span class="k">backtracking regex engine</span><span class="v">An engine that tries alternatives one by one and can take exponential time.</span></div>
  <div class="kv"><span class="k">ReDoS</span><span class="v">Denial of service by sending input that makes a regex backtrack for a very long time.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Every DP here was the same four answers; only the skin changed.</li>
<li>When a step can flip best and worst, keep both (problem 2).</li>
<li>Many "new" problems are Coin Change or knapsack after one line of rewriting (problems 3, 4).</li>
<li>Two strings with two pointers and a choice ⇒ a 2D table indexed by "how much of each" (5, 8).</li>
<li>Interval DP fills short intervals first; get the loop directions right (6).</li>
<li>Greedy only when you can prove it (7); regex engines that skip DP can be attacked (8).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D and 2-D Dynamic Programming', 'The standard order of DP problems, with video solutions', 'https://neetcode.io/roadmap')}
${nguon('📘', 'Russ Cox — Regular Expression Matching Can Be Simple And Fast', 'Why backtracking engines blow up and automata do not — the theory behind RE2', 'https://swtch.com/~rsc/regexp/regexp1.html')}
${nguon('🔐', 'Cloudflare — Details of the outage on July 2, 2019', 'A real ReDoS post-mortem: one regex, the whole network', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút mỗi đề, một buổi 2 giờ)</h3>
<div class="callout ok"><ol>
<li>Làm đề 1–4 có bấm giờ, nói to bốn câu trả lời trước khi code. Nộp từng đề trên LeetCode.</li>
<li>Với đề 2, cố tình nộp bản một trạng thái trước, đọc test bị trượt, và giải thích lý do trong một câu.</li>
<li>Với đề 6, điền tay bảng cho <code>"abcab"</code> (hàng i, cột j), rồi kiểm lại bằng code.</li>
<li>Với đề 8, chạy <code>/^(a+)+$/.test("a".repeat(25) + "!")</code> trên Node của bạn và ghi lại thời gian; rồi chạy DP của bạn với <code>"a".repeat(25)</code> và <code>"a*a*a*a*a*a*a*a*b"</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> 8 lượt nộp Accepted, mỗi đề một dòng trong sổ "dấu hiệu → trạng thái → độ phức tạp", một bảng điền tay, và con số ReDoS của chính máy bạn ghi cạnh con số trên trang này.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">state / transition / base case / order (trạng thái / chuyển / cơ sở / thứ tự)</span><span class="v">Bốn câu trả lời phải nói trước mọi dòng code DP.</span></div>
  <div class="kv"><span class="k">two-state Kadane (Kadane hai trạng thái)</span><span class="v">Giữ cả max lẫn min "kết thúc ở đây" khi một bước có thể đảo dấu.</span></div>
  <div class="kv"><span class="k">sentinel value (giá trị lính canh)</span><span class="v">Số đại diện cho "không thể" (n + 1, amount + 1) mà không gây tràn số.</span></div>
  <div class="kv"><span class="k">0/1 vs unbounded knapsack (cái túi 0/1 và không giới hạn)</span><span class="v">Vòng trong chạy xuống = mỗi món một lần; chạy lên = được dùng lại.</span></div>
  <div class="kv"><span class="k">interval DP (DP khoảng)</span><span class="v"><code>dp[i][j]</code> trên đoạn s[i..j], điền từ đoạn ngắn tới đoạn dài.</span></div>
  <div class="kv"><span class="k">exchange argument (lập luận đổi chỗ)</span><span class="v">Chứng minh rằng lựa chọn tham lam không bao giờ tệ hơn bất kỳ lựa chọn nào khác.</span></div>
  <div class="kv"><span class="k">backtracking regex engine (bộ regex quay lui)</span><span class="v">Bộ máy thử lần lượt từng phương án, có thể tốn thời gian hàm mũ.</span></div>
  <div class="kv"><span class="k">ReDoS (từ chối dịch vụ bằng regex)</span><span class="v">Gửi input khiến một regex quay lui rất lâu để làm treo máy chủ.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi bài DP ở đây đều là cùng bốn câu trả lời; chỉ có lớp vỏ thay đổi.</li>
<li>Khi một bước có thể đảo tốt nhất thành tệ nhất, giữ cả hai (đề 2).</li>
<li>Nhiều đề "mới" chỉ là Coin Change hay cái túi sau một dòng viết lại (đề 3, 4).</li>
<li>Hai chuỗi, hai con trỏ, một lựa chọn ⇒ bảng 2 chiều đánh chỉ số theo "đã dùng bao nhiêu của mỗi chuỗi" (đề 5, 8).</li>
<li>DP khoảng điền đoạn ngắn trước; chiều vòng lặp phải đúng (đề 6).</li>
<li>Chỉ tham lam khi chứng minh được (đề 7); bộ regex bỏ qua DP có thể bị tấn công (đề 8).</li>
</ul>
${nguon('📗', 'NeetCode roadmap — 1-D and 2-D Dynamic Programming', 'Thứ tự chuẩn các đề DP, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
${nguon('📘', 'Russ Cox — Regular Expression Matching Can Be Simple And Fast', 'Vì sao bộ máy quay lui nổ còn ô-tô-mát thì không — lý thuyết đứng sau RE2', 'https://swtch.com/~rsc/regexp/regexp1.html')}
${nguon('🔐', 'Cloudflare — Details of the outage on July 2, 2019', 'Báo cáo sự cố ReDoS có thật: một regex, cả mạng lưới', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/')}
</div>
`,
};
