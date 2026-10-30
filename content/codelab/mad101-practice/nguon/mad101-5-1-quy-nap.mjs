/** MAD101 · 5.1 — Mathematical induction, recursive definitions and recurrences. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);
const I1 = tinh({
  tieuDe: 'Induction 1 — Structure of an induction proof',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>What each part of an induction proof must contain, and when to use strong induction or structural induction.</p>', '<p>Mỗi phần của một chứng minh quy nạp phải có gì, và khi nào dùng quy nạp mạnh hay quy nạp cấu trúc.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['To prove ∀n ≥ 1 P(n) by (weak) induction you prove …', 'Để chứng minh ∀n ≥ 1 P(n) bằng quy nạp (yếu) ta chứng minh …'], ['P(1), and P(k) → P(k+1) for every k ≥ 1', 'P(k) for every k directly', 'P(1) and P(2) only', 'P(k+1) → P(k)'], ['Basis step plus inductive step: the domino chain.', 'Bước cơ sở cộng bước quy nạp: chuỗi domino.']),
    q('c2', ['In the inductive step, the inductive hypothesis is …', 'Trong bước quy nạp, giả thiết quy nạp là …'], ['the assumption that P(k) is true', 'the claim P(k+1)', 'the basis step', 'a proof that P(k) is false'], ['We assume P(k) and must derive P(k+1) from it.', 'Ta giả sử P(k) rồi suy ra P(k+1) từ nó.']),
    q('c3', ['Strong induction assumes …', 'Quy nạp mạnh giả sử …'], ['P(j) for all j with base ≤ j ≤ k', 'only P(k)', 'P(k+1)', 'nothing'], ['The step for k+1 may use every earlier case — needed when f(k+1) depends on f(k−1), f(k−5), …', 'Bước k+1 được dùng mọi trường hợp trước — cần khi f(k+1) phụ thuộc f(k−1), f(k−5), …']),
    q('c4', ['Proving a statement for n = 1 … 1000 by checking each one does NOT prove it for all n because …', 'Kiểm tra từng n = 1 … 1000 KHÔNG chứng minh được cho mọi n vì …'], ['a counter-example may exist beyond the checked range', 'checking is always invalid', 'induction only works up to 1000', 'basis steps must use n = 0'], ['Examples never constitute a proof of a universal statement.', 'Ví dụ không bao giờ là chứng minh cho mệnh đề phổ quát.']),
    q('c5', ['A recursive definition of a function on nonnegative integers needs …', 'Định nghĩa đệ quy của hàm trên số nguyên không âm cần …'], ['initial value(s) and a rule using smaller arguments', 'only a rule', 'only initial values', 'a loop'], ['Without the initial values the recursion never ends.', 'Không có giá trị đầu thì đệ quy không dừng.']),
    q('c6', ['Structural induction is used to prove properties of …', 'Quy nạp cấu trúc dùng để chứng minh tính chất của …'], ['recursively defined sets (trees, strings, formulas)', 'real numbers', 'only integers', 'finite sums only'], ['Basis: the base elements; step: every constructor preserves the property.', 'Cơ sở: các phần tử gốc; bước: mọi phép dựng đều bảo toàn tính chất.']),
  ],
  goiY: ['Basis + step; name the induction variable and the statement P(n) explicitly.', 'Use strong induction when the recurrence refers to more than the previous term.'],
  loiHayGap: ['Assuming P(k+1) in order to prove P(k+1) (circular reasoning).', 'Omitting the basis step.'],
  thuatNgu: [tn('basis step', 'bước cơ sở'), tn('inductive hypothesis', 'giả thiết quy nạp'), tn('strong induction', 'quy nạp mạnh'), tn('structural induction', 'quy nạp cấu trúc')],
  khaiNiem: ['induction'],
});

/* evaluate recursive definitions */
const RDEFS = [
  ['f(0) = 2,  f(n) = 3·f(n−1) + 1', (n) => S.fRec(n)], ['a(0) = 1, a(1) = 1,  a(n) = a(n−1) + a(n−2)', (n) => S.fib(n + 1)], ['g(0) = 0,  g(n) = g(n−1) + 2n − 1', (n) => n * n],
  ['h(1) = 1,  h(n) = n·h(n−1)', (n) => S.factorial(n)], ['t(0) = 1,  t(n) = 2·t(n−1) + n', (n) => S.recurrence([2], [1], n, (i) => i)],
];
const I2 = tinh({
  tieuDe: 'Induction 2 — Evaluate recursive definitions',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Compute the requested values by applying the recursive rule step by step (do not guess a closed form first). Note: for h the first index is 1.</p>', '<p>Tính các giá trị yêu cầu bằng cách áp quy tắc đệ quy từng bước (đừng đoán công thức đóng trước). Lưu ý: h bắt đầu từ chỉ số 1.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Recursive values', 'Giá trị đệ quy'], [{ ma: 'd', ten: 'Definition' }, { ma: 'v3', ten: 'value at n = 3' }, { ma: 'v5', ten: 'value at n = 5' }, { ma: 'v7', ten: 'value at n = 7' }],
    RDEFS.map(([d, f]) => ({ o: { d }, a: { v3: String(f(3)), v5: String(f(5)), v7: String(f(7)) } })),
    [RDEFS.map(([d, f]) => `${d}: n=3 → ${f(3)}, n=5 → ${f(5)}, n=7 → ${f(7)}`).join('; ') + '.', RDEFS.map(([d, f]) => `${d}: n=3 → ${f(3)}, n=5 → ${f(5)}, n=7 → ${f(7)}`).join('; ') + '.'])],
  goiY: ['Write the list f(0), f(1), f(2), … in order; each entry uses only the previous one(s).', 'Check g with the closed form n² and h with n!.'],
  loiHayGap: ['Starting a(n) from the wrong initial pair: a(0) = a(1) = 1 means a(2) = 2.', 'Applying the rule to n before the previous value is known.'],
  thuatNgu: [tn('recurrence', 'hệ thức truy hồi')],
  khaiNiem: ['recursive definition'],
});
assert.equal(S.recurrence([2], [1], 3, (i) => i), 2 * (2 * (2 * 1 + 1) + 2) + 3);

