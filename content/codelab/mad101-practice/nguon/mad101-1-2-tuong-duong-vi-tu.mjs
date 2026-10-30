/** MAD101 · 1.2 — Logical equivalences, predicates & quantifiers, rules of inference. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, hai, giai, show, V, N, A, O, X, I, Q } from './_md.mjs';

const p = V('p'), qv = V('q'), r = V('r');

const E1 = tinh({
  tieuDe: 'Equivalence 1 — Name the law',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Match each transformation with the law of logic that justifies it.</p>', '<p>Ghép mỗi phép biến đổi với luật logic biện minh cho nó.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['¬(p ∧ q) ≡ ¬p ∨ ¬q is …', '¬(p ∧ q) ≡ ¬p ∨ ¬q là …'], ['De Morgan’s law', 'the distributive law', 'the absorption law', 'the double-negation law'], ['De Morgan: a negation flips ∧ into ∨ and negates each part.', 'De Morgan: phủ định đổi ∧ thành ∨ và phủ định từng phần.']),
    q('c2', ['p ∨ (p ∧ q) ≡ p is …', 'p ∨ (p ∧ q) ≡ p là …'], ['the absorption law', 'De Morgan’s law', 'the idempotent law', 'the commutative law'], ['The extra q is “absorbed”: if p is false, p ∧ q is false too.', 'q thừa bị “hấp thụ”: nếu p sai thì p ∧ q cũng sai.']),
    q('c3', ['p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) is …', 'p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) là …'], ['the distributive law', 'the associative law', 'the absorption law', 'De Morgan’s law'], ['∧ distributes over ∨, exactly like × over + in arithmetic.', '∧ phân phối trên ∨ giống × trên + trong số học.']),
    q('c4', ['¬∀x P(x) is equivalent to …', '¬∀x P(x) tương đương với …'], ['∃x ¬P(x)', '∀x ¬P(x)', '∃x P(x)', '¬∃x ¬P(x)'], ['A universal claim fails exactly when a counter-example exists.', 'Khẳng định phổ quát sai khi và chỉ khi có phản ví dụ.']),
    q('c5', ['p → q ≡ ¬p ∨ q is called …', 'p → q ≡ ¬p ∨ q được gọi là …'], ['the implication-as-disjunction equivalence', 'the contrapositive of the implication', 'the converse of the implication', 'the idempotent law for disjunction'], ['It lets us rewrite → inside a proof by chains of equivalences.', 'Nó cho phép viết lại → trong chứng minh bằng chuỗi tương đương.']),
    q('c6', ['¬¬p ≡ p is …', '¬¬p ≡ p là …'], ['the double-negation law', 'the identity law', 'the complement (negation) law', 'the domination law'], ['Two negations cancel.', 'Hai lần phủ định triệt tiêu nhau.']),
  ],
  goiY: ['De Morgan always changes the connective; distributive and associative laws do not.', 'Say each law aloud in words before matching.'],
  loiHayGap: ['Writing ¬(p ∧ q) ≡ ¬p ∧ ¬q (forgetting to flip the connective).', 'Mixing up absorption and idempotent laws.'],
  thuatNgu: [tn('De Morgan’s laws', 'luật De Morgan'), tn('absorption', 'hấp thụ'), tn('distributive', 'phân phối')],
  khaiNiem: ['equivalence laws'],
});

/* equivalent-or-not table */
const PAIRS = [
  [I(p, qv), O(N(p), qv)], [I(p, qv), I(qv, p)], [I(p, qv), I(N(qv), N(p))], [N(A(p, qv)), A(N(p), N(qv))],
  [N(O(p, qv)), A(N(p), N(qv))], [A(p, O(qv, r)), O(A(p, qv), A(p, r))], [O(p, A(qv, r)), A(O(p, qv), r)], [Q(p, qv), A(I(p, qv), I(qv, p))],
  [N(I(p, qv)), A(p, N(qv))], [X(p, qv), N(Q(p, qv))],
];
const E2 = tinh({
  tieuDe: 'Equivalence 2 — Are these two formulas equivalent?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each pair choose <b>Yes</b> if the two formulas have identical truth tables, otherwise <b>No</b>. A single differing row is enough to answer No.</p>', '<p>Với mỗi cặp chọn <b>Yes</b> nếu hai công thức có bảng chân trị giống hệt nhau, ngược lại chọn <b>No</b>. Chỉ cần một dòng khác nhau là trả lời No.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Equivalent pairs', 'Các cặp tương đương'], [{ ma: 'pair', ten: 'Pair' }, { ma: 'eq', ten: 'Equivalent?', luaChon: ['Yes', 'No'] }],
    PAIRS.map(([a, b]) => ({ o: { pair: `${show(a, true)}  vs  ${show(b, true)}` }, a: { eq: S.equiv(a, b) ? 'Yes' : 'No' } })),
    [PAIRS.map(([a, b]) => `${show(a, true)} vs ${show(b, true)}: ${S.equiv(a, b) ? 'equivalent' : 'NOT equivalent'}`).join('; ') + '.', PAIRS.map(([a, b]) => `${show(a, true)} vs ${show(b, true)}: ${S.equiv(a, b) ? 'tương đương' : 'KHÔNG tương đương'}`).join('; ') + '.'])],
  goiY: ['Look for the first row where the two sides differ; p = T, q = F is the most common culprit for implications.', 'The converse and the inverse of an implication are NOT equivalent to it.'],
  loiHayGap: ['Distributing ∨ over ∧ onto only one conjunct: p ∨ (q ∧ r) is NOT (p ∨ q) ∧ r — the law needs (p ∨ q) ∧ (p ∨ r).', 'Treating p → q and q → p as equivalent.'],
  thuatNgu: [tn('logically equivalent', 'tương đương logic')],
  khaiNiem: ['equivalence'],
});

