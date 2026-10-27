/**
 * SWT301 · DEEP LAB CHƯƠNG 2 — Component integration testing bằng test double: viết bộ test cho BookingService với stub/spy
 * thay repository, mailer, clock; chấm bằng mutant LỖI GIAO DIỆN (đảo tham số, sai đơn vị, gửi thư trước khi lưu, nuốt lỗi…).
 */
import { doiDau, KHOA, NOP_BAI, preMa } from './_chung.mjs';
import { dotBienDe, TN_TEST } from './_de.mjs';

const SUT = `// Errors shared by BookingService and your tests.
class ValidationError extends Error { constructor(m) { super(m); this.name = 'ValidationError'; } }
class LimitError extends Error { constructor(m) { super(m); this.name = 'LimitError'; } }
class NotFoundError extends Error { constructor(m) { super(m); this.name = 'NotFoundError'; } }
class ForbiddenError extends Error { constructor(m) { super(m); this.name = 'ForbiddenError'; } }
class RepositoryError extends Error { constructor(m) { super(m); this.name = 'RepositoryError'; } }
`;

const DUNG = `class BookingService {
  constructor(repo, mailer, clock) {
    this.repo = repo;
    this.mailer = mailer;
    this.clock = clock;
  }

  book(studentId, lab, start, hours) {
    if (!studentId) throw new ValidationError('STUDENT_REQUIRED');
    if (!Number.isInteger(hours) || hours < 1 || hours > 3) throw new ValidationError('INVALID_HOURS');
    const week = this.clock.weekOf(start);
    const used = this.repo.hoursThisWeek(studentId, week);
    if (used + hours > 6) throw new LimitError('WEEKLY_LIMIT');
    const free = this.repo.freeSeats(lab, start, hours);
    const status = free > 0 ? 'CONFIRMED' : 'PENDING';
    const saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status });
    const subject = status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist';
    this.mailer.send(studentId, subject, saved.code);
    return saved;
  }

  cancel(code, studentId) {
    const b = this.repo.findByCode(code);
    if (!b) throw new NotFoundError('BOOKING_NOT_FOUND');
    if (b.studentId !== studentId) throw new ForbiddenError('NOT_OWNER');
    this.repo.updateStatus(code, 'CANCELLED');
    if (b.status === 'CONFIRMED') {
      const next = this.repo.firstPending(b.lab, b.start);
      if (next) {
        this.repo.updateStatus(next.code, 'CONFIRMED');
        this.mailer.send(next.studentId, 'Booking confirmed', next.code);
      }
    }
    return { code, status: 'CANCELLED' };
  }
}`;
const doi = (a, b) => { if (!DUNG.includes(a)) throw new Error('mutant không khớp: ' + a); return DUNG.replace(a, b); };

