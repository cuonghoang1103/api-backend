/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 8: tự động hoá bộ regression bằng KEYWORD-DRIVEN — tester viết bảng từ khoá, thư viện từ
 * khoá (do kỹ sư tự động hoá giữ) dịch sang lời gọi API, máy chấm chạy trên LabBook và các bản build lỗi; kèm Góc phỏng vấn 8.
 */
import { doiDau, KHOA, hai, giai, lc, kiemKhoa, preMa, NOP_BAI, bangHtml } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';
import { kiemKichBan, DOT_BIEN_HE_THONG, DOT_BIEN_TICH_HOP } from './_labbook.mjs';

const LIB = `// Keyword library of the LabBook automation framework.
// Maintained by the automation engineers — testers only write KEYWORD_TESTS. Do not edit.
const ACCOUNTS = {
  student1: ['an@fpt.edu.vn', 'An@12345'], student2: ['binh@fpt.edu.vn', 'Binh@123'], student3: ['chi@fpt.edu.vn', 'Chi@1234'],
  manager: ['manager@fpt.edu.vn', 'Mgr@1234'], admin: ['admin@fpt.edu.vn', 'Adm@1234'],
};
const KEYWORDS = {
  // Book | actor | lab | date | startHour | duration | expected HTTP status | CONFIRMED / PENDING / error code
  Book: (actor, lab, date, startHour, duration, status, result) => ({ as: actor, call: 'POST /api/bookings', body: { labCode: lab, date, startHour, duration }, expect: status === 201 ? { status, body: { status: result } } : { status, body: { error: result } } }),
  // Cancel | actor | booking code | expected HTTP status | error code (when not 200)
  Cancel: (actor, code, status, error) => ({ as: actor, call: 'DELETE /api/bookings/' + code, expect: status === 200 ? { status, body: { status: 'CANCELLED' } } : { status, body: { error } } }),
  // SetLab | actor | lab | OPEN / CLOSED | expected HTTP status
  SetLab: (actor, lab, value, status) => ({ as: actor, call: 'PATCH /api/labs/' + lab, body: { status: value }, expect: { status } }),
  // CheckBooking | booking code | expected status in the database
  CheckBooking: (code, bookingStatus) => ({ as: 'admin', call: 'GET /test/db/bookings', expect: { status: 200, body: { [Number(String(code).slice(2)) - 1]: { code, status: bookingStatus } } } }),
  // CheckMail | position in the outbox (0 = first e-mail) | to | subject | booking code
  CheckMail: (index, to, subject, ref) => ({ as: 'admin', call: 'GET /test/outbox', expect: { status: 200, body: { [index]: { to, subject, ref } } } }),
  // Login | actor | password or RIGHT | expected HTTP status | error code (optional)
  Login: (actor, password, status, error) => ({ as: 'guest', call: 'POST /api/auth/login', body: { email: ACCOUNTS[actor][0], password: password === 'RIGHT' ? ACCOUNTS[actor][1] : password }, expect: error ? { status, body: { error } } : { status } }),
  // Lock / Unlock | e-mail   (performed by the admin)
  Lock: (email) => ({ as: 'admin', call: 'POST /api/admin/users/' + email + '/lock', expect: { status: 200, body: { locked: true } } }),
  Unlock: (email) => ({ as: 'admin', call: 'POST /api/admin/users/' + email + '/unlock', expect: { status: 200, body: { locked: false } } }),
};
const TEST_CASES = (typeof KEYWORD_TESTS !== 'undefined' && Array.isArray(KEYWORD_TESTS) ? KEYWORD_TESTS : []).map((t) => ({
  id: t && t.id,
  description: t && t.description,
  precondition: 'Seed data; clock Mon 2026-11-02 08:00',
  steps: ((t && t.rows) || []).map((row) => {
    const [k, ...a] = Array.isArray(row) ? row : [];
    const f = Object.prototype.hasOwnProperty.call(KEYWORDS, k) ? KEYWORDS[k] : null;
    return f ? f(...a) : { as: 'guest', call: 'GET /unknown-keyword/' + encodeURIComponent(String(k)), expect: { status: 200 } };
  }),
}));
`;

