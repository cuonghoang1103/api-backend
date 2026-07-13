/**
 * Phase 6 — knowledge base management (admin side).
 *
 * A document is the editable unit (markdown); chunks are derived and never
 * edited directly. Any content change re-chunks the whole document in one
 * transaction and bumps the version, so chunks always reflect the current text.
 * Scope (topicIds/trackIds/level/language) is denormalized onto every chunk so
 * retrieval stays a single-table, index-only query.
 */
import { prisma } from '../../../config/database.js';
import type { InterviewLevel, InterviewLanguage, InterviewContentStatus, Prisma } from '@prisma/client';
import { chunkMarkdown } from './chunker.js';

export interface KnowledgeDocInput {
  title: string;
  content: string;
  sourceType?: string;
  topicIds?: number[];
  trackIds?: number[];
  level?: InterviewLevel | null;
  language?: InterviewLanguage;
  status?: InterviewContentStatus;
  sourceUrl?: string | null;
  authorId?: number | null;
}

const VALID_SOURCE_TYPES = new Set(['ADMIN_WRITTEN', 'UPLOADED_PDF', 'UPLOADED_MD', 'SCRAPED_DOC', 'REFERENCE_ANSWER']);

function buildChunkRows(
  documentId: number,
  content: string,
  scope: { topicIds: number[]; trackIds: number[]; level: InterviewLevel | null; language: InterviewLanguage; status: InterviewContentStatus },
): Prisma.InterviewKnowledgeChunkCreateManyInput[] {
  return chunkMarkdown(content).map((c) => ({
    documentId,
    chunkIndex: c.chunkIndex,
    headingPath: c.headingPath,
    content: c.content,
    tokenCount: c.tokenCount,
    topicIds: scope.topicIds,
    trackIds: scope.trackIds,
    level: scope.level,
    language: scope.language,
    status: scope.status,
  }));
}

export async function createDocument(input: KnowledgeDocInput) {
  const sourceType = input.sourceType && VALID_SOURCE_TYPES.has(input.sourceType) ? input.sourceType : 'ADMIN_WRITTEN';
  const scope = {
    topicIds: input.topicIds ?? [],
    trackIds: input.trackIds ?? [],
    level: input.level ?? null,
    language: input.language ?? 'VI',
    status: input.status ?? 'PUBLISHED',
  };
  return prisma.$transaction(async (tx) => {
    const doc = await tx.interviewKnowledgeDocument.create({
      data: {
        title: input.title.trim(),
        content: input.content,
        sourceType,
        topicIds: scope.topicIds,
        trackIds: scope.trackIds,
        level: scope.level,
        language: scope.language,
        status: scope.status,
        sourceUrl: input.sourceUrl ?? null,
        authorId: input.authorId ?? null,
      },
    });
    const rows = buildChunkRows(doc.id, input.content, scope);
    if (rows.length) await tx.interviewKnowledgeChunk.createMany({ data: rows });
    return { ...doc, chunkCount: rows.length };
  });
}

export async function updateDocument(id: number, input: Partial<KnowledgeDocInput>) {
  const existing = await prisma.interviewKnowledgeDocument.findUnique({ where: { id } });
  if (!existing) throw new Error('Document not found');

  const content = input.content ?? existing.content;
  const scope = {
    topicIds: input.topicIds ?? existing.topicIds,
    trackIds: input.trackIds ?? existing.trackIds,
    level: input.level !== undefined ? input.level : existing.level,
    language: input.language ?? existing.language,
    status: input.status ?? existing.status,
  };
  // Re-chunk if the content changed OR scope moved (scope is denormalized onto chunks).
  const contentChanged = input.content !== undefined && input.content !== existing.content;
  const scopeChanged =
    JSON.stringify(scope.topicIds) !== JSON.stringify(existing.topicIds) ||
    JSON.stringify(scope.trackIds) !== JSON.stringify(existing.trackIds) ||
    scope.level !== existing.level ||
    scope.language !== existing.language ||
    scope.status !== existing.status;

  return prisma.$transaction(async (tx) => {
    const doc = await tx.interviewKnowledgeDocument.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title.trim() } : {}),
        ...(input.content !== undefined ? { content } : {}),
        ...(input.sourceType && VALID_SOURCE_TYPES.has(input.sourceType) ? { sourceType: input.sourceType } : {}),
        topicIds: scope.topicIds,
        trackIds: scope.trackIds,
        level: scope.level,
        language: scope.language,
        status: scope.status,
        ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl } : {}),
        ...(contentChanged ? { version: { increment: 1 } } : {}),
      },
    });
    if (contentChanged || scopeChanged) {
      await tx.interviewKnowledgeChunk.deleteMany({ where: { documentId: id } });
      const rows = buildChunkRows(id, content, scope);
      if (rows.length) await tx.interviewKnowledgeChunk.createMany({ data: rows });
      return { ...doc, chunkCount: rows.length };
    }
    const chunkCount = await tx.interviewKnowledgeChunk.count({ where: { documentId: id } });
    return { ...doc, chunkCount };
  });
}

