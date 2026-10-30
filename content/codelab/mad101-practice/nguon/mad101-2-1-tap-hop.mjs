/** MAD101 · 2.1 — Sets and set operations. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum, setAns } from './_md.mjs';

const f2 = (x) => String(x);
const E1 = tinh({
  tieuDe: 'Sets 1 — Notation, subsets and power sets',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Core vocabulary of sets (Rosen §2.1): membership, subsets, the empty set, power sets and Cartesian products.</p>', '<p>Từ vựng cốt lõi của tập hợp (Rosen §2.1): thuộc, tập con, tập rỗng, tập luỹ thừa và tích Descartes.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which statement is TRUE?', 'Khẳng định nào ĐÚNG?'], ['∅ ⊆ A for every set A', '∅ ∈ A for every set A', 'A ⊂ A for every set A', '{∅} = ∅'], ['The empty set is a subset of every set; it is a member only of sets that contain it.', 'Tập rỗng là tập con của mọi tập; nó chỉ là phần tử của tập nào chứa nó.']),
    q('c2', ['If A = {1, {2}, 3}, then …', 'Nếu A = {1, {2}, 3} thì …'], ['{2} ∈ A but 2 ∉ A', '2 ∈ A', '{1, 3} ∈ A but 1 ∉ A', '{2} ⊆ A and 2 ∈ A'], ['{2} is an element of A (a set inside a set); the number 2 is not.', '{2} là một phần tử của A (tập nằm trong tập); số 2 thì không.']),
    q('c3', ['A set with n elements has … subsets.', 'Một tập có n phần tử có … tập con.'], ['2ⁿ', 'n²', 'n!', '2n'], ['Each element is either in or out of a subset: 2 choices, n times.', 'Mỗi phần tử hoặc ở trong hoặc ở ngoài tập con: 2 lựa chọn, n lần.']),
    q('c4', ['|A × B| equals …', '|A × B| bằng …'], ['|A|·|B|', '|A| + |B|', '|A|^|B|', '2^(|A|+|B|)'], ['Each element of A pairs with each element of B.', 'Mỗi phần tử của A ghép với mỗi phần tử của B.']),
    q('c5', ['A ⊕ B (symmetric difference) contains …', 'A ⊕ B (hiệu đối xứng) chứa …'], ['elements in exactly one of A, B', 'elements in both A and B', 'elements in A but not in B only', 'all elements of A ∪ B'], ['A ⊕ B = (A − B) ∪ (B − A) = (A ∪ B) − (A ∩ B).', 'A ⊕ B = (A − B) ∪ (B − A) = (A ∪ B) − (A ∩ B).']),
    q('c6', ['|{∅, {∅}}| equals …', '|{∅, {∅}}| bằng …'], ['2', '1', '0', '3'], ['The two elements are ∅ and {∅}.', 'Hai phần tử là ∅ và {∅}.']),
  ],
  goiY: ['Distinguish “∈” (member) from “⊆” (subset): a set inside braces is one element.', 'Counting rules: |P(A)| = 2^|A|, |A × B| = |A|·|B|.'],
  loiHayGap: ['Confusing ∅ with {∅}: the first has 0 elements, the second has 1.', 'Using ∈ where ⊆ is meant.'],
  thuatNgu: [tn('power set', 'tập luỹ thừa'), tn('Cartesian product', 'tích Descartes'), tn('symmetric difference', 'hiệu đối xứng')],
  khaiNiem: ['sets', 'subsets'],
});

/* set operations table */
const U = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CASES = [
  { A: [1, 2, 3, 5, 8], B: [2, 4, 5, 9] }, { A: [2, 4, 6, 8, 10], B: [3, 6, 9] }, { A: [1, 3, 5, 7, 9], B: [2, 4, 6, 8, 10] },
];
const OPS = [['A ∪ B', 'union'], ['A ∩ B', 'inter'], ['A − B', 'diff'], ['B − A', null], ['A ⊕ B', 'symdiff']];
const opv = (c, o) => o[1] ? S.setOp(o[1], c.A, c.B) : S.setOp('diff', c.B, c.A);
const E2 = tinh({
  tieuDe: 'Sets 2 — Compute unions, intersections and differences',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Universe U = {1,…,10}. For every pair of sets write the result in ascending order, e.g. <code>1,2,5</code> (braces are optional). Write <code>∅</code> for the empty set.</p>', '<p>Vũ trụ U = {1,…,10}. Với mỗi cặp tập, viết kết quả theo thứ tự tăng dần, ví dụ <code>1,2,5</code> (có thể thêm ngoặc nhọn). Tập rỗng viết <code>∅</code>.</p>'),
  loai: 'table',
  bang: CASES.map((c, i) => bang1('b' + (i + 1), [`A = {${c.A.join(', ')}},  B = {${c.B.join(', ')}}`, `A = {${c.A.join(', ')}},  B = {${c.B.join(', ')}}`], [{ ma: 'op', ten: 'Operation' }, { ma: 'res', ten: 'Result' }],
    [...OPS, ['Ā (complement in U)', 'c']].map((o) => ({ o: { op: o[0] }, a: { res: setAns(o[1] === 'c' ? U.filter((x) => !c.A.includes(x)) : opv(c, o)) } })),
    [[...OPS.map((o) => `${o[0]} = ${opv(c, o).length ? `{${opv(c, o).join(',')}}` : '∅'}`), `Ā = {${U.filter((x) => !c.A.includes(x)).join(',')}}`].join('; ') + '.', [...OPS.map((o) => `${o[0]} = ${opv(c, o).length ? `{${opv(c, o).join(',')}}` : '∅'}`), `Ā = {${U.filter((x) => !c.A.includes(x)).join(',')}}`].join('; ') + '.'])),
  goiY: ['Mark each element of U as in A, in B, in both or in neither; every operation is just a rule on those four categories.', 'A ⊕ B contains elements in exactly one of the two sets.'],
  loiHayGap: ['Forgetting that A − B and B − A are different.', 'Leaving out the elements of U that belong to neither set when computing the complement.'],
  thuatNgu: [tn('complement', 'phần bù'), tn('difference', 'hiệu')],
  khaiNiem: ['set operations'],
});

