/**
 * CT Work — dm5 G1 (27/11/2026) "Cổng quy trình & nhịp vận hành", qua HTTP thật + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5a.db.test.ts
 *
 *   A14 DoR: trường DoR trống ⇒ 400 WORK_READY_REQUIREMENTS qua REST, sửa hàng loạt và MCP `transition`; prototype chưa duyệt;
 *       hộp thoại sprint (guards) đếm thẻ chưa Ready; MCP sprint_current trả notReady.
 *   A2  requireCiGreen: PR failure/pending ⇒ WORK_DONE_CI; success ⇒ qua; không PR ⇒ theo requirePr.
 *   A6  requireComment {teamIds}: chỉ bình luận của bộ phận QA SAU lúc vào trạng thái nguồn mới tính; minHoursInFrom làm nguội.
 *   A4  wipGuards: Code Review đầy ⇒ không kéo thêm vào In Progress.
 *   A23 stageGateBlocksWork: giai đoạn NOT_STARTED ⇒ không bắt đầu thẻ; kích hoạt rồi thì được.
 *   A17 ngày kế hoạch giai đoạn + timeline đỏ khi trễ.
 *   A15 sức chứa × tập trung trong guards (đỏ khi > warnPct).
 *   A18 JQL flaggedSince, cảnh báo sớm (Blocked > 24h, P1–P2 đứng yên > 48h, burndown phẳng, thêm phạm vi), tuổi thẻ.
 *   A19 RAG 4 chiều (tổng = chiều tệ nhất) + % hoàn thành có trọng số; widget `rag` lưu được.
 *   A21 biên bản họp: TASK / BUG / CR / QUESTION ⇒ đúng loại; bấm lại không nhân đôi; MCP meeting_add_actions nhận kind.
 *   A12 retro: trigger/verify, trần hành động (WORK_RETRO_ACTION_CAP, tắt được), GET facts + MCP retro_session facts.
 *   A22 MoSCoW: Must > trần ⇒ over.
 *   A7  mẫu SWP391: Retest → Closed có notAssignee; trần retro 2.
 */

