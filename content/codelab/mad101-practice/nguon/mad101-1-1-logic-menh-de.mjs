/** MAD101 · 1.1 — Propositional logic: connectives, truth tables, evaluation, classification. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, truthBang, show, V, N, A, O, X, I, Q } from './_md.mjs';

const p = V('p'), qv = V('q'), r = V('r');

/* ───── 1 · concepts ───── */
const L1 = tinh({
  tieuDe: 'Logic 1 — Propositions and connectives',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Six concept questions on propositions, negation, implication and the other connectives of Rosen §1.1.</p>', '<p>Sáu câu khái niệm về mệnh đề, phủ định, kéo theo và các toán tử khác (Rosen §1.1).</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Which of the following is a proposition?', 'Câu nào sau đây là một mệnh đề?'], ['“17 is a prime number.”', '“x + 3 = 5.”', '“Please close the door.”', '“What time is it?”'], ['A proposition is a declarative sentence that is exactly true or false. “x + 3 = 5” depends on x, so it is a predicate, not a proposition.', 'Mệnh đề là câu khẳng định đúng hoặc sai. “x + 3 = 5” phụ thuộc x nên là vị từ.']),
    q('c2', ['The negation of “7 > 3” is …', 'Phủ định của “7 > 3” là …'], ['7 ≤ 3', '7 < 3', '3 > 7', '7 = 3'], ['¬(a > b) means a ≤ b — “not greater” includes equality.', '¬(a > b) nghĩa là a ≤ b — “không lớn hơn” gồm cả bằng.']),
    q('c3', ['p → q is FALSE exactly when …', 'p → q chỉ SAI khi …'], ['p is true and q is false', 'p is false and q is true', 'p and q are both false', 'p and q are both true'], ['A promise is broken only if the condition happens and the result does not.', 'Lời hứa chỉ bị phá khi điều kiện xảy ra mà kết quả không xảy ra.']),
    q('c4', ['The converse of p → q is …', 'Mệnh đề đảo của p → q là …'], ['q → p', '¬q → ¬p', '¬p → ¬q', 'p → ¬q'], ['Converse swaps the two sides; contrapositive swaps and negates; inverse negates both.', 'Đảo hoán đổi hai vế; phản đảo hoán đổi và phủ định; nghịch phủ định cả hai vế.']),
    q('c5', ['p ↔ q is TRUE exactly when …', 'p ↔ q chỉ ĐÚNG khi …'], ['p and q have the same truth value', 'p and q are both true', 'exactly one of p, q is true', 'p → q is true'], ['p ↔ q ≡ (p → q) ∧ (q → p): both directions hold, so the values agree.', 'p ↔ q ≡ (p → q) ∧ (q → p): hai chiều đều đúng nên giá trị trùng nhau.']),
    q('c6', ['The exclusive or p ⊕ q is true when …', 'Hoặc loại trừ p ⊕ q đúng khi …'], ['exactly one of p, q is true', 'at least one of p, q is true', 'both are true', 'both are false'], ['⊕ differs from ∨ only in the row where both are true: there ∨ is true and ⊕ is false.', '⊕ khác ∨ chỉ ở dòng cả hai cùng đúng: ∨ đúng còn ⊕ sai.']),
  ],
  goiY: ['A proposition has a definite truth value — no free variable, no question, no command.', 'Write the truth table of each connective in your head; only → and ↔ surprise people.'],
  loiHayGap: ['Treating “x + 3 = 5” as a proposition although x is free.', 'Believing p → q is false when p is false (a false hypothesis makes the implication vacuously true).', 'Negating “>” as “<” instead of “≤”.'],
  thuatNgu: [tn('proposition', 'mệnh đề'), tn('conjunction', 'hội (∧)'), tn('disjunction', 'tuyển (∨)'), tn('implication', 'kéo theo (→)'), tn('converse', 'mệnh đề đảo')],
  khaiNiem: ['proposition', 'connectives', 'implication'],
});

