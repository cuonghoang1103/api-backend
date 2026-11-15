/** Coding Interview Prep · 2.2 — Cửa sổ trượt: cố định (tổng trượt, cửa sổ vòng) và co giãn (đếm trong cửa sổ, đếm số đoạn). Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Cửa sổ cố định: số tuần ngủ đủ ── */
function countRestedWindows(minutes, k, target) {
  if (k > minutes.length) return 0;
  var sum = 0;
  for (var i = 0; i < k; i++) sum += minutes[i];   // the first window [0, k-1]
  var good = sum >= target * k ? 1 : 0;           // compare totals, not averages: no floating-point division
  for (var r = k; r < minutes.length; r++) {
    sum += minutes[r] - minutes[r - k];            // slide by one: add the new day, drop the oldest
    if (sum >= target * k) good++;
  }
  return good;
}
const W1 = bai({
  ten: 'Sleep tracker: how many k-day stretches met the target', kho: 'EASY', phut: 10, ham: 'countRestedWindows',
  en: `<p>A wellbeing app for FPT students records how many <b>minutes</b> the user slept each night, <code>minutes[i]</code>. Its weekly report asks: among all stretches of <code>k</code> consecutive nights, how many have an <b>average</b> of at least <code>target</code> minutes?</p>
<p>Write <code>countRestedWindows(minutes, k, target)</code> returning that count. If there are fewer than k nights, the answer is 0.</p>`,
  vi: `<p>Một app sức khoẻ cho sinh viên FPT ghi số <b>phút</b> người dùng ngủ mỗi đêm, <code>minutes[i]</code>. Báo cáo tuần hỏi: trong mọi chuỗi <code>k</code> đêm liên tiếp, có bao nhiêu chuỗi có <b>trung bình</b> ít nhất <code>target</code> phút?</p>
<p>Viết <code>countRestedWindows(minutes, k, target)</code> trả về số đó. Ít hơn k đêm thì đáp án là 0.</p>`,
  dauVao: ['minutes — array of non-negative integers; k ≥ 1; target ≥ 0.', 'minutes — mảng số nguyên không âm; k ≥ 1; target ≥ 0.'],
  dauRa: ['number — how many windows qualify.', 'number — số cửa sổ đạt.'],
  rangBuoc: [['0 ≤ minutes.length ≤ 200 000; 1 ≤ k ≤ 200 000; minutes[i] ≤ 1440.', '0 ≤ minutes.length ≤ 200 000; 1 ≤ k ≤ 200 000; minutes[i] ≤ 1440.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Two neighbouring windows share k − 1 nights. Recomputing each window from scratch costs O(k) — reuse the previous sum instead.', 'Hai cửa sổ kề nhau chung k − 1 đêm. Tính lại từng cửa sổ từ đầu tốn O(k) — hãy dùng lại tổng của cửa sổ trước.'],
    ['Keep <code>sum</code>; when the window moves right by one, <code>sum += minutes[r] − minutes[r − k]</code>. Compare <code>sum ≥ target · k</code> instead of dividing.', 'Giữ <code>sum</code>; khi cửa sổ dịch phải một, <code>sum += minutes[r] − minutes[r − k]</code>. So <code>sum ≥ target · k</code> thay vì chia.'],
  ],
  loi: [
    ['Off-by-one in the number of windows: there are <code>n − k + 1</code> of them, not <code>n − k</code> — the last window is often forgotten.', 'Lệch một ở số cửa sổ: có <code>n − k + 1</code> cửa sổ, không phải <code>n − k</code> — cửa sổ cuối hay bị quên.'],
    ['Recomputing every window with an inner loop or <code>slice().reduce()</code>: O(n·k), the 200 000-night check with k = 100 000 times out.', 'Tính lại từng cửa sổ bằng vòng trong hay <code>slice().reduce()</code>: O(n·k), kiểm 200 000 đêm với k = 100 000 hết giờ.'],
  ],
  gt: ['A fixed window moves by one element at a time, so its sum changes by exactly "new element − element that left": O(1) per step after an O(k) start ⇒ O(n) total, O(1) memory. Comparing <code>sum ≥ target·k</code> is the same test as <code>average ≥ target</code> but stays in integers.', 'Cửa sổ cố định dịch từng phần tử một, nên tổng của nó đổi đúng bằng "phần tử mới − phần tử vừa rời": O(1) mỗi bước sau O(k) khởi đầu ⇒ tổng O(n), bộ nhớ O(1). So <code>sum ≥ target·k</code> là cùng phép thử với <code>trung bình ≥ target</code> nhưng giữ nguyên số nguyên.'],
  kn: ['fixed sliding window', 'running sum'],
  tns: [tn('sliding window', 'cửa sổ trượt'), tn('fixed-size window', 'cửa sổ kích thước cố định'), tn('average', 'trung bình')],
  dau: `/**
 * minutes: number[] — minutes slept per night, k: window length, target: minimum average
 * returns how many windows of k consecutive nights have average >= target
 */
function countRestedWindows(minutes, k, target) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — one running sum slid across the array.\n' + nguon(countRestedWindows),
  cases: [
    { args: [[420, 360, 480, 450, 300], 3, 420], moTa: ['Windows 420/360/480, 360/480/450, 480/450/300 ⇒ 2', 'Ba cửa sổ ⇒ 2 đạt'] },
    { args: [[400, 500], 3, 300], moTa: ['Fewer nights than k ⇒ 0', 'Ít đêm hơn k ⇒ 0'] },
    { args: [[480, 480, 480], 3, 480], moTa: ['Exactly the target counts', 'Đúng bằng mục tiêu cũng tính'] },
    { args: [[], 1, 0], an: true },
    { args: [[300, 600, 300, 600, 300], 2, 450], an: true },
    { args: [[0, 0, 0, 1440], 1, 1], an: true },
    { args: [[420, 410, 430, 400, 440, 450, 390], 7, 420], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 nights, k = 100 000 (re-summing every window times out)', 'Hiệu năng: 200 000 đêm, k = 100 000 (cộng lại từng cửa sổ hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(300 + R(241)); return countRestedWindows(a, 100000, 420);',
  }],
  saiMau: [
    { ten: ['O(n·k): re-sum every window', 'O(n·k): cộng lại từng cửa sổ'], chiHieuNang: true, ma: 'function countRestedWindows(minutes, k, target) {\n  var c = 0;\n  for (var i = 0; i + k <= minutes.length; i++) { var s = 0; for (var j = i; j < i + k; j++) s += minutes[j]; if (s >= target * k) c++; }\n  return c;\n}\n' },
    { ten: ['Forgets the last window', 'Quên cửa sổ cuối'], ma: 'function countRestedWindows(minutes, k, target) {\n  var c = 0;\n  for (var i = 0; i + k < minutes.length; i++) { var s = 0; for (var j = i; j < i + k; j++) s += minutes[j]; if (s >= target * k) c++; }\n  return c;\n}\n' },
  ],
});

/* ── 2. Cửa sổ co giãn + đếm: đoạn log dài nhất không ai quá maxPer lần ── */
function longestFairStretch(users, maxPer) {
  var cnt = new Map();     // user -> occurrences inside the current window [l, r]
  var l = 0, best = 0;
  for (var r = 0; r < users.length; r++) {
    var u = users[r];
    cnt.set(u, (cnt.get(u) || 0) + 1);
    // only u can have become too frequent; shrink from the left until it is fine again (WHILE, not if)
    while (cnt.get(u) > maxPer) {
      cnt.set(users[l], cnt.get(users[l]) - 1);
      l++;
    }
    if (r - l + 1 > best) best = r - l + 1;
  }
  return best;
}
const W2 = bai({
  ten: 'Rate-limit audit: the longest stretch where nobody exceeds the quota', kho: 'MEDIUM', phut: 20, ham: 'longestFairStretch',
  en: `<p>The LMS gateway writes the user ID of every request into <code>users</code>, in arrival order. To tune the rate limiter, the team wants the longest contiguous stretch of the log in which <b>no single user appears more than <code>maxPer</code> times</b>.</p>
<p>Write <code>longestFairStretch(users, maxPer)</code> returning the length of that stretch (0 for an empty log).</p>`,
  vi: `<p>Cổng LMS ghi mã người dùng của mọi request vào <code>users</code>, theo thứ tự đến. Để chỉnh bộ giới hạn tần suất, đội vận hành muốn đoạn log liên tiếp dài nhất trong đó <b>không người dùng nào xuất hiện quá <code>maxPer</code> lần</b>.</p>
<p>Viết <code>longestFairStretch(users, maxPer)</code> trả về độ dài đoạn đó (log rỗng thì 0).</p>`,
  dauVao: ['users — array of strings; maxPer — integer ≥ 1.', 'users — mảng chuỗi; maxPer — số nguyên ≥ 1.'],
  dauRa: ['number — length of the longest valid stretch.', 'number — độ dài đoạn hợp lệ dài nhất.'],
  rangBuoc: [['0 ≤ users.length ≤ 200 000; 1 ≤ maxPer ≤ 1000.', '0 ≤ users.length ≤ 200 000; 1 ≤ maxPer ≤ 1000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['If a stretch is valid, every shorter stretch inside it is valid too. That monotonicity is the signal for a variable-size window: grow on the right, shrink on the left.', 'Nếu một đoạn hợp lệ thì mọi đoạn ngắn hơn nằm trong nó cũng hợp lệ. Tính đơn điệu đó là tín hiệu của cửa sổ co giãn: nới bên phải, co bên trái.'],
    ['Keep a Map of counts for the window. After adding <code>users[r]</code>, only that user can be over the quota — move <code>l</code> right <b>while</b> its count is above <code>maxPer</code>.', 'Giữ Map số đếm của cửa sổ. Sau khi thêm <code>users[r]</code>, chỉ người đó có thể vượt hạn mức — dời <code>l</code> sang phải <b>chừng nào</b> số đếm của nó còn trên <code>maxPer</code>.'],
  ],
  loi: [
    ['Shrinking with <code>if</code> instead of <code>while</code>: one step left is not always enough (the extra copy of u can be far inside the window).', 'Co bằng <code>if</code> thay vì <code>while</code>: lùi một bước không phải lúc nào cũng đủ (bản thừa của u có thể nằm sâu trong cửa sổ).'],
    ['Jumping <code>l = r</code> when the quota breaks: valid stretches that still contain earlier requests are lost.', 'Nhảy <code>l = r</code> khi vượt hạn mức: mất các đoạn hợp lệ vẫn còn chứa request trước đó.'],
    ['Restarting a fresh count from every start position: O(n²), times out on 200 000 requests.', 'Đếm lại từ đầu cho mỗi vị trí bắt đầu: O(n²), hết giờ với 200 000 request.'],
  ],
  gt: ['Each index enters the window once (r) and leaves at most once (l), so the two pointers move at most 2n steps in total ⇒ O(n) time even though there is a loop inside a loop; the Map holds at most the distinct users of the window. The window is always valid after the inner loop, and for each r it is the longest valid window ending at r, so the maximum over r is the answer.', 'Mỗi chỉ số vào cửa sổ một lần (r) và rời nhiều nhất một lần (l), nên hai con trỏ đi tổng cộng tối đa 2n bước ⇒ O(n) thời gian dù có vòng lặp trong vòng lặp; Map chứa tối đa số người dùng khác nhau của cửa sổ. Sau vòng trong cửa sổ luôn hợp lệ, và với mỗi r nó là cửa sổ hợp lệ dài nhất kết thúc ở r, nên cực đại theo r là đáp án.'],
  kn: ['variable sliding window', 'amortised analysis'],
  tns: [tn('variable-size window', 'cửa sổ co giãn'), tn('amortised O(n)', 'O(n) khấu hao', 'tổng số bước của cả hai con trỏ ≤ 2n.'), tn('quota', 'hạn mức')],
  dau: `/**
 * users: string[] — user id of each request, maxPer: number
 * returns the length of the longest stretch where no user appears more than maxPer times
 */
function longestFairStretch(users, maxPer) {
  // Write your solution here
  return users.length;
}
`,
  giai: '// Reference solution — variable window, Map of counts, shrink WHILE the newest user is over quota.\n' + nguon(longestFairStretch),
  cases: [
    { args: [['an', 'binh', 'an', 'an', 'chi', 'binh'], 2], moTa: ['"binh an an chi binh" ⇒ 5', '"binh an an chi binh" ⇒ 5'] },
    { args: [['u1', 'u1', 'u1'], 1], moTa: ['Every request by the same user, quota 1 ⇒ 1', 'Cùng một người, hạn mức 1 ⇒ 1'] },
    { args: [[], 3] },
    { args: [['a', 'b', 'c', 'a', 'b', 'c'], 2], an: true, moTa: ['Nobody over quota ⇒ whole log', 'Không ai vượt ⇒ cả log'] },
    { args: [['x', 'y', 'x', 'z', 'y', 'x', 'y', 'z', 'z'], 1], an: true },
    { args: [['a', 'b', 'b', 'c', 'a', 'a', 'd', 'a'], 2], an: true, moTa: ['The extra copy is deep inside the window', 'Bản thừa nằm sâu trong cửa sổ'] },
    { args: [['p'], 5], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 requests (restarting from every start times out)', 'Hiệu năng: 200 000 request (đếm lại từ mỗi điểm bắt đầu hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push("u" + R(20000)); return longestFairStretch(a, 3);',
  }],
  saiMau: [
    { ten: ['O(n²): fresh count from every start', 'O(n²): đếm lại từ mỗi điểm bắt đầu'], chiHieuNang: true, ma: 'function longestFairStretch(users, maxPer) {\n  var best = 0;\n  for (var i = 0; i < users.length; i++) { var c = new Map(); for (var j = i; j < users.length; j++) { var k = (c.get(users[j]) || 0) + 1; if (k > maxPer) break; c.set(users[j], k); best = Math.max(best, j - i + 1); } }\n  return best;\n}\n' },
    { ten: ['Shrinks with if (one step)', 'Co bằng if (một bước)'], ma: 'function longestFairStretch(users, maxPer) {\n  var c = new Map(), l = 0, best = 0;\n  for (var r = 0; r < users.length; r++) { c.set(users[r], (c.get(users[r]) || 0) + 1); if (c.get(users[r]) > maxPer) { c.set(users[l], c.get(users[l]) - 1); l++; } best = Math.max(best, r - l + 1); }\n  return best;\n}\n' },
  ],
});

/* ── 3. Cửa sổ cố định trên mảng VÒNG: ít lần đổi chỗ nhất ── */
function minSeatSwaps(seats) {
  var n = seats.length, k = 0;
  for (var i = 0; i < n; i++) k += seats[i];      // window size = number of FPT students
  if (k === 0 || k === n) return 0;
  var inWin = 0;
  for (var j = 0; j < k; j++) inWin += seats[j];  // window over seats 0..k-1
  var best = inWin;
  // slide the window all the way round the table: index (s + k - 1) % n wraps past the last seat
  for (var s = 1; s < n; s++) {
    inWin += seats[(s + k - 1) % n] - seats[s - 1];
    if (inWin > best) best = inWin;
  }
  return k - best; // every outsider inside the best window must swap with a student outside it
}
const W3 = bai({
  ten: 'Round table: the fewest swaps to seat the FPT team together', kho: 'MEDIUM', phut: 20, ham: 'minSeatSwaps',
  en: `<p>At a job fair dinner the guests sit around a <b>round</b> table. <code>seats[i]</code> is <code>1</code> if seat <code>i</code> is taken by an FPT student and <code>0</code> otherwise; seat <code>n − 1</code> is next to seat <code>0</code>. The organiser wants all FPT students in one contiguous block of seats (it may wrap past seat 0). One <b>swap</b> exchanges the people in two seats.</p>
<p>Write <code>minSeatSwaps(seats)</code> returning the minimum number of swaps.</p>`,
  vi: `<p>Ở buổi tối ngày hội việc làm, khách ngồi quanh một bàn <b>tròn</b>. <code>seats[i]</code> là <code>1</code> nếu ghế <code>i</code> là sinh viên FPT, ngược lại <code>0</code>; ghế <code>n − 1</code> sát ghế <code>0</code>. Ban tổ chức muốn mọi sinh viên FPT ngồi thành một dãy ghế liền nhau (dãy có thể vòng qua ghế 0). Một lần <b>đổi chỗ</b> hoán đổi người ở hai ghế.</p>
<p>Viết <code>minSeatSwaps(seats)</code> trả về số lần đổi chỗ ít nhất.</p>`,
  dauVao: ['seats — array of 0/1 (the table is circular).', 'seats — mảng 0/1 (bàn tròn).'],
  dauRa: ['number — minimum swaps.', 'number — số lần đổi ít nhất.'],
  rangBuoc: [['1 ≤ seats.length ≤ 200 000.', '1 ≤ seats.length ≤ 200 000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['Let k = number of 1s. In the final arrangement they occupy SOME k consecutive seats. For a given block of k seats, how many swaps does it cost? Exactly the number of 0s inside it.', 'Gọi k = số chữ 1. Ở cuối, chúng chiếm MỘT dãy k ghế liên tiếp nào đó. Với một dãy k ghế cho trước, tốn bao nhiêu lần đổi? Đúng bằng số chữ 0 trong dãy.'],
    ['So find the window of size k (going round the circle: index <code>% n</code>) containing the most 1s, with a fixed sliding window. Answer = k − that maximum.', 'Vậy tìm cửa sổ kích thước k (đi vòng quanh bàn: chỉ số <code>% n</code>) chứa nhiều chữ 1 nhất, bằng cửa sổ trượt cố định. Đáp án = k − cực đại đó.'],
  ],
  loi: [
    ['Sliding only over the straight array: a block that wraps from the last seat to seat 0 is never tried.', 'Chỉ trượt trên mảng thẳng: dãy vòng từ ghế cuối sang ghế 0 không bao giờ được thử.'],
    ['Counting the 0s in a block, then the 1s outside, and adding both — each swap fixes one of each, so that double-counts.', 'Đếm số 0 trong dãy rồi số 1 ngoài dãy và cộng cả hai — mỗi lần đổi sửa một cái mỗi loại, nên bị đếm hai lần.'],
    ['Counting each window from scratch: O(n·k), the 200 000-seat check times out.', 'Đếm lại từng cửa sổ: O(n·k), kiểm 200 000 ghế hết giờ.'],
  ],
  gt: ['Fix the block of k seats the team will end up in: every outsider inside it must leave and every student outside must come in, and one swap does both, so the cost is the number of 0s in the block = k − (1s in the block). Minimising the cost = maximising the 1s in a size-k window. On a circle there are n such windows; using index <code>(s + k − 1) % n</code> slides through all of them in O(n) with O(1) memory.', 'Cố định dãy k ghế mà cả đội sẽ ngồi: mọi người ngoài đang ở trong dãy phải ra và mọi sinh viên ngoài dãy phải vào, một lần đổi làm được cả hai, nên chi phí là số chữ 0 trong dãy = k − (số chữ 1 trong dãy). Cực tiểu chi phí = cực đại số chữ 1 trong cửa sổ kích thước k. Trên vòng tròn có n cửa sổ như vậy; dùng chỉ số <code>(s + k − 1) % n</code> trượt qua hết trong O(n), bộ nhớ O(1).'],
  kn: ['fixed sliding window', 'circular array'],
  tns: [tn('circular array', 'mảng vòng', 'phần tử cuối nối với phần tử đầu.'), tn('swap', 'hoán đổi'), tn('modulo index', 'chỉ số lấy dư', 'i % n đưa chỉ số vượt cuối về đầu.')],
  dau: `/**
 * seats: number[] of 0/1 around a ROUND table
 * returns the minimum number of swaps so that all 1s sit in one contiguous (circular) block
 */
function minSeatSwaps(seats) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — window of size k = number of 1s, slid all the way round with % n.\n' + nguon(minSeatSwaps),
  cases: [
    { args: [[1, 0, 1, 0, 1]], moTa: ['Seats 4, 0 form a block across the wrap ⇒ 1 swap', 'Ghế 4, 0 liền nhau qua chỗ vòng ⇒ 1 lần'] },
    { args: [[0, 1, 0, 1, 1, 0, 0]] },
    { args: [[0, 0, 0]], moTa: ['No FPT student ⇒ 0', 'Không có sinh viên FPT ⇒ 0'] },
    { args: [[1, 1, 0, 0, 1]], an: true, moTa: ['Already together across seat 0', 'Đã liền nhau qua ghế 0'] },
    { args: [[1]], an: true },
    { args: [[1, 0, 0, 1, 0, 1, 1, 0, 1, 0]], an: true },
    { args: [[0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 seats, ~100 000 FPT students (counting each window times out)', 'Hiệu năng: 200 000 ghế, ~100 000 sinh viên FPT (đếm lại từng cửa sổ hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(R(2)); return minSeatSwaps(a);',
  }],
  saiMau: [
    { ten: ['Straight array only (no wrap-around)', 'Chỉ mảng thẳng (không vòng)'], ma: 'function minSeatSwaps(seats) {\n  var k = seats.reduce(function (a, b) { return a + b; }, 0), w = 0, best = 0;\n  if (!k) return 0;\n  for (var i = 0; i < seats.length; i++) { w += seats[i]; if (i >= k) w -= seats[i - k]; if (i >= k - 1) best = Math.max(best, w); }\n  return k - best;\n}\n' },
    { ten: ['O(n·k): count every circular window', 'O(n·k): đếm từng cửa sổ vòng'], chiHieuNang: true, ma: 'function minSeatSwaps(seats) {\n  var n = seats.length, k = 0;\n  for (var x of seats) k += x;\n  if (k === 0 || k === n) return 0;\n  var best = 0;\n  for (var s = 0; s < n; s++) { var w = 0; for (var j = 0; j < k; j++) w += seats[(s + j) % n]; if (w > best) best = w; }\n  return k - best;\n}\n' },
  ],
});

/* ── 4. Cửa sổ co giãn để ĐẾM số đoạn: đoạn có ít nhất k mẫu đạt đỉnh ── */
function countHotRanges(samples, k) {
  var peak = -Infinity;
  for (var i = 0; i < samples.length; i++) if (samples[i] > peak) peak = samples[i]; // the GLOBAL maximum
  var l = 0, inWin = 0, total = 0;
  for (var r = 0; r < samples.length; r++) {
    if (samples[r] === peak) inWin++;
    // shrink while [l, r] still has >= k peaks; afterwards every start 0..l-1 gives a valid range ending at r
    while (inWin >= k) {
      if (samples[l] === peak) inWin--;
      l++;
    }
    total += l; // ranges [0..l-1, r] all contain at least k peaks
  }
  return total;
}
const W4 = bai({
  ten: 'CPU monitor: count time ranges with at least k overload samples', kho: 'HARD', phut: 25, ham: 'countHotRanges',
  en: `<p>A monitoring agent on the CT Work server records CPU load every second in <code>samples</code>. The <b>overload level</b> is the maximum value of the whole recording. An alert fires for a time range (a contiguous subarray) if the overload level occurs in it <b>at least <code>k</code> times</b>.</p>
<p>Write <code>countHotRanges(samples, k)</code> returning how many contiguous ranges would fire the alert. The answer can be large (up to about n²/2).</p>`,
  vi: `<p>Một agent giám sát trên máy chủ CT Work ghi tải CPU mỗi giây vào <code>samples</code>. <b>Mức quá tải</b> là giá trị lớn nhất của cả bản ghi. Cảnh báo bật cho một khoảng thời gian (mảng con liên tiếp) nếu mức quá tải xuất hiện trong đó <b>ít nhất <code>k</code> lần</b>.</p>
<p>Viết <code>countHotRanges(samples, k)</code> trả về số khoảng liên tiếp sẽ bật cảnh báo. Đáp án có thể lớn (tới khoảng n²/2).</p>`,
  dauVao: ['samples — array of integers (0–100); k — integer ≥ 1.', 'samples — mảng số nguyên (0–100); k — số nguyên ≥ 1.'],
  dauRa: ['number — count of ranges.', 'number — số khoảng.'],
  rangBuoc: [['0 ≤ samples.length ≤ 200 000; 1 ≤ k ≤ 200 000.', '0 ≤ samples.length ≤ 200 000; 1 ≤ k ≤ 200 000.'], ['Target: O(n).', 'Mục tiêu: O(n).']],
  goiY: [
    ['The overload level is a fixed number (the global max), so the question becomes "count subarrays containing at least k copies of one value". If [l, r] qualifies, so does every [l\', r] with l\' &lt; l.', 'Mức quá tải là một số cố định (cực đại toàn cục), nên câu hỏi thành "đếm mảng con chứa ít nhất k bản của một giá trị". Nếu [l, r] đạt thì mọi [l\', r] với l\' &lt; l cũng đạt.'],
    ['For each right end r, push l right while the window [l, r] still has ≥ k peaks. Then exactly the starts 0..l−1 work for this r: add <code>l</code>.', 'Với mỗi đầu phải r, đẩy l sang phải chừng nào cửa sổ [l, r] còn ≥ k đỉnh. Khi đó đúng các điểm bắt đầu 0..l−1 hợp lệ với r này: cộng <code>l</code>.'],
  ],
  loi: [
    ['Using the maximum of each window instead of the global maximum: a range of low values has its own "max" but is not an overload.', 'Dùng cực đại của từng cửa sổ thay vì cực đại toàn cục: một khoảng toàn giá trị thấp có "max" riêng nhưng không phải quá tải.'],
    ['Adding 1 per valid window instead of counting all valid starts for each r: you count windows found, not ranges.', 'Cộng 1 cho mỗi cửa sổ hợp lệ thay vì đếm mọi điểm bắt đầu hợp lệ cho mỗi r: bạn đếm số cửa sổ tìm được, không phải số khoảng.'],
    ['For each start, scanning right until k peaks are seen: O(n²) when peaks are rare — the large check times out.', 'Với mỗi điểm bắt đầu, quét sang phải tới khi thấy k đỉnh: O(n²) khi đỉnh hiếm — kiểm lớn hết giờ.'],
  ],
  gt: ['"At least k peaks" is monotone in the start: moving the start left only adds samples. So for each r the valid starts form a prefix 0..l−1, and after the inner loop l is exactly the first start that is NOT valid. l never moves back ⇒ both pointers move at most n steps ⇒ O(n) time, O(1) memory. The total can reach ~2·10¹⁰ — still exact in a JS number (Java: <code>long</code>).', '"Ít nhất k đỉnh" đơn điệu theo điểm bắt đầu: dời điểm bắt đầu sang trái chỉ thêm mẫu. Nên với mỗi r, các điểm bắt đầu hợp lệ là một đoạn đầu 0..l−1, và sau vòng trong l đúng là điểm bắt đầu đầu tiên KHÔNG hợp lệ. l không bao giờ lùi ⇒ cả hai con trỏ đi tối đa n bước ⇒ O(n) thời gian, O(1) bộ nhớ. Tổng có thể tới ~2·10¹⁰ — số JS vẫn giữ chính xác (Java: <code>long</code>).'],
  kn: ['counting subarrays with a sliding window', 'monotone condition'],
  tns: [tn('count subarrays', 'đếm mảng con'), tn('global maximum', 'cực đại toàn cục'), tn('monotone', 'đơn điệu', 'nới đoạn không làm điều kiện từ đúng thành sai.')],
  dau: `/**
 * samples: number[] — CPU load per second, k: number
 * returns how many contiguous ranges contain the global maximum at least k times
 */
function countHotRanges(samples, k) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — global peak, then a window that is pushed while it still has >= k peaks; add l per r.\n' + nguon(countHotRanges),
  cases: [
    { args: [[40, 95, 60, 95, 95], 2], moTa: ['Peak 95; ranges with ≥ 2 of them', 'Đỉnh 95; các khoảng có ≥ 2 lần'] },
    { args: [[70, 80, 70], 2], moTa: ['The peak occurs once ⇒ 0', 'Đỉnh chỉ xuất hiện một lần ⇒ 0'] },
    { args: [[50, 50, 50], 1], moTa: ['Every range qualifies ⇒ 6', 'Mọi khoảng đều đạt ⇒ 6'] },
    { args: [[], 1], an: true },
    { args: [[10, 100, 10, 10, 100, 10, 100], 2], an: true },
    { args: [[5, 1, 5, 1, 1, 5], 3], an: true },
    { args: [[90, 90, 10, 20, 90], 1], an: true },
    { args: [[30, 60, 30, 60], 3], an: true, moTa: ['k larger than the number of peaks ⇒ 0', 'k lớn hơn số đỉnh ⇒ 0'] },
  ],
  perf: [{
    moTa: ['Performance: 200 000 samples with rare peaks, k = 150 (scanning from every start times out)', 'Hiệu năng: 200 000 mẫu, đỉnh hiếm, k = 150 (quét từ mỗi điểm bắt đầu hết giờ)'],
    than: 'var a = []; for (var i = 0; i < 200000; i++) a.push(R(1000) === 0 ? 100 : R(100)); return countHotRanges(a, 150);',
  }],
  saiMau: [
    { ten: ['O(n²): scan right from every start', 'O(n²): quét phải từ mỗi điểm bắt đầu'], chiHieuNang: true, ma: 'function countHotRanges(samples, k) {\n  var p = -Infinity, t = 0; for (var x of samples) if (x > p) p = x;\n  for (var i = 0; i < samples.length; i++) { var c = 0; for (var j = i; j < samples.length; j++) { if (samples[j] === p) c++; if (c >= k) { t += samples.length - j; break; } } }\n  return t;\n}\n' },
    { ten: ['+1 per valid window instead of +l', '+1 mỗi cửa sổ hợp lệ thay vì +l'], ma: 'function countHotRanges(samples, k) {\n  var p = -Infinity; for (var x of samples) if (x > p) p = x;\n  var l = 0, c = 0, t = 0;\n  for (var r = 0; r < samples.length; r++) { if (samples[r] === p) c++; if (c >= k) t++; while (c >= k) { if (samples[l] === p) c--; l++; } }\n  return t;\n}\n' },
  ],
});

export default mod('dsa-2-2-cua-so', '2.2 Sliding window: fixed and variable size', [W1, W2, W3, W4]);
