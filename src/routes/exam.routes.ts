/**
 * Exam Room (Phòng thi) API — /api/v1/exams
 *
 * Public:   list published exams (smoke-testable), list per course.
 * Auth:     take an exam, start/resume an attempt, submit FE (auto) or PE
 *           (code .zip / English essay / speaking audio → AI graded), history,
 *           review a finished attempt.
 * Admin:    full CRUD of exams + questions (answer keys live only here).
 */
import { Router, Response } from 'express';
import multer from 'multer';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import { putObject } from '../config/r2.js';
import type { ApiResponse } from '../types/index.js';
import * as examSvc from '../services/exam.service.js';
import {
  gradeCode, gradeWrite, gradeSpeaking, extractCodeFromZip,
  transcribeExamAudio, generateSpeakingQuestions, type PeGradeResult,
} from '../services/exam.grading.service.js';

const router = Router();
const zipUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });
const audioUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024, files: 12 } });

const num = (v: unknown): number => (v == null ? 0 : Number(v));

// ─────────────────────────────────────────────────────────────────────
// Public
// ─────────────────────────────────────────────────────────────────────

// Smoke-testable list of published exams, enriched with course + semester so
// the /exam portal can group them without extra round-trips.
router.get('/', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { isPublished: true },
      select: {
        id: true, courseId: true, kind: true, peType: true, title: true, code: true,
        durationMinutes: true, totalPoints: true, passMark: true, sortOrder: true,
        course: {
          select: {
            title: true, slug: true, courseCode: true,
            semester: { select: { name: true, ordinal: true, code: true } },
          },
        },
        _count: { select: { questions: true } },
      },
      orderBy: [{ courseId: 'asc' }, { kind: 'asc' }, { sortOrder: 'asc' }],
      take: 800,
    });
    const data = exams.map((e) => ({
      id: e.id, courseId: e.courseId, kind: e.kind, peType: e.peType,
      title: e.title, code: e.code, durationMinutes: e.durationMinutes,
      totalPoints: Number(e.totalPoints), passMark: Number(e.passMark),
      questionCount: e._count.questions,
      course: e.course ? { title: e.course.title, slug: e.course.slug, courseCode: e.course.courseCode } : null,
      semester: e.course?.semester ? { name: e.course.semester.name, ordinal: e.course.semester.ordinal, code: e.course.semester.code } : null,
    }));
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Exams for a course (by slug or id) + the caller's attempt summary.
router.get('/course/:courseIdOrSlug', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await examSvc.listExamsForCourse(req.params.courseIdOrSlug, req.userId ?? undefined);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// ─────────────────────────────────────────────────────────────────────
// Auth — taking & attempts
// ─────────────────────────────────────────────────────────────────────

// One exam ready to take (answer keys stripped).
router.get('/:examId/take', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await examSvc.getExamForTaking(Number(req.params.examId));
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Start (or resume) an attempt.
router.post('/:examId/attempts', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await examSvc.startAttempt(Number(req.params.examId), req.userId!);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// My attempt history (optional ?examId=).
router.get('/attempts/mine', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const examId = req.query.examId ? Number(req.query.examId) : undefined;
    const data = await examSvc.listMyAttempts(req.userId!, examId);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Review a finished (or in-progress) attempt — includes keys/explanations.
router.get('/attempts/:attemptId', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = await examSvc.buildReview(Number(req.params.attemptId), req.userId!);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Submit FE (multiple choice) — auto-graded.
router.post('/attempts/:attemptId/submit-fe', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const answers = (req.body?.answers ?? {}) as Record<string, number[]>;
    const data = await examSvc.submitFinalExam(
      Number(req.params.attemptId), req.userId!, answers,
      Number(req.body?.timeSpentSeconds) || 0, req.body?.integritySignals,
    );
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// ── PE grading helpers ────────────────────────────────────────────────

/** Aggregate per-question PE grades into the attempt, persist, and return review. */
async function finalizePe(
  attemptId: number, userId: number,
  perQuestion: Array<{ questionId: number; grade: PeGradeResult }>,
  extra: { answers?: object; timeSpentSeconds?: number; integritySignals?: unknown; gradingMode?: string } = {},
) {
  const attempt = await examSvc.loadOwnedAttempt(attemptId, userId);
  const totalPoints = num(attempt.exam.totalPoints) || 10;
  const maxRaw = perQuestion.reduce((s, p) => s + p.grade.maxScore, 0) || 1;
  const raw = perQuestion.reduce((s, p) => s + p.grade.score, 0);
  const score = Math.round((raw / maxRaw) * totalPoints * 100) / 100;
  const passed = score >= num(attempt.exam.passMark);
  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'GRADED', submittedAt: new Date(),
      timeSpentSeconds: Math.max(0, Math.floor(extra.timeSpentSeconds ?? attempt.timeSpentSeconds ?? 0)),
      score, maxScore: totalPoints, passed,
      gradingMode: extra.gradingMode ?? attempt.gradingMode ?? 'AI',
      answers: (extra.answers ?? (attempt.answers as object)) as object,
      feedback: { perQuestion } as object,
      integritySignals: (extra.integritySignals ?? undefined) as object | undefined,
    },
  });
  return examSvc.buildReview(attemptId, userId);
}

// Submit PE (CODE) — upload ONE .zip of all files; every CODE question is
// graded against it, scores aggregated.
router.post('/attempts/:attemptId/submit-code', authenticate, zipUpload.single('file'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const attempt = await examSvc.loadOwnedAttempt(attemptId, req.userId!);
    if (attempt.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
    if (attempt.exam.kind !== 'PE' || attempt.exam.peType !== 'CODE') throw new AppError('Đề này không phải PE code', 400);
    if (!req.file?.buffer) throw new AppError('Chưa chọn file .zip để nộp', 400);

    const { files, combined } = extractCodeFromZip(req.file.buffer);
    // Persist the raw zip for audit / re-review.
    const stored = await putObject(
      `documents/exam/${req.userId}/${attemptId}-${Date.now()}.zip`,
      req.file.buffer, 'application/zip', 'private, max-age=0',
    );

    const codeQs = attempt.exam.questions.filter((q) => q.kind === 'CODE');
    const perQuestion = [];
    for (const q of codeQs) {
      const grade = await gradeCode({
        userId: req.userId!, points: num(q.points), prompt: q.prompt,
        language: q.language, expectedOutput: q.expectedOutput, sampleSolution: q.sampleSolution,
        rubric: q.rubric, submittedCode: combined,
      });
      perQuestion.push({ questionId: q.id, grade });
    }
    const data = await finalizePe(attemptId, req.userId!, perQuestion, {
      answers: { zipUrl: stored.url, files: files.map((f) => f.name) },
      timeSpentSeconds: Number(req.body?.timeSpentSeconds) || 0,
      gradingMode: 'AI',
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Submit PE (WRITE) — body { essays: { [questionId]: englishText }, timeSpentSeconds }.
router.post('/attempts/:attemptId/submit-write', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const attempt = await examSvc.loadOwnedAttempt(attemptId, req.userId!);
    if (attempt.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
    if (attempt.exam.kind !== 'PE' || attempt.exam.peType !== 'WRITE') throw new AppError('Đề này không phải PE viết', 400);
    const essays = (req.body?.essays ?? {}) as Record<string, string>;

    const writeQs = attempt.exam.questions.filter((q) => q.kind === 'WRITE');
    const perQuestion = [];
    for (const q of writeQs) {
      const essay = String(essays[String(q.id)] ?? '').trim();
      if (!essay) { perQuestion.push({ questionId: q.id, grade: emptyGrade(num(q.points)) }); continue; }
      const grade = await gradeWrite({ userId: req.userId!, points: num(q.points), prompt: q.prompt, rubric: q.rubric, essay });
      perQuestion.push({ questionId: q.id, grade });
    }
    const data = await finalizePe(attemptId, req.userId!, perQuestion, {
      answers: { essays }, timeSpentSeconds: Number(req.body?.timeSpentSeconds) || 0, gradingMode: 'AI',
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Submit PE (SPEAK) — multipart: audio files (field 'audio', one per prompt, in
// order) + questionId. Transcribes each then grades content + pronunciation.
router.post('/attempts/:attemptId/submit-speak', authenticate, audioUpload.array('audio', 12), async (req, res: Response<ApiResponse>, next) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const attempt = await examSvc.loadOwnedAttempt(attemptId, req.userId!);
    if (attempt.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
    if (attempt.exam.kind !== 'PE' || attempt.exam.peType !== 'SPEAK') throw new AppError('Đề này không phải PE nói', 400);
    const questionId = Number(req.body?.questionId);
    const q = attempt.exam.questions.find((x) => x.id === questionId && x.kind === 'SPEAK');
    if (!q) throw new AppError('Không tìm thấy câu hỏi nói', 404);
    const filesArr = (req.files as Express.Multer.File[]) || [];
    if (!filesArr.length) throw new AppError('Chưa có audio để nộp', 400);

    // Course code prefix "JPD" (JPD113 — Elementary Japanese) → Japanese STT/grading;
    // every other course keeps the original English-only behavior.
    const language = attempt.exam.course?.courseCode?.toUpperCase().startsWith('JPD') ? 'ja' : 'en';

    const transcripts: string[] = [];
    for (const f of filesArr) {
      transcripts.push(await transcribeExamAudio(f.buffer, f.originalname || 'answer.webm', f.mimetype || 'audio/webm', language));
    }
    const speakingPrompts = Array.isArray(q.speakingPrompts) ? (q.speakingPrompts as Array<{ text: string }>) : [];
    const grade = await gradeSpeaking({
      userId: req.userId!, points: num(q.points), prompt: q.prompt,
      speakingPrompts: speakingPrompts.length ? speakingPrompts : transcripts.map((_, i) => ({ text: `Question ${i + 1}` })),
      transcripts, rubric: q.rubric, language,
    });
    const data = await finalizePe(attemptId, req.userId!, [{ questionId: q.id, grade }], {
      answers: { transcripts }, timeSpentSeconds: Number(req.body?.timeSpentSeconds) || 0, gradingMode: 'AI',
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
});

// Generate speaking questions from a topic (when the paper has none).
router.post('/questions/:questionId/speaking-questions', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const q = await prisma.examQuestion.findUnique({ where: { id: Number(req.params.questionId) } });
    if (!q) throw new AppError('Không tìm thấy câu hỏi', 404);
    const generated = await generateSpeakingQuestions(req.userId!, q.prompt, Number(req.body?.count) || 4);
    res.json({ success: true, data: generated });
  } catch (e) { next(e); }
});

function emptyGrade(points: number): PeGradeResult {
  return { score: 0, maxScore: points, percent: 0, verdict: 'fail', summary: 'No answer submitted.|||Chưa nộp câu trả lời.', criteria: [], suggestions: [] };
}

// ─────────────────────────────────────────────────────────────────────
// Auth — history cleanup & bookmarks (Sổ tay ôn tập)
// ─────────────────────────────────────────────────────────────────────

// Delete one of my own attempts.
router.delete('/attempts/:attemptId', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.deleteMyAttempt(Number(req.params.attemptId), req.userId!) }); }
  catch (e) { next(e); }
});

// Toggle a whole-exam bookmark ("Đề đã lưu").
router.post('/:examId/bookmark', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.toggleExamBookmark(Number(req.params.examId), req.userId!) }); }
  catch (e) { next(e); }
});

// My saved exams.
router.get('/bookmarks/exams', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.listMyExamBookmarks(req.userId!) }); }
  catch (e) { next(e); }
});

// Toggle a single-question bookmark (optional personal note on create).
router.post('/questions/:questionId/bookmark', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.toggleQuestionBookmark(Number(req.params.questionId), req.userId!, typeof req.body?.note === 'string' ? req.body.note : undefined) }); }
  catch (e) { next(e); }
});

