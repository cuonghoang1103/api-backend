/**
 * Interview session orchestrator — STATIC mode (self-assessment, ZERO LLM).
 *
 * Flow per turn:
 *   1. Serve the question body (no reference / no rubric leaked).
 *   2. submitAnswer → store answer, run deterministic Pass A coverage, then
 *      REVEAL the reference answer + rubric so the user can self-assess.
 *   3. selfAssess → user rates each rubric criterion; store self vs objective
 *      scores + their divergence.
 *   4. finish → template report.
 *
 * Every read/write is scoped by userId (IDOR guard). No LLM is called; this is
 * the foundation the AI phases amplify, per the "AI-optional mode" requirement.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import type { InterviewLanguage, InterviewLevel } from '@prisma/client';
import { planQuestions, LEVEL_LADDER } from './questionBank.service.js';
import { requireTrack } from './taxonomy.service.js';
import { deterministicScore, selfAssessmentScore, type RubricCriterion, type SynonymMap } from './scoring.js';
import { generateStaticReport } from './report.service.js';

const MAX_QUESTIONS = 15;
const DEFAULT_QUESTIONS = 6;

function redFlagPenalty(): number {
  const v = Number(process.env.SCORE_REDFLAG_PENALTY);
  return Number.isFinite(v) && v > 0 ? v : 15;
}

async function loadOwnedSession(userId: number, sessionId: number) {
  const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new NotFoundError('Phiên phỏng vấn không tồn tại');
  if (session.userId !== userId) throw new ForbiddenError('Bạn không có quyền truy cập phiên này');
  return session;
}

/** Public shape of a turn — hides reference/rubric until the turn is answered. */
function publicTurn(turn: {
  order: number;
  questionText: string;
  userAnswer: string | null;
  question: { type: string; mcqOptions: unknown; referenceAnswer: string | null; rubric: unknown } | null;
}) {
  const answered = !!(turn.userAnswer && turn.userAnswer.trim());
  const isMcq = turn.question?.type === 'MCQ';
  // MCQ options are shown up-front but WITHOUT the `correct` flags.
  const mcqOptions = isMcq && Array.isArray(turn.question?.mcqOptions)
    ? (turn.question!.mcqOptions as Array<{ id: string; text: string }>).map((o) => ({ id: o.id, text: o.text }))
    : undefined;
  return {
    order: turn.order,
    questionText: turn.questionText,
    type: turn.question?.type ?? 'CONCEPTUAL',
    mcqOptions,
    answered,
    userAnswer: turn.userAnswer,
    // Reference + rubric only after answering.
    referenceAnswer: answered ? turn.question?.referenceAnswer ?? null : null,
    rubric: answered ? (turn.question?.rubric ?? []) : null,
  };
}

// ─── Create ──────────────────────────────────────────────────────
export async function createSession(
  userId: number,
  body: {
    trackId?: unknown;
    level?: unknown;
    companyProfileId?: unknown;
    language?: unknown;
    numQuestions?: unknown;
    focusedMode?: unknown;
  },
) {
  const trackId = Number(body.trackId);
  if (!Number.isInteger(trackId) || trackId <= 0) throw new BadRequestError('trackId không hợp lệ');
  const level = String(body.level ?? '').toUpperCase() as InterviewLevel;
  if (!LEVEL_LADDER.includes(level)) throw new BadRequestError('level không hợp lệ');
  const language = (String(body.language ?? 'VI').toUpperCase() === 'EN' ? 'EN' : 'VI') as InterviewLanguage;
  const numQuestions = Math.min(MAX_QUESTIONS, Math.max(1, Number(body.numQuestions) || DEFAULT_QUESTIONS));

  const track = await requireTrack(trackId);

  let companyProfileId: number | null = null;
  if (body.companyProfileId != null && body.companyProfileId !== '') {
    const cpId = Number(body.companyProfileId);
    const cp = await prisma.interviewCompanyProfile.findUnique({ where: { id: cpId } });
    if (cp) companyProfileId = cp.id;
  }

  const questions = await planQuestions(trackId, level, numQuestions);
  if (!questions.length) {
    throw new BadRequestError('Chưa có câu hỏi cho track/level này. Hãy chọn cấp độ khác hoặc báo admin bổ sung ngân hàng câu hỏi.');
  }

  const session = await prisma.interviewSession.create({
    data: {
      userId,
      trackId,
      companyProfileId,
      level,
      mode: 'TEXT',
      engineMode: 'STATIC',
      language,
      status: 'IN_PROGRESS',
      focusedMode: Boolean(body.focusedMode),
      config: { numQuestions: questions.length, requested: numQuestions } as never,
      startedAt: new Date(),
      turns: {
        create: questions.map((q, i) => ({
          questionId: q.id,
          order: i,
          questionText: language === 'EN' ? q.bodyEn || q.body : q.bodyVi || q.body,
        })),
      },
    },
    include: { turns: { orderBy: { order: 'asc' }, include: { question: true } }, track: true },
  });

  return {
    id: session.id,
    trackName: track.name,
    level: session.level,
    language: session.language,
    engineMode: session.engineMode,
    total: session.turns.length,
    turns: session.turns.map(publicTurn),
  };
}

