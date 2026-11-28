/**
 * Testing — Practical Exam (PE): 5 câu VIẾT BỘ TEST, chấm bằng đột biến.
 *
 * Đề tự soạn, bám sát `content/courses/testing/s00…s11` và dự án xuyên khoá LabFlow Lite.
 * Khác FE (50 câu trắc nghiệm) và PT (trắc nghiệm + 2 câu ngắn), đề này chỉ có một việc —
 * đúng việc cả khoá dạy: viết test đủ mạnh để bắt lỗi. Mỗi câu cho sẵn code THẬT của LabFlow
 * Lite (chép từ `_labflow-lite/src/rules/booking.js`, `booking/service.js`, `rules/cancel.js`,
 * `rules/waitlist.js`, đổi sang CommonJS để chạy bằng `node` trần), một bộ chạy test thu gọn kiểu
 * Vitest, và một hàm `build(mutant)` cài từng đột biến M1…M6 vào đúng một dòng — đúng cơ chế
 * `scripts/dot-bien*.mjs` và máy chấm `mutation` của Code Lab `testing-practice`.
 *
 * ⚠️ MỌI lời giải mẫu đã CHẠY THẬT: `node scripts/exam-check.mjs content/exams/TESTING-PE.mjs`
 * ghép starterCode + sampleSolution, chạy bằng Node 22 và so với expectedOutput — xanh với code
 * thật, 6/6 đột biến bị diệt ở cả 5 câu. Không câu nào phụ thuộc múi giờ máy chạy (mọi thời điểm
 * đều ghi kèm +07:00, đúng bài học 2.2 / 11.2).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/TESTING-PE.mjs --apply
 */
import { B, c, codeQ, starter, allKilled } from './_lib/testing-exam-kit.mjs';

const M6 = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];

const rubric = (rows) => rows.map(([id, en, vi, maxScore]) => ({ id, criterion: B(en, vi), weight: maxScore, maxScore }));

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b> Five questions, one task each: <b>write the tests</b>. You never change the code under test.</p>' +
  '<ol>' +
  '<li>Create <code>Q1.cjs … Q5.cjs</code>. Copy each question\'s <b>Starter</b> verbatim. Write your tests only inside <code>function suite(test, expect, { … })</code>, between the two <code>ĐỀ CHO SẴN</code> markers.</li>' +
  '<li>The given block contains a tiny Vitest-like runner (<code>test</code>, <code>test.each</code>, <code>expect(…).toBe / toEqual / toMatchObject / toThrow / toBeCloseTo</code>, <code>.not</code>, <code>await expect(p).rejects / resolves</code>, <code>spy()</code> with <code>toHaveBeenCalledTimes / toHaveBeenCalledWith</code>). Use only that — no npm.</li>' +
  '<li>Use the implementation you receive as the third parameter (<code>{ checkSlot }</code> …), never a copy of your own: the grader runs your suite once on the real code and once on every mutant.</li>' +
  '<li>Run <code>node Q1.cjs</code>. The expected result is <code>real code: all green</code>, then <code>M1: killed</code> … <code>M6: killed</code>. A test with no <code>expect</code> is red, exactly like <code>requireAssertions: true</code> in LabFlow Lite.</li>' +
  '<li>Zip the five files into one .zip and upload it.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> The printed result first — a surviving mutant is a bug your suite lets through. Then the tests themselves: exact expected values taken from the requirement, both sides of each boundary, the error <i>code</i> or <i>class</i> rather than "it threw something". A suite that kills mutants by reading their code and asserting on accidental details (a log line, an internal call order nobody asked for) loses quality marks even when the output matches.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài.</b> Năm câu, mỗi câu một việc: <b>viết test</b>. Bạn không bao giờ sửa code được test.</p>' +
  '<ol>' +
  '<li>Tạo <code>Q1.cjs … Q5.cjs</code>. Chép <b>nguyên văn</b> khối Mã cho sẵn của từng câu. Chỉ viết test bên trong <code>function suite(test, expect, { … })</code>, giữa hai mốc <code>ĐỀ CHO SẴN</code>.</li>' +
  '<li>Khối cho sẵn có một bộ chạy test thu gọn kiểu Vitest (<code>test</code>, <code>test.each</code>, <code>expect(…).toBe / toEqual / toMatchObject / toThrow / toBeCloseTo</code>, <code>.not</code>, <code>await expect(p).rejects / resolves</code>, <code>spy()</code> với <code>toHaveBeenCalledTimes / toHaveBeenCalledWith</code>). Chỉ dùng những thứ đó — không npm.</li>' +
  '<li>Luôn dùng hàm nhận qua tham số thứ ba (<code>{ checkSlot }</code> …), không tự chép một bản: máy chấm chạy bộ test một lần trên code thật và một lần trên từng đột biến.</li>' +
  '<li>Chạy <code>node Q1.cjs</code>. Kết quả mong đợi là <code>real code: all green</code>, rồi <code>M1: killed</code> … <code>M6: killed</code>. Một test không có <code>expect</code> nào là ĐỎ, đúng như <code>requireAssertions: true</code> của LabFlow Lite.</li>' +
  '<li>Nén năm file thành một .zip rồi tải lên.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Trước hết là kết quả in ra — một đột biến SỐNG là một bug bộ test của bạn để lọt. Sau đó là chính các test: giá trị mong đợi cụ thể lấy từ yêu cầu, hai phía của mỗi biên, <i>mã</i> lỗi hoặc <i>lớp</i> lỗi chứ không phải "có ném gì đó". Bộ test diệt đột biến nhờ đọc code đột biến rồi khẳng định những chi tiết tình cờ (một dòng log, một thứ tự gọi nội bộ không ai yêu cầu) bị trừ điểm chất lượng dù kết quả in ra khớp.</p>' +
  '</div>';

