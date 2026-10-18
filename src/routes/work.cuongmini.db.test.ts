/**
 * ĐỢT 6 CuongMini — phần MCP CT Work mới (HTTP + Postgres cục bộ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.cuongmini.db.test.ts
 *
 *   • get_issue CHỈ THÊM dòng phụ thuộc (máy sinh): "Blocked by (not done): NT-1 [To Do] @dev", "Blocks: …", "Parent status: …",
 *     "Subtasks not done (n/m): …" — dòng cũ giữ nguyên; thẻ chặn xong ⇒ "Blocked by: all done";
 *   • issue_guide (MCP, chỉ đọc) = cách đọc mentor (link trong app, phụ thuộc, Docs gắn thẻ);
 *   • list_pages thêm `updatedAt` (đệm trang AGENTS.md theo phiên bản);
 *   • my_updates (NGƯỜI): lần đầu chỉ lấy mốc; sau đó bị giao / được nhắc / bình luận; thẻ CHẶN việc của mình vừa xong ⇒ unblocked;
 *     token agent ⇒ lỗi (agent dùng wait_events).
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
const tag = `cm${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

describe('CuongMini — MCP dẫn đường (phụ thuộc, issue_guide, my_updates)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let wsId = 0, pid = 0, cfg: any;
  let devTok = '', agentTok = '', agentUserId = 0;
  let rpcId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args } }),
    });
    const b = await res.json() as any;
    if (b.error) return { isError: true, text: String(b.error.message) };
    return { isError: b.result.isError === true, text: String(b.result.content[0].text) };
  }
  const json = (text: string) => JSON.parse(/<ctwork-content[^>]*>\n?([\s\S]*?)\n?<\/ctwork-content>/.exec(text)![1]!);
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  async function mkIssue(by: U, title: string, extra: Record<string, unknown> = {}) {
    const r = await call(by, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title, ...extra });
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
    lead = await mkUser('lead');
    dev = await mkUser('dev');
    wsId = (await call(lead, 'POST', '/workspaces', { name: `CM ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK', kind: 'SCHOOL' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'cm', scopes: ['read', 'write'] })).data.token;
    const a = await call(lead, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot', model: 'gpt-6-sol', projectIds: [pid] });
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
  });

  after(async () => {
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (ids.length) {
      await prisma.workAgent.deleteMany({ where: { OR: [{ userId: { in: ids } }, { ownerId: { in: ids } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.workApiToken.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
  });

  it('my_updates: lần đầu chỉ lấy mốc; được giao + bình luận + thẻ chặn xong ⇒ báo; agent ⇒ lỗi', async () => {
    const dau = await tool(devTok, 'my_updates', {});
    assert.equal(dau.isError, false, dau.text);
    const moc = json(dau.text);
    assert.deepEqual(moc.events, []);
    const since = new Date(Date.now() - 1000).toISOString();
    // NT-1 (lead làm) CHẶN NT-2 (giao cho dev).
    const n1 = await mkIssue(lead, 'Thiết kế CSDL', { assigneeId: lead.id });
    const n2 = await mkIssue(lead, 'API phòng trọ', { assigneeId: dev.id, descriptionJson: doc('Làm API') });
    assert.equal((await call(lead, 'POST', `/projects/${pid}/issues/${n1.number}/links`, { type: 'BLOCKS', targetKey: `NT-${n2.number}` })).status, 201);
    await call(lead, 'POST', `/projects/${pid}/issues/${n2.number}/comments`, { bodyJson: doc('Nhớ đọc ERD trước nhé') });

    // get_issue + issue_guide: dòng phụ thuộc (máy sinh), dòng cũ còn nguyên.
    const gi = await tool(devTok, 'get_issue', { project: 'NT', issue: n2.number });
    assert.equal(gi.isError, false, gi.text);
    assert.match(gi.text, new RegExp(`^Blocked by \\(not done\\): NT-${n1.number} \\[[^\\]]+\\] @${lead.username}$`, 'm'));
    assert.match(gi.text, /^Allowed transitions from here: /m, 'dòng cũ giữ nguyên');
    const g1 = await tool(devTok, 'get_issue', { project: 'NT', issue: n1.number });
    assert.match(g1.text, new RegExp(`^Blocks: NT-${n2.number} \\[[^\\]]+\\] @${dev.username}$`, 'm'));
    const guide = await tool(devTok, 'issue_guide', { project: 'NT', issue: n2.number });
    assert.equal(guide.isError, false, guide.text);
    assert.match(guide.text, new RegExp(`in-app link /work/[^/]+/NT/issue/${n2.number}`));
    assert.match(guide.text, /Blocked by \(not done\)/);

    // Thẻ chặn xong ⇒ "Blocked by: all done" + my_updates báo unblocked.
    const done = cfg.workflows.flatMap((w: any) => w.statuses).find((s: any) => s.category === 'DONE');
    const mv = await call(lead, 'PATCH', `/projects/${pid}/issues/${n1.number}`, { statusId: done.id });
    assert.ok(mv.status === 200, JSON.stringify(mv.raw));
    const gi2 = await tool(devTok, 'get_issue', { project: 'NT', issue: n2.number });
    assert.match(gi2.text, /^Blocked by: all done/m);

    const moi = await tool(devTok, 'my_updates', { afterId: moc.lastId, since });
    const c = json(moi.text);
    assert.ok(c.events.some((e: any) => e.type === 'WORK_ASSIGN' && e.issue === `NT-${n2.number}` && e.by === `@${lead.username}`), JSON.stringify(c));
    assert.ok(c.events.some((e: any) => (e.type === 'WORK_COMMENT' || e.type === 'WORK_MENTION') && e.issue === `NT-${n2.number}`), JSON.stringify(c));
    assert.deepEqual(c.unblocked.map((u: any) => [u.issue, u.blocker]), [[`NT-${n2.number}`, `NT-${n1.number}`]]);
    assert.ok(c.lastId > moc.lastId);
    // Không có gì mới sau mốc mới.
    assert.deepEqual(json((await tool(devTok, 'my_updates', { afterId: c.lastId, since: new Date().toISOString() })).text).events, []);
    const ag = await tool(agentTok, 'my_updates', {});
    assert.equal(ag.isError, true);
    assert.match(ag.text, /wait_events/);
  });

  it('list_pages: thêm updatedAt (không đổi trường cũ)', async () => {
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true } })).status, 200);
    const pg = await call(lead, 'POST', `/projects/${pid}/pages`, { title: 'AGENTS.md — hướng dẫn cho CuongMini' });
    assert.ok(pg.status === 201 || pg.status === 200, JSON.stringify(pg.raw));
    const r = await tool(devTok, 'list_pages', { project: 'NT' });
    const ds = json(r.text) as Array<Record<string, unknown>>;
    const a = ds.find((x) => String(x.title).startsWith('AGENTS.md'));
    assert.ok(a, r.text);
    for (const k of ['page', 'title', 'status', 'visibility', 'parentId', 'updatedAt']) assert.ok(k in a!, k);
    assert.ok(!Number.isNaN(Date.parse(String(a!.updatedAt))));
  });
});
