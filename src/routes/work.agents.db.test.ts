/**
 * CT Work — AI AGENT thành viên (CTW-28, GĐ1 A1–A8), qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.agents.db.test.ts
 *
 *   A2  tạo agent (user kind AGENT, @agents.invalid, password NULL, notify OFF) · đăng nhập/JWT ⇒ 403 AGENT_NO_LOGIN ·
 *       convert giữ nguyên id (bình luận/worklog/lịch sử còn) · chốt removeMember khi còn là owner.
 *   A3  token agent: /me/work 200, /me/api-tokens 403, tuyến quản trị 403, ngoài phạm vi 404, PAUSED GET 200/POST 423,
 *       RETIRED 403.
 *   A4  RÀO CHẮN HAI TẦNG: bảng tuyến đối ngoại ⇒ 403 WORK_AGENT_FORBIDDEN, VÀ bảng hàm service gọi TRỰC TIẾP (không qua
 *       tuyến) ⇒ 403 WORK_AGENT_FORBIDDEN. Approver là agent ⇒ 400; bình luận PUBLIC ⇒ INTERNAL; khách không thấy agent;
 *       agent không sửa/giao thẻ của người khác.
 *   A5  agent kéo Done ⇒ Code Review (resolvedAt null, lịch sử 2 dòng, owner nhận chuông), thiếu cột review ⇒ 400,
 *       người Review → Done bình thường, tắt cờ ⇒ Done thật (có audit), audit "on behalf of".
 *   A6  claim (TODO ⇒ In Progress), hai agent một thẻ ⇒ 409, vượt maxOpenLeases ⇒ 400, heartbeat, sweeper ⇒ EXPIRED +
 *       cờ Blocked + owner + inbox, release; worklog source MANUAL.
 *   A7  hộp thư: giao ⇒ issue.assigned, agent tự comment ⇒ 0 dòng, mention ⇒ comment.mention, trả lại ⇒ issue.returned,
 *       SSE nhận backlog theo `after` + sự kiện sống.
 *   A8  webhook: http/IP nội bộ/tên miền trỏ nội bộ ⇒ 400, chữ ký kiểm được, 5 lần lỗi ⇒ FAILED, 20 ⇒ tắt + báo owner,
 *       redirect ⇒ lỗi, test ping không gửi sự kiện thật.
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
const tag = `ag${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

async function waitFor<T>(fn: () => Promise<T | null | undefined | false>, ms = 3000): Promise<T> {
  const end = Date.now() + ms;
  for (;;) {
    const v = await fn();
    if (v) return v;
    if (Date.now() > end) throw new Error('waitFor: timed out');
    await new Promise((r) => setTimeout(r, 40));
  }
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const doc = (text: string, mentionId?: number) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }, ...(mentionId ? [{ type: 'mention', attrs: { id: String(mentionId), label: 'x' } }] : [])] }],
});

/** Webhook giả: mọi tên miền ⇒ IP công khai, trừ *.internal-test ⇒ 10.0.0.9. Bắt mọi lần gửi. */
const sent: Array<{ url: string; headers: Record<string, string>; body: string }> = [];
let hookStatus = 200;

