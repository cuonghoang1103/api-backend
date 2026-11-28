/**
 * Coding Interview Prep (dsa-interview) — Practical Exam (PE): 5 câu lập trình JavaScript, nộp .zip.
 *
 * Đề tự soạn, bám `content/courses/dsa-interview/s01…s09` — mỗi câu là một MẪU của khoá trong bối cảnh đời thật
 * (lab, phòng máy, học phần), KHÔNG chép đề LeetCode nào nguyên văn:
 *   Q1 tổng tiền tố + đếm phần dư (Ch1, kiểu LC 974 — có số âm, bẫy -7 % 5 = -2 và map phải khởi đầu {0: 1})
 *   Q2 cửa sổ trượt "nhảy" với điều kiện prev >= left (Ch2, bẫy "abba")
 *   Q3 tìm nhị phân trên không gian đáp án (Ch4, kiểu LC 1011 — giữ thứ tự, kiểm tham lam O(n))
 *   Q4 sắp xếp tô-pô Kahn theo tầng + phát hiện chu trình (Ch7)
 *   Q5 quy hoạch động đổi tiền: ít xu nhất và số cách (Ch9 — tham lam sai với [1, 3, 4]; vòng xu đặt NGOÀI)
 *
 * ⚠️ Lời giải mẫu đã đối chiếu với bản vét cạn trên 300 đầu vào ngẫu nhiên (0 khác biệt) lúc soạn, và mỗi câu có
 * một ca LỚN (n = 2·10⁵, Park–Miller hạt giống cố định) để lời giải O(n²) không chạy kịp. Kiểm lại:
 *   node scripts/exam-check.mjs content/exams/DSA-INTERVIEW-PE.mjs
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/DSA-INTERVIEW-PE.mjs --apply
 */
import { B, c, codeQ, starter, PARK } from './_lib/dsa-exam-kit.mjs';

const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({ id, criterion: B(en, vi), weight: maxScore, maxScore }));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b> Five problems, one function each, in plain JavaScript (Node 22, no npm).</p>' +
  '<ol>' +
  '<li>Create <code>Q1.js … Q5.js</code> and copy each <b>Starter</b> verbatim. Write only the function between the two <code>ĐỀ CHO SẴN</code> markers; the given block below it prints the results.</li>' +
  '<li>Before coding, do what chapter 0 drills: restate the problem, work one example by hand, say the brute force and its cost, then find the repeated work. Write the complexity you are aiming for as a comment at the top of your function.</li>' +
  '<li>Run <code>node Q1.js</code> and compare with the expected output line by line. The last line of every problem is a <b>large generated case</b> (n up to 2·10⁵): if your solution is quadratic it will not finish in time, and if it recurses once per element it may overflow the stack.</li>' +
  '<li>Zip the five files into one .zip and upload it.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first, then complexity (no hidden O(n²) such as <code>includes</code>, <code>indexOf</code> or <code>shift</code> inside a loop), then clean code — the four axes of chapter 11\'s scorecard in written form.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài.</b> Năm bài, mỗi bài một hàm, viết bằng JavaScript thuần (Node 22, không npm).</p>' +
  '<ol>' +
  '<li>Tạo <code>Q1.js … Q5.js</code> và chép <b>nguyên văn</b> khối Mã cho sẵn. Chỉ viết hàm nằm giữa hai mốc <code>ĐỀ CHO SẴN</code>; khối cho sẵn bên dưới in kết quả.</li>' +
  '<li>Trước khi code, làm đúng như chương 0 luyện: nói lại đề, làm tay một ví dụ, nói lời giải vét cạn và chi phí, rồi tìm phần việc bị lặp. Ghi độ phức tạp bạn nhắm tới thành một dòng chú thích ở đầu hàm.</li>' +
  '<li>Chạy <code>node Q1.js</code> và so từng dòng với kết quả mong đợi. Dòng cuối của mỗi bài là một <b>ca lớn sinh tự động</b> (n tới 2·10⁵): lời giải bậc hai sẽ không chạy kịp, còn lời giải đệ quy mỗi phần tử một tầng có thể tràn stack.</li>' +
  '<li>Nén năm file thành một .zip rồi tải lên.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Trước hết là kết quả, sau đó là độ phức tạp (không có O(n²) ẩn như <code>includes</code>, <code>indexOf</code> hay <code>shift</code> trong vòng lặp), rồi tới code sạch — chính bốn trục của phiếu chấm chương 11 ở dạng bài viết.</p>' +
  '</div>';