/* bit strings */
const SB = [{ A: [1, 3, 5, 7, 9], B: [1, 2, 3, 4, 5] }, { A: [2, 3, 5, 7], B: [1, 3, 5, 7, 9] }, { A: [4, 5, 6, 7, 8], B: [2, 4, 6, 8, 10] }];
const bs = (X) => S.bits(U, X);
const bop = (a, b, f) => a.split('').map((c, i) => String(f(+c, +b[i]))).join('');
const E3 = tinh({
  tieuDe: 'Sets 3 — Sets as bit strings',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A subset of the ordered universe U = (1,2,…,10) is stored as a 10-bit string: bit i is 1 when element i belongs to the set. Union is bitwise OR, intersection is bitwise AND, symmetric difference is XOR. Fill in each bit string (10 characters, no spaces) and then convert the result back to a set.</p>', '<p>Tập con của vũ trụ có thứ tự U = (1,2,…,10) lưu bằng xâu 10 bit: bit i bằng 1 khi phần tử i thuộc tập. Hợp là OR từng bit, giao là AND, hiệu đối xứng là XOR. Điền từng xâu bit (10 ký tự, không dấu cách) rồi đổi kết quả về tập.</p>'),
  loai: 'table',
  bang: SB.map((c, i) => bang1('b' + (i + 1), [`A = {${c.A.join(', ')}},  B = {${c.B.join(', ')}}`, `A = {${c.A.join(', ')}},  B = {${c.B.join(', ')}}`], [{ ma: 'w', ten: 'What' }, { ma: 'bits', ten: 'Bit string' }, { ma: 'set', ten: 'As a set' }],
    [
      { o: { w: 'A' }, a: { bits: bs(c.A), set: setAns(c.A) } }, { o: { w: 'B' }, a: { bits: bs(c.B), set: setAns(c.B) } },
      { o: { w: 'A ∪ B' }, a: { bits: bop(bs(c.A), bs(c.B), (x, y) => x | y), set: setAns(S.setOp('union', c.A, c.B)) } },
      { o: { w: 'A ∩ B' }, a: { bits: bop(bs(c.A), bs(c.B), (x, y) => x & y), set: setAns(S.setOp('inter', c.A, c.B)) } },
      { o: { w: 'A ⊕ B' }, a: { bits: bop(bs(c.A), bs(c.B), (x, y) => x ^ y), set: setAns(S.setOp('symdiff', c.A, c.B)) } },
    ],
    [`A=${bs(c.A)}, B=${bs(c.B)}, OR=${bop(bs(c.A), bs(c.B), (x, y) => x | y)}, AND=${bop(bs(c.A), bs(c.B), (x, y) => x & y)}, XOR=${bop(bs(c.A), bs(c.B), (x, y) => x ^ y)}.`, `A=${bs(c.A)}, B=${bs(c.B)}, OR=${bop(bs(c.A), bs(c.B), (x, y) => x | y)}, AND=${bop(bs(c.A), bs(c.B), (x, y) => x & y)}, XOR=${bop(bs(c.A), bs(c.B), (x, y) => x ^ y)}.`])),
  goiY: ['Write the string position by position: position 1 stands for the element 1, position 10 for the element 10.', 'Do the three operations bit by bit, aligning the strings in two rows.'],
  loiHayGap: ['Reading the string right-to-left.', 'Using OR where XOR is required for ⊕.'],
  thuatNgu: [tn('bit string', 'xâu bit'), tn('bitwise', 'từng bit')],
  khaiNiem: ['bit strings', 'bitwise operations'],
});

