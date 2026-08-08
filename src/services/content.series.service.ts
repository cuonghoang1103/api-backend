/**
 * Series generation for the Content Studio.
 *
 * ── The problem ──────────────────────────────────────────────
 * Recording a whole Academy subject means one video per lesson.
 * CEA201 alone has 20 chapters / ~50 lessons. Creating those one
 * at a time through the "New project" modal is fifty rounds of
 * typing a title that already exists in the database.
 *
 * So: read the outline that is already there (a course's
 * sections → lessons, or a project's milestones), and mint one
 * ContentProject per item, pre-bound to its source.
 *
 * ── Why an "outline" abstraction ─────────────────────────────
 * Courses and Projects have different shapes but the generator
 * needs the same three things from both: an ordered list, a
 * title per item, and a grouping label. Normalising here keeps
 * the route and the UI from branching on source type all the way
 * down.
 */
import { Prisma, ContentType, ContentStatus } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { ensureUniqueContentSlug } from './content.service.js';

/** Titles across this codebase are stored bilingually as
 *  "EN|||VI". Split once, here, so no caller has to remember. */
function splitTitle(raw: string): { en: string; vi: string } {
  const [en, vi] = raw.split('|||');
  return { en: (en ?? raw).trim(), vi: (vi ?? en ?? raw).trim() };
}

export interface OutlineItem {
  /** Stable key for React + for dedupe against existing projects. */
  key: string;
  /** Grouping label — chapter title for a course, phase for a project. */
  groupEn: string;
  groupVi: string;
  titleEn: string;
  titleVi: string;
  /** Position across the WHOLE outline, 1-based. Becomes the
   *  episode number, so it must be continuous across groups. */
  ordinal: number;
  /** Lessons flagged QUIZ are still returned — the UI filters them
   *  by default but the user may want to record a quiz walkthrough. */
  kind: string;
}

export interface Outline {
  sourceType: 'course' | 'project';
  sourceSlug: string;
  sourceTitleEn: string;
  sourceTitleVi: string;
  /** Suggested series name, pre-filled in the generator. */
  suggestedSeries: string;
  items: OutlineItem[];
}

// ─── Outline readers ─────────────────────────────────────────────────────────

export async function getCourseOutline(slug: string): Promise<Outline> {
  const course = await prisma.course.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      courseCode: true,
      sections: {
        orderBy: { sortOrder: 'asc' },
        select: {
          title: true,
          sortOrder: true,
          lessons: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, title: true, sortOrder: true, lessonType: true },
          },
        },
      },
    },
  });
  if (!course) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

  const t = splitTitle(course.title);
  const items: OutlineItem[] = [];
  let ordinal = 0;

  for (const section of course.sections) {
    const g = splitTitle(section.title);
    for (const lesson of section.lessons) {
      const lt = splitTitle(lesson.title);
      ordinal += 1;
      items.push({
        key: `lesson-${lesson.id}`,
        groupEn: g.en,
        groupVi: g.vi,
        titleEn: lt.en,
        titleVi: lt.vi,
        ordinal,
        kind: lesson.lessonType,
      });
    }
  }

  return {
    sourceType: 'course',
    sourceSlug: course.slug,
    sourceTitleEn: t.en,
    sourceTitleVi: t.vi,
    suggestedSeries: [course.courseCode, t.vi].filter(Boolean).join(' · '),
    items,
  };
}

export async function getProjectOutline(slug: string): Promise<Outline> {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      milestones: {
        orderBy: { order: 'asc' },
        select: { id: true, phase: true, title: true, order: true },
      },
    },
  });
  if (!project) throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');

  const t = splitTitle(project.title);
  const items: OutlineItem[] = project.milestones.map((m, i) => {
    const mt = splitTitle(m.title);
    return {
      key: `milestone-${m.id}`,
      groupEn: m.phase,
      groupVi: m.phase,
      titleEn: mt.en,
      titleVi: mt.vi,
      ordinal: i + 1,
      kind: 'MILESTONE',
    };
  });

  return {
    sourceType: 'project',
    sourceSlug: project.slug,
    sourceTitleEn: t.en,
    sourceTitleVi: t.vi,
    suggestedSeries: t.vi,
    items,
  };
}

// ─── Bulk create ─────────────────────────────────────────────────────────────

export interface BulkItemInput {
  title: string;
  /** Chapter / phase label → stored as `lessonRef`. */
  lessonRef?: string | null;
  episodeNumber?: number | null;
}

