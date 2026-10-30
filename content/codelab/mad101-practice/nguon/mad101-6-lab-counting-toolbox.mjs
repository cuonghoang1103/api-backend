/** MAD101 · Lab ch.6 — Counting toolbox: Pascal identities, probability by counting, distributions, partitions, permutations. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, dat, bang1, mcNum } from './_md.mjs';

const f2 = (x) => String(x);

/* Pascal row identities */
const PN = [4, 6, 8, 10, 12];
const K1 = tinh({
  tieuDe: 'Counting lab 1 — Pascal’s triangle and binomial identities',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>For each n compute: the sum of row n (Σ C(n, k) = 2ⁿ), the alternating sum (Σ (−1)ᵏ C(n, k) = 0 for n ≥ 1), the central coefficient C(n, n/2), and Σ C(n, k)² = C(2n, n) (Vandermonde).</p>', '<p>Với mỗi n tính: tổng hàng n (Σ C(n, k) = 2ⁿ), tổng đan dấu (Σ (−1)ᵏ C(n, k) = 0 với n ≥ 1), hệ số giữa C(n, n/2) và Σ C(n, k)² = C(2n, n) (Vandermonde).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Row identities', 'Đẳng thức theo hàng'], [{ ma: 'n', ten: 'n' }, { ma: 's', ten: 'Σ C(n, k)' }, { ma: 'a', ten: 'Σ (−1)ᵏ C(n, k)' }, { ma: 'c', ten: 'C(n, n/2)' }, { ma: 'q', ten: 'Σ C(n, k)²' }],
    PN.map((n) => ({ o: { n: String(n) }, a: { s: String(2 ** n), a: '0', c: String(S.nCr(n, n / 2)), q: String(S.nCr(2 * n, n)) } })),
    [PN.map((n) => `n=${n}: 2ⁿ=${2 ** n}, alternating 0, central ${S.nCr(n, n / 2)}, ΣC²=C(${2 * n},${n})=${S.nCr(2 * n, n)}`).join('; ') + '.', PN.map((n) => `n=${n}: ${2 ** n}, 0, ${S.nCr(n, n / 2)}, ${S.nCr(2 * n, n)}`).join('; ') + '.'])],
  goiY: ['Set x = y = 1 for the row sum and x = 1, y = −1 for the alternating sum.', 'Σ C(n, k)² counts choosing n objects from 2n: C(2n, n).'],
  loiHayGap: ['Writing 2n instead of 2ⁿ.', 'Claiming the alternating sum is 1 (it is 0 for n ≥ 1).'],
  thuatNgu: [tn('Vandermonde’s identity', 'đẳng thức Vandermonde')],
  khaiNiem: ['Pascal identities'],
});
PN.forEach((n) => { let s = 0; for (let k = 0; k <= n; k++) s += S.nCr(n, k) ** 2; assert.equal(s, S.nCr(2 * n, n)); });

