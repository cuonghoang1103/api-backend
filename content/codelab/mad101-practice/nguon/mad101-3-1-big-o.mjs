/** MAD101 · 3.1 — Growth of functions and Big-O. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);
const B1 = tinh({
  tieuDe: 'Big-O 1 — Definitions: O, Ω, Θ',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept check on asymptotic notation (Rosen §3.2).</p>', '<p>Kiểm tra khái niệm ký hiệu tiệm cận (Rosen §3.2).</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['f(n) is O(g(n)) means …', 'f(n) là O(g(n)) nghĩa là …'], ['f(n) ≤ C·g(n) for all n > k, for some constants C and k', 'f(n) = g(n) for all n', 'f(n) ≥ C·g(n) for large n', 'f and g have the same derivative'], ['Big-O is an upper bound that holds from some point on, up to a constant factor.', 'Big-O là chặn trên đúng từ một điểm trở đi, sai khác một hệ số hằng.']),
    q('c2', ['Which is the tightest simple bound on 4n³ + 100n² + 7?', 'Chặn đơn giản chặt nhất cho 4n³ + 100n² + 7 là?'], ['O(n³)', 'O(n²)', 'O(n⁴) only', 'O(2ⁿ) only'], ['Drop lower-order terms and the constant factor: n³ dominates.', 'Bỏ các số hạng bậc thấp và hệ số hằng: n³ trội hơn.']),
    q('c3', ['f(n) is Θ(g(n)) when …', 'f(n) là Θ(g(n)) khi …'], ['f is both O(g) and Ω(g)', 'f is O(g) only', 'f is smaller than g', 'f(n) = g(n)'], ['Θ is a tight bound: both upper and lower.', 'Θ là chặn chặt: vừa chặn trên vừa chặn dưới.']),
    q('c4', ['Which of the following grows fastest?', 'Hàm nào tăng nhanh nhất?'], ['n!', '2ⁿ', 'n³', 'n log n'], ['Factorial beats exponential, which beats every polynomial.', 'Giai thừa vượt luỹ thừa, luỹ thừa vượt mọi đa thức.']),
    q('c5', ['An algorithm that runs in 5n² + 3n steps is …', 'Thuật toán chạy 5n² + 3n bước là …'], ['O(n²) and also O(n³)', 'O(n) only', 'O(n²) but not O(n³)', 'O(log n)'], ['Big-O is an upper bound: any larger class is also a valid, though loose, bound.', 'Big-O là chặn trên: lớp lớn hơn cũng là chặn hợp lệ nhưng lỏng.']),
    q('c6', ['log₂ n and log₁₀ n differ by …', 'log₂ n và log₁₀ n khác nhau bởi …'], ['a constant factor, so they are the same Big-O class', 'a polynomial factor', 'an exponent', 'nothing — they are equal'], ['log_a n = log_b n / log_b a — only a constant.', 'log_a n = log_b n / log_b a — chỉ khác một hằng.']),
  ],
  goiY: ['Big-O ignores constants and lower-order terms.', 'Order to remember: 1 < log n < n < n log n < n² < n³ < 2ⁿ < n!.'],
  loiHayGap: ['Believing O(n²) means “exactly n² steps”.', 'Keeping the base of a logarithm inside the Big-O class.'],
  thuatNgu: [tn('asymptotic', 'tiệm cận'), tn('upper bound', 'chặn trên'), tn('tight bound', 'chặn chặt')],
  khaiNiem: ['Big-O', 'Theta', 'Omega'],
});

/* count loop operations */
const LP = [
  ['for i in 0..n−1: work()', 'single', 'O(n)'], ['for i in 0..n−1: for j in 0..n−1: work()', 'double', 'O(n²)'],
  ['for i in 0..n−1: for j in 0..i−1: work()', 'triangle', 'O(n²)'], ['for (i = 1; i < n; i *= 2): work()', 'doubling', 'O(log n)'],
  ['for i in 0..n−1: for (j = 1; j < n; j *= 2): work()', 'n-log-n', 'O(n log n)'], ['for i in 0..n−1, j in 0..n−1, k in 0..n−1: work()', 'triple', 'O(n³)'],
];
const BIGO = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'O(n!)'];
const NV = 16;
const B2 = tinh({
  tieuDe: 'Big-O 2 — Count the work() calls',
  doKho: 'EASY', phut: 12,
  moTa: bi(`<p>For n = ${NV}, how many times is <code>work()</code> called by each loop pattern? Then name the Big-O class of the pattern. (Count by running the loops mentally or on paper.)</p>`, `<p>Với n = ${NV}, <code>work()</code> được gọi bao nhiêu lần ở mỗi mẫu vòng lặp? Rồi gọi tên lớp Big-O. (Đếm bằng cách chạy tay vòng lặp.)</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Loop patterns, n = 16', 'Mẫu vòng lặp, n = 16'], [{ ma: 'c', ten: 'Pattern' }, { ma: 'k', ten: 'Calls for n = 16' }, { ma: 'o', ten: 'Class', luaChon: BIGO }],
    LP.map(([t, kind, cls]) => ({ o: { c: t }, a: { k: String(S.loopCount(kind, NV)), o: cls } })),
    [LP.map(([t, kind, cls]) => `${t}: ${S.loopCount(kind, NV)} calls, ${cls}`).join('; ') + '.', LP.map(([t, kind, cls]) => `${t}: ${S.loopCount(kind, NV)} lần gọi, ${cls}`).join('; ') + '.'])],
  goiY: ['Triangular loops run 0 + 1 + … + (n−1) = n(n−1)/2 times.', 'A counter that doubles up to n runs ⌈log₂ n⌉ times.'],
  loiHayGap: ['Counting the doubling loop as n/2 iterations.', 'Counting the triangular nested loop as n² (it is n(n−1)/2 — same class, different count).'],
  thuatNgu: [tn('basic operation', 'phép toán cơ bản')],
  khaiNiem: ['counting operations'],
});

/* classify expressions */
const EXPR = [
  ['3n² + 5n log n + 7', 'O(n²)'], ['100n + 2000', 'O(n)'], ['n log n + n', 'O(n log n)'], ['2ⁿ + n¹⁰⁰', 'O(2ⁿ)'],
  ['(n + 1)(n + 2)(n + 3)', 'O(n³)'], ['5 log n + 1000', 'O(log n)'], ['n! + 2ⁿ', 'O(n!)'], ['7777', 'O(1)'], ['(n² + 3n)/n', 'O(n)'],
];
const B3 = tinh({
  tieuDe: 'Big-O 3 — Classify the expression',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Pick the tightest Big-O class from the drop-down for each expression. Simplify first (expand products, cancel fractions).</p>', '<p>Chọn lớp Big-O chặt nhất từ danh sách cho mỗi biểu thức. Rút gọn trước (khai triển tích, giản ước phân số).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Tightest Big-O class', 'Lớp Big-O chặt nhất'], [{ ma: 'e', ten: 'f(n)' }, { ma: 'o', ten: 'Class', luaChon: BIGO }], EXPR.map(([e, o]) => ({ o: { e }, a: { o } })),
    ['(n+1)(n+2)(n+3) expands to n³ + 6n² + 11n + 6; (n² + 3n)/n = n + 3. ' + EXPR.map(([e, o]) => `${e}: ${o}`).join('; ') + '.', EXPR.map(([e, o]) => `${e}: ${o}`).join('; ') + '.'])],
  goiY: ['Expand/simplify first; then keep only the fastest-growing term.', 'Any polynomial is smaller than 2ⁿ eventually, even n¹⁰⁰.'],
  loiHayGap: ['Judging (n² + 3n)/n as O(n²) without cancelling.', 'Thinking n¹⁰⁰ eventually beats 2ⁿ.'],
  thuatNgu: [tn('dominant term', 'số hạng trội')],
  khaiNiem: ['Big-O classification'],
});

/* numeric facts */
const cr1 = S.crossover((n) => Math.pow(2, n), (n) => n * n * n, 30);
let perm = -1; for (let n = 1; n <= 60; n++) { let ok = true; for (let m = n; m <= 60; m++) if (!(Math.pow(2, m) > m ** 3)) ok = false; if (ok) { perm = n; break; } }
assert.equal(perm, 10);
const sc = S.searchCost('binary', 1000000);
const B4 = tinh({
  tieuDe: 'Big-O 4 — Numbers behind the notation',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Concrete numbers show why Big-O matters: comparison counts of searching and sorting, and where an exponential overtakes a polynomial.</p>', '<p>Con số cụ thể cho thấy vì sao Big-O quan trọng: số phép so sánh khi tìm kiếm và sắp xếp, và điểm hàm mũ vượt đa thức.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['Linear search of a 1,024-element array needs at most … comparisons.', 'Tìm tuyến tính trong mảng 1.024 phần tử cần tối đa … phép so sánh.'], 1024, [10, 512, 2048], f2, ['One comparison per element in the worst case: 1,024.', 'Tối đa mỗi phần tử một phép so sánh: 1.024.']),
    mcNum('c2', ['Binary search of a sorted array of 1,000,000 elements needs at most about … comparisons.', 'Tìm nhị phân trong mảng đã sắp 1.000.000 phần tử cần tối đa khoảng … phép so sánh.'], sc, [1000, 500000, 100], f2, [`⌊log₂ 1,000,000⌋ + 1 = ${sc}.`, `⌊log₂ 1.000.000⌋ + 1 = ${sc}.`]),
    mcNum('c3', ['Bubble sort on n = 40 elements always performs … comparisons (no early exit).', 'Sắp xếp nổi bọt n = 40 luôn thực hiện … phép so sánh (không dừng sớm).'], S.sortCost('bubble', 40), [40 * 40, 40 * 39, 40 * Math.log2(40)], (x) => String(Math.round(x)), [`n(n−1)/2 = ${S.sortCost('bubble', 40)}.`, `n(n−1)/2 = ${S.sortCost('bubble', 40)}.`]),
    mcNum('c4', ['An algorithm takes 1 ms for n = 1,000 and is Θ(n²). Estimated time for n = 10,000 is … ms.', 'Thuật toán mất 1 ms với n = 1.000 và là Θ(n²). Thời gian ước tính với n = 10.000 là … ms.'], 100, [10, 1000, 20], f2, ['10× the input means 10² = 100× the time.', 'Đầu vào gấp 10 thì thời gian gấp 10² = 100 lần.']),
    mcNum('c5', ['The smallest n from which 2ⁿ > n³ holds for every larger n is …', 'n nhỏ nhất từ đó 2ⁿ > n³ đúng với mọi n lớn hơn là …'], perm, [cr1 + 1, 8, 12], f2, [`2⁹ = 512 < 729 = 9³ but 2¹⁰ = 1024 > 1000 = 10³, and from then on 2ⁿ stays ahead (n = ${perm}). (Careful: n = 1 also satisfies it, but not n = 2…9.)`, `2⁹ = 512 < 729 nhưng 2¹⁰ = 1024 > 1000, và từ đó 2ⁿ luôn dẫn trước (n = ${perm}).`]),
    mcNum('c6', ['How many times does a loop run that halves n = 1,000 until it reaches 1 (i = ⌊i/2⌋ starting at 1000)?', 'Vòng lặp chia đôi n = 1.000 đến khi bằng 1 (i = ⌊i/2⌋ bắt đầu từ 1000) chạy bao nhiêu lần?'], 9, [10, 500, 1000], f2, ['1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1: 9 halvings.', '1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1: 9 lần chia đôi.']),
  ],
  goiY: ['Multiplying the input by 10 multiplies a Θ(n²) cost by 100, a Θ(n) cost by 10, and adds ≈ 3.3 to a Θ(log n) cost.', 'For crossovers, evaluate both sides for n = 8…12.'],
  loiHayGap: ['Predicting the time of a quadratic algorithm by multiplying by 10.', 'Forgetting that 2ⁿ < n³ for 2 ≤ n ≤ 9.'],
  thuatNgu: [tn('worst case', 'trường hợp xấu nhất')],
  khaiNiem: ['concrete costs'],
});

/* order growth */
const GROW = [['1', 'constant'], ['log n', ''], ['n', ''], ['n log n', ''], ['n²', ''], ['2ⁿ', ''], ['n!', '']];
const B5 = tinh({
  tieuDe: 'Big-O 5 — Rank the growth rates',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Put the functions in increasing order of growth rate (slowest first).</p>', '<p>Sắp các hàm theo tốc độ tăng dần (chậm nhất trước).</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Slowest to fastest.', 'Từ chậm nhất đến nhanh nhất.'], ['1', 'log n', 'n', 'n log n', 'n²', '2ⁿ', 'n!'], ['Standard hierarchy: constant, logarithmic, linear, linearithmic, quadratic, exponential, factorial.', 'Thứ bậc chuẩn: hằng, logarit, tuyến tính, n log n, bình phương, mũ, giai thừa.'], 3),
    ord('q2', ['Slowest to fastest (harder).', 'Từ chậm nhất đến nhanh nhất (khó hơn).'], ['log n', '√n', 'n', 'n log n', 'n^1.5', 'n²', 'n³'], ['√n = n^0.5 < n < n log n < n^1.5 < n² < n³; logarithm is below every positive power.', 'n^0,5 < n < n log n < n^1,5 < n² < n³; logarit nằm dưới mọi luỹ thừa dương.'], 2),
    ord('q3', ['Slowest to fastest (exponential family).', 'Từ chậm nhất đến nhanh nhất (họ hàm mũ).'], ['n¹⁰', '1.5ⁿ', '2ⁿ', '3ⁿ', 'n!', 'nⁿ'], ['Larger base grows faster; n! < nⁿ.', 'Cơ số lớn hơn tăng nhanh hơn; n! < nⁿ.'], 2),
  ],
  goiY: ['Compare at n = 1000 mentally: log n ≈ 10, √n ≈ 32, n log n ≈ 10,000.', 'Any exponential with base > 1 beats every polynomial.'],
  loiHayGap: ['Placing n log n above n².', 'Believing a logarithm can beat √n.'],
  thuatNgu: [tn('growth rate', 'tốc độ tăng')],
  khaiNiem: ['growth hierarchy'],
});
void GROW;

/* code: insertion sort comparisons */
function insertionSortComparisons(arr) {
  var a = arr.slice(), c = 0;
  for (var i = 1; i < a.length; i++) {
    var key = a[i], j = i - 1;
    while (j >= 0) {
      c++;
      if (a[j] > key) { a[j + 1] = a[j]; j--; } else break;
    }
    a[j + 1] = key;
  }
  return c;
}
const B6 = jsDe({
  tieuDe: 'Big-O 6 — Count the comparisons of insertion sort',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Insertion sort scans each element leftwards until it finds one that is not larger. Write <code>insertionSortComparisons(arr)</code> that runs the algorithm on a copy of <code>arr</code> and returns the exact number of <em>element comparisons</em> <code>a[j] &gt; key</code> that were executed. A sorted array costs n − 1 comparisons (best case, Θ(n)); a reversed array costs n(n − 1)/2 (worst case, Θ(n²)).</p>', '<p>Sắp xếp chèn lùi mỗi phần tử sang trái đến khi gặp phần tử không lớn hơn. Viết <code>insertionSortComparisons(arr)</code> chạy thuật toán trên bản sao của <code>arr</code> và trả số <em>phép so sánh phần tử</em> <code>a[j] &gt; key</code> đã thực hiện. Mảng đã sắp tốn n − 1 phép (tốt nhất, Θ(n)); mảng đảo ngược tốn n(n − 1)/2 (xấu nhất, Θ(n²)).</p>'),
  yeuCau: [bi('Do not mutate the input array.', 'Không sửa mảng đầu vào.')],
  viDu: [{ input: 'insertionSortComparisons([1,2,3,4])', output: '3', explanation: 'Best case: one comparison per inserted element.|||Tốt nhất: mỗi phần tử chèn một phép so sánh.' }, { input: 'insertionSortComparisons([4,3,2,1])', output: '6', explanation: 'Worst case: 1 + 2 + 3 = 6.|||Xấu nhất: 1 + 2 + 3 = 6.' }],
  goiY: ['Increment the counter every time you evaluate a[j] > key, including the last failing test.', 'Stop scanning when a[j] <= key or j < 0 (no comparison is made when j < 0).'],
  loiHayGap: ['Counting only the successful shifts.', 'Counting a comparison after j has fallen below 0.'],
  giaiThich: '<p>The cost depends on the input order, which is why we quote best, average and worst cases separately: Θ(n), Θ(n²), Θ(n²).</p>',
  khaiNiem: ['best and worst case', 'insertion sort'],
  fn: 'insertionSortComparisons',
  dau: 'function insertionSortComparisons(arr) {\n  return 0;\n}\n',
  giaiMa: dat(insertionSortComparisons, 'insertionSortComparisons'),
  ref: insertionSortComparisons,
  cases: [{ args: [[1, 2, 3, 4]] }, { args: [[4, 3, 2, 1]] }, { args: [[2, 1, 3, 1]] }, { args: [[]], an: true }, { args: [[5, 1, 4, 2, 8, 3]], an: true }, { args: [[7]], an: true }, { args: [[3, 3, 3, 3]], an: true }],
});

/* code: crossover */
function permanentCrossover(a, b) {
  var cost = {
    'log n': function (n) { return Math.log2(n); },
    'n': function (n) { return n; },
    'n log n': function (n) { return n * Math.log2(n); },
    'n^2': function (n) { return n * n; },
    'n^3': function (n) { return n * n * n; },
    '2^n': function (n) { return Math.pow(2, n); },
    'n!': function (n) { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; },
  };
  var best = -1;
  for (var n = 60; n >= 2; n--) {
    if (cost[a](n) > cost[b](n)) best = n; else break;
  }
  return best;
}
const B7 = jsDe({
  tieuDe: 'Big-O 7 — Find the point where one cost overtakes another',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>The cost model of an algorithm is one of <code>"log n"</code> (log₂), <code>"n"</code>, <code>"n log n"</code>, <code>"n^2"</code>, <code>"n^3"</code>, <code>"2^n"</code> or <code>"n!"</code>. Write <code>permanentCrossover(a, b)</code> returning the smallest integer <code>N</code> in 2…60 such that cost<sub>a</sub>(n) &gt; cost<sub>b</sub>(n) for <em>every</em> n from N to 60 inclusive. If a does not stay above b up to 60 (for example a grows slower), return −1. Beware: a(n) might exceed b(n) for small n and then fall behind — only a <em>permanent</em> takeover counts.</p>', '<p>Mô hình chi phí của thuật toán là một trong <code>"log n"</code> (log₂), <code>"n"</code>, <code>"n log n"</code>, <code>"n^2"</code>, <code>"n^3"</code>, <code>"2^n"</code>, <code>"n!"</code>. Viết <code>permanentCrossover(a, b)</code> trả số nguyên <code>N</code> nhỏ nhất trong 2…60 sao cho cost<sub>a</sub>(n) &gt; cost<sub>b</sub>(n) với <em>mọi</em> n từ N đến 60. Nếu a không giữ trên b đến 60 (ví dụ a tăng chậm hơn) trả −1. Chú ý: a(n) có thể vượt b(n) ở n nhỏ rồi tụt lại — chỉ vượt <em>vĩnh viễn</em> mới tính.</p>'),
  yeuCau: [bi('Scan n downwards from 60 while a is still above b.', 'Duyệt n giảm dần từ 60 chừng nào a còn trên b.')],
  viDu: [{ input: 'permanentCrossover("2^n", "n^3")', output: String(permanentCrossover('2^n', 'n^3')), explanation: '2^10 = 1024 > 1000 and 2^n stays ahead afterwards.|||2^10 = 1024 > 1000 và 2^n luôn dẫn trước sau đó.' }, { input: 'permanentCrossover("n", "n^2")', output: String(permanentCrossover('n', 'n^2')), explanation: 'n is never above n² for n ≥ 2.|||n không bao giờ trên n² khi n ≥ 2.' }],
  goiY: ['Start at n = 60: if a(60) <= b(60) the answer is −1; otherwise walk down until the inequality fails.', 'Use a lookup object from names to functions.'],
  loiHayGap: ['Returning the first n where a(n) > b(n) without checking that it stays true for every larger n (compare n^3 with 2^n: n^3 leads for 2 ≤ n ≤ 9 but loses afterwards).', 'Computing 60! with an integer type that overflows — JavaScript numbers are doubles and handle it.'],
  giaiThich: '<p>Asymptotic dominance only needs the inequality to hold from some N onwards; scanning downward from the end finds the earliest N after which it never fails.</p>',
  khaiNiem: ['crossover', 'asymptotic dominance'],
  fn: 'permanentCrossover',
  dau: 'function permanentCrossover(a, b) {\n  return -1;\n}\n',
  giaiMa: dat(permanentCrossover, 'permanentCrossover'),
  ref: permanentCrossover,
  cases: [{ args: ['2^n', 'n^3'] }, { args: ['n', 'n^2'] }, { args: ['n^2', 'n log n'] }, { args: ['n!', '2^n'] }, { args: ['n log n', 'n'], an: true }, { args: ['n^3', '2^n'], an: true }, { args: ['2^n', 'n^2'], an: true }, { args: ['n^2', 'log n'], an: true }],
});
void ord;

export default doiDau({
  slug: 'mad101-3-1-big-o',
  ten: '3.1 Growth of functions & Big-O',
  khoa: KHOA,
  baiHoc: 'mad101-3-1-big-o',
  de: [B1, B2, B3, B4, B5, B6, B7],
});
