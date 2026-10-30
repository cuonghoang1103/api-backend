/** MAD101 · Lab ch.2 — Relations and matrices: properties, closures, equivalence classes, matrix products. */
import assert from 'node:assert/strict';
import { doiDau, KHOA, S, bi, tinh, jsDe, q, tn, ord, dat, bang1, mcNum, setAns, listAns } from './_md.mjs';

const f2 = (x) => String(x);
const R1 = tinh({
  tieuDe: 'Relations 1 — Properties of relations (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>A relation R on A is a set of ordered pairs. Check you can state the five standard properties precisely.</p>', '<p>Quan hệ R trên A là tập các cặp có thứ tự. Kiểm tra bạn phát biểu chính xác năm tính chất chuẩn.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['R is reflexive on A exactly when …', 'R phản xạ trên A khi và chỉ khi …'], ['(a, a) ∈ R for every a ∈ A', '(a, b) ∈ R ⇒ (b, a) ∈ R', '(a, a) ∉ R for every a', 'R = A × A, with every pair present'], ['Every element is related to itself.', 'Mỗi phần tử có quan hệ với chính nó.']),
    q('c2', ['R is symmetric exactly when …', 'R đối xứng khi và chỉ khi …'], ['(a, b) ∈ R ⇒ (b, a) ∈ R', '(a, b), (b, a) ∈ R ⇒ a = b', '(a, b), (b, c) ∈ R ⇒ (a, c) ∈ R', '(a, a) ∈ R for all a'], ['Every arrow has a return arrow.', 'Mỗi mũi tên đều có mũi tên quay lại.']),
    q('c3', ['R is antisymmetric exactly when …', 'R phản đối xứng khi và chỉ khi …'], ['(a, b) and (b, a) in R imply a = b', '(a, b) ∈ R ⇒ (b, a) ∈ R', 'no pair (a, b) with a ≠ b is in R', 'R contains no loops'], ['Two different elements are never related both ways. Antisymmetric is NOT the opposite of symmetric.', 'Hai phần tử khác nhau không bao giờ liên hệ cả hai chiều. Phản đối xứng KHÔNG phải là “không đối xứng”.']),
    q('c4', ['An equivalence relation is …', 'Quan hệ tương đương là quan hệ …'], ['reflexive, symmetric and transitive', 'reflexive, antisymmetric and transitive', 'symmetric and antisymmetric', 'transitive only'], ['Reflexive + antisymmetric + transitive is a partial order instead.', 'Phản xạ + phản đối xứng + bắc cầu là thứ tự bộ phận.']),
    q('c5', ['The equivalence classes of an equivalence relation on A …', 'Các lớp tương đương của một quan hệ tương đương trên A …'], ['partition A into disjoint non-empty blocks', 'overlap in general, so one element can be in two', 'always contain exactly one element of A each', 'cover only part of A, leaving some elements out'], ['Every element lies in exactly one class.', 'Mỗi phần tử thuộc đúng một lớp.']),
    q('c6', ['“x divides y” on the positive integers is …', '“x chia hết y” trên các số nguyên dương là …'], ['a partial order', 'an equivalence relation', 'symmetric', 'not transitive'], ['Reflexive (x | x), antisymmetric (x | y and y | x ⇒ x = y), transitive.', 'Phản xạ, phản đối xứng, bắc cầu.']),
  ],
  goiY: ['Write each property as a one-line “for all … if … then …”.', 'Test on a tiny example such as A = {1,2}.'],
  loiHayGap: ['Thinking antisymmetric means “not symmetric”.', 'Forgetting that equality is both symmetric and antisymmetric.'],
  thuatNgu: [tn('reflexive', 'phản xạ'), tn('symmetric', 'đối xứng'), tn('antisymmetric', 'phản đối xứng'), tn('transitive', 'bắc cầu'), tn('partial order', 'thứ tự bộ phận')],
  khaiNiem: ['relations'],
});