// ─── Read ────────────────────────────────────────────────────────
export async function getSessionState(userId: number, sessionId: number) {
  await loadOwnedSession(userId, sessionId);
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      track: true,
      companyProfile: true,
      turns: { orderBy: { order: 'asc' }, include: { question: true } },
      report: { select: { id: true } },
    },
  });
  if (!session) throw new NotFoundError('Phiên phỏng vấn không tồn tại');
  return {
    id: session.id,
    status: session.status,
    trackName: session.track.name,
    level: session.level,
    language: session.language,
    engineMode: session.engineMode,
    focusedMode: session.focusedMode,
    companyStyle: session.companyProfile?.name ?? null,
    total: session.turns.length,
    hasReport: !!session.report,
    turns: session.turns.map(publicTurn),
  };
}

// ─── Answer (Pass A + reveal) ────────────────────────────────────
export async function submitAnswer(
  userId: number,
  sessionId: number,
  order: number,
  body: { answer?: unknown; timeSpentMs?: unknown; integritySignals?: unknown; selectedOptionId?: unknown },
) {
  await loadOwnedSession(userId, sessionId);
  const turn = await prisma.interviewTurn.findUnique({
    where: { uk_interview_turn_order: { sessionId, order } },
    include: { question: true },
  });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  const q = turn.question;

  const isMcq = q?.type === 'MCQ';
  const rawAnswer = isMcq ? String(body.selectedOptionId ?? '') : String(body.answer ?? '');
  if (!rawAnswer.trim()) throw new BadRequestError('Câu trả lời trống');

  const timeSpentMs = Number(body.timeSpentMs) || null;
  const integritySignals = (body.integritySignals && typeof body.integritySignals === 'object') ? body.integritySignals : undefined;

  if (isMcq) {
    // Objective: 100 if the chosen option is flagged correct, else 0.
    const opts = Array.isArray(q?.mcqOptions) ? (q!.mcqOptions as Array<{ id: string; text: string; correct?: boolean }>) : [];
    const chosen = opts.find((o) => o.id === rawAnswer);
    const correct = !!chosen?.correct;
    const det = { score: correct ? 100 : 0, grade: correct ? 'A' : 'F', mustHit: [], mustMiss: [], shouldHit: [], shouldMiss: [], redFlagsHit: [], injectionAttempted: false };
    await prisma.interviewTurn.update({
      where: { id: turn.id },
      data: {
        userAnswer: rawAnswer,
        timeSpentMs,
        integritySignals: integritySignals as never,
        deterministicScore: det as never,
        turnScore: { deterministic: det.score, self: det.score, divergence: 0, grade: det.grade } as never,
        selfScore: { score: det.score, grade: det.grade } as never,
      },
    });
    return {
      order,
      type: 'MCQ',
      correct,
      correctOptionId: opts.find((o) => o.correct)?.id ?? null,
      referenceAnswer: q?.referenceAnswer ?? null,
      score: det.score,
      autoAdvance: true,
    };
  }

  const det = deterministicScore(
    rawAnswer,
    {
      mustMention: q?.mustMention ?? [],
      shouldMention: q?.shouldMention ?? [],
      redFlags: q?.redFlags ?? [],
      synonyms: (q?.synonyms as unknown as SynonymMap) ?? {},
    },
    { redFlagPenalty: redFlagPenalty() },
  );

  await prisma.interviewTurn.update({
    where: { id: turn.id },
    data: {
      userAnswer: rawAnswer,
      timeSpentMs,
      integritySignals: integritySignals as never,
      deterministicScore: det as never,
      injectionAttempted: det.injectionAttempted,
      needsReview: det.injectionAttempted,
    },
  });

  return {
    order,
    type: q?.type ?? 'CONCEPTUAL',
    referenceAnswer: q?.referenceAnswer ?? null,
    rubric: (q?.rubric as unknown as RubricCriterion[]) ?? [],
    deterministic: det,
    injectionAttempted: det.injectionAttempted,
    autoAdvance: false,
  };
}

