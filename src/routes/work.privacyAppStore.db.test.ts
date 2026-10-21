/**
 * Riêng tư trước khi nộp App Store (CT Work iOS, 21/10/2026) — HTTP + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.privacyAppStore.db.test.ts
 *
 *   P  trạng thái hoạt động: hồ sơ (khách / bạn bè / người tắt / người lạ / chặn / người xem tắt), người theo dõi,
 *      bạn bè, hộp thư (đối ứng), "Đang online" + /messages/online, audience socket
 *   M  thu hồi / xoá tin: không trả tệp, object trên kho bị xoá, tệp dùng chung giữ tới khi tin cuối bị xoá
 *   D  xoá tài khoản: thẻ thiết bị, token API, hội thoại AI riêng, ảnh đại diện; admin KHÔNG từ chối được
 */

import './work.ctw5b.testenv.js';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { randomBytes } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { getStorageProvider } from '../storage/StorageProvider.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `prv${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; username: string };

describe('Riêng tư App Store — trạng thái hoạt động, tin thu hồi, xoá tài khoản (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  // A xem · B bạn bè (bật) · C bạn bè (tắt) · D người lạ (bật) · E bạn bè đã chặn A · F bạn của B, tự tắt
  let A: U, B: U, C: U, D: U, E: U, F: U;
  const wsIds: number[] = [];

  async function mkUser(name: string, data: Record<string, unknown> = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const u = await prisma.user.create({
      data: { username, email: `${username}@test.local`, password: 'x', fullName: `Full ${name}`, lastActiveAt: new Date(), ...data },
    });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email: `${username}@test.local`, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, username };
  }
  async function call(u: { token: string } | null, method: string, p: string, body?: unknown) {
    const res = await fetch(`${base}${p}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  const friends = (a: U, b: U) => prisma.friendship.create({ data: { requesterId: a.id, addresseeId: b.id, status: 'ACCEPTED', respondedAt: new Date() } });
  const userThread = (a: U, b: U) => {
    const [x, y] = a.id < b.id ? [a, b] : [b, a];
    return prisma.messageThread.create({ data: { type: 'USER', userAId: x.id, userBId: y.id } });
  };

  before(async () => {
    const { default: userRoutes } = await import('./user.routes.js');
    const { default: friendRoutes } = await import('./friend.routes.js');
    const { router: messagesRoutes } = await import('./messages.routes.js');
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/friends', friendRoutes);
    app.use('/api/v1/messages', messagesRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    A = await mkUser('a');
    B = await mkUser('b');
    C = await mkUser('c', { showActiveStatus: false });
    D = await mkUser('d');
    E = await mkUser('e');
    F = await mkUser('f', { showActiveStatus: false });
    await friends(A, B); await friends(C, A); await friends(A, E); await friends(F, B);
    await prisma.userBlock.create({ data: { blockerId: E.id, blockedId: A.id } });
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.messageThread.deleteMany({ where: { OR: [{ userAId: { in: userIds } }, { userBId: { in: userIds } }] } });
      await prisma.fileAttachment.deleteMany({ where: { uploadedBy: { in: userIds } } });
      await prisma.accountDeletionRequest.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.userBlock.deleteMany({ where: { OR: [{ blockerId: { in: userIds } }, { blockedId: { in: userIds } }] } });
      await prisma.friendship.deleteMany({ where: { OR: [{ requesterId: { in: userIds } }, { addresseeId: { in: userIds } }] } });
      await prisma.follow.deleteMany({ where: { OR: [{ followerId: { in: userIds } }, { followingId: { in: userIds } }] } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  // ─── P: trạng thái hoạt động ────────────────────────────────

  it('P1 hồ sơ: khách chưa đăng nhập không thấy; bạn bè thấy; người tắt / người lạ / chặn / người xem tắt ⇒ ẩn', async () => {
    const xem = async (who: U | null, target: U) => {
      const r = await call(who, 'GET', `/api/v1/users/${target.id}`);
      assert.equal(r.status, 200, JSON.stringify(r.raw));
      return [r.data.isOnline, r.data.lastActiveAt] as [boolean, string | null];
    };
    assert.deepEqual(await xem(null, B), [false, null], 'khách');
    const [on, moc] = await xem(A, B);
    assert.equal(on, true); assert.ok(moc, 'bạn bè thấy mốc');
    assert.deepEqual(await xem(A, C), [false, null], 'C tắt công tắc');
    assert.deepEqual(await xem(A, D), [false, null], 'D là người lạ');
    assert.deepEqual(await xem(A, E), [false, null], 'E đã chặn A');
    assert.deepEqual(await xem(F, B), [false, null], 'F tự tắt ⇒ không thấy ai (đối ứng)');
    const [self] = await xem(A, A);
    assert.equal(self, true, 'xem chính mình');
  });

  it('P2 người theo dõi / bạn bè: cùng luật', async () => {
    await prisma.follow.create({ data: { followerId: B.id, followingId: A.id } });
    await prisma.follow.create({ data: { followerId: C.id, followingId: A.id } });
    const anon = await call(null, 'GET', `/api/v1/users/${A.id}/followers`);
    assert.ok(anon.data.users.length >= 2);
    assert.ok(anon.data.users.every((u: any) => u.isOnline === false), 'khách không thấy ai online');
    const mine = await call(A, 'GET', `/api/v1/users/${A.id}/followers`);
    const by = new Map(mine.data.users.map((u: any) => [u.id, u.isOnline]));
    assert.equal(by.get(B.id), true);
    assert.equal(by.get(C.id), false);

    const fr = await call(A, 'GET', '/api/v1/friends');
    assert.equal(fr.status, 200, JSON.stringify(fr.raw));
    const fm = new Map(fr.data.users.map((u: any) => [u.id, u.isOnline]));
    assert.equal(fm.get(B.id), true);
    assert.equal(fm.get(C.id), false, 'C tắt');
    assert.equal(fm.get(E.id), false, 'E chặn');
    const frF = await call(F, 'GET', '/api/v1/friends');
    assert.equal(new Map(frF.data.users.map((u: any) => [u.id, u.isOnline])).get(B.id), false, 'F tự tắt');
  });

  it('P3 hộp thư: mốc của người kia theo công tắc của HỌ và của MÌNH (đối ứng)', async () => {
    await userThread(A, B);
    await userThread(F, B);
    await userThread(A, C);
    const peerOf = async (who: U, peer: U) => {
      const r = await call(who, 'GET', '/api/v1/messages/threads');
      assert.equal(r.status, 200, JSON.stringify(r.raw));
      return r.data.find((t: any) => t.peer?.id === peer.id)?.peer;
    };
    assert.ok((await peerOf(A, B)).lastActiveAt, 'A thấy mốc của B');
    assert.equal((await peerOf(A, C)).lastActiveAt, null, 'C tắt');
    assert.equal((await peerOf(F, B)).lastActiveAt, null, 'F tự tắt ⇒ không thấy B');
    // Tạo/mở hội thoại trả hàng thô — cũng phải che.
    const mo = await call(F, 'POST', `/api/v1/messages/threads/user/${B.id}`);
    assert.equal(mo.status, 200, JSON.stringify(mo.raw));
    const nguoi = [mo.data.userA, mo.data.userB].find((p: any) => p?.id === B.id);
    assert.equal(nguoi.lastActiveAt, null);
  });

  it('P4 "Đang online" + /messages/online + audience socket: chỉ người có quan hệ, trừ chặn/tắt; người xem tắt ⇒ rỗng', async () => {
    const { visibleOnlineIds, presenceAudience } = await import('../services/presencePrivacy.js');
    const all = [B.id, C.id, D.id, E.id, F.id];
    assert.deepEqual(await visibleOnlineIds(A.id, all), [B.id], 'chỉ B: C tắt, D lạ, E chặn, F tắt');
    assert.deepEqual(await visibleOnlineIds(F.id, all), [], 'F tự tắt');
    // Cùng không gian CT Work (không phải khách) ⇒ có quan hệ.
    const ws = await prisma.workSpace.create({ data: { name: `${tag} ws`, slug: `${tag}-ws`, ownerId: A.id } });
    wsIds.push(ws.id);
    await prisma.workMember.createMany({ data: [{ workspaceId: ws.id, userId: A.id, role: 'OWNER' }, { workspaceId: ws.id, userId: D.id, role: 'MEMBER' }] });
    assert.deepEqual((await visibleOnlineIds(A.id, all)).sort(), [B.id, D.id].sort(), 'D cùng không gian');
    await prisma.workMember.updateMany({ where: { workspaceId: ws.id, userId: D.id }, data: { role: 'GUEST' } });
    assert.deepEqual(await visibleOnlineIds(A.id, all), [B.id], 'khách cổng không tính');

    // Audience socket của A: bỏ E (chặn), C và F (tự tắt — đối ứng).
    assert.deepEqual((await presenceAudience(A.id, all)).sort(), [B.id, D.id].sort());

    const r = await call(F, 'GET', '/api/v1/messages/online');
    assert.deepEqual(r.data.userIds, []);
  });

  // ─── M: tin thu hồi / xoá ───────────────────────────────────

  async function guiTep(sender: U, threadId: number, key: string, reuseFileId?: number) {
    const storage = getStorageProvider();
    let fileId = reuseFileId;
    if (!fileId) {
      await storage.put(key, Buffer.from(`hello ${key}`), 'text/plain');
      const f = await prisma.fileAttachment.create({
        data: { originalName: 'a.txt', storedName: key.split('/').pop()!, filePath: key, contentType: 'text/plain', fileSize: BigInt(10), uploadedBy: sender.id, fileCategory: 'documents' },
      });
      fileId = f.id;
    }
    const r = await call(sender, 'POST', `/api/v1/messages/threads/${threadId}/messages`, { content: 'xem tệp', fileIds: [fileId] });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.attachments.length, 1);
    assert.ok(r.data.attachments[0].url);
    return { messageId: r.data.id as number, fileId };
  }
  const coTrenKho = async (key: string) => (await getStorageProvider().list(key)).some((o) => o.key === key);
  const tinTrongLuong = async (who: U, threadId: number, id: number) => {
    const r = await call(who, 'GET', `/api/v1/messages/threads/${threadId}/messages`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const ds = Array.isArray(r.data) ? r.data : (r.data.messages ?? r.data.items);
    return ds.find((m: any) => m.id === id);
  };

  it('M1 thu hồi: không trả tệp, object trên kho bị xoá, dòng file_attachments bị xoá', async () => {
    const t = await prisma.messageThread.findFirstOrThrow({ where: { type: 'USER', OR: [{ userAId: A.id, userBId: B.id }, { userAId: B.id, userBId: A.id }] } });
    const key = `documents/chat/${tag}-recall.txt`;
    const { messageId, fileId } = await guiTep(A, t.id, key);
    assert.equal(await coTrenKho(key), true);
    const r = await call(A, 'POST', `/api/v1/messages/messages/${messageId}/recall`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const m = await tinTrongLuong(B, t.id, messageId);
    assert.equal(m.recalled, true);
    assert.deepEqual(m.attachments, [], 'người nhận không còn thấy tệp');
    assert.equal(await coTrenKho(key), false, 'object đã bị xoá khỏi kho');
    assert.equal(await prisma.fileAttachment.count({ where: { id: fileId } }), 0);
    const list = await call(B, 'GET', '/api/v1/messages/threads');
    const tt = list.data.find((x: any) => x.id === t.id);
    assert.equal(tt.lastMessage.hasAttachment, false);
    assert.equal(tt.lastMessage.attachmentName, null);
  });

  it('M2 xoá tin: tệp dùng chung với tin khác giữ lại; xoá tin cuối ⇒ object bị xoá; xem trước không lộ chữ', async () => {
    const t = await prisma.messageThread.findFirstOrThrow({ where: { type: 'USER', OR: [{ userAId: A.id, userBId: B.id }, { userAId: B.id, userBId: A.id }] } });
    const key = `documents/chat/${tag}-shared.txt`;
    const m1 = await guiTep(A, t.id, key);
    const m2 = await guiTep(A, t.id, key, m1.fileId);
    assert.equal((await call(A, 'DELETE', `/api/v1/messages/messages/${m1.messageId}`)).status, 200);
    assert.deepEqual((await tinTrongLuong(B, t.id, m1.messageId)).attachments, []);
    assert.equal(await coTrenKho(key), true, 'tin 2 còn dùng tệp');
    assert.equal((await tinTrongLuong(B, t.id, m2.messageId)).attachments.length, 1);
    assert.equal((await call(A, 'DELETE', `/api/v1/messages/messages/${m2.messageId}`)).status, 200);
    assert.equal(await coTrenKho(key), false);
    const list = await call(B, 'GET', '/api/v1/messages/threads');
    const last = list.data.find((x: any) => x.id === t.id).lastMessage;
    assert.equal(last.id, m2.messageId);
    assert.equal(last.content, '', 'xoá mềm giữ chữ trong CSDL nhưng xem trước không lộ');
    assert.equal(last.deleted, true);
  });

  // ─── D: xoá tài khoản ───────────────────────────────────────

  it('D1 admin KHÔNG từ chối được; xoá ⇒ thẻ thiết bị, token API, hội thoại AI riêng, ảnh đại diện', async () => {
    const svc = await import('../services/accountDeletion.service.js');
    const storage = getStorageProvider();
    const avatarKey = `images/avatar/${tag}-g.webp`;
    await storage.put(avatarKey, Buffer.from('img'), 'image/webp');
    const G = await mkUser('g', { avatarUrl: storage.publicUrl(avatarKey) });
    await prisma.deviceToken.create({ data: { userId: G.id, token: randomBytes(32).toString('hex'), app: 'com.cuongthai.ctwork' } });
    const tok = await prisma.workApiToken.create({ data: { userId: G.id, name: 'cli', tokenHash: randomBytes(32).toString('hex'), prefix: 'ctw_test' } });
    await prisma.chatSession.create({ data: { userId: G.id, title: 'riêng', messages: { create: [{ role: 'user', content: 'bí mật' }] } } });
    // Hội thoại AI CT Work: Riêng tư ⇒ xoá mềm; Dự án ⇒ giữ (nội dung chung của nhóm).
    const ws = await prisma.workSpace.create({ data: { name: `${tag} ws2`, slug: `${tag}-ws2`, ownerId: A.id } });
    wsIds.push(ws.id);
    const proj = await prisma.workProject.create({ data: { workspaceId: ws.id, key: 'PRV', name: 'Prv', leadId: A.id } });
    const rieng = await prisma.workAiThread.create({ data: { projectId: proj.id, createdById: G.id, title: 'r', visibility: 'PRIVATE' } });
    const chung = await prisma.workAiThread.create({ data: { projectId: proj.id, createdById: G.id, title: 'c', visibility: 'PROJECT' } });

    const { request } = await svc.requestDeletion(G.id, 'test');
    await assert.rejects(svc.reject(request.id, A.id, 'không'), (e: any) => e.code === 'DELETION_REJECT_NOT_ALLOWED' && e.statusCode === 409);
    assert.equal((await prisma.accountDeletionRequest.findUniqueOrThrow({ where: { id: request.id } })).status, 'PENDING', 'vẫn chờ');

    await svc.approve(request.id, A.id, 'sớm');
    const g = await prisma.user.findUniqueOrThrow({ where: { id: G.id } });
    assert.equal(g.enabled, false);
    assert.equal(g.avatarUrl, null);
    assert.equal(g.showActiveStatus, false);
    assert.equal(await prisma.deviceToken.count({ where: { userId: G.id } }), 0, 'không còn thẻ đẩy');
    assert.ok((await prisma.workApiToken.findUniqueOrThrow({ where: { id: tok.id } })).revokedAt, 'token API bị thu hồi');
    assert.equal(await prisma.chatSession.count({ where: { userId: G.id } }), 0, 'AI Chat riêng bị xoá');
    assert.ok((await prisma.workAiThread.findUniqueOrThrow({ where: { id: rieng.id } })).deletedAt, 'hội thoại AI riêng xoá mềm');
    assert.equal((await prisma.workAiThread.findUniqueOrThrow({ where: { id: chung.id } })).deletedAt, null, 'hội thoại dự án giữ');
    assert.equal(await coTrenKho(avatarKey), false, 'ảnh đại diện bị xoá khỏi kho');
  });
});
