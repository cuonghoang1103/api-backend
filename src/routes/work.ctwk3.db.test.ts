/**
 * CT Work K-3 — kênh chat dự án, qua HTTP thật + Postgres cục bộ (kho R2 GIẢ trong RAM, STT GIẢ — không gọi Groq):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctwk3.db.test.ts
 *
 *   Q  Quyền xem kênh: thành viên / viewer / teacher / client / guest / người ngoài / agent · kênh riêng · kênh khách.
 *   M  Tin: @nhắc ⇒ chuông (không email) · luồng một cấp + "New reply" · sửa (đã sửa) / xoá + kiểm toán · ghim + kiểm
 *      toán · cảm xúc · tìm kiếm · chống gửi trùng (clientKey) · chưa đọc / đã đọc / đọc tất cả.
 *   S  Chia sẻ: thẻ xem trước theo quyền người xem (khách không thấy thẻ chưa chia sẻ) · tạo thẻ từ tin · chuyển tiếp ·
 *      gọi nhóm (Jitsi tự sinh / Meet dán vào / dùng lại).
 *   F  Tệp/ảnh/voice note: nháp qua backend · gửi kèm · URL theo quyền kênh · voice ⇒ phiên âm · nháp người khác ⇒ 400.
 *   N  Tắt tiếng theo kênh + toàn bộ · chế độ chỉ khi @nhắc · tuỳ chỉnh sai ⇒ 400.
 *   A  Agent: REST /chat ⇒ 403 · MCP chat_channels / chat_read / chat_post trong phạm vi token · @agent ⇒ hộp thư.
 *   X  Khoá chỉnh sửa vẫn cho nhắn · xoá cứng dự án ⇒ dây chuyền sạch.
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
import * as files from '../services/work/commentFiles.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `k3${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work K-3 — kênh chat dự án (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, viewer: U, teacher: U, client: U, guest: U, outsider: U;
  let ext: { token: string; userId: number; agentId: number; username: string };
  let wsId = 0, pid = 0, wsSlug = '';
  let cfg: any;
  let shared = 0, internal = 0;
  let general = 0, frontend = 0, secret = 0, clientCh = 0;
  const objects = new Map<string, { body: Buffer; ct: string }>();
  let rpcId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
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
  async function upload(u: U, path: string, field: string, name: string, type: string, bytes: Buffer, extra: Record<string, string> = {}) {
    const form = new FormData();
    form.append(field, new Blob([new Uint8Array(bytes)], { type }), name);
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
    try { json = JSON.parse(text); } catch { /* chữ / untrusted */ }
    return { isError: body.result.isError as boolean, text, json };
  }
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const chans = async (u: U) => (await call(u, 'GET', `/projects/${pid}/chat/channels`));
  const names = async (u: U) => ((await chans(u)).data?.channels ?? []).map((c: any) => c.name).sort();
  const post = (u: U, cid: number, body: string, extra: Record<string, unknown> = {}) => call(u, 'POST', `/projects/${pid}/chat/channels/${cid}/messages`, { body, ...extra });
  const msgs = async (u: U, cid: number) => (await call(u, 'GET', `/projects/${pid}/chat/channels/${cid}/messages`)).data?.messages ?? [];
  async function waitNotif(receiverId: number, pred: (n: any) => boolean, ms = 3000) {
    const end = Date.now() + ms;
    for (;;) {
      const rows = await prisma.socialNotification.findMany({ where: { receiverId }, orderBy: { id: 'asc' } });
      const hit = rows.filter(pred);
      if (hit.length || Date.now() > end) return hit;
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_CHAT_RPM = '1000';
    process.env.WORK_CHAT_UPLOAD_RPM = '1000';
    files._setCommentStoreForTests({
      async put(key, body, ct) { objects.set(key, { body, ct }); },
      async read(key) { const o = objects.get(key); if (!o) throw new Error('missing'); return o.body; },
      async head(key) { const o = objects.get(key); return o ? { size: o.body.length, contentType: o.ct } : null; },
      async del(key) { objects.delete(key); },
    });
    files._setSttForTests(async () => ({ text: 'deploy the staging build tonight', language: 'en', noSpeechProb: 0.01, avgLogprob: -0.2 }));
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    (await import('../mcp/server.js'))._resetMcpRateForTests();
    [owner, dev, viewer, teacher, client, guest, outsider] = await Promise.all(['owner', 'dev', 'viewer', 'teacher', 'client', 'guest', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    files._setCommentStoreForTests(null);
    files._setSttForTests(null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    const ids = [...userIds, ...(ext ? [ext.userId] : [])];
    if (ids.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: ids } }, { senderId: { in: ids } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: ids } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT (cổng khách bật) — dev MEMBER, viewer VIEWER, teacher TEACHER, guest (GUEST+MEMBER), khách CLIENT, agent ngoài', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `K3 ${tag}` });
    wsId = ws.data.id; wsSlug = ws.data.slug;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'KC', name: 'Chat project', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [teacher.email], role: 'GUEST', projectId: pid, projectRole: 'TEACHER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST', projectId: pid, projectRole: 'MEMBER' });
    const inv = await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] });
    assert.equal(inv.status, 201, JSON.stringify(inv.raw));
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    shared = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Shared login page' })).data.number;
    internal = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Internal refactor', assigneeId: dev.id })).data.number;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${shared}/client-visible`, { visible: true })).status, 200);
    const a = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Chat Bot', model: 'claude-sonnet-5', projectIds: [pid] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    const au = await prisma.user.findUniqueOrThrow({ where: { id: a.data.agent.userId }, select: { username: true } });
    ext = { token: a.data.token.token, userId: a.data.agent.userId, agentId: a.data.agent.id, username: au.username };
  });

  // ═══ Q: quyền xem ═════════════════════════════════════════════════

  it('Q1 #general tự có; đội (owner/dev/viewer/teacher) thấy; khách + guest KHÔNG thấy kênh nội bộ; người ngoài 404', async () => {
    const r = await chans(owner);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    general = r.data.channels.find((c: any) => c.name === 'general').id;
    assert.ok(general);
    assert.equal(r.data.me.canCreateClient, true);
    for (const u of [dev, viewer, teacher]) assert.deepEqual(await names(u), ['general'], u.username);
    assert.deepEqual(await names(client), [], 'khách: không có kênh nội bộ');
    assert.deepEqual(await names(guest), [], 'GUEST (không phải giảng viên): không có kênh nội bộ');
    assert.equal((await chans(outsider)).status, 404);
    // Khách gọi thẳng vào kênh nội bộ ⇒ 404 (không lộ là có).
    assert.equal((await call(client, 'GET', `/projects/${pid}/chat/channels/${general}/messages`)).status, 404);
    assert.equal((await post(client, general, 'hi')).status, 404);
    assert.equal((await post(guest, general, 'hi')).status, 404);
  });

  it('Q2 tạo kênh: MEMBER tạo PUBLIC; VIEWER/teacher/khách không; kênh CLIENT chỉ ADMIN; tên chuẩn hoá', async () => {
    const f = await call(dev, 'POST', `/projects/${pid}/chat/channels`, { name: 'Front-end Team', kind: 'PUBLIC', topic: 'UI work' });
    assert.equal(f.status, 201, JSON.stringify(f.raw));
    assert.equal(f.data.name, 'front-end-team');
    frontend = f.data.id;
    for (const u of [viewer, teacher, client]) {
      const r = await call(u, 'POST', `/projects/${pid}/chat/channels`, { name: 'nope', kind: 'PUBLIC' });
      assert.equal(r.status, 403, u.username);
    }
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels`, { name: 'customer', kind: 'CLIENT' })).status, 403);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels`, { name: 'front end team' })).code, 'WORK_CHANNEL_EXISTS');
  });

  it('Q3 kênh RIÊNG: chỉ thành viên thấy (kể cả ADMIN dự án không được mời); thêm/bớt thành viên + kiểm toán', async () => {
    const s = await call(dev, 'POST', `/projects/${pid}/chat/channels`, { name: 'secret', kind: 'PRIVATE', memberIds: [viewer.id, client.id] });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    secret = s.data.id;
    assert.ok((await names(dev)).includes('secret'));
    assert.ok((await names(viewer)).includes('secret'), 'viewer được mời');
    assert.ok(!(await names(owner)).includes('secret'), 'ADMIN không được mời ⇒ không thấy');
    assert.ok(!(await names(client)).includes('secret'), 'khách KHÔNG vào được kênh riêng dù được "mời"');
    assert.equal((await call(owner, 'GET', `/projects/${pid}/chat/channels/${secret}/messages`)).status, 404);
    const add = await call(dev, 'PUT', `/projects/${pid}/chat/channels/${secret}/members`, { add: [owner.id], remove: [viewer.id] });
    assert.equal(add.status, 200, JSON.stringify(add.raw));
    assert.ok((await names(owner)).includes('secret'));
    assert.ok(!(await names(viewer)).includes('secret'));
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'chat.channel.members' } }));
  });

  // ═══ M: tin nhắn ══════════════════════════════════════════════════

  let m1 = 0;
  it('M1 gửi + @nhắc ⇒ chuông WORK_MENTION (chat, không email); VIEWER chỉ đọc; teacher gửi được', async () => {
    const r = await post(dev, general, `Hi @${owner.username}, please review **login** (mail me at x@y.com)`);
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    m1 = r.data.id;
    assert.deepEqual(r.data.mentions, [owner.id]);
    const n = await waitNotif(owner.id, (x) => x.type === 'WORK_MENTION' && x.payload?.chat === true);
    assert.equal(n.length, 1);
    assert.match((n[0].payload as any).url, new RegExp(`/work/${wsSlug}/KC/chat\\?c=${general}&m=${m1}`));
    assert.equal(await prisma.workEmailQueue.count({ where: { userId: owner.id } }), 0, 'chat không vào hàng đợi email');
    assert.equal((await post(viewer, general, 'can I?')).status, 403);
    assert.equal((await post(teacher, general, 'Teacher here — good progress')).status, 201);
    // @nhắc người KHÔNG thấy kênh (khách) ⇒ bỏ qua, không báo.
    const r2 = await post(dev, general, `@${client.username} are you there?`);
    assert.deepEqual(r2.data.mentions, []);
  });

  it('M2 chưa đọc: owner thấy unread + mention; đánh dấu đã đọc ⇒ 0; tổng mọi dự án khớp', async () => {
    const g = (await chans(owner)).data.channels.find((c: any) => c.id === general);
    assert.ok(g.unread >= 2, JSON.stringify(g));
    assert.equal(g.mentions, 1);
    const all = (await call(owner, 'GET', '/chat/unread')).data;
    assert.equal(all.projects.find((p: any) => p.projectId === pid).unread, (await chans(owner)).data.total, 'tổng mọi dự án = tổng các kênh');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/chat/channels/${general}/read`, {})).status, 200);
    const g2 = (await chans(owner)).data.channels.find((c: any) => c.id === general);
    assert.deepEqual([g2.unread, g2.mentions], [0, 0]);
    // Tin của chính mình không tính chưa đọc.
    const d = (await chans(dev)).data.channels.find((c: any) => c.id === general);
    assert.equal(d.unread, 0, 'gửi tin = đã đọc tới tin của mình (tin teacher đứng TRƯỚC tin cuối của dev)');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/read-all`, {})).status, 200);
    assert.equal((await chans(dev)).data.total, 0);
  });

  let reply1 = 0;
  it('M3 luồng một cấp: trả lời một trả lời ⇒ gắn vào gốc; người được trả lời nhận "New reply"; replyCount', async () => {
    const r1 = await post(owner, general, 'On it', { parentId: m1 });
    assert.equal(r1.data.parentId, m1);
    reply1 = r1.data.id;
    const r2 = await post(teacher, general, 'Me too', { parentId: reply1 });
    assert.equal(r2.data.parentId, m1, 'gắn vào gốc');
    const hit = await waitNotif(dev.id, (x) => x.type === 'WORK_COMMENT' && x.payload?.reply === true && x.payload?.chat === true);
    assert.ok(hit.length >= 1);
    const th = await call(dev, 'GET', `/projects/${pid}/chat/channels/${general}/messages/${m1}/thread`);
    assert.equal(th.data.root.replyCount, 2);
    assert.deepEqual(th.data.replies.map((x: any) => x.body), ['On it', 'Me too']);
    const top = await msgs(dev, general);
    assert.ok(!top.some((x: any) => x.id === reply1), 'trả lời không nằm ở dòng chính');
  });

  it('M4 sửa tin của mình (đã sửa) · sửa tin người khác 403 · xoá của mình · ADMIN gỡ tin người khác + kiểm toán', async () => {
    const e = await call(dev, 'PATCH', `/projects/${pid}/chat/channels/${general}/messages/${m1}`, { body: `Hi @${owner.username}, please review **login** today` });
    assert.equal(e.status, 200, JSON.stringify(e.raw));
    assert.ok(e.data.editedAt);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/chat/channels/${general}/messages/${m1}`, { body: 'hacked' })).status, 403);
    const x = await post(dev, general, 'typo message');
    assert.equal((await call(viewer, 'DELETE', `/projects/${pid}/chat/channels/${general}/messages/${x.data.id}`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/chat/channels/${general}/messages/${x.data.id}`)).status, 200);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'chat.message.moderate', targetId: x.data.id } }));
    const y = await post(dev, general, 'my own mistake');
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/chat/channels/${general}/messages/${y.data.id}`)).status, 200);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'chat.message.delete', targetId: y.data.id } }));
    assert.ok(!(await msgs(dev, general)).some((m: any) => m.id === y.data.id || m.id === x.data.id), 'tin đã xoá (không có trả lời) biến khỏi danh sách');
  });

  it('M5 ghim (kiểm toán) · VIEWER không ghim · danh sách ghim · cảm xúc · emoji sai 400 · tìm kiếm', async () => {
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/chat/channels/${general}/messages/${m1}/pin`, { pinned: true })).status, 403);
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/chat/channels/${general}/messages/${m1}/pin`, { pinned: true })).status, 200);
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'chat.message.pin', targetId: m1 } }));
    const pins = (await call(viewer, 'GET', `/projects/${pid}/chat/channels/${general}/pinned`)).data;
    assert.deepEqual(pins.map((p: any) => p.id), [m1]);
    const rx = await call(owner, 'PUT', `/projects/${pid}/chat/channels/${general}/messages/${m1}/reactions/${encodeURIComponent('👍')}`, { active: true });
    assert.equal(rx.status, 200, JSON.stringify(rx.raw));
    assert.deepEqual(rx.data.reactions.map((r: any) => [r.emoji, r.count, r.mine]), [['👍', 1, true]]);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/chat/channels/${general}/messages/${m1}/reactions/abc`, {})).code, 'WORK_BAD_EMOJI');
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/chat/channels/${general}/messages/${m1}/reactions/${encodeURIComponent('👍')}`, {})).status, 403);
    const s = (await call(viewer, 'GET', `/projects/${pid}/chat/channels/${general}/search?q=REVIEW`)).data;
    assert.ok(s.some((m: any) => m.id === m1));
  });

  it('M6 chống gửi trùng: cùng clientKey ⇒ cùng một tin (hàng chờ ngoại tuyến gửi lại an toàn)', async () => {
    const a = await post(dev, frontend, 'queued while offline', { clientKey: 'k-123' });
    const b = await post(dev, frontend, 'queued while offline', { clientKey: 'k-123' });
    assert.equal(a.data.id, b.data.id);
    assert.equal(a.data.clientKey, 'k-123');
    assert.equal((await msgs(dev, frontend)).filter((m: any) => m.body === 'queued while offline').length, 1);
  });

  // ═══ S: chia sẻ ═══════════════════════════════════════════════════

  it('S1 thẻ xem trước theo quyền: đội thấy thẻ nội bộ (tiêu đề/trạng thái/người làm); link ngoài chỉ tên miền + tiêu đề có sẵn', async () => {
    const r = await post(dev, general, `Look /work/${wsSlug}/KC/issue/${internal} and KC-${shared} and [Spec](https://docs.google.com/x)`);
    const m = r.data;
    assert.deepEqual(m.previews.map((p: any) => p.key), [`KC-${internal}`, `KC-${shared}`]);
    assert.equal(m.previews[0].title, 'Internal refactor');
    assert.ok(m.previews[0].status?.name);
    assert.equal(m.previews[0].assignee?.id, dev.id);
    assert.deepEqual(m.links, [{ url: 'https://docs.google.com/x', domain: 'docs.google.com', title: 'Spec' }]);
  });

  it('S2 kênh KHÁCH: ADMIN mở; khách chỉ thấy #client; link thẻ CHƯA chia sẻ không lộ cho khách (đội vẫn thấy)', async () => {
    const c = await call(owner, 'POST', `/projects/${pid}/chat/channels`, { name: 'client', kind: 'CLIENT' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    clientCh = c.data.id;
    assert.equal((await call(owner, 'POST', `/projects/${pid}/chat/channels`, { name: 'client2', kind: 'CLIENT' })).code, 'WORK_CHANNEL_EXISTS');
    assert.deepEqual(await names(client), ['client']);
    assert.deepEqual(await names(guest), ['client']);
    const r = await post(owner, clientCh, `Status: /work/${wsSlug}/KC/issue/${shared} and /work/${wsSlug}/KC/issue/${internal}`);
    assert.equal(r.status, 201);
    const asOwner = (await msgs(owner, clientCh)).find((m: any) => m.id === r.data.id);
    assert.equal(asOwner.previews.length, 2);
    const asClient = (await msgs(client, clientCh)).find((m: any) => m.id === r.data.id);
    assert.deepEqual(asClient.previews.map((p: any) => p.key), [`KC-${shared}`], 'khách chỉ thấy thẻ đã chia sẻ');
    const cp = await post(client, clientCh, 'Thanks! When is the demo?');
    assert.equal(cp.status, 201, JSON.stringify(cp.raw));
    // Khách không "tạo thẻ" từ tin qua chat (tuyến bị chặn ở cổng khách).
    assert.equal((await call(client, 'POST', `/projects/${pid}/chat/channels/${clientCh}/messages/${cp.data.id}/issue`, { typeId: typeId(cfg, 'TASK') })).status, 403);
    // Nội bộ không chuyển tiếp sang kênh khách; kênh riêng không chuyển ra kênh chung.
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/messages/${m1}/forward`, { toChannelId: clientCh })).code, 'WORK_FORWARD_CLIENT');
  });

  it('S3 tạo thẻ từ tin (mô tả = nội dung + link về tin; trả lời trong luồng) · chuyển tiếp · gọi nhóm', async () => {
    const t = await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/messages/${m1}/issue`, { typeId: typeId(cfg, 'TASK'), title: 'Review login' });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    const iss = (await call(dev, 'GET', `/projects/${pid}/issues/${t.data.number}`)).data;
    assert.equal(iss.title, 'Review login');
    assert.match(JSON.stringify(iss.descriptionJson), new RegExp(`chat\\?c=${general}&m=${m1}`));
    const th = (await call(dev, 'GET', `/projects/${pid}/chat/channels/${general}/messages/${m1}/thread`)).data;
    assert.ok(th.replies.some((r: any) => r.kind === 'SYSTEM' && r.meta?.type === 'issue' && r.meta.key === t.data.key));

    const fw = await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/messages/${m1}/forward`, { toChannelId: frontend, note: 'FYI' });
    assert.equal(fw.status, 201, JSON.stringify(fw.raw));
    assert.equal(fw.data.meta.type, 'forward');
    assert.match(fw.data.body, /^FYI\n\n> Hi/);
    const sm = await post(dev, secret, 'private plan');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels/${secret}/messages/${sm.data.id}/forward`, { toChannelId: general })).code, 'WORK_FORWARD_PRIVATE');

    const c1 = await call(dev, 'POST', `/projects/${pid}/chat/channels/${frontend}/call`, {});
    assert.equal(c1.status, 200, JSON.stringify(c1.raw));
    assert.match(c1.data.url, /^https:\/\/meet\.jit\.si\/ctwork-[a-z0-9]{16}$/);
    const c2 = await call(owner, 'POST', `/projects/${pid}/chat/channels/${frontend}/call`, {});
    assert.deepEqual([c2.data.url, c2.data.reused], [c1.data.url, true], 'cuộc gọi đang mở ⇒ dùng lại');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/call`, { url: 'https://evil.example.com/x' })).code, 'WORK_BAD_URL');
    const meet = await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/call`, { url: 'https://meet.google.com/abc-defg-hij' });
    assert.equal(meet.data.url, 'https://meet.google.com/abc-defg-hij');
    const list = await msgs(dev, frontend);
    assert.ok(list.some((m: any) => m.kind === 'SYSTEM' && m.meta?.type === 'call' && m.meta.url === c1.data.url), 'tin "đang gọi"');
    const ch = (await chans(viewer)).data.channels.find((c: any) => c.id === frontend);
    assert.equal(ch.call?.url, c1.data.url);
  });

  // ═══ F: tệp ═══════════════════════════════════════════════════════

  it('F1 ảnh + voice note qua backend ⇒ gửi kèm ⇒ URL theo quyền kênh; voice được phiên âm; nháp người khác ⇒ 400', async () => {
    const png = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');
    const img = await upload(dev, `/projects/${pid}/chat/channels/${general}/files`, 'file', 'ảnh lỗi.png', 'image/png', png);
    assert.equal(img.status, 201, JSON.stringify(img.raw));
    assert.equal(img.data.fileName, 'ảnh lỗi.png');
    const svg = await upload(dev, `/projects/${pid}/chat/channels/${general}/files`, 'file', 'x.svg', 'image/svg+xml', Buffer.from('<svg onload=alert(1)>'));
    assert.equal(svg.data.mime, 'application/octet-stream', 'SVG không bao giờ được coi là ảnh xem trong trang');
    const v = await upload(dev, `/projects/${pid}/chat/channels/${general}/voice`, 'audio', 'v.webm', 'audio/webm;codecs=opus', Buffer.alloc(5000, 7), { durationMs: '4200' });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    assert.equal((await upload(dev, `/projects/${pid}/chat/channels/${general}/voice`, 'audio', 'v.webm', 'audio/webm', Buffer.alloc(5000, 7), { durationMs: '200000' })).code, 'WORK_VOICE_TOO_LONG');
    assert.equal((await post(owner, general, 'steal', { fileIds: [img.data.id] })).code, 'WORK_BAD_ATTACHMENT');
    const sent = await post(dev, general, '', { fileIds: [img.data.id, v.data.id] });
    assert.equal(sent.status, 201, JSON.stringify(sent.raw));
    await files._awaitTranscriptionsForTests();
    const got = (await call(viewer, 'GET', `/projects/${pid}/chat/channels/${general}/messages/${sent.data.id}`)).data;
    const voice = got.files.find((f: any) => f.voice);
    assert.equal(voice.voice.transcriptStatus, 'DONE');
    assert.equal(voice.voice.transcript, 'deploy the staging build tonight');
    const url = await call(viewer, 'GET', `/projects/${pid}/chat/files/${img.data.id}/url?inline=1`);
    assert.equal(url.status, 200);
    assert.match(url.data.url, /^https:\/\//);
    assert.equal((await call(client, 'GET', `/projects/${pid}/chat/files/${img.data.id}/url`)).status, 404, 'khách không lấy được tệp của kênh nội bộ');
    const s = (await call(viewer, 'GET', `/projects/${pid}/chat/channels/${general}/search?q=staging`)).data;
    assert.ok(s.some((m: any) => m.id === sent.data.id), 'tìm được theo phiên âm');
    // Xoá tin ⇒ gỡ object R2 + URL 404.
    const before = objects.size;
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/chat/channels/${general}/messages/${sent.data.id}`)).status, 200);
    assert.ok(objects.size <= before - 2);
    assert.equal((await call(viewer, 'GET', `/projects/${pid}/chat/files/${img.data.id}/url`)).status, 404);
  });

  // ═══ N: tắt tiếng ═════════════════════════════════════════════════

  it('N1 tắt tiếng kênh 1 giờ ⇒ badge chỉ đếm tin nhắc mình; bật lại; tuỳ chỉnh quá khứ ⇒ 400', async () => {
    await call(owner, 'POST', `/projects/${pid}/chat/channels/${frontend}/read`, {});
    const mu = await call(owner, 'PUT', `/projects/${pid}/chat/channels/${frontend}/notify`, { mute: '1h' });
    assert.equal(mu.status, 200, JSON.stringify(mu.raw));
    assert.ok(mu.data.mutedUntil);
    await post(dev, frontend, 'noise 1');
    await post(dev, frontend, `ping @${owner.username}`);
    const f = (await chans(owner)).data.channels.find((c: any) => c.id === frontend);
    assert.deepEqual([f.muted, f.unread, f.mentions, f.badge], [true, 2, 1, 1]);
    const off = await call(owner, 'PUT', `/projects/${pid}/chat/channels/${frontend}/notify`, { mute: 'off', notify: 'MENTIONS' });
    assert.deepEqual([off.data.mutedUntil, off.data.notify], [null, 'MENTIONS']);
    const f2 = (await chans(owner)).data.channels.find((c: any) => c.id === frontend);
    assert.equal(f2.badge, 2);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/chat/channels/${frontend}/notify`, { mute: 'custom', until: '2020-01-01T00:00:00Z' })).code, 'WORK_BAD_MUTE');
  });

  it('N2 cài đặt chung (đồng bộ máy): tắt tiếng tới khi bật lại, chỉ khi @nhắc, tắt âm, email tóm tắt mặc định TẮT', async () => {
    const g0 = (await call(dev, 'GET', '/chat/prefs')).data;
    assert.deepEqual([g0.notify, g0.sound, g0.desktop, g0.emailDigest, g0.mutedUntil], ['ALL', true, true, false, null]);
    const g1 = (await call(dev, 'PUT', '/chat/prefs', { mute: 'forever', notify: 'MENTIONS', sound: false })).data;
    assert.deepEqual([g1.mutedForever, g1.notify, g1.sound], [true, 'MENTIONS', false]);
    const g2 = (await call(dev, 'PUT', '/chat/prefs', { mute: 'off', emailDigest: true })).data;
    assert.deepEqual([g2.mutedUntil, g2.emailDigest], [null, true]);
    // Thư gộp: người bật ⇒ một dòng "unread chat".
    await post(owner, general, 'digest me');
    const { queueChatDigests } = await import('../services/work/chat.service.js');
    assert.ok(await queueChatDigests() >= 1);
    assert.ok(await prisma.workEmailQueue.findFirst({ where: { userId: dev.id, kind: 'WORK_CHAT' } }));
    await call(dev, 'PUT', '/chat/prefs', { emailDigest: false });
  });

  // ═══ A: agent ═════════════════════════════════════════════════════

  it('A1 agent: REST /chat ⇒ 403; MCP chat_channels/chat_read/chat_post trong phạm vi; không thấy kênh riêng; @agent ⇒ hộp thư', async () => {
    const rest = await call({ token: ext.token }, 'GET', `/projects/${pid}/chat/channels`);
    assert.equal(rest.status, 403);
    assert.equal(rest.code, 'WORK_AGENT_FORBIDDEN');
    const lc = await tool(ext.token, 'chat_channels', { project: 'KC' });
    assert.equal(lc.isError, false, lc.text);
    assert.deepEqual(lc.json.channels.map((c: any) => c.name).sort(), ['client', 'front-end-team', 'general']);
    const rd = await tool(ext.token, 'chat_read', { project: 'KC', channel: '#general', limit: 10 });
    assert.equal(rd.isError, false, rd.text);
    assert.match(rd.text, /<ctwork-content source="chat #general" untrusted="true">/);
    assert.match(rd.text, /digest me/);
    const sec = await tool(ext.token, 'chat_read', { project: 'KC', channel: 'secret' });
    assert.equal(sec.isError, true, 'kênh riêng: không thấy');
    const ps = await tool(ext.token, 'chat_post', { project: 'KC', channel: 'general', text: `Build is green ✅ @${dev.username}`, reply_to: m1 });
    assert.equal(ps.isError, false, ps.text);
    assert.equal(ps.json.thread, m1);
    const th = (await call(dev, 'GET', `/projects/${pid}/chat/channels/${general}/messages/${m1}/thread`)).data;
    assert.ok(th.replies.some((r: any) => r.author?.id === ext.userId && /Build is green/.test(r.body)));
    await post(dev, general, `@${ext.username} can you run the tests?`);
    const deadline = Date.now() + 3000;
    let inbox = null;
    while (!inbox && Date.now() < deadline) {
      inbox = await prisma.workAgentInbox.findFirst({ where: { agentId: ext.agentId, type: 'chat.mention' } });
      if (!inbox) await new Promise((r) => setTimeout(r, 50));
    }
    assert.ok(inbox, 'agent nhận chat.mention');
  });

  // ═══ X: khoá chỉnh sửa + xoá dự án ════════════════════════════════

  it('X1 khoá chỉnh sửa: vẫn nhắn tin; "tạo thẻ từ tin" ⇒ 423', async () => {
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/edit-lock`, { locked: true })).status, 200);
    assert.equal((await post(dev, general, 'still chatting while locked')).status, 201);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/chat/channels/${general}/messages/${m1}/issue`, { typeId: typeId(cfg, 'TASK') })).status, 423);
    await call(dev, 'PUT', `/projects/${pid}/edit-lock`, { locked: false });
  });

  it('X2 lưu trữ kênh: không ai gửi được; #general không lưu trữ được', async () => {
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/chat/channels/${general}`, { archived: true })).code, 'WORK_CHANNEL_GENERAL');
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/chat/channels/${frontend}`, { archived: true })).status, 200);
    assert.equal((await post(dev, frontend, 'x')).code, 'WORK_CHANNEL_ARCHIVED');
    assert.ok(!(await names(dev)).includes('front-end-team'));
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'chat.channel.archive' } }));
  });

  it('X3 xoá cứng dự án ⇒ kênh + tin + tệp + thành viên đi theo dây chuyền (khoá ngoại DEFERRABLE)', async () => {
    assert.ok(await prisma.workChannelMessage.count({ where: { channel: { projectId: pid } } }) > 5);
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workChannel.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workChannelFile.count({ where: { channelId: { in: [general, frontend, secret, clientCh] } } }), 0);
    assert.equal(await prisma.workChannelMember.count({ where: { channelId: { in: [general, frontend, secret, clientCh] } } }), 0);
  });
});
