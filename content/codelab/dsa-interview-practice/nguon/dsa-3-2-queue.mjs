/** Coding Interview Prep · 3.2 — Queue và deque: giới hạn tần suất bằng hàng đợi, xoay vòng (round-robin), hai deque đơn điệu cho max−min cửa sổ. Đề tự soạn (không trùng đề LeetCode của bài). */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Hàng đợi thời gian: giới hạn số lần đăng nhập trong một cửa sổ ── */
function allowRequests(times, limit, windowMs) {
  var q = [], head = 0; // timestamps of ACCEPTED requests; q[head..] are the ones still inside the window
  var out = new Array(times.length);
  for (var i = 0; i < times.length; i++) {
    var t = times[i];
    // the window is (t - windowMs, t]: anything at or before t - windowMs has expired — drop it from the FRONT
    while (head < q.length && q[head] <= t - windowMs) head++;
    if (q.length - head < limit) { q.push(t); out[i] = true; } // only accepted requests occupy the window
    else out[i] = false;
  }
  return out;
}
const D1 = bai({
  ten: 'Login rate limiter: accept or reject each attempt', kho: 'EASY', phut: 15, ham: 'allowRequests',
  en: `<p>To slow down password guessing, the FAP-style login endpoint accepts at most <code>limit</code> attempts per account in any sliding window of <code>windowMs</code> milliseconds. An attempt at time <code>t</code> is <b>accepted</b> if fewer than <code>limit</code> <b>accepted</b> attempts happened in the window <code>(t − windowMs, t]</code>; otherwise it is rejected — and a rejected attempt does <b>not</b> use up a slot.</p>
<p>Write <code>allowRequests(times, limit, windowMs)</code>. <code>times</code> is sorted in non-decreasing order. Return an array of booleans, one per attempt.</p>`,
  vi: `<p>Để làm chậm việc dò mật khẩu, endpoint đăng nhập kiểu FAP nhận tối đa <code>limit</code> lần thử mỗi tài khoản trong bất kỳ cửa sổ trượt <code>windowMs</code> mili giây nào. Lần thử ở thời điểm <code>t</code> được <b>nhận</b> nếu trong cửa sổ <code>(t − windowMs, t]</code> có ít hơn <code>limit</code> lần thử <b>đã được nhận</b>; ngược lại bị từ chối — và lần bị từ chối <b>không</b> chiếm chỗ.</p>
<p>Viết <code>allowRequests(times, limit, windowMs)</code>. <code>times</code> đã sắp không giảm. Trả về mảng boolean, mỗi lần thử một phần tử.</p>`,
  dauVao: ['times — sorted timestamps (ms); limit ≥ 1; windowMs ≥ 1.', 'times — mốc thời gian đã sắp (ms); limit ≥ 1; windowMs ≥ 1.'],
  dauRa: ['boolean[] of the same length.', 'boolean[] cùng độ dài.'],
  rangBuoc: [['0 ≤ times.length ≤ 200 000; 1 ≤ limit ≤ 10⁵; 1 ≤ windowMs ≤ 10⁹.', '0 ≤ times.length ≤ 200 000; 1 ≤ limit ≤ 10⁵; 1 ≤ windowMs ≤ 10⁹.'], ['Target: O(n) total.', 'Mục tiêu: tổng O(n).']],
  goiY: [
    ['Accepted attempts leave the window in the same order they entered it — oldest first. That is a queue.', 'Các lần được nhận rời cửa sổ đúng thứ tự chúng vào — cũ nhất ra trước. Đó là một hàng đợi.'],
    ['Before deciding on time t, pop from the front every accepted time ≤ t − windowMs. Then the queue length is exactly "accepted attempts in the window". Push t only if you accept it.', 'Trước khi quyết định ở thời điểm t, lấy khỏi đầu hàng mọi mốc đã nhận ≤ t − windowMs. Khi đó độ dài hàng đợi đúng bằng "số lần đã nhận trong cửa sổ". Chỉ đẩy t vào nếu nhận nó.'],
  ],
  loi: [
    ['Pushing every attempt, rejected ones too: a bot that keeps hammering stays blocked forever, and the count no longer matches the rule.', 'Đẩy mọi lần thử, kể cả lần bị từ chối: bot cứ gõ liên tục sẽ bị chặn mãi, và số đếm không còn khớp luật.'],
    ['Off-by-one on the boundary: the window is <code>(t − windowMs, t]</code>, so an attempt exactly <code>windowMs</code> ago has already expired (use <code>&lt;=</code> when dropping).', 'Lệch một ở biên: cửa sổ là <code>(t − windowMs, t]</code>, nên lần thử cách đúng <code>windowMs</code> đã hết hạn (bỏ ra bằng <code>&lt;=</code>).'],
    ['Re-counting the whole history with <code>filter</code> for every attempt: O(n²) — the 200 000-attempt check times out.', 'Đếm lại cả lịch sử bằng <code>filter</code> cho mỗi lần thử: O(n²) — kiểm 200 000 lần thử hết giờ.'],
  ],
  gt: ['Because times arrive sorted, the accepted timestamps inside the window always form a contiguous suffix of "everything accepted so far": once an old one expires it never comes back. A queue with a moving <code>head</code> index represents that suffix; each accepted timestamp is pushed once and dropped once ⇒ O(n) total, O(n) memory (O(limit) if you compact the array). Using a head index instead of <code>shift()</code> keeps every pop O(1) regardless of engine.', 'Vì mốc thời gian đến theo thứ tự, các mốc đã nhận nằm trong cửa sổ luôn là một đoạn cuối liền nhau của "mọi thứ đã nhận": mốc cũ đã hết hạn thì không bao giờ quay lại. Một hàng đợi với chỉ số <code>head</code> di chuyển biểu diễn đoạn đó; mỗi mốc được đẩy một lần và bỏ một lần ⇒ tổng O(n), bộ nhớ O(n) (O(limit) nếu dồn mảng). Dùng chỉ số head thay cho <code>shift()</code> giữ mỗi lần lấy ra là O(1) trên mọi engine.'],
  kn: ['queue', 'sliding-window rate limiting'],
  tns: [tn('rate limiter', 'bộ giới hạn tần suất'), tn('sliding window log', 'nhật ký cửa sổ trượt', 'lưu mốc thời gian từng request trong cửa sổ.'), tn('FIFO — first in, first out', 'vào trước, ra trước')],
  dau: `/**
 * times: number[] (sorted), limit: number, windowMs: number
 * returns one boolean per attempt: accepted or rejected
 */
function allowRequests(times, limit, windowMs) {
  // Write your solution here
  return times.map(function () { return true; });
}
`,
  giai: '// Reference solution — a queue (array + head index) of ACCEPTED timestamps.\n' + nguon(allowRequests),
  cases: [
    { args: [[0, 100, 200, 300, 1000, 1001], 3, 1000], moTa: ['4th attempt rejected; at 1000 the attempt at 0 has expired', 'Lần thứ 4 bị từ chối; tới 1000 thì lần ở 0 đã hết hạn'] },
    { args: [[5, 5, 5, 5], 2, 10], moTa: ['Same millisecond', 'Cùng một mili giây'] },
    { args: [[], 3, 1000], an: true },
    { args: [[0, 10, 20, 30, 40, 50], 1, 25], an: true, moTa: ['Rejected attempts do not occupy a slot', 'Lần bị từ chối không chiếm chỗ'] },
    { args: [[0, 999, 1000, 1999, 2000], 1, 1000], an: true, moTa: ['Exactly windowMs ago has expired', 'Cách đúng windowMs là đã hết hạn'] },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8], 3, 4], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 attempts, limit 50 000, a long window (re-counting the history is O(n²))', 'Hiệu năng: 200 000 lần thử, limit 50 000, cửa sổ dài (đếm lại lịch sử là O(n²))'],
    than: 'var n = 200000, t = [], x = 0; for (var i = 0; i < n; i++) { x += R(3); t.push(x); } var r = allowRequests(t, 50000, 150000), ok = 0, s = 0; for (var j = 0; j < n; j++) if (r[j]) { ok++; s = (s + j) % 1000000007; } return { accepted: ok, indexChecksum: s };',
  }],
  saiMau: [
    { ten: ['O(n²): count accepted times inside the window from scratch', 'O(n²): đếm lại các mốc đã nhận trong cửa sổ từ đầu'], chiHieuNang: true, ma: 'function allowRequests(times, limit, windowMs) {\n  var acc = [], out = [];\n  for (var t of times) { var c = 0; for (var a of acc) if (a > t - windowMs) c++; if (c < limit) { acc.push(t); out.push(true); } else out.push(false); }\n  return out;\n}\n' },
    { ten: ['Rejected attempts also enter the queue', 'Lần bị từ chối cũng vào hàng đợi'], ma: 'function allowRequests(times, limit, windowMs) {\n  var q = [], h = 0, out = [];\n  for (var t of times) { while (h < q.length && q[h] <= t - windowMs) h++; out.push(q.length - h < limit); q.push(t); }\n  return out;\n}\n' },
  ],
});

