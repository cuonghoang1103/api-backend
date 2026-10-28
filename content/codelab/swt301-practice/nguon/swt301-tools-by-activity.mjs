/**
 * SWT301 · 8.2 — Tool support for each test activity (SWT6 slide 9–35, LO-6.1.1 K2).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const LOAI = ['Test management tool', 'Requirements management tool', 'Defect management tool', 'Configuration management tool', 'Continuous integration tool', 'Review support tool', 'Static analysis tool', 'Test design tool', 'Model-based testing tool', 'Test data preparation tool', 'Test execution tool', 'Coverage tool', 'Test harness', 'Unit test framework', 'Performance testing tool', 'Monitoring tool', 'Dynamic analysis tool', 'Security testing tool'];
const E1 = tinhDe({
  tieuDe: 'Tools by activity 1 — Which tool type does the team need?',
  doKho: 'MEDIUM', phut: 10,
  moTa: { en: '<p>The exam question is almost always “which tool supports …?”. For each need of the LabBook team, pick the tool type from slides 9–34.</p>', vi: '<p>Câu thi gần như luôn là “công cụ nào hỗ trợ …?”. Với mỗi nhu cầu của nhóm LabBook, chọn loại công cụ trong slide 9–34.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Need → tool type', 'Nhu cầu → loại công cụ'),
    cot: [{ ma: 'n', ten: 'Need' }, { ma: 't', ten: 'Tool type', luaChon: LOAI }],
    hang: [
      'Store user stories with their versions and link each one to its tests',
      'Record a defect, assign it, track it through New → Fixed → Closed',
      'Know exactly which build and which seed data were used in yesterday’s run',
      'Build and run all tests automatically after every push to the main branch',
      'Collect comments of five reviewers on the SRS and track their resolution',
      'Find unreachable code and variables used before they are defined, without running the code',
      'Generate test inputs automatically from the decision table of refunds',
      'Anonymise a copy of production bookings for the test environment',
      'Replay 200 scripted UI tests on Chrome and Firefox and compare results',
      'Measure which branches of BookingService the JUnit tests executed',
      'Find which pages respond slowly when 500 users book at once',
      'Watch CPU, memory and error rates of the production server and alert on spikes',
      'Try SQL injection and broken authentication attacks against the API',
      'Write and run JUnit tests with assertions in the IDE',
    ].map((n, i) => ({ ma: `r${i}`, o: { n } })),
    dapAn: { 'r0.t': LOAI[1], 'r1.t': LOAI[2], 'r2.t': LOAI[3], 'r3.t': LOAI[4], 'r4.t': LOAI[5], 'r5.t': LOAI[6], 'r6.t': LOAI[7], 'r7.t': LOAI[9], 'r8.t': LOAI[10], 'r9.t': LOAI[11], 'r10.t': LOAI[14], 'r11.t': LOAI[15], 'r12.t': LOAI[17], 'r13.t': LOAI[13] },
    giaiThich: giai('Each row names the main function of one tool type of SWT6 slides 9–34.', 'Mỗi dòng nêu chức năng chính của một loại công cụ trong slide SWT6 9–34.'),
  }],
  goiY: ['“Phiên bản yêu cầu + liên kết test” ⇒ requirements management; “build nào, dữ liệu nào” ⇒ configuration management.', 'Ẩn danh hoá dữ liệu thật ⇒ test data preparation.'],
  loiHayGap: ['Nhầm monitoring (giám sát vận hành) với performance testing (tạo tải).', 'Nhầm test design tool (sinh đầu vào) với test execution tool.'],
  giaiThich: '<p>Requirements · Defect · CM · CI · Review · Static analysis · Test design · Test data · Execution · Coverage · Performance · Monitoring · Security · Unit framework.</p>',
  thuatNgu: [{ en: 'anonymise', vi: 'ẩn danh hoá dữ liệu' }, { en: 'SQL injection', vi: 'tấn công chèn SQL' }],
  khaiNiem: ['tool support by activity'],
});

const CAP = ['Component testing', 'Integration testing', 'System testing', 'Acceptance testing', 'All levels'];
const E2 = tinhDe({
  tieuDe: 'Tools by activity 2 — Tools on the V-model (slide 35)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Slide 35 places the tools on the V-model. Some tools sit at one level, management tools span the whole lifecycle. Where does each tool mainly belong?</p>', vi: '<p>Slide 35 đặt các công cụ lên mô hình chữ V. Có công cụ thuộc một cấp, công cụ quản lý trải suốt vòng đời. Mỗi công cụ chủ yếu thuộc đâu?</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Tool → level', 'Công cụ → cấp'),
    cot: [{ ma: 't', ten: 'Tool' }, { ma: 'l', ten: 'Level', luaChon: CAP }],
    hang: ['Unit test framework and coverage tool', 'Test harness with stubs and drivers between components', 'Load and performance testing tool', 'Test management and defect management tools', 'Usability measurement during a pilot with real users'].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.l': CAP[0], 'r1.l': CAP[1], 'r2.l': CAP[2], 'r3.l': CAP[4], 'r4.l': CAP[3] },
    giaiThich: giai('Developer tools sit low on the V; performance tools at system level; usability at acceptance; management tools everywhere.', 'Công cụ của developer nằm thấp trên chữ V; công cụ hiệu năng ở system; khả dụng ở acceptance; công cụ quản lý ở mọi nơi.'),
  }],
  goiY: ['Công cụ quản lý trải suốt vòng đời.', 'Harness với stub/driver giữa các component ⇒ integration.'],
  loiHayGap: ['Đặt test harness ở system.', 'Đặt công cụ quản lý test ở một cấp duy nhất.'],
  giaiThich: '<p>Component · Integration · System · All levels · Acceptance.</p>',
  thuatNgu: [{ en: 'V-model', vi: 'mô hình chữ V' }],
  khaiNiem: ['tool support by activity'],
});

const E3 = tinhDe({
  tieuDe: 'Tools by activity 3 — Exam questions on specific tools',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Six FE-style questions on SWT6 slides 9–34: CI, test data preparation, model-based testing, coverage, monitoring and specialised tools.</p>', vi: '<p>Sáu câu kiểu FE về slide SWT6 9–34: CI, chuẩn bị dữ liệu, model-based testing, coverage, giám sát và công cụ chuyên biệt.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which is a benefit of a continuous integration tool?', 'Đâu là lợi ích của công cụ CI?'), luaChon: lc(['a', 'It removes the need for unit tests'], ['b', 'It builds and tests every change automatically, giving fast feedback and early detection of integration defects'], ['c', 'It writes requirements'], ['d', 'It replaces code reviews']), dapAn: ['b'], giaiThich: giai('CI tools (D) are in the management group.', 'Công cụ CI (D) thuộc nhóm quản lý.') },
    { ma: 'q2', de: hai('A test data preparation tool is used to…', 'Công cụ chuẩn bị dữ liệu test dùng để…'), luaChon: lc(['a', 'execute tests'], ['b', 'select, generate, manipulate or anonymise data in databases and files for testing'], ['c', 'measure performance'], ['d', 'track defects']), dapAn: ['b'], giaiThich: giai('Including protecting personal data.', 'Kể cả bảo vệ dữ liệu cá nhân.') },
    { ma: 'q3', de: hai('Model-based testing tools…', 'Công cụ model-based testing…'), luaChon: lc(['a', 'draw UML for developers'], ['b', 'generate test cases (inputs and expected results) from a model such as a state diagram'], ['c', 'only measure coverage'], ['d', 'replace testers']), dapAn: ['b'], giaiThich: giai('When the model changes, the tests are regenerated.', 'Khi mô hình đổi, test được sinh lại.') },
    { ma: 'q4', de: hai('A coverage tool reports 100% statement coverage. What does it NOT tell you?', 'Công cụ coverage báo 100% statement coverage. Nó KHÔNG cho biết điều gì?'), luaChon: lc(['a', 'Which statements were executed'], ['b', 'Whether the expected results of the tests were correct or requirements are missing'], ['c', 'The percentage covered'], ['d', 'Which lines were never run']), dapAn: ['b'], giaiThich: giai('Coverage measures execution, not correctness (chapter 5).', 'Độ phủ đo việc chạy, không đo tính đúng (chương 5).') },
    { ma: 'q5', de: hai('Which is a specialised tool of group 6?', 'Đâu là công cụ chuyên biệt của nhóm 6?'), luaChon: lc(['a', 'Data conversion and migration testing tool'], ['b', 'Unit test framework'], ['c', 'Requirements management tool'], ['d', 'Review tool']), dapAn: ['a'], giaiThich: giai('Also data quality, usability, accessibility, localisation, security, portability.', 'Còn có chất lượng dữ liệu, khả dụng, tiếp cận, bản địa hoá, bảo mật, khả chuyển.') },
    { ma: 'q6', de: hai('Which tool type continuously checks the system in operation and warns about problems?', 'Loại công cụ nào liên tục theo dõi hệ thống đang vận hành và cảnh báo vấn đề?'), luaChon: lc(['a', 'Monitoring tool'], ['b', 'Test design tool'], ['c', 'Review tool'], ['d', 'Static analysis tool']), dapAn: ['a'], giaiThich: giai('Group 5 — performance measurement & dynamic analysis.', 'Nhóm 5 — đo hiệu năng & phân tích động.') },
  ],
  goiY: ['Mỗi câu ứng với chức năng chính của một loại công cụ.', 'Độ phủ không chứng minh tính đúng.'],
  loiHayGap: ['Cho rằng CI thay thế unit test.', 'Cho rằng 100% coverage nghĩa là không còn lỗi.'],
  giaiThich: '<p>Answers: b · b · b · b · a · a.</p>',
  thuatNgu: [{ en: 'continuous integration', vi: 'tích hợp liên tục' }],
  khaiNiem: ['tool support by activity'],
});

const E4 = tinhDe({
  tieuDe: 'Tools by activity 4 — Assemble the LabBook tool chain',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Order the tool-supported steps that happen after a developer pushes a change to LabBook’s main branch, as in a typical CI pipeline.</p>', vi: '<p>Sắp các bước có công cụ hỗ trợ diễn ra sau khi developer đẩy thay đổi lên nhánh chính của LabBook, như một pipeline CI điển hình.</p>' },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('From push to report', 'Từ lúc đẩy mã tới báo cáo'), muc: lc(['d', 'Run the unit tests and measure coverage (JUnit + JaCoCo)'], ['a', 'The CI server checks out the commit (configuration management)'], ['f', 'Publish results to the test management tool and open defects for failures'], ['b', 'Compile and build the artefact'], ['e', 'Deploy to the test environment and run API and UI tests'], ['c', 'Run static analysis (SonarQube quality gate)']), dapAn: ['a', 'b', 'c', 'd', 'e', 'f'], giaiThich: giai('Checkout → build → static analysis → unit tests + coverage → deploy and higher-level tests → report. Cheap, fast checks come first so the pipeline fails fast.', 'Lấy mã → build → phân tích tĩnh → unit test + coverage → triển khai và test cấp cao → báo cáo. Kiểm rẻ, nhanh đi trước để pipeline hỏng sớm.') }],
  goiY: ['Kiểm nhanh, rẻ đặt trước (fail fast).', 'Phải triển khai rồi mới chạy test API/UI.'],
  loiHayGap: ['Chạy UI test trước unit test.', 'Báo cáo trước khi chạy xong.'],
  giaiThich: '<p>a → b → c → d → e → f.</p>',
  thuatNgu: [{ en: 'quality gate', vi: 'cổng chất lượng — điều kiện để pipeline đi tiếp' }, { en: 'fail fast', vi: 'hỏng sớm' }],
  khaiNiem: ['continuous integration'],
});

export default doiDau({
  slug: 'swt301-tools-by-activity',
  ten: '8.2 Tool support for each test activity',
  moTaModule: 'Chọn loại công cụ cho 14 nhu cầu của nhóm LabBook, đặt công cụ lên mô hình chữ V, câu thi về CI, dữ liệu test, MBT, coverage, giám sát, sắp các bước của pipeline CI.',
  khoa: KHOA,
  baiHoc: 'swt301-tools-by-activity',
  de: [E1, E2, E3, E4],
});
