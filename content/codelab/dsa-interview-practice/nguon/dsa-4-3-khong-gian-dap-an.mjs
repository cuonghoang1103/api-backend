/** Coding Interview Prep · 4.3 — Tìm nhị phân trên KHÔNG GIAN ĐÁP ÁN: tối đa hoá phần chia (T cuối), tối thiểu hoá đoạn dài nhất sau khi cắt, khoảng cách cặp nhỏ thứ k (đếm bằng hai con trỏ). Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. "Tối đa hoá": khẩu phần lớn nhất chia đều cho mọi sinh viên ── */
function maxPortion(bags, students) {
  function enough(x) { // can every student get a portion of exactly x grams?
    var count = 0;
    for (var i = 0; i < bags.length; i++) { count += Math.floor(bags[i] / x); if (count >= students) return true; }
    return false;
  }
  // enough(x) is true … true false … false as x grows ⇒ find the FIRST false in [1, max+1), the answer is one less
  var lo = 1, hi = 1;
  for (var j = 0; j < bags.length; j++) if (bags[j] + 1 > hi) hi = bags[j] + 1; // x = max+1 is always "not enough"
  while (lo < hi) {
    var mid = lo + ((hi - lo) >> 1);
    if (!enough(mid)) hi = mid; else lo = mid + 1;
  }
  return lo - 1; // 0 when even 1-gram portions are not enough
}
const D1 = bai({
  ten: 'Volunteer kitchen: the biggest equal portion for everyone', kho: 'EASY', phut: 20, ham: 'maxPortion',
  en: `<p>The student union's charity kitchen received bags of rice of different weights, <code>bags[i]</code> grams. Every one of the <code>students</code> volunteers' families must receive <b>one portion of the same weight</b> <code>x</code> (a whole number of grams). A portion has to come from a single bag — you cannot combine two half-empty bags — and leftovers smaller than <code>x</code> stay in the kitchen.</p>
<p>Write <code>maxPortion(bags, students)</code> returning the largest possible <code>x</code>, or <code>0</code> if even 1-gram portions are not enough.</p>`,
  vi: `<p>Bếp từ thiện của hội sinh viên nhận các bao gạo nặng khác nhau, <code>bags[i]</code> gam. Mỗi gia đình trong số <code>students</code> gia đình được nhận <b>một phần cùng khối lượng</b> <code>x</code> (số gam nguyên). Một phần phải lấy từ một bao duy nhất — không được gộp hai bao vơi — và phần dư nhỏ hơn <code>x</code> ở lại bếp.</p>
<p>Viết <code>maxPortion(bags, students)</code> trả về <code>x</code> lớn nhất có thể, hoặc <code>0</code> nếu ngay cả phần 1 gam cũng không đủ.</p>`,
  dauVao: ['bags — positive integers; students — positive integer.', 'bags — số nguyên dương; students — số nguyên dương.'],
  dauRa: ['The largest x, or 0.', 'x lớn nhất, hoặc 0.'],
  rangBuoc: [['1 ≤ bags.length ≤ 100 000; 1 ≤ bags[i] ≤ 10⁷; 1 ≤ students ≤ 10¹².', '1 ≤ bags.length ≤ 100 000; 1 ≤ bags[i] ≤ 10⁷; 1 ≤ students ≤ 10¹².'], ['Target: O(n log(max bag)).', 'Mục tiêu: O(n log(bao lớn nhất)).']],
  goiY: [
    ['Do not search the bags — search the ANSWER. For a fixed x, checking "is x enough?" is easy: <code>Σ floor(bags[i] / x) ≥ students</code>.', 'Đừng tìm trên các bao — tìm trên ĐÁP ÁN. Với một x cố định, kiểm "x có đủ không?" rất dễ: <code>Σ floor(bags[i] / x) ≥ students</code>.'],
    ['Bigger portions mean fewer of them, so "enough" is true…true false…false. Find the first x that is NOT enough on <code>[1, max + 1)</code> and answer one less — the "last true" without a second template.', 'Phần càng lớn thì càng ít phần, nên "đủ" là true…true false…false. Tìm x đầu tiên KHÔNG đủ trên <code>[1, max + 1)</code> rồi trả bớt một — "true cuối" mà không cần khuôn thứ hai.'],
  ],
  loi: [
    ['Searching on <code>[1, max]</code> and returning <code>lo</code>: when even 1 gram is not enough you answer 1 instead of 0.', 'Tìm trên <code>[1, max]</code> rồi trả <code>lo</code>: khi ngay cả 1 gam cũng không đủ thì trả 1 thay vì 0.'],
    ['Using <code>sum(bags) / students</code>: portions cannot be combined across bags (<code>[9, 1]</code>, 2 families ⇒ 4, not 5).', 'Dùng <code>sum(bags) / students</code>: không được gộp phần giữa các bao (<code>[9, 1]</code>, 2 gia đình ⇒ 4, không phải 5).'],
    ['Trying x = 1, 2, 3, … until it fails: O(answer · n) — with 50 families and 10⁷-gram bags that is 10¹² steps.', 'Thử x = 1, 2, 3, … tới khi hỏng: O(đáp án · n) — với 50 gia đình và bao 10⁷ gam là 10¹² bước.'],
  ],
  gt: ['Feasibility is monotone in x: if portions of x grams are enough, any smaller portion is too (every bag yields at least as many). So we binary-search x itself, from 1 to max+1 (max+1 is never feasible because no bag can give such a portion). Each check is O(n) with an early exit, and there are O(log max) ≈ 24 checks ⇒ O(n log max). The answer is (first infeasible) − 1, which is naturally 0 when even x = 1 fails.', 'Tính khả thi đơn điệu theo x: nếu phần x gam đủ thì mọi phần nhỏ hơn cũng đủ (mỗi bao cho ít nhất bằng số phần đó). Vì vậy ta tìm nhị phân trên chính x, từ 1 tới max+1 (max+1 không bao giờ khả thi vì không bao nào cho được phần như thế). Mỗi lần kiểm O(n) có thoát sớm, và có O(log max) ≈ 24 lần kiểm ⇒ O(n log max). Đáp án là (x không khả thi đầu tiên) − 1, tự nhiên bằng 0 khi ngay cả x = 1 cũng hỏng.'],
  kn: ['binary search on the answer', 'maximise with a feasibility check'],
  tns: [tn('search on the answer', 'tìm nhị phân trên không gian đáp án'), tn('feasibility check', 'hàm kiểm khả thi', 'trả lời "x có làm được không?".'), tn('monotone predicate', 'mệnh đề đơn điệu')],
  dau: `/**
 * bags: number[] (grams), students: number
 * returns the largest whole x such that every student can get one x-gram portion from a single bag (0 if impossible)
 */
function maxPortion(bags, students) {
  // Write your solution here
  var total = 0;
  for (var b of bags) total += b;
  return Math.floor(total / students);
}
`,
  giai: '// Reference solution — binary search on x; answer = first x that is NOT enough, minus one.\n' + nguon(maxPortion),
  cases: [
    { args: [[5000, 8000, 3000], 5], moTa: ['2 666 g: 1 + 3 + 1 = 5 portions', '2 666 g: 1 + 3 + 1 = 5 phần'] },
    { args: [[9, 1], 2], moTa: ['Bags cannot be combined ⇒ 4', 'Không gộp được bao ⇒ 4'] },
    { args: [[2, 3], 6], moTa: ['Not even 1 gram each ⇒ 0', 'Không đủ cả 1 gam mỗi phần ⇒ 0'] },
    { args: [[10000000], 1], an: true },
    { args: [[7, 7, 7], 3], an: true },
    { args: [[1, 1, 1], 3], an: true },
    { args: [[100, 1, 1, 1], 4], an: true },
    { args: [[10000000, 10000000], 1000000000000], an: true, moTa: ['Huge number of students', 'Số gia đình rất lớn'] },
  ],
  perf: [{
    moTa: ['Performance: 100 000 bags up to 10⁷ g, 50 families (trying x = 1, 2, 3 … takes ~10¹² steps)', 'Hiệu năng: 100 000 bao tới 10⁷ g, 50 gia đình (thử x = 1, 2, 3 … tốn ~10¹² bước)'],
    than: 'var a = new Array(100000); for (var i = 0; i < a.length; i++) a[i] = 1 + R(10000000); return [maxPortion(a, 50), maxPortion(a, 123456789)];',
  }],
  saiMau: [
    { ten: ['Tries x = 1, 2, 3 … until it fails', 'Thử x = 1, 2, 3 … tới khi hỏng'], ma: 'function maxPortion(bags, students) {\n  var x = 1;\n  for (;;) { var c = 0; for (var b of bags) c += Math.floor(b / x); if (c < students) return x - 1; x++; }\n}\n' },
    { ten: ['Search on [1, max], returns lo (never 0)', 'Tìm trên [1, max], trả lo (không bao giờ ra 0)'], ma: 'function maxPortion(bags, students) {\n  var lo = 1, hi = 1; for (var b0 of bags) if (b0 > hi) hi = b0;\n  while (lo < hi) { var m = lo + Math.ceil((hi - lo) / 2), c = 0; for (var b of bags) c += Math.floor(b / m); if (c >= students) lo = m; else hi = m - 1; }\n  return lo;\n}\n' },
  ],
});

