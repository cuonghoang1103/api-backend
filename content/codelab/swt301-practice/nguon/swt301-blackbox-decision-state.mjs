/**
 * SWT301 · 4.4 — Decision table testing (SWT4 slide 43–59, LO-4.2.3 K3).
 * Ví dụ chính = bài "credit card discount" của sách giáo trình (Black/van Veenendaal/Graham): khách mới 15%, thẻ thân thiết 10%,
 * coupon 20% (không dùng chung với ưu đãi khách mới), các mức cộng dồn; khách mới không thể có thẻ thân thiết.
 */
import { doiDau, KHOA, hai, giai, lc, tn, bangHtml } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy, dotBienDe, TN_TEST } from './_de.mjs';

const SPEC = {
  en: '<p><b>Specification (credit-card discount).</b> A <b>new customer</b> opening a credit-card account gets <b>15%</b> off all purchases today. An <b>existing customer</b> holding a <b>loyalty card</b> gets <b>10%</b>. A customer with a <b>coupon</b> gets <b>20%</b> today, but the coupon <b>cannot be combined with the new-customer discount</b>. Discounts are <b>added</b> when they apply. A new customer cannot already hold a loyalty card.</p>',
  vi: '<p><b>Đặc tả (giảm giá thẻ tín dụng).</b> <b>Khách mới</b> mở thẻ được giảm <b>15%</b> mọi món hôm nay. <b>Khách cũ</b> có <b>thẻ thân thiết</b> được <b>10%</b>. Khách có <b>coupon</b> được <b>20%</b> hôm nay, nhưng coupon <b>không dùng chung với ưu đãi khách mới</b>. Các mức giảm <b>cộng dồn</b> khi được áp. Khách mới không thể đã có thẻ thân thiết.</p>',
};
const MUC = ['impossible', '0%', '10%', '15%', '20%', '30%'];
const E1 = tinhDe({
  tieuDe: 'Decision table 1 — Fill the actions of the full table (credit-card discount)',
  doKho: 'EASY', phut: 8,
  moTa: { en: `${SPEC.en}<p>Three conditions ⇒ 2³ = 8 rules. Fill the action (discount) of every rule; mark rules that cannot happen as <i>impossible</i>.</p>`, vi: `${SPEC.vi}<p>Ba điều kiện ⇒ 2³ = 8 luật. Điền hành động (mức giảm) của từng luật; luật không thể xảy ra ghi <i>impossible</i>.</p>` },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Full decision table — one row per rule (T = true, F = false)', 'Bảng quyết định đầy đủ — mỗi dòng một luật (T = đúng, F = sai)'),
    cot: [{ ma: 'r', ten: 'Rule' }, { ma: 'n', ten: 'New customer?' }, { ma: 'l', ten: 'Loyalty card?' }, { ma: 'c', ten: 'Coupon?' }, { ma: 'a', ten: 'Discount', luaChon: MUC }],
    hang: [['R1', 'T', 'T', 'T'], ['R2', 'T', 'T', 'F'], ['R3', 'T', 'F', 'T'], ['R4', 'T', 'F', 'F'], ['R5', 'F', 'T', 'T'], ['R6', 'F', 'T', 'F'], ['R7', 'F', 'F', 'T'], ['R8', 'F', 'F', 'F']].map(([r, n, l, c]) => ({ ma: r, o: { r, n, l, c } })),
    dapAn: { 'R1.a': 'impossible', 'R2.a': 'impossible', 'R3.a': '20%', 'R4.a': '15%', 'R5.a': '30%', 'R6.a': '10%', 'R7.a': '20%', 'R8.a': '0%' },
    giaiThich: giai('R1–R2: a new customer cannot hold a loyalty card. R3: coupon and new-customer discount cannot be combined, the customer takes the better one (20%). R5: 10% + 20% = 30% (discounts add up). R8: no discount.', 'R1–R2: khách mới không thể có thẻ thân thiết. R3: coupon và ưu đãi khách mới không dùng chung, khách lấy mức tốt hơn (20%). R5: 10% + 20% = 30% (cộng dồn). R8: không giảm.'),
  }],
  goiY: ['Đi từng dòng: điều kiện nào đúng ⇒ những mức nào áp ⇒ có luật cấm kết hợp không ⇒ cộng lại.', 'Dòng có New = T và Loyalty = T không thể xảy ra.'],
  loiHayGap: ['Ghi R3 = 35% (cộng 15 + 20) — đặc tả cấm dùng coupon cùng ưu đãi khách mới.', 'Ghi R5 = 20% (chỉ lấy mức lớn) — đặc tả nói các mức cộng dồn.'],
  giaiThich: '<p>impossible · impossible · 20% · 15% · 30% · 10% · 20% · 0% — 6 feasible rules.</p>',
  thuatNgu: [...tn('decisionTable'), { en: 'rule', vi: 'luật — một cột (tổ hợp điều kiện + hành động) của bảng quyết định' }, { en: 'infeasible / impossible rule', vi: 'luật không thể xảy ra' }],
  khaiNiem: ['decision table testing', 'full decision table'],
});

