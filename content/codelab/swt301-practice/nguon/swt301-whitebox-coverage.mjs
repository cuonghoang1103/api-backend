/**
 * SWT301 · 5.1 — Statement & decision coverage (SWT4 slide 82–90, LO-4.3.1–4.3.3 K2).
 * Độ phủ đo THẬT trên mã đã gắn đo ($s/$d/$c — xem _chung.mjs kiemPhu).
 */
import { doiDau, KHOA, hai, giai, lc, tn, kiemPhu, sach, preSo } from './_chung.mjs';
import { tinhDe, jsDe, dotBienDe, TN_TEST } from './_de.mjs';

const E1 = tinhDe({
  tieuDe: 'Coverage 1 — Statement vs decision coverage (K2)',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>Six questions on what statement and decision coverage measure, which one is stronger and why 100% coverage is not the same as “no defects” (the coverage trap of slide 84).</p>', vi: '<p>Sáu câu về statement coverage và decision coverage đo gì, cái nào mạnh hơn và vì sao 100% coverage không có nghĩa là “không còn lỗi” (bẫy coverage ở slide 84).</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('What are the coverage items of decision coverage?', 'Phần tử độ phủ của decision coverage là gì?'), luaChon: lc(['a', 'Executable statements'], ['b', 'The outcomes (True and False) of every decision, including loop conditions'], ['c', 'Every path through the code'], ['d', 'Every input partition']), dapAn: ['b'], giaiThich: giai('Decision coverage counts decision outcomes: the True and the False of each IF, loop condition and CASE.', 'Decision coverage đếm kết quả của quyết định: nhánh True và False của mỗi IF, điều kiện lặp và CASE.') },
    { ma: 'q2', de: hai('Which statement is TRUE?', 'Phát biểu nào ĐÚNG?'), luaChon: lc(['a', '100% statement coverage guarantees 100% decision coverage'], ['b', '100% decision coverage guarantees 100% statement coverage'], ['c', 'They are always equal'], ['d', 'Neither implies the other']), dapAn: ['b'], giaiThich: giai('Every statement lies on some decision outcome, so covering all outcomes runs all statements. The reverse fails for an IF without ELSE: its True side alone runs every statement.', 'Mọi câu lệnh nằm trên một kết quả quyết định nào đó, nên phủ mọi kết quả là chạy mọi câu lệnh. Chiều ngược lại sai với IF không ELSE: riêng nhánh True đã chạy đủ câu lệnh.') },
    { ma: 'q3', de: hai('A test set reaches 100% decision coverage. What can you conclude?', 'Bộ test đạt 100% decision coverage. Bạn kết luận được gì?'), luaChon: lc(['a', 'The code has no defects'], ['b', 'Every decision outcome was exercised; defects may still exist, e.g. a wrong boundary or a missing requirement'], ['c', 'Every path was executed'], ['d', 'Every boundary value was tested']), dapAn: ['b'], giaiThich: giai('The coverage trap: coverage measures what was exercised, not what was checked. Missing code (a requirement never implemented) cannot be covered at all.', 'Bẫy coverage: độ phủ đo cái đã chạy qua, không đo cái đã kiểm đúng. Mã bị thiếu (yêu cầu chưa cài) thì không bao giờ phủ được.') },
    { ma: 'q4', de: hai('Code: S1; IF (x > 0) THEN S2 ENDIF; S3. What is the minimum number of tests for 100% statement coverage and for 100% decision coverage?', 'Mã: S1; IF (x > 0) THEN S2 ENDIF; S3. Số test tối thiểu cho 100% statement và cho 100% decision coverage là bao nhiêu?'), luaChon: lc(['a', 'SC 1, DC 1'], ['b', 'SC 1, DC 2'], ['c', 'SC 2, DC 2'], ['d', 'SC 2, DC 1']), dapAn: ['b'], giaiThich: giai('x > 0 runs S1, S2, S3 (all statements). The False outcome needs a second test.', 'x > 0 chạy S1, S2, S3 (đủ câu lệnh). Nhánh False cần test thứ hai.') },
    { ma: 'q5', de: hai('According to slides 86 and 88, how much coverage does typical ad hoc testing reach?', 'Theo slide 86 và 88, test tuỳ hứng thường đạt độ phủ bao nhiêu?'), luaChon: lc(['a', '95–100% statement, 90–100% decision'], ['b', '60–75% statement, 40–60% decision'], ['c', '10–20% statement, 5–10% decision'], ['d', 'Exactly 50% of both']), dapAn: ['b'], giaiThich: giai('That gap is the reason to measure coverage: without measuring you overestimate what your tests exercise.', 'Khoảng hụt đó là lý do phải đo coverage: không đo thì luôn đánh giá quá cao test đã chạy được gì.') },
    { ma: 'q6', de: hai('Why do testers usually target decision coverage rather than path coverage?', 'Vì sao tester thường nhắm decision coverage thay vì path coverage?'), luaChon: lc(['a', 'Path coverage is weaker'], ['b', 'The number of paths grows exponentially with sequential decisions and becomes unbounded with loops'], ['c', 'Path coverage cannot be defined'], ['d', 'Tools cannot measure decisions']), dapAn: ['b'], giaiThich: giai('n IFs in sequence give 2ⁿ paths; a loop makes the count unbounded (slides 89–90).', 'n IF nối tiếp cho 2ⁿ đường; vòng lặp làm số đường vô hạn (slide 89–90).') },
  ],
  goiY: ['DC ⇒ SC, không có chiều ngược lại.', 'Độ phủ đo cái đã CHẠY, không đo cái đã KIỂM.'],
  loiHayGap: ['Cho rằng 100% coverage = không còn lỗi.', 'Đếm nhánh False của IF không ELSE là “không có gì để phủ”.'],
  giaiThich: '<p>Answers: b · b · b · b · b · b.</p>',
  thuatNgu: tn('statement', 'decision'),
  khaiNiem: ['statement coverage', 'decision coverage'],
});

