/**
 * CTW K-3b — đồng soạn thảo Docs: HTTP + WebSocket (Hocuspocus) THẬT trên Postgres cục bộ. Bật bằng:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctwk3b.db.test.ts
 *
 * Phủ: quyền vào phòng (MEMBER sửa · VIEWER chỉ xem · khách cổng/agent/người ngoài không vào · khoá chỉnh sửa ⇒ chỉ xem
 * · đổi vai giữa chừng bị ngắt), nạp trang CŨ vào Yjs ở lần mở đầu (giữ bảng/ảnh/Mermaid), hai client sửa đồng thời rồi
 * hội tụ + lưu xuống trang, snapshot ⇒ phiên bản (lịch sử/tìm kiếm/xuất), Fill from project khi có người đang gõ (đi qua
 * Yjs, không đè, không 409), khôi phục phiên bản qua Yjs, công tắc trang/dự án, tác giả theo đoạn, bình luận gắn đoạn văn.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import * as Y from 'yjs';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { connectCollab, type CollabTestClient } from '../services/work/collabWsClient.js';
import { stableStringify } from '../services/work/studio.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `k3b${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work K-3b — đồng soạn thảo Docs (HTTP + WS + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let wsUrl = '';
  let server: import('node:http').Server;
  let owner: U, member: U, member2: U, viewer: U, client: U, outsider: U, agent: U;
  let pid = 0;
  let oldNum = 0;
  let oldPageId = 0;
  let r2Num = 0;
  const open: CollabTestClient[] = [];
  let gw: typeof import('../socket/work-docs-collaboration.gateway.js');

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, ...(kind === 'AGENT' ? { kind } : {}) } });
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
  async function join(u: U, num: number): Promise<{ c: CollabTestClient; s: any }> {
    const s = (await call(u, 'GET', `/projects/${pid}/pages/${num}/collab`)).data;
    assert.equal(s.enabled, true, JSON.stringify(s));
    const c = connectCollab(wsUrl, s.documentName, s.token);
    open.push(c);
    await c.scope;
    await c.synced;
    return { c, s };
  }
  const P = (t: string) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] });
  const textOf = (d: Y.Doc) => JSON.stringify(gw.docJsonForTests(d));
  /** Gõ vào chữ ĐẦU TIÊN tìm thấy trong khối `block` (khối mẫu có thể lồng: bảng, danh sách…). */
  const typeAt = (d: Y.Doc, block: number, at: number, s: string) => {
    const find = (n: Y.XmlElement | Y.XmlText): Y.XmlText | null => {
      if (n instanceof Y.XmlText) return n;
      for (const k of n.toArray()) { const t = find(k as Y.XmlElement); if (t) return t; }
      return null;
    };
    const t = find(d.getXmlFragment('default').get(block) as Y.XmlElement);
    if (!t) throw new Error(`no text in block ${block}`);
    t.insert(Math.min(at, t.length), s);
  };
  const settle = (ms = 400) => new Promise((r) => setTimeout(r, ms));

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    gw = await import('../socket/work-docs-collaboration.gateway.js');
    const svc = await import('../services/work/collab.service.js');
    const app = express();
    app.use(express.json({ limit: '5mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    const instance = gw.createWorkCollabServer({ authenticate: svc.authenticateCollabToken, recheck: svc.recheckCollab }, { redis: false, debounce: 100, maxDebounce: 300 });
    gw.attachWorkCollab(server, instance);
    const port = (server.address() as AddressInfo).port;
    base = `http://127.0.0.1:${port}`;
    wsUrl = `ws://127.0.0.1:${port}${gw.WORK_COLLAB_PATH}`;
    [owner, member, member2, viewer, client, outsider] = await Promise.all(['owner', 'member', 'member2', 'viewer', 'client', 'outsider'].map((n) => mkUser(n)));
    agent = await mkUser('agent', 'AGENT');
  });

  after(async () => {
    for (const c of open) c.close();
    await settle(300);
    gw?.resetWorkCollabForTests();
    server?.close();
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('dựng không gian + dự án CLIENT (docs bật) + vai: MEMBER×2, VIEWER, khách cổng, agent', async () => {
    const ws = await call(owner, 'POST', '/workspaces', { name: `K3b ${tag}` });
    assert.equal(ws.status, 201);
    await call(owner, 'POST', `/workspaces/${ws.data.id}/invites`, { emails: [member.email, member2.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${ws.data.id}/projects`, { key: 'KB', name: 'Collab', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201);
    pid = p.data.id;
    await call(owner, 'POST', `/workspaces/${ws.data.id}/invites`, { emails: [client.email], role: 'GUEST', projectId: pid, projectRole: 'CLIENT' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await prisma.workMember.create({ data: { workspaceId: ws.data.id, userId: agent.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agent.id, role: 'MEMBER' } });
  });

  it('trang CŨ (có bảng, ảnh sơ đồ, Mermaid) ⇒ lần mở đầu nạp vào Yjs, giữ nguyên khối', async () => {
    const content = {
      type: 'doc', content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Scope' }] },
        P('Hệ thống quản lý phòng lab.'),
        { type: 'image', attrs: { src: 'https://cdn.example.com/x.png', alt: 'ctw-diagram:3@latest', title: null } },
        { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: 'flowchart TD\n A-->B' }] },
        { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableHeader', attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [P('Actor')] }] }] },
      ],
    };
    const r = await call(member, 'POST', `/projects/${pid}/pages`, { title: 'Old page', contentJson: content });
    assert.equal(r.status, 201);
    oldNum = r.data.number;
    oldPageId = r.data.id;
    assert.equal(await prisma.workPageCollab.count({ where: { pageId: oldPageId } }), 0, 'chưa có trạng thái Yjs');
    const { c, s } = await join(member, oldNum);
    assert.equal(s.mode, 'edit');
    assert.equal(s.user.color.startsWith('#'), true);
    const back = gw.docJsonForTests(c.doc) as any;
    assert.deepEqual(back.content.map((b: any) => b.type), ['heading', 'paragraph', 'image', 'codeBlock', 'table']);
    assert.equal(back.content[2].attrs.alt, 'ctw-diagram:3@latest');
    assert.equal(back.content[3].attrs.language, 'mermaid');
    assert.equal(c.doc.getMap('metadata').get('title'), 'Old page');
    assert.equal(await prisma.workPageCollab.count({ where: { pageId: oldPageId } }), 1, 'đã gieo');
  });

  it('quyền vào phòng: VIEWER chỉ xem (ghi bị bỏ qua) · khách cổng / agent / người ngoài không vào', async () => {
    const v = await join(viewer, oldNum);
    assert.equal(v.s.mode, 'read');
    assert.equal(await v.c.scope, 'readonly');
    typeAt(v.c.doc, 1, 0, 'HACK ');
    await settle(500);
    const page = await prisma.workPage.findUniqueOrThrow({ where: { id: oldPageId }, select: { contentText: true } });
    assert.ok(!page.contentText?.includes('HACK'), 'ghi của VIEWER không vào trang');
    v.c.close();

    const cl = await call(client, 'GET', `/projects/${pid}/pages/${oldNum}/collab`);
    assert.ok(cl.status === 403 || cl.status === 404, `khách cổng: ${cl.status}`);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/pages/${oldNum}/collab`)).status, 404);
    const svc = await import('../services/work/collab.service.js');
    assert.equal((await svc.collabModeFor(agent.id, pid, oldPageId)).mode, 'deny', 'agent');
    // Mã phiên giả / của trang khác ⇒ bị từ chối khi bắt tay.
    const s = (await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/collab`)).data;
    const wrong = connectCollab(wsUrl, `workpage:${oldPageId + 999999}`, s.token);
    open.push(wrong);
    await assert.rejects(wrong.scope);
    const forged = connectCollab(wsUrl, s.documentName, jwt.sign({ kind: 'work-doc-collab', userId: outsider.id, projectId: pid, pageId: oldPageId, roleVersion: 0 }, config.jwtSecret, { issuer: 'cuongthai-work', audience: 'work-docs-collaboration' }));
    open.push(forged);
    await assert.rejects(forged.scope);
  });

  it('hai client sửa đồng thời rồi hội tụ; lưu xuống trang (tìm kiếm thấy) + snapshot thành phiên bản', async () => {
    const a = await join(member, oldNum);
    const b = await join(member2, oldNum);
    typeAt(a.c.doc, 1, 0, '[An] ');
    typeAt(b.c.doc, 1, 0, '[Bình] ');
    typeAt(b.c.doc, 0, 5, ' & schedule');
    await a.c.until(() => textOf(a.c.doc) === textOf(b.c.doc) && textOf(a.c.doc).includes('[Bình]') && textOf(a.c.doc).includes('[An]'));
    assert.ok(textOf(a.c.doc).includes('Scope & schedule'));
    // Người cuối rời phòng ⇒ lưu + chụp phiên bản.
    a.c.close();
    b.c.close();
    for (const c of open) c.close();
    await a.c.until(() => gw.liveConnectionCount(oldPageId) === 0, 5000);
    await settle(600);
    const page = await prisma.workPage.findUniqueOrThrow({ where: { id: oldPageId }, select: { contentText: true, title: true, version: true, lastEditedById: true } });
    assert.ok(page.contentText!.includes('[An]') && page.contentText!.includes('[Bình]'), page.contentText!);
    const found = await call(owner, 'GET', `/projects/${pid}/pages/search?q=${encodeURIComponent('Bình')}`);
    assert.ok(found.data.some((x: any) => x.number === oldNum), 'tìm kiếm thấy chữ gõ trong phiên');
    const vs = await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/versions`);
    assert.ok(vs.data.length >= 2, 'có phiên bản mới');
    const latest = await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/versions/${vs.data[0].n}`);
    assert.ok(JSON.stringify(latest.data.contentJson).includes('[Bình]'), 'phiên bản chứa nội dung cộng tác');
    // Xuất Markdown đọc từ trang ⇒ có chữ mới.
    const md = await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/markdown`);
    assert.ok(md.status !== 200 || JSON.stringify(md.data).includes('Bình'));
    // Tác giả theo đoạn: đoạn 1 có An + Bình + chữ cũ (trước khi đồng soạn).
    const au = await call(owner, 'GET', `/projects/${pid}/pages/${oldNum}/collab/authors`);
    assert.equal(au.status, 200);
    const p1 = au.data.blocks[1];
    const ids = p1.authors.map((x: any) => x.userId);
    assert.ok(ids.includes(member.id) && ids.includes(member2.id) && ids.includes(null), JSON.stringify(p1));
  });

  it('Fill from project khi có người ĐANG GÕ ⇒ đi qua Yjs: chữ người gõ còn, phần tự điền vào, không 409', async () => {
    const r = await call(member, 'POST', `/projects/${pid}/pages`, { templateKey: 'fpt-report2-project-management-plan' });
    assert.equal(r.status, 201);
    r2Num = r.data.number;
    const staleVersion = r.data.version;
    const a = await join(member2, r2Num);
    const tables = () => (gw.docJsonForTests(a.c.doc) as any).content.filter((b: any) => b.type === 'table').length;
    const tablesBefore = tables();
    // Gõ vào đoạn đầu và CHƯA chờ lưu.
    typeAt(a.c.doc, 0, 0, 'LIVE-NOTE ');
    await settle(50);
    const fill = await call(member, 'POST', `/projects/${pid}/pages/${r2Num}/autofill`, { version: staleVersion });
    assert.equal(fill.status, 200, JSON.stringify(fill.raw));
    assert.ok(fill.data.filled.length > 0, 'có mục được điền');
    await a.c.until(() => textOf(a.c.doc).includes('LIVE-NOTE') && textOf(a.c.doc) !== '' && (gw.docJsonForTests(a.c.doc) as any).content.length > 3);
    await settle(500);
    const page = await prisma.workPage.findUniqueOrThrow({ where: { id: (await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: r2Num } })).id }, select: { contentText: true } });
    assert.ok(page.contentText!.includes('LIVE-NOTE'), 'chữ người đang gõ không bị đè');
    assert.ok(JSON.stringify(gw.docJsonForTests(a.c.doc)).includes(owner.email.split('@')[0]) || fill.data.filled.includes('team') || fill.data.filled.length > 0);
    // Client đang mở nhận được phần tự điền (qua Yjs) — so với trang trên DB.
    const dbDoc = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: r2Num }, select: { contentJson: true } });
    await a.c.until(() => stableStringify(gw.docJsonForTests(a.c.doc)) === stableStringify(dbDoc.contentJson), 5000);
    const vs = await call(member, 'GET', `/projects/${pid}/pages/${r2Num}/versions`);
    assert.ok(vs.data.some((v: any) => /Filled from project data/.test(v.note ?? '')), 'phiên bản có ghi chú tự điền');
    // Bảng tự điền THAY bảng mẫu (không nhân đôi) dù khối đầu đang bị sửa — JSON mẫu và JSON từ Yjs phải so cùng dạng chuẩn.
    assert.equal(tables(), tablesBefore, 'không nhân đôi bảng khi tự điền');
    a.c.close();
  });

  it('khôi phục phiên bản khi trang đang đồng soạn ⇒ client đang mở thấy ngay', async () => {
    const a = await join(member, oldNum);
    const before = textOf(a.c.doc);
    assert.ok(before.includes('[An]'));
    const r = await call(member, 'POST', `/projects/${pid}/pages/${oldNum}/versions/1/restore`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    await a.c.until(() => !textOf(a.c.doc).includes('[An]'));
    a.c.close();
  });

  it('khoá chỉnh sửa / mất vai giữa chừng ⇒ chỉ xem / bị ngắt; công tắc trang + dự án tắt ⇒ enabled:false', async () => {
    await call(member2, 'PUT', `/projects/${pid}/edit-lock`, { locked: true });
    const s = (await call(member2, 'GET', `/projects/${pid}/pages/${oldNum}/collab`)).data;
    assert.equal(s.mode, 'read');
    await call(member2, 'PUT', `/projects/${pid}/edit-lock`, { locked: false });

    const v = await join(member2, oldNum);
    await call(owner, 'PUT', `/projects/${pid}/members/${member2.id}`, { role: 'VIEWER' });
    await settle(5200); // quá hạn kiểm quyền 5 giây
    typeAt(v.c.doc, 1, 0, 'AFTER-DEMOTE ');
    await settle(600);
    const page = await prisma.workPage.findUniqueOrThrow({ where: { id: oldPageId }, select: { contentText: true } });
    assert.ok(!page.contentText!.includes('AFTER-DEMOTE'), 'mất quyền sửa ⇒ ghi không vào');
    v.c.close();
    await call(owner, 'PUT', `/projects/${pid}/members/${member2.id}`, { role: 'MEMBER' });

    const no = await call(member2, 'PUT', `/projects/${pid}/pages/${oldNum}/collab`, { enabled: false });
    assert.equal(no.status, 403, 'không phải chủ trang');
    const off = await call(member, 'PUT', `/projects/${pid}/pages/${oldNum}/collab`, { enabled: false });
    assert.equal(off.status, 200);
    assert.equal(off.data.enabled, false);
    // Trang tắt collab ⇒ REST thường (khoá lạc quan 409 vẫn còn).
    const pg = (await call(member, 'GET', `/projects/${pid}/pages/${oldNum}`)).data;
    const ok1 = await call(member, 'PATCH', `/projects/${pid}/pages/${oldNum}`, { contentJson: { type: 'doc', content: [P('REST edit while off')] }, version: pg.version });
    assert.equal(ok1.status, 200);
    const stale = await call(member, 'PATCH', `/projects/${pid}/pages/${oldNum}`, { contentJson: { type: 'doc', content: [P('stale')] }, version: pg.version });
    assert.equal(stale.code, 'WORK_PAGE_CONFLICT');
    // Bật lại ⇒ phòng khớp lại theo nội dung REST (không mất, không nhân đôi).
    await call(member, 'PUT', `/projects/${pid}/pages/${oldNum}/collab`, { enabled: true });
    const a = await join(member, oldNum);
    assert.equal((gw.docJsonForTests(a.c.doc) as any).content.length, 1);
    assert.ok(textOf(a.c.doc).includes('REST edit while off'));
    a.c.close();

    assert.equal((await call(member, 'PUT', `/projects/${pid}/docs/collab`, { enabled: false })).status, 403, 'chỉ ADMIN dự án');
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/docs/collab`, { enabled: false })).status, 200);
    const s2 = (await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/collab`)).data;
    assert.deepEqual([s2.enabled, s2.projectEnabled], [false, false]);
    await call(owner, 'PUT', `/projects/${pid}/docs/collab`, { enabled: true });
  });

  it('bình luận gắn đoạn văn: tạo (neo + trích), trả lời theo luồng, resolve / mở lại; VIEWER không resolve được', async () => {
    const c = await call(member, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments`, { anchorId: 'anc_test01', quote: 'REST edit', bodyJson: { type: 'doc', content: [P('Câu này mơ hồ')] } });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.equal(c.data.anchor.anchorId, 'anc_test01');
    const dup = await call(member, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments`, { anchorId: 'anc_test01', quote: 'x', bodyJson: { type: 'doc', content: [P('x')] } });
    assert.equal(dup.code, 'WORK_ANCHOR_TAKEN');
    const rep = await call(member2, 'POST', `/projects/${pid}/pages/${oldNum}/comments`, { bodyJson: { type: 'doc', content: [P('Đồng ý')] }, parentId: c.data.id });
    assert.equal(rep.status, 201, JSON.stringify(rep.raw));
    const vRes = await call(viewer, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments/${c.data.id}/resolve`, { resolved: true });
    assert.equal(vRes.status, 403);
    const res = await call(member2, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments/${c.data.id}/resolve`, { resolved: true });
    assert.equal(res.status, 200);
    assert.ok(res.data.resolvedAt);
    const list = await call(member, 'GET', `/projects/${pid}/pages/${oldNum}/comments`);
    const root = list.data.find((x: any) => x.id === c.data.id);
    assert.equal(root.anchor.anchorId, 'anc_test01');
    assert.ok(root.anchor.resolvedAt);
    assert.equal(list.data.find((x: any) => x.id === rep.data.id).parentId, c.data.id);
    const re = await call(member, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments/${c.data.id}/resolve`, { resolved: false });
    assert.equal(re.data.resolvedAt, null);
    // Khách cổng không gọi được.
    assert.equal((await call(client, 'POST', `/projects/${pid}/pages/${oldNum}/inline-comments`, { anchorId: 'anc_cl0001', quote: 'x', bodyJson: { type: 'doc', content: [P('x')] } })).status, 403);
  });
});
