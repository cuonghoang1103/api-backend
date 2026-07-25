/**
 * Exam Room (Phòng thi) — core service.
 *
 * Covers the FE (multiple-choice, auto-graded) lifecycle end-to-end plus the
 * shared attempt plumbing that PE grading (exam.grading.service.ts) builds on:
 *   list exams for a course · start/resume an attempt · submit & auto-grade FE ·
 *   fetch an attempt for review · attempt history · admin CRUD of exams+questions.
 *
 * Bilingual content ("EN|||VI") is stored verbatim and rendered on the client
 * (pickLang) — the backend never splits it. Answer keys (correctIndexes,
 * explanation, sampleSolution, rubric) are STRIPPED from the taking payload and
 * only returned once an attempt is submitted.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// ── Shapes ────────────────────────────────────────────────────────────
export type ExamKind = 'FE' | 'PE';
export type PeType = 'CODE' | 'WRITE' | 'SPEAK';
export type QuestionKind = 'MCQ' | 'CODE' | 'WRITE' | 'SPEAK';

const num = (v: unknown): number => (v == null ? 0 : Number(v));

/** Public exam header (no questions). */
function examHeader(e: {
  id: number; courseId: number; kind: string; peType: string | null;
  title: string; description: string | null; code: string | null;
  durationMinutes: number; totalPoints: unknown; passMark: unknown;
  source: string; instructions: string | null;
  attachmentUrl?: string | null; attachmentName?: string | null;
  isPublished: boolean; sortOrder: number;
  _count?: { questions: number };
}) {
  return {
    id: e.id, courseId: e.courseId, kind: e.kind as ExamKind,
    peType: (e.peType || null) as PeType | null,
    title: e.title, description: e.description, code: e.code,
    durationMinutes: e.durationMinutes,
    totalPoints: num(e.totalPoints), passMark: num(e.passMark),
    source: e.source, instructions: e.instructions,
    attachmentUrl: e.attachmentUrl ?? null, attachmentName: e.attachmentName ?? null,
    isPublished: e.isPublished, sortOrder: e.sortOrder,
    questionCount: e._count?.questions ?? undefined,
  };
}

/** Strip answer keys — this is what a candidate is allowed to see mid-exam. */
function questionForTaking(q: {
  id: number; kind: string; sortOrder: number; points: unknown; prompt: string;
  imageUrl: string | null; options: unknown; correctIndexes: number[]; language: string | null;
  starterCode: string | null; expectedOutput: string | null; speakingPrompts: unknown;
}) {
  const options = Array.isArray(q.options)
    ? (q.options as Array<{ text?: string }>).map((o) => ({ text: String(o?.text ?? '') }))
    : null;
  // Expose only HOW MANY options are correct (the prompt already says "choose
  // two…"), never WHICH ones — so the UI can render checkboxes vs radios.
  const selectCount = Array.isArray(q.correctIndexes) ? q.correctIndexes.length : 1;
  return {
    id: q.id, kind: q.kind as QuestionKind, sortOrder: q.sortOrder,
    points: num(q.points), prompt: q.prompt, imageUrl: q.imageUrl,
    options, selectCount: Math.max(1, selectCount), multiSelect: selectCount > 1,
    language: q.language, starterCode: q.starterCode,
    expectedOutput: q.expectedOutput,
    speakingPrompts: Array.isArray(q.speakingPrompts) ? q.speakingPrompts : null,
  };
}

// ── Course resolution ─────────────────────────────────────────────────
async function resolveCourseId(courseIdOrSlug: string | number): Promise<number> {
  if (typeof courseIdOrSlug === 'number' || /^\d+$/.test(String(courseIdOrSlug))) {
    return Number(courseIdOrSlug);
  }
  const course = await prisma.course.findUnique({
    where: { slug: String(courseIdOrSlug) },
    select: { id: true },
  });
  if (!course) throw new AppError('Không tìm thấy khoá học', 404);
  return course.id;
}

