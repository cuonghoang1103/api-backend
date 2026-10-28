/**
 * SWT301 · LAB CHƯƠNG 8 — Công cụ & tự động hoá: A. unit test có mock (kiểu Mockito) cho ReminderService, chấm bằng mutant ·
 * B. tầng kim tự tháp + stage CI · C. chọn loại công cụ · D. luận chứng chi phí tự động hoá.
 */
import { doiDau, KHOA, kiemKhoa, preMa, NOP_BAI } from './_chung.mjs';
import { dotBienDe, TN_TEST } from './_de.mjs';

const DUNG = `class ReminderService {
  constructor(repo, mailer, clock) {
    this.repo = repo;
    this.mailer = mailer;
    this.clock = clock;
  }

  // Sends "Reminder: your lab starts tomorrow" for bookings starting 23–25 hours from now.
  sendReminders() {
    const now = this.clock.now();
    const due = this.repo.findStartingBetween(now + 23 * HOUR, now + 25 * HOUR);
    let sent = 0;
    for (const b of due) {
      if (b.status !== 'CONFIRMED' || b.reminded) continue;
      this.mailer.send(b.email, 'Reminder: your lab starts tomorrow', b.code);
      this.repo.markReminded(b.code);
      sent++;
    }
    return sent;
  }
}`;
const SUT = 'const HOUR = 3600000; // one hour in milliseconds\n';
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant: ' + a); return DUNG.replace(a, b); };
const DOT_BIEN = [
  { ma: 'M1', nhom: 'f1', moTa: { en: 'the window is 0–24 hours instead of 23–25', vi: 'cửa sổ 0–24 giờ thay vì 23–25' }, code: doi('now + 23 * HOUR, now + 25 * HOUR', 'now, now + 24 * HOUR') },
  { ma: 'M2', nhom: 'f1', moTa: { en: 'cancelled bookings also get a reminder', vi: 'booking đã huỷ cũng nhận nhắc' }, code: doi("b.status !== 'CONFIRMED' || b.reminded", 'b.reminded') },
  { ma: 'M3', nhom: 'f1', moTa: { en: 'the booking is never marked as reminded', vi: 'không đánh dấu đã nhắc' }, code: doi('      this.repo.markReminded(b.code);\n', '') },
  { ma: 'M4', nhom: 'f1', moTa: { en: 'a booking already reminded is reminded again', vi: 'booking đã nhắc bị nhắc lại' }, code: doi("b.status !== 'CONFIRMED' || b.reminded", "b.status !== 'CONFIRMED'") },
  { ma: 'M5', nhom: 'f1', moTa: { en: 'the reminder carries no booking code', vi: 'thư nhắc không có mã booking' }, code: doi("'Reminder: your lab starts tomorrow', b.code", "'Reminder: your lab starts tomorrow', undefined") },
  { ma: 'M6', nhom: 'f2', an: true, moTa: { en: 'the count returned is the number of bookings found', vi: 'trả số booking tìm thấy thay vì số thư đã gửi' }, code: doi('    return sent;', '    return due.length;') },
  { ma: 'M7', nhom: 'f2', an: true, moTa: { en: 'PENDING bookings get a reminder', vi: 'booking PENDING nhận nhắc' }, code: doi("b.status !== 'CONFIRMED'", "b.status === 'CANCELLED'") },
  { ma: 'M8', nhom: 'f2', an: true, moTa: { en: 'the clock is read for every booking (now drifts)', vi: 'đọc đồng hồ cho từng booking' }, code: doi('const due = this.repo.findStartingBetween(now + 23 * HOUR, now + 25 * HOUR);', 'const due = this.repo.findStartingBetween(this.clock.now() + 23 * HOUR, this.clock.now() + 25 * HOUR);') },
];