/* ───────────────────────── Câu 1 — checkSlot (Ch1) ───────────────────────── */

const Q1_GIVEN = `
// LabFlow Lite — src/rules/time.js + src/rules/booking.js (CommonJS). Code THẬT: build(null).
function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}
const OPEN = 7 * 60, CLOSE = 21 * 60, STEP = 30, MAX_MINUTES = 240;
function build(mutant) {
  function checkSlot(start, end) {
    const s = parseTime(start);
    const e = parseTime(end);
    const offGrid = mutant === 'M1' ? s % STEP !== 0 : s % STEP !== 0 || e % STEP !== 0;
    if (offGrid) return { ok: false, code: 'OFF_GRID' };
    if (mutant === 'M2' ? e < s : e <= s) return { ok: false, code: 'END_BEFORE_START' };
    const early = mutant === 'M4' ? s <= OPEN : s < OPEN;
    const late = mutant === 'M3' ? e >= CLOSE : e > CLOSE;
    if (early || late) return { ok: false, code: 'OUTSIDE_HOURS' };
    if (mutant === 'M5' ? e - s >= MAX_MINUTES : e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
    return { ok: true, minutes: mutant === 'M6' ? (e - s) / 60 : e - s };
  }
  return { checkSlot };
}
`;

const Q1_SOLUTION = `function suite(test, expect, { checkSlot }) {
  // Phân vùng tương đương + giá trị biên (bài 1.4): mỗi luật một hàng ĐÚNG trên biên và một hàng vừa qua biên.
  test.each([
    ['07:00', '09:00', { ok: true, minutes: 120 }],        // mở cửa đúng 07:00 — biên dưới (M4)
    ['19:00', '21:00', { ok: true, minutes: 120 }],        // kết thúc đúng 21:00 — biên trên (M3)
    ['08:00', '12:00', { ok: true, minutes: 240 }],        // đúng 4 giờ — được phép (M5); minutes là PHÚT (M6)
    ['08:00', '12:30', { ok: false, code: 'TOO_LONG' }],   // 4 giờ 30 — vừa quá trần
    ['06:30', '08:00', { ok: false, code: 'OUTSIDE_HOURS' }],
    ['20:00', '21:30', { ok: false, code: 'OUTSIDE_HOURS' }],
    ['09:00', '09:00', { ok: false, code: 'END_BEFORE_START' }], // bằng nhau — 0 phút không phải một lượt đặt (M2)
    ['10:00', '09:00', { ok: false, code: 'END_BEFORE_START' }],
    ['08:15', '09:00', { ok: false, code: 'OFF_GRID' }],   // lệch lưới ở giờ bắt đầu
    ['08:00', '09:15', { ok: false, code: 'OFF_GRID' }],   // lệch lưới ở giờ KẾT THÚC (M1)
  ])('checkSlot(%s, %s)', (start, end, expected) => {
    expect(checkSlot(start, end)).toEqual(expected);
  });

  test('a malformed time is a TypeError that says what format it expected', () => {
    expect(() => checkSlot('7:00', '09:00')).toThrow(TypeError);
    expect(() => checkSlot('7:00', '09:00')).toThrow('expected HH:MM');
  });
}`;

/* ─────────────────── Câu 2 — needsApproval + createBooking (Ch1.4) ─────────────────── */

const Q2_GIVEN = `
// LabFlow Lite — needsApproval (BR-06) + createBooking (Lite-2). Code THẬT: build(null).
const APPROVAL_SEATS = 30;
function build(mutant) {
  function needsApproval({ seats, role }) {
    const invalid = mutant === 'M4' ? seats < 1 : !Number.isInteger(seats) || seats < 1;
    if (mutant === 'M3' ? !Number.isInteger(seats) || seats < 0 : invalid) {
      if (mutant === 'M6') throw new Error('seats must be a positive integer, got ' + seats);
      throw new RangeError('seats must be a positive integer, got ' + seats);
    }
    if (role === 'LECTURER' || (mutant === 'M2' ? false : role === 'ADMIN')) return false;
    return mutant === 'M1' ? seats >= APPROVAL_SEATS : seats > APPROVAL_SEATS;
  }
  function createBooking({ lab, seats, role, start, end, minutes }) {
    const pending = needsApproval({ seats, role });
    return { lab, start, end, minutes, status: (mutant === 'M5' ? !pending : pending) ? 'PENDING' : 'CONFIRMED' };
  }
  return { needsApproval, createBooking };
}
`;

const Q2_SOLUTION = `function suite(test, expect, { needsApproval, createBooking }) {
  // Bảng quyết định đủ 3 vai × 2 điều kiện = 6 hàng, dùng đúng 30 và 31 chỗ để mỗi hàng cũng là một phép thử biên (bài 1.4).
  test.each([
    ['STUDENT', 30, false],
    ['STUDENT', 31, true],      // > 30 mới cần duyệt (M1: >= 30)
    ['LECTURER', 30, false],
    ['LECTURER', 31, false],
    ['ADMIN', 30, false],
    ['ADMIN', 31, false],       // ADMIN được miễn như LECTURER (M2)
  ])('needsApproval role=%s seats=%s', (role, seats, expected) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });

  test.each([[0], [-3], [2.5]])('seats=%s is refused with a RangeError', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);   // lớp lỗi, không phải toThrow() trống (M6)
  });

  test('createBooking: 31 seats from a student waits for approval, 30 is confirmed', () => {
    const base = { lab: 'BE-201', role: 'STUDENT', start: '08:00', end: '10:00', minutes: 120 };
    expect(createBooking({ ...base, seats: 31 }).status).toBe('PENDING');
    expect(createBooking({ ...base, seats: 30 })).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });
}`;

