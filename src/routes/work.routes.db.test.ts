/**
 * Test API CT Work qua HTTP thật, trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.routes.db.test.ts
 *
 * Email bị chặn (không gửi thật). Đính kèm chỉ thử bước kiểm khoá — không
 * tải file nào lên R2 (máy dev trỏ vào bucket thật).
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
const tag = `wa${Date.now().toString(36)}`;
const userIds: number[] = [];
const sentEmails: string[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work API (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, viewer: U, teacher: U, client: U, outsider: U, linkUser: U;
  let wsId = 0;
  let pid = 0;
  let cfg: any;

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
    return { status: res.status, data: json.data, error: json.error ?? json.message, raw: json };
  }

  const doc = (text: string, mentionId?: number) => ({
    type: 'doc',
    content: [{ type: 'paragraph', content: [
      { type: 'text', text },
      ...(mentionId ? [{ type: 'mention', attrs: { id: String(mentionId), label: 'someone' } }] : []),
    ] }],
  });

  before(async () => {
    // Chặn email thật.
    (emailService as any).send = async (p: { to: string }) => { sentEmails.push(p.to); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, viewer, teacher, client, outsider, linkUser] = await Promise.all(
      ['owner', 'member', 'viewer', 'teacher', 'client', 'outsider', 'linkuser'].map(mkUser),
    );
  });

  after(async () => {
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('không đăng nhập ⇒ 401', async () => {
    assert.equal((await call(null, 'GET', '/workspaces')).status, 401);
  });

  it('tạo không gian + dự án từ mẫu SWP391', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: 'SE1801 Group 3' });
    assert.equal(ws.status, 201);
    assert.equal(ws.data.slug, 'se1801-group-3');
    wsId = ws.data.id;

    const bad = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: '1AB', name: 'x' });
    assert.equal(bad.status, 400);

    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'swp', name: 'Online Shop', template: 'SWP391' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.equal(p.data.key, 'SWP');
    pid = p.data.id;

    const dup = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SWP', name: 'Again' });
    assert.equal(dup.status, 409);

    const r = await call(owner, 'GET', `/resolve/se1801-group-3/swp`);
    assert.equal(r.data.projectId, pid);
  });

  it('cấu hình dự án: 4 cột, trạng thái Bug được xếp vào cột, cờ quyền', async () => {
    const c = await call(owner, 'GET', `/projects/${pid}`);
    assert.equal(c.status, 200);
    cfg = c.data;
    assert.deepEqual(cfg.boardColumns.map((x: any) => x.name), ['To Do', 'In Progress', 'In Review', 'Done']);
    const bugWf = cfg.workflows.find((w: any) => !w.isDefault);
    const statusName = (sid: number) => [...cfg.workflows.flatMap((w: any) => w.statuses)].find((s: any) => s.id === sid).name;
    const colOf = (name: string) => cfg.boardColumns.find((col: any) => col.statusIds.some((sid: number) => statusName(sid) === name && bugWf.statuses.some((s: any) => s.id === sid)))?.name;
    assert.equal(colOf('Open'), 'To Do');
    assert.equal(colOf('Fixed'), 'In Review');
    assert.equal(colOf('Retest'), 'In Review');
    assert.equal(colOf('Closed'), 'Done');
    assert.equal(cfg.permissions.settings, true);
  });

  it('mời bằng email: người có tài khoản vào ngay, người chưa có nhận link', async () => {
    const r = await call(owner, 'POST', `/workspaces/${wsId}/invites`, {
      emails: [member.email, viewer.email, 'nobody-' + tag + '@test.local'], role: 'MEMBER',
    });
    assert.equal(r.status, 201);
    assert.deepEqual(r.data.map((x: any) => x.status), ['ADDED', 'ADDED', 'INVITED']);
    assert.equal(sentEmails.length, 3);
    const notif = await prisma.socialNotification.count({ where: { receiverId: member.id, type: 'WORK_INVITE' } });
    assert.equal(notif, 1);

    // Mời lại người đã ở trong nhóm không gửi thêm gì.
    const again = await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email], role: 'MEMBER' });
    assert.equal(again.data[0].status, 'ALREADY_MEMBER');

    // Giảng viên + khách hàng vào dạng GUEST, gắn thẳng vào dự án.
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [teacher.email], role: 'GUEST', projectId: pid, projectRole: 'TEACHER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [client.email], role: 'GUEST', projectId: pid, projectRole: 'CLIENT' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
  });

  it('link mời chung: xem trước không cần đăng nhập, dùng được đúng số lượt', async () => {
    const l = await call(owner, 'POST', `/workspaces/${wsId}/invite-links`, { role: 'MEMBER', maxUses: 1 });
    assert.equal(l.status, 201);
    const token = l.data.url.split('/').pop();
    const pv = await call(null, 'GET', `/invites/${token}`);
    assert.equal(pv.status, 200);
    assert.equal(pv.data.workspace.name, 'SE1801 Group 3');
    assert.equal((await call(linkUser, 'POST', `/invites/${token}/accept`)).status, 200);
    assert.equal((await call(outsider, 'POST', `/invites/${token}/accept`)).status, 400);
    assert.equal((await call(owner, 'GET', `/invites/nope`)).status, 404);
  });

  it('thành viên dự án có đúng vai trò hiệu lực', async () => {
    const c = await call(owner, 'GET', `/projects/${pid}`);
    const role = (id: number) => c.data.members.find((m: any) => m.id === id)?.role;
    assert.equal(role(owner.id), 'ADMIN');
    assert.equal(role(member.id), 'MEMBER');
    assert.equal(role(viewer.id), 'VIEWER');
    assert.equal(role(teacher.id), 'TEACHER');
    assert.equal(role(client.id), 'CLIENT');
    assert.equal(role(outsider.id), undefined);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}`)).status, 404);
  });

  let storyNum = 0;
  let bugNum = 0;

  it('tạo thẻ, sửa kèm version, nhãn ghi lịch sử bằng tên', async () => {
    const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
    const s = await call(member, 'POST', `/projects/${pid}/issues`, { typeId: type('STORY'), title: 'As a buyer I can pay by card', priority: 2 });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    storyNum = s.data.number;
    assert.equal(s.data.reporter.id, member.id);

    const lbl = await call(member, 'POST', `/projects/${pid}/labels`, { name: 'payment', color: '#16a34a' });
    assert.equal(lbl.status, 201);
    const upd = await call(member, 'PATCH', `/projects/${pid}/issues/${storyNum}`, {
      title: 'As a buyer I can pay by card or wallet', labelIds: [lbl.data.id], assigneeId: member.id, dueDate: '2026-10-15', version: 0,
    });
    assert.equal(upd.status, 200, JSON.stringify(upd.raw));
    assert.deepEqual(upd.data.labelIds, [lbl.data.id]);
    assert.equal(upd.data.dueDate.slice(0, 10), '2026-10-15');

    const stale = await call(member, 'PATCH', `/projects/${pid}/issues/${storyNum}`, { title: 'stale', version: 0 });
    assert.equal(stale.status, 409);

    const h = await call(member, 'GET', `/projects/${pid}/issues/${storyNum}/history`);
    const labels = h.data.find((x: any) => x.field === 'labels');
    assert.equal(labels.toValue, 'payment');

    const bug = await call(member, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'Checkout crashes on empty cart' });
    bugNum = bug.data.number;
    const bugOpen = cfg.workflows.find((w: any) => !w.isDefault).statuses.find((st: any) => st.name === 'Open').id;
    assert.equal(bug.data.statusId, bugOpen);
  });

  it('phân quyền qua API: viewer/teacher/client/outsider', async () => {
    const type = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;
    assert.equal((await call(viewer, 'PATCH', `/projects/${pid}/issues/${storyNum}`, { title: 'hack' })).status, 403);
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/issues/${storyNum}`)).status, 200);
    assert.equal((await call(teacher, 'POST', `/projects/${pid}/issues`, { typeId: type('TASK'), title: 'x' })).status, 403);
    assert.equal((await call(teacher, 'POST', `/projects/${pid}/issues/${storyNum}/comments`, { bodyJson: doc('Good user story.') })).status, 201);
    const cl = await call(client, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'Logo is blurry' });
    assert.equal(cl.status, 201);
    assert.equal((await call(client, 'POST', `/projects/${pid}/issues`, { typeId: type('BUG'), title: 'x', assigneeId: member.id })).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/issues/${storyNum}`)).status, 404);
    // Không giao việc được cho giảng viên.
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${storyNum}`, { assigneeId: teacher.id })).status, 400);
  });

  it('bình luận có @nhắc: người được nhắc nhận MENTION, người theo dõi nhận COMMENT', async () => {
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${storyNum}/comments`, { bodyJson: doc('Please review ', viewer.id) });
    assert.equal(r.status, 201);
    await new Promise((res) => setTimeout(res, 400));
    const mention = await prisma.socialNotification.count({ where: { receiverId: viewer.id, type: 'WORK_MENTION', secondaryEntityId: r.data.id } });
    const comment = await prisma.socialNotification.count({ where: { receiverId: member.id, type: 'WORK_COMMENT', secondaryEntityId: r.data.id } });
    const selfNotif = await prisma.socialNotification.count({ where: { receiverId: owner.id, secondaryEntityId: r.data.id } });
    assert.equal(mention, 1, 'viewer được nhắc');
    assert.equal(comment, 1, 'member (người báo, đang theo dõi) nhận bình luận');
    assert.equal(selfNotif, 0, 'không tự báo cho mình');

    // Sửa bình luận người khác: bị chặn, kể cả ADMIN.
    const teacherComment = (await call(owner, 'GET', `/projects/${pid}/issues/${storyNum}/comments`)).data.find((c: any) => c.author.id === teacher.id);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${storyNum}/comments/${teacherComment.id}`, { bodyJson: doc('edited') })).status, 403);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/issues/${storyNum}/comments/${teacherComment.id}`)).status, 200);
    assert.equal((await call(member, 'POST', `/projects/${pid}/issues/${storyNum}/comments`, { bodyJson: doc('   ') })).status, 400);
  });

  it('giao việc sinh thông báo WORK_ASSIGN cho người được giao', async () => {
    await call(owner, 'PATCH', `/projects/${pid}/issues/${bugNum}`, { assigneeId: member.id });
    await new Promise((res) => setTimeout(res, 400));
    const n = await prisma.socialNotification.findFirst({ where: { receiverId: member.id, type: 'WORK_ASSIGN' }, orderBy: { id: 'desc' } });
    assert.ok(n);
    assert.equal((n!.payload as any).issueKey, `SWP-${bugNum}`);
  });

  it('liên kết thẻ: lưu một chiều, đọc hai chiều', async () => {
    const l = await call(member, 'POST', `/projects/${pid}/issues/${bugNum}/links`, { type: 'BLOCKS', targetKey: `swp-${storyNum}` });
    assert.equal(l.status, 201);
    const story = await call(member, 'GET', `/projects/${pid}/issues/${storyNum}`);
    assert.equal(story.data.links[0].direction, 'inward');
    assert.equal(story.data.links[0].issue.key, `SWP-${bugNum}`);
    assert.equal((await call(member, 'POST', `/projects/${pid}/issues/${bugNum}/links`, { type: 'BLOCKS', targetKey: 'SWP-9999' })).status, 404);
  });

  it('board: Scrum chưa có sprint chạy thì trống; có thì trả thẻ của sprint', async () => {
    const empty = await call(member, 'GET', `/projects/${pid}/board`);
    assert.equal(empty.data.sprint, null);
    const sp = await prisma.workSprint.create({ data: { projectId: pid, name: 'Sprint 1', state: 'ACTIVE', startAt: new Date() } });
    await call(owner, 'PATCH', `/projects/${pid}/issues/${storyNum}`, { sprintId: sp.id });
    const b = await call(member, 'GET', `/projects/${pid}/board`);
    assert.equal(b.data.sprint.name, 'Sprint 1');
    assert.deepEqual(b.data.issues.map((i: any) => i.number), [storyNum]);
  });

  it('lọc danh sách: theo loại, theo người, tìm theo mã', async () => {
    const bugType = cfg.issueTypes.find((t: any) => t.key === 'BUG').id;
    const bugs = await call(member, 'GET', `/projects/${pid}/issues?type=${bugType}`);
    assert.ok(bugs.data.items.every((i: any) => i.typeId === bugType));
    const mine = await call(member, 'GET', `/projects/${pid}/issues?assignee=${member.id}`);
    assert.ok(mine.data.items.length >= 2);
    const byKey = await call(member, 'GET', `/projects/${pid}/issues?q=SWP-${bugNum}`);
    assert.ok(byKey.data.items.some((i: any) => i.number === bugNum));
  });

  it('xoá thẻ: người báo tự xoá được, thành viên khác thì không', async () => {
    const type = cfg.issueTypes.find((t: any) => t.key === 'TASK').id;
    const t = await call(member, 'POST', `/projects/${pid}/issues`, { typeId: type, title: 'Temp' });
    assert.equal((await call(linkUser, 'DELETE', `/projects/${pid}/issues/${t.data.number}`)).status, 403);
    assert.equal((await call(member, 'DELETE', `/projects/${pid}/issues/${t.data.number}`)).status, 200);
    assert.equal((await call(member, 'GET', `/projects/${pid}/issues/${t.data.number}`)).status, 404);
  });

  it('đính kèm: không nhận khoá nằm ngoài thư mục của thẻ', async () => {
    const r = await call(member, 'POST', `/projects/${pid}/issues/${storyNum}/attachments/complete`, { key: 'work/999/1/x/evil.png', fileName: 'evil.png' });
    assert.ok([400].includes(r.status), `status ${r.status}`);
    const big = await call(member, 'POST', `/projects/${pid}/issues/${storyNum}/attachments/presign`, { fileName: 'a.zip', contentType: 'application/zip', size: 26 * 1024 * 1024 });
    assert.equal(big.status, 400);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/issues/${storyNum}/attachments/presign`, { fileName: 'a.png', contentType: 'image/png', size: 10 })).status, 403);
  });

  it('rời không gian là mất quyền ngay', async () => {
    assert.equal((await call(member, 'DELETE', `/workspaces/${wsId}/members/${member.id}`)).status, 200);
    assert.equal((await call(member, 'GET', `/projects/${pid}`)).status, 404);
    assert.equal((await call(owner, 'DELETE', `/workspaces/${wsId}/members/${owner.id}`)).status, 403);
  });
});
