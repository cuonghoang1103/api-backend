/**
 * CT Work đợt 1b — tài liệu kiểm thử chuẩn FPT qua HTTP thật trên Postgres cục bộ (AI GIẢ qua `_setFptAskForTests`):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.fpt.db.test.ts
 *
 *   1. Cover + Record of change: đọc mặc định (tên/mã dự án), sửa, thêm/xoá bản ghi thay đổi.
 *   2. Unit: tạo hàm (mẫu khởi đầu Precondition/Return/Exception/Log message), lưu ma trận (dấu O, N/A/B, P/F), thống kê +
 *      chỉ tiêu KLOC, khoá lạc quan (409 WORK_STALE), nhân bản, AI gợi ý (đề xuất, không ghi; chỉ số bịa bị bỏ).
 *   3. Integration: module + case + vòng chạy; thống kê Passed/Failed/Pending/N/A.
 *   4. Xuất .xlsx ⇒ nhập lại vào dự án KHÁC (dry-run rồi thật) ⇒ cùng dữ liệu; "replace" thay hẳn; tệp rác ⇒ 400.
 *   5. Quyền: VIEWER đọc + xuất được, không ghi; người ngoài 404; khách cổng 403.
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
const tag = `fpt${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 1b: kiểm thử chuẩn FPT (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, outsider: U, client: U;
  let wsId = 0, pid = 0, pid2 = 0;
  let fakeReplies: string[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
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

  before(async () => {
    (await import('../services/work/fptTests.service.js'))._setFptAskForTests(async () => fakeReplies.shift() ?? '{}');
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, outsider, client] = await Promise.all(['owner', 'staff', 'viewer', 'outsider', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/fptTests.service.js'))._setFptAskForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: không gian + 2 dự án SCHOOL, staff MEMBER, viewer VIEWER, khách cổng', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `FPT ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OBS', name: 'Online Bookstore', template: 'SWT301' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    const p2 = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'IMP', name: 'Import target', template: 'BLANK' });
    assert.equal(p2.status, 201, JSON.stringify(p2.raw));
    pid2 = p2.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    const p3 = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CLI', name: 'Client shop', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal((await call(owner, 'POST', `/projects/${p3.data.id}/portal/invite`, { emails: [client.email] })).status, 201);
  });

  it('Cover: mặc định lấy tên/mã dự án; sửa + Record of change', async () => {
    const d = await call(staff, 'GET', `/projects/${pid}/fpt-tests/doc`);
    assert.equal(d.status, 200);
    assert.deepEqual([d.data.meta.projectName, d.data.meta.projectCode, d.data.meta.tcPerKloc, d.data.canEdit], ['Online Bookstore', 'OBS', 100, true]);
    const u = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/doc`, { creator: 'Cuong', reviewer: 'ThayA', unitIssueDate: '2026-10-01', environment: '1. Node 22\n2. PostgreSQL', projectCode: 'OBS_G1' });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal(u.data.meta.projectCode, 'OBS_G1');
    const c = await call(staff, 'POST', `/projects/${pid}/fpt-tests/changes`, { report: 'UNIT', effectiveDate: '2026-10-01', version: '1.0', action: 'A', description: 'Create unit test document' });
    assert.equal(c.status, 201);
    const c2 = await call(staff, 'POST', `/projects/${pid}/fpt-tests/changes`, { report: 'UNIT', effectiveDate: '2026-10-02', version: '1.0', action: 'X', description: 'bad' });
    assert.equal(c2.status, 400);
    const tmp = await call(staff, 'POST', `/projects/${pid}/fpt-tests/changes`, { report: 'INT', effectiveDate: '2026-10-02', version: '1.0', action: 'M' });
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-tests/changes/${tmp.data.id}`)).status, 200);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/fpt-tests/doc`)).data.changes.length, 1);
  });

  let fid = 0;
  let fn: any;
  it('Unit: tạo hàm có mẫu khởi đầu; lưu ma trận; thống kê + KLOC', async () => {
    const r = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit`, { moduleName: 'AuthService', methodName: 'Login', loc: 60, description: 'Authenticates a user' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    fid = r.data.id;
    assert.deepEqual(r.data.rows.map((x: any) => x.groupName), ['Precondition', 'Return', 'Exception', 'Log message']);
    assert.equal(r.data.cases.length, 1);
    assert.equal(r.data.createdBy, `${tag}_staff`);
    assert.equal(r.data.requiredCases, 6);

    const save = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/unit/${fid}/matrix`, {
      version: r.data.updatedAt,
      rows: [
        { key: 'p', section: 'COND', groupName: 'Precondition', value: 'Connected to the server' },
        { key: 'e1', section: 'COND', groupName: 'email', value: 'a@b.co' },
        { key: 'e2', section: 'COND', groupName: 'email', label: '255 characters', value: 'aaa…a@b.co' },
        { key: 'ok', section: 'CONFIRM', groupName: 'Return', value: 'true' },
        { key: 'ko', section: 'CONFIRM', groupName: 'Return', value: 'false' },
      ],
      cases: [
        { key: 'c1', type: 'N', result: 'P', executedAt: '2026-10-02' },
        { key: 'c2', type: 'B', result: 'F', executedAt: '2026-10-02', defectId: 'OBS-7' },
        { key: 'c3', type: 'A' },
      ],
      marks: [['p', 'c1'], ['e1', 'c1'], ['ok', 'c1'], ['p', 'c2'], ['e2', 'c2'], ['ko', 'c2'], ['p', 'c3'], ['ko', 'c3'], ['zz', 'c3']],
    });
    assert.equal(save.status, 200, JSON.stringify(save.raw));
    fn = save.data;
    assert.deepEqual(fn.stats, { passed: 1, failed: 1, untested: 1, n: 1, a: 1, b: 1, total: 3 });
    assert.equal(fn.belowNorm, true, '3 < 6 test case');
    assert.equal(fn.cases[1].defectId, 'OBS-7');
    assert.equal(fn.cases[0].rowIds.length, 3);
    assert.equal(fn.cases[2].rowIds.length, 2, 'dấu trỏ dòng không tồn tại bị bỏ');

    const stale = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/unit/${fid}/matrix`, { version: r.data.updatedAt, rows: [], cases: [], marks: [] });
    assert.equal(stale.status, 409);
    assert.equal(stale.code, 'WORK_STALE');

    const list = await call(viewer, 'GET', `/projects/${pid}/fpt-tests/unit`);
    assert.equal(list.status, 200);
    assert.equal(list.data.functions.length, 1);
    assert.equal(list.data.summary.requiredCases, 6);
    assert.equal(list.data.summary.meetsNorm, false);
  });

  it('Unit: nhân bản (kết quả chạy xoá trắng) + sửa thông tin hàm', async () => {
    const d = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/${fid}/duplicate`, {});
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    assert.equal(d.data.methodName, 'Login (copy)');
    assert.equal(d.data.rows.length, 5);
    assert.deepEqual(d.data.cases.map((c: any) => [c.type, c.result, c.rowIds.length]), [['N', null, 3], ['B', null, 3], ['A', null, 2]]);
    const u = await call(staff, 'PATCH', `/projects/${pid}/fpt-tests/unit/${d.data.id}`, { methodName: 'Register', moduleName: 'AuthService', loc: 10 });
    assert.equal(u.status, 200);
    assert.equal(u.data.requiredCases, 1);
  });

  it('Unit: AI gợi ý (đề xuất, không ghi; chỉ số bịa bị bỏ)', async () => {
    fakeReplies = [JSON.stringify({
      conditions: [{ group: 'email', label: null, value: 'a@b.co' }, { group: 'email', label: 'empty', value: '' }],
      confirmations: [{ group: 'Return', value: 'true' }],
      cases: [{ type: 'N', conditions: [0], confirmations: [0] }, { type: 'A', conditions: [1, 9], confirmations: [] }, { type: 'B', conditions: [7], confirmations: [5] }],
    })];
    const r = await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/${fid}/ai-suggest`, { signature: 'login(email: string, password: string): boolean' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.cases.length, 2);
    assert.deepEqual(r.data.cases[1].conditions, [1]);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/fpt-tests/unit/${fid}`)).data.rows.length, 5, 'không ghi gì');
    fakeReplies = ['not json at all'];
    assert.equal((await call(staff, 'POST', `/projects/${pid}/fpt-tests/unit/${fid}/ai-suggest`, {})).status, 502);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/fpt-tests/unit/${fid}/ai-suggest`, {})).status, 403);
  });

  let mid = 0;
  it('Integration: module + case + vòng chạy; thống kê', async () => {
    const m = await call(staff, 'POST', `/projects/${pid}/fpt-tests/integration`, { name: 'Authentication', description: 'Login across UI/API/DB', preCondition: 'Accounts seeded' });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    mid = m.data.id;
    assert.equal(m.data.idPrefix, 'AT');
    const s = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/integration/${mid}/cases`, {
      version: m.data.updatedAt,
      cases: [
        { section: 'Login', description: 'Valid login', procedure: '1. Open /login\n2. Submit', testData: 'a@b.co / Test123@', expected: 'Home page', rounds: [{ status: 'Failed', date: '2026-10-05', tester: 'Cuong' }, { status: 'Passed', date: '2026-10-06', tester: 'Cuong' }] },
        { section: 'Login', description: 'Wrong password', expected: 'Error', actual: '500 page', rounds: [{ status: 'Failed', date: '2026-10-05', tester: 'Cuong' }] },
        { section: 'Logout', description: 'Logout', expected: 'Back to login' },
      ],
    });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.deepEqual([s.data.stats.passed, s.data.stats.failed, s.data.stats.pending, s.data.stats.total], [1, 1, 1, 3]);
    const bad = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/integration/${mid}/cases`, { cases: [{ description: '', rounds: [] }] });
    assert.equal(bad.status, 400);
    const five = await call(staff, 'PUT', `/projects/${pid}/fpt-tests/integration/${mid}/cases`, { cases: [{ description: 'x', rounds: Array(5).fill({ status: 'Passed', date: null, tester: null }) }] });
    assert.equal(five.status, 400, 'tối đa 4 vòng như mẫu');
    const list = await call(viewer, 'GET', `/projects/${pid}/fpt-tests/integration`);
    assert.deepEqual([list.data.summary.passed, list.data.summary.failed, list.data.summary.total, list.data.summary.coverage], [1, 1, 3, 66.7]);
  });

  let unitXlsx: Buffer, intXlsx: Buffer;
  it('Xuất .xlsx (VIEWER được) — đúng loại tệp + tên theo mẫu', async () => {
    const u = await download(viewer, `/projects/${pid}/fpt-tests/export?report=unit`);
    assert.equal(u.status, 200);
    assert.match(u.type ?? '', /spreadsheetml/);
    assert.match(u.disposition ?? '', /OBS_G1_Report5\.1_Unit_Test_Report\.xlsx/);
    assert.equal(u.buf.subarray(0, 2).toString(), 'PK');
    unitXlsx = u.buf;
    const i = await download(viewer, `/projects/${pid}/fpt-tests/export?report=integration`);
    assert.equal(i.status, 200);
    assert.match(i.disposition ?? '', /Report5\.2_Integration_Test_Report/);
    intXlsx = i.buf;
    assert.equal((await download(viewer, `/projects/${pid}/fpt-tests/export?report=bogus`)).status, 400);
  });

  it('Nhập vào dự án khác: dry-run không ghi; thật thì đúng dữ liệu; replace thay hẳn', async () => {
    const dry = await upload(owner, `/projects/${pid2}/fpt-tests/import?dryRun=1`, unitXlsx);
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.deepEqual([dry.data.report, dry.data.functions, dry.data.cases, dry.data.dryRun], ['unit', 2, 6, true]);
    assert.equal((await call(owner, 'GET', `/projects/${pid2}/fpt-tests/unit`)).data.functions.length, 0);

    const real = await upload(owner, `/projects/${pid2}/fpt-tests/import?mode=append`, unitXlsx);
    assert.equal(real.status, 200, JSON.stringify(real.raw));
    const list = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/unit`);
    assert.deepEqual(list.data.functions.map((f: any) => f.methodName), ['Login', 'Register']);
    const login = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/unit/${list.data.functions[0].id}`);
    assert.deepEqual(login.data.rows.map((r: any) => [r.section, r.groupName, r.label, r.value]), fn.rows.map((r: any) => [r.section, r.groupName, r.label, r.value]));
    assert.deepEqual(login.data.cases.map((c: any) => [c.type, c.result, c.executedAt, c.defectId, c.rowIds.length]), fn.cases.map((c: any) => [c.type, c.result, c.executedAt, c.defectId, c.rowIds.length]));
    assert.equal(login.data.loc, 60);
    const doc = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/doc`);
    assert.deepEqual([doc.data.meta.projectCode, doc.data.meta.creator, doc.data.meta.reviewer, doc.data.meta.unitIssueDate], ['OBS_G1', 'Cuong', 'ThayA', '2026-10-01']);
    assert.equal(doc.data.changes.length, 1);

    const it2 = await upload(owner, `/projects/${pid2}/fpt-tests/import`, intXlsx);
    assert.equal(it2.status, 200, JSON.stringify(it2.raw));
    assert.equal(it2.data.report, 'integration');
    const mods = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/integration`);
    const m = await call(owner, 'GET', `/projects/${pid2}/fpt-tests/integration/${mods.data.modules[0].id}`);
    assert.deepEqual(m.data.cases.map((c: any) => [c.section, c.description, c.testData, c.actual, c.rounds.length]),
      [['Login', 'Valid login', 'a@b.co / Test123@', null, 2], ['Login', 'Wrong password', null, '500 page', 1], ['Logout', 'Logout', null, null, 0]]);

    const again = await upload(owner, `/projects/${pid2}/fpt-tests/import?mode=replace&report=unit`, unitXlsx);
    assert.equal(again.status, 200);
    assert.equal((await call(owner, 'GET', `/projects/${pid2}/fpt-tests/unit`)).data.functions.length, 2, 'replace không nhân đôi');

    const junk = await upload(owner, `/projects/${pid2}/fpt-tests/import`, Buffer.from('hello'));
    assert.equal(junk.status, 400);
    assert.equal(junk.code, 'WORK_IMPORT_BAD_FILE');
  });

  it('Quyền: VIEWER không ghi; người ngoài 404; khách cổng 403', async () => {
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/fpt-tests/unit`, { moduleName: 'X', methodName: 'y' })).status, 403);
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/fpt-tests/doc`, { creator: 'x' })).status, 403);
    assert.equal((await upload(viewer, `/projects/${pid}/fpt-tests/import`, unitXlsx)).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/fpt-tests/unit`)).status, 404);
    const c = await call(client, 'GET', `/projects/${pid}/fpt-tests/unit`);
    assert.ok([403, 404].includes(c.status), String(c.status));
  });

  it('Xoá hàm/module; xoá dự án dọn sạch (cascade deferred)', async () => {
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-tests/unit/${fid}`)).status, 200);
    assert.equal((await call(staff, 'GET', `/projects/${pid}/fpt-tests/unit/${fid}`)).status, 404);
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/fpt-tests/integration/${mid}`)).status, 200);
    await prisma.workProject.delete({ where: { id: pid2 } });
    assert.equal(await prisma.workUnitFunction.count({ where: { projectId: pid2 } }), 0);
    assert.equal(await prisma.workItModule.count({ where: { projectId: pid2 } }), 0);
  });
});