/* probability by counting */
const fr = (a, b) => { const [x, y] = S.fraction(a, b); return `${x}/${y}`; };
const twoDice7 = fr(6, 36), pairInHand = fr(13 * S.nCr(4, 2), S.nCr(52, 2)), fourFlush = fr(S.nCr(13, 5) * 4, S.nCr(52, 5)), sameBirthday = fr(1, 1);
void sameBirthday;
const allRed = fr(S.nCr(26, 3), S.nCr(52, 3)), sumEight = fr(5, 36), atLeastOneSix = fr(11, 36), exactlyTwoHeads = fr(S.nCr(4, 2), 16);
const K2 = tinh({
  tieuDe: 'Counting lab 2 — Probability as a ratio of counts',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>With equally likely outcomes, P(E) = |E| / |S|. Reduce fractions to lowest terms. All counts below were produced by program.</p>', '<p>Với các kết quả đồng khả năng, P(E) = |E| / |S|. Rút gọn phân số về tối giản. Mọi số đếm dưới đây do chương trình tạo.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Two fair dice: P(sum = 8)?', 'Hai xúc xắc đều: P(tổng = 8)?'], [sumEight, '1/6', '7/36', '1/9'], ['Outcomes (2,6),(3,5),(4,4),(5,3),(6,2): 5 of 36.', 'Các kết quả (2,6),(3,5),(4,4),(5,3),(6,2): 5/36.']),
    q('c2', ['Two fair dice: P(at least one six)?', 'Hai xúc xắc đều: P(ít nhất một mặt 6)?'], [atLeastOneSix, '5/18', '1/3', '25/36'], ['1 − (5/6)² = 11/36.', '1 − (5/6)² = 11/36.']),
    q('c3', ['4 coin flips: P(exactly 2 heads)?', 'Tung 4 đồng xu: P(đúng 2 mặt ngửa)?'], [exactlyTwoHeads, fr(1, 4), fr(1, 2), fr(1, 16)], ['C(4,2)/2⁴ = 6/16 = 3/8.', 'C(4,2)/2⁴ = 6/16 = 3/8.']),
    q('c4', ['Draw 3 cards from a 52-card deck: P(all red)?', 'Rút 3 lá từ bộ bài 52: P(cả ba đỏ)?'], [allRed, '1/8', '3/17', '1/4'], ['C(26,3)/C(52,3) = 2600/22100 = 2/17.', 'C(26,3)/C(52,3) = 2600/22100 = 2/17.']),
    q('c5', ['Draw 2 cards: P(they form a pair (same rank))?', 'Rút 2 lá: P(tạo thành một đôi cùng giá trị)?'], [pairInHand, '1/13', '2/13', '1/26'], ['13·C(4,2)/C(52,2) = 78/1326 = 1/17.', '13·C(4,2)/C(52,2) = 78/1326 = 1/17.']),
    q('c6', ['5-card hand: P(all five cards of the same suit — a flush, straights included)?', 'Bộ 5 lá: P(cả năm lá cùng chất — thùng, tính cả sảnh)?'], [fourFlush, fr(1, 4), fr(4, 52), fr(S.nCr(13, 5), S.nCr(52, 5))], ['4·C(13,5)/C(52,5) = 5148/2598960 = 33/16660.', '4·C(13,5)/C(52,5) = 5148/2598960 = 33/16660.']),
  ],
  goiY: ['Count the sample space first, with the same rules (ordered vs unordered) as the event.', 'For “at least one” compute 1 − P(none).'],
  loiHayGap: ['Mixing ordered counts in the numerator with unordered counts in the denominator.', 'Not reducing the fraction.'],
  thuatNgu: [tn('sample space', 'không gian mẫu'), tn('event', 'biến cố')],
  khaiNiem: ['discrete probability'],
});
assert.equal(S.fraction(5148, 2598960).join('/'), '33/16660');

/* balls and boxes */
function partitionsInto(n, maxParts) { var w = []; for (var i = 0; i <= n; i++) { w.push([]); for (var j = 0; j <= maxParts; j++) w[i].push(0); } w[0][0] = 1; for (i = 1; i <= n; i++) for (j = 1; j <= maxParts; j++) w[i][j] = w[i - 1][j - 1] + (i >= j ? w[i - j][j] : 0); var t = 0; for (j = 1; j <= maxParts; j++) t += w[n][j]; return t; }
function stirling2(n, k) { var s = [[1]]; for (var i = 1; i <= n; i++) { s.push([0]); for (var j = 1; j <= k; j++) s[i][j] = (s[i - 1][j - 1] || 0) + j * (s[i - 1][j] || 0); } return s[n][k] || 0; }
const BB = [[5, 3], [4, 2], [6, 3], [7, 4]];
const surj = (n, k) => S.numSurjective(n, k);
const K3 = tinh({
  tieuDe: 'Counting lab 3 — Balls into boxes: four cases',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Distribute n balls into k boxes (a box may stay empty). The answer depends on whether balls and boxes are distinguishable. (a) distinguishable balls, distinguishable boxes: kⁿ; (b) identical balls, distinguishable boxes: C(n + k − 1, k − 1); (c) distinguishable balls, identical boxes: S(n,1) + … + S(n,k) (Stirling numbers of the second kind); (d) identical balls and boxes: the number of partitions of n into at most k parts.</p>', '<p>Phân n quả bóng vào k hộp (hộp có thể rỗng). Đáp án phụ thuộc bóng và hộp có phân biệt hay không. (a) bóng khác nhau, hộp khác nhau: kⁿ; (b) bóng giống nhau, hộp khác nhau: C(n + k − 1, k − 1); (c) bóng khác nhau, hộp giống nhau: S(n,1) + … + S(n,k) (số Stirling loại hai); (d) bóng và hộp đều giống nhau: số phân hoạch của n thành tối đa k phần.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Four distribution problems', 'Bốn bài toán phân phối'], [{ ma: 'nk', ten: 'n balls, k boxes' }, { ma: 'a', ten: '(a) dist. / dist.' }, { ma: 'b', ten: '(b) identical balls / dist. boxes' }, { ma: 'c', ten: '(c) dist. balls / identical boxes' }, { ma: 'd', ten: '(d) identical / identical' }],
    BB.map(([n, k]) => { let c = 0; for (let j = 1; j <= k; j++) c += stirling2(n, j); return { o: { nk: `n = ${n},  k = ${k}` }, a: { a: String(k ** n), b: String(S.starsBars(n, k)), c: String(c), d: String(partitionsInto(n, k)) } }; }),
    [BB.map(([n, k]) => { let c = 0; for (let j = 1; j <= k; j++) c += stirling2(n, j); return `n=${n},k=${k}: ${k ** n}, ${S.starsBars(n, k)}, ${c}, ${partitionsInto(n, k)}`; }).join('; ') + '.', BB.map(([n, k]) => { let c = 0; for (let j = 1; j <= k; j++) c += stirling2(n, j); return `n=${n},k=${k}: ${k ** n}, ${S.starsBars(n, k)}, ${c}, ${partitionsInto(n, k)}`; }).join('; ') + '.'])],
  goiY: ['(b) is stars and bars; (d) can be listed by hand: write n as a non-increasing sum of at most k positive parts.', '(c): Stirling S(n,j) counts splitting n labelled balls into exactly j non-empty unlabelled groups.'],
  loiHayGap: ['Using kⁿ for identical balls.', 'Counting each partition of the balls in (d) with its box order (that is case (b)).'],
  thuatNgu: [tn('Stirling number of the second kind', 'số Stirling loại hai'), tn('integer partition', 'phân hoạch số nguyên')],
  khaiNiem: ['distributions', 'partitions'],
});
assert.equal(partitionsInto(5, 3), 5); assert.equal(stirling2(5, 2), 15);

