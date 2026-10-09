/**
 * Luật thuần của Portfolio + Workload (đợt S3a): RAG, quy đổi giờ, rải giờ theo
 * ngày, tải theo tuần. Không chạm DB — chạy trong `npm test`.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  RAG_RULES, addDays, allocate, issueHours, loadTone, mondayOf, personWeeks, plannedDate, ragOf, weeksOf, workDays, type RagInput,
} from './portfolioRules.js';

const base: RagInput = { open: 20, overdue: 0, sprint: null, milestones: [], blockedBy: 0, pendingApprovals: 0, oldestPendingApprovalDays: null };
const sprint = (o: Partial<NonNullable<RagInput['sprint']>> = {}): NonNullable<RagInput['sprint']> => ({
  name: 'S1', status: 'ON_TRACK', daysLeft: 5, neededPerDay: 2, recentPerDay: 2, unit: 'POINTS', ...o,
});
const codes = (i: RagInput) => ragOf(i).reasons.map((r) => r.code);

describe('ragOf — luật sức khoẻ', () => {
  it('không có gì đáng lo ⇒ GREEN kèm một lý do ALL_CLEAR', () => {
    const r = ragOf({ ...base, sprint: sprint() });
    assert.equal(r.rag, 'GREEN');
    assert.deepEqual(codes({ ...base, sprint: sprint() }), ['ALL_CLEAR']);
    assert.match(r.reasons[0].text, /sprint on track/);
  });

  it('mốc trễ ⇒ RED, lý do nói tên mốc và số ngày trễ', () => {
    const r = ragOf({ ...base, milestones: [{ name: 'v1.0', date: '2026-10-01', daysUntil: -3, total: 4, done: 1 }] });
    assert.equal(r.rag, 'RED');
    assert.equal(r.reasons[0].code, 'MILESTONE_LATE');
    assert.match(r.reasons[0].text, /"v1\.0".*3 days ago/);
  });

  it('sprint AT_RISK hết hạn ⇒ RED SPRINT_ENDED; cần ≥2× tốc độ ⇒ RED; nhẹ hơn ⇒ AMBER', () => {
    assert.deepEqual(codes({ ...base, sprint: sprint({ status: 'AT_RISK', daysLeft: 0 }) }), ['SPRINT_ENDED']);
    assert.deepEqual(codes({ ...base, sprint: sprint({ status: 'AT_RISK', neededPerDay: 4, recentPerDay: 2 }) }), ['SPRINT_PACE_SEVERE']);
    assert.deepEqual(codes({ ...base, sprint: sprint({ status: 'AT_RISK', neededPerDay: 3, recentPerDay: 0 }) }), ['SPRINT_PACE_SEVERE']);
    const mild = ragOf({ ...base, sprint: sprint({ status: 'AT_RISK', neededPerDay: 3, recentPerDay: 2 }) });
    assert.equal(mild.rag, 'AMBER');
    assert.deepEqual(mild.reasons.map((r) => r.code), ['SPRINT_AT_RISK']);
  });

  it('TOO_EARLY / NO_ESTIMATES không phải tín hiệu rủi ro', () => {
    assert.equal(ragOf({ ...base, sprint: sprint({ status: 'TOO_EARLY', neededPerDay: 99, recentPerDay: 0 }) }).rag, 'GREEN');
    assert.equal(ragOf({ ...base, sprint: sprint({ status: 'NO_ESTIMATES' }) }).rag, 'GREEN');
  });

  it('ngưỡng quá hạn: 1 ⇒ AMBER; 3/12 (25%) ⇒ RED; 3/20 ⇒ AMBER; 10 ⇒ RED bất kể tỉ lệ', () => {
    assert.equal(ragOf({ ...base, overdue: 1 }).rag, 'AMBER');
    assert.equal(ragOf({ ...base, open: 12, overdue: RAG_RULES.RED_OVERDUE_MIN }).rag, 'RED');
    assert.equal(ragOf({ ...base, open: 20, overdue: 3 }).rag, 'AMBER');
    assert.equal(ragOf({ ...base, open: 500, overdue: RAG_RULES.RED_OVERDUE_ABS }).rag, 'RED');
    assert.deepEqual(codes({ ...base, open: 500, overdue: 10 }), ['OVERDUE_MANY']);
  });

  it('mốc ≤7 ngày mà < 80% xong ⇒ AMBER; ≥80% hoặc còn xa ⇒ không', () => {
    const soon = (done: number, daysUntil: number) => ({ ...base, milestones: [{ name: 'M', date: '2026-10-08', daysUntil, total: 10, done }] });
    assert.deepEqual(codes(soon(5, 4)), ['MILESTONE_SOON']);
    assert.match(ragOf(soon(5, 0)).reasons[0].text, /due today with 5\/10/);
    assert.deepEqual(codes(soon(8, 4)), ['ALL_CLEAR']);
    assert.deepEqual(codes(soon(0, 8)), ['ALL_CLEAR']);
  });

  it('bị chặn liên dự án + phê duyệt chờ lâu ⇒ AMBER; đỏ luôn đứng trước vàng', () => {
    const r = ragOf({ ...base, blockedBy: 2, pendingApprovals: 1, oldestPendingApprovalDays: 5, overdue: 12 });
    assert.equal(r.rag, 'RED');
    assert.deepEqual(r.reasons.map((x) => x.level), ['RED', 'AMBER', 'AMBER']);
    assert.deepEqual(codes({ ...base, pendingApprovals: 1, oldestPendingApprovalDays: 3 }), ['ALL_CLEAR']);
  });
});

describe('issueHours — quy đổi giờ', () => {
  const none = { remainingEstimateMin: null, originalEstimateMin: null, timeSpentMin: 0, storyPoints: null };
  it('ưu tiên remaining → original − spent → điểm × h/điểm → 0', () => {
    assert.deepEqual(issueHours({ ...none, remainingEstimateMin: 90, originalEstimateMin: 600, storyPoints: 8 }), { hours: 1.5, source: 'remaining' });
    assert.deepEqual(issueHours({ ...none, remainingEstimateMin: 0, originalEstimateMin: 600 }), { hours: 0, source: 'remaining' });
    assert.deepEqual(issueHours({ ...none, originalEstimateMin: 600, timeSpentMin: 120 }), { hours: 8, source: 'original' });
    assert.deepEqual(issueHours({ ...none, originalEstimateMin: 60, timeSpentMin: 300 }), { hours: 0, source: 'original' });
    assert.deepEqual(issueHours({ ...none, storyPoints: 3 }), { hours: 12, source: 'points' });
    assert.deepEqual(issueHours({ ...none, storyPoints: 3 }, 2), { hours: 6, source: 'points' });
    assert.deepEqual(issueHours(none), { hours: 0, source: 'none' });
  });
  it('thẻ cha có việc con ước lượng ⇒ 0 (không đếm đôi)', () => {
    assert.deepEqual(issueHours({ ...none, storyPoints: 5, hasEstimatedChildren: true }), { hours: 0, source: 'children' });
  });
});

describe('lịch: tuần, ngày làm việc, rải giờ', () => {
  it('mondayOf / weeksOf / workDays', () => {
    assert.equal(mondayOf('2026-10-04'), '2026-09-28'); // CN → T2 tuần đó
    assert.equal(mondayOf('2026-10-05'), '2026-10-05');
    assert.deepEqual(weeksOf('2026-10-05', addDays('2026-10-05', 13)), [{ start: '2026-10-05', end: '2026-10-11' }, { start: '2026-10-12', end: '2026-10-18' }]);
    assert.equal(workDays('2026-10-05', '2026-10-11').length, 5);
    assert.equal(workDays('2026-10-05', '2026-10-11', [{ start: '2026-10-06', end: '2026-10-07' }]).length, 3);
  });
  it('allocate: rải đều từ hôm nay tới hạn; quá hạn dồn về hôm nay; cuối tuần dồn vào ngày hạn', () => {
    const a = allocate(10, { start: null, due: '2026-10-09' }, '2026-10-05');
    assert.equal(a.length, 5);
    assert.equal(a[0].hours, 2);
    assert.deepEqual(allocate(6, { start: '2026-09-01', due: '2026-10-01' }, '2026-10-05'), [{ day: '2026-10-05', hours: 6 }]);
    assert.deepEqual(allocate(4, { start: null, due: '2026-10-10' }, '2026-10-10'), [{ day: '2026-10-10', hours: 4 }]);
    // Quá hạn mà hôm nay là Chủ nhật ⇒ dồn sang thứ Hai (ngày làm việc gần nhất), không vào ngày năng lực 0.
    assert.deepEqual(allocate(6, { start: null, due: '2026-10-01' }, '2026-10-04'), [{ day: '2026-10-05', hours: 6 }]);
    assert.equal(allocate(8, { start: '2026-10-08', due: '2026-10-09' }, '2026-10-05').length, 2);
    assert.deepEqual(allocate(0, { start: null, due: '2026-10-09' }, '2026-10-05'), []);
  });
  it('loadTone: >100% quá tải; có việc mà năng lực 0 ⇒ quá tải', () => {
    assert.deepEqual(loadTone(41, 40), { pct: 102.5, overloaded: true, level: 'over' });
    assert.deepEqual(loadTone(40, 40), { pct: 100, overloaded: false, level: 'high' });
    assert.deepEqual(loadTone(4, 0), { pct: null, overloaded: true, level: 'over' });
    assert.deepEqual(loadTone(0, 0), { pct: null, overloaded: false, level: 'none' });
  });
});

describe('personWeeks — tải theo tuần', () => {
  const weeks = weeksOf('2026-10-05', '2026-10-18');
  it('quá tải tuần 1, nhẹ tuần 2; ngày nghỉ trừ năng lực', () => {
    const w = personWeeks({
      weeks, from: '2026-10-05', to: '2026-10-18', today: '2026-10-05', hoursPerDay: 8,
      off: [{ start: '2026-10-12', end: '2026-10-13' }],
      issues: [
        { id: 1, hours: 30, start: null, due: '2026-10-09' },
        { id: 2, hours: 20, start: '2026-10-08', due: '2026-10-09' },
        { id: 3, hours: 6, start: '2026-10-14', due: '2026-10-16' },
        { id: 4, hours: 0, start: null, due: '2026-10-15' },
        { id: 5, hours: 5, start: null, due: null },
      ],
    });
    assert.equal(w[0].capacity, 40);
    assert.equal(w[0].hours, 50);
    assert.equal(w[0].overloaded, true);
    assert.deepEqual(w[0].issueIds.sort(), [1, 2]);
    assert.equal(w[1].capacity, 24); // 5 ngày − 2 ngày nghỉ
    assert.equal(w[1].hours, 6);
    assert.equal(w[1].overloaded, false);
    assert.deepEqual(w[1].issueIds.sort(), [3, 4]);
  });
  it('thẻ quá hạn dồn về ngày làm việc gần nhất (tuần chứa hôm nay)', () => {
    const w = personWeeks({ weeks, from: '2026-10-05', to: '2026-10-18', today: '2026-10-13', hoursPerDay: 8, off: [], issues: [{ id: 9, hours: 50, start: null, due: '2026-10-01' }] });
    assert.equal(w[0].hours, 0);
    assert.equal(w[1].hours, 50);
    assert.equal(w[1].overloaded, true);
  });
});

describe('openIssues — một định nghĩa "open" cho Projects / Portfolio / Dashboard (UX-A P0-2)', async () => {
  const { OPEN_ISSUES_DEFINITION, OPEN_ISSUES_JQL, isOpenIssue, openIssueWhere, countedIssueWhere } = await import('./openIssues.js');
  it('chưa Done + không phải sub-task ⇒ open; epic (level 1) và test vẫn tính', () => {
    assert.equal(isOpenIssue({ resolvedAt: null, typeLevel: 0 }), true);
    assert.equal(isOpenIssue({ resolvedAt: null, typeLevel: 1 }), true, 'epic tính');
    assert.equal(isOpenIssue({ resolvedAt: null, typeLevel: -1 }), false, 'sub-task không tính');
    assert.equal(isOpenIssue({ resolvedAt: new Date(), typeLevel: 0 }), false, 'Done không tính');
    assert.equal(isOpenIssue({ resolvedAt: null, typeLevel: 0, deletedAt: new Date() }), false, 'đã xoá không tính');
  });
  it('điều kiện Prisma và JQL nói cùng một điều', () => {
    assert.deepEqual(openIssueWhere(), { deletedAt: null, resolvedAt: null, type: { level: { gte: 0 } } });
    assert.deepEqual(countedIssueWhere(), { deletedAt: null, type: { level: { gte: 0 } } });
    assert.match(OPEN_ISSUES_JQL, /statusCategory != Done/);
    assert.match(OPEN_ISSUES_JQL, /type != "Sub-task"/);
    assert.match(OPEN_ISSUES_DEFINITION, /excluding sub-tasks/);
  });
});

describe('UX-B (d) — thẻ không có hạn vẫn vào lưới Workload', () => {
  it('plannedDate: hạn > ngày kết thúc sprint > ngày phát hành version > null', () => {
    assert.deepEqual(plannedDate({ due: '2026-10-20', sprintEnd: '2026-10-16', versionRelease: '2026-11-01' }), { day: '2026-10-20', source: 'due' });
    assert.deepEqual(plannedDate({ due: null, sprintEnd: '2026-10-16', versionRelease: '2026-11-01' }), { day: '2026-10-16', source: 'sprint' });
    assert.deepEqual(plannedDate({ due: null, sprintEnd: null, versionRelease: '2026-11-01' }), { day: '2026-11-01', source: 'version' });
    assert.deepEqual(plannedDate({ due: null, sprintEnd: null, versionRelease: null }), { day: null, source: null });
  });
  it('12 thẻ trong sprint, không hạn, 2 h mỗi thẻ ⇒ 24 h rải tới ngày kết thúc sprint (không còn 0%)', () => {
    // Thứ Hai 12/10 → thứ Sáu 16/10: 5 ngày làm việc × 8 h = 40 h năng lực; 24 h tải ⇒ 60%.
    const weeks = weeksOf('2026-10-12', '2026-10-18');
    const issues = Array.from({ length: 12 }, (_, k) => ({ id: k + 1, hours: 2, start: null, due: plannedDate({ due: null, sprintEnd: '2026-10-16', versionRelease: null }).day }));
    const w = personWeeks({ weeks, from: '2026-10-12', to: '2026-10-18', today: '2026-10-12', hoursPerDay: 8, off: [], issues });
    assert.equal(w[0].capacity, 40);
    assert.equal(w[0].hours, 24);
    assert.equal(w[0].pct, 60);
    assert.equal(w[0].issueIds.length, 12);
  });
});