/* E2 — phủ câu lệnh tối thiểu */
const CODE2 = `function applyCoupon(total, code) {
  $s('S1'); let discount = 0;
  $s('S2'); if ($d('D1', code === 'SAVE10')) {
    $s('S3'); discount = total * 0.1;
  }
  $s('S4'); return total - discount;
}`;
const E2 = jsDe({
  tieuDe: 'Coverage 2 — Minimum test set for 100% statement coverage',
  doKho: 'EASY', phut: 6,
  moTa: { en: `<p>Choose the <b>fewest</b> tests that execute every statement of <code>applyCoupon</code>. The grader runs your inputs on instrumented code and measures the coverage. The expected value follows the specification: <code>SAVE10</code> gives 10% off.</p>${preSo(sach(CODE2))}`, vi: `<p>Chọn <b>ít</b> test nhất chạy qua mọi câu lệnh của <code>applyCoupon</code>. Máy chấm chạy input của bạn trên mã đã gắn đo và đo độ phủ. Giá trị mong đợi theo đặc tả: <code>SAVE10</code> giảm 10%.</p>${preSo(sach(CODE2))}` },
  yeuCau: [{ en: '<code>TESTS = [{ id, input: { total, code }, expected }]</code> — 100% statement coverage with the minimum number of tests.', vi: '<code>TESTS = [{ id, input: { total, code }, expected }]</code> — 100% statement coverage với số test tối thiểu.' }],
  viDu: [{ input: "{ total: 200000, code: '' }", output: 'expected 200000 — runs lines 2, 3, 6', explanation: 'Line 4 (the discount) is not executed yet.|||Dòng 4 (giảm giá) chưa chạy.' }],
  goiY: ['IF không ELSE: nhánh True chạy được MỌI câu lệnh.', 'Một test với code = "SAVE10" là đủ.'],
  loiHayGap: ['Viết hai test (có và không có mã) — đó là decision coverage, không phải tối thiểu cho statement.', 'Ghi expected 20000 (tiền giảm) thay vì tổng sau giảm.'],
  giaiThich: '<p>One test with <code>code = "SAVE10"</code> executes all four statements: minimum = 1. (Decision coverage would need a second test for the False side.)</p>',
  thuatNgu: tn('statement'),
  khaiNiem: ['statement coverage'],
  tep: {
    'answer.js': [
      "const TESTS = [\n  { id: 'T1', input: { total: 200000, code: '' }, expected: 200000 },\n];\n",
      "// The True side of the IF runs every statement → 1 test.\nconst TESTS = [\n  { id: 'T1', input: { total: 200000, code: 'SAVE10' }, expected: 180000 },\n];\n",
    ],
  },
  kiem: kiemPhu({ code: CODE2, ham: 'applyCoupon', thamSo: ['total', 'code'], do: { lenh: true, nhanh: false, toiThieu: 1, kyVong: true } }),
});

