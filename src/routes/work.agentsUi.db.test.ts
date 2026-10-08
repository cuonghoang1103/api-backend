/**
 * CT Work — tuyến ĐỌC cho giao diện AI agent (CTW-28 GĐ1 A13–A14), qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.agentsUi.db.test.ts
 *
 *   A13  GET /projects/:pid/agent-leases — chip lease (ACTIVE + % từ heartbeat, EXPIRED sau sweeper), khách cổng không
 *        thấy agent; JQL `assigneeKind = AGENT` / `assignee IN agents()` qua /search thật; khách dùng ⇒ 400.
 *   A14  GET /me/agents-need-you — owner thấy thẻ agent chờ review (Done ⇒ Code Review), lease hết hạn còn cờ, người
 *        khác rỗng, token agent ⇒ 403. GET /workspaces/:wsId/agents/:id/leases — kèm mã thẻ, thành viên xem được,
 *        khách/token agent ⇒ 403.
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
const tag = `agui${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CT Work — giao diện AI agent: chip lease, My agents need you, JQL assigneeKind (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, guest: U, client: U;
  let wsId = 0, pid = 0;
  let cfg: any;
  let agent: U & { agentId: number };

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
  async function mkIssue(by: U, title: string, extra: Record<string, unknown> = {}) {
    const r = await call(by, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
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
    [owner, dev, guest, client] = await Promise.all(['owner', 'dev', 'guest', 'client'].map(mkUser));
    wsId = (await call(owner, 'POST', '/workspaces', { name: `AgentUI ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'UI', name: 'Agent UI', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] });
    const r = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'UI Bot', model: 'claude-sonnet-5', ownerId: owner.id, projectIds: [pid] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    agent = { id: r.data.agent.userId, token: r.data.token.token, email: '', username: r.data.agent.user.username, agentId: r.data.agent.id };
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
  });

  after(async () => {
    server?.close();
    const agentUsers = wsId ? await prisma.workAgent.findMany({ where: { workspaceId: wsId }, select: { userId: true } }) : [];
    const ids = [...userIds, ...agentUsers.map((a) => a.userId)];
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('A13.1 config.members có kind AGENT ⇒ UI vẽ 🤖; chip lease ACTIVE + % từ heartbeat; khách cổng không thấy', async () => {
    const m = cfg.members.find((x: any) => x.id === agent.id);
    assert.equal(m?.kind, 'AGENT');
    assert.equal(cfg.members.find((x: any) => x.id === owner.id)?.kind, 'HUMAN');

    const i = await mkIssue(owner, 'Agent task', { assigneeId: agent.id });
    assert.deepEqual((await call(owner, 'GET', `/projects/${pid}/agent-leases`)).data, []);
    const c = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/claim`, {});
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    const hb = await call(agent, 'POST', `/agents/me/leases/${c.data.lease.id}/heartbeat`, { progress: 'running tests', progressPct: 72 });
    assert.equal(hb.status, 200, JSON.stringify(hb.raw));

    const r = await call(dev, 'GET', `/projects/${pid}/agent-leases`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.length, 1);
    assert.equal(r.data[0].issueId, i.id);
    assert.equal(r.data[0].status, 'ACTIVE');
    assert.equal(r.data[0].progressPct, 72);
    assert.equal(r.data[0].progress, 'running tests');
    assert.equal(r.data[0].agentUserId, agent.id);

    // Khách cổng: không bao giờ thấy agent (chốt cổng 403 hoặc service trả rỗng).
    const cl = await call(client, 'GET', `/projects/${pid}/agent-leases`);
    assert.ok(cl.status === 403 || cl.status === 404 || (cl.status === 200 && cl.data.length === 0), `client: ${cl.status} ${JSON.stringify(cl.raw)}`);
    const { projectLeases } = await import('../services/work/agentUi.service.js');
    const direct = await projectLeases(client.id, pid).catch((e) => e);
    assert.ok(Array.isArray(direct) ? direct.length === 0 : [403, 404].includes(direct.statusCode), 'service tự chặn khách');
    // Người ngoài không gian ⇒ 404 (không lộ dự án tồn tại).
    const outsider = await (async () => { const u = await mkUser('outsider'); return call(u, 'GET', `/projects/${pid}/agent-leases`); })();
    assert.equal(outsider.status, 404);
  });

  it('A13.2 JQL qua /search: assigneeKind = AGENT · assignee IN agents() · people(); khách ⇒ 400', async () => {
    const human = await mkIssue(owner, 'Human task', { assigneeId: dev.id });
    const unassigned = await mkIssue(owner, 'Nobody task');
    const keys = async (jql: string) => {
      const r = await call(owner, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent(jql)}`);
      assert.equal(r.status, 200, `${jql}: ${JSON.stringify(r.raw)}`);
      return (r.data.items as Array<{ number: number; assigneeId: number | null }>);
    };
    const agentRows = await keys('assigneeKind = AGENT');
    assert.ok(agentRows.length >= 1 && agentRows.every((x) => x.assigneeId === agent.id));
    assert.deepEqual((await keys('assignee IN agents()')).map((x) => x.number).sort(), agentRows.map((x) => x.number).sort());
    const people = await keys('assigneeKind = HUMAN');
    assert.ok(people.some((x) => x.number === human.number) && people.every((x) => x.assigneeId !== agent.id && x.assigneeId !== null));
    const notAgent = await keys('assigneeKind != AGENT');
    assert.ok(notAgent.some((x) => x.number === unassigned.number), '!= gồm cả thẻ chưa giao');
    assert.ok(notAgent.every((x) => x.assigneeId !== agent.id));
    const bad = await call(owner, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('assigneeKind = robot')}`);
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_JQL_ERROR');

    const search = await import('../services/work/search.service.js');
    for (const jql of ['assigneeKind = AGENT', 'assignee IN agents()', '"assignee kind" = HUMAN']) {
      await assert.rejects(search.search(client.id, pid, jql), (e: any) => e.statusCode === 400 || e.statusCode === 403 || e.statusCode === 404, jql);
    }
  });

  it('A14.1 /me/agents-need-you: owner thấy thẻ agent chờ review (Done ⇒ Code Review); dev rỗng; token agent 403', async () => {
    const i = await mkIssue(owner, 'Review me', { assigneeId: agent.id });
    const mv = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/move`, { statusId: statusId(cfg, 'Done') });
    assert.equal(mv.status, 200, JSON.stringify(mv.raw));
    const r = await call(owner, 'GET', '/me/agents-need-you');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.agents.length, 1);
    assert.equal(r.data.agents[0].user.kind, 'AGENT');
    const row = r.data.review.find((x: any) => x.key === `UI-${i.number}`);
    assert.ok(row, JSON.stringify(r.data.review));
    assert.equal(row.status.name, 'Code Review');
    assert.equal(row.agentUserId, agent.id);
    assert.equal(row.url, `/work/${(await prisma.workSpace.findUniqueOrThrow({ where: { id: wsId } })).slug}/UI/issue/${i.number}`);

    const d = await call(dev, 'GET', '/me/agents-need-you');
    assert.deepEqual(d.data, { agents: [], review: [], expired: [], approvals: [] });
    assert.equal((await call(agent, 'GET', '/me/agents-need-you')).status, 403);
  });

  it('A14.2 sweeper ⇒ chip EXPIRED (đỏ) + mục "stopped responding" cho owner; lease mới thì hết mục', async () => {
    const i = await mkIssue(owner, 'Will stall', { assigneeId: agent.id });
    // Trả lease cũ (A13.1) để còn chỗ (parallelSlots = 1).
    for (const l of (await call(agent, 'GET', '/agents/me/leases')).data) await call(agent, 'POST', `/agents/me/leases/${l.id}/release`, {});
    const c = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/claim`, { minutes: 5 });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    const { sweepExpiredLeases } = await import('../services/work/agents.service.js');
    assert.ok((await sweepExpiredLeases(new Date(Date.now() + 10 * 60_000))) >= 1);

    const chips = (await call(owner, 'GET', `/projects/${pid}/agent-leases`)).data as any[];
    const chip = chips.find((x) => x.issueId === i.id);
    assert.equal(chip?.status, 'EXPIRED');
    const need = (await call(owner, 'GET', '/me/agents-need-you')).data;
    const ex = need.expired.find((x: any) => x.key === `UI-${i.number}`);
    assert.ok(ex, JSON.stringify(need.expired));
    assert.equal(ex.flagReason, 'Agent lease expired without heartbeat');

    // Agent nhận lại ⇒ chip xanh, hết mục hết hạn.
    const again = await call(agent, 'POST', `/projects/${pid}/issues/${i.number}/claim`, {});
    assert.equal(again.status, 201, JSON.stringify(again.raw));
    assert.equal(((await call(owner, 'GET', `/projects/${pid}/agent-leases`)).data as any[]).find((x) => x.issueId === i.id)?.status, 'ACTIVE');
    assert.ok(!(await call(owner, 'GET', '/me/agents-need-you')).data.expired.some((x: any) => x.key === `UI-${i.number}`));
  });

  it('A14.3 /workspaces/:wsId/agents/:id/leases: kèm mã + tiêu đề thẻ, ACTIVE đứng đầu; thành viên xem được; khách/token agent 403', async () => {
    const r = await call(owner, 'GET', `/workspaces/${wsId}/agents/${agent.agentId}/leases`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.ok(r.data.length >= 3);
    assert.equal(r.data[0].status, 'ACTIVE');
    assert.match(r.data[0].issue.key, /^UI-\d+$/);
    assert.ok(r.data[0].issue.url.startsWith('/work/'));
    assert.ok(r.data.some((l: any) => l.status === 'EXPIRED') && r.data.some((l: any) => l.status === 'RELEASED'));
    assert.equal((await call(dev, 'GET', `/workspaces/${wsId}/agents/${agent.agentId}/leases`)).status, 200);
    assert.equal((await call(guest, 'GET', `/workspaces/${wsId}/agents/${agent.agentId}/leases`)).status, 403);
    assert.equal((await call(agent, 'GET', `/workspaces/${wsId}/agents/${agent.agentId}/leases`)).status, 403);
    assert.equal((await call(owner, 'GET', `/workspaces/${wsId}/agents/999999/leases`)).status, 404);
  });
});
