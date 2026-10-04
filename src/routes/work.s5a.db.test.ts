/**
 * CT Work đợt S5a — service desk & SLA, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.s5a.db.test.ts
 *
 * Trọng tâm: dự án cũ y nguyên (MODULE_DISABLED, yêu cầu cổng cũ không có SLA), khách không thấy dữ liệu SLA nội
 * bộ / ghi chú nội bộ (CLIENT_PORTAL_ONLY, bản cổng chỉ có MỤC TIÊU), khách gửi Incident tác động cao ⇒ P1,
 * first response = trả lời PUBLIC đầu tiên của đội (ghi chú nội bộ không tính), chờ khách ⇒ tạm dừng / khách trả
 * lời ⇒ chạy tiếp (kể cả qua trạng thái được cấu hình), đổi P ⇒ tính lại, vi phạm ⇒ cảnh báo ĐÚNG MỘT LẦN, CSAT chỉ
 * người gửi trả lời được, Problem + postmortem ⇒ trang Docs có dòng thời gian, báo cáo + xlsx, portfolio đỏ, báo
 * cáo tuần khách chỉ có số tổng. Lịch SLA đặt 24/7 để test không phụ thuộc giờ chạy. Email bị chặn (ghi lại).
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
const tag = `s5${Date.now().toString(36)}`;
const userIds: number[] = [];
const sent: Array<{ to: string; subject: string; html: string }> = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt S5a: service desk & SLA (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, client: U, client2: U;
  let wsId = 0, pid = 0, oldPid = 0;
  let cfg: any;
  let p1 = 0, sr = 0, qn = 0;

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
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return { status: res.status, data: null as any, code: undefined as string | undefined, raw: null as any, buf: Buffer.from(await res.arrayBuffer()) };
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, buf: null as Buffer | null };
  }

  const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });
  /** Trạng thái theo nhóm trong ĐÚNG quy trình của loại thẻ (Bug có thể dùng quy trình riêng). */
  const statusOf = async (num: number, cat: string, name?: string) => {
    const i = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: num }, select: { type: { select: { workflowId: true } } } });
    const wf = i.type.workflowId ?? (await prisma.workWorkflow.findFirstOrThrow({ where: { projectId: pid, isDefault: true } })).id;
    return (await prisma.workStatus.findFirstOrThrow({ where: { workflowId: wf, category: cat, ...(name ? { name } : {}) }, orderBy: { position: 'asc' } })).id;
  };
  const ticketOf = async (num: number) => prisma.workDeskTicket.findFirstOrThrow({ where: { issue: { projectId: pid, number: num } }, include: { events: { orderBy: [{ at: 'asc' }, { id: 'asc' }] } } });

  before(async () => {
    (emailService as any).send = async (m: any) => { sent.push({ to: m.to, subject: m.subject, html: m.html ?? '' }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, client, client2] = await Promise.all(['owner', 'staff', 'viewer', 'client', 'client2'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT mới (serviceDesk bật), dự án "cũ" (trước S5a); lịch SLA 24/7', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `S5a ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SD', name: 'Desk client', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.equal(p.data.modules.serviceDesk, true);
    pid = p.data.id;
    oldPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old client', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    const oldRow = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } });
    const mods = { ...((oldRow.settings as any).modules) };
    delete mods.serviceDesk;
    await prisma.workProject.update({ where: { id: oldPid }, data: { settings: { ...(oldRow.settings as object), modules: mods } } });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email, client2.email] })).status, 201);
    assert.equal((await call(owner, 'POST', `/projects/${oldPid}/portal/invite`, { emails: [client.email] })).status, 201);
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.deepEqual([cfg.permissions.viewDesk, cfg.permissions.workDesk, cfg.permissions.configureDesk], [true, true, true]);
    const vc = (await call(viewer, 'GET', `/projects/${pid}`)).data;
    assert.deepEqual([vc.permissions.viewDesk, vc.permissions.workDesk], [true, false]);

    // Mặc định khi chưa lưu: T2–T6 08:00–17:00 Asia/Ho_Chi_Minh, P1 30 phút / 4 giờ.
    const s0 = (await call(owner, 'GET', `/projects/${pid}/desk/settings`)).data;
    assert.equal(s0.saved, false);
    assert.equal(s0.calendar.timezone, 'Asia/Ho_Chi_Minh');
    assert.deepEqual(s0.goals.P1, { firstResponseMin: 30, resolutionMin: 240, calendar: 'BUSINESS' });
    // Chỉ ADMIN cấu hình.
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/desk/settings`, { atRiskPercent: 80 })).status, 403);
    const bad = await call(owner, 'PUT', `/projects/${pid}/desk/settings`, { goals: { P2: { firstResponseMin: 600, resolutionMin: 60 } } });
    assert.equal(bad.code, 'WORK_BAD_GOALS');
    const s1 = await call(owner, 'PUT', `/projects/${pid}/desk/settings`, {
      goals: Object.fromEntries(['P1', 'P2', 'P3', 'P4'].map((k) => [k, { calendar: 'ALWAYS' }])),
      holidays: ['2026-09-02', 'nope'.slice(0, 0) || '2026-01-01'],
    });
    assert.equal(s1.status, 200, JSON.stringify(s1.raw));
    assert.equal(s1.data.goals.P1.calendar, 'ALWAYS');
    assert.equal(s1.data.targetsText.P1.respond, '30 minutes');
  });

  it('dự án cũ y nguyên: mọi tuyến desk ⇒ MODULE_DISABLED; yêu cầu cổng cũ KHÔNG có SLA', async () => {
    for (const path of ['/desk/settings', '/desk/queue', '/desk/problems', '/desk/report']) {
      const r = await call(owner, 'GET', `/projects/${oldPid}${path}`);
      assert.equal(r.status, 403, path);
      assert.equal(r.code, 'MODULE_DISABLED', path);
    }
    assert.equal((await call(client, 'GET', `/projects/${oldPid}/portal/desk`)).data.enabled, false);
    assert.equal((await call(client, 'POST', `/projects/${oldPid}/portal/desk/requests`, { requestType: 'INCIDENT', title: 'x' })).code, 'MODULE_DISABLED');
    const r = await call(client, 'POST', `/projects/${oldPid}/portal/requests`, { kind: 'BUG', title: 'Old style bug' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(await prisma.workDeskTicket.count({ where: { issue: { projectId: oldPid } } }), 0);
    const d = (await call(owner, 'GET', `/projects/${oldPid}/issues/${r.data.number}/desk`)).data;
    assert.deepEqual(d, { enabled: false, ticket: null });
  });

  it('khách gửi Incident tác động cao + công việc dừng ⇒ P1, thấy "We\'ll respond within …"; không thấy dữ liệu nội bộ', async () => {
    const form = (await call(client, 'GET', `/projects/${pid}/portal/desk`)).data;
    assert.equal(form.enabled, true);
    assert.deepEqual(form.requestTypes.map((t: any) => t.key), ['INCIDENT', 'SERVICE_REQUEST', 'QUESTION', 'CHANGE']);
    assert.ok(form.impact.every((x: any) => x.label && !/P\d/.test(x.label)), 'khách chọn mô tả, không chọn P');
    const missing = await call(client, 'POST', `/projects/${pid}/portal/desk/requests`, { requestType: 'INCIDENT', title: 'Checkout down', impact: 'HIGH', urgency: 'HIGH' });
    assert.equal(missing.code, 'WORK_DESK_FIELDS');
    const r = await call(client, 'POST', `/projects/${pid}/portal/desk/requests`, {
      requestType: 'INCIDENT', title: 'Checkout is down for everyone', description: 'Payments fail with error 500.', impact: 'HIGH', urgency: 'HIGH',
      fields: { affected: 'Checkout page', steps: 'Add to cart → Pay' },
    });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.respondWithin, '30 minutes');
    p1 = r.data.number;
    const t = await ticketOf(p1);
    assert.deepEqual([t.priority, t.channel, t.requesterId, t.events[0].kind], ['P1', 'PORTAL', client.id, 'START']);
    const issue = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: p1 } });
    assert.equal(issue.clientVisible, true);
    assert.equal(issue.priority, 1, 'ưu tiên cũ được GIEO một lần theo P1');
    assert.match(issue.descriptionText ?? '', /Checkout page/);

    // Câu hỏi: khách không chọn được tác động ⇒ dùng mặc định của loại (P4), dù gửi HIGH/HIGH.
    const q = await call(client, 'POST', `/projects/${pid}/portal/desk/requests`, { requestType: 'QUESTION', title: 'How do I export?', impact: 'HIGH', urgency: 'HIGH' });
    qn = q.data.number;
    assert.equal((await ticketOf(qn)).priority, 'P4');

    // Khách KHÔNG vào được phần nội bộ.
    for (const path of ['/desk/queue', '/desk/settings', '/desk/problems', '/desk/report', `/issues/${p1}/desk`]) {
      const x = await call(client, 'GET', `/projects/${pid}${path}`);
      assert.equal(x.code, 'CLIENT_PORTAL_ONLY', path);
    }
    assert.equal((await call(client, 'POST', `/projects/${pid}/issues/${p1}/desk/waiting`, { waiting: true })).code, 'CLIENT_PORTAL_ONLY');
    const view = (await call(client, 'GET', `/projects/${pid}/portal/desk/requests/${p1}`)).data;
    assert.deepEqual(Object.keys(view.ticket).sort(), ['csat', 'mine', 'requestTypeName', 'resolveWithin', 'resolved', 'respondWithin', 'responded']);
    const raw = JSON.stringify(view);
    for (const leak of ['elapsed', 'BREACHED', 'AT_RISK', 'ON_TRACK', 'events', 'remaining', 'P1', 'dueAt']) assert.ok(!raw.includes(leak), `lộ ${leak}`);
    // VIEWER xem hàng đợi, không xử lý được.
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/desk/queue`)).status, 200);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/issues/${p1}/desk/waiting`, { waiting: true })).status, 403);
  });

  it('hàng đợi: P1 chưa người nhận nằm đầu, có đồng hồ; lọc Unassigned / Mine', async () => {
    const q = (await call(staff, 'GET', `/projects/${pid}/desk/queue?view=unassigned`)).data;
    assert.equal(q.items[0].number, p1);
    assert.equal(q.items[0].priority, 'P1');
    assert.equal(q.items[0].firstResponse.goalMin, 30);
    assert.equal(q.items[0].firstResponse.status, 'ON_TRACK');
    assert.ok(q.items[0].firstResponse.dueAt);
    assert.ok(q.counts.open >= 2);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${p1}`, { assigneeId: staff.id })).status, 200);
    const mine = (await call(staff, 'GET', `/projects/${pid}/desk/queue?view=mine`)).data;
    assert.deepEqual(mine.items.map((i: any) => i.number), [p1]);
  });

  it('first response: ghi chú NỘI BỘ không tính; trả lời PUBLIC đầu tiên ⇒ MET; khách không thấy ghi chú', async () => {
    await call(staff, 'POST', `/projects/${pid}/issues/${p1}/comments`, { bodyJson: doc('Internal: DB failover in progress') });
    assert.equal((await ticketOf(p1)).firstResponseAt, null);
    const pub = await call(staff, 'POST', `/projects/${pid}/issues/${p1}/comments`, { bodyJson: doc('We are on it — fix within the hour.'), visibility: 'PUBLIC' });
    assert.equal(pub.status, 201, JSON.stringify(pub.raw));
    const t = await ticketOf(p1);
    assert.ok(t.firstResponseAt);
    assert.equal(t.firstResponseById, staff.id);
    assert.equal(t.frStatus, 'MET');
    // Trả lời PUBLIC thứ hai không ghi thêm sự kiện.
    await call(staff, 'POST', `/projects/${pid}/issues/${p1}/comments`, { bodyJson: doc('Update: still working.'), visibility: 'PUBLIC' });
    assert.equal((await ticketOf(p1)).events.filter((e) => e.kind === 'FIRST_RESPONSE').length, 1);
    const d = (await call(staff, 'GET', `/projects/${pid}/issues/${p1}/desk`)).data;
    assert.equal(d.ticket.firstResponse.status, 'MET');
    assert.equal(d.ticket.firstResponseBy !== null, true);
    const cv = (await call(client, 'GET', `/projects/${pid}/portal/requests/${p1}`)).data;
    assert.ok(!JSON.stringify(cv).includes('Internal: DB failover'));
    assert.equal((await call(client, 'GET', `/projects/${pid}/portal/desk/requests/${p1}`)).data.ticket.responded, true);
  });

  it('chờ khách ⇒ tạm dừng; khách trả lời ⇒ chạy tiếp (nút + trạng thái được cấu hình)', async () => {
    const w = await call(staff, 'POST', `/projects/${pid}/issues/${p1}/desk/waiting`, { waiting: true });
    assert.equal(w.status, 200, JSON.stringify(w.raw));
    assert.equal(w.data.ticket.waiting, true);
    assert.equal(w.data.ticket.resolution.paused, true);
    assert.equal(w.data.ticket.resolution.dueAt, null);
    const waitingQ = (await call(staff, 'GET', `/projects/${pid}/desk/queue?view=waiting`)).data;
    assert.deepEqual(waitingQ.items.map((i: any) => i.number), [p1]);
    await call(client, 'POST', `/projects/${pid}/issues/${p1}/comments`, { bodyJson: doc('Here is the screenshot you asked for.') });
    let t = await ticketOf(p1);
    assert.equal(t.waiting, false);
    assert.deepEqual(t.events.map((e) => e.kind).slice(-2), ['PAUSE', 'RESUME']);

    // Trạng thái "chờ khách" do admin cấu hình (thẻ Task — quy trình mặc định, chuyển tự do): vào ⇒ PAUSE;
    // khách trả lời ⇒ RESUME + thẻ về trạng thái trước.
    const qa = await statusOf(qn, 'IN_PROGRESS', 'QA');
    const todo = await statusOf(qn, 'TODO');
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/desk/settings`, { pauseStatusIds: [qa] })).status, 200);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/issues/${qn}`, { statusId: qa })).status, 200);
    t = await ticketOf(qn);
    assert.equal(t.waiting, true);
    assert.equal(t.statusBeforeWait, todo);
    assert.equal(t.events.at(-1)!.kind, 'PAUSE');
    await call(client, 'POST', `/projects/${pid}/issues/${qn}/comments`, { bodyJson: doc('Answering your question: CSV please.') });
    t = await ticketOf(qn);
    assert.equal(t.waiting, false);
    assert.equal((await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: qn } })).statusId, todo);
    assert.deepEqual(t.events.filter((e) => e.kind === 'PAUSE' || e.kind === 'RESUME').map((e) => e.kind), ['PAUSE', 'RESUME']);
    await call(owner, 'PUT', `/projects/${pid}/desk/settings`, { pauseStatusIds: [] });
  });

  it('vi phạm ⇒ cảnh báo nội bộ ĐÚNG MỘT LẦN; đổi P ⇒ tính lại từ lúc tạo', async () => {
    const { runSlaChecks } = await import('../services/work/serviceDesk.service.js');
    // Yêu cầu dịch vụ P3 do nhân viên tạo thay khách; giả lập đã mở 3 giờ (sửa thời điểm START).
    const c = await call(staff, 'POST', `/projects/${pid}/desk/tickets`, { requestType: 'SERVICE_REQUEST', impact: 'MEDIUM', urgency: 'MEDIUM', title: 'New VPN account', requesterId: client.id, fields: { need: 'Access for Lan' } });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    sr = (await prisma.workDeskTicket.findFirstOrThrow({ where: { issue: { projectId: pid, title: 'New VPN account' } }, include: { issue: true } })).issue.number;
    assert.equal(c.data.ticket.priority, 'P3');
    await call(owner, 'PATCH', `/projects/${pid}/issues/${sr}`, { assigneeId: staff.id });
    const t0 = await ticketOf(sr);
    await prisma.workSlaEvent.updateMany({ where: { ticketId: t0.id, kind: 'START' }, data: { at: new Date(Date.now() - 3 * 3_600_000) } });
    // P3 (FR 240 phút): 180/240 = 75% ⇒ AT_RISK.
    const before = await prisma.socialNotification.count({ where: { receiverId: staff.id, type: 'WORK_ALERT' } });
    await runSlaChecks();
    let t = await ticketOf(sr);
    assert.equal(t.frStatus, 'AT_RISK');
    assert.equal(t.frAlert, 1);
    const afterRisk = await prisma.socialNotification.count({ where: { receiverId: staff.id, type: 'WORK_ALERT' } });
    assert.equal(afterRisk, before + 1);
    await runSlaChecks();
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: staff.id, type: 'WORK_ALERT' } }), afterRisk, 'AT_RISK không báo lại');

    // Lên P1 (impact HIGH + urgency HIGH): mục tiêu 30 phút tính từ LÚC TẠO ⇒ vi phạm ngay.
    const up = await call(staff, 'PATCH', `/projects/${pid}/issues/${sr}/desk`, { impact: 'HIGH', urgency: 'HIGH' });
    assert.equal(up.status, 200, JSON.stringify(up.raw));
    assert.equal(up.data.ticket.priority, 'P1');
    assert.equal(up.data.ticket.firstResponse.status, 'BREACHED');
    t = await ticketOf(sr);
    assert.deepEqual([t.events.at(-1)!.kind, t.events.at(-1)!.value], ['PRIORITY', 'P1']);
    await runSlaChecks();
    t = await ticketOf(sr);
    assert.equal(t.frAlert, 2);
    assert.equal(t.resAlert, 1); // 180/240 phút resolution của P1 ⇒ AT_RISK
    const n1 = await prisma.socialNotification.count({ where: { receiverId: staff.id, type: 'WORK_ALERT' } });
    assert.equal(n1, afterRisk + 2);
    await runSlaChecks();
    await runSlaChecks();
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: staff.id, type: 'WORK_ALERT' } }), n1, 'mỗi mốc báo đúng một lần');
    const last = await prisma.socialNotification.findFirstOrThrow({ where: { receiverId: staff.id, type: 'WORK_ALERT' }, orderBy: { id: 'desc' } });
    assert.match(JSON.stringify(last), /SLA/);
    // Khách không nhận cảnh báo nội bộ.
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: client.id, type: 'WORK_ALERT', entityId: t.issueId } }), 0);
    const br = (await call(staff, 'GET', `/projects/${pid}/desk/queue?view=breached`)).data;
    assert.ok(br.items.some((i: any) => i.number === sr));
  });

  it('đóng ⇒ mời CSAT người gửi; chỉ người gửi chấm được, một lần', async () => {
    sent.length = 0;
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/desk/requests/${p1}/csat`, { rating: 5 })).code, 'WORK_CSAT_NOT_RESOLVED');
    // Bug lifecycle: Open → Closed được phép (đóng thẳng).
    const done = await call(staff, 'PATCH', `/projects/${pid}/issues/${p1}`, { statusId: await statusOf(p1, 'DONE') });
    assert.equal(done.status, 200, JSON.stringify(done.raw));
    const t = await ticketOf(p1);
    assert.equal(t.events.at(-1)!.kind, 'RESOLVE');
    assert.ok(t.csatRequestedAt);
    assert.ok(sent.some((m) => m.to === client.email && /How did we do/.test(m.subject)), 'email mời CSAT tới người gửi');
    assert.ok(!sent.some((m) => m.to === client2.email && /How did we do/.test(m.subject)), 'khách khác không nhận');
    const v = (await call(client, 'GET', `/projects/${pid}/portal/desk/requests/${p1}`)).data.ticket;
    assert.deepEqual([v.resolved, v.csat.canAnswer], [true, true]);
    assert.equal((await call(client2, 'GET', `/projects/${pid}/portal/desk/requests/${p1}`)).data.ticket.csat.canAnswer, false);
    assert.equal((await call(client2, 'POST', `/projects/${pid}/portal/desk/requests/${p1}/csat`, { rating: 1 })).code, 'WORK_CSAT_NOT_REQUESTER');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/portal/desk/requests/${p1}/csat`, { rating: 5 })).code, 'WORK_CSAT_NOT_REQUESTER');
    const ok = await call(client, 'POST', `/projects/${pid}/portal/desk/requests/${p1}/csat`, { rating: 4, comment: 'Quick fix, thanks' });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    assert.equal(ok.data.ticket.csat.rating, 4);
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/desk/requests/${p1}/csat`, { rating: 5 })).status, 409);
    // Mở lại (Closed → Reopened) ⇒ REOPEN (đồng hồ chạy tiếp, CSAT giữ, không mời CSAT lần hai).
    const re = await call(staff, 'PATCH', `/projects/${pid}/issues/${p1}`, { statusId: await statusOf(p1, 'TODO', 'Reopened') });
    assert.equal(re.status, 200, JSON.stringify(re.raw));
    const t2 = await ticketOf(p1);
    assert.equal(t2.events.at(-1)!.kind, 'REOPEN');
    assert.equal(t2.csatRating, 4);
  });

  it('Problem gom nhiều Incident + "Create postmortem" ⇒ trang Docs có dòng thời gian từ sự kiện', async () => {
    const pr = await call(staff, 'POST', `/projects/${pid}/desk/problems`, { title: 'Payment gateway timeouts', incidentNumbers: [p1, sr] });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw));
    assert.equal(pr.data.incidents.length, 2);
    const notReq = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: cfg.issueTypes.find((t: any) => t.key === 'TASK').id, title: 'Plain task' });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/desk/problems/${pr.data.number}/incidents`, { issueNumbers: [notReq.data.number] })).code, 'WORK_DESK_NOT_REQUEST');
    assert.equal((await call(client, 'GET', `/projects/${pid}/desk/problems`)).code, 'CLIENT_PORTAL_ONLY');
    const pm = await call(staff, 'POST', `/projects/${pid}/desk/problems/${pr.data.number}/postmortem`);
    assert.equal(pm.status, 201, JSON.stringify(pm.raw));
    const page = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: pm.data.pageNumber } });
    assert.equal(page.visibility, 'INTERNAL');
    assert.equal(page.templateKey, 'bao-cao-su-co-postmortem');
    for (const want of [`SD-${p1} opened (P1)`, `SD-${p1} first response`, `SD-${p1} waiting for customer`, `SD-${p1} resolved`, `SD-${sr} first-response SLA breached`, 'PRB-1']) {
      assert.ok(page.contentText?.includes(want), `thiếu "${want}" trong dòng thời gian`);
    }
    assert.equal((await call(staff, 'POST', `/projects/${pid}/desk/problems/${pr.data.number}/postmortem`)).code, 'WORK_POSTMORTEM_EXISTS');
    const got = (await call(staff, 'GET', `/projects/${pid}/desk/problems/${pr.data.number}`)).data;
    assert.equal(got.postmortem.number, pm.data.pageNumber);
  });

  it('báo cáo SLA + xlsx; portfolio đỏ khi P1 mở đã vi phạm; báo cáo tuần khách chỉ có số tổng', async () => {
    const r = (await call(owner, 'GET', `/projects/${pid}/desk/report?months=2`)).data;
    const m = r.months.at(-1);
    assert.ok(r.cells[m].ALL.tickets >= 3);
    assert.ok(r.cells[m].P1.breaches >= 1);
    assert.equal(r.cells[m].ALL.csatAvg, 4);
    assert.ok(r.breaches.some((b: any) => b.number === sr));
    const x = await call(owner, 'GET', `/projects/${pid}/desk/report.xlsx`);
    assert.equal(x.status, 200);
    assert.equal(x.buf!.subarray(0, 2).toString(), 'PK');

    const pf = (await call(owner, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    const row = pf.projects.find((p: any) => p.id === pid);
    assert.equal(row.health.rag, 'RED');
    assert.ok(row.health.reasons.some((x: any) => x.code === 'SLA_P1_BREACHED'));
    const old = pf.projects.find((p: any) => p.id === oldPid);
    assert.ok(!old.health.reasons.some((x: any) => /^SLA_/.test(x.code)));

    const prev = (await call(owner, 'GET', `/projects/${pid}/reports/client-weekly/preview`)).data;
    assert.ok(prev.data.serviceDesk, JSON.stringify(prev).slice(0, 300));
    assert.ok(prev.data.serviceDesk.received >= 2);
    assert.match(prev.markdown, /## Support requests/);
    // Yêu cầu nhân viên tạo (chưa chia sẻ) không lọt vào số của khách; không mã/tiêu đề yêu cầu trong mục này.
    const section = prev.markdown.split('## Support requests')[1].split('\n## ')[0];
    assert.ok(!/SD-\d+|New VPN account/.test(section));
  });

  it('đường cổng cũ (/portal/requests) khi desk bật ⇒ cũng có SLA', async () => {
    const r = await call(client, 'POST', `/projects/${pid}/portal/requests`, { kind: 'BUG', title: 'Legacy form bug' });
    assert.equal(r.status, 201);
    const t = await ticketOf(r.data.number);
    assert.deepEqual([t.requestType, t.channel, t.priority], ['INCIDENT', 'PORTAL', 'P3']);
  });
});