/* ─────────────────── Câu 3 — bookLab bất đồng bộ + đồ đóng thế (Ch2–4) ─────────────────── */

const Q3_GIVEN = `
// LabFlow Lite — src/booking/service.js (bookLab), rút gọn: checkSlot thay bằng một kiểm tra lưới nhỏ.
class BookingError extends Error {
  constructor(code, options) { super(code, options); this.name = 'BookingError'; this.code = code; }
}
function build(mutant) {
  const slotCode = (start, end) => (start >= end ? 'END_BEFORE_START' : start < '07:00' ? 'OUTSIDE_HOURS' : null);
  async function bookLab(repo, input) {
    const bad = slotCode(input.start, input.end);
    if (bad) throw new BookingError(bad);
    let clash;
    try {
      clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
    } catch (err) {
      if (mutant === 'M1') throw err;
      throw mutant === 'M2' ? new BookingError('STORAGE_DOWN') : new BookingError('STORAGE_DOWN', { cause: err });
    }
    if (clash && mutant !== 'M3') throw new BookingError('OVERLAP');
    const status = mutant === 'M5' ? 'CONFIRMED' : input.seats > 30 && input.role === 'STUDENT' ? 'PENDING' : 'CONFIRMED';
    try {
      return await repo.insert({ ...input, status });
    } catch (err) {
      if (err instanceof BookingError && mutant !== 'M4') throw err; // Ch4: CSDL tự báo OVERLAP (23P01)
      throw new BookingError('STORAGE_DOWN', { cause: err });
    }
  }
  return { bookLab, BookingError };
}
// Đồ đóng thế dựng sẵn: một repo trong bộ nhớ (fake) — tự viết stub/spy của riêng bạn nếu cần.
function memoryRepo(rows = []) {
  return {
    findOverlap: async (lab, date, start, end) => rows.find((b) => b.lab === lab && b.date === date && b.start < end && start < b.end) || null,
    insert: async (b) => { const row = { id: rows.length + 1, ...b }; rows.push(row); return row; },
    rows,
  };
}
`;

const Q3_SOLUTION = `function suite(test, expect, { bookLab, BookingError }) {
  const input = { lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, role: 'STUDENT' };

  test('a free slot is stored as CONFIRMED (state check on the fake repo)', async () => {
    const repo = memoryRepo();
    await expect(bookLab(repo, input)).resolves.toMatchObject({ id: 1, status: 'CONFIRMED' });
    expect(repo.rows).toHaveLength(1);
  });

  test('31 seats from a student is stored as PENDING', async () => {
    const repo = memoryRepo();
    await expect(bookLab(repo, { ...input, seats: 31 })).resolves.toMatchObject({ status: 'PENDING' });
  });

  test('an overlapping booking is refused with OVERLAP and nothing is inserted', async () => {
    const repo = memoryRepo([{ id: 1, lab: 'BE-201', date: '2026-11-16', start: '09:00', end: '11:00' }]);
    await expect(bookLab(repo, input)).rejects.toMatchObject({ code: 'OVERLAP' });
    expect(repo.rows).toHaveLength(1);
  });

  test('a driver error becomes STORAGE_DOWN and keeps the original in cause', async () => {
    const down = { findOverlap: async () => { throw new Error('connect ECONNREFUSED 127.0.0.1:5432'); }, insert: spy() };
    await expect(bookLab(down, input)).rejects.toMatchObject({ code: 'STORAGE_DOWN', cause: { message: 'connect ECONNREFUSED 127.0.0.1:5432' } });
    expect(down.insert).toHaveBeenCalledTimes(0);   // đọc hỏng thì phải dừng, không được ghi
  });

  test('OVERLAP reported by the database itself is passed through, not rewrapped (Ch4)', async () => {
    const racing = { findOverlap: async () => null, insert: async () => { throw new BookingError('OVERLAP'); } };
    await expect(bookLab(racing, input)).rejects.toMatchObject({ code: 'OVERLAP' });
  });

  test('a slot that ends before it starts never reaches the repository', async () => {
    const repo = { findOverlap: spy(async () => null), insert: spy() };
    await expect(bookLab(repo, { ...input, start: '10:00', end: '09:00' })).rejects.toMatchObject({ code: 'END_BEFORE_START' });
    expect(repo.findOverlap).toHaveBeenCalledTimes(0);
  });
}`;

/* ───────────── Câu 4 — cancelDecision: thời gian là đầu vào + IDOR (Ch2, Ch5, Ch11) ───────────── */

