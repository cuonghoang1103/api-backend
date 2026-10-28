/**
 * SWT301 · 7.5 — Risk & testing (SWT5 slide 79–88, LO-5.5.1–5.5.3): product vs project risk, risk level, risk-based testing.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const LR = ['Product risk', 'Project risk'];
const E1 = tinhDe({
  tieuDe: 'Risk 1 — Product risk or project risk?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>A product (quality) risk threatens the product — it may fail to satisfy the legitimate needs of users and stakeholders. A project risk threatens the project’s ability to achieve its objectives (time, cost, scope). Classify each LabBook risk.</p>', vi: '<p>Rủi ro sản phẩm (chất lượng) đe doạ sản phẩm — nó có thể không đáp ứng nhu cầu chính đáng của người dùng và các bên. Rủi ro dự án đe doạ khả năng dự án đạt mục tiêu (thời gian, chi phí, phạm vi). Phân loại từng rủi ro của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Risk → kind', 'Rủi ro → loại'),
    cot: [{ ma: 'r', ten: 'Risk' }, { ma: 'k', ten: 'Kind', luaChon: LR }],
    hang: [
      'The weekly-limit calculation may count cancelled bookings',
      'The only tester may be ill during the exam weeks',
      'Booking at 07:00 on Monday may take longer than 3 seconds for 300 students',
      'The cloud test environment may be delivered two weeks late',
      'A student may see other students’ bookings (privacy leak)',
      'The e-mail supplier may not deliver the integration API on time',
      'Screen readers may not be able to read the booking form',
      'Requirements may keep changing because the department has not agreed on the rules',
    ].map((r, i) => ({ ma: `r${i}`, o: { r } })),
    dapAn: { 'r0.k': LR[0], 'r1.k': LR[1], 'r2.k': LR[0], 'r3.k': LR[1], 'r4.k': LR[0], 'r5.k': LR[1], 'r6.k': LR[0], 'r7.k': LR[1] },
    giaiThich: giai('Wrong calculations, poor performance, security and accessibility problems are product risks; people, environments, suppliers and changing requirements are project risks.', 'Tính sai, hiệu năng kém, bảo mật và khả năng tiếp cận là rủi ro sản phẩm; con người, môi trường, nhà cung cấp, yêu cầu thay đổi là rủi ro dự án.'),
  }],
  goiY: ['Hỏi: nếu xảy ra, NGƯỜI DÙNG có thấy sản phẩm hỏng không? ⇒ sản phẩm.', 'Hỏi: nếu xảy ra, DỰ ÁN có trễ/vượt chi phí không? ⇒ dự án.'],
  loiHayGap: ['Gán “nhà cung cấp giao API trễ” cho rủi ro sản phẩm.', 'Gán “yêu cầu thay đổi liên tục” cho rủi ro sản phẩm.'],
  giaiThich: '<p>P · Pj · P · Pj · P · Pj · P · Pj.</p>',
  thuatNgu: [{ en: 'product (quality) risk', vi: 'rủi ro sản phẩm (chất lượng)' }, { en: 'project risk', vi: 'rủi ro dự án' }],
  khaiNiem: ['product and project risks'],
});

const E2 = jsDe({
  tieuDe: 'Risk 2 — Fill the risk analysis template in code',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>Lesson 7.5’s worked example rates likelihood (L) and impact (I) on a 5-point scale where <b>5 = very high</b>, computes <b>risk level = L × I</b> and maps it to the extent of testing: <b>15–25 extensive</b>, <b>8–14 broad</b>, <b>4–7 cursory</b>, <b>1–3 report bugs only</b>.</p>
<p>Write <code>riskTable(risks)</code>: <code>risks</code> = <code>[{ id, name, likelihood, impact }]</code>. Return a new array of <code>{ id, level, extent }</code> sorted by level (highest first), ties by impact (highest first), then by id A→Z. Ratings outside 1–5 or non-integers make the function throw a <code>RangeError</code>.</p>`, vi: `<p>Ví dụ có lời giải của bài 7.5 chấm khả năng xảy ra (L) và tác động (I) theo thang 5 điểm với <b>5 = rất cao</b>, tính <b>mức rủi ro = L × I</b> và quy ra độ sâu kiểm thử: <b>15–25 extensive</b>, <b>8–14 broad</b>, <b>4–7 cursory</b>, <b>1–3 report bugs only</b>.</p><p>Viết <code>riskTable(risks)</code> như bản tiếng Anh: sắp theo mức (cao trước), bằng nhau thì theo tác động (cao trước), rồi theo id; điểm ngoài 1–5 hay không nguyên thì ném <code>RangeError</code>.</p>` },
  yeuCau: [{ en: 'extent is one of the strings <code>extensive</code>, <code>broad</code>, <code>cursory</code>, <code>report bugs only</code>.', vi: 'extent là một trong các chuỗi <code>extensive</code>, <code>broad</code>, <code>cursory</code>, <code>report bugs only</code>.' }],
  viDu: [{ input: "riskTable([{id:'R1',name:'Fee wrong',likelihood:3,impact:5},{id:'R4',name:'QR fails',likelihood:4,impact:4}])", output: "[{id:'R4',level:16,extent:'extensive'},{id:'R1',level:15,extent:'extensive'}]", explanation: 'The two top rows of the e-wallet example.|||Hai dòng đầu của ví dụ ví điện tử.' }],
  goiY: ['Kiểm đầu vào trước: Number.isInteger(x) && x >= 1 && x <= 5.', 'Sắp: (b.level − a.level) || (b.impact − a.impact) || id.'],
  loiHayGap: ['Nhầm thang: ở thang fst4 1 mới là “rất cao” — bài này dùng 5 = rất cao.', 'Biên 15 thuộc extensive, 8 thuộc broad, 4 thuộc cursory.'],
  giaiThich: '<p>Risk level drives thoroughness and order: extensive areas get formal techniques and run first; “report bugs only” areas get no planned tests at all.</p>',
  thuatNgu: [{ en: 'likelihood', vi: 'khả năng xảy ra' }, { en: 'impact', vi: 'tác động / thiệt hại' }, { en: 'risk level', vi: 'mức rủi ro' }, { en: 'extent of testing', vi: 'độ sâu kiểm thử' }],
  khaiNiem: ['risk level', 'risk-based testing'],
  tep: {
    'risk.js': [
      'function riskTable(risks) {\n  return risks.map((r) => ({ id: r.id, level: 0, extent: \'\' }));\n}\n',
      `function riskTable(risks) {
  const ok = (x) => Number.isInteger(x) && x >= 1 && x <= 5;
  const extent = (n) => (n >= 15 ? 'extensive' : n >= 8 ? 'broad' : n >= 4 ? 'cursory' : 'report bugs only');
  for (const r of risks) if (!ok(r.likelihood) || !ok(r.impact)) throw new RangeError('rating of ' + r.id + ' must be an integer 1-5');
  return risks
    .map((r) => ({ id: r.id, level: r.likelihood * r.impact, impact: r.impact }))
    .sort((a, b) => b.level - a.level || b.impact - a.impact || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map((r) => ({ id: r.id, level: r.level, extent: extent(r.level) }));
}
`,
    ],
  },
  kiem: [
    kiemTuy({ en: 'the e-wallet example of the lesson', vi: 'ví dụ ví điện tử của bài' }, () => { const r = riskTable([{ id: 'R1', name: 'fee', likelihood: 3, impact: 5 }, { id: 'R2', name: 'lockout', likelihood: 2, impact: 5 }, { id: 'R3', name: 'pdf', likelihood: 4, impact: 3 }, { id: 'R4', name: 'qr', likelihood: 4, impact: 4 }, { id: 'R5', name: 'theme', likelihood: 3, impact: 1 }, { id: 'R6', name: 'push', likelihood: 3, impact: 2 }]); const w = [['R4', 16, 'extensive'], ['R1', 15, 'extensive'], ['R3', 12, 'broad'], ['R2', 10, 'broad'], ['R6', 6, 'cursory'], ['R5', 3, 'report bugs only']]; return JSON.stringify(r) === JSON.stringify(w.map(([id, level, extent]) => ({ id, level, extent }))) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'boundaries 15, 8, 4 and 3', vi: 'biên 15, 8, 4 và 3' }, () => { const r = riskTable([{ id: 'A', likelihood: 3, impact: 5 }, { id: 'B', likelihood: 2, impact: 4 }, { id: 'C', likelihood: 2, impact: 2 }, { id: 'D', likelihood: 1, impact: 3 }]); return r.map((x) => x.extent).join('|') === 'extensive|broad|cursory|report bugs only' ? 'OK' : 'got ' + r.map((x) => x.level + ':' + x.extent).join(', '); }),
    kiemTuy({ en: 'ties: higher impact first, then id', vi: 'bằng nhau: tác động cao trước, rồi id' }, () => { const r = riskTable([{ id: 'Z', likelihood: 4, impact: 3 }, { id: 'Y', likelihood: 3, impact: 4 }, { id: 'X', likelihood: 3, impact: 4 }]); return r.map((x) => x.id).join('') === 'XYZ' ? 'OK' : 'got ' + r.map((x) => x.id).join(''); }),
    kiemTuy({ en: 'invalid ratings throw RangeError', vi: 'điểm không hợp lệ ném RangeError' }, () => { const t = (r) => { try { riskTable([r]); return false; } catch (e) { return e instanceof RangeError; } }; return t({ id: 'a', likelihood: 0, impact: 3 }) && t({ id: 'b', likelihood: 3, impact: 6 }) && t({ id: 'c', likelihood: 2.5, impact: 3 }) ? 'OK' : 'ratings 0, 6 and 2.5 must throw RangeError'; }, { an: true }),
    kiemTuy({ en: 'the input array is not reordered', vi: 'không sắp lại mảng đầu vào' }, () => { const a = [{ id: 'low', likelihood: 1, impact: 1 }, { id: 'high', likelihood: 5, impact: 5 }]; riskTable(a); return a[0].id === 'low' ? 'OK' : 'the input array was sorted in place'; }, { an: true }),
  ],
});

const MUC_DO = ['Extensive', 'Broad', 'Cursory', 'Report bugs only'];
const E3 = tinhDe({
  tieuDe: 'Risk 3 — How does risk change the test approach?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>LO-5.5.3: product risk analysis influences the thoroughness and scope of testing — which techniques, which levels and types, how much, in what order. For each planned approach, decide which extent of testing it belongs to.</p>', vi: '<p>LO-5.5.3: phân tích rủi ro sản phẩm ảnh hưởng độ kỹ lưỡng và phạm vi kiểm thử — kỹ thuật nào, cấp và loại nào, bao nhiêu, theo thứ tự nào. Với mỗi cách tiếp cận dự kiến, xác định nó thuộc độ sâu nào.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Approach → extent', 'Cách tiếp cận → độ sâu'),
    cot: [{ ma: 'a', ten: 'Planned approach' }, { ma: 'e', ten: 'Extent', luaChon: MUC_DO }],
    hang: [
      'EP + BVA on every band, decision tables, code review of the formula, decision coverage, run first in every cycle',
      'EP on the main inputs and a use-case test of the main scenario, run after the extensive areas',
      'One exploratory session per release, no scripted tests',
      'No planned tests; if a tester happens to see a problem, it is reported',
    ].map((a, i) => ({ ma: `r${i}`, o: { a } })),
    dapAn: { 'r0.e': MUC_DO[0], 'r1.e': MUC_DO[1], 'r2.e': MUC_DO[2], 'r3.e': MUC_DO[3] },
    giaiThich: giai('Higher risk ⇒ more formal techniques, more coverage, earlier execution; low risk ⇒ light or no testing.', 'Rủi ro cao ⇒ kỹ thuật hình thức hơn, độ phủ cao hơn, chạy sớm hơn; rủi ro thấp ⇒ test nhẹ hoặc không test.'),
  }],
  goiY: ['Nhiều kỹ thuật + chạy trước ⇒ extensive.', 'Chỉ khám phá ⇒ cursory.'],
  loiHayGap: ['Cho rằng rủi ro chỉ ảnh hưởng SỐ LƯỢNG test, không ảnh hưởng thứ tự và kỹ thuật.', 'Gán “một phiên khám phá” cho broad.'],
  giaiThich: '<p>Extensive · Broad · Cursory · Report bugs only.</p>',
  thuatNgu: [{ en: 'thoroughness', vi: 'độ kỹ lưỡng' }],
  khaiNiem: ['risk-based testing'],
});

const E4 = tinhDe({
  tieuDe: 'Risk 4 — Exam questions on risk (K1–K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six FE-style questions on SWT5 slides 79–88: the definition of risk level, risk-based testing, what to do with project risks and who should take part in a risk analysis.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT5 79–88: định nghĩa mức rủi ro, risk-based testing, xử lý rủi ro dự án và ai nên tham gia phân tích rủi ro.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('The level of risk is determined by…', 'Mức rủi ro được xác định bởi…'), luaChon: lc(['a', 'the number of test cases'], ['b', 'the likelihood of the event and its impact (harm)'], ['c', 'the experience of the tester'], ['d', 'the size of the code']), dapAn: ['b'], giaiThich: giai('Risk level = likelihood × impact.', 'Mức rủi ro = khả năng × tác động.') },
    { ma: 'q2', de: hai('Which is the best description of risk-based testing?', 'Mô tả đúng nhất về risk-based testing?'), luaChon: lc(['a', 'Testing only the riskiest feature'], ['b', 'Using product-risk analysis to select, prioritise and decide the thoroughness of test activities, to reduce the risk level'], ['c', 'Testing after a failure in production'], ['d', 'Testing with random data']), dapAn: ['b'], giaiThich: giai('Identify, assess, mitigate — and keep re-assessing.', 'Nhận diện, đánh giá, giảm thiểu — và đánh giá lại liên tục.') },
    { ma: 'q3', de: hai('How are project risks typically handled?', 'Rủi ro dự án thường được xử lý thế nào?'), luaChon: lc(['a', 'By more test cases'], ['b', 'By project-management actions — mitigation, contingency plans, transfer or acceptance — recorded in the test plan'], ['c', 'They are ignored'], ['d', 'Only by the developers']), dapAn: ['b'], giaiThich: giai('Testing mitigates product risks; project risks need management actions.', 'Kiểm thử giảm rủi ro sản phẩm; rủi ro dự án cần hành động quản lý.') },
    { ma: 'q4', de: hai('Who should take part in a product-risk analysis?', 'Ai nên tham gia phân tích rủi ro sản phẩm?'), luaChon: lc(['a', 'Only the testers'], ['b', 'A broad range of stakeholders — business people (impact) and technical people (likelihood) among them'], ['c', 'Only the customer'], ['d', 'Only the project manager']), dapAn: ['b'], giaiThich: giai('The worked example: business gave impact, developers gave likelihood.', 'Ví dụ mẫu: nghiệp vụ cho tác động, developer cho khả năng xảy ra.') },
    { ma: 'q5', de: hai('After testing, residual risk is…', 'Sau khi test, rủi ro còn lại là…'), luaChon: lc(['a', 'always zero'], ['b', 'the risk that remains; it is reported so stakeholders can decide to release'], ['c', 'the number of passed tests'], ['d', 'not reported']), dapAn: ['b'], giaiThich: giai('Testing reduces, never removes, risk; the summary report states residual risk.', 'Kiểm thử giảm, không xoá rủi ro; báo cáo tổng kết nêu rủi ro còn lại.') },
    { ma: 'q6', de: hai('Which is an example of a project risk that testers themselves may cause?', 'Đâu là ví dụ rủi ro dự án do chính tester gây ra?'), luaChon: lc(['a', 'A security hole in the product'], ['b', 'Low quality of the test design or poor communication of test results'], ['c', 'Slow response time'], ['d', 'A wrong calculation']), dapAn: ['b'], giaiThich: giai('Technical/organisational issues include skills, communication and test-environment problems.', 'Vấn đề kỹ thuật/tổ chức gồm kỹ năng, giao tiếp và môi trường test.') },
  ],
  goiY: ['Rủi ro sản phẩm ⇒ test; rủi ro dự án ⇒ quản lý.', 'Mức rủi ro = L × I.'],
  loiHayGap: ['Cho rằng risk-based testing là chỉ test phần rủi ro nhất.', 'Cho rằng sau khi test thì không còn rủi ro.'],
  giaiThich: '<p>Answers: b · b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'mitigation', vi: 'giảm thiểu' }, { en: 'contingency', vi: 'phương án dự phòng' }, { en: 'residual risk', vi: 'rủi ro còn lại' }],
  khaiNiem: ['risk-based testing'],
});

export default doiDau({
  slug: 'swt301-risk-based-testing',
  ten: '7.5 Risk and testing',
  moTaModule: 'Phân biệt rủi ro sản phẩm/dự án trên LabBook, viết code bảng phân tích rủi ro (L × I, độ sâu kiểm thử), rủi ro thay đổi cách tiếp cận test, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-risk-based-testing',
  de: [E1, E2, E3, E4],
});
