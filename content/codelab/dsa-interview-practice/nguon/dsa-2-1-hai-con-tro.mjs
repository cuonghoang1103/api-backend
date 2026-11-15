/** Coding Interview Prep · 2.1 — Hai con trỏ: cùng chiều trên hai mảng đã sắp, hai đầu tiến vào nhau (ghép cặp, cặp tốt nhất ≤ ngân sách, đếm cặp trong khoảng). Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Hai con trỏ cùng chiều trên hai mảng đã sắp: ai vắng mặt ── */
function missingStudents(roster, present) {
  var out = [];
  var j = 0; // pointer into `present`; both arrays are sorted ascending, so it only moves forward
  for (var i = 0; i < roster.length; i++) {
    while (j < present.length && present[j] < roster[i]) j++; // skip scans of IDs smaller than roster[i]
    if (j < present.length && present[j] === roster[i]) j++;  // found: this student was present
    else out.push(roster[i]);                                  // not in `present` ⇒ absent
  }
  return out;
}
const T1 = bai({
  ten: 'Roll call: who on the roster did not show up', kho: 'EASY', phut: 10, ham: 'missingStudents',
  en: `<p>For every slot, FAP exports two lists of student numbers, both <b>sorted ascending</b>: <code>roster</code> (everybody enrolled in the class, no duplicates) and <code>present</code> (the cards that were scanned — may contain IDs of students from other classes, but no duplicates).</p>
<p>Write <code>missingStudents(roster, present)</code> returning, in ascending order, the roster IDs that do not appear in <code>present</code>. Aim for one pass over both lists and O(1) extra memory besides the output.</p>`,
  vi: `<p>Mỗi slot, FAP xuất hai danh sách mã số sinh viên, cả hai <b>đã sắp tăng dần</b>: <code>roster</code> (mọi người đăng ký lớp, không trùng) và <code>present</code> (các thẻ đã quẹt — có thể có mã sinh viên lớp khác, không trùng).</p>
<p>Viết <code>missingStudents(roster, present)</code> trả về, theo thứ tự tăng dần, các mã trong roster không xuất hiện trong <code>present</code>. Cố gắng đi một lượt qua cả hai danh sách và O(1) bộ nhớ phụ ngoài kết quả.</p>`,
  dauVao: ['roster, present — sorted arrays of distinct positive integers.', 'roster, present — mảng số nguyên dương khác nhau, đã sắp tăng.'],
  dauRa: ['number[] — absent IDs, ascending.', 'number[] — mã vắng, tăng dần.'],
  rangBuoc: [['0 ≤ roster.length, present.length ≤ 200 000.', '0 ≤ roster.length, present.length ≤ 200 000.'], ['Target: O(n + m) time, O(1) extra memory.', 'Mục tiêu: O(n + m) thời gian, O(1) bộ nhớ phụ.']],
  goiY: [
    ['<code>present.includes(id)</code> for every roster ID re-scans the whole list each time. But both lists are sorted — what does that let you skip?', '<code>present.includes(id)</code> cho từng mã trong roster quét lại cả danh sách mỗi lần. Nhưng cả hai đã sắp — điều đó cho phép bỏ qua gì?'],
    ['Keep a pointer j in <code>present</code> that never moves back: advance it while <code>present[j] &lt; roster[i]</code>; then either it points at roster[i] (present) or past it (absent).', 'Giữ con trỏ j trong <code>present</code> không bao giờ lùi: tiến nó khi <code>present[j] &lt; roster[i]</code>; khi đó hoặc nó trỏ đúng roster[i] (có mặt) hoặc đã vượt qua (vắng).'],
  ],
  loi: [
    ['Using <code>includes</code>/<code>indexOf</code> inside the loop: O(n·m) — the 200 000-student check times out.', 'Dùng <code>includes</code>/<code>indexOf</code> trong vòng lặp: O(n·m) — kiểm 200 000 sinh viên hết giờ.'],
    ['Advancing both pointers on every step (like a zip): an ID of another class in <code>present</code> shifts everything by one.', 'Tiến cả hai con trỏ ở mỗi bước (như ghép khoá kéo): một mã của lớp khác trong <code>present</code> làm lệch mọi thứ một vị trí.'],
    ['Forgetting the roster IDs after <code>present</code> runs out — they are all absent.', 'Quên các mã roster còn lại khi <code>present</code> đã hết — tất cả đều vắng.'],
  ],
  gt: ['Because both lists are sorted, the pointer j into <code>present</code> only ever moves forward: every element of each list is passed once ⇒ O(n + m) time, and only two indexes ⇒ O(1) extra memory. A Set would also be O(n + m) time but O(m) memory; the nested <code>includes</code> is O(n·m).', 'Vì cả hai danh sách đã sắp, con trỏ j trong <code>present</code> chỉ tiến về trước: mỗi phần tử của mỗi danh sách được đi qua một lần ⇒ O(n + m) thời gian, và chỉ có hai chỉ số ⇒ O(1) bộ nhớ phụ. Dùng Set cũng O(n + m) thời gian nhưng O(m) bộ nhớ; <code>includes</code> lồng trong vòng lặp là O(n·m).'],
  kn: ['two pointers (same direction)', 'merge-like scan'],
  tns: [tn('two pointers', 'hai con trỏ'), tn('sorted', 'đã sắp xếp'), tn('set difference', 'hiệu hai tập', 'phần tử có ở A mà không có ở B.')],
  dau: `/**
 * roster, present: sorted ascending arrays of distinct numbers
 * returns roster IDs that are not in present, ascending
 */
function missingStudents(roster, present) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — one forward-only pointer into `present`.\n' + nguon(missingStudents),
  cases: [
    { args: [[101, 102, 105, 109], [102, 109]] },
    { args: [[101, 102, 105], [100, 101, 103, 105, 200]], moTa: ['present contains IDs from other classes', 'present có mã của lớp khác'] },
    { args: [[1, 2, 3], []], moTa: ['Nobody scanned ⇒ everyone absent', 'Không ai quẹt ⇒ vắng hết'] },
    { args: [[], [5, 6]], an: true },
    { args: [[4, 8, 15, 16, 23, 42], [1, 2, 3, 4, 8, 15]], an: true, moTa: ['IDs after present runs out', 'Các mã sau khi present đã hết'] },
    { args: [[10, 20, 30], [10, 20, 30]], an: true },
    { args: [[7, 70, 700], [8, 80, 800]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 enrolled, 200 000 scans (includes() per student times out)', 'Hiệu năng: 200 000 đăng ký, 200 000 lượt quẹt (includes() cho từng người hết giờ)'],
    than: 'var a = [], b = [], x = 1000, y = 1000; for (var i = 0; i < 200000; i++) { x += 1 + R(3); a.push(x); y += 1 + R(3); b.push(y); } var r = missingStudents(a, b); var s = 0; for (var t = 0; t < r.length; t++) s = (s + r[t]) % 1000000007; return { count: r.length, checksum: s, first: r.slice(0, 3) };',
  }],
  saiMau: [
    { ten: ['O(n·m): filter + includes', 'O(n·m): filter + includes'], chiHieuNang: true, ma: 'function missingStudents(roster, present) {\n  return roster.filter(function (id) { return !present.includes(id); });\n}\n' },
    { ten: ['Zip: advance both pointers every step', 'Kiểu khoá kéo: tiến cả hai con trỏ mỗi bước'], ma: 'function missingStudents(roster, present) {\n  var out = [];\n  for (var i = 0; i < roster.length; i++) if (roster[i] !== present[i]) out.push(roster[i]);\n  return out;\n}\n' },
  ],
});

/* ── 2. Hai đầu tiến vào nhau: số chuyến thang máy ít nhất ── */
function minTrips(weights, limit) {
  var w = weights.slice().sort(function (a, b) { return a - b; });
  var lo = 0, hi = w.length - 1, trips = 0;
  while (lo <= hi) {
    // the heaviest box always goes now; it takes the lightest box along if both fit
    if (lo < hi && w[lo] + w[hi] <= limit) lo++;
    hi--;
    trips++;
  }
  return trips;
}
const T2 = bai({
  ten: 'Moving day: the fewest elevator trips, two boxes at a time', kho: 'MEDIUM', phut: 15, ham: 'minTrips',
  en: `<p>The lab is moving from building Alpha to Beta. The service elevator carries <b>at most two boxes</b> per trip and their total weight must not exceed <code>limit</code> kg. Every single box weighs at most <code>limit</code>.</p>
<p>Write <code>minTrips(weights, limit)</code> returning the minimum number of trips needed to move every box. Do not modify <code>weights</code>.</p>`,
  vi: `<p>Phòng lab chuyển từ toà Alpha sang toà Beta. Thang máy chở hàng mang <b>tối đa hai thùng</b> mỗi chuyến và tổng khối lượng không vượt quá <code>limit</code> kg. Mỗi thùng riêng lẻ nặng không quá <code>limit</code>.</p>
<p>Viết <code>minTrips(weights, limit)</code> trả về số chuyến ít nhất để chở hết các thùng. Không sửa <code>weights</code>.</p>`,
  dauVao: ['weights — array of positive integers ≤ limit; limit — positive integer.', 'weights — mảng số nguyên dương ≤ limit; limit — số nguyên dương.'],
  dauRa: ['number — minimum trips.', 'number — số chuyến ít nhất.'],
  rangBuoc: [['0 ≤ weights.length ≤ 200 000; 1 ≤ limit ≤ 10⁵.', '0 ≤ weights.length ≤ 200 000; 1 ≤ limit ≤ 10⁵.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['The heaviest box must go on some trip. Who is the best partner for it? The lightest box — if even the lightest does not fit, nothing does.', 'Thùng nặng nhất kiểu gì cũng phải đi một chuyến. Bạn đồng hành tốt nhất của nó là ai? Thùng nhẹ nhất — nếu thùng nhẹ nhất cũng không vừa thì không thùng nào vừa.'],
    ['Sort, put <code>lo</code> at the lightest and <code>hi</code> at the heaviest. Each trip takes <code>hi</code>; it also takes <code>lo</code> when <code>w[lo] + w[hi] ≤ limit</code>. Stop when the pointers cross.', 'Sắp xếp, đặt <code>lo</code> ở thùng nhẹ nhất và <code>hi</code> ở thùng nặng nhất. Mỗi chuyến mang <code>hi</code>; mang thêm <code>lo</code> khi <code>w[lo] + w[hi] ≤ limit</code>. Dừng khi hai con trỏ vượt nhau.'],
  ],
  loi: [
    ['<code>while (lo &lt; hi)</code>: the last single box in the middle is never counted.', '<code>while (lo &lt; hi)</code>: thùng lẻ cuối cùng ở giữa không bao giờ được đếm.'],
    ['Pairing the two lightest boxes first ("fill trips with small ones"): <code>[1, 2, 3, 4]</code>, limit 5 ⇒ 1+2, 3, 4 = 3 trips, but 1+4, 2+3 = 2.', 'Ghép hai thùng nhẹ nhất trước ("lấp chuyến bằng thùng nhỏ"): <code>[1, 2, 3, 4]</code>, limit 5 ⇒ 1+2, 3, 4 = 3 chuyến, trong khi 1+4, 2+3 = 2.'],
    ['Searching a partner with a nested loop and a "used" flag array: correct, O(n²) — the 200 000-box check times out.', 'Tìm bạn ghép bằng vòng lồng và mảng cờ "đã dùng": đúng, O(n²) — kiểm 200 000 thùng hết giờ.'],
  ],
  gt: ['Exchange argument: in an optimal plan the heaviest box H rides with someone or alone. If the lightest box L fits with H, swapping L into H\'s trip never makes the plan worse; if L does not fit, H must ride alone. So "heaviest with lightest-if-it-fits" is safe at every step, and each step removes one or two boxes. Sorting is O(n log n), the two-pointer walk O(n).', 'Lập luận hoán đổi: trong một phương án tối ưu, thùng nặng nhất H đi cùng ai đó hoặc đi một mình. Nếu thùng nhẹ nhất L vừa với H, đổi L vào chuyến của H không bao giờ làm phương án tệ đi; nếu L không vừa, H buộc phải đi một mình. Vậy "nặng nhất đi với nhẹ nhất nếu vừa" an toàn ở mọi bước, và mỗi bước bớt một hoặc hai thùng. Sắp xếp O(n log n), đi hai con trỏ O(n).'],
  kn: ['two pointers (opposite ends)', 'greedy pairing'],
  tns: [tn('opposite-end pointers', 'hai con trỏ ở hai đầu'), tn('exchange argument', 'lập luận hoán đổi', 'chứng minh một lựa chọn tham lam không làm hỏng phương án tối ưu.'), tn('greedy', 'tham lam')],
  dau: `/**
 * weights: number[] (each <= limit), limit: number — at most two boxes per trip
 * returns the minimum number of trips
 */
function minTrips(weights, limit) {
  // Write your solution here
  return weights.length;
}
`,
  giai: '// Reference solution — sort, heaviest goes every trip, takes the lightest if it fits.\n' + nguon(minTrips),
  cases: [
    { args: [[1, 2, 3, 4], 5], moTa: ['1+4 and 2+3 ⇒ 2 trips', '1+4 và 2+3 ⇒ 2 chuyến'] },
    { args: [[50, 60, 70], 100], moTa: ['Nothing pairs ⇒ 3', 'Không ghép được ⇒ 3'] },
    { args: [[30], 100], moTa: ['A single box', 'Một thùng duy nhất'] },
    { args: [[], 100], an: true },
    { args: [[40, 60, 40, 60, 50], 100], an: true, moTa: ['Odd count: the middle box rides alone', 'Số lẻ: thùng giữa đi một mình'] },
    { args: [[3, 5, 3, 4], 5], an: true },
    { args: [[10, 10, 10, 10], 20], an: true },
    { args: [[90, 15, 80, 20, 5, 85], 100], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 boxes (nested-loop partner search times out)', 'Hiệu năng: 200 000 thùng (tìm bạn ghép bằng vòng lồng hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(1 + R(100000)); return minTrips(a, 100000);',
  }],
  saiMau: [
    { ten: ['O(n²): partner search with a used[] array', 'O(n²): tìm bạn ghép với mảng used[]'], chiHieuNang: true, ma: 'function minTrips(weights, limit) {\n  var w = weights.slice().sort(function (a, b) { return a - b; }), used = new Array(w.length).fill(false), t = 0;\n  for (var h = w.length - 1; h >= 0; h--) {\n    if (used[h]) continue; used[h] = true; t++;\n    for (var l = 0; l < h; l++) if (!used[l]) { if (w[l] + w[h] <= limit) used[l] = true; break; }\n  }\n  return t;\n}\n' },
    { ten: ['while (lo < hi) — loses the middle box', 'while (lo < hi) — mất thùng ở giữa'], ma: 'function minTrips(weights, limit) {\n  var w = weights.slice().sort(function (a, b) { return a - b; }), lo = 0, hi = w.length - 1, t = 0;\n  while (lo < hi) { if (w[lo] + w[hi] <= limit) lo++; hi--; t++; }\n  return t;\n}\n' },
  ],
});

/* ── 3. Hai đầu tiến vào nhau: cặp quà tốt nhất không vượt ngân sách ── */
function bestGiftPair(prices, budget) {
  var p = prices.slice().sort(function (a, b) { return a - b; });
  var lo = 0, hi = p.length - 1, best = -1;
  while (lo < hi) {             // lo < hi: two DIFFERENT items
    var s = p[lo] + p[hi];
    if (s <= budget) {
      if (s > best) best = s;   // feasible: remember it, then try a more expensive cheap item
      lo++;
    } else {
      hi--;                     // too expensive: the priciest item cannot pair with anything left
    }
  }
  return best;
}
const T3 = bai({
  ten: 'Teachers\' Day gift: two items, as close to the budget as possible', kho: 'MEDIUM', phut: 15, ham: 'bestGiftPair',
  en: `<p>For Vietnamese Teachers' Day (20/11) the class fund buys <b>two different items</b> from the campus shop for their lecturer. They want to spend as much of the fund as possible without going over: the largest total <code>prices[i] + prices[j]</code> (<code>i ≠ j</code>) that is <code>≤ budget</code>.</p>
<p>Write <code>bestGiftPair(prices, budget)</code> returning that total, or <code>-1</code> if no two items fit. Do not modify <code>prices</code>.</p>`,
  vi: `<p>Ngày Nhà giáo Việt Nam (20/11), quỹ lớp mua <b>hai món khác nhau</b> ở cửa hàng trong trường tặng giảng viên. Lớp muốn tiêu càng nhiều tiền quỹ càng tốt mà không vượt: tổng lớn nhất <code>prices[i] + prices[j]</code> (<code>i ≠ j</code>) mà <code>≤ budget</code>.</p>
<p>Viết <code>bestGiftPair(prices, budget)</code> trả về tổng đó, hoặc <code>-1</code> nếu không có hai món nào vừa. Không sửa <code>prices</code>.</p>`,
  dauVao: ['prices — array of positive integers (thousand VND); budget — positive integer.', 'prices — mảng số nguyên dương (nghìn đồng); budget — số nguyên dương.'],
  dauRa: ['number — the best total, or -1.', 'number — tổng tốt nhất, hoặc -1.'],
  rangBuoc: [['0 ≤ prices.length ≤ 200 000; 1 ≤ prices[i], budget ≤ 10⁹.', '0 ≤ prices.length ≤ 200 000; 1 ≤ prices[i], budget ≤ 10⁹.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['After sorting, look at the cheapest and the priciest item. If their sum is over budget, can the priciest item be part of ANY valid pair?', 'Sau khi sắp, nhìn món rẻ nhất và món đắt nhất. Nếu tổng của chúng vượt ngân sách, món đắt nhất còn nằm trong cặp hợp lệ NÀO được không?'],
    ['Over budget ⇒ <code>hi−−</code>. Within budget ⇒ record it and <code>lo++</code> (a pricier partner for hi might still fit). Loop while <code>lo &lt; hi</code>.', 'Vượt ngân sách ⇒ <code>hi−−</code>. Trong ngân sách ⇒ ghi nhận rồi <code>lo++</code> (một bạn đắt hơn cho hi có thể vẫn vừa). Lặp khi <code>lo &lt; hi</code>.'],
  ],
  loi: [
    ['<code>while (lo &lt;= hi)</code> buys the same item twice: <code>[40]</code>, budget 100 would give 80.', '<code>while (lo &lt;= hi)</code> mua cùng một món hai lần: <code>[40]</code>, budget 100 sẽ ra 80.'],
    ['Stopping at the first pair that fits — the first feasible sum is not necessarily the largest.', 'Dừng ở cặp vừa đầu tiên — tổng vừa đầu tiên chưa chắc lớn nhất.'],
    ['Trying all pairs: O(n²), times out on 200 000 items.', 'Thử mọi cặp: O(n²), hết giờ với 200 000 món.'],
  ],
  gt: ['In sorted order, if p[lo] + p[hi] &gt; budget then p[hi] plus any remaining item is even larger, so hi can be discarded; if it fits, p[lo] paired with anything smaller than p[hi] is worse, so lo is done after we record the sum. Every step discards one item and never discards the optimum ⇒ O(n) after an O(n log n) sort.', 'Theo thứ tự đã sắp, nếu p[lo] + p[hi] &gt; budget thì p[hi] cộng với món nào còn lại cũng lớn hơn nữa, nên bỏ được hi; nếu vừa, p[lo] ghép với món nào rẻ hơn p[hi] đều tệ hơn, nên ghi tổng rồi xong với lo. Mỗi bước loại một món và không bao giờ loại mất đáp án ⇒ O(n) sau phép sắp O(n log n).'],
  kn: ['two pointers (opposite ends)', 'pair sum ≤ budget'],
  tns: [tn('budget', 'ngân sách'), tn('feasible', 'khả thi', 'thoả ràng buộc (ở đây: ≤ budget).'), tn('discard', 'loại bỏ')],
  dau: `/**
 * prices: number[], budget: number
 * returns the largest prices[i] + prices[j] (i != j) that is <= budget, or -1
 */
function bestGiftPair(prices, budget) {
  // Write your solution here
  return -1;
}
`,
  giai: '// Reference solution — sort a copy, shrink from both ends.\n' + nguon(bestGiftPair),
  cases: [
    { args: [[120, 350, 80, 260, 410], 500], moTa: ['80 + 410 = 490', '80 + 410 = 490'] },
    { args: [[300, 400], 500], moTa: ['Nothing fits ⇒ −1', 'Không cặp nào vừa ⇒ −1'] },
    { args: [[250, 250, 100], 500], moTa: ['Two items with the same price are still two items', 'Hai món cùng giá vẫn là hai món'] },
    { args: [[40], 100], an: true, moTa: ['One item cannot be bought twice', 'Không mua một món hai lần'] },
    { args: [[], 100], an: true },
    { args: [[5, 15, 25, 35, 45], 59], an: true },
    { args: [[100, 1, 99, 2, 98], 100], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 items (trying every pair times out)', 'Hiệu năng: 200 000 món (thử mọi cặp hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(2 * (1 + R(400000000))); return bestGiftPair(a, 800000001);',
  }],
  saiMau: [
    { ten: ['O(n²): all pairs', 'O(n²): mọi cặp'], chiHieuNang: true, ma: 'function bestGiftPair(prices, budget) {\n  var best = -1;\n  for (var i = 0; i < prices.length; i++) for (var j = i + 1; j < prices.length; j++) { var s = prices[i] + prices[j]; if (s <= budget && s > best) best = s; }\n  return best;\n}\n' },
    { ten: ['lo <= hi (same item twice)', 'lo <= hi (một món mua hai lần)'], ma: 'function bestGiftPair(prices, budget) {\n  var p = prices.slice().sort(function (a, b) { return a - b; }), lo = 0, hi = p.length - 1, best = -1;\n  while (lo <= hi) { var s = p[lo] + p[hi]; if (s <= budget) { best = Math.max(best, s); lo++; } else hi--; }\n  return best;\n}\n' },
  ],
});

/* ── 4. Đếm cặp có tổng trong [lo, hi] = đếm(≤ hi) − đếm(≤ lo − 1) ── */
function countAtMost(sorted, cap) {
  // number of pairs i < j with sorted[i] + sorted[j] <= cap, in O(n)
  var l = 0, r = sorted.length - 1, c = 0;
  while (l < r) {
    if (sorted[l] + sorted[r] <= cap) { c += r - l; l++; } // sorted[l] fits with EVERY index l+1..r
    else r--;
  }
  return c;
}
function countFittingPairs(sizes, lo, hi) {
  var s = sizes.slice().sort(function (a, b) { return a - b; });
  return countAtMost(s, hi) - countAtMost(s, lo - 1); // "between" = "at most hi" minus "at most lo-1"
}
const T4 = bai({
  ten: 'Merged lab groups: count pairs whose size fits the room', kho: 'HARD', phut: 25, ham: 'countFittingPairs',
  en: `<p>For the hackathon the organisers merge study groups two by two. A merged pair is usable only if its total size fits a hackathon room: at least <code>lo</code> people (otherwise the room is wasted) and at most <code>hi</code> (fire safety). Given the group sizes, how many different pairs of groups are usable?</p>
<p>Write <code>countFittingPairs(sizes, lo, hi)</code>: the number of index pairs <code>i &lt; j</code> with <code>lo ≤ sizes[i] + sizes[j] ≤ hi</code>. Do not modify <code>sizes</code>.</p>`,
  vi: `<p>Cho hackathon, ban tổ chức gộp các nhóm học hai nhóm một. Một cặp gộp chỉ dùng được nếu tổng số người vừa một phòng thi: ít nhất <code>lo</code> người (không thì phí phòng) và nhiều nhất <code>hi</code> (an toàn cháy nổ). Cho kích thước các nhóm, có bao nhiêu cặp nhóm khác nhau dùng được?</p>
<p>Viết <code>countFittingPairs(sizes, lo, hi)</code>: số cặp chỉ số <code>i &lt; j</code> với <code>lo ≤ sizes[i] + sizes[j] ≤ hi</code>. Không sửa <code>sizes</code>.</p>`,
  dauVao: ['sizes — array of positive integers; lo ≤ hi — integers.', 'sizes — mảng số nguyên dương; lo ≤ hi — số nguyên.'],
  dauRa: ['number — count of pairs (may exceed 2³¹).', 'number — số cặp (có thể vượt 2³¹).'],
  rangBuoc: [['0 ≤ sizes.length ≤ 200 000; 1 ≤ sizes[i] ≤ 10⁶; 0 ≤ lo ≤ hi ≤ 2·10⁶.', '0 ≤ sizes.length ≤ 200 000; 1 ≤ sizes[i] ≤ 10⁶; 0 ≤ lo ≤ hi ≤ 2·10⁶.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['Counting pairs "between lo and hi" directly is awkward. Counting pairs with sum "at most X" is easy with two pointers — and between = atMost(hi) − atMost(lo − 1).', 'Đếm thẳng cặp "trong khoảng lo..hi" thì khó. Đếm cặp có tổng "không quá X" thì dễ với hai con trỏ — và trong khoảng = atMost(hi) − atMost(lo − 1).'],
    ['atMost(X) on a sorted array: with l at the left and r at the right, if <code>s[l] + s[r] ≤ X</code> then s[l] pairs with every index l+1..r — add <code>r − l</code> at once and move l; otherwise move r.', 'atMost(X) trên mảng đã sắp: l ở trái, r ở phải, nếu <code>s[l] + s[r] ≤ X</code> thì s[l] ghép được với MỌI chỉ số l+1..r — cộng ngay <code>r − l</code> rồi tiến l; ngược lại lùi r.'],
  ],
  loi: [
    ['Adding 1 instead of <code>r − l</code> when the pair fits: you count one pair where there are many.', 'Cộng 1 thay vì <code>r − l</code> khi cặp vừa: đếm một cặp trong khi có rất nhiều.'],
    ['Subtracting <code>atMost(lo)</code> instead of <code>atMost(lo − 1)</code>: pairs whose sum is exactly lo disappear.', 'Trừ <code>atMost(lo)</code> thay vì <code>atMost(lo − 1)</code>: các cặp có tổng đúng bằng lo biến mất.'],
    ['Checking every pair: O(n²), times out on 200 000 groups.', 'Soát mọi cặp: O(n²), hết giờ với 200 000 nhóm.'],
  ],
  gt: ['In sorted order, if s[l] + s[r] ≤ X then s[l] + s[k] ≤ X for every k in (l, r], so all r − l pairs starting at l are counted in one step and l is finished; otherwise s[r] is too big for every remaining partner, so r is finished. Each step finishes one index ⇒ atMost is O(n). The range count is the difference of two prefix-style counts, the same "between = at most hi − at most lo−1" trick used with prefix sums. Total O(n log n) for the sort.', 'Theo thứ tự đã sắp, nếu s[l] + s[r] ≤ X thì s[l] + s[k] ≤ X với mọi k trong (l, r], nên cả r − l cặp bắt đầu từ l được đếm trong một bước và xong l; ngược lại s[r] quá lớn với mọi bạn ghép còn lại, nên xong r. Mỗi bước xong một chỉ số ⇒ atMost là O(n). Số đếm trong khoảng là hiệu của hai số đếm kiểu tiền tố — cùng mẹo "trong khoảng = không quá hi − không quá lo−1" của tổng tiền tố. Tổng cộng O(n log n) cho phép sắp.'],
  kn: ['two pointers counting', 'range = atMost(hi) − atMost(lo − 1)'],
  tns: [tn('count in bulk', 'đếm theo lô', 'cộng r − l cặp một lần thay vì từng cặp.'), tn('inclusive range', 'khoảng đóng', 'gồm cả hai đầu.'), tn('at most', 'không quá (≤)')],
  dau: `/**
 * sizes: number[], lo <= hi
 * returns the number of pairs i < j with lo <= sizes[i] + sizes[j] <= hi
 */
function countFittingPairs(sizes, lo, hi) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — atMost(hi) - atMost(lo - 1), each counted with two pointers on a sorted copy.\n' + nguon(countAtMost, countFittingPairs),
  cases: [
    { args: [[3, 5, 8, 2], 7, 10], moTa: ['3+5, 5+2 and 8+2 fit ⇒ 3 pairs', '3+5, 5+2 và 8+2 vừa ⇒ 3 cặp'] },
    { args: [[4, 4, 4], 8, 8], moTa: ['Three equal groups ⇒ 3 pairs', 'Ba nhóm bằng nhau ⇒ 3 cặp'] },
    { args: [[1, 2], 10, 20], moTa: ['Too small ⇒ 0', 'Quá nhỏ ⇒ 0'] },
    { args: [[], 0, 5], an: true },
    { args: [[6, 1, 9, 3, 7, 2], 9, 9], an: true, moTa: ['Sum exactly lo = hi', 'Tổng đúng bằng lo = hi'] },
    { args: [[10, 20, 30, 40, 50], 0, 1000], an: true, moTa: ['Every pair fits ⇒ n(n−1)/2', 'Mọi cặp đều vừa ⇒ n(n−1)/2'] },
    { args: [[5, 5, 5, 5, 6, 6], 10, 11], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 groups (checking every pair times out)', 'Hiệu năng: 200 000 nhóm (soát mọi cặp hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(1 + R(1000000)); return countFittingPairs(a, 700000, 1300000);',
  }],
  saiMau: [
    { ten: ['O(n²): every pair', 'O(n²): mọi cặp'], chiHieuNang: true, ma: 'function countFittingPairs(sizes, lo, hi) {\n  var c = 0;\n  for (var i = 0; i < sizes.length; i++) for (var j = i + 1; j < sizes.length; j++) { var s = sizes[i] + sizes[j]; if (s >= lo && s <= hi) c++; }\n  return c;\n}\n' },
    { ten: ['atMost(hi) − atMost(lo) (drops sums equal to lo)', 'atMost(hi) − atMost(lo) (mất các tổng bằng lo)'], ma: 'function countFittingPairs(sizes, lo, hi) {\n  var s = sizes.slice().sort(function (a, b) { return a - b; });\n  function am(x) { var l = 0, r = s.length - 1, c = 0; while (l < r) { if (s[l] + s[r] <= x) { c += r - l; l++; } else r--; } return c; }\n  return am(hi) - am(lo);\n}\n' },
  ],
});

export default mod('dsa-2-1-hai-con-tro', '2.1 Two pointers: one pass instead of two nested loops', [T1, T2, T3, T4]);