/* predicates on finite domains */
const DOM = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const PREDS = [
  ['x² > 10', DOM(1, 6), (x) => x * x > 10], ['x is odd', DOM(1, 7), (x) => x % 2 === 1], ['x + 3 ≤ 9', DOM(0, 6), (x) => x + 3 <= 9],
  ['x mod 3 = 0', DOM(3, 9), (x) => x % 3 === 0], ['x² ≥ x', DOM(0, 5), (x) => x * x >= x], ['2x is a multiple of 4', DOM(1, 8), (x) => (2 * x) % 4 === 0],
];
const E3 = tinh({
  tieuDe: 'Equivalence 3 — Quantifiers over a finite domain',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>On a finite domain a quantifier is just a loop: ∀ is “every element passes”, ∃ is “some element passes”. For each predicate and domain decide ∀x P(x), ∃x P(x) and ∀x ¬P(x), and count the elements satisfying P.</p>', '<p>Trên miền hữu hạn, lượng từ chỉ là vòng lặp: ∀ là “mọi phần tử đều đạt”, ∃ là “có phần tử đạt”. Với mỗi vị từ và miền hãy xác định ∀x P(x), ∃x P(x), ∀x ¬P(x) và đếm số phần tử thoả P.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Quantifiers on finite domains', 'Lượng từ trên miền hữu hạn'], [{ ma: 'pd', ten: 'P(x) and domain' }, { ma: 'fa', ten: '∀x P(x)', luaChon: ['T', 'F'] }, { ma: 'ex', ten: '∃x P(x)', luaChon: ['T', 'F'] }, { ma: 'no', ten: '∀x ¬P(x)', luaChon: ['T', 'F'] }, { ma: 'n', ten: '#x with P(x)' }],
    PREDS.map(([t, d, f]) => ({ o: { pd: `P(x): ${t};  x ∈ {${d.join(', ')}}` }, a: { fa: S.forall(d, f) ? 'T' : 'F', ex: S.exists(d, f) ? 'T' : 'F', no: S.forall(d, (x) => !f(x)) ? 'T' : 'F', n: String(d.filter(f).length) } })),
    [PREDS.map(([t, d, f]) => `${t} on {${d.join(',')}}: ∀=${S.forall(d, f)}, ∃=${S.exists(d, f)}, ∀¬=${S.forall(d, (x) => !f(x))}, count ${d.filter(f).length}`).join('; ') + '.', PREDS.map(([t, d, f]) => `${t} trên {${d.join(',')}}: ∀=${S.forall(d, f)}, ∃=${S.exists(d, f)}, ∀¬=${S.forall(d, (x) => !f(x))}, đếm ${d.filter(f).length}`).join('; ') + '.'])],
  goiY: ['Evaluate P on every element first, then combine the results.', '∀x ¬P(x) is true only when the count is 0; ∃x P(x) is true when the count is at least 1.'],
  loiHayGap: ['Answering ∃ = F when only some elements pass (∃ needs just one).', 'Confusing ∀x ¬P(x) with ¬∀x P(x).'],
  thuatNgu: [tn('universal quantifier', 'lượng từ với mọi'), tn('existential quantifier', 'lượng từ tồn tại')],
  khaiNiem: ['quantifiers', 'finite domain'],
});

