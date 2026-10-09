/**
 * CT Work đợt 4b — SWR302 hồ sơ Wiegers + sáu liên kết qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw4b.db.test.ts
 *
 *   1. R27 mẫu dự án SWR302: tuần 2→9, 8 epic deliverable, trang gói + 5 trang Wiegers, mô-đun, DoD = sáu liên kết.
 *   2. R5 Feature FE-n: tạo/sửa/trùng tên/liên kết UC + thẻ; quyền (viewer đọc không ghi, agent không xoá, người ngoài 404).
 *   3. R6 phân loại + thuộc tính + vòng đời có lịch sử; luồng sai 400; agent không đổi vòng đời; thẻ không phải Requirement 400.
 *   4. R12 bảng ưu tiên: seed FE, chấm điểm, trọng số (agent 403), xếp hạng, xuất xlsx đúng layout + công thức.
 *   5. R16 Glossary + Data Dictionary; Diagram Studio vẽ ERD từ DD có cấu trúc (nguồn "dictionary", không AI).
 *   6. R23 sáu liên kết: đứt ⇒ chỉ chỗ; sửa ⇒ 6/6; RTM có tóm tắt + sheet "Six links".
 *   7. R4/R25 mẫu Wiegers: điền trang (phiên bản mới, tạo khi chưa có); xuất .docx (đề mục + bảng) và .pdf.
 *   8. xlsx: Glossary, Data Dictionary, Features, Six links.  9. Registry (Ask AI + MCP).  10. Xoá dự án dọn sạch.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c4b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 4b: SWR302 hồ sơ Wiegers + sáu liên kết (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U, outsider: U, bot: U;
  let wsId = 0, pid = 0;

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U, path: string, method = 'GET', body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, { method, headers: { Authorization: `Bearer ${u.token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, type: res.headers.get('content-type'), disposition: res.headers.get('content-disposition'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const issue = async (title: string, typeKey: string, extra: Record<string, unknown> = {}) => {
    const r = await call(staff, 'POST', `/projects/${pid}/issues`, { title, typeKey, ...extra });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    return { number: r.data.number as number, id: r.data.id as number };
  };
  const docxParas = (buf: Buffer) => [...new AdmZip(buf).readAsText('word/document.xml').matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => [(/<w:pStyle w:val="([^"]+)"/.exec(m[0])?.[1] ?? ''), [...m[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')).join('')] as [string, string]);
  const docxText = (buf: Buffer) => new AdmZip(buf).readAsText('word/document.xml');

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, teacher, viewer, outsider] = await Promise.all(['owner', 'staff', 'teacher', 'viewer', 'outsider'].map((n) => mkUser(n)));
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('R27: dự án mẫu SWR302 = tuần 2→9, 8 epic deliverable, trang gói + 5 trang Wiegers, mô-đun, DoD sáu liên kết', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW4b ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'OMFS', name: 'Order Fulfillment', template: 'SWR302' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const m of ['stages', 'docs', 'raid', 'meetings', 'resources']) assert.equal(p.data.modules[m], true, m);
    for (const [u, role] of [[staff, 'MEMBER'], [teacher, 'TEACHER'], [viewer, 'VIEWER']] as const) {
      assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    }
    bot = await mkUser('bot', 'AGENT');
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: bot.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: bot.id, role: 'MEMBER' } });

    const stages = await prisma.workStage.findMany({ where: { projectId: pid }, orderBy: { n: 'asc' } });
    assert.deepEqual(stages.map((s) => s.slug), ['week-2', 'week-3', 'week-4', 'week-5', 'week-6', 'week-7', 'week-8', 'week-9']);
    const epics = await prisma.workIssue.findMany({ where: { projectId: pid, type: { key: 'EPIC' } }, orderBy: { number: 'asc' }, select: { title: true, stageId: true } });
    assert.equal(epics.length, 8);
    assert.match(epics[0].title, /^D1 — Vision & Scope/);
    assert.equal(epics[0].stageId, stages.find((s) => s.slug === 'week-4')!.id);
    const pages = await prisma.workPage.findMany({ where: { projectId: pid }, orderBy: { number: 'asc' }, select: { title: true, templateKey: true, contentText: true } });
    assert.deepEqual(pages.map((x) => x.templateKey), [null, 'swr-vision-scope', 'swr-use-cases', 'swr-business-rules', 'swr-data-dictionary', 'swr-srs']);
    assert.equal(pages[1].title, 'Vision and Scope Document for Order Fulfillment');
    assert.match(pages[0].contentText ?? '', /M1 Leader[\s\S]*R\/A/);
    const settings = (await prisma.workProject.findUniqueOrThrow({ where: { id: pid }, select: { settings: true } })).settings as any;
    assert.equal(settings.definitionOfDone.length, 6);
    assert.match(settings.definitionOfDone[0], /^Link 1: Every feature FE-n/);
    assert.ok(settings.modules.docs);
  });

  let ucOrder = 0, ucTrack = 0, req1 = 0, req2 = 0;
  it('R5: Feature FE-n tự tăng, trùng tên 409, liên kết UC + thẻ, quyền', async () => {
    const actor = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Fulfillment Manager', description: 'Runs the warehouse' })).data;
    await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Carrier System', kind: 'SYSTEM' });
    const br = (await call(staff, 'POST', `/projects/${pid}/srs/rules`, { name: 'Cut-off time', definition: 'Orders placed after 15:00 ship next day.', category: 'Constraint', status: 'APPROVED' })).data;
    assert.equal(br.key, 'BR-01');
    ucOrder = (await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { name: 'Place Order', feature: 'FE-1', primaryActorId: actor.id, description: 'Manager places an order', normalFlow: '1. Fulfillment Manager opens the Order screen.\n2. OMFS saves the Shipping Label and checks BR-01.', status: 'APPROVED', ruleNumbers: [1] })).data.number;
    assert.equal(ucOrder, 1);
    ucTrack = (await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { name: 'Track Parcel', primaryActorId: actor.id, description: 'Track', normalFlow: '1. OMFS shows the Tracking Number.', status: 'APPROVED' })).data.number;

    const f1 = await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'Order intake', description: 'Accept orders from shops', priority: 'HIGH' });
    assert.equal(f1.status, 201, JSON.stringify(f1.raw));
    assert.equal(f1.data.key, 'FE-1');
    const f2 = await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'Parcel tracking', priority: 'MEDIUM' });
    assert.equal(f2.data.key, 'FE-2');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'order INTAKE' })).status, 409);
    const f3 = await call(staff, 'POST', `/projects/${pid}/swr/features`, { name: 'Returns portal', scope: 'OUT', description: 'Customers return goods — not in 1.0' });
    assert.equal(f3.data.key, 'FE-3');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/swr/features`, { name: 'X' })).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/swr/features`)).status, 404);
    const v = await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v1.0', releaseDate: '2026-11-20' });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/swr/features/FE-1`, { versionId: v.data.id, rev: 0 })).status, 200);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/swr/features/1`, { name: 'Order intake', rev: 0 })).status, 409, 'khoá lạc quan');

    req1 = (await issue('The system shall accept CSV orders', 'REQUIREMENT')).number;
    req2 = (await issue('Shops can see ETA', 'REQUIREMENT')).number;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/features/FE-2/links`, { kind: 'UC', ref: `UC-0${ucTrack}` })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/features/FE-2/links`, { kind: 'ISSUE', ref: `OMFS-${req2}` })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/features/FE-2/links`, { kind: 'UC', ref: 'UC-99' })).status, 400);
    const list = (await call(viewer, 'GET', `/projects/${pid}/swr/features`)).data;
    const byKey = Object.fromEntries(list.features.map((f: any) => [f.key, f]));
    assert.deepEqual(byKey['FE-1'].useCases.map((u: any) => [u.key, u.manual]), [['UC-01', false]], 'UC.feature "FE-1" nối mềm');
    assert.equal(byKey['FE-1'].release, 'v1.0');
    assert.deepEqual(byKey['FE-2'].useCases.map((u: any) => [u.key, u.manual]), [['UC-02', true]]);
    assert.deepEqual(byKey['FE-2'].issues.map((i: any) => i.key), [`OMFS-${req2}`]);
    const svc = await import('../services/work/swr.service.js');
    await assert.rejects(svc.deleteFeature(bot.id, pid, 'FE-3'), /AI agent cannot delete features/);
    const byAgent = await svc.createFeature(bot.id, pid, { name: 'Agent idea' });
    await svc.deleteFeature(staff.id, pid, byAgent.key);
  });

  it('R6: phân loại + thuộc tính + vòng đời, có lịch sử; luồng sai 400; agent không đổi vòng đời', async () => {
    const r1 = await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${req1}`, { reqType: 'FUNCTIONAL', priority: 'HIGH', source: 'Interview 1 — Fulfillment Manager', rationale: 'Shops export CSV', stability: 'HIGH' });
    assert.equal(r1.status, 200, JSON.stringify(r1.raw));
    assert.equal(r1.data.lifecycle, 'PROPOSED');
    assert.equal(r1.data.reqVersion, 1);
    const r1b = await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${req1}`, { priority: 'MEDIUM', reqVersion: 1 });
    assert.equal(r1b.data.reqVersion, 2);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${req1}`, { priority: 'LOW', reqVersion: 1 })).status, 409);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${req2}`, { reqType: 'QUALITY', subtype: 'FAST' })).status, 400);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${req2}`, { reqType: 'FUNCTIONAL' })).status, 200);
    const perf = (await issue('Order list loads in under 2 seconds', 'REQUIREMENT')).number;
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${perf}`, { reqType: 'QUALITY', subtype: 'performance' })).data.subtype, 'PERFORMANCE');
    const story = (await issue('A story', 'STORY')).number;
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${story}`, { reqType: 'USER' })).code, 'WORK_NOT_REQUIREMENT');

    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/requirements/${req1}/lifecycle`, { to: 'VERIFIED' })).code, 'WORK_REQ_LIFECYCLE');
    const svc = await import('../services/work/swr.service.js');
    await assert.rejects(svc.setLifecycle(bot.id, pid, req1, 'APPROVED'), /AI agent cannot change the status/);
    await assert.rejects(svc.setLifecycle(bot.id, pid, req1, 'IMPLEMENTED'), /AI agent cannot change the status/);
    // Agent phân loại được (không phải quyết định); lịch sử ghi actorKind AGENT.
    await svc.setRequirementInfo(bot.id, pid, req2, { source: 'Agent read the brief' });
    assert.ok(await prisma.workHistory.count({ where: { issue: { projectId: pid, number: req2 }, actorKind: 'AGENT', field: 'Requirement source' } }));
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/swr/requirements/${req1}/lifecycle`, { to: 'APPROVED' })).status, 403);
    for (const to of ['APPROVED', 'IMPLEMENTED', 'VERIFIED']) {
      const r = await call(to === 'IMPLEMENTED' ? staff : teacher, 'POST', `/projects/${pid}/swr/requirements/${req1}/lifecycle`, { to, note: to === 'APPROVED' ? 'Agreed in review 2' : undefined });
      assert.equal(r.status, 200, `${to} ${JSON.stringify(r.raw)}`);
      assert.equal(r.data.lifecycle, to);
    }
    const h = (await call(viewer, 'GET', `/projects/${pid}/swr/requirements/${req1}/history`)).data;
    const statusRows = h.filter((x: any) => x.field === 'Requirement status').map((x: any) => `${x.from ?? '∅'}→${x.to}`);
    assert.deepEqual(statusRows.reverse(), ['∅→Proposed', 'Proposed→Approved', 'Approved→Implemented', 'Implemented→Verified']);
    assert.ok(h.some((x: any) => x.field === 'Requirement priority' && x.from === 'High' && x.to === 'Medium'));
    assert.ok(h.some((x: any) => x.field === 'Requirement status note' && x.to === 'Agreed in review 2'));
    // Lịch sử nằm trong Activity của thẻ (work_history).
    assert.ok(await prisma.workHistory.count({ where: { issue: { projectId: pid, number: req1 }, field: 'Requirement status' } }) >= 4);
    const list = (await call(viewer, 'GET', `/projects/${pid}/swr/requirements?type=FUNCTIONAL`)).data;
    assert.deepEqual(list.requirements.map((q: any) => q.number).sort(), [req1, req2].sort());
    assert.equal(list.counts.byType.QUALITY, 1);
    assert.equal(list.counts.byLifecycle.VERIFIED, 1);
  });

  it('R12: bảng ưu tiên — seed FE, chấm, trọng số (agent 403), xếp hạng, xlsx đúng mẫu', async () => {
    const seed = await call(staff, 'POST', `/projects/${pid}/swr/priority/seed`, { kind: 'FE' });
    assert.equal(seed.data.added, 2, 'FE-3 ngoài phạm vi không vào');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/priority/rows`, { target: { kind: 'FE', ref: 'FE-1' }, benefit: 9, penalty: 7, cost: 5, risk: 3 })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/priority/rows`, { target: { kind: 'FE', ref: 'FE-2' }, benefit: 2, penalty: 4, cost: 1, risk: 1 })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/priority/rows`, { target: { kind: 'UC', ref: 'UC-01' }, benefit: 10 })).status, 400);
    await assert.rejects((await import('../services/work/swr.service.js')).updateSettings(bot.id, pid, { weights: { benefit: 2 } }), /AI agent cannot change the prioritization weights/);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/settings`, { weights: { benefit: 2, risk: 0.5 } })).status, 200);
    const pr = (await call(viewer, 'GET', `/projects/${pid}/swr/priority`)).data;
    assert.deepEqual(pr.weights, { benefit: 2, penalty: 1, cost: 1, risk: 0.5 });
    assert.deepEqual(pr.ranked.map((r: any) => r.label), ['FE-2 Parcel tracking', 'FE-1 Order intake']);
    assert.ok(pr.candidates.some((c: any) => c.ref === 'UC-01'));
    const x = await download(staff, `/projects/${pid}/swr/export/priority.xlsx`);
    assert.equal(x.status, 200);
    assert.match(x.disposition ?? '', /OMFS_Requirements_Prioritization\.xlsx/);
    const sh = readXlsx(x.buf).find((s) => s.name === 'Prioritization')!;
    assert.equal(sh.text(1, 1), 'Relative Weights:');
    assert.equal(sh.text(1, 2), '2');
    assert.equal(sh.text(3, 10), 'Priority');
    assert.equal(sh.text(4, 1), 'FE-2 Parcel tracking');
    assert.equal(sh.text(6, 1), 'Totals');
    assert.match(new AdmZip(x.buf).readAsText('xl/worksheets/sheet2.xml'), /<f>E4\/\(G4\*\$F\$1\+I4\*\$H\$1\)<\/f>/);
  });

  it('R16: Glossary + Data Dictionary; Diagram Studio vẽ ERD từ DD có cấu trúc', async () => {
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/glossary`, { term: 'Fulfillment Center', definition: 'The warehouse that ships orders', aliases: ['FC', 'warehouse'] })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/glossary`, { term: 'fulfillment center', definition: 'dup' })).status, 409);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/glossary`, { term: 'Depot', definition: 'x', aliases: ['warehouse'] })).status, 201);
    const g = (await call(viewer, 'GET', `/projects/${pid}/swr/glossary`)).data;
    assert.deepEqual(g.clashes.map((c: any) => c.word), ['warehouse']);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/dictionary`, { name: 'Order', kind: 'STRUCTURE' })).status, 400);
    for (const e of [
      { name: 'Order', kind: 'STRUCTURE', description: 'an order from a shop', composition: 'Order ID + Order Date + 1:n{Order Line} + (Shipping Label)' },
      { name: 'Order ID', description: 'unique id', dataType: 'integer', length: '10', values: 'system-generated', isKey: true },
      { name: 'Order Date', dataType: 'DD/MM/YYYY', length: '10' },
      { name: 'Order Line', kind: 'STRUCTURE', composition: 'SKU + Quantity' },
      { name: 'Shipping Label', kind: 'STRUCTURE', composition: 'Tracking Number + Carrier' },
      { name: 'Tracking Number', dataType: 'alphanumeric', length: '20' },
    ]) assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/dictionary`, e)).status, 201, e.name);
    const dd = (await call(viewer, 'GET', `/projects/${pid}/swr/dictionary`)).data;
    assert.deepEqual(dd.undefinedComponents.map((x: any) => x.component).sort(), ['Carrier', 'Quantity', 'SKU']);
    assert.equal(dd.erd, 3);
    assert.deepEqual(dd.elements.find((e: any) => e.name === 'Shipping Label').usedIn, ['UC-01']);
    const gen = await call(staff, 'POST', `/projects/${pid}/diagrams/generate`, { type: 'ERD', source: 'dictionary' });
    assert.equal(gen.status, 201, JSON.stringify(gen.raw));
    const d = await prisma.workDiagram.findFirstOrThrow({ where: { projectId: pid, diagramType: 'ERD' }, include: { versions: true } });
    assert.match(d.versions[0].source, /erDiagram/);
    assert.match(d.versions[0].source, /Order_Line|Order Line/);
    assert.match(JSON.stringify(d.versions[0].origin), /structured Data Dictionary/);
  });

  it('R23: sáu liên kết — chỗ đứt; khai số đếm; bỏ qua danh từ; sửa ⇒ đạt; RTM có tóm tắt + sheet', async () => {
    // UC-02 nhắc một danh từ chưa có trong DD ⇒ liên kết #4 đứt.
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/use-cases/${ucTrack}`, { normalFlow: '1. OMFS shows the Tracking Number and the Delivery Slot.' })).status, 200);
    let s = (await call(viewer, 'GET', `/projects/${pid}/swr/six-links`)).data;
    const by = () => Object.fromEntries(s.links.map((l: any) => [l.key, l]));
    assert.equal(by().FE_UC.ok, true);
    assert.deepEqual(by().FR_TRACE.gaps.map((g: any) => g.ref), [`OMFS-${req1}`]);
    assert.ok(by().UC_BR.gaps.some((g: any) => g.ref === 'UC-02' && g.severity === 'warning'));
    assert.deepEqual(by().NOUN_DD.gaps.map((g: any) => [g.ref, g.detail]), [['Delivery Slot', 'used in UC-02 — not in the data dictionary']]);
    assert.equal(by().COUNTS.ok, false);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/settings`, { declaredCounts: { useCases: 3, screens: 0, interfacingSystems: 1 } })).status, 200);
    s = (await call(viewer, 'GET', `/projects/${pid}/swr/six-links`)).data;
    assert.deepEqual(by().COUNTS.gaps.map((g: any) => g.detail), ['estimation tool says 3, the documents contain 2']);
    // Sửa: FR gắn feature, số đếm đúng, danh từ không phải dữ liệu thì bỏ qua.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/features/FE-1/links`, { kind: 'ISSUE', ref: req1 })).status, 201);
    await call(staff, 'PUT', `/projects/${pid}/swr/settings`, { declaredCounts: { useCases: 2 } });
    for (const n of by().NOUN_DD.gaps.map((g: any) => g.ref)) await call(staff, 'PUT', `/projects/${pid}/swr/settings`, { ignoreNoun: n });
    s = (await call(viewer, 'GET', `/projects/${pid}/swr/six-links`)).data;
    assert.deepEqual(s.links.map((l: any) => [l.n, l.ok]), [[1, true], [2, true], [3, true], [4, true], [5, true], [6, true]], JSON.stringify(s.links.filter((l: any) => !l.ok)));
    assert.equal(s.passed, 6);
    const rtm = (await call(viewer, 'GET', `/projects/${pid}/rtm`)).data;
    assert.equal(rtm.sixLinks.passed, 6);
    const x = await download(staff, `/projects/${pid}/rtm/export.xlsx`);
    const six = readXlsx(x.buf).find((sh) => sh.name === 'Six links')!;
    assert.match(six.text(1, 1), /6\/6 passed/);
    assert.equal(six.text(4, 4), 'OK');
  });

  it('R4/R25: điền trang V&S (phiên bản mới), tạo trang khi chưa có, xuất .docx đúng đề mục + bảng, .pdf', async () => {
    await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'RISK', title: 'Carrier API changes', probability: 4, impact: 4, mitigation: 'Adapter layer' });
    await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'ASSUMPTION', title: 'Shops send CSV daily' });
    const biz = (await issue('Cut order handling time by 40%', 'REQUIREMENT')).number;
    await call(staff, 'PUT', `/projects/${pid}/swr/requirements/${biz}`, { reqType: 'BUSINESS', source: 'Brief §2' });
    const vs = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, templateKey: 'swr-vision-scope' } });
    const f = await call(staff, 'POST', `/projects/${pid}/swr/docs/vision-scope/fill`, {});
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    for (const s of ['objectives', 'risks', 'assumptions', 'features', 'initialRelease', 'laterReleases', 'limitations', 'stakeholders', 'revision history']) assert.ok(f.data.filled.includes(s), s);
    const v = await prisma.workPageVersion.findFirstOrThrow({ where: { pageId: vs.id }, orderBy: { n: 'desc' } });
    assert.match(v.note ?? '', /^Filled from project data/);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/swr/docs/vision-scope/fill`, {})).status, 403);

    // Trang SRS bị xoá ⇒ không create thì 404; create:true ⇒ tạo từ mẫu rồi điền (201).
    await prisma.workPage.updateMany({ where: { projectId: pid, templateKey: 'swr-srs' }, data: { deletedAt: new Date() } });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/docs/srs/fill`, {})).status, 404);
    const c = await call(staff, 'POST', `/projects/${pid}/swr/docs/srs/fill`, { create: true });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    assert.ok(c.data.filled.includes('system features') && c.data.filled.includes('traceability matrix'));
    assert.equal(c.data.page.title, 'Software Requirements Specification for Order Fulfillment');

    const vsx = await download(staff, `/projects/${pid}/swr/docs/vision-scope/export.docx`);
    assert.equal(vsx.status, 200);
    assert.match(vsx.disposition ?? '', /OMFS_Vision_and_Scope\.docx/);
    const paras = docxParas(vsx.buf);
    const h1 = paras.filter(([st]) => st === 'Heading1').map(([, t]) => t);
    assert.deepEqual(h1, ['Revision History', '1. Business Requirements', '2. Scope and Limitations', '3. Business Context']);
    const xml = docxText(vsx.buf);
    for (const s of ['FE-1', 'Order intake', 'RI-', 'Carrier API changes', 'AS-', 'BO-1', 'LI-1', 'Returns portal', 'Fulfillment Manager', 'v1.0']) assert.ok(xml.includes(s), s);
    assert.ok(!xml.includes('Guide:'), 'ghi chú hướng dẫn bị bỏ khi xuất');

    const ucx = await download(staff, `/projects/${pid}/swr/docs/use-cases/export.docx`);
    const ucParas = docxParas(ucx.buf).map(([, t]) => t);
    assert.ok(ucParas.includes('UC-01: Place Order'));
    assert.ok(!ucParas.includes('Use Case Field Guidance'), 'bản xuất bỏ phần hướng dẫn trường');
    for (const s of ['UC ID and Name:', 'Frequency of Use:', 'Other Information:', 'Assumptions:']) assert.ok(docxText(ucx.buf).includes(s), s);
    const dd = await download(staff, `/projects/${pid}/swr/docs/data-dictionary/export.docx`);
    assert.ok(docxText(dd.buf).includes('Composition or Data Type') && docxText(dd.buf).includes('Order ID'));
    const br = await download(staff, `/projects/${pid}/swr/docs/business-rules/export.docx`);
    assert.ok(docxText(br.buf).includes('BR-01') && docxText(br.buf).includes('Constraint'));
    const pdf = await download(staff, `/projects/${pid}/swr/docs/srs/export.pdf`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
    const pre = (await call(staff, 'GET', `/projects/${pid}/swr/docs/srs`)).data;
    assert.ok(JSON.stringify(pre.doc).includes('erDiagram'), 'SRS §4.1 có ERD Mermaid để client vẽ PNG');
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/swr/docs/srs`)).status, 404);
  });

  it('xlsx: Glossary · Data Dictionary (5 cột mẫu) · Features · Six links', async () => {
    const g = readXlsx((await download(staff, `/projects/${pid}/swr/export/glossary.xlsx`)).buf)[0];
    assert.equal(g.text(3, 1), 'Term');
    assert.equal(g.text(5, 1), 'Fulfillment Center');
    const dd = readXlsx((await download(staff, `/projects/${pid}/swr/export/dictionary.xlsx`)).buf);
    assert.deepEqual(dd.map((s) => s.name), ['Data Dictionary', 'Usage', 'Notation']);
    assert.deepEqual([1, 2, 3, 4, 5].map((c) => dd[0].text(3, c)), ['Data Element', 'Description', 'Composition or Data Type', 'Length', 'Values']);
    const fe = readXlsx((await download(staff, `/projects/${pid}/swr/export/features.xlsx`)).buf)[0];
    assert.equal(fe.text(4, 1), 'FE-1');
    assert.equal(fe.text(6, 4), 'Out of scope');
    const six = readXlsx((await download(viewer, `/projects/${pid}/swr/export/six-links.xlsx`)).buf)[0];
    assert.equal(six.name, 'Six links');
  });

  it('Registry: Ask AI đọc + áp lệnh mới; có trên MCP; agent không đổi vòng đời qua lệnh', async () => {
    const r = await import('../services/work/toolRegistry/index.js');
    const read = await r.runForPerson(viewer.id, pid, 'swr_six_links', {}, 'read');
    assert.match(read.text, /6\/6/);
    await assert.rejects(r.runForPerson(staff.id, pid, 'swr_feature_add', { name: 'X' }, 'read'), /propose it as an action/);
    const add = await r.runForPerson(staff.id, pid, 'swr_feature_add', { name: 'Carrier hand-off' }, 'apply');
    assert.equal((add.output as any).added, 'FE-4');
    const cls = await r.runForPerson(staff.id, pid, 'swr_requirement_classify', { issue: `OMFS-${req2}`, type: 'EXTERNAL_INTERFACE', category: 'SOFTWARE' }, 'apply');
    assert.equal((cls.output as any).category, 'SOFTWARE');
    const ps = await r.runForPerson(staff.id, pid, 'swr_priority_set', { target: 'FE-4', benefit: 5, penalty: 5, cost: 2, risk: 2 }, 'apply');
    assert.ok((ps.output as any).priority);
    const dd = await r.runForPerson(staff.id, pid, 'swr_dictionary_add', { name: 'Carrier', dataType: 'text', length: '40' }, 'apply');
    assert.equal((dd.output as any).kind, 'PRIMITIVE');
    const fill = await r.runForPerson(staff.id, pid, 'swr_doc_fill', { document: 'data-dictionary' }, 'apply');
    assert.ok((fill.output as any).filled.includes('data dictionary'));
    for (const n of ['swr_overview', 'swr_features', 'swr_requirements', 'swr_priority', 'swr_glossary', 'swr_dictionary', 'swr_six_links', 'swr_feature_add', 'swr_feature_link', 'swr_requirement_classify', 'swr_requirement_set_status', 'swr_priority_set', 'swr_glossary_add', 'swr_dictionary_add', 'swr_doc_fill']) {
      assert.ok(r.mcpCommands().some((t) => t.name === n), `${n} trên MCP`);
      assert.ok(r.askCommands().some((t) => t.name === n), `${n} trên Ask AI`);
    }
    const agentCtx = { userId: bot.id, agent: { userId: bot.id, workspaceId: wsId, projectIds: null } as any, scopes: ['read', 'write'], tokenId: 1, signal: new AbortController().signal };
    const ref = await r.projectRefOf(pid);
    const out = await r.runForAgent(agentCtx as any, ref, 'swr_requirement_set_status', { issue: req2, status: 'APPROVED' });
    assert.equal(out.ok, false);
    assert.match(out.text, /AI agent cannot change the status/);
  });

  it('xoá dự án ⇒ feature/liên kết/thuộc tính yêu cầu/ưu tiên/glossary/DD/cấu hình đi theo', async () => {
    const counts = async () => Promise.all([
      prisma.workFeature.count({ where: { projectId: pid } }), prisma.workFeatureLink.count({ where: { feature: { projectId: pid } } }),
      prisma.workRequirementInfo.count({ where: { projectId: pid } }), prisma.workPriorityRow.count({ where: { projectId: pid } }),
      prisma.workGlossaryTerm.count({ where: { projectId: pid } }), prisma.workDataElement.count({ where: { projectId: pid } }),
      prisma.workSwrSettings.count({ where: { projectId: pid } }),
    ]);
    assert.ok((await counts()).every((n) => n > 0), JSON.stringify(await counts()));
    await prisma.workProject.delete({ where: { id: pid } });
    assert.deepEqual(await counts(), [0, 0, 0, 0, 0, 0, 0]);
    const fk = await prisma.$queryRaw<Array<{ condeferrable: boolean; condeferred: boolean }>>`SELECT condeferrable, condeferred FROM pg_constraint WHERE conname = 'work_requirement_info_issue_id_fkey'`;
    assert.ok(fk[0]?.condeferrable && fk[0]?.condeferred);
  });
});