/* counting with sets */
const INC = [[40, 30, 25, 12, 10, 8, 4, 100], [60, 45, 30, 20, 15, 10, 5, 120]];
const [a1, b1, c1, ab1, ac1, bc1, abc1, n1] = INC[0];
const u1 = S.incExc3(a1, b1, c1, ab1, ac1, bc1, abc1);
assert.equal(S.incExc2(70, 50, 20), 100);
const E4 = tinh({
  tieuDe: 'Sets 4 — Cardinality and inclusion–exclusion',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Counting questions on set sizes: power sets, Cartesian products, subsets with conditions and the inclusion–exclusion principle.</p>', '<p>Các câu đếm kích thước tập: tập luỹ thừa, tích Descartes, tập con có điều kiện và nguyên lý bao hàm–loại trừ.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['How many subsets does a 9-element set have?', 'Tập 9 phần tử có bao nhiêu tập con?'], 2 ** 9, [9 * 9, 2 * 9, 2 ** 8], f2, ['2⁹ = 512.', '2⁹ = 512.']),
    mcNum('c2', ['|A| = 7, |B| = 6: how many elements does A × B have?', '|A| = 7, |B| = 6: A × B có bao nhiêu phần tử?'], 42, [13, 7 ** 6, 2 ** 13], f2, ['7 × 6 = 42.', '7 × 6 = 42.']),
    mcNum('c3', ['A has 8 elements. How many subsets contain two given elements?', 'A có 8 phần tử. Có bao nhiêu tập con chứa hai phần tử cho trước?'], 2 ** 6, [2 ** 8 - 2, 2 ** 7, 6 * 6], f2, ['The two are forced in; the other 6 are free: 2⁶ = 64.', 'Hai phần tử bắt buộc có mặt; 6 phần tử còn lại tự do: 2⁶ = 64.']),
    mcNum('c4', [`In a class of ${n1}, ${a1} study A, ${b1} study B, ${c1} study C, ${ab1} study A and B, ${ac1} A and C, ${bc1} B and C, ${abc1} all three. How many study at least one?`, `Lớp ${n1} người, ${a1} học A, ${b1} học B, ${c1} học C, ${ab1} học A và B, ${ac1} A và C, ${bc1} B và C, ${abc1} học cả ba. Bao nhiêu người học ít nhất một môn?`], u1, [a1 + b1 + c1, u1 + abc1, u1 - abc1], f2, [`|A∪B∪C| = ${a1}+${b1}+${c1} − ${ab1} − ${ac1} − ${bc1} + ${abc1} = ${u1}.`, `|A∪B∪C| = ${a1}+${b1}+${c1} − ${ab1} − ${ac1} − ${bc1} + ${abc1} = ${u1}.`]),
    mcNum('c5', [`Same class (${n1} students): how many study none of A, B, C?`, `Cùng lớp (${n1} học sinh): bao nhiêu người không học môn nào?`], n1 - u1, [u1, n1 - u1 - abc1, n1 - a1 - b1 - c1], f2, [`${n1} − ${u1} = ${n1 - u1}.`, `${n1} − ${u1} = ${n1 - u1}.`]),
    mcNum('c6', ['How many integers in 1..200 are divisible by 4 or 6?', 'Có bao nhiêu số nguyên trong 1..200 chia hết cho 4 hoặc 6?'], S.countDivisibleByAny(200, [4, 6]), [50 + 33, 50 + 33 + 16, 50 + 33 - 8], f2, [`⌊200/4⌋ + ⌊200/6⌋ − ⌊200/12⌋ = 50 + 33 − 16 = ${S.countDivisibleByAny(200, [4, 6])}. Note lcm(4,6) = 12.`, `⌊200/4⌋ + ⌊200/6⌋ − ⌊200/12⌋ = ${S.countDivisibleByAny(200, [4, 6])}. Lưu ý bội chung nhỏ nhất của 4 và 6 là 12.`]),
  ],
  goiY: ['Inclusion–exclusion: add singles, subtract pairs, add the triple.', 'For divisibility, the intersection is the multiples of the lcm, not of the product.'],
  loiHayGap: ['Adding the three sizes and forgetting the overlaps.', 'Using 4·6 = 24 instead of lcm = 12 for the overlap.'],
  thuatNgu: [tn('inclusion–exclusion', 'bao hàm–loại trừ'), tn('cardinality', 'lực lượng')],
  khaiNiem: ['cardinality', 'inclusion–exclusion'],
});