// ── Public: list exams for a course (+ the caller's attempt summary) ───
export async function listExamsForCourse(courseIdOrSlug: string | number, userId?: number) {
  const courseId = await resolveCourseId(courseIdOrSlug);
  const exams = await prisma.exam.findMany({
    where: { courseId, isPublished: true },
    include: { _count: { select: { questions: true } } },
    orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { id: 'asc' }],
  });

  let attemptsByExam: Record<number, { attempts: number; bestScore: number | null; lastScore: number | null; passed: boolean; lastAttemptId: number | null; inProgressId: number | null }> = {};
  if (userId && exams.length) {
    const rows = await prisma.examAttempt.findMany({
      where: { userId, examId: { in: exams.map((e) => e.id) } },
      orderBy: { id: 'desc' },
      select: { id: true, examId: true, status: true, score: true, passed: true },
    });
    for (const e of exams) {
      const mine = rows.filter((r) => r.examId === e.id);
      const graded = mine.filter((r) => r.status === 'SUBMITTED' || r.status === 'GRADED');
      const scores = graded.map((r) => num(r.score));
      const inProg = mine.find((r) => r.status === 'IN_PROGRESS');
      attemptsByExam[e.id] = {
        attempts: graded.length,
        bestScore: scores.length ? Math.max(...scores) : null,
        lastScore: graded.length ? num(graded[0].score) : null,
        passed: graded.some((r) => r.passed === true),
        lastAttemptId: graded.length ? graded[0].id : null,
        inProgressId: inProg?.id ?? null,
      };
    }
  }

  return exams.map((e) => ({ ...examHeader(e), my: attemptsByExam[e.id] ?? null }));
}

// ── Public: one exam ready to take (questions with keys stripped) ──────
export async function getExamForTaking(examId: number) {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
  });
  if (!exam || !exam.isPublished) throw new AppError('Không tìm thấy đề thi', 404);
  return {
    ...examHeader(exam),
    questions: exam.questions.map(questionForTaking),
  };
}

// ── Attempts ──────────────────────────────────────────────────────────
export async function startAttempt(examId: number, userId: number) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam || !exam.isPublished) throw new AppError('Không tìm thấy đề thi', 404);

  // Resume an unexpired in-progress attempt instead of spawning duplicates.
  const existing = await prisma.examAttempt.findFirst({
    where: { userId, examId, status: 'IN_PROGRESS' },
    orderBy: { id: 'desc' },
  });
  const now = Date.now();
  if (existing && (!existing.expiresAt || existing.expiresAt.getTime() > now)) {
    return { attemptId: existing.id, startedAt: existing.startedAt, expiresAt: existing.expiresAt, resumed: true };
  }
  // An expired in-progress attempt is auto-submitted (empty) before a new one.
  if (existing) {
    await prisma.examAttempt.update({
      where: { id: existing.id },
      data: { status: 'EXPIRED', submittedAt: new Date() },
    });
  }

  const expiresAt = new Date(now + exam.durationMinutes * 60_000);
  const created = await prisma.examAttempt.create({
    data: {
      userId, examId, status: 'IN_PROGRESS',
      startedAt: new Date(now), expiresAt,
      answers: {},
      gradingMode: exam.kind === 'FE' ? 'AUTO' : 'AI',
    },
  });
  return { attemptId: created.id, startedAt: created.startedAt, expiresAt: created.expiresAt, resumed: false };
}

/** Load an attempt owned by the user (throws on mismatch). */
export async function loadOwnedAttempt(attemptId: number, userId: number) {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: { exam: { include: { questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } } } },
  });
  if (!attempt || attempt.userId !== userId) throw new AppError('Không tìm thấy bài thi', 404);
  return attempt;
}

// ── FE auto-grading ───────────────────────────────────────────────────
function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

/**
 * Submit a Final Exam. `answers` maps questionId -> selected option indexes.
 * All-or-nothing per question (standard FPTU multiple-choice scoring).
 */