/* E3 — phủ quyết định với IF nối tiếp */
const CODE3 = `function shippingLabel(weight, express, fragile) {
  $s('S1'); let label = 'STD';
  $s('S2'); if ($d('D1', express)) { $s('S3'); label = 'EXP'; }
  $s('S4'); if ($d('D2', fragile)) { $s('S5'); label += '-FRAGILE'; }
  $s('S6'); if ($d('D3', weight > 20)) { $s('S7'); label += '-HEAVY'; }
  $s('S8'); return label;
}`;
const E3 = jsDe({
  tieuDe: 'Coverage 3 — Decision coverage of IFs in sequence (2 tests, 8 paths)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: `<p>Three IFs in sequence give 2³ = 8 paths, but decision coverage needs far fewer tests. Find the minimum set for 100% decision coverage of <code>shippingLabel</code>.</p>${preSo(sach(CODE3))}`, vi: `<p>Ba IF nối tiếp cho 2³ = 8 đường, nhưng decision coverage cần ít test hơn nhiều. Tìm bộ tối thiểu cho 100% decision coverage của <code>shippingLabel</code>.</p>${preSo(sach(CODE3))}` },
  yeuCau: [{ en: '<code>TESTS = [{ id, input: { weight, express, fragile }, expected }]</code> — every decision both True and False, with the fewest tests.', vi: '<code>TESTS = [{ id, input: { weight, express, fragile }, expected }]</code> — mọi quyết định đều True và False, với ít test nhất.' }],
  viDu: [{ input: '{ weight: 25, express: true, fragile: true }', output: "'EXP-FRAGILE-HEAVY'", explanation: 'All three decisions True in one test.|||Cả ba quyết định True trong một test.' }],
  goiY: ['Một test cho mọi nhánh True, một test cho mọi nhánh False.', 'weight > 20 là True với 25, False với 10.'],
  loiHayGap: ['Viết 8 test cho 8 đường — path coverage, không phải decision coverage.', 'Viết 3 test, mỗi test bật một quyết định — đủ độ phủ nhưng không tối thiểu (2 test là đủ).'],
  giaiThich: '<p>Two tests: all True (25 kg, express, fragile → "EXP-FRAGILE-HEAVY") and all False (10 kg → "STD"). Sequential IFs → min DC = 2 whatever their number (lesson 5.2 rule).</p>',
  thuatNgu: tn('decision'),
  khaiNiem: ['decision coverage', 'path explosion'],
  tep: {
    'answer.js': [
      "const TESTS = [\n  { id: 'T1', input: { weight: 25, express: true, fragile: true }, expected: 'EXP-FRAGILE-HEAVY' },\n];\n",
      "// Sequential IFs: all-True + all-False = 100% decision coverage with 2 tests (paths: 8).\nconst TESTS = [\n  { id: 'T1', input: { weight: 25, express: true, fragile: true }, expected: 'EXP-FRAGILE-HEAVY' },\n  { id: 'T2', input: { weight: 10, express: false, fragile: false }, expected: 'STD' },\n];\n",
    ],
  },
  kiem: kiemPhu({ code: CODE3, ham: 'shippingLabel', thamSo: ['weight', 'express', 'fragile'], do: { lenh: true, nhanh: true, toiThieu: 2, kyVong: true } }),
});

