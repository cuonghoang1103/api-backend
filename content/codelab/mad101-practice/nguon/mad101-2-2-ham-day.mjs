/** MAD101 · 2.2 — Functions, floor/ceiling, composition, inverses, sequences & summations. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum, listAns, dec } from './_md.mjs';

const f2 = (x) => String(x);
const E1 = tinh({
  tieuDe: 'Functions 1 — Domain, range and one-to-one / onto',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Vocabulary of functions (Rosen §2.3): domain, codomain, range, injective, surjective, bijective.</p>', '<p>Từ vựng về hàm (Rosen §2.3): miền xác định, miền giá trị đích, tập ảnh, đơn ánh, toàn ánh, song ánh.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A function f: A → B is one-to-one (injective) if …', 'Hàm f: A → B là đơn ánh nếu …'], ['different inputs always give different outputs', 'every element of B is hit', 'every input has an output', 'f(x) = x for all x'], ['f(a) = f(b) ⇒ a = b.', 'f(a) = f(b) ⇒ a = b.']),
    q('c2', ['f is onto (surjective) if …', 'f là toàn ánh nếu …'], ['the range equals the codomain', 'no two inputs share an output', 'the domain equals the codomain', 'f is increasing'], ['Every element of the codomain is the image of at least one input.', 'Mỗi phần tử của đích là ảnh của ít nhất một đầu vào.']),
    q('c3', ['Only a bijection has an …', 'Chỉ song ánh mới có …'], ['inverse function', 'image', 'composition', 'domain'], ['A bijection is both one-to-one and onto, so reversing the arrows is again a function.', 'Song ánh vừa đơn ánh vừa toàn ánh nên đảo mũi tên vẫn là hàm.']),
    q('c4', ['f(x) = x² from ℤ to ℤ is …', 'f(x) = x² từ ℤ vào ℤ là …'], ['neither one-to-one nor onto', 'one-to-one but not onto', 'onto but not one-to-one', 'a bijection'], ['f(2) = f(−2) (not injective) and 3 is never a square (not surjective).', 'f(2) = f(−2) (không đơn ánh) và 3 không là bình phương (không toàn ánh).']),
    q('c5', ['f(x) = 2x + 1 from ℝ to ℝ is …', 'f(x) = 2x + 1 từ ℝ vào ℝ là …'], ['a bijection', 'one-to-one but not onto', 'onto but not one-to-one', 'neither'], ['Solve y = 2x + 1 for x = (y − 1)/2 — always exists and is unique.', 'Giải y = 2x + 1 được x = (y − 1)/2 — luôn tồn tại và duy nhất.']),
    q('c6', ['If f: A → B is a bijection between finite sets, then …', 'Nếu f: A → B là song ánh giữa hai tập hữu hạn thì …'], ['|A| = |B|', '|A| < |B|', '|A| > |B|', '|A| and |B| are unrelated'], ['A bijection pairs the elements one for one.', 'Song ánh ghép các phần tử một-một.']),
  ],
  goiY: ['Injective = no collisions; surjective = no leftovers in the codomain.', 'Always state the domain and codomain before judging.'],
  loiHayGap: ['Judging x² without noting which domain (ℤ vs ℕ vs ℝ≥0) is used.', 'Mixing up the range with the codomain.'],
  thuatNgu: [tn('injective', 'đơn ánh'), tn('surjective', 'toàn ánh'), tn('bijective', 'song ánh'), tn('codomain', 'miền giá trị đích')],
  khaiNiem: ['functions'],
});

/* floor / ceiling */
const XS = [3.2, -3.2, 7.5, -0.5, 5, -2.0, 8.99];
const rnd = (x) => Math.floor(x + 0.5);
const E2 = tinh({
  tieuDe: 'Functions 2 — Floor, ceiling and rounding',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>⌊x⌋ is the greatest integer ≤ x; ⌈x⌉ is the least integer ≥ x; rounding is ⌊x + ½⌋. Careful with negative numbers: ⌊−3.2⌋ = −4.</p>', '<p>⌊x⌋ là số nguyên lớn nhất ≤ x; ⌈x⌉ là số nguyên nhỏ nhất ≥ x; làm tròn là ⌊x + ½⌋. Cẩn thận số âm: ⌊−3,2⌋ = −4.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Floor, ceiling, rounding', 'Sàn, trần, làm tròn'], [{ ma: 'x', ten: 'x' }, { ma: 'fl', ten: '⌊x⌋' }, { ma: 'ce', ten: '⌈x⌉' }, { ma: 'ro', ten: '⌊x + ½⌋' }],
    XS.map((x) => ({ o: { x: String(x) }, a: { fl: String(Math.floor(x)), ce: String(Math.ceil(x)), ro: String(rnd(x)) } })),
    [XS.map((x) => `x=${x}: ⌊x⌋=${Math.floor(x)}, ⌈x⌉=${Math.ceil(x)}, round=${rnd(x)}`).join('; ') + '.', XS.map((x) => `x=${x}: ⌊x⌋=${Math.floor(x)}, ⌈x⌉=${Math.ceil(x)}, làm tròn=${rnd(x)}`).join('; ') + '.'])],
  goiY: ['Place x on the number line; ⌊x⌋ is the integer to its left (or x itself).', '⌈x⌉ = −⌊−x⌋.'],
  loiHayGap: ['Truncating toward zero: ⌊−3.2⌋ is −4, not −3.', 'Believing ⌈x⌉ = ⌊x⌋ + 1 for every x (false when x is an integer).'],
  thuatNgu: [tn('floor', 'hàm sàn'), tn('ceiling', 'hàm trần')],
  khaiNiem: ['floor and ceiling'],
});