const Q4_GIVEN = `
// LabFlow Lite — src/rules/cancel.js (Lite-3 + US-11). Code THẬT: build(null).
// Giờ đặt lab là giờ Việt Nam (+07:00) bất kể múi giờ của máy chủ; now là THAM SỐ (bài 2.2).
function build(mutant) {
  const LIMIT = mutant === 'M6' ? 30 : 60;
  const startsAtVN = (date, start) => new Date(date + 'T' + start + ':00+07:00');
  function canCancel(startsAt, now) {
    const minutesLeft = (startsAt.getTime() - now.getTime()) / 60000;
    return mutant === 'M1' ? minutesLeft > LIMIT : minutesLeft >= LIMIT;
  }
  function cancelDecision(booking, user, now) {
    const isAdmin = user.role === 'ADMIN';
    if (mutant === 'M5' ? !booking && !isAdmin : !booking) return { ok: false, code: 'NOT_FOUND' };
    if (booking.userId !== user.id && !isAdmin) return { ok: false, code: mutant === 'M2' ? 'FORBIDDEN' : 'NOT_FOUND' };
    if (booking.status === 'CANCELLED' && mutant !== 'M4') return { ok: false, code: 'ALREADY_CANCELLED' };
    if ((mutant === 'M3' || !isAdmin) && !canCancel(startsAtVN(booking.date, booking.start), now)) return { ok: false, code: 'TOO_LATE_TO_CANCEL' };
    return { ok: true };
  }
  return { cancelDecision };
}
`;

const Q4_SOLUTION = `function suite(test, expect, { cancelDecision }) {
  const an = { id: 1, role: 'STUDENT' };
  const binh = { id: 2, role: 'STUDENT' };
  const admin = { id: 9, role: 'ADMIN' };
  const booking = { id: 7, userId: 1, status: 'CONFIRMED', date: '2026-11-16', start: '09:00' };
  const at = (hhmm) => new Date('2026-11-16T' + hhmm + ':00+07:00');   // giờ Việt Nam, không phụ thuộc máy

  // Biên thời gian (bài 2.2): đúng 60 phút trước — vẫn được; 59 phút — không; 61 phút — được.
  test.each([
    ['07:59', { ok: true }],
    ['08:00', { ok: true }],                                   // đúng giới hạn (M1: > thay cho >=)
    ['08:01', { ok: false, code: 'TOO_LATE_TO_CANCEL' }],      // 59 phút (M6: giới hạn 30)
  ])('the owner cancels at %s for a 09:00 booking', (hhmm, expected) => {
    expect(cancelDecision(booking, an, at(hhmm))).toEqual(expected);
  });

  test("someone else's booking looks exactly like a missing one (404, not 403)", () => {
    expect(cancelDecision(booking, binh, at('07:00'))).toEqual({ ok: false, code: 'NOT_FOUND' });
    expect(cancelDecision(null, an, at('07:00'))).toEqual({ ok: false, code: 'NOT_FOUND' });
  });

  test('an admin may cancel any booking at any time, but a missing one is still NOT_FOUND', () => {
    expect(cancelDecision(booking, admin, at('08:55'))).toEqual({ ok: true });
    expect(cancelDecision(null, admin, at('07:00'))).toEqual({ ok: false, code: 'NOT_FOUND' });
  });

  test('a cancelled booking cannot be cancelled twice', () => {
    expect(cancelDecision({ ...booking, status: 'CANCELLED' }, an, at('07:00'))).toEqual({ ok: false, code: 'ALREADY_CANCELLED' });
  });
}`;

/* ───────────── Câu 5 — hàng chờ BR-09: bất biến dữ liệu + hết hạn (Ch10) ───────────── */

const Q5_GIVEN = `
// LabFlow Lite — src/rules/waitlist.js (BR-09, dựng bằng TDD ở bài 10.1). Code THẬT: build(null).
function build(mutant) {
  const WAITLIST_MAX = 3;
  const OFFER_MINUTES = mutant === 'M5' ? 60 : 30;
  const refuse = (code) => ({ ok: false, code });
  const minutesLater = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);
  // queue: [{ userId }], người đến trước đứng đầu. KHÔNG được sửa mảng nhận vào — trả mảng mới.
  function joinWaitlist(queue, { userId, holderId }) {
    if (userId === holderId && mutant !== 'M6') return refuse('IS_HOLDER');
    if (queue.some((w) => w.userId === userId)) return refuse('ALREADY_WAITING');
    if (mutant === 'M1' ? queue.length > WAITLIST_MAX : queue.length >= WAITLIST_MAX) return refuse('WAITLIST_FULL');
    let next;
    if (mutant === 'M2') { queue.push({ userId }); next = queue; } else next = [...queue, { userId }];
    return { ok: true, position: next.length, queue: next };
  }
  // Chỗ vừa trống lúc now: giữ cho người ĐẦU hàng trong 30 phút.
  function offerNext(queue, now) {
    if (queue.length === 0) return { offer: null, queue: [] };
    const first = mutant === 'M3' ? queue[queue.length - 1] : queue[0];
    const rest = queue.filter((w) => w !== first);
    return { offer: { userId: first.userId, expiresAt: minutesLater(now, OFFER_MINUTES) }, queue: rest };
  }
  function acceptOffer(offer, now) {
    return (mutant === 'M4' ? now <= offer.expiresAt : now < offer.expiresAt) ? { ok: true } : refuse('OFFER_EXPIRED');
  }
  return { joinWaitlist, offerNext, acceptOffer };
}
`;

