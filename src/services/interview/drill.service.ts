/**
 * Spaced-repetition drill — the daily-habit surface. STATIC, zero LLM.
 *
 * A failed interview question is a flashcard: any concept graded C or below (or
 * that tripped a red flag) becomes an InterviewReviewCard scheduled by SM-2
 * (reusing the shared src/services/srs/sm2.ts scheduler). The drill serves what
 * is due today, prefers a DIFFERENT variant of the same concept so the user
 * learns the idea rather than memorising one phrasing, and reschedules on recall.
 */
import { prisma } from '../../config/database.js';
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { scheduleSm2, masteryFromState, qualityFromGrade } from '../srs/sm2.js';
import { deterministicScore, type SynonymMap, type RubricCriterion } from './scoring.js';
import type { InterviewMasteryLevel } from '@prisma/client';

const DRILL_LIMIT = (() => {
  const v = Number(process.env.DRILL_DAILY_CARD_LIMIT);
  return Number.isFinite(v) && v > 0 ? v : 20;
})();

function redFlagPenalty(): number {
  const v = Number(process.env.SCORE_REDFLAG_PENALTY);
  return Number.isFinite(v) && v > 0 ? v : 15;
}

/**
 * After a session ends, turn every weak concept into a review card. Called from
 * finishSession. A concept graded C or below (score < 70) OR that hit a red flag
 * becomes/refreshes a card due now. A repeat red flag resets its interval.
 */
export async function createReviewCardsForSession(userId: number, sessionId: number) {
  const turns = await prisma.interviewTurn.findMany({ where: { sessionId }, include: { question: true } });
  const now = new Date();
  let created = 0;
  for (const t of turns) {
    const q = t.question;
    if (!q?.conceptId) continue;
    const det = t.deterministicScore as { score?: number; redFlagsHit?: string[] } | null;
    if (!det) continue;
    const score = det.score ?? 100;
    const redFlag = (det.redFlagsHit?.length ?? 0) > 0;
    if (score >= 70 && !redFlag) continue; // only weak / red-flag concepts

    const existing = await prisma.interviewReviewCard.findUnique({
      where: { uk_interview_reviewcard_user_concept: { userId, conceptId: q.conceptId } },
    });
    if (existing) {
      await prisma.interviewReviewCard.update({
        where: { id: existing.id },
        data: {
          dueAt: now,
          questionId: q.id,
          sourceSessionId: sessionId,
          // A repeat red flag uproots the belief: reset the interval.
          ...(redFlag ? { intervalDays: 1, repetitions: 0, lapses: existing.lapses + 1, masteryLevel: 'SHAKY' as InterviewMasteryLevel } : {}),
        },
      });
    } else {
      await prisma.interviewReviewCard.create({
        data: {
          userId,
          topicId: q.topicId,
          conceptId: q.conceptId,
          questionId: q.id,
          sourceSessionId: sessionId,
          dueAt: now,
          masteryLevel: redFlag ? 'SHAKY' : 'LEARNING',
        },
      });
      created++;
    }
  }
  return created;
}

/** Cards due today + a question to answer for each (prefers a fresh variant). */
export async function getDrill(userId: number, opts: { lang?: 'VI' | 'EN'; limit?: number } = {}) {
  const isEn = opts.lang === 'EN';
  const limit = Math.min(DRILL_LIMIT, Math.max(1, opts.limit ?? DRILL_LIMIT));
  const now = new Date();

  const totalDue = await prisma.interviewReviewCard.count({ where: { userId, dueAt: { lte: now } } });
  const cards = await prisma.interviewReviewCard.findMany({
    where: { userId, dueAt: { lte: now } },
    orderBy: { dueAt: 'asc' },
    take: limit,
    include: { concept: true, topic: true },
  });

  const out = [];
  for (const card of cards) {
    let q = null;
    let variantGap = false;
    if (card.conceptId) {
      const variants = await prisma.interviewQuestion.findMany({ where: { conceptId: card.conceptId, status: 'PUBLISHED' } });
      // Prefer a variant DIFFERENT from the one that exposed the gap.
      q = variants.find((v) => v.id !== card.questionId) ?? variants[0] ?? null;
      variantGap = variants.length <= 1; // no alternative phrasing available yet
    }
    if (!q && card.questionId) q = await prisma.interviewQuestion.findUnique({ where: { id: card.questionId } });
    if (!q) continue;
    out.push({
      cardId: card.id,
      concept: card.concept?.name ?? null,
      topic: card.topic?.name ?? null,
      masteryLevel: card.masteryLevel,
      variantGap,
      question: {
        id: q.id,
        type: q.type,
        body: (isEn ? q.bodyEn || q.body : q.bodyVi || q.body),
        referenceAnswer: (isEn ? q.referenceAnswerEn || q.referenceAnswer : q.referenceAnswer) ?? null,
        rubric: (isEn && q.rubricEn != null ? q.rubricEn : q.rubric) as unknown as RubricCriterion[],
      },
    });
  }
  return { totalDue, cards: out };
}

