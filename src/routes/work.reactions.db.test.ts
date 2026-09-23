/**
 * Test cảm xúc bình luận + mẫu mô tả theo loại thẻ, qua HTTP thật trên
 * Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.reactions.db.test.ts
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
const tag = `wr${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — cảm xúc bình luận + mẫu mô tả (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, viewer: U, teacher: U;
  let wsId = 0;
  let pid = 0;
  let num = 0;
  let cid = 0;

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, fullName: name[0].toUpperCase() + name.slice(1) } });
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
    return { status: res.status, data: json.data, raw: json };
  }

  const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });
  const react = (u: U, emoji: string, body?: unknown) =>
    call(u, 'PUT', `/projects/${pid}/issues/${num}/comments/${cid}/reactions/${encodeURIComponent(emoji)}`, body);

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member, viewer, teacher] = await Promise.all(['owner', 'member', 'viewer', 'teacher'].map(mkUser));

    const ws = await call(owner, 'POST', '/workspaces', { name: `Reactions ${tag}` });
    wsId = ws.data.id;
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'RX', name: 'Reactions', template: 'BLANK' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email, viewer.email], role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [teacher.email], role: 'GUEST', projectId: pid, projectRole: 'TEACHER' });

    const cfg = await call(owner, 'GET', `/projects/${pid}`);
    const task = cfg.data.issueTypes.find((t: any) => t.key === 'TASK').id;
    const i = await call(member, 'POST', `/projects/${pid}/issues`, { typeId: task, title: 'Reactable issue' });
    num = i.data.number;
    const c = await call(member, 'POST', `/projects/${pid}/issues/${num}/comments`, { bodyJson: doc('Ship it?') });
    assert.equal(c.status, 201);
    cid = c.data.id;
  });

  after(async () => {
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  // ─── Cảm xúc ─────────────────────────────────────────────────────

  it('bật/tắt: đếm đúng, mine theo người xem, thứ tự cố định', async () => {
    const a = await react(member, '🎉');
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.reacted, true);
    await react(owner, '🎉');
    await react(teacher, '👍');

    const list = await call(owner, 'GET', `/projects/${pid}/issues/${num}/comments`);
    const r = list.data.find((c: any) => c.id === cid).reactions;
    // 👍 đứng trước 🎉 dù bấm sau — thứ tự theo bảng emoji, không theo thời gian.
    assert.deepEqual(r.map((x: any) => x.emoji), ['👍', '🎉']);
    const party = r.find((x: any) => x.emoji === '🎉');
    assert.equal(party.count, 2);
    assert.equal(party.mine, true);
    assert.deepEqual(party.users.map((u: any) => u.name), ['Member', 'Owner']);
    assert.equal(r.find((x: any) => x.emoji === '👍').mine, false);

    // Bấm lại = gỡ.
    const off = await react(member, '🎉');
    assert.equal(off.data.reacted, false);
    assert.equal(off.data.reactions.find((x: any) => x.emoji === '🎉').count, 1);
  });

  it('đặt thẳng (active) là idempotent; tên kiểu GitHub cũng nhận', async () => {
    await react(member, 'heart', { active: true });
    const again = await react(member, '❤️', { active: true });
    assert.equal(again.data.reacted, true);
    assert.equal(again.data.reactions.find((x: any) => x.emoji === '❤️').count, 1);
    const off = await react(member, '❤', { active: false });
    assert.equal(off.data.reacted, false);
    assert.equal(off.data.reactions.some((x: any) => x.emoji === '❤️'), false);
  });

  it('VIEWER bị chặn 403; emoji lạ 400; bình luận không có 404', async () => {
    assert.equal((await react(viewer, '👍')).status, 403);
    assert.equal((await react(member, '🍕')).status, 400);
    assert.equal((await react(member, 'x'.repeat(40))).status, 400);
    const miss = await call(member, 'PUT', `/projects/${pid}/issues/${num}/comments/999999999/reactions/${encodeURIComponent('👍')}`);
    assert.equal(miss.status, 404);
    // Người xem vẫn đọc được cảm xúc.
    const list = await call(viewer, 'GET', `/projects/${pid}/issues/${num}/comments`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.data[0].reactions));
  });

  it('bình luận đã xoá: không bấm được nữa; xoá hẳn thì cảm xúc đi theo (cascade)', async () => {
    const c2 = await call(member, 'POST', `/projects/${pid}/issues/${num}/comments`, { bodyJson: doc('temp') });
    const id2 = c2.data.id;
    await call(owner, 'PUT', `/projects/${pid}/issues/${num}/comments/${id2}/reactions/${encodeURIComponent('🚀')}`);
    assert.equal(await prisma.workCommentReaction.count({ where: { commentId: id2 } }), 1);
    await call(member, 'DELETE', `/projects/${pid}/issues/${num}/comments/${id2}`);
    const late = await call(owner, 'PUT', `/projects/${pid}/issues/${num}/comments/${id2}/reactions/${encodeURIComponent('👀')}`);
    assert.equal(late.status, 404);
    await prisma.workComment.delete({ where: { id: id2 } });
    assert.equal(await prisma.workCommentReaction.count({ where: { commentId: id2 } }), 0);
  });

  // ─── Mẫu mô tả ───────────────────────────────────────────────────

  it('dự án chưa đặt gì: nhận mẫu mặc định cho Bug/Story/Task/Epic, Sub-task không có', async () => {
    const t = await call(viewer, 'GET', `/projects/${pid}/issue-templates`);
    assert.equal(t.status, 200);
    const by = (k: string) => t.data.find((x: any) => x.typeKey === k);
    assert.equal(by('BUG').isDefault, true);
    assert.equal(by('BUG').name, 'Bug report');
    const headings = by('BUG').doc.content.filter((n: any) => n.type === 'heading').map((n: any) => n.content[0].text);
    assert.deepEqual(headings, ['Summary', 'Steps to reproduce', 'Expected result', 'Actual result', 'Environment', 'Evidence']);
    assert.ok(by('STORY').doc.content.some((n: any) => n.type === 'taskList'));
    // Task lấy Definition of Done của chính dự án.
    const dodList = by('TASK').doc.content.at(-1);
    assert.equal(dodList.type, 'taskList');
    assert.equal(dodList.content[0].content[0].content[0].text, 'Code reviewed and merged');
    assert.ok(by('EPIC').doc);
    assert.equal(by('SUBTASK').doc, null);
  });

  it('ADMIN đặt mẫu riêng, xoá trắng, rồi về mặc định; người khác 403', async () => {
    const custom = { type: 'doc', content: [{ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Our bug form' }] }, { type: 'paragraph' }] };
    assert.equal((await call(member, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: custom })).status, 403);
    assert.equal((await call(teacher, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: null })).status, 403);

    const set = await call(owner, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: custom });
    assert.equal(set.status, 200, JSON.stringify(set.raw));
    assert.equal(set.data.isDefault, false);
    assert.equal(set.data.doc.content[0].content[0].text, 'Our bug form');

    // Hai mẫu cùng tồn tại (ghi nguyên tử không đè nhau), cài đặt khác của dự án còn nguyên.
    await call(owner, 'PUT', `/projects/${pid}/issue-templates/TASK`, { doc: { type: 'doc', content: [] } });
    const list = await call(member, 'GET', `/projects/${pid}/issue-templates`);
    const by = (k: string) => list.data.find((x: any) => x.typeKey === k);
    assert.equal(by('BUG').doc.content[0].content[0].text, 'Our bug form');
    assert.equal(by('TASK').doc, null); // xoá trắng = tắt mẫu
    assert.equal(by('TASK').isDefault, false);
    const settings = (await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } })).settings as any;
    assert.equal(settings.estimation, 'POINTS');

    const reset = await call(owner, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: null });
    assert.equal(reset.data.isDefault, true);
    assert.equal(reset.data.doc.content[0].content[0].text, 'Summary');
  });

  it('kiểm đầu vào: quá lớn 400, node lạ 400, loại thẻ không có 404', async () => {
    const big = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x'.repeat(25_000) }] }] };
    const r1 = await call(owner, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: big });
    assert.equal(r1.status, 400);
    const weird = { type: 'doc', content: [{ type: 'iframe', attrs: { src: 'https://evil.test' } }] };
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issue-templates/BUG`, { doc: weird })).status, 400);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issue-templates/NOPE`, { doc: null })).status, 404);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issue-templates/bad-key`, { doc: null })).status, 400);
  });
});
