/**
 * SWT301 · 2.4 — Test types (SWT2 slide 106–130, LO-2.3.1–2.3.3): functional, non-functional, white-box, change-related.
 */
import { doiDau, KHOA, hai, giai, lc } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy } from './_de.mjs';

const LOAI = ['Functional', 'Non-functional', 'White-box', 'Confirmation', 'Regression'];
const E1 = tinhDe({
  tieuDe: 'Test types 1 — Which test type is this?',
  doKho: 'EASY', phut: 7,
  moTa: { en: '<p>A test level says <i>where</i> in the lifecycle you test; a test type says <i>what characteristic</i> you test: functions, quality characteristics, structure, or the effect of a change (confirmation and regression). Classify each LabBook test.</p>', vi: '<p>Cấp test cho biết test <i>ở đâu</i> trong vòng đời; loại test cho biết test <i>đặc tính gì</i>: chức năng, đặc tính chất lượng, cấu trúc, hay ảnh hưởng của thay đổi (confirmation và regression). Phân loại từng test LabBook.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Test → type', 'Test → loại'),
    cot: [{ ma: 't', ten: 'Test' }, { ma: 'k', ten: 'Type', luaChon: LOAI }],
    hang: [
      'Check that a student cannot book more than 6 hours per week',
      'Measure that the lab list loads within 2 seconds with 300 concurrent users',
      'Design tests until every decision in calcRefund has been TRUE and FALSE',
      'Re-run the test that failed for DEF-31 on the build that contains its fix',
      'After fixing DEF-31, re-run the whole booking suite to check nothing else broke',
      'Ask five students to book a seat without help and count the errors they make',
      'Check that a student’s session token cannot be reused after logout',
      'Check that cancelling a confirmed booking promotes the first pending student',
    ].map((t, i) => ({ ma: `r${i}`, o: { t } })),
    dapAn: { 'r0.k': LOAI[0], 'r1.k': LOAI[1], 'r2.k': LOAI[2], 'r3.k': LOAI[3], 'r4.k': LOAI[4], 'r5.k': LOAI[1], 'r6.k': LOAI[1], 'r7.k': LOAI[0] },
    giaiThich: giai('Business rules = functional; performance, usability and security = non-functional; decision coverage = white-box; re-running the failed test = confirmation; re-running unchanged areas = regression.', 'Luật nghiệp vụ = chức năng; hiệu năng, khả dụng, bảo mật = phi chức năng; độ phủ quyết định = white-box; chạy lại test đã fail = confirmation; chạy lại vùng không đổi = regression.'),
  }],
  goiY: ['Hệ thống LÀM GÌ ⇒ functional; làm TỐT tới đâu ⇒ non-functional.', 'Confirmation = đúng test đã fail; regression = phần còn lại.'],
  loiHayGap: ['Xếp bảo mật vào functional — theo ISO 25010 security là đặc tính phi chức năng (đề FE theo cách này).', 'Đảo confirmation và regression.'],
  giaiThich: '<p>F · NF · WB · Conf · Reg · NF · NF · F.</p>',
  thuatNgu: [{ en: 'functional testing', vi: 'kiểm thử chức năng — hệ thống làm gì' }, { en: 'non-functional testing', vi: 'kiểm thử phi chức năng — làm tốt tới đâu' }, { en: 'confirmation testing', vi: 'kiểm thử xác nhận' }, { en: 'regression testing', vi: 'kiểm thử hồi quy' }],
  khaiNiem: ['test types'],
});

