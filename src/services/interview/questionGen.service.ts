/**
 * Phase 8 — AI question generation, grounded in the knowledge base.
 * ─────────────────────────────────────────────────────────────────────────
 * Two-step by design ("preview → commit") so the AI never silently pollutes
 * the live bank:
 *
 *   1. generateQuestions(): calls the LLM (step 'generation') to PROPOSE N
 *      questions for a topic/level, grounded in RAG-retrieved chunks. Nothing
 *      is written — the admin sees the proposals, edits, and picks which to keep.
 *   2. commitQuestions(): persists the chosen proposals as InterviewQuestion
 *      rows with source=AI_GENERATED, status=DRAFT, rubricReviewed=false. DRAFT
 *      keeps them OUT of live sessions (planQuestions only samples PUBLISHED),
 *      and unreviewed rubric routes them through the existing admin review
 *      queue before they can ever be served.
 *
 * Guardrails: requires isAiAvailable() + the per-user daily token quota; the
 * prompt (question_generation_system) is admin-editable via Phase 7; retrieval
 * degrades to ungrounded (empty) rather than failing.
 */
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { llmComplete, extractJson, isAiAvailable, checkTokenQuota, modelForStep } from './llm/index.js';
import { renderPrompt } from './promptTemplate.service.js';
import { retrieveChunks, type RetrievedChunk } from './knowledge/retrieval.js';
import type { InterviewLevel, InterviewQuestionType } from '@prisma/client';

const QUESTION_TYPES: InterviewQuestionType[] = ['CONCEPTUAL', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SCENARIO', 'MCQ'];

// Lenient parsing — models drift on exact shapes. Coerce numbers, default arrays.
// String-list fields also arrive as a single comma/newline-joined string
// (observed in bulk generation: `"redFlags": "a, b"` failed the whole batch) —
// coerce those into arrays instead of hard-failing.
const stringList = z
  .union([z.array(z.string()), z.string()])
  .nullish()
  .transform((v) => {
    if (Array.isArray(v)) return v.map((s) => s.trim()).filter(Boolean);
    if (typeof v === 'string') return v.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    return [];
  });
const RubricItem = z.object({
  id: z.string().nullish().transform((v) => (v && v.trim()) || ''),
  criterion: z.string().nullish().transform((v) => v ?? ''),
  weight: z.coerce.number().nullish().transform((v) => (Number.isFinite(v as number) ? (v as number) : 0)),
});
const GeneratedQuestionSchema = z.object({
  body: z.string().min(1),
  referenceAnswer: z.string().nullish().transform((v) => v ?? ''),
  rubric: z.array(RubricItem).nullish().transform((v) => v ?? []),
  // The English twin. The schema, the session runner, the grader and the report
  // have always read bodyEn/referenceAnswerEn/rubricEn — nothing ever wrote
  // them, so `?? body` quietly served Vietnamese to anyone who picked English.
  // Optional: a model that returns only the display language still parses, it
  // just leaves the EN side empty rather than failing the batch.
  bodyEn: z.string().nullish().transform((v) => (v && v.trim()) || ''),
  referenceAnswerEn: z.string().nullish().transform((v) => (v && v.trim()) || ''),
  rubricEn: z.array(RubricItem).nullish().transform((v) => v ?? []),
  mustMention: stringList,
  shouldMention: stringList,
  redFlags: stringList,
  difficulty: z.coerce.number().nullish().transform((v) => clampDifficulty(v)),
  type: z.string().nullish().transform((v) => normalizeType(v)),
  tags: stringList,
});
export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;

/** Salvage parsing: one malformed question must not sink its 5 valid siblings. */
function parseGenerationResult(raw: unknown): GeneratedQuestion[] {
  const arr = (raw as { questions?: unknown[] })?.questions;
  if (!Array.isArray(arr)) return [];
  const out: GeneratedQuestion[] = [];
  for (const item of arr) {
    const parsed = GeneratedQuestionSchema.safeParse(item);
    if (parsed.success) out.push(parsed.data);
  }
  return out;
}

function clampDifficulty(v: unknown): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return 3;
  return Math.max(1, Math.min(5, n));
}
function normalizeType(v: unknown): InterviewQuestionType {
  const s = String(v ?? '').toUpperCase().replace(/[\s-]+/g, '_');
  return (QUESTION_TYPES as string[]).includes(s) ? (s as InterviewQuestionType) : 'CONCEPTUAL';
}

/** Build the quotable reference block from retrieved chunks (mirrors the grader). */
function renderKnowledge(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => {
      const crumb = c.headingPath ? ` — ${c.headingPath}` : '';
      return `[K${i + 1}] ${c.documentTitle}${crumb}\n${c.content}`;
    })
    .join('\n\n');
}

export interface GenerateParams {
  userId: number;
  topicId: number;
  level: InterviewLevel;
  count?: number;
  type?: string; // preferred question type (or 'ANY')
  language?: 'VI' | 'EN';
  useKnowledge?: boolean; // ground in KB (default true)
}

