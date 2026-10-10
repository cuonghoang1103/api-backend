/**
 * CTW đợt 9c — quiz lớp học qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.ctw9c.db.test.ts
 *
 * Kịch bản: giảng viên dựng ngân hàng (5 kiểu câu + nhập GIFT/bảng có xem trước + AI nháp phải duyệt) ⇒ quiz (câu cố định +
 * rút theo chủ đề) ⇒ giao ⇒ sinh viên làm: ĐÁP ÁN KHÔNG LỘ ở mọi JSON trả về (danh sách, chi tiết, lượt làm, sau nộp khi
 * chưa tới hạn) ⇒ hết giờ máy chủ từ chối ghi + tự nộp ⇒ giới hạn số lần ⇒ SV không xem/ghi bài người khác ⇒ chấm tay câu
 * điền ngắn ⇒ thống kê + xuất xlsx ⇒ sau hạn mới hiện đáp án ⇒ sổ điểm 9b nhận cột quiz ⇒ agent 403, người ngoài 404.
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
import { agentTopRouteAllowed } from '../services/work/permissions.js';
import { readXlsx } from '../services/work/xlsxStyled.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `c9c${Date.now().toString(36)}`;
const userIds: number[] = [];
const SECRET = 'Zanzibarsecret';

type U = { id: number; token: string; email: string; username: string };

describe('CTW đợt 9c — quiz trắc nghiệm tự chấm (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let teacher: U, alice: U, bob: U, outsider: U, bot: U;
  let classId = 0, quizId = 0, quiz2 = 0;
  const qids: Record<string, number> = {};
  let aliceA1 = 0, aliceA2 = 0;

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
    const text = await res.text();
    let json: any = {};
    try { json = JSON.parse(text); } catch { /* tệp */ }
    return { status: res.status, data: json.data, code: (json.code ?? json.error?.code) as string | undefined, raw: json, text };
  }
  /** Không được có trong BẤT KỲ JSON nào sinh viên nhận trước khi được phép xem đáp án. */
  function assertNoLeak(text: string, where: string) {
    for (const banned of [SECRET, 'Routers-explained', '"answer"', '"explanation"', '"accepted"', '"correct"', '"src"', '"settings"', '"seed"', '"results"', 'manual']) {
      assert.ok(!text.includes(banned), `${where}: lộ ${banned}`);
    }
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const quizSvc = await import('../services/work/quiz.service.js');
    quizSvc._setQuizAskForTests(async () => JSON.stringify({ questions: [
      { type: 'SINGLE', prompt: 'AI: which protocol is connectionless?', options: ['TCP', 'UDP', 'SCTP', 'QUIC'], correct: [1], explanation: 'From the slide' },
      { type: 'TRUE_FALSE', prompt: 'AI: TCP guarantees ordering.', value: true },
      { type: 'SINGLE', prompt: 'AI broken', options: ['only one'] },
    ] }));
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    [teacher, alice, bob, outsider] = await Promise.all(['teacher', 'alice', 'bob', 'outsider'].map((n) => mkUser(n)));
    bot = await mkUser('bot', 'AGENT');
    const r = await call(teacher, 'POST', '/classes', { subject: 'SWT301', classCode: `Q${tag}`.slice(0, 12), term: 'FA26' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    classId = r.data.id;
    for (const [i, u] of [alice, bob, bot].entries()) {
      await prisma.workClassStudent.create({ data: { classId, userId: u.id, email: u.email, studentCode: `HE9C${i}`, fullName: u.username, source: 'JOIN', joinedAt: new Date() } });
    }
  });

  after(async () => {
    server?.close();
    const svc = await import('../services/work/quiz.service.js');
    svc._setQuizAskForTests(null);
    if (userIds.length) {
      await prisma.workClass.deleteMany({ where: { ownerId: { in: userIds } } });
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  it('ngân hàng: 5 kiểu câu; sinh viên không đọc được ngân hàng (403)', async () => {
    const mk = async (k: string, body: Record<string, unknown>) => {
      const r = await call(teacher, 'POST', `/classes/${classId}/quiz-bank`, body);
      assert.equal(r.status, 201, `${k}: ${JSON.stringify(r.raw)}`);
      qids[k] = r.data.id;
    };
    await mk('single', { type: 'SINGLE', topic: 'Net', prompt: 'Which layer routes packets? $L_3$', points: 2, options: [{ id: 'a', text: 'Physical' }, { id: 'b', text: 'Network' }, { id: 'c', text: 'Session' }], answer: { correct: ['b'] }, explanation: 'Routers-explained' });
    await mk('multi', { type: 'MULTI', topic: 'Net', prompt: 'Transport protocols?', points: 2, options: ['TCP', 'IP', 'UDP'], answer: { correct: ['o1', 'o3'] }, settings: { partial: true } });
    await mk('tf', { type: 'TRUE_FALSE', topic: 'Net', prompt: 'IP is reliable.', points: 1, answer: { value: false } });
    await mk('short', { type: 'SHORT', topic: 'Geo', prompt: 'Secret island?', points: 1, answer: { accepted: [SECRET] } });
    await mk('match', { type: 'MATCH', topic: 'Java', prompt: 'Match', points: 2, options: [{ left: 'final', right: 'constant' }, { left: 'static', right: 'class-level' }] });
    const bad = await call(teacher, 'POST', `/classes/${classId}/quiz-bank`, { type: 'SINGLE', prompt: 'x', options: ['a', 'b'], answer: { correct: [] } });
    assert.deepEqual([bad.status, bad.code], [400, 'WORK_QUIZ_QUESTION_BAD']);
    assert.equal((await call(alice, 'GET', `/classes/${classId}/quiz-bank`)).status, 403);
    assert.equal((await call(alice, 'POST', `/classes/${classId}/quiz-bank`, { type: 'TRUE_FALSE', prompt: 'x', answer: { value: true } })).status, 403);
    assert.equal((await call(outsider, 'GET', `/classes/${classId}/quiz-bank`)).status, 404);
    const bank = await call(teacher, 'GET', `/classes/${classId}/quiz-bank`);
    assert.equal(bank.data.questions.length, 5);
    assert.ok(bank.data.topics.some((t: any) => t.topic === 'Net' && t.count === 3));
  });

  it('nhập GIFT + bảng: xem trước lỗi từng dòng, xác nhận mới ghi; tải mẫu xlsx', async () => {
    const gift = 'Q one? { =yes ~no }\n\nQ two? {T}\n\nBroken without braces';
    const pv = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/import`, { format: 'gift', text: gift, topic: 'Imported' });
    assert.equal(pv.status, 200);
    assert.deepEqual([pv.data.total, pv.data.valid, pv.data.invalid, pv.data.imported], [3, 2, 1, 0]);
    assert.equal(pv.data.rows[2].line, 5);
    const csv = 'Type,Topic,Question,A,B,Answer\nsingle,Imported,CSV q?,x,y,B\nsingle,Imported,Bad,x,y,Z';
    const pv2 = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/import`, { format: 'table', text: csv });
    assert.deepEqual([pv2.data.valid, pv2.data.invalid], [1, 1]);
    const ok = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/import`, { format: 'gift', text: gift, topic: 'Imported', confirm: true });
    assert.equal(ok.data.imported, 2);
    const tpl = await fetch(`${base}/api/v1/work/classes/${classId}/quiz-bank/template.xlsx`, { headers: { Authorization: `Bearer ${teacher.token}` } });
    assert.equal(tpl.status, 200);
    const sheets = readXlsx(Buffer.from(await tpl.arrayBuffer()));
    assert.equal(sheets[0].text(1, 3), 'Question');
    // Mẫu tải về nhập lại được ngay.
    const back = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/import`, { format: 'table', xlsxBase64: Buffer.from(await (await fetch(`${base}/api/v1/work/classes/${classId}/quiz-bank/template.xlsx`, { headers: { Authorization: `Bearer ${teacher.token}` } })).arrayBuffer()).toString('base64') });
    assert.equal(back.data.valid, 5, JSON.stringify(back.data.rows.filter((r: any) => r.errors.length)));
    assert.equal((await fetch(`${base}/api/v1/work/classes/${classId}/quiz-bank/template.xlsx`, { headers: { Authorization: `Bearer ${alice.token}` } })).status, 403);
  });

  it('AI gợi ý ⇒ NHÁP; quiz chứa nháp không giao được tới khi duyệt từng câu', async () => {
    const short = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/ai-suggest`, { source: 'too short' });
    assert.equal(short.code, 'WORK_QUIZ_AI_SHORT');
    const r = await call(teacher, 'POST', `/classes/${classId}/quiz-bank/ai-suggest`, { source: 'TCP is connection-oriented and guarantees ordering. UDP is connectionless and does not. '.repeat(3), count: 3, topic: 'AI' });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    assert.deepEqual([r.data.created, r.data.rejected], [2, 1]);
    const drafts = await call(teacher, 'GET', `/classes/${classId}/quiz-bank?drafts=1`);
    assert.equal(drafts.data.questions.length, 2);
    assert.ok(drafts.data.questions.every((q: any) => q.aiDraft && q.draft));
    const draftId = drafts.data.questions[0].id;
    const qz = await call(teacher, 'POST', `/classes/${classId}/quizzes`, { title: 'Draft check', items: [{ kind: 'Q', questionId: draftId }] });
    const pub = await call(teacher, 'POST', `/classes/${classId}/quizzes/${qz.data.id}/publish`, {});
    assert.deepEqual([pub.status, pub.code], [400, 'WORK_QUIZ_NOT_READY']);
    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}/quiz-bank/${draftId}`, { approve: true })).status, 200);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/quizzes/${qz.data.id}/publish`, {})).status, 200);
    assert.equal((await call(teacher, 'DELETE', `/classes/${classId}/quizzes/${qz.data.id}`)).status, 200);
  });

  it('dựng quiz (câu cố định + rút 1 câu chủ đề Net) ⇒ giao; sinh viên chưa thấy bản nháp', async () => {
    const r = await call(teacher, 'POST', `/classes/${classId}/quizzes`, {
      title: 'Quiz 1', items: [{ kind: 'Q', questionId: qids.single }, { kind: 'Q', questionId: qids.short }, { kind: 'Q', questionId: qids.match }, { kind: 'Q', questionId: qids.multi }, { kind: 'DRAW', topic: 'Net', count: 1 }],
      closeAt: new Date(Date.now() + 3600_000).toISOString(), timeLimitMin: 20, maxAttempts: 2, showAnswers: 'AFTER_DUE', scoring: 'HIGHEST', layout: 'ONE_PER_PAGE',
    });
    assert.equal(r.status, 201, JSON.stringify(r.raw));
    quizId = r.data.id;
    assert.equal(r.data.questionCount, 5);
    assert.equal((await call(alice, 'GET', `/classes/${classId}/quizzes/${quizId}`)).status, 404, 'nháp ẩn với SV');
    assert.equal((await call(alice, 'GET', `/classes/${classId}/quizzes`)).data.quizzes.length, 0);
    const p = await call(teacher, 'POST', `/classes/${classId}/quizzes/${quizId}/publish`, {});
    assert.equal(p.data.status, 'PUBLISHED');
    // Giao ⇒ một dòng bảng tin 9a (refType QUIZ) + hạn trong lịch lớp 9a (kéo qua quizDeadlines).
    const post = await prisma.workClassPost.findFirst({ where: { classId, refType: 'QUIZ', refId: quizId, deletedAt: null } });
    assert.ok(post?.publishedAt, 'đăng bảng tin');
    assert.ok(post?.url?.includes(`q=${quizId}`));
    await call(teacher, 'POST', `/classes/${classId}/quizzes/${quizId}/publish`, {});
    assert.equal(await prisma.workClassPost.count({ where: { classId, refType: 'QUIZ', refId: quizId } }), 1, 'giao lại không đẻ dòng mới');
    const { listCalendar } = await import('../services/work/classCalendar.service.js');
    const cal = await listCalendar(alice.id, classId) as any;
    assert.ok(JSON.stringify(cal).includes('Quiz 1'), 'hạn quiz trong lịch lớp');
    const pv = await call(teacher, 'GET', `/classes/${classId}/quizzes/${quizId}/preview`);
    assert.ok(pv.text.includes(SECRET), 'giảng viên xem thử CÓ đáp án');
    assert.equal((await call(alice, 'GET', `/classes/${classId}/quizzes/${quizId}/preview`)).status, 403);
  });

  it('ĐÁP ÁN KHÔNG LỘ: danh sách, chi tiết, bắt đầu, đọc lượt, lưu, nộp (trước hạn)', async () => {
    const list = await call(alice, 'GET', `/classes/${classId}/quizzes`);
    assertNoLeak(list.text, 'list');
    assert.equal(list.data.quizzes[0].me.canStart, true);
    const detail = await call(alice, 'GET', `/classes/${classId}/quizzes/${quizId}`);
    assertNoLeak(detail.text, 'detail');
    assert.equal(detail.data.items, undefined, 'SV không nhận danh sách mục');
    const start = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    assert.equal(start.status, 201, JSON.stringify(start.raw));
    assertNoLeak(start.text, 'start');
    aliceA1 = start.data.id;
    assert.equal(start.data.paper.length, 5);
    assert.ok(start.data.deadlineAt && start.data.serverNow);
    assert.ok(start.data.paper.every((p: any) => /^q\d+$/.test(p.key)));
    const again = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    assert.equal(again.data.id, aliceA1, 'bấm lại ⇒ làm tiếp lượt đang mở');

    // Trả lời: single đúng, short đúng (khác hoa/dấu cách), match đúng, multi một nửa.
    const paper = start.data.paper as any[];
    const att = await prisma.workClassQuizAttempt.findUniqueOrThrow({ where: { id: aliceA1 } });
    const full = att.paper as any[];
    const answers: Record<string, unknown> = {};
    for (const p of full) {
      if (p.questionId === qids.single) answers[p.key] = { choice: p.options.find((o: any) => o.src === 'b').id };
      if (p.questionId === qids.short) answers[p.key] = { text: `  ${SECRET.toUpperCase()} ` };
      if (p.questionId === qids.match) answers[p.key] = { pairs: Object.fromEntries(p.left.map((l: any) => [l.id, p.right.find((r: any) => r.src === l.src).id])) };
      if (p.questionId === qids.multi) answers[p.key] = { choices: [p.options.find((o: any) => o.src === 'o1').id] };
    }
    assert.equal(paper.length, full.length);
    const first = Object.keys(answers)[0];
    const s1 = await call(alice, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/answers`, { answers: { [first]: answers[first] } });
    assert.equal(s1.status, 200, JSON.stringify(s1.raw));
    assertNoLeak(s1.text, 'save');
    // Lưu song song từng câu không mất câu nào (khoá dòng).
    await Promise.all(Object.entries(answers).map(([k, v]) => call(alice, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/answers`, { answers: { [k]: v } })));
    const read = await call(alice, 'GET', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}`);
    assertNoLeak(read.text, 'read');
    assert.equal(Object.keys(read.data.attempt.responses).length, 4);
    const blur = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/focus`, { event: 'blur' });
    assert.equal(blur.data.blurCount, 1);
    const sub = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/submit`, {});
    assert.equal(sub.status, 200, JSON.stringify(sub.raw));
    assertNoLeak(sub.text, 'submit (trước hạn, AFTER_DUE)');
    assert.equal(sub.data.status, 'SUBMITTED');
    assert.equal(sub.data.reveal, false);
    assert.equal(sub.data.review, null);
    const drawn = full.find((p) => ![qids.single, qids.short, qids.match, qids.multi].includes(p.questionId));
    assert.ok(drawn, 'có câu rút từ chủ đề Net');
    assert.equal(sub.data.score, 2 + 1 + 2 + 1, 'single 2 + short 1 + match 2 + multi một nửa 1; câu rút bỏ trống');
    assert.equal(sub.data.maxScore, 7 + drawn.points);
    const list2 = await call(alice, 'GET', `/classes/${classId}/quizzes`);
    assertNoLeak(list2.text, 'list sau nộp');
  });

  it('sinh viên không xem/ghi bài người khác; không gọi tuyến giảng viên', async () => {
    assert.equal((await call(bob, 'GET', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}`)).status, 404);
    assert.equal((await call(bob, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/answers`, { answers: {} })).status, 404);
    assert.equal((await call(bob, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/submit`, {})).status, 404);
    for (const path of ['results', 'stats', 'preview']) assert.equal((await call(bob, 'GET', `/classes/${classId}/quizzes/${quizId}/${path}`)).status, 403, path);
    assert.equal((await call(bob, 'PATCH', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/grade`, { key: 'q1', points: 0 })).status, 403);
    assert.equal((await call(bob, 'PATCH', `/classes/${classId}/quizzes/${quizId}`, { title: 'hack' })).status, 403);
    assert.equal((await call(outsider, 'GET', `/classes/${classId}/quizzes`)).status, 404);
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`)).status, 403, 'giảng viên xem thử, không làm');
  });

  it('hết giờ: máy chủ từ chối ghi + tự nộp phần đã lưu; hết số lần ⇒ 409', async () => {
    const st = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    assert.equal(st.status, 201);
    aliceA2 = st.data.id;
    assert.equal(st.data.number, 2);
    const key = st.data.paper[0].key;
    assert.equal((await call(alice, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA2}/answers`, { answers: { [key]: { value: true } } })).status, 200);
    await prisma.workClassQuizAttempt.update({ where: { id: aliceA2 }, data: { deadlineAt: new Date(Date.now() - 10_000) } });
    const late = await call(alice, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA2}/answers`, { answers: { [key]: { text: 'x' } } });
    assert.deepEqual([late.status, late.code], [409, 'WORK_QUIZ_TIME_UP']);
    const row = await prisma.workClassQuizAttempt.findUniqueOrThrow({ where: { id: aliceA2 } });
    assert.equal(row.status, 'SUBMITTED');
    assert.equal(row.autoSubmitted, true);
    assert.equal(row.submittedAt?.getTime(), row.deadlineAt?.getTime(), 'giờ nộp = hạn, không phải lúc phát hiện');
    const again = await call(alice, 'PUT', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA2}/answers`, { answers: {} });
    assert.equal(again.code, 'WORK_QUIZ_SUBMITTED');
    const third = await call(alice, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    assert.deepEqual([third.status, third.code], [409, 'WORK_QUIZ_NO_ATTEMPTS']);
    // Hết giờ được phát hiện LƯỜI ở lối đọc (không cần ai gọi PUT): bob bắt đầu, hạn trôi, giảng viên mở kết quả.
    const b = await call(bob, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    await prisma.workClassQuizAttempt.update({ where: { id: b.data.id }, data: { deadlineAt: new Date(Date.now() - 10_000) } });
    const res = await call(teacher, 'GET', `/classes/${classId}/quizzes/${quizId}/results`);
    const bobRow = res.data.rows.find((r: any) => r.userId === bob.id);
    assert.equal(bobRow.attempts[0].status, 'SUBMITTED');
    assert.equal(bobRow.attempts[0].autoSubmitted, true);
  });

  it('giảng viên: kết quả (rời tab, cần xem lại), chấm tay câu điền ngắn, thống kê, xuất xlsx', async () => {
    const res = await call(teacher, 'GET', `/classes/${classId}/quizzes/${quizId}/results`);
    const a = res.data.rows.find((r: any) => r.userId === alice.id);
    assert.equal(a.attempts.length, 2);
    assert.equal(a.attempts[0].blurCount, 1);
    assert.equal(a.counted.score, 6, 'HIGHEST');
    const det = await call(teacher, 'GET', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}`);
    assert.ok(det.text.includes(SECRET), 'giảng viên thấy đáp án');
    const multiKey = det.data.attempt.items.find((i: any) => i.questionId === qids.multi).key;
    const g = await call(teacher, 'PATCH', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/grade`, { key: multiKey, points: 2 });
    assert.equal(g.status, 200, JSON.stringify(g.raw));
    assert.equal(g.data.attempt.score, 7);
    assert.equal((await call(teacher, 'PATCH', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}/grade`, { key: multiKey, points: 9 })).status, 400);
    const st = await call(teacher, 'GET', `/classes/${classId}/quizzes/${quizId}/stats`);
    assert.equal(st.data.attempts, 2, 'lượt ĐẦU của mỗi SV');
    const single = st.data.questions.find((q: any) => q.questionId === qids.single);
    assert.ok(single.choices.some((c: any) => c.correct && c.count >= 1));
    const x = await fetch(`${base}/api/v1/work/classes/${classId}/quizzes/${quizId}/export.xlsx`, { headers: { Authorization: `Bearer ${teacher.token}` } });
    assert.equal(x.status, 200);
    const sheets = readXlsx(Buffer.from(await x.arrayBuffer()));
    assert.deepEqual(sheets.map((s) => s.name), ['Scores', 'Item analysis', 'Summary']);
    assert.equal(sheets[0].text(1, 1), 'Student code');
  });

  it('sau hạn (AFTER_DUE) mới hiện đáp án + giải thích; IMMEDIATE hiện ngay sau nộp', async () => {
    await prisma.workClassQuiz.update({ where: { id: quizId }, data: { closeAt: new Date(Date.now() - 1000) } });
    const r = await call(alice, 'GET', `/classes/${classId}/quizzes/${quizId}/attempts/${aliceA1}`);
    assert.equal(r.data.attempt.reveal, true);
    assert.ok(r.text.includes(SECRET));
    assert.ok(r.text.includes('Routers-explained'));
    const closed = await call(bob, 'POST', `/classes/${classId}/quizzes/${quizId}/attempts`);
    assert.equal(closed.code, 'WORK_QUIZ_CLOSED');

    const q2 = await call(teacher, 'POST', `/classes/${classId}/quizzes`, { title: 'Quiz 2', items: [{ kind: 'Q', questionId: qids.tf }], showAnswers: 'IMMEDIATE', maxAttempts: 1 });
    quiz2 = q2.data.id;
    await call(teacher, 'POST', `/classes/${classId}/quizzes/${quiz2}/publish`, {});
    const s = await call(bob, 'POST', `/classes/${classId}/quizzes/${quiz2}/attempts`);
    const sub = await call(bob, 'POST', `/classes/${classId}/quizzes/${quiz2}/attempts/${s.data.id}/submit`, { answers: { [s.data.paper[0].key]: { value: false } } });
    assert.equal(sub.data.score, 1);
    assert.equal(sub.data.reveal, true);
    assert.equal(sub.data.review[s.data.paper[0].key].answer.value, false);
    // NEVER: không bao giờ.
    await prisma.workClassQuiz.update({ where: { id: quiz2 }, data: { showAnswers: 'NEVER' } });
    const nv = await call(bob, 'GET', `/classes/${classId}/quizzes/${quiz2}/attempts/${s.data.id}`);
    assert.equal(nv.data.attempt.review, null);
    assertNoLeak(nv.text, 'NEVER');
    // Đã có lượt làm ⇒ không thu về nháp được.
    assert.equal((await call(teacher, 'POST', `/classes/${classId}/quizzes/${quiz2}/publish`, { publish: false })).code, 'WORK_QUIZ_HAS_ATTEMPTS');
  });

  it('sổ điểm 9b: nguồn "quiz" — giảng viên thấy mọi SV, sinh viên chỉ ô của mình', async () => {
    const { gradebookSources } = await import('../services/work/classGradebookSources.js');
    const src = gradebookSources().find((s) => s.kind === 'quiz');
    assert.ok(src, 'đã đăng ký nguồn quiz');
    const now = new Date();
    const ctxT = { classId, viewer: { userId: teacher.id, manage: true }, userIds: [alice.id, bob.id], now };
    const items = await src!.items(ctxT);
    assert.ok(items.some((i) => i.key === `quiz:${quizId}` && i.category === 'Quiz'));
    const cells = await src!.cells(ctxT, items);
    const aCell = cells.find((c) => c.itemKey === `quiz:${quizId}` && c.userId === alice.id)!;
    assert.equal(aCell.state, 'RETURNED');
    assert.ok(aCell.points! > 0);
    const ctxS = { classId, viewer: { userId: alice.id, manage: false }, userIds: [alice.id, bob.id], now };
    const mine = await src!.cells(ctxS, await src!.items(ctxS));
    assert.ok(mine.every((c) => c.userId === alice.id), 'SV chỉ nhận ô của chính mình');
  });

  it('agent: 403 ở mọi lệnh (kể cả đọc), cả khi có ghế trong lớp; token agent bị chặn ở tầng tuyến', async () => {
    for (const [m, p, b] of [
      ['GET', `/classes/${classId}/quizzes`, undefined], ['GET', `/classes/${classId}/quizzes/${quizId}`, undefined],
      ['POST', `/classes/${classId}/quizzes/${quiz2}/attempts`, undefined], ['POST', `/classes/${classId}/quizzes`, { title: 'x' }],
      ['GET', `/classes/${classId}/quiz-bank`, undefined], ['POST', `/classes/${classId}/quiz-bank/ai-suggest`, { source: 'x'.repeat(100) }],
    ] as const) {
      assert.equal((await call(bot, m, p, b)).status, 403, `${m} ${p}`);
    }
    // Tầng service (lối MCP/script sau này không qua authenticate): agent có ghế trong lớp vẫn 403 ở cả đọc lẫn ghi.
    const svc = await import('../services/work/quiz.service.js');
    for (const fn of [
      () => svc.listQuizzes(bot.id, classId), () => svc.getQuiz(bot.id, classId, quiz2), () => svc.startAttempt(bot.id, classId, quiz2),
      () => svc.createQuestion(bot.id, classId, { type: 'TRUE_FALSE', prompt: 'x', answer: { value: true } }), () => svc.listBank(bot.id, classId),
    ]) await assert.rejects(fn(), (e: any) => e.statusCode === 403);
    assert.equal(agentTopRouteAllowed('GET', `/classes/${classId}/quizzes`), false);
    assert.equal(agentTopRouteAllowed('POST', `/classes/${classId}/quizzes/1/attempts`), false);
  });
});
