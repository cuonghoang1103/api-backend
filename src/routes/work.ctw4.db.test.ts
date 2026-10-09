/**
 * CT Work đợt 4 — SRS có cấu trúc & truy vết qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw4.db.test.ts
 *
 *   1. A6+A7 SRS: actor / UC (đánh số, khoá lạc quan, BR tham chiếu) / BR / màn + Screens Flow / ô Screen Authorization /
 *      Non-UI; quyền (VIEWER đọc không ghi, giảng viên duyệt, người ngoài 404); agent chỉ tạo ĐỀ XUẤT, không duyệt.
 *   2. AI gợi ý UC từ thẻ ⇒ PROPOSED (model giả) ⇒ nhận ⇒ duyệt; bỏ đề xuất.
 *   3. Report 3: điền trang (phiên bản mới có ghi chú) + xuất .docx — đề mục/bảng đúng mẫu, PROPOSED không có.
 *   4. A19 RTM: UC ↔ thẻ ↔ trang SDS ↔ commit/PR ↔ Xray + hàm 5.1 + module 5.2 + workflow 5.3 ↔ Bug; chỗ hở; lọc; liên kết tay; xlsx.
 *   5. A16+B5 defect log: Severity/Activity/Product trên Bug (không phải Bug ⇒ 400); phát hiện spec review ⇒ Bug một chạm.
 *   6. A22 Q&A: câu hỏi QUESTION + trả lời (giảng viên trả lời được), dòng RAID cũ nhóm Q&A vẫn đọc + chuyển đổi.
 *   7. A24 worklog activity: ghi giờ có Activity/Work Product, sửa, giờ theo activity.
 *   8. Project Tracking SEP490: Q&A/TimeLogs/Defects lấy đủ trường mới + sheet RTM cuối tệp.
 *   9. A18 Report 7: ghép trang Report 1–6 ⇒ phiên bản mới; xuất .docx/.pdf có bìa Final.
 *  10. CTW-12: spec review trang GDD không bị khung SRS.  11. Registry: Ask AI đọc/áp lệnh mới.  12. Xoá dự án dọn sạch.
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
const tag = `c4${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string };

describe('CT Work — đợt 4: SRS có cấu trúc & truy vết (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, staff: U, teacher: U, viewer: U, outsider: U;
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
  const docxText = (buf: Buffer) => new AdmZip(buf).readAsText('word/document.xml');
  /** Đoạn văn của document.xml theo thứ tự: [kiểu, chữ]. */
  const docxParas = (buf: Buffer) => [...docxText(buf).matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map((m) => [(/<w:pStyle w:val="([^"]+)"/.exec(m[0])?.[1] ?? ''), [...m[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map((x) => x[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')).join('')] as [string, string]);

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
    (await import('../services/work/srs.service.js'))._setSrsAskForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CAPSTONE (Report 1–7 có sẵn), staff MEMBER, giảng viên TEACHER, viewer VIEWER, một agent', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `CTW4 ${tag}` })).data.id;
    wsIds.push(wsId);
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [staff.email, teacher.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'LAB', name: 'LabFlow AI', template: 'CAPSTONE', kind: 'SCHOOL' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    for (const [u, role] of [[staff, 'MEMBER'], [teacher, 'TEACHER'], [viewer, 'VIEWER']] as const) {
      assert.equal((await call(owner, 'PUT', `/projects/${pid}/members/${u.id}`, { role })).status, 200);
    }
    pages = await prisma.workPage.findMany({ where: { projectId: pid }, select: { number: true, templateKey: true } });
    const agent = await mkUser('bot', 'AGENT');
    agentId = agent.id;
    await prisma.workMember.create({ data: { workspaceId: wsId, userId: agentId, role: 'MEMBER' } });
    await prisma.workProjectMember.create({ data: { projectId: pid, userId: agentId, role: 'MEMBER' } });
  });

  let req1 = { number: 0, id: 0 };
  it('A6+A7: actor / BR / UC / màn / ô phân quyền / Non-UI + quyền', async () => {
    const student = await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Student', description: 'Books equipment' });
    assert.equal(student.status, 201, JSON.stringify(student.raw));
    const manager = (await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Lab Manager' })).data;
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: 'Student' })).status, 409);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/actors`, { name: ' student ' })).status, 409, 'trùng không phân biệt hoa thường');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/srs/actors`, { name: 'X' })).status, 403);
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/srs`)).status, 404);
    const br = await call(staff, 'POST', `/projects/${pid}/srs/rules`, { name: 'Booking window', definition: 'Start time is later than now and at most 14 days ahead.' });
    assert.equal(br.status, 201);
    assert.equal(br.data.key, 'BR-01');
    req1 = await issue('Create reservation', 'REQUIREMENT');
    const uc = await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, {
      name: 'Create Reservation', feature: 'Booking', primaryActorId: student.data.id, secondaryActorIds: [manager.id],
      trigger: 'Student presses "Book"', description: 'Student books a device for a time slot.', preconditions: 'Student is signed in.',
      postconditions: 'A pending reservation exists.', normalFlow: '1. Student picks a device\n2. LabFlow checks BR-01\n3. LabFlow saves the reservation',
      alternativeFlows: '2A. Slot taken\n1. LabFlow shows SM-02', exceptionFlows: '3E. Database error\n1. LabFlow shows SM-99', priority: 'HIGH',
      issueNumber: req1.number, ruleNumbers: [1],
    });
    assert.equal(uc.status, 201, JSON.stringify(uc.raw));
    assert.equal(uc.data.key, 'UC-01');
    assert.equal(uc.data.status, 'DRAFT');
    assert.deepEqual(uc.data.missing, []);
    assert.equal(uc.data.issue.key, `LAB-${req1.number}`);
    const uc2 = await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { name: 'Approve Reservation', primaryActorId: manager.id });
    assert.equal(uc2.data.key, 'UC-02');
    assert.deepEqual(uc2.data.missing, ['description', 'preconditions', 'postconditions', 'normal flow']);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/use-cases`, { name: 'Bad', ruleNumbers: [9] })).status, 400);
    // Khoá lạc quan.
    const v = uc2.data.version;
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/use-cases/2`, { description: 'Manager approves', version: v })).status, 200);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/use-cases/2`, { description: 'stale', version: v })).status, 409);
    // Màn + Screens Flow + ô phân quyền + Non-UI.
    const login = (await call(staff, 'POST', `/projects/${pid}/srs/screens`, { name: 'Login', feature: 'Common', actorIds: [student.data.id, manager.id] })).data;
    const book = (await call(staff, 'POST', `/projects/${pid}/srs/screens`, { name: 'Book Device', feature: 'Booking', issueNumber: req1.number, actorIds: [student.data.id] })).data;
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/srs/screens/${login.id}`, { linksTo: [{ screenId: book.id, label: 'Sign in' }] })).status, 200);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/srs/screen-auth`, { screenId: book.id, actorId: manager.id, allowed: true })).status, 200);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/srs/screen-auth`, { screenId: book.id, actorId: manager.id, allowed: false })).status, 200);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/functions`, { feature: 'Booking', name: 'Auto-expire reservations', description: 'Nightly job' })).status, 201);
    const s = await call(viewer, 'GET', `/projects/${pid}/srs`);
    assert.equal(s.status, 200);
    assert.equal(s.data.canEdit, false);
    assert.deepEqual(s.data.auth.filter(([sid]: [number]) => sid === book.id).map(([, a]: [number, number]) => a), [student.data.id]);
    assert.deepEqual(s.data.links, [{ fromId: login.id, toId: book.id, label: 'Sign in' }]);
    assert.equal(s.data.useCases[0].section, '2.1.1');
    assert.deepEqual(s.data.rules[0].usedIn, ['UC-01']);
    assert.equal(s.data.report3Page.number, pageOf('fpt-report3-srs'));
  });

  it('agent chỉ ĐỀ XUẤT: tạo ⇒ PROPOSED, không sửa UC người viết, không duyệt; giảng viên duyệt được', async () => {
    const srs = await import('../services/work/srs.service.js');
    const u = await srs.createUseCase(agentId, pid, { name: 'Cancel Reservation', status: 'APPROVED' });
    assert.equal(u.status, 'PROPOSED');
    await assert.rejects(srs.updateUseCase(agentId, pid, 1, { name: 'hijack' }), /only change its own proposals/);
    await assert.rejects(srs.setUseCaseStatus(agentId, pid, u.number, 'DRAFT'), /cannot approve/);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/srs/use-cases/${u.number}/status`, { status: 'DRAFT' })).status, 403);
    const acc = await call(teacher, 'POST', `/projects/${pid}/srs/use-cases/${u.number}/status`, { status: 'DRAFT' });
    assert.equal(acc.status, 200, JSON.stringify(acc.raw));
    assert.equal(acc.data.status, 'DRAFT');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/use-cases/1/status`, { status: 'APPROVED' })).data.status, 'APPROVED');
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/srs/use-cases/${u.number}`)).status, 200);
  });

  it('AI gợi ý UC từ thẻ ⇒ ĐỀ XUẤT (PROPOSED, có BR + actor mới, gắn thẻ); bỏ đề xuất', async () => {
    const srs = await import('../services/work/srs.service.js');
    let prompt = '';
    srs._setSrsAskForTests(async (_s, user) => {
      prompt = user;
      return JSON.stringify({ useCases: [{ name: 'Return Device', feature: 'Booking', primaryActor: 'Student', secondaryActors: ['Lab Technician'], trigger: 'Student returns', description: 'Return a borrowed device', preconditions: 'Device borrowed', postconditions: 'Device available', normalFlow: '1. Student scans\n2. LabFlow marks returned', alternativeFlows: 'None', exceptionFlows: 'None', priority: 'medium', businessRules: [{ id: 'BR-01', name: 'x', definition: 'x' }, { id: null, name: 'Late fee', definition: 'Late after 24 h' }] }] });
    });
    const story = await issue('Return devices', 'STORY', { descriptionJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Students return devices at the desk.' }] }] } });
    const r = await call(staff, 'POST', `/projects/${pid}/srs/suggest`, { issueNumber: story.number });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.match(prompt, /Students return devices at the desk/);
    assert.match(prompt, /Existing actors: Student, Lab Manager\n/);
    assert.deepEqual(r.data.created.map((c: any) => c.name), ['Return Device']);
    assert.deepEqual(r.data.actorsAdded, ['Lab Technician']);
    assert.deepEqual(r.data.rulesAdded, ['BR-02']);
    const s = (await call(staff, 'GET', `/projects/${pid}/srs`)).data;
    const prop = s.useCases.find((u: any) => u.name === 'Return Device');
    assert.equal(prop.status, 'PROPOSED');
    assert.equal(prop.aiModel, 'test-model');
    assert.equal(prop.issue.number, story.number);
    assert.deepEqual(prop.ruleNumbers, [1, 2]);
    assert.equal(s.rules.find((x: any) => x.number === 2).status, 'PROPOSED');
    assert.equal(s.counts.proposed, 1);
    // Bỏ đề xuất: UC PROPOSED + BR đề xuất không còn UC nào dùng.
    const d = await call(staff, 'POST', `/projects/${pid}/srs/proposals/discard`);
    assert.deepEqual(d.data, { useCases: 1, rules: 1 });
    // Gợi ý lại rồi NHẬN ⇒ BR đề xuất đi kèm thành nháp.
    const again = await call(staff, 'POST', `/projects/${pid}/srs/suggest`, { issueNumber: story.number });
    const n = Number(/UC-(\d+)/.exec(again.data.created[0].key)![1]);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/srs/use-cases/${n}/status`, { status: 'DRAFT' })).data.status, 'DRAFT');
    assert.ok((await prisma.workBusinessRule.findMany({ where: { projectId: pid } })).every((b) => b.status !== 'PROPOSED'));
    srs._setSrsAskForTests(null);
  });

  it('Report 3: điền trang (một phiên bản, đúng đề mục) + xuất .docx đúng mẫu, PROPOSED không vào', async () => {
    const srs = await import('../services/work/srs.service.js');
    await srs.createUseCase(agentId, pid, { name: 'Hidden Proposal' });
    const num = pageOf('fpt-report3-srs');
    const f = await call(staff, 'POST', `/projects/${pid}/pages/${num}/fill-srs`, {});
    assert.equal(f.status, 200, JSON.stringify(f.raw));
    assert.deepEqual(f.data.filled, ['actors', 'useCases', 'screensFlow', 'screenAuthorization', 'nonUi', 'ucSpecs', 'businessRules']);
    const v = await prisma.workPageVersion.findFirst({ where: { page: { projectId: pid, number: num } }, orderBy: { n: 'desc' } });
    assert.match(v!.note ?? '', /Filled from structured requirements/);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/pages/${num}/fill-srs`, {})).status, 403);
    const x = await download(staff, `/projects/${pid}/srs/report3/export.docx`);
    assert.equal(x.status, 200);
    assert.match(x.disposition ?? '', /LAB_Report3_Software_Requirement_Specification\.docx/);
    const paras = docxParas(x.buf);
    const heads = paras.filter(([s]) => /^Heading/.test(s)).map(([, t]) => t);
    for (const h of ['I. Record of Changes', '1.3.1 Actors', '1.3.2 Use Cases (UC)', '1.4.1 Screens Flow', '1.4.2 Screen Authorization', '1.4.3 Non-UI Functions', '2. Use Case Specifications', '2.1 Student Features', '2.1.1 Create Reservation (UC-01)', '5.1 Business Rules']) {
      assert.ok(heads.includes(h), `${h} — ${heads.join(' | ')}`);
    }
    const xml = docxText(x.buf);
    for (const s of ['Primary Actors', 'Secondary Actors', 'Normal Sequence/Flow', 'Alternative Sequences/Flows', 'Exception Flows', 'BR-01', 'Auto-expire reservations', 'Book Device']) assert.ok(xml.includes(s), s);
    assert.ok(!xml.includes('Hidden Proposal'), 'đề xuất chưa duyệt không vào bản xuất');
    const pdf = await download(staff, `/projects/${pid}/srs/report3/export`, 'POST', { format: 'pdf' });
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
    await call(staff, 'POST', `/projects/${pid}/srs/proposals/discard`);
  });

  let bugNum = 0;
  it('A19 RTM: chuỗi truy vết + chỗ hở + liên kết tay + xlsx', async () => {
    // Trang SDS nhắc UC-01 dưới một đề mục; commit; Xray test chạy PASS; hàm 5.1 nhắc UC-01; module 5.2 nhắc thẻ; workflow 5.3.
    const sds = pageOf('fpt-report4-sds');
    const pg = await call(staff, 'GET', `/projects/${pid}/pages/${sds}`);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/pages/${sds}`, { markdown: '# II. Software Design Document\n\n## 2. Detailed Design\n\n### 2.1 Create Reservation\n\nSequence diagram for UC-01.', version: pg.data.version })).status, 200);
    await prisma.workDevActivity.create({ data: { projectId: pid, issueId: req1.id, kind: 'COMMIT', externalId: 'abc123', title: 'feat: reservation', url: 'https://github.com/x/y/commit/abc123' } });
    const test = await issue('Reserve a free slot', 'TEST');
    await prisma.workIssueLink.create({ data: { fromIssueId: test.id, toIssueId: req1.id, type: 'TESTS' } });
    const tc = await prisma.workTestCase.create({ data: { issueId: test.id } });
    const cycle = await prisma.workTestCycle.create({ data: { projectId: pid, name: 'Round 1' } });
    await prisma.workTestRun.create({ data: { cycleId: cycle.id, testCaseId: tc.id, status: 'FAIL' } });
    const bug = await issue('Double booking possible', 'BUG');
    bugNum = bug.number;
    await prisma.workIssueLink.create({ data: { fromIssueId: bug.id, toIssueId: req1.id, type: 'RELATES' } });
    await prisma.workUnitFunction.create({ data: { projectId: pid, moduleName: 'ReservationService', methodName: 'create', testRequirement: 'Covers UC-01 and BR-01', cases: { create: [{ position: 0, type: 'N', result: 'P' }, { position: 1, type: 'B', result: null }] } } });
    await prisma.workItModule.create({ data: { projectId: pid, name: 'Reservation API', kind: 'INT', description: `Integration of LAB-${req1.number}`, cases: { create: [{ position: 0, description: 'POST /reservations', rounds: [{ status: 'Passed' }] }] } } });
    const st = await prisma.workItModule.create({ data: { projectId: pid, name: 'Booking workflow', kind: 'SYS', cases: { create: [{ position: 0, description: 'Book then approve', rounds: [] }] } } });
    await prisma.workUnitFunction.create({ data: { projectId: pid, moduleName: 'Misc', methodName: 'orphan' } });

    const r = await call(viewer, 'GET', `/projects/${pid}/rtm`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const row = r.data.rows.find((x: any) => x.reqId === 'UC-01');
    assert.equal(row.issueKey, `LAB-${req1.number}`);
    assert.ok(row.srs.some((s: string) => s.startsWith(`Doc ${pageOf('fpt-report3-srs')} `) && s.includes('§2.1.1')), JSON.stringify(row.srs));
    assert.deepEqual(row.sds, [`Doc ${sds} §2.1`]);
    assert.equal(row.code.commits, 1);
    assert.deepEqual(row.screens, ['Book Device']);
    assert.deepEqual(row.unit.map((u: any) => [u.ref, u.cases, u.passed, u.notRun]), [['ReservationService.create', 2, 1, 1]]);
    assert.deepEqual(row.integration.map((u: any) => [u.name, u.passed]), [['Reservation API', 1]]);
    assert.deepEqual(row.xray.map((t: any) => t.last), ['FAIL']);
    assert.deepEqual(row.bugs.map((b: any) => [b.key, b.open]), [[`LAB-${bug.number}`, true]]);
    assert.deepEqual(row.gaps, ['FAILING', 'OPEN_BUGS']);
    assert.equal(row.status, 'Coded');
    const uc2 = r.data.rows.find((x: any) => x.reqId === 'UC-02');
    assert.ok(['UC_INCOMPLETE', 'NO_ISSUE', 'NO_SDS', 'NO_CODE', 'NO_TEST'].every((g) => uc2.gaps.includes(g)), uc2.gaps.join());
    assert.ok(r.data.orphans.some((o: any) => o.ref === 'Misc.orphan'));
    assert.ok(r.data.orphans.some((o: any) => o.ref === 'Booking workflow'));
    assert.equal(r.data.rules.find((b: any) => b.key === 'BR-01').covered, true);
    // Lọc theo chỗ hở.
    const gaps = await call(staff, 'GET', `/projects/${pid}/rtm?gap=NO_TEST`);
    assert.ok(gaps.data.rows.every((x: any) => x.gaps.includes('NO_TEST')));
    assert.ok(!gaps.data.rows.some((x: any) => x.reqId === 'UC-01'));
    // Liên kết tay: UC-02 ⇒ workflow 5.3 + mục SDS.
    const t1 = await call(staff, 'POST', `/projects/${pid}/trace-links`, { source: { kind: 'UC', ref: 'UC-02' }, target: { kind: 'ST', targetId: st.id } });
    assert.equal(t1.status, 201, JSON.stringify(t1.raw));
    assert.equal((await call(staff, 'POST', `/projects/${pid}/trace-links`, { source: { kind: 'UC', ref: 'UC-02' }, target: { kind: 'SDS', pageNumber: sds, heading: '2.2 Approve Reservation' } })).status, 201);
    assert.equal((await call(staff, 'POST', `/projects/${pid}/trace-links`, { source: { kind: 'UC', ref: 'UC-02' }, target: { kind: 'UNIT', targetId: 999999 } })).status, 400);
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/trace-links`, { source: { kind: 'UC', ref: 'UC-02' }, target: { kind: 'CODE', ref: 'X.y' } })).status, 403);
    const r2 = (await call(staff, 'GET', `/projects/${pid}/rtm?q=approve`)).data.rows[0];
    assert.deepEqual(r2.system.map((s: any) => s.name), ['Booking workflow']);
    assert.ok(!r2.gaps.includes('NO_SDS'));
    assert.ok(r2.gaps.includes('NOT_RUN'));
    assert.equal((await call(staff, 'DELETE', `/projects/${pid}/trace-links/${t1.data.id}`)).status, 200);
    // Excel.
    const x = await download(viewer, `/projects/${pid}/rtm/export.xlsx`);
    assert.equal(x.status, 200);
    const sh = readXlsx(x.buf);
    assert.deepEqual(sh.map((s) => s.name), ['RTM', 'BR Coverage', 'Untraced Tests', 'Summary']);
    assert.equal(sh[0].text(2, 1), 'Req ID');
    assert.equal(sh[0].text(2, 7), 'SDS §');
    assert.equal(sh[0].text(3, 1), 'UC-01');
    assert.match(sh[0].text(3, 19), /Tests failing/);
  });

  let reviewId = 0;
  it('A16+B5 defect log: Severity ≠ Priority trên Bug; không phải Bug ⇒ 400; spec review ⇒ Bug một chạm', async () => {
    const put = await call(staff, 'PUT', `/projects/${pid}/issues/${bugNum}/defect`, { severity: 'CRITICAL', activity: 'ST', product: 'Software Package', productDetails: 'Booking API' });
    assert.equal(put.status, 200, JSON.stringify(put.raw));
    assert.equal(put.data.severity, 'CRITICAL');
    const hist = await prisma.workHistory.findMany({ where: { issue: { projectId: pid, number: bugNum }, field: 'severity' } });
    assert.equal(hist.length, 1);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/issues/${req1.number}/defect`, { severity: 'MAJOR' })).status, 400);
    assert.equal((await call(viewer, 'PUT', `/projects/${pid}/issues/${bugNum}/defect`, { severity: 'MINOR' })).status, 403);
    assert.equal((await call(staff, 'PUT', `/projects/${pid}/issues/${bugNum}/defect`, { severity: 'BLOCKER' })).status, 400);
    const log = await call(viewer, 'GET', `/projects/${pid}/defects`);
    assert.equal(log.data[0].severity, 'CRITICAL');
    // Rà soát trang SRS (chỉ phần xác định) ⇒ có phát hiện ⇒ Bug.
    const num = pageOf('fpt-report3-srs');
    const rv = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${num}`, { semantic: false });
    assert.equal(rv.status, 201, JSON.stringify(rv.raw));
    assert.equal(rv.data.stats.docKind, 'SRS');
    reviewId = rv.data.id;
    const f = rv.data.findings[0];
    const b1 = await call(staff, 'POST', `/projects/${pid}/spec-reviews/${reviewId}/findings/${f.id}/bug`);
    assert.equal(b1.status, 201, JSON.stringify(b1.raw));
    const b2 = await call(staff, 'POST', `/projects/${pid}/spec-reviews/${reviewId}/findings/${f.id}/bug`);
    assert.equal(b2.status, 200);
    assert.equal(b2.data.number, b1.data.number, 'bấm lại không tạo trùng');
    const d = await call(staff, 'GET', `/projects/${pid}/issues/${b1.data.number}/defect`);
    assert.equal(d.data.activity, 'Review');
    assert.equal(d.data.product, 'Report3 (SRS)');
    assert.deepEqual(d.data.source, { reviewId, findingId: f.id });
    const again = await call(staff, 'GET', `/projects/${pid}/spec-reviews/${reviewId}`);
    assert.equal(again.data.findings.find((x: any) => x.id === f.id).bugNumber, b1.data.number);
  });

  it('CTW-12: trang GDD không bị chấm theo khung SRS; chọn tay được; tắt luật trong spec-settings', async () => {
    const g = await call(staff, 'POST', `/projects/${pid}/pages`, { title: 'GDD — Flying Pencil', markdown: '# Overview\n\nA paper plane game.\n\n# Gameplay\n\nThe player shall tilt the plane to steer.\n\n# Levels\n\nLevel 1 must take 3 minutes.' });
    assert.equal(g.status, 201, JSON.stringify(g.raw));
    const rv = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${g.data.number}`, { semantic: false });
    assert.equal(rv.data.stats.docKind, 'GDD');
    const why = rv.data.findings.filter((f: any) => f.rule === 'missing_section').map((f: any) => f.why).join('\n');
    assert.doesNotMatch(why, /Functional requirements|29148/);
    assert.match(why, /game design document outline/);
    const forced = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${g.data.number}`, { semantic: false, docType: 'SRS' });
    assert.equal(forced.data.stats.docKind, 'SRS');
    assert.equal(forced.data.stats.docKindAuto, false);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { rules: { disabled: ['missing_section'] } })).status, 200);
    const off = await call(staff, 'POST', `/projects/${pid}/spec-reviews/page/${g.data.number}`, { semantic: false, docType: 'SRS' });
    assert.ok(!off.data.findings.some((f: any) => f.rule === 'missing_section'));
    assert.deepEqual((await call(staff, 'GET', `/projects/${pid}/spec-settings`)).data.rules.disabled, ['missing_section']);
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { rules: { disabled: ['bogus'] } })).status, 400);
    await call(owner, 'PUT', `/projects/${pid}/spec-settings`, { rules: { disabled: [] } });
  });

  let qNum = 0;
  it('A22 Q&A: câu hỏi riêng (Q-n, trạng thái riêng), giảng viên trả lời, dòng cũ nhóm Q&A vẫn đọc + chuyển', async () => {
    const q = await call(staff, 'POST', `/projects/${pid}/qna`, { question: 'Is UAT required in iteration 2?', askedTo: 'Mr. Dong', priority: 'HIGH', due: '2026-11-20' });
    assert.equal(q.status, 201, JSON.stringify(q.raw));
    assert.match(q.data.key, /^Q-\d+$/);
    assert.equal(q.data.statusText, 'Open');
    assert.equal(q.data.askedBy, 'Staff');
    qNum = q.data.number;
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/qna`, { question: 'x' })).status, 403);
    assert.equal((await call(teacher, 'PATCH', `/projects/${pid}/qna/${qNum}`, { question: 'changed' })).status, 403, 'giảng viên chỉ trả lời');
    const a = await call(teacher, 'PATCH', `/projects/${pid}/qna/${qNum}`, { answer: 'Yes — demo to the lecturer.' });
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.status, 'ANSWERED');
    assert.equal(a.data.statusText, 'Closed');
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/qna/${qNum}`, { status: 'CLOSED' })).status, 400, 'trạng thái riêng của câu hỏi');
    // Dòng cũ (trước đợt 4): RAID ISSUE nhóm "Q&A".
    const old = await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'ISSUE', title: 'Which DB for the IoT data?', category: 'Q&A', status: 'CLOSED', mitigation: 'PostgreSQL + TimescaleDB' });
    assert.equal(old.status, 201, JSON.stringify(old.raw));
    const list = await call(viewer, 'GET', `/projects/${pid}/qna`);
    assert.equal(list.data.counts.total, 2);
    assert.equal(list.data.counts.legacy, 1);
    assert.equal(list.data.items.find((x: any) => x.legacy).statusText, 'Closed');
    // RAID loại QUESTION qua sổ RAID chung vẫn hợp lệ, trạng thái riêng.
    assert.equal((await call(staff, 'POST', `/projects/${pid}/raid`, { type: 'QUESTION', title: 'Via RAID', status: 'MONITORING' })).status, 400);
    const conv = await call(staff, 'POST', `/projects/${pid}/qna/${old.data.number}/convert`);
    assert.equal(conv.data.legacy, false);
    assert.equal(conv.data.status, 'ANSWERED');
  });

  it('A24: ghi giờ có Activity + Work Product; sửa; giờ theo activity', async () => {
    const w = await call(staff, 'POST', `/projects/${pid}/issues/${req1.number}/worklogs`, { minutes: 90, activity: 'Analyzing', workProduct: 'Report3 (SRS)', note: 'UC specs' });
    assert.equal(w.status, 201, JSON.stringify(w.raw));
    assert.equal(w.data.activity, 'Analyzing');
    assert.equal((await call(staff, 'POST', `/projects/${pid}/issues/${req1.number}/worklogs`, { minutes: 30, activity: 'Meeting' })).status, 400, 'đúng danh sách của mẫu');
    const w2 = await call(staff, 'POST', `/projects/${pid}/issues/${req1.number}/worklogs`, { minutes: 60 });
    assert.equal((await call(viewer, 'PATCH', `/projects/${pid}/issues/${req1.number}/worklogs/${w2.data.id}`, { activity: 'Coding' })).status, 403);
    assert.equal((await call(staff, 'PATCH', `/projects/${pid}/issues/${req1.number}/worklogs/${w2.data.id}`, { activity: 'Coding', workProduct: 'Booking module' })).data.activity, 'Coding');
    const def = await call(staff, 'GET', `/projects/${pid}/issues/${req1.number}/worklog-defaults`);
    assert.equal(def.data.activity, 'Analyzing');
    const t = await call(viewer, 'GET', `/projects/${pid}/reports/time-by-activity`);
    assert.equal(t.data.total, 2.5);
    assert.equal(t.data.byActivity.find((x: any) => x.activity === 'Coding').hours, 1);
    assert.equal(t.data.guessedHours, 0);
  });

  it('Project Tracking SEP490: Q&A / TimeLogs / Defects lấy trường mới; sheet RTM ở cuối', async () => {
    const x = await download(viewer, `/projects/${pid}/export/project-tracking?variant=SEP490`);
    assert.equal(x.status, 200);
    const sh = readXlsx(x.buf);
    assert.deepEqual(sh.map((s) => s.name), ['Scope', 'WBS', 'Q&A', 'TimeLogs', 'Defects', 'Issues', 'RTM']);
    const qa = sh[2];
    const qaRows = Array.from({ length: qa.maxRow - 2 }, (_, i) => [2, 3, 4, 5, 7, 8].map((c) => qa.text(3 + i, c)));
    const mine = qaRows.find((r) => r[0] === 'Is UAT required in iteration 2?')!;
    assert.deepEqual(mine, ['Is UAT required in iteration 2?', 'Staff', 'Mr. Dong', 'High', 'Closed', 'Yes — demo to the lecturer.']);
    assert.ok(qaRows.some((r) => r[0] === 'Which DB for the IoT data?'), 'dòng cũ vẫn có trong sheet Q&A');
    const issuesSheet = sh[5];
    assert.ok(!Array.from({ length: issuesSheet.maxRow }, (_, i) => issuesSheet.text(i + 1, 2)).includes('Which DB for the IoT data?'), 'Q&A không lẫn vào Issues');
    const tl = sh[3];
    const tlRows = Array.from({ length: tl.maxRow - 2 }, (_, i) => [5, 7, 8].map((c) => tl.text(3 + i, c)));
    assert.ok(tlRows.some((r) => r[0] === 'Analyzing' && r[1] === 'Report3 (SRS)' && r[2] === 'Report3 (SRS)'), JSON.stringify(tlRows));
    assert.ok(tlRows.some((r) => r[0] === 'Coding' && r[2] === 'Booking module'));
    const df = sh[4];
    const dfRows = Array.from({ length: df.maxRow - 2 }, (_, i) => [2, 3, 4, 5, 10].map((c) => df.text(3 + i, c)));
    const crit = dfRows.find((r) => r[0].includes('Double booking'))!;
    assert.deepEqual(crit.slice(1, 4), ['ST', 'Software Package', 'Booking API']);
    assert.match(crit[4], /Severity: Critical/);
    assert.ok(dfRows.some((r) => r[1] === 'Review' && r[2] === 'Report3 (SRS)'), 'lỗi review tài liệu cùng sổ Defects');
    assert.equal(sh[6].text(2, 1), 'Req ID');
  });

  it('A18 Report 7: ghép Report 1–6 vào trang Report 7 (một phiên bản) + xuất .docx/.pdf có bìa Final', async () => {
    await call(staff, 'PUT', `/projects/${pid}/fpt-reports/doc`, { groupCode: 'SEP490-G108', lecturer: 'Le Mai Dong', projectTitle: 'LabFlow AI — Smart Lab Management', students: [{ code: 'HE170001', name: 'Nguyen An', role: 'Leader' }] }).catch(() => null);
    const r7 = pageOf('fpt-report7-final-report');
    const a = await call(staff, 'POST', `/projects/${pid}/final-report/assemble`, {});
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.deepEqual(a.data.merged, [1, 2, 3, 4, 5, 6]);
    const v = await prisma.workPageVersion.findFirst({ where: { page: { projectId: pid, number: r7 } }, orderBy: { n: 'desc' } });
    assert.match(v!.note ?? '', /Assembled final report from Report 1/);
    const page = await call(staff, 'GET', `/projects/${pid}/pages/${r7}`);
    const json = JSON.stringify(page.data.contentJson);
    assert.ok(json.includes('Create Reservation (UC-01)'), 'SRS có cấu trúc đã theo Report 3 vào Final');
    assert.ok(json.includes('2.1 Create Reservation'), 'SDS theo Report 4');
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/final-report/assemble`, {})).status, 403);
    const x = await download(staff, `/projects/${pid}/final-report/export.docx`);
    assert.equal(x.status, 200);
    const paras = docxParas(x.buf);
    const h1 = paras.filter(([s]) => s === 'Heading1').map(([, t]) => t);
    assert.deepEqual(h1, ['Acknowledgement', 'Definition and Acronyms', 'I. Project Introduction', 'II. Project Management Plan', 'III. Software Requirement Specification', 'IV. Software Design Description', 'V. Software Testing Documentation', 'VI. Release Package & User Guides']);
    const xml = docxText(x.buf);
    for (const s of ['FPT UNIVERSITY', 'Capstone Project Document', 'Group Members', 'Table of Contents']) assert.ok(xml.includes(s), s);
    const pdf = await download(staff, `/projects/${pid}/final-report/export.pdf`);
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
  });

  it('Registry: Ask AI đọc srs_get/rtm_get, áp lệnh ghi (UC ⇒ PROPOSED, Q&A, defect); export_file có loại mới', async () => {
    const r = await import('../services/work/toolRegistry/index.js');
    const read = await r.runForPerson(staff.id, pid, 'srs_get', {}, 'read');
    assert.match(read.text, /Create Reservation/);
    const rt = await r.runForPerson(viewer.id, pid, 'rtm_get', { gap: 'NO_TEST' }, 'read');
    assert.match(rt.text, /UC-02|NO_TEST/);
    await assert.rejects(r.runForPerson(staff.id, pid, 'srs_propose_use_case', { name: 'x' }, 'read'), /propose it as an action/);
    const prop = await r.runForPerson(staff.id, pid, 'srs_propose_use_case', { name: 'Export Report', primaryActor: 'Lab Manager', businessRules: ['BR-01'] }, 'apply');
    assert.equal((prop.output as any).status, 'PROPOSED');
    const q = await r.runForPerson(staff.id, pid, 'qna_ask', { question: 'Deadline for SRS v1.0?' }, 'apply');
    assert.match((q.output as any).asked, /^Q-/);
    await r.runForPerson(staff.id, pid, 'defect_set', { issue: `LAB-${bugNum}`, severity: 'MAJOR' }, 'apply');
    assert.equal((await prisma.workDefectInfo.findFirst({ where: { issue: { projectId: pid, number: bugNum } } }))!.severity, 'MAJOR');
    const link = await r.runForPerson(staff.id, pid, 'export_file', { kind: 'rtm' }, 'read');
    assert.match((link.output as any).path, new RegExp(`/projects/${pid}/rtm/export\\.xlsx$`));
    for (const n of ['srs_get', 'rtm_get', 'defect_log', 'qna_list', 'srs_propose_use_case', 'trace_link_add', 'defect_set', 'qna_answer', 'worklog_set_activity', 'final_report_assemble']) {
      assert.ok(r.mcpCommands().some((t) => t.name === n), `${n} trên MCP`);
      assert.ok(r.askCommands().some((t) => t.name === n), `${n} trên Ask AI`);
    }
  });

  it('xoá dự án ⇒ UC/BR/màn/defect/câu hỏi đi theo (khoá ngoại deferred, không vỡ)', async () => {
    const counts = async () => Promise.all([
      prisma.workUseCase.count({ where: { projectId: pid } }), prisma.workSrsScreen.count({ where: { projectId: pid } }),
      prisma.workDefectInfo.count({ where: { projectId: pid } }), prisma.workRaidQuestion.count({ where: { raid: { projectId: pid } } }),
    ]);
    assert.ok((await counts()).every((n) => n > 0));
    await prisma.workProject.delete({ where: { id: pid } });
    assert.deepEqual(await counts(), [0, 0, 0, 0]);
    const fk = await prisma.$queryRaw<Array<{ conname: string; condeferrable: boolean; condeferred: boolean }>>`
      SELECT conname, condeferrable, condeferred FROM pg_constraint
      WHERE conname IN ('work_use_cases_issue_id_fkey', 'work_srs_screens_issue_id_fkey', 'work_srs_functions_issue_id_fkey', 'work_defect_info_issue_id_fkey')`;
    assert.equal(fk.length, 4);
    assert.ok(fk.every((f) => f.condeferrable && f.condeferred), JSON.stringify(fk));
  });
});