/* E4 — tính % độ phủ */
const CODE4 = `function grade(score) {
  let g = 'F';
  if (score >= 50) {
    g = 'D';
    if (score >= 80) {
      g = 'A';
    }
  }
  return g;
}`;
const E4 = tinhDe({
  tieuDe: 'Coverage 4 — Compute statement and decision coverage of three test sets',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: `<p>For this function count <b>6 executable statements</b> (lines 2, 3, 4, 5, 6, 9 — an <code>if</code> line is a statement) and <b>4 decision outcomes</b> (lines 3 and 5, True/False). Compute the coverage of each test set, as whole percentages rounded down.</p>${preSo(CODE4)}`,
    vi: `<p>Với hàm này đếm <b>6 câu lệnh thực thi</b> (dòng 2, 3, 4, 5, 6, 9 — dòng <code>if</code> cũng là câu lệnh) và <b>4 kết quả quyết định</b> (dòng 3 và 5, True/False). Tính độ phủ của từng bộ test, ra phần trăm nguyên (làm tròn xuống).</p>${preSo(CODE4)}`,
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement coverage % and decision coverage %', 'Statement coverage % và decision coverage %'),
    cot: [{ ma: 't', ten: 'Test set (score values)' }, { ma: 's', ten: 'Statement %' }, { ma: 'd', ten: 'Decision %' }],
    hang: [{ ma: 'a', o: { t: '{ 30 }' } }, { ma: 'b', o: { t: '{ 60 }' } }, { ma: 'c', o: { t: '{ 30, 90 }' } }, { ma: 'd', o: { t: '{ 30, 60, 90 }' } }],
    dapAn: { 'a.s': ['50', '50%'], 'a.d': ['25', '25%'], 'b.s': ['83', '83%'], 'b.d': ['50', '50%'], 'c.s': ['100', '100%'], 'c.d': ['75', '75%'], 'd.s': ['100', '100%'], 'd.d': ['100', '100%'] },
    giaiThich: giai('30 runs lines 2, 3, 9 (3/6) and only line 3 False (1/4). 60 runs 2, 3, 4, 5, 9 (5/6 = 83%) with 3 True + 5 False (2/4). {30, 90} runs every line but never takes line 5 False (3/4). Adding 60 gives 100%.', '30 chạy dòng 2, 3, 9 (3/6) và chỉ dòng 3 False (1/4). 60 chạy 2, 3, 4, 5, 9 (5/6 = 83%) với 3 True + 5 False (2/4). {30, 90} chạy mọi dòng nhưng chưa bao giờ dòng 5 False (3/4). Thêm 60 thì 100%.'),
  }],
  goiY: ['Viết ra từng giá trị đi qua những dòng nào và lấy nhánh nào.', '{30, 90}: statement 100% nhưng dòng 5 chưa từng False.'],
  loiHayGap: ['Không đếm dòng if là câu lệnh.', 'Nghĩ 100% statement ⇒ 100% decision.'],
  giaiThich: '<p>50/25 · 83/50 · 100/75 · 100/100.</p>',
  thuatNgu: tn('statement', 'decision'),
  khaiNiem: ['statement coverage', 'decision coverage'],
});