/* proof ordering */
const E5 = tinh({
  tieuDe: 'Sets 5 — Prove A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C) element-wise',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Arrange the lines of the ⊆ half of an element-chasing proof (take an arbitrary element and follow it).</p>', '<p>Sắp các dòng của nửa chứng minh ⊆ theo kiểu theo dõi phần tử (lấy phần tử bất kỳ rồi lần theo).</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Prove A ∩ (B ∪ C) ⊆ (A ∩ B) ∪ (A ∩ C).', 'Chứng minh A ∩ (B ∪ C) ⊆ (A ∩ B) ∪ (A ∩ C).'], ['Let x ∈ A ∩ (B ∪ C) be arbitrary.', 'Then x ∈ A and x ∈ B ∪ C.', 'So x ∈ A and (x ∈ B or x ∈ C).', 'Case x ∈ B: then x ∈ A ∩ B; case x ∈ C: then x ∈ A ∩ C.', 'In both cases x ∈ (A ∩ B) ∪ (A ∩ C). Hence the inclusion.'], ['Always start from an arbitrary element, unfold the definition of ∩, split on the “or”, and fold back.', 'Luôn bắt đầu từ phần tử bất kỳ, khai triển định nghĩa ∩, chia trường hợp theo “hoặc”, rồi gộp lại.'], 2),
    ord('q2', ['Order the algorithm that counts |A ∪ B ∪ C|.', 'Sắp thuật toán đếm |A ∪ B ∪ C|.'], ['Add |A| + |B| + |C|.', 'Subtract |A ∩ B|, |A ∩ C| and |B ∩ C|.', 'Add back |A ∩ B ∩ C|.', 'Report the final value.'], ['The triple intersection was subtracted three times and added three times, so it needs one add-back.', 'Giao ba tập bị trừ ba lần và cộng ba lần nên cần cộng lại một lần.'], 1),
  ],
  goiY: ['In an element proof the first line introduces an arbitrary element and the last line states the target membership.', 'The case split follows the “or” in the middle.'],
  loiHayGap: ['Starting from a specific element instead of an arbitrary one.', 'Forgetting to close both cases.'],
  thuatNgu: [tn('arbitrary element', 'phần tử tuỳ ý')],
  khaiNiem: ['set identity proofs'],
});

