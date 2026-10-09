/**
 * CTW Đóng góp — hàm thuần (không DB): npx tsx --test src/services/work/contribRules.test.ts
 * Mỗi phép kiểm có đáp án dựng tay (ngày, múi giờ, quyền, ẩn danh, khớp danh tính, webhook).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  addDays, aggregatePeer, attentionSignals, contribAccess, dayKey, DEFAULT_CRITERIA, identityKey, identityResolver, lateDays, normalizeCriteria,
  pctChange, previousWindow, resolveWindow, responseHours, startOfDay, streaks, tzOffsetMin, validateScores, weekStart, METRIC_DEFINITIONS, FAIRNESS_NOTE,
} from './contribRules.js';
import { extractGithubContribs, extractGitlabContribs } from './contribDev.js';

const VN = 'Asia/Ho_Chi_Minh';

describe('ngày & múi giờ dự án', () => {
  it('dayKey / startOfDay theo giờ VN (UTC+7)', () => {
    assert.equal(dayKey(new Date('2026-10-09T17:30:00Z'), VN), '2026-10-10'); // 00:30 VN ngày 10
    assert.equal(dayKey(new Date('2026-10-09T16:59:59Z'), VN), '2026-10-09');
    assert.equal(startOfDay('2026-10-10', VN).toISOString(), '2026-10-09T17:00:00.000Z');
    assert.equal(tzOffsetMin(new Date('2026-10-09T00:00:00Z'), VN), 420);
  });
  it('múi giờ có giờ mùa hè (New York) — 00:00 đúng cả hai phía ngày đổi giờ', () => {
    assert.equal(startOfDay('2026-03-08', 'America/New_York').toISOString(), '2026-03-08T05:00:00.000Z'); // còn EST
    assert.equal(startOfDay('2026-03-09', 'America/New_York').toISOString(), '2026-03-09T04:00:00.000Z'); // đã EDT
  });
  it('weekStart = thứ Hai; addDays qua tháng', () => {
    assert.equal(weekStart('2026-10-11'), '2026-10-05'); // CN ⇒ T2 trước đó
    assert.equal(weekStart('2026-10-05'), '2026-10-05');
    assert.equal(addDays('2026-10-30', 3), '2026-11-02');
  });
});

describe('khoảng thời gian', () => {
  const now = new Date('2026-10-08T05:00:00Z'); // T5 08/10 12:00 giờ VN
  it('hôm nay / 7 ngày / tuần này (cắt tại hôm nay ⇒ kỳ trước cùng số ngày đã trôi)', () => {
    const t = resolveWindow({ preset: 'today', tz: VN, now });
    assert.deepEqual([t.fromDay, t.toDay, t.days, t.includesToday], ['2026-10-08', '2026-10-08', 1, true]);
    assert.equal(t.from.toISOString(), '2026-10-07T17:00:00.000Z');
    assert.equal(t.to.getTime(), now.getTime(), 'không vượt quá bây giờ');
    const d7 = resolveWindow({ preset: '7d', tz: VN, now });
    assert.deepEqual([d7.fromDay, d7.toDay, d7.days], ['2026-10-02', '2026-10-08', 7]);
    const wk = resolveWindow({ preset: 'week', tz: VN, now });
    assert.deepEqual([wk.fromDay, wk.toDay, wk.days], ['2026-10-05', '2026-10-08', 4]);
    const prev = previousWindow(wk, VN);
    assert.deepEqual([prev.fromDay, prev.toDay, prev.days], ['2026-10-01', '2026-10-04', 4]);
    assert.equal(prev.to.getTime(), wk.from.getTime() - 1, 'liền ngay trước, không chồng');
  });
  it('tuỳ chọn: kiểm lỗi người dùng', () => {
    assert.throws(() => resolveWindow({ preset: 'custom', tz: VN, now, fromDay: '2026-10-05', toDay: '2026-10-01' }), /after the end/);
    assert.throws(() => resolveWindow({ preset: 'custom', tz: VN, now, fromDay: '2026-11-01', toDay: '2026-11-05' }), /future/);
    assert.throws(() => resolveWindow({ preset: 'custom', tz: VN, now }), /start and an end/);
    const c = resolveWindow({ preset: 'custom', tz: VN, now, fromDay: '2026-09-01', toDay: '2026-09-30' });
    assert.deepEqual([c.days, c.includesToday], [30, false]);
    assert.equal(c.to.toISOString(), '2026-09-30T16:59:59.999Z');
  });
  it('sprint: dùng đúng mốc bắt đầu/kết thúc; sprint chưa bắt đầu ⇒ lỗi', () => {
    const s = resolveWindow({ preset: 'sprint', tz: VN, now, span: { start: new Date('2026-09-28T02:00:00Z'), end: new Date('2026-10-04T10:00:00Z'), name: 'Sprint 3' } });
    assert.deepEqual([s.label, s.fromDay, s.toDay, s.days, s.includesToday], ['Sprint 3', '2026-09-28', '2026-10-04', 7, false]);
    assert.equal(s.from.toISOString(), '2026-09-28T02:00:00.000Z');
    assert.equal(s.to.toISOString(), '2026-10-04T10:00:00.000Z');
    assert.throws(() => resolveWindow({ preset: 'sprint', tz: VN, now, span: { start: null, end: null, name: 'S4' } }), /not started/);
    const running = resolveWindow({ preset: 'sprint', tz: VN, now, span: { start: new Date('2026-10-05T01:00:00Z'), end: null, name: 'Sprint 4' } });
    assert.equal(running.includesToday, true);
    assert.equal(running.to.getTime(), now.getTime());
  });
  it('pctChange', () => {
    assert.equal(pctChange(15, 10), 50);
    assert.equal(pctChange(5, 10), -50);
    assert.equal(pctChange(3, 0), null);
    assert.equal(pctChange(null, 4), null);
  });
});

describe('đúng hạn / trễ hạn theo ngày địa phương', () => {
  const due = new Date('2026-10-05T00:00:00Z'); // cột DATE: 05/10
  it('xong 23:30 ngày 05/10 giờ VN ⇒ đúng hạn; 00:30 ngày 06/10 ⇒ trễ 1 ngày', () => {
    assert.equal(lateDays(new Date('2026-10-05T16:30:00Z'), due, VN), 0);
    assert.equal(lateDays(new Date('2026-10-05T17:30:00Z'), due, VN), 1);
    // Cùng thời điểm, dự án đặt múi giờ UTC ⇒ vẫn là ngày 05 ⇒ đúng hạn.
    assert.equal(lateDays(new Date('2026-10-05T17:30:00Z'), due, 'UTC'), 0);
    assert.equal(lateDays(new Date('2026-10-01T03:00:00Z'), due, VN), 0, 'xong sớm = 0, không âm');
    assert.equal(lateDays(new Date('2026-10-09T03:00:00Z'), due, VN), 4);
  });
});

describe('chuỗi ngày hoạt động / im lặng', () => {
  it('đếm đúng chuỗi dài nhất, chuỗi hiện tại, im lặng cuối khoảng', () => {
    const s = streaks(new Set(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-06']), '2026-10-01', '2026-10-09');
    assert.deepEqual(s, { activeDays: 4, currentStreak: 0, longestStreak: 3, trailingSilence: 3, longestSilence: 3 });
    const t = streaks(new Set(['2026-10-08', '2026-10-09']), '2026-10-01', '2026-10-09');
    assert.deepEqual([t.currentStreak, t.trailingSilence, t.longestSilence], [2, 0, 7]);
  });
  it('responseHours: hành động ĐẦU TIÊN sau lần nhắc, trong 48 giờ', () => {
    const at = new Date('2026-10-01T00:00:00Z');
    assert.equal(responseHours(at, [new Date('2026-09-30T00:00:00Z'), new Date('2026-10-01T05:00:00Z'), new Date('2026-10-01T02:00:00Z')]), 2);
    assert.equal(responseHours(at, [new Date('2026-10-04T00:00:00Z')]), null);
  });
});

describe('tín hiệu cần chú ý — có lý do, không gắn nhãn', () => {
  const base = { isAgent: false, silentNow: 0, includesToday: true, overdueOpen: 0, hoursThisWeek: 3, teamLogsTime: true, midWeek: true, unansweredMentions: 0, withDue: 0, onTime: 0, assignedOpen: 2, completed: 1, windowDays: 30, silentThreshold: 5 };
  it('không có gì ⇒ không tín hiệu', () => assert.deepEqual(attentionSignals(base), []));
  it('5 ngày im lặng, 3 việc trễ, chưa log giờ, @nhắc chưa trả lời', () => {
    const s = attentionSignals({ ...base, silentNow: 5, overdueOpen: 3, hoursThisWeek: 0, unansweredMentions: 2 });
    assert.deepEqual(s.map((x) => x.text), ['5 days without activity', '3 overdue issues still open', 'No time logged this week', '2 @mentions not answered within 2 days']);
    assert.equal(s.find((x) => x.code === 'overdue')!.level, 'warn');
    for (const x of s) assert.doesNotMatch(x.text, /lazy|lười|bad|poor|slack/i);
  });
  it('dự án không dùng worklog ⇒ không nhắc log giờ; đầu tuần ⇒ chưa nhắc', () => {
    assert.equal(attentionSignals({ ...base, hoursThisWeek: 0, teamLogsTime: false }).length, 0);
    assert.equal(attentionSignals({ ...base, hoursThisWeek: 0, midWeek: false }).length, 0);
  });
  it('agent: chỉ nhắc trễ hạn; khoảng không chứa hôm nay ⇒ không nói "im lặng"', () => {
    assert.deepEqual(attentionSignals({ ...base, isAgent: true, silentNow: 20, overdueOpen: 1, hoursThisWeek: 0 }).map((x) => x.code), ['overdue']);
    assert.equal(attentionSignals({ ...base, includesToday: false, silentNow: 20 }).length, 0);
  });
  it('định nghĩa chỉ số + ghi chú công bằng có sẵn', () => {
    assert.ok(Object.keys(METRIC_DEFINITIONS).length >= 25);
    assert.match(FAIRNESS_NOTE, /not quality/);
  });
});

describe('quyền xem (contribAccess)', () => {
  const T = { teamVisible: false };
  it('ADMIN + TEACHER thấy tất; MEMBER/VIEWER chỉ mình; khách/GUEST/agent không', () => {
    assert.deepEqual(contribAccess('ADMIN', 'MEMBER', 'HUMAN', T), { view: 'ALL', manage: true, peerAdmin: true, peerParticipant: true, export: true });
    assert.deepEqual(contribAccess('TEACHER', 'GUEST', 'HUMAN', T), { view: 'ALL', manage: false, peerAdmin: true, peerParticipant: false, export: true });
    assert.deepEqual(contribAccess('MEMBER', 'MEMBER', 'HUMAN', T), { view: 'SELF', manage: false, peerAdmin: false, peerParticipant: true, export: false });
    assert.equal(contribAccess('VIEWER', 'MEMBER', 'HUMAN', T).view, 'SELF');
    assert.equal(contribAccess('CLIENT', 'MEMBER', 'HUMAN', T).view, null);
    assert.equal(contribAccess('MEMBER', 'GUEST', 'HUMAN', T).view, null);
    assert.equal(contribAccess('ADMIN', 'ADMIN', 'AGENT', T).view, null);
    assert.equal(contribAccess(null, 'MEMBER', 'HUMAN', T).view, null);
  });
  it('bật "cả nhóm xem" ⇒ MEMBER thấy tất + xuất được, nhưng vẫn không quản lý', () => {
    const a = contribAccess('MEMBER', 'MEMBER', 'HUMAN', { teamVisible: true });
    assert.deepEqual([a.view, a.export, a.manage, a.peerAdmin], ['ALL', true, false, false]);
    assert.equal(contribAccess('CLIENT', 'GUEST', 'HUMAN', { teamVisible: true }).view, null, 'bật cho nhóm không mở cho khách');
  });
});

describe('đánh giá chéo', () => {
  it('tiêu chí: mặc định 4; chuẩn hoá khoá; 3–6 tiêu chí', () => {
    assert.equal(DEFAULT_CRITERIA.length, 4);
    const c = normalizeCriteria([{ label: 'Contribution' }, { label: 'Đúng hạn' }, { label: 'Team work' }, { label: 'Team work' }]);
    assert.deepEqual(c.map((x) => x.key), ['contribution', 'ng_h_n', 'team_work', 'team_work_4']);
    assert.throws(() => normalizeCriteria([{ label: 'A' }, { label: 'B' }]), /3 to 6/);
  });
  it('điểm: đủ tiêu chí, nguyên 1–5', () => {
    assert.deepEqual(validateScores(DEFAULT_CRITERIA, { contribution: 5, deadlines: 4, collaboration: 3, quality: 2, extra: 9 }), { contribution: 5, deadlines: 4, collaboration: 3, quality: 2 });
    assert.throws(() => validateScores(DEFAULT_CRITERIA, { contribution: 6, deadlines: 4, collaboration: 3, quality: 2 }), /1 to 5/);
    assert.throws(() => validateScores(DEFAULT_CRITERIA, { contribution: 5 }), /Deadlines/);
  });
  it('tổng hợp: trung bình đúng, KHÔNG có người chấm, nhận xét xếp chữ cái', () => {
    const agg = aggregatePeer([
      { revieweeId: 2, scores: { contribution: 5, deadlines: 4, collaboration: 4, quality: 3 }, comment: 'Zealous tester' },
      { revieweeId: 2, scores: { contribution: 3, deadlines: 4, collaboration: 5, quality: 4 }, comment: 'Always answers chat' },
      { revieweeId: 3, scores: { contribution: 2, deadlines: 2, collaboration: 3, quality: 3 }, comment: '  ' },
    ], DEFAULT_CRITERIA);
    const a = agg.get(2)!;
    assert.deepEqual(a.byCriterion, { contribution: 4, deadlines: 4, collaboration: 4.5, quality: 3.5 });
    assert.equal(a.overall, 4);
    assert.deepEqual(a.comments, ['Always answers chat', 'Zealous tester']);
    assert.ok(!JSON.stringify([...agg.values()]).includes('reviewer'), 'không lộ người chấm');
    assert.deepEqual(agg.get(3)!.comments, []);
  });
});

describe('khớp danh tính git / tên trong mẫu FPT', () => {
  const people = [
    { id: 1, username: 'cuonghoang', email: 'cuong@fpt.edu.vn', fullName: 'Hoàng Văn Cường', displayName: 'Cường' },
    { id: 2, username: 'anhnt', email: 'anh@x.com', fullName: 'Nguyễn Tuấn Anh', displayName: null },
    { id: 3, username: 'anhle', email: null, fullName: 'Lê Anh', displayName: 'Anh' },
    { id: 4, username: 'minh', email: null, fullName: 'Anh', displayName: null },
  ];
  const r = identityResolver(people, new Map([['desktop-abc', 2]]));
  it('ánh xạ tay > username > email > noreply GitHub > tên duy nhất (bỏ dấu)', () => {
    assert.equal(identityKey('DESKTOP-ABC'), 'desktop-abc');
    assert.equal(r({ login: null, name: 'DESKTOP-ABC' }), 2, 'tên tác giả được bỏ dấu + chữ thường trước khi tra ánh xạ tay');
    assert.equal(r({ login: 'CuongHoang' }), 1);
    assert.equal(r({ email: 'Anh@X.com' }), 2);
    assert.equal(r({ email: '12345+anhle@users.noreply.github.com' }), 3);
    assert.equal(r({ name: 'Hoang Van Cuong' }), 1);
    assert.equal(r({ name: 'Anh' }), null, '"Anh" trùng hai người ⇒ không đoán');
    assert.equal(r({ login: 'stranger', email: 'x@y.z', name: 'Stranger' }), null);
  });
});

describe('webhook ⇒ commit/PR (A26)', () => {
  it('GitHub push: mọi commit, số tệp, chưa có số dòng; bỏ commit không distinct', () => {
    const out = extractGithubContribs('push', {
      ref: 'refs/heads/feat/LAB-3', repository: { full_name: 'org/repo' },
      commits: [
        { id: 'a1', message: 'LAB-3 add login\n\nbody', url: 'u1', timestamp: '2026-10-01T10:00:00+07:00', author: { username: 'cuonghoang', name: 'Cường', email: 'cuong@fpt.edu.vn' }, added: ['a.ts'], modified: ['b.ts', 'c.ts'], removed: [] },
        { id: 'a2', message: 'merge', distinct: false, author: {} },
        { id: 'a3', message: 'chore: no key', timestamp: '2026-10-01T11:00:00Z', author: { name: 'DESKTOP-ABC', email: 'x@local' } },
      ],
    }, new Date('2026-10-02T00:00:00Z'));
    assert.equal(out.length, 2);
    assert.deepEqual([out[0].kind, out[0].title, out[0].authorLogin, out[0].filesChanged, out[0].additions], ['COMMIT', 'LAB-3 add login', 'cuonghoang', 3, null]);
    assert.equal(out[0].occurredAt.toISOString(), '2026-10-01T03:00:00.000Z');
    assert.equal(out[1].filesChanged, null, 'không có danh sách tệp ⇒ null, không bịa 0');
  });
  it('GitHub pull_request: additions/deletions/changed_files', () => {
    const [pr] = extractGithubContribs('pull_request', {
      repository: { full_name: 'org/repo' },
      pull_request: { number: 7, title: 'LAB-3 Login', html_url: 'h', user: { login: 'anhnt' }, additions: 120, deletions: 30, changed_files: 6, merged: true, created_at: '2026-10-03T01:00:00Z' },
    });
    assert.deepEqual([pr.kind, pr.externalId, pr.state, pr.additions, pr.deletions, pr.filesChanged], ['PR', 'org/repo#7', 'merged', 120, 30, 6]);
    assert.deepEqual(extractGithubContribs('issues', {}), []);
  });
  it('GitLab push + merge_request', () => {
    const push = extractGitlabContribs({ object_kind: 'push', ref: 'refs/heads/main', project: { path_with_namespace: 'g/p' }, commits: [{ id: 'c1', title: 'fix', timestamp: '2026-10-04T00:00:00Z', author: { name: 'Lê Anh', email: 'le@x' }, added: [], modified: ['x'], removed: [] }] });
    assert.deepEqual([push[0].authorLogin, push[0].authorName, push[0].filesChanged], [null, 'Lê Anh', 1]);
    const mr = extractGitlabContribs({ object_kind: 'merge_request', project: { path_with_namespace: 'g/p' }, user: { username: 'anhle' }, object_attributes: { iid: 4, title: 'MR', state: 'opened', url: 'u' } });
    assert.deepEqual([mr[0].externalId, mr[0].authorLogin, mr[0].state], ['g/p!4', 'anhle', 'open']);
  });
});