const TF = ['T', 'F', '–'];
const E2 = tinhDe({
  tieuDe: 'Decision table 2 — Rationalise (collapse) a table with “don’t care” entries',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: `<p><b>Specification (cinema price).</b> Children under 12 always pay <b>50,000</b>, whatever the day and membership. Otherwise members pay <b>70,000</b> on any day; non-members pay <b>90,000</b> at the weekend and <b>80,000</b> on weekdays.</p>
<p>The full table has 8 rules. Collapse it: whenever the action does not depend on a condition, that condition becomes “–” (don’t care) and the rules merge. Fill the conditions of the 4 collapsed rules.</p>`,
    vi: `<p><b>Đặc tả (giá vé xem phim).</b> Trẻ dưới 12 tuổi luôn trả <b>50.000</b>, bất kể ngày và thẻ thành viên. Còn lại thành viên trả <b>70.000</b> mọi ngày; người không phải thành viên trả <b>90.000</b> cuối tuần và <b>80.000</b> ngày thường.</p>
<p>Bảng đầy đủ có 8 luật. Hãy rút gọn: khi hành động không phụ thuộc một điều kiện thì điều kiện đó thành “–” (không quan tâm) và các luật gộp lại. Điền điều kiện cho 4 luật đã rút gọn.</p>`,
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Collapsed decision table (T / F / –)', 'Bảng quyết định đã rút gọn (T / F / –)'),
    cot: [{ ma: 'r', ten: 'Rule' }, { ma: 'c', ten: 'Child?', luaChon: TF }, { ma: 'm', ten: 'Member?', luaChon: TF }, { ma: 'w', ten: 'Weekend?', luaChon: TF }, { ma: 'p', ten: 'Price' }],
    hang: [['C1', '50,000'], ['C2', '70,000'], ['C3', '90,000'], ['C4', '80,000']].map(([r, p]) => ({ ma: r, o: { r, p } })),
    dapAn: { 'C1.c': 'T', 'C1.m': '–', 'C1.w': '–', 'C2.c': 'F', 'C2.m': 'T', 'C2.w': '–', 'C3.c': 'F', 'C3.m': 'F', 'C3.w': 'T', 'C4.c': 'F', 'C4.m': 'F', 'C4.w': 'F' },
    giaiThich: giai('Child = T merges 4 rules (member and weekend do not matter). Child = F, Member = T merges 2 rules (weekend does not matter). The two remaining rules need every condition. 8 → 4 rules, so 4 test cases give 100% coverage of the collapsed table.', 'Child = T gộp 4 luật (thành viên và cuối tuần không quan trọng). Child = F, Member = T gộp 2 luật (cuối tuần không quan trọng). Hai luật còn lại cần đủ mọi điều kiện. 8 → 4 luật, nên 4 test case cho 100% độ phủ bảng rút gọn.'),
  }],
  goiY: ['Bắt đầu từ điều kiện “mạnh” nhất: trẻ em ⇒ giá cố định.', '“–” chỉ dùng khi MỌI giá trị của điều kiện đó cho cùng một hành động.'],
  loiHayGap: ['Ghi “–” cho Weekend ở C3/C4 — với người không phải thành viên giá phụ thuộc ngày.', 'Ghi F cho Member ở C1 — trẻ em thành viên cũng trả 50.000 nên là “–”.'],
  giaiThich: '<p>C1: T – – · C2: F T – · C3: F F T · C4: F F F.</p>',
  thuatNgu: [...tn('decisionTable'), { en: "don't care (–)", vi: 'không quan tâm — kết quả không phụ thuộc điều kiện này' }, { en: 'collapse / rationalise', vi: 'rút gọn bảng — gộp luật, bỏ luật không thể' }],
  khaiNiem: ['decision table testing', 'collapsed decision table'],
});