/* classify finite functions */
const FUNCS = [{ f: [2, 0, 1, 3], m: 4 }, { f: [0, 0, 1, 2], m: 4 }, { f: [1, 3, 2, 0], m: 4 }, { f: [0, 1, 2], m: 5 }, { f: [0, 1, 2, 0, 1], m: 3 }, { f: [3, 1, 2, 0, 1], m: 4 }];
const E3 = tinh({
  tieuDe: 'Functions 3 — Classify finite functions',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A function from {0,…,n−1} to {0,…,m−1} is given by the list [f(0), f(1), …]. Decide whether it is one-to-one, onto, and a bijection.</p>', '<p>Hàm từ {0,…,n−1} vào {0,…,m−1} cho bởi danh sách [f(0), f(1), …]. Quyết định nó có đơn ánh, toàn ánh, song ánh hay không.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['One-to-one / onto', 'Đơn ánh / toàn ánh'], [{ ma: 'g', ten: 'f and codomain size m' }, { ma: 'i', ten: 'One-to-one?', luaChon: ['Yes', 'No'] }, { ma: 's', ten: 'Onto?', luaChon: ['Yes', 'No'] }, { ma: 'b', ten: 'Bijection?', luaChon: ['Yes', 'No'] }],
    FUNCS.map((c) => { const p = S.funcProps(c.f, c.m); const yn = (b) => (b ? 'Yes' : 'No'); return { o: { g: `f = [${c.f.join(', ')}],  m = ${c.m}` }, a: { i: yn(p.injective), s: yn(p.surjective), b: yn(p.bijective) } }; }),
    [FUNCS.map((c) => { const p = S.funcProps(c.f, c.m); return `[${c.f.join(',')}] m=${c.m}: injective ${p.injective}, surjective ${p.surjective}`; }).join('; ') + '. Injective needs n ≤ m; surjective needs n ≥ m; a bijection needs n = m and no repeats.', FUNCS.map((c) => { const p = S.funcProps(c.f, c.m); return `[${c.f.join(',')}] m=${c.m}: đơn ánh ${p.injective}, toàn ánh ${p.surjective}`; }).join('; ') + '.'])],
  goiY: ['Look for a repeated value (not one-to-one) and a missing value in 0…m−1 (not onto).', 'Compare n (list length) with m first — it rules out whole cases.'],
  loiHayGap: ['Calling a function a bijection although the list is shorter than m (not onto).', 'Judging onto-ness against the range instead of the stated codomain.'],
  thuatNgu: [tn('bijection', 'song ánh')],
  khaiNiem: ['injective', 'surjective'],
});