/* property table */
const A3 = [1, 2, 3];
const RELS = [
  { A: [1, 2, 3], R: [[1, 1], [2, 2], [3, 3], [1, 2], [2, 1]] },
  { A: [1, 2, 3], R: [[1, 1], [2, 2], [3, 3], [1, 2], [1, 3], [2, 3]] },
  { A: [1, 2, 3], R: [[1, 2], [2, 3], [1, 3]] },
  { A: [1, 2, 3], R: [[1, 2], [2, 1], [2, 3], [3, 2]] },
  { A: [1, 2, 3, 4], R: [[1, 1], [2, 2], [3, 3], [4, 4], [1, 3], [3, 1], [2, 4], [4, 2]] },
];
const txtR = (c) => `A = {${c.A.join(',')}}, R = {${c.R.map((p) => `(${p[0]},${p[1]})`).join(' ')}}`;
const yn = (b) => (b ? 'Yes' : 'No');
assert.ok(S.relProps(RELS[4].A, RELS[4].R).equivalence);
const R2 = tinh({
  tieuDe: 'Relations 2 — Which properties hold?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>For each relation decide whether it is reflexive, symmetric, antisymmetric and transitive, then whether it is an equivalence relation or a partial order.</p>', '<p>Với mỗi quan hệ xác định nó có phản xạ, đối xứng, phản đối xứng, bắc cầu không, rồi xem nó là quan hệ tương đương hay thứ tự bộ phận.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Relation properties', 'Tính chất quan hệ'], [{ ma: 'r', ten: 'Relation' }, { ma: 'rf', ten: 'Reflexive', luaChon: ['Yes', 'No'] }, { ma: 'sy', ten: 'Symmetric', luaChon: ['Yes', 'No'] }, { ma: 'an', ten: 'Antisymmetric', luaChon: ['Yes', 'No'] }, { ma: 'tr', ten: 'Transitive', luaChon: ['Yes', 'No'] }, { ma: 'kd', ten: 'Kind', luaChon: ['Equivalence', 'Partial order', 'Neither'] }],
    RELS.map((c) => { const p = S.relProps(c.A, c.R); return { o: { r: txtR(c) }, a: { rf: yn(p.reflexive), sy: yn(p.symmetric), an: yn(p.antisymmetric), tr: yn(p.transitive), kd: p.equivalence ? 'Equivalence' : p.partialOrder ? 'Partial order' : 'Neither' } }; }),
    [RELS.map((c) => { const p = S.relProps(c.A, c.R); return `${txtR(c)}: refl ${p.reflexive}, sym ${p.symmetric}, anti ${p.antisymmetric}, trans ${p.transitive}`; }).join('; ') + '.', RELS.map((c) => { const p = S.relProps(c.A, c.R); return `${txtR(c)}: phản xạ ${p.reflexive}, đối xứng ${p.symmetric}, phản đối xứng ${p.antisymmetric}, bắc cầu ${p.transitive}`; }).join('; ') + '.'])],
  goiY: ['For transitivity, for every chain (a,b),(b,c) look for (a,c).', 'The diagonal pairs (a,a) decide reflexivity; a missing one breaks it.'],
  loiHayGap: ['Missing the transitivity failure: (1,2),(2,3) present but (1,3) absent.', 'Calling a relation with both (1,2) and (2,1) antisymmetric.'],
  thuatNgu: [tn('equivalence relation', 'quan hệ tương đương')],
  khaiNiem: ['relation properties'],
});