/* ───── 2 · basic truth table ───── */
const F2 = [A(p, qv), O(p, qv), I(p, qv), Q(p, qv), X(p, qv)];
const L2 = tinh({
  tieuDe: 'Logic 2 — Fill the truth tables of the five connectives',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>For each assignment of <b>p</b> and <b>q</b>, give the truth value of the five formulas. Use the drop-down in every cell (T = true, F = false). Rows are ordered TT, TF, FT, FF.</p>', '<p>Với mỗi bộ giá trị của <b>p</b> và <b>q</b>, cho giá trị chân trị của năm công thức. Chọn trong ô thả xuống (T = đúng, F = sai). Các dòng theo thứ tự TT, TF, FT, FF.</p>'),
  loai: 'table',
  bang: [truthBang('b1', ['The five basic connectives', 'Năm toán tử cơ bản'], ['p', 'q'], F2, ['Columns (TT,TF,FT,FF): ' + F2.map((f) => `${show(f, true)} = ${S.column(f).join(' ')}`).join('; ') + '.', 'Cột (TT,TF,FT,FF): ' + F2.map((f) => `${show(f, true)} = ${S.column(f).join(' ')}`).join('; ') + '.'])],
  goiY: ['Do one column at a time instead of one row at a time.', 'p → q is false only in the row p = T, q = F; p ⊕ q is the negation of p ↔ q.'],
  loiHayGap: ['Filling p → q with the pattern of q → p (swapping the two middle rows).', 'Marking p ⊕ q true in the TT row.'],
  thuatNgu: [tn('truth table', 'bảng chân trị')],
  khaiNiem: ['truth tables'],
});

/* ───── 3 · three variables ───── */
const G1 = O(N(p), A(qv, r)), G2 = I(O(p, qv), r), G3 = Q(N(p), X(qv, r));
const L3 = tinh({
  tieuDe: 'Logic 3 — Truth tables with three variables',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Complete the 8-row truth tables below. Rows go from TTT down to FFF (T first). Compute inner sub-formulas first; the brackets matter.</p>', '<p>Hoàn thành các bảng chân trị 8 dòng bên dưới. Dòng đi từ TTT đến FFF (T trước). Tính biểu thức con bên trong trước; dấu ngoặc rất quan trọng.</p>'),
  loai: 'table',
  bang: [
    truthBang('b1', [`Table for ${show(G1, true)}`, `Bảng cho ${show(G1, true)}`], ['p', 'q', 'r'], [G1], [`Column: ${S.column(G1).join(' ')}.`, `Cột: ${S.column(G1).join(' ')}.`]),
    truthBang('b2', [`Table for ${show(G2, true)} and ${show(G3, true)}`, `Bảng cho ${show(G2, true)} và ${show(G3, true)}`], ['p', 'q', 'r'], [G2, G3], [`${show(G2, true)}: ${S.column(G2).join(' ')}; ${show(G3, true)}: ${S.column(G3).join(' ')}.`, `${show(G2, true)}: ${S.column(G2).join(' ')}; ${show(G3, true)}: ${S.column(G3).join(' ')}.`]),
  ],
  goiY: ['Add helper columns on paper for the bracketed parts before the final connective.', 'An implication whose hypothesis is false is true — scan for those rows first.'],
  loiHayGap: ['Ignoring the brackets and reading ¬p ∨ q ∧ r as (¬p ∨ q) ∧ r.', 'Evaluating p ∨ q → r as p ∨ (q → r).'],
  thuatNgu: [tn('sub-formula', 'công thức con')],
  khaiNiem: ['truth tables', 'precedence'],
});

