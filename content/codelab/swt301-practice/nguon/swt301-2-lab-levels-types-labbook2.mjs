/**
 * SWT301 · LAB CHƯƠNG 2 — Cấp test & loại test của LabBook 2.0: A. cấp × loại của 10 test · B. kế hoạch tích hợp (stub/driver)
 * · C. bảo trì: tác nhân, phân tích tác động, confirmation/regression · D. test plan IEEE 829 + dạng acceptance.
 */
import { doiDau, KHOA, kiemKhoa, svg, NOP_BAI } from './_chung.mjs';

const CAP = ['CT', 'CIT', 'SIT', 'ST', 'UAT'];
const LOAI = ['Functional', 'Non-functional', 'White-box', 'Confirmation', 'Regression'];
const TEST = [
  ['T1', 'JUnit: calcRefund returns 50 (%) when the booking is cancelled 3 hours before the start', 'CT', 'Functional'],
  ['T2', 'JaCoCo shows that every branch of calcRefund has been executed', 'CT', 'White-box'],
  ['T3', 'Postman: POST /api/bookings with the duration sent in minutes is rejected with 400 VALIDATION by the service', 'CIT', 'Functional'],
  ['T4', 'Booking e-mails sent through the university mail gateway arrive in the student’s Outlook mailbox with the right subject', 'SIT', 'Functional'],
  ['T5', '500 students book at 07:00 on Monday; 95% of the responses arrive within 1 second (SRS NFR-02)', 'ST', 'Non-functional'],
  ['T6', 'The system test case ST-07, which failed with DEF-31, is run again on build 2.0.1 that contains the fix', 'ST', 'Confirmation'],
  ['T7', 'After the PostgreSQL upgrade, the whole system test suite of booking and cancellation is run again', 'ST', 'Regression'],
  ['T8', 'Lab managers use 2.0 for one week and decide whether closing and reopening labs supports their business process', 'UAT', 'Functional'],
  ['T9', 'During the acceptance week, ten students rate how easy it is to book without help', 'UAT', 'Non-functional'],
  ['T10', 'Every call path between the booking module and the mail module is exercised (interface coverage)', 'CIT', 'White-box'],
];

const CAY = { controller: ['bookingSvc', 'cancelSvc'], bookingSvc: ['seatRepo', 'mailer'], cancelSvc: ['bookingSvc', 'mailer'], seatRepo: [], mailer: [] };
const HINH_CAY = svg({
  w: 560, h: 220, tieuDe: 'LabBook call tree',
  nut: [
    { id: 'controller', x: 280, y: 30, nhan: 'controller', hinh: 'hop', rong: 100 },
    { id: 'bookingSvc', x: 170, y: 110, nhan: 'bookingSvc', hinh: 'hop', rong: 100 },
    { id: 'cancelSvc', x: 400, y: 110, nhan: 'cancelSvc', hinh: 'hop', rong: 100 },
    { id: 'seatRepo', x: 120, y: 190, nhan: 'seatRepo', hinh: 'hop', rong: 90 },
    { id: 'mailer', x: 320, y: 190, nhan: 'mailer', hinh: 'hop', rong: 80 },
  ],
  canh: [{ tu: 'controller', den: 'bookingSvc' }, { tu: 'controller', den: 'cancelSvc' }, { tu: 'bookingSvc', den: 'seatRepo' }, { tu: 'bookingSvc', den: 'mailer' }, { tu: 'cancelSvc', den: 'bookingSvc' }, { tu: 'cancelSvc', den: 'mailer' }],
});

const DEPS = { 'web-ui': ['api'], api: ['booking', 'cancel', 'report'], booking: ['repository', 'mail'], cancel: ['booking', 'mail'], report: ['repository'], mail: [], repository: [] };
const BO_TEST = [['ST-01', ['web-ui', 'api', 'booking'], null], ['ST-02', ['api', 'cancel'], null], ['ST-03', ['api', 'report'], null], ['ST-04', ['booking', 'mail'], null], ['ST-05', ['cancel', 'mail'], 'DEF-31'], ['ST-06', ['repository'], null], ['ST-07', ['booking'], 'DEF-40']];

const MUC = ['3 Test items', '5 Features not to be tested', '6 Approach', '7 Item pass/fail criteria', '8 Suspension and resumption criteria', '11 Environmental needs', '13 Staffing and training needs', '15 Risks and contingencies'];
const DANG = ['UAT', 'OAT', 'Contractual AT', 'Regulatory AT', 'Alpha testing', 'Beta testing'];

