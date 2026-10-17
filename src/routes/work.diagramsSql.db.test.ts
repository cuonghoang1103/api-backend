/**
 * CT Work — Database designer (sơ đồ định dạng SQL) qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.diagramsSql.db.test.ts
 *
 *   1. Tạo sơ đồ SQL từ setup.sql thật (NhaTroSV) ⇒ loại ERD, kiểm SQL của máy chủ (11 bảng, không lỗi); quyền như sơ đồ khác.
 *   2. SQL hỏng vẫn LƯU được (đang làm dở) nhưng KHÔNG duyệt được (422); sửa xong thì duyệt.
 *   3. Ảnh cho API/MCP: ảnh là Mermaid ERD sinh từ SQL — trình duyệt gửi lên đúng chuỗi đó ⇒ GET image.svg trả ảnh.
 *   4. Nhúng Docs @latest: trang nhận Mermaid ERD; sửa SQL ⇒ trang tự cập nhật.
 *   5. Nhập tệp .sql ⇒ sơ đồ SQL (hoặc Mermaid ERD khi chọn); tệp không có CREATE TABLE ⇒ 400.
 *   6. Lệnh registry: diagram_get (tóm tắt + kiểm thiết kế), diagram_sql_export (script PostgreSQL), diagram_sql_create,
 *      diagram_update {sql} giữ dòng meta; agent tạo ⇒ PROPOSED.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `dq${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };
const NHATRO = readFileSync(fileURLToPath(new URL('../services/work/sqlDesign/fixtures/nhatrosv.sql', import.meta.url)), 'utf8');

describe('CT Work — Database designer (sơ đồ SQL) — HTTP + DB thật', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, viewer: U, client: U, agent: U;
  let pid = 0;
  let pages: Array<{ number: number; templateKey: string | null }> = [];

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
  const D = (path = '') => `/projects/${pid}/diagrams${path}`;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, viewer, client] = await Promise.all(['owner', 'staff', 'viewer', 'client'].map((n) => mkUser(n)));
    agent = await mkUser('bot', 'AGENT');
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

  it('dựng: không gian + dự án CAPSTONE + vai', async () => {
    const wsId = (await call(owner, 'POST', '/workspaces', { name: `DB designer ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, viewer.email, client.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'NTS', name: 'NhaTroSV', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[staff, 'MEMBER'], [viewer, 'VIEWER']] as const) assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    await prisma.workProjectMember.deleteMany({ where: { projectId: pid, userId: client.id } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: client.id, role: 'CLIENT' } });
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: agent.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agent.id, role: 'MEMBER' } });
    pages = await prisma.workPage.findMany({ where: { projectId: pid }, select: { number: true, templateKey: true } });
  });

  let dn = 0;
  it('tạo sơ đồ SQL từ setup.sql thật ⇒ ERD, máy chủ đọc đủ 11 bảng; quyền', async () => {
    const c = await call(staff, 'POST', D(), { format: 'SQL', title: 'NhaTroSV database', source: `${NHATRO}\n-- ctw:meta {"dialect":"sqlserver"}\n` });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    dn = c.data.number;
    assert.equal(c.data.format, 'SQL');
    assert.equal(c.data.type, 'ERD');
    assert.equal(c.data.lint.kind, 'sql');
    assert.equal(c.data.lint.ok, true, JSON.stringify(c.data.lint.errors));
    assert.equal(c.data.lint.tables, 11);
    assert.match(c.data.source, /-- ctw:meta \{"dialect":"sqlserver"\}/);
    assert.equal((await call(viewer, 'GET', D(`/${dn}`))).status, 200);
    assert.equal((await call(viewer, 'POST', D(), { format: 'SQL', source: 'CREATE TABLE A (id INT);' })).status, 403);
    assert.equal((await call(client, 'GET', D(`/${dn}`))).status, 403);
    assert.equal((await call(staff, 'POST', D(), { format: 'SQL', source: '   ' })).status, 400);
  });

  it('SQL hỏng: lưu được (đang gõ dở) nhưng không duyệt được; sửa xong thì duyệt', async () => {
    const cur = await call(staff, 'GET', D(`/${dn}`));
    const broken = cur.data.source.replace('roomCode     VARCHAR(10)   NOT NULL,', 'roomCode     VARCHAR(10)   NOT NULL');
    assert.notEqual(broken, cur.data.source);
    const u = await call(staff, 'PATCH', D(`/${dn}`), { source: broken, rev: cur.data.rev });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal(u.data.lint.ok, false);
    assert.ok(u.data.lint.errors.some((e: { message: string }) => /comma/i.test(e.message)));
    const ap = await call(staff, 'POST', D(`/${dn}/approve`), { parsedOk: true });
    assert.equal(ap.status, 422, 'parsedOk của trình duyệt không vượt được kiểm SQL của máy chủ');
    const fixed = await call(staff, 'PATCH', D(`/${dn}`), { source: cur.data.source, rev: u.data.rev });
    assert.equal(fixed.data.lint.ok, true);
    const ok = await call(staff, 'POST', D(`/${dn}/approve`), {});
    assert.equal(ok.status, 200, JSON.stringify(ok.raw));
    assert.equal(ok.data.status, 'APPROVED');
  });

  it('ảnh cho API/MCP = Mermaid ERD sinh từ SQL (trình duyệt gửi đúng chuỗi đó)', async () => {
    const { sqlToMermaid } = await import('../services/work/sqlDesign/index.js');
    const miss = await call(staff, 'GET', D(`/${dn}/image.svg`));
    assert.equal(miss.status, 404);
    assert.equal(miss.code, 'WORK_DIAGRAM_NOT_RENDERED');
    const cur = await call(staff, 'GET', D(`/${dn}`));
    const mm = sqlToMermaid(cur.data.source)!;
    assert.match(mm, /^erDiagram/);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';
    assert.equal((await call(staff, 'POST', `/projects/${pid}/diagram-renders`, { source: mm, svg })).status, 201);
    const res = await fetch(`${base}/api/v1/work${D(`/${dn}/image.svg`)}`, { headers: { Authorization: `Bearer ${staff.token}` } });
    assert.equal(res.status, 200);
    assert.match(await res.text(), /<svg/);
  });

  it('nhúng Docs @latest: trang nhận Mermaid ERD; sửa SQL ⇒ trang tự cập nhật', async () => {
    const page = pages.find((p) => p.templateKey === 'fpt-report4-sdd')?.number ?? pages[0].number;
    const em = await call(staff, 'POST', D(`/${dn}/embed`), { page, mode: 'latest' });
    assert.equal(em.status, 200, JSON.stringify(em.raw));
    let pg = await call(staff, 'GET', `/projects/${pid}/pages/${page}`);
    assert.match(JSON.stringify(pg.data.contentJson), /erDiagram/);
    assert.match(JSON.stringify(pg.data.contentJson), /MaintenanceRequest/);
    const cur = await call(staff, 'GET', D(`/${dn}`));
    const more = cur.data.source.replace(/\n-- ctw:meta/, '\nCREATE TABLE AuditLog (logId INT IDENTITY(1,1) CONSTRAINT PK_AuditLog PRIMARY KEY, note NVARCHAR(200) NULL);\n-- ctw:meta');
    assert.equal((await call(staff, 'PATCH', D(`/${dn}`), { source: more, rev: cur.data.rev })).status, 200);
    pg = await call(staff, 'GET', `/projects/${pid}/pages/${page}`);
    assert.match(JSON.stringify(pg.data.contentJson), /AuditLog/);
  });

  it('nhập tệp .sql ⇒ sơ đồ SQL / Mermaid ERD; không có CREATE TABLE ⇒ 400', async () => {
    const i = await call(staff, 'POST', D('/import'), { fileName: 'shop-schema.sql', content: 'CREATE TABLE `p` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB;\nINSERT INTO p VALUES (1);' });
    assert.equal(i.status, 201, JSON.stringify(i.raw));
    assert.equal(i.data.format, 'SQL');
    assert.equal(i.data.title, 'shop schema');
    assert.match(i.data.source, /"dialect":"mysql"/);
    assert.ok(i.data.fidelity.notes.some((n: string) => /1 table/.test(n) && /INSERT/.test(n)));
    const m = await call(staff, 'POST', D('/import'), { fileName: 'x.sql', content: 'CREATE TABLE a (id int primary key);', to: 'mermaid' });
    assert.equal(m.data.format, 'MERMAID');
    assert.match(m.data.source, /^erDiagram/);
    assert.equal((await call(staff, 'POST', D('/import'), { fileName: 'q.sql', content: 'SELECT 1;' })).status, 400);
  });

  it('lệnh registry: diagram_get tóm tắt, diagram_sql_export, diagram_sql_create, diagram_update {sql}; agent ⇒ PROPOSED', async () => {
    const r = await import('../services/work/toolRegistry/index.js');
    const one = await r.runForPerson(viewer.id, pid, 'diagram_get', { diagram: `D-${dn}` }, 'read');
    assert.match(one.text, /"dialect": "sqlserver"/);
    assert.match(one.text, /FK_NOT_INDEXED/);
    assert.doesNotMatch(one.text, /ctw:meta/);
    const ex = await r.runForPerson(viewer.id, pid, 'diagram_sql_export', { diagram: dn, target: 'postgres', naming: 'snake' }, 'read');
    assert.match(ex.text, /CREATE TABLE rental_request/);
    assert.match(ex.text, /GENERATED ALWAYS AS IDENTITY/);
    await assert.rejects(r.runForPerson(staff.id, pid, 'diagram_sql_create', { title: 'x', sql: 'CREATE TABLE a (id int);' }, 'read'), /propose it as an action/);
    const cr = await r.runForPerson(staff.id, pid, 'diagram_sql_create', { title: 'Mini', sql: 'CREATE TABLE a (id int PRIMARY KEY);' }, 'apply');
    assert.match(cr.text, /D-\d+/);
    const mini = (await prisma.workDiagram.findFirst({ where: { projectId: pid, title: 'Mini' } }))!;
    const up = await r.runForPerson(staff.id, pid, 'diagram_update', { diagram: mini.number, sql: 'CREATE TABLE a (id int PRIMARY KEY, name nvarchar(50));' }, 'apply');
    assert.match(up.text, /D-/);
    const after = await call(staff, 'GET', D(`/${mini.number}`));
    assert.match(after.data.source, /name nvarchar\(50\)/);
    assert.match(after.data.source, /-- ctw:meta \{"dialect":"/, 'giữ dòng meta (hệ quản trị) khi agent/AI gửi SQL mới');
    const dg = await import('../services/work/diagrams.service.js');
    const ag = await dg.createDiagram(agent.id, pid, { format: 'SQL', title: 'Agent schema', source: 'CREATE TABLE z (id INT PRIMARY KEY);' });
    assert.equal(ag.status, 'PROPOSED');
    assert.equal(ag.type, 'ERD');
  });
});
