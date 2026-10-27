/**
 * SWT301 · 5.2 — Cyclomatic complexity & the minimum test set (SWT4 slide 91–99 + SWT3 101–103).
 * Công thức 5 bước của bài học: CFG → V(G) = E − N + 2 = số quyết định + 1 → min SC → min DC → viết test.
 */
import { doiDau, KHOA, hai, giai, lc, tn, kiemPhu, sach, preSo, preMa, svg } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const SN = {
  A: `if (a > 0) { x = 1; }\nelse if (a < 0) { x = -1; }\nelse { x = 0; }`,
  B: `if (p) x++;\nif (q) x++;\nif (r) x++;`,
  C: `let max = 0, i = 0;\nwhile (i < arr.length) {\n  if (arr[i] > max) max = arr[i];\n  i++;\n}`,
  D: `for (const x of arr) {\n  if (x % 2 === 0) {\n    if (x % 3 === 0) c6++;\n    else c2++;\n  }\n}`,
};
const E1 = tinhDe({
  tieuDe: 'Cyclomatic 1 — V(G), minimum statement and decision tests of four snippets',
  doKho: 'EASY', phut: 10,
  moTa: {
    en: `<p>For each snippet give V(G) (= number of binary decisions + 1), the minimum number of tests for 100% statement coverage and for 100% decision coverage. Inputs are free (any array, any values).</p>
<p><b>A</b></p>${preMa(SN.A)}<p><b>B</b></p>${preMa(SN.B)}<p><b>C</b></p>${preMa(SN.C)}<p><b>D</b></p>${preMa(SN.D)}`,
    vi: `<p>Với mỗi đoạn mã cho V(G) (= số quyết định nhị phân + 1), số test tối thiểu cho 100% statement coverage và cho 100% decision coverage. Input tuỳ chọn (mảng nào, giá trị nào cũng được).</p>
<p><b>A</b></p>${preMa(SN.A)}<p><b>B</b></p>${preMa(SN.B)}<p><b>C</b></p>${preMa(SN.C)}<p><b>D</b></p>${preMa(SN.D)}`,
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('V(G) · min SC · min DC', 'V(G) · SC tối thiểu · DC tối thiểu'),
    cot: [{ ma: 's', ten: 'Snippet' }, { ma: 'v', ten: 'V(G)' }, { ma: 'sc', ten: 'Min tests 100% SC' }, { ma: 'dc', ten: 'Min tests 100% DC' }],
    hang: ['A', 'B', 'C', 'D'].map((s) => ({ ma: s, o: { s } })),
    dapAn: { 'A.v': '3', 'A.sc': '3', 'A.dc': '3', 'B.v': '4', 'B.sc': '1', 'B.dc': '2', 'C.v': '3', 'C.sc': '1', 'C.dc': '1', 'D.v': '4', 'D.sc': '1', 'D.dc': '1' },
    giaiThich: giai('A: nested decisions — every test ends in a different leaf ⇒ SC = DC = V(G) = 3. B: sequential IFs — one all-True test runs every statement, all-True + all-False gives DC. C and D: a loop lets one call take every outcome (e.g. arr = [3, 1] for C; arr = [6, 2, 1] for D).', 'A: quyết định lồng — mỗi test kết thúc ở một lá khác ⇒ SC = DC = V(G) = 3. B: IF nối tiếp — một test toàn True chạy mọi câu lệnh, toàn True + toàn False cho DC. C, D: vòng lặp cho một lần gọi đi qua mọi kết quả (vd arr = [3, 1] cho C; arr = [6, 2, 1] cho D).'),
  }],
  goiY: ['V(G) = số hình thoi + 1 (vòng while/for cũng là một quyết định).', 'Quy tắc bài 5.2: lồng hoàn toàn ⇒ DC = V(G); nối tiếp ⇒ DC thường = 2; vòng lặp ⇒ một test làm được nhiều.'],
  loiHayGap: ['Quên tính điều kiện vòng lặp là một quyết định.', 'Cho rằng min DC luôn bằng V(G).'],
  giaiThich: '<p>A 3/3/3 · B 4/1/2 · C 3/1/1 · D 4/1/1. Rule: min SC ≤ min DC ≤ V(G).</p>',
  thuatNgu: tn('cyclomatic', 'statement', 'decision'),
  khaiNiem: ['cyclomatic complexity', 'minimum test set'],
});

