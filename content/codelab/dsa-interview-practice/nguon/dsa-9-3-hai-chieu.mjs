/** Coding Interview Prep · 9.3 — Quy hoạch động hai chiều: n × màu, chuỗi con liên tiếp chung, cái túi 0/1, diff dòng từ bảng LCS. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Bảng n × 3: tô màu gian hàng, hai gian liền kề khác màu ── */
function boothColors(costs) {
  // best[c] = cheapest way to paint booths 0..i with booth i in colour c — one row of the n × 3 table
  var best = [0, 0, 0];
  for (var i = 0; i < costs.length; i++) {
    var b = best;
    best = [
      costs[i][0] + Math.min(b[1], b[2]), // booth i red ⇒ booth i-1 green or blue
      costs[i][1] + Math.min(b[0], b[2]),
      costs[i][2] + Math.min(b[0], b[1]),
    ];
  }
  return Math.min(best[0], best[1], best[2]); // for 0 booths every entry is 0
}
const Q1 = bai({
  ten: 'Job fair: colour the booths, neighbours must differ', kho: 'EASY', phut: 15, ham: 'boothColors',
  en: `<p>At the FPT job fair the booths stand in one long row. Each booth gets a banner in one of three colours — red, green or blue — and two <b>adjacent</b> booths must not have the same colour, so visitors can tell companies apart. Printing prices differ per booth (sizes differ): <code>costs[i] = [red, green, blue]</code> in thousand VND.</p>
<p>Write <code>boothColors(costs)</code> returning the minimum total printing cost. With no booths the cost is 0.</p>`,
  vi: `<p>Ở ngày hội việc làm FPT, các gian hàng xếp thành một hàng dài. Mỗi gian nhận một băng rôn màu đỏ, xanh lá hoặc xanh dương, và hai gian <b>liền kề</b> không được cùng màu để khách dễ phân biệt công ty. Giá in khác nhau theo gian (kích thước khác nhau): <code>costs[i] = [đỏ, xanh lá, xanh dương]</code> tính bằng nghìn đồng.</p>
<p>Viết <code>boothColors(costs)</code> trả về tổng chi phí in nhỏ nhất. Không có gian nào thì chi phí là 0.</p>`,
  dauVao: ['costs — array of [red, green, blue] non-negative integers.', 'costs — mảng [đỏ, xanh lá, xanh dương] số nguyên không âm.'],
  dauRa: ['A number — the minimum total cost.', 'Một số — tổng chi phí nhỏ nhất.'],
  rangBuoc: [['0 ≤ costs.length ≤ 100 000; 0 ≤ costs[i][c] ≤ 10⁴.', '0 ≤ costs.length ≤ 100 000; 0 ≤ costs[i][c] ≤ 10⁴.'], ['Target: O(n · 3) time, O(1) extra memory.', 'Mục tiêu: O(n · 3) thời gian, O(1) bộ nhớ phụ.']],
  goiY: [
    ['Picking the cheapest colour for each booth greedily breaks the rule or misses cheaper combinations. The decision for booth i depends on the colour of booth i − 1 — make that colour part of the state.', 'Chọn màu rẻ nhất cho từng gian theo kiểu tham lam sẽ phạm luật hoặc bỏ sót tổ hợp rẻ hơn. Quyết định ở gian i phụ thuộc màu gian i − 1 — đưa màu đó vào trạng thái.'],
    ['<code>dp[i][c]</code> = cheapest cost of booths 0..i with booth i in colour c = <code>costs[i][c] + min(dp[i−1][other two colours])</code>. Keep one row.', '<code>dp[i][c]</code> = chi phí rẻ nhất cho gian 0..i khi gian i màu c = <code>costs[i][c] + min(dp[i−1][hai màu còn lại])</code>. Chỉ giữ một hàng.'],
  ],
  loi: [
    ['Greedy "cheapest colour different from the previous booth": <code>[[1, 5, 9], [1, 100, 100]]</code> forces 1 + 100 instead of 5 + 1.', 'Tham lam "màu rẻ nhất khác gian trước": <code>[[1, 5, 9], [1, 100, 100]]</code> buộc 1 + 100 thay vì 5 + 1.'],
    ['Trying all 3 · 2ⁿ⁻¹ colourings recursively: fine for 10 booths, hopeless for 100 000.', 'Thử đệ quy cả 3 · 2ⁿ⁻¹ cách tô: ổn với 10 gian, vô vọng với 100 000.'],
    ['Overwriting the row while computing it (<code>best[1]</code> then reads the new <code>best[0]</code>).', 'Ghi đè hàng trong lúc đang tính (<code>best[1]</code> đọc nhầm <code>best[0]</code> mới).'],
  ],
  gt: ['The table has n rows and 3 columns; cell (i, c) depends only on the two other cells of row i − 1, because the only constraint linking booth i to the past is the colour of booth i − 1. Taking the minimum of the last row covers every valid colouring exactly once ⇒ exact answer. Work: 3 cells per booth, each O(1) ⇒ O(n) time; one row ⇒ O(1) memory. The empty input falls out naturally: the initial row [0, 0, 0] is never updated.', 'Bảng có n hàng và 3 cột; ô (i, c) chỉ phụ thuộc hai ô còn lại của hàng i − 1, vì ràng buộc duy nhất nối gian i với quá khứ là màu của gian i − 1. Lấy min của hàng cuối phủ mọi cách tô hợp lệ đúng một lần ⇒ đáp án chính xác. Khối lượng: 3 ô mỗi gian, mỗi ô O(1) ⇒ O(n) thời gian; một hàng ⇒ O(1) bộ nhớ. Đầu vào rỗng tự đúng: hàng đầu [0, 0, 0] không bị cập nhật lần nào.'],
  kn: ['2D DP (n × k)', 'rolling row'],
  tns: [tn('adjacent', 'liền kề'), tn('rolling row', 'hàng cuốn', 'chỉ giữ hàng trước của bảng.'), tn('greedy', 'tham lam')],
  dau: `/**
 * costs: [red, green, blue][] — printing cost of each booth in each colour
 * returns the minimum total cost so that adjacent booths have different colours
 */
function boothColors(costs) {
  // Write your solution here
  var total = 0;
  for (var i = 0; i < costs.length; i++) total += Math.min(costs[i][0], costs[i][1], costs[i][2]);
  return total;
}
`,
  giai: '// Reference solution — n × 3 table, one rolling row: dp[i][c] = costs[i][c] + min(dp[i-1][other colours]).\n' + nguon(boothColors),
  cases: [
    { args: [[[17, 2, 17], [16, 16, 5], [14, 3, 19]]], moTa: ['green, blue, green ⇒ 10', 'xanh lá, xanh dương, xanh lá ⇒ 10'] },
    { args: [[[1, 5, 9], [1, 100, 100]]], moTa: ['Greedy trap ⇒ 6', 'Bẫy tham lam ⇒ 6'] },
    { args: [[]], moTa: ['No booths ⇒ 0', 'Không có gian ⇒ 0'] },
    { args: [[[7, 3, 8]]], an: true },
    { args: [[[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]]], an: true },
    { args: [[[5, 8, 6], [19, 14, 13], [7, 5, 12], [14, 15, 17], [3, 20, 10]]], an: true },
    { args: [[[0, 10, 10], [0, 10, 10], [0, 10, 10], [0, 10, 10], [0, 10, 10], [0, 10, 10]]], an: true, moTa: ['Red is free but cannot be used twice in a row', 'Đỏ miễn phí nhưng không được dùng hai gian liền'] },
  ],
  perf: [{
    moTa: ['Performance: 100 000 booths (trying every colouring is exponential)', 'Hiệu năng: 100 000 gian (thử mọi cách tô là hàm mũ)'],
    than: 'var n = 100000, c = new Array(n); for (var i = 0; i < n; i++) c[i] = [R(10001), R(10001), R(10001)]; return boothColors(c);',
  }],
  saiMau: [
    { ten: ['Try every colouring recursively', 'Thử đệ quy mọi cách tô'], chiHieuNang: true, ma: 'function boothColors(costs) {\n  function f(i, prev) {\n    if (i === costs.length) return 0;\n    var best = Infinity;\n    for (var c = 0; c < 3; c++) if (c !== prev) best = Math.min(best, costs[i][c] + f(i + 1, c));\n    return best;\n  }\n  return f(0, -1);\n}\n' },
    { ten: ['Greedy: cheapest colour different from the previous booth', 'Tham lam: màu rẻ nhất khác gian trước'], ma: 'function boothColors(costs) {\n  var prev = -1, s = 0;\n  for (var row of costs) { var b = -1; for (var c = 0; c < 3; c++) if (c !== prev && (b < 0 || row[c] < row[b])) b = c; s += row[b]; prev = b; }\n  return s;\n}\n' },
  ],
});

