/**
 * SWT301 · DỰ ÁN LABBOOK — MỐC CHƯƠNG 6: phiên exploratory (session-based) trên bản beta LabBook 1.3 có lỗi chưa ai biết —
 * báo mỗi lỗi bằng một ca tái hiện chạy thật, nộp phiếu phiên cho ba charter; kèm Góc phỏng vấn 6.
 */
import { doiDau, KHOA, hai, giai, lc, jsLit, NOP_BAI } from './_chung.mjs';
import { tinhDe, kiemTuy } from './_de.mjs';
import { kiemKichBan, LABBOOK_API } from './_labbook.mjs';

const b = (as, call, body, expect) => ({ as, call, ...(body !== undefined ? { body } : {}), ...(expect !== undefined ? { expect } : {}) });
const book = (as, labCode, date, startHour, duration, expect) => b(as, 'POST /api/bookings', { labCode, date, startHour, duration }, expect);
const login = (email, password, expect) => b('guest', 'POST /api/auth/login', { email, password }, expect);
const ca = (id, charter, description, steps) => ({ id, charter, description, precondition: 'Seed data; clock Mon 2026-11-02 08:00; build 1.3-beta', steps });

const GIAI = [
  ca('BUG-A1', 'A', 'A student can close a lab: PATCH /api/labs/:code must be refused for the STUDENT role', [
    b('student1', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 403, body: { error: 'FORBIDDEN' } }),
    b('guest', 'GET /api/labs', undefined, { status: 200, body: [{ code: 'LAB01', status: 'OPEN' }] }),
  ]),
  ca('BUG-A2', 'A', 'GET /api/bookings/me shows other students’ bookings', [
    book('student1', 'LAB01', '2026-11-04', 9, 1, { status: 201 }),
    b('student2', 'GET /api/bookings/me', undefined, { status: 200, body: { length: 0 } }),
  ]),
  ca('BUG-A3', 'A', 'A token issued before the admin locked the account keeps working', [
    b('student1', 'GET /api/bookings/me', undefined, { status: 200 }),
    b('admin', 'POST /api/admin/users/an@fpt.edu.vn/lock', undefined, { status: 200, body: { locked: true } }),
    b('student1', 'GET /api/bookings/me', undefined, { status: 401, body: { error: 'UNAUTHENTICATED' } }),
  ]),
  ca('NOTE-A4', 'A', 'Explored: a manager may close a lab (works as specified)', [
    b('manager', 'PATCH /api/labs/LAB02', { status: 'CLOSED' }, { status: 200, body: { status: 'CLOSED' } }),
  ]),
  ca('BUG-B1', 'B', 'A lab re-opened by the manager still refuses bookings', [
    b('manager', 'PATCH /api/labs/LAB03', { status: 'OPEN' }, { status: 200, body: { status: 'OPEN' } }),
    book('student1', 'LAB03', '2026-11-04', 9, 1, { status: 201, body: { status: 'CONFIRMED' } }),
  ]),
  ca('BUG-B2', 'B', 'A closed lab accepts new bookings', [
    book('student1', 'LAB03', '2026-11-04', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } }),
    b('manager', 'PATCH /api/labs/LAB01', { status: 'CLOSED' }, { status: 200 }),
    book('student2', 'LAB01', '2026-11-05', 9, 1, { status: 409, body: { error: 'LAB_CLOSED' } }),
  ]),
  ca('BUG-C1', 'C', 'A successful login does not reset the failure counter: wrong, wrong, right, wrong, right locks the account', [
    login('binh@fpt.edu.vn', 'wrong-1', { status: 401, body: { error: 'AUTH_INVALID' } }),
    login('binh@fpt.edu.vn', 'wrong-2', { status: 401 }),
    login('binh@fpt.edu.vn', 'Binh@123', { status: 200 }),
    login('binh@fpt.edu.vn', 'wrong-3', { status: 401 }),
    login('binh@fpt.edu.vn', 'Binh@123', { status: 200 }),
  ]),
  ca('NOTE-C2', 'C', 'Explored: the third consecutive wrong password locks the account (works as specified)', [
    login('chi@fpt.edu.vn', 'x', { status: 401 }), login('chi@fpt.edu.vn', 'y', { status: 401 }), login('chi@fpt.edu.vn', 'z', { status: 401 }),
    login('chi@fpt.edu.vn', 'Chi@1234', { status: 423, body: { error: 'ACCOUNT_LOCKED' } }),
  ]),
];