/**
 * Grade a card. If `answer` is supplied, the objective deterministic score
 * drives the SM-2 quality (and a red flag resets the interval); otherwise the
 * user's self-rated `quality` (0-5) is used. Returns the deterministic result
 * (if any) so the client can show coverage, plus the new schedule.
 */
export async function gradeCard(
  userId: number,
  cardId: number,
  body: { quality?: unknown; answer?: unknown },
) {
  const card = await prisma.interviewReviewCard.findUnique({ where: { id: cardId } });
  if (!card) throw new NotFoundError('Thẻ ôn không tồn tại');
  if (card.userId !== userId) throw new ForbiddenError('Không có quyền với thẻ này');

  const answer = typeof body.answer === 'string' ? body.answer : '';
  let det = null;
  let redFlagHit = false;
  let quality = Math.max(0, Math.min(5, Number(body.quality) || 0));

  if (answer.trim() && card.questionId) {
    const q = await prisma.interviewQuestion.findUnique({ where: { id: card.questionId } });
    if (q) {
      det = deterministicScore(
        answer,
        { mustMention: q.mustMention, shouldMention: q.shouldMention, redFlags: q.redFlags, synonyms: (q.synonyms as unknown as SynonymMap) ?? {} },
        { redFlagPenalty: redFlagPenalty() },
      );
      redFlagHit = det.redFlagsHit.length > 0;
      quality = qualityFromGrade(det.score, redFlagHit); // objective overrides self-rating
    }
  }

  const sched = scheduleSm2(
    { easeFactor: card.easeFactor, repetitions: card.repetitions, intervalDays: card.intervalDays, lapses: card.lapses },
    quality,
    { resetOnRedFlag: redFlagHit },
  );
  const masteryLevel = masteryFromState(sched) as InterviewMasteryLevel;

  await prisma.interviewReviewCard.update({
    where: { id: cardId },
    data: {
      easeFactor: sched.easeFactor,
      repetitions: sched.repetitions,
      intervalDays: sched.intervalDays,
      lapses: sched.lapses,
      dueAt: sched.dueAt,
      lastReviewedAt: new Date(),
      masteryLevel,
    },
  });

  const remaining = await prisma.interviewReviewCard.count({ where: { userId, dueAt: { lte: new Date() } } });
  return { cardId, quality, deterministic: det, dueAt: sched.dueAt, intervalDays: sched.intervalDays, masteryLevel, remaining };
}

/** Mastery heatmap: per-topic distribution of card mastery + due counts. */
export async function getMastery(userId: number) {
  const now = new Date();
  const cards = await prisma.interviewReviewCard.findMany({
    where: { userId },
    include: { topic: { select: { id: true, name: true } } },
  });

  const byTopic = new Map<number, { topic: string; total: number; due: number; byMastery: Record<string, number> }>();
  for (const c of cards) {
    const id = c.topicId;
    if (!byTopic.has(id)) byTopic.set(id, { topic: c.topic?.name ?? `#${id}`, total: 0, due: 0, byMastery: { UNSEEN: 0, SHAKY: 0, LEARNING: 0, SOLID: 0, MASTERED: 0 } });
    const agg = byTopic.get(id)!;
    agg.total++;
    agg.byMastery[c.masteryLevel] = (agg.byMastery[c.masteryLevel] ?? 0) + 1;
    if (c.dueAt && c.dueAt <= now) agg.due++;
  }

  return {
    totalCards: cards.length,
    totalDue: cards.filter((c) => c.dueAt && c.dueAt <= now).length,
    topics: Array.from(byTopic.entries()).map(([topicId, v]) => ({ topicId, ...v })),
  };
}