const DOT_BIEN = [
  { ma: 'M1', nhom: 'f2', moTa: { en: 'hoursThisWeek is called with (week, studentId) — parameters swapped', vi: 'gọi hoursThisWeek(week, studentId) — đảo tham số' }, code: doi('this.repo.hoursThisWeek(studentId, week)', 'this.repo.hoursThisWeek(week, studentId)') },
  { ma: 'M2', nhom: 'f2', moTa: { en: 'the duration is saved in hours although the repository stores minutes', vi: 'lưu thời lượng bằng giờ dù repository lưu phút' }, code: doi('minutes: hours * 60', 'minutes: hours') },
  { ma: 'M3', nhom: 'f3', moTa: { en: 'the e-mail is sent before the booking is saved (no booking code yet)', vi: 'gửi thư trước khi lưu (chưa có mã booking)' }, code: doi("const saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status });\n    const subject = status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist';\n    this.mailer.send(studentId, subject, saved.code);", "const subject = status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist';\n    this.mailer.send(studentId, subject, undefined);\n    const saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status });") },
  { ma: 'M4', nhom: 'f3', moTa: { en: 'a waitlisted student is told “Booking confirmed”', vi: 'sinh viên trong danh sách chờ nhận thư “Booking confirmed”' }, code: doi("status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist'", "'Booking confirmed'") },
  { ma: 'M5', nhom: 'f2', moTa: { en: 'freeSeats is asked for the start hour only (hours not passed)', vi: 'chỉ hỏi freeSeats cho giờ bắt đầu (không truyền số giờ)' }, code: doi('this.repo.freeSeats(lab, start, hours)', 'this.repo.freeSeats(lab, start)') },
  { ma: 'M6', nhom: 'f3', moTa: { en: 'a repository failure is swallowed and book() returns null', vi: 'lỗi repository bị nuốt, book() trả null' }, code: doi('const saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status });', 'let saved;\n    try { saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status }); } catch (e) { return null; }') },
  { ma: 'M7', nhom: 'f3', an: true, moTa: { en: 'the e-mail is still sent when saving fails', vi: 'vẫn gửi thư khi lưu thất bại' }, code: doi("const saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status });\n    const subject = status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist';\n    this.mailer.send(studentId, subject, saved.code);", "const subject = status === 'CONFIRMED' ? 'Booking confirmed' : 'Added to waitlist';\n    let saved;\n    try { saved = this.repo.save({ studentId, lab, start, minutes: hours * 60, status }); } finally { this.mailer.send(studentId, subject, saved && saved.code); }") },
  { ma: 'M8', nhom: 'f4', an: true, moTa: { en: 'cancelling a PENDING booking also promotes the waitlist', vi: 'huỷ booking PENDING cũng nâng hạng danh sách chờ' }, code: doi("if (b.status === 'CONFIRMED') {", 'if (b.status !== \'CANCELLED\') {') },
  { ma: 'M9', nhom: 'f4', moTa: { en: 'the promoted student is updated in the database but never e-mailed', vi: 'người được nâng hạng được cập nhật CSDL nhưng không nhận thư' }, code: doi("        this.mailer.send(next.studentId, 'Booking confirmed', next.code);\n", '') },
  { ma: 'M10', nhom: 'f2', an: true, moTa: { en: 'the weekly total is read for the current week instead of the booking’s week', vi: 'đọc tổng giờ của tuần hiện tại thay vì tuần của booking' }, code: doi('this.clock.weekOf(start)', 'this.clock.weekOf(this.clock.now())') },
  { ma: 'M11', nhom: 'f4', moTa: { en: 'the status is set to CANCELLED before the owner is checked', vi: 'đổi trạng thái CANCELLED trước khi kiểm chủ booking' }, code: doi("    if (b.studentId !== studentId) throw new ForbiddenError('NOT_OWNER');\n    this.repo.updateStatus(code, 'CANCELLED');", "    this.repo.updateStatus(code, 'CANCELLED');\n    if (b.studentId !== studentId) throw new ForbiddenError('NOT_OWNER');") },
];

const DAU_TEST = `// Integration tests of BookingService. Its neighbours (repository, mailer, clock) are NOT ready:
// replace them with test doubles. jest.fn() gives you a stub (fixed answers) AND a spy (records calls).
function deps() {
  const repo = {
    hoursThisWeek: jest.fn(() => 0),
    freeSeats: jest.fn(() => 1),
    save: jest.fn((b) => Object.assign({ code: 'BK0001' }, b)),
    findByCode: jest.fn(() => null),
    updateStatus: jest.fn(),
    firstPending: jest.fn(() => null),
  };
  const mailer = { send: jest.fn() };
  const clock = { weekOf: jest.fn((t) => 'W-' + t), now: jest.fn(() => 'NOW') };
  return { repo, mailer, clock, svc: new BookingService(repo, mailer, clock) };
}

test('a free seat gives a CONFIRMED booking', () => {
  const d = deps();
  const b = d.svc.book('s1', 'LAB01', 900, 2);
  expect(b.status).toBe('CONFIRMED');
});
`;

