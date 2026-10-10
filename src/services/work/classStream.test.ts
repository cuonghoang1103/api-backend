/**
 * CTW đợt 9a — luật thuần của lớp học (bảng tin, tài liệu, điểm danh). Chạy: npx tsx --test src/services/work/classStream.test.ts
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  CHECKIN_MAX_FAILS, CHECKIN_FAIL_WINDOW_MS, attendanceSummary, canComment, checkinStatusAt, cleanCheckinCode, isCheckinCode, isLocked,
  newCheckinCode, normalizeLinks, noteFail, parseIdList, reorderPlan, scheduleOf, viewRate, visibleToStudent,
} from './classStreamRules.js';
import { seriesOccurrences } from './classCalendar.service.js';
import { linkUrl } from './classStream.service.js';

const NOW = new Date('2026-10-13T03:00:00Z');

describe('bảng tin — ai thấy gì', () => {
  const pub = { publishedAt: NOW, deletedAt: null, audienceGroupIds: [] };
  it('bài chưa đăng (hẹn giờ) / đã xoá ⇒ SV không thấy', () => {
    assert.equal(visibleToStudent({ ...pub, publishedAt: null }, 1), false);
    assert.equal(visibleToStudent({ ...pub, deletedAt: NOW }, 1), false);
    assert.equal(visibleToStudent(pub, null), true, 'cả lớp ⇒ cả SV chưa có nhóm');
  });
  it('bài cho một số nhóm ⇒ chỉ SV của nhóm đó', () => {
    const p = { ...pub, audienceGroupIds: [3, 5] };
    assert.equal(visibleToStudent(p, 3), true);
    assert.equal(visibleToStudent(p, 4), false);
    assert.equal(visibleToStudent(p, null), false);
    assert.equal(visibleToStudent({ ...pub, audienceGroupIds: 'rác' }, 2), true, 'JSON hỏng ⇒ coi như cả lớp');
  });
  it('bình luận: GV luôn được; SV khi lớp bật và bài không khoá', () => {
    assert.equal(canComment({ manage: true, classAllows: false, postCommentsOff: true }), true);
    assert.equal(canComment({ manage: false, classAllows: true, postCommentsOff: false }), true);
    assert.equal(canComment({ manage: false, classAllows: false, postCommentsOff: false }), false);
    assert.equal(canComment({ manage: false, classAllows: true, postCommentsOff: true }), false);
  });
  it('giờ hẹn: trống/quá khứ ⇒ ngay; sai/quá 180 ngày ⇒ lỗi', () => {
    assert.deepEqual(scheduleOf(null, NOW), { publishAt: NOW, immediate: true });
    assert.deepEqual(scheduleOf('2026-10-12T00:00:00Z', NOW), { publishAt: NOW, immediate: true });
    const later = scheduleOf('2026-10-14T00:00:00Z', NOW);
    assert.ok(typeof later === 'object' && !later.immediate && later.publishAt.toISOString() === '2026-10-14T00:00:00.000Z');
    assert.equal(scheduleOf('không phải ngày', NOW), 'BAD');
    assert.equal(scheduleOf('2027-10-14T00:00:00Z', NOW), 'TOO_FAR');
  });
  it('link đính kèm ⇒ thẻ link (YouTube/Drive nhận diện), bỏ trùng + javascript:', () => {
    const r = normalizeLinks([
      { url: 'https://www.youtube.com/watch?v=abc' }, 'https://drive.google.com/file/d/1/view', { url: 'javascript:alert(1)' },
      { url: 'https://www.youtube.com/watch?v=abc', title: 'trùng' }, { url: 'không phải link' },
    ]);
    assert.deepEqual(r.links.map((l) => l.kind), ['youtube', 'gdrive']);
    assert.equal(r.rejected, 2);
    assert.ok(r.links[0].title.length > 0);
  });
  it('parseIdList: số nguyên dương, bỏ trùng', () => {
    assert.deepEqual(parseIdList([3, '3', 0, -1, 2.5, 'x', 7]), [3, 7]);
    assert.deepEqual(parseIdList(null), []);
  });
  it('linkUrl: đối tượng tham số ⇒ link trang lớp (9b/9c truyền { tab, a } / { tab, q })', () => {
    assert.equal(linkUrl(4, { tab: 'classwork', q: '7' }), '/work/classes?id=4&tab=classwork&q=7');
    assert.equal(linkUrl(4, '/work/classes?id=4&tab=classwork&a=1'), '/work/classes?id=4&tab=classwork&a=1');
    assert.equal(linkUrl(4, null), null);
  });
});

describe('tài liệu', () => {
  it('kéo-thả: thứ tự mới; id lạ / trùng ⇒ null; id không gửi lên xếp cuối', () => {
    assert.deepEqual(reorderPlan([1, 2, 3], [3, 1, 2]), [{ id: 3, position: 0 }, { id: 1, position: 1 }, { id: 2, position: 2 }]);
    assert.deepEqual(reorderPlan([1, 2, 3], [2]), [{ id: 2, position: 0 }, { id: 1, position: 1 }, { id: 3, position: 2 }]);
    assert.equal(reorderPlan([1, 2], [1, 9]), null);
    assert.equal(reorderPlan([1, 2], [1, 1]), null);
  });
  it('tỉ lệ xem', () => {
    assert.equal(viewRate(1, 3), 33.3);
    assert.equal(viewRate(5, 3), 100);
    assert.equal(viewRate(0, 0), null);
  });
});

describe('điểm danh', () => {
  it('mã 6 số, giữ số 0 đầu; làm sạch mã nhập', () => {
    assert.equal(newCheckinCode(() => 42), '000042');
    assert.equal(newCheckinCode(() => 999_999), '999999');
    assert.ok(isCheckinCode('012345'));
    assert.ok(!isCheckinCode('12345'));
    assert.equal(cleanCheckinCode(' 123-456 '), '123456');
  });
  it('PRESENT trong giờ cho phép, LATE sau đó', () => {
    const start = new Date('2026-10-13T01:00:00Z');
    assert.equal(checkinStatusAt(start, new Date('2026-10-13T00:55:00Z'), 10), 'PRESENT');
    assert.equal(checkinStatusAt(start, new Date('2026-10-13T01:10:00Z'), 10), 'PRESENT');
    assert.equal(checkinStatusAt(start, new Date('2026-10-13T01:10:01Z'), 10), 'LATE');
  });
  it('sai quá số lần ⇒ khoá tới hết cửa sổ, rồi mở lại', () => {
    const m = new Map<string, { n: number; until: number }>();
    const t = NOW.getTime();
    for (let i = 0; i < CHECKIN_MAX_FAILS - 1; i++) noteFail(m, 'k', t);
    assert.equal(isLocked(m, 'k', t), false);
    noteFail(m, 'k', t);
    assert.equal(isLocked(m, 'k', t), true);
    assert.equal(isLocked(m, 'khác', t), false);
    assert.equal(isLocked(m, 'k', t + CHECKIN_FAIL_WINDOW_MS + 1), false);
  });
  it('thống kê vắng: buổi đã điểm danh mà không có dòng = vắng; vắng có phép không tính; cờ > ngưỡng', () => {
    const held = [1, 2, 3, 4, 5];
    const cells = [
      { sessionId: 1, studentId: 10, status: 'PRESENT' }, { sessionId: 2, studentId: 10, status: 'LATE' }, { sessionId: 3, studentId: 10, status: 'EXCUSED' },
      { sessionId: 4, studentId: 10, status: 'PRESENT' }, { sessionId: 5, studentId: 10, status: 'PRESENT' },
      { sessionId: 1, studentId: 11, status: 'PRESENT' }, { sessionId: 2, studentId: 11, status: 'ABSENT' },
      { sessionId: 9, studentId: 11, status: 'ABSENT' }, // buổi chưa tính ⇒ bỏ qua
    ];
    const [a, b, c] = attendanceSummary([10, 11, 12], held, cells, 20);
    assert.deepEqual([a.present, a.late, a.excused, a.absent, a.absentPct, a.over], [3, 1, 1, 0, 0, false]);
    assert.deepEqual([b.present, b.absent, b.unmarked, b.absentPct, b.over], [1, 4, 3, 80, true]);
    assert.deepEqual([c.absent, c.absentPct, c.over], [5, 100, true]);
    assert.equal(attendanceSummary([1], [], [], 20)[0].absentPct, null, 'chưa buổi nào ⇒ null');
    // Đúng ngưỡng 20% (1/5) KHÔNG bị cờ; vượt mới bị.
    assert.equal(attendanceSummary([1], held, held.slice(1).map((s) => ({ sessionId: s, studentId: 1, status: 'PRESENT' })), 20)[0].over, false);
  });
  it('buổi định kỳ: T2+T5 lúc 07:30 giờ VN, 4 tuần ⇒ 8 buổi, giờ UTC đúng', () => {
    const occ = seriesOccurrences({ freq: 'WEEKLY', interval: 1, byWeekday: [1, 4], byMonthDay: null, hour: 7, minute: 30, startDate: '2026-09-07', endDate: '2026-10-03' }, 'Asia/Ho_Chi_Minh', 90);
    assert.equal(occ.length, 8);
    assert.equal(occ[0].day, '2026-09-07');
    assert.equal(occ[0].startsAt.toISOString(), '2026-09-07T00:30:00.000Z');
    assert.equal(occ[0].endsAt.toISOString(), '2026-09-07T02:00:00.000Z');
    assert.equal(occ[1].day, '2026-09-10');
  });
  it('buổi định kỳ không ngày kết thúc ⇒ 20 tuần, trần 120 buổi', () => {
    const w = seriesOccurrences({ freq: 'WEEKLY', interval: 1, byWeekday: [], byMonthDay: null, hour: 8, minute: 0, startDate: '2026-09-07', endDate: null }, 'Asia/Ho_Chi_Minh', 60);
    assert.equal(w.length, 20);
    const d = seriesOccurrences({ freq: 'DAILY', interval: 1, byWeekday: [], byMonthDay: null, hour: 8, minute: 0, startDate: '2026-09-07', endDate: '2027-09-07' }, 'Asia/Ho_Chi_Minh', 60);
    assert.equal(d.length, 120);
  });
});
