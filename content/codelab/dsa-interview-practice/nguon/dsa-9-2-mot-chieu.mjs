/** Coding Interview Prep · 9.2 — Quy hoạch động một chiều: đếm cách (mod), trạng thái có thêm "độ dài chuỗi", DP trên khoảng đã sắp + tìm nhị phân. Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Đếm cách leo cầu thang có bậc hỏng ── */
function stairWays(n, broken) {
  var MOD = 1000000007;
  var bad = new Set(broken);
  // ways[i] = number of ways to stand on step i; only the last two values are needed
  var prev2 = 0, prev1 = 1; // ways[-1] = 0, ways[0] = 1 (the ground floor is never broken)
  for (var i = 1; i <= n; i++) {
    var cur = bad.has(i) ? 0 : (prev1 + prev2) % MOD; // arrive from i-1 (one step) or i-2 (two steps)
    prev2 = prev1; prev1 = cur;
  }
  return prev1;
}
const P1 = bai({
  ten: 'Wet stairs: count the safe ways up', kho: 'EASY', phut: 15, ham: 'stairWays',
  en: `<p>After the rain, some steps of the outdoor staircase to the Alpha building are wet and slippery. A student standing on the ground (step 0) wants to reach step <code>n</code>, moving up <b>1 or 2 steps</b> at a time and never landing on a step listed in <code>broken</code>.</p>
<p>Write <code>stairWays(n, broken)</code> that returns the number of different ways to reach step <code>n</code>, <b>modulo 1 000 000 007</b>. If step <code>n</code> itself is wet, the answer is 0.</p>`,
  vi: `<p>Sau cơn mưa, vài bậc của cầu thang ngoài trời lên toà Alpha bị ướt và trơn. Một sinh viên đứng ở mặt đất (bậc 0) muốn lên bậc <code>n</code>, mỗi lần bước lên <b>1 hoặc 2 bậc</b> và không bao giờ đặt chân lên bậc có trong <code>broken</code>.</p>
<p>Viết <code>stairWays(n, broken)</code> trả về số cách khác nhau để lên bậc <code>n</code>, <b>modulo 1 000 000 007</b>. Nếu chính bậc <code>n</code> bị ướt thì đáp án là 0.</p>`,
  dauVao: ['n — target step (≥ 0); broken — array of distinct step numbers in 1 … n.', 'n — bậc đích (≥ 0); broken — mảng số bậc không trùng trong 1 … n.'],
  dauRa: ['A number in [0, 1 000 000 007).', 'Một số trong [0, 1 000 000 007).'],
  rangBuoc: [['0 ≤ n ≤ 200 000.', '0 ≤ n ≤ 200 000.'], ['Target: O(n) time, O(1) extra memory besides the set of broken steps.', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ phụ ngoài tập bậc hỏng.']],
  goiY: [
    ['Name the state: <code>ways[i]</code> = number of ways to stand on step i. The last move into step i came from i − 1 or i − 2.', 'Đặt tên trạng thái: <code>ways[i]</code> = số cách đứng ở bậc i. Bước cuối vào bậc i đến từ i − 1 hoặc i − 2.'],
    ['Transition: <code>ways[i] = broken ? 0 : ways[i−1] + ways[i−2]</code>, base <code>ways[0] = 1</code>. Take the modulo at every step, and keep only the last two values.', 'Chuyển trạng thái: <code>ways[i] = hỏng ? 0 : ways[i−1] + ways[i−2]</code>, cơ sở <code>ways[0] = 1</code>. Lấy modulo ở mỗi bước, và chỉ giữ hai giá trị cuối.'],
  ],
  loi: [
    ['Plain recursion <code>f(i) = f(i−1) + f(i−2)</code> without memo: exponential, and for n = 200 000 it also overflows the call stack.', 'Đệ quy trần <code>f(i) = f(i−1) + f(i−2)</code> không nhớ: hàm mũ, và với n = 200 000 còn tràn ngăn xếp gọi hàm.'],
    ['Taking the modulo only at the end: the counts grow like Fibonacci numbers and lose precision after ~78 steps (2⁵³).', 'Chỉ lấy modulo ở cuối: số cách tăng như dãy Fibonacci và mất chính xác sau khoảng 78 bậc (2⁵³).'],
    ['Using <code>broken.includes(i)</code> inside the loop: O(n · |broken|).', 'Dùng <code>broken.includes(i)</code> trong vòng lặp: O(n · |broken|).'],
  ],
  gt: ['The four DP questions: state <code>ways[i]</code>; transition from the only two possible previous steps; base case <code>ways[0] = 1</code> (one way to "be" on the ground — do nothing); answer <code>ways[n]</code>. A wet step simply has 0 ways, which automatically blocks every path through it. Each step is computed once from two values ⇒ O(n) time, and since <code>ways[i]</code> only reads the two previous values two variables suffice. Sums stay below 2·10⁹ before the modulo, far inside the exact range of a JS number.', 'Bốn câu hỏi DP: trạng thái <code>ways[i]</code>; chuyển từ đúng hai bậc trước có thể; cơ sở <code>ways[0] = 1</code> (một cách để "ở" mặt đất — không làm gì); đáp án <code>ways[n]</code>. Bậc ướt đơn giản có 0 cách, tự động chặn mọi đường đi qua nó. Mỗi bậc tính một lần từ hai giá trị ⇒ O(n) thời gian, và vì <code>ways[i]</code> chỉ đọc hai giá trị trước nên hai biến là đủ. Tổng trước khi lấy modulo luôn dưới 2·10⁹, nằm gọn trong vùng chính xác của số JS.'],
  kn: ['1D dynamic programming', 'counting paths', 'modular arithmetic'],
  tns: [tn('state', 'trạng thái'), tn('transition', 'chuyển trạng thái'), tn('base case', 'trường hợp cơ sở'), tn('memoization', 'ghi nhớ kết quả', 'lưu đáp án bài toán con để không tính lại.')],
  dau: `/**
 * n: target step, broken: number[] — wet steps (never land on them)
 * returns the number of ways to reach step n with moves of 1 or 2, modulo 1 000 000 007
 */
function stairWays(n, broken) {
  // Write your solution here
  return 1;
}
`,
  giai: '// Reference solution — ways[i] = ways[i-1] + ways[i-2] (0 on wet steps), rolled into two variables.\n' + nguon(stairWays),
  cases: [
    { args: [4, []], moTa: ['No wet step: 5 ways', 'Không bậc ướt: 5 cách'] },
    { args: [5, [2]], moTa: ['Step 2 is wet ⇒ 2 ways', 'Bậc 2 ướt ⇒ 2 cách'] },
    { args: [6, [3, 4]], moTa: ['Two wet steps in a row block everything ⇒ 0', 'Hai bậc ướt liền nhau chặn hết ⇒ 0'] },
    { args: [0, []], an: true, moTa: ['Already there ⇒ 1', 'Đã ở đích ⇒ 1'] },
    { args: [7, [7]], an: true, moTa: ['Target step wet ⇒ 0', 'Bậc đích ướt ⇒ 0'] },
    { args: [1, []], an: true },
    { args: [24, [5, 11, 17]], an: true },
    { args: [25, []], an: true },
  ],
  perf: [{
    moTa: ['Performance: n = 200 000 with 30 000 wet steps (plain recursion overflows / never finishes; the modulo must be taken every step)', 'Hiệu năng: n = 200 000 với 30 000 bậc ướt (đệ quy trần tràn ngăn xếp / không bao giờ xong; phải lấy modulo mỗi bước)'],
    than: 'var n = 200000, b = new Set(); while (b.size < 30000) { var s = 1 + R(n); if (!b.has(s - 1) && !b.has(s + 1) && s !== n) b.add(s); } return [stairWays(n, Array.from(b)), stairWays(90, [])];',
  }],
  saiMau: [
    { ten: ['Plain recursion without memo', 'Đệ quy trần không nhớ'], chiHieuNang: true, ma: 'function stairWays(n, broken) {\n  var bad = new Set(broken);\n  function f(i) { if (i < 0 || bad.has(i)) return 0; if (i === 0) return 1; return (f(i - 1) + f(i - 2)) % 1000000007; }\n  return f(n);\n}\n' },
    { ten: ['Modulo only at the end (precision lost)', 'Chỉ lấy modulo ở cuối (mất chính xác)'], ma: 'function stairWays(n, broken) {\n  var bad = new Set(broken), a = 0, b = 1;\n  for (var i = 1; i <= n; i++) { var c = bad.has(i) ? 0 : a + b; a = b; b = c; }\n  return b % 1000000007;\n}\n' },
  ],
});

/* ── 2. Trạng thái kèm "độ dài chuỗi": ca làm thêm, không quá 2 ngày liền ── */
function maxShiftPay(pay) {
  // r = best total if today is a REST day; w1 = best if today is worked and it is the 1st day of a streak; w2 = 2nd day of a streak
  var r = 0, w1 = -Infinity, w2 = -Infinity;
  for (var i = 0; i < pay.length; i++) {
    var nr = Math.max(r, w1, w2); // resting resets the streak
    var nw1 = r + pay[i];          // a new streak can only start after a rest day
    var nw2 = w1 + pay[i];         // a 2-day streak extends a 1-day streak; there is no w3
    r = nr; w1 = nw1; w2 = nw2;
  }
  return Math.max(r, w1, w2);
}
const P2 = bai({
  ten: 'Part-time shifts: never three days in a row', kho: 'MEDIUM', phut: 20, ham: 'maxShiftPay',
  en: `<p>A student works part-time at a coffee shop near campus. <code>pay[i]</code> is what the shift on day <code>i</code> pays (in thousand VND). Because of classes, the student refuses to work <b>three days in a row</b> — at most two consecutive working days, then at least one day off.</p>
<p>Write <code>maxShiftPay(pay)</code> returning the maximum total pay over the whole period. Working on no day at all (total 0) is allowed.</p>`,
  vi: `<p>Một sinh viên làm thêm ở quán cà phê gần trường. <code>pay[i]</code> là tiền ca ngày <code>i</code> (nghìn đồng). Vì còn đi học, bạn ấy không chịu làm <b>ba ngày liền</b> — tối đa hai ngày làm liên tiếp, rồi nghỉ ít nhất một ngày.</p>
<p>Viết <code>maxShiftPay(pay)</code> trả về tổng tiền lớn nhất trong cả giai đoạn. Không làm ngày nào (tổng 0) cũng được.</p>`,
  dauVao: ['pay — array of non-negative integers.', 'pay — mảng số nguyên không âm.'],
  dauRa: ['A number — the maximum total.', 'Một số — tổng lớn nhất.'],
  rangBuoc: [['0 ≤ pay.length ≤ 200 000; 0 ≤ pay[i] ≤ 10⁶.', '0 ≤ pay.length ≤ 200 000; 0 ≤ pay[i] ≤ 10⁶.'], ['Target: O(n) time, O(1) memory.', 'Mục tiêu: O(n) thời gian, O(1) bộ nhớ.']],
  goiY: [
    ['"Best total up to day i" is not enough information: whether you may work on day i + 1 depends on how many days in a row you have just worked. Put that into the state.', '"Tổng tốt nhất tới ngày i" là chưa đủ thông tin: được làm ngày i + 1 hay không còn tuỳ bạn vừa làm liền mấy ngày. Đưa điều đó vào trạng thái.'],
    ['Three states per day: rest, 1st day of a streak, 2nd day of a streak. rest ← max of all three; 1st ← rest + pay; 2nd ← 1st + pay.', 'Ba trạng thái mỗi ngày: nghỉ, ngày 1 của chuỗi, ngày 2 của chuỗi. nghỉ ← max cả ba; ngày 1 ← nghỉ + tiền; ngày 2 ← ngày 1 + tiền.'],
  ],
  loi: [
    ['Reusing the House Robber recurrence <code>max(dp[i−1], dp[i−2] + pay[i])</code>: that forbids TWO days in a row, which is stricter than the rule here.', 'Dùng lại công thức House Robber <code>max(dp[i−1], dp[i−2] + pay[i])</code>: công thức đó cấm HAI ngày liền, chặt hơn luật ở đây.'],
    ['Try-all recursion (work / rest each day, carrying the streak) without memo: about 1.8ⁿ calls ⇒ hopeless for n = 200 000.', 'Đệ quy thử hết (làm / nghỉ mỗi ngày, mang theo độ dài chuỗi) không nhớ: khoảng 1,8ⁿ lời gọi ⇒ vô vọng với n = 200 000.'],
    ['Updating <code>r, w1, w2</code> in place one after another: <code>w2</code> then reads the NEW <code>w1</code> of the same day. Compute all three from the old values first.', 'Cập nhật <code>r, w1, w2</code> tại chỗ lần lượt: <code>w2</code> sẽ đọc <code>w1</code> MỚI của cùng ngày. Tính cả ba từ giá trị cũ trước.'],
  ],
  gt: ['The extra dimension "length of the current streak" (0, 1 or 2) makes the future depend only on the state, which is the condition for DP to be correct. Every valid schedule ends each day in exactly one of the three states, and the transitions enumerate all legal ways to get there, so the maximum is exact. The table is n × 3 but each row only needs the previous one ⇒ O(n) time, O(1) memory. <code>-Infinity</code> marks "impossible" (you cannot be on day 2 of a streak before any day has passed).', 'Chiều thêm "độ dài chuỗi hiện tại" (0, 1 hoặc 2) làm cho tương lai chỉ phụ thuộc trạng thái — đúng điều kiện để DP đúng. Mọi lịch hợp lệ kết thúc mỗi ngày ở đúng một trong ba trạng thái, và các phép chuyển liệt kê đủ mọi cách hợp lệ để tới đó, nên giá trị lớn nhất là chính xác. Bảng là n × 3 nhưng mỗi hàng chỉ cần hàng trước ⇒ O(n) thời gian, O(1) bộ nhớ. <code>-Infinity</code> đánh dấu "không thể" (không thể ở ngày 2 của chuỗi khi chưa có ngày nào trôi qua).'],
  kn: ['1D DP with extra state', 'state machine DP'],
  tns: [tn('state machine', 'máy trạng thái'), tn('streak', 'chuỗi ngày liên tiếp'), tn('rolling variables', 'biến cuốn', 'chỉ giữ hàng trước của bảng DP.')],
  dau: `/**
 * pay: number[] — pay of each day's shift
 * returns the maximum total pay without working 3 days in a row
 */
function maxShiftPay(pay) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — three rolling states: rest, 1st day of a streak, 2nd day of a streak.\n' + nguon(maxShiftPay),
  cases: [
    { args: [[5, 5, 5, 5]], moTa: ['Work, work, rest, work ⇒ 15', 'Làm, làm, nghỉ, làm ⇒ 15'] },
    { args: [[10, 1, 1, 10]], moTa: ['Two-in-a-row IS allowed ⇒ 21', 'Hai ngày liền VẪN được ⇒ 21'] },
    { args: [[3, 100, 3]], moTa: ['⇒ 103', '⇒ 103'] },
    { args: [[]], an: true },
    { args: [[0, 0, 0]], an: true },
    { args: [[7]], an: true },
    { args: [[4, 4, 9, 4, 4, 9, 4, 4]], an: true },
    { args: [[50, 1, 50, 50, 1, 50, 50, 50, 1, 2]], an: true },
    { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 days (try-all recursion is exponential)', 'Hiệu năng: 200 000 ngày (đệ quy thử hết là hàm mũ)'],
    than: 'var n = 200000, p = new Array(n); for (var i = 0; i < n; i++) p[i] = R(1000001); return maxShiftPay(p);',
  }],
  saiMau: [
    { ten: ['Try-all recursion without memo', 'Đệ quy thử hết không nhớ'], chiHieuNang: true, ma: 'function maxShiftPay(pay) {\n  function f(i, streak) {\n    if (i === pay.length) return 0;\n    var best = f(i + 1, 0);\n    if (streak < 2) best = Math.max(best, pay[i] + f(i + 1, streak + 1));\n    return best;\n  }\n  return f(0, 0);\n}\n' },
    { ten: ['House Robber recurrence (forbids 2 in a row)', 'Công thức House Robber (cấm 2 ngày liền)'], ma: 'function maxShiftPay(pay) {\n  var a = 0, b = 0;\n  for (var x of pay) { var c = Math.max(b, a + x); a = b; b = c; }\n  return b;\n}\n' },
  ],
});

/* ── 3. DP trên khoảng đã sắp theo giờ kết thúc + tìm nhị phân ── */
function maxBookingRevenue(bookings) {
  var b = bookings.slice().sort(function (x, y) { return x[1] - y[1]; }); // copy, then sort by END time
  var ends = b.map(function (x) { return x[1]; });
  var dp = new Array(b.length + 1); // dp[i] = best revenue using only the first i bookings (by end time)
  dp[0] = 0;
  for (var i = 1; i <= b.length; i++) {
    var start = b[i - 1][0];
    // binary search: how many bookings end at or before `start`? (half-open: ending at 10 and starting at 10 is fine)
    var lo = 0, hi = i - 1;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (ends[mid] <= start) lo = mid + 1; else hi = mid; }
    dp[i] = Math.max(dp[i - 1], dp[lo] + b[i - 1][2]); // skip booking i, or take it after the last compatible one
  }
  return dp[b.length];
}
const P3 = bai({
  ten: 'Meeting room: accept the bookings that earn the most', kho: 'HARD', phut: 35, ham: 'maxBookingRevenue',
  en: `<p>The startup incubator rents out its one big meeting room. Each request in <code>bookings</code> is <code>[start, end, price]</code> (times in minutes, <code>start &lt; end</code>). The room can host one booking at a time; times are <b>half-open</b>, so a booking ending at 600 and another starting at 600 do not clash.</p>
<p>Write <code>maxBookingRevenue(bookings)</code> returning the maximum total price of a set of non-overlapping bookings. Do not modify the input array.</p>`,
  vi: `<p>Vườn ươm khởi nghiệp cho thuê phòng họp lớn duy nhất của mình. Mỗi yêu cầu trong <code>bookings</code> là <code>[start, end, price]</code> (thời gian tính bằng phút, <code>start &lt; end</code>). Phòng chỉ phục vụ một lịch tại một thời điểm; thời gian là <b>nửa mở</b>, nên lịch kết thúc lúc 600 và lịch bắt đầu lúc 600 không đụng nhau.</p>
<p>Viết <code>maxBookingRevenue(bookings)</code> trả về tổng giá lớn nhất của một tập lịch không chồng nhau. Không sửa mảng đầu vào.</p>`,
  dauVao: ['bookings — array of [start, end, price] with integers 0 ≤ start < end ≤ 10⁹, 1 ≤ price ≤ 10⁶.', 'bookings — mảng [start, end, price] với số nguyên 0 ≤ start < end ≤ 10⁹, 1 ≤ price ≤ 10⁶.'],
  dauRa: ['A number — the maximum revenue.', 'Một số — doanh thu lớn nhất.'],
  rangBuoc: [['0 ≤ bookings.length ≤ 100 000.', '0 ≤ bookings.length ≤ 100 000.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['Sort by end time. Look at the booking that ends last: either you reject it, or you accept it and then only bookings that end by its start are still possible.', 'Sắp theo giờ kết thúc. Xét lịch kết thúc muộn nhất: hoặc bạn từ chối nó, hoặc nhận nó và khi đó chỉ còn các lịch kết thúc trước giờ bắt đầu của nó.'],
    ['<code>dp[i]</code> = best revenue using the first i bookings in end order. <code>dp[i] = max(dp[i−1], price + dp[j])</code> where j = number of bookings with <code>end ≤ start</code> — find j by binary search on the sorted ends.', '<code>dp[i]</code> = doanh thu tốt nhất dùng i lịch đầu theo thứ tự kết thúc. <code>dp[i] = max(dp[i−1], giá + dp[j])</code> với j = số lịch có <code>end ≤ start</code> — tìm j bằng tìm nhị phân trên dãy end đã sắp.'],
  ],
  loi: [
    ['Greedy "earliest end first" (the classic unweighted interval scheduling): maximises the NUMBER of bookings, not the money — one expensive long booking beats three cheap short ones.', 'Tham lam "kết thúc sớm nhất trước" (bài xếp lịch không trọng số kinh điển): tối đa SỐ lịch chứ không phải tiền — một lịch dài đắt thắng ba lịch ngắn rẻ.'],
    ['Finding the compatible predecessor by scanning every earlier booking: O(n²) — the 100 000-booking check times out.', 'Tìm lịch tương thích trước đó bằng cách quét mọi lịch trước: O(n²) — kiểm 100 000 lịch hết giờ.'],
    ['Using <code>end &lt; start</code> in the binary search: back-to-back bookings (end = next start) are wrongly treated as clashing.', 'Dùng <code>end &lt; start</code> trong tìm nhị phân: hai lịch nối tiếp (end = start kế) bị coi nhầm là đụng nhau.'],
    ['Sorting <code>bookings</code> in place — the caller\'s array changes order.', 'Sắp <code>bookings</code> tại chỗ — mảng của nơi gọi bị đổi thứ tự.'],
  ],
  gt: ['After sorting by end, the optimal set for the first i bookings either excludes booking i (value dp[i−1]) or includes it, and then everything else in the set must end by its start — exactly the first j bookings, because ends are sorted. Both options are covered, so dp is exact. Sorting costs O(n log n) and each of the n binary searches O(log n) ⇒ O(n log n) total, O(n) memory. This is "1D DP over a sorted order": the index is the position in end-time order, and binary search replaces the inner loop that makes the naive DP quadratic.', 'Sau khi sắp theo end, tập tối ưu cho i lịch đầu hoặc không chứa lịch i (giá trị dp[i−1]) hoặc chứa nó, và khi đó mọi lịch khác trong tập phải kết thúc trước giờ bắt đầu của nó — đúng j lịch đầu, vì end đã sắp. Cả hai lựa chọn đều được xét, nên dp chính xác. Sắp tốn O(n log n) và mỗi lần tìm nhị phân trong n lần tốn O(log n) ⇒ tổng O(n log n), bộ nhớ O(n). Đây là "DP một chiều trên một thứ tự đã sắp": chỉ số là vị trí theo giờ kết thúc, và tìm nhị phân thay cho vòng lặp trong làm DP ngây thơ thành bậc hai.'],
  kn: ['weighted interval scheduling', '1D DP', 'binary search'],
  tns: [tn('weighted interval scheduling', 'xếp lịch khoảng có trọng số'), tn('half-open interval', 'khoảng nửa mở'), tn('predecessor', 'phần tử đứng trước tương thích'), tn('upper bound', 'cận trên', 'vị trí đầu tiên lớn hơn giá trị cần tìm.')],
  dau: `/**
 * bookings: [start, end, price][] — half-open time intervals
 * returns the maximum total price of non-overlapping bookings
 */
function maxBookingRevenue(bookings) {
  // Write your solution here
  return 0;
}
`,
  giai: '// Reference solution — sort by end, dp[i] = max(skip, take + dp[last compatible]) with binary search.\n' + nguon(maxBookingRevenue),
  cases: [
    { args: [[[540, 600, 50], [600, 660, 50], [540, 660, 120]]], moTa: ['One long booking beats two short ones ⇒ 120', 'Một lịch dài thắng hai lịch ngắn ⇒ 120'] },
    { args: [[[540, 600, 70], [600, 660, 70], [540, 660, 120]]], moTa: ['Back-to-back bookings are compatible ⇒ 140', 'Lịch nối tiếp không đụng nhau ⇒ 140'] },
    { args: [[[1, 3, 5], [2, 5, 6], [4, 6, 5], [6, 7, 4], [5, 8, 11], [7, 9, 2]]], moTa: ['⇒ 17', '⇒ 17'] },
    { args: [[]], an: true },
    { args: [[[0, 10, 7]]], an: true },
    { args: [[[1, 2, 1], [1, 2, 9], [1, 2, 4]]], an: true, moTa: ['Identical slots: keep the best one', 'Cùng một khung giờ: giữ lịch giá cao nhất'] },
    { args: [[[5, 9, 3], [0, 5, 3], [9, 12, 3], [0, 12, 8], [3, 6, 4]]], an: true, moTa: ['Unsorted input', 'Đầu vào chưa sắp'] },
    { args: [[[10, 20, 5], [12, 18, 2], [13, 14, 2], [15, 16, 2], [17, 18, 2], [19, 30, 1]]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 bookings over one month (scanning all earlier bookings per booking times out)', 'Hiệu năng: 100 000 lịch trong một tháng (quét mọi lịch trước cho mỗi lịch hết giờ)'],
    than: 'var n = 100000, b = []; for (var i = 0; i < n; i++) { var s = R(43200); b.push([s, s + 1 + R(240), 1 + R(1000)]); } var copy = JSON.stringify(b.slice(0, 5)); var v = maxBookingRevenue(b); return [v, JSON.stringify(b.slice(0, 5)) === copy];',
  }],
  saiMau: [
    { ten: ['O(n²): scan every earlier booking for the best compatible dp', 'O(n²): quét mọi lịch trước tìm dp tương thích tốt nhất'], chiHieuNang: true, ma: 'function maxBookingRevenue(bookings) {\n  var b = bookings.slice().sort(function (x, y) { return x[1] - y[1]; }), dp = [];\n  for (var i = 0; i < b.length; i++) {\n    var take = b[i][2];\n    for (var j = 0; j < i; j++) if (b[j][1] <= b[i][0]) take = Math.max(take, dp[j] + b[i][2]);\n    dp.push(Math.max(i ? dp[i - 1] : 0, take));\n  }\n  return b.length ? dp[b.length - 1] : 0;\n}\n' },
    { ten: ['Greedy earliest end (maximises count, not money)', 'Tham lam kết thúc sớm nhất (tối đa số lịch, không phải tiền)'], ma: 'function maxBookingRevenue(bookings) {\n  var b = bookings.slice().sort(function (x, y) { return x[1] - y[1]; }), t = -Infinity, s = 0;\n  for (var x of b) if (x[0] >= t) { s += x[2]; t = x[1]; }\n  return s;\n}\n' },
  ],
});

export default mod('dsa-9-2-mot-chieu', '9.2 1D dynamic programming: count, extra state, sorted DP', [P1, P2, P3]);