/* nested quantifier statements */
const dZ = DOM(-5, 5), dN = DOM(0, 5);
const nest1 = S.forall(dZ, (x) => S.exists(dZ, (y) => x + y === 0)), nest2 = S.forall(dN, (x) => S.exists(dN, (y) => x + y === 0));
const nest3 = S.exists(dZ, (y) => S.forall(dZ, (x) => x + y === 0)), nest4 = S.forall(dZ, (x) => S.exists(dZ, (y) => x * y === 1));
assert.ok(nest1 && !nest2 && !nest3 && !nest4);
const E4 = tinh({
  tieuDe: 'Equivalence 4 — Negations and nested quantifiers',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Negate quantified statements correctly and decide whether nested quantifier statements hold. Order of quantifiers matters!</p>', '<p>Phủ định đúng các mệnh đề có lượng từ và quyết định các mệnh đề lượng từ lồng nhau có đúng không. Thứ tự lượng từ rất quan trọng!</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The negation of ∀x ∃y (x + y = 0) is …', 'Phủ định của ∀x ∃y (x + y = 0) là …'], ['∃x ∀y (x + y ≠ 0)', '∀x ∃y (x + y ≠ 0)', '∃x ∃y (x + y ≠ 0)', '∀x ∀y (x + y ≠ 0)'], ['Push ¬ inward: each quantifier flips and the predicate is negated.', 'Đưa ¬ vào trong: mỗi lượng từ đổi dạng và vị từ bị phủ định.']),
    q('c2', ['Domain {−5,…,5}: ∀x ∃y (x + y = 0) is …', 'Miền {−5,…,5}: ∀x ∃y (x + y = 0) là …'], ['TRUE', 'FALSE', 'undefined on a finite domain', 'TRUE only for x = 0'], [`Every x has its opposite −x in the symmetric domain, so take y = −x (enumerating the domain gives ${nest1}).`, `Mỗi x có số đối −x trong miền đối xứng nên lấy y = −x (duyệt hết miền cho ${nest1}).`]),
    q('c3', ['Domain {0,…,5}: ∀x ∃y (x + y = 0) is …', 'Miền {0,…,5}: ∀x ∃y (x + y = 0) là …'], ['FALSE', 'TRUE', 'TRUE with y = −x', 'undefined'], [`Negative numbers are not in the domain, so only x = 0 has a partner; x = 1 has none (enumerating the domain gives ${nest2}).`, `Số âm không thuộc miền nên chỉ x = 0 có cặp; x = 1 không có (duyệt hết miền cho ${nest2}).`]),
    q('c4', ['Domain {−5,…,5}: ∃y ∀x (x + y = 0) is …', 'Miền {−5,…,5}: ∃y ∀x (x + y = 0) là …'], ['FALSE', 'TRUE (y = 0)', 'TRUE (y = −x)', 'TRUE for the empty domain only'], [`A single y would have to equal −x for every x at once (enumerating the domain gives ${nest3}).`, `Một y duy nhất phải bằng −x cho mọi x cùng lúc (duyệt hết miền cho ${nest3}).`]),
    q('c5', ['Swapping ∀x ∃y into ∃y ∀x …', 'Đổi ∀x ∃y thành ∃y ∀x …'], ['can change the truth value', 'never changes the truth value', 'is the same as negating', 'is only allowed with ∨'], ['∀x∃y lets y depend on x; ∃y∀x demands one y that works for all x.', '∀x∃y cho phép y phụ thuộc x; ∃y∀x đòi một y dùng cho mọi x.']),
    q('c6', ['Domain {−5,…,5}: ∀x ∃y (x·y = 1) is …', 'Miền {−5,…,5}: ∀x ∃y (x·y = 1) là …'], ['FALSE', 'TRUE', 'TRUE with y = 1/x', 'TRUE only for x = 1'], [`1/x is not an integer for most x, and x = 0 never works: x = 0 and x = 2 have no partner (enumerating the domain gives ${nest4}).`, `1/x không nguyên với đa số x, và x = 0 không bao giờ được: x = 0 và x = 2 không có cặp (duyệt hết miền cho ${nest4}).`]),
  ],
  goiY: ['Negation: flip every quantifier from left to right, then negate the predicate.', 'To test ∀x ∃y on a finite domain, for each x search a y.'],
  loiHayGap: ['Swapping quantifiers without changing the meaning (∀∃ and ∃∀ are different).', 'Negating only the predicate and keeping the quantifiers.'],
  thuatNgu: [tn('nested quantifiers', 'lượng từ lồng nhau'), tn('counter-example', 'phản ví dụ')],
  khaiNiem: ['negating quantifiers', 'quantifier order'],
});