const DAU = `// ReminderService — unit tests with mocks (JUnit 5 + Mockito in Java; jest.fn() here).
function deps(bookings) {
  const repo = { findStartingBetween: jest.fn(() => bookings), markReminded: jest.fn() };
  const mailer = { send: jest.fn() };
  const clock = { now: jest.fn(() => 0) };
  return { repo, mailer, clock, svc: new ReminderService(repo, mailer, clock) };
}

test('a confirmed booking tomorrow gets a reminder', () => {
  const d = deps([{ code: 'BK1', email: 'an@fpt.edu.vn', status: 'CONFIRMED', reminded: false }]);
  expect(d.svc.sendReminders()).toBe(1);
});
`;
const GIAI = `// ReminderService — unit tests with mocks.
// Java: @ExtendWith(MockitoExtension.class), @Mock BookingRepository repo, verify(mailer).send(...), verify(repo, never()).markReminded(...)
const NOW = 1000 * HOUR;
function deps(bookings) {
  const repo = { findStartingBetween: jest.fn(() => bookings), markReminded: jest.fn() };
  const mailer = { send: jest.fn() };
  const clock = { now: jest.fn(() => NOW) };
  return { repo, mailer, clock, svc: new ReminderService(repo, mailer, clock) };
}
const bk = (code, status, reminded) => ({ code, email: code.toLowerCase() + '@fpt.edu.vn', status, reminded });

test('asks the repository for bookings starting 23–25 hours from now', () => {
  const d = deps([]);
  d.svc.sendReminders();
  expect(d.repo.findStartingBetween).toHaveBeenCalledWith(NOW + 23 * HOUR, NOW + 25 * HOUR);
});

test('reads the clock once per run', () => {
  const d = deps([bk('BK1', 'CONFIRMED', false), bk('BK2', 'CONFIRMED', false)]);
  d.svc.sendReminders();
  expect(d.clock.now).toHaveBeenCalledTimes(1);
});

test('a confirmed booking gets a reminder with its code and is marked', () => {
  const d = deps([bk('BK1', 'CONFIRMED', false)]);
  expect(d.svc.sendReminders()).toBe(1);
  expect(d.mailer.send).toHaveBeenCalledWith('bk1@fpt.edu.vn', 'Reminder: your lab starts tomorrow', 'BK1');
  expect(d.repo.markReminded).toHaveBeenCalledWith('BK1');
});

test.each([['CANCELLED'], ['PENDING']])('a %s booking gets no reminder', (status) => {
  const d = deps([bk('BK2', status, false)]);
  expect(d.svc.sendReminders()).toBe(0);
  expect(d.mailer.send).not.toHaveBeenCalled();
  expect(d.repo.markReminded).not.toHaveBeenCalled();
});

test('a booking already reminded is not reminded twice', () => {
  const d = deps([bk('BK3', 'CONFIRMED', true)]);
  expect(d.svc.sendReminders()).toBe(0);
  expect(d.mailer.send).not.toHaveBeenCalled();
});

test('the count is the number of reminders actually sent', () => {
  const d = deps([bk('BK1', 'CONFIRMED', false), bk('BK2', 'CANCELLED', false), bk('BK3', 'CONFIRMED', true), bk('BK4', 'CONFIRMED', false)]);
  expect(d.svc.sendReminders()).toBe(2);
  expect(d.mailer.send).toHaveBeenCalledTimes(2);
  expect(d.repo.markReminded).toHaveBeenCalledTimes(2);
});
`;

const TANG = ['Unit / component', 'Integration / API', 'UI / end-to-end'];
const STAGE = ['Every push (pre-merge)', 'Nightly'];
const SUITE = [
  ['S1', 'JUnit tests of ReminderService with mocks (2 s in total)', TANG[0], STAGE[0]],
  ['S2', 'REST Assured tests of the booking API against a test database (4 min)', TANG[1], STAGE[0]],
  ['S3', 'Selenium journeys “book → cancel → promoted” in three browsers (55 min)', TANG[2], STAGE[1]],
  ['S4', 'Jest tests of the WaitList and refund functions (1 s)', TANG[0], STAGE[0]],
];
const LOAI = ['Test management tool', 'Static analysis tool', 'Test data preparation tool', 'Coverage tool', 'Performance testing tool', 'Monitoring tool', 'Continuous integration tool'];
const NHU_CAU = [
  ['N1', 'Know which branches of ReminderService the tests executed', LOAI[3]],
  ['N2', 'Generate 50,000 anonymised bookings for a load test', LOAI[2]],
  ['N3', 'Simulate 300 students booking at 07:00 on Monday', LOAI[4]],
  ['N4', 'Block a merge when new code has a critical code smell', LOAI[1]],
  ['N5', 'Run S1, S2 and S4 automatically on every push', LOAI[6]],
  ['N6', 'Alert the team when the production error rate jumps', LOAI[5]],
];

