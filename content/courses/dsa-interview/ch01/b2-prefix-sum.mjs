/** 1.2 — Tổng tiền tố (prefix sum) + hiệu mảng (difference array). Mã/output: ../ma/ch01/prefix-* và Prefix*.java (Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay, lienKet } from '../_chung.mjs';
import { vetSubarrayK } from '../ma/ch01/prefix-subarray-k.vet.mjs';
import { vetHieuMang } from '../ma/ch01/prefix-hieu-mang.vet.mjs';
import { bangDo, hang, so, lan } from './_rieng.mjs';

const NUMS = [1, 2, -1, 3, -2, 2];
const K = 3;
const PRE = [0];
for (const x of NUMS) PRE.push(PRE[PRE.length - 1] + x);
const BANG = bangVet(['i', 'nums', 'sum', 'need = sum − 3', 'seen (before)', '+ seen[need]', 'count'],
  vetSubarrayK(NUMS, K).map((h) => {
    const to = { [h.i]: 'l' };
    let sub = '';
    if (h.them > 0) {
      const j = PRE.findIndex((p, idx) => idx <= h.i && p === h.need);
      for (let t = j; t <= h.i; t++) to[t] = 'ok';
      sub = ` ⇒ nums[${j}..${h.i}]`;
    }
    return [String(h.i), oMang(NUMS, { to }), String(h.sum), String(h.need), `<code>${h.truoc}</code>`,
      h.them > 0 ? `✅ +${h.them}${sub}` : '0', `<strong>${h.count}</strong>`];
  }));
const SAI = vetSubarrayK(NUMS, K, true);

const BOOK = [[0, 3], [1, 4], [2, 6], [5, 9], [6, 10], [6, 8]];
const HM = vetHieuMang(BOOK, 10);
const BANG_DIFF = bangVet(['booking', '[enter, leave)', 'diff after this booking (index 0 … 10)'],
  HM.capNhat.map((u, b) => [String(b), `[${u.enter}, ${u.leave}) = ${7 + u.enter}:00 → ${7 + u.leave}:00`,
    oMang(u.diff, { to: { [u.enter]: 'ok', [u.leave]: 'x' } })]));
const BANG_CD = bangVet(['h', 'hour', 'diff[h]', 'running = students in the lab'],
  HM.congDon.map((c) => [String(c.h), `${7 + c.h}:00`, String(c.d), `<strong>${c.running}</strong>`]));

// Số đo đọc từ .out (đo lại ⇒ chữ tự khớp). Cột: sum naive | sum prefix | add naive | add diff.
const DN = bangDo('ch01/prefix-do.ts'), DJ = bangDo('ch01/PrefixDo.java');
const [n4, n5, j4, j5] = [hang(DN, 10000), hang(DN, 100000), hang(DJ, 10000), hang(DJ, 100000)];
const do12 = (L) => ({
  tangNode: lan(n5[0], n4[0], L), tangJava: lan(j5[0], j4[0], L),
  a: so(n4[0], 1, L), b: so(n5[0], 1, L), c: so(j4[0], 1, L), d: so(j5[0], 1, L),
  p4: so(n4[1], 2, L), p5: so(n5[1], 2, L), pTang: lan(n5[1], n4[1], L),
  giay: so(n5[0] / 1000, 0, L), pms: so(n5[1], 2, L), chenh: lan(n5[0], n5[1], L),
  phut: so(n5[0] * 100 / 60000, 0, L), javaNhanh: lan(n5[0], j5[0], L),
  an: so(n5[2], 1, L), ad: so(n5[3], 2, L), aR: lan(n5[2], n5[3], L),
  jn: so(j5[2], 1, L), jd: so(j5[3], 2, L), jR: lan(j5[2], j5[3], L),
});
const E = do12('en'), V = do12('vi');

const DE = [
  [lc(303, 'range-sum-query-immutable', 'Range Sum Query - Immutable', 'Easy'), 'Many range-sum queries on a fixed array ⇒ build the prefix array once.', 'Nhiều truy vấn tổng đoạn trên mảng không đổi ⇒ dựng mảng tiền tố một lần.'],
  [lc(724, 'find-pivot-index', 'Find Pivot Index', 'Easy'), 'Left sum vs right sum at every index: right = total − left − nums[i].', 'Tổng trái so với tổng phải ở mỗi chỉ số: phải = tổng − trái − nums[i].'],
  [lc(1480, 'running-sum-of-1d-array', 'Running Sum of 1d Array', 'Easy'), 'The prefix array itself — warm-up, write it in 2 minutes.', 'Chính là mảng tiền tố — khởi động, viết trong 2 phút.'],
  [lc(560, 'subarray-sum-equals-k', 'Subarray Sum Equals K', 'Medium'), 'Count subarrays with a sum, negatives allowed ⇒ map {prefix: count}, start with {0: 1}.', 'Đếm mảng con có tổng cho trước, có số âm ⇒ map {tiền tố: số lần}, khởi tạo {0: 1}.'],
  [lc(304, 'range-sum-query-2d-immutable', 'Range Sum Query 2D - Immutable', 'Medium'), 'Rectangle sums ⇒ (m+1)×(n+1) table, inclusion–exclusion.', 'Tổng hình chữ nhật ⇒ bảng (m+1)×(n+1), bao hàm – loại trừ.'],
  [lc(525, 'contiguous-array', 'Contiguous Array', 'Medium'), 'Turn 0 into −1; "equal counts" becomes "sum 0"; keep the FIRST index of each sum.', 'Đổi 0 thành −1; "số lượng bằng nhau" thành "tổng bằng 0"; giữ chỉ số ĐẦU TIÊN của mỗi tổng.'],
  [lc(974, 'subarray-sums-divisible-by-k', 'Subarray Sums Divisible by K', 'Medium'), 'Same remainder of two prefixes ⇒ the gap is divisible; fix the negative remainder.', 'Hai tiền tố cùng số dư ⇒ đoạn giữa chia hết; nhớ sửa số dư âm.'],
  [lc(1109, 'corporate-flight-bookings', 'Corporate Flight Bookings', 'Medium'), 'Many range additions, one read at the end ⇒ difference array.', 'Nhiều lần cộng cho cả đoạn, đọc một lần ở cuối ⇒ hiệu mảng.'],
  [lc(1094, 'car-pooling', 'Car Pooling', 'Medium'), 'Passengers on/off at stops = +k / −k; prefix sum must never exceed capacity.', 'Khách lên/xuống ở các điểm = +k / −k; tổng dồn không được vượt sức chứa.'],
  [lc(238, 'product-of-array-except-self', 'Product of Array Except Self', 'Medium'), 'Prefix PRODUCT from the left times suffix product from the right — no division.', 'Tích tiền tố từ trái nhân tích hậu tố từ phải — không cần phép chia.'],
];

export default {
  title: '1.2 — Prefix sums: any range sum in O(1), and the difference array|||1.2 — Tổng tiền tố: tổng mọi đoạn trong O(1), và hiệu mảng',
  slug: 'dsa-1-2-prefix-sum',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mảng tiền tố cho tổng đoạn O(1), Subarray Sum Equals K bằng map {tổng: số lần} (bẫy {0:1}, vì sao cửa sổ trượt sai khi có số âm), tiền tố 2D, hiệu mảng đếm người trong phòng lab — kèm số đo O(n·q) so với O(n+q).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Prefix sums: any range sum in O(1), and the difference array</h2>
<p class="lead">Many problems hide the same question: <strong>"what is the sum of this stretch of the array?"</strong> — asked again and again, for different stretches. Re-adding the stretch every time is the waste. A prefix sum adds everything <em>once</em>, and from then on every range sum is a single subtraction. Combined with the hash map from Lesson 1.1, the same idea counts subarrays with a given sum in one pass — one of the most frequently asked medium problems. Run it backwards and you get the difference array, the tool for "many range updates".</p>

<h3>The everyday picture: the electricity meter</h3>
<p>Your landlord does not record how much electricity you used every single day. The meter only shows one number: the <em>total since it was installed</em>. To charge you for March to July, he reads the meter at the end of July, subtracts the reading at the end of February, and he is done — one subtraction, no matter how many months are in between. A motorbike odometer works the same way: kilometres from Da Lat to Nha Trang = odometer on arrival − odometer at departure.</p>
<p>A <strong>prefix sum</strong> array is that meter. Define <code>P[0] = 0</code> and <code>P[i + 1] = P[i] + nums[i]</code>, so <code>P[i]</code> is the sum of the first <code>i</code> elements. Then for any range:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Build once — O(n)</span><span class="lz-d">One pass: P[i+1] = P[i] + nums[i]. The array has n + 1 slots; P[0] = 0 is the empty prefix (the meter before you moved in).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Answer any range — O(1)</span><span class="lz-d">sum(nums[l..r]) = P[r + 1] − P[l]: "reading at the end of r" minus "reading just before l".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Turn the equation around</span><span class="lz-d">"A subarray ending here sums to k" ⇔ "some earlier prefix equals P − k" — a lookup, i.e. a hash map (Lesson 1.1).</span></div>
</div>
<p>Why n + 1 slots and not n? With <code>P[0] = 0</code> the formula works for ranges that start at index 0 too (<code>P[r+1] − P[0]</code>). With an n-slot array you would write a special case for <code>l = 0</code> — and special cases are where interview bugs live.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Tổng tiền tố: tổng mọi đoạn trong O(1), và hiệu mảng</h2>
<p class="lead">Rất nhiều đề giấu cùng một câu hỏi: <strong>"tổng của đoạn mảng này là bao nhiêu?"</strong> — hỏi đi hỏi lại, mỗi lần một đoạn khác. Mỗi lần lại cộng lại cả đoạn chính là chỗ phí. Tổng tiền tố (prefix sum) cộng mọi thứ đúng <em>một lần</em>, rồi từ đó mỗi tổng đoạn chỉ còn là một phép trừ. Ghép với hash map của bài 1.1, cùng ý tưởng đó đếm được số mảng con có tổng cho trước trong một lượt duyệt — một trong những đề Medium bị hỏi nhiều nhất. Chạy ngược ý tưởng lại, bạn có hiệu mảng (difference array) — công cụ cho bài toán "rất nhiều lần cập nhật cả đoạn".</p>

<h3>Hình dung đời thường: cái công-tơ điện</h3>
<p>Chủ nhà trọ không ghi lại mỗi ngày bạn dùng bao nhiêu số điện. Công-tơ chỉ hiện một con số: <em>tổng từ lúc lắp tới giờ</em>. Muốn tính tiền điện từ tháng 3 tới tháng 7, chủ nhà đọc công-tơ cuối tháng 7, trừ đi số đọc cuối tháng 2, là xong — một phép trừ, bất kể giữa hai lần đọc có bao nhiêu tháng. Đồng hồ công-tơ-mét (odometer) của xe máy cũng vậy: số km từ Đà Lạt tới Nha Trang = số trên đồng hồ lúc tới − số lúc xuất phát.</p>
<p>Mảng <strong>tổng tiền tố</strong> (prefix sum — "tiền tố" là "phần đầu") chính là cái công-tơ đó. Định nghĩa <code>P[0] = 0</code> và <code>P[i + 1] = P[i] + nums[i]</code>, tức <code>P[i]</code> là tổng của <code>i</code> phần tử đầu tiên. Khi đó với mọi đoạn:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Dựng một lần — O(n)</span><span class="lz-d">Một lượt: P[i+1] = P[i] + nums[i]. Mảng có n + 1 ô; P[0] = 0 là tiền tố rỗng (số công-tơ trước khi bạn dọn vào).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Trả lời mọi đoạn — O(1)</span><span class="lz-d">tổng(nums[l..r]) = P[r + 1] − P[l]: "số đọc ở cuối r" trừ "số đọc ngay trước l".</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Lật ngược phương trình</span><span class="lz-d">"Một mảng con kết thúc ở đây có tổng k" ⇔ "có một tiền tố trước đó bằng P − k" — một phép tra, tức là hash map (bài 1.1).</span></div>
</div>
<p>Vì sao n + 1 ô mà không phải n? Có <code>P[0] = 0</code> thì công thức đúng cả với đoạn bắt đầu ở chỉ số 0 (<code>P[r+1] − P[0]</code>). Dùng mảng n ô, bạn sẽ phải viết một trường hợp riêng cho <code>l = 0</code> — mà trường hợp riêng chính là nơi lỗi phỏng vấn trú ngụ.</p>
${csd('csd201-slide-cs2-2', 'vi', '⭐ CS.2 Kỹ thuật mảng (2): tổng tiền tố, ngăn xếp đơn điệu, Kadane', '<p>Phần chuyên sâu CS.2 của CSD201 đã giới thiệu tổng tiền tố bằng slide. Ôn nhanh một câu: P[i] là tổng i phần tử đầu, tổng đoạn là hiệu hai tiền tố. <strong>Ở đây đi sâu thêm:</strong> ghép tiền tố với hash map để ĐẾM mảng con (có số âm), lý do cửa sổ trượt thất bại, bảng 2D, hiệu mảng cho cập nhật đoạn, và số đo thật O(n·q) so với O(n + q).</p>')}
</div>

<div class="ml-en">
<h3>Signals: when to reach for a prefix sum</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"sum of elements between i and j", many queries</span><span class="v">The textbook case. q queries × O(n) each is O(n·q); with a prefix array it is O(n + q).</span></div>
  <div class="kv"><span class="k">"number of subarrays whose sum is k / divisible by k"</span><span class="v">Subarray = difference of two prefixes. Count earlier prefixes with a hash map. Works with negatives.</span></div>
  <div class="kv"><span class="k">"equal number of 0s and 1s", "balanced"</span><span class="v">Map one side to +1, the other to −1; "balanced" becomes "sum 0", i.e. two equal prefixes.</span></div>
  <div class="kv"><span class="k">"add v to every element from l to r", many times</span><span class="v">The reverse problem: a difference array. Each update touches 2 cells; one prefix pass at the end.</span></div>
  <div class="kv"><span class="k">sum of a sub-rectangle of a grid</span><span class="v">2-D prefix sums with inclusion–exclusion: four lookups per query.</span></div>
  <div class="kv"><span class="k">"left side equals right side", "product except self"</span><span class="v">A prefix from the left combined with a suffix from the right.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào cầm tổng tiền tố lên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"tổng các phần tử từ i tới j", rất nhiều truy vấn</span><span class="v">Trường hợp sách giáo khoa. q truy vấn × O(n) mỗi cái là O(n·q); có mảng tiền tố thì còn O(n + q).</span></div>
  <div class="kv"><span class="k">"số mảng con có tổng bằng k / chia hết cho k"</span><span class="v">Mảng con = hiệu của hai tiền tố. Đếm các tiền tố trước đó bằng hash map. Chạy đúng cả khi có số âm.</span></div>
  <div class="kv"><span class="k">"số số 0 bằng số số 1", "cân bằng"</span><span class="v">Đổi một bên thành +1, bên kia thành −1; "cân bằng" thành "tổng bằng 0", tức là hai tiền tố bằng nhau.</span></div>
  <div class="kv"><span class="k">"cộng v vào mọi phần tử từ l tới r", rất nhiều lần</span><span class="v">Bài toán ngược: hiệu mảng (difference array). Mỗi lần cập nhật chỉ chạm 2 ô; cuối cùng một lượt cộng dồn.</span></div>
  <div class="kv"><span class="k">tổng một hình chữ nhật con trong lưới</span><span class="v">Tiền tố hai chiều với bao hàm – loại trừ (inclusion–exclusion): bốn lần tra mỗi truy vấn.</span></div>
  <div class="kv"><span class="k">"tổng bên trái bằng tổng bên phải", "tích trừ chính nó"</span><span class="v">Tiền tố từ trái ghép với hậu tố (suffix) từ phải.</span></div>
</div>
</div>

<div class="ml-en">
<h3>Warm-up: Range Sum Query (LC 303)</h3>
<p><strong>Problem (in our words).</strong> You are given an integer array once, then a stream of questions "what is the sum from index <code>left</code> to index <code>right</code>, inclusive?". Answer each quickly. Example: <code>[-2, 0, 3, -5, 2, -1]</code>, question (0, 2) → −2 + 0 + 3 = 1.</p>
<p><strong>Brute force:</strong> loop from left to right for each question — O(n) per query, O(n·q) in total. <strong>Waste:</strong> neighbouring queries re-add almost the same numbers. <strong>Fix:</strong> pay O(n) once in the constructor, then O(1) per query.</p>
</div>
<div class="ml-vi">
<h3>Khởi động: Range Sum Query (LC 303)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Bạn được cho một mảng số nguyên một lần, rồi một loạt câu hỏi "tổng từ chỉ số <code>left</code> tới chỉ số <code>right</code>, tính cả hai đầu, là bao nhiêu?". Trả lời mỗi câu thật nhanh. Ví dụ: <code>[-2, 0, 3, -5, 2, -1]</code>, câu hỏi (0, 2) → −2 + 0 + 3 = 1.</p>
<p><strong>Vét cạn:</strong> mỗi câu hỏi lặp từ left tới right — O(n) mỗi truy vấn, O(n·q) cả bài. <strong>Chỗ phí:</strong> hai truy vấn gần nhau cộng lại gần như cùng những con số. <strong>Cách sửa:</strong> trả O(n) một lần trong hàm khởi tạo (constructor), rồi O(1) mỗi truy vấn.</p>
</div>
${maHai('ch01/prefix-range-sum.ts', 'ch01/PrefixRangeSum.java', { vung: 'lop' })}
${ketQua('ch01/prefix-range-sum.ts')}
${ketQua('ch01/PrefixRangeSum.java')}
<div class="ml-en">
<p>Check one line by hand: <code>sumRange(2, 5)</code> = <code>pre[6] − pre[2]</code> = −3 − (−2) = −1, and indeed 3 − 5 + 2 − 1 = −1. Notice <code>pre[1] = pre[2] = −2</code>: the element at index 1 is 0, so the meter did not move. And <code>sumRange(3, 3)</code> = −5 shows a single element is just a range of length one — no special case.</p>
<h3>The real cost, measured: O(n·q) vs O(n + q)</h3>
<p>We generated q = n random ranges (a fixed Park–Miller pseudo-random generator that gives exactly the same numbers in TypeScript doubles and Java longs, so both languages and every run use the same ranges) and answered them both ways. The last two columns are the difference array from later in this lesson, measured on the same ranges:</p>
</div>
<div class="ml-vi">
<p>Kiểm tay một dòng: <code>sumRange(2, 5)</code> = <code>pre[6] − pre[2]</code> = −3 − (−2) = −1, và đúng là 3 − 5 + 2 − 1 = −1. Để ý <code>pre[1] = pre[2] = −2</code>: phần tử ở chỉ số 1 là 0 nên công-tơ không nhích. Còn <code>sumRange(3, 3)</code> = −5 cho thấy một phần tử đơn lẻ chỉ là một đoạn dài 1 — không cần trường hợp riêng.</p>
<h3>Cái giá thật, đo bằng số: O(n·q) so với O(n + q)</h3>
<p>Ta sinh q = n đoạn ngẫu nhiên (bằng bộ sinh giả ngẫu nhiên Park–Miller cố định, cho ra đúng cùng các con số với số thực của TypeScript lẫn kiểu long của Java, nên cả hai ngôn ngữ và mọi lần chạy dùng đúng cùng các đoạn) rồi trả lời bằng cả hai cách. Hai cột cuối là hiệu mảng ở phần sau của bài, đo trên đúng những đoạn đó:</p>
</div>
${ma('ch01/prefix-do.ts', { nhan: 'TypeScript — benchmark' })}
${ketQua('ch01/prefix-do.ts')}
${ketQua('ch01/PrefixDo.java')}
<div class="ml-en">
<p>Read the "sum naive" column: from n = q = 10,000 to 100,000 both n and q grew 10×, so n·q grew 100× — and the time grew about ${E.tangNode}× in Node (${E.a} → ${E.b} ms) and about ${E.tangJava}× in Java (${E.c} → ${E.d} ms). The prefix column grew only about ${E.pTang}× (Node ${E.p4} → ${E.p5} ms; at these sizes the timer is mostly noise and memory allocation). At n = q = 10⁵ the naive version needs about ${E.giay} seconds in Node and the prefix version ${E.pms} ms: a factor of about ${E.chenh}, from one extra array. At 10⁶ the naive version would take roughly 100× longer again — about ${E.phut} minutes — so it was skipped. On this naive loop Java is about ${E.javaNhanh}× faster than Node (its JIT keeps the <code>int[]</code> loop tight), but the shape of both curves is identical: the language changes the constant, the algorithm changes the curve. (Each number is the fastest of three runs — a single run for the two slowest naive cells — on a machine that was also doing other work, so treat the third digit as noise and read the ratios.)</p>
</div>
<div class="ml-vi">
<p>Đọc cột "sum naive" (vét cạn): từ n = q = 10.000 lên 100.000, cả n lẫn q đều tăng 10 lần nên n·q tăng 100 lần — và thời gian tăng khoảng ${V.tangNode} lần trên Node (${V.a} → ${V.b} ms), khoảng ${V.tangJava} lần trên Java (${V.c} → ${V.d} ms). Cột tiền tố chỉ tăng khoảng ${V.pTang} lần (Node ${V.p4} → ${V.p5} ms; ở cỡ này đồng hồ đo chủ yếu là nhiễu và chi phí cấp phát bộ nhớ). Ở n = q = 10⁵, bản vét cạn cần khoảng ${V.giay} giây trên Node còn bản tiền tố mất ${V.pms} ms: chênh khoảng ${V.chenh} lần, chỉ nhờ thêm một mảng. Ở 10⁶ bản vét cạn sẽ cần thêm khoảng 100 lần nữa — cỡ ${V.phut} phút — nên không chạy. Ở vòng vét cạn này Java nhanh hơn Node khoảng ${V.javaNhanh} lần (JIT của nó giữ vòng lặp <code>int[]</code> rất gọn), nhưng hình dạng hai đường cong giống hệt: ngôn ngữ đổi hằng số, thuật toán đổi đường cong. (Mỗi số là lần nhanh nhất trong ba lượt — riêng hai ô vét cạn chậm nhất chỉ chạy một lượt — trên một máy đang chạy cả việc khác, nên chữ số thứ ba coi như nhiễu — hãy đọc các tỉ lệ.)</p>
</div>

<div class="ml-en">
<h3>Worked example: Subarray Sum Equals K (LC 560)</h3>
<p><strong>Problem (in our words).</strong> Given an integer array <code>nums</code> (negatives and zeros allowed) and an integer <code>k</code>, count the <em>contiguous</em> subarrays whose elements add up to <code>k</code>. Example: <code>[1, 1, 1], k = 2</code> → 2 (the first two ones, and the last two).</p>
<p><strong>Step 1 — brute force, out loud.</strong> "For every start i, extend the end j to the right, keeping a running sum; count every time it equals k." That is O(n²) time and O(1) memory — note it is <em>not</em> O(n³): the running sum avoids re-adding the inner range. Say that detail; it shows you already think about repeated work.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: Subarray Sum Equals K (LC 560)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho mảng số nguyên <code>nums</code> (có thể có số âm và số 0) và số nguyên <code>k</code>, đếm số mảng con <em>liên tiếp</em> (subarray) có tổng các phần tử bằng <code>k</code>. Ví dụ: <code>[1, 1, 1], k = 2</code> → 2 (hai số 1 đầu, và hai số 1 cuối).</p>
<p><strong>Bước 1 — vét cạn, nói thành lời.</strong> "Với mỗi điểm đầu i, kéo điểm cuối j sang phải, giữ một tổng chạy (running sum); mỗi lần tổng bằng k thì đếm." Đó là O(n²) thời gian, O(1) bộ nhớ — để ý nó <em>không phải</em> O(n³): tổng chạy giúp khỏi cộng lại đoạn bên trong. Hãy nói chi tiết đó ra; nó cho thấy bạn đã biết để ý phần việc bị lặp.</p>
</div>
${ma('ch01/prefix-subarray-k.ts', { vung: 'brute', nhan: 'TypeScript — brute force O(n²)' })}
<div class="ml-en">
<p><strong>Step 2 — the key equation.</strong> The subarray <code>nums[j..i]</code> has sum <code>P[i+1] − P[j]</code>. We want that to equal k, which is the same as <code>P[j] = P[i+1] − k</code>. Read it as Lesson 1.1: standing at position i with the current prefix <code>sum</code>, the question is "<em>how many earlier prefixes equal <code>sum − k</code>?</em>" — Two Sum on prefix sums, except we <strong>count</strong> partners instead of returning the first one. So the map stores <code>prefix sum → how many times we have seen it</code>.</p>
<p><strong>Step 3 — one pass.</strong> Keep a running <code>sum</code>. At each element: add it to <code>sum</code>; add <code>seen[sum − k]</code> to the answer; then record <code>sum</code> in the map. The map starts as <code>{0: 1}</code> — the empty prefix, <code>P[0] = 0</code> — and that one entry is the most important line of the solution (we break it on purpose below).</p>
</div>
<div class="ml-vi">
<p><strong>Bước 2 — phương trình chìa khoá.</strong> Mảng con <code>nums[j..i]</code> có tổng <code>P[i+1] − P[j]</code>. Ta muốn nó bằng k, tức là <code>P[j] = P[i+1] − k</code>. Đọc nó theo kiểu bài 1.1: đứng ở vị trí i với tổng tiền tố hiện tại <code>sum</code>, câu hỏi là "<em>có bao nhiêu tiền tố TRƯỚC ĐÓ bằng <code>sum − k</code>?</em>" — chính là Two Sum trên các tổng tiền tố, chỉ khác là ta <strong>đếm</strong> số "người còn lại" thay vì trả về người đầu tiên. Vậy map lưu <code>tổng tiền tố → số lần đã gặp</code>.</p>
<p><strong>Bước 3 — một lượt.</strong> Giữ một <code>sum</code> chạy. Ở mỗi phần tử: cộng nó vào <code>sum</code>; cộng <code>seen[sum − k]</code> vào đáp án; rồi ghi <code>sum</code> vào map. Map khởi tạo là <code>{0: 1}</code> — tiền tố rỗng, <code>P[0] = 0</code> — và đúng một mục đó là dòng quan trọng nhất của lời giải (bên dưới ta cố tình làm hỏng nó để xem).</p>
</div>
${maHai('ch01/prefix-subarray-k.ts', 'ch01/PrefixSubarrayK.java', { vung: 'map' })}
${ketQua('ch01/prefix-subarray-k.ts')}
${ketQua('ch01/PrefixSubarrayK.java')}
<div class="ml-en">
<p>Both versions agree on every case, including <code>[0, 0, 0], k = 0</code> → 6: every one of the 6 subarrays sums to 0, and the map handles it because the prefix 0 is counted 1, 2, 3 times as it repeats. In Java, <code>seen.merge(sum, 1, Integer::sum)</code> is the one-call way to write "+1, creating the key if absent"; <code>getOrDefault</code> avoids the <code>null</code> unboxing trap from Lesson 1.1.</p>
<h3>Watch it run: the map after every step</h3>
<p>Input <code>nums = [1, 2, -1, 3, -2, 2]</code>, <code>k = 3</code>. Blue = current element; green = a subarray that was just counted. The "seen (before)" column is the map before step i looks anything up. Generated by running the algorithm, not typed.</p>
</div>
<div class="ml-vi">
<p>Hai bản khớp nhau ở mọi ca, kể cả <code>[0, 0, 0], k = 0</code> → 6: cả 6 mảng con đều có tổng 0, và map xử lý được vì tiền tố 0 được đếm 1, 2, 3 lần khi nó lặp lại. Trong Java, <code>seen.merge(sum, 1, Integer::sum)</code> là cách một lời gọi để viết "+1, chưa có khoá thì tạo"; <code>getOrDefault</code> tránh được bẫy mở hộp <code>null</code> ở bài 1.1.</p>
<h3>Xem nó chạy: map sau từng bước</h3>
<p>Đầu vào <code>nums = [1, 2, -1, 3, -2, 2]</code>, <code>k = 3</code>. Ô xanh dương = phần tử đang xét; ô xanh lá = mảng con vừa được đếm. Cột "seen (before)" là map trước khi bước i tra cứu. Bảng sinh ra bằng cách chạy thuật toán thật, không gõ tay.</p>
</div>
${BANG}
<div class="ml-en">
<p>Read three moments. <strong>Step 1</strong>: sum = 3, need = 0, and 0 is in the map only because of the initial <code>{0: 1}</code> — that hit is the subarray <code>nums[0..1] = [1, 2]</code>, which starts at index 0. <strong>Step 3</strong>: sum = 5, need = 2, and 2 was stored at step 2 — the subarray is the single element <code>[3]</code>. <strong>Step 4</strong>: sum is 3 <em>again</em> (the −1, 3, −2 cancelled to 0), so the map now says <code>3:2</code>; the hit is <code>nums[0..4]</code>. Final answer 4, in six steps instead of the 21 subarrays the brute force tries.</p>
${moPhong('ch01/prefix-subarray-k.sim.js', 'en', 'Subarray Sum Equals K — prefix sums and the map, step by step', 'Opens /algorithms with this program: watch the prefix array fill and each counted subarray light up.')}
</div>
<div class="ml-vi">
<p>Đọc ba thời điểm. <strong>Bước 1</strong>: sum = 3, need = 0, và 0 có trong map chỉ nhờ mục khởi tạo <code>{0: 1}</code> — lần trúng đó là mảng con <code>nums[0..1] = [1, 2]</code>, bắt đầu ở chỉ số 0. <strong>Bước 3</strong>: sum = 5, need = 2, mà 2 đã được cất ở bước 2 — mảng con là đúng một phần tử <code>[3]</code>. <strong>Bước 4</strong>: sum lại bằng 3 <em>lần nữa</em> (−1, 3, −2 triệt tiêu thành 0), nên map giờ ghi <code>3:2</code>; lần trúng là <code>nums[0..4]</code>. Đáp án cuối là 4, sau sáu bước thay vì 21 mảng con mà vét cạn phải thử.</p>
${moPhong('ch01/prefix-subarray-k.sim.js', 'vi', 'Subarray Sum Equals K — tổng tiền tố và map, từng bước', 'Mở /algorithms với đúng chương trình này: xem mảng tiền tố đầy dần và từng mảng con được đếm sáng lên.')}
</div>

<div class="ml-en">
<h3>Two traps, run for real</h3>
<div class="pitfall co-tieu-de"><p><strong>Trap 1 — forgetting <code>{0: 1}</code>.</strong></p><p>Without the empty prefix, a subarray that starts at index 0 has no "earlier prefix" to match, so it is never counted:</p></div>
</div>
<div class="ml-vi">
<h3>Hai cái bẫy, chạy thật</h3>
<div class="pitfall co-tieu-de"><p><strong>Bẫy 1 — quên <code>{0: 1}</code>.</strong></p><p>Thiếu tiền tố rỗng thì một mảng con bắt đầu ở chỉ số 0 không có "tiền tố trước đó" nào để khớp, nên không bao giờ được đếm:</p></div>
</div>
${ma('ch01/prefix-bay.ts', { vung: 'quen', nhan: 'TypeScript — wrong' })}
<div class="ml-en">
<div class="pitfall co-tieu-de"><p><strong>Trap 2 — reaching for a sliding window.</strong></p><p>"Contiguous subarray with a sum" sounds like Chapter 2's sliding window: grow the right end, shrink the left end while the sum is too big. That rule assumes shrinking always <em>lowers</em> the sum and growing always <em>raises</em> it — true only when every number is positive. A negative number (or a zero) breaks it:</p></div>
</div>
<div class="ml-vi">
<div class="pitfall co-tieu-de"><p><strong>Bẫy 2 — vớ ngay cửa sổ trượt.</strong></p><p>"Mảng con liên tiếp có tổng…" nghe rất giống cửa sổ trượt (sliding window) của Chương 2: nới đầu phải, co đầu trái khi tổng quá lớn. Quy tắc đó ngầm giả định co lại thì tổng luôn <em>giảm</em>, nới ra thì tổng luôn <em>tăng</em> — chỉ đúng khi mọi số đều dương. Một số âm (hoặc số 0) làm nó gãy:</p></div>
</div>
${ma('ch01/prefix-bay.ts', { vung: 'cuaso', nhan: 'TypeScript — wrong for negatives' })}
${ketQua('ch01/prefix-bay.ts')}
<div class="ml-en">
<p>Same input, three answers: 4 (correct), 2 (forgot <code>{0: 1}</code>: the two subarrays starting at index 0 are lost — in the trace above the buggy count goes ${SAI.map((h) => h.count).join(', ')}), and 1 (sliding window). Watch the window at index 3: it holds <code>[−1, 3]</code> with sum 2, which is not above k, so it stops shrinking — yet dropping the −1 would have <em>raised</em> the sum to exactly 3. Shrinking lowers the sum only when the element you drop is positive. Even with no negatives, zeros break the <em>counting</em>: on <code>[1, 0, 1], k = 1</code> the window finds 3 of the 4 answers, because <code>[1, 0]</code> and <code>[1]</code> have the same sum and the window only keeps one left end. The rule for the interview: <strong>all positive ⇒ a window works (O(1) memory); negatives or zeros possible ⇒ prefix sum + map</strong>. Ask about negatives in your clarifying questions — this is exactly why.</p>
<p>The last three lines of the output are traps you meet in the variants below: in both JavaScript and Java, <code>-7 % 5</code> is <code>-2</code> (the sign follows the dividend), not 3; and a JavaScript <code>number</code> stops counting exactly above 2⁵³.</p>
</div>
<div class="ml-vi">
<p>Cùng một đầu vào, ba đáp án: 4 (đúng), 2 (quên <code>{0: 1}</code>: hai mảng con bắt đầu ở chỉ số 0 bị mất — trong bảng vết ở trên, bộ đếm của bản lỗi đi ${SAI.map((h) => h.count).join(', ')}), và 1 (cửa sổ trượt). Nhìn cửa sổ ở chỉ số 3: nó đang giữ <code>[−1, 3]</code> với tổng 2, không lớn hơn k, nên nó thôi co — trong khi bỏ số −1 đi thì tổng lại <em>tăng</em> lên đúng 3. Co cửa sổ chỉ làm tổng giảm khi phần tử bị bỏ là số dương. Kể cả khi không có số âm, số 0 cũng làm hỏng việc <em>đếm</em>: với <code>[1, 0, 1], k = 1</code> cửa sổ chỉ tìm được 3 trong 4 đáp án, vì <code>[1, 0]</code> và <code>[1]</code> cùng tổng mà cửa sổ chỉ giữ một đầu trái. Luật khi phỏng vấn: <strong>toàn số dương ⇒ cửa sổ dùng được (O(1) bộ nhớ); có thể có số âm hoặc số 0 ⇒ tiền tố + map</strong>. Hãy hỏi về số âm trong phần hỏi làm rõ — đây chính là lý do.</p>
<p>Ba dòng cuối của output là những cái bẫy bạn sẽ gặp ở các đề biến thể bên dưới: trong cả JavaScript lẫn Java, <code>-7 % 5</code> là <code>-2</code> (dấu theo số bị chia), không phải 3; và kiểu <code>number</code> của JavaScript không còn đếm chính xác được khi vượt 2⁵³.</p>
${lienKet({ bai: 'dsa-2-2-cua-so', title: '2.2 — Cửa sổ trượt cố định và co giãn', sub: 'Khi nào cửa sổ ĐÚNG (mọi số không âm) và khuôn "nới phải, co trái"', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>Complexity, said precisely</h3>
<p>Time <strong>O(n) expected</strong>: one pass, each step does one map lookup and one map update, O(1) on average (the "expected" from Lesson 1.1 applies — a hash map can degrade). Space <strong>O(n)</strong>: in the worst case every prefix is different, so the map holds n + 1 entries. If an interviewer asks "can you do it in O(1) space?", the honest answer is: only if all numbers are positive (then the sliding window works); with negatives, no known approach avoids remembering the prefixes.</p>
</div>
<div class="ml-vi">
<h3>Độ phức tạp, nói cho chính xác</h3>
<p>Thời gian <strong>O(n) kỳ vọng</strong>: một lượt, mỗi bước một lần tra map và một lần ghi map, O(1) trung bình (chữ "kỳ vọng" của bài 1.1 vẫn áp dụng — hash map có thể suy biến). Bộ nhớ <strong>O(n)</strong>: xấu nhất mọi tiền tố đều khác nhau, nên map chứa n + 1 mục. Nếu người phỏng vấn hỏi "làm được với O(1) bộ nhớ không?", câu trả lời thật thà là: chỉ khi mọi số đều dương (khi đó cửa sổ trượt chạy được); có số âm thì chưa có cách nào khỏi phải nhớ các tiền tố.</p>
</div>

<div class="ml-en">
<h3>Two dimensions: Range Sum Query 2D (LC 304)</h3>
<p>Same idea on a grid: <code>P[r][c]</code> = sum of the rectangle from the top-left corner down to row r−1, column c−1 (again one extra row and column of zeros). Building it and querying it are both <strong>inclusion–exclusion</strong>: add the two overlapping rectangles, subtract the part counted twice.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Build: P[r+1][c+1]</span><span class="lz-d">= matrix[r][c] + P[r][c+1] (everything above) + P[r+1][c] (everything to the left) − P[r][c] (the corner, counted twice)</span></div>
  <div class="lz-node"><span class="lz-t">Query (r1, c1) … (r2, c2)</span><span class="lz-d">= P[r2+1][c2+1] − P[r1][c2+1] (cut the rows above) − P[r2+1][c1] (cut the columns to the left) + P[r1][c1] (the corner was cut twice)</span></div>
  <div class="lz-node"><span class="lz-t">Cost</span><span class="lz-d">O(m·n) build, O(1) per query, O(m·n) memory</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Hai chiều: Range Sum Query 2D (LC 304)</h3>
<p>Cùng ý tưởng trên lưới: <code>P[r][c]</code> = tổng hình chữ nhật từ góc trên-trái xuống tới hàng r−1, cột c−1 (lại thêm một hàng và một cột toàn số 0). Cả lúc dựng lẫn lúc hỏi đều là <strong>bao hàm – loại trừ</strong> (inclusion–exclusion): cộng hai hình chữ nhật chồng lên nhau, trừ phần bị tính hai lần.</p>
<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Dựng: P[r+1][c+1]</span><span class="lz-d">= matrix[r][c] + P[r][c+1] (mọi thứ phía trên) + P[r+1][c] (mọi thứ bên trái) − P[r][c] (góc, bị tính hai lần)</span></div>
  <div class="lz-node"><span class="lz-t">Hỏi (r1, c1) … (r2, c2)</span><span class="lz-d">= P[r2+1][c2+1] − P[r1][c2+1] (cắt các hàng phía trên) − P[r2+1][c1] (cắt các cột bên trái) + P[r1][c1] (góc bị cắt hai lần)</span></div>
  <div class="lz-node"><span class="lz-t">Chi phí</span><span class="lz-d">Dựng O(m·n), mỗi truy vấn O(1), bộ nhớ O(m·n)</span></div>
</div>
</div>
${maHai('ch01/prefix-2d.ts', 'ch01/Prefix2D.java', { vung: 'lop' })}
${ketQua('ch01/prefix-2d.ts')}
<div class="ml-en">
<p>Verify <code>sumRegion(1, 1, 2, 2)</code> by hand with the printed table: <code>P[3][3] − P[1][3] − P[3][1] + P[1][1]</code> = 21 − 4 − 9 + 3 = 11, and the 2×2 block is 6 + 3 + 2 + 0 = 11. Doing this once on paper before coding is what keeps the four indices straight under pressure. The same table appears in computer vision as the <em>integral image</em>: the Viola–Jones face detector (2001) uses it to sum any rectangle of pixels in four lookups, which is what made real-time face detection on 2001 hardware possible.</p>
</div>
<div class="ml-vi">
<p>Kiểm tay <code>sumRegion(1, 1, 2, 2)</code> bằng bảng in ra: <code>P[3][3] − P[1][3] − P[3][1] + P[1][1]</code> = 21 − 4 − 9 + 3 = 11, và khối 2×2 là 6 + 3 + 2 + 0 = 11. Làm phép kiểm này một lần trên giấy trước khi code là thứ giữ bốn chỉ số không lộn xộn khi bị áp lực. Đúng bảng này xuất hiện trong thị giác máy tính dưới tên <em>integral image</em> (ảnh tích phân): bộ dò khuôn mặt Viola–Jones (2001) dùng nó để tính tổng một hình chữ nhật điểm ảnh bất kỳ bằng bốn lần tra — chính điều đó làm việc nhận diện khuôn mặt thời gian thực chạy được trên phần cứng năm 2001.</p>
</div>

<div class="ml-en">
<h3>The reverse trick: the difference array</h3>
<p>Prefix sums make <em>queries</em> cheap when the array never changes. The opposite situation is just as common: <strong>many updates "add v to every slot from l to r"</strong>, and you only need the final array at the end. Doing each update with a loop costs O(length) per update — O(n·q). The <strong>difference array</strong> stores, instead of the values, how much each value differs from the previous one. Adding v to <code>[l, r)</code> then changes only two cells: <code>diff[l] += v</code> (from here on, everything is v higher) and <code>diff[r] −= v</code> (from here on, back to normal). One prefix pass over <code>diff</code> at the end rebuilds the actual values.</p>
<p><strong>Everyday version — the FPT lab.</strong> The lab opens at 7:00 and students book it by the hour: one from 7:00 to 10:00, one from 8:00 to 11:00, and so on. The lab assistant wants to know how many people are inside each hour, and when the peak is (to decide whether a second room is needed). Each booking is "+1 from enter, −1 from leave": exactly a difference array. The same shape answers "how many users were online each minute", "how many cars are in the car park each hour" and LC 1094 Car Pooling.</p>
</div>
<div class="ml-vi">
<h3>Mẹo ngược: hiệu mảng (difference array)</h3>
<p>Tổng tiền tố làm <em>truy vấn</em> rẻ khi mảng không bao giờ đổi. Tình huống ngược lại cũng hay gặp không kém: <strong>rất nhiều lần cập nhật "cộng v vào mọi ô từ l tới r"</strong>, và bạn chỉ cần mảng cuối cùng. Làm mỗi lần cập nhật bằng một vòng lặp tốn O(độ dài) mỗi lần — O(n·q). <strong>Hiệu mảng</strong> không lưu giá trị, mà lưu mỗi giá trị chênh bao nhiêu so với giá trị đứng trước nó. Khi đó cộng v vào <code>[l, r)</code> chỉ đổi đúng hai ô: <code>diff[l] += v</code> (từ đây trở đi, mọi thứ cao hơn v) và <code>diff[r] −= v</code> (từ đây trở đi, trở lại bình thường). Cuối cùng một lượt cộng dồn trên <code>diff</code> dựng lại giá trị thật.</p>
<p><strong>Phiên bản đời thường — phòng lab ở FPT.</strong> Phòng lab mở cửa lúc 7:00, sinh viên đăng ký theo giờ: một bạn từ 7:00 tới 10:00, một bạn từ 8:00 tới 11:00, v.v. Thầy quản lý lab muốn biết mỗi giờ có bao nhiêu người trong phòng, và lúc nào đông nhất (để quyết định có cần mở thêm phòng thứ hai). Mỗi lượt đăng ký là "+1 từ giờ vào, −1 từ giờ ra": chính là hiệu mảng. Cùng hình dạng đó trả lời "mỗi phút có bao nhiêu người dùng online", "bãi xe mỗi giờ có bao nhiêu xe" và đề LC 1094 Car Pooling.</p>
</div>
${maHai('ch01/prefix-hieu-mang.ts', 'ch01/PrefixHieuMang.java', { vung: 'phong' })}
${maHai('ch01/prefix-hieu-mang.ts', 'ch01/PrefixHieuMang.java', { vung: 'lc1109' })}
${ketQua('ch01/prefix-hieu-mang.ts')}
${ketQua('ch01/PrefixHieuMang.java')}
<div class="ml-en">
<p>Here is the <code>diff</code> array after each of the six bookings (green = +1 at the enter hour, red = −1 at the leave hour), then the single prefix pass. Both tables are produced by running the code:</p>
</div>
<div class="ml-vi">
<p>Đây là mảng <code>diff</code> sau từng lượt trong sáu lượt đăng ký (xanh lá = +1 ở giờ vào, đỏ = −1 ở giờ ra), rồi lượt cộng dồn duy nhất. Cả hai bảng sinh ra bằng cách chạy mã thật:</p>
</div>
${BANG_DIFF}
${BANG_CD}
<div class="ml-en">
<p>Read the second table: the running total is the number of students, <code>[1, 2, 3, 2, 1, 2, 3, 3, 2, 1]</code>. The first peak, 3 people, is at 9:00 (the program reports the first one); the lab is full again from 13:00 to 15:00. Notice booking 4, <code>[6, 10)</code>: its −1 lands in <code>diff[10]</code>, the extra slot past the last hour — that is why the array has <code>hours + 1</code> cells, the same "one extra slot" as <code>P[0]</code>. For LC 1109 the flights are numbered from 1 and the ranges include both ends, so we convert <code>[first, last]</code> into the half-open <code>[first − 1, last)</code> before touching <code>diff</code>. Converting to half-open ranges at the boundary of your function, and never inside the loop, is a habit that removes most off-by-one bugs.</p>
<p>Look back at the benchmark: "add naive" vs "add diff" tells the same story as the range sums — at n = q = 10⁵, ${E.an} ms vs ${E.ad} ms in Node (about ${E.aR}×) and ${E.jn} ms vs ${E.jd} ms in Java (about ${E.jR}×).</p>
${moPhong('ch01/prefix-hieu-mang.sim.js', 'en', 'Difference array — who is in the lab at each hour', 'Each booking touches two cells; then one pass fills the bar chart of people per hour.')}
</div>
<div class="ml-vi">
<p>Đọc bảng thứ hai: tổng chạy chính là số sinh viên, <code>[1, 2, 3, 2, 1, 2, 3, 3, 2, 1]</code>. Đỉnh đầu tiên, 3 người, ở 9:00 (chương trình báo đỉnh đầu tiên); phòng lại đông như vậy từ 13:00 tới 15:00. Để ý lượt đăng ký 4, <code>[6, 10)</code>: số −1 của nó rơi vào <code>diff[10]</code>, ô thừa nằm sau giờ cuối cùng — đó là lý do mảng có <code>hours + 1</code> ô, cùng kiểu "thêm một ô" như <code>P[0]</code>. Với LC 1109, chuyến bay đánh số từ 1 và đoạn tính cả hai đầu, nên ta đổi <code>[first, last]</code> thành đoạn nửa mở <code>[first − 1, last)</code> trước khi đụng tới <code>diff</code>. Đổi sang đoạn nửa mở (half-open) ngay ở cửa vào của hàm, không bao giờ đổi lung tung bên trong vòng lặp, là thói quen dẹp được phần lớn lỗi lệch một (off-by-one).</p>
<p>Nhìn lại bảng đo: "add naive" so với "add diff" kể cùng câu chuyện với tổng đoạn — ở n = q = 10⁵, Node ${V.an} ms so với ${V.ad} ms (khoảng ${V.aR} lần), Java ${V.jn} ms so với ${V.jd} ms (khoảng ${V.jR} lần).</p>
${moPhong('ch01/prefix-hieu-mang.sim.js', 'vi', 'Hiệu mảng — mỗi giờ có ai trong phòng lab', 'Mỗi lượt đăng ký chạm hai ô; rồi một lượt duy nhất vẽ biểu đồ số người theo giờ.')}
</div>

<div class="ml-en">
<h3>Three variants, same idea, different shell</h3>
<p><strong>LC 724 Find Pivot Index</strong> — the index where the sum on the left equals the sum on the right. You do not even need the array <code>P</code>: keep <code>left</code> as you walk, and compute <code>right = total − left − nums[i]</code>. Edge case: index 0 is a valid pivot when everything to its right sums to 0 (<code>[2, 1, -1]</code> → 0).</p>
<p><strong>LC 525 Contiguous Array</strong> — the longest subarray with equally many 0s and 1s. Replace every 0 with −1: "equal counts" becomes "sum 0", which means "two equal prefixes". Because we want the <em>longest</em>, the map keeps the <strong>first</strong> index of each prefix (never overwrite it), and it starts as <code>{0: −1}</code> so a balanced prefix from index 0 has length i − (−1) = i + 1.</p>
<p><strong>LC 974 Subarray Sums Divisible by K</strong> — two prefixes with the same <em>remainder</em> mod k differ by a multiple of k. Count remainders exactly like LC 560 counted sums. The trap: <code>sum % k</code> is negative for negative sums in both languages, so −1 and 4 (mod 5) would land in different buckets. Normalise with <code>((sum % k) + k) % k</code> in TypeScript or <code>Math.floorMod</code> in Java; since remainders are 0…k−1, Java can use an <code>int[k]</code> instead of a map.</p>
</div>
<div class="ml-vi">
<h3>Ba đề biến thể, cùng ý tưởng, khác vỏ</h3>
<p><strong>LC 724 Find Pivot Index</strong> (tìm chỉ số cân bằng) — chỉ số mà tổng bên trái bằng tổng bên phải. Thậm chí không cần mảng <code>P</code>: giữ <code>left</code> khi đi, và tính <code>right = total − left − nums[i]</code>. Ca biên: chỉ số 0 vẫn là điểm cân bằng hợp lệ khi mọi thứ bên phải nó có tổng 0 (<code>[2, 1, -1]</code> → 0).</p>
<p><strong>LC 525 Contiguous Array</strong> — mảng con dài nhất có số số 0 bằng số số 1. Thay mọi số 0 bằng −1: "số lượng bằng nhau" thành "tổng bằng 0", tức là "hai tiền tố bằng nhau". Vì cần mảng con <em>dài nhất</em>, map giữ chỉ số <strong>đầu tiên</strong> của mỗi tiền tố (không bao giờ ghi đè), và khởi tạo là <code>{0: −1}</code> để một tiền tố cân bằng từ chỉ số 0 có độ dài i − (−1) = i + 1.</p>
<p><strong>LC 974 Subarray Sums Divisible by K</strong> — hai tiền tố cùng <em>số dư</em> khi chia k thì chênh nhau một bội của k. Đếm số dư y như LC 560 đếm tổng. Cái bẫy: <code>sum % k</code> ra số âm khi tổng âm ở cả hai ngôn ngữ, nên −1 và 4 (mod 5) rơi vào hai ngăn khác nhau. Chuẩn hoá bằng <code>((sum % k) + k) % k</code> trong TypeScript hoặc <code>Math.floorMod</code> trong Java; vì số dư chỉ là 0…k−1, Java dùng được mảng <code>int[k]</code> thay cho map.</p>
</div>
${maHai('ch01/prefix-bien-the.ts', 'ch01/PrefixBienThe.java', { vung: 'contiguous' })}
${maHai('ch01/prefix-bien-the.ts', 'ch01/PrefixBienThe.java', { vung: 'chiahet' })}
${ma('ch01/prefix-bien-the.ts', { vung: 'pivot', nhan: 'TypeScript — LC 724 (Java version in PrefixBienThe.java)' })}
${ketQua('ch01/prefix-bien-the.ts')}
<div class="ml-en">
<p>The Java file prints exactly the same seven lines (the runner checks the two outputs are identical). For <code>[0, 1, 1, 1, 0, 0, 1]</code> the answer 6 is indices 0…5, <code>[0, 1, 1, 1, 0, 0]</code> — three 0s and three 1s; the balance is 0 again at index 5, and the first time it was 0 is the initial −1. For <code>[-1, 2, 9], k = 2</code>, the answer 2 comes from <code>[2]</code> and <code>[-1, 2, 9]</code> (sum 10). Without the normalisation, <code>[2]</code> is lost: its two prefixes −1 and 1 both have remainder 1, but <code>-1 % 2</code> says −1.</p>
</div>
<div class="ml-vi">
<p>Tệp Java in ra đúng bảy dòng như vậy (bộ chạy kiểm hai output giống hệt nhau). Với <code>[0, 1, 1, 1, 0, 0, 1]</code>, đáp án 6 là các chỉ số 0…5, <code>[0, 1, 1, 1, 0, 0]</code> — ba số 0 và ba số 1; độ cân bằng về lại 0 ở chỉ số 5, và lần đầu nó bằng 0 chính là mục khởi tạo −1. Với <code>[-1, 2, 9], k = 2</code>, đáp án 2 đến từ <code>[2]</code> và <code>[-1, 2, 9]</code> (tổng 10). Không chuẩn hoá thì mất <code>[2]</code>: hai tiền tố của nó là −1 và 1 đều có số dư 1, nhưng <code>-1 % 2</code> lại cho −1.</p>
</div>

<div class="ml-en">
<h3>Java: the prefix that overflows</h3>
<div class="pitfall co-tieu-de"><p><strong>An <code>int</code> prefix array silently wraps around.</strong></p><p>Each element fits in an <code>int</code>, but their running total may not. LeetCode's LC 560 keeps values small, but many problems allow 10⁵ elements up to 10⁹ — a total of 10¹⁴, far above 2³¹ − 1 ≈ 2.1·10⁹:</p></div>
</div>
<div class="ml-vi">
<h3>Java: tiền tố bị tràn số</h3>
<div class="pitfall co-tieu-de"><p><strong>Mảng tiền tố kiểu <code>int</code> lặng lẽ quay vòng (tràn số).</strong></p><p>Từng phần tử vừa một <code>int</code>, nhưng tổng dồn của chúng thì chưa chắc. LC 560 giữ giá trị nhỏ, nhưng rất nhiều đề cho 10⁵ phần tử, mỗi cái tới 10⁹ — tổng 10¹⁴, vượt xa 2³¹ − 1 ≈ 2,1·10⁹:</p></div>
</div>
${ma('ch01/PrefixTranSo.java', { vung: 'tran', nhan: 'Java' })}
${ketQua('ch01/PrefixTranSo.java')}
<div class="ml-en">
<p>The <code>int</code> prefix went 2,000,000,000 → −294,967,296: past the maximum it wrapped to a negative number, with no error. The range sum built from it is wrong too. Use <code>long[]</code> whenever n × max value can exceed about 2·10⁹ — and say so in the interview ("I’ll use long for the prefix array because 10⁵ × 10⁹ overflows int"), it is a cheap signal of care. In JavaScript the danger moves to 2⁵³ ≈ 9·10¹⁵ (the <code>2**53 + 1</code> line above); beyond that, use <code>BigInt</code>.</p>
</div>
<div class="ml-vi">
<p>Tiền tố <code>int</code> đi từ 2.000.000.000 → −294.967.296: vượt giá trị lớn nhất thì quay vòng thành số âm, không báo lỗi gì. Tổng đoạn tính từ nó cũng sai theo. Dùng <code>long[]</code> mỗi khi n × giá trị lớn nhất có thể vượt khoảng 2·10⁹ — và nói ra khi phỏng vấn ("I’ll use long for the prefix array because 10⁵ × 10⁹ overflows int"), đó là một tín hiệu cẩn thận rất rẻ. Trong JavaScript mốc nguy hiểm dời lên 2⁵³ ≈ 9·10¹⁵ (dòng <code>2**53 + 1</code> ở trên); vượt mốc đó thì dùng <code>BigInt</code>.</p>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: integer overflow in a running total</h3>
<p>The overflow above is not only a wrong answer — it is a whole class of vulnerability, <strong>CWE-190 Integer Overflow or Wraparound</strong>. Any running total of numbers that a user controls (quantities in a shopping cart, points transferred in a game, bytes in a file upload, sizes in a network packet) can be pushed past the limit of its type. When the total wraps to a small or negative number, the checks that rely on it pass: "total ≤ balance" is true for a negative total, "length ≤ buffer" is true for a wrapped length. The defences are the same habits as above: a wide enough type (<code>long</code>, <code>BigInt</code>, <code>Decimal</code> for money), validating each input against a sane range <em>before</em> adding (quantity between 1 and 99), and overflow-checked arithmetic where it matters — Java's <code>Math.addExact</code> throws instead of wrapping:</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: tràn số trong một tổng dồn</h3>
<p>Phép tràn ở trên không chỉ là một đáp án sai — nó là cả một họ lỗ hổng, <strong>CWE-190 Integer Overflow or Wraparound</strong> (tràn số nguyên). Mọi tổng dồn của những con số do người dùng điều khiển (số lượng trong giỏ hàng, điểm chuyển trong game, số byte của tệp tải lên, kích thước trong gói tin mạng) đều có thể bị đẩy vượt giới hạn của kiểu dữ liệu. Khi tổng quay vòng thành số nhỏ hoặc số âm, những phép kiểm dựa vào nó đều qua: "tổng ≤ số dư" đúng với một tổng âm, "độ dài ≤ bộ đệm" đúng với một độ dài đã quay vòng. Cách phòng chính là các thói quen ở trên: kiểu đủ rộng (<code>long</code>, <code>BigInt</code>, <code>Decimal</code> cho tiền), kiểm từng đầu vào theo một khoảng hợp lý <em>trước khi</em> cộng (số lượng từ 1 tới 99), và phép tính có kiểm tràn ở chỗ quan trọng — <code>Math.addExact</code> của Java ném lỗi thay vì quay vòng:</p>
</div>
${ma('ch01/PrefixTranSo.java', { vung: 'exact', nhan: 'Java' })}
<div class="ml-en">
<p>(Its output is the fourth line of the run above: <code>ArithmeticException: integer overflow</code>.) A crash you can see is always better than a wrong number you cannot.</p>
</div>
<div class="ml-vi">
<p>(Output của nó là dòng thứ tư trong lượt chạy ở trên: <code>ArithmeticException: integer overflow</code>.) Một lỗi văng ra mà bạn thấy được luôn tốt hơn một con số sai mà bạn không thấy.</p>
</div>

<div class="ml-en">
<h3>Where this pattern lives in real systems</h3>
<ul>
<li><strong>Running totals in SQL.</strong> <code>SUM(amount) OVER (ORDER BY day)</code> in PostgreSQL is a prefix sum computed by the database; "revenue from March to July" is then two lookups and a subtraction — the electricity meter again.</li>
<li><strong>This website's own project reports.</strong> CT Work's velocity chart computes a 3-sprint rolling average with <code>rollingAverage</code> in <code>src/services/work/flowMetrics.ts</code>: for each point it takes <code>values.slice(…)</code> and <code>reduce</code>s the window — O(window) per point, perfectly fine for a window of 3 over at most 7 sprints. With a prefix array, any window size would cost O(1) per point. In the same file, <code>computeCfd</code> builds the cumulative flow diagram by asking, for every day and every issue, which status band the issue was in — O(days × issues), capped at 180 days and cached. If it ever had to scale, the textbook rewrite is a difference array per band: +1 on the day an issue enters a band, −1 on the day it leaves, one prefix pass per band.</li>
<li><strong>Bank statements.</strong> The "balance" column is the prefix sum of the "amount" column; balance after line j − balance after line i is the net movement between them.</li>
<li><strong>Images and maps.</strong> Integral images (above) for vision; 2-D prefix sums for "how many shops are in this rectangle of the map" when the map does not change.</li>
<li><strong>Calendars and capacity.</strong> Room bookings, cloud machines running per minute, concurrent users: the difference array, and in Chapter 6 its cousin, the sweep line.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Mẫu này sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Tổng luỹ tiến trong SQL.</strong> <code>SUM(amount) OVER (ORDER BY day)</code> trong PostgreSQL là một tổng tiền tố do CSDL tính; "doanh thu từ tháng 3 tới tháng 7" khi đó là hai lần tra và một phép trừ — lại là cái công-tơ điện.</li>
<li><strong>Báo cáo dự án của chính trang này.</strong> Biểu đồ velocity của CT Work tính trung bình trượt 3 sprint bằng hàm <code>rollingAverage</code> trong <code>src/services/work/flowMetrics.ts</code>: với mỗi điểm nó lấy <code>values.slice(…)</code> rồi <code>reduce</code> cả cửa sổ — O(độ rộng cửa sổ) mỗi điểm, hoàn toàn ổn với cửa sổ 3 trên tối đa 7 sprint. Có mảng tiền tố thì cửa sổ rộng bao nhiêu cũng chỉ O(1) mỗi điểm. Cùng tệp đó, <code>computeCfd</code> dựng biểu đồ luồng tích luỹ (cumulative flow diagram) bằng cách hỏi, với mỗi ngày và mỗi thẻ, thẻ đó đang nằm ở dải trạng thái nào — O(số ngày × số thẻ), có trần 180 ngày và có đệm (cache). Nếu một ngày nó phải chịu tải lớn, cách viết lại theo sách là một hiệu mảng cho mỗi dải: +1 vào ngày thẻ vào dải, −1 vào ngày thẻ rời dải, mỗi dải một lượt cộng dồn.</li>
<li><strong>Sao kê ngân hàng.</strong> Cột "số dư" là tổng tiền tố của cột "số tiền"; số dư sau dòng j trừ số dư sau dòng i là dòng tiền ròng giữa hai dòng đó.</li>
<li><strong>Ảnh và bản đồ.</strong> Ảnh tích phân (ở trên) cho thị giác máy tính; tiền tố 2D cho "có bao nhiêu cửa hàng trong khung chữ nhật này của bản đồ" khi bản đồ không đổi.</li>
<li><strong>Lịch và sức chứa.</strong> Đặt phòng, số máy cloud chạy mỗi phút, số người dùng đồng thời: hiệu mảng, và ở Chương 6 là "người anh em" của nó — đường quét (sweep line).</li>
</ul>
${lienKet({ khoa: 'postgresql', bai: 'postgresql-8-3-lag-running-total', title: 'PostgreSQL 8.3 — LAG, LEAD &amp; tổng luỹ tiến', sub: 'Tổng tiền tố do CSDL tính bằng hàm cửa sổ SUM() OVER', cta: 'Đọc bài' })}
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: LC 560</h3>
${hoiThoai([
  ['I', 'Count the contiguous subarrays whose sum equals k.'],
  ['C', 'Can the numbers be negative or zero? And how large can n and the values get?'],
  ['N', 'The negative-number question decides the whole approach: a sliding window only works for positive numbers. The size question decides int vs long.'],
  ['I', 'Negatives are allowed. n is up to 2·10⁴, values up to 1,000 in absolute value.'],
  ['C', 'Brute force: fix a start, extend the end with a running sum, count matches — O(n²), about 2·10⁸ steps here, borderline. Since negatives are allowed I can’t use a sliding window. Instead: a subarray from j to i sums to k exactly when prefix[i+1] − prefix[j] = k, so at each position I need the number of earlier prefixes equal to the current prefix minus k. A hash map from prefix sum to count gives that in O(1). O(n) time, O(n) space.'],
  ['N', 'Brute force with its cost, the reason the obvious faster pattern fails, then the equation that turns it into a lookup.'],
  ['I', 'Sounds good, go ahead.'],
  ['C', '(coding) I start the map with zero mapped to one — that’s the empty prefix, so subarrays starting at index 0 are counted. I add the count before inserting the current sum, so a subarray can’t be empty… Let me test [1, 1, 1] with k = 2: sums 1, 2, 3; at sum 2 I find zero once, at sum 3 I find one once: total 2. Correct.'],
  ['N', 'Narrate the two lines that carry the logic, then trace the smallest example that exercises both.'],
  ['I', 'What if I asked for the longest such subarray instead of the count?'],
  ['C', 'Then the map stores the first index where each prefix appeared, never overwritten, and I take i minus that index — like Contiguous Array.'],
  ['I', 'And if every number were positive?'],
  ['C', 'Then a sliding window works with O(1) extra space, because growing the window only increases the sum.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to khi phỏng vấn: LC 560</h3>
${hoiThoai([
  ['I', 'Đếm số mảng con liên tiếp có tổng bằng k.'],
  ['C', 'Các số có thể âm hoặc bằng 0 không ạ? Và n với giá trị lớn tới đâu? <em>("Can the numbers be negative? How large can n get?")</em>'],
  ['N', 'Câu hỏi về số âm quyết định cả hướng giải: cửa sổ trượt chỉ chạy với số dương. Câu hỏi về kích thước quyết định int hay long.'],
  ['I', 'Có số âm. n tới 2·10⁴, giá trị tuyệt đối tới 1.000.'],
  ['C', 'Vét cạn: cố định điểm đầu, kéo điểm cuối với một tổng chạy, đếm khi khớp — O(n²), ở đây khoảng 2·10⁸ bước, sát giới hạn. Vì có số âm nên em không dùng cửa sổ trượt được. Thay vào đó: mảng con từ j tới i có tổng k đúng khi prefix[i+1] − prefix[j] = k, nên ở mỗi vị trí em cần số tiền tố trước đó bằng tiền tố hiện tại trừ k. Một hash map từ tổng tiền tố tới số lần cho câu trả lời trong O(1). O(n) thời gian, O(n) bộ nhớ. <em>("That turns it into a lookup — like Two Sum on prefix sums.")</em>'],
  ['N', 'Vét cạn kèm chi phí, lý do mẫu nhanh "hiển nhiên" thất bại, rồi phương trình biến bài toán thành một phép tra.'],
  ['I', 'Nghe ổn, làm đi.'],
  ['C', '(vừa code vừa nói) Em khởi tạo map với 0 ứng với 1 — đó là tiền tố rỗng, để mảng con bắt đầu ở chỉ số 0 được đếm. Em cộng số đếm trước khi cất tổng hiện tại, để mảng con không bị rỗng… Em thử [1, 1, 1] với k = 2: các tổng là 1, 2, 3; ở tổng 2 tìm thấy 0 một lần, ở tổng 3 tìm thấy 1 một lần: tổng cộng 2. Đúng. <em>("Let me trace a small example.")</em>'],
  ['N', 'Thuật lại hai dòng gánh logic, rồi chạy tay ví dụ nhỏ nhất đụng tới cả hai.'],
  ['I', 'Nếu tôi hỏi mảng con DÀI NHẤT như vậy thay vì số lượng thì sao?'],
  ['C', 'Khi đó map lưu chỉ số đầu tiên mỗi tiền tố xuất hiện, không bao giờ ghi đè, và em lấy i trừ chỉ số đó — giống đề Contiguous Array.'],
  ['I', 'Còn nếu mọi số đều dương?'],
  ['C', 'Thì cửa sổ trượt chạy được với O(1) bộ nhớ phụ, vì nới cửa sổ chỉ làm tổng tăng. <em>("Growing the window only increases the sum.")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Forgetting the empty prefix: <code>{0: 1}</code> for counting, <code>{0: −1}</code> for "longest" — subarrays that start at index 0 disappear.</li>
<li>Inserting the current sum before counting: with k = 0 every element would pair with itself and count an empty subarray.</li>
<li>Using a sliding window when negatives or zeros are allowed.</li>
<li>Off-by-one in <code>P[r + 1] − P[l]</code>: mix inclusive and half-open ranges and you are one element off. Decide the convention once, at the top.</li>
<li>Overwriting the first index in "longest" problems, or keeping the first index in "count" problems — the two need different maps.</li>
<li><code>int</code> prefix arrays in Java and negative <code>%</code> in both languages.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Quên tiền tố rỗng: <code>{0: 1}</code> khi đếm, <code>{0: −1}</code> khi tìm "dài nhất" — các mảng con bắt đầu ở chỉ số 0 biến mất.</li>
<li>Cất tổng hiện tại trước rồi mới đếm: với k = 0, mỗi phần tử sẽ tự ghép với chính nó và đếm một mảng con rỗng.</li>
<li>Dùng cửa sổ trượt khi đề cho phép số âm hoặc số 0.</li>
<li>Lệch một ở <code>P[r + 1] − P[l]</code>: trộn đoạn đóng và đoạn nửa mở là lệch một phần tử. Chốt quy ước một lần, ngay đầu bài.</li>
<li>Ghi đè chỉ số đầu tiên trong đề "dài nhất", hoặc giữ chỉ số đầu tiên trong đề "đếm" — hai loại cần hai kiểu map khác nhau.</li>
<li>Mảng tiền tố <code>int</code> trong Java, và <code>%</code> ra số âm ở cả hai ngôn ngữ.</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Hai đề tổng hợp dùng mẫu này — LC 523 Continuous Subarray Sum và LC 1074 (tiền tố 2D + map) — có lời giải từng bước trong bài 1.5 (Bộ luyện 1).</p>
${lienKet({ bai: 'dsa-1-4-luyen', title: '1.5 — Bộ luyện 1: tám đề có lời giải từng bước', sub: 'Hash map, tổng tiền tố, sắp xếp, thao tác bit — tự bấm giờ', cta: 'Luyện' })}
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write <code>subarraySum</code> (prefix + map). Run it on <code>[1, 1, 1], 2</code>, <code>[1, 2, 3], 3</code>, <code>[0, 0, 0], 0</code> and <code>[1, 2, -1, 3, -2, 2], 3</code>; expected 2, 2, 6, 4.</li>
<li>Delete the <code>{0: 1}</code> initialisation and rerun the last case: you should get 2. Write one sentence explaining which subarrays disappeared.</li>
<li>Write the lab occupancy function for these bookings: <code>[0, 2], [1, 5], [1, 3], [4, 6]</code> over 6 hours. Predict the array before running it.</li>
<li>Submit LC 303, LC 560 and LC 1109.</li>
</ol>
<p><strong>Done when:</strong> the four expected values match, your sentence names "subarrays starting at index 0", the lab array you predicted is <code>[1, 3, 2, 1, 2, 1]</code>, and three submissions are accepted.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">prefix sum</span><span class="v">P[i] = sum of the first i elements; any range sum is P[r+1] − P[l].</span></div>
  <div class="kv"><span class="k">empty prefix</span><span class="v">P[0] = 0, the "before anything" reading; the {0: 1} entry of the map.</span></div>
  <div class="kv"><span class="k">half-open range [l, r)</span><span class="v">Includes l, excludes r; length r − l; removes most off-by-one bugs.</span></div>
  <div class="kv"><span class="k">difference array</span><span class="v">Stores value[i] − value[i−1]; a range update touches two cells, one prefix pass rebuilds the values.</span></div>
  <div class="kv"><span class="k">inclusion–exclusion</span><span class="v">Add overlapping parts, subtract what was counted twice (2-D prefix sums).</span></div>
  <div class="kv"><span class="k">integral image</span><span class="v">The 2-D prefix sum of an image, used for fast rectangle sums in vision.</span></div>
  <div class="kv"><span class="k">integer overflow (CWE-190)</span><span class="v">A value exceeds its type's range and wraps around silently.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>Pay O(n) once, then every range sum is one subtraction: O(n + q) instead of O(n·q) — measured ${E.giay} s vs ${E.pms} ms at n = q = 10⁵.</li>
<li>Subarray sum = k ⇔ an earlier prefix equals sum − k: a hash map of prefix counts, starting with {0: 1}.</li>
<li>Negatives or zeros ⇒ no sliding window; prefix + map instead.</li>
<li>2-D: one extra row and column of zeros, four lookups by inclusion–exclusion.</li>
<li>Many range updates ⇒ difference array: +v at l, −v at r, one prefix pass.</li>
<li>Watch the types: long in Java, floorMod for negative remainders, BigInt past 2⁵³.</li>
</ul>
${nguon('📗', 'USACO Guide — Introduction to Prefix Sums', 'Prefix sums, 2-D prefix sums and difference arrays with practice problems', 'https://usaco.guide/silver/prefix-sums')}
${nguon('🐘', 'PostgreSQL — Window Functions tutorial', 'Running totals with SUM() OVER (ORDER BY …), from the official docs', 'https://www.postgresql.org/docs/current/tutorial-window.html')}
${nguon('🔐', 'CWE-190: Integer Overflow or Wraparound', 'MITRE’s description of the vulnerability class, with real examples', 'https://cwe.mitre.org/data/definitions/190.html')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>subarraySum</code> (tiền tố + map). Chạy với <code>[1, 1, 1], 2</code>, <code>[1, 2, 3], 3</code>, <code>[0, 0, 0], 0</code> và <code>[1, 2, -1, 3, -2, 2], 3</code>; kết quả mong đợi 2, 2, 6, 4.</li>
<li>Xoá dòng khởi tạo <code>{0: 1}</code> rồi chạy lại ca cuối: bạn phải thấy 2. Viết một câu giải thích những mảng con nào đã biến mất.</li>
<li>Viết hàm đếm người trong phòng lab cho các lượt đăng ký <code>[0, 2], [1, 5], [1, 3], [4, 6]</code> trong 6 giờ. Đoán mảng kết quả trước khi chạy.</li>
<li>Nộp LC 303, LC 560 và LC 1109.</li>
</ol>
<p><strong>Đạt khi:</strong> bốn giá trị mong đợi khớp, câu giải thích của bạn có cụm "mảng con bắt đầu ở chỉ số 0", mảng phòng lab bạn đoán là <code>[1, 3, 2, 1, 2, 1]</code>, và ba lượt nộp đều Accepted.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">prefix sum (tổng tiền tố)</span><span class="v">P[i] = tổng i phần tử đầu; tổng đoạn bất kỳ là P[r+1] − P[l].</span></div>
  <div class="kv"><span class="k">empty prefix (tiền tố rỗng)</span><span class="v">P[0] = 0, số đọc "trước mọi thứ"; chính là mục {0: 1} của map.</span></div>
  <div class="kv"><span class="k">half-open range [l, r) (đoạn nửa mở)</span><span class="v">Lấy l, bỏ r; độ dài r − l; dẹp phần lớn lỗi lệch một.</span></div>
  <div class="kv"><span class="k">difference array (hiệu mảng)</span><span class="v">Lưu value[i] − value[i−1]; cập nhật một đoạn chỉ chạm hai ô, một lượt cộng dồn dựng lại giá trị.</span></div>
  <div class="kv"><span class="k">inclusion–exclusion (bao hàm – loại trừ)</span><span class="v">Cộng các phần chồng nhau, trừ phần bị tính hai lần (tiền tố 2D).</span></div>
  <div class="kv"><span class="k">integral image (ảnh tích phân)</span><span class="v">Tổng tiền tố 2D của một ảnh, dùng để tính nhanh tổng hình chữ nhật trong thị giác máy tính.</span></div>
  <div class="kv"><span class="k">integer overflow (tràn số nguyên, CWE-190)</span><span class="v">Giá trị vượt khoảng của kiểu dữ liệu và lặng lẽ quay vòng.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả O(n) một lần, rồi mỗi tổng đoạn là một phép trừ: O(n + q) thay vì O(n·q) — đo được ${V.giay} giây so với ${V.pms} ms ở n = q = 10⁵.</li>
<li>Mảng con có tổng k ⇔ có một tiền tố trước đó bằng sum − k: hash map đếm tiền tố, khởi tạo {0: 1}.</li>
<li>Có số âm hoặc số 0 ⇒ không dùng cửa sổ trượt; dùng tiền tố + map.</li>
<li>2D: thêm một hàng và một cột số 0, bốn lần tra theo bao hàm – loại trừ.</li>
<li>Nhiều lần cập nhật đoạn ⇒ hiệu mảng: +v ở l, −v ở r, một lượt cộng dồn.</li>
<li>Canh kiểu dữ liệu: long trong Java, floorMod cho số dư âm, BigInt khi vượt 2⁵³.</li>
</ul>
${nguon('📗', 'USACO Guide — Introduction to Prefix Sums', 'Tổng tiền tố, tiền tố 2D và hiệu mảng, có bài luyện (tiếng Anh)', 'https://usaco.guide/silver/prefix-sums')}
${nguon('🐘', 'PostgreSQL — Window Functions tutorial', 'Tổng luỹ tiến bằng SUM() OVER (ORDER BY …), tài liệu chính thức', 'https://www.postgresql.org/docs/current/tutorial-window.html')}
${nguon('🔐', 'CWE-190: Integer Overflow or Wraparound', 'Mô tả của MITRE về họ lỗ hổng tràn số nguyên, kèm ví dụ thật', 'https://cwe.mitre.org/data/definitions/190.html')}
</div>
`,
};
