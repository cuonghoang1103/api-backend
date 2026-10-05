/**
 * CT Work — RESOURCES (06/10/2026), qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.resources.db.test.ts
 *
 *   1. Mô-đun bật mặc định cho MỌI loại dự án mới; dự án cũ (không có khoá) ⇒ MODULE_DISABLED, sidebar rỗng.
 *   2. CRUD + 8 nhóm mặc định + trùng url 409 + xem trước GitHub (API giả) + mở (đếm) + kéo-thả + nhóm.
 *   3. Quyền: MEMBER sửa của mình, ADMIN sửa tất, VIEWER chỉ đọc, GUEST chỉ thấy CLIENT; khách cổng: /resources ⇒
 *      CLIENT_PORTAL_ONLY, /portal/resources chỉ link CLIENT, không linkStatus/openCount.
 *   4. Nhập Markdown / CSV (chạy thử, trùng bỏ qua, tạo nhóm mới, khớp tên nhóm bỏ dấu/hoa thường).
 *   5. Tìm bỏ dấu tiếng Việt + lọc nhóm/nhãn/loại.
 *   6. SSRF: IP nội bộ, localhost, metadata, tên miền trỏ IP nội bộ, chuyển hướng về nội bộ ⇒ chặn; kiểm link chết ⇒
 *      BROKEN + báo người tạo đúng một lần.
 *   7. Web links trên thẻ: thêm theo url / theo resource, trùng 409, VIEWER 403, "Save to Resources", xoá.
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
const tag = `res${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string };

/** Mạng giả: mọi tên miền ⇒ IP công khai, trừ *.internal-test ⇒ 10.0.0.7. Trang theo url. */
const pages = new Map<string, { status: number; html?: string; location?: string; json?: unknown }>();
const fetched: string[] = [];

