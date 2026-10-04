/**
 * CT Work đợt S5a — luật thuần của Service desk & SLA (slaRules.ts). Chạy trong `npm test`.
 * Mọi mốc giờ viết theo giờ VN (+07:00) cho dễ đọc; lịch mặc định T2–T6 08:00–17:00 (540 phút/ngày).
 * 2026-10-02 là Thứ Sáu · 2026-10-05 là Thứ Hai · 2026-09-02 (Quốc khánh) là Thứ Tư.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  DEFAULT_CALENDAR, DEFAULT_GOALS, DEFAULT_MATRIX, addWorkingMinutes, alertLevelOf, alertToSend, cleanFieldAnswers, computeSla,
  currentPriority, durationText, goalsOf, localStamp, lowerAlertOnPriorityChange, matrixOf, monthOf, overallMetPercent, priorityOf,
  reportCell, requestTypesOf, runningIntervals, vnFixedHolidays, workingMinutesBetween, zonedToUtc,
  type SlaEvent, type WorkCalendar,
} from './slaRules.js';

const vn = (s: string) => Date.parse(`${s}+07:00`);
const cal: WorkCalendar = { ...DEFAULT_CALENDAR };

describe('lịch làm việc', () => {
  it('cùng ngày, trong giờ làm', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-05T09:00:00'), vn('2026-10-05T10:30:00'), cal), 90);
  });
  it('trước giờ làm / sau giờ làm không tính', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-05T06:00:00'), vn('2026-10-05T08:30:00'), cal), 30);
    assert.equal(workingMinutesBetween(vn('2026-10-05T16:30:00'), vn('2026-10-05T23:00:00'), cal), 30);
  });
  it('qua đêm: 16:00 hôm nay ⇒ 09:00 hôm sau = 1 giờ + 1 giờ', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-05T16:00:00'), vn('2026-10-06T09:00:00'), cal), 120);
  });
  it('cuối tuần: Thứ Sáu 16:00 ⇒ Thứ Hai 09:00 = 2 giờ (T7, CN không tính)', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-02T16:00:00'), vn('2026-10-05T09:00:00'), cal), 120);
  });
  it('tạo vào Chủ nhật: chỉ đếm từ 08:00 Thứ Hai', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-04T10:00:00'), vn('2026-10-05T08:45:00'), cal), 45);
  });
  it('ngày lễ (2/9) không tính, cả ngày', () => {
    const hol: WorkCalendar = { ...cal, holidays: vnFixedHolidays(2026) };
    assert.equal(workingMinutesBetween(vn('2026-09-01T16:00:00'), vn('2026-09-03T09:00:00'), cal), 60 + 540 + 60);
    assert.equal(workingMinutesBetween(vn('2026-09-01T16:00:00'), vn('2026-09-03T09:00:00'), hol), 120);
    assert.deepEqual(vnFixedHolidays(2027), ['2027-01-01', '2027-04-30', '2027-05-01', '2027-09-02']);
  });
  it('hạn chót: P1 30 phút tạo lúc 16:50 Thứ Sáu ⇒ 08:20 Thứ Hai', () => {
    assert.equal(addWorkingMinutes(vn('2026-10-02T16:50:00'), 30, cal), vn('2026-10-05T08:20:00'));
  });
  it('hạn chót đúng mép giờ làm và nhiều ngày', () => {
    assert.equal(addWorkingMinutes(vn('2026-10-05T08:00:00'), 540, cal), vn('2026-10-05T17:00:00'));
    assert.equal(addWorkingMinutes(vn('2026-10-05T08:00:00'), 541, cal), vn('2026-10-06T08:01:00'));
    // 5 ngày làm từ Thứ Hai 08:00 ⇒ Thứ Sáu 17:00.
    assert.equal(addWorkingMinutes(vn('2026-10-05T08:00:00'), 2700, cal), vn('2026-10-09T17:00:00'));
  });
  it('lịch 24/7 (ALWAYS) đếm phút đồng hồ', () => {
    assert.equal(workingMinutesBetween(vn('2026-10-03T10:00:00'), vn('2026-10-03T14:00:00'), cal, 'ALWAYS'), 240);
    assert.equal(addWorkingMinutes(vn('2026-10-03T23:00:00'), 120, cal, 'ALWAYS'), vn('2026-10-04T01:00:00'));
  });
  it('múi giờ khác: lịch theo giờ địa phương của dự án', () => {
    const tokyo: WorkCalendar = { ...cal, timezone: 'Asia/Tokyo' };
    // 09:00 Tokyo = 07:00 VN. 07:00–09:00 VN của Thứ Hai = 09:00–11:00 Tokyo ⇒ 120 phút.
    assert.equal(workingMinutesBetween(vn('2026-10-05T07:00:00'), vn('2026-10-05T09:00:00'), tokyo), 120);
    assert.equal(zonedToUtc(2026, 10, 5, 9 * 60, 'Asia/Tokyo'), Date.parse('2026-10-05T00:00:00Z'));
  });
  it('đổi giờ mùa hè (New York 08/03/2026): ngày làm vẫn đủ 9 giờ', () => {
    const ny: WorkCalendar = { ...cal, timezone: 'America/New_York', workDays: [1, 2, 3, 4, 5, 6, 7] };
    const a = zonedToUtc(2026, 3, 8, 0, 'America/New_York');
    const b = zonedToUtc(2026, 3, 9, 0, 'America/New_York');
    assert.equal(workingMinutesBetween(a, b, ny), 540);
    assert.equal(zonedToUtc(2026, 3, 8, 8 * 60, 'America/New_York'), Date.parse('2026-03-08T12:00:00Z'));
  });
  it('lịch hỏng (không ngày làm) ⇒ 0 phút, không có hạn — không treo', () => {
    const bad: WorkCalendar = { ...cal, workDays: [] };
    assert.equal(workingMinutesBetween(vn('2026-10-05T08:00:00'), vn('2026-10-09T08:00:00'), bad), 0);
    assert.equal(addWorkingMinutes(vn('2026-10-05T08:00:00'), 30, bad), null);
  });
});

describe('ưu tiên Impact × Urgency', () => {
  it('bảng mặc định', () => {
    assert.equal(priorityOf('HIGH', 'HIGH'), 'P1');
    assert.equal(priorityOf('HIGH', 'LOW'), 'P3');
    assert.equal(priorityOf('MEDIUM', 'MEDIUM'), 'P3');
    assert.equal(priorityOf('LOW', 'LOW'), 'P4');
  });
  it('bảng cấu hình: ô sai ⇒ ô mặc định', () => {
    const m = matrixOf({ HIGH: { HIGH: 'P2', LOW: 'P9' }, LOW: 'oops' });
    assert.equal(priorityOf('HIGH', 'HIGH', m), 'P2');
    assert.equal(m.HIGH.LOW, DEFAULT_MATRIX.HIGH.LOW);
    assert.deepEqual(m.LOW, DEFAULT_MATRIX.LOW);
  });
  it('mục tiêu cấu hình: số lạ ⇒ mặc định, lịch ALWAYS đọc được', () => {
    const g = goalsOf({ P1: { firstResponseMin: 15, resolutionMin: -3, calendar: 'ALWAYS' } });
    assert.deepEqual(g.P1, { firstResponseMin: 15, resolutionMin: DEFAULT_GOALS.P1.resolutionMin, calendar: 'ALWAYS' });
    assert.deepEqual(g.P4, DEFAULT_GOALS.P4);
  });
});

describe('đồng hồ SLA từ dòng sự kiện', () => {
  const start = vn('2026-10-05T09:00:00'); // Thứ Hai
  const ev = (kind: SlaEvent['kind'], at: string, value?: string): SlaEvent => ({ kind, at: vn(at), value });

  it('đang chạy: ON_TRACK ⇒ AT_RISK (≥ 75%) ⇒ BREACHED', () => {
    const e = [{ kind: 'START' as const, at: start }];
    // P1: first response 30 phút.
    assert.equal(computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T09:20:00')).firstResponse.status, 'ON_TRACK');
    const r = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T09:23:00'));
    assert.equal(r.firstResponse.status, 'AT_RISK');
    assert.equal(r.firstResponse.atRiskAt, vn('2026-10-05T09:22:30'));
    const b = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T09:31:00'));
    assert.equal(b.firstResponse.status, 'BREACHED');
    assert.equal(b.firstResponse.breachedAt, vn('2026-10-05T09:30:00'));
    assert.equal(b.firstResponse.remainingMin, -1);
  });

  it('trả lời trong hạn ⇒ MET, đồng hồ dừng, không có hạn chót', () => {
    const r = computeSla([{ kind: 'START', at: start }, ev('FIRST_RESPONSE', '2026-10-05T09:12:00')], 'P1', DEFAULT_GOALS, cal, vn('2026-10-06T12:00:00'));
    assert.equal(r.firstResponse.status, 'MET');
    assert.equal(r.firstResponse.stopped, true);
    assert.equal(r.firstResponse.elapsedMin, 12);
    assert.equal(r.firstResponse.dueAt, null);
    // Resolution vẫn chạy (P1 = 240 phút) ⇒ đã quá.
    assert.equal(r.resolution.status, 'BREACHED');
  });

  it('tạm dừng NHIỀU lần: khoảng chờ khách không tính, PAUSE trùng bị bỏ qua', () => {
    const e = [
      { kind: 'START' as const, at: start },
      ev('FIRST_RESPONSE', '2026-10-05T09:10:00'),
      ev('PAUSE', '2026-10-05T10:00:00'),
      ev('PAUSE', '2026-10-05T10:30:00'), // trùng — bỏ qua
      ev('RESUME', '2026-10-05T13:00:00'),
      ev('PAUSE', '2026-10-05T14:00:00'),
      ev('RESUME', '2026-10-06T09:00:00'),
    ];
    const r = computeSla(e, 'P2', DEFAULT_GOALS, cal, vn('2026-10-06T10:00:00'));
    // Chạy: 09:00–10:00 (60) + 13:00–14:00 (60) + hôm sau 09:00–10:00 (60) = 180.
    assert.equal(r.resolution.elapsedMin, 180);
    assert.equal(r.resolution.status, 'ON_TRACK');
    assert.equal(r.paused, false);
    const iv = runningIntervals(e, vn('2026-10-06T10:00:00'));
    assert.equal(iv.res.length, 3);
  });

  it('đang chờ khách ⇒ paused, không có hạn chót, không trôi thời gian', () => {
    const e = [{ kind: 'START' as const, at: start }, ev('FIRST_RESPONSE', '2026-10-05T09:05:00'), ev('PAUSE', '2026-10-05T09:30:00')];
    const a = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T10:00:00'));
    const b = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-09T16:00:00'));
    assert.equal(a.resolution.paused, true);
    assert.equal(a.resolution.dueAt, null);
    assert.equal(a.resolution.elapsedMin, 30);
    assert.equal(b.resolution.elapsedMin, 30);
    assert.equal(b.resolution.status, 'ON_TRACK');
  });

  it('chờ khách TRƯỚC khi trả lời: first response cũng dừng đồng hồ', () => {
    const e = [{ kind: 'START' as const, at: start }, ev('PAUSE', '2026-10-05T09:10:00'), ev('RESUME', '2026-10-05T15:00:00')];
    const r = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T15:10:00'));
    assert.equal(r.firstResponse.elapsedMin, 20);
    assert.equal(r.firstResponse.status, 'ON_TRACK');
  });

  it('giải quyết trước khi trả lời ⇒ first response dừng ở lúc giải quyết; REOPEN cộng dồn resolution', () => {
    const e = [
      { kind: 'START' as const, at: start }, ev('RESOLVE', '2026-10-05T09:20:00'),
      ev('REOPEN', '2026-10-05T11:00:00'), ev('RESOLVE', '2026-10-05T11:30:00'),
    ];
    const r = computeSla(e, 'P1', DEFAULT_GOALS, cal, vn('2026-10-06T09:00:00'));
    assert.equal(r.firstResponse.status, 'MET');
    assert.equal(r.firstResponse.elapsedMin, 20);
    assert.equal(r.resolution.elapsedMin, 50);
    assert.equal(r.resolution.status, 'MET');
    assert.equal(r.resolution.stoppedAt, vn('2026-10-05T11:30:00'));
  });

  it('đổi P giữa chừng: mục tiêu MỚI tính lại từ lúc tạo (lên P1 ⇒ vi phạm ngay)', () => {
    const base: SlaEvent[] = [{ kind: 'START', at: start }];
    const now = vn('2026-10-05T10:00:00');
    assert.equal(computeSla(base, 'P3', DEFAULT_GOALS, cal, now).firstResponse.status, 'ON_TRACK'); // 60/240
    const up = [...base, ev('PRIORITY', '2026-10-05T09:50:00', 'P1')];
    const r = computeSla(up, 'P3', DEFAULT_GOALS, cal, now);
    assert.equal(r.priority, 'P1');
    assert.equal(r.firstResponse.goalMin, 30);
    assert.equal(r.firstResponse.status, 'BREACHED');
    assert.equal(r.firstResponse.breachedAt, vn('2026-10-05T09:30:00'));
    // Hạ xuống P4 ⇒ hết vi phạm.
    const down = [...up, ev('PRIORITY', '2026-10-05T09:55:00', 'P4')];
    assert.equal(computeSla(down, 'P1', DEFAULT_GOALS, cal, now).firstResponse.status, 'ON_TRACK');
    // PRIORITY ở tương lai chưa có hiệu lực.
    assert.equal(currentPriority([...base, ev('PRIORITY', '2026-10-05T11:00:00', 'P1')], 'P3', now), 'P3');
  });

  it('qua cuối tuần + ngày lễ: hạn chót đúng', () => {
    const hol: WorkCalendar = { ...cal, holidays: ['2026-10-05'] };
    // Tạo Thứ Sáu 16:30, P2 (FR 60 phút): 30 phút thứ Sáu, Thứ Hai nghỉ lễ ⇒ hạn 08:30 Thứ Ba.
    const r = computeSla([{ kind: 'START', at: vn('2026-10-02T16:30:00') }], 'P2', DEFAULT_GOALS, hol, vn('2026-10-03T12:00:00'));
    assert.equal(r.firstResponse.elapsedMin, 30);
    assert.equal(r.firstResponse.dueAt, vn('2026-10-06T08:30:00'));
  });
});

describe('cảnh báo một lần mỗi mốc', () => {
  it('đã báo AT_RISK thì chỉ báo tiếp BREACHED, đã báo BREACHED thì thôi', () => {
    assert.equal(alertToSend(1, 0), 1);
    assert.equal(alertToSend(1, 1), 0);
    assert.equal(alertToSend(2, 1), 2);
    assert.equal(alertToSend(2, 2), 0);
    assert.equal(alertToSend(0, 2), 0);
  });
  it('mục tiêu đã đạt không cảnh báo AT_RISK; đổi P hạ mức đã báo', () => {
    const r = computeSla([{ kind: 'START', at: vn('2026-10-05T09:00:00') }, { kind: 'FIRST_RESPONSE', at: vn('2026-10-05T09:25:00') }], 'P1', DEFAULT_GOALS, cal, vn('2026-10-05T09:40:00'));
    assert.equal(alertLevelOf(r.firstResponse), 0);
    assert.equal(lowerAlertOnPriorityChange(2, 0), 0);
    assert.equal(lowerAlertOnPriorityChange(1, 2), 1);
  });
});

describe('báo cáo, chữ hiển thị, loại yêu cầu', () => {
  it('ô báo cáo: % đạt, MTTR, breach, CSAT', () => {
    const met = { stopped: true, status: 'MET' as const };
    const br = { stopped: true, status: 'BREACHED' as const };
    const run = { stopped: false, status: 'ON_TRACK' as const };
    const c = reportCell([
      { priority: 'P1', month: '2026-10', firstResponse: met, resolution: met, resolveWallMin: 120, csat: 5 },
      { priority: 'P1', month: '2026-10', firstResponse: br, resolution: br, resolveWallMin: 600, csat: 2 },
      { priority: 'P1', month: '2026-10', firstResponse: met, resolution: run, resolveWallMin: null, csat: null },
    ]);
    assert.deepEqual([c.frDone, c.frMet, c.frPercent], [3, 2, 66.7]);
    assert.deepEqual([c.resDone, c.resMet, c.resPercent], [2, 1, 50]);
    assert.equal(c.breaches, 2);
    assert.equal(c.mttrMin, 360);
    assert.equal(c.csatAvg, 3.5);
    assert.equal(overallMetPercent(c), 60);
    assert.equal(reportCell([]).frPercent, null);
  });
  it('chữ cho khách', () => {
    assert.equal(durationText(30, 'BUSINESS'), '30 business minutes');
    assert.equal(durationText(60, 'BUSINESS'), '1 business hour');
    assert.equal(durationText(1620, 'BUSINESS'), '3 business days');
    assert.equal(durationText(240, 'ALWAYS'), '4 hours');
    assert.equal(monthOf(vn('2026-10-31T23:30:00'), 'Asia/Ho_Chi_Minh'), '2026-10');
    assert.equal(localStamp(Date.parse('2026-10-05T02:00:00Z'), 'Asia/Ho_Chi_Minh'), '2026-10-05 09:00');
  });
  it('loại yêu cầu: luôn đủ 4 loại, trường lạ bị bỏ, bắt buộc kiểm được', () => {
    const t = requestTypesOf([{ key: 'INCIDENT', name: 'Outage', fields: [{ key: 'where', label: 'Where?', kind: 'text', required: true }, { key: 'Bad Key', label: 'x' }] }, { key: 'NOPE' }]);
    assert.deepEqual(t.map((x) => x.key), ['INCIDENT', 'SERVICE_REQUEST', 'QUESTION', 'CHANGE']);
    assert.equal(t[0].name, 'Outage');
    assert.deepEqual(t[0].fields.map((f) => f.key), ['where']);
    assert.deepEqual(cleanFieldAnswers(t[0], { where: '  ', extra: 'x' }), { values: {}, missing: ['Where?'] });
    assert.deepEqual(cleanFieldAnswers(t[0], { where: 'Checkout' }).values, { where: 'Checkout' });
    assert.equal(t[3].useChangeRequest, true);
  });
});

describe('job nền không cần LLM', () => {
  it('serviceDesk.service + slaRules không import ai.service / llm', async () => {
    const fs = await import('node:fs');
    for (const f of ['./serviceDesk.service.ts', './slaRules.ts']) {
      const src = fs.readFileSync(new URL(f, import.meta.url), 'utf8');
      assert.ok(!/from '\.\/ai\.service\.js'|import\('\.\/ai\.service\.js'\)|services\/llm\//.test(src), `${f} không được nạp LLM`);
    }
  });
});
