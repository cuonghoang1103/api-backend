/** Coding Interview Prep · 4.1 — Tìm nhị phân một khuôn "T đầu tiên": đếm ≥ x, tra khung giờ (T cuối), trên mảng tiền tố, và cửa sổ k phần tử gần nhất. Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. "T đầu tiên": bao nhiêu sinh viên đạt ít nhất x điểm ── */
function firstAtLeast(a, x) {
  var lo = 0, hi = a.length;               // answer lives in [lo, hi]; hi = a.length means "none"
  while (lo < hi) {
    var mid = lo + ((hi - lo) >> 1);       // never (lo + hi) / 2 in Java — it overflows
    if (a[mid] >= x) hi = mid;             // predicate true ⇒ the first true is at mid or to its left
    else lo = mid + 1;                     // false ⇒ strictly to the right
  }
  return lo;
}
function countAtLeast(scores, queries) {
  var n = scores.length;
  // scores is sorted ascending ⇒ everything from the first index with score >= x to the end qualifies
  return queries.map(function (x) { return n - firstAtLeast(scores, x); });
}
const D1 = bai({
  ten: 'Exam results: how many students reached at least x', kho: 'EASY', phut: 15, ham: 'countAtLeast',
  en: `<p>The training office has the final scores of a cohort, already <b>sorted ascending</b> (scores × 10, so 8.5 is 85). Different scholarships have different thresholds, and the dashboard asks many questions of the form "how many students scored <b>at least</b> <code>x</code>?".</p>
<p>Write <code>countAtLeast(scores, queries)</code> returning, for each <code>x</code> in <code>queries</code>, the number of scores <code>≥ x</code>.</p>`,
  vi: `<p>Phòng đào tạo có điểm tổng kết của một khoá, đã <b>sắp tăng dần</b> (điểm × 10, nên 8.5 là 85). Mỗi học bổng có ngưỡng riêng, và trang tổng quan hỏi rất nhiều câu dạng "bao nhiêu sinh viên đạt <b>ít nhất</b> <code>x</code>?".</p>
<p>Viết <code>countAtLeast(scores, queries)</code> trả về, với mỗi <code>x</code> trong <code>queries</code>, số điểm <code>≥ x</code>.</p>`,
  dauVao: ['scores — sorted ascending integers (duplicates allowed); queries — integers.', 'scores — số nguyên sắp tăng dần (có thể trùng); queries — số nguyên.'],
  dauRa: ['number[] — one count per query.', 'number[] — mỗi truy vấn một số đếm.'],
  rangBuoc: [['0 ≤ scores.length, queries.length ≤ 200 000; 0 ≤ values ≤ 100.', '0 ≤ scores.length, queries.length ≤ 200 000; 0 ≤ giá trị ≤ 100.'], ['Target: O(log n) per query.', 'Mục tiêu: O(log n) mỗi truy vấn.']],
  goiY: [
    ['Because the array is sorted, the predicate <code>scores[i] &gt;= x</code> is false … false true … true. You need the index of the FIRST true.', 'Vì mảng đã sắp, mệnh đề <code>scores[i] &gt;= x</code> là false … false true … true. Cần chỉ số của true ĐẦU TIÊN.'],
    ['Search on the half-open range <code>[0, n)</code>: <code>hi = n</code> means "no true at all". If <code>a[mid] &gt;= x</code> set <code>hi = mid</code>, else <code>lo = mid + 1</code>. Then the count is <code>n − lo</code>.', 'Tìm trên khoảng nửa mở <code>[0, n)</code>: <code>hi = n</code> nghĩa là "không có true nào". Nếu <code>a[mid] &gt;= x</code> thì <code>hi = mid</code>, ngược lại <code>lo = mid + 1</code>. Khi đó số đếm là <code>n − lo</code>.'],
  ],
  loi: [
    ['Using <code>&gt;</code> instead of <code>&gt;=</code>: students who scored exactly the threshold are not counted.', 'Dùng <code>&gt;</code> thay vì <code>&gt;=</code>: sinh viên đạt đúng ngưỡng không được đếm.'],
    ['Starting with <code>hi = n − 1</code>: when nobody reaches x the search still returns the last index and the count becomes 1 instead of 0.', 'Bắt đầu với <code>hi = n − 1</code>: khi không ai đạt x, phép tìm vẫn trả chỉ số cuối và số đếm thành 1 thay vì 0.'],
    ['Scanning (or <code>filter</code>) per query: O(n·q) = 4·10¹⁰ for 200 000 × 200 000.', 'Quét (hoặc <code>filter</code>) cho mỗi truy vấn: O(n·q) = 4·10¹⁰ với 200 000 × 200 000.'],
  ],
  gt: ['The invariant of the template: everything left of <code>lo</code> is false, everything from <code>hi</code> on is true. Each round halves <code>hi − lo</code> and keeps the invariant, so when <code>lo === hi</code> it is exactly the first true (or n if none). Then all of <code>[lo, n)</code> qualifies. O(log n) per query ⇒ O(q log n) total, O(1) extra memory besides the output.', 'Bất biến của khuôn: mọi thứ bên trái <code>lo</code> là false, mọi thứ từ <code>hi</code> trở đi là true. Mỗi vòng chia đôi <code>hi − lo</code> và giữ bất biến, nên khi <code>lo === hi</code> nó chính là true đầu tiên (hoặc n nếu không có). Khi đó cả đoạn <code>[lo, n)</code> đạt. O(log n) mỗi truy vấn ⇒ tổng O(q log n), O(1) bộ nhớ phụ ngoài kết quả.'],
  kn: ['binary search', 'lower bound'],
  tns: [tn('lower bound', 'cận dưới', 'chỉ số đầu tiên có giá trị ≥ x.'), tn('half-open range [lo, hi)', 'khoảng nửa mở'), tn('invariant', 'bất biến', 'điều luôn đúng sau mỗi vòng lặp.'), tn('predicate', 'mệnh đề (điều kiện đúng/sai)')],
  dau: `/**
 * scores: number[] (sorted ascending), queries: number[]
 * returns, for each x, how many scores are >= x
 */
function countAtLeast(scores, queries) {
  // Write your solution here
  return queries.map(function () { return 0; });
}
`,
  giai: '// Reference solution — "first true" binary search on [0, n), then n - index.\n' + nguon(firstAtLeast, countAtLeast),
  cases: [
    { args: [[55, 62, 70, 70, 85, 91], [70, 80, 50]] },
    { args: [[60, 60, 60], [60, 61]], moTa: ['Exactly the threshold counts', 'Đúng bằng ngưỡng vẫn được tính'] },
    { args: [[], [10]], an: true },
    { args: [[10, 20, 30], [0, 100, 30, 31, 10]], an: true },
    { args: [[50], [49, 50, 51]], an: true },
    { args: [[1, 1, 2, 2, 2, 3, 3, 3, 3], [2, 3, 4, 1]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 scores × 200 000 queries (scanning per query is 4·10¹⁰ steps)', 'Hiệu năng: 200 000 điểm × 200 000 truy vấn (quét mỗi truy vấn là 4·10¹⁰ bước)'],
    than: 'var n = 200000, a = new Array(n), q = new Array(n); for (var i = 0; i < n; i++) { a[i] = R(101); q[i] = R(102); } a.sort(function (x, y) { return x - y; }); var r = countAtLeast(a, q), s = 0; for (var j = 0; j < n; j++) s += r[j]; return { answers: r.length, sum: s, first: r.slice(0, 3) };',
  }],
  saiMau: [
    { ten: ['O(n·q): scan the scores for every query', 'O(n·q): quét điểm cho mỗi truy vấn'], chiHieuNang: true, ma: 'function countAtLeast(scores, queries) {\n  return queries.map(function (x) { var c = 0; for (var i = 0; i < scores.length; i++) if (scores[i] >= x) c++; return c; });\n}\n' },
    { ten: ['Uses > instead of >= (misses the threshold)', 'Dùng > thay vì >= (bỏ sót đúng ngưỡng)'], ma: 'function countAtLeast(scores, queries) {\n  return queries.map(function (x) { var lo = 0, hi = scores.length; while (lo < hi) { var m = (lo + hi) >> 1; if (scores[m] > x) hi = m; else lo = m + 1; } return scores.length - lo; });\n}\n' },
  ],
});

/* ── 2. "T cuối cùng": khung giờ nào chứa thời điểm t ── */
function slotOf(starts, ends, times) {
  return times.map(function (t) {
    // first index whose start is > t …
    var lo = 0, hi = starts.length;
    while (lo < hi) { var mid = lo + ((hi - lo) >> 1); if (starts[mid] > t) hi = mid; else lo = mid + 1; }
    var i = lo - 1;                          // … so lo - 1 is the LAST slot starting at or before t
    return i >= 0 && t < ends[i] ? i : -1;   // slots are half-open [start, end): t === end is already outside
  });
}
const D2 = bai({
  ten: 'Lab timetable: which slot is running at time t', kho: 'MEDIUM', phut: 20, ham: 'slotOf',
  en: `<p>Room AL-L102 has a timetable of non-overlapping slots sorted by start time: slot <code>i</code> runs on the half-open interval <code>[starts[i], ends[i])</code> (minutes since midnight). There can be gaps between slots — breaks, lunch. The door screen receives many timestamps and must show which slot is running.</p>
<p>Write <code>slotOf(starts, ends, times)</code> returning, for each <code>t</code>, the index of the slot that contains <code>t</code>, or <code>-1</code> if the room is free at <code>t</code>.</p>`,
  vi: `<p>Phòng AL-L102 có thời khoá biểu gồm các ca không chồng nhau, sắp theo giờ bắt đầu: ca <code>i</code> chạy trên khoảng nửa mở <code>[starts[i], ends[i])</code> (phút tính từ nửa đêm). Giữa các ca có thể có khoảng trống — giải lao, ăn trưa. Màn hình ở cửa nhận rất nhiều mốc thời gian và phải hiện ca nào đang diễn ra.</p>
<p>Viết <code>slotOf(starts, ends, times)</code> trả về, với mỗi <code>t</code>, chỉ số ca chứa <code>t</code>, hoặc <code>-1</code> nếu phòng trống lúc <code>t</code>.</p>`,
  dauVao: ['starts, ends — same length, starts strictly increasing, starts[i] < ends[i] ≤ starts[i+1]; times — integers.', 'starts, ends — cùng độ dài, starts tăng ngặt, starts[i] < ends[i] ≤ starts[i+1]; times — số nguyên.'],
  dauRa: ['number[] — a slot index or -1 per time.', 'number[] — chỉ số ca hoặc -1 cho mỗi mốc.'],
  rangBuoc: [['0 ≤ slots, times ≤ 200 000; 0 ≤ values ≤ 10⁹.', '0 ≤ số ca, số mốc ≤ 200 000; 0 ≤ giá trị ≤ 10⁹.'], ['Target: O(log n) per time.', 'Mục tiêu: O(log n) mỗi mốc.']],
  goiY: [
    ['Only one slot can contain t: the LAST one that starts at or before t. Any earlier slot has already ended, any later one has not started.', 'Chỉ một ca có thể chứa t: ca CUỐI CÙNG bắt đầu không muộn hơn t. Mọi ca trước đó đã kết thúc, mọi ca sau chưa bắt đầu.'],
    ['"Last start ≤ t" = (first start &gt; t) − 1 — reuse the same first-true template with the predicate <code>starts[mid] &gt; t</code>. Then check <code>t &lt; ends[i]</code> for the gap case.', '"Start cuối ≤ t" = (start đầu tiên &gt; t) − 1 — dùng lại đúng khuôn true-đầu-tiên với mệnh đề <code>starts[mid] &gt; t</code>. Rồi kiểm <code>t &lt; ends[i]</code> cho trường hợp rơi vào khoảng trống.'],
  ],
  loi: [
    ['Treating slots as closed <code>[start, end]</code>: at exactly 09:30 when one class ends and the next starts, the screen shows the class that just finished.', 'Coi ca là đoạn đóng <code>[start, end]</code>: đúng 09:30 khi một ca kết thúc và ca sau bắt đầu, màn hình lại hiện ca vừa xong.'],
    ['Returning the last slot with start ≤ t without checking its end: during lunch the screen claims the morning class is still on.', 'Trả ca cuối có start ≤ t mà không kiểm end: giờ ăn trưa màn hình vẫn báo ca sáng đang học.'],
    ['Writing a second "last true" template with <code>lo = mid</code>: with <code>mid</code> rounded down it loops forever when <code>hi = lo + 1</code>. Derive "last" from "first" instead.', 'Viết thêm khuôn "true cuối" với <code>lo = mid</code>: khi <code>mid</code> làm tròn xuống nó lặp mãi lúc <code>hi = lo + 1</code>. Hãy suy "cuối" từ "đầu".'],
  ],
  gt: ['Starts are sorted, so "starts[i] &gt; t" is false…false true…true; its first true index minus one is the last slot that has started by t. Because slots do not overlap, that slot is the only candidate, and a single comparison with its end decides between "running" and "gap". One binary search per time ⇒ O(q log n), O(1) extra memory. Deriving the "last" answer from the "first" template avoids the classic infinite loop of a hand-written second template.', 'Starts đã sắp, nên "starts[i] &gt; t" là false…false true…true; chỉ số true đầu tiên trừ một là ca cuối đã bắt đầu tính tới t. Vì các ca không chồng nhau, đó là ứng viên duy nhất, và một phép so với end của nó quyết định "đang học" hay "khoảng trống". Mỗi mốc một lần tìm nhị phân ⇒ O(q log n), O(1) bộ nhớ phụ. Suy câu trả lời "cuối" từ khuôn "đầu" tránh được vòng lặp vô hạn kinh điển của khuôn thứ hai viết tay.'],
  kn: ['binary search', 'upper bound', 'intervals'],
  tns: [tn('upper bound', 'cận trên', 'chỉ số đầu tiên có giá trị > x.'), tn('last true', 'true cuối cùng'), tn('half-open interval', 'khoảng nửa mở', '[start, end): gồm start, không gồm end.')],
  dau: `/**
 * starts, ends: number[] — slot i is [starts[i], ends[i]), sorted, non-overlapping
 * times: number[]
 * returns for each t the index of the slot containing t, or -1
 */
function slotOf(starts, ends, times) {
  // Write your solution here
  return times.map(function () { return -1; });
}
`,
  giai: '// Reference solution — last start <= t = (first start > t) - 1, then check the end.\n' + nguon(slotOf),
  cases: [
    { args: [[450, 555, 660, 780], [540, 645, 750, 870], [460, 545, 555, 900]], moTa: ['In a slot, in a break, at a start, after the last slot', 'Trong ca, giờ nghỉ, đúng giờ bắt đầu, sau ca cuối'] },
    { args: [[450, 540], [540, 630], [540]], moTa: ['Back-to-back: at 540 the second slot is running', 'Nối tiếp: lúc 540 là ca thứ hai'] },
    { args: [[], [], [100]], an: true },
    { args: [[100], [200], [99, 100, 199, 200]], an: true },
    { args: [[0, 10, 20, 30], [5, 15, 25, 35], [4, 5, 9, 10, 34, 35, -1]], an: true },
    { args: [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6], [3, 1, 5, 6]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 slots × 200 000 timestamps (a linear scan per timestamp times out)', 'Hiệu năng: 200 000 ca × 200 000 mốc (quét tuyến tính mỗi mốc hết giờ)'],
    than: 'var n = 200000, s = new Array(n), e = new Array(n), x = 0; for (var i = 0; i < n; i++) { x += R(5); s[i] = x; x += 1 + R(10); e[i] = x; } var q = new Array(n); for (var j = 0; j < n; j++) q[j] = R(x + 10); var r = slotOf(s, e, q), free = 0, sum = 0; for (var k = 0; k < n; k++) { if (r[k] < 0) free++; else sum += r[k]; } return { free: free, sumOfIndexes: sum };',
  }],
  saiMau: [
    { ten: ['O(n·q): scan the slots for each timestamp', 'O(n·q): quét các ca cho mỗi mốc'], chiHieuNang: true, ma: 'function slotOf(starts, ends, times) {\n  return times.map(function (t) { for (var i = 0; i < starts.length; i++) if (starts[i] <= t && t < ends[i]) return i; return -1; });\n}\n' },
    { ten: ['Closed intervals [start, end]', 'Đoạn đóng [start, end]'], ma: 'function slotOf(starts, ends, times) {\n  return times.map(function (t) { var lo = 0, hi = starts.length; while (lo < hi) { var m = (lo + hi) >> 1; if (ends[m] >= t) hi = m; else lo = m + 1; } return lo < starts.length && starts[lo] <= t ? lo : -1; });\n}\n' },
  ],
});

/* ── 3. Tìm nhị phân trên mảng tiền tố: ngày đầu tiên vượt hạn mức lưu trữ ── */
function firstDayOver(dailyMB, quotas) {
  var pre = new Array(dailyMB.length), run = 0;
  for (var i = 0; i < dailyMB.length; i++) { run += dailyMB[i]; pre[i] = run; } // usage never decreases ⇒ pre is sorted
  return quotas.map(function (q) {
    var lo = 0, hi = pre.length;
    while (lo < hi) { var mid = lo + ((hi - lo) >> 1); if (pre[mid] > q) hi = mid; else lo = mid + 1; } // first day strictly OVER
    return lo < pre.length ? lo : -1;
  });
}
const D3 = bai({
  ten: 'Cloud drive: the first day a quota is exceeded', kho: 'MEDIUM', phut: 20, ham: 'firstDayOver',
  en: `<p>A student club shares one cloud drive. Nothing is ever deleted, and <code>dailyMB[d]</code> is how many MB were uploaded on day <code>d</code> (possibly 0). The admin compares several storage plans: for a plan with quota <code>q</code> MB, on which day does the total usage first go <b>strictly over</b> <code>q</code>?</p>
<p>Write <code>firstDayOver(dailyMB, quotas)</code> returning, for each quota, the first day index <code>d</code> with <code>dailyMB[0] + … + dailyMB[d] &gt; q</code>, or <code>-1</code> if usage never exceeds it.</p>`,
  vi: `<p>Một câu lạc bộ sinh viên dùng chung một ổ đám mây. Không bao giờ xoá gì, và <code>dailyMB[d]</code> là số MB được tải lên ở ngày <code>d</code> (có thể bằng 0). Quản trị viên so vài gói lưu trữ: với gói hạn mức <code>q</code> MB, ngày nào tổng dung lượng lần đầu <b>vượt hẳn</b> <code>q</code>?</p>
<p>Viết <code>firstDayOver(dailyMB, quotas)</code> trả về, với mỗi hạn mức, chỉ số ngày đầu tiên <code>d</code> có <code>dailyMB[0] + … + dailyMB[d] &gt; q</code>, hoặc <code>-1</code> nếu không bao giờ vượt.</p>`,
  dauVao: ['dailyMB — non-negative integers; quotas — non-negative integers.', 'dailyMB — số nguyên không âm; quotas — số nguyên không âm.'],
  dauRa: ['number[] — a day index or -1 per quota.', 'number[] — chỉ số ngày hoặc -1 cho mỗi hạn mức.'],
  rangBuoc: [['0 ≤ days, quotas ≤ 200 000; 0 ≤ dailyMB[d] ≤ 10⁴; 0 ≤ q ≤ 2·10⁹.', '0 ≤ số ngày, số hạn mức ≤ 200 000; 0 ≤ dailyMB[d] ≤ 10⁴; 0 ≤ q ≤ 2·10⁹.'], ['Target: O(n + q log n).', 'Mục tiêu: O(n + q log n).']],
  goiY: [
    ['The array itself is not sorted, but the running total is — uploads are never negative. Precompute the prefix sums once.', 'Bản thân mảng không sắp, nhưng tổng tích luỹ thì có — lượng tải lên không bao giờ âm. Tính mảng tổng tiền tố một lần.'],
    ['Now each quota is a "first true" search on the prefix array with the predicate <code>pre[d] &gt; q</code> (strictly over).', 'Giờ mỗi hạn mức là một phép tìm "true đầu tiên" trên mảng tiền tố với mệnh đề <code>pre[d] &gt; q</code> (vượt hẳn).'],
  ],
  loi: [
    ['Binary-searching <code>dailyMB</code> directly: it is not sorted, so the answer is garbage.', 'Tìm nhị phân thẳng trên <code>dailyMB</code>: mảng không sắp, nên kết quả là rác.'],
    ['Using <code>&gt;=</code>: reaching exactly the quota is still within the plan.', 'Dùng <code>&gt;=</code>: chạm đúng hạn mức vẫn nằm trong gói.'],
    ['Re-adding the days for every quota: O(n·q) — the 200 000 × 200 000 check times out.', 'Cộng lại các ngày cho mỗi hạn mức: O(n·q) — kiểm 200 000 × 200 000 hết giờ.'],
  ],
  gt: ['Non-negative daily uploads make the prefix sums non-decreasing, which is exactly what binary search needs: "pre[d] &gt; q" is false…false true…true. Building the prefix array is O(n); each quota is then one O(log n) search ⇒ O(n + q log n) time, O(n) memory. Zero-upload days create equal neighbours in the prefix array, which the first-true template handles without any special case.', 'Lượng tải mỗi ngày không âm làm tổng tiền tố không giảm, đúng điều tìm nhị phân cần: "pre[d] &gt; q" là false…false true…true. Dựng mảng tiền tố O(n); mỗi hạn mức là một lần tìm O(log n) ⇒ O(n + q log n) thời gian, O(n) bộ nhớ. Những ngày không tải gì tạo ra các phần tử bằng nhau liền kề trong mảng tiền tố, khuôn true-đầu-tiên xử lý chúng không cần trường hợp đặc biệt.'],
  kn: ['binary search', 'prefix sum'],
  tns: [tn('prefix sum', 'tổng tiền tố'), tn('monotonic', 'đơn điệu', 'không giảm (hoặc không tăng) dọc theo mảng.'), tn('quota', 'hạn mức')],
  dau: `/**
 * dailyMB: number[] (>= 0), quotas: number[]
 * returns for each quota the first day where the running total is > quota, or -1
 */
function firstDayOver(dailyMB, quotas) {
  // Write your solution here
  return quotas.map(function () { return -1; });
}
`,
  giai: '// Reference solution — prefix sums are sorted ⇒ first-true binary search per quota.\n' + nguon(firstDayOver),
  cases: [
    { args: [[300, 0, 500, 200, 0, 1000], [700, 799, 1000, 5000]] },
    { args: [[100, 100], [200, 199]], moTa: ['Reaching the quota exactly is not over', 'Chạm đúng hạn mức chưa phải vượt'] },
    { args: [[], [0]], an: true },
    { args: [[0, 0, 5], [0, 4, 5]], an: true },
    { args: [[7], [6, 7, 0]], an: true },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 15, 54, 55, 1]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 days × 200 000 quotas (re-adding per quota is O(n·q))', 'Hiệu năng: 200 000 ngày × 200 000 hạn mức (cộng lại cho mỗi hạn mức là O(n·q))'],
    than: 'var n = 200000, d = new Array(n), q = new Array(n); for (var i = 0; i < n; i++) d[i] = R(4) ? R(10001) : 0; for (var j = 0; j < n; j++) q[j] = R(1100000000); var r = firstDayOver(d, q), never = 0, s = 0; for (var k = 0; k < n; k++) { if (r[k] < 0) never++; else s += r[k]; } return { never: never, sumOfDays: s };',
  }],
  saiMau: [
    { ten: ['O(n·q): add the days up again for every quota', 'O(n·q): cộng lại các ngày cho mỗi hạn mức'], chiHieuNang: true, ma: 'function firstDayOver(dailyMB, quotas) {\n  return quotas.map(function (q) { var s = 0; for (var d = 0; d < dailyMB.length; d++) { s += dailyMB[d]; if (s > q) return d; } return -1; });\n}\n' },
    { ten: ['Uses >= (reaching the quota counts as over)', 'Dùng >= (chạm hạn mức bị tính là vượt)'], ma: 'function firstDayOver(dailyMB, quotas) {\n  var p = [], s = 0; for (var x of dailyMB) { s += x; p.push(s); }\n  return quotas.map(function (q) { var lo = 0, hi = p.length; while (lo < hi) { var m = (lo + hi) >> 1; if (p[m] >= q) hi = m; else lo = m + 1; } return lo < p.length ? lo : -1; });\n}\n' },
  ],
});

