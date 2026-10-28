/**
 * SWT301 · 9.6 — TDD, ATDD, BDD, the test pyramid and the testing quadrants (Agile Tester §3.1).
 */
import { doiDau, KHOA, hai, giai, lc, preMa } from './_chung.mjs';
import { tinhDe, dotBienDe, TN_TEST } from './_de.mjs';

const PP = ['TDD', 'ATDD', 'BDD'];
const E1 = tinhDe({
  tieuDe: 'Test-first 1 — TDD, ATDD or BDD?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>TDD works at unit level for developers; ATDD at story level with the power of three; BDD writes the behaviour in business language (Given/When/Then). Classify each statement.</p>', vi: '<p>TDD ở cấp unit cho developer; ATDD ở cấp story với power of three; BDD viết hành vi bằng ngôn ngữ nghiệp vụ (Given/When/Then). Phân loại từng phát biểu.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → method', 'Phát biểu → phương pháp'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'm', ten: 'Method', luaChon: PP }],
    hang: [
      'Write a failing JUnit test, write just enough code to pass it, then refactor',
      'In a specification workshop the developer, the tester and the product owner turn the acceptance criteria into examples before coding',
      'Scenarios such as “Given a full lab, When a student books, Then the booking is PENDING” are run by Cucumber',
      'Tests guide the design of each class and form a regression safety net',
      'The acceptance tests are executable requirements that the whole team agreed on',
      'Non-programmers can read and review the automated tests because they are written in Gherkin',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.m': PP[0], 'r1.m': PP[1], 'r2.m': PP[2], 'r3.m': PP[0], 'r4.m': PP[1], 'r5.m': PP[2] },
    giaiThich: giai('TDD: red–green–refactor at unit level; ATDD: examples from acceptance criteria agreed by the three amigos; BDD: Given/When/Then in business language, run by tools like Cucumber.', 'TDD: đỏ–xanh–refactor ở cấp unit; ATDD: ví dụ từ acceptance criteria do ba người thống nhất; BDD: Given/When/Then bằng ngôn ngữ nghiệp vụ, chạy bằng Cucumber.'),
  }],
  goiY: ['JUnit + refactor ⇒ TDD.', 'Gherkin, Cucumber ⇒ BDD.'],
  loiHayGap: ['Nhầm ATDD với BDD — BDD là ATDD viết theo hành vi, bằng Given/When/Then.', 'Cho rằng TDD do tester làm.'],
  giaiThich: '<p>TDD · ATDD · BDD · TDD · ATDD · BDD.</p>',
  thuatNgu: [{ en: 'red–green–refactor', vi: 'đỏ (test trượt) – xanh (test đạt) – refactor' }, { en: 'Gherkin', vi: 'ngôn ngữ Given/When/Then' }, { en: 'specification workshop', vi: 'buổi làm rõ đặc tả' }],
  khaiNiem: ['TDD', 'ATDD', 'BDD'],
});

const QD = ['Q1 — technology-facing, supporting the team', 'Q2 — business-facing, supporting the team', 'Q3 — business-facing, critiquing the product', 'Q4 — technology-facing, critiquing the product'];
const E2 = tinhDe({
  tieuDe: 'Test-first 2 — Put LabBook tests in the testing quadrants',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Rule of thumb from the lesson: first ask who can judge the result (business person → Q2/Q3; only a technical person or a tool → Q1/Q4), then whether the test guides the build (support → Q1/Q2) or evaluates the finished product (critique → Q3/Q4).</p>', vi: '<p>Mẹo của bài: hỏi trước ai đánh giá được kết quả (người nghiệp vụ → Q2/Q3; chỉ người kỹ thuật hay công cụ → Q1/Q4), rồi test đó dẫn dắt việc xây (hỗ trợ → Q1/Q2) hay đánh giá sản phẩm đã xong (phê bình → Q3/Q4).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Test → quadrant', 'Test → góc'),
    cot: [{ ma: 't', ten: 'Test' }, { ma: 'q', ten: 'Quadrant', luaChon: QD }],
    hang: [
      'TDD unit tests of calcRefund run in CI',
      'Gherkin scenarios of the story “waitlist promotion” written in the specification workshop',
      'Exploratory session on the new lab-map screen with the lab manager',
      'Load test with 500 students booking at 07:00',
      'Component tests of WaitList with mocks',
      'A clickable prototype of the booking flow reviewed with students before coding',
      'Usability test with five first-year students during the sprint review',
      'Security scan for SQL injection on the API',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.q': QD[0], 'r1.q': QD[1], 'r2.q': QD[2], 'r3.q': QD[3], 'r4.q': QD[0], 'r5.q': QD[1], 'r6.q': QD[2], 'r7.q': QD[3] },
    giaiThich: giai('Q1 unit/component (TDD); Q2 functional tests, examples, story tests, prototypes (ATDD/BDD); Q3 exploratory, usability, UAT, alpha/beta; Q4 performance, load, security and other “-ilities”.', 'Q1 unit/component (TDD); Q2 test chức năng, ví dụ, story test, prototype (ATDD/BDD); Q3 khám phá, khả dụng, UAT, alpha/beta; Q4 hiệu năng, tải, bảo mật và các “-ility”.'),
  }],
  goiY: ['Prototype trước khi code ⇒ hỗ trợ đội ⇒ Q2.', 'Hiệu năng, bảo mật ⇒ Q4.'],
  loiHayGap: ['Cho rằng các góc là một trình tự (Q1 làm trước).', 'Đặt usability vào Q4 — người dùng đánh giá được ⇒ Q3.'],
  giaiThich: '<p>Q1 · Q2 · Q3 · Q4 · Q1 · Q2 · Q3 · Q4.</p>',
  thuatNgu: [{ en: 'testing quadrants', vi: 'bốn góc kiểm thử Agile' }],
  khaiNiem: ['testing quadrants'],
});

