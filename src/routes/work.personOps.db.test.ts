/**
 * 19/10/2026 — CuongMini làm thay NGƯỜI qua MCP (HTTP + Postgres cục bộ, mạng ngoài GIẢ — không gọi Google thật):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.personOps.db.test.ts
 *
 *   • attach_from_url (link Drawings ⇒ PNG; ảnh số N trong Google Doc; tài liệu riêng tư; SSRF) + gdoc_images;
 *   • update_issue / create_issue trường của người (assignee, priority, sprint…), comment visibility;
 *   • issue_link / issue_unlink / issue_flag / issue_watch / issue_web_link_add;
 *   • project_member_add / set_role / remove, workspace_invite, sprint_create / start / complete — đúng vai như web:
 *     ADMIN được, MEMBER 403, agent WORK_AGENT_FORBIDDEN (và không thấy trong tools/list), người ngoài 404.
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
import { __datMangChoTest } from '../services/linkNgoai/taiAnToan.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `po${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const PNG = Buffer.from(PNG_B64, 'base64');
const GID = '1Iqe_CzFVA6hyxe7h2bUKusxsjB6frXfdAYLerM3JjPo';
const GID_RIENG = '1PrivatePrivatePrivatePrivatePrivate0000';

/** Google + một trang web giả. DNS giả trả IP công khai, riêng "noi-bo.example" trả IP nội bộ. */
function mangGia() {
  __datMangChoTest(async (url) => {
    if (url.includes(GID_RIENG)) return new Response(null, { status: 302, headers: { location: 'https://accounts.google.com/ServiceLogin' } });
    if (url.includes('/drawings/') && url.endsWith('/export/png')) return new Response(PNG, { headers: { 'content-type': 'image/png', 'content-disposition': 'attachment; filename="So do NT.png"' } });
    if (url.includes('/document/') && url.includes('format=html')) {
      return new Response(`<p><img alt="erd.png" src="data:image/png;base64,${PNG_B64}" style="width: 624.00px; height: 351.00px;"></p><img src="https://cdn.example.com/b.png" width="40" height="20">`, { headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    if (url === 'https://cdn.example.com/b.png') return new Response(PNG, { headers: { 'content-type': 'image/png' } });
    return new Response('nope', { status: 404 });
  }, async (host) => [{ address: host === 'noi-bo.example' ? '192.168.1.5' : '142.250.1.1' }]);
}

describe('CT Work — CuongMini làm thay người (MCP)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, dev2: U, outsider: U;
  let wsId = 0, pid = 0, cfg: any, wsSlug = '';
  let devTok = '', leadTok = '', outTok = '', agentTok = '', agentUserId = 0;
  let rpcId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
    userIds.push(u.id);
    return { id: u.id, token: jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret), email, username };
  }
  async function call(u: { token: string }, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  async function rpc(token: string, method: string, params: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
    });
    return (await res.json()) as any;
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const b = await rpc(token, 'tools/call', { name, arguments: args });
    if (b.error) return { isError: true, text: String(b.error.message), out: null as any };
    const text = String(b.result.content[0].text);
    let out: any = null;
    try { out = JSON.parse(text); } catch { /* chữ */ }
    return { isError: b.result.isError === true, text, out };
  }
  const ok = <T extends { isError: boolean; text: string }>(r: T): T => { assert.equal(r.isError, false, r.text); return r; };
  const denied = (r: { isError: boolean; text: string }, code: RegExp) => { assert.equal(r.isError, true, r.text); assert.match(r.text, code); };
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  async function mkIssue(title: string, extra: Record<string, unknown> = {}) {
    const r = await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
  }
  const issueRow = (id: number) => prisma.workIssue.findUniqueOrThrow({ where: { id } });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '20mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, dev2, outsider] = await Promise.all(['lead', 'dev', 'dev2', 'out'].map((n) => mkUser(n)));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `PO ${tag}` })).data;
    wsId = ws.id; wsSlug = ws.slug;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, dev2.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'CuongMini · test', scopes: ['read', 'write'] })).data.token;
    leadTok = (await call(lead, 'POST', '/me/api-tokens', { name: 'CuongMini · lead', scopes: ['read', 'write'] })).data.token;
    outTok = (await call(outsider, 'POST', '/me/api-tokens', { name: 'x', scopes: ['read', 'write'] })).data.token;
    const a = await call(lead, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
    await call(lead, 'PUT', `/projects/${pid}/members/${agentUserId}`, { role: 'MEMBER' });
    mangGia();
  });

  after(async () => {
    __datMangChoTest(null);
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.workAiCall.deleteMany({ where: { OR: [{ workspaceId: wsId }, { userId: { in: ids } }] } });
    await prisma.workInvite.deleteMany({ where: { workspaceId: wsId } });
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

  it('tools/list: người thấy tool quản trị (personOnly), agent không thấy; tool tải link có mặt', async () => {
    const ten = async (tok: string) => ((await rpc(tok, 'tools/list')).result.tools as Array<{ name: string }>).map((t) => t.name);
    const nguoi = await ten(devTok);
    const agent = await ten(agentTok);
    for (const n of ['project_member_add', 'workspace_invite', 'sprint_start']) assert.ok(nguoi.includes(n) && !agent.includes(n), n);
    for (const n of ['attach_from_url', 'gdoc_images', 'issue_link', 'issue_flag']) assert.ok(nguoi.includes(n) && agent.includes(n), n);
  });

  it('attach_from_url: link Drawings ⇒ PNG vào thẻ (tên từ Google); ảnh số N trong Google Doc; bản nháp bình luận; riêng tư / nội bộ / người ngoài', async () => {
    const i = await mkIssue('NT-13 sơ đồ', { assigneeId: dev.id });
    const r = ok(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/drawings/d/${GID}/edit` }));
    assert.equal(r.out.fileName, 'So do NT.png');
    assert.equal(r.out.contentType, 'image/png');
    const att = await prisma.workAttachment.findUniqueOrThrow({ where: { id: r.out.attachmentId } });
    assert.deepEqual([att.issueId, att.size, att.mime, att.forComment], [i.id, PNG.length, 'image/png', false]);

    const list = ok(await tool(devTok, 'gdoc_images', { url: `https://docs.google.com/document/d/${GID}/edit` }));
    assert.match(list.text, /2 image\(s\)/);
    assert.match(list.text, /"alt": "erd\.png"/);
    const img = ok(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/document/d/${GID}/edit`, image: 1, for: 'comment' }));
    assert.equal(img.out.fileName, 'erd.png');
    assert.equal(img.out.for, 'comment');
    const c = ok(await tool(devTok, 'comment', { project: 'NT', issue: i.number, markdown: 'Sơ đồ ERD', attachments: [img.out.attachmentId] }));
    assert.equal((await prisma.workAttachment.findUniqueOrThrow({ where: { id: img.out.attachmentId } })).commentId, c.out.commentId);
    const img2 = ok(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/document/d/${GID}/edit`, image: 2 }));
    assert.equal(img2.out.fileName, 'b.png');
    denied(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/document/d/${GID}/edit`, image: 9 }), /WORK_BAD_IMAGE/);

    denied(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/document/d/${GID_RIENG}/edit` }), /WORK_URL_PRIVATE[\s\S]*Anyone with the link/);
    denied(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: 'https://noi-bo.example/a.png' }), /WORK_URL_BLOCKED/);
    denied(await tool(devTok, 'attach_from_url', { project: 'NT', issue: i.number, url: 'http://127.0.0.1:5432/' }), /WORK_URL_BLOCKED/);
    denied(await tool(outTok, 'attach_from_url', { project: 'NT', issue: i.number, url: `https://docs.google.com/drawings/d/${GID}/edit` }), /WORK_PROJECT_NOT_FOUND/);
  });

  it('update_issue / create_issue: giao việc, ưu tiên, sprint, ngày; MEMBER giao cho người khác được (như web); agent thì không', async () => {
    const sp = await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint A' });
    assert.equal(sp.status, 201);
    const c = ok(await tool(devTok, 'create_issue', { project: 'NT', type: 'TASK', title: 'Trang đăng nhập', assignee: lead.username, priority: 'High', storyPoints: 3, dueDate: '2026-11-01', sprint: 'Sprint A' }));
    const row = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: c.out.number } });
    assert.deepEqual([row.assigneeId, row.priority, row.storyPoints, row.sprintId], [lead.id, 2, 3, sp.data.id]);
    const u = ok(await tool(devTok, 'update_issue', { project: 'NT', issue: c.out.number, assignee: `@${dev.username}`, priority: 5, sprint: 'backlog', startDate: '2026-10-20', originalEstimateMinutes: 120 }));
    assert.deepEqual(u.out.updated.sort(), ['assignee', 'originalEstimate', 'priority', 'sprint', 'startDate']);
    const r2 = await issueRow(row.id);
    assert.deepEqual([r2.assigneeId, r2.priority, r2.sprintId, r2.originalEstimateMin], [dev.id, 5, null, 120]);
    denied(await tool(devTok, 'update_issue', { project: 'NT', issue: c.out.number, assignee: 'khong-ai-ten-nay' }), /WORK_BAD_USER/);
    denied(await tool(devTok, 'update_issue', { project: 'NT', issue: c.out.number, assignee: outsider.username }), /WORK_BAD_USER/);
    // Agent: giao cho người khác / xếp sprint ⇒ bị chặn ở service.
    const mine = await mkIssue('Việc của bot', { assigneeId: agentUserId });
    denied(await tool(agentTok, 'update_issue', { project: 'NT', issue: mine.number, assignee: dev.username }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(agentTok, 'update_issue', { project: 'NT', issue: mine.number, sprint: 'Sprint A' }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(agentTok, 'create_issue', { project: 'NT', type: 'TASK', title: 'x', assignee: dev.username }), /WORK_AGENT_FORBIDDEN/);
  });

  it('comment visibility: public chỉ khi thẻ đã chia sẻ với khách; agent luôn internal', async () => {
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { clientPortal: true } })).status, 200);
    const i = await mkIssue('Báo khách', { assigneeId: agentUserId });
    denied(await tool(leadTok, 'comment', { project: 'NT', issue: i.number, markdown: 'Chào anh', visibility: 'public' }), /WORK_ISSUE_NOT_SHARED/);
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/issues/${i.number}/client-visible`, { visible: true })).status, 200);
    assert.equal(ok(await tool(leadTok, 'comment', { project: 'NT', issue: i.number, markdown: 'Chào anh', visibility: 'public' })).out.visibility, 'PUBLIC');
    assert.equal(ok(await tool(leadTok, 'comment', { project: 'NT', issue: i.number, markdown: 'nội bộ' })).out.visibility, 'INTERNAL');
    assert.equal(ok(await tool(agentTok, 'comment', { project: 'NT', issue: i.number, markdown: 'bot', visibility: 'public' })).out.visibility, 'INTERNAL');
    await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { clientPortal: false } });
  });

  it('liên kết (cả chiều is_blocked_by) / gỡ; cờ chặn; theo dõi; web link', async () => {
    const a = await mkIssue('A');
    const b = await mkIssue('B');
    ok(await tool(devTok, 'issue_link', { project: 'NT', issue: a.number, type: 'relates', target: `NT-${b.number}` }));
    ok(await tool(devTok, 'issue_link', { project: 'NT', issue: a.number, type: 'is_blocked_by', target: `NT-${b.number}` }));
    const links = await prisma.workIssueLink.findMany({ where: { OR: [{ fromIssueId: a.id }, { fromIssueId: b.id }] } });
    assert.ok(links.some((l) => l.fromIssueId === a.id && l.toIssueId === b.id && l.type === 'RELATES'));
    assert.ok(links.some((l) => l.fromIssueId === b.id && l.toIssueId === a.id && l.type === 'BLOCKS'));
    denied(await tool(devTok, 'issue_unlink', { project: 'NT', issue: a.number, target: `NT-${b.number}` }), /WORK_AMBIGUOUS_LINK/);
    ok(await tool(devTok, 'issue_unlink', { project: 'NT', issue: a.number, target: `NT-${b.number}`, type: 'is_blocked_by' }));
    assert.equal(await prisma.workIssueLink.count({ where: { fromIssueId: b.id, toIssueId: a.id } }), 0);

    denied(await tool(devTok, 'issue_flag', { project: 'NT', issue: a.number, flagged: true }), /reason/);
    ok(await tool(devTok, 'issue_flag', { project: 'NT', issue: a.number, flagged: true, reason: 'Chờ API' }));
    assert.equal((await issueRow(a.id)).flagReason, 'Chờ API');
    ok(await tool(devTok, 'issue_flag', { project: 'NT', issue: a.number, flagged: false }));
    assert.equal((await issueRow(a.id)).flaggedAt, null);

    ok(await tool(devTok, 'issue_watch', { project: 'NT', issue: a.number, on: true }));
    assert.equal(await prisma.workWatcher.count({ where: { issueId: a.id, userId: dev.id } }), 1);
    ok(await tool(devTok, 'issue_watch', { project: 'NT', issue: a.number, on: false }));
    assert.equal(await prisma.workWatcher.count({ where: { issueId: a.id, userId: dev.id } }), 0);

    ok(await tool(devTok, 'issue_web_link_add', { project: 'NT', issue: a.number, url: 'https://github.com/x/y/pull/3', title: 'PR #3' }));
    assert.equal(await prisma.workIssueWebLink.count({ where: { issueId: a.id } }), 1);
  });

  it('thành viên dự án + lời mời: ADMIN được, MEMBER 403, agent WORK_AGENT_FORBIDDEN', async () => {
    denied(await tool(devTok, 'project_member_add', { project: 'NT', user: dev2.username }), /permission/i);
    denied(await tool(agentTok, 'project_member_add', { project: 'NT', user: dev2.username }), /WORK_AGENT_FORBIDDEN/);
    assert.equal(ok(await tool(leadTok, 'project_member_add', { project: 'NT', user: dev2.username, role: 'VIEWER' })).out.status, 'ADDED');
    assert.equal((await prisma.workProjectMember.findFirstOrThrow({ where: { projectId: pid, userId: dev2.id } })).role, 'VIEWER');
    ok(await tool(leadTok, 'project_member_set_role', { project: 'NT', user: dev2.email, role: 'MEMBER' }));
    assert.equal((await prisma.workProjectMember.findFirstOrThrow({ where: { projectId: pid, userId: dev2.id } })).role, 'MEMBER');
    ok(await tool(leadTok, 'project_member_remove', { project: 'NT', user: `@${dev2.username}` }));
    assert.equal(await prisma.workProjectMember.count({ where: { projectId: pid, userId: dev2.id } }), 0);
    assert.ok(await prisma.workAuditLog.count({ where: { projectId: pid, action: { in: ['project.member_role', 'project.member_remove'] } } }) >= 3);
    // Người chưa trong không gian: theo email ⇒ mời kèm dự án (vai không gian kiểm trong service).
    const moi = ok(await tool(leadTok, 'project_member_add', { project: 'NT', user: `${tag}_moi@test.local`, role: 'MEMBER' }));
    assert.equal(moi.out.status, 'INVITED');
    denied(await tool(leadTok, 'project_member_add', { project: 'NT', user: outsider.username }), /WORK_NOT_IN_WORKSPACE/);

    denied(await tool(devTok, 'workspace_invite', { workspace: wsSlug, emails: [outsider.email] }), /permission/i);
    denied(await tool(agentTok, 'workspace_invite', { workspace: wsSlug, emails: [outsider.email] }), /WORK_AGENT_FORBIDDEN|not found/);
    const inv = ok(await tool(leadTok, 'workspace_invite', { workspace: wsSlug, emails: [outsider.email], project: 'NT', projectRole: 'VIEWER' }));
    assert.equal(inv.out.results[0].status, 'ADDED');
    assert.equal((await prisma.workProjectMember.findFirstOrThrow({ where: { projectId: pid, userId: outsider.id } })).role, 'VIEWER');
  });

  it('sprint: tạo ⇒ bắt đầu "next" ⇒ kết thúc (thẻ dở về backlog); MEMBER 403, agent bị chặn', async () => {
    denied(await tool(devTok, 'sprint_create', { project: 'NT', name: 'S-dev' }), /permission/i);
    denied(await tool(agentTok, 'sprint_create', { project: 'NT', name: 'S-bot' }), /WORK_AGENT_FORBIDDEN/);
    // Sprint A (PLANNED, tạo ở test trước) đứng trước ⇒ "next" = Sprint A; tạo thêm để chắc có sprint.
    const s = ok(await tool(leadTok, 'sprint_create', { project: 'NT', name: 'Sprint B', goal: 'Đăng nhập' }));
    assert.equal(s.out.sprint.state, 'PLANNED');
    const st = ok(await tool(leadTok, 'sprint_start', { project: 'NT', sprint: 'Sprint B', weeks: 1 }));
    assert.equal(st.out.sprint.state, 'ACTIVE');
    const i = await mkIssue('Trong sprint', { sprintId: s.out.sprint.id });
    denied(await tool(devTok, 'sprint_complete', { project: 'NT' }), /permission/i);
    ok(await tool(leadTok, 'sprint_complete', { project: 'NT' }));
    assert.equal((await prisma.workSprint.findUniqueOrThrow({ where: { id: s.out.sprint.id } })).state, 'CLOSED');
    assert.equal((await issueRow(i.id)).sprintId, null);
  });
});
