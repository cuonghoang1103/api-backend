/**
 * CT Work — CTW ĐỢT 9c (13/10/2026): QUIZ TRẮC NGHIỆM TỰ CHẤM của lớp học. Gắn trong work.routes.ts (sau authenticate).
 * Quyền kiểm TRONG quiz.service (vai lớp + `assertHumanActor` ở MỌI lệnh, kể cả đọc). Tuyến top-level `/classes/...` không
 * nằm trong danh sách trắng token agent (`agentTopRouteAllowed`) ⇒ agent 403 ở cả hai tầng.
 *
 *   Ngân hàng câu hỏi (giảng viên)
 *   GET    /classes/:id/quiz-bank?topic=&q=&drafts=1       câu hỏi (CÓ đáp án) + chủ đề
 *   POST   /classes/:id/quiz-bank                           tạo câu
 *   PATCH  /classes/:id/quiz-bank/:qid                      { question?, approve? }
 *   DELETE /classes/:id/quiz-bank/:qid                      lưu trữ
 *   POST   /classes/:id/quiz-bank/image                     { dataBase64 } ⇒ { url }
 *   POST   /classes/:id/quiz-bank/import                    { format: table|aiken|gift, text? | xlsxBase64?, topic?, confirm? }
 *   GET    /classes/:id/quiz-bank/template.xlsx
 *   POST   /classes/:id/quiz-bank/ai-suggest                { source, count?, topic?, types?, language? } ⇒ nháp AI
 *
 *   Quiz
 *   GET    /classes/:id/quizzes                             giảng viên: mọi quiz; sinh viên: quiz đã giao + trạng thái của mình
 *   POST   /classes/:id/quizzes · GET|PATCH|DELETE /classes/:id/quizzes/:quizId
 *   POST   /classes/:id/quizzes/:quizId/publish             { publish?: boolean }
 *   GET    /classes/:id/quizzes/:quizId/preview             giảng viên: một đề mẫu CÓ đáp án
 *   GET    /classes/:id/quizzes/:quizId/results · /stats · /export.xlsx
 *
 *   Lượt làm
 *   POST   /classes/:id/quizzes/:quizId/attempts            bắt đầu / làm tiếp (sinh viên)
 *   GET    /classes/:id/quizzes/:quizId/attempts/:aid       sinh viên: lượt của mình (đáp án chỉ khi được phép); giảng viên: đủ
 *   PUT    /classes/:id/quizzes/:quizId/attempts/:aid/answers   { answers: { q1: {...} } } — 409 WORK_QUIZ_TIME_UP khi hết giờ
 *   POST   /classes/:id/quizzes/:quizId/attempts/:aid/submit    { answers? }
 *   POST   /classes/:id/quizzes/:quizId/attempts/:aid/focus     { event: blur|focus } — chỉ ghi nhận
 *   PATCH  /classes/:id/quizzes/:quizId/attempts/:aid/grade     { key, points|null } — giảng viên chấm tay
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as quiz from '../services/work/quiz.service.js';
import { LAYOUTS, SCORING, SHOW_ANSWERS } from '../services/work/quizRules.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (res: Response, data: unknown, status = 200) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json({ success: true, data });
};
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const fileOut = (res: Response, out: { buf: Buffer; fileName: string }) => {
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buf);
};

// ─── Ngân hàng câu hỏi ───────────────────────────────────────────

// Câu hỏi: hình dạng chi tiết kiểm ở quizRules.validateQuestion (lỗi đọc được theo từng trường).
const question = z.object({
  type: z.string().max(16), topic: z.string().max(80).optional(), prompt: z.string().max(5000), imageUrl: z.string().max(600).nullable().optional(),
  points: z.number().optional(), explanation: z.string().max(5000).nullable().optional(),
  options: z.array(z.union([z.string().max(600), z.object({ id: z.string().max(30).optional(), text: z.string().max(600).optional(), left: z.string().max(600).optional(), right: z.string().max(600).optional() })])).max(12).optional(),
  answer: z.object({ correct: z.array(z.string().max(30)).max(12).optional(), value: z.boolean().optional(), accepted: z.array(z.string().max(600)).max(25).optional() }).optional(),
  settings: z.object({ partial: z.boolean().optional(), caseSensitive: z.boolean().optional(), accentSensitive: z.boolean().optional() }).optional(),
});

router.get('/classes/:id/quiz-bank', asyncHandler(async (req, res) => {
  const f = parse(z.object({ topic: z.string().max(80).optional(), q: z.string().max(100).optional(), drafts: z.enum(['1', '0']).optional() }), req.query);
  ok(res, await quiz.listBank(callerId(req), P(req, 'id'), { topic: f.topic, q: f.q, drafts: f.drafts === '1' }));
}));
router.get('/classes/:id/quiz-bank/template.xlsx', asyncHandler(async (req, res) => {
  await quiz.assertManage(callerId(req), P(req, 'id'));
  fileOut(res, quiz.importTemplateXlsx());
}));
router.post('/classes/:id/quiz-bank', asyncHandler(async (req, res) => ok(res, await quiz.createQuestion(callerId(req), P(req, 'id'), parse(question, req.body ?? {})), 201)));
router.patch('/classes/:id/quiz-bank/:qid', asyncHandler(async (req, res) => {
  ok(res, await quiz.updateQuestion(callerId(req), P(req, 'id'), P(req, 'qid'), parse(z.object({ question: question.optional(), approve: z.boolean().optional() }).strict(), req.body ?? {})));
}));
router.delete('/classes/:id/quiz-bank/:qid', asyncHandler(async (req, res) => { await quiz.archiveQuestion(callerId(req), P(req, 'id'), P(req, 'qid')); ok(res, { archived: true }); }));
router.post('/classes/:id/quiz-bank/image', asyncHandler(async (req, res) => {
  ok(res, await quiz.uploadImage(callerId(req), P(req, 'id'), parse(z.object({ dataBase64: z.string().min(10).max(4_200_000) }).strict(), req.body ?? {})), 201);
}));
router.post('/classes/:id/quiz-bank/import', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    format: z.enum(['table', 'aiken', 'gift']), text: z.string().max(1_000_000).optional(), xlsxBase64: z.string().max(4_000_000).optional(),
    topic: z.string().max(80).optional(), confirm: z.boolean().optional(),
  }).strict(), req.body ?? {});
  ok(res, await quiz.importQuestions(callerId(req), P(req, 'id'), b));
}));
router.post('/classes/:id/quiz-bank/ai-suggest', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    source: z.string().max(30_000), count: z.number().int().min(1).max(15).optional(), topic: z.string().max(80).optional(),
    types: z.array(z.enum(['SINGLE', 'MULTI', 'TRUE_FALSE', 'SHORT', 'MATCH'])).max(5).optional(), language: z.enum(['en', 'vi']).optional(),
  }).strict(), req.body ?? {});
  ok(res, await quiz.aiSuggest(callerId(req), P(req, 'id'), b), 201);
}));

// ─── Quiz ────────────────────────────────────────────────────────

const iso = z.string().max(40).nullable().optional();
const item = z.union([
  z.object({ kind: z.literal('Q'), questionId: z.number().int().positive(), points: z.number().positive().max(100).nullable().optional() }),
  z.object({ kind: z.literal('DRAW'), topic: z.string().min(1).max(80), count: z.number().int().min(1).max(200), points: z.number().positive().max(100).nullable().optional() }),
]);
const quizBody = z.object({
  title: z.string().max(200).optional(), description: z.string().max(8000).nullable().optional(), topic: z.string().max(80).nullable().optional(),
  items: z.array(item).max(200).optional(), openAt: iso, closeAt: iso, timeLimitMin: z.number().int().min(1).max(600).nullable().optional(),
  maxAttempts: z.number().int().min(1).max(20).optional(), shuffleQuestions: z.boolean().optional(), shuffleOptions: z.boolean().optional(),
  layout: z.enum(LAYOUTS).optional(), showAnswers: z.enum(SHOW_ANSWERS).optional(), scoring: z.enum(SCORING).optional(),
}).strict();

router.get('/classes/:id/quizzes', asyncHandler(async (req, res) => ok(res, await quiz.listQuizzes(callerId(req), P(req, 'id')))));
router.post('/classes/:id/quizzes', asyncHandler(async (req, res) => ok(res, await quiz.createQuiz(callerId(req), P(req, 'id'), parse(quizBody, req.body ?? {})), 201)));
router.get('/classes/:id/quizzes/:quizId', asyncHandler(async (req, res) => ok(res, await quiz.getQuiz(callerId(req), P(req, 'id'), P(req, 'quizId')))));
router.patch('/classes/:id/quizzes/:quizId', asyncHandler(async (req, res) => ok(res, await quiz.updateQuiz(callerId(req), P(req, 'id'), P(req, 'quizId'), parse(quizBody, req.body ?? {})))));
router.delete('/classes/:id/quizzes/:quizId', asyncHandler(async (req, res) => { await quiz.deleteQuiz(callerId(req), P(req, 'id'), P(req, 'quizId')); ok(res, { deleted: true }); }));
router.post('/classes/:id/quizzes/:quizId/publish', asyncHandler(async (req, res) => {
  const b = parse(z.object({ publish: z.boolean().optional() }).strict(), req.body ?? {});
  ok(res, await quiz.publishQuiz(callerId(req), P(req, 'id'), P(req, 'quizId'), b.publish !== false));
}));
router.get('/classes/:id/quizzes/:quizId/preview', asyncHandler(async (req, res) => ok(res, await quiz.previewQuiz(callerId(req), P(req, 'id'), P(req, 'quizId')))));
router.get('/classes/:id/quizzes/:quizId/results', asyncHandler(async (req, res) => ok(res, await quiz.results(callerId(req), P(req, 'id'), P(req, 'quizId')))));
router.get('/classes/:id/quizzes/:quizId/stats', asyncHandler(async (req, res) => ok(res, await quiz.stats(callerId(req), P(req, 'id'), P(req, 'quizId')))));
router.get('/classes/:id/quizzes/:quizId/export.xlsx', asyncHandler(async (req, res) => fileOut(res, await quiz.exportXlsx(callerId(req), P(req, 'id'), P(req, 'quizId')))));

// ─── Lượt làm ────────────────────────────────────────────────────

const answers = z.record(z.string().max(12), z.unknown()).refine((o) => Object.keys(o).length <= 200, 'Too many answers');

router.post('/classes/:id/quizzes/:quizId/attempts', asyncHandler(async (req, res) => ok(res, await quiz.startAttempt(callerId(req), P(req, 'id'), P(req, 'quizId')), 201)));
router.get('/classes/:id/quizzes/:quizId/attempts/:aid', asyncHandler(async (req, res) => ok(res, await quiz.getAttempt(callerId(req), P(req, 'id'), P(req, 'quizId'), P(req, 'aid')))));
router.put('/classes/:id/quizzes/:quizId/attempts/:aid/answers', asyncHandler(async (req, res) => {
  ok(res, await quiz.saveAnswers(callerId(req), P(req, 'id'), P(req, 'quizId'), P(req, 'aid'), parse(z.object({ answers }).strict(), req.body ?? {})));
}));
router.post('/classes/:id/quizzes/:quizId/attempts/:aid/submit', asyncHandler(async (req, res) => {
  ok(res, await quiz.submitAttempt(callerId(req), P(req, 'id'), P(req, 'quizId'), P(req, 'aid'), parse(z.object({ answers: answers.optional() }).strict(), req.body ?? {})));
}));
router.post('/classes/:id/quizzes/:quizId/attempts/:aid/focus', asyncHandler(async (req, res) => {
  ok(res, await quiz.logFocus(callerId(req), P(req, 'id'), P(req, 'quizId'), P(req, 'aid'), parse(z.object({ event: z.enum(['blur', 'focus']) }).strict(), req.body ?? {})));
}));
router.patch('/classes/:id/quizzes/:quizId/attempts/:aid/grade', asyncHandler(async (req, res) => {
  ok(res, await quiz.gradeItemManually(callerId(req), P(req, 'id'), P(req, 'quizId'), P(req, 'aid'), parse(z.object({ key: z.string().max(12), points: z.number().min(0).max(100).nullable() }).strict(), req.body ?? {})));
}));

export default router;
