/**
 * CT Work 22/10/2026 — THÙNG RÁC 30 ngày + YÊU CẦU XOÁ chờ trưởng nhóm duyệt (HTTP + Postgres cục bộ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.trash.db.test.ts
 *
 * Sự cố gốc (SWT301, 22/10/2026 23:49): thành viên bấm "Nhập Excel → Thay thế" ⇒ cả bảng 5.1 (24 hàm) bị xoá cứng, không
 * thùng rác, không nhật ký; 5 phút sau hàm còn lại cũng bị xoá. Bộ test này dựng lại đúng kịch bản đó:
 *   1. Thành viên "Thay thế" ⇒ KHÔNG xoá, thành yêu cầu (202) kèm đúng tệp; trưởng nhóm được báo.
 *   2. ADMIN "Thay thế" phải gõ đúng số hàm; chạy ⇒ toàn bộ hàm cũ vào thùng rác MỘT mục ⇒ khôi phục Y NGUYÊN (giữ id
 *      hàm/dòng/UTCID, dấu O, kết quả), trùng tên ⇒ hậu tố " (restored)".
 *   3. Trưởng nhóm duyệt yêu cầu ⇒ thay thế chạy dưới quyền người gửi, vẫn vào thùng rác (ghi requestId); từ chối ⇒ không gì.
 *   4. Xoá đơn lẻ của thành viên ⇒ chạy + thùng rác + hoàn tác; lưu ma trận làm mất UTCID ⇒ thùng rác ⇒ thêm lại.
 *   5. AI (MCP, token ctw_ — kể cả token của trưởng nhóm) ⇒ lệnh xoá LUÔN thành yêu cầu; duyệt chỉ trên web (token ⇒ 403);
 *      token REST DELETE ⇒ yêu cầu (tuyến có cửa) hoặc 403; AI lưu ma trận làm mất UTCID ⇒ 409.
 *   6. Xoá vĩnh viễn chỉ ADMIN; module 5.2 + test cycle (lịch sử chạy) khôi phục được.
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
const tag = `tr${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — thùng rác 30 ngày + yêu cầu xoá chờ trưởng nhóm duyệt', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U;
  let wsId = 0, pid = 0, pidSrc = 0;
  let devTok = '', leadTok = '';
  let rpcId = 0;
  let xlsx = Buffer.alloc(0);

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
  async function upload(u: { token: string }, path: string, buf: Buffer) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', Authorization: `Bearer ${u.token}` }, body: new Uint8Array(buf) });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json, code: json?.error?.code ?? json?.code };
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args } }),
    });
    const b = (await res.json()) as any;
    if (b.error) return { isError: true, text: String(b.error.message), out: null as any };
    const text = String(b.result.content[0].text);
    let out: any = null;
    try { out = JSON.parse(text); } catch { /* chữ */ }
    return { isError: b.result.isError === true, text, out };
  }
  const unitList = async () => (await call(lead, 'GET', `/projects/${pid}/fpt-tests/unit`)).data.functions as Array<{ id: number; moduleName: string; methodName: string }>;
  const fullFn = (id: number) => prisma.workUnitFunction.findUniqueOrThrow({
    where: { id },
    include: { rows: { orderBy: { id: 'asc' } }, cases: { orderBy: { id: 'asc' }, include: { marks: { orderBy: [{ rowId: 'asc' }, { caseId: 'asc' }] } } } },
  });

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
    wsId = (await call(lead, 'POST', '/workspaces', { name: `TR ${tag}` })).data.id;
    await call(lead, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email], role: 'MEMBER' });
    pid = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'SWT', name: 'SWT301 LAB', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    pidSrc = (await call(lead, 'POST', `/workspaces/${wsId}/projects`, { key: 'SRC', name: 'Excel source', template: 'BLANK', kind: 'SCHOOL', visibility: 'PRIVATE' })).data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    devTok = (await call(dev, 'POST', '/me/api-tokens', { name: 'CuongMini · dev', scopes: ['read', 'write'] })).data.token;
    leadTok = (await call(lead, 'POST', '/me/api-tokens', { name: 'CuongMini · lead', scopes: ['read', 'write'] })).data.token;
    // Tệp Excel đúng mẫu có MỘT hàm (như tệp thành viên đã nhập lúc 23:49).
    await call(lead, 'POST', `/projects/${pidSrc}/fpt-tests/unit`, { moduleName: 'Upload', methodName: 'onlyOne' });
    const res = await fetch(`${base}/api/v1/work/projects/${pidSrc}/fpt-tests/export?report=unit`, { headers: { Authorization: `Bearer ${lead.token}` } });
    xlsx = Buffer.from(await res.arrayBuffer());
    assert.equal(res.status, 200);
  });

  after(async () => {
    server?.close();
    await prisma.workAiCall.deleteMany({ where: { OR: [{ workspaceId: wsId }, { userId: { in: userIds } }] } }).catch(() => undefined);
    await prisma.workInvite.deleteMany({ where: { workspaceId: wsId } });
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.workDeleteRequest.deleteMany({ where: { requestedById: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.workApiToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  let fnIds: number[] = [];
  let snapA: Awaited<ReturnType<typeof fullFn>>;

  it('dựng bảng 5.1: 3 hàm, hàm A có ma trận đầy đủ (dòng, UTCID, dấu O, kết quả)', async () => {
    for (const m of ['login', 'register', 'resetPassword']) {
      const r = await call(dev, 'POST', `/projects/${pid}/fpt-tests/unit`, { moduleName: 'AuthService', methodName: m, loc: 40 });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      fnIds.push(r.data.id);
    }
    const save = await call(dev, 'PUT', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}/matrix`, {
      rows: [
        { key: 'a', section: 'COND', groupName: 'email', value: 'a@b.co' },
        { key: 'b', section: 'COND', groupName: 'email', value: '' },
        { key: 'c', section: 'CONFIRM', groupName: 'Return', value: 'true' },
        { key: 'd', section: 'CONFIRM', groupName: 'Exception', value: 'InvalidEmail' },
      ],
      cases: [
        { key: 'x', type: 'N', result: 'P', executedAt: '2026-10-22' },
        { key: 'y', type: 'A', result: 'F', defectId: 'BUG-7' },
        { key: 'z', type: 'B' },
      ],
      marks: [['a', 'x'], ['c', 'x'], ['b', 'y'], ['d', 'y'], ['b', 'z'], ['d', 'z']],
    });
    assert.equal(save.status, 200, JSON.stringify(save.raw));
    await call(dev, 'POST', `/projects/${pid}/fpt-tests/changes`, { report: 'UNIT', effectiveDate: '2026-10-22', version: '1.0', action: 'A', description: 'Unit test doc' });
    snapA = await fullFn(fnIds[0]);
    assert.equal(snapA.cases.length, 3);
  });

  let devRequestId = 0;
  it('thành viên "Nhập Excel → Thay thế" ⇒ KHÔNG xoá gì, thành yêu cầu chờ trưởng nhóm (kèm tệp), trưởng nhóm được báo', async () => {
    const dry = await upload(dev, `/projects/${pid}/fpt-tests/import?dryRun=1&report=unit`, xlsx);
    assert.deepEqual(dry.data.replaceDeletes, { items: 3, changes: 1 });
    assert.equal(dry.data.replaceNeedsApproval, true);
    const r = await upload(dev, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit`, xlsx);
    assert.equal(r.status, 202, JSON.stringify(r.raw));
    assert.equal(r.data.queued.status, 'PENDING');
    assert.ok(r.data.queued.approvers.some((a: any) => a.id === lead.id));
    assert.match(r.data.queued.message, /NOTHING was deleted/);
    devRequestId = r.data.queued.id;
    assert.equal((await unitList()).length, 3, 'chưa xoá gì');
    const row = await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id: devRequestId } });
    assert.ok(row.file && row.file.length === xlsx.length, 'giữ đúng tệp để chạy khi duyệt');
    assert.equal(row.via, 'web');
    const bell = await prisma.socialNotification.findFirst({ where: { receiverId: lead.id, senderId: dev.id, type: 'WORK_ALERT' }, orderBy: { id: 'desc' } });
    assert.ok(bell, 'trưởng nhóm có thông báo');
    // Thành viên không duyệt được yêu cầu của chính mình.
    assert.equal((await call(dev, 'POST', `/delete-requests/${devRequestId}/approve`, {})).status, 403);
    const list = await call(dev, 'GET', `/projects/${pid}/trash/requests`);
    assert.equal(list.data.canDecide, false);
    assert.ok(list.data.requests.some((x: any) => x.id === devRequestId));
    assert.ok((await call(lead, 'GET', '/me/delete-requests')).data.some((x: any) => x.id === devRequestId));
  });

  let replaceTrash = 0;
  it('ADMIN "Thay thế" phải gõ đúng số hàm; chạy ⇒ hàm cũ vào thùng rác MỘT mục', async () => {
    const no = await upload(lead, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit`, xlsx);
    assert.equal(no.status, 400);
    assert.equal(no.code, 'WORK_CONFIRM_REQUIRED');
    const wrong = await upload(lead, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit&confirm=1`, xlsx);
    assert.equal(wrong.code, 'WORK_CONFIRM_REQUIRED');
    assert.equal((await unitList()).length, 3);
    const r = await upload(lead, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit&confirm=3`, xlsx);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    replaceTrash = r.data.trashId;
    assert.ok(replaceTrash);
    assert.deepEqual((await unitList()).map((f) => f.methodName), ['onlyOne']);
    const bin = await call(dev, 'GET', `/projects/${pid}/trash/data`);
    assert.equal(bin.status, 200);
    const item = bin.data.items.find((x: any) => x.id === replaceTrash);
    assert.equal(item.kind, 'fpt.import_replace');
    assert.equal(item.itemCount, 3);
    assert.equal(item.deletedBy.id, lead.id);
    assert.equal(bin.data.canPurge, false, 'thành viên không xoá vĩnh viễn');
  });

  it('khôi phục ⇒ Y NGUYÊN: giữ id hàm/dòng/UTCID, dấu O, kết quả; không đụng hàm vừa nhập', async () => {
    const r = await call(dev, 'POST', `/projects/${pid}/trash/data/${replaceTrash}/restore`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const list = await unitList();
    assert.deepEqual(list.map((f) => f.methodName).sort(), ['login', 'onlyOne', 'register', 'resetPassword']);
    for (const id of fnIds) assert.ok(list.some((f) => f.id === id), `giữ id ${id}`);
    const a = await fullFn(fnIds[0]);
    assert.deepEqual(a.rows.map((x) => [x.id, x.section, x.groupName, x.value]), snapA.rows.map((x) => [x.id, x.section, x.groupName, x.value]));
    assert.deepEqual(a.cases.map((x) => [x.id, x.type, x.result, x.defectId, x.executedAt?.toISOString() ?? null]), snapA.cases.map((x) => [x.id, x.type, x.result, x.defectId, x.executedAt?.toISOString() ?? null]));
    assert.deepEqual(a.cases.flatMap((c) => c.marks.map((m) => [m.rowId, m.caseId])), snapA.cases.flatMap((c) => c.marks.map((m) => [m.rowId, m.caseId])));
    const doc = await call(lead, 'GET', `/projects/${pid}/fpt-tests/doc`);
    assert.ok(doc.data.changes.some((c: any) => c.description === 'Unit test doc'), 'Record of change cũ quay lại');
    // Khôi phục lần hai ⇒ 409; mục rời danh sách.
    assert.equal((await call(dev, 'POST', `/projects/${pid}/trash/data/${replaceTrash}/restore`)).status, 409);
    assert.ok(!(await call(dev, 'GET', `/projects/${pid}/trash/data`)).data.items.some((x: any) => x.id === replaceTrash));
  });

  it('trưởng nhóm DUYỆT yêu cầu của thành viên ⇒ thay thế chạy (vẫn vào thùng rác, ghi requestId); trùng tên khi khôi phục ⇒ hậu tố', async () => {
    const a = await call(lead, 'POST', `/delete-requests/${devRequestId}/approve`, {});
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.status, 'APPROVED', a.data.error);
    assert.deepEqual((await unitList()).map((f) => f.methodName), ['onlyOne']);
    const t = await prisma.workTrashItem.findFirstOrThrow({ where: { requestId: devRequestId } });
    assert.equal(t.source, 'approved');
    assert.equal(t.deletedById, dev.id, 'chạy dưới quyền người gửi');
    assert.equal((await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id: devRequestId } })).file, null, 'bỏ tệp sau khi quyết');
    assert.equal((await call(lead, 'POST', `/delete-requests/${devRequestId}/approve`, {})).status, 409, 'không chạy hai lần');
    // Hàm "onlyOne" cũ (từ lần nhập trước) trùng tên với "onlyOne" vừa nhập ⇒ khôi phục kèm hậu tố, không ghi đè.
    const r = await call(lead, 'POST', `/projects/${pid}/trash/data/${t.id}/restore`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const names = (await unitList()).map((f) => f.methodName).sort();
    assert.deepEqual(names, ['login', 'onlyOne', 'onlyOne (restored)', 'register', 'resetPassword']);
  });

  it('từ chối ⇒ không chạy gì; người gửi rút lại được yêu cầu của mình', async () => {
    const q1 = await upload(dev, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit`, xlsx);
    assert.equal(q1.status, 202);
    const rj = await call(lead, 'POST', `/delete-requests/${q1.data.queued.id}/reject`, { note: 'Không thay thế, nhập thêm thôi' });
    assert.equal(rj.data.status, 'REJECTED');
    assert.equal((await unitList()).length, 5);
    const q2 = await upload(dev, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit`, xlsx);
    assert.equal((await call(lead, 'POST', `/delete-requests/${q2.data.queued.id}/cancel`)).status, 403, 'chỉ người gửi rút');
    assert.equal((await call(dev, 'POST', `/delete-requests/${q2.data.queued.id}/cancel`)).data.status, 'CANCELLED');
    assert.equal((await unitList()).length, 5);
  });

  it('xoá đơn lẻ của thành viên ⇒ chạy ngay + thùng rác + hoàn tác (giữ id)', async () => {
    const id = fnIds[1];
    const d = await call(dev, 'DELETE', `/projects/${pid}/fpt-tests/unit/${id}`);
    assert.equal(d.status, 200, JSON.stringify(d.raw));
    assert.equal(d.data.deleted, true);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${id}`)).status, 404);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/trash/data/${d.data.trashId}/restore`)).status, 200);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${id}`)).status, 200, 'cùng id');
  });

  it('lưu ma trận làm MẤT UTCID ⇒ UTCID vào thùng rác ⇒ khôi phục thêm lại vào cuối', async () => {
    const f = (await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}`)).data;
    const keep = f.cases[0];
    const s = await call(dev, 'PUT', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}/matrix`, {
      version: f.updatedAt,
      rows: f.rows.map((r: any) => ({ key: `r${r.id}`, section: r.section, groupName: r.groupName, label: r.label, value: r.value })),
      cases: [{ key: `c${keep.id}`, type: keep.type, result: keep.result, executedAt: keep.executedAt, defectId: keep.defectId, note: keep.note }],
      marks: keep.rowIds.map((rid: number) => [`r${rid}`, `c${keep.id}`]),
    });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.equal(s.data.cases.length, 1);
    assert.equal(s.data.trashed.cases, 2);
    const r = await call(dev, 'POST', `/projects/${pid}/trash/data/${s.data.trashed.id}/restore`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const after = (await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}`)).data;
    assert.deepEqual(after.cases.map((c: any) => [c.type, c.result, c.defectId]), [['N', 'P', null], ['A', 'F', 'BUG-7'], ['B', null, null]]);
    assert.equal(after.rows.length, 4, 'dòng trùng nội dung dùng lại, không nhân đôi');
    assert.deepEqual(after.cases.map((c: any) => c.rowIds.length), [2, 2, 2]);
  });

  it('AI qua MCP: lệnh xoá LUÔN thành yêu cầu — kể cả token của trưởng nhóm; duyệt chỉ trên web', async () => {
    const before = (await unitList()).length;
    const r = await tool(devTok, 'fpt_unit_delete_function', { project: 'SWT', function: fnIds[2] });
    assert.equal(r.isError, false, r.text);
    assert.equal(r.out.status, 'PENDING_APPROVAL');
    assert.equal(r.out.deleted, false);
    assert.ok(r.out.waitingFor.includes(`@${lead.username}`));
    assert.match(r.out.message, /NOTHING was deleted/);
    const mine = await tool(leadTok, 'fpt_unit_delete_function', { project: 'SWT', function: fnIds[2] });
    assert.equal(mine.out.status, 'PENDING_APPROVAL', 'trưởng nhóm qua AI cũng phải duyệt trên web');
    const imp = await tool(devTok, 'fpt_import_excel', { project: 'SWT', base64: xlsx.toString('base64'), report: 'unit', mode: 'replace' });
    assert.equal(imp.out.status, 'PENDING_APPROVAL', 'nhập thay thế qua AI');
    assert.equal((await unitList()).length, before, 'chưa xoá gì');
    const row = await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id: r.out.request } });
    assert.equal(row.via, 'ai');
    assert.equal(row.aiClient, 'cuongmini');
    // Token (kể cả của trưởng nhóm) không duyệt được.
    const viaToken = await fetch(`${base}/api/v1/work/delete-requests/${mine.out.request}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${leadTok}`, 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(viaToken.status, 403);
    const ok = await call(lead, 'POST', `/delete-requests/${r.out.request}/approve`, {});
    assert.equal(ok.data.status, 'APPROVED', ok.data.error);
    assert.equal((await call(lead, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[2]}`)).status, 404);
    assert.equal(ok.data.result.trash.length, 1, 'xoá do AI vẫn vào thùng rác');
    // Yêu cầu thứ hai cùng hàm ⇒ chạy lại thì hàm không còn ⇒ FAILED (không phá gì thêm).
    const second = await call(lead, 'POST', `/delete-requests/${mine.out.request}/approve`, {});
    assert.equal(second.data.status, 'FAILED');
    await call(lead, 'POST', `/delete-requests/${imp.out.request}/reject`, {});
    await call(dev, 'POST', `/projects/${pid}/trash/data/${ok.data.result.trash[0].id}/restore`);
  });

  it('AI lưu ma trận làm mất UTCID ⇒ 409 (phải dùng lệnh xoá có duyệt); token REST DELETE ⇒ yêu cầu hoặc 403', async () => {
    const f = (await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}`)).data;
    const rest = await fetch(`${base}/api/v1/work/projects/${pid}/fpt-tests/unit/${fnIds[0]}/matrix`, {
      method: 'PUT', headers: { Authorization: `Bearer ${devTok}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: f.rows.map((r: any) => ({ key: String(r.id), section: r.section, groupName: r.groupName, value: r.value })), cases: [], marks: [] }),
    });
    assert.equal(rest.status, 409);
    { const j = (await rest.json()) as any; assert.equal(j.error?.code ?? j.code, 'WORK_DELETE_NEEDS_APPROVAL'); }
    const del = await fetch(`${base}/api/v1/work/projects/${pid}/fpt-tests/unit/${fnIds[1]}`, { method: 'DELETE', headers: { Authorization: `Bearer ${leadTok}` } });
    assert.equal(del.status, 202, 'tuyến có cửa ⇒ yêu cầu, kể cả token trưởng nhóm');
    const body = (await del.json()) as any;
    assert.equal(body.data.queued.via, 'token');
    assert.equal((await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[1]}`)).status, 200);
    await call(lead, 'POST', `/delete-requests/${body.data.queued.id}/reject`, {});
    const other = await fetch(`${base}/api/v1/work/projects/${pid}/trash/data/1`, { method: 'DELETE', headers: { Authorization: `Bearer ${leadTok}` } });
    assert.equal(other.status, 403);
    { const j = (await other.json()) as any; assert.equal(j.error?.code ?? j.code, 'WORK_TOKEN_DELETE_NEEDS_APPROVAL'); }
  });

  it('module 5.2 + test cycle (lịch sử chạy) vào thùng rác; xoá vĩnh viễn chỉ ADMIN', async () => {
    const m = await call(dev, 'POST', `/projects/${pid}/fpt-tests/integration`, { name: 'Auth flow' });
    await call(dev, 'PUT', `/projects/${pid}/fpt-tests/integration/${m.data.id}/cases`, { cases: [{ description: 'login ok', rounds: [{ status: 'Passed', date: '2026-10-22', tester: 'Long' }] }, { description: 'logout' }] });
    const d = await call(dev, 'DELETE', `/projects/${pid}/fpt-tests/integration/${m.data.id}`);
    assert.equal(d.status, 200);
    await call(dev, 'POST', `/projects/${pid}/fpt-tests/integration`, { name: 'Auth flow' });
    assert.equal((await call(dev, 'POST', `/projects/${pid}/trash/data/${d.data.trashId}/restore`)).status, 200);
    const mods = (await call(dev, 'GET', `/projects/${pid}/fpt-tests/integration`)).data.modules.map((x: any) => x.name).sort();
    assert.deepEqual(mods, ['Auth flow', 'Auth flow (restored)']);
    const back = await call(dev, 'GET', `/projects/${pid}/fpt-tests/integration/${m.data.id}`);
    assert.equal(back.data.cases[0].rounds[0].status, 'Passed');

    // Bớt case 5.2 ⇒ vào thùng rác ⇒ thêm lại
    const s = await call(dev, 'PUT', `/projects/${pid}/fpt-tests/integration/${m.data.id}/cases`, { cases: [{ description: 'login ok', rounds: [{ status: 'Passed', date: '2026-10-22', tester: 'Long' }] }] });
    assert.equal(s.data.trashed.cases, 1);
    await call(dev, 'POST', `/projects/${pid}/trash/data/${s.data.trashed.id}/restore`);
    assert.equal((await call(dev, 'GET', `/projects/${pid}/fpt-tests/integration/${m.data.id}`)).data.cases.length, 2);

    // Test cycle có lần chạy ⇒ xoá ⇒ khôi phục đủ lần chạy
    await call(lead, 'POST', `/projects/${pid}/tests/enable`, {});
    const t = await tool(devTok, 'test_create', { project: 'SWT', title: 'Login works', steps: [{ action: 'open' }] });
    const cy = await tool(devTok, 'test_cycle_create', { project: 'SWT', name: 'Sprint 1', tests: [t.out.number] });
    const runs = await prisma.workTestRun.count({ where: { cycleId: cy.out.cycle } });
    assert.ok(runs >= 1);
    const dc = await call(dev, 'DELETE', `/projects/${pid}/test-cycles/${cy.out.cycle}`);
    assert.ok([200, 204].includes(dc.status), JSON.stringify(dc.raw));
    assert.equal(await prisma.workTestCycle.count({ where: { id: cy.out.cycle } }), 0);
    const item = (await call(dev, 'GET', `/projects/${pid}/trash/data`)).data.items.find((x: any) => x.kind === 'graph.work_test_cycles');
    assert.ok(item);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/trash/data/${item.id}/restore`)).status, 200);
    assert.equal(await prisma.workTestRun.count({ where: { cycleId: cy.out.cycle } }), runs);

    // Xoá vĩnh viễn: thành viên 403, ADMIN được
    const d2 = await call(dev, 'DELETE', `/projects/${pid}/fpt-tests/unit/${fnIds[1]}`);
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/trash/data/${d2.data.trashId}`)).status, 403);
    assert.equal((await call(lead, 'DELETE', `/projects/${pid}/trash/data/${d2.data.trashId}`)).status, 200);
    assert.equal(await prisma.workTrashItem.count({ where: { id: d2.data.trashId } }), 0);
  });

  it('Hỏi AI (web): Apply một đề xuất XOÁ ⇒ chỉ tạo yêu cầu PENDING, dữ liệu chưa bị xoá (kể cả trưởng nhóm bấm)', async () => {
    for (const who of [dev, lead]) {
      const r = await call(who, 'POST', `/projects/${pid}/ai/apply`, {
        action: { type: 'command', command: 'fpt_unit_delete_function', args: { function: fnIds[0] }, summary: 'Xoá hàm login' },
      });
      assert.equal(r.status, 200, JSON.stringify(r.raw));
      assert.match(r.data.summary, /NOTHING was deleted/);
      const q = await prisma.workDeleteRequest.findFirstOrThrow({ where: { requestedById: who.id, projectId: pid }, orderBy: { id: 'desc' } });
      assert.equal(q.status, 'PENDING');
      assert.equal(q.via, 'ai');
      assert.equal(q.aiClient, 'web');
      assert.equal((q.params as any).tool, 'fpt_unit_delete_function');
      assert.equal((await call(dev, 'GET', `/projects/${pid}/fpt-tests/unit/${fnIds[0]}`)).status, 200, 'chưa xoá gì');
      await call(lead, 'POST', `/delete-requests/${q.id}/reject`, {});
    }
  });

  it('cron dọn: mục quá 30 ngày rời thùng rác; yêu cầu quá 7 ngày ⇒ EXPIRED', async () => {
    const { sweepTrash } = await import('../services/work/trashBin.service.js');
    const { expireRequests } = await import('../services/work/deleteRequests.service.js');
    const old = await prisma.workTrashItem.findFirstOrThrow({ where: { projectId: pid, restoredAt: null } });
    await prisma.workTrashItem.update({ where: { id: old.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const q = await upload(dev, `/projects/${pid}/fpt-tests/import?mode=replace&report=unit`, xlsx);
    await prisma.workDeleteRequest.update({ where: { id: q.data.queued.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.ok((await sweepTrash()) >= 1);
    assert.ok((await expireRequests()) >= 1);
    assert.equal(await prisma.workTrashItem.count({ where: { id: old.id } }), 0);
    assert.equal((await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id: q.data.queued.id } })).status, 'EXPIRED');
    assert.equal((await call(lead, 'POST', `/delete-requests/${q.data.queued.id}/approve`, {})).status, 409);
  });
});