/* CFG của countPass — dùng cho E2, E3 */
const COUNT_PASS = `int countPass(int[] scores, int passMark) {
    int pass = 0;
    for (int i = 0; i < scores.length; i++) {
        if (scores[i] < 0 || scores[i] > 10) {
            throw new IllegalArgumentException("score out of range");
        }
        if (scores[i] >= passMark) {
            pass++;
        }
    }
    return pass;
}`;
const CFG = svg({
  w: 560, h: 470, tieuDe: 'CFG of countPass (node numbers are used in the answers)',
  nut: [
    { id: '1', x: 200, y: 50, hinh: 'chu', nhan: '1  pass = 0; i = 0', rong: 150 },
    { id: '2', x: 200, y: 125, hinh: 'thoi', nhan: '2  i < length', rong: 120 },
    { id: '3', x: 200, y: 205, hinh: 'thoi', nhan: '3  out of range?', rong: 140 },
    { id: '4', x: 420, y: 205, hinh: 'chu', nhan: '4  throw', rong: 90 },
    { id: '5', x: 200, y: 285, hinh: 'thoi', nhan: '5  ≥ passMark?', rong: 130 },
    { id: '6', x: 360, y: 345, hinh: 'chu', nhan: '6  pass++', rong: 90 },
    { id: '7', x: 200, y: 400, hinh: 'chu', nhan: '7  i++', rong: 80 },
    { id: '8', x: 60, y: 205, hinh: 'chu', nhan: '8  return', rong: 80 },
    { id: '9', x: 60, y: 440, hinh: 'cuoi', nhan: '9', r: 16 },
  ],
  canh: [
    { tu: '1', den: '2' }, { tu: '2', den: '3', nhan: 'T' }, { tu: '2', den: '8', nhan: 'F' },
    { tu: '3', den: '4', nhan: 'T' }, { tu: '3', den: '5', nhan: 'F' },
    { tu: '5', den: '6', nhan: 'T' }, { tu: '5', den: '7', nhan: 'F' }, { tu: '6', den: '7' },
    { tu: '7', den: '2', qua: [[300, 400], [300, 125]] },
    { tu: '4', den: '9', qua: [[500, 205], [500, 440]] },
    { tu: '8', den: '9' },
  ],
});
const CANH = [[1, 2], [2, 3], [2, 8], [3, 4], [3, 5], [4, 9], [5, 6], [5, 7], [6, 7], [7, 2], [8, 9]];

const E2 = tinhDe({
  tieuDe: 'Cyclomatic 2 — Read the CFG: nodes, edges, V(G) and the minimum tests',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: `<p>The control-flow graph of <code>countPass</code> is drawn below (node 9 is the exit). Answer from the graph and the code.</p>${preSo(COUNT_PASS)}${CFG}`, vi: `<p>Đồ thị luồng điều khiển của <code>countPass</code> vẽ bên dưới (node 9 là điểm thoát). Trả lời theo đồ thị và mã.</p>${preSo(COUNT_PASS)}${CFG}` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Metrics of the CFG', 'Các chỉ số của CFG'),
    cot: [{ ma: 'm', ten: 'Metric' }, { ma: 'v', ten: 'Value' }],
    hang: [
      { ma: 'n', o: { m: 'Number of nodes N' } }, { ma: 'e', o: { m: 'Number of edges E' } }, { ma: 'p', o: { m: 'Number of decision (predicate) nodes P' } },
      { ma: 'v1', o: { m: 'V(G) = E − N + 2' } }, { ma: 'v2', o: { m: 'V(G) = P + 1' } },
      { ma: 'sc', o: { m: 'Minimum tests for 100% statement coverage' } }, { ma: 'dc', o: { m: 'Minimum tests for 100% decision coverage' } },
    ],
    dapAn: { 'n.v': '9', 'e.v': '11', 'p.v': '3', 'v1.v': '4', 'v2.v': '4', 'sc.v': '2', 'dc.v': '2' },
    giaiThich: giai('11 − 9 + 2 = 4 = 3 + 1. The throw ends a call, so it needs its own test; one more call such as scores = [3, 8], passMark = 5 takes every remaining outcome (loop True/False, range False, ≥ True and False). Min SC = min DC = 2 < V(G) = 4.', '11 − 9 + 2 = 4 = 3 + 1. Lệnh throw kết thúc lần gọi nên cần một test riêng; thêm một lần gọi như scores = [3, 8], passMark = 5 đi qua mọi kết quả còn lại. Min SC = min DC = 2 < V(G) = 4.'),
  }],
  goiY: ['Đếm cạnh theo mũi tên, kể cả cạnh quay lại 7 → 2 và hai cạnh vào node thoát 9.', 'Điều kiện ghép ở node 3 vẫn là MỘT quyết định khi đếm V(G) theo hình thoi.'],
  loiHayGap: ['Quên cạnh 7 → 2 (vòng lặp) ⇒ E = 10.', 'Cho rằng min DC = V(G) = 4 — vòng lặp cho phép một test đi nhiều nhánh.'],
  giaiThich: '<p>N 9 · E 11 · P 3 · V(G) 4 (both formulas) · min SC 2 · min DC 2.</p>',
  thuatNgu: tn('cfg', 'cyclomatic'),
  khaiNiem: ['control-flow graph', 'cyclomatic complexity'],
});

