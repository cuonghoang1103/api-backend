/**
 * My Language — language-learning platform service layer.
 *
 * Public reads (languages, 7 content sections, vocab full-text search),
 * per-user SRS progress (simplified SM-2) + quiz history, and full admin
 * CRUD for every content model. Every progress/quiz query is scoped by the
 * authenticated `userId`; client-supplied user ids are never trusted.
 *
 * Conventions mirror the rest of the codebase: prisma from ../config/database,
 * throw AppError subclasses, manual validation (no Zod). Full-text search on
 * vocab uses the raw-SQL `search_vector` tsvector column created in the
 * migration (queried via $queryRawUnsafe), same pattern as the projects module.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import type { Prisma, LangItemType, LangLearnStatus } from '@prisma/client';

// ─── Shared helpers ──────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 20;

function toInt(value: unknown, label = 'id'): number {
  const n = typeof value === 'number' ? value : parseInt(String(value ?? ''), 10);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`${label} không hợp lệ`);
  return n;
}

function optInt(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = parseInt(String(value), 10);
  return Number.isInteger(n) ? n : undefined;
}

function cleanStr(value: unknown, label: string, { required = false, max = 100000 } = {}): string {
  const s = typeof value === 'string' ? value.trim() : '';
  if (required && !s) throw new BadRequestError(`${label} là bắt buộc`);
  if (s.length > max) throw new BadRequestError(`${label} quá dài (tối đa ${max} ký tự)`);
  return s;
}

function optStr(value: unknown, max = 100000): string | null {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (!s) return null;
  return s.slice(0, max);
}

function pageParams(query: { page?: unknown; limit?: unknown }): { page: number; limit: number; skip: number } {
  const page = Math.max(1, optInt(query.page) ?? 1);
  const limit = Math.min(100, Math.max(1, optInt(query.limit) ?? DEFAULT_PAGE_SIZE));
  return { page, limit, skip: (page - 1) * limit };
}

async function getLanguageOrThrow(code: string) {
  const language = await prisma.language.findUnique({ where: { code: String(code) } });
  if (!language) throw new NotFoundError('Không tìm thấy ngôn ngữ');
  return language;
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC READS
// ═══════════════════════════════════════════════════════════════

/** Landing: active languages with content counts + (optional) per-user progress summary. */
export async function getLanguages(userId?: number) {
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });

  const result = await Promise.all(
    languages.map(async (lang) => {
      const [wordCount, grammarCount, listeningCount, conversationCount, readingCount, qnaCount, alphabetCount] =
        await Promise.all([
          prisma.langVocabWord.count({ where: { category: { languageId: lang.id } } }),
          prisma.langGrammarPoint.count({ where: { languageId: lang.id } }),
          prisma.langListeningItem.count({ where: { languageId: lang.id } }),
          prisma.langConversationItem.count({ where: { languageId: lang.id } }),
          prisma.langReadingArticle.count({ where: { languageId: lang.id } }),
          prisma.langQnaItem.count({ where: { languageId: lang.id } }),
          prisma.langAlphabetItem.count({ where: { group: { languageId: lang.id } } }),
        ]);

      let progress: { learned: number; mastered: number; total: number; due: number } | null = null;
      if (userId) {
        const total = wordCount + grammarCount + alphabetCount + listeningCount + conversationCount + qnaCount;
        const [learned, mastered, due] = await Promise.all([
          prisma.langUserProgress.count({
            where: { userId, status: { in: ['LEARNING', 'REVIEWING', 'MASTERED'] } },
          }),
          prisma.langUserProgress.count({ where: { userId, status: 'MASTERED' } }),
          prisma.langUserProgress.count({ where: { userId, nextReviewAt: { lte: new Date() } } }),
        ]);
        progress = { learned, mastered, total, due };
      }

      return {
        ...lang,
        counts: {
          words: wordCount,
          grammar: grammarCount,
          listening: listeningCount,
          conversation: conversationCount,
          reading: readingCount,
          qna: qnaCount,
          alphabet: alphabetCount,
          lessons: listeningCount + conversationCount + qnaCount + readingCount,
        },
        progress,
      };
    }),
  );

  return result;
}

/** One language with per-section counts. */
export async function getLanguageOverview(code: string) {
  const lang = await getLanguageOrThrow(code);
  const [alphabet, vocab, grammar, listening, conversation, reading, qna] = await Promise.all([
    prisma.langAlphabetItem.count({ where: { group: { languageId: lang.id } } }),
    prisma.langVocabWord.count({ where: { category: { languageId: lang.id } } }),
    prisma.langGrammarPoint.count({ where: { languageId: lang.id } }),
    prisma.langListeningItem.count({ where: { languageId: lang.id } }),
    prisma.langConversationItem.count({ where: { languageId: lang.id } }),
    prisma.langReadingArticle.count({ where: { languageId: lang.id } }),
    prisma.langQnaItem.count({ where: { languageId: lang.id } }),
  ]);
  return { ...lang, counts: { alphabet, vocab, grammar, listening, conversation, reading, qna } };
}

