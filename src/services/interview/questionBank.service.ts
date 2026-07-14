/**
 * Interview question bank — sampling for session plans + full-text search +
 * admin CRUD. STATIC-mode only: questions are served from the bank, never
 * generated. (AI generation lands in a later phase behind the LLM layer.)
 *
 * Conventions mirror the codebase: prisma from ../../config/database, throw
 * AppError subclasses, manual validation. Full-text search uses the raw-SQL
 * `search_vector` tsvector column (queried via $queryRawUnsafe) with an ILIKE
 * fallback, same pattern as projects / my-language.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import type { InterviewLevel, InterviewQuestion, Prisma } from '@prisma/client';

// Level ladder — sampling falls back to adjacent levels when a topic is thin.
export const LEVEL_LADDER: InterviewLevel[] = ['INTERN', 'FRESHER', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'PRINCIPAL'];

/** Distance between two levels on the ladder (0 = exact). Used to prefer the
 *  requested level while still allowing any level so every level "works". */
function levelDistance(a: InterviewLevel, b: InterviewLevel): number {
  const ia = LEVEL_LADDER.indexOf(a);
  const ib = LEVEL_LADDER.indexOf(b);
  if (ia < 0 || ib < 0) return 99;
  return Math.abs(ia - ib);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build an ordered question plan for a session: weighted sampling across the
 * track's published topics, preferring the requested level, dedup by concept
 * (so two variants of the same concept don't both appear in one session).
 * Returns fewer than `count` if the bank is thin — the caller surfaces that.
 */
export async function planQuestions(
  trackId: number,
  level: InterviewLevel,
  count: number,
): Promise<InterviewQuestion[]> {
  return planQuestionsMulti([trackId], level, count);
}

/**
 * Like planQuestions but across MULTIPLE tracks (combined positions). If
 * `topicIds` is given and non-empty, it narrows to ONLY those topics (deep-dive
 * on a specific area, e.g. just "OOP"); otherwise it covers all topics of the
 * selected tracks.
 */
export async function planQuestionsMulti(
  trackIds: number[],
  level: InterviewLevel,
  count: number,
  topicIds?: number[],
): Promise<InterviewQuestion[]> {
  const topics = await prisma.interviewTopic.findMany({
    where: topicIds && topicIds.length
      ? { id: { in: topicIds }, status: 'PUBLISHED' }
      : { trackId: { in: trackIds }, status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
  });
  if (!topics.length) return [];

  // Fetch ALL published questions for the track's topics (any level), then
  // PREFER the requested level via level-distance sorting. This means every
  // level works — even ones with no exact-match questions fall back to the
  // closest available, rather than failing with "no questions".
  const questions = await prisma.interviewQuestion.findMany({
    where: { topicId: { in: topics.map((t) => t.id) }, status: 'PUBLISHED' },
  });
  if (!questions.length) return [];

  // Group questions by topic, shuffled, then sort each topic's list so the
  // level closest to the requested one comes first.
  const byTopic = new Map<number, InterviewQuestion[]>();
  for (const t of topics) byTopic.set(t.id, []);
  for (const q of shuffle(questions)) byTopic.get(q.topicId)?.push(q);
  for (const [, list] of byTopic) {
    list.sort((a, b) => levelDistance(a.level, level) - levelDistance(b.level, level));
  }

  // Weighted round-robin: topics with higher weight get picked more often.
  const wheel: number[] = [];
  for (const t of topics) for (let i = 0; i < Math.max(1, t.weight); i++) wheel.push(t.id);

  const picked: InterviewQuestion[] = [];
  const usedConcepts = new Set<number>();
  const usedIds = new Set<number>();
  let guard = 0;
  while (picked.length < count && guard < wheel.length * 20) {
    guard++;
    const topicId = wheel[guard % wheel.length];
    const list = byTopic.get(topicId);
    if (!list?.length) continue;
    const idx = list.findIndex(
      (q) => !usedIds.has(q.id) && (q.conceptId == null || !usedConcepts.has(q.conceptId)),
    );
    if (idx < 0) continue;
    const [q] = list.splice(idx, 1);
    picked.push(q);
    usedIds.add(q.id);
    if (q.conceptId != null) usedConcepts.add(q.conceptId);
  }
  return picked;
}

/**
 * Full-text search over the bank (admin). Uses the tsvector `search_vector`
 * column; on any error (e.g. the column missing after a stray db push) falls
 * back to ILIKE so search never hard-fails.
 */
export async function searchQuestions(
  query: string,
  opts: { topicId?: number; level?: InterviewLevel; limit?: number } = {},
): Promise<InterviewQuestion[]> {
  const q = (query || '').trim();
  const limit = Math.min(100, Math.max(1, opts.limit ?? 30));
  if (!q) {
    return prisma.interviewQuestion.findMany({
      where: {
        ...(opts.topicId ? { topicId: opts.topicId } : {}),
        ...(opts.level ? { level: opts.level } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
      `SELECT id FROM interview_questions
       WHERE search_vector @@ websearch_to_tsquery('simple', $1)
       ORDER BY ts_rank(search_vector, websearch_to_tsquery('simple', $1)) DESC
       LIMIT $2`,
      q,
      limit,
    );
    const ids = rows.map((r) => r.id);
    if (!ids.length) return [];
    const found = await prisma.interviewQuestion.findMany({ where: { id: { in: ids } } });
    const order = new Map(ids.map((id, i) => [id, i]));
    return found.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
  } catch {
    // ILIKE fallback — the tsvector column is unavailable.
    return prisma.interviewQuestion.findMany({
      where: { OR: [{ body: { contains: q, mode: 'insensitive' } }, { bodyVi: { contains: q, mode: 'insensitive' } }] },
      take: limit,
    });
  }
}

// ─── Admin CRUD ──────────────────────────────────────────────────
export async function listQuestions(filters: {
  topicId?: number;
  trackId?: number;
  level?: InterviewLevel;
  status?: string;
  rubricReviewed?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
  const where: Prisma.InterviewQuestionWhereInput = {};
  if (filters.topicId) where.topicId = filters.topicId;
  if (filters.trackId) where.topic = { trackId: filters.trackId };
  if (filters.level) where.level = filters.level;
  if (filters.status) where.status = filters.status as never;
  if (filters.rubricReviewed !== undefined) where.rubricReviewed = filters.rubricReviewed;

  const [items, total] = await Promise.all([
    prisma.interviewQuestion.findMany({
      where,
      include: { topic: { select: { id: true, name: true, trackId: true } }, concept: { select: { id: true, name: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.interviewQuestion.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function getQuestion(id: number) {
  return prisma.interviewQuestion.findUnique({
    where: { id },
    include: { topic: true, concept: true, versions: { orderBy: { version: 'desc' } } },
  });
}

type QuestionInput = Partial<{
  topicId: number;
  conceptId: number | null;
  level: InterviewLevel;
  type: string;
  difficulty: number;
  body: string;
  bodyVi: string | null;
  bodyEn: string | null;
  referenceAnswer: string | null;
  rubric: unknown;
  mustMention: string[];
  shouldMention: string[];
  redFlags: string[];
  synonyms: unknown;
  mcqOptions: unknown;
  tags: string[];
  status: string;
  rubricReviewed: boolean;
}>;

export async function createQuestion(authorId: number, data: QuestionInput) {
  if (!data.topicId) throw new BadRequestError('topicId là bắt buộc');
  if (!data.level) throw new BadRequestError('level là bắt buộc');
  if (!data.body?.trim()) throw new BadRequestError('body là bắt buộc');
  return prisma.interviewQuestion.create({
    data: {
      topicId: data.topicId,
      conceptId: data.conceptId ?? null,
      level: data.level,
      type: (data.type as never) ?? 'CONCEPTUAL',
      difficulty: data.difficulty ?? 3,
      body: data.body,
      bodyVi: data.bodyVi ?? null,
      bodyEn: data.bodyEn ?? null,
      referenceAnswer: data.referenceAnswer ?? null,
      rubric: (data.rubric as never) ?? [],
      mustMention: data.mustMention ?? [],
      shouldMention: data.shouldMention ?? [],
      redFlags: data.redFlags ?? [],
      synonyms: (data.synonyms as never) ?? {},
      mcqOptions: (data.mcqOptions as never) ?? undefined,
      tags: data.tags ?? [],
      source: 'ADMIN',
      status: (data.status as never) ?? 'DRAFT',
      rubricReviewed: data.rubricReviewed ?? false,
      authorId,
    },
  });
}

export async function updateQuestion(id: number, editorId: number, data: QuestionInput) {
  const existing = await prisma.interviewQuestion.findUnique({ where: { id } });
  if (!existing) throw new BadRequestError('Câu hỏi không tồn tại');
  // Snapshot the previous version before overwriting.
  const lastVersion = await prisma.interviewQuestionVersion.count({ where: { questionId: id } });
  await prisma.interviewQuestionVersion.create({
    data: { questionId: id, version: lastVersion + 1, snapshot: existing as never, editorId },
  });
  return prisma.interviewQuestion.update({
    where: { id },
    data: {
      topicId: data.topicId ?? undefined,
      conceptId: data.conceptId === undefined ? undefined : data.conceptId,
      level: data.level ?? undefined,
      type: (data.type as never) ?? undefined,
      difficulty: data.difficulty ?? undefined,
      body: data.body ?? undefined,
      bodyVi: data.bodyVi === undefined ? undefined : data.bodyVi,
      bodyEn: data.bodyEn === undefined ? undefined : data.bodyEn,
      referenceAnswer: data.referenceAnswer === undefined ? undefined : data.referenceAnswer,
      rubric: data.rubric === undefined ? undefined : (data.rubric as never),
      mustMention: data.mustMention ?? undefined,
      shouldMention: data.shouldMention ?? undefined,
      redFlags: data.redFlags ?? undefined,
      synonyms: data.synonyms === undefined ? undefined : (data.synonyms as never),
      mcqOptions: data.mcqOptions === undefined ? undefined : (data.mcqOptions as never),
      tags: data.tags ?? undefined,
      status: (data.status as never) ?? undefined,
      rubricReviewed: data.rubricReviewed ?? undefined,
    },
  });
}

export async function deleteQuestion(id: number) {
  await prisma.interviewQuestion.delete({ where: { id } });
  return { deleted: true };
}
