/**
 * CTW đợt 5 — luật thuần: mã lớp, đọc danh sách sinh viên (CSV/xlsx), rubric + điểm + ai thấy điểm, RRULE + múi giờ + chống
 * trùng, sức khoẻ nhóm.   npx tsx --test src/services/work/teachingRules.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { zonedMidnight } from './projectTime.js';
import {
  INVITE_LIMITS, JOIN_ALPHABET, RUBRIC_TEMPLATES, RecurrenceError, RubricError, canGrade, canResendInvite, canSeeGrade, dueOccurrence,
  formatJoinCode, generateJoinCode, gradeSubjectKey, groupHealth, isWellFormedJoinCode, joinState, nextOccurrences, normalizeCriteria,
  normalizeJoinCode, normalizeRecurrence, occursOn, parseCsv, parseRrule, recurringDedupKey, renderRecurringTitle, rosterFromTable,
  toRrule, validateScores, weightedTotal,
} from './teachingRules.js';

describe('Mã lớp', () => {
  it('sinh 8 ký tự trong bảng chữ an toàn (không 0/O/1/I/L), phân bố không lệch', () => {
    let seed = 0;
    const fake = (n: number) => Uint8Array.from({ length: n }, () => (seed = (seed * 73 + 41) % 256));
    for (let i = 0; i < 50; i++) {
      const c = generateJoinCode(fake);
      assert.equal(c.length, 8);
      assert.ok([...c].every((ch) => JOIN_ALPHABET.includes(ch)), c);
      assert.ok(isWellFormedJoinCode(c));
    }
    assert.ok(!/[01OIL]/.test(JOIN_ALPHABET));
  });
  it('chuẩn hoá: chữ thường, gạch, khoảng trắng', () => {
    assert.equal(normalizeJoinCode(' abcd-efgh '), 'ABCDEFGH');
    assert.equal(normalizeJoinCode('ab cd_ef.gh'), 'ABCDEFGH');
    assert.equal(formatJoinCode('ABCDEFGH'), 'ABCD-EFGH');
    assert.equal(isWellFormedJoinCode('ABCD0FGH'), false, 'số 0 không có trong bảng ⇒ mã sai, không tra DB');
    assert.equal(isWellFormedJoinCode('ABC'), false);
  });
  it('trạng thái: mở / đóng / hết hạn / lưu trữ', () => {
    const now = new Date('2026-10-10T00:00:00Z');
    assert.equal(joinState({ joinOpen: true, joinExpiresAt: null, archivedAt: null }, now), 'OK');
    assert.equal(joinState({ joinOpen: true, joinExpiresAt: new Date('2026-10-11T00:00:00Z'), archivedAt: null }, now), 'OK');
    assert.equal(joinState({ joinOpen: true, joinExpiresAt: new Date('2026-10-09T23:59:59Z'), archivedAt: null }, now), 'EXPIRED');
    assert.equal(joinState({ joinOpen: true, joinExpiresAt: now, archivedAt: null }, now), 'EXPIRED', 'đúng giây hết hạn ⇒ hết');
    assert.equal(joinState({ joinOpen: false, joinExpiresAt: null, archivedAt: null }, now), 'CLOSED');
    assert.equal(joinState({ joinOpen: true, joinExpiresAt: null, archivedAt: now }, now), 'ARCHIVED');
  });
});

describe('Danh sách sinh viên', () => {
  it('CSV: BOM, dấu ; , ngoặc kép có dấu phẩy và ngoặc kép kép, dòng trống, CRLF', () => {
    const t = parseCsv('﻿MSSV;Họ tên;Email\r\nHE170001;"Nguyễn Văn, A";a@fpt.edu.vn\r\n\r\nHE170002;"Trần ""B""";b@fpt.edu.vn');
    assert.deepEqual(t, [['MSSV', 'Họ tên', 'Email'], ['HE170001', 'Nguyễn Văn, A', 'a@fpt.edu.vn'], ['HE170002', 'Trần "B"', 'b@fpt.edu.vn']]);
  });
  it('tiêu đề tiếng Việt/Anh, thứ tự cột bất kỳ; email chữ thường, MSSV chữ hoa', () => {
    const rows = rosterFromTable([['Email', 'Full name', 'Roll number'], ['A@FPT.edu.vn', '  An   Nguyen ', 'he170001']]);
    assert.deepEqual(rows, [{ line: 2, studentCode: 'HE170001', fullName: 'An Nguyen', email: 'a@fpt.edu.vn', errors: [] }]);
  });
  it('lỗi: email sai, thiếu email, trùng trong tệp (email + MSSV), đã có trong lớp, MSSV sai', () => {
    const rows = rosterFromTable([
      ['MSSV', 'Họ và tên', 'Email'],
      ['HE1', 'X', 'not-an-email'],
      ['HE170003', 'Y', ''],
      ['HE170004', 'Z', 'z@fpt.edu.vn'],
      ['HE170005', 'Z2', 'Z@fpt.edu.vn'],
      ['HE170004', 'Z3', 'z3@fpt.edu.vn'],
      ['HE170006', 'Old', 'old@fpt.edu.vn'],
      ['HE170099', 'Old code', 'new@fpt.edu.vn'],
      ['HE-17!', 'Bad code', 'bc@fpt.edu.vn'],
    ], { emails: new Set(['old@fpt.edu.vn']), codes: new Set(['HE170099']) });
    const errs = rows.map((r) => r.errors);
    assert.deepEqual(errs[0], ['BAD_EMAIL', 'BAD_CODE'], 'HE1 quá ngắn + email sai');
    assert.deepEqual(errs[1], ['MISSING_EMAIL']);
    assert.deepEqual(errs[2], []);
    assert.deepEqual(errs[3], ['DUP_EMAIL_IN_FILE'], 'trùng email không phân biệt hoa thường');
    assert.deepEqual(errs[4], ['DUP_CODE_IN_FILE']);
    assert.deepEqual(errs[5], ['ALREADY_IN_CLASS']);
    assert.deepEqual(errs[6], ['CODE_IN_CLASS']);
    assert.deepEqual(errs[7], ['BAD_CODE']);
    assert.equal(rows[0].line, 2, 'số dòng tính cả dòng tiêu đề');
  });
  it('không có tiêu đề: đoán cột email (có @), MSSV (chữ + số), họ tên (dài nhất)', () => {
    const rows = rosterFromTable([['Nguyễn Thị Hoa', 'SE180001', 'hoa@fpt.edu.vn'], ['Lê Minh Quân', 'SE180002', 'quan@fpt.edu.vn']]);
    assert.equal(rows.length, 2);
    assert.deepEqual(rows.map((r) => [r.studentCode, r.fullName, r.email]), [['SE180001', 'Nguyễn Thị Hoa', 'hoa@fpt.edu.vn'], ['SE180002', 'Lê Minh Quân', 'quan@fpt.edu.vn']]);
  });
  it('gửi lại lời mời: đã vào lớp / chưa đủ 24 giờ / quá số lần', () => {
    const now = new Date('2026-10-10T12:00:00Z');
    assert.equal(canResendInvite({ invitedAt: null, inviteCount: 0, joinedAt: null, userId: null }, now), 'OK');
    assert.equal(canResendInvite({ invitedAt: new Date('2026-10-10T00:00:00Z'), inviteCount: 1, joinedAt: null, userId: null }, now), 'TOO_SOON');
    assert.equal(canResendInvite({ invitedAt: new Date('2026-10-09T11:00:00Z'), inviteCount: 1, joinedAt: null, userId: null }, now), 'OK');
    assert.equal(canResendInvite({ invitedAt: null, inviteCount: INVITE_LIMITS.maxPerStudent, joinedAt: null, userId: null }, now), 'MAX');
    assert.equal(canResendInvite({ invitedAt: null, inviteCount: 0, joinedAt: now, userId: 3 }, now), 'JOINED');
  });
});

describe('Rubric & điểm', () => {
  it('mọi mẫu rubric trong repo hợp lệ: trọng số cộng 100, khoá duy nhất', () => {
    assert.ok(RUBRIC_TEMPLATES.length >= 3);
    for (const t of RUBRIC_TEMPLATES) {
      const c = normalizeCriteria(t.criteria, t.scaleMax);
      assert.equal(c.reduce((a, x) => a + x.weight, 0), 100, t.key);
      assert.equal(new Set(c.map((x) => x.key)).size, c.length, t.key);
    }
    const final = RUBRIC_TEMPLATES.find((t) => t.key === 'SWP391_FINAL')!;
    assert.deepEqual(final.criteria.map((c) => [c.name, c.weight]), [['Team', 20], ['Product', 40], ['Requirement', 20], ['Design', 20]], 'đúng tỷ trọng hội đồng ở labflow-ai.md');
  });
  it('trọng số sai / tên trống / mức điểm vượt thang ⇒ lỗi rõ', () => {
    assert.throws(() => normalizeCriteria([{ name: 'A', weight: 60 }, { name: 'B', weight: 30 }]), (e: RubricError) => e.code === 'RUBRIC_WEIGHTS' && /now 90/.test(e.message));
    assert.throws(() => normalizeCriteria([{ name: '', weight: 100 }]), RubricError);
    assert.throws(() => normalizeCriteria([]), RubricError);
    assert.throws(() => normalizeCriteria([{ name: 'A', weight: 100, levels: [{ score: 11, label: 'x' }] }], 10), RubricError);
    const c = normalizeCriteria([{ name: 'Báo cáo SRS', weight: 50 }, { name: 'Báo cáo SRS', weight: 50 }]);
    assert.notEqual(c[0].key, c[1].key, 'tên trùng ⇒ khoá vẫn khác nhau');
    assert.equal(c[0].key, 'bao_cao_srs');
  });
  it('điểm: làm tròn 0,25, ngoài thang / khoá lạ ⇒ lỗi; tổng có trọng số, thiếu tiêu chí ⇒ null', () => {
    const c = normalizeCriteria([{ key: 'a', name: 'A', weight: 25 }, { key: 'b', name: 'B', weight: 75 }]);
    assert.deepEqual(validateScores(c, { a: 7.13, b: null }), { a: 7.25 });
    assert.throws(() => validateScores(c, { a: 11 }), RubricError);
    assert.throws(() => validateScores(c, { zzz: 1 }), RubricError);
    assert.equal(weightedTotal(c, { a: 8 }), null);
    assert.equal(weightedTotal(c, { a: 8, b: 6 }), 6.5);
  });
  it('chỉ TEACHER chấm; sinh viên chỉ thấy điểm đã công bố, điểm cá nhân chỉ chính mình', () => {
    assert.equal(canGrade('TEACHER'), true);
    for (const r of ['ADMIN', 'MEMBER', 'VIEWER', 'CLIENT', null] as const) assert.equal(canGrade(r), false, String(r));
    const draft = { publishedAt: null, subjectUserId: null };
    const team = { publishedAt: new Date(), subjectUserId: null };
    const mine = { publishedAt: new Date(), subjectUserId: 7 };
    assert.equal(canSeeGrade({ userId: 1, role: 'TEACHER' }, draft), true);
    assert.equal(canSeeGrade({ userId: 7, role: 'MEMBER' }, draft), false, 'chưa công bố');
    assert.equal(canSeeGrade({ userId: 7, role: 'ADMIN' }, draft), false, 'trưởng nhóm cũng không');
    assert.equal(canSeeGrade({ userId: 7, role: 'MEMBER' }, team), true);
    assert.equal(canSeeGrade({ userId: 7, role: 'MEMBER' }, mine), true);
    assert.equal(canSeeGrade({ userId: 8, role: 'MEMBER' }, mine), false, 'điểm cá nhân của bạn khác');
    assert.equal(canSeeGrade({ userId: 9, role: 'VIEWER' }, team), false);
    assert.equal(canSeeGrade({ userId: 9, role: 'CLIENT' }, team), false);
    assert.equal(canSeeGrade({ userId: 1, role: 'TEACHER', agent: true }, team), false);
    assert.equal(gradeSubjectKey(null), 'TEAM');
    assert.equal(gradeSubjectKey(42), 'U42');
  });
});

describe('Việc định kỳ (RRULE + múi giờ + chống trùng)', () => {
  const weeklyFri = normalizeRecurrence({ freq: 'WEEKLY', byWeekday: [5], hour: 16, minute: 0, startDate: '2026-10-05' });
  it('hằng tuần thứ Sáu; RRULE đi và về', () => {
    assert.equal(toRrule(weeklyFri), 'FREQ=WEEKLY;BYDAY=FR;BYHOUR=16;BYMINUTE=0');
    assert.deepEqual(parseRrule(toRrule(weeklyFri), '2026-10-05'), weeklyFri);
    assert.deepEqual(nextOccurrences(weeklyFri, '2026-10-05', 3), ['2026-10-09', '2026-10-16', '2026-10-23']);
  });
  it('cách 2 tuần tính từ tuần của ngày bắt đầu; nhiều thứ trong tuần', () => {
    const r = normalizeRecurrence({ freq: 'WEEKLY', interval: 2, byWeekday: [1, 4], startDate: '2026-10-07' });
    assert.deepEqual(nextOccurrences(r, '2026-10-01', 4), ['2026-10-08', '2026-10-19', '2026-10-22', '2026-11-02']);
  });
  it('hằng tháng: ngày cuối tháng (−1) và ngày 31 ở tháng ngắn', () => {
    const last = normalizeRecurrence({ freq: 'MONTHLY', byMonthDay: -1, startDate: '2026-01-15' });
    assert.deepEqual(nextOccurrences(last, '2026-01-01', 3), ['2026-01-31', '2026-02-28', '2026-03-31']);
    const d31 = normalizeRecurrence({ freq: 'MONTHLY', byMonthDay: 31, startDate: '2026-04-01' });
    assert.deepEqual(nextOccurrences(d31, '2026-04-01', 2), ['2026-04-30', '2026-05-31']);
  });
  it('hằng ngày cách 3; ngày kết thúc chặn lại', () => {
    const r = normalizeRecurrence({ freq: 'DAILY', interval: 3, startDate: '2026-10-01', endDate: '2026-10-08' });
    assert.deepEqual(nextOccurrences(r, '2026-09-01', 10), ['2026-10-01', '2026-10-04', '2026-10-07']);
    assert.equal(occursOn(r, '2026-10-10'), false);
  });
  it('đầu vào sai ⇒ lỗi rõ', () => {
    assert.throws(() => normalizeRecurrence({ freq: 'YEARLY', startDate: '2026-10-01' }), RecurrenceError);
    assert.throws(() => normalizeRecurrence({ freq: 'DAILY', interval: 0, startDate: '2026-10-01' }), RecurrenceError);
    assert.throws(() => normalizeRecurrence({ freq: 'DAILY', startDate: '10/01/2026' }), RecurrenceError);
    assert.throws(() => normalizeRecurrence({ freq: 'DAILY', startDate: '2026-10-05', endDate: '2026-10-01' }), RecurrenceError);
    assert.throws(() => normalizeRecurrence({ freq: 'MONTHLY', byMonthDay: 0, startDate: '2026-10-05' }), RecurrenceError);
  });
  it('đến hạn theo GIỜ + MÚI GIỜ của dự án; bù 36 giờ; ngoài cửa sổ thì bỏ', () => {
    const vn = 'Asia/Ho_Chi_Minh', ny = 'America/New_York';
    const mid = (tz: string) => (d: string) => zonedMidnight(d, tz);
    // Thứ Sáu 09/10/2026 16:00 giờ VN = 09:00Z.
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-09T08:59:00Z'), '2026-10-09', mid(vn)), null, 'chưa tới 16:00 VN');
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-09T09:00:00Z'), '2026-10-09', mid(vn)), '2026-10-09');
    // Cùng thời điểm 09:00Z: ở New York mới 05:00 sáng thứ Sáu ⇒ chưa đến hạn.
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-09T09:00:00Z'), '2026-10-09', mid(ny)), null);
    // 16:00 New York (EDT, UTC−4) = 20:00Z.
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-09T20:00:00Z'), '2026-10-09', mid(ny)), '2026-10-09');
    // Máy chủ tắt cả ngày thứ Sáu: sáng thứ Bảy (VN) vẫn bù được lần thứ Sáu.
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-10T03:00:00Z'), '2026-10-10', mid(vn)), '2026-10-09');
    // Quá 36 giờ ⇒ bỏ (không tạo thẻ muộn cả tuần).
    assert.equal(dueOccurrence(weeklyFri, new Date('2026-10-10T22:00:00Z'), '2026-10-11', mid(vn)), null);
  });
  it('khoá chống trùng + tiêu đề có {date} {week} {n}', () => {
    assert.equal(recurringDedupKey(12, '2026-10-09'), 'rec:12:2026-10-09');
    assert.equal(renderRecurringTitle('Weekly Report tuần {week} — {date} (lần {n})', '2026-10-16', weeklyFri), 'Weekly Report tuần 2 — 16/10/2026 (lần 2)');
  });
});

describe('Sức khoẻ nhóm', () => {
  const base = { overdue: 0, open: 10, sprintAtRisk: false, unansweredQna: 0, oldestQnaDays: 0, openHighRisks: 0, missingDocs: 0, attentionMembers: 0, silentDays: 0 };
  it('xanh khi không có gì; vàng khi chỉ có lý do vàng; đỏ khi có lý do đỏ', () => {
    assert.deepEqual(groupHealth(base), { status: 'green', reasons: [] });
    assert.equal(groupHealth({ ...base, overdue: 1 }).status, 'amber');
    assert.equal(groupHealth({ ...base, overdue: 5 }).status, 'red');
    assert.equal(groupHealth({ ...base, unansweredQna: 1, oldestQnaDays: 8 }).status, 'red', 'câu hỏi chờ ≥ 7 ngày');
    assert.equal(groupHealth({ ...base, silentDays: 15 }).status, 'red');
    const r = groupHealth({ ...base, missingDocs: 2, attentionMembers: 1 });
    assert.equal(r.status, 'amber');
    assert.deepEqual(r.reasons.map((x) => [x.code, x.n]), [['DOCS_MISSING', 2], ['MEMBERS_ATTENTION', 1]]);
  });
});