function derangementCount(n) {
  if (n === 0) return 1;
  var a = 1, b = 0;
  for (var i = 2; i <= n; i++) { var t = (i - 1) * (a + b); a = b; b = t; }
  return b;
}
const K4 = jsDe({
  tieuDe: 'Counting lab 4 — Count derangements with a recurrence',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>A derangement of n objects is a permutation with no fixed point. Write <code>derangementCount(n)</code> using D(0) = 1, D(1) = 0 and D(n) = (n − 1)·(D(n−1) + D(n−2)). Values for n up to 18 fit exactly in a JavaScript number.</p>', '<p>Hoán vị mất trật tự của n vật là hoán vị không có điểm bất động. Viết <code>derangementCount(n)</code> dùng D(0) = 1, D(1) = 0 và D(n) = (n − 1)·(D(n−1) + D(n−2)). Giá trị với n tới 18 vừa chính xác trong số JavaScript.</p>'),
  yeuCau: [bi('Iterate; keep the last two values.', 'Lặp; giữ hai giá trị gần nhất.')],
  viDu: [{ input: 'derangementCount(4)', output: '9', explanation: '9 of the 24 permutations of 4 objects have no fixed point.|||9 trong 24 hoán vị của 4 vật không có điểm bất động.' }],
  goiY: ['Start with a = D(0) = 1, b = D(1) = 0 and iterate i = 2…n.', 'D(n) ≈ n!/e.'],
  loiHayGap: ['Using n − 1 on the wrong factor: it multiplies the SUM D(n−1) + D(n−2).', 'Returning 0 for n = 0 (D(0) = 1: the empty permutation).'],
  giaiThich: '<p>Object n goes to one of n − 1 other places; the displaced object either points back (D(n−2) ways) or not (D(n−1) ways).</p>',
  khaiNiem: ['derangements', 'recurrence'],
  fn: 'derangementCount',
  dau: 'function derangementCount(n) {\n  return 0;\n}\n',
  giaiMa: dat(derangementCount, 'derangementCount'),
  ref: derangementCount,
  cases: [{ args: [0] }, { args: [1] }, { args: [4] }, { args: [5] }, { args: [10], an: true }, { args: [18], an: true }],
});