/* ───────────── Q1 — tổng tiền tố + phần dư (Ch1) ───────────── */
const Q1_STARTER = starter({
  head: `
// Phòng lab ghi mỗi giờ một con số chênh lệch năng lượng (có thể âm). Đếm số ĐOẠN GIỜ LIÊN TIẾP (khác rỗng)
// có tổng chia hết cho k.  1 ≤ n ≤ 2·10⁵ · -10⁴ ≤ nums[i] ≤ 10⁴ · 1 ≤ k ≤ 10⁴`,
  stub: `
function countDivisible(nums, k) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [[4, 5, 0, -2, -3, 1], 5],
  [[5], 9],
  [[-7, 2], 5],
  [[0, 0, 0], 3],
  [[3, -3, 3, -3], 3],
];
for (const [nums, k] of cases) console.log(JSON.stringify(nums) + ' k=' + k + ' -> ' + countDivisible(nums, k));
const r = park(2026);
const big = Array.from({ length: 200000 }, () => (r() % 20001) - 10000);
console.log('large n=200000 k=7919 -> ' + countDivisible(big, 7919));`,
});
const Q1_SOLUTION = `// O(n) thời gian, O(min(n, k)) bộ nhớ.
// Hai tiền tố cùng phần dư theo k ⇒ đoạn giữa chúng chia hết cho k. Đếm phần dư đã gặp; {0: 1} là tiền tố rỗng
// (để đếm cả những đoạn bắt đầu ở chỉ số 0). Chuẩn hoá dấu: trong JavaScript -7 % 5 là -2, không phải 3.
function countDivisible(nums, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0;
  let count = 0;
  for (const x of nums) {
    prefix = (((prefix + x) % k) + k) % k;
    count += seen.get(prefix) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}`;

/* ───────────── Q2 — cửa sổ trượt "nhảy" (Ch2) ───────────── */
const Q2_STARTER = starter({
  head: `
// Nhật ký cửa phòng máy ghi mã thẻ sinh viên theo thứ tự quẹt. Tìm độ dài ĐOẠN LIÊN TIẾP dài nhất mà không mã thẻ nào
// xuất hiện hai lần trong đoạn.  0 ≤ n ≤ 2·10⁵ · mã thẻ là chuỗi.`,
  stub: `
function longestUnique(ids) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  ['an', 'binh', 'chi', 'an', 'binh', 'chi', 'binh', 'binh'],
  ['an', 'binh', 'binh', 'an'],
  ['an', 'an', 'an'],
  [],
  ['chi'],
  ['a', 'b', 'c', 'd', 'b', 'e', 'f', 'a'],
];
for (const ids of cases) console.log(JSON.stringify(ids) + ' -> ' + longestUnique(ids));
const r = park(42);
const big = Array.from({ length: 200000 }, () => 'SV' + (r() % 5000));
console.log('large n=200000 (5000 distinct ids) -> ' + longestUnique(big));`,
});
const Q2_SOLUTION = `// O(n) thời gian, O(số mã khác nhau) bộ nhớ.
// Cửa sổ [left, r]; nhớ lần gặp CUỐI của mỗi mã. Gặp lại một mã còn NẰM TRONG cửa sổ ⇒ nhảy left qua nó.
// Điều kiện prev >= left là bắt buộc: không có nó, ở chữ "an" cuối của ['an','binh','binh','an'] left lùi về 1
// và đoạn 'binh','binh','an' (có hai 'binh') bị tính là 3 — đúng bẫy "abba" của bài 2.2.
function longestUnique(ids) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let r = 0; r < ids.length; r++) {
    const prev = last.get(ids[r]);
    if (prev !== undefined && prev >= left) left = prev + 1;
    last.set(ids[r], r);
    best = Math.max(best, r - left + 1);
  }
  return best;
}`;