const SESSIONS = [
  { charter: 'A', mission: 'Explore access control: roles, ownership and locked accounts', minutes: 90, setup: 10, testing: 65, bugInvestigation: 25, bugs: ['BUG-A1', 'BUG-A2', 'BUG-A3'], notes: 'Tried every protected endpoint with each role; reused tokens after lock and unlock.' },
  { charter: 'B', mission: 'Explore closing and re-opening labs', minutes: 60, setup: 15, testing: 60, bugInvestigation: 25, bugs: ['BUG-B1', 'BUG-B2'], notes: 'Closed and re-opened LAB01 and LAB03, booked before and after each change.' },
  { charter: 'C', mission: 'Explore login failures and account locking', minutes: 60, setup: 10, testing: 75, bugInvestigation: 15, bugs: ['BUG-C1'], notes: 'Sequences of wrong and right passwords; lock, unlock, retry.' },
];

const LOI = [
  { ma: 'I3', nhom: 'f2', moTa: { en: 'a defect in the charter-A area (access control) #1', vi: 'một lỗi trong vùng charter A (phân quyền) #1' } },
  { ma: 'I7', nhom: 'f2', moTa: { en: 'a defect in the charter-A area (access control) #2', vi: 'một lỗi trong vùng charter A (phân quyền) #2' } },
  { ma: 'S1', nhom: 'f2', an: true, moTa: { en: '', vi: '' } },
  { ma: 'S8', nhom: 'f3', moTa: { en: 'a defect in the charter-B area (closing / re-opening labs)', vi: 'một lỗi trong vùng charter B (đóng / mở lại phòng)' } },
  { ma: 'S4', nhom: 'f3', an: true, moTa: { en: '', vi: '' } },
  { ma: 'I9', nhom: 'f3', moTa: { en: 'a defect in the charter-C area (login failures)', vi: 'một lỗi trong vùng charter C (đăng nhập sai)' } },
];
const CAN = [
  { ma: 'PATCH /api/labs/:lab 403 FORBIDDEN', ten: 'a role that must not change labs is refused', tenVi: 'vai trò không được đổi phòng bị từ chối' },
  { ma: 'POST /api/auth/login 423 ACCOUNT_LOCKED', ten: 'a locked account cannot log in', tenVi: 'tài khoản bị khoá không đăng nhập được' },
  { ma: 'POST /api/bookings 409 LAB_CLOSED', ten: 'booking a closed lab', tenVi: 'đặt phòng đã đóng' },
];

const kb = kiemKichBan({ bien: 'TEST_CASES', minCa: 6, can: CAN, nhomCauTruc: 'f1', nhomPhu: 'f4', dotBien: LOI, nhomDotBien: 'f2' });
const soDau = kb.length - LOI.length;
const KIEM = [
  ...kb.map((k, i) => (i >= soDau ? { ...k, nhom: LOI[i - soDau].nhom } : k)),
  kiemTuy({ en: 'Every case names its charter (A, B or C) and every charter has at least one case', vi: 'Mỗi ca ghi charter (A, B hoặc C) và charter nào cũng có ít nhất một ca' }, () => {
    if (typeof TEST_CASES === 'undefined' || !Array.isArray(TEST_CASES)) return 'TEST_CASES is missing';
    const c = TEST_CASES.map((x) => String(x && x.charter).toUpperCase());
    if (c.some((x) => ['A', 'B', 'C'].indexOf(x) < 0)) return 'charter must be A, B or C';
    const thieu = ['A', 'B', 'C'].filter((x) => c.indexOf(x) < 0);
    return thieu.length ? 'no case for charter ' + thieu.join(', ') : 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'SESSIONS: one session sheet per charter, time-box 60–120 min, setup + testing + bugInvestigation = 100', vi: 'SESSIONS: mỗi charter một phiếu phiên, khung 60–120 phút, setup + testing + bugInvestigation = 100' }, () => {
    if (typeof SESSIONS === 'undefined' || !Array.isArray(SESSIONS)) return 'SESSIONS is missing';
    const c = SESSIONS.map((s) => String(s && s.charter).toUpperCase()).sort().join(',');
    if (c !== 'A,B,C') return 'exactly one session per charter A, B, C — found ' + c;
    for (const s of SESSIONS) {
      if (!(s.minutes >= 60 && s.minutes <= 120)) return 'charter ' + s.charter + ': minutes must be inside the 60–120 time-box';
      if (s.setup + s.testing + s.bugInvestigation !== 100) return 'charter ' + s.charter + ': the three percentages must add up to 100';
      if (!String(s.mission || '').trim()) return 'charter ' + s.charter + ': write the mission';
    }
    return 'OK';
  }, { nhom: 'f1' }),
  kiemTuy({ en: 'SESSIONS: every bug listed is a test case of the same charter, at least 4 bugs in total', vi: 'SESSIONS: mỗi bug ghi trong phiếu là một ca cùng charter, tổng ít nhất 4 bug' }, () => {
    const T = typeof TEST_CASES !== 'undefined' && Array.isArray(TEST_CASES) ? TEST_CASES : [];
    const S = typeof SESSIONS !== 'undefined' && Array.isArray(SESSIONS) ? SESSIONS : [];
    let n = 0;
    for (const s of S) for (const id of s.bugs || []) {
      n++;
      const c = T.find((x) => x.id === id);
      if (!c) return 'bug ' + id + ' is not a test case id';
      if (String(c.charter).toUpperCase() !== String(s.charter).toUpperCase()) return 'bug ' + id + ' belongs to another charter';
    }
    return n >= 4 ? 'OK' : 'only ' + n + ' bug(s) reported';
  }, { nhom: 'f1' }),
];

