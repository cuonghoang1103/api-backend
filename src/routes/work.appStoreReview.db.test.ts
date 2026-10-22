/**
 * Sửa theo bản soát App Review CT Work iOS (22/10/2026) — HTTP + Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.appStoreReview.db.test.ts
 *
 *   B3  bộ lọc nội dung: MỌI cửa ghi trả 422 CONTENT_BLOCKED và KHÔNG lưu gì — bài/bình luận/bình chọn Bảng tin, tin nhắn
 *       riêng + biệt danh, chat kênh (gửi + sửa), bình luận thẻ (thêm + sửa), bình luận tài liệu, tên/giới thiệu hồ sơ;
 *       chữ tiếng Việt bình thường (các, buổi, lớn…) đi qua
 *   R3  báo cáo tin nhắn riêng ⇒ BAO_CAO cho admin site (khoá dm-report:<id>, có nguyên văn tin) + tin bị báo cáo ẩn với
 *       người báo cáo (người kia vẫn thấy); không báo cáo được tin của mình; báo cáo bình luận thẻ cũng tới admin site
 *       mod admin: gỡ nội dung / khoá người viết ngay từ thông báo (Bảng tin + tin nhắn riêng), người thường ⇒ 403
 *   B5  Sign in with Apple: xacMinhOAuth (identityToken ký bằng khoá giả, /auth/keys giả) cho `aud` ⇒ luuTokenApple đổi
 *       authorizationCode (Apple giả), lưu refresh token MÃ HOÁ (không nạp auth.routes: mfa.routes mở Redis lúc nạp ⇒ tiến
 *       trình test treo khi máy không có Redis; tuyến chỉ thêm đúng lời gọi `luuTokenApple(result.userId, xm.aud, …)`); xoá tài khoản ⇒ /auth/revoke đúng tham số rồi xoá dòng;
 *       thiếu cấu hình ⇒ vẫn xoá được tài khoản
 */