/* ── 2. Xoay vòng (round-robin): thứ tự in xong của hàng đợi máy in ── */
function printOrder(jobs, quantum) {
  var q = [], head = 0, done = [];
  for (var i = 0; i < jobs.length; i++) q.push([jobs[i].id, jobs[i].pages]); // copy: never modify the input
  while (head < q.length) {
    var job = q[head++];                     // take the job at the FRONT
    var left = job[1] - quantum;             // it prints up to `quantum` pages this turn
    if (left <= 0) done.push(job[0]);        // finished during this turn
    else q.push([job[0], left]);             // otherwise it goes to the BACK with the pages it still has
  }
  return done;
}
const D2 = bai({
  ten: 'Library printer: who finishes first under round-robin', kho: 'MEDIUM', phut: 20, ham: 'printOrder',
  en: `<p>The shared printer in the FPT library is fair: it takes the job at the front of the queue, prints at most <code>quantum</code> pages of it, and if the job still has pages left it goes to the <b>back</b> of the queue. A 300-page thesis therefore cannot block a student who only needs a 2-page form.</p>
<p>Write <code>printOrder(jobs, quantum)</code>: <code>jobs</code> is the initial queue (front first) of <code>{ id, pages }</code>. Return the job ids in the order they <b>finish</b>.</p>`,
  vi: `<p>Máy in chung ở thư viện FPT rất công bằng: nó lấy lệnh in ở đầu hàng, in tối đa <code>quantum</code> trang của lệnh đó, và nếu lệnh còn trang thì xếp xuống <b>cuối</b> hàng. Nhờ vậy một quyển khoá luận 300 trang không chặn được bạn chỉ cần in tờ đơn 2 trang.</p>
<p>Viết <code>printOrder(jobs, quantum)</code>: <code>jobs</code> là hàng đợi ban đầu (đầu hàng trước) gồm <code>{ id, pages }</code>. Trả về các id theo thứ tự <b>in xong</b>.</p>`,
  dauVao: ['jobs — array of { id: string, pages: positive integer }; quantum — positive integer.', 'jobs — mảng { id: string, pages: số nguyên dương }; quantum — số nguyên dương.'],
  dauRa: ['string[] — ids in finishing order.', 'string[] — id theo thứ tự in xong.'],
  rangBuoc: [['0 ≤ jobs.length ≤ 100 000; total number of turns ≤ 10⁶.', '0 ≤ jobs.length ≤ 100 000; tổng số lượt ≤ 10⁶.'], ['Target: O(1) per turn.', 'Mục tiêu: O(1) mỗi lượt.']],
  goiY: [
    ['Just simulate — the rules ARE a queue: take from the front, maybe add to the back.', 'Cứ mô phỏng — luật chính là một hàng đợi: lấy ở đầu, có thể thêm vào cuối.'],
    ['Make every queue operation O(1): keep a <code>head</code> index into an array (or write a small ring buffer). Rebuilding the array with <code>slice(1)</code> or <code>[...q.slice(1), job]</code> each turn copies the whole queue.', 'Cho mọi thao tác hàng đợi O(1): giữ chỉ số <code>head</code> trên mảng (hoặc tự viết ring buffer nhỏ). Dựng lại mảng bằng <code>slice(1)</code> hay <code>[...q.slice(1), job]</code> mỗi lượt là chép cả hàng đợi.'],
  ],
  loi: [
    ['Decreasing <code>pages</code> on the input objects: the caller\'s data is destroyed (and the next run gives different results). Copy first.', 'Trừ <code>pages</code> thẳng trên object đầu vào: dữ liệu của người gọi bị phá (và lần chạy sau ra kết quả khác). Chép ra trước.'],
    ['Putting an unfinished job back at the FRONT (or re-inserting it at its old position): that is "finish the current job first", not round-robin.', 'Đặt lệnh chưa xong lại ĐẦU hàng (hoặc chèn về vị trí cũ): đó là "in xong lệnh hiện tại trước", không phải xoay vòng.'],
    ['<code>q = q.slice(1).concat([job])</code> every turn: correct, but O(queue length) per turn ⇒ ~10¹¹ steps on the large check.', '<code>q = q.slice(1).concat([job])</code> mỗi lượt: đúng, nhưng O(độ dài hàng) mỗi lượt ⇒ ~10¹¹ bước ở kiểm lớn.'],
  ],
  gt: ['The printer policy is literally a FIFO queue with re-enqueueing, so a faithful simulation is correct by construction. The cost is one O(1) dequeue + at most one O(1) enqueue per turn ⇒ O(T) for T turns (here ≤ 10⁶) and O(n) live memory. The array-with-head trick grows the array by one entry per re-queue (≤ T entries); a ring buffer of size n would cap memory at O(n) — the lesson\'s circular-queue design.', 'Chính sách của máy in đúng nghĩa đen là hàng đợi FIFO có xếp lại cuối hàng, nên mô phỏng trung thực là đúng theo cách dựng. Chi phí là một lần lấy O(1) + tối đa một lần thêm O(1) mỗi lượt ⇒ O(T) với T lượt (ở đây ≤ 10⁶) và O(n) bộ nhớ đang dùng. Mẹo mảng + head làm mảng dài thêm một phần tử mỗi lần xếp lại (≤ T phần tử); một ring buffer cỡ n giữ bộ nhớ ở O(n) — đúng thiết kế hàng đợi vòng của bài.'],
  kn: ['queue', 'round-robin scheduling', 'simulation'],
  tns: [tn('round-robin', 'xoay vòng', 'mỗi việc được một lượt ngắn rồi xuống cuối hàng.'), tn('quantum / time slice', 'lượng tử / lát thời gian'), tn('enqueue / dequeue', 'thêm vào hàng / lấy ra khỏi hàng')],
  dau: `/**
 * jobs: { id: string, pages: number }[] (front of the queue first), quantum: number
 * returns the ids in the order the jobs finish
 */
function printOrder(jobs, quantum) {
  // Write your solution here
  return jobs.map(function (j) { return j.id; });
}
`,
  giai: '// Reference solution — simulate the queue with an array + head index (O(1) per turn).\n' + nguon(printOrder),
  cases: [
    { args: [[{ id: 'thesis', pages: 7 }, { id: 'form', pages: 2 }, { id: 'slides', pages: 4 }], 3], moTa: ['The 2-page form finishes first', 'Tờ đơn 2 trang in xong trước'] },
    { args: [[{ id: 'a', pages: 3 }, { id: 'b', pages: 3 }], 3], moTa: ['Exactly quantum pages ⇒ finishes in its first turn', 'Đúng quantum trang ⇒ xong ngay lượt đầu'] },
    { args: [[], 5], an: true },
    { args: [[{ id: 'x', pages: 10 }], 1], an: true },
    { args: [[{ id: 'p1', pages: 5 }, { id: 'p2', pages: 1 }, { id: 'p3', pages: 9 }, { id: 'p4', pages: 5 }, { id: 'p5', pages: 2 }], 2], an: true },
    { args: [[{ id: 'big', pages: 100 }, { id: 'small', pages: 1 }], 1000], an: true, moTa: ['Huge quantum ⇒ plain FIFO', 'Quantum rất lớn ⇒ FIFO thường'] },
  ],
  perf: [{
    moTa: ['Performance: 100 000 jobs, ~10⁶ turns (rebuilding the array every turn is far too slow)', 'Hiệu năng: 100 000 lệnh in, ~10⁶ lượt (dựng lại mảng mỗi lượt là quá chậm)'],
    than: 'var jobs = []; for (var i = 0; i < 100000; i++) jobs.push({ id: "J" + i, pages: 1 + R(200) }); var r = printOrder(jobs, 10), s = 0; for (var j = 0; j < r.length; j += 997) s = (s * 31 + Number(r[j].slice(1))) % 1000000007; return { finished: r.length, first: r.slice(0, 3), last: r[r.length - 1], sample: s, inputUntouched: jobs[0].pages + jobs[99999].pages };',
  }],
  saiMau: [
    { ten: ['q = q.slice(1).concat(...) every turn', 'q = q.slice(1).concat(...) mỗi lượt'], chiHieuNang: true, ma: 'function printOrder(jobs, quantum) {\n  var q = jobs.map(function (j) { return [j.id, j.pages]; }), done = [];\n  while (q.length) { var j = q[0]; q = q.slice(1); if (j[1] <= quantum) done.push(j[0]); else q = q.concat([[j[0], j[1] - quantum]]); }\n  return done;\n}\n' },
    { ten: ['Unfinished job goes back to the FRONT', 'Lệnh chưa xong quay lại ĐẦU hàng'], ma: 'function printOrder(jobs, quantum) {\n  var q = jobs.map(function (j) { return [j.id, j.pages]; }), done = [];\n  while (q.length) { var j = q.shift(); if (j[1] <= quantum) done.push(j[0]); else q.unshift([j[0], j[1] - quantum]); }\n  return done;\n}\n' },
  ],
});

