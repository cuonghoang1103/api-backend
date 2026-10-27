/**
 * SWT301 · 2.3 — Test levels (2): system and acceptance testing (SWT2 slide 75–105, LO-2.2.1).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const HAI = ['System testing', 'Acceptance testing'];
const E1 = tinhDe({
  tieuDe: 'System & acceptance 1 — Which upper level is described?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>System testing checks the whole product end-to-end against the specification, usually by independent testers. Acceptance testing checks it against the users’ needs, business processes, contracts and regulations to decide whether it can be accepted. Classify each fact.</p>', vi: '<p>System testing kiểm cả sản phẩm đầu-cuối so với đặc tả, thường do tester độc lập. Acceptance testing kiểm so với nhu cầu người dùng, quy trình nghiệp vụ, hợp đồng và quy định để quyết định có nghiệm thu không. Phân loại từng đặc điểm.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Fact → level', 'Đặc điểm → cấp'),
    cot: [{ ma: 'f', ten: 'Fact' }, { ma: 'l', ten: 'Level', luaChon: HAI }],
    hang: [
      'Main objective: establish confidence; finding defects is often not the main goal',
      'Test basis: system and software requirement specifications, risk analysis reports, state diagrams',
      'Test basis: business processes, contracts, regulations and legal standards',
      'Typical failure: the system cannot complete an end-to-end task such as “book a seat and receive the e-mail”',
      'Typical failure: system workflows do not meet business or user requirements',
      'Carried out by independent testers in an environment that corresponds to production',
      'Can end with the customer’s final sign-off',
      'Test objects include recovery systems and hot sites, forms and reports',
    ].map((f, i) => ({ ma: `r${i}`, o: { f } })),
    dapAn: { 'r0.l': HAI[1], 'r1.l': HAI[0], 'r2.l': HAI[1], 'r3.l': HAI[0], 'r4.l': HAI[1], 'r5.l': HAI[0], 'r6.l': HAI[1], 'r7.l': HAI[1] },
    giaiThich: giai('System testing verifies against the specification (SRS, risk reports, state diagrams; end-to-end tasks; independent testers). Acceptance testing validates against needs, processes, contracts and laws, aims at confidence and ends with sign-off.', 'System test verify theo đặc tả (SRS, báo cáo rủi ro, state diagram; tác vụ đầu-cuối; tester độc lập). Acceptance test validate theo nhu cầu, quy trình, hợp đồng, luật, nhắm niềm tin và kết thúc bằng ký nghiệm thu.'),
  }],
  goiY: ['Tài liệu kỹ thuật (SRS, state diagram) ⇒ system; tài liệu nghiệp vụ (hợp đồng, quy định) ⇒ acceptance.', 'Mục tiêu “niềm tin, không chủ yếu tìm lỗi” ⇒ acceptance.'],
  loiHayGap: ['Cho rằng acceptance test nhắm tìm thật nhiều lỗi.', 'Gán “tác vụ đầu-cuối” cho acceptance — đó là failure điển hình của system testing.'],
  giaiThich: '<p>A · S · A · S · A · S · A · A.</p>',
  thuatNgu: [{ en: 'end-to-end', vi: 'đầu-cuối — trọn một tác vụ từ đầu tới cuối' }, { en: 'sign-off', vi: 'ký nghiệm thu' }, { en: 'hot site', vi: 'trung tâm dự phòng chạy sẵn' }],
  khaiNiem: ['system testing', 'acceptance testing'],
});

const DANG = ['UAT', 'OAT', 'Contractual AT', 'Regulatory AT', 'Alpha testing', 'Beta testing'];
const E2 = tinhDe({
  tieuDe: 'System & acceptance 2 — Which form of acceptance testing?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>The syllabus names user acceptance (UAT), operational acceptance (OAT), contractual and regulatory acceptance, and alpha/beta testing. Match each LabBook situation to its form.</p>', vi: '<p>Syllabus nêu user acceptance (UAT), operational acceptance (OAT), contractual và regulatory acceptance, alpha/beta testing. Ghép mỗi tình huống LabBook với dạng của nó.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Situation → form', 'Tình huống → dạng'),
    cot: [{ ma: 's', ten: 'Situation' }, { ma: 'f', ten: 'Form', luaChon: DANG }],
    hang: [
      'Lab managers book, close and reopen labs in a copy of production to see if it fits their daily work',
      'University IT checks backup and restore, user management and patching of LabBook before go-live',
      'The vendor shows that all 42 requirements listed in the signed contract are met',
      'Testers check LabBook against Vietnam’s personal-data protection decree with a university lawyer present',
      'Students of one class use LabBook at the vendor’s office, watched by the developers',
      'LabBook is opened to all FPT students in their own labs and homes before the official launch',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: Object.fromEntries(DANG.map((d, i) => [`r${i}.f`, d])),
    giaiThich: giai('UAT: real users, business fit. OAT: administrators, operation (backup, disaster recovery, user management, maintenance, security). Contractual: the contract. Regulatory: laws and regulations. Alpha: at the developer’s site. Beta: at the users’ own locations.', 'UAT: người dùng thật, hợp nghiệp vụ. OAT: quản trị viên, vận hành (sao lưu, khôi phục thảm hoạ, quản lý người dùng, bảo trì, bảo mật). Contractual: hợp đồng. Regulatory: luật. Alpha: tại nơi phát triển. Beta: tại nơi của người dùng.'),
  }],
  goiY: ['Alpha = ở nhà phát triển; beta = ở chỗ người dùng.', 'Sao lưu/khôi phục/quản lý người dùng ⇒ OAT.'],
  loiHayGap: ['Nhầm alpha với beta.', 'Gán việc kiểm theo luật cho contractual — hợp đồng khác luật.'],
  giaiThich: '<p>UAT · OAT · Contractual · Regulatory · Alpha · Beta.</p>',
  thuatNgu: [{ en: 'UAT / OAT', vi: 'nghiệm thu người dùng / nghiệm thu vận hành' }, { en: 'alpha / beta testing', vi: 'thử tại nơi phát triển / tại nơi người dùng' }, { en: 'go-live', vi: 'chính thức đưa vào vận hành' }],
  khaiNiem: ['acceptance testing forms'],
});

const CAP = ['Component testing', 'Integration testing', 'System testing', 'Acceptance testing'];
const E3 = tinhDe({
  tieuDe: 'System & acceptance 3 — Place each LabBook test on a level',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Across chapters 2–5 you will test LabBook at every level. Decide the test level of each planned test, using objective and test basis.</p>', vi: '<p>Từ chương 2 tới 5 bạn sẽ test LabBook ở mọi cấp. Xác định cấp của từng test đã lên kế hoạch, dựa vào mục tiêu và test basis.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Test → level', 'Test → cấp'),
    cot: [{ ma: 't', ten: 'Planned test' }, { ma: 'l', ten: 'Level', luaChon: CAP }],
    hang: [
      'JUnit tests of reserveSeat with the detailed design (Javadoc) as basis',
      'Postman: POST /bookings then GET /me/bookings — does the API save and return the same booking?',
      'Log in as student1, book LAB02, cancel, see student2 promoted and e-mailed — following the SRS use case',
      'The head of the lab department tries a week of real bookings and decides whether to accept release 1.0',
      'BookingService with a stub SeatRepository: is the seat count requested with the right parameters?',
      'Load test: 300 students book at 07:00 on Monday; response time within the SRS limit',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.l': CAP[0], 'r1.l': CAP[1], 'r2.l': CAP[2], 'r3.l': CAP[3], 'r4.l': CAP[1], 'r5.l': CAP[2] },
    giaiThich: giai('Detailed design → component; interfaces (API ↔ DB, service ↔ repository) → integration; SRS end-to-end and non-functional requirements → system; acceptance decision by the business → acceptance.', 'Thiết kế chi tiết → component; giao diện (API ↔ DB, service ↔ repository) → integration; SRS đầu-cuối và yêu cầu phi chức năng → system; quyết định nghiệm thu của nghiệp vụ → acceptance.'),
  }],
  goiY: ['Mở test basis: Javadoc ⇒ component; đặc tả API/sequence ⇒ integration; SRS ⇒ system; nhu cầu nghiệp vụ ⇒ acceptance.', 'Load test theo SRS là test phi chức năng ở cấp system.'],
  loiHayGap: ['Cho rằng load test là một cấp riêng — đó là một LOẠI test (bài 2.4) chạy ở cấp system.', 'Gán test có stub vào component — stub để kiểm giao diện giữa service và repository.'],
  giaiThich: '<p>CT · IT · ST · AT · IT · ST.</p>',
  thuatNgu: [{ en: 'load test', vi: 'kiểm thử tải' }, { en: 'Javadoc', vi: 'tài liệu đặc tả lớp/method sinh từ chú thích Java' }],
  khaiNiem: ['test levels'],
});

const E4 = tinhDe({
  tieuDe: 'System & acceptance 4 — Exam questions (K2)',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>Six FE-style questions on SWT2 slides 75–105: the objectives and responsibilities of system and acceptance testing, the environment they need, alpha versus beta testing, and why system testing should be done by independent testers.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT2 75–105: mục tiêu và trách nhiệm của system và acceptance testing, môi trường cần có, alpha và beta, vì sao system test nên do tester độc lập.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which environment should system testing use?', 'System testing nên dùng môi trường nào?'), luaChon: lc(['a', 'The developer’s laptop'], ['b', 'An environment that corresponds as closely as possible to the final target or production environment'], ['c', 'The production environment with real customer data'], ['d', 'Any environment']), dapAn: ['b'], giaiThich: giai('To minimise the risk of environment-specific failures not being found.', 'Để giảm rủi ro bỏ sót failure đặc thù môi trường.') },
    { ma: 'q2', de: hai('Who typically performs operational acceptance testing?', 'Ai thường làm operational acceptance testing?'), luaChon: lc(['a', 'End users'], ['b', 'Operations or system administration staff'], ['c', 'Developers'], ['d', 'Lawyers']), dapAn: ['b'], giaiThich: giai('They test backup/restore, installation, disaster recovery, user management, maintenance, data load and migration, security, performance.', 'Họ test sao lưu/khôi phục, cài đặt, khôi phục thảm hoạ, quản lý người dùng, bảo trì, nạp và chuyển dữ liệu, bảo mật, hiệu năng.') },
    { ma: 'q3', de: hai('What is the main difference between alpha and beta testing?', 'Khác biệt chính giữa alpha và beta testing là gì?'), luaChon: lc(['a', 'Alpha is done by developers, beta by testers'], ['b', 'Alpha is performed at the developing organisation’s site; beta by customers or users at their own locations'], ['c', 'Beta comes before alpha'], ['d', 'There is no difference']), dapAn: ['b'], giaiThich: giai('Both are done by potential or existing customers/users or an independent test team.', 'Cả hai do khách hàng/người dùng tiềm năng hoặc hiện có, hoặc nhóm test độc lập thực hiện.') },
    { ma: 'q4', de: hai('A defect is found during acceptance testing. What does this suggest?', 'Tìm thấy defect trong acceptance testing. Điều đó cho thấy gì?'), luaChon: lc(['a', 'Acceptance testing worked perfectly'], ['b', 'Finding significant defects in acceptance testing may be a major project risk — they should have been found earlier'], ['c', 'Acceptance testing should be skipped'], ['d', 'Nothing']), dapAn: ['b'], giaiThich: giai('Acceptance testing is not mainly for finding defects; late defects are expensive and threaten the release.', 'Acceptance test không chủ yếu để tìm lỗi; lỗi muộn rất đắt và đe doạ ngày phát hành.') },
    { ma: 'q5', de: hai('Why is system testing usually done by independent testers?', 'Vì sao system testing thường do tester độc lập làm?'), luaChon: lc(['a', 'Developers are not allowed to test'], ['b', 'Independent testers do not share the developers’ assumptions, so they find more defects in the specification and the system'], ['c', 'It is cheaper'], ['d', 'Users demand it']), dapAn: ['b'], giaiThich: giai('Independence (lesson 1.5) — and defects in specifications can also be found then.', 'Tính độc lập (bài 1.5) — và cũng tìm được lỗi trong đặc tả.') },
    { ma: 'q6', de: hai('Which test basis is typical for UAT?', 'Test basis điển hình của UAT là gì?'), luaChon: lc(['a', 'Source code'], ['b', 'Business processes and user or business requirements'], ['c', 'Sequence diagrams'], ['d', 'Database schema']), dapAn: ['b'], giaiThich: giai('Plus use cases, installation procedures, risk analysis reports.', 'Cùng với use case, quy trình cài đặt, báo cáo phân tích rủi ro.') },
  ],
  goiY: ['Môi trường system test ≈ production nhưng KHÔNG dùng dữ liệu thật của khách.', 'Acceptance tìm ra nhiều lỗi = dấu hiệu rủi ro dự án.'],
  loiHayGap: ['Chọn production thật cho system test.', 'Chọn “alpha do developer, beta do tester”.'],
  giaiThich: '<p>Answers: b · b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'disaster recovery', vi: 'khôi phục sau thảm hoạ' }],
  khaiNiem: ['system testing', 'acceptance testing'],
});

export default doiDau({
  slug: 'swt301-system-acceptance',
  ten: '2.3 Test levels: system and acceptance testing',
  moTaModule: 'Thuộc tính của system và acceptance testing, sáu dạng acceptance (UAT, OAT, hợp đồng, quy định, alpha, beta) trên LabBook, đặt từng test LabBook vào đúng cấp, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-system-acceptance',
  de: [E1, E2, E3, E4],
});