/* ───────────── E3 · test case từ bảng quyết định (js) ───────────── */
const E3 = jsDe({
  tieuDe: 'Decision table 3 — One test per feasible rule, with the right expected discount',
  doKho: 'MEDIUM', phut: 12,
  moTa: { en: `${SPEC.en}<p>Write the decision-table test cases: <b>one test per feasible rule</b> of the full table of Decision table 1, each with the expected discount (number, e.g. <code>30</code>). Impossible combinations cannot be executed — leave them out.</p>`, vi: `${SPEC.vi}<p>Viết test case từ bảng quyết định: <b>mỗi luật khả thi một test</b> của bảng đầy đủ ở Decision table 1, kèm mức giảm mong đợi (số, vd <code>30</code>). Tổ hợp không thể xảy ra không chạy được — bỏ ra.</p>` },
  yeuCau: [
    { en: '<code>TESTS = [{ rule: "R3", isNew: true, hasLoyalty: false, hasCoupon: true, expected: 20 }, …]</code>', vi: '<code>TESTS = [{ rule: "R3", isNew: true, hasLoyalty: false, hasCoupon: true, expected: 20 }, …]</code>' },
    { en: 'Decision-table coverage = rules tested ÷ feasible rules — reach 100% with exactly 6 tests.', vi: 'Độ phủ bảng quyết định = luật đã test ÷ luật khả thi — đạt 100% với đúng 6 test.' },
  ],
  viDu: [{ input: '{ rule: "R5", isNew: false, hasLoyalty: true, hasCoupon: true, expected: 30 }', output: 'covers R5', explanation: '10% + 20%, discounts are added.|||10% + 20%, cộng dồn.' }],
  goiY: ['Luật khả thi: R3–R8 (R1, R2 có khách mới + thẻ thân thiết).', 'Trường rule chỉ để đọc cho dễ — máy chấm suy luật từ ba điều kiện.'],
  loiHayGap: ['Thêm ca isNew = true, hasLoyalty = true — không thể tạo dữ liệu đó.', 'Ghi expected 35 cho R3.'],
  giaiThich: '<p>R3 (T,F,T) 20 · R4 (T,F,F) 15 · R5 (F,T,T) 30 · R6 (F,T,F) 10 · R7 (F,F,T) 20 · R8 (F,F,F) 0.</p>',
  thuatNgu: [...tn('decisionTable'), { en: 'decision table coverage', vi: 'độ phủ bảng quyết định = luật đã test / luật khả thi' }],
  khaiNiem: ['decision table testing', 'decision table coverage'],
  tep: {
    'answer.js': [
      "// One test per FEASIBLE rule of the full decision table.\nconst TESTS = [\n  { rule: 'R8', isNew: false, hasLoyalty: false, hasCoupon: false, expected: 0 },\n];\n",
      "// Six feasible rules (R1 and R2 are impossible: a new customer has no loyalty card yet).\nconst TESTS = [\n  { rule: 'R3', isNew: true, hasLoyalty: false, hasCoupon: true, expected: 20 },   // coupon, not combined with 15%\n  { rule: 'R4', isNew: true, hasLoyalty: false, hasCoupon: false, expected: 15 },\n  { rule: 'R5', isNew: false, hasLoyalty: true, hasCoupon: true, expected: 30 },   // 10% + 20%\n  { rule: 'R6', isNew: false, hasLoyalty: true, hasCoupon: false, expected: 10 },\n  { rule: 'R7', isNew: false, hasLoyalty: false, hasCoupon: true, expected: 20 },\n  { rule: 'R8', isNew: false, hasLoyalty: false, hasCoupon: false, expected: 0 },\n];\n",
    ],
  },
  kiem: (() => {
    const chung = `if (!Array.isArray(TESTS)) return 'TESTS must be an array';
      const luat = (t) => (t.isNew ? (t.hasLoyalty ? (t.hasCoupon ? 'R1' : 'R2') : (t.hasCoupon ? 'R3' : 'R4')) : (t.hasLoyalty ? (t.hasCoupon ? 'R5' : 'R6') : (t.hasCoupon ? 'R7' : 'R8')));
      const muc = { R3: 20, R4: 15, R5: 30, R6: 10, R7: 20, R8: 0 };
      const bad = TESTS.findIndex((t) => typeof t.isNew !== 'boolean' || typeof t.hasLoyalty !== 'boolean' || typeof t.hasCoupon !== 'boolean');
      if (bad >= 0) return 'test #' + (bad + 1) + ': isNew, hasLoyalty and hasCoupon must be true/false';`;
    const phu = (r) => kiemTuy({ en: `Rule ${r} is covered with the right expected discount`, vi: `Luật ${r} được phủ với mức giảm mong đợi đúng` }, new Function(`${chung} return TESTS.some((t) => luat(t) === '${r}' && Number(t.expected) === muc['${r}']) ? 'OK' : 'rule ${r} not covered (or its expected discount is wrong)';`));
    return [
      kiemTuy({ en: 'No impossible combination (new customer with a loyalty card)', vi: 'Không có tổ hợp không thể (khách mới có thẻ thân thiết)' }, new Function(`${chung} const x = TESTS.findIndex((t) => t.isNew && t.hasLoyalty); return x < 0 ? 'OK' : 'test #' + (x + 1) + ' is rule ' + luat(TESTS[x]) + ', which cannot happen — you cannot create such test data';`)),
      kiemTuy({ en: 'Every expected discount is right', vi: 'Mọi mức giảm mong đợi đều đúng' }, new Function(`${chung} const x = TESTS.findIndex((t) => !(luat(t) in muc) || Number(t.expected) !== muc[luat(t)]); return x < 0 ? 'OK' : 'test #' + (x + 1) + ' (' + luat(TESTS[x]) + '): expected ' + (muc[luat(TESTS[x])] ?? 'n/a') + '%';`)),
      ...['R3', 'R4', 'R5', 'R6', 'R7', 'R8'].map(phu),
      kiemTuy({ en: 'Exactly one test per feasible rule (6 tests)', vi: 'Đúng một test mỗi luật khả thi (6 test)' }, new Function(`${chung} const ds = TESTS.map(luat); return ds.length === 6 && new Set(ds).size === 6 ? 'OK' : TESTS.length + ' test(s), ' + new Set(ds).size + ' distinct rule(s) — aim for 6 tests, one per rule';`)),
    ];
  })(),
});

