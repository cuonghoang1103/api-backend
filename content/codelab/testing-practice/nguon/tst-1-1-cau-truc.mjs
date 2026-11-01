/**
 * Testing · 1.1 — Giải phẫu một test (AAA). Loại `mutation`: người học viết src/rules/booking.test.js;
 * máy chấm chạy nó với booking.js ĐÚNG rồi với 5 đột biến của đề tst-cl-1-1 (content/courses/testing/_de-codelab-mutation.json).
 */
import { deTuKhoa, KHOA, TN } from './_chung.mjs';

const KHOI_DAU = `import { describe, it, expect } from 'vitest';
import { needsApproval, createBooking } from './booking.js';

// Four tests, all green on the correct code — and still weak.
// Run "Submit" and look at which mutants SURVIVE, then add the tests that kill them.
// Bốn test, đều xanh với code đúng — mà vẫn yếu. Bấm Nộp, xem đột biến nào CÒN SỐNG rồi thêm test diệt nó.

describe('needsApproval', () => {
  it('a student with 50 seats needs approval', () => {
    expect(needsApproval({ seats: 50, role: 'STUDENT' })).toBe(true);
  });

  it('a student with 10 seats does not need approval', () => {
    expect(needsApproval({ seats: 10, role: 'STUDENT' })).toBe(false);
  });

  it('a lecturer with 50 seats does not need approval', () => {
    expect(needsApproval({ seats: 50, role: 'LECTURER' })).toBe(false);
  });
});

describe('createBooking', () => {
  it('a 31-seat student booking waits for approval', () => {
    // Arrange
    const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };
    // Act
    const booking = createBooking(input);
    // Assert
    expect(booking.status).toBe('PENDING');
  });
});
`;

const LOI_GIAI = `import { describe, it, expect } from 'vitest';
import { needsApproval, createBooking } from './booking.js';

describe('needsApproval (BR-06: more than 30 seats; Lite-2: lecturers and admins never)', () => {
  // the boundary itself: 30 is NOT "more than 30" — kills ">" → ">="
  it('a student with exactly 30 seats does not need approval', () => {
    expect(needsApproval({ seats: 30, role: 'STUDENT' })).toBe(false);
  });

  it('a student with 31 seats needs approval', () => {
    expect(needsApproval({ seats: 31, role: 'STUDENT' })).toBe(true);
  });

  // every branch of the role rule gets its own test — kills "ADMIN dropped"
  it('a lecturer with 31 seats does not need approval', () => {
    expect(needsApproval({ seats: 31, role: 'LECTURER' })).toBe(false);
  });

  it('an admin with 31 seats does not need approval', () => {
    expect(needsApproval({ seats: 31, role: 'ADMIN' })).toBe(false);
  });

  // the invalid partition: 0 seats must be refused — kills "seats < 1" → "seats < 0"
  it('rejects 0 seats with a RangeError', () => {
    expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow(RangeError);
  });
});

describe('createBooking', () => {
  const base = { lab: 'BE-201', role: 'STUDENT', start: '08:00', end: '10:00' };

  // both outcomes of the status mapping — kills "statuses swapped"
  it('a 31-seat student booking waits for approval (PENDING)', () => {
    const booking = createBooking({ ...base, seats: 31 });
    expect(booking.status).toBe('PENDING');
  });

  it('a 20-seat student booking is CONFIRMED and keeps its slot', () => {
    const booking = createBooking({ ...base, seats: 20 });
    expect(booking).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });

  // an invalid slot must THROW its rule code — kills "return null instead of throwing"
  it('refuses a slot before opening time with OUTSIDE_HOURS', () => {
    expect(() => createBooking({ ...base, seats: 20, start: '06:30', end: '08:00' })).toThrow('OUTSIDE_HOURS');
  });
});
`;

