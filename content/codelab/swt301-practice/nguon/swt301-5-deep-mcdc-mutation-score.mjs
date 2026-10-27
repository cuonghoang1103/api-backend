/**
 * SWT301 · DEEP LAB CHƯƠNG 5 — vượt syllabus: condition vs decision coverage, multiple condition coverage, MC/DC có ngắn mạch
 * (đo thật), mutation score (mutant tương đương) và nâng bộ test yếu thành bộ giết mọi mutant không tương đương.
 */
import { doiDau, KHOA, TESTKIT_JS, kiemPhu, kiemKhoa, kiemDotBien, sach, preSo, preMa, bangHtml, NOP_BAI, tn } from './_chung.mjs';
import { kiemTuy } from './_de.mjs';

/* A — điều kiện ghép (A || B) && C */
const DO_A = `function withdrawAllowed(balance, amount, dailyUsed, isVip, isFrozen) {
  $s('S1'); if ($d('D1', amount <= 0)) { $s('S2'); return 'INVALID'; }
  $s('S3'); if ($d('D2', isFrozen)) { $s('S4'); return 'FROZEN'; }
  $s('S5'); const limit = isVip ? 50000000 : 10000000;
  $s('S6'); if ($d('D3', ($c('D3.A', amount <= balance) || $c('D3.B', isVip)) && $c('D3.C', dailyUsed + amount <= limit))) { $s('S7'); return 'OK'; }
  $s('S8'); return 'DENIED';
}`;
const kA = [
  ...kiemKhoa([
    { moTa: { en: 'A — number of atomic conditions in the decision on line 5', vi: 'A — số điều kiện con của quyết định dòng 5' }, bieuThuc: 'PART_A.conditions', chap: [3], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — combinations needed for multiple condition coverage', vi: 'A — số tổ hợp cho multiple condition coverage' }, bieuThuc: 'PART_A.multipleConditionCombinations', chap: [8], kieu: 'so', nhom: 'f1' },
    { moTa: { en: 'A — minimum tests for MC/DC of that decision', vi: 'A — số test tối thiểu cho MC/DC của quyết định đó' }, bieuThuc: 'PART_A.minMCDC', chap: [4], kieu: 'so', nhom: 'f1' },
  ]),
  kiemTuy({ en: 'A — two vectors with 100% condition coverage but NOT 100% decision coverage', vi: 'A — hai vector đạt 100% condition coverage nhưng KHÔNG đạt 100% decision coverage' }, new Function(`const v = PART_A.conditionNotDecision;
    if (!Array.isArray(v) || v.length !== 2 || v.some((x) => !Array.isArray(x) || x.length !== 3 || x.some((y) => typeof y !== 'boolean'))) return 'conditionNotDecision must be two [A, B, C] boolean vectors';
    const f = (x) => (x[0] || x[1]) && x[2];
    for (let i = 0; i < 3; i++) if (v[0][i] === v[1][i]) return 'condition ' + 'ABC'[i] + ' must be True in one vector and False in the other';
    return f(v[0]) === f(v[1]) ? 'OK' : 'the decision outcome differs, so decision coverage is reached too — pick vectors with the SAME outcome';`), { nhom: 'f1' }),
  ...kiemPhu({
    code: DO_A, ham: 'withdrawAllowed', thamSo: ['balance', 'amount', 'dailyUsed', 'isVip', 'isFrozen'], bien: 'MCDC',
    do: { lenh: false, nhanh: false, mcdc: ['D3'], toiThieu: 4, kyVong: true },
    nhom: 'f1',
  }),
];

/* B — mutation score */
const SHIP = `function shippingFee(weight) {            // weight in kg
  if (weight <= 0) throw new RangeError('weight must be positive');
  if (weight <= 2) return 15000;
  if (weight <= 10) return 20000 + Math.ceil(weight - 2) * 5000;
  return 70000;
}`;
const MUT_B = [
  ['M1', 'line 3: weight <= 2  →  weight < 2'], ['M2', 'line 4: weight <= 10  →  weight < 10'],
  ['M3', 'line 4: * 5000  →  * 4000'], ['M4', 'line 5: return 70000  →  return 75000'],
  ['M5', 'line 4: Math.ceil(weight - 2)  →  Math.floor(weight - 2)'], ['M6', 'line 2: weight <= 0  →  weight < 0'],
  ['M7', 'line 4: Math.ceil(weight - 2)  →  Math.ceil(weight) - 2'], ['M8', 'line 3: return 15000  →  return 18000'],
];
const kB = [
  kiemTuy({ en: 'B — the killed mutants', vi: 'B — các mutant bị giết' }, new Function("if (!Array.isArray(PART_B.killed)) return 'killed must be an array of mutant ids'; const a = [...new Set(PART_B.killed.map(String))].sort().join(','); return a === 'M3,M4,M8' ? 'OK' : 'not right — run each mutant against the three given tests';"), { nhom: 'f2' }),
  kiemTuy({ en: 'B — the equivalent mutant', vi: 'B — mutant tương đương' }, new Function("if (!Array.isArray(PART_B.equivalent)) return 'equivalent must be an array'; return PART_B.equivalent.map(String).join(',') === 'M7' ? 'OK' : 'not right — which change can never produce a different result, for ANY weight?';"), { nhom: 'f2' }),
  ...kiemKhoa([{ moTa: { en: 'B — mutation score % (2 decimals)', vi: 'B — mutation score % (2 chữ số)' }, bieuThuc: 'PART_B.score', chap: [42.86], kieu: 'so', saiSo: 0.006, nhom: 'f2', goiY: 'killed ÷ (all mutants − equivalent mutants) × 100' }]),
];

/* C — nâng bộ test */
const DUNG_C = `function shippingFee(weight) {
  if (weight <= 0) throw new RangeError('weight must be positive');
  if (weight <= 2) return 15000;
  if (weight <= 10) return 20000 + Math.ceil(weight - 2) * 5000;
  return 70000;
}`;
const doi = (a, b) => { if (!DUNG_C.includes(a)) throw new Error('mutant deep5: ' + a); return DUNG_C.replace(a, b); };
const kC = kiemDotBien({
  ten: ['shippingFee'], dung: DUNG_C, minTest: 6, nhom: 'f3',
  dotBien: [
    { ma: 'M1', moTa: { en: 'weight < 2', vi: 'weight < 2' }, code: doi('weight <= 2', 'weight < 2') },
    { ma: 'M2', moTa: { en: 'weight < 10', vi: 'weight < 10' }, code: doi('weight <= 10', 'weight < 10') },
    { ma: 'M3', moTa: { en: '* 4000', vi: '* 4000' }, code: doi('* 5000', '* 4000') },
    { ma: 'M4', moTa: { en: 'return 75000', vi: 'return 75000' }, code: doi('return 70000', 'return 75000') },
    { ma: 'M5', moTa: { en: 'Math.floor instead of Math.ceil', vi: 'Math.floor thay Math.ceil' }, code: doi('Math.ceil', 'Math.floor') },
    { ma: 'M6', moTa: { en: 'weight < 0 (zero accepted)', vi: 'weight < 0 (nhận 0)' }, code: doi('weight <= 0', 'weight < 0') },
    { ma: 'M8', moTa: { en: 'return 18000', vi: 'return 18000' }, code: doi('return 15000;', 'return 18000;') },
  ],
});

const BAN_IN = {
  tieuDe: 'Deep Lab 5 — Beyond Decision Coverage: MC/DC, Multiple Conditions and Mutation Score',
  phu: { en: 'Beyond the syllabus · condition vs decision coverage · MC/DC with short-circuit · mutation score · 10 marks', vi: 'Vượt syllabus · condition vs decision coverage · MC/DC có ngắn mạch · mutation score · 10 điểm' },
  moTa: {
    en: '<p>Decision coverage is the ceiling of the CTFL syllabus, not of professional practice. Aviation (DO-178C level A) requires <b>MC/DC</b>; modern teams measure test-suite strength with <b>mutation testing</b> (PIT for Java, Stryker for JavaScript). This lab gives you both, measured for real.</p>',
    vi: '<p>Decision coverage là trần của syllabus CTFL, không phải trần của nghề. Hàng không (DO-178C mức A) bắt buộc <b>MC/DC</b>; các nhóm hiện đại đo độ mạnh bộ test bằng <b>mutation testing</b> (PIT cho Java, Stryker cho JavaScript). Lab này cho bạn cả hai, đo thật.</p>',
  },
  chucNangChinh: [
    { en: 'A. Coverage criteria of a compound decision: condition, multiple condition, MC/DC.', vi: 'A. Các tiêu chí phủ của quyết định ghép: condition, multiple condition, MC/DC.' },
    { en: 'B. Mutation analysis of a given suite: killed, survived, equivalent, score.', vi: 'B. Phân tích đột biến của bộ test có sẵn: bị giết, sống sót, tương đương, điểm.' },
    { en: 'C. Strengthen the suite until every non-equivalent mutant dies.', vi: 'C. Nâng bộ test tới khi mọi mutant không tương đương đều chết.' },
  ],
  yeuCauChung: [{ en: 'Short-circuit evaluation applies (Java/JavaScript): a condition that is not evaluated may differ inside an MC/DC pair.', vi: 'Có đánh giá ngắn mạch (Java/JavaScript): điều kiện không được đánh giá được phép khác nhau trong cặp MC/DC.' }],
  cayThuMuc: `answers/
├── a-conditions.js   ← const PART_A = { conditions, multipleConditionCombinations, minMCDC, conditionNotDecision }; const MCDC = [...]
├── b-mutation.js     ← const PART_B = { killed: [...], equivalent: [...], score }
└── c-tests.js        ← describe / test / expect — calls shippingFee(weight)
lib/testkit.js        (given)`,
  moHinh: {
    ten: 'Inputs',
    truong: [
      ['withdrawAllowed(balance, amount, dailyUsed, isVip, isFrozen)', 'VND, VND, VND, boolean, boolean', { en: 'returns INVALID · FROZEN · OK · DENIED', vi: 'trả INVALID · FROZEN · OK · DENIED' }],
      ['shippingFee(weight)', 'kg (decimal allowed)', { en: '≤ 2 kg: 15,000 · 2–10 kg: 20,000 + 5,000 per started kg above 2 · > 10 kg: 70,000 · ≤ 0: RangeError', vi: '≤ 2 kg: 15.000 · 2–10 kg: 20.000 + 5.000 mỗi kg bắt đầu trên 2 · > 10 kg: 70.000 · ≤ 0: RangeError' }],
    ],
  },
  chucNang: [
    {
      ten: { en: 'A. Compound decision coverage', vi: 'A. Phủ quyết định ghép' }, diem: 4,
      moTa: { en: `<p>Line 5 decides whether a withdrawal is allowed: the amount is covered by the balance OR the customer is VIP (VIPs may overdraw), AND today’s total stays within the daily limit (10 M VND, 50 M for VIP).</p>${preSo(sach(DO_A))}`, vi: `<p>Dòng 5 quyết định có cho rút tiền: số dư đủ HOẶC khách VIP (VIP được thấu chi), VÀ tổng rút hôm nay không vượt hạn mức ngày (10 triệu, VIP 50 triệu).</p>${preSo(sach(DO_A))}` },
      yeuCau: [
        { en: 'Numbers: atomic conditions, combinations for multiple condition coverage, minimum MC/DC tests.', vi: 'Số liệu: số điều kiện con, số tổ hợp cho multiple condition coverage, số test MC/DC tối thiểu.' },
        { en: '<code>conditionNotDecision</code>: two <code>[A, B, C]</code> vectors (assume every condition is evaluated) giving 100% condition coverage with the SAME decision outcome.', vi: '<code>conditionNotDecision</code>: hai vector <code>[A, B, C]</code> (giả sử mọi điều kiện đều được đánh giá) đạt 100% condition coverage mà kết quả quyết định GIỐNG nhau.' },
        { en: '<code>MCDC</code>: the minimum tests (inputs + expected) giving MC/DC of line 5 on the real code.', vi: '<code>MCDC</code>: bộ test tối thiểu (input + mong đợi) đạt MC/DC dòng 5 trên mã thật.' },
      ],
      hook: ['condition coverage', 'multiple condition coverage', 'MC/DC'],
    },
    {
      ten: { en: 'B. Mutation analysis', vi: 'B. Phân tích đột biến' }, diem: 3,
      moTa: { en: `${preSo(SHIP)}<p>Given suite: <code>shippingFee(1) = 15000</code>, <code>shippingFee(5) = 35000</code>, <code>shippingFee(20) = 70000</code>.</p>${bangHtml(['Mutant', 'Change'], MUT_B)}`, vi: `${preSo(SHIP)}<p>Bộ test cho sẵn: <code>shippingFee(1) = 15000</code>, <code>shippingFee(5) = 35000</code>, <code>shippingFee(20) = 70000</code>.</p>${bangHtml(['Mutant', 'Thay đổi'], MUT_B)}` },
      yeuCau: [
        { en: 'Which mutants does the given suite kill? Which one is <b>equivalent</b> (no input can tell it apart)? Mutation score = killed ÷ (mutants − equivalent) × 100.', vi: 'Bộ test cho sẵn giết mutant nào? Mutant nào <b>tương đương</b> (không input nào phân biệt được)? Mutation score = bị giết ÷ (số mutant − tương đương) × 100.' },
      ],
      hook: ['mutation score', 'equivalent mutant'],
    },
    {
      ten: { en: 'C. Strengthen the suite', vi: 'C. Nâng bộ test' }, diem: 3,
      yeuCau: [{ en: 'Write at least 6 tests that kill every non-equivalent mutant of Part B (score 100%).', vi: 'Viết ít nhất 6 test giết mọi mutant không tương đương của Phần B (điểm 100%).' }],
      hook: ['mutation testing'],
    },
  ],
  idBatBuoc: [['PART_A · MCDC', 'answers/a-conditions.js'], ['PART_B', 'answers/b-mutation.js'], ['shippingFee (injected)', 'answers/c-tests.js']],
  truDiem: [
    { en: 'Counting an equivalent mutant as “survived” — it lowers the score unfairly and wastes test effort.', vi: 'Tính mutant tương đương là “sống sót” — làm điểm thấp oan và tốn công test.' },
    { en: 'MC/DC pairs that change two conditions at once.', vi: 'Cặp MC/DC đổi hai điều kiện cùng lúc.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-5-deep-mcdc-mutation-score',
  ten: 'Deep Lab 5 — MC/DC, Multiple Conditions & Mutation Score',
  moTaModule: 'Deep Lab chương 5 (vượt syllabus): condition vs decision coverage, multiple condition coverage, MC/DC có ngắn mạch đo thật trên (A || B) && C, phân tích đột biến (mutant tương đương, mutation score) và nâng bộ test yếu lên 100%.',
  khoa: KHOA,
  baiHoc: 'swt301-cyclomatic-complexity',
  de: [{
    dangBai: 'deep-lab',
    tieuDe: 'Deep Lab 5 — MC/DC, Multiple Condition Coverage and Mutation Score',
    doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: '(A || B) && C with vectors (T,T,F) and (F,F,T)', output: 'every condition True once and False once, but the decision is False both times', explanation: 'Condition coverage does not imply decision coverage.|||Condition coverage không kéo theo decision coverage.' }],
    khaiNiem: ['condition coverage', 'multiple condition coverage', 'MC/DC', 'mutation testing', 'equivalent mutant', 'mutation score'],
    tienQuyet: ['SWT301 chapter 5'],
    the: ['swt301', 'deep-lab', 'white-box'],
    banIn: BAN_IN,
    thuatNgu: [...tn('condition', 'mcdc', 'mutant', 'kill', 'shortCircuit'), { en: 'multiple condition coverage', vi: 'phủ mọi tổ hợp điều kiện (2ⁿ)' }, { en: 'equivalent mutant', vi: 'mutant tương đương — đổi mã mà hành vi không đổi, không test nào giết được' }, { en: 'mutation score', vi: 'điểm đột biến = bị giết / (tổng − tương đương)' }],
    goiY: [
      'A: n điều kiện ⇒ multiple condition 2ⁿ, MC/DC n + 1. Vector bù nhau (T,T,F) / (F,F,T): mỗi điều kiện đổi giá trị mà (A||B)&&C đều False.',
      'A (MC/DC): (T,·,T)→OK · (F,F,·)→DENIED · (F,T,T)→OK · (T,·,F)→DENIED. Cần số dư, số tiền, hạn mức ngày cụ thể; isFrozen = false, amount > 0.',
      'B: Math.ceil(w − 2) và Math.ceil(w) − 2 luôn bằng nhau (dời số nguyên). Bộ cho sẵn chỉ dùng 1, 5, 20 ⇒ biên 2, 10, 0 và số lẻ chưa bao giờ được thử.',
      'C: thêm 2 (biên), 10 (biên), 2.5 hoặc 3.5 (số lẻ — ceil khác floor), 0 (phải ném lỗi).',
    ],
    loiHayGap: [
      'Cho rằng 100% condition coverage ⇒ 100% decision coverage.',
      'Đếm M7 là "sống sót" rồi viết mãi không giết được — nó tương đương.',
      'MC/DC: test VIP mà số dư cũng đủ — A đúng thì B không được đánh giá, cặp cho B không thành.',
    ],
    moTaNgan: 'Deep Lab chương 5: MC/DC, multiple condition, mutation score.',
    giaiThich: {
      en: '<p><b>A.</b> 3 conditions, 2³ = 8 combinations, MC/DC = 4. (T,T,F)/(F,F,T) reach condition but not decision coverage. MC/DC: (5 M balance, 1 M, non-VIP, 0 used) OK · (0.5 M, 1 M, non-VIP) DENIED · (0.5 M, 1 M, VIP) OK · (20 M, 5 M, non-VIP, 6 M used) DENIED. <b>B.</b> killed M3, M4, M8; M7 equivalent; 3 / (8 − 1) = 42.86%. <b>C.</b> add 2, 10, 2.5 and 0.</p>',
      vi: '<p><b>A.</b> 3 điều kiện, 8 tổ hợp, MC/DC 4 test. <b>B.</b> giết M3, M4, M8; M7 tương đương; 3 / 7 = 42,86%. <b>C.</b> thêm 2, 10, 2.5 và 0.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: ['lib/testkit.js', 'answers/a-conditions.js', 'answers/b-mutation.js', 'answers/c-tests.js'], kiem: [...kA, ...kB, ...kC] },
    khoiDau: {
      'answers/a-conditions.js': "const PART_A = {\n  conditions: 0,\n  multipleConditionCombinations: 0,\n  minMCDC: 0,\n  conditionNotDecision: [[true, true, true], [false, false, false]],  // [A, B, C]\n};\n\n// MC/DC of line 5 — inputs + expected result.\nconst MCDC = [\n  { id: 'M1', input: { balance: 5000000, amount: 1000000, dailyUsed: 0, isVip: false, isFrozen: false }, expected: 'OK' },\n];\n",
      'answers/b-mutation.js': "const PART_B = {\n  killed: [],\n  equivalent: [],\n  score: 0,\n};\n",
      'answers/c-tests.js': "// The given suite — strengthen it.\ntest.each([[1, 15000], [5, 35000], [20, 70000]])('shippingFee(%p) = %i', (w, fee) => {\n  expect(shippingFee(w)).toBe(fee);\n});\n",
      'lib/testkit.js': TESTKIT_JS,
    },
    loiGiai: {
      'answers/a-conditions.js': "const PART_A = {\n  conditions: 3,                     // A: amount <= balance · B: isVip · C: dailyUsed + amount <= limit\n  multipleConditionCombinations: 8,  // 2^3\n  minMCDC: 4,                        // n + 1\n  conditionNotDecision: [[true, true, false], [false, false, true]],  // each condition flips, decision False both times\n};\n\n// (A,B,C): (T,·,T)→OK · (F,F,·)→DENIED · (F,T,T)→OK · (T,·,F)→DENIED\nconst MCDC = [\n  { id: 'M1', input: { balance: 5000000, amount: 1000000, dailyUsed: 0, isVip: false, isFrozen: false }, expected: 'OK' },\n  { id: 'M2', input: { balance: 500000, amount: 1000000, dailyUsed: 0, isVip: false, isFrozen: false }, expected: 'DENIED' },\n  { id: 'M3', input: { balance: 500000, amount: 1000000, dailyUsed: 0, isVip: true, isFrozen: false }, expected: 'OK' },\n  { id: 'M4', input: { balance: 20000000, amount: 5000000, dailyUsed: 6000000, isVip: false, isFrozen: false }, expected: 'DENIED' },\n];\n",
      'answers/b-mutation.js': "// Given suite: 1 kg, 5 kg, 20 kg.\nconst PART_B = {\n  killed: ['M3', 'M4', 'M8'],      // they change a value the suite checks\n  equivalent: ['M7'],              // ceil(w − 2) = ceil(w) − 2 for every w\n  score: 42.86,                    // 3 / (8 − 1) × 100\n};\n",
      'answers/c-tests.js': "// Boundaries (2, 10, 0) and a non-integer weight kill the survivors M1, M2, M5, M6.\ntest.each([\n  [1, 15000], [2, 15000],          // ≤ 2 kg, including the boundary\n  [2.5, 25000], [5, 35000], [10, 60000],  // started kg above 2 (2.5 → 1 started kg), boundary 10\n  [20, 70000],\n])('shippingFee(%p) = %i', (w, fee) => {\n  expect(shippingFee(w)).toBe(fee);\n});\ntest('zero weight is rejected', () => {\n  expect(() => shippingFee(0)).toThrow(RangeError);\n});\n",
      'lib/testkit.js': TESTKIT_JS,
    },
    thamKhao: 'https://pitest.org/',
    boYeu: [
      { ten: 'C vẫn là bộ cho sẵn', tep: { 'answers/c-tests.js': "test.each([[1, 15000], [5, 35000], [20, 70000]])('f(%p)', (w, fee) => { expect(shippingFee(w)).toBe(fee); });\n" }, phaiTruot: ['Kills mutant M1', 'Kills mutant M5'] },
      { ten: 'A vector có kết quả khác nhau', tep: { 'answers/a-conditions.js': "const PART_A = { conditions: 3, multipleConditionCombinations: 8, minMCDC: 4, conditionNotDecision: [[true, false, true], [false, true, false]] };\nconst MCDC = [\n  { id: 'M1', input: { balance: 5000000, amount: 1000000, dailyUsed: 0, isVip: false, isFrozen: false }, expected: 'OK' },\n  { id: 'M2', input: { balance: 500000, amount: 1000000, dailyUsed: 0, isVip: false, isFrozen: false }, expected: 'DENIED' },\n  { id: 'M3', input: { balance: 500000, amount: 1000000, dailyUsed: 0, isVip: true, isFrozen: false }, expected: 'OK' },\n  { id: 'M4', input: { balance: 20000000, amount: 5000000, dailyUsed: 6000000, isVip: false, isFrozen: false }, expected: 'DENIED' },\n];\n" }, phaiTruot: ['A — two vectors'] },
    ],
  }],
});

void preMa;
