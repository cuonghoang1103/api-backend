/**
 * STATIC report generator — TEMPLATE-based, NO LLM.
 *
 * Synthesizes all turns of a finished session into an InterviewReport:
 * objective coverage per topic, weakest areas, red flags, and a terse honest
 * verdict. This is the STATIC-mode report the prompt asks for — "terse and
 * honest, not chatty". The richer LLM-authored report lands in a later phase.
 */
import { prisma } from '../../config/database.js';
import type { InterviewHireRecommendation } from '@prisma/client';
import { letterGrade } from './scoring.js';
import * as knowledge from './knowledge/knowledge.service.js';

interface StoredDeterministic {
  score?: number;
  redFlagsHit?: string[];
  mustMiss?: string[];
}
interface StoredTurnScore {
  deterministic?: number;
  self?: number | null;
  divergence?: number | null;
  final?: number | null; // AI combined score (HYBRID/FULL_AI turns)
}

function hireRecommendation(score: number): InterviewHireRecommendation {
  if (score >= 90) return 'STRONG_YES';
  if (score >= 80) return 'YES';
  if (score >= 70) return 'LEAN_YES';
  if (score >= 58) return 'LEAN_NO';
  if (score >= 45) return 'NO';
  return 'STRONG_NO';
}

/**
 * Build (or rebuild) the report for a session. Idempotent: upserts on the
 * unique sessionId, so calling finish twice never creates two reports.
 */