import './work.ctw5b.testenv.js';
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
const tag = `dm5a${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };
const DAY = 86_400_000;

describe('CT Work dm5 G1 — cổng quy trình & nhịp vận hành (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, qa: U;
  let devTok = '';
  let wsId = 0, pid = 0, qaTeam = 0;
  let cfg: any;
  let rpcId = 0;
  const st: Record<string, number> = {};

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
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    const json = (text ? JSON.parse(text) : {}) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function tool(token: string, name: string, args: Record<string, unknown>) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args } }),
    });
    const body = JSON.parse(await res.text());
    if (body.error) return { isError: true, text: JSON.stringify(body.error) };
    return { isError: !!body.result.isError, text: String(body.result.content[0].text) };
  }
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k)?.id;
  const mk = async (title: string, extra: Record<string, unknown> = {}, k = 'TASK') => {
    const r = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(k), title, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data as { id: number; number: number };
  };
  const move = (u: U, n: number, status: string) => call(u, 'PATCH', `/projects/${pid}/issues/${n}`, { statusId: st[status] });
  const settings = async (s: Record<string, unknown>) => {
    const r = await call(owner, 'PATCH', `/projects/${pid}`, { settings: s });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
  };
  const backdateStatus = (issueId: number, statusId: number, ms: number) =>
    prisma.workHistory.updateMany({ where: { issueId, field: 'statusId', toValue: String(statusId) }, data: { createdAt: new Date(Date.now() - ms) } });

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev, qa] = await Promise.all(['owner', 'dev', 'qa'].map(mkUser));
    (await import('../mcp/server.js'))._resetMcpRateForTests();
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng: dự án COMPANY/CLIENT (DM), dev + qa MEMBER, bộ phận QA, token cá nhân của dev', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `DM5 ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, qa.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'DM', name: 'Solo five hats', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const u of [dev, qa]) await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role: 'MEMBER' });
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    for (const w of cfg.workflows) for (const s of w.statuses) if (w.isDefault) st[s.name] = s.id; else st[`bug:${s.name}`] = s.id;
    assert.ok(st['To Do'] && st['In Progress'] && st['Code Review'] && st.QA && st.Done, JSON.stringify(st));
    const t = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'QA', name: 'Quality', memberIds: [qa.id] });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    qaTeam = t.data.id;
    const tok = await call(dev, 'POST', '/me/api-tokens', { name: 'dev', scopes: ['read', 'write'] });
    assert.equal(tok.status, 201, JSON.stringify(tok.raw));
    devTok = tok.data.token;
  });

  // ═══ A14 Definition of Ready ═══════════════════════════════════════

  let acField = 0, sprintId = 0;
  it('A14 DoR: thẻ STORY thiếu "Acceptance criteria" ⇒ 400 qua REST, sửa hàng loạt và MCP; điền rồi qua; TASK không bị áp', async () => {
    const f = await call(owner, 'POST', `/projects/${pid}/custom-fields`, { name: 'Acceptance criteria', kind: 'TEXT', typeKeys: ['STORY'] });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    acField = f.data.id;
    // id ngoài dự án ⇒ 400
    const bad = await call(owner, 'PATCH', `/projects/${pid}`, { settings: { readyRequirements: { fieldIds: [999999] } } });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_BAD_FIELD');
    await settings({ readyRequirements: { fieldIds: [acField], typeKeys: ['STORY'] } });
    const story = await mk('Login with Google', { assigneeId: dev.id }, 'STORY');
    const r = await move(dev, story.number, 'In Progress');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_READY_REQUIREMENTS');
    assert.match(r.raw.message ?? r.raw.error?.message ?? JSON.stringify(r.raw), /Acceptance criteria/);
    // sửa hàng loạt
    const b = await call(dev, 'POST', `/projects/${pid}/issues/bulk`, { numbers: [story.number], patch: { statusId: st['In Progress'] } });
    assert.equal(b.status, 200, JSON.stringify(b.raw));
    assert.equal(b.data.failed.length, 1);
    assert.match(b.data.failed[0].error, /not Ready/);
    // MCP transition (token cá nhân)
    const m = await tool(devTok, 'transition', { project: 'DM', issue: story.number, to: 'In Progress' });
    assert.equal(m.isError, true, m.text);
    assert.match(m.text, /not Ready|WORK_READY_REQUIREMENTS/);
    // TASK không bị áp; về To Do vẫn được
    const task = await mk('Set up CI');
    assert.equal((await move(dev, task.number, 'In Progress')).status, 200);
    // điền ⇒ qua
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/issues/${story.number}/custom-values`, { values: { [acField]: 'Given a Google account When I sign in Then I see my dashboard' } })).status, 200);
    assert.equal((await move(dev, story.number, 'In Progress')).status, 200);
  });

  it('A14 prototype: requireMockupApproved ⇒ màn hình SRS gắn thẻ chưa có prototype APPROVED thì chặn', async () => {
    await settings({ readyRequirements: { fieldIds: [], typeKeys: ['STORY'], requireMockupApproved: true } });
    const s2 = await mk('Checkout screen', {}, 'STORY');
    const screen = await prisma.workSrsScreen.create({ data: { projectId: pid, name: 'Checkout', issueId: s2.id } });
    const r = await move(owner, s2.number, 'In Progress');
    assert.equal(r.code, 'WORK_READY_REQUIREMENTS', JSON.stringify(r.raw));
    await prisma.workScreenMockup.create({ data: { projectId: pid, screenId: screen.id, kind: 'LINK', url: 'https://figma.com/x', status: 'APPROVED' } });
    assert.equal((await move(owner, s2.number, 'In Progress')).status, 200);
    await settings({ readyRequirements: { fieldIds: [acField], typeKeys: ['STORY'] } });
  });

  it('A14 sprint: guards đếm thẻ chưa Ready; MCP sprint_current trả notReady', async () => {
    const sp = await call(owner, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 1' });
    assert.equal(sp.status, 201, JSON.stringify(sp.raw));
    sprintId = sp.data.id;
    const a = await mk('Reset password', { sprintId, storyPoints: 3, originalEstimateMin: 600 }, 'STORY');
    await mk('Write README', { sprintId, storyPoints: 1, originalEstimateMin: 120 });
    const g = await call(owner, 'GET', `/projects/${pid}/sprints/${sprintId}/guards`);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal(g.data.readyRule, true);
    assert.deepEqual(g.data.notReady.map((x: any) => x.number), [a.number]);
    assert.deepEqual(g.data.notReady[0].missing, ['Acceptance criteria']);
    const start = await call(owner, 'POST', `/projects/${pid}/sprints/${sprintId}/start`, { startAt: new Date(Date.now() - 4 * DAY).toISOString(), endAt: new Date(Date.now() + 10 * DAY).toISOString() });
    assert.equal(start.status, 200, JSON.stringify(start.raw));
    const m = await tool(devTok, 'sprint_current', { project: 'DM' });
    assert.equal(m.isError, false, m.text);
    assert.match(m.text, /not Ready/);
    assert.match(m.text, new RegExp(`DM-${a.number}`));
  });

  // ═══ A15 sức chứa × tập trung ═════════════════════════════════════

  it('A15 capacity: ước lượng / (sức chứa × focus) — đỏ khi vượt warnPct, đổi focus ⇒ đổi kết luận', async () => {
    // dev 2h/ngày × ~10 ngày làm việc ≈ 20h; focus 0.5 ⇒ 10h; sprint có 12h ước lượng ⇒ > 85% ⇒ RED.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/capacity/${dev.id}`, { hoursPerDay: 2 })).status, 200);
    await settings({ capacity: { focusFactor: 0.5, warnPct: 85, cautionPct: 75 } });
    let g = (await call(owner, 'GET', `/projects/${pid}/sprints/${sprintId}/guards`)).data;
    assert.equal(g.capacity.focusFactor, 0.5);
    assert.ok(g.capacity.capacityHours > 0, JSON.stringify(g.capacity));
    assert.equal(g.capacity.focusedHours, Math.round(g.capacity.capacityHours * 0.5 * 10) / 10);
    assert.equal(g.capacity.estimateHours, 12);
    assert.equal(g.capacity.level, 'RED', JSON.stringify(g.capacity));
    await settings({ capacity: { focusFactor: 1, warnPct: 200, cautionPct: 150 } });
    g = (await call(owner, 'GET', `/projects/${pid}/sprints/${sprintId}/guards`)).data;
    assert.equal(g.capacity.level, 'GREEN', JSON.stringify(g.capacity));
    // giá trị ngoài miền bị kẹp
    await settings({ capacity: { focusFactor: 7, warnPct: 85 } });
    const p = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(p.settings.capacity.focusFactor, 1);
    // planning capacity trả tóm tắt focus
    const c = await call(owner, 'GET', `/projects/${pid}/capacity?sprintId=${sprintId}`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    assert.ok(c.data.focus && typeof c.data.focus.focusFactor === 'number');
  });

  // ═══ A2 Done khi CI đỏ ═══════════════════════════════════════════

  it('A2 requireCiGreen: PR failure/pending ⇒ WORK_DONE_CI; success ⇒ Done; không PR ⇒ theo requirePr', async () => {
    await settings({ doneRequirements: { fieldIds: [], requireCiGreen: true } });
    const p = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(p.settings.doneRequirements.requireCiGreen, true);
    const i = await mk('Payment webhook');
    const pr = await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 7, title: `DM-${i.number} webhook`, state: 'OPEN', issueNumbers: [i.number], ciState: 'failure', openedAt: new Date() } });
    let r = await move(owner, i.number, 'Done');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_DONE_CI');
    await prisma.workGitPull.update({ where: { id: pr.id }, data: { ciState: 'pending' } });
    r = await move(owner, i.number, 'Done');
    assert.equal(r.code, 'WORK_DONE_CI');
    assert.match(JSON.stringify(r.raw), /still running/);
    await prisma.workGitPull.update({ where: { id: pr.id }, data: { ciState: 'success' } });
    assert.equal((await move(owner, i.number, 'Done')).status, 200);
    // PR đã đóng không merge thì bỏ qua
    const j = await mk('Closed PR only');
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 8, title: 'abandoned', state: 'CLOSED', issueNumbers: [j.number], ciState: 'failure', openedAt: new Date() } });
    assert.equal((await move(owner, j.number, 'Done')).status, 200);
    // không PR: requirePr=false ⇒ qua; true ⇒ chặn
    const k = await mk('No PR yet');
    await settings({ doneRequirements: { fieldIds: [], requireCiGreen: true, requirePr: true } });
    r = await move(owner, k.number, 'Done');
    assert.equal(r.code, 'WORK_DONE_CI', JSON.stringify(r.raw));
    await settings({ doneRequirements: { fieldIds: [], requireCiGreen: true, requirePr: false } });
    assert.equal((await move(owner, k.number, 'Done')).status, 200);
    await settings({ doneRequirements: null });
  });

  // ═══ A6 bình luận xác nhận + làm nguội ═══════════════════════════

  let wfId = 0;
  it('A6 requireComment {QA}: bình luận của dev hoặc bình luận TRƯỚC lúc vào QA không tính; bình luận QA sau đó thì qua', async () => {
    wfId = cfg.workflows.find((w: any) => w.isDefault).id;
    const all = ['To Do', 'In Progress', 'Code Review', 'QA', 'Done'].map((n) => ({ from: null, to: st[n] }));
    const set = await call(owner, 'PUT', `/projects/${pid}/workflows/${wfId}/transitions`, {
      mode: 'restricted',
      transitions: [...all, { from: st.QA, to: st.Done, rules: { requireComment: { teamIds: [qaTeam] } } }, { from: st['Code Review'], to: st.QA, rules: { minHoursInFrom: 2 } }],
    });
    assert.equal(set.status, 200, JSON.stringify(set.raw));
    const i = await mk('Order history page', { assigneeId: dev.id });
    const say = (u: U, n: number, text: string) => call(u, 'POST', `/projects/${pid}/issues/${n}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } });
    // QA bình luận khi thẻ còn In Progress — chưa tính
    await move(dev, i.number, 'In Progress');
    assert.equal((await say(qa, i.number, 'Looks good so far')).status, 201);
    await move(dev, i.number, 'QA'); // dòng "any → QA" (from null) không có luật
    let r = await move(owner, i.number, 'Done');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_TRANSITION_COMMENT');
    assert.match(JSON.stringify(r.raw), /Quality/);
    // dev bình luận — không thuộc QA
    await say(dev, i.number, 'Done from my side');
    assert.equal((await move(owner, i.number, 'Done')).code, 'WORK_TRANSITION_COMMENT');
    // QA xác nhận sau khi vào QA ⇒ qua (ADMIN cũng phải chờ bình luận như trên)
    await say(qa, i.number, 'Verified on staging: 12/12 cases pass');
    assert.equal((await move(owner, i.number, 'Done')).status, 200);
  });

  it('A6 minHoursInFrom: Code Review → QA cần ≥ 2h ở Code Review (WORK_TRANSITION_COOLOFF); lùi mốc 3h ⇒ qua', async () => {
    const i = await mk('Refund flow');
    await move(owner, i.number, 'Code Review');
    const r = await move(owner, i.number, 'QA');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_TRANSITION_COOLOFF');
    await backdateStatus(i.id, st['Code Review'], 3 * 3_600_000);
    assert.equal((await move(owner, i.number, 'QA')).status, 200);
    // teamIds rỗng ⇒ bình luận của chính người được giao không tính
    await call(owner, 'PUT', `/projects/${pid}/workflows/${wfId}/transitions`, {
      mode: 'restricted', transitions: [...['To Do', 'In Progress', 'Code Review', 'QA', 'Done'].map((n) => ({ from: null, to: st[n] })), { from: st.QA, to: st.Done, rules: { requireComment: { teamIds: [] } } }],
    });
    const j = await mk('Self check', { assigneeId: dev.id });
    await move(dev, j.number, 'QA');
    await call(dev, 'POST', `/projects/${pid}/issues/${j.number}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'I tested it' }] }] } });
    assert.equal((await move(owner, j.number, 'Done')).code, 'WORK_TRANSITION_COMMENT');
    await call(qa, 'POST', `/projects/${pid}/issues/${j.number}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Confirmed' }] }] } });
    assert.equal((await move(owner, j.number, 'Done')).status, 200);
    // luật lưu đúng dạng
    const tr = await prisma.workTransition.findFirst({ where: { workflowId: wfId, fromStatusId: st.QA, toStatusId: st.Done }, select: { rules: true } });
    assert.deepEqual(tr?.rules, { requireComment: { teamIds: [] } });
    await call(owner, 'PUT', `/projects/${pid}/workflows/${wfId}/transitions`, { mode: 'free' });
  });

  // ═══ A4 WIP chéo cột ═════════════════════════════════════════════

  it('A4 wipGuards: Code Review đủ 1 thẻ ⇒ không kéo thêm vào In Progress (WORK_WIP_LIMIT); dọn Code Review ⇒ được', async () => {
    // dọn: đưa mọi thẻ đang Code Review đi chỗ khác
    await prisma.workIssue.updateMany({ where: { projectId: pid, statusId: st['Code Review'] }, data: { statusId: st['To Do'] } });
    await settings({ wipGuards: [{ whenColumn: 'code review', blocksColumn: 'In Progress', limit: 1 }, { whenColumn: 'x', blocksColumn: 'x' }] });
    const p = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(p.settings.wipGuards.length, 1, 'luật tự trỏ về chính nó bị bỏ');
    const inReview = await mk('Waiting review');
    await move(owner, inReview.number, 'Code Review');
    const next = await mk('Next thing');
    const r = await move(dev, next.number, 'In Progress');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_WIP_LIMIT');
    assert.match(JSON.stringify(r.raw), /Code Review/);
    // vào cột khác không bị chặn
    assert.equal((await move(dev, next.number, 'QA')).status, 200);
    await move(owner, inReview.number, 'Done');
    assert.equal((await move(dev, next.number, 'In Progress')).status, 200);
    await settings({ wipGuards: null });
  });

  // ═══ A23 + A17 giai đoạn ═════════════════════════════════════════

  let stageId = 0;
  it('A23 stageGateBlocksWork: thẻ của giai đoạn NOT_STARTED không bắt đầu được; kích hoạt rồi thì được', async () => {
    const s = await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'g1-design', name: 'G1 Design', plannedStart: '2026-01-01', plannedEnd: '2026-01-10' });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    stageId = s.data.id;
    await settings({ stageGateBlocksWork: true });
    const i = await mk('ERD draft', { stageId });
    const r = await move(owner, i.number, 'In Progress');
    assert.equal(r.status, 400, JSON.stringify(r.raw));
    assert.equal(r.code, 'WORK_STAGE_NOT_ACTIVE');
    // tắt luật ⇒ qua (dự án cũ không đổi)
    await settings({ stageGateBlocksWork: false });
    const j = await mk('Not gated', { stageId });
    assert.equal((await move(owner, j.number, 'In Progress')).status, 200);
    await settings({ stageGateBlocksWork: true });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/stages/${stageId}/activate`, {})).status, 200);
    assert.equal((await move(owner, i.number, 'In Progress')).status, 200);
    await settings({ stageGateBlocksWork: false });
  });

  it('A17 ngày kế hoạch: PATCH sửa được, bắt đầu > kết thúc ⇒ 400; timeline vẽ giai đoạn, trễ ⇒ late', async () => {
    const bad = await call(owner, 'PATCH', `/projects/${pid}/stages/${stageId}`, { plannedStart: '2026-02-10', plannedEnd: '2026-02-01' });
    assert.equal(bad.status, 400);
    assert.equal(bad.code, 'WORK_BAD_DATES');
    const okp = await call(owner, 'PATCH', `/projects/${pid}/stages/${stageId}`, { plannedEnd: '2026-01-20' });
    assert.equal(okp.status, 200, JSON.stringify(okp.raw));
    assert.equal(String(okp.data.plannedEnd).slice(0, 10), '2026-01-20');
    const future = new Date(Date.now() + 30 * DAY).toISOString().slice(0, 10);
    await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'g2-build', name: 'G2 Build', plannedStart: future, plannedEnd: future });
    const tl = await call(owner, 'GET', `/projects/${pid}/timeline`);
    assert.equal(tl.status, 200, JSON.stringify(tl.raw));
    const g1 = tl.data.stages.find((x: any) => x.name === 'G1 Design');
    const g2 = tl.data.stages.find((x: any) => x.name === 'G2 Build');
    assert.equal(g1.late, true, 'quá ngày kết thúc mà chưa DONE');
    assert.equal(g2.late, false);
    assert.equal(g1.plannedStart, '2026-01-01');
  });

  // ═══ A18 cảnh báo sớm ════════════════════════════════════════════

  it('A18 JQL flaggedSince < -24h chỉ lấy thẻ bị chặn quá 1 ngày; early-warnings có BLOCKED_24H + HIGH_IDLE_48H', async () => {
    const old = await mk('Blocked by API key', { priority: 1 });
    const fresh = await mk('Just blocked');
    for (const n of [old.number, fresh.number]) assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${n}/flag`, { reason: 'waiting' })).status, 200);
    await prisma.workIssue.update({ where: { id: old.id }, data: { flaggedAt: new Date(Date.now() - 2 * DAY) } });
    await prisma.$executeRaw`UPDATE work_issues SET updated_at = now() - interval '3 days' WHERE id = ${old.id}`;
    const q = await call(owner, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('flaggedSince < -24h ORDER BY flaggedSince')}`);
    assert.equal(q.status, 200, JSON.stringify(q.raw));
    const nums = (q.data.issues ?? q.data.items ?? q.data).map((x: any) => x.number);
    assert.ok(nums.includes(old.number) && !nums.includes(fresh.number), JSON.stringify(nums));
    const w = await call(owner, 'GET', `/projects/${pid}/early-warnings`);
    assert.equal(w.status, 200, JSON.stringify(w.raw));
    const codes = w.data.warnings.map((x: any) => x.code);
    assert.ok(codes.includes('BLOCKED_24H'), JSON.stringify(codes));
    assert.ok(w.data.warnings.find((x: any) => x.code === 'BLOCKED_24H').items.some((x: any) => x.number === old.number));
    assert.ok(codes.includes('HIGH_IDLE_48H'), JSON.stringify(codes));
  });

  it('A18 burndown phẳng ≥ 3 ngày + thêm phạm vi sau Start; tuổi thẻ trên board', async () => {
    const days = [4, 3, 2, 1, 0].map((d) => new Date(Date.now() - d * DAY + 7 * 3_600_000).toISOString().slice(0, 10));
    const rem = [10, 8, 8, 8, 8];
    for (const [k, day] of days.entries()) {
      await prisma.workSprintSnapshot.upsert({
        where: { uk_work_sprint_snapshot: { sprintId, day } },
        create: { sprintId, day, totalPoints: 10, remainingPoints: rem[k] }, update: { remainingPoints: rem[k] },
      });
    }
    await mk('Late scope add', { sprintId, storyPoints: 5 }); // thêm sau khi Start
    const w = (await call(owner, 'GET', `/projects/${pid}/early-warnings`)).data;
    const flat = w.warnings.find((x: any) => x.code === 'BURNDOWN_FLAT');
    assert.ok(flat, JSON.stringify(w));
    assert.ok(flat.days >= 3, JSON.stringify(flat));
    const scope = w.warnings.find((x: any) => x.code === 'SCOPE_ADDED');
    assert.ok(scope && scope.points >= 5, JSON.stringify(w.warnings));
    // tuổi thẻ
    const aged = await mk('Sitting in progress');
    await move(owner, aged.number, 'In Progress');
    await backdateStatus(aged.id, st['In Progress'], 4 * DAY);
    const ages = await call(owner, 'GET', `/projects/${pid}/board/ages`);
    assert.equal(ages.status, 200, JSON.stringify(ages.raw));
    assert.equal(ages.data[aged.number], 4);
  });

  // ═══ A19 RAG ═════════════════════════════════════════════════════

  it('A19 RAG: 4 chiều, tổng = chiều tệ nhất; ngưỡng chỉnh được; % hoàn thành có trọng số; widget rag lưu được', async () => {
    let r = await call(owner, 'GET', `/projects/${pid}/rag`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual(r.data.dimensions.map((d: any) => d.key), ['schedule', 'scope', 'quality', 'effort']);
    assert.equal(typeof r.data.completionPct, 'number');
    // giai đoạn G1 trễ ⇒ schedule ít nhất AMBER
    assert.notEqual(r.data.dimensions.find((d: any) => d.key === 'schedule').level, 'GREEN');
    await mk('Crash on login', { priority: 1 }, 'BUG');
    await settings({ ragRules: { quality: { amber: 1, red: 2 } } });
    r = await call(owner, 'GET', `/projects/${pid}/rag`);
    const q = r.data.dimensions.find((d: any) => d.key === 'quality');
    assert.equal(q.level, 'RED', JSON.stringify(q));
    assert.equal(r.data.overall, 'RED');
    // widget rag được nhận ở dashboard
    const d = await call(owner, 'POST', `/projects/${pid}/dashboards`, { name: 'Health', widgets: [{ id: 'w1', kind: 'rag', title: '', size: 'half' }] });
    assert.ok(d.status === 201 || d.status === 200, JSON.stringify(d.raw));
  });

  // ═══ A21 biên bản họp chọn loại ══════════════════════════════════

  it('A21 biên bản: TASK/BUG/CR/QUESTION ⇒ thẻ Task, thẻ Bug, CR-n, Q-n; bấm lại không nhân đôi; MCP nhận kind', async () => {
    const start = new Date(Date.now() - 3_600_000);
    const m = await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Supervisor review', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 1_800_000).toISOString() });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    const num = m.data.number;
    const items = [
      { text: 'Add audit log table', kind: 'TASK' },
      { text: 'Login button misaligned on mobile', kind: 'BUG', assigneeId: dev.id },
      { text: 'Supervisor wants PDF export of reports', kind: 'CR' },
      { text: 'Is SSO with FPT accounts in scope?', kind: 'QUESTION' },
    ];
    const s = await call(owner, 'PUT', `/projects/${pid}/meetings/${num}/actions`, { items });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.deepEqual(s.data.actions.map((a: any) => a.kind), ['TASK', 'BUG', 'CR', 'QUESTION']);
    const c = await call(owner, 'POST', `/projects/${pid}/meetings/${num}/actions/issues`, {});
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.equal(c.data.created.length, 2);
    const bugNum = c.data.created.find((x: any) => x.kind === 'BUG').number;
    const bug = await prisma.workIssue.findFirst({ where: { projectId: pid, number: bugNum }, select: { type: { select: { key: true } }, assigneeId: true } });
    assert.equal(bug?.type.key, 'BUG');
    assert.equal(bug?.assigneeId, dev.id);
    const refs = c.data.others.map((o: any) => o.ref);
    assert.ok(refs.some((x: string) => /^CR-\d+$/.test(x)) && refs.some((x: string) => /^Q-\d+$/.test(x)), JSON.stringify(refs));
    const cr = await prisma.workChangeRequest.findFirst({ where: { projectId: pid, title: 'Supervisor wants PDF export of reports' } });
    assert.ok(cr);
    const qn = await prisma.workRaidItem.findFirst({ where: { projectId: pid, type: 'QUESTION', title: 'Is SSO with FPT accounts in scope?' } });
    assert.ok(qn);
    const again = await call(owner, 'POST', `/projects/${pid}/meetings/${num}/actions/issues`, {});
    assert.equal(again.code, 'WORK_NOTHING_TO_DO');
    const got = (await call(owner, 'GET', `/projects/${pid}/meetings/${num}`)).data;
    assert.equal(got.actionsOpen, 0);
    assert.ok(got.actions.find((a: any) => a.kind === 'CR').createdRef);
    // MCP
    const t = await tool(devTok, 'meeting_add_actions', { project: 'DM', meeting: num, actions: [{ text: 'Clarify grading rubric', kind: 'QUESTION' }] });
    assert.equal(t.isError, false, t.text);
    assert.match(t.text, /QUESTION/);
  });

  // ═══ A12 retro ═══════════════════════════════════════════════════

  it('A12 retro: trigger/verify lưu + hiện; trần 2 ⇒ WORK_RETRO_ACTION_CAP; tắt trần ⇒ được; facts có số sprint', async () => {
    const r = await call(owner, 'POST', `/projects/${pid}/retros`, { title: 'Sprint 1 retro', sprintId });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const rid = r.data.id;
    await settings({ retroActionCap: 2 });
    const a1 = await call(owner, 'POST', `/projects/${pid}/retros/${rid}/actions`, { title: 'Review PRs within 24h', trigger: 'A PR waits > 24h', verify: 'Median review time < 24h next sprint', createIssue: true });
    assert.equal(a1.status, 201, JSON.stringify(a1.raw));
    assert.equal((await call(owner, 'POST', `/projects/${pid}/retros/${rid}/actions`, { title: 'Smaller PRs', createIssue: false })).status, 201);
    const a3 = await call(owner, 'POST', `/projects/${pid}/retros/${rid}/actions`, { title: 'Third thing', createIssue: false });
    assert.equal(a3.status, 400, JSON.stringify(a3.raw));
    assert.equal(a3.code, 'WORK_RETRO_ACTION_CAP');
    const v = (await call(owner, 'GET', `/projects/${pid}/retros/${rid}`)).data;
    assert.equal(v.actionCap, 2);
    const act = v.actions.find((x: any) => x.title === 'Review PRs within 24h');
    assert.equal(act.trigger, 'A PR waits > 24h');
    assert.equal(act.verify, 'Median review time < 24h next sprint');
    const desc = await prisma.workIssue.findFirst({ where: { projectId: pid, number: a1.data.issueNumber }, select: { descriptionText: true } });
    assert.match(desc?.descriptionText ?? '', /Trigger: A PR waits/);
    await settings({ retroActionCap: 0 });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/retros/${rid}/actions`, { title: 'Third thing', createIssue: false })).status, 201);
    // facts
    const it0 = await prisma.workIssue.findFirst({ where: { projectId: pid, sprintId }, select: { id: true, number: true } });
    await prisma.workWorklog.create({ data: { issueId: it0!.id, userId: dev.id, minutes: 90, startedAt: new Date(Date.now() - DAY) } });
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 21, title: 'feat', state: 'MERGED', issueNumbers: [it0!.number], ciState: 'success', additions: 300, deletions: 50, headRef: 'feat/x', openedAt: new Date(Date.now() - 2 * DAY), mergedAt: new Date() } });
    await prisma.workGitPull.create({ data: { projectId: pid, provider: 'GITHUB', number: 22, title: 'fix', state: 'OPEN', issueNumbers: [it0!.number], ciState: 'success', additions: 10, deletions: 2, headRef: 'fix/y', openedAt: new Date(Date.now() - 2 * DAY) } });
    await prisma.workGitEvent.create({ data: { projectId: pid, provider: 'GITHUB', kind: 'push', dedupeKey: `${tag}-push-1`, ref: 'fix/y', occurredAt: new Date(Date.now() - DAY) } });
    const f = await call(owner, 'GET', `/projects/${pid}/retros/${rid}/facts`);
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    assert.equal(f.data.sprint.id, sprintId);
    assert.ok(f.data.done.issuesTotal >= 2, JSON.stringify(f.data.done));
    assert.equal(f.data.hours.logged, 1.5);
    assert.equal(f.data.ciFirstTry.withCi, 2);
    assert.equal(f.data.ciFirstTry.green, 1, 'PR có lượt đẩy sau khi mở không tính là xanh lượt đầu');
    assert.equal(f.data.ciFirstTry.pct, 50);
    assert.equal(f.data.biggestPr.number, 21);
    assert.equal(f.data.biggestPr.lines, 350);
    // MCP
    const t = await tool(devTok, 'retro_session', { project: 'DM', action: 'facts', retro: rid });
    assert.equal(t.isError, false, t.text);
    assert.match(t.text, /ciFirstTry/);
  });

  // ═══ A22 MoSCoW ══════════════════════════════════════════════════

  it('A22 MoSCoW: Must 75% effort > trần 60 ⇒ over; nâng trần 80 ⇒ hết; 0 ⇒ tắt', async () => {
    const f = await call(owner, 'POST', `/projects/${pid}/custom-fields`, {
      name: 'MoSCoW', kind: 'SELECT', typeKeys: null,
      options: [{ id: 'must', label: 'Must', color: '#dc2626' }, { id: 'should', label: 'Should', color: '#ea580c' }, { id: 'could', label: 'Could', color: '#2563eb' }, { id: 'wont', label: "Won't", color: '#64748b' }],
    });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    // máy chủ có thể tự cấp id lựa chọn ⇒ lấy id theo nhãn
    const opts = ((await call(owner, 'GET', `/projects/${pid}`)).data.customFields.find((x: any) => x.id === f.data.id).options) as Array<{ id: string; label: string }>;
    const optId = (label: string) => opts.find((o) => o.label === label)!.id;
    const sp = await call(owner, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint M' });
    const sid = sp.data.id;
    const vals = ['Must', 'Must', 'Must', 'Could'].map(optId);
    for (const [k, v] of vals.entries()) {
      const i = await mk(`Feature ${k}`, { sprintId: sid, storyPoints: 2 });
      assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${i.number}/custom-values`, { values: { [f.data.id]: v } })).status, 200);
    }
    const won = await mk("Won't do", { sprintId: sid, storyPoints: 8 });
    await call(owner, 'PUT', `/projects/${pid}/issues/${won.number}/custom-values`, { values: { [f.data.id]: optId("Won't") } });
    let m = (await call(owner, 'GET', `/projects/${pid}/moscow?sprintId=${sid}`)).data;
    assert.equal(m.enabled, true);
    assert.equal(m.mustPct, 75, JSON.stringify(m));
    assert.equal(m.cap, 60);
    assert.equal(m.over, true);
    const g = (await call(owner, 'GET', `/projects/${pid}/sprints/${sid}/guards`)).data;
    assert.equal(g.moscow.over, true);
    await settings({ moscowCapPct: 80 });
    m = (await call(owner, 'GET', `/projects/${pid}/moscow?sprintId=${sid}`)).data;
    assert.equal(m.over, false);
    await settings({ moscowCapPct: 0 });
    m = (await call(owner, 'GET', `/projects/${pid}/moscow?sprintId=${sid}`)).data;
    assert.equal(m.cap, null);
    assert.equal(m.over, false);
  });

  // ═══ A7 mẫu ══════════════════════════════════════════════════════

  it('A7 mẫu SWP391: Retest → Closed có notAssignee — dev được giao không tự đóng Bug; người khác đóng được; trần retro 2', async () => {
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SW', name: 'SWP', template: 'SWP391' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    const spid = p.data.id;
    await call(owner, 'PUT', `/projects/${spid}/members/${dev.id}`, { role: 'MEMBER' });
    const c = (await call(owner, 'GET', `/projects/${spid}`)).data;
    assert.equal(c.settings.retroActionCap, 2);
    const bugWf = c.workflows.find((w: any) => !w.isDefault);
    const sid = (n: string) => bugWf.statuses.find((s: any) => s.name === n).id;
    const tr = bugWf.transitions.find((t: any) => t.fromStatusId === sid('Retest') && t.toStatusId === sid('Closed'));
    assert.deepEqual(tr.rules, { notAssignee: true });
    const b = await call(owner, 'POST', `/projects/${spid}/issues`, { typeId: c.issueTypes.find((t: any) => t.key === 'BUG').id, title: 'NPE on save', assigneeId: dev.id });
    for (const s of ['In Progress', 'Fixed', 'Retest']) assert.equal((await call(dev, 'PATCH', `/projects/${spid}/issues/${b.data.number}`, { statusId: sid(s) })).status, 200, s);
    const self = await call(dev, 'PATCH', `/projects/${spid}/issues/${b.data.number}`, { statusId: sid('Closed') });
    assert.equal(self.code, 'WORK_TRANSITION_SELF', JSON.stringify(self.raw));
    assert.equal((await call(owner, 'PATCH', `/projects/${spid}/issues/${b.data.number}`, { statusId: sid('Closed') })).status, 200);
  });

  it('dự án cũ không có khoá nào của G1 ⇒ không luật nào chặn (kéo tự do như trước)', async () => {
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old', template: 'COMPANY' });
    const c = (await call(owner, 'GET', `/projects/${p.data.id}`)).data;
    const s = (n: string) => c.workflows.find((w: any) => w.isDefault).statuses.find((x: any) => x.name === n).id;
    const i = await call(owner, 'POST', `/projects/${p.data.id}/issues`, { typeId: c.issueTypes.find((t: any) => t.key === 'STORY').id, title: 'x' });
    await prisma.workGitPull.create({ data: { projectId: p.data.id, provider: 'GITHUB', number: 1, title: 'x', state: 'OPEN', issueNumbers: [i.data.number], ciState: 'failure', openedAt: new Date() } });
    for (const n of ['In Progress', 'Code Review', 'QA', 'Done']) assert.equal((await call(owner, 'PATCH', `/projects/${p.data.id}/issues/${i.data.number}`, { statusId: s(n) })).status, 200, n);
  });
});
