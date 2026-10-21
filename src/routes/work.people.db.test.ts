/**
 * CT Work — "Thành viên" + trạng thái hoạt động + nhắn riêng giữa đồng nghiệp (21/10/2026), HTTP + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.people.db.test.ts
 *
 *   P  GET /work/me/people: người mọi không gian (gộp, không lặp, không có mình, không có người ngoài), dự án chung
 *   S  riêng tư: người kia tắt ⇒ ẩn; người XEM tắt ⇒ ẩn hết (đối ứng); mốc trong 60 s ⇒ online; agent ⇒ không trạng thái
 *   B  chặn: tôi chặn ⇒ còn trong danh sách, cờ blocked, ẩn trạng thái; người chặn tôi ⇒ biến khỏi danh sách của tôi
 *   D  POST /messages/threads/user/:id: đồng nghiệp nhắn được người tắt "nhận tin từ người lạ", người ngoài thì không
 *   O  GET /messages/online: người xem tắt trạng thái ⇒ rỗng
 */

import './work.ctw5b.testenv.js';
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
const tag = `ppl${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work — Thành viên + trạng thái hoạt động (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, dev2: U, outsider: U;
  const wsIds: number[] = [];
  let pid = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', fullName: `Full ${name}` } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown, prefix = '/api/v1/work') {
    const res = await fetch(`${base}${prefix}${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const people = async (u: U) => {
    const r = await call(u, 'GET', '/me/people');
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    return r.data as { viewerShowsActiveStatus: boolean; people: any[] };
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const { router: messagesRoutes } = await import('./messages.routes.js');
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/messages', messagesRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev, dev2, outsider] = await Promise.all(['owner', 'dev', 'dev2', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.messageThread.deleteMany({ where: { OR: [{ userAId: { in: userIds } }, { userBId: { in: userIds } }] } });
      await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: userIds } }, { blockedId: { in: userIds } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('P: người của MỌI không gian, gộp theo người, có dự án chung, không có mình/người ngoài', async () => {
    for (const ten of ['A', 'B']) {
      const ws = await call(owner, 'POST', '/workspaces', { name: `People ${ten} ${tag}` });
      assert.equal(ws.status, 201, JSON.stringify(ws.raw));
      wsIds.push(ws.data.id);
    }
    // dev ở CẢ HAI không gian, dev2 chỉ ở B.
    await prisma.workMember.createMany({ data: [
      { workspaceId: wsIds[0], userId: dev.id, role: 'MEMBER' },
      { workspaceId: wsIds[1], userId: dev.id, role: 'ADMIN' },
      { workspaceId: wsIds[1], userId: dev2.id, role: 'MEMBER' },
    ] });
    const p = await call(owner, 'POST', `/workspaces/${wsIds[0]}/projects`, { key: 'PPL', name: 'People project' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' })).status, 200);

    const r = await people(owner);
    assert.equal(r.viewerShowsActiveStatus, true);
    const ids = r.people.map((x) => x.id);
    assert.ok(ids.includes(dev.id) && ids.includes(dev2.id));
    assert.ok(!ids.includes(owner.id), 'không có chính mình');
    assert.ok(!ids.includes(outsider.id), 'không có người ngoài');
    assert.equal(ids.filter((i) => i === dev.id).length, 1, 'gộp theo người');
    const d = r.people.find((x) => x.id === dev.id);
    assert.deepEqual(d.workspaces.map((w: any) => w.role).sort(), ['ADMIN', 'MEMBER']);
    assert.deepEqual(d.projects.map((x: any) => x.key), ['PPL']);
    assert.equal(d.email, undefined, 'không lộ email người khác');
    assert.equal((await people(outsider)).people.length, 0);
  });

  it('S: mốc gần ⇒ online, mốc cũ ⇒ mốc; người kia tắt ⇒ ẩn; người xem tắt ⇒ ẩn hết', async () => {
    await prisma.user.update({ where: { id: dev.id }, data: { lastActiveAt: new Date(Date.now() - 10_000) } });
    await prisma.user.update({ where: { id: dev2.id }, data: { lastActiveAt: new Date(Date.now() - 5 * 60_000) } });
    let r = await people(owner);
    const d = r.people.find((x) => x.id === dev.id);
    const d2 = r.people.find((x) => x.id === dev2.id);
    assert.deepEqual([d.presence.visible, d.presence.online], [true, true]);
    assert.deepEqual([d2.presence.visible, d2.presence.online], [true, false]);
    assert.ok(d2.presence.lastActiveAt);
    assert.equal(r.people[0].id, dev.id, 'đang hoạt động lên đầu');

    await prisma.user.update({ where: { id: dev.id }, data: { showActiveStatus: false } });
    r = await people(owner);
    assert.deepEqual(r.people.find((x) => x.id === dev.id).presence, { visible: false, online: false, lastActiveAt: null });

    await prisma.user.update({ where: { id: dev.id }, data: { showActiveStatus: true } });
    await prisma.user.update({ where: { id: owner.id }, data: { showActiveStatus: false } });
    r = await people(owner);
    assert.equal(r.viewerShowsActiveStatus, false);
    assert.ok(r.people.every((x) => !x.presence.visible && x.presence.lastActiveAt === null), 'người xem tắt ⇒ không thấy của ai');
    // Đường /messages/online cũng theo luật đối ứng.
    const o = await call(owner, 'GET', '/online', undefined, '/api/v1/messages');
    assert.equal(o.status, 200);
    assert.deepEqual(o.data.userIds, []);
    await prisma.user.update({ where: { id: owner.id }, data: { showActiveStatus: true } });
  });

  it('B: tôi chặn ⇒ cờ blocked + ẩn trạng thái; người bị chặn không còn thấy tôi', async () => {
    assert.equal((await call(owner, 'POST', `/blocks/${dev2.id}`, {}, '/api/v1/messages')).status, 200);
    const r = await people(owner);
    const d2 = r.people.find((x) => x.id === dev2.id);
    assert.equal(d2.blocked, true);
    assert.equal(d2.presence.visible, false);
    assert.ok(!(await people(dev2)).people.some((x) => x.id === owner.id));
    assert.equal((await call(owner, 'DELETE', `/blocks/${dev2.id}`, undefined, '/api/v1/messages')).status, 200);
  });

  it('D: đồng nghiệp nhắn được người tắt "người lạ"; người ngoài bị chặn', async () => {
    await prisma.user.update({ where: { id: dev.id }, data: { allowMessagesFromStrangers: false } });
    const t = await call(owner, 'POST', `/threads/user/${dev.id}`, {}, '/api/v1/messages');
    assert.equal(t.status, 200, JSON.stringify(t.raw));
    assert.equal(t.data.type, 'USER');
    const n = await call(outsider, 'POST', `/threads/user/${dev.id}`, {}, '/api/v1/messages');
    assert.equal(n.status, 403);
    assert.equal(n.code, 'MESSAGES_DISABLED');
  });
});