describe('CT Work — Resources (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, guest: U, client: U;
  let wsId = 0, pid = 0, swPid = 0, oldPid = 0;
  let cfg: any;
  let issueNum = 0;
  let ownerRes = 0, staffRes = 0, clientRes = 0;

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
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const svc = await import('../services/work/resources.service.js');
    svc._setResourceNetForTests({
      lookup: async (host) => (host.endsWith('.internal-test') ? [{ address: '10.0.0.7' }] : host.endsWith('.nxdomain-test') ? [] : [{ address: '93.184.216.34' }]),
      fetch: async (url, init) => {
        fetched.push(`${init.method ?? 'GET'} ${url}`);
        const p = pages.get(url);
        if (!p) return new Response('not found', { status: 404 });
        if (p.location) return new Response(null, { status: p.status, headers: { location: p.location } });
        if (p.json !== undefined) return new Response(JSON.stringify(p.json), { status: p.status, headers: { 'content-type': 'application/json' } });
        return new Response(init.method === 'HEAD' ? null : p.html ?? '', { status: p.status, headers: { 'content-type': 'text/html; charset=utf-8' } });
      },
    });
    pages.set('https://api.github.com/repos/studio/game', { status: 200, json: { full_name: 'studio/game', stargazers_count: 42, pushed_at: '2026-10-01T00:00:00Z', description: 'Our Unity game', default_branch: 'main', language: 'C#' } });
    pages.set('https://www.figma.com/file/abc', { status: 200, html: '<html><head><title>Figma</title><meta property="og:title" content="Game UI &amp; HUD"><meta property="og:description" content="Screens"></head></html>' });
    pages.set('https://redirect.example.com/go', { status: 302, location: 'http://127.0.0.1/admin' });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, guest, client] = await Promise.all(['owner', 'staff', 'viewer', 'guest', 'client'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/resources.service.js'))._setResourceNetForTests(null);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('1. dựng: mô-đun bật mặc định cho mọi loại dự án mới; dự án cũ ⇒ MODULE_DISABLED', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Res ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email], role: 'MEMBER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'GAME', name: 'Game client', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    assert.equal(p.data.modules.resources, true);
    pid = p.data.id;
    for (const [key, kind] of [['SW', 'SOFTWARE'], ['ME', 'PERSONAL'], ['SC', 'SCHOOL']] as const) {
      const q = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key, name: key, template: kind === 'SCHOOL' ? 'SWP391' : 'BLANK', kind });
      assert.equal(q.data.modules.resources, true, kind);
      if (key === 'SW') swPid = q.data.id;
    }
    oldPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old', template: 'BLANK', kind: 'SOFTWARE' })).data.id;
    const o = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } });
    const mods = { ...((o.settings as any).modules) };
    delete mods.resources;
    await prisma.workProject.update({ where: { id: oldPid }, data: { settings: { ...(o.settings as object), modules: mods } } });
    const off = await call(owner, 'GET', `/projects/${oldPid}/resources`);
    assert.equal(off.code, 'MODULE_DISABLED', JSON.stringify(off.raw));
    assert.deepEqual((await call(owner, 'GET', `/projects/${oldPid}/resources/sidebar`)).data, { enabled: false, items: [] });
    // "Enable all recommended" bật resources cho dự án cũ.
    const av = await call(owner, 'GET', `/projects/${oldPid}/studio/available`);
    assert.ok(av.data.willEnable.includes('resources'));

    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${guest.id}`, { role: 'MEMBER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    issueNum = (await call(staff, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Player controller' })).data.number;
  });

  it('2. CRUD: 8 nhóm mặc định, thêm link (kind/favicon/xem trước GitHub), trùng 409, sửa, mở đếm, xoá', async () => {
    const l = await call(staff, 'GET', `/projects/${pid}/resources`);
    assert.equal(l.status, 200, JSON.stringify(l.raw));
    assert.deepEqual(l.data.groups.map((g: any) => g.name), ['Source code', 'Docs', 'Design', 'Audio', '3D & Images', 'References', 'Environments', 'Meetings & calendars']);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/resources`)).data.groups.length, 8, 'gọi lại không đẻ thêm nhóm');
    const src = l.data.groups[0].id;

    const c = await call(staff, 'POST', `/projects/${pid}/resources`, { url: 'github.com/studio/game', groupId: src, tags: ['#unity', 'Unity', 'core'], pinnedToSidebar: true });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.equal(c.data.url, 'https://github.com/studio/game');
    assert.equal(c.data.kind, 'github');
    assert.equal(c.data.title, 'studio/game');
    assert.deepEqual(c.data.tags, ['unity', 'core']);
    assert.match(c.data.faviconUrl, /s2\/favicons\?domain=github\.com/);
    staffRes = c.data.id;
    // Xem trước GitHub chạy nền ⇒ chờ meta.github.
    let gh: any = null;
    for (let i = 0; i < 40 && !gh; i++) { await new Promise((r) => setTimeout(r, 50)); gh = (await call(staff, 'GET', `/projects/${pid}/resources/${staffRes}`)).data.github; }
    assert.equal(gh?.stars, 42);
    assert.equal(gh?.defaultBranch, 'main');

    const dup = await call(owner, 'POST', `/projects/${pid}/resources`, { url: 'https://github.com/studio/game' });
    assert.equal(dup.status, 409);
    assert.equal(dup.code, 'WORK_RESOURCE_DUPLICATE');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/resources`, { url: 'javascript:alert(1)' })).code, 'WORK_BAD_URL');

    const o = await call(owner, 'POST', `/projects/${pid}/resources`, { url: 'https://www.figma.com/file/abc', title: 'Thiết kế HUD', groupId: l.data.groups[2].id, tags: ['giao-diện'] });
    ownerRes = o.data.id;
    assert.equal(o.data.kind, 'figma');
    const cl = await call(owner, 'POST', `/projects/${pid}/resources`, { url: 'https://staging.game.example.com', title: 'Staging build', visibility: 'CLIENT', groupId: l.data.groups[6].id });
    clientRes = cl.data.id;

    // Sửa: MEMBER chỉ sửa link của mình; ADMIN sửa tất.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/resources/${ownerRes}`, { title: 'hack' })).status, 403);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/resources/${staffRes}`, { description: 'Main repo', pinned: true })).data.pinned, true);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/resources/${staffRes}`, { title: 'Game repo' })).data.title, 'Game repo');

    // Mở: tăng đếm + trả url.
    const op = await call(viewer, 'POST', `/projects/${pid}/resources/${staffRes}/open`);
    assert.equal(op.data.url, 'https://github.com/studio/game');
    const after1 = (await call(owner, 'GET', `/projects/${pid}/resources/${staffRes}`)).data;
    assert.equal(after1.openCount, 1);
    assert.ok(after1.lastOpenedAt);

    // Sidebar.
    const sb = await call(viewer, 'GET', `/projects/${pid}/resources/sidebar`);
    assert.deepEqual(sb.data.items.map((x: any) => x.id), [staffRes]);

    // Xoá: MEMBER không xoá của người khác.
    const tmp = (await call(owner, 'POST', `/projects/${pid}/resources`, { url: 'https://tmp.example.com' })).data.id;
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/resources/${tmp}`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/resources/${tmp}`)).status, 200);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/resources/${tmp}`)).status, 404);
    assert.ok(await prisma.workAuditLog.count({ where: { projectId: pid, action: 'resource.delete' } }));
  });

  it('3. nhóm + kéo-thả: MEMBER tạo nhóm được, đổi tên/xoá/sắp xếp nhóm cần ADMIN; xoá nhóm ⇒ link về Ungrouped', async () => {
    const g = await call(staff, 'POST', `/projects/${pid}/resource-groups`, { name: 'Mixamo anims', icon: '🕺' });
    assert.equal(g.status, 201);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/resource-groups/${g.data.id}`, { name: 'x' })).status, 403);
    assert.equal((await call(owner, 'PATCH', `/projects/${pid}/resource-groups/${g.data.id}`, { name: 'Animations', color: '#ff0000' })).data.name, 'Animations');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/resource-groups`, { name: 'nope' })).status, 403);

    // Kéo link của staff sang nhóm mới: staff được (link của mình); kéo link của owner: 403.
    const mv = await call(staff, 'PUT', `/projects/${pid}/resources/reorder`, { groupId: g.data.id, ids: [staffRes] });
    assert.equal(mv.status, 200, JSON.stringify(mv.raw));
    assert.equal(mv.data.items.find((x: any) => x.id === staffRes).groupId, g.data.id);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/resources/reorder`, { groupId: g.data.id, ids: [staffRes, ownerRes] })).status, 403);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/resources/reorder`, { groupId: g.data.id, ids: [ownerRes, staffRes] })).status, 200);
    const list = (await call(owner, 'GET', `/projects/${pid}/resources?group=${g.data.id}`)).data;
    assert.deepEqual(list.items.map((x: any) => x.id), [ownerRes, staffRes]);

    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/resource-groups/${g.data.id}`)).status, 403);
    const del = await call(owner, 'DELETE', `/projects/${pid}/resource-groups/${g.data.id}`);
    assert.equal(del.data.moved, 2);
    const none = (await call(owner, 'GET', `/projects/${pid}/resources?group=none`)).data;
    assert.deepEqual(none.items.map((x: any) => x.id).sort(), [ownerRes, staffRes].sort());

    const gs = (await call(owner, 'GET', `/projects/${pid}/resources`)).data.groups.map((x: any) => x.id);
    const rev = [...gs].reverse();
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/resource-groups/reorder`, { ids: rev })).status, 403);
    assert.deepEqual((await call(owner, 'PUT', `/projects/${pid}/resource-groups/reorder`, { ids: rev })).data.groups.map((x: any) => x.id), rev);
  });

  it('4. nhập Markdown + CSV: chạy thử, trùng bỏ qua, nhóm mới, khớp tên nhóm bỏ dấu/hoa thường', async () => {
    const md = [
      '## SOURCE CODE', '- [Game repo again](https://github.com/studio/game) #dup', '- [Backend](https://github.com/studio/backend) API server #be',
      '## Âm thanh SFX', '* Bước chân: https://freesound.org/people/x/sounds/1/ #sfx #foley', '- https://www.mixamo.com/#/?page=1', 'rác không phải link',
    ].join('\n');
    const dry = await call(staff, 'POST', `/projects/${pid}/resources/import`, { text: md, dryRun: true });
    assert.equal(dry.status, 200, JSON.stringify(dry.raw));
    assert.equal(dry.data.format, 'markdown');
    assert.equal(dry.data.willCreate, 3);
    assert.equal(dry.data.duplicates, 1);
    assert.deepEqual(dry.data.newGroups, ['Âm thanh SFX']);
    assert.equal(dry.data.errors.length, 1);
    assert.equal(dry.data.created, 0);
    assert.equal(await prisma.workResource.count({ where: { projectId: pid, url: 'https://github.com/studio/backend' } }), 0, 'chạy thử không ghi');

    const real = await call(staff, 'POST', `/projects/${pid}/resources/import`, { text: md });
    assert.equal(real.status, 201);
    assert.equal(real.data.created, 3);
    const be = await prisma.workResource.findFirstOrThrow({ where: { projectId: pid, url: 'https://github.com/studio/backend' }, include: { group: true } });
    assert.equal(be.group?.name, 'Source code', '"SOURCE CODE" khớp nhóm mặc định');
    assert.deepEqual(be.tags, ['be']);
    assert.equal(be.description, 'API server');
    assert.equal(be.createdById, staff.id);
    const foley = await prisma.workResource.findFirstOrThrow({ where: { projectId: pid, kind: 'freesound' }, include: { group: true } });
    assert.equal(foley.group?.name, 'Âm thanh SFX');
    assert.equal(foley.title, 'Bước chân');

    const csv = 'title,url,group,tags\n"Rock texture, 4K",https://polyhaven.com/a/rock,3D & Images,"texture;pbr"\nBackend dup,https://github.com/studio/backend,Source code,\nBroken,not-a-link,Docs,';
    const c = await call(owner, 'POST', `/projects/${pid}/resources/import`, { text: csv });
    assert.equal(c.data.format, 'csv');
    assert.equal(c.data.created, 1);
    assert.equal(c.data.duplicates, 1);
    assert.equal(c.data.errors.length, 1);
    const rock = await prisma.workResource.findFirstOrThrow({ where: { projectId: pid, url: 'https://polyhaven.com/a/rock' } });
    assert.deepEqual([rock.title, rock.kind, rock.tags], ['Rock texture, 4K', 'polyhaven', ['texture', 'pbr']]);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/resources/import`, { text: md })).status, 403);
  });

  it('5. tìm bỏ dấu + lọc nhóm/nhãn/loại', async () => {
    const q = async (s: string) => (await call(viewer, 'GET', `/projects/${pid}/resources?${s}`)).data.items.map((x: any) => x.title);
    assert.deepEqual(await q('q=thiet%20ke'), ['Thiết kế HUD']);
    assert.deepEqual(await q('q=buoc%20chan'), ['Bước chân']);
    assert.deepEqual(await q('q=giao%20dien'), ['Thiết kế HUD'], 'nhãn "giao-diện" khớp không dấu');
    assert.deepEqual(await q('tag=SFX'), ['Bước chân']);
    assert.deepEqual((await q('kind=github')).sort(), ['Backend', 'Game repo']);
    assert.deepEqual(await q('kind=github&q=api'), ['Backend']);
    const all = (await call(viewer, 'GET', `/projects/${pid}/resources`)).data;
    assert.ok(all.tags.some((t: any) => t.tag === 'sfx'));
    assert.equal(all.canEdit, false);
  });

  it('6. quyền khách: GUEST chỉ thấy CLIENT; khách cổng chỉ qua /portal/resources, không thấy số liệu nội bộ', async () => {
    const g = await call(guest, 'GET', `/projects/${pid}/resources`);
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.deepEqual(g.data.items.map((x: any) => x.id), [clientRes]);
    assert.ok(!('linkStatus' in g.data.items[0]) && !('openCount' in g.data.items[0]) && !('createdById' in g.data.items[0]));
    assert.deepEqual(g.data.groups.map((x: any) => x.name), ['Environments'], 'khách không thấy tên nhóm trống/nội bộ');
    assert.equal((await call(guest, 'POST', `/projects/${pid}/resources`, { url: 'https://x.example.com' })).status, 403);
    assert.equal((await call(guest, 'GET', `/projects/${pid}/resources/${staffRes}`)).status, 404);

    for (const [m, path] of [['GET', '/resources'], ['GET', `/resources/${clientRes}`], ['GET', '/resources/sidebar'], ['GET', `/issues/${issueNum}/web-links`]] as const) {
      assert.equal((await call(client, m, `/projects/${pid}${path}`)).code, 'CLIENT_PORTAL_ONLY', path);
    }
    const pr = await call(client, 'GET', `/projects/${pid}/portal/resources`);
    assert.equal(pr.status, 200, JSON.stringify(pr.raw));
    assert.deepEqual(pr.data.items.map((x: any) => x.title), ['Staging build']);
    assert.ok(!('linkStatus' in pr.data.items[0]) && !('openCount' in pr.data.items[0]));
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/resources/${clientRes}/open`)).data.url, 'https://staging.game.example.com/');
    assert.equal((await call(client, 'POST', `/projects/${pid}/portal/resources/${staffRes}/open`)).status, 404);
    // Nhân viên xem tab cổng cũng chỉ thấy đúng thứ khách thấy.
    assert.deepEqual((await call(owner, 'GET', `/projects/${pid}/portal/resources`)).data.items.map((x: any) => x.id), [clientRes]);
  });

  it('7. SSRF bị chặn ở "Add link"; trang công khai tự điền tiêu đề (OpenGraph)', async () => {
    const pv = await call(staff, 'POST', `/projects/${pid}/resources/preview`, { url: 'https://www.figma.com/file/abc' });
    assert.equal(pv.status, 200, JSON.stringify(pv.raw));
    assert.equal(pv.data.title, 'Game UI & HUD');
    assert.equal(pv.data.description, 'Screens');
    assert.equal(pv.data.duplicateOf?.id, ownerRes);
    const ghp = await call(staff, 'POST', `/projects/${pid}/resources/preview`, { url: 'https://github.com/studio/game/tree/main' });
    assert.equal(ghp.data.title, 'studio/game');
    assert.equal(ghp.data.github.stars, 42);

    const before = fetched.length;
    for (const url of [base, 'http://localhost:5434/', 'http://169.254.169.254/latest/meta-data/', 'http://[::ffff:7f00:1]/', 'http://10.1.2.3/', 'https://db.internal-test/', 'https://redirect.example.com/go', 'http://example.com:22/']) {
      const r = await call(staff, 'POST', `/projects/${pid}/resources/preview`, { url });
      assert.equal(r.status, 400, `${url} ${JSON.stringify(r.raw)}`);
      assert.equal(r.code, 'WORK_URL_BLOCKED', url);
    }
    // Không yêu cầu nào tới địa chỉ nội bộ được phát ra (chỉ chặng đầu công khai của redirect).
    assert.deepEqual(fetched.slice(before), ['GET https://redirect.example.com/go']);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/resources/preview`, { url: 'https://www.figma.com/file/abc' })).status, 403);
  });

  it('8. kiểm link chết: 404 / tên miền chết ⇒ BROKEN + báo người tạo đúng MỘT lần; nội bộ ⇒ UNKNOWN; repo 404 ⇒ UNKNOWN', async () => {
    const svc = await import('../services/work/resources.service.js');
    const dead = (await call(staff, 'POST', `/projects/${pid}/resources`, { url: 'https://gone.example.com/page' })).data.id;
    const nx = (await call(staff, 'POST', `/projects/${pid}/resources`, { url: 'https://old.nxdomain-test/' })).data.id;
    const internal = (await call(staff, 'POST', `/projects/${pid}/resources`, { url: 'https://wiki.internal-test/' })).data.id;
    pages.set('https://staging.game.example.com/', { status: 200, html: '<title>ok</title>' });
    pages.set('https://polyhaven.com/a/rock', { status: 405 });
    pages.set('https://freesound.org/people/x/sounds/1/', { status: 200, html: '' });
    pages.set('https://www.mixamo.com/#/?page=1', { status: 200, html: '' });
    const notifBefore = await prisma.socialNotification.count({ where: { receiverId: staff.id } });
    const future = new Date(Date.now() + 30 * 24 * 3600_000);
    const r1 = await svc.runLinkChecks({ projectId: pid, limit: 100, now: future });
    assert.ok(r1.checked >= 5, JSON.stringify(r1));
    const st = async (id: number) => (await prisma.workResource.findUniqueOrThrow({ where: { id } })).linkStatus;
    assert.equal(await st(dead), 'BROKEN');
    assert.equal(await st(nx), 'BROKEN');
    assert.equal(await st(internal), 'UNKNOWN', 'nội bộ không bị gọi, không báo oan');
    assert.equal(await st(clientRes), 'OK');
    assert.equal(await st(staffRes), 'UNKNOWN', 'repo GitHub 404 có thể là private');
    const notified = (await prisma.socialNotification.count({ where: { receiverId: staff.id } })) - notifBefore;
    assert.equal(notified, 2);
    assert.ok(!fetched.some((f) => f.includes('internal-test')), 'không yêu cầu nào tới tên miền trỏ IP nội bộ');
    // Lượt sau: vẫn BROKEN ⇒ không báo lại.
    await svc.runLinkChecks({ projectId: pid, limit: 100, now: new Date(future.getTime() + 8 * 24 * 3600_000) });
    assert.equal((await prisma.socialNotification.count({ where: { receiverId: staff.id } })) - notifBefore, 2);
    const list = (await call(owner, 'GET', `/projects/${pid}/resources?status=BROKEN`)).data;
    assert.deepEqual(list.items.map((x: any) => x.id).sort(), [dead, nx].sort());
    assert.equal(list.broken, 2);
    // Tắt bằng env.
    process.env.WORK_LINK_CHECK_ENABLED = 'false';
    assert.deepEqual(await svc.runLinkChecks({ projectId: pid }), { checked: 0, broken: 0, notified: 0 });
    delete process.env.WORK_LINK_CHECK_ENABLED;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/resources/check`)).status, 403);
  });

  it('9. Web links trên thẻ: thêm theo url / theo resource, trùng 409, VIEWER 403, Save to Resources, xoá', async () => {
    const path = `/projects/${pid}/issues/${issueNum}/web-links`;
    const a = await call(staff, 'POST', path, { url: 'https://docs.unity3d.com/Manual/CharacterControllers.html', title: 'Unity docs: CharacterController' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.items[0].inResources, false);
    assert.equal(a.data.items[0].kind, 'unity');
    const b = await call(staff, 'POST', path, { resourceId: staffRes });
    assert.equal(b.data.items.length, 2);
    assert.equal(b.data.items[1].title, 'Game repo');
    assert.equal((await call(staff, 'POST', path, { resourceId: staffRes })).code, 'WORK_WEB_LINK_DUPLICATE');
    // URL đã có trong Resources ⇒ trỏ luôn vào đó.
    const c = await call(owner, 'POST', path, { url: 'https://www.figma.com/file/abc' });
    assert.equal(c.data.items[2].inResources, true);
    assert.equal(c.data.items[2].title, 'Thiết kế HUD');
    assert.equal((await call(viewer, 'POST', path, { url: 'https://x.example.com' })).status, 403);
    assert.equal((await call(viewer, 'GET', path)).data.items.length, 3);

    const lid = a.data.items[0].id;
    const sv = await call(staff, 'POST', `${path}/${lid}/save`, { tags: ['docs'] });
    assert.equal(sv.status, 200, JSON.stringify(sv.raw));
    assert.equal(sv.data.created, true);
    const saved = await prisma.workResource.findUniqueOrThrow({ where: { id: sv.data.resourceId } });
    assert.deepEqual([saved.title, saved.tags, saved.createdById], ['Unity docs: CharacterController', ['docs'], staff.id]);
    assert.equal((await call(staff, 'GET', path)).data.items[0].inResources, true);

    // Xoá resource ⇒ Web link vẫn còn (ảnh chụp url/title).
    await call(staff, 'DELETE', `/projects/${pid}/resources/${saved.id}`);
    const left = (await call(staff, 'GET', path)).data.items[0];
    assert.equal(left.inResources, false);
    assert.equal(left.url, 'https://docs.unity3d.com/Manual/CharacterControllers.html');

    assert.equal((await call(staff, 'DELETE', `${path}/${lid}`)).data.items.length, 2);
    assert.ok(await prisma.workHistory.count({ where: { issue: { projectId: pid, number: issueNum }, field: 'webLink' } }) >= 2);
  });

  it('10. dự án SOFTWARE cũng có thư viện riêng (cách ly giữa dự án)', async () => {
    const l = await call(owner, 'GET', `/projects/${swPid}/resources`);
    assert.equal(l.data.items.length, 0);
    assert.equal(l.data.groups.length, 8);
    assert.equal((await call(owner, 'GET', `/projects/${swPid}/resources/${staffRes}`)).status, 404);
    assert.equal((await call(owner, 'PUT', `/projects/${swPid}/resources/reorder`, { groupId: null, ids: [staffRes] })).code, 'WORK_BAD_RESOURCE');
  });

  it('11. xoá cứng dự án có nhóm + link + Web links ⇒ cascade sạch (khoá ngoại DEFERRABLE, không vỡ khi một dòng bị chạm hai lần)', async () => {
    const before = await prisma.workResource.count({ where: { projectId: pid } });
    assert.ok(before > 3);
    assert.ok(await prisma.workIssueWebLink.count({ where: { issue: { projectId: pid } } }));
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workResource.count({ where: { projectId: pid } }), 0);
    assert.equal(await prisma.workResourceGroup.count({ where: { projectId: pid } }), 0);
  });
});
