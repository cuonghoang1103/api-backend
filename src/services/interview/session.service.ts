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
import { planQuestionsMulti, LEVEL_LADDER } from './questionBank.service.js';
import { requireTrack } from './taxonomy.service.js';
import { deterministicScore, selfAssessmentScore, type RubricCriterion, type SynonymMap } from './scoring.js';
import { generateStaticReport } from './report.service.js';
import { createReviewCardsForSession } from './drill.service.js';
import { isAiAvailable, checkTokenQuota } from './llm/index.js';
import { evaluateAnswerWithAI, type AiEvaluationResult } from './aiEvaluator.js';
import { generatePersonalizedQuestions, generateProjectQuestions, type PersonalizedQuestion } from './personalize.service.js';
import { isProEffective } from '../pro.service.js';
import { sttProvider } from './voice/stt.js';
import { retrieveChunks } from './knowledge/retrieval.js';
import { synthesizeAiReport, type TurnSummary } from './aiReport.js';
import type { InterviewEngineMode } from '@prisma/client';

const MAX_QUESTIONS = 15;
const DEFAULT_QUESTIONS = 6;

function redFlagPenalty(): number {
  const v = Number(process.env.SCORE_REDFLAG_PENALTY);
  return Number.isFinite(v) && v > 0 ? v : 15;
}
function disagreementThreshold(): number {
  const v = Number(process.env.SCORE_DISAGREEMENT_THRESHOLD);
  return Number.isFinite(v) && v > 0 ? v : 35;
}
/** Requested engine mode collapses to STATIC whenever AI isn't currently usable
 *  OR the user isn't allowed AI grading (Pro/admin only). */