/* ───────────── E4 · viết test từ bảng quyết định, giết mutant ───────────── */
const DUNG4 = `function discountPercent(isNew, hasLoyalty, hasCoupon) {
  if (isNew && hasLoyalty) throw new Error('INVALID: a new customer cannot hold a loyalty card');
  if (isNew) return hasCoupon ? 20 : 15;
  let d = 0;
  if (hasLoyalty) d += 10;
  if (hasCoupon) d += 20;
  return d;
}`;
const doi4 = (a, b) => { if (!DUNG4.includes(a)) throw new Error('mutant 4.4: ' + a); return DUNG4.replace(a, b); };
const E4 = dotBienDe({
  tieuDe: 'Decision table 4 — Rule-based unit tests for discountPercent (kill the mutants)',
  doKho: 'HARD', phut: 15,
  moTa: { en: `${SPEC.en}<p><code>discountPercent(isNew, hasLoyalty, hasCoupon)</code> returns the discount (a number) and throws an <code>Error</code> whose message starts with <code>INVALID</code> for the impossible combination. Write one test per rule (including the impossible one — it must be rejected) and kill all six mutants.</p>`, vi: `${SPEC.vi}<p><code>discountPercent(isNew, hasLoyalty, hasCoupon)</code> trả mức giảm (số) và ném <code>Error</code> có thông báo bắt đầu bằng <code>INVALID</code> cho tổ hợp không thể. Viết mỗi luật một test (kể cả luật không thể — phải bị từ chối) và giết cả sáu mutant.</p>` },
  yeuCau: [
    { en: 'Use <code>test.each</code> with one row per feasible rule, plus one test that the impossible combination throws <code>"INVALID"</code>.', vi: 'Dùng <code>test.each</code> mỗi luật khả thi một dòng, cộng một test cho tổ hợp không thể ném <code>"INVALID"</code>.' },
  ],
  viDu: [{ input: 'expect(discountPercent(false, true, true)).toBe(30)', output: 'kills the mutant that takes only the larger discount', explanation: 'Rule R5: discounts are added.|||Luật R5: cộng dồn.' }],
  goiY: ['Sáu luật khả thi ⇒ sáu dòng test.each; thêm một test cho (true, true, …) ném lỗi.', 'Mỗi mutant làm sai đúng một cột của bảng — test theo luật sẽ bắt hết.'],
  loiHayGap: ['Chỉ test các tổ hợp “có giảm” — mutant cho R8 giảm 5% sống sót.', 'Không test tổ hợp không thể ⇒ mutant bỏ kiểm tra hợp lệ sống sót.'],
  giaiThich: '<p>Testing every rule of the decision table — including the infeasible combination, which the code must reject — is exactly decision-table coverage. JUnit: <code>@ParameterizedTest @CsvSource({"true,false,true,20", "true,false,false,15", "false,true,true,30", …})</code> + <code>assertThrows(IllegalArgumentException.class, …)</code>.</p>',
  thuatNgu: [...TN_TEST(), ...tn('decisionTable')],
  ten: ['discountPercent'], dung: DUNG4, minTest: 6,
  dotBien: [
    { ma: 'M1', moTa: { en: 'a new customer with a coupon gets 35% (discounts combined)', vi: 'khách mới có coupon được 35% (cộng dồn)' }, code: doi4('return hasCoupon ? 20 : 15;', 'return hasCoupon ? 35 : 15;') },
    { ma: 'M2', moTa: { en: 'loyalty + coupon gives only the larger discount (20%)', vi: 'thẻ + coupon chỉ lấy mức lớn (20%)' }, code: doi4('if (hasCoupon) d += 20;', 'if (hasCoupon) d = Math.max(d, 20);') },
    { ma: 'M3', moTa: { en: 'the loyalty discount is 5%', vi: 'giảm thẻ thân thiết là 5%' }, code: doi4('d += 10;', 'd += 5;') },
    { ma: 'M4', moTa: { en: 'a new customer without a coupon gets 10%', vi: 'khách mới không coupon được 10%' }, code: doi4('return hasCoupon ? 20 : 15;', 'return hasCoupon ? 20 : 10;') },
    { ma: 'M5', moTa: { en: 'the impossible combination is accepted', vi: 'tổ hợp không thể được chấp nhận' }, code: doi4("if (isNew && hasLoyalty) throw new Error('INVALID: a new customer cannot hold a loyalty card');", '') },
    { ma: 'M6', an: true, moTa: { en: 'no condition true still gives 5%', vi: 'không điều kiện nào vẫn giảm 5%' }, code: doi4('let d = 0;', 'let d = hasLoyalty || hasCoupon ? 0 : 5;') },
  ],
  dauTest: `// One test per rule of the decision table of discountPercent(isNew, hasLoyalty, hasCoupon).
test('R6: existing customer with a loyalty card gets 10%', () => {
  expect(discountPercent(false, true, false)).toBe(10);
});
`,
  giaiTest: `// Decision-table coverage: every feasible rule + the infeasible combination.
describe('discountPercent — decision table', () => {
  test.each([
    ['R3', true, false, true, 20],
    ['R4', true, false, false, 15],
    ['R5', false, true, true, 30],
    ['R6', false, true, false, 10],
    ['R7', false, false, true, 20],
    ['R8', false, false, false, 0],
  ])('%s: new=%p loyalty=%p coupon=%p → %i%', (rule, isNew, loyalty, coupon, expected) => {
    expect(discountPercent(isNew, loyalty, coupon)).toBe(expected);
  });

  test('R1/R2: a new customer with a loyalty card is rejected', () => {
    expect(() => discountPercent(true, true, false)).toThrow('INVALID');
  });
});
`,
});