/* Venn region table */
const VN = [[40, 30, 25, 12, 10, 8, 4, 100], [60, 45, 30, 20, 15, 10, 5, 150], [35, 28, 22, 9, 7, 6, 3, 80]];
const VR = (v) => {
  const [a, b, c, ab, ac, bc, abc, n] = v;
  const un = S.incExc3(a, b, c, ab, ac, bc, abc);
  const two = ab + ac + bc - 3 * abc, one = a + b + c - 2 * (ab + ac + bc) + 3 * abc;
  return { un, two, one, none: n - un, onlyA: a - ab - ac + abc };
};
const E6 = tinh({
  tieuDe: 'Sets 6 — Fill the Venn diagram regions',
  doKho: 'HARD', phut: 18,
  moTa: bi('<p>Three sets A, B, C inside a universe of N people. Given the sizes of every set and every intersection, compute the region counts: people in <b>at least one</b> set, in <b>none</b>, in <b>exactly one</b>, in <b>exactly two</b>, and in <b>only A</b>.</p>', '<p>Ba tập A, B, C trong tập N người. Cho kích thước mọi tập và mọi giao, tính số người ở từng miền: <b>ít nhất một</b> tập, <b>không</b> tập nào, <b>đúng một</b>, <b>đúng hai</b> và <b>chỉ A</b>.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Venn regions', 'Các miền Venn'], [{ ma: 'g', ten: '|A|,|B|,|C|, |A∩B|,|A∩C|,|B∩C|, |A∩B∩C|, N' }, { ma: 'un', ten: 'At least one' }, { ma: 'none', ten: 'None' }, { ma: 'one', ten: 'Exactly one' }, { ma: 'two', ten: 'Exactly two' }, { ma: 'oa', ten: 'Only A' }],
    VN.map((v) => { const r = VR(v); return { o: { g: v.join(', ') }, a: { un: String(r.un), none: String(r.none), one: String(r.one), two: String(r.two), oa: String(r.onlyA) } }; }),
    [VN.map((v) => { const r = VR(v); return `(${v.join(',')}): union ${r.un}, none ${r.none}, exactly one ${r.one}, exactly two ${r.two}, only A ${r.onlyA}`; }).join('; ') + '. Exactly two = Σ|pair| − 3|triple|; exactly one = Σ|single| − 2Σ|pair| + 3|triple|; only A = |A| − |A∩B| − |A∩C| + |A∩B∩C|.', VN.map((v) => { const r = VR(v); return `(${v.join(',')}): hợp ${r.un}, không ${r.none}, đúng một ${r.one}, đúng hai ${r.two}, chỉ A ${r.onlyA}`; }).join('; ') + '.'])],
  goiY: ['Start from the centre: the triple intersection, then “exactly two” by subtracting it from each pair.', 'Check: only-A + only-B + only-C + exactly-two + triple = union.'],
  loiHayGap: ['Using |A∩B| as the “exactly two (A and B)” region without removing the centre.', 'Subtracting the pairs without adding the triple back in the union formula.'],
  thuatNgu: [tn('Venn diagram', 'biểu đồ Venn')],
  khaiNiem: ['Venn regions', 'inclusion–exclusion'],
});
assert.ok(VN.every((v) => VR(v).none >= 0 && VR(v).onlyA >= 0));

/* code */
function setOps(A, B) {
  function uniq(x) { var out = []; x.forEach(function (v) { if (out.indexOf(v) < 0) out.push(v); }); return out; }
  var a = uniq(A), b = uniq(B), asc = function (x, y) { return x - y; };
  var union = uniq(a.concat(b)).sort(asc);
  var inter = a.filter(function (v) { return b.indexOf(v) >= 0; }).sort(asc);
  var diff = a.filter(function (v) { return b.indexOf(v) < 0; }).sort(asc);
  var symdiff = diff.concat(b.filter(function (v) { return a.indexOf(v) < 0; })).sort(asc);
  return { union: union, inter: inter, diff: diff, symdiff: symdiff };
}
const E7 = jsDe({
  tieuDe: 'Sets 7 — Implement the set operations',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>setOps(A, B)</code> for two arrays of integers (they may contain duplicates, which a set ignores). Return an object <code>{ union, inter, diff, symdiff }</code> where each field is an array of distinct integers in ascending order: <code>union</code> = A ∪ B, <code>inter</code> = A ∩ B, <code>diff</code> = A − B and <code>symdiff</code> = A ⊕ B.</p>', '<p>Viết <code>setOps(A, B)</code> cho hai mảng số nguyên (có thể trùng, tập hợp bỏ qua trùng). Trả đối tượng <code>{ union, inter, diff, symdiff }</code>, mỗi trường là mảng số nguyên phân biệt tăng dần: <code>union</code> = A ∪ B, <code>inter</code> = A ∩ B, <code>diff</code> = A − B, <code>symdiff</code> = A ⊕ B.</p>'),
  yeuCau: [bi('Remove duplicates first; sort numerically (not as strings).', 'Loại trùng trước; sắp theo số (không phải chuỗi).')],
  viDu: [{ input: 'setOps([1,2,3,3],[3,4])', output: JSON.stringify(setOps([1, 2, 3, 3], [3, 4])), explanation: 'Duplicates ignored; 3 is the only common element.|||Bỏ qua trùng; 3 là phần tử chung duy nhất.' }],
  goiY: ['Write a small uniq helper first, then derive the four results with filter.', 'Array.prototype.sort sorts as strings by default — pass (x, y) => x − y.'],
  loiHayGap: ['Default sort puts 10 before 2.', 'Computing symmetric difference as (A ∪ B) − (A ∩ B) while forgetting to sort or de-duplicate.'],
  giaiThich: '<p>A set has no order and no duplicates; the canonical representation is a sorted array of distinct values. Each operation is a filter on membership.</p>',
  khaiNiem: ['arrays as sets', 'filter'],
  fn: 'setOps',
  dau: 'function setOps(A, B) {\n  return { union: [], inter: [], diff: [], symdiff: [] };\n}\n',
  giaiMa: dat(setOps, 'setOps'),
  ref: setOps,
  cases: [{ args: [[1, 2, 3], [3, 4, 5]] }, { args: [[], [1, 2]] }, { args: [[5, 5, 1], [1, 5, 5]] }, { args: [[10, 2, 33], [2, 10, 4]], an: true }, { args: [[1, 3, 5, 7, 9], [2, 4, 6, 8]], an: true }, { args: [[-1, -2, 0], [0, 1, -1]], an: true }],
});