/* counting functions */
const C1 = S.numFunctions(4, 3), C2 = S.numInjective(3, 6), C3 = S.numSurjective(5, 3), C4 = S.numSurjective(4, 4);
assert.equal(C3, 150); assert.equal(C4, 24);
const E4 = tinh({
  tieuDe: 'Functions 4 — How many functions of each kind?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Counting functions between finite sets: all functions mⁿ-style, one-to-one (falling factorial), onto (inclusion–exclusion) and bijections (n!).</p>', '<p>Đếm hàm giữa các tập hữu hạn: mọi hàm (luỹ thừa), đơn ánh (chỉnh hợp), toàn ánh (bao hàm–loại trừ) và song ánh (n!).</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['How many functions are there from a 4-element set to a 3-element set?', 'Có bao nhiêu hàm từ tập 4 phần tử vào tập 3 phần tử?'], C1, [4 ** 3, 4 * 3, 3 * 4 * 2], f2, ['Each of the 4 inputs has 3 choices: 3⁴ = 81.', 'Mỗi trong 4 đầu vào có 3 lựa chọn: 3⁴ = 81.']),
    mcNum('c2', ['How many one-to-one functions are there from a 3-element set to a 6-element set?', 'Có bao nhiêu đơn ánh từ tập 3 phần tử vào tập 6 phần tử?'], C2, [6 ** 3, 3 ** 6, 6 * 3], f2, ['6·5·4 = 120: each input takes a still-unused output.', '6·5·4 = 120: mỗi đầu vào lấy một đầu ra chưa dùng.']),
    mcNum('c3', ['How many bijections are there from a 5-element set onto itself?', 'Có bao nhiêu song ánh từ tập 5 phần tử lên chính nó?'], 120, [25, 5 * 4, 5 ** 5], f2, ['5! = 120.', '5! = 120.']),
    mcNum('c4', ['How many onto functions are there from a 5-element set to a 3-element set?', 'Có bao nhiêu toàn ánh từ tập 5 phần tử lên tập 3 phần tử?'], C3, [3 ** 5, 3 ** 5 - 3 * 2 ** 5, 3 ** 5 - 3 * 2 ** 5 + 1], f2, ['3⁵ − 3·2⁵ + 3·1⁵ = 243 − 96 + 3 = 150.', '3⁵ − 3·2⁵ + 3·1⁵ = 150.']),
    mcNum('c5', ['How many one-to-one functions exist from a 7-element set to a 5-element set?', 'Có bao nhiêu đơn ánh từ tập 7 phần tử vào tập 5 phần tử?'], 0, [5 ** 7, 7 * 6 * 5, 120], f2, ['Pigeonhole: 7 inputs cannot fit 5 distinct outputs, so there are none.', 'Chuồng bồ câu: 7 đầu vào không thể có 5 đầu ra phân biệt nên không có đơn ánh.']),
    mcNum('c6', ['How many functions from {1,2,3} to {a,b} are NOT onto?', 'Có bao nhiêu hàm từ {1,2,3} vào {a,b} KHÔNG toàn ánh?'], 2, [6, 8, 4], f2, ['All 2³ = 8 functions minus the 6 onto ones = 2 constant functions.', 'Tất cả 2³ = 8 hàm trừ 6 toàn ánh = 2 hàm hằng.']),
  ],
  goiY: ['For one-to-one: choose images one input at a time, decreasing the number of free outputs.', 'Onto counts use inclusion–exclusion on the missed outputs.'],
  loiHayGap: ['Using m·n instead of mⁿ.', 'Forgetting that no one-to-one function exists when |A| > |B|.'],
  thuatNgu: [tn('falling factorial', 'giai thừa giảm'), tn('pigeonhole principle', 'nguyên lý chuồng bồ câu')],
  khaiNiem: ['counting functions'],
});

