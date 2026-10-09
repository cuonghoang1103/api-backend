/**
 * CTW đợt 5 — giảng viên & lớp học qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw5.db.test.ts
 *
 * Kịch bản: giảng viên tạo lớp SWP391 ⇒ nhập danh sách (CSV + xlsx, lỗi từng dòng) ⇒ mời theo lô (xem trước, xác nhận,
 * chặn gửi lại) ⇒ alice lập nhóm 1 (không gian riêng + dự án mẫu SWP391, giảng viên vào với vai TEACHER), bob vào nhóm 1,
 * carol lập nhóm 2 ⇒ mã sai / hết hạn / đóng / dò mã ⇒ hub chỉ cho TEACHER, nhóm khác không thấy nhau ⇒ rubric + điểm:
 * sinh viên chỉ thấy điểm đã công bố, điểm cá nhân chỉ chính mình, có lịch sử ⇒ việc định kỳ: theo múi giờ dự án,
 * chống trùng bằng dedup_key (kể cả hai lượt chạy song song) ⇒ checklist tuần 1.
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
import { writeXlsx, XSheet, readXlsx } from '../services/work/xlsxStyled.js';
import { agentRouteAllowed } from '../services/work/permissions.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c5${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CTW đợt 5 — lớp học, hub giảng viên, rubric/điểm, việc định kỳ (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let teacher: U, alice: U, bob: U, carol: U, dave: U, outsider: U, bot: U;
  let classId = 0, joinCode = '';
  let pidA = 0, pidC = 0, groupA = 0;
  const mails: Array<{ to: string; subject: string }> = [];

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const username = `${tag}_${name}`;
    const u = await prisma.user.create({ data: { username, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: U | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, type: res.headers.get('content-type'), buf: Buffer.from(await res.arrayBuffer()) };
  }

  before(async () => {
    (emailService as any).send = async (m: { to: string; subject: string }) => { mails.push({ to: m.to, subject: m.subject }); return { success: true }; };
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [teacher, alice, bob, carol, dave, outsider] = await Promise.all(['teacher', 'alice', 'bob', 'carol', 'dave', 'outsider'].map((n) => mkUser(n)));
    bot = await mkUser('bot', 'AGENT');
  });

  after(async () => {
    server?.close();
    if (userIds.length) {
      // Không gian của nhóm (dự án ⇒ điểm, luật, thẻ theo dây chuyền) trước, rồi lớp, rồi người (rubric).
      await prisma.workSpace.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.workClass.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('giảng viên tạo lớp ⇒ mã 8 ký tự + link; sinh viên chưa vào thì 404', async () => {
    const r = await call(teacher, 'POST', '/classes', { subject: 'SWP391', classCode: 'se1840', term: 'fa26', maxGroupSize: 3, week1Start: '2026-09-07' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    classId = r.data.id;
    joinCode = r.data.joinCode;
    assert.match(joinCode, /^[A-Z2-9]{8}$/);
    assert.equal(r.data.classCode, 'SE1840');
    assert.equal(r.data.role, 'OWNER');
    assert.equal(r.data.teacher.id, teacher.id, 'người tạo là giảng viên (mặc định)');
    assert.ok(r.data.joinUrl.endsWith(`/work/classes?join=${joinCode}`));
    assert.equal((await call(alice, 'GET', `/classes/${classId}`)).status, 404);
  });

  it('mã sai / hết hạn / đóng; dò mã quá 10 lần ⇒ 429', async () => {
    assert.equal((await call(alice, 'GET', '/classes/join/ZZZZ2222')).code, 'WORK_CLASS_CODE_INVALID');
    assert.equal((await call(alice, 'GET', '/classes/join/abc')).status, 404, 'mã sai hình dạng ⇒ 404, không tra DB');
    const pretty = await call(alice, 'GET', `/classes/join/${joinCode.slice(0, 4).toLowerCase()}-${joinCode.slice(4).toLowerCase()}`);
    assert.equal(pretty.status, 200, 'gõ chữ thường + gạch vẫn nhận');
    assert.equal(pretty.data.class.subject, 'SWP391');
    assert.equal(pretty.data.template, 'SWP391');

    await prisma.workClass.update({ where: { id: classId }, data: { joinExpiresAt: new Date(Date.now() - 1000) } });
    const exp = await call(alice, 'GET', `/classes/join/${joinCode}`);
    assert.deepEqual([exp.status, exp.code], [410, 'WORK_CLASS_CODE_EXPIRED']);
    assert.equal((await call(alice, 'POST', `/classes/join/${joinCode}`, { action: 'JOIN' })).code, 'WORK_CLASS_CODE_EXPIRED');
    await prisma.workClass.update({ where: { id: classId }, data: { joinExpiresAt: new Date(Date.now() + 86_400_000) } });

    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}`, { joinOpen: false })).status, 200);
    assert.equal((await call(alice, 'GET', `/classes/join/${joinCode}`)).code, 'WORK_CLASS_CLOSED');
    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}`, { joinOpen: true })).status, 200);

    // Đổi mã: mã cũ chết ngay.
    const old = joinCode;
    const re = await call(teacher, 'POST', `/classes/${classId}/join-code`, { expiresInDays: 30 });
    joinCode = re.data.joinCode;
    assert.notEqual(joinCode, old);
    assert.equal((await call(alice, 'GET', `/classes/join/${old}`)).code, 'WORK_CLASS_CODE_INVALID');

    for (let i = 0; i < 10; i++) await call(outsider, 'GET', `/classes/join/ZZZZ${String(2222 + i).replace(/[01]/g, '3')}`);
    const limited = await call(outsider, 'GET', `/classes/join/${joinCode}`);
    assert.deepEqual([limited.status, limited.code], [429, 'WORK_CLASS_RATE'], 'đúng mã cũng bị chặn khi đang bị khoá');
    (await import('../services/work/classroom.service.js'))._resetJoinRate();
  });

  it('nhập danh sách CSV: xem trước lỗi từng dòng, phải xác nhận, chỉ ghi dòng hợp lệ; xlsx cũng đọc được', async () => {
    const csv = [
      'MSSV,Họ tên,Email',
      `HE170001,Alice Nguyen,${alice.email.toUpperCase()}`,
      `HE170002,Bob Tran,${bob.email}`,
      'HE170003,Sai Email,khong-phai-email',
      `HE170004,Trung Email,${bob.email}`,
      `HE170002,Trung MSSV,dup-code-${tag}@test.local`,
      `HE170005,Dave Le,${dave.email}`,
    ].join('\n');
    const pv = await call(teacher, 'POST', `/classes/${classId}/roster/preview`, { csv });
    assert.equal(pv.status, 200, JSON.stringify(pv.raw));
    assert.deepEqual([pv.data.total, pv.data.valid, pv.data.invalid], [6, 3, 3]);
    assert.deepEqual(pv.data.rows.map((r: any) => r.errors.join('+')), ['', '', 'BAD_EMAIL', 'DUP_EMAIL_IN_FILE', 'DUP_CODE_IN_FILE', '']);
    assert.equal(await prisma.workClassStudent.count({ where: { classId } }), 0, 'xem trước không ghi gì');

    const noConfirm = await call(teacher, 'POST', `/classes/${classId}/roster/import`, { csv });
    assert.deepEqual([noConfirm.status, noConfirm.code], [400, 'WORK_CONFIRM_REQUIRED']);
    const imp = await call(teacher, 'POST', `/classes/${classId}/roster/import`, { csv, confirm: true });
    assert.equal(imp.status, 200, JSON.stringify(imp.raw));
    assert.equal(imp.data.imported, 3);
    const again = await call(teacher, 'POST', `/classes/${classId}/roster/preview`, { csv });
    assert.equal(again.data.rows[0].errors[0], 'ALREADY_IN_CLASS', 'nhập lại ⇒ báo đã có');
    // Người đã có tài khoản (email trùng) được gắn sẵn.
    const a = await prisma.workClassStudent.findFirst({ where: { classId, studentCode: 'HE170001' } });
    assert.equal(a?.userId, alice.id);
    assert.equal(a?.email, alice.email.toLowerCase());

    // xlsx: dựng tệp thật bằng bộ ghi của repo, gửi base64.
    const sh = new XSheet('Roster');
    sh.set(1, 1, 'Roll number').set(1, 2, 'Full name').set(1, 3, 'Email');
    sh.set(2, 1, 'HE170009').set(2, 2, 'Eve Pham').set(2, 3, `eve-${tag}@test.local`);
    sh.set(3, 1, 'HE170010').set(3, 2, 'Bad').set(3, 3, 'eve@@x');
    const buf = writeXlsx([sh]);
    assert.equal(readXlsx(buf)[0].text(2, 1), 'HE170009');
    const xp = await call(teacher, 'POST', `/classes/${classId}/roster/preview`, { xlsxBase64: buf.toString('base64') });
    assert.equal(xp.status, 200, JSON.stringify(xp.raw));
    assert.deepEqual([xp.data.valid, xp.data.invalid], [1, 1]);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/roster/preview`, { xlsxBase64: Buffer.from('not a zip').toString('base64') })).code, 'WORK_ROSTER_BAD');
    // Sinh viên (alice đã được gắn vào lớp vì email trùng) không nhập được danh sách; người ngoài ⇒ 404.
    assert.equal((await call(alice, 'POST', `/classes/${classId}/roster/preview`, { csv })).status, 403);
    assert.equal((await call(outsider, 'POST', `/classes/${classId}/roster/preview`, { csv })).status, 404);
  });

  it('mời theo lô: không xác nhận ⇒ chỉ xem trước; xác nhận ⇒ gửi; gửi lại ngay ⇒ chặn', async () => {
    mails.length = 0;
    const plan = await call(teacher, 'POST', `/classes/${classId}/roster/invite`, {});
    assert.equal(plan.status, 200, JSON.stringify(plan.raw));
    assert.deepEqual([plan.data.willSend, plan.data.sent, plan.data.confirmed], [3, 0, false]);
    assert.equal(mails.length, 0);
    const sent = await call(teacher, 'POST', `/classes/${classId}/roster/invite`, { confirm: true });
    assert.deepEqual([sent.data.sent, sent.data.confirmed], [3, true]);
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(mails.filter((m) => /SWP391 SE1840/.test(m.subject)).length, 3, 'thư có thương hiệu, đúng môn + lớp');
    const again = await call(teacher, 'POST', `/classes/${classId}/roster/invite`, { confirm: true });
    assert.deepEqual([again.data.sent, again.data.skipped.tooSoon], [0, 3]);
  });

  it('alice lập nhóm ⇒ không gian riêng + dự án SWP391, giảng viên vào với vai TEACHER; bob vào nhóm; carol nhóm khác', async () => {
    const r = await call(alice, 'POST', `/classes/join/${joinCode}`, { action: 'CREATE_GROUP', groupName: 'LabFlow' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    pidA = r.data.project.id;
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: pidA }, select: { template: true, key: true, settings: true, workspace: { select: { ownerId: true, id: true } } } });
    assert.deepEqual([p.template, p.key, p.workspace.ownerId], ['SWP391', 'SWP', alice.id]);
    assert.equal((p.settings as any).timezone, 'Asia/Ho_Chi_Minh');
    const tm = await prisma.workMember.findFirst({ where: { workspaceId: p.workspace.id, userId: teacher.id } });
    assert.equal(tm?.role, 'GUEST');
    assert.equal((await prisma.workProjectMember.findFirst({ where: { projectId: pidA, userId: teacher.id } }))?.role, 'TEACHER');
    const doc = await prisma.workFptReportDoc.findUnique({ where: { projectId: pidA } });
    assert.deepEqual([doc?.subjectCode, doc?.classCode, doc?.semester, doc?.groupCode, doc?.lecturer], ['SWP391', 'SE1840', 'FA26', 'SE1840-G1', 'Teacher']);
    assert.equal((doc?.students as any[])[0].code, 'HE170001', 'MSSV lấy từ danh sách đã nhập');
    groupA = (await prisma.workClassGroup.findUniqueOrThrow({ where: { projectId: pidA } })).id;

    // alice không lập thêm nhóm thứ hai.
    assert.equal((await call(alice, 'POST', `/classes/join/${joinCode}`, { action: 'CREATE_GROUP' })).status, 409);
    const b = await call(bob, 'POST', `/classes/join/${joinCode}`, { action: 'JOIN_GROUP', groupId: groupA });
    assert.equal(b.status, 200, JSON.stringify(b.raw));
    assert.equal((await prisma.workProjectMember.findFirst({ where: { projectId: pidA, userId: bob.id } }))?.role, 'MEMBER');
    const c = await call(carol, 'POST', `/classes/join/${joinCode}`, { action: 'CREATE_GROUP', groupName: 'Team Two', projectKey: 'TT' });
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    pidC = c.data.project.id;
    // Nhóm đầy (3 người): dave vào nhóm 1 được (3/3), outsider thì không.
    assert.equal((await call(dave, 'POST', `/classes/join/${joinCode}`, { action: 'JOIN_GROUP', groupId: groupA })).status, 200);
    const full = await call(outsider, 'POST', `/classes/join/${joinCode}`, { action: 'JOIN_GROUP', groupId: groupA });
    assert.deepEqual([full.status, full.code], [409, 'WORK_CLASS_GROUP_FULL']);

    // Nhóm khác không thấy nhau.
    assert.equal((await call(carol, 'GET', `/projects/${pidA}/week1`)).status, 404);
    assert.equal((await call(alice, 'GET', `/projects/${pidC}/grades`)).status, 404);
    // Sinh viên thấy tên nhóm, KHÔNG thấy danh sách email/MSSV.
    const sv = await call(bob, 'GET', `/classes/${classId}`);
    assert.equal(sv.data.manage, false);
    assert.equal(sv.data.students, undefined);
    assert.equal(sv.data.joinCode, undefined);
    assert.equal(sv.data.groups.length, 2);
    const mine = await call(bob, 'GET', '/classes');
    assert.equal(mine.data.enrolled[0].group.name, 'LabFlow');
  });

  it('lớp do trưởng nhóm tạo: giảng viên nhận vai bằng đúng email; người khác thì không', async () => {
    const r = await call(carol, 'POST', '/classes', { subject: 'SEP490', classCode: 'SE1901', term: 'SP27', iAmTeacher: false, teacherEmail: teacher.email });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.equal(r.data.teacher, null);
    const code = r.data.joinCode;
    assert.equal((await call(teacher, 'GET', `/classes/join/${code}`)).data.canTeach, true);
    assert.equal((await call(outsider, 'POST', `/classes/join/${code}`, { action: 'TEACH' })).status, 403);
    const g = await call(carol, 'POST', `/classes/join/${code}`, { action: 'CREATE_GROUP' });
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal((await prisma.workProject.findUniqueOrThrow({ where: { id: g.data.project.id }, select: { template: true } })).template, 'CAPSTONE');
    assert.equal((await call(teacher, 'POST', `/classes/join/${code}`, { action: 'TEACH' })).status, 200);
    assert.equal((await prisma.workProjectMember.findFirst({ where: { projectId: g.data.project.id, userId: teacher.id } }))?.role, 'TEACHER', 'nhóm có từ trước cũng nhận giảng viên');
  });

  it('hub: chỉ TEACHER thấy; nhóm có sức khoẻ + hồ sơ; lọc; xuất xlsx/PDF; AI tóm tắt; agent bị chặn', async () => {
    const acc = await call(teacher, 'GET', '/teaching/access');
    assert.deepEqual([acc.data.teaching, acc.data.projects], [true, 3]);
    assert.equal((await call(alice, 'GET', '/teaching/access')).data.teaching, false);
    const denied = await call(alice, 'GET', '/teaching/overview');
    assert.deepEqual([denied.status, denied.code], [403, 'WORK_TEACHING_ONLY']);
    assert.equal((await call(bot, 'GET', '/teaching/overview')).status, 403);

    // Dữ liệu cho sức khoẻ: 1 việc quá hạn + 1 câu hỏi chờ 9 ngày ở nhóm A.
    const type = await prisma.workIssueType.findFirstOrThrow({ where: { projectId: pidA, key: 'TASK' } });
    const iss = await call(alice, 'POST', `/projects/${pidA}/issues`, { title: 'Login', typeKey: 'TASK' });
    assert.equal(iss.status, 201, JSON.stringify(iss.raw));
    await prisma.workIssue.update({ where: { id: iss.data.id }, data: { dueDate: new Date(Date.now() - 3 * 86_400_000) } });
    await prisma.workRaidItem.create({ data: { projectId: pidA, number: 1, type: 'QUESTION', title: 'Có cần đăng nhập Google?', status: 'OPEN', createdAt: new Date(Date.now() - 9 * 86_400_000) } });
    void type;

    const o = await call(teacher, 'GET', '/teaching/overview');
    assert.equal(o.status, 200, JSON.stringify(o.raw));
    assert.equal(o.data.groups.length, 3);
    const gA = o.data.groups.find((g: any) => g.projectId === pidA);
    assert.deepEqual([gA.classCode, gA.term, gA.subject, gA.groupCode, gA.members.length], ['SE1840', 'FA26', 'SWP391', 'SE1840-G1', 3]);
    assert.equal(gA.issues.overdue, 1);
    assert.deepEqual([gA.qna.open, gA.qna.oldestDays], [1, 9]);
    assert.equal(gA.health.status, 'red', 'câu hỏi chờ ≥ 7 ngày');
    assert.ok(gA.health.reasons.some((r: any) => r.code === 'QNA_WAITING'));
    assert.equal(gA.docs.R1, 'NA', 'SWP391 không yêu cầu Report 1');
    assert.equal(gA.docs.WEEKLY, 'MISSING');
    assert.ok(gA.contrib, 'tín hiệu đóng góp đọc được (TEACHER thấy tất)');
    assert.deepEqual(o.data.facets.classes, ['SE1840', 'SE1901']);
    const f = await call(teacher, 'GET', '/teaching/overview?classCode=se1901');
    assert.equal(f.data.groups.length, 1);
    assert.equal(f.data.groups[0].subject, 'SEP490');
    assert.equal(f.data.groups[0].docs.R1, 'DRAFT', 'mẫu Capstone tạo sẵn trang Report 1 (nháp)');

    const x = await download(teacher, '/teaching/overview.xlsx');
    assert.equal(x.status, 200);
    assert.match(String(x.type), /spreadsheetml/);
    const sheets = readXlsx(x.buf);
    assert.deepEqual(sheets.map((s) => s.name), ['Groups', 'Members', 'Grades']);
    const pdf = await download(teacher, '/teaching/overview.pdf?subject=SWP391');
    assert.equal(pdf.status, 200);
    assert.equal(pdf.buf.subarray(0, 4).toString(), '%PDF');
    assert.equal((await download(alice, '/teaching/overview.xlsx')).status, 403);

    const t = await import('../services/work/teaching.service.js');
    let seen = '';
    t._setTeachingAskForTests(async (_s, user) => { seen = user; return '{"summary":"## Overall\\nGroup LabFlow needs you."}'; });
    const ai = await call(teacher, 'POST', '/teaching/ai-summary', { classCode: 'SE1840', language: 'vi' });
    t._setTeachingAskForTests(null);
    assert.equal(ai.status, 200, JSON.stringify(ai.raw));
    assert.match(ai.data.summary, /LabFlow needs you/);
    assert.match(seen, /SE1840-G1 .*LabFlow/);
    assert.match(seen, /question/);

    // Agent không vào được /grades của dự án (chốt tầng tuyến).
    assert.equal(agentRouteAllowed('GET', '/grades'), false);
    assert.equal(agentRouteAllowed('POST', '/automation/recurring'), false);
  });

  let rubricId = 0;
  it('rubric: từ mẫu SWP391; trọng số sai ⇒ 400; sinh viên không tạo được', async () => {
    const r = await call(teacher, 'POST', '/teaching/rubrics', { templateKey: 'SWP391_ITERATION' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    rubricId = r.data.id;
    assert.equal(r.data.criteria.length, 5);
    const bad = await call(teacher, 'POST', '/teaching/rubrics', { name: 'X', criteria: [{ name: 'A', weight: 50 }, { name: 'B', weight: 40 }] });
    assert.deepEqual([bad.status, bad.code], [400, 'WORK_RUBRIC_WEIGHTS']);
    assert.equal((await call(alice, 'POST', '/teaching/rubrics', { templateKey: 'SWP391_FINAL' })).code, 'WORK_TEACHING_ONLY');
    const list = await call(teacher, 'GET', '/teaching/rubrics');
    assert.ok(list.data.templates.some((x: any) => x.key === 'SEP490_STAGE'));
  });

  it('điểm: giảng viên chấm nhóm + từng người; sinh viên chỉ thấy khi công bố; điểm cá nhân chỉ chính mình; lịch sử', async () => {
    const full = { artifacts: 8, product: 8, loc: 7, process: 9, testing: 6 };
    const team = await call(teacher, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', scores: full, comment: 'Good start', notes: { product: 'Unhappy cases missing on login' } });
    assert.equal(team.status, 200, JSON.stringify(team.raw));
    assert.equal(team.data.total, 7.7, '0,25·8 + 0,35·8 + 0,2·7 + 0,1·9 + 0,1·6');
    assert.equal(team.data.publishedAt, null, 'mặc định là nháp');
    const partial = await call(teacher, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', subjectUserId: alice.id, scores: { loc: 9 } });
    assert.equal(partial.data.total, null, 'chưa chấm đủ tiêu chí ⇒ chưa có tổng');
    const ind = await call(teacher, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', subjectUserId: alice.id, scores: { ...full, loc: 9 } });
    assert.equal(ind.data.id, partial.data.id, 'cùng mốc + cùng người ⇒ sửa đúng dòng');
    assert.equal(ind.data.version, 2);
    assert.equal((await call(teacher, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', subjectUserId: carol.id, scores: full })).code, 'WORK_GRADE_BAD', 'carol không ở nhóm này');
    assert.equal((await call(teacher, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', scores: { product: 11 } })).status, 400);

    // Sinh viên: chưa công bố ⇒ không thấy gì (chỉ biết có bản nháp đang chờ).
    let a = await call(alice, 'GET', `/projects/${pidA}/grades`);
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.deepEqual([a.data.mode, a.data.grades.length, a.data.hiddenDrafts], ['student', 0, 2]);
    assert.equal((await call(alice, 'PUT', `/projects/${pidA}/grades`, { rubricId, milestone: 'SWP-M1', scores: full })).code, 'WORK_GRADES_FORBIDDEN');
    assert.equal((await call(alice, 'POST', `/projects/${pidA}/grades/publish`, { ids: [team.data.id], published: true })).status, 403);

    const pub = await call(teacher, 'POST', `/projects/${pidA}/grades/publish`, { ids: [team.data.id], published: true });
    assert.equal(pub.data.changed, 1);
    a = await call(alice, 'GET', `/projects/${pidA}/grades`);
    assert.equal(a.data.grades.length, 1);
    assert.equal(a.data.grades[0].notes.product, 'Unhappy cases missing on login');
    await call(teacher, 'POST', `/projects/${pidA}/grades/publish`, { ids: [ind.data.id], published: true });
    a = await call(alice, 'GET', `/projects/${pidA}/grades`);
    const b = await call(bob, 'GET', `/projects/${pidA}/grades`);
    assert.equal(a.data.grades.length, 2, 'alice: điểm nhóm + điểm của mình');
    assert.equal(b.data.grades.length, 1, 'bob: chỉ điểm nhóm, không thấy điểm cá nhân của alice');
    assert.equal(b.data.grades[0].subjectUserId, null);
    // Thu hồi ⇒ sinh viên mất lại.
    await call(teacher, 'POST', `/projects/${pidA}/grades/publish`, { ids: [ind.data.id], published: false });
    assert.equal((await call(alice, 'GET', `/projects/${pidA}/grades`)).data.grades.length, 1);
    const h = await call(teacher, 'GET', `/projects/${pidA}/grades/${ind.data.id}/history`);
    assert.deepEqual(h.data.map((x: any) => x.action), ['UNPUBLISH', 'PUBLISH', 'EDIT', 'CREATE']);
    assert.equal((await call(alice, 'GET', `/projects/${pidA}/grades/${ind.data.id}/history`)).status, 403);
    assert.equal((await call(teacher, 'DELETE', `/projects/${pidA}/grades/${team.data.id}`)).status, 409, 'điểm đã công bố phải thu hồi trước khi xoá');
    // Nhóm khác / người ngoài không đọc được.
    assert.equal((await call(carol, 'GET', `/projects/${pidA}/grades`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/projects/${pidA}/grades`)).status, 404);
    // Giảng viên thấy cả nháp + rubric + gợi ý mốc của môn.
    const tv = await call(teacher, 'GET', `/projects/${pidA}/grades`);
    assert.equal(tv.data.mode, 'teacher');
    assert.equal(tv.data.grades.length, 2);
    assert.ok(tv.data.milestoneHints.includes('SWP-M1 (week 3, 15%)'));
    // Rubric đã có điểm: không đổi được bộ tiêu chí; đổi trọng số ⇒ tính lại tổng.
    const rb = (await call(teacher, 'GET', '/teaching/rubrics')).data.rubrics.find((x: any) => x.id === rubricId);
    const drop = await call(teacher, 'PATCH', `/teaching/rubrics/${rubricId}`, { criteria: rb.criteria.slice(1).map((c: any, i: number) => ({ ...c, weight: i === 0 ? 60 : c.weight })) });
    assert.equal(drop.status, 409);
    const reweight = rb.criteria.map((c: any) => ({ ...c, weight: c.key === 'artifacts' ? 35 : c.key === 'loc' ? 10 : c.weight }));
    assert.equal((await call(teacher, 'PATCH', `/teaching/rubrics/${rubricId}`, { criteria: reweight })).status, 200);
    const after = await prisma.workGrade.findUniqueOrThrow({ where: { id: team.data.id } });
    assert.equal(after.total, 7.8, '0,35·8 + 0,35·8 + 0,1·7 + 0,1·9 + 0,1·6');
    // Hub đếm điểm.
    const o = await call(teacher, 'GET', '/teaching/overview?classCode=SE1840');
    assert.deepEqual(o.data.groups.find((g: any) => g.projectId === pidA).grades, { total: 2, published: 1, latestMilestone: 'SWP-M1' });
  });

  it('việc định kỳ: chỉ ADMIN dự án tạo; theo giờ + múi giờ dự án; chống trùng kể cả chạy song song', async () => {
    const { runRecurringRules } = await import('../services/work/recurring.service.js');
    const typeA = await prisma.workIssueType.findFirstOrThrow({ where: { projectId: pidA, key: 'TASK' }, select: { id: true } });
    const body = (typeId: number, assigneeId = alice.id) => ({
      name: 'Weekly Report', recurrence: { freq: 'WEEKLY', byWeekday: [5], hour: 16, minute: 0, startDate: '2026-10-02' },
      issue: { title: 'Nộp Weekly Report tuần {week} ({date})', typeId, assigneeId, dueInDays: 0, priority: 2 },
    });
    assert.equal((await call(bob, 'POST', `/projects/${pidA}/automation/recurring`, body(typeA.id))).status, 403, 'MEMBER không cấu hình được');
    const bad = await call(alice, 'POST', `/projects/${pidA}/automation/recurring`, { ...body(typeA.id), recurrence: { freq: 'WEEKLY', startDate: '2026-13-40' } });
    assert.equal(bad.status, 400);
    const r = await call(alice, 'POST', `/projects/${pidA}/automation/recurring`, body(typeA.id));
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    const pv = await call(alice, 'POST', `/projects/${pidA}/automation/recurring/preview`, { recurrence: body(0).recurrence, title: 'Weekly {week}' });
    assert.equal(pv.data.rrule, 'FREQ=WEEKLY;BYDAY=FR;BYHOUR=16;BYMINUTE=0');
    // Không lẫn vào danh sách luật Automation thường.
    const auto = await call(alice, 'GET', `/projects/${pidA}/automation`);
    if (auto.status === 200) assert.equal(auto.data.filter?.((x: any) => x.trigger === 'scheduled.recurring').length ?? 0, 0);

    // Nhóm C ở New York.
    assert.equal((await call(carol, 'PUT', `/projects/${pidC}/automation/recurring/timezone`, { timezone: 'America/New_York' })).data.timezone, 'America/New_York');
    assert.equal((await call(carol, 'PUT', `/projects/${pidC}/automation/recurring/timezone`, { timezone: 'Mars/Base' })).code, 'WORK_BAD_TIMEZONE');
    const typeC = await prisma.workIssueType.findFirstOrThrow({ where: { projectId: pidC, key: 'TASK' }, select: { id: true } });
    assert.equal((await call(carol, 'POST', `/projects/${pidC}/automation/recurring`, body(typeC.id, carol.id))).status, 201);
    const ids = { projectIds: [pidA, pidC] };

    // Thứ Sáu 09/10/2026 08:59Z = 15:59 VN ⇒ chưa.
    assert.equal(await runRecurringRules(new Date('2026-10-09T08:59:00Z'), ids), 0);
    // 09:30Z = 16:30 VN (nhóm A đến hạn) nhưng mới 05:30 ở New York (nhóm C chưa). Hai lượt SONG SONG ⇒ đúng 1 thẻ.
    const [x1, x2] = await Promise.all([runRecurringRules(new Date('2026-10-09T09:30:00Z'), ids), runRecurringRules(new Date('2026-10-09T09:30:00Z'), ids)]);
    assert.equal(x1 + x2, 1);
    assert.equal(await runRecurringRules(new Date('2026-10-09T10:30:00Z'), ids), 0, 'giờ sau: đã có khoá rec:<id>:2026-10-09');
    const made = await prisma.workIssue.findMany({ where: { projectId: pidA, title: { startsWith: 'Nộp Weekly Report' } } });
    assert.equal(made.length, 1);
    assert.equal(made[0].title, 'Nộp Weekly Report tuần 2 (09/10/2026)');
    assert.equal(made[0].assigneeId, alice.id);
    assert.equal(made[0].dueDate?.toISOString().slice(0, 10), '2026-10-09');
    // 20:30Z = 16:30 New York ⇒ nhóm C tạo.
    assert.equal(await runRecurringRules(new Date('2026-10-09T20:30:00Z'), ids), 1);
    assert.equal(await prisma.workIssue.count({ where: { projectId: pidC, title: { startsWith: 'Nộp Weekly Report' } } }), 1);
    const list = await call(alice, 'GET', `/projects/${pidA}/automation/recurring`);
    assert.equal(list.data.rules[0].recent[0].occurrence, '2026-10-09');
    assert.equal(list.data.rules[0].runCount, 1);
    assert.equal(list.data.rules[0].rrule, 'FREQ=WEEKLY;BYDAY=FR;BYHOUR=16;BYMINUTE=0');
    // Tắt ⇒ không chạy.
    assert.equal((await call(alice, 'PATCH', `/projects/${pidA}/automation/recurring/${r.data.id}`, { ...body(typeA.id), enabled: false })).status, 200);
    assert.equal(await runRecurringRules(new Date('2026-10-16T09:30:00Z'), { projectIds: [pidA] }), 0);
  });

  it('tuần 1: checklist đọc từ dữ liệu thật, có link đúng tính năng', async () => {
    const w = await call(bob, 'GET', `/projects/${pidA}/week1`);
    assert.equal(w.status, 200, JSON.stringify(w.raw));
    const by = Object.fromEntries(w.data.items.map((i: any) => [i.id, i]));
    assert.equal(w.data.total, 12);
    assert.equal(by.course.done, true, 'lớp điền sẵn môn/lớp/giảng viên');
    assert.equal(by.team.done, true);
    assert.equal(by.recurring.done, true);
    assert.equal(by.qna.done, true);
    assert.equal(by.github.done, false);
    assert.match(by.github.href, /\/settings\?tab=github$/);
    assert.equal(by.subject.variant, 'requirements');
    assert.equal(w.data.class.classCode, 'SE1840');
  });

  // QA 10/10 P2-2: admin xoá giảng viên đã chấm (DELETE /admin/users/:id = prisma.user.delete) từng nổ P2003
  // work_grades_rubric_id_fkey — rubric Cascade theo người tạo, điểm Restrict theo rubric. Giờ rubric SET NULL người tạo.
  it('xoá tài khoản giảng viên đã chấm + công bố ⇒ xoá được; điểm đã công bố + lịch sử của sinh viên còn nguyên', async () => {
    const before = await prisma.workGrade.findMany({ where: { projectId: pidA }, select: { id: true, publishedAt: true, total: true, rubricId: true } });
    assert.ok(before.some((g) => g.publishedAt), 'có điểm đã công bố trước khi xoá');
    const histBefore = await prisma.workGradeHistory.count({ where: { gradeId: { in: before.map((g) => g.id) } } });

    await prisma.user.delete({ where: { id: teacher.id } }); // từng ném P2003

    const after = await prisma.workGrade.findMany({ where: { projectId: pidA }, select: { id: true, publishedAt: true, total: true, rubricId: true } });
    assert.deepEqual(after, before, 'không mất / đổi điểm nào');
    assert.equal(await prisma.workGradeHistory.count({ where: { gradeId: { in: before.map((g) => g.id) } } }), histBefore);
    const rb = await prisma.workRubric.findUniqueOrThrow({ where: { id: rubricId }, select: { ownerId: true } });
    assert.equal(rb.ownerId, null, 'rubric mồ côi, không bị xoá');
    // Sinh viên vẫn đọc được điểm đã công bố (kèm rubric), người chấm hiện null.
    const a = await call(alice, 'GET', `/projects/${pidA}/grades`);
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.grades.length, 1);
    assert.equal(a.data.grades[0].rubric.id, rubricId);
    assert.equal(a.data.grades[0].rubric.ownerId, null);
    assert.equal(a.data.grades[0].grader, null);
  });
});
