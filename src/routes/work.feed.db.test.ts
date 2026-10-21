/**
 * CT Work — BẢNG TIN NHÓM (Team Feed, 21/10/2026) qua HTTP thật trên Postgres cục bộ, kho R2 GIẢ (sandbox trong RAM):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.feed.db.test.ts
 *
 * Kịch bản: không gian có dự án FD (mở cho không gian, bật cổng khách: viewer VIEWER, guest GUEST+MEMBER, khách CLIENT) và
 * dự án PV (RIÊNG: chỉ bob) ⇒ phạm vi đọc (không gian / dự án / khách / agent / người ngoài) ⇒ bài có ảnh (thumbnail, bỏ
 * EXIF), tệp chữ (xem trước xemTep), video PUT thẳng (presign → complete → poster) ⇒ @nhắc + #tag + thẻ nội bộ theo quyền
 * người xem + thẻ link OG (ảnh tải về R2) ⇒ bình luận + trả lời một cấp ⇒ cảm xúc (đổi loại, bộ đếm, thông báo GỘP) ⇒ sửa/xoá
 * ⇒ ghim ⇒ lưu/ẩn/lọc/tìm ⇒ bình chọn ⇒ báo cáo + hàng chờ kiểm duyệt ⇒ chặn ⇒ phân trang con trỏ ⇒ thông báo theo mức theo
 * dõi ⇒ MCP `feed` + ctwork_delete ⇒ POST /work/report kind feed_post.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { headObject, putObject } from '../config/r2.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `fd${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CT Work — Bảng tin nhóm (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, alice: U, bob: U, carol: U, viewer: U, guest: U, client: U, outsider: U;
  let agent: { token: string; userId: number };
  let wsId = 0, wsSlug = '', p1 = 0, p2 = 0, p2Issue = 0;
  let media: typeof import('../services/work/feedMedia.service.js');
  let rpcId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', displayName: name[0].toUpperCase() + name.slice(1) } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function upload(u: U, path: string, name: string, type: string, bytes: Buffer, extra: Record<string, string> = {}) {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(bytes)], { type }), name);
    for (const [k, v] of Object.entries(extra)) form.append(k, v);
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: form });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function tool(token: string, name: string, args: Record<string, unknown> = {}) {
    const res = await fetch(`${base}/api/v1/work/mcp`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/call', params: { name, arguments: args } }),
    });
    const body = (await res.json()) as any;
    if (body.error) return { isError: true, text: JSON.stringify(body.error), json: null as any };
    const text: string = body.result.content[0].text;
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* untrusted */ }
    return { isError: body.result.isError as boolean, text, json };
  }
  const settle = () => media._awaitFeedBackgroundForTests();
  const feedOf = async (u: U, q = '') => (await call(u, 'GET', `/feed${q}`)).data;
  const ids = (d: any) => (d?.posts ?? []).map((p: any) => p.id);
  const notes = (u: U, pred: (n: any) => boolean = () => true) =>
    prisma.socialNotification.findMany({ where: { receiverId: u.id, payload: { path: ['surface'], equals: 'work' } }, orderBy: { id: 'asc' } }).then((r) => r.filter((n) => (n.payload as any)?.feed && pred(n)));
  const png = (w: number, h: number) => sharp({ create: { width: w, height: h, channels: 3, background: { r: 40, g: 120, b: 200 } } }).png().toBuffer();

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    media = await import('../services/work/feedMedia.service.js');
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    (await import('../mcp/server.js'))._resetMcpRateForTests();
    [owner, alice, bob, carol, viewer, guest, client, outsider] = await Promise.all(['owner', 'alice', 'bob', 'carol', 'viewer', 'guest', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    media?._setFeedLinkFetchForTests(null, null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    const all = [...userIds, ...(agent ? [agent.userId] : [])];
    if (all.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: all } }, { senderId: { in: all } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: all } } });
      await prisma.adminNotification.deleteMany({ where: { khoaChongTrung: { startsWith: 'ctw-report:feed_' }, userId: { in: all } } }).catch(() => undefined);
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: không gian + FD (mở, cổng khách) + PV (riêng, chỉ bob) + agent', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Feed ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsId = ws.data.id; wsSlug = ws.data.slug;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [alice.email, bob.email, carol.email, viewer.email], role: 'MEMBER' });
    const a = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'FD', name: 'Feed project', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    p1 = a.data.id;
    await call(owner, 'PUT', `/projects/${p1}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST', projectId: p1, projectRole: 'MEMBER' });
    const inv = await call(owner, 'POST', `/projects/${p1}/portal/invite`, { emails: [client.email] });
    assert.equal(inv.status, 201, JSON.stringify(inv.raw));
    const b = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'PV', name: 'Private project', template: 'BLANK', visibility: 'PRIVATE' });
    assert.equal(b.status, 201, JSON.stringify(b.raw));
    p2 = b.data.id;
    assert.equal((await call(owner, 'PUT', `/projects/${p2}/members/${bob.id}`, { role: 'MEMBER' })).status, 200);
    const cfg = (await call(owner, 'GET', `/projects/${p2}`)).data;
    const iss = await call(owner, 'POST', `/projects/${p2}/issues`, { typeId: cfg.issueTypes[0].id, title: 'Secret roadmap item' });
    assert.equal(iss.status, 201, JSON.stringify(iss.raw));
    p2Issue = iss.data.number;
    const ag = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Feed Bot', model: 'claude-sonnet-5', projectIds: [p1] });
    assert.equal(ag.status, 201, JSON.stringify(ag.raw));
    agent = { token: ag.data.token.token, userId: ag.data.agent.userId };
  });

  it('phạm vi: owner quản trị cả hai dự án; alice không thấy PV; khách cổng + người ngoài không có gì; agent 403', async () => {
    const o = (await call(owner, 'GET', '/feed/scopes')).data;
    const so = o.scopes.find((s: any) => s.workspace.id === wsId);
    assert.equal(so.canModerate, true);
    assert.deepEqual(so.projects.map((p: any) => p.key).sort(), ['FD', 'PV']);
    const sa = (await call(alice, 'GET', '/feed/scopes')).data.scopes.find((s: any) => s.workspace.id === wsId);
    assert.equal(sa.canPost, true);
    assert.equal(sa.canModerate, false);
    assert.deepEqual(sa.projects.map((p: any) => p.key), ['FD']);
    const sg = (await call(guest, 'GET', '/feed/scopes')).data.scopes.find((s: any) => s.workspace.id === wsId);
    assert.ok(sg, 'GUEST (không phải khách cổng) đọc được bảng tin không gian');
    assert.deepEqual(sg.projects.map((p: any) => p.key), ['FD']);
    assert.deepEqual((await call(client, 'GET', '/feed/scopes')).data.scopes, [], 'khách cổng: không có phạm vi nào');
    assert.equal((await call(client, 'GET', `/feed?workspaceId=${wsId}`)).status, 404);
    assert.equal((await call(client, 'GET', `/feed?projectId=${p1}`)).status, 404);
    assert.equal((await call(client, 'POST', '/feed/posts', { workspaceId: wsId, body: 'hi' })).status, 404);
    assert.equal((await call(outsider, 'GET', `/feed?workspaceId=${wsId}`)).status, 404);
    assert.equal((await call(alice, 'GET', `/feed?projectId=${p2}`)).status, 404, 'dự án riêng');
    for (const [m, p] of [['GET', '/feed'], ['GET', '/feed/scopes'], ['POST', '/feed/posts']] as const) {
      const r = await call({ token: agent.token }, m, p, m === 'POST' ? { workspaceId: wsId, body: 'x' } : undefined);
      assert.equal(r.status, 403, `${m} ${p}`);
      assert.equal(r.code, 'WORK_AGENT_FORBIDDEN');
    }
    const { feedRoomsFor } = await import('../services/work/feed.service.js');
    const rooms = await feedRoomsFor(alice.id);
    assert.ok(rooms.includes(`work:feed:ws:${wsId}`) && rooms.includes(`work:feed:p:${p1}`) && !rooms.includes(`work:feed:p:${p2}`));
    assert.deepEqual(await feedRoomsFor(client.id), []);
    assert.deepEqual(await feedRoomsFor(agent.userId), []);
  });

  let photo: any, doc: any, video: any;

  it('tệp: ảnh qua backend (thumbnail ≤ 1280, kích thước), tệp chữ, video PUT thẳng ⇒ complete ⇒ poster; nháp chỉ của mình', async () => {
    const img = await sharp(await png(2400, 1600)).withMetadata({ exif: { IFD0: { Copyright: 'secret-gps' } } }).jpeg().toBuffer();
    const r = await upload(alice, '/feed/uploads', 'sprint.jpg', 'image/jpeg', img, { workspaceId: String(wsId), alt: 'Burndown' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    photo = r.data;
    assert.equal(photo.kind, 'IMAGE');
    assert.equal(photo.width, 2400);
    assert.equal(photo.alt, 'Burndown');
    assert.ok(photo.url && photo.thumbUrl && photo.thumbUrl !== photo.url && photo.urlExpiresAt);
    const row = await prisma.workFeedAttachment.findUniqueOrThrow({ where: { id: photo.id } });
    const meta = await sharp((await (await import('../services/work/xemTep.js')).docDau(row.r2Key, 10 * 1024 * 1024, row.size)).buf).metadata();
    assert.equal(meta.exif, undefined, 'EXIF bị bỏ (GPS không lọt)');
    const tmeta = await headObject(row.thumbKey!);
    assert.equal(tmeta?.contentType, 'image/webp');

    const t = await upload(alice, '/feed/uploads', 'notes.md', 'text/markdown', Buffer.from('# Retro notes\n- ship it'), { workspaceId: String(wsId) });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    doc = t.data;
    assert.equal(doc.kind, 'FILE');
    assert.equal(doc.thumbUrl, null);

    // Đường B: video lớn PUT thẳng R2 (ở đây ghi thẳng vào kho giả thay cho PUT của trình duyệt).
    const ps = await call(alice, 'POST', '/feed/uploads/presign', { workspaceId: wsId, fileName: 'demo.mp4', mime: 'video/mp4', size: 3000, kind: 'VIDEO' });
    assert.equal(ps.status, 201, JSON.stringify(ps.raw));
    assert.equal(ps.data.attachment.status, 'PENDING');
    assert.equal(ps.data.headers['Content-Type'], 'video/mp4');
    assert.match(ps.data.uploadUrl, /__r2-sandbox|r2-sandbox/);
    assert.equal((await call(alice, 'POST', `/feed/uploads/${ps.data.attachment.id}/complete`, {})).code, 'WORK_UPLOAD_MISSING');
    const vrow = await prisma.workFeedAttachment.findUniqueOrThrow({ where: { id: ps.data.attachment.id } });
    await putObject(vrow.r2Key, Buffer.alloc(3000, 1), 'video/mp4', 'private, no-store');
    const done = await call(alice, 'POST', `/feed/uploads/${vrow.id}/complete`, { width: 1280, height: 720, durationMs: 4200 });
    assert.equal(done.status, 200, JSON.stringify(done.raw));
    assert.equal(done.data.status, 'READY');
    assert.equal(done.data.durationMs, 4200);
    const pos = await upload(alice, `/feed/uploads/${vrow.id}/poster`, 'poster.png', 'image/png', await png(640, 360));
    assert.equal(pos.status, 200, JSON.stringify(pos.raw));
    video = pos.data;
    assert.ok(video.posterUrl);
    // Quá trần / sai loại
    assert.equal((await call(alice, 'POST', '/feed/uploads/presign', { workspaceId: wsId, fileName: 'big.mp4', mime: 'video/mp4', size: 201 * 1024 * 1024, kind: 'VIDEO' })).code, 'WORK_FILE_TOO_LARGE');
    assert.equal((await call(alice, 'POST', '/feed/uploads/presign', { workspaceId: wsId, fileName: 'a.png', mime: 'image/png', size: 100, kind: 'FILE' })).code, 'WORK_FILE_TYPE');
    // Nháp của alice: bob không gắn được, không xin URL được, khách không tải lên được
    assert.equal((await call(bob, 'GET', `/feed/attachments/${photo.id}/url`)).status, 404);
    assert.equal((await upload(client, '/feed/uploads', 'x.txt', 'text/plain', Buffer.from('x'), { workspaceId: String(wsId) })).status, 404);
    const stolen = await call(bob, 'POST', '/feed/posts', { workspaceId: wsId, body: 'mine now', attachmentIds: [photo.id] });
    assert.equal(stolen.code, 'WORK_FEED_BAD_ATTACHMENT');
  });

  let postA = 0;

  it('đăng bài không gian: ảnh+tệp+video, @nhắc chỉ người đọc được, #tag, thẻ nội bộ theo quyền NGƯỜI XEM, thẻ link OG', async () => {
    media._setFeedLinkFetchForTests(
      async (url) => ({ url, domain: 'react.dev', title: 'React Blog', description: 'News from the React team', siteName: 'React', imageUrl: 'https://react.dev/og.png' }),
      async () => ({ bytes: await png(1200, 630), type: 'image/png' }),
    );
    const body = `Sprint demo Friday @${bob.username} @${client.username} — bring the build #Demo #sprint4\nRoadmap: /work/${wsSlug}/PV/issue/${p2Issue}\nRead https://react.dev/blog`;
    const r = await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, body, attachmentIds: [photo.id, doc.id, video.id], clientKey: 'k-1' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    postA = r.data.id;
    assert.equal(r.data.project, null);
    assert.equal(r.data.authorRole, 'MEMBER');
    assert.deepEqual(r.data.mentions.map((m: any) => m.id), [bob.id], 'khách không được @nhắc (không đọc được bảng tin)');
    assert.deepEqual(r.data.hashtags, ['demo', 'sprint4']);
    assert.deepEqual(r.data.attachments.map((a: any) => a.kind), ['IMAGE', 'FILE', 'VIDEO']);
    assert.equal(r.data.url, `/work/${wsSlug}/feed?post=${postA}`);
    assert.equal(r.data.refs.length, 0, 'alice không thấy dự án PV ⇒ không có thẻ');
    assert.equal(r.data.can.edit, true);
    assert.equal(r.data.can.pin, false);
    // clientKey: gửi lại ⇒ cùng bài
    const again = await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, body, clientKey: 'k-1' });
    assert.equal(again.data.id, postA);
    await settle();
    const asBob = (await call(bob, 'GET', `/feed/posts/${postA}`)).data;
    assert.equal(asBob.refs.length, 1, 'bob thấy PV ⇒ thẻ thẻ');
    assert.equal(asBob.refs[0].key, `PV-${p2Issue}`);
    assert.equal(asBob.linkPreview.title, 'React Blog');
    assert.ok(asBob.linkPreview.imageUrl, 'ảnh OG đã tải về R2 và ký URL');
    assert.equal(asBob.can.edit, false);
    assert.equal(asBob.can.report, true);
    // Tệp của bài: người đọc được bài xin URL được; khách thì không
    assert.equal((await call(bob, 'GET', `/feed/attachments/${doc.id}/url?download=1`)).status, 200);
    assert.equal((await call(client, 'GET', `/feed/attachments/${doc.id}/url`)).status, 404);
    const txt = await fetch(`${base}/api/v1/work/feed/attachments/${doc.id}/content`, { headers: { Authorization: `Bearer ${bob.token}` } });
    assert.equal(txt.status, 200);
    assert.match(await txt.text(), /Retro notes/);
    // Link preview của ô soạn: địa chỉ nội bộ bị chặn (rào SSRF thật, không qua mạng)
    media._setFeedLinkFetchForTests(null, null);
    assert.equal((await call(alice, 'POST', '/feed/link-preview', { url: 'http://127.0.0.1:5432/' })).code, 'WORK_URL_BLOCKED');
    assert.equal((await call(alice, 'POST', '/feed/link-preview', { url: 'http://169.254.169.254/latest/meta-data' })).code, 'WORK_URL_BLOCKED');
  });

  it('thông báo bài mới: @nhắc ⇒ WORK_MENTION (không thêm ALERT); người khác ⇒ WORK_ALERT; khách/agent/người đăng không nhận; mức MENTIONS/OFF', async () => {
    const bm = await notes(bob);
    assert.equal(bm.length, 1);
    assert.equal(bm[0].type, 'WORK_MENTION');
    assert.equal((bm[0].payload as any).url, `/work/${wsSlug}/feed?post=${postA}`);
    assert.equal((bm[0].payload as any).feed.postId, postA);
    for (const u of [owner, carol, viewer, guest]) {
      const n = await notes(u);
      assert.equal(n.length, 1, u.username);
      assert.equal(n[0].type, 'WORK_ALERT');
      assert.equal((n[0].payload as any).noEmail, true);
      assert.match((n[0].payload as any).message, /posted in/);
    }
    assert.equal((await notes(client)).length, 0);
    assert.equal((await notes(alice)).length, 0);
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: agent.userId } }), 0);
    // Mức theo dõi
    assert.equal((await call(carol, 'PUT', '/feed/follow', { workspaceId: wsId, level: 'MENTIONS' })).status, 200);
    assert.equal((await call(viewer, 'PUT', '/feed/follow', { workspaceId: wsId, level: 'OFF' })).status, 200);
    assert.equal((await call(client, 'PUT', '/feed/follow', { workspaceId: wsId, level: 'OFF' })).status, 404);
    const r = await call(owner, 'POST', '/feed/posts', { workspaceId: wsId, body: `Welcome all @${viewer.username} @${carol.username}` });
    assert.equal(r.status, 201);
    await settle();
    assert.equal((await notes(carol)).filter((n) => (n.payload as any).feed.postId === r.data.id).map((n) => n.type).join(), 'WORK_MENTION', 'MENTIONS: chỉ @nhắc');
    assert.equal((await notes(viewer)).filter((n) => (n.payload as any).feed.postId === r.data.id).length, 0, 'OFF: kể cả @nhắc');
    assert.equal((await notes(bob)).filter((n) => (n.payload as any).feed.postId === r.data.id).map((n) => n.type).join(), 'WORK_ALERT');
    // Gói đẩy APNs: thread theo bài, feedPostId ở cấp ngoài
    const { goiDayCtw } = await import('../services/push/goiDayCtw.js');
    const g = goiDayCtw('WORK_MENTION', bm[0].payload);
    assert.equal(g.threadId, `ctw-feed-${postA}`);
    assert.equal(g.them.feedPostId, postA);
  });

  let postP = 0;

  it('bài dự án riêng PV: chỉ bob + quản trị thấy; bảng tin gộp lọc đúng; khách không đăng vào FD', async () => {
    const r = await call(bob, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p2, body: 'PV kickoff notes' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    postP = r.data.id;
    assert.equal(r.data.project.key, 'PV');
    assert.equal((await call(alice, 'GET', `/feed/posts/${postP}`)).status, 404);
    assert.ok(!ids(await feedOf(alice)).includes(postP));
    assert.ok(ids(await feedOf(owner)).includes(postP));
    assert.ok(ids(await feedOf(owner, `?workspaceId=${wsId}`)).includes(postP));
    assert.ok(!ids(await feedOf(owner, `?workspaceId=${wsId}&level=workspace`)).includes(postP), 'level=workspace: chỉ bài cấp không gian');
    assert.deepEqual(ids(await feedOf(bob, `?projectId=${p2}`)), [postP]);
    assert.equal((await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p2, body: 'x' })).status, 404);
    assert.equal((await call(client, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p1, body: 'client here' })).status, 404, 'vai CLIENT không bao giờ thấy bảng tin dự án');
    assert.equal((await call(viewer, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p1, body: 'viewer can post' })).status, 201, 'VIEWER đăng được bảng tin dự án');
    assert.equal((await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p2 + 99999, body: 'x' })).status, 404);
  });

  let cAlice = 0, cBob = 0, cCarol = 0;

  it('bình luận + trả lời MỘT cấp (trả lời trả lời ⇒ gắn gốc), bộ đếm, thông báo tác giả/được trả lời, xem thêm', async () => {
    const a = await call(bob, 'POST', `/feed/posts/${postA}/comments`, { body: `Will do @${alice.username}` });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    cBob = a.data.id;
    const b = await call(alice, 'POST', `/feed/posts/${postA}/comments`, { body: 'Thanks!', parentId: cBob });
    assert.equal(b.status, 201);
    cAlice = b.data.id;
    assert.equal(b.data.parentId, cBob);
    const c = await call(carol, 'POST', `/feed/posts/${postA}/comments`, { body: 'Reply to a reply', parentId: cAlice });
    assert.equal(c.data.parentId, cBob, 'một cấp: gắn vào bình luận gốc');
    cCarol = c.data.id;
    const post = (await call(alice, 'GET', `/feed/posts/${postA}`)).data;
    assert.equal(post.commentCount, 3);
    assert.equal(post.comments.length, 1, 'xem trước: bình luận GỐC');
    const list = (await call(alice, 'GET', `/feed/posts/${postA}/comments`)).data;
    assert.equal(list.comments.length, 1);
    assert.equal(list.comments[0].replyCount, 2);
    assert.deepEqual(list.comments[0].replies.map((x: any) => x.id), [cAlice, cCarol]);
    const reps = (await call(alice, 'GET', `/feed/posts/${postA}/comments?parentId=${cBob}`)).data;
    assert.equal(reps.comments.length, 2);
    await settle();
    // alice (tác giả bài): bob @nhắc alice ⇒ MENTION (không thêm COMMENT); carol trả lời alice ⇒ COMMENT reply
    const an = await notes(alice);
    assert.ok(an.some((n) => n.type === 'WORK_MENTION' && n.secondaryEntityId === cBob));
    assert.ok(!an.some((n) => n.type === 'WORK_COMMENT' && n.secondaryEntityId === cBob));
    assert.ok(an.some((n) => n.type === 'WORK_COMMENT' && n.secondaryEntityId === cCarol && (n.payload as any).reply === true));
    // bob: alice trả lời bình luận của bob ⇒ COMMENT reply
    assert.ok((await notes(bob)).some((n) => n.type === 'WORK_COMMENT' && n.secondaryEntityId === cAlice && (n.payload as any).reply === true && (n.payload as any).url.endsWith(`&comment=${cAlice}`)));
    // Sửa: chỉ tác giả; sửa thêm @nhắc ⇒ chỉ người MỚI được nhắc
    assert.equal((await call(bob, 'PATCH', `/feed/comments/${cAlice}`, { body: 'hack' })).status, 403);
    const e = await call(alice, 'PATCH', `/feed/comments/${cAlice}`, { body: 'Thanks a lot!' });
    assert.ok(e.data.editedAt);
    // Xoá: thành viên không xoá được của người khác; tác giả gốc xoá ⇒ trả lời đi theo
    assert.equal((await call(carol, 'DELETE', `/feed/comments/${cBob}`)).status, 403);
  });

  it('cảm xúc: đổi loại không tăng đếm, gỡ, danh sách ai thả, thông báo GỘP một lần / 15 phút; cảm xúc trên bình luận', async () => {
    const r1 = await call(bob, 'PUT', `/feed/posts/${postA}/reaction`, { kind: 'like' });
    assert.equal(r1.data.reactionCount, 1);
    assert.equal(r1.data.myReaction, 'like');
    const r2 = await call(bob, 'PUT', `/feed/posts/${postA}/reaction`, { kind: 'love' });
    assert.equal(r2.data.reactionCount, 1, 'đổi loại');
    assert.deepEqual(r2.data.reactions, [{ kind: 'love', count: 1 }]);
    await call(carol, 'PUT', `/feed/posts/${postA}/reaction`, { kind: 'celebrate' });
    await call(owner, 'PUT', `/feed/posts/${postA}/reaction`, { kind: 'celebrate' });
    assert.equal((await call(bob, 'PUT', `/feed/posts/${postA}/reaction`, { kind: 'angry' })).status, 400);
    const who = (await call(alice, 'GET', `/feed/posts/${postA}/reactions`)).data;
    assert.equal(who.items.length, 3);
    assert.deepEqual(who.reactions, [{ kind: 'celebrate', count: 2 }, { kind: 'love', count: 1 }]);
    assert.equal((await call(alice, 'GET', `/feed/posts/${postA}/reactions?kind=love`)).data.items[0].user.id, bob.id);
    const del = await call(owner, 'DELETE', `/feed/posts/${postA}/reaction`);
    assert.equal(del.data.reactionCount, 2);
    assert.equal(del.data.myReaction, null);
    await settle();
    const rn = (await notes(alice)).filter((n) => (n.payload as any).feed.event === 'reaction');
    assert.equal(rn.length, 1, 'gộp: một thông báo cho ba cảm xúc');
    const cr = await call(alice, 'PUT', `/feed/comments/${cBob}/reaction`, { kind: 'haha' });
    assert.equal(cr.data.reactionCount, 1);
    assert.equal((await call(bob, 'GET', `/feed/posts/${postA}/comments`)).data.comments[0].reactions[0].kind, 'haha');
  });

  it('sửa bài (chỉ tác giả, editedAt, gỡ tệp), ghim (chỉ quản trị, nổi lên đầu, không lặp), bình luận tắt', async () => {
    assert.equal((await call(bob, 'PATCH', `/feed/posts/${postA}`, { body: 'x' })).status, 403);
    const e = await call(alice, 'PATCH', `/feed/posts/${postA}`, { body: `Sprint demo moved to Monday #demo`, removeAttachmentIds: [doc.id] });
    assert.equal(e.status, 200, JSON.stringify(e.raw));
    assert.ok(e.data.editedAt);
    assert.deepEqual(e.data.attachments.map((a: any) => a.kind), ['IMAGE', 'VIDEO']);
    assert.equal(e.data.linkPreview, null, 'không còn link ⇒ bỏ thẻ');
    assert.equal(await prisma.workFeedAttachment.count({ where: { id: doc.id } }), 0);
    assert.equal((await call(alice, 'PUT', `/feed/posts/${postA}/pin`, { pinned: true })).status, 403);
    const pin = await call(owner, 'PUT', `/feed/posts/${postA}/pin`, { pinned: true });
    assert.equal(pin.data.pinned, true);
    const f = await feedOf(alice, `?workspaceId=${wsId}`);
    assert.deepEqual(f.pinned.map((p: any) => p.id), [postA]);
    assert.ok(!ids(f).includes(postA), 'bài ghim không lặp trong danh sách');
    assert.ok(ids(await feedOf(alice)).includes(postA), 'bảng tin gộp: theo thời gian');
    await call(alice, 'PATCH', `/feed/posts/${postA}`, { commentsOff: true });
    assert.equal((await call(bob, 'POST', `/feed/posts/${postA}/comments`, { body: 'x' })).status, 403);
    assert.equal((await call(owner, 'POST', `/feed/posts/${postA}/comments`, { body: 'Admins can still comment' })).status, 201);
    await call(alice, 'PATCH', `/feed/posts/${postA}`, { commentsOff: false });
  });

  it('lưu / ẩn cho tôi / lọc media, mine, saved, files / tìm chữ và #tag / đếm bài mới', async () => {
    assert.deepEqual((await call(bob, 'PUT', `/feed/posts/${postA}/save`, { saved: true })).data, { saved: true });
    assert.deepEqual(ids(await feedOf(bob, '?filter=saved')), [postA]);
    assert.ok(ids(await feedOf(bob, '?filter=media')).includes(postA));
    assert.ok(!ids(await feedOf(bob, '?filter=media')).includes(postP));
    assert.deepEqual(ids(await feedOf(alice, '?filter=mine')), [postA]);
    assert.ok(ids(await feedOf(bob, '?q=%23demo')).includes(postA));
    assert.ok(ids(await feedOf(bob, '?q=moved%20to%20monday')).includes(postA));
    assert.ok(!ids(await feedOf(bob, '?q=%23nothing')).includes(postA));
    const since = new Date(Date.now() - 5).toISOString();
    const nr = await call(owner, 'POST', '/feed/posts', { workspaceId: wsId, body: 'Fresh one' });
    assert.equal((await call(bob, 'GET', `/feed/new-count?since=${encodeURIComponent(since)}&workspaceId=${wsId}`)).data.count, 1);
    assert.equal((await call(owner, 'GET', `/feed/new-count?since=${encodeURIComponent(since)}`)).data.count, 0, 'bài của chính mình không tính');
    assert.deepEqual((await call(bob, 'PUT', `/feed/posts/${nr.data.id}/hide`, { hidden: true })).data, { hidden: true });
    assert.ok(!ids(await feedOf(bob)).includes(nr.data.id));
    assert.equal((await call(bob, 'GET', `/feed/posts/${nr.data.id}`)).data.hiddenForMe, true, 'mở thẳng vẫn được (để bỏ ẩn)');
  });

  it('bình chọn: một lựa chọn, đổi phiếu, rút phiếu; multi; đóng', async () => {
    const r = await call(carol, 'POST', '/feed/posts', { workspaceId: wsId, projectId: p1, body: 'Retro day?', poll: { options: ['Thu', 'Fri'] } });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.deepEqual(r.data.poll.options.map((o: any) => o.id), ['a', 'b']);
    const v = await call(alice, 'PUT', `/feed/posts/${r.data.id}/vote`, { optionIds: ['a'] });
    assert.equal(v.data.totalVotes, 1);
    assert.deepEqual(v.data.myVotes, ['a']);
    assert.equal((await call(alice, 'PUT', `/feed/posts/${r.data.id}/vote`, { optionIds: ['a', 'b'] })).code, 'WORK_FEED_POLL');
    const v2 = await call(alice, 'PUT', `/feed/posts/${r.data.id}/vote`, { optionIds: ['b'] });
    assert.deepEqual(v2.data.options.map((o: any) => o.votes), [0, 1]);
    assert.equal((await call(alice, 'PUT', `/feed/posts/${r.data.id}/vote`, { optionIds: [] })).data.totalVotes, 0);
    await prisma.workFeedPost.update({ where: { id: r.data.id }, data: { poll: { options: [{ id: 'a', text: 'Thu' }, { id: 'b', text: 'Fri' }], multi: false, closesAt: '2020-01-01T00:00:00.000Z' } } });
    assert.equal((await call(alice, 'PUT', `/feed/posts/${r.data.id}/vote`, { optionIds: ['a'] })).code, 'WORK_FEED_POLL_CLOSED');
    assert.equal((await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, poll: { options: ['same', 'Same'] } })).code, 'WORK_FEED_POLL');
    assert.equal((await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, body: '   ' })).code, 'WORK_EMPTY');
  });

  let reportId = 0;

  it('báo cáo: không báo bài mình; trùng ⇒ duplicate; người báo không còn thấy; quản trị xem hàng chờ ⇒ gỡ ⇒ tác giả vẫn thấy (hidden)', async () => {
    const mine = await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, body: 'Buy cheap followers now!!!' });
    assert.equal((await call(alice, 'POST', `/feed/posts/${mine.data.id}/report`, { reason: 'spam' })).code, 'WORK_REPORT_SELF');
    const r = await call(bob, 'POST', `/feed/posts/${mine.data.id}/report`, { reason: 'spam', detail: 'ad' });
    assert.equal(r.status, 201);
    assert.deepEqual(r.data, { reported: true, duplicate: false });
    assert.equal((await call(bob, 'POST', `/feed/posts/${mine.data.id}/report`, { reason: 'spam' })).data.duplicate, true);
    assert.ok(!ids(await feedOf(bob)).includes(mine.data.id), 'người báo cáo không còn thấy');
    // Một cửa POST /work/report kind feed_post (app iOS dùng chung)
    const via = await call(carol, 'POST', '/report', { kind: 'feed_post', id: mine.data.id, reason: 'harassment' });
    assert.equal(via.status, 201, JSON.stringify(via.raw));
    assert.equal((await call(alice, 'GET', '/feed/reports')).data.reports.length, 0, 'thành viên không có hàng chờ');
    const q = (await call(owner, 'GET', `/feed/reports?workspaceId=${wsId}`)).data;
    assert.equal(q.openCount, 2);
    const rep = q.reports.find((x: any) => x.target.postId === mine.data.id);
    assert.equal(rep.reportCount, 2);
    reportId = rep.id;
    const res = await call(owner, 'POST', `/feed/reports/${reportId}/resolve`, { action: 'remove' });
    assert.equal(res.data.status, 'RESOLVED');
    assert.equal((await call(owner, 'GET', `/feed/reports?workspaceId=${wsId}`)).data.openCount, 0, 'đóng mọi báo cáo cùng nội dung');
    assert.equal((await call(guest, 'GET', `/feed/posts/${mine.data.id}`)).status, 404, 'đã gỡ ⇒ người khác không thấy');
    assert.equal((await call(alice, 'GET', `/feed/posts/${mine.data.id}`)).data.hidden, true, 'tác giả thấy, kèm hidden');
    assert.equal((await call(owner, 'GET', `/feed/posts/${mine.data.id}`)).data.hidden, true, 'quản trị thấy');
    assert.equal((await call(bob, 'POST', `/feed/reports/${reportId}/resolve`, { action: 'dismiss' })).status, 404);
    // Báo cáo bình luận
    const cr = await call(guest, 'POST', `/feed/comments/${cBob}/report`, { reason: 'other' });
    assert.equal(cr.status, 201, JSON.stringify(cr.raw));
    const cl = (await call(guest, 'GET', `/feed/posts/${postA}/comments`)).data.comments[0];
    assert.equal(cl.reportedByMe, true);
    assert.equal(cl.hiddenForMe, true);
    // Quản trị gỡ bình luận
    assert.equal((await call(bob, 'PUT', `/feed/comments/${cCarol}/moderation`, { hidden: true })).status, 403);
    assert.equal((await call(owner, 'PUT', `/feed/comments/${cCarol}/moderation`, { hidden: true })).data.hidden, true);
    const asGuest = (await call(guest, 'GET', `/feed/posts/${postA}/comments?parentId=${cBob}`)).data.comments.map((x: any) => x.id);
    assert.ok(!asGuest.includes(cCarol));
  });

  it('chặn (site): bài của người bị chặn biến khỏi bảng tin, mở thẳng 404; bình luận ⇒ hiddenForMe; không nhận thông báo của họ', async () => {
    await prisma.userBlock.create({ data: { blockerId: carol.id, blockedId: alice.id } });
    assert.ok(!ids(await feedOf(carol)).includes(postA));
    assert.equal((await call(carol, 'GET', `/feed/posts/${postA}`)).status, 404);
    await settle();
    const before = (await notes(carol)).length;
    const r = await call(alice, 'POST', '/feed/posts', { workspaceId: wsId, body: `Hey @${carol.username}` });
    await settle();
    assert.equal((await notes(carol)).length, before, 'không chuông từ người mình chặn');
    const own = await call(carol, 'POST', '/feed/posts', { workspaceId: wsId, body: 'carol here' });
    await call(alice, 'POST', `/feed/posts/${own.data.id}/comments`, { body: 'hi carol' });
    const cs = (await call(carol, 'GET', `/feed/posts/${own.data.id}/comments`)).data.comments;
    assert.equal(cs[0].authorBlocked, true);
    assert.equal(cs[0].hiddenForMe, true);
    await prisma.userBlock.deleteMany({ where: { blockerId: carol.id } });
    assert.equal((await call(carol, 'GET', `/feed/posts/${r.data.id}`)).status, 200);
  });

  it('phân trang con trỏ: mới nhất trước, không trùng/không sót, hoà createdAt xếp theo id', async () => {
    const at = new Date('2026-01-01T00:00:00.000Z');
    const made: number[] = [];
    for (let i = 0; i < 5; i += 1) {
      const p = await prisma.workFeedPost.create({ data: { workspaceId: wsId, projectId: p1, authorId: guest.id, body: `page ${i}`, createdAt: i < 2 ? at : new Date(at.getTime() + i * 1000) } });
      made.push(p.id);
    }
    const seen: number[] = [];
    let cursor: string | null = null;
    for (let n = 0; n < 10; n += 1) {
      const d: any = (await call(guest, 'GET', `/feed?projectId=${p1}&author=${guest.id}&limit=2${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`)).data;
      seen.push(...ids(d));
      cursor = d.nextCursor;
      if (!cursor) break;
    }
    assert.deepEqual(seen, [made[4], made[3], made[2], made[1], made[0]]);
    assert.equal((await call(guest, 'GET', '/feed?cursor=garbage')).status, 200, 'con trỏ rác ⇒ trang đầu');
  });

  it('xoá: tác giả xoá bình luận gốc ⇒ trả lời đi theo, bộ đếm đúng; quản trị xoá bài người khác; thành viên không', async () => {
    const before = (await call(bob, 'GET', `/feed/posts/${postA}`)).data.commentCount;
    const d = await call(bob, 'DELETE', `/feed/comments/${cBob}`);
    assert.equal(d.status, 200);
    const after1 = (await call(bob, 'GET', `/feed/posts/${postA}`)).data.commentCount;
    assert.equal(after1, before - 3, 'gốc + 2 trả lời (kể cả trả lời đã bị gỡ)');
    assert.equal((await call(bob, 'DELETE', `/feed/posts/${postA}`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `/feed/posts/${postA}`)).status, 200);
    assert.equal((await call(alice, 'GET', `/feed/posts/${postA}`)).status, 404);
    assert.equal(await prisma.workFeedAttachment.count({ where: { postId: postA } }), 0, 'tệp của bài đã xoá bị dọn');
  });

  it('MCP: token NGƯỜI dùng `feed` (đăng/đọc/bình luận/cảm xúc) + ctwork_delete feed_post; agent không thấy, gọi ⇒ lỗi', async () => {
    const tok = (await call(bob, 'POST', '/me/api-tokens', { name: 'CuongMini · bob', scopes: ['read', 'write'] })).data.token;
    const p = await tool(tok, 'feed', { action: 'post', workspace: wsSlug, project: 'FD', markdown: `From CuongMini #ai @${alice.username}` });
    assert.equal(p.isError, false, p.text);
    const postId = p.json.posted;
    assert.match(p.json.url, /\/feed\?post=/);
    const l = await tool(tok, 'feed', { action: 'list', project: 'FD' });
    assert.match(l.text, /untrusted="true"/);
    assert.match(l.text, /From CuongMini/);
    const c = await tool(tok, 'feed', { action: 'comment', post: postId, markdown: 'first' });
    assert.equal(c.isError, false, c.text);
    assert.equal((await tool(tok, 'feed', { action: 'react', post: postId, kind: 'celebrate' })).json.reactionCount, 1);
    const g = await tool(tok, 'feed', { action: 'get', post: postId });
    assert.match(g.text, /first/);
    const del = await tool(tok, 'ctwork_delete', { kind: 'feed_post', id: postId });
    assert.equal(del.isError, false, del.text);
    assert.equal((await call(bob, 'GET', `/feed/posts/${postId}`)).status, 404);
    const viaAgent = await tool(agent.token, 'feed', { action: 'list' });
    assert.equal(viaAgent.isError, true);
    const list = await fetch(`${base}/api/v1/work/mcp`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${agent.token}` }, body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/list' }) });
    const names = ((await list.json()) as any).result.tools.map((t: any) => t.name);
    assert.ok(!names.includes('feed'));
  });
});