/* composition & inverse */
const COMP = [{ f: [1, 2, 0, 3], g: [2, 3, 1, 0] }, { f: [3, 0, 1, 2], g: [1, 0, 3, 2] }, { f: [0, 2, 1, 3], g: [3, 2, 1, 0] }];
const invOf = (f) => { const r = []; f.forEach((y, x) => { r[y] = x; }); return r; };
const E5 = tinh({
  tieuDe: 'Functions 5 — Composition and inverses',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Functions on {0,1,2,3} are given as lists [f(0), f(1), f(2), f(3)]. (g∘f)(x) = g(f(x)) — apply f first. Write results as comma-separated lists, e.g. <code>2,0,1,3</code>.</p>', '<p>Hàm trên {0,1,2,3} cho bởi danh sách [f(0), f(1), f(2), f(3)]. (g∘f)(x) = g(f(x)) — áp f trước. Viết kết quả dạng danh sách cách nhau bởi dấu phẩy, ví dụ <code>2,0,1,3</code>.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Composition and inverse', 'Hàm hợp và hàm ngược'], [{ ma: 'fg', ten: 'f and g' }, { ma: 'gf', ten: 'g∘f' }, { ma: 'fg2', ten: 'f∘g' }, { ma: 'inv', ten: 'f⁻¹' }],
    COMP.map((c) => ({ o: { fg: `f = [${c.f}],  g = [${c.g}]` }, a: { gf: listAns(S.compose(c.g, c.f)), fg2: listAns(S.compose(c.f, c.g)), inv: listAns(invOf(c.f)) } })),
    [COMP.map((c) => `f=[${c.f}], g=[${c.g}]: g∘f=[${S.compose(c.g, c.f)}], f∘g=[${S.compose(c.f, c.g)}], f⁻¹=[${invOf(c.f)}]`).join('; ') + '. Composition is not commutative in general; f⁻¹(y) is the x with f(x) = y.', COMP.map((c) => `f=[${c.f}], g=[${c.g}]: g∘f=[${S.compose(c.g, c.f)}], f∘g=[${S.compose(c.f, c.g)}], f⁻¹=[${invOf(c.f)}]`).join('; ') + '.'])],
  goiY: ['(g∘f)[x] = g[f[x]]: use f’s answer as an index into g.', 'To invert, for every x put x at position f[x] of the new list.'],
  loiHayGap: ['Applying g first (computing f∘g when g∘f is asked).', 'Inverting by reversing the list instead of swapping inputs and outputs.'],
  thuatNgu: [tn('composition', 'hàm hợp'), tn('inverse function', 'hàm ngược')],
  khaiNiem: ['composition', 'inverse'],
});