export async function generateStaticReport(sessionId: number) {
  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: {
        orderBy: { order: 'asc' },
        include: { question: { include: { topic: { select: { id: true, name: true, nameVi: true } } } } },
      },
    },
  });
  if (!session) throw new Error('session not found');

  // Language purity: EN sessions use the canonical topic name + English advice;
  // VI sessions prefer nameVi + Vietnamese advice.
  const isEn = session.language === 'EN';
  const topicLabel = (topic?: { name: string | null; nameVi: string | null } | null): string =>
    (isEn ? topic?.name : topic?.nameVi ?? topic?.name) ?? 'General';

  // Personalized/project turns have no bank topic (topicId 0) — group them under a
  // single synthetic bucket so the report isn't empty for those sessions.
  const cfg = session.config as { personalized?: unknown; projectInterview?: boolean } | null;
  const isPersonalized = Array.isArray(cfg?.personalized);
  const adhocName = isPersonalized
    ? (cfg?.projectInterview ? (isEn ? 'Project' : 'Dự án') : (isEn ? 'Personalized' : 'Cá nhân hoá'))
    : 'General';

  const answered = session.turns.filter((t) => t.userAnswer && t.userAnswer.trim().length > 0);

  // Per-topic aggregation from the deterministic (objective) score.
  const topicAgg = new Map<number, { name: string; scores: number[]; redFlags: number }>();
  let redFlagTotal = 0;
  let selfSum = 0;
  let selfCount = 0;
  const detScores: number[] = [];

  for (const t of session.turns) {
    const det = (t.deterministicScore as StoredDeterministic | null) ?? null;
    const ts = (t.turnScore as StoredTurnScore | null) ?? null;
    const topicId = t.question?.topic?.id ?? 0;
    const topicName = t.question?.topic ? topicLabel(t.question.topic) : adhocName;
    if (!topicAgg.has(topicId)) topicAgg.set(topicId, { name: topicName, scores: [], redFlags: 0 });
    const agg = topicAgg.get(topicId)!;
    // Authoritative score: AI combined score when present, else deterministic.
    const authoritative = ts?.final != null ? ts.final : det?.score ?? null;
    if (authoritative != null) {
      agg.scores.push(authoritative);
      detScores.push(authoritative);
    }
    const rf = det?.redFlagsHit?.length ?? 0;
    agg.redFlags += rf;
    redFlagTotal += rf;
    if (ts?.self != null) {
      selfSum += ts.self;
      selfCount++;
    }
  }

  const overall = detScores.length ? Math.round(detScores.reduce((a, b) => a + b, 0) / detScores.length) : 0;
  const selfAvg = selfCount ? Math.round(selfSum / selfCount) : null;

  const byTopic = Array.from(topicAgg.entries())
    .filter(([id]) => id !== 0 || isPersonalized)
    .map(([id, v]) => ({
      topicId: id,
      topic: v.name,
      avgScore: v.scores.length ? Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) : 0,
      questions: v.scores.length,
      redFlags: v.redFlags,
    }))
    .sort((a, b) => a.avgScore - b.avgScore);

  const strengths = byTopic.filter((t) => t.avgScore >= 80).map((t) => t.topic);
  const weaknesses = byTopic.filter((t) => t.avgScore < 70 || t.redFlags > 0).map((t) => t.topic);

  const weakest = byTopic.slice(0, 3);
  const adviceLines: string[] = [];
  if (weakest.length) {
    const topics = weakest.map((t) => `${t.topic} (${t.avgScore}/100)`).join(', ');
    adviceLines.push(isEn ? `**Review first:** ${topics}.` : `**Ưu tiên ôn lại:** ${topics}.`);
  }
  if (redFlagTotal > 0) {
    adviceLines.push(isEn
      ? `You have **${redFlagTotal} knowledge error(s) (red flags)** — wrong beliefs, more dangerous than gaps. Read the model answers on those questions carefully.`
      : `Có **${redFlagTotal} lỗi kiến thức (red flag)** — đây là niềm tin sai, nguy hiểm hơn cả thiếu sót. Đọc kỹ đáp án mẫu ở các câu tương ứng.`);
  }
  if (selfAvg != null && Math.abs(selfAvg - overall) >= 15) {
    adviceLines.push(isEn
      ? `You self-scored **${selfAvg}/100**, the objective grader **${overall}/100** (${selfAvg > overall ? 'higher' : 'lower'}). A large gap is the most notable signal: compare against the model answers to recalibrate how well you actually know the material.`
      : `Bạn tự chấm **${selfAvg}/100**, máy chấm khách quan **${overall}/100** (${selfAvg > overall ? 'cao hơn' : 'thấp hơn'}). Chênh lệch lớn là tín hiệu đáng chú ý nhất: hãy đối chiếu đáp án mẫu để hiệu chỉnh cảm nhận về mức độ mình nắm bài.`);
  }
  if (!adviceLines.length) adviceLines.push(isEn
    ? 'Good coverage across the criteria. Keep practising other variants of the same concept to make sure you understand it rather than memorise it.'
    : 'Bao phủ tốt các tiêu chí. Tiếp tục luyện biến thể khác của cùng khái niệm để chắc chắn là hiểu chứ không phải học thuộc.');

  const scoreBreakdown = {
    byTopic,
    self: selfAvg,
    deterministic: overall,
    divergence: selfAvg != null ? selfAvg - overall : null,
    redFlagTotal,
    answered: answered.length,
    total: session.turns.length,
  };

  // Phase 6: link each weak topic to the exact knowledge docs covering it, so
  // the report becomes a study plan (source-traceable), not just a verdict.
  const suggestedResources = await Promise.all(
    weakest.map(async (t) => {
      const kb = await knowledge.sourcesForTopic(t.topicId).catch(() => []);
      return {
        topicId: t.topicId,
        topic: t.topic,
        note: isEn ? 'See the model answers & criteria on questions in this topic.' : 'Xem đáp án mẫu & tiêu chí ở các câu thuộc chủ đề này.',
        sources: kb, // [{documentId,title,headingPath,sourceUrl}] from the knowledge base
      };
    }),
  );

  return prisma.interviewReport.upsert({
    where: { sessionId },
    create: {
      sessionId,
      overallScore: overall,
      letterGrade: letterGrade(overall),
      scoreBreakdown: scoreBreakdown as never,
      strengths,
      weaknesses,
      actionableAdvice: adviceLines.join('\n\n'),
      suggestedResources: suggestedResources as never,
      hireRecommendation: hireRecommendation(overall),
    },
    update: {
      overallScore: overall,
      letterGrade: letterGrade(overall),
      scoreBreakdown: scoreBreakdown as never,
      strengths,
      weaknesses,
      actionableAdvice: adviceLines.join('\n\n'),
      suggestedResources: suggestedResources as never,
      hireRecommendation: hireRecommendation(overall),
    },
  });
}
