/**
 * 21/10/2026 đợt 2 — CuongMini ngang quyền người qua MCP (HTTP + Postgres cục bộ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.parity2.db.test.ts
 *
 *   SWR302 sửa/xoá · trace_links/trace_link_remove · Change Request (không tự duyệt) · chat kênh + ghim/react · bình luận Docs ·
 *   người dự + chương trình họp · test plan · poker (facilitator) · retro · review · version · lớp học phía giảng viên (không chấm).
 *   Rào: lệnh xoá agent không thấy + WORK_AGENT_FORBIDDEN; REST DELETE của agent ⇒ 403.
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
import { _setResourceNetForTests } from '../services/work/resources.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `pb${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — CuongMini ngang quyền người đợt 2 (MCP)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let wsId = 0, pid = 0;
  let devTok = '', leadTok = '', agentTok = '', agentUserId = 0;
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
    return { status: res.status, data: json.data, raw: json, code: json?.error?.code ?? json?.code };
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
  // 22/10/2026: lệnh xoá của AI KHÔNG chạy ngay — thành yêu cầu chờ trưởng nhóm duyệt; lead duyệt trên web ⇒ lệnh chạy dưới
  // quyền người gửi. okDel = gửi lệnh ⇒ thấy PENDING_APPROVAL (chưa xoá gì) ⇒ duyệt ⇒ kết quả thật.
  async function viaApproval(p: Promise<{ isError: boolean; text: string; out: any }>) {
    const r = ok(await p);
    assert.equal(r.out?.status, 'PENDING_APPROVAL', r.text);
    const a = await call(lead, 'POST', `/delete-requests/${r.out.request}/approve`, {});
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    return a.data as { status: string; error: string | null; result: { output: any; trash: Array<{ id: number }> } };
  }
  const okDel = async (p: Promise<{ isError: boolean; text: string; out: any }>) => {
    const v = await viaApproval(p);
    assert.equal(v.status, 'APPROVED', v.error ?? '');
    return { isError: false, out: v.result.output, text: JSON.stringify(v.result.output) };
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '20mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev] = await Promise.all(['lead', 'dev'].map((n) => mkUser(n)));
    const ws = (await call(lead, 'POST', '/workspaces', { name: `PA ${tag}` })).data;
    wsId = ws.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'LF', name: 'LabFlow Demo', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true, meetings: true, resources: true, changeRequests: true, approvals: true } })).status, 200);
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'CuongMini · dev', scopes: ['read', 'write'] })).data.token;
    leadTok = (await call(lead, 'POST', '/me/api-tokens', { name: 'CuongMini · lead', scopes: ['read', 'write'] })).data.token;
    const a = await call(lead, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
    await call(lead, 'PUT', `/projects/${pid}/members/${agentUserId}`, { role: 'MEMBER' });
    // GitHub API giả: nhánh mặc định "develop"; DNS giả trả IP công khai.
    _setResourceNetForTests({
      fetch: async (url) => (url.startsWith('https://api.github.com/repos/')
        ? new Response(JSON.stringify({ full_name: url.split('/repos/')[1], default_branch: 'develop', description: 'LabFlow', stargazers_count: 1 }), { headers: { 'content-type': 'application/json' } })
        : new Response('<title>x</title>', { headers: { 'content-type': 'text/html' } })),
      lookup: async () => [{ address: '140.82.112.3' }],
    });
  });

  after(async () => {
    _setResourceNetForTests(null);
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.workClass.deleteMany({ where: { ownerId: { in: ids } } });
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

  it('tools/list: lệnh mới cho người, lệnh xoá agent không thấy; agent gọi thẳng ⇒ WORK_AGENT_FORBIDDEN', async () => {
    const list = async (tok: string) => ((await rpc(tok, 'tools/list')).result.tools as Array<{ name: string; annotations: { destructiveHint: boolean } }>);
    const nguoi = await list(devTok);
    const agent = (await list(agentTok)).map((t) => t.name);
    for (const n of ['swr_delete', 'change_request_delete', 'test_plan_delete', 'agile_delete', 'review_delete', 'version_delete', 'class_content_delete', 'docs_comment_delete', 'fpt_import_excel']) {
      assert.equal(nguoi.find((t) => t.name === n)?.annotations.destructiveHint, true, n);
      assert.ok(!agent.includes(n), n);
    }
    for (const n of ['trace_links', 'trace_link_remove', 'swr_glossary_update', 'meeting_agenda_set', 'test_plans']) assert.ok(agent.includes(n), n);
    denied(await tool(agentTok, 'swr_delete', { project: 'LF', kind: 'glossary', item: 1 }), /WORK_AGENT_FORBIDDEN/);
    const r = await fetch(`${base}/api/v1/work/projects/${pid}/swr/glossary/1`, { method: 'DELETE', headers: { Authorization: `Bearer ${agentTok}` } });
    assert.equal(r.status, 403);
  });

  it('SWR302: sửa glossary theo tên, xoá; trace link có id ⇒ gỡ', async () => {
    ok(await tool(devTok, 'swr_glossary_add', { project: 'LF', term: 'Lab slot', definition: 'old' }));
    ok(await tool(devTok, 'swr_glossary_update', { project: 'LF', item: 'lab slot', definition: 'A 2-hour booking of a lab room' }));
    const g = await prisma.workGlossaryTerm.findFirstOrThrow({ where: { projectId: pid, term: 'Lab slot' } });
    assert.match(g.definition, /2-hour/);
    await okDel(tool(devTok, 'swr_delete', { project: 'LF', kind: 'glossary', item: 'Lab slot' }));
    assert.equal(await prisma.workGlossaryTerm.count({ where: { id: g.id } }), 0);
    const iss = ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'trace me' })).out;
    const n = iss.number ?? Number(String(iss.key ?? iss.created).split('-')[1]);
    const add = ok(await tool(devTok, 'trace_link_add', { project: 'LF', source: `LF-${n}`, target: 'CODE', ref: 'AuthService.verifyEmail' })).out;
    const ls = ok(await tool(devTok, 'trace_links', { project: 'LF', source: `LF-${n}` })).text;
    assert.match(ls, new RegExp(`"id": ${add.id}`));
    ok(await tool(devTok, 'trace_link_remove', { project: 'LF', id: add.id }));
    assert.equal(await prisma.workTraceLink.count({ where: { id: add.id } }), 0);
  });

  it('Change Request: tạo, sửa, nộp, liên kết thẻ; KHÔNG có đường tự duyệt; xoá', async () => {
    const c = ok(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'create', title: 'Add Google login', reason: 'Users asked', urgency: 'HIGH', scheduleDays: 3 })).out;
    ok(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'update', number: c.number, impactScope: 'Auth module' }));
    const iss = ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'affected' })).out;
    ok(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'link', number: c.number, issue: iss.number ?? iss.key ?? iss.created }));
    ok(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'submit', number: c.number }));
    const row = await prisma.workChangeRequest.findFirstOrThrow({ where: { projectId: pid, number: c.number } });
    assert.equal(row.status, 'SUBMITTED');
    denied(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'approve', number: c.number }), /action|Invalid/i);
    const g = ok(await tool(devTok, 'change_requests', { project: 'LF', number: c.number })).text;
    assert.match(g, /Auth module/);
    await okDel(tool(leadTok, 'change_request_delete', { project: 'LF', number: `CR-${c.number}` }));
  });

  it('chat: tạo kênh, đổi chủ đề, lưu trữ; ghim + react tin', async () => {
    ok(await tool(devTok, 'chat_channel_manage', { project: 'LF', action: 'create', name: 'testing', topic: 'QA', members: ['me'] }));
    ok(await tool(devTok, 'chat_channel_manage', { project: 'LF', action: 'update', channel: 'testing', topic: 'QA + bugs' }));
    const m = ok(await tool(devTok, 'chat_post', { project: 'LF', channel: 'testing', text: 'Run the suite at 5pm' })).out;
    ok(await tool(devTok, 'chat_message_act', { project: 'LF', channel: 'testing', message: m.id, action: 'pin' }));
    ok(await tool(devTok, 'chat_message_act', { project: 'LF', channel: 'testing', message: m.id, action: 'react', emoji: '👍' }));
    ok(await tool(devTok, 'chat_channel_manage', { project: 'LF', action: 'archive', channel: 'testing' }));
  });

  it('Docs: liệt kê bình luận có id, xoá bình luận của mình; họp: người dự + chương trình', async () => {
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'Plan', markdown: 'x' })).out;
    ok(await tool(devTok, 'docs_comment', { project: 'LF', page: pg.number, markdown: 'please review' }));
    const list = JSON.parse(ok(await tool(devTok, 'docs_comments', { project: 'LF', page: pg.number })).text.replace(/^[^[]*/, '').replace(/[^\]]*$/, ''));
    assert.equal(list.length, 1);
    await okDel(tool(devTok, 'docs_comment_delete', { project: 'LF', page: pg.number, comment: list[0].id }));
    const mt = ok(await tool(devTok, 'meeting_create', { project: 'LF', title: 'Weekly', start: '2026-10-23T09:00:00+07:00', end: '2026-10-23T10:00:00+07:00' })).out;
    ok(await tool(devTok, 'meeting_attendees_set', { project: 'LF', meeting: mt.created, attendees: ['me', lead.username] }));
    ok(await tool(devTok, 'meeting_agenda_set', { project: 'LF', meeting: mt.created, items: [{ title: 'Demo', presenter: 'me', minutes: 15 }, { title: 'Risks', minutes: 10 }] }));
    const att = await prisma.workMeetingAttendee.count({ where: { meeting: { projectId: pid, number: mt.created } } });
    assert.ok(att >= 2, `attendees ${att}`);
  });

  it('test plan + poker (facilitator) + retro + version', async () => {
    await call(lead, 'POST', `/projects/${pid}/tests/enable`, {});
    const tc = ok(await tool(devTok, 'test_create', { project: 'LF', title: 'Login', steps: [{ action: 'open' }] })).out;
    const pl = ok(await tool(devTok, 'test_plan_manage', { project: 'LF', name: 'Release 1', addTests: [tc.number] })).out;
    ok(await tool(devTok, 'test_plan_manage', { project: 'LF', plan: pl.created, description: 'Smoke' }));
    await okDel(tool(devTok, 'test_plan_delete', { project: 'LF', plan: pl.created }));
    const story = ok(await tool(leadTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'estimate me' })).out;
    const sn = story.number ?? Number(String(story.key ?? story.created).split('-')[1]);
    const ps = ok(await tool(leadTok, 'poker_session', { project: 'LF', action: 'create', title: 'Sprint 1', issues: [sn] })).out;
    ok(await tool(leadTok, 'poker_session', { project: 'LF', action: 'start', session: ps.created, issue: sn }));
    ok(await tool(leadTok, 'poker_vote', { project: 'LF', session: ps.created, value: '5' }));
    ok(await tool(leadTok, 'poker_session', { project: 'LF', action: 'reveal', session: ps.created }));
    ok(await tool(leadTok, 'poker_session', { project: 'LF', action: 'finalize', session: ps.created, issue: sn, value: '5' }));
    assert.equal(Number((await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: sn } })).storyPoints), 5);
    const rt = ok(await tool(leadTok, 'retro_session', { project: 'LF', action: 'create', title: 'Retro 1' })).out;
    ok(await tool(leadTok, 'retro_session', { project: 'LF', action: 'update', retro: rt.created, locked: true }));
    await okDel(tool(leadTok, 'agile_delete', { project: 'LF', kind: 'retro', id: rt.created }));
    const v = ok(await tool(leadTok, 'version_manage', { project: 'LF', action: 'create', name: 'v1.0' })).out;
    ok(await tool(leadTok, 'version_manage', { project: 'LF', action: 'update', version: 'v1.0', releaseNotes: 'First' }));
    ok(await tool(leadTok, 'version_manage', { project: 'LF', action: 'release', version: v.created }));
    assert.equal((await prisma.workVersion.findUniqueOrThrow({ where: { id: v.created } })).status, 'RELEASED');
  });

  it('test design: lưu ⇒ đọc ⇒ xuất Xray ⇒ xoá; nhập Excel 5.1 (dryRun rồi append)', async () => {
    await call(lead, 'POST', `/projects/${pid}/tests/enable`, {});
    const input = { fields: [{ name: 'age', kind: 'number', min: 18, max: 60 }], validOutcome: 'Saved' };
    const d = ok(await tool(devTok, 'test_design_save', { project: 'LF', name: 'Age rule', technique: 'EP_BVA', inputJson: JSON.stringify(input) })).out;
    assert.ok(d.saved, JSON.stringify(d));
    assert.match(ok(await tool(devTok, 'test_designs', { project: 'LF', number: d.saved })).text, /Age rule/);
    ok(await tool(devTok, 'test_design_export', { project: 'LF', number: d.saved, target: 'XRAY' }));
    await okDel(tool(devTok, 'test_design_delete', { project: 'LF', number: d.saved }));
    denied(await tool(devTok, 'test_design_save', { project: 'LF', name: 'x', technique: 'EP_BVA', inputJson: '{bad' }), /inputJson/);
    // Excel 5.1: xuất của chính dự án ⇒ nhập lại dạng dryRun
    ok(await tool(devTok, 'fpt_unit_create_function', { project: 'LF', moduleName: 'Auth', methodName: 'login' }));
    const x = await fetch(`${base}/api/v1/work/projects/${pid}/fpt-tests/export?report=unit`, { headers: { Authorization: `Bearer ${dev.token}` } });
    assert.equal(x.status, 200);
    const b64 = Buffer.from(await x.arrayBuffer()).toString('base64');
    const dry = ok(await tool(devTok, 'fpt_import_excel', { project: 'LF', base64: b64, report: 'unit', dryRun: true })).text;
    assert.match(dry, /result/);
  });

  it('review: tạo, ghi checklist, chuyển trạng thái, xoá', async () => {
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'SRS', markdown: 'x' })).out;
    const r = await tool(leadTok, 'review_manage', { project: 'LF', action: 'create', title: 'SRS inspection', kind: 'DOC', method: 'INSPECTION', checklistKey: 'WIEGERS_SRS', page: pg.number, participants: [{ user: 'me', role: 'MODERATOR' }] });
    ok(r);
    const got = ok(await tool(leadTok, 'reviews', { project: 'LF', number: r.out.created })).text;
    const itemId = Number(/"items":\s*\[\s*\{[^}]*?"id":\s*(\d+)/s.exec(got)?.[1] ?? NaN);
    assert.ok(Number.isInteger(itemId), 'review has checklist items');
    ok(await tool(leadTok, 'review_manage', { project: 'LF', action: 'items', number: r.out.created, items: [{ id: itemId, result: 'OK' }] }));
    ok(await tool(leadTok, 'review_manage', { project: 'LF', action: 'transition', number: r.out.created, to: 'PREPARATION' }));
    await okDel(tool(leadTok, 'review_delete', { project: 'LF', number: r.out.created }));
  });

  it('lớp học: giảng viên đăng thông báo, tài liệu, bài tập, xoá — không có lệnh chấm', async () => {
    const c = await call(lead, 'POST', '/classes', { subject: 'SWP391', classCode: 'se1999', term: 'fa26' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    const classId = c.data.id;
    const post = ok(await tool(leadTok, 'class_post', { classId, title: 'Welcome', markdown: 'Read the syllabus' })).out;
    const topic = ok(await tool(leadTok, 'class_material', { classId, kind: 'topic', title: 'Week 1', week: 1 })).out;
    ok(await tool(leadTok, 'class_material', { classId, kind: 'material', title: 'Syllabus', type: 'LINK', links: [{ url: 'https://example.com/syllabus' }] }));
    const as = ok(await tool(leadTok, 'class_assignment', { classId, title: 'Lab 1', markdown: 'Do it', maxPoints: 10, publish: 'DRAFT' })).out;
    assert.ok(as.created, JSON.stringify(as));
    ok(await tool(leadTok, 'class_assignment', { classId, assignment: as.created, title: 'Lab 1 (v2)' }));
    const read = ok(await tool(leadTok, 'class_content', { classId, what: 'stream' })).text;
    assert.match(read, /Welcome/);
    // Sinh viên (dev) không phải giảng viên ⇒ service từ chối
    denied(await tool(devTok, 'class_post', { classId, title: 'hi', markdown: 'x' }), /FORBIDDEN|NOT_FOUND|not/i);
    await okDel(tool(leadTok, 'class_content_delete', { classId, kind: 'post', id: post.posted }));
    await okDel(tool(leadTok, 'class_content_delete', { classId, kind: 'topic', id: topic.created }));
    const names = ((await rpc(leadTok, 'tools/list')).result.tools as Array<{ name: string }>).map((t) => t.name);
    assert.ok(!names.some((x) => /grade|return_work|gradebook/.test(x)), 'không có lệnh chấm điểm');
  });
});