const E3 = jsDe({
  tieuDe: 'Cyclomatic 3 — Write the basis (linearly independent) paths of countPass',
  doKho: 'HARD', phut: 15,
  moTa: { en: `<p>V(G) is also the number of <b>basis paths</b>. List V(G) paths of the CFG above (node numbers, from 1 to 9) using the baseline method: each new path must add at least one edge that no earlier path used, and together they must cover every edge.</p>${CFG}<p>Edges: ${CANH.map(([a, b]) => `${a}→${b}`).join(', ')}.</p>`, vi: `<p>V(G) cũng là số <b>đường cơ sở</b> (basis path). Liệt kê V(G) đường của CFG trên (số node, từ 1 tới 9) theo phương pháp baseline: mỗi đường mới phải thêm ít nhất một cạnh chưa đường nào trước đó dùng, và gộp lại phải phủ mọi cạnh.</p>${CFG}<p>Các cạnh: ${CANH.map(([a, b]) => `${a}→${b}`).join(', ')}.</p>` },
  yeuCau: [{ en: '<code>PATHS = [[1, 2, 8, 9], …]</code> — exactly V(G) paths, each a valid walk from 1 to 9 (a loop may be taken).', vi: '<code>PATHS = [[1, 2, 8, 9], …]</code> — đúng V(G) đường, mỗi đường là một lối đi hợp lệ từ 1 tới 9 (được đi vòng).' }],
  viDu: [{ input: '[1, 2, 3, 4, 9]', output: 'a score out of range throws', explanation: 'Adds edges 2→3, 3→4, 4→9.|||Thêm cạnh 2→3, 3→4, 4→9.' }],
  goiY: ['Bắt đầu bằng đường ngắn nhất (mảng rỗng): 1 → 2 → 8 → 9.', 'Mỗi đường sau đổi MỘT quyết định so với đường trước: ném lỗi; điểm dưới chuẩn (5 → 7 → 2); điểm đạt (5 → 6 → 7).'],
  loiHayGap: ['Đường có hai node liền nhau không nối bằng cạnh (vd 5 → 9).', 'Viết 5 đường — số đường cơ sở đúng bằng V(G) = 4.'],
  giaiThich: '<p>1-2-8-9 (empty array) · 1-2-3-4-9 (invalid score) · 1-2-3-5-7-2-8-9 (one failing score) · 1-2-3-5-6-7-2-8-9 (one passing score). Every edge is used and each path adds a new edge.</p>',
  thuatNgu: [...tn('cfg', 'cyclomatic'), { en: 'basis path', vi: 'đường cơ sở — một trong V(G) đường độc lập tuyến tính phủ mọi cạnh' }],
  khaiNiem: ['basis path testing', 'cyclomatic complexity'],
  tep: {
    'answer.js': ['// Node numbers from the CFG. Each path starts at 1 and ends at 9.\nconst PATHS = [\n  [1, 2, 8, 9],\n];\n', '// V(G) = 4 basis paths; each adds at least one new edge.\nconst PATHS = [\n  [1, 2, 8, 9],                 // empty array\n  [1, 2, 3, 4, 9],              // a score out of range → throw\n  [1, 2, 3, 5, 7, 2, 8, 9],     // one score below passMark\n  [1, 2, 3, 5, 6, 7, 2, 8, 9],  // one passing score\n];\n'],
  },
  kiem: (() => {
    const chung = `const E = ${JSON.stringify(CANH.map(([a, b]) => `${a}>${b}`))};
      if (!Array.isArray(PATHS) || !PATHS.length) return 'PATHS must be an array of node arrays';
      for (let k = 0; k < PATHS.length; k++) { const p = PATHS[k]; if (!Array.isArray(p) || p[0] !== 1 || p[p.length - 1] !== 9) return 'path #' + (k + 1) + ' must start at 1 and end at 9'; for (let i = 1; i < p.length; i++) if (E.indexOf(p[i - 1] + '>' + p[i]) < 0) return 'path #' + (k + 1) + ': there is no edge ' + p[i - 1] + '→' + p[i]; }`;
    return [
      kiemTuy({ en: 'Every path is a valid walk from 1 to 9', vi: 'Mọi đường là lối đi hợp lệ từ 1 tới 9' }, new Function(`${chung} return 'OK';`)),
      kiemTuy({ en: 'Exactly V(G) = 4 paths', vi: 'Đúng V(G) = 4 đường' }, new Function(`${chung} return PATHS.length === 4 ? 'OK' : PATHS.length + ' paths — V(G) = E − N + 2 = 4';`)),
      kiemTuy({ en: 'Each path adds at least one new edge', vi: 'Mỗi đường thêm ít nhất một cạnh mới' }, new Function(`${chung} const da = new Set(); for (let k = 0; k < PATHS.length; k++) { const p = PATHS[k]; let moi = false; for (let i = 1; i < p.length; i++) { const e = p[i - 1] + '>' + p[i]; if (!da.has(e)) { moi = true; da.add(e); } } if (!moi) return 'path #' + (k + 1) + ' adds no new edge — it is not independent'; } return 'OK';`)),
      kiemTuy({ en: 'Together the paths cover all 11 edges', vi: 'Gộp lại các đường phủ đủ 11 cạnh' }, new Function(`${chung} const da = new Set(); PATHS.forEach((p) => { for (let i = 1; i < p.length; i++) da.add(p[i - 1] + '>' + p[i]); }); const thieu = E.filter((e) => !da.has(e)); return thieu.length ? 'edges not covered: ' + thieu.map((e) => e.replace('>', '→')).join(', ') : 'OK';`)),
    ];
  })(),
});