function partitionCount(n) {
  var p = [1], i, j;
  for (i = 1; i <= n; i++) p.push(0);
  for (j = 1; j <= n; j++) for (i = j; i <= n; i++) p[i] += p[i - j];
  return p[n];
}
const K5 = jsDe({
  tieuDe: 'Counting lab 5 — Count integer partitions',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>partitionCount(n)</code> returning the number of ways to write n as a sum of positive integers where order does not matter (4 = 4 = 3+1 = 2+2 = 2+1+1 = 1+1+1+1 gives 5). Use the coin-change style dynamic programme: process part sizes j = 1…n one at a time and update ways[i] += ways[i − j] for i from j to n.</p>', '<p>Viết <code>partitionCount(n)</code> trả số cách viết n thành tổng các số nguyên dương không kể thứ tự (4 = 4 = 3+1 = 2+2 = 2+1+1 = 1+1+1+1 cho 5). Dùng quy hoạch động kiểu đổi tiền: xử lý từng cỡ phần j = 1…n và cập nhật ways[i] += ways[i − j] với i từ j đến n.</p>'),
  yeuCau: [bi('p(0) = 1. n is at most 100 in the tests (p(100) = 190,569,292).', 'p(0) = 1. n tối đa 100 trong test (p(100) = 190.569.292).')],
  viDu: [{ input: 'partitionCount(4)', output: '5', explanation: 'The partitions listed in the statement.|||Các phân hoạch ghi ở đề.' }, { input: 'partitionCount(7)', output: '15', explanation: 'p(7) = 15.|||p(7) = 15.' }],
  goiY: ['The outer loop is over the part size; this makes each multiset of parts counted once, not each sequence.', 'Initialise ways[0] = 1, the rest 0.'],
  loiHayGap: ['Putting the part-size loop inside the amount loop (counts compositions = ordered sums).', 'Starting the inner loop at 1 instead of j.'],
  giaiThich: '<p>Outer loop on part size ⇒ unordered; swapping the loops counts ordered sums, which is 2^(n−1) for compositions of n.</p>',
  khaiNiem: ['partitions', 'dynamic programming'],
  fn: 'partitionCount',
  dau: 'function partitionCount(n) {\n  return 0;\n}\n',
  giaiMa: dat(partitionCount, 'partitionCount'),
  ref: partitionCount,
  cases: [{ args: [0] }, { args: [4] }, { args: [7] }, { args: [20] }, { args: [50], an: true }, { args: [100], an: true }],
});
assert.equal(partitionCount(100), 190569292);

function stirlingSecond(n, k) {
  var s = [], i, j;
  for (i = 0; i <= n; i++) { s.push([]); for (j = 0; j <= k; j++) s[i].push(0); }
  s[0][0] = 1;
  for (i = 1; i <= n; i++) for (j = 1; j <= k; j++) s[i][j] = s[i - 1][j - 1] + j * s[i - 1][j];
  return s[n][k];
}
const K6 = jsDe({
  tieuDe: 'Counting lab 6 — Stirling numbers of the second kind',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>S(n, k) is the number of ways to split n labelled objects into exactly k non-empty unlabelled groups. Write <code>stirlingSecond(n, k)</code> using S(0,0) = 1, S(n,0) = 0 for n &gt; 0, S(0,k) = 0 for k &gt; 0 and the recurrence S(n, k) = S(n−1, k−1) + k·S(n−1, k) (object n forms its own group, or joins one of the k existing groups).</p>', '<p>S(n, k) là số cách chia n vật có nhãn thành đúng k nhóm không rỗng không nhãn. Viết <code>stirlingSecond(n, k)</code> dùng S(0,0) = 1, S(n,0) = 0 với n &gt; 0, S(0,k) = 0 với k &gt; 0 và S(n, k) = S(n−1, k−1) + k·S(n−1, k) (vật n lập nhóm riêng, hoặc vào một trong k nhóm sẵn có).</p>'),
  yeuCau: [bi('k may exceed n; the answer is then 0.', 'k có thể lớn hơn n; khi đó đáp án là 0.')],
  viDu: [{ input: 'stirlingSecond(4,2)', output: '7', explanation: '{1}{234}, {2}{134}, {3}{124}, {4}{123} and {12}{34}, {13}{24}, {14}{23}.|||{1}{234}, {2}{134}, {3}{124}, {4}{123} và {12}{34}, {13}{24}, {14}{23}.' }],
  goiY: ['Fill a table (n+1)×(k+1) row by row.', 'The sum over k of S(n,k) is the Bell number B(n).'],
  loiHayGap: ['Forgetting the factor k in front of S(n−1, k).', 'Mixing S(n,k) with the unsigned Stirling numbers of the first kind.'],
  giaiThich: '<p>This is the same “object n joins an existing group or starts a new one” argument behind the surjection count k!·S(n,k).</p>',
  khaiNiem: ['Stirling numbers', 'set partitions'],
  fn: 'stirlingSecond',
  dau: 'function stirlingSecond(n, k) {\n  return 0;\n}\n',
  giaiMa: dat(stirlingSecond, 'stirlingSecond'),
  ref: stirlingSecond,
  cases: [{ args: [4, 2] }, { args: [0, 0] }, { args: [5, 0] }, { args: [3, 5] }, { args: [10, 3], an: true }, { args: [12, 6], an: true }],
});
assert.equal(stirlingSecond(6, 3) * 6, S.numSurjective(6, 3));

