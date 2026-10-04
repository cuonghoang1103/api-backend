/**
 * Lớp studio đợt S1 — API qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.studio.db.test.ts
 *
 * Phủ: dự án CŨ không đổi hành vi (mô-đun tắt ⇒ MODULE_DISABLED), loại dự án +
 * mô-đun, bộ phận + hàng đợi + JQL team, giai đoạn + cổng (chặn thứ tự, ghi đè
 * có lý do), phê duyệt tuần tự/song song + hash, luật luồng chuyển, bàn giao
 * nhận/trả, chuyển thẻ sang dự án khác, cờ truncated, dựng dự án từ phiếu khách.
 * Email bị chặn (không gửi thật).
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
const tag = `ws${Date.now().toString(36)}`;
const userIds: number[] = [];
const requestIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — lớp studio S1 (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, ba: U, dev: U, leadViewer: U, member2: U, client: U, outsider: U;
  let wsId = 0;
  let oldPid = 0;
  let clPid = 0;
  let otPid = 0;
  let cl: any;
  let baTeam = 0;
  let devTeam = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, error: json.error ?? json.message, raw: json };
  }

  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const statusOf = (c: any, name: string) => c.workflows.find((w: any) => w.isDefault).statuses.find((s: any) => s.name === name).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, ba, dev, leadViewer, member2, client, outsider] = await Promise.all(
      ['owner', 'ba', 'dev', 'leadv', 'member2', 'client', 'outsider'].map(mkUser),
    );
  });

  after(async () => {
    server?.close();
    if (requestIds.length) await prisma.projectRequest.deleteMany({ where: { id: { in: requestIds } } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng không gian, thành viên, ba dự án (cũ SWP391, CLIENT, SOFTWARE)', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Studio ${tag}` });
    assert.equal(ws.status, 201);
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [ba.email, dev.email, leadViewer.email, member2.email], role: 'MEMBER' });
    // Dự án CŨ: tạo như client cũ (không kind) rồi đưa về đúng hình dạng dòng trước đợt S1.
    const old = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old SWP', template: 'SWP391' });
    assert.equal(old.status, 201);
    oldPid = old.data.id;
    assert.ok(Object.values(old.data.modules).every((v) => v === false), 'tạo không kèm kind ⇒ mô-đun tắt hết');
    const row = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid }, select: { settings: true } });
    const { modules: _m, ...legacy } = row.settings as Record<string, unknown>;
    await prisma.workProject.update({ where: { id: oldPid }, data: { kind: null, settings: legacy as object } });

    const c = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CL', name: 'Client app', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    clPid = c.data.id;
    // docs bật mặc định cho CLIENT từ đợt S2a (04/10/2026).
    assert.deepEqual([c.data.modules.teams, c.data.modules.stages, c.data.modules.approvals, c.data.modules.handoffs, c.data.modules.docs], [true, true, true, true, true]);
    const o = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OT', name: 'Other', template: 'BLANK', kind: 'SOFTWARE' });
    otPid = o.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [client.email], role: 'GUEST', projectId: clPid, projectRole: 'CLIENT' });
    await call(owner, 'PUT', `/projects/${clPid}/members/${leadViewer.id}`, { role: 'VIEWER' });
    cl = (await call(owner, 'GET', `/projects/${clPid}`)).data;
    assert.equal(cl.kind, 'CLIENT');
    assert.equal(cl.permissions.configureStudio, true);
  });

  // ─── Dự án cũ: không đổi hành vi ───────────────────────────────

  it('dự án CŨ: loại suy từ mẫu, mô-đun tắt, route studio ⇒ 403 MODULE_DISABLED (người ngoài ⇒ 404)', async () => {
    const c = await call(owner, 'GET', `/projects/${oldPid}`);
    assert.equal(c.data.kind, 'SCHOOL');
    assert.equal(c.data.kindStored, null);
    assert.ok(Object.values(c.data.modules).every((v) => v === false));
    for (const path of [`/projects/${oldPid}/stages`, `/projects/${oldPid}/approvals`, `/projects/${oldPid}/handoffs`]) {
      const r = await call(owner, 'GET', path);
      assert.equal(r.status, 403, path);
      assert.equal(r.code, 'MODULE_DISABLED', path);
    }
    assert.equal((await call(outsider, 'GET', `/projects/${oldPid}/stages`)).status, 404);
    const list = await call(owner, 'GET', `/workspaces/${wsId}/projects`);
    assert.equal(list.data.find((p: any) => p.id === oldPid).kind, 'SCHOOL');
  });

  it('dự án CŨ: thẻ tạo/sửa/kéo như trước; ghi teamId ⇒ MODULE_DISABLED; settings.modules lén ⇒ bị bỏ', async () => {
    const c = (await call(owner, 'GET', `/projects/${oldPid}`)).data;
    const s = await call(ba, 'POST', `/projects/${oldPid}/issues`, { typeId: typeId(c, 'STORY'), title: 'Legacy story' });
    assert.equal(s.status, 201);
    assert.equal(s.data.teamId, null);
    assert.equal(s.data.stageId, null);
    const mv = await call(ba, 'POST', `/projects/${oldPid}/issues/${s.data.number}/move`, { statusId: statusOf(c, 'In Progress') });
    assert.equal(mv.status, 200);
    const t = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'TMP', name: 'Temp' });
    assert.equal(t.status, 201);
    const bad = await call(owner, 'PATCH', `/projects/${oldPid}/issues/${s.data.number}`, { teamId: t.data.id });
    assert.equal(bad.status, 403);
    assert.equal(bad.code, 'MODULE_DISABLED');
    assert.equal((await call(owner, 'PATCH', `/projects/${oldPid}/issues/${s.data.number}`, { teamId: null })).status, 200);
    await call(owner, 'PATCH', `/projects/${oldPid}`, { settings: { modules: { teams: true } } });
    assert.equal((await call(owner, 'GET', `/projects/${oldPid}`)).data.modules.teams, false);
    // Luật luồng chuyển cần mô-đun.
    const wf = c.workflows.find((w: any) => w.isDefault);
    const rule = await call(owner, 'PUT', `/projects/${oldPid}/workflows/${wf.id}/transitions`, {
      mode: 'restricted', transitions: wf.statuses.map((st: any) => ({ from: null, to: st.id, rules: { requireApproval: true } })),
    });
    assert.equal(rule.status, 403);
    assert.equal(rule.code, 'MODULE_DISABLED');
    await call(owner, 'DELETE', `/workspaces/${wsId}/teams/${t.data.id}`);
    // Board/backlog: cờ mới, hình dạng cũ giữ nguyên.
    const b = await call(owner, 'GET', `/projects/${oldPid}/board`);
    assert.equal(b.data.truncated, false);
    assert.equal(b.data.total, b.data.issues.length);
    const bl = await call(owner, 'GET', `/projects/${oldPid}/backlog`);
    assert.equal(bl.data.truncated, false);
    assert.equal(bl.data.total, bl.data.issues.length);
  });

  it('chỉ ADMIN dự án đổi loại/mô-đun; mặc định theo loại chỉ khi xin', async () => {
    assert.equal((await call(ba, 'PUT', `/projects/${otPid}/studio`, { modules: { teams: true } })).status, 403);
    const r = await call(owner, 'PUT', `/projects/${otPid}/studio`, { kind: 'PERSONAL' });
    assert.equal(r.status, 200);
    assert.equal(r.data.kind, 'PERSONAL');
    assert.equal(r.data.modules.teams, false);
    const audit = await prisma.workAuditLog.findFirst({ where: { projectId: otPid, action: 'project.studio' } });
    assert.ok(audit);
  });

  // ─── Bộ phận ───────────────────────────────────────────────────

  it('bộ phận: chỉ OWNER/ADMIN tạo; khách không vào được; trùng mã 409', async () => {
    assert.equal((await call(ba, 'POST', `/workspaces/${wsId}/teams`, { key: 'BA', name: 'BA' })).status, 403);
    const b = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'ba', name: 'Business Analysis', leadIds: [ba.id] });
    assert.equal(b.status, 201);
    assert.equal(b.data.key, 'BA');
    assert.deepEqual(b.data.leadIds, [ba.id]);
    baTeam = b.data.id;
    const d = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'DEV', name: 'Engineering', leadIds: [leadViewer.id], memberIds: [dev.id] });
    devTeam = d.data.id;
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'DEV', name: 'Again' })).status, 409);
    const g = await call(owner, 'PUT', `/workspaces/${wsId}/teams/${devTeam}/members/${client.id}`, { role: 'MEMBER' });
    assert.equal(g.status, 400);
    assert.equal((await call(client, 'GET', `/workspaces/${wsId}/teams`)).status, 403);
    const list = await call(ba, 'GET', `/workspaces/${wsId}/teams`);
    assert.deepEqual(list.data.map((t: any) => t.key).sort(), ['BA', 'DEV']);
  });

  let t1 = 0;
  let t2 = 0;
  let t3 = 0;

  it('thẻ gán bộ phận; JQL team; lọc danh sách theo team', async () => {
    const mk = async (title: string, extra: object = {}) =>
      (await call(owner, 'POST', `/projects/${clPid}/issues`, { typeId: typeId(cl, 'TASK'), title, ...extra })).data;
    t1 = (await mk('Write SRS', { teamId: baTeam, assigneeId: ba.id })).number;
    t2 = (await mk('Login API', { teamId: devTeam })).number;
    t3 = (await mk('No team task')).number;
    const j = await call(ba, 'GET', `/projects/${clPid}/search?jql=${encodeURIComponent('team = BA')}`);
    assert.equal(j.status, 200, JSON.stringify(j.raw));
    assert.deepEqual(j.data.items.map((i: any) => i.number), [t1]);
    const j2 = await call(ba, 'GET', `/projects/${clPid}/search?jql=${encodeURIComponent('team IS EMPTY')}`);
    assert.deepEqual(j2.data.items.map((i: any) => i.number), [t3]);
    const l = await call(ba, 'GET', `/projects/${clPid}/issues?team=${devTeam}`);
    assert.deepEqual(l.data.items.map((i: any) => i.number), [t2]);
    // Khách không gán bộ phận.
    const cc = await call(client, 'POST', `/projects/${clPid}/issues`, { typeId: typeId(cl, 'TASK'), title: 'Client ask', teamId: baTeam });
    assert.equal(cc.status, 403);
  });

  it('hàng đợi bộ phận: lọc + phân trang; trưởng bộ phận (vai VIEWER) giao được việc', async () => {
    const q = await call(dev, 'GET', `/workspaces/${wsId}/teams/${devTeam}/queue?unassigned=true`);
    assert.equal(q.status, 200);
    assert.equal(q.data.total, 1);
    assert.equal(q.data.items[0].key, `CL-${t2}`);
    assert.equal(q.data.isLead, false);
    const issueId = q.data.items[0].id;
    const lv = await call(leadViewer, 'GET', `/workspaces/${wsId}/teams/${devTeam}/queue?limit=1&offset=0`);
    assert.equal(lv.data.isLead, true);
    // Viewer KHÔNG phải trưởng bộ phận BA ⇒ không giao được thẻ của BA.
    const notLead = await call(leadViewer, 'PUT', `/workspaces/${wsId}/teams/${baTeam}/queue/${(await prisma.workIssue.findFirstOrThrow({ where: { projectId: clPid, number: t1 } })).id}/assignee`, { assigneeId: dev.id });
    assert.equal(notLead.status, 403);
    const as = await call(leadViewer, 'PUT', `/workspaces/${wsId}/teams/${devTeam}/queue/${issueId}/assignee`, { assigneeId: dev.id });
    assert.equal(as.status, 200, JSON.stringify(as.raw));
    assert.equal(as.data.assigneeId, dev.id);
    assert.equal((await call(dev, 'GET', `/workspaces/${wsId}/teams/${devTeam}/queue?unassigned=true`)).data.total, 0);
    assert.equal((await call(outsider, 'GET', `/workspaces/${wsId}/teams/${devTeam}/queue`)).status, 404);
  });

  // ─── Bàn giao ──────────────────────────────────────────────────

  it('bàn giao BA → Dev: checklist bắt buộc, chỉ người nhận/trưởng nhận/ADMIN quyết, nhận ⇒ đổi team+người qua lịch sử', async () => {
    const h = await call(ba, 'POST', `/projects/${clPid}/issues/${t1}/handoffs`, {
      toTeamId: devTeam, toUserId: dev.id,
      checklist: [{ text: 'SRS reviewed', done: true }, { text: 'Acceptance criteria signed', done: false }],
      note: 'Ready for build',
    });
    assert.equal(h.status, 201, JSON.stringify(h.raw));
    assert.equal(h.data.fromTeamId, baTeam);
    assert.equal(h.data.fromUserId, ba.id);
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/issues/${t1}/handoffs`, { toUserId: member2.id })).status, 409);
    assert.equal((await call(member2, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/accept`, {})).status, 403);
    // Trưởng bộ phận nhưng chỉ VIEWER trong dự án ⇒ không nhận được (không sửa được thẻ).
    assert.equal((await call(leadViewer, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/accept`, {})).status, 403);
    const miss = await call(dev, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/accept`, {});
    assert.equal(miss.status, 400);
    assert.equal(miss.code, 'WORK_HANDOFF_CHECKLIST');
    const mine = await call(dev, 'GET', '/me/handoffs');
    assert.ok(mine.data.some((x: any) => x.id === h.data.id));
    const acc = await call(dev, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/accept`, { checklist: [true, true] });
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.equal(acc.data.status, 'ACCEPTED');
    const issue = (await call(dev, 'GET', `/projects/${clPid}/issues/${t1}`)).data;
    assert.equal(issue.teamId, devTeam);
    assert.equal(issue.assigneeId, dev.id);
    const hist = (await call(dev, 'GET', `/projects/${clPid}/issues/${t1}/history`)).data;
    assert.ok(hist.some((x: any) => x.field === 'teamId' && x.toValue === String(devTeam)));
    assert.ok(hist.some((x: any) => x.field === 'handoff'));
  });

  it('bàn giao trả lại: bắt buộc lý do, thẻ giữ nguyên; lịch sử bàn giao trên thẻ', async () => {
    const h = await call(dev, 'POST', `/projects/${clPid}/issues/${t1}/handoffs`, { toTeamId: baTeam, toUserId: ba.id, checklist: [{ text: 'Questions listed' }] });
    assert.equal(h.status, 201);
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/return`, { reason: ' ' })).status, 400);
    const r = await call(ba, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/return`, { reason: 'Need the API spec first' });
    assert.equal(r.status, 200);
    assert.equal(r.data.status, 'RETURNED');
    const issue = (await call(dev, 'GET', `/projects/${clPid}/issues/${t1}`)).data;
    assert.equal(issue.teamId, devTeam);
    const list = await call(dev, 'GET', `/projects/${clPid}/issues/${t1}/handoffs`);
    assert.deepEqual(list.data.map((x: any) => x.status), ['RETURNED', 'ACCEPTED']);
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/handoffs/${h.data.id}/accept`, {})).status, 409);
  });

  // ─── Giai đoạn + cổng ──────────────────────────────────────────

  let s0 = 0;
  let s1 = 0;
  let s2 = 0;

  it('giai đoạn: chỉ ADMIN tạo; stage 1 bị chặn khi stage 0 chưa DONE', async () => {
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/stages`, { slug: 'x', name: 'X' })).status, 403);
    s0 = (await call(owner, 'POST', `/projects/${clPid}/stages`, { slug: 'tiep-nhan', name: 'Intake' })).data.id;
    s1 = (await call(owner, 'POST', `/projects/${clPid}/stages`, { slug: 'khao-sat', name: 'Discovery' })).data.id;
    s2 = (await call(owner, 'POST', `/projects/${clPid}/stages`, { slug: 'de-xuat', name: 'Proposal', gateIssueNumber: t3 })).data.id;
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/stages`, { slug: 'khao-sat', name: 'Dup' })).status, 409);
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/stages/${s0}/activate`, {})).status, 200);
    const blocked = await call(owner, 'POST', `/projects/${clPid}/stages/${s1}/activate`, {});
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_STAGE_BLOCKED');
    assert.equal(blocked.raw.data.blockingStage.id, s0);
    // Gắn thẻ vào giai đoạn 0 (nội dung cổng = danh sách thẻ của giai đoạn).
    assert.equal((await call(owner, 'PATCH', `/projects/${clPid}/issues/${t3}`, { stageId: s0 })).status, 200);
    const st = await call(ba, 'GET', `/projects/${clPid}/stages`);
    assert.deepEqual(st.data.map((x: any) => x.status), ['ACTIVE', 'NOT_STARTED', 'NOT_STARTED']);
    assert.equal(st.data[0].issueCount, 1);
    assert.equal(st.data[2].gateIssueKey, `CL-${t3}`);
  });

  it('cổng: người duyệt cấu hình (viewer bị từ chối), tuần tự, không ai duyệt thay; duyệt xong ⇒ DONE ⇒ stage 1 kích hoạt được', async () => {
    assert.equal((await call(owner, 'PUT', `/projects/${clPid}/studio`, { stageGate: { approverIds: [leadViewer.id] } })).status, 400);
    const cfg = await call(owner, 'PUT', `/projects/${clPid}/studio`, { stageGate: { approverIds: [member2.id, client.id], mode: 'SEQUENTIAL' } });
    assert.deepEqual(cfg.data.stageGate, { approverIds: [member2.id, client.id], mode: 'SEQUENTIAL' });
    const rq = await call(ba, 'POST', `/projects/${clPid}/stages/${s0}/request-gate`, { description: 'All intake tasks done' });
    assert.equal(rq.status, 201, JSON.stringify(rq.raw));
    assert.equal(rq.data.stage.status, 'GATE_REVIEW');
    const aid = rq.data.approval.id;
    assert.equal(rq.data.approval.targetType, 'STAGE_GATE');
    assert.match(rq.data.approval.contentHash, /^[0-9a-f]{64}$/);
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/stages/${s0}/request-gate`, {})).status, 409);
    // Khách là người duyệt thứ 2 ⇒ chưa tới lượt.
    const early = await call(client, 'POST', `/projects/${clPid}/approvals/${aid}/decide`, { decision: 'APPROVE' });
    assert.equal(early.status, 409);
    assert.equal(early.code, 'WORK_APPROVAL_NOT_YOUR_TURN');
    // ADMIN không duyệt thay người khác.
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/approvals/${aid}/decide`, { decision: 'APPROVE' })).status, 403);
    assert.equal((await call(member2, 'POST', `/projects/${clPid}/approvals/${aid}/decide`, { decision: 'APPROVE', comment: 'ok' })).status, 200);
    const mine = await call(client, 'GET', '/me/approvals');
    assert.ok(mine.data.some((a: any) => a.id === aid));
    const fin = await call(client, 'POST', `/projects/${clPid}/approvals/${aid}/decide`, { decision: 'APPROVE' });
    assert.equal(fin.status, 200, JSON.stringify(fin.raw));
    assert.equal(fin.data.status, 'APPROVED');
    assert.equal(fin.data.contentChanged, false);
    const step = await prisma.workApprovalStep.findFirstOrThrow({ where: { approvalId: aid, approverId: client.id } });
    assert.match(step.contentHash ?? '', /^[0-9a-f]{64}$/);
    assert.ok(step.ip, 'lưu IP của người duyệt');
    const st = (await call(owner, 'GET', `/projects/${clPid}/stages`)).data;
    assert.equal(st[0].status, 'DONE');
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/stages/${s1}/activate`, {})).status, 200);
  });

  it('ghi đè thứ tự giai đoạn: cần lý do, ghi audit', async () => {
    const no = await call(owner, 'POST', `/projects/${clPid}/stages/${s2}/activate`, { override: { reason: ' ' } });
    assert.equal(no.status, 400);
    const yes = await call(owner, 'POST', `/projects/${clPid}/stages/${s2}/activate`, { override: { reason: 'Client asked to start proposal in parallel' } });
    assert.equal(yes.status, 200);
    assert.equal(yes.data.status, 'ACTIVE');
    const a = await prisma.workAuditLog.findFirst({ where: { projectId: clPid, action: 'stage.override' } });
    assert.ok(a?.summary.includes('Client asked'));
  });

  // ─── Phê duyệt thẻ ─────────────────────────────────────────────

  it('phê duyệt song song: một phiếu chống ⇒ REJECTED (cần lý do), bước còn lại SKIPPED', async () => {
    const a = await call(ba, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t2, mode: 'PARALLEL', approverIds: [member2.id, dev.id] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t2, approverIds: [dev.id] })).status, 409);
    assert.equal((await call(dev, 'POST', `/projects/${clPid}/approvals/${a.data.id}/decide`, { decision: 'REJECT' })).status, 400);
    const r = await call(dev, 'POST', `/projects/${clPid}/approvals/${a.data.id}/decide`, { decision: 'REJECT', comment: 'Missing error codes' });
    assert.equal(r.data.status, 'REJECTED');
    assert.deepEqual(r.data.steps.map((s: any) => s.decision).sort(), ['REJECTED', 'SKIPPED']);
    assert.equal(r.data.steps[0].ip, undefined, 'IP không trả ra API');
  });

  it('phê duyệt tuần tự + hash: sửa thẻ sau khi duyệt ⇒ contentChanged (không tự huỷ); huỷ chỉ người tạo/ADMIN', async () => {
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t2, approverIds: [leadViewer.id] })).status, 400, 'viewer không đứng tên duyệt');
    const a = (await call(ba, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t2, approverIds: [member2.id, dev.id] })).data;
    await call(member2, 'POST', `/projects/${clPid}/approvals/${a.id}/decide`, { decision: 'APPROVE' });
    const done = await call(dev, 'POST', `/projects/${clPid}/approvals/${a.id}/decide`, { decision: 'APPROVE' });
    assert.equal(done.data.status, 'APPROVED');
    assert.equal(done.data.signedHash, done.data.currentHash);
    await call(owner, 'PATCH', `/projects/${clPid}/issues/${t2}`, { title: 'Login API v2' });
    const after = await call(ba, 'GET', `/projects/${clPid}/approvals/${a.id}`);
    assert.equal(after.data.status, 'APPROVED');
    assert.equal(after.data.contentChanged, true);
    // Chuyển trạng thái KHÔNG làm lệch hash.
    const b = (await call(ba, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t3, approverIds: [dev.id] })).data;
    assert.equal((await call(dev, 'POST', `/projects/${clPid}/approvals/${b.id}/cancel`, {})).status, 403);
    const c = await call(owner, 'POST', `/projects/${clPid}/approvals/${b.id}/cancel`, { reason: 'wrong issue' });
    assert.equal(c.data.status, 'CANCELLED');
    const listed = await call(ba, 'GET', `/projects/${clPid}/approvals?issue=${t2}`);
    assert.equal(listed.data.length, 2);
  });

  it('luật luồng chuyển: cần phê duyệt / chỉ bộ phận X (ADMIN vượt luật bộ phận, không vượt luật phê duyệt)', async () => {
    const wf = cl.workflows.find((w: any) => w.isDefault);
    const done = statusOf(cl, 'Done');
    const prog = statusOf(cl, 'In Progress');
    const r = await call(owner, 'PUT', `/projects/${clPid}/workflows/${wf.id}/transitions`, {
      mode: 'restricted',
      transitions: wf.statuses.map((st: any) => ({
        from: null, to: st.id,
        rules: st.id === done ? { requireApproval: true } : st.id === prog ? { teamIds: [devTeam] } : null,
      })),
    });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const cfg = (await call(owner, 'GET', `/projects/${clPid}`)).data;
    assert.deepEqual(cfg.workflows.find((w: any) => w.isDefault).transitions.find((t: any) => t.toStatusId === done).rules, { requireApproval: true });
    // t3 chưa có phê duyệt nào APPROVED.
    const no = await call(owner, 'POST', `/projects/${clPid}/issues/${t3}/move`, { statusId: done });
    assert.equal(no.status, 400);
    assert.equal(no.code, 'WORK_TRANSITION_APPROVAL');
    // ba không thuộc DEV ⇒ không được kéo sang In Progress; dev được; ADMIN được.
    const nb = await call(ba, 'POST', `/projects/${clPid}/issues/${t3}/move`, { statusId: prog });
    assert.equal(nb.code, 'WORK_TRANSITION_TEAM');
    assert.equal((await call(dev, 'POST', `/projects/${clPid}/issues/${t3}/move`, { statusId: prog })).status, 200);
    // t2 có phê duyệt APPROVED nhưng nội dung đã đổi ⇒ vẫn chặn, duyệt lại thì qua.
    const stale = await call(owner, 'POST', `/projects/${clPid}/issues/${t2}/move`, { statusId: done });
    assert.equal(stale.code, 'WORK_TRANSITION_APPROVAL');
    const again = (await call(ba, 'POST', `/projects/${clPid}/approvals`, { issueNumber: t2, approverIds: [member2.id] })).data;
    await call(member2, 'POST', `/projects/${clPid}/approvals/${again.id}/decide`, { decision: 'APPROVE' });
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/issues/${t2}/move`, { statusId: done })).status, 200);
    // Trả về tự do.
    assert.equal((await call(owner, 'PUT', `/projects/${clPid}/workflows/${wf.id}/transitions`, { mode: 'free' })).status, 200);
  });

  // ─── Chuyển thẻ sang dự án khác ───────────────────────────────

  it('chuyển thẻ sang dự án khác: số mới, việc con đi theo, bình luận giữ, mã cũ ⇒ WORK_ISSUE_MOVED', async () => {
    const story = (await call(ba, 'POST', `/projects/${clPid}/issues`, { typeId: typeId(cl, 'STORY'), title: 'Movable story', teamId: baTeam })).data;
    const sub = (await call(ba, 'POST', `/projects/${clPid}/issues`, { typeId: typeId(cl, 'SUBTASK'), title: 'Sub', parentId: story.id })).data;
    await call(ba, 'POST', `/projects/${clPid}/issues/${story.number}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'keep me' }] }] } });
    assert.equal((await call(dev, 'POST', `/projects/${clPid}/issues/${story.number}/move-project`, { targetProjectId: otPid })).status, 403, 'không phải người báo/ADMIN');
    assert.equal((await call(ba, 'POST', `/projects/${clPid}/issues/${sub.number}/move-project`, { targetProjectId: otPid })).code, 'WORK_MOVE_SUBTASK');
    const mv = await call(ba, 'POST', `/projects/${clPid}/issues/${story.number}/move-project`, { targetProjectId: otPid });
    assert.equal(mv.status, 200, JSON.stringify(mv.raw));
    assert.match(mv.data.key, /^OT-\d+$/);
    assert.equal(mv.data.subtasks.length, 1);
    const old = await call(ba, 'GET', `/projects/${clPid}/issues/${story.number}`);
    assert.equal(old.status, 404);
    assert.equal(old.code, 'WORK_ISSUE_MOVED');
    assert.equal(old.raw.data.key, mv.data.key);
    const moved = await call(ba, 'GET', `/projects/${otPid}/issues/${mv.data.number}`);
    assert.equal(moved.status, 200);
    assert.equal(moved.data.teamId, null, 'dự án đích tắt mô-đun teams ⇒ bỏ bộ phận');
    assert.equal(moved.data.children.length, 1);
    const cm = await call(ba, 'GET', `/projects/${otPid}/issues/${mv.data.number}/comments`);
    assert.equal(cm.data.length, 1);
    const hist = (await call(ba, 'GET', `/projects/${otPid}/issues/${mv.data.number}/history`)).data;
    assert.ok(hist.some((h: any) => h.field === 'project' && h.fromValue === `CL-${story.number}`));
    // Người ngoài dự án đích thì chỉ thấy 404 thường.
    assert.equal((await call(client, 'GET', `/projects/${clPid}/issues/${story.number}`)).code, 'NOT_FOUND');
  });

  // ─── Dựng dự án từ phiếu khách ─────────────────────────────────

  it('phiếu khách → dự án CLIENT: bộ phận theo vai, giai đoạn theo mẫu, thẻ gán bộ phận, KHÔNG giao hết cho admin', async () => {
    const { createWorkProjectFromRequest } = await import('../services/projectRequest.service.js');
    const code = `YC-2099-${String(Date.now()).slice(-6)}`;
    const r = await prisma.projectRequest.create({
      data: { code, name: 'Test client', email: `${tag}_req@test.local`, productTypes: ['WEB'], needs: 'Build a shop', status: 'ACCEPTED', isRoleplay: true },
    });
    requestIds.push(r.id);
    const out = await createWorkProjectFromRequest(owner.id, r.id);
    assert.equal(out.alreadyExisted, false);
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: out.projectId }, select: { kind: true, settings: true, workspaceId: true } });
    assert.equal(p.kind, 'CLIENT');
    assert.equal((p.settings as any).modules.stages, true);
    const teamsN = await prisma.workTeam.count({ where: { workspaceId: p.workspaceId } });
    assert.equal(teamsN, out.counts.teams);
    assert.ok(!(await prisma.workTeam.findFirst({ where: { workspaceId: p.workspaceId, key: 'CLIENT' } })), 'khách không thành bộ phận');
    const stagesRows = await prisma.workStage.findMany({ where: { projectId: out.projectId }, orderBy: { n: 'asc' } });
    assert.equal(stagesRows.length, out.counts.stages);
    assert.equal(stagesRows[0].status, 'ACTIVE');
    assert.ok(stagesRows.every((s) => s.gateIssueId), 'mỗi giai đoạn có thẻ cổng');
    const tasks = await prisma.workIssue.findMany({ where: { projectId: out.projectId, type: { key: 'TASK' } }, select: { teamId: true, stageId: true, assigneeId: true, labels: { select: { label: { select: { name: true } } } } } });
    assert.equal(tasks.length, out.counts.tasks);
    assert.ok(tasks.every((t) => t.assigneeId === null), 'không còn giao mọi thẻ cho admin');
    assert.ok(tasks.every((t) => t.stageId !== null));
    const clientTasks = tasks.filter((t) => t.labels.some((l) => l.label.name === 'vai:client'));
    assert.ok(clientTasks.every((t) => t.teamId === null));
    assert.ok(tasks.filter((t) => !clientTasks.includes(t)).every((t) => t.teamId !== null), 'việc theo vai có bộ phận');
    // Bấm lại: idempotent; không tạo thêm bộ phận.
    const again = await createWorkProjectFromRequest(owner.id, r.id);
    assert.equal(again.alreadyExisted, true);
  });
});
