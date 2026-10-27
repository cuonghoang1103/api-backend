/**
 * SWT301 · 3.1 — Static testing basics (SWT3 slide 1–20, LO-3.1.1–3.1.3).
 */
import { doiDau, KHOA, hai, giai, lc, tn } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const E1 = tinhDe({
  tieuDe: 'Static testing 1 — What it is and what it can examine (K1–K2)',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>Static testing examines a work product <b>without executing code</b>, by people (reviews) or by tools (static analysis). Five questions on LO-3.1.1–3.1.3.</p>', vi: '<p>Kiểm thử tĩnh xem xét sản phẩm công việc <b>mà không chạy mã</b>, bằng người (review) hoặc bằng công cụ (phân tích tĩnh). Năm câu về LO-3.1.1–3.1.3.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which work product can NOT be examined by static testing?', 'Sản phẩm nào KHÔNG thể xem xét bằng kiểm thử tĩnh?'), luaChon: lc(['a', 'A requirements specification'], ['b', 'Source code'], ['c', 'A test plan and test cases'], ['d', 'None — any work product that can be read and understood can be reviewed']), dapAn: ['d'], giaiThich: giai('Specifications, epics/user stories, code, testware, user guides, web pages, contracts, plans, budgets and models can all be examined.', 'Đặc tả, epic/user story, mã, testware, hướng dẫn sử dụng, trang web, hợp đồng, kế hoạch, ngân sách và mô hình đều xem xét được.') },
    { ma: 'q2', de: hai('What is the main difference between static and dynamic testing?', 'Khác biệt chính giữa kiểm thử tĩnh và động là gì?'), luaChon: lc(['a', 'Static testing has different objectives'], ['b', 'Static testing finds defects directly in work products; dynamic testing causes failures, whose defects must then be found by analysis'], ['c', 'Dynamic testing can only be done by developers'], ['d', 'Static testing is always done after dynamic testing']), dapAn: ['b'], giaiThich: giai('Both share objectives (assess quality, find defects early); static finds the defect itself, dynamic shows the failure first.', 'Cả hai cùng mục tiêu (đánh giá chất lượng, tìm lỗi sớm); tĩnh tìm thẳng defect, động thấy failure trước.') },
    { ma: 'q3', de: hai('Which is a typical benefit of static testing?', 'Đâu là lợi ích điển hình của kiểm thử tĩnh?'), luaChon: lc(['a', 'It measures response time under load'], ['b', 'Detecting defects early, before dynamic testing, when they are cheaper to remove'], ['c', 'It replaces the need for dynamic testing'], ['d', 'It needs no human effort']), dapAn: ['b'], giaiThich: giai('Early detection lowers rework cost; it also prevents defects and improves communication. It complements, never replaces, dynamic testing.', 'Phát hiện sớm giảm chi phí làm lại; còn ngăn lỗi và cải thiện giao tiếp. Nó bổ sung, không thay thế kiểm thử động.') },
    { ma: 'q4', de: hai('Static analysis is…', 'Phân tích tĩnh là…'), luaChon: lc(['a', 'a review meeting led by a moderator'], ['b', 'tool-driven evaluation of code or models without executing them'], ['c', 'testing with a debugger'], ['d', 'a type of load test']), dapAn: ['b'], giaiThich: giai('Reviews use people; static analysis uses tools (compilers, linters such as SonarLint, PMD).', 'Review dùng người; phân tích tĩnh dùng công cụ (trình biên dịch, linter như SonarLint, PMD).') },
    { ma: 'q5', de: hai('Which statement about static testing in Agile teams is TRUE?', 'Phát biểu nào về kiểm thử tĩnh trong nhóm Agile là ĐÚNG?'), luaChon: lc(['a', 'It is not used'], ['b', 'Reviewing user stories and acceptance criteria early (e.g. in refinement) is a form of static testing'], ['c', 'Only inspections are allowed'], ['d', 'It must be done by an external team']), dapAn: ['b'], giaiThich: giai('Story refinement and acceptance-criteria reviews find ambiguities before code exists.', 'Refinement user story và review tiêu chí chấp nhận tìm điểm mơ hồ trước khi có mã.') },
  ],
  goiY: ['Tĩnh = không chạy; gồm review (người) và phân tích tĩnh (công cụ).', 'Tĩnh tìm defect; động tạo failure.'],
  loiHayGap: ['Nghĩ chỉ mã nguồn mới review được.', 'Nghĩ kiểm thử tĩnh thay được kiểm thử động.'],
  giaiThich: '<p>Answers: d · b · b · b · b.</p>',
  thuatNgu: [{ en: 'static testing', vi: 'kiểm thử tĩnh — xem xét sản phẩm mà không chạy' }, { en: 'dynamic testing', vi: 'kiểm thử động — chạy phần mềm' }, { en: 'work product', vi: 'sản phẩm công việc (tài liệu, mã, test…)' }, { en: 'static analysis', vi: 'phân tích tĩnh bằng công cụ' }],
  khaiNiem: ['static testing'],
});