describe('CT Work — AI agents GĐ1 A1–A8 (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, lead: U, dev: U, guest: U, client: U, other: U;
  let wsId = 0, otherWsId = 0, pid = 0, kbPid = 0;
  let cfg: any, kbCfg: any;
  let agent: U & { agentId: number }, agent2: U & { agentId: number };
  let scopedToken = '';
  let svc: Record<string, any> = {};

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }

  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const statusId = (c: any, name: string) => c.workflows.flatMap((w: any) => w.statuses).find((s: any) => s.name === name).id;
  async function mkIssue(by: U, title: string, extra: Record<string, unknown> = {}, p = pid, c = cfg) {
    const r = await call(by, 'POST', `/projects/${p}/issues`, { typeId: typeId(c, 'TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
  }
  /** Gọi service TRỰC TIẾP — tầng hành động phải tự chặn, không cần tuyến. */
  async function expectAgentForbidden(label: string, fn: () => Promise<unknown>) {
    await assert.rejects(fn, (e: any) => {
      assert.equal(e.statusCode, 403, `${label}: ${e.statusCode} ${e.code} ${e.message}`);
      assert.equal(e.code, 'WORK_AGENT_FORBIDDEN', `${label}: ${e.code} ${e.message}`);
      return true;
    }, label);
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const wh = await import('../services/work/webhooks.service.js');
    wh._setWebhookNetForTests({
      lookup: async (host) => (host.endsWith('.internal-test') ? [{ address: '10.0.0.9' }] : [{ address: '93.184.216.34' }]),
      fetch: async (url, init) => {
        const h: Record<string, string> = {};
        for (const [k, v] of Object.entries((init.headers ?? {}) as Record<string, string>)) h[k.toLowerCase()] = v;
        sent.push({ url, headers: h, body: String(init.body) });
        if (hookStatus === 302) return new Response(null, { status: 302, headers: { location: 'https://127.0.0.1/' } });
        return new Response('ok', { status: hookStatus });
      },
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, lead, dev, guest, client, other] = await Promise.all(['owner', 'lead', 'dev', 'guest', 'client', 'other'].map(mkUser));
    svc = {
      approvals: await import('../services/work/approvals.service.js'),
      stages: await import('../services/work/stages.service.js'),
      finance: await import('../services/work/finance.service.js'),
      clientReports: await import('../services/work/clientReports.service.js'),
      issues: await import('../services/work/issues.service.js'),
      changeRequests: await import('../services/work/changeRequests.service.js'),
      meetings: await import('../services/work/meetings.service.js'),
      portal: await import('../services/work/portal.service.js'),
      share: await import('../services/work/share.service.js'),
      projects: await import('../services/work/projects.service.js'),
      workspaces: await import('../services/work/workspaces.service.js'),
      customize: await import('../services/work/customize.service.js'),
      sprints: await import('../services/work/sprints.service.js'),
      issueMove: await import('../services/work/issueMove.service.js'),
      agents: await import('../services/work/agents.service.js'),
      webhooks: wh,
    };
  });

  after(async () => {
    server?.close();
    (await import('../services/work/webhooks.service.js'))._setWebhookNetForTests(null);
    const agentUsers = await prisma.workAgent.findMany({ where: { workspaceId: { in: [wsId, otherWsId].filter(Boolean) } }, select: { userId: true } });
    const ids = [...userIds, ...agentUsers.map((a) => a.userId)];
    for (const w of [wsId, otherWsId]) if (w) await prisma.workSpace.deleteMany({ where: { id: w } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  // ═══ A1/A2: tạo agent, đăng nhập bị chặn, convert ═══════════════

  it('A2.1 dựng không gian + dự án; admin tạo agent ⇒ user kind AGENT, @agents.invalid, password NULL, notify OFF, token một lần', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Agents ${tag}` })).data.id;
    otherWsId = (await call(other, 'POST', '/workspaces', { name: `Other ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [lead.email, dev.email], role: 'MEMBER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FP', name: 'Flying pencil', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    kbPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'KB', name: 'Kanban', template: 'BLANK', type: 'KANBAN', kind: 'SOFTWARE' })).data.id;
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    kbCfg = (await call(owner, 'GET', `/projects/${kbPid}`)).data;
    await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] });

    const t0 = Date.now();
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Client Unity', model: 'claude-opus-5', roleText: 'Agent · Client Unity', ownerId: lead.id, projectIds: [pid] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.ok(Date.now() - t0 < 30_000);
    assert.equal(r.data.agent.user.kind, 'AGENT');
    assert.match(r.data.token.token, /^ctw_[0-9a-f]{8}_/);
    assert.deepEqual(r.data.token.scopes, ['read', 'write', 'agent']);
    const u = await prisma.user.findUniqueOrThrow({ where: { id: r.data.agent.userId }, select: { username: true, email: true, password: true, kind: true, emailVerified: true, provider: true } });
    assert.equal(u.kind, 'AGENT');
    assert.equal(u.password, null);
    assert.equal(u.provider, 'agent');
    assert.ok(u.email.endsWith('@agents.invalid'));
    assert.equal(u.emailVerified, true);
    assert.equal((await prisma.workNotifySetting.findUnique({ where: { userId: r.data.agent.userId } }))?.emailMode, 'OFF');
    assert.equal((await prisma.workMember.findFirst({ where: { workspaceId: wsId, userId: r.data.agent.userId } }))?.role, 'MEMBER');
    agent = { id: r.data.agent.userId, token: r.data.token.token, email: u.email, username: u.username, agentId: r.data.agent.id };
    const r2 = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Server bot', model: 'gpt-6-sol' });
    agent2 = { id: r2.data.agent.userId, token: r2.data.token.token, email: '', username: r2.data.agent.user.username, agentId: r2.data.agent.id };
    // Chỉ admin không gian tạo được; khách không thấy danh sách.
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/agents`, { name: 'x', model: 'm' })).status, 403);
    assert.equal((await call(dev, 'GET', `/workspaces/${wsId}/agents`)).data.length, 2);
    assert.equal((await call(guest, 'GET', `/workspaces/${wsId}/agents`)).status, 403);
    // Owner phải là NGƯỜI trong không gian.
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'x', model: 'm', ownerId: agent2.id })).code, 'WORK_AGENT_BAD_OWNER');
  });

  it('A2.2 agent KHÔNG đăng nhập: login ⇒ 403 AGENT_NO_LOGIN (trước khi so mật khẩu), JWT cũ ⇒ 403', async () => {
    const { authService } = await import('../services/auth.service.js');
    await assert.rejects(() => authService.login(agent.username, 'anything'), (e: any) => e.code === 'AGENT_NO_LOGIN' && e.statusCode === 403);
    const forged = jwt.sign({ userId: agent.id, username: agent.username, email: agent.email, roles: [], roleVersion: 0 }, config.jwtSecret);
    const r = await call({ token: forged }, 'GET', '/workspaces');
    assert.equal(r.status, 403);
    assert.equal(r.code, 'AGENT_NO_LOGIN');
  });

  it('A2.3 convert bot có sẵn ⇒ GIỮ NGUYÊN id, bình luận/worklog/lịch sử còn, vai dự án hạ MEMBER, token cá nhân chết', async () => {
    const bot = await mkUser('fp_hoasi');
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [bot.email], role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${bot.id}`, { role: 'ADMIN' });
    const i = await mkIssue(owner, 'Bot work', { assigneeId: bot.id });
    const c = await call(bot, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('drew the pencil') });
    assert.equal(c.status, 201);
    assert.equal((await call(bot, 'POST', `/projects/${pid}/issues/${i.number}/worklogs`, { minutes: 30 })).status, 201);
    const personal = await call(bot, 'POST', '/me/api-tokens', { name: 'nhip', scopes: ['read', 'write'] });
    assert.equal((await call({ token: personal.data.token }, 'GET', '/me/work')).status, 200);

    // Không convert được: chính mình, admin không gian, người còn ở không gian khác.
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/agents/convert`, { userId: owner.id, ownerId: lead.id, model: 'm' })).code, 'WORK_AGENT_CONVERT_SELF');
    await call(other, 'POST', `/workspaces/${otherWsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    const elsewhere = await call(owner, 'POST', `/workspaces/${wsId}/agents/convert`, { userId: dev.id, ownerId: lead.id, model: 'm' });
    assert.equal(elsewhere.status, 409);
    assert.equal(elsewhere.code, 'WORK_AGENT_CONVERT_OTHER_WS');

    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents/convert`, { userId: bot.id, ownerId: owner.id, model: 'claude-sonnet-5' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.agent.userId, bot.id, 'giữ nguyên users.id');
    assert.equal(r.data.demotedProjectRoles, 1);
    assert.equal(r.data.revokedTokens, 1);
    const u = await prisma.user.findUniqueOrThrow({ where: { id: bot.id }, select: { kind: true, password: true } });
    assert.equal(u.kind, 'AGENT');
    assert.equal(u.password, null);
    assert.equal((await prisma.workProjectMember.findFirst({ where: { projectId: pid, userId: bot.id } }))?.role, 'MEMBER');
    assert.equal((await prisma.workComment.findUniqueOrThrow({ where: { id: c.data.id } })).authorId, bot.id, 'bình luận cũ còn tác giả');
    assert.equal(await prisma.workWorklog.count({ where: { userId: bot.id } }), 1, 'worklog còn');
    assert.ok((await prisma.workHistory.count({ where: { issueId: i.id } })) >= 2);
    assert.equal((await call({ token: personal.data.token }, 'GET', '/me/work')).status, 401, 'token cá nhân cũ bị thu hồi');
    assert.equal((await call(bot, 'GET', '/workspaces')).code, 'AGENT_NO_LOGIN', 'JWT cũ chết');
    assert.equal((await call({ token: r.data.token.token }, 'GET', '/me/work')).status, 200, 'token agent mới chạy');
    assert.ok(await prisma.workAuditLog.findFirst({ where: { workspaceId: wsId, action: 'agent.convert' } }));
  });

  it('A2.4 xoá thành viên: còn là owner của agent ⇒ 400 WORK_AGENT_HAS_OWNER; xoá chính agent ⇒ phải Retire', async () => {
    assert.equal((await call(owner, 'DELETE', `/workspaces/${wsId}/members/${lead.id}`)).code, 'WORK_AGENT_HAS_OWNER');
    assert.equal((await call(owner, 'DELETE', `/workspaces/${wsId}/members/${agent2.id}`)).code, 'WORK_AGENT_RETIRE_INSTEAD');
    assert.equal((await call(owner, 'PATCH', `/workspaces/${wsId}/members/${agent2.id}`, { role: 'ADMIN' })).code, 'WORK_AGENT_ROLE');
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${agent2.id}`, { role: 'ADMIN' })).code, 'WORK_AGENT_ROLE');
  });

  // ═══ A3: token agent ═════════════════════════════════════════════

  it('A3.1 token agent: /me/work 200 · /me/api-tokens 403 · tạo không gian/agent/token 403 · không gian đọc được', async () => {
    assert.equal((await call(agent, 'GET', '/me/work')).status, 200);
    assert.equal((await call(agent, 'GET', '/me/api-tokens')).status, 403);
    assert.equal((await call(agent, 'GET', '/workspaces')).status, 200);
    assert.equal((await call(agent, 'GET', `/workspaces/${wsId}/members`)).status, 200);
    for (const [m, p, b] of [
      ['POST', '/workspaces', { name: 'evil' }],
      ['POST', `/workspaces/${wsId}/agents`, { name: 'clone', model: 'm' }],
      ['POST', `/workspaces/${wsId}/agents/${agent.agentId}/tokens`, { name: 'more' }],
      ['POST', `/workspaces/${wsId}/invites`, { emails: ['x@y.z'] }],
      ['PUT', '/me/notify-settings', { emailMode: 'INSTANT' }],
    ] as const) {
      const r = await call(agent, m, p, b);
      assert.equal(r.status, 403, `${m} ${p}`);
      assert.equal(r.code, 'WORK_AGENT_FORBIDDEN', `${m} ${p}`);
    }
    const me = await call(agent, 'GET', '/agents/me');
    assert.equal(me.data.id, agent.agentId);
    assert.equal(me.data.owner.id, lead.id);
    assert.equal((await call(lead, 'GET', '/agents/me')).code, 'WORK_NOT_AGENT');
  });

  it('A3.2 phạm vi dự án của token ⇒ ngoài phạm vi 404 (không lộ dự án)', async () => {
    const t = await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/tokens`, { name: 'FP only', scopes: ['read', 'write'], projectIds: [pid] });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    scopedToken = t.data.token;
    assert.equal((await call({ token: scopedToken }, 'GET', `/projects/${pid}`)).status, 200);
    assert.equal((await call({ token: scopedToken }, 'GET', `/projects/${kbPid}`)).status, 404);
    assert.equal((await call(agent, 'GET', `/projects/${kbPid}`)).status, 200, 'token không giới hạn thấy mọi dự án agent vào được');
    assert.equal((await call({ token: scopedToken }, 'GET', '/search?jql=project%20%3D%20KB')).status, 403, 'token giới hạn không tìm xuyên dự án');
  });

  it('A3.3 PAUSED: GET 200, ghi 423 WORK_AGENT_PAUSED; resume ⇒ ghi lại được', async () => {
    const i = await mkIssue(owner, 'Pause target', { assigneeId: agent.id });
    assert.equal((await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/pause`)).status, 200, 'owner tự pause được');
    assert.equal((await call(agent, 'GET', `/projects/${pid}/issues/${i.number}`)).status, 200);
    const w = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('hi') });
    assert.equal(w.status, 423);
    assert.equal(w.code, 'WORK_AGENT_PAUSED');
    await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/resume`);
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('hi') })).status, 201);
  });

  // ═══ A4: rào chắn hai tầng ═══════════════════════════════════════

  it('A4.1 tầng TUYẾN: tuyến đối ngoại ⇒ 403 WORK_AGENT_FORBIDDEN (kể cả khi vai dự án đủ quyền)', async () => {
    const routes: Array<[string, string, unknown?]> = [
      ['GET', '/finance/summary'], ['POST', '/finance/rates', {}], ['POST', '/finance/timesheets/1/approve', {}], ['POST', '/finance/timesheets/1/reopen', { reason: 'x' }],
      ['POST', '/reports/client-weekly/send', {}], ['PUT', '/reports/client-weekly/schedule', {}],
      ['GET', '/portal/overview'], ['POST', '/portal/invite', { emails: ['a@b.c'] }], ['POST', '/portal/uat', {}],
      ['POST', '/share-links', {}], ['PUT', '/issues/1/client-visible', { visible: true }], ['PATCH', '/attachments/1/client', {}],
      ['PUT', '/changes/1/client-visible', {}], ['POST', '/changes/1/approval', {}], ['POST', '/meetings/1/share', {}], ['POST', '/meetings/1/invites', {}],
      ['POST', '/approvals/1/decide', { decision: 'APPROVE' }], ['POST', '/stages/1/request-gate', {}],
      ['GET', '/export'], ['POST', '/exports', {}], ['POST', '/chat-hooks', {}], ['POST', '/automation', {}],
      ['PATCH', '', { name: 'x' }], ['DELETE', '', { confirmKey: 'FP' }], ['PUT', `/members/${dev.id}`, { role: 'VIEWER' }],
      ['POST', '/labels', { name: 'x' }], ['PUT', '/studio', {}], ['PUT', '/agent-settings', { doneToReview: false }],
      ['DELETE', '/issues/1'], ['POST', '/issues/bulk', {}], ['POST', '/ai/chat', {}], ['PUT', '/edit-lock', { locked: true }],
    ];
    assert.ok(routes.length >= 25);
    for (const [m, p, b] of routes) {
      const r = await call(agent, m, `/projects/${pid}${p}`, b);
      assert.equal(r.status, 403, `${m} ${p} ⇒ ${r.status} ${r.code}`);
      assert.equal(r.code, 'WORK_AGENT_FORBIDDEN', `${m} ${p}`);
    }
    // Lỗi kèm người chịu trách nhiệm — agent hỏi người thay vì thử lại (§4.3).
    const r = await call(agent, 'POST', `/projects/${pid}/approvals/1/decide`, { decision: 'APPROVE' });
    assert.equal(r.data.owner, lead.username);
    assert.match(r.raw.message, /Ask the agent's owner/);
  });

  it('A4.2 tầng HÀNH ĐỘNG: hàm service gọi TRỰC TIẾP với actor agent ⇒ 403 WORK_AGENT_FORBIDDEN (không cần tuyến)', async () => {
    // Dữ liệu cũ: một bước duyệt đứng tên agent (bot fp_* trước khi convert) — agent vẫn không quyết được.
    const i = await mkIssue(owner, 'Approval target', { assigneeId: agent.id });
    const ap = await prisma.workApproval.create({
      data: { projectId: pid, targetType: 'ISSUE', issueId: i.id, title: 'legacy', mode: 'PARALLEL', status: 'PENDING', createdById: owner.id, steps: { create: [{ approverId: agent.id, position: 0 }] } },
    });
    const a = agent.id;
    const S = svc;
    const table: Array<[string, () => Promise<unknown>]> = [
      ['approvals.decideApproval', () => S.approvals.decideApproval(a, pid, ap.id, { decision: 'APPROVE' })],
      ['approvals.createCrApproval', () => S.approvals.createCrApproval(a, pid, 1, { approverIds: [owner.id] })],
      ['stages.requestGate', () => S.stages.requestGate(a, pid, 1)],
      ['finance.approveWeek', () => S.finance.approveWeek(a, pid, 1)],
      ['finance.reopenWeek', () => S.finance.reopenWeek(a, pid, 1, 'x')],
      ['finance.returnWeek', () => S.finance.returnWeek(a, pid, 1, 'x')],
      ['finance.createRate', () => S.finance.createRate(a, pid, { scope: 'DEFAULT', hourlyRate: 1 })],
      ['finance.createExpense', () => S.finance.createExpense(a, pid, { title: 'x', amount: 1 })],
      ['finance.createPayment', () => S.finance.createPayment(a, pid, { title: 'x', amount: 1 })],
      ['finance.summary', () => S.finance.summary(a, pid)],
      ['clientReports.sendClientWeekly', () => S.clientReports.sendClientWeekly(a, pid, {})],
      ['clientReports.updateSchedule', () => S.clientReports.updateSchedule(a, pid, { enabled: true })],
      ['issues.setIssueClientVisible', () => S.issues.setIssueClientVisible(a, pid, i.number, true)],
      ['issues.setAttachmentClient', () => S.issues.setAttachmentClient(a, pid, 1, { clientVisible: true })],
      ['changeRequests.setChangeRequestClientVisible', () => S.changeRequests.setChangeRequestClientVisible(a, pid, 1, true)],
      ['meetings.shareMinutes', () => S.meetings.shareMinutes(a, pid, 1, true)],
      ['meetings.sendInvites', () => S.meetings.sendInvites(a, pid, 1)],
      ['portal.inviteClients', () => S.portal.inviteClients(a, pid, ['x@y.z'])],
      ['portal.overview', () => S.portal.overview(a, pid)],
      ['share.createLink', () => S.share.createLink(a, pid, {})],
      ['projects.deleteProject', () => S.projects.deleteProject(a, pid, 'FP')],
      ['projects.updateProject', () => S.projects.updateProject(a, pid, { name: 'x' })],
      ['projects.setProjectMember', () => S.projects.setProjectMember(a, pid, dev.id, 'VIEWER')],
      ['projects.updateStudioConfig', () => S.projects.updateStudioConfig(a, pid, {})],
      ['customize.addStatus', () => S.customize.addStatus(a, pid, cfg.workflows[0].id, { name: 'x', category: 'TODO' })],
      ['workspaces.deleteWorkspace', () => S.workspaces.deleteWorkspace(a, wsId, 'x')],
      ['workspaces.updateMemberRole', () => S.workspaces.updateMemberRole(a, wsId, dev.id, 'ADMIN')],
      ['workspaces.createWorkspace', () => S.workspaces.createWorkspace(a, { name: 'x' })],
      ['issues.deleteIssueAs', () => S.issues.deleteIssueAs(a, pid, i.number)],
      ['sprints.bulkUpdate', () => S.sprints.bulkUpdate(a, pid, [i.number], { priority: 1 })],
      ['issueMove.moveIssueToProject', () => S.issueMove.moveIssueToProject(a, pid, i.number, { targetProjectId: kbPid })],
      ['agents.createAgent (tự nhân bản)', () => S.agents.createAgent(a, wsId, { name: 'x', model: 'm' })],
      ['agents.createAgentToken', () => S.agents.createAgentToken(a, wsId, agent.agentId, { name: 'x', scopes: ['read'] })],
      ['webhooks.createWebhook', () => S.webhooks.createWebhook(a, wsId, agent.agentId, { url: 'https://hooks.example.com/x' })],
    ];
    assert.ok(table.length >= 25);
    for (const [label, fn] of table) await expectAgentForbidden(label, fn);
    assert.equal((await prisma.workApproval.findUniqueOrThrow({ where: { id: ap.id } })).status, 'PENDING', 'không quyết được gì');
  });

  it('A4.3 người duyệt là agent ⇒ 400; agent GỬI duyệt cho người được; bình luận PUBLIC của agent ⇒ INTERNAL', async () => {
    const i = await mkIssue(owner, 'Review me', { assigneeId: agent.id });
    const bad = await call(owner, 'POST', `/projects/${pid}/approvals`, { issueNumber: i.number, approverIds: [agent.id] });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_BAD_APPROVER');
    const okAp = await call(agent, 'POST', `/projects/${pid}/approvals`, { issueNumber: i.number, approverIds: [lead.id] });
    assert.equal(okAp.status, 201, JSON.stringify(okAp.raw));
    await call(owner, 'PUT', `/projects/${pid}/issues/${i.number}/client-visible`, { visible: true });
    const c = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('hello client'), visibility: 'PUBLIC' });
    assert.equal(c.status, 201);
    assert.equal(c.data.visibility, 'INTERNAL');
  });

  it('A4.4 khách KHÔNG BAO GIỜ thấy agent (assignee ⇒ "Project team"); agent không sửa/giao/xoá thẻ người khác', async () => {
    const i = await mkIssue(owner, 'Shared work', { assigneeId: agent.id });
    await call(owner, 'PUT', `/projects/${pid}/issues/${i.number}/client-visible`, { visible: true });
    const seen = await call(client, 'GET', `/projects/${pid}/issues/${i.number}`);
    assert.equal(seen.status, 200, JSON.stringify(seen.raw));
    assert.ok(!JSON.stringify(seen.data).includes(agent.username), 'tên agent không lộ cho khách');

    const devIssue = await mkIssue(owner, 'Dev task', { assigneeId: dev.id });
    assert.equal((await call(agent, 'PATCH', `/projects/${pid}/issues/${devIssue.number}`, { title: 'cleanup' })).code, 'WORK_AGENT_FORBIDDEN');
    assert.equal((await call(agent, 'PATCH', `/projects/${pid}/issues/${i.number}`, { assigneeId: dev.id })).code, 'WORK_AGENT_FORBIDDEN');
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues/${devIssue.number}/move`, { statusId: statusId(cfg, 'In Progress') })).code, 'WORK_AGENT_FORBIDDEN');
    assert.equal((await call(agent, 'PATCH', `/projects/${pid}/issues/${i.number}`, { title: 'Shared work (agent)' })).status, 200, 'thẻ của mình thì sửa được');
    const free = await mkIssue(owner, 'Unassigned');
    assert.equal((await call(agent, 'PATCH', `/projects/${pid}/issues/${free.number}`, { assigneeId: agent.id })).status, 200, 'tự nhận thẻ trống');
    const own = await mkIssue(agent, 'Agent made this');
    assert.equal((await prisma.workHistory.findFirstOrThrow({ where: { issueId: own.id, field: 'created' } })).actorKind, 'AGENT');
    assert.equal((await call(agent, 'DELETE', `/projects/${pid}/issues/${own.number}`)).code, 'WORK_AGENT_FORBIDDEN', 'không tự xoá dấu vết');
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'for dev', assigneeId: dev.id })).code, 'WORK_AGENT_FORBIDDEN');
  });

  // ═══ A5: Done ⇒ Review ═══════════════════════════════════════════

  it('A5.1 agent kéo Done ⇒ đứng ở Code Review, resolvedAt null, lịch sử 2 dòng, owner + reporter nhận chuông; người Review → Done bình thường', async () => {
    const i = await mkIssue(dev, 'Ship it', { assigneeId: agent.id });
    const r = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: statusId(cfg, 'Done') });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const row = await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id }, select: { statusId: true, resolvedAt: true } });
    assert.equal(row.statusId, statusId(cfg, 'Code Review'));
    assert.equal(row.resolvedAt, null);
    const hist = await prisma.workHistory.findMany({ where: { issueId: i.id, field: { in: ['statusId', 'agentReview'] } } });
    assert.equal(hist.length, 2);
    assert.ok(hist.every((h) => h.actorKind === 'AGENT'));
    assert.deepEqual(hist.find((h) => h.field === 'agentReview') && [hist.find((h) => h.field === 'agentReview')!.fromValue, hist.find((h) => h.field === 'agentReview')!.toValue], ['Done', 'Code Review']);
    for (const who of [lead.id, dev.id]) {
      await waitFor(() => prisma.socialNotification.findFirst({ where: { receiverId: who, senderId: agent.id, type: 'WORK_ALERT', entityId: i.id } }));
    }
    const back = await call(lead, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: statusId(cfg, 'Done') });
    assert.equal(back.status, 200);
    assert.ok((await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id } })).resolvedAt, 'người duyệt chốt Done thật');
  });

  it('A5.2 dự án không có cột review ⇒ 400 WORK_AGENT_NO_REVIEW_STATUS; tắt doneToReview ⇒ Done thật + audit; agent không tự tắt được', async () => {
    const k = await mkIssue(owner, 'Kanban job', { assigneeId: agent.id }, kbPid, kbCfg);
    const r = await call(agent, 'POST', `/projects/${kbPid}/issues/${k.number}/move`, { statusId: statusId(kbCfg, 'Done') });
    assert.equal(r.status, 400);
    assert.equal(r.code, 'WORK_AGENT_NO_REVIEW_STATUS');
    assert.equal((await call(agent, 'PUT', `/projects/${kbPid}/agent-settings`, { doneToReview: false })).code, 'WORK_AGENT_FORBIDDEN');
    const s = await call(owner, 'PUT', `/projects/${kbPid}/agent-settings`, { doneToReview: false });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.equal(s.data.doneToReview, false);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: kbPid, action: 'project.agentSettings', summary: { contains: 'close issues directly' } } }));
    const done = await call(agent, 'POST', `/projects/${kbPid}/issues/${k.number}/move`, { statusId: statusId(kbCfg, 'Done') });
    assert.equal(done.status, 200);
    assert.ok((await prisma.workIssue.findUniqueOrThrow({ where: { id: k.id } })).resolvedAt);
  });

  // ═══ A6: lease ═══════════════════════════════════════════════════

  let leaseId = 0;
  let leaseIssue = { id: 0, number: 0 };

  it('A6.1 claim thẻ TODO ⇒ In Progress (actor AGENT) + lease ACTIVE + audit "on behalf of"; agent khác claim ⇒ 409', async () => {
    leaseIssue = await mkIssue(lead, 'Claim me', { assigneeId: agent.id });
    const r = await call(agent, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/claim`, {});
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    leaseId = r.data.lease.id;
    assert.equal(r.data.statusChanged, true);
    const iss = await prisma.workIssue.findUniqueOrThrow({ where: { id: leaseIssue.id }, select: { statusId: true } });
    assert.equal(iss.statusId, statusId(cfg, 'In Progress'));
    const h = await prisma.workHistory.findFirstOrThrow({ where: { issueId: leaseIssue.id, field: 'statusId' }, orderBy: { id: 'desc' } });
    assert.equal(h.actorKind, 'AGENT');
    const au = await prisma.workAuditLog.findFirstOrThrow({ where: { projectId: pid, action: 'agent.claim' }, orderBy: { id: 'desc' } });
    assert.match(au.actorName ?? '', /^🤖 .+ \(on behalf of .+\)$/);
    assert.deepEqual((au.detail as any).agent, { id: agent.agentId, ownerId: lead.id });
    // Agent khác (được giao bằng tay vào DB để thử khoá) ⇒ 409.
    await call(owner, 'PUT', `/projects/${pid}/members/${agent2.id}`, { role: 'MEMBER' });
    const taken = await call(agent2, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/claim`, {});
    assert.equal(taken.status, 409);
    assert.equal(taken.code, 'WORK_LEASE_TAKEN');
    // Claim lại thẻ mình đang giữ = gia hạn, không 409.
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/claim`, {})).data.reclaimed, true);
    // Người không claim được (chỉ agent).
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/claim`, {})).code, 'WORK_NOT_AGENT');
  });

  it('A6.2 thẻ chưa giao ⇒ 403 WORK_LEASE_NOT_ASSIGNED; vượt maxOpenLeases ⇒ 400 WORK_LEASE_LIMIT', async () => {
    const free = await mkIssue(owner, 'Nobody');
    assert.equal((await call(agent, 'POST', `/projects/${pid}/issues/${free.number}/claim`, {})).code, 'WORK_LEASE_NOT_ASSIGNED');
    await call(lead, 'PATCH', `/workspaces/${wsId}/agents/${agent.agentId}`, { parallelSlots: 5 });
    await call(owner, 'PUT', `/projects/${pid}/agent-settings`, { maxOpenLeases: 1 });
    const second = await mkIssue(owner, 'Second', { assigneeId: agent.id });
    const r = await call(agent, 'POST', `/projects/${pid}/issues/${second.number}/claim`, {});
    assert.equal(r.status, 400);
    assert.equal(r.code, 'WORK_LEASE_LIMIT');
    await call(owner, 'PUT', `/projects/${pid}/agent-settings`, { maxOpenLeases: 3 });
  });

  it('A6.3 heartbeat gia hạn + tiến độ; worklog của agent ⇒ source MANUAL, lịch sử AGENT, không bị khoá tuần', async () => {
    const before = (await prisma.workAgentLease.findUniqueOrThrow({ where: { id: leaseId } })).expiresAt;
    await sleep(15);
    const r = await call(agent, 'POST', `/agents/me/leases/${leaseId}/heartbeat`, { progress: 'running tests', progressPct: 72, extendMinutes: 60 });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.progressPct, 72);
    assert.ok(new Date(r.data.expiresAt) > before);
    assert.equal((await call(agent2, 'POST', `/agents/me/leases/${leaseId}/heartbeat`, {})).status, 404, 'lease của agent khác');
    const w = await call(agent, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/worklogs`, { minutes: 45 });
    assert.equal(w.status, 201);
    assert.equal(w.data.source, 'MANUAL');
    assert.equal((await prisma.workHistory.findFirstOrThrow({ where: { issueId: leaseIssue.id, field: 'timeSpentMin' }, orderBy: { id: 'desc' } })).actorKind, 'AGENT');
  });

  it('A6.4 sweeper: lease quá hạn ⇒ EXPIRED, thẻ GIỮ assignee + cờ Blocked, owner nhận chuông, inbox lease.expired', async () => {
    await prisma.workAgentLease.update({ where: { id: leaseId }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const n = await svc.agents.sweepExpiredLeases();
    assert.ok(n >= 1);
    const l = await prisma.workAgentLease.findUniqueOrThrow({ where: { id: leaseId } });
    assert.equal(l.status, 'EXPIRED');
    assert.equal(l.activeIssueId, null);
    const iss = await prisma.workIssue.findUniqueOrThrow({ where: { id: leaseIssue.id }, select: { assigneeId: true, flaggedAt: true, flagReason: true } });
    assert.equal(iss.assigneeId, agent.id);
    assert.ok(iss.flaggedAt);
    assert.equal(iss.flagReason, 'Agent lease expired without heartbeat');
    await waitFor(() => prisma.socialNotification.findFirst({ where: { receiverId: lead.id, senderId: agent.id, entityId: leaseIssue.id, type: 'WORK_ALERT' }, orderBy: { id: 'desc' } }));
    assert.ok(await prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, type: 'lease.expired', issueId: leaseIssue.id } }));
    assert.equal((await call(agent, 'POST', `/agents/me/leases/${leaseId}/heartbeat`, {})).code, 'WORK_LEASE_EXPIRED');
    // Claim lại sau khi hết hạn được (khoá UNIQUE đã nhả); release ⇒ RELEASED.
    const again = await call(agent, 'POST', `/projects/${pid}/issues/${leaseIssue.number}/claim`, {});
    assert.equal(again.status, 201, JSON.stringify(again.raw));
    const rel = await call(agent, 'POST', `/agents/me/leases/${again.data.lease.id}/release`, { reason: 'handing back' });
    assert.equal(rel.data.released, true);
    assert.equal((await prisma.workAgentLease.findUniqueOrThrow({ where: { id: again.data.lease.id } })).status, 'RELEASED');
  });

  // ═══ A7: hộp thư + SSE ═══════════════════════════════════════════

  it('A7.1 giao ⇒ issue.assigned · agent tự comment ⇒ 0 dòng · mention ⇒ comment.mention · comment thường ⇒ comment.on_my_issue · trả lại ⇒ issue.returned', async () => {
    const count = () => prisma.workAgentInbox.count({ where: { agentId: agent.agentId } });
    const i = await mkIssue(dev, 'Inbox flow');
    const c0 = await count();
    await call(lead, 'PATCH', `/projects/${pid}/issues/${i.number}`, { assigneeId: agent.id });
    const assigned = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'issue.assigned' } }));
    assert.equal((assigned.payload as any).issue.key, `FP-${i.number}`);
    assert.equal((assigned.payload as any).actor.username, lead.username);
    assert.equal(await count(), c0 + 1, 'đúng một dòng');

    await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('working on it') });
    await sleep(300);
    assert.equal(await count(), c0 + 1, 'agent tự comment ⇒ 0 dòng (chống tự kích)');

    await call(dev, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('hey ', agent.id) });
    await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'comment.mention' } }));
    await sleep(200);
    assert.equal(await prisma.workAgentInbox.count({ where: { agentId: agent.agentId, issueId: i.id, type: 'comment.on_my_issue' } }), 0, 'đã mention thì không báo trùng');
    await call(dev, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('fyi') });
    await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'comment.on_my_issue' } }));

    await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: statusId(cfg, 'Done') }); // ⇒ Code Review
    await call(lead, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: statusId(cfg, 'In Progress') });
    const ret = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'issue.returned' } }));
    assert.equal((ret.payload as any).summary, 'Returned from Code Review to In Progress');
    // Payload không chép nội dung bình luận.
    assert.ok(!JSON.stringify(ret.payload).includes('fyi'));
  });

  it('A7.2 poll /agents/me/inbox theo after + ack; SSE gửi backlog theo after rồi sự kiện sống', async () => {
    const all = await call(agent, 'GET', '/agents/me/inbox?after=0&limit=200');
    assert.equal(all.status, 200);
    assert.ok(all.data.events.length >= 4);
    const mid = all.data.events[all.data.events.length - 2].id;
    const tail = await call(agent, 'GET', `/agents/me/inbox?after=${mid}`);
    assert.equal(tail.data.events.length, 1);
    assert.ok((await call(agent, 'POST', '/agents/me/events/ack', { lastId: mid })).data.acked >= 1);

    const ctl = new AbortController();
    const res = await fetch(`${base}/api/v1/work/agents/me/events?after=${mid}`, { headers: { Authorization: `Bearer ${agent.token}` }, signal: ctl.signal });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /text\/event-stream/);
    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '';
    const readUntil = async (pred: (s: string) => boolean, ms = 3000) => {
      const end = Date.now() + ms;
      while (!pred(buf)) {
        if (Date.now() > end) throw new Error(`SSE timeout; got: ${buf.slice(0, 500)}`);
        const r = await Promise.race([reader.read(), sleep(200).then(() => null)]);
        if (r && !r.done) buf += dec.decode(r.value, { stream: true });
      }
    };
    const lastId = tail.data.events[0].id;
    await readUntil((s) => s.includes(`id: ${lastId}\n`));
    assert.ok(!buf.includes(`id: ${mid}\n`), 'backlog chỉ gồm id > after');
    const live = await mkIssue(owner, 'Live event');
    const t0 = Date.now();
    await call(owner, 'PATCH', `/projects/${pid}/issues/${live.number}`, { assigneeId: agent.id });
    await readUntil((s) => s.includes('event: issue.assigned') && s.includes(`FP-${live.number}`));
    assert.ok(Date.now() - t0 < 2000, 'nhận trong < 2 s');
    ctl.abort();
  });

  // ═══ A8: webhook ═════════════════════════════════════════════════

  let hookId = 0;
  let hookSecret = '';

  it('A8.1 URL http / IP nội bộ / tên miền trỏ nội bộ / cổng lạ ⇒ 400; agent tự tạo ⇒ 403; owner tạo ⇒ secret một lần', async () => {
    for (const url of ['http://hooks.example.com/x', 'https://10.0.0.1/x', 'https://evil.internal-test/x', 'https://hooks.example.com:8080/x', 'https://localhost/x']) {
      const r = await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks`, { url });
      assert.equal(r.status, 400, url);
      assert.equal(r.code, 'WORK_WEBHOOK_URL', url);
    }
    assert.equal((await call(agent, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks`, { url: 'https://hooks.example.com/x' })).status, 403);
    assert.equal((await call(dev, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks`, { url: 'https://hooks.example.com/x' })).status, 403, 'không phải owner/admin');
    const r = await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks`, { url: 'https://hooks.example.com/ctwork', events: ['issue.assigned', 'lease.expired'] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    hookId = r.data.id;
    hookSecret = r.data.secret;
    assert.match(hookSecret, /^whsec_/);
    const list = await call(lead, 'GET', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks`);
    assert.notEqual(list.data[0].secret, hookSecret, 'danh sách luôn che secret');
  });

  it('A8.2 sự kiện ⇒ dispatcher gửi JSON ký HMAC kiểm được; loại không nghe ⇒ SKIPPED; test ping KHÔNG gửi sự kiện thật', async () => {
    const { verifyWebhook, dispatchWebhooks } = svc.webhooks;
    sent.length = 0;
    hookStatus = 200;
    const i = await mkIssue(owner, 'Webhook me');
    await call(owner, 'PATCH', `/projects/${pid}/issues/${i.number}`, { assigneeId: agent.id });
    const row = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'issue.assigned' } }));
    assert.equal(row.delivery, 'PENDING');
    await dispatchWebhooks(new Date());
    const got = sent.find((s) => s.headers['x-ctwork-delivery'] === String(row.id));
    assert.ok(got, 'đã gửi');
    assert.equal(got!.headers['x-ctwork-event'], 'issue.assigned');
    assert.equal(verifyWebhook(hookSecret, { signature: got!.headers['x-ctwork-signature'], timestamp: got!.headers['x-ctwork-timestamp'] }, got!.body), true, 'chữ ký khớp');
    assert.equal(JSON.parse(got!.body).issue.key, `FP-${i.number}`);
    assert.equal((await prisma.workAgentInbox.findUniqueOrThrow({ where: { id: row.id } })).delivery, 'SENT');
    // comment.mention không nằm trong events của webhook ⇒ SKIPPED ngay lúc ghi.
    await call(dev, 'POST', `/projects/${pid}/issues/${i.number}/comments`, { bodyJson: doc('ping ', agent.id) });
    const m = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'comment.mention' } }));
    assert.equal(m.delivery, 'SKIPPED');
    // Ping: gửi đúng một lần, kiểu ping, hộp thư không đổi.
    const before = await prisma.workAgentInbox.count({ where: { agentId: agent.agentId } });
    sent.length = 0;
    const t = await call(lead, 'POST', `/workspaces/${wsId}/agents/${agent.agentId}/webhooks/${hookId}/test`);
    assert.equal(t.data.ok, true);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].headers['x-ctwork-event'], 'ping');
    assert.equal(JSON.parse(sent[0].body).type, 'ping');
    assert.equal(await prisma.workAgentInbox.count({ where: { agentId: agent.agentId } }), before);
  });

  it('A8.3 lỗi ⇒ thử lại theo lịch; lần thứ 5 ⇒ FAILED; 20 lần FAILED liên tiếp ⇒ webhook tắt + owner nhận chuông; redirect = lỗi', async () => {
    const { dispatchWebhooks, MAX_ATTEMPTS } = svc.webhooks;
    hookStatus = 500;
    const i = await mkIssue(owner, 'Failing hook');
    await call(owner, 'PATCH', `/projects/${pid}/issues/${i.number}`, { assigneeId: agent.id });
    const row = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: i.id, type: 'issue.assigned' } }));
    let now = Date.now();
    for (let k = 1; k <= MAX_ATTEMPTS; k++) {
      await dispatchWebhooks(new Date(now));
      const r = await prisma.workAgentInbox.findUniqueOrThrow({ where: { id: row.id } });
      assert.equal(r.attempts, k);
      assert.equal(r.delivery, k < MAX_ATTEMPTS ? 'PENDING' : 'FAILED', `lần ${k}`);
      if (r.nextTryAt) {
        // Chưa tới hạn ⇒ lượt dispatch này bỏ qua dòng.
        await dispatchWebhooks(new Date(r.nextTryAt.getTime() - 1000));
        assert.equal((await prisma.workAgentInbox.findUniqueOrThrow({ where: { id: row.id } })).attempts, k, 'tôn trọng lịch thử lại');
        now = r.nextTryAt.getTime() + 1;
      }
    }
    const h1 = await prisma.workWebhook.findUniqueOrThrow({ where: { id: hookId } });
    assert.equal(h1.failCount, 1);
    assert.equal(h1.lastError, 'HTTP 500');

    // Lần FAILED thứ 20 liên tiếp ⇒ tự tắt + báo owner. Redirect cũng là lỗi.
    await prisma.workWebhook.update({ where: { id: hookId }, data: { failCount: 19 } });
    hookStatus = 302;
    const j = await mkIssue(owner, 'Redirecting hook');
    await call(owner, 'PATCH', `/projects/${pid}/issues/${j.number}`, { assigneeId: agent.id });
    const row2 = await waitFor(() => prisma.workAgentInbox.findFirst({ where: { agentId: agent.agentId, issueId: j.id, type: 'issue.assigned' } }));
    await prisma.workAgentInbox.update({ where: { id: row2.id }, data: { attempts: MAX_ATTEMPTS - 1 } });
    await dispatchWebhooks(new Date(Date.now() + 86_400_000));
    assert.equal((await prisma.workAgentInbox.findUniqueOrThrow({ where: { id: row2.id } })).delivery, 'FAILED');
    const h2 = await prisma.workWebhook.findUniqueOrThrow({ where: { id: hookId } });
    assert.equal(h2.enabled, false);
    assert.match(h2.lastError ?? '', /Redirects are not followed/);
    await waitFor(() => prisma.socialNotification.findFirst({ where: { receiverId: lead.id, entityId: agent.agentId, type: 'WORK_ALERT' } }));
    hookStatus = 200;
  });

  // ═══ Retire ═══════════════════════════════════════════════════════

  it('Retire: token chết (403 WORK_AGENT_RETIRED), user tắt, rời dự án, lịch sử/bình luận còn tên agent', async () => {
    const commentsBefore = await prisma.workComment.count({ where: { authorId: agent2.id } });
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents/${agent2.agentId}/retire`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.status, 'RETIRED');
    const x = await call(agent2, 'GET', '/me/work');
    assert.equal(x.status, 401, 'token đã bị thu hồi');
    // Token còn hiệu lực về mặt bảng (vd tạo trước khi retire, chưa thu hồi) ⇒ 403 WORK_AGENT_RETIRED.
    await prisma.workApiToken.updateMany({ where: { agentId: agent2.agentId }, data: { revokedAt: null } });
    const y = await call(agent2, 'GET', '/me/work');
    assert.equal(y.status, 403);
    assert.equal(y.code, 'WORK_AGENT_RETIRED');
    const u = await prisma.user.findUniqueOrThrow({ where: { id: agent2.id }, select: { enabled: true } });
    assert.equal(u.enabled, false);
    assert.equal(await prisma.workProjectMember.count({ where: { userId: agent2.id } }), 0);
    assert.equal(await prisma.workComment.count({ where: { authorId: agent2.id } }), commentsBefore);
    assert.equal((await call(owner, 'GET', `/workspaces/${wsId}/agents`)).data.some((a: any) => a.id === agent2.agentId), false);
    assert.equal((await call(owner, 'GET', `/workspaces/${wsId}/agents?includeRetired=1`)).data.some((a: any) => a.id === agent2.agentId), true);
  });
});