const goc = dotBienDe({
  tieuDe: 'Lab 8 — Tools and Automation for LabBook Reminders',
  doKho: 'HARD', phut: 80,
  moTa: { en: 'Lab 8', vi: 'Lab 8' },
  viDu: [{ input: "expect(d.repo.markReminded).toHaveBeenCalledWith('BK1')", output: 'kills M3 (never marked → students get the reminder every hour)', explanation: 'Verifying an interaction, like Mockito’s verify().|||Kiểm một tương tác, như verify() của Mockito.' }],
  goiY: [
    'A: tạo mock MỚI trong mỗi test; đồng hồ trả một thời điểm cố định NOW.',
    'A: kiểm cả lời gọi repository (cửa sổ 23–25 giờ), thư gửi (người nhận, tiêu đề, mã) và markReminded.',
    'B: test nhanh chạy mỗi lần push; bộ UI dài chạy ban đêm.',
    'D: hoà vốn = ceil(xây ÷ (tay − tự động − bảo trì)).',
  ],
  loiHayGap: ['Chỉ kiểm số trả về — mutant không đánh dấu đã nhắc vẫn trả 1.', 'Đặt bộ Selenium 55 phút vào cổng mỗi lần push.', 'Quên chi phí bảo trì khi tính hoà vốn.'],
  giaiThich: '<p>A: interaction checks (window, recipient, subject, code, markReminded, never for CANCELLED/PENDING/already reminded, count of sent mails, one clock read). B: S1 unit/push · S2 integration/push · S3 UI/nightly · S4 unit/push. C: coverage · test data · performance · static analysis · CI · monitoring. D: break-even 14 runs (3,000 ÷ 230 = 13.04 → 14); ROI after 50 runs (15,000 − 6,500) ÷ 6,500 = 130.8%; the usual killer is underestimated maintenance.</p>',
  thuatNgu: [...TN_TEST(), { en: 'mock', vi: 'đối tượng giả có kiểm tương tác' }, { en: 'verify', vi: 'kiểm một lời gọi đã xảy ra (Mockito)' }, { en: 'nightly build', vi: 'bản build chạy ban đêm' }],
  ten: ['ReminderService'], dung: DUNG, sut: SUT, minTest: 7,
  dotBien: DOT_BIEN, dauTest: DAU, giaiTest: GIAI,
});

const kiemA = goc.tests.kiem.map((k, i) => ({ ...k, nhom: i < 2 ? 'f1' : DOT_BIEN[i - 2].nhom }));
const KIEM = [
  ...kiemA,
  ...kiemKhoa(SUITE.flatMap(([m, , t, s]) => [
    { moTa: { en: `B — pyramid layer of ${m}`, vi: `B — tầng kim tự tháp của ${m}` }, bieuThuc: `(PIPELINE.${m} || {}).layer`, chap: [t], nhom: 'f3' },
    { moTa: { en: `B — CI stage of ${m}`, vi: `B — stage CI của ${m}` }, bieuThuc: `(PIPELINE.${m} || {}).stage`, chap: [s], nhom: 'f3' },
  ])),
  ...kiemKhoa(NHU_CAU.map(([m, , v]) => ({ moTa: { en: `C — tool type for ${m}`, vi: `C — loại công cụ cho ${m}` }, bieuThuc: `TOOLS.${m}`, chap: [v], nhom: 'f3' }))),
  ...kiemKhoa([
    { moTa: { en: 'D — break-even (runs)', vi: 'D — hoà vốn (số lần chạy)' }, bieuThuc: 'BUSINESS.breakEven', chap: [14], kieu: 'so', nhom: 'f4' },
    { moTa: { en: 'D — ROI after 50 runs (%)', vi: 'D — ROI sau 50 lần chạy (%)' }, bieuThuc: 'BUSINESS.roi50', chap: [130.8], kieu: 'so', saiSo: 0.06, nhom: 'f4' },
    { moTa: { en: 'D — what most often breaks the business case', vi: 'D — điều thường phá luận chứng nhất' }, bieuThuc: 'BUSINESS.mainRisk', chap: ['Underestimated maintenance effort'], nhom: 'f4' },
  ]),
];

