/**
 * Tài liệu dự án đợt S2a — API qua HTTP thật trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.docs.db.test.ts
 *
 * Phủ: dự án CŨ + dự án School không đổi (mô-đun docs tắt ⇒ MODULE_DISABLED, người
 * ngoài ⇒ 404), CRUD + cây + kéo thả (chặn vòng), tạo từ mẫu SRS, quyền xem/sửa
 * theo vai + visibility (khách chỉ thấy trang CLIENT, 404 với trang nội bộ),
 * phiên bản (gộp lưu liên tiếp, xung đột version, so sánh, khôi phục chỉ chủ/ADMIN),
 * phê duyệt DOC (IN_REVIEW → APPROVED, sửa sau duyệt ⇒ lệch chữ ký), liên kết thẻ
 * hai chiều, bình luận, tìm kiếm (dự án + toàn cục), xuất Markdown, xoá cả cây con,
 * dựng cây tài liệu cho dự án CLIENT từ phiếu khách. Email bị chặn.
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
const tag = `wd${Date.now().toString(36)}`;
const userIds: number[] = [];
const requestIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — tài liệu dự án S2a (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, member2: U, viewer: U, client: U, outsider: U;
  let wsId = 0;
  let oldPid = 0;
  let schoolPid = 0;
  let clPid = 0;
  let cl: any;
  let srsNum = 0;
  let childNum = 0;
  let issueNum = 0;

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
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json };
  }

  const doc = (...paras: string[]) => ({ type: 'doc', content: paras.map((t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] })) });
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, member2, viewer, client, outsider] = await Promise.all(['owner', 'member', 'member2', 'viewer', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (requestIds.length) await prisma.projectRequest.deleteMany({ where: { id: { in: requestIds } } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng không gian + dự án cũ (không mô-đun), School, Client (docs bật mặc định)', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Docs ${tag}` });
    assert.equal(ws.status, 201);
    wsId = ws.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email, member2.email, viewer.email], role: 'MEMBER' });
    const old = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old', template: 'SWP391' });
    oldPid = old.data.id;
    // Đưa về đúng hình dạng dòng trước lớp studio (không kind, không settings.modules).
    const row = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid }, select: { settings: true } });
    const { modules: _m, ...legacy } = row.settings as Record<string, unknown>;
    await prisma.workProject.update({ where: { id: oldPid }, data: { kind: null, settings: legacy as object } });
    const sc = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SCH', name: 'School', template: 'SWP391', kind: 'SCHOOL' });
    schoolPid = sc.data.id;
    assert.equal(sc.data.modules.docs, false, 'School: docs tắt');
    const c = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CL', name: 'Client', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(c.status, 201);
    clPid = c.data.id;
    assert.equal(c.data.modules.docs, true, 'CLIENT: docs bật mặc định');
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [client.email], role: 'GUEST', projectId: clPid, projectRole: 'CLIENT' });
    await call(owner, 'PUT', `/projects/${clPid}/members/${viewer.id}`, { role: 'VIEWER' });
    cl = (await call(owner, 'GET', `/projects/${clPid}`)).data;
    assert.equal(cl.permissions.editDocs, true);
    const asClient = (await call(client, 'GET', `/projects/${clPid}`)).data;
    assert.deepEqual([asClient.permissions.viewAllDocs, asClient.permissions.editDocs], [false, false]);
  });

  it('dự án CŨ + School: mọi route tài liệu ⇒ 403 MODULE_DISABLED; người ngoài ⇒ 404; dự án cũ không bị ghi gì', async () => {
    for (const pid of [oldPid, schoolPid]) {
      for (const [m, path] of [['GET', `/projects/${pid}/pages`], ['POST', `/projects/${pid}/pages`], ['GET', `/projects/${pid}/doc-templates`], ['GET', `/projects/${pid}/pages/search?q=ab`]] as const) {
        const r = await call(owner, m, path, m === 'POST' ? { title: 'x' } : undefined);
        assert.equal(r.status, 403, `${m} ${path}`);
        assert.equal(r.code, 'MODULE_DISABLED');
      }
      assert.equal((await call(outsider, 'GET', `/projects/${pid}/pages`)).status, 404);
    }
    const legacy = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid }, select: { kind: true, settings: true } });
    assert.equal(legacy.kind, null);
    assert.equal((legacy.settings as any).modules, undefined, 'dự án cũ vẫn không có settings.modules');
    assert.equal(await prisma.workPage.count({ where: { projectId: { in: [oldPid, schoolPid] } } }), 0);
    // Duyệt DOC ở dự án không bật docs ⇒ cũng bị chặn.
    await call(owner, 'PUT', `/projects/${schoolPid}/studio`, { modules: { approvals: true } });
    const ap = await call(owner, 'POST', `/projects/${schoolPid}/approvals`, { targetType: 'DOC', pageNumber: 1, approverIds: [owner.id] });
    assert.equal(ap.code, 'MODULE_DISABLED');
  });

  it('thư viện mẫu + tạo trang từ mẫu SRS (tiêu đề tiếng Anh, có đề mục + bảng, phiên bản 1 CREATE)', async () => {
    const lib = await call(member, 'GET', `/projects/${clPid}/doc-templates`);
    assert.equal(lib.status, 200);
    assert.equal(lib.data.length, 36);
    const srsInfo = lib.data.find((t: any) => t.key === 'srs');
    assert.equal(srsInfo.title, 'Software requirements specification (SRS)');
    const prev = await call(member, 'GET', `/projects/${clPid}/doc-templates/srs`);
    assert.equal(prev.data.contentJson.type, 'doc');
    const p = await call(member, 'POST', `/projects/${clPid}/pages`, { templateKey: 'srs' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    srsNum = p.data.number;
    assert.equal(p.data.title, 'Software requirements specification (SRS)');
    assert.equal(p.data.status, 'DRAFT');
    assert.equal(p.data.visibility, 'INTERNAL');
    assert.equal(p.data.ownerId, member.id);
    assert.equal(p.data.templateKey, 'srs');
    const types = JSON.stringify(p.data.contentJson);
    assert.ok(types.includes('"heading"') && types.includes('"table"'));
    assert.equal(p.data.currentVersion, 1);
    const v = await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}/versions`);
    assert.deepEqual(v.data.map((x: any) => [x.n, x.kind]), [[1, 'CREATE']]);
    // Trang con.
    const child = await call(member, 'POST', `/projects/${clPid}/pages`, { title: 'Use case details', parentNumber: srsNum, contentJson: doc('UC-01 Login') });
    childNum = child.data.number;
    assert.deepEqual(child.data.ancestors.map((a: any) => a.number), [srsNum]);
    const tree = await call(viewer, 'GET', `/projects/${clPid}/pages`);
    assert.equal(tree.data.pages.length, 2);
    assert.equal(tree.data.pages.find((x: any) => x.number === childNum).parentId, p.data.id);
    assert.equal(tree.data.canEdit, false, 'VIEWER chỉ xem');
  });

  it('quyền: VIEWER/khách không sửa; khách chỉ thấy trang CLIENT (trang nội bộ ⇒ 404); đổi hiển thị chỉ chủ/ADMIN', async () => {
    assert.equal((await call(viewer, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { title: 'hack' })).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${clPid}/pages`, { title: 'x' })).status, 403);
    assert.equal((await call(client, 'GET', `/projects/${clPid}/pages/${srsNum}`)).status, 404);
    assert.equal((await call(client, 'GET', `/projects/${clPid}/pages`)).data.pages.length, 0);
    assert.equal((await call(client, 'POST', `/projects/${clPid}/pages`, { title: 'x' })).status, 403);
    // member2 (không phải chủ) không mở trang cho khách được.
    const no = await call(member2, 'PATCH', `/projects/${clPid}/pages/${childNum}`, { visibility: 'CLIENT' });
    assert.equal(no.status, 403);
    const yes = await call(member, 'PATCH', `/projects/${clPid}/pages/${childNum}`, { visibility: 'CLIENT' });
    assert.equal(yes.status, 200);
    const seen = await call(client, 'GET', `/projects/${clPid}/pages`);
    assert.deepEqual(seen.data.pages.map((x: any) => [x.number, x.parentId]), [[childNum, null]], 'trang con nổi lên gốc vì cha là trang nội bộ');
    const read = await call(client, 'GET', `/projects/${clPid}/pages/${childNum}`);
    assert.equal(read.status, 200);
    assert.deepEqual(read.data.ancestors, [], 'không lộ tiêu đề trang cha nội bộ');
    assert.equal(read.data.canEdit, false);
    assert.equal((await call(client, 'PATCH', `/projects/${clPid}/pages/${childNum}`, { title: 'x' })).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${clPid}/pages/${childNum}`)).status, 404);
  });

  it('phiên bản: gộp lưu liên tiếp, xung đột version ⇒ 409, ghi chú ⇒ bản riêng, so sánh, khôi phục (chỉ chủ/ADMIN)', async () => {
    let p = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    const e1 = await call(member, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { contentJson: doc('Draft one', 'FR-01 Login'), version: p.version });
    assert.equal(e1.status, 200, JSON.stringify(e1.raw));
    assert.equal(e1.data.currentVersion, 2, 'sửa sau bản CREATE ⇒ bản mới');
    const e2 = await call(member, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { contentJson: doc('Draft two', 'FR-01 Login'), version: e1.data.version });
    assert.equal(e2.data.currentVersion, 2, 'cùng người trong vài phút ⇒ gộp vào bản 2');
    const stale = await call(member2, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { title: 'Stale', version: e1.data.version });
    assert.equal(stale.status, 409);
    assert.equal(stale.code, 'WORK_PAGE_CONFLICT');
    // Người khác sửa ⇒ bản mới (không gộp vào bản của người khác).
    const e3 = await call(member2, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { contentJson: doc('Draft two', 'FR-01 Login', 'FR-02 Logout'), version: e2.data.version });
    assert.equal(e3.data.currentVersion, 3);
    // Quá cửa sổ gộp ⇒ bản mới dù cùng người.
    await prisma.workPageVersion.updateMany({ where: { page: { projectId: clPid, number: srsNum }, n: 3 }, data: { createdAt: new Date(Date.now() - 3_600_000) } });
    const e4 = await call(member2, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { contentJson: doc('Draft two', 'FR-01 Login', 'FR-02 Logout v2'), version: e3.data.version });
    assert.equal(e4.data.currentVersion, 4);
    const e5 = await call(member, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { versionNote: 'Sent to client', version: e4.data.version });
    assert.equal(e5.data.currentVersion, 5);
    const list = (await call(viewer, 'GET', `/projects/${clPid}/pages/${srsNum}/versions`)).data;
    assert.deepEqual(list.map((v: any) => v.kind), ['MANUAL', 'EDIT', 'EDIT', 'EDIT', 'CREATE']);
    assert.equal(list[0].note, 'Sent to client');
    const cmp = await call(viewer, 'GET', `/projects/${clPid}/pages/${srsNum}/versions/compare?from=2&to=current`);
    assert.equal(cmp.status, 200);
    assert.ok(cmp.data.lines.some((l: any) => l.op === 'add' && l.text.includes('FR-02 Logout v2')));
    assert.ok(cmp.data.lines.some((l: any) => l.op === 'eq' && l.text.includes('FR-01 Login')));
    const one = await call(viewer, 'GET', `/projects/${clPid}/pages/${srsNum}/versions/1`);
    assert.ok(JSON.stringify(one.data.contentJson).includes('"table"'));
    // Khôi phục: member2 không phải chủ ⇒ 403; VIEWER ⇒ 403; chủ ⇒ bản RESTORE với nội dung bản 1.
    assert.equal((await call(member2, 'POST', `/projects/${clPid}/pages/${srsNum}/versions/1/restore`)).status, 403);
    assert.equal((await call(viewer, 'POST', `/projects/${clPid}/pages/${srsNum}/versions/1/restore`)).status, 403);
    const r = await call(member, 'POST', `/projects/${clPid}/pages/${srsNum}/versions/1/restore`);
    assert.equal(r.status, 200);
    assert.equal(r.data.currentVersion, 6);
    assert.equal(JSON.stringify(r.data.contentJson), JSON.stringify(one.data.contentJson));
    const after = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}/versions`)).data[0];
    assert.equal(after.kind, 'RESTORE');
    // ADMIN dự án khôi phục được trang người khác.
    assert.equal((await call(owner, 'POST', `/projects/${clPid}/pages/${srsNum}/versions/2/restore`)).status, 200);
    p = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    assert.ok(p.contentText.includes('Draft two'));
  });

  it('phê duyệt DOC: gửi ⇒ IN_REVIEW, duyệt ⇒ APPROVED, sửa sau duyệt ⇒ lệch chữ ký; khách không đứng tên trang nội bộ', async () => {
    const bad = await call(member, 'POST', `/projects/${clPid}/approvals`, { targetType: 'DOC', pageNumber: srsNum, approverIds: [client.id] });
    assert.equal(bad.status, 400);
    // Khách cổng (dự án CLIENT bật clientPortal) ⇒ mã riêng từ 04/10/2026 (vá rủi ro S2b).
    assert.equal(bad.code, 'WORK_APPROVER_NOT_CLIENT_VISIBLE');
    const a = await call(member, 'POST', `/projects/${clPid}/approvals`, { targetType: 'DOC', pageNumber: srsNum, approverIds: [owner.id] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.targetType, 'DOC');
    assert.equal(a.data.page.number, srsNum);
    let p = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    assert.equal(p.status, 'IN_REVIEW');
    assert.equal(p.approval.status, 'PENDING');
    // Trạng thái APPROVED không đặt tay được khi có mô-đun approvals.
    assert.equal((await call(owner, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { status: 'APPROVED' })).code, 'WORK_PAGE_APPROVAL_REQUIRED');
    const dup = await call(member, 'POST', `/projects/${clPid}/approvals`, { targetType: 'DOC', pageNumber: srsNum, approverIds: [owner.id] });
    assert.equal(dup.status, 409);
    const ok = await call(owner, 'POST', `/projects/${clPid}/approvals/${a.data.id}/decide`, { decision: 'APPROVE' });
    assert.equal(ok.data.status, 'APPROVED');
    p = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    assert.equal(p.status, 'APPROVED');
    assert.equal(p.approval.contentChanged, false);
    // Đổi trạng thái/chủ sở hữu không làm lệch chữ ký; đổi chữ thì lệch.
    await call(member, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { stageId: null });
    assert.equal((await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data.approval.contentChanged, false);
    const ed = await call(member, 'PATCH', `/projects/${clPid}/pages/${srsNum}`, { contentJson: doc('Changed after sign-off'), version: p.version });
    assert.equal(ed.status, 200);
    p = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    assert.equal(p.status, 'APPROVED', 'sửa sau duyệt không tự đổi trạng thái');
    assert.equal(p.approval.contentChanged, true);
    const one = await call(member, 'GET', `/projects/${clPid}/approvals/${a.data.id}`);
    assert.equal(one.data.contentChanged, true);
    const byPage = await call(member, 'GET', `/projects/${clPid}/approvals?page=${srsNum}`);
    assert.deepEqual(byPage.data.map((x: any) => x.id), [a.data.id]);
    // Từ chối ⇒ về DRAFT.
    const a2 = await call(member, 'POST', `/projects/${clPid}/approvals`, { targetType: 'DOC', pageNumber: childNum, approverIds: [client.id] });
    assert.equal(a2.status, 201, 'trang CLIENT ⇒ khách đứng tên duyệt được');
    const rj = await call(client, 'POST', `/projects/${clPid}/approvals/${a2.data.id}/decide`, { decision: 'REJECT', comment: 'Missing UC-02' });
    assert.equal(rj.data.status, 'REJECTED');
    assert.equal((await call(member, 'GET', `/projects/${clPid}/pages/${childNum}`)).data.status, 'DRAFT');
    // Khách không thấy phê duyệt của trang nội bộ.
    const cl1 = await call(client, 'GET', `/projects/${clPid}/approvals?targetType=DOC`);
    assert.deepEqual(cl1.data.map((x: any) => x.id), [a2.data.id]);
    assert.equal((await call(client, 'GET', `/projects/${clPid}/approvals/${a.data.id}`)).status, 404);
  });

  it('liên kết thẻ hai chiều; khách không thấy trang nội bộ qua thẻ', async () => {
    const i = await call(member, 'POST', `/projects/${clPid}/issues`, { typeId: typeId(cl, 'TASK'), title: 'Implement login' });
    issueNum = i.data.number;
    const l1 = await call(member, 'POST', `/projects/${clPid}/pages/${srsNum}/issues`, { issueNumber: issueNum });
    assert.equal(l1.status, 201);
    assert.equal(l1.data[0].key, `CL-${issueNum}`);
    await call(member, 'POST', `/projects/${clPid}/pages/${childNum}/issues`, { issueNumber: issueNum });
    assert.equal((await call(viewer, 'POST', `/projects/${clPid}/pages/${srsNum}/issues`, { issueNumber: issueNum })).status, 403);
    const fromIssue = await call(viewer, 'GET', `/projects/${clPid}/issues/${issueNum}/pages`);
    assert.deepEqual(fromIssue.data.pages.map((p: any) => p.number).sort(), [srsNum, childNum].sort());
    // Cổng khách (S2b, bật mặc định cho dự án CLIENT mới): thẻ chưa chia sẻ ⇒ khách 404; chia sẻ rồi mới đọc được.
    assert.equal((await call(client, 'GET', `/projects/${clPid}/issues/${issueNum}/pages`)).status, 404);
    await call(member, 'PUT', `/projects/${clPid}/issues/${issueNum}/client-visible`, { visible: true });
    const asClient = await call(client, 'GET', `/projects/${clPid}/issues/${issueNum}/pages`);
    assert.deepEqual(asClient.data.pages.map((p: any) => p.number), [childNum]);
    const page = (await call(member, 'GET', `/projects/${clPid}/pages/${srsNum}`)).data;
    assert.equal(page.issues.length, 1);
    const un = await call(member, 'DELETE', `/projects/${clPid}/pages/${childNum}/issues/${issueNum}`);
    assert.equal(un.data.length, 0);
  });

  it('bình luận (@nhắc tên), tìm kiếm, xuất Markdown', async () => {
    const body = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Please review ' }, { type: 'mention', attrs: { id: String(owner.id), label: 'owner' } }] }] };
    const c = await call(member2, 'POST', `/projects/${clPid}/pages/${srsNum}/comments`, { bodyJson: body });
    assert.equal(c.status, 201);
    assert.equal((await call(viewer, 'POST', `/projects/${clPid}/pages/${srsNum}/comments`, { bodyJson: body })).status, 403, 'VIEWER không bình luận');
    const cs = await call(viewer, 'GET', `/projects/${clPid}/pages/${srsNum}/comments`);
    assert.equal(cs.data.length, 1);
    assert.equal(cs.data[0].canDelete, false);
    assert.equal((await call(member, 'DELETE', `/projects/${clPid}/pages/${srsNum}/comments/${c.data.id}`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `/projects/${clPid}/pages/${srsNum}/comments/${c.data.id}`)).status, 200);
    const s = await call(viewer, 'GET', `/projects/${clPid}/pages/search?q=changed after`);
    assert.deepEqual(s.data.map((x: any) => x.number), [srsNum]);
    assert.ok(s.data[0].snippet.toLowerCase().includes('changed after'));
    assert.equal((await call(client, 'GET', `/projects/${clPid}/pages/search?q=changed after`)).data.length, 0);
    const g = await call(member, 'GET', `/search/docs?q=UC-01`);
    assert.ok(g.data.some((x: any) => x.number === childNum && x.project.key === 'CL'));
    assert.equal((await call(outsider, 'GET', `/search/docs?q=UC-01`)).data.length, 0);
    const md = await call(viewer, 'GET', `/projects/${clPid}/pages/${childNum}/markdown`);
    assert.ok(md.data.markdown.startsWith('# Use case details'));
    assert.ok(md.data.filename.startsWith(`CL-DOC-${childNum}-`));
  });

  it('kéo thả: đổi cha + vị trí, chặn thả vào chính con của nó; xoá trang ⇒ xoá cả cây con (chỉ chủ/ADMIN)', async () => {
    const cyc = await call(member, 'POST', `/projects/${clPid}/pages/${srsNum}/move`, { parentNumber: childNum, index: 0 });
    assert.equal(cyc.code, 'WORK_PAGE_CYCLE');
    const third = (await call(member2, 'POST', `/projects/${clPid}/pages`, { title: 'Glossary' })).data;
    const mv = await call(member2, 'POST', `/projects/${clPid}/pages/${childNum}/move`, { parentNumber: null, index: 0 });
    assert.equal(mv.status, 200);
    const roots = mv.data.pages.filter((p: any) => p.parentId === null).sort((a: any, b: any) => a.position - b.position).map((p: any) => p.number);
    assert.deepEqual(roots, [childNum, srsNum, third.number]);
    await call(member2, 'POST', `/projects/${clPid}/pages/${third.number}/move`, { parentNumber: srsNum, index: 0 });
    assert.equal((await call(member2, 'DELETE', `/projects/${clPid}/pages/${srsNum}`)).status, 403, 'không phải chủ');
    const del = await call(member, 'DELETE', `/projects/${clPid}/pages/${srsNum}`);
    assert.equal(del.data.deleted, 2);
    assert.equal((await call(member, 'GET', `/projects/${clPid}/pages/${third.number}`)).status, 404);
    assert.deepEqual((await call(member, 'GET', `/projects/${clPid}/pages`)).data.pages.map((p: any) => p.number), [childNum]);
  });

  it('tắt mô-đun docs ⇒ MODULE_DISABLED; bật lại ⇒ dữ liệu còn nguyên', async () => {
    await call(owner, 'PUT', `/projects/${clPid}/studio`, { modules: { docs: false } });
    assert.equal((await call(member, 'GET', `/projects/${clPid}/pages`)).code, 'MODULE_DISABLED');
    assert.equal((await call(member, 'GET', `/projects/${clPid}/issues/${issueNum}/pages`)).code, 'MODULE_DISABLED');
    await call(owner, 'PUT', `/projects/${clPid}/studio`, { modules: { docs: true } });
    assert.equal((await call(member, 'GET', `/projects/${clPid}/pages`)).data.pages.length, 1);
  });

  it('phiếu khách → dự án CLIENT có sẵn cây tài liệu: gốc + 21 giai đoạn + 35 mẫu, gắn đúng giai đoạn', async () => {
    const { createWorkProjectFromRequest } = await import('../services/projectRequest.service.js');
    const code = `YC-2098-${String(Date.now()).slice(-6)}`;
    const r = await prisma.projectRequest.create({
      data: { code, name: 'Docs client', email: `${tag}_req@test.local`, productTypes: ['WEB'], needs: 'Build a shop', status: 'ACCEPTED', isRoleplay: true },
    });
    requestIds.push(r.id);
    const out = await createWorkProjectFromRequest(owner.id, r.id);
    assert.equal(out.counts.docs, 57);
    const tree = await call(owner, 'GET', `/projects/${out.projectId}/pages`);
    assert.equal(tree.data.pages.length, 57);
    const root = tree.data.pages.filter((p: any) => p.parentId === null);
    assert.deepEqual(root.map((p: any) => p.title), ['Project documents']);
    const stagePages = tree.data.pages.filter((p: any) => p.parentId === root[0].id);
    assert.equal(stagePages.length, 21);
    assert.ok(stagePages.every((p: any) => p.stageId), 'mỗi trang giai đoạn gắn stageId');
    const stages = await prisma.workStage.findMany({ where: { projectId: out.projectId }, select: { id: true, slug: true } });
    const srs = tree.data.pages.find((p: any) => p.templateKey === 'srs');
    assert.equal(srs.stageId, stages.find((s) => s.slug === 'dac-ta-yeu-cau')!.id);
    assert.equal(tree.data.pages.filter((p: any) => p.templateKey === 'phieu-yeu-cau-thay-doi').length, 1, 'mẫu dùng nhiều giai đoạn chỉ tạo một trang');
    const stage09 = (await call(owner, 'GET', `/projects/${out.projectId}/pages/${stagePages.find((p: any) => p.title.startsWith('09.')).number}`)).data;
    assert.ok(stage09.contentText.includes('kept under stage'), 'giai đoạn sau trỏ tới trang ở giai đoạn trước');
    const byStage = await call(owner, 'GET', `/projects/${out.projectId}/pages?stage=${srs.stageId}`);
    assert.ok(byStage.data.pages.some((p: any) => p.templateKey === 'srs'));
    const v = await prisma.workPageVersion.count({ where: { page: { projectId: out.projectId } } });
    assert.equal(v, 57, 'mỗi trang có bản CREATE');
  });
});