/* ── 2. "Tối thiểu hoá cái lớn nhất": cắt video bài giảng thành đoạn ── */
function shortestLongestSegment(lengths, maxCuts) {
  function cutsNeeded(x) { // cuts so that no segment is longer than x
    var cuts = 0;
    for (var i = 0; i < lengths.length; i++) cuts += Math.ceil(lengths[i] / x) - 1; // a video of L needs ceil(L/x) pieces
    return cuts;
  }
  var lo = 1, hi = 1;
  for (var j = 0; j < lengths.length; j++) if (lengths[j] > hi) hi = lengths[j]; // x = max needs 0 cuts ⇒ always feasible
  while (lo < hi) {                       // first x with cutsNeeded(x) <= maxCuts (false … false true … true)
    var mid = lo + ((hi - lo) >> 1);
    if (cutsNeeded(mid) <= maxCuts) hi = mid; else lo = mid + 1;
  }
  return lo;
}
const D2 = bai({
  ten: 'Lecture videos: cut so the longest segment is as short as possible', kho: 'MEDIUM', phut: 25, ham: 'shortestLongestSegment',
  en: `<p>The course team uploads recorded lectures to a platform that works best with short segments. <code>lengths[i]</code> is the length of video <code>i</code> in seconds. The editor can make at most <code>maxCuts</code> cuts <b>in total</b>; each cut splits one segment into two at any whole second. Videos are never joined.</p>
<p>Write <code>shortestLongestSegment(lengths, maxCuts)</code> returning the smallest possible length of the <b>longest</b> segment after cutting.</p>`,
  vi: `<p>Nhóm làm khoá học tải bài giảng quay sẵn lên một nền tảng chạy tốt nhất với đoạn ngắn. <code>lengths[i]</code> là độ dài video <code>i</code> tính bằng giây. Người dựng được cắt tối đa <code>maxCuts</code> nhát <b>tổng cộng</b>; mỗi nhát chia một đoạn thành hai ở một giây nguyên bất kỳ. Không bao giờ ghép các video với nhau.</p>
<p>Viết <code>shortestLongestSegment(lengths, maxCuts)</code> trả về độ dài nhỏ nhất có thể của đoạn <b>dài nhất</b> sau khi cắt.</p>`,
  dauVao: ['lengths — positive integers; maxCuts — integer ≥ 0.', 'lengths — số nguyên dương; maxCuts — số nguyên ≥ 0.'],
  dauRa: ['The minimal possible longest-segment length.', 'Độ dài nhỏ nhất có thể của đoạn dài nhất.'],
  rangBuoc: [['1 ≤ lengths.length ≤ 100 000; 1 ≤ lengths[i] ≤ 10⁹; 0 ≤ maxCuts ≤ 10⁹.', '1 ≤ lengths.length ≤ 100 000; 1 ≤ lengths[i] ≤ 10⁹; 0 ≤ maxCuts ≤ 10⁹.'], ['Target: O(n log(max length)).', 'Mục tiêu: O(n log(độ dài lớn nhất)).']],
  goiY: [
    ['Fix a target x for the longest segment. How many cuts does a video of length L need so that every piece is ≤ x? <code>ceil(L / x) − 1</code> — and the videos are independent.', 'Cố định một mục tiêu x cho đoạn dài nhất. Video dài L cần bao nhiêu nhát để mọi mảnh ≤ x? <code>ceil(L / x) − 1</code> — và các video độc lập với nhau.'],
    ['Larger x needs fewer cuts, so "cutsNeeded(x) ≤ maxCuts" is false…false true…true on <code>[1, max]</code>. Binary-search the first true.', 'x càng lớn càng cần ít nhát, nên "cutsNeeded(x) ≤ maxCuts" là false…false true…true trên <code>[1, max]</code>. Tìm nhị phân true đầu tiên.'],
  ],
  loi: [
    ['Greedy "always cut the longest segment in half": <code>[9]</code> with 2 cuts gives 9 → 5 + 4 → 3 + 2 + 4 ⇒ 4, but 3 + 3 + 3 ⇒ 3 is possible.', 'Tham lam "luôn cắt đôi đoạn dài nhất": <code>[9]</code> với 2 nhát ra 9 → 5 + 4 → 3 + 2 + 4 ⇒ 4, trong khi 3 + 3 + 3 ⇒ 3 làm được.'],
    ['Counting <code>Math.floor(L / x)</code> cuts: a video of exactly 2x needs one cut, not two (off by one whenever x divides L).', 'Đếm <code>Math.floor(L / x)</code> nhát: video dài đúng 2x chỉ cần một nhát, không phải hai (lệch một mỗi khi x chia hết L).'],
    ['Trying x = 1, 2, 3 … until it fits: with 10⁹-second videos and few cuts that is ~10⁹ checks.', 'Thử x = 1, 2, 3 … tới khi vừa: với video 10⁹ giây và ít nhát cắt là ~10⁹ lần kiểm.'],
  ],
  gt: ['For a target x the cheapest way to make every piece of a video ≤ x uses exactly <code>ceil(L/x) − 1</code> cuts, and the videos do not interact, so the total is a sum. That total never increases as x grows, which makes "x is achievable with maxCuts cuts" monotone — binary search on x over [1, max] (x = max needs no cut, so a true always exists). O(n) per check × O(log max) ≈ 30 checks ⇒ O(n log max). Greedy halving looks natural but splits unevenly; the answer-space search never has to decide where to cut.', 'Với mục tiêu x, cách rẻ nhất để mọi mảnh của một video ≤ x dùng đúng <code>ceil(L/x) − 1</code> nhát, và các video không ảnh hưởng nhau, nên tổng là một phép cộng. Tổng đó không bao giờ tăng khi x tăng, nên "x làm được với maxCuts nhát" là đơn điệu — tìm nhị phân trên x trong [1, max] (x = max không cần nhát nào, nên luôn có một true). O(n) mỗi lần kiểm × O(log max) ≈ 30 lần ⇒ O(n log max). Cắt đôi tham lam trông tự nhiên nhưng chia không đều; tìm trên không gian đáp án không bao giờ phải quyết định cắt ở đâu.'],
  kn: ['binary search on the answer', 'minimise the maximum'],
  tns: [tn('minimise the maximum', 'tối thiểu hoá giá trị lớn nhất'), tn('ceiling division', 'chia làm tròn lên', 'ceil(L / x).'), tn('greedy', 'tham lam')],
  dau: `/**
 * lengths: number[] (seconds), maxCuts: number
 * returns the smallest possible length of the longest segment
 */
function shortestLongestSegment(lengths, maxCuts) {
  // Write your solution here
  var longest = 0;
  for (var L of lengths) if (L > longest) longest = L;
  return longest;
}
`,
  giai: '// Reference solution — binary search on x: first x with sum(ceil(L/x) - 1) <= maxCuts.\n' + nguon(shortestLongestSegment),
  cases: [
    { args: [[9], 2], moTa: ['3 + 3 + 3 (halving greedily gives 4)', '3 + 3 + 3 (cắt đôi tham lam ra 4)'] },
    { args: [[2700, 1800, 600], 4] },
    { args: [[500, 300], 0], moTa: ['No cuts ⇒ the longest video', 'Không cắt ⇒ video dài nhất'] },
    { args: [[1, 1, 1], 100], an: true },
    { args: [[10, 10], 2], an: true, moTa: ['Exact division: 10 = 5 + 5 needs one cut each', 'Chia hết: 10 = 5 + 5 cần một nhát mỗi video'] },
    { args: [[1000000000], 999999999], an: true },
    { args: [[7, 17, 4, 9], 5], an: true },
    { args: [[1000000000, 1], 3], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 videos up to 10⁹ s, 1 000 cuts (trying x = 1, 2, 3 … never finishes)', 'Hiệu năng: 100 000 video tới 10⁹ giây, 1 000 nhát (thử x = 1, 2, 3 … không bao giờ xong)'],
    than: 'var a = new Array(100000); for (var i = 0; i < a.length; i++) a[i] = 1 + R(1000000000); return shortestLongestSegment(a, 1000);',
  }],
  saiMau: [
    { ten: ['Greedy: always halve the longest segment', 'Tham lam: luôn cắt đôi đoạn dài nhất'], ma: 'function shortestLongestSegment(lengths, maxCuts) {\n  var a = lengths.slice();\n  for (var c = 0; c < maxCuts && c < 1000; c++) { var i = 0; for (var j = 1; j < a.length; j++) if (a[j] > a[i]) i = j; var L = a[i]; a[i] = Math.ceil(L / 2); a.push(Math.floor(L / 2)); }\n  var m = 0; for (var x of a) if (x > m) m = x;\n  return m;\n}\n' },
    { ten: ['Tries x = 1, 2, 3 … until it fits (also times out on a hidden case)', 'Thử x = 1, 2, 3 … tới khi vừa (hết giờ cả ở một ca ẩn)'], ma: 'function shortestLongestSegment(lengths, maxCuts) {\n  for (var x = 1; ; x++) { var c = 0; for (var L of lengths) c += Math.ceil(L / x) - 1; if (c <= maxCuts) return x; }\n}\n' },
  ],
});