/* E4 — classifyTriangle, bộ tối thiểu + kỳ vọng theo đặc tả */
const CODE4 = `function classifyTriangle(a, b, c) {
  $s('S1'); if ($d('D1', a <= 0 || b <= 0 || c <= 0)) { $s('S2'); return 'INVALID'; }
  $s('S3'); if ($d('D2', a + b <= c || a + c <= b || b + c <= a)) { $s('S4'); return 'NOT_A_TRIANGLE'; }
  $s('S5'); if ($d('D3', a === b && b === c)) { $s('S6'); return 'EQUILATERAL'; }
  $s('S7'); if ($d('D4', a === b || b === c || a === c)) { $s('S8'); return 'ISOSCELES'; }
  $s('S9'); return 'SCALENE';
}`;
const E4 = jsDe({
  tieuDe: 'Cyclomatic 4 — The classic triangle: V(G) and the minimum test set',
  doKho: 'HARD', phut: 15,
  moTa: { en: `<p>The classic exercise of every testing course. Sides must be positive (<code>INVALID</code>); they must satisfy the triangle inequality (<code>NOT_A_TRIANGLE</code>); then the triangle is <code>EQUILATERAL</code>, <code>ISOSCELES</code> or <code>SCALENE</code>. Give V(G) and the minimum tests for 100% statement AND decision coverage, with the expected result of each.</p>${preSo(sach(CODE4))}`, vi: `<p>Bài kinh điển của mọi khoá kiểm thử. Cạnh phải dương (<code>INVALID</code>); phải thoả bất đẳng thức tam giác (<code>NOT_A_TRIANGLE</code>); rồi tam giác là <code>EQUILATERAL</code>, <code>ISOSCELES</code> hoặc <code>SCALENE</code>. Cho V(G) và số test tối thiểu cho 100% statement VÀ decision coverage, kèm kết quả mong đợi.</p>${preSo(sach(CODE4))}` },
  yeuCau: [{ en: '<code>VG = …</code> and <code>TESTS = [{ id, input: { a, b, c }, expected }]</code>.', vi: '<code>VG = …</code> và <code>TESTS = [{ id, input: { a, b, c }, expected }]</code>.' }],
  viDu: [{ input: '{ a: 3, b: 4, c: 5 }', output: "'SCALENE'", explanation: 'Every decision False.|||Mọi quyết định False.' }],
  goiY: ['Năm câu return loại trừ nhau ⇒ statement coverage cần 5 test.', 'Chuỗi IF có return sớm cư xử như IF lồng: DC = V(G) = 4 quyết định + 1.'],
  loiHayGap: ['Đếm mỗi điều kiện con (a <= 0, b <= 0…) thành một quyết định ⇒ V(G) sai (bài này đếm theo hình thoi).', 'Chọn (1, 2, 3) cho SCALENE — 1 + 2 = 3 nên là NOT_A_TRIANGLE.'],
  giaiThich: '<p>V(G) = 4 + 1 = 5; five tests, one per return: (0, 1, 1) INVALID · (1, 2, 3) NOT_A_TRIANGLE · (2, 2, 2) EQUILATERAL · (2, 2, 3) ISOSCELES · (3, 4, 5) SCALENE.</p>',
  thuatNgu: tn('cyclomatic', 'statement', 'decision'),
  khaiNiem: ['cyclomatic complexity', 'minimum test set'],
  tep: {
    'answer.js': [
      "const VG = 0;\n\nconst TESTS = [\n  { id: 'T1', input: { a: 3, b: 4, c: 5 }, expected: 'SCALENE' },\n];\n",
      "const VG = 5; // 4 decisions + 1\n\n// One test per return statement: SC = DC = V(G) = 5 (early returns behave like nested IFs).\nconst TESTS = [\n  { id: 'T1', input: { a: 0, b: 1, c: 1 }, expected: 'INVALID' },\n  { id: 'T2', input: { a: 1, b: 2, c: 3 }, expected: 'NOT_A_TRIANGLE' },\n  { id: 'T3', input: { a: 2, b: 2, c: 2 }, expected: 'EQUILATERAL' },\n  { id: 'T4', input: { a: 2, b: 2, c: 3 }, expected: 'ISOSCELES' },\n  { id: 'T5', input: { a: 3, b: 4, c: 5 }, expected: 'SCALENE' },\n];\n",
    ],
  },
  kiem: [
    kiemTuy({ en: 'V(G) is right', vi: 'V(G) đúng' }, new Function("return VG === 5 ? 'OK' : 'not right — count the decisions (diamonds) and add 1';")),
    ...kiemPhu({ code: CODE4, ham: 'classifyTriangle', thamSo: ['a', 'b', 'c'], do: { lenh: true, nhanh: true, toiThieu: 5, kyVong: true } }),
  ],
});