export default {
  slug: 'tst-1-1-cau-truc',
  ten: '1.1 Anatomy of a test — approval & booking status',
  khoa: KHOA,
  baiHoc: 'tst-1-1-cau-truc',
  de: [
    deTuKhoa('tst-cl-1-1', {
      doKho: 'EASY', phut: 15,
      khaiNiem: ['Arrange–Act–Assert', 'describe / it / expect', 'mutation testing'],
      tienQuyet: ['tst-0-4-cai-dat'],
      the: ['vitest', 'unit-test', 'mutation', 'labflow-lite'],
      toiThieuTest: 4,
      moTa: {
        en: `<p>LabFlow Lite decides whether a lab booking needs approval. Read <code>src/rules/booking.js</code> (open it in the file tabs): <code>needsApproval({ seats, role })</code> implements <b>BR-06</b> — a booking of <b>more than 30 seats</b> needs approval — and <b>Lite-2</b> — <code>LECTURER</code> and <code>ADMIN</code> never need it; fewer than 1 seat (or a non-integer) throws a <code>RangeError</code>. <code>createBooking(input)</code> checks the time slot first (an invalid slot throws an <code>Error</code> whose message is the rule code, e.g. <code>OUTSIDE_HOURS</code>) and returns <code>{ lab, start, end, minutes, status }</code> with status <code>PENDING</code> or <code>CONFIRMED</code>.</p>
<p>This time <b>you do not write the code — you write the tests</b>, in <code>src/rules/booking.test.js</code>. The grader runs your tests against the correct <code>booking.js</code> (they must all pass), then against <b>5 mutants</b>: copies of <code>booking.js</code> with one planted bug each. A mutant is <b>killed</b> when at least one of your tests fails on it.</p>`,
        vi: `<p>LabFlow Lite quyết định một lượt đặt phòng lab có cần duyệt không. Đọc <code>src/rules/booking.js</code> (mở ở tab tệp): <code>needsApproval({ seats, role })</code> cài <b>BR-06</b> — đặt <b>trên 30 chỗ</b> thì cần duyệt — và <b>Lite-2</b> — <code>LECTURER</code> và <code>ADMIN</code> không bao giờ cần; dưới 1 chỗ (hoặc không phải số nguyên) ném <code>RangeError</code>. <code>createBooking(input)</code> kiểm khung giờ trước (khung sai ném <code>Error</code> mang mã luật, vd <code>OUTSIDE_HOURS</code>) rồi trả <code>{ lab, start, end, minutes, status }</code> với status <code>PENDING</code> hoặc <code>CONFIRMED</code>.</p>
<p>Lần này <b>bạn không viết code — bạn viết TEST</b>, trong <code>src/rules/booking.test.js</code>. Máy chấm chạy test của bạn với <code>booking.js</code> ĐÚNG (phải xanh hết), rồi với <b>5 đột biến</b>: các bản <code>booking.js</code> mỗi bản cài sẵn một lỗi. Đột biến bị <b>diệt</b> khi ít nhất một test của bạn đỏ với nó.</p>`,
      },
      yeuCau: {
        en: [
          'Write at least <b>4</b> tests with <code>describe</code> / <code>it</code> / <code>expect</code>, each in Arrange–Act–Assert shape.',
          'Every test passes on the correct code and contains at least one <code>expect</code> (a test without an assertion fails — <code>requireAssertions</code>).',
          'Kill <b>all 5</b> mutants. Editing <code>booking.js</code> changes nothing: the grader always uses the original.',
        ],
        vi: [
          'Viết ít nhất <b>4</b> test bằng <code>describe</code> / <code>it</code> / <code>expect</code>, mỗi test theo dáng Chuẩn bị–Hành động–Khẳng định.',
          'Mọi test xanh với code đúng và có ít nhất một <code>expect</code> (test không có khẳng định bị tính đỏ — <code>requireAssertions</code>).',
          'Diệt <b>cả 5</b> đột biến. Sửa <code>booking.js</code> không có tác dụng: máy chấm luôn dùng bản gốc.',
        ],
      },
      dauVao: { en: 'Your test file src/rules/booking.test.js (Vitest syntax).', vi: 'Tệp test src/rules/booking.test.js của bạn (cú pháp Vitest).' },
      dauRa: { en: 'Green on the correct code; red on each of the 5 mutants.', vi: 'Xanh với code đúng; đỏ với từng đột biến trong 5 đột biến.' },
      rangBuoc: [{ en: 'Imports: only "vitest" and ./booking.js (or ./time.js).', vi: 'Import: chỉ "vitest" và ./booking.js (hoặc ./time.js).' }],
      viDu: [{
        input: { en: "Mutant: return seats >= APPROVAL_SEATS;  (instead of >)", vi: 'Đột biến: return seats >= APPROVAL_SEATS;  (thay cho >)' },
        output: { en: "Killed by: expect(needsApproval({ seats: 30, role: 'STUDENT' })).toBe(false)", vi: "Bị diệt bởi: expect(needsApproval({ seats: 30, role: 'STUDENT' })).toBe(false)" },
        explanation: { en: 'With >= a 30-seat booking returns true, so this test goes red. A test with 50 seats passes on both versions — it cannot tell them apart.', vi: 'Với >= lượt 30 chỗ trả true nên test này đỏ. Test 50 chỗ thì xanh với cả hai bản — nó không phân biệt được.' },
      }],
      goiY: [
        { en: 'Submit the starter tests first and read the table: every surviving mutant names the rule your tests never looked at.', vi: 'Nộp bộ test khởi đầu trước rồi đọc bảng: mỗi đột biến còn sống chỉ đúng luật mà test của bạn chưa nhìn tới.' },
        { en: 'BR-06 says "more than 30": test 30 AND 31. Lite-2 lists two roles: test each one.', vi: 'BR-06 nói "trên 30": test 30 VÀ 31. Lite-2 liệt kê hai vai trò: test từng vai.' },
        { en: "Errors: expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow(RangeError) — wrap the call in a function.", vi: "Lỗi: expect(() => needsApproval({ seats: 0, role: 'STUDENT' })).toThrow(RangeError) — bọc lời gọi trong một hàm." },
      ],
      loiHayGap: [
        { en: 'Testing only "typical" values (10, 50 seats): both the correct code and the ">=" mutant agree on them, so the mutant survives.', vi: 'Chỉ test giá trị "điển hình" (10, 50 chỗ): code đúng và đột biến ">=" cho cùng kết quả nên đột biến sống sót.' },
        { en: 'Calling createBooking(badSlot) directly inside expect(...) — the error is thrown before expect runs and the test crashes on the correct code. Wrap it: expect(() => createBooking(badSlot)).toThrow(...).', vi: 'Gọi thẳng createBooking(khungSai) trong expect(...) — lỗi ném ra trước khi expect chạy, test đỏ ngay với code đúng. Phải bọc: expect(() => createBooking(khungSai)).toThrow(...).' },
        { en: 'A test with no expect "to check it does not crash" — it always passes, so it never kills anything (and requireAssertions marks it red).', vi: 'Test không có expect "để xem không lỗi" — luôn xanh nên không diệt được gì (và requireAssertions tính nó đỏ).' },
      ],
      giaiThich: {
        en: '<p>Each mutant changes exactly one decision in <code>booking.js</code>; a suite kills it only if some test <i>observes</i> that decision. The boundary test (30 seats) separates <code>&gt;</code> from <code>&gt;=</code>; one test per role covers both halves of <code>LECTURER || ADMIN</code>; checking both <code>PENDING</code> and <code>CONFIRMED</code> catches the swapped mapping; the 0-seat test covers the invalid partition; and asserting that an invalid slot <b>throws</b> catches the version that silently returns <code>null</code>. Coverage alone would not tell you this: the starter tests already execute almost every line.</p>',
        vi: '<p>Mỗi đột biến đổi đúng một quyết định trong <code>booking.js</code>; bộ test chỉ diệt được nó khi có test <i>quan sát</i> quyết định đó. Test biên (30 chỗ) tách <code>&gt;</code> khỏi <code>&gt;=</code>; mỗi vai trò một test phủ cả hai nửa của <code>LECTURER || ADMIN</code>; kiểm cả <code>PENDING</code> lẫn <code>CONFIRMED</code> bắt được bản đảo trạng thái; test 0 chỗ phủ vùng không hợp lệ; khẳng định khung giờ sai phải <b>ném lỗi</b> bắt được bản lặng lẽ trả <code>null</code>. Độ phủ một mình không nói được điều này: bộ test khởi đầu đã chạy qua gần hết các dòng.</p>',
      },
      thuatNgu: [TN.mutant, TN.killed, TN.assertion, TN.boundary],
      khoiDau: { 'src/rules/booking.test.js': KHOI_DAU },
      loiGiai: { 'src/rules/booking.test.js': LOI_GIAI },
      // gợi ý theo TỪNG đột biến (hiện khi nó còn sống) — khoá = `label` trong _de-codelab-mutation.json
      goiYDotBien: {
        'exactly 30 student seats needs approval': 'test the boundary itself: a STUDENT with exactly 30 seats must NOT need approval · test đúng biên: SV đặt đúng 30 chỗ KHÔNG cần duyệt',
        'ADMIN needs approval': 'Lite-2 names two roles — add a test for an ADMIN above 30 seats · Lite-2 có hai vai trò — thêm test ADMIN trên 30 chỗ',
        'statuses swapped': 'assert BOTH outcomes of createBooking: one PENDING and one CONFIRMED booking · khẳng định CẢ HAI kết quả của createBooking: một PENDING, một CONFIRMED',
        '0 seats accepted': 'the invalid partition: 0 seats must throw RangeError (wrap the call in () => …) · vùng không hợp lệ: 0 chỗ phải ném RangeError (bọc lời gọi trong () => …)',
        'invalid slot returns null instead of throwing': 'createBooking with a slot outside opening hours must throw — expect(() => createBooking(…)).toThrow(\'OUTSIDE_HOURS\') · khung giờ ngoài giờ mở cửa phải ném lỗi',
      },
    }),
  ],
};
