/**
 * SWT301 · LUYỆN LAB 2 — Unit test (Report 5.1 / Template_Unit Test Case): white-box + black-box + test script.
 * Đề trường: chọn một hàm (white-box: code của mình, C0 = C1 = 100%; black-box: từ Detail Design, tỉ lệ
 * Normal < 20% : Abnormal > 60% : Boundary > 20%), điền ma trận UTCID (Condition: precondition + input · Confirm:
 * Return / Exception / Log · Result: Type N/A/B, P/F, Defect ID), viết JUnit script, sheet Test Report.
 * Ở đây: hàm BookingService.reserveSeat của LabBook (giống LabFlow), đo C0/C1/độ phủ điều kiện THẬT, kiểm tỉ lệ
 * N/A/B, đo phủ phân vùng + biên theo Detail Design, chấm bộ test bằng 10 mutant, tính sheet Test Report.
 */
import { doiDau, KHOA, TESTKIT_JS, kiemPhu, kiemDotBien, kiemKhoa, preSo, svg, bangHtml, NOP_BAI, tn } from './_chung.mjs';

/* ═══════════════════════ Mã được test ═══════════════════════ */
const JAVA = `public String reserveSeat(String studentId, String labCode, int startHour, int duration, int bookedHours) {
    if (studentId == null || studentId.trim().isEmpty())
        throw new ValidationException("MSG01: Student ID is required");
    if (!LABS.contains(labCode))
        throw new ValidationException("MSG02: Lab not found");
    if (startHour < 7 || startHour > 20)
        throw new ValidationException("MSG03: Start hour must be from 7 to 20");
    if (duration < 1 || duration > 3)
        throw new ValidationException("MSG04: Duration must be 1 to 3 hours");
    if (startHour + duration > 21)
        throw new BusinessException("MSG05: Booking must end by 21:00");
    if (bookedHours < 0)
        throw new ValidationException("MSG06: Booked hours cannot be negative");
    if (bookedHours + duration >= 6)
        throw new BusinessException("MSG07: Weekly limit of 6 hours exceeded");
    return String.format("BK-%s-%02d00", labCode, startHour);
}`;
// Bản JS gắn đo — cùng 17 dòng với bản Java. Lỗi cài sẵn ở dòng 14 (>= thay vì >, trái Detail Design bước 7).
const DO = `function reserveSeat(studentId, labCode, startHour, duration, bookedHours) {
  $s('S1'); if ($d('D1', $c('D1.A', studentId == null) || $c('D1.B', String(studentId).trim() === '')))
    { $s('S2'); throw __ex('ValidationException', 'MSG01: Student ID is required'); }
  $s('S3'); if ($d('D2', ['LAB01', 'LAB02', 'LAB03'].indexOf(labCode) < 0))
    { $s('S4'); throw __ex('ValidationException', 'MSG02: Lab not found'); }
  $s('S5'); if ($d('D3', $c('D3.A', startHour < 7) || $c('D3.B', startHour > 20)))
    { $s('S6'); throw __ex('ValidationException', 'MSG03: Start hour must be from 7 to 20'); }
  $s('S7'); if ($d('D4', $c('D4.A', duration < 1) || $c('D4.B', duration > 3)))
    { $s('S8'); throw __ex('ValidationException', 'MSG04: Duration must be 1 to 3 hours'); }
  $s('S9'); if ($d('D5', startHour + duration > 21))
    { $s('S10'); throw __ex('BusinessException', 'MSG05: Booking must end by 21:00'); }
  $s('S11'); if ($d('D6', bookedHours < 0))
    { $s('S12'); throw __ex('ValidationException', 'MSG06: Booked hours cannot be negative'); }
  $s('S13'); if ($d('D7', bookedHours + duration >= 6))
    { $s('S14'); throw __ex('BusinessException', 'MSG07: Weekly limit of 6 hours exceeded'); }
  $s('S15'); return 'BK-' + labCode + '-' + String(startHour).padStart(2, '0') + '00';
}
function __ex(name, msg) { const e = new Error(msg); e.name = name; return e; }`;
function spec(studentId, labCode, startHour, duration, bookedHours) {
  const ex = (name, msg) => { const e = new Error(msg); e.name = name; return e; };
  if (studentId == null || String(studentId).trim() === '') throw ex('ValidationException', 'MSG01: Student ID is required');
  if (['LAB01', 'LAB02', 'LAB03'].indexOf(labCode) < 0) throw ex('ValidationException', 'MSG02: Lab not found');
  if (startHour < 7 || startHour > 20) throw ex('ValidationException', 'MSG03: Start hour must be from 7 to 20');
  if (duration < 1 || duration > 3) throw ex('ValidationException', 'MSG04: Duration must be 1 to 3 hours');
  if (startHour + duration > 21) throw ex('BusinessException', 'MSG05: Booking must end by 21:00');
  if (bookedHours < 0) throw ex('ValidationException', 'MSG06: Booked hours cannot be negative');
  if (bookedHours + duration > 6) throw ex('BusinessException', 'MSG07: Weekly limit of 6 hours exceeded');
  return 'BK-' + labCode + '-' + String(startHour).padStart(2, '0') + '00';
}
function loai(i) {
  const ok = (() => { try { __spec(i.studentId, i.labCode, i.startHour, i.duration, i.bookedHours); return true; } catch (e) { return false; } })(); // __spec = đặc tả trong bộ kiểm
  if (!ok) return ['A'];
  const bien = i.startHour === 7 || i.startHour === 20 || i.duration === 1 || i.duration === 3 || i.startHour + i.duration === 21 || i.bookedHours + i.duration === 6 || i.bookedHours === 0;
  return bien ? ['B'] : ['N'];
}
function nhan(i, e) {
  const t = [];
  const m = e && typeof e === 'object' && e.message ? String(e.message).slice(0, 5) : null;
  if (m === 'MSG01') t.push(i.studentId == null ? 'E_SID_NULL' : 'E_SID_BLANK');
  if (m === 'MSG02') t.push('E_LAB');
  if (m === 'MSG03') { t.push(i.startHour < 7 ? 'E_START_LOW' : 'E_START_HIGH'); if (i.startHour === 6) t.push('B_S6'); if (i.startHour === 21) t.push('B_S21'); }
  if (m === 'MSG04') { t.push(i.duration < 1 ? 'E_DUR_LOW' : 'E_DUR_HIGH'); if (i.duration === 0) t.push('B_D0'); if (i.duration === 4) t.push('B_D4'); }
  if (m === 'MSG05') { t.push('E_END'); if (i.startHour + i.duration === 22) t.push('B_END22'); }
  if (m === 'MSG06') { t.push('E_BOOKED_NEG'); if (i.bookedHours === -1) t.push('B_BKM1'); }
  if (m === 'MSG07') { t.push('E_WEEK'); if (i.bookedHours + i.duration === 7) t.push('B_W7'); }
  if (typeof e === 'string') {
    t.push('E_VALID');
    if (i.startHour === 7) t.push('B_S7'); if (i.startHour === 20) t.push('B_S20');
    if (i.duration === 1) t.push('B_D1'); if (i.duration === 3) t.push('B_D3');
    if (i.startHour + i.duration === 21) t.push('B_END21');
    if (i.bookedHours + i.duration === 6) t.push('B_W6');
    if (i.bookedHours === 0) t.push('B_BK0');
  }
  return t;
}

