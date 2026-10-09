/**
 * CT Work đợt 5b K-1 — bình luận đầy đủ + voice note, qua HTTP thật + Postgres cục bộ (kho R2 GIẢ trong RAM,
 * STT GIẢ — không gọi Groq):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw5b.db.test.ts
 *
 *   L  Luồng: trả lời gốc / trả lời một trả lời ⇒ gắn vào gốc · cha khác thẻ ⇒ 400 · người được trả lời nhận "New reply"
 *      (không nhận thêm WORK_COMMENT) · bình luận trang cũng có luồng + báo người được trả lời.
 *   F  Tệp: tải từ ô bình luận (qua backend) = bản nháp, không lẫn vào Attachments của thẻ · gửi bình luận chỉ có tệp ·
 *      không gắn được nháp của người khác / tệp đã gửi · bỏ nháp · trần 10 tệp/bình luận.
 *   V  Voice: kiểm kiểu/độ dài · phiên âm nền (STT giả) ⇒ DONE + vào bodyText ⇒ JQL `comment ~` / `text ~` tìm được ·
 *      sửa bình luận vẫn giữ phiên âm · không nghe ra lời ⇒ NO_SPEECH · STT lỗi ⇒ FAILED · không có khoá ⇒ NO_KEY
 *      (audio vẫn lưu) ⇒ "Retry" sau khi có khoá ⇒ DONE · VIEWER không ghi âm được.
 *   K  Khách cổng: không thấy/nghe bình luận INTERNAL (404 URL) · nghe được PUBLIC (+ phiên âm) cả ở trang thẻ lẫn cổng ·
 *      không trả lời được ghi chú nội bộ · trả lời PUBLIC dưới gốc nội bộ đứng như gốc · JQL không dò được chữ nội bộ ·
 *      không gọi được tuyến tải voice/tệp mới.
 *   R  Registry (MCP): get_issue có luồng + "comment #id" + phiên âm · lệnh comment có reply_to.
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

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `k1${Date.now().toString(36)}`;
const userIds: number[] = [];
type U = { id: number; token: string; email: string; username: string };

describe('CT Work đợt 5b K-1 — luồng, tệp, voice note, khách cổng (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, dev: U, viewer: U, client: U;
  let wsId = 0, pid = 0;
  let cfg: any;
  let shared = 0, internal = 0; // số thẻ: đã chia sẻ khách / nội bộ
  const objects = new Map<string, { body: Buffer; ct: string }>();
  let sttScript: Array<(buf: Buffer) => { text: string; language?: string } | Error> = [];
  const sttSeen: number[] = [];
  const savedKey = process.env.GROQ_API_KEY;

  async function mkUser(name: string): Promise<U> {
    const username = `${tag}_${name}`;
    const email = `${username}@test.local`;
    const u = await prisma.user.create({ data: { username, email, password: 'x' } });
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
  async function upload(u: U, path: string, field: string, name: string, type: string, bytes: Buffer, extra: Record<string, string> = {}) {
    const form = new FormData();
    form.append(field, new Blob([new Uint8Array(bytes)], { type }), name);
    for (const [k, v] of Object.entries(extra)) form.append(k, v);
    const res = await fetch(`${base}/api/v1/work${path}`, { method: 'POST', headers: { Authorization: `Bearer ${u.token}` }, body: form });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json };
  }
  const doc = (text: string) => ({ type: 'doc', content: text ? [{ type: 'paragraph', content: [{ type: 'text', text }] }] : [] });
  const typeId = (c: any, k: string) => c.issueTypes.find((t: any) => t.key === k).id;
  const audio = (n = 6000) => Buffer.alloc(n, 7);
  const voice = (u: U, num: number, durationMs = 4200, type = 'audio/webm;codecs=opus', bytes = audio()) =>
    upload(u, `/projects/${pid}/issues/${num}/comment-voice`, 'audio', 'tin-thoai.webm', type, bytes, { durationMs: String(durationMs) });
  async function waitNotif(receiverId: number, pred: (n: any) => boolean, ms = 3000) {
    const end = Date.now() + ms;
    for (;;) {
      const rows = await prisma.socialNotification.findMany({ where: { receiverId }, orderBy: { id: 'asc' } });
      const hit = rows.filter(pred);
      if (hit.length || Date.now() > end) return hit;
      await new Promise((r) => setTimeout(r, 50));
    }
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    process.env.WORK_EMAIL_NOTIFICATIONS = 'false';
    files._setCommentStoreForTests({
      async put(key, body, ct) { objects.set(key, { body, ct }); },
      async read(key) { const o = objects.get(key); if (!o) throw new Error('missing'); return o.body; },
      async head(key) { const o = objects.get(key); return o ? { size: o.body.length, contentType: o.ct } : null; },
      async del(key) { objects.delete(key); },
    });
    files._setSttForTests(async (buf) => {
      sttSeen.push(buf.length);
      const f = sttScript.shift();
      const r = f ? f(buf) : { text: 'default transcript words here' };
      if (r instanceof Error) throw r;
      return { text: r.text, language: r.language ?? 'vi', noSpeechProb: 0.01, avgLogprob: -0.2 };
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
    files._setCommentStoreForTests(null);
    files._setSttForTests(null);
    if (savedKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = savedKey;
    if (wsId) await prisma.workSpace.deleteMany({ where: { id: wsId } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('dựng: dự án CLIENT (cổng khách bật) — dev MEMBER, viewer VIEWER, khách CLIENT; một thẻ chia sẻ, một thẻ nội bộ', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `K1 ${tag}` })).data.id;
    await call(owner, 'POST', `/workspaces/${wsId}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'VN', name: 'Voice notes', template: 'COMPANY', kind: 'CLIENT' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    assert.equal(p.data.modules.clientPortal, true);
    await call(owner, 'PUT', `/projects/${pid}/members/${dev.id}`, { role: 'MEMBER' });
    await call(owner, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    const inv = await call(owner, 'POST', `/projects/${pid}/portal/invite`, { emails: [client.email] });
    assert.equal(inv.status, 201, JSON.stringify(inv.raw));
    cfg = (await call(owner, 'GET', `/projects/${pid}`)).data;
    shared = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Login page' })).data.number;
    internal = (await call(owner, 'POST', `/projects/${pid}/issues`, { typeId: typeId(cfg, 'TASK'), title: 'Refactor auth' })).data.number;
    assert.equal((await call(owner, 'PUT', `/projects/${pid}/issues/${shared}/client-visible`, { visible: true })).status, 200);
  });

  // ═══ L: luồng ═════════════════════════════════════════════════════

  let root = 0, reply1 = 0;
  it('L1 trả lời gốc ⇒ parentId = gốc; trả lời một trả lời ⇒ vẫn gắn vào gốc (một cấp)', async () => {
    root = (await call(owner, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('Who owns the session refactor?') })).data.id;
    const r1 = await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('I can take it'), parentId: root });
    assert.equal(r1.status, 201, JSON.stringify(r1.raw));
    reply1 = r1.data.id;
    assert.equal(r1.data.parentId, root);
    const r2 = await call(owner, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('Great, thanks'), parentId: reply1 });
    assert.equal(r2.data.parentId, root, 'trả lời một trả lời ⇒ gắn vào gốc');
    const list = (await call(viewer, 'GET', `/projects/${pid}/issues/${internal}/comments`)).data;
    assert.deepEqual(list.map((c: any) => c.parentId), [null, root, root]);
    assert.deepEqual(list[0].attachments, []);
  });

  it('L2 cha ở thẻ khác / không tồn tại ⇒ 400 WORK_BAD_PARENT', async () => {
    const r = await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('x'), parentId: root });
    assert.equal(r.code, 'WORK_BAD_PARENT');
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('x'), parentId: 999_999_999 })).code, 'WORK_BAD_PARENT');
  });

  it('L3 người được trả lời nhận "New reply" (WORK_COMMENT, reply=true) đúng một lần — không thêm WORK_COMMENT thường', async () => {
    const hit = await waitNotif(dev.id, (n) => n.type === 'WORK_COMMENT' && n.payload?.reply === true);
    assert.equal(hit.length, 1, 'dev được trả lời ở L1 (owner trả lời reply1 của dev)');
    const plain = await prisma.socialNotification.findMany({ where: { receiverId: dev.id, type: 'WORK_COMMENT', secondaryEntityId: hit[0].secondaryEntityId } });
    assert.equal(plain.length, 1, 'không có bản WORK_COMMENT thứ hai cho cùng bình luận');
    const ownerGot = await waitNotif(owner.id, (n) => n.type === 'WORK_COMMENT' && n.payload?.reply === true);
    assert.equal(ownerGot.length, 1, 'owner được dev trả lời');
  });

  it('L4 bình luận trang: trả lời một trả lời ⇒ gốc; tác giả được trả lời nhận báo', async () => {
    const pg = await call(owner, 'POST', `/projects/${pid}/pages`, { title: 'Meeting notes' });
    assert.equal(pg.status, 201, JSON.stringify(pg.raw));
    const n = pg.data.number;
    const c0 = (await call(owner, 'POST', `/projects/${pid}/pages/${n}/comments`, { bodyJson: doc('Please review section 2') })).data;
    const c1 = await call(dev, 'POST', `/projects/${pid}/pages/${n}/comments`, { bodyJson: doc('Reviewed'), parentId: c0.id });
    assert.equal(c1.data.parentId, c0.id);
    const c2 = await call(owner, 'POST', `/projects/${pid}/pages/${n}/comments`, { bodyJson: doc('Thanks!'), parentId: c1.data.id });
    assert.equal(c2.data.parentId, c0.id);
    const got = await waitNotif(dev.id, (x) => x.secondaryEntityId === c2.data.id && x.payload?.reply === true);
    assert.equal(got.length, 1);
  });

  // ═══ F: tệp ══════════════════════════════════════════════════════

  let fileA = 0;
  it('F1 tệp từ ô bình luận = bản nháp, KHÔNG nằm trong Attachments của thẻ', async () => {
    const r = await upload(dev, `/projects/${pid}/issues/${internal}/comment-files`, 'file', 'nhật-ký lỗi.txt', 'text/plain', Buffer.from('stack trace…'));
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    fileA = r.data.id;
    assert.equal(r.data.fileName, 'nhật-ký lỗi.txt', 'tên tiếng Việt giữ đúng UTF-8');
    assert.equal(r.data.commentId, null);
    const detail = (await call(dev, 'GET', `/projects/${pid}/issues/${internal}`)).data;
    assert.ok(!detail.attachments.some((a: any) => a.id === fileA), 'bản nháp không lẫn vào khối Attachments');
  });

  it('F2 không gắn được nháp của người khác; gửi bình luận chỉ có tệp (thân trống) được; gửi lại tệp đã gắn ⇒ 400', async () => {
    assert.equal((await call(owner, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc(''), attachmentIds: [fileA] })).code, 'WORK_BAD_ATTACHMENT');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('') })).code, 'WORK_EMPTY_COMMENT');
    const c = await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc(''), attachmentIds: [fileA] });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    const row = await prisma.workComment.findUniqueOrThrow({ where: { id: c.data.id }, select: { bodyText: true } });
    assert.equal(row.bodyText, '[Files] nhật-ký lỗi.txt');
    const list = (await call(viewer, 'GET', `/projects/${pid}/issues/${internal}/comments`)).data;
    const mine = list.find((x: any) => x.id === c.data.id);
    assert.equal(mine.attachments[0].fileName, 'nhật-ký lỗi.txt');
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('again'), attachmentIds: [fileA] })).code, 'WORK_BAD_ATTACHMENT');
    // Xem/tải: nhân viên lấy được URL ký sẵn.
    const url = await call(viewer, 'GET', `/projects/${pid}/attachments/${fileA}/url?inline=1`);
    assert.equal(url.status, 200, JSON.stringify(url.raw));
    assert.match(url.data.url, /^https:\/\//);
  });

  it('F3 bỏ nháp: chỉ người tải lên; tệp đã gửi thì không bỏ được bằng đường nháp; trần 10 tệp/bình luận', async () => {
    const d = (await upload(dev, `/projects/${pid}/issues/${internal}/comment-files`, 'file', 'a.log', 'text/plain', Buffer.from('a'))).data.id;
    assert.equal((await call(owner, 'DELETE', `/projects/${pid}/comment-files/${d}`)).status, 404);
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/comment-files/${d}`)).status, 200);
    assert.equal(await prisma.workAttachment.count({ where: { id: d } }), 0);
    assert.equal((await call(dev, 'DELETE', `/projects/${pid}/comment-files/${fileA}`)).status, 404);
    const ids: number[] = [];
    for (let i = 0; i < 11; i++) ids.push((await upload(dev, `/projects/${pid}/issues/${internal}/comment-files`, 'file', `f${i}.txt`, 'text/plain', Buffer.from('x'))).data.id);
    assert.equal((await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('many'), attachmentIds: ids })).status, 400);
    for (const x of ids) await call(dev, 'DELETE', `/projects/${pid}/comment-files/${x}`);
  });

  // ═══ V: voice note ═══════════════════════════════════════════════

  let voiceDone = 0, voiceComment = 0;
  it('V1 kiểm kiểu/độ dài/quyền; voice note là bản nháp PENDING', async () => {
    assert.equal((await voice(dev, internal, 200_000)).code, 'WORK_VOICE_TOO_LONG');
    assert.equal((await voice(dev, internal, 4000, 'video/webm')).code, 'WORK_VOICE_TYPE');
    assert.equal((await voice(dev, internal, 100)).code, 'WORK_VOICE_TOO_SHORT');
    assert.equal((await voice(viewer, internal)).status, 403, 'VIEWER không bình luận ⇒ không ghi âm');
    const r = await voice(dev, internal, 4200);
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    voiceDone = r.data.id;
    assert.equal(r.data.voice.durationMs, 4200);
    assert.equal(r.data.voice.transcriptStatus, 'PENDING');
    assert.match(r.data.fileName, /^voice-note-\d+\.webm$/);
    assert.equal(r.data.mime, 'audio/webm', 'bỏ ;codecs');
  });

  it('V2 gửi ⇒ phiên âm NỀN (STT giả) ⇒ DONE, phiên âm vào bodyText ⇒ JQL comment~ / text~ tìm được', async () => {
    process.env.GROQ_API_KEY = savedKey ?? '';
    sttScript = [() => ({ text: 'đăng nhập bị lỗi trên Safari khi bật chế độ riêng tư', language: 'vi' })];
    const c = await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('Bug repro'), attachmentIds: [voiceDone] });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    voiceComment = c.data.id;
    await files._awaitTranscriptionsForTests();
    assert.equal(sttSeen.at(-1), 6000, 'STT nhận đúng audio từ kho');
    const v = await prisma.workVoiceNote.findUniqueOrThrow({ where: { attachmentId: voiceDone } });
    assert.equal(v.transcriptStatus, 'DONE');
    assert.equal(v.language, 'vi');
    const row = await prisma.workComment.findUniqueOrThrow({ where: { id: voiceComment }, select: { bodyText: true } });
    assert.equal(row.bodyText, 'Bug repro\n[Voice note] đăng nhập bị lỗi trên Safari khi bật chế độ riêng tư');
    const s1 = await call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('comment ~ "Safari"')}`);
    assert.equal(s1.status, 200, JSON.stringify(s1.raw));
    assert.deepEqual(s1.data.items.map((i: any) => i.number), [internal]);
    const s2 = await call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('text ~ "riêng tư"')}`);
    assert.deepEqual(s2.data.items.map((i: any) => i.number), [internal]);
    const list = (await call(viewer, 'GET', `/projects/${pid}/issues/${internal}/comments`)).data;
    const vc = list.find((x: any) => x.id === voiceComment);
    assert.equal(vc.attachments[0].voice.transcript, 'đăng nhập bị lỗi trên Safari khi bật chế độ riêng tư');
  });

  it('V3 sửa bình luận vẫn giữ phiên âm trong chữ tìm kiếm', async () => {
    assert.equal((await call(dev, 'PATCH', `/projects/${pid}/issues/${internal}/comments/${voiceComment}`, { bodyJson: doc('Bug repro (edited)') })).status, 200);
    const row = await prisma.workComment.findUniqueOrThrow({ where: { id: voiceComment }, select: { bodyText: true } });
    assert.match(row.bodyText, /^Bug repro \(edited\)\n\[Voice note\] đăng nhập/);
  });

  it('V4 không nghe ra lời ⇒ NO_SPEECH; STT lỗi ⇒ FAILED (không ném ra ngoài)', async () => {
    sttScript = [() => ({ text: 'Thanks for watching!' }), () => new Error('groq stt HTTP 500')];
    const a = (await voice(dev, internal)).data.id;
    const b = (await voice(dev, internal)).data.id;
    const c = await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc(''), attachmentIds: [a, b] });
    assert.equal(c.status, 201, JSON.stringify(c.raw));
    await files._awaitTranscriptionsForTests();
    const rows = await prisma.workVoiceNote.findMany({ where: { attachmentId: { in: [a, b] } }, orderBy: { attachmentId: 'asc' } });
    assert.deepEqual(rows.map((r) => r.transcriptStatus), ['NO_SPEECH', 'FAILED']);
    assert.equal(rows[0].transcript, null);
    const row = await prisma.workComment.findUniqueOrThrow({ where: { id: c.data.id }, select: { bodyText: true } });
    assert.equal(row.bodyText, '[Voice note]');
  });

  it('V5 không có GROQ_API_KEY ⇒ NO_KEY, audio vẫn lưu; có khoá rồi bấm "Retry" ⇒ DONE (người gửi/ADMIN, không phải VIEWER)', async () => {
    files._setSttForTests(null);
    delete process.env.GROQ_API_KEY;
    const a = (await voice(dev, internal)).data;
    await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('no key'), attachmentIds: [a.id] });
    await files._awaitTranscriptionsForTests();
    const v = await prisma.workVoiceNote.findUniqueOrThrow({ where: { attachmentId: a.id } });
    assert.equal(v.transcriptStatus, 'NO_KEY');
    const att = await prisma.workAttachment.findUniqueOrThrow({ where: { id: a.id } });
    assert.ok(objects.has(att.r2Key), 'audio vẫn nằm trên kho');
    files._setSttForTests(async () => ({ text: 'cần thêm test cho màn đăng ký', language: 'vi', noSpeechProb: 0.01, avgLogprob: -0.1 }));
    assert.equal((await call(viewer, 'POST', `/projects/${pid}/attachments/${a.id}/transcribe`)).status, 403);
    const r = await call(owner, 'POST', `/projects/${pid}/attachments/${a.id}/transcribe`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.status, 'DONE');
    const s = await call(dev, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('comment ~ "màn đăng ký"')}`);
    assert.deepEqual(s.data.items.map((i: any) => i.number), [internal]);
  });

  it('V6 trần lượt phiên âm/ngày của dự án ⇒ LIMIT (audio vẫn lưu)', async () => {
    process.env.WORK_VOICE_STT_DAILY = '1';
    try {
      const a = (await voice(dev, internal)).data.id;
      await call(dev, 'POST', `/projects/${pid}/issues/${internal}/comments`, { bodyJson: doc('limit'), attachmentIds: [a] });
      await files._awaitTranscriptionsForTests();
      assert.equal((await prisma.workVoiceNote.findUniqueOrThrow({ where: { attachmentId: a } })).transcriptStatus, 'LIMIT');
    } finally {
      delete process.env.WORK_VOICE_STT_DAILY;
    }
  });

  // ═══ K: khách cổng ═══════════════════════════════════════════════

  let pubVoice = 0, intVoice = 0, pubComment = 0, intRoot = 0;
  it('K1 khách chỉ thấy + nghe voice note của bình luận PUBLIC trên thẻ đã chia sẻ', async () => {
    files._setSttForTests(async () => ({ text: 'secret internal pricing discussion', noSpeechProb: 0.01, avgLogprob: -0.1 }));
    intVoice = (await voice(owner, shared)).data.id;
    intRoot = (await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('internal note'), attachmentIds: [intVoice] })).data.id;
    await files._awaitTranscriptionsForTests();
    files._setSttForTests(async () => ({ text: 'the new login page is ready for review', noSpeechProb: 0.01, avgLogprob: -0.1 }));
    pubVoice = (await voice(owner, shared)).data.id;
    const pub = await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('Update for you'), visibility: 'PUBLIC', attachmentIds: [pubVoice] });
    assert.equal(pub.data.visibility, 'PUBLIC');
    pubComment = pub.data.id;
    await files._awaitTranscriptionsForTests();

    const list = await call(client, 'GET', `/projects/${pid}/issues/${shared}/comments`);
    assert.equal(list.status, 200, JSON.stringify(list.raw));
    assert.deepEqual(list.data.map((c: any) => c.id), [pubComment]);
    assert.equal(list.data[0].attachments[0].voice.transcript, 'the new login page is ready for review');
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${pubVoice}/url?inline=1`)).status, 200);
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${intVoice}/url?inline=1`)).status, 404, 'voice note nội bộ ⇒ 404');
    // Trang cổng (portal request) cũng có tệp + phiên âm.
    const req = await call(client, 'GET', `/projects/${pid}/portal/requests/${shared}`);
    assert.equal(req.status, 200, JSON.stringify(req.raw));
    assert.deepEqual(req.data.comments.map((c: any) => c.id), [pubComment]);
    assert.equal(req.data.comments[0].attachments[0].voice.transcript, 'the new login page is ready for review');
  });

  it('K2 xoá bình luận PUBLIC ⇒ khách mất quyền nghe ngay', async () => {
    const extra = (await voice(owner, shared)).data.id;
    const c = (await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('temp'), visibility: 'PUBLIC', attachmentIds: [extra] })).data.id;
    await files._awaitTranscriptionsForTests();
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${extra}/url`)).status, 200);
    await call(owner, 'DELETE', `/projects/${pid}/issues/${shared}/comments/${c}`);
    assert.equal((await call(client, 'GET', `/projects/${pid}/attachments/${extra}/url`)).status, 404);
  });

  it('K3 khách không trả lời được ghi chú nội bộ; trả lời PUBLIC dưới gốc nội bộ đứng như gốc với khách', async () => {
    assert.equal((await call(client, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('hi'), parentId: intRoot })).code, 'WORK_BAD_PARENT');
    const cr = await call(client, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('Looks good!'), parentId: pubComment });
    assert.equal(cr.status, 201, JSON.stringify(cr.raw));
    assert.equal(cr.data.parentId, pubComment);
    const staffReply = await call(owner, 'POST', `/projects/${pid}/issues/${shared}/comments`, { bodyJson: doc('FYI client'), visibility: 'PUBLIC', parentId: intRoot });
    assert.equal(staffReply.data.parentId, intRoot);
    const list = (await call(client, 'GET', `/projects/${pid}/issues/${shared}/comments`)).data;
    assert.equal(list.find((c: any) => c.id === staffReply.data.id).parentId, null, 'không lộ id gốc nội bộ');
    assert.equal(list.find((c: any) => c.id === cr.data.id).parentId, pubComment);
    const staffList = (await call(owner, 'GET', `/projects/${pid}/issues/${shared}/comments`)).data;
    assert.equal(staffList.find((c: any) => c.id === staffReply.data.id).parentId, intRoot);
  });

  it('K4 JQL của khách không dò được chữ/phiên âm nội bộ; nhân viên thì được', async () => {
    const q = encodeURIComponent('comment ~ "pricing"');
    assert.equal((await call(owner, 'GET', `/projects/${pid}/search?jql=${q}`)).data.items.length, 1);
    const c = await call(client, 'GET', `/projects/${pid}/search?jql=${q}`);
    assert.equal(c.status, 200, JSON.stringify(c.raw));
    assert.equal(c.data.items.length, 0);
    const c2 = await call(client, 'GET', `/projects/${pid}/search?jql=${encodeURIComponent('comment ~ "ready for review"')}`);
    assert.deepEqual(c2.data.items.map((i: any) => i.number), [shared]);
  });

  it('K5 khách không gọi được tuyến tải voice/tệp mới, không bấm phiên âm lại', async () => {
    assert.equal((await voice(client, shared)).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await upload(client, `/projects/${pid}/issues/${shared}/comment-files`, 'file', 'x.txt', 'text/plain', Buffer.from('x'))).code, 'CLIENT_PORTAL_ONLY');
    assert.equal((await call(client, 'POST', `/projects/${pid}/attachments/${pubVoice}/transcribe`)).code, 'CLIENT_PORTAL_ONLY');
  });

  // ═══ R: registry ═════════════════════════════════════════════════

  it('R1 get_issue (MCP) trả luồng + "comment #id" + phiên âm; lệnh comment có reply_to', async () => {
    const tok = (await call(dev, 'POST', '/me/api-tokens', { name: 'k1', scopes: ['read', 'write'] })).data.token;
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
    const g = await tool('get_issue', { project: 'VN', issue: internal });
    assert.equal(g.isError, false, g.text);
    assert.match(g.text, new RegExp(`comment #${root} `));
    assert.match(g.text, new RegExp(`#### ↳ reply comment #${reply1} `));
    assert.match(g.text, /🎙 Voice note #\d+ \(0:04\) — transcript: đăng nhập bị lỗi trên Safari/);
    assert.match(g.text, /Transcription is not available|Transcription skipped/);
    assert.match(g.text, /📎 File #\d+ nhật-ký lỗi\.txt/);
    const w = await tool('comment', { project: 'VN', issue: internal, markdown: 'Agreed — via MCP', reply_to: reply1 });
    assert.equal(w.isError, false, w.text);
    const out = JSON.parse(w.text);
    assert.equal(out.thread, root);
    const row = await prisma.workComment.findUniqueOrThrow({ where: { id: out.commentId }, select: { parentId: true, visibility: true } });
    assert.deepEqual(row, { parentId: root, visibility: 'INTERNAL' });
  });
});