// ─── Self-assessment ─────────────────────────────────────────────
export async function selfAssess(
  userId: number,
  sessionId: number,
  order: number,
  body: { ratings?: unknown },
) {
  await loadOwnedSession(userId, sessionId);
  const turn = await prisma.interviewTurn.findUnique({
    where: { uk_interview_turn_order: { sessionId, order } },
    include: { question: true },
  });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  if (!turn.userAnswer) throw new BadRequestError('Cần trả lời trước khi tự chấm');

  const ratings = (body.ratings && typeof body.ratings === 'object' ? body.ratings : {}) as Record<string, number>;
  const rubric = (turn.question?.rubric as unknown as RubricCriterion[]) ?? [];
  const self = selfAssessmentScore(ratings, rubric);
  const det = (turn.deterministicScore as { score?: number } | null)?.score ?? null;

  await prisma.interviewTurn.update({
    where: { id: turn.id },
    data: {
      selfScore: { ratings, score: self.score, grade: self.grade } as never,
      turnScore: {
        deterministic: det,
        self: self.score,
        divergence: det != null ? self.score - det : null,
        grade: self.grade,
      } as never,
    },
  });

  const total = await prisma.interviewTurn.count({ where: { sessionId } });
  return { order, self, deterministic: det, next: order + 1 < total ? order + 1 : null };
}

// ─── Finish → report ─────────────────────────────────────────────
export async function finishSession(userId: number, sessionId: number) {
  const session = await loadOwnedSession(userId, sessionId);
  const report = await generateStaticReport(sessionId);
  if (session.status !== 'COMPLETED') {
    await prisma.interviewSession.update({ where: { id: sessionId }, data: { status: 'COMPLETED', endedAt: new Date() } });
  }
  return report;
}

export async function getReport(userId: number, sessionId: number) {
  await loadOwnedSession(userId, sessionId);
  const report = await prisma.interviewReport.findUnique({ where: { sessionId } });
  if (!report) throw new NotFoundError('Chưa có báo cáo cho phiên này');
  // Per-turn explainability for the drill-down.
  const turns = await prisma.interviewTurn.findMany({
    where: { sessionId },
    orderBy: { order: 'asc' },
    include: { question: { include: { topic: { select: { name: true } } } } },
  });
  return {
    report,
    turns: turns.map((t) => ({
      order: t.order,
      topic: t.question?.topic?.name ?? null,
      questionText: t.questionText,
      userAnswer: t.userAnswer,
      referenceAnswer: t.question?.referenceAnswer ?? null,
      rubric: t.question?.rubric ?? [],
      deterministicScore: t.deterministicScore,
      selfScore: t.selfScore,
      turnScore: t.turnScore,
      needsReview: t.needsReview,
      injectionAttempted: t.injectionAttempted,
    })),
  };
}

export async function listHistory(userId: number) {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { track: { select: { name: true } }, report: { select: { overallScore: true, letterGrade: true } } },
  });
  return sessions.map((s) => ({
    id: s.id,
    track: s.track.name,
    level: s.level,
    status: s.status,
    engineMode: s.engineMode,
    createdAt: s.createdAt,
    overallScore: s.report?.overallScore ?? null,
    letterGrade: s.report?.letterGrade ?? null,
  }));
}
