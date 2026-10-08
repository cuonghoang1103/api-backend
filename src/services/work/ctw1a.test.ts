/**
 * CT Work — đợt 1a (08/10/2026): phần THUẦN của các bản sửa CTW-9/14/15/18/38.
 *   npx tsx --test src/services/work/ctw1a.test.ts
 * Phần chạm route/DB ở src/routes/work.ctw1a.db.test.ts (WORK_DB_TEST=1).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { normalizeIssueRefBody, parseIssueRef } from './issueRefs.js';
import { computeLoads, overloadFact, workingDaysLeft } from './insightLoad.js';
import { addDays, dayInZone, lastWeekPeriod, zonedMidnight } from './projectTime.js';
import { weekIsOver } from './financeRules.js';
import { reportEmailLines, reportMarkdown, type ReportData } from './reportRender.js';
import { requestTypesOf } from './slaRules.js';
import { ragOf, type RagInput } from './portfolioRules.js';

describe('CTW-15: số thẻ / khoá thẻ', () => {
  it('parseIssueRef đọc FP-12, fp-12, #12, "12", 12; từ chối rác', () => {
    assert.deepEqual(parseIssueRef('FP-12'), { key: 'FP', number: 12 });
    assert.deepEqual(parseIssueRef(' fp-12 '), { key: 'FP', number: 12 });
    assert.deepEqual(parseIssueRef('#12'), { number: 12 });
    assert.deepEqual(parseIssueRef('12'), { number: 12 });
    assert.deepEqual(parseIssueRef(12), { number: 12 });
    for (const bad of ['STORY', 'FP-', 'FP-0', 0, -1, 1.5, null, undefined, {}]) assert.equal(parseIssueRef(bad), null, String(bad));
  });
  it('normalizeIssueRefBody: typeId chữ ⇒ typeKey, parentId chữ ⇒ parentKey; số giữ nguyên; không đụng bản gốc', () => {
    const raw = { typeId: 'STORY', parentId: 'FP-1', title: 'x' };
    assert.deepEqual(normalizeIssueRefBody(raw), { typeKey: 'STORY', parentKey: 'FP-1', title: 'x' });
    assert.equal(raw.typeId, 'STORY');
    assert.deepEqual(normalizeIssueRefBody({ typeId: 3, parentId: '7' }), { typeId: 3, parentId: '7' });
    assert.equal(normalizeIssueRefBody(null), null);
  });
});

describe('CTW-9: tải theo phạm vi + sức chứa', () => {
  const members = [
    { id: 1, username: 'client', capacityHours: null },
    { id: 2, username: 'server', capacityHours: null },
    { id: 3, username: 'art', capacityHours: 2 },
  ];
  it('người có capacityHours: so với giờ/ngày × ngày còn lại (điểm quy đổi 4 h/điểm)', () => {
    const loads = computeLoads({ members, issues: [{ assigneeId: 3, estimate: 3 }], mode: 'POINTS', daysLeft: 5 });
    const art = loads.find((l) => l.username === 'art')!;
    assert.equal(art.capacity, 2.5); // 2 h × 5 ngày / 4 h mỗi điểm
    assert.equal(art.overloaded, true);
    assert.equal(art.basis, 'capacity');
    assert.equal(art.unit, 'points');
    const ok = computeLoads({ members, issues: [{ assigneeId: 3, estimate: 2 }], mode: 'POINTS', daysLeft: 5 }).find((l) => l.username === 'art')!;
    assert.equal(ok.overloaded, false);
  });
  it('chưa khai sức chứa ⇒ luật tương đối (> 1,6× trung bình và chênh ≥ 3)', () => {
    const loads = computeLoads({ members, issues: [{ assigneeId: 1, estimate: 10 }, { assigneeId: 2, estimate: 1 }], mode: 'HOURS', daysLeft: 5 });
    assert.equal(loads.find((l) => l.username === 'client')!.overloaded, true);
    assert.equal(loads.find((l) => l.username === 'client')!.basis, 'relative');
    assert.equal(loads[0].unit, 'hours');
  });
  it('dữ kiện cho AI luôn có đơn vị + phạm vi (không còn "61 items")', () => {
    const loads = computeLoads({ members, issues: [{ assigneeId: 1, estimate: 61 }], mode: 'POINTS', daysLeft: 5 });
    const f = overloadFact(loads, 'active sprint "S1"');
    assert.match(f, /Overloaded \(active sprint "S1"\): @client 61 points assigned/);
    assert.equal(overloadFact([], 'x'), 'Overloaded (x): none.');
  });
  it('workingDaysLeft: T2–T6 theo lịch VN, tính cả hai đầu, tối thiểu 1', () => {
    // 2026-10-05 là thứ Hai; 01:00 thứ Hai giờ VN = 18:00Z Chủ nhật.
    assert.equal(workingDaysLeft(new Date('2026-10-04T18:00:00Z'), new Date('2026-10-11T10:00:00Z')), 5);
    assert.equal(workingDaysLeft(new Date('2026-10-10T03:00:00Z'), new Date('2026-10-11T03:00:00Z')), 1); // T7→CN
  });
});

describe('CTW-18: ngày theo múi giờ dự án', () => {
  // 00:40 ngày 06/10 giờ VN = 17:40Z ngày 05/10 — đúng lúc tái hiện lỗi.
  const t = new Date('2026-10-05T17:40:00Z');
  it('dayInZone / zonedMidnight', () => {
    assert.equal(dayInZone(t), '2026-10-06');
    assert.equal(dayInZone(t, 'UTC'), '2026-10-05');
    assert.equal(dayInZone(t, 'Not/AZone'), '2026-10-06'); // múi giờ hỏng ⇒ giờ VN
    assert.equal(zonedMidnight('2026-09-30').toISOString(), '2026-09-29T17:00:00.000Z');
    assert.equal(zonedMidnight('2026-07-01', 'Europe/London').toISOString(), '2026-06-30T23:00:00.000Z'); // BST
    assert.equal(addDays('2026-10-06', -6), '2026-09-30');
  });
  it('kỳ báo cáo AI tuần = kỳ xem trước (30/09 → 06/10), không phải 28/09 → 05/10 theo UTC', () => {
    const p = lastWeekPeriod(t);
    assert.deepEqual({ from: p.from, to: p.to }, { from: '2026-09-30', to: '2026-10-06' });
    assert.equal(p.since.toISOString(), '2026-09-29T17:00:00.000Z');
  });
});

describe('CTW-38: chỉ duyệt tuần đã kết thúc', () => {
  it('weekIsOver theo ngày VN', () => {
    assert.equal(weekIsOver('2026-10-05', '2026-10-06'), false); // thứ Ba trong tuần
    assert.equal(weekIsOver('2026-10-05', '2026-10-11'), false); // Chủ nhật — tuần chưa hết
    assert.equal(weekIsOver('2026-10-05', '2026-10-12'), true); // thứ Hai tuần sau
  });
});

describe('CTW-14: chữ tự sinh theo ngôn ngữ dự án', () => {
  const d: ReportData = {
    formatVersion: 1, audience: 'client', project: { key: 'FP', name: 'Flying Pencil' }, period: { from: '2026-09-30', to: '2026-10-06' }, generatedAt: '2026-10-06T00:00:00Z',
    stages: [{ n: 1, name: 'Phong cách', status: 'ACTIVE', percent: 40 }], currentStage: { n: 1, name: 'Phong cách', status: 'ACTIVE', percent: 40 }, overallPercent: 40,
    completed: [], inProgress: [{ key: 'FP-3', title: 'Địa cầu' }], waitingOnClient: [{ title: 'Duyệt cổng', kind: 'APPROVAL', dueAt: null }],
    upcoming: { versions: [], payments: [{ number: 1, name: 'Đặt cọc', amount: 1000, dueDate: '2026-10-10', status: 'DUE' }] }, currency: 'VND',
    changes: null, risks: null, nextSteps: [], counts: { completed: 0, inProgress: 1, open: 3 },
  };
  it('báo cáo khách tiếng Việt khi language = vi; thiếu trường ⇒ tiếng Anh như cũ', () => {
    const vi = reportMarkdown({ ...d, language: 'vi' });
    assert.match(vi, /# Cập nhật hằng tuần — Flying Pencil/);
    assert.match(vi, /Kỳ báo cáo: 2026-09-30 → 2026-10-06/);
    assert.match(vi, /## Đang chờ anh\/chị/);
    assert.match(vi, /Phong cách — đang làm/);
    assert.match(vi, /Thanh toán: Đặt cọc .*hạn 2026-10-10 \(đến hạn\)/);
    assert.doesNotMatch(vi, /Weekly update|Nothing completed|Waiting on/);
    assert.ok(reportEmailLines({ ...d, language: 'vi' })[0].startsWith('Cập nhật hằng tuần của dự án Flying Pencil'));
    assert.match(reportMarkdown(d), /# Weekly update — Flying Pencil/);
  });
  it('loại yêu cầu desk mặc định dịch sang tiếng Việt; tên người quản trị tự đặt giữ nguyên', () => {
    const vi = requestTypesOf(undefined, 'vi');
    assert.equal(vi.find((t) => t.key === 'INCIDENT')!.name, 'Báo sự cố');
    assert.equal(vi.find((t) => t.key === 'INCIDENT')!.fields[0].label, 'Phần nào bị ảnh hưởng (trang, tính năng, hệ thống)?');
    const custom = requestTypesOf([{ key: 'INCIDENT', name: 'Outage' }], 'vi');
    assert.equal(custom.find((t) => t.key === 'INCIDENT')!.name, 'Outage');
    assert.equal(requestTypesOf(undefined).find((t) => t.key === 'INCIDENT')!.name, 'Report an incident');
  });
  it('lý do sức khoẻ portfolio tiếng Việt; mã không đổi', () => {
    const base: RagInput = { open: 10, overdue: 1, sprint: null, milestones: [], blockedBy: 0, pendingApprovals: 0, oldestPendingApprovalDays: null };
    const vi = ragOf(base, 'vi');
    assert.equal(vi.reasons[0].code, 'OVERDUE_SOME');
    assert.equal(vi.reasons[0].text, '1 thẻ quá hạn trên 10 thẻ đang mở.');
    assert.equal(ragOf(base).reasons[0].text, '1 issue overdue out of 10 open.');
    assert.match(ragOf({ ...base, overdue: 0 }, 'vi').reasons[0].text, /^Không có thẻ quá hạn/);
  });
});
