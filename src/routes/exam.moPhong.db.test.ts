/**
 * Phòng thi mô phỏng — HTTP + Postgres thật. Không có CSDL ⇒ TỰ BỎ QUA (khuôn codeLab.db.test.ts).
 *   WORK_DB_TEST=1 DATABASE_URL=…/<csdl tạm dựng bằng scripts/db-test-tu-migration.mjs> \
 *     npx tsx --test src/routes/exam.moPhong.db.test.ts
 * Môn thử phải mang mã FER202 (cấu hình mô phỏng khoá theo mã môn) ⇒ CHỈ chạy trên CSDL TẠM: test tự
 * bỏ qua nếu CSDL đã có một môn FER202 thật (không đụng dữ liệu có sẵn). Không gọi LLM thật
 * (EXAM_MO_PHONG_AI_NGAY=0 ⇒ nhánh AI dừng ở trần lượt).
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import AdmZip from 'adm-zip';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { closeRedis } from '../config/redis.js';
import { errorHandler } from '../middleware/errorHandler.js';

process.env.EXAM_MO_PHONG_AI_NGAY = '0';

async function coCsdl(): Promise<boolean> {
  if (!process.env.DATABASE_URL || process.env.WORK_DB_TEST !== '1') return false;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT "mode" FROM "exam_attempts" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    const thatCo = await prisma.course.findFirst({ where: { courseCode: 'FER202' }, select: { id: true } });
    return !thatCo;
  } catch {
    return false;
  }
}

const RUN = await coCsdl();
const tag = `mp${Date.now().toString(36)}`;

type U = { id: number; token: string };

function zipBuf(files: Record<string, string>): Buffer {
  const z = new AdmZip();
  for (const [k, v] of Object.entries(files)) z.addFile(k, Buffer.from(v));
  return z.toBuffer();
}

describe('Phòng thi mô phỏng (HTTP + DB thật)', { skip: !RUN ? 'không có CSDL tạm (WORK_DB_TEST=1) hoặc CSDL đã có môn FER202 thật' : false }, () => {
  let base = '';
  let server: import('node:http').Server;
  let user: U;
  let other: U;
  let courseId = 0;
  let peExamId = 0;
  let feExamId = 0;
  let exerciseId = 0;
  let groupId = 0;
  const secIds: number[] = [];

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token };
  }

  async function call(u: U | null, path: string, method = 'GET', body?: unknown) {
    const isForm = body instanceof FormData;
    const res = await fetch(`${base}/api/v1/exams${path}`, {
      method,
      headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, message: json.message as string | undefined };
  }

  async function nopZip(u: U, attemptId: number, buf: Buffer, name = 'bai.zip') {
    const fd = new FormData();
    fd.append('file', new Blob([new Uint8Array(buf)], { type: 'application/zip' }), name);
    fd.append('timeSpentSeconds', '120');
    return call(u, `/mock/attempts/${attemptId}/pe/submit`, 'POST', fd);
  }

  before(async () => {
    const { default: mock } = await import('./exam.moPhong.routes.js');
    const { default: exam } = await import('./exam.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/exams/mock', mock);
    app.use('/api/v1/exams', exam);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    user = await mkUser('u');
    other = await mkUser('o');

    const c = await prisma.course.create({ data: { title: `${tag} React`, slug: `${tag}-react`, courseCode: 'FER202', academyType: 'FPT' } });
    courseId = c.id;
    for (const [i, t] of ['Section 0 — Intro|||Mục 0', 'Chapter 1 — Overview|||Chương 1', 'Chapter 2 — ES6|||Chương 2'].entries()) {
      const s = await prisma.courseSection.create({ data: { courseId, title: t, sortOrder: i } });
      secIds.push(s.id);
    }
    // Đề FE thật: 8 câu chương 1, 3 câu chương 2, 1 câu chưa phân chương.
    const fe = await prisma.exam.create({ data: { courseId, kind: 'FE', code: `${tag}-FE1`, title: 'FE1', isPublished: true, source: 'REAL' } });
    feExamId = fe.id;
    for (let i = 0; i < 12; i++) {
      await prisma.examQuestion.create({
        data: {
          examId: fe.id, kind: 'MCQ', sortOrder: i, points: 0.2, prompt: `<p>${tag} real ${i}</p>`,
          options: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }], correctIndexes: [i % 4],
          explanation: `why ${i}`, sectionId: i < 8 ? secIds[1] : i < 11 ? secIds[2] : null,
        },
      });
    }
    // Quiz chương 2 (Academy) — 5 câu, có 1 câu tự luận phải bị bỏ.
    const les = await prisma.lesson.create({ data: { sectionId: secIds[2], title: 'Quiz 2', lessonType: 'QUIZ', isPublished: true } });
    await prisma.lessonDetail.create({
      data: {
        lessonId: les.id, videoPlatform: 'EMBED',
        quizData: { questions: [
          ...Array.from({ length: 4 }, (_, i) => ({ question: `${tag} quiz ${i} <b>?|||vi ${i}`, options: ['x', 'y', 'z'], correctIndex: 1 })),
          { question: 'essay', sampleAnswer: 'x' },
        ] },
      },
    });
    // Đề PE thật (Exam Room) có rubric.
    const pe = await prisma.exam.create({
      data: { courseId, kind: 'PE', peType: 'WRITE', code: `${tag}-PE1`, title: 'PE1', isPublished: true, durationMinutes: 85, passMark: 5, attachmentUrl: 'https://example.invalid/PE1-Given.zip' },
    });
    peExamId = pe.id;
    await prisma.examQuestion.create({ data: { examId: pe.id, kind: 'WRITE', sortOrder: 0, points: 4, prompt: '<p>Q1 list</p>', sampleSolution: 'SOL1', rubric: [{ id: 'c1', criterion: 'fetch', maxScore: 2 }, { id: 'c2', criterion: 'render', maxScore: 2 }] } });
    await prisma.examQuestion.create({ data: { examId: pe.id, kind: 'WRITE', sortOrder: 1, points: 6, prompt: '<p>Q2 edit</p>', rubric: [{ id: 'd1', criterion: 'patch', maxScore: 6 }] } });
    // Đề PE Code Lab có máy chấm trình duyệt.
    const g = await prisma.codeGroup.create({ data: { name: `${tag} g`, slug: `${tag}-g` } });
    groupId = g.id;
    const tr = await prisma.codeTrack.create({ data: { groupId, name: 'fer', slug: 'fer202-practice', language: 'javascript', status: 'PUBLISHED' } });
    const mo = await prisma.codeModule.create({ data: { trackId: tr.id, name: 'pe', slug: 'fer202-13-pe-x' } });
    const ex = await prisma.codeExercise.create({
      data: {
        moduleId: mo.id, trackId: tr.id, slug: `${tag}-pe-x`, title: 'PE X', language: 'javascript', kind: 'pe', gradeKind: 'react', estimatedMinutes: 85,
        problemHtml: '<p>Build it</p>', starterCodeJson: [{ name: 'src/App.js', code: 'export default ()=>null' }],
        testsJson: { loai: 'react', thangDiem: [{ ma: 'f1', ten: 'Q1', diem: 6 }, { ma: 'f2', ten: 'Q2', diem: 4 }], jsonServer: { db: { items: [] } },
          kiem: [{ nhom: 'f1', moTa: 'a' }, { nhom: 'f1', moTa: 'b' }, { nhom: 'f2', moTa: 'c', an: true }] },
      },
    });
    exerciseId = ex.id;
  });

  after(async () => {
    await prisma.examAttempt.deleteMany({ where: { userId: { in: [user.id, other.id] } } });
    await prisma.course.deleteMany({ where: { id: courseId } });
    await prisma.codeGroup.deleteMany({ where: { id: groupId } });
    await prisma.user.deleteMany({ where: { id: { in: [user.id, other.id] } } });
    server?.close();
    await prisma.$disconnect();
    await closeRedis().catch(() => {});
  });

  it('môn + tổng quan: ngân hàng, phân bố theo đề thật, danh sách PE', async () => {
    const m = await call(null, '/mock/mon');
    assert.equal(m.status, 200);
    assert.ok(m.data.some((x: any) => x.courseCode === 'FER202'));
    const o = await call(user, '/mock/FER202/overview');
    assert.equal(o.status, 200);
    assert.equal(o.data.nganHang.deThat, 12);
    assert.equal(o.data.nganHang.quiz, 4);
    assert.equal(o.data.nganHang.nguonPhanBo, 'DE_THAT');
    const ch1 = o.data.nganHang.nhom.find((n: any) => n.nhom === `s${secIds[1]}`);
    assert.equal(ch1.deThat, 8);
    assert.deepEqual(o.data.dePe.map((p: any) => [p.nguon, p.coMayCham]), [['CODELAB', true], ['EXAM', false]]);
    assert.equal((await call(null, '/mock/XXX999/overview')).status, 404);
  });

  let feId = 0;
  it('FE thi thật: trộn đúng số câu, ẩn đáp án, tự lưu, nộp, xem lại có thống kê chương/CLO', async () => {
    const t = await call(user, '/mock/FER202/fe', 'POST', { soCau: 10, phut: 30, cheDo: 'thi', nguon: 'mix' });
    assert.equal(t.status, 200, t.message);
    feId = t.data.attemptId;
    assert.equal(t.data.phanBo.reduce((s: number, p: any) => s + p.soCau, 0), 10);
    const g = await call(user, `/mock/attempts/${feId}/fe`);
    assert.equal(g.data.questions.length, 10);
    assert.ok(g.data.questions.every((q: any) => q.correctIndexes === undefined && q.explanation === undefined));
    assert.ok(g.data.attempt.expiresAt);
    // người khác không xem được
    assert.equal((await call(other, `/mock/attempts/${feId}/fe`)).status, 404);
    // thi thật không có "kiểm tra từng câu"
    assert.equal((await call(user, `/mock/attempts/${feId}/fe/check`, 'POST', { questionId: g.data.questions[0].id, selected: [0] })).status, 403);

    const ans: Record<string, number[]> = {};
    for (const q of g.data.questions) ans[q.id] = [0];
    const s = await call(user, `/attempts/${feId}/progress`, 'PUT', { answers: { ...ans, 99999999: [1] }, flags: [g.data.questions[1].id], idx: 3 });
    assert.equal(s.status, 200, s.message);
    const g2 = await call(user, `/mock/attempts/${feId}/fe`);
    assert.deepEqual(g2.data.answers[g.data.questions[0].id], [0]);
    assert.equal(g2.data.answers['99999999'], undefined);
    assert.deepEqual(g2.data.progress, { flags: [g.data.questions[1].id], idx: 3 });

    const n = await call(user, `/mock/attempts/${feId}/fe/submit`, 'POST', { answers: ans, timeSpentSeconds: 99 });
    assert.equal(n.status, 200, n.message);
    assert.equal((await call(user, `/mock/attempts/${feId}/fe/submit`, 'POST', { answers: ans })).status, 409);
    const r = await call(user, `/attempts/${feId}`);
    assert.equal(r.status, 200);
    assert.equal(r.data.mock.loai, 'FE');
    assert.equal(r.data.questions.length, 10);
    assert.ok(r.data.questions.every((q: any) => q.correctIndexes.length > 0));
    const dung = r.data.questions.filter((q: any) => q.correctIndexes.join() === '0').length;
    assert.equal(r.data.attempt.score, Math.round((dung / 10) * 10 * 100) / 100);
    assert.ok(r.data.chapterStats.theoChuong.length >= 1);
    assert.ok(r.data.chapterStats.theoClo.every((c: any) => /^CLO\d$/.test(c.khoa)));
    // câu quiz (id âm) không cho lưu sổ tay
    for (const q of r.data.questions) assert.equal(q.canSave, q.id > 0);
  });

  it('FE luyện: kiểm từng câu ⇒ có đáp án ngay, đáp án đã kiểm bị khoá', async () => {
    const t = await call(user, '/mock/FER202/fe', 'POST', { soCau: 5, cheDo: 'luyen', nguon: 'quiz' });
    assert.equal(t.status, 200, t.message);
    const id = t.data.attemptId;
    const g = await call(user, `/mock/attempts/${id}/fe`);
    assert.equal(g.data.attempt.expiresAt, null);
    assert.equal(g.data.questions.length, 4, 'chỉ 4 câu quiz trắc nghiệm hợp lệ');
    const q = g.data.questions[0];
    const k = await call(user, `/mock/attempts/${id}/fe/check`, 'POST', { questionId: q.id, selected: [1] });
    assert.equal(k.status, 200, k.message);
    assert.equal(k.data.correct, true);
    assert.deepEqual(k.data.correctIndexes, [1]);
    await call(user, `/attempts/${id}/progress`, 'PUT', { answers: { [q.id]: [2] } });
    const g2 = await call(user, `/mock/attempts/${id}/fe`);
    assert.deepEqual(g2.data.answers[q.id], [1], 'không đổi được đáp án đã kiểm');
    assert.deepEqual(g2.data.questions[0].correctIndexes, [1]);
    assert.equal(g2.data.questions[1].correctIndexes, undefined);
  });

  it('FE hết giờ ⇒ máy chủ tự nộp bằng bài đã lưu', async () => {
    const t = await call(user, '/mock/FER202/fe', 'POST', { soCau: 5, cheDo: 'thi' });
    const id = t.data.attemptId;
    await prisma.examAttempt.update({ where: { id }, data: { expiresAt: new Date(Date.now() - 5 * 60_000) } });
    const g = await call(user, `/mock/attempts/${id}/fe`);
    assert.equal(g.data.attempt.status, 'GRADED');
    assert.equal((await call(user, `/attempts/${id}/progress`, 'PUT', { answers: {} })).status, 409);
  });

  it('PE từ Exam Room: lượt mô phỏng không lẫn với lượt thường; zip có node_modules bị từ chối; tự chấm', async () => {
    const t = await call(user, '/mock/FER202/pe', 'POST', { examId: peExamId, cheDo: 'thi' });
    assert.equal(t.status, 200, t.message);
    const id = t.data.attemptId;
    // "Bắt đầu thi" đề thường KHÔNG được resume nhầm lượt mô phỏng
    const std = await call(user, `/${peExamId}/attempts`, 'POST', {});
    assert.equal(std.status, 200);
    assert.notEqual(std.data.attemptId, id);
    assert.equal(std.data.resumed, false);

    const g = await call(user, `/mock/attempts/${id}/pe`);
    assert.equal(g.data.paper.cau.length, 2);
    assert.equal(g.data.paper.cau[0].rubric, null, 'rubric ẩn khi đang thi');
    assert.equal(g.data.paper.cau[0].sampleSolution, null);
    assert.ok(g.data.huongDanMoiTruong.length >= 5);

    const xau = await nopZip(user, id, zipBuf({ 'proj/package.json': '{}', 'proj/src/App.js': 'x', 'proj/node_modules/react/index.js': 'y' }));
    assert.equal(xau.status, 400);
    assert.match(xau.message ?? '', /node_modules/);
    const khongZip = await nopZip(user, id, Buffer.from('Rar!garbage'), 'bai.rar');
    assert.equal(khongZip.status, 400);

    const ok = await nopZip(user, id, zipBuf({ 'proj/package.json': '{"name":"x"}', 'proj/src/App.js': 'export default function App(){ return <div/> }', 'proj/src/index.js': 'import App from "./App"', 'proj/database.json': '{"products":[]}' }));
    assert.equal(ok.status, 200, ok.message);
    assert.equal(ok.data.nop.soTep, 4);
    const g2 = await call(user, `/mock/attempts/${id}/pe`);
    assert.equal(g2.data.attempt.status, 'SUBMITTED');
    assert.equal(g2.data.paper.cau[0].rubric.length, 2);
    assert.equal(g2.data.paper.cau[0].sampleSolution, 'SOL1');

    const tc = await call(user, `/mock/attempts/${id}/pe/self-check`, 'POST', { chon: { [g2.data.paper.cau[0].id]: { c1: 1, c2: 0.5 }, [g2.data.paper.cau[1].id]: { d1: 1 } } });
    assert.equal(tc.status, 200, tc.message);
    assert.equal(tc.data.score, 9);
    assert.equal(tc.data.passed, true);
    const r = await call(user, `/attempts/${id}`);
    assert.equal(r.data.mock.loai, 'PE');
    assert.equal(r.data.attempt.score, 9);

    // AI nhận xét: trần lượt/ngày = 0 trong test ⇒ 429, không gọi LLM.
    const ai = await call(user, `/mock/attempts/${id}/pe/ai-review`, 'POST', {});
    assert.equal(ai.status, 429);
  });

  it('PE từ Code Lab: máy chấm trình duyệt ⇒ máy chủ kiểm hình dạng và tự tính điểm', async () => {
    const t = await call(user, '/mock/FER202/pe', 'POST', { exerciseId, cheDo: 'luyen' });
    assert.equal(t.status, 200, t.message);
    const id = t.data.attemptId;
    const g = await call(user, `/mock/attempts/${id}/pe`);
    assert.equal(g.data.paper.coMayCham, true);
    assert.equal(g.data.paper.given.files[0].name, 'src/App.js');
    assert.equal(g.data.attempt.expiresAt, null);
    assert.equal((await call(user, `/mock/attempts/${id}/pe/auto-grade`, 'POST', { ketQua: [] })).status, 409, 'chưa nộp');
    await nopZip(user, id, zipBuf({ 'package.json': '{}', 'src/App.js': 'export default ()=>null' }));
    assert.equal((await call(user, `/mock/attempts/${id}/pe/auto-grade`, 'POST', { ketQua: [{ dat: true }] })).status, 400, 'sai số kết quả');
    const a = await call(user, `/mock/attempts/${id}/pe/auto-grade`, 'POST', { ketQua: [{ dat: true }, { dat: false }, { dat: true }] });
    assert.equal(a.status, 200, a.message);
    // f1: 6 × 1/2 = 3 · f2: 4 ⇒ 7/10
    assert.equal(a.data.score, 7);
    const r = await call(user, `/attempts/${id}`);
    assert.equal(r.data.attempt.score, 7);
    assert.equal(r.data.attempt.gradingMode, 'AUTO');
  });

  it('Exam Room đề thật: tự lưu ⇒ "Tiếp tục bài thi" trả lại đáp án; xem lại có thống kê chương', async () => {
    const st = await call(user, `/${feExamId}/attempts`, 'POST', {});
    assert.equal(st.data.resumed, false);
    const take = await call(user, `/${feExamId}/take`);
    const q0 = take.data.questions[0].id;
    assert.equal((await call(user, `/attempts/${st.data.attemptId}/progress`, 'PUT', { answers: { [q0]: [0] }, flags: [q0] })).status, 200);
    const lai = await call(user, `/${feExamId}/attempts`, 'POST', {});
    assert.equal(lai.data.resumed, true);
    assert.deepEqual(lai.data.saved.answers[q0], [0]);
    assert.deepEqual(lai.data.saved.flags, [q0]);
    const n = await call(user, `/attempts/${st.data.attemptId}/submit-fe`, 'POST', { answers: { [q0]: [0] } });
    assert.equal(n.status, 200, n.message);
    assert.equal(n.data.mock, null);
    assert.deepEqual(n.data.chapterStats.theoChuong.map((c: any) => c.tong), [8, 3, 1]);
  });

  it('lịch sử + tiến bộ gom cả lượt mô phỏng, có điểm yếu theo chương', async () => {
    const h = await call(user, '/mock/FER202/history');
    assert.equal(h.status, 200);
    assert.ok(h.data.luot.length >= 4);
    assert.ok(h.data.luot.some((l: any) => l.mode === 'MOCK_EXAM' && l.kind === 'FE'));
    assert.ok(h.data.theoChuong.length >= 1);
    // bài đang dở (iOS/desktop "làm tiếp") không gồm lượt mô phỏng
    const d = await call(user, '/attempts/mine?status=IN_PROGRESS');
    assert.ok(d.data.every((x: any) => x.mode === 'STANDARD'));
  });
});
