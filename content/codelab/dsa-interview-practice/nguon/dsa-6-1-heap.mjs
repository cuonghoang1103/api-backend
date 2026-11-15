/** Coding Interview Prep · 6.1 — Heap / hàng đợi ưu tiên tự viết: k nhỏ nhất, gộp tệp chi phí nhỏ nhất (tham lam + heap), mô phỏng quầy hỗ trợ theo ưu tiên. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/** Heap nhị phân 25 dòng (như bài 6.1) — `before(a, b)` = a phải ra TRƯỚC b. Ghép vào đầu mỗi lời giải. */
const HEAP = `// A binary heap: before(a, b) === true means a must come out before b.
class Heap {
  constructor(before) { this.a = []; this.before = before; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {                       // sift up: swap with the parent while we beat it
      const p = (i - 1) >> 1;
      if (!this.before(a[i], a[p])) break;
      [a[i], a[p]] = [a[p], a[i]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {                          // sift down: swap with the better child while it beats us
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < a.length && this.before(a[l], a[m])) m = l;
        if (r < a.length && this.before(a[r], a[m])) m = r;
        if (m === i) break;
        [a[i], a[m]] = [a[m], a[i]]; i = m;
      }
    }
    return top;
  }
}
`;
const GHI_HEAP = {
  en: '<p><b>Note:</b> JavaScript has no built-in priority queue. Write a small binary heap yourself (the 25-line one from lesson 6.1 is enough) — or any other approach that meets the complexity target.</p>',
  vi: '<p><b>Lưu ý:</b> JavaScript không có sẵn hàng đợi ưu tiên. Hãy tự viết một heap nhị phân nhỏ (bản 25 dòng của bài 6.1 là đủ) — hoặc cách khác bất kỳ đạt mục tiêu độ phức tạp.</p>',
};
const KHUNG_HEAP = `// JavaScript has no PriorityQueue: write a small heap here (push / pop / peek / size),
// e.g. class Heap { constructor(before) { ... } push(x) { ... } pop() { ... } }
`;

