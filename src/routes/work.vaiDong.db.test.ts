/**
 * Chế độ đóng vai (27/11/2026) — MỘT tài khoản đóng 5 vai C1–C5 (HTTP thật + DB).
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.vaiDong.db.test.ts
 *
 * Kiểm: notAssignee + WORK_REVIEW_SELF so theo VAI khi dự án bật soloRoles (cùng vai bị chặn, đổi vai thì qua);
 * không có vai / dự án không bật / tắt chế độ ⇒ như cũ; agent token không đặt được vai (REST + MCP); vai ghi vào
 * lịch sử, bình luận, worklog (hat), audit; MCP `_meta["ctwork/vai"]`; nhắc trái vai qua header X-CTW-Vai-Nhac.
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
const tag = `vd${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('Chế độ đóng vai — HTTP + DB', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let me: U;
  let wsId = 0;
  let solo = 0;
  let plain = 0;
  let agentToken = '';
  let personalToken = '';

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: `SV ${name}` } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(bearer: string, method: string, path: string, body?: unknown, vai?: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}`, ...(vai !== undefined ? { 'X-CTW-Vai': vai } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, code: json.error?.code ?? json.code, raw: json, nhac: res.headers.get('x-ctw-vai-nhac') };
  }
  const as = (vai?: string) => (method: string, path: string, body?: unknown) => call(me.token, method, path, body, vai);
  const statusesOf = async (pid: number) => prisma.workStatus.findMany({ where: { workflow: { projectId: pid, isDefault: true } }, select: { id: true, name: true } });
  const typeId = async (pid: number, key: string) => (await prisma.workIssueType.findFirstOrThrow({ where: { projectId: pid, key } })).id;

  /** Thẻ STORY giao cho chính mình, Ready + Evidence đủ, đã ở In Review. `role` = option trường Role (C1–C5) hoặc null. */
  async function storyInReview(title: string, role: string | null): Promise<number> {
    const r = await as('C3')('POST', `/projects/${solo}/issues`, { typeId: await typeId(solo, 'STORY'), title, assigneeId: me.id });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const n = r.data.number as number;
    const fields = await prisma.workCustomField.findMany({ where: { projectId: solo }, select: { id: true, name: true, options: true } });
    const f = (name: string) => fields.find((x) => x.name === name)!;
    const values: Record<number, unknown> = { [f('Ready (DoR)').id]: true, [f('Evidence').id]: 'PR #7 + ảnh chụp' };
    if (role) values[f('Role (C1–C5)').id] = (f('Role (C1–C5)').options as Array<{ id: string; label: string }>).find((o) => o.label.startsWith(role))!.id;
    assert.equal((await as('C3')('PUT', `/projects/${solo}/issues/${n}/custom-values`, { values })).status, 200);
    const st = await statusesOf(solo);
    const S = (name: string) => st.find((x) => x.name === name)!.id;
    assert.equal((await as('C3')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: S('In Progress') })).status, 200);
    assert.equal((await as('C3')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: S('In Review') })).status, 200);
    return n;
  }
  const doneOf = async () => (await statusesOf(solo)).find((x) => x.name === 'Done')!.id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    me = await mkUser('solo');
    const ws = (await call(me.token, 'POST', '/workspaces', { name: `Vai ${tag}` })).data;
    wsId = ws.id;
    wsIds.push(ws.id);
    const a = await call(me.token, 'POST', `/workspaces/${wsId}/projects`, { key: 'VD', name: `Solo ${tag}`, blueprint: 'SWP391_SOLO5', groups: { docs: false, cadence: false } });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    solo = a.data.id;
    const b = await call(me.token, 'POST', `/workspaces/${wsId}/projects`, { key: 'VN', name: `Plain ${tag}`, blueprint: 'SCRUM', groups: { docs: false, cadence: false } });
    assert.equal(b.status, 201, JSON.stringify(b.raw));
    plain = b.data.id;
    // Làm nguội review 12 h của bộ SOLO ⇒ tắt để kiểm thẳng luật tác giả.
    assert.equal((await call(me.token, 'PATCH', `/projects/${solo}`, { settings: { reviewCoolOffHours: null } })).status, 200);
    const ag = await call(me.token, 'POST', `/workspaces/${wsId}/agents`, { name: 'Bot vai', model: 'gpt-6-sol', projectIds: [solo] });
    assert.equal(ag.status, 201, JSON.stringify(ag.raw));
    agentToken = ag.data.token.token;
    const pt = await call(me.token, 'POST', '/me/api-tokens', { name: 'cli vai', scopes: ['read', 'write'] });
    assert.equal(pt.status, 201, JSON.stringify(pt.raw));
    personalToken = pt.data.token;
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });

  it('bộ SOLO bật soloRoles sẵn; bộ SCRUM không; ADMIN tắt/bật được, giá trị lạ ⇒ chuẩn hoá', async () => {
    const s = async (pid: number) => ((await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } })).settings as any).soloRoles ?? null;
    assert.deepEqual(await s(solo), { enabled: true });
    assert.equal(await s(plain), null);
    assert.equal((await call(me.token, 'PATCH', `/projects/${plain}`, { settings: { soloRoles: { enabled: 'yes' } } })).status, 200);
    assert.equal(await s(plain), null);
  });

  it('header vai lạ ⇒ 400 WORK_BAD_ROLE; agent gửi vai ⇒ 403 WORK_ROLE_AGENT; agent không vai vẫn chạy', async () => {
    assert.equal((await as('C9')('GET', `/projects/${solo}`)).code, 'WORK_BAD_ROLE');
    const ag = await call(agentToken, 'GET', `/projects/${solo}`, undefined, 'C5');
    assert.equal(ag.status, 403);
    assert.equal(ag.code, 'WORK_ROLE_AGENT');
    assert.equal((await call(agentToken, 'GET', `/projects/${solo}`)).status, 200);
  });

  it('notAssignee theo vai: thẻ Role C3 — đóng vai C3 hoặc không vai ⇒ WORK_TRANSITION_SELF; đóng vai C5 ⇒ Done, lịch sử ghi C5', async () => {
    const n = await storyInReview('Đặt phòng lab', 'C3');
    const done = await doneOf();
    const same = await as('C3')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: done });
    assert.equal(same.code, 'WORK_TRANSITION_SELF');
    assert.match(same.raw.error?.message ?? same.raw.message ?? '', /acting as C3/);
    assert.equal((await as()('POST', `/projects/${solo}/issues/${n}/move`, { statusId: done })).code, 'WORK_TRANSITION_SELF', 'không vai ⇒ hành vi cũ');
    const ok = await as('C5')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: done });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    const issue = await prisma.workIssue.findFirstOrThrow({ where: { projectId: solo, number: n }, select: { id: true } });
    const h = await prisma.workHistory.findMany({ where: { issueId: issue.id, field: 'statusId' }, orderBy: { id: 'asc' }, select: { actingRole: true, actorId: true } });
    assert.deepEqual(h.map((x) => x.actingRole), ['C3', 'C3', 'C5'], 'mỗi lần chuyển ghi vai đang đóng');
    assert.ok(h.every((x) => x.actorId === me.id), 'vẫn là MỘT người thật — không user giả');
    const created = await prisma.workHistory.findFirstOrThrow({ where: { issueId: issue.id, field: 'created' }, select: { actingRole: true } });
    assert.equal(created.actingRole, 'C3');
  });

  it('thẻ không ghi Role ⇒ chặn kèm gợi ý đặt Role (không đoán từ tiêu đề)', async () => {
    const n = await storyInReview('Huỷ đặt phòng', null);
    const r = await as('C5')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: await doneOf() });
    assert.equal(r.code, 'WORK_TRANSITION_SELF');
    assert.match(r.raw.error?.message ?? r.raw.message ?? '', /Role \(C1–C5\)/);
  });

  it('tắt chế độ ⇒ đổi vai không còn tác dụng (so theo người như cũ); bật lại ⇒ qua', async () => {
    const n = await storyInReview('Duyệt đặt phòng', 'C3');
    assert.equal((await call(me.token, 'PATCH', `/projects/${solo}`, { settings: { soloRoles: { enabled: false } } })).status, 200);
    assert.equal((await as('C5')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: await doneOf() })).code, 'WORK_TRANSITION_SELF');
    assert.equal((await call(me.token, 'PATCH', `/projects/${solo}`, { settings: { soloRoles: { enabled: true } } })).status, 200);
    assert.equal((await as('C5')('POST', `/projects/${solo}/issues/${n}/move`, { statusId: await doneOf() })).status, 200);
  });

  it('WORK_REVIEW_SELF theo vai: tác giả C3 không tự quyết dưới vai C3, đổi sang C5 thì được; dự án không bật ⇒ như cũ', async () => {
    const mk = async (pid: number, vai: string | undefined, participants: unknown[]) => {
      const r = await call(me.token, 'POST', `/projects/${pid}/reviews`, { title: 'Review SRS', kind: 'DOC', method: 'INSPECTION', checklistKey: 'WIEGERS_SRS', participants }, vai);
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      return r.data.number as number;
    };
    const num = await mk(solo, 'C1', [{ userId: me.id, role: 'MODERATOR', hat: 'C1' }, { userId: me.id, role: 'AUTHOR', hat: 'C3' }, { userId: me.id, role: 'REVIEWER', hat: 'C5' }]);
    const rows = await prisma.workReviewParticipant.findMany({ where: { session: { projectId: solo, number: num } }, select: { role: true, hat: true } });
    assert.deepEqual(Object.fromEntries(rows.map((r) => [r.role, r.hat])), { MODERATOR: 'C1', AUTHOR: 'C3', REVIEWER: 'C5' });
    const self = await as('C3')('PATCH', `/projects/${solo}/reviews/${num}`, { decision: 'ACCEPT' });
    assert.equal(self.code, 'WORK_REVIEW_SELF');
    assert.match(self.raw.error?.message ?? self.raw.message ?? '', /You wrote this as C3/);
    assert.equal((await as()('PATCH', `/projects/${solo}/reviews/${num}`, { decision: 'ACCEPT' })).code, 'WORK_REVIEW_SELF', 'không vai ⇒ chặn');
    const okR = await as('C5')('PATCH', `/projects/${solo}/reviews/${num}`, { decision: 'ACCEPT' });
    assert.equal(okR.status, 200, JSON.stringify(okR.raw));
    // Dòng của chính mình không ghi hat ⇒ lấy vai đang đóng lúc mở phiên.
    const num2 = await mk(solo, 'C4', [{ userId: me.id, role: 'AUTHOR' }]);
    assert.equal((await prisma.workReviewParticipant.findFirstOrThrow({ where: { session: { projectId: solo, number: num2 } }, select: { hat: true } })).hat, 'C4');
    // Dự án KHÔNG bật chế độ: vai bị bỏ qua hoàn toàn.
    const num3 = await mk(plain, 'C1', [{ userId: me.id, role: 'AUTHOR', hat: 'C3' }]);
    assert.equal((await call(me.token, 'PATCH', `/projects/${plain}/reviews/${num3}`, { decision: 'ACCEPT' }, 'C5')).code, 'WORK_REVIEW_SELF');
  });

  it('bình luận + worklog + audit mang vai; worklog có hat tay thì giữ hat tay', async () => {
    const r = await as('C3')('POST', `/projects/${solo}/issues`, { typeId: await typeId(solo, 'TASK'), title: 'API đặt phòng' });
    const n = r.data.number;
    const c = await as('C5')('POST', `/projects/${solo}/issues/${n}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'QA: đã kiểm' }] }] } });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.equal(c.data.actingRole, 'C5');
    const list = await as()('GET', `/projects/${solo}/issues/${n}/comments`);
    assert.equal(list.data.find((x: any) => x.id === c.data.id).actingRole, 'C5');
    assert.equal((await as('C4')('POST', `/projects/${solo}/issues/${n}/worklogs`, { minutes: 30 })).status, 201);
    assert.equal((await as('C4')('POST', `/projects/${solo}/issues/${n}/worklogs`, { minutes: 15, hat: 'C2' })).status, 201);
    const logs = await prisma.workWorklog.findMany({ where: { issue: { projectId: solo, number: n } }, orderBy: { id: 'asc' }, select: { hat: true } });
    assert.deepEqual(logs.map((l) => l.hat), ['C4', 'C2']);
    const hist = await as()('GET', `/projects/${solo}/issues/${n}/history`);
    assert.ok(hist.data.some((h: any) => h.field === 'timeSpentMin' && h.actingRole === 'C4'));
    const audits = await prisma.workAuditLog.findMany({ where: { projectId: solo, action: { startsWith: 'review.' } }, select: { actingRole: true } });
    assert.ok(audits.some((a) => a.actingRole === 'C1'), 'mở phiên review dưới vai C1 ⇒ audit ghi C1');
  });

  it('nhắc trái vai: tạo test case khi đang C3 ⇒ header X-CTW-Vai-Nhac: C5; đang C5 ⇒ không nhắc', async () => {
    const wrong = await as('C3')('POST', `/projects/${solo}/tests`, {});
    assert.equal(wrong.nhac, 'C5');
    const right = await as('C5')('POST', `/projects/${solo}/tests`, {});
    assert.equal(right.nhac, null);
  });

  it('MCP: token người + _meta["ctwork/vai"] ⇒ bình luận ghi vai; agent gửi vai ⇒ từ chối', async () => {
    const r = await as('C3')('POST', `/projects/${solo}/issues`, { typeId: await typeId(solo, 'TASK'), title: 'Kiểm MCP' });
    const n = r.data.number;
    const mcp = async (token: string, body: unknown, headers: Record<string, string> = {}) => {
      const res = await fetch(`${base}/api/v1/work/mcp`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...headers }, body: JSON.stringify(body) });
      return { status: res.status, json: await res.json().catch(() => ({})) as any };
    };
    const out = await mcp(personalToken, { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'comment', arguments: { project: 'VD', issue: n, markdown: 'C2 hỏi lại tiêu chí' }, _meta: { 'ctwork/vai': 'C2' } } });
    assert.equal(out.status, 200);
    assert.equal(out.json.result?.isError, false, JSON.stringify(out.json));
    const cm = await prisma.workComment.findFirstOrThrow({ where: { issue: { projectId: solo, number: n } }, orderBy: { id: 'desc' }, select: { actingRole: true, authorId: true } });
    assert.equal(cm.actingRole, 'C2');
    assert.equal(cm.authorId, me.id);
    // Header của kết nối cũng được (khi không có _meta).
    await mcp(personalToken, { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'comment', arguments: { project: 'VD', issue: n, markdown: 'C4 ghi chú UI' } } }, { 'X-CTW-Vai': 'C4' });
    assert.equal((await prisma.workComment.findFirstOrThrow({ where: { issue: { projectId: solo, number: n } }, orderBy: { id: 'desc' }, select: { actingRole: true } })).actingRole, 'C4');
    // Agent: header ⇒ 403 cả kết nối; _meta ⇒ lỗi trong kết quả tool.
    assert.equal((await mcp(agentToken, { jsonrpc: '2.0', id: 3, method: 'tools/list' }, { 'X-CTW-Vai': 'C5' })).status, 403);
    const ag = await mcp(agentToken, { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'comment', arguments: { project: 'VD', issue: n, markdown: 'x' }, _meta: { 'ctwork/vai': 'C5' } } });
    assert.equal(ag.json.result?.isError, true);
    assert.match(ag.json.result?.content?.[0]?.text ?? '', /WORK_ROLE_AGENT/);
  });

  it('bản xuất trung thực: Project Tracking ghi "Tên (role C3 · BE)" + "1 student plays all 5 roles"', async () => {
    const { composeWeekly, loadSep490 } = await import('../services/work/fptReports.service.js');
    const d = await loadSep490(solo);
    assert.deepEqual(d.timelogs.map((r) => r.reporter).sort(), ['SV solo (role C2 · BA)', 'SV solo (role C4 · FE)'], 'giờ ghi theo vai lúc ghi');
    // Weekly Report: thẻ Role C3 đã Done tuần này ⇒ "SV solo (role C3 · BE)" — vẫn là MỘT người.
    const w = await composeWeekly(solo, new Date().toISOString().slice(0, 10));
    assert.ok(w.status.some((r) => r.inCharge === 'SV solo (role C3 · BE)'), JSON.stringify(w.status.map((r) => r.inCharge)));
    assert.ok(w.status.every((r) => !r.inCharge || r.inCharge.startsWith('SV solo')));
    const { getReportDoc } = await import('../services/work/fptReports.service.js');
    const doc = await getReportDoc(me.id, solo);
    assert.equal(doc.members.length, 1);
    assert.match(doc.members[0].role, /1 student plays all 5 roles/);
  });
});