const KT = [
  { id: 'KT-01', description: 'Waitlist promotion is first come, first served and the promoted student is e-mailed', rows: [
    ['Book', 'student1', 'LAB02', '2026-11-04', 9, 1, 201, 'CONFIRMED'],
    ['Book', 'student2', 'LAB02', '2026-11-04', 9, 1, 201, 'PENDING'],
    ['Book', 'student3', 'LAB02', '2026-11-04', 9, 1, 201, 'PENDING'],
    ['Cancel', 'student1', 'BK0001', 200],
    ['CheckBooking', 'BK0002', 'CONFIRMED'],
    ['CheckBooking', 'BK0003', 'PENDING'],
    ['CheckMail', 3, 'binh@fpt.edu.vn', 'Booking confirmed', 'BK0002'],
  ] },
  { id: 'KT-02', description: 'Only CONFIRMED bookings take seats: a waitlisted booking is promoted when a seat is freed', rows: [
    ['Book', 'student1', 'LAB01', '2026-11-05', 10, 1, 201, 'CONFIRMED'],
    ['Book', 'student2', 'LAB01', '2026-11-05', 10, 1, 201, 'CONFIRMED'],
    ['Book', 'student3', 'LAB01', '2026-11-05', 10, 1, 201, 'PENDING'],
    ['Cancel', 'student2', 'BK0002', 200],
    ['CheckBooking', 'BK0003', 'CONFIRMED'],
  ] },
  { id: 'KT-03', description: 'A closed lab refuses bookings; once re-opened it accepts them again', rows: [
    ['SetLab', 'manager', 'LAB01', 'CLOSED', 200],
    ['Book', 'student1', 'LAB01', '2026-11-04', 9, 1, 409, 'LAB_CLOSED'],
    ['SetLab', 'manager', 'LAB01', 'OPEN', 200],
    ['Book', 'student1', 'LAB01', '2026-11-04', 9, 1, 201, 'CONFIRMED'],
  ] },
  { id: 'KT-04', description: 'Closing a lab cancels its CONFIRMED and PENDING bookings', rows: [
    ['Book', 'student1', 'LAB02', '2026-11-06', 9, 1, 201, 'CONFIRMED'],
    ['Book', 'student2', 'LAB02', '2026-11-06', 9, 1, 201, 'PENDING'],
    ['SetLab', 'manager', 'LAB02', 'CLOSED', 200],
    ['CheckBooking', 'BK0001', 'CANCELLED'],
    ['CheckBooking', 'BK0002', 'CANCELLED'],
  ] },
  { id: 'KT-05', description: 'A successful login resets the failure counter', rows: [
    ['Login', 'student2', 'wrong-1', 401, 'AUTH_INVALID'],
    ['Login', 'student2', 'wrong-2', 401, 'AUTH_INVALID'],
    ['Login', 'student2', 'RIGHT', 200],
    ['Login', 'student2', 'wrong-3', 401, 'AUTH_INVALID'],
    ['Login', 'student2', 'RIGHT', 200],
  ] },
  { id: 'KT-06', description: 'Cancelled hours do not count toward the weekly 6-hour limit', rows: [
    ['Book', 'student1', 'LAB01', '2026-11-04', 9, 3, 201, 'CONFIRMED'],
    ['Book', 'student1', 'LAB01', '2026-11-05', 9, 3, 201, 'CONFIRMED'],
    ['Book', 'student1', 'LAB01', '2026-11-06', 9, 1, 422, 'WEEKLY_LIMIT'],
    ['Cancel', 'student1', 'BK0002', 200],
    ['Book', 'student1', 'LAB01', '2026-11-06', 9, 1, 201, 'CONFIRMED'],
  ] },
  { id: 'KT-07', description: 'A locked account cannot log in until the admin unlocks it', rows: [
    ['Lock', 'an@fpt.edu.vn'],
    ['Login', 'student1', 'RIGHT', 423, 'ACCOUNT_LOCKED'],
    ['Unlock', 'an@fpt.edu.vn'],
    ['Login', 'student1', 'RIGHT', 200],
  ] },
];