/* ── 2. Chuỗi con LIÊN TIẾP chung dài nhất ── */
function longestCommonStreak(a, b) {
  // cur[j] = length of the common run ENDING at a[i-1] and b[j-1]; a run breaks on any mismatch, so it is 0 there
  var prev = new Int32Array(b.length + 1), cur = new Int32Array(b.length + 1), best = 0;
  for (var i = 1; i <= a.length; i++) {
    for (var j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : 0;
      if (cur[j] > best) best = cur[j];
    }
    var t = prev; prev = cur; cur = t; // swap rows (cur[0] stays 0)
  }
  return best;
}
const Q2 = bai({
  ten: 'Two request logs: the longest identical stretch', kho: 'MEDIUM', phut: 20, ham: 'longestCommonStreak',
  en: `<p>An on-call engineer suspects that two servers replayed the same traffic. <code>a</code> and <code>b</code> are their request logs, each entry an endpoint code (a number). Write <code>longestCommonStreak(a, b)</code> returning the length of the longest <b>contiguous</b> run of entries that appears in both logs, in the same order and without gaps.</p>
<p>This is not the longest common <i>subsequence</i>: <code>[1, 2, 3]</code> and <code>[1, 9, 2, 3]</code> share the subsequence 1, 2, 3, but the longest common contiguous run is <code>[2, 3]</code> ⇒ 2.</p>`,
  vi: `<p>Một kỹ sư trực sự cố nghi hai máy chủ đã phát lại cùng một luồng truy cập. <code>a</code> và <code>b</code> là log request của chúng, mỗi mục là mã endpoint (một số). Viết <code>longestCommonStreak(a, b)</code> trả về độ dài đoạn <b>liên tiếp</b> dài nhất xuất hiện trong cả hai log, cùng thứ tự và không có khoảng hở.</p>
<p>Đây không phải dãy con chung dài nhất (<i>subsequence</i>): <code>[1, 2, 3]</code> và <code>[1, 9, 2, 3]</code> có chung dãy con 1, 2, 3, nhưng đoạn liên tiếp chung dài nhất là <code>[2, 3]</code> ⇒ 2.</p>`,
  dauVao: ['a, b — arrays of integers.', 'a, b — mảng số nguyên.'],
  dauRa: ['A number — the length of the longest common contiguous run (0 if none).', 'Một số — độ dài đoạn liên tiếp chung dài nhất (0 nếu không có).'],
  rangBuoc: [['0 ≤ a.length, b.length ≤ 3 000.', '0 ≤ a.length, b.length ≤ 3 000.'], ['Target: O(|a| · |b|) time, O(|b|) memory.', 'Mục tiêu: O(|a| · |b|) thời gian, O(|b|) bộ nhớ.']],
  goiY: [
    ['Fix where the run ENDS: at <code>a[i−1]</code> and <code>b[j−1]</code>. Its length is 0 if those differ, otherwise 1 + the run ending one step earlier in both.', 'Cố định nơi đoạn KẾT THÚC: tại <code>a[i−1]</code> và <code>b[j−1]</code>. Độ dài là 0 nếu hai phần tử khác nhau, ngược lại 1 + đoạn kết thúc sớm hơn một bước ở cả hai.'],
    ['So <code>dp[i][j] = a[i−1] === b[j−1] ? dp[i−1][j−1] + 1 : 0</code>, and the answer is the maximum over the whole table (not the last cell). Two rows are enough.', 'Vậy <code>dp[i][j] = a[i−1] === b[j−1] ? dp[i−1][j−1] + 1 : 0</code>, và đáp án là giá trị lớn nhất trên cả bảng (không phải ô cuối). Hai hàng là đủ.'],
  ],
  loi: [
    ['Using the LCS recurrence <code>max(dp[i−1][j], dp[i][j−1])</code> on a mismatch: that allows gaps and answers the subsequence question.', 'Dùng công thức LCS <code>max(dp[i−1][j], dp[i][j−1])</code> khi khác nhau: công thức đó cho phép khoảng hở và trả lời câu hỏi dãy con.'],
    ['Returning <code>dp[n][m]</code>: the longest run can end anywhere, not necessarily at the last entries.', 'Trả <code>dp[n][m]</code>: đoạn dài nhất có thể kết thúc ở bất kỳ đâu, không nhất thiết ở mục cuối.'],
    ['Brute force — for every pair of start positions extend while equal: O(n · m · L), which is about 9·10⁹ steps when both logs are almost the same.', 'Vét cạn — với mỗi cặp vị trí bắt đầu kéo dài khi còn bằng nhau: O(n · m · L), tức khoảng 9·10⁹ bước khi hai log gần giống hệt nhau.'],
  ],
  gt: ['Every common run ends at some pair (i, j), and dp[i][j] is exactly the longest run ending there — a mismatch resets it to 0, which is what forbids gaps. Taking the maximum over all cells therefore gives the answer. Each of the n · m cells is O(1) ⇒ 9·10⁶ steps for 3 000 × 3 000; row i only reads row i − 1, so two typed arrays of length m + 1 suffice. The brute force repeats the same comparisons for every starting pair along a diagonal, which is the work the table shares.', 'Mọi đoạn chung đều kết thúc ở một cặp (i, j), và dp[i][j] đúng là đoạn dài nhất kết thúc ở đó — khác nhau thì đặt lại 0, chính điều này cấm khoảng hở. Lấy max trên mọi ô vì vậy cho đáp án. Mỗi ô trong n · m ô tốn O(1) ⇒ 9·10⁶ bước cho 3 000 × 3 000; hàng i chỉ đọc hàng i − 1, nên hai mảng kiểu dài m + 1 là đủ. Vét cạn lặp lại cùng các phép so cho mọi cặp điểm đầu dọc một đường chéo — đúng phần việc mà bảng dùng chung.'],
  kn: ['2D DP', 'longest common substring'],
  tns: [tn('contiguous', 'liên tiếp'), tn('subsequence', 'dãy con (được bỏ phần tử)'), tn('substring / subarray', 'chuỗi con / mảng con liên tiếp'), tn('diagonal', 'đường chéo')],
  dau: `/**
 * a, b: number[] — two request logs
 * returns the length of the longest contiguous run present in both
 */
function longestCommonStreak(a, b) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — dp[i][j] = length of the common run ending at a[i-1], b[j-1]; two rolling rows, max over all cells.\n' + nguon(longestCommonStreak),
  cases: [
    { args: [[1, 2, 3, 2, 1], [3, 2, 1, 4, 7]], moTa: ['[3, 2, 1] ⇒ 3', '[3, 2, 1] ⇒ 3'] },
    { args: [[1, 2, 3], [1, 9, 2, 3]], moTa: ['Gaps are not allowed ⇒ 2', 'Không cho phép khoảng hở ⇒ 2'] },
    { args: [[5, 5], [6, 6]], moTa: ['Nothing in common ⇒ 0', 'Không có gì chung ⇒ 0'] },
    { args: [[], [1, 2]], an: true },
    { args: [[0, 0, 0, 0, 0], [0, 0, 0]], an: true },
    { args: [[7, 8, 9, 1, 2], [1, 2, 7, 8, 9]], an: true, moTa: ['The best run is not at the end of either log', 'Đoạn tốt nhất không nằm ở cuối log nào'] },
    { args: [[4, 1, 4, 1, 4, 1], [1, 4, 1, 4]], an: true },
  ],
  perf: [{
    moTa: ['Performance: two 3 000-entry logs that are almost identical (brute-force extension is O(n·m·L) ⇒ times out)', 'Hiệu năng: hai log 3 000 mục gần giống hệt nhau (vét cạn kéo dài là O(n·m·L) ⇒ hết giờ)'],
    than: 'var a = new Array(3000).fill(0), b = new Array(3000).fill(0); b[0] = 5; a[2999 - R(3)] = 7; return longestCommonStreak(a, b);',
  }],
  saiMau: [
    { ten: ['Brute force: extend from every pair of starts', 'Vét cạn: kéo dài từ mọi cặp điểm đầu'], chiHieuNang: true, ma: 'function longestCommonStreak(a, b) {\n  var best = 0;\n  for (var i = 0; i < a.length; i++) for (var j = 0; j < b.length; j++) {\n    var k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;\n    if (k > best) best = k;\n  }\n  return best;\n}\n' },
    { ten: ['LCS recurrence (allows gaps)', 'Công thức LCS (cho phép khoảng hở)'], ma: 'function longestCommonStreak(a, b) {\n  var d = Array.from({ length: a.length + 1 }, function () { return new Array(b.length + 1).fill(0); });\n  for (var i = 1; i <= a.length; i++) for (var j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);\n  return d[a.length][b.length];\n}\n' },
  ],
});

/* ── 3. Cái túi 0/1: chọn buổi workshop trong giới hạn giờ ── */
function bestWorkshops(hours, credits, limit) {
  // best[c] = max credits using the workshops seen so far with total hours <= c (row i of the items × capacity table)
  var best = new Array(limit + 1).fill(0);
  for (var i = 0; i < hours.length; i++) {
    for (var c = limit; c >= hours[i]; c--) { // DOWNWARD: best[c - hours[i]] still belongs to row i-1 ⇒ each workshop used at most once
      var take = best[c - hours[i]] + credits[i];
      if (take > best[c]) best[c] = take;
    }
  }
  return best[limit];
}
const Q3 = bai({
  ten: 'Soft-skill workshops: the most credits within your free hours', kho: 'MEDIUM', phut: 25, ham: 'bestWorkshops',
  en: `<p>The student affairs office offers optional workshops this semester. Workshop <code>i</code> takes <code>hours[i]</code> hours and is worth <code>credits[i]</code> soft-skill points. A student has <code>limit</code> free hours and can attend each workshop <b>at most once</b>.</p>
<p>Write <code>bestWorkshops(hours, credits, limit)</code> returning the maximum total points of a set of workshops whose total hours do not exceed <code>limit</code>.</p>`,
  vi: `<p>Phòng công tác sinh viên mở các buổi workshop tự chọn trong kỳ. Workshop <code>i</code> kéo dài <code>hours[i]</code> giờ và đáng <code>credits[i]</code> điểm kỹ năng mềm. Một sinh viên có <code>limit</code> giờ rảnh và mỗi workshop chỉ dự <b>tối đa một lần</b>.</p>
<p>Viết <code>bestWorkshops(hours, credits, limit)</code> trả về tổng điểm lớn nhất của một tập workshop có tổng số giờ không vượt <code>limit</code>.</p>`,
  dauVao: ['hours, credits — arrays of positive integers of equal length; limit — integer ≥ 0.', 'hours, credits — hai mảng số nguyên dương cùng độ dài; limit — số nguyên ≥ 0.'],
  dauRa: ['A number — the maximum total credits.', 'Một số — tổng điểm lớn nhất.'],
  rangBuoc: [['0 ≤ n ≤ 200; 1 ≤ hours[i] ≤ 500; 0 ≤ limit ≤ 10 000; 1 ≤ credits[i] ≤ 10⁴.', '0 ≤ n ≤ 200; 1 ≤ hours[i] ≤ 500; 0 ≤ limit ≤ 10 000; 1 ≤ credits[i] ≤ 10⁴.'], ['Target: O(n · limit) time, O(limit) memory.', 'Mục tiêu: O(n · limit) thời gian, O(limit) bộ nhớ.']],
  goiY: [
    ['Two numbers describe a subproblem: how many workshops you have considered, and how many hours are still available. <code>dp[i][c]</code> = best points using the first i workshops within c hours.', 'Hai con số mô tả một bài toán con: đã xét bao nhiêu workshop, và còn bao nhiêu giờ. <code>dp[i][c]</code> = điểm tốt nhất dùng i workshop đầu trong c giờ.'],
    ['<code>dp[i][c] = max(dp[i−1][c], dp[i−1][c − hours] + credits)</code>. To use one array, loop c from <code>limit</code> DOWN to <code>hours[i]</code> — going up would let a workshop be taken twice.', '<code>dp[i][c] = max(dp[i−1][c], dp[i−1][c − giờ] + điểm)</code>. Muốn dùng một mảng thì cho c chạy từ <code>limit</code> XUỐNG <code>hours[i]</code> — chạy lên sẽ cho một workshop được lấy hai lần.'],
  ],
  loi: [
    ['One-array knapsack with the capacity loop going UP: it silently becomes the unbounded knapsack (a 2-hour workshop counted five times in 10 hours).', 'Cái túi một mảng với vòng sức chứa chạy LÊN: âm thầm biến thành cái túi không giới hạn (workshop 2 giờ được đếm năm lần trong 10 giờ).'],
    ['Greedy by points per hour: <code>hours [6, 5, 5]</code>, <code>credits [12, 9, 9]</code>, limit 10 — greedy takes the 6-hour one (2 points/h) and gets 12, the answer is 18.', 'Tham lam theo điểm mỗi giờ: <code>hours [6, 5, 5]</code>, <code>credits [12, 9, 9]</code>, limit 10 — tham lam lấy buổi 6 giờ (2 điểm/giờ) được 12, đáp án là 18.'],
    ['Take/skip recursion without memo: 2ⁿ calls — fine for 15 workshops, impossible for 200.', 'Đệ quy lấy/bỏ không nhớ: 2ⁿ lời gọi — ổn với 15 workshop, không thể với 200.'],
  ],
  gt: ['For each workshop and each capacity there are only two choices — skip it or take it — and either choice leaves a smaller subproblem of the same shape, so the (item, capacity) table covers every subset exactly. The table has (n + 1) × (limit + 1) cells of O(1) each ⇒ 200 · 10 001 ≈ 2·10⁶ steps. Row i only reads row i − 1 at capacities ≤ c, so iterating c downward lets one array hold both rows: when we write best[c], best[c − h] has not been overwritten yet and still means "without workshop i".', 'Với mỗi workshop và mỗi sức chứa chỉ có hai lựa chọn — bỏ hoặc lấy — và lựa chọn nào cũng để lại một bài toán con nhỏ hơn cùng dạng, nên bảng (món, sức chứa) phủ đúng mọi tập con. Bảng có (n + 1) × (limit + 1) ô, mỗi ô O(1) ⇒ 200 · 10 001 ≈ 2·10⁶ bước. Hàng i chỉ đọc hàng i − 1 ở sức chứa ≤ c, nên cho c chạy xuống thì một mảng giữ được cả hai hàng: lúc ghi best[c], best[c − h] chưa bị ghi đè và vẫn nghĩa là "không có workshop i".'],
  kn: ['0/1 knapsack', '2D DP compressed to 1D'],
  tns: [tn('0/1 knapsack', 'cái túi 0/1', 'mỗi món lấy hoặc không, tối đa một lần.'), tn('unbounded knapsack', 'cái túi không giới hạn'), tn('capacity', 'sức chứa'), tn('space optimisation', 'tối ưu bộ nhớ')],
  dau: `/**
 * hours: number[], credits: number[], limit: number
 * returns the maximum total credits of workshops (each at most once) within limit hours
 */
function bestWorkshops(hours, credits, limit) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — 0/1 knapsack in one array, capacity loop going DOWN.\n' + nguon(bestWorkshops),
  cases: [
    { args: [[2, 3, 4], [3, 4, 5], 5], moTa: ['2 h + 3 h ⇒ 7 points', '2 giờ + 3 giờ ⇒ 7 điểm'] },
    { args: [[6, 5, 5], [12, 9, 9], 10], moTa: ['Points per hour misleads ⇒ 18', 'Điểm mỗi giờ đánh lừa ⇒ 18'] },
    { args: [[2], [10], 10], moTa: ['Each workshop at most once ⇒ 10', 'Mỗi workshop tối đa một lần ⇒ 10'] },
    { args: [[], [], 8], an: true },
    { args: [[3, 4], [5, 6], 0], an: true, moTa: ['No free time ⇒ 0', 'Không có giờ rảnh ⇒ 0'] },
    { args: [[1, 1, 1, 1], [1, 2, 3, 4], 2], an: true },
    { args: [[5, 4, 6, 3], [10, 40, 30, 50], 10], an: true },
    { args: [[12, 7, 11, 8, 9, 6, 10, 5, 13, 4, 3, 14, 2, 15], [24, 13, 23, 15, 16, 11, 19, 8, 27, 7, 5, 26, 3, 30], 26], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 workshops, 10 000 free hours (2²⁰⁰ subsets — take/skip recursion never finishes)', 'Hiệu năng: 200 workshop, 10 000 giờ rảnh (2²⁰⁰ tập con — đệ quy lấy/bỏ không bao giờ xong)'],
    than: 'var n = 200, h = [], c = []; for (var i = 0; i < n; i++) { h.push(1 + R(500)); c.push(1 + R(10000)); } return [bestWorkshops(h, c, 10000), bestWorkshops(h, c, 777)];',
  }],
  saiMau: [
    { ten: ['Take/skip recursion without memo', 'Đệ quy lấy/bỏ không nhớ'], chiHieuNang: true, ma: 'function bestWorkshops(hours, credits, limit) {\n  function f(i, cap) {\n    if (i === hours.length) return 0;\n    var best = f(i + 1, cap);\n    if (hours[i] <= cap) best = Math.max(best, credits[i] + f(i + 1, cap - hours[i]));\n    return best;\n  }\n  return f(0, limit);\n}\n' },
    { ten: ['Capacity loop going UP (unbounded knapsack)', 'Vòng sức chứa chạy LÊN (cái túi không giới hạn)'], ma: 'function bestWorkshops(hours, credits, limit) {\n  var d = new Array(limit + 1).fill(0);\n  for (var i = 0; i < hours.length; i++) for (var c = hours[i]; c <= limit; c++) d[c] = Math.max(d[c], d[c - hours[i]] + credits[i]);\n  return d[limit];\n}\n' },
  ],
});