/* ── 1. k phần tử nhỏ nhất: heap LỚN cỡ k ── */
function fastestLaps(times, k) {
  // keep the k fastest seen so far in a MAX-heap: its top is the slowest of them, the one to evict
  const h = new Heap((a, b) => a > b);
  for (const t of times) {
    if (h.size() < k) h.push(t);
    else if (k > 0 && t < h.peek()) { h.pop(); h.push(t); }
  }
  const out = [];
  while (h.size()) out.push(h.pop()); // slowest first …
  return out.reverse();               // … so reverse for ascending order
}
const D1 = bai({
  ten: 'Go-kart club: the k fastest lap times', kho: 'EASY', phut: 15, ham: 'fastestLaps',
  en: `<p>The FPTU go-kart club logs every lap time (in milliseconds) of a race day in <code>times</code>. The leaderboard screen shows the <code>k</code> fastest laps, fastest first.</p>
<p>Write <code>fastestLaps(times, k)</code> returning the <code>k</code> smallest values in ascending order (duplicates are separate laps and are kept). If there are fewer than <code>k</code> laps, return them all, sorted. <b>Do not modify</b> <code>times</code> — the timing system still uses it.</p>${GHI_HEAP.en}`,
  vi: `<p>Câu lạc bộ go-kart FPTU ghi mọi thời gian vòng chạy (mili giây) của một ngày đua vào <code>times</code>. Màn hình bảng xếp hạng hiện <code>k</code> vòng nhanh nhất, nhanh nhất trước.</p>
<p>Viết <code>fastestLaps(times, k)</code> trả về <code>k</code> giá trị nhỏ nhất theo thứ tự tăng dần (giá trị trùng là các vòng khác nhau, giữ cả). Nếu ít hơn <code>k</code> vòng, trả hết, đã sắp. <b>Không sửa</b> <code>times</code> — hệ thống bấm giờ vẫn dùng nó.</p>${GHI_HEAP.vi}`,
  dauVao: ['times — array of positive integers; k — integer ≥ 0.', 'times — mảng số nguyên dương; k — số nguyên ≥ 0.'],
  dauRa: ['number[] — at most k values, ascending.', 'number[] — tối đa k giá trị, tăng dần.'],
  rangBuoc: [['0 ≤ times.length ≤ 2·10⁵; 0 ≤ k ≤ 2·10⁵; times[i] ≤ 10⁷.', '0 ≤ times.length ≤ 2·10⁵; 0 ≤ k ≤ 2·10⁵; times[i] ≤ 10⁷.'], ['Target: O(n log k) (a copy + numeric sort, O(n log n), is also accepted).', 'Mục tiêu: O(n log k) (sao chép + sắp theo số, O(n log n), cũng được chấp nhận).']],
  goiY: [
    ['Keep only the best k candidates. Which one is the first to be pushed out when a faster lap arrives? The SLOWEST of them — so you want fast access to the maximum.', 'Chỉ giữ k ứng viên tốt nhất. Khi có vòng nhanh hơn tới, ai bị đẩy ra trước? Vòng CHẬM NHẤT trong số đó — nên cần lấy nhanh phần tử lớn nhất.'],
    ['A max-heap of size k: push while size &lt; k; afterwards, if the new time beats the top, pop the top and push the new one. At the end pop everything and reverse.', 'Heap lớn (max-heap) cỡ k: đẩy vào khi size &lt; k; sau đó, nếu thời gian mới tốt hơn đỉnh thì bỏ đỉnh và đẩy cái mới vào. Cuối cùng lấy hết ra rồi đảo ngược.'],
  ],
  loi: [
    ['<code>times.sort()</code> with no comparator sorts as STRINGS (<code>10000</code> before <code>9000</code>) and sorts the input in place.', '<code>times.sort()</code> không comparator sắp như CHUỖI (<code>10000</code> trước <code>9000</code>) và sắp luôn mảng đầu vào.'],
    ['Finding and removing the minimum k times with a linear scan + <code>splice</code>: O(n·k) ⇒ times out with k = 10⁵.', 'Tìm và xoá phần tử nhỏ nhất k lần bằng quét tuyến tính + <code>splice</code>: O(n·k) ⇒ hết giờ khi k = 10⁵.'],
    ['Using a MIN-heap of size k: its top is the fastest lap, the one you must keep.', 'Dùng heap NHỎ cỡ k: đỉnh là vòng nhanh nhất — đúng cái phải giữ lại.'],
  ],
  gt: ['The max-heap always holds the k fastest laps seen so far, with the slowest of them on top, so deciding whether a new lap enters costs one comparison and at most one pop + push, O(log k). Total O(n log k) time and O(k) memory; the final drain is O(k log k). A copy followed by <code>sort((a, b) =&gt; a - b)</code> is O(n log n) and also fine here — what fails is the O(n·k) repeated minimum.', 'Heap lớn luôn giữ k vòng nhanh nhất đã gặp, vòng chậm nhất trong đó nằm ở đỉnh, nên quyết định một vòng mới có vào hay không tốn một phép so và tối đa một pop + push, O(log k). Tổng O(n log k) thời gian, O(k) bộ nhớ; lấy hết ở cuối O(k log k). Sao chép rồi <code>sort((a, b) =&gt; a - b)</code> là O(n log n) cũng ổn ở đây — thứ trượt là O(n·k) tìm nhỏ nhất lặp lại.'],
  kn: ['heap', 'top-k'],
  tns: [tn('max-heap', 'heap lớn (đỉnh là phần tử lớn nhất)'), tn('top-k', 'k phần tử tốt nhất'), tn('evict', 'đẩy ra (loại khỏi tập giữ lại)')],
  dau: `${KHUNG_HEAP}
/**
 * times: number[] (lap times, ms), k: number
 * returns the k smallest times, ascending (times must not be modified)
 */
function fastestLaps(times, k) {
  // Write your solution here
  return times.slice(0, k);
}
`,
  giai: '// Reference solution — max-heap of size k (its top is the slowest lap kept).\n' + HEAP + '\n' + nguon(fastestLaps),
  cases: [
    { args: [[61200, 59800, 60500, 58900, 62000], 3], moTa: ['Three fastest of five', 'Ba vòng nhanh nhất trong năm'] },
    { args: [[9000, 10000, 9500, 8000], 2], moTa: ['Numbers, not strings: 8000, 9000', 'So theo số, không theo chuỗi: 8000, 9000'] },
    { args: [[70000, 65000], 5], moTa: ['Fewer laps than k', 'Ít vòng hơn k'] },
    { args: [[], 3], an: true },
    { args: [[5, 1, 4], 0], an: true, moTa: ['k = 0', 'k = 0'] },
    { args: [[7, 7, 3, 7, 3], 4], an: true, moTa: ['Duplicates are separate laps', 'Giá trị trùng là các vòng riêng'] },
    { goi: '(function () { var a = [900, 100, 500, 300]; fastestLaps(a, 2); return a; })()', an: true, moTa: ['The input array must be unchanged', 'Mảng đầu vào phải giữ nguyên'] },
  ],
  perf: [{
    moTa: ['Performance: 200 000 laps, k = 100 000 (repeated minimum search times out)', 'Hiệu năng: 200 000 vòng, k = 100 000 (tìm nhỏ nhất lặp lại thì hết giờ)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = 50000 + R(30000); var r = fastestLaps(a, 100000); var s = 0; for (var j = 0; j < r.length; j++) s += r[j]; return { len: r.length, first: r.slice(0, 3), last: r.slice(-3), sum: s };',
  }],
  saiMau: [
    { ten: ['O(n·k): find and splice the minimum k times', 'O(n·k): tìm rồi splice phần tử nhỏ nhất k lần'], chiHieuNang: true, ma: 'function fastestLaps(times, k) {\n  var a = times.slice(), out = [];\n  while (out.length < k && a.length) { var m = 0; for (var i = 1; i < a.length; i++) if (a[i] < a[m]) m = i; out.push(a[m]); a.splice(m, 1); }\n  return out;\n}\n' },
    { ten: ['times.sort() — string order, mutates the input', 'times.sort() — thứ tự chuỗi, sửa đầu vào'], ma: 'function fastestLaps(times, k) {\n  return times.sort().slice(0, k);\n}\n' },
  ],
});

/* ── 2. Tham lam + heap nhỏ: gộp tệp log với chi phí nhỏ nhất ── */
function mergeLogsCost(sizes) {
  const h = new Heap((a, b) => a < b); // min-heap: always merge the two smallest files
  for (const s of sizes) h.push(s);
  let cost = 0;
  while (h.size() > 1) {
    const merged = h.pop() + h.pop();
    cost += merged;   // reading both and writing the result costs their total size
    h.push(merged);   // the merged file goes BACK in: it may be small enough to be merged early again
  }
  return cost;
}
const D2 = bai({
  ten: 'Log rotation: merge all log files at minimum cost', kho: 'MEDIUM', phut: 20, ham: 'mergeLogsCost',
  en: `<p>Every night the server keeps one log file per service, with sizes <code>sizes</code> (MB). The archiver can only merge <b>two files at a time</b>, and merging files of sizes <code>a</code> and <code>b</code> costs <code>a + b</code> (it reads both and writes the result, which is a file of size <code>a + b</code>). Files can be merged in any order until one file is left.</p>
<p>Write <code>mergeLogsCost(sizes)</code> returning the minimum total cost. Zero or one file costs <code>0</code>.</p>${GHI_HEAP.en}`,
  vi: `<p>Mỗi đêm máy chủ giữ một tệp log cho mỗi dịch vụ, kích thước <code>sizes</code> (MB). Bộ lưu trữ chỉ gộp được <b>hai tệp một lúc</b>, và gộp hai tệp cỡ <code>a</code> và <code>b</code> tốn <code>a + b</code> (đọc cả hai và ghi kết quả là một tệp cỡ <code>a + b</code>). Có thể gộp theo thứ tự bất kỳ cho tới khi còn một tệp.</p>
<p>Viết <code>mergeLogsCost(sizes)</code> trả về tổng chi phí nhỏ nhất. Không tệp hoặc một tệp thì tốn <code>0</code>.</p>${GHI_HEAP.vi}`,
  dauVao: ['sizes — array of positive integers.', 'sizes — mảng số nguyên dương.'],
  dauRa: ['number — minimum total cost.', 'number — tổng chi phí nhỏ nhất.'],
  rangBuoc: [['0 ≤ sizes.length ≤ 10⁵; 1 ≤ sizes[i] ≤ 10⁴.', '0 ≤ sizes.length ≤ 10⁵; 1 ≤ sizes[i] ≤ 10⁴.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['A file\'s size is paid once for every merge it takes part in, so the largest files should be merged as few times as possible — i.e. as late as possible.', 'Kích thước một tệp bị trả lại mỗi lần nó tham gia một lần gộp, nên tệp to nên bị gộp càng ít lần càng tốt — tức là càng muộn càng tốt.'],
    ['Greedy: always merge the two smallest files currently available, and put the result back. "Repeatedly take the smallest two, insert one" = a min-heap.', 'Tham lam: luôn gộp hai tệp nhỏ nhất đang có, rồi bỏ kết quả trở lại. "Lặp lại: lấy hai cái nhỏ nhất, chèn một cái" = heap nhỏ (min-heap).'],
  ],
  loi: [
    ['Sorting once and merging left to right (running total): the merged file is not always among the two smallest — <code>[1, 1, 1, 1]</code> costs 9 that way, the optimum is 8.', 'Sắp một lần rồi gộp trái sang phải (cộng dồn): tệp vừa gộp không phải lúc nào cũng nằm trong hai tệp nhỏ nhất — <code>[1, 1, 1, 1]</code> theo cách đó tốn 9, tối ưu là 8.'],
    ['Re-sorting the whole array after every merge: correct, but O(n² log n) ⇒ the 10⁵-file check times out.', 'Sắp lại cả mảng sau mỗi lần gộp: đúng, nhưng O(n² log n) ⇒ kiểm 10⁵ tệp hết giờ.'],
  ],
  gt: ['This is Huffman\'s algorithm: the total cost equals Σ size × (number of merges the file is part of), and an exchange argument shows the two smallest files can always be merged first in some optimal plan. The heap makes each "take two smallest, insert one" O(log n): n − 1 rounds ⇒ O(n log n) time, O(n) memory. The answer can reach about 10⁴ × 10⁵ × 17 ≈ 1.7·10¹⁰ — fine for a JS number, <code>long</code> in Java.', 'Đây là thuật toán Huffman: tổng chi phí bằng Σ kích thước × (số lần gộp mà tệp tham gia), và lập luận hoán đổi cho thấy luôn có một phương án tối ưu gộp hai tệp nhỏ nhất trước. Heap làm mỗi lượt "lấy hai cái nhỏ nhất, chèn một" là O(log n): n − 1 lượt ⇒ O(n log n) thời gian, O(n) bộ nhớ. Đáp án có thể tới khoảng 10⁴ × 10⁵ × 17 ≈ 1,7·10¹⁰ — số JS chứa được, Java dùng <code>long</code>.'],
  kn: ['heap', 'greedy', 'Huffman'],
  tns: [tn('min-heap', 'heap nhỏ (đỉnh là phần tử nhỏ nhất)'), tn('greedy choice', 'lựa chọn tham lam'), tn('Huffman coding', 'mã Huffman', 'cùng thuật toán: gộp hai tần suất nhỏ nhất.')],
  dau: `${KHUNG_HEAP}
/**
 * sizes: number[] — file sizes (MB); merging a and b costs a + b and yields a file of size a + b
 * returns the minimum total cost to end with one file
 */
function mergeLogsCost(sizes) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — Huffman greedy with a min-heap: always merge the two smallest.\n' + HEAP + '\n' + nguon(mergeLogsCost),
  cases: [
    { args: [[4, 3, 2, 6]], moTa: ['2+3=5, 4+5=9, 6+9=15 ⇒ 29', '2+3=5, 4+5=9, 6+9=15 ⇒ 29'] },
    { args: [[1, 1, 1, 1]], moTa: ['(1+1) + (1+1) + (2+2) = 8, not 9', '(1+1) + (1+1) + (2+2) = 8, không phải 9'] },
    { args: [[42]] },
    { args: [[]], an: true },
    { args: [[5, 5]], an: true },
    { args: [[10, 1, 1, 1, 1, 1]], an: true },
    { args: [[20, 4, 8, 2, 1, 7, 3, 9]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 files (re-sorting after every merge times out)', 'Hiệu năng: 100 000 tệp (sắp lại sau mỗi lần gộp thì hết giờ)'],
    than: 'var n = 100000, a = new Array(n); for (var i = 0; i < n; i++) a[i] = 1 + R(10000); return mergeLogsCost(a);',
  }],
  saiMau: [
    { ten: ['O(n² log n): re-sort the array after every merge', 'O(n² log n): sắp lại mảng sau mỗi lần gộp'], chiHieuNang: true, ma: 'function mergeLogsCost(sizes) {\n  var a = sizes.slice(), c = 0;\n  while (a.length > 1) { a.sort(function (x, y) { return x - y; }); var m = a.shift() + a.shift(); c += m; a.push(m); }\n  return c;\n}\n' },
    { ten: ['Sort once, merge left to right', 'Sắp một lần, gộp trái sang phải'], ma: 'function mergeLogsCost(sizes) {\n  var a = sizes.slice().sort(function (x, y) { return x - y; }), c = 0, run = a[0] || 0;\n  for (var i = 1; i < a.length; i++) { run += a[i]; c += run; }\n  return c;\n}\n' },
  ],
});

/* ── 3. Mô phỏng theo thời gian + heap theo nhiều tiêu chí ── */
function helpDeskOrder(tickets) {
  const byArrival = tickets.slice().sort((a, b) => a.arrive - b.arrive || a.id - b.id); // copy: do not touch the input
  // most urgent first; ties: earlier arrival, then smaller id
  const h = new Heap((a, b) => a.priority !== b.priority ? a.priority > b.priority
    : a.arrive !== b.arrive ? a.arrive < b.arrive : a.id < b.id);
  const out = [];
  let t = 0, i = 0;
  while (out.length < tickets.length) {
    if (h.size() === 0 && t < byArrival[i].arrive) t = byArrival[i].arrive; // idle: jump to the next arrival
    while (i < byArrival.length && byArrival[i].arrive <= t) h.push(byArrival[i++]); // everyone who is waiting now
    const job = h.pop();
    out.push(job.id);
    t += job.minutes; // nobody is interrupted: the agent finishes the ticket first
  }
  return out;
}
const D3 = bai({
  ten: 'IT help desk: the order tickets get served', kho: 'HARD', phut: 30, ham: 'helpDeskOrder',
  en: `<p>The campus IT help desk has <b>one</b> agent. Each ticket is <code>{ id, arrive, minutes, priority }</code>: it shows up at minute <code>arrive</code>, takes <code>minutes</code> to handle, and a larger <code>priority</code> is more urgent. Whenever the agent is free, they take the waiting ticket with the <b>highest priority</b>; ties go to the earlier <code>arrive</code>, then to the smaller <code>id</code>. A ticket that is being handled is never interrupted. If nobody is waiting, the agent waits for the next arrival. A ticket arriving exactly when the agent becomes free is already waiting.</p>
<p>Write <code>helpDeskOrder(tickets)</code> returning the ids in the order they are served. The input may be in any order and must not be modified.</p>${GHI_HEAP.en}`,
  vi: `<p>Quầy hỗ trợ IT của trường có <b>một</b> nhân viên. Mỗi phiếu là <code>{ id, arrive, minutes, priority }</code>: tới ở phút <code>arrive</code>, xử lý mất <code>minutes</code> phút, <code>priority</code> lớn hơn là gấp hơn. Mỗi khi rảnh, nhân viên lấy phiếu đang chờ có <b>độ ưu tiên cao nhất</b>; hoà thì phiếu tới sớm hơn trước, rồi tới <code>id</code> nhỏ hơn. Phiếu đang xử lý không bao giờ bị ngắt. Không ai chờ thì nhân viên đợi phiếu kế tiếp tới. Phiếu tới đúng lúc nhân viên vừa rảnh coi như đã đang chờ.</p>
<p>Viết <code>helpDeskOrder(tickets)</code> trả về các id theo thứ tự được phục vụ. Đầu vào có thể ở thứ tự bất kỳ và không được sửa.</p>${GHI_HEAP.vi}`,
  dauVao: ['tickets — array of { id, arrive, minutes, priority } (integers, ids distinct, minutes ≥ 1).', 'tickets — mảng { id, arrive, minutes, priority } (số nguyên, id khác nhau, minutes ≥ 1).'],
  dauRa: ['number[] — ids in serving order.', 'number[] — các id theo thứ tự phục vụ.'],
  rangBuoc: [['0 ≤ tickets.length ≤ 10⁵; 0 ≤ arrive ≤ 10⁹.', '0 ≤ tickets.length ≤ 10⁵; 0 ≤ arrive ≤ 10⁹.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['Two orders are involved: tickets ENTER the waiting room by arrival time (sort once), and LEAVE it by priority (a heap with a three-level comparator).', 'Có hai thứ tự: phiếu VÀO phòng chờ theo thời gian tới (sắp một lần), và RA khỏi phòng chờ theo ưu tiên (heap với comparator ba tầng).'],
    ['Loop: if the heap is empty, jump the clock to the next arrival; push every ticket with <code>arrive ≤ t</code>; pop the best, record it, advance <code>t</code> by its minutes.', 'Vòng lặp: nếu heap rỗng, nhảy đồng hồ tới lần tới kế tiếp; đẩy mọi phiếu có <code>arrive ≤ t</code>; lấy phiếu tốt nhất, ghi lại, tăng <code>t</code> thêm số phút của nó.'],
  ],
  loi: [
    ['Scanning the whole waiting list for the best ticket each time: O(n²) when many tickets wait — the 10⁵-ticket check times out.', 'Quét cả danh sách chờ để tìm phiếu tốt nhất mỗi lần: O(n²) khi nhiều phiếu cùng chờ — kiểm 10⁵ phiếu hết giờ.'],
    ['Advancing the clock by 1 minute when idle: arrivals can be 10⁹ minutes apart. Jump straight to the next arrival.', 'Tăng đồng hồ từng phút khi rảnh: hai lần tới có thể cách nhau 10⁹ phút. Hãy nhảy thẳng tới lần tới kế tiếp.'],
    ['Pushing only tickets with <code>arrive &lt; t</code>: a ticket arriving exactly at <code>t</code> is already waiting.', 'Chỉ đẩy phiếu có <code>arrive &lt; t</code>: phiếu tới đúng phút <code>t</code> đã đang chờ.'],
  ],
  gt: ['Sorting by arrival lets a single pointer feed the waiting room in time order; the heap answers "most urgent waiting ticket" in O(log n) with the three-level tie-break written into its comparator. Each ticket is pushed and popped once ⇒ O(n log n) total (sort + heap), O(n) memory. Jumping the clock when the heap is empty keeps the loop independent of the size of the time values.', 'Sắp theo thời gian tới cho phép một con trỏ đưa phiếu vào phòng chờ đúng thứ tự thời gian; heap trả lời "phiếu chờ gấp nhất" trong O(log n) với luật hoà ba tầng viết trong comparator. Mỗi phiếu vào và ra heap một lần ⇒ tổng O(n log n) (sắp + heap), O(n) bộ nhớ. Nhảy đồng hồ khi heap rỗng giữ vòng lặp không phụ thuộc vào độ lớn của mốc thời gian.'],
  kn: ['heap', 'event simulation'],
  tns: [tn('priority queue', 'hàng đợi ưu tiên'), tn('tie-break', 'luật phân xử khi hoà'), tn('simulation', 'mô phỏng'), tn('non-preemptive', 'không ngắt ngang', 'việc đang làm không bị việc gấp hơn chen vào.')],
  dau: `${KHUNG_HEAP}
/**
 * tickets: { id, arrive, minutes, priority }[] — one agent, non-preemptive
 * returns ids in serving order (highest priority first; ties: earlier arrive, then smaller id)
 */
function helpDeskOrder(tickets) {
  // Write your solution here
  return tickets.map(t => t.id);
}
`,
  giai: '// Reference solution — sort by arrival once, a heap of waiting tickets ordered by (priority, arrive, id).\n' + HEAP + '\n' + nguon(helpDeskOrder),
  cases: [
    { args: [[{ id: 1, arrive: 0, minutes: 10, priority: 1 }, { id: 2, arrive: 2, minutes: 5, priority: 1 }, { id: 3, arrive: 3, minutes: 4, priority: 5 }]], moTa: ['Ticket 1 is not interrupted; then urgent 3 jumps ahead of 2', 'Phiếu 1 không bị ngắt; rồi phiếu gấp 3 chen trước 2'] },
    { args: [[{ id: 7, arrive: 100, minutes: 1, priority: 0 }, { id: 4, arrive: 0, minutes: 3, priority: 2 }]], moTa: ['Idle gap: jump to minute 100', 'Thời gian rảnh: nhảy tới phút 100'] },
    { args: [[]] },
    { args: [[{ id: 5, arrive: 0, minutes: 2, priority: 3 }, { id: 2, arrive: 0, minutes: 2, priority: 3 }, { id: 9, arrive: 1, minutes: 2, priority: 3 }]], an: true, moTa: ['Ties: arrival, then id', 'Hoà: theo giờ tới, rồi id'] },
    { args: [[{ id: 1, arrive: 0, minutes: 5, priority: 0 }, { id: 2, arrive: 5, minutes: 1, priority: 9 }, { id: 3, arrive: 4, minutes: 1, priority: 1 }]], an: true, moTa: ['Arriving exactly when the agent frees up counts as waiting', 'Tới đúng lúc nhân viên rảnh coi như đang chờ'] },
    { args: [[{ id: 3, arrive: 1000000000, minutes: 1, priority: 1 }, { id: 1, arrive: 0, minutes: 1, priority: 1 }, { id: 2, arrive: 500000000, minutes: 1, priority: 1 }]], an: true, moTa: ['Huge gaps between arrivals', 'Các lần tới cách nhau rất xa'] },
    { args: [[{ id: 1, arrive: 0, minutes: 4, priority: 1 }, { id: 2, arrive: 1, minutes: 1, priority: 2 }, { id: 3, arrive: 1, minutes: 1, priority: 3 }, { id: 4, arrive: 6, minutes: 1, priority: 0 }, { id: 5, arrive: 2, minutes: 9, priority: 0 }]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 tickets in the first 1000 minutes — thousands wait at once (a linear scan per pick times out)', 'Hiệu năng: 100 000 phiếu trong 1000 phút đầu — hàng nghìn phiếu cùng chờ (quét tuyến tính mỗi lần chọn thì hết giờ)'],
    than: 'var n = 100000, a = []; for (var i = 0; i < n; i++) a.push({ id: i, arrive: R(1000), minutes: 1 + R(5), priority: R(5) }); var r = helpDeskOrder(a); var h = 0; for (var j = 0; j < r.length; j++) h = (h * 31 + r[j]) % 1000000007; return { count: r.length, first: r.slice(0, 5), last: r.slice(-5), hash: h };',
  }],
  saiMau: [
    { ten: ['O(n²): scan + splice the waiting list each time', 'O(n²): quét + splice danh sách chờ mỗi lần'], chiHieuNang: true, ma: 'function helpDeskOrder(tickets) {\n  var arr = tickets.slice().sort(function (a, b) { return a.arrive - b.arrive || a.id - b.id; });\n  var wait = [], out = [], t = 0, i = 0;\n  while (out.length < tickets.length) {\n    if (!wait.length && t < arr[i].arrive) t = arr[i].arrive;\n    while (i < arr.length && arr[i].arrive <= t) wait.push(arr[i++]);\n    var b = 0;\n    for (var j = 1; j < wait.length; j++) { var x = wait[j], y = wait[b]; if (x.priority > y.priority || (x.priority === y.priority && (x.arrive < y.arrive || (x.arrive === y.arrive && x.id < y.id)))) b = j; }\n    var job = wait.splice(b, 1)[0]; out.push(job.id); t += job.minutes;\n  }\n  return out;\n}\n' },
    { ten: ['Only tickets with arrive < t are waiting', 'Chỉ phiếu có arrive < t mới tính là đang chờ'], ma: 'function helpDeskOrder(tickets) {\n  var arr = tickets.slice().sort(function (a, b) { return a.arrive - b.arrive || a.id - b.id; });\n  var wait = [], out = [], t = 0, i = 0;\n  while (out.length < tickets.length) {\n    if (!wait.length && t <= arr[i].arrive) { t = arr[i].arrive; wait.push(arr[i++]); }\n    while (i < arr.length && arr[i].arrive < t) wait.push(arr[i++]);\n    wait.sort(function (x, y) { return y.priority - x.priority || x.arrive - y.arrive || x.id - y.id; });\n    var job = wait.shift(); out.push(job.id); t += job.minutes;\n  }\n  return out;\n}\n' },
  ],
});

export default mod('dsa-6-1-heap', '6.1 Heaps and priority queues: top-k, greedy merging, scheduling', [D1, D2, D3]);