export interface BulkCreateInput {
  items: BulkItemInput[];
  type?: unknown;
  status?: unknown;
  seriesName?: string | null;
  courseSlug?: string | null;
  courseTitle?: string | null;
  projectSlug?: string | null;
  targetDurationSec?: number | null;
  scriptLang?: unknown;
  /** Optional skeleton written into every new project's `script`. */
  scriptTemplate?: string | null;
}

export interface BulkCreateResult {
  created: Array<{ id: number; title: string; episodeNumber: number | null }>;
  /** Titles skipped because a project with that title already exists
   *  in the same series — see the dedupe note below. */
  skipped: string[];
}

const isValidType = (v: unknown): v is ContentType =>
  typeof v === 'string' && (Object.values(ContentType) as string[]).includes(v);
const isValidStatus = (v: unknown): v is ContentStatus =>
  typeof v === 'string' && (Object.values(ContentStatus) as string[]).includes(v);

/**
 * Create one project per outline item.
 *
 * ── Dedupe ───────────────────────────────────────────────────
 * Generating the same series twice is a realistic mistake: you
 * add three lessons to a course and re-run the generator to pick
 * them up. So we skip any item whose title already exists within
 * the same `seriesName` (or, with no series, the same
 * `courseSlug`). The result reports what was skipped rather than
 * failing — "added the 3 new ones, left the 20 existing alone" is
 * the behaviour you want.
 *
 * Slugs are allocated one at a time because
 * `ensureUniqueContentSlug` queries the table per candidate; doing
 * that inside a transaction would hold a write lock for the whole
 * batch. Creating 50 rows in a loop is fast enough (a few hundred
 * ms) and keeps each row independent — a failure part-way leaves
 * the successful ones in place, which for a generator is better
 * than all-or-nothing.
 */
export async function bulkCreateProjects(input: BulkCreateInput): Promise<BulkCreateResult> {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) {
    throw new AppError('No items to create', 400, 'NO_ITEMS');
  }
  // A whole degree programme is ~50 lessons per subject; 200 is far
  // above any single generate and keeps a malformed request from
  // minting thousands of rows.
  if (items.length > 200) {
    throw new AppError('Too many items (max 200)', 400, 'TOO_MANY_ITEMS');
  }

  const type = isValidType(input.type) ? input.type : ContentType.LECTURE;
  const status = isValidStatus(input.status) ? input.status : ContentStatus.IDEA;
  const seriesName = input.seriesName?.trim() || null;
  const courseSlug = input.courseSlug?.trim() || null;
  const courseTitle = input.courseTitle?.trim() || null;
  const projectSlug = input.projectSlug?.trim() || null;
  const scriptLang = input.scriptLang === 'EN' ? 'EN' : 'VI';
  const script = typeof input.scriptTemplate === 'string' && input.scriptTemplate.trim()
    ? input.scriptTemplate
    : null;
  const targetDurationSec =
    typeof input.targetDurationSec === 'number' && input.targetDurationSec > 0
      ? Math.trunc(input.targetDurationSec)
      : null;

  // Existing titles in this series/course, lowercased for comparison.
  const where: Prisma.ContentProjectWhereInput = seriesName
    ? { seriesName }
    : courseSlug
      ? { courseSlug }
      : projectSlug
        ? { projectSlug }
        : {};
  const existing = Object.keys(where).length
    ? await prisma.contentProject.findMany({ where, select: { title: true } })
    : [];
  const taken = new Set(existing.map((p) => p.title.trim().toLowerCase()));

  const created: BulkCreateResult['created'] = [];
  const skipped: string[] = [];

  for (const item of items) {
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    if (!title) continue;
    if (taken.has(title.toLowerCase())) {
      skipped.push(title);
      continue;
    }
    taken.add(title.toLowerCase());

    const slug = await ensureUniqueContentSlug(title);
    const row = await prisma.contentProject.create({
      data: {
        title,
        slug,
        type,
        status,
        script,
        seriesName,
        courseSlug,
        courseTitle,
        projectSlug,
        targetDurationSec,
        scriptLang,
        lessonRef: item.lessonRef?.trim() || null,
        episodeNumber:
          typeof item.episodeNumber === 'number' && item.episodeNumber > 0
            ? Math.trunc(item.episodeNumber)
            : null,
        // Same as the single-create path: seed an empty performance
        // row so the editor's Performance tab has something to bind to.
        performance: { create: {} },
      },
      select: { id: true, title: true, episodeNumber: true },
    });
    created.push(row);
  }

  return { created, skipped };
}