const E5 = tinhDe({
  tieuDe: 'Cyclomatic 5 — Questions on V(G) and minimum test sets',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions in the style of SWT4 slides 98–99 and the PE: compute V(G), compare it with the minimum test sets and interpret it.</p>', vi: '<p>Sáu câu theo kiểu slide SWT4 98–99 và đề PE: tính V(G), so với bộ test tối thiểu và diễn giải ý nghĩa.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A control-flow graph has 10 nodes and 12 edges. What is V(G)?', 'CFG có 10 node và 12 cạnh. V(G) là bao nhiêu?'), luaChon: lc(['a', '2'], ['b', '3'], ['c', '4'], ['d', '22']), dapAn: ['c'], giaiThich: giai('12 − 10 + 2 = 4 (the quiz-scoring example of SWT3).', '12 − 10 + 2 = 4 (ví dụ chấm bài trắc nghiệm của SWT3).') },
    { ma: 'q2', de: hai('Which relation always holds (when every basis path is feasible)?', 'Quan hệ nào luôn đúng (khi mọi basis path đều khả thi)?'), luaChon: lc(['a', 'min SC ≥ min DC'], ['b', 'min SC ≤ min DC ≤ V(G)'], ['c', 'min DC = V(G)'], ['d', 'V(G) ≤ min SC']), dapAn: ['b'], giaiThich: giai('Decision coverage includes statement coverage, and the V(G) basis paths cover every edge.', 'Decision coverage bao hàm statement coverage, và V(G) đường cơ sở phủ mọi cạnh.') },
    { ma: 'q3', de: hai('Three fully nested IF-ELSE decisions. Minimum tests for 100% decision coverage?', 'Ba quyết định IF-ELSE lồng hoàn toàn. Số test tối thiểu cho 100% decision coverage?'), luaChon: lc(['a', '2'], ['b', '3'], ['c', '4'], ['d', '8']), dapAn: ['c'], giaiThich: giai('Fully nested ⇒ every test ends in a different leaf: decisions + 1 = 4 = V(G).', 'Lồng hoàn toàn ⇒ mỗi test kết thúc ở một lá khác: số quyết định + 1 = 4 = V(G).') },
    { ma: 'q4', de: hai('What does V(G) count?', 'V(G) đếm cái gì?'), luaChon: lc(['a', 'The number of statements'], ['b', 'The number of linearly independent paths through the routine'], ['c', 'The number of all possible paths'], ['d', 'The number of defects']), dapAn: ['b'], giaiThich: giai('McCabe’s cyclomatic number = size of a basis set of paths.', 'Số chu trình McCabe = số đường trong một tập đường cơ sở.') },
    { ma: 'q5', de: hai('A function has a loop with two IFs inside it (V(G) = 4). How few tests can reach 100% decision coverage?', 'Hàm có một vòng lặp chứa hai IF (V(G) = 4). Ít nhất bao nhiêu test đạt 100% decision coverage?'), luaChon: lc(['a', '1'], ['b', '2'], ['c', '3'], ['d', '4']), dapAn: ['a'], giaiThich: giai('Successive iterations can take every outcome of both IFs, and the loop condition is True then False in the same call (countCharacters of FA23: V(G) = 5, one test).', 'Các lần lặp có thể đi mọi kết quả của cả hai IF, điều kiện lặp vừa True vừa False trong cùng một lần gọi (countCharacters đề FA23: V(G) = 5, một test).') },
    { ma: 'q6', de: hai('A method has V(G) = 23. What does this suggest?', 'Một phương thức có V(G) = 23. Điều này gợi ý gì?'), luaChon: lc(['a', 'It has 23 defects'], ['b', 'It is complex and hard to test thoroughly — a candidate for refactoring (McCabe’s usual threshold is 10)'], ['c', 'It needs exactly 23 statements'], ['d', 'Nothing — V(G) has no practical meaning']), dapAn: ['b'], giaiThich: giai('High cyclomatic complexity predicts more defects and more test effort; static analysis tools flag methods above ~10.', 'Độ phức tạp chu trình cao báo trước nhiều lỗi và tốn công test; công cụ phân tích tĩnh cảnh báo phương thức trên ~10.') },
  ],
  goiY: ['V(G) = E − N + 2 = P + 1.', 'min SC ≤ min DC ≤ V(G).'],
  loiHayGap: ['Cộng E + N.', 'Cho rằng V(G) = số test luôn luôn.'],
  giaiThich: '<p>Answers: c · b · c · b · a · b.</p>',
  thuatNgu: tn('cyclomatic'),
  khaiNiem: ['cyclomatic complexity'],
});

export default doiDau({
  slug: 'swt301-cyclomatic-complexity',
  ten: '5.2 Cyclomatic complexity & the minimum test set',
  moTaModule: 'Công thức 5 bước của bài 5.2: V(G) và số test tối thiểu SC/DC của bốn đoạn mã, đọc CFG (N, E, P, V(G)), viết basis path theo phương pháp baseline, bài tam giác kinh điển đo độ phủ thật, câu hỏi kiểu slide 98–99.',
  khoa: KHOA,
  baiHoc: 'swt301-cyclomatic-complexity',
  de: [E1, E2, E3, E4, E5],
});
