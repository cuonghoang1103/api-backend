/**
 * dm5 G2 (27/11/2026) — hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.dm5b.db.test.ts
 *
 *   1. B9 sổ System Messages: SM-01 tự tăng, UC dùng, quyền (viewer 403, agent ⇒ PROPOSED, agent không xoá cái người viết),
 *      khoá lạc quan, mã được nhắc mà không có; six links báo SM_UNKNOWN + 3 luật lint UC (B8).
 *   2. B10 Report 3: điền 4.2 (NFR) + 5.1 (BR theo nhóm) + 5.2 (SM) vào trang thật; bản .docx có bảng.
 *   3. B16/B17 Report 4: sơ đồ SQL LabFlow 15 bảng ⇒ 15 bảng 7 cột trong §1.3; repo giả (Flyway + Java) ⇒ fromRepo + §3 theo package.
 *   4. B13 RTM: 4 chỉ số phủ + NFR trong GET /rtm và sheet NFR của xlsx.
 *   5. B6/B5 Q&A: đề xuất/phương án/mã đích; mã đích lạ 400; settings.qnaRequireTarget=block ⇒ 409; đẩy câu hỏi elicitation.
 *   6. B2 RACI theo vai: 5 mũ ROLE, gói việc Report 2, ONE_ROLE_MAJORITY_A, Report 2 §3 chế độ honest/roles.
 *   7. B21 Record of Changes của Report 3 có dòng CR IMPLEMENTED.  8. B19 đối soát Report 7 (GET checks + assemble trả checks).
 *   9. B14 soát trước nộp 10 mục.  10. B20 Report 6 khung User Manual.  11. B15 ADR đánh số + Superseded.
 *  12. B18 PlantUML: sơ đồ PLANTUML, !include bị chặn, vẽ SVG qua máy render (giả) đã làm sạch, chưa cấu hình ⇒ 503, nhập .puml từ repo.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { plainText } from '../services/work/docExport.js';
import type { PmNode } from '../services/work/docMarkdown.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `d5b${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };
const LABFLOW_SQL = readFileSync(path.resolve('src/services/work/sqlDesign/fixtures/labflow-v1.sql'), 'utf8');

const headings = (doc: unknown) => (((doc as PmNode)?.content ?? []).filter((b) => b.type === 'heading').map((b) => plainText(b).trim()));
const tableAfter = (doc: unknown, heading: string): string[][] => {
  const blocks = (doc as PmNode).content ?? [];
  const i = blocks.findIndex((b) => b.type === 'heading' && plainText(b).trim() === heading);
  const t = blocks.slice(i + 1).find((b) => b.type === 'table' || b.type === 'heading');
  return t?.type === 'table' ? (t.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim())) : [];
};

describe('CT Work — dm5 G2: hồ sơ SRS/SDS/Report & truy vết (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U;
  let wsId = 0, pid = 0, agentId = 0;
  let pages: Array<{ number: number; templateKey: string | null }> = [];
  const pageOf = (k: string) => pages.find((p) => p.templateKey === k)!.number;

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U | null, method: string, p: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${p}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U, p: string) {
    const res = await fetch(`${base}/api/v1/work${p}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, buf: Buffer.from(await res.arrayBuffer()) };
  }
  const pageDoc = async (num: number) => (await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: num }, select: { contentJson: true } })).contentJson as unknown as PmNode;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, staff, teacher, viewer] = await Promise.all(['owner', 'staff', 'teacher', 'viewer'].map((n) => mkUser(n)));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/diagramRepo.js'))._setRepoForTests(null);
    (await import('../services/work/plantuml.js'))._setPlantUmlFetchForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CAPSTONE (Report 1–7), staff ADMIN (một mình), giảng viên TEACHER, viewer, agent', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `DM5B ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'LAB', name: 'LabFlow', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[staff, 'ADMIN'], [teacher, 'TEACHER'], [viewer, 'VIEWER']] as const) assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    // Làm MỘT mình: owner rời vai sinh viên (chỉ còn staff là ADMIN/MEMBER người).
    await prisma.workProjectMember.updateMany({ where: { projectId: pid, userId: owner.id }, data: { role: 'VIEWER' } });
    pages = await prisma.workPage.findMany({ where: { projectId: pid }, select: { number: true, templateKey: true } });
    const agent = await mkUser('bot', 'AGENT');
    agentId = agent.id;
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: agentId, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agentId, role: 'MEMBER' } });
  });

  it('B9 + B8: sổ SM-xx, quyền, mã được nhắc mà không có, lint UC trong six links', async () => {
    const student = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Student' })).data;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/rules`, { name: 'Cancel 2h before', definition: 'Up to 2 hours before start', category: 'CONSTRAINT' })).status, 201);
    const uc = await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, {
      name: 'Book a lab room', primaryActorId: student.id, description: 'Student books', preconditions: 'Signed in', postconditions: 'Booking = PENDING, show SM-01',
      normalFlow: '1. Student opens the calendar\n2. System lists free rooms\n3. Student confirms', alternativeFlows: '7A. no room: LabFlow shows SM-02', exceptionFlows: '3E1. LabFlow shows SM-99', ruleNumbers: [1],
    });
    assert.equal(uc.status, 201, JSON.stringify(uc.raw));
    const a = await call(staff, 'POST', `/projects/${pid}/srs/messages`, { msgType: 'SUCCESS', context: 'Booking calendar', text: 'Đặt phòng thành công', textEn: 'Booking created', httpStatus: 201, useCases: ['UC-01'] });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.key, 'SM-01');
    assert.deepEqual(a.data.useCases.map((u: { key: string }) => u.key), ['UC-01']);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/messages`, { text: 'Không còn phòng', msgType: 'WARNING' })).data.key, 'SM-02');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/messages`, { text: 'x', useCases: ['UC-09'] })).code, 'WORK_BAD_USE_CASE');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/srs/messages`, { text: 'x' })).status, 403);
    const sm = await import('../services/work/srsMessages.service.js');
    const prop = await sm.createSystemMessage(agentId, pid, { text: 'Agent draft', status: 'APPROVED' });
    assert.equal(prop.status, 'PROPOSED');
    await assert.rejects(sm.deleteSystemMessage(agentId, pid, 'SM-01'), /cannot delete a message a person wrote/);
    const v = a.data.version;
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/messages/SM-01`, { status: 'APPROVED', version: v })).status, 200);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/messages/1`, { text: 'stale', version: v })).status, 409);
    const list = await call(viewer, 'GET', `/projects/${pid}/srs/messages`);
    assert.equal(list.status, 200);
    assert.deepEqual(list.data.unknown.map((x: { key: string }) => x.key), ['SM-99']);
    assert.deepEqual(list.data.items.find((m: { key: string }) => m.key === 'SM-02').mentionedIn, ['UC-01']);
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/srs/messages/SM-03`)).status, 200);
    const six = await call(staff, 'GET', `/projects/${pid}/swr/six-links`);
    const l2 = six.data.links.find((l: { key: string }) => l.key === 'UC_BR');
    const codes = l2.gaps.map((g: { code: string }) => g.code);
    for (const c of ['SM_UNKNOWN', 'SYSTEM_SUBJECT', 'STEP_REF_UNKNOWN', 'CODE_IN_POSTCONDITION']) assert.ok(codes.includes(c), `${c} in ${codes.join(',')}`);
    assert.equal(l2.ok, false, 'SM_UNKNOWN là lỗi tham chiếu');
  });

  it('B10: Report 3 điền 4.2 NFR + 5.1 BR theo nhóm + 5.2 SM; bản .docx có bảng', async () => {
    const r = await call(staff, 'POST', `/projects/${pid}/issues`, { title: 'Page response time', typeKey: 'REQUIREMENT' });
    const deep = await import('../services/work/srsDeep.service.js');
    await deep.setNfr(staff.id, pid, r.data.number, { characteristic: 'PERFORMANCE_EFFICIENCY', subCharacteristic: 'Time behaviour', scale: 'p95 response time', meter: 'k6 10 min', unit: 'ms', comparator: '<=', mustValue: 2000, planValue: 1000, wishValue: 500, conditions: '100 users', verification: 'TEST' });
    const num = pageOf('fpt-report3-srs');
    const f = await call(staff, 'POST', `/projects/${pid}/pages/${num}/fill-srs`, {});
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    for (const s of ['nfr', 'systemMessages', 'businessRules']) assert.ok(f.data.filled.includes(s), f.data.filled.join(','));
    const doc = await pageDoc(num);
    assert.deepEqual(tableAfter(doc, '4.2.1 Performance Efficiency')[1].slice(0, 2), [`LAB-${r.data.number}`, 'Page response time (Time behaviour)']);
    assert.deepEqual(tableAfter(doc, '5.2 System Messages').map((x) => x[0]), ['ID', 'SM-01', 'SM-02'], 'PROPOSED không vào tài liệu');
    assert.equal(tableAfter(doc, '5.1 Business Rules')[1][0], 'Constraint');
    const x = await download(staff, `/projects/${pid}/srs/report3/export.docx`);
    assert.equal(x.status, 200);
    const xml = new AdmZip(x.buf).readAsText('word/document.xml');
    for (const s of ['Minimum (Must)', 'SM-01', 'Đặt phòng thành công']) assert.ok(xml.includes(s), s);
  });

  let sqlDiagram = 0;
  it('B16/B17: Report 4 — 15 bảng 7 cột từ sơ đồ SQL; fromRepo + §3 Class Specifications', async () => {
    const d = await call(staff, 'POST', `/projects/${pid}/diagrams`, { title: 'LabFlow DB', format: 'SQL', type: 'ERD', source: LABFLOW_SQL });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    sqlDiagram = d.data.number;
    const pre = await call(viewer, 'GET', `/projects/${pid}/sds/db-design?diagram=${sqlDiagram}`);
    assert.equal(pre.status, 200, JSON.stringify(pre.raw));
    assert.equal(pre.data.tables.length, 15);
    assert.deepEqual(pre.data.source.problems, []);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/sds/db-design/fill`, { diagram: sqlDiagram })).status, 403);
    const f = await call(staff, 'POST', `/projects/${pid}/sds/db-design/fill`, { diagram: sqlDiagram });
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    assert.equal(f.data.tables, 15);
    const num = pageOf('fpt-report4-sds');
    let doc = await pageDoc(num);
    assert.ok(headings(doc).includes('1.3.15 settings'), headings(doc).join(' | '));
    const users = (doc as PmNode).content!.slice((doc as PmNode).content!.findIndex((b) => b.type === 'heading' && plainText(b).trim() === '1.3.2 users')).find((b) => b.type === 'table')!;
    const rows = (users.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));
    assert.deepEqual(rows[0], ['No', 'Field', 'PK', 'FK', 'UN', 'NN', 'Description']);
    assert.deepEqual(rows.slice(1).map((r) => r[1]), ['id', 'email', 'password_hash', 'full_name', 'student_code', 'status', 'created_at']);
    // Repo giả: Flyway + mã Java ⇒ report4_fill gom bảng + lớp theo package.
    const repo = await import('../services/work/diagramRepo.js');
    repo._setRepoForTests(async () => repo.memoryRepo({
      'src/main/resources/db/migration/V1__init.sql': LABFLOW_SQL,
      'src/main/java/vn/fpt/labflow/service/BookingService.java': 'package vn.fpt.labflow.service;\npublic class BookingService { private final BookingRepository repo; public Booking create(Long roomId) { return null; } }',
      'src/main/java/vn/fpt/labflow/controller/BookingController.java': 'package vn.fpt.labflow.controller;\npublic class BookingController { public ResponseEntity<Booking> create(BookingRequest r) { return null; } }',
    }));
    const r4 = await call(staff, 'POST', `/projects/${pid}/sds/report4/fill`, { fromRepo: true, parts: ['database', 'classes'] });
    assert.equal(r4.status, 200, JSON.stringify(r4.raw));
    assert.equal(r4.data.filled.length, 2, JSON.stringify(r4.data));
    doc = await pageDoc(num);
    const hs = headings(doc);
    assert.ok(hs.includes('3.1 vn.fpt.labflow.controller') && hs.includes('3.2.1 BookingService'), hs.join(' | '));
    assert.equal(hs.filter((h) => /\busers$/.test(h)).length, 1, 'điền lại không nhân đôi bảng');
  });

  it('B13: RTM có 4 chỉ số phủ + NFR; xlsx có sheet NFR', async () => {
    const r = await call(viewer, 'GET', `/projects/${pid}/rtm`);
    assert.equal(r.status, 200);
    assert.deepEqual(Object.keys(r.data.summary.coverage).sort(), ['brCovered', 'brCoveredPct', 'brTotal', 'brUncovered', 'orphanTests', 'ucCodedNoSds', 'ucTestedNoSt'].sort());
    assert.equal(r.data.summary.coverage.brTotal, 1);
    assert.equal(r.data.nfrs.length, 1);
    const x = await download(viewer, `/projects/${pid}/rtm/export.xlsx`);
    assert.ok(readXlsx(x.buf).some((s) => s.name === 'NFR'));
  });

  it('B6/B5: Q&A có đề xuất + phương án + mã đích; chặn đóng khi thiếu đích (block); đẩy câu hỏi elicitation', async () => {
    const q = await call(staff, 'POST', `/projects/${pid}/qna`, { question: 'Cancel window 2h or 4h?', proposal: 'Keep 2h', optionA: '2h', optionB: '4h', askedTo: 'Ms Dong' });
    assert.equal(q.status, 201, JSON.stringify(q.raw));
    assert.equal(q.data.optionB, '4h');
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/qna/${q.data.number}`, { targetRef: 'BR-77' })).code, 'WORK_QNA_BAD_TARGET');
    const warn = await call(teacher, 'PATCH', `/projects/${pid}/qna/${q.data.number}`, { answer: '2h is fine' });
    assert.equal(warn.status, 200);
    assert.equal(warn.data.noTarget, true, 'mặc định chỉ cảnh báo');
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}`, { settings: { qnaRequireTarget: 'block' } })).status, 200);
    const q2 = (await call(staff, 'POST', `/projects/${pid}/qna`, { question: 'Fine for late return?' })).data;
    const blocked = await call(teacher, 'PATCH', `/projects/${pid}/qna/${q2.number}`, { answer: 'No fine' });
    assert.equal(blocked.status, 409);
    assert.equal(blocked.code, 'WORK_QNA_TARGET');
    const okd = await call(teacher, 'PATCH', `/projects/${pid}/qna/${q2.number}`, { answer: 'No fine', targetRef: 'br1' });
    assert.equal(okd.status, 200, JSON.stringify(okd.raw));
    assert.equal(okd.data.targetRef, 'BR-01');
    const s = await call(staff, 'POST', `/projects/${pid}/swr/elicitation`, { title: 'Interview lab manager', technique: 'INTERVIEW', objective: 'Booking rules', questions: [{ text: 'Who approves weekend bookings?' }, { text: 'Max duration?', answer: '4h' }] });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    const push = await call(staff, 'POST', `/projects/${pid}/swr/elicitation/${s.data.number}/questions/q1/qna`, { targetRef: 'UC-01' });
    assert.equal(push.status, 201, JSON.stringify(push.raw));
    assert.equal(push.data.question.targetRef, 'UC-01');
    assert.match(push.data.question.details, /From ELC-/);
    const again = await call(staff, 'POST', `/projects/${pid}/swr/elicitation/${s.data.number}/questions/q1/qna`, {});
    assert.equal(again.status, 200);
    assert.equal(again.data.created, false);
    const sess = await prisma.workElicitationSession.findFirstOrThrow({ where: { projectId: pid, number: s.data.number }, select: { questions: true } });
    assert.equal((sess.questions as Array<{ qna?: string }>)[0].qna, push.data.question.key);
  });

  it('B2: 5 mũ ROLE + gói việc Report 2 + ONE_ROLE_MAJORITY_A; Report 2 §3 honest (Sinh viên + Supervisor) và roles', async () => {
    const hats = await call(staff, 'POST', `/projects/${pid}/swr/stakeholders/seed-hats`, {});
    assert.equal(hats.status, 201, JSON.stringify(hats.raw));
    assert.equal(hats.data.added, 5);
    assert.equal(hats.data.owner, staff.id, 'một sinh viên ⇒ mũ gắn vào người đó');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/swr/raci/activities/preset`, { preset: 'report2' })).data.added, 8);
    const sup = await call(staff, 'POST', `/projects/${pid}/swr/stakeholders`, { name: 'Ms Dong', role: 'Supervisor', kind: 'PERSON', userId: teacher.id });
    assert.equal(sup.status, 201, JSON.stringify(sup.raw));
    const raci = (await call(staff, 'GET', `/projects/${pid}/swr/raci`)).data;
    const act = (n: string) => raci.activities.find((a: { name: string }) => a.name === n).id;
    const sh = (n: string) => raci.stakeholders.find((s: { name: string }) => s.name === n).key;
    for (const [a, s, role] of [['Prepare SRS Document', 'C2 BA', 'R'], ['Prepare SRS Document', 'C1 Leader/PM', 'A'], ['Prepare SDS Document', 'C1 Leader/PM', 'A'], ['Final Report', 'C1 Leader/PM', 'A'], ['Final Report', 'Ms Dong', 'C']] as const) {
      assert.equal((await call(staff, 'PUT', `/projects/${pid}/swr/raci/cells`, { activityId: act(a), stakeholder: sh(s), role })).status, 200);
    }
    const after = (await call(staff, 'GET', `/projects/${pid}/swr/raci`)).data;
    assert.ok(after.problems.some((p: { code: string; stakeholder?: string }) => p.code === 'ONE_ROLE_MAJORITY_A' && p.stakeholder === 'C1 Leader/PM'));
    const r2 = pageOf('fpt-report2-project-management-plan');
    const f = await call(staff, 'POST', `/projects/${pid}/pages/${r2}/autofill`, { sections: ['raci'] });
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    let doc = await pageDoc(r2);
    let t = tableAfter(doc, '3. Responsibility Assignments');
    assert.deepEqual(t[0], ['Work Package', 'Staff', 'Supervisor'], 'mặc định honest khi một sinh viên + có mũ');
    assert.deepEqual(t.find((r) => r[0] === 'Final Report'), ['Final Report', 'A', 'C']);
    assert.ok(JSON.stringify(doc).includes('Note: this is a one-person project'));
    assert.equal((await call(staff, 'POST', `/projects/${pid}/pages/${r2}/autofill`, { sections: ['raci'], raciMode: 'roles' })).status, 200);
    doc = await pageDoc(r2);
    t = tableAfter(doc, '3. Responsibility Assignments');
    assert.deepEqual(t[0], ['Work Package', 'C1 Leader/PM', 'C2 BA', 'C3 Dev BE', 'C4 Dev FE', 'C5 QA/Tester']);
    assert.deepEqual(t.find((r) => r[0] === 'Prepare SRS Document')!.slice(0, 3), ['Prepare SRS Document', 'A', 'R']);
  });

  it('B21: Record of Changes của Report 3 có dòng CR đã IMPLEMENTED (A/M/D + mã UC)', async () => {
    const ucRow = await prisma.workUseCase.findFirstOrThrow({ where: { projectId: pid, number: 1 }, select: { id: true } });
    const cr = await prisma.workChangeRequest.create({ data: { projectId: pid, number: 1, title: 'Add QR check-in', status: 'IMPLEMENTED', implementedAt: new Date('2026-11-20T03:00:00Z'), createdById: staff.id, ownerId: staff.id } });
    await prisma.workCrAffectedRef.create({ data: { projectId: pid, changeRequestId: cr.id, kind: 'UC', refId: ucRow.id } });
    await prisma.workChangeRequest.create({ data: { projectId: pid, number: 2, title: 'Not done yet', status: 'APPROVED', createdById: staff.id } });
    const roc = await call(staff, 'GET', `/projects/${pid}/pages/${pageOf('fpt-report3-srs')}/record-of-changes`);
    assert.equal(roc.status, 200, JSON.stringify(roc.raw));
    const row = roc.data.find((r: { description: string }) => r.description.startsWith('CR-1'));
    assert.ok(row, JSON.stringify(roc.data));
    assert.deepEqual([row.action, row.date, row.description], ['A', '20/11/2026', 'CR-1: Add QR check-in (UC-01)']);
    assert.ok(!roc.data.some((r: { description: string }) => r.description.startsWith('CR-2')));
    // Report 4 (không phải SRS) không nhận CR chỉ chạm UC.
    const roc4 = await call(staff, 'GET', `/projects/${pid}/pages/${pageOf('fpt-report4-sds')}/record-of-changes`);
    assert.ok(!roc4.data.some((r: { description: string }) => r.description.startsWith('CR-1')));
  });

  it('B19: đối soát Report 7 — GET checks và assemble trả checks (vẫn ghép)', async () => {
    const c = await call(viewer, 'GET', `/projects/${pid}/final-report/checks`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    const codes = c.data.checks.map((x: { code: string }) => x.code);
    assert.ok(codes.includes('CODE_UNKNOWN'), codes.join(','));
    assert.ok(codes.includes('TEMPLATE_LEFTOVER'), codes.join(','));
    const a = await call(staff, 'POST', `/projects/${pid}/final-report/assemble`, {});
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.changed, true);
    assert.ok(Array.isArray(a.data.checks) && a.data.checks.length > 0);
  });

  it('B14: soát trước nộp — 10 mục, tên UC ↔ thẻ', async () => {
    const r = await call(viewer, 'GET', `/projects/${pid}/submit-check`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.items.length, 10);
    const by = (k: string) => r.data.items.find((i: { key: string }) => i.key === k);
    assert.equal(by('UC_NAMES').ok, false, 'UC-01 chưa gắn thẻ');
    assert.equal(by('NO_SYSTEM_WORD').ok, false);
    assert.equal(by('CLEAN_POSTCONDITIONS').ok, false);
    assert.equal(by('RECORD_OF_CHANGES').ok, false, 'CR-1 chưa có trong Record of Changes của trang');
    assert.equal(by('NFR_MEASURABLE').ok, true);
  });

  it('B20: Report 6 — khung User Manual theo actor → màn', async () => {
    const st = (await call(staff, 'GET', `/projects/${pid}/srs`)).data.actors.find((a: { name: string }) => a.name === 'Student');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/screens`, { name: 'Booking Calendar', actorIds: [st.id], description: 'Pick a free slot' })).status, 201);
    const f = await call(staff, 'POST', `/projects/${pid}/report6/fill`, {});
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    assert.deepEqual(f.data.added, ['Student Features', 'Student › Booking Calendar']);
    const hs = headings(await pageDoc(pageOf('fpt-report6-user-guides')));
    assert.ok(hs.includes('3.2 Student Features') && hs.includes('3.2.1 Booking Calendar'), hs.join(' | '));
    const again = await call(staff, 'POST', `/projects/${pid}/report6/fill`, {});
    assert.equal(again.data.changed, false);
  });

  it('B15: ADR đánh số tự động + Superseded by', async () => {
    const a = await call(staff, 'POST', `/projects/${pid}/pages`, { templateKey: 'sep490-adr' });
    assert.equal(a.status, 201, JSON.stringify(a.raw));
    assert.equal(a.data.title, 'ADR-001: New decision');
    const b = await call(staff, 'POST', `/projects/${pid}/pages`, { templateKey: 'adr', title: 'Chọn PostgreSQL' });
    assert.equal(b.data.title, 'ADR-002: Chọn PostgreSQL');
    const s = await call(staff, 'POST', `/projects/${pid}/pages/${a.data.number}/adr/supersede`, { by: b.data.number });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    const old = await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: a.data.number }, select: { status: true, contentText: true } });
    assert.equal(old.status, 'ARCHIVED');
    assert.match(old.contentText ?? '', /Superseded by ADR-002/);
    assert.match((await prisma.workPage.findFirstOrThrow({ where: { projectId: pid, number: b.data.number }, select: { contentText: true } })).contentText ?? '', /Supersedes ADR-001/);
  });

  it('B18: PlantUML — lưu nguồn, chặn !include, vẽ SVG (máy render giả), 503 khi chưa cấu hình, nhập .puml từ repo', async () => {
    const SRC = '@startuml\nactor Student\nStudent -> LabFlow : book\n@enduml';
    const d = await call(staff, 'POST', `/projects/${pid}/diagrams`, { title: 'Booking flow', format: 'PLANTUML', source: SRC });
    assert.equal(d.status, 201, JSON.stringify(d.raw));
    assert.equal(d.data.format, 'PLANTUML');
    assert.equal(d.data.type, 'SEQUENCE');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/diagrams`, { title: 'x', format: 'PLANTUML', source: '@startuml\n!include /etc/passwd\n@enduml' })).code, 'WORK_DIAGRAM_BAD_SOURCE');
    const pu = await import('../services/work/plantuml.js');
    const saved = process.env.PLANTUML_SERVER_URL;
    delete process.env.PLANTUML_SERVER_URL;
    const off = await call(viewer, 'GET', `/projects/${pid}/diagrams/${d.data.number}/plantuml.svg`);
    assert.equal(off.status, 503);
    assert.equal(off.code, 'WORK_PLANTUML_UNAVAILABLE');
    let asked = '';
    pu._setPlantUmlFetchForTests(async (url) => { asked = url; return { ok: true, status: 200, text: '<?xml version="1.0"?><svg onload="x()"><script>bad()</script><text>Student</text></svg>' }; });
    const res = await fetch(`${base}/api/v1/work/projects/${pid}/diagrams/${d.data.number}/plantuml.svg`, { headers: { Authorization: `Bearer ${viewer.token}` } });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /image\/svg\+xml/);
    assert.equal(await res.text(), '<svg><text>Student</text></svg>');
    assert.ok(asked.includes(`/svg/${pu.plantumlEncode(`${SRC}\n`)}`), asked);
    const draft = await fetch(`${base}/api/v1/work/projects/${pid}/diagrams/plantuml/render`, { method: 'POST', headers: { Authorization: `Bearer ${staff.token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ source: SRC }) });
    assert.equal(draft.status, 200);
    if (saved !== undefined) process.env.PLANTUML_SERVER_URL = saved;
    const repo = await import('../services/work/diagramRepo.js');
    repo._setRepoForTests(async () => repo.memoryRepo({ 'docs/uml/booking-state.puml': '@startuml\n[*] --> Pending\nPending --> Approved\n@enduml\n' }));
    const imp = await call(staff, 'POST', `/projects/${pid}/diagrams/import-repo`, { path: 'docs/uml/booking-state.puml' });
    assert.equal(imp.status, 201, JSON.stringify(imp.raw));
    const row = await prisma.workDiagram.findFirstOrThrow({ where: { projectId: pid, title: 'booking state' }, select: { format: true, diagramType: true } });
    assert.deepEqual(row, { format: 'PLANTUML', diagramType: 'STATE' });
    assert.equal((await call(staff, 'POST', `/projects/${pid}/diagrams/import-repo`, { path: 'nope.puml' })).status, 404);
  });
});