export interface GeneratePreview {
  questions: GeneratedQuestion[];
  grounded: boolean;
  chunksUsed: number;
  sources: { documentId: number; title: string; headingPath: string | null }[];
  model: string;
  topic: { id: number; name: string; trackId: number };
  warning?: string;
}

/**
 * Propose (do NOT persist) `count` questions for a topic/level. Grounds in the
 * KB when useKnowledge and coverage exist. Throws BadRequestError when AI is
 * unavailable or over quota — the route surfaces that to the admin.
 */
export async function generateQuestions(params: GenerateParams): Promise<GeneratePreview> {
  if (!isAiAvailable()) {
    throw new BadRequestError('AI đang tắt (STATIC mode / thiếu API key / circuit mở). Không thể sinh câu hỏi lúc này.');
  }
  const okQuota = await checkTokenQuota(params.userId);
  if (!okQuota) throw new BadRequestError('Đã đạt hạn mức token trong ngày. Thử lại vào ngày mai hoặc tăng INTERVIEW_DAILY_TOKEN_CAP.');

  const count = Math.min(10, Math.max(1, params.count ?? 5));
  const language = params.language === 'EN' ? 'EN' : 'VI';
  const useKnowledge = params.useKnowledge !== false;
  const preferredType = params.type && params.type !== 'ANY' ? normalizeType(params.type) : 'ANY';

  const topic = await prisma.interviewTopic.findUnique({
    where: { id: params.topicId },
    include: { track: { include: { domain: true } }, concepts: { select: { name: true }, take: 40 } },
  });
  if (!topic) throw new BadRequestError('Topic không tồn tại');

  const conceptNames = topic.concepts.map((c) => c.name);

  // RAG: retrieve authoritative chunks for this topic. Query = topic + concepts.
  let retrieved: RetrievedChunk[] = [];
  if (useKnowledge) {
    retrieved = await retrieveChunks({
      query: [topic.name, topic.nameVi, ...conceptNames].filter(Boolean).join(' '),
      topicIds: [topic.id],
      trackIds: [topic.trackId],
      language: language as 'VI' | 'EN',
      k: 8,
    });
  }
  const grounded = retrieved.length > 0;

  // Anti-duplication: fetch what's already in the bank so we can (a) tell the
  // model not to repeat them and (b) filter any near-duplicate it proposes.
  // No `take` cap: it bounds what dedup compares against, so past that many
  // rows the OLDEST questions silently stop blocking duplicates — the exact
  // failure the vocab generator had at take:200. Per-topic and body-only, so
  // even a deep topic is a cheap read.
  const existingQuestions = await prisma.interviewQuestion.findMany({
    where: { topicId: topic.id },
    select: { body: true },
    orderBy: { id: 'desc' },
  });
  const existingKeys = new Set(existingQuestions.map((e) => e.body.trim().toLowerCase().slice(0, 120)));

  const system = await renderPrompt('question_generation_system', {
    count,
    language: language === 'EN' ? 'English' : 'Vietnamese',
    domain: topic.track.domain.name,
    track: topic.track.name,
    topic: topic.name,
    level: params.level,
    type: preferredType,
  });

  const userParts: string[] = [
    `Generate ${count} interview questions for topic "${topic.name}" (level ${params.level}, ${language === 'EN' ? 'English' : 'Vietnamese'}).`,
  ];
  if (conceptNames.length) userParts.push('', `Key concepts to cover across the questions: ${conceptNames.join(', ')}.`);
  if (grounded) {
    userParts.push('', '<reference_knowledge>', renderKnowledge(retrieved), '</reference_knowledge>');
  } else {
    userParts.push('', '(No reference knowledge available for this topic — use only canonical, well-established knowledge.)');
  }
  if (existingQuestions.length) {
    userParts.push(
      '',
      'These questions ALREADY EXIST in the bank — do NOT duplicate, re-order, or lightly reword any of them; produce genuinely NEW ones:',
      ...existingQuestions.slice(0, 80).map((e, i) => `${i + 1}. ${e.body.slice(0, 200)}`),
    );
  }
  // Bilingual twin. This instruction lives here rather than in the editable
  // system template so it holds no matter how an admin rewrites that template.
  userParts.push(
    '',
    'BILINGUAL — every question MUST carry both languages, because the learner switches between them:',
    language === 'EN'
      ? '- "body"/"referenceAnswer"/"rubric" are in English. Copy them verbatim into "bodyEn"/"referenceAnswerEn"/"rubricEn".'
      : [
          '- "body", "referenceAnswer" and "rubric" are in Vietnamese, as instructed above.',
          '- "bodyEn", "referenceAnswerEn" and "rubricEn" are the SAME question, model answer and rubric written in professional English —',
          '  the English a real interviewer at an international company would use. Not a literal gloss of the Vietnamese: idiomatic, natural technical English.',
          '- "rubricEn" must mirror "rubric" one-for-one: same length, same order, identical "id" and "weight", only "criterion" translated.',
          '- Technical terms, code and identifiers stay untouched in BOTH languages (deadlock, race condition, `useEffect`, N+1…). Never invent Vietnamese for an established English term.',
        ].join('\n'),
    '',
    'Return the JSON object only.',
  );
  const user = userParts.join('\n');

  const parse = (text: string): GeneratedQuestion[] => parseGenerationResult(extractJson(text));

  // Opus writes thorough questions + model answers + rubrics. Budget scales with
  // the count and is generous (≈2.5× the earlier size) so answers are detailed and
  // never truncated. Timeout is raised to match (stays under the nginx 300s cap);
  // no auto-retry — a retry at this length would blow past that ceiling.
  const genMaxTokens = Math.min(32000, count * 3750 + 5000);
  const genTimeoutMs = 285_000;

  let questions: GeneratedQuestion[];
  const first = await llmComplete({
    step: 'generation', feature: 'bulk_gen',
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: genMaxTokens,
    timeoutMs: genTimeoutMs,
    maxRetries: 0,
    userId: params.userId,
    sessionId: null,
  });
  try {
    questions = parse(first.text);
    if (!questions.length) throw new Error('salvage yielded zero questions');
  } catch {
    const retry = await llmComplete({
      step: 'generation', feature: 'bulk_gen',
      system,
      messages: [
        { role: 'user', content: user },
        { role: 'assistant', content: first.text },
        { role: 'user', content: 'Your previous output was not valid JSON matching the schema. Return ONLY the JSON object — no prose, no code fences.' },
      ],
      maxTokens: genMaxTokens,
      timeoutMs: genTimeoutMs,
      maxRetries: 0,
      userId: params.userId,
      sessionId: null,
    });
    questions = parse(retry.text); // second failure throws → route returns 400
  }

  // Dedupe near-identical bodies (within the batch AND against the existing bank).
  const seen = new Set<string>(existingKeys);
  questions = questions.filter((q) => {
    const key = q.body.trim().toLowerCase().slice(0, 120);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    questions,
    grounded,
    chunksUsed: retrieved.length,
    sources: retrieved.map((c) => ({ documentId: c.documentId, title: c.documentTitle, headingPath: c.headingPath })),
    model: modelForStep('generation'),
    topic: { id: topic.id, name: topic.name, trackId: topic.trackId },
    warning: !grounded && useKnowledge ? 'Không có kho tri thức cho topic này — câu hỏi dựa trên kiến thức chung, hãy rà soát kỹ hơn.' : undefined,
  };
}

export interface CommitParams {
  authorId: number;
  topicId: number;
  level: InterviewLevel;
  questions: GeneratedQuestion[];
}

/**
 * Persist chosen proposals as DRAFT, source=AI_GENERATED, rubricReviewed=false.
 * They stay out of live sessions until an admin reviews + publishes them.
 */
export async function commitQuestions(params: CommitParams): Promise<{ created: number; skipped: number; ids: number[] }> {
  const topic = await prisma.interviewTopic.findUnique({ where: { id: params.topicId }, select: { id: true } });
  if (!topic) throw new BadRequestError('Topic không tồn tại');
  const items = (params.questions ?? []).filter((q) => q && typeof q.body === 'string' && q.body.trim());
  if (!items.length) throw new BadRequestError('Không có câu hỏi nào để lưu');

  // Anti-duplication: never recreate a question whose body already exists in the topic.
  const existing = await prisma.interviewQuestion.findMany({ where: { topicId: params.topicId }, select: { body: true } });
  const existingKeys = new Set(existing.map((e) => e.body.trim().toLowerCase().slice(0, 120)));

  const ids: number[] = [];
  for (const q of items) {
    const key = q.body.trim().toLowerCase().slice(0, 120);
    if (existingKeys.has(key)) continue; // already in the bank — skip
    existingKeys.add(key);
    const created = await prisma.interviewQuestion.create({
      data: {
        topicId: params.topicId,
        level: params.level,
        type: normalizeType(q.type),
        difficulty: clampDifficulty(q.difficulty),
        body: q.body,
        bodyEn: q.bodyEn || null,
        referenceAnswer: q.referenceAnswer || null,
        referenceAnswerEn: q.referenceAnswerEn || null,
        rubric: (q.rubric ?? []) as never,
        // Only store an English rubric that actually mirrors the display one —
        // a half-translated rubric would score an English session against
        // criteria that no longer line up with their weights.
        rubricEn: (q.rubricEn?.length === (q.rubric?.length ?? 0) && q.rubricEn?.length ? (q.rubricEn as never) : undefined),
        mustMention: q.mustMention ?? [],
        shouldMention: q.shouldMention ?? [],
        redFlags: q.redFlags ?? [],
        tags: q.tags ?? [],
        source: 'AI_GENERATED',
        status: 'DRAFT',
        rubricReviewed: false,
        authorId: params.authorId,
      },
      select: { id: true },
    });
    ids.push(created.id);
  }
  return { created: ids.length, skipped: items.length - ids.length, ids };
}