const CFG = svg({
  w: 620, h: 560, tieuDe: 'CFG of reserveSeat — 7 decisions, V(G) = 7 + 1 = 8',
  nut: [
    { id: 'st', x: 230, y: 38, hinh: 'dau', nhan: '' },
    ...[2, 4, 6, 8, 10, 12, 14].map((l, i) => ({ id: `d${l}`, x: 230, y: 82 + i * 62, hinh: 'thoi', nhan: `L${l}`, rong: 80, cao: 40 })),
    ...[3, 5, 7, 9, 11, 13, 15].map((l, i) => ({ id: `r${l}`, x: 470, y: 82 + i * 62, hinh: 'chu', nhan: `L${l} throw MSG0${i + 1}`, rong: 170 })),
    { id: 'r16', x: 230, y: 520, hinh: 'chu', nhan: 'L16 return "BK-…"', rong: 150 },
  ],
  canh: [
    { tu: 'st', den: 'd2' },
    ...[2, 4, 6, 8, 10, 12, 14].flatMap((l, i, a) => [
      { tu: `d${l}`, den: `r${l + 1}`, nhan: 'T' },
      { tu: `d${l}`, den: i < a.length - 1 ? `d${a[i + 1]}` : 'r16', nhan: 'F' },
    ]),
  ],
});
const DD = `Class    : BookingService                         Function code : LBK_UT_01
Method   : String reserveSeat(String studentId, String labCode, int startHour, int duration, int bookedHours)
Purpose  : reserve a lab seat for a student; bookedHours = hours the student already booked this week
Steps (stop at the first failing step)
  1. studentId null or blank          → ValidationException  "MSG01: Student ID is required"
  2. labCode not LAB01 / LAB02 / LAB03 → ValidationException  "MSG02: Lab not found"
  3. startHour < 7 or > 20             → ValidationException  "MSG03: Start hour must be from 7 to 20"
  4. duration < 1 or > 3               → ValidationException  "MSG04: Duration must be 1 to 3 hours"
  5. startHour + duration > 21         → BusinessException    "MSG05: Booking must end by 21:00"
  6. bookedHours < 0                   → ValidationException  "MSG06: Booked hours cannot be negative"
  7. bookedHours + duration > 6        → BusinessException    "MSG07: Weekly limit of 6 hours exceeded"
  8. return "BK-" + labCode + "-" + startHour (2 digits) + "00"      e.g.  "BK-LAB01-0900"`;

/* ═══════════════════════ Tệp trả lời ═══════════════════════ */
const u = (id, studentId, labCode, startHour, duration, bookedHours, expected, type, status) => ({ id, input: { studentId, labCode, startHour, duration, bookedHours }, expected, type, ...(status ? { status } : {}) });
const ex = (throws, message) => ({ throws, message });
const fmtU = (x) => `  { id: '${x.id}', input: { studentId: ${x.input.studentId === null ? 'null' : `'${x.input.studentId}'`}, labCode: ${x.input.labCode === null ? 'null' : `'${x.input.labCode}'`}, startHour: ${x.input.startHour}, duration: ${x.input.duration}, bookedHours: ${x.input.bookedHours} },
    expected: ${typeof x.expected === 'string' ? `'${x.expected}'` : `{ throws: '${x.expected.throws}', message: '${x.expected.message}' }`}, type: '${x.type}'${x.status ? `, status: '${x.status}'` : ''} },`;
