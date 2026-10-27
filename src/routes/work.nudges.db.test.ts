/**
 * CT Work 27/10/2026 — CuongMini "hỏi nhanh": gợi ý chuyển trạng thái thẻ (HTTP + DB).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.nudges.db.test.ts
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
import { agentRouteAllowed, agentTopRouteAllowed } from '../services/work/permissions.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wn${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CuongMini hỏi nhanh — tuyến agent', () => {
  it('agent không gọi được gợi ý của người', () => {
    assert.equal(agentRouteAllowed('GET', '/nudges'), false);
    assert.equal(agentRouteAllowed('POST', '/nudges/3/apply'), false);
    assert.equal(agentTopRouteAllowed('GET', '/me/nudges'), false);
  });
});

describe('CuongMini hỏi nhanh — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, viewer: U;
  let pid = 0;
  const n: Record<string, number> = {};

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, raw: json };
  }
  const task = (doc?: unknown) => doc;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, viewer] = await Promise.all(['lead', 'dev', 'viewer'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Nudge ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK' })).data.id;
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' })).status, 200);
    const cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    const typeId = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    const mk = async (title: string, descriptionJson?: unknown) => (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId, title, assigneeId: dev.id, ...(descriptionJson ? { descriptionJson } : {}) })).data.number as number;
    n.setup = await mk('Cài môi trường JDK + Tomcat');
    n.pr = await mk('Màn hình tìm phòng');
    n.check = await mk('Viết SRS màn đăng nhập', task({ type: 'doc', content: [{ type: 'taskList', content: [
      { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Use case' }] }] },
      { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Wireframe' }] }] },
    ] }] }));
    n.plain = await mk('API thanh toán');
    n.fresh = await mk('Đọc tài liệu Spring');
    await prisma.$executeRaw`UPDATE work_issues SET updated_at = now() - interval '3 days' WHERE project_id = ${pid} AND number = ${n.setup}`;
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 12, title: `NT-${n.pr} tìm phòng`, url: 'https://github.com/acme/nhatro/pull/12', state: 'merged', mergedAt: new Date(), issueNumbers: [n.pr], openedAt: new Date() } });
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('người làm thấy ≤ 3 gợi ý: PR đã merge trước, checklist đủ, thẻ cơ bản nằm im là CÂU HỎI; thẻ thường/mới sửa không có', async () => {
    const r = await call(dev, 'GET', `/projects/${pid}/nudges`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const nums = r.data.items.map((x: any) => x.issue.number);
    assert.deepEqual(nums, [n.pr, n.check, n.setup]);
    assert.equal(r.data.items[0].kind, 'CODE_MERGED');
    assert.match(r.data.items[0].to.name, /review/i, 'PR đã merge ⇒ cột Review của workflow thật');
    assert.equal(r.data.items[1].to.category, 'DONE', 'checklist đủ ⇒ Done');
    assert.equal(r.data.items[0].evidence[0].url, 'https://github.com/acme/nhatro/pull/12');
    assert.equal(r.data.items[2].question, true);
    assert.ok(!nums.includes(n.plain) && !nums.includes(n.fresh));
    const mine = await call(dev, 'GET', '/me/nudges');
    assert.equal(mine.data.items.length, 3);
    assert.equal(mine.data.items[0].project.key, 'NT');
  });

  it('người khác (lead) không thấy gợi ý thẻ của dev; VIEWER 403', async () => {
    assert.equal((await call(lead, 'GET', `/projects/${pid}/nudges`)).data.items.length, 0);
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/nudges`)).status, 403);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/nudges/${n.pr}/apply`, {})).status, 400, 'không phải thẻ của mình');
  });

  it('"Chưa" ⇒ hoãn 3 ngày; "Có" ⇒ chuyển qua cửa ghi chung + bình luận nội bộ kèm bằng chứng + ghi chú', async () => {
    assert.equal((await call(dev, 'POST', `/projects/${pid}/nudges/${n.setup}/snooze`)).status, 200);
    let r = await call(dev, 'GET', `/projects/${pid}/nudges`);
    assert.ok(!r.data.items.some((x: any) => x.issue.number === n.setup));
    const a = await call(dev, 'POST', `/projects/${pid}/nudges/${n.pr}/apply`, { note: 'Đã demo trên lớp' });
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    const issue = await prisma.workIssue.findFirst({ where: { projectId: pid, number: n.pr }, select: { id: true, status: { select: { name: true } } } });
    assert.match(issue!.status.name, /review/i);
    const c = await prisma.workComment.findFirst({ where: { issueId: issue!.id }, orderBy: { id: 'desc' } });
    assert.equal(c!.isAi, true);
    assert.equal(c!.authorId, dev.id);
    assert.equal(c!.visibility, 'INTERNAL');
    assert.match(c!.bodyText, /#12/);
    assert.match(c!.bodyText, /Đã demo trên lớp/);
    const h = await prisma.workHistory.findFirst({ where: { issueId: issue!.id, field: 'statusId' }, orderBy: { id: 'desc' }, select: { actorId: true } }).catch(() => null);
    if (h) assert.equal(h.actorId, dev.id, 'chuyển dưới danh tính người bấm');
    r = await call(dev, 'GET', `/projects/${pid}/nudges`);
    assert.ok(!r.data.items.some((x: any) => x.issue.number === n.pr), 'đã ở Review ⇒ người review quyết, không hỏi người làm nữa');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/nudges/${n.pr}/apply`, {})).status, 409);
  });
});