/* sums */
const SUMS = [['Σ i  (i = 1…n)', (n) => S.sumPow(1, n), 'n(n+1)/2'], ['Σ i²  (i = 1…n)', (n) => S.sumPow(2, n), 'n(n+1)(2n+1)/6'], ['Σ i³  (i = 1…n)', (n) => S.sumPow(3, n), '[n(n+1)/2]²'], ['Σ (2i − 1)  (i = 1…n)', (n) => n * n, 'n²'], ['Σ 2^i  (i = 0…n)', (n) => 2 ** (n + 1) - 1, '2^(n+1) − 1']];
SUMS.forEach(([, f]) => assert.ok(f(10) > 0));
const I3 = tinh({
  tieuDe: 'Induction 3 — Sum formulas: evaluate the closed form',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Standard sums that are proved by induction. Evaluate each for n = 10 and n = 20 (use the closed form shown in the answer after submitting, or add the terms).</p>', '<p>Các tổng chuẩn được chứng minh bằng quy nạp. Tính mỗi tổng với n = 10 và n = 20 (dùng công thức đóng hoặc cộng từng số hạng).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Closed forms', 'Công thức đóng'], [{ ma: 's', ten: 'Sum' }, { ma: 'a', ten: 'n = 10' }, { ma: 'b', ten: 'n = 20' }],
    SUMS.map(([t, f]) => ({ o: { s: t }, a: { a: String(f(10)), b: String(f(20)) } })),
    [SUMS.map(([t, f, c]) => `${t} = ${c}: n=10 → ${f(10)}, n=20 → ${f(20)}`).join('; ') + '.', SUMS.map(([t, f, c]) => `${t} = ${c}: n=10 → ${f(10)}, n=20 → ${f(20)}`).join('; ') + '.'])],
  goiY: ['Memorise Σi, Σi², Σi³ and the geometric sum.', 'Check: Σ(2i − 1) is the sum of the first n odd numbers — a perfect square.'],
  loiHayGap: ['Using Σ i³ = (n(n+1)/2) without squaring.', 'Counting 2^i from i = 1 when the sum starts at i = 0.'],
  thuatNgu: [tn('closed form', 'công thức đóng')],
  khaiNiem: ['summation formulas'],
});