// Update just the personal note on a saved question.
router.put('/questions/:questionId/bookmark-note', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.updateQuestionBookmarkNote(Number(req.params.questionId), req.userId!, String(req.body?.note ?? '')) }); }
  catch (e) { next(e); }
});

// My saved questions (notebook — grouped by semester → subject on the client).
router.get('/bookmarks/questions', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.listMyQuestionBookmarks(req.userId!) }); }
  catch (e) { next(e); }
});

// ─────────────────────────────────────────────────────────────────────
// Admin — CRUD (answer keys)
// ─────────────────────────────────────────────────────────────────────
const admin = [authenticate, requireAdmin('ROLE_ADMIN')];

router.get('/admin/list', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;
    res.json({ success: true, data: await examSvc.adminListExams(courseId) });
  } catch (e) { next(e); }
});

router.get('/admin/:examId', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminGetExam(Number(req.params.examId)) }); }
  catch (e) { next(e); }
});

router.post('/admin', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminCreateExam(req.body) }); }
  catch (e) { next(e); }
});

router.put('/admin/:examId', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminUpdateExam(Number(req.params.examId), req.body) }); }
  catch (e) { next(e); }
});

router.delete('/admin/:examId', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminDeleteExam(Number(req.params.examId)) }); }
  catch (e) { next(e); }
});

router.post('/admin/:examId/questions', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminUpsertQuestion(Number(req.params.examId), null, req.body) }); }
  catch (e) { next(e); }
});

router.put('/admin/:examId/questions/:questionId', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminUpsertQuestion(Number(req.params.examId), Number(req.params.questionId), req.body) }); }
  catch (e) { next(e); }
});

router.delete('/admin/:examId/questions/:questionId', ...admin, async (req, res: Response<ApiResponse>, next) => {
  try { res.json({ success: true, data: await examSvc.adminDeleteQuestion(Number(req.params.examId), Number(req.params.questionId)) }); }
  catch (e) { next(e); }
});

export default router;