const ISO = ['Performance efficiency', 'Usability', 'Security', 'Reliability', 'Compatibility', 'Maintainability', 'Portability'];
const E2 = tinhDe({
  tieuDe: 'Test types 2 — Which ISO 25010 quality characteristic?',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Non-functional testing evaluates characteristics such as those of ISO/IEC 25010. Match each non-functional requirement of LabBook to its characteristic.</p>', vi: '<p>Kiểm thử phi chức năng đánh giá các đặc tính như trong ISO/IEC 25010. Ghép mỗi yêu cầu phi chức năng của LabBook với đặc tính của nó.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Requirement → characteristic', 'Yêu cầu → đặc tính'),
    cot: [{ ma: 'r', ten: 'Requirement' }, { ma: 'c', ten: 'Characteristic', luaChon: ISO }],
    hang: [
      '95% of booking requests answer within 1 second with 500 concurrent users',
      'A first-year student books a seat in under 60 seconds without training',
      'Passwords are stored hashed; a student can never read another student’s bookings',
      'The service is available 99.5% of the time during the semester and recovers within 5 minutes after a crash',
      'LabBook runs next to the university’s single sign-on and shares its user database without conflicts',
      'A new rule (e.g. a 4-hour limit for exam weeks) can be added by changing one configuration file',
      'LabBook can be installed on the university’s new Linux servers as well as on Windows Server',
    ].map((r, i) => ({ ma: `r${i}`, o: { r } })),
    dapAn: Object.fromEntries(ISO.map((c, i) => [`r${i}.c`, c])),
    giaiThich: giai('Time behaviour/capacity = performance efficiency; learnability = usability; confidentiality = security; availability/recoverability = reliability; co-existence/interoperability = compatibility; modifiability = maintainability; installability/adaptability = portability.', 'Thời gian/sức chứa = hiệu năng; dễ học = khả dụng; bảo mật = security; sẵn sàng/phục hồi = tin cậy; cùng tồn tại/tương tác = tương thích; dễ sửa = bảo trì; dễ cài/thích nghi = khả chuyển.'),
  }],
  goiY: ['“Phục hồi sau sự cố, % thời gian sẵn sàng” ⇒ reliability.', '“Chạy cạnh / chia sẻ với hệ thống khác” ⇒ compatibility; “cài trên nền tảng khác” ⇒ portability.'],
  loiHayGap: ['Nhầm compatibility với portability.', 'Gán “dễ thêm luật mới” cho usability — đó là maintainability.'],
  giaiThich: '<p>Performance · Usability · Security · Reliability · Compatibility · Maintainability · Portability.</p>',
  thuatNgu: [{ en: 'ISO/IEC 25010', vi: 'chuẩn mô hình chất lượng sản phẩm phần mềm' }, { en: 'availability', vi: 'tính sẵn sàng' }, { en: 'interoperability', vi: 'khả năng tương tác' }],
  khaiNiem: ['non-functional testing', 'ISO 25010'],
});

const CAP = ['Component testing', 'Integration testing', 'System testing', 'Acceptance testing'];
const E3 = tinhDe({
  tieuDe: 'Test types 3 — Every type at every level',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>The key exam point of lesson 2.4: functional, non-functional and white-box tests can be performed at <b>any</b> test level. For each example, name the level; its type is given in brackets.</p>', vi: '<p>Ý thi quan trọng nhất của bài 2.4: test chức năng, phi chức năng và white-box đều làm được ở <b>mọi</b> cấp. Với mỗi ví dụ, gọi tên cấp; loại đã ghi trong ngoặc.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Example → level', 'Ví dụ → cấp'),
    cot: [{ ma: 'e', ten: 'Example' }, { ma: 'l', ten: 'Level', luaChon: CAP }],
    hang: [
      '[non-functional] Measure how many CPU cycles calcRefund takes on a large input',
      '[white-box] Exercise every call between the booking module and the e-mail module',
      '[white-box] Cover every menu item and screen transition of the web application',
      '[non-functional] Lab managers rate how easy closing a lab is during a pilot week',
      '[functional] Check that reserveSeat returns the code BK-LAB01-0900',
      '[non-functional] Measure response time when the API calls the repository 1,000 times',
    ].map((e, i) => ({ ma: `r${i}`, o: { e } })),
    dapAn: { 'r0.l': CAP[0], 'r1.l': CAP[1], 'r2.l': CAP[2], 'r3.l': CAP[3], 'r4.l': CAP[0], 'r5.l': CAP[1] },
    giaiThich: giai('The slides’ own examples: performance of a component, white-box coverage of interfaces at integration, menu/navigation coverage at system level, usability at acceptance.', 'Đúng ví dụ của slide: hiệu năng một component, độ phủ white-box các giao diện ở integration, độ phủ menu/điều hướng ở system, khả dụng ở acceptance.'),
  }],
  goiY: ['Đối tượng là một method ⇒ component; tương tác giữa module ⇒ integration; cả ứng dụng ⇒ system; người dùng đánh giá ⇒ acceptance.', 'White-box ở cấp system = độ phủ menu, màn hình, quy trình.'],
  loiHayGap: ['Cho rằng white-box chỉ có ở component.', 'Cho rằng phi chức năng chỉ ở system.'],
  giaiThich: '<p>CT · IT · ST · AT · CT · IT.</p>',
  thuatNgu: [{ en: 'navigation coverage', vi: 'độ phủ điều hướng — menu, màn hình' }],
  khaiNiem: ['test types', 'test levels'],
});

