/**
 * CT Work đợt S4 — tài chính · báo cáo khách · thuyết trình · xuất trọn, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.s4.db.test.ts
 *
 * Trọng tâm: dự án cũ y nguyên (MODULE_DISABLED, ghi giờ không bị khoá), quyền đơn giá/chi phí (MEMBER /
 * VIEWER / khách không thấy), khoá worklog của tuần đã nộp/đã duyệt + mở khoá có lý do (audit), ngân sách
 * vs thực tế + EAC + cảnh báo 80/100%, mốc thanh toán DUE khi UAT được duyệt, cổng khách chỉ thấy mốc đã
 * chia sẻ, báo cáo tuần không chứa dữ liệu chưa chia sẻ, job nền không gọi LLM (không fetch ra ngoài) và
 * chỉ gửi một lần/tuần, xuất ZIP đủ bảng + khách/MEMBER không xuất được. Email bị chặn (ghi lại).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { localWeekdayHour, weekStartOf } from '../services/work/financeRules.js';
import { vnDay } from '../services/work/sprints.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `s4${Date.now().toString(36)}`;
const userIds: number[] = [];
const sent: Array<{ to: string; subject: string; html: string; text?: string }> = [];
// Kho R2 GIẢ cho xuất trọn: object trong bộ nhớ, presigned URL trỏ về tuyến /fake-r2 của chính app test.
const fakeR2 = new Map<string, Buffer>();
const fakeR2Log = { puts: [] as string[], removed: [] as string[], enabled: true };
const SECRET = `SECRET-${tag}`;

type U = { id: number; token: string; email: string };

describe('CT Work — đợt S4: tài chính · báo cáo · xuất trọn (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, lead: U, viewer: U, client: U;
  let wsId = 0, pid = 0, oldPid = 0, npPid = 0, teamId = 0;
  let cfg: any;
  let iShared = 0, iSecret = 0, iWork = 0, versionId = 0;
  let tsId = 0;
  const lastWeek = new Date(Date.parse(`${weekStartOf(vnDay())}T00:00:00Z`) - 7 * 86_400_000).toISOString().slice(0, 10);
  const at = (h: number, dayOffset = 0) => new Date(Date.parse(`${lastWeek}T00:00:00+07:00`) + dayOffset * 86_400_000 + h * 3_600_000).toISOString();

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }

  async function call(u: U | null, method: string, p: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return { status: res.status, data: null as any, code: undefined as string | undefined, raw: null as any, buf: Buffer.from(await res.arrayBuffer()), headers: res.headers };
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, buf: null as Buffer | null, headers: res.headers };
  }

  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const doneStatus = (c: any) => c.workflows[0].statuses.find((s: any) => s.category === 'DONE').id;
  const progressStatus = (c: any) => c.workflows[0].statuses.find((s: any) => s.category === 'IN_PROGRESS').id;
  const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

  before(async () => {
    const { _setExportStoreForTests } = await import('../services/work/projectExport.service.js');
    const { Readable } = await import('node:stream');
    _setExportStoreForTests({
      enabled: () => fakeR2Log.enabled,
      head: async (key) => (fakeR2.has(key) ? fakeR2.get(key)!.length : null),
      read: async (key) => { const b = fakeR2.get(key); if (!b) throw new Error('NoSuchKey'); return Readable.from([b]); },
      putFile: async (key, filePath, size) => { const b = fs.readFileSync(filePath); assert.equal(b.length, size); fakeR2.set(key, b); fakeR2Log.puts.push(key); },
      signedUrl: async (key) => `${base}/fake-r2/${encodeURIComponent(key)}`,
      remove: async (key) => { fakeR2.delete(key); fakeR2Log.removed.push(key); },
    });
    (emailService as any).send = async (m: any) => { sent.push({ to: m.to, subject: m.subject, html: m.html ?? '', text: m.text }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.get('/fake-r2/:key', (req, res) => { const b = fakeR2.get(String(req.params.key)); if (!b) { res.status(404).end(); return; } res.type('application/zip').send(b); });
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, lead, viewer, client] = await Promise.all(['owner', 'staff', 'lead', 'viewer', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    (await import('../services/work/projectExport.service.js'))._setExportStoreForTests(null);
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT mới (finance + reports bật), dự án "cũ" (trước S4), dự án không bật cổng', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `S4 ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, lead.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FIN', name: 'Finance client', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.deepEqual([p.data.modules.finance, p.data.modules.reports], [true, true]);
    pid = p.data.id;
    oldPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old client', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    const oldRow = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } });
    const mods = { ...((oldRow.settings as any).modules) };
    delete mods.finance; delete mods.reports;
    await prisma.workProject.update({ where: { id: oldPid }, data: { settings: { ...(oldRow.settings as object), modules: mods } } });
    npPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'NP', name: 'No portal', template: 'COMPANY', kind: 'CLIENT', modules: { clientPortal: false } })).data.id;

    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'PUT', `/projects/${npPid}/members/${client.id}`, { role: 'CLIENT' });
    const team = await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'DEV', name: 'Developers', memberIds: [staff.id] });
    assert.equal(team.status, 201, JSON.stringify(team.raw));
    teamId = team.data.id;
    assert.equal((await call(owner, 'PUT', `/workspaces/${wsId}/teams/${teamId}/members/${lead.id}`, { role: 'LEAD' })).status, 200);

    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.equal(cfg.permissions.manageFinance, true);
    assert.equal(cfg.permissions.exportProject, true);
    const sc = (await call(staff, 'GET', `/projects/${pid}`)).data;
    assert.deepEqual([sc.permissions.viewFinance, sc.permissions.manageFinance, sc.permissions.reviewTimesheets, sc.permissions.exportProject], [true, false, false, false]);
    const lc = (await call(lead, 'GET', `/projects/${pid}`)).data;
    assert.deepEqual([lc.permissions.manageFinance, lc.permissions.reviewTimesheets], [false, true]);
    const vc = (await call(viewer, 'GET', `/projects/${pid}`)).data;
    assert.equal(vc.permissions.viewFinance, false);

    const mk = async (title: string) => (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title })).data.number as number;
    iShared = await mk('Checkout page');
    iSecret = await mk(SECRET);
    iWork = await mk('Payment gateway');
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${iShared}/client-visible`, { visible: true })).status, 200);
  });

  it('dự án cũ y nguyên: tài chính/báo cáo ⇒ MODULE_DISABLED; ghi + xoá giờ như trước', async () => {
    for (const p of ['/finance/settings', '/finance/summary', '/finance/timesheet', '/reports/steering', '/reports/client-weekly/preview', '/present']) {
      const r = await call(owner, 'GET', `/projects/${oldPid}${p}`);
      assert.equal(r.status, 403, p);
      assert.equal(r.code, 'MODULE_DISABLED', p);
    }
    const oc = (await call(owner, 'GET', `/projects/${oldPid}`)).data;
    const n = (await call(owner, 'POST', `/projects/${oldPid}/issues`, { typeId: typeId(oc, 'TASK'), title: 'Legacy' })).data.number;
    const w = await call(owner, 'POST', `/projects/${oldPid}/issues/${n}/worklogs`, { minutes: 30, startedAt: at(10) });
    assert.equal(w.status, 201);
    assert.equal((await call(owner, 'DELETE', `/projects/${oldPid}/issues/${n}/worklogs/${w.data.id}`)).status, 200);
    const pp = (await call(client, 'GET', `/projects/${oldPid}/portal/payments`));
    assert.equal(pp.status, 404); // khách KHÔNG phải thành viên dự án cũ ⇒ không thấy dự án
  });

  it('quyền đơn giá/chi phí: chỉ ADMIN; MEMBER/VIEWER/khách không thấy', async () => {
    const rDefault = await call(owner, 'POST', `/projects/${pid}/finance/rates`, { scope: 'DEFAULT', hourlyRate: 100 });
    assert.equal(rDefault.status, 201, JSON.stringify(rDefault.raw));
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/rates`, { scope: 'TEAM', teamId, hourlyRate: 200 })).status, 201);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/finance/settings`, { currency: 'USD', budgetTotal: 700, contractValue: 10000 })).status, 200);

    for (const u of [staff, lead]) {
      for (const p of ['/finance/rates', '/finance/summary', '/finance/expenses', '/finance/payments', '/finance/export.xlsx']) {
        const r = await call(u, 'GET', `/projects/${pid}${p}`);
        assert.equal(r.status, 403, `${p}`);
        assert.equal(r.code, 'WORK_FINANCE_FORBIDDEN', p);
      }
      const s = (await call(u, 'GET', `/projects/${pid}/finance/settings`)).data;
      assert.equal(s.currency, null);
      assert.equal(s.budgetTotal, null);
      assert.equal(s.access.manage, false);
    }
    assert.equal((await call(staff, 'POST', `/projects/${pid}/finance/rates`, { scope: 'DEFAULT', hourlyRate: 1 })).code, 'WORK_FINANCE_FORBIDDEN');
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/finance/settings`)).code, 'WORK_FINANCE_FORBIDDEN');
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/finance/timesheet`)).code, 'WORK_FINANCE_FORBIDDEN');
    for (const p of ['/finance/summary', '/finance/settings', '/finance/rates', '/reports/steering', '/present', '/exports']) {
      const r = await call(client, 'GET', `/projects/${pid}${p}`);
      assert.equal(r.code, 'CLIENT_PORTAL_ONLY', p);
    }
    // Khách ở dự án KHÔNG bật cổng (không bị cách ly) cũng không thấy tiền.
    assert.equal((await call(client, 'GET', `/projects/${npPid}/finance/summary`)).code, 'WORK_FINANCE_FORBIDDEN');
    assert.equal((await call(client, 'GET', `/projects/${npPid}/finance/settings`)).code, 'WORK_FINANCE_FORBIDDEN');
    // Bảng giờ của người khác: MEMBER không xem được.
    assert.equal((await call(staff, 'GET', `/projects/${pid}/finance/timesheet?userId=${owner.id}`)).status, 403);
  });

  it('timesheet tuần: nộp ⇒ khoá; tự duyệt bị chặn; lead duyệt ⇒ chụp đơn giá; mở khoá cần lý do + audit', async () => {
    const w1 = await call(staff, 'POST', `/projects/${pid}/issues/${iWork}/worklogs`, { minutes: 120, startedAt: at(10) });
    assert.equal(w1.status, 201, JSON.stringify(w1.raw));
    const w2 = await call(staff, 'POST', `/projects/${pid}/issues/${iShared}/worklogs`, { minutes: 60, startedAt: at(11, 1) });
    assert.equal(w2.status, 201);
    const view = (await call(staff, 'GET', `/projects/${pid}/finance/timesheet?week=${lastWeek}`)).data;
    assert.equal(view.totalMin, 180);
    assert.equal(view.can.submit, true);
    assert.equal(view.timesheet, null);

    const sub = await call(staff, 'POST', `/projects/${pid}/finance/timesheets/submit`, { weekStart: lastWeek, note: 'Sprint 1' });
    assert.equal(sub.status, 201, JSON.stringify(sub.raw));
    tsId = sub.data.id;
    assert.equal(sub.data.status, 'SUBMITTED');
    assert.equal(sub.data.approvedCost, undefined); // MEMBER không thấy tiền
    const locked = await call(staff, 'POST', `/projects/${pid}/issues/${iWork}/worklogs`, { minutes: 15, startedAt: at(9, 2) });
    assert.equal(locked.status, 423);
    assert.equal(locked.code, 'WORK_TIMESHEET_LOCKED');
    // Tuần khác không bị khoá.
    const other = await call(staff, 'POST', `/projects/${pid}/issues/${iWork}/worklogs`, { minutes: 15, startedAt: new Date().toISOString() });
    assert.equal(other.status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/approve`)).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/approve`)).code, 'WORK_FINANCE_FORBIDDEN');

    // Lead của bộ phận DEV thấy hàng đợi (giờ, không tiền) và duyệt.
    const q = (await call(lead, 'GET', `/projects/${pid}/finance/timesheets?status=SUBMITTED`)).data;
    assert.ok(q.items.some((t: any) => t.id === tsId));
    assert.ok(q.items.every((t: any) => !('approvedCost' in t)));
    const ap = await call(lead, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/approve`);
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    assert.equal(ap.data.minutes, 180);
    const lines = await prisma.workTimesheetLine.findMany({ where: { timesheetId: tsId } });
    assert.equal(lines.length, 2);
    assert.ok(lines.every((l) => l.rate === 200 && l.rateSource === 'TEAM'));
    assert.equal(lines.reduce((s, l) => s + (l.cost ?? 0), 0), 600);

    // Tuần đã duyệt: ghi/xoá đều khoá, kể cả ADMIN.
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/issues/${iWork}/worklogs/${w1.data.id}`)).code, 'WORK_TIMESHEET_LOCKED');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/withdraw`)).status, 409);
    assert.equal((await call(lead, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/reopen`, { reason: 'Need to fix hours' })).code, 'WORK_FINANCE_FORBIDDEN');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/reopen`, { reason: ' ' })).code, 'WORK_REOPEN_REASON');
    const re = await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/reopen`, { reason: 'Wrong issue on Tuesday' });
    assert.equal(re.status, 200);
    assert.equal(await prisma.workTimesheetLine.count({ where: { timesheetId: tsId } }), 0);
    const audit = await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'timesheet.reopen' } });
    assert.match(audit!.summary, /Wrong issue on Tuesday/);
    assert.equal((audit!.detail as any).approvedCostBefore, 600);
    // Mở khoá rồi thì sửa được; nộp lại và ADMIN duyệt.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/issues/${iWork}/worklogs`, { minutes: 60, startedAt: at(14, 2) })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/finance/timesheets/submit`, { weekStart: lastWeek })).data.status, 'SUBMITTED');
    // Trả lại cần lý do.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/return`, { reason: '' })).code, 'WORK_RETURN_REASON');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/timesheets/${tsId}/approve`)).status, 200);
  });

  it('ngân sách vs thực tế + EAC + cảnh báo 80% rồi 100% (mỗi ngưỡng một lần)', async () => {
    let s = (await call(owner, 'GET', `/projects/${pid}/finance/summary`)).data;
    assert.equal(s.currency, 'USD');
    assert.equal(s.summary.laborCost, 800); // 4h × 200
    assert.equal(s.summary.bac, 700);
    assert.ok(s.summary.percentUsed >= 100);
    assert.ok(s.summary.alerts.includes('OVER'));
    assert.match(s.formula, /EAC = BAC ÷ CPI/);
    assert.equal(s.approvedMinutes, 240);
    // Nâng ngân sách ⇒ ngưỡng về 80, rồi thêm chi phí khác ⇒ vượt 100 lần nữa.
    await call(owner, 'PUT', `/projects/${pid}/finance/settings`, { budgetTotal: 1000 });
    s = (await call(owner, 'GET', `/projects/${pid}/finance/summary`)).data;
    assert.equal(s.summary.alertLevel, 80);
    const e = await call(owner, 'POST', `/projects/${pid}/finance/expenses`, { spentOn: vnDay(), category: 'EQUIPMENT', description: 'Test devices', amount: 250 });
    assert.equal(e.status, 201);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/budget-lines`, { name: 'Build', category: 'LABOR', amount: 900 })).status, 201);
    s = (await call(owner, 'GET', `/projects/${pid}/finance/summary`)).data;
    assert.equal(s.summary.actual, 1050);
    assert.equal(s.summary.expenseCost, 250);
    assert.equal(s.byCategory.find((c: any) => c.category === 'EQUIPMENT').actual, 250);
    assert.equal(s.summary.eacMethod === null || ['CPI', 'BURN_RATE'].includes(s.summary.eacMethod), true);
    const alerts = await prisma.workAuditLog.findMany({ where: { projectId: pid, action: 'finance.alert' }, orderBy: { id: 'asc' } });
    assert.ok(alerts.length >= 2, 'cảnh báo vượt ngân sách được ghi');
    assert.match(alerts[alerts.length - 1].summary, /Budget exceeded/);
    // Xuất kế toán .xlsx
    const x = await call(owner, 'GET', `/projects/${pid}/finance/export.xlsx`);
    assert.equal(x.status, 200);
    const zip = new AdmZip(x.buf!);
    assert.ok(zip.getEntries().some((en) => en.entryName === 'xl/worksheets/sheet4.xml'));
    assert.match(zip.readAsText('xl/workbook.xml'), /Approved timesheets/);
    assert.match(zip.readAsText('xl/worksheets/sheet1.xml'), /does not issue invoices/);
  });

  it('mốc thanh toán: UAT được duyệt ⇒ DUE + báo PM; khách chỉ thấy mốc đã chia sẻ, không đơn giá/chi phí', async () => {
    versionId = (await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v1.0', releaseDate: '2026-12-01' })).data.id;
    const m1 = await call(owner, 'POST', `/projects/${pid}/finance/payments`, { name: 'Acceptance of v1.0', percent: 40, trigger: 'UAT', versionId, clientVisible: true, dueDate: '2026-12-15' });
    assert.equal(m1.status, 201, JSON.stringify(m1.raw));
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/payments`, { name: `Internal bonus ${SECRET}`, amount: 99, clientVisible: false })).status, 201);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/payments`, { name: 'Bad', amount: 1, trigger: 'UAT' })).code, 'WORK_BAD_PAYMENT');
    // INVOICED cần số hoá đơn từ hệ thống bên ngoài.
    assert.equal((await call(owner, 'POST', `/projects/${pid}/finance/payments/2/status`, { status: 'INVOICED' })).code, 'WORK_INVOICE_NUMBER');

    const uat = await call(owner, 'POST', `/projects/${pid}/portal/uat`, { issueNumbers: [iShared], versionId, approverIds: [client.id] });
    assert.equal(uat.status, 201, JSON.stringify(uat.raw));
    const dec = await call(client, 'POST', `/projects/${pid}/portal/uat/${uat.data.id}/decide`, { decision: 'APPROVE', comment: 'OK' });
    assert.equal(dec.status, 200, JSON.stringify(dec.raw));
    await wait();
    const list = (await call(owner, 'GET', `/projects/${pid}/finance/payments`)).data;
    const m = list.items.find((x: any) => x.number === 1);
    assert.equal(m.status, 'DUE');
    assert.equal(m.triggeredByApprovalId, uat.data.id);
    assert.equal(m.computedAmount, 4000);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'finance.payment', summary: { contains: 'Payment milestone due' } } }));
    assert.ok(await prisma.socialNotification.findFirst({ where: { receiverId: owner.id, senderId: client.id } }), 'PM nhận thông báo');

    const pp = (await call(client, 'GET', `/projects/${pid}/portal/payments`)).data;
    assert.equal(pp.enabled, true);
    assert.deepEqual(pp.items.map((x: any) => x.name), ['Acceptance of v1.0']);
    const raw = JSON.stringify(pp);
    for (const bad of ['rate', 'cost', 'budget', 'note', SECRET, 'trigger', 'clientVisible']) assert.ok(!raw.includes(bad), bad);
    assert.equal(pp.items[0].status, 'DUE');
    // Nhân viên xem trước như khách: cùng dữ liệu.
    assert.deepEqual((await call(owner, 'GET', `/projects/${pid}/portal/payments?as=client`)).data.items, pp.items);
    await call(owner, 'POST', `/projects/${pid}/finance/payments/1/status`, { status: 'INVOICED', invoiceNumber: 'C26TAA-0001234' });
    assert.equal((await call(client, 'GET', `/projects/${pid}/portal/payments`)).data.items[0].invoiceNumber, 'C26TAA-0001234');
  });

  it('báo cáo tuần cho khách: chỉ dữ liệu đã chia sẻ; gửi email cho khách; lịch sử trong cổng', async () => {
    // Thẻ chia sẻ + thẻ bí mật cùng xong hôm nay.
    for (const n of [iShared, iSecret]) assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/${n}/move`, { statusId: doneStatus(cfg) })).status, 200);
    await call(owner, 'POST', `/projects/${pid}/issues/${iWork}/move`, { statusId: progressStatus(cfg) });
    const pv = await call(staff, 'GET', `/projects/${pid}/reports/client-weekly/preview`);
    assert.equal(pv.status, 200, JSON.stringify(pv.raw));
    const blob = JSON.stringify(pv.data);
    assert.ok(blob.includes('Checkout page'));
    for (const bad of [SECRET, 'Payment gateway', 'Internal bonus', staff.email, `${tag}_staff`]) assert.ok(!blob.includes(bad), bad);
    assert.equal(pv.data.data.upcoming.payments.length, 1);
    assert.equal(pv.data.recipients, 1);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/reports/client-weekly/send`, {})).status, 403);
    assert.equal((await call(client, 'GET', `/projects/${pid}/reports/client-weekly/preview`)).code, 'CLIENT_PORTAL_ONLY');

    sent.length = 0;
    const s = await call(staff, 'POST', `/projects/${pid}/reports/client-weekly/send`, {});
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    assert.equal(s.data.recipientCount, 1);
    assert.deepEqual(sent.map((m) => m.to), [client.email]);
    assert.ok(!sent[0].html.includes(SECRET));
    const hist = (await call(client, 'GET', `/projects/${pid}/portal/reports`)).data;
    assert.equal(hist.enabled, true);
    assert.equal(hist.items.length, 1);
    const one = (await call(client, 'GET', `/projects/${pid}/portal/reports/${hist.items[0].id}`)).data;
    assert.ok(!JSON.stringify(one).includes(SECRET));
    assert.match(one.bodyMarkdown, /Checkout page/);

    // Rủi ro chỉ khi: lịch bật includeRisks VÀ dòng RISK được đánh dấu chia sẻ.
    await call(owner, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: `Hidden risk ${SECRET}`, probability: 5, impact: 5 });
    await call(owner, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Vendor API may change', probability: 3, impact: 4, clientVisible: true, mitigation: 'Pin API version' });
    let p2 = (await call(owner, 'GET', `/projects/${pid}/reports/client-weekly/preview`)).data;
    assert.equal(p2.data.risks, null);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { includeRisks: true })).status, 403);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { includeRisks: true })).status, 200);
    p2 = (await call(owner, 'GET', `/projects/${pid}/reports/client-weekly/preview`)).data;
    assert.deepEqual(p2.data.risks.map((r: any) => r.title), ['Vendor API may change']);
    assert.ok(!JSON.stringify(p2).includes(SECRET));
  });

  it('job nền theo lịch: không gọi LLM (không fetch ra ngoài), một bản mỗi tuần', async () => {
    const now = new Date();
    const l = localWeekdayHour(now, 'Asia/Ho_Chi_Minh');
    await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: true, weekday: l.weekday, hour: 0, timezone: 'Asia/Ho_Chi_Minh' });
    const realFetch = globalThis.fetch;
    const outbound: string[] = [];
    globalThis.fetch = (async (input: any, init?: any) => { outbound.push(String(input?.url ?? input)); return realFetch(input, init); }) as typeof fetch;
    const { runClientWeeklyReports } = await import('../services/work/clientReports.service.js');
    sent.length = 0;
    let n1 = 0, n2 = 0;
    try {
      n1 = await runClientWeeklyReports(now, { projectIds: [pid, oldPid, npPid] });
      n2 = await runClientWeeklyReports(now, { projectIds: [pid, oldPid, npPid] });
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(n1, 1);
    assert.equal(n2, 0, 'không gửi hai lần một tuần');
    assert.deepEqual(outbound, [], 'job nền không gọi mạng (LLM)');
    assert.deepEqual(sent.map((m) => m.to), [client.email]);
    const auto = await prisma.workClientReport.findMany({ where: { projectId: pid, source: 'AUTO' } });
    assert.equal(auto.length, 1);
    assert.ok(!JSON.stringify(auto[0].data).includes(SECRET));
    // Lịch tắt ⇒ không gửi.
    await prisma.workClientReport.deleteMany({ where: { projectId: pid, source: 'AUTO' } });
    await call(owner, 'PUT', `/projects/${pid}/reports/client-weekly/schedule`, { enabled: false });
    assert.equal(await runClientWeeklyReports(now, { projectIds: [pid] }), 0);
  });

  it('steering + thuyết trình: tiền chỉ cho ADMIN; chế độ client-safe không lộ dữ liệu chưa chia sẻ', async () => {
    const so = (await call(owner, 'GET', `/projects/${pid}/reports/steering`)).data;
    assert.equal(so.financeIncluded, true);
    assert.equal(so.data.internal.finance.currency, 'USD');
    assert.ok(so.data.internal.raid.top.length >= 1);
    const ss = (await call(staff, 'GET', `/projects/${pid}/reports/steering`)).data;
    assert.equal(ss.financeIncluded, false);
    assert.equal(ss.data.internal.finance, null);
    assert.equal(ss.data.upcoming.payments, null);
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/reports/steering`)).status, 200);

    const pc = (await call(owner, 'GET', `/projects/${pid}/present?mode=client`)).data;
    assert.equal(pc.mode, 'client');
    assert.equal(pc.financeIncluded, false);
    assert.equal(pc.data.internal, undefined);
    const pcs = JSON.stringify(pc);
    for (const bad of [SECRET, 'Payment gateway', 'Internal bonus']) assert.ok(!pcs.includes(bad), bad);
    assert.ok(pc.demoCandidates.some((d: any) => d.title === 'Checkout page'));
    const pi = (await call(owner, 'GET', `/projects/${pid}/present?mode=internal`)).data;
    assert.equal(pi.financeIncluded, true);
    assert.ok(pi.demoCandidates.some((d: any) => d.title === SECRET));
    assert.equal((await call(staff, 'GET', `/projects/${pid}/present?mode=internal`)).data.financeIncluded, false);
  });

  it('xuất trọn ZIP lên R2 (giả): chỉ ADMIN; đủ bảng; tệp tạm bị xoá; tải qua link ký ⇒ presigned; giới hạn chạy đồng thời; hết hạn ⇒ xoá object', async () => {
    await prisma.workGithubConnection.create({ data: { projectId: pid, repoFullName: 'acme/web', secret: `gh-${SECRET}` } });
    // Một tệp đính kèm có trên "R2" và một tệp đã mất — mất thì chỉ ghi missing, không hỏng cả lần xuất.
    const iRow = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: iShared } });
    const attOk = await prisma.workAttachment.create({ data: { issueId: iRow.id, r2Key: `work/${pid}/${iRow.id}/spec.txt`, fileName: 'spec.txt', mime: 'text/plain', size: 11 } });
    const attGone = await prisma.workAttachment.create({ data: { issueId: iRow.id, r2Key: `work/${pid}/${iRow.id}/gone.png`, fileName: 'gone.png', mime: 'image/png', size: 5 } });
    fakeR2.set(attOk.r2Key, Buffer.from('hello specs'));
    // R2 chưa cấu hình ⇒ 503 rõ ràng, không rơi về đĩa.
    fakeR2Log.enabled = false;
    const noStore = await call(owner, 'POST', `/projects/${pid}/exports`, {});
    assert.equal(noStore.status, 503);
    assert.equal(noStore.code, 'WORK_EXPORT_NO_STORAGE');
    fakeR2Log.enabled = true;
    // Toàn hệ thống tối đa 2 lần xuất đang chạy ⇒ 429 (hai lần "đang chạy" giả ở dự án khác).
    const busy = await prisma.workProjectExport.createManyAndReturn({ data: [{ projectId: oldPid, status: 'RUNNING' }, { projectId: npPid, status: 'RUNNING' }], select: { id: true } });
    const tooMany = await call(owner, 'POST', `/projects/${pid}/exports`, {});
    assert.equal(tooMany.status, 429);
    assert.equal(tooMany.code, 'WORK_EXPORT_BUSY');
    await prisma.workProjectExport.deleteMany({ where: { id: { in: busy.map((b) => b.id) } } });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/exports`, {})).status, 403);
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/exports`)).status, 403);
    assert.equal((await call(client, 'POST', `/projects/${pid}/exports`, {})).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(client, 'POST', `/projects/${npPid}/exports`, {})).status, 403);
    const st = await call(owner, 'POST', `/projects/${pid}/exports`, { includeFiles: true });
    assert.equal(st.status, 202, JSON.stringify(st.raw));
    let ex: any = st.data;
    for (let i = 0; i < 100 && ex.status !== 'DONE' && ex.status !== 'FAILED'; i += 1) {
      await wait(100);
      ex = (await call(owner, 'GET', `/projects/${pid}/exports/${st.data.id}`)).data;
    }
    assert.equal(ex.status, 'DONE', ex.error ?? '');
    assert.equal(ex.progress, 100);
    const { exportTempPath, exportKey, purgeExpiredExports } = await import('../services/work/projectExport.service.js');
    assert.equal(fs.existsSync(exportTempPath(ex.id)), false, 'tệp tạm đã xoá');
    assert.ok(fakeR2.has(exportKey(pid, ex.id)), 'ZIP nằm trên R2 với key work-exports/<pid>/<id>.zip');
    assert.equal((await prisma.workProjectExport.findUniqueOrThrow({ where: { id: ex.id } })).filePath, exportKey(pid, ex.id));
    const link = (await call(owner, 'POST', `/projects/${pid}/exports/${ex.id}/link`)).data;
    assert.match(link.url, /^\/api\/v1\/work\/exports\/download\//);
    const redirect = await fetch(`${base}${link.url}`, { redirect: 'manual' });
    assert.equal(redirect.status, 302);
    assert.match(redirect.headers.get('location') ?? '', /\/fake-r2\/work-exports/);
    const dl = await fetch(`${base}${link.url}`);
    assert.equal(dl.status, 200);
    const zip = new AdmZip(Buffer.from(await dl.arrayBuffer()));
    const manifest = JSON.parse(zip.readAsText('manifest.json'));
    assert.equal(manifest.format, 'ctwork-project-export');
    assert.equal(manifest.formatVersion, 1);
    const { EXPORT_TABLES } = await import('../services/work/projectExport.service.js');
    for (const [name] of EXPORT_TABLES) assert.ok(zip.getEntry(`data/${name}.json`), `thiếu bảng ${name}`);
    assert.ok(zip.getEntry('data/users.json'));
    assert.ok(zip.getEntry('attachments/manifest.json'));
    assert.equal(zip.readAsText(`files/${attOk.id}-spec.txt`), 'hello specs', 'nội dung tệp đọc từ R2 theo luồng');
    const am = JSON.parse(zip.readAsText('attachments/manifest.json'));
    assert.equal(am.find((x: any) => x.id === attGone.id).missing, true);
    const counts = manifest.tables;
    for (const t of ['issues', 'worklogs', 'timesheets', 'timesheetLines', 'expenses', 'paymentMilestones', 'clientReports', 'raidItems', 'approvals', 'uatRequests', 'auditLog']) {
      assert.ok(counts[t] > 0, `bảng ${t} rỗng`);
    }
    const all = zip.getEntries().map((e) => e.getData().toString('utf8')).join('\n');
    assert.ok(!all.includes(`gh-${SECRET}`), 'secret GitHub đã xoá');
    assert.ok(!all.includes(client.email) && !all.includes(staff.email), 'không email người dùng');
    // Link giả / hết hạn.
    const forged = link.url.replace(/.$/, (c: string) => (c === 'A' ? 'B' : 'A'));
    assert.equal((await fetch(`${base}${forged}`)).status, 404);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'project.export' } }));
    // Dự án cũ (không mô-đun) vẫn xuất được — sao lưu là quyền của ADMIN, không phải mô-đun.
    const old = await call(owner, 'POST', `/projects/${oldPid}/exports`, {});
    assert.equal(old.status, 202);
    let oe: any = old.data;
    for (let i = 0; i < 100 && oe.status !== 'DONE' && oe.status !== 'FAILED'; i += 1) { await wait(100); oe = (await call(owner, 'GET', `/projects/${oldPid}/exports/${old.data.id}`)).data; }
    assert.equal(oe.status, 'DONE');
    // Hết 72 giờ ⇒ cron xoá object R2, đánh dấu EXPIRED; link cũ thôi dùng được.
    await prisma.workProjectExport.updateMany({ where: { id: { in: [ex.id, oe.id] } }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.ok((await purgeExpiredExports()) >= 2);
    assert.ok(fakeR2Log.removed.includes(exportKey(pid, ex.id)) && !fakeR2.has(exportKey(pid, ex.id)));
    assert.equal((await prisma.workProjectExport.findUniqueOrThrow({ where: { id: ex.id } })).status, 'EXPIRED');
    assert.equal((await fetch(`${base}${link.url}`)).status, 410);
  });
});