export async function submitFinalExam(
  attemptId: number,
  userId: number,
  answers: Record<string, number[]>,
  timeSpentSeconds?: number,
  integritySignals?: unknown,
) {
  const attempt = await loadOwnedAttempt(attemptId, userId);
  if (attempt.status !== 'IN_PROGRESS') throw new AppError('Bài thi đã nộp rồi', 409);
  if (attempt.exam.kind !== 'FE') throw new AppError('Đề này không phải trắc nghiệm', 400);

  const questions = attempt.exam.questions;
  const maxRaw = questions.reduce((s, q) => s + num(q.points), 0) || 1;
  let raw = 0;
  const perQuestion: Array<{ questionId: number; correct: boolean; selected: number[]; points: number }> = [];

  for (const q of questions) {
    const selected = Array.isArray(answers[String(q.id)]) ? answers[String(q.id)].map(Number) : [];
    const key = Array.isArray(q.correctIndexes) ? q.correctIndexes : [];
    const correct = key.length > 0 && sameSet(selected, key);
    if (correct) raw += num(q.points);
    perQuestion.push({ questionId: q.id, correct, selected, points: num(q.points) });
  }

  const totalPoints = num(attempt.exam.totalPoints) || 10;
  const score = Math.round((raw / maxRaw) * totalPoints * 100) / 100;
  const passed = score >= num(attempt.exam.passMark);

  const updated = await prisma.examAttempt.update({
    where: { id: attemptId },
    data: {
      status: 'GRADED',
      submittedAt: new Date(),
      timeSpentSeconds: Math.max(0, Math.floor(timeSpentSeconds ?? 0)),
      score, maxScore: totalPoints, passed,
      answers: answers as object,
      feedback: { perQuestion, correctCount: perQuestion.filter((p) => p.correct).length, total: questions.length } as object,
      integritySignals: (integritySignals ?? undefined) as object | undefined,
    },
  });
  return buildReview(updated.id, userId);
}

// ── Review (post-submit): answers + keys + explanations ───────────────
export async function buildReview(attemptId: number, userId: number) {
  const attempt = await loadOwnedAttempt(attemptId, userId);
  const answers = (attempt.answers ?? {}) as Record<string, unknown>;
  const feedback = (attempt.feedback ?? {}) as Record<string, unknown>;

  const questions = attempt.exam.questions.map((q) => ({
    id: q.id, kind: q.kind as QuestionKind, sortOrder: q.sortOrder,
    points: num(q.points), prompt: q.prompt, imageUrl: q.imageUrl,
    options: Array.isArray(q.options) ? q.options : null,
    correctIndexes: Array.isArray(q.correctIndexes) ? q.correctIndexes : [],
    explanation: q.explanation,
    language: q.language, starterCode: q.starterCode,
    sampleSolution: q.sampleSolution, expectedOutput: q.expectedOutput,
    rubric: q.rubric ?? null,
    speakingPrompts: Array.isArray(q.speakingPrompts) ? q.speakingPrompts : null,
    // the candidate's own answer for this question
    myAnswer: answers[String(q.id)] ?? null,
  }));

  return {
    attempt: {
      id: attempt.id, examId: attempt.examId, status: attempt.status,
      startedAt: attempt.startedAt, submittedAt: attempt.submittedAt,
      timeSpentSeconds: attempt.timeSpentSeconds,
      score: attempt.score == null ? null : num(attempt.score),
      maxScore: attempt.maxScore == null ? null : num(attempt.maxScore),
      passed: attempt.passed, gradingMode: attempt.gradingMode,
      feedback,
    },
    exam: examHeader(attempt.exam),
    questions,
  };
}

// ── Attempt history ───────────────────────────────────────────────────
export async function listMyAttempts(userId: number, examId?: number) {
  const rows = await prisma.examAttempt.findMany({
    where: { userId, ...(examId ? { examId } : {}), status: { in: ['SUBMITTED', 'GRADED', 'EXPIRED'] } },
    orderBy: { id: 'desc' },
    include: { exam: { select: { id: true, title: true, kind: true, peType: true, code: true, courseId: true, passMark: true, totalPoints: true } } },
    take: 200,
  });
  return rows.map((r) => ({
    id: r.id, examId: r.examId, status: r.status,
    submittedAt: r.submittedAt, timeSpentSeconds: r.timeSpentSeconds,
    score: r.score == null ? null : num(r.score),
    maxScore: r.maxScore == null ? null : num(r.maxScore),
    passed: r.passed, gradingMode: r.gradingMode,
    exam: {
      id: r.exam.id, title: r.exam.title, kind: r.exam.kind, peType: r.exam.peType,
      code: r.exam.code, courseId: r.exam.courseId,
      passMark: num(r.exam.passMark), totalPoints: num(r.exam.totalPoints),
    },
  }));
}