const WB = [
  u('UTCID01', null, 'LAB01', 9, 2, 0, ex('ValidationException', 'MSG01'), 'A', 'P'),
  u('UTCID02', '   ', 'LAB01', 9, 2, 0, ex('ValidationException', 'MSG01'), 'A', 'P'),
  u('UTCID03', 'SE180001', 'LAB09', 9, 2, 0, ex('ValidationException', 'MSG02'), 'A', 'P'),
  u('UTCID04', 'SE180001', 'LAB01', 6, 2, 0, ex('ValidationException', 'MSG03'), 'A', 'P'),
  u('UTCID05', 'SE180001', 'LAB01', 21, 1, 0, ex('ValidationException', 'MSG03'), 'A', 'P'),
  u('UTCID06', 'SE180001', 'LAB01', 9, 0, 0, ex('ValidationException', 'MSG04'), 'A', 'P'),
  u('UTCID07', 'SE180001', 'LAB01', 9, 4, 0, ex('ValidationException', 'MSG04'), 'A', 'P'),
  u('UTCID08', 'SE180001', 'LAB01', 19, 3, 0, ex('BusinessException', 'MSG05'), 'A', 'P'),
  u('UTCID09', 'SE180001', 'LAB01', 9, 2, -1, ex('ValidationException', 'MSG06'), 'A', 'P'),
  u('UTCID10', 'SE180001', 'LAB01', 9, 2, 5, ex('BusinessException', 'MSG07'), 'A', 'P'),
  u('UTCID11', 'SE180001', 'LAB02', 14, 2, 1, 'BK-LAB02-1400', 'N', 'P'),
  u('UTCID12', 'SE180001', 'LAB01', 9, 2, 4, 'BK-LAB01-0900', 'B', 'F'),
];
const BB = [
  u('UTCID01', null, 'LAB01', 9, 2, 0, ex('ValidationException', 'MSG01'), 'A'),
  u('UTCID02', '', 'LAB01', 9, 2, 0, ex('ValidationException', 'MSG01'), 'A'),
  u('UTCID03', 'SE180001', 'LAB99', 9, 2, 0, ex('ValidationException', 'MSG02'), 'A'),
  u('UTCID04', 'SE180001', 'LAB01', 6, 2, 0, ex('ValidationException', 'MSG03'), 'A'),
  u('UTCID05', 'SE180001', 'LAB01', 21, 1, 0, ex('ValidationException', 'MSG03'), 'A'),
  u('UTCID06', 'SE180001', 'LAB01', 9, 0, 0, ex('ValidationException', 'MSG04'), 'A'),
  u('UTCID07', 'SE180001', 'LAB01', 9, 4, 0, ex('ValidationException', 'MSG04'), 'A'),
  u('UTCID08', 'SE180001', 'LAB01', 19, 3, 0, ex('BusinessException', 'MSG05'), 'A'),
  u('UTCID09', 'SE180001', 'LAB01', 9, 2, -1, ex('ValidationException', 'MSG06'), 'A'),
  u('UTCID10', 'SE180001', 'LAB01', 9, 2, 5, ex('BusinessException', 'MSG07'), 'A'),
  u('UTCID11', 'SE180001', 'LAB01', 7, 1, 0, 'BK-LAB01-0700', 'B'),
  u('UTCID12', 'SE180001', 'LAB02', 18, 3, 3, 'BK-LAB02-1800', 'B'),
  u('UTCID13', 'SE180001', 'LAB03', 20, 1, 2, 'BK-LAB03-2000', 'B'),
  u('UTCID14', 'SE180001', 'LAB02', 14, 2, 1, 'BK-LAB02-1400', 'N'),
];
const DAU_WB = `// PART 1 — WHITE-BOX: one object per UTCID column of the function sheet "reserveSeat" (Report 5.1).
// input = the Condition block · expected = the Confirm block (Return value, or { throws: 'ExceptionClass', message: 'MSGxx' })
// type = N / A / B · status = P / F after running the CODE shown in the brief.
const WHITE_BOX = [
${fmtU(WB[0])}
];
`;
const GIAI_WB = `// PART 1 — WHITE-BOX (12 UTCIDs). C0 = C1 = 100% and every atomic condition is both TRUE and FALSE:
//  null AND blank student id (line 2), < 7 AND > 20 (line 6), < 1 AND > 3 (line 8).
// UTCID12: bookedHours 4 + duration 2 = 6 is ALLOWED by the Detail Design (step 7 says > 6) but the code (line 14, >=)
// throws MSG07 → status F, Defect: "LBK-BUG-01 line 14 uses >= instead of >".
const WHITE_BOX = [
${WB.map(fmtU).join('\n')}
];
`;
const DAU_BB = `// PART 2 — BLACK-BOX from the Detail Design only (do not look at the code).
// Rule of Lab 2 (functional): Normal < 20%, Abnormal > 60%, Boundary > 20% of the UTCIDs.
const BLACK_BOX = [
${fmtU(BB[13])}
];
`;
const GIAI_BB = `// PART 2 — BLACK-BOX (14 UTCIDs): 10 Abnormal (every message, both sides of every range) = 71.4%,
// 3 Boundary (valid edges 7 / 20 / 1 / 3 / end 21:00 / weekly total 6 / bookedHours 0) = 21.4%, 1 Normal = 7.1%.
const BLACK_BOX = [
${BB.map(fmtU).join('\n')}
];
`;
const DAU_TEST = `// PART 3 — the unit-test script (JUnit-like, in JavaScript). Call reserveSeat(...) INSIDE each test:
// the grader runs your tests against the correct implementation and against 10 faulty versions (mutants).
// Exceptions: expect(() => reserveSeat(...)).toThrow('MSG03')  ·  values: expect(reserveSeat(...)).toBe('BK-LAB01-0900')
describe('BookingService.reserveSeat', () => {
  test('a normal booking returns the booking code', () => {
    expect(reserveSeat('SE180001', 'LAB02', 14, 2, 1)).toBe('BK-LAB02-1400');
  });
});
`;
const GIAI_TEST = `// PART 3 — unit tests derived from the Detail Design: every message, both sides of every boundary, the result format.
// (JUnit 5 equivalent: @ParameterizedTest + @CsvSource for the ranges, assertThrows(...) for the exceptions.)
describe('BookingService.reserveSeat', () => {
  describe('valid bookings', () => {
    test.each([
      ['SE180001', 'LAB02', 14, 2, 1, 'BK-LAB02-1400'],   // normal
      ['SE180001', 'LAB01', 7, 1, 0, 'BK-LAB01-0700'],    // earliest start, shortest duration, zero hours booked
      ['SE180001', 'LAB03', 20, 1, 0, 'BK-LAB03-2000'],   // latest start, ends exactly at 21:00
      ['SE180001', 'LAB02', 18, 3, 3, 'BK-LAB02-1800'],   // longest duration, ends at 21:00, weekly total exactly 6
    ])('reserveSeat(%s, %s, %i, %i, %i) = %s', (sid, lab, start, dur, booked, code) => {
      expect(reserveSeat(sid, lab, start, dur, booked)).toBe(code);
    });
  });

  describe('validation errors', () => {
    test.each([
      [null, 'LAB01', 9, 2, 0, 'MSG01'],
      ['   ', 'LAB01', 9, 2, 0, 'MSG01'],
      ['SE180001', 'LAB99', 9, 2, 0, 'MSG02'],
      ['SE180001', 'LAB01', 6, 2, 0, 'MSG03'],
      ['SE180001', 'LAB01', 21, 1, 0, 'MSG03'],
      ['SE180001', 'LAB01', 9, 0, 0, 'MSG04'],
      ['SE180001', 'LAB01', 9, 4, 0, 'MSG04'],
      ['SE180001', 'LAB01', 9, 2, -1, 'MSG06'],
    ])('reserveSeat(%p, %p, %i, %i, %i) throws ValidationException %s', (sid, lab, start, dur, booked, msg) => {
      expect(() => reserveSeat(sid, lab, start, dur, booked)).toThrow(ValidationException);
      expect(() => reserveSeat(sid, lab, start, dur, booked)).toThrow(msg);
    });
    test('the start hour is checked before the duration', () => {
      expect(() => reserveSeat('SE180001', 'LAB01', 6, 0, 0)).toThrow('MSG03');
    });
  });

  describe('business rules', () => {
    test('a booking must end by 21:00', () => {
      expect(() => reserveSeat('SE180001', 'LAB01', 19, 3, 0)).toThrow(BusinessException);
      expect(() => reserveSeat('SE180001', 'LAB01', 19, 3, 0)).toThrow('MSG05');
    });
    test('the weekly limit allows exactly 6 hours and refuses 7', () => {
      expect(reserveSeat('SE180001', 'LAB01', 9, 2, 4)).toBe('BK-LAB01-0900');
      expect(() => reserveSeat('SE180001', 'LAB01', 9, 2, 5)).toThrow(BusinessException);
      expect(() => reserveSeat('SE180001', 'LAB01', 9, 2, 5)).toThrow('MSG07');
    });
  });
});
`;
const DAU_REPORT = `// PART 4 — the "Test Report" sheet of Report 5.1 for the three functions in the brief.
const REPORT = {
  passed: 0, failed: 0, untested: 0, normal: 0, abnormal: 0, boundary: 0, total: 0,
  testCoverage: 0,        // %, 2 decimals
  successfulCoverage: 0,  // %, 2 decimals
  normalPct: 0, abnormalPct: 0, boundaryPct: 0,
  lackReserveSeat: 0,     // "Lack of test cases" of the reserveSeat sheet
};
`;
const GIAI_REPORT = `// PART 4 — Test Report sheet (Report 5.1). Note: 5.1 divides by Total (no N/A column, unlike 5.2 / 5.3).
const REPORT = {
  passed: 24, failed: 3, untested: 3,        // 12+8+4 · 1+2+0 · 1+0+2
  normal: 6, abnormal: 18, boundary: 6, total: 30,
  testCoverage: 90.0,                        // (24 + 3) × 100 / 30
  successfulCoverage: 80.0,                  // 24 × 100 / 30
  normalPct: 20.0, abnormalPct: 60.0, boundaryPct: 20.0,
  lackReserveSeat: -12.3,                    // LOC × norm / 1000 − Total = 17 × 100 / 1000 − 14
};
`;
// Lớp exception dùng chung cho tests.js — người học gọi toThrow(ValidationException).
const LIB_SUT = `/* lib/sut.js — NOT a file you edit. Declares the exception classes your tests may use:
 *   expect(() => reserveSeat(...)).toThrow(ValidationException)
 * The grader injects reserveSeat (correct version or a mutant) as a global before each run. */
class ValidationException extends Error { constructor(m) { super(m); this.name = 'ValidationException'; } }
class BusinessException extends Error { constructor(m) { super(m); this.name = 'BusinessException'; } }
`;