/* sequences & summations */
const SEQ = [
  { t: 'a_n = 5 + 3n (n ≥ 0)', a: (n) => 5 + 3 * n, desc: 'arithmetic' },
  { t: 'a_n = 2·3ⁿ (n ≥ 0)', a: (n) => 2 * 3 ** n, desc: 'geometric' },
  { t: 'a_n = n² + 1 (n ≥ 1)', a: (n) => n * n + 1, desc: 'quadratic' },
  { t: 'a_n = (−1)ⁿ·n (n ≥ 1)', a: (n) => (n % 2 ? -n : n), desc: 'alternating' },
];
const sumTo = (a, lo, hi) => { let s = 0; for (let i = lo; i <= hi; i++) s += a(i); return s; };
const E6 = tinh({
  tieuDe: 'Functions 6 — Sequences and summations',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each sequence compute the requested term and the sum of the first terms. Use the closed forms: arithmetic Σ = n(2a + (n−1)d)/2, geometric Σ = a(rⁿ − 1)/(r − 1).</p>', '<p>Với mỗi dãy tính số hạng yêu cầu và tổng các số hạng đầu. Dùng công thức đóng: cấp số cộng Σ = n(2a + (n−1)d)/2, cấp số nhân Σ = a(rⁿ − 1)/(r − 1).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Terms and sums', 'Số hạng và tổng'], [{ ma: 's', ten: 'Sequence' }, { ma: 't', ten: 'a₈' }, { ma: 'sum', ten: 'Sum of a₁ … a₈' }],
    SEQ.map((s) => ({ o: { s: s.t }, a: { t: String(s.a(8)), sum: String(sumTo(s.a, 1, 8)) } })),
    [SEQ.map((s) => `${s.t}: a₈ = ${s.a(8)}, Σ₁⁸ = ${sumTo(s.a, 1, 8)}`).join('; ') + '.', SEQ.map((s) => `${s.t}: a₈ = ${s.a(8)}, Σ₁⁸ = ${sumTo(s.a, 1, 8)}`).join('; ') + '.'])],
  goiY: ['Check the starting index of the sequence before substituting n = 8.', 'Write out the 8 terms when no closed form is at hand — it is only 8 additions.'],
  loiHayGap: ['Starting the sum at a₀ when the sequence starts at n = 1.', 'Using the arithmetic-sum formula on a geometric sequence.'],
  thuatNgu: [tn('arithmetic progression', 'cấp số cộng'), tn('geometric progression', 'cấp số nhân')],
  khaiNiem: ['sequences', 'summations'],
});

/* code: functionType */
function functionType(f, m) {
  var seen = {}, injective = true, i;
  for (i = 0; i < f.length; i++) { if (seen[f[i]]) injective = false; seen[f[i]] = true; }
  var surjective = true;
  for (i = 0; i < m; i++) if (!seen[i]) surjective = false;
  return { injective: injective, surjective: surjective, bijective: injective && surjective };
}
const E7 = jsDe({
  tieuDe: 'Functions 7 — Classify a function in code',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>A function from {0, …, n−1} to {0, …, m−1} is the array <code>f</code> with <code>f[x]</code> = f(x). Write <code>functionType(f, m)</code> returning <code>{ injective, surjective, bijective }</code> (three booleans). Remember that onto-ness is measured against the full codomain {0, …, m−1}, which may be larger than the set of values that appear.</p>', '<p>Hàm từ {0, …, n−1} vào {0, …, m−1} là mảng <code>f</code> với <code>f[x]</code> = f(x). Viết <code>functionType(f, m)</code> trả <code>{ injective, surjective, bijective }</code> (ba boolean). Nhớ rằng toàn ánh đo theo toàn bộ đích {0, …, m−1}, có thể lớn hơn tập giá trị xuất hiện.</p>'),
  yeuCau: [bi('Use a lookup object or array of seen values.', 'Dùng đối tượng hoặc mảng đánh dấu giá trị đã gặp.')],
  viDu: [{ input: 'functionType([2,0,1,3], 4)', output: JSON.stringify(functionType([2, 0, 1, 3], 4)), explanation: 'A permutation: bijective.|||Một hoán vị: song ánh.' }, { input: 'functionType([0,1,2], 5)', output: JSON.stringify(functionType([0, 1, 2], 5)), explanation: 'Distinct values (injective) but 3 and 4 are missed.|||Giá trị phân biệt (đơn ánh) nhưng 3 và 4 không được chạm tới.' }],
  goiY: ['Injective: no value appears twice; surjective: every value 0…m−1 appears.', 'bijective = injective && surjective.'],
  loiHayGap: ['Checking surjectivity only against the values that appear.', 'Declaring bijective when f.length ≠ m.'],
  giaiThich: '<p>One pass with a “seen” table answers both questions: a repeat means not injective, a hole means not surjective.</p>',
  khaiNiem: ['injective', 'surjective'],
  fn: 'functionType',
  dau: 'function functionType(f, m) {\n  return { injective: false, surjective: false, bijective: false };\n}\n',
  giaiMa: dat(functionType, 'functionType'),
  ref: functionType,
  cases: [{ args: [[2, 0, 1, 3], 4] }, { args: [[0, 1, 2], 5] }, { args: [[0, 0, 1], 2] }, { args: [[1, 0, 1, 0, 2], 3], an: true }, { args: [[], 0], an: true }, { args: [[3, 1, 2, 0, 4], 5], an: true }],
});

