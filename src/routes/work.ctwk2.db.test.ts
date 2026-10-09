/**
 * CT Work K-2 — họp: agenda · RSVP · điểm danh · chuyên cần · Đóng góp · đồng ý ghi âm · đoạn + mốc giờ · phiên âm
 * (STT GIẢ) · trần/NO_KEY/thử lại · biên bản AI (LLM GIẢ: có/thiếu bằng chứng) · duyệt ⇒ thẻ · khách cổng · xuất FPT ·
 * hạn lưu audio (job dọn) · nhắc họp · registry. HTTP thật + Postgres cục bộ, kho R2 GIẢ trong RAM:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctwk2.db.test.ts
 */

import './work.ctw5b.testenv.js';
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
import * as rec from '../services/work/meetingRec.service.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `k2${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work K-2 — họp ghi âm → phiên âm → AI biên bản + điểm danh/RSVP (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, viewer: U, client: U;
  let wsId = 0, pid = 0, num = 0;
  const objects = new Map<string, { body: Buffer; ct: string }>();
  /** STT giả theo kích thước đoạn (byte đầu = mã kịch bản). */
  const sttPlan = new Map<number, Array<() => { text: string; segments?: Array<{ start: number; end: number; text: string }> } | Error>>();
  const savedKey = process.env.GROQ_API_KEY;
  let llmAnswers: string[] = [];
  const llmSeen: Array<{ system: string; user: string }> = [];

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x', fullName: name === 'dev' ? 'Dev An' : undefined } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username, email, roles: [], roleVersion: 0 }, config.jwtSecret);
    return { id: u.id, token, email, username };
  }
  async function call(u: { token: string } | null, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  async function chunk(u: U, rid: number, seq: number, startMs: number, durationMs = 90_000, extra: Record<string, string> = {}, type = 'audio/webm;codecs=opus') {
    const form = new FormData();
    const bytes = Buffer.alloc(4000 + seq, seq % 250);
    form.append('audio', new Blob([new Uint8Array(bytes)], { type }), `c${seq}.webm`);
    for (const [k, v] of Object.entries({ seq: String(seq), startMs: String(startMs), durationMs: String(durationMs), ...extra })) form.append(k, v);
    const res = await fetch(`${base}/api/v1/work/projects/${pid}/meetings/${num}/recordings/${rid}/chunks`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: form });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const room = async (u: U = owner) => (await call(u, 'GET', `/projects/${pid}/meetings/${num}/room`)).data;
  const M = () => `/projects/${pid}/meetings/${num}`;

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_EMAIL_NOTIFICATIONS = 'false';
    process.env.WORK_MEETING_STT_RETRY_MS = '5';
    files._setCommentStoreForTests({
      async put(key, body, ct) { objects.set(key, { body, ct }); },
      async read(key) { const o = objects.get(key); if (!o) throw new Error('missing'); return o.body; },
      async head(key) { const o = objects.get(key); return o ? { size: o.body.length, contentType: o.ct } : null; },
      async del(key) { objects.delete(key); },
    });
    files._setSttForTests(async (buf) => {
      const seq = buf.length - 4000;
      const plan = sttPlan.get(seq);
      const f = plan?.shift();
      const r = f ? f() : { text: `Đoạn ${seq} không có gì đặc biệt cả.`, segments: [{ start: 1, end: 4, text: `Đoạn ${seq} không có gì đặc biệt cả.` }] };
      if (r instanceof Error) throw r;
      return { text: r.text, language: 'vi', noSpeechProb: 0.01, avgLogprob: -0.2, segments: r.segments } as any;
    });
    rec._setMinutesAskForTests(async (system, user) => {
      llmSeen.push({ system, user });
      return llmAnswers.shift() ?? '{"summary":"","decisions":[],"actions":[],"openIssues":[]}';
    });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [owner, dev, viewer, client] = await Promise.all([mkUser('owner'), mkUser('dev'), mkUser('viewer'), mkUser('client')]);
  });

  after(async () => {
    server?.close();
    await files._awaitTranscriptionsForTests().catch(() => {});
    files._setCommentStoreForTests(null);
    files._setSttForTests(null);
    rec._setMinutesAskForTests(null);
    if (savedKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = savedKey;
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT (cổng khách + họp bật), dev MEMBER, viewer VIEWER, khách CLIENT; cuộc họp mời cả bốn', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `K2 ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'MK', name: 'Meeting K2', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    if (!p.data.modules.meetings) {
      const r = await call(owner, 'PUT', `/projects/${pid}/studio`, { modules: { ...p.data.modules, meetings: true } });
      assert.equal(r.status, 200, JSON.stringify(r.raw));
    }
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    assert.equal((await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] })).status, 201);
    const start = new Date(Date.now() - 2 * 60_000);
    const m = await call(owner, 'POST', `/projects/${pid}/meetings`, {
      title: 'Sprint review', type: 'DEMO', startsAt: start.toISOString(), endsAt: new Date(start.getTime() + 3600_000).toISOString(),
      attendeeIds: [owner.id, dev.id, viewer.id, client.id], sendInvites: false,
    });
    assert.equal(m.status, 201, JSON.stringify(m.raw));
    num = m.data.number;
  });

  // ═══ A: agenda · RSVP · điểm danh · chuyên cần · Đóng góp ═══════

  it('A1 agenda có cấu trúc: mục · người trình bày · phút · link thẻ/tài liệu; người trình bày phải là thành viên', async () => {
    const r = await call(dev, 'PUT', `${M()}/agenda-items`, { items: [{ title: 'Demo login', presenterId: dev.id, minutes: 15, ref: 'MK-1' }, { title: 'SRS review', minutes: 10, ref: 'DOC-2' }, { title: 'Q&A', ref: 'https://example.com/x' }] });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual(r.data.agenda.map((a: any) => a.refInfo?.kind), ['issue', 'page', 'url']);
    assert.equal(r.data.agendaMinutes, 25);
    assert.equal((await call(dev, 'PUT', `${M()}/agenda-items`, { items: [{ title: 'x', presenterId: 999_999_999 }] })).code, 'WORK_BAD_USER');
    assert.equal((await call(viewer, 'PUT', `${M()}/agenda-items`, { items: [] })).status, 403, 'VIEWER không sửa agenda');
  });

  it('A2 RSVP: Có/Không/Có thể + lý do; chủ trì nhận báo khi Không; người không được mời / khách ⇒ chặn', async () => {
    const r = await call(dev, 'POST', `${M()}/rsvp`, { rsvp: 'NO', note: 'Trùng lịch thi' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.deepEqual([r.data.me.rsvp, r.data.me.rsvpNote], ['NO', 'Trùng lịch thi']);
    assert.equal((await call(dev, 'POST', `${M()}/rsvp`, { rsvp: 'MAYBE' })).data.me.rsvp, 'MAYBE');
    assert.equal((await call(viewer, 'POST', `${M()}/rsvp`, { rsvp: 'YES' })).status, 200);
    const n = await prisma.socialNotification.findMany({ where: { receiverId: owner.id, senderId: dev.id, type: 'WORK_ALERT' } });
    assert.ok(n.some((x: any) => /replied No: Trùng lịch thi/.test(x.payload?.message)), 'chủ trì được báo');
    assert.equal((await call(client, 'POST', `${M()}/rsvp`, { rsvp: 'YES' })).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(owner, 'POST', `${M()}/rsvp`, { rsvp: 'MAYBE', note: 'x'.repeat(301) })).status, 400);
  });

  it('A3 điểm danh AUTO khi "Vào họp" (đúng giờ ⇒ có mặt, muộn > 5 phút ⇒ muộn); rời ⇒ giờ ra; MANUAL không bị AUTO đè', async () => {
    const j = await call(owner, 'POST', `${M()}/join`);
    assert.equal(j.status, 200, JSON.stringify(j.raw));
    assert.equal(j.data.attendance, 'PRESENT');
    const mt = await prisma.workMeeting.findFirstOrThrow({ where: { projectId: pid, number: num } });
    const late = await rec.joinMeeting(dev.id, pid, num, new Date(mt.startsAt.getTime() + 20 * 60_000));
    assert.equal(late.attendance, 'LATE');
    await call(dev, 'POST', `${M()}/leave`);
    let rm = await room();
    const d = rm.attendees.find((a: any) => a.userId === dev.id);
    assert.ok(d.joinedAt && d.leftAt && !d.present);
    // Chủ trì sửa tay ⇒ vào lại vẫn giữ MANUAL.
    assert.equal((await call(owner, 'PUT', `${M()}/attendance`, { items: [{ userId: dev.id, attendance: 'PRESENT' }, { userId: viewer.id, attendance: 'EXCUSED' }, { userId: client.id, attendance: 'ABSENT' }] })).status, 200);
    await call(dev, 'POST', `${M()}/join`);
    rm = await room();
    const d2 = rm.attendees.find((a: any) => a.userId === dev.id);
    assert.deepEqual([d2.attendance, d2.attendanceSource, d2.present], ['PRESENT', 'MANUAL', true]);
    assert.equal((await call(dev, 'PUT', `${M()}/attendance`, { items: [{ userId: owner.id, attendance: 'ABSENT' }] })).status, 403, 'chỉ chủ trì / ADMIN');
  });

  it('A4 báo cáo chuyên cần theo người; Đóng góp dùng điểm danh thật (cuộc họp chưa điểm danh ⇒ giữ ước lượng)', async () => {
    const r = await call(viewer, 'GET', `/projects/${pid}/meetings-attendance`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    const by = (u: U) => r.data.people.find((p: any) => p.userId === u.id);
    assert.deepEqual([by(dev).present, by(dev).rate], [1, 100]);
    assert.deepEqual([by(viewer).excused, by(viewer).rate], [1, null]);
    assert.deepEqual([by(client).absent, by(client).rate], [1, 0]);
    // Cuộc họp thứ hai: DONE, không ai điểm danh ⇒ ước lượng (được mời + DONE ⇒ đã dự).
    const s = new Date(Date.now() - 86_400_000);
    const m2 = (await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Old daily', type: 'DAILY', startsAt: s.toISOString(), endsAt: new Date(s.getTime() + 900_000).toISOString(), attendeeIds: [client.id], sendInvites: false })).data;
    await call(owner, 'PATCH', `/projects/${pid}/meetings/${m2.number}`, { status: 'DONE' });
    const T = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10); // múi giờ dự án (+07) có thể đã sang ngày mai
    const c = await call(owner, 'GET', `/projects/${pid}/contrib/summary?preset=custom&from=${new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)}&to=${T}`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    const row = (u: U) => c.data.members.find((x: any) => x.user.id === u.id)?.metrics;
    if (row(client)) assert.deepEqual([row(client).meetingsInvited, row(client).meetingsAttended], [2, 1], 'vắng ở M-1 (điểm danh), dự M-2 (ước lượng)');
    assert.deepEqual([row(dev).meetingsInvited, row(dev).meetingsAttended], [1, 1]);
    if (row(viewer)) assert.deepEqual([row(viewer).meetingsInvited, row(viewer).meetingsAttended], [1, 0], 'vắng có phép ⇒ không tính là đã dự');
    assert.ok(row(client) || row(dev), 'có dòng Đóng góp');
  });

  // ═══ C: đồng ý ghi âm ═════════════════════════════════════════════

  let rid = 0;
  it('C1 mở ghi âm ⇒ hỏi người đang ở phòng; chưa đồng ý ⇒ chưa ghi được; đồng ý đủ ⇒ RECORDING + lưu ai/lúc nào', async () => {
    assert.equal((await call(viewer, 'POST', `${M()}/recordings`, { source: 'LIVE' })).status, 403, 'VIEWER không ghi âm');
    const s = await call(dev, 'POST', `${M()}/recordings`, { source: 'LIVE' });
    assert.equal(s.status, 201, JSON.stringify(s.raw));
    rid = s.data.recordingId;
    const r0 = s.data.room.recordings.find((x: any) => x.id === rid);
    assert.equal(r0.status, 'CONSENT');
    assert.deepEqual(r0.consent.waiting, [owner.id]);
    assert.equal((await call(dev, 'POST', `${M()}/recordings`, { source: 'LIVE' })).status, 409, 'một lượt ghi LIVE một lúc');
    assert.equal((await call(dev, 'POST', `${M()}/recordings/${rid}/begin`)).code, 'WORK_CONSENT_PENDING');
    assert.equal((await chunk(dev, rid, 0, 0)).code, 'WORK_RECORDING_NOT_STARTED');
    const notif = await prisma.socialNotification.findMany({ where: { receiverId: owner.id, senderId: dev.id } });
    assert.ok(notif.some((n: any) => /Recording requested/.test(n.payload?.message)), 'người ở phòng được báo');
    assert.equal((await call(owner, 'POST', `${M()}/recordings/${rid}/consent`, { agree: true })).status, 200);
    assert.equal((await call(owner, 'POST', `${M()}/recordings/${rid}/begin`)).status, 403, 'chỉ người ghi bấm bắt đầu');
    const b = await call(dev, 'POST', `${M()}/recordings/${rid}/begin`);
    assert.equal(b.status, 200, JSON.stringify(b.raw));
    const r1 = b.data.recordings.find((x: any) => x.id === rid);
    assert.equal(r1.status, 'RECORDING');
    assert.deepEqual(r1.consents.map((c: any) => [c.userId, c.decision]).sort(), [[owner.id, 'AGREED'], [dev.id, 'AGREED']].sort());
    assert.ok(r1.consents.every((c: any) => c.at));
  });

  it('C2 một người ở phòng từ chối ⇒ không bắt đầu được; từ chối giữa lúc ghi ⇒ dừng (STOPPED)', async () => {
    await call(viewer, 'POST', `${M()}/join`);
    // Lượt ghi đang chạy: viewer vào sau và từ chối ⇒ dừng.
    const st = await call(viewer, 'POST', `${M()}/recordings/${rid}/consent`, { agree: false });
    assert.equal(st.status, 200, JSON.stringify(st.raw));
    assert.equal(st.data.recordings.find((x: any) => x.id === rid).status, 'STOPPED');
    // Lượt mới: viewer đã từ chối lượt này ⇒ begin 409 DECLINED.
    const s = (await call(owner, 'POST', `${M()}/recordings`, { source: 'LIVE' })).data.recordingId;
    await call(dev, 'POST', `${M()}/recordings/${s}/consent`, { agree: true });
    await call(viewer, 'POST', `${M()}/recordings/${s}/consent`, { agree: false });
    assert.equal((await call(owner, 'POST', `${M()}/recordings/${s}/begin`)).code, 'WORK_CONSENT_DECLINED');
    await call(owner, 'POST', `${M()}/recordings/${s}/end`);
    await call(viewer, 'POST', `${M()}/leave`);
  });

  // ═══ T: đoạn + phiên âm + mốc giờ ═════════════════════════════════

  let rid2 = 0;
  it('T1 đoạn đến lộn thứ tự + gửi lại trùng seq ⇒ không nhân đôi; transcript ghép đúng mốc giờ; người nói = người giữ mic', async () => {
    const s = (await call(dev, 'POST', `${M()}/recordings`, { source: 'LIVE' })).data.recordingId;
    rid2 = s;
    await call(owner, 'POST', `${M()}/recordings/${s}/consent`, { agree: true });
    assert.equal((await call(dev, 'POST', `${M()}/recordings/${s}/begin`)).status, 200);
    sttPlan.set(1, [() => ({ text: 'Chốt dùng PostgreSQL cho dự án. Dev An vẽ ERD trước thứ Sáu.', segments: [{ start: 2, end: 6, text: 'Chốt dùng PostgreSQL cho dự án.' }, { start: 7, end: 12, text: 'Dev An vẽ ERD trước thứ Sáu.' }] })]);
    sttPlan.set(0, [() => ({ text: 'Bắt đầu buổi review sprint hai.', segments: [{ start: 1, end: 4, text: 'Bắt đầu buổi review sprint hai.' }] })]);
    assert.equal((await chunk(dev, s, 1, 90_000, 90_000, { speakerId: String(owner.id) })).status, 201);
    const c0 = await chunk(dev, s, 0, 0);
    assert.equal(c0.status, 201, JSON.stringify(c0.raw));
    const dup = await chunk(dev, s, 0, 0);
    assert.equal(dup.data.duplicate, true);
    assert.equal(await prisma.workMeetingChunk.count({ where: { recordingId: s } }), 2);
    assert.equal((await chunk(owner, s, 2, 180_000)).status, 403, 'chỉ người ghi tải đoạn');
    assert.equal((await chunk(dev, s, 5, 0, 90_000, {}, 'video/mp4')).code, 'WORK_AUDIO_TYPE');
    await files._awaitTranscriptionsForTests();
    const t = await call(viewer, 'GET', `${M()}/transcript`);
    assert.equal(t.status, 200, JSON.stringify(t.raw));
    const r = t.data.recordings.find((x: any) => x.id === s);
    assert.deepEqual(r.lines.map((l: any) => [l.n, l.at, l.text, l.speakerId]), [
      [1, '00:01', 'Bắt đầu buổi review sprint hai.', dev.id],
      [2, '01:32', 'Chốt dùng PostgreSQL cho dự án.', owner.id],
      [3, '01:37', 'Dev An vẽ ERD trước thứ Sáu.', owner.id],
    ]);
    assert.deepEqual([r.progress.total, r.progress.done, r.progress.percent], [2, 2, 100]);
  });

  it('T2 STT lỗi ⇒ tự thử lại tới 3 lần rồi FAILED; "Retry" ⇒ DONE. Gán người nói tay cho một dòng', async () => {
    sttPlan.set(2, [() => new Error('boom'), () => new Error('boom'), () => new Error('boom'), () => ({ text: 'Ai lo phần test? Chưa ai nhận.', segments: [{ start: 0, end: 3, text: 'Ai lo phần test? Chưa ai nhận.' }] })]);
    assert.equal((await chunk(dev, rid2, 2, 180_000)).status, 201);
    await files._awaitTranscriptionsForTests();
    let c = await prisma.workMeetingChunk.findFirstOrThrow({ where: { recordingId: rid2, seq: 2 } });
    assert.deepEqual([c.status, c.attempts], ['FAILED', 3]);
    assert.equal((await call(dev, 'POST', `${M()}/recordings/${rid2}/retry`)).data.queued, 1);
    await files._awaitTranscriptionsForTests();
    c = await prisma.workMeetingChunk.findFirstOrThrow({ where: { recordingId: rid2, seq: 2 } });
    assert.equal(c.status, 'DONE');
    const sp = await call(dev, 'PUT', `${M()}/recordings/${rid2}/speakers`, { items: [{ lineId: '2.0', speakerId: viewer.id }] });
    assert.equal(sp.status, 200, JSON.stringify(sp.raw));
    assert.equal(sp.data.recordings.find((x: any) => x.id === rid2).lines.find((l: any) => l.id === '2.0').speakerId, viewer.id);
  });

  it('T3 không có GROQ_API_KEY ⇒ audio vẫn lưu, NO_KEY; có khoá ⇒ Retry ⇒ DONE. Hết trần theo dự án/ngày ⇒ LIMIT', async () => {
    files._setSttForTests(null);
    delete process.env.GROQ_API_KEY;
    const r = await chunk(dev, rid2, 3, 270_000, 30_000);
    assert.equal(r.status, 201);
    await files._awaitTranscriptionsForTests();
    let c = await prisma.workMeetingChunk.findFirstOrThrow({ where: { recordingId: rid2, seq: 3 } });
    assert.equal(c.status, 'NO_KEY');
    assert.ok(c.r2Key && objects.has(c.r2Key), 'audio vẫn nằm trong kho');
    assert.equal((await room()).sttConfigured, false);
    files._setSttForTests(async () => ({ text: 'Hết giờ, cảm ơn cả nhóm đã tham gia.', language: 'vi', noSpeechProb: 0.01, avgLogprob: -0.2 }));
    await call(dev, 'POST', `${M()}/recordings/${rid2}/retry`);
    await files._awaitTranscriptionsForTests();
    c = await prisma.workMeetingChunk.findFirstOrThrow({ where: { recordingId: rid2, seq: 3 } });
    assert.equal(c.status, 'DONE');
    // Trần: đặt bằng số đã dùng hôm nay ⇒ đoạn kế tiếp LIMIT.
    assert.equal((await call(dev, 'PUT', `/projects/${pid}/meeting-settings`, { sttDailyLimit: 1 })).status, 403, 'chỉ ADMIN dự án');
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/meeting-settings`, { sttDailyLimit: 1 })).status, 200);
    await chunk(dev, rid2, 4, 300_000, 30_000);
    await files._awaitTranscriptionsForTests();
    assert.equal((await prisma.workMeetingChunk.findFirstOrThrow({ where: { recordingId: rid2, seq: 4 } })).status, 'LIMIT');
    await call(owner, 'PUT', `/projects/${pid}/meeting-settings`, { sttDailyLimit: null });
    // Khôi phục STT giả theo kịch bản.
    files._setSttForTests(async (buf) => {
      const seq = buf.length - 4000;
      const f = sttPlan.get(seq)?.shift();
      const x = f ? f() : { text: `Đoạn ${seq} không có gì đặc biệt cả.`, segments: [{ start: 1, end: 4, text: `Đoạn ${seq} không có gì đặc biệt cả.` }] };
      if (x instanceof Error) throw x;
      return { text: x.text, language: 'vi', noSpeechProb: 0.01, avgLogprob: -0.2, segments: x.segments } as any;
    });
    await call(dev, 'POST', `${M()}/recordings/${rid2}/retry`);
    await files._awaitTranscriptionsForTests();
    assert.equal(await prisma.workMeetingChunk.count({ where: { recordingId: rid2, status: { not: 'DONE' } } }), 0);
  });

  it('T4 tải tệp ghi âm có sẵn: phải xác nhận đã có đồng ý; nghe lại được (link ký sẵn) — chỉ người của đội', async () => {
    assert.equal((await call(dev, 'POST', `${M()}/recordings`, { source: 'UPLOAD', fileName: 'hop.m4a' })).code, 'WORK_CONSENT_REQUIRED');
    const u = await call(dev, 'POST', `${M()}/recordings`, { source: 'UPLOAD', fileName: 'hop.m4a', confirmConsent: true });
    assert.equal(u.status, 201);
    assert.equal((await chunk(dev, u.data.recordingId, 0, 0, 60_000, {}, 'audio/x-m4a')).status, 201);
    await call(dev, 'POST', `${M()}/recordings/${u.data.recordingId}/end`);
    const a = await call(viewer, 'GET', `${M()}/recordings/${rid2}/chunks/0/audio`);
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.match(a.data.url, /^https:\/\//);
    await files._awaitTranscriptionsForTests();
  });

  // ═══ K: khách cổng ════════════════════════════════════════════════

  it('K1 khách: không nghe audio, không đọc transcript/phòng họp nội bộ, không đề xuất biên bản', async () => {
    for (const [m, p] of [['GET', `${M()}/recordings/${rid2}/chunks/0/audio`], ['GET', `${M()}/transcript`], ['GET', `${M()}/room`], ['POST', `${M()}/minutes-ai`], ['GET', `${M()}/minutes-export?format=pdf`], ['GET', `/projects/${pid}/meetings-attendance`]] as const) {
      assert.equal((await call(client, m, p, m === 'POST' ? {} : undefined)).code, 'CLIENT_PORTAL_ONLY', `${m} ${p}`);
    }
    const pm = await call(client, 'GET', `/projects/${pid}/portal/meetings/${num}`);
    assert.equal(pm.status, 200, JSON.stringify(pm.raw));
    assert.equal(pm.data.shared, false);
    assert.deepEqual(pm.data.decisions, []);
    assert.ok(!JSON.stringify(pm.data).includes('PostgreSQL'), 'không lộ transcript');
  });

  // ═══ AI: biên bản đề xuất (LLM giả) ═══════════════════════════════

  let draftId = 0;
  it('AI1 đề xuất biên bản: mục có dòng transcript ⇒ trích nguyên văn; id bịa/thiếu ⇒ cờ thiếu bằng chứng; JSON hỏng ⇒ hỏi lại một lần', async () => {
    llmAnswers = [
      'Xin lỗi, đây là biên bản: (không phải JSON)',
      JSON.stringify({
        summary: 'Nhóm chốt PostgreSQL và giao việc ERD.',
        decisions: [{ text: 'Dùng PostgreSQL', evidence: ['L2'] }, { text: 'Chuyển sang MongoDB', evidence: ['L42'] }],
        actions: [{ text: 'Vẽ ERD', owner: dev.username, due: '2026-10-17', evidence: ['L3'] }, { text: 'Viết kế hoạch test', owner: 'ai đó', evidence: [] }],
        openIssues: [{ text: 'Ai lo phần test?', evidence: ['L4'] }],
      }),
    ];
    const r = await call(dev, 'POST', `${M()}/minutes-ai`, { language: 'vi' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    draftId = r.data.draftId;
    const c = r.data.content;
    assert.equal(llmSeen.length, 2, 'hỏi lại đúng một lần');
    assert.match(llmSeen[0].user, /\[L2 01:32 \S+/);
    assert.match(llmSeen[0].user, /Demo login/, 'agenda đi kèm');
    assert.match(llmSeen[0].system, /Vietnamese/);
    assert.deepEqual([c.decisions[0].unsupported, c.decisions[0].evidence[0].quote], [false, 'Chốt dùng PostgreSQL cho dự án.']);
    assert.equal(c.decisions[1].unsupported, true);
    assert.deepEqual([c.actions[0].ownerId, c.actions[0].due, c.actions[0].unsupported], [dev.id, '2026-10-17', false]);
    assert.deepEqual([c.actions[1].ownerId, c.actions[1].unsupported], [null, true]);
    assert.equal(c.openIssues[0].evidence[0].quote, 'Ai lo phần test? Chưa ai nhận.');
    assert.equal(c.unsupportedCount, 2);
    const rm = await room();
    assert.equal(rm.drafts[0].status, 'PROPOSED');
    // Biên bản THẬT chưa đổi.
    const m = (await call(owner, 'GET', M())).data;
    assert.deepEqual(m.decisions, []);
    assert.equal(m.actions.length, 0);
  });

  it('AI2 chủ trì duyệt (bỏ mục thiếu bằng chứng) ⇒ đổ vào biên bản + việc ⇒ thẻ; người khác không duyệt được; chia sẻ ⇒ khách thấy', async () => {
    assert.equal((await call(dev, 'POST', `${M()}/minutes-ai/${draftId}/apply`, {})).status, 403);
    const a = await call(owner, 'POST', `${M()}/minutes-ai/${draftId}/apply`, { skipDecisions: [1], skipActions: [1], createIssues: true });
    assert.equal(a.status, 200, JSON.stringify(a.raw));
    assert.equal(a.data.created.length, 1);
    const m = (await call(owner, 'GET', M())).data;
    assert.deepEqual(m.decisions, ['Dùng PostgreSQL']);
    assert.deepEqual(m.actions.map((x: any) => [x.text, x.assignee?.id, x.dueDate, !!x.issue]), [['Vẽ ERD', dev.id, '2026-10-17', true]]);
    assert.match(JSON.stringify(m.minutesJson), /Nhóm chốt PostgreSQL/);
    assert.equal((await call(owner, 'POST', `${M()}/minutes-ai/${draftId}/apply`, {})).code, 'WORK_DRAFT_CLOSED');
    assert.equal((await call(owner, 'POST', `${M()}/share`, { shared: true })).status, 200);
    const pm = (await call(client, 'GET', `/projects/${pid}/portal/meetings/${num}`)).data;
    assert.deepEqual(pm.decisions, ['Dùng PostgreSQL']);
    assert.equal((await call(client, 'GET', `${M()}/transcript`)).code, 'CLIENT_PORTAL_ONLY', 'chia sẻ biên bản ≠ chia sẻ transcript');
  });

  it('AI3 xuất biên bản mẫu FPT .docx/.pdf', async () => {
    const d = await fetch(`${base}/api/v1/work${M()}/minutes-export?format=docx&lang=vi`, { headers: { Authorization: `Bearer ${viewer.token}` } });
    assert.equal(d.status, 200);
    assert.match(d.headers.get('content-type') ?? '', /wordprocessingml/);
    assert.equal(Buffer.from(await d.arrayBuffer()).subarray(0, 2).toString(), 'PK');
    const p = await fetch(`${base}/api/v1/work${M()}/minutes-export?format=pdf&lang=en`, { headers: { Authorization: `Bearer ${viewer.token}` } });
    assert.equal(p.status, 200);
    assert.equal(Buffer.from(await p.arrayBuffer()).subarray(0, 4).toString(), '%PDF');
    const md = (await rec.exportMinutes(owner.id, pid, num, 'docx', 'vi')).markdown;
    for (const s of ['BIÊN BẢN HỌP', 'Dùng PostgreSQL', 'Vẽ ERD', 'Vắng có phép', 'Demo login']) assert.ok(md.includes(s), s);
  });

  // ═══ R: hạn lưu audio + xoá tay ═══════════════════════════════════

  it('R1 hạn lưu: mặc định 30 ngày; đổi theo dự án ⇒ tính lại; job dọn xoá audio, GIỮ transcript; xoá tay chỉ chủ trì/người ghi', async () => {
    await call(dev, 'POST', `${M()}/recordings/${rid2}/end`);
    let r = await prisma.workMeetingRecording.findUniqueOrThrow({ where: { id: rid2 } });
    const days = Math.round((r.expiresAt!.getTime() - r.endedAt!.getTime()) / 86_400_000);
    assert.equal(days, 30);
    await call(owner, 'PUT', `/projects/${pid}/meeting-settings`, { audioRetentionDays: 7 });
    r = await prisma.workMeetingRecording.findUniqueOrThrow({ where: { id: rid2 } });
    assert.equal(Math.round((r.expiresAt!.getTime() - r.endedAt!.getTime()) / 86_400_000), 7);
    const keys = (await prisma.workMeetingChunk.findMany({ where: { recordingId: rid2 }, select: { r2Key: true } })).map((c) => c.r2Key!);
    assert.ok(keys.every((k) => objects.has(k)));
    await prisma.workMeetingRecording.update({ where: { id: rid2 }, data: { expiresAt: new Date(Date.now() - 1000) } });
    const n = await rec.purgeExpiredMeetingAudio();
    assert.ok(n >= keys.length);
    assert.ok(keys.every((k) => !objects.has(k)), 'object R2 đã xoá');
    assert.equal((await call(viewer, 'GET', `${M()}/recordings/${rid2}/chunks/0/audio`)).status, 404);
    const t = (await call(viewer, 'GET', `${M()}/transcript`)).data.recordings.find((x: any) => x.id === rid2);
    assert.ok(t.lines.length >= 4, 'transcript còn nguyên');
    assert.equal((await room()).recordings.find((x: any) => x.id === rid2).audioDeleted, true);
    // Xoá tay: VIEWER không được; chủ trì được.
    const up = (await room()).recordings.find((x: any) => x.source === 'UPLOAD');
    assert.equal((await call(viewer, 'DELETE', `${M()}/recordings/${up.id}/audio`)).status, 403);
    assert.equal((await call(owner, 'DELETE', `${M()}/recordings/${up.id}/audio`)).status, 200);
  });

  // ═══ N: nhắc họp ══════════════════════════════════════════════════

  it('N1 nhắc trước giờ họp: chuông cho người được mời (trừ RSVP Không) + tin ở #general; chạy lại không nhắc trùng', async () => {
    const s = new Date(Date.now() + 5 * 60_000);
    const m = (await call(owner, 'POST', `/projects/${pid}/meetings`, { title: 'Standup', type: 'DAILY', startsAt: s.toISOString(), endsAt: new Date(s.getTime() + 900_000).toISOString(), attendeeIds: [dev.id, viewer.id], sendInvites: false })).data;
    await call(viewer, 'POST', `/projects/${pid}/meetings/${m.number}/rsvp`, { rsvp: 'NO', note: 'ốm' });
    const before = await prisma.socialNotification.count({ where: { receiverId: dev.id, entityId: m.id } });
    const n1 = await rec.runMeetingReminders();
    assert.ok(n1 >= 1);
    const got = await prisma.socialNotification.findMany({ where: { receiverId: dev.id, entityId: m.id }, orderBy: { id: 'asc' } });
    assert.equal(got.length, before + 1);
    assert.match((got[got.length - 1] as any).payload.message, /starts in \d+ min/);
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: viewer.id, entityId: m.id, payload: { path: ['reminder'], equals: true } } }), 0, 'RSVP Không ⇒ không nhắc');
    const msg = await prisma.workChannelMessage.findFirst({ where: { channel: { projectId: pid, isGeneral: true }, kind: 'SYSTEM', body: { contains: `M-${m.number}` } } });
    assert.ok(msg, 'tin nhắc ở #general');
    await rec.runMeetingReminders();
    assert.equal(await prisma.socialNotification.count({ where: { receiverId: dev.id, entityId: m.id } }), before + 1, 'không nhắc trùng');
  });

  // ═══ G: registry ═══════════════════════════════════════════════════

  it('G1 registry: meeting_transcript_get (dữ liệu untrusted) + meeting_minutes_propose (chỉ đề xuất)', async () => {
    const tok = (await call(dev, 'POST', '/me/api-tokens', { name: 'k2', scopes: ['read', 'write'] })).data.token;
    let rpc = 0;
    const tool = async (name: string, args: Record<string, unknown>) => {
      const res = await fetch(`${base}/api/v1/work/mcp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++rpc, method: 'tools/call', params: { name, arguments: args } }),
      });
      const body = (await res.json()) as any;
      assert.ok(!body.error, JSON.stringify(body.error));
      return { isError: body.result.isError as boolean, text: body.result.content[0].text as string };
    };
    const t = await tool('meeting_transcript_get', { project: 'MK', meeting: `M-${num}` });
    assert.equal(t.isError, false, t.text);
    assert.match(t.text, /Chốt dùng PostgreSQL cho dự án\./);
    assert.match(t.text, /untrusted|UNTRUSTED|data/i);
    llmAnswers = [JSON.stringify({ summary: 'S', decisions: [{ text: 'Dùng PostgreSQL', evidence: ['L2'] }], actions: [], openIssues: [] })];
    const p = await tool('meeting_minutes_propose', { project: 'MK', meeting: num, language: 'en' });
    assert.equal(p.isError, false, p.text);
    const out = JSON.parse(p.text);
    assert.equal(out.status, 'PROPOSED');
    assert.equal(out.decisions[0].unsupported, false);
    assert.equal((await prisma.workMeetingMinutesDraft.findUniqueOrThrow({ where: { id: out.draftId } })).language, 'en');
  });
});
