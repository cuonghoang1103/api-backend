/**
 * SWT301 · 9.1 — Agile fundamentals: manifesto, whole team, early feedback (Topic 8 slide 1–22, FA-1.1.1–1.1.3).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const VE = ['Valued more (left side)', 'Still valued, but less (right side)'];
const E1 = tinhDe({
  tieuDe: 'Agile 1 — Left or right side of the Agile Manifesto?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>The four values: <b>individuals and interactions</b> over processes and tools · <b>working software</b> over comprehensive documentation · <b>customer collaboration</b> over contract negotiation · <b>responding to change</b> over following a plan. “While there is value in the items on the right, we value the items on the left more.” Classify each item.</p>', vi: '<p>Bốn giá trị: <b>cá nhân và tương tác</b> hơn quy trình và công cụ · <b>phần mềm chạy được</b> hơn tài liệu đầy đủ · <b>cộng tác với khách hàng</b> hơn đàm phán hợp đồng · <b>phản hồi thay đổi</b> hơn bám kế hoạch. “Vế phải vẫn có giá trị, nhưng vế trái được coi trọng hơn.” Phân loại từng mục.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Item → side', 'Mục → vế'),
    cot: [{ ma: 'i', ten: 'Item' }, { ma: 's', ten: 'Side', luaChon: VE }],
    hang: ['Working software', 'Comprehensive documentation', 'Customer collaboration', 'Contract negotiation', 'Following a plan', 'Responding to change', 'Processes and tools', 'Individuals and interactions'].map((i, k) => ({ ma: `r${k}`, o: { i } })),
    dapAn: { 'r0.s': VE[0], 'r1.s': VE[1], 'r2.s': VE[0], 'r3.s': VE[1], 'r4.s': VE[1], 'r5.s': VE[0], 'r6.s': VE[1], 'r7.s': VE[0] },
    giaiThich: giai('The right-hand items are not worthless — Agile teams still write documents, sign contracts, plan and use tools; they just value the left-hand items more.', 'Vế phải không vô giá trị — đội Agile vẫn viết tài liệu, ký hợp đồng, lập kế hoạch, dùng công cụ; chỉ là coi trọng vế trái hơn.'),
  }],
  goiY: ['Vế trái: con người, phần mềm chạy, khách hàng, thay đổi.', 'Vế phải vẫn CÓ giá trị.'],
  loiHayGap: ['Cho rằng Agile bỏ hẳn tài liệu.', 'Đặt “quy trình và công cụ” ở vế trái.'],
  giaiThich: '<p>L · R · L · R · R · L · R · L.</p>',
  thuatNgu: [{ en: 'Agile Manifesto', vi: 'Tuyên ngôn Agile' }],
  khaiNiem: ['Agile Manifesto'],
});

const E2 = tinhDe({
  tieuDe: 'Agile 2 — Whole team, power of three, early feedback (K1–K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six questions on Topic 8 slides 1–22: the twelve principles, the whole-team approach, the “power of three” and the benefits of early and frequent feedback.</p>', vi: '<p>Sáu câu về slide Topic 8 1–22: mười hai nguyên tắc, whole-team approach, “power of three” và lợi ích của phản hồi sớm, thường xuyên.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is an Agile principle?', 'Đâu là một nguyên tắc Agile?'), luaChon: lc(['a', 'Freeze the requirements at the start'], ['b', 'Welcome changing requirements, even late in development'], ['c', 'Deliver once at the end'], ['d', 'Testers work apart from developers']), dapAn: ['b'], giaiThich: giai('Change is harnessed for the customer’s competitive advantage.', 'Thay đổi được tận dụng vì lợi thế của khách hàng.') },
    { ma: 'q2', de: hai('What is the primary measure of progress in Agile?', 'Thước đo tiến độ chính trong Agile là gì?'), luaChon: lc(['a', 'Number of documents'], ['b', 'Working software'], ['c', 'Lines of code'], ['d', 'Hours worked']), dapAn: ['b'], giaiThich: giai('Principle 7.', 'Nguyên tắc 7.') },
    { ma: 'q3', de: hai('Which is a benefit of the whole-team approach?', 'Lợi ích của whole-team approach?'), luaChon: lc(['a', 'Testers are not needed'], ['b', 'Better communication and collaboration; the team’s skills are used together and quality is everyone’s responsibility'], ['c', 'Fewer meetings'], ['d', 'No documentation']), dapAn: ['b'], giaiThich: giai('Tester, developers and business work as one team.', 'Tester, developer và nghiệp vụ làm việc như một đội.') },
    { ma: 'q4', de: hai('The “power of three” means…', '“Power of three” nghĩa là…'), luaChon: lc(['a', 'three testers per developer'], ['b', 'a tester, a developer and a business representative discuss every feature together'], ['c', 'three test levels'], ['d', 'three sprints per release']), dapAn: ['b'], giaiThich: giai('Also called the three amigos.', 'Còn gọi là “ba người bạn”.') },
    { ma: 'q5', de: hai('Which is a benefit of early and frequent feedback?', 'Lợi ích của phản hồi sớm và thường xuyên?'), luaChon: lc(['a', 'Avoiding requirement misunderstandings that would be found late and be expensive'], ['b', 'No need for testing'], ['c', 'Longer iterations'], ['d', 'Fewer releases']), dapAn: ['a'], giaiThich: giai('Also: clarifying features early, finding quality problems early, visible productivity, momentum.', 'Cùng với: làm rõ tính năng sớm, tìm vấn đề chất lượng sớm, năng suất thấy được, giữ đà.') },
    { ma: 'q6', de: hai('What is a typical size of an Agile team?', 'Quy mô điển hình của đội Agile?'), luaChon: lc(['a', '3 to 9 people'], ['b', '20 to 30 people'], ['c', '1 person'], ['d', 'No limit']), dapAn: ['a'], giaiThich: giai('Small, co-located, cross-functional, meeting daily.', 'Nhỏ, ngồi cùng nhau, đa năng, họp hằng ngày.') },
  ],
  goiY: ['Tiến độ = phần mềm chạy được.', 'Power of three = tester + developer + nghiệp vụ.'],
  loiHayGap: ['Cho rằng whole team nghĩa là không cần tester.', 'Nhầm power of three với ba cấp test.'],
  giaiThich: '<p>Answers: b · b · b · b · a · a.</p>',
  thuatNgu: [{ en: 'whole-team approach', vi: 'cách làm cả đội cùng chịu trách nhiệm chất lượng' }, { en: 'three amigos', vi: 'tester + developer + nghiệp vụ' }],
  khaiNiem: ['whole-team approach'],
});

const NT = ['Early and continuous delivery of valuable software', 'Welcome changing requirements', 'Business people and developers work together daily', 'Face-to-face conversation', 'Sustainable pace', 'Simplicity — maximise the work not done', 'Regular reflection and adjustment (retrospective)'];
const E3 = tinhDe({
  tieuDe: 'Agile 3 — Which principle is the LabBook team applying?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Seven situations from the LabBook team’s sprints. Name the Agile principle each one shows.</p>', vi: '<p>Bảy tình huống trong các sprint của nhóm LabBook. Gọi tên nguyên tắc Agile mà mỗi tình huống thể hiện.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → principle', 'Tình huống → nguyên tắc'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'p', ten: 'Principle', luaChon: NT }],
    hang: [
      'Every two weeks students get a new working version with one more feature',
      'In sprint 5 the department asks for an exam-week rule; the team adds it to the backlog instead of refusing',
      'The lab manager sits with the team every morning for 15 minutes',
      'The tester walks to the developer’s desk instead of writing a long e-mail',
      'The team refuses to work every weekend before the demo, to keep quality steady',
      'The team drops the “export to PDF” idea that no user asked for',
      'At the end of each sprint the team discusses what to keep and what to change',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: Object.fromEntries(NT.map((n, i) => [`r${i}.p`, n])),
    giaiThich: giai('Rows map to the principles in the order listed.', 'Các dòng ứng với nguyên tắc theo đúng thứ tự liệt kê.'),
  }],
  goiY: ['Bỏ việc không cần ⇒ simplicity.', 'Cuối sprint bàn cải tiến ⇒ retrospective.'],
  loiHayGap: ['Nhầm “giao thường xuyên” với “đón nhận thay đổi”.', 'Nhầm nhịp làm việc bền vững với tự tổ chức.'],
  giaiThich: '<p>In order.</p>',
  thuatNgu: [{ en: 'sustainable pace', vi: 'nhịp làm việc bền vững' }],
  khaiNiem: ['Agile principles'],
});

export default doiDau({
  slug: 'swt301-agile-quadrants',
  ten: '9.1 Agile fundamentals: manifesto, whole team, feedback',
  moTaModule: 'Bốn giá trị Agile (vế trái/vế phải), whole team, power of three, phản hồi sớm, nhận diện nguyên tắc Agile trong các sprint LabBook.',
  khoa: KHOA,
  baiHoc: 'swt301-agile-quadrants',
  de: [E1, E2, E3],
});
