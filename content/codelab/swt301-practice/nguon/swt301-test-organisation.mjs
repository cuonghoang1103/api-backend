/**
 * SWT301 · 7.1 — Test organisation: independence, test manager & tester (SWT5 slide 1–24, LO-5.1.1–5.1.2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const MUC = ['Developer tests own code', 'Tester inside the development team', 'Independent test team', 'Internal test specialists / consultants', 'Third-party organisation'];
const E1 = tinhDe({
  tieuDe: 'Organisation 1 — Which level of independence is this?',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>SWT5 shows five usual levels of test independence, from low to high. Each sentence describes the typical use, a benefit or a drawback of one level. Name the level.</p>', vi: '<p>SWT5 nêu năm mức độc lập kiểm thử thường gặp, từ thấp tới cao. Mỗi câu mô tả cách dùng điển hình, một lợi ích hay một hạn chế của một mức. Gọi tên mức đó.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Sentence → level', 'Câu → mức'),
    cot: [{ ma: 's', ten: 'Sentence' }, { ma: 'l', ten: 'Level', luaChon: MUC }],
    hang: [
      'Knows the code best and fixes cheaply, but “sees” what he expects to see',
      'Shares the team’s goal and sits next to the developers in the sprint, but may give in to peer pressure',
      'Dedicated and objective in system testing, but developers may stop caring about quality (“throw it over the wall”)',
      'A usability or security expert inside the company: deep expertise, but only influence, not authority',
      'An outsourced certification lab: independent of internal politics, but lacks product knowledge and is expensive',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: Object.fromEntries(MUC.map((m, i) => [`r${i}.l`, m])),
    giaiThich: giai('The essentials table of lesson 7.1, row by row.', 'Bảng cốt lõi của bài 7.1, lần lượt từng dòng.'),
  }],
  goiY: ['Càng xa nhóm phát triển càng độc lập nhưng càng thiếu hiểu biết sản phẩm.', '“Ném qua tường” là nhược điểm của nhóm test tách riêng.'],
  loiHayGap: ['Cho rằng mức độc lập cao nhất luôn tốt nhất.', 'Nhầm chuyên gia nội bộ với tổ chức bên thứ ba.'],
  giaiThich: '<p>Rows 1–5 = levels 1–5.</p>',
  thuatNgu: [{ en: 'independent testing', vi: 'kiểm thử độc lập' }, { en: 'peer pressure', vi: 'áp lực đồng nghiệp' }],
  khaiNiem: ['independent testing'],
});

const VAI = ['Test manager', 'Tester'];
const E2 = tinhDe({
  tieuDe: 'Organisation 2 — Test manager or tester?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>The test manager plans, monitors and controls testing; the tester analyses, designs, implements and executes tests (LO-5.1.2). Assign each LabBook task.</p>', vi: '<p>Test manager lập kế hoạch, giám sát và kiểm soát kiểm thử; tester phân tích, thiết kế, triển khai và thực thi test (LO-5.1.2). Giao từng việc của LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Task → role', 'Việc → vai trò'),
    cot: [{ ma: 't', ten: 'Task' }, { ma: 'r', ten: 'Role', luaChon: VAI }],
    hang: [
      'Write the test policy and strategy for the LabBook programme together with the university',
      'Review the booking user stories and contribute to their test conditions',
      'Estimate the test effort of release 2.1 and acquire the resources',
      'Design boundary tests for the weekly limit and prepare the test data',
      'Decide on the introduction of a test-management tool and of metrics',
      'Run the regression suite on build 2.1.3 and log the failures',
      'Write the test summary report for the go/no-go meeting',
      'Automate the smoke tests and keep them running in CI',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.r': VAI[0], 'r1.r': VAI[1], 'r2.r': VAI[0], 'r3.r': VAI[1], 'r4.r': VAI[0], 'r5.r': VAI[1], 'r6.r': VAI[0], 'r7.r': VAI[1] },
    giaiThich: giai('Policy, strategy, estimation, resources, tools and metrics, reports to stakeholders = test manager; reviewing work products, test design, data, execution, automation = tester.', 'Chính sách, chiến lược, ước lượng, nguồn lực, công cụ và số đo, báo cáo cho các bên = test manager; review sản phẩm, thiết kế test, dữ liệu, thực thi, tự động hoá = tester.'),
  }],
  goiY: ['Việc mang tính tổ chức/quyết định ⇒ test manager.', 'Việc chạm trực tiếp vào test case, dữ liệu, script ⇒ tester.'],
  loiHayGap: ['Gán viết test summary report cho tester.', 'Gán review user story cho test manager — tester đóng góp review.'],
  giaiThich: '<p>TM · T · TM · T · TM · T · TM · T.</p>',
  thuatNgu: [{ en: 'test manager / test leader', vi: 'quản lý / trưởng nhóm test' }, { en: 'test policy', vi: 'chính sách test của tổ chức' }],
  khaiNiem: ['test roles'],
});

const E3 = tinhDe({
  tieuDe: 'Organisation 3 — Benefits and drawbacks of independent testing (K2)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Mark each statement about independent testers as a <b>benefit</b> or a <b>drawback</b> (syllabus §5.1.1).</p>', vi: '<p>Đánh dấu mỗi phát biểu về tester độc lập là <b>lợi ích</b> hay <b>hạn chế</b> (syllabus §5.1.1).</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Statement → benefit or drawback', 'Phát biểu → lợi ích hay hạn chế'),
    cot: [{ ma: 's', ten: 'Statement' }, { ma: 'k', ten: 'Kind', luaChon: ['Benefit', 'Drawback'] }],
    hang: [
      'They are likely to recognise different kinds of failures because of their different background and perspective',
      'They may be isolated from the development team, causing lack of collaboration and delays in feedback',
      'They can verify, challenge or disprove assumptions made by stakeholders during specification and implementation',
      'Developers may lose a sense of responsibility for quality',
      'Independent testers may be seen as a bottleneck or blamed for delays in release',
      'Independent testers of a vendor can report upright and objectively without political pressure from the company that hired them',
      'They may lack important information, e.g. about the test object',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.k': 'Benefit', 'r1.k': 'Drawback', 'r2.k': 'Benefit', 'r3.k': 'Drawback', 'r4.k': 'Drawback', 'r5.k': 'Benefit', 'r6.k': 'Drawback' },
    giaiThich: giai('Benefits: different failures, unbiased view, challenging assumptions, honest reporting. Drawbacks: isolation, less developer responsibility, bottleneck/blame, missing information.', 'Lợi ích: thấy failure khác, không thiên kiến, chất vấn giả định, báo cáo trung thực. Hạn chế: cô lập, developer bớt trách nhiệm, thành “nút thắt”/bị đổ lỗi, thiếu thông tin.'),
  }],
  goiY: ['Bốn lợi ích, bốn hạn chế trong syllabus — mỗi câu đúng một ý.', 'Thiếu thông tin về đối tượng test là cái giá của độc lập.'],
  loiHayGap: ['Cho rằng “developer bớt trách nhiệm” là lợi ích vì tester lo hết.', 'Cho rằng tester độc lập thì tự động khách quan nên không có hạn chế.'],
  giaiThich: '<p>B · D · B · D · D · B · D.</p>',
  thuatNgu: [{ en: 'bottleneck', vi: 'nút thắt cổ chai' }],
  khaiNiem: ['independent testing'],
});

const E4 = tinhDe({
  tieuDe: 'Organisation 4 — Exam questions on test organisation',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five FE-style questions on SWT5 slides 6–24, including the usual choice of independence per test level and the role of a tester in Agile teams.</p>', vi: '<p>Năm câu kiểu FE về slide SWT5 6–24, gồm lựa chọn mức độc lập thường gặp theo cấp test và vai trò tester trong nhóm Agile.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Who usually performs component testing?', 'Ai thường làm component testing?'), luaChon: lc(['a', 'A third-party organisation'], ['b', 'The developers, possibly with a buddy or a tester in the team'], ['c', 'The end users'], ['d', 'Only the test manager']), dapAn: ['b'], giaiThich: giai('Low independence fits component testing; system testing typically uses an independent test team; acceptance testing users.', 'Độc lập thấp hợp component testing; system testing thường dùng nhóm test độc lập; acceptance testing do người dùng.') },
    { ma: 'q2', de: hai('In many organisations the role of test manager is performed by…', 'Ở nhiều tổ chức, vai trò test manager do ai đảm nhiệm?'), luaChon: lc(['a', 'only certified testers'], ['b', 'a project manager, development manager or quality assurance manager — or, in Agile teams, partly by the team itself'], ['c', 'the customer'], ['d', 'nobody']), dapAn: ['b'], giaiThich: giai('The way the role is carried out varies with context.', 'Cách thực hiện vai trò thay đổi theo ngữ cảnh.') },
    { ma: 'q3', de: hai('Which is the best mix of independence for a safety-critical product?', 'Mức độc lập nào hợp nhất cho sản phẩm an toàn sống còn?'), luaChon: lc(['a', 'Only developers test'], ['b', 'Several levels: developer testing for components and an independent team or third party for system and acceptance testing'], ['c', 'Only third-party testing'], ['d', 'No testing']), dapAn: ['b'], giaiThich: giai('Multiple levels of independence are typical; highly independent testing for safety-critical systems.', 'Thường dùng nhiều mức độc lập; mức độc lập cao cho hệ thống an toàn sống còn.') },
    { ma: 'q4', de: hai('Which drawback is the “over the wall” effect?', 'Hạn chế nào là hiệu ứng “ném qua tường”?'), luaChon: lc(['a', 'Testers lack product knowledge'], ['b', 'Developers stop caring about quality because a separate team will test'], ['c', 'Tools are expensive'], ['d', 'Reviews take long']), dapAn: ['b'], giaiThich: giai('A separate test team can make quality “someone else’s job”.', 'Nhóm test tách riêng dễ khiến chất lượng thành “việc của người khác”.') },
    { ma: 'q5', de: hai('In an Agile team, which tester task is typical?', 'Trong nhóm Agile, việc nào là điển hình của tester?'), luaChon: lc(['a', 'Writing the test policy of the company'], ['b', 'Working with the team on acceptance criteria, automation and exploratory testing in every sprint'], ['c', 'Approving the budget'], ['d', 'Testing only after the release']), dapAn: ['b'], giaiThich: giai('Much of the test management role is handled by the team; testers work inside it.', 'Phần lớn vai trò quản lý test do cả nhóm đảm nhận; tester làm việc bên trong nhóm.') },
  ],
  goiY: ['Mỗi cấp test có mức độc lập thường dùng riêng.', 'Vai trò test manager có thể do người có chức danh khác đảm nhận.'],
  loiHayGap: ['Chọn “chỉ bên thứ ba” cho hệ thống an toàn sống còn — thường dùng nhiều mức.', 'Gán việc viết chính sách test cho tester Agile.'],
  giaiThich: '<p>Answers: b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'buddy testing', vi: 'kiểm thử theo cặp bạn — developer test chéo cho nhau' }],
  khaiNiem: ['test organisation'],
});

export default doiDau({
  slug: 'swt301-test-organisation',
  ten: '7.1 Test organisation: independence, test manager and tester',
  moTaModule: 'Năm mức độc lập kiểm thử và ưu nhược điểm, việc của test manager và tester trên dự án LabBook, lợi ích/hạn chế của tester độc lập, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-test-organisation',
  de: [E1, E2, E3, E4],
});
