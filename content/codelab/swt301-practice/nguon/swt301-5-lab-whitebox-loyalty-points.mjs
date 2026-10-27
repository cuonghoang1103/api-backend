/**
 * SWT301 · LAB CHƯƠNG 5 — White-box: calcLoyaltyPoints (vòng lặp + điều kiện ghép + chặn trần).
 * A. chỉ số (quyết định, V(G), min SC/DC) · B. bộ DC tối thiểu có expected/status theo đặc tả · C. bộ MC/DC tối thiểu
 * · D. script test giết mutant. Mọi độ phủ đo THẬT trên mã đã gắn đo.
 */
import { doiDau, KHOA, TESTKIT_JS, kiemPhu, kiemKhoa, kiemDotBien, sach, preSo, svg, NOP_BAI, tn } from './_chung.mjs';

const JAVA = `public static int calcLoyaltyPoints(long[] orders, boolean isMember) {
    if (orders == null || orders.length == 0) return 0;
    int points = 0;
    for (int i = 0; i < orders.length; i++) {
        long amount = orders[i];
        if (amount <= 0) continue;
        int p = (int) (amount / 10000);
        if (isMember && amount > 500000) p = p * 2;
        points += p;
    }
    if (points > 1000) points = 1000;
    return points;
}`;
const DO = `function calcLoyaltyPoints(orders, isMember) {
  $s('S1'); if ($d('D1', $c('D1.A', !Array.isArray(orders)) || $c('D1.B', orders.length === 0))) { $s('S2'); return 0; }
  $s('S3'); let points = 0;
  $s('S4'); for (let i = 0; $d('D2', i < orders.length); i++) {
    $s('S5'); const amount = orders[i];
    $s('S6'); if ($d('D3', amount <= 0)) { $s('S7'); continue; }
    $s('S8'); let p = Math.floor(amount / 10000);
    $s('S9'); if ($d('D4', $c('D4.A', isMember) && $c('D4.B', amount > 500000))) { $s('S10'); p = p * 2; }
    $s('S11'); points += p;
  }
  $s('S12'); if ($d('D5', points > 1000)) { $s('S13'); points = 1000; }
  $s('S14'); return points;
}`;
function spec(orders, isMember) {
  if (!Array.isArray(orders) || orders.length === 0) return 0;
  let points = 0;
  for (const amount of orders) {
    if (amount <= 0) continue;
    let p = Math.floor(amount / 10000);
    if (isMember && amount >= 500000) p *= 2;
    points += p;
  }
  return Math.min(points, 1000);
}
const DUNG = `function calcLoyaltyPoints(orders, isMember) {
  if (!Array.isArray(orders) || orders.length === 0) return 0;
  let points = 0;
  for (let i = 0; i < orders.length; i++) {
    const amount = orders[i];
    if (amount <= 0) continue;
    let p = Math.floor(amount / 10000);
    if (isMember && amount >= 500000) p = p * 2;
    points += p;
  }
  if (points > 1000) points = 1000;
  return points;
}`;
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant lab5: ' + a); return DUNG.replace(a, b); };
const DOT_BIEN = [
  { ma: 'M1', moTa: { en: 'members are doubled only ABOVE 500,000 (the defect of the code)', vi: 'thành viên chỉ được nhân đôi TRÊN 500.000 (chính lỗi của mã)' }, code: doi('amount >= 500000', 'amount > 500000') },
  { ma: 'M2', moTa: { en: 'no 1,000-point cap', vi: 'không chặn trần 1.000 điểm' }, code: doi('  if (points > 1000) points = 1000;\n', '') },
  { ma: 'M3', moTa: { en: 'non-positive amounts are not skipped', vi: 'không bỏ qua số tiền ≤ 0' }, code: doi('    if (amount <= 0) continue;\n', '') },
  { ma: 'M4', moTa: { en: 'non-members are doubled too (|| instead of &&)', vi: 'người không phải thành viên cũng được nhân đôi (|| thay &&)' }, code: doi('isMember && amount', 'isMember || amount') },
  { ma: 'M5', moTa: { en: 'points are rounded instead of truncated', vi: 'điểm làm tròn thay vì cắt phần lẻ' }, code: doi('Math.floor(amount / 10000)', 'Math.round(amount / 10000)') },
  { ma: 'M6', an: true, moTa: { en: 'an empty list returns -1', vi: 'danh sách rỗng trả -1' }, code: doi('return 0;', 'return orders == null ? 0 : -1;') },
];

