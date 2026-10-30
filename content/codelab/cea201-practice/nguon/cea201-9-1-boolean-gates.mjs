/** CEA201 · 9.1 — Boolean algebra & logic gates. Bảng chân trị do mã tính; phương án đúng/sai được kiểm bằng vét cạn. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, dat } from './_ce.mjs';

const rows3 = [];
for (let i = 0; i < 8; i++) rows3.push([(i >> 2) & 1, (i >> 1) & 1, i & 1]);
const same = (f, g, n = 3) => { for (let i = 0; i < 1 << n; i++) { const v = Array.from({ length: n }, (_, k) => (i >> (n - 1 - k)) & 1); if (!!f(...v) !== !!g(...v)) return false; } return true; };

const E1 = tinh({
  tieuDe: 'Logic 1 — Laws, De Morgan and universal gates',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on Boolean algebra.</p>', '<p>Câu hỏi khái niệm về đại số Boole.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['De Morgan: NOT (A AND B) equals …', 'De Morgan: NOT (A AND B) bằng …'], ['(NOT A) OR (NOT B)', '(NOT A) AND (NOT B)', 'A OR B', 'NOT A'], ['Complementing an AND turns it into an OR of complements.', 'Lấy bù của AND thành OR của các bù.']),
    q('c2', ['Which gates are “universal” (any function can be built from only that gate)?', 'Cổng nào là “vạn năng” (mọi hàm xây được chỉ từ cổng đó)?'], ['NAND and NOR', 'AND and OR', 'XOR and XNOR', 'NOT only'], ['NAND alone gives NOT, AND and OR; so does NOR.', 'Chỉ NAND đã cho NOT, AND, OR; NOR cũng vậy.']),
    q('c3', ['A + A·B simplifies to …', 'A + A·B rút gọn thành …'], ['A', 'A·B', 'A + B', '1'], ['Absorption law: A·(1 + B) = A.', 'Luật hấp thụ: A·(1 + B) = A.']),
    q('c4', ['The XOR of A and B is 1 when …', 'XOR của A và B bằng 1 khi …'], ['A and B differ', 'A and B are both 1', 'A and B are equal', 'either is 0'], ['XOR = A·B′ + A′·B.', 'XOR = A·B′ + A′·B.']),
    q('c5', ['A truth table of n inputs has how many rows?', 'Bảng chân trị n ngõ vào có bao nhiêu dòng?'], ['2ⁿ', 'n²', '2n', 'n!'], ['Each input has 2 values.', 'Mỗi ngõ vào có 2 giá trị.']),
    q('c6', ['A minterm of 3 variables is …', 'Một minterm của 3 biến là …'], ['a product containing every variable once, true on exactly one row', 'a sum of all variables', 'a single variable', 'a product true on all rows'], ['Sum-of-products form ORs the minterms of the rows where F = 1.', 'Dạng tổng các tích OR các minterm của dòng có F = 1.']),
  ],
  goiY: ['De Morgan swaps AND/OR and complements.', 'Use a truth table to verify any doubtful identity.'],
  loiHayGap: ['Complementing only one side of De Morgan.', 'Believing XOR is “A or B”.'],
  thuatNgu: [tn('minterm', 'minterm (tích chuẩn)'), tn('De Morgan’s laws', 'định lý De Morgan')],
  khaiNiem: ['Boolean laws', 'universal gates'],
});

const FN = [
  ['F = A·B + C′', (a, b, c) => (a & b) | (c ^ 1)],
  ['G = (A + B)′·C', (a, b, c) => ((a | b) ^ 1) & c],
  ['H = A ⊕ B ⊕ C', (a, b, c) => a ^ b ^ c],
  ['M = A·B + B·C + A·C', (a, b, c) => (a & b) | (b & c) | (a & c)],
];
const E2 = tinh({
  tieuDe: 'Logic 2 — Fill the truth tables',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p>Complete the output column (0 or 1) for each of the four functions of A, B, C. (′ = NOT, · = AND, + = OR, ⊕ = XOR.)</p>', '<p>Hoàn thành cột ngõ ra (0 hoặc 1) cho mỗi hàm trong bốn hàm của A, B, C. (′ = NOT, · = AND, + = OR, ⊕ = XOR.)</p>'),
  loai: 'table',
  bang: FN.map(([n, f], k) => bang1('b' + (k + 1), [n, n], [{ ma: 'i', ten: 'A B C' }, { ma: 'o', ten: 'Output', luaChon: ['0', '1'] }],
    rows3.map((r) => ({ o: { i: r.join(' ') }, a: { o: String(f(...r)) } })),
    [`${n}: outputs for ABC = 000…111: ${rows3.map((r) => f(...r)).join('')}.`, `${n}: ngõ ra cho ABC = 000…111: ${rows3.map((r) => f(...r)).join('')}.`])),
  goiY: ['Evaluate the NOT first, then AND, then OR.', 'XOR of three variables is 1 when an odd number of inputs are 1.'],
  loiHayGap: ['Reading ′ as a typo instead of NOT.', 'Giving AND precedence over NOT.'],
  thuatNgu: [tn('truth table', 'bảng chân trị')],
  khaiNiem: ['truth tables'],
});

// Bài tương đương: mỗi phương án đúng/sai được kiểm vét cạn ngay khi nạp tệp
const TG = [
  { de: 'F = A·B + A·B′ + A′·B', f: (a, b) => (a & b) | (a & (b ^ 1)) | ((a ^ 1) & b), opts: [['A + B', (a, b) => a | b, true], ['A ⊕ B', (a, b) => a ^ b], ['A·B', (a, b) => a & b], ['A′·B′', (a, b) => (a ^ 1) & (b ^ 1)]] },
  { de: 'F = (A + B)·(A + B′)', f: (a, b) => (a | b) & (a | (b ^ 1)), opts: [['A', (a) => a, true], ['B', (a, b) => b], ['A + B', (a, b) => a | b], ['A·B′', (a, b) => a & (b ^ 1)]] },
  { de: 'F = (A + B)′ + A′·B', f: (a, b) => ((a | b) ^ 1) | ((a ^ 1) & b), opts: [['A′', (a) => a ^ 1, true], ['B′', (a, b) => b ^ 1], ['A′·B′', (a, b) => (a ^ 1) & (b ^ 1)], ['A + B′', (a, b) => a | (b ^ 1)]] },
  { de: 'F = A·B·C + A·B·C′ + A·B′·C', f: (a, b, c) => (a & b & c) | (a & b & (c ^ 1)) | (a & (b ^ 1) & c), opts: [['A·(B + C)', (a, b, c) => a & (b | c), true], ['A·B·C', (a, b, c) => a & b & c], ['A + B + C', (a, b, c) => a | b | c], ['A·B + C', (a, b, c) => (a & b) | c]] },
];
for (const t of TG) { const n = t.f.length; for (const [, g, ok] of t.opts) if (same(t.f, g, n) !== !!ok) throw new Error('equivalence option wrong in ' + t.de); }
const E3 = tinh({
  tieuDe: 'Logic 3 — Which simplified expression is equivalent?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Choose the expression that is logically equivalent to the given one (each option was verified against the truth table).</p>', '<p>Chọn biểu thức tương đương logic với biểu thức đã cho (mỗi phương án đã được kiểm với bảng chân trị).</p>'),
  loai: 'choice',
  cauHoi: TG.map((t, i) => mc('c' + (i + 1), [t.de, t.de], t.opts.map(([n], j) => ['abcd'[j], n]), 'a', ['Verified by comparing all rows of the truth table; the others differ on at least one row.', 'Đã kiểm bằng cách so mọi dòng của bảng chân trị; các phương án còn lại sai ở ít nhất một dòng.'])),
  goiY: ['Group terms and factor: X·B + X·B′ = X.', 'When in doubt, build the truth table of the expression and of each option.'],
  loiHayGap: ['Applying absorption in the wrong direction.', 'Forgetting that X + X′ = 1.'],
  thuatNgu: [tn('absorption', 'hấp thụ'), tn('factoring', 'đặt nhân tử chung')],
  khaiNiem: ['Boolean simplification'],
});

// số cổng NAND 2 ngõ vào chuẩn — dựng bằng mạng và kiểm bằng evalNet
const NETS = {
  NOT: { g: [['y', 'NAND', 'A', 'A']], n: 1, f: (a) => a ^ 1, in: ['A'] },
  AND: { g: [['t', 'NAND', 'A', 'B'], ['y', 'NAND', 't', 't']], n: 2, f: (a, b) => a & b, in: ['A', 'B'] },
  OR: { g: [['x', 'NAND', 'A', 'A'], ['z', 'NAND', 'B', 'B'], ['y', 'NAND', 'x', 'z']], n: 3, f: (a, b) => a | b, in: ['A', 'B'] },
  XOR: { g: [['t', 'NAND', 'A', 'B'], ['u', 'NAND', 'A', 't'], ['v', 'NAND', 'B', 't'], ['y', 'NAND', 'u', 'v']], n: 4, f: (a, b) => a ^ b, in: ['A', 'B'] },
  NOR: { g: [['x', 'NAND', 'A', 'A'], ['z', 'NAND', 'B', 'B'], ['t', 'NAND', 'x', 'z'], ['y', 'NAND', 't', 't']], n: 4, f: (a, b) => (a | b) ^ 1, in: ['A', 'B'] },
};
for (const [k, d] of Object.entries(NETS)) for (let i = 0; i < 1 << d.in.length; i++) { const v = d.in.map((_, j) => (i >> (d.in.length - 1 - j)) & 1); const r = S.evalNet(d.g, Object.fromEntries(d.in.map((n, j) => [n, v[j]]))); if (r.y !== d.f(...v)) throw new Error('NAND net wrong ' + k); if (d.g.length !== d.n) throw new Error('count ' + k); }
const E4 = tinh({
  tieuDe: 'Logic 4 — Building everything from NAND gates',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>How many 2-input NAND gates does the <b>standard</b> construction need for each function? (NOT: tie both inputs together; AND: NAND then NOT; OR: NOT both inputs then NAND; XOR: the classic 4-gate circuit; NOR: OR then NOT.) The constructions were checked by simulating all input combinations.</p>', '<p>Cách dựng <b>chuẩn</b> mỗi hàm cần bao nhiêu cổng NAND 2 ngõ vào? (NOT: nối hai ngõ vào; AND: NAND rồi NOT; OR: NOT cả hai ngõ vào rồi NAND; XOR: mạch 4 cổng kinh điển; NOR: OR rồi NOT.) Các cách dựng đã được kiểm bằng mô phỏng mọi tổ hợp ngõ vào.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['NAND count', 'Số cổng NAND'], [{ ma: 'f', ten: 'Function' }, { ma: 'n', ten: 'NAND gates' }],
    Object.entries(NETS).map(([k, d]) => ({ o: { f: k }, a: { n: String(d.n) } })),
    ['NOT 1; AND 2; OR 3; XOR 4; NOR 4 (OR = 3, plus a NOT = 1).', 'NOT 1; AND 2; OR 3; XOR 4; NOR 4 (OR = 3, thêm NOT = 1).'])],
  goiY: ['NAND(A, A) = A′.', 'AND = NOT(NAND), OR = NAND of the complements.'],
  loiHayGap: ['Counting the NOT inputs of OR as free.', 'Forgetting the final NOT in AND and NOR.'],
  thuatNgu: [tn('universal gate', 'cổng vạn năng')],
  khaiNiem: ['NAND universality'],
});

const NL = [['x', 'NAND', 'A', 'B'], ['y', 'NOR', 'x', 'C'], ['z', 'XOR', 'y', 'A'], ['w', 'AND', 'z', 'C']];
const INP = [[0, 0, 0], [0, 1, 1], [1, 1, 0], [1, 0, 1], [1, 1, 1]];
const E5 = tinh({
  tieuDe: 'Logic 5 — Evaluate a gate network',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Network: <code>x = NAND(A, B)</code>, <code>y = NOR(x, C)</code>, <code>z = XOR(y, A)</code>, <code>w = AND(z, C)</code>. For each input vector give the values of <b>y</b>, <b>z</b> and <b>w</b>.</p>', '<p>Mạng: <code>x = NAND(A, B)</code>, <code>y = NOR(x, C)</code>, <code>z = XOR(y, A)</code>, <code>w = AND(z, C)</code>. Với mỗi bộ ngõ vào cho giá trị <b>y</b>, <b>z</b> và <b>w</b>.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Network outputs', 'Ngõ ra của mạng'], [{ ma: 'i', ten: 'A B C' }, { ma: 'y', ten: 'y' }, { ma: 'z', ten: 'z' }, { ma: 'w', ten: 'w' }],
    INP.map((r) => { const v = S.evalNet(NL, { A: r[0], B: r[1], C: r[2] }); return { o: { i: r.join(' ') }, a: { y: String(v.y), z: String(v.z), w: String(v.w) } }; }),
    ['Evaluate in order x, y, z, w. ' + INP.map((r) => { const v = S.evalNet(NL, { A: r[0], B: r[1], C: r[2] }); return `${r.join('')}: y=${v.y} z=${v.z} w=${v.w}`; }).join('; ') + '.', 'Tính theo thứ tự x, y, z, w. ' + INP.map((r) => { const v = S.evalNet(NL, { A: r[0], B: r[1], C: r[2] }); return `${r.join('')}: y=${v.y} z=${v.z} w=${v.w}`; }).join('; ') + '.'])],
  goiY: ['Compute x first, then feed it to the next gate.', 'NOR is 1 only when both inputs are 0.'],
  loiHayGap: ['Skipping the intermediate wire x.', 'Reading NAND as AND.'],
  thuatNgu: [tn('netlist', 'danh sách cổng nối dây')],
  khaiNiem: ['combinational circuit evaluation'],
});

const evalCircuit = function evalCircuit(gates, inputs, outputs) {
  var v = {}, k;
  for (k in inputs) v[k] = inputs[k] ? 1 : 0;
  for (var i = 0; i < gates.length; i++) {
    var g = gates[i], a = v[g[2]], b = g.length > 3 ? v[g[3]] : 0, r;
    if (g[1] === 'AND') r = a & b;
    else if (g[1] === 'OR') r = a | b;
    else if (g[1] === 'NAND') r = (a & b) ^ 1;
    else if (g[1] === 'NOR') r = (a | b) ^ 1;
    else if (g[1] === 'XOR') r = a ^ b;
    else if (g[1] === 'XNOR') r = (a ^ b) ^ 1;
    else r = a ^ 1;
    v[g[0]] = r;
  }
  return outputs.map(function (o) { return v[o]; });
};
const HA = [['s', 'XOR', 'a', 'b'], ['c', 'AND', 'a', 'b']];
const XORN = NETS.XOR.g.map((g) => [g[0], g[1], g[2].toLowerCase() === 'a' ? 'A' : g[2], g[3]]);
const MAJ = [['ab', 'AND', 'A', 'B'], ['bc', 'AND', 'B', 'C'], ['ac', 'AND', 'A', 'C'], ['t', 'OR', 'ab', 'bc'], ['m', 'OR', 't', 'ac']];
const E6 = jsDe({
  tieuDe: 'Logic 6 — Write a gate-level circuit evaluator',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>A circuit is a list of gates in a valid evaluation order: <code>[outWire, type, in1, in2]</code> (NOT has only <code>in1</code>), with <code>type</code> one of <code>AND OR NAND NOR XOR XNOR NOT</code>. Write <code>evalCircuit(gates, inputs, outputs)</code>: <code>inputs</code> maps primary input names to 0/1; return the array of the values (0/1) of the wires named in <code>outputs</code>, in that order.</p>', '<p>Mạch là danh sách cổng theo thứ tự tính hợp lệ: <code>[dâyRa, loại, vào1, vào2]</code> (NOT chỉ có <code>vào1</code>), <code>loại</code> là một trong <code>AND OR NAND NOR XOR XNOR NOT</code>. Viết <code>evalCircuit(gates, inputs, outputs)</code>: <code>inputs</code> ánh xạ tên ngõ vào sang 0/1; trả mảng giá trị (0/1) của các dây trong <code>outputs</code> theo thứ tự đó.</p>'),
  viDu: [{ input: "evalCircuit([['s','XOR','a','b'],['c','AND','a','b']], {a:1,b:1}, ['s','c'])", output: JSON.stringify(evalCircuit(HA, { a: 1, b: 1 }, ['s', 'c'])), explanation: 'A half adder: 1 + 1 = sum 0, carry 1.|||Bộ cộng nửa: 1 + 1 = tổng 0, nhớ 1.' }],
  goiY: ['Keep an object mapping wire names to values and fill it gate by gate.', 'Use bitwise operators on 0/1 values, e.g. NAND = (a & b) ^ 1.', 'The inputs object may contain truthy values other than 1 — normalize with `? 1 : 0`.'],
  loiHayGap: ['Forgetting that NOT has one input.', 'Evaluating the gates in a different order than listed.'],
  giaiThich: '<p>A combinational circuit is just a dependency-ordered list of Boolean functions; evaluating it is a single pass.</p>',
  khaiNiem: ['netlist simulation'],
  fn: 'evalCircuit',
  dau: 'function evalCircuit(gates, inputs, outputs) {\n  return [];\n}\n',
  giaiMa: dat(evalCircuit, 'evalCircuit'),
  ref: evalCircuit,
  cases: [{ args: [HA, { a: 1, b: 1 }, ['s', 'c']] }, { args: [HA, { a: 1, b: 0 }, ['s', 'c']] }, { args: [MAJ, { A: 1, B: 0, C: 1 }, ['m']] }, { args: [NETS.XOR.g, { A: 1, B: 0 }, ['y']] }, { args: [NL, { A: 1, B: 1, C: 1 }, ['y', 'z', 'w']], an: true }, { args: [MAJ, { A: 0, B: 0, C: 1 }, ['m', 'ab']], an: true }, { args: [[['n', 'NOT', 'a'], ['q', 'XNOR', 'n', 'b']], { a: 0, b: 1 }, ['n', 'q']], an: true }, { args: [NETS.NOR.g, { A: 0, B: 0 }, ['y']], an: true }],
});

export default doiDau({
  slug: 'cea201-9-1-boolean-gates',
  ten: '9.1 Boolean algebra & logic gates',
  khoa: KHOA,
  baiHoc: 'cea201-9-1-boolean-gates',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void giai; void XORN;