const BAN_IN = {
  tieuDe: 'LabBook Project · Milestone 6 — Exploratory Sessions on the 1.3 Beta',
  phu: { en: 'Running project · chapter 6 · session-based exploratory testing with executable bug reports · 10 marks', vi: 'Dự án xuyên suốt · chương 6 · exploratory theo phiên với báo lỗi chạy được · 10 điểm' },
  moTa: {
    en: `<p>The <b>1.3 beta</b> of LabBook was built in a hurry: no new specification, no new test cases, and the demo is on Friday. The test lead plans three time-boxed <b>exploratory sessions</b>:</p>
<ul><li><b>Charter A</b> — explore access control: roles, ownership of bookings and locked accounts.</li>
<li><b>Charter B</b> — explore closing and re-opening labs and booking around those changes.</li>
<li><b>Charter C</b> — explore login failures and account locking.</li></ul>
<p>Nobody knows how many defects the beta has. The specification you test against is the API below — anything that behaves differently is a bug. Report <b>each bug as an executable test case</b> that passes on a correct LabBook and fails on the beta; the grader runs your cases against the beta’s defects. Also hand in a <b>session sheet</b> for each charter.</p>${LABBOOK_API.en}`,
    vi: `<p>Bản <b>1.3 beta</b> của LabBook làm vội: không có đặc tả mới, không có test case mới, thứ Sáu demo. Trưởng nhóm test lên kế hoạch ba <b>phiên exploratory</b> có khung giờ: <b>Charter A</b> — phân quyền: vai trò, quyền sở hữu booking, tài khoản bị khoá · <b>Charter B</b> — đóng và mở lại phòng, đặt chỗ quanh các thay đổi đó · <b>Charter C</b> — đăng nhập sai và khoá tài khoản.</p>
<p>Không ai biết bản beta có bao nhiêu lỗi. Đặc tả để so là API dưới đây — khác đi là lỗi. Báo <b>mỗi lỗi bằng một ca test chạy được</b>: đạt trên LabBook đúng và trượt trên bản beta; máy chấm chạy các ca của bạn trên các lỗi của bản beta. Nộp thêm <b>phiếu phiên</b> cho mỗi charter.</p>${LABBOOK_API.vi}`,
  },
  chucNangChinh: [
    { en: 'A. Executable bug reports for each charter (plus notes of what works).', vi: 'A. Báo lỗi chạy được cho từng charter (kèm ghi chú phần chạy đúng).' },
    { en: 'B. Session sheets: mission, time-box, time split, bugs found.', vi: 'B. Phiếu phiên: nhiệm vụ, khung giờ, phân bổ thời gian, lỗi tìm được.' },
  ],
  yeuCauChung: [{ en: 'Every case must PASS on the correct system. A beta defect counts as found when one of your passing cases fails on it.', vi: 'Mọi ca phải ĐẠT trên hệ thống đúng. Một lỗi của beta được tính là tìm ra khi một ca đạt của bạn trượt trên nó.' }],
  cayThuMuc: `answers/
├── bug-reports.js   ← const TEST_CASES = [ { id, charter: 'A'|'B'|'C', description, precondition, steps } ]
└── sessions.js      ← const SESSIONS = [ { charter, mission, minutes, setup, testing, bugInvestigation, bugs: [ids], notes } ]`,
  moHinh: {
    ten: 'Session sheet',
    truong: [
      ['charter · mission', 'string', { en: 'A, B or C · what this session explores', vi: 'A, B hoặc C · phiên này khám phá gì' }],
      ['minutes', 'number', { en: 'time-box 60–120', vi: 'khung giờ 60–120' }],
      ['setup · testing · bugInvestigation', 'number (%)', { en: 'add up to 100', vi: 'cộng lại 100' }],
      ['bugs', 'string[]', { en: 'ids of your bug-report cases of this charter', vi: 'mã các ca báo lỗi thuộc charter này' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Structure and session sheets', vi: 'Cấu trúc và phiếu phiên' }, diem: 3, yeuCau: [{ en: 'Valid cases that pass on the correct system; three session sheets; bugs linked to cases.', vi: 'Ca hợp lệ, đạt trên hệ thống đúng; ba phiếu phiên; bug nối với ca.' }], hook: ['session-based testing'] },
    { ten: { en: 'Charter A bugs', vi: 'Lỗi charter A' }, diem: 3, yeuCau: [{ en: 'Find the access-control defects (2 visible, 1 hidden).', vi: 'Tìm các lỗi phân quyền (2 công khai, 1 ẩn).' }], hook: ['exploratory testing'] },
    { ten: { en: 'Charter B and C bugs', vi: 'Lỗi charter B và C' }, diem: 3, yeuCau: [{ en: 'Find the lab and login defects (2 visible, 1 hidden).', vi: 'Tìm các lỗi phòng và đăng nhập (2 công khai, 1 ẩn).' }], hook: ['exploratory testing'] },
    { ten: { en: 'Coverage of the charters', vi: 'Độ phủ các charter' }, diem: 1, yeuCau: [{ en: 'The refused role, the locked login and the closed lab are exercised.', vi: 'Có chạy qua vai trò bị từ chối, đăng nhập khi bị khoá và phòng đóng.' }], hook: ['charter'] },
  ],
  idBatBuoc: [['TEST_CASES', 'answers/bug-reports.js'], ['SESSIONS', 'answers/sessions.js']],
  truDiem: [
    { en: 'A bug report whose expected result is the BETA behaviour — it fails on the correct system and proves nothing.', vi: 'Báo lỗi lấy kết quả mong đợi theo hành vi của BETA — nó trượt trên hệ thống đúng và không chứng minh gì.' },
    { en: 'Checking a list endpoint with an empty expected array [] — it matches anything; check its length.', vi: 'Kiểm endpoint danh sách bằng mảng rỗng [] — nó khớp mọi thứ; hãy kiểm length.' },
  ],
  nopBai: NOP_BAI,
};

const PHONG_VAN = tinhDe({
  tieuDe: 'LabBook Interview corner 6 — Talking about exploratory testing',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p><b>Interview corner.</b> Many teams test mostly by exploring. Interviewers ask about it to see whether you explore with a plan — or just click around.</p>', vi: '<p><b>Góc phỏng vấn.</b> Nhiều nhóm test chủ yếu bằng khám phá. Người phỏng vấn hỏi để xem bạn khám phá có kế hoạch — hay chỉ bấm lung tung.</p>' },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('“Is exploratory testing the same as ad hoc testing?”', '“Exploratory testing có giống ad hoc testing không?”'), luaChon: lc(['a', '“Yes.”'], ['b', '“No. Exploratory testing has a charter, a time-box and notes; I design the next test from what I just learned, and I report what I covered. In LabBook I ran three 60–90 minute sessions with session sheets.”'], ['c', '“Exploratory testing needs no preparation.”'], ['d', '“It is only for beginners.”']), dapAn: ['b'], giaiThich: giai('Structure + learning loop + evidence.', 'Cấu trúc + vòng học + bằng chứng.') },
    { ma: 'q2', de: hai('“How do you write a charter?”', '“Bạn viết charter thế nào?”'), luaChon: lc(['a', '“Test everything.”'], ['b', '“Explore <target> with <resources/techniques> to discover <information> — e.g. explore lab closing with three students and the manager to discover what happens to existing bookings.”'], ['c', '“A list of 50 steps.”'], ['d', '“I do not write charters.”']), dapAn: ['b'], giaiThich: giai('A popular charter template: target, resources, information.', 'Mẫu charter phổ biến: mục tiêu, nguồn lực, thông tin cần tìm.') },
    { ma: 'q3', de: hai('“You found a bug while exploring. How do you report it?”', '“Bạn tìm thấy bug khi khám phá. Bạn báo thế nào?”'), luaChon: lc(['a', '“I tell the developer in the corridor.”'], ['b', '“I reproduce it, then write minimal steps from a known state, expected vs actual, environment and build — ideally as an automated check that fails until it is fixed.”'], ['c', '“I fix it myself.”'], ['d', '“I wait until the end of the project.”']), dapAn: ['b'], giaiThich: giai('Reproducible, minimal, factual — executable if possible.', 'Tái hiện được, tối giản, đúng sự thật — chạy được nếu có thể.') },
    { ma: 'q4', de: hai('“When would you NOT rely on exploratory testing alone?”', '“Khi nào bạn KHÔNG chỉ dựa vào exploratory testing?”'), luaChon: lc(['a', '“Never — it is always enough.”'], ['b', '“When regulators require traceable, repeatable evidence or coverage figures — e.g. payments or medical software. Then I combine it with formal techniques.”'], ['c', '“When there is no specification.”'], ['d', '“When time is short.”']), dapAn: ['b'], giaiThich: giai('Coverage of experience-based testing is hard to measure.', 'Độ phủ của test dựa kinh nghiệm khó đo.') },
    { ma: 'q5', de: hai('“What did your last debrief reveal?”', '“Buổi debrief gần nhất của bạn cho thấy gì?”'), luaChon: lc(['a', '“Nothing special.”'], ['b', '“That 30% of my time went to setup because the test data kept resetting — we added a seed script and the next sessions found twice as many bugs.”'], ['c', '“I do not do debriefs.”'], ['d', '“That I worked hard.”']), dapAn: ['b'], giaiThich: giai('Metrics from session sheets lead to process improvement.', 'Số liệu phiếu phiên dẫn tới cải tiến quy trình.') },
  ],
  goiY: ['Nhắc charter, khung giờ, phiếu phiên, debrief.', 'Cho một ví dụ cụ thể có số liệu.'],
  loiHayGap: ['Đồng nhất exploratory với “bấm lung tung”.', 'Nói exploratory thay thế được mọi kỹ thuật khác.'],
  giaiThich: '<p>All answers: b.</p>',
  thuatNgu: [{ en: 'charter template', vi: 'mẫu charter: explore … with … to discover …' }],
  khaiNiem: ['interview', 'exploratory testing'],
});

export default doiDau({
  slug: 'swt301-6-project-labbook-exploratory',
  ten: 'LabBook Project 6 — Exploratory Sessions on the 1.3 Beta',
  moTaModule: 'Dự án LabBook — mốc chương 6: ba phiên exploratory có charter trên bản beta có lỗi chưa biết (phân quyền, đóng/mở phòng, đăng nhập sai); báo mỗi lỗi bằng ca tái hiện chạy thật, nộp phiếu phiên; kèm góc phỏng vấn 6.',
  khoa: KHOA,
  baiHoc: 'swt301-experience-based',
  de: [
    {
      dangBai: 'project',
      tieuDe: 'LabBook Milestone 6 — Exploratory Sessions on the 1.3 Beta',
      doKho: 'HARD', phut: 90, diem: 100, ngonNgu: 'javascript',
      viDu: [{ input: "{ as: 'student1', call: 'PATCH /api/labs/LAB01', body: { status: 'CLOSED' }, expect: { status: 403, body: { error: 'FORBIDDEN' } } }", output: 'passes on the correct system · fails on the beta if students can close labs', explanation: 'An executable bug report from charter A.|||Báo lỗi chạy được từ charter A.' }],
      khaiNiem: ['exploratory testing', 'session-based testing', 'defect report'],
      tienQuyet: ['SWT301 chapter 6', 'LabBook API'],
      the: ['swt301', 'project', 'labbook', 'exploratory'],
      banIn: BAN_IN,
      thuatNgu: [{ en: 'beta build', vi: 'bản thử nghiệm' }, { en: 'session sheet', vi: 'phiếu phiên' }, { en: 'reproducible', vi: 'tái hiện được' }],
      goiY: [
        'Charter A: thử mọi endpoint cần quyền với từng vai trò; xem danh sách của người khác; khoá tài khoản rồi dùng lại token cũ.',
        'Charter B: đóng rồi mở lại phòng, đặt chỗ trước và sau mỗi lần đổi; thử phòng LAB03 vốn đóng.',
        'Charter C: chuỗi sai/đúng mật khẩu — bộ đếm có được đặt lại sau lần đúng không?',
        'Kiểm danh sách rỗng bằng body: { length: 0 }.',
      ],
      loiHayGap: ['Lấy hành vi của beta làm kết quả mong đợi.', 'Ghi bug vào phiếu phiên nhưng không có ca tái hiện tương ứng.', 'Phiếu phiên có tổng % khác 100.'],
      moTaNgan: 'Mốc 6 dự án LabBook: exploratory theo phiên trên bản beta.',
      giaiThich: {
        en: '<p>The beta hides six defects: a student may change labs (I3), /me lists everyone’s bookings (I7), old tokens survive a lock (S1), a re-opened lab still refuses bookings (S8), a closed lab accepts bookings (S4), a successful login does not reset the failure counter (I9). The reference session sheets record mission, time-box, time split and the bug ids — the evidence that makes exploratory testing accountable.</p>',
        vi: '<p>Bản beta giấu sáu lỗi: sinh viên đổi được phòng (I3), /me liệt kê booking của mọi người (I7), token cũ sống sau khi khoá (S1), phòng mở lại vẫn từ chối (S8), phòng đóng vẫn nhận đặt (S4), đăng nhập đúng không đặt lại bộ đếm (I9). Phiếu phiên mẫu ghi nhiệm vụ, khung giờ, phân bổ thời gian và mã bug — bằng chứng làm exploratory có trách nhiệm.</p>',
      },
      loaiKiem: 'js',
      tests: { loai: 'js', phienBan: 1, tepNap: ['answers/bug-reports.js', 'answers/sessions.js'], kiem: KIEM },
      khoiDau: {
        'answers/bug-reports.js': `// One executable case per bug (expected = what the API documentation says).\nconst TEST_CASES = [\n${jsLit(GIAI[3], '  ').replace(/^/, '  ')},\n];\n`,
        'answers/sessions.js': "const SESSIONS = [\n  { charter: 'A', mission: 'Explore access control: roles, ownership and locked accounts', minutes: 90, setup: 0, testing: 0, bugInvestigation: 0, bugs: [], notes: '' },\n];\n",
      },
      loiGiai: {
        'answers/bug-reports.js': `// LabBook 1.3 beta — bugs found in three exploratory sessions, each as an executable case.\nconst TEST_CASES = ${jsLit(GIAI)};\n`,
        'answers/sessions.js': `const SESSIONS = ${jsLit(SESSIONS)};\n`,
      },
      thamKhao: 'https://www.satisfice.com/download/session-based-test-management',
      boYeu: [
        { ten: 'bỏ charter C', tep: { 'answers/bug-reports.js': `const TEST_CASES = ${jsLit(GIAI.filter((c) => c.charter !== 'C'))};\n`, 'answers/sessions.js': `const SESSIONS = ${jsLit(SESSIONS.map((s) => (s.charter === 'C' ? { ...s, bugs: [] } : s)))};\n` }, phaiTruot: ['Detects faulty build I9'] },
        { ten: 'danh sách rỗng bằng []', tep: { 'answers/bug-reports.js': `const TEST_CASES = ${jsLit(GIAI)};\n`.replace("body: { length: 0 }", 'body: []') }, phaiTruot: ['Detects faulty build I7'] },
      ],
    },
    PHONG_VAN,
  ],
});