/* ── 4. Tìm nhị phân trên vị trí cửa sổ: k mốc log gần thời điểm sự cố nhất ── */
function closestWindow(a, k, t) {
  // the answer is a window a[lo .. lo+k-1]; search its START in [0, n-k]
  var lo = 0, hi = a.length - k;
  while (lo < hi) {
    var mid = lo + ((hi - lo) >> 1);
    // compare the element just left of the window's right side with the one just past it:
    // if a[mid] is farther from t than a[mid+k], the window must start after mid (ties keep the smaller value ⇒ strict >)
    if (t - a[mid] > a[mid + k] - t) lo = mid + 1;
    else hi = mid;
  }
  return a.slice(lo, lo + k);
}
function nearestLogs(times, k, incidents) {
  return incidents.map(function (t) { return closestWindow(times, k, t); });
}
const D4 = bai({
  ten: 'Incident review: the k log entries nearest to the alert', kho: 'HARD', phut: 30, ham: 'nearestLogs',
  en: `<p>When the monitoring system fires an alert at time <code>t</code>, the on-call dashboard shows the <code>k</code> log entries whose timestamps are <b>closest</b> to <code>t</code>. <code>times</code> is sorted ascending (it may contain duplicates). Distance is <code>|times[i] − t|</code>; when two entries are equally close, the <b>earlier</b> (smaller) one wins.</p>
<p>Write <code>nearestLogs(times, k, incidents)</code> returning, for each incident time, the chosen <code>k</code> timestamps in ascending order. It is guaranteed that <code>1 ≤ k ≤ times.length</code>.</p>`,
  vi: `<p>Khi hệ thống giám sát báo động ở thời điểm <code>t</code>, bảng trực hiện <code>k</code> dòng log có mốc thời gian <b>gần</b> <code>t</code> nhất. <code>times</code> đã sắp tăng dần (có thể trùng). Khoảng cách là <code>|times[i] − t|</code>; khi hai dòng gần như nhau, dòng <b>sớm hơn</b> (nhỏ hơn) thắng.</p>
<p>Viết <code>nearestLogs(times, k, incidents)</code> trả về, với mỗi thời điểm sự cố, <code>k</code> mốc được chọn theo thứ tự tăng dần. Bảo đảm <code>1 ≤ k ≤ times.length</code>.</p>`,
  dauVao: ['times — sorted integers; k — 1 ≤ k ≤ n; incidents — integers (may lie outside the log range).', 'times — số nguyên đã sắp; k — 1 ≤ k ≤ n; incidents — số nguyên (có thể nằm ngoài khoảng log).'],
  dauRa: ['number[][] — k timestamps per incident, ascending.', 'number[][] — k mốc cho mỗi sự cố, tăng dần.'],
  rangBuoc: [['1 ≤ n ≤ 200 000; 1 ≤ k ≤ n; 0 ≤ incidents ≤ 100 000.', '1 ≤ n ≤ 200 000; 1 ≤ k ≤ n; 0 ≤ số sự cố ≤ 100 000.'], ['Target: O(log(n − k) + k) per incident.', 'Mục tiêu: O(log(n − k) + k) mỗi sự cố.']],
  goiY: [
    ['The answer is always a contiguous window <code>times[s .. s+k−1]</code> of the sorted array. So you only need its start <code>s</code>, which lies in <code>[0, n − k]</code>.', 'Đáp án luôn là một cửa sổ liền nhau <code>times[s .. s+k−1]</code> của mảng đã sắp. Nên chỉ cần điểm bắt đầu <code>s</code>, nằm trong <code>[0, n − k]</code>.'],
    ['For a candidate start <code>mid</code> compare <code>times[mid]</code> (would be dropped if we slide right) with <code>times[mid + k]</code> (would be added). If <code>t − times[mid] &gt; times[mid + k] − t</code>, sliding right is better ⇒ <code>lo = mid + 1</code>; otherwise <code>hi = mid</code>. Do not use <code>Math.abs</code> here — the signed form also handles t outside the window and duplicates.', 'Với điểm bắt đầu thử <code>mid</code>, so <code>times[mid]</code> (sẽ bị bỏ nếu trượt sang phải) với <code>times[mid + k]</code> (sẽ được thêm). Nếu <code>t − times[mid] &gt; times[mid + k] − t</code>, trượt phải tốt hơn ⇒ <code>lo = mid + 1</code>; ngược lại <code>hi = mid</code>. Đừng dùng <code>Math.abs</code> ở đây — dạng có dấu xử lý được cả t nằm ngoài cửa sổ lẫn giá trị trùng.'],
  ],
  loi: [
    ['Breaking ties the wrong way (<code>&gt;=</code>): for times <code>[1, 2, 3, 4, 5]</code>, k = 2, t = 3 you return <code>[3, 4]</code> instead of <code>[2, 3]</code>.', 'Phá hoà sai chiều (<code>&gt;=</code>): với times <code>[1, 2, 3, 4, 5]</code>, k = 2, t = 3 ra <code>[3, 4]</code> thay vì <code>[2, 3]</code>.'],
    ['Comparing with <code>Math.abs(times[mid] − t) &gt; Math.abs(times[mid+k] − t)</code>: with duplicates like <code>[1, 1, 2, 2, 2, 2, 2, 3, 3]</code>, k = 3, t = 3 the window can stop in the wrong place.', 'So bằng <code>Math.abs(times[mid] − t) &gt; Math.abs(times[mid+k] − t)</code>: với giá trị trùng như <code>[1, 1, 2, 2, 2, 2, 2, 3, 3]</code>, k = 3, t = 3 cửa sổ có thể dừng sai chỗ.'],
    ['Shrinking a window from both ends (or sorting by distance) for every incident: O(n) or O(n log n) per incident — the 100 000-incident check times out.', 'Thu cửa sổ từ hai đầu (hoặc sắp theo khoảng cách) cho mỗi sự cố: O(n) hoặc O(n log n) mỗi sự cố — kiểm 100 000 sự cố hết giờ.'],
  ],
  gt: ['Let f(s) = "window starting at s+1 is at least as good as window starting at s", i.e. <code>t − a[s] &gt; a[s+k] − t</code>. Because the array is sorted, f is true…true false…false along s (once the dropped element is no farther than the added one, it stays so for every later start), so the best start is the first s where f is false — a first-true search on the negation, over <code>[0, n−k]</code>. Strict <code>&gt;</code> keeps the left (smaller) element on ties. O(log(n−k)) to find the start plus O(k) to copy the window per incident; the brute force that shrinks from both ends costs O(n − k) per incident.', 'Gọi f(s) = "cửa sổ bắt đầu ở s+1 tốt ít nhất bằng cửa sổ bắt đầu ở s", tức <code>t − a[s] &gt; a[s+k] − t</code>. Vì mảng đã sắp, f là true…true false…false theo s (một khi phần tử bị bỏ không xa hơn phần tử được thêm thì điều đó còn đúng với mọi điểm bắt đầu sau), nên điểm bắt đầu tốt nhất là s đầu tiên mà f sai — một phép tìm true-đầu-tiên trên mệnh đề phủ định, trên <code>[0, n−k]</code>. Dấu <code>&gt;</code> ngặt giữ phần tử bên trái (nhỏ hơn) khi hoà. O(log(n−k)) để tìm điểm bắt đầu cộng O(k) để chép cửa sổ mỗi sự cố; vét cạn thu từ hai đầu tốn O(n − k) mỗi sự cố.'],
  kn: ['binary search', 'search on window start'],
  tns: [tn('window start', 'điểm bắt đầu cửa sổ'), tn('tie-breaking', 'phá hoà'), tn('contiguous', 'liền nhau'), tn('search space', 'không gian tìm kiếm', 'tập giá trị mà phép tìm nhị phân chạy trên đó (ở đây là [0, n−k]).')],
  dau: `/**
 * times: number[] (sorted), k: number, incidents: number[]
 * returns for each incident the k closest timestamps, ascending (ties -> the smaller one)
 */
function nearestLogs(times, k, incidents) {
  // Write your solution here
  return incidents.map(function () { return times.slice(0, k); });
}
`,
  giai: '// Reference solution — binary search on the START of the k-window over [0, n - k].\n' + nguon(closestWindow, nearestLogs),
  cases: [
    { args: [[100, 140, 150, 152, 190, 300], 3, [151, 0, 1000]] },
    { args: [[1, 2, 3, 4, 5], 2, [3]], moTa: ['Tie: 2 and 4 are equally close ⇒ keep 2', 'Hoà: 2 và 4 gần như nhau ⇒ giữ 2'] },
    { args: [[10], 1, [5, 10, 15]], an: true },
    { args: [[1, 1, 2, 2, 2, 2, 2, 3, 3], 3, [3, 1, 2]], an: true, moTa: ['Duplicates', 'Giá trị trùng'] },
    { args: [[1, 3, 5, 7, 9], 5, [4]], an: true, moTa: ['k = n', 'k = n'] },
    { args: [[0, 10, 20, 30, 40], 2, [15, 25, 35, -5, 45]], an: true },
    { args: [[1, 2, 3, 4, 5], 4, [-1, 6]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 timestamps, k = 5, 100 000 incidents (shrinking from both ends is O(n) per incident)', 'Hiệu năng: 200 000 mốc, k = 5, 100 000 sự cố (thu từ hai đầu là O(n) mỗi sự cố)'],
    than: 'var n = 200000, a = new Array(n), x = 0; for (var i = 0; i < n; i++) { x += R(7); a[i] = x; } var q = new Array(100000); for (var j = 0; j < q.length; j++) q[j] = R(x + 50) - 25; var r = nearestLogs(a, 5, q), s = 0; for (var k = 0; k < r.length; k++) s = (s + r[k][0] * 7 + r[k][4]) % 1000000007; return { answers: r.length, checksum: s, first: r[0] };',
  }],
  saiMau: [
    { ten: ['O(n) per incident: shrink the window from both ends', 'O(n) mỗi sự cố: thu cửa sổ từ hai đầu'], chiHieuNang: true, ma: 'function nearestLogs(times, k, incidents) {\n  return incidents.map(function (t) { var lo = 0, hi = times.length - 1; while (hi - lo + 1 > k) { if (t - times[lo] > times[hi] - t) lo++; else hi--; } return times.slice(lo, hi + 1); });\n}\n' },
    { ten: ['Compares Math.abs distances (breaks on duplicates)', 'So khoảng cách bằng Math.abs (hỏng khi có giá trị trùng)'], ma: 'function nearestLogs(times, k, incidents) {\n  return incidents.map(function (t) { var lo = 0, hi = times.length - k; while (lo < hi) { var m = (lo + hi) >> 1; if (Math.abs(t - times[m]) > Math.abs(times[m + k] - t)) lo = m + 1; else hi = m; } return times.slice(lo, lo + k); });\n}\n' },
    { ten: ['Ties go to the later timestamp (>=)', 'Hoà thì chọn mốc muộn hơn (>=)'], ma: 'function nearestLogs(times, k, incidents) {\n  return incidents.map(function (t) { var lo = 0, hi = times.length - k; while (lo < hi) { var m = (lo + hi) >> 1; if (t - times[m] >= times[m + k] - t) lo = m + 1; else hi = m; } return times.slice(lo, lo + k); });\n}\n' },
  ],
});

export default mod('dsa-4-1-co-ban', '4.1 Binary search: one first-true template', [D1, D2, D3, D4]);
