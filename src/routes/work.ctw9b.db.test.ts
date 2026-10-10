/**
 * CTW đợt 9b — Bài tập lớp + nộp/trả bài + sổ điểm qua HTTP thật trên Postgres cục bộ (R2 = sandbox trong RAM):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw9b.db.test.ts
 *
 * Kịch bản: giảng viên + alice, bob (nhóm 1), carol (nhóm 2), dave (không nhóm) ⇒ agent 403 mọi lệnh, người ngoài 404 ⇒
 * bài cá nhân: nộp tệp (PDF thật nhận, .exe đổi tên bị chặn), nộp lại giữ lịch sử, huỷ nộp ⇒ SV không thấy bài nộp / tệp /
 * điểm của người khác ⇒ điểm nháp ẩn tới khi trả, sửa sau khi trả vẫn ẩn ⇒ nộp muộn + mức trừ, khoá nộp muộn ⇒ bài nhóm:
 * một bài nộp chung, điểm chỉnh từng người ⇒ nhắc hạn đúng một lần ⇒ sổ điểm: SV chỉ thấy dòng mình, xuất xlsx, nhập xlsx
 * có xem trước lỗi + xác nhận.
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
import { readXlsx, writeXlsx, XSheet } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c9b${Date.now().toString(36)}`;
const userIds: number[] = [];
const DAY = 86_400_000;

type U = { id: number; token: string; email: string };

describe('CTW đợt 9b — bài tập, nộp/trả bài, sổ điểm (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let teacher: U, alice: U, bob: U, carol: U, dave: U, outsider: U;
  let agentToken = '', agentUserId = 0, wsId = 0;
  let classId = 0, g1 = 0, g2 = 0;
  let a1 = 0, aGroup = 0;
  let aliceFile = 0;

  async function mkUser(name: string, kind: 'HUMAN' | 'AGENT' = 'HUMAN'): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, displayName: name[0].toUpperCase() + name.slice(1), kind } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: Pick<U, 'token'>, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function upload(u: U, path: string, name: string, buf: Buffer) {
    const fd = new FormData();
    fd.append('file', new Blob([new Uint8Array(buf)]), name);
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: fd });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined };
  }
  async function bells(u: U, contains: string) {
    const rows = await prisma.socialNotification.findMany({ where: { receiverId: u.id }, select: { payload: true } });
    return rows.filter((r) => JSON.stringify(r.payload ?? {}).includes(contains)).length;
  }
  const pdf = Buffer.from('%PDF-1.7\n1 0 obj << >> endobj\ntrailer\n%%EOF');

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [teacher, alice, bob, carol, dave, outsider] = await Promise.all(['teacher', 'alice', 'bob', 'carol', 'dave', 'outsider'].map((n) => mkUser(n)));
    const c = await call(teacher, 'POST', '/classes', { subject: 'SWP391', classCode: 'SE1999', term: 'FA26' });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    classId = c.data.id;
    g1 = (await prisma.workClassGroup.create({ data: { classId, number: 1, name: 'Group 1' } })).id;
    g2 = (await prisma.workClassGroup.create({ data: { classId, number: 2, name: 'Group 2' } })).id;
    const seat = (u: U, code: string, groupId: number | null) => prisma.workClassStudent.create({ data: { classId, userId: u.id, email: u.email, studentCode: code, fullName: u.email.split('_')[1].split('@')[0], groupId, source: 'JOIN', joinedAt: new Date() } });
    // Agent THẬT (token ctw_ scope agent) của một không gian của giảng viên — ngồi sẵn một ghế trong lớp để chắc chắn bị chặn
    // vì là AGENT chứ không phải vì không thuộc lớp.
    wsId = (await call(teacher, 'POST', '/workspaces', { name: `CTW9b ${tag}` })).data.id;
    const ag = await call(teacher, 'POST', `/workspaces/${wsId}/agents`, { name: 'Class bot', model: 'gpt-6-sol' });
    assert.equal(ag.status, 201, JSON.stringify(ag.raw));
    agentToken = ag.data.token.token;
    agentUserId = (await prisma.workAgent.findFirstOrThrow({ where: { workspaceId: wsId }, select: { userId: true } })).userId;
    await prisma.workClassStudent.create({ data: { classId, userId: agentUserId, email: `${tag}_agent@agents.invalid`, studentCode: 'AGENT01', groupId: g1, source: 'JOIN' } });
    await seat(alice, 'HE190001', g1); await seat(bob, 'HE190002', g1); await seat(carol, 'HE190003', g2); await seat(dave, 'HE190004', null);
  });

  after(async () => {
    server?.close();
    const agentUsers = await prisma.workAgent.findMany({ where: { workspaceId: wsId }, select: { userId: true } }).catch(() => []);
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    userIds.push(...agentUsers.map((a) => a.userId));
    if (userIds.length) {
      await prisma.workApiToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.workClass.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('agent ⇒ 403 ở mọi lệnh (đọc lẫn ghi) ở cả tuyến lẫn service; người ngoài ⇒ 404; SV không tạo bài được', async () => {
    for (const [m, p, b] of [
      ['GET', `/classes/${classId}/assignments`], ['POST', `/classes/${classId}/assignments`, { title: 'x' }], ['GET', `/classes/${classId}/gradebook`],
      ['PUT', `/classes/${classId}/gradebook/settings`, { mode: 'POINTS' }], ['POST', `/classes/${classId}/submission-comments`, { assignmentId: 1, body: 'x' }],
      ['GET', `/classes/${classId}/gradebook.xlsx`],
    ] as Array<[string, string, unknown?]>) {
      const r = await call({ token: agentToken }, m, p, b);
      assert.equal(r.status, 403, `${m} ${p}`);
    }
    // Tầng service (phòng khi một tuyến mới lọt danh sách trắng): agent ngồi ghế lớp vẫn bị chặn.
    const cw = await import('../services/work/classwork.service.js');
    const gb = await import('../services/work/classGradebook.service.js');
    for (const fn of [() => cw.listAssignments(agentUserId, classId), () => cw.createAssignment(agentUserId, classId, { title: 'x' }), () => gb.gradebook(agentUserId, classId), () => cw.turnIn(agentUserId, classId, 1)]) {
      await assert.rejects(fn, (e: any) => e.statusCode === 403 && e.code === 'WORK_AGENT_FORBIDDEN');
    }
    await prisma.workClassStudent.deleteMany({ where: { classId, userId: agentUserId } });
    assert.equal((await call(outsider, 'GET', `/classes/${classId}/assignments`)).status, 404);
    assert.equal((await call(alice, 'POST', `/classes/${classId}/assignments`, { title: 'x', publish: 'NOW' })).status, 403);
  });

  it('giao bài cá nhân ⇒ SV thấy + chuông; nháp không thấy', async () => {
    const draft = await call(teacher, 'POST', `/classes/${classId}/assignments`, { title: 'Draft only' });
    assert.equal(draft.status, 201, JSON.stringify(draft.raw));
    assert.equal(draft.data.state, 'DRAFT');
    const r = await call(teacher, 'POST', `/classes/${classId}/assignments`, {
      title: 'Lab 1 — ERD', description: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Draw the ERD' }] }] },
      maxPoints: 10, dueAt: new Date(Date.now() + 2 * DAY).toISOString(), publish: 'NOW', category: 'Lab', topic: 'Week 1', latePenaltyPct: 10,
    });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    a1 = r.data.id;
    assert.equal(r.data.state, 'PUBLISHED');
    assert.equal(r.data.descriptionText, 'Draw the ERD');
    const list = await call(alice, 'GET', `/classes/${classId}/assignments`);
    assert.deepEqual(list.data.assignments.map((x: any) => x.title), ['Lab 1 — ERD']);
    assert.equal(list.data.assignments[0].my.state, 'ASSIGNED');
    assert.equal((await call(alice, 'GET', `/classes/${classId}/assignments/${draft.data.id}`)).status, 404, 'nháp ẩn với SV');
    assert.ok((await bells(alice, 'New assignment: Lab 1')) >= 1);
  });

  it('nộp tệp: PDF thật nhận, .exe đổi tên bị chặn; nộp ⇒ khoá sửa; huỷ nộp; nộp lại giữ lịch sử', async () => {
    const bad = await upload(alice, `/classes/${classId}/assignments/${a1}/my/files`, 'bai.pdf', Buffer.concat([Buffer.from('MZ'), Buffer.alloc(64, 7)]));
    assert.deepEqual([bad.status, bad.code], [400, 'WORK_CLASS_FILE_SIGNATURE']);
    assert.equal((await upload(alice, `/classes/${classId}/assignments/${a1}/my/files`, 'run.exe', pdf)).code, 'WORK_CLASS_FILE_BLOCKED');
    const ok = await upload(alice, `/classes/${classId}/assignments/${a1}/my/files`, 'Báo cáo.pdf', pdf);
    assert.equal(ok.status, 201, JSON.stringify(ok));
    aliceFile = ok.data.id;
    assert.equal(ok.data.mime, 'application/pdf');
    assert.equal(ok.data.fileName, 'Báo cáo.pdf', 'tên tiếng Việt giữ nguyên');
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/assignments/${a1}/my`, { text: 'v1', links: ['https://github.com/alice/erd'] })).status, 200);
    const t1 = await call(alice, 'POST', `/classes/${classId}/assignments/${a1}/my/turn-in`);
    assert.equal(t1.status, 200, JSON.stringify(t1.raw));
    assert.equal(t1.data.submission.state, 'TURNED_IN');
    assert.equal(t1.data.submission.late, false);
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/assignments/${a1}/my`, { text: 'sửa lén' })).code, 'WORK_CLASSWORK_TURNED_IN');
    assert.equal((await call(alice, 'POST', `/classes/${classId}/assignments/${a1}/my/unsubmit`)).status, 200);
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/assignments/${a1}/my`, { text: 'v2' })).status, 200);
    const del = await call(alice, 'DELETE', `/classes/${classId}/assignments/${a1}/my/files/${aliceFile}`);
    assert.equal(del.status, 200);
    const again = await upload(alice, `/classes/${classId}/assignments/${a1}/my/files`, 'v2.pdf', pdf);
    assert.equal(again.status, 201);
    const t2 = await call(alice, 'POST', `/classes/${classId}/assignments/${a1}/my/turn-in`);
    assert.equal(t2.status, 200);
    const s = t2.data.submission;
    assert.equal(s.version, 2);
    assert.deepEqual(s.versions.map((v: any) => [v.action, v.version, v.text]), [['TURN_IN', 2, 'v2'], ['UNSUBMIT', 1, 'v1'], ['TURN_IN', 1, 'v1']]);
    assert.deepEqual(s.versions[2].files.map((f: any) => f.fileName), ['Báo cáo.pdf'], 'tệp đã gỡ vẫn mở được trong lịch sử');
    assert.deepEqual(s.files.map((f: any) => f.fileName), ['v2.pdf']);
    const url = await call(alice, 'GET', `/classes/${classId}/files/${aliceFile}`);
    assert.equal(url.status, 200);
    assert.ok(String(url.data.url).length > 10);
  });

  it('SV không xem được bài nộp / tệp / nhận xét của người khác, không vào được trang chấm', async () => {
    const b = await call(bob, 'GET', `/classes/${classId}/assignments/${a1}`);
    assert.equal(b.status, 200);
    assert.equal(b.data.submission.id, null, 'bob chưa nộp ⇒ không thấy gì của alice');
    assert.equal(b.data.submission.text, null);
    assert.equal((await call(bob, 'GET', `/classes/${classId}/files/${aliceFile}`)).status, 404);
    assert.equal((await call(bob, 'GET', `/classes/${classId}/assignments/${a1}/submissions`)).status, 403);
    assert.equal((await call(bob, 'GET', `/classes/${classId}/assignments/${a1}/submissions/U${alice.id}`)).status, 403);
    const aliceSub = (await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`)).data.submission.id;
    assert.equal((await call(bob, 'POST', `/classes/${classId}/submission-comments`, { submissionId: aliceSub, body: 'xem trộm' })).status, 404);
    assert.equal((await call(bob, 'PUT', `/classes/${classId}/assignments/${a1}/grade`, { ownerKey: `U${bob.id}`, points: 10 })).status, 403);
  });

  it('nhận xét riêng hai chiều GV ↔ SV', async () => {
    const sub = (await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`)).data.submission.id;
    assert.equal((await call(alice, 'POST', `/classes/${classId}/submission-comments`, { submissionId: sub, body: 'Thầy ơi em nộp rồi ạ' })).status, 201);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/submission-comments`, { submissionId: sub, body: 'Thiếu khoá ngoại' })).status, 201);
    const view = await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`);
    assert.deepEqual(view.data.submission.comments.map((c: any) => c.body), ['Thầy ơi em nộp rồi ạ', 'Thiếu khoá ngoại']);
    const t = await call(teacher, 'GET', `/classes/${classId}/assignments/${a1}/submissions/U${alice.id}`);
    assert.equal(t.data.comments.length, 2);
  });

  it('điểm nháp ẩn với SV; trả ⇒ thấy; sửa sau khi trả vẫn ẩn tới lần trả kế', async () => {
    const g = await call(teacher, 'PUT', `/classes/${classId}/assignments/${a1}/grade`, { ownerKey: `U${alice.id}`, points: 8 });
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    let v = await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`);
    assert.equal(v.data.submission.grade.points, null, 'nháp không lộ');
    assert.equal(JSON.stringify(v.raw).includes('"points":8'), false, 'không lọt điểm 8 ở bất kỳ trường nào');
    let gb = await call(alice, 'GET', `/classes/${classId}/gradebook`);
    assert.equal(gb.data.rows.length, 1, 'SV chỉ thấy dòng của mình');
    assert.equal(gb.data.rows[0].userId, alice.id);
    assert.equal(gb.data.rows[0].cells[`assignment:${a1}`].points, null);
    const tg = await call(teacher, 'GET', `/classes/${classId}/gradebook`);
    const cell = tg.data.rows.find((r: any) => r.userId === alice.id).cells[`assignment:${a1}`];
    assert.deepEqual([cell.points, cell.released], [8, false], 'GV thấy nháp, đánh dấu chưa trả');

    const ret = await call(teacher, 'POST', `/classes/${classId}/assignments/${a1}/return`, { ownerKeys: [`U${alice.id}`] });
    assert.equal(ret.data.returned, 1);
    v = await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`);
    assert.equal(v.data.submission.grade.points, 8);
    assert.equal(v.data.submission.state, 'RETURNED');
    assert.ok((await bells(alice, 'Your work was returned')) >= 1);

    await call(teacher, 'PUT', `/classes/${classId}/assignments/${a1}/grade`, { ownerKey: `U${alice.id}`, points: 6 });
    v = await call(alice, 'GET', `/classes/${classId}/assignments/${a1}`);
    assert.equal(v.data.submission.grade.points, 8, 'sửa sau khi trả vẫn là nháp');
    gb = await call(alice, 'GET', `/classes/${classId}/gradebook`);
    assert.equal(gb.data.rows[0].cells[`assignment:${a1}`].points, 8);
    const list = await call(teacher, 'GET', `/classes/${classId}/assignments/${a1}/submissions`);
    const row = list.data.rows.find((r: any) => r.ownerKey === `U${alice.id}`);
    assert.equal(row.regradedSinceReturn, true);
    assert.equal(list.data.rows.length, 4, 'cá nhân: mọi SV có tài khoản');
  });

  it('nộp muộn: đánh dấu + trừ %/ngày; khoá nộp muộn ⇒ 409', async () => {
    const r = await call(teacher, 'POST', `/classes/${classId}/assignments`, { title: 'Late lab', maxPoints: 10, dueAt: new Date(Date.now() + DAY).toISOString(), publish: 'NOW', latePenaltyPct: 15, latePenaltyMaxPct: 40 });
    const aid = r.data.id;
    await prisma.workClassAssignment.update({ where: { id: aid }, data: { dueAt: new Date(Date.now() - 2 * DAY - 3_600_000) } });
    await call(carol, 'PUT', `/classes/${classId}/assignments/${aid}/my`, { text: 'muộn' });
    const t = await call(carol, 'POST', `/classes/${classId}/assignments/${aid}/my/turn-in`);
    assert.equal(t.status, 200, JSON.stringify(t.raw));
    assert.equal(t.data.submission.late, true);
    const list = await call(teacher, 'GET', `/classes/${classId}/assignments/${aid}/submissions`);
    const row = list.data.rows.find((x: any) => x.ownerKey === `U${carol.id}`);
    assert.equal(row.state, 'LATE');
    assert.equal(row.penaltyPct, 40, '3 ngày × 15% = 45% ⇒ trần 40%');
    assert.equal(list.data.rows.find((x: any) => x.ownerKey === `U${dave.id}`).state, 'MISSING');
    await call(teacher, 'PUT', `/classes/${classId}/assignments/${aid}/grade`, { ownerKey: `U${carol.id}`, points: 10 });
    await call(teacher, 'POST', `/classes/${classId}/assignments/${aid}/return`, { ownerKeys: [`U${carol.id}`] });
    const v = await call(carol, 'GET', `/classes/${classId}/assignments/${aid}`);
    assert.deepEqual([v.data.submission.grade.points, v.data.submission.grade.rawPoints, v.data.submission.grade.penaltyPct], [6, 10, 40]);

    const locked = await call(teacher, 'POST', `/classes/${classId}/assignments`, { title: 'Locked', dueAt: new Date(Date.now() + DAY).toISOString(), publish: 'NOW', allowLate: false });
    await prisma.workClassAssignment.update({ where: { id: locked.data.id }, data: { dueAt: new Date(Date.now() - 60_000) } });
    await call(dave, 'PUT', `/classes/${classId}/assignments/${locked.data.id}/my`, { text: 'trễ' });
    assert.equal((await call(dave, 'POST', `/classes/${classId}/assignments/${locked.data.id}/my/turn-in`)).code, 'WORK_CLASSWORK_LATE_LOCKED');
  });

  it('bài nhóm: một bài nộp chung, điểm chỉnh từng người; SV không nhóm không được giao', async () => {
    const r = await call(teacher, 'POST', `/classes/${classId}/assignments`, { title: 'Group report', kind: 'GROUP', maxPoints: 10, dueAt: new Date(Date.now() + 3 * DAY).toISOString(), publish: 'NOW', category: 'Project' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    aGroup = r.data.id;
    assert.equal((await call(dave, 'GET', `/classes/${classId}/assignments/${aGroup}`)).status, 404, 'dave chưa có nhóm ⇒ không được giao');
    await call(alice, 'PUT', `/classes/${classId}/assignments/${aGroup}/my`, { text: 'Bản của nhóm 1', links: ['https://drive.google.com/file/x'] });
    const bobView = await call(bob, 'GET', `/classes/${classId}/assignments/${aGroup}`);
    assert.equal(bobView.data.submission.text, 'Bản của nhóm 1', 'bob thấy bài chung của nhóm');
    assert.equal(bobView.data.submission.links[0].label, 'Google Drive');
    assert.equal((await call(carol, 'GET', `/classes/${classId}/assignments/${aGroup}`)).data.submission.text, null, 'nhóm 2 không thấy bài nhóm 1');
    assert.equal((await call(bob, 'POST', `/classes/${classId}/assignments/${aGroup}/my/turn-in`)).status, 200);
    const list = await call(teacher, 'GET', `/classes/${classId}/assignments/${aGroup}/submissions`);
    assert.deepEqual(list.data.rows.map((x: any) => x.ownerKey).sort(), [`G${g1}`, `G${g2}`].sort());
    const g = await call(teacher, 'PUT', `/classes/${classId}/assignments/${aGroup}/grade`, { ownerKey: `G${g1}`, points: 9, memberPoints: { [String(bob.id)]: 7 } });
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal((await call(teacher, 'PUT', `/classes/${classId}/assignments/${aGroup}/grade`, { ownerKey: `G${g1}`, memberPoints: { [String(carol.id)]: 1 } })).status, 400, 'carol không ở nhóm 1');
    await call(teacher, 'POST', `/classes/${classId}/assignments/${aGroup}/return`, { ownerKeys: [`G${g1}`] });
    assert.equal((await call(alice, 'GET', `/classes/${classId}/assignments/${aGroup}`)).data.submission.grade.points, 9);
    assert.equal((await call(bob, 'GET', `/classes/${classId}/assignments/${aGroup}`)).data.submission.grade.points, 7);
  });

  it('nhắc hạn 24h: đúng một lần, chỉ người chưa nộp', async () => {
    const { runDueReminders } = await import('../services/work/classwork.service.js');
    const r = await call(teacher, 'POST', `/classes/${classId}/assignments`, { title: 'Due soon', dueAt: new Date(Date.now() + 12 * 3_600_000).toISOString(), publish: 'NOW' });
    const aid = r.data.id;
    await call(alice, 'PUT', `/classes/${classId}/assignments/${aid}/my`, { text: 'xong' });
    await call(alice, 'POST', `/classes/${classId}/assignments/${aid}/my/turn-in`);
    const [first, second] = await Promise.all([runDueReminders(), runDueReminders()]);
    const third = await runDueReminders();
    assert.ok(first + second >= 3, `nhắc bob, carol, dave (được ${first + second})`);
    assert.equal(third, 0);
    assert.equal(await bells(bob, 'Due in less than 24 hours: Due soon'), 1, 'đúng một lần dù hai lượt chạy song song');
    assert.equal(await bells(alice, 'Due in less than 24 hours: Due soon'), 0, 'đã nộp ⇒ không nhắc');
  });

  it('sổ điểm: trọng số theo loại, xuất xlsx, nhập xlsx (xem trước lỗi + xác nhận)', async () => {
    const bad = await call(teacher, 'PUT', `/classes/${classId}/gradebook/settings`, { mode: 'CATEGORY', weights: { Lab: 50, Project: 30 } });
    assert.equal(bad.code, 'WORK_GRADEBOOK_WEIGHTS');
    const s = await call(teacher, 'PUT', `/classes/${classId}/gradebook/settings`, { mode: 'CATEGORY', weights: { Lab: 50, Project: 30, Assignment: 20 } });
    assert.equal(s.status, 200, JSON.stringify(s.raw));
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/gradebook/settings`, { mode: 'POINTS' })).status, 403);
    const aliceRow = (await call(alice, 'GET', `/classes/${classId}/gradebook`)).data.rows[0];
    // Lab 1 đã trả = 8/10, Group report = 9/10 ⇒ (0.8×50 + 0.9×30) / 80 = 0.8375 ⇒ 8.38
    assert.equal(aliceRow.total, 8.38);

    const res = await fetch(`${base}/api/v1/work/classes/${classId}/gradebook.xlsx`, { headers: { Authorization: `Bearer ${teacher.token}` } });
    assert.equal(res.status, 200);
    const sheets = readXlsx(Buffer.from(await res.arrayBuffer()));
    assert.equal(sheets[0].text(1, 1), 'Student code');
    assert.ok(sheets[0].maxRow >= 5);

    const x = new XSheet('Import');
    ['MSSV', 'Name', 'Lab 1 — ERD (10)', 'Unknown col'].forEach((h, i) => x.set(1, i + 1, h));
    [['HE190002', 'Bob', 7.5], ['HE190003', 'Carol', 12], ['HE999999', 'Ghost', 5], ['HE190004', 'Dave', 4]].forEach((r, i) => r.forEach((v, j) => x.set(i + 2, j + 1, v)));
    const xlsxBase64 = writeXlsx([x]).toString('base64');
    const pv = await call(teacher, 'POST', `/classes/${classId}/gradebook/import/preview`, { xlsxBase64 });
    assert.equal(pv.status, 200, JSON.stringify(pv.raw));
    assert.deepEqual(pv.data.rows.map((r: any) => r.errors), [[], ['OVER_MAX:Lab 1 — ERD (10)'], ['UNKNOWN_STUDENT'], []]);
    assert.equal(pv.data.columns.find((c: any) => c.header === 'Unknown col').reason, 'NO_MATCH');
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/gradebook/import`, { xlsxBase64 })).code, 'WORK_CONFIRM_REQUIRED');
    assert.equal((await call(alice, 'POST', `/classes/${classId}/gradebook/import/preview`, { xlsxBase64 })).status, 403);
    const im = await call(teacher, 'POST', `/classes/${classId}/gradebook/import`, { xlsxBase64, confirm: true });
    assert.equal(im.data.written, 2);
    const tg = await call(teacher, 'GET', `/classes/${classId}/gradebook`);
    const bobCell = tg.data.rows.find((r: any) => r.userId === bob.id).cells[`assignment:${a1}`];
    assert.deepEqual([bobCell.points, bobCell.released], [7.5, false], 'điểm nhập là NHÁP');
    assert.equal((await call(bob, 'GET', `/classes/${classId}/gradebook`)).data.rows[0].cells[`assignment:${a1}`].points, null, 'bob chưa thấy tới khi trả');
  });

  it('lịch lớp: hạn bài — SV chỉ thấy bài được giao', async () => {
    const t = await call(teacher, 'GET', `/classes/${classId}/deadlines`);
    const d = await call(dave, 'GET', `/classes/${classId}/deadlines`);
    assert.ok(t.data.some((x: any) => x.refId === aGroup));
    assert.equal(d.data.some((x: any) => x.refId === aGroup), false, 'dave không có nhóm ⇒ không thấy hạn bài nhóm');
  });
});