/* code: inverse */
function inverseFunction(f) {
  var n = f.length, inv = [], i;
  for (i = 0; i < n; i++) inv.push(-1);
  for (i = 0; i < n; i++) {
    if (f[i] < 0 || f[i] >= n || inv[f[i]] !== -1) return null;
    inv[f[i]] = i;
  }
  return inv;
}
const E8 = jsDe({
  tieuDe: 'Functions 8 — Compose and invert',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>inverseFunction(f)</code>. The array <code>f</code> describes a function from {0, …, n−1} to {0, …, n−1} (the same set). If f is a bijection return its inverse as an array <code>g</code> with <code>g[f[x]] = x</code>; otherwise return <code>null</code>. A value outside 0…n−1 or a repeated value means f is not a bijection of this set.</p>', '<p>Viết <code>inverseFunction(f)</code>. Mảng <code>f</code> mô tả hàm từ {0, …, n−1} vào chính {0, …, n−1}. Nếu f là song ánh trả hàm ngược dạng mảng <code>g</code> với <code>g[f[x]] = x</code>; ngược lại trả <code>null</code>. Giá trị ngoài 0…n−1 hoặc bị lặp nghĩa là f không là song ánh của tập này.</p>'),
  yeuCau: [bi('Single pass is enough if you detect collisions as you fill.', 'Một lượt duyệt là đủ nếu phát hiện va chạm khi điền.')],
  viDu: [{ input: 'inverseFunction([1,2,0])', output: JSON.stringify(inverseFunction([1, 2, 0])), explanation: 'f(0)=1, f(1)=2, f(2)=0 ⇒ f⁻¹(1)=0, f⁻¹(2)=1, f⁻¹(0)=2.|||f(0)=1, f(1)=2, f(2)=0 ⇒ f⁻¹(1)=0, f⁻¹(2)=1, f⁻¹(0)=2.' }, { input: 'inverseFunction([0,0,1])', output: 'null', explanation: 'Value 0 repeats: not one-to-one.|||Giá trị 0 lặp: không đơn ánh.' }],
  goiY: ['Create g filled with a marker (−1) and set g[f[x]] = x; if the slot is already used, return null.', 'Also reject values that are negative or ≥ n.'],
  loiHayGap: ['Reversing the array instead of swapping index and value.', 'Not checking range, so f = [0, 5] produces an out-of-range write.'],
  giaiThich: '<p>An inverse exists only for bijections. Filling g[f[x]] = x succeeds exactly when every target is written once, which also proves surjectivity on a finite set of the same size.</p>',
  khaiNiem: ['inverse function', 'bijection'],
  fn: 'inverseFunction',
  dau: 'function inverseFunction(f) {\n  return null;\n}\n',
  giaiMa: dat(inverseFunction, 'inverseFunction'),
  ref: inverseFunction,
  cases: [{ args: [[1, 2, 0]] }, { args: [[0, 0, 1]] }, { args: [[0]] }, { args: [[3, 2, 1, 0]], an: true }, { args: [[0, 5]], an: true }, { args: [[2, 0, 1, 4, 3]], an: true }, { args: [[]], an: true }],
});
void ord; void dec;

export default doiDau({
  slug: 'mad101-2-2-ham-day',
  ten: '2.2 Functions & sequences',
  khoa: KHOA,
  baiHoc: 'mad101-2-2-ham-day',
  de: [E1, E2, E3, E4, E5, E6, E7, E8],
});