/* ── 3. Hai deque đơn điệu: biên độ nhiệt (max − min) của mọi cửa sổ k phút ── */
function windowSwing(temps, k) {
  var out = [];
  if (k > temps.length) return out;
  var mx = [], hx = 0; // indexes, temps DECREASING from head ⇒ temps[mx[hx]] is the window max
  var mn = [], hn = 0; // indexes, temps INCREASING from head ⇒ temps[mn[hn]] is the window min
  for (var i = 0; i < temps.length; i++) {
    while (mx.length > hx && temps[mx[mx.length - 1]] <= temps[i]) mx.pop(); // smaller & older can never be the max again
    mx.push(i);
    while (mn.length > hn && temps[mn[mn.length - 1]] >= temps[i]) mn.pop(); // larger & older can never be the min again
    mn.push(i);
    if (mx[hx] <= i - k) hx++; // the front fell out of the window [i-k+1, i]
    if (mn[hn] <= i - k) hn++;
    if (i >= k - 1) out.push(temps[mx[hx]] - temps[mn[hn]]);
  }
  return out;
}
const D3 = bai({
  ten: 'Server room sensor: temperature swing in every k-minute window', kho: 'HARD', phut: 30, ham: 'windowSwing',
  en: `<p>A sensor in the server room of the Hoa Lac campus logs one temperature per minute: <code>temps[i]</code> (tenths of a degree, integers). A swing — max minus min — larger than 30 inside any 10-minute window suggests the air conditioner is cycling badly, so the facility team wants the swing of <b>every</b> window of <code>k</code> consecutive minutes.</p>
<p>Write <code>windowSwing(temps, k)</code> returning an array of length <code>n − k + 1</code> whose element <code>i</code> is <code>max(temps[i..i+k−1]) − min(temps[i..i+k−1])</code>. If <code>k &gt; n</code> return <code>[]</code>.</p>`,
  vi: `<p>Cảm biến trong phòng máy chủ cơ sở Hoà Lạc ghi mỗi phút một nhiệt độ: <code>temps[i]</code> (phần mười độ, số nguyên). Biên độ — max trừ min — lớn hơn 30 trong bất kỳ cửa sổ 10 phút nào cho thấy điều hoà bật tắt thất thường, nên đội cơ sở vật chất muốn biên độ của <b>mọi</b> cửa sổ <code>k</code> phút liên tiếp.</p>
<p>Viết <code>windowSwing(temps, k)</code> trả về mảng độ dài <code>n − k + 1</code> mà phần tử <code>i</code> là <code>max(temps[i..i+k−1]) − min(temps[i..i+k−1])</code>. Nếu <code>k &gt; n</code> trả <code>[]</code>.</p>`,
  dauVao: ['temps — array of integers (may be negative); k ≥ 1.', 'temps — mảng số nguyên (có thể âm); k ≥ 1.'],
  dauRa: ['number[] of length max(0, n − k + 1).', 'number[] độ dài max(0, n − k + 1).'],
  rangBuoc: [['0 ≤ n ≤ 200 000; 1 ≤ k ≤ 200 000; −10⁶ ≤ temps[i] ≤ 10⁶.', '0 ≤ n ≤ 200 000; 1 ≤ k ≤ 200 000; −10⁶ ≤ temps[i] ≤ 10⁶.'], ['Target: O(n), independent of k.', 'Mục tiêu: O(n), không phụ thuộc k.']],
  goiY: [
    ['Max and min are two independent questions. Solve "max of every window" in O(n) first — then do the mirror image for the min.', 'Max và min là hai câu hỏi độc lập. Giải "max của mọi cửa sổ" trong O(n) trước — rồi làm bản đối xứng cho min.'],
    ['For the max keep a deque of INDEXES whose temperatures decrease from front to back: before pushing i, pop from the back everything ≤ temps[i]; drop the front when its index leaves the window. The front is the max. Store indexes, not values — you need them to know when an element expires.', 'Cho max, giữ một deque CHỈ SỐ mà nhiệt độ giảm dần từ đầu về cuối: trước khi đẩy i, lấy ra từ cuối mọi phần tử ≤ temps[i]; bỏ phần tử đầu khi chỉ số của nó rời cửa sổ. Phần tử đầu là max. Lưu chỉ số, không lưu giá trị — cần chúng để biết khi nào phần tử hết hạn.'],
  ],
  loi: [
    ['Off-by-one when expiring: the window ending at i is <code>[i − k + 1, i]</code>, so the front must go when its index is <code>≤ i − k</code>. Using <code>&lt; i − k</code> silently computes windows of size k + 1.', 'Lệch một khi cho hết hạn: cửa sổ kết thúc ở i là <code>[i − k + 1, i]</code>, nên phần tử đầu phải ra khi chỉ số <code>≤ i − k</code>. Dùng <code>&lt; i − k</code> là âm thầm tính cửa sổ cỡ k + 1.'],
    ['<code>Math.max(...temps.slice(i, i + k))</code> per window: O(n·k) = 10¹⁰ for n = 2·10⁵, k = 10⁵ (and the spread can overflow the call stack).', '<code>Math.max(...temps.slice(i, i + k))</code> cho mỗi cửa sổ: O(n·k) = 10¹⁰ với n = 2·10⁵, k = 10⁵ (và spread còn có thể tràn call stack).'],
    ['Using <code>shift()</code> to drop the front on a deque of 10⁵ elements: depending on the engine each shift can cost O(length). A head index is always O(1).', 'Dùng <code>shift()</code> để bỏ phần tử đầu trên deque 10⁵ phần tử: tuỳ engine mỗi lần shift có thể tốn O(độ dài). Chỉ số head luôn O(1).'],
  ],
  gt: ['In the max deque an element is removed from the back as soon as a newer element is at least as warm — it can never be the maximum of any window that still contains the newer one. What remains is decreasing, so the front is the max of the current window once expired fronts are dropped. The min deque is the mirror image. Every index enters and leaves each deque at most once ⇒ O(n) total no matter how large k is, O(k) live memory. The brute force recomputes every window: O(n·k).', 'Trong deque max, một phần tử bị lấy ra từ cuối ngay khi có phần tử mới hơn ấm ít nhất bằng nó — nó không bao giờ còn là max của cửa sổ nào vẫn chứa phần tử mới. Phần còn lại giảm dần, nên phần tử đầu là max của cửa sổ hiện tại sau khi bỏ những phần tử đầu đã hết hạn. Deque min là bản đối xứng. Mỗi chỉ số vào và ra mỗi deque tối đa một lần ⇒ tổng O(n) bất kể k lớn bao nhiêu, O(k) bộ nhớ đang dùng. Vét cạn tính lại từng cửa sổ: O(n·k).'],
  kn: ['monotonic deque', 'sliding window maximum/minimum'],
  tns: [tn('deque (double-ended queue)', 'hàng đợi hai đầu'), tn('monotonic deque', 'deque đơn điệu', 'giá trị luôn tăng hoặc giảm từ đầu về cuối.'), tn('expire', 'hết hạn (rời cửa sổ)'), tn('swing / range', 'biên độ (max − min)')],
  dau: `/**
 * temps: number[], k: number
 * returns max - min of every window of k consecutive values
 */
function windowSwing(temps, k) {
  // Write your solution here
  return [];
}
`,
  giai: '// Reference solution — two monotonic deques of indexes (max: decreasing, min: increasing), O(n).\n' + nguon(windowSwing),
  cases: [
    { args: [[250, 262, 241, 270, 255, 258], 3], moTa: ['Windows of 3 minutes', 'Cửa sổ 3 phút'] },
    { args: [[5, 5, 5, 5], 2], moTa: ['Constant temperature ⇒ swing 0', 'Nhiệt độ không đổi ⇒ biên độ 0'] },
    { args: [[1, 2, 3], 5], moTa: ['k > n ⇒ []', 'k > n ⇒ []'] },
    { args: [[], 1], an: true },
    { args: [[7, -3, 4], 1], an: true, moTa: ['k = 1 ⇒ every swing is 0', 'k = 1 ⇒ mọi biên độ là 0'] },
    { args: [[1, 9, 2, 8, 3, 7, 4, 6, 5], 4], an: true },
    { args: [[10, 1, 1, 1, 1, 10], 3], an: true, moTa: ['The old max must expire on time', 'Max cũ phải hết hạn đúng lúc'] },
    { args: [[-5, -1, -9, -2], 4], an: true },
  ],
  perf: [{
    moTa: ['Performance: n = 200 000, k = 100 000 (recomputing each window is O(n·k) = 10¹⁰)', 'Hiệu năng: n = 200 000, k = 100 000 (tính lại từng cửa sổ là O(n·k) = 10¹⁰)'],
    than: 'var n = 200000, a = new Array(n), x = 0; for (var i = 0; i < n; i++) { x += R(21) - 10; a[i] = x; } var r = windowSwing(a, 100000), s = 0, m = 0; for (var j = 0; j < r.length; j++) { s += r[j]; if (r[j] > m) m = r[j]; } return { windows: r.length, sum: s, maxSwing: m, first: r[0], last: r[r.length - 1] };',
  }],
  saiMau: [
    { ten: ['O(n·k): recompute max and min of every window', 'O(n·k): tính lại max và min từng cửa sổ'], chiHieuNang: true, ma: 'function windowSwing(temps, k) {\n  var out = [];\n  for (var i = 0; i + k <= temps.length; i++) { var a = temps[i], b = temps[i]; for (var j = i; j < i + k; j++) { if (temps[j] > a) a = temps[j]; if (temps[j] < b) b = temps[j]; } out.push(a - b); }\n  return out;\n}\n' },
    { ten: ['Expires with < i − k (windows of size k + 1)', 'Hết hạn với < i − k (cửa sổ cỡ k + 1)'], ma: 'function windowSwing(temps, k) {\n  var out = [], mx = [], mn = [], hx = 0, hn = 0;\n  if (k > temps.length) return out;\n  for (var i = 0; i < temps.length; i++) {\n    while (mx.length > hx && temps[mx[mx.length - 1]] <= temps[i]) mx.pop(); mx.push(i);\n    while (mn.length > hn && temps[mn[mn.length - 1]] >= temps[i]) mn.pop(); mn.push(i);\n    if (mx[hx] < i - k) hx++; if (mn[hn] < i - k) hn++;\n    if (i >= k - 1) out.push(temps[mx[hx]] - temps[mn[hn]]);\n  }\n  return out;\n}\n' },
  ],
});

export default mod('dsa-3-2-queue', '3.2 Queue & deque: rate limits, round-robin, window extremes', [D1, D2, D3]);
