/**
 * ============================================================
 * Code Lab — service layer
 * ============================================================
 *
 * Coding-practice + learning-roadmap module. Hierarchy:
 *   CodeGroup ▸ CodeTrack ▸ CodeModule ▸ CodeExercise
 * plus per-user CodeProgress (save attempt / mark solved).
 *
 * Mirrors the Exp_Hub (snippets.service) pipeline: nested tree,
 * slug helpers, full-text search over a generated tsvector, and
 * denormalised counters updated by the API. All content is English.
 */
import { Prisma, type CodeLevel, type CodeDifficulty, type CodeStatus } from '@prisma/client';
import { prisma } from '../config/database.js';
import { sanitizeMermaid } from '../utils/mermaid.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

// ─── Slug helpers ───────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function uniqueGroupSlug(name: string, excludeId?: number): Promise<string> {
  const base = slugify(name) || 'group';
  let candidate = base;
  for (let n = 2; n < 200; n++) {
    const existing = await prisma.codeGroup.findFirst({
      where: excludeId != null ? { slug: candidate, NOT: { id: excludeId } } : { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

async function uniqueTrackSlug(name: string, excludeId?: number): Promise<string> {
  const base = slugify(name) || 'track';
  let candidate = base;
  for (let n = 2; n < 200; n++) {
    const existing = await prisma.codeTrack.findFirst({
      where: excludeId != null ? { slug: candidate, NOT: { id: excludeId } } : { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

async function uniqueModuleSlug(trackId: number, name: string, excludeId?: number): Promise<string> {
  const base = slugify(name) || 'module';
  let candidate = base;
  for (let n = 2; n < 200; n++) {
    const existing = await prisma.codeModule.findFirst({
      where: excludeId != null
        ? { trackId, slug: candidate, NOT: { id: excludeId } }
        : { trackId, slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

async function uniqueExerciseSlug(title: string, excludeId?: number): Promise<string> {
  const base = slugify(title) || 'exercise';
  let candidate = base;
  for (let n = 2; n < 500; n++) {
    const existing = await prisma.codeExercise.findFirst({
      where: excludeId != null ? { slug: candidate, NOT: { id: excludeId } } : { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

// ─── JSON normalizers ───────────────────────────────────────────

export type CodeBlock = { name: string; language: string; code: string };
export type ExampleIO = { input: string; output: string; explanation: string };
export type ImageItem = { url: string; caption?: string };

function str(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

/** Coerce a value into a clean string[] (used for concepts/prereqs/hints/tags). */
export function strArray(raw: unknown, cap = 50): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => str(x).trim())
    .filter(Boolean)
    .slice(0, cap);
}

/** Named code blocks: [{ name, language, code }]. Drops empty-code blocks. */
export function normalizeCodeBlocks(raw: unknown, fallbackLang = 'text'): CodeBlock[] {
  if (!Array.isArray(raw)) return [];
  const blocks: CodeBlock[] = [];
  raw.forEach((b, i) => {
    const o = (b ?? {}) as Record<string, unknown>;
    const code = str(o.code);
    if (!code.trim()) return;
    blocks.push({
      name: str(o.name).trim() || `Code ${i + 1}`,
      language: (str(o.language).trim() || fallbackLang).toLowerCase(),
      code,
    });
  });
  return blocks.slice(0, 20);
}

/** Worked I/O examples: [{ input, output, explanation }]. */
export function normalizeExamples(raw: unknown): ExampleIO[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => {
      const o = (e ?? {}) as Record<string, unknown>;
      return {
        input: str(o.input),
        output: str(o.output),
        explanation: str(o.explanation),
      };
    })
    .filter((e) => e.input || e.output || e.explanation)
    .slice(0, 20);
}

/** Extra images: [{ url, caption? }]. */
export function normalizeImages(raw: unknown): ImageItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((im) => {
      const o = (im ?? {}) as Record<string, unknown>;
      const url = str(o.url).trim();
      const caption = str(o.caption).trim();
      return url ? (caption ? { url, caption } : { url }) : null;
    })
    .filter((x): x is ImageItem => !!x)
    .slice(0, 20);
}

// ─── Groups ─────────────────────────────────────────────────────

export interface GroupInput {
  name: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
}

export async function getGroupsTree(opts: { admin?: boolean } = {}) {
  const trackWhere = opts.admin ? {} : { status: 'PUBLISHED' as CodeStatus };
  const groups = await prisma.codeGroup.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: {
      tracks: {
        where: trackWhere,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        include: { _count: { select: { exercises: true, modules: true } } },
      },
    },
  });
  return groups.map((g) => ({
    ...g,
    tracks: g.tracks.map((t) => ({
      ...t,
      exerciseCount: t._count.exercises,
      moduleCount: t._count.modules,
    })),
  }));
}

export async function createGroup(data: GroupInput) {
  if (!data.name?.trim()) throw new BadRequestError('Group name is required.');
  return prisma.codeGroup.create({
    data: {
      name: data.name.trim(),
      slug: await uniqueGroupSlug(data.name),
      description: data.description ?? null,
      icon: data.icon ?? null,
      color: data.color ?? null,
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateGroup(id: number, data: Partial<GroupInput> & { slug?: string }) {
  const current = await prisma.codeGroup.findUnique({ where: { id }, select: { name: true } });
  const patch: Prisma.CodeGroupUpdateInput = {};
  if (data.name != null) {
    const name = data.name.trim();
    patch.name = name;
    // Only re-slug on a real rename — see updateExercise for why.
    if (name !== current?.name) patch.slug = await uniqueGroupSlug(name, id);
  }
  if (data.description !== undefined) patch.description = data.description;
  if (data.icon !== undefined) patch.icon = data.icon;
  if (data.color !== undefined) patch.color = data.color;
  if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;
  return prisma.codeGroup.update({ where: { id }, data: patch });
}

export async function deleteGroup(id: number) {
  await prisma.codeGroup.delete({ where: { id } }); // cascades to tracks/modules/exercises
  return { success: true };
}

// ─── Tracks ─────────────────────────────────────────────────────

export interface TrackInput {
  groupId: number;
  name: string;
  language: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  coverImageUrl?: string | null;
  docsUrl?: string | null;
  level?: CodeLevel;
  sortOrder?: number;
  status?: CodeStatus;
}

export async function createTrack(data: TrackInput) {
  if (!data.name?.trim()) throw new BadRequestError('Track name is required.');
  if (!data.groupId) throw new BadRequestError('A group is required.');
  return prisma.codeTrack.create({
    data: {
      groupId: data.groupId,
      name: data.name.trim(),
      slug: await uniqueTrackSlug(data.name),
      language: (data.language || 'text').toLowerCase(),
      description: data.description ?? null,
      icon: data.icon ?? null,
      color: data.color ?? null,
      coverImageUrl: data.coverImageUrl ?? null,
      docsUrl: data.docsUrl ?? null,
      level: data.level ?? 'BEGINNER',
      sortOrder: data.sortOrder ?? 0,
      status: data.status ?? 'PUBLISHED',
    },
  });
}

export async function updateTrack(id: number, data: Partial<TrackInput>) {
  const current = await prisma.codeTrack.findUnique({ where: { id }, select: { name: true } });
  const patch: Prisma.CodeTrackUpdateInput = {};
  if (data.name != null) {
    const name = data.name.trim();
    patch.name = name;
    if (name !== current?.name) patch.slug = await uniqueTrackSlug(name, id);
  }
  if (data.groupId != null) patch.group = { connect: { id: data.groupId } };
  if (data.language !== undefined) patch.language = (data.language || 'text').toLowerCase();
  if (data.description !== undefined) patch.description = data.description;
  if (data.icon !== undefined) patch.icon = data.icon;
  if (data.color !== undefined) patch.color = data.color;
  if (data.coverImageUrl !== undefined) patch.coverImageUrl = data.coverImageUrl;
  if (data.docsUrl !== undefined) patch.docsUrl = data.docsUrl;
  if (data.level !== undefined) patch.level = data.level;
  if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;
  if (data.status !== undefined) patch.status = data.status;
  return prisma.codeTrack.update({ where: { id }, data: patch });
}

export async function deleteTrack(id: number) {
  await prisma.codeTrack.delete({ where: { id } });
  return { success: true };
}

const EXERCISE_LIST_SELECT = {
  id: true,
  moduleId: true,
  trackId: true,
  title: true,
  slug: true,
  difficulty: true,
  sortOrder: true,
  status: true,
  language: true,
  points: true,
  estimatedMinutes: true,
  viewCount: true,
  solveCount: true,
  tags: true,
} satisfies Prisma.CodeExerciseSelect;

/** Full roadmap for a track: modules (ordered) each with their exercises. */
export async function getTrackBySlug(slug: string, opts: { admin?: boolean } = {}) {
  const track = await prisma.codeTrack.findUnique({
    where: { slug },
    include: { group: true },
  });
  if (!track) throw new NotFoundError('Track not found.');

  const exWhere = opts.admin ? {} : { status: 'PUBLISHED' as CodeStatus };
  // Explicit select so the (potentially large) lessonBlocks JSON is NOT shipped
  // in the roadmap payload — only a `hasLesson` flag. The full lesson is fetched
  // on demand via getModuleLesson.
  const rawModules = await prisma.codeModule.findMany({
    where: { trackId: track.id },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    select: {
      id: true, trackId: true, name: true, slug: true, description: true,
      level: true, sortOrder: true, createdAt: true, updatedAt: true,
      lessonGeneratedAt: true,
      exercises: {
        where: exWhere,
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        select: EXERCISE_LIST_SELECT,
      },
    },
  });
  const modules = rawModules.map((m) => ({ ...m, hasLesson: !!m.lessonGeneratedAt }));

  const exerciseCount = modules.reduce((n, m) => n + m.exercises.length, 0);
  return { ...track, modules, exerciseCount };
}

// ─── Modules ────────────────────────────────────────────────────

export interface ModuleInput {
  trackId: number;
  name: string;
  description?: string | null;
  level?: CodeLevel;
  sortOrder?: number;
}

export async function createModule(data: ModuleInput) {
  if (!data.name?.trim()) throw new BadRequestError('Module name is required.');
  if (!data.trackId) throw new BadRequestError('A track is required.');
  return prisma.codeModule.create({
    data: {
      trackId: data.trackId,
      name: data.name.trim(),
      slug: await uniqueModuleSlug(data.trackId, data.name),
      description: data.description ?? null,
      level: data.level ?? 'BEGINNER',
      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateModule(id: number, data: Partial<ModuleInput>) {
  const existing = await prisma.codeModule.findUnique({ where: { id }, select: { trackId: true, name: true } });
  if (!existing) throw new NotFoundError('Module not found.');
  const patch: Prisma.CodeModuleUpdateInput = {};
  if (data.name != null) {
    const name = data.name.trim();
    patch.name = name;
    if (name !== existing.name) patch.slug = await uniqueModuleSlug(existing.trackId, name, id);
  }
  if (data.description !== undefined) patch.description = data.description;
  if (data.level !== undefined) patch.level = data.level;
  if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;
  return prisma.codeModule.update({ where: { id }, data: patch });
}

export async function deleteModule(id: number) {
  await prisma.codeModule.delete({ where: { id } });
  return { success: true };
}

// ─── Exercises ──────────────────────────────────────────────────

export interface ExerciseInput {
  moduleId: number;
  title: string;
  language?: string;
  difficulty?: CodeDifficulty;
  status?: CodeStatus;
  sortOrder?: number;
  problemHtml?: string | null;
  concepts?: unknown;
  prerequisites?: unknown;
  inputSpec?: string | null;
  outputSpec?: string | null;
  constraints?: string | null;
  examplesJson?: unknown;
  hintsJson?: unknown;
  starterCodeJson?: unknown;
  solutionCodeJson?: unknown;
  solutionExplanationHtml?: string | null;
  diagramImageUrl?: string | null;
  briefPdfUrl?: string | null;
  briefFileUrl?: string | null;
  githubUrl?: string | null;
  sourceUrl?: string | null;
  diagramMermaid?: string | null;
  imagesJson?: unknown;
  youtubeUrl?: string | null;
  referenceUrl?: string | null;
  tags?: unknown;
  estimatedMinutes?: number | null;
  points?: number;
}

function buildExerciseData(data: ExerciseInput, lang: string) {
  return {
    language: lang,
    difficulty: data.difficulty ?? 'EASY',
    status: data.status ?? 'PUBLISHED',
    sortOrder: data.sortOrder ?? 0,
    problemHtml: data.problemHtml ?? null,
    concepts: strArray(data.concepts),
    prerequisites: strArray(data.prerequisites),
    inputSpec: data.inputSpec ?? null,
    outputSpec: data.outputSpec ?? null,
    constraints: data.constraints ?? null,
    examplesJson: normalizeExamples(data.examplesJson),
    hintsJson: strArray(data.hintsJson),
    starterCodeJson: normalizeCodeBlocks(data.starterCodeJson, lang),
    solutionCodeJson: normalizeCodeBlocks(data.solutionCodeJson, lang),
    solutionExplanationHtml: data.solutionExplanationHtml ?? null,
    diagramImageUrl: data.diagramImageUrl ?? null,
    briefPdfUrl: data.briefPdfUrl ?? null,
    briefFileUrl: data.briefFileUrl ?? null,
    githubUrl: data.githubUrl ?? null,
    sourceUrl: data.sourceUrl ?? null,
    diagramMermaid: data.diagramMermaid ? sanitizeMermaid(data.diagramMermaid) : null,
    imagesJson: normalizeImages(data.imagesJson),
    youtubeUrl: data.youtubeUrl ?? null,
    referenceUrl: data.referenceUrl ?? null,
    tags: strArray(data.tags, 20),
    estimatedMinutes: data.estimatedMinutes ?? null,
    points: data.points ?? 10,
  };
}

export async function createExercise(data: ExerciseInput, authorId?: number | null) {
  if (!data.title?.trim()) throw new BadRequestError('Exercise title is required.');
  if (!data.moduleId) throw new BadRequestError('A module is required.');
  const mod = await prisma.codeModule.findUnique({
    where: { id: data.moduleId },
    select: { trackId: true, track: { select: { language: true } } },
  });
  if (!mod) throw new NotFoundError('Module not found.');
  const lang = (data.language || mod.track.language || 'text').toLowerCase();
  return prisma.codeExercise.create({
    data: {
      moduleId: data.moduleId,
      trackId: mod.trackId,
      title: data.title.trim(),
      slug: await uniqueExerciseSlug(data.title),
      authorId: authorId ?? null,
      ...buildExerciseData(data, lang),
    },
  });
}

export async function updateExercise(id: number, data: Partial<ExerciseInput>) {
  const existing = await prisma.codeExercise.findUnique({
    where: { id },
    select: { language: true, moduleId: true, trackId: true, title: true },
  });
  if (!existing) throw new NotFoundError('Exercise not found.');

  const patch: Prisma.CodeExerciseUpdateInput = {};
  if (data.title != null) {
    const title = data.title.trim();
    patch.title = title;
    // Re-slug ONLY when the title actually changed. The admin editor submits
    // every field on save, so recomputing unconditionally rewrote the slug —
    // and therefore the public URL — on edits that never touched the title.
    if (title !== existing.title) {
      patch.slug = await uniqueExerciseSlug(title, id);
    }
  }
  // Allow moving to another module (re-denormalise trackId).
  if (data.moduleId != null && data.moduleId !== existing.moduleId) {
    const mod = await prisma.codeModule.findUnique({ where: { id: data.moduleId }, select: { trackId: true } });
    if (!mod) throw new NotFoundError('Target module not found.');
    patch.module = { connect: { id: data.moduleId } };
    patch.track = { connect: { id: mod.trackId } };
  }
  const lang = (data.language || existing.language || 'text').toLowerCase();
  if (data.language !== undefined) patch.language = lang;
  if (data.difficulty !== undefined) patch.difficulty = data.difficulty;
  if (data.status !== undefined) patch.status = data.status;
  if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;
  if (data.problemHtml !== undefined) patch.problemHtml = data.problemHtml;
  if (data.concepts !== undefined) patch.concepts = strArray(data.concepts);
  if (data.prerequisites !== undefined) patch.prerequisites = strArray(data.prerequisites);
  if (data.inputSpec !== undefined) patch.inputSpec = data.inputSpec;
  if (data.outputSpec !== undefined) patch.outputSpec = data.outputSpec;
  if (data.constraints !== undefined) patch.constraints = data.constraints;
  if (data.examplesJson !== undefined) patch.examplesJson = normalizeExamples(data.examplesJson);
  if (data.hintsJson !== undefined) patch.hintsJson = strArray(data.hintsJson);
  if (data.starterCodeJson !== undefined) patch.starterCodeJson = normalizeCodeBlocks(data.starterCodeJson, lang);
  if (data.solutionCodeJson !== undefined) patch.solutionCodeJson = normalizeCodeBlocks(data.solutionCodeJson, lang);
  if (data.solutionExplanationHtml !== undefined) patch.solutionExplanationHtml = data.solutionExplanationHtml;
  if (data.diagramImageUrl !== undefined) patch.diagramImageUrl = data.diagramImageUrl;
  if (data.briefPdfUrl !== undefined) patch.briefPdfUrl = data.briefPdfUrl;
  if (data.briefFileUrl !== undefined) patch.briefFileUrl = data.briefFileUrl;
  if (data.githubUrl !== undefined) patch.githubUrl = data.githubUrl;
  if (data.sourceUrl !== undefined) patch.sourceUrl = data.sourceUrl;
  if (data.diagramMermaid !== undefined) patch.diagramMermaid = data.diagramMermaid ? sanitizeMermaid(data.diagramMermaid) : data.diagramMermaid;
  if (data.imagesJson !== undefined) patch.imagesJson = normalizeImages(data.imagesJson);
  if (data.youtubeUrl !== undefined) patch.youtubeUrl = data.youtubeUrl;
  if (data.referenceUrl !== undefined) patch.referenceUrl = data.referenceUrl;
  if (data.tags !== undefined) patch.tags = strArray(data.tags, 20);
  if (data.estimatedMinutes !== undefined) patch.estimatedMinutes = data.estimatedMinutes;
  if (data.points !== undefined) patch.points = data.points;

  return prisma.codeExercise.update({ where: { id }, data: patch });
}

export async function deleteExercise(id: number) {
  await prisma.codeExercise.delete({ where: { id } });
  return { success: true };
}

const EXERCISE_DETAIL_INCLUDE = {
  module: { select: { id: true, name: true, slug: true } },
  track: { select: { id: true, name: true, slug: true, language: true, color: true, groupId: true } },
  author: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
} satisfies Prisma.CodeExerciseInclude;

export async function getExerciseBySlug(slug: string, opts: { admin?: boolean } = {}) {
  const exercise = await prisma.codeExercise.findUnique({
    where: { slug },
    include: EXERCISE_DETAIL_INCLUDE,
  });
  if (!exercise) throw new NotFoundError('Exercise not found.');
  if (!opts.admin && exercise.status !== 'PUBLISHED') throw new NotFoundError('Exercise not found.');
  // Best-effort view counter (don't block on it).
  prisma.codeExercise.update({ where: { id: exercise.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  return exercise;
}

export async function getExerciseById(id: number) {
  const exercise = await prisma.codeExercise.findUnique({ where: { id }, include: EXERCISE_DETAIL_INCLUDE });
  if (!exercise) throw new NotFoundError('Exercise not found.');
  return exercise;
}

// ─── List / search ──────────────────────────────────────────────

export interface ExerciseFilters {
  trackId?: number;
  moduleId?: number;
  groupId?: number;
  language?: string;
  difficulty?: CodeDifficulty;
  status?: CodeStatus;
  search?: string;
  sort?: 'newest' | 'popular' | 'difficulty';
  page?: number;
  limit?: number;
}

export async function listExercises(filters: ExerciseFilters = {}) {
  const { trackId, moduleId, groupId, language, difficulty, status = 'PUBLISHED', search, sort = 'newest' } = filters;
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
  const skip = (page - 1) * limit;

  const q = search?.trim();
  if (q) {
    const conds: Prisma.Sql[] = [Prisma.sql`e.search_vector @@ websearch_to_tsquery('simple', ${q})`];
    if (status) conds.push(Prisma.sql`e.status::text = ${status}`);
    if (trackId) conds.push(Prisma.sql`e.track_id = ${trackId}`);
    if (moduleId) conds.push(Prisma.sql`e.module_id = ${moduleId}`);
    if (groupId) conds.push(Prisma.sql`e.track_id IN (SELECT id FROM code_tracks WHERE group_id = ${groupId})`);
    if (language) conds.push(Prisma.sql`e.language = ${language}`);
    if (difficulty) conds.push(Prisma.sql`e.difficulty::text = ${difficulty}`);
    const whereSql = Prisma.join(conds, ' AND ');

    const [idRows, countRows] = await Promise.all([
      prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
        SELECT e.id FROM code_exercises e
        WHERE ${whereSql}
        ORDER BY ts_rank(e.search_vector, websearch_to_tsquery('simple', ${q})) DESC, e.solve_count DESC, e.created_at DESC
        LIMIT ${limit} OFFSET ${skip}
      `),
      prisma.$queryRaw<Array<{ count: bigint }>>(Prisma.sql`SELECT COUNT(*)::bigint AS count FROM code_exercises e WHERE ${whereSql}`),
    ]);
    const total = Number(countRows[0]?.count ?? 0);
    const ids = idRows.map((r) => r.id);
    if (!ids.length) return { exercises: [], total, page, limit, totalPages: Math.ceil(total / limit) };

    const found = await prisma.codeExercise.findMany({ where: { id: { in: ids } }, include: EXERCISE_DETAIL_INCLUDE });
    const byId = new Map(found.map((e) => [e.id, e]));
    const ordered = ids.map((id) => byId.get(id)).filter((e): e is (typeof found)[number] => !!e);
    return { exercises: ordered, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  const where: Prisma.CodeExerciseWhereInput = {};
  if (status) where.status = status;
  if (trackId) where.trackId = trackId;
  if (moduleId) where.moduleId = moduleId;
  if (groupId) where.track = { groupId };
  if (language) where.language = language;
  if (difficulty) where.difficulty = difficulty;

  const orderBy: Prisma.CodeExerciseOrderByWithRelationInput =
    sort === 'popular' ? { solveCount: 'desc' } : sort === 'difficulty' ? { difficulty: 'asc' } : { createdAt: 'desc' };

  const [exercises, total] = await Promise.all([
    prisma.codeExercise.findMany({ where, skip, take: limit, orderBy, include: EXERCISE_DETAIL_INCLUDE }),
    prisma.codeExercise.count({ where }),
  ]);
  return { exercises, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/** Lightweight autocomplete: matching tracks + exercises for the search box.
 *  Uses a PREFIX tsquery ("rect" → matches "Rectangle") built from the query's
 *  word tokens, so partial typing surfaces results. */
export async function autocomplete(query: string, limit = 8) {
  const q = query.trim();
  if (!q) return { tracks: [], exercises: [] };
  // Sanitize into a prefix tsquery: alnum tokens joined by ' & ', each with :*.
  const tokens = q.toLowerCase().match(/[a-z0-9]+/g) || [];
  const tsq = tokens.length ? tokens.map((t) => `${t}:*`).join(' & ') : null;
  const [tracks, exRows] = await Promise.all([
    prisma.codeTrack.findMany({
      where: { status: 'PUBLISHED', name: { contains: q, mode: 'insensitive' } },
      select: { id: true, name: true, slug: true, language: true, color: true },
      take: limit,
      orderBy: { sortOrder: 'asc' },
    }),
    tsq
      ? prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
          SELECT e.id FROM code_exercises e
          WHERE e.status = 'PUBLISHED' AND e.search_vector @@ to_tsquery('simple', ${tsq})
          ORDER BY ts_rank(e.search_vector, to_tsquery('simple', ${tsq})) DESC
          LIMIT ${limit}
        `)
      : Promise.resolve([] as Array<{ id: number }>),
  ]);
  const ids = exRows.map((r) => r.id);
  const exFound = ids.length
    ? await prisma.codeExercise.findMany({
        where: { id: { in: ids } },
        select: { id: true, title: true, slug: true, difficulty: true, language: true, trackId: true, track: { select: { slug: true } } },
      })
    : [];
  const byId = new Map(exFound.map((e) => [e.id, e]));
  const exercises = ids.map((id) => byId.get(id)).filter(Boolean);
  return { tracks, exercises };
}

// ─── Progress ───────────────────────────────────────────────────

export async function upsertProgress(
  userId: number,
  exerciseId: number,
  data: { status?: 'IN_PROGRESS' | 'SOLVED'; savedCode?: unknown },
) {
  const exercise = await prisma.codeExercise.findUnique({ where: { id: exerciseId }, select: { id: true } });
  if (!exercise) throw new NotFoundError('Exercise not found.');

  const prev = await prisma.codeProgress.findUnique({
    where: { uk_code_progress_user_exercise: { userId, exerciseId } },
    select: { status: true },
  });
  const nextStatus = data.status ?? prev?.status ?? 'IN_PROGRESS';
  const savedCode = data.savedCode !== undefined ? normalizeCodeBlocks(data.savedCode) : undefined;
  const solvedAt = nextStatus === 'SOLVED' ? new Date() : null;

  const progress = await prisma.codeProgress.upsert({
    where: { uk_code_progress_user_exercise: { userId, exerciseId } },
    create: { userId, exerciseId, status: nextStatus, savedCode: savedCode ?? Prisma.JsonNull, solvedAt },
    update: {
      status: nextStatus,
      ...(savedCode !== undefined ? { savedCode } : {}),
      solvedAt: nextStatus === 'SOLVED' ? (prev?.status === 'SOLVED' ? undefined : solvedAt) : null,
    },
  });

  // Bump the denormalised solve counter only on the FIRST transition to SOLVED.
  if (nextStatus === 'SOLVED' && prev?.status !== 'SOLVED') {
    await prisma.codeExercise.update({ where: { id: exerciseId }, data: { solveCount: { increment: 1 } } }).catch(() => {});
  }
  return progress;
}

/** Map of the current user's progress, optionally scoped to one track. */
export async function getMyProgress(userId: number, trackId?: number) {
  const rows = await prisma.codeProgress.findMany({
    where: { userId, ...(trackId ? { exercise: { trackId } } : {}) },
    select: { exerciseId: true, status: true, solvedAt: true, savedCode: true },
  });
  return rows;
}

export async function getMyProgressForExercise(userId: number, exerciseId: number) {
  return prisma.codeProgress.findUnique({ where: { uk_code_progress_user_exercise: { userId, exerciseId } } });
}

// ─── Stats + bulk import ────────────────────────────────────────

export async function getStats() {
  const [groups, tracks, modules, exercises, solved] = await Promise.all([
    prisma.codeGroup.count(),
    prisma.codeTrack.count(),
    prisma.codeModule.count(),
    prisma.codeExercise.count(),
    prisma.codeProgress.count({ where: { status: 'SOLVED' } }),
  ]);
  const byDifficulty = await prisma.codeExercise.groupBy({ by: ['difficulty'], _count: true });
  return { groups, tracks, modules, exercises, solved, byDifficulty };
}

export interface BulkExerciseItem extends Omit<ExerciseInput, 'moduleId'> {
  moduleId?: number;
  moduleSlug?: string;
  trackSlug?: string;
}

/** Import an array of exercises. Each item resolves its module by id, or by
 *  (trackSlug + moduleSlug), or falls back to a shared defaultModuleId. */
export async function bulkImportExercises(
  items: BulkExerciseItem[],
  defaultModuleId: number | undefined,
  authorId?: number | null,
) {
  const results: Array<{ title: string; ok: boolean; id?: number; error?: string }> = [];
  for (const item of items) {
    try {
      let moduleId = item.moduleId ?? defaultModuleId;
      if (!moduleId && item.trackSlug && item.moduleSlug) {
        const track = await prisma.codeTrack.findUnique({ where: { slug: item.trackSlug }, select: { id: true } });
        if (track) {
          const mod = await prisma.codeModule.findFirst({
            where: { trackId: track.id, slug: item.moduleSlug },
            select: { id: true },
          });
          moduleId = mod?.id;
        }
      }
      if (!moduleId) throw new Error('No module resolved (need moduleId or trackSlug+moduleSlug).');
      const created = await createExercise({ ...item, moduleId }, authorId);
      results.push({ title: item.title, ok: true, id: created.id });
    } catch (e: any) {
      results.push({ title: item.title, ok: false, error: e?.message || 'failed' });
    }
  }
  return { total: items.length, created: results.filter((r) => r.ok).length, results };
}


// ─── Skill coverage ─────────────────────────────────────────────
/**
 * Which skills a learner has actually exercised in one track.
 *
 * Progress bars per exercise say "how far through the list am I"; they do not
 * say "what am I still bad at". Grouping by the tags an exercise carries answers
 * the second question, which is the one that decides whether you pass.
 *
 * Counts every PUBLISHED exercise in the track, so the denominator does not move
 * when a draft is added.
 */
export interface SkillCoverage {
  skill: string;
  total: number;
  solved: number;
  inProgress: number;
}

export async function getSkillCoverage(trackSlug: string, userId?: number | null): Promise<{
  track: { id: number; name: string; slug: string };
  skills: SkillCoverage[];
  totalExercises: number;
  solvedExercises: number;
}> {
  const track = await prisma.codeTrack.findUnique({
    where: { slug: trackSlug },
    select: { id: true, name: true, slug: true },
  });
  if (!track) throw new NotFoundError('Track not found.');

  const exercises = await prisma.codeExercise.findMany({
    where: { trackId: track.id, status: 'PUBLISHED' },
    select: { id: true, tags: true, concepts: true },
  });

  const progress = userId
    ? await prisma.codeProgress.findMany({
        where: { userId, exercise: { trackId: track.id } },
        select: { exerciseId: true, status: true },
      })
    : [];
  const byExercise = new Map(progress.map((p) => [p.exerciseId, p.status]));

  // A skill label is a tag, falling back to concepts when an exercise has no
  // tags at all. Track-wide labels ("lab211", "fptu") carry no information about
  // what you can do, so they are dropped.
  const IGNORE = new Set(['lab211', 'fptu', 'java', 'basic', 'beginner']);
  const buckets = new Map<string, SkillCoverage>();

  for (const ex of exercises) {
    const tags = strArray(ex.tags).map((t) => t.toLowerCase().trim());
    const labels = (tags.length ? tags : strArray(ex.concepts).map((c) => c.toLowerCase().trim()))
      .filter((t) => t && !IGNORE.has(t));
    const status = byExercise.get(ex.id);

    for (const label of new Set(labels)) {
      const b = buckets.get(label) ?? { skill: label, total: 0, solved: 0, inProgress: 0 };
      b.total++;
      if (status === 'SOLVED') b.solved++;
      else if (status === 'IN_PROGRESS') b.inProgress++;
      buckets.set(label, b);
    }
  }

  const skills = [...buckets.values()]
    // Weakest first: that is the list you should act on.
    .sort((a, b) => (a.solved / a.total) - (b.solved / b.total) || b.total - a.total);

  return {
    track,
    skills,
    totalExercises: exercises.length,
    solvedExercises: exercises.filter((e) => byExercise.get(e.id) === 'SOLVED').length,
  };
}