/* E5 — vòng lặp: một test đủ */
const CODE5 = `function countVowels(word) {
  $s('S1'); let n = 0;
  $s('S2'); for (let i = 0; $d('D1', i < word.length); i++) {
    $s('S3'); if ($d('D2', 'aeiou'.includes(word[i].toLowerCase()))) { $s('S4'); n++; }
  }
  $s('S5'); return n;
}`;
const E5 = jsDe({
  tieuDe: 'Coverage 5 — A loop lets one test take every decision outcome',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: `<p>The loop condition and the IF inside it are both decisions. Find the minimum number of tests for 100% decision coverage of <code>countVowels</code> — think about what happens across iterations.</p>${preSo(sach(CODE5))}`, vi: `<p>Điều kiện vòng lặp và IF bên trong đều là quyết định. Tìm số test tối thiểu cho 100% decision coverage của <code>countVowels</code> — hãy nghĩ chuyện gì xảy ra qua các lần lặp.</p>${preSo(sach(CODE5))}` },
  yeuCau: [{ en: '<code>TESTS = [{ id, input: { word }, expected }]</code> — 100% decision coverage, minimum number of tests.', vi: '<code>TESTS = [{ id, input: { word }, expected }]</code> — 100% decision coverage, số test tối thiểu.' }],
  viDu: [{ input: "{ word: 'ab' }", output: 'expected 1', explanation: "Iteration 1: 'a' → IF True; iteration 2: 'b' → IF False; then the loop condition becomes False.|||Lần 1: 'a' → IF True; lần 2: 'b' → IF False; rồi điều kiện lặp thành False." }],
  goiY: ['Điều kiện lặp: True mỗi lần vào thân vòng, False khi thoát — cả hai xảy ra trong một lần gọi.', 'Một từ có cả nguyên âm và phụ âm là đủ.'],
  loiHayGap: ['Thêm test chuỗi rỗng "cho chắc" — không cần cho decision coverage (nhưng là ca biên tốt ở black-box).', 'Viết hai test (một nguyên âm, một phụ âm).'],
  giaiThich: '<p>One test such as "ab" (expected 1): the loop condition is True twice and False once, the IF is True for "a" and False for "b". V(G) = 3 but min DC = 1 — loops let one test do a lot.</p>',
  thuatNgu: tn('decision'),
  khaiNiem: ['decision coverage', 'loop'],
  tep: {
    'answer.js': [
      "const TESTS = [\n  { id: 'T1', input: { word: 'aei' }, expected: 3 },\n];\n",
      "// One word with a vowel AND a consonant: loop True + False, IF True + False.\nconst TESTS = [\n  { id: 'T1', input: { word: 'ab' }, expected: 1 },\n];\n",
    ],
  },
  kiem: kiemPhu({ code: CODE5, ham: 'countVowels', thamSo: ['word'], do: { lenh: true, nhanh: true, toiThieu: 1, kyVong: true } }),
});

