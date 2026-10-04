/**
 * CT Work đợt S5c — hoàn thiện, qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.s5c.db.test.ts
 *
 *   1. Mô-đun mới cho dự án cũ: dự án cũ Y NGUYÊN cho tới khi ADMIN bấm "Enable all recommended"; chỉ khoá chưa quyết
 *      được bật, khoá đã quyết (bật/tắt tay) giữ nguyên; MEMBER bấm ⇒ 403; bấm lần hai không đẻ audit.
 *   2. Thùng rác Docs: xoá trang có con ⇒ một dòng trong Trash ⇒ khôi phục cả cây đúng chỗ; cha đã xoá ⇒ về gốc; chỉ
 *      chủ/ADMIN khôi phục, chỉ ADMIN xoá vĩnh viễn, có chữ ký ⇒ 409; khách / dự án tắt docs bị chặn.
 *   3. Nhập lại: xuất (kho R2 giả) ⇒ nhập thành DỰ ÁN MỚI ⇒ số dòng từng bảng khớp; nhập sang không gian khác (người không
 *      có ở đó) ⇒ để trống + "Imported from …"; ZIP sai định dạng ⇒ lỗi rõ ràng; MEMBER/khách không nhập được; mã trùng 409.
 *   4. AI đọc/ghi Docs (model GIẢ qua `_setAskForTests`): GUEST không đọc được trang INTERNAL qua AI (cả mục lục, read_page,
 *      search_pages, summarize_page); đề xuất ghi KHÔNG tự áp dụng; Apply ⇒ phiên bản mới; khách cổng bị chặn.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import JSZip from 'jszip';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `s5c${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
const fakeR2 = new Map<string, Buffer>();

type U = { id: number; token: string; email: string };

describe('CT Work — đợt S5c: hoàn thiện (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, guest: U, client: U, outsider: U;
  let wsId = 0, ws2 = 0, pid = 0, oldPid = 0, s1Pid = 0, schoolPid = 0;
  let cfg: any;
  let internalPage = 0, clientPage = 0;
  const prompts: string[] = [];
  let fakeReplies: string[] = [];

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
      headers: { ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, message: (json.message ?? json.error?.message) as string | undefined };
  }
  const upload = (u: U, ws: number, buf: Buffer, name = 'export.zip') => {
    const fd = new FormData();
    fd.append('file', new Blob([new Uint8Array(buf)], { type: 'application/zip' }), name);
    return call(u, 'POST', `/workspaces/${ws}/imports`, fd);
  };
  const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));
  const doc = (text: string) => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] });
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;

  before(async () => {
    const { _setExportStoreForTests } = await import('../services/work/projectExport.service.js');
    const { Readable } = await import('node:stream');
    _setExportStoreForTests({
      enabled: () => true,
      head: async (key) => (fakeR2.has(key) ? fakeR2.get(key)!.length : null),
      read: async (key) => { const b = fakeR2.get(key); if (!b) throw new Error('NoSuchKey'); return Readable.from([b]); },
      putFile: async (key, filePath) => { fakeR2.set(key, fs.readFileSync(filePath)); },
      signedUrl: async (key) => `${base}/fake-r2/${encodeURIComponent(key)}`,
      remove: async (key) => { fakeR2.delete(key); },
    });
    (await import('../services/work/ai.service.js'))._setAskForTests(async (system, user) => {
      prompts.push(`${system}\n---\n${user}`);
      return fakeReplies.shift() ?? '{"reply":"ok","actions":[]}';
    });
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.get('/fake-r2/:key', (req, res) => { const b = fakeR2.get(String(req.params.key)); if (!b) { res.status(404).end(); return; } res.type('application/zip').send(b); });
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, guest, client, outsider] = await Promise.all(['owner', 'staff', 'guest', 'client', 'outsider'].map(mkUser));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/ai.service.js'))._setAskForTests(null);
    (await import('../services/work/projectExport.service.js'))._setExportStoreForTests(null);
    if (wsIds.length) {
      await prisma.workProjectImport.deleteMany({ where: { workspaceId: { in: wsIds } } });
      await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    }
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT mới, dự án "trước S1" (không settings.modules), dự án "thời S1" (docs=false giữ chỗ), School', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `S5c ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email], role: 'MEMBER' });
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [guest.email], role: 'GUEST' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'CL', name: 'Client app', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${guest.id}`, { role: 'MEMBER' })).status, 200);
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;

    oldPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OLD', name: 'Old client', template: 'FREELANCE', kind: 'CLIENT' })).data.id;
    const o = await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } });
    const { modules: _m, ...rest } = o.settings as Record<string, unknown>;
    await prisma.workProject.update({ where: { id: oldPid }, data: { settings: rest as object, createdAt: new Date('2026-09-01T00:00:00Z') } });

    s1Pid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SONE', name: 'S1 era', template: 'COMPANY', kind: 'CLIENT' })).data.id;
    const s1 = await prisma.workProject.findUniqueOrThrow({ where: { id: s1Pid } });
    await prisma.workProject.update({
      where: { id: s1Pid },
      data: {
        createdAt: new Date('2026-10-04T12:00:00+07:00'),
        settings: { ...(s1.settings as object), modules: { teams: true, stages: true, approvals: true, handoffs: true, docs: false, clientPortal: false, changeRequests: false, raid: false, meetings: false, finance: false } },
      },
    });
    schoolPid = (await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'SCH', name: 'School', template: 'SWP391', kind: 'SCHOOL' })).data.id;
  });

  it('1. mô-đun mới: dự án cũ y nguyên tới khi ADMIN bấm; chỉ khoá chưa quyết; MEMBER 403; bấm lại không đẻ audit', async () => {
    const before = (await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } })).settings;
    // Đọc nhiều lần không ghi gì; mô-đun vẫn tắt (route docs ⇒ MODULE_DISABLED).
    const av = await call(owner, 'GET', `/projects/${oldPid}/studio/available`);
    assert.equal(av.status, 200, JSON.stringify(av.raw));
    assert.equal(av.data.kind, 'CLIENT');
    assert.ok(av.data.modules.every((m: any) => m.on === false && m.undecided === true && m.body));
    assert.deepEqual(av.data.willEnable.length, 12);
    assert.equal((await call(owner, 'GET', `/projects/${oldPid}/pages`)).code, 'MODULE_DISABLED');
    assert.deepEqual((await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } })).settings, before, 'đọc không ghi');
    // MEMBER không bấm được; khách cổng không thấy tuyến.
    assert.equal((await call(staff, 'POST', `/projects/${oldPid}/studio/apply-defaults`)).status, 403);
    assert.equal((await call(client, 'GET', `/projects/${pid}/studio/available`)).code, 'CLIENT_PORTAL_ONLY');
    assert.deepEqual((await prisma.workProject.findUniqueOrThrow({ where: { id: oldPid } })).settings, before, 'vẫn y nguyên tới khi bấm');

    // ADMIN bật rồi tắt TAY "raid" trước (đã quyết, có audit) ⇒ bấm "Enable all recommended" không bật lại raid.
    await call(owner, 'PUT', `/projects/${oldPid}/studio`, { modules: { raid: true } });
    await call(owner, 'PUT', `/projects/${oldPid}/studio`, { modules: { raid: false } });
    const ap = await call(owner, 'POST', `/projects/${oldPid}/studio/apply-defaults`);
    assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    assert.ok(ap.data.enabled.includes('docs') && ap.data.enabled.includes('serviceDesk'));
    assert.ok(!ap.data.enabled.includes('raid'));
    const mods = (await call(owner, 'GET', `/projects/${oldPid}/studio`)).data.modules;
    assert.equal(mods.docs, true);
    assert.equal(mods.raid, false, 'khoá đã quyết giữ nguyên');
    assert.equal((await call(owner, 'GET', `/projects/${oldPid}/pages`)).status, 200);
    const audits = await prisma.workAuditLog.count({ where: { projectId: oldPid, action: 'project.studio' } });
    const again = await call(owner, 'POST', `/projects/${oldPid}/studio/apply-defaults`);
    assert.deepEqual(again.data.enabled, []);
    assert.equal(await prisma.workAuditLog.count({ where: { projectId: oldPid, action: 'project.studio' } }), audits, 'bấm lần hai không ghi gì');

    // Dự án thời S1: docs=false là chỗ giữ ⇒ bật; teams=true giữ; reports/serviceDesk thiếu khoá ⇒ bật.
    const s1 = await call(owner, 'POST', `/projects/${s1Pid}/studio/apply-defaults`);
    assert.deepEqual([...s1.data.enabled].sort(), ['changeRequests', 'clientPortal', 'docs', 'finance', 'meetings', 'raid', 'reports', 'serviceDesk']);
    // School: không có mô-đun nào được khuyên ⇒ không bật gì.
    assert.deepEqual((await call(owner, 'POST', `/projects/${schoolPid}/studio/apply-defaults`)).data.enabled, []);
    assert.equal((await call(owner, 'GET', `/projects/${schoolPid}/studio`)).data.modules.docs, false);
  });

  it('2. Trash cho Docs: xoá trang có con ⇒ khôi phục cả cây; cha đã xoá ⇒ về gốc; quyền; chữ ký chặn xoá vĩnh viễn', async () => {
    const mk = async (u: U, title: string, parentNumber?: number) => (await call(u, 'POST', `/projects/${pid}/pages`, { title, parentNumber, contentJson: doc(title) })).data.number as number;
    const root = await mk(owner, 'Root');
    const a = await mk(owner, 'A', root);
    const b = await mk(owner, 'B', a);
    const c = await mk(owner, 'C', b);
    const posA = (await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: a } })).position;
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/pages/${a}`)).data.deleted, 3);
    const t1 = await call(staff, 'GET', `/projects/${pid}/trash/pages`);
    assert.equal(t1.status, 200);
    const rowA = t1.data.items.find((x: any) => x.number === a);
    assert.equal(rowA.childCount, 2, 'một dòng cho cả lần xoá');
    assert.ok(!t1.data.items.some((x: any) => x.number === b), 'con không hiện riêng');
    assert.equal(rowA.restoresTo.number, root);
    assert.equal(rowA.canRestore, false, 'MEMBER không phải chủ');
    assert.equal(t1.data.canPurge, false);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/trash/pages/${a}/restore`)).status, 403);
    assert.equal((await call(guest, 'GET', `/projects/${pid}/trash/pages`)).status, 403, 'GUEST không sửa tài liệu ⇒ không thấy thùng rác');
    assert.equal((await call(client, 'GET', `/projects/${pid}/trash/pages`)).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(owner, 'GET', `/projects/${schoolPid}/trash/pages`)).code, 'MODULE_DISABLED');
    const r = await call(owner, 'POST', `/projects/${pid}/trash/pages/${a}/restore`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.restored, 3);
    const back = await prisma.workPage.findMany({ where: { projectId: pid, number: { in: [a, b, c] } }, select: { number: true, deletedAt: true, parentId: true, position: true } });
    assert.ok(back.every((x) => x.deletedAt === null));
    const rootRow = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: root } });
    const aRow = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: a } });
    assert.equal(aRow.parentId, rootRow.id, 'cha còn ⇒ giữ chỗ');
    assert.equal(aRow.position, posA, 'giữ vị trí');
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: pid, action: 'page.restore' } }));

    // Con bị xoá TRƯỚC, rồi cha ⇒ hai dòng; khôi phục con khi cha còn trong thùng rác ⇒ về gốc.
    await call(owner, 'DELETE', `/projects/${pid}/pages/${b}`);
    await wait(15);
    await call(owner, 'DELETE', `/projects/${pid}/pages/${a}`);
    const t2 = (await call(owner, 'GET', `/projects/${pid}/trash/pages`)).data;
    assert.ok(t2.items.some((x: any) => x.number === a) && t2.items.some((x: any) => x.number === b));
    assert.equal(t2.items.find((x: any) => x.number === b).restoresTo, null);
    const rb = await call(owner, 'POST', `/projects/${pid}/trash/pages/${b}/restore`);
    assert.equal(rb.data.toTopLevel, true);
    assert.equal((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: b } })).parentId, null);
    assert.equal((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: c } })).deletedAt, null, 'cây con của b đi cùng');

    // Xoá vĩnh viễn: chỉ ADMIN; trang có phê duyệt đã ký ⇒ 409.
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/trash/pages/${a}`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/trash/pages/${a}`)).data.deleted, 1);
    assert.equal(await prisma.workPage.count({ where: { projectId: pid, number: a } }), 0);
    const signedNum = await mk(owner, 'Signed SRS');
    const sp = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: signedNum } });
    await prisma.workApproval.create({ data: { projectId: pid, targetType: 'DOC', pageId: sp.id, title: 'SRS sign-off', status: 'APPROVED', createdById: owner.id, decidedAt: new Date() } as any });
    await call(owner, 'DELETE', `/projects/${pid}/pages/${signedNum}`);
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/trash/pages/${signedNum}`)).code, 'WORK_PAGE_HAS_SIGNOFF');
    await call(owner, 'POST', `/projects/${pid}/trash/pages/${signedNum}/restore`);
  });

  it('3. nhập lại: xuất ⇒ nhập thành dự án MỚI ⇒ số dòng từng bảng khớp; ZIP hỏng ⇒ lỗi rõ ràng; quyền', async () => {
    // Dữ liệu phong phú cho dự án nguồn.
    const team = (await call(owner, 'POST', `/workspaces/${wsId}/teams`, { key: 'QA', name: 'Quality' })).data;
    const sprint = (await call(owner, 'POST', `/projects/${pid}/sprints`, { name: 'Sprint 1' })).data;
    const version = (await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v1.0' })).data;
    const stage = (await call(owner, 'POST', `/projects/${pid}/stages`, { slug: 'discovery', name: 'Discovery' })).data;
    const epic = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'EPIC'), title: 'Login epic' })).data;
    const story = (await call(staff, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'STORY'), title: 'As a user I can log in', parentId: epic.id, assigneeId: guest.id })).data;
    assert.ok(story?.number, 'story created');
    await call(owner, 'PATCH', `/projects/${pid}/issues/${story.number}`, { sprintId: sprint.id, fixVersionId: version.id, teamId: team.id, stageId: stage.id, priority: 2 });
    await call(guest, 'POST', `/projects/${pid}/issues/${story.number}/comments`, { bodyJson: doc('Guest comment') });
    await call(staff, 'POST', `/projects/${pid}/issues/${story.number}/worklogs`, { minutes: 90 });
    await call(owner, 'POST', `/projects/${pid}/changes`, { title: 'Add SSO' });
    await call(owner, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Vendor delay' });
    await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Kick-off', startsAt: '2026-10-06T02:00:00Z', endsAt: '2026-10-06T03:00:00Z', attendeeIds: [staff.id] });
    await call(owner, 'POST', `/projects/${pid}/finance/rates`, { scope: 'DEFAULT', hourlyRate: 300000 });
    await call(owner, 'POST', `/projects/${pid}/finance/expenses`, { spentOn: '2026-10-01', description: 'Hosting', amount: 500000 });
    const t = await call(owner, 'POST', `/projects/${pid}/desk/tickets`, { requestType: 'INCIDENT', impact: 'HIGH', urgency: 'HIGH', title: 'Site down' });
    assert.equal(t.status, 201, JSON.stringify(t.raw));
    const page = (await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Spec', contentJson: doc('v1') })).data;
    await call(owner, 'PATCH', `/projects/${pid}/pages/${page.number}`, { contentJson: doc('v2'), versionNote: 'second' });
    const sRow = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: story.number } });
    const att = await prisma.workAttachment.create({ data: { issueId: sRow.id, r2Key: `work/${pid}/${sRow.id}/spec.txt`, fileName: 'spec.txt', mime: 'text/plain', size: 11 } });
    await prisma.workAttachment.create({ data: { issueId: sRow.id, r2Key: `work/${pid}/${sRow.id}/gone.png`, fileName: 'gone.png', mime: 'image/png', size: 5 } });
    fakeR2.set(att.r2Key, Buffer.from('hello specs'));

    // Xuất (kèm tệp).
    const st = await call(owner, 'POST', `/projects/${pid}/exports`, { includeFiles: true });
    assert.equal(st.status, 202, JSON.stringify(st.raw));
    let ex: any = st.data;
    for (let i = 0; i < 150 && !['DONE', 'FAILED'].includes(ex.status); i++) { await wait(); ex = (await call(owner, 'GET', `/projects/${pid}/exports/${ex.id}`)).data; }
    assert.equal(ex.status, 'DONE', ex.error ?? '');
    const zipBuf = fakeR2.get(`work-exports/${pid}/${ex.id}.zip`)!;
    const manifest = JSON.parse(await (await JSZip.loadAsync(zipBuf)).file('manifest.json')!.async('string'));
    assert.ok(Object.keys(manifest.checksums).length > 70, 'manifest có checksum từng tệp');
    assert.ok(typeof manifest.userHashSalt === 'string');
    assert.ok(!zipBuf.toString('latin1').includes(staff.email), 'không lộ email');

    // Quyền + ZIP hỏng.
    assert.equal((await upload(staff, wsId, zipBuf)).status, 403, 'MEMBER không nhập');
    assert.equal((await upload(guest, wsId, zipBuf)).status, 403, 'GUEST không nhập');
    const notZip = await upload(owner, wsId, Buffer.from('not a zip at all'), 'notes.zip');
    assert.equal(notZip.status, 400);
    assert.equal(notZip.code, 'WORK_IMPORT_BAD_FILE');
    assert.match(notZip.message ?? '', /not a ZIP archive/);
    const z2 = await JSZip.loadAsync(zipBuf);
    z2.file('manifest.json', JSON.stringify({ ...manifest, formatVersion: 9 }));
    const v9 = await upload(owner, wsId, await z2.generateAsync({ type: 'nodebuffer' }));
    assert.match(v9.message ?? '', /newer version of CT Work \(format version 9\)/);
    const z3 = await JSZip.loadAsync(zipBuf);
    z3.file('data/issues.json', '[]');
    const tampered = await upload(owner, wsId, await z3.generateAsync({ type: 'nodebuffer' }));
    assert.equal(tampered.code, 'WORK_IMPORT_BAD_FILE');
    assert.match(tampered.message ?? '', /data\/issues\.json/);

    // Chạy thử.
    const up = await upload(owner, wsId, zipBuf);
    assert.equal(up.status, 201, JSON.stringify(up.raw));
    const plan = up.data.plan;
    assert.equal(up.data.status, 'UPLOADED');
    assert.equal(plan.source.key, 'CL');
    assert.notEqual(plan.suggestedKey, 'CL', 'mã gợi ý không trùng');
    assert.ok(plan.people.every((p: any) => p.mappedTo && p.how === 'email'), JSON.stringify(plan.people));
    assert.equal(plan.files.withContent, 1);
    assert.equal(plan.files.missing, 1);
    assert.ok(plan.warnings.some((w: string) => /broken links/.test(w)));
    assert.equal(plan.teams.find((x: any) => x.key === 'QA').action, 'reuse');
    assert.ok(plan.tables.find((x: any) => x.table === 'githubConnection')?.import === false);
    assert.ok(plan.checksumsVerified > 70);
    // Mã trùng ⇒ 409; mã sai ⇒ 400.
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/imports/${up.data.id}/start`, { key: 'CL' })).status, 409);
    assert.equal((await call(owner, 'POST', `/workspaces/${wsId}/imports/${up.data.id}/start`, { key: '1x' })).status, 400);

    const before = await prisma.workIssue.count({ where: { projectId: pid } });
    const go = await call(owner, 'POST', `/workspaces/${wsId}/imports/${up.data.id}/start`, { key: 'CLCOPY', name: 'Client app (restored)' });
    assert.equal(go.status, 202, JSON.stringify(go.raw));
    let job: any = go.data;
    for (let i = 0; i < 300 && !['DONE', 'FAILED'].includes(job.status); i++) { await wait(); job = (await call(owner, 'GET', `/workspaces/${wsId}/imports/${job.id}`)).data; }
    assert.equal(job.status, 'DONE', job.error ?? '');
    assert.equal(job.progress, 100);
    const newPid = job.projectId as number;
    assert.ok(newPid && newPid !== pid);
    assert.equal(await prisma.workIssue.count({ where: { projectId: pid } }), before, 'dự án cũ không bị đụng');
    assert.ok(!fakeR2.has(up.data.filePath ?? '__'), 'ZIP nhập đã xoá khỏi kho');

    const { countProjectTables, SKIPPED_TABLES } = await import('../services/work/projectImport.service.js');
    const a = await countProjectTables(pid);
    const b = await countProjectTables(newPid);
    for (const [table, n] of Object.entries(a)) {
      if (SKIPPED_TABLES[table] || table === 'project') continue;
      assert.equal(b[table], n, `bảng ${table}: nguồn ${n}, bản nhập ${b[table]}`);
    }
    for (const tbl of ['issues', 'comments', 'history', 'sprints', 'versions', 'stages', 'pages', 'pageVersions', 'changeRequests', 'raidItems', 'meetings', 'rates', 'expenses', 'deskTickets', 'slaEvents', 'worklogs', 'attachments']) {
      assert.ok(b[tbl] > 0, `bảng ${tbl} rỗng sau khi nhập`);
    }
    // Giữ số thẻ, cha/con, sprint/version/team/stage; tệp có nội dung được tải lại, tệp thiếu thành liên kết hỏng.
    const ns = await prisma.workIssue.findFirstOrThrow({ where: { projectId: newPid, number: story.number }, include: { parent: true, sprint: true, fixVersion: true, stage: true } });
    assert.equal(ns.parent?.number, epic.number);
    assert.equal(ns.sprint?.name, 'Sprint 1');
    assert.equal(ns.fixVersion?.name, 'v1.0');
    assert.equal(ns.teamId, team.id, 'bộ phận dùng lại theo mã');
    assert.equal(ns.stage?.slug, 'discovery');
    assert.equal(ns.assigneeId, guest.id, 'người khớp theo email');
    const newAtts = await prisma.workAttachment.findMany({ where: { issueId: ns.id } });
    const okAtt = newAtts.find((x) => x.fileName === 'spec.txt')!;
    assert.ok(okAtt.r2Key.startsWith(`work/${newPid}/${ns.id}/`));
    assert.equal(fakeR2.get(okAtt.r2Key)?.toString(), 'hello specs');
    assert.ok(newAtts.find((x) => x.fileName === 'gone.png')!.r2Key.startsWith('work-import-missing/'));
    const np = await prisma.workProject.findUniqueOrThrow({ where: { id: newPid } });
    assert.equal(np.deletedAt, null);
    assert.equal(np.key, 'CLCOPY');
    assert.ok(np.issueCounter >= story.number);
    assert.equal((np.settings as any).importedFrom.key, 'CL');
    assert.ok(await prisma.workAuditLog.findFirst({ where: { projectId: newPid, action: 'project.import' } }));
    // Dự án mới dùng được: tạo thẻ tiếp số.
    const cfg2 = (await call(owner, 'GET', `/projects/${newPid}`)).data;
    const nxt = await call(owner, 'POST', `/projects/${newPid}/issues`, { typeId: typeId(cfg2, 'TASK'), title: 'After import' });
    assert.equal(nxt.data.number, np.issueCounter + 1);
    const pageNew = await call(owner, 'GET', `/projects/${newPid}/pages/${page.number}`);
    assert.equal(pageNew.data.title, 'Spec');
    assert.ok(pageNew.data.versionCount >= 2);

    // Không gian khác, không ai trong đó ⇒ để trống + "Imported from …", giờ làm/người dự họp bị bỏ, đếm trong kết quả.
    ws2 = (await call(outsider, 'POST', '/workspaces', { name: `S5c other ${tag}` })).data.id;
    wsIds.push(ws2);
    const up2 = await upload(outsider, ws2, zipBuf);
    assert.equal(up2.status, 201, JSON.stringify(up2.raw));
    assert.ok(up2.data.plan.people.every((p: any) => !p.mappedTo));
    assert.ok(up2.data.plan.warnings.some((w: string) => /not in this workspace/.test(w)));
    assert.equal(up2.data.plan.teams.find((x: any) => x.key === 'QA').action, 'create');
    const go2 = await call(outsider, 'POST', `/workspaces/${ws2}/imports/${up2.data.id}/start`, { key: 'CL' });
    let j2: any = go2.data;
    for (let i = 0; i < 300 && !['DONE', 'FAILED'].includes(j2.status); i++) { await wait(); j2 = (await call(outsider, 'GET', `/workspaces/${ws2}/imports/${j2.id}`)).data; }
    assert.equal(j2.status, 'DONE', j2.error ?? '');
    const p2 = j2.projectId as number;
    const s2 = await prisma.workIssue.findFirstOrThrow({ where: { projectId: p2, number: story.number } });
    assert.equal(s2.assigneeId, null);
    assert.equal(s2.reporterId, null);
    assert.ok(await prisma.workHistory.findFirst({ where: { issueId: s2.id, field: 'imported', toValue: { contains: 'Imported from' } } }));
    const cm = await prisma.workComment.findFirstOrThrow({ where: { issueId: s2.id } });
    assert.match(cm.bodyText, /^Imported from /);
    assert.equal(cm.isAi, false);
    assert.equal(await prisma.workWorklog.count({ where: { issue: { projectId: p2 } } }), 0, 'giờ làm của người không có ⇒ bỏ');
    assert.ok(j2.result.tables.worklogs.skipped >= 1);
    assert.ok(await prisma.workTeam.findFirst({ where: { workspaceId: ws2, key: 'QA' } }), 'bộ phận tạo mới trong không gian đích');
    assert.equal((await call(owner, 'GET', `/workspaces/${ws2}/imports`)).status, 404, 'người ngoài không thấy');
  });

  it('4. AI đọc/ghi Docs: GUEST không đọc trang INTERNAL; đề xuất không tự áp dụng; Apply ⇒ phiên bản mới; khách bị chặn', async () => {
    internalPage = (await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Internal pricing ZETA', contentJson: { type: 'doc', content: [{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Margin' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'SECRET-MARGIN-42' }] }] } })).data.number;
    clientPage = (await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Client guide', visibility: 'CLIENT', contentJson: { type: 'doc', content: [{ type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Setup' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'Install the app' }] }] } })).data.number;

    // GUEST (vai MEMBER trong dự án): model xin đọc trang nội bộ + tìm chữ bí mật ⇒ "not found", không lộ nội dung.
    prompts.length = 0;
    fakeReplies = [
      JSON.stringify({ reply: '', reads: [{ tool: 'read_page', number: internalPage }, { tool: 'search_pages', query: 'SECRET-MARGIN' }, { tool: 'read_page', number: clientPage }] }),
      JSON.stringify({ reply: 'Here is what I found.', actions: [] }),
    ];
    const g = await call(guest, 'POST', `/projects/${pid}/ai/chat`, { message: 'What is our margin?' });
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal(prompts.length, 2, 'một vòng đọc rồi trả lời');
    assert.ok(!prompts[0].includes('Internal pricing ZETA'), 'mục lục của GUEST không có trang INTERNAL');
    assert.ok(prompts[0].includes('Client guide'));
    assert.match(prompts[1], new RegExp(`read_page #${internalPage}: not found or not visible to you`));
    assert.ok(!prompts[1].includes('SECRET-MARGIN-42'), 'nội dung INTERNAL không vào prompt');
    assert.match(prompts[1], /Install the app/);
    assert.ok(!/draft_page/.test(prompts[0]), 'GUEST không sửa được Docs ⇒ không được mời đề xuất ghi');
    const gs = await call(guest, 'POST', `/projects/${pid}/ai/quick`, { task: 'summarize_page', pageNumber: internalPage });
    assert.equal(gs.status, 404, 'summarize_page trang INTERNAL ⇒ 404 trước khi gọi AI');
    // Khách cổng: mọi tuyến AI bị chặn.
    assert.equal((await call(client, 'POST', `/projects/${pid}/ai/chat`, { message: 'hi' })).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(client, 'POST', `/projects/${pid}/ai/quick`, { task: 'summarize_page', pageNumber: clientPage })).code, 'CLIENT_PORTAL_ONLY');

    // MEMBER: đề xuất sửa một mục ⇒ lưu ĐỀ XUẤT, trang không đổi cho tới khi Apply.
    const pg = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: internalPage } });
    const v0 = await prisma.workPageVersion.count({ where: { pageId: pg.id } });
    fakeReplies = [JSON.stringify({ reply: 'Proposed a clearer margin section.', actions: [{ type: 'update_page_section', number: internalPage, heading: 'Margin', markdown: 'Target margin is **30%**.', mode: 'replace' }] })];
    const s = await call(staff, 'POST', `/projects/${pid}/ai/chat`, { message: 'Rewrite the margin section' });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.equal(s.data.actions[0].type, 'update_page_section');
    assert.equal(await prisma.workPageVersion.count({ where: { pageId: pg.id } }), v0, 'đề xuất KHÔNG tự áp dụng');
    assert.match((await prisma.workPage.findUniqueOrThrow({ where: { id: pg.id } })).contentText ?? '', /SECRET-MARGIN-42/);
    // GUEST áp dụng hộ ⇒ bị chặn (không sửa được trang INTERNAL).
    assert.notEqual((await call(guest, 'POST', `/projects/${pid}/ai/messages/${s.data.answer.id}/actions/0/apply`)).status, 200);
    const appl = await call(staff, 'POST', `/projects/${pid}/ai/messages/${s.data.answer.id}/actions/0/apply`);
    assert.equal(appl.status, 200, JSON.stringify(appl.raw));
    const after1 = await prisma.workPage.findUniqueOrThrow({ where: { id: pg.id } });
    assert.match(after1.contentText ?? '', /Target margin is 30%/);
    assert.ok(!(after1.contentText ?? '').includes('SECRET-MARGIN-42'), 'mục được thay');
    const lastV = await prisma.workPageVersion.findFirstOrThrow({ where: { pageId: pg.id }, orderBy: { n: 'desc' } });
    assert.equal(lastV.kind, 'MANUAL');
    assert.match(lastV.note ?? '', /AI suggestion applied: rewrote section “Margin”/);

    // Quick "Draft SRS from requirements": chỉ giữ ĐÚNG một draft_page; chưa áp dụng thì chưa có trang.
    const pagesBefore = await prisma.workPage.count({ where: { projectId: pid } });
    prompts.length = 0;
    fakeReplies = [JSON.stringify({ reply: 'Draft ready.', actions: [{ type: 'create_issue', issueType: 'TASK', title: 'stray' }, { type: 'draft_page', title: 'SRS — Client app', markdown: '# SRS\n\n## 1. Introduction\n\nThe system shall let users log in (CL-2).' }] })];
    const q = await call(staff, 'POST', `/projects/${pid}/ai/quick`, { task: 'draft_srs' });
    assert.equal(q.status, 200, JSON.stringify(q.raw));
    assert.deepEqual(q.data.actions.map((x: any) => x.type), ['draft_page']);
    assert.match(prompts[0], /As a user I can log in/, 'yêu cầu của dự án vào prompt');
    assert.equal(await prisma.workPage.count({ where: { projectId: pid } }), pagesBefore);
    const ad = await call(staff, 'POST', `/projects/${pid}/ai/messages/${q.data.answer.id}/actions/0/apply`);
    assert.equal(ad.status, 200, JSON.stringify(ad.raw));
    const created = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, title: 'SRS — Client app' } });
    assert.equal((await prisma.workPageVersion.findFirstOrThrow({ where: { pageId: created.id } })).kind, 'CREATE');
    // Summarize page (MEMBER, trang đọc được) — không đề xuất gì.
    fakeReplies = [JSON.stringify({ reply: '- Setup: install the app', actions: [{ type: 'draft_page', title: 'x', markdown: 'y' }] })];
    const sum = await call(staff, 'POST', `/projects/${pid}/ai/quick`, { task: 'summarize_page', pageNumber: clientPage });
    assert.equal(sum.status, 200, JSON.stringify(sum.raw));
    assert.deepEqual(sum.data.actions, []);
    // Dự án tắt docs: không mời đọc/ghi Docs; quick docs ⇒ MODULE_DISABLED.
    prompts.length = 0;
    fakeReplies = [JSON.stringify({ reply: 'ok', actions: [] })];
    await call(owner, 'POST', `/projects/${schoolPid}/ai/chat`, { message: 'hello' });
    assert.ok(!/search_pages/.test(prompts[0]));
    assert.equal((await call(owner, 'POST', `/projects/${schoolPid}/ai/quick`, { task: 'draft_srs' })).code, 'MODULE_DISABLED');
  });
});