/* equivalence proof ordering */
const step = (a, b) => assert.ok(S.equiv(a, b));
step(N(I(p, qv)), N(O(N(p), qv))); step(N(O(N(p), qv)), A(N(N(p)), N(qv))); step(A(N(N(p)), N(qv)), A(p, N(qv)));
const E5 = tinh({
  tieuDe: 'Equivalence 5 — Prove ¬(p → q) ≡ p ∧ ¬q by a chain of laws',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Arrange the lines of the standard proof. Each line is equivalent to the previous one; the justification is shown at the end of the line.</p>', '<p>Sắp các dòng của chứng minh chuẩn. Mỗi dòng tương đương dòng trước; lý do ghi ở cuối dòng.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Order the proof of ¬(p → q) ≡ p ∧ ¬q.', 'Sắp chứng minh ¬(p → q) ≡ p ∧ ¬q.'], ['¬(p → q)  — start', '≡ ¬(¬p ∨ q)  — implication as disjunction', '≡ ¬¬p ∧ ¬q  — De Morgan', '≡ p ∧ ¬q  — double negation'], ['Each step uses exactly one law and the whole chain was verified with the truth-table checker.', 'Mỗi bước dùng đúng một luật và toàn chuỗi đã kiểm bằng bảng chân trị.'], 1),
    ord('q2', ['Order the proof of (p ∧ q) → p being a tautology.', 'Sắp chứng minh (p ∧ q) → p là hằng đúng.'], ['(p ∧ q) → p  — start', '≡ ¬(p ∧ q) ∨ p  — implication as disjunction', '≡ (¬p ∨ ¬q) ∨ p  — De Morgan', '≡ (¬p ∨ p) ∨ ¬q  — commutative / associative', '≡ T ∨ ¬q ≡ T  — negation and domination'], ['The disjunction contains p and ¬p, so it is always true.', 'Tuyển chứa cả p và ¬p nên luôn đúng.'], 3),
  ],
  goiY: ['Start by removing → using ¬p ∨ q.', 'Push the negation inward with De Morgan before cancelling double negations.'],
  loiHayGap: ['Applying De Morgan before removing the implication.', 'Forgetting the double negation ¬¬p.'],
  thuatNgu: [tn('chain of equivalences', 'chuỗi tương đương')],
  khaiNiem: ['proof by equivalences'],
});
assert.equal(S.classify(I(A(p, qv), p)), 'tautology');