import './work.ctw5b.testenv.js';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createSign, generateKeyPairSync, randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `asr${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

const BAD = 'đồ lồn, fuck you';
const SACH = 'Các bạn nhớ buổi họp lớn lúc 9h nhé — cac ban oi';
const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });

describe('App Review CT Work — lọc nội dung, báo cáo tin nhắn, kiểm duyệt admin, thu hồi Sign in with Apple', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, alice: U, admin: U;
  let wsId = 0, pid = 0, channelId = 0, issueNum = 0, pageNum = 0, threadId = 0;
  const fetchGoc = globalThis.fetch;
  const appleGoi: Array<{ url: string; form: Record<string, string> }> = [];
  let appleKeys: { keys: unknown[] } = { keys: [] };

  async function mkUser(name: string, o: { admin?: boolean } = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', displayName: name } });
    userIds.push(u.id);
    if (o.admin) {
      const role = await prisma.role.upsert({ where: { name: 'ROLE_ADMIN' }, update: {}, create: { name: 'ROLE_ADMIN' } });
      await prisma.userRole.create({ data: { userId: u.id, roleId: role.id } });
    }
    const token = jwt.sign({ userId: u.id, username, email, roles: o.admin ? ['ADMIN'] : [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const blocked = (r: { status: number; code?: string; raw: any }, what: string) => {
    assert.equal(r.status, 422, `${what}: ${JSON.stringify(r.raw)}`);
    assert.equal(r.code, 'CONTENT_BLOCKED', what);
  };

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    // Apple giả: chỉ chặn appleid.apple.com, mọi lời gọi khác (tới server test) đi thẳng.
    globalThis.fetch = (async (input: any, init?: any) => {
      const url = typeof input === 'string' ? input : input?.url ?? String(input);
      if (!url.startsWith('https://appleid.apple.com/')) return fetchGoc(input, init);
      const form = Object.fromEntries(new URLSearchParams(String(init?.body ?? '')));
      appleGoi.push({ url, form });
      const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });
      if (url.endsWith('/auth/keys')) return json(appleKeys);
      if (url.endsWith('/auth/token')) {
        if (form.code === 'bad-code') return json({ error: 'invalid_grant' }, 400);
        return json({ access_token: 'at-1', token_type: 'Bearer', expires_in: 3600, refresh_token: `rt-${form.code}`, id_token: 'x' });
      }
      if (url.endsWith('/auth/revoke')) return new Response('', { status: 200 });
      return json({}, 404);
    }) as typeof fetch;

    const { default: workRoutes } = await import('./work.routes.js');
    const { router: messagesRoutes } = await import('./messages.routes.js');
    const { default: profileRoutes } = await import('./profile.routes.js');
    const { default: userRoutes } = await import('./user.routes.js');
    const { default: adminModeration } = await import('./admin.moderation.routes.js');
    const { default: adminReports } = await import('./admin.reports.routes.js');
    const app = express();
    app.use(express.json({ limit: '2mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use('/api/v1/messages', messagesRoutes);
    app.use('/api/v1/profile', profileRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/admin/moderation', adminModeration);
    app.use('/api/v1/admin/reports', adminReports);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    owner = await mkUser('owner');
    alice = await mkUser('alice');
    admin = await mkUser('admin', { admin: true });

    const ws = await call(owner, 'POST', '/work/workspaces', { name: `ASR ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsId = ws.data.id;
    await call(owner, 'POST', `/work/workspaces/${wsId}/invites`, { emails: [alice.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/work/workspaces/${wsId}/projects`, { key: 'AR', name: 'Review', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/work/projects/${pid}/members/${alice.id}`, { role: 'MEMBER' });
    const ch = await call(owner, 'POST', `/work/projects/${pid}/chat/channels`, { name: `review-${tag}`.slice(0, 40), kind: 'PUBLIC' });
    assert.equal(ch.status, 201, JSON.stringify(ch.raw));
    channelId = ch.data.id;
    const is = await call(owner, 'POST', `/work/projects/${pid}/issues`, { typeKey: 'TASK', title: 'Review task' });
    assert.equal(is.status, 201, JSON.stringify(is.raw));
    issueNum = is.data.number;
    const pg = await call(owner, 'POST', `/work/projects/${pid}/pages`, { title: 'Review doc' });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw));
    pageNum = pg.data.number;
    const [x, y] = owner.id < alice.id ? [owner, alice] : [alice, owner];
    threadId = (await prisma.messageThread.create({ data: { type: 'USER', userAId: x.id, userBId: y.id } })).id;
  });

  after(async () => {
    globalThis.fetch = fetchGoc;
    server?.close();
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    const all = [...userIds];
    await prisma.adminNotification.deleteMany({ where: { userId: { in: all } } }).catch(() => undefined);
    await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: all } }, { senderId: { in: all } }] } }).catch(() => undefined);
    await prisma.workEmailQueue.deleteMany({ where: { userId: { in: all } } }).catch(() => undefined);
    if (threadId) await prisma.messageThread.deleteMany({ where: { id: threadId } });
    await prisma.user.deleteMany({ where: { id: { in: all } } });
    await prisma.$disconnect();
  });

  // ─── B3: bộ lọc ở mọi cửa ghi ───────────────────────────────────────────────────────────────

  it('B3 Bảng tin: bài (tạo + sửa), bình chọn, bình luận (tạo + sửa) — chặn từ nặng, chữ thường đi qua, không lưu gì', async () => {
    const truoc = await prisma.workFeedPost.count({ where: { workspaceId: wsId } });
    blocked(await call(alice, 'POST', '/work/feed/posts', { workspaceId: wsId, body: BAD }), 'tạo bài');
    blocked(await call(alice, 'POST', '/work/feed/posts', { workspaceId: wsId, body: 'Bình chọn', poll: { options: ['Ok', 'f u c k'] } }), 'bình chọn');
    assert.equal(await prisma.workFeedPost.count({ where: { workspaceId: wsId } }), truoc, 'không lưu bài nào');
    const ok = await call(alice, 'POST', '/work/feed/posts', { workspaceId: wsId, body: SACH });
    assert.equal(ok.status, 201, JSON.stringify(ok.raw));
    blocked(await call(alice, 'PATCH', `/work/feed/posts/${ok.data.id}`, { body: 'kill yourself' }), 'sửa bài');
    assert.equal((await prisma.workFeedPost.findUnique({ where: { id: ok.data.id } }))!.body, SACH);
    blocked(await call(owner, 'POST', `/work/feed/posts/${ok.data.id}/comments`, { body: 'con đĩ' }), 'bình luận');
    const c = await call(owner, 'POST', `/work/feed/posts/${ok.data.id}/comments`, { body: 'Buổi họp lớn, các bạn đến đủ nhé' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    blocked(await call(owner, 'PATCH', `/work/feed/comments/${c.data.id}`, { body: 'n1gger' }), 'sửa bình luận');
  });

  it('B3 chat kênh CT Work: gửi + sửa', async () => {
    const path = `/work/projects/${pid}/chat/channels/${channelId}/messages`;
    blocked(await call(alice, 'POST', path, { body: BAD }), 'gửi chat');
    const m = await call(alice, 'POST', path, { body: SACH });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    blocked(await call(alice, 'PATCH', `${path}/${m.data.id}`, { body: 'địt mẹ' }), 'sửa chat');
    assert.equal(await prisma.workChannelMessage.count({ where: { channelId, body: { contains: 'lồn' } } }), 0);
  });

  it('B3 bình luận thẻ (thêm + sửa) và bình luận tài liệu', async () => {
    blocked(await call(alice, 'POST', `/work/projects/${pid}/issues/${issueNum}/comments`, { bodyJson: doc(BAD) }), 'bình luận thẻ');
    const c = await call(alice, 'POST', `/work/projects/${pid}/issues/${issueNum}/comments`, { bodyJson: doc(SACH) });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    blocked(await call(alice, 'PATCH', `/work/projects/${pid}/issues/${issueNum}/comments/${c.data.id}`, { bodyJson: doc('i will kill you') }), 'sửa bình luận thẻ');
    blocked(await call(alice, 'POST', `/work/projects/${pid}/pages/${pageNum}/comments`, { bodyJson: doc('cặc') }), 'bình luận tài liệu');
    assert.equal((await call(alice, 'POST', `/work/projects/${pid}/pages/${pageNum}/comments`, { bodyJson: doc(SACH) })).status, 201);
  });

  it('B3 tin nhắn riêng + biệt danh', async () => {
    blocked(await call(alice, 'POST', `/messages/threads/${threadId}/messages`, { content: BAD }), 'tin nhắn riêng');
    assert.equal(await prisma.message.count({ where: { threadId } }), 0);
    blocked(await call(alice, 'PUT', `/messages/threads/${threadId}/nickname`, { targetId: owner.id, alias: 'thằng bê đê' }), 'biệt danh');
  });

  it('B3 hồ sơ: tên hiển thị, giới thiệu (PUT /profile) và giới thiệu mở rộng (PATCH /users/me/profile)', async () => {
    blocked(await call(alice, 'PUT', '/profile', { displayName: 'fuck boy' }), 'tên hiển thị');
    blocked(await call(alice, 'PUT', '/profile', { bio: 'đéo quan tâm' }), 'giới thiệu');
    blocked(await call(alice, 'PATCH', '/users/me/profile', { bio: 'pornhub' }), 'giới thiệu mở rộng');
    const u = await prisma.user.findUnique({ where: { id: alice.id }, select: { displayName: true, bio: true } });
    assert.equal(u!.displayName, 'alice');
    assert.equal(u!.bio, null);
    const ok = await call(alice, 'PUT', '/profile', { displayName: 'Nguyễn Văn Phúc', bio: 'Dev ở Hà Nội, thích đi du lịch' });
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
  });

  // ─── R3 + kiểm duyệt admin ─────────────────────────────────────────────────────────────────

  let reportedMsgId = 0;
  it('R3 báo cáo MỘT tin nhắn riêng ⇒ BAO_CAO (nguyên văn tin) + ẩn với người báo cáo, người kia vẫn thấy', async () => {
    const m1 = await call(owner, 'POST', `/messages/threads/${threadId}/messages`, { content: 'tin xấu tính cần báo cáo' });
    assert.ok([200, 201].includes(m1.status), JSON.stringify(m1.raw));
    reportedMsgId = m1.data.id;
    const m2 = await call(owner, 'POST', `/messages/threads/${threadId}/messages`, { content: 'tin bình thường' });
    assert.ok([200, 201].includes(m2.status));

    const self = await call(owner, 'POST', `/messages/threads/${threadId}/report`, { reason: 'test', messageId: m2.data.id });
    assert.equal(self.code, 'REPORT_SELF');

    const r = await call(alice, 'POST', `/messages/threads/${threadId}/report`, { reason: 'Quấy rối', category: 'harassment', messageId: reportedMsgId });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.hiddenMessageId, reportedMsgId);
    const n = await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `dm-report:${r.data.id}` } });
    assert.ok(n, 'admin phải được báo');
    assert.equal(n!.loai, 'BAO_CAO');
    assert.equal(n!.mucDo, 'can_xu_ly');
    assert.match(n!.noiDung ?? '', /tin xấu tính cần báo cáo/);
    assert.match(n!.noiDung ?? '', new RegExp(`@${owner.username}`));

    const ids = (d: any) => (Array.isArray(d) ? d : d?.messages ?? []).map((x: any) => x.id);
    const cuaAlice = ids((await call(alice, 'GET', `/messages/threads/${threadId}/messages`)).data);
    const cuaOwner = ids((await call(owner, 'GET', `/messages/threads/${threadId}/messages`)).data);
    assert.ok(!cuaAlice.includes(reportedMsgId), 'ẩn với người báo cáo');
    assert.ok(cuaAlice.includes(m2.data.id));
    assert.ok(cuaOwner.includes(reportedMsgId), 'người kia vẫn thấy');

    // Báo cáo cả hội thoại (app cũ, không messageId) cũng tới admin.
    const r2 = await call(alice, 'POST', `/messages/threads/${threadId}/report`, { reason: 'Spam' });
    assert.equal(r2.status, 200);
    assert.ok(await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `dm-report:${r2.data.id}` } }));

    // Hàng chờ /admin/reports trả kèm tin bị báo cáo.
    const list = await call(admin, 'GET', '/admin/reports?status=open');
    assert.equal(list.status, 200, JSON.stringify(list.raw));
    const row = list.data.rows.find((x: any) => x.id === r.data.id);
    assert.equal(row?.reportedMessage?.id, reportedMsgId);
  });

  it('kiểm duyệt admin: gỡ tin nhắn riêng bị báo cáo từ thông báo; người thường ⇒ 403', async () => {
    const rep = await prisma.threadReport.findFirst({ where: { messageId: reportedMsgId }, select: { id: true } });
    const n = await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `dm-report:${rep!.id}` } });
    assert.equal((await call(alice, 'POST', `/admin/moderation/notifications/${n!.id}/remove-content`)).status, 403);
    const g = await call(admin, 'POST', `/admin/moderation/notifications/${n!.id}/remove-content`);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.deepEqual(g.data.target, { kind: 'dm_message', id: reportedMsgId });
    assert.ok((await prisma.message.findUnique({ where: { id: reportedMsgId } }))!.deletedAt);
    assert.equal((await prisma.adminNotification.findUnique({ where: { id: n!.id } }))!.daXuLy, true);
  });

  it('kiểm duyệt admin: báo cáo bài Bảng tin ⇒ admin site (không là thành viên) gỡ bài + khoá người viết', async () => {
    const p = await call(owner, 'POST', '/work/feed/posts', { workspaceId: wsId, body: 'Bài sẽ bị báo cáo' });
    const rp = await call(alice, 'POST', '/work/report', { kind: 'feed_post', id: p.data.id, reason: 'spam' });
    assert.equal(rp.status, 201, JSON.stringify(rp.raw));
    const n = await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `ctw-report:feed_post:${p.data.id}:${alice.id}` } });
    assert.ok(n);
    const g = await call(admin, 'POST', `/admin/moderation/notifications/${n!.id}/remove-content`);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.ok((await prisma.workFeedPost.findUnique({ where: { id: p.data.id } }))!.hiddenAt, 'bài đã bị ẩn');
    const k = await call(admin, 'POST', `/admin/moderation/notifications/${n!.id}/lock-author`);
    assert.equal(k.status, 200, JSON.stringify(k.raw));
    assert.equal(k.data.user.id, owner.id);
    assert.equal((await prisma.user.findUnique({ where: { id: owner.id } }))!.accountNonLocked, false);
    assert.equal((await call(owner, 'GET', '/work/workspaces')).status, 403, 'người bị khoá không gọi được API');
    await prisma.user.update({ where: { id: owner.id }, data: { accountNonLocked: true } });
  });

  it('báo cáo bình luận thẻ cũng tới hàng chờ admin site (trước 22/10 chỉ tới ADMIN dự án)', async () => {
    const c = await call(owner, 'POST', `/work/projects/${pid}/issues/${issueNum}/comments`, { bodyJson: doc('Bình luận sẽ bị báo cáo') });
    const r = await call(alice, 'POST', '/work/report', { kind: 'issue_comment', id: c.data.id, reason: 'harassment' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const n = await prisma.adminNotification.findUnique({ where: { khoaChongTrung: `ctw-report:issue_comment:${c.data.id}:${alice.id}` } });
    assert.ok(n);
    assert.equal((await call(admin, 'POST', `/admin/moderation/notifications/${n!.id}/remove-content`)).status, 200);
    assert.ok((await prisma.workComment.findUnique({ where: { id: c.data.id } }))!.deletedAt);
  });

  // ─── B5: Sign in with Apple ────────────────────────────────────────────────────────────────

  it('B5 đăng nhập Apple ⇒ đổi authorizationCode, lưu refresh token MÃ HOÁ; xoá tài khoản ⇒ /auth/revoke rồi xoá dòng', async () => {
    const ec = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
    process.env.APPLE_SIWA_TEAM_ID = 'TEAMID1234';
    process.env.APPLE_SIWA_KEY_ID = 'KEYID12345';
    process.env.APPLE_SIWA_PRIVATE_KEY = ec.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

    // identityToken "của Apple" ký bằng khoá RSA giả mà /auth/keys giả trả về.
    const rsa = generateKeyPairSync('rsa', { modulusLength: 2048 });
    appleKeys = { keys: [{ ...rsa.publicKey.export({ format: 'jwk' }), kid: 'test-kid', alg: 'RS256', use: 'sig' }] };
    const email = `${tag}_apple@test.local`;
    const sub = `${tag}.${randomUUID()}`;
    const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
    const h = b64({ alg: 'RS256', kid: 'test-kid' });
    const p = b64({ iss: 'https://appleid.apple.com', aud: 'com.cuongthai.ctwork', sub, email, exp: Math.floor(Date.now() / 1000) + 600 });
    const identityToken = `${h}.${p}.${createSign('RSA-SHA256').update(`${h}.${p}`).sign(rsa.privateKey).toString('base64url')}`;

    // Tài khoản có sẵn (CSDL test không có vai trò USER mà oauthRegister nối khi TẠO mới).
    const u = await prisma.user.create({ data: { username: `${tag}_apple`, email, password: null, provider: 'apple', providerId: sub } });
    userIds.push(u.id);
    const userId = u.id;
    const { xacMinhOAuth } = await import('../services/xacMinhOAuth.js');
    const xm = await xacMinhOAuth({}, { email, provider: 'apple', providerId: sub, identityToken });
    assert.deepEqual(xm, { ok: true, cach: 'apple', aud: 'com.cuongthai.ctwork' });
    const { luuTokenApple } = await import('../services/appleSiwa.service.js');
    assert.equal(await luuTokenApple(userId, xm.ok ? xm.aud : null, sub, 'code-123'), 'saved');
    const row = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: 'siwa:ctwork' } } });
    assert.ok(row, 'refresh token phải được lưu');
    assert.ok(row!.refreshTokenEnc?.startsWith('o1.'), 'lưu dạng mã hoá');
    assert.ok(!row!.refreshTokenEnc!.includes('rt-code-123'), 'không lưu bản rõ');
    assert.deepEqual(row!.settings, { clientId: 'com.cuongthai.ctwork', tokenType: 'refresh_token' });
    const doi = appleGoi.find((g) => g.url.endsWith('/auth/token'));
    assert.equal(doi?.form.client_id, 'com.cuongthai.ctwork');
    assert.equal(doi?.form.code, 'code-123');
    assert.equal(doi?.form.grant_type, 'authorization_code');
    const cs = JSON.parse(Buffer.from(doi!.form.client_secret!.split('.')[1]!, 'base64url').toString());
    assert.equal(cs.iss, 'TEAMID1234');
    assert.equal(cs.sub, 'com.cuongthai.ctwork');

    const { anonymizeAccount } = await import('../services/dataRights.service.js');
    await anonymizeAccount(userId);
    const thuHoi = appleGoi.filter((g) => g.url.endsWith('/auth/revoke'));
    assert.equal(thuHoi.length, 1);
    assert.equal(thuHoi[0]!.form.token, 'rt-code-123');
    assert.equal(thuHoi[0]!.form.token_type_hint, 'refresh_token');
    assert.equal(thuHoi[0]!.form.client_id, 'com.cuongthai.ctwork');
    assert.equal(await prisma.workOAuthConnection.count({ where: { userId } }), 0);
  });

  it('B5 thiếu cấu hình ⇒ đăng nhập vẫn chạy (không gọi Apple), xoá tài khoản vẫn xong; mã hỏng ⇒ không lưu, không lỗi', async () => {
    const { luuTokenApple, thuHoiTokenApple } = await import('../services/appleSiwa.service.js');
    assert.equal(await luuTokenApple(alice.id, 'com.cuongthai.ctwork', 'sub', 'bad-code'), 'failed:http-400');
    assert.equal(await prisma.workOAuthConnection.count({ where: { userId: alice.id } }), 0);
    delete process.env.APPLE_SIWA_TEAM_ID; delete process.env.APPLE_SIWA_KEY_ID; delete process.env.APPLE_SIWA_PRIVATE_KEY;
    const truoc = appleGoi.length;
    assert.equal(await luuTokenApple(alice.id, 'com.cuongthai.ctwork', 'sub', 'code-x'), 'skipped:no-config');
    await prisma.workOAuthConnection.create({ data: { userId: alice.id, provider: 'siwa:app', refreshTokenEnc: 'o1.x', settings: { clientId: 'com.cuongthai.app' } } });
    assert.deepEqual(await thuHoiTokenApple(alice.id), { revoked: 0, total: 1, skipped: 'no-config' });
    const { anonymizeAccount } = await import('../services/dataRights.service.js');
    await anonymizeAccount(alice.id);
    assert.equal(appleGoi.length, truoc, 'không gọi Apple khi thiếu cấu hình');
    assert.equal((await prisma.user.findUnique({ where: { id: alice.id } }))!.enabled, false, 'tài khoản vẫn bị xoá (ẩn danh)');
  });
});