const BAN_IN = {
  tieuDe: 'Lab 8 — Tools and Automation for LabBook Reminders',
  phu: { en: 'Chapter 8 lab · unit tests with mocks (Mockito style), pyramid and CI stages, tool types, automation business case · 10 marks', vi: 'Lab chương 8 · unit test có mock (kiểu Mockito), kim tự tháp và stage CI, loại công cụ, luận chứng tự động hoá · 10 điểm' },
  moTa: {
    en: `<p><b>A. Unit tests with mocks.</b> Every hour a job calls <code>ReminderService.sendReminders()</code>: it asks the repository for bookings starting 23–25 hours from now, e-mails each CONFIRMED booking that was not reminded yet (“Reminder: your lab starts tomorrow”, with the booking code) and marks it as reminded; it returns the number of reminders sent. <code>HOUR</code> is given in <code>lib/sut.js</code>.</p>${preMa(DUNG)}<p>Write <code>tests.js</code> with mocks of the repository, the mailer and the clock (JUnit 5 + Mockito in Java; <code>jest.fn()</code> here). The grader kills 8 faulty versions (5 listed, 3 hidden).</p>
<p><b>B. Pyramid and pipeline.</b> ${SUITE.map(([m, t]) => `<b>${m}</b> ${t}`).join(' · ')}. Give each suite its pyramid layer and its CI stage (the pre-merge gate must stay under 10 minutes).</p>
<p><b>C. Tools.</b> ${NHU_CAU.map(([m, t]) => `<b>${m}</b> ${t}`).join(' · ')}.</p>
<p><b>D. Business case</b> for automating S3: manual run 300 min; scripting 3,000 min once; each automated run 30 min of supervision + 40 min of script maintenance. Compute the break-even number of runs and the ROI after 50 runs (1 decimal), and name the risk that most often breaks such a business case.</p>`,
    vi: `<p><b>A.</b> Mỗi giờ một job gọi <code>ReminderService.sendReminders()</code>: hỏi repository các booking bắt đầu sau 23–25 giờ, gửi thư nhắc cho booking CONFIRMED chưa được nhắc (kèm mã) và đánh dấu đã nhắc; trả số thư đã gửi. Viết <code>tests.js</code> với mock của repository, mailer và clock (Java: JUnit 5 + Mockito). Máy chấm giết 8 phiên bản lỗi (5 công khai, 3 ẩn). <b>B.</b> Tầng kim tự tháp và stage CI cho S1–S4 (cổng trước khi merge phải dưới 10 phút). <b>C.</b> Loại công cụ cho N1–N6. <b>D.</b> Luận chứng tự động hoá S3: chạy tay 300 phút; viết script 3.000 phút một lần; mỗi lần chạy tự động 30 phút giám sát + 40 phút bảo trì script — tính số lần hoà vốn, ROI sau 50 lần (1 chữ số) và rủi ro hay phá luận chứng nhất.</p>`,
  },
  chucNangChinh: [
    { en: 'A. A mock-based unit test suite for ReminderService.', vi: 'A. Bộ unit test dùng mock cho ReminderService.' },
    { en: 'B. Layer and stage of four suites.', vi: 'B. Tầng và stage của bốn bộ test.' },
    { en: 'C. Tool type for six needs.', vi: 'C. Loại công cụ cho sáu nhu cầu.' },
    { en: 'D. Break-even, ROI and the main risk.', vi: 'D. Hoà vốn, ROI và rủi ro chính.' },
  ],
  yeuCauChung: [{ en: 'Do not declare ReminderService or HOUR in tests.js — the grader provides them.', vi: 'Không khai báo ReminderService hay HOUR trong tests.js — máy chấm cung cấp.' }],
  cayThuMuc: `lib/testkit.js           ← Jest-like runner (do not edit)
lib/sut.js               ← const HOUR
tests.js                 ← Part A
answers/b-pipeline.js    ← const PIPELINE = { S1: { layer, stage }, … }
answers/c-tools.js       ← const TOOLS = { N1: '…', … }
answers/d-business.js    ← const BUSINESS = { breakEven, roi50, mainRisk }`,
  moHinh: {
    ten: 'Allowed values',
    truong: [
      ['PIPELINE.*.layer · stage', 'string', { en: `${TANG.join(' · ')} — ${STAGE.join(' · ')}`, vi: `${TANG.join(' · ')} — ${STAGE.join(' · ')}` }],
      ['TOOLS.*', 'string', { en: LOAI.join(' · '), vi: LOAI.join(' · ') }],
      ['BUSINESS.mainRisk', 'string', { en: 'Underestimated maintenance effort · Too many testers · Too few test cases', vi: 'Underestimated maintenance effort · Too many testers · Too few test cases' }],
    ],
  },
  chucNang: [
    { ten: { en: 'A1 Mocks — listed defects', vi: 'A1 Mock — lỗi công khai' }, diem: 4, yeuCau: [{ en: 'A valid suite (≥ 7 tests) that kills M1–M5.', vi: 'Bộ test hợp lệ (≥ 7 test) giết M1–M5.' }], hook: ['test doubles', 'unit test framework'] },
    { ten: { en: 'A2 Mocks — hidden defects', vi: 'A2 Mock — lỗi ẩn' }, diem: 1, yeuCau: [{ en: 'Three more interaction defects.', vi: 'Ba lỗi tương tác nữa.' }], hook: ['test doubles'] },
    { ten: { en: 'B–C. Pipeline and tools', vi: 'B–C. Pipeline và công cụ' }, diem: 3, yeuCau: [{ en: 'Eight + six values.', vi: 'Tám + sáu giá trị.' }], hook: ['test pyramid', 'tool classification'] },
    { ten: { en: 'D. Business case', vi: 'D. Luận chứng' }, diem: 2, yeuCau: [{ en: 'Break-even, ROI, main risk.', vi: 'Hoà vốn, ROI, rủi ro chính.' }], hook: ['cost-benefit'] },
  ],
  idBatBuoc: [['tests.js', 'tests.js'], ['PIPELINE', 'answers/b-pipeline.js'], ['TOOLS', 'answers/c-tools.js'], ['BUSINESS', 'answers/d-business.js']],
  truDiem: [
    { en: 'Asserting only the returned count — a version that never marks bookings as reminded returns the same count.', vi: 'Chỉ kiểm số trả về — bản không đánh dấu đã nhắc trả cùng số.' },
    { en: 'Putting the 55-minute Selenium suite in the pre-merge gate.', vi: 'Đặt bộ Selenium 55 phút vào cổng trước khi merge.' },
  ],
  nopBai: NOP_BAI,
};

