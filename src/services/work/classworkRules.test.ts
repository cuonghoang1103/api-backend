/**
 * CTW đợt 9b — luật thuần của Bài tập + Sổ điểm: npx tsx --test src/services/work/classworkRules.test.ts
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  applyPenalty, assignedSeats, canTurnIn, checkClassFile, finalPointsFor, lateInfo, latePenaltyPct, normalizeLinks, normalizeWeights,
  parseGradeImport, rubricToPoints, studentGrade, totalOf, workState, type GradeFields,
} from './classworkRules.js';

const due = new Date('2026-10-20T16:59:00Z');
const H = 3_600_000;

describe('nộp muộn + mức trừ', () => {
  it('đúng hạn không muộn; 1 phút muộn = 1 ngày; 25 giờ = 2 ngày', () => {
    assert.deepEqual(lateInfo(due, due), { late: false, daysLate: 0 });
    assert.deepEqual(lateInfo(due, new Date(due.getTime() + 60_000)), { late: true, daysLate: 1 });
    assert.deepEqual(lateInfo(due, new Date(due.getTime() + 25 * H)), { late: true, daysLate: 2 });
    assert.deepEqual(lateInfo(null, new Date()), { late: false, daysLate: 0 }, 'không có hạn thì không bao giờ muộn');
  });
  it('trừ %/ngày có trần; 0% thì không trừ', () => {
    const a = { latePenaltyPct: 10, latePenaltyMaxPct: 30 };
    assert.equal(latePenaltyPct(a, 0), 0);
    assert.equal(latePenaltyPct(a, 2), 20);
    assert.equal(latePenaltyPct(a, 9), 30);
    assert.equal(latePenaltyPct({ latePenaltyPct: 0, latePenaltyMaxPct: 100 }, 5), 0);
    assert.equal(applyPenalty(8, 20), 6.4);
    assert.equal(applyPenalty(null, 20), null);
  });
  it('khoá nộp muộn: sau hạn không nộp được; cho phép thì được', () => {
    const late = new Date(due.getTime() + 1000);
    assert.equal(canTurnIn({ dueAt: due, allowLate: false }, late), false);
    assert.equal(canTurnIn({ dueAt: due, allowLate: false }, due), true);
    assert.equal(canTurnIn({ dueAt: due, allowLate: true }, late), true);
  });
});

describe('điểm nháp không lộ; bài nhóm chỉnh từng người', () => {
  const g = (o: Partial<GradeFields>): GradeFields => ({
    status: 'TURNED_IN', points: 8, scores: {}, memberPoints: {}, penaltyPct: 0, returnedAt: null, returnedPoints: null, returnedScores: null,
    returnedMemberPoints: null, returnedPenaltyPct: null, ...o,
  });
  it('chưa trả ⇒ sinh viên không thấy gì dù đã có điểm nháp', () => {
    const v = studentGrade(g({ points: 9.5 }), 1);
    assert.deepEqual(v, { points: null, rawPoints: null, penaltyPct: null, scores: null, returnedAt: null });
  });
  it('đã trả ⇒ thấy bản ĐÃ TRẢ, không phải bản nháp sửa sau', () => {
    const at = new Date();
    const v = studentGrade(g({ points: 4, returnedAt: at, returnedPoints: 8, returnedPenaltyPct: 25 }), 1);
    assert.equal(v.points, 6);
    assert.equal(v.rawPoints, 8);
  });
  it('nhóm: điểm chỉnh riêng thắng điểm chung', () => {
    const x = g({ points: 8, memberPoints: { 5: 9 } });
    assert.equal(finalPointsFor(x, 5, 'draft'), 9);
    assert.equal(finalPointsFor(x, 6, 'draft'), 8);
  });
  it('rubric quy về thang điểm bài', () => {
    assert.equal(rubricToPoints(7.5, 10, 100), 75);
    assert.equal(rubricToPoints(null, 10, 100), null);
  });
  it('trạng thái: thiếu bài khi quá hạn chưa nộp', () => {
    const now = new Date(due.getTime() + H);
    assert.equal(workState(null, due, now), 'MISSING');
    assert.equal(workState(null, due, new Date(due.getTime() - H)), 'ASSIGNED');
    assert.equal(workState({ status: 'TURNED_IN', late: true }, due, now), 'LATE');
    assert.equal(workState({ status: 'RETURNED', late: true }, due, now), 'RETURNED');
  });
});

describe('đối tượng giao bài', () => {
  const seats = [
    { id: 1, userId: 11, groupId: 100 }, { id: 2, userId: 12, groupId: 100 }, { id: 3, userId: 13, groupId: 200 },
    { id: 4, userId: 14, groupId: null }, { id: 5, userId: null, groupId: null },
  ];
  it('cả lớp (cá nhân) = mọi ghế đã có tài khoản', () => {
    assert.deepEqual(assignedSeats({ kind: 'INDIVIDUAL', targetAll: true, targetGroupIds: [], targetStudentIds: [] }, seats).map((s) => s.id), [1, 2, 3, 4]);
  });
  it('một số nhóm + một số SV', () => {
    assert.deepEqual(assignedSeats({ kind: 'INDIVIDUAL', targetAll: false, targetGroupIds: [200], targetStudentIds: [4] }, seats).map((s) => s.id), [3, 4]);
  });
  it('bài nhóm: người chưa có nhóm không được giao', () => {
    assert.deepEqual(assignedSeats({ kind: 'GROUP', targetAll: true, targetGroupIds: [], targetStudentIds: [] }, seats).map((s) => s.id), [1, 2, 3]);
    assert.deepEqual(assignedSeats({ kind: 'GROUP', targetAll: false, targetGroupIds: [100], targetStudentIds: [] }, seats).map((s) => s.id), [1, 2]);
  });
});

describe('kiểm tệp nộp', () => {
  const pdf = Buffer.from('%PDF-1.7\n...');
  const exe = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(100, 1)]);
  it('PDF thật ⇒ nhận, kiểu do máy chủ đặt', () => {
    const r = checkClassFile('Bao cao.pdf', pdf);
    assert.equal(r.ok, true);
    assert.equal(r.ok && r.mime, 'application/pdf');
  });
  it('.exe, .html, .svg, đuôi kép bị chặn', () => {
    for (const n of ['virus.exe', 'x.html', 'logo.svg', 'bai.pdf.exe', 'macro.docm']) assert.equal((checkClassFile(n, pdf) as { code?: string }).code, 'FILE_BLOCKED', n);
  });
  it('.exe đổi tên thành .pdf / .txt ⇒ sai chữ ký', () => {
    assert.equal((checkClassFile('bai.pdf', exe) as { code?: string }).code, 'FILE_SIGNATURE');
    assert.equal((checkClassFile('bai.txt', exe) as { code?: string }).code, 'FILE_SIGNATURE');
  });
  it('rỗng / quá cỡ / đuôi lạ', () => {
    assert.equal((checkClassFile('a.pdf', Buffer.alloc(0)) as { code?: string }).code, 'FILE_EMPTY');
    assert.equal((checkClassFile('a.pdf', pdf, 4) as { code?: string }).code, 'FILE_TOO_BIG');
    assert.equal((checkClassFile('a.xyz', pdf) as { code?: string }).code, 'FILE_TYPE');
  });
  it('mã nguồn + zip được nhận', () => {
    assert.equal(checkClassFile('Main.java', Buffer.from('class Main {}')).ok, true);
    assert.equal(checkClassFile('src.zip', Buffer.from('504b030414000000', 'hex')).ok, true);
  });
});

describe('link nộp', () => {
  it('gắn nhãn GitHub/Drive, bỏ trùng, chặn javascript:', () => {
    const r = normalizeLinks(['https://github.com/a/b', 'https://drive.google.com/x', 'https://github.com/a/b']);
    assert.deepEqual(r.map((x) => x.label), ['GitHub', 'Google Drive']);
    assert.throws(() => normalizeLinks(['javascript:alert(1)']));
    assert.throws(() => normalizeLinks(['not a url']));
  });
});

describe('sổ điểm hệ 10', () => {
  const items = [
    { key: 'a', category: 'Assignment', topic: 'Week 1', maxPoints: 10 },
    { key: 'b', category: 'Assignment', topic: 'Week 2', maxPoints: 20 },
    { key: 'q', category: 'Quiz', topic: 'Week 1', maxPoints: 5 },
  ];
  const cells = new Map([['a', { points: 8 }], ['b', { points: 10 }], ['q', { points: 5 }]]);
  it('POINTS: tổng điểm / tổng tối đa', () => {
    assert.equal(totalOf(items, cells, 'POINTS', {}).total, Math.round((23 / 35) * 1000) / 100);
  });
  it('CATEGORY: trung bình % theo loại × trọng số', () => {
    const r = totalOf(items, cells, 'CATEGORY', { Assignment: 60, Quiz: 40 });
    // Assignment = 18/30 = 0.6, Quiz = 1 ⇒ 0.6×60 + 1×40 = 76% ⇒ 7.6
    assert.equal(r.total, 7.6);
    assert.equal(r.byGroup.Quiz, 10);
  });
  it('nhóm chưa có điểm ⇒ trọng số chia lại; không ô nào ⇒ null', () => {
    const only = new Map([['a', { points: 5 }]]);
    assert.equal(totalOf(items, only, 'CATEGORY', { Assignment: 60, Quiz: 40 }).total, 5);
    assert.equal(totalOf(items, new Map(), 'POINTS', {}).total, null);
  });
  it('thiếu bài tính 0 khi bật', () => {
    const m = new Map([['a', { points: 10 }], ['b', { points: null, missing: true }]]);
    assert.equal(totalOf(items.slice(0, 2), m, 'POINTS', {}).total, 10);
    assert.equal(totalOf(items.slice(0, 2), m, 'POINTS', {}, true).total, 3.33);
  });
  it('trọng số: bỏ giá trị sai', () => {
    assert.deepEqual(normalizeWeights({ A: 50, B: -1, C: 'x', D: 120 }), { A: 50 });
  });
});

describe('nhập điểm từ xlsx', () => {
  const items = [
    { key: 'assignment:1', title: 'Lab 1', maxPoints: 10, importable: true },
    { key: 'quiz:2', title: 'Quiz 1', maxPoints: 5, importable: false },
  ];
  const students = [
    { userId: 11, studentCode: 'HE170001', email: 'a@x.vn', name: 'An' },
    { userId: 12, studentCode: 'HE170002', email: 'b@x.vn', name: 'Bình' },
  ];
  it('khớp theo MSSV hoặc email; báo lỗi từng dòng; cột quiz không nhập được', () => {
    const p = parseGradeImport([
      ['MSSV', 'Họ tên', 'Email', 'Lab 1 (10)', 'Quiz 1', 'Lạ'],
      ['he170001', 'An', '', '8,5', '4', 'x'],
      ['', 'Bình', 'B@X.VN', '11', '', ''],
      ['HE179999', 'Ai đó', '', '7', '', ''],
      ['HE170001', 'Trùng', '', '6', '', ''],
      ['', '', '', '', '', ''],
    ], items, students);
    assert.deepEqual(p.columns.map((c) => [c.header, c.itemKey, c.reason ?? null]), [['Lab 1 (10)', 'assignment:1', null], ['Quiz 1', null, 'NOT_IMPORTABLE'], ['Lạ', null, 'NO_MATCH']]);
    assert.equal(p.rows.length, 4, 'dòng trống bị bỏ');
    assert.deepEqual(p.rows[0].values, [{ itemKey: 'assignment:1', points: 8.5 }]);
    assert.deepEqual(p.rows[0].errors, []);
    assert.deepEqual(p.rows[1].errors, ['OVER_MAX:Lab 1 (10)']);
    assert.deepEqual(p.rows[2].errors, ['UNKNOWN_STUDENT']);
    assert.deepEqual(p.rows[3].errors, ['DUPLICATE_STUDENT']);
    assert.equal(p.valid, 1);
    assert.equal(p.cells, 1);
  });
});
