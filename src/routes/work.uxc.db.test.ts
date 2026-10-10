/**
 * UX-C — Team overview, mốc + baseline Timeline, kéo-thả WBS qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.uxc.db.test.ts
 *
 * Dữ liệu dựng tay (T = bây giờ):
 *   A  Task · In Progress từ T−6 ngày (lịch sử)         · lead      ⇒ kẹt (6 ≥ 3)
 *   B  Task · In Review từ T−3 ngày                      · dev       ⇒ kẹt review (3 ≥ 2) + "review đang chờ"
 *   C  Task · In Progress từ T−1 ngày, gắn cờ Blocked   · dev       ⇒ kẹt BLOCKED
 *   D  Task · In Progress từ T−1 ngày                    · dev       ⇒ KHÔNG kẹt, nằm trong "đang làm" của dev
 *   E  Task · To Do · hạn T−4                            · (chưa giao) ⇒ trễ 4 ngày
 *   Epic X ⊃ S1, S2 ; S1 ⊃ sub-task K
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
import { addDays } from '../services/work/contribRules.js';
import { vnDay } from '../services/work/sprints.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `uc${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };
const DAY = 86_400_000;
const ymd = (d: Date) => d.toISOString().slice(0, 10);

describe('UX-C — Team overview, Timeline markers/baseline, WBS move (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, outsider: U;
  let pid = 0;
  let cfg: any;
  const n: Record<string, number> = {};
  const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const issue = async (who: U, title: string, extra: Record<string, unknown> = {}) => {
    const r = await call(who, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, outsider] = await Promise.all(['lead', 'dev', 'out'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `UXC ${tag}` })).data;
    wsIds.push(ws.id);
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'UXC', name: 'UX-C', template: 'BLANK' })).data.id;
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng dữ liệu', async () => {
    const wf = await prisma.workWorkflow.findFirstOrThrow({ where: { projectId: pid, isDefault: true }, select: { id: true, statuses: { select: { id: true, name: true, category: true, position: true } } } });
    const prog = wf.statuses.find((s) => s.category === 'IN_PROGRESS')!;
    const review = await prisma.workStatus.create({ data: { workflowId: wf.id, name: 'In Review', category: 'IN_PROGRESS', position: prog.position + 1, color: '#8b5cf6' } });
    const now = Date.now();
    const put = async (num: number, statusId: number, daysAgo: number, extra: Record<string, unknown> = {}) => {
      const row = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num }, select: { id: true, statusId: true } });
      await prisma.workIssue.update({ where: { id: row.id }, data: { statusId, createdAt: new Date(now - 10 * DAY), ...extra } });
      await prisma.workHistory.create({ data: { issueId: row.id, field: 'statusId', fromValue: String(row.statusId), toValue: String(statusId), createdAt: new Date(now - daysAgo * DAY) } });
    };
    n.A = (await issue(lead, 'A stuck work', { assigneeId: lead.id })).number;
    n.B = (await issue(dev, 'B waiting review', { assigneeId: dev.id })).number;
    n.C = (await issue(dev, 'C blocked', { assigneeId: dev.id })).number;
    n.D = (await issue(dev, 'D fresh', { assigneeId: dev.id })).number;
    n.E = (await issue(lead, 'E late', { dueDate: addDays(vnDay(), -4) })).number; // hạn theo ngày giờ VN như máy chủ
    await put(n.A, prog.id, 6);
    await put(n.B, review.id, 3);
    await put(n.C, prog.id, 1, { flaggedAt: new Date(), flagReason: 'waiting on API' });
    await put(n.D, prog.id, 1);
    // Cây WBS
    n.X = (await issue(lead, 'Epic X', { typeId: type('EPIC') })).number;
    const x = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n.X }, select: { id: true } });
    n.S1 = (await issue(lead, 'Story 1', { typeId: type('STORY'), parentId: x.id })).number;
    n.S2 = (await issue(lead, 'Story 2', { typeId: type('STORY'), parentId: x.id })).number;
    const s1 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n.S1 }, select: { id: true } });
    const sub = cfg.issueTypes.find((t: any) => t.level === -1);
    n.K = (await issue(lead, 'Sub K', { typeId: sub.id, parentId: s1.id })).number;
  });

  it('team overview: kẹt / review / trễ / đang làm / tải theo người', async () => {
    const r = await call(lead, 'GET', `/projects/${pid}/team-overview`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const d = r.data;
    assert.deepEqual(d.stuck.map((s: any) => [s.number, s.reason]), [[n.C, 'BLOCKED'], [n.B, 'REVIEW'], [n.A, 'IN_PROGRESS']]);
    assert.equal(d.stuck.find((s: any) => s.number === n.A).days >= 6, true);
    assert.deepEqual(d.reviews.map((x: any) => x.number), [n.B]);
    assert.deepEqual(d.overdue.map((x: any) => [x.number, x.daysLate]), [[n.E, 4]]);
    assert.equal(d.totals.stuck, 3);
    assert.equal(d.totals.unassigned >= 1, true);
    const pDev = d.people.find((p: any) => p.user.id === dev.id);
    assert.deepEqual(pDev.doing.map((x: any) => x.number).sort(), [n.B, n.C, n.D].sort());
    assert.equal(pDev.stuck, 2);
    assert.equal(pDev.reviews, 1);
    assert.equal(pDev.inProgress, 3);
    assert.equal(d.stuckRule.reviewDays, 2);
    assert.equal(d.stuckRule.inProgressDays, 3);
    // Hồ sơ/health tính chung với hub giảng viên (có mặt dù dự án BLANK).
    assert.ok(d.health && ['red', 'amber', 'green'].includes(d.health.status));
    assert.ok(d.docs && typeof d.docs.missing === 'number');
    assert.ok(d.qna && d.qna.open === 0);
    // Người ngoài: 404.
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/team-overview`)).status, 404);
  });

  it('timeline: mốc sprint/version', async () => {
    await call(lead, 'POST', `/projects/${pid}/versions`, { name: 'v1', startDate: ymd(new Date()), releaseDate: ymd(new Date(Date.now() + 20 * DAY)) });
    const r = await call(dev, 'GET', `/projects/${pid}/timeline/markers`);
    assert.equal(r.status, 200);
    assert.equal(r.data.versions.length, 1);
    assert.equal(r.data.versions[0].name, 'v1');
    assert.ok(Array.isArray(r.data.sprints));
    assert.deepEqual(r.data.stages, []); // mô-đun stages tắt
  });

  it('baseline: chụp, dời ngày, so (trễ/thêm/gỡ), quyền xoá', async () => {
    // Chưa có thẻ nào có ngày ngoài E (hạn) ⇒ vẫn chụp được (E có due).
    await call(dev, 'PUT', `/projects/${pid}/issues/${n.D}/schedule`, { startDate: '2026-11-02', dueDate: '2026-11-06' });
    await call(dev, 'PUT', `/projects/${pid}/issues/${n.B}/schedule`, { startDate: '2026-11-02', dueDate: '2026-11-04' });
    const b = await call(dev, 'POST', `/projects/${pid}/timeline/baselines`, { name: 'Plan v1' });
    assert.equal(b.status, 201, JSON.stringify(b.raw));
    assert.equal(b.data.itemCount, 3);
    // Dời D trễ 3 ngày, gỡ lịch B, thêm lịch cho A.
    await call(dev, 'PUT', `/projects/${pid}/issues/${n.D}/schedule`, { startDate: '2026-11-05', dueDate: '2026-11-09' });
    await call(dev, 'PUT', `/projects/${pid}/issues/${n.B}/schedule`, { startDate: null, dueDate: null });
    await call(lead, 'PUT', `/projects/${pid}/issues/${n.A}/schedule`, { startDate: '2026-11-01', dueDate: '2026-11-03' });
    const c = await call(lead, 'GET', `/projects/${pid}/timeline/baselines/${b.data.id}/compare`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    const state = Object.fromEntries(c.data.rows.map((x: any) => [x.number, [x.state, x.slipDays]]));
    assert.deepEqual(state[n.D], ['SLIPPED', 3]);
    assert.deepEqual(state[n.B], ['UNSCHEDULED', null]);
    assert.deepEqual(state[n.A], ['ADDED', null]);
    assert.deepEqual(state[n.E], ['ON_PLAN', 0]);
    assert.equal(c.data.summary.maxSlip, 3);
    assert.equal(c.data.items.length, 3);
    const list = await call(dev, 'GET', `/projects/${pid}/timeline/baselines`);
    assert.equal(list.data.length, 1);
    assert.equal(list.data[0].createdBy.id, dev.id);
    // Xoá: người chụp được; người ngoài 404.
    assert.equal((await call(outsider, 'DELETE', `/projects/${pid}/timeline/baselines/${b.data.id}`)).status, 404);
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/timeline/baselines/${b.data.id}`)).status, 200);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/timeline/baselines`)).data.length, 0);
  });

  it('WBS kéo-thả: đổi thứ tự, đổi cha, chặn sai tầng; WBS đánh số lại theo', async () => {
    const wbs = async () => (await call(lead, 'GET', `/projects/${pid}/wbs`)).data.rows as Array<{ number: number; wbs: string }>;
    const at = (rows: Array<{ number: number; wbs: string }>, num: number) => rows.find((r) => r.number === num)?.wbs;
    let rows = await wbs();
    assert.equal(at(rows, n.S1), `${at(rows, n.X)!.split('.')[0]}.1`);
    // Đặt S2 lên trước S1.
    const m1 = await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.S2}/move`, { parentNumber: n.X, beforeNumber: n.S1 });
    assert.equal(m1.status, 200, JSON.stringify(m1.raw));
    rows = await wbs();
    const ex = at(rows, n.X)!.split('.')[0];
    assert.equal(at(rows, n.S2), `${ex}.1`);
    assert.equal(at(rows, n.S1), `${ex}.2`);
    assert.equal(at(rows, n.K), `${ex}.2.1`);
    // Kéo task D vào dưới epic X (đổi cha) ⇒ lịch sử ghi parentId.
    const m2 = await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.D}/move`, { parentNumber: n.X, afterNumber: n.S1 });
    assert.equal(m2.status, 200, JSON.stringify(m2.raw));
    rows = await wbs();
    assert.equal(at(rows, n.D), `${ex}.3`);
    const d = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: n.D }, select: { id: true, parentId: true } });
    assert.ok(d.parentId);
    assert.equal(await prisma.workHistory.count({ where: { issueId: d.id, field: 'parentId' } }), 1);
    // Sai tầng: sub-task lên gốc / dưới epic; epic dưới story.
    const bad = await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.K}/move`, { parentNumber: null });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_WBS_SUBTASK_NEEDS_PARENT');
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.K}/move`, { parentNumber: n.X })).status, 400);
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.X}/move`, { parentNumber: n.S1 })).status, 400);
    // Vòng: S1 dưới sub-task của chính nó.
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/wbs/items/${n.S1}/move`, { parentNumber: n.K })).status, 400);
    // Người ngoài: 404.
    assert.equal((await call(outsider, 'PUT', `/projects/${pid}/wbs/items/${n.S1}/move`, { parentNumber: null })).status, 404);
  });
});