/* proof ordering */
const I4 = tinh({
  tieuDe: 'Induction 4 — Put the proof in order',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Arrange the lines of two classic proofs: a sum by weak induction and the 4¢/5¢ stamp problem by strong induction.</p>', '<p>Sắp các dòng của hai chứng minh kinh điển: một tổng bằng quy nạp yếu và bài tem 4¢/5¢ bằng quy nạp mạnh.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Prove 1 + 2 + … + n = n(n+1)/2 for all n ≥ 1.', 'Chứng minh 1 + 2 + … + n = n(n+1)/2 với mọi n ≥ 1.'], ['Basis: for n = 1 the left side is 1 and the right side is 1·2/2 = 1.', 'Assume 1 + … + k = k(k+1)/2 for some k ≥ 1 (hypothesis).', 'Then 1 + … + k + (k+1) = k(k+1)/2 + (k+1).', 'Factor: = (k+1)(k/2 + 1) = (k+1)(k+2)/2.', 'This is the formula for n = k + 1, so by induction it holds for all n ≥ 1.'], ['The step adds one term to both sides and shows the right side keeps its shape.', 'Bước quy nạp cộng một số hạng vào hai vế và chứng tỏ vế phải giữ nguyên dạng.'], 2),
    ord('q2', ['Prove every amount of n ≥ 12 cents can be paid with 4¢ and 5¢ stamps (strong induction).', 'Chứng minh mọi số tiền n ≥ 12 xu trả được bằng tem 4¢ và 5¢ (quy nạp mạnh).'], ['Basis: 12 = 3·4, 13 = 2·4 + 5, 14 = 4 + 2·5, 15 = 3·5.', 'Assume every amount from 12 up to k can be paid, where k ≥ 15.', 'Consider k + 1 ≥ 16; then k + 1 − 4 ≥ 12 and k + 1 − 4 ≤ k.', 'By the hypothesis k + 1 − 4 can be paid; add one 4¢ stamp.', 'So k + 1 can be paid; the claim holds for all n ≥ 12.'], ['Four base cases are needed because the step goes back 4 places.', 'Cần bốn trường hợp cơ sở vì bước quy nạp lùi 4 vị trí.'], 3),
  ],
  goiY: ['The basis comes first, then the assumption, then the algebra, then the conclusion.', 'Strong induction: the number of base cases equals how far back the step looks.'],
  loiHayGap: ['Proving the step without ever stating the hypothesis.', 'Using one base case where the step reaches back four places.'],
  thuatNgu: [tn('basis', 'cơ sở')],
  khaiNiem: ['induction proofs'],
});

