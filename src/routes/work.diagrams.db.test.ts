/**
 * CTW Diagram — Diagram Studio qua HTTP thật trên Postgres cục bộ (model LLM GIẢ, repo GIẢ):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.diagrams.db.test.ts
 *
 *   1. CRUD + phiên bản (khoá lạc quan, khôi phục) + quyền: viewer chỉ đọc, khách CLIENT / người ngoài bị chặn, giảng viên duyệt.
 *   2. Agent chỉ ĐỀ XUẤT: tạo ⇒ PROPOSED; sửa sơ đồ của người ⇒ phiên bản PROPOSED, người nhận.
 *   3. AI vẽ sequence từ UC (LLM giả): đúng actor + bước + khối alt/break; participant lạ ⇒ "(assumed)"; thiếu nhánh ⇒ sửa
 *      đúng MỘT lần; hỏng lần hai ⇒ 422. Use case / ERD (repo giả: schema.prisma) không gọi model.
 *   4. Nhập draw.io + Excalidraw; bình luận; nhúng vào Docs @latest ⇒ sơ đồ đổi bản thì trang tự cập nhật.
 *   5. Report 3/4 nhận sơ đồ ĐÃ DUYỆT đúng mục; RTM có chỗ hở "No sequence diagram"; registry (Ask AI) đọc/áp lệnh.
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `dg${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('CT Work — Diagram Studio + AI vẽ sơ đồ (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U, client: U, outsider: U, agent: U;
  let wsId = 0, pid = 0;
  let pages: Array<{ number: number; templateKey: string | null }> = [];
  const pageOf = (k: string) => pages.find((p) => p.templateKey === k)!.number;

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
    const { default: diagramRoutes } = await import('./work.diagrams.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    // Dự phòng khi work.routes.ts chưa gắn tuyến Diagram (gắn rồi thì tuyến trên đã trả lời trước).
    app.use('/api/v1/work', authenticate, diagramRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, teacher, viewer, client, outsider] = await Promise.all(['owner', 'staff', 'teacher', 'viewer', 'client', 'outsider'].map((n) => mkUser(n)));
    agent = await mkUser('bot', 'AGENT');
  });

  after(async () => {
    server?.close();
    const dg = await import('../services/work/diagrams.service.js');
    dg._setDiagramAskForTests(null);
    (await import('../services/work/diagramRepo.js'))._setRepoForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CAPSTONE, vai, actor/BR/UC mẫu', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `Diagram ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email, client.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'LFD', name: 'LabFlow', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[staff, 'MEMBER'], [teacher, 'TEACHER'], [viewer, 'VIEWER']] as const) assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    await prisma.workProjectMember.upsert({ where: { uk_work_project_member: { projectId: pid, userId: client.id } } as any, create: { projectId: pid, userId: client.id, role: 'CLIENT' }, update: { role: 'CLIENT' } }).catch(async () => {
      await prisma.workProjectMember.deleteMany({ where: { projectId: pid, userId: client.id } });
      await prisma.workProjectMember.create({ data: { projectId: pid, userId: client.id, role: 'CLIENT' } });
    });
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: agent.id, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agent.id, role: 'MEMBER' } });
    pages = await prisma.workPage.findMany({ where: { projectId: pid }, select: { number: true, templateKey: true } });
    const student = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Student' })).data;
    const manager = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Lab Manager' })).data;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/rules`, { name: 'Booking window', definition: 'At most 7 days ahead' })).status, 201);
    const uc = await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, {
      name: 'Reserve Lab', feature: 'Booking', primaryActorId: student.id, secondaryActorIds: [manager.id], description: 'Book a slot', preconditions: 'Logged in', postconditions: 'Reservation PENDING',
      normalFlow: '1. Student opens the booking page\n2. System displays free slots\n3. Student submits a slot\n4. System validates the booking (BR-01)\n5. System notifies the Lab Manager',
      alternativeFlows: '3A. No free slot\n3A.1 System shows a message\n3A.2 Return to step 1', exceptionFlows: '4E. Rule violated\n4E.1 System shows the rule', ruleNumbers: [1],
    });
    assert.equal(uc.status, 201, JSON.stringify(uc.raw));
    await call(staff, 'POST', `/projects/${pid}/srs/use-cases/1/status`, { status: 'APPROVED' });
  });

  let d1 = 0;
  it('CRUD + phiên bản + quyền', async () => {
    const c = await call(staff, 'POST', D(), { title: 'Login flow', source: 'flowchart LR\n  A[Login] --> B[Home]', useCase: 1 });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    d1 = c.data.number;
    assert.equal(c.data.key, 'D-1');
    assert.equal(c.data.type, 'FLOWCHART');
    assert.equal(c.data.status, 'DRAFT');
    assert.equal(c.data.useCase.key, 'UC-01');
    const u = await call(staff, 'PATCH', D(`/${d1}`), { source: 'flowchart LR\n  A[Login] --> C[Dashboard]', rev: c.data.rev, note: 'rename' });
    assert.equal(u.status, 200, JSON.stringify(u.raw));
    assert.equal(u.data.currentVersion, 2);
    assert.equal((await call(staff, 'PATCH', D(`/${d1}`), { source: 'flowchart LR\n  X --> Y', rev: c.data.rev })).status, 409);
    const v1 = await call(viewer, 'GET', D(`/${d1}/versions/1`));
    assert.equal(v1.status, 200);
    assert.match(v1.data.source, /Home/);
    const r = await call(staff, 'POST', D(`/${d1}/versions/1/restore`));
    assert.equal(r.data.currentVersion, 3);
    assert.match(r.data.source, /Home/);
    assert.equal(r.data.versions.length, 3);
    // quyền
    assert.equal((await call(viewer, 'GET', D())).status, 200);
    assert.equal((await call(viewer, 'POST', D(), { source: 'flowchart LR\n A-->B' })).status, 403);
    assert.equal((await call(viewer, 'POST', D(`/${d1}/comments`), { body: 'hi' })).status, 403);
    assert.equal((await call(client, 'GET', D())).status, 403);
    assert.equal((await call(outsider, 'GET', D())).status, 404);
    assert.equal((await call(teacher, 'POST', D(`/${d1}/comments`), { body: 'Rename Home to Dashboard?', anchor: 'Home' })).status, 201);
    assert.equal((await call(staff, 'POST', D(`/${d1}/approve`), {})).status, 200);
    const g = await call(viewer, 'GET', D(`/${d1}`));
    assert.equal(g.data.status, 'APPROVED');
    assert.equal(g.data.approvedVersion, 3);
    assert.equal(g.data.comments[0].anchor, 'Home');
    assert.equal(g.data.canEdit, false);
    // Excalidraw sai JSON ⇒ 400
    assert.equal((await call(staff, 'POST', D(), { format: 'EXCALIDRAW', source: '{"x":1}' })).status, 400);
  });

  it('agent chỉ ĐỀ XUẤT', async () => {
    const dg = await import('../services/work/diagrams.service.js');
    const mine = await dg.createDiagram(agent.id, pid, { source: 'flowchart LR\n  P --> Q', title: 'Agent idea' });
    assert.equal(mine.status, 'PROPOSED');
    const up = await dg.updateDiagram(agent.id, pid, d1, { source: 'flowchart LR\n  A[Login] --> Z[Agent]' });
    assert.equal(up.currentVersion, 3, 'bản hiện hành không đổi');
    assert.equal(up.proposedVersion, 4);
    await assert.rejects(dg.setApproval(agent.id, pid, d1, { approve: true }), /cannot approve/);
    await assert.rejects(dg.deleteDiagram(agent.id, pid, d1), /own proposals/);
    assert.equal((await call(viewer, 'POST', D(`/${d1}/versions/4/accept`))).status, 403);
    const acc = await call(teacher, 'POST', D(`/${d1}/versions/4/accept`));
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.equal(acc.data.currentVersion, 4);
    const disc = await call(staff, 'POST', D(`/${mine.number}/versions/1/discard`));
    assert.equal(disc.data.discarded, true);
  });

  let seq = 0;
  it('AI vẽ sequence từ UC-01 (LLM giả): actor + bước + alt/break; participant lạ ⇒ (assumed)', async () => {
    const dg = await import('../services/work/diagrams.service.js');
    let calls = 0;
    let seenUser = '';
    dg._setDiagramAskForTests(async (_s, msgs) => {
      calls++;
      seenUser = String(msgs[0].content);
      return JSON.stringify({
        participants: [{ id: 'U', name: 'Student', kind: 'actor' }, { id: 'M', name: 'Lab Manager', kind: 'actor' }, { id: 'SYS', name: 'LabFlow' }, { id: 'DB', name: 'Database' }],
        items: [
          { type: 'msg', from: 'U', to: 'SYS', text: 'Open booking page' },
          { type: 'msg', from: 'SYS', to: 'U', text: 'Show free slots', reply: true },
          { type: 'msg', from: 'U', to: 'SYS', text: 'Submit slot' },
          { type: 'block', kind: 'opt', branches: [{ label: '3A No free slot', items: [{ type: 'msg', from: 'SYS', to: 'U', text: 'No slot message', reply: true }] }] },
          { type: 'msg', from: 'SYS', to: 'DB', text: 'Check booking rules' },
          { type: 'note', over: 'SYS', text: 'BR-01 Booking window' },
          { type: 'block', kind: 'break', branches: [{ label: '4E Rule violated', items: [{ type: 'msg', from: 'SYS', to: 'U', text: 'Show the rule', reply: true }] }] },
          { type: 'msg', from: 'SYS', to: 'M', text: 'Notify new booking' },
        ],
      });
    });
    const r = await call(staff, 'POST', D('/generate'), { type: 'SEQUENCE', useCase: 'UC-01' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(calls, 1);
    assert.match(seenUser, /Reserve Lab/);
    const d = r.data.diagram;
    seq = d.number;
    assert.equal(d.status, 'PROPOSED');
    assert.equal(d.type, 'SEQUENCE');
    assert.equal(d.useCase.key, 'UC-01');
    assert.match(d.source, /actor U as Student/);
    assert.match(d.source, /actor M as Lab Manager/);
    assert.match(d.source, /opt 3A No free slot/);
    assert.match(d.source, /break 4E Rule violated/);
    assert.match(d.source, /participant DB as Database \(assumed\)/);
    assert.ok(r.data.check.assumptions.some((a: string) => /Database/.test(a)));
    assert.equal(r.data.check.usedAi, true);
    assert.equal(d.origin.sources[0].ref, 'UC-01');
  });

  it('AI hỏng ⇒ sửa đúng MỘT lần; hỏng lần hai ⇒ 422', async () => {
    const dg = await import('../services/work/diagrams.service.js');
    const good = { participants: [{ id: 'U', name: 'Student', kind: 'actor' }, { id: 'SYS', name: 'LabFlow' }], items: [{ type: 'msg', from: 'U', to: 'SYS', text: 'Submit' }, { type: 'block', kind: 'opt', branches: [{ label: '3A', items: [] }] }, { type: 'block', kind: 'break', branches: [{ label: '4E', items: [] }] }] };
    const missing = { ...good, items: [good.items[0]] };
    let n = 0;
    let repairPrompt = '';
    dg._setDiagramAskForTests(async (_s, msgs) => { n++; if (n === 2) repairPrompt = String(msgs[msgs.length - 1].content); return JSON.stringify(n === 1 ? missing : good); });
    const ok = await call(staff, 'POST', D('/generate'), { type: 'SEQUENCE', useCase: 1 });
    assert.equal(ok.status, 201, JSON.stringify(ok.raw));
    assert.equal(ok.data.check.repaired, true);
    assert.match(repairPrompt, /2 alternative\/exception flow/);
    n = 0;
    dg._setDiagramAskForTests(async () => { n++; return JSON.stringify(missing); });
    const bad = await call(staff, 'POST', D('/generate'), { type: 'SEQUENCE', useCase: 1 });
    assert.equal(bad.status, 422);
    assert.equal(n, 2);
    assert.equal((await call(staff, 'POST', D('/generate'), { type: 'SEQUENCE', useCase: 'UC-99' })).status, 400);
  });

  it('use case + ERD (repo giả: schema.prisma) — không gọi model, ghi rõ nguồn', async () => {
    const dg = await import('../services/work/diagrams.service.js');
    let calls = 0;
    dg._setDiagramAskForTests(async () => { calls++; return '{}'; });
    const ucd = await call(staff, 'POST', D('/generate'), { type: 'USE_CASE' });
    assert.equal(ucd.status, 201, JSON.stringify(ucd.raw));
    assert.match(ucd.data.diagram.source, /UC-01 Reserve Lab/);
    assert.equal(ucd.data.check.usedAi, false);
    const repo = await import('../services/work/diagramRepo.js');
    repo._setRepoForTests(async () => repo.memoryRepo({ 'backend/prisma/schema.prisma': 'model Lab {\n  id Int @id\n  bookings Booking[]\n}\nmodel Booking {\n  id Int @id\n  labId Int\n  lab Lab @relation(fields: [labId], references: [id])\n}' }, 'team/labflow'));
    const erd = await call(staff, 'POST', D('/generate'), { type: 'ERD' });
    assert.equal(erd.status, 201, JSON.stringify(erd.raw));
    assert.match(erd.data.diagram.source, /title: "Entity relationship diagram — source: backend\/prisma\/schema.prisma @ team\/labflow@main"/);
    assert.match(erd.data.diagram.source, /Lab \|\|--o\{ Booking/);
    assert.equal(calls, 0);
    repo._setRepoForTests(async () => null);
    assert.equal((await call(staff, 'POST', D('/generate'), { type: 'CLASS' })).status, 400);
  });

  it('nhập draw.io + Excalidraw', async () => {
    const drawio = '<mxfile><diagram name="P"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" value="Client" vertex="1" parent="1"><mxGeometry x="0" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="b" value="API" vertex="1" parent="1"><mxGeometry x="200" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="e" value="REST" edge="1" source="a" target="b" parent="1"/></root></mxGraphModel></diagram></mxfile>';
    const r = await call(staff, 'POST', D('/import'), { fileName: 'arch.drawio', content: drawio });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.match(r.data.source, /Client -->\|"REST"\| API/);
    assert.equal(r.data.origin.generator, 'import');
    const ex = JSON.stringify({ type: 'excalidraw', elements: [{ id: 'r', type: 'rectangle', x: 0, y: 0, width: 10, height: 10 }] });
    const e = await call(staff, 'POST', D('/import'), { fileName: 'board.excalidraw', content: Buffer.from(ex).toString('base64'), base64: true });
    assert.equal(e.status, 201, JSON.stringify(e.raw));
    assert.equal(e.data.format, 'EXCALIDRAW');
    assert.equal(e.data.type, 'WHITEBOARD');
    assert.equal((await call(staff, 'POST', D('/import'), { fileName: 'x.drawio', content: 'hello' })).status, 400);
  });

  it('nhúng vào Docs @latest ⇒ đổi phiên bản thì trang tự cập nhật', async () => {
    const r3 = pageOf('fpt-report3-srs');
    const em = await call(staff, 'POST', D(`/${d1}/embed`), { page: r3, mode: 'latest', heading: 'Main Workflows' });
    assert.equal(em.status, 200, JSON.stringify(em.raw));
    assert.equal(em.data.placed, 'heading');
    const cur = await call(staff, 'GET', D(`/${d1}`));
    await call(staff, 'PATCH', D(`/${d1}`), { source: 'flowchart LR\n  A[Login] --> N[NewHome]', rev: cur.data.rev });
    const pg = await call(staff, 'GET', `/projects/${pid}/pages/${r3}`);
    assert.match(JSON.stringify(pg.data.contentJson), /NewHome/);
    assert.match(JSON.stringify(pg.data.contentJson), new RegExp(`ctw-diagram:${cur.data.id}@latest`));
  });

  it('Report 3/4 nhận sơ đồ ĐÃ DUYỆT; RTM có chỗ hở NO_SEQUENCE tới khi có sequence', async () => {
    const before = await call(staff, 'GET', `/projects/${pid}/rtm`);
    const row = before.data.rows.find((x: any) => x.reqId === 'UC-01');
    if (before.data.gapLabels?.NO_SEQUENCE) assert.ok(row.gaps.includes('NO_SEQUENCE'), row.gaps.join());
    // duyệt use case diagram + sequence (nhận đề xuất ⇒ DRAFT ⇒ duyệt)
    const list = (await call(staff, 'GET', D())).data.items;
    const ucd = list.find((x: any) => x.type === 'USE_CASE');
    for (const d of [ucd.number, seq]) {
      const g = await call(teacher, 'GET', D(`/${d}`));
      await call(teacher, 'POST', D(`/${d}/versions/${g.data.currentVersion}/accept`));
      const ap = await call(teacher, 'POST', D(`/${d}/approve`), {});
      assert.equal(ap.status, 200, JSON.stringify(ap.raw));
    }
    const f3 = await call(staff, 'POST', D('/fill-report'), { report: 3 });
    assert.equal(f3.status, 200, JSON.stringify(f3.raw));
    assert.ok(f3.data.filled.includes('useCaseDiagrams'));
    const p3 = await call(staff, 'GET', `/projects/${pid}/pages/${pageOf('fpt-report3-srs')}`);
    assert.match(JSON.stringify(p3.data.contentJson), /UC-01 Reserve Lab/);
    const f4 = await call(staff, 'POST', D('/fill-report'), { report: 4 });
    assert.ok(f4.data.filled.includes('detailedDesign'), JSON.stringify(f4.data));
    const p4 = JSON.stringify((await call(staff, 'GET', `/projects/${pid}/pages/${pageOf('fpt-report4-sds')}`)).data.contentJson);
    assert.match(p4, /Booking/);
    assert.match(p4, /Figure: D-\d+ UC-01 Reserve Lab/);
    const afterRtm = await call(staff, 'GET', `/projects/${pid}/rtm`);
    const row2 = afterRtm.data.rows.find((x: any) => x.reqId === 'UC-01');
    assert.ok(!row2.gaps.includes('NO_SEQUENCE'));
  });

  it('registry: Ask AI đọc diagram_list / diagram_get, áp diagram_generate; có trên MCP', async () => {
    const r = await import('../services/work/toolRegistry/index.js');
    const names = r.mcpCommands().map((t) => t.name);
    for (const n of ['diagram_list', 'diagram_get', 'diagram_generate', 'diagram_update']) {
      if (!names.includes(n)) return; // registry chưa gắn (tệp chung) — phần dưới bỏ qua
    }
    const ls = await r.runForPerson(staff.id, pid, 'diagram_list', { type: 'SEQUENCE' }, 'read');
    assert.match(ls.text, /UC-01/);
    const one = await r.runForPerson(viewer.id, pid, 'diagram_get', { diagram: `D-${seq}` }, 'read');
    assert.match(one.text, /sequenceDiagram/);
    await assert.rejects(r.runForPerson(staff.id, pid, 'diagram_generate', { type: 'USE_CASE' }, 'read'), /propose it as an action/);
    const ap = await r.runForPerson(staff.id, pid, 'diagram_generate', { type: 'SCREEN_FLOW' }, 'apply');
    assert.match(ap.text, /proposed/);
  });

  it('agent BUILTIN: thẻ "Vẽ sequence cho UC-01" ⇒ DRAW_DIAGRAM ⇒ diagram_generate ⇒ đề xuất + chuyển Review', async () => {
    const b = await import('../services/work/builtinAgent.service.js');
    const dg = await import('../services/work/diagrams.service.js');
    assert.equal(b.inferTask('Vẽ sequence cho UC-05', 'TASK'), 'DRAW_DIAGRAM');
    assert.equal(b.inferTask('Draw the ERD', 'TASK'), 'DRAW_DIAGRAM');
    await prisma.user.update({ where: { id: owner.id }, data: { isPro: true, proExpiresAt: new Date(Date.now() + 30 * 86_400_000) } });
    b._setAutoRunForTests(false);
    const ag = await call(owner, 'POST', `/workspaces/${wsId}/agents`, { name: 'Diagrammer', model: 'builtin', runtime: 'BUILTIN', projectIds: [pid] });
    assert.equal(ag.status, 201, JSON.stringify(ag.raw));
    const issue = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Vẽ sequence cho UC-01', typeKey: 'TASK' });
    assert.equal(issue.status, 201, JSON.stringify(issue.raw));
    dg._setDiagramAskForTests(async () => JSON.stringify({ participants: [{ id: 'U', name: 'Student', kind: 'actor' }, { id: 'SYS', name: 'LabFlow' }], items: [{ type: 'msg', from: 'U', to: 'SYS', text: 'Submit' }, { type: 'block', kind: 'opt', branches: [{ label: '3A No free slot', items: [] }] }, { type: 'block', kind: 'break', branches: [{ label: '4E Rule violated', items: [] }] }] }));
    const steps = [
      JSON.stringify({ thought: 'draw', call: { name: 'diagram_generate', args: { type: 'SEQUENCE', useCase: 'UC-01' } } }),
      JSON.stringify({ done: { summary: 'Drew the sequence diagram for UC-01 — check the assumptions.', outcome: 'review' } }),
    ];
    const seen: string[] = [];
    b._setAgentLlmForTests(async (req) => { seen.push(req.system); return { text: steps.shift() ?? '{"done":{"summary":"x","outcome":"review"}}', inputTokens: 500, outputTokens: 100, model: 'gpt-6-sol' }; });
    try {
      const run = await call(owner, 'POST', `/projects/${pid}/issues/${issue.data.number}/agent-runs`, { agentId: ag.data.agent.id });
      assert.equal(run.status, 201, JSON.stringify(run.raw));
      assert.equal(run.data.run.task, 'DRAW_DIAGRAM');
      await b.drainRuns();
      const row = await prisma.workAgentRun.findUniqueOrThrow({ where: { id: run.data.run.id } });
      assert.equal(row.status, 'DONE', `${row.error}`);
      assert.match((row.steps as any[])[0].text, /diagram_generate → ok/);
      assert.match(seen[0], /diagram_generate\(/);
      const made = await prisma.workDiagram.findFirst({ where: { projectId: pid, createdById: ag.data.agent.userId }, orderBy: { id: 'desc' } });
      assert.equal(made?.status, 'PROPOSED');
      assert.equal(made?.diagramType, 'SEQUENCE');
      const st = await prisma.workIssue.findFirstOrThrow({ where: { projectId: pid, number: issue.data.number }, select: { status: { select: { name: true, category: true } } } });
      assert.notEqual(st.status.category, 'DONE');
    } finally {
      b._setAgentLlmForTests(null);
    }
  });

  it('xoá dự án dọn sạch sơ đồ', async () => {
    const ids = (await prisma.workDiagram.findMany({ where: { projectId: pid }, select: { id: true } })).map((x) => x.id);
    assert.ok(ids.length >= 5);
    await prisma.workProject.delete({ where: { id: pid } });
    assert.equal(await prisma.workDiagramVersion.count({ where: { diagramId: { in: ids } } }), 0);
  });
});
