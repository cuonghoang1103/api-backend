/** Coding Interview Prep · 1.2 — Tổng tiền tố & mảng hiệu: đếm trong đoạn O(1), đỉnh tải bằng mảng hiệu, tiền tố + hash map, tiền tố chẵn lẻ bằng bitmask. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Tiền tố đếm: số buổi vắng trong một đoạn ── */
function absencesInRange(log, queries) {
  // pre[i] = number of 'A' in log[0 .. i-1]  (length n + 1, pre[0] = 0)
  var pre = new Array(log.length + 1);
  pre[0] = 0;
  for (var i = 0; i < log.length; i++) pre[i + 1] = pre[i] + (log[i] === 'A' ? 1 : 0);
  // a range [l, r] (inclusive) is pre[r + 1] - pre[l]: two lookups, no loop
  return queries.map(function (q) { return pre[q[1] + 1] - pre[q[0]]; });
}
const P1 = bai({
  ten: 'Attendance log: absences in any range of slots', kho: 'EASY', phut: 10, ham: 'absencesInRange',
  en: `<p>FPT's attendance system stores one character per class slot for a student across the whole semester: <code>'P'</code> present, <code>'A'</code> absent, <code>'L'</code> late. The academic office then fires many questions like "how many absences between slot 12 and slot 40?" (both ends included).</p>
<p>Write <code>absencesInRange(log, queries)</code> where <code>queries[i] = [l, r]</code>, returning an array with the number of <code>'A'</code> in <code>log[l..r]</code> for every query, in order.</p>`,
  vi: `<p>Hệ thống điểm danh của FPT lưu mỗi slot học một ký tự cho một sinh viên suốt học kỳ: <code>'P'</code> có mặt, <code>'A'</code> vắng, <code>'L'</code> đi muộn. Phòng đào tạo bắn rất nhiều câu hỏi kiểu "từ slot 12 tới slot 40 vắng bao nhiêu buổi?" (tính cả hai đầu).</p>
<p>Viết <code>absencesInRange(log, queries)</code> với <code>queries[i] = [l, r]</code>, trả về mảng số ký tự <code>'A'</code> trong <code>log[l..r]</code> cho từng truy vấn, đúng thứ tự.</p>`,
  dauVao: ['log — string of P/A/L; queries — array of [l, r] with 0 ≤ l ≤ r < log.length.', 'log — chuỗi P/A/L; queries — mảng [l, r] với 0 ≤ l ≤ r < log.length.'],
  dauRa: ['number[] — one count per query.', 'number[] — mỗi truy vấn một số đếm.'],
  rangBuoc: [['1 ≤ log.length ≤ 200 000; 0 ≤ queries.length ≤ 200 000.', '1 ≤ log.length ≤ 200 000; 0 ≤ queries.length ≤ 200 000.'], ['Target: O(n + q).', 'Mục tiêu: O(n + q).']],
  goiY: [
    ['Counting inside every query costs O(length of range) — with 2·10⁵ long queries that is 4·10¹⁰ steps. Precompute something once.', 'Đếm lại trong từng truy vấn tốn O(độ dài đoạn) — 2·10⁵ truy vấn dài là 4·10¹⁰ bước. Hãy tính trước một thứ, một lần.'],
    ['Let <code>pre[i]</code> = number of A in the first i characters (so <code>pre[0] = 0</code>). Then the answer for [l, r] is <code>pre[r + 1] − pre[l]</code>.', 'Đặt <code>pre[i]</code> = số chữ A trong i ký tự đầu (nên <code>pre[0] = 0</code>). Khi đó đáp án cho [l, r] là <code>pre[r + 1] − pre[l]</code>.'],
  ],
  loi: [
    ['Off-by-one: <code>pre[r] − pre[l]</code> drops slot r; <code>pre[r + 1] − pre[l − 1]</code> crashes or reads <code>undefined</code> at l = 0. The extra leading 0 exists exactly to avoid that special case.', 'Lệch một: <code>pre[r] − pre[l]</code> bỏ mất slot r; <code>pre[r + 1] − pre[l − 1]</code> đọc <code>undefined</code> khi l = 0. Số 0 thêm ở đầu tồn tại đúng để khỏi phải xử lý riêng trường hợp đó.'],
    ['Looping over <code>log.slice(l, r + 1)</code> per query: right answers, O(n·q) — the large check runs out of time.', 'Lặp qua <code>log.slice(l, r + 1)</code> trong mỗi truy vấn: đúng kết quả, O(n·q) — kiểm lớn hết giờ.'],
  ],
  gt: ['Prefix counts turn "how many in a range" into the difference of two running totals, exactly like reading an electricity meter at two dates. Building <code>pre</code> is one pass O(n); each query is O(1) ⇒ O(n + q) time, O(n) memory. Using length n + 1 with <code>pre[0] = 0</code> makes l = 0 need no special case.', 'Đếm tiền tố biến "trong đoạn có bao nhiêu" thành hiệu của hai tổng chạy, y như đọc công-tơ điện ở hai ngày. Dựng <code>pre</code> một lượt O(n); mỗi truy vấn O(1) ⇒ O(n + q) thời gian, O(n) bộ nhớ. Dùng độ dài n + 1 với <code>pre[0] = 0</code> nên l = 0 không phải xử lý riêng.'],
  kn: ['prefix sum', 'range query'],
  tns: [tn('prefix sum', 'tổng tiền tố', 'pre[i] = tổng i phần tử đầu.'), tn('range query', 'truy vấn đoạn'), tn('off-by-one', 'lệch một đơn vị')],
  dau: `/**
 * log: string of 'P' | 'A' | 'L', queries: [l, r][] (inclusive)
 * returns the number of 'A' in log[l..r] for every query
 */
function absencesInRange(log, queries) {
  // Write your solution here
  return queries.map(function () { return 0; });
}
`,
  giai: '// Reference solution — prefix counts with a leading 0, then O(1) per query.\n' + nguon(absencesInRange),
  cases: [
    { args: ['PPAPALAP', [[0, 7], [2, 4], [5, 5]]] },
    { args: ['AAAA', [[0, 0], [1, 3], [0, 3]]], moTa: ['Ranges starting at 0 and ending at the last slot', 'Đoạn bắt đầu ở 0 và kết thúc ở slot cuối'] },
    { args: ['PLPL', [[0, 3]]], an: true, moTa: ['Late is not absent', 'Đi muộn không phải vắng'] },
    { args: ['A', [[0, 0]]], an: true },
    { args: ['PAPAPAPAPA', []], an: true, moTa: ['No queries ⇒ []', 'Không có truy vấn ⇒ []'] },
    { args: ['LAPAALPPAA', [[9, 9], [0, 9], [3, 6], [1, 1], [6, 8]]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 slots × 200 000 wide queries (counting per query times out)', 'Hiệu năng: 200 000 slot × 200 000 truy vấn đoạn rộng (đếm lại từng truy vấn hết giờ)'],
    than: 'var n = 200000, s = ""; var ch = "PPPPALPA"; var parts = []; for (var i = 0; i < n; i++) parts.push(ch[R(8)]); s = parts.join(""); var qs = []; for (var j = 0; j < 200000; j++) { var l = R(1000), r = n - 1 - R(1000); qs.push([l, r]); } var out = absencesInRange(s, qs); var sum = 0; for (var t = 0; t < out.length; t++) sum += out[t]; return { count: out.length, sum: sum, first: out.slice(0, 3) };',
  }],
  saiMau: [
    { ten: ['O(n·q): count inside every query', 'O(n·q): đếm lại trong từng truy vấn'], chiHieuNang: true, ma: 'function absencesInRange(log, queries) {\n  return queries.map(function (q) { var c = 0; for (var i = q[0]; i <= q[1]; i++) if (log[i] === "A") c++; return c; });\n}\n' },
    { ten: ['pre[r] − pre[l] (drops the last slot)', 'pre[r] − pre[l] (bỏ mất slot cuối)'], ma: 'function absencesInRange(log, queries) {\n  var pre = [0];\n  for (var i = 0; i < log.length; i++) pre.push(pre[i] + (log[i] === "A" ? 1 : 0));\n  return queries.map(function (q) { return pre[q[1]] - pre[q[0]]; });\n}\n' },
  ],
});

/* ── 2. Mảng hiệu: giờ đông nhất của phòng lab ── */
function peakOccupancy(bookings, hours) {
  // diff[h] = change in seats used at the START of hour h; a booking [s, e) adds at s and removes at e
  var diff = new Array(hours + 1).fill(0);
  for (var i = 0; i < bookings.length; i++) {
    diff[bookings[i][0]] += bookings[i][2];
    diff[bookings[i][1]] -= bookings[i][2];
  }
  var cur = 0, best = 0, at = 0;
  for (var h = 0; h < hours; h++) {
    cur += diff[h];                           // running sum of the difference array = seats in use during hour h
    if (cur > best) { best = cur; at = h; }   // strict > keeps the EARLIEST hour among ties
  }
  return [best, at];
}
const P2 = bai({
  ten: 'Lab booking: the busiest hour of the week', kho: 'MEDIUM', phut: 15, ham: 'peakOccupancy',
  en: `<p>The lab booking system of building Alpha stores bookings as <code>[start, end, seats]</code>: the group uses <code>seats</code> seats during every hour <code>h</code> with <code>start ≤ h &lt; end</code> (hours are numbered from 0 at Monday 00:00; the end hour is free again). The facilities team wants the peak load to decide whether to open a second room.</p>
<p>Write <code>peakOccupancy(bookings, hours)</code> returning <code>[peak, hour]</code>: the maximum total seats in use during any hour <code>0 ≤ h &lt; hours</code>, and the <b>earliest</b> hour where that peak happens. If nothing is ever booked, return <code>[0, 0]</code>.</p>`,
  vi: `<p>Hệ thống đặt phòng lab toà Alpha lưu mỗi lượt đặt dạng <code>[start, end, seats]</code>: nhóm dùng <code>seats</code> chỗ trong mọi giờ <code>h</code> với <code>start ≤ h &lt; end</code> (giờ đánh số từ 0 lúc 00:00 thứ Hai; giờ end đã trống lại). Đội cơ sở vật chất cần biết tải đỉnh để quyết định có mở phòng thứ hai không.</p>
<p>Viết <code>peakOccupancy(bookings, hours)</code> trả về <code>[peak, hour]</code>: tổng số chỗ đang dùng lớn nhất trong một giờ bất kỳ <code>0 ≤ h &lt; hours</code>, và giờ <b>sớm nhất</b> đạt đỉnh đó. Không ai đặt gì thì trả <code>[0, 0]</code>.</p>`,
  dauVao: ['bookings — array of [start, end, seats] with 0 ≤ start &lt; end ≤ hours, seats ≥ 1; hours — number of hours in the timeline.', 'bookings — mảng [start, end, seats] với 0 ≤ start &lt; end ≤ hours, seats ≥ 1; hours — số giờ của trục thời gian.'],
  dauRa: ['[peak, hour]', '[peak, hour]'],
  rangBuoc: [['0 ≤ bookings.length ≤ 200 000; 1 ≤ hours ≤ 10⁶; seats ≤ 100.', '0 ≤ bookings.length ≤ 200 000; 1 ≤ hours ≤ 10⁶; seats ≤ 100.'], ['Target: O(n + hours).', 'Mục tiêu: O(n + hours).']],
  goiY: [
    ['Adding <code>seats</code> to every hour of every booking costs the total booked length — up to 2·10⁵ × 10⁵. You only need to record where the load <i>changes</i>.', 'Cộng <code>seats</code> vào từng giờ của từng lượt đặt tốn tổng độ dài đã đặt — tới 2·10⁵ × 10⁵. Bạn chỉ cần ghi lại chỗ tải <i>thay đổi</i>.'],
    ['Difference array: <code>diff[start] += seats</code>, <code>diff[end] −= seats</code>. A running sum over <code>diff</code> gives the load of each hour; track the maximum with a strict <code>&gt;</code>.', 'Mảng hiệu: <code>diff[start] += seats</code>, <code>diff[end] −= seats</code>. Tổng chạy trên <code>diff</code> cho tải của từng giờ; theo dõi cực đại bằng phép <code>&gt;</code> chặt.'],
  ],
  loi: [
    ['Subtracting at <code>end + 1</code> (treating end as included): a booking [8, 10) would still occupy hour 10, so back-to-back bookings look like a clash.', 'Trừ ở <code>end + 1</code> (coi end là thuộc lượt đặt): lượt [8, 10) vẫn chiếm giờ 10, nên hai lượt nối tiếp nhau trông như chồng.'],
    ['Using <code>&gt;=</code> when updating the peak returns the LAST hour with the peak, not the earliest.', 'Dùng <code>&gt;=</code> khi cập nhật đỉnh sẽ trả giờ CUỐI cùng đạt đỉnh, không phải giờ sớm nhất.'],
    ['Filling every hour of every booking: O(total length), the 10⁶-hour check times out.', 'Tô từng giờ của từng lượt đặt: O(tổng độ dài), kiểm 10⁶ giờ hết giờ.'],
  ],
  gt: ['The difference array is the inverse of a prefix sum: we store only the changes (+seats when a booking starts, −seats when it ends) and one running sum rebuilds the full load curve. Each booking costs O(1) no matter how long it is, then one pass over the timeline ⇒ O(n + hours) time, O(hours) memory. Half-open intervals make "ends at 10, starts at 10" share no hour, which is what a real booking system wants.', 'Mảng hiệu là phép ngược của tổng tiền tố: chỉ lưu chỗ thay đổi (+seats khi lượt đặt bắt đầu, −seats khi kết thúc) và một tổng chạy dựng lại toàn bộ đường tải. Mỗi lượt đặt tốn O(1) bất kể dài bao nhiêu, rồi một lượt qua trục thời gian ⇒ O(n + hours) thời gian, O(hours) bộ nhớ. Khoảng nửa mở làm "kết thúc lúc 10, bắt đầu lúc 10" không chung giờ nào — đúng điều hệ thống đặt phòng thật cần.'],
  kn: ['difference array', 'sweep'],
  tns: [tn('difference array', 'mảng hiệu', 'lưu mức thay đổi; tổng tiền tố của nó là giá trị thật.'), tn('half-open interval', 'khoảng nửa mở', '[start, end): gồm start, không gồm end.'), tn('peak load', 'tải đỉnh')],
  dau: `/**
 * bookings: [start, end, seats][] (half-open: start <= h < end), hours: number
 * returns [peak, earliestHourOfPeak]
 */
function peakOccupancy(bookings, hours) {
  // Write your solution here
  return [0, 0];
}
`,
  giai: '// Reference solution — difference array + one running sum.\n' + nguon(peakOccupancy),
  cases: [
    { args: [[[8, 10, 30], [9, 12, 20], [10, 11, 25]], 24], moTa: ['Peak 50 at hour 9', 'Đỉnh 50 lúc giờ 9'] },
    { args: [[[8, 10, 30], [10, 12, 30]], 24], moTa: ['Back-to-back bookings do not overlap', 'Hai lượt nối tiếp không chồng nhau'] },
    { args: [[], 168], moTa: ['Nothing booked ⇒ [0, 0]', 'Không ai đặt ⇒ [0, 0]'] },
    { args: [[[0, 1, 5], [167, 168, 5]], 168], an: true, moTa: ['Ties ⇒ earliest hour', 'Hoà ⇒ giờ sớm nhất'] },
    { args: [[[2, 6, 10], [3, 5, 10], [4, 8, 10], [5, 6, 1]], 10], an: true },
    { args: [[[0, 168, 40]], 168], an: true },
    { args: [[[5, 9, 3], [1, 4, 7], [3, 7, 2], [6, 8, 9]], 12], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 long bookings on a 10⁶-hour timeline (filling hour by hour times out)', 'Hiệu năng: 200 000 lượt đặt dài trên trục 10⁶ giờ (tô từng giờ hết giờ)'],
    than: 'var H = 1000000, b = []; for (var i = 0; i < 200000; i++) { var s = R(H - 100000), len = 50000 + R(50000); b.push([s, s + len, 1 + R(100)]); } return peakOccupancy(b, H);',
  }],
  saiMau: [
    { ten: ['O(total length): add seats hour by hour', 'O(tổng độ dài): cộng chỗ từng giờ'], chiHieuNang: true, ma: 'function peakOccupancy(bookings, hours) {\n  var load = new Array(hours).fill(0);\n  for (var b of bookings) for (var h = b[0]; h < b[1]; h++) load[h] += b[2];\n  var best = 0, at = 0;\n  for (var h2 = 0; h2 < hours; h2++) if (load[h2] > best) { best = load[h2]; at = h2; }\n  return [best, at];\n}\n' },
    { ten: ['Subtract at end + 1 (closed interval)', 'Trừ ở end + 1 (khoảng đóng)'], ma: 'function peakOccupancy(bookings, hours) {\n  var d = new Array(hours + 2).fill(0);\n  for (var b of bookings) { d[b[0]] += b[2]; d[b[1] + 1] -= b[2]; }\n  var cur = 0, best = 0, at = 0;\n  for (var h = 0; h < hours; h++) { cur += d[h]; if (cur > best) { best = cur; at = h; } }\n  return [best, at];\n}\n' },
  ],
});

/* ── 3. Tiền tố + hash map: chuỗi ngày hoà vốn dài nhất ── */
function longestBreakEven(net) {
  var firstAt = new Map(); // prefix total -> FIRST index where it appeared
  firstAt.set(0, -1);      // the empty prefix: total 0 "before day 0"
  var sum = 0, bestLen = 0, bestStart = -1;
  for (var j = 0; j < net.length; j++) {
    sum += net[j];
    if (firstAt.has(sum)) {
      // equal prefix totals at i and j ⇒ days i+1..j add up to exactly 0
      var len = j - firstAt.get(sum);
      if (len > bestLen) { bestLen = len; bestStart = firstAt.get(sum) + 1; }
    } else {
      firstAt.set(sum, j); // keep only the first index: it gives the longest window ending later
    }
  }
  return bestLen === 0 ? [] : [bestStart, bestStart + bestLen - 1];
}
const P3 = bai({
  ten: 'Shop ledger: the longest break-even period', kho: 'MEDIUM', phut: 20, ham: 'longestBreakEven',
  en: `<p>A small shop near campus logs its daily <b>net</b> result <code>net[i]</code> (profit positive, loss negative, in thousand VND). The owner asks: what is the longest run of consecutive days whose results add up to <b>exactly 0</b> — a period where the shop "only broke even"?</p>
<p>Write <code>longestBreakEven(net)</code> returning <code>[start, end]</code> (inclusive day indexes) of the longest such run. If several runs have the same maximum length, return the one that starts earliest. If no run sums to 0, return <code>[]</code>.</p>`,
  vi: `<p>Một quán nhỏ gần trường ghi kết quả <b>ròng</b> mỗi ngày <code>net[i]</code> (lãi dương, lỗ âm, nghìn đồng). Chủ quán hỏi: chuỗi ngày liên tiếp dài nhất có tổng kết quả <b>đúng bằng 0</b> — giai đoạn quán "chỉ hoà vốn" — là chuỗi nào?</p>
<p>Viết <code>longestBreakEven(net)</code> trả về <code>[start, end]</code> (chỉ số ngày, tính cả hai đầu) của chuỗi dài nhất như vậy. Nhiều chuỗi cùng dài nhất thì trả chuỗi bắt đầu sớm nhất. Không chuỗi nào có tổng 0 thì trả <code>[]</code>.</p>`,
  dauVao: ['net — array of integers (positive, negative or zero).', 'net — mảng số nguyên (dương, âm hoặc 0).'],
  dauRa: ['[start, end] or [].', '[start, end] hoặc [].'],
  rangBuoc: [['0 ≤ net.length ≤ 200 000; |net[i]| ≤ 10⁴.', '0 ≤ net.length ≤ 200 000; |net[i]| ≤ 10⁴.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Days i+1..j sum to 0 exactly when the running total after day i equals the running total after day j.', 'Các ngày i+1..j có tổng 0 đúng khi tổng chạy sau ngày i bằng tổng chạy sau ngày j.'],
    ['Map each running total to the FIRST index where it appeared; seed it with total 0 at index −1. At each j, the window from that first index + 1 to j is the longest zero-sum run ending at j.', 'Map mỗi tổng chạy tới chỉ số ĐẦU TIÊN nó xuất hiện; gieo sẵn tổng 0 ở chỉ số −1. Tại mỗi j, đoạn từ chỉ số đầu đó + 1 tới j là đoạn tổng 0 dài nhất kết thúc ở j.'],
  ],
  loi: [
    ['Forgetting the seed <code>0 → −1</code>: a run that starts on day 0 (e.g. <code>[3, −3]</code>) is never found.', 'Quên gieo <code>0 → −1</code>: chuỗi bắt đầu từ ngày 0 (vd <code>[3, −3]</code>) không bao giờ được tìm thấy.'],
    ['Overwriting the map with the latest index of each total: the windows become SHORTER, not longer.', 'Ghi đè map bằng chỉ số MỚI NHẤT của mỗi tổng: các đoạn tìm được NGẮN đi chứ không dài ra.'],
    ['Trying a sliding window: with negative numbers the window sum is not monotone, so shrinking from the left gives wrong answers.', 'Thử cửa sổ trượt: có số âm thì tổng cửa sổ không đơn điệu, co từ trái cho kết quả sai.'],
  ],
  gt: ['sum(i+1..j) = P(j) − P(i), so a zero-sum run is a pair of equal prefix totals. For a fixed right end j the longest run uses the earliest i with P(i) = P(j), which is why the map stores only first occurrences (and why the empty prefix P(−1) = 0 must be there). Scanning j left to right and updating only on a strictly longer run keeps the earliest start among ties. One pass, O(1) average per day ⇒ O(n) time and O(n) memory; the brute force over all (i, j) is O(n²).', 'sum(i+1..j) = P(j) − P(i), nên một đoạn tổng 0 là một cặp tổng tiền tố bằng nhau. Với đầu phải j cố định, đoạn dài nhất dùng i sớm nhất có P(i) = P(j) — vì vậy map chỉ lưu lần xuất hiện ĐẦU (và tiền tố rỗng P(−1) = 0 phải có sẵn). Quét j từ trái sang và chỉ cập nhật khi dài hơn HẲN thì giữ được chuỗi bắt đầu sớm nhất khi hoà. Một lượt, trung bình O(1) mỗi ngày ⇒ O(n) thời gian, O(n) bộ nhớ; vét cạn mọi (i, j) là O(n²).'],
  kn: ['prefix sum + hash map', 'zero-sum subarray'],
  tns: [tn('running total', 'tổng chạy', 'tổng cộng dồn tới vị trí hiện tại.'), tn('first occurrence', 'lần xuất hiện đầu'), tn('subarray', 'mảng con liên tiếp')],
  dau: `/**
 * net: number[] — daily profit (+) / loss (-)
 * returns [start, end] of the longest run summing to exactly 0 (earliest on ties), or []
 */
function longestBreakEven(net) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — prefix totals mapped to their FIRST index, seeded with 0 -> -1.\n' + nguon(longestBreakEven),
  cases: [
    { args: [[5, -2, -3, 4, 1, -5]], moTa: ['Days 0..2 and 1..5 — the second is longer', 'Ngày 0..2 và 1..5 — đoạn sau dài hơn'] },
    { args: [[3, -3]], moTa: ['The run starts on day 0', 'Chuỗi bắt đầu từ ngày 0'] },
    { args: [[2, 4, 1]], moTa: ['No break-even run ⇒ []', 'Không có chuỗi hoà vốn ⇒ []'] },
    { args: [[]], an: true },
    { args: [[0, 0, 0]], an: true, moTa: ['Days with result 0 count', 'Ngày kết quả 0 cũng tính'] },
    { args: [[1, -1, 2, -2]], an: true, moTa: ['Whole ledger sums to 0', 'Cả sổ có tổng 0'] },
    { args: [[4, -4, 7, 3, -3, 9]], an: true, moTa: ['Two runs of length 2 ⇒ earliest', 'Hai chuỗi dài 2 ⇒ chuỗi sớm nhất'] },
    { args: [[-1, 2, -1, 5, -3, -2, 1]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 days (checking every pair of days times out)', 'Hiệu năng: 200 000 ngày (thử mọi cặp ngày hết giờ)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = R(2001) - 1000 + (i % 3 === 0 ? 1 : 0); return longestBreakEven(a);',
  }],
  saiMau: [
    { ten: ['O(n²): try every start day', 'O(n²): thử mọi ngày bắt đầu'], chiHieuNang: true, ma: 'function longestBreakEven(net) {\n  var best = [], bl = 0;\n  for (var i = 0; i < net.length; i++) { var s = 0; for (var j = i; j < net.length; j++) { s += net[j]; if (s === 0 && j - i + 1 > bl) { bl = j - i + 1; best = [i, j]; } } }\n  return best;\n}\n' },
    { ten: ['No seed 0 → −1', 'Không gieo 0 → −1'], ma: 'function longestBreakEven(net) {\n  var m = new Map(), s = 0, bl = 0, st = -1;\n  for (var j = 0; j < net.length; j++) { s += net[j]; if (m.has(s)) { if (j - m.get(s) > bl) { bl = j - m.get(s); st = m.get(s) + 1; } } else m.set(s, j); }\n  return bl ? [st, st + bl - 1] : [];\n}\n' },
  ],
});

/* ── 4. Tiền tố chẵn lẻ bằng bitmask: mượn thiết bị chẵn lần ── */
function longestEvenWindow(log) {
  // bit t of the mask = parity (odd/even) of how many times item 'A'+t was borrowed so far
  var firstAt = new Array(32).fill(-2); // -2 = this mask has not appeared yet
  firstAt[0] = -1;                      // empty prefix: every count is 0 (even)
  var mask = 0, best = 0;
  for (var j = 0; j < log.length; j++) {
    var t = log.charCodeAt(j) - 65;     // 'A'..'E' -> 0..4, anything else does not change parity
    if (t >= 0 && t < 5) mask ^= 1 << t;
    // same mask at i and j ⇒ every item was borrowed an even number of times in (i, j]
    if (firstAt[mask] !== -2) { if (j - firstAt[mask] > best) best = j - firstAt[mask]; }
    else firstAt[mask] = j;
  }
  return best;
}
const P4 = bai({
  ten: 'Equipment desk: the longest window where every item was borrowed an even number of times', kho: 'HARD', phut: 25, ham: 'longestEvenWindow',
  en: `<p>The equipment desk of the IoT lab lends five kinds of items, logged by one letter each: <code>A</code> Arduino kit, <code>B</code> breadboard, <code>C</code> camera module, <code>D</code> DHT sensor, <code>E</code> ESP32. Other characters in the log (<code>x</code> for "desk closed", <code>-</code> for "returned") are noise and do not count. The auditor suspects items are being borrowed in pairs and wants the length of the longest contiguous part of the log in which <b>each of A, B, C, D, E appears an even number of times</b> (zero counts as even).</p>
<p>Write <code>longestEvenWindow(log)</code> returning that length (0 if no such non-empty window exists).</p>`,
  vi: `<p>Quầy thiết bị của phòng lab IoT cho mượn năm loại đồ, mỗi loại ghi bằng một chữ cái: <code>A</code> bộ Arduino, <code>B</code> breadboard, <code>C</code> module camera, <code>D</code> cảm biến DHT, <code>E</code> ESP32. Các ký tự khác trong log (<code>x</code> là "quầy đóng", <code>-</code> là "đã trả") là nhiễu, không tính. Người kiểm toán nghi đồ bị mượn theo cặp và muốn biết độ dài đoạn log liên tiếp dài nhất trong đó <b>mỗi chữ A, B, C, D, E xuất hiện một số CHẴN lần</b> (0 lần cũng là chẵn).</p>
<p>Viết <code>longestEvenWindow(log)</code> trả về độ dài đó (0 nếu không có đoạn khác rỗng nào như vậy).</p>`,
  dauVao: ['log — string of letters A–E plus noise characters.', 'log — chuỗi chữ A–E kèm ký tự nhiễu.'],
  dauRa: ['number — the length of the longest valid window.', 'number — độ dài đoạn hợp lệ dài nhất.'],
  rangBuoc: [['0 ≤ log.length ≤ 200 000.', '0 ≤ log.length ≤ 200 000.'], ['Target: O(n) time, O(1) extra memory (32 states).', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ phụ (32 trạng thái).']],
  goiY: [
    ['You do not need the counts, only whether each one is even or odd — 5 yes/no values. Pack them into a 5-bit number and flip a bit with XOR on every letter.', 'Không cần số đếm, chỉ cần mỗi số chẵn hay lẻ — 5 giá trị có/không. Gói chúng vào một số 5 bit và lật bit bằng XOR ở mỗi chữ cái.'],
    ['A window (i, j] is valid exactly when the mask after i equals the mask after j — the same trick as "equal prefix sums" in the previous task. Store the first index of each of the 32 masks (mask 0 at index −1).', 'Đoạn (i, j] hợp lệ đúng khi mask sau i bằng mask sau j — cùng mẹo "tổng tiền tố bằng nhau" của đề trước. Lưu chỉ số đầu tiên của mỗi mask trong 32 mask (mask 0 ở chỉ số −1).'],
  ],
  loi: [
    ['Counting the noise characters (or the position of every character) into the parity — <code>"xx"</code> is a valid window of length 2.', 'Tính cả ký tự nhiễu vào chẵn lẻ — <code>"xx"</code> là một đoạn hợp lệ dài 2.'],
    ['Initialising the "first seen" table with 0 or −1 for every mask instead of "not seen": every mask then looks like it appeared at the start.', 'Khởi tạo bảng "lần đầu gặp" bằng 0 hay −1 cho MỌI mask thay vì "chưa gặp": mask nào cũng trông như đã xuất hiện từ đầu.'],
    ['Recomputing counts for every pair (i, j): O(n²) — the 200 000-character check times out.', 'Đếm lại cho mọi cặp (i, j): O(n²) — kiểm 200 000 ký tự hết giờ.'],
  ],
  gt: ['Parity of a count is a prefix property: parity in (i, j] = parity after j XOR parity after i. With five items the whole state is a 5-bit mask, so "every item even in (i, j]" ⇔ mask(i) = mask(j). As with zero-sum runs we keep the first index of each mask (there are only 32, so a small array replaces the hash map) and seed mask 0 at −1. One pass ⇒ O(n) time, O(32) = O(1) memory, versus O(n²) for checking all windows.', 'Chẵn lẻ của số đếm là tính chất tiền tố: chẵn lẻ trong (i, j] = chẵn lẻ sau j XOR chẵn lẻ sau i. Năm loại đồ thì toàn bộ trạng thái là mask 5 bit, nên "mọi loại chẵn trong (i, j]" ⇔ mask(i) = mask(j). Như đề chuỗi tổng 0, ta giữ chỉ số đầu của mỗi mask (chỉ có 32 mask, nên một mảng nhỏ thay cho hash map) và gieo mask 0 ở −1. Một lượt ⇒ O(n) thời gian, O(32) = O(1) bộ nhớ, so với O(n²) khi soát mọi đoạn.'],
  kn: ['prefix parity', 'bitmask', 'XOR'],
  tns: [tn('parity', 'tính chẵn lẻ'), tn('bitmask', 'mặt nạ bit', 'một số nguyên mà mỗi bit là một cờ có/không.'), tn('XOR', 'phép XOR (hoặc loại trừ)', 'lật bit: 0 ⇄ 1.')],
  dau: `/**
 * log: string — letters A..E are borrowings, every other character is noise
 * returns the length of the longest window where each of A..E occurs an even number of times
 */
function longestEvenWindow(log) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — 5-bit parity mask as a prefix, first index of each of the 32 masks.\n' + nguon(longestEvenWindow),
  cases: [
    { args: ['ABBA'], moTa: ['A twice, B twice ⇒ whole log', 'A hai lần, B hai lần ⇒ cả log'] },
    { args: ['CxABAyB'], moTa: ['Noise inside the window is ignored ⇒ "xABAyB"', 'Nhiễu trong đoạn bị bỏ qua ⇒ "xABAyB"'] },
    { args: ['ABCDE'], moTa: ['Every letter once ⇒ 0', 'Mỗi chữ một lần ⇒ 0'] },
    { args: [''], an: true },
    { args: ['xx-x'], an: true, moTa: ['Only noise ⇒ the whole log is valid', 'Chỉ có nhiễu ⇒ cả log hợp lệ'] },
    { args: ['AxAyBzB'], an: true },
    { args: ['EAEBDDBCC'], an: true },
    { args: ['DABCDEEAC-B'], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 log characters (checking every window times out)', 'Hiệu năng: 200 000 ký tự log (soát mọi đoạn hết giờ)'],
    than: 'var ch = "ABCDEABCDEx-", p = []; for (var i = 0; i < 200000; i++) p.push(ch[R(12)]); return longestEvenWindow(p.join(""));',
  }],
  saiMau: [
    { ten: ['O(n²): parity mask restarted at every start', 'O(n²): dựng lại mask từ mỗi điểm bắt đầu'], chiHieuNang: true, ma: 'function longestEvenWindow(log) {\n  var best = 0;\n  for (var i = 0; i < log.length; i++) { var m = 0; for (var j = i; j < log.length; j++) { var t = log.charCodeAt(j) - 65; if (t >= 0 && t < 5) m ^= 1 << t; if (m === 0 && j - i + 1 > best) best = j - i + 1; } }\n  return best;\n}\n' },
    { ten: ['Table initialised to −1 for every mask', 'Bảng khởi tạo −1 cho mọi mask'], ma: 'function longestEvenWindow(log) {\n  var f = new Array(32).fill(-1), m = 0, best = 0;\n  for (var j = 0; j < log.length; j++) { var t = log.charCodeAt(j) - 65; if (t >= 0 && t < 5) m ^= 1 << t; if (j - f[m] > best) best = j - f[m]; }\n  return best;\n}\n' },
  ],
});

export default mod('dsa-1-2-prefix-sum', '1.2 Prefix sums & difference arrays', [P1, P2, P3, P4]);