export async function getAlphabet(code: string) {
  const lang = await getLanguageOrThrow(code);
  return prisma.langAlphabetGroup.findMany({
    where: { languageId: lang.id },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    include: { items: { orderBy: [{ order: 'asc' }, { id: 'asc' }] } },
  });
}

export async function getVocabCategories(code: string) {
  const lang = await getLanguageOrThrow(code);
  const cats = await prisma.langVocabCategory.findMany({
    where: { languageId: lang.id },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { words: true } } },
  });
  return cats.map((c) => ({ ...c, wordCount: c._count.words }));
}

export async function getVocab(
  code: string,
  query: { categoryId?: unknown; search?: unknown; page?: unknown; limit?: unknown },
) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const categoryId = optInt(query.categoryId);
  const search = optStr(query.search);

  const where: Prisma.LangVocabWordWhereInput = { category: { languageId: lang.id } };
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { word: { contains: search, mode: 'insensitive' } },
      { meaningVi: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.langVocabWord.findMany({
      where,
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      skip,
      take: limit,
      include: { pronunciations: { orderBy: { order: 'asc' } } },
    }),
    prisma.langVocabWord.count({ where }),
  ]);

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

/** Full-text vocab search using the raw-SQL tsvector column + ranking. */
export async function searchVocab(code: string, q: string) {
  const lang = await getLanguageOrThrow(code);
  const query = String(q ?? '').trim();
  if (!query) return [];

  const rows = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
    `SELECT w.id
       FROM lang_vocab_words w
       JOIN lang_vocab_categories c ON c.id = w.category_id
      WHERE c.language_id = $1
        AND w.search_vector @@ websearch_to_tsquery('simple', $2)
      ORDER BY ts_rank(w.search_vector, websearch_to_tsquery('simple', $2)) DESC, w.id ASC
      LIMIT 50`,
    lang.id,
    query,
  );
  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];

  const words = await prisma.langVocabWord.findMany({
    where: { id: { in: ids } },
    include: { pronunciations: { orderBy: { order: 'asc' } }, category: { select: { id: true, name: true } } },
  });
  // preserve rank order
  const byId = new Map(words.map((w) => [w.id, w]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

/** Compact word list for the reading tap-a-word dictionary (cached client-side). */
export async function getDictionary(code: string) {
  const lang = await getLanguageOrThrow(code);
  const words = await prisma.langVocabWord.findMany({
    where: { category: { languageId: lang.id } },
    select: {
      id: true,
      word: true,
      meaningVi: true,
      pronunciations: { select: { type: true, value: true }, orderBy: { order: 'asc' } },
    },
    orderBy: { id: 'asc' },
  });
  return words;
}

export async function getGrammar(code: string, query: { level?: unknown; page?: unknown; limit?: unknown }) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const level = optStr(query.level);
  const where: Prisma.LangGrammarPointWhereInput = { languageId: lang.id };
  if (level) where.level = level;

  const [items, total, levelsRaw] = await Promise.all([
    prisma.langGrammarPoint.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit }),
    prisma.langGrammarPoint.count({ where }),
    prisma.langGrammarPoint.findMany({
      where: { languageId: lang.id, level: { not: null } },
      select: { level: true },
      distinct: ['level'],
    }),
  ]);
  const levels = levelsRaw.map((l) => l.level).filter(Boolean) as string[];
  return { items, levels, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getListening(code: string, query: { page?: unknown; limit?: unknown }) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const where = { languageId: lang.id };
  const [items, total] = await Promise.all([
    prisma.langListeningItem.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit }),
    prisma.langListeningItem.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getConversation(code: string, query: { page?: unknown; limit?: unknown }) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const where = { languageId: lang.id };
  const [items, total] = await Promise.all([
    prisma.langConversationItem.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit }),
    prisma.langConversationItem.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getReading(code: string, query: { page?: unknown; limit?: unknown }) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const where = { languageId: lang.id };
  const [items, total] = await Promise.all([
    prisma.langReadingArticle.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit }),
    prisma.langReadingArticle.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getQna(code: string, query: { page?: unknown; limit?: unknown }) {
  const lang = await getLanguageOrThrow(code);
  const { page, limit, skip } = pageParams(query);
  const where = { languageId: lang.id };
  const [items, total] = await Promise.all([
    prisma.langQnaItem.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit }),
    prisma.langQnaItem.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

// ═══════════════════════════════════════════════════════════════
// USER PROGRESS & SRS (SM-2) — always scoped by userId
// ═══════════════════════════════════════════════════════════════

const ITEM_TYPES: LangItemType[] = ['VOCAB', 'ALPHABET', 'GRAMMAR', 'LISTENING', 'CONVERSATION', 'READING', 'QNA'];

function statusFromInterval(intervalDays: number, quality: number): LangLearnStatus {
  if (quality < 3) return 'LEARNING';
  if (intervalDays >= 21) return 'MASTERED';
  return 'REVIEWING';
}

/**
 * Upsert a progress row applying the simplified SM-2 algorithm.
 * `quality` 0-5 (Again=0/2, Hard=3, Good=4, Easy=5). If `status` is provided
 * without `quality` (e.g. a plain "Mark as learned" toggle), we just set status.
 */
export async function recordProgress(
  userId: number,
  body: { itemType?: unknown; itemId?: unknown; quality?: unknown; status?: unknown },
) {
  const itemType = String(body.itemType ?? '').toUpperCase() as LangItemType;
  if (!ITEM_TYPES.includes(itemType)) throw new BadRequestError('itemType không hợp lệ');
  const itemId = toInt(body.itemId, 'itemId');

  const existing = await prisma.langUserProgress.findUnique({
    where: { userId_itemType_itemId: { userId, itemType, itemId } },
  });

  // Plain status toggle (no SRS rating)
  if (body.quality === undefined || body.quality === null) {
    const status = String(body.status ?? 'LEARNING').toUpperCase() as LangLearnStatus;
    const allowed: LangLearnStatus[] = ['NEW', 'LEARNING', 'REVIEWING', 'MASTERED'];
    if (!allowed.includes(status)) throw new BadRequestError('status không hợp lệ');
    return prisma.langUserProgress.upsert({
      where: { userId_itemType_itemId: { userId, itemType, itemId } },
      create: { userId, itemType, itemId, status, lastReviewedAt: new Date() },
      update: { status, lastReviewedAt: new Date() },
    });
  }

  const quality = Math.max(0, Math.min(5, optInt(body.quality) ?? 0));
  let easeFactor = existing?.easeFactor ?? 2.5;
  let repetitions = existing?.repetitions ?? 0;
  let intervalDays = existing?.intervalDays ?? 0;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
    repetitions += 1;
  }
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const now = new Date();
  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const status = statusFromInterval(intervalDays, quality);

  return prisma.langUserProgress.upsert({
    where: { userId_itemType_itemId: { userId, itemType, itemId } },
    create: { userId, itemType, itemId, status, easeFactor, repetitions, intervalDays, nextReviewAt, lastReviewedAt: now },
    update: { status, easeFactor, repetitions, intervalDays, nextReviewAt, lastReviewedAt: now },
  });
}

/** Items due for review (nextReviewAt <= now), optionally filtered to one language's vocab. */
export async function getReviewQueue(userId: number, languageCode?: string) {
  const due = await prisma.langUserProgress.findMany({
    where: { userId, nextReviewAt: { lte: new Date() } },
    orderBy: { nextReviewAt: 'asc' },
    take: 100,
  });

  // Hydrate the underlying items (currently vocab-focused, most common review target)
  const vocabIds = due.filter((d) => d.itemType === 'VOCAB').map((d) => d.itemId);
  let words: Awaited<ReturnType<typeof prisma.langVocabWord.findMany>> = [];
  if (vocabIds.length) {
    const where: Prisma.LangVocabWordWhereInput = { id: { in: vocabIds } };
    if (languageCode) {
      const lang = await prisma.language.findUnique({ where: { code: languageCode } });
      if (lang) where.category = { languageId: lang.id };
    }
    words = await prisma.langVocabWord.findMany({
      where,
      include: { pronunciations: { orderBy: { order: 'asc' } } },
    });
  }
  const byId = new Map(words.map((w) => [w.id, w]));
  const items = due
    .map((d) => ({ progress: d, word: d.itemType === 'VOCAB' ? byId.get(d.itemId) ?? null : null }))
    .filter((x) => x.word || x.progress.itemType !== 'VOCAB');

  return { count: items.length, items };
}

export async function recordQuizResult(
  userId: number,
  body: { languageId?: unknown; categoryId?: unknown; score?: unknown; total?: unknown },
) {
  const languageId = toInt(body.languageId, 'languageId');
  const categoryId = optInt(body.categoryId) ?? null;
  const score = Math.max(0, optInt(body.score) ?? 0);
  const total = Math.max(1, optInt(body.total) ?? 1);
  return prisma.langQuizResult.create({ data: { userId, languageId, categoryId, score, total } });
}

export async function getStats(userId: number, languageCode?: string) {
  const lang = languageCode ? await prisma.language.findUnique({ where: { code: languageCode } }) : null;

  const [byStatus, quizzes, recentProgress] = await Promise.all([
    prisma.langUserProgress.groupBy({ by: ['itemType', 'status'], where: { userId }, _count: true }),
    prisma.langQuizResult.findMany({
      where: { userId, ...(lang ? { languageId: lang.id } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.langUserProgress.findMany({
      where: { userId, lastReviewedAt: { not: null } },
      select: { lastReviewedAt: true },
      orderBy: { lastReviewedAt: 'desc' },
      take: 400,
    }),
  ]);

  // Daily streak from distinct review days
  const days = new Set(
    recentProgress
      .map((p) => p.lastReviewedAt)
      .filter((d): d is Date => !!d)
      .map((d) => d.toISOString().slice(0, 10)),
  );
  let streak = 0;
  const cursor = new Date();
  // allow today or yesterday as the streak anchor
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const perSection: Record<string, { learning: number; reviewing: number; mastered: number; total: number }> = {};
  for (const t of ITEM_TYPES) perSection[t] = { learning: 0, reviewing: 0, mastered: 0, total: 0 };
  for (const row of byStatus) {
    const bucket = perSection[row.itemType];
    if (!bucket) continue;
    const n = typeof row._count === 'number' ? row._count : 0;
    bucket.total += n;
    if (row.status === 'LEARNING') bucket.learning += n;
    else if (row.status === 'REVIEWING') bucket.reviewing += n;
    else if (row.status === 'MASTERED') bucket.mastered += n;
  }

  return { streak, perSection, quizHistory: quizzes.reverse() };
}

// ═══════════════════════════════════════════════════════════════
// ADMIN CRUD
// ═══════════════════════════════════════════════════════════════

// ---- Language ----
export async function adminListLanguages() {
  const langs = await prisma.language.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] });
  return Promise.all(
    langs.map(async (l) => {
      const [vocab, grammar, listening, conversation, reading, qna, alphabet] = await Promise.all([
        prisma.langVocabWord.count({ where: { category: { languageId: l.id } } }),
        prisma.langGrammarPoint.count({ where: { languageId: l.id } }),
        prisma.langListeningItem.count({ where: { languageId: l.id } }),
        prisma.langConversationItem.count({ where: { languageId: l.id } }),
        prisma.langReadingArticle.count({ where: { languageId: l.id } }),
        prisma.langQnaItem.count({ where: { languageId: l.id } }),
        prisma.langAlphabetItem.count({ where: { group: { languageId: l.id } } }),
      ]);
      return { ...l, counts: { vocab, grammar, listening, conversation, reading, qna, alphabet } };
    }),
  );
}

export async function createLanguage(body: Record<string, unknown>) {
  const code = cleanStr(body.code, 'Mã ngôn ngữ', { required: true, max: 10 }).toLowerCase();
  const existing = await prisma.language.findUnique({ where: { code } });
  if (existing) throw new BadRequestError('Mã ngôn ngữ đã tồn tại');
  return prisma.language.create({
    data: {
      code,
      name: cleanStr(body.name, 'Tên', { required: true, max: 100 }),
      nameEn: cleanStr(body.nameEn, 'Tên tiếng Anh', { required: true, max: 100 }),
      flagEmoji: cleanStr(body.flagEmoji, 'Cờ', { max: 16 }) || '🏳️',
      coverUrl: optStr(body.coverUrl, 500),
      order: optInt(body.order) ?? 0,
      isActive: body.isActive === undefined ? true : Boolean(body.isActive),
    },
  });
}

export async function updateLanguage(id: number, body: Record<string, unknown>) {
  const data: Prisma.LanguageUpdateInput = {};
  if (body.name !== undefined) data.name = cleanStr(body.name, 'Tên', { required: true, max: 100 });
  if (body.nameEn !== undefined) data.nameEn = cleanStr(body.nameEn, 'Tên tiếng Anh', { required: true, max: 100 });
  if (body.flagEmoji !== undefined) data.flagEmoji = cleanStr(body.flagEmoji, 'Cờ', { max: 16 }) || '🏳️';
  if (body.coverUrl !== undefined) data.coverUrl = optStr(body.coverUrl, 500);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  return prisma.language.update({ where: { id }, data });
}

export async function deleteLanguage(id: number) {
  await prisma.language.delete({ where: { id } });
  return { id };
}

// ---- Generic reorder ----
export type ReorderModel =
  | 'alphabetGroup'
  | 'alphabetItem'
  | 'vocabCategory'
  | 'vocabWord'
  | 'grammar'
  | 'listening'
  | 'conversation'
  | 'reading'
  | 'qna'
  | 'language';

export async function reorder(model: ReorderModel, items: Array<{ id: number; order: number }>) {
  if (!Array.isArray(items)) throw new BadRequestError('items phải là mảng');
  const valid = items.filter((it) => Number.isInteger(it.id) && Number.isInteger(it.order));
  await prisma.$transaction(async (tx) => {
    for (const it of valid) {
      const where = { id: it.id };
      const data = { order: it.order };
      switch (model) {
        case 'alphabetGroup': await tx.langAlphabetGroup.update({ where, data }); break;
        case 'alphabetItem': await tx.langAlphabetItem.update({ where, data }); break;
        case 'vocabCategory': await tx.langVocabCategory.update({ where, data }); break;
        case 'vocabWord': await tx.langVocabWord.update({ where, data }); break;
        case 'grammar': await tx.langGrammarPoint.update({ where, data }); break;
        case 'listening': await tx.langListeningItem.update({ where, data }); break;
        case 'conversation': await tx.langConversationItem.update({ where, data }); break;
        case 'reading': await tx.langReadingArticle.update({ where, data }); break;
        case 'qna': await tx.langQnaItem.update({ where, data }); break;
        case 'language': await tx.language.update({ where, data }); break;
        default: throw new BadRequestError('model không hợp lệ');
      }
    }
  });
  return { updated: valid.length };
}

// ---- Alphabet groups / items ----
export async function createAlphabetGroup(languageId: number, body: Record<string, unknown>) {
  return prisma.langAlphabetGroup.create({
    data: {
      languageId,
      name: cleanStr(body.name, 'Tên nhóm', { required: true, max: 100 }),
      description: optStr(body.description),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateAlphabetGroup(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangAlphabetGroupUpdateInput = {};
  if (body.name !== undefined) data.name = cleanStr(body.name, 'Tên nhóm', { required: true, max: 100 });
  if (body.description !== undefined) data.description = optStr(body.description);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langAlphabetGroup.update({ where: { id }, data });
}
export async function deleteAlphabetGroup(id: number) {
  await prisma.langAlphabetGroup.delete({ where: { id } });
  return { id };
}

export async function createAlphabetItem(groupId: number, body: Record<string, unknown>) {
  return prisma.langAlphabetItem.create({
    data: {
      groupId,
      character: cleanStr(body.character, 'Ký tự', { required: true, max: 32 }),
      romanization: optStr(body.romanization, 64),
      audioUrl: optStr(body.audioUrl, 500),
      imageUrl: optStr(body.imageUrl, 500),
      note: optStr(body.note),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateAlphabetItem(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangAlphabetItemUpdateInput = {};
  if (body.character !== undefined) data.character = cleanStr(body.character, 'Ký tự', { required: true, max: 32 });
  if (body.romanization !== undefined) data.romanization = optStr(body.romanization, 64);
  if (body.audioUrl !== undefined) data.audioUrl = optStr(body.audioUrl, 500);
  if (body.imageUrl !== undefined) data.imageUrl = optStr(body.imageUrl, 500);
  if (body.note !== undefined) data.note = optStr(body.note);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langAlphabetItem.update({ where: { id }, data });
}
export async function deleteAlphabetItem(id: number) {
  await prisma.langAlphabetItem.delete({ where: { id } });
  return { id };
}
/** Bulk-add items from "char,romanization" lines. */
export async function bulkAddAlphabetItems(groupId: number, text: string) {
  const lines = String(text ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const base = (await prisma.langAlphabetItem.count({ where: { groupId } })) || 0;
  const data = lines.map((line, i) => {
    const [character, romanization] = line.split(',').map((s) => s?.trim());
    return { groupId, character: (character || '').slice(0, 32), romanization: romanization?.slice(0, 64) || null, order: base + i };
  }).filter((d) => d.character);
  if (!data.length) throw new BadRequestError('Không có dòng hợp lệ');
  await prisma.langAlphabetItem.createMany({ data });
  return { added: data.length };
}

// ---- Vocab categories / words / pronunciations ----
export async function createVocabCategory(languageId: number, body: Record<string, unknown>) {
  return prisma.langVocabCategory.create({
    data: {
      languageId,
      name: cleanStr(body.name, 'Tên danh mục', { required: true, max: 150 }),
      icon: optStr(body.icon, 64),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateVocabCategory(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangVocabCategoryUpdateInput = {};
  if (body.name !== undefined) data.name = cleanStr(body.name, 'Tên danh mục', { required: true, max: 150 });
  if (body.icon !== undefined) data.icon = optStr(body.icon, 64);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langVocabCategory.update({ where: { id }, data });
}
export async function deleteVocabCategory(id: number) {
  await prisma.langVocabCategory.delete({ where: { id } });
  return { id };
}

type PronInput = { type?: unknown; value?: unknown };
function normalizePronunciations(list: unknown): Array<{ type: string; value: string; order: number }> {
  if (!Array.isArray(list)) return [];
  return list
    .map((p: PronInput, i) => ({
      type: cleanStr(p?.type, 'Loại phiên âm', { max: 40 }),
      value: cleanStr(p?.value, 'Phiên âm', { max: 255 }),
      order: i,
    }))
    .filter((p) => p.type && p.value);
}

export async function createVocabWord(categoryId: number, body: Record<string, unknown>) {
  const prons = normalizePronunciations(body.pronunciations);
  return prisma.langVocabWord.create({
    data: {
      categoryId,
      word: cleanStr(body.word, 'Từ', { required: true, max: 255 }),
      meaningVi: cleanStr(body.meaningVi, 'Nghĩa', { required: true }),
      exampleSentence: optStr(body.exampleSentence),
      exampleMeaning: optStr(body.exampleMeaning),
      imageUrl: optStr(body.imageUrl, 500),
      audioUrl: optStr(body.audioUrl, 500),
      note: optStr(body.note),
      order: optInt(body.order) ?? 0,
      pronunciations: prons.length ? { create: prons } : undefined,
    },
    include: { pronunciations: { orderBy: { order: 'asc' } } },
  });
}
export async function updateVocabWord(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangVocabWordUpdateInput = {};
  if (body.word !== undefined) data.word = cleanStr(body.word, 'Từ', { required: true, max: 255 });
  if (body.meaningVi !== undefined) data.meaningVi = cleanStr(body.meaningVi, 'Nghĩa', { required: true });
  if (body.exampleSentence !== undefined) data.exampleSentence = optStr(body.exampleSentence);
  if (body.exampleMeaning !== undefined) data.exampleMeaning = optStr(body.exampleMeaning);
  if (body.imageUrl !== undefined) data.imageUrl = optStr(body.imageUrl, 500);
  if (body.audioUrl !== undefined) data.audioUrl = optStr(body.audioUrl, 500);
  if (body.note !== undefined) data.note = optStr(body.note);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;

  // Replace pronunciations wholesale when provided
  if (body.pronunciations !== undefined) {
    const prons = normalizePronunciations(body.pronunciations);
    await prisma.langVocabPronunciation.deleteMany({ where: { wordId: id } });
    if (prons.length) {
      await prisma.langVocabPronunciation.createMany({ data: prons.map((p) => ({ ...p, wordId: id })) });
    }
  }
  return prisma.langVocabWord.update({ where: { id }, data, include: { pronunciations: { orderBy: { order: 'asc' } } } });
}
export async function deleteVocabWord(id: number) {
  await prisma.langVocabWord.delete({ where: { id } });
  return { id };
}

/** CSV bulk import. columns: word,pron_type_1,pron_value_1,pron_type_2,pron_value_2,meaning_vi,example,example_meaning,note */
export interface CsvRowResult {
  row: number;
  word: string;
  meaningVi: string;
  valid: boolean;
  error?: string;
}
export function parseVocabCsv(csv: string): { rows: Array<Record<string, string>>; results: CsvRowResult[] } {
  const lines = String(csv ?? '').split(/\r?\n/).filter((l) => l.trim().length);
  const rows: Array<Record<string, string>> = [];
  const results: CsvRowResult[] = [];
  // Detect + skip a header row
  let start = 0;
  if (lines[0] && /word/i.test(lines[0]) && /meaning/i.test(lines[0])) start = 1;
  for (let i = start; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const record = {
      word: (cols[0] || '').trim(),
      pron_type_1: (cols[1] || '').trim(),
      pron_value_1: (cols[2] || '').trim(),
      pron_type_2: (cols[3] || '').trim(),
      pron_value_2: (cols[4] || '').trim(),
      meaning_vi: (cols[5] || '').trim(),
      example: (cols[6] || '').trim(),
      example_meaning: (cols[7] || '').trim(),
      note: (cols[8] || '').trim(),
    };
    rows.push(record);
    const valid = !!record.word && !!record.meaning_vi;
    results.push({
      row: i + 1,
      word: record.word,
      meaningVi: record.meaning_vi,
      valid,
      error: valid ? undefined : !record.word ? 'Thiếu từ' : 'Thiếu nghĩa',
    });
  }
  return { rows, results };
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

export async function importVocabCsv(categoryId: number, csv: string) {
  const { rows, results } = parseVocabCsv(csv);
  const valid = rows.filter((_, i) => results[i].valid);
  const baseOrder = await prisma.langVocabWord.count({ where: { categoryId } });
  let created = 0;
  for (let i = 0; i < valid.length; i++) {
    const r = valid[i];
    const prons = [
      { type: r.pron_type_1, value: r.pron_value_1 },
      { type: r.pron_type_2, value: r.pron_value_2 },
    ].filter((p) => p.type && p.value).map((p, idx) => ({ type: p.type.slice(0, 40), value: p.value.slice(0, 255), order: idx }));
    await prisma.langVocabWord.create({
      data: {
        categoryId,
        word: r.word.slice(0, 255),
        meaningVi: r.meaning_vi,
        exampleSentence: r.example || null,
        exampleMeaning: r.example_meaning || null,
        note: r.note || null,
        order: baseOrder + i,
        pronunciations: prons.length ? { create: prons } : undefined,
      },
    });
    created += 1;
  }
  return { created, skipped: results.length - valid.length, results };
}

// ---- Grammar ----
export async function createGrammar(languageId: number, body: Record<string, unknown>) {
  return prisma.langGrammarPoint.create({
    data: {
      languageId,
      level: optStr(body.level, 20),
      title: cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 }),
      structure: cleanStr(body.structure, 'Cấu trúc', { required: true }),
      explanation: (body.explanation ?? null) as Prisma.InputJsonValue,
      examples: (body.examples ?? null) as Prisma.InputJsonValue,
      commonMistakes: optStr(body.commonMistakes),
      comparedWith: optStr(body.comparedWith),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateGrammar(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangGrammarPointUpdateInput = {};
  if (body.level !== undefined) data.level = optStr(body.level, 20);
  if (body.title !== undefined) data.title = cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 });
  if (body.structure !== undefined) data.structure = cleanStr(body.structure, 'Cấu trúc', { required: true });
  if (body.explanation !== undefined) data.explanation = (body.explanation ?? null) as Prisma.InputJsonValue;
  if (body.examples !== undefined) data.examples = (body.examples ?? null) as Prisma.InputJsonValue;
  if (body.commonMistakes !== undefined) data.commonMistakes = optStr(body.commonMistakes);
  if (body.comparedWith !== undefined) data.comparedWith = optStr(body.comparedWith);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langGrammarPoint.update({ where: { id }, data });
}
export async function deleteGrammar(id: number) {
  await prisma.langGrammarPoint.delete({ where: { id } });
  return { id };
}

// ---- Listening ----
export async function createListening(languageId: number, body: Record<string, unknown>) {
  const sourceType = String(body.sourceType ?? 'UPLOAD').toUpperCase() === 'YOUTUBE' ? 'YOUTUBE' : 'UPLOAD';
  return prisma.langListeningItem.create({
    data: {
      languageId,
      title: cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 }),
      sourceType,
      audioUrl: optStr(body.audioUrl, 500),
      youtubeUrl: optStr(body.youtubeUrl, 500),
      transcript: optStr(body.transcript),
      translation: optStr(body.translation),
      questions: (body.questions ?? null) as Prisma.InputJsonValue,
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateListening(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangListeningItemUpdateInput = {};
  if (body.title !== undefined) data.title = cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 });
  if (body.sourceType !== undefined) data.sourceType = String(body.sourceType).toUpperCase() === 'YOUTUBE' ? 'YOUTUBE' : 'UPLOAD';
  if (body.audioUrl !== undefined) data.audioUrl = optStr(body.audioUrl, 500);
  if (body.youtubeUrl !== undefined) data.youtubeUrl = optStr(body.youtubeUrl, 500);
  if (body.transcript !== undefined) data.transcript = optStr(body.transcript);
  if (body.translation !== undefined) data.translation = optStr(body.translation);
  if (body.questions !== undefined) data.questions = (body.questions ?? null) as Prisma.InputJsonValue;
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langListeningItem.update({ where: { id }, data });
}
export async function deleteListening(id: number) {
  await prisma.langListeningItem.delete({ where: { id } });
  return { id };
}

// ---- Conversation ----
export async function createConversation(languageId: number, body: Record<string, unknown>) {
  return prisma.langConversationItem.create({
    data: {
      languageId,
      question: cleanStr(body.question, 'Câu hỏi', { required: true }),
      answer: cleanStr(body.answer, 'Câu trả lời', { required: true }),
      questionPronunciation: optStr(body.questionPronunciation),
      answerPronunciation: optStr(body.answerPronunciation),
      meaningVi: optStr(body.meaningVi),
      voiceUrl: optStr(body.voiceUrl, 500),
      imageUrl: optStr(body.imageUrl, 500),
      note: optStr(body.note),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateConversation(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangConversationItemUpdateInput = {};
  if (body.question !== undefined) data.question = cleanStr(body.question, 'Câu hỏi', { required: true });
  if (body.answer !== undefined) data.answer = cleanStr(body.answer, 'Câu trả lời', { required: true });
  if (body.questionPronunciation !== undefined) data.questionPronunciation = optStr(body.questionPronunciation);
  if (body.answerPronunciation !== undefined) data.answerPronunciation = optStr(body.answerPronunciation);
  if (body.meaningVi !== undefined) data.meaningVi = optStr(body.meaningVi);
  if (body.voiceUrl !== undefined) data.voiceUrl = optStr(body.voiceUrl, 500);
  if (body.imageUrl !== undefined) data.imageUrl = optStr(body.imageUrl, 500);
  if (body.note !== undefined) data.note = optStr(body.note);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langConversationItem.update({ where: { id }, data });
}
export async function deleteConversation(id: number) {
  await prisma.langConversationItem.delete({ where: { id } });
  return { id };
}

// ---- Reading ----
export async function createReading(languageId: number, body: Record<string, unknown>) {
  const type = String(body.type ?? 'TEXT').toUpperCase() === 'IMAGE_LIST' ? 'IMAGE_LIST' : 'TEXT';
  return prisma.langReadingArticle.create({
    data: {
      languageId,
      title: cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 }),
      type,
      images: (body.images ?? null) as Prisma.InputJsonValue,
      content: (body.content ?? null) as Prisma.InputJsonValue,
      translation: (body.translation ?? null) as Prisma.InputJsonValue,
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateReading(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangReadingArticleUpdateInput = {};
  if (body.title !== undefined) data.title = cleanStr(body.title, 'Tiêu đề', { required: true, max: 255 });
  if (body.type !== undefined) data.type = String(body.type).toUpperCase() === 'IMAGE_LIST' ? 'IMAGE_LIST' : 'TEXT';
  if (body.images !== undefined) data.images = (body.images ?? null) as Prisma.InputJsonValue;
  if (body.content !== undefined) data.content = (body.content ?? null) as Prisma.InputJsonValue;
  if (body.translation !== undefined) data.translation = (body.translation ?? null) as Prisma.InputJsonValue;
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langReadingArticle.update({ where: { id }, data });
}
export async function deleteReading(id: number) {
  await prisma.langReadingArticle.delete({ where: { id } });
  return { id };
}

// ---- Q&A ----
export async function createQna(languageId: number, body: Record<string, unknown>) {
  return prisma.langQnaItem.create({
    data: {
      languageId,
      question: cleanStr(body.question, 'Câu hỏi', { required: true }),
      answer: cleanStr(body.answer, 'Câu trả lời', { required: true }),
      pronunciation: optStr(body.pronunciation),
      meaningVi: optStr(body.meaningVi),
      audioUrl: optStr(body.audioUrl, 500),
      order: optInt(body.order) ?? 0,
    },
  });
}
export async function updateQna(id: number, body: Record<string, unknown>) {
  const data: Prisma.LangQnaItemUpdateInput = {};
  if (body.question !== undefined) data.question = cleanStr(body.question, 'Câu hỏi', { required: true });
  if (body.answer !== undefined) data.answer = cleanStr(body.answer, 'Câu trả lời', { required: true });
  if (body.pronunciation !== undefined) data.pronunciation = optStr(body.pronunciation);
  if (body.meaningVi !== undefined) data.meaningVi = optStr(body.meaningVi);
  if (body.audioUrl !== undefined) data.audioUrl = optStr(body.audioUrl, 500);
  if (body.order !== undefined) data.order = optInt(body.order) ?? 0;
  return prisma.langQnaItem.update({ where: { id }, data });
}
export async function deleteQna(id: number) {
  await prisma.langQnaItem.delete({ where: { id } });
  return { id };
}

// ---- Admin fetch (all rows for one language, no pagination) ----
export async function adminGetLanguageContent(code: string, section: string) {
  const lang = await getLanguageOrThrow(code);
  switch (section) {
    case 'alphabet':
      return prisma.langAlphabetGroup.findMany({
        where: { languageId: lang.id },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: { items: { orderBy: [{ order: 'asc' }, { id: 'asc' }] } },
      });
    case 'vocab':
      return prisma.langVocabCategory.findMany({
        where: { languageId: lang.id },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: {
          _count: { select: { words: true } },
        },
      });
    case 'grammar':
      return prisma.langGrammarPoint.findMany({ where: { languageId: lang.id }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
    case 'listening':
      return prisma.langListeningItem.findMany({ where: { languageId: lang.id }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
    case 'conversation':
      return prisma.langConversationItem.findMany({ where: { languageId: lang.id }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
    case 'reading':
      return prisma.langReadingArticle.findMany({ where: { languageId: lang.id }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
    case 'qna':
      return prisma.langQnaItem.findMany({ where: { languageId: lang.id }, orderBy: [{ order: 'asc' }, { id: 'asc' }] });
    default:
      throw new BadRequestError('Section không hợp lệ');
  }
}

/** Admin: words within a category (paginated, with pronunciations). */
export async function adminGetVocabWords(categoryId: number, query: { page?: unknown; limit?: unknown; search?: unknown }) {
  const { page, limit, skip } = pageParams(query);
  const search = optStr(query.search);
  const where: Prisma.LangVocabWordWhereInput = { categoryId };
  if (search) where.OR = [{ word: { contains: search, mode: 'insensitive' } }, { meaningVi: { contains: search, mode: 'insensitive' } }];
  const [items, total] = await Promise.all([
    prisma.langVocabWord.findMany({ where, orderBy: [{ order: 'asc' }, { id: 'asc' }], skip, take: limit, include: { pronunciations: { orderBy: { order: 'asc' } } } }),
    prisma.langVocabWord.count({ where }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export { toInt, optInt };
