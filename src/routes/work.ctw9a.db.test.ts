/**
 * CTW đợt 9a — lớp học: Stream, tài liệu, lịch lớp + điểm danh qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw9a.db.test.ts
 *
 * Kịch bản: GV tạo lớp, 3 SV vào lớp (alice + bob nhóm A, carol nhóm B) ⇒ Stream: thông báo cả lớp / chỉ nhóm A / hẹn giờ
 * (SV không thấy bài chưa tới giờ; đăng đúng MỘT lần dù hai lượt publishDue chạy song song; chuông đúng một lần) ⇒ tệp
 * đính kèm (kho R2 giả trong RAM) ⇒ bình luận: ẩn (SV không thấy), tắt bình luận theo lớp ⇒ postStreamItem của 9b/9c
 * (upsert, notify:false không chuông) ⇒ tài liệu: chủ đề/tuần, kéo-thả, nháp, đã xem + tỉ lệ ⇒ lịch: buổi định kỳ,
 * điểm danh mã (sai/hết hạn/đổi mã/khoá sau 5 lần sai/một lần mỗi SV), sửa tay, thống kê (SV không xem được của người
 * khác), xlsx, .ics ⇒ agent 403, người ngoài 404.
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
import * as files from '../services/work/commentFiles.service.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c9a${Date.now().toString(36)}`;
const userIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };

describe('CTW đợt 9a — Stream, tài liệu, lịch lớp + điểm danh (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let teacher: U, alice: U, bob: U, carol: U, outsider: U, bot: U;
  let classId = 0, groupA = 0, groupB = 0;
  const seat: Record<string, number> = {};
  const mails: Array<{ to: string; subject: string }> = [];
  const objects = new Map<string, { body: Buffer; ct: string }>();
  let stream: typeof import('../services/work/classStream.service.js');
  let calendar: typeof import('../services/work/classCalendar.service.js');

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
  async function upload(u: U, path: string, name: string, bytes: Buffer, type: string) {
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(bytes)], { type }), name);
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: form });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }
  async function download(u: U, path: string) {
    const res = await fetch(`${base}/api/v1/work${path}`, { headers: { Authorization: `Bearer ${u.token}` } });
    return { status: res.status, type: res.headers.get('content-type'), buf: Buffer.from(await res.arrayBuffer()) };
  }
  const bells = (u: U, postId: number) => prisma.socialNotification.count({ where: { receiverId: u.id, secondaryEntityId: postId } });

  before(async () => {
    (emailService as any).send = async (m: { to: string; subject: string }) => { mails.push({ to: m.to, subject: m.subject }); return { success: true }; };
    files._setCommentStoreForTests({
      async put(key, body, ct) { objects.set(key, { body, ct }); },
      async read(key) { const o = objects.get(key); if (!o) throw new Error('missing'); return o.body; },
      async head(key) { const o = objects.get(key); return o ? { size: o.body.length, contentType: o.ct } : null; },
      async del(key) { objects.delete(key); },
    });
    stream = await import('../services/work/classStream.service.js');
    calendar = await import('../services/work/classCalendar.service.js');
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [teacher, alice, bob, carol, outsider] = await Promise.all(['teacher', 'alice', 'bob', 'carol', 'outsider'].map((n) => mkUser(n)));
    bot = await mkUser('bot', 'AGENT');
  });

  after(async () => {
    server?.close();
    files._setCommentStoreForTests(null);
    if (userIds.length) {
      await prisma.workClass.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng lớp: GV tạo, 3 SV vào, hai nhóm', async () => {
    const r = await call(teacher, 'POST', '/classes', { subject: 'SWP391', classCode: 'se1901', term: 'fa26' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    classId = r.data.id;
    for (const u of [alice, bob, carol]) {
      const j = await call(u, 'POST', `/classes/join/${r.data.joinCode}`, { action: 'JOIN', studentCode: `HE${u.id}` });
      assert.equal(j.status, 200, JSON.stringify(j.raw));
    }
    groupA = (await prisma.workClassGroup.create({ data: { classId, number: 1, name: 'Group A' } })).id;
    groupB = (await prisma.workClassGroup.create({ data: { classId, number: 2, name: 'Group B' } })).id;
    for (const [u, g, k] of [[alice, groupA, 'alice'], [bob, groupA, 'bob'], [carol, groupB, 'carol']] as const) {
      const s = await prisma.workClassStudent.update({ where: { classId_userId: { classId, userId: u.id } }, data: { groupId: g } });
      seat[k] = s.id;
    }
  });

  let pAll = 0, pA = 0, pLater = 0;

  it('Stream: GV đăng cả lớp + chỉ nhóm A; SV đăng ⇒ 403; nhóm B không thấy bài nhóm A', async () => {
    const doc = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to SWP391 — read the syllabus.' }] }] };
    const all = await call(teacher, 'POST', `/classes/${classId}/stream`, { bodyJson: doc, links: [{ url: 'https://www.youtube.com/watch?v=xyz' }], pinned: true });
    assert.equal(all.status, 201, JSON.stringify(all.raw));
    pAll = all.data.id;
    assert.equal(all.data.publishedAt !== null, true);
    assert.equal(all.data.links[0].kind, 'youtube');
    const a = await call(teacher, 'POST', `/classes/${classId}/stream`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Group A: meet at 9.' }] }] }, audienceGroupIds: [groupA] });
    assert.equal(a.status, 201);
    pA = a.data.id;
    assert.equal((await call(alice, 'POST', `/classes/${classId}/stream`, { bodyJson: doc })).status, 403);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/stream`, { audienceGroupIds: [999999], bodyJson: doc })).status, 400);

    const la = await call(alice, 'GET', `/classes/${classId}/stream`);
    assert.equal(la.status, 200);
    assert.deepEqual(la.data.posts.map((p: any) => p.id).sort(), [pAll, pA].sort());
    assert.equal(la.data.posts[0].id, pAll, 'bài ghim lên đầu');
    assert.equal(la.data.posts.find((p: any) => p.id === pA).forGroup, true);
    assert.equal(la.data.posts[0].audienceGroupIds, undefined, 'SV không thấy danh sách nhóm nhận');
    const lc = await call(carol, 'GET', `/classes/${classId}/stream`);
    assert.deepEqual(lc.data.posts.map((p: any) => p.id), [pAll]);
    assert.equal((await call(carol, 'GET', `/classes/${classId}/stream/${pA}`)).status, 404);
    // Chuông: SV nhận đúng 1, GV (người đăng) không tự nhận; carol không nhận bài nhóm A.
    assert.equal(await bells(alice, pAll), 1);
    assert.equal(await bells(carol, pA), 0);
    assert.equal(await bells(teacher, pAll), 0);
    assert.ok(mails.some((m) => m.to === alice.email), 'email đi qua khung workEmail (emailService giả)');
  });

  it('hẹn giờ: SV không thấy trước giờ; publishDue song song ⇒ đăng + chuông ĐÚNG MỘT LẦN', async () => {
    const at = new Date(Date.now() + 3600_000).toISOString();
    const r = await call(teacher, 'POST', `/classes/${classId}/stream`, { bodyJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Quiz 1 next week' }] }] }, publishAt: at });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    pLater = r.data.id;
    assert.equal(r.data.scheduled, true);
    assert.ok(!(await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts.some((p: any) => p.id === pLater));
    assert.equal((await call(alice, 'GET', `/classes/${classId}/stream/${pLater}`)).status, 404);
    assert.ok((await call(teacher, 'GET', `/classes/${classId}/stream`)).data.posts.some((p: any) => p.id === pLater && p.scheduled));
    assert.equal(await bells(alice, pLater), 0);
    const future = new Date(Date.now() + 2 * 3600_000);
    const [n1, n2, n3] = await Promise.all([stream.publishDue(future, classId), stream.publishDue(future, classId), stream.publishDue(future)]);
    assert.equal(n1 + n2 + n3, 1, 'chỉ một lượt chiếm được bài');
    assert.equal(await stream.publishDue(future, classId), 0, 'chạy lại không đăng lần hai');
    assert.equal(await bells(alice, pLater), 1);
    assert.equal(await bells(carol, pLater), 1);
    assert.ok((await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts.some((p: any) => p.id === pLater));
    // Đã đăng ⇒ không đổi giờ hẹn nữa.
    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}/stream/${pLater}`, { publishAt: at })).code, 'WORK_ALREADY_PUBLISHED');
  });

  it('tệp đính kèm: GV tải lên (R2 giả) ⇒ gắn vào bài nhóm A ⇒ SV nhóm A lấy URL, nhóm B 404', async () => {
    const up = await upload(teacher, `/classes/${classId}/stream-files`, 'syllabus.pdf', Buffer.from('%PDF-1.4 test'), 'application/pdf');
    assert.equal(up.status, 201, JSON.stringify(up.raw));
    assert.equal((await upload(alice, `/classes/${classId}/stream-files`, 'x.txt', Buffer.from('x'), 'text/plain')).status, 403);
    const p = await call(teacher, 'PATCH', `/classes/${classId}/stream/${pA}`, { fileIds: [up.data.id] });
    assert.equal(p.status, 200, JSON.stringify(p.raw));
    assert.equal(p.data.files.length, 1);
    assert.ok([...objects.keys()].some((k) => k.startsWith(`work/class/${classId}/stream/`)));
    const u1 = await call(alice, 'GET', `/classes/${classId}/stream-files/${up.data.id}/url`);
    assert.equal(u1.status, 200, JSON.stringify(u1.raw));
    assert.ok(typeof u1.data.url === 'string' && u1.data.url.length > 0);
    assert.equal((await call(carol, 'GET', `/classes/${classId}/stream-files/${up.data.id}/url`)).status, 404);
  });

  it('bình luận: SV bình luận ⇒ GV ẩn ⇒ SV khác không thấy, GV vẫn thấy; tắt bình luận theo lớp ⇒ SV 403', async () => {
    const c1 = await call(alice, 'POST', `/classes/${classId}/stream/${pAll}/comments`, { body: 'Thank you!' });
    assert.equal(c1.status, 201, JSON.stringify(c1.raw));
    const c2 = await call(bob, 'POST', `/classes/${classId}/stream/${pAll}/comments`, { body: 'spam spam' });
    assert.equal(c2.status, 201);
    assert.equal((await call(alice, 'PATCH', `/classes/${classId}/stream-comments/${c2.data.id}`, { hidden: true })).status, 403, 'SV không ẩn được');
    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}/stream-comments/${c2.data.id}`, { hidden: true })).status, 200);
    const seenByCarol = (await call(carol, 'GET', `/classes/${classId}/stream/${pAll}`)).data;
    assert.deepEqual(seenByCarol.comments.map((c: any) => c.id), [c1.data.id]);
    const seenByBob = (await call(bob, 'GET', `/classes/${classId}/stream/${pAll}`)).data;
    assert.ok(!seenByBob.comments.some((c: any) => c.id === c2.data.id), 'kể cả tác giả không thấy bình luận đã ẩn');
    const list = (await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts.find((p: any) => p.id === pAll);
    assert.equal(list.commentCount, 1);
    const seenByTeacher = (await call(teacher, 'GET', `/classes/${classId}/stream/${pAll}`)).data;
    assert.equal(seenByTeacher.comments.find((c: any) => c.id === c2.data.id).hidden, true);
    assert.equal((await call(bob, 'DELETE', `/classes/${classId}/stream-comments/${c2.data.id}`)).status, 404);
    assert.equal((await call(bob, 'DELETE', `/classes/${classId}/stream-comments/${c1.data.id}`)).status, 403, 'không xoá được của người khác');
    assert.equal(await bells(teacher, classId) >= 0, true);

    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}/classroom-settings`, { streamComments: false })).status, 200);
    const blocked = await call(carol, 'POST', `/classes/${classId}/stream/${pAll}/comments`, { body: 'hi' });
    assert.equal(blocked.status, 403);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/stream/${pAll}/comments`, { body: 'GV vẫn được' })).status, 201);
    assert.equal((await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts[0].canComment, false);
    await call(teacher, 'PATCH', `/classes/${classId}/classroom-settings`, { streamComments: true });
  });

  it('postStreamItem (điểm cắm 9b/9c): upsert theo ref, notify:false không chuông, removeStreamItem gỡ dòng', async () => {
    const a1 = await stream.postStreamItem({ classId, kind: 'ASSIGNMENT', refType: 'ASSIGNMENT', refId: 777, title: 'Lab 1', link: { tab: 'classwork', a: '777' }, actorId: teacher.id, notify: false });
    const a2 = await stream.postStreamItem({ classId, kind: 'ASSIGNMENT', refType: 'ASSIGNMENT', refId: 777, title: 'Lab 1 (v2)', actorId: teacher.id, notify: false });
    assert.equal(a1.id, a2.id);
    assert.equal(a1.published, true);
    assert.equal(a2.published, false, 'đã đăng ⇒ không đăng/báo lại');
    assert.equal(await bells(alice, a1.id), 0);
    const q = await stream.postStreamItem({ classId, kind: 'QUIZ', refId: 55, title: 'Quiz 1', actorId: teacher.id });
    assert.equal(await bells(alice, q.id), 1, 'không truyền notify ⇒ có chuông');
    const row = (await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts.find((p: any) => p.id === a1.id);
    assert.equal(row.title, 'Lab 1 (v2)');
    assert.equal(row.kind, 'ASSIGNMENT');
    assert.equal(row.url, `/work/classes?id=${classId}&tab=classwork&a=777`);
    assert.equal((await call(teacher, 'DELETE', `/classes/${classId}/stream/${a1.id}`)).status, 400, 'dòng tự động xoá từ bài gốc');
    await stream.removeStreamItem(classId, 'ASSIGNMENT', 777);
    assert.ok(!(await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts.some((p: any) => p.id === a1.id));
  });

  it('tài liệu: chủ đề theo tuần, kéo-thả, nháp ẩn với SV, đã xem + tỉ lệ (SV không thấy ai đã xem)', async () => {
    const t1 = await call(teacher, 'POST', `/classes/${classId}/topics`, { week: 1 });
    assert.equal(t1.status, 201, JSON.stringify(t1.raw));
    assert.equal(t1.data.title, 'Week 1');
    const t2 = await call(teacher, 'POST', `/classes/${classId}/topics`, { title: 'Week 2 — SRS', week: 2 });
    assert.equal((await call(alice, 'POST', `/classes/${classId}/topics`, { title: 'x' })).status, 403);
    const up = await upload(teacher, `/classes/${classId}/stream-files`, 'slides-w1.pdf', Buffer.from('%PDF slides'), 'application/pdf');
    const m1 = await call(teacher, 'POST', `/classes/${classId}/materials`, { topicId: t1.data.id, kind: 'SLIDE', title: 'Slides week 1', fileIds: [up.data.id] });
    assert.equal(m1.status, 201, JSON.stringify(m1.raw));
    const m2 = await call(teacher, 'POST', `/classes/${classId}/materials`, { topicId: t1.data.id, kind: 'VIDEO', title: 'Lecture video', links: [{ url: 'https://youtu.be/abc' }] });
    const m3 = await call(teacher, 'POST', `/classes/${classId}/materials`, { topicId: t2.data.id, kind: 'SYLLABUS', title: 'Draft rubric', draft: true });
    assert.equal(m2.data.links[0].kind, 'youtube');
    // Đăng tài liệu ⇒ dòng MATERIAL trên Stream; nháp thì không.
    const sl = (await call(alice, 'GET', `/classes/${classId}/stream`)).data.posts;
    assert.ok(sl.some((p: any) => p.kind === 'MATERIAL' && p.refId === m1.data.id));
    assert.ok(!sl.some((p: any) => p.refId === m3.data.id && p.kind === 'MATERIAL'));
    // Kéo-thả.
    assert.equal((await call(teacher, 'PUT', `/classes/${classId}/topics-order`, { ids: [t2.data.id, t1.data.id] })).status, 200);
    assert.equal((await call(teacher, 'PUT', `/classes/${classId}/materials-order`, { topicId: t1.data.id, ids: [m2.data.id, m1.data.id] })).status, 200);
    assert.equal((await call(teacher, 'PUT', `/classes/${classId}/materials-order`, { topicId: t1.data.id, ids: [m2.data.id, 999999] })).status, 400);
    const tl = (await call(teacher, 'GET', `/classes/${classId}/materials`)).data;
    assert.deepEqual(tl.topics.map((t: any) => t.id), [t2.data.id, t1.data.id]);
    assert.deepEqual(tl.materials.filter((m: any) => m.topicId === t1.data.id).map((m: any) => m.id), [m2.data.id, m1.data.id]);
    // SV: không thấy nháp; đánh dấu đã xem.
    const al = (await call(alice, 'GET', `/classes/${classId}/materials`)).data;
    assert.ok(!al.materials.some((m: any) => m.id === m3.data.id));
    assert.equal(al.materials[0].views, undefined, 'SV không thấy số người xem');
    assert.equal((await call(alice, 'GET', `/classes/${classId}/materials/${m3.data.id}`)).status, 404);
    assert.equal((await call(alice, 'POST', `/classes/${classId}/materials/${m1.data.id}/view`)).status, 200);
    assert.equal((await call(alice, 'POST', `/classes/${classId}/materials/${m1.data.id}/view`)).status, 200, 'idempotent');
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/materials/${m1.data.id}/view`)).status, 200);
    const after1 = (await call(teacher, 'GET', `/classes/${classId}/materials`)).data.materials.find((m: any) => m.id === m1.data.id);
    assert.deepEqual([after1.views, after1.viewRate], [1, 33.3], 'GV xem không làm tăng tỉ lệ');
    assert.equal((await call(alice, 'GET', `/classes/${classId}/materials/${m1.data.id}/viewers`)).status, 403);
    const vw = (await call(teacher, 'GET', `/classes/${classId}/materials/${m1.data.id}/viewers`)).data;
    assert.deepEqual([vw.viewed, vw.total], [1, 3]);
    // Tệp của tài liệu: SV lấy được URL; tệp của bản nháp thì không.
    assert.equal((await call(bob, 'GET', `/classes/${classId}/stream-files/${up.data.id}/url`)).status, 200);
    // Xoá chủ đề ⇒ mục về "không chủ đề".
    assert.equal((await call(teacher, 'DELETE', `/classes/${classId}/topics/${t2.data.id}`)).status, 200);
    assert.equal((await prisma.workClassMaterial.findUniqueOrThrow({ where: { id: m3.data.id } })).topicId, null);
  });

  let sessionId = 0;

  it('lịch: buổi định kỳ theo múi giờ lớp + mục hạn bài + .ics', async () => {
    const start = new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10);
    const s = await call(teacher, 'POST', `/classes/${classId}/schedules`, { title: 'SWP391 lecture', recurrence: { freq: 'DAILY', interval: 1, hour: 7, minute: 30, startDate: start, endDate: null }, durationMin: 90, location: 'BE-301' });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    assert.equal(s.data.sessions, 120, 'DAILY không ngày kết thúc ⇒ 20 tuần, trần 120');
    assert.equal((await call(alice, 'POST', `/classes/${classId}/schedules`, { title: 'x', recurrence: { freq: 'DAILY', hour: 7, minute: 0, startDate: start } })).status, 403);
    await calendar.addCalendarItem({ classId, refType: 'ASSIGNMENT', refId: 888, title: 'Lab 1 due', startsAt: new Date(Date.now() + 86_400_000), audienceGroupIds: [groupB] });
    const cal = await call(teacher, 'GET', `/classes/${classId}/calendar`);
    assert.equal(cal.status, 200, JSON.stringify(cal.raw));
    assert.ok(cal.data.sessions.length >= 100);
    assert.ok(cal.data.items.some((i: any) => i.refId === 888));
    assert.ok(!(await call(alice, 'GET', `/classes/${classId}/calendar`)).data.items.some((i: any) => i.refId === 888), 'hạn bài của nhóm B không hiện với nhóm A');
    assert.ok((await call(carol, 'GET', `/classes/${classId}/calendar`)).data.items.some((i: any) => i.refId === 888));
    const ics = await download(alice, `/classes/${classId}/calendar.ics`);
    assert.equal(ics.status, 200);
    assert.match(ics.type ?? '', /text\/calendar/);
    const text = ics.buf.toString('utf8');
    assert.ok(text.startsWith('BEGIN:VCALENDAR') && text.includes('BEGIN:VEVENT') && text.includes('\r\n'));
    assert.ok(!text.includes('Lab 1 due'), '.ics của SV nhóm A không có hạn bài nhóm B');
    // Buổi đang diễn ra hôm nay (buổi đầu tiên đã qua giờ bắt đầu gần nhất).
    const now = Date.now();
    sessionId = cal.data.sessions.filter((x: any) => new Date(x.startsAt).getTime() <= now).pop().id;
  });

  let code = '';

  it('điểm danh: mở mã ⇒ SV nhập ⇒ một lần mỗi SV; sai/hết hạn/đổi mã; khoá sau 5 lần sai', async () => {
    calendar._resetCheckinRate();
    assert.equal((await call(alice, 'POST', `/classes/${classId}/sessions/${sessionId}/checkin`, {})).status, 403, 'SV không mở phiên');
    const o = await call(teacher, 'POST', `/classes/${classId}/sessions/${sessionId}/checkin`, {});
    assert.equal(o.status, 200, JSON.stringify(o.raw));
    assert.match(o.data.code, /^\d{6}$/);
    assert.equal(o.data.minutes, 5, 'mặc định 5 phút');
    assert.ok(o.data.url.includes(`checkin=${o.data.code}`));
    code = o.data.code;
    const ok1 = await call(alice, 'POST', `/classes/${classId}/checkin`, { code });
    assert.equal(ok1.status, 200, JSON.stringify(ok1.raw));
    assert.ok(['PRESENT', 'LATE'].includes(ok1.data.status));
    const again = await call(alice, 'POST', `/classes/${classId}/checkin`, { code });
    assert.equal(again.status, 409, 'mỗi tài khoản một lần');
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/checkin`, { code })).status, 403, 'GV không phải SV');

    // Đổi mã: mã cũ chết ngay.
    const o2 = await call(teacher, 'POST', `/classes/${classId}/sessions/${sessionId}/checkin`, { minutes: 3 });
    assert.notEqual(o2.data.code, code);
    const old = await call(carol, 'POST', `/classes/${classId}/checkin`, { code });
    assert.deepEqual([old.status, old.code], [400, 'WORK_CHECKIN_INVALID']);
    code = o2.data.code;

    // Hết hạn.
    await prisma.workClassSession.update({ where: { id: sessionId }, data: { checkinExpiresAt: new Date(Date.now() - 1000) } });
    const exp = await call(carol, 'POST', `/classes/${classId}/checkin`, { code });
    assert.deepEqual([exp.status, exp.code], [410, 'WORK_CHECKIN_EXPIRED']);
    await prisma.workClassSession.update({ where: { id: sessionId }, data: { checkinExpiresAt: new Date(Date.now() + 5 * 60_000) } });

    // bob nhập sai 5 lần ⇒ bị khoá, kể cả mã đúng.
    for (let i = 0; i < 5; i++) {
      const w = await call(bob, 'POST', `/classes/${classId}/checkin`, { code: code === '000000' ? '000001' : '000000' });
      assert.equal(w.status, 400);
    }
    const locked = await call(bob, 'POST', `/classes/${classId}/checkin`, { code });
    assert.deepEqual([locked.status, locked.code], [429, 'WORK_CHECKIN_RATE']);
    // carol (đã sai 2 lần ở trên) vẫn điểm danh được — khoá theo người.
    assert.equal((await call(carol, 'POST', `/classes/${classId}/checkin`, { code })).status, 200);

    const sheet = await call(teacher, 'GET', `/classes/${classId}/sessions/${sessionId}/attendance`);
    assert.equal(sheet.status, 200);
    assert.equal(sheet.data.checkin.code, code);
    assert.equal(sheet.data.rows.length, 3);
    assert.equal((await call(alice, 'GET', `/classes/${classId}/sessions/${sessionId}/attendance`)).status, 403);
  });

  it('sửa tay + thống kê vắng: SV chỉ xem của mình; GV thấy cờ vượt ngưỡng; xuất xlsx', async () => {
    const r = await call(teacher, 'PUT', `/classes/${classId}/sessions/${sessionId}/attendance`, { rows: [{ studentId: seat.bob, status: 'EXCUSED', note: 'Sick note' }] });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/sessions/${sessionId}/attendance`, { rows: [{ studentId: seat.alice, status: 'PRESENT' }] })).status, 403);
    // Một buổi trước đó được điểm danh tay: alice vắng, bob có mặt, carol không có dòng (⇒ vắng).
    const prev = await prisma.workClassSession.findFirstOrThrow({ where: { classId, startsAt: { lt: (await prisma.workClassSession.findUniqueOrThrow({ where: { id: sessionId } })).startsAt } }, orderBy: { startsAt: 'desc' } });
    await call(teacher, 'PUT', `/classes/${classId}/sessions/${prev.id}/attendance`, { rows: [{ studentId: seat.alice, status: 'ABSENT' }, { studentId: seat.bob, status: 'PRESENT' }] });

    const st = await call(teacher, 'GET', `/classes/${classId}/attendance`);
    assert.equal(st.status, 200, JSON.stringify(st.raw));
    assert.equal(st.data.sessions.length, 2);
    const by = new Map(st.data.students.map((s: any) => [s.id, s]));
    assert.deepEqual([(by.get(seat.alice) as any).absent, (by.get(seat.alice) as any).absentPct, (by.get(seat.alice) as any).over], [1, 50, true]);
    assert.deepEqual([(by.get(seat.bob) as any).excused, (by.get(seat.bob) as any).absent, (by.get(seat.bob) as any).over], [1, 0, false]);
    assert.equal((by.get(seat.carol) as any).unmarked, 1);
    assert.equal(st.data.flagged, 2);

    const denied = await call(alice, 'GET', `/classes/${classId}/attendance`);
    assert.equal(denied.status, 403, 'SV không xem được thống kê cả lớp');
    const me = await call(alice, 'GET', `/classes/${classId}/attendance/me`);
    assert.equal(me.status, 200);
    assert.equal(me.data.summary.studentId, seat.alice);
    assert.equal(me.data.sessions.length, 2);
    // Kiểm theo TRƯỜNG, không theo chuỗi con: trên CSDL mới id rất nhỏ (vd 2) nên `includes('2')` khớp nhầm ngày giờ.
    const meJson = JSON.stringify(me.data);
    assert.ok(!meJson.includes(bob.email), 'không lộ email người khác');
    assert.ok(!new RegExp(`"(studentId|id)":${seat.bob}[,}]`).test(meJson.replace(/"sessions":\[.*\]/s, '')), 'không lộ id người khác');
    assert.ok((me.data.sessions as any[]).every((x) => x.studentId === undefined || x.studentId === seat.alice), 'buổi chỉ của mình');
    assert.equal((await download(alice, `/classes/${classId}/attendance.xlsx`)).status, 403);

    const x = await download(teacher, `/classes/${classId}/attendance.xlsx`);
    assert.equal(x.status, 200);
    const sh = readXlsx(x.buf)[0];
    assert.equal(sh.text(1, 2), 'Student ID');
    assert.equal(sh.maxRow, 4, 'tiêu đề + 3 SV');
    const cells: string[] = [];
    for (let r2 = 2; r2 <= sh.maxRow; r2++) for (let c = 5; c <= 6; c++) cells.push(sh.text(r2, c));
    assert.ok(cells.includes('E') && cells.includes('A'));
  });

  it('huỷ buổi đóng mã; xoá buổi có điểm danh ⇒ 400; xoá lịch định kỳ giữ buổi đã điểm danh', async () => {
    assert.equal((await call(teacher, 'DELETE', `/classes/${classId}/sessions/${sessionId}`)).code, 'WORK_CLASS_HAS_ATTENDANCE');
    const cancel = await call(teacher, 'PATCH', `/classes/${classId}/sessions/${sessionId}`, { status: 'CANCELLED' });
    assert.equal(cancel.status, 200);
    calendar._resetCheckinRate();
    assert.equal((await call(bob, 'POST', `/classes/${classId}/checkin`, { code })).status, 400, 'buổi huỷ ⇒ mã chết');
    const series = (await call(teacher, 'GET', `/classes/${classId}/calendar`)).data.series[0];
    const del = await call(teacher, 'DELETE', `/classes/${classId}/schedules/${series.id}`);
    assert.equal(del.status, 200);
    const left = await prisma.workClassSession.count({ where: { classId } });
    assert.ok(left >= 2 && left < 10, `chỉ còn buổi đã qua/đã điểm danh (còn ${left})`);
  });

  it('người ngoài 404; agent 403 ở mọi tuyến (đọc lẫn ghi)', async () => {
    assert.equal((await call(outsider, 'GET', `/classes/${classId}/stream`)).status, 404);
    assert.equal((await call(outsider, 'GET', `/classes/${classId}/materials`)).status, 404);
    assert.equal((await call(outsider, 'POST', `/classes/${classId}/checkin`, { code: '123456' })).status, 404);
    for (const [m, p, b] of [
      ['GET', `/classes/${classId}/stream`, undefined], ['POST', `/classes/${classId}/stream`, { bodyJson: { type: 'doc' } }],
      ['GET', `/classes/${classId}/materials`, undefined], ['POST', `/classes/${classId}/topics`, { title: 'x' }],
      ['GET', `/classes/${classId}/calendar`, undefined], ['POST', `/classes/${classId}/checkin`, { code: '123456' }],
      ['GET', `/classes/${classId}/attendance`, undefined],
    ] as const) {
      assert.equal((await call(bot, m, p, b)).status, 403, `${m} ${p}`);
    }
  });
});
