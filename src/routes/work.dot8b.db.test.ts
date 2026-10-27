/**
 * CT Work ĐỢT 8B (19/10/2026) — AI làm thao tác thành viên qua MCP + sổ AI usage (HTTP + Postgres cục bộ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.dot8b.db.test.ts
 *
 *   • tool mới: checklist_list/toggle, issue_assign, issue_move_sprint, worklog_list/update, approval_request/list,
 *     docs_comment, form_list/submit, meeting_rsvp, agile_rooms/poker_vote/retro_card_add/retro_vote, class_work/submit/
 *     unsubmit, timesheet_submit; attach_file {for:"comment"} + comment.attachments; presign ⇒ attach_complete.
 *     Mỗi tool: thành viên được, người ngoài 404, khách cổng 403, agent bị chặn đúng chỗ (và được ở chỗ được).
 *   • AI usage: MCP ghi sổ (client cuongmini/mcp/agent, tool, thẻ, ghi/đọc, lỗi), Ask AI web ghi client web, lượt
 *     CuongMini phân bổ theo lượt + hạn mức nhóm chính xác, model chỉ tên CuongMini; quyền xem: ADMIN tất, thành viên
 *     của mình, khách/agent 403, người ngoài 404 — cả tab dự án lẫn trang không gian.
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `d8${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const PDF = Buffer.from('%PDF-1.7\n1 0 obj << >> endobj\ntrailer\n%%EOF');
const p = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] });
const task = (text: string, checked = false) => ({ type: 'taskItem', attrs: { checked }, content: [p(text)] });

describe('CT Work đợt 8B — AI làm thao tác thành viên + AI usage', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, outsider: U, client: U;
  let wsId = 0, pid = 0, cfg: any;
  let devTok = '', leadTok = '', outTok = '', clientTok = '', agentTok = '', agentUserId = 0;
  let classId = 0;
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
    if (b.error) return { isError: true, text: String(b.error.message), out: null as any };
    const text = String(b.result.content[0].text);
    let out: any = null;
    try { out = JSON.parse(text); } catch { /* chữ */ }
    return { isError: b.result.isError === true, text, out };
  }
  const inner = (text: string) => JSON.parse(/<ctwork-content[^>]*>\n?([\s\S]*?)\n?<\/ctwork-content>/.exec(text)![1]!);
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
  async function mkIssue(title: string, extra: Record<string, unknown> = {}) {
    const r = await call(lead, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
  }
  const denied = (r: { isError: boolean; text: string }, code: RegExp) => {
    assert.equal(r.isError, true, r.text);
    assert.match(r.text, code);
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
    [lead, dev, outsider, client] = await Promise.all(['lead', 'dev', 'out', 'client'].map((n) => mkUser(n)));
    wsId = (await call(lead, 'POST', '/workspaces', { name: `D8 ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'NT', name: 'Nhà trọ', template: 'BLANK', kind: 'SCHOOL' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    const mods = await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true, approvals: true, meetings: true, clientPortal: true } });
    assert.equal(mods.status, 200, JSON.stringify(mods.raw));
    assert.equal((await call(lead, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(lead, 'GET', `/projects/${pid}`)).data;
    // Token CuongMini (tên app tự đặt "CuongMini · <máy>") ⇒ client cuongmini; token "Claude Code" ⇒ client mcp.
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'CuongMini · test-mac', scopes: ['read', 'write'] })).data.token;
    leadTok = (await call(lead, 'POST', '/me/api-tokens', { name: 'Claude Code', scopes: ['read', 'write'] })).data.token;
    outTok = (await call(outsider, 'POST', '/me/api-tokens', { name: 'x', scopes: ['read', 'write'] })).data.token;
    clientTok = (await call(client, 'POST', '/me/api-tokens', { name: 'x', scopes: ['read', 'write'] })).data.token;
    assert.ok(devTok && leadTok && outTok && clientTok);
    const a = await call(lead, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot', model: 'gpt-6-sol', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    agentTok = a.data.token.token;
    agentUserId = a.data.agent.userId;
    await call(lead, 'PUT', `/projects/${pid}/members/${agentUserId}`, { role: 'MEMBER' });
  });

  after(async () => {
    server?.close();
    const ids = [...userIds, agentUserId].filter(Boolean);
    await prisma.workAiCall.deleteMany({ where: { OR: [{ workspaceId: wsId }, { userId: { in: ids } }] } });
    await prisma.interviewLLMCallLog.deleteMany({ where: { userId: { in: ids } } });
    if (classId) await prisma.workClass.deleteMany({ where: { id: classId } });
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

  it('tools/list: tool 8B có mặt, ghi ⇒ readOnlyHint false (client hiện thẻ duyệt), đọc ⇒ true', async () => {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${devTok}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/list' }),
    });
    const list = ((await res.json()) as any).result.tools as Array<{ name: string; annotations: { readOnlyHint: boolean } }>;
    const by = new Map(list.map((t) => [t.name, t]));
    for (const n of ['checklist_toggle', 'approval_request', 'form_submit', 'class_submit', 'poker_vote', 'worklog_update', 'docs_comment', 'meeting_rsvp']) {
      assert.equal(by.get(n)?.annotations.readOnlyHint, false, n);
    }
    for (const n of ['checklist_list', 'approval_list', 'form_list', 'class_work', 'agile_rooms', 'worklog_list']) assert.equal(by.get(n)?.annotations.readOnlyHint, true, n);
  });

  it('checklist "Tự kiểm" + tiêu chí chấp nhận: thành viên tích theo số/chữ; người ngoài 404; khách 403; agent chỉ thẻ của mình', async () => {
    const i = await mkIssue('Đăng nhập', {
      assigneeId: dev.id,
      descriptionJson: { type: 'doc', content: [
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tự kiểm' }] },
        { type: 'taskList', content: [task('Chạy unit test'), task('Tự review code')] },
        { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Acceptance criteria' }] },
        { type: 'taskList', content: [task('Sai mật khẩu báo lỗi'), task('Khoá sau 5 lần', true)] },
      ] },
    });
    const l = await tool(devTok, 'checklist_list', { project: 'NT', issue: i.number });
    assert.equal(l.isError, false, l.text);
    const items = inner(l.text);
    assert.equal(items.length, 4);
    assert.deepEqual(items.map((x: any) => x.section), ['Tự kiểm', 'Tự kiểm', 'Acceptance criteria', 'Acceptance criteria']);
    const t = await tool(devTok, 'checklist_toggle', { project: 'NT', issue: `NT-${i.number}`, items: [1, 'sai mật khẩu'] });
    assert.equal(t.isError, false, t.text);
    assert.equal(t.out.done, 3);
    const d = await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id }, select: { descriptionJson: true } });
    assert.match(JSON.stringify(d.descriptionJson), /"checked":true[^}]*}[^]*Chạy unit test/);
    // bỏ tích
    assert.equal((await tool(devTok, 'checklist_toggle', { project: 'NT', issue: i.number, items: [4], checked: false })).out.done, 2);
    // chữ mơ hồ ⇒ lỗi rõ
    denied(await tool(devTok, 'checklist_toggle', { project: 'NT', issue: i.number, items: ['t'] }), /WORK_BAD_CHECKLIST_ITEM/);
    denied(await tool(outTok, 'checklist_toggle', { project: 'NT', issue: i.number, items: [1] }), /WORK_PROJECT_NOT_FOUND/);
    denied(await tool(clientTok, 'checklist_toggle', { project: 'NT', issue: i.number, items: [1] }), /CLIENT_PORTAL_ONLY|403/);
    denied(await tool(agentTok, 'checklist_toggle', { project: 'NT', issue: i.number, items: [1] }), /WORK_AGENT_FORBIDDEN/);
    // thẻ của agent ⇒ agent tích được
    const mine = await mkIssue('Việc của bot', { assigneeId: agentUserId, descriptionJson: { type: 'doc', content: [{ type: 'taskList', content: [task('Viết test')] }] } });
    assert.equal((await tool(agentTok, 'checklist_toggle', { project: 'NT', issue: mine.number, items: [1] })).isError, false);
  });

  it('đính kèm: ảnh vào BÌNH LUẬN (bản nháp ⇒ comment.attachments) + luồng presign ⇒ attach_complete; người khác không gắn được nháp của mình', async () => {
    const i = await mkIssue('Lỗi giao diện', { assigneeId: dev.id });
    const a = await tool(devTok, 'attach_file', { project: 'NT', issue: i.number, fileName: 'shot.png', contentType: 'image/png', base64: PNG.toString('base64'), for: 'comment' });
    assert.equal(a.isError, false, a.text);
    assert.equal(a.out.for, 'comment');
    const draftId = a.out.attachmentId;
    // lead không gắn được bản nháp của dev
    const steal = await tool(leadTok, 'comment', { project: 'NT', issue: i.number, markdown: 'của tôi', attachments: [draftId] });
    assert.equal(steal.isError, true, steal.text);
    const c = await tool(devTok, 'comment', { project: 'NT', issue: i.number, markdown: 'Ảnh lỗi đây', attachments: [draftId] });
    assert.equal(c.isError, false, c.text);
    const att = await prisma.workAttachment.findUniqueOrThrow({ where: { id: draftId }, select: { commentId: true, forComment: true } });
    assert.equal(att.commentId, c.out.commentId);
    // presign ⇒ PUT (kho sandbox) ⇒ complete, vào khối Attachments của thẻ
    const pre = await tool(devTok, 'attach_file', { project: 'NT', issue: i.number, fileName: 'log.pdf', contentType: 'application/pdf', sizeBytes: PDF.length });
    assert.equal(pre.isError, false, pre.text);
    assert.match(pre.out.presign.key, new RegExp(`^work/${pid}/`));
    await putObject(pre.out.presign.key, PDF, 'application/pdf', 'private, max-age=0');
    const done = await tool(devTok, 'attach_complete', { project: 'NT', issue: i.number, key: pre.out.presign.key, fileName: 'log.pdf' });
    assert.equal(done.isError, false, done.text);
    const row = await prisma.workAttachment.findUniqueOrThrow({ where: { id: done.out.attachmentId }, select: { forComment: true, issueId: true } });
    assert.equal(row.forComment, false);
    assert.equal(row.issueId, i.id);
    // key của thẻ khác ⇒ từ chối
    const other = await mkIssue('Khác');
    denied(await tool(devTok, 'attach_complete', { project: 'NT', issue: other.number, key: pre.out.presign.key, fileName: 'x.pdf' }), /WORK_BAD_KEY/);
  });

  it('nhận/thả thẻ của chính mình; chuyển sprint theo quyền (agent không lập kế hoạch sprint)', async () => {
    const i = await mkIssue('Trang chủ');
    const take = await tool(devTok, 'issue_assign', { project: 'NT', issue: i.number, to: 'me' });
    assert.equal(take.isError, false, take.text);
    assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id } })).assigneeId, dev.id);
    // 19/10/2026: người sửa được thẻ (lead) bỏ giao / giao cho người khác như trên web; agent vẫn chỉ nhận/thả thẻ của mình.
    assert.equal((await tool(leadTok, 'issue_assign', { project: 'NT', issue: i.number, to: 'nobody' })).isError, false);
    assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id } })).assigneeId, null);
    assert.equal((await tool(leadTok, 'issue_assign', { project: 'NT', issue: i.number, to: dev.username })).isError, false);
    assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id } })).assigneeId, dev.id);
    denied(await tool(agentTok, 'issue_assign', { project: 'NT', issue: i.number, to: 'nobody' }), /WORK_NOT_YOURS/);
    denied(await tool(agentTok, 'issue_assign', { project: 'NT', issue: i.number, to: lead.username }), /WORK_AGENT_FORBIDDEN/);
    assert.equal((await tool(devTok, 'issue_assign', { project: 'NT', issue: i.number, to: 'nobody' })).isError, false);
    const sp = await call(lead, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 1' });
    assert.equal(sp.status, 201, JSON.stringify(sp.raw));
    const mv = await tool(devTok, 'issue_move_sprint', { project: 'NT', issues: [i.number], sprint: 'Sprint 1' });
    assert.equal(mv.isError, false, mv.text);
    assert.equal((await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id } })).sprintId, sp.data.id);
    denied(await tool(devTok, 'issue_move_sprint', { project: 'NT', issues: [i.number], sprint: 'Không có' }), /WORK_BAD_SPRINT/);
    denied(await tool(agentTok, 'issue_move_sprint', { project: 'NT', issues: [i.number], sprint: 'backlog' }), /WORK_AGENT_FORBIDDEN/);
  });

  it('giờ: log_work ⇒ worklog_list ⇒ worklog_update (ghi lại, tổng thẻ theo); lead không ghi lại giờ của dev', async () => {
    const i = await mkIssue('API phòng', { assigneeId: dev.id });
    const lw = await tool(devTok, 'log_work', { project: 'NT', issue: i.number, minutes: 30, note: 'code' });
    assert.equal(lw.isError, false, lw.text);
    const list = inner((await tool(devTok, 'worklog_list', { project: 'NT', issue: i.number })).text);
    assert.equal(list.length, 1);
    const up = await tool(devTok, 'worklog_update', { project: 'NT', issue: i.number, worklog: list[0].id, minutes: 45, activity: 'Coding' });
    assert.equal(up.isError, false, up.text);
    const iss = await prisma.workIssue.findUniqueOrThrow({ where: { id: i.id }, select: { timeSpentMin: true } });
    assert.equal(iss.timeSpentMin, 45);
    const logs = await prisma.workWorklog.findMany({ where: { issueId: i.id } });
    assert.equal(logs.length, 1);
    assert.equal(logs[0].activity, 'Coding');
    denied(await tool(leadTok, 'worklog_update', { project: 'NT', issue: i.number, worklog: logs[0].id, minutes: 5 }), /WORK_NOT_YOURS/);
    // chỉ đổi activity ⇒ không ghi lại
    assert.equal((await tool(devTok, 'worklog_update', { project: 'NT', issue: i.number, worklog: logs[0].id, activity: 'Testing' })).isError, false);
    assert.equal((await prisma.workWorklog.findUniqueOrThrow({ where: { id: logs[0].id } })).activity, 'Testing');
  });

  it('gửi duyệt (không tự duyệt) + danh sách; bình luận Docs; agent gửi duyệt được, không RSVP được', async () => {
    const i = await mkIssue('Thiết kế ERD', { assigneeId: dev.id });
    denied(await tool(devTok, 'approval_request', { project: 'NT', issue: i.number, approvers: [dev.username] }), /WORK_SELF_APPROVAL/);
    denied(await tool(devTok, 'approval_request', { project: 'NT', issue: i.number, approvers: ['khong_ton_tai_x'] }), /WORK_BAD_USER/);
    const r = await tool(devTok, 'approval_request', { project: 'NT', issue: i.number, approvers: [lead.username], note: 'Xem giúp ERD' });
    assert.equal(r.isError, false, r.text);
    assert.ok(r.out.approvalId);
    const al = inner((await tool(devTok, 'approval_list', { project: 'NT', status: 'PENDING' })).text);
    assert.ok(al.some((x: any) => x.id === r.out.approvalId));
    // Docs: trang + bình luận
    const pg = await call(lead, 'POST', `/projects/${pid}/pages`, { title: 'SRS', contentJson: { type: 'doc', content: [p('Mở đầu')] } });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw));
    const dc = await tool(devTok, 'docs_comment', { project: 'NT', page: pg.data.number, markdown: 'Mục 2 thiếu use case **đăng ký**' });
    assert.equal(dc.isError, false, dc.text);
    assert.ok(await prisma.workPageComment.findUnique({ where: { id: dc.out.commentId } }));
    denied(await tool(outTok, 'docs_comment', { project: 'NT', page: pg.data.number, markdown: 'x' }), /WORK_PROJECT_NOT_FOUND/);
    // Họp: RSVP
    const start = new Date(Date.now() + 86_400_000);
    const m = await call(lead, 'POST', `/projects/${pid}/meetings`, { title: 'Sprint review', type: 'DEMO', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600_000).toISOString(), attendeeIds: [lead.id, dev.id], sendInvites: false });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    const rs = await tool(devTok, 'meeting_rsvp', { project: 'NT', meeting: m.data.number, rsvp: 'MAYBE', note: 'Trùng giờ học' });
    assert.equal(rs.isError, false, rs.text);
    assert.equal((await prisma.workMeetingAttendee.findFirstOrThrow({ where: { userId: dev.id, meeting: { projectId: pid } } })).rsvp, 'MAYBE');
    denied(await tool(agentTok, 'meeting_rsvp', { project: 'NT', meeting: m.data.number, rsvp: 'YES' }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(clientTok, 'approval_request', { project: 'NT', issue: i.number, approvers: [lead.username] }), /CLIENT_PORTAL_ONLY|403/);
  });

  it('form: form_list ⇒ form_submit tạo thẻ; agent bị chặn (tuyến form theo token nằm ngoài dự án)', async () => {
    const f = await call(lead, 'POST', `/projects/${pid}/forms`, {
      title: 'Báo lỗi', access: 'INTERNAL',
      fields: [{ id: 'summary', kind: 'text', label: 'Summary', required: true }, { id: 'kind', kind: 'select', label: 'Kind', options: ['Bug', 'Idea'], required: true }],
      mapping: { typeKey: 'TASK', titleTemplate: '[{kind}] {summary}' },
    });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    assert.equal((await call(lead, 'POST', `/projects/${pid}/forms/F-1/status`, { status: 'OPEN' })).status, 200);
    const fl = inner((await tool(devTok, 'form_list', { project: 'NT' })).text);
    assert.equal(fl[0].form, 'F-1');
    assert.equal(fl[0].fields.length, 2);
    denied(await tool(devTok, 'form_submit', { project: 'NT', form: 'F-1', answers: [{ field: 'summary', value: 'x' }] }), /WORK_FORM_INVALID/);
    const s = await tool(devTok, 'form_submit', { project: 'NT', form: 'F-1', answers: [{ field: 'summary', value: 'Nút lưu không chạy' }, { field: 'kind', value: 'Bug' }] });
    assert.equal(s.isError, false, s.text);
    assert.ok(await prisma.workIssue.findFirst({ where: { projectId: pid, title: '[Bug] Nút lưu không chạy' } }));
    denied(await tool(agentTok, 'form_submit', { project: 'NT', form: 'F-1', answers: [{ field: 'summary', value: 'x' }, { field: 'kind', value: 'Bug' }] }), /WORK_AGENT_FORBIDDEN/);
  });

  it('poker + retro: thành viên bỏ phiếu / thêm thẻ / bình chọn; agent chỉ đọc', async () => {
    const i = await mkIssue('Ước lượng trang tìm phòng');
    const s = await call(lead, 'POST', `/projects/${pid}/poker`, { title: 'Ước lượng', issues: [i.number] });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    const room = (await call(lead, 'GET', `/projects/${pid}/poker/${s.data.id}`)).data;
    const item = room.items[0].id;
    assert.equal((await call(lead, 'POST', `/projects/${pid}/poker/${s.data.id}/items/${item}/start`)).status, 200);
    const rooms = await tool(devTok, 'agile_rooms', { project: 'NT' });
    assert.equal(rooms.isError, false, rooms.text);
    const v = await tool(devTok, 'poker_vote', { project: 'NT', session: s.data.id, value: '5' });
    assert.equal(v.isError, false, v.text);
    assert.equal((await prisma.workPokerVote.findFirstOrThrow({ where: { itemId: item, userId: dev.id } })).value, '5');
    denied(await tool(agentTok, 'poker_vote', { project: 'NT', session: s.data.id, value: '3' }), /WORK_AGENT_FORBIDDEN/);
    assert.equal((await tool(agentTok, 'agile_rooms', { project: 'NT', poker: s.data.id })).isError, false, 'agent đọc phòng poker được');
    const r = await call(lead, 'POST', `/projects/${pid}/retros`, { title: 'Retro 1', template: 'SSC' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const card = await tool(devTok, 'retro_card_add', { project: 'NT', retro: r.data.id, column: 'START', text: 'Họp ngắn hơn' });
    assert.equal(card.isError, false, card.text);
    const vote = await tool(devTok, 'retro_vote', { project: 'NT', retro: r.data.id, card: card.out.cardId });
    assert.equal(vote.isError, false, vote.text);
    denied(await tool(agentTok, 'retro_card_add', { project: 'NT', retro: r.data.id, column: 'STOP', text: 'x' }), /WORK_AGENT_FORBIDDEN/);
  });

  it('timesheet_submit: agent bị chặn (tài chính); thành viên đi đúng service (mô-đun tắt ⇒ lỗi rõ)', async () => {
    denied(await tool(agentTok, 'timesheet_submit', { project: 'NT', weekStart: '2026-10-12' }), /WORK_AGENT_FORBIDDEN/);
    const r = await tool(devTok, 'timesheet_submit', { project: 'NT', weekStart: '2026-10-12' });
    assert.equal(r.isError, true, 'dự án không bật Finance');
  });

  it('lớp học: class_work ⇒ class_submit (chữ, link, tệp, nhận xét, nộp) ⇒ class_unsubmit; agent 403; người ngoài 404', async () => {
    const c = await call(lead, 'POST', '/classes', { subject: 'SWP391', classCode: 'SE1888', term: 'FA26' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    classId = c.data.id;
    await prisma.workClassStudent.create({ data: { classId, userId: dev.id, email: dev.email, studentCode: 'HE1', fullName: 'Dev', source: 'JOIN', joinedAt: new Date() } });
    const as = await call(lead, 'POST', `/classes/${classId}/assignments`, { title: 'Lab 1', publish: 'NOW' });
    assert.equal(as.status, 201, JSON.stringify(as.raw).slice(0, 400));
    const aid = as.data.id;
    const mine = inner((await tool(devTok, 'class_work', {})).text);
    assert.ok(mine.enrolled.some((x: any) => x.classId === classId));
    const list = inner((await tool(devTok, 'class_work', { classId })).text);
    assert.equal(list[0].assignment, aid);
    const sub = await tool(devTok, 'class_submit', {
      classId, assignment: aid, text: 'Bài làm', links: [{ url: 'https://github.com/dev/lab1' }],
      files: [{ fileName: 'bao-cao.pdf', base64: PDF.toString('base64') }], comment: 'Thầy xem giúp em', turnIn: true,
    });
    assert.equal(sub.isError, false, sub.text);
    assert.ok(sub.out.done.includes('turned in'));
    denied(await tool(devTok, 'class_submit', { classId, assignment: aid, text: 'sửa' }), /WORK_CLASSWORK_TURNED_IN/);
    assert.equal((await tool(devTok, 'class_unsubmit', { classId, assignment: aid })).isError, false);
    denied(await tool(agentTok, 'class_work', { classId }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(agentTok, 'class_submit', { classId, assignment: aid, turnIn: true }), /WORK_AGENT_FORBIDDEN/);
    denied(await tool(outTok, 'class_work', { classId }), /not found|404/i);
  });

  it('AI usage — sổ MCP: client (cuongmini/mcp/agent), tool, thẻ, ghi/lỗi', async () => {
    const rows = await prisma.workAiCall.findMany({ where: { projectId: pid }, orderBy: { id: 'asc' } });
    const dv = rows.filter((r) => r.userId === dev.id);
    assert.ok(dv.length > 10);
    assert.ok(dv.every((r) => r.client === 'cuongmini'), 'token "CuongMini · …" ⇒ cuongmini');
    assert.ok(rows.filter((r) => r.userId === lead.id).every((r) => r.client === 'mcp'));
    assert.ok(rows.some((r) => r.userId === agentUserId && r.client === 'agent' && !r.ok && r.errorCode === 'WORK_AGENT_FORBIDDEN'));
    const tick = dv.find((r) => r.tool === 'checklist_toggle' && r.ok)!;
    assert.equal(tick.write, true);
    assert.match(tick.target ?? '', /^NT-\d+$/);
    assert.equal(dv.find((r) => r.tool === 'checklist_list')!.write, false);
    // người ngoài: projectFor không mở dự án ⇒ không có dòng nào của họ trong dự án này
    assert.equal(rows.filter((r) => r.userId === outsider.id).length, 0);
  });

  it('AI usage — chi phí: lượt CuongMini phân bổ theo lượt + hạn mức nhóm chính xác + AI web; chỉ tên CuongMini', async () => {
    const { recordLlmCall } = await import('../services/work/aiUsage.service.js');
    const last = await prisma.workAiCall.findFirstOrThrow({ where: { userId: dev.id, client: 'cuongmini' }, orderBy: { id: 'desc' } });
    const t = new Date(last.createdAt.getTime() + 1000);
    // lượt Solid (modelapi, 0,02 $) ngay sau lời gọi tool CT Work ⇒ của dự án; cùng lượt đó một đoạn rambo (0 $, tự chuyển
    // cổng ⇒ dòng sổ thứ hai cách < 3 s) ⇒ đếm lượt;
    // lượt hạn mức nhóm (step nhom:p<pid>) ⇒ chính xác; lượt 3 giờ sau không có tool CT Work ⇒ KHÔNG tính.
    await prisma.interviewLLMCallLog.createMany({ data: [
      { userId: dev.id, feature: 'agent', step: 'interview', provider: 'gateway', model: 'gpt-6-sol', inputTokens: 1000, outputTokens: 200, costUsd: 0.02, createdAt: t },
      { userId: dev.id, feature: 'agent', step: 'default', provider: 'gateway', model: 'claude-haiku-4-5', inputTokens: 500, outputTokens: 100, costUsd: 0, createdAt: new Date(t.getTime() + 1_000) },
      { userId: dev.id, feature: 'agent', step: `nhom:p${pid}:u${lead.id}`, provider: 'gateway', model: 'gpt-6-luna', inputTokens: 300, outputTokens: 50, costUsd: 0.005, createdAt: new Date(t.getTime() + 60_000) },
      { userId: dev.id, feature: 'agent', step: 'interview', provider: 'gateway', model: 'gpt-6-sol', inputTokens: 9999, outputTokens: 999, costUsd: 0.5, createdAt: new Date(t.getTime() + 3 * 3600_000) },
    ] });
    // AI web trong dự án (người nghe sổ chung)
    await recordLlmCall({ userId: lead.id, feature: 'work', purpose: 'work_assistant', model: 'gpt-6-sol', inputTokens: 100, outputTokens: 50, costUsd: 0.001, success: true }, { projectId: pid });
    await recordLlmCall({ userId: lead.id, feature: 'work', purpose: 'work_agent', model: 'gpt-6-sol', inputTokens: 100, outputTokens: 50, costUsd: 0.001, success: true }, { projectId: pid });
    // 28/10: máy chủ hiểu `to` theo ngày giờ VN (+07:00) ⇒ tính ngày VN, không lấy ngày UTC (chạy 0h–7h sáng VN từng đỏ: lượt gọi rơi sau `to`).
    const to = new Date(t.getTime() + 4 * 3600_000 + 7 * 3600_000).toISOString().slice(0, 10);
    const r = await call(lead, 'GET', `/projects/${pid}/ai-usage?to=${to}`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const d = r.data;
    assert.equal(d.canSeeAll, true);
    const me = d.people.find((x: any) => x.userId === dev.id);
    assert.ok(me.clients.includes('cuongmini'));
    assert.ok(Math.abs(me.modelapiUsd - 0.025) < 1e-6, `0,02 (Solid) + 0,005 (nhóm) — không tính lượt 0,5 $ ngoài CT Work: ${me.modelapiUsd}`);
    assert.equal(me.ramboTurns, 1);
    assert.ok(me.models.includes('CuongMini Solid') && me.models.includes('CuongMini Nova'), JSON.stringify(me.models));
    const ld = d.people.find((x: any) => x.userId === lead.id);
    assert.ok(Math.abs(ld.modelapiUsd - 0.001) < 1e-6, 'AI web: chỉ lời gọi trợ lý, không trùng agent dựng sẵn');
    assert.equal(d.notes.cuongMiniEstimated, true);
    const raw = JSON.stringify(d);
    for (const real of ['gpt-6-sol', 'gpt-6-luna', 'claude-haiku-4-5']) assert.ok(!raw.includes(real), `lộ tên thật ${real}`);
    assert.ok(d.writes.some((w: any) => w.tool === 'checklist_toggle' && w.user.id === dev.id && /^NT-/.test(w.target)));
    assert.ok(d.members.length >= 2);
  });

  it('AI usage — quyền: ADMIN tất, thành viên của mình, khách/agent 403, người ngoài 404 (dự án + không gian)', async () => {
    const own = await call(dev, 'GET', `/projects/${pid}/ai-usage`);
    assert.equal(own.status, 200);
    assert.equal(own.data.canSeeAll, false);
    assert.deepEqual(own.data.people.map((x: any) => x.userId), [dev.id]);
    assert.ok(own.data.writes.every((w: any) => w.user.id === dev.id));
    assert.deepEqual(own.data.members, []);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/ai-usage?userId=${lead.id}`)).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/ai-usage`)).status, 404);
    assert.equal((await call(client, 'GET', `/projects/${pid}/ai-usage`)).status, 403);
    assert.equal((await call({ token: agentTok }, 'GET', `/projects/${pid}/ai-usage`)).code, 'WORK_AGENT_FORBIDDEN');
    const filt = await call(lead, 'GET', `/projects/${pid}/ai-usage?userId=${dev.id}`);
    assert.deepEqual(filt.data.people.map((x: any) => x.userId), [dev.id]);
    // không gian
    const ws = await call(lead, 'GET', `/workspaces/${wsId}/ai-usage`);
    assert.equal(ws.status, 200, JSON.stringify(ws.raw));
    assert.ok(ws.data.people.length >= 2);
    assert.ok(ws.data.projects.some((x: any) => x.id === pid));
    assert.ok(ws.data.writes.every((w: any) => w.project?.key === 'NT'));
    const wsDev = await call(dev, 'GET', `/workspaces/${wsId}/ai-usage?projectId=${pid}`);
    assert.equal(wsDev.status, 200);
    assert.deepEqual(wsDev.data.people.map((x: any) => x.userId), [dev.id]);
    assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/ai-usage`)).status, 404);
    assert.equal((await call({ token: agentTok }, 'GET', `/workspaces/${wsId}/ai-usage`)).status, 403);
    assert.equal((await call(lead, 'GET', `/workspaces/${wsId}/ai-usage?from=2026-10-20&to=2026-10-01`)).status, 400);
    // QA 19/10/2026: thành viên thường KHÔNG thấy tên dự án PRIVATE mình không ở trong (khớp listProjects); ADMIN thấy.
    const pv = await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'BM', name: 'Bí mật', template: 'BLANK', kind: 'SCHOOL' });
    assert.equal(pv.status, 201, JSON.stringify(pv.raw));
    assert.equal((await call(lead, 'PATCH', `/projects/${pv.data.id}`, { visibility: 'PRIVATE' })).status, 200);
    assert.ok(!(await call(dev, 'GET', `/workspaces/${wsId}/ai-usage`)).data.projects.some((x: any) => x.id === pv.data.id));
    assert.ok((await call(lead, 'GET', `/workspaces/${wsId}/ai-usage`)).data.projects.some((x: any) => x.id === pv.data.id));
  });

  it('Ask AI (web) chạy lệnh registry ⇒ sổ client web', async () => {
    const { runForPerson } = await import('../services/work/toolRegistry/index.js');
    const i = await mkIssue('Ask AI', { descriptionJson: { type: 'doc', content: [{ type: 'taskList', content: [task('A')] }] } });
    await runForPerson(lead.id, pid, 'checklist_toggle', { issue: i.number, items: [1] }, 'apply');
    const row = await prisma.workAiCall.findFirstOrThrow({ where: { projectId: pid, client: 'web', tool: 'checklist_toggle' } });
    assert.equal(row.userId, lead.id);
    assert.equal(row.target, `NT-${i.number}`);
  });
});
