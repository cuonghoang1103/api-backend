/**
 * CT Work đợt 3B — báo cáo Excel nộp trường qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.fpt3b.db.test.ts
 *
 *   1. A14 System Test 5.3: workflow + case 3 vòng (vòng 4 ⇒ 400), tách khỏi 5.2, xuất ⇒ nhập sang dự án khác (tự nhận "system").
 *   2. A3 WBS: cây 1.0/1.1/1.1.1, thuộc tính WBS ⇒ độ phức tạp ⇒ man-day, bảng quy đổi (chỉ ADMIN, kiểm tăng dần), xuất sheet WBS.
 *   3. A23 Project Tracking: SEP490 (Scope/WBS/Q&A/TimeLogs/Defects/Issues lấy từ giai đoạn/worklog/Bug/RAID), Template1, Template4.
 *   4. A21 Weekly Report: tạo kỳ tự điền từ dữ liệu tuần, trùng tuần 409, khoá lạc quan 409, làm mới giữ điểm, xuất "Week n".
 *   5. A29 AI Usage: đồng bộ từ provenance (thẻ aiAssisted + hội thoại AI) không ghi trùng, dòng tay, sửa, xuất Template0.
 *   6. Quyền: VIEWER đọc/xuất được, không ghi; người ngoài 404; xoá dự án dọn sạch (cascade deferred).
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
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `f3b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

/** Thứ Hai của tuần hiện tại theo giờ VN (YYYY-MM-DD). */
function thisMonday(): string {
  const vn = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  const d = new Date(`${vn}T00:00:00Z`);
  return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86_400_000).toISOString().slice(0, 10);
}