const CFG = svg({
  w: 600, h: 520, tieuDe: 'CFG of calcLoyaltyPoints (L = line)',
  nut: [
    { id: 'd2', x: 220, y: 45, hinh: 'thoi', nhan: 'L2', rong: 80 }, { id: 'r2', x: 420, y: 45, hinh: 'chu', nhan: 'return 0', rong: 90 },
    { id: 's3', x: 220, y: 105, hinh: 'chu', nhan: 'L3 points = 0', rong: 120 },
    { id: 'd4', x: 220, y: 170, hinh: 'thoi', nhan: 'L4 loop', rong: 90 },
    { id: 's5', x: 220, y: 235, hinh: 'chu', nhan: 'L5 amount', rong: 90 },
    { id: 'd6', x: 220, y: 300, hinh: 'thoi', nhan: 'L6', rong: 80 },
    { id: 's7', x: 220, y: 365, hinh: 'chu', nhan: 'L7 p = amount/10000', rong: 150 },
    { id: 'd8', x: 220, y: 430, hinh: 'thoi', nhan: 'L8', rong: 80 }, { id: 's8', x: 420, y: 430, hinh: 'chu', nhan: 'p = p * 2', rong: 90 },
    { id: 's9', x: 420, y: 490, hinh: 'chu', nhan: 'L9 points += p', rong: 120 },
    { id: 'd11', x: 70, y: 300, hinh: 'thoi', nhan: 'L11', rong: 70 }, { id: 's11', x: 70, y: 400, hinh: 'chu', nhan: 'cap 1000', rong: 90 },
    { id: 'r12', x: 70, y: 480, hinh: 'chu', nhan: 'L12 return', rong: 90 },
  ],
  canh: [
    { tu: 'd2', den: 'r2', nhan: 'T' }, { tu: 'd2', den: 's3', nhan: 'F' }, { tu: 's3', den: 'd4' },
    { tu: 'd4', den: 's5', nhan: 'T' }, { tu: 'd4', den: 'd11', nhan: 'F' }, { tu: 's5', den: 'd6' },
    { tu: 'd6', den: 's7', nhan: 'F' }, { tu: 'd6', den: 'd4', nhan: 'T continue', cong: 60 },
    { tu: 's7', den: 'd8' }, { tu: 'd8', den: 's8', nhan: 'T' }, { tu: 'd8', den: 's9', nhan: 'F' }, { tu: 's8', den: 's9' },
    { tu: 's9', den: 'd4', qua: [[560, 490], [560, 170]] },
    { tu: 'd11', den: 's11', nhan: 'T' }, { tu: 'd11', den: 'r12', nhan: 'F', qua: [[15, 300], [15, 480]] }, { tu: 's11', den: 'r12' },
  ],
});

const thamSo = ['orders', 'isMember'];
const KIEM = [
  ...kiemKhoa([
    { moTa: { en: 'A — number of decisions', vi: 'A — số quyết định' }, bieuThuc: 'METRICS.decisions', chap: [5], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — V(G)', vi: 'A — V(G)' }, bieuThuc: 'METRICS.vg', chap: [6], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — minimum tests for 100% statement coverage', vi: 'A — số test tối thiểu cho 100% statement' }, bieuThuc: 'METRICS.minSC', chap: [2], kieu: 'so', nhom: 'f1', goiY: 'one call can run every statement except "return 0"' },
    { moTa: { en: 'A — minimum tests for 100% decision coverage', vi: 'A — số test tối thiểu cho 100% decision' }, bieuThuc: 'METRICS.minDC', chap: [3], kieu: 'so', nhom: 'f1', goiY: 'line 11 is evaluated once per call' },
  ]),
  ...kiemPhu({
    code: DO, ham: 'calcLoyaltyPoints', thamSo, spec: spec.toString(), bien: 'DC_TESTS',
    do: { lenh: true, nhanh: true, toiThieu: 3, kyVong: true, trangThai: true },
    nhom: 'f2',
  }),
  ...kiemPhu({
    code: DO, ham: 'calcLoyaltyPoints', thamSo, spec: spec.toString(), bien: 'MCDC_TESTS',
    do: { lenh: true, nhanh: true, mcdc: ['D1', 'D4'], toiThieu: 4, kyVong: true },
    nhom: 'f3',
  }),
  ...kiemDotBien({ ten: ['calcLoyaltyPoints'], dung: DUNG, dotBien: DOT_BIEN, minTest: 6, nhom: 'f4' }),
];

