/**
 * Test đợt 6 (version, timeline, capacity, worklog, luật tự động, email) qua
 * HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.planning.db.test.ts
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { criticalPath, workingDays } from '../services/work/planning.service.js';
import { inQuietHours, sendDigests } from '../services/work/notify.js';
import { runScheduledRules } from '../services/work/automation.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wp${Date.now().toString(36)}`;
const userIds: number[] = [];
const sent: Array<{ to: string; subject: string }> = [];
type U = { id: number; token: string; email: string; username: string };
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('CT Work đợt 6 — hàm thuần', () => {
  it('đường găng: chuỗi dài nhất theo số ngày, bỏ thẻ xong, không treo khi có chu trình', () => {
    const items = [
      { id: 1, start: '2026-10-01', due: '2026-10-03', done: false }, // 3 ngày
      { id: 2, start: '2026-10-04', due: '2026-10-10', done: false }, // 7
      { id: 3, start: '2026-10-04', due: '2026-10-04', done: false }, // 1
      { id: 4, start: '2026-10-11', due: '2026-10-12', done: false }, // 2
      { id: 5, start: null, due: null, done: true },
    ];
    const deps = [{ from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 4 }, { from: 5, to: 1 }];
    assert.deepEqual(criticalPath(items, deps), { path: [1, 2, 4], days: 12 });
    // Chu trình 6 ⇄ 7 bị bỏ qua, không lặp vô hạn.
    const cyc = criticalPath([...items, { id: 6, start: null, due: null, done: false }, { id: 7, start: null, due: null, done: false }], [...deps, { from: 6, to: 7 }, { from: 7, to: 6 }]);
    assert.deepEqual(cyc.path, [1, 2, 4]);
    assert.deepEqual(criticalPath(items, []), { path: [], days: 0 });
  });
  it('ngày làm việc trừ cuối tuần và ngày nghỉ', () => {
    assert.equal(workingDays('2026-09-21', '2026-09-27'), 5); // T2 → CN
    assert.equal(workingDays('2026-09-21', '2026-09-27', [{ start: '2026-09-23', end: '2026-09-24' }]), 3);
  });
  it('giờ im lặng vắt qua nửa đêm', () => {
    assert.equal(inQuietHours(22, 7, 23), true);
    assert.equal(inQuietHours(22, 7, 3), true);
    assert.equal(inQuietHours(22, 7, 12), false);
    assert.equal(inQuietHours(12, 13, 12), true);
    assert.equal(inQuietHours(null, null, 3), false);
  });
});

describe('CT Work đợt 6 — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, dev2: U;
  let pid = 0;
  let wsId = 0;
  let cfg: any;
  const st = (name: string) => cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  const newIssue = async (title: string, extra: Record<string, unknown> = {}) =>
    (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title, ...extra })).data;
  const get = async (num: number) => (await call(dev, 'GET', `/projects/${pid}/issues/${num}`)).data;

  before(async () => {
    (emailService as any).send = async (m: { to: string; subject: string }) => { sent.push({ to: m.to, subject: m.subject }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, dev2] = await Promise.all(['lead', 'dev', 'dev2'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Plan ${tag}` })).data;
    wsId = ws.id;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, dev2.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'PL', name: 'Plan', template: 'BLANK' })).data.id;
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  let v1 = 0, v2 = 0;
  it('version: tạo, trùng tên 409, chỉ ADMIN quản lý, gắn vào thẻ', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/versions`, { name: 'v1.0' })).status, 403);
    const a = await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1.0', startDate: '2026-10-01', releaseDate: '2026-10-31' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    v1 = a.data.id;
    v2 = (await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1.1' })).data.id;
    assert.equal((await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1.0' })).status, 409);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'bad', startDate: '2026-11-01', releaseDate: '2026-10-01' })).status, 400);
    const done = await newIssue('Login page', { fixVersionId: v1 });
    const open = await newIssue('Signup page');
    const upd = await call(dev, 'PATCH', `/projects/${pid}/issues/${open.number}`, { fixVersionId: v1 });
    assert.equal(upd.status, 200);
    assert.equal(upd.data.fixVersionId, v1);
    await call(dev, 'PATCH', `/projects/${pid}/issues/${done.number}`, { statusId: st('Done') });
    const list = (await call(dev, 'GET', `/projects/${pid}/versions`)).data;
    const one = list.find((v: any) => v.id === v1);
    assert.equal(one.total, 2);
    assert.equal(one.done, 1);
    const hist = (await call(dev, 'GET', `/projects/${pid}/issues/${open.number}/history`)).data;
    assert.ok(hist.some((h: any) => h.field === 'fixVersionId'));
  });

  it('phát hành: thẻ dở dang dời sang version khác; version đã phát hành không nhận lại lệnh phát hành', async () => {
    assert.equal((await call(lead, 'POST', `/projects/${pid}/versions/${v1}/release`, { moveUnresolvedTo: v1 })).status, 400);
    const r = await call(lead, 'POST', `/projects/${pid}/versions/${v1}/release`, { moveUnresolvedTo: v2 });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.moved, 1);
    assert.equal(r.data.version.status, 'RELEASED');
    const detail = (await call(dev, 'GET', `/projects/${pid}/versions/${v2}`)).data;
    assert.deepEqual(detail.issues.map((i: any) => i.title), ['Signup page']);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/versions/${v1}/release`, { moveUnresolvedTo: null })).status, 400);
    // Lưu release notes tay; archive xong thì không gắn thẻ mới được.
    assert.equal((await call(lead, 'PATCH', `/projects/${pid}/versions/${v1}`, { releaseNotes: '## New\n- Login' })).data.releaseNotes, '## New\n- Login');
    await call(lead, 'PATCH', `/projects/${pid}/versions/${v1}`, { status: 'ARCHIVED' });
    const t = await newIssue('Late');
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { fixVersionId: v1 })).status, 400);
    // Xoá version: thẻ được gỡ ra, không bị xoá theo.
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/versions/${v2}`)).status, 200);
    const s = (await call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('summary ~ "Signup"')}`)).data.items[0];
    assert.equal(s.fixVersionId, null);
  });

  it('timeline: phụ thuộc, đường găng, xung đột lịch; kéo thanh qua /schedule', async () => {
    const a = await newIssue('Design API', { startDate: '2026-10-01', dueDate: '2026-10-05' });
    const b = await newIssue('Build API', { startDate: '2026-10-03', dueDate: '2026-10-10' });
    const c = await newIssue('Ship', { startDate: '2026-10-11', dueDate: '2026-10-12' });
    await call(dev, 'POST', `/projects/${pid}/issues/${a.number}/links`, { targetKey: `PL-${b.number}`, type: "BLOCKS" });
    await call(dev, 'POST', `/projects/${pid}/issues/${b.number}/links`, { targetKey: `PL-${c.number}`, type: "BLOCKS" });
    const tl = (await call(dev, 'GET', `/projects/${pid}/timeline`)).data;
    assert.deepEqual(tl.criticalPath, [a.id, b.id, c.id]);
    assert.deepEqual(tl.conflicts, [{ from: a.id, to: b.id }], 'Build bắt đầu trước khi Design xong hạn');
    const fixed = await call(dev, 'PUT', `/projects/${pid}/issues/${b.number}/schedule`, { startDate: '2026-10-06', dueDate: '2026-10-10' });
    assert.equal(fixed.status, 200, JSON.stringify(fixed.raw));
    assert.deepEqual((await call(dev, 'GET', `/projects/${pid}/timeline`)).data.conflicts, []);
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/issues/${b.number}/schedule`, { startDate: '2026-10-12', dueDate: '2026-10-10' })).status, 400);
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/issues/${b.number}/schedule`, { startDate: '2026-10-06', dueDate: '2026-10-11', version: 0 })).status, 409);
  });

  it('capacity: giờ/ngày × ngày làm việc trừ nghỉ, so với khối việc', async () => {
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/capacity/${dev.id}`, { hoursPerDay: 6 })).status, 403);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/capacity/${dev.id}`, { hoursPerDay: 6 })).status, 200);
    // Tự khai ngày nghỉ được; khai hộ người khác thì không (dev không phải admin không gian).
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/time-off`, { startDate: '2026-10-07', endDate: '2026-10-08', note: 'Exam' })).status, 201);
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/time-off`, { userId: dev2.id, startDate: '2026-10-07', endDate: '2026-10-07' })).status, 403);
    await newIssue('Big job', { assigneeId: dev.id, originalEstimateMin: 20 * 60, dueDate: '2026-10-09' });
    const c = await call(dev, 'GET', `/projects/${pid}/capacity?from=2026-10-05&to=2026-10-11`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    const me = c.data.members.find((m: any) => m.user.id === dev.id);
    assert.equal(me.workingDays, 3); // T2–T6 = 5, trừ 2 ngày nghỉ
    assert.equal(me.capacityHours, 18);
    assert.equal(me.loadHours, 20);
    assert.ok(me.utilization > 100);
    const other = c.data.members.find((m: any) => m.user.id === dev2.id);
    assert.equal(other.capacityHours, null);
  });

  it('worklog: cộng giờ, trừ remaining tự động, chỉ xoá log của mình; báo cáo thời gian', async () => {
    const t = await newIssue('Timed', { originalEstimateMin: 240 });
    const a = await call(dev, 'POST', `/projects/${pid}/issues/${t.number}/worklogs`, { minutes: 90, note: 'Pairing' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    await call(dev2, 'POST', `/projects/${pid}/issues/${t.number}/worklogs`, { minutes: 30, remaining: 'keep' });
    let d = await get(t.number);
    assert.equal(d.timeSpentMin, 120);
    assert.equal(d.remainingEstimateMin, 150);
    assert.equal((await call(dev2, 'DELETE', `/projects/${pid}/issues/${t.number}/worklogs/${a.data.id}`)).status, 403);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${t.number}/worklogs`, { minutes: 0 })).status, 400);
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
    const rep = (await call(lead, 'GET', `/projects/${pid}/reports/time?from=${today}&to=${today}`)).data;
    assert.equal(rep.totalMin, 120);
    assert.equal(rep.people[0].user.id, dev.id);
    assert.equal(rep.people[0].issues[0].number, t.number);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/issues/${t.number}/worklogs/${a.data.id}`)).status, 200, 'ADMIN xoá được');
    d = await get(t.number);
    assert.equal(d.timeSpentMin, 30);
  });

  it('luật tự động: kiểm cấu hình, chạy khi chuyển trạng thái, ghi nhật ký', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/automation`, { name: 'x', trigger: 'issue.created', config: { actions: [{ kind: 'comment', text: 'hi' }] } })).status, 403);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/automation`, { name: 'x', trigger: 'issue.created', config: { actions: [{ kind: 'transition' }] } })).status, 400);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/automation`, { name: 'x', trigger: 'issue.created', config: { conditions: [{ jql: 'status = ' }], actions: [{ kind: 'comment', text: 'a' }] } })).status, 400);
    const bugRule = await call(lead, 'POST', `/projects/${pid}/automation`, {
      name: 'Bugs are urgent', trigger: 'issue.created',
      config: { conditions: [{ jql: 'type = Bug' }], actions: [{ kind: 'set_priority', priority: 1 }, { kind: 'assign', assignee: 'reporter' }] },
    });
    assert.equal(bugRule.status, 201, JSON.stringify(bugRule.raw));
    const bug = (await call(dev, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'Crash on save' })).data;
    const task = await newIssue('Normal task');
    await wait(400);
    const b = await get(bug.number);
    assert.equal(b.priority, 1);
    assert.equal(b.assigneeId, dev.id);
    const h = (await call(dev, 'GET', `/projects/${pid}/issues/${bug.number}/history`)).data;
    assert.ok(h.some((x: any) => x.field === 'priority' && x.actorKind === 'AUTOMATION'), 'lịch sử ghi AUTOMATION');
    assert.equal((await get(task.number)).priority, 3);
    const logs = (await call(lead, 'GET', `/projects/${pid}/automation-logs?ruleId=${bugRule.data.id}`)).data;
    assert.ok(logs.some((l: any) => l.status === 'SUCCESS' && l.issue?.number === bug.number));
    assert.ok(logs.some((l: any) => l.status === 'NO_MATCH' && l.issue?.number === task.number));
    await call(lead, 'DELETE', `/projects/${pid}/automation/${bugRule.data.id}`);
  });

  it('chống vòng lặp: hai luật đẩy thẻ qua lại bị chặn, thẻ không nhảy mãi', async () => {
    const r1 = await call(lead, 'POST', `/projects/${pid}/automation`, {
      name: 'Ping', trigger: 'issue.transitioned', config: { toStatusIds: [st('In Progress')], actions: [{ kind: 'transition', statusId: st('In Review') }] },
    });
    const r2 = await call(lead, 'POST', `/projects/${pid}/automation`, {
      name: 'Pong', trigger: 'issue.transitioned', config: { toStatusIds: [st('In Review')], actions: [{ kind: 'transition', statusId: st('In Progress') }] },
    });
    const t = await newIssue('Bouncy');
    await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { statusId: st('In Progress') });
    await wait(1200);
    const logs = (await call(lead, 'GET', `/projects/${pid}/automation-logs`)).data.filter((l: any) => l.issue?.number === t.number);
    assert.ok(logs.some((l: any) => l.status === 'LOOP_BLOCKED'), JSON.stringify(logs.map((l: any) => [l.ruleName, l.status])));
    const moves = (await call(dev, 'GET', `/projects/${pid}/issues/${t.number}/history`)).data.filter((x: any) => x.field === 'statusId');
    assert.ok(moves.length <= 4, `thẻ đổi trạng thái ${moves.length} lần`);
    await call(lead, 'PATCH', `/projects/${pid}/automation/${r1.data.id}`, { enabled: false });
    await call(lead, 'PATCH', `/projects/${pid}/automation/${r2.data.id}`, { enabled: false });
  });

  it('luật theo lịch: chạy trên thẻ khớp JQL và gửi thông báo', async () => {
    const late = await newIssue('Overdue thing', { assigneeId: dev2.id, dueDate: '2026-01-01' });
    const r = await call(lead, 'POST', `/projects/${pid}/automation`, {
      name: 'Overdue ping', trigger: 'scheduled.daily',
      config: { jql: 'due < startOfDay() AND statusCategory != Done', actions: [{ kind: 'notify', to: ['assignee'], text: 'This issue is overdue' }] },
    });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    await runScheduledRules();
    const n = await prisma.socialNotification.findFirst({ where: { receiverId: dev2.id, type: 'WORK_ALERT', entityId: late.id } });
    assert.ok(n, 'người được giao nhận WORK_ALERT');
    const test = await call(lead, 'POST', `/projects/${pid}/automation/${r.data.id}/test`, { number: late.number });
    assert.equal(test.data.status, 'SUCCESS');
    await call(lead, 'DELETE', `/projects/${pid}/automation/${r.data.id}`);
  });

  it('email: gửi ngay khi được giao; chế độ thư gộp dồn lại rồi gửi một thư', async () => {
    sent.length = 0;
    const s0 = (await call(dev2, 'GET', '/me/notify-settings')).data;
    assert.equal(s0.emailMode, 'INSTANT');
    const t = await newIssue('Email me');
    await call(dev, 'PATCH', `/projects/${pid}/issues/${t.number}`, { assigneeId: dev2.id });
    await wait(400);
    assert.ok(sent.some((m) => m.to === dev2.email && m.subject.includes('assigned to you')), JSON.stringify(sent));
    assert.equal((await call(dev2, 'PUT', '/me/notify-settings', { quietStart: 22 })).status, 400);
    await call(dev2, 'PUT', '/me/notify-settings', { emailMode: 'DIGEST' });
    sent.length = 0;
    const t2 = await newIssue('Digest me');
    await call(dev, 'PATCH', `/projects/${pid}/issues/${t2.number}`, { assigneeId: dev2.id });
    await wait(400);
    assert.equal(sent.filter((m) => m.to === dev2.email).length, 0, 'chế độ thư gộp không gửi ngay');
    assert.equal(await prisma.workEmailQueue.count({ where: { userId: dev2.id, sentAt: null } }), 1);
    await sendDigests();
    assert.equal(sent.filter((m) => m.to === dev2.email && m.subject.includes('digest')).length, 1);
    assert.equal(await prisma.workEmailQueue.count({ where: { userId: dev2.id, sentAt: null } }), 0);
  });
});