/* inference rules */
const ARGS = [
  ['p → q,  p  ⊢  q', [I(p, qv), p], qv, 'Modus ponens'], ['p → q,  ¬q  ⊢  ¬p', [I(p, qv), N(qv)], N(p), 'Modus tollens'],
  ['p → q,  q  ⊢  p', [I(p, qv), qv], p, 'Affirming the conclusion (fallacy)'], ['p → q,  ¬p  ⊢  ¬q', [I(p, qv), N(p)], N(qv), 'Denying the hypothesis (fallacy)'],
  ['p → q,  q → r  ⊢  p → r', [I(p, qv), I(qv, r)], I(p, r), 'Hypothetical syllogism'], ['p ∨ q,  ¬p  ⊢  q', [O(p, qv), N(p)], qv, 'Disjunctive syllogism'],
  ['p ∧ q  ⊢  p', [A(p, qv)], p, 'Simplification'], ['p  ⊢  p ∨ q', [p], O(p, qv), 'Addition'],
  ['p ∨ q,  ¬p ∨ r  ⊢  q ∨ r', [O(p, qv), O(N(p), r)], O(qv, r), 'Resolution'],
];
const NAMES = ['Modus ponens', 'Modus tollens', 'Hypothetical syllogism', 'Disjunctive syllogism', 'Simplification', 'Addition', 'Resolution', 'Affirming the conclusion (fallacy)', 'Denying the hypothesis (fallacy)'];
const E6 = tinh({
  tieuDe: 'Equivalence 6 — Rules of inference: valid or fallacy?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each argument form decide whether it is <b>Valid</b> (the conclusion is true whenever all premises are) or <b>Invalid</b>, and name the form.</p>', '<p>Với mỗi dạng suy luận hãy quyết định nó <b>Valid</b> (kết luận đúng mỗi khi mọi tiền đề đúng) hay <b>Invalid</b>, và gọi tên dạng đó.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Argument forms', 'Các dạng suy luận'], [{ ma: 'arg', ten: 'Premises ⊢ conclusion' }, { ma: 'v', ten: 'Valid?', luaChon: ['Valid', 'Invalid'] }, { ma: 'n', ten: 'Name', luaChon: NAMES }],
    ARGS.map(([t, pr, c, nm]) => ({ o: { arg: t }, a: { v: S.entails(pr, c) ? 'Valid' : 'Invalid', n: nm } })),
    [ARGS.map(([t, pr, c, nm]) => `${t}: ${S.entails(pr, c) ? 'valid' : 'INVALID'} (${nm})`).join('; ') + '.', ARGS.map(([t, pr, c, nm]) => `${t}: ${S.entails(pr, c) ? 'hợp lệ' : 'KHÔNG hợp lệ'} (${nm})`).join('; ') + '.'])],
  goiY: ['A form is invalid if one row makes every premise true and the conclusion false — find that row.', 'Modus ponens/tollens are valid; the “converse-shaped” versions are the classic fallacies.'],
  loiHayGap: ['Accepting “p → q, q ⊢ p” (affirming the conclusion).', 'Accepting “p → q, ¬p ⊢ ¬q”.'],
  thuatNgu: [tn('argument form', 'dạng suy luận'), tn('fallacy', 'nguỵ biện'), tn('valid argument', 'suy luận hợp lệ')],
  khaiNiem: ['rules of inference', 'fallacies'],
});