const E3 = tinhDe({
  tieuDe: 'Test-first 3 — One TDD cycle in the right order',
  doKho: 'EASY', phut: 4,
  moTa: { en: '<p>A developer implements “the 50% refund band starts at exactly 2 hours” test-first. Order the steps of one TDD cycle.</p>', vi: '<p>Một developer cài “mức hoàn 50% bắt đầu từ đúng 2 giờ” theo lối test trước. Sắp các bước của một vòng TDD.</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('One TDD cycle', 'Một vòng TDD'), muc: lc(['c', 'Write the simplest code that makes the test pass'], ['a', 'Write a test refund(100000, 2) === 50000'], ['e', 'Refactor the code and the test, keeping all tests green'], ['b', 'Run it and watch it fail (red)'], ['d', 'Run all tests and see them pass (green)']), dapAn: ['a', 'b', 'c', 'd', 'e'], giaiThich: giai('Red → green → refactor; then the next test.', 'Đỏ → xanh → refactor; rồi tới test kế tiếp.') }],
  goiY: ['Phải thấy test trượt trước khi viết mã.', 'Refactor khi mọi test đã xanh.'],
  loiHayGap: ['Viết mã trước rồi mới viết test.', 'Refactor khi test còn đỏ.'],
  giaiThich: '<p>a → b → c → d → e.</p>',
  thuatNgu: [{ en: 'refactor', vi: 'tái cấu trúc mã không đổi hành vi' }],
  khaiNiem: ['TDD'],
});

/* E4 — ATDD: viết test từ acceptance criteria của US-17 (miễn phí vận chuyển từ 500.000 đ) */
const DUNG = `function shippingFee(order) {
  if (!order || !Number.isInteger(order.total) || order.total < 0) throw new RangeError('INVALID_TOTAL');
  if (order.total >= 500000) return 0;
  if (order.member === 'GOLD') return 15000;
  return order.express ? 45000 : 30000;
}`;
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant: ' + a); return DUNG.replace(a, b); };
const E4 = dotBienDe({
  tieuDe: 'Test-first 4 — From acceptance criteria to executable tests (US-17)',
  doKho: 'MEDIUM', phut: 18,
  moTa: { en: `<p>The running example of lesson 9.6, <b>US-17</b>: “As a shopper I want free shipping on big orders so that I order more.” Acceptance criteria agreed by the three amigos:</p>${preMa(`AC1  Given an order total of 500,000 VND or more, the shipping fee is 0 (express included).
AC2  Given a total below 500,000, a standard order costs 30,000 and an express order 45,000.
AC3  Given a total below 500,000 and a GOLD member, the fee is 15,000 whatever the speed.
AC4  A negative or non-integer total is rejected (RangeError).`)}<p>Write the acceptance tests in <code>tests.js</code> as Given/When/Then-named tests (e.g. <code>test.each</code> with the boundary pair 499,999 / 500,000). The implementation:</p>${preMa(DUNG)}`, vi: `<p>Ví dụ xuyên suốt của bài 9.6, <b>US-17</b>: miễn phí vận chuyển cho đơn lớn, với bốn acceptance criteria như trên (≥ 500.000 → 0; dưới đó thường 30.000, nhanh 45.000; thành viên GOLD 15.000; tổng âm hay không nguyên bị từ chối). Viết acceptance test trong <code>tests.js</code>, đặt tên theo Given/When/Then (vd <code>test.each</code> với cặp biên 499.999 / 500.000).</p>` },
  yeuCau: [{ en: 'One test (or row) per acceptance criterion at least, plus the boundary pair.', vi: 'Mỗi acceptance criterion ít nhất một test (hoặc một dòng), cộng cặp biên.' }],
  viDu: [{ input: "test('Given a total of 500,000 When shipping is calculated Then it is free', …)", output: 'kills the mutant that starts free shipping above 500,000', explanation: 'ATDD gives the developer the boundary to unit-test.|||ATDD chỉ cho developer biên cần test.' }],
  goiY: ['Cặp biên: 499.999 (tính phí) và 500.000 (miễn phí).', 'GOLD + express dưới ngưỡng ⇒ 15.000; GOLD trên ngưỡng ⇒ 0.', 'Lỗi: −1 và 1000.5.'],
  loiHayGap: ['Chỉ test 1.000.000 và 100.000 — mutant lệch biên sống sót.', 'Quên trường hợp GOLD đặt hàng nhanh.'],
  giaiThich: '<p>Each acceptance criterion becomes at least one executable example; the boundary pair 499,999 / 500,000 is exactly what ATDD hands over to TDD. In Gherkin: <code>Scenario Outline … Examples: | total | express | member | fee |</code>.</p>',
  thuatNgu: [...TN_TEST(), { en: 'Scenario Outline', vi: 'kịch bản mẫu chạy với bảng Examples' }],
  ten: ['shippingFee'], dung: DUNG, minTest: 8,
  dotBien: [
    { ma: 'M1', moTa: { en: 'free shipping starts above 500,000 (not at)', vi: 'miễn phí từ trên 500.000 (không gồm 500.000)' }, code: doi('order.total >= 500000', 'order.total > 500000') },
    { ma: 'M2', moTa: { en: 'GOLD members pay 15,000 even on big orders', vi: 'GOLD trả 15.000 cả với đơn lớn' }, code: doi("  if (order.total >= 500000) return 0;\n  if (order.member === 'GOLD') return 15000;", "  if (order.member === 'GOLD') return 15000;\n  if (order.total >= 500000) return 0;") },
    { ma: 'M3', moTa: { en: 'express costs the same as standard', vi: 'giao nhanh giá như thường' }, code: doi('order.express ? 45000 : 30000', '30000') },
    { ma: 'M4', moTa: { en: 'GOLD express pays 45,000', vi: 'GOLD giao nhanh trả 45.000' }, code: doi("if (order.member === 'GOLD') return 15000;", "if (order.member === 'GOLD' && !order.express) return 15000;") },
    { ma: 'M5', moTa: { en: 'a negative total is accepted', vi: 'nhận tổng âm' }, code: doi(' || order.total < 0', '') },
    { ma: 'M6', an: true, moTa: { en: 'a non-integer total is accepted', vi: 'nhận tổng không nguyên' }, code: doi('!Number.isInteger(order.total)', "typeof order.total !== 'number'") },
    { ma: 'M7', an: true, moTa: { en: 'express orders above the threshold are charged', vi: 'đơn nhanh trên ngưỡng vẫn tính phí' }, code: doi('if (order.total >= 500000) return 0;', 'if (order.total >= 500000 && !order.express) return 0;') },
  ],
  dauTest: "// US-17 acceptance tests (ATDD). Name each test Given … When … Then ….\ntest('Given a total of 1,000,000 When shipping is calculated Then it is free', () => {\n  expect(shippingFee({ total: 1000000 })).toBe(0);\n});\n",
  giaiTest: `// US-17 acceptance tests (ATDD) — one or more examples per acceptance criterion.
// Gherkin: Scenario Outline: shipping fee | Examples: | total | express | member | fee |
test.each([
  [500000, false, null, 0],        // AC1 boundary: exactly 500,000 is free
  [500000, true, null, 0],         // AC1: express included
  [1000000, false, 'GOLD', 0],     // AC1 wins over AC3
  [499999, false, null, 30000],    // AC2 boundary: just below
  [499999, true, null, 45000],     // AC2 express
  [100000, false, 'GOLD', 15000],  // AC3
  [100000, true, 'GOLD', 15000],   // AC3 whatever the speed
])('Given total %p, express %p, member %p When shipping is calculated Then the fee is %p', (total, express, member, fee) => {
  expect(shippingFee({ total, express, member })).toBe(fee);
});

test.each([[-1], [1000.5]])('Given total %p When shipping is calculated Then it is rejected', (total) => {
  expect(() => shippingFee({ total })).toThrow(RangeError);
});
`,
});

export default doiDau({
  slug: 'swt301-tdd-bdd',
  ten: '9.6 TDD, ATDD, BDD and the testing quadrants',
  moTaModule: 'Phân biệt TDD/ATDD/BDD, đặt test LabBook vào bốn góc kiểm thử, sắp một vòng TDD, viết acceptance test cho US-17 từ acceptance criteria (chấm bằng mutant).',
  khoa: KHOA,
  baiHoc: 'swt301-tdd-bdd',
  de: [E1, E2, E3, E4],
});