describe('CT Work — đợt 3B: báo cáo Excel theo mẫu FPT (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, outsider: U;
  let wsId = 0, pid = 0, pid2 = 0, sysId = 0, intId = 0, weeklyId = 0, epicNum = 0, storyNum = 0, subNum = 0, bugNum = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1) } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, type: res.headers.get('content-type'), disposition: res.headers.get('content-disposition'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  async function upload(u: U, path: string, buf: Buffer) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${u.token}` }, body: new Uint8Array(buf),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const issue = async (title: string, typeKey: string, extra: Record<string, unknown> = {}) => {
    const r = await call(staff, 'POST', `/projects/${pid}/issues`, { title, typeKey, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return r.data.number as number;
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, outsider] = await Promise.all(['owner', 'staff', 'viewer', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: không gian + dự án SWT301 + dự án đích nhập, staff MEMBER, viewer VIEWER', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `F3B ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OBS', name: 'Online Bookstore', template: 'SWT301' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    pid2 = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'IMP', name: 'Import target', template: 'BLANK' })).data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
  });

  // ─── A14 ───────────────────────────────────────────────────────
  it('System 5.3: workflow riêng với 5.2, đúng 3 vòng', async () => {
    const s = await call(staff, 'POST', `/projects/${pid}/fpt-tests/system`, { name: 'Login', description: 'Login workflow', preCondition: 'Accounts seeded' });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    sysId = s.data.id;
    assert.equal(s.data.kind, 'SYS');
    intId = (await call(staff, 'POST', `/projects/${pid}/fpt-tests/integration`, { name: 'Authentication' })).data.id;
    const rounds = [{ status: 'Failed', date: '2026-11-10', tester: 'Son' }, { status: 'Passed', date: '2026-11-12', tester: 'Son' }, { status: 'Passed', date: '2026-11-18', tester: 'Tam' }];
    const save = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/system/${sysId}/cases`, {
      version: s.data.updatedAt,
      cases: [
        { section: 'Scenario A', description: 'Show login page', procedure: '1. Open /login', expected: 'Form shown', evidence: 'https://img/1.png', rounds },
        { section: 'Scenario A', description: 'Empty phone', expected: 'Error', actual: 'No error', rounds: [rounds[0]] },
      ],
    });
    assert.equal(save.status, 200, JSON.stringify(save.raw));
    assert.equal(save.data.stats.passed, 1);
    const four = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/system/${sysId}/cases`, { cases: [{ description: 'x', rounds: [...rounds, rounds[0]] }] });
    assert.equal(four.status, 400, '5.3 chỉ có Round 1–3');
    const sys = await call(viewer, 'GET', `/projects/${pid}/fpt-tests/system`);
    assert.deepEqual(sys.data.modules.map((m: any) => m.name), ['Login']);
    const it = await call(viewer, 'GET', `/projects/${pid}/fpt-tests/integration`);
    assert.deepEqual(it.data.modules.map((m: any) => m.name), ['Authentication'], '5.2 không lẫn workflow 5.3');
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/fpt-tests/doc`, { sysIssueDate: '2026-11-20', sysNotes: 'Regression in round 3' })).data.meta.sysIssueDate, '2026-11-20');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-tests/changes`, { report: 'SYS', effectiveDate: '2026-11-20', version: '1.0', action: 'A', description: 'Create system test' })).status, 201);
  });

  it('System 5.3: xuất ⇒ nhập vào dự án khác (tự nhận loại), replace không nhân đôi', async () => {
    const x = await download(viewer, `/projects/${pid}/fpt-tests/export?report=system`);
    assert.equal(x.status, 200);
    assert.match(x.disposition ?? '', /Report5\.3_System_Test_Report\.xlsx/);
    const sheets = readXlsx(x.buf);
    assert.deepEqual(sheets.map((s) => s.name), ['Cover', 'Test Cases', 'Test Statistics', 'Login']);
    assert.equal(sheets[0].text(11, 5), 'Create system test');
    const dry = await upload(owner, `/projects/${pid2}/fpt-tests/import?dryRun=1`, x.buf);
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.equal(dry.data.report, 'system');
    assert.equal((await upload(owner, `/projects/${pid2}/fpt-tests/import`, x.buf)).status, 200);
    assert.equal((await upload(owner, `/projects/${pid2}/fpt-tests/import?mode=replace&report=system`, x.buf)).status, 200);
    const mods = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/system`);
    assert.equal(mods.data.modules.length, 1);
    const m = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/system/${mods.data.modules[0].id}`);
    assert.equal(m.data.cases[0].rounds.length, 3);
    assert.equal(m.data.cases[0].evidence, 'https://img/1.png');
    assert.equal((await call(owner, 'GET', `/projects/${pid2}/fpt-tests/integration`)).data.modules.length, 0);
    assert.equal((await call(owner, 'GET', `/projects/${pid2}/fpt-tests/doc`)).data.meta.sysNotes, 'Regression in round 3');
  });

  // ─── A3 ────────────────────────────────────────────────────────
  it('WBS: cây đánh số + thuộc tính ⇒ độ phức tạp ⇒ man-day', async () => {
    epicNum = await issue('Shopping', 'EPIC');
    storyNum = await issue('Cart screen', 'STORY', { parentNumber: epicNum });
    subNum = await issue('Write SRS for cart', 'SUBTASK', { parentNumber: storyNum });
    bugNum = await issue('Cart total wrong', 'BUG', { labels: undefined });
    const set = await call(staff, 'PUT', `/projects/${pid}/wbs/items/${storyNum}`, { kind: 'Screen', fields: 9, transactions: 2, feature: 'Cart' });
    assert.equal(set.status, 200, JSON.stringify(set.raw));
    assert.deepEqual([set.data.row.complexity, set.data.row.plannedDays, set.data.row.wbs], ['Medium', 5, '1.1']);
    const w = await call(viewer, 'GET', `/projects/${pid}/wbs`);
    assert.equal(w.status, 200);
    assert.deepEqual(w.data.rows.map((r: any) => r.wbs), ['1.0', '1.1', '1.1.1']);
    assert.ok(!w.data.rows.some((r: any) => r.typeKey === 'BUG'), 'Bug không vào WBS');
    assert.equal(w.data.canEdit, false, 'VIEWER chỉ xem');
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/wbs/items/${storyNum}`, { complexity: 'Simple' })).status, 403);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/wbs/items/${storyNum}`, { complexity: 'Huge' })).status, 400);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/wbs/items/9999`, { complexity: 'Simple' })).status, 404);
  });

  it('WBS: bảng quy đổi chỉ ADMIN sửa, phải tăng dần; xuất sheet WBS', async () => {
    const levels = [
      { name: 'Simple', maxFields: 7, maxTransactions: 3, manDays: 2 },
      { name: 'Medium', maxFields: 15, maxTransactions: 7, manDays: 4 },
      { name: 'Complex', maxFields: null, maxTransactions: null, manDays: 8 },
    ];
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/wbs/matrix`, { levels, hoursPerDay: 8 })).status, 403);
    const bad = await call(owner, 'PUT', `/projects/${pid}/wbs/matrix`, { levels: [levels[0], { ...levels[1], maxFields: 5 }, levels[2]], hoursPerDay: 8 });
    assert.equal(bad.status, 400);
    const ok = await call(owner, 'PUT', `/projects/${pid}/wbs/matrix`, { levels, hoursPerDay: 6 });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    assert.equal(ok.data.rows.find((r: any) => r.number === storyNum).plannedDays, 4);
    const x = await download(viewer, `/projects/${pid}/wbs/export`);
    assert.equal(x.status, 200);
    const sh = readXlsx(x.buf);
    assert.deepEqual(sh.map((s) => s.name), ['WBS']);
    assert.equal(sh[0].text(2, 5), '2 pds');
  });

  // ─── A23 ───────────────────────────────────────────────────────
  it('Project Tracking SEP490: 6 sheet lấy từ giai đoạn/worklog/Bug/RAID', async () => {
    const st = await prisma.workStage.create({ data: { projectId: pid, n: 1, slug: 'initiating', name: 'Project Initiating', status: 'ACTIVE' } });
    const story = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: storyNum } });
    await prisma.workIssue.updateMany({ where: { projectId: pid, number: { in: [epicNum, storyNum] } }, data: { stageId: st.id } });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/issues/${storyNum}/worklogs`, { minutes: 150, note: 'Cart UI' })).status, 201);
    await prisma.workRaidItem.createMany({
      data: [
        { projectId: pid, number: 901, type: 'ISSUE', title: 'Missing stakeholder', status: 'OPEN', impact: 4, ownerId: staff.id, createdById: owner.id },
        { projectId: pid, number: 902, type: 'ISSUE', title: 'Pay by PayOS or cash?', category: 'Q&A', status: 'OPEN', createdById: staff.id, ownerId: owner.id },
      ],
    });
    const x = await download(viewer, `/projects/${pid}/export/project-tracking?variant=SEP490`);
    assert.equal(x.status, 200);
    const s = readXlsx(x.buf);
    assert.deepEqual(s.map((q) => q.name), ['Scope', 'WBS', 'Q&A', 'TimeLogs', 'Defects', 'Issues']);
    const by = (n: string) => s.find((q) => q.name === n)!;
    assert.deepEqual([by('Scope').text(2, 1), by('Scope').text(2, 2)], ['1.0', 'Stage 1: Project Initiating']);
    assert.equal(by('Scope').text(3, 2), 'Shopping');
    assert.equal(by('TimeLogs').get(3, 4), 2.5);
    assert.match(by('TimeLogs').text(3, 3), /OBS-\d+ Cart screen/);
    assert.match(by('Defects').text(3, 2), /Cart total wrong/);
    assert.equal(by('Issues').text(3, 2), 'Missing stakeholder');
    assert.equal(by('Issues').text(3, 4), 'High');
    assert.equal(by('Q&A').text(3, 2), 'Pay by PayOS or cash?');
    assert.ok(story);
  });

  it('Project Tracking Template1 + Template4 + mặc định; variant lạ ⇒ 400', async () => {
    const t1 = readXlsx((await download(viewer, `/projects/${pid}/export/project-tracking?variant=SWP391_T1`)).buf);
    assert.deepEqual(t1.map((q) => q.name), ['Project', 'Iter1', 'Iter2', 'Iter3', 'Iter4']);
    const t4 = readXlsx((await download(viewer, `/projects/${pid}/export/project-tracking?variant=ISSUES`)).buf);
    assert.deepEqual(t4.map((q) => q.name), ['Issues Report']);
    assert.ok(t4[0].maxRow >= 5, 'mỗi thẻ một dòng');
    assert.match(t4[0].text(2, 4), /\/work\/.+\/OBS\/issue\/\d+$/);
    const d = readXlsx((await download(viewer, `/projects/${pid}/export/project-tracking`)).buf);
    assert.deepEqual(d.map((q) => q.name), ['Product', 'Summary'], 'mặc định giữ mẫu SWP391 cũ');
    assert.equal((await download(viewer, `/projects/${pid}/export/project-tracking?variant=XYZ`)).status, 400);
  });

  // ─── A21 ───────────────────────────────────────────────────────
  it('Weekly Report: tự điền, trùng tuần 409, khoá lạc quan, làm mới giữ điểm, xuất', async () => {
    const monday = thisMonday();
    const doc = await call(staff, 'PUT', `/projects/${pid}/fpt-reports/doc`, { week1Start: new Date(Date.parse(`${monday}T00:00:00Z`) - 14 * 86_400_000).toISOString().slice(0, 10), groupCode: 'G108', subjectCode: 'SEP490' });
    assert.equal(doc.status, 200, JSON.stringify(doc.raw));
    const pre = await call(viewer, 'GET', `/projects/${pid}/fpt-reports/weekly/preview?week=${monday}`);
    assert.equal(pre.data.weekNo, 3);
    assert.ok(pre.data.data.status.some((r: any) => r.task === 'Cart screen' && /2\.5h logged/.test(r.notes)), JSON.stringify(pre.data.data.status));
    assert.ok(pre.data.data.issues.some((r: any) => r.issue === 'Missing stakeholder'));
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/fpt-reports/weekly`, { weekStart: monday })).status, 403);
    const c = await call(staff, 'POST', `/projects/${pid}/fpt-reports/weekly`, { weekStart: monday });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    weeklyId = c.data.id;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-reports/weekly`, { weekStart: monday })).status, 409);
    const data = { ...c.data.data, grades: c.data.data.grades.map((g: any) => ({ ...g, grade: 8 })), matters: [{ matter: 'Ask for a demo slot', raisedBy: 'Staff', date: monday, notes: '' }] };
    const u = await call(staff, 'PUT', `/projects/${pid}/fpt-reports/weekly/${weeklyId}`, { version: c.data.version, data });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/fpt-reports/weekly/${weeklyId}`, { version: c.data.version, data })).status, 409, 'version cũ');
    const r = await call(staff, 'POST', `/projects/${pid}/fpt-reports/weekly/${weeklyId}/refresh`);
    assert.ok(r.data.data.grades.length >= 2 && r.data.data.grades.every((g: any) => g.grade === 8), 'làm mới giữ điểm cá nhân');
    const x = await download(viewer, `/projects/${pid}/fpt-reports/weekly/export`);
    assert.equal(x.status, 200);
    const s = readXlsx(x.buf);
    assert.deepEqual(s.map((q) => q.name), ['Week 3']);
    assert.equal(s[0].text(2, 2), 'G108');
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/fpt-reports/weekly`)).data.reports.length, 1);
  });

  // ─── A29 ───────────────────────────────────────────────────────
  it('AI Usage: đồng bộ provenance không trùng, dòng tay, sửa, xuất Template0', async () => {
    await prisma.workIssue.updateMany({ where: { projectId: pid, number: storyNum }, data: { aiAssisted: true, aiModel: 'claude-sonnet-5', aiAssistedAt: new Date(), aiAppliedById: staff.id } });
    await prisma.workAiThread.create({ data: { projectId: pid, createdById: staff.id, title: 'Draft use cases for checkout', messageCount: 4 } });
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/fpt-reports/ai-usage/sync`)).status, 403);
    const s1 = await call(staff, 'POST', `/projects/${pid}/fpt-reports/ai-usage/sync`);
    assert.equal(s1.status, 200, JSON.stringify(s1.raw));
    assert.equal(s1.data.added, 2);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-reports/ai-usage/sync`)).data.added, 0, 'không ghi trùng');
    const list = await call(viewer, 'GET', `/projects/${pid}/fpt-reports/ai-usage`);
    const auto = list.data.logs.find((l: any) => l.tool === 'claude-sonnet-5');
    assert.ok(auto && auto.source === 'AUTO' && auto.userName === 'Staff', JSON.stringify(list.data.logs));
    assert.equal(list.data.logs.find((l: any) => /use cases/.test(l.task)).phase, 'Requirement');
    const m = await call(staff, 'POST', `/projects/${pid}/fpt-reports/ai-usage`, { usedAt: thisMonday(), phase: 'Design', task: 'ERD conceptual', tool: 'Copilot', output: 'Tables', value: 4 });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-reports/ai-usage`, { usedAt: thisMonday(), phase: 'Design', task: 'x', tool: 'y', value: 6 })).status, 400);
    const p = await call(staff, 'PATCH', `/projects/${pid}/fpt-reports/ai-usage/${auto.id}`, { validation: 'Rewrote 2 acceptance criteria', value: 5 });
    assert.deepEqual([p.data.validation, p.data.value], ['Rewrote 2 acceptance criteria', 5]);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-reports/ai-usage/sync`)).data.added, 0);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/fpt-reports/ai-usage`)).data.logs.find((l: any) => l.id === auto.id).value, 5, 'đồng bộ lại không đè dòng đã sửa');
    const x = await download(viewer, `/projects/${pid}/fpt-reports/ai-usage/export`);
    assert.equal(x.status, 200);
    const sh = readXlsx(x.buf);
    assert.equal(sh[0].name, '0.Overview');
    assert.equal(sh[sh.length - 1].name, 'Instruction ');
    assert.match(sh[1].name, /^1\. Week \d+$/);
    assert.equal(sh[0].text(2, 2), 'SEP490');
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-reports/ai-usage/${m.data.id}`)).status, 200);
  });

  it('Quyền: người ngoài 404; VIEWER không sửa doc; xoá dự án dọn sạch', async () => {
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/wbs`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/fpt-reports/weekly`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/fpt-tests/system`)).status, 404);
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/fpt-reports/doc`, { groupCode: 'x' })).status, 403);
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-reports/weekly/${weeklyId}`)).status, 200);
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-tests/system/${sysId}`)).status, 200);
    assert.ok(intId && subNum && bugNum);
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workWbsItem.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workAiUsageLog.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workFptReportDoc.count({ where: { projectId: pid } }), 0);
  });
});
