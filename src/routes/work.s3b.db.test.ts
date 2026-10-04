/**
 * CT Work đợt S3b — CR · sổ RAID · cuộc họp, qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.s3b.db.test.ts
 *
 * Trọng tâm: dự án cũ y nguyên (MODULE_DISABLED), khách không thấy RAID/CR nội bộ, CR duyệt
 * qua approvals.service (chữ ký + cảnh báo lệch hash), CR đã duyệt ⇒ thẻ thực hiện, việc
 * cần làm của cuộc họp ⇒ thẻ, .ics hợp lệ RFC 5545, khách thấy cuộc họp CÓ MỜI họ + biên
 * bản đã chia sẻ, portfolio đỏ/vàng theo luật mới, nhắc "review due" đúng một lần.
 * Email bị chặn (ghi lại để soi tệp đính kèm .ics).
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
const tag = `s3${Date.now().toString(36)}`;
const userIds: number[] = [];
const sent: Array<{ to: string; subject: string; html: string; attachments?: Array<{ filename: string; content: string }> }> = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt S3b: CR · RAID · họp (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, client: U, client2: U;
  let wsId = 0;
  let pid = 0, oldPid = 0, npPid = 0;
  let cfg: any;
  let issueA = 0;
  let crNum = 0, riskNum = 0, mtgNum = 0;

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
    if (ct.startsWith('text/calendar')) return { status: res.status, data: null as any, code: undefined, raw: null as any, text: await res.text(), headers: res.headers };
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json, text: '', headers: res.headers };
  }

  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async (m: any) => { sent.push({ to: m.to, subject: m.subject, html: m.html ?? '', attachments: m.attachments }); return { success: true }; };
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
      await prisma.workApiToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT mới (bật CR/RAID/họp), dự án CLIENT "cũ" (trước S3b), dự án không bật cổng khách', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `S3b ${tag}` });
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'GOV', name: 'Gov client', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.deepEqual([p.data.modules.changeRequests, p.data.modules.raid, p.data.modules.meetings], [true, true, true]);
    pid = p.data.id;
    // "Dự án cũ": tạo như CLIENT rồi đưa settings.modules về đúng bộ khoá của đợt S2b (không có khoá S3b).
    oldPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old client', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    const oldRow = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } });
    const mods = { ...((oldRow.settings as any).modules) };
    delete mods.changeRequests; delete mods.raid; delete mods.meetings;
    await prisma.workProject.update({ where: { id: oldPid }, data: { settings: { ...(oldRow.settings as object), modules: mods } } });
    npPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'NP', name: 'No portal', template: 'COMPANY', kind: 'CLIENT', modules: { clientPortal: false } })).data.id;

    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email, client2.email] })).status, 201);
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'PUT', `/projects/${npPid}/members/${client.id}`, { role: 'CLIENT' });
    await call(owner, 'PUT', `/projects/${oldPid}/members/${client.id}`, { role: 'CLIENT' });
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(cfg.permissions.viewGovernance, true);
    issueA = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Checkout page' })).data.number;
  });

  it('dự án cũ y nguyên: mọi tuyến S3b ⇒ 403 MODULE_DISABLED; khu thẻ rỗng; cổng không có họp', async () => {
    for (const path of ['/changes', '/raid', '/meetings', '/raid/top']) {
      const r = await call(owner, 'GET', `/projects/${oldPid}${path}`);
      if (path === '/raid/top') { assert.equal(r.data.enabled, false); continue; }
      assert.equal(r.status, 403, path);
      assert.equal(r.code, 'MODULE_DISABLED', path);
    }
    assert.equal((await call(owner, 'POST', `/projects/${oldPid}/changes`, { title: 'x' })).code, 'MODULE_DISABLED');
    assert.equal((await call(owner, 'POST', `/projects/${oldPid}/raid`, { type: 'RISK', title: 'x' })).code, 'MODULE_DISABLED');
    const oc = (await call(owner, 'GET', `/projects/${oldPid}`)).data;
    const oi = (await call(owner, 'POST', `/projects/${oldPid}/issues`, { typeId: typeId(oc, 'TASK'), title: 'Legacy' })).data.number;
    assert.deepEqual((await call(owner, 'GET', `/projects/${oldPid}/issues/${oi}/governance`)).data, { changeRequests: null, risks: null });
    const pm = await call(client, 'GET', `/projects/${oldPid}/portal/meetings`);
    assert.equal(pm.data.enabled, false);
    // Lịch sử luật portfolio không đổi cho dự án cũ (không có lý do S3b).
    const pf = (await call(owner, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    const old = pf.projects.find((x: any) => x.id === oldPid);
    assert.ok(!old.health.reasons.some((r: any) => /RISK|CR_/.test(r.code)));
  });

  it('khách không thấy CR/RAID/họp nội bộ: cổng ⇒ CLIENT_PORTAL_ONLY; dự án không bật cổng ⇒ WORK_INTERNAL_ONLY', async () => {
    for (const [m, path] of [['GET', '/changes'], ['GET', '/raid'], ['GET', '/raid/top'], ['GET', '/meetings'], ['POST', '/changes'], ['GET', `/issues/${issueA}/governance`]] as const) {
      const r = await call(client, m, `/projects/${pid}${path}`, m === 'POST' ? { title: 'x' } : undefined);
      assert.equal(r.status, 403, path);
      assert.equal(r.code, 'CLIENT_PORTAL_ONLY', path);
    }
    for (const path of ['/changes', '/raid', '/meetings']) {
      const r = await call(client, 'GET', `/projects/${npPid}${path}`);
      assert.equal(r.code, 'WORK_INTERNAL_ONLY', path);
    }
    // VIEWER đọc được, không ghi được.
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/raid`)).status, 200);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'x' })).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/changes`, { title: 'x' })).status, 403);
  });

  it('CR: tạo từ mẫu, phân tích ảnh hưởng, liên kết; khách chỉ duyệt CR đã chia sẻ', async () => {
    const c = await call(staff, 'POST', `/projects/${pid}/changes`, { title: 'Add PayPal checkout', reason: 'Client asked in UAT' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    crNum = c.data.number;
    assert.equal(c.data.status, 'DRAFT');
    assert.equal(c.data.key, `CR-${crNum}`);
    assert.match(JSON.stringify(c.data.descriptionJson), /Đề nghị/, 'khung mô tả từ phieu-yeu-cau-thay-doi.md');
    const u = await call(staff, 'PATCH', `/projects/${pid}/changes/${crNum}`, { impactScope: 'New payment provider', scheduleDays: 5, costAmount: 1200, costCurrency: 'usd', impactRisk: 'PCI scope', alternatives: 'Stripe only', version: c.data.version });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal(u.data.costCurrency, 'usd');
    // Bản cũ ⇒ 409, không đè.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/changes/${crNum}`, { scheduleDays: 9, version: c.data.version })).status, 409);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/links`, { issueNumber: issueA })).status, 201);
    // Đổi trạng thái duyệt bằng tay ⇒ 409.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/status`, { status: 'APPROVED' })).status, 409);
    // Khách đứng tên duyệt CR CHƯA chia sẻ ⇒ 400.
    const bad = await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/approval`, { approverIds: [owner.id, client.id], mode: 'SEQUENTIAL' });
    assert.equal(bad.code, 'WORK_APPROVER_NOT_CLIENT_VISIBLE');
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/changes/${crNum}/client-visible`, { visible: true })).status, 200);
    const a = await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/approval`, { approverIds: [owner.id, client.id], mode: 'SEQUENTIAL' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.targetType, 'CR');
    assert.equal(a.data.changeRequest.number, crNum);
    const cr = (await call(staff, 'GET', `/projects/${pid}/changes/${crNum}`)).data;
    assert.equal(cr.status, 'UNDER_REVIEW');
    assert.ok(cr.submittedAt);
    assert.equal(cr.pendingApprovalId, a.data.id);
    // Hai yêu cầu song song ⇒ 409.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/approval`, { approverIds: [owner.id] })).status, 409);
  });

  it('CR: chữ ký + lệch hash; duyệt đủ ⇒ APPROVED; khách đọc phân tích qua cổng', async () => {
    const list = (await call(staff, 'GET', `/projects/${pid}/approvals?targetType=CR`)).data;
    const aid = list[0].id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/approvals/${aid}/decide`, { decision: 'APPROVE' })).status, 200);
    // Sửa phân tích SAU khi có người ký ⇒ contentChanged (cảnh báo, không tự huỷ).
    const cur = (await call(staff, 'GET', `/projects/${pid}/changes/${crNum}`)).data;
    await call(staff, 'PATCH', `/projects/${pid}/changes/${crNum}`, { scheduleDays: 8, version: cur.version });
    const g = (await call(staff, 'GET', `/projects/${pid}/approvals/${aid}`)).data;
    assert.equal(g.contentChanged, true);
    assert.notEqual(g.currentHash, g.signedHash);
    // Trả lại ⇒ hash khớp lại.
    const cur2 = (await call(staff, 'GET', `/projects/${pid}/changes/${crNum}`)).data;
    await call(staff, 'PATCH', `/projects/${pid}/changes/${crNum}`, { scheduleDays: 5, version: cur2.version });
    assert.equal((await call(staff, 'GET', `/projects/${pid}/approvals/${aid}`)).data.contentChanged, false);
    // Khách: cổng có phân tích ảnh hưởng (không người phụ trách nội bộ, không thẻ liên kết).
    const pa = (await call(client, 'GET', `/projects/${pid}/portal/approvals/${aid}`)).data;
    assert.equal(pa.changeRequest.key, `CR-${crNum}`);
    assert.equal(pa.changeRequest.scheduleDays, 5);
    assert.equal(pa.changeRequest.impactScope, 'New payment provider');
    assert.equal(pa.changeRequest.ownerId, undefined);
    assert.equal(pa.canDecide, true);
    const d = await call(client, 'POST', `/projects/${pid}/approvals/${aid}/decide`, { decision: 'APPROVE' });
    assert.equal(d.status, 200, JSON.stringify(d.raw));
    assert.equal(d.data.status, 'APPROVED');
    const done = (await call(staff, 'GET', `/projects/${pid}/changes/${crNum}`)).data;
    assert.equal(done.status, 'APPROVED');
    assert.ok(done.decidedAt);
    assert.ok(done.suggestions.length >= 2, 'đề xuất: thẻ chính + thẻ cập nhật cho thẻ bị ảnh hưởng');
    assert.match(done.suggestions[0].title, new RegExp(`Implement CR-${crNum}`));
  });

  it('CR đã duyệt ⇒ áp dụng đề xuất tạo thẻ thực hiện; chi tiết thẻ thấy CR liên quan; Implemented; sổ CR có tổng', async () => {
    const cr = (await call(staff, 'GET', `/projects/${pid}/changes/${crNum}`)).data;
    const r = await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/implement`, { items: cr.suggestions.slice(0, 1).map((s: any) => ({ title: s.title, description: s.description, typeKey: s.typeKey })) });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.created.length, 1);
    const n = r.data.created[0].number;
    assert.ok(r.data.changeRequest.links.some((l: any) => l.role === 'IMPLEMENTS' && l.issue.number === n));
    assert.ok(!r.data.changeRequest.suggestions.some((s: any) => s.title === cr.suggestions[0].title), 'đề xuất đã áp dụng không hiện lại');
    // Thêm thẻ thực hiện KHÔNG làm lệch chữ ký (IMPLEMENTS không vào hash).
    const appr = (await call(staff, 'GET', `/projects/${pid}/approvals?targetType=CR`)).data[0];
    assert.equal(appr.contentChanged, false);
    const gov = (await call(staff, 'GET', `/projects/${pid}/issues/${n}/governance`)).data;
    assert.deepEqual(gov.changeRequests.map((c: any) => [c.number, c.role]), [[crNum, 'IMPLEMENTS']]);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/changes/${crNum}/status`, { status: 'IMPLEMENTED' })).data.status, 'IMPLEMENTED');
    // Đã làm ⇒ chỉ đọc.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/changes/${crNum}`, { scheduleDays: 1 })).status, 409);
    const book = (await call(staff, 'GET', `/projects/${pid}/changes`)).data;
    assert.equal(book.totals.approvedDays, 5);
    assert.deepEqual(book.totals.approvedCost, [{ currency: 'USD', amount: 1200 }]);
    // Khách KHÔNG xoá/sửa gì; CR không xoá được khi đã làm.
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/changes/${crNum}`)).status, 409);
  });

  it('RAID: rủi ro 4×5 ⇒ ma trận + điểm 20; lịch sử; portfolio ĐỎ; khu thẻ; top risks', async () => {
    const r = await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Payment gateway outage', probability: 4, impact: 5, response: 'MITIGATE', mitigation: 'Fallback provider', reviewDate: '2026-01-01' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    riskNum = r.data.number;
    assert.equal(r.data.score, 20);
    assert.equal(r.data.level, 'HIGH');
    assert.equal(r.data.key, `R-${riskNum}`);
    assert.equal(r.data.reviewDue, true);
    const list = (await call(staff, 'GET', `/projects/${pid}/raid`)).data;
    assert.equal(list.matrix[3][4], 1);
    assert.equal(list.highRisks, 1);
    assert.equal(list.reviewDue, 1);
    // Lọc theo ô ma trận.
    assert.deepEqual((await call(staff, 'GET', `/projects/${pid}/raid?p=4&i=5`)).data.items.map((x: any) => x.number), [riskNum]);
    // Giả định có trạng thái riêng.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'ASSUMPTION', title: 'Client provides test data', status: 'OPEN' })).code, 'VALIDATION_ERROR');
    const asm = await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'ASSUMPTION', title: 'Client provides test data' });
    assert.equal(asm.data.status, 'UNVALIDATED');
    // Sửa ⇒ lịch sử ghi từng trường.
    const up = await call(staff, 'PATCH', `/projects/${pid}/raid/${riskNum}`, { status: 'MONITORING', version: r.data.version });
    assert.ok(up.data.history.some((h: any) => h.field === 'status' && h.fromValue === 'OPEN' && h.toValue === 'MONITORING'));
    await call(staff, 'PATCH', `/projects/${pid}/raid/${riskNum}`, { status: 'OPEN' });
    // Liên kết thẻ + CR.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/raid/${riskNum}/links`, { issueNumber: issueA })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/raid/${riskNum}/links`, { crNumber: crNum })).status, 201);
    const gov = (await call(staff, 'GET', `/projects/${pid}/issues/${issueA}/governance`)).data;
    assert.deepEqual(gov.risks.map((x: any) => [x.number, x.score]), [[riskNum, 20]]);
    assert.ok(gov.changeRequests.some((c: any) => c.number === crNum && c.role === 'AFFECTED'));
    const top = (await call(staff, 'GET', `/projects/${pid}/raid/top`)).data;
    assert.equal(top.items[0].number, riskNum);
    // Portfolio: ĐỎ vì rủi ro ≥ 20.
    const pf = (await call(owner, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    const row = pf.projects.find((x: any) => x.id === pid);
    assert.equal(row.health.rag, 'RED');
    assert.ok(row.health.reasons.some((x: any) => x.code === 'RISK_CRITICAL' && x.text.includes(`R-${riskNum}`)));
    // Khách vẫn không thấy gì của RAID (portfolio cũng loại dự án cổng khách).
    assert.equal((await call(client, 'GET', `/projects/${pid}/raid/${riskNum}`)).code, 'CLIENT_PORTAL_ONLY');
  });

  it('CR chờ quyết định > 5 ngày ⇒ VÀNG (khi không có lý do đỏ)', async () => {
    // Đóng rủi ro đỏ để thấy luật vàng.
    await call(staff, 'PATCH', `/projects/${pid}/raid/${riskNum}`, { status: 'CLOSED' });
    const c2 = (await call(staff, 'POST', `/projects/${pid}/changes`, { title: 'Dark mode', useTemplate: false })).data;
    await call(staff, 'POST', `/projects/${pid}/changes/${c2.number}/status`, { status: 'SUBMITTED' });
    await prisma.workChangeRequest.updateMany({ where: { projectId: pid, number: c2.number }, data: { submittedAt: new Date(Date.now() - 6 * 86_400_000) } });
    const pf = (await call(owner, 'GET', `/workspaces/${wsId}/portfolio`)).data;
    const row = pf.projects.find((x: any) => x.id === pid);
    assert.ok(row.health.reasons.some((x: any) => x.code === 'CR_WAITING' && x.text.includes(`CR-${c2.number}`)), JSON.stringify(row.health));
    assert.equal(row.health.rag, 'AMBER', JSON.stringify(row.health.reasons));
    assert.ok(!row.health.reasons.some((x: any) => x.code === 'RISK_CRITICAL'));
    // Sổ CR: waitingDays = 6.
    const book = (await call(staff, 'GET', `/projects/${pid}/changes?status=SUBMITTED`)).data;
    assert.equal(book.items[0].waitingDays, 6);
  });

  it('nhắc "review due": đúng MỘT lần cho mỗi ngày xem lại; đổi ngày ⇒ nhắc lại', async () => {
    await call(staff, 'PATCH', `/projects/${pid}/raid/${riskNum}`, { status: 'OPEN', reviewDate: '2026-01-02' });
    const { runRaidReviewReminders } = await import('../services/work/raid.service.js');
    const before = await prisma.socialNotification.count({ where: { receiverId: staff.id } });
    const n1 = await runRaidReviewReminders();
    assert.ok(n1 >= 1);
    const after1 = await prisma.socialNotification.findMany({ where: { receiverId: staff.id }, orderBy: { id: 'desc' } });
    assert.equal(after1.length, before + 1);
    assert.match(String((after1[0].payload as any).url), new RegExp(`/raid\\?item=${riskNum}$`));
    await runRaidReviewReminders();
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: staff.id } }), before + 1, 'không nhắc lặp');
    await call(staff, 'PATCH', `/projects/${pid}/raid/${riskNum}`, { reviewDate: '2026-01-03' });
    await runRaidReviewReminders();
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: staff.id } }), before + 2, 'đổi ngày xem lại ⇒ nhắc lại');
  });

  it('họp kick-off: mẫu chương trình, mời nhân viên + khách, email kèm .ics hợp lệ; khách chưa thấy biên bản', async () => {
    sent.length = 0;
    // Khách ở dự án không bật cổng ⇒ không mời được.
    const np = await call(owner, 'POST', `/projects/${npPid}/meetings`, { title: 'x', startsAt: '2026-10-10T02:00:00Z', endsAt: '2026-10-10T03:00:00Z', attendeeIds: [client.id] });
    assert.equal(np.code, 'WORK_BAD_ATTENDEE');
    const m = await call(staff, 'POST', `/projects/${pid}/meetings`, {
      title: 'Kick-off, phase 1; scope', type: 'KICKOFF', startsAt: '2026-10-10T02:00:00Z', endsAt: '2026-10-10T03:30:00Z',
      timezone: 'Asia/Ho_Chi_Minh', meetingUrl: 'https://meet.google.com/abc-defg-hij', location: 'HQ, room 2', attendeeIds: [owner.id, client.id],
    });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    mtgNum = m.data.number;
    assert.equal(m.data.provider, 'MEET');
    assert.match(JSON.stringify(m.data.agendaJson), /Chương trình/, 'chương trình từ bien-ban-kick-off.md');
    assert.match(JSON.stringify(m.data.minutesJson), /Quyết định/);
    assert.equal(m.data.hasClients, true);
    // Email mời kèm .ics (người tạo không tự nhận).
    const toClient = sent.find((s) => s.to === client.email);
    assert.ok(toClient?.attachments?.[0], 'khách nhận .ics');
    assert.match(toClient!.html, /Client portal/);
    const ics = Buffer.from(toClient!.attachments![0].content, 'base64').toString('utf8');
    assert.match(ics, /BEGIN:VCALENDAR\r\n[\s\S]*BEGIN:VEVENT\r\n[\s\S]*END:VEVENT\r\nEND:VCALENDAR\r\n$/);
    const flat = ics.replace(/\r\n /g, '');
    assert.match(flat, /\r\nDTSTART:20261010T020000Z\r\n/);
    assert.match(flat, /\r\nDTEND:20261010T033000Z\r\n/);
    assert.match(flat, /\r\nUID:ctwork-meeting-\d+@cuongthai\.com\r\n/);
    assert.match(flat, /\r\nORGANIZER;CN="[^"]+":mailto:/);
    assert.match(flat, /\r\nSUMMARY:GOV · Kick-off\\, phase 1\\; scope\r\n/);
    assert.ok(flat.includes(`mailto:${client.email}`), 'ATTENDEE của chính người nhận có email');
    assert.ok(!flat.includes(owner.email), 'email người khác không lộ');
    for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, `dòng ${Buffer.byteLength(line)} octet`);
    assert.ok(sent.some((s) => s.to === owner.email), 'nhân viên được mời cũng nhận');
    // Cổng khách: thấy cuộc họp, CHƯA thấy chương trình/biên bản.
    const pl = (await call(client, 'GET', `/projects/${pid}/portal/meetings`)).data;
    assert.deepEqual(pl.items.map((x: any) => x.number), [mtgNum]);
    const pd = (await call(client, 'GET', `/projects/${pid}/portal/meetings/${mtgNum}`)).data;
    assert.equal(pd.shared, false);
    assert.equal(pd.minutesJson, null);
    assert.equal(pd.agendaJson, null);
    // Khách 2 KHÔNG được mời ⇒ không thấy.
    assert.deepEqual((await call(client2, 'GET', `/projects/${pid}/portal/meetings`)).data.items, []);
    assert.equal((await call(client2, 'GET', `/projects/${pid}/portal/meetings/${mtgNum}`)).status, 404);
    assert.equal((await call(client, 'GET', `/projects/${pid}/meetings/${mtgNum}`)).code, 'CLIENT_PORTAL_ONLY');
  });

  it('biên bản + việc cần làm ⇒ thẻ (không nhân đôi); chia sẻ biên bản ⇒ khách thấy; tải .ics', async () => {
    const minutes = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'We agreed the scope.' }] }] };
    const cur = (await call(staff, 'GET', `/projects/${pid}/meetings/${mtgNum}`)).data;
    const u = await call(staff, 'PATCH', `/projects/${pid}/meetings/${mtgNum}`, { minutesJson: minutes, decisions: ['Go with PayPal'], status: 'DONE', version: cur.version });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal(u.data.sequence, cur.sequence + 1, 'đổi trạng thái ⇒ SEQUENCE tăng');
    const a = await call(staff, 'PUT', `/projects/${pid}/meetings/${mtgNum}/actions`, { items: [{ text: 'Send SOW appendix', assigneeId: staff.id, dueDate: '2026-10-15' }, { text: 'Client shares test data', assigneeId: client.id }] });
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    const ci = await call(staff, 'POST', `/projects/${pid}/meetings/${mtgNum}/actions/issues`, {});
    assert.equal(ci.status, 201, JSON.stringify(ci.raw));
    assert.equal(ci.data.created.length, 2);
    const iss = (await call(staff, 'GET', `/projects/${pid}/issues/${ci.data.created[0].number}`)).data;
    assert.equal(iss.assignee?.id, staff.id);
    assert.equal(String(iss.dueDate).slice(0, 10), '2026-10-15');
    // Khách không được giao việc ⇒ thẻ thứ hai không có người làm.
    assert.equal((await call(staff, 'GET', `/projects/${pid}/issues/${ci.data.created[1].number}`)).data.assignee, null);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/meetings/${mtgNum}/actions/issues`, {})).code, 'WORK_NOTHING_TO_DO');
    assert.ok(ci.data.meeting.actions.every((x: any) => x.issue?.key));
    // Chia sẻ biên bản.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/meetings/${mtgNum}/share`, { shared: true })).status, 200);
    const pd = (await call(client, 'GET', `/projects/${pid}/portal/meetings/${mtgNum}`)).data;
    assert.equal(pd.shared, true);
    assert.match(JSON.stringify(pd.minutesJson), /agreed the scope/);
    assert.deepEqual(pd.decisions, ['Go with PayPal']);
    assert.equal(pd.actions.length, 2);
    assert.ok(!JSON.stringify(pd.actions).includes('GOV-'), 'khách không thấy mã thẻ nội bộ');
    // .ics: nhân viên (tải trực tiếp) và khách (qua cổng).
    const f = await call(staff, 'GET', `/projects/${pid}/meetings/${mtgNum}/ics`);
    assert.equal(f.status, 200);
    assert.match(f.headers.get('content-disposition') ?? '', /attachment; filename="GOV-M\d+\.ics"/);
    assert.match(f.text, /STATUS:CONFIRMED/);
    const fc = await call(client, 'GET', `/projects/${pid}/portal/meetings/${mtgNum}/ics`);
    assert.equal(fc.status, 200);
    assert.ok(fc.text.replace(/\r\n /g, '').includes(`mailto:${client.email}`));
    // Lịch cá nhân của khách có cuộc họp.
    const link = (await call(client, 'POST', '/me/calendar-link')).data;
    const feed = await fetch(`${base}/api/v1/work/calendar/${link.token}.ics`).then((r) => r.text());
    assert.match(feed.replace(/\r\n /g, ''), /SUMMARY:GOV · Kick-off/);
    assert.match(feed.replace(/\r\n /g, ''), /portal\?tab=meetings&meeting=/);
  });

  it('nhân bản tuần sau + xoá; dashboard nhận widget top_risks', async () => {
    const d = await call(staff, 'POST', `/projects/${pid}/meetings/${mtgNum}/duplicate`, {});
    assert.equal(d.status, 201);
    assert.equal(new Date(d.data.startsAt).toISOString(), '2026-10-17T02:00:00.000Z');
    assert.equal(d.data.minutesJson, null);
    assert.equal(d.data.previous.number, mtgNum);
    assert.equal(d.data.attendees.length, 2);
    assert.equal((await call(viewer, 'DELETE', `/projects/${pid}/meetings/${d.data.number}`)).status, 403);
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/meetings/${d.data.number}`)).status, 200);
    const dash = await call(owner, 'POST', `/projects/${pid}/dashboards`, { name: 'Risks', widgets: [{ kind: 'top_risks', title: 'Top risks' }] });
    assert.equal(dash.status, 201, JSON.stringify(dash.raw));
  });
});