const Q5_SOLUTION = `function suite(test, expect, { joinWaitlist, offerNext, acceptOffer }) {
  const freedAt = new Date('2026-11-16T08:00:00+07:00');
  const later = (minutes) => new Date(freedAt.getTime() + minutes * 60 * 1000);

  test('the first student joins at position 1 and the given queue is not changed', () => {
    const queue = [];
    expect(joinWaitlist(queue, { userId: 'an', holderId: 'chi' })).toEqual({ ok: true, position: 1, queue: [{ userId: 'an' }] });
    expect(queue).toEqual([]);                          // bất biến: mảng gốc giữ nguyên (M2)
  });

  test('at most 3 students wait: the 4th is refused with WAITLIST_FULL', () => {
    const three = [{ userId: 'a' }, { userId: 'b' }, { userId: 'c' }];
    expect(joinWaitlist(three, { userId: 'd', holderId: 'h' })).toEqual({ ok: false, code: 'WAITLIST_FULL' });
    expect(joinWaitlist(three.slice(0, 2), { userId: 'd', holderId: 'h' })).toMatchObject({ ok: true, position: 3 });
  });

  test('the holder of the slot and a student already waiting are refused', () => {
    expect(joinWaitlist([], { userId: 'chi', holderId: 'chi' })).toEqual({ ok: false, code: 'IS_HOLDER' });
    expect(joinWaitlist([{ userId: 'an' }], { userId: 'an', holderId: 'chi' })).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  test('a freed slot is offered to the FIRST in line, held for exactly 30 minutes', () => {
    const r = offerNext([{ userId: 'an' }, { userId: 'binh' }, { userId: 'chi' }], freedAt);
    expect(r.offer).toEqual({ userId: 'an', expiresAt: later(30) });
    expect(r.queue).toEqual([{ userId: 'binh' }, { userId: 'chi' }]);
  });

  test.each([
    [29, { ok: true }],
    [30, { ok: false, code: 'OFFER_EXPIRED' }],   // đúng lúc hết hạn là đã hết (M4: <=)
  ])('accepting %s minutes after the offer', (minutes, expected) => {
    const { offer } = offerNext([{ userId: 'an' }], freedAt);
    expect(acceptOffer(offer, later(minutes))).toEqual(expected);
  });
}`;