const GIAI_TEST = `// Integration tests of BookingService with test doubles for its three neighbours.
// The doubles are STUBS (they return fixed answers) and SPIES (they record every call), so each
// test can check the interface contract: which method is called, with which arguments, in which order.
function deps(o = {}) {
  const log = [];
  const repo = {
    hoursThisWeek: jest.fn(() => (o.used === undefined ? 0 : o.used)),
    freeSeats: jest.fn(() => (o.free === undefined ? 1 : o.free)),
    save: jest.fn((b) => {
      log.push('save');
      if (o.saveFails) throw new RepositoryError('DB_DOWN');
      return Object.assign({ code: 'BK0001' }, b);
    }),
    findByCode: jest.fn(() => (o.found === undefined ? null : o.found)),
    updateStatus: jest.fn(),
    firstPending: jest.fn(() => (o.pending === undefined ? null : o.pending)),
  };
  const mailer = { send: jest.fn(() => { log.push('mail'); }) };
  const clock = { weekOf: jest.fn((t) => 'W-' + t), now: jest.fn(() => 'NOW') };
  return { repo, mailer, clock, log, svc: new BookingService(repo, mailer, clock) };
}

describe('book() ↔ repository', () => {
  test('reads the weekly hours of THIS student in the week of the booking', () => {
    const d = deps();
    d.svc.book('s1', 'LAB01', 900, 2);
    expect(d.clock.weekOf).toHaveBeenCalledWith(900);
    expect(d.repo.hoursThisWeek).toHaveBeenCalledWith('s1', 'W-900');
  });

  test('asks for a free seat during every booked hour', () => {
    const d = deps();
    d.svc.book('s1', 'LAB01', 900, 2);
    expect(d.repo.freeSeats).toHaveBeenCalledWith('LAB01', 900, 2);
  });

  test('saves the duration in MINUTES with status CONFIRMED when a seat is free', () => {
    const d = deps();
    d.svc.book('s1', 'LAB01', 900, 2);
    expect(d.repo.save).toHaveBeenCalledWith({ studentId: 's1', lab: 'LAB01', start: 900, minutes: 120, status: 'CONFIRMED' });
  });

  test('saves as PENDING when the lab is full', () => {
    const d = deps({ free: 0 });
    const b = d.svc.book('s1', 'LAB02', 900, 1);
    expect(b.status).toBe('PENDING');
    expect(d.repo.save).toHaveBeenCalledWith({ studentId: 's1', lab: 'LAB02', start: 900, minutes: 60, status: 'PENDING' });
  });

  test('weekly limit: 4 + 2 = 6 hours is accepted', () => {
    const d = deps({ used: 4 });
    expect(d.svc.book('s1', 'LAB01', 900, 2).code).toBe('BK0001');
  });

  test('weekly limit: 5 + 2 hours is refused and nothing is saved or mailed', () => {
    const d = deps({ used: 5 });
    expect(() => d.svc.book('s1', 'LAB01', 900, 2)).toThrow(LimitError);
    expect(d.repo.save).not.toHaveBeenCalled();
    expect(d.mailer.send).not.toHaveBeenCalled();
  });

  test('invalid hours are rejected before any repository call', () => {
    const d = deps();
    expect(() => d.svc.book('s1', 'LAB01', 900, 4)).toThrow(ValidationError);
    expect(d.repo.hoursThisWeek).not.toHaveBeenCalled();
  });
});

describe('book() ↔ mailer', () => {
  test('mails "Booking confirmed" with the SAVED code, after saving', () => {
    const d = deps();
    d.svc.book('s1', 'LAB01', 900, 2);
    expect(d.mailer.send).toHaveBeenCalledWith('s1', 'Booking confirmed', 'BK0001');
    expect(d.log).toEqual(['save', 'mail']);
  });

  test('mails "Added to waitlist" when the booking is PENDING', () => {
    const d = deps({ free: 0 });
    d.svc.book('s1', 'LAB02', 900, 1);
    expect(d.mailer.send).toHaveBeenCalledWith('s1', 'Added to waitlist', 'BK0001');
  });

  test('a repository failure propagates and no e-mail is sent', () => {
    const d = deps({ saveFails: true });
    expect(() => d.svc.book('s1', 'LAB01', 900, 2)).toThrow(RepositoryError);
    expect(d.mailer.send).not.toHaveBeenCalled();
  });
});

describe('cancel() ↔ repository and mailer', () => {
  const confirmed = { code: 'BK0001', studentId: 's1', status: 'CONFIRMED', lab: 'LAB02', start: 900 };

  test('cancelling a CONFIRMED booking promotes the first pending student and mails them', () => {
    const d = deps({ found: confirmed, pending: { code: 'BK0002', studentId: 's2' } });
    expect(d.svc.cancel('BK0001', 's1')).toEqual({ code: 'BK0001', status: 'CANCELLED' });
    expect(d.repo.updateStatus).toHaveBeenCalledWith('BK0001', 'CANCELLED');
    expect(d.repo.firstPending).toHaveBeenCalledWith('LAB02', 900);
    expect(d.repo.updateStatus).toHaveBeenCalledWith('BK0002', 'CONFIRMED');
    expect(d.mailer.send).toHaveBeenCalledWith('s2', 'Booking confirmed', 'BK0002');
  });

  test('cancelling a PENDING booking promotes nobody', () => {
    const d = deps({ found: Object.assign({}, confirmed, { status: 'PENDING' }), pending: { code: 'BK0003', studentId: 's3' } });
    d.svc.cancel('BK0001', 's1');
    expect(d.repo.updateStatus).toHaveBeenCalledTimes(1);
    expect(d.mailer.send).not.toHaveBeenCalled();
  });

  test('a non-owner cannot cancel and nothing is changed', () => {
    const d = deps({ found: confirmed });
    expect(() => d.svc.cancel('BK0001', 's2')).toThrow(ForbiddenError);
    expect(d.repo.updateStatus).not.toHaveBeenCalled();
  });

  test('an unknown code is reported as not found', () => {
    const d = deps();
    expect(() => d.svc.cancel('BK9999', 's1')).toThrow(NotFoundError);
  });
});
`;

