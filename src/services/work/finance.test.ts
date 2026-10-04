/**
 * CT Work đợt S4 — luật thuần của tài chính + báo cáo (financeRules.ts, reportRender.ts). Chạy trong `npm test`.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, it } from 'node:test';
import {
  alertToSend, budgetSummary, financeAccess, isoWeekKey, isWeekStart, lineCost, localWeekdayHour, milestoneAmount, milestonesTriggeredBy,
  paymentTransitionOk, percentComplete, pickRate, reportDue, timesheetTransitionOk, weekEndOf, weekLocked, weekStartOf, type RateRow,
} from './financeRules.js';
import { reportEmailLines, reportMarkdown, type ReportData } from './reportRender.js';
import { clientPortalRouteAllowed } from './permissions.js';
import { defaultModulesFor } from './studio.js';

describe('S4 — quyền tài chính', () => {
  it('khách/GUEST không gì; ADMIN mọi thứ; MEMBER chỉ giờ mình; lead duyệt bộ phận', () => {
    assert.deepEqual(financeAccess('CLIENT', 'MEMBER', false), { manage: false, ownTimesheet: false, review: null });
    assert.deepEqual(financeAccess('MEMBER', 'GUEST', true), { manage: false, ownTimesheet: false, review: null });
    assert.deepEqual(financeAccess('TEACHER', 'GUEST', false), { manage: false, ownTimesheet: false, review: null });
    assert.deepEqual(financeAccess('ADMIN', 'OWNER', false), { manage: true, ownTimesheet: true, review: 'ALL' });
    assert.deepEqual(financeAccess('MEMBER', 'MEMBER', false), { manage: false, ownTimesheet: true, review: null });
    assert.deepEqual(financeAccess('MEMBER', 'MEMBER', true), { manage: false, ownTimesheet: true, review: 'TEAM' });
    assert.deepEqual(financeAccess('VIEWER', 'MEMBER', false), { manage: false, ownTimesheet: false, review: null });
    assert.deepEqual(financeAccess('VIEWER', 'MEMBER', true), { manage: false, ownTimesheet: false, review: 'TEAM' });
    assert.deepEqual(financeAccess(null, null, false), { manage: false, ownTimesheet: false, review: null });
  });
  it('dự án CLIENT mới bật finance + reports; loại khác thì không', () => {
    assert.deepEqual([defaultModulesFor('CLIENT').finance, defaultModulesFor('CLIENT').reports], [true, true]);
    for (const k of ['SOFTWARE', 'SCHOOL', 'PERSONAL'] as const) assert.deepEqual([defaultModulesFor(k).finance, defaultModulesFor(k).reports], [false, false], k);
  });
  it('danh sách trắng khách: tài chính/báo cáo/thuyết trình/xuất bị chặn; /portal/payments + /portal/reports mở', () => {
    for (const [m, p] of [['GET', '/finance/summary'], ['GET', '/finance/rates'], ['GET', '/finance/timesheet'], ['POST', '/finance/timesheets/submit'], ['GET', '/reports/steering'],
      ['GET', '/reports/client-weekly/preview'], ['GET', '/reports/history'], ['GET', '/present'], ['POST', '/exports'], ['GET', '/exports/3']] as const) {
      assert.equal(clientPortalRouteAllowed(m, p), false, `${m} ${p}`);
    }
    for (const p of ['/portal/payments', '/portal/reports', '/portal/reports/4']) assert.equal(clientPortalRouteAllowed('GET', p), true, p);
  });
});

describe('S4 — tuần & trạng thái timesheet', () => {
  it('tuần T2→CN, ISO week', () => {
    assert.equal(weekStartOf('2026-10-04'), '2026-09-28'); // Chủ nhật ⇒ thứ Hai trước đó
    assert.equal(weekStartOf('2026-09-28'), '2026-09-28');
    assert.equal(weekEndOf('2026-09-28'), '2026-10-04');
    assert.equal(isWeekStart('2026-09-28'), true);
    assert.equal(isWeekStart('2026-09-29'), false);
    assert.equal(isoWeekKey('2026-10-04'), '2026-W40');
    assert.equal(isoWeekKey('2021-01-03'), '2020-W53');
    assert.equal(isoWeekKey('2026-01-01'), '2026-W01');
  });
  it('khoá khi đã nộp/đã duyệt; luồng chuyển hợp lệ', () => {
    assert.equal(weekLocked('SUBMITTED'), true);
    assert.equal(weekLocked('APPROVED'), true);
    for (const s of ['RETURNED', 'REOPENED', null]) assert.equal(weekLocked(s), false);
    assert.equal(timesheetTransitionOk(null, 'submit'), true);
    assert.equal(timesheetTransitionOk('RETURNED', 'submit'), true);
    assert.equal(timesheetTransitionOk('REOPENED', 'submit'), true);
    assert.equal(timesheetTransitionOk('SUBMITTED', 'submit'), false);
    assert.equal(timesheetTransitionOk('APPROVED', 'submit'), false);
    assert.equal(timesheetTransitionOk('SUBMITTED', 'approve'), true);
    assert.equal(timesheetTransitionOk('APPROVED', 'approve'), false);
    assert.equal(timesheetTransitionOk('APPROVED', 'reopen'), true);
    assert.equal(timesheetTransitionOk('SUBMITTED', 'reopen'), false);
    assert.equal(timesheetTransitionOk('SUBMITTED', 'withdraw'), true);
    assert.equal(timesheetTransitionOk('APPROVED', 'withdraw'), false);
  });
});

describe('S4 — đơn giá', () => {
  const rates: RateRow[] = [
    { id: 1, scope: 'DEFAULT', projectRole: null, teamId: null, userId: null, hourlyRate: 100, effectiveFrom: null },
    { id: 2, scope: 'ROLE', projectRole: 'ADMIN', teamId: null, userId: null, hourlyRate: 300, effectiveFrom: null },
    { id: 3, scope: 'TEAM', projectRole: null, teamId: 7, userId: null, hourlyRate: 200, effectiveFrom: null },
    { id: 4, scope: 'TEAM', projectRole: null, teamId: 7, userId: null, hourlyRate: 250, effectiveFrom: '2026-10-01' },
    { id: 5, scope: 'USER', projectRole: null, teamId: null, userId: 42, hourlyRate: 500, effectiveFrom: '2026-09-15' },
  ];
  const base = { userId: 1, issueTeamId: null, userTeamIds: [], projectRole: 'MEMBER', day: '2026-09-20' };
  it('USER → TEAM của thẻ → TEAM của người → ROLE → DEFAULT, theo ngày hiệu lực', () => {
    assert.deepEqual(pickRate(rates, base), { rate: 100, source: 'DEFAULT' });
    assert.deepEqual(pickRate(rates, { ...base, projectRole: 'ADMIN' }), { rate: 300, source: 'ROLE' });
    assert.deepEqual(pickRate(rates, { ...base, userTeamIds: [9, 7] }), { rate: 200, source: 'TEAM' });
    assert.deepEqual(pickRate(rates, { ...base, issueTeamId: 7, day: '2026-10-02' }), { rate: 250, source: 'TEAM' });
    assert.deepEqual(pickRate(rates, { ...base, userId: 42, day: '2026-09-10' }), { rate: 100, source: 'DEFAULT' }); // trước ngày hiệu lực
    assert.deepEqual(pickRate(rates, { ...base, userId: 42, issueTeamId: 7 }), { rate: 500, source: 'USER' });
    assert.equal(pickRate([], base), null);
    assert.equal(lineCost(90, 200), 300);
    assert.equal(lineCost(90, null), null);
  });
});

describe('S4 — ngân sách vs thực tế + EAC', () => {
  it('EAC = BAC ÷ CPI khi có % hoàn thành', () => {
    const s = budgetSummary({ budgetTotal: 1000, budgetLinesSum: 0, laborCost: 600, expenseCost: 100, last28Cost: 400, percentComplete: 0.5, today: '2026-10-04', plannedEnd: null });
    assert.equal(s.actual, 700);
    assert.equal(s.percentUsed, 70);
    assert.equal(s.ev, 500);
    assert.equal(s.cpi, 0.714);
    assert.equal(s.eac, 1400.56);
    assert.equal(s.eacMethod, 'CPI');
    assert.equal(s.burnRatePerWeek, 100);
    assert.deepEqual(s.alerts, ['FORECAST_OVER']);
    assert.equal(s.alertLevel, 0);
  });
  it('chưa có % hoàn thành ⇒ theo tốc độ đốt tới ngày kết thúc; ngân sách = Σ dòng khi không đặt tổng', () => {
    const s = budgetSummary({ budgetTotal: null, budgetLinesSum: 2000, laborCost: 1700, expenseCost: 0, last28Cost: 400, percentComplete: 0, today: '2026-10-04', plannedEnd: '2026-10-18' });
    assert.equal(s.bac, 2000);
    assert.equal(s.eacMethod, 'BURN_RATE');
    assert.equal(s.eac, 1900); // 1700 + 100/tuần × 2 tuần
    assert.equal(s.percentUsed, 85);
    assert.deepEqual(s.alerts, ['WARN']);
    assert.equal(s.alertLevel, 80);
    const over = budgetSummary({ budgetTotal: 1000, budgetLinesSum: 0, laborCost: 1000, expenseCost: 50, last28Cost: 0, percentComplete: null, today: '2026-10-04', plannedEnd: null });
    assert.deepEqual(over.alerts, ['OVER']);
    assert.equal(over.eac, null); // không bịa số
    const none = budgetSummary({ budgetTotal: null, budgetLinesSum: 0, laborCost: 10, expenseCost: 0, last28Cost: 0, percentComplete: 0.2, today: '2026-10-04', plannedEnd: null });
    assert.equal(none.bac, null);
    assert.equal(none.percentUsed, null);
  });
  it('% hoàn thành theo ước lượng gốc, không có thì theo số thẻ; ngưỡng cảnh báo báo một lần', () => {
    assert.equal(percentComplete([{ originalEstimateMin: 60, done: true }, { originalEstimateMin: 180, done: false }, { originalEstimateMin: null, done: true }]), 0.25);
    assert.equal(percentComplete([{ originalEstimateMin: null, done: true }, { originalEstimateMin: null, done: false }]), 0.5);
    assert.equal(percentComplete([]), null);
    assert.equal(alertToSend(0, 80), 80);
    assert.equal(alertToSend(80, 80), null);
    assert.equal(alertToSend(80, 100), 100);
    assert.equal(alertToSend(100, 80), null);
    assert.equal(alertToSend(0, 0), null);
  });
});

describe('S4 — mốc thanh toán', () => {
  it('số tiền theo amount hoặc % hợp đồng; chuyển trạng thái', () => {
    assert.equal(milestoneAmount({ amount: 5000, percent: 30 }, 100000), 5000);
    assert.equal(milestoneAmount({ amount: null, percent: 30 }, 100000), 30000);
    assert.equal(milestoneAmount({ amount: null, percent: 30 }, null), null);
    assert.equal(paymentTransitionOk('PLANNED', 'DUE'), true);
    assert.equal(paymentTransitionOk('PLANNED', 'PAID'), true);
    assert.equal(paymentTransitionOk('DUE', 'PLANNED'), true);
    assert.equal(paymentTransitionOk('INVOICED', 'PLANNED'), false);
    assert.equal(paymentTransitionOk('PAID', 'INVOICED'), false);
    assert.equal(paymentTransitionOk('DUE', 'DUE'), false);
  });
  it('UAT của version/giai đoạn ⇒ mốc UAT; cổng giai đoạn ⇒ mốc STAGE_GATE; chỉ mốc PLANNED', () => {
    const ms = [
      { id: 1, status: 'PLANNED', trigger: 'UAT', versionId: 10, stageId: null },
      { id: 2, status: 'PLANNED', trigger: 'UAT', versionId: null, stageId: 5 },
      { id: 3, status: 'PLANNED', trigger: 'STAGE_GATE', versionId: null, stageId: 5 },
      { id: 4, status: 'DUE', trigger: 'UAT', versionId: 10, stageId: null },
      { id: 5, status: 'PLANNED', trigger: 'MANUAL', versionId: 10, stageId: 5 },
    ];
    assert.deepEqual(milestonesTriggeredBy({ targetType: 'UAT', stageId: null, uat: { versionId: 10, stageId: null } }, ms), [1]);
    assert.deepEqual(milestonesTriggeredBy({ targetType: 'UAT', stageId: null, uat: { versionId: null, stageId: 5 } }, ms), [2]);
    assert.deepEqual(milestonesTriggeredBy({ targetType: 'STAGE_GATE', stageId: 5, uat: null }, ms), [3]);
    assert.deepEqual(milestonesTriggeredBy({ targetType: 'ISSUE', stageId: null, uat: null }, ms), []);
  });
});

describe('S4 — lịch báo cáo + bản dựng xác định', () => {
  it('đúng thứ + đã qua giờ hẹn theo múi giờ', () => {
    const fri16vn = new Date('2026-10-02T09:30:00Z'); // 16:30 thứ Sáu giờ VN
    assert.deepEqual(localWeekdayHour(fri16vn, 'Asia/Ho_Chi_Minh'), { weekday: 5, hour: 16, day: '2026-10-02' });
    assert.equal(reportDue({ enabled: true, weekday: 5, hour: 16, timezone: 'Asia/Ho_Chi_Minh' }, fri16vn).due, true);
    assert.equal(reportDue({ enabled: true, weekday: 5, hour: 17, timezone: 'Asia/Ho_Chi_Minh' }, fri16vn).due, false);
    assert.equal(reportDue({ enabled: false, weekday: 5, hour: 9, timezone: 'Asia/Ho_Chi_Minh' }, fri16vn).due, false);
    assert.equal(reportDue({ enabled: true, weekday: 5, hour: 9, timezone: 'Europe/London' }, fri16vn).due, true); // 10:30 London
    assert.equal(localWeekdayHour(fri16vn, 'Not/AZone').weekday, 5); // múi giờ hỏng ⇒ giờ VN
  });
  it('Markdown + email chỉ dùng số liệu đưa vào, không tên người', () => {
    const d: ReportData = {
      formatVersion: 1, audience: 'client', project: { key: 'ACM', name: 'Acme portal' }, period: { from: '2026-09-28', to: '2026-10-04' }, generatedAt: '2026-10-04T00:00:00Z',
      stages: [{ n: 1, name: 'Discovery', status: 'DONE', percent: 100 }, { n: 2, name: 'Build', status: 'ACTIVE', percent: 40 }],
      currentStage: { n: 2, name: 'Build', status: 'ACTIVE', percent: 40 }, overallPercent: 70,
      completed: [{ key: 'ACM-1', title: 'Login page' }], inProgress: [], waitingOnClient: [{ title: 'UAT round 1', kind: 'UAT', dueAt: null }],
      upcoming: { versions: [{ name: 'v1.0', releaseDate: '2026-10-20', items: 4, done: 1 }], payments: [{ number: 1, name: 'Deposit', amount: 30000000, dueDate: '2026-10-10', status: 'DUE' }] },
      currency: 'VND', changes: null, risks: null, nextSteps: [], counts: { completed: 1, inProgress: 0, open: 3 },
    };
    const md = reportMarkdown(d);
    assert.match(md, /# Weekly update — Acme portal/);
    assert.match(md, /ACM-1 Login page/);
    assert.match(md, /UAT sign-off: UAT round 1/);
    assert.match(md, /Payment: Deposit — 30,000,000 VND, due 2026-10-10 \(due\)/);
    assert.doesNotMatch(md, /## Finance|## RAID|## Workload/);
    const lines = reportEmailLines(d);
    assert.ok(lines.some((l) => /Completed: 1 · In progress: 0 · Overall progress: 70%/.test(l)));
  });
  it('job nền không nạp LLM: clientReports.service không import tĩnh ai.service / llm', () => {
    const src = fs.readFileSync(new URL('./clientReports.service.ts', import.meta.url), 'utf8');
    const staticImports = src.split('\n').filter((l) => /^import /.test(l));
    assert.ok(!staticImports.some((l) => /ai\.service|\/llm\/|gateway/.test(l)), staticImports.join('\n'));
    // Chỉ một chỗ nạp ai.service — trong polishClientReport (người bấm tay).
    assert.equal((src.match(/import\('\.\/ai\.service\.js'\)/g) ?? []).length, 1);
    const fn = src.slice(src.indexOf('export async function runClientWeeklyReports'));
    assert.doesNotMatch(fn.slice(0, fn.indexOf('\n}\n')), /polish|weeklyReport|ai\.service/);
  });
});
