/**
 * CT Work 27/10/2026 — CuongMini review code + đọc hoạt động Git theo người (HTTP + DB, fetch GitHub GIẢ, model GIẢ).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.codeReview.db.test.ts
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
const tag = `wr${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const PATCH = `@@ -10,3 +10,5 @@ public class RoomDao {
     public Room find(int id) {
-        String sql = "SELECT * FROM rooms WHERE id=" + id;
+        String sql = "SELECT * FROM rooms WHERE id=?";
+        PreparedStatement ps = conn.prepareStatement(sql);
+        ps.setInt(1, id);
     }`;

describe('CuongMini review code — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, member2: U, teacher: U, client: U;
  let pid = 0;
  let issueNum = 0;
  let modelCalls = 0;

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

  function mockFetch(url: string) {
    const h = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
    const u = new URL(url);
    if (u.pathname === '/repos/acme/nhatro') return Promise.resolve(h(200, { default_branch: 'main', private: false, html_url: 'https://github.com/acme/nhatro' }));
    if (u.pathname === '/repos/acme/nhatro/pulls/7') {
      return Promise.resolve(h(200, { number: 7, title: 'NT-1 Room lookup', body: 'Fixes NT-1', state: 'open', draft: false, mergeable: true, head: { ref: 'feature/NT-1', sha: 'a'.repeat(40) }, base: { ref: 'main', sha: 'b'.repeat(40) }, user: { login: dev.username }, additions: 3, deletions: 1, changed_files: 1, html_url: 'https://github.com/acme/nhatro/pull/7' }));
    }
    if (u.pathname === '/repos/acme/nhatro/pulls/7/files') return Promise.resolve(h(200, [{ filename: 'src/dao/RoomDao.java', status: 'modified', additions: 3, deletions: 1, changes: 4, patch: PATCH }]));
    if (u.pathname.startsWith('/repos/acme/nhatro/commits/')) {
      return Promise.resolve(h(200, { sha: u.pathname.split('/').pop(), commit: { message: 'NT-1 dao', author: { name: dev.username, email: dev.email, date: new Date().toISOString() } }, parents: [], stats: { additions: 3, deletions: 1 }, files: [{ filename: 'src/dao/RoomDao.java', status: 'modified', additions: 3, deletions: 1, changes: 4, patch: PATCH }] }));
    }
    return Promise.resolve(h(404, { message: 'Not Found' }));
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_AI_CODE_REVIEW_PER_USER_DAY = '2';
    __setGitFetchForTests(mockFetch as never);
    const { _setCodeReviewAskForTests } = await import('../services/work/codeReview.service.js');
    _setCodeReviewAskForTests(async (_s, user) => {
      modelCalls++;
      assert.match(user, /untrusted="true"/, 'mã + mô tả PR bọc untrusted');
      assert.match(user, /\s12 \+\s+PreparedStatement ps/, 'diff có số dòng tệp mới');
      return JSON.stringify({
        summary: 'Dùng PreparedStatement — tốt, nhưng chưa đóng tài nguyên.', verdict: 'APPROVE',
        findings: [
          { file: 'src/dao/RoomDao.java', line: 12, severity: 'MAJOR', category: 'correctness', message: 'PreparedStatement không được đóng', suggestion: 'Dùng try-with-resources' },
          { file: 'src/Invented.java', line: 3, severity: 'BLOCKER', category: 'security', message: 'bịa' },
          { file: 'RoomDao.java', line: 400, severity: 'NIT', category: 'style', message: 'đặt tên' },
        ],
        acceptance: [{ criterion: 'Tìm phòng theo id', met: 'yes', evidence: 'src/dao/RoomDao.java:11' }, { criterion: 'Có unit test', met: 'no', evidence: 'không có test trong diff' }],
        nextSteps: ['Đóng PreparedStatement', 'Viết test cho find()'],
      });
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, member2, teacher, client] = await Promise.all(['lead', 'dev', 'mem2', 'teacher', 'client'].map(mkUser));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `Review ${tag}` })).data;
    await call(lead, 'POST', `/workspaces/${ws.id}/invites`, { emails: [dev.email, member2.email, teacher.email, client.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${ws.id}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK' })).data.id;
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/members/${teacher.id}`, { role: 'TEACHER' })).status, 200);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/members/${client.id}`, { role: 'CLIENT' })).status, 200);
    const cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    const typeId = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    issueNum = (await call(lead, 'POST', `/projects/${pid}/issues`, { typeId, title: 'Tìm phòng theo id', assigneeId: dev.id })).data.number;
    await call(lead, 'POST', `/projects/${pid}/github`, {});
    await call(lead, 'PATCH', `/projects/${pid}/github`, { repoFullName: 'acme/nhatro' });
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 7, title: 'NT-1 Room lookup', state: 'open', authorLogin: dev.username, headRef: 'feature/NT-1', baseRef: 'main', issueNumbers: [issueNum], openedAt: new Date() } });
    const at = new Date().toISOString();
    await prisma.workGitEvent.create({
      data: {
        projectId: pid, provider: 'GITHUB', kind: 'PUSH', dedupeKey: `${tag}-push1`, ref: 'feature/NT-1', actorLogin: dev.username, commitCount: 2, occurredAt: new Date(),
        commits: [
          { sha: 'c'.repeat(40), message: 'NT-1 dao', authorLogin: dev.username, authorName: dev.username, authorEmail: dev.email, at, issueNumbers: [issueNum], files: 1 },
          { sha: 'd'.repeat(40), message: 'NT-1 servlet', authorLogin: dev.username, authorName: dev.username, authorEmail: dev.email, at, issueNumbers: [issueNum], files: 2 },
        ],
      },
    });
  });

  after(async () => {
    __setGitFetchForTests(null);
    const { _setCodeReviewAskForTests } = await import('../services/work/codeReview.service.js');
    _setCodeReviewAskForTests(null);
    delete process.env.WORK_AI_CODE_REVIEW_PER_USER_DAY;
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('cờ quyền: giảng viên + ADMIN thấy nút review; MEMBER thường thì không; giảng viên hỏi CuongMini được (askAi) nhưng useAi vẫn tắt', async () => {
    const t = (await call(teacher, 'GET', `/projects/${pid}`)).data.permissions;
    assert.equal(t.aiCodeReview, true);
    assert.equal(t.askAi, true);
    assert.equal(t.useAi, false);
    assert.equal((await call(lead, 'GET', `/projects/${pid}`)).data.permissions.aiCodeReview, true);
    assert.equal((await call(member2, 'GET', `/projects/${pid}`)).data.permissions.aiCodeReview, false);
  });

  it('MEMBER thường 403, khách 403, chưa đăng nhập 401 — model KHÔNG được gọi', async () => {
    assert.equal((await call(member2, 'POST', `/projects/${pid}/code/review`, { issue: issueNum })).status, 403);
    assert.equal((await call(client, 'POST', `/projects/${pid}/code/review`, { pr: 7 })).status, 403);
    assert.equal((await call(null, 'POST', `/projects/${pid}/code/review`, { pr: 7 })).status, 401);
    assert.equal((await call(teacher, 'POST', `/projects/${pid}/code/review`, {})).status, 400);
    assert.equal(modelCalls, 0);
  });

  it('giảng viên review theo THẺ ⇒ PR của thẻ; phiên review CODE lưu phát hiện (tệp bịa bị bỏ, dòng ngoài diff bị gỡ), không đặt quyết định; bình luận nội bộ cờ isAi', async () => {
    const r = await call(teacher, 'POST', `/projects/${pid}/code/review`, { issue: issueNum, notify: true });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.verdict, 'CHANGES', 'APPROVE bị hạ vì tiêu chí chưa đạt');
    assert.equal(r.data.findings, 2);
    assert.equal(r.data.commented, true);
    assert.equal(r.data.notified, true);
    const s = await prisma.workReviewSession.findFirst({ where: { projectId: pid, number: r.data.review }, include: { items: true, participants: true } });
    assert.ok(s);
    assert.equal(s!.kind, 'CODE');
    assert.equal(s!.checklistKey, 'CODE_PR');
    assert.equal(s!.decision, null, 'AI không quyết định');
    assert.equal(s!.prUrl, 'https://github.com/acme/nhatro/pull/7');
    const ng = s!.items.filter((i) => i.result === 'NG');
    assert.ok(ng.some((i) => i.line === 'src/dao/RoomDao.java:12' && i.severity === 'MAJOR'));
    assert.ok(ng.some((i) => i.line === 'src/dao/RoomDao.java' && i.severity === 'TRIVIAL'), 'dòng 400 không có trong diff ⇒ chỉ còn tên tệp');
    assert.ok(!s!.items.some((i) => (i.note ?? '').includes('Invented')), 'tệp bịa bị bỏ');
    assert.ok(s!.participants.some((p) => p.userId === dev.id && p.role === 'AUTHOR'));
    assert.ok(s!.participants.some((p) => p.userId === teacher.id && p.role === 'MODERATOR'));
    const issue = await prisma.workIssue.findFirst({ where: { projectId: pid, number: issueNum }, select: { id: true } });
    const c = await prisma.workComment.findFirst({ where: { issueId: issue!.id }, orderBy: { id: 'desc' } });
    assert.ok(c);
    assert.equal(c!.isAi, true);
    assert.equal(c!.authorId, teacher.id);
    assert.equal(c!.visibility, 'INTERNAL');
    assert.match(c!.bodyText, /src\/dao\/RoomDao\.java:12/);
    assert.match(c!.bodyText, new RegExp(`REV-${r.data.review}`));
    const note = await prisma.socialNotification.findFirst({ where: { receiverId: dev.id, type: 'WORK_ALERT' }, orderBy: { id: 'desc' } });
    assert.ok(note, 'người làm nhận chuông');
    // Hiện ở trang Reviews như mọi phiên khác
    const list = await call(lead, 'GET', `/projects/${pid}/reviews`);
    assert.ok(list.data.some((x: any) => x.number === r.data.review && x.kind === 'CODE'));
  });

  it('trưởng dự án vai MEMBER được review; trần lượt/người/ngày ⇒ 429', async () => {
    await prisma.workProject.update({ where: { id: pid }, data: { leadId: member2.id } });
    assert.equal((await call(member2, 'POST', `/projects/${pid}/code/review`, { pr: 7 })).status, 201);
    assert.equal((await call(member2, 'POST', `/projects/${pid}/code/review`, { pr: 7 })).status, 201);
    const third = await call(member2, 'POST', `/projects/${pid}/code/review`, { pr: 7 });
    assert.equal(third.status, 429);
    assert.equal(third.raw.error?.code ?? third.raw.code, 'WORK_AI_REVIEW_LIMIT');
  });

  it('code_read activity: theo người — commit, nhánh, PR, tệp đổi nhiều nhất từ diff thật; khách không đọc được', async () => {
    const { memberActivity } = await import('../services/work/code.service.js');
    const r = await memberActivity(teacher.id, pid, { member: dev.username, since: '7d' });
    assert.equal(r.people.length, 1);
    assert.equal(r.people[0].member?.username, dev.username);
    assert.equal(r.people[0].commits, 2);
    assert.deepEqual(r.people[0].branches, ['feature/NT-1']);
    assert.equal(r.people[0].prs[0].number, 7);
    assert.equal(r.people[0].topFiles[0].file, 'src/dao/RoomDao.java');
    assert.equal(r.people[0].topFiles[0].commits, 2);
    const all = await memberActivity(lead.id, pid, {});
    assert.equal(all.totals.commits, 2);
    await assert.rejects(memberActivity(client.id, pid, {}), (e: any) => e.statusCode === 403);
    await assert.rejects(memberActivity(teacher.id, pid, { since: '2026-10-20', until: '2026-10-01' }), (e: any) => e.statusCode === 400);
  });
});
