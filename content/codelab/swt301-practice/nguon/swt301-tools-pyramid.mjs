/**
 * SWT301 · 8.1 — Why tools? Purposes, classification and the probe effect (SWT6 slide 1–8, LO-6.1.1).
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe } from './_de.mjs';

const NHOM = ['1 · Management of testing & testware', '2 · Static testing', '3 · Test design & implementation', '4 · Test execution & logging', '5 · Performance & dynamic analysis', '6 · Specialised testing needs'];
const E1 = tinhDe({
  tieuDe: 'Tools 1 — Put each tool in its ISTQB group',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>The syllabus classifies tools by the test activity they support, in six groups. Place each tool used around LabBook.</p>', vi: '<p>Syllabus phân loại công cụ theo hoạt động kiểm thử mà chúng hỗ trợ, thành sáu nhóm. Xếp từng công cụ dùng quanh LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Tool → group', 'Công cụ → nhóm'),
    cot: [{ ma: 't', ten: 'Tool' }, { ma: 'g', ten: 'Group', luaChon: NHOM }],
    hang: [
      'Jira with Xray: test cases, test cycles, defects and traceability',
      'SonarQube: code smells, complexity and coding-standard violations',
      'A model-based testing tool that generates tests from the booking state diagram',
      'JUnit 5 and JaCoCo running in the build',
      'JMeter simulating 300 students booking at 07:00',
      'An accessibility checker (WCAG) for the booking form',
      'Jenkins running the pipeline on every push',
      'A test-data generator that creates 10,000 realistic bookings',
      'A memory-leak detector attached to the running server',
      'A tool that checks the Vietnamese and English translations of every screen',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.g': NHOM[0], 'r1.g': NHOM[1], 'r2.g': NHOM[2], 'r3.g': NHOM[3], 'r4.g': NHOM[4], 'r5.g': NHOM[5], 'r6.g': NHOM[0], 'r7.g': NHOM[2], 'r8.g': NHOM[4], 'r9.g': NHOM[5] },
    giaiThich: giai('Test/defect management and CI = group 1; static analysis = 2; MBT and test data preparation = 3; unit frameworks and coverage = 4; load testing and dynamic analysis (memory leaks) = 5; accessibility and localisation = 6.', 'Quản lý test/lỗi và CI = nhóm 1; phân tích tĩnh = 2; MBT và chuẩn bị dữ liệu = 3; unit framework và coverage = 4; test tải và phân tích động (rò bộ nhớ) = 5; khả năng tiếp cận và bản địa hoá = 6.'),
  }],
  goiY: ['CI nằm ở nhóm QUẢN LÝ (nhóm 1), không phải thực thi.', 'Phát hiện rò bộ nhớ khi chạy = phân tích động (nhóm 5).'],
  loiHayGap: ['Xếp Jenkins vào nhóm thực thi.', 'Xếp công cụ sinh dữ liệu test vào nhóm thực thi — nó thuộc thiết kế & triển khai.'],
  giaiThich: '<p>1 · 2 · 3 · 4 · 5 · 6 · 1 · 3 · 5 · 6.</p>',
  thuatNgu: [{ en: 'ALM', vi: 'quản lý vòng đời ứng dụng' }, { en: 'dynamic analysis', vi: 'phân tích động — khi chạy (rò bộ nhớ, con trỏ)' }, { en: 'localisation', vi: 'bản địa hoá' }],
  khaiNiem: ['tool classification'],
});

const D = ['(D) — mostly used by developers', 'Used by testers / the whole team'];
const E2 = tinhDe({
  tieuDe: 'Tools 2 — Which tools carry the (D)?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p>On the SWT6 slides a <b>(D)</b> marks tools “more likely to be used by developers”, mostly at component and component-integration level. Mark each tool.</p>', vi: '<p>Trên slide SWT6, chữ <b>(D)</b> đánh dấu công cụ “thường do developer dùng”, chủ yếu ở cấp component và component integration. Đánh dấu từng công cụ.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Tool → user', 'Công cụ → người dùng'),
    cot: [{ ma: 't', ten: 'Tool type' }, { ma: 'u', ten: 'Typical user', luaChon: D }],
    hang: ['Static analysis tools', 'Test management tools', 'Unit test frameworks', 'Coverage tools', 'Requirements management tools', 'Test harnesses', 'Review support tools', 'Dynamic analysis tools'].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.u': D[0], 'r1.u': D[1], 'r2.u': D[0], 'r3.u': D[0], 'r4.u': D[1], 'r5.u': D[0], 'r6.u': D[1], 'r7.u': D[0] },
    giaiThich: giai('(D): static analysis, TDD, unit test frameworks, coverage, test harnesses, performance, dynamic analysis, CI. Management, requirements and review support tools are used by the whole team.', '(D): phân tích tĩnh, TDD, unit test framework, coverage, test harness, hiệu năng, phân tích động, CI. Công cụ quản lý, yêu cầu và hỗ trợ review do cả đội dùng.'),
  }],
  goiY: ['Công cụ làm việc trực tiếp với mã nguồn hay bên trong chương trình ⇒ (D).', 'Review support do mọi người review dùng.'],
  loiHayGap: ['Gắn (D) cho công cụ hỗ trợ review.', 'Không gắn (D) cho test harness.'],
  giaiThich: '<p>D · team · D · D · team · D · team · D.</p>',
  thuatNgu: [{ en: 'test harness', vi: 'khung chạy test gồm stub và driver' }],
  khaiNiem: ['tool classification'],
});

const E3 = tinhDe({
  tieuDe: 'Tools 3 — Intrusive tools and the probe effect',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>An <b>intrusive</b> tool has to get inside the system under test and may change its behaviour; the difference it causes is the <b>probe effect</b>. Five questions, including the teacher’s “Heisenbug” note.</p>', vi: '<p>Công cụ <b>xâm lấn</b> phải đi vào bên trong hệ thống đang test và có thể làm thay đổi hành vi của nó; sự khác biệt do nó gây ra là <b>probe effect</b>. Năm câu, kể cả ghi chú “Heisenbug” của thầy/cô.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which tool is typically intrusive?', 'Công cụ nào thường xâm lấn?'), luaChon: lc(['a', 'A requirements management tool'], ['b', 'A coverage tool that inserts probes into the bytecode'], ['c', 'A review support tool'], ['d', 'A spreadsheet']), dapAn: ['b'], giaiThich: giai('Instrumentation changes the program you measure (and slows it).', 'Gắn đo làm thay đổi chương trình bạn đang đo (và làm chậm nó).') },
    { ma: 'q2', de: hai('A performance tool stores timestamps for every transaction, which adds a little to the response time it measures. This is…', 'Công cụ hiệu năng lưu mốc thời gian cho mọi giao dịch, làm cộng thêm chút thời gian vào chính thời gian phản hồi nó đo. Đây là…'), luaChon: lc(['a', 'the pesticide paradox'], ['b', 'the probe effect'], ['c', 'a false negative'], ['d', 'a regression']), dapAn: ['b'], giaiThich: giai('The measuring disturbs the measured.', 'Việc đo làm xáo trộn thứ được đo.') },
    { ma: 'q3', de: hai('A race condition disappears when the developer adds a println to investigate it. This is called…', 'Một race condition biến mất khi developer thêm println để điều tra. Hiện tượng này gọi là…'), luaChon: lc(['a', 'a Heisenbug'], ['b', 'a cosmetic defect'], ['c', 'a deferred defect'], ['d', 'a false positive']), dapAn: ['a'], giaiThich: giai('The teacher’s note: a bug that changes when you study it — timing changed.', 'Ghi chú của thầy/cô: lỗi thay đổi khi bạn soi nó — vì thời điểm thay đổi.') },
    { ma: 'q4', de: hai('Which is a purpose of tool support named by the syllabus?', 'Đâu là mục đích dùng công cụ mà syllabus nêu?'), luaChon: lc(['a', 'Replace all testers'], ['b', 'Improve efficiency by automating repetitive tasks, and automate activities that need many resources when done manually (e.g. performance testing)'], ['c', 'Remove the need for test design'], ['d', 'Guarantee zero defects']), dapAn: ['b'], giaiThich: giai('Also: improve quality by more consistent testing, automate what cannot be done manually, increase reliability of testing.', 'Ngoài ra: tăng chất lượng nhờ nhất quán, tự động hoá việc không làm tay được, tăng độ tin cậy của việc test.') },
    { ma: 'q5', de: hai('Tools can be classified by…', 'Công cụ có thể phân loại theo…'), luaChon: lc(['a', 'their colour'], ['b', 'purpose, pricing and licensing model, technology — the syllabus uses the test activity they support'], ['c', 'the number of users only'], ['d', 'their vendor only']), dapAn: ['b'], giaiThich: giai('Some tools support one activity, others several.', 'Có công cụ hỗ trợ một hoạt động, có công cụ hỗ trợ nhiều.') },
  ],
  goiY: ['Xâm lấn = công cụ; probe effect = hậu quả lên SUT.', 'Heisenbug: lỗi đổi khi quan sát.'],
  loiHayGap: ['Đảo nghĩa “intrusive” và “probe effect”.', 'Chọn “thay thế tester” cho câu mục đích.'],
  giaiThich: '<p>Answers: b · b · a · b · b.</p>',
  thuatNgu: [{ en: 'intrusive tool', vi: 'công cụ xâm lấn' }, { en: 'probe effect', vi: 'hiệu ứng thăm dò' }, { en: 'Heisenbug', vi: 'lỗi biến đổi khi bị quan sát' }],
  khaiNiem: ['probe effect'],
});

const E4 = tinhDe({
  tieuDe: 'Tools 4 — Exam questions on tool classification (K2)',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>Five FE-style “which tool supports…?” questions, the only K2 objective of the tools chapter.</p>', vi: '<p>Năm câu kiểu FE “công cụ nào hỗ trợ…?”, chuẩn đầu ra K2 duy nhất của chương công cụ.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which tool helps to find defects in the code WITHOUT executing it?', 'Công cụ nào giúp tìm lỗi trong mã MÀ KHÔNG chạy nó?'), luaChon: lc(['a', 'Coverage tool'], ['b', 'Static analysis tool'], ['c', 'Performance tool'], ['d', 'Test execution tool']), dapAn: ['b'], giaiThich: giai('Static testing group.', 'Nhóm kiểm thử tĩnh.') },
    { ma: 'q2', de: hai('Which tool records which requirements are covered by which tests?', 'Công cụ nào ghi yêu cầu nào được test nào phủ?'), luaChon: lc(['a', 'Test management / requirements management tool'], ['b', 'Dynamic analysis tool'], ['c', 'Debugger'], ['d', 'Compiler']), dapAn: ['a'], giaiThich: giai('Traceability lives in management tools.', 'Truy vết nằm ở công cụ quản lý.') },
    { ma: 'q3', de: hai('Which tool simulates the environment in which a component runs (stubs and drivers)?', 'Công cụ nào mô phỏng môi trường component chạy (stub và driver)?'), luaChon: lc(['a', 'Test harness'], ['b', 'Review tool'], ['c', 'Monitoring tool'], ['d', 'Defect management tool']), dapAn: ['a'], giaiThich: giai('Test harnesses (D), execution group.', 'Test harness (D), nhóm thực thi.') },
    { ma: 'q4', de: hai('Which tool helps detect memory leaks and dangling pointers?', 'Công cụ nào giúp phát hiện rò bộ nhớ và con trỏ treo?'), luaChon: lc(['a', 'Dynamic analysis tool'], ['b', 'Static analysis tool'], ['c', 'Test design tool'], ['d', 'Review tool']), dapAn: ['a'], giaiThich: giai('Defects only visible while the software runs.', 'Lỗi chỉ thấy khi phần mềm chạy.') },
    { ma: 'q5', de: hai('Which tool is best for repeating the same 500 regression tests on every build?', 'Công cụ nào hợp nhất để chạy lại cùng 500 test hồi quy mỗi build?'), luaChon: lc(['a', 'Test execution tool (run by CI)'], ['b', 'Review tool'], ['c', 'Requirements tool'], ['d', 'Usability lab']), dapAn: ['a'], giaiThich: giai('Reduction of repetitive work is the first benefit of automation.', 'Bớt việc lặp lại là lợi ích đầu tiên của tự động hoá.') },
  ],
  goiY: ['Không chạy ⇒ tĩnh; khi chạy ⇒ động.', 'Stub + driver = harness.'],
  loiHayGap: ['Nhầm dynamic analysis với performance testing.', 'Chọn coverage tool cho câu 1.'],
  giaiThich: '<p>Answers: b · a · a · a · a.</p>',
  thuatNgu: [{ en: 'dangling pointer', vi: 'con trỏ treo — trỏ vào vùng nhớ đã giải phóng' }],
  khaiNiem: ['tool classification'],
});

export default doiDau({
  slug: 'swt301-tools-pyramid',
  ten: '8.1 Why tools? Classification and the probe effect',
  moTaModule: 'Sáu nhóm công cụ theo hoạt động kiểm thử trên các công cụ thật quanh LabBook, công cụ (D) của developer, công cụ xâm lấn và probe effect, Heisenbug, câu thi “công cụ nào hỗ trợ…”.',
  khoa: KHOA,
  baiHoc: 'swt301-tools-pyramid',
  de: [E1, E2, E3, E4],
});
