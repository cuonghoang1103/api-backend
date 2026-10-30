/** MAD101 · 6.1 — Counting principles, permutations, combinations, binomial theorem, pigeonhole. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);
const C1 = tinh({
  tieuDe: 'Counting 1 — Rules and vocabulary',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>When to add, when to multiply, and when order matters.</p>', '<p>Khi nào cộng, khi nào nhân, và khi nào thứ tự quan trọng.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A task has two independent stages with 4 and 6 ways. The total number of ways is …', 'Một công việc có hai giai đoạn độc lập với 4 và 6 cách. Tổng số cách là …'], ['24', '10', '46', '2⁴'], ['Product rule: independent stages multiply, 4·6 = 24.', 'Quy tắc nhân: các giai đoạn độc lập thì nhân, 4·6 = 24.']),
    q('c2', ['Choose a representative from 12 men OR 15 women (no overlap): number of ways is …', 'Chọn một đại diện từ 12 nam HOẶC 15 nữ (không trùng): số cách là …'], ['27', '180', '12¹⁵', '3'], ['Sum rule: alternatives that cannot happen together add, 12 + 15 = 27.', 'Quy tắc cộng: các phương án không đồng thời thì cộng, 12 + 15 = 27.']),
    q('c3', ['Order matters and there is no repetition: use …', 'Thứ tự quan trọng và không lặp: dùng …'], ['permutations P(n, r)', 'combinations C(n, r)', 'nʳ', 'C(n + r − 1, r)'], ['P(n, r) = n!/(n − r)!.', 'P(n, r) = n!/(n − r)!.']),
    q('c4', ['Order does not matter, no repetition: use …', 'Thứ tự không quan trọng, không lặp: dùng …'], ['C(n, r)', 'P(n, r)', 'nʳ', 'r!'], ['C(n, r) = P(n, r)/r!: divide out the orderings.', 'C(n, r) = P(n, r)/r!: chia bỏ các thứ tự.']),
    q('c5', ['C(n, r) equals …', 'C(n, r) bằng …'], ['C(n, n − r)', 'C(n, r − 1)', 'P(n, r)', 'C(r, n)'], ['Choosing r objects to take is the same as choosing n − r to leave.', 'Chọn r vật để lấy cũng như chọn n − r vật để bỏ.']),
    q('c6', ['The pigeonhole principle says: if k + 1 objects go into k boxes, then …', 'Nguyên lý chuồng bồ câu: nếu k + 1 vật vào k hộp thì …'], ['some box has at least 2 objects', 'every box has exactly one', 'some box is empty', 'no box has 2 objects or more'], ['It guarantees a collision but does not say which box.', 'Nó đảm bảo có đụng độ nhưng không nói hộp nào.']),
  ],
  goiY: ['Stages that all must happen multiply; alternatives that exclude each other add.', 'Decide order-matters / repetition first, then pick the formula.'],
  loiHayGap: ['Adding where independent stages call for multiplying.', 'Using P(n, r) when the selection is an unordered group.'],
  thuatNgu: [tn('product rule', 'quy tắc nhân'), tn('sum rule', 'quy tắc cộng'), tn('permutation', 'hoán vị/chỉnh hợp'), tn('combination', 'tổ hợp')],
  khaiNiem: ['counting rules'],
});

const PC = [[5, 2], [8, 3], [10, 4], [12, 12], [20, 3], [6, 0], [30, 2]];
const C2 = tinh({
  tieuDe: 'Counting 2 — P(n, r), C(n, r) and factorials',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Compute the number of r-permutations P(n, r) and the number of r-combinations C(n, r). Remember 0! = 1.</p>', '<p>Tính số chỉnh hợp P(n, r) và số tổ hợp C(n, r). Nhớ 0! = 1.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Permutations and combinations', 'Chỉnh hợp và tổ hợp'], [{ ma: 'nr', ten: 'n, r' }, { ma: 'p', ten: 'P(n, r)' }, { ma: 'c', ten: 'C(n, r)' }],
    PC.map(([n, r]) => ({ o: { nr: `n = ${n},  r = ${r}` }, a: { p: String(S.nPr(n, r)), c: String(S.nCr(n, r)) } })),
    [PC.map(([n, r]) => `n=${n}, r=${r}: P=${S.nPr(n, r)}, C=${S.nCr(n, r)}`).join('; ') + '.', PC.map(([n, r]) => `n=${n}, r=${r}: P=${S.nPr(n, r)}, C=${S.nCr(n, r)}`).join('; ') + '.'])],
  goiY: ['P(n, r) = n(n−1)…(n−r+1) — r factors.', 'C(n, r) = P(n, r)/r!; use symmetry C(n, r) = C(n, n−r) to shorten.'],
  loiHayGap: ['Writing P(n, 0) = 0 (it is 1).', 'Dividing by (n−r)! instead of r! to get the combination.'],
  thuatNgu: [tn('r-permutation', 'chỉnh hợp chập r')],
  khaiNiem: ['P(n,r)', 'C(n,r)'],
});

const word = 'MISSISSIPPI';
const wordCounts = [4, 4, 2, 1];
const C3 = tinh({
  tieuDe: 'Counting 3 — Word problems with the product rule',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Typical exam questions: passwords, committees, arrangements and poker hands. All answers were computed by program.</p>', '<p>Các câu thi điển hình: mật khẩu, uỷ ban, sắp xếp và bài poker. Mọi đáp án do chương trình tính.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['A password has 3 letters (A–Z, repetition allowed) followed by 2 digits (0–9, repetition allowed). How many are there?', 'Mật khẩu gồm 3 chữ cái (A–Z, cho lặp) rồi 2 chữ số (0–9, cho lặp). Có bao nhiêu mật khẩu?'], 26 ** 3 * 10 ** 2, [26 * 25 * 24 * 10 * 9, 26 ** 3 + 10 ** 2, 26 * 3 * 10 * 2], f2, ['26³ · 10² = 1,757,600.', '26³ · 10² = 1.757.600.']),
    mcNum('c2', ['Same format but all 3 letters must be different and the 2 digits different. How many?', 'Cùng dạng nhưng 3 chữ cái phải khác nhau và 2 chữ số khác nhau. Có bao nhiêu?'], S.nPr(26, 3) * S.nPr(10, 2), [26 ** 3 * 10 ** 2, S.nCr(26, 3) * S.nCr(10, 2), 26 * 25 * 24 + 10 * 9], f2, ['P(26,3)·P(10,2) = 15600·90 = 1,404,000.', 'P(26,3)·P(10,2) = 15600·90 = 1.404.000.']),
    mcNum('c3', ['A committee of 4 is chosen from 7 men and 5 women. How many committees have exactly 2 women?', 'Chọn uỷ ban 4 người từ 7 nam và 5 nữ. Có bao nhiêu uỷ ban có đúng 2 nữ?'], S.nCr(5, 2) * S.nCr(7, 2), [S.nCr(12, 4), S.nCr(5, 2) + S.nCr(7, 2), S.nCr(12, 2)], f2, ['C(5,2)·C(7,2) = 10·21 = 210.', 'C(5,2)·C(7,2) = 10·21 = 210.']),
    mcNum('c4', ['Same committee: how many have at least 1 woman?', 'Cùng uỷ ban: có bao nhiêu uỷ ban có ít nhất 1 nữ?'], S.nCr(12, 4) - S.nCr(7, 4), [S.nCr(12, 4), S.nCr(5, 1) * S.nCr(11, 3), S.nCr(12, 4) - S.nCr(5, 4)], f2, ['Complement: all C(12,4) = 495 minus all-men C(7,4) = 35 gives 460. (Note C(5,1)·C(11,3) overcounts.)', 'Phần bù: tất cả C(12,4) = 495 trừ toàn nam C(7,4) = 35 được 460. (C(5,1)·C(11,3) đếm trùng.)']),
    mcNum('c5', [`How many distinct arrangements of the letters of ${word}?`, `Có bao nhiêu cách sắp xếp khác nhau các chữ của ${word}?`], S.multinomial(wordCounts), [S.factorial(11), S.factorial(11) / 24, S.multinomial([4, 4, 3])], f2, ['11!/(4!·4!·2!·1!) = 34,650 (I:4, S:4, P:2, M:1).', '11!/(4!·4!·2!·1!) = 34.650 (I:4, S:4, P:2, M:1).']),
    mcNum('c6', ['In how many ways can 7 people sit at a round table (rotations considered the same)?', 'Có bao nhiêu cách xếp 7 người quanh bàn tròn (xoay là như nhau)?'], S.circular(7), [S.factorial(7), 7 * 7, S.factorial(6) / 2], f2, ['Fix one person: (7 − 1)! = 720.', 'Cố định một người: (7 − 1)! = 720.']),
  ],
  goiY: ['“At least one” is usually easiest as total minus none.', 'For repeated letters divide by the factorial of each letter’s count.'],
  loiHayGap: ['Using C(n, r) for sequences where order matters (passwords).', 'Counting a committee’s “at least 1 woman” as C(5,1)·C(11,3), which counts a committee once per woman.'],
  thuatNgu: [tn('complement counting', 'đếm bằng phần bù')],
  khaiNiem: ['product rule', 'complement'],
});
assert.equal(S.multinomial(wordCounts), 34650);

const SB = [[10, 3, 0], [12, 4, 0], [10, 3, 2], [15, 4, 1], [8, 5, 0], [20, 3, 5]];
const C4 = tinh({
  tieuDe: 'Counting 4 — Stars and bars',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Count the non-negative integer solutions of x₁ + … + x_k = n. If every variable must be at least L, substitute y_i = x_i − L: the problem becomes n − k·L stars into k bins, C(n − kL + k − 1, k − 1). Fill in the number of solutions.</p>', '<p>Đếm số nghiệm nguyên không âm của x₁ + … + x_k = n. Nếu mỗi biến phải ≥ L, đặt y_i = x_i − L: bài toán trở thành n − k·L sao vào k ngăn, C(n − kL + k − 1, k − 1). Điền số nghiệm.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Stars and bars', 'Sao và vạch'], [{ ma: 'p', ten: 'Problem' }, { ma: 'sol', ten: '# solutions' }],
    SB.map(([n, k, L]) => ({ o: { p: `x₁ + … + x${k === 3 ? '₃' : k === 4 ? '₄' : '₅'} = ${n},  each x_i ≥ ${L}  (k = ${k} variables)` }, a: { sol: String(S.starsBars(n - k * L, k)) } })),
    [SB.map(([n, k, L]) => `n=${n}, k=${k}, L=${L}: C(${n - k * L + k - 1}, ${k - 1}) = ${S.starsBars(n - k * L, k)}`).join('; ') + '.', SB.map(([n, k, L]) => `n=${n}, k=${k}, L=${L}: ${S.starsBars(n - k * L, k)}`).join('; ') + '.'])],
  goiY: ['First remove the forced minimum from every variable.', 'k variables → k − 1 bars among n′ + k − 1 symbols.'],
  loiHayGap: ['Using C(n, k) instead of C(n + k − 1, k − 1).', 'Forgetting to subtract k·L before applying the formula.'],
  thuatNgu: [tn('stars and bars', 'sao và vạch')],
  khaiNiem: ['combinations with repetition'],
});

const BT = [{ n: 5, a: 2, b: 1, k: 3 }, { n: 6, a: 1, b: -1, k: 2 }, { n: 8, a: 3, b: 2, k: 5 }, { n: 10, a: 1, b: 1, k: 4 }, { n: 7, a: 2, b: -3, k: 2 }];
const C5 = tinh({
  tieuDe: 'Counting 5 — The binomial theorem',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>In (a·x + b·y)ⁿ the coefficient of xᵏyⁿ⁻ᵏ is C(n, k)·aᵏ·bⁿ⁻ᵏ. Compute the requested coefficient, and for the last column the sum of all coefficients of the expansion (set x = y = 1: (a + b)ⁿ).</p>', '<p>Trong (a·x + b·y)ⁿ hệ số của xᵏyⁿ⁻ᵏ là C(n, k)·aᵏ·bⁿ⁻ᵏ. Tính hệ số yêu cầu, và ở cột cuối là tổng mọi hệ số của khai triển (đặt x = y = 1: (a + b)ⁿ).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Coefficients', 'Hệ số'], [{ ma: 'e', ten: 'Expression, k' }, { ma: 'c', ten: 'Coefficient of xᵏyⁿ⁻ᵏ' }, { ma: 's', ten: 'Sum of all coefficients' }],
    BT.map((t) => ({ o: { e: `(${t.a}x ${t.b < 0 ? '−' : '+'} ${Math.abs(t.b)}y)^${t.n},  k = ${t.k}` }, a: { c: String(S.binomTerm(t.n, t.k, t.a, t.b)), s: String((t.a + t.b) ** t.n) } })),
    [BT.map((t) => `(${t.a}x+(${t.b})y)^${t.n}, k=${t.k}: C(${t.n},${t.k})·${t.a}^${t.k}·(${t.b})^${t.n - t.k} = ${S.binomTerm(t.n, t.k, t.a, t.b)}; sum ${(t.a + t.b) ** t.n}`).join('; ') + '.', BT.map((t) => `k=${t.k}: ${S.binomTerm(t.n, t.k, t.a, t.b)}; tổng ${(t.a + t.b) ** t.n}`).join('; ') + '.'])],
  goiY: ['Keep the sign of b inside the power: (−3)⁵ is negative.', 'Sum of coefficients = value of the expression at x = y = 1.'],
  loiHayGap: ['Dropping the factor aᵏ (or bⁿ⁻ᵏ) when a or b is not 1.', 'Losing the sign when b is negative and the exponent is odd.'],
  thuatNgu: [tn('binomial coefficient', 'hệ số nhị thức')],
  khaiNiem: ['binomial theorem'],
});

const C6 = tinh({
  tieuDe: 'Counting 6 — Pigeonhole, derangements and inclusion–exclusion',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Harder counting questions that combine ideas.</p>', '<p>Các câu đếm khó hơn kết hợp nhiều ý.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['How many students must be in a class to guarantee that at least 5 were born in the same month?', 'Lớp tối thiểu bao nhiêu học sinh để chắc chắn có ít nhất 5 người sinh cùng tháng?'], S.pigeon(12, 5), [12 * 5, 12 + 5, 48], f2, ['12·(5 − 1) + 1 = 49.', '12·(5 − 1) + 1 = 49.']),
    mcNum('c2', ['A drawer holds 10 black and 8 white socks. The minimum number of socks to draw in the dark to be sure of a matching pair is …', 'Ngăn kéo có 10 tất đen và 8 tất trắng. Số tất tối thiểu phải lấy trong bóng tối để chắc chắn có một đôi cùng màu là …'], 3, [2, 9, 11], f2, ['Two colours ⇒ 2 + 1 = 3 socks.', 'Hai màu ⇒ 2 + 1 = 3 chiếc.']),
    mcNum('c3', ['5 letters are put into 5 addressed envelopes at random. The number of ways that NO letter is in its correct envelope is …', 'Bỏ ngẫu nhiên 5 thư vào 5 phong bì có địa chỉ. Số cách không có thư nào đúng phong bì là …'], S.derangements(5), [S.factorial(5) - 1, S.factorial(5) / 2, S.derangements(4)], f2, ['Derangement number D₅ = 44 (D_n = n!·Σ (−1)^k/k!).', 'Số mất trật tự D₅ = 44.']),
    mcNum('c4', ['How many integers from 1 to 1000 are divisible by 3, 5 or 7?', 'Có bao nhiêu số nguyên từ 1 đến 1000 chia hết cho 3, 5 hoặc 7?'], S.countDivisibleByAny(1000, [3, 5, 7]), [333 + 200 + 142, 333 + 200 + 142 - 66 - 47 - 28, 1000 - 543], f2, [`333 + 200 + 142 − 66 − 47 − 28 + 9 = ${S.countDivisibleByAny(1000, [3, 5, 7])}.`, `333 + 200 + 142 − 66 − 47 − 28 + 9 = ${S.countDivisibleByAny(1000, [3, 5, 7])}.`]),
    mcNum('c5', ['How many onto functions are there from a 6-element set to a 3-element set?', 'Có bao nhiêu toàn ánh từ tập 6 phần tử lên tập 3 phần tử?'], S.numSurjective(6, 3), [3 ** 6, 3 ** 6 - 3 * 2 ** 6, S.numSurjective(5, 3)], f2, [`3⁶ − 3·2⁶ + 3·1⁶ = 729 − 192 + 3 = ${S.numSurjective(6, 3)}.`, `3⁶ − 3·2⁶ + 3 = ${S.numSurjective(6, 3)}.`]),
    mcNum('c6', ['What is the smallest n such that among ANY n integers two always have the same remainder when divided by 9?', 'n nhỏ nhất để trong n số nguyên BẤT KỲ luôn có hai số cùng số dư khi chia cho 9 là?'], 10, [9, 18, 8], f2, ['There are 9 remainders (boxes), so 9 + 1 = 10 integers force a repeat; 9 integers can have all different remainders.', 'Có 9 số dư (hộp) nên 9 + 1 = 10 số nguyên buộc có lặp; 9 số có thể có mọi số dư khác nhau.']),
  ],
  goiY: ['Pigeonhole: n·(k − 1) + 1 guarantees k in one of n boxes.', 'Inclusion–exclusion: singles − pairs + triple, using lcms.'],
  loiHayGap: ['Using n·k instead of n·(k − 1) + 1.', 'Adding the three divisor counts without subtracting overlaps.'],
  thuatNgu: [tn('derangement', 'hoán vị mất trật tự')],
  khaiNiem: ['pigeonhole', 'derangements', 'inclusion–exclusion'],
});

function combinations(n, k) {
  if (k < 0 || k > n) return 0;
  var row = [1], i, j;
  for (i = 1; i <= n; i++) {
    var next = [1];
    for (j = 1; j < i; j++) next.push(row[j - 1] + row[j]);
    next.push(1);
    row = next;
  }
  return row[k];
}
const C7 = jsDe({
  tieuDe: 'Counting 7 — Compute C(n, k) with Pascal’s triangle',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Write <code>combinations(n, k)</code> returning C(n, k), using Pascal’s rule C(n, k) = C(n−1, k−1) + C(n−1, k) (build the triangle row by row). Return 0 when k &lt; 0 or k &gt; n. The tests use n up to 50; values stay below 2⁵³, but computing n!/(k!(n−k)!) with factorials would overflow.</p>', '<p>Viết <code>combinations(n, k)</code> trả C(n, k) bằng quy tắc Pascal C(n, k) = C(n−1, k−1) + C(n−1, k) (dựng tam giác từng hàng). Trả 0 khi k &lt; 0 hoặc k &gt; n. Test dùng n tới 50; giá trị dưới 2⁵³ nhưng tính n!/(k!(n−k)!) bằng giai thừa sẽ tràn.</p>'),
  yeuCau: [bi('Do not use floating-point factorials.', 'Không dùng giai thừa dấu phẩy động.')],
  viDu: [{ input: 'combinations(5,2)', output: '10', explanation: 'Row 5 of Pascal: 1 5 10 10 5 1.|||Hàng 5 của Pascal: 1 5 10 10 5 1.' }],
  goiY: ['Build the next row from the previous one: each inner entry is the sum of the two above.', 'Row n has n + 1 entries, indexed 0…n.'],
  loiHayGap: ['Off-by-one: row i has i + 1 entries.', 'Using factorials and exceeding 2⁵³.'],
  giaiThich: '<p>Pascal’s rule is the combinatorial identity “either the element is chosen or it is not”, turned into an addition-only algorithm.</p>',
  khaiNiem: ['Pascal’s triangle', 'combinations'],
  fn: 'combinations',
  dau: 'function combinations(n, k) {\n  return 0;\n}\n',
  giaiMa: dat(combinations, 'combinations'),
  ref: combinations,
  cases: [{ args: [5, 2] }, { args: [0, 0] }, { args: [10, 11] }, { args: [10, -1] }, { args: [30, 15], an: true }, { args: [50, 25], an: true }, { args: [52, 5].map((x, i) => (i === 0 ? 40 : x)), an: true }],
});

function kSubsets(arr, k) {
  var out = [];
  function go(start, cur) {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (var i = start; i < arr.length; i++) { cur.push(arr[i]); go(i + 1, cur); cur.pop(); }
  }
  go(0, []);
  return out;
}
const C8 = jsDe({
  tieuDe: 'Counting 8 — Generate all k-subsets',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>kSubsets(arr, k)</code> that returns all subsets of <code>arr</code> of size exactly k, each as an array in the order of <code>arr</code>, listed in <em>lexicographic order of positions</em>: [arr[0], arr[1]] comes before [arr[0], arr[2]], which comes before [arr[1], arr[2]]. There are C(n, k) of them. <code>k = 0</code> returns <code>[[]]</code>. Use backtracking: choose the next element from the positions after the last chosen one.</p>', '<p>Viết <code>kSubsets(arr, k)</code> trả mọi tập con của <code>arr</code> có đúng k phần tử, mỗi tập là mảng theo thứ tự của <code>arr</code>, liệt kê theo <em>thứ tự từ điển của vị trí</em>: [arr[0], arr[1]] đứng trước [arr[0], arr[2]], rồi đến [arr[1], arr[2]]. Có C(n, k) tập. <code>k = 0</code> trả <code>[[]]</code>. Dùng quay lui: chọn phần tử kế từ các vị trí sau phần tử vừa chọn.</p>'),
  yeuCau: [bi('Copy the current partial subset before pushing it into the result.', 'Sao chép tập con tạm thời trước khi đẩy vào kết quả.')],
  viDu: [{ input: 'kSubsets([1,2,3,4],2)', output: JSON.stringify(kSubsets([1, 2, 3, 4], 2)), explanation: 'C(4,2) = 6 subsets in lexicographic order.|||C(4,2) = 6 tập con theo thứ tự từ điển.' }],
  goiY: ['A helper go(start, current) loops i from start and recurses with i + 1.', 'Stop when current.length === k.'],
  loiHayGap: ['Pushing the same array object instead of a copy.', 'Starting each loop at 0, which produces ordered tuples (permutations) instead of subsets.'],
  giaiThich: '<p>Requiring positions to increase removes the ordering redundancy: each subset is generated exactly once, so the output size is C(n, k) = P(n, k) / k!.</p>',
  khaiNiem: ['backtracking', 'combinations'],
  fn: 'kSubsets',
  dau: 'function kSubsets(arr, k) {\n  return [];\n}\n',
  giaiMa: dat(kSubsets, 'kSubsets'),
  ref: kSubsets,
  cases: [{ args: [[1, 2, 3, 4], 2] }, { args: [[1, 2, 3], 0] }, { args: [[1, 2, 3], 3] }, { args: [[1, 2], 3] }, { args: [['a', 'b', 'c', 'd', 'e'], 3], an: true }, { args: [[5, 6, 7, 8, 9, 10], 4], an: true }],
});

export default doiDau({
  slug: 'mad101-6-1-dem-to-hop',
  ten: '6.1 Counting principles & combinatorics',
  khoa: KHOA,
  baiHoc: 'mad101-6-1-dem-to-hop',
  de: [C1, C2, C3, C4, C5, C6, C7, C8],
});
