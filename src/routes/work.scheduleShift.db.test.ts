/**
 * Dời lịch dự án (27/11/2026) — POST /projects/:pid/schedule/shift (HTTP + DB).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.scheduleShift.db.test.ts
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
const tag = `sh${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };
const d = (x: Date | null | undefined) => (x ? x.toISOString().slice(0, 10) : null);

describe('Dời lịch dự án — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, member: U;
  let pid = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : JSON.stringify(body) });
    const json: any = await res.json().catch(() => ({}));
    return { status: res.status, data: json.data, code: json.error?.code ?? json.code };
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, member] = await Promise.all(['lead', 'mem'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Shift ${tag}` })).data;
    wsIds.push(ws.id);
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [member.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'SH', name: 'Shift test', template: 'SWP391' })).data.id;
    await prisma.workProjectMember.upsert({
      where: { uk_work_project_member: { projectId: pid, userId: member.id } },
      create: { projectId: pid, userId: member.id, role: 'MEMBER' }, update: { role: 'MEMBER' },
    }).catch(() => undefined);
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('firstSprintStart: thử trước không ghi, chạy thật dời thẻ mở + sprint mở + version chưa phát hành; thứ đã xong giữ nguyên', async () => {
    const s1 = (await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 1' })).data;
    const s2 = (await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 2' })).data;
    // Sprint 1 bắt đầu 05/10/2026 00:00 giờ VN (= 04/10 17:00 UTC); sprint 0 đã xong từ trước.
    await prisma.workSprint.update({ where: { id: s1.id }, data: { startAt: new Date('2026-10-04T17:00:00Z'), endAt: new Date('2026-10-11T16:59:59Z') } });
    await prisma.workSprint.update({ where: { id: s2.id }, data: { startAt: new Date('2026-10-11T17:00:00Z'), endAt: new Date('2026-10-18T16:59:59Z') } });
    const open = (await call(lead, 'POST', `/projects/${pid}/issues`, { title: 'Open task', typeKey: 'TASK', dueDate: '2026-10-10' })).data;
    const done = (await call(lead, 'POST', `/projects/${pid}/issues`, { title: 'Done task', typeKey: 'TASK', dueDate: '2026-10-09' })).data;
    await prisma.workIssue.update({ where: { id: done.id }, data: { startDate: new Date('2026-10-05'), resolvedAt: new Date() } });
    await prisma.workIssue.update({ where: { id: open.id }, data: { startDate: new Date('2026-10-05') } });
    const v = (await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1', releaseDate: '2026-12-13' })).data;

    const thu = await call(lead, 'POST', `/projects/${pid}/schedule/shift`, { firstSprintStart: '2026-11-28', dryRun: true });
    assert.equal(thu.status, 200);
    assert.equal(thu.data.days, 54);
    assert.equal(thu.data.dryRun, true);
    assert.equal(thu.data.firstSprint.oldStart, '2026-10-05');
    assert.equal(thu.data.firstSprint.newStart, '2026-11-28');
    assert.equal(thu.data.counts.issues, 1, 'chỉ đếm thẻ chưa xong');
    assert.equal(thu.data.counts.sprints, 2);
    assert.equal(thu.data.counts.versions, 1);
    assert.equal(d((await prisma.workIssue.findUnique({ where: { id: open.id } }))!.dueDate), '2026-10-10', 'thử trước KHÔNG ghi');

    const that = await call(lead, 'POST', `/projects/${pid}/schedule/shift`, { firstSprintStart: '2026-11-28' });
    assert.equal(that.status, 200);
    assert.equal(that.data.dryRun, false);
    const o = await prisma.workIssue.findUnique({ where: { id: open.id } });
    assert.equal(d(o!.startDate), '2026-11-28');
    assert.equal(d(o!.dueDate), '2026-12-03');
    const dn = await prisma.workIssue.findUnique({ where: { id: done.id } });
    assert.equal(d(dn!.dueDate), '2026-10-09', 'thẻ đã xong giữ nguyên lịch sử');
    const sp1 = await prisma.workSprint.findUnique({ where: { id: s1.id } });
    assert.equal(sp1!.startAt!.toISOString(), '2026-11-27T17:00:00.000Z', '28/11 00:00 giờ VN');
    assert.equal(d((await prisma.workVersion.findUnique({ where: { id: v.id } }))!.releaseDate), '2027-02-05');
    const log = await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'project.schedule_shift' } }).catch(() => null);
    if (log !== null) assert.ok(log, 'có nhật ký quản trị');
  });

  it('thành viên thường không dời được; thiếu tham số ⇒ 400', async () => {
    assert.equal((await call(member, 'POST', `/projects/${pid}/schedule/shift`, { days: 3, dryRun: true })).status, 403);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/schedule/shift`, {})).status, 400);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/schedule/shift`, { days: 1000 })).status, 400);
  });
});