const HOP_DONG = `clock.weekOf(start)                    → week key of the booking's start
repo.hoursThisWeek(studentId, week)    → hours already booked by that student in that week
repo.freeSeats(lab, start, hours)      → seats free during EVERY booked hour
repo.save({ studentId, lab, start, minutes, status })
                                       → the saved booking { code, … }   (durations are stored in MINUTES)
mailer.send(to, subject, ref)          → after save; subject "Booking confirmed" | "Added to waitlist"; ref = booking code
repo.findByCode(code) · repo.updateStatus(code, status) · repo.firstPending(lab, start)
Rules: a failing repo.save throws RepositoryError — it must reach the caller and NO e-mail is sent.
       cancel: only the owner may cancel (ForbiddenError, nothing changed); cancelling a CONFIRMED booking
       promotes the first pending booking of that lab and start and e-mails "Booking confirmed" to its student.`;

const BAN_IN = {
  tieuDe: 'Deep Lab 2 — Component Integration Testing with Test Doubles',
  phu: { en: 'Chapter 2 deep lab · stubs, spies and drivers in code · graded by interface mutants · 10 marks', vi: 'Deep Lab chương 2 · stub, spy và driver bằng code · chấm bằng mutant lỗi giao diện · 10 điểm' },
  moTa: {
    en: `<p>Integration testing focuses on the <b>interfaces</b> between components: wrong parameter order, wrong units, wrong call order, errors that are swallowed (lesson 2.2). The repository, the mail service and the clock of LabBook are not ready, so you test <code>BookingService</code> against <b>test doubles</b>. Your test file plays the <b>driver</b> (it calls the service); <code>jest.fn()</code> objects are the <b>stubs</b> (fixed answers) and <b>spies</b> (they record calls).</p>
<p>The interface contract (from the sequence diagram):</p>${preMa(HOP_DONG)}
<p>The class under test:</p>${preMa(DUNG)}
<p>Write <code>tests.js</code>. The grader runs it against the correct class and against <b>11 faulty versions</b>, each with one integration defect (7 are listed in the rubric, 4 are hidden). A faulty version is <b>killed</b> when at least one of your tests passes on the correct class and fails on it.</p>`,
    vi: `<p>Integration testing tập trung vào <b>giao diện</b> giữa các thành phần: đảo thứ tự tham số, sai đơn vị, sai thứ tự gọi, lỗi bị nuốt (bài 2.2). Repository, dịch vụ thư và đồng hồ của LabBook chưa sẵn sàng, nên bạn test <code>BookingService</code> với <b>test double</b>. Tệp test của bạn đóng vai <b>driver</b> (gọi service); các đối tượng <code>jest.fn()</code> là <b>stub</b> (trả lời cố định) và <b>spy</b> (ghi lại lời gọi).</p>
<p>Hợp đồng giao diện (từ sequence diagram) và lớp cần test ở trên. Viết <code>tests.js</code>. Máy chấm chạy nó trên lớp đúng và trên <b>11 phiên bản lỗi</b>, mỗi bản một lỗi tích hợp (7 bản ghi trong thang điểm, 4 bản ẩn). Bản lỗi bị <b>giết</b> khi ít nhất một test của bạn đạt trên lớp đúng và trượt trên nó.</p>`,
  },
  chucNangChinh: [
    { en: 'f1 A valid suite: every test passes on the correct class; at least 10 tests, each with an expect().', vi: 'f1 Bộ test hợp lệ: mọi test đạt trên lớp đúng; ít nhất 10 test, mỗi test có expect().' },
    { en: 'f2 book() ↔ repository and clock: arguments, units.', vi: 'f2 book() ↔ repository và clock: tham số, đơn vị.' },
    { en: 'f3 book() ↔ mailer: subject, code, order, error propagation.', vi: 'f3 book() ↔ mailer: tiêu đề, mã, thứ tự, lan truyền lỗi.' },
    { en: 'f4 cancel() ↔ repository and mailer: owner check, promotion.', vi: 'f4 cancel() ↔ repository và mailer: kiểm chủ, nâng hạng.' },
  ],
  yeuCauChung: [{ en: 'Do not declare BookingService or the error classes yourself — the grader provides them. Create fresh doubles in every test.', vi: 'Không tự khai báo BookingService hay các lớp lỗi — máy chấm cung cấp. Tạo double mới trong mỗi test.' }],
  cayThuMuc: `lib/testkit.js   ← Jest-like runner (do not edit)
lib/sut.js       ← ValidationError, LimitError, NotFoundError, ForbiddenError, RepositoryError
tests.js         ← YOUR integration tests`,
  moHinh: {
    ten: 'Test-double toolkit',
    truong: [
      ['jest.fn(impl?)', 'mock function', { en: 'stub + spy; impl gives the answer', vi: 'stub + spy; impl cho câu trả lời' }],
      ['expect(spy).toHaveBeenCalledWith(...args)', 'matcher', { en: 'some call had exactly these arguments (deep equality)', vi: 'có lời gọi đúng các tham số này (so sâu)' }],
      ['expect(spy).not.toHaveBeenCalled() · toHaveBeenCalledTimes(n)', 'matcher', { en: 'never called · called n times', vi: 'không được gọi · gọi n lần' }],
      ['expect(fn).toThrow(ErrorClass)', 'matcher', { en: 'the call throws that error', vi: 'lời gọi ném lỗi đó' }],
    ],
  },
  chucNang: [
    { ten: { en: 'f1 Valid suite', vi: 'f1 Bộ test hợp lệ' }, diem: 2, yeuCau: [{ en: 'Passes on the correct class; ≥ 10 tests.', vi: 'Đạt trên lớp đúng; ≥ 10 test.' }], hook: ['test doubles'] },
    { ten: { en: 'f2 Repository interface', vi: 'f2 Giao diện repository' }, diem: 3, yeuCau: [{ en: 'Kill the parameter, unit and week defects.', vi: 'Giết lỗi tham số, đơn vị và tuần.' }], hook: ['interface defects'] },
    { ten: { en: 'f3 Mailer interface', vi: 'f3 Giao diện mailer' }, diem: 3, yeuCau: [{ en: 'Kill the order, subject and error-handling defects.', vi: 'Giết lỗi thứ tự, tiêu đề và xử lý lỗi.' }], hook: ['spies'] },
    { ten: { en: 'f4 Cancel interactions', vi: 'f4 Tương tác khi huỷ' }, diem: 2, yeuCau: [{ en: 'Kill the owner-check and promotion defects.', vi: 'Giết lỗi kiểm chủ và nâng hạng.' }], hook: ['integration testing'] },
  ],
  idBatBuoc: [['tests.js', 'tests.js']],
  truDiem: [
    { en: 'Checking only return values — most interface defects return the same value and survive.', vi: 'Chỉ kiểm giá trị trả về — đa số lỗi giao diện trả cùng giá trị và sống sót.' },
    { en: 'Sharing one set of doubles between tests — calls recorded by one test leak into the next.', vi: 'Dùng chung một bộ double giữa các test — lời gọi của test trước rò sang test sau.' },
  ],
  nopBai: NOP_BAI,
};