/* ───── 4 · translation & conditional forms ───── */
assert.ok(S.equiv(I(p, qv), I(N(qv), N(p))));
assert.ok(!S.equiv(I(p, qv), I(qv, p)) && !S.equiv(I(p, qv), I(N(p), N(qv))));
assert.ok(S.equiv(I(N(qv), p), O(qv, p)));
assert.ok(S.equiv(Q(p, qv), A(I(p, qv), I(qv, p))));
const L4 = tinh({
  tieuDe: 'Logic 4 — Translating English: only if, unless, necessary, sufficient',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Natural-language conditionals are the main source of lost marks. Each question gives a sentence; pick the correct logical form.</p>', '<p>Câu điều kiện trong ngôn ngữ tự nhiên là nguồn mất điểm chính. Mỗi câu cho một câu văn, hãy chọn dạng logic đúng.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['“You pass the course only if you attend the exam.” (p = pass, q = attend)', '“Bạn qua môn chỉ nếu bạn dự thi.” (p = qua môn, q = dự thi)'], ['p → q', 'q → p', 'p ↔ q', '¬p → ¬q'], ['“p only if q” means q is required for p: p → q.', '“p chỉ nếu q” nghĩa là q là điều kiện cần của p: p → q.']),
    q('c2', ['“The server restarts unless the disk is full.” (p = restarts, q = disk full)', '“Máy chủ khởi động lại trừ khi đĩa đầy.” (p = khởi động lại, q = đĩa đầy)'], ['¬q → p, equivalent to p ∨ q', 'q → p', 'p → ¬q only', 'p ∧ ¬q'], ['“p unless q” = if not q then p = ¬q → p ≡ q ∨ p.', '“p trừ khi q” = nếu không q thì p = ¬q → p ≡ q ∨ p.']),
    q('c3', ['Which statement is equivalent to “If n is even then n² is even”?', 'Câu nào tương đương với “Nếu n chẵn thì n² chẵn”?'], ['If n² is odd then n is odd.', 'If n² is even then n is even.', 'If n is odd then n² is odd.', 'n is even and n² is odd.'], ['Only the contrapositive ¬q → ¬p is always equivalent. The converse and the inverse are not.', 'Chỉ mệnh đề phản đảo ¬q → ¬p luôn tương đương; đảo và nghịch thì không.']),
    q('c4', ['“Being a prime greater than 2 is sufficient for being odd.” (p = prime > 2, q = odd)', '“Là số nguyên tố lớn hơn 2 là đủ để là số lẻ.”'], ['p → q', 'q → p', 'p ↔ q', 'p ∧ q'], ['Sufficient: the hypothesis suffices for the conclusion, so p → q.', 'Điều kiện đủ: giả thiết đủ để có kết luận, nên p → q.']),
    q('c5', ['“A positive integer is even only if its square is even … and conversely.” translates to', '“Số nguyên dương chẵn khi và chỉ khi bình phương của nó chẵn” dịch là'], ['p ↔ q', 'p → q only', 'p ∧ q', 'p ⊕ q'], ['“if and only if” is the biconditional: both implications.', '“khi và chỉ khi” là tương đương: cả hai chiều.']),
    q('c6', ['Which of the following is NOT equivalent to p → q?', 'Công thức nào KHÔNG tương đương với p → q?'], ['q → p', '¬q → ¬p', '¬p ∨ q', '¬(p ∧ ¬q)'], ['q → p is the converse. The other three are equivalent forms of p → q.', 'q → p là mệnh đề đảo. Ba công thức còn lại là các dạng tương đương của p → q.']),
  ],
  goiY: ['“p only if q” and “q is necessary for p” both give p → q; “p is sufficient for q” also gives p → q.', 'Test a candidate with the one dangerous row: p true, q false.'],
  loiHayGap: ['Writing “p only if q” as q → p.', 'Thinking the converse is equivalent to the original implication.', 'Reading “unless” as a biconditional.'],
  thuatNgu: [tn('necessary condition', 'điều kiện cần'), tn('sufficient condition', 'điều kiện đủ'), tn('contrapositive', 'phản đảo'), tn('inverse', 'nghịch đảo (phủ định hai vế)')],
  khaiNiem: ['conditional statements', 'translation'],
});

/* ───── 5 · evaluation order ───── */
const envA = { p: true, q: false, r: false }, envB = { p: false, q: true, r: true };
const fA = I(A(p, N(qv)), O(r, qv)), fB = O(N(A(p, r)), I(qv, r));
const tv = (f, env) => (S.evalF(f, env) ? 'T' : 'F');
const L5 = tinh({
  tieuDe: 'Logic 5 — Evaluate a formula in the right order',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Put the evaluation steps in the order a careful student follows: innermost parts first, the main connective last. Values are for the stated assignment.</p>', '<p>Sắp các bước tính theo thứ tự một học sinh cẩn thận làm: phần trong cùng trước, toán tử chính sau cùng. Giá trị theo bộ gán đã nêu.</p>'),
  loai: 'order',
  cauHoi: [
    ord('q1', [`Evaluate ${show(fA, true)} for p = T, q = F, r = F.`, `Tính ${show(fA, true)} khi p = T, q = F, r = F.`], [`¬q = ${tv(N(qv), envA)}`, `p ∧ ¬q = ${tv(A(p, N(qv)), envA)}`, `r ∨ q = ${tv(O(r, qv), envA)}`, `${tv(A(p, N(qv)), envA)} → ${tv(O(r, qv), envA)} = ${tv(fA, envA)}`], ['Negation first, then the two bracketed parts, then the main →.', 'Phủ định trước, rồi hai vế trong ngoặc, cuối cùng là → chính.'], 1),
    ord('q2', [`Evaluate ${show(fB, true)} for p = F, q = T, r = T.`, `Tính ${show(fB, true)} khi p = F, q = T, r = T.`], [`p ∧ r = ${tv(A(p, r), envB)}`, `¬(p ∧ r) = ${tv(N(A(p, r)), envB)}`, `q → r = ${tv(I(qv, r), envB)}`, `${tv(N(A(p, r)), envB)} ∨ ${tv(I(qv, r), envB)} = ${tv(fB, envB)}`], ['Innermost p ∧ r first, then its negation; q → r is independent; the main ∨ is last.', 'p ∧ r trong cùng trước, rồi phủ định; q → r độc lập; ∨ chính ở cuối.'], 2),
  ],
  goiY: ['The main connective is evaluated last.', 'Independent sub-formulas can be done in either order — the checker only accepts the natural left-to-right nesting order.'],
  loiHayGap: ['Applying the main connective before the inner brackets.', 'Dropping the negation of a bracketed group.'],
  thuatNgu: [tn('main connective', 'toán tử chính')],
  khaiNiem: ['evaluation order'],
});