// ─────────────────────────────────────────────────────────────────────
// Admin CRUD
// ─────────────────────────────────────────────────────────────────────
export async function adminListExams(courseId?: number) {
  const exams = await prisma.exam.findMany({
    where: courseId ? { courseId } : {},
    include: { _count: { select: { questions: true, attempts: true } }, course: { select: { id: true, title: true, courseCode: true, slug: true } } },
    orderBy: [{ courseId: 'asc' }, { kind: 'asc' }, { sortOrder: 'asc' }],
  });
  return exams.map((e) => ({
    ...examHeader(e),
    attemptCount: e._count.attempts,
    course: e.course,
  }));
}

export async function adminGetExam(examId: number) {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: { orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] } },
  });
  if (!exam) throw new AppError('Không tìm thấy đề thi', 404);
  return exam;
}

type ExamInput = Partial<{
  courseId: number; kind: string; peType: string | null; title: string;
  description: string | null; code: string | null; durationMinutes: number;
  totalPoints: number; passMark: number; shuffleQuestions: boolean;
  shuffleOptions: boolean; source: string; instructions: string | null;
  attachmentUrl: string | null; attachmentName: string | null;
  isPublished: boolean; sortOrder: number;
}>;

export async function adminCreateExam(input: ExamInput) {
  if (!input.courseId) throw new AppError('courseId là bắt buộc', 400);
  if (!input.title) throw new AppError('title là bắt buộc', 400);
  return prisma.exam.create({
    data: {
      courseId: input.courseId,
      kind: input.kind ?? 'FE',
      peType: input.peType ?? null,
      title: input.title,
      description: input.description ?? null,
      code: input.code ?? null,
      durationMinutes: input.durationMinutes ?? 60,
      totalPoints: input.totalPoints ?? 10,
      passMark: input.passMark ?? 4,
      shuffleQuestions: input.shuffleQuestions ?? false,
      shuffleOptions: input.shuffleOptions ?? false,
      source: input.source ?? 'SAMPLE',
      instructions: input.instructions ?? null,
      attachmentUrl: input.attachmentUrl ?? null,
      attachmentName: input.attachmentName ?? null,
      isPublished: input.isPublished ?? false,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function adminUpdateExam(examId: number, input: ExamInput) {
  await adminGetExam(examId);
  return prisma.exam.update({ where: { id: examId }, data: { ...input } as object });
}

export async function adminDeleteExam(examId: number) {
  await adminGetExam(examId);
  await prisma.exam.delete({ where: { id: examId } }); // cascades questions + attempts
  return { deleted: true };
}

type QuestionInput = Partial<{
  kind: string; sortOrder: number; points: number; prompt: string;
  imageUrl: string | null; options: unknown; correctIndexes: number[];
  explanation: string | null; language: string | null; starterCode: string | null;
  sampleSolution: string | null; expectedOutput: string | null; rubric: unknown;
  speakingPrompts: unknown;
}>;

export async function adminUpsertQuestion(examId: number, questionId: number | null, input: QuestionInput) {
  await adminGetExam(examId);
  const data = {
    kind: input.kind ?? 'MCQ',
    sortOrder: input.sortOrder ?? 0,
    points: input.points ?? 1,
    prompt: input.prompt ?? '',
    imageUrl: input.imageUrl ?? null,
    options: (input.options ?? undefined) as object | undefined,
    correctIndexes: Array.isArray(input.correctIndexes) ? input.correctIndexes : [],
    explanation: input.explanation ?? null,
    language: input.language ?? null,
    starterCode: input.starterCode ?? null,
    sampleSolution: input.sampleSolution ?? null,
    expectedOutput: input.expectedOutput ?? null,
    rubric: (input.rubric ?? undefined) as object | undefined,
    speakingPrompts: (input.speakingPrompts ?? undefined) as object | undefined,
  };
  if (questionId) {
    const existing = await prisma.examQuestion.findFirst({ where: { id: questionId, examId } });
    if (!existing) throw new AppError('Không tìm thấy câu hỏi', 404);
    return prisma.examQuestion.update({ where: { id: questionId }, data });
  }
  return prisma.examQuestion.create({ data: { examId, ...data } });
}

export async function adminDeleteQuestion(examId: number, questionId: number) {
  const existing = await prisma.examQuestion.findFirst({ where: { id: questionId, examId } });
  if (!existing) throw new AppError('Không tìm thấy câu hỏi', 404);
  await prisma.examQuestion.delete({ where: { id: questionId } });
  return { deleted: true };
}