const GIAI_B = `const PIPELINE = {\n${SUITE.map(([m, , t, s]) => `  ${m}: { layer: '${t}', stage: '${s}' },`).join('\n')}\n};\n`;
const GIAI_C = `const TOOLS = {\n${NHU_CAU.map(([m, , v]) => `  ${m}: '${v}',`).join('\n')}\n};\n`;
const GIAI_D = "const BUSINESS = { breakEven: 0, roi50: 0, mainRisk: '' };\n";

export default doiDau({
  slug: 'swt301-8-lab-tools-reminder-service',
  ten: 'Lab 8 — Tools and Automation for LabBook Reminders',
  moTaModule: 'Lab chương 8: unit test dùng mock kiểu Mockito cho ReminderService (chấm bằng 8 mutant tương tác), tầng kim tự tháp + stage CI của bốn bộ test, loại công cụ cho sáu nhu cầu, luận chứng hoà vốn/ROI của tự động hoá.',
  khoa: KHOA,
  baiHoc: 'swt301-junit-hands-on',
  de: [{
    ...goc,
    dangBai: 'lab', diem: 100,
    khaiNiem: ['test doubles', 'unit test framework', 'test pyramid', 'continuous integration', 'tool classification', 'cost-benefit'],
    tienQuyet: ['SWT301 chapter 8'],
    the: ['swt301', 'lab', 'tools'],
    banIn: BAN_IN,
    moTaNgan: 'Lab chương 8: công cụ và tự động hoá cho thư nhắc LabBook.',
    tests: { ...goc.tests, tepNap: [...goc.tests.tepNap, 'answers/b-pipeline.js', 'answers/c-tools.js', 'answers/d-business.js'], kiem: KIEM },
    khoiDau: {
      ...goc.khoiDau,
      'answers/b-pipeline.js': `// layer: ${TANG.join(' | ')}\n// stage: ${STAGE.join(' | ')}\nconst PIPELINE = {\n${SUITE.map(([m]) => `  ${m}: { layer: '', stage: '' },`).join('\n')}\n};\n`,
      'answers/c-tools.js': `// ${LOAI.join(' | ')}\nconst TOOLS = { N1: '', N2: '', N3: '', N4: '', N5: '', N6: '' };\n`,
      'answers/d-business.js': GIAI_D,
    },
    loiGiai: {
      ...goc.loiGiai,
      'answers/b-pipeline.js': GIAI_B,
      'answers/c-tools.js': GIAI_C,
      'answers/d-business.js': "// saving per run = 300 − 30 − 40 = 230 min; 13 runs save 2,990 < 3,000, 14 runs save 3,220 ≥ 3,000 → 14.\n// ROI after 50 runs: manual 15000; automated 3000 + 70 × 50 = 6500; (15000 − 6500) / 6500 = 130.8 %.\nconst BUSINESS = { breakEven: 14, roi50: 130.8, mainRisk: 'Underestimated maintenance effort' };\n",
    },
    boYeu: [
      { ten: 'chỉ kiểm số trả về', tep: { 'tests.js': GIAI.split('\n').filter((l) => !/toHaveBeenCalled/.test(l)).join('\n') }, phaiTruot: ['Kills mutant M3'] },
      { ten: 'Selenium trong cổng push', tep: { 'answers/b-pipeline.js': GIAI_B.replace("S3: { layer: 'UI / end-to-end', stage: 'Nightly' }", "S3: { layer: 'UI / end-to-end', stage: 'Every push (pre-merge)' }") }, phaiTruot: ['B — CI stage of S3'] },
    ],
  }],
});