/* recurrences numeric */
const I5 = tinh({
  tieuDe: 'Induction 5 — Setting up and evaluating recurrences',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Model each situation with a recurrence, then evaluate it. All numbers below were computed by program from the recurrence.</p>', '<p>Mô hình hoá mỗi tình huống bằng hệ thức truy hồi rồi tính giá trị. Mọi số dưới đây được chương trình tính từ hệ thức.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['Tower of Hanoi: the minimum number of moves for 8 discs is …', 'Tháp Hà Nội: số lần chuyển tối thiểu cho 8 đĩa là …'], S.hanoiMoves(8), [2 ** 8, 8 * 8, 2 * 8 - 1], f2, ['H(n) = 2H(n−1) + 1, H(1) = 1 ⇒ H(n) = 2ⁿ − 1 = 255.', 'H(n) = 2H(n−1) + 1, H(1) = 1 ⇒ H(n) = 2ⁿ − 1 = 255.']),
    mcNum('c2', ['Binary strings of length 8 with no two consecutive 0s number …', 'Số xâu nhị phân độ dài 8 không có hai số 0 liền nhau là …'], S.noTwoZeros(8), [2 ** 8, 34, 89], f2, ['a(n) = a(n−1) + a(n−2), a(1) = 2, a(2) = 3 ⇒ a(8) = 55 (a Fibonacci number).', 'a(n) = a(n−1) + a(n−2), a(1) = 2, a(2) = 3 ⇒ a(8) = 55.']),
    mcNum('c3', ['Ways to climb 10 stairs taking 1, 2 or 3 steps at a time …', 'Số cách leo 10 bậc, mỗi lần 1, 2 hoặc 3 bậc …'], S.climb3(10), [S.fib(10), 3 ** 10 / 100 | 0, S.climb3(9)], f2, ['c(n) = c(n−1) + c(n−2) + c(n−3), c(0) = c(1) = 1, c(2) = 2.', 'c(n) = c(n−1) + c(n−2) + c(n−3), c(0) = c(1) = 1, c(2) = 2.']),
    mcNum('c4', ['Domino tilings of a 2×9 board with 2×1 dominoes …', 'Số cách lát bảng 2×9 bằng domino 2×1 …'], S.dominoTilings(9), [2 ** 9, 9 * 2, S.fib(9)], f2, ['t(n) = t(n−1) + t(n−2) (last column vertical or two horizontals): t(9) = 55.', 't(n) = t(n−1) + t(n−2): t(9) = 55.']),
    mcNum('c5', ['Compound interest: 1000 at 5% per year compounded yearly. After 10 years (rounded down to an integer) …', 'Lãi kép: 1000 với lãi 5%/năm, ghép lãi hằng năm. Sau 10 năm (làm tròn xuống số nguyên) …'], Math.floor(1000 * 1.05 ** 10), [Math.floor(1000 + 10 * 50), Math.floor(1000 * 1.5 ** 10), Math.floor(1000 * 1.05 ** 9)], f2, ['P(n) = 1.05·P(n−1) ⇒ P(10) = 1000·1.05¹⁰ ≈ 1628.89.', 'P(n) = 1,05·P(n−1) ⇒ P(10) ≈ 1628,89.']),
    mcNum('c6', ['The naive recursive fib(10) (fib(n) = fib(n−1) + fib(n−2)) makes … calls in total (including the first).', 'fib(10) đệ quy ngây thơ thực hiện tổng cộng … lời gọi (kể cả lời gọi đầu).'], S.fibCalls(10), [S.fib(10), 2 ** 10, S.fibCalls(9)], f2, ['C(n) = C(n−1) + C(n−2) + 1: C(10) = 177 — exponential, hence memoisation.', 'C(n) = C(n−1) + C(n−2) + 1: C(10) = 177 — mũ, vì vậy cần ghi nhớ kết quả.']),
  ],
  goiY: ['Condition on the last move/column/character to find the recurrence.', 'Compute the first few terms by hand to check the recurrence before trusting it.'],
  loiHayGap: ['Using 2ⁿ for the strings without consecutive 0s.', 'Forgetting the “+ 1” in the call-count recurrence.'],
  thuatNgu: [tn('recurrence relation', 'hệ thức truy hồi'), tn('memoisation', 'ghi nhớ kết quả')],
  khaiNiem: ['modelling with recurrences'],
});
assert.equal(S.noTwoZeros(8), 55);