const KIEU = ['Review', 'Static analysis', 'Dynamic testing'];
const E2 = tinhDe({
  tieuDe: 'Static testing 2 — Review, static analysis or dynamic testing?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Classify each activity of a sprint of the LabBook team. Ask two questions: is anything executed? If not, is the work product read by people or parsed by a tool?</p>', vi: '<p>Phân loại từng hoạt động trong một sprint của nhóm LabBook. Hỏi hai câu: có chạy gì không? Nếu không, sản phẩm được người đọc hay công cụ phân tích?</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Kind of activity', 'Loại hoạt động'),
    cot: [{ ma: 'a', ten: 'Activity' }, { ma: 'k', ten: 'Kind', luaChon: KIEU }],
    hang: [
      'Two developers read the SRS section on waitlists and note contradictions',
      'SonarLint highlights an unused variable in BookingService',
      'A JUnit test of reserveSeat fails on the boundary 6 hours',
      'The compiler reports “unreachable statement” after a return',
      'The tester walks the team through the acceptance criteria of a user story',
      'Postman checks that POST /api/bookings returns 201',
      'A tool computes the cyclomatic complexity of every method',
      'A JMeter run measures the response time of 200 parallel bookings',
    ].map((a, i) => ({ ma: `r${i}`, o: { a } })),
    dapAn: { 'r0.k': KIEU[0], 'r1.k': KIEU[1], 'r2.k': KIEU[2], 'r3.k': KIEU[1], 'r4.k': KIEU[0], 'r5.k': KIEU[2], 'r6.k': KIEU[1], 'r7.k': KIEU[2] },
    giaiThich: giai('Reading by people = review; tools parsing code (linters, compilers, metric tools) = static analysis; anything that runs the software (JUnit, Postman, JMeter) = dynamic testing.', 'Người đọc = review; công cụ phân tích mã (linter, trình biên dịch, công cụ đo) = phân tích tĩnh; mọi thứ chạy phần mềm (JUnit, Postman, JMeter) = kiểm thử động.'),
  }],
  goiY: ['Có chạy phần mềm không? Có ⇒ dynamic.', 'Không chạy: người đọc ⇒ review; công cụ phân tích ⇒ static analysis.'],
  loiHayGap: ['Xếp lỗi biên dịch "unreachable statement" vào dynamic — trình biên dịch không chạy chương trình.', 'Xếp walkthrough vào dynamic vì "có buổi họp".'],
  giaiThich: '<p>Review · Static analysis · Dynamic · Static analysis · Review · Dynamic · Static analysis · Dynamic.</p>',
  thuatNgu: [{ en: 'linter', vi: 'công cụ phân tích tĩnh mã nguồn' }],
  khaiNiem: ['static testing', 'dynamic testing'],
});