const HT = (ma) => DOT_BIEN_HE_THONG.find((m) => m.ma === ma);
const TH = (ma) => DOT_BIEN_TICH_HOP.find((m) => m.ma === ma);
const CAN = [
  { ma: 'TRANS PENDING->CONFIRMED', ten: 'a waitlisted booking is promoted', tenVi: 'booking chờ được nâng hạng' },
  { ma: 'POST /api/bookings 409 LAB_CLOSED', ten: 'booking a closed lab', tenVi: 'đặt phòng đã đóng' },
  { ma: 'POST /api/auth/login 423 ACCOUNT_LOCKED', ten: 'logging in to a locked account', tenVi: 'đăng nhập tài khoản bị khoá' },
  { ma: 'EVENT CASCADE', ten: 'closing a lab cancels its bookings', tenVi: 'đóng phòng huỷ các booking', an: true },
];
const KIEM = [
  kiemTuy({ en: 'KEYWORD_TESTS: every row uses a keyword of the library', vi: 'KEYWORD_TESTS: mọi dòng dùng từ khoá có trong thư viện' }, () => {
    if (typeof KEYWORD_TESTS === 'undefined' || !Array.isArray(KEYWORD_TESTS)) return 'declare const KEYWORD_TESTS = [ { id, description, rows: [ [keyword, ...args] ] } ]';
    for (const t of KEYWORD_TESTS) for (const r of (t && t.rows) || []) if (!Array.isArray(r) || !Object.prototype.hasOwnProperty.call(KEYWORDS, r[0])) return (t.id || '?') + ': unknown keyword ' + JSON.stringify(Array.isArray(r) ? r[0] : r) + ' — use ' + Object.keys(KEYWORDS).join(', ');
    return 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'KEYWORD_TESTS: at least 5 different keywords used, each test ≤ 12 rows', vi: 'KEYWORD_TESTS: dùng ít nhất 5 từ khoá khác nhau, mỗi test ≤ 12 dòng' }, () => {
    const L = typeof KEYWORD_TESTS !== 'undefined' && Array.isArray(KEYWORD_TESTS) ? KEYWORD_TESTS : [];
    const used = new Set();
    for (const t of L) { const rows = (t && t.rows) || []; if (rows.length > 12) return (t.id || '?') + ' has ' + rows.length + ' rows — keep tests short and focused'; rows.forEach((r) => Array.isArray(r) && used.add(r[0])); }
    return used.size >= 5 ? 'OK' : 'only ' + used.size + ' keyword(s) used';
  }, { nhom: 'f1' }),
  ...kiemKichBan({
    bien: 'TEST_CASES', minCa: 6, can: CAN, nhomCauTruc: 'f1', nhomPhu: 'f1',
    dotBien: [HT('S7'), TH('I4'), HT('S2'), HT('S4'), HT('S8'), TH('I9'), { ...TH('I5'), an: true }, { ...HT('S3'), an: true }],
    nhomDotBien: 'f2',
  }),
  ...kiemKhoa([
    { moTa: { en: 'B — scripting approach used', vi: 'B — cách viết script đã dùng' }, bieuThuc: 'AUTOMATION.approach', chap: ['Keyword-driven'], nhom: 'f3' },
    { moTa: { en: 'B — who writes new tests', vi: 'B — ai viết test mới' }, bieuThuc: 'AUTOMATION.testsWrittenBy', chap: ['Testers, without programming'], nhom: 'f3' },
    { moTa: { en: 'B — who maintains the keywords', vi: 'B — ai bảo trì từ khoá' }, bieuThuc: 'AUTOMATION.keywordsMaintainedBy', chap: ['Automation engineers'], nhom: 'f3' },
    { moTa: { en: 'B — when the suite runs', vi: 'B — bộ test chạy khi nào' }, bieuThuc: 'AUTOMATION.runs', chap: ['On every push, as a merge gate'], nhom: 'f3' },
    { moTa: { en: 'B — main cost of this approach', vi: 'B — chi phí chính của cách này' }, bieuThuc: 'AUTOMATION.mainCost', chap: ['Building and maintaining the keyword library'], nhom: 'f3' },
  ]),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 8 — Automate the Regression Suite with Keywords',
  phu: { en: 'Running project · chapter 8 · keyword-driven automation run on LabBook and faulty builds · 10 marks', vi: 'Dự án xuyên suốt · chương 8 · tự động hoá hướng từ khoá chạy trên LabBook và bản build lỗi · 10 điểm' },
  moTa: {
    en: `<p>The automation engineers built a <b>keyword library</b> on top of the LabBook API (<code>lib/keywords.js</code>, read-only). Testers write tests as tables of keywords; the framework turns each row into an API call, runs it and checks the expected result.</p>${preMa(LIB.split('\n').filter((l) => /^\s*\/\/ [A-Z]/.test(l)).join('\n'))}
${bangHtml(['Example row', 'Means'], [["['Book', 'student1', 'LAB02', '2026-11-04', 9, 1, 201, 'CONFIRMED']", 'student1 books LAB02 on 4 Nov 09:00 for 1 h and gets 201 CONFIRMED'], ["['Cancel', 'student1', 'BK0001', 409, 'TOO_LATE']", 'cancelling BK0001 must be refused with 409 TOO_LATE'], ["['CheckBooking', 'BK0002', 'CONFIRMED']", 'in the database, BK0002 is CONFIRMED'], ["['Login', 'student2', 'wrong-1', 401, 'AUTH_INVALID']", 'a wrong password is refused']])}
<p>Every test starts from the seed data (booking codes BK0001, BK0002… in creation order; the outbox records every e-mail in order). The rules of the system are those of the LabBook API used since chapter 2: LAB01 has 2 seats, LAB02 1 seat, LAB03 is closed; waitlist promotion is first come, first served; the third consecutive wrong password locks the account and a successful login resets the counter; closing a lab cancels its CONFIRMED and PENDING bookings; cancelled bookings do not count toward the weekly 6-hour limit.</p>
<p><b>A.</b> Write <code>KEYWORD_TESTS</code> — the automated regression suite. The grader runs it on LabBook and on <b>8 faulty builds</b> (6 listed in the rubric, 2 hidden). <b>B.</b> Describe the automation set-up in <code>AUTOMATION</code>.</p>`,
    vi: `<p>Kỹ sư tự động hoá đã dựng <b>thư viện từ khoá</b> trên API LabBook (<code>lib/keywords.js</code>, chỉ đọc). Tester viết test dạng bảng từ khoá; framework dịch mỗi dòng thành một lời gọi API, chạy và kiểm kết quả mong đợi. Mỗi test bắt đầu từ dữ liệu mẫu (mã BK0001, BK0002… theo thứ tự tạo; hộp thư ghi mọi thư theo thứ tự). Luật hệ thống như API LabBook từ chương 2: LAB01 2 chỗ, LAB02 1 chỗ, LAB03 đóng; nâng hạng ai đến trước được trước; sai mật khẩu lần thứ ba liên tiếp thì khoá, đăng nhập đúng đặt lại bộ đếm; đóng phòng huỷ cả CONFIRMED và PENDING; booking đã huỷ không tính vào giới hạn 6 giờ/tuần.</p>
<p><b>A.</b> Viết <code>KEYWORD_TESTS</code> — bộ regression tự động. Máy chấm chạy trên LabBook và <b>8 bản build lỗi</b> (6 công khai, 2 ẩn). <b>B.</b> Mô tả cách tổ chức tự động hoá trong <code>AUTOMATION</code>.</p>`,
  },
  chucNangChinh: [
    { en: 'A. A keyword-driven regression suite that passes on LabBook and catches the faulty builds.', vi: 'A. Bộ regression hướng từ khoá đạt trên LabBook và bắt được các bản build lỗi.' },
    { en: 'B. Roles, schedule and cost of the automation.', vi: 'B. Vai trò, lịch chạy và chi phí của tự động hoá.' },
  ],
  yeuCauChung: [{ en: 'Only keywords — no raw API calls. Keep each test focused (≤ 12 rows).', vi: 'Chỉ dùng từ khoá — không gọi API trực tiếp. Mỗi test tập trung (≤ 12 dòng).' }],
  cayThuMuc: `answers/
├── keyword-tests.js   ← const KEYWORD_TESTS = [ { id, description, rows: [ [keyword, ...args] ] } ]
├── automation.js      ← const AUTOMATION = { approach, testsWrittenBy, keywordsMaintainedBy, runs, mainCost }
lib/
└── keywords.js        ← keyword library (read-only)`,
  moHinh: {
    ten: 'AUTOMATION — allowed values',
    truong: [
      ['approach', 'string', { en: 'Capture/replay · Data-driven · Keyword-driven · Model-based', vi: 'Capture/replay · Data-driven · Keyword-driven · Model-based' }],
      ['testsWrittenBy · keywordsMaintainedBy', 'string', { en: 'Testers, without programming · Automation engineers · End users', vi: 'Testers, without programming · Automation engineers · End users' }],
      ['runs', 'string', { en: 'On every push, as a merge gate · Once before each release · Only when someone remembers', vi: 'On every push, as a merge gate · Once before each release · Only when someone remembers' }],
      ['mainCost', 'string', { en: 'Building and maintaining the keyword library · Buying more testers · Writing the requirements', vi: 'Building and maintaining the keyword library · Buying more testers · Writing the requirements' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1 A valid keyword suite', vi: 'A1 Bộ từ khoá hợp lệ' }, diem: 3, yeuCau: [{ en: 'Known keywords, ≥ 5 different, ≥ 6 tests passing on LabBook, coverage of promotion, closed lab and locked login.', vi: 'Từ khoá có thật, ≥ 5 loại, ≥ 6 test đạt trên LabBook, phủ nâng hạng, phòng đóng, đăng nhập bị khoá.' }], hook: ['keyword-driven testing'] },
    { ten: { en: 'A2 Regression power', vi: 'A2 Sức bắt hồi quy' }, diem: 5, yeuCau: [{ en: 'Catch the faulty builds (6 listed, 2 hidden).', vi: 'Bắt các bản build lỗi (6 công khai, 2 ẩn).' }], hook: ['regression testing'] },
    { ten: { en: 'B. Automation set-up', vi: 'B. Tổ chức tự động hoá' }, diem: 2, yeuCau: [{ en: 'Five values.', vi: 'Năm giá trị.' }], hook: ['test automation'] },
  ],
  idBatBuoc: [['KEYWORD_TESTS', 'answers/keyword-tests.js'], ['AUTOMATION', 'answers/automation.js']],
  truDiem: [
    { en: 'A promotion test with one waiting student — first-come-first-served and last-come-first-served look the same.', vi: 'Test nâng hạng chỉ một người chờ — FIFO và LIFO trông như nhau.' },
    { en: 'Checking only HTTP answers — e-mail and database defects stay invisible; use CheckMail and CheckBooking.', vi: 'Chỉ kiểm câu trả lời HTTP — lỗi thư và CSDL không thấy được; dùng CheckMail và CheckBooking.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 8 — Talking about test automation',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> “Do you know automation?” is asked in almost every QA interview. These questions separate people who ran a course demo from people who maintained a suite.</p>', vi: '<p><b>Góc phỏng vấn.</b> “Bạn biết tự động hoá không?” được hỏi ở gần như mọi buổi phỏng vấn QA. Các câu này tách người chỉ chạy demo khỏi người đã bảo trì một bộ test.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“Which tests would you NOT automate?”', '“Test nào bạn KHÔNG tự động hoá?”'), luaChon: lc(['a', '“None — automate everything.”'], ['b', '“Tests run once, usability and exploratory testing, and features still changing every day — automation pays off for stable, frequently repeated checks.”'], ['c', '“Unit tests.”'], ['d', '“Regression tests.”']), dapAn: ['b'], giaiThich: giai('Business case: break-even needs many runs.', 'Luận chứng: hoà vốn cần chạy nhiều lần.') },
    { ma: 'q2', de: hai('“Your UI suite fails randomly. What do you do?”', '“Bộ UI test của bạn trượt ngẫu nhiên. Bạn làm gì?”'), luaChon: lc(['a', '“Re-run until green.”'], ['b', '“Find the flaky tests from the history, quarantine them, fix the waits and test-data isolation, and move checks down the pyramid to API level where possible.”'], ['c', '“Delete the suite.”'], ['d', '“Add sleeps.”']), dapAn: ['b'], giaiThich: giai('Trust in CI is the asset to protect.', 'Niềm tin vào CI là tài sản phải giữ.') },
    { ma: 'q3', de: hai('“Explain data-driven vs keyword-driven.”', '“Giải thích data-driven và keyword-driven.”'), luaChon: lc(['a', '“They are the same.”'], ['b', '“Data-driven keeps one script and varies the data rows; keyword-driven lets testers compose new steps from action words implemented by engineers — in LabBook, Book / Cancel / CheckMail.”'], ['c', '“Keyword-driven is recording.”'], ['d', '“Data-driven needs no data.”']), dapAn: ['b'], giaiThich: giai('With an example from your own framework.', 'Kèm ví dụ từ framework của chính mình.') },
    { ma: 'q4', de: hai('“How do you know your automated suite is good?”', '“Làm sao biết bộ test tự động của bạn tốt?”'), luaChon: lc(['a', '“It is green.”'], ['b', '“It is fast and stable, and it catches real defects — I checked it with seeded faults: each faulty build of LabBook was detected by at least one test.”'], ['c', '“It has many tests.”'], ['d', '“The tool says so.”']), dapAn: ['b'], giaiThich: giai('Mutation / fault seeding measures a suite’s power.', 'Gieo lỗi đo sức bắt của bộ test.') },
    { ma: 'q5', de: hai('“Which programming do you need as an automation tester?”', '“Tester tự động hoá cần lập trình đến đâu?”'), luaChon: lc(['a', '“None.”'], ['b', '“Enough to write clean, maintainable test code — page objects or keywords, data set-up, assertions — and to read the application’s code and logs.”'], ['c', '“Only SQL.”'], ['d', '“Only recording.”']), dapAn: ['b'], giaiThich: giai('Test code is code: it needs design and maintenance.', 'Mã test cũng là mã: cần thiết kế và bảo trì.') },
  ],
  goiY: ['Trả lời bằng cái giá và lợi ích, không bằng khẩu hiệu.', 'Nhắc tới ví dụ LabBook.'],
  loiHayGap: ['“Tự động hoá hết”.', 'Chữa test chập chờn bằng chạy lại cho tới khi xanh.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'fault seeding', vi: 'gieo lỗi để đo bộ test' }],
  khaiNiem: ['interview', 'test automation'],
});

const GIAI_AUTO = "const AUTOMATION = {\n  approach: 'Keyword-driven',\n  testsWrittenBy: 'Testers, without programming',\n  keywordsMaintainedBy: 'Automation engineers',\n  runs: 'On every push, as a merge gate',\n  mainCost: 'Building and maintaining the keyword library',\n};\n";
const ktLit = (L) => `const KEYWORD_TESTS = [\n${L.map((t) => `  {\n    id: '${t.id}',\n    description: ${JSON.stringify(t.description)},\n    rows: [\n${t.rows.map((r) => `      ${JSON.stringify(r).replace(/"/g, "'")},`).join('\n')}\n    ],\n  },`).join('\n')}\n];\n`;

export default doiDau({
  slug: 'swt301-8-project-labbook-keyword-regression',
  ten: 'LabBook Project 8 — Automate the Regression Suite with Keywords',
  moTaModule: 'Dự án LabBook — mốc chương 8: viết bộ regression hướng từ khoá (Book, Cancel, SetLab, CheckBooking, CheckMail, Login, Lock) chạy trên LabBook và 8 bản build lỗi (FIFO, thư nâng hạng, chỗ PENDING, phòng đóng/mở lại, bộ đếm đăng nhập…), mô tả tổ chức tự động hoá; kèm góc phỏng vấn 8.',
  khoa: KHOA,
  baiHoc: 'swt301-tools-benefits-risks',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 8 — Automate the Regression Suite with Keywords',
      doKho: 'HARD', phut: 80, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: "['CheckMail', 3, 'binh@fpt.edu.vn', 'Booking confirmed', 'BK0002']", output: 'passes on LabBook · fails on the build that forgets the promotion e-mail', explanation: 'A keyword row that looks inside the mail server.|||Một dòng từ khoá nhìn vào máy chủ thư.' }],
      khaiNiem: ['keyword-driven testing', 'regression testing', 'test automation'],
      tienQuyet: ['SWT301 chapter 8', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'automation'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'keyword library', vi: 'thư viện từ khoá' }, { en: 'merge gate', vi: 'cổng chặn trước khi gộp mã' }],
      goiY: [
        'Nâng hạng FIFO: LAB02 có 1 chỗ ⇒ một CONFIRMED + HAI PENDING, huỷ người đầu, kiểm BK0002 CONFIRMED và BK0003 vẫn PENDING.',
        'Thư: đếm thứ tự trong hộp thư — mỗi lần đặt chỗ gửi một thư, mỗi lần nâng hạng thêm một thư.',
        'Bộ đếm đăng nhập: sai, sai, đúng, sai, đúng ⇒ lần cuối phải 200.',
        'Đóng phòng: kiểm CẢ booking PENDING trong CSDL.',
      ],
      loiHayGap: ['Gọi API trực tiếp thay vì dùng từ khoá.', 'Đánh số thư sai vị trí trong hộp thư.', 'Thiếu test cho phòng mở lại.'],
      moTaNgan: 'Mốc 8 dự án LabBook: regression hướng từ khoá.',
      giaiThich: {
        en: '<p>Seven short keyword tests cover promotion (FIFO, database and e-mail), seat counting with PENDING bookings, closing and re-opening labs, cascade cancellation, the login failure counter, the weekly limit after a cancellation and locking. Each faulty build breaks at least one of them; testers could write all seven without writing code — the keyword library is where the engineering effort (and the maintenance cost) lives.</p>',
        vi: '<p>Bảy test từ khoá ngắn phủ nâng hạng (FIFO, CSDL và thư), đếm chỗ khi có PENDING, đóng và mở lại phòng, huỷ lan truyền, bộ đếm đăng nhập, giới hạn tuần sau khi huỷ và khoá tài khoản. Mỗi bản lỗi làm hỏng ít nhất một test; tester viết được cả bảy mà không cần lập trình — công kỹ thuật (và chi phí bảo trì) nằm ở thư viện từ khoá.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/keyword-tests.js', 'lib/keywords.js', 'answers/automation.js'], kiem: KIEM },
      khoiDau: {
        'answers/keyword-tests.js': `// Keywords: Book, Cancel, SetLab, CheckBooking, CheckMail, Login, Lock, Unlock — see lib/keywords.js.\n${ktLit([KT[2]].map((t) => ({ ...t, rows: t.rows.slice(0, 2) })))}`,
        'lib/keywords.js': LIB,
        'answers/automation.js': "const AUTOMATION = { approach: '', testsWrittenBy: '', keywordsMaintainedBy: '', runs: '', mainCost: '' };\n",
      },
      loiGiai: {
        'answers/keyword-tests.js': `// LabBook regression suite — keyword-driven.\n${ktLit(KT)}`,
        'lib/keywords.js': LIB,
        'answers/automation.js': GIAI_AUTO,
      },
      thamKhao: 'https://robotframework.org/',
      boYeu: [
        { ten: 'nâng hạng chỉ một người chờ, không kiểm thư', tep: { 'answers/keyword-tests.js': ktLit([{ ...KT[0], rows: KT[0].rows.filter((r) => !(r[0] === 'Book' && r[1] === 'student3') && r[0] !== 'CheckMail' && !(r[0] === 'CheckBooking' && r[1] === 'BK0003')) }, ...KT.slice(1)]) }, phaiTruot: ['Detects faulty build S7', 'Detects faulty build I4'] },
        { ten: 'không mở lại phòng', tep: { 'answers/keyword-tests.js': ktLit(KT.map((t) => (t.id === 'KT-03' ? { ...t, rows: t.rows.slice(0, 2) } : t))) }, phaiTruot: ['Detects faulty build S8'] },
      ],
    },
    PHONG_VAN,
  ],
});