const goc = dotBienDe({
  tieuDe: 'Deep Lab 2 — Component Integration Testing with Test Doubles',
  doKho: 'HARD', phut: 120,
  moTa: BAN_IN.moTa,
  viDu: [{ input: "expect(d.repo.hoursThisWeek).toHaveBeenCalledWith('s1', 'W-900')", output: 'kills M1 (parameters swapped)', explanation: 'The swapped version returns the same booking, but the spy saw the wrong arguments.|||Bản đảo tham số trả cùng booking, nhưng spy thấy sai tham số.' }],
  goiY: [
    'Viết hàm deps(o) tạo double MỚI cho mỗi test; tham số o điều khiển câu trả lời của stub (used, free, saveFails, found, pending).',
    'Kiểm lời gọi bằng toHaveBeenCalledWith — đúng tham số, đúng đơn vị (phút!).',
    'Thứ tự: cho save và send cùng ghi vào một mảng log rồi expect(log).toEqual([\'save\', \'mail\']).',
    'Tình huống lỗi: stub save ném RepositoryError; kiểm book() ném lại VÀ mailer.send không được gọi.',
  ],
  loiHayGap: ['Chỉ kiểm b.status — mutant đảo tham số vẫn trả CONFIRMED.', 'Quên kiểm “không gửi thư” khi lưu lỗi.', 'Không có test huỷ booking PENDING nên mutant nâng hạng sai sống sót.'],
  giaiThich: '<p>Stubs control what the neighbours answer; spies show how the service used them. Interface defects (swapped parameters, wrong units, wrong order, swallowed errors) rarely change the return value — only interaction checks reveal them. JUnit 5 + Mockito equivalent: <code>verify(repo).hoursThisWeek("s1", "W-900")</code>, <code>InOrder</code>, <code>verifyNoInteractions(mailer)</code>.</p>',
  thuatNgu: [...TN_TEST(), { en: 'test double', vi: 'đối tượng giả thay thành phần thật' }, { en: 'stub', vi: 'double trả lời cố định' }, { en: 'spy', vi: 'double ghi lại lời gọi' }, { en: 'driver', vi: 'mã gọi thành phần đang test' }],
  ten: ['BookingService'], dung: DUNG, sut: SUT, minTest: 10,
  dotBien: DOT_BIEN,
  dauTest: DAU_TEST, giaiTest: GIAI_TEST,
  boYeu: [
    { ten: 'chỉ kiểm giá trị trả về', tep: { 'tests.js': GIAI_TEST.split('\n').filter((l) => !/toHaveBeenCalled|toEqual\(\['save'/.test(l)).join('\n') }, phaiTruot: ['Kills mutant M1', 'Kills mutant M3'] },
  ],
});
// nhóm điểm: 2 kiểm đầu (bộ test hợp lệ) = f1; mỗi mutant theo nhóm của nó
const kiem = goc.tests.kiem.map((k, i) => ({ ...k, nhom: i < 2 ? 'f1' : DOT_BIEN[i - 2].nhom }));

export default doiDau({
  slug: 'swt301-2-deep-integration-test-doubles',
  ten: 'Deep Lab 2 — Component Integration Testing with Test Doubles',
  moTaModule: 'Deep Lab chương 2: viết test tích hợp cho BookingService với stub/spy thay repository, mailer, clock; chấm bằng 11 mutant lỗi giao diện (đảo tham số, sai đơn vị phút/giờ, gửi thư trước khi lưu, nuốt lỗi, nâng hạng sai, kiểm chủ muộn).',
  khoa: KHOA,
  baiHoc: 'swt301-test-levels',
  de: [{
    ...goc,
    dangBai: 'deep-lab', diem: 100,
    khaiNiem: ['integration testing', 'test doubles', 'stubs and drivers', 'mutation testing'],
    tienQuyet: ['SWT301 lesson 2.2', 'Jest-like expect'],
    the: ['swt301', 'deep-lab', 'integration-testing'],
    banIn: BAN_IN,
    moTaNgan: 'Deep Lab chương 2: test tích hợp với test double.',
    tests: { ...goc.tests, kiem },
  }],
});