/* ───────────── Q3 — tìm nhị phân trên không gian đáp án (Ch4) ───────────── */
const Q3_STARTER = starter({
  head: `
// Một nhóm đồ án có n đầu việc PHẢI làm theo đúng thứ tự cho sẵn; hours[i] là số giờ của việc i (không chia nhỏ được).
// Phải xong trong đúng tối đa \`days\` ngày. Mỗi ngày làm một số việc LIÊN TIẾP, tổng giờ trong ngày ≤ C.
// Tìm C NHỎ NHẤT.  1 ≤ days ≤ n ≤ 2·10⁵ · 1 ≤ hours[i] ≤ 10⁴`,
  stub: `
function minCapacity(hours, days) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5],
  [[3, 2, 2, 4, 1, 4], 3],
  [[1, 2, 3, 1, 1], 4],
  [[7], 1],
  [[5, 5, 5, 5], 4],
  [[5, 5, 5, 5], 1],
];
for (const [hours, days] of cases) console.log(JSON.stringify(hours) + ' days=' + days + ' -> ' + minCapacity(hours, days));
const r = park(99);
const big = Array.from({ length: 200000 }, () => 1 + (r() % 10000));
console.log('large n=200000 days=1234 -> ' + minCapacity(big, 1234));`,
});
const Q3_SOLUTION = `// O(n · log(tổng giờ)) thời gian, O(1) bộ nhớ thêm.
// C càng lớn thì càng cần ít ngày (đơn điệu) ⇒ tìm nhị phân C trong [max(hours), sum(hours)].
// Kiểm một C bằng tham lam: dồn việc vào ngày hiện tại tới khi sắp vượt C thì sang ngày mới — O(n).
// Không được sắp xếp hay dùng heap: đề bắt giữ nguyên thứ tự.
function minCapacity(hours, days) {
  let lo = 0;
  let hi = 0;
  for (const h of hours) { lo = Math.max(lo, h); hi += h; }
  const fits = (cap) => {
    let used = 1;
    let today = 0;
    for (const h of hours) {
      if (today + h > cap) { used++; today = 0; }
      today += h;
    }
    return used <= days;
  };
  // Khuôn nửa mở của bài 4.1: tìm giá trị đầu tiên mà fits(C) đúng.
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (fits(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`;