export async function deleteDocument(id: number) {
  await prisma.interviewKnowledgeDocument.delete({ where: { id } }); // chunks cascade
  return { deleted: true };
}

export async function listDocuments(filters: { topicId?: number; trackId?: number; status?: InterviewContentStatus; q?: string } = {}) {
  const where: Prisma.InterviewKnowledgeDocumentWhereInput = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.topicId ? { topicIds: { has: filters.topicId } } : {}),
    ...(filters.trackId ? { trackIds: { has: filters.trackId } } : {}),
    ...(filters.q ? { title: { contains: filters.q, mode: 'insensitive' } } : {}),
  };
  const docs = await prisma.interviewKnowledgeDocument.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { chunks: true } } },
  });
  return docs.map((d) => ({
    id: d.id,
    title: d.title,
    sourceType: d.sourceType,
    topicIds: d.topicIds,
    trackIds: d.trackIds,
    level: d.level,
    language: d.language,
    version: d.version,
    status: d.status,
    sourceUrl: d.sourceUrl,
    chunkCount: d._count.chunks,
    updatedAt: d.updatedAt,
  }));
}

export async function getDocument(id: number) {
  const doc = await prisma.interviewKnowledgeDocument.findUnique({
    where: { id },
    include: { chunks: { orderBy: { chunkIndex: 'asc' } } },
  });
  if (!doc) throw new Error('Document not found');
  return doc;
}

/**
 * Coverage heatmap: for every topic, how many published chunks exist per level
 * band. Red (zero) cells are where the grader is ungrounded. This is the admin's
 * to-do list — the single most useful KB screen.
 */
export async function coverageHeatmap() {
  const topics = await prisma.interviewTopic.findMany({
    include: { track: { select: { id: true, name: true, nameVi: true } } },
    orderBy: { id: 'asc' },
  });
  // One pass over chunks; bucket by each topic id they carry.
  const chunks = await prisma.interviewKnowledgeChunk.findMany({
    where: { status: 'PUBLISHED' },
    select: { topicIds: true },
  });
  const counts = new Map<number, number>();
  for (const c of chunks) for (const t of c.topicIds) counts.set(t, (counts.get(t) ?? 0) + 1);

  return topics.map((t) => ({
    topicId: t.id,
    topic: t.nameVi || t.name,
    trackId: t.track.id,
    track: t.track.nameVi || t.track.name,
    chunkCount: counts.get(t.id) ?? 0,
  }));
}

/** Topics with zero published knowledge chunks — explicit gap list for admin. */
export async function knowledgeGaps() {
  const rows = await coverageHeatmap();
  return rows.filter((r) => r.chunkCount === 0);
}

/**
 * Study resources for a topic: the published knowledge documents covering it,
 * with a representative heading. Feeds the report's suggestedResources so a
 * failed topic links to the exact material to read (source-traceable).
 */
export async function sourcesForTopic(topicId: number, limit = 3) {
  if (!Number.isFinite(topicId)) return [];
  const chunks = await prisma.interviewKnowledgeChunk.findMany({
    where: { status: 'PUBLISHED', topicIds: { has: topicId } },
    orderBy: [{ documentId: 'asc' }, { chunkIndex: 'asc' }],
    select: { documentId: true, headingPath: true, document: { select: { title: true, sourceUrl: true } } },
  });
  const seen = new Map<number, { documentId: number; title: string; headingPath: string | null; sourceUrl: string | null }>();
  for (const c of chunks) {
    if (seen.has(c.documentId)) continue;
    seen.set(c.documentId, { documentId: c.documentId, title: c.document.title, headingPath: c.headingPath, sourceUrl: c.document.sourceUrl });
    if (seen.size >= limit) break;
  }
  return Array.from(seen.values());
}