/* solve linear recurrence */
const LR = [{ c1: 5, c2: -6, a0: 2, a1: 7 }, { c1: 3, c2: -2, a0: 1, a1: 3 }, { c1: 1, c2: 2, a0: 2, a1: 7 }, { c1: 7, c2: -10, a0: 5, a1: 19 }, { c1: 2, c2: 3, a0: 4, a1: 4 }];
const lrSol = (c) => { const [r1, r2] = S.charRoots(c.c1, c.c2).sort((a, b) => b - a); const al = (c.a1 - r2 * c.a0) / (r1 - r2); return { r1, r2, al, be: c.a0 - al }; };
LR.forEach((c) => { const s = lrSol(c); assert.ok(Number.isInteger(s.al) && Number.isInteger(s.be) && Number.isInteger(s.r1) && Number.isInteger(s.r2)); for (let n = 0; n < 6; n++) assert.equal(S.recurrence([c.c1, c.c2], [c.a0, c.a1], n), s.al * s.r1 ** n + s.be * s.r2 ** n); });
const I6 = tinh({
  tieuDe: 'Induction 6 — Solve a linear homogeneous recurrence',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>For a(n) = c₁·a(n−1) + c₂·a(n−2) the characteristic equation is r² − c₁r − c₂ = 0. With distinct roots r₁ &gt; r₂ the solution is a(n) = α·r₁ⁿ + β·r₂ⁿ; α and β follow from a(0) and a(1). Fill r₁, r₂, α, β and the value a(6).</p>', '<p>Với a(n) = c₁·a(n−1) + c₂·a(n−2), phương trình đặc trưng là r² − c₁r − c₂ = 0. Với hai nghiệm phân biệt r₁ &gt; r₂ nghiệm là a(n) = α·r₁ⁿ + β·r₂ⁿ; α, β suy ra từ a(0) và a(1). Điền r₁, r₂, α, β và giá trị a(6).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Characteristic roots', 'Nghiệm đặc trưng'], [{ ma: 'p', ten: 'Recurrence' }, { ma: 'r1', ten: 'r₁ (larger)' }, { ma: 'r2', ten: 'r₂' }, { ma: 'al', ten: 'α' }, { ma: 'be', ten: 'β' }, { ma: 'a6', ten: 'a(6)' }],
    LR.map((c) => { const s = lrSol(c); return { o: { p: `a(n) = ${c.c1}·a(n−1) + (${c.c2})·a(n−2),  a(0) = ${c.a0}, a(1) = ${c.a1}` }, a: { r1: String(s.r1), r2: String(s.r2), al: String(s.al), be: String(s.be), a6: String(S.recurrence([c.c1, c.c2], [c.a0, c.a1], 6)) } }; }),
    [LR.map((c) => { const s = lrSol(c); return `c=(${c.c1},${c.c2}): roots ${s.r1}, ${s.r2}; α=${s.al}, β=${s.be}; a(6)=${S.recurrence([c.c1, c.c2], [c.a0, c.a1], 6)}`; }).join('; ') + '. α + β = a(0) and α·r₁ + β·r₂ = a(1).', LR.map((c) => { const s = lrSol(c); return `c=(${c.c1},${c.c2}): nghiệm ${s.r1}, ${s.r2}; α=${s.al}, β=${s.be}`; }).join('; ') + '.'])],
  goiY: ['Factor r² − c₁r − c₂ (or use the quadratic formula; the discriminant is c₁² + 4c₂).', 'Solve α + β = a(0), α·r₁ + β·r₂ = a(1). Verify with a(2) = c₁a(1) + c₂a(0).'],
  loiHayGap: ['Writing the characteristic equation with the wrong sign of c₂.', 'Mixing up which root goes with α.'],
  thuatNgu: [tn('characteristic equation', 'phương trình đặc trưng')],
  khaiNiem: ['linear recurrences'],
});

/* code */
function recurrence(coefs, init, n) {
  var a = init.slice();
  while (a.length <= n) {
    var i = a.length, s = 0;
    for (var k = 0; k < coefs.length; k++) s += coefs[k] * a[i - 1 - k];
    a.push(s);
  }
  return a[n];
}
const I7 = jsDe({
  tieuDe: 'Induction 7 — Evaluate any linear recurrence',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>recurrence(coefs, init, n)</code> for a(i) = coefs[0]·a(i−1) + coefs[1]·a(i−2) + … + coefs[k−1]·a(i−k), where <code>init</code> holds a(0) … a(k−1). Return a(n) (n ≥ 0; if n &lt; k return init[n]). Build the sequence iteratively; do not use naive recursion (n can be 60).</p>', '<p>Viết <code>recurrence(coefs, init, n)</code> cho a(i) = coefs[0]·a(i−1) + coefs[1]·a(i−2) + … + coefs[k−1]·a(i−k), với <code>init</code> chứa a(0) … a(k−1). Trả a(n) (n ≥ 0; nếu n &lt; k trả init[n]). Dựng dãy bằng vòng lặp; không dùng đệ quy ngây thơ (n có thể là 60).</p>'),
  yeuCau: [bi('Values stay below 2⁵³ in the tests.', 'Giá trị luôn dưới 2⁵³ trong test.')],
  viDu: [{ input: 'recurrence([1,1],[0,1],10)', output: '55', explanation: 'Fibonacci numbers.|||Dãy Fibonacci.' }, { input: 'recurrence([3,-2],[1,3],5)', output: String(recurrence([3, -2], [1, 3], 5)), explanation: 'a(n) = 2^(n+1) − 1.|||a(n) = 2^(n+1) − 1.' }],
  goiY: ['Keep an array; append a(i) computed from the last k entries.', 'The loop runs from index k up to n.'],
  loiHayGap: ['Indexing a(i−k) with the wrong coefficient (coefs[0] belongs to a(i−1)).', 'Using recursion without memoisation (time-out for n = 60).'],
  giaiThich: '<p>Iteration computes each term once: O(n·k). The naive recursion recomputes terms exponentially often.</p>',
  khaiNiem: ['recurrences', 'iteration'],
  fn: 'recurrence',
  dau: 'function recurrence(coefs, init, n) {\n  return 0;\n}\n',
  giaiMa: dat(recurrence, 'recurrence'),
  ref: recurrence,
  cases: [{ args: [[1, 1], [0, 1], 10] }, { args: [[3, -2], [1, 3], 5] }, { args: [[2], [1], 6] }, { args: [[1, 1, 1], [1, 1, 2], 10], an: true }, { args: [[5, -6], [2, 7], 12], an: true }, { args: [[1, 1], [0, 1], 60], an: true }, { args: [[2, 1], [3, 8], 1], an: true }],
});

