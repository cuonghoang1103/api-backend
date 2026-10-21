/**
 * 21/10/2026 đợt 3 — CuongMini ngang quyền người qua MCP (HTTP + Postgres cục bộ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.parity3.db.test.ts
 *
 *   Lệnh gộp theo action: lớp học (quản trị + soạn quiz, KHÔNG chấm), SWR302 phụ, thẻ (react, sửa hàng loạt, chuyển dự án), service desk,
 *   chat (tệp, nhắn riêng, chuyển tiếp, thông báo), Docs (bình luận neo đoạn văn, đồng soạn), họp (nhân bản, link ghi hình, áp mẫu),
 *   dashboard, thăm dò, WBS, Resources, baseline/bộ lọc, báo cáo FPT, đóng góp, form, RAID/CR, sơ đồ, test, xoá/đọc gom.
 *   Sự cố gốc: fpt_unit_get chỉ đường xoá UTCID.
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
const tag = `pc${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — CuongMini ngang quyền người đợt 3 (MCP)', { skip: !RUN }, () => {
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
    assert.equal((await call(lead, 'PUT', `/projects/${pid}/studio`, { modules: { docs: true, meetings: true, resources: true, changeRequests: true, approvals: true, raid: true, serviceDesk: true, handoffs: true, teams: true } })).status, 200);
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

  const issueNo = (o: any) => o.number ?? Number(String(o.key ?? o.created).split('-')[1]);

  it('rào: lệnh gộp mới có cho người; ctwork_delete agent không thấy; tổng số lệnh token người ≤ 280', async () => {
    const nguoi = ((await rpc(devTok, 'tools/list')).result.tools as Array<{ name: string; annotations: { destructiveHint: boolean } }>);
    const agent = ((await rpc(agentTok, 'tools/list')).result.tools as Array<{ name: string }>).map((t) => t.name);
    assert.ok(nguoi.length <= 280, `${nguoi.length}`);
    assert.equal(nguoi.find((t) => t.name === 'ctwork_delete')?.annotations.destructiveHint, true);
    assert.ok(!agent.includes('ctwork_delete') && !agent.includes('class_admin'));
    denied(await tool(agentTok, 'ctwork_delete', { project: 'LF', kind: 'dashboard', id: 1 }), /WORK_AGENT_FORBIDDEN/);
  });

  it('5.1: fpt_unit_get chỉ đường xoá/ẩn UTCID (sự cố gốc)', async () => {
    const f = ok(await tool(devTok, 'fpt_unit_create_function', { project: 'LF', moduleName: 'Auth', methodName: 'verifyEmail' })).out.created.id;
    const g = ok(await tool(devTok, 'fpt_unit_get', { project: 'LF', function: f })).text;
    assert.match(g, /remove\/delete\/hide UTCIDs ⇒ fpt_unit_delete_cases/);
    assert.match(g, /Executed By/);
  });

  it('lớp học: tạo lớp, buổi học, lịch, bình luận stream, soạn câu hỏi + quiz, xoá — không có lệnh chấm', async () => {
    const c = ok(await tool(leadTok, 'class_admin', { action: 'create_class', subject: 'SWP391', classCode: 'se2001', term: 'fa26', iAmTeacher: true })).out;
    const classId = c.created;
    ok(await tool(leadTok, 'class_admin', { action: 'update_class', classId, name: 'SE2001 — SWP391' }));
    ok(await tool(leadTok, 'class_admin', { action: 'settings', classId, streamComments: true }));
    const s = ok(await tool(leadTok, 'class_admin', { action: 'session_add', classId, title: 'Slot 1', startsAt: '2026-11-02T07:30:00+07:00', durationMin: 90 })).out;
    ok(await tool(leadTok, 'class_admin', { action: 'schedule_add', classId, title: 'Weekly', recurrence: { freq: 'WEEKLY', byWeekday: [1], hour: 7, minute: 30, startDate: '2026-11-02', endDate: '2026-12-20' }, durationMin: 90 }));
    const up = ok(await tool(leadTok, 'class_admin', { action: 'file_upload', classId, base64: Buffer.from('syllabus').toString('base64'), fileName: 'syllabus.txt', mime: 'text/plain' })).out;
    const fid = up.file.id ?? up.file.file?.id;
    assert.ok(fid, JSON.stringify(up));
    const post = ok(await tool(leadTok, 'class_post', { classId, title: 'Hello', markdown: 'Welcome', fileIds: [fid] })).out;
    const cm = ok(await tool(leadTok, 'class_admin', { action: 'comment_add', classId, post: post.posted, text: 'Questions here' })).out;
    assert.ok(cm.comment);
    const q = ok(await tool(leadTok, 'class_quiz', { action: 'question_add', classId, questionJson: JSON.stringify({ type: 'TRUE_FALSE', prompt: 'HTTP is stateless', answer: { value: true }, topic: 'web' }) })).out;
    const qid = q.question.id ?? q.question.question?.id;
    assert.ok(qid, JSON.stringify(q));
    const qz = ok(await tool(leadTok, 'class_quiz', { action: 'quiz_create', classId, title: 'Quiz 1', items: [{ questionId: qid }] })).out;
    const quizId = qz.quiz.id ?? qz.quiz.quiz?.id;
    assert.ok(quizId, JSON.stringify(qz));
    assert.match(ok(await tool(leadTok, 'class_content', { classId, what: 'quizzes' })).text, /Quiz 1/);
    await okDel(tool(leadTok, 'class_content_delete', { classId, kind: 'quiz', id: quizId }));
    await okDel(tool(leadTok, 'class_content_delete', { classId, kind: 'question', id: qid }));
    const sid = s.session.id ?? s.session.session?.id;
    if (sid) await okDel(tool(leadTok, 'class_content_delete', { classId, kind: 'session', id: sid }));
    await prisma.workClass.deleteMany({ where: { id: classId } });
  });

  it('thẻ: react bình luận, sửa hàng loạt, chuyển sang dự án khác', async () => {
    const a = issueNo(ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'bulk A' })).out);
    const b = issueNo(ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'bulk B' })).out);
    const c = ok(await tool(devTok, 'comment', { project: 'LF', issue: a, markdown: 'nice' })).out;
    ok(await tool(devTok, 'issue_extras', { project: 'LF', action: 'comment_react', issue: a, comment: c.commentId ?? c.id ?? c.comment, emoji: '👍' }));
    ok(await tool(devTok, 'issue_bulk', { project: 'LF', issues: [a, b], priority: 1, assignee: 'me' }));
    const rows = await prisma.workIssue.findMany({ where: { projectId: pid, number: { in: [a, b] } } });
    assert.ok(rows.every((r) => r.priority === 1 && r.assigneeId === dev.id));
    const p2 = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'LG', name: 'Second', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    await call(lead, 'PUT', `/projects/${p2}/members/${dev.id}`, { role: 'MEMBER' });
    const mv = await tool(leadTok, 'issue_extras', { project: 'LF', action: 'move_project', issue: b, targetProject: 'LG' });
    ok(mv);
    assert.ok(await prisma.workIssue.findFirst({ where: { projectId: p2, title: 'bulk B' } }));
  });

  it('service desk: problem tạo / sửa / liên kết sự cố / đọc / xoá', async () => {
    const pr = await tool(leadTok, 'service_desk', { project: 'LF', action: 'problem_create', title: 'Login outages' });
    ok(pr);
    const num = pr.out.problem.number;
    ok(await tool(leadTok, 'service_desk', { project: 'LF', action: 'problem_update', problem: num, rootCause: 'Token expiry', status: 'KNOWN_ERROR' }).then((r) => (r.isError && /status/.test(r.text) ? tool(leadTok, 'service_desk', { project: 'LF', action: 'problem_update', problem: num, rootCause: 'Token expiry' }) : r)));
    assert.match(ok(await tool(leadTok, 'ctwork_read', { project: 'LF', what: 'desk_problems' })).text, /Login outages/);
    await okDel(tool(leadTok, 'ctwork_delete', { project: 'LF', kind: 'desk_problem', id: num }));
  });

  it('chat: gửi tệp, nhắn riêng, chuyển tiếp, thông báo kênh', async () => {
    const f = ok(await tool(devTok, 'chat_extras', { project: 'LF', action: 'send_file', base64: Buffer.from('hello world').toString('base64'), fileName: 'notes.txt', mime: 'text/plain', text: 'see file' })).out;
    assert.ok(f.file);
    ok(await tool(devTok, 'chat_extras', { project: 'LF', action: 'dm', user: lead.username, text: 'hi lead' }));
    ok(await tool(devTok, 'chat_channel_manage', { project: 'LF', action: 'create', name: 'qa' }));
    ok(await tool(devTok, 'chat_extras', { project: 'LF', action: 'forward', message: f.message, toChannel: 'qa', note: 'fyi' }));
    ok(await tool(devTok, 'chat_extras', { project: 'LF', action: 'notify', channel: 'qa', notify: 'MENTIONS' }));
    ok(await tool(devTok, 'chat_extras', { project: 'LF', action: 'read_all' }));
  });

  it('Docs: bình luận NEO đoạn văn (chèn neo + bình luận), sai đoạn ⇒ lỗi rõ', async () => {
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'Spec', markdown: 'The system shall lock the account after five failed logins.' })).out;
    const r = ok(await tool(devTok, 'docs_extras', { project: 'LF', action: 'inline_comment', page: pg.number, quote: 'five failed logins', markdown: 'Is five right?' })).out;
    const row = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pg.number } });
    assert.match(JSON.stringify(row.contentJson), new RegExp(`"commentAnchor".*${r.anchor}`));
    const list = ok(await tool(devTok, 'docs_comments', { project: 'LF', page: pg.number })).text;
    assert.match(list, /five failed logins/);
    denied(await tool(devTok, 'docs_extras', { project: 'LF', action: 'inline_comment', page: pg.number, quote: 'not in the page', markdown: 'x' }), /not found/);
  });

  it('họp: nhân bản, link ghi hình; dashboard + bộ lọc + baseline (đọc gom + xoá gom); thăm dò; Resources; RAID/CR; test; báo cáo FPT; đóng góp', async () => {
    const m = ok(await tool(devTok, 'meeting_create', { project: 'LF', title: 'Standup', start: '2026-10-24T09:00:00+07:00', end: '2026-10-24T09:15:00+07:00' })).out;
    ok(await tool(leadTok, 'meeting_extras', { project: 'LF', action: 'recording_link', meeting: m.created, url: 'https://example.com/rec' }));
    ok(await tool(leadTok, 'meeting_extras', { project: 'LF', action: 'duplicate', meeting: m.created, weeks: 1 }));
    const d = ok(await tool(devTok, 'dashboard_save', { project: 'LF', name: 'Team', widgets: [{ kind: 'counter', title: 'Open', query: 'statusCategory != DONE' }, { kind: 'pie', groupBy: 'assignee' }] })).out;
    assert.match(ok(await tool(devTok, 'ctwork_read', { project: 'LF', what: 'dashboards' })).text, /Team/);
    ok(await tool(devTok, 'planning_extras', { project: 'LF', action: 'filter_save', name: 'Mine', query: 'assignee = currentUser()' }));
    const sch = issueNo(ok(await tool(leadTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'scheduled' })).out);
    ok(await tool(leadTok, 'update_issue', { project: 'LF', issue: sch, startDate: '2026-10-22', dueDate: '2026-10-30' }));
    ok(await tool(leadTok, 'planning_extras', { project: 'LF', action: 'baseline_add', name: 'Plan v1' }));
    await okDel(tool(devTok, 'ctwork_delete', { project: 'LF', kind: 'dashboard', id: d.dashboard }));
    const ex = ok(await tool(devTok, 'exploratory_manage', { project: 'LF', action: 'create', charter: 'Explore login with bad input', timeboxMin: 30 })).out;
    const exNum = ex.session.number;
    ok(await tool(devTok, 'exploratory_manage', { project: 'LF', action: 'start', number: exNum }));
    ok(await tool(devTok, 'exploratory_manage', { project: 'LF', action: 'note', number: exNum, kind: 'IDEA', text: 'try emoji in email' }));
    ok(await tool(devTok, 'exploratory_manage', { project: 'LF', action: 'stop', number: exNum }));
    const g = ok(await tool(leadTok, 'resource_extras', { project: 'LF', action: 'group_create', name: 'Design' })).out;
    assert.ok(g.group);
    ok(await tool(leadTok, 'resource_extras', { project: 'LF', action: 'import', text: '- [Repo](https://github.com/acme/x)', dryRun: true }));
    const st = await tool(leadTok, 'governance_extras', { project: 'LF', action: 'raid_starter' });
    ok(st);
    const cr = ok(await tool(devTok, 'change_request_manage', { project: 'LF', action: 'create', title: 'Scope change' })).out;
    // Chỉ CR đã DUYỆT (bởi người) mới sinh thẻ thực hiện — CuongMini không duyệt được, nên giả lập người duyệt ở DB.
    denied(await tool(devTok, 'governance_extras', { project: 'LF', action: 'cr_implement', item: cr.number, items: [{ title: 'x' }] }), /approved/);
    await prisma.workChangeRequest.updateMany({ where: { projectId: pid, number: cr.number }, data: { status: 'APPROVED' } });
    ok(await tool(devTok, 'governance_extras', { project: 'LF', action: 'cr_implement', item: cr.number, items: [{ title: 'Implement scope change', type: 'TASK' }] }));
    await call(lead, 'POST', `/projects/${pid}/tests/enable`, {});
    ok(await tool(devTok, 'test_extras', { project: 'LF', action: 'import_tests', rows: [{ title: 'Imported test', steps: [{ action: 'open', expected: 'ok' }] }] }));
    ok(await tool(devTok, 'test_extras', { project: 'LF', action: 'risk_save', title: 'Payment flow', likelihood: 4, impact: 5 }));
    ok(await tool(devTok, 'fpt_reports_manage', { project: 'LF', action: 'ai_usage_add', usedAt: '2026-10-20', phase: 'Testing', task: 'Generate UTCIDs', tool: 'CuongMini' }));
    assert.match(ok(await tool(devTok, 'ctwork_read', { project: 'LF', what: 'ai_usage' })).text, /Generate UTCIDs/);
    ok(await tool(devTok, 'fpt_reports_manage', { project: 'LF', action: 'doc_update', docJson: JSON.stringify({ subjectCode: 'SWP391', groupCode: 'G3' }) }));
    const rd = await tool(leadTok, 'contrib_manage', { project: 'LF', action: 'round_create', title: 'Sprint 1 review', criteria: [{ label: 'Quality' }, { label: 'Teamwork' }, { label: 'Delivery' }] });
    ok(rd);
  });

  it('WBS + SWR302 phụ: sửa cột WBS; seed stakeholder từ actor; RACI', async () => {
    const n = issueNo(ok(await tool(devTok, 'create_issue', { project: 'LF', type: 'TASK', title: 'Login screen' })).out);
    const w = await tool(devTok, 'wbs_manage', { project: 'LF', action: 'item_update', issue: n, plannedDays: 2, note: 'UI + API' });
    ok(w);
    ok(await tool(devTok, 'srs_add_actor', { project: 'LF', name: 'Student' }));
    ok(await tool(devTok, 'swr_extras', { project: 'LF', action: 'seed_stakeholders' }));
    const ra = await tool(devTok, 'swr_extras', { project: 'LF', action: 'raci_activity_add', name: 'Approve SRS' });
    ok(ra);
  });

  it('form, sơ đồ (nhập + bình luận + xoá bình luận), đồng soạn trang, chuỗi họp, đọc gom', async () => {
    const f = ok(await tool(leadTok, 'form_manage', { project: 'LF', formJson: JSON.stringify({ title: 'Bug report', fields: [{ label: 'What happened?', kind: 'longtext', required: true }] }) })).out;
    assert.ok(f.form, JSON.stringify(f));
    const d = ok(await tool(devTok, 'diagram_extras', { project: 'LF', action: 'import', fileName: 'flow.mmd', content: 'flowchart TD\n  A[Login] --> B[Home]' })).out;
    const dn = d.imported.number ?? d.imported.diagram?.number;
    assert.ok(dn, JSON.stringify(d));
    const c = ok(await tool(devTok, 'diagram_extras', { project: 'LF', action: 'comment_add', diagram: dn, text: 'Add a failure path' })).out;
    const cid = c.comment.id ?? c.comment.comment?.id;
    ok(await tool(devTok, 'diagram_extras', { project: 'LF', action: 'comment_update', diagram: dn, comment: cid, resolved: true }));
    await okDel(tool(devTok, 'ctwork_delete', { project: 'LF', kind: 'diagram_comment', id: cid, diagram: dn }));
    const pg = ok(await tool(devTok, 'docs_draft_page', { project: 'LF', title: 'Live', markdown: 'x' })).out;
    ok(await tool(devTok, 'docs_extras', { project: 'LF', action: 'live_editing', page: pg.number, enabled: false }));
    const { MEETING_TEMPLATES } = await import('../services/work/meetingSeries.js');
    const sr = await tool(leadTok, 'meeting_extras', { project: 'LF', action: 'series_create', seriesJson: JSON.stringify({ title: 'Daily', recurrence: { freq: 'WEEKLY', byWeekday: [1, 3, 5], hour: 9, minute: 0, startDate: '2026-11-02', count: 4 }, durationMin: 15 }), attendees: ['me'] });
    ok(sr);
    assert.match(ok(await tool(leadTok, 'ctwork_read', { project: 'LF', what: 'meeting_series' })).text, /Daily/);
    {
      const m = ok(await tool(leadTok, 'meeting_create', { project: 'LF', title: 'Planning', start: '2026-11-03T09:00:00+07:00', end: '2026-11-03T10:00:00+07:00' })).out;
      ok(await tool(leadTok, 'meeting_extras', { project: 'LF', action: 'apply_template', meeting: m.created, key: MEETING_TEMPLATES[0].key }));
    }
    for (const what of ['filters', 'baselines', 'exploratory', 'wbs', 'handoffs', 'weekly_reports', 'report_doc', 'estimation'] as const) ok(await tool(devTok, 'ctwork_read', { project: 'LF', what }));
  });
});
