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

interface StoredDeterministic {
  score?: number;
  redFlagsHit?: string[];
  mustMiss?: string[];
}
interface StoredTurnScore {
  deterministic?: number;
  self?: number | null;
  divergence?: number | null;
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
    const topicName = t.question?.topic?.name ?? 'General';
    if (!topicAgg.has(topicId)) topicAgg.set(topicId, { name: topicName, scores: [], redFlags: 0 });
    const agg = topicAgg.get(topicId)!;
    if (det?.score != null) {
      agg.scores.push(det.score);
      detScores.push(det.score);
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
    .filter(([id]) => id !== 0)
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
    adviceLines.push('**Ưu tiên ôn lại:** ' + weakest.map((t) => `${t.topic} (${t.avgScore}/100)`).join(', ') + '.');
  }
  if (redFlagTotal > 0) {
    adviceLines.push(`Có **${redFlagTotal} lỗi kiến thức (red flag)** — đây là niềm tin sai, nguy hiểm hơn cả thiếu sót. Đọc kỹ đáp án mẫu ở các câu tương ứng.`);
  }
  if (selfAvg != null && Math.abs(selfAvg - overall) >= 15) {
    const dir = selfAvg > overall ? 'cao hơn' : 'thấp hơn';
    adviceLines.push(`Bạn tự chấm **${selfAvg}/100**, máy chấm khách quan **${overall}/100** (${dir}). Chênh lệch lớn là tín hiệu đáng chú ý nhất: hãy đối chiếu đáp án mẫu để hiệu chỉnh cảm nhận về mức độ mình nắm bài.`);
  }
  if (!adviceLines.length) adviceLines.push('Bao phủ tốt các tiêu chí. Tiếp tục luyện biến thể khác của cùng khái niệm để chắc chắn là hiểu chứ không phải học thuộc.');

  const scoreBreakdown = {
    byTopic,
    self: selfAvg,
    deterministic: overall,
    divergence: selfAvg != null ? selfAvg - overall : null,
    redFlagTotal,
    answered: answered.length,
    total: session.turns.length,
  };

  const suggestedResources = weakest.map((t) => ({ topicId: t.topicId, topic: t.topic, note: 'Xem đáp án mẫu & tiêu chí ở các câu thuộc chủ đề này.' }));

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
