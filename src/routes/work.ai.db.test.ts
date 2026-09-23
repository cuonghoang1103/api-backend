/**
 * Test đợt 4 (AI) — phần KHÔNG gọi model thật: hạn mức, áp dụng đề xuất dưới
 * quyền người bấm, ghi công, thẻ trùng, gợi ý người nhận, rủi ro. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ai.db.test.ts
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
const tag = `wai${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work đợt 4 — AI (phần không gọi model)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, viewer: U;
  let pid = 0;
  let cfg: any;
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

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, viewer] = await Promise.all(['lead', 'dev', 'viewer'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `AI ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'AI', name: 'AI test', template: 'SWT301' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('hết lượt miễn phí ⇒ 402 WORK_AI_QUOTA_EXCEEDED kèm đường nâng cấp', async () => {
    const old = process.env.WORK_AI_FREE_DAILY;
    process.env.WORK_AI_FREE_DAILY = '0';
    try {
      const q = (await call(dev, 'GET', '/ai/quota')).data;
      assert.equal(q.pro, false);
      assert.equal(q.remaining, 0);
      const r = await call(dev, 'POST', `/projects/${pid}/ai/chat`, { message: 'What should I do next?' });
      // Máy không có khoá AI thì 503 (tính năng tắt) — còn có khoá thì phải là 402.
      assert.ok([402, 503].includes(r.status), `status ${r.status}`);
      if (r.status === 402) {
        assert.equal(r.raw.code, 'WORK_AI_QUOTA_EXCEEDED');
        assert.equal(r.raw.data.upgradeUrl, '/pro');
      }
    } finally {
      if (old === undefined) delete process.env.WORK_AI_FREE_DAILY; else process.env.WORK_AI_FREE_DAILY = old;
    }
  });

  it('người chỉ xem không gọi được AI', async () => {
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/ai/chat`, { message: 'hi' })).status, 403);
  });

  it('áp dụng đề xuất: tạo story có tiêu chí chấp nhận, thao tác ghi là AI (không cộng công)', async () => {
    const r = await call(dev, 'POST', `/projects/${pid}/ai/apply`, {
      action: {
        type: 'create_issue', issueType: 'STORY', title: 'Reset password by email',
        description: 'Users who forgot their password can reset it.', acceptanceCriteria: ['Link expires after 30 minutes', 'Old password stops working'],
        priority: 2, assignee: dev.username, storyPoints: 3,
      },
    });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const num = r.data.number;
    const issue = (await call(dev, 'GET', `/projects/${pid}/issues/${num}`)).data;
    assert.equal(issue.assignee.id, dev.id);
    assert.equal(issue.storyPoints, 3);
    assert.ok(JSON.stringify(issue.descriptionJson).includes('Link expires after 30 minutes'));
    const created = await prisma.workHistory.findFirst({ where: { issue: { projectId: pid, number: num }, field: 'created' } });
    assert.equal(created?.actorKind, 'AI');
    const contrib = (await call(lead, 'GET', `/projects/${pid}/reports/contributions`)).data;
    assert.equal(contrib.members.find((m: any) => m.user.id === dev.id)?.created ?? 0, 0, 'thẻ AI soạn không tính là dev tạo');
  });

  it('đề xuất không vượt quyền: viewer bấm apply bị chặn; người lạ trong danh sách giao việc bị từ chối', async () => {
    const r = await call(viewer, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'create_issue', issueType: 'TASK', title: 'x' } });
    assert.equal(r.status, 403);
    const bad = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'create_issue', issueType: 'TASK', title: 'x', assignee: 'nobody_here' } });
    assert.equal(bad.status, 400);
    const badType = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'create_issue', issueType: 'SPACESHIP', title: 'x' } });
    assert.equal(badType.status, 400);
  });

  it('áp dụng: sửa thẻ theo tên trạng thái, bình luận AI, tạo test gắn yêu cầu', async () => {
    const story = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('STORY'), title: 'Checkout with card' })).data;
    const u = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'update_issue', number: story.number, status: 'In Progress', priority: 1 } });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    const after1 = (await call(dev, 'GET', `/projects/${pid}/issues/${story.number}`)).data;
    assert.equal(after1.priority, 1);
    const c = await call(dev, 'POST', `/projects/${pid}/ai/apply`, { action: { type: 'add_comment', number: story.number, text: 'Consider 3-D Secure.' } });
    assert.equal(c.status, 200);
    const comments = (await call(dev, 'GET', `/projects/${pid}/issues/${story.number}/comments`)).data;
    assert.equal(comments.at(-1).isAi, true);
    const t = await call(dev, 'POST', `/projects/${pid}/ai/apply`, {
      action: { type: 'create_test', title: 'Pay with a valid card', steps: [{ action: 'Enter card 4242…', expected: 'Payment succeeds' }], requirement: story.number },
    });
    assert.equal(t.status, 200, JSON.stringify(t.raw));
    const tr = (await call(dev, 'GET', `/projects/${pid}/reports/traceability`)).data;
    assert.equal(tr.rows.find((r: any) => r.number === story.number).tests[0].number, t.data.number);
  });

  it('thẻ trùng (pg_trgm) và gợi ý người nhận — không tốn lượt AI', async () => {
    await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'Login button does nothing on Safari' });
    const sim = (await call(dev, 'GET', `/projects/${pid}/similar?title=${encodeURIComponent('Login button not working on Safari')}`)).data;
    assert.ok(sim.length >= 1, 'tìm được thẻ gần giống');
    assert.match(sim[0].title, /Login button/);
    const sug = (await call(dev, 'GET', `/projects/${pid}/suggest-assignee`)).data;
    assert.ok(sug.length >= 2);
    const devRow = sug.find((s: any) => s.userId === dev.id);
    assert.ok(devRow.openIssues >= 1, 'dev đang có việc mở nên bị tính tải');
  });

  it('rủi ro tính bằng mã: quá hạn, việc đứng yên, ưu tiên cao chưa ai nhận', async () => {
    const past = new Date(Date.now() - 4 * 86_400_000).toISOString().slice(0, 10);
    const late = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Late task', dueDate: past, assigneeId: dev.id })).data;
    const urgent = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Urgent unowned', priority: 1 })).data;
    const stuck = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'Stuck task', assigneeId: dev.id })).data;
    await call(lead, 'PATCH', `/projects/${pid}/issues/${stuck.number}`, { statusId: cfg.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === 'In Progress').id });
    await prisma.workIssue.updateMany({ where: { projectId: pid, number: stuck.number }, data: { updatedAt: new Date(Date.now() - 9 * 86_400_000) } });
    const r = (await call(viewer, 'GET', `/projects/${pid}/insights`)).data;
    assert.ok(r.overdue.some((i: any) => i.number === late.number));
    assert.ok(r.unassignedUrgent.some((i: any) => i.number === urgent.number));
    const s = r.stale.find((i: any) => i.number === stuck.number);
    assert.ok(s && s.idleDays >= 8);
  });
});