const E4 = jsDe({
  tieuDe: 'Test types 4 — Confirmation or regression? Build the re-test plan',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>Build 1.4.1 fixes some defects. Write <code>retestPlan(fixed, tests, changedModules)</code>:</p>
<ul>
<li><code>fixed</code> — ids of the defects fixed in this build, e.g. <code>['DEF-31']</code>.</li>
<li><code>tests</code> — <code>[{ id, modules: [...], failedWith: 'DEF-31' | null }]</code>: the modules each test exercises and the defect it failed with in the previous build (or <code>null</code>).</li>
<li><code>changedModules</code> — modules touched by the fixes.</li>
</ul>
<p>Return <code>{ confirmation, regression }</code> (both sorted A→Z, no test in both):</p>
<ol><li><b>confirmation</b> — tests that failed with one of the fixed defects (they must now pass).</li>
<li><b>regression</b> — the other tests that exercise at least one changed module (the unchanged areas around the fix).</li></ol>`, vi: `<p>Build 1.4.1 sửa một số lỗi. Viết <code>retestPlan(fixed, tests, changedModules)</code>:</p>
<ul><li><code>fixed</code> — mã các lỗi đã sửa trong build này.</li><li><code>tests</code> — <code>[{ id, modules, failedWith }]</code>: module mỗi test chạy qua và lỗi nó fail ở build trước (hoặc <code>null</code>).</li><li><code>changedModules</code> — module bị bản sửa chạm tới.</li></ul>
<p>Trả <code>{ confirmation, regression }</code> (sắp A→Z, không test nào ở cả hai): <b>confirmation</b> = test đã fail với một lỗi đã sửa; <b>regression</b> = các test còn lại chạy qua ít nhất một module bị đổi.</p>` },
  yeuCau: [{ en: 'A test that failed with a defect that is NOT fixed yet is neither confirmation nor (because of that) excluded from regression — treat it like any other test.', vi: 'Test fail với lỗi CHƯA sửa không phải confirmation — xét nó như mọi test khác.' }],
  viDu: [{ input: "retestPlan(['DEF-31'], [{id:'T1',modules:['cancel'],failedWith:'DEF-31'},{id:'T2',modules:['cancel','mail'],failedWith:null},{id:'T3',modules:['auth'],failedWith:null}], ['cancel'])", output: "{ confirmation: ['T1'], regression: ['T2'] }", explanation: 'T1 failed with the fixed defect; T2 touches the changed module; T3 does not.|||T1 fail với lỗi đã sửa; T2 chạm module đổi; T3 thì không.' }],
  goiY: ['Duyệt tests một lần: nếu failedWith thuộc fixed ⇒ confirmation; ngược lại nếu modules giao changedModules khác rỗng ⇒ regression.', 'Sắp cả hai mảng trước khi trả.'],
  loiHayGap: ['Cho test fail với lỗi chưa sửa vào confirmation.', 'Để một test vừa ở confirmation vừa ở regression.'],
  giaiThich: '<p>Confirmation testing checks the fix; regression testing checks that the change broke nothing else. Both are change-related testing — and regression suites are the prime candidates for automation.</p>',
  thuatNgu: [{ en: 'change-related testing', vi: 'kiểm thử liên quan thay đổi' }, { en: 're-test', vi: 'test lại' }],
  khaiNiem: ['confirmation testing', 'regression testing'],
  tep: {
    'retest.js': [
      'function retestPlan(fixed, tests, changedModules) {\n  return { confirmation: [], regression: [] };\n}\n',
      'function retestPlan(fixed, tests, changedModules) {\n  const fx = new Set(fixed);\n  const ch = new Set(changedModules);\n  const confirmation = [];\n  const regression = [];\n  for (const t of tests) {\n    if (t.failedWith && fx.has(t.failedWith)) confirmation.push(t.id);\n    else if ((t.modules || []).some((m) => ch.has(m))) regression.push(t.id);\n  }\n  return { confirmation: confirmation.sort(), regression: regression.sort() };\n}\n',
    ],
  },
  kiem: [
    kiemTuy({ en: 'the example', vi: 'ví dụ' }, () => { const r = retestPlan(['DEF-31'], [{ id: 'T1', modules: ['cancel'], failedWith: 'DEF-31' }, { id: 'T2', modules: ['cancel', 'mail'], failedWith: null }, { id: 'T3', modules: ['auth'], failedWith: null }], ['cancel']); return JSON.stringify(r) === '{"confirmation":["T1"],"regression":["T2"]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'a test failing with an unfixed defect is not confirmation', vi: 'test fail với lỗi chưa sửa không phải confirmation' }, () => { const r = retestPlan(['DEF-31'], [{ id: 'T4', modules: ['auth'], failedWith: 'DEF-40' }, { id: 'T5', modules: ['cancel'], failedWith: 'DEF-40' }], ['cancel']); return JSON.stringify(r) === '{"confirmation":[],"regression":["T5"]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'confirmation tests are not repeated in regression', vi: 'test confirmation không lặp ở regression' }, () => { const r = retestPlan(['A'], [{ id: 'X', modules: ['m'], failedWith: 'A' }], ['m']); return JSON.stringify(r) === '{"confirmation":["X"],"regression":[]}' ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemTuy({ en: 'several fixed defects and modules, sorted output', vi: 'nhiều lỗi và module, kết quả đã sắp' }, () => { const r = retestPlan(['D2', 'D1'], [{ id: 'T9', modules: ['b'], failedWith: null }, { id: 'T3', modules: ['a'], failedWith: 'D2' }, { id: 'T1', modules: ['c', 'a'], failedWith: null }, { id: 'T2', modules: ['x'], failedWith: 'D1' }], ['a', 'b']); return JSON.stringify(r) === '{"confirmation":["T2","T3"],"regression":["T1","T9"]}' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemTuy({ en: 'nothing changed, nothing fixed', vi: 'không đổi, không sửa' }, () => { const r = retestPlan([], [{ id: 'T1', modules: ['a'], failedWith: null }], []); return JSON.stringify(r) === '{"confirmation":[],"regression":[]}' ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
});

const E5 = tinhDe({
  tieuDe: 'Test types 5 — Exam questions (K1–K2)',
  doKho: 'MEDIUM', phut: 7,
  moTa: { en: '<p>Six FE-style questions: how coverage is measured for each test type, black-box versus white-box at different levels, and the purpose of confirmation and regression testing.</p>', vi: '<p>Sáu câu kiểu FE: đo độ phủ thế nào cho từng loại test, black-box và white-box ở các cấp, mục đích của confirmation và regression testing.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Functional coverage is measured as the extent to which…', 'Độ phủ chức năng đo bằng mức độ…'), luaChon: lc(['a', 'statements have been executed'], ['b', 'some type of functional element (requirements, features, user stories) has been exercised by tests'], ['c', 'users are satisfied'], ['d', 'defects have been fixed']), dapAn: ['b'], giaiThich: giai('Expressed as a percentage of the type(s) of element covered.', 'Biểu thị bằng % số phần tử đã được phủ.') },
    { ma: 'q2', de: hai('Which statement about white-box testing is TRUE?', 'Phát biểu nào về white-box testing là ĐÚNG?'), luaChon: lc(['a', 'It can only be done at component level'], ['b', 'At component integration level it may be based on the architecture, e.g. interfaces between components'], ['c', 'It does not measure coverage'], ['d', 'It is done only by users']), dapAn: ['b'], giaiThich: giai('White-box can be based on code, architecture, workflows or data flows.', 'White-box có thể dựa trên mã, kiến trúc, luồng công việc hay luồng dữ liệu.') },
    { ma: 'q3', de: hai('What is the purpose of regression testing?', 'Mục đích của regression testing là gì?'), luaChon: lc(['a', 'To confirm that a defect has been fixed'], ['b', 'To detect unintended side-effects of changes in the changed and in other, unchanged parts'], ['c', 'To test new features'], ['d', 'To measure performance']), dapAn: ['b'], giaiThich: giai('Changes may also come from the environment (new OS, database version).', 'Thay đổi cũng có thể đến từ môi trường (HĐH mới, phiên bản CSDL).') },
    { ma: 'q4', de: hai('Why are regression test suites a strong candidate for automation?', 'Vì sao bộ regression là ứng viên mạnh cho tự động hoá?'), luaChon: lc(['a', 'They run many times and evolve slowly'], ['b', 'They are always short'], ['c', 'Automation finds new defects better'], ['d', 'They need no maintenance']), dapAn: ['a'], giaiThich: giai('Run repeatedly, especially in iterative lifecycles and CI.', 'Chạy lặp lại nhiều lần, nhất là với vòng đời lặp và CI.') },
    { ma: 'q5', de: hai('Which knowledge supports non-functional test design?', 'Kiến thức nào hỗ trợ thiết kế test phi chức năng?'), luaChon: lc(['a', 'Only the source code'], ['b', 'Knowledge of the underlying technology (e.g. security vulnerabilities of a language) and of the user base'], ['c', 'The developers’ names'], ['d', 'Nothing special']), dapAn: ['b'], giaiThich: giai('Non-functional testing often needs specialised skills.', 'Kiểm thử phi chức năng thường cần kỹ năng chuyên biệt.') },
    { ma: 'q6', de: hai('At which levels can confirmation and regression testing be performed?', 'Confirmation và regression testing làm được ở cấp nào?'), luaChon: lc(['a', 'Only at system level'], ['b', 'At all test levels'], ['c', 'Only at component level'], ['d', 'Only during maintenance']), dapAn: ['b'], giaiThich: giai('Like every test type.', 'Như mọi loại test.') },
  ],
  goiY: ['Mỗi loại đo độ phủ bằng phần tử riêng của nó.', 'Regression = tác dụng phụ không mong muốn.'],
  loiHayGap: ['Chọn “chỉ ở system” cho câu 6.', 'Nhầm mục đích regression với confirmation.'],
  giaiThich: '<p>Answers: b · b · b · a · b · b.</p>',
  thuatNgu: [{ en: 'side-effect', vi: 'tác dụng phụ' }],
  khaiNiem: ['test types'],
});

export default doiDau({
  slug: 'swt301-test-types',
  ten: '2.4 Test types: functional, non-functional, white-box, change-related',
  moTaModule: 'Phân loại test LabBook theo loại, đặc tính ISO 25010, mọi loại ở mọi cấp, viết code lập kế hoạch confirmation + regression sau bản sửa, câu thi.',
  khoa: KHOA,
  baiHoc: 'swt301-test-types',
  de: [E1, E2, E3, E4, E5],
});