/* ───────────── Q4 — Kahn theo tầng (Ch7) ───────────── */
const Q4_STARTER = starter({
  head: `
// n học phần đánh số 0..n-1. prereq là danh sách cặp [before, after]: phải qua \`before\` thì mới học \`after\`.
// Mỗi học kỳ học được BAO NHIÊU học phần cũng được, miễn đã qua hết tiên quyết của chúng ở các kỳ TRƯỚC.
// Trả về số học kỳ ít nhất để học hết; nếu tiên quyết có chu trình (không thể học hết) thì trả -1.
// 1 ≤ n ≤ 10⁵ · 0 ≤ prereq.length ≤ 2·10⁵`,
  stub: `
function minSemesters(n, prereq) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
${PARK}
const cases = [
  [3, [[0, 2], [1, 2]]],
  [4, [[1, 0], [2, 0], [3, 1], [3, 2]]],
  [3, [[0, 1], [1, 2], [2, 0]]],
  [5, []],
  [6, [[0, 1], [1, 2], [2, 3], [4, 5], [5, 1]]],
  [4, [[0, 1], [1, 2], [2, 1], [0, 3]]],
];
for (const [n, prereq] of cases) console.log('n=' + n + ' ' + JSON.stringify(prereq) + ' -> ' + minSemesters(n, prereq));
const r = park(7);
const N = 100000;
const edges = [];
for (let i = 1; i < N; i++) {                      // mỗi học phần i có 2 tiên quyết ngẫu nhiên nằm trong 50 học phần đứng trước
  edges.push([i - 1 - (r() % Math.min(i, 50)), i]);
  edges.push([i - 1 - (r() % Math.min(i, 50)), i]);
}
console.log('large n=100000 edges=' + edges.length + ' -> ' + minSemesters(N, edges));
edges.push([N - 1, 0]);
console.log('large + one back edge -> ' + minSemesters(N, edges));`,
});
const Q4_SOLUTION = `// O(n + e) thời gian và bộ nhớ.
// Kahn theo TẦNG: tầng đầu = mọi học phần không có tiên quyết; học xong một tầng thì giảm bậc vào của các học phần
// sau nó, ai về 0 thì vào tầng kế. Số tầng = số học kỳ. Nếu không đặt được đủ n học phần thì phần còn lại nằm trên
// (hoặc phụ thuộc vào) một chu trình ⇒ -1. Dùng vòng lặp, không đệ quy: chuỗi tiên quyết ở ca lớn sâu khoảng 8.000 tầng.
function minSemesters(n, prereq) {
  const next = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);
  for (const [before, after] of prereq) {
    next[before].push(after);
    indegree[after]++;
  }
  let level = [];
  for (let i = 0; i < n; i++) if (indegree[i] === 0) level.push(i);
  let semesters = 0;
  let placed = 0;
  while (level.length > 0) {
    semesters++;
    const nextLevel = [];
    for (const course of level) {
      placed++;
      for (const after of next[course]) {
        indegree[after]--;
        if (indegree[after] === 0) nextLevel.push(after);
      }
    }
    level = nextLevel;
  }
  return placed === n ? semesters : -1;
}`;

/* ───────────── Q5 — đổi tiền: ít xu nhất + số cách (Ch9) ───────────── */
const Q5_STARTER = starter({
  head: `
// Máy bán nước trả lại tiền bằng các mệnh giá coins (mỗi loại dùng bao nhiêu đồng cũng được).
// minCoins(coins, amount): số đồng ÍT NHẤT để trả đúng amount, hoặc -1 nếu không trả đúng được.
// countWays(coins, amount): số CÁCH trả đúng amount, không tính thứ tự (1+2 và 2+1 là một cách).
// 1 ≤ coins.length ≤ 50 · 1 ≤ coins[i] ≤ 10⁴ (khác nhau) · 0 ≤ amount ≤ 10⁴ · số cách luôn < 2⁵³`,
  stub: `
function minCoins(coins, amount) {
  throw new Error('chưa cài đặt');
}

function countWays(coins, amount) {
  throw new Error('chưa cài đặt');
}`,
  tail: `
const cases = [
  [[1, 3, 4], 6],
  [[1, 2, 5], 5],
  [[2], 3],
  [[5, 10], 0],
  [[3, 7], 11],
  [[2, 5, 10, 20, 50], 100],
];
for (const [coins, amount] of cases) {
  console.log(JSON.stringify(coins) + ' amount=' + amount + ' -> min=' + minCoins(coins, amount) + ' ways=' + countWays(coins, amount));
}
console.log('large [1,5,10,25,50] amount=10000 -> min=' + minCoins([1, 5, 10, 25, 50], 10000) + ' ways=' + countWays([1, 5, 10, 25, 50], 10000));
console.log('large [7,11,13] amount=9999 -> min=' + minCoins([7, 11, 13], 9999) + ' ways=' + countWays([7, 11, 13], 9999));`,
});
const Q5_SOLUTION = `// Cả hai: O(amount · số mệnh giá) thời gian, O(amount) bộ nhớ, từ dưới lên (không đệ quy).
// minCoins: dp[a] = ít đồng nhất cho a; khởi đầu Infinity (không phải Number.MAX_SAFE_INTEGER rồi + 1).
// Tham lam "đồng lớn nhất trước" SAI với [1, 3, 4] ở 6: 4+1+1 (3 đồng) trong khi 3+3 chỉ 2 đồng.
function minCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// countWays: vòng MỆNH GIÁ đặt NGOÀI ⇒ mỗi tổ hợp được dựng theo một thứ tự mệnh giá cố định, đếm đúng một lần.
// Đảo hai vòng (tiền ngoài, xu trong) là đếm DÃY có thứ tự — kiểu LC 377 — và [1,2,5] ở 5 sẽ ra 9 thay vì 4.
function countWays(coins, amount) {
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) ways[a] += ways[a - coin];
  }
  return ways[amount];
}`;