/* ── 4. Diff theo dòng từ bảng LCS (hậu tố) + quy tắc phá hoà cố định ── */
function lineDiff(a, b) {
  var n = a.length, m = b.length, W = m + 1;
  // L[i*W + j] = LCS length of the SUFFIXES a[i..] and b[j..]; filled from the bottom-right corner
  var L = new Int32Array((n + 1) * W);
  for (var i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) {
    L[i * W + j] = a[i] === b[j] ? L[(i + 1) * W + j + 1] + 1 : Math.max(L[(i + 1) * W + j], L[i * W + j + 1]);
  }
  var out = [], x = 0, y = 0;
  while (x < n && y < m) {
    if (a[x] === b[y]) { out.push('  ' + a[x]); x++; y++; }               // part of the LCS: unchanged line
    else if (L[(x + 1) * W + y] >= L[x * W + y + 1]) { out.push('- ' + a[x]); x++; } // tie ⇒ delete first (the rule)
    else { out.push('+ ' + b[y]); y++; }
  }
  while (x < n) out.push('- ' + a[x++]);
  while (y < m) out.push('+ ' + b[y++]);
  return out;
}
const Q4 = bai({
  ten: 'Mini git diff: line changes from the LCS table', kho: 'HARD', phut: 40, ham: 'lineDiff',
  en: `<p>Build the heart of a code-review tool: turn the old version <code>a</code> of a file (array of lines) into the new version <code>b</code> with as few changed lines as possible. Unchanged lines are exactly a <b>longest common subsequence</b> of the two files.</p>
<p>Write <code>lineDiff(a, b)</code> returning the diff as an array of strings: <code>"  " + line</code> for an unchanged line, <code>"- " + line</code> for a deleted line of <code>a</code>, <code>"+ " + line</code> for an inserted line of <code>b</code>. Because many minimal diffs exist, follow this exact rule. Let <code>L(i, j)</code> be the LCS length of the suffixes <code>a[i…]</code> and <code>b[j…]</code>. Start at <code>i = j = 0</code>:</p>
<ol><li>if <code>a[i] === b[j]</code>: output unchanged, move both;</li>
<li>else if <code>L(i+1, j) ≥ L(i, j+1)</code>: output <code>- a[i]</code>, move i;</li>
<li>else: output <code>+ b[j]</code>, move j;</li>
<li>when one file runs out, output the rest of <code>a</code> as deletions, then the rest of <code>b</code> as insertions.</li></ol>`,
  vi: `<p>Dựng lõi của một công cụ review code: biến bản cũ <code>a</code> của một tệp (mảng dòng) thành bản mới <code>b</code> với ít dòng thay đổi nhất. Các dòng giữ nguyên chính là một <b>dãy con chung dài nhất</b> (LCS) của hai tệp.</p>
<p>Viết <code>lineDiff(a, b)</code> trả về diff dạng mảng chuỗi: <code>"  " + dòng</code> cho dòng giữ nguyên, <code>"- " + dòng</code> cho dòng của <code>a</code> bị xoá, <code>"+ " + dòng</code> cho dòng của <code>b</code> được thêm. Vì có nhiều diff tối thiểu, hãy theo đúng luật này. Gọi <code>L(i, j)</code> là độ dài LCS của hai hậu tố <code>a[i…]</code> và <code>b[j…]</code>. Bắt đầu ở <code>i = j = 0</code>:</p>
<ol><li>nếu <code>a[i] === b[j]</code>: ghi dòng giữ nguyên, tiến cả hai;</li>
<li>ngược lại nếu <code>L(i+1, j) ≥ L(i, j+1)</code>: ghi <code>- a[i]</code>, tiến i;</li>
<li>ngược lại: ghi <code>+ b[j]</code>, tiến j;</li>
<li>khi một tệp hết dòng, ghi phần còn lại của <code>a</code> là xoá, rồi phần còn lại của <code>b</code> là thêm.</li></ol>`,
  dauVao: ['a, b — arrays of strings (lines).', 'a, b — mảng chuỗi (các dòng).'],
  dauRa: ['string[] — the diff, following the rule above.', 'string[] — diff, theo đúng luật trên.'],
  rangBuoc: [['0 ≤ a.length, b.length ≤ 1 500.', '0 ≤ a.length, b.length ≤ 1 500.'], ['Target: O(|a| · |b|) time and memory (a typed array of 2.25·10⁶ cells is fine).', 'Mục tiêu: O(|a| · |b|) thời gian và bộ nhớ (một mảng kiểu 2,25·10⁶ ô là ổn).']],
  goiY: [
    ['The rule needs <code>L(i+1, j)</code> and <code>L(i, j+1)</code> for arbitrary i, j — so compute the whole suffix table first, then walk it once from (0, 0).', 'Luật cần <code>L(i+1, j)</code> và <code>L(i, j+1)</code> với i, j bất kỳ — nên tính trọn bảng hậu tố trước, rồi đi qua nó một lần từ (0, 0).'],
    ['Suffix LCS recurrence: <code>L(i, j) = a[i] === b[j] ? 1 + L(i+1, j+1) : max(L(i+1, j), L(i, j+1))</code>, with <code>L(n, ·) = L(·, m) = 0</code>. Fill i from n−1 down to 0 and j from m−1 down to 0.', 'Công thức LCS hậu tố: <code>L(i, j) = a[i] === b[j] ? 1 + L(i+1, j+1) : max(L(i+1, j), L(i, j+1))</code>, với <code>L(n, ·) = L(·, m) = 0</code>. Điền i từ n−1 về 0 và j từ m−1 về 0.'],
    ['Store the table in one <code>Int32Array((n+1)·(m+1))</code> indexed <code>i·(m+1) + j</code> — 1 500 × 1 500 arrays of arrays are slower and heavier.', 'Lưu bảng trong một <code>Int32Array((n+1)·(m+1))</code> đánh chỉ số <code>i·(m+1) + j</code> — mảng của mảng 1 500 × 1 500 chậm và nặng hơn.'],
  ],
  loi: [
    ['Recursive LCS without memo to decide each step: exponential — fine on 6 lines, never finishes on 1 500.', 'LCS đệ quy không nhớ để quyết định từng bước: hàm mũ — ổn với 6 dòng, không bao giờ xong với 1 500.'],
    ['Breaking ties the other way (insert first): still a minimal diff, but not the one the rule asks for — every reviewer would see a different diff.', 'Phá hoà theo hướng ngược (thêm trước): vẫn là diff tối thiểu, nhưng không phải diff luật yêu cầu — mỗi người review sẽ thấy một diff khác.'],
    ['Using the usual prefix table <code>dp[i][j]</code> (first i, first j) with this forward walk: the forward walk needs information about what comes AFTER, i.e. suffixes.', 'Dùng bảng tiền tố quen thuộc <code>dp[i][j]</code> (i dòng đầu, j dòng đầu) với lượt đi xuôi này: đi xuôi cần thông tin về phần PHÍA SAU, tức hậu tố.'],
  ],
  gt: ['L(i, j) is the classic LCS recurrence written on suffixes, so the table is filled from the bottom-right corner. Walking from (0, 0): equal lines are always safe to keep (some LCS of the suffixes starts with them), and otherwise we move in the direction that keeps the remaining LCS as long as possible, so the number of unchanged lines equals L(0, 0) and the diff is minimal. The fixed tie-break (delete before insert, like git\'s default output) makes the result unique so it can be compared. Cost: (n+1)(m+1) cells ⇒ O(n·m) time and memory, plus an O(n + m) walk.', 'L(i, j) là công thức LCS kinh điển viết trên hậu tố, nên bảng được điền từ góc dưới phải. Đi từ (0, 0): dòng bằng nhau luôn giữ được (một LCS của hai hậu tố bắt đầu bằng chúng), còn lại ta đi theo hướng giữ LCS còn lại dài nhất, nên số dòng giữ nguyên bằng L(0, 0) và diff là tối thiểu. Luật phá hoà cố định (xoá trước thêm, như output mặc định của git) làm kết quả duy nhất để so được. Chi phí: (n+1)(m+1) ô ⇒ O(n·m) thời gian và bộ nhớ, cộng một lượt đi O(n + m).'],
  kn: ['longest common subsequence', '2D DP', 'reconstructing a solution'],
  tns: [tn('longest common subsequence (LCS)', 'dãy con chung dài nhất'), tn('suffix', 'hậu tố'), tn('tie-break', 'luật phá hoà'), tn('reconstruction', 'dựng lại lời giải', 'đi ngược/xuôi trên bảng để lấy ra các bước.')],
  dau: `/**
 * a: string[] (old lines), b: string[] (new lines)
 * returns the diff lines "  x" / "- x" / "+ x" following the tie-break rule in the statement
 */
function lineDiff(a, b) {
  // Write your solution here
  return a.map(function (x) { return '- ' + x; }).concat(b.map(function (x) { return '+ ' + x; }));
}
`,
  giai: '// Reference solution — suffix LCS table in one Int32Array, then one forward walk with the fixed tie-break.\n' + nguon(lineDiff),
  cases: [
    { args: [['import x', 'const a = 1', 'log(a)'], ['import x', 'const a = 2', 'log(a)']], moTa: ['One changed line = delete + insert', 'Một dòng sửa = xoá + thêm'] },
    { args: [['A', 'B', 'C', 'D'], ['B', 'C', 'E']], moTa: ['Delete A, keep B C, then D ⇒ E', 'Xoá A, giữ B C, rồi D ⇒ E'] },
    { args: [[], ['hello']], moTa: ['New file ⇒ one insertion', 'Tệp mới ⇒ một dòng thêm'] },
    { args: [['x'], []], an: true },
    { args: [['a', 'b'], ['b', 'a']], an: true, moTa: ['Tie: delete first', 'Hoà: xoá trước'] },
    { args: [['same', 'same'], ['same', 'same']], an: true },
    { args: [['p', 'q', 'r', 's', 't'], ['q', 'x', 's', 'p', 't']], an: true },
    { args: [['}', '}', 'return 0', '}'], ['}', 'return 1', '}', '}']], an: true, moTa: ['Repeated lines', 'Dòng lặp lại'] },
  ],
  perf: [{
    moTa: ['Performance: two 1 500-line files with ~10 % of lines edited (recursive LCS never finishes)', 'Hiệu năng: hai tệp 1 500 dòng, khoảng 10 % dòng bị sửa (LCS đệ quy không bao giờ xong)'],
    than: 'var a = [], b = []; for (var i = 0; i < 1500; i++) a.push("line " + R(300)); for (var j = 0; j < 1500; j++) { var k = R(10); if (k === 0) b.push("new " + j); else if (k === 1) b.push(a[(j + 1) % 1500]); else b.push(a[j]); } var d = lineDiff(a, b), keep = 0, del = 0, ins = 0; for (var t = 0; t < d.length; t++) { if (d[t][0] === " ") keep++; else if (d[t][0] === "-") del++; else ins++; } return { length: d.length, keep: keep, del: del, ins: ins, head: d.slice(0, 4), tail: d.slice(-3) };',
  }],
  saiMau: [
    { ten: ['LCS by plain recursion at each step', 'LCS bằng đệ quy trần ở mỗi bước'], chiHieuNang: true, ma: 'function lineDiff(a, b) {\n  function L(i, j) { if (i === a.length || j === b.length) return 0; return a[i] === b[j] ? 1 + L(i + 1, j + 1) : Math.max(L(i + 1, j), L(i, j + 1)); }\n  var out = [], x = 0, y = 0;\n  while (x < a.length && y < b.length) {\n    if (a[x] === b[y]) { out.push("  " + a[x]); x++; y++; }\n    else if (L(x + 1, y) >= L(x, y + 1)) out.push("- " + a[x++]);\n    else out.push("+ " + b[y++]);\n  }\n  while (x < a.length) out.push("- " + a[x++]);\n  while (y < b.length) out.push("+ " + b[y++]);\n  return out;\n}\n' },
    { ten: ['Tie broken towards insertion', 'Phá hoà về phía thêm dòng'], ma: 'function lineDiff(a, b) {\n  var n = a.length, m = b.length, L = Array.from({ length: n + 1 }, function () { return new Array(m + 1).fill(0); });\n  for (var i = n - 1; i >= 0; i--) for (var j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);\n  var out = [], x = 0, y = 0;\n  while (x < n && y < m) {\n    if (a[x] === b[y]) { out.push("  " + a[x]); x++; y++; }\n    else if (L[x][y + 1] >= L[x + 1][y]) out.push("+ " + b[y++]);\n    else out.push("- " + a[x++]);\n  }\n  while (x < n) out.push("- " + a[x++]);\n  while (y < m) out.push("+ " + b[y++]);\n  return out;\n}\n' },
  ],
});

export default mod('dsa-9-3-hai-chieu', '9.3 2D dynamic programming: tables, knapsack, diff', [Q1, Q2, Q3, Q4]);
