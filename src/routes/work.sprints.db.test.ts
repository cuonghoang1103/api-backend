/**
 * Test đợt 2 (sprint, backlog, sửa hàng loạt, báo cáo) qua HTTP thật trên
 * Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.sprints.db.test.ts
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

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `ws${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('CT Work đợt 2 — sprint & báo cáo', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, dev2: U;
  let pid = 0;
  let cfg: any;
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  const statusByName = (name: string, wfDefault = true) =>
    cfg.workflows.find((w: any) => w.isDefault === wfDefault).statuses.find((s: any) => s.name === name).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
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
  const mk = async (title: string, extra: Record<string, unknown> = {}) =>
    (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('STORY'), title, ...extra })).data;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, dev2] = await Promise.all(['lead', 'dev', 'dev2'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Sprint test ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, dev2.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'SPR', name: 'Sprinty', template: 'SWP391', firstSprint: false })).data.id;
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  let s1 = 0;
  let s2 = 0;
  const nums: Record<string, number> = {};

  it('tạo sprint tự đặt tên, chỉ ADMIN được quản lý sprint', async () => {
    const a = await call(lead, 'POST', `/projects/${pid}/sprints`, {});
    assert.equal(a.status, 201);
    assert.equal(a.data.name, 'Sprint 1');
    s1 = a.data.id;
    s2 = (await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Hardening' })).data.id;
    assert.equal((await call(dev, 'POST', `/projects/${pid}/sprints`, {})).status, 403);
  });

  it('sửa hàng loạt: đưa thẻ vào sprint, giao việc; thẻ hỏng báo riêng', async () => {
    const epic = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('EPIC'), title: 'Checkout' })).data;
    nums.a = (await mk('Cart page', { storyPoints: 3, parentId: epic.id })).number;
    nums.b = (await mk('Payment', { storyPoints: 5, parentId: epic.id })).number;
    nums.c = (await mk('Receipt email', { storyPoints: 2 })).number;
    nums.epic = epic.number;
    const sub = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('SUBTASK'), title: 'Stripe keys', parentId: (await call(lead, 'GET', `/projects/${pid}/issues/${nums.b}`)).data.id })).data;
    nums.sub = sub.number;

    const r = await call(lead, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [nums.a, nums.b, nums.c], patch: { sprintId: s1, assigneeId: dev.id } });
    assert.deepEqual(r.data.updated.sort(), [nums.a, nums.b, nums.c].sort());
    assert.equal(r.data.failed.length, 0);
    // Việc con đi theo sprint của cha.
    assert.equal((await call(lead, 'GET', `/projects/${pid}/issues/${nums.sub}`)).data.sprintId, s1);

    const bad = await call(lead, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [nums.a, 99999], patch: { priority: 1 } });
    assert.deepEqual(bad.data.updated, [nums.a]);
    assert.equal(bad.data.failed[0].number, 99999);
    // Người chỉ xem thì không sửa hàng loạt được (dev là MEMBER nên được).
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [nums.a], patch: { priority: 2 } })).status, 200);
  });

  it('backlog: sprint chưa đóng + thẻ chưa vào sprint, epic kèm tiến độ, không có việc con', async () => {
    await mk('Loose idea');
    const b = (await call(lead, 'GET', `/projects/${pid}/backlog`)).data;
    assert.deepEqual(b.sprints.map((s: any) => s.name), ['Sprint 1', 'Hardening']);
    const inS1 = b.issues.filter((i: any) => i.sprintId === s1).map((i: any) => i.number).sort();
    assert.deepEqual(inS1, [nums.a, nums.b, nums.c].sort());
    assert.ok(b.issues.some((i: any) => i.title === 'Loose idea' && i.sprintId === null));
    assert.ok(!b.issues.some((i: any) => i.number === nums.sub), 'việc con không nằm trong backlog');
    const epic = b.epics.find((e: any) => e.number === nums.epic);
    assert.equal(epic.total, 2);
    assert.equal(epic.points, 8);
  });

  it('bắt đầu sprint: chốt điểm cam kết (không tính việc con), chỉ một sprint chạy', async () => {
    const start = new Date(Date.now() - 3 * 86_400_000).toISOString();
    const end = new Date(Date.now() + 11 * 86_400_000).toISOString();
    const r = await call(lead, 'POST', `/projects/${pid}/sprints/${s1}/start`, { startAt: start, endAt: end, goal: 'Customers can pay' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.state, 'ACTIVE');
    assert.equal(r.data.committedPoints, 10);
    const again = await call(lead, 'POST', `/projects/${pid}/sprints/${s2}/start`, { startAt: start, endAt: end });
    assert.equal(again.status, 409);
    const board = (await call(dev, 'GET', `/projects/${pid}/board`)).data;
    assert.equal(board.sprint.id, s1);
    assert.equal(board.fallback, false);
  });

  it('đổi phạm vi giữa sprint được ghi nhận; burndown phản ánh điểm còn lại', async () => {
    nums.d = (await mk('Coupon codes', { storyPoints: 4 })).number;
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.d}`, { sprintId: s1 });
    // Xong 1 thẻ 3 điểm.
    await call(dev, 'PATCH', `/projects/${pid}/issues/${nums.a}`, { statusId: statusByName('Done') });
    const bd = (await call(dev, 'GET', `/projects/${pid}/reports/burndown?sprintId=${s1}`)).data;
    assert.equal(bd.unit, 'POINTS');
    const today = bd.points.filter((p: any) => p.remaining !== null).at(-1);
    assert.equal(today.total, 14);
    assert.equal(today.remaining, 11);
    assert.equal(bd.points[0].ideal, 10, 'đường lý tưởng bắt đầu từ điểm cam kết');
    assert.equal(bd.points.at(-1).ideal, 0);
    assert.ok(bd.points.at(-1).remaining === null, 'ngày tương lai để trống');
    const live = (await call(dev, 'GET', `/projects/${pid}/reports/sprint?sprintId=${s1}`)).data.report;
    assert.deepEqual(live.added, [nums.d]);
    assert.deepEqual(live.removed, []);
    // Bỏ một thẻ ra rồi đưa lại: lúc ở ngoài thì là "removed", đưa lại thì hết.
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.c}`, { sprintId: null });
    assert.deepEqual((await call(dev, 'GET', `/projects/${pid}/reports/sprint?sprintId=${s1}`)).data.report.removed, [nums.c]);
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.c}`, { sprintId: s1 });
    const back = (await call(dev, 'GET', `/projects/${pid}/reports/sprint?sprintId=${s1}`)).data.report;
    assert.deepEqual(back.removed, []);
    assert.deepEqual(back.added, [nums.d], 'đưa lại thẻ đã cam kết không tính là thêm');
  });

  it('kết thúc sprint: thẻ chưa xong + việc con sang sprint mới, báo cáo được chụp', async () => {
    const r = await call(lead, 'POST', `/projects/${pid}/sprints/${s1}/complete`, { moveTo: 'new' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const newId = r.data.movedTo;
    assert.ok(newId && newId !== s1 && newId !== s2);
    assert.deepEqual(r.data.report.completed.map((i: any) => i.number), [nums.a]);
    assert.deepEqual(r.data.report.incomplete.map((i: any) => i.number).sort(), [nums.b, nums.c, nums.d].sort());
    assert.equal(r.data.report.completedPoints, 3);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/issues/${nums.b}`)).data.sprintId, newId);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/issues/${nums.sub}`)).data.sprintId, newId, 'việc con chưa xong đi theo cha');
    assert.equal((await call(lead, 'GET', `/projects/${pid}/issues/${nums.a}`)).data.sprintId, s1, 'thẻ đã xong ở lại sprint cũ');

    // Báo cáo sprint đã đóng đọc từ bản chụp, không tính lại từ trạng thái hiện tại.
    const rep = (await call(dev, 'GET', `/projects/${pid}/reports/sprint?sprintId=${s1}`)).data;
    assert.equal(rep.sprint.state, 'CLOSED');
    assert.equal(rep.report.incomplete.length, 3);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/sprints/${s1}/complete`, { moveTo: 'backlog' })).status, 400);
  });

  it('velocity: sprint đã đóng với cam kết/hoàn thành', async () => {
    const v = (await call(dev, 'GET', `/projects/${pid}/reports/velocity`)).data;
    assert.equal(v.sprints.length, 1);
    assert.equal(v.sprints[0].committedPoints, 10);
    assert.equal(v.sprints[0].completedPoints, 3);
    assert.equal(v.average, 3);
  });

  it('tiến độ epic', async () => {
    const e = (await call(dev, 'GET', `/projects/${pid}/reports/epics`)).data.epics.find((x: any) => x.number === nums.epic);
    assert.equal(e.total, 2);
    assert.equal(e.completed, 1);
    assert.equal(e.percent, 50);
    assert.equal(e.pointsDone, 3);
  });

  it('đóng góp: điểm tính cho người được giao, thao tác của AI không cộng cho ai', async () => {
    const aIssue = (await call(lead, 'GET', `/projects/${pid}/issues/${nums.a}`)).data;
    // Giả một thao tác của AI "dưới tên" dev: actorKind AI thì không được tính.
    await prisma.workHistory.create({ data: { issueId: aIssue.id, actorId: dev.id, actorKind: 'AI', field: 'priority', fromValue: '3', toValue: '1' } });
    const c = (await call(lead, 'GET', `/projects/${pid}/reports/contributions`)).data;
    const d = c.members.find((m: any) => m.user.id === dev.id);
    const l = c.members.find((m: any) => m.user.id === lead.id);
    assert.equal(d.resolved, 1);
    assert.equal(d.points, 3);
    assert.equal(d.share, 100);
    const devUserActions = await prisma.workHistory.count({ where: { actorId: dev.id, actorKind: 'USER', field: { not: 'created' }, issue: { projectId: pid } } });
    assert.equal(d.updates, devUserActions, 'chỉ đếm thao tác USER');
    assert.ok(l.created >= 6);
    assert.equal(dev2.id > 0, true);
  });

  it('xoá sprint chưa bắt đầu: thẻ về backlog; sprint đang chạy/đã đóng thì không xoá được', async () => {
    await call(lead, 'PATCH', `/projects/${pid}/issues/${nums.c}`, { sprintId: s2 });
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/sprints/${s2}`)).status, 200);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/issues/${nums.c}`)).data.sprintId, null);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/sprints/${s1}`)).status, 400);
  });
});