const E5 = tinhDe({
  tieuDe: 'Decision table 5 — ISTQB-style questions',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>Six questions on decision tables: counting rules, coverage, collapsing and what the technique is good for.</p>', vi: '<p>Sáu câu về bảng quyết định: đếm luật, độ phủ, rút gọn và kỹ thuật này mạnh ở đâu.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A business rule has 4 Boolean conditions. How many rules does the FULL decision table have?', 'Một quy tắc nghiệp vụ có 4 điều kiện Boolean. Bảng quyết định ĐẦY ĐỦ có bao nhiêu luật?'), luaChon: lc(['a', '4'], ['b', '8'], ['c', '16'], ['d', '24']), dapAn: ['c'], giaiThich: giai('2⁴ = 16 combinations.', '2⁴ = 16 tổ hợp.') },
    { ma: 'q2', de: hai('A collapsed decision table has 6 rules; the tests exercise 4 of them. What is the decision-table coverage?', 'Bảng rút gọn có 6 luật; test chạm 4 luật. Độ phủ bảng quyết định là bao nhiêu?'), luaChon: lc(['a', '4%'], ['b', '50%'], ['c', '67%'], ['d', '150%']), dapAn: ['c'], giaiThich: giai('4 / 6 ≈ 67%.', '4 / 6 ≈ 67%.') },
    { ma: 'q3', de: hai('What is the main strength of decision table testing?', 'Thế mạnh chính của kiểm thử bảng quyết định là gì?'), luaChon: lc(['a', 'It finds the boundaries of numeric ranges'], ['b', 'It systematically identifies combinations of conditions, including ones the requirements forgot'], ['c', 'It measures statement coverage'], ['d', 'It models the history of a system']), dapAn: ['b'], giaiThich: giai('Decision tables record business rules as combinations; writing every column reveals gaps and contradictions in the requirements.', 'Bảng quyết định ghi quy tắc nghiệp vụ dạng tổ hợp; viết đủ mọi cột làm lộ lỗ hổng và mâu thuẫn trong yêu cầu.') },
    { ma: 'q4', de: hai('In a collapsed decision table, what does “–” in a condition row mean?', 'Trong bảng đã rút gọn, dấu “–” ở một dòng điều kiện nghĩa là gì?'), luaChon: lc(['a', 'The condition is false'], ['b', 'The rule is impossible'], ['c', 'The value of that condition does not affect the outcome of the rule'], ['d', 'The condition has not been tested yet']), dapAn: ['c'], giaiThich: giai('“Don’t care”: true and false lead to the same action, so the rules were merged.', '“Không quan tâm”: đúng hay sai đều cho cùng hành động, nên các luật được gộp.') },
    { ma: 'q5', de: hai('Which of the following is the typical MINIMUM coverage standard for decision table testing?', 'Chuẩn độ phủ TỐI THIỂU thường gặp của kiểm thử bảng quyết định là gì?'), luaChon: lc(['a', 'One test per condition'], ['b', 'At least one test case per decision rule (column)'], ['c', 'One test per action'], ['d', 'All 2ⁿ combinations, always']), dapAn: ['b'], giaiThich: giai('The common minimum is one test case per rule in the (possibly collapsed) table.', 'Mức tối thiểu phổ biến là mỗi luật (cột) một test case trong bảng (có thể đã rút gọn).') },
    { ma: 'q6', de: hai('According to the teacher’s note on slide 43, decision tables and state transition testing mainly target…', 'Theo ghi chú của thầy/cô ở slide 43, bảng quyết định và chuyển trạng thái chủ yếu nhắm vào…'), luaChon: lc(['a', 'the user interface fields'], ['b', 'the business logic and business rules'], ['c', 'performance'], ['d', 'the database schema']), dapAn: ['b'], giaiThich: giai('EP and BVA mostly target UI fields; decision tables and state transition target business logic.', 'EP và BVA chủ yếu nhắm các trường giao diện; bảng quyết định và chuyển trạng thái nhắm logic nghiệp vụ.') },
  ],
  goiY: ['n điều kiện Boolean ⇒ 2ⁿ luật.', 'Độ phủ = luật đã test ÷ tổng luật (của bảng đang dùng).'],
  loiHayGap: ['Đếm 4 điều kiện thành 8 luật (nhầm 2×4).', 'Nghĩ “–” là điều kiện sai.'],
  giaiThich: '<p>Answers: c · c · b · c · b · b.</p>',
  thuatNgu: tn('decisionTable'),
  khaiNiem: ['decision table testing'],
});

export default doiDau({
  slug: 'swt301-blackbox-decision-state',
  ten: '4.4 Decision table testing',
  moTaModule: 'Bảng quyết định đầy đủ và rút gọn (ví dụ thẻ tín dụng của sách giáo trình), test mỗi luật một ca có kết quả mong đợi đúng, viết test theo luật giết 6 mutant, câu hỏi kiểu ISTQB.',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-decision-state',
  de: [E1, E2, E3, E4, E5],
});

void bangHtml;
