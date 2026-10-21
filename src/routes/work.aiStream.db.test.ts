/**
 * CT Work — trợ lý dự án bản STREAM `POST /projects/:pid/ai/chat/stream` (20/10/2026), HTTP thật + Postgres cục bộ, model
 * GIẢ (`_setAskForTests`, hàm giả gọi `onToken` như luồng token thật):
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.aiStream.db.test.ts
 *
 *   1. Vòng đọc + stream: progress preparing → thinking → reading ["NT-1"] → thinking → delta… → done; nháp nối lại = reply;
 *      `done` cùng hình dạng /ai/chat (reply, actions, quota, threadId, question, answer); câu trả lời + đề xuất được LƯU.
 *   2. Lỗi trước khi mở luồng (thân sai, VIEWER) ⇒ JSON thường đúng mã như /ai/chat, không phải SSE.
 *   3. Model trả rỗng hai lần ⇒ sự kiện `error` WORK_AI_BAD_OUTPUT, câu hỏi đánh dấu lỗi; hỏi lại bằng retryMessageId
 *      (stream) ⇒ có trả lời, cờ lỗi xoá.
 *   4. Client ngắt giữa vòng đọc ⇒ không gọi thêm lượt model, câu hỏi KHÔNG treo "đang chờ" (đánh dấu lỗi), không lưu
 *      câu trả lời.
 *   5. /ai/chat thường vẫn y nguyên.
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

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `aist${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];

type U = { id: number; token: string; email: string; username: string };
type Ev = { event: string; data: any };

describe('CT Work — trợ lý dự án bản stream (SSE)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let lead: U, dev: U, viewer: U;
  let pid = 0;
  let slugOf = '';
  /** Mỗi phần tử: chuỗi trả về, hoặc hàm (để chờ / đếm). */
  let script: Array<string | (() => Promise<string>)> = [];
  let calls = 0;
  const prompts: string[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email, fullName: name } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email, username: u.username };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, code: json.code as string | undefined, raw: json };
  }
  /** Gọi bản stream, đọc hết luồng, tách sự kiện SSE. */
  async function stream(u: U, body: unknown, signal?: AbortSignal) {
    const res = await fetch(`${base}/api/v1/work/projects/${pid}/ai/chat/stream`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` }, body: JSON.stringify(body), signal,
    });
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('text/event-stream')) return { status: res.status, ct, json: (await res.json().catch(() => ({}))) as any, events: [] as Ev[] };
    const text = await res.text();
    const events: Ev[] = [];
    for (const block of text.split('\n\n')) {
      const ev = /^event: (.+)$/m.exec(block)?.[1];
      const data = /^data: (.+)$/m.exec(block)?.[1];
      if (ev && data) events.push({ event: ev, data: JSON.parse(data) });
    }
    return { status: res.status, ct, json: null, events };
  }
  const draftOf = (events: Ev[]) => {
    let d = '';
    for (const e of events) { if (e.event === 'reset') d = ''; if (e.event === 'delta') d += e.data.text; }
    return d;
  };

  before(async () => {
    (await import('../services/work/ai.service.js'))._setAskForTests(async (_system, user, onToken) => {
      calls++;
      prompts.push(user);
      const next = script.shift() ?? '{"reply":"ok"}';
      const text = typeof next === 'string' ? next : await next();
      // Như luồng token thật: mẩu 5 ký tự.
      for (let i = 0; i < text.length; i += 5) onToken?.(text.slice(i, i + 5));
      return text;
    });
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [lead, dev, viewer] = await Promise.all(['lead', 'dev', 'viewer'].map(mkUser));
    const ws = await call(lead, 'POST', '/workspaces', { name: `AIS ${tag}` });
    assert.equal(ws.status, 201, JSON.stringify(ws.raw));
    wsIds.push(ws.data.id);
    slugOf = ws.data.slug;
    await call(lead, 'POST', `/workspaces/${ws.data.id}/invites`, { emails: [dev.email, viewer.email], role: 'MEMBER' });
    const p = await call(lead, 'POST', `/workspaces/${ws.data.id}/projects`, { key: 'NT', name: 'Nha tro', template: 'COMPANY' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    await call(lead, 'PUT', `/projects/${pid}/members/${viewer.id}`, { role: 'VIEWER' });
    const i1 = await call(lead, 'POST', `/projects/${pid}/issues`, { typeKey: 'TASK', title: 'Trang dang nhap MAGIC-READ-42' });
    assert.equal(i1.status, 201, JSON.stringify(i1.raw));
  });

  after(async () => {
    server?.close();
    (await import('../services/work/ai.service.js'))._setAskForTests(null);
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('vòng đọc + stream: progress → delta → done (cùng hình dạng /ai/chat), câu trả lời được lưu', async () => {
    const reply = '### Việc gấp\n- [NT-1](/work/x) — **hạn 21/10**\n"trích" 😀 \\ xong';
    calls = 0;
    prompts.length = 0;
    script = [
      '{"reply":"","reads":[{"tool":"command","name":"read_issue","args":{"issue":1}}]}',
      async () => JSON.stringify({ reply, actions: [{ type: 'add_comment', number: 1, text: 'Đã đọc' }] }),
    ];
    const r = await stream(dev, { message: 'Tôi làm NT-1 thế nào?' });
    assert.equal(r.status, 200);
    const kinds = r.events.map((e) => (e.event === 'progress' ? `progress:${e.data.phase}` : e.event));
    assert.equal(kinds[0], 'progress:preparing');
    // NT-1 được nêu trong câu hỏi ⇒ mã đọc SẴN (prefetched) trước lượt model đầu.
    const pre0 = r.events.find((e) => e.event === 'progress' && e.data.phase === 'reading' && e.data.prefetched);
    assert.deepEqual(pre0?.data.items, ['NT-1']);
    const iRead = r.events.findIndex((e) => e.event === 'progress' && e.data.phase === 'reading' && !e.data.prefetched);
    assert.ok(iRead > 0, JSON.stringify(kinds));
    assert.deepEqual(r.events[iRead].data.items, ['NT-1']);
    assert.equal(r.events[iRead].data.round, 1);
    assert.ok(kinds.indexOf('progress:thinking') < iRead && kinds.lastIndexOf('progress:thinking') > iRead);
    assert.ok(kinds.indexOf('delta') > iRead, 'lượt xin đọc không phát chữ');
    assert.ok(kinds.filter((k) => k === 'progress:thinking').length >= 2);
    assert.ok(kinds.filter((k) => k === 'delta').length > 3, 'stream thật: nhiều delta');
    assert.equal(kinds.at(-1), 'done');
    assert.equal(draftOf(r.events), reply);
    assert.ok(prompts[1]?.includes('MAGIC-READ-42'), 'kết quả read_issue có trong prompt lượt 2');
    assert.equal(calls, 2);

    const done = r.events.at(-1)!.data;
    assert.equal(done.type, 'done');
    // 22/10/2026: link sâu do MÃ dựng — đường bịa `/work/x` bị thay bằng link THẬT của thẻ NT-1 (bản chuẩn ở `done`).
    const chuan = reply.replace('(/work/x)', `(/work/${slugOf}/NT/issue/1)`);
    assert.equal(done.reply, chuan);
    assert.equal(done.actions.length, 1);
    assert.ok(done.threadId && done.question?.id && done.answer?.id);
    assert.ok('quota' in done);
    const pre = r.events[0].data;
    assert.equal(pre.threadId, done.threadId);
    assert.equal(pre.questionId, done.question.id);
    const saved = await prisma.workAiMessage.findUniqueOrThrow({ where: { id: done.answer.id } });
    assert.equal(saved.content, chuan);
    assert.equal((saved.actions as any[]).length, 1);
    assert.equal((await prisma.workAiMessage.findUniqueOrThrow({ where: { id: done.question.id } })).error, null);
  });

  it('lỗi trước khi mở luồng ⇒ JSON thường, đúng mã như /ai/chat', async () => {
    const bad = await stream(dev, { message: '' });
    assert.equal(bad.status, 400);
    assert.ok(!bad.ct.includes('event-stream'));
    const v = await stream(viewer, { message: 'hi' });
    const vOld = await call(viewer, 'POST', `/projects/${pid}/ai/chat`, { message: 'hi' });
    assert.equal(v.status, 403);
    assert.equal(v.status, vOld.status);
    assert.equal(v.json.code, vOld.code);
  });

  it('model trả rỗng hai lần ⇒ event error WORK_AI_BAD_OUTPUT + câu hỏi đánh dấu lỗi; hỏi lại (stream) ⇒ có trả lời', async () => {
    script = ['{"reply":""}', '{"reply":"  "}'];
    const r = await stream(dev, { message: 'Câu sẽ hỏng' });
    assert.equal(r.status, 200);
    const err = r.events.at(-1)!;
    assert.equal(err.event, 'error');
    assert.equal(err.data.code, 'WORK_AI_BAD_OUTPUT');
    assert.equal(err.data.status, 502);
    assert.ok(err.data.message.length > 5);
    const qid = r.events[0].data.questionId as number;
    assert.ok((await prisma.workAiMessage.findUniqueOrThrow({ where: { id: qid } })).error);

    script = ['{"reply":"Giờ thì được","actions":[]}'];
    const again = await stream(dev, { message: 'x', retryMessageId: qid });
    assert.equal(again.events.at(-1)!.event, 'done');
    assert.equal(again.events.at(-1)!.data.reply, 'Giờ thì được');
    assert.equal(again.events[0].data.questionId, qid);
    assert.equal((await prisma.workAiMessage.findUniqueOrThrow({ where: { id: qid } })).error, null);
  });

  it('client ngắt giữa vòng đọc ⇒ không gọi thêm model, câu hỏi đánh dấu lỗi (không treo), không lưu trả lời', async () => {
    calls = 0;
    let release!: () => void;
    const gate = new Promise<void>((r) => { release = r; });
    let entered!: () => void;
    const inModel = new Promise<void>((r) => { entered = r; });
    script = [
      async () => { entered(); await gate; return '{"reply":"","reads":[{"tool":"command","name":"read_issue","args":{"issue":1}}]}'; },
      '{"reply":"KHÔNG ĐƯỢC TỚI ĐÂY"}',
    ];
    const ctrl = new AbortController();
    const before = await prisma.workAiMessage.count({ where: { thread: { projectId: pid } } });
    const p = stream(dev, { message: 'Câu sẽ bị ngắt' }, ctrl.signal).catch((e) => e);
    await inModel;
    ctrl.abort();
    await p;
    await new Promise((r) => setTimeout(r, 100));
    release();
    // Chờ server chạy tới mốc kiểm (sau vòng đọc) rồi đánh dấu lỗi.
    let q: { error: string | null } | null = null;
    for (let i = 0; i < 50; i++) {
      q = await prisma.workAiMessage.findFirst({ where: { thread: { projectId: pid }, role: 'user', content: 'Câu sẽ bị ngắt' }, select: { error: true } });
      if (q?.error) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    assert.match(q?.error ?? '', /connection closed/, 'câu hỏi phải được đánh dấu lỗi WORK_AI_CANCELLED');
    assert.equal(calls, 1, 'không gọi model lượt 2');
    // Chỉ có câu hỏi được thêm (1 tin), không có câu trả lời.
    assert.equal(await prisma.workAiMessage.count({ where: { thread: { projectId: pid } } }), before + 1);
    script = [];
  });

  it('/ai/chat thường vẫn y nguyên (JSON, cùng hình dạng)', async () => {
    script = ['{"reply":"Bản thường","actions":[]}'];
    const r = await call(dev, 'POST', `/projects/${pid}/ai/chat`, { message: 'Hỏi thường' });
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.reply, 'Bản thường');
    assert.deepEqual(Object.keys(r.data).sort(), ['actions', 'answer', 'question', 'quota', 'reply', 'threadId']);
  });
});