/* ═══════════════════════ Bộ kiểm ═══════════════════════ */
const DUNG = `function reserveSeat(studentId, labCode, startHour, duration, bookedHours) {
  if (studentId == null || String(studentId).trim() === '') throw new ValidationException('MSG01: Student ID is required');
  if (['LAB01', 'LAB02', 'LAB03'].indexOf(labCode) < 0) throw new ValidationException('MSG02: Lab not found');
  if (startHour < 7 || startHour > 20) throw new ValidationException('MSG03: Start hour must be from 7 to 20');
  if (duration < 1 || duration > 3) throw new ValidationException('MSG04: Duration must be 1 to 3 hours');
  if (startHour + duration > 21) throw new BusinessException('MSG05: Booking must end by 21:00');
  if (bookedHours < 0) throw new ValidationException('MSG06: Booked hours cannot be negative');
  if (bookedHours + duration > 6) throw new BusinessException('MSG07: Weekly limit of 6 hours exceeded');
  return 'BK-' + labCode + '-' + String(startHour).padStart(2, '0') + '00';
}`;
const doiDong = (tu, sang) => { if (!DUNG.includes(tu)) throw new Error(`mutant: không thấy "${tu}"`); return DUNG.replace(tu, sang); };
const DOT_BIEN = [
  { ma: 'M1', moTa: { en: 'a blank student id ("   ") is accepted', vi: 'mã sinh viên toàn khoảng trắng được chấp nhận' }, code: doiDong("String(studentId).trim() === ''", "studentId === ''") },
  { ma: 'M2', moTa: { en: 'start hour 21 is accepted (> 21 instead of > 20)', vi: 'giờ bắt đầu 21 được chấp nhận (> 21 thay vì > 20)' }, code: doiDong('startHour > 20', 'startHour > 21') },
  { ma: 'M3', moTa: { en: 'duration 0 is accepted (< 0 instead of < 1)', vi: 'thời lượng 0 được chấp nhận (< 0 thay vì < 1)' }, code: doiDong('duration < 1', 'duration < 0') },
  { ma: 'M4', moTa: { en: 'a booking ending exactly at 21:00 is refused (>= 21)', vi: 'booking kết thúc đúng 21:00 bị từ chối (>= 21)' }, code: doiDong('startHour + duration > 21', 'startHour + duration >= 21') },
  { ma: 'M5', moTa: { en: 'a weekly total of exactly 6 hours is refused (>= 6) — the defect of the code in Part 1', vi: 'tổng đúng 6 giờ/tuần bị từ chối (>= 6) — chính lỗi của mã ở Phần 1' }, code: doiDong('bookedHours + duration > 6', 'bookedHours + duration >= 6') },
  { ma: 'M6', moTa: { en: 'negative bookedHours is not rejected', vi: 'bookedHours âm không bị từ chối' }, code: doiDong("if (bookedHours < 0) throw new ValidationException('MSG06: Booked hours cannot be negative');", '') },
  { ma: 'M7', moTa: { en: 'the booking code is not zero-padded ("BK-LAB01-900")', vi: 'mã booking không thêm số 0 ("BK-LAB01-900")' }, code: doiDong("String(startHour).padStart(2, '0')", 'String(startHour)') },
  { ma: 'M8', moTa: { en: 'MSG05 is thrown as a ValidationException', vi: 'MSG05 bị ném bằng ValidationException' }, code: doiDong("throw new BusinessException('MSG05", "throw new ValidationException('MSG05") },
  { ma: 'M9', an: true, moTa: { en: 'LAB03 is missing from the lab list', vi: 'thiếu LAB03 trong danh sách phòng' }, code: doiDong("['LAB01', 'LAB02', 'LAB03']", "['LAB01', 'LAB02']") },
  { ma: 'M10', an: true, moTa: { en: 'duration is validated before the start hour', vi: 'kiểm thời lượng trước giờ bắt đầu' }, code: DUNG.replace(/(  if \(startHour < 7[^\n]*\n)(  if \(duration < 1[^\n]*\n)/, '$2$1') },
];
if (DOT_BIEN[9].code === DUNG) throw new Error('M10 không đổi được');

const PHU_BB = [
  ['E_SID_NULL', 'null student id', 'f4'], ['E_SID_BLANK', 'empty / blank student id', 'f4'], ['E_LAB', 'unknown lab code', 'f4'],
  ['E_START_LOW', 'start hour below 7', 'f4'], ['E_START_HIGH', 'start hour above 20', 'f4'], ['E_DUR_LOW', 'duration below 1', 'f4'],
  ['E_DUR_HIGH', 'duration above 3', 'f4'], ['E_END', 'ends after 21:00', 'f4'], ['E_BOOKED_NEG', 'negative booked hours', 'f4'],
  ['E_WEEK', 'weekly limit exceeded', 'f4'], ['E_VALID', 'a valid reservation', 'f4'],
  ['B_S6', 'start hour 6', 'f4'], ['B_S7', 'start hour 7', 'f4'], ['B_S20', 'start hour 20', 'f4'], ['B_S21', 'start hour 21', 'f4'],
  ['B_D0', 'duration 0', 'f4'], ['B_D1', 'duration 1', 'f4'], ['B_D3', 'duration 3', 'f4'], ['B_D4', 'duration 4', 'f4'],
  ['B_END21', 'ends exactly at 21:00 (valid)', 'f4'], ['B_END22', 'ends at 22:00 (invalid)', 'f4'],
  ['B_W6', 'weekly total exactly 6 (valid)', 'f4'], ['B_W7', 'weekly total 7 (invalid)', 'f4'],
  ['B_BK0', 'bookedHours = 0', 'f4', true], ['B_BKM1', 'bookedHours = −1', 'f4', true],
].map(([ma, ten, nhom, an]) => ({ ma, ten, nhom, ...(an ? { an: true } : {}) }));

const thamSo = ['studentId', 'labCode', 'startHour', 'duration', 'bookedHours'];
const KIEM = [
  ...kiemPhu({
    code: DO, ham: 'reserveSeat', thamSo, spec: spec.toString(), bien: 'WHITE_BOX',
    do: { lenh: true, nhanh: true, dieuKien: true, toiDa: 15, kyVong: true, loai: loai.toString(), trangThai: true },
    nhom: { lenh: 'f1', nhanh: 'f1', dieuKien: 'f1', toiDa: 'f2', kyVong: 'f2', loai: 'f2', trangThai: 'f2' },
  }),
  ...kiemPhu({
    code: DO, ham: 'reserveSeat', thamSo, spec: spec.toString(), bien: 'BLACK_BOX',
    do: { lenh: false, nhanh: false, kyVong: true, loai: loai.toString(), tiLe: true },
    nhom: { kyVong: 'f3', loai: 'f3', tiLe: 'f3' },
    phuNhan: { nhan: nhan.toString(), can: PHU_BB, tieuDe: { en: 'Black-box partition / boundary', vi: 'Phân vùng / biên hộp đen' } },
  }),
  ...kiemDotBien({ ten: ['reserveSeat'], dung: DUNG, dotBien: DOT_BIEN, minTest: 10, nhom: 'f5' }),
  ...kiemKhoa([
    ['REPORT.passed', 24, 'Passed'], ['REPORT.failed', 3, 'Failed'], ['REPORT.untested', 3, 'Untested'], ['REPORT.total', 30, 'Total test cases'],
    ['REPORT.normal', 6, 'Normal cases'], ['REPORT.abnormal', 18, 'Abnormal cases'], ['REPORT.boundary', 6, 'Boundary cases'],
    ['REPORT.testCoverage', 90, 'Test coverage %'], ['REPORT.successfulCoverage', 80, 'Test successful coverage %'],
    ['REPORT.normalPct', 20, 'Normal %'], ['REPORT.abnormalPct', 60, 'Abnormal %'], ['REPORT.boundaryPct', 20, 'Boundary %'],
    ['REPORT.lackReserveSeat', -12.3, 'Lack of test cases (reserveSeat)'],
  ].map(([bieuThuc, gt, ten]) => ({ moTa: { en: `Test Report — ${ten}`, vi: `Test Report — ${ten}` }, bieuThuc, chap: [gt], kieu: 'so', saiSo: 0.006, nhom: 'f6' }))),
];

const BANG_BAO_CAO = bangHtml(['Function sheet', 'LOC', 'Passed', 'Failed', 'Untested', 'N', 'A', 'B', 'Total'], [
  ['reserveSeat', '17', '12', '1', '1', '2', '9', '3', '14'], ['cancelSeat', '25', '8', '2', '0', '2', '6', '2', '10'], ['listMyBookings', '12', '4', '0', '2', '2', '3', '1', '6'],
]);
const MAU_LUOI = bangHtml(['', '', 'UTCID01', 'UTCID02', '…'], [
  ['Condition', 'studentId = null', 'O', '', ''], ['', 'studentId = "SE180001"', '', 'O', ''], ['', 'labCode = "LAB01"', 'O', 'O', ''], ['', '…', '', '', ''],
  ['Confirm', 'Return "BK-LAB01-0900"', '', 'O', ''], ['', 'Exception ValidationException MSG01', 'O', '', ''],
  ['Result', 'Type (N/A/B)', 'A', 'N', ''], ['', 'Passed/Failed', 'P', 'P', ''], ['', 'Defect ID', '', '', ''],
]);

const BAN_IN = {
  tieuDe: 'Lab 2 Practice — Unit Test Report 5.1 for BookingService.reserveSeat',
  phu: { en: 'SWT301 Lab 2 format (Template_Unit Test Case · white-box C0/C1 + black-box N:A:B + JUnit-style script + Test Report) · 10 marks', vi: 'Định dạng Lab 2 SWT301 (Template_Unit Test Case · white-box C0/C1 + black-box N:A:B + script kiểu JUnit + Test Report) · 10 điểm' },
  moTa: {
    en: `<p>Lab 2 tests ONE unit and records it in the Unit Test Case template (Report 5.1): one function sheet, one <b>column per test case</b> (UTCID01, UTCID02…), the <b>Condition</b> block (precondition + inputs), the <b>Confirm</b> block (return value, exception, log message) and the <b>Result</b> block (Type N/A/B, Passed/Failed, Defect ID). The white-box variant must reach <b>C0 = C1 = 100%</b>; the black-box variant is designed from the Detail Design only and must respect <b>Normal &lt; 20% · Abnormal &gt; 60% · Boundary &gt; 20%</b>.</p>
<p>The unit is <code>BookingService.reserveSeat</code> of LabBook (the same kind of method your team tests in LabFlow). Everything is graded for real: your white-box columns are executed on instrumented code, your black-box columns are checked against the Detail Design, your test script must kill 10 faulty versions, and your Test Report numbers are recomputed.</p>
<h3>Detail Design (test basis of the black-box part)</h3><pre>${DD.replace(/</g, '&lt;')}</pre>
<h3>A function sheet (how one object of the answer files maps to the template)</h3>${MAU_LUOI}`,
    vi: `<p>Lab 2 kiểm thử MỘT unit và ghi vào template Unit Test Case (Report 5.1): mỗi hàm một sheet, mỗi <b>test case một cột</b> (UTCID01, UTCID02…), khối <b>Condition</b> (tiền điều kiện + input), khối <b>Confirm</b> (giá trị trả về, exception, log) và khối <b>Result</b> (Type N/A/B, Passed/Failed, Defect ID). Biến thể white-box phải đạt <b>C0 = C1 = 100%</b>; biến thể black-box chỉ dựa Detail Design và phải giữ <b>Normal &lt; 20% · Abnormal &gt; 60% · Boundary &gt; 20%</b>.</p>
<p>Unit là <code>BookingService.reserveSeat</code> của LabBook (cùng kiểu hàm nhóm bạn test trong LabFlow). Mọi thứ chấm thật: các cột white-box chạy trên mã đã gắn đo, các cột black-box đối chiếu Detail Design, script test phải giết 10 bản lỗi, số liệu Test Report được tính lại.</p>
<h3>Detail Design (cơ sở test của phần black-box)</h3><pre>${DD.replace(/</g, '&lt;')}</pre>
<h3>Một sheet hàm (mỗi object trong tệp trả lời ứng với template thế nào)</h3>${MAU_LUOI}`,
  },
  chucNangChinh: [
    { en: 'Part 1 — white-box UTCID grid on the code (C0, C1 and condition coverage = 100%).', vi: 'Phần 1 — lưới UTCID white-box trên mã (C0, C1 và độ phủ điều kiện = 100%).' },
    { en: 'Part 2 — black-box UTCID grid from the Detail Design (EP + BVA, N:A:B ratio).', vi: 'Phần 2 — lưới UTCID black-box từ Detail Design (EP + BVA, tỉ lệ N:A:B).' },
    { en: 'Part 3 — the unit-test script (JUnit-style) that kills 10 mutants.', vi: 'Phần 3 — script unit test (kiểu JUnit) giết 10 mutant.' },
    { en: 'Part 4 — the Test Report sheet.', vi: 'Phần 4 — sheet Test Report.' },
  ],
  yeuCauChung: [
    { en: 'Expected values (Confirm block) come from the Detail Design. A column whose code result differs is <b>F</b> and gets a Defect ID.', vi: 'Giá trị mong đợi (khối Confirm) lấy từ Detail Design. Cột có kết quả mã khác đi là <b>F</b> và có Defect ID.' },
    { en: 'Exceptions are written <code>{ throws: \'ValidationException\', message: \'MSG03\' }</code> (class + message ID, like the template’s Exception row).', vi: 'Exception ghi <code>{ throws: \'ValidationException\', message: \'MSG03\' }</code> (lớp + mã thông báo, như dòng Exception của template).' },
    { en: 'Type: <b>A</b> = the input is rejected; <b>B</b> = a valid input on an edge (start 7/20, duration 1/3, ends at 21:00, weekly total 6, bookedHours 0); <b>N</b> = other valid inputs.', vi: 'Type: <b>A</b> = input bị từ chối; <b>B</b> = input hợp lệ nằm ở mép (bắt đầu 7/20, thời lượng 1/3, kết thúc 21:00, tổng tuần 6, bookedHours 0); <b>N</b> = input hợp lệ khác.' },
  ],
  cayThuMuc: `answers/
├── white-box.js        ← Part 1: const WHITE_BOX = [...]   (one object per UTCID column)
├── black-box.js        ← Part 2: const BLACK_BOX = [...]
├── tests.js            ← Part 3: describe / test / expect   (the "JUnit script")
└── test-report.js      ← Part 4: const REPORT = {...}
lib/
├── testkit.js          (given — Jest-like test kit, do not edit)
└── sut.js              (given — ValidationException, BusinessException)`,
  moHinh: {
    ten: 'WHITE_BOX[i] / BLACK_BOX[i] — one UTCID column',
    truong: [
      ['id', 'string', { en: 'UTCID01, UTCID02…', vi: 'UTCID01, UTCID02…' }],
      ['input', 'object', { en: 'Condition block: { studentId, labCode, startHour, duration, bookedHours }', vi: 'khối Condition: { studentId, labCode, startHour, duration, bookedHours }' }],
      ['expected', "string | { throws, message }", { en: 'Confirm block: the return value, or the exception class + message ID', vi: 'khối Confirm: giá trị trả về, hoặc lớp exception + mã thông báo' }],
      ['type', '"N" | "A" | "B"', { en: 'Result → Type', vi: 'Result → Type' }],
      ['status', '"P" | "F"', { en: 'Result → Passed/Failed (Part 1 only — run against the code)', vi: 'Result → Passed/Failed (chỉ Phần 1 — chạy trên mã)' }],
    ],
  },
  duLieuMau: `{ id: 'UTCID04', input: { studentId: 'SE180001', labCode: 'LAB01', startHour: 6, duration: 2, bookedHours: 0 },
  expected: { throws: 'ValidationException', message: 'MSG03' }, type: 'A', status: 'P' }`,
  chucNang: [
    {
      ten: { en: 'Part 1 — white-box coverage (C0, C1, conditions)', vi: 'Phần 1 — độ phủ white-box (C0, C1, điều kiện)' }, diem: 2,
      moTa: { en: `<p>The code under test (your “own source code” of the white-box variant):</p>${preSo(JAVA)}${CFG}`, vi: `<p>Mã được kiểm thử (“mã của chính bạn” trong biến thể white-box):</p>${preSo(JAVA)}${CFG}` },
      yeuCau: [
        { en: 'C0 = 100% and C1 = 100% (every decision TRUE and FALSE) — the hard requirement of the white-box lab.', vi: 'C0 = 100% và C1 = 100% (mọi quyết định TRUE và FALSE) — yêu cầu cứng của lab white-box.' },
        { en: 'Deeper than the lab: every atomic condition of lines 2, 6 and 8 is both TRUE and FALSE (null AND blank id, &lt; 7 AND &gt; 20…).', vi: 'Sâu hơn lab: mọi điều kiện con ở dòng 2, 6 và 8 đều TRUE và FALSE (id null VÀ id trống, &lt; 7 VÀ &gt; 20…).' },
      ],
      hook: ['C0', 'C1', 'condition coverage'],
    },
    {
      ten: { en: 'Part 1 — white-box grid details', vi: 'Phần 1 — chi tiết lưới white-box' }, diem: 1.5,
      yeuCau: [
        { en: 'Confirm values from the Detail Design, the right Type, P/F as the CODE behaves (one column must reveal the defect of line 14 → F). At most 15 columns.', vi: 'Giá trị Confirm theo Detail Design, Type đúng, P/F theo hành vi của MÃ (một cột phải lộ lỗi dòng 14 → F). Tối đa 15 cột.' },
      ],
      hook: ['UTCID template', 'defect report'],
    },
    {
      ten: { en: 'Part 2 — black-box grid: values, types, N:A:B', vi: 'Phần 2 — lưới black-box: giá trị, loại, N:A:B' }, diem: 1.5,
      yeuCau: [
        { en: 'Every expected value follows the Detail Design; Type is correct; the mix is Normal &lt; 20%, Abnormal &gt; 60%, Boundary &gt; 20%.', vi: 'Mọi giá trị mong đợi theo Detail Design; Type đúng; tỉ lệ Normal &lt; 20%, Abnormal &gt; 60%, Boundary &gt; 20%.' },
      ],
      hook: ['N:A:B ratio'],
    },
    {
      ten: { en: 'Part 2 — partitions and boundaries covered', vi: 'Phần 2 — phủ phân vùng và biên' }, diem: 1.5,
      yeuCau: [
        { en: 'Every invalid partition of every step (11 partitions incl. one valid) and both sides of every boundary: start 6|7, 20|21; duration 0|1, 3|4; end 21|22; weekly total 6|7; bookedHours 0|−1.', vi: 'Mọi phân vùng không hợp lệ của mọi bước (11 vùng gồm một vùng hợp lệ) và hai phía mọi biên: bắt đầu 6|7, 20|21; thời lượng 0|1, 3|4; kết thúc 21|22; tổng tuần 6|7; bookedHours 0|−1.' },
      ],
      hook: ['equivalence partitioning', '2-value BVA'],
    },
    {
      ten: { en: 'Part 3 — the unit-test script', vi: 'Phần 3 — script unit test' }, diem: 2.5,
      yeuCau: [
        { en: 'At least 10 tests in <code>answers/tests.js</code>; all pass on the correct implementation; they kill the 10 mutants (8 described, 2 hidden).', vi: 'Ít nhất 10 test trong <code>answers/tests.js</code>; đạt hết trên bản đúng; giết được 10 mutant (8 có mô tả, 2 ẩn).' },
        { en: 'Check BOTH the exception class and the message ID — a wrong class is a defect (M8).', vi: 'Kiểm CẢ lớp exception lẫn mã thông báo — sai lớp là lỗi (M8).' },
      ],
      hook: ['JUnit', 'parameterized test', 'mutation testing'],
    },
    {
      ten: { en: 'Part 4 — Test Report sheet', vi: 'Phần 4 — sheet Test Report' }, diem: 1,
      moTa: { en: `<p>Counters of the three function sheets (norm = 100 test cases / KLOC):</p>${BANG_BAO_CAO}`, vi: `<p>Bộ đếm của ba sheet hàm (định mức = 100 test case / KLOC):</p>${BANG_BAO_CAO}` },
      yeuCau: [
        { en: 'Report 5.1 formulas: Test coverage = (Passed + Failed) × 100 / Total; Test successful coverage = Passed × 100 / Total; N/A/B % of Total; Lack of test cases = LOC × norm / 1000 − Total.', vi: 'Công thức Report 5.1: Test coverage = (Passed + Failed) × 100 / Total; Test successful coverage = Passed × 100 / Total; % N/A/B trên Total; Lack of test cases = LOC × định mức / 1000 − Total.' },
      ],
      hook: ['test metrics'],
    },
  ],
  idBatBuoc: [
    ['WHITE_BOX · BLACK_BOX', { en: 'answers/white-box.js · answers/black-box.js', vi: 'answers/white-box.js · answers/black-box.js' }],
    ['describe / test / expect · reserveSeat', { en: 'answers/tests.js (reserveSeat is injected by the grader)', vi: 'answers/tests.js (reserveSeat do máy chấm đưa vào)' }],
    ['REPORT', { en: 'answers/test-report.js', vi: 'answers/test-report.js' }],
  ],
  truDiem: [
    { en: 'C1 below 100% because a decision is only ever TRUE (e.g. no valid booking at all, or no case where line 14 is FALSE).', vi: 'C1 dưới 100% vì có quyết định chỉ từng TRUE (vd không có booking hợp lệ nào, hoặc không ca nào làm dòng 14 FALSE).' },
    { en: 'Confirm values copied from the code: the weekly total 6 column marked “MSG07, P” — the Detail Design allows 6 hours.', vi: 'Giá trị Confirm chép từ mã: cột tổng tuần 6 ghi “MSG07, P” — Detail Design cho phép 6 giờ.' },
    { en: 'Black-box mix with too many Normal cases (the lab requires Normal &lt; 20%).', vi: 'Tỉ lệ black-box quá nhiều ca Normal (lab yêu cầu Normal &lt; 20%).' },
    { en: 'Test Report: dividing by (Total − N/A) — that is Report 5.2/5.3; Report 5.1 divides by Total.', vi: 'Test Report: chia cho (Total − N/A) — đó là Report 5.2/5.3; Report 5.1 chia cho Total.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'swt301-10-lab2-unit-test-report51',
  ten: 'Lab 2 Practice — Unit Test Report 5.1 (reserveSeat)',
  khoa: KHOA,
  baiHoc: 'swt301-lab2-template-worked',
  de: [
    {
      dangBai: 'lab',
      tieuDe: 'Lab 2 Practice — Report 5.1 Unit Test for BookingService.reserveSeat',
      doKho: 'HARD',
      phut: 150,
      diem: 100,
      ngonNgu: 'javascript',
      viDu: [{
        input: 'UTCID12: reserveSeat("SE180001", "LAB01", 9, 2, 4)',
        output: 'Detail Design: "BK-LAB01-0900" (4 + 2 = 6 is allowed) · code: throws MSG07 → status F, Defect ID LBK-BUG-01',
        explanation: 'Expected values come from the Detail Design; the column that disagrees with the code is the finding.|||Giá trị mong đợi lấy từ Detail Design; cột lệch với mã chính là phát hiện.',
      }],
      khaiNiem: ['unit testing', 'Report 5.1', 'UTCID', 'C0', 'C1', 'condition coverage', 'N/A/B ratio', 'equivalence partitioning', 'boundary value analysis', 'mutation testing', 'test metrics'],
      tienQuyet: ['SWT301 Lab 2 L2.8 — the template', 'Chapter 4 EP/BVA', 'Chapter 5 coverage'],
      the: ['swt301', 'lab2', 'unit-testing', 'report-5.1'],
      banIn: BAN_IN,
      thuatNgu: [
        ...tn('utcid', 'nab', 'statement', 'decision', 'condition', 'ep', 'bva', 'mutant', 'kill', 'parameterized', 'expected', 'precondition'),
        { en: 'Detail Design (DD)', vi: 'thiết kế chi tiết — cơ sở test của black-box (Javadoc, đặc tả lớp/hàm)' },
        { en: 'Confirm block', vi: 'khối xác nhận của template: Return, Exception, Log message' },
        { en: 'Lack of test cases', vi: 'số ca còn thiếu so với định mức = LOC × định mức/1000 − Total (âm = thừa)' },
        { en: 'PCL (Program Check List)', vi: 'tên Hitachi gọi bảng unit test case này' },
      ],
      goiY: [
        'Phần 1: mỗi bước kiểm (dòng 2, 4, 6, 8, 10, 12, 14) cần một cột làm nó TRUE (ném lỗi) và cột hợp lệ làm tất cả FALSE. Thêm cột cho từng vế của điều kiện ghép (null và "   "; 6 và 21; 0 và 4).',
        'Phần 1: dòng 14 viết >=, Detail Design viết > 6. Cột bookedHours = 4, duration = 2 ⇒ DD trả "BK-…" nhưng mã ném MSG07 ⇒ status F.',
        'Phần 2: muốn Abnormal > 60% thì liệt kê đủ hai phía của mọi khoảng (6 và 21, 0 và 4…) — đó là 10 ca A; gộp nhiều biên HỢP LỆ vào 3 ca B (7 + 1 + tuần 0; 18 + 3 = 21 + tuần 6; 20 + 1).',
        'Phần 3: dùng test.each cho các khoảng; với exception kiểm cả lớp (toThrow(ValidationException)) lẫn mã (toThrow("MSG03")). Một test cho thứ tự kiểm (giờ sai VÀ thời lượng sai ⇒ phải ra MSG03).',
      ],
      loiHayGap: [
        'Chỉ có một ca không hợp lệ cho mỗi điều kiện ghép (vd chỉ startHour 6) — C1 vẫn 100% nhưng vế startHour &gt; 20 chưa bao giờ TRUE (thiếu độ phủ điều kiện).',
        'Ghi status P cho cột tổng tuần 6 vì "mã ném MSG07 đúng như mình ghi" — expected phải theo Detail Design.',
        'Black-box có 4–5 ca Normal (mỗi phòng một ca) ⇒ Normal &gt; 20%.',
        'Test chỉ kiểm <code>toThrow()</code> không đối số — bản lỗi ném sai lớp (M8) hay sai mã vẫn sống.',
        'Test Report: Lack of test cases tính 14 − 1.7 (đảo dấu) — công thức là LOC × định mức / 1000 − Total.',
      ],
      moTaNgan: 'Luyện Lab 2 (Report 5.1): lưới UTCID white-box đo C0/C1/điều kiện thật, lưới black-box từ Detail Design với tỉ lệ N:A:B, script unit test kiểu JUnit giết 10 mutant, sheet Test Report.',
      giaiThich: {
        en: `<p><b>Part 1.</b> Seven decisions ⇒ seven “throw” columns plus one valid column give C0 = C1 = 100%; three more columns make every atomic condition both TRUE and FALSE (blank id, start 21, duration 4). The valid column with bookedHours 4 + duration 2 = 6 is the finding: allowed by the DD, refused by the code (line 14 <code>&gt;=</code>) ⇒ <b>F</b>.</p>
<p><b>Part 2.</b> Ten Abnormal columns (both sides of every range + every message), three Boundary columns that pack the valid edges (7/1/0, 18+3 = 21 with weekly total 6, 20+1), one Normal ⇒ 71% : 21% : 7%.</p>
<p><b>Part 3.</b> The script mirrors the grid. JUnit 5 version:</p>
<pre>@ParameterizedTest
@CsvSource({ "SE180001,LAB01,6,2,0,MSG03", "SE180001,LAB01,21,1,0,MSG03", "SE180001,LAB01,9,0,0,MSG04" })
void rejectsInvalidRanges(String id, String lab, int start, int dur, int booked, String msg) {
    ValidationException e = assertThrows(ValidationException.class,
        () -> service.reserveSeat(id, lab, start, dur, booked));
    assertTrue(e.getMessage().startsWith(msg));
}
@Test
void weeklyLimitAllowsExactlySixHours() {
    assertEquals("BK-LAB01-0900", service.reserveSeat("SE180001", "LAB01", 9, 2, 4)); // fails on the code: line 14
}</pre>
<p><b>Part 4.</b> 27 × 100 / 30 = 90%, 24 × 100 / 30 = 80%, N/A/B = 20/60/20%, lack = 17 × 100 / 1000 − 14 = −12.3.</p>`,
        vi: `<p><b>Phần 1.</b> Bảy quyết định ⇒ bảy cột “ném lỗi” cộng một cột hợp lệ cho C0 = C1 = 100%; thêm ba cột để mọi điều kiện con đều TRUE và FALSE (id trống, giờ 21, thời lượng 4). Cột hợp lệ có bookedHours 4 + duration 2 = 6 là phát hiện: DD cho phép, mã từ chối (dòng 14 <code>&gt;=</code>) ⇒ <b>F</b>.</p>
<p><b>Phần 2.</b> Mười cột Abnormal (hai phía mọi khoảng + mọi thông báo), ba cột Boundary gói các mép hợp lệ (7/1/0, 18+3 = 21 với tổng tuần 6, 20+1), một cột Normal ⇒ 71% : 21% : 7%.</p>
<p><b>Phần 3.</b> Script phản chiếu lưới; bản JUnit 5 ở phần tiếng Anh.</p>
<p><b>Phần 4.</b> 27 × 100 / 30 = 90%, 24 × 100 / 30 = 80%, N/A/B = 20/60/20%, thiếu = 17 × 100 / 1000 − 14 = −12,3.</p>`,
      },
      loaiKiem: 'js',
      tests: {
        loai: 'js', phienBan: 1,
        tepNap: ['lib/testkit.js', 'lib/sut.js', 'answers/white-box.js', 'answers/black-box.js', 'answers/tests.js', 'answers/test-report.js'],
        kiem: KIEM,
      },
      khoiDau: { 'answers/white-box.js': DAU_WB, 'answers/black-box.js': DAU_BB, 'answers/tests.js': DAU_TEST, 'answers/test-report.js': DAU_REPORT, 'lib/testkit.js': TESTKIT_JS, 'lib/sut.js': LIB_SUT },
      loiGiai: { 'answers/white-box.js': GIAI_WB, 'answers/black-box.js': GIAI_BB, 'answers/tests.js': GIAI_TEST, 'answers/test-report.js': GIAI_REPORT, 'lib/testkit.js': TESTKIT_JS, 'lib/sut.js': LIB_SUT },
      thamKhao: 'https://junit.org/junit5/docs/current/user-guide/#writing-tests-parameterized-tests',
      boYeu: [
        { ten: 'tests chỉ có happy path', tep: { 'answers/tests.js': DAU_TEST }, phaiTruot: ['Kills mutant M2', 'Kills mutant M5'] },
        { ten: 'tests không kiểm lớp exception', tep: { 'answers/tests.js': GIAI_TEST.replace(/\.toThrow\((Validation|Business)Exception\)/g, '.toThrow()') }, phaiTruot: ['Kills mutant M8'] },
        { ten: 'white-box thiếu vế > 20 / > 3 / blank', tep: { 'answers/white-box.js': GIAI_WB.replace(/\n  \{ id: 'UTCID0[257]'[^\n]*\n[^\n]*/g, '') }, phaiTruot: ['100% condition coverage'] },
        { ten: 'white-box chép expected từ mã', tep: { 'answers/white-box.js': GIAI_WB.replace("expected: 'BK-LAB01-0900', type: 'B', status: 'F'", "expected: { throws: 'BusinessException', message: 'MSG07' }, type: 'A', status: 'P'") }, phaiTruot: ['Every "expected" value comes from the SPECIFICATION'] },
        { ten: 'black-box nhiều ca Normal', tep: { 'answers/black-box.js': GIAI_BB.replace('];', "  { id: 'UTCID15', input: { studentId: 'SE180002', labCode: 'LAB01', startHour: 10, duration: 2, bookedHours: 1 }, expected: 'BK-LAB01-1000', type: 'N' },\n  { id: 'UTCID16', input: { studentId: 'SE180003', labCode: 'LAB03', startHour: 15, duration: 2, bookedHours: 2 }, expected: 'BK-LAB03-1500', type: 'N' },\n  { id: 'UTCID17', input: { studentId: 'SE180004', labCode: 'LAB02', startHour: 11, duration: 2, bookedHours: 1 }, expected: 'BK-LAB02-1100', type: 'N' },\n];") }, phaiTruot: ['Case mix by Type'] },
        { ten: 'report chia cho Total − N/A', tep: { 'answers/test-report.js': GIAI_REPORT.replace('testCoverage: 90.0', 'testCoverage: 92.5') }, phaiTruot: ['Test Report — Test coverage %'] },
      ],
    },
  ],
});