function resolveEngineMode(requested: string | undefined, allowAi: boolean): InterviewEngineMode {
  const r = String(requested ?? process.env.DEFAULT_ENGINE_MODE ?? 'STATIC').toUpperCase();
  const wantsAi = r === 'HYBRID' || r === 'FULL_AI';
  if (wantsAi && isAiAvailable() && allowAi) return r as InterviewEngineMode;
  return 'STATIC';
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
    engineMode?: unknown;
    cv?: unknown;
    jd?: unknown;
    trackIds?: unknown;
    topicIds?: unknown;
    projectMd?: unknown;
  },
) {
  // Multi-select: `trackIds` combines several positions; fall back to single trackId.
  const trackIds = Array.isArray(body.trackIds)
    ? [...new Set((body.trackIds as unknown[]).map(Number).filter((n) => Number.isInteger(n) && n > 0))]
    : [];
  // Phase F: optional topic deep-dive — narrow to specific topics (e.g. just OOP).
  const topicIds = Array.isArray(body.topicIds)
    ? [...new Set((body.topicIds as unknown[]).map(Number).filter((n) => Number.isInteger(n) && n > 0))]
    : [];
  const trackId = trackIds.length ? trackIds[0] : Number(body.trackId);
  if (!Number.isInteger(trackId) || trackId <= 0) throw new BadRequestError('trackId không hợp lệ');
  const allTrackIds = trackIds.length ? trackIds : [trackId];
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

  // AI grading (HYBRID/FULL_AI) is a Pro perk — non-Pro users are forced to
  // STATIC self-assessment regardless of what they requested.
  const allowAi = await isProEffective(userId);

  // Phase 3: personalize from a pasted CV and/or Job Description. When present,
  // questions are AI-generated ad-hoc (questionId=null) and their grading specs
  // (rubric/reference/keywords) live in config.personalized — `answer()` reads
  // them as a fallback. Requires Pro + AI.
  const cv = typeof body.cv === 'string' ? body.cv.trim() : '';
  const jd = typeof body.jd === 'string' ? body.jd.trim() : '';
  const projectMd = typeof body.projectMd === 'string' ? body.projectMd.trim() : '';
  const wantsProject = !!projectMd;
  const wantsPersonalized = !wantsProject && !!(cv || jd);

  if (wantsProject || wantsPersonalized) {
    // CV/JD & project modes generate with Opus, which can take minutes on a long
    // doc → doing it inside this request races the nginx 300s cap. Instead create
    // the session shell NOW and generate questions in the BACKGROUND; the room
    // polls getSessionState until the turns are ready (or a genError is set).
    const kind: 'project' | 'personalized' = wantsProject ? 'project' : 'personalized';
    if (!allowAi) throw new BadRequestError(`${wantsProject ? 'Phỏng vấn theo project' : 'Cá nhân hoá theo CV/JD'} dành cho tài khoản Pro/Max.`);
    if (!isAiAvailable()) throw new BadRequestError('AI hiện không khả dụng — thử lại sau.');
    const shell = await prisma.interviewSession.create({
      data: {
        userId, trackId, companyProfileId, level, mode: 'TEXT',
        engineMode: resolveEngineMode('FULL_AI', allowAi),
        language, status: 'IN_PROGRESS', focusedMode: Boolean(body.focusedMode),
        config: { generating: true, kind, requested: numQuestions } as never,
        startedAt: new Date(),
      },
      include: { track: true },
    });
    // Fire-and-forget — never await (that's the whole point).
    void populateAiSession(shell.id, { userId, kind, cv, jd, projectMd, trackName: track.name, level, language, numQuestions })
      .catch(() => { void markGenError(shell.id); });
    return {
      id: shell.id,
      trackName: track.name,
      level: shell.level,
      language: shell.language,
      engineMode: shell.engineMode,
      total: 0,
      generating: true,
      turns: [] as ReturnType<typeof publicTurn>[],
    };
  }

  // Bank questions — synchronous (fast).
  const questions = await planQuestionsMulti(allTrackIds, level, numQuestions, topicIds.length ? topicIds : undefined);
  if (!questions.length) {
    throw new BadRequestError('Chưa có câu hỏi cho lựa chọn này. Chọn track/topic đã có câu hỏi, đổi cấp độ, hoặc để admin sinh câu hỏi (AI).');
  }
  const session = await prisma.interviewSession.create({
    data: {
      userId,
      trackId,
      companyProfileId,
      level,
      mode: 'TEXT',
      engineMode: resolveEngineMode(typeof body.engineMode === 'string' ? body.engineMode : undefined, allowAi),
      language,
      status: 'IN_PROGRESS',
      focusedMode: Boolean(body.focusedMode),
      config: { numQuestions: questions.length, requested: numQuestions, trackIds: allTrackIds, topicIds: topicIds.length ? topicIds : undefined } as never,
      startedAt: new Date(),
      turns: { create: questions.map((q, i) => ({ questionId: q.id, order: i, questionText: language === 'EN' ? q.bodyEn || q.body : q.bodyVi || q.body })) },
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
    turns: session.turns.map((tn) => publicTurn(tn)),
  };
}

/** Background: generate AI questions for a shell session, then create its turns. */
async function populateAiSession(sessionId: number, opts: {
  userId: number; kind: 'project' | 'personalized'; cv: string; jd: string; projectMd: string;
  trackName: string; level: InterviewLevel; language: InterviewLanguage; numQuestions: number;
}): Promise<void> {
  let pq: PersonalizedQuestion[];
  if (opts.kind === 'project') {
    const round2 = Math.max(2, Math.round(opts.numQuestions * 0.5));
    const round1 = Math.max(2, opts.numQuestions - round2);
    pq = await generateProjectQuestions({ userId: opts.userId, md: opts.projectMd, level: opts.level, language: opts.language as 'VI' | 'EN', round1Count: round1, round2Count: round2 });
  } else {
    pq = await generatePersonalizedQuestions({ userId: opts.userId, cv: opts.cv, jd: opts.jd, trackName: opts.trackName, level: opts.level, count: opts.numQuestions, language: opts.language as 'VI' | 'EN' });
  }
  await prisma.$transaction([
    prisma.interviewTurn.createMany({ data: pq.map((q, i) => ({ sessionId, order: i, questionText: q.questionText })) }),
    prisma.interviewSession.update({
      where: { id: sessionId },
      data: { config: { generating: false, kind: opts.kind, requested: opts.numQuestions, numQuestions: pq.length, personalized: pq, projectInterview: opts.kind === 'project' } as never },
    }),
  ]);
}

async function markGenError(sessionId: number): Promise<void> {
  await prisma.interviewSession.update({ where: { id: sessionId }, data: { config: { generating: false, genError: true } as never } }).catch(() => {});
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
    // Voice: which STT the client should use for spoken answers (browser|groq).
    sttProvider: sttProvider(),
    // So the room can hide AI-only features (follow-up) when AI is down/maintenance.
    aiAvailable: isAiAvailable(),
    // Async project/CV generation state (Phase 8/3): the room polls while generating.
    generating: !!(session.config as { generating?: boolean } | null)?.generating,
    genError: !!(session.config as { genError?: boolean } | null)?.genError,
    turns: session.turns.map((tn) => {
      const pt = publicTurn(tn);
      // Ad-hoc personalized/project turns carry type + round in config (no bank question).
      const spec = tn.question ? undefined : personalizedSpecs(session.config)[tn.order];
      if (spec?.type) pt.type = spec.type;
      return { ...pt, round: spec?.round };
    }),
  };
}

/** Read the personalized question specs stored on a session's config JSON. */
function personalizedSpecs(config: unknown): Array<PersonalizedQuestion> {
  const list = (config as { personalized?: unknown })?.personalized;
  return Array.isArray(list) ? (list as PersonalizedQuestion[]) : [];
}

// ─── Answer (Pass A + reveal) ────────────────────────────────────
export async function submitAnswer(
  userId: number,
  sessionId: number,
  order: number,
  body: { answer?: unknown; timeSpentMs?: unknown; integritySignals?: unknown; selectedOptionId?: unknown; inputMode?: unknown; sttProvider?: unknown },
) {
  const session = await loadOwnedSession(userId, sessionId);
  const turn = await prisma.interviewTurn.findUnique({
    where: { uk_interview_turn_order: { sessionId, order } },
    include: { question: true },
  });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  const q = turn.question;
  const isEn = session.language === 'EN';
  // Phase 3: ad-hoc personalized turns (no bank question) carry their grading
  // spec in config.personalized[order]. This fallback only fires when q is null,
  // so bank-question grading is completely unchanged.
  const personalizedList = Array.isArray((session.config as { personalized?: unknown })?.personalized)
    ? ((session.config as { personalized?: PersonalizedQuestion[] }).personalized as PersonalizedQuestion[])
    : [];
  const pcfg: PersonalizedQuestion | undefined = personalizedList[order];
  const reference = (isEn ? q?.referenceAnswerEn || q?.referenceAnswer : q?.referenceAnswer) ?? pcfg?.referenceAnswer ?? null;
  const rubricForLang = (((isEn && q?.rubricEn != null ? q.rubricEn : q?.rubric) as unknown as RubricCriterion[]) ?? pcfg?.rubric ?? []) as RubricCriterion[];

  const isMcq = q?.type === 'MCQ';
  const rawAnswer = isMcq ? String(body.selectedOptionId ?? '') : String(body.answer ?? '');
  if (!rawAnswer.trim()) throw new BadRequestError('Câu trả lời trống');

  const timeSpentMs = Number(body.timeSpentMs) || null;
  // Record how the answer was entered (typed vs dictated) + which STT produced
  // it, so admin can spot systematically-lower spoken scores (a transcription
  // problem, not a knowledge problem). Merged into the integritySignals JSON.
  const baseSignals = (body.integritySignals && typeof body.integritySignals === 'object') ? { ...(body.integritySignals as Record<string, unknown>) } : {};
  const inputMode = String(body.inputMode ?? '').toUpperCase() === 'SPOKEN' ? 'SPOKEN' : 'TYPED';
  const integritySignals: Record<string, unknown> = { ...baseSignals, inputMode };
  if (body.sttProvider) integritySignals.sttProvider = String(body.sttProvider);

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
      referenceAnswer: reference ?? null,
      score: det.score,
      autoAdvance: true,
    };
  }

  const det = deterministicScore(
    rawAnswer,
    {
      mustMention: q?.mustMention ?? pcfg?.mustMention ?? [],
      shouldMention: q?.shouldMention ?? pcfg?.shouldMention ?? [],
      redFlags: q?.redFlags ?? pcfg?.redFlags ?? [],
      synonyms: (q?.synonyms as unknown as SynonymMap) ?? {},
    },
    { redFlagPenalty: redFlagPenalty() },
  );

  // ── Pass C: AI rubric grading (HYBRID / FULL_AI). Degrades to STATIC on any
  //    failure — the answer + Pass A are always saved, so nothing is lost.
  let aiEval: AiEvaluationResult | null = null;
  let downgraded = false;
  const wantsAi = session.engineMode === 'HYBRID' || session.engineMode === 'FULL_AI';
  if (wantsAi && isAiAvailable()) {
    try {
      if (await checkTokenQuota(userId)) {
        // Phase 6 RAG: ground the grader in admin-curated knowledge for this
        // question's topic/track. Never throws (retrieval degrades to []).
        const retrieved = await retrieveChunks({
          query: `${turn.questionText}\n${rawAnswer}`.slice(0, 1000),
          topicIds: q?.topicId ? [q.topicId] : [],
          trackIds: [session.trackId],
          language: session.language as 'VI' | 'EN',
        });
        aiEval = await evaluateAnswerWithAI({
          userId,
          sessionId,
          questionBody: turn.questionText,
          referenceAnswer: reference ?? null,
          rubric: rubricForLang ?? [],
          answer: rawAnswer,
          passA: det,
          language: session.language as 'VI' | 'EN',
          redFlagPenalty: redFlagPenalty(),
          disagreementThreshold: disagreementThreshold(),
          retrieved,
        });
      }
    } catch {
      // Provider failed mid-session → downgrade this session to STATIC and
      // continue in self-assessment mode. The turn stays re-scorable later.
      downgraded = true;
      await prisma.interviewSession.update({ where: { id: sessionId }, data: { engineMode: 'STATIC' } }).catch(() => {});
    }
  }

  const injectionAttempted = aiEval?.injectionAttempted ?? det.injectionAttempted;
  const needsReview = aiEval?.needsReview ?? det.injectionAttempted;

  await prisma.interviewTurn.update({
    where: { id: turn.id },
    data: {
      userAnswer: rawAnswer,
      timeSpentMs,
      integritySignals: integritySignals as never,
      deterministicScore: det as never,
      // AI turns store the combined result in turnScore (no self-assess step);
      // `final` is the authoritative score the report aggregates.
      turnScore: aiEval
        ? ({ mode: 'AI', deterministic: det.score, ai: aiEval.aiScore, final: aiEval.finalScore, grade: aiEval.letterGrade, disagreement: aiEval.disagreement, criteria: aiEval.criteria, summary: aiEval.summary, grounded: aiEval.grounded, sources: aiEval.sources } as never)
        : undefined,
      injectionAttempted,
      needsReview,
    },
  });

  return {
    order,
    type: q?.type ?? 'CONCEPTUAL',
    referenceAnswer: reference ?? null,
    rubric: rubricForLang ?? [],
    deterministic: det,
    aiEvaluation: aiEval, // per-criterion AI grading, or null in STATIC/degraded
    downgraded, // true if AI failed this turn and the session fell back to STATIC
    injectionAttempted,
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
  const session = await loadOwnedSession(userId, sessionId);
  const turn = await prisma.interviewTurn.findUnique({
    where: { uk_interview_turn_order: { sessionId, order } },
    include: { question: true },
  });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  if (!turn.userAnswer) throw new BadRequestError('Cần trả lời trước khi tự chấm');

  const ratings = (body.ratings && typeof body.ratings === 'object' ? body.ratings : {}) as Record<string, number>;
  // Ad-hoc personalized/project turns (no bank question) carry their rubric in
  // config — fall back to it so self-assessment isn't forced to 0.
  const pcfg = turn.question ? undefined : personalizedSpecs(session.config)[order];
  const rubric = (((session.language === 'EN' && turn.question?.rubricEn != null ? turn.question.rubricEn : turn.question?.rubric) as unknown as RubricCriterion[]) ?? pcfg?.rubric ?? []) as RubricCriterion[];
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
  let report = await generateStaticReport(sessionId);

  // Synthesize a warmer, more specific AI report over the template when AI is up.
  // Runs for AI-graded and personalized/project sessions (even if they downgraded
  // to STATIC mid-run); falls back silently to the template on any failure.
  const rcfg = session.config as { personalized?: unknown } | null;
  const wantsAiReport = session.engineMode === 'FULL_AI' || session.engineMode === 'HYBRID' || Array.isArray(rcfg?.personalized);
  if (wantsAiReport && isAiAvailable()) {
    const turns = await prisma.interviewTurn.findMany({
      where: { sessionId },
      orderBy: { order: 'asc' },
      include: { question: { include: { topic: { select: { name: true } } } } },
    });
    const summaries: TurnSummary[] = turns.map((t) => {
      const det = t.deterministicScore as { redFlagsHit?: string[]; mustMiss?: string[] } | null;
      const ts = t.turnScore as { final?: number } | null;
      return {
        topic: t.question?.topic?.name ?? 'General',
        question: t.questionText,
        score: ts?.final ?? (t.deterministicScore as { score?: number } | null)?.score ?? null,
        redFlags: det?.redFlagsHit ?? [],
        missing: det?.mustMiss ?? [],
      };
    });
    const track = await prisma.interviewTrack.findUnique({ where: { id: session.trackId }, select: { name: true } });
    const ai = await synthesizeAiReport({
      userId,
      sessionId,
      trackName: track?.name ?? '',
      level: session.level,
      language: session.language as 'VI' | 'EN',
      overallScore: report.overallScore ?? 0,
      turns: summaries,
    }).catch(() => null);
    if (ai) {
      report = await prisma.interviewReport.update({
        where: { sessionId },
        data: {
          strengths: ai.strengths.length ? ai.strengths : report.strengths,
          weaknesses: ai.weaknesses.length ? ai.weaknesses : report.weaknesses,
          actionableAdvice: ai.actionableAdvice || report.actionableAdvice,
          hireRecommendation: ai.hireRecommendation ?? report.hireRecommendation,
        },
      });
    }
  }

  // Weak concepts become spaced-repetition review cards (Phase 3 drill).
  await createReviewCardsForSession(userId, sessionId).catch(() => {});
  if (session.status !== 'COMPLETED') {
    await prisma.interviewSession.update({ where: { id: sessionId }, data: { status: 'COMPLETED', endedAt: new Date() } });
  }
  return report;
}