/* ───── 6 · code: evaluate ───── */
function evaluate(f, env) {
  switch (f[0]) {
    case 'var': return !!env[f[1]];
    case 'T': return true;
    case 'F': return false;
    case 'not': return !evaluate(f[1], env);
    case 'and': return evaluate(f[1], env) && evaluate(f[2], env);
    case 'or': return evaluate(f[1], env) || evaluate(f[2], env);
    case 'xor': return evaluate(f[1], env) !== evaluate(f[2], env);
    case 'imp': return !evaluate(f[1], env) || evaluate(f[2], env);
    case 'iff': return evaluate(f[1], env) === evaluate(f[2], env);
    default: throw new Error('unknown operator ' + f[0]);
  }
}
const L6 = jsDe({
  tieuDe: 'Logic 6 — Write a formula evaluator',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>A formula is a nested array: <code>["var","p"]</code>, <code>["not",A]</code>, and the binary forms <code>["and",A,B]</code>, <code>["or",A,B]</code>, <code>["xor",A,B]</code>, <code>["imp",A,B]</code> (A → B), <code>["iff",A,B]</code>. Write <code>evaluate(formula, env)</code> where <code>env</code> maps variable names to booleans, returning <code>true</code> or <code>false</code>.</p>', '<p>Công thức là mảng lồng nhau: <code>["var","p"]</code>, <code>["not",A]</code> và các dạng hai ngôi <code>["and",A,B]</code>, <code>["or",A,B]</code>, <code>["xor",A,B]</code>, <code>["imp",A,B]</code> (A → B), <code>["iff",A,B]</code>. Viết <code>evaluate(formula, env)</code> với <code>env</code> ánh xạ tên biến sang boolean, trả <code>true</code> hoặc <code>false</code>.</p>'),
  yeuCau: [bi('Recursion on the first element of the array is the natural solution.', 'Đệ quy theo phần tử đầu của mảng là cách tự nhiên.'), bi('Implication A → B is false only when A is true and B is false.', 'A → B chỉ sai khi A đúng và B sai.')],
  viDu: [{ input: 'evaluate(["imp",["var","p"],["var","q"]], {p:true,q:false})', output: 'false', explanation: 'True → false is false.|||Đúng → sai là sai.' }, { input: 'evaluate(["or",["not",["var","p"]],["var","q"]], {p:false,q:false})', output: 'true', explanation: '¬p is true, so the disjunction is true.|||¬p đúng nên tuyển đúng.' }],
  goiY: ['A switch (or if-chain) on f[0], and recursive calls for f[1] and f[2].', 'Implement imp as !a || b and iff as a === b.'],
  loiHayGap: ['Forgetting to read the variable from env (returning the name string, which is always truthy).', 'Implementing imp as (a || b) or as (b → a).'],
  giaiThich: '<p>The formula tree is evaluated bottom-up: each connective is computed from the values of its sub-formulas. Recursion mirrors the grammar of formulas exactly.</p>',
  khaiNiem: ['recursion', 'structural evaluation'],
  fn: 'evaluate',
  dau: 'function evaluate(f, env) {\n  // f[0] is the operator name\n  return false;\n}\n',
  giaiMa: dat(evaluate, 'evaluate'),
  ref: evaluate,
  cases: [
    { args: [['var', 'p'], { p: true }] },
    { args: [I(p, qv), { p: true, q: false }] },
    { args: [O(N(p), qv), { p: false, q: false }] },
    { args: [Q(p, qv), { p: false, q: false }] },
    { args: [X(A(p, qv), r), { p: true, q: true, r: true }] },
    { args: [I(A(p, N(qv)), O(r, qv)), { p: true, q: false, r: false }], an: true },
    { args: [N(N(N(p))), { p: true }], an: true },
    { args: [Q(I(p, qv), I(N(qv), N(p))), { p: true, q: false }], an: true },
  ],
});