export default {
  course: { slug: 'testing' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — write the tests that catch the bugs',
        'Thi thực hành — viết bộ test bắt được lỗi',
      ),
      description: B(
        'Five questions on real LabFlow Lite code, submitted as a .zip. For each one you write a test suite that is green on the real code and red on six planted mutants: a slot checker (partitions and boundaries), a decision table with error classes, an async booking service with fakes and stubs, a cancellation rule with an injected clock and IDOR, and a waitlist that must not mutate its input — chapters 1, 2, 3, 4, 5, 10 and 11.',
        'Năm câu trên code thật của LabFlow Lite, nộp dưới dạng .zip. Mỗi câu bạn viết một bộ test xanh với code thật và đỏ với sáu đột biến cài sẵn: bộ kiểm khung giờ (phân vùng và giá trị biên), một bảng quyết định có lớp lỗi, service đặt lịch bất đồng bộ với fake và stub, luật huỷ lịch với đồng hồ tiêm vào và IDOR, và hàng chờ không được sửa dữ liệu đầu vào — các chương 1, 2, 3, 4, 5, 10 và 11.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 1 ─────────────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q1 — Partitions and boundaries for checkSlot (chapter 1).</b> ' + c('checkSlot(start, end)') + ' returns ' + c('{ ok: true, minutes }') + ' or ' + c('{ ok: false, code }') + '. Its rules, in the order the code checks them:</p>' +
            '<ul>' +
            '<li>BR-04: both times on the 30-minute grid, otherwise <code>OFF_GRID</code>;</li>' +
            '<li>the end must be after the start, otherwise <code>END_BEFORE_START</code>;</li>' +
            '<li>opening hours 07:00–21:00 — a slot may start at 07:00 and end at 21:00 — otherwise <code>OUTSIDE_HOURS</code>;</li>' +
            '<li>Lite-1: at most 4 hours (240 minutes), otherwise <code>TOO_LONG</code>;</li>' +
            '<li>a malformed time such as <code>7:00</code> throws a <code>TypeError</code> whose message says <code>expected HH:MM</code>.</li>' +
            '</ul>' +
            '<p>Six mutants are planted, each on one line of <code>build(mutant)</code>. Kill all six. The lesson-1.4 recipe works: every rule gets a case ON its boundary and one step past it — and remember that <code>minutes</code> is part of the contract too.</p>',
            '<p><b>Câu 1 — Phân vùng và giá trị biên cho checkSlot (chương 1).</b> ' + c('checkSlot(start, end)') + ' trả ' + c('{ ok: true, minutes }') + ' hoặc ' + c('{ ok: false, code }') + '. Các luật, theo đúng thứ tự code kiểm:</p>' +
            '<ul>' +
            '<li>BR-04: cả hai mốc nằm trên lưới 30 phút, nếu không là <code>OFF_GRID</code>;</li>' +
            '<li>giờ kết thúc phải sau giờ bắt đầu, nếu không là <code>END_BEFORE_START</code>;</li>' +
            '<li>giờ mở cửa 07:00–21:00 — được bắt đầu lúc 07:00 và kết thúc lúc 21:00 — nếu không là <code>OUTSIDE_HOURS</code>;</li>' +
            '<li>Lite-1: tối đa 4 giờ (240 phút), nếu không là <code>TOO_LONG</code>;</li>' +
            '<li>giờ sai định dạng như <code>7:00</code> ném <code>TypeError</code> có thông báo chứa <code>expected HH:MM</code>.</li>' +
            '</ul>' +
            '<p>Có sáu đột biến, mỗi cái nằm ở một dòng của <code>build(mutant)</code>. Diệt cả sáu. Công thức của bài 1.4 dùng được: mỗi luật một ca ĐÚNG TRÊN biên và một ca vừa vượt biên — và nhớ rằng <code>minutes</code> cũng là một phần của hợp đồng.</p>',
          ),
          starterCode: starter({ given: Q1_GIVEN, params: '{ checkSlot }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['boundaries', 'Each limit is tested on the boundary and one step past it: 07:00 start, 21:00 end, exactly 240 minutes allowed and 270 refused, equal start and end refused.', 'Mỗi giới hạn được thử đúng trên biên và vừa qua biên: bắt đầu 07:00, kết thúc 21:00, đúng 240 phút được và 270 phút bị từ chối, giờ bắt đầu bằng giờ kết thúc bị từ chối.', 0.8],
            ['grid', 'The grid rule is checked on BOTH times — an off-grid end is a separate case from an off-grid start.', 'Luật lưới được kiểm ở CẢ HAI mốc — giờ kết thúc lệch lưới là một ca riêng với giờ bắt đầu lệch lưới.', 0.4],
            ['exact', 'Results are compared whole with toEqual (including minutes), and the malformed time is checked with toThrow(TypeError) plus the message, not a bare toThrow().', 'Kết quả được so trọn bằng toEqual (kể cả minutes), và giờ sai định dạng được kiểm bằng toThrow(TypeError) kèm thông báo, không phải toThrow() trống.', 0.5],
            ['table', 'The many input/output pairs are written as one test.each table with readable rows.', 'Nhiều cặp đầu vào/đầu ra được viết thành một bảng test.each với các hàng dễ đọc.', 0.3],
          ]),
        }),

        /* ── Q2 · chương 1.4 ───────────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q2 — A full decision table, and the right error class (chapter 1).</b> BR-06: a booking needs approval when the user is a <code>STUDENT</code> and books <b>more than 30</b> seats; <code>LECTURER</code> and <code>ADMIN</code> never need approval. ' + c('needsApproval({ seats, role })') + ' throws a <code>RangeError</code> when seats is not a positive integer (0, a negative number, 2.5). ' + c('createBooking(...)') + ' returns the booking with status <code>PENDING</code> when approval is needed and <code>CONFIRMED</code> otherwise.</p>' +
            '<p>Write the decision table — how many rows does it need? — and pick seat values that also test the boundary in every row. Then pin the error class: one mutant throws a plain <code>Error</code> with the same message.</p>',
            '<p><b>Câu 2 — Một bảng quyết định đầy đủ, và đúng lớp lỗi (chương 1).</b> BR-06: một lượt đặt cần duyệt khi người dùng là <code>STUDENT</code> và đặt <b>hơn 30</b> chỗ; <code>LECTURER</code> và <code>ADMIN</code> không bao giờ cần duyệt. ' + c('needsApproval({ seats, role })') + ' ném <code>RangeError</code> khi seats không phải số nguyên dương (0, số âm, 2.5). ' + c('createBooking(...)') + ' trả về lượt đặt với status <code>PENDING</code> khi cần duyệt và <code>CONFIRMED</code> khi không.</p>' +
            '<p>Viết bảng quyết định — cần bao nhiêu hàng? — và chọn số chỗ sao cho hàng nào cũng thử luôn biên. Rồi ghim lớp lỗi: một đột biến ném <code>Error</code> thường với cùng thông báo.</p>',
          ),
          starterCode: starter({ given: Q2_GIVEN, params: '{ needsApproval, createBooking }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['table', 'All 6 combinations (3 roles × above/at the limit) are tested, with 30 and 31 seats so each row is also a boundary test.', 'Đủ 6 tổ hợp (3 vai × trên/đúng giới hạn), dùng 30 và 31 chỗ để hàng nào cũng là một phép thử biên.', 0.8],
            ['errors', 'Invalid seats (0, negative, non-integer) are each asserted with toThrow(RangeError), not a bare toThrow().', 'Số chỗ không hợp lệ (0, số âm, số lẻ) đều được khẳng định bằng toThrow(RangeError), không phải toThrow() trống.', 0.6],
            ['status', 'createBooking is checked for both statuses with exact values (toBe / toEqual), not toBeTruthy.', 'createBooking được kiểm cả hai trạng thái bằng giá trị cụ thể (toBe / toEqual), không phải toBeTruthy.', 0.6],
          ]),
        }),

        /* ── Q3 · chương 2 + 3 + 4 ─────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q3 — An async service with honest test doubles (chapters 2, 3 and 4).</b> ' + c('bookLab(repo, input)') + ' is async. It refuses a bad slot before touching the repository, asks ' + c('repo.findOverlap') + ' and refuses a clash with ' + c("BookingError('OVERLAP')") + ', stores <code>PENDING</code> for a student booking more than 30 seats, and turns a driver failure into ' + c("BookingError('STORAGE_DOWN', { cause })") + ' without ever calling <code>insert</code>. Since chapter 4 the database itself may refuse a racing insert with an <code>OVERLAP</code> BookingError — that one must pass through unchanged.</p>' +
            '<p>A fake <code>memoryRepo(rows)</code> is given; write your own stubs and spies where a fake cannot reach (a driver that throws, a racing insert). Await every assertion on a promise: an un-awaited <code>rejects</code> finishes after the test and counts as no assertion at all.</p>',
            '<p><b>Câu 3 — Một service bất đồng bộ với đồ đóng thế trung thực (chương 2, 3 và 4).</b> ' + c('bookLab(repo, input)') + ' là hàm async. Nó từ chối khung giờ sai trước khi chạm tới repository, hỏi ' + c('repo.findOverlap') + ' và từ chối lượt trùng bằng ' + c("BookingError('OVERLAP')") + ', lưu <code>PENDING</code> khi sinh viên đặt hơn 30 chỗ, và biến lỗi driver thành ' + c("BookingError('STORAGE_DOWN', { cause })") + ' mà không bao giờ gọi <code>insert</code>. Từ chương 4, chính CSDL có thể từ chối một lượt insert đang tranh chấp bằng một BookingError <code>OVERLAP</code> — lỗi đó phải đi qua nguyên vẹn.</p>' +
            '<p>Đề cho sẵn một fake <code>memoryRepo(rows)</code>; tự viết stub và spy ở những chỗ fake không với tới (driver ném lỗi, insert tranh chấp). Await mọi khẳng định trên promise: một <code>rejects</code> không await sẽ chạy xong SAU khi test kết thúc và bị tính là không có khẳng định nào.</p>',
          ),
          starterCode: starter({ given: Q3_GIVEN, params: '{ bookLab, BookingError }', mutants: ['M1', 'M2', 'M3', 'M4', 'M5'] }),
          expectedOutput: allKilled(['M1', 'M2', 'M3', 'M4', 'M5']),
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['async', 'Every promise assertion is awaited (await expect(…).rejects / resolves), so no verdict arrives after the test has ended.', 'Mọi khẳng định trên promise đều được await (await expect(…).rejects / resolves), nên không có phán quyết nào đến sau khi test đã kết thúc.', 0.5],
            ['codes', 'Errors are asserted by their stable code (OVERLAP, STORAGE_DOWN) and the driver message is checked on cause, not on the BookingError message.', 'Lỗi được khẳng định theo mã ổn định (OVERLAP, STORAGE_DOWN) và thông báo của driver được kiểm ở cause, không phải ở message của BookingError.', 0.6],
            ['doubles', 'The right double for each job: the fake repo for state (rows stored), a throwing stub for the driver failure, a spy only where "was not called" is the requirement.', 'Đúng loại đồ đóng thế cho từng việc: fake repo để kiểm trạng thái (các dòng đã lưu), stub ném lỗi cho driver hỏng, spy chỉ dùng ở chỗ yêu cầu chính là "không được gọi".', 0.6],
            ['passthrough', 'The chapter-4 case is there: an OVERLAP thrown by insert stays OVERLAP.', 'Có ca của chương 4: OVERLAP do insert ném ra vẫn phải là OVERLAP.', 0.3],
          ]),
        }),

        /* ── Q4 · chương 2 + 5 + 11 ────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q4 — Time is an input; a stranger sees 404 (chapters 2, 5 and 11).</b> ' + c('cancelDecision(booking, user, now)') + ' decides whether <code>user</code> may cancel <code>booking</code> at <code>now</code>:</p>' +
            '<ul>' +
            '<li>a missing booking, or one that belongs to someone else, is <code>NOT_FOUND</code> — never a different code, or the API tells strangers which ids exist (IDOR);</li>' +
            '<li>an <code>ADMIN</code> may cancel anyone\'s booking at any time — but a missing booking is still <code>NOT_FOUND</code>;</li>' +
            '<li>an already cancelled booking is <code>ALREADY_CANCELLED</code>;</li>' +
            '<li>Lite-3: the owner may cancel until <b>60 minutes</b> before the start (exactly 60 is still allowed), otherwise <code>TOO_LATE_TO_CANCEL</code>. Dates and starts are Viet Nam time.</li>' +
            '</ul>' +
            '<p>Pass fixed clocks — write them with <code>+07:00</code> so your tests give the same result on a laptop in Ha Noi and on a UTC server.</p>',
            '<p><b>Câu 4 — Thời gian là đầu vào; người lạ thấy 404 (chương 2, 5 và 11).</b> ' + c('cancelDecision(booking, user, now)') + ' quyết định <code>user</code> có được huỷ <code>booking</code> tại thời điểm <code>now</code> không:</p>' +
            '<ul>' +
            '<li>lượt đặt không tồn tại, hoặc của người khác, là <code>NOT_FOUND</code> — không bao giờ là mã khác, nếu không API sẽ cho người lạ biết id nào tồn tại (IDOR);</li>' +
            '<li><code>ADMIN</code> được huỷ lượt của bất kỳ ai vào bất cứ lúc nào — nhưng lượt không tồn tại vẫn là <code>NOT_FOUND</code>;</li>' +
            '<li>lượt đã huỷ là <code>ALREADY_CANCELLED</code>;</li>' +
            '<li>Lite-3: chủ lượt đặt được huỷ cho tới <b>60 phút</b> trước giờ bắt đầu (đúng 60 phút vẫn được), nếu không là <code>TOO_LATE_TO_CANCEL</code>. Ngày và giờ bắt đầu là giờ Việt Nam.</li>' +
            '</ul>' +
            '<p>Truyền đồng hồ cố định — viết kèm <code>+07:00</code> để test cho cùng kết quả trên laptop ở Hà Nội và trên máy chủ UTC.</p>',
          ),
          starterCode: starter({ given: Q4_GIVEN, params: '{ cancelDecision }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['clock', 'Time is controlled by passing fixed Date values with an explicit +07:00 offset; no new Date() without arguments, no waiting.', 'Thời gian được điều khiển bằng các giá trị Date cố định có ghi rõ +07:00; không new Date() trống, không chờ.', 0.4],
            ['boundary', 'The 60-minute limit is tested on the boundary and on both sides (61, 60, 59 minutes before a 09:00 start).', 'Giới hạn 60 phút được thử đúng trên biên và hai phía (61, 60, 59 phút trước giờ 09:00).', 0.6],
            ['idor', 'Another user\'s booking and a missing booking are both asserted as NOT_FOUND with toEqual — the code is the security property.', 'Lượt của người khác và lượt không tồn tại đều được khẳng định là NOT_FOUND bằng toEqual — chính mã lỗi là tính chất bảo mật.', 0.5],
            ['roles', 'The admin cases cover both "any time" and "missing booking", and ALREADY_CANCELLED has its own test.', 'Các ca admin phủ cả "bất cứ lúc nào" lẫn "lượt không tồn tại", và ALREADY_CANCELLED có test riêng.', 0.5],
          ]),
        }),

        /* ── Q5 · chương 10 ────────────────────────────────────────── */
        codeQ({
          points: 2,
          prompt: B(
            '<p><b>Q5 — Pin a waitlist before someone refactors it (chapter 10).</b> BR-09, the waitlist built test-first in lesson 10.1:</p>' +
            '<ul>' +
            '<li>' + c('joinWaitlist(queue, { userId, holderId })') + ' returns ' + c('{ ok: true, position, queue }') + ' with a <b>new</b> array — the queue it receives must not change. The holder of the slot gets <code>IS_HOLDER</code>, a student already in line gets <code>ALREADY_WAITING</code>, and at most <b>3</b> students may wait (<code>WAITLIST_FULL</code>);</li>' +
            '<li>' + c('offerNext(queue, now)') + ' offers the freed slot to the <b>first</b> student in line and holds it for <b>30 minutes</b>: the offer is ' + c('{ userId, expiresAt }') + ' and the rest of the queue keeps its order;</li>' +
            '<li>' + c('acceptOffer(offer, now)') + ' succeeds only strictly before <code>expiresAt</code>; at <code>expiresAt</code> it is <code>OFFER_EXPIRED</code>.</li>' +
            '</ul>' +
            '<p>Your suite is the safety net for the refactor that comes next: it must notice a changed limit, a mutated input, the wrong person offered the seat and an off-by-one on the expiry.</p>',
            '<p><b>Câu 5 — Ghim hàng chờ trước khi có người refactor nó (chương 10).</b> BR-09, hàng chờ dựng bằng TDD ở bài 10.1:</p>' +
            '<ul>' +
            '<li>' + c('joinWaitlist(queue, { userId, holderId })') + ' trả ' + c('{ ok: true, position, queue }') + ' với một mảng <b>mới</b> — hàng chờ nhận vào không được thay đổi. Người đang giữ chỗ nhận <code>IS_HOLDER</code>, sinh viên đã đứng trong hàng nhận <code>ALREADY_WAITING</code>, và tối đa <b>3</b> sinh viên được chờ (<code>WAITLIST_FULL</code>);</li>' +
            '<li>' + c('offerNext(queue, now)') + ' mời sinh viên <b>đầu hàng</b> nhận chỗ vừa trống và giữ chỗ <b>30 phút</b>: lời mời là ' + c('{ userId, expiresAt }') + ' và phần còn lại của hàng giữ nguyên thứ tự;</li>' +
            '<li>' + c('acceptOffer(offer, now)') + ' chỉ thành công khi còn TRƯỚC <code>expiresAt</code>; đúng lúc <code>expiresAt</code> là <code>OFFER_EXPIRED</code>.</li>' +
            '</ul>' +
            '<p>Bộ test của bạn là lưới an toàn cho đợt refactor sắp tới: nó phải nhận ra giới hạn bị đổi, dữ liệu đầu vào bị sửa, mời nhầm người, và lệch một đơn vị ở mốc hết hạn.</p>',
          ),
          starterCode: starter({ given: Q5_GIVEN, params: '{ joinWaitlist, offerNext, acceptOffer }', mutants: M6 }),
          expectedOutput: allKilled(M6),
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['immutable', 'A test keeps a reference to the given queue and asserts it is unchanged after joinWaitlist.', 'Có test giữ tham chiếu tới hàng chờ nhận vào và khẳng định nó không đổi sau joinWaitlist.', 0.5],
            ['limits', 'The limit of 3 is tested on both sides (the 3rd joins, the 4th is refused) and IS_HOLDER / ALREADY_WAITING each have a case.', 'Giới hạn 3 được thử hai phía (người thứ 3 vào được, người thứ 4 bị từ chối) và IS_HOLDER / ALREADY_WAITING đều có ca riêng.', 0.5],
            ['offer', 'offerNext is checked whole: who is offered, the exact expiresAt (now + 30 min) and the order of the rest.', 'offerNext được kiểm trọn: ai được mời, expiresAt chính xác (now + 30 phút) và thứ tự phần còn lại.', 0.5],
            ['expiry', 'acceptOffer is tested just before and exactly at expiresAt.', 'acceptOffer được thử ngay trước và đúng tại expiresAt.', 0.5],
          ]),
        }),
      ],
    },
  ],
};
