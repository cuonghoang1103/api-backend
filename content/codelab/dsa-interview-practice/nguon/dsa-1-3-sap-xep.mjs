/** Coding Interview Prep · 1.3 — Sắp xếp làm công cụ: comparator nhiều khoá + ổn định, sắp rồi quét kề nhau, thứ tự tuỳ biến, top-k có phá hoà. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Comparator + ổn định: bảng xếp hạng không phá thứ tự nộp ── */
function rankSubmissions(subs) {
  // copy first: Array.prototype.sort sorts IN PLACE and the caller's array must not change
  return subs.slice()
    // number comparator: negative/zero/positive. b - a ⇒ higher score first.
    // Array.prototype.sort is STABLE (ES2019+), so equal scores keep their submission order.
    .sort(function (a, b) { return b.score - a.score; })
    .map(function (s) { return s.id; });
}
const S1 = bai({
  ten: 'Code Lab leaderboard: rank by score, keep submission order on ties', kho: 'EASY', phut: 10, ham: 'rankSubmissions',
  en: `<p>The PE practice server receives <code>subs</code> in the order students submitted: <code>{ id, score }</code> with scores like <code>9.5</code> or <code>10</code>. The leaderboard shows the ids from the highest score to the lowest; among equal scores, whoever <b>submitted first</b> stays above.</p>
<p>Write <code>rankSubmissions(subs)</code> returning the array of ids in leaderboard order. The input array must not be modified — the server keeps using it in submission order afterwards.</p>`,
  vi: `<p>Máy chủ luyện PE nhận <code>subs</code> theo đúng thứ tự sinh viên nộp: <code>{ id, score }</code> với điểm như <code>9.5</code> hay <code>10</code>. Bảng xếp hạng hiện các id từ điểm cao xuống thấp; cùng điểm thì ai <b>nộp trước</b> đứng trên.</p>
<p>Viết <code>rankSubmissions(subs)</code> trả về mảng id theo thứ tự bảng xếp hạng. KHÔNG được sửa mảng đầu vào — máy chủ còn dùng nó theo thứ tự nộp sau đó.</p>`,
  dauVao: ['subs — array of { id: string, score: number } in submission order.', 'subs — mảng { id: string, score: number } theo thứ tự nộp.'],
  dauRa: ['string[] — ids in leaderboard order.', 'string[] — id theo thứ tự bảng xếp hạng.'],
  rangBuoc: [['0 ≤ subs.length ≤ 200 000; 0 ≤ score ≤ 10 (one decimal).', '0 ≤ subs.length ≤ 200 000; 0 ≤ score ≤ 10 (một chữ số thập phân).'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['<code>sort()</code> with no comparator compares STRINGS: <code>"10" &lt; "9.5"</code>. Give it a number comparator that returns negative / 0 / positive — not a boolean.', '<code>sort()</code> không comparator so CHUỖI: <code>"10" &lt; "9.5"</code>. Đưa nó một comparator số trả âm / 0 / dương — không phải boolean.'],
    ['JavaScript\'s sort is stable since ES2019: elements that compare equal keep their order. So sorting by score alone already keeps "first submitted first". Sort a COPY (<code>slice()</code>).', 'Sort của JavaScript ổn định từ ES2019: phần tử so bằng nhau giữ nguyên thứ tự. Nên chỉ sắp theo điểm là đã giữ được "nộp trước đứng trước". Sắp trên BẢN SAO (<code>slice()</code>).'],
  ],
  loi: [
    ['Comparator <code>(a, b) =&gt; a.score &lt; b.score</code> returns true/false, i.e. 1/0, never negative — the engine gets an inconsistent comparator and the order is wrong.', 'Comparator <code>(a, b) =&gt; a.score &lt; b.score</code> trả true/false tức 1/0, không bao giờ âm — engine nhận một comparator mâu thuẫn và thứ tự sai.'],
    ['Calling <code>subs.sort(...)</code> directly: the caller\'s array is reordered (a hidden check looks at it after your call).', 'Gọi thẳng <code>subs.sort(...)</code>: mảng của bên gọi bị đảo thứ tự (một ca ẩn soát nó sau khi gọi hàm của bạn).'],
    ['Hand-written bubble/insertion sort: O(n²), the 200 000-submission check times out.', 'Tự viết bubble/insertion sort: O(n²), kiểm 200 000 lượt nộp hết giờ.'],
  ],
  gt: ['A comparator must return a negative number, zero or a positive number; <code>b.score − a.score</code> does exactly that for descending order. Because the built-in sort is stable, elements with equal scores stay in input (submission) order, so no second key is needed. Sorting a copy keeps the input untouched. O(n log n) time, O(n) memory for the copy.', 'Comparator phải trả số âm, 0 hoặc số dương; <code>b.score − a.score</code> làm đúng thế cho thứ tự giảm dần. Vì sort có sẵn là ổn định, các phần tử cùng điểm giữ thứ tự đầu vào (thứ tự nộp), nên không cần khoá thứ hai. Sắp trên bản sao giữ nguyên đầu vào. O(n log n) thời gian, O(n) bộ nhớ cho bản sao.'],
  kn: ['comparator', 'stable sort'],
  tns: [tn('comparator', 'hàm so sánh', 'trả âm / 0 / dương.'), tn('stable sort', 'sắp xếp ổn định', 'phần tử bằng nhau giữ thứ tự ban đầu.'), tn('in place', 'tại chỗ', 'sửa luôn mảng gốc.')],
  dau: `/**
 * subs: { id: string, score: number }[] in submission order (do NOT modify it)
 * returns ids sorted by score (high -> low), equal scores keep submission order
 */
function rankSubmissions(subs) {
  // Write your solution here
  return subs.map(function (s) { return s.id; });
}
`,
  giai: '// Reference solution — number comparator on a copy; stability keeps submission order on ties.\n' + nguon(rankSubmissions),
  cases: [
    { args: [[{ id: 'an', score: 9.5 }, { id: 'binh', score: 10 }, { id: 'chi', score: 7 }]], moTa: ['10 beats 9.5 (numbers, not strings)', '10 hơn 9.5 (so số, không so chuỗi)'] },
    { args: [[{ id: 'dung', score: 8 }, { id: 'em', score: 9 }, { id: 'giang', score: 8 }, { id: 'ha', score: 9 }]], moTa: ['Ties keep submission order', 'Cùng điểm giữ thứ tự nộp'] },
    { args: [[]] },
    { goi: '(function () { var s = [{ id: "x", score: 1 }, { id: "y", score: 5 }, { id: "z", score: 3 }]; var r = rankSubmissions(s); return { ranked: r, inputAfter: s.map(function (t) { return t.id; }) }; })()', an: true, moTa: ['The input array is unchanged after the call', 'Mảng đầu vào không đổi sau khi gọi'] },
    { args: [[{ id: 'k1', score: 0 }, { id: 'k2', score: 10 }, { id: 'k3', score: 0 }, { id: 'k4', score: 2.5 }, { id: 'k5', score: 10 }]], an: true },
    { args: [[{ id: 'solo', score: 6.5 }]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 submissions (an O(n²) hand-written sort times out)', 'Hiệu năng: 200 000 lượt nộp (tự viết sort O(n²) hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push({ id: "S" + i, score: R(101) / 10 }); var r = rankSubmissions(a); return { n: r.length, top: r.slice(0, 4), bottom: r.slice(-3) };',
  }],
  saiMau: [
    { ten: ['O(n²) insertion sort on a copy', 'Insertion sort O(n²) trên bản sao'], chiHieuNang: true, ma: 'function rankSubmissions(subs) {\n  var a = subs.slice();\n  for (var i = 1; i < a.length; i++) { var x = a[i], j = i - 1; while (j >= 0 && a[j].score < x.score) { a[j + 1] = a[j]; j--; } a[j + 1] = x; }\n  return a.map(function (s) { return s.id; });\n}\n' },
    { ten: ['Sorts the input in place', 'Sắp thẳng mảng đầu vào'], ma: 'function rankSubmissions(subs) {\n  return subs.sort(function (a, b) { return b.score - a.score; }).map(function (s) { return s.id; });\n}\n' },
  ],
});

/* ── 2. Sắp rồi quét cặp kề: khoảng hở nhỏ nhất giữa các job sao lưu hằng tuần ── */
function minGapSeconds(starts) {
  var WEEK = 604800;                                   // seconds in a week: the schedule repeats
  var t = starts.slice().sort(function (a, b) { return a - b; }); // numbers, ascending (copy!)
  // after sorting, the closest pair is always ADJACENT — no need to compare every pair
  var best = Infinity;
  for (var i = 1; i < t.length; i++) best = Math.min(best, t[i] - t[i - 1]);
  // the gap that crosses Sunday 23:59:59 → Monday 00:00:00: last job of the week to first job of the next
  best = Math.min(best, t[0] + WEEK - t[t.length - 1]);
  return best;
}
const S2 = bai({
  ten: 'Weekly backup jobs: the smallest gap, including over the weekend', kho: 'MEDIUM', phut: 15, ham: 'minGapSeconds',
  en: `<p>The university's backup jobs run every week at fixed moments, given as <b>seconds since Monday 00:00:00</b> (<code>0 ≤ t &lt; 604800</code>). Two jobs that start too close together overload the storage, so the ops team wants the smallest gap, in seconds, between the starts of two jobs. The schedule repeats every week, so the gap between the last job of the week and the first job of the following Monday counts too.</p>
<p>Write <code>minGapSeconds(starts)</code> (at least two jobs). Two jobs at the same second give a gap of 0.</p>`,
  vi: `<p>Các job sao lưu của trường chạy hằng tuần ở những thời điểm cố định, cho dưới dạng <b>số giây tính từ 00:00:00 thứ Hai</b> (<code>0 ≤ t &lt; 604800</code>). Hai job bắt đầu quá sát nhau làm quá tải ổ lưu trữ, nên đội vận hành cần khoảng hở nhỏ nhất (giây) giữa thời điểm bắt đầu của hai job. Lịch lặp lại mỗi tuần, nên khoảng giữa job cuối tuần và job đầu tiên của thứ Hai tuần sau cũng tính.</p>
<p>Viết <code>minGapSeconds(starts)</code> (ít nhất hai job). Hai job cùng một giây cho khoảng hở 0.</p>`,
  dauVao: ['starts — array of integers in [0, 604800), unsorted, length ≥ 2.', 'starts — mảng số nguyên trong [0, 604800), chưa sắp, độ dài ≥ 2.'],
  dauRa: ['number — the smallest gap in seconds.', 'number — khoảng hở nhỏ nhất (giây).'],
  rangBuoc: [['2 ≤ starts.length ≤ 200 000.', '2 ≤ starts.length ≤ 200 000.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['Comparing every pair is O(n²). After sorting, which pairs can possibly be the closest?', 'So mọi cặp là O(n²). Sau khi sắp xếp, những cặp nào mới có thể là gần nhau nhất?'],
    ['Only neighbours in sorted order — plus ONE extra pair for the wrap-around: <code>first + 604800 − last</code>.', 'Chỉ các cặp kề nhau theo thứ tự đã sắp — cộng thêm MỘT cặp cho vòng tuần: <code>first + 604800 − last</code>.'],
  ],
  loi: [
    ['<code>starts.sort()</code> without a comparator sorts as strings: <code>100000 &lt; 99</code>.', '<code>starts.sort()</code> không comparator sắp như chuỗi: <code>100000 &lt; 99</code>.'],
    ['Forgetting the wrap-around: jobs at Sunday 23:59:50 and Monday 00:00:05 are 15 seconds apart, not 604 785.', 'Quên vòng tuần: job lúc 23:59:50 Chủ nhật và 00:00:05 thứ Hai cách nhau 15 giây, không phải 604 785.'],
    ['Comparing all pairs: O(n²), the 200 000-job check times out.', 'So mọi cặp: O(n²), kiểm 200 000 job hết giờ.'],
  ],
  gt: ['In sorted order, for any i &lt; j &lt; k we have t[k] − t[i] ≥ t[j] − t[i], so the minimum difference is always between neighbours — n − 1 candidates instead of n²/2. On a circle (the weekly schedule) the only extra neighbour pair is last → first, whose gap is <code>t[0] + WEEK − t[n−1]</code>. Sorting dominates: O(n log n) time, O(n) for the sorted copy.', 'Theo thứ tự đã sắp, với mọi i &lt; j &lt; k ta có t[k] − t[i] ≥ t[j] − t[i], nên hiệu nhỏ nhất luôn nằm giữa hai phần tử kề nhau — n − 1 ứng viên thay vì n²/2. Trên vòng tròn (lịch hằng tuần) cặp kề duy nhất được thêm là cuối → đầu, khoảng hở <code>t[0] + WEEK − t[n−1]</code>. Phép sắp chiếm chủ đạo: O(n log n) thời gian, O(n) cho bản sao đã sắp.'],
  kn: ['sort then scan', 'circular schedule'],
  tns: [tn('adjacent pair', 'cặp kề nhau'), tn('wrap-around', 'vòng lại đầu', 'đi qua mốc cuối rồi quay về mốc đầu (như cuối tuần → thứ Hai).'), tn('lexicographic order', 'thứ tự từ điển')],
  dau: `/**
 * starts: number[] — seconds since Monday 00:00:00, 0 <= t < 604800, length >= 2
 * returns the smallest gap between two job starts, the week wraps around
 */
function minGapSeconds(starts) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — sort a copy numerically, check neighbours + the wrap-around pair.\n' + nguon(minGapSeconds),
  cases: [
    { args: [[3600, 90000, 7200]], moTa: ['01:00 and 02:00 Monday ⇒ 3600', '01:00 và 02:00 thứ Hai ⇒ 3600'] },
    { args: [[604790, 5, 300000]], moTa: ['Sunday 23:59:50 → Monday 00:00:05 ⇒ 15', '23:59:50 CN → 00:00:05 thứ Hai ⇒ 15'] },
    { args: [[100000, 99, 250000]], moTa: ['Numeric sort, not string sort', 'Sắp theo số, không theo chuỗi'] },
    { args: [[42, 42]], an: true, moTa: ['Same second ⇒ 0', 'Cùng một giây ⇒ 0'] },
    { args: [[0, 302400]], an: true, moTa: ['Two jobs half a week apart', 'Hai job cách nhau nửa tuần'] },
    { args: [[500000, 10, 499990, 200, 604799]], an: true },
    { args: [[1, 604799]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 jobs (comparing every pair times out)', 'Hiệu năng: 200 000 job (so mọi cặp hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(3 * i + 1 + R(2)); for (var t = a.length - 1; t > 0; t--) { var u = R(t + 1), x = a[t]; a[t] = a[u]; a[u] = x; } return minGapSeconds(a);',
  }],
  saiMau: [
    { ten: ['O(n²): every pair with circular distance', 'O(n²): mọi cặp với khoảng cách vòng'], chiHieuNang: true, ma: 'function minGapSeconds(starts) {\n  var best = Infinity;\n  for (var i = 0; i < starts.length; i++) for (var j = i + 1; j < starts.length; j++) { var d = Math.abs(starts[i] - starts[j]); best = Math.min(best, d, 604800 - d); }\n  return best;\n}\n' },
    { ten: ['No wrap-around pair', 'Thiếu cặp vòng tuần'], ma: 'function minGapSeconds(starts) {\n  var t = starts.slice().sort(function (a, b) { return a - b; }), best = Infinity;\n  for (var i = 1; i < t.length; i++) best = Math.min(best, t[i] - t[i - 1]);\n  return best;\n}\n' },
  ],
});

/* ── 3. Thứ tự tuỳ biến: nhặt hàng theo thứ tự lối đi kho ── */
function pickingOrder(items, aisleOrder) {
  var rank = new Map(); // aisle -> its position in the walking route, computed ONCE
  for (var i = 0; i < aisleOrder.length; i++) rank.set(aisleOrder[i], i);
  var UNKNOWN = aisleOrder.length; // aisles not on the route go after every known aisle
  // decorate: compute each item's key once (not inside the comparator, which runs ~n log n times)
  var keyed = items.map(function (code) {
    var aisle = code.slice(0, code.indexOf('-'));
    return { code: code, k: rank.has(aisle) ? rank.get(aisle) : UNKNOWN };
  });
  keyed.sort(function (a, b) { return a.k - b.k; }); // stable: same aisle keeps the order on the order slip
  return keyed.map(function (x) { return x.code; });
}
const S3 = bai({
  ten: 'Warehouse picking: sort items by the aisle walking route', kho: 'MEDIUM', phut: 20, ham: 'pickingOrder',
  en: `<p>The shop's warehouse is walked along a fixed route: <code>aisleOrder</code> lists aisle codes in walking order (e.g. <code>["C2", "A1", "B7"]</code>). Every item code on an order slip starts with its aisle, then a dash: <code>"A1-0042"</code> lives in aisle <code>A1</code>.</p>
<p>Write <code>pickingOrder(items, aisleOrder)</code> returning the item codes sorted by the position of their aisle on the route. Items in the same aisle keep their order from the slip. Items whose aisle is not on the route (a new shelf) go <b>after</b> all the others, also keeping their slip order. Do not modify the inputs.</p>`,
  vi: `<p>Kho của shop được đi theo một lộ trình cố định: <code>aisleOrder</code> liệt kê mã lối đi theo thứ tự đi (vd <code>["C2", "A1", "B7"]</code>). Mỗi mã hàng trên phiếu bắt đầu bằng mã lối đi rồi một dấu gạch: <code>"A1-0042"</code> nằm ở lối <code>A1</code>.</p>
<p>Viết <code>pickingOrder(items, aisleOrder)</code> trả về các mã hàng sắp theo vị trí lối đi của chúng trên lộ trình. Hàng cùng lối giữ thứ tự trên phiếu. Hàng có lối đi không nằm trên lộ trình (kệ mới) xếp <b>sau</b> tất cả hàng khác, cũng giữ thứ tự trên phiếu. Không sửa đầu vào.</p>`,
  dauVao: ['items — array of "AISLE-NUMBER" strings; aisleOrder — array of distinct aisle codes.', 'items — mảng chuỗi "LỐI-SỐ"; aisleOrder — mảng mã lối đi khác nhau.'],
  dauRa: ['string[] — item codes in picking order.', 'string[] — mã hàng theo thứ tự nhặt.'],
  rangBuoc: [['0 ≤ items.length ≤ 200 000; 0 ≤ aisleOrder.length ≤ 5 000.', '0 ≤ items.length ≤ 200 000; 0 ≤ aisleOrder.length ≤ 5 000.'], ['Target: O(m + n log n), m = number of aisles.', 'Mục tiêu: O(m + n log n), m = số lối đi.']],
  goiY: [
    ['Turn the route into a lookup: Map aisle → position. Then the problem is an ordinary sort by a number.', 'Biến lộ trình thành bảng tra: Map lối → vị trí. Khi đó bài toán chỉ là sắp theo một con số.'],
    ['Give unknown aisles the position <code>aisleOrder.length</code>. Compute every item\'s key once, before sorting; rely on the stable sort for "keep slip order".', 'Cho lối lạ vị trí <code>aisleOrder.length</code>. Tính khoá của mỗi món MỘT lần trước khi sắp; dựa vào sort ổn định để "giữ thứ tự trên phiếu".'],
  ],
  loi: [
    ['Calling <code>aisleOrder.indexOf(...)</code> inside the comparator: each comparison scans the route, O(n log n · m) — the 5 000-aisle check times out.', 'Gọi <code>aisleOrder.indexOf(...)</code> trong comparator: mỗi lần so lại quét cả lộ trình, O(n log n · m) — kiểm 5 000 lối hết giờ.'],
    ['Letting unknown aisles get <code>indexOf = −1</code>: they jump to the FRONT of the route instead of the end.', 'Để lối lạ nhận <code>indexOf = −1</code>: chúng nhảy lên ĐẦU lộ trình thay vì xuống cuối.'],
    ['Splitting on the wrong character: <code>"A1-0042".split("-")[1]</code> is the number, not the aisle.', 'Tách sai: <code>"A1-0042".split("-")[1]</code> là số thứ tự, không phải lối đi.'],
  ],
  gt: ['A custom order is just a number per element: building a Map from the route costs O(m), and each lookup is O(1). Computing the key of every item once (the "decorate–sort–undecorate" idiom) keeps the comparator to a subtraction, so the sort is O(n log n). Unknown aisles get position m, larger than every real position, so they land at the end; stability keeps slip order within each aisle and among unknowns.', 'Thứ tự tuỳ biến chỉ là một con số cho mỗi phần tử: dựng Map từ lộ trình tốn O(m), mỗi lần tra O(1). Tính khoá của mọi món một lần (kiểu "gắn khoá – sắp – bỏ khoá") giữ comparator chỉ còn một phép trừ, nên phép sắp là O(n log n). Lối lạ nhận vị trí m, lớn hơn mọi vị trí thật, nên rơi xuống cuối; tính ổn định giữ thứ tự trên phiếu trong mỗi lối và giữa các lối lạ.'],
  kn: ['custom sort order', 'decorate-sort-undecorate'],
  tns: [tn('custom order', 'thứ tự tuỳ biến'), tn('sort key', 'khoá sắp xếp'), tn('decorate–sort–undecorate', 'gắn khoá – sắp – bỏ khoá', 'tính khoá trước một lần thay vì trong comparator.')],
  dau: `/**
 * items: string[] like "A1-0042" (aisle before the dash), aisleOrder: string[] walking route
 * returns items sorted by route position; same aisle keeps slip order; unknown aisles last
 */
function pickingOrder(items, aisleOrder) {
  // Write your solution here
  return items.slice();
}
`,
  giai: '// Reference solution — Map aisle -> rank once, key every item once, stable sort by the key.\n' + nguon(pickingOrder),
  cases: [
    { args: [['A1-0042', 'C2-0007', 'B7-0100', 'A1-0003'], ['C2', 'A1', 'B7']], moTa: ['Route C2 → A1 → B7; A1 items keep slip order', 'Lộ trình C2 → A1 → B7; hàng lối A1 giữ thứ tự phiếu'] },
    { args: [['Z9-0001', 'A1-0002', 'Q0-0003'], ['A1']], moTa: ['Unknown aisles go last, in slip order', 'Lối lạ xuống cuối, theo thứ tự phiếu'] },
    { args: [[], ['A1']] },
    { args: [['B10-0001', 'B1-0002', 'B10-0003'], ['B1', 'B10']], an: true, moTa: ['B1 and B10 are different aisles', 'B1 và B10 là hai lối khác nhau'] },
    { args: [['A1-0001', 'A1-0002'], []], an: true, moTa: ['Empty route: everything unknown, slip order', 'Lộ trình rỗng: mọi lối đều lạ, giữ thứ tự phiếu'] },
    { args: [['D4-0001', 'C3-0002', 'D4-0003', 'X1-0004', 'C3-0005', 'A2-0006'], ['A2', 'C3', 'D4']], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 items, a 5 000-aisle route (indexOf inside the comparator times out)', 'Hiệu năng: 200 000 món, lộ trình 5 000 lối (indexOf trong comparator hết giờ)'],
    than: 'var route = []; for (var i = 0; i < 5000; i++) route.push("R" + ((i * 7919) % 5000)); var items = []; for (var j = 0; j < 200000; j++) items.push("R" + R(5100) + "-" + j); var r = pickingOrder(items, route); return { n: r.length, head: r.slice(0, 3), tail: r.slice(-2) };',
  }],
  saiMau: [
    { ten: ['indexOf inside the comparator', 'indexOf trong comparator'], chiHieuNang: true, ma: 'function pickingOrder(items, aisleOrder) {\n  function k(c) { var i = aisleOrder.indexOf(c.split("-")[0]); return i < 0 ? aisleOrder.length : i; }\n  return items.slice().sort(function (a, b) { return k(a) - k(b); });\n}\n' },
    { ten: ['Unknown aisle ⇒ −1 (goes first)', 'Lối lạ ⇒ −1 (lên đầu)'], ma: 'function pickingOrder(items, aisleOrder) {\n  var r = new Map(aisleOrder.map(function (a, i) { return [a, i]; }));\n  var k = items.map(function (c) { var a = c.split("-")[0]; return { c: c, k: r.has(a) ? r.get(a) : -1 }; });\n  return k.sort(function (a, b) { return a.k - b.k; }).map(function (x) { return x.c; });\n}\n' },
  ],
});

/* ── 4. Top-k có phá hoà: từ khoá tìm kiếm nhiều nhất ── */
function topKeywords(searches, k) {
  var count = new Map(); // normalised keyword -> frequency
  for (var i = 0; i < searches.length; i++) {
    var w = searches[i].trim().toLowerCase(); // "  SWP391 " and "swp391" are the same keyword
    if (w === '') continue;                    // blank searches are not keywords
    count.set(w, (count.get(w) || 0) + 1);
  }
  var words = Array.from(count.keys());
  words.sort(function (a, b) {
    var d = count.get(b) - count.get(a);        // 1st key: frequency, high first
    if (d !== 0) return d;
    return a < b ? -1 : a > b ? 1 : 0;          // 2nd key: plain code-unit order (deterministic everywhere)
  });
  return words.slice(0, k);
}
const S4 = bai({
  ten: 'Student portal: top k search keywords with a tie-break', kho: 'HARD', phut: 25, ham: 'topKeywords',
  en: `<p>The student portal logs every search box entry in <code>searches</code>. People type the same thing differently — <code>"SWP391"</code>, <code>" swp391 "</code> — so a keyword is the entry with surrounding spaces removed and converted to lower case; an entry that is empty after trimming is ignored.</p>
<p>Write <code>topKeywords(searches, k)</code> returning the <code>k</code> most frequent keywords, most frequent first. Equal frequencies are ordered by plain string comparison (<code>a &lt; b</code>, i.e. UTF-16 code units — <b>not</b> <code>localeCompare</code>). If there are fewer than k distinct keywords, return them all.</p>`,
  vi: `<p>Cổng thông tin sinh viên ghi mọi lần gõ ô tìm kiếm vào <code>searches</code>. Mỗi người gõ một kiểu — <code>"SWP391"</code>, <code>" swp391 "</code> — nên một từ khoá là chuỗi đã bỏ khoảng trắng hai đầu và đổi về chữ thường; chuỗi rỗng sau khi bỏ khoảng trắng thì bỏ qua.</p>
<p>Viết <code>topKeywords(searches, k)</code> trả về <code>k</code> từ khoá xuất hiện nhiều nhất, nhiều nhất đứng trước. Cùng tần suất thì xếp theo phép so chuỗi thường (<code>a &lt; b</code>, tức mã UTF-16 — <b>không</b> dùng <code>localeCompare</code>). Ít hơn k từ khoá khác nhau thì trả hết.</p>`,
  dauVao: ['searches — array of strings; k — integer ≥ 1.', 'searches — mảng chuỗi; k — số nguyên ≥ 1.'],
  dauRa: ['string[] — at most k keywords.', 'string[] — tối đa k từ khoá.'],
  rangBuoc: [['0 ≤ searches.length ≤ 200 000; up to 50 000 distinct keywords.', '0 ≤ searches.length ≤ 200 000; tối đa 50 000 từ khoá khác nhau.'], ['Target: O(n + m log m), m = distinct keywords.', 'Mục tiêu: O(n + m log m), m = số từ khoá khác nhau.']],
  goiY: [
    ['Two steps: count (normalise first!), then order the distinct keywords by (frequency desc, text asc).', 'Hai bước: đếm (chuẩn hoá trước!), rồi xếp các từ khoá khác nhau theo (tần suất giảm, chữ tăng).'],
    ['Count with a Map, not with an array of pairs searched by <code>find</code>. A comparator with two keys: return the frequency difference if non-zero, otherwise compare the strings with <code>&lt;</code>.', 'Đếm bằng Map, không bằng mảng cặp dò bằng <code>find</code>. Comparator hai khoá: trả hiệu tần suất nếu khác 0, ngược lại so hai chuỗi bằng <code>&lt;</code>.'],
  ],
  loi: [
    ['Counting before normalising: <code>"SWP391"</code> and <code>"swp391 "</code> are counted as two keywords.', 'Đếm trước khi chuẩn hoá: <code>"SWP391"</code> và <code>"swp391 "</code> bị đếm thành hai từ khoá.'],
    ['Sorting by frequency only: ties come out in whatever order the Map was filled — the expected order is alphabetical.', 'Chỉ sắp theo tần suất: các từ hoà ra theo thứ tự Map được nạp — thứ tự đúng là theo bảng chữ.'],
    ['Counting with an array and <code>find</code>/<code>indexOf</code>: O(n · m), the 200 000-search check times out.', 'Đếm bằng mảng và <code>find</code>/<code>indexOf</code>: O(n · m), kiểm 200 000 lượt tìm hết giờ.'],
  ],
  gt: ['Counting with a Map is O(n) on average. Sorting the m distinct keywords with a two-key comparator is O(m log m), and slicing the first k is O(k). A heap of size k would make the second step O(m log k) — worth mentioning in an interview, but for m ≤ 5·10⁴ sorting is simpler and fast. Plain <code>&lt;</code> comparison gives the same order on every machine; <code>localeCompare</code> depends on the locale.', 'Đếm bằng Map trung bình O(n). Sắp m từ khoá khác nhau bằng comparator hai khoá là O(m log m), cắt k từ đầu O(k). Heap kích thước k làm bước hai còn O(m log k) — đáng nhắc khi phỏng vấn, nhưng với m ≤ 5·10⁴ thì sắp đơn giản hơn và đủ nhanh. Phép so <code>&lt;</code> cho cùng thứ tự trên mọi máy; <code>localeCompare</code> phụ thuộc ngôn ngữ máy.'],
  kn: ['top-k', 'frequency count', 'multi-key comparator'],
  tns: [tn('top-k', 'k phần tử đứng đầu'), tn('tie-break', 'luật phá hoà', 'khoá phụ dùng khi khoá chính bằng nhau.'), tn('normalise', 'chuẩn hoá')],
  dau: `/**
 * searches: string[] — raw search box entries; k: number
 * returns the k most frequent normalised keywords (trim + lowercase), ties by a < b
 */
function topKeywords(searches, k) {
  // Write your solution here
  return searches.slice(0, k);
}
`,
  giai: '// Reference solution — normalise + count with a Map, sort distinct keywords by (count desc, text asc).\n' + nguon(topKeywords),
  cases: [
    { args: [['SWP391', 'fap', ' swp391 ', 'FAP', 'swp391', 'lms'], 2], moTa: ['Normalise before counting', 'Chuẩn hoá trước khi đếm'] },
    { args: [['prj301', 'dbi202', 'csd201', 'dbi202', 'prj301'], 3], moTa: ['Ties sorted alphabetically', 'Hoà thì xếp theo bảng chữ'] },
    { args: [['a', 'b'], 5], moTa: ['Fewer than k keywords ⇒ all of them', 'Ít hơn k từ khoá ⇒ trả hết'] },
    { args: [['   ', '', 'ojt', ' '], 2], an: true, moTa: ['Blank entries are ignored', 'Bỏ qua chuỗi trắng'] },
    { args: [[], 3], an: true },
    { args: [['Zalo', 'apple', 'zalo', 'Apple', 'banana'], 3], an: true },
    { args: [['c#', 'c++', 'c', 'c++', 'c#', 'c'], 2], an: true, moTa: ['Code-unit order: "c" < "c#" < "c++"', 'Thứ tự mã: "c" < "c#" < "c++"'] },
  ],
  perf: [{
    moTa: ['Performance: 200 000 searches over 50 000 keywords (counting with an array times out)', 'Hiệu năng: 200 000 lượt tìm trên 50 000 từ khoá (đếm bằng mảng hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) { var r = R(50000), w = "kw" + (R(3) === 0 ? r % 40 : r); a.push(R(2) ? " " + w.toUpperCase() : w); } return topKeywords(a, 5);',
  }],
  saiMau: [
    { ten: ['O(n·m): counts in an array searched with find', 'O(n·m): đếm trong mảng dò bằng find'], chiHieuNang: true, ma: 'function topKeywords(searches, k) {\n  var c = [];\n  for (var s of searches) { var w = s.trim().toLowerCase(); if (!w) continue; var e = c.find(function (x) { return x[0] === w; }); if (e) e[1]++; else c.push([w, 1]); }\n  c.sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0); });\n  return c.slice(0, k).map(function (x) { return x[0]; });\n}\n' },
    { ten: ['No tie-break (frequency only)', 'Không phá hoà (chỉ theo tần suất)'], ma: 'function topKeywords(searches, k) {\n  var c = new Map();\n  for (var s of searches) { var w = s.trim().toLowerCase(); if (w) c.set(w, (c.get(w) || 0) + 1); }\n  return [...c.keys()].sort(function (a, b) { return c.get(b) - c.get(a); }).slice(0, k);\n}\n' },
  ],
});

export default mod('dsa-1-3-sap-xep', '1.3 Sorting as a tool: comparators, stability, top-k', [S1, S2, S3, S4]);