function climbWays(n, steps) {
  var w = [1], i;
  for (i = 1; i <= n; i++) {
    var s = 0;
    for (var j = 0; j < steps.length; j++) if (i - steps[j] >= 0) s += w[i - steps[j]];
    w.push(s);
  }
  return w[n];
}
const I8 = jsDe({
  tieuDe: 'Induction 8 — Count ways with a recurrence (dynamic programming)',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>A climber may take any step size from the array <code>steps</code> (distinct positive integers). Write <code>climbWays(n, steps)</code> returning the number of ordered sequences of steps that add up to exactly n (<code>climbWays(0, …)</code> is 1: the empty climb). The recurrence is w(i) = Σ over s ∈ steps with s ≤ i of w(i − s).</p>', '<p>Người leo có thể bước độ dài bất kỳ trong mảng <code>steps</code> (số nguyên dương phân biệt). Viết <code>climbWays(n, steps)</code> trả số dãy bước có thứ tự cộng đúng bằng n (<code>climbWays(0, …)</code> bằng 1: không bước nào). Hệ thức: w(i) = Σ với s ∈ steps, s ≤ i của w(i − s).</p>'),
  yeuCau: [bi('n up to 50; the answer fits a double exactly in the tests.', 'n tới 50; đáp án vừa đủ chính xác trong số double ở test.')],
  viDu: [{ input: 'climbWays(4, [1,2])', output: String(climbWays(4, [1, 2])), explanation: '1111, 112, 121, 211, 22.|||1111, 112, 121, 211, 22.' }, { input: 'climbWays(5, [2])', output: '0', explanation: 'An odd total cannot be made from 2s only.|||Tổng lẻ không tạo được chỉ bằng bước 2.' }],
  goiY: ['Create w[0..n] with w[0] = 1 and fill upward.', 'Skip step sizes larger than the current index.'],
  loiHayGap: ['Counting combinations instead of ordered sequences (1+2 and 2+1 are different).', 'Forgetting w[0] = 1.'],
  giaiThich: '<p>The last step is some s, and before it the climber stood at i − s: the cases are disjoint, so the counts add. This is the sum rule in recurrence form.</p>',
  khaiNiem: ['dynamic programming', 'counting recurrences'],
  fn: 'climbWays',
  dau: 'function climbWays(n, steps) {\n  return 0;\n}\n',
  giaiMa: dat(climbWays, 'climbWays'),
  ref: climbWays,
  cases: [{ args: [4, [1, 2]] }, { args: [5, [2]] }, { args: [0, [1, 3]] }, { args: [10, [1, 2, 3]], an: true }, { args: [20, [1, 5, 10]], an: true }, { args: [50, [1, 2]], an: true }, { args: [7, [3, 4]], an: true }],
});

export default doiDau({
  slug: 'mad101-5-1-quy-nap',
  ten: '5.1 Induction & recursion',
  khoa: KHOA,
  baiHoc: 'mad101-5-1-quy-nap',
  de: [I1, I2, I3, I4, I5, I6, I7, I8],
});
