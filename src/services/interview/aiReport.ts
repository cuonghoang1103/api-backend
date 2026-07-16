/**
 * AI report synthesis (Phase 4, FULL_AI). Turns all graded turns into a warm,
 * specific end-of-interview report. This is the highest-value output — it gets
 * the strongest model (LLM_MODEL_REPORT). Falls back to null on any failure so
 * the caller keeps the deterministic template report.
 */
import { z } from 'zod';
import { llmComplete, extractJson } from './llm/index.js';
import { renderPrompt } from './promptTemplate.service.js';

const ReportSchema = z.object({
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  actionableAdvice: z.string().default(''),
  hireRecommendation: z.enum(['STRONG_NO', 'NO', 'LEAN_NO', 'LEAN_YES', 'YES', 'STRONG_YES']).optional(),
});
export type AiReport = z.infer<typeof ReportSchema>;

export interface TurnSummary {
  topic: string;
  question: string;
  score: number | null;
  redFlags: string[];
  missing: string[];
}

export async function synthesizeAiReport(params: {
  userId: number;
  sessionId: number;
  trackName: string;
  level: string;
  language: 'VI' | 'EN';
  overallScore: number;
  turns: TurnSummary[];
}): Promise<AiReport | null> {
  const system = await renderPrompt('report_system', {
    language: params.language === 'EN' ? 'English' : 'Vietnamese',
  });

  const turnsText = params.turns
    .map((t, i) => `${i + 1}. [${t.topic}] score=${t.score ?? 'n/a'} ${t.redFlags.length ? `redFlags=[${t.redFlags.join(', ')}] ` : ''}${t.missing.length ? `missed=[${t.missing.join(', ')}]` : ''}\n   Q: ${t.question.slice(0, 140)}`)
    .join('\n');

  const user = [
    `TRACK: ${params.trackName} · LEVEL: ${params.level} · OVERALL: ${params.overallScore}/100`,
    '',
    'PER-QUESTION RESULTS:',
    turnsText,
    '',
    'Write the report. Ground every strength/weakness in the results above. Return the JSON object only.',
  ].join('\n');

  try {
    const res = await llmComplete({ step: 'report', feature: 'interview', system, messages: [{ role: 'user', content: user }], maxTokens: 4000, timeoutMs: 120_000, userId: params.userId, sessionId: params.sessionId });
    return ReportSchema.parse(extractJson(res.text));
  } catch {
    return null; // fall back to the deterministic template report
  }
}
