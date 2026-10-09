/**
 * Đợt 6a (D8) — vá rò rỉ CÒN LẠI của cổng khách sau S2b, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.portal6a.db.test.ts
 *
 * Ba lớp rò rỉ ghi nhận 04/10 (bản vá đầu ở work.portal.db.test.ts) — tệp này dò các ĐƯỜNG CÒN SÓT:
 *   1. Khách được nêu làm người duyệt thấy mã + tiêu đề thẻ CHƯA chia sẻ:
 *      - thông báo/email "tới lượt bạn duyệt" (chuỗi SEQUENTIAL) gửi SAU khi thẻ bị bỏ chia sẻ;
 *      - biên bản UAT liệt kê thẻ BUG/CR sinh từ lời từ chối rồi bị nhân viên đổi tên + bỏ chia sẻ;
 *      - thẻ đã chia sẻ có thẻ CHA (epic) chưa chia sẻ ⇒ `parent` lộ tiêu đề epic (chi tiết thẻ, cổng, link công khai).
 *   2. Khách thấy tên/ảnh của nhân viên "im lặng" ở dự án mở cho cả không gian:
 *      - link công khai của dự án bật cổng khách trả `members` = cả đội;
 *      - người được @nhắc trong nội dung khách đọc (mô tả / bình luận PUBLIC / trang CLIENT) hiện tên ở nhãn
 *        nhưng bị che ở danh sách ⇒ luật mới: @nhắc công khai = tương tác công khai ⇒ thấy NHẤT QUÁN ở mọi nơi;
 *        còn nhân viên chỉ được nhắc ở chỗ NỘI BỘ thì không lộ ở đâu cả.
 *   3. Khách cũ là MEMBER không gian (vai CLIENT ở dự án cổng) — chạy lại TOÀN BỘ phép dò như khách GUEST.
 *   + Ảnh trong tài liệu (đợt 3A): khách cổng xem được ảnh nằm trong nội dung ĐÃ chia sẻ (trước đây 403
 *     CLIENT_PORTAL_ONLY ⇒ ảnh hỏng), KHÔNG xem được ảnh chỉ nằm trong nội dung nội bộ; link công khai có
 *     đường ảnh riêng theo token, chỉ cho ảnh trong mô tả thẻ mà link đó đọc được.
 *
 * Cách dò: một bộ "mồi" (CANARY_*) — tiêu đề thẻ nội bộ, tên + ảnh nhân viên ẩn — rồi gọi MỌI tuyến GET khách
 * gọi được (dự án, cổng, cấp không gian, /me, tìm kiếm, link công khai) và soát không mồi nào lọt ra.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `p6${Date.now().toString(36)}`;
const userIds: number[] = [];
const sent: Array<{ to: string; subject: string; html: string; text: string }> = [];
const blobs = new Map<string, Buffer>();
const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

type U = { id: number; token: string; email: string; username: string };

// Mồi: không chuỗi nào trong đây được phép tới tay khách.
const CANARY_EPIC = 'CANARYEPIC internal codename';
const CANARY_HIDDEN = 'CANARYHIDDEN margin plan';
const CANARY_NAME = 'Canaryhush Nguyen';
const CANARY_AVATAR = 'https://cdn.test/CANARYAVATAR.png';
const CANARY_RENAMED = 'CANARYRENAMED internal rework';

describe('CT Work — đợt 6a: vá rò rỉ còn lại của cổng khách + ảnh trong tài liệu (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, hush: U, ghost: U, client: U, memberClient: U;
  let wsId = 0, wsSlug = '';
  let pid = 0, epicNum = 0, sharedNum = 0, hiddenNum = 0, seqNum = 0;
  let cfg: any;
  let pageClient = 0, pageInternal = 0;
  let imgShared = 0, imgInternal = 0, imgComment = 0, imgDesc = 0;
  let shareToken = '';
  let uatId = 0;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }

  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON (ảnh, .ics…) */ }
    return { status: res.status, data: json.data, code: json.code ?? json.error?.code, raw: json, text, type: res.headers.get('content-type') };
  }
  async function raw(u: U, path: string, body: Buffer) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { 'Content-Type': 'image/png', Authorization: `Bearer ${u.token}` }, body: new Uint8Array(body) });
    return { status: res.status, json: (await res.json()) as any };
  }
  const png = (r: number) => sharp({ create: { width: 8, height: 8, channels: 3, background: { r, g: 10, b: 10 } } }).png().toBuffer();
  const img = (id: number) => ({ type: 'image', attrs: { src: `/api/v1/work/projects/${pid}/images/${id}`, alt: null } });
  const mention = (u: U, label: string) => ({ type: 'mention', attrs: { id: String(u.id), label } });
  const typeId = (k: string) => cfg.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async (m: any) => { sent.push({ to: m.to, subject: m.subject, html: m.html ?? '', text: m.text ?? '' }); return { success: true }; };
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests({
      put: async (key, body) => { blobs.set(key, body); },
      read: async (key) => { const b = blobs.get(key); if (!b) throw new Error('missing'); return b; },
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, hush, ghost, client, memberClient] = await Promise.all(['owner', 'staff', 'hush', 'ghost', 'client', 'mclient'].map(mkUser));
    await prisma.user.update({ where: { id: hush.id }, data: { fullName: 'Hush Mentioned' } });
    await prisma.user.update({ where: { id: ghost.id }, data: { fullName: CANARY_NAME, avatarUrl: CANARY_AVATAR } });
  });

  after(async () => {
    server?.close();
    (await import('../services/work/docs3a.service.js'))._setImageStoreForTests(null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT mở cho cả không gian, nhân viên "im lặng", epic nội bộ + thẻ con đã chia sẻ, ảnh, trang, link công khai', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `Portal6a ${tag}` });
    wsId = ws.data.id; wsSlug = ws.data.slug;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, hush.email, ghost.email, memberClient.email], role: 'MEMBER' });
    const pr = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SX', name: 'Six app', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(pr.status, 201, JSON.stringify(pr.raw));
    pid = pr.data.id;
    assert.equal(pr.data.modules.clientPortal, true);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    // Khách CŨ: MEMBER không gian, được đặt vai CLIENT ở dự án cổng.
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${memberClient.id}`, { role: 'CLIENT' })).status, 200);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    assert.ok(cfg.members.some((m: any) => m.id === ghost.id), 'nhân viên im lặng vào ngầm dự án (mở cho không gian)');

    // Ảnh: một trong trang CLIENT, một chỉ trong trang nội bộ, một trong bình luận PUBLIC, một trong mô tả thẻ đã chia sẻ.
    const up = async (r: number) => { const x = await raw(staff, `/projects/${pid}/images?name=i${r}.png`, await png(r)); assert.equal(x.status, 201, JSON.stringify(x.json)); return x.json.data.id as number; };
    imgShared = await up(11); imgInternal = await up(22); imgComment = await up(33); imgDesc = await up(44);

    const epic = await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId('EPIC'), title: CANARY_EPIC });
    epicNum = epic.data.number;
    const shared = await call(ghost, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: 'Login page', parentId: epic.data.id });
    sharedNum = shared.data.number;
    hiddenNum = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: CANARY_HIDDEN })).data.number;
    seqNum = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId('TASK'), title: 'Checkout sequence' })).data.number;
    for (const n of [sharedNum, seqNum]) assert.equal((await call(staff, 'PUT', `/projects/${pid}/issues/${n}/client-visible`, { visible: true })).status, 200);
    // Mô tả thẻ đã chia sẻ: @nhắc nhân viên ẩn + ảnh.
    const desc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Owner: ' }, mention(hush, 'Hush Mentioned')] }, img(imgDesc)] };
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${sharedNum}`, { descriptionJson: desc })).status, 200);
    // Bình luận PUBLIC có @nhắc + ảnh; nhân viên ẩn theo dõi thẻ và ghi chú nội bộ.
    const c = await call(staff, 'POST', `/projects/${pid}/issues/${sharedNum}/comments`, {
      bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Ask ' }, mention(hush, 'Hush Mentioned')] }, img(imgComment)] }, visibility: 'PUBLIC',
    });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    await call(ghost, 'PUT', `/projects/${pid}/issues/${sharedNum}/watch`, {});
    // Nhân viên ẩn chỉ được @nhắc ở chỗ NỘI BỘ (ghi chú nội bộ trên thẻ đã chia sẻ).
    await call(ghost, 'POST', `/projects/${pid}/issues/${sharedNum}/comments`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'internal ' }, mention(ghost, CANARY_NAME)] }] } });

    // Trang CLIENT (chủ trang = nhân viên ẩn, có @nhắc + ảnh) và trang nội bộ có ảnh riêng.
    const pc = await call(ghost, 'POST', `/projects/${pid}/pages`, { title: 'Client charter', visibility: 'CLIENT' });
    assert.equal(pc.status, 201, JSON.stringify(pc.raw));
    pageClient = pc.data.number;
    const pageDoc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Prepared by ' }, mention(hush, 'Hush Mentioned')] }, img(imgShared)] };
    assert.equal((await call(ghost, 'PATCH', `/projects/${pid}/pages/${pageClient}`, { contentJson: pageDoc })).status, 200);
    pageInternal = (await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Internal pricing', visibility: 'INTERNAL' })).data.number;
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/pages/${pageInternal}`, { contentJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'pricing by ' }, mention(ghost, CANARY_NAME)] }, img(imgInternal)] } })).status, 200);

    const link = await call(owner, 'POST', `/projects/${pid}/share-links`, { label: 'pub', options: { descriptions: true } });
    assert.equal(link.status, 201, JSON.stringify(link.raw));
    shareToken = link.data.url.split('/').pop();
  });

  // ─── 1. Người duyệt là khách: không mã/tiêu đề thẻ chưa chia sẻ ──────────

  it('1a. chuỗi duyệt SEQUENTIAL: thẻ bị bỏ chia sẻ trước lượt khách ⇒ không thông báo/email nào tới khách mang mã/tiêu đề thẻ', async () => {
    const ap = await call(staff, 'POST', `/projects/${pid}/approvals`, { targetType: 'ISSUE', issueNumber: seqNum, approverIds: [owner.id, client.id], mode: 'SEQUENTIAL' });
    assert.equal(ap.status, 201, JSON.stringify(ap.raw));
    // Nhân viên đổi tên nội bộ rồi bỏ chia sẻ khi khách chưa tới lượt.
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${seqNum}`, { title: CANARY_RENAMED })).status, 200);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/issues/${seqNum}/client-visible`, { visible: false })).status, 200);
    sent.length = 0;
    const before = await prisma.socialNotification.count({ where: { receiverId: client.id } });
    const d = await call(owner, 'POST', `/projects/${pid}/approvals/${ap.data.id}/decide`, { decision: 'APPROVE' });
    assert.equal(d.status, 200, JSON.stringify(d.raw));
    await wait();
    const notes = await prisma.socialNotification.findMany({ where: { receiverId: client.id }, orderBy: { id: 'asc' } });
    // Thẻ đã thu hồi ⇒ khách không duyệt được (canDecide false) ⇒ không báo gì (thông báo chỉ là ồn + lộ tiêu đề).
    assert.equal(notes.length, before, 'không báo khách duyệt một thẻ đã thu hồi');
    const txt = JSON.stringify(notes.slice(before).map((n) => n.payload)) + JSON.stringify(sent.filter((m) => m.to === client.email));
    assert.ok(!txt.includes('CANARYRENAMED') && !txt.includes('Checkout sequence') && !txt.includes(`SX-${seqNum}`), `thông báo cho khách lộ thẻ chưa chia sẻ: ${txt.slice(0, 400)}`);
    await call(staff, 'POST', `/projects/${pid}/approvals/${ap.data.id}/cancel`, {});
  });

  it('1b. UAT: thẻ BUG sinh từ lời từ chối bị đổi tên nội bộ + bỏ chia sẻ ⇒ biên bản cho khách không liệt kê nó', async () => {
    const u = await call(staff, 'POST', `/projects/${pid}/portal/uat`, { issueNumbers: [sharedNum], approverIds: [client.id] });
    assert.equal(u.status, 201, JSON.stringify(u.raw));
    uatId = u.data.id;
    const r = await call(client, 'POST', `/projects/${pid}/portal/uat/${uatId}/decide`, { decision: 'REJECT', comment: 'Button broken', points: [{ title: 'Button broken', kind: 'BUG' }] });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const urow = await prisma.workUatRequest.findFirstOrThrow({ where: { approvalId: uatId } });
    const bugId = (urow.createdIssueIds as number[])[0];
    const bug = await prisma.workIssue.findUniqueOrThrow({ where: { id: bugId } });
    assert.equal(bug.clientVisible, true);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/issues/${bug.number}`, { title: CANARY_RENAMED })).status, 200);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/issues/${bug.number}/client-visible`, { visible: false })).status, 200);
    for (const path of [`/projects/${pid}/portal/approvals/${uatId}`, `/projects/${pid}/portal/approvals`]) {
      const v = await call(client, 'GET', path);
      assert.equal(v.status, 200, path);
      assert.ok(!v.text.includes('CANARYRENAMED') && !v.text.includes(`"SX-${bug.number}"`), `${path} lộ thẻ đã bỏ chia sẻ`);
    }
    // Nhân viên vẫn thấy đủ.
    assert.ok((await call(staff, 'GET', `/projects/${pid}/portal/approvals/${uatId}`)).text.includes('CANARYRENAMED'));
  });

  it('1c. thẻ đã chia sẻ có epic CHƯA chia sẻ ⇒ không lộ tiêu đề/số epic (chi tiết, cổng, link công khai)', async () => {
    for (const u of [client, memberClient]) {
      const d = await call(u, 'GET', `/projects/${pid}/issues/${sharedNum}`);
      assert.equal(d.status, 200);
      assert.ok(!d.text.includes('CANARYEPIC'), 'chi tiết thẻ lộ epic');
      assert.equal(d.data.parent, null);
      assert.equal(d.data.parentId, null);
      assert.equal(d.data.parentNumber, null);
      const list = await call(u, 'GET', `/projects/${pid}/issues`);
      assert.ok(list.data.items.every((i: any) => i.parentId === null && i.parentNumber === null), 'thẻ trong danh sách trỏ tới epic ẩn');
      assert.ok(!(await call(u, 'GET', `/projects/${pid}/portal/requests/${sharedNum}`)).text.includes('CANARYEPIC'));
    }
    const pub = await call(null, 'GET', `/share/${shareToken}/issues/${sharedNum}`);
    assert.equal(pub.status, 200);
    assert.ok(!pub.text.includes('CANARYEPIC'), 'link công khai lộ epic');
    assert.equal(pub.data.parent, null);
    // Nhân viên vẫn thấy epic.
    assert.match((await call(staff, 'GET', `/projects/${pid}/issues/${sharedNum}`)).data.parent.title, /CANARYEPIC/);
  });

  // ─── 2. Tên/ảnh nhân viên "im lặng" ───────────────────────────────

  it('2a. link công khai của dự án bật cổng khách: `members` chỉ người khách được thấy — không cả đội', async () => {
    const s = await call(null, 'GET', `/share/${shareToken}`);
    assert.equal(s.status, 200);
    assert.ok(!s.text.includes('Canaryhush') && !s.text.includes('CANARYAVATAR'), 'link công khai lộ nhân viên ẩn');
    assert.ok(s.data.members.some((m: any) => m.id === owner.id), 'lead dự án vẫn hiện');
  });

  it('2b. @nhắc trong nội dung khách đọc = tương tác công khai: người đó hiện NHẤT QUÁN (nhãn + danh sách); nhắc nội bộ không lộ', async () => {
    for (const u of [client, memberClient]) {
      const members = (await call(u, 'GET', `/projects/${pid}`)).data.members.map((m: any) => m.id);
      assert.ok(members.includes(hush.id), 'người được @nhắc công khai hiện trong danh sách');
      assert.ok(!members.includes(ghost.id), 'người chỉ được nhắc nội bộ vẫn ẩn');
      const ws = (await call(u, 'GET', `/workspaces/${wsId}/members`)).data.map((m: any) => m.id);
      assert.ok(ws.includes(hush.id) && !ws.includes(ghost.id));
      const d = (await call(u, 'GET', `/projects/${pid}/issues/${sharedNum}`)).data;
      assert.equal(d.reporter.id, 0, 'người tạo thẻ (ẩn) ⇒ Project team');
      assert.equal((await call(u, 'GET', `/projects/${pid}/pages/${pageClient}`)).data.owner.id, 0, 'chủ trang (ẩn) ⇒ Project team');
    }
  });

  // ─── Quét mọi tuyến khách gọi được ────────────────────────────────

  it('quét: MỌI tuyến GET khách (GUEST lẫn MEMBER cũ) gọi được — không mồi nào lọt (epic/thẻ ẩn/tên/ảnh nhân viên ẩn)', async () => {
    const leaks: string[] = [];
    const MARKS = ['CANARYEPIC', 'CANARYHIDDEN', 'CANARYRENAMED', 'Canaryhush', 'CANARYAVATAR', ghost.username];
    const paths = [
      '/workspaces', `/workspaces/by-slug/${wsSlug}`, `/workspaces/${wsId}/members`, `/workspaces/${wsId}/members?q=${tag}`, `/workspaces/${wsId}/projects`,
      `/workspaces/${wsId}/portfolio`, `/workspaces/${wsId}/workload`, `/workspaces/${wsId}/time-off`, `/workspaces/${wsId}/teams`, `/workspaces/${wsId}/agents`,
      `/workspaces/${wsId}/agents/dashboard`, `/workspaces/${wsId}/audit`, `/workspaces/${wsId}/invites`, `/workspaces/${wsId}/trash`,
      '/me/work', '/me/approvals', '/me/handoffs', '/me/agents-need-you', `/search?q=CANARY`, `/search?q=${tag}`, '/search/facets', '/search/docs?q=pricing',
      `/resolve/${wsSlug}/SX`,
      `/projects/${pid}`, `/projects/${pid}/issues`, `/projects/${pid}/issues?q=CANARY`, `/projects/${pid}/board`, `/projects/${pid}/search?jql=${encodeURIComponent('order by created')}`,
      `/projects/${pid}/issues/${sharedNum}`, `/projects/${pid}/issues/${sharedNum}/comments`, `/projects/${pid}/issues/${sharedNum}/pages`,
      `/projects/${pid}/issues/${hiddenNum}`, `/projects/${pid}/issues/${epicNum}`,
      `/projects/${pid}/approvals`, `/projects/${pid}/approvals/${uatId}`, `/projects/${pid}/pages`, `/projects/${pid}/pages/search?q=pricing`,
      `/projects/${pid}/pages/${pageClient}`, `/projects/${pid}/pages/${pageClient}/markdown`, `/projects/${pid}/pages/${pageInternal}`,
      ...['overview', 'requests', `requests/${sharedNum}`, 'documents', `documents/${pageClient}`, 'deliverables', 'activity', 'approvals', `approvals/${uatId}`,
        'meetings', 'reports', 'payments', 'desk', 'resources', 'clients'].map((s) => `/projects/${pid}/portal/${s}`),
    ];
    for (const u of [client, memberClient]) {
      for (const path of paths) {
        const r = await call(u, 'GET', path);
        if (r.status >= 500) leaks.push(`${u.username} ${path} ⇒ ${r.status}`);
        for (const m of MARKS) if (r.text.includes(m)) leaks.push(`${u.username} ${path} ⇒ "${m}"`);
      }
      // Thông báo trong chuông của khách.
      const notes = JSON.stringify((await prisma.socialNotification.findMany({ where: { receiverId: u.id } })).map((n) => n.payload));
      for (const m of MARKS) if (notes.includes(m)) leaks.push(`${u.username} chuông ⇒ "${m}"`);
    }
    for (const path of [`/share/${shareToken}`, `/share/${shareToken}/issues?section=board`, `/share/${shareToken}/issues?section=backlog`,
      `/share/${shareToken}/issues/${sharedNum}`, `/share/${shareToken}/reports`, `/share/${shareToken}/tests`]) {
      const r = await call(null, 'GET', path);
      if (r.status >= 500) leaks.push(`public ${path} ⇒ ${r.status}`);
      for (const m of MARKS) if (r.text.includes(m)) leaks.push(`public ${path} ⇒ "${m}"`);
    }
    const mails = JSON.stringify(sent.filter((m) => m.to === client.email || m.to === memberClient.email));
    for (const m of MARKS) if (mails.includes(m)) leaks.push(`email ⇒ "${m}"`);
    assert.deepEqual(leaks, [], `rò rỉ:\n${leaks.join('\n')}`);
  });

  // ─── 3. Khách cũ là MEMBER ────────────────────────────────────────

  it('3. khách cũ là MEMBER: cách ly như khách ở cấp dự án lẫn cấp không gian (không quyền ngầm, không người ngoài phạm vi)', async () => {
    const row = (await call(memberClient, 'GET', '/workspaces')).data.find((w: any) => w.id === wsId);
    assert.equal(row.role, 'GUEST');
    const nums = (await call(memberClient, 'GET', `/projects/${pid}/issues`)).data.items.map((i: any) => i.number).sort();
    assert.deepEqual(nums, [sharedNum].sort(), 'chỉ thẻ đã chia sẻ (seq đã bỏ chia sẻ ở 1a)');
    assert.equal((await call(memberClient, 'GET', `/projects/${pid}/backlog`)).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(memberClient, 'GET', `/projects/${pid}/images/${imgInternal}`)).status, 404);
    const mem = (await call(memberClient, 'GET', `/workspaces/${wsId}/members`)).data.map((m: any) => m.id);
    assert.ok(!mem.includes(ghost.id));
    // Token API của khách cũ: cùng phạm vi.
    const t = await call(memberClient, 'POST', '/me/api-tokens', { name: 'mc', scopes: ['read'] });
    if (t.status === 201) {
      const tok = { ...memberClient, token: t.data.token };
      assert.equal((await call(tok, 'GET', `/projects/${pid}/issues/${hiddenNum}`)).status, 404);
      assert.equal((await call(tok, 'GET', `/projects/${pid}/backlog`)).code, 'CLIENT_PORTAL_ONLY');
    } else {
      assert.equal(t.status, 403, JSON.stringify(t.raw));
    }
  });

  // ─── Ảnh trong tài liệu (đợt 3A) ──────────────────────────────────

  it('ảnh: khách xem được ảnh trong trang CLIENT / mô tả thẻ đã chia sẻ / bình luận PUBLIC; ảnh chỉ ở trang nội bộ ⇒ 404', async () => {
    for (const u of [client, memberClient]) {
      for (const id of [imgShared, imgDesc, imgComment]) {
        const r = await call(u, 'GET', `/projects/${pid}/images/${id}`);
        assert.equal(r.status, 200, `${u.username} ảnh ${id} ⇒ ${r.status} ${r.code}`);
        assert.equal(r.type, 'image/png');
      }
      assert.equal((await call(u, 'GET', `/projects/${pid}/images/${imgInternal}`)).status, 404, 'ảnh chỉ nằm trong trang nội bộ');
    }
    // Thẻ bị bỏ chia sẻ ⇒ ảnh trong mô tả của nó thôi hiện với khách.
    await call(staff, 'PUT', `/projects/${pid}/issues/${sharedNum}/client-visible`, { visible: false });
    try {
      assert.equal((await call(client, 'GET', `/projects/${pid}/images/${imgDesc}`)).status, 404);
      assert.equal((await call(client, 'GET', `/projects/${pid}/images/${imgComment}`)).status, 404);
    } finally {
      await call(staff, 'PUT', `/projects/${pid}/issues/${sharedNum}/client-visible`, { visible: true });
    }
    // Trang CLIENT chuyển về nội bộ ⇒ ảnh của nó thôi hiện.
    await call(owner, 'PATCH', `/projects/${pid}/pages/${pageClient}`, { visibility: 'INTERNAL' });
    try {
      assert.equal((await call(client, 'GET', `/projects/${pid}/images/${imgShared}`)).status, 404);
    } finally {
      await call(owner, 'PATCH', `/projects/${pid}/pages/${pageClient}`, { visibility: 'CLIENT' });
    }
    // Nhân viên xem mọi ảnh của dự án như cũ.
    for (const id of [imgShared, imgInternal, imgComment, imgDesc]) assert.equal((await call(staff, 'GET', `/projects/${pid}/images/${id}`)).status, 200);
    // Không gửi ảnh qua đường khách: khách vẫn không tải ảnh lên trang (chỉ đọc).
    assert.equal((await raw(client, `/projects/${pid}/images`, await png(77))).status, 403);
  });

  it('ảnh qua link công khai: chi tiết thẻ trả `images` theo đường token; chỉ ảnh trong mô tả thẻ link đọc được', async () => {
    const d = await call(null, 'GET', `/share/${shareToken}/issues/${sharedNum}`);
    assert.equal(d.status, 200);
    const urls: string[] = d.data.images;
    assert.deepEqual(urls, [`/api/v1/work/share/${shareToken}/images/${imgDesc}`]);
    const ok = await call(null, 'GET', `/share/${shareToken}/images/${imgDesc}`);
    assert.equal(ok.status, 200);
    assert.equal(ok.type, 'image/png');
    // Ảnh của trang (CLIENT hay nội bộ) / bình luận: link công khai không đọc trang hay bình luận ⇒ 404.
    for (const id of [imgShared, imgInternal, imgComment]) assert.equal((await call(null, 'GET', `/share/${shareToken}/images/${id}`)).status, 404, `ảnh ${id}`);
    assert.equal((await call(null, 'GET', `/share/badtoken_badtoken_badtoken/images/${imgDesc}`)).status, 404);
    // Link tắt mô tả ⇒ không ảnh.
    const noDesc = await call(owner, 'POST', `/projects/${pid}/share-links`, { label: 'nodesc', options: { descriptions: false } });
    const t2 = noDesc.data.url.split('/').pop();
    assert.deepEqual((await call(null, 'GET', `/share/${t2}/issues/${sharedNum}`)).data.images, []);
    assert.equal((await call(null, 'GET', `/share/${t2}/images/${imgDesc}`)).status, 404);
  });
});
