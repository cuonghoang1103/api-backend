/**
 * CT Work 27/10/2026 — CuongMini làm thay trưởng nhóm: review hàng loạt cột Review + chế độ tự động + hoàn tác (HTTP + DB,
 * model GIẢ, fetch GitHub GIẢ).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.reviewQueue.db.test.ts
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
import { __setGitFetchForTests } from '../services/work/gitSource.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `wq${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CuongMini review hàng loạt + tự động — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, member2: U;
  let pid = 0;
  let reviewId = 0;
  const n: Record<string, number> = {};
  let calls = 0;

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
  const status = async (num: number) => (await prisma.workIssue.findFirst({ where: { projectId: pid, number: num }, select: { status: { select: { name: true, category: true } } } }))!.status;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    __setGitFetchForTests(((url: string) => {
      const h = (s: number, b: unknown) => Promise.resolve(new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } }));
      const u = new URL(url);
      if (u.pathname === '/repos/acme/q') return h(200, { default_branch: 'main' });
      if (u.pathname === '/repos/acme/q/pulls/5') return h(200, { number: 5, title: 'login', state: 'closed', merged: true, merged_at: new Date().toISOString(), head: { ref: 'f', sha: 'a'.repeat(40) }, base: { ref: 'main' }, user: { login: 'x' }, html_url: 'https://github.com/acme/q/pull/5' });
      if (u.pathname === '/repos/acme/q/pulls/5/files') return h(200, [{ filename: 'src/Login.java', status: 'modified', additions: 2, deletions: 0, changes: 2, patch: '@@ -1,1 +1,3 @@\n a\n+b\n+c' }]);
      return h(404, {});
    }) as never);
    const { _setQueueAskForTests } = await import('../services/work/reviewHangLoat.service.js');
    _setQueueAskForTests(async (_s, user) => {
      calls++;
      const m = /Issue NT-(\d+) is in/.exec(user);
      const num = Number(m?.[1]);
      if (num === n.good) return JSON.stringify({ decision: 'DONE', summary: 'Đạt', acceptance: [{ criterion: 'Đăng nhập được', met: 'yes', evidence: 'src/Login.java:2' }], comment: 'Đạt vì đã có đăng nhập.' });
      if (num === n.bad) return JSON.stringify({ decision: 'DONE', summary: 'Thiếu', acceptance: [{ criterion: 'Có test', met: 'no', evidence: 'không có test' }], comment: '1. Viết test' });
      return JSON.stringify({ decision: 'DONE', summary: 'Không rõ', acceptance: [{ criterion: 'Giao diện đẹp', met: 'unknown' }], comment: 'Cần xem ảnh' });
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, member2] = await Promise.all(['lead', 'dev', 'mem2'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Queue ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, member2.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK' })).data.id;
    const cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    const typeId = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    const mk = async (title: string) => (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId, title, assigneeId: dev.id })).data.number as number;
    n.good = await mk('Đăng nhập');
    n.bad = await mk('Đăng ký');
    n.unsure = await mk('Giao diện trang chủ');
    reviewId = (await prisma.workStatus.findFirst({ where: { workflow: { projectId: pid }, category: 'IN_PROGRESS', name: { contains: 'eview', mode: 'insensitive' } }, select: { id: true } }))!.id;
    await prisma.workIssue.updateMany({ where: { projectId: pid, number: { in: [n.good, n.bad, n.unsure] } }, data: { statusId: reviewId } });
    await call(lead, 'POST', `/projects/${pid}/github`, {});
    await call(lead, 'PATCH', `/projects/${pid}/github`, { repoFullName: 'acme/q' });
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 5, title: 'login', state: 'merged', issueNumbers: [n.good], openedAt: new Date(), mergedAt: new Date() } });
  });

  after(async () => {
    __setGitFetchForTests(null);
    const { _setQueueAskForTests } = await import('../services/work/reviewHangLoat.service.js');
    _setQueueAskForTests(null);
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('(A) MEMBER thường 403; trưởng nhóm nhận gói đề xuất: DONE / BACK (DONE có tiêu chí "no" bị hạ) / KEEP-hoặc-DONE chưa chắc', async () => {
    assert.equal((await call(member2, 'POST', `/projects/${pid}/code/review/queue`, {})).status, 403);
    assert.equal(calls, 0);
    const r = await call(lead, 'POST', `/projects/${pid}/code/review/queue`, {});
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const by = Object.fromEntries(r.data.items.map((x: any) => [x.issue.number, x]));
    assert.equal(by[n.good].decision, 'DONE');
    assert.equal(by[n.good].autoDone, true, 'PR đã merge + tiêu chí đủ bằng chứng');
    assert.equal(by[n.good].code.merged, true);
    assert.equal(by[n.bad].decision, 'BACK');
    assert.equal(by[n.bad].to.category ?? 'IN_PROGRESS', 'IN_PROGRESS');
    assert.equal(by[n.unsure].autoDone, false, 'tiêu chí unknown ⇒ không tự Done');
    const again = await call(lead, 'POST', `/projects/${pid}/code/review/queue`, {});
    assert.equal(again.data.items.length, 3);
    assert.equal(calls, 3, 'thẻ chưa đổi ⇒ dùng lại kết quả, không gọi model lần nữa');
  });

  it('(A) áp dụng dòng người bấm giữ: chuyển dưới danh tính người bấm + bình luận @người làm', async () => {
    const r = await call(lead, 'POST', `/projects/${pid}/code/review/queue/apply`, { items: [{ number: n.bad, decision: 'BACK', comment: '1. Viết test cho đăng ký' }] });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.results[0].ok, true);
    const s = await status(n.bad);
    assert.equal(s.category, 'IN_PROGRESS');
    assert.doesNotMatch(s.name, /review/i);
    const issue = await prisma.workIssue.findFirst({ where: { projectId: pid, number: n.bad }, select: { id: true } });
    const c = await prisma.workComment.findFirst({ where: { issueId: issue!.id }, orderBy: { id: 'desc' } });
    assert.equal(c!.isAi, true);
    assert.equal(c!.authorId, lead.id);
    assert.match(JSON.stringify(c!.bodyJson), new RegExp(`"type":"mention","attrs":\\{"id":"${dev.id}"`));
  });

  it('(B) mặc định TẮT; MEMBER không bật được; ADMIN bật ⇒ chỉ tự Done khi đủ điều kiện, còn lại giữ; hoàn tác được', async () => {
    const { autoReviewProject } = await import('../services/work/reviewHangLoat.service.js');
    assert.equal(await autoReviewProject(pid), 0, 'chưa bật ⇒ không làm gì');
    assert.equal((await call(lead, 'GET', `/projects/${pid}/code/review/auto`)).data.settings.enabled, false);
    assert.equal((await call(member2, 'PUT', `/projects/${pid}/code/review/auto`, { enabled: true })).status, 403);
    const on = await call(lead, 'PUT', `/projects/${pid}/code/review/auto`, { enabled: true });
    assert.equal(on.status, 200, JSON.stringify(on.raw));
    assert.equal(on.data.enabled, true);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'review.ai_auto_on' } }), 'có audit');
    const did = await autoReviewProject(pid);
    assert.equal(did, 2, 'n.good + n.unsure (n.bad đã ra khỏi cột Review)');
    assert.equal((await status(n.good)).category, 'DONE');
    assert.match((await status(n.unsure)).name, /review/i, 'chưa chắc ⇒ để người xem');
    assert.equal(await autoReviewProject(pid), 0, 'thẻ không đổi ⇒ không xét lại');
    const st = await call(lead, 'GET', `/projects/${pid}/code/review/auto`);
    const row = st.data.recent.find((x: any) => x.issue?.number === n.good);
    assert.equal(row.decision, 'DONE');
    assert.equal(row.canUndo, true);
    const u = await call(lead, 'POST', `/projects/${pid}/code/review/auto/${row.id}/undo`);
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.match((await status(n.good)).name, /review/i);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/code/review/auto/${row.id}/undo`)).status, 409);
  });
});