const PHAT = ['Easier with static testing', 'Needs dynamic testing'];
const E3 = tinhDe({
  tieuDe: 'Static testing 3 — Which defects does static testing find more easily?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>The syllabus lists defects that are easier and cheaper to find with static testing (requirement defects, design defects, coding defects, deviations from standards, interface specification defects, security vulnerabilities, gaps in test-basis coverage, maintainability defects). Others only show up when the software runs. Classify.</p>', vi: '<p>Syllabus liệt kê các lỗi dễ và rẻ hơn khi tìm bằng kiểm thử tĩnh (lỗi yêu cầu, lỗi thiết kế, lỗi mã, sai chuẩn, lỗi đặc tả giao diện, lỗ hổng bảo mật, thiếu phủ test basis, lỗi khả năng bảo trì). Số khác chỉ lộ khi phần mềm chạy. Hãy phân loại.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Where is the defect found more easily?', 'Lỗi nào dễ tìm hơn bằng cách nào?'),
    cot: [{ ma: 'd', ten: 'Defect' }, { ma: 'k', ten: 'Found', luaChon: PHAT }],
    hang: [
      'Two requirements contradict each other (waitlist FIFO vs “priority to staff”)',
      'A variable is read before it is ever assigned',
      'The API contract says “date” but the client sends “bookingDate”',
      'The booking page becomes slow when 500 users book at 08:00',
      'A method of 400 lines with cyclomatic complexity 38',
      'A memory leak after the server runs for three days',
      'A user story has no acceptance criterion for cancelling',
      'Login concatenates user input into an SQL string',
    ].map((d, i) => ({ ma: `r${i}`, o: { d } })),
    dapAn: { 'r0.k': PHAT[0], 'r1.k': PHAT[0], 'r2.k': PHAT[0], 'r3.k': PHAT[1], 'r4.k': PHAT[0], 'r5.k': PHAT[1], 'r6.k': PHAT[0], 'r7.k': PHAT[0] },
    giaiThich: giai('Contradictions, data-flow faults, interface-spec mismatches, maintainability, missing criteria and injection-prone patterns are visible in the work product itself. Performance and memory leaks are behaviours that need execution.', 'Mâu thuẫn, lỗi luồng dữ liệu, lệch đặc tả giao diện, khả năng bảo trì, thiếu tiêu chí và mẫu dễ bị injection đều nhìn thấy trong chính sản phẩm. Hiệu năng và rò bộ nhớ là hành vi cần chạy mới thấy.'),
  }],
  goiY: ['Lỗi nằm trong văn bản/mã nhìn thấy được ⇒ tĩnh.', 'Lỗi là hành vi theo thời gian/tải ⇒ động.'],
  loiHayGap: ['Cho rằng lỗ hổng bảo mật chỉ tìm được bằng pentest — mẫu SQL nối chuỗi lộ ngay khi review/phân tích tĩnh.', 'Cho rằng thiếu tiêu chí chấp nhận là lỗi "chạy mới thấy".'],
  giaiThich: '<p>Static · Static · Static · Dynamic · Static · Dynamic · Static · Static.</p>',
  thuatNgu: [{ en: 'maintainability', vi: 'khả năng bảo trì' }, { en: 'SQL injection', vi: 'tấn công chèn SQL qua dữ liệu người dùng' }],
  khaiNiem: ['static testing'],
});

