/**
 * CTW Đóng góp — chỉ số thành viên + đánh giá chéo qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.contrib.db.test.ts
 *
 * Dữ liệu DỰNG TAY, biết trước đáp án (mốc thời gian đặt cố định tương đối "hôm nay" theo giờ VN, 12:00 trưa):
 *   alice  — 2 việc xong (3 + 5 điểm; một đúng hạn, một trễ 1 ngày THEO GIỜ VN nhưng đúng hạn theo giờ New York),
 *            cycle 2 + 1 ngày, lead 6 + 8 ngày, 3 giờ log (Coding 2 · Testing 1), 1 bình luận trả lời @nhắc sau 3 giờ,
 *            1 lần @nhắc không trả lời, 1 yêu cầu review, 1 PR (+100 −20, tác giả git "ali-gh" — chỉ khớp sau khi gán tay),
 *            2 phiên bản Docs trên 1 trang, 3 UTCID tạo (5.1 "Created by: Alice"), họp: được mời 2 · dự 1.
 *   bob    — 1 việc quá hạn đang mở, 2 bình luận (@alice), 1 test case tạo, 1 lần chạy test FAIL + 1 bug tìm ra, 1 bug báo,
 *            1 commit (khớp theo email), 2 UTCID chạy, 30 phút log NGOÀI khoảng.
 *   owner  — 1 review đã duyệt.
 * Quyền: MEMBER chỉ thấy mình + tổng nhóm (ẩn người khác) ⇒ bật "cả nhóm xem" thì thấy hết; TEACHER thấy hết;
 * CLIENT / agent ⇒ 403; người ngoài ⇒ 404. Đánh giá chéo: không tự chấm, ẩn danh tuyệt đối, ≥ 2 người mới tự xem điểm.
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
import { readXlsx } from '../services/work/xlsxStyled.js';
import { addDays, dayKey } from '../services/work/contribRules.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `cb${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CTW Đóng góp — chỉ số thành viên, quyền xem, đánh giá chéo (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, alice: U, bob: U, teacher: U, client: U, outsider: U, bot: U;
  let wsId = 0, pid = 0;
  const T = dayKey(new Date(), 'Asia/Ho_Chi_Minh');
  /** 12:00 trưa giờ VN của ngày T−k (05:00Z) — cùng một ngày lịch ở cả VN lẫn New York. */
  const D = (k: number, h = 5) => new Date(`${addDays(T, -k)}T${String(h).padStart(2, '0')}:00:00Z`);
  const range = `preset=custom&from=${addDays(T, -14)}&to=${T}`;

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const username = `${tag}_${name}`;
    const u = await prisma.user.create({ data: { username, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, type: res.headers.get('content-type'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const mention = (uid: number, text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'mention', attrs: { id: uid, label: 'x' } }, { type: 'text', text: ` ${text}` }] }] });
  const row = (data: any, uid: number) => data.members.find((r: any) => r.user.id === uid);

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, alice, bob, teacher, client, outsider] = await Promise.all(['owner', 'alice', 'bob', 'teacher', 'client', 'outsider'].map((n) => mkUser(n)));
    bot = await mkUser('bot', 'AGENT');
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

  let i1 = 0, i2 = 0, i3 = 0;
  it('dựng dự án + dữ liệu biết trước đáp án', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Contrib ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [alice.email, bob.email, teacher.email, client.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CTB', name: 'Contrib Demo', template: 'BLANK' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[alice, 'MEMBER'], [bob, 'MEMBER'], [teacher, 'TEACHER'], [client, 'CLIENT']] as const) {
      assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    }
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: bot.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: bot.id, role: 'MEMBER' } });

    const statuses = await prisma.workStatus.findMany({ where: { workflow: { projectId: pid } }, select: { id: true, category: true } });
    const doneId = statuses.find((s) => s.category === 'DONE')!.id;
    const wipId = statuses.find((s) => s.category === 'IN_PROGRESS')!.id;
    const mk = async (title: string, typeKey = 'TASK', u: U = owner) => {
      const r = await call(u, 'POST', `/projects/${pid}/issues`, { title, typeKey });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      return r.data as { id: number; number: number };
    };
    // I1: alice — tạo T−10, vào In progress T−6, xong T−4 (hạn T−3 ⇒ đúng hạn), 3 điểm.
    const a = await mk('Login API');
    i1 = a.number;
    await prisma.workIssue.update({ where: { id: a.id }, data: { assigneeId: alice.id, createdAt: D(10), resolvedAt: D(4), statusId: doneId, dueDate: new Date(`${addDays(T, -3)}T00:00:00Z`), storyPoints: 3 } });
    await prisma.workHistory.create({ data: { issueId: a.id, actorId: alice.id, actorKind: 'USER', field: 'statusId', toValue: String(wipId), createdAt: D(6) } });
    // I2: alice — tạo T−9 05:00Z… xong (T−1) 03:30Z = 10:30 VN ngày T−1 (hạn T−2 ⇒ trễ 1 ngày ở VN) nhưng 23:30 ngày T−2 ở New York.
    const b = await mk('Register screen');
    i2 = b.number;
    const resolved2 = new Date(`${addDays(T, -1)}T03:30:00Z`);
    await prisma.workIssue.update({ where: { id: b.id }, data: { assigneeId: alice.id, createdAt: new Date(resolved2.getTime() - 8 * 86_400_000), resolvedAt: resolved2, statusId: doneId, dueDate: new Date(`${addDays(T, -2)}T00:00:00Z`), storyPoints: 5 } });
    await prisma.workHistory.create({ data: { issueId: b.id, actorId: alice.id, actorKind: 'USER', field: 'statusId', toValue: String(wipId), createdAt: new Date(resolved2.getTime() - 86_400_000) } });
    // I3: bob — đang mở, hạn T−2 ⇒ quá hạn. I4: bob — hạn T+3.
    const c = await mk('Search page');
    i3 = c.number;
    await prisma.workIssue.update({ where: { id: c.id }, data: { assigneeId: bob.id, createdAt: D(8), dueDate: new Date(`${addDays(T, -2)}T00:00:00Z`) } });
    const d = await mk('Profile page');
    await prisma.workIssue.update({ where: { id: d.id }, data: { assigneeId: bob.id, createdAt: D(8), dueDate: new Date(`${addDays(T, 3)}T00:00:00Z`) } });

    // Giờ: alice 120' Coding T−4 + 60' Testing T−2; bob 30' T−20 (ngoài khoảng 14 ngày).
    await prisma.workWorklog.createMany({ data: [
      { issueId: a.id, userId: alice.id, minutes: 120, startedAt: D(4), activity: 'Coding', createdAt: D(4) },
      { issueId: b.id, userId: alice.id, minutes: 60, startedAt: D(2), activity: 'Testing', createdAt: D(2) },
      { issueId: c.id, userId: bob.id, minutes: 30, startedAt: D(20), createdAt: D(20) },
    ] });
    // Bình luận: bob @alice trên I1 (T−5) ⇒ alice trả lời 3 giờ sau; bob @alice trên I2 (T−4) ⇒ không ai trả lời.
    await prisma.workComment.create({ data: { issueId: a.id, authorId: bob.id, bodyJson: mention(alice.id, 'can you check?'), bodyText: '@alice can you check?', createdAt: D(5) } });
    await prisma.workComment.create({ data: { issueId: a.id, authorId: alice.id, bodyJson: { type: 'doc', content: [] }, bodyText: 'Done, see PR', createdAt: D(5, 8) } });
    // (alice đổi trạng thái I2 lúc T−2 03:30Z = 94 giờ sau ⇒ quá 48 giờ ⇒ "chưa trả lời".)
    await prisma.workComment.create({ data: { issueId: b.id, authorId: bob.id, bodyJson: mention(alice.id, 'status?'), bodyText: '@alice status?', createdAt: D(6) } });
    // Bình luận do AI soạn (isAi) — không tính cho ai.
    await prisma.workComment.create({ data: { issueId: b.id, authorId: alice.id, isAi: true, bodyJson: { type: 'doc', content: [] }, bodyText: 'AI summary', createdAt: D(3) } });

    // Docs: alice tạo + sửa trang (2 phiên bản), bob sửa 1 lần.
    const page = await prisma.workPage.create({ data: { projectId: pid, number: 900, title: 'SRS', ownerId: alice.id } });
    await prisma.workPageVersion.createMany({ data: [
      { pageId: page.id, n: 1, kind: 'CREATE', title: 'SRS', authorId: alice.id, createdAt: D(6) },
      { pageId: page.id, n: 2, kind: 'EDIT', title: 'SRS', authorId: alice.id, createdAt: D(5) },
      { pageId: page.id, n: 3, kind: 'EDIT', title: 'SRS', authorId: bob.id, createdAt: D(3) },
    ] });

    // Kiểm thử: bob tạo test case + chạy FAIL (T−2) tìm ra bug do bob báo.
    const tc = await mk('TC login wrong password', 'TASK', bob);
    const tcase = await prisma.workTestCase.create({ data: { issueId: tc.id } });
    const bug = await mk('Login accepts empty password', 'BUG', bob);
    const cycle = await prisma.workTestCycle.create({ data: { projectId: pid, name: 'Sprint 1' } });
    const run = await prisma.workTestRun.create({ data: { cycleId: cycle.id, testCaseId: tcase.id, status: 'FAIL', executedById: bob.id, executedAt: D(2) } });
    await prisma.workTestRunDefect.create({ data: { runId: run.id, issueId: bug.id, createdAt: D(2) } });
    // 5.1: hàm "Created by: Alice" có 3 UTCID, "Executed by: <username bob>" chạy 2.
    await prisma.workUnitFunction.create({ data: {
      projectId: pid, moduleName: 'AuthService', methodName: 'login', createdBy: 'Alice', executedBy: bob.username, createdAt: D(6),
      cases: { create: [{ position: 0, result: 'P', executedAt: new Date(`${addDays(T, -2)}T00:00:00Z`) }, { position: 1, result: 'F', executedAt: new Date(`${addDays(T, -2)}T00:00:00Z`) }, { position: 2 }] },
    } });

    // Review: alice xin review (T−3), owner duyệt (T−2).
    await prisma.workApproval.create({ data: {
      projectId: pid, targetType: 'ISSUE', issueId: a.id, title: 'Review CTB-1', createdById: alice.id, createdAt: D(3), status: 'APPROVED',
      steps: { create: [{ approverId: owner.id, decision: 'APPROVED', decidedAt: D(2) }] },
    } });
    // Code: PR của "ali-gh" (chưa khớp ai) + commit của bob (khớp email).
    await prisma.workDevContribution.createMany({ data: [
      { projectId: pid, provider: 'GITHUB', kind: 'PR', externalId: 'org/r#1', title: '#1 Login', authorLogin: 'ali-gh', additions: 100, deletions: 20, filesChanged: 4, occurredAt: D(3), issueNumbers: [i1] },
      { projectId: pid, provider: 'GITHUB', kind: 'COMMIT', externalId: 'sha-bob-1', title: 'search', authorName: 'Bobby', authorEmail: bob.email, occurredAt: D(2), issueNumbers: [i3] },
    ] });
    // Họp: T−3 DONE (alice, bob); T−1 SCHEDULED (alice).
    await prisma.workMeeting.create({ data: { projectId: pid, number: 1, title: 'Sprint review', status: 'DONE', startsAt: D(3), endsAt: D(3, 6), attendees: { create: [{ userId: alice.id }, { userId: bob.id }] } } });
    await prisma.workMeeting.create({ data: { projectId: pid, number: 2, title: 'Planning', status: 'SCHEDULED', startsAt: D(1), endsAt: D(1, 6), attendees: { create: [{ userId: alice.id }] } } });
  });

  it('chỉ số từng người khớp đáp án dựng tay (ADMIN thấy tất)', async () => {
    const r = await call(owner, 'GET', `/projects/${pid}/contrib/summary?${range}`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.window.days, 15);
    assert.equal(r.data.access.view, 'ALL');
    const A = row(r.data, alice.id).metrics;
    assert.deepEqual(
      [A.completed, A.points, A.withDue, A.onTime, A.late, A.onTimeRate, A.avgLateDays, A.cycleDays, A.leadDays],
      [2, 8, 2, 1, 1, 50, 1, 1.5, 7],
    );
    assert.equal(A.hours, 3);
    assert.deepEqual(A.hoursByActivity, { Coding: 2, Testing: 1 });
    assert.deepEqual([A.comments, A.mentions, A.mentionsAnswered, A.mentionsUnanswered, A.responseHours], [1, 2, 1, 1, 3]);
    assert.deepEqual([A.reviewRequests, A.prs, A.additions], [1, 0, null], 'PR của "ali-gh" chưa khớp ai');
    assert.deepEqual([A.docVersions, A.pagesCreated, A.pagesEdited], [2, 1, 1]);
    assert.deepEqual([A.utcidCreated, A.meetingsInvited, A.meetingsAttended], [3, 2, 1]);
    const B = row(r.data, bob.id).metrics;
    assert.deepEqual([B.overdueOpen, B.comments, B.testCasesCreated, B.testRuns, B.defectsFound, B.bugsReported, B.commits, B.utcidExecuted, B.hours], [1, 2, 1, 1, 1, 1, 1, 2, 0]);
    assert.ok(row(r.data, bob.id).signals.some((s: any) => s.code === 'overdue'));
    assert.equal(row(r.data, owner.id).metrics.reviewsDone, 1);
    // Agent: tách riêng, không cộng vào tổng của người.
    assert.equal(row(r.data, bot.id).user.isAgent, true);
    assert.equal(r.data.team.humans, 3);
    assert.equal(r.data.team.totals.completed, 2);
    assert.equal(r.data.team.totals.onTimeRate, 50);
    // Không có chữ "lười" ở đâu cả.
    assert.doesNotMatch(JSON.stringify(r.data.members.map((m: any) => m.signals)), /lazy|lười/i);
    assert.equal(r.data.charts.heatmap.length, 182);
    assert.ok(r.data.tookMs < 3000);
  });

  it('gán danh tính git ⇒ PR tính cho alice (A26 +100 −20)', async () => {
    const g = await call(owner, 'GET', `/projects/${pid}/contrib/git-authors`);
    assert.equal(g.status, 200);
    const unmatched = g.data.authors.find((x: any) => x.login === 'ali-gh');
    assert.equal(unmatched.userId, null);
    assert.equal(g.data.authors.find((x: any) => x.email === bob.email).userId, bob.id, 'bob khớp theo email');
    assert.equal((await call(alice, 'GET', `/projects/${pid}/contrib/git-authors`)).status, 403);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/git-authors`, { identity: 'ali-gh', userId: outsider.id })).status, 400);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/git-authors`, { identity: 'ali-gh', userId: alice.id })).status, 200);
    const A = row((await call(owner, 'GET', `/projects/${pid}/contrib/summary?${range}`)).data, alice.id).metrics;
    assert.deepEqual([A.prs, A.additions, A.deletions], [1, 100, 20]);
  });

  it('múi giờ dự án: New York ⇒ việc xong 23:30 tối hạn là ĐÚNG hạn', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/settings`, { timezone: 'Mars/Base' })).status, 400);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/settings`, { timezone: 'America/New_York' })).status, 200);
    const r = await call(owner, 'GET', `/projects/${pid}/contrib/summary?${range}`);
    assert.equal(r.data.window.tz, 'America/New_York');
    const A = row(r.data, alice.id).metrics;
    assert.deepEqual([A.onTime, A.late, A.onTimeRate], [2, 0, 100]);
    await call(owner, 'PUT', `/projects/${pid}/contrib/settings`, { timezone: 'Asia/Ho_Chi_Minh' });
  });

  it('quyền: MEMBER chỉ mình + tổng nhóm; TEACHER tất; khách/agent 403; người ngoài 404', async () => {
    const m = await call(alice, 'GET', `/projects/${pid}/contrib/summary?${range}`);
    assert.equal(m.status, 200);
    assert.equal(m.data.access.view, 'SELF');
    assert.deepEqual(m.data.members.map((r: any) => r.user.id), [alice.id]);
    assert.ok(m.data.hiddenMembers >= 2);
    assert.equal(m.data.team.totals.completed, 2, 'tổng nhóm vẫn có');
    assert.ok(!JSON.stringify(m.data).includes(bob.username), 'không lộ tên người khác');
    assert.equal((await call(alice, 'GET', `/projects/${pid}/contrib/members/${bob.id}?${range}`)).status, 403);
    assert.equal((await call(alice, 'GET', `/projects/${pid}/contrib/members/${alice.id}?${range}`)).status, 200);
    assert.equal((await call(alice, 'GET', `/projects/${pid}/contrib/export.xlsx?${range}`)).status, 403);
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/settings`, { teamVisible: true })).status, 403);
    const t = await call(teacher, 'GET', `/projects/${pid}/contrib/summary?${range}`);
    assert.equal(t.data.access.view, 'ALL');
    assert.ok(row(t.data, bob.id));
    assert.equal((await call(client, 'GET', `/projects/${pid}/contrib/summary`)).code, 'WORK_CONTRIB_FORBIDDEN');
    // Agent không đăng nhập bằng JWT (AGENT_NO_LOGIN); token ctw_ của agent bị chặn ở tầng tuyến (AGENT_DENIED_ROUTES,
    // permissions.test.ts) — và ở tầng service, gọi thẳng:
    assert.equal((await call(bot, 'GET', `/projects/${pid}/contrib/summary`)).status, 403);
    const svc = await import('../services/work/contrib.service.js');
    await assert.rejects(svc.summary(bot.id, pid, {}), (e: any) => e.code === 'WORK_AGENT_FORBIDDEN');
    const peerSvc = await import('../services/work/contribPeer.service.js');
    await assert.rejects(peerSvc.submitReview(bot.id, pid, 1, alice.id, { scores: {} }), (e: any) => e.code === 'WORK_AGENT_FORBIDDEN');
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/contrib/summary`)).status, 404);
    // Bật "cả nhóm xem" ⇒ MEMBER thấy hết.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/settings`, { teamVisible: true })).status, 200);
    const m2 = await call(alice, 'GET', `/projects/${pid}/contrib/summary?${range}`);
    assert.equal(m2.data.access.view, 'ALL');
    assert.ok(row(m2.data, bob.id));
    await call(owner, 'PUT', `/projects/${pid}/contrib/settings`, { teamVisible: false });
    // Cài đặt dự án khác không bị đè.
    const s = await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } });
    assert.ok((s.settings as any).estimation !== undefined || Object.keys(s.settings as object).length > 1);
  });

  it('chi tiết người + xem theo task', async () => {
    const d = await call(owner, 'GET', `/projects/${pid}/contrib/members/${bob.id}?${range}`);
    assert.equal(d.status, 200);
    assert.deepEqual(d.data.overdue.map((x: any) => [x.number, x.daysLate]), [[i3, 2]]);
    assert.ok(d.data.timeline.some((x: any) => x.kind === 'test'));
    assert.equal(d.data.heatmap.length, 182);
    const a = await call(owner, 'GET', `/projects/${pid}/contrib/members/${alice.id}?${range}`);
    assert.deepEqual(a.data.lateDone.map((x: any) => [x.number, x.daysLate]), [[i2, 1]]);
    const t = await call(teacher, 'GET', `/projects/${pid}/contrib/issues/${i1}`);
    assert.equal(t.status, 200);
    const who = (uid: number) => t.data.people.find((p: any) => p.who.user?.id === uid);
    assert.equal(who(alice.id).comments, 1);
    assert.equal(who(alice.id).hours, 2);
    assert.equal(who(alice.id).commits, 1, 'PR nhắc CTB-1 gắn vào thẻ');
    assert.equal(who(bob.id).comments, 1);
    assert.equal(t.data.issue.onTime, true);
  });

  it('xuất xlsx + PDF một trang', async () => {
    const x = await download(owner, `/projects/${pid}/contrib/export.xlsx?${range}`);
    assert.equal(x.status, 200);
    const sheets = readXlsx(x.buf);
    assert.deepEqual(sheets.map((s) => s.name).slice(0, 3), ['Summary', 'Members', 'Activity']);
    assert.ok(sheets.some((s) => s.name === 'Definitions'));
    const members = sheets.find((s) => s.name === 'Members')!;
    const aliceRow = Array.from({ length: members.maxRow }, (_, i) => i + 1).find((r) => members.text(r, 1) === 'Alice')!;
    assert.ok(aliceRow, 'có dòng Alice');
    assert.equal(members.text(1, 6), 'Completed');
    assert.equal(members.get(aliceRow, 6), 2);
    const pdf = await download(teacher, `/projects/${pid}/contrib/export.pdf?${range}`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
    assert.equal((pdf.buf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length, 1, 'đúng một trang');
  });

  it('đánh giá chéo: không tự chấm, ẩn danh, đóng/mở, ≥ 2 người mới tự xem điểm', async () => {
    assert.equal((await call(alice, 'POST', `/projects/${pid}/contrib/peer/rounds`, { title: 'x' })).status, 403);
    const r = await call(teacher, 'POST', `/projects/${pid}/contrib/peer/rounds`, { title: 'Sprint 1 peer review' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const rid = r.data.id;
    assert.equal(r.data.criteria.length, 4);
    const sc = (a: number, b: number, c: number, d: number) => ({ scores: { contribution: a, deadlines: b, collaboration: c, quality: d } });
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${alice.id}`, sc(5, 5, 5, 5))).code, 'WORK_PEER_SELF');
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${bob.id}`, { scores: { contribution: 9 } })).status, 400);
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${bob.id}`, { ...sc(4, 2, 4, 3), comment: 'Late twice' })).status, 200);
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${owner.id}`, sc(5, 5, 4, 4))).status, 200);
    assert.equal((await call(bob, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${alice.id}`, { ...sc(5, 4, 5, 5), comment: 'Great reviewer' })).status, 200);
    assert.equal((await call(teacher, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${alice.id}`, sc(1, 1, 1, 1))).status, 403, 'giảng viên không chấm');
    assert.equal((await call(client, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`)).status, 403);
    // Sửa phiếu của mình: ghi đè, không nhân đôi.
    assert.equal((await call(alice, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${bob.id}`, { ...sc(4, 2, 4, 4), comment: 'Late twice' })).status, 200);

    const mine = await call(alice, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`);
    assert.equal(mine.data.mine.length, 2);
    assert.equal(mine.data.results, null, 'thành viên không thấy tổng hợp');
    assert.equal(mine.data.myResult, null, 'đợt còn mở');
    const adm = await call(teacher, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`);
    const res = (d: any, uid: number) => d.results.find((x: any) => x.user.id === uid);
    assert.equal(res(adm.data, bob.id).count, 1);
    assert.equal(res(adm.data, bob.id).overall, null, 'đợt còn mở ⇒ chưa lộ điểm (chống suy ra ai chấm)');
    assert.match(adm.data.resultsHiddenReason, /closed/);
    assert.equal(adm.data.completion.find((x: any) => x.user.id === alice.id).submitted, 2);
    const raw = JSON.stringify(adm.data) + JSON.stringify((await call(owner, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`)).data);
    assert.ok(!raw.includes('reviewerId'), 'không bao giờ lộ người chấm');

    // Đóng ⇒ không nộp thêm; alice chỉ có 1 người chấm ⇒ chưa xem được điểm của mình.
    assert.equal((await call(teacher, 'PATCH', `/projects/${pid}/contrib/peer/rounds/${rid}`, { status: 'CLOSED' })).status, 200);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${alice.id}`, sc(3, 3, 3, 3))).code, 'WORK_PEER_CLOSED');
    const closed = await call(alice, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`);
    assert.equal(closed.data.myResult.byCriterion, null);
    assert.match(closed.data.myResult.hiddenReason, /at least 2/);
    // Mở lại, owner chấm alice, đóng ⇒ alice thấy trung bình (không thấy nhận xét).
    await call(teacher, 'PATCH', `/projects/${pid}/contrib/peer/rounds/${rid}`, { status: 'OPEN' });
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/contrib/peer/rounds/${rid}/reviews/${alice.id}`, sc(3, 4, 3, 3))).status, 200);
    await call(owner, 'PATCH', `/projects/${pid}/contrib/peer/rounds/${rid}`, { status: 'CLOSED' });
    const shown = await call(alice, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`);
    assert.deepEqual([shown.data.myResult.count, shown.data.myResult.byCriterion.contribution, shown.data.myResult.overall], [2, 4, 4]);
    assert.ok(!JSON.stringify(shown.data).includes('Great reviewer'), 'thành viên không thấy nhận xét');
    // Đợt đã đóng: giảng viên thấy điểm người có ≥ 2 phiếu (alice), người chỉ 1 phiếu (bob) vẫn ẩn.
    const fin = await call(teacher, 'GET', `/projects/${pid}/contrib/peer/rounds/${rid}`);
    assert.deepEqual([res(fin.data, alice.id).overall, res(fin.data, alice.id).byCriterion.contribution], [4, 4]);
    assert.ok(res(fin.data, alice.id).comments.includes('Great reviewer'));
    assert.deepEqual([res(fin.data, bob.id).count, res(fin.data, bob.id).overall, res(fin.data, bob.id).comments], [1, null, []]);
    const list = await call(bob, 'GET', `/projects/${pid}/contrib/peer/rounds`);
    assert.equal(list.data.rounds[0].status, 'CLOSED');
    // Xoá đợt có phiếu: giảng viên không xoá được (409), ADMIN thì được.
    assert.equal((await call(teacher, 'DELETE', `/projects/${pid}/contrib/peer/rounds/${rid}`)).status, 409);
  });

  it('registry: Ask AI đọc contrib_summary dưới quyền người hỏi', async () => {
    const reg = await import('../services/work/toolRegistry/index.js');
    const out = await reg.runForPerson(alice.id, pid, 'contrib_summary', { preset: 'custom', from: addDays(T, -14), to: T }, 'read');
    const o = out.output as any;
    assert.equal(o.members.length, 1, 'MEMBER: chỉ dòng của mình');
    assert.match(o.visibility, /only you/);
    assert.ok(reg.builtinCommands().every((c) => c.name !== 'contrib_summary'), 'agent dựng sẵn không có lệnh này');
    await assert.rejects(reg.runForPerson(alice.id, pid, 'contrib_summary', {}, 'apply'), /only reads/);
  });

  it('xoá dự án dọn sạch bảng mới', async () => {
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workDevContribution.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workPeerRound.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workGitIdentity.count({ where: { projectId: pid } }), 0);
  });
});