/* ── 3. Tìm trên đáp án + đếm bằng hai con trỏ: khoảng cách cặp nhỏ thứ k ── */
function kthSmallestGap(latencies, k) {
  var a = latencies.slice().sort(function (x, y) { return x - y; }); // numeric sort on a COPY
  function pairsWithin(d) { // number of pairs i < j with a[j] - a[i] <= d — two pointers, O(n)
    var count = 0, i = 0;
    for (var j = 0; j < a.length; j++) {
      while (a[j] - a[i] > d) i++;
      count += j - i; // every i' in [i, j) pairs with j
    }
    return count;
  }
  var lo = 0, hi = a[a.length - 1] - a[0];  // the answer is a gap value in [0, max - min]
  while (lo < hi) {                          // first d with at least k pairs within d
    var mid = lo + Math.floor((hi - lo) / 2);
    if (pairsWithin(mid) >= k) hi = mid; else lo = mid + 1;
  }
  return lo;
}
const D3 = bai({
  ten: 'Network lab: the k-th smallest latency gap between two PCs', kho: 'HARD', phut: 35, ham: 'kthSmallestGap',
  en: `<p>The networking lab measured the ping latency of every PC to the gateway, <code>latencies[i]</code> in microseconds. To pick a threshold for "these two PCs behave alike", the instructor wants the <code>k</code>-th smallest value among the gaps <code>|latencies[i] − latencies[j]|</code> over all pairs <code>i &lt; j</code> (1-indexed, gaps counted with multiplicity).</p>
<p>Write <code>kthSmallestGap(latencies, k)</code>. With 100 000 PCs there are about 5·10⁹ pairs — you cannot list them.</p>`,
  vi: `<p>Phòng lab mạng đo độ trễ ping của mọi máy tới gateway, <code>latencies[i]</code> micro giây. Để chọn ngưỡng "hai máy này giống nhau", giảng viên muốn giá trị nhỏ thứ <code>k</code> trong các khoảng cách <code>|latencies[i] − latencies[j]|</code> của mọi cặp <code>i &lt; j</code> (đếm từ 1, khoảng cách trùng được đếm đủ lần).</p>
<p>Viết <code>kthSmallestGap(latencies, k)</code>. Với 100 000 máy có khoảng 5·10⁹ cặp — không thể liệt kê hết.</p>`,
  dauVao: ['latencies — non-negative integers, n ≥ 2; 1 ≤ k ≤ n(n−1)/2.', 'latencies — số nguyên không âm, n ≥ 2; 1 ≤ k ≤ n(n−1)/2.'],
  dauRa: ['The k-th smallest pair gap.', 'Khoảng cách cặp nhỏ thứ k.'],
  rangBuoc: [['2 ≤ n ≤ 100 000; 0 ≤ latencies[i] ≤ 10⁹.', '2 ≤ n ≤ 100 000; 0 ≤ latencies[i] ≤ 10⁹.'], ['Target: O(n log n + n log W), W = max − min.', 'Mục tiêu: O(n log n + n log W), W = max − min.']],
  goiY: [
    ['Search the ANSWER d in <code>[0, max − min]</code>. "At least k pairs have gap ≤ d" is false…false true…true in d; the first true is the k-th smallest gap.', 'Tìm trên ĐÁP ÁN d trong <code>[0, max − min]</code>. "Có ít nhất k cặp có khoảng cách ≤ d" là false…false true…true theo d; true đầu tiên chính là khoảng cách nhỏ thứ k.'],
    ['After sorting, count pairs with gap ≤ d in O(n) with two pointers: for each right end j move i forward while <code>a[j] − a[i] &gt; d</code>; then j − i partners lie in the window.', 'Sau khi sắp, đếm số cặp có khoảng cách ≤ d trong O(n) bằng hai con trỏ: với mỗi đầu phải j đẩy i lên khi <code>a[j] − a[i] &gt; d</code>; khi đó có j − i bạn ghép nằm trong cửa sổ.'],
    ['Sort numerically on a copy: <code>slice().sort((x, y) =&gt; x − y)</code>. The default <code>sort()</code> compares strings ("100" &lt; "9").', 'Sắp theo số trên một bản sao: <code>slice().sort((x, y) =&gt; x − y)</code>. <code>sort()</code> mặc định so chuỗi ("100" &lt; "9").'],
  ],
  loi: [
    ['Calling <code>sort()</code> without a comparator: latencies of different digit counts end up in string order and the two-pointer count is wrong.', 'Gọi <code>sort()</code> không có hàm so sánh: độ trễ khác số chữ số bị xếp theo thứ tự chuỗi và phép đếm hai con trỏ sai.'],
    ['Searching for "the first d with exactly k pairs": counts jump over k when several pairs share a gap, so no d has exactly k. Use "at least k".', 'Tìm "d đầu tiên có đúng k cặp": số đếm nhảy qua k khi nhiều cặp cùng khoảng cách, nên không d nào có đúng k. Dùng "ít nhất k".'],
    ['Counting pairs ≤ d with two nested loops: O(n²) per check — 5·10⁹ × 30 steps.', 'Đếm cặp ≤ d bằng hai vòng lồng: O(n²) mỗi lần kiểm — 5·10⁹ × 30 bước.'],
  ],
  gt: ['Let C(d) = number of pairs with gap ≤ d. C is non-decreasing in d, and the k-th smallest gap g is exactly the smallest d with C(d) ≥ k (C(g−1) &lt; k ≤ C(g)), so a first-true search over [0, W] finds it — and the result is always a real gap. After an O(n log n) sort, C(d) takes O(n) with two pointers because i only moves forward as j moves forward. With ≈ 30 values of d that is O(n log n + n log W) time and O(n) memory, instead of materialising ~5·10⁹ gaps.', 'Gọi C(d) = số cặp có khoảng cách ≤ d. C không giảm theo d, và khoảng cách nhỏ thứ k là g đúng bằng d nhỏ nhất có C(d) ≥ k (C(g−1) &lt; k ≤ C(g)), nên phép tìm true-đầu-tiên trên [0, W] tìm ra nó — và kết quả luôn là một khoảng cách có thật. Sau khi sắp O(n log n), C(d) tốn O(n) bằng hai con trỏ vì i chỉ tiến khi j tiến. Với ≈ 30 giá trị d là O(n log n + n log W) thời gian và O(n) bộ nhớ, thay vì dựng ra ~5·10⁹ khoảng cách.'],
  kn: ['binary search on the answer', 'two pointers', 'counting'],
  tns: [tn('k-th smallest', 'nhỏ thứ k'), tn('counting function', 'hàm đếm', 'C(d): có bao nhiêu thứ ≤ d.'), tn('with multiplicity', 'đếm cả lặp', 'giá trị trùng được tính đủ số lần.'), tn('comparator', 'hàm so sánh')],
  dau: `/**
 * latencies: number[], k: number (1-indexed)
 * returns the k-th smallest |latencies[i] - latencies[j]| over all pairs i < j
 */
function kthSmallestGap(latencies, k) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — binary search on the gap d; count pairs <= d with two pointers on the sorted copy.\n' + nguon(kthSmallestGap),
  cases: [
    { args: [[120, 90, 135, 100], 2], moTa: ['Gaps 10, 15, 20, 30, 35, 45 ⇒ 2nd is 15', 'Khoảng cách 10, 15, 20, 30, 35, 45 ⇒ thứ 2 là 15'] },
    { args: [[5, 5, 5], 3], moTa: ['All gaps are 0', 'Mọi khoảng cách là 0'] },
    { args: [[9, 100], 1], moTa: ['Numeric sort, not string sort', 'Sắp theo số, không theo chuỗi'] },
    { args: [[1, 3, 1], 1], an: true },
    { args: [[1, 3, 1], 3], an: true },
    { args: [[10, 2, 33, 4, 1000, 7], 7], an: true },
    { args: [[0, 1000000000], 1], an: true },
    { args: [[1, 2, 3, 4, 5, 6], 15], an: true, moTa: ['k = n(n−1)/2 ⇒ max − min', 'k = n(n−1)/2 ⇒ max − min'] },
  ],
  perf: [{
    moTa: ['Performance: 100 000 PCs (~5·10⁹ pairs; counting with nested loops times out)', 'Hiệu năng: 100 000 máy (~5·10⁹ cặp; đếm bằng vòng lồng hết giờ)'],
    than: 'var n = 100000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = R(1000000000); var before = a[0] + a[n - 1]; return [kthSmallestGap(a, 1), kthSmallestGap(a, 2500000000), before === a[0] + a[n - 1]];',
  }],
  saiMau: [
    { ten: ['O(n² log W): count pairs with nested loops', 'O(n² log W): đếm cặp bằng vòng lồng'], chiHieuNang: true, ma: 'function kthSmallestGap(latencies, k) {\n  var a = latencies, mx = a[0], mn = a[0]; for (var v of a) { if (v > mx) mx = v; if (v < mn) mn = v; }\n  var lo = 0, hi = mx - mn;\n  while (lo < hi) { var m = Math.floor((lo + hi) / 2), c = 0; for (var i = 0; i < a.length; i++) for (var j = i + 1; j < a.length; j++) if (Math.abs(a[i] - a[j]) <= m) c++; if (c >= k) hi = m; else lo = m + 1; }\n  return lo;\n}\n' },
    { ten: ['sort() without a comparator (string order)', 'sort() không có hàm so sánh (thứ tự chuỗi)'], ma: 'function kthSmallestGap(latencies, k) {\n  var a = latencies.slice().sort();\n  function c(d) { var n = 0, i = 0; for (var j = 0; j < a.length; j++) { while (a[j] - a[i] > d) i++; n += j - i; } return n; }\n  var lo = 0, hi = Math.abs(a[a.length - 1] - a[0]);\n  while (lo < hi) { var m = Math.floor((lo + hi) / 2); if (c(m) >= k) hi = m; else lo = m + 1; }\n  return lo;\n}\n' },
  ],
});

export default mod('dsa-4-3-khong-gian-dap-an', '4.3 Binary search on the answer', [D1, D2, D3]);