function powerSet(A) {
  var out = [];
  for (var m = 0; m < (1 << A.length); m++) {
    var s = [];
    for (var i = 0; i < A.length; i++) if (m & (1 << i)) s.push(A[i]);
    out.push(s);
  }
  return out;
}
function subsetsWithSum(A, target) {
  var out = [];
  for (var m = 0; m < (1 << A.length); m++) {
    var s = [], t = 0;
    for (var i = 0; i < A.length; i++) if (m & (1 << i)) { s.push(A[i]); t += A[i]; }
    if (t === target) out.push(s);
  }
  return out;
}
const E8 = jsDe({
  tieuDe: 'Sets 8 — Generate the power set and count subsets by property',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>subsetsWithSum(A, target)</code> that returns every subset of the array <code>A</code> (distinct integers, at most 12 elements) whose elements add up to <code>target</code>. Enumerate subsets in the order of the bit mask <code>m = 0 … 2ⁿ − 1</code>, where bit <code>i</code> of <code>m</code> says whether <code>A[i]</code> is included; each subset keeps the order of <code>A</code>. The empty subset has sum 0 and belongs to the answer when target is 0.</p>', '<p>Viết <code>subsetsWithSum(A, target)</code> trả mọi tập con của mảng <code>A</code> (số nguyên phân biệt, tối đa 12 phần tử) có tổng bằng <code>target</code>. Duyệt tập con theo mặt nạ bit <code>m = 0 … 2ⁿ − 1</code>, bit <code>i</code> của <code>m</code> cho biết có lấy <code>A[i]</code> hay không; mỗi tập con giữ thứ tự của <code>A</code>. Tập rỗng có tổng 0 và thuộc đáp án khi target = 0.</p>'),
  yeuCau: [bi('Return an array of arrays, in increasing mask order.', 'Trả mảng các mảng, theo thứ tự mặt nạ tăng dần.')],
  viDu: [{ input: 'subsetsWithSum([1,2,3,4], 5)', output: JSON.stringify(subsetsWithSum([1, 2, 3, 4], 5)), explanation: 'Mask 6 gives [2,3] and mask 9 gives [1,4]; masks are visited in increasing order.|||Mặt nạ 6 cho [2,3], mặt nạ 9 cho [1,4]; duyệt mặt nạ tăng dần.' }],
  goiY: ['Loop m over all 2ⁿ masks and build the subset from the set bits.', 'Keep a running sum while you build the subset, then compare to target.'],
  loiHayGap: ['Skipping the empty subset when target = 0.', 'Reusing the same inner array between iterations (push a fresh array each time).'],
  giaiThich: '<p>A subset of an n-element set corresponds to an n-bit mask, so the power set has 2ⁿ members; filtering them by a property is brute-force enumeration — the same idea behind subset-sum.</p>',
  khaiNiem: ['power set', 'bit masks', 'brute force'],
  fn: 'subsetsWithSum',
  dau: 'function subsetsWithSum(A, target) {\n  return [];\n}\n',
  giaiMa: dat(subsetsWithSum, 'subsetsWithSum'),
  ref: subsetsWithSum,
  cases: [{ args: [[1, 2, 3, 4], 5] }, { args: [[3, 1], 0] }, { args: [[2, 4, 6], 7] }, { args: [[1, 2, 3, 4, 5, 6], 9], an: true }, { args: [[-1, 1, 2], 1], an: true }, { args: [[5], 5], an: true }],
});
assert.deepEqual(S.powerSet([1, 2, 3]).length, 8);
void powerSet;

export default doiDau({
  slug: 'mad101-2-1-tap-hop',
  ten: '2.1 Sets & set operations',
  khoa: KHOA,
  baiHoc: 'mad101-2-1-tap-hop',
  de: [E1, E2, E3, E4, E5, E6, E7, E8],
});
