/**
 * CT Work UX-D — ảnh xem trước link + ảnh bìa dự án, qua HTTP thật + Postgres cục bộ (kho ảnh GIẢ trong RAM):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.uxd.db.test.ts
 *
 *   I  Thẻ lời mời: hợp lệ ⇒ workspace, dự án (+bìa), người mời (+ảnh), số thành viên NGƯỜI (không tính agent);
 *      KHÔNG có email/vai trò/cờ "gửi đích danh" ở bất kỳ đâu trong JSON · hết hạn / hết lượt / thu hồi / sai / dự án
 *      đã xoá ⇒ CÙNG MỘT `{status:'UNAVAILABLE'}` · trang mời (/invites/:token) có thêm `card`.
 *   R  Rate-limit riêng: quá WORK_PUBLIC_CARD_RPM ⇒ 429, đếm theo IP (mục phải nhất của X-Forwarded-For), áp cả /invites/:token.
 *   S  Link công khai: % tiến độ + sprint đang chạy chỉ khi link cho xem board/backlog/reports · không tăng lượt xem.
 *   W  Thẻ workspace / cổng khách: chỉ tên + logo (+ màu) — không tên dự án.
 *   C  Ảnh bìa: mẫu SWT301 tự gán bìa · chọn preset (ADMIN) · MEMBER bị 403 · preset lạ 400 · tải PNG ⇒ lưu JPEG
 *      (sharp) · GIF / SVG / ảnh quá nhỏ bị từ chối · đổi ảnh xoá ảnh cũ · danh sách dự án có coverUrl.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

process.env.WORK_PUBLIC_CARD_RPM = '8';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import * as cover from '../services/work/projectCover.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `uxd${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work UX-D — thẻ OG công khai + ảnh bìa (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, member: U, agent: U;
  let wsId = 0, wsSlug = '', pid = 0, pid2 = 0;
  const objects = new Map<string, Buffer>();
  const deleted: string[] = [];
  let ipSeq = 0;
  const freshIp = () => `10.9.${Math.floor(++ipSeq / 250)}.${ipSeq % 250}`;

  async function mkUser(name: string, extra: Record<string, unknown> = {}): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', fullName: `Full ${name}`, avatarUrl: `https://cdn.test/${name}.png`, ...extra } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown, ip = freshIp(), raw?: { buf: Buffer; type: string }) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method,
      headers: { 'Content-Type': raw ? raw.type : 'application/json', 'X-Forwarded-For': ip, ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: raw ? new Uint8Array(raw.buf) : body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* không phải JSON */ }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, text, headers: res.headers };
  }
  const tokenOf = (url: string) => url.split('/').pop()!;
  async function inviteLink(body: Record<string, unknown>) {
    const r = await call(owner, 'POST', `/workspaces/${wsId}/invite-links`, body);
    assert.equal(r.status, 201, r.text);
    return { token: tokenOf(r.data.url), id: r.data.id as number };
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_EMAIL_NOTIFICATIONS = 'false';
    cover._setCoverStoreForTests({
      async put(key, body) { objects.set(key, body); return { url: `https://media.test/${key}` }; },
      async del(key) { objects.delete(key); deleted.push(key); },
      keyFromUrl: (url) => (url?.startsWith('https://media.test/') ? url.slice('https://media.test/'.length) : null),
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, member] = await Promise.all([mkUser('owner'), mkUser('member')]);
    agent = await mkUser('agent', { kind: 'AGENT' });

    const ws = await call(owner, 'POST', '/workspaces', { name: `UXD Studio ${tag}` });
    assert.equal(ws.status, 201, ws.text);
    wsId = ws.data.id; wsSlug = ws.data.slug;
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SWT', name: 'Testing Lab', type: 'SCRUM', template: 'SWT301' });
    assert.equal(p.status, 201, p.text);
    pid = p.data.id;
    const p2 = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SEC', name: 'Secret Merger Plan', type: 'KANBAN', template: 'BLANK' });
    pid2 = p2.data.id;
    const add = await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [member.email], role: 'MEMBER', projectId: pid, projectRole: 'MEMBER' });
    assert.equal(add.data[0].status, 'ADDED');
    // Agent là thành viên — KHÔNG được tính vào "số thành viên" của lời mời.
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: agent.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agent.id, role: 'MEMBER' } });
  });

  after(async () => {
    server?.close();
    cover._setCoverStoreForTests(null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it('C: mẫu SWT301 tự gán bìa hợp chủ đề; danh sách dự án có coverUrl', async () => {
    const list = await call(owner, 'GET', `/workspaces/${wsId}/projects`);
    assert.equal(list.status, 200, list.text);
    const swt = list.data.find((x: any) => x.id === pid);
    assert.equal(swt.coverUrl, 'preset:school-swt301');
    assert.match(list.data.find((x: any) => x.id === pid2).coverUrl, /^preset:[a-z-]+$/); // BLANK ⇒ theo loại dự án
    const cfg = await call(owner, 'GET', `/projects/${pid}`);
    assert.equal(cfg.data.coverUrl, 'preset:school-swt301');
  });

  it('I: thẻ lời mời hợp lệ — đủ trường, không email, không đếm agent', async () => {
    await call(owner, 'PUT', `/projects/${pid}/cover`, { preset: 'theme-testing', positionY: 30 });
    const { token } = await inviteLink({ role: 'MEMBER', projectId: pid, projectRole: 'MEMBER', maxUses: 3 });
    const r = await call(null, 'GET', `/public/invite-card/${token}`);
    assert.equal(r.status, 200, r.text);
    assert.equal(r.data.status, 'VALID');
    assert.equal(r.data.workspace.name, `UXD Studio ${tag}`);
    assert.equal(r.data.project.name, 'Testing Lab');
    assert.equal(r.data.project.coverUrl, 'preset:theme-testing');
    assert.equal(r.data.project.coverPositionY, 30);
    assert.deepEqual(r.data.inviter, { name: 'Full owner', avatarUrl: 'https://cdn.test/owner.png' });
    assert.equal(r.data.memberCount, 2); // owner + member, KHÔNG agent
    assert.equal(r.headers.get('cache-control'), 'no-store');
    for (const bad of ['@', 'email', 'restricted', 'role', owner.username]) assert.ok(!r.text.includes(bad), `lộ "${bad}": ${r.text}`);

    // Lời mời đích danh (có email) — thẻ cũng không cho biết điều đó.
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [`nobody-${tag}@test.local`], role: 'MEMBER' });
    const row = await prisma.workInvite.findFirst({ where: { workspaceId: wsId, email: { not: null } }, orderBy: { id: 'desc' } });
    assert.ok(row);
    // Trang mời (tuyến cũ) có thêm `card` cùng dữ liệu.
    const pv = await call(null, 'GET', `/invites/${token}`);
    assert.equal(pv.status, 200, pv.text);
    assert.equal(pv.data.card.status, 'VALID');
    assert.equal(pv.data.card.project.name, 'Testing Lab');
    assert.ok(!JSON.stringify(pv.data.card).includes('@'));

    // Lời mời không gắn dự án ⇒ số thành viên workspace (người).
    const wsInv = await inviteLink({ role: 'MEMBER', maxUses: 1 });
    const w = await call(null, 'GET', `/public/invite-card/${wsInv.token}`);
    assert.equal(w.data.project, null);
    assert.equal(w.data.memberCount, 2);
  });

  it('I: hết hạn / hết lượt / thu hồi / sai / dự án đã xoá ⇒ cùng một UNAVAILABLE', async () => {
    const same = JSON.stringify({ status: 'UNAVAILABLE' });
    const exp = await inviteLink({ role: 'MEMBER', maxUses: 2 });
    await prisma.workInvite.update({ where: { id: exp.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const used = await inviteLink({ role: 'MEMBER', maxUses: 1 });
    await prisma.workInvite.update({ where: { id: used.id }, data: { usedCount: 1 } });
    const rev = await inviteLink({ role: 'MEMBER', maxUses: 1 });
    assert.equal((await call(owner, 'DELETE', `/workspaces/${wsId}/invites/${rev.id}`)).status, 200);
    const gone = await inviteLink({ role: 'MEMBER', projectId: pid2, projectRole: 'MEMBER', maxUses: 1 });
    await prisma.workProject.update({ where: { id: pid2 }, data: { deletedAt: new Date() } });
    for (const t of [exp.token, used.token, rev.token, gone.token, 'not-a-real-token', 'x'.repeat(300)]) {
      const r = await call(null, 'GET', `/public/invite-card/${t}`);
      assert.equal(r.status, 200);
      assert.equal(JSON.stringify(r.data), same, t);
    }
    await prisma.workProject.update({ where: { id: pid2 }, data: { deletedAt: null } });
  });

  it('R: rate-limit theo IP — quá trần ⇒ 429, IP khác vẫn được; áp cả /invites/:token', async () => {
    const ip = '203.0.113.7';
    const codes: number[] = [];
    for (let i = 0; i < 10; i++) codes.push((await call(null, 'GET', `/public/workspace-card/${wsSlug}`, undefined, `1.1.1.1, ${ip}`)).status);
    assert.deepEqual(codes.slice(0, 8), Array(8).fill(200));
    assert.equal(codes[8], 429);
    // Mục TRÁI của XFF do khách tự ghi — đổi nó không thoát được trần.
    assert.equal((await call(null, 'GET', `/public/workspace-card/${wsSlug}`, undefined, `9.9.9.9, ${ip}`)).status, 429);
    assert.equal((await call(null, 'GET', `/invites/whatever`, undefined, ip)).status, 429);
    assert.equal((await call(null, 'GET', `/public/workspace-card/${wsSlug}`, undefined, '198.51.100.1')).status, 200);
  });

  it('S: link công khai — tiến độ + sprint chỉ khi link vốn cho xem; không tăng lượt xem', async () => {
    const cfg = await call(owner, 'GET', `/projects/${pid}`);
    const typeId = cfg.data.issueTypes.find((t: any) => t.key === 'TASK' || t.key === 'STORY').id;
    for (const title of ['A', 'B', 'C', 'D']) assert.equal((await call(owner, 'POST', `/projects/${pid}/issues`, { typeId, title })).status, 201);
    await prisma.workIssue.updateMany({ where: { projectId: pid, title: { in: ['A'] } }, data: { resolvedAt: new Date() } });
    const sp = await prisma.workSprint.create({ data: { projectId: pid, name: 'Sprint UXD', state: 'ACTIVE', position: 99 } });
    const full = await call(owner, 'POST', `/projects/${pid}/share-links`, {});
    const testsOnly = await call(owner, 'POST', `/projects/${pid}/share-links`, { options: { board: false, backlog: false, reports: false, tests: true } });
    const a = await call(null, 'GET', `/public/share-card/${tokenOf(full.data.url)}`);
    assert.equal(a.data.status, 'VALID');
    assert.equal(a.data.project.name, 'Testing Lab');
    assert.equal(a.data.progress.total >= 4, true);
    assert.equal(a.data.progress.done >= 1, true);
    assert.equal(a.data.sprint.name, 'Sprint UXD');
    const b = await call(null, 'GET', `/public/share-card/${tokenOf(testsOnly.data.url)}`);
    assert.equal(b.data.progress, null);
    assert.equal(b.data.sprint, null);
    const link = await prisma.workPublicLink.findFirst({ where: { token: tokenOf(full.data.url) } });
    assert.equal(link?.viewCount, 0);
    assert.equal((await call(null, 'GET', `/public/share-card/${'z'.repeat(30)}`)).data.status, 'UNAVAILABLE');
    await prisma.workSprint.delete({ where: { id: sp.id } });
  });

  it('W: thẻ workspace / cổng khách chỉ có tên + logo (+ màu), không tên dự án', async () => {
    await call(owner, 'PATCH', `/projects/${pid2}`, { color: '#16a34a' });
    const w = await call(null, 'GET', `/public/workspace-card/${wsSlug}`);
    assert.deepEqual(w.data, { status: 'VALID', workspace: { name: `UXD Studio ${tag}`, logoUrl: null } });
    const p = await call(null, 'GET', `/public/portal-card/${wsSlug}/SEC`);
    assert.equal(p.data.color, '#16a34a');
    assert.ok(!p.text.includes('Secret'), p.text);
    assert.equal((await call(null, 'GET', `/public/workspace-card/no-such-${tag}`)).data.status, 'UNAVAILABLE');
    assert.equal((await call(null, 'GET', `/public/portal-card/${wsSlug}/NOPE`)).data.status, 'VALID'); // không dò được dự án
  });

  it('C: đổi bìa — quyền ADMIN, preset lạ 400, tải PNG ⇒ JPEG, GIF/SVG/nhỏ bị từ chối, ảnh cũ bị xoá', async () => {
    assert.equal((await call(member, 'PUT', `/projects/${pid}/cover`, { preset: 'cute-cat' })).status, 403);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/cover`, { preset: 'not-a-cover' })).status, 400);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/cover`, { positionY: 101 })).status, 400);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/cover`, {})).status, 400);
    const okSet = await call(owner, 'PUT', `/projects/${pid}/cover`, { preset: 'cute-cat' });
    assert.deepEqual(okSet.data, { coverUrl: 'preset:cute-cat', coverPositionY: 50 });

    const png = await sharp({ create: { width: 900, height: 400, channels: 3, background: '#4f5bd5' } }).png().toBuffer();
    const up = await call(owner, 'POST', `/projects/${pid}/cover/upload?positionY=20`, undefined, freshIp(), { buf: png, type: 'image/png' });
    assert.equal(up.status, 201, up.text);
    assert.match(up.data.coverUrl, new RegExp(`^https://media\\.test/work/branding/p${pid}/cover-[0-9a-f-]+\\.jpg$`));
    assert.equal(up.data.coverPositionY, 20);
    const stored = objects.get(up.data.coverUrl.slice('https://media.test/'.length))!;
    assert.equal((await sharp(stored).metadata()).format, 'jpeg');

    assert.equal((await call(member, 'POST', `/projects/${pid}/cover/upload`, undefined, freshIp(), { buf: png, type: 'image/png' })).status, 403);
    const gif = await sharp({ create: { width: 900, height: 400, channels: 3, background: '#fff' } }).gif().toBuffer();
    assert.equal((await call(owner, 'POST', `/projects/${pid}/cover/upload`, undefined, freshIp(), { buf: gif, type: 'image/gif' })).code, 'WORK_IMAGE_INVALID');
    const svgBuf = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="400"><script>alert(1)</script></svg>');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/cover/upload`, undefined, freshIp(), { buf: svgBuf, type: 'image/svg+xml' })).code, 'WORK_IMAGE_INVALID');
    const tiny = await sharp({ create: { width: 100, height: 50, channels: 3, background: '#000' } }).png().toBuffer();
    assert.equal((await call(owner, 'POST', `/projects/${pid}/cover/upload`, undefined, freshIp(), { buf: tiny, type: 'image/png' })).code, 'WORK_IMAGE_TOO_SMALL');

    // Đổi về preset ⇒ ảnh tải lên cũ bị xoá khỏi kho.
    const firstKey = up.data.coverUrl.slice('https://media.test/'.length);
    await call(owner, 'PUT', `/projects/${pid}/cover`, { preset: 'theme-code' });
    assert.ok(deleted.includes(firstKey));
    assert.equal(objects.has(firstKey), false);
    const clear = await call(owner, 'PUT', `/projects/${pid}/cover`, { preset: null });
    assert.equal(clear.data.coverUrl, null);
  });

  it('B: ảnh dự án / logo workspace qua backend (thay PUT thẳng R2 "Failed to fetch") — PNG ≤512, quyền, ảnh cũ bị xoá', async () => {
    const big = await sharp({ create: { width: 1400, height: 900, channels: 4, background: { r: 79, g: 91, b: 213, alpha: 0.5 } } }).webp().toBuffer();
    const a = await call(owner, 'POST', `/projects/${pid}/avatar/upload`, undefined, freshIp(), { buf: big, type: 'image/webp' });
    assert.equal(a.status, 201, a.text);
    assert.match(a.data.avatarUrl, new RegExp(`^https://media\\.test/work/branding/p${pid}/[0-9a-f-]+\\.png$`));
    const meta = await sharp(objects.get(a.data.avatarUrl.slice('https://media.test/'.length))!).metadata();
    assert.equal(meta.format, 'png'); assert.ok((meta.width ?? 0) <= 512 && (meta.height ?? 0) <= 512); assert.equal(meta.hasAlpha, true);
    const a2 = await call(owner, 'POST', `/projects/${pid}/avatar/upload`, undefined, freshIp(), { buf: big, type: 'image/webp' });
    assert.ok(deleted.includes(a.data.avatarUrl.slice('https://media.test/'.length)), 'ảnh cũ bị xoá');
    assert.equal((await call(owner, 'GET', `/projects/${pid}`)).data.avatarUrl, a2.data.avatarUrl);
    assert.equal((await call(member, 'POST', `/projects/${pid}/avatar/upload`, undefined, freshIp(), { buf: big, type: 'image/webp' })).status, 403);
    const txt = Buffer.from('not an image');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/avatar/upload`, undefined, freshIp(), { buf: txt, type: 'image/png' })).code, 'WORK_BAD_IMAGE');
    const l = await call(owner, 'POST', `/workspaces/${wsId}/logo/upload`, undefined, freshIp(), { buf: big, type: 'image/webp' });
    assert.equal(l.status, 201, l.text);
    assert.match(l.data.logoUrl, new RegExp(`/work/branding/w${wsId}/`));
    assert.equal((await call(member, 'POST', `/workspaces/${wsId}/logo/upload`, undefined, freshIp(), { buf: big, type: 'image/webp' })).status, 403);
    // Logo hiện trong thẻ công khai của workspace.
    assert.equal((await call(null, 'GET', `/public/workspace-card/${wsSlug}`)).data.workspace.logoUrl, l.data.logoUrl);
  });
});