/* E6 — bẫy coverage: 100% DC mà vẫn sót lỗi biên */
const DUNG6 = `function ticketPrice(age) {
  if (age < 12) return 50000;
  if (age >= 60) return 60000;
  return 90000;
}`;
const doi6 = (a, b) => { if (!DUNG6.includes(a)) throw new Error('mutant 5.1: ' + a); return DUNG6.replace(a, b); };
const E6 = dotBienDe({
  tieuDe: 'Coverage 6 — The coverage trap: 100% decision coverage that misses defects',
  doKho: 'HARD', phut: 12,
  moTa: {
    en: `<p>Children under 12 pay 50,000, people aged 60 or more pay 60,000, everybody else 90,000. The suite <code>ticketPrice(5)</code>, <code>ticketPrice(30)</code>, <code>ticketPrice(70)</code> reaches <b>100% decision coverage</b> — and still lets four of the five mutants below survive. Write a suite that keeps 100% coverage AND kills every mutant: combine white-box coverage with black-box boundaries.</p>${preSo(DUNG6)}`,
    vi: `<p>Trẻ dưới 12 tuổi trả 50.000, người từ 60 tuổi trả 60.000, còn lại 90.000. Bộ test <code>ticketPrice(5)</code>, <code>ticketPrice(30)</code>, <code>ticketPrice(70)</code> đạt <b>100% decision coverage</b> — mà vẫn để bốn trong năm mutant dưới đây sống. Viết bộ test vừa giữ 100% coverage VỪA giết mọi mutant: kết hợp độ phủ white-box với biên black-box.</p>${preSo(DUNG6)}`,
  },
  yeuCau: [{ en: 'At least 5 tests; all pass on the correct code; all mutants killed.', vi: 'Ít nhất 5 test; đạt hết trên mã đúng; giết mọi mutant.' }],
  viDu: [{ input: 'expect(ticketPrice(12)).toBe(90000)', output: 'kills the mutant age <= 12', explanation: '12 is the first age of the adult partition.|||12 là tuổi đầu tiên của vùng người lớn.' }],
  goiY: ['Mutant dời biên 12 và 60 — test 11, 12, 59, 60.', 'Giữ một ca mỗi vùng để không mất độ phủ.'],
  loiHayGap: ['Tin rằng 100% decision coverage là đủ — chính là bẫy coverage.', 'Chỉ test 12 mà quên 11 (mutant age < 11 sống).'],
  giaiThich: '<p>Coverage says which outcomes ran, boundaries say WHERE the outcome changes. 11/12 and 59/60 kill the four relational mutants; any value per partition kills the wrong-price mutant.</p>',
  thuatNgu: [...TN_TEST(), ...tn('decision', 'bva')],
  ten: ['ticketPrice'], dung: DUNG6, minTest: 5,
  dotBien: [
    { ma: 'M1', moTa: { en: 'age <= 12 (12-year-olds pay the child price)', vi: 'age <= 12 (12 tuổi trả giá trẻ em)' }, code: doi6('age < 12', 'age <= 12') },
    { ma: 'M2', moTa: { en: 'age < 11 (11-year-olds pay the adult price)', vi: 'age < 11 (11 tuổi trả giá người lớn)' }, code: doi6('age < 12', 'age < 11') },
    { ma: 'M3', moTa: { en: 'age > 60 (60-year-olds pay the adult price)', vi: 'age > 60 (60 tuổi trả giá người lớn)' }, code: doi6('age >= 60', 'age > 60') },
    { ma: 'M4', moTa: { en: 'age >= 59 (59-year-olds get the senior price)', vi: 'age >= 59 (59 tuổi được giá người cao tuổi)' }, code: doi6('age >= 60', 'age >= 59') },
    { ma: 'M5', moTa: { en: 'the senior price is 65,000', vi: 'giá người cao tuổi là 65.000' }, code: doi6('return 60000', 'return 65000') },
  ],
  dauTest: `// 100% decision coverage — but how many mutants does it kill?
test.each([[5, 50000], [30, 90000], [70, 60000]])('ticketPrice(%i) = %i', (age, price) => {
  expect(ticketPrice(age)).toBe(price);
});
`,
  giaiTest: `// Keep one value per partition (coverage) AND test both sides of each boundary (11|12, 59|60).
test.each([
  [5, 50000], [11, 50000],   // child partition, last child age
  [12, 90000], [30, 90000], [59, 90000],
  [60, 60000], [70, 60000],  // first senior age, senior partition
])('ticketPrice(%i) = %i', (age, price) => {
  expect(ticketPrice(age)).toBe(price);
});
`,
});

export default doiDau({
  slug: 'swt301-whitebox-coverage',
  ten: '5.1 Statement & decision coverage',
  moTaModule: 'Độ phủ câu lệnh và quyết định đo thật trên mã gắn đo: câu hỏi K2, bộ tối thiểu cho statement (IF không ELSE), decision với IF nối tiếp (2 test / 8 đường), tính % độ phủ, vòng lặp một test đủ, và bẫy coverage (100% DC vẫn sót lỗi biên — giết 5 mutant).',
  khoa: KHOA,
  baiHoc: 'swt301-whitebox-coverage',
  de: [E1, E2, E3, E4, E5, E6],
});