const KIEM = [
  ...kiemKhoa(TEST.flatMap(([m, , cap, loai], i) => [
    { moTa: { en: `A — level of ${m}`, vi: `A — cấp của ${m}` }, bieuThuc: `(TESTS.${m} || {}).level`, chap: [cap], nhom: 'f1', ...(i >= 7 ? { an: true } : {}) },
    { moTa: { en: `A — type of ${m}`, vi: `A — loại của ${m}` }, bieuThuc: `(TESTS.${m} || {}).type`, chap: [loai], nhom: 'f1', ...(i >= 7 ? { an: true } : {}) },
  ])),
  ...kiemKhoa([
    { moTa: { en: 'B — top-down integration order', vi: 'B — thứ tự tích hợp top-down' }, bieuThuc: 'JSON.stringify(INTEGRATION.topDownOrder)', chap: [JSON.stringify(['controller', 'bookingSvc', 'cancelSvc', 'seatRepo', 'mailer'])], nhom: 'f2' },
    { moTa: { en: 'B — stubs for baseline {controller, bookingSvc}', vi: 'B — stub cho baseline {controller, bookingSvc}' }, bieuThuc: '(INTEGRATION.stubsBaseline2 || []).map(String)', chap: [['cancelSvc', 'seatRepo', 'mailer']], kieu: 'tap', nhom: 'f2' },
    { moTa: { en: 'B — drivers to test {seatRepo, mailer} bottom-up', vi: 'B — driver để test {seatRepo, mailer} bottom-up' }, bieuThuc: '(INTEGRATION.driversLeaves || []).map(String)', chap: [['bookingSvc', 'cancelSvc']], kieu: 'tap', nhom: 'f2' },
    { moTa: { en: 'B — drivers for baseline {seatRepo, mailer, bookingSvc}', vi: 'B — driver cho baseline {seatRepo, mailer, bookingSvc}' }, bieuThuc: '(INTEGRATION.driversBaseline3 || []).map(String)', chap: [['controller', 'cancelSvc']], kieu: 'tap', nhom: 'f2', an: true },
  ]),
  ...kiemKhoa([
    ...[['E1', 'Migration'], ['E2', 'Modification'], ['E3', 'Retirement']].map(([k, v]) => ({ moTa: { en: `C — trigger of ${k}`, vi: `C — tác nhân của ${k}` }, bieuThuc: `MAINTENANCE.triggers.${k}`, chap: [v], nhom: 'f3' })),
    { moTa: { en: 'C — modules impacted by the change in cancel', vi: 'C — module bị ảnh hưởng bởi thay đổi ở cancel' }, bieuThuc: '(MAINTENANCE.impacted || []).map(String)', chap: [['api', 'cancel', 'web-ui']], kieu: 'tap', nhom: 'f3', goiY: 'the changed module + everything that depends on it, directly or transitively' },
    { moTa: { en: 'C — confirmation tests for DEF-31', vi: 'C — test confirmation cho DEF-31' }, bieuThuc: '(MAINTENANCE.confirmation || []).map(String)', chap: [['ST-05']], kieu: 'tap', nhom: 'f3' },
    { moTa: { en: 'C — regression tests (exercise an impacted module, not confirmation)', vi: 'C — test regression (chạy qua module bị ảnh hưởng, không phải confirmation)' }, bieuThuc: '(MAINTENANCE.regression || []).map(String)', chap: [['ST-01', 'ST-02', 'ST-03']], kieu: 'tap', nhom: 'f3' },
  ]),
  ...kiemKhoa([
    ...[['D1', MUC[1]], ['D2', MUC[4]], ['D3', MUC[7]], ['D4', MUC[0]]].map(([k, v], i) => ({ moTa: { en: `D — IEEE 829 section of ${k}`, vi: `D — mục IEEE 829 của ${k}` }, bieuThuc: `PLAN.${k}`, chap: [v], nhom: 'f4', ...(i === 3 ? { an: true } : {}) })),
    ...[['A1', 'OAT'], ['A2', 'Beta testing']].map(([k, v]) => ({ moTa: { en: `D — acceptance form of ${k}`, vi: `D — dạng acceptance của ${k}` }, bieuThuc: `PLAN.${k}`, chap: [v], nhom: 'f4' })),
  ]),
];