const BAN_IN = {
  tieuDe: 'Lab 5 — White-box Unit Testing of calcLoyaltyPoints',
  phu: { en: 'Chapter 5 lab · CFG and V(G) · minimum SC / DC / MC/DC sets measured on instrumented code · JUnit-style script vs mutants · 10 marks', vi: 'Lab chương 5 · CFG và V(G) · bộ SC / DC / MC/DC tối thiểu đo trên mã gắn đo · script kiểu JUnit đấu mutant · 10 điểm' },
  moTa: {
    en: `<p><b>Specification.</b> A shop awards loyalty points: every order earns <b>1 point per full 10,000 VND</b>; members earn <b>double</b> on orders of <b>500,000 VND or more</b>; orders with a non-positive amount are ignored; the total is <b>capped at 1,000</b>; a null or empty order list gives 0.</p>
<p>This is the white-box variant of Lab 2 done in depth: you work from the code, measure what your tests exercise, and prove that coverage alone is not enough by killing mutants.</p>${preSo(JAVA)}${CFG}`,
    vi: `<p><b>Đặc tả.</b> Cửa hàng tặng điểm thân thiết: mỗi đơn được <b>1 điểm cho mỗi 10.000 đ trọn</b>; thành viên được <b>gấp đôi</b> với đơn <b>từ 500.000 đ</b>; đơn có số tiền không dương bị bỏ qua; tổng <b>tối đa 1.000 điểm</b>; danh sách null hoặc rỗng cho 0.</p>
<p>Đây là biến thể white-box của Lab 2 làm sâu: bạn làm việc từ mã, đo test đã chạy qua những gì, và chứng minh độ phủ thôi là chưa đủ bằng cách giết mutant.</p>${preSo(JAVA)}${CFG}`,
  },
  chucNangChinh: [
    { en: 'A. CFG metrics: decisions, V(G), minimum SC and DC.', vi: 'A. Chỉ số CFG: số quyết định, V(G), SC và DC tối thiểu.' },
    { en: 'B. The minimum decision-coverage UTCID set, expected values from the spec, P/F against the code.', vi: 'B. Bộ UTCID decision coverage tối thiểu, giá trị mong đợi theo đặc tả, P/F so với mã.' },
    { en: 'C. The minimum MC/DC set for the two compound conditions.', vi: 'C. Bộ MC/DC tối thiểu cho hai điều kiện ghép.' },
    { en: 'D. A unit-test script that kills the mutants.', vi: 'D. Script unit test giết các mutant.' },
  ],
  yeuCauChung: [
    { en: 'Inputs are JavaScript values: <code>orders</code> is an array of numbers (or <code>null</code>), <code>isMember</code> a boolean.', vi: 'Input là giá trị JavaScript: <code>orders</code> là mảng số (hoặc <code>null</code>), <code>isMember</code> là boolean.' },
    { en: 'Count V(G) by decisions (diamonds): a compound condition is one decision.', vi: 'Đếm V(G) theo quyết định (hình thoi): điều kiện ghép là một quyết định.' },
  ],
  cayThuMuc: `answers/
├── a-metrics.js    ← const METRICS = { decisions, vg, minSC, minDC }
├── b-dc.js         ← const DC_TESTS = [ { id, input: { orders, isMember }, expected, status } ]
├── c-mcdc.js       ← const MCDC_TESTS = [ { id, input: { orders, isMember }, expected } ]
└── d-tests.js      ← describe / test / expect — calls calcLoyaltyPoints(orders, isMember)
lib/testkit.js      (given)`,
  moHinh: {
    ten: 'UTCID object',
    truong: [
      ['input.orders', 'number[] | null', { en: 'order amounts in VND', vi: 'số tiền các đơn (VND)' }],
      ['input.isMember', 'boolean', { en: 'member flag', vi: 'cờ thành viên' }],
      ['expected', 'number', { en: 'points according to the SPECIFICATION', vi: 'số điểm theo ĐẶC TẢ' }],
      ['status', '"P" | "F"', { en: 'Part B only — does the CODE return the expected value?', vi: 'chỉ Phần B — MÃ có trả đúng giá trị mong đợi không?' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. CFG metrics', vi: 'A. Chỉ số CFG' }, diem: 2, yeuCau: [{ en: 'Number of decisions, V(G), minimum tests for 100% statement and for 100% decision coverage.', vi: 'Số quyết định, V(G), số test tối thiểu cho 100% statement và 100% decision.' }], hook: ['V(G)'] },
    { ten: { en: 'B. Minimum decision-coverage set', vi: 'B. Bộ decision coverage tối thiểu' }, diem: 3, yeuCau: [{ en: '100% statement and decision coverage with the minimum number of UTCIDs; expected values from the spec; status P/F as the code behaves.', vi: '100% statement và decision coverage với số UTCID tối thiểu; giá trị mong đợi theo đặc tả; status P/F theo hành vi của mã.' }], hook: ['C0', 'C1'] },
    { ten: { en: 'C. Minimum MC/DC set', vi: 'C. Bộ MC/DC tối thiểu' }, diem: 2.5, yeuCau: [{ en: 'MC/DC for line 2 (<code>orders == null || orders.length == 0</code>) and line 8 (<code>isMember &amp;&amp; amount &gt; 500000</code>) plus 100% decision coverage, minimum number of tests.', vi: 'MC/DC cho dòng 2 và dòng 8 cộng 100% decision coverage, số test tối thiểu.' }], hook: ['MC/DC'] },
    { ten: { en: 'D. Unit-test script vs mutants', vi: 'D. Script unit test đấu mutant' }, diem: 2.5, yeuCau: [{ en: 'At least 6 tests on the CORRECT implementation (members doubled from 500,000); kill the 6 mutants — one of them is exactly the defect of the code above.', vi: 'Ít nhất 6 test trên bản ĐÚNG (thành viên gấp đôi từ 500.000); giết 6 mutant — một trong số đó chính là lỗi của mã ở trên.' }], hook: ['mutation testing'] },
  ],
  idBatBuoc: [['METRICS', 'answers/a-metrics.js'], ['DC_TESTS', 'answers/b-dc.js'], ['MCDC_TESTS', 'answers/c-mcdc.js'], ['calcLoyaltyPoints (injected)', 'answers/d-tests.js']],
  truDiem: [
    { en: 'Counting the loop as “not a decision” (V(G) = 5).', vi: 'Không tính vòng lặp là quyết định (V(G) = 5).' },
    { en: 'Part B: four tests because “each decision needs its own test” — a loop lets one call take many outcomes.', vi: 'Phần B: bốn test vì “mỗi quyết định một test” — vòng lặp cho một lần gọi đi nhiều nhánh.' },
    { en: 'Part C: forgetting a non-member call — <code>isMember</code> is fixed per call, so (F, ·) needs its own test.', vi: 'Phần C: quên lần gọi không phải thành viên — <code>isMember</code> cố định mỗi lần gọi, nên (F, ·) cần test riêng.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-5-lab-whitebox-loyalty-points',
  ten: 'Lab 5 — White-box Unit Testing (calcLoyaltyPoints)',
  moTaModule: 'Lab chương 5 dạng bản in: calcLoyaltyPoints (vòng lặp, hai điều kiện ghép, chặn trần) — chỉ số CFG/V(G), bộ DC tối thiểu có P/F, bộ MC/DC tối thiểu (đo thật), script kiểu JUnit giết 6 mutant.',
  khoa: KHOA,
  baiHoc: 'swt301-cyclomatic-complexity',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 5 — White-box Unit Testing of calcLoyaltyPoints',
    doKho: 'HARD', phut: 100, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'calcLoyaltyPoints([500000], true)', output: 'spec: 100 points (doubled from 500,000) · code: 50 (line 8 uses >)', explanation: 'A test at the boundary exposes the defect; status F.|||Test ở biên làm lộ lỗi; status F.' }],
    khaiNiem: ['control-flow graph', 'cyclomatic complexity', 'statement coverage', 'decision coverage', 'MC/DC', 'mutation testing'],
    tienQuyet: ['SWT301 5.1–5.2'],
    the: ['swt301', 'lab', 'white-box'],
    banIn: BAN_IN,
    thuatNgu: tn('cfg', 'cyclomatic', 'statement', 'decision', 'mcdc', 'mutant', 'kill', 'expected', 'utcid'),
    goiY: [
      'A: quyết định ở dòng 2, 4 (vòng lặp), 6, 8, 11 ⇒ 5 ⇒ V(G) = 6. SC: [] + một lần gọi thành viên với [-1, 6000000]. DC: dòng 11 cần True và False ⇒ hai lần gọi không rỗng + một lần rỗng.',
      'B: ví dụ [] ; thành viên [-5000, 600000, 20000] (122 điểm, không chạm trần) ; không thành viên [20000000] (chạm trần).',
      'C: MC/DC dòng 2 cần null VÀ [] (mỗi vế đúng một mình); dòng 8 cần (T,T), (T,F) — cùng một lần gọi thành viên — và (F,·) — một lần gọi không phải thành viên.',
      'D: mutant M1 chỉ chết khi có test đúng 500.000 cho thành viên.',
    ],
    loiHayGap: [
      'Lấy expected từ mã: thành viên mua đúng 500.000 ⇒ ghi 50 điểm — đặc tả nói 100.',
      'Dùng số tiền tròn 10.000 cho mọi đơn — mutant làm tròn (M5) sống sót.',
      'Viết MC/DC dòng 2 chỉ bằng null — vế orders.length == 0 chưa bao giờ quyết định kết quả.',
    ],
    moTaNgan: 'Lab chương 5: white-box calcLoyaltyPoints — V(G), bộ SC/DC/MC/DC tối thiểu đo thật, script giết mutant.',
    giaiThich: {
      en: '<p><b>A.</b> 5 decisions, V(G) = 6, min SC = 2, min DC = 3. <b>B.</b> [] → 0 · member [-5000, 600000, 20000] → 122 · non-member [20000000] → 1000. <b>C.</b> null → 0 · [] → 0 · member [-5000, 600000, 20000] → 122 (line 8 (T,T) and (T,F)) · non-member [20000000] → 1000 (line 8 (F,·), cap). <b>D.</b> Values at 499,999 / 500,000 for members, a non-member big order, a negative amount, a non-round amount and a total above 1,000 kill all mutants.</p>',
      vi: '<p><b>A.</b> 5 quyết định, V(G) = 6, SC tối thiểu 2, DC tối thiểu 3. <b>B.</b> ba test như trên. <b>C.</b> bốn test: null, [], thành viên, không thành viên. <b>D.</b> biên 499.999 / 500.000, đơn lớn không thành viên, số âm, số lẻ và tổng trên 1.000 giết mọi mutant.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['lib/testkit.js', 'answers/a-metrics.js', 'answers/b-dc.js', 'answers/c-mcdc.js', 'answers/d-tests.js'], kiem: KIEM },
    khoiDau: {
      'answers/a-metrics.js': 'const METRICS = { decisions: 0, vg: 0, minSC: 0, minDC: 0 };\n',
      'answers/b-dc.js': "// Minimum set for 100% statement + decision coverage. expected = SPEC; status = what the CODE does.\nconst DC_TESTS = [\n  { id: 'UTCID01', input: { orders: [], isMember: false }, expected: 0, status: 'P' },\n];\n",
      'answers/c-mcdc.js': "// Minimum set for MC/DC of lines 2 and 8 (+ 100% decision coverage).\nconst MCDC_TESTS = [\n  { id: 'UTCID01', input: { orders: null, isMember: false }, expected: 0 },\n];\n",
      'answers/d-tests.js': "// Unit tests for the CORRECT calcLoyaltyPoints (members doubled from 500,000).\ntest('an empty list gives 0', () => {\n  expect(calcLoyaltyPoints([], true)).toBe(0);\n});\n",
      'lib/testkit.js': TESTKIT_JS,
    },
    loiGiai: {
      'answers/a-metrics.js': '// Decisions at lines 2, 4 (loop), 6, 8, 11.\nconst METRICS = { decisions: 5, vg: 6, minSC: 2, minDC: 3 };\n',
      'answers/b-dc.js': "// 3 tests: line 11 is evaluated once per call, so True and False need two non-empty calls.\nconst DC_TESTS = [\n  { id: 'UTCID01', input: { orders: [], isMember: false }, expected: 0, status: 'P' },\n  { id: 'UTCID02', input: { orders: [-5000, 600000, 20000], isMember: true }, expected: 122, status: 'P' },  // skip, double, normal; no cap\n  { id: 'UTCID03', input: { orders: [20000000], isMember: false }, expected: 1000, status: 'P' },            // cap\n];\n",
      'answers/c-mcdc.js': "// MC/DC line 2: null (A alone) and [] (B alone). Line 8: (T,T) + (T,F) in one member call, (F,·) in a non-member call.\nconst MCDC_TESTS = [\n  { id: 'UTCID01', input: { orders: null, isMember: false }, expected: 0 },\n  { id: 'UTCID02', input: { orders: [], isMember: false }, expected: 0 },\n  { id: 'UTCID03', input: { orders: [-5000, 600000, 20000], isMember: true }, expected: 122 },\n  { id: 'UTCID04', input: { orders: [20000000], isMember: false }, expected: 1000 },\n];\n",
      'answers/d-tests.js': `// Tests derived from the specification — they pass on the correct code and kill every mutant.
describe('calcLoyaltyPoints', () => {
  test('null and empty lists give 0', () => {
    expect(calcLoyaltyPoints(null, true)).toBe(0);
    expect(calcLoyaltyPoints([], true)).toBe(0);
  });
  test('1 point per FULL 10,000 VND (25,000 → 2)', () => {
    expect(calcLoyaltyPoints([25000], false)).toBe(2);
  });
  test('non-positive amounts are ignored', () => {
    expect(calcLoyaltyPoints([-50000, 0, 30000], false)).toBe(3);
  });
  test.each([
    [499999, 49],    // below the threshold: not doubled
    [500000, 100],   // exactly 500,000: doubled
  ])('member order of %i earns %i', (amount, points) => {
    expect(calcLoyaltyPoints([amount], true)).toBe(points);
  });
  test('non-members are never doubled', () => {
    expect(calcLoyaltyPoints([600000], false)).toBe(60);
  });
  test('the total is capped at 1,000', () => {
    expect(calcLoyaltyPoints([20000000], false)).toBe(1000);
  });
});
`,
      'lib/testkit.js': TESTKIT_JS,
    },
    thamKhao: 'https://junit.org/junit5/docs/current/user-guide/',
    boYeu: [
      { ten: 'B có 4 test (dư)', tep: { 'answers/b-dc.js': "const DC_TESTS = [\n  { id: 'UTCID01', input: { orders: [], isMember: false }, expected: 0, status: 'P' },\n  { id: 'UTCID02', input: { orders: [-5000, 600000, 20000], isMember: true }, expected: 122, status: 'P' },\n  { id: 'UTCID03', input: { orders: [20000000], isMember: false }, expected: 1000, status: 'P' },\n  { id: 'UTCID04', input: { orders: [50000], isMember: false }, expected: 5, status: 'P' },\n];\n" }, phaiTruot: ['Minimal set'] },
      { ten: 'C thiếu lần gọi không phải thành viên', tep: { 'answers/c-mcdc.js': "const MCDC_TESTS = [\n  { id: 'UTCID01', input: { orders: null, isMember: false }, expected: 0 },\n  { id: 'UTCID02', input: { orders: [], isMember: false }, expected: 0 },\n  { id: 'UTCID03', input: { orders: [-5000, 600000, 20000], isMember: true }, expected: 122 },\n  { id: 'UTCID04', input: { orders: [20000000], isMember: true }, expected: 1000 },\n];\n" }, phaiTruot: ['MC/DC for the compound decision on line 8'] },
      { ten: 'D không test biên 500.000', tep: { 'answers/d-tests.js': "test('a', () => { expect(calcLoyaltyPoints(null, true)).toBe(0); expect(calcLoyaltyPoints([], true)).toBe(0); });\ntest('b', () => expect(calcLoyaltyPoints([25000], false)).toBe(2));\ntest('c', () => expect(calcLoyaltyPoints([-50000, 0, 30000], false)).toBe(3));\ntest('d', () => expect(calcLoyaltyPoints([600000], true)).toBe(120));\ntest('e', () => expect(calcLoyaltyPoints([600000], false)).toBe(60));\ntest('f', () => expect(calcLoyaltyPoints([20000000], false)).toBe(1000));\n" }, phaiTruot: ['Kills mutant M1'] },
    ],
  }],
});