/* matrices */
const MR = { A: [1, 2, 3, 4], R: [[1, 2], [2, 3], [3, 3], [4, 1], [4, 4]] };
const mat = (n, R) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (R.some((p) => p[0] === i + 1 && p[1] === j + 1) ? 1 : 0)));
const M = mat(4, MR.R), M2 = S.boolMul(M, M), M3 = S.boolMul(M2, M);
const R3 = tinh({
  tieuDe: 'Relations 3 — Zero–one matrices and R²',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>R on {1,2,3,4} is ${MR.R.map((p) => `(${p[0]},${p[1]})`).join(', ')}. Fill the zero–one matrix M_R (row i, column j is 1 when (i, j) ∈ R), then the matrix of R² = R∘R (the Boolean product M_R ⊙ M_R), and R³.</p>`, `<p>R trên {1,2,3,4} là ${MR.R.map((p) => `(${p[0]},${p[1]})`).join(', ')}. Điền ma trận 0–1 M_R (dòng i cột j bằng 1 khi (i, j) ∈ R), rồi ma trận của R² = R∘R (tích Boole M_R ⊙ M_R) và R³.</p>`),
  loai: 'table',
  bang: [['M_R', M], ['M_R² (R²)', M2], ['M_R³ (R³)', M3]].map(([nm, mm], k) => bang1('b' + (k + 1), [nm, nm], [{ ma: 'r', ten: 'row' }, ...[1, 2, 3, 4].map((j) => ({ ma: 'c' + j, ten: 'col ' + j, luaChon: ['0', '1'] }))],
    mm.map((row, i) => ({ o: { r: 'row ' + (i + 1) }, a: Object.fromEntries(row.map((v, j) => ['c' + (j + 1), String(v)])) })),
    [`${nm} = ${mm.map((r) => r.join('')).join(' / ')} (rows 1–4).`, `${nm} = ${mm.map((r) => r.join('')).join(' / ')} (các dòng 1–4).`])),
  goiY: ['(M²)[i][j] = 1 exactly when some k has M[i][k] = 1 and M[k][j] = 1 (a 2-step path).', 'Do R³ as M² ⊙ M (not M ⊙ M ⊙ M from scratch).'],
  loiHayGap: ['Using ordinary integer multiplication and writing 2 in a cell (Boolean product uses OR/AND).', 'Multiplying columns by rows instead of rows by columns.'],
  thuatNgu: [tn('Boolean product', 'tích Boole'), tn('zero–one matrix', 'ma trận 0–1')],
  khaiNiem: ['matrix of a relation', 'composition'],
});

/* closures */
const CL = [
  { n: 4, R: [[0, 1], [1, 2], [2, 3]] }, { n: 4, R: [[0, 1], [1, 0], [2, 3]] }, { n: 5, R: [[0, 1], [1, 2], [2, 0], [3, 4]] }, { n: 3, R: [[0, 0], [0, 1], [1, 2]] },
];
const R4 = tinh({
  tieuDe: 'Relations 4 — Closures: how many pairs?',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Elements are numbered 0…n−1. For each relation give the number of ordered pairs in its <b>reflexive closure</b>, <b>symmetric closure</b> and <b>transitive closure</b>. The transitive closure adds every pair joined by a path of any length.</p>', '<p>Phần tử đánh số 0…n−1. Với mỗi quan hệ cho số cặp có thứ tự trong <b>bao đóng phản xạ</b>, <b>bao đóng đối xứng</b> và <b>bao đóng bắc cầu</b>. Bao đóng bắc cầu thêm mọi cặp nối bởi đường đi độ dài bất kỳ.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Closure sizes', 'Kích thước bao đóng'], [{ ma: 'r', ten: 'n and R' }, { ma: 'rf', ten: '|reflexive closure|' }, { ma: 'sy', ten: '|symmetric closure|' }, { ma: 'tr', ten: '|transitive closure|' }],
    CL.map((c) => ({ o: { r: `n = ${c.n}, R = {${c.R.map((p) => `(${p[0]},${p[1]})`).join(' ')}}` }, a: { rf: String(S.closureCount(c.n, c.R, 'refl')), sy: String(S.closureCount(c.n, c.R, 'sym')), tr: String(S.transClosure(c.n, c.R).length) } })),
    [CL.map((c) => `n=${c.n}: refl ${S.closureCount(c.n, c.R, 'refl')}, sym ${S.closureCount(c.n, c.R, 'sym')}, trans ${S.transClosure(c.n, c.R).length}`).join('; ') + '. Warshall’s algorithm computes the transitive closure.', CL.map((c) => `n=${c.n}: phản xạ ${S.closureCount(c.n, c.R, 'refl')}, đối xứng ${S.closureCount(c.n, c.R, 'sym')}, bắc cầu ${S.transClosure(c.n, c.R).length}`).join('; ') + '.'])],
  goiY: ['Reflexive closure: add the missing diagonal pairs; symmetric closure: add every missing reverse pair.', 'Transitive closure: draw the graph and list all pairs reachable by a directed path (cycles produce loops too).'],
  loiHayGap: ['Forgetting that a cycle a → b → c → a puts (a,a) in the transitive closure.', 'Counting a pair twice in the symmetric closure when both directions exist.'],
  thuatNgu: [tn('closure', 'bao đóng'), tn('Warshall’s algorithm', 'thuật toán Warshall')],
  khaiNiem: ['closures', 'reachability'],
});

/* equivalence classes */
const R5 = tinh({
  tieuDe: 'Relations 5 — Equivalence classes and partitions',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Counting equivalence classes and equivalence relations.</p>', '<p>Đếm lớp tương đương và quan hệ tương đương.</p>'),
  loai: 'choice',
  cauHoi: [
    mcNum('c1', ['x ~ y iff x ≡ y (mod 5) on {0,…,22}. How many equivalence classes are there?', 'x ~ y khi x ≡ y (mod 5) trên {0,…,22}. Có bao nhiêu lớp tương đương?'], 5, [4, 22, 23], f2, ['One class per residue 0,1,2,3,4.', 'Mỗi số dư 0,1,2,3,4 là một lớp.']),
    mcNum('c2', ['Same relation: how many elements does the class of 3 have?', 'Cùng quan hệ: lớp của 3 có bao nhiêu phần tử?'], S.modClasses(23, 5)[3], [S.modClasses(23, 5)[0], 6, 3], f2, [`Elements 3, 8, 13, 18: ${S.modClasses(23, 5)[3]} (residues 0, 1, 2 have five elements, residues 3, 4 have four).`, `Các phần tử 3, 8, 13, 18: ${S.modClasses(23, 5)[3]} (số dư 0, 1, 2 có năm phần tử, số dư 3, 4 có bốn).`]),
    mcNum('c3', ['How many equivalence relations exist on a 4-element set (Bell number B₄)?', 'Có bao nhiêu quan hệ tương đương trên tập 4 phần tử (số Bell B₄)?'], 15, [16, 24, 8], f2, ['Equivalence relations correspond to partitions: B₄ = 1+7+6+1 = 15.', 'Quan hệ tương đương tương ứng với phân hoạch: B₄ = 15.']),
    mcNum('c4', ['How many relations (any kind) exist on a 3-element set?', 'Có bao nhiêu quan hệ (bất kỳ) trên tập 3 phần tử?'], S.numRelations(3, 3), [2 * 9, 3 ** 3, 9], f2, ['Each of the 9 possible pairs is in or out: 2⁹ = 512.', 'Mỗi trong 9 cặp có thể thuộc hoặc không: 2⁹ = 512.']),
    mcNum('c5', ['How many reflexive relations exist on a 4-element set?', 'Có bao nhiêu quan hệ phản xạ trên tập 4 phần tử?'], 2 ** 12, [2 ** 16, 2 ** 4, 2 ** 10], f2, ['The 4 diagonal pairs are forced; each of the other 16 − 4 = 12 pairs is free: 2¹² = 4096.', '4 cặp đường chéo bắt buộc; 12 cặp còn lại tuỳ ý: 2¹² = 4096.']),
    mcNum('c6', ['How many symmetric relations exist on a 4-element set?', 'Có bao nhiêu quan hệ đối xứng trên tập 4 phần tử?'], 2 ** 10, [2 ** 16, 2 ** 12, 2 ** 6], f2, ['4 diagonal pairs + 6 unordered off-diagonal pairs = 10 independent choices: 2¹⁰ = 1024.', '4 cặp chéo + 6 cặp không thứ tự = 10 lựa chọn độc lập: 2¹⁰ = 1024.']),
  ],
  goiY: ['Equivalence relations = partitions; relation counts = 2^(number of free pairs).', 'Symmetry ties (a,b) to (b,a), halving the off-diagonal freedom.'],
  loiHayGap: ['Counting ordered pairs when the question allows only symmetric choices.', 'Forgetting the diagonal in the reflexive count.'],
  thuatNgu: [tn('partition', 'phân hoạch'), tn('Bell number', 'số Bell')],
  khaiNiem: ['equivalence classes', 'counting relations'],
});
assert.equal(S.modClasses(23, 5)[3], 4);

/* matrix product order puzzle */
const R6 = tinh({
  tieuDe: 'Relations 6 — Compute the transitive closure with Warshall',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Order the steps of Warshall’s algorithm for an n×n Boolean matrix W.</p>', '<p>Sắp các bước của thuật toán Warshall cho ma trận Boole n×n W.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['Warshall’s algorithm.', 'Thuật toán Warshall.'], ['Set W₀ = M_R.', 'For k = 1 to n (the allowed intermediate vertex):', 'For every i and j: W[i][j] ← W[i][j] ∨ (W[i][k] ∧ W[k][j]).', 'After the last k, W is the matrix of the transitive closure R*.'], ['The outer loop over k is the key: after round k, W records paths whose intermediate vertices are among 1…k.', 'Vòng ngoài theo k là mấu chốt: sau vòng k, W ghi các đường đi chỉ qua trung gian trong 1…k.'], 1)],
  goiY: ['k is the outermost loop.', 'The update uses only already-computed entries of the same matrix.'],
  loiHayGap: ['Putting k as the innermost loop (gives a wrong closure).', 'Using AND instead of OR for the update.'],
  thuatNgu: [tn('intermediate vertex', 'đỉnh trung gian')],
  khaiNiem: ['Warshall'],
});

/* code */
function relationProperties(n, pairs) {
  var m = [], i, j, k;
  for (i = 0; i < n; i++) { m.push([]); for (j = 0; j < n; j++) m[i].push(false); }
  pairs.forEach(function (p) { m[p[0]][p[1]] = true; });
  var reflexive = true, symmetric = true, antisymmetric = true, transitive = true;
  for (i = 0; i < n; i++) {
    if (!m[i][i]) reflexive = false;
    for (j = 0; j < n; j++) {
      if (m[i][j] && !m[j][i]) symmetric = false;
      if (i !== j && m[i][j] && m[j][i]) antisymmetric = false;
      if (m[i][j]) for (k = 0; k < n; k++) if (m[j][k] && !m[i][k]) transitive = false;
    }
  }
  return { reflexive: reflexive, symmetric: symmetric, antisymmetric: antisymmetric, transitive: transitive };
}
const R7 = jsDe({
  tieuDe: 'Relations 7 — Test the four properties in code',
  doKho: 'MEDIUM', phut: 18,
  moTa: bi('<p>Write <code>relationProperties(n, pairs)</code>. The elements are 0…n−1 and <code>pairs</code> is an array of <code>[a, b]</code>. Return <code>{ reflexive, symmetric, antisymmetric, transitive }</code> (booleans). Build a Boolean matrix first so every lookup is O(1).</p>', '<p>Viết <code>relationProperties(n, pairs)</code>. Phần tử là 0…n−1 và <code>pairs</code> là mảng các <code>[a, b]</code>. Trả <code>{ reflexive, symmetric, antisymmetric, transitive }</code> (boolean). Dựng ma trận Boole trước để mỗi lần tra cứu là O(1).</p>'),
  yeuCau: [bi('An empty relation on a non-empty set is symmetric, antisymmetric and transitive but not reflexive.', 'Quan hệ rỗng trên tập khác rỗng là đối xứng, phản đối xứng, bắc cầu nhưng không phản xạ.')],
  viDu: [{ input: 'relationProperties(3, [[0,0],[1,1],[2,2],[0,1],[1,0]])', output: JSON.stringify(relationProperties(3, [[0, 0], [1, 1], [2, 2], [0, 1], [1, 0]])), explanation: 'An equivalence relation with classes {0,1} and {2}.|||Quan hệ tương đương với các lớp {0,1} và {2}.' }],
  goiY: ['Transitivity: for every (i,j) in R and every k with (j,k) in R, require (i,k).', 'Antisymmetry only needs to look at i ≠ j.'],
  loiHayGap: ['Treating antisymmetric as “not symmetric”.', 'Skipping i = j in the symmetric test (harmless) but also in the reflexive test (wrong).'],
  giaiThich: '<p>Four O(n²)–O(n³) loops over the matrix, one per definition; the cubic one is transitivity.</p>',
  khaiNiem: ['relation properties', 'adjacency matrix'],
  fn: 'relationProperties',
  dau: 'function relationProperties(n, pairs) {\n  return { reflexive: false, symmetric: false, antisymmetric: false, transitive: false };\n}\n',
  giaiMa: dat(relationProperties, 'relationProperties'),
  ref: relationProperties,
  cases: [{ args: [3, [[0, 0], [1, 1], [2, 2], [0, 1], [1, 0]]] }, { args: [3, [[0, 1], [1, 2]]] }, { args: [3, []] }, { args: [0, []], an: true }, { args: [4, [[0, 0], [1, 1], [2, 2], [3, 3], [0, 1], [1, 2], [0, 2]]], an: true }, { args: [3, [[0, 1], [1, 0], [0, 0], [1, 1]]], an: true }],
});

function transitiveClosure(n, pairs) {
  var m = [], i, j, k, out = [];
  for (i = 0; i < n; i++) { m.push([]); for (j = 0; j < n; j++) m[i].push(false); }
  pairs.forEach(function (p) { m[p[0]][p[1]] = true; });
  for (k = 0; k < n; k++) for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (m[i][k] && m[k][j]) m[i][j] = true;
  for (i = 0; i < n; i++) for (j = 0; j < n; j++) if (m[i][j]) out.push([i, j]);
  return out;
}
const R8 = jsDe({
  tieuDe: 'Relations 8 — Warshall’s transitive closure',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Implement <code>transitiveClosure(n, pairs)</code> with Warshall’s algorithm. Return the closure as an array of <code>[i, j]</code> pairs sorted by <code>i</code> and then by <code>j</code>. Duplicate input pairs must not produce duplicates in the output. The relation may contain cycles, in which case loops <code>[i, i]</code> appear.</p>', '<p>Cài <code>transitiveClosure(n, pairs)</code> bằng thuật toán Warshall. Trả bao đóng là mảng các cặp <code>[i, j]</code> sắp theo <code>i</code> rồi <code>j</code>. Cặp trùng ở đầu vào không được sinh trùng ở đầu ra. Quan hệ có thể có chu trình, khi đó xuất hiện vòng <code>[i, i]</code>.</p>'),
  yeuCau: [bi('The outermost loop must be the intermediate vertex k.', 'Vòng ngoài cùng phải là đỉnh trung gian k.')],
  viDu: [{ input: 'transitiveClosure(3, [[0,1],[1,2]])', output: JSON.stringify(transitiveClosure(3, [[0, 1], [1, 2]])), explanation: '0→1→2 adds (0,2).|||0→1→2 thêm (0,2).' }],
  goiY: ['Use an n×n Boolean matrix and loop k, i, j in that order.', 'Collect the pairs in row-major order at the end — this gives the required sorting for free.'],
  loiHayGap: ['Writing the loops as i, j, k (the closure is then incomplete).', 'Returning the matrix instead of the list of pairs.'],
  giaiThich: '<p>After iteration k, W[i][j] is true iff there is a path from i to j whose intermediate vertices are all ≤ k; after n rounds it is the full reachability relation.</p>',
  khaiNiem: ['Warshall', 'transitive closure'],
  fn: 'transitiveClosure',
  dau: 'function transitiveClosure(n, pairs) {\n  return [];\n}\n',
  giaiMa: dat(transitiveClosure, 'transitiveClosure'),
  ref: transitiveClosure,
  cases: [{ args: [3, [[0, 1], [1, 2]]] }, { args: [3, [[0, 1], [1, 2], [2, 0]]] }, { args: [2, []] }, { args: [4, [[0, 1], [0, 1], [2, 3]]], an: true }, { args: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], an: true }, { args: [1, [[0, 0]]], an: true }],
});

function matPower(A, e) {
  var n = A.length, R = [], i, j, k, t;
  for (i = 0; i < n; i++) { R.push([]); for (j = 0; j < n; j++) R[i].push(i === j ? 1 : 0); }
  for (t = 0; t < e; t++) {
    var C = [];
    for (i = 0; i < n; i++) { C.push([]); for (j = 0; j < n; j++) { var s = 0; for (k = 0; k < n; k++) s += R[i][k] * A[k][j]; C[i].push(s); } }
    R = C;
  }
  return R;
}
const R9 = jsDe({
  tieuDe: 'Relations 9 — Matrix powers count walks',
  doKho: 'MEDIUM', phut: 15,
  moTa: bi('<p>Write <code>matPower(A, e)</code> that returns the integer matrix A<sup>e</sup> for a square matrix A (array of rows) and an exponent e ≥ 0. A⁰ is the identity matrix. In a graph, entry (i, j) of A<sup>e</sup> counts walks of length e from i to j.</p>', '<p>Viết <code>matPower(A, e)</code> trả ma trận nguyên A<sup>e</sup> cho ma trận vuông A (mảng các dòng) và số mũ e ≥ 0. A⁰ là ma trận đơn vị. Trong đồ thị, phần tử (i, j) của A<sup>e</sup> đếm số đường đi (walk) độ dài e từ i tới j.</p>'),
  yeuCau: [bi('Multiply with the ordinary rule: C[i][j] = Σ_k A[i][k]·B[k][j].', 'Nhân theo quy tắc thường: C[i][j] = Σ_k A[i][k]·B[k][j].')],
  viDu: [{ input: 'matPower([[0,1],[1,1]], 5)', output: JSON.stringify(matPower([[0, 1], [1, 1]], 5)), explanation: 'The Fibonacci matrix: entries are consecutive Fibonacci numbers.|||Ma trận Fibonacci: các phần tử là số Fibonacci liên tiếp.' }],
  goiY: ['Start from the identity and multiply by A e times.', 'The triple loop i, j, k computes one product.'],
  loiHayGap: ['Starting from the zero matrix.', 'Mutating the array that is still being read while multiplying.'],
  giaiThich: '<p>Repeated multiplication is O(n³·e); squaring would reduce it to O(n³ log e) but is not required.</p>',
  khaiNiem: ['matrix multiplication', 'walks'],
  fn: 'matPower',
  dau: 'function matPower(A, e) {\n  return [];\n}\n',
  giaiMa: dat(matPower, 'matPower'),
  ref: matPower,
  cases: [{ args: [[[0, 1], [1, 1]], 5] }, { args: [[[1, 2], [3, 4]], 0] }, { args: [[[2]], 10] }, { args: [[[0, 1, 0], [0, 0, 1], [1, 0, 0]], 3], an: true }, { args: [[[1, 1, 0], [1, 0, 1], [0, 1, 1]], 4], an: true }],
});
void ord; void setAns; void listAns;

export default doiDau({
  slug: 'mad101-2-lab-relations-matrices',
  ten: '2.L Lab: relations, closures & matrices',
  khoa: KHOA,
  baiHoc: 'mad101-2-2-ham-day',
  de: [R1, R2, R3, R4, R5, R6, R7, R8, R9],
});