/* ───── 7 · code: classify ───── */
function classify(f) {
  var vars = {};
  (function w(x) { if (x[0] === 'var') vars[x[1]] = 1; else for (var i = 1; i < x.length; i++) if (Array.isArray(x[i])) w(x[i]); })(f);
  var names = Object.keys(vars).sort(), n = names.length, trues = 0, total = 1 << n;
  function ev(g, env) {
    switch (g[0]) {
      case 'var': return !!env[g[1]];
      case 'T': return true;
      case 'F': return false;
      case 'not': return !ev(g[1], env);
      case 'and': return ev(g[1], env) && ev(g[2], env);
      case 'or': return ev(g[1], env) || ev(g[2], env);
      case 'xor': return ev(g[1], env) !== ev(g[2], env);
      case 'imp': return !ev(g[1], env) || ev(g[2], env);
      default: return ev(g[1], env) === ev(g[2], env);
    }
  }
  for (var m = 0; m < total; m++) {
    var env = {};
    for (var i = 0; i < n; i++) env[names[i]] = ((m >> i) & 1) === 1;
    if (ev(f, env)) trues++;
  }
  return trues === total ? 'tautology' : trues === 0 ? 'contradiction' : 'contingent';
}
const L7 = jsDe({
  tieuDe: 'Logic 7 — Tautology, contradiction or contingency?',
  doKho: 'HARD', phut: 22,
  moTa: bi('<p>Write <code>classify(formula)</code> using the same nested-array format as before. Return <code>"tautology"</code> if the formula is true under every assignment, <code>"contradiction"</code> if it is false under every assignment, and <code>"contingent"</code> otherwise. First collect the variable names, then try all 2ⁿ assignments.</p>', '<p>Viết <code>classify(formula)</code> với cùng định dạng mảng lồng. Trả <code>"tautology"</code> nếu công thức đúng với mọi bộ gán, <code>"contradiction"</code> nếu sai với mọi bộ gán, ngược lại <code>"contingent"</code>. Trước hết thu tên biến, sau đó thử cả 2ⁿ bộ gán.</p>'),
  yeuCau: [bi('A formula may contain 0 to 5 distinct variables.', 'Công thức có từ 0 đến 5 biến khác nhau.'), bi('You may write a helper evaluator inside classify.', 'Có thể viết hàm đánh giá phụ bên trong classify.')],
  viDu: [{ input: 'classify(["or",["var","p"],["not",["var","p"]]])', output: '"tautology"', explanation: 'p ∨ ¬p is the law of excluded middle.|||p ∨ ¬p là luật bài trung.' }, { input: 'classify(["and",["var","p"],["not",["var","p"]]])', output: '"contradiction"', explanation: 'p ∧ ¬p is never true.|||p ∧ ¬p không bao giờ đúng.' }],
  goiY: ['Walk the tree once to collect names; loop m from 0 to 2ⁿ − 1 and read bit i of m as the value of variable i.', 'Count the assignments that make the formula true: all ⇒ tautology, none ⇒ contradiction.'],
  loiHayGap: ['Stopping after the first true row (a single true row says nothing about the other rows).', 'Forgetting formulas with no variables at all (["T"]).'],
  giaiThich: '<p>A truth table has 2ⁿ rows; counting the rows where the formula is true classifies it. Code that tests all assignments is exactly the truth-table method.</p>',
  khaiNiem: ['truth-table method', 'bit masks'],
  fn: 'classify',
  dau: 'function classify(f) {\n  return "contingent";\n}\n',
  giaiMa: dat(classify, 'classify'),
  ref: classify,
  cases: [
    { args: [O(p, N(p))] }, { args: [A(p, N(p))] }, { args: [I(p, qv)] },
    { args: [I(A(I(p, qv), p), qv)] },
    { args: [Q(N(A(p, qv)), O(N(p), N(qv)))], an: true },
    { args: [['T']], an: true }, { args: [['F']], an: true },
    { args: [I(A(I(p, qv), qv), p)], an: true },
    { args: [X(p, p)], an: true },
  ],
});

export default doiDau({
  slug: 'mad101-1-1-logic-menh-de',
  ten: '1.1 Propositional logic',
  khoa: KHOA,
  baiHoc: 'mad101-1-1-logic-menh-de',
  de: [L1, L2, L3, L4, L5, L6, L7],
});
void Q;