const BAN_IN = {
  tieuDe: 'Lab 2 — Test Levels and Test Types of LabBook 2.0',
  phu: { en: 'Chapter 2 lab · levels × types, integration plan, maintenance testing, IEEE 829 and acceptance · 10 marks', vi: 'Lab chương 2 · cấp × loại, kế hoạch tích hợp, kiểm thử bảo trì, IEEE 829 và acceptance · 10 điểm' },
  moTa: {
    en: `<p>LabBook 2.0 moves to the cloud and adds an exam-week rule. As test lead you prepare the test approach.</p>
<p><b>A. Ten planned tests</b> — give each a level (CT, CIT, SIT, ST, UAT — the Overview.xlsx naming) and a type (Functional, Non-functional, White-box, Confirmation, Regression):</p><ul>${TEST.map(([m, t]) => `<li><b>${m}</b> — ${t}</li>`).join('')}</ul>
<p><b>B. Integration plan</b> of the back-end (arrows: caller → called):</p>${HINH_CAY}<p>As data: <code>${JSON.stringify(CAY)}</code>.</p>
<p><b>C. Maintenance.</b> Events: <b>E1</b> LabBook moves to a cloud provider and all bookings are converted to the new database · <b>E2</b> hot-fix of DEF-31 in the cancel module · <b>E3</b> the old usage-report module is switched off and its data archived. Module dependencies (“depends on”): <code>${JSON.stringify(DEPS)}</code>. System test suite (modules exercised, defect it last failed with): ${BO_TEST.map(([id, m, d]) => `<code>${id}</code> ${m.join('+')}${d ? ` (failed: ${d})` : ''}`).join(' · ')}. Build 2.0.1 fixes <b>DEF-31</b> by changing only <b>cancel</b>.</p>
<p><b>D. Test plan and acceptance.</b> D1 “The usage report is not tested because it will be retired.” · D2 “Testing stops when the test server is down for more than 4 hours and restarts with the smoke suite.” · D3 “If the cloud environment is late, performance tests move to the week after.” · D4 “Build 2.0.0-rc1 (CI build 412) with release notes.” · A1 University IT tests backup, restore and user management before go-live. · A2 All students may use the pre-release from home before the launch.</p>`,
    vi: `<p>LabBook 2.0 chuyển lên cloud và thêm luật tuần thi. Là trưởng nhóm test, bạn chuẩn bị cách tiếp cận test.</p>
<p><b>A.</b> Mười test dự kiến (T1–T10 ở trên) — cho mỗi test một cấp (CT, CIT, SIT, ST, UAT — cách gọi của Overview.xlsx) và một loại (Functional, Non-functional, White-box, Confirmation, Regression).</p>
<p><b>B.</b> Kế hoạch tích hợp back-end theo cây gọi ở trên (mũi tên: bên gọi → bên được gọi).</p>
<p><b>C. Bảo trì.</b> E1 chuyển lên cloud kèm chuyển đổi dữ liệu · E2 bản sửa khẩn DEF-31 trong module cancel · E3 tắt module báo cáo cũ và lưu trữ dữ liệu. Đồ thị phụ thuộc và bộ system test như bản tiếng Anh. Build 2.0.1 sửa <b>DEF-31</b> và chỉ đổi <b>cancel</b>.</p>
<p><b>D.</b> Bốn câu D1–D4 lấy từ test plan và hai tình huống acceptance A1–A2 ở trên.</p>`,
  },
  chucNangChinh: [
    { en: 'A. Level and type of each of the 10 tests.', vi: 'A. Cấp và loại của 10 test.' },
    { en: 'B. Top-down order, stubs and drivers.', vi: 'B. Thứ tự top-down, stub và driver.' },
    { en: 'C. Triggers, impact analysis, confirmation and regression sets.', vi: 'C. Tác nhân, phân tích tác động, tập confirmation và regression.' },
    { en: 'D. IEEE 829 sections and acceptance forms.', vi: 'D. Mục IEEE 829 và dạng acceptance.' },
  ],
  yeuCauChung: [{ en: 'Use exactly the values listed in the data model (case does not matter).', vi: 'Dùng đúng giá trị trong mô hình dữ liệu (không phân biệt hoa thường).' }],
  cayThuMuc: `answers/
├── a-tests.js        ← const TESTS = { T1: { level, type }, … }
├── b-integration.js  ← const INTEGRATION = { topDownOrder, stubsBaseline2, driversLeaves, driversBaseline3 }
├── c-maintenance.js  ← const MAINTENANCE = { triggers: { E1, E2, E3 }, impacted, confirmation, regression }
└── d-plan.js         ← const PLAN = { D1, D2, D3, D4, A1, A2 }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['level · type', 'string', { en: `${CAP.join(' · ')} — ${LOAI.join(' · ')}`, vi: `${CAP.join(' · ')} — ${LOAI.join(' · ')}` }],
      ['triggers.*', 'string', { en: 'Modification · Migration · Retirement', vi: 'Modification · Migration · Retirement' }],
      ['PLAN.D*', 'string', { en: MUC.join(' · '), vi: MUC.join(' · ') }],
      ['PLAN.A*', 'string', { en: DANG.join(' · '), vi: DANG.join(' · ') }],
    ],
  },
  chucNang: [
    { ten: { en: 'A. Levels × types', vi: 'A. Cấp × loại' }, diem: 3, yeuCau: [{ en: '20 values; every type can appear at every level.', vi: '20 giá trị; loại nào cũng có thể ở cấp nào.' }], hook: ['test levels', 'test types'] },
    { ten: { en: 'B. Integration plan', vi: 'B. Kế hoạch tích hợp' }, diem: 2, yeuCau: [{ en: 'Breadth-first top-down order; stubs below, drivers above.', vi: 'Thứ tự top-down theo chiều rộng; stub ở dưới, driver ở trên.' }], hook: ['integration strategies'] },
    { ten: { en: 'C. Maintenance testing', vi: 'C. Kiểm thử bảo trì' }, diem: 3, yeuCau: [{ en: 'Triggers, transitive impact set, confirmation vs regression.', vi: 'Tác nhân, tập ảnh hưởng bắc cầu, confirmation và regression.' }], hook: ['impact analysis', 'regression'] },
    { ten: { en: 'D. Plan and acceptance', vi: 'D. Kế hoạch và nghiệm thu' }, diem: 2, yeuCau: [{ en: 'Four IEEE 829 sections, two acceptance forms.', vi: 'Bốn mục IEEE 829, hai dạng acceptance.' }], hook: ['IEEE 829', 'acceptance testing'] },
  ],
  idBatBuoc: [['TESTS', 'answers/a-tests.js'], ['INTEGRATION', 'answers/b-integration.js'], ['MAINTENANCE', 'answers/c-maintenance.js'], ['PLAN', 'answers/d-plan.js']],
  truDiem: [
    { en: 'Regression set computed from the changed module only (misses ST-01 and ST-03, which reach cancel’s callers).', vi: 'Tính tập regression chỉ từ module bị đổi (sót ST-01, ST-03 chạy qua bên gọi cancel).' },
    { en: 'Putting ST-07 in confirmation — DEF-40 is not fixed in this build.', vi: 'Đưa ST-07 vào confirmation — DEF-40 chưa được sửa ở build này.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI = {
  'answers/a-tests.js': `const TESTS = {\n${TEST.map(([m, , c, l]) => `  ${m}: { level: '${c}', type: '${l}' },`).join('\n')}\n};\n`,
  'answers/b-integration.js': `// Top-down breadth-first from controller. Baseline {controller, bookingSvc}: missing called components → stubs.
// Bottom-up: callers of the baseline that are not integrated yet → drivers.
const INTEGRATION = {
  topDownOrder: ['controller', 'bookingSvc', 'cancelSvc', 'seatRepo', 'mailer'],
  stubsBaseline2: ['cancelSvc', 'mailer', 'seatRepo'],
  driversLeaves: ['bookingSvc', 'cancelSvc'],
  driversBaseline3: ['cancelSvc', 'controller'],
};
`,
  'answers/c-maintenance.js': `// Impact of a change in cancel: cancel ← api ← web-ui.
// Confirmation: ST-05 (failed with DEF-31). Regression: other tests touching api, cancel or web-ui.
const MAINTENANCE = {
  triggers: { E1: 'Migration', E2: 'Modification', E3: 'Retirement' },
  impacted: ['api', 'cancel', 'web-ui'],
  confirmation: ['ST-05'],
  regression: ['ST-01', 'ST-02', 'ST-03'],
};
`,
  'answers/d-plan.js': `const PLAN = {
  D1: '5 Features not to be tested',
  D2: '8 Suspension and resumption criteria',
  D3: '15 Risks and contingencies',
  D4: '3 Test items',
  A1: 'OAT',
  A2: 'Beta testing',
};
`,
};

export default doiDau({
  slug: 'swt301-2-lab-levels-types-labbook2',
  ten: 'Lab 2 — Test Levels and Test Types of LabBook 2.0',
  moTaModule: 'Lab chương 2: cấp × loại của 10 test (CT/CIT/SIT/ST/UAT), kế hoạch tích hợp top-down/bottom-up với stub/driver, kiểm thử bảo trì (tác nhân, phân tích tác động bắc cầu, confirmation/regression), mục IEEE 829 và dạng acceptance.',
  khoa: KHOA,
  baiHoc: 'swt301-maintenance-test-plan',
  de: [{
    dangBai: 'lab',
    tieuDe: 'Lab 2 — Test Levels and Test Types of LabBook 2.0',
    doKho: 'HARD', phut: 70, diem: 100, ngonNgu: 'javascript',
    viDu: [{ input: 'T2 — JaCoCo shows that every branch of calcRefund has been executed', output: "{ level: 'CT', type: 'White-box' }", explanation: 'Branch coverage of one method.|||Độ phủ nhánh của một method.' }],
    khaiNiem: ['test levels', 'test types', 'integration strategies', 'maintenance testing', 'impact analysis', 'IEEE 829', 'acceptance testing'],
    tienQuyet: ['SWT301 chapter 2'],
    the: ['swt301', 'lab', 'test-levels'],
    banIn: BAN_IN,
    thuatNgu: [{ en: 'CT / CIT / SIT / ST / UAT', vi: 'component / component integration / system integration / system / user acceptance test' }, { en: 'stub / driver', vi: 'thay bên được gọi / thay bên gọi' }, { en: 'impact analysis', vi: 'phân tích tác động' }],
    goiY: [
      'A: cấp = test ở ĐÂU (đối tượng, test basis); loại = test CÁI GÌ (chức năng, chất lượng, cấu trúc, thay đổi).',
      'B: baseline {controller, bookingSvc} thiếu cancelSvc (controller gọi), seatRepo và mailer (bookingSvc gọi).',
      'C: đi NGƯỢC mũi tên phụ thuộc từ cancel; ST-07 fail với lỗi chưa sửa.',
    ],
    loiHayGap: ['Gán T4 (cổng thư của trường) là CIT — hệ thống ngoài ⇒ SIT.', 'Tính regression chỉ trên module bị đổi.', 'Nhầm mục 7 và mục 8 của IEEE 829.'],
    moTaNgan: 'Lab chương 2: cấp và loại test của LabBook 2.0.',
    giaiThich: {
      en: '<p><b>A.</b> T1 CT/F · T2 CT/WB · T3 CIT/F · T4 SIT/F · T5 ST/NF · T6 ST/Conf · T7 ST/Reg · T8 UAT/F · T9 UAT/NF · T10 CIT/WB. <b>B.</b> controller, bookingSvc, cancelSvc, seatRepo, mailer · stubs cancelSvc, mailer, seatRepo · drivers bookingSvc, cancelSvc · drivers controller, cancelSvc. <b>C.</b> Migration, Modification, Retirement · api, cancel, web-ui · ST-05 · ST-01, ST-02, ST-03. <b>D.</b> 5, 8, 15, 3 · OAT, Beta.</p>',
      vi: '<p>Xem bản tiếng Anh — đáp án từng phần.</p>',
    },
    loaiKiem: 'js',
    tests: { loai: 'js', phienBan: 1, tepNap: Object.keys(GIAI), kiem: KIEM },
    khoiDau: {
      'answers/a-tests.js': `// level: ${CAP.join(' | ')}\n// type: ${LOAI.join(' | ')}\nconst TESTS = {\n  T1: { level: 'CT', type: 'Functional' },\n${TEST.slice(1).map(([m]) => `  ${m}: { level: '', type: '' },`).join('\n')}\n};\n`,
      'answers/b-integration.js': 'const INTEGRATION = {\n  topDownOrder: [],\n  stubsBaseline2: [],\n  driversLeaves: [],\n  driversBaseline3: [],\n};\n',
      'answers/c-maintenance.js': "const MAINTENANCE = {\n  triggers: { E1: '', E2: '', E3: '' },\n  impacted: [],\n  confirmation: [],\n  regression: [],\n};\n",
      'answers/d-plan.js': `// D*: ${MUC.join(' | ')}\n// A*: ${DANG.join(' | ')}\nconst PLAN = { D1: '', D2: '', D3: '', D4: '', A1: '', A2: '' };\n`,
    },
    loiGiai: GIAI,
    boYeu: [
      { ten: 'regression chỉ theo module bị đổi', tep: { 'answers/c-maintenance.js': GIAI['answers/c-maintenance.js'].replace("regression: ['ST-01', 'ST-02', 'ST-03']", "regression: ['ST-02']").replace("impacted: ['api', 'cancel', 'web-ui']", "impacted: ['cancel']") }, phaiTruot: ['C — regression tests', 'C — modules impacted'] },
      { ten: 'đảo stub và driver', tep: { 'answers/b-integration.js': GIAI['answers/b-integration.js'].replace("driversLeaves: ['bookingSvc', 'cancelSvc']", "driversLeaves: []") }, phaiTruot: ['B — drivers to test'] },
    ],
  }],
});