const E4 = tinhDe({
  tieuDe: 'Static testing 4 — Value and cost of static testing (exam style)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Five exam-style questions about why static testing pays off, what it costs and how it fits the test process.</p>', vi: '<p>Năm câu kiểu đề thi về vì sao kiểm thử tĩnh có lợi, tốn gì và nằm ở đâu trong quy trình test.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Why is a defect found in the requirements cheaper to fix than the same defect found in system testing?', 'Vì sao lỗi tìm thấy ở yêu cầu rẻ hơn lỗi tương tự tìm thấy khi system test?'), luaChon: lc(['a', 'Because testers are paid less'], ['b', 'Because nothing has yet been built on top of it — no design, code or tests to rework'], ['c', 'Because requirements are shorter'], ['d', 'It is not cheaper']), dapAn: ['b'], giaiThich: giai('Cost of change grows with every work product built on the defect (the cost-of-defects curve of chapter 1).', 'Chi phí sửa tăng theo mỗi sản phẩm xây trên lỗi đó (đường chi phí lỗi ở chương 1).') },
    { ma: 'q2', de: hai('Which is NOT listed as a benefit of static testing?', 'Đâu KHÔNG phải lợi ích của kiểm thử tĩnh theo syllabus?'), luaChon: lc(['a', 'Improved communication between team members'], ['b', 'Reduced development cost and time'], ['c', 'Identifying defects that are not easily found by dynamic testing'], ['d', 'Measuring the reliability of the system in production']), dapAn: ['d'], giaiThich: giai('Reliability in operation is measured dynamically.', 'Độ tin cậy khi vận hành được đo bằng kiểm thử động.') },
    { ma: 'q3', de: hai('A team skips reviews to “save time”. What is the most likely consequence?', 'Nhóm bỏ review để “tiết kiệm thời gian”. Hệ quả có khả năng nhất?'), luaChon: lc(['a', 'Higher total cost, because defects are found later when rework is more expensive'], ['b', 'Fewer defects'], ['c', 'Faster releases with the same quality'], ['d', 'No effect']), dapAn: ['a'], giaiThich: giai('Reviews cost effort up front but reduce total cost of quality.', 'Review tốn công lúc đầu nhưng giảm tổng chi phí chất lượng.') },
    { ma: 'q4', de: hai('Static testing and dynamic testing…', 'Kiểm thử tĩnh và kiểm thử động…'), luaChon: lc(['a', 'are alternatives — use one or the other'], ['b', 'complement each other: they find different kinds of defects'], ['c', 'must be done by different companies'], ['d', 'cannot be combined in Agile']), dapAn: ['b'], giaiThich: giai('They share objectives but find different defect types; both are needed.', 'Chung mục tiêu nhưng tìm loại lỗi khác nhau; cần cả hai.') },
    { ma: 'q5', de: hai('Who can perform static testing?', 'Ai có thể làm kiểm thử tĩnh?'), luaChon: lc(['a', 'Only professional testers'], ['b', 'Anyone with the right knowledge — developers, testers, business analysts, users'], ['c', 'Only the author'], ['d', 'Only tools']), dapAn: ['b'], giaiThich: giai('Reviews benefit from different perspectives; tools are run by developers and in CI.', 'Review được lợi từ nhiều góc nhìn; công cụ do developer chạy và chạy trong CI.') },
  ],
  goiY: ['Chi phí sửa lỗi tăng theo thời gian phát hiện.', 'Tĩnh và động bổ sung cho nhau.'],
  loiHayGap: ['Chọn "đo độ tin cậy" là lợi ích của tĩnh.', 'Cho rằng chỉ tester mới review.'],
  giaiThich: '<p>Answers: b · d · a · b · b.</p>',
  thuatNgu: [{ en: 'cost of quality', vi: 'chi phí chất lượng (phòng ngừa + phát hiện + sửa lỗi)' }],
  khaiNiem: ['static testing'],
});

export default doiDau({
  slug: 'swt301-static-testing-basics',
  ten: '3.1 Static testing basics',
  moTaModule: 'Kiểm thử tĩnh là gì, xem xét được sản phẩm nào, khác kiểm thử động ra sao; phân loại hoạt động (review / phân tích tĩnh / động) và loại lỗi tĩnh dễ tìm; giá trị và chi phí.',
  khoa: KHOA,
  baiHoc: 'swt301-static-testing-basics',
  de: [E1, E2, E3, E4],
});