function nextPermutation(a) {
  var arr = a.slice(), i = arr.length - 2, j, t;
  while (i >= 0 && arr[i] >= arr[i + 1]) i--;
  if (i < 0) return null;
  j = arr.length - 1;
  while (arr[j] <= arr[i]) j--;
  t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  var lo = i + 1, hi = arr.length - 1;
  while (lo < hi) { t = arr[lo]; arr[lo] = arr[hi]; arr[hi] = t; lo++; hi--; }
  return arr;
}
const K7 = jsDe({
  tieuDe: 'Counting lab 7 — Next permutation in lexicographic order',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>nextPermutation(a)</code> returning the permutation of the integer array <code>a</code> that comes right after it in lexicographic order (the array may contain repeated values), or <code>null</code> when <code>a</code> is already the last (non-increasing) arrangement. Do not mutate the input. Algorithm: find the rightmost i with a[i] &lt; a[i+1]; find the rightmost j &gt; i with a[j] &gt; a[i]; swap them; reverse the suffix after i. It generates the n! permutations one by one.</p>', '<p>Viết <code>nextPermutation(a)</code> trả hoán vị đứng ngay sau <code>a</code> theo thứ tự từ điển (mảng có thể chứa giá trị lặp), hoặc <code>null</code> khi <code>a</code> đã là cách xếp cuối (không tăng). Không sửa mảng đầu vào. Thuật toán: tìm i lớn nhất có a[i] &lt; a[i+1]; tìm j lớn nhất &gt; i có a[j] &gt; a[i]; hoán đổi; đảo phần đuôi sau i. Nó sinh lần lượt n! hoán vị.</p>'),
  yeuCau: [bi('O(n) time per call.', 'O(n) thời gian mỗi lần gọi.')],
  viDu: [{ input: 'nextPermutation([1,2,3])', output: '[1,3,2]', explanation: 'i = 1 (2 < 3), j = 2: swap then reverse the one-element suffix.|||i = 1 (2 < 3), j = 2: hoán đổi rồi đảo đuôi một phần tử.' }, { input: 'nextPermutation([3,2,1])', output: 'null', explanation: 'The last permutation.|||Hoán vị cuối cùng.' }],
  goiY: ['Scan from the right for the first ascent; if there is none the array is the last permutation.', 'After the swap the suffix is non-increasing, so reversing it makes it the smallest.'],
  loiHayGap: ['Sorting the suffix with the default string sort.', 'Using ≥ vs > incorrectly with duplicates (a[i] >= a[i+1] must continue scanning).'],
  giaiThich: '<p>The suffix after the pivot is in descending order — already the largest arrangement of those elements — so the next permutation must change the pivot to the next larger element and then minimise the suffix.</p>',
  khaiNiem: ['permutations', 'lexicographic order'],
  fn: 'nextPermutation',
  dau: 'function nextPermutation(a) {\n  return null;\n}\n',
  giaiMa: dat(nextPermutation, 'nextPermutation'),
  ref: nextPermutation,
  cases: [{ args: [[1, 2, 3]] }, { args: [[3, 2, 1]] }, { args: [[1, 1, 2]] }, { args: [[]] , an: true }, { args: [[1, 3, 2, 4]], an: true }, { args: [[2, 3, 1, 3, 3]], an: true }, { args: [[5]], an: true }],
});
void mcNum; void f2;

export default doiDau({
  slug: 'mad101-6-lab-counting-toolbox',
  ten: '6.L Lab: counting toolbox',
  khoa: KHOA,
  baiHoc: 'mad101-6-1-dem-to-hop',
  de: [K1, K2, K3, K4, K5, K6, K7],
});