/* code: equivalent(f,g) */
function equivalent(f, g) {
  var names = {};
  function collect(x) { if (x[0] === 'var') names[x[1]] = 1; else for (var i = 1; i < x.length; i++) if (Array.isArray(x[i])) collect(x[i]); }
  collect(f); collect(g);
  var vs = Object.keys(names), n = vs.length;
  function ev(h, env) {
    switch (h[0]) {
      case 'var': return !!env[h[1]];
      case 'T': return true;
      case 'F': return false;
      case 'not': return !ev(h[1], env);
      case 'and': return ev(h[1], env) && ev(h[2], env);
      case 'or': return ev(h[1], env) || ev(h[2], env);
      case 'xor': return ev(h[1], env) !== ev(h[2], env);
      case 'imp': return !ev(h[1], env) || ev(h[2], env);
      default: return ev(h[1], env) === ev(h[2], env);
    }
  }
  for (var m = 0; m < (1 << n); m++) {
    var env = {};
    for (var i = 0; i < n; i++) env[vs[i]] = ((m >> i) & 1) === 1;
    if (ev(f, env) !== ev(g, env)) return false;
  }
  return true;
}
const E7 = jsDe({
  tieuDe: 'Equivalence 7 — Decide logical equivalence in code',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Using the nested-array formula format of the previous lesson, write <code>equivalent(f, g)</code> that returns <code>true</code> when the two formulas have the same truth value under every assignment of <em>all</em> the variables that occur in either formula, and <code>false</code> otherwise. The formulas may mention different variables (for example <code>p</code> and <code>p ∨ (q ∧ ¬q)</code>).</p>', '<p>Dùng định dạng công thức mảng lồng như bài trước, viết <code>equivalent(f, g)</code> trả <code>true</code> khi hai công thức có cùng giá trị với mọi bộ gán của <em>tất cả</em> các biến xuất hiện trong một trong hai công thức, ngược lại <code>false</code>. Hai công thức có thể chứa các biến khác nhau (ví dụ <code>p</code> và <code>p ∨ (q ∧ ¬q)</code>).</p>'),
  yeuCau: [bi('Collect the variables of BOTH formulas before looping over assignments.', 'Thu biến của CẢ HAI công thức trước khi duyệt các bộ gán.')],
  viDu: [{ input: 'equivalent(["imp",["var","p"],["var","q"]], ["or",["not",["var","p"]],["var","q"]])', output: 'true', explanation: 'p → q ≡ ¬p ∨ q.|||p → q ≡ ¬p ∨ q.' }, { input: 'equivalent(["imp",["var","p"],["var","q"]], ["imp",["var","q"],["var","p"]])', output: 'false', explanation: 'Converse: differs at p = T, q = F.|||Mệnh đề đảo: khác ở p = T, q = F.' }],
  goiY: ['Union of the variable sets, then 2ⁿ assignments with a bit mask.', 'Return false at the first assignment where the two values differ; return true after the loop.'],
  loiHayGap: ['Looping only over the variables of f (g may contain extra variables).', 'Comparing the formulas as JSON strings instead of their truth values.'],
  giaiThich: '<p>Two formulas are equivalent when their truth tables coincide on all rows. The extra variables must be included so that “p” and “p ∨ (q ∧ ¬q)” are compared on all four rows.</p>',
  khaiNiem: ['truth-table method', 'logical equivalence'],
  fn: 'equivalent',
  dau: 'function equivalent(f, g) {\n  return false;\n}\n',
  giaiMa: dat(equivalent, 'equivalent'),
  ref: equivalent,
  cases: [
    { args: [I(p, qv), O(N(p), qv)] }, { args: [I(p, qv), I(qv, p)] }, { args: [N(A(p, qv)), O(N(p), N(qv))] },
    { args: [p, O(p, A(qv, N(qv)))] }, { args: [A(p, O(qv, r)), O(A(p, qv), A(p, r))], an: true },
    { args: [N(O(p, qv)), O(N(p), N(qv))], an: true }, { args: [X(p, qv), N(Q(p, qv))], an: true }, { args: [['T'], O(p, N(p))], an: true },
  ],
});

export default doiDau({
  slug: 'mad101-1-2-tuong-duong-vi-tu',
  ten: '1.2 Equivalences, predicates & inference',
  khoa: KHOA,
  baiHoc: 'mad101-1-2-tuong-duong-vi-tu',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void hai; void giai; void Q;