export async function getReport(userId: number, sessionId: number) {
  const session = await loadOwnedSession(userId, sessionId);
  const isEn = session.language === 'EN';
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
    language: session.language, // so the report page can read it aloud in the right voice
    turns: turns.map((t) => ({
      order: t.order,
      topic: t.question?.topic?.name ?? null,
      questionText: t.questionText,
      userAnswer: t.userAnswer,
      referenceAnswer: (isEn ? t.question?.referenceAnswerEn || t.question?.referenceAnswer : t.question?.referenceAnswer) ?? null,
      rubric: (isEn && t.question?.rubricEn != null ? t.question.rubricEn : t.question?.rubric) ?? [],
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

// ─── In-product feedback loop (Phase 5) ──────────────────────────
/** User flags a turn's score as wrong → routes it to the admin review queue. */
export async function flagTurn(userId: number, sessionId: number, order: number, reason: unknown) {
  await loadOwnedSession(userId, sessionId);
  const turn = await prisma.interviewTurn.findUnique({ where: { uk_interview_turn_order: { sessionId, order } } });
  if (!turn) throw new NotFoundError('Câu hỏi không tồn tại trong phiên');
  const sig = (turn.integritySignals as Record<string, unknown> | null) ?? {};
  await prisma.interviewTurn.update({
    where: { id: turn.id },
    data: {
      needsReview: true,
      integritySignals: { ...sig, userFlag: { reason: String(reason ?? '').slice(0, 500), at: new Date().toISOString() } } as never,
    },
  });
  return { flagged: true };
}

/** Admin review queue: turns flagged (by users OR by AI disagreement/injection). */
export async function listFlaggedTurns() {
  const turns = await prisma.interviewTurn.findMany({
    where: { needsReview: true },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    include: {
      session: { select: { userId: true, level: true, engineMode: true, language: true } },
      question: { include: { topic: { select: { name: true } } } },
    },
  });
  return turns.map((t) => ({
    id: t.id,
    sessionId: t.sessionId,
    order: t.order,
    topic: t.question?.topic?.name ?? null,
    questionText: t.questionText,
    userAnswer: t.userAnswer,
    referenceAnswer: t.question?.referenceAnswer ?? null,
    deterministicScore: t.deterministicScore,
    turnScore: t.turnScore,
    injectionAttempted: t.injectionAttempted,
    userFlag: (t.integritySignals as { userFlag?: { reason: string; at: string } } | null)?.userFlag ?? null,
    level: t.session?.level ?? null,
    engineMode: t.session?.engineMode ?? null,
    userId: t.session?.userId ?? null,
    createdAt: t.createdAt,
  }));
}

/** Admin resolves a flagged turn (clears the review flag). */
export async function resolveFlag(turnId: number) {
  await prisma.interviewTurn.update({ where: { id: turnId }, data: { needsReview: false } }).catch(() => {});
  return { resolved: true };
}