export default {
  course: { slug: 'dsa-interview' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — five patterns, written to pass a large hidden-size test',
        'Thi thực hành — năm mẫu bài, viết đủ nhanh cho ca kiểm cỡ lớn',
      ),
      description: B(
        'Five JavaScript functions submitted as a .zip: prefix sums with remainders, a jumping sliding window, binary search on the answer, Kahn\'s topological sort by levels, and two coin-change DPs. Every problem ends with a generated case of up to 2·10⁵ elements, so the brute force will not finish — chapters 1, 2, 4, 7 and 9.',
        'Năm hàm JavaScript nộp dưới dạng .zip: tổng tiền tố với phần dư, cửa sổ trượt kiểu nhảy, tìm nhị phân trên đáp án, sắp xếp tô-pô Kahn theo tầng, và hai bài quy hoạch động đổi tiền. Bài nào cũng kết thúc bằng một ca sinh tự động tới 2·10⁵ phần tử, nên lời giải vét cạn sẽ không chạy kịp — các chương 1, 2, 4, 7 và 9.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q1 — Energy readings divisible by k (chapter 1).</b> ' + c('countDivisible(nums, k)') + ' counts the non-empty contiguous ranges of hours whose sum is divisible by <code>k</code>. Values can be negative and n reaches 2·10⁵, so checking every range (about 2·10¹⁰ pairs) is out.</p>' +
            '<p>Hint from chapter 1: two prefix sums with the same remainder mod k enclose a range divisible by k. Two traps the course measured: the map of remainders must start with the empty prefix, and JavaScript\'s <code>%</code> keeps the sign of the left operand (<code>-7 % 5</code> is <code>-2</code>).</p>',
            '<p><b>Câu 1 — Số liệu năng lượng chia hết cho k (chương 1).</b> ' + c('countDivisible(nums, k)') + ' đếm số đoạn giờ liên tiếp khác rỗng có tổng chia hết cho <code>k</code>. Giá trị có thể âm và n tới 2·10⁵, nên duyệt mọi đoạn (khoảng 2·10¹⁰ cặp) là không được.</p>' +
            '<p>Gợi ý từ chương 1: hai tổng tiền tố có cùng phần dư theo k thì kẹp giữa một đoạn chia hết cho k. Hai cái bẫy khoá đã đo: map phần dư phải khởi đầu bằng tiền tố rỗng, và <code>%</code> của JavaScript giữ dấu của vế trái (<code>-7 % 5</code> là <code>-2</code>).</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: "[4,5,0,-2,-3,1] k=5 -> 7\n[5] k=9 -> 0\n[-7,2] k=5 -> 1\n[0,0,0] k=3 -> 6\n[3,-3,3,-3] k=3 -> 10\nlarge n=200000 k=7919 -> 2527308",
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['idea', 'Uses prefix remainders counted in a map — O(n) — instead of checking ranges.', 'Dùng phần dư của tổng tiền tố đếm trong map — O(n) — thay vì duyệt từng đoạn.', 0.8],
            ['empty', 'The map starts with the empty prefix (remainder 0 seen once), so ranges starting at index 0 are counted.', 'Map khởi đầu với tiền tố rỗng (phần dư 0 đã gặp một lần), nên các đoạn bắt đầu ở chỉ số 0 được đếm.', 0.5],
            ['sign', 'Negative remainders are normalised, e.g. ((p % k) + k) % k, so -2 and 3 are the same class mod 5.', 'Phần dư âm được chuẩn hoá, ví dụ ((p % k) + k) % k, để -2 và 3 cùng một lớp theo 5.', 0.5],
            ['clean', 'Readable names and a one-line complexity comment.', 'Tên dễ đọc và một dòng chú thích độ phức tạp.', 0.2],
          ]),
        }),
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q2 — The longest run of card swipes without a repeat (chapter 2).</b> ' + c('longestUnique(ids)') + ' returns the length of the longest contiguous run of swipes in which no card id appears twice. The log can be empty and has up to 2·10⁵ swipes.</p>' +
            '<p>Use the "jump" form of the sliding window: remember where each id was last seen and move <code>left</code> past it. One sample is the chapter-2 trap in disguise: <code>an, binh, binh, an</code> — the answer is 2, and a window that lets <code>left</code> move backwards returns 3.</p>',
            '<p><b>Câu 2 — Chuỗi quẹt thẻ dài nhất không lặp (chương 2).</b> ' + c('longestUnique(ids)') + ' trả về độ dài đoạn quẹt thẻ liên tiếp dài nhất mà không mã thẻ nào xuất hiện hai lần. Nhật ký có thể rỗng và tới 2·10⁵ lượt quẹt.</p>' +
            '<p>Dùng dạng "nhảy" của cửa sổ trượt: nhớ lần gặp cuối của từng mã và đẩy <code>left</code> qua đó. Một ca mẫu là cái bẫy của chương 2 đội lốt: <code>an, binh, binh, an</code> — đáp án là 2, còn cửa sổ để <code>left</code> lùi lại sẽ trả 3.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: "[\"an\",\"binh\",\"chi\",\"an\",\"binh\",\"chi\",\"binh\",\"binh\"] -> 3\n[\"an\",\"binh\",\"binh\",\"an\"] -> 2\n[\"an\",\"an\",\"an\"] -> 1\n[] -> 0\n[\"chi\"] -> 1\n[\"a\",\"b\",\"c\",\"d\",\"b\",\"e\",\"f\",\"a\"] -> 6\nlarge n=200000 (5000 distinct ids) -> 293",
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['window', 'One pass with a last-seen map and a left edge — O(n) — not a Set rebuilt per start.', 'Một lượt duyệt với map lần-gặp-cuối và mép trái — O(n) — không dựng lại Set cho mỗi điểm bắt đầu.', 0.8],
            ['backwards', 'left only moves forward (prev >= left check, or left = max(left, prev + 1)); the an/binh/binh/an case returns 2.', 'left chỉ tiến (kiểm prev >= left, hoặc left = max(left, prev + 1)); ca an/binh/binh/an trả 2.', 0.7],
            ['edges', 'Empty log returns 0; a single swipe returns 1.', 'Nhật ký rỗng trả 0; một lượt quẹt trả 1.', 0.3],
            ['clean', 'Readable names and a one-line complexity comment.', 'Tên dễ đọc và một dòng chú thích độ phức tạp.', 0.2],
          ]),
        }),
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q3 — The smallest daily capacity (chapter 4).</b> A team must finish <code>n</code> tasks <b>in the given order</b> within <code>days</code> days; each day takes a contiguous block of tasks whose hours sum to at most <code>C</code>. ' + c('minCapacity(hours, days)') + ' returns the smallest <code>C</code>.</p>' +
            '<p>Notice the shape chapter 4.3 taught: "the smallest X such that it fits" with a monotone check — a larger C never needs more days. Search C between the longest task and the total, and check one C greedily in O(n). Sorting or a heap would solve a different problem: the order is fixed.</p>',
            '<p><b>Câu 3 — Sức chứa mỗi ngày nhỏ nhất (chương 4).</b> Một nhóm phải xong <code>n</code> đầu việc <b>theo đúng thứ tự cho sẵn</b> trong <code>days</code> ngày; mỗi ngày làm một khối việc liên tiếp có tổng giờ không quá <code>C</code>. ' + c('minCapacity(hours, days)') + ' trả về <code>C</code> nhỏ nhất.</p>' +
            '<p>Nhận ra dáng bài của chương 4.3: "X nhỏ nhất sao cho vừa" với một phép kiểm đơn điệu — C lớn hơn không bao giờ cần nhiều ngày hơn. Tìm C giữa việc dài nhất và tổng giờ, kiểm một C bằng tham lam O(n). Sắp xếp hay heap là giải bài khác: thứ tự đã cố định.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: "[1,2,3,4,5,6,7,8,9,10] days=5 -> 15\n[3,2,2,4,1,4] days=3 -> 6\n[1,2,3,1,1] days=4 -> 3\n[7] days=1 -> 7\n[5,5,5,5] days=4 -> 5\n[5,5,5,5] days=1 -> 20\nlarge n=200000 days=1234 -> 815632",
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['bounds', 'Binary search over the answer between max(hours) and sum(hours), with a loop that always terminates (half-open template, lo = mid + 1).', 'Tìm nhị phân trên đáp án giữa max(hours) và sum(hours), vòng lặp luôn dừng (khuôn nửa mở, lo = mid + 1).', 0.7],
            ['check', 'The feasibility check is a single greedy pass that keeps the order — O(n) per candidate.', 'Phép kiểm khả thi là một lượt tham lam giữ đúng thứ tự — O(n) mỗi ứng viên.', 0.7],
            ['edges', 'days = n returns the longest task; days = 1 returns the total.', 'days = n trả việc dài nhất; days = 1 trả tổng giờ.', 0.4],
            ['clean', 'Readable names and a one-line complexity comment.', 'Tên dễ đọc và một dòng chú thích độ phức tạp.', 0.2],
          ]),
        }),
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q4 — How many semesters? (chapter 7).</b> ' + c('minSemesters(n, prereq)') + ': each pair <code>[before, after]</code> means <code>before</code> must be passed in an EARLIER semester than <code>after</code>; any number of courses fit in one semester. Return the minimum number of semesters, or <code>-1</code> when the prerequisites contain a cycle.</p>' +
            '<p>Kahn\'s algorithm by levels: the first semester is every course with no prerequisite; finishing a level lowers the in-degree of what comes after it. Lesson 7.3 showed why the cycle check matters — one wrong edge in the FPTU chart left 9 subjects stuck, including some that are not on the loop. The large case has a prerequisite chain about 8,000 courses deep: do not recurse.</p>',
            '<p><b>Câu 4 — Bao nhiêu học kỳ? (chương 7).</b> ' + c('minSemesters(n, prereq)') + ': mỗi cặp <code>[before, after]</code> nghĩa là <code>before</code> phải qua ở một học kỳ TRƯỚC <code>after</code>; một học kỳ học bao nhiêu học phần cũng được. Trả về số học kỳ ít nhất, hoặc <code>-1</code> khi tiên quyết có chu trình.</p>' +
            '<p>Thuật toán Kahn theo tầng: học kỳ đầu là mọi học phần không có tiên quyết; xong một tầng thì giảm bậc vào của các học phần phía sau. Bài 7.3 cho thấy vì sao phép kiểm chu trình quan trọng — một cạnh sai trong sơ đồ môn FPTU làm 9 môn bị kẹt, kể cả những môn không nằm trên vòng. Ca lớn có chuỗi tiên quyết sâu khoảng 8.000 học phần: đừng đệ quy.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: "n=3 [[0,2],[1,2]] -> 2\nn=4 [[1,0],[2,0],[3,1],[3,2]] -> 3\nn=3 [[0,1],[1,2],[2,0]] -> -1\nn=5 [] -> 1\nn=6 [[0,1],[1,2],[2,3],[4,5],[5,1]] -> 5\nn=4 [[0,1],[1,2],[2,1],[0,3]] -> -1\nlarge n=100000 edges=199998 -> 8027\nlarge + one back edge -> -1",
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['kahn', 'Adjacency list + in-degrees + level-by-level processing — O(n + e), iterative.', 'Danh sách kề + bậc vào + xử lý từng tầng — O(n + e), không đệ quy.', 0.8],
            ['cycle', 'A cycle is detected by counting placed courses (placed < n ⇒ -1), which also covers courses that only depend on the loop.', 'Chu trình được phát hiện bằng cách đếm số học phần đã xếp (placed < n ⇒ -1), bao luôn cả học phần chỉ phụ thuộc vào vòng.', 0.6],
            ['queue', 'No O(n) shift() per dequeue — a level array or a head index.', 'Không dùng shift() O(n) mỗi lần lấy ra — dùng mảng theo tầng hoặc chỉ số đầu.', 0.4],
            ['clean', 'Readable names and a one-line complexity comment.', 'Tên dễ đọc và một dòng chú thích độ phức tạp.', 0.2],
          ]),
        }),
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q5 — Change from a vending machine (chapter 9).</b> Write two functions over the same coins:</p>' +
            '<ul>' +
            '<li>' + c('minCoins(coins, amount)') + ' — the fewest coins that make exactly <code>amount</code>, or <code>-1</code>;</li>' +
            '<li>' + c('countWays(coins, amount)') + ' — how many combinations make <code>amount</code>, where order does not matter (1+2 and 2+1 are one way).</li>' +
            '</ul>' +
            '<p>"Largest coin first" fails on <code>[1, 3, 4]</code> — lesson 9.5 found 2,499 bad amounts out of 10,000 for that machine. For the count, chapter 9 measured what happens when the two loops are swapped: <code>[1, 2, 5]</code> at 5 gives 9 instead of 4, because it counts ordered sequences. Build both tables bottom-up.</p>',
            '<p><b>Câu 5 — Tiền thối của máy bán nước (chương 9).</b> Viết hai hàm trên cùng bộ mệnh giá:</p>' +
            '<ul>' +
            '<li>' + c('minCoins(coins, amount)') + ' — số đồng ít nhất để ra đúng <code>amount</code>, hoặc <code>-1</code>;</li>' +
            '<li>' + c('countWays(coins, amount)') + ' — số tổ hợp ra đúng <code>amount</code>, không tính thứ tự (1+2 và 2+1 là một cách).</li>' +
            '</ul>' +
            '<p>"Đồng lớn nhất trước" sai với <code>[1, 3, 4]</code> — bài 9.5 tìm ra 2.499 số tiền sai trên 10.000 cho đúng cái máy đó. Với phần đếm, chương 9 đã đo chuyện xảy ra khi đảo hai vòng lặp: <code>[1, 2, 5]</code> ở 5 ra 9 thay vì 4, vì nó đếm các dãy có thứ tự. Dựng cả hai bảng từ dưới lên.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: "[1,3,4] amount=6 -> min=2 ways=4\n[1,2,5] amount=5 -> min=1 ways=4\n[2] amount=3 -> min=-1 ways=0\n[5,10] amount=0 -> min=0 ways=1\n[3,7] amount=11 -> min=-1 ways=0\n[2,5,10,20,50] amount=100 -> min=2 ways=196\nlarge [1,5,10,25,50] amount=10000 -> min=200 ways=6794128501\nlarge [7,11,13] amount=9999 -> min=771 ways=50095",
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['min', 'minCoins is a bottom-up DP over amounts (not greedy), with an "impossible" sentinel that cannot overflow or win a min (Infinity), returning -1 when unreachable.', 'minCoins là DP từ dưới lên theo số tiền (không tham lam), với giá trị "không thể" không tràn và không thắng được phép min (Infinity), trả -1 khi không ra được.', 0.8],
            ['ways', 'countWays has the coin loop outside the amount loop, so each combination is counted once.', 'countWays đặt vòng mệnh giá ngoài vòng số tiền, nên mỗi tổ hợp chỉ được đếm một lần.', 0.7],
            ['edges', 'amount = 0 gives min 0 and one way; an impossible amount gives -1 and 0 ways.', 'amount = 0 cho min 0 và một cách; số tiền không ra được cho -1 và 0 cách.', 0.3],
            ['clean', 'Readable names and a one-line complexity comment.', 'Tên dễ đọc và một dòng chú thích độ phức tạp.', 0.2],
          ]),
        }),
      ],
    },
  ],
};
