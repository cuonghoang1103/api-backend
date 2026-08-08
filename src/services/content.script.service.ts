/**
 * Script history + reusable script templates for the Content
 * Studio (/creator).
 *
 * ── The problem this solves ──────────────────────────────────
 * `ContentProject.script` is overwritten by the editor's
 * debounced autosave roughly every 1.2 seconds. That is the
 * right behaviour while writing and the wrong behaviour an hour
 * later, when you want back the three paragraphs you deleted.
 *
 * A *version* is an explicit, immutable snapshot of the script at
 * a moment the user (or the system) considered meaningful. It is
 * never written by autosave. The four origins:
 *
 *   MANUAL    the user pressed "Lưu phiên bản"
 *   TEMPLATE  a template was applied on top of a non-empty script
 *   RESTORE   taken automatically *before* restoring an older
 *             version — this is what makes restore itself undoable
 *   AUTO      reserved for future milestone snapshots
 *
 * Version numbers are per-project, start at 1, and are never
 * reused, so "v7" keeps meaning the same snapshot even after
 * older versions are pruned.
 */
import { Prisma, ContentType } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/** Origins accepted from callers. See the block comment above. */
export const SCRIPT_VERSION_ORIGINS = ['MANUAL', 'TEMPLATE', 'RESTORE', 'AUTO'] as const;
export type ScriptVersionOrigin = (typeof SCRIPT_VERSION_ORIGINS)[number];

/**
 * Hard cap on retained versions per project.
 *
 * Scripts are long — a 20-minute lecture script runs ~3000 words
 * (~18KB) — and a user who habitually hits "save version" would
 * otherwise grow one project's history without bound. When the
 * cap is exceeded we drop the OLDEST rows. 60 snapshots is far
 * more history than a single video ever needs while staying
 * under ~1MB of text per project in the worst case.
 */
const MAX_VERSIONS_PER_PROJECT = 60;

/** Words, the same way the editor's stats footer counts them:
 * split on any whitespace run, ignore leading/trailing space. */
export function countWords(text: string | null | undefined): number {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function normaliseOrigin(value: unknown): ScriptVersionOrigin {
  return (SCRIPT_VERSION_ORIGINS as readonly string[]).includes(value as string)
    ? (value as ScriptVersionOrigin)
    : 'MANUAL';
}

// ─── Versions ────────────────────────────────────────────────────────────────

/**
 * List a project's versions, newest first.
 *
 * `script` is deliberately EXCLUDED from the list payload — the
 * history sidebar only renders label / origin / word count /
 * timestamp, and shipping 60 full script bodies would make the
 * panel several megabytes. The body is fetched per-version by
 * `getScriptVersion` when the user previews or restores one.
 */
export async function listScriptVersions(contentProjectId: number) {
  return prisma.contentScriptVersion.findMany({
    where: { contentProjectId },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      label: true,
      wordCount: true,
      origin: true,
      createdAt: true,
    },
  });
}

export async function getScriptVersion(contentProjectId: number, versionId: number) {
  const found = await prisma.contentScriptVersion.findFirst({
    where: { id: versionId, contentProjectId },
  });
  if (!found) throw new AppError('Script version not found', 404, 'SCRIPT_VERSION_NOT_FOUND');
  return found;
}

/**
 * Snapshot the project's CURRENT script.
 *
 * Returns `null` when the script is empty — snapshotting nothing
 * is never useful and would let a stray click bury real history
 * under blank rows. Callers treat null as "nothing to do".
 *
 * The read of `max(version)` and the insert run in one
 * transaction so two rapid saves can't both claim the same
 * number; the unique index is the backstop if they somehow do.
 */
export async function createScriptVersion(
  contentProjectId: number,
  opts: { label?: string | null; origin?: unknown; script?: string | null } = {},
) {
  const project = await prisma.contentProject.findUnique({
    where: { id: contentProjectId },
    select: { id: true, script: true },
  });
  if (!project) throw new AppError('Content project not found', 404, 'CONTENT_NOT_FOUND');

  // The client may pass the in-editor text so a snapshot captures
  // what is on screen right now, even if the debounce hasn't
  // flushed yet. Falling back to the stored column keeps the
  // endpoint usable from anywhere else.
  const body = typeof opts.script === 'string' ? opts.script : project.script;
  if (!body || !body.trim()) return null;

  const label = typeof opts.label === 'string' && opts.label.trim()
    ? opts.label.trim().slice(0, 160)
    : null;

  const created = await prisma.$transaction(async (tx) => {
    const latest = await tx.contentScriptVersion.findFirst({
      where: { contentProjectId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    return tx.contentScriptVersion.create({
      data: {
        contentProjectId,
        version: (latest?.version ?? 0) + 1,
        label,
        script: body,
        wordCount: countWords(body),
        origin: normaliseOrigin(opts.origin),
      },
    });
  });

  await pruneVersions(contentProjectId);
  return created;
}

/** Drop the oldest rows once a project exceeds the retention cap. */
async function pruneVersions(contentProjectId: number): Promise<void> {
  const total = await prisma.contentScriptVersion.count({ where: { contentProjectId } });
  if (total <= MAX_VERSIONS_PER_PROJECT) return;

  const stale = await prisma.contentScriptVersion.findMany({
    where: { contentProjectId },
    orderBy: { version: 'asc' },
    take: total - MAX_VERSIONS_PER_PROJECT,
    select: { id: true },
  });
  if (stale.length === 0) return;
  await prisma.contentScriptVersion.deleteMany({
    where: { id: { in: stale.map((v) => v.id) } },
  });
}

/**
 * Restore an older version onto the live script.
 *
 * Before overwriting we snapshot whatever is currently live with
 * origin RESTORE, so "restore" is never a one-way door: the state
 * you restored *away from* is always the newest entry in history.
 */
export async function restoreScriptVersion(contentProjectId: number, versionId: number) {
  const target = await getScriptVersion(contentProjectId, versionId);

  await createScriptVersion(contentProjectId, {
    origin: 'RESTORE',
    label: `Trước khi khôi phục v${target.version}`,
  });

  const updated = await prisma.contentProject.update({
    where: { id: contentProjectId },
    data: { script: target.script },
    select: { id: true, script: true, updatedAt: true },
  });

  return { project: updated, restoredFrom: target.version };
}

export async function deleteScriptVersion(contentProjectId: number, versionId: number) {
  await getScriptVersion(contentProjectId, versionId); // 404s if it isn't ours
  await prisma.contentScriptVersion.delete({ where: { id: versionId } });
}

// ─── Templates ───────────────────────────────────────────────────────────────

const isValidContentType = (v: unknown): v is ContentType =>
  typeof v === 'string' && (Object.values(ContentType) as string[]).includes(v);

/**
 * List user-saved templates.
 *
 * Sorted by `order` then `useCount` desc: an explicit ordering
 * wins, and within the default order the templates actually
 * reached for float to the top. Built-in templates are NOT in
 * this table — they ship in the frontend bundle
 * (lib/studio-templates.ts) and are merged client-side.
 */
export async function listScriptTemplates(filterType?: unknown) {
  const where: Prisma.ScriptTemplateWhereInput = {};
  if (isValidContentType(filterType)) {
    // Generic templates (contentType null) are relevant to every
    // type, so they always come along with a filtered request.
    where.OR = [{ contentType: filterType }, { contentType: null }];
  }
  return prisma.scriptTemplate.findMany({
    where,
    orderBy: [{ order: 'asc' }, { useCount: 'desc' }, { createdAt: 'desc' }],
  });
}

function templateFields(body: Record<string, unknown>) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const text = (v: unknown, max: number): string | null => {
    if (typeof v !== 'string') return null;
    const t = v.trim();
    return t === '' ? null : t.slice(0, max);
  };
  return {
    name,
    nameEn: text(body.nameEn, 160),
    description: text(body.description, 500),
    descriptionEn: text(body.descriptionEn, 500),
    bodyEn: typeof body.bodyEn === 'string' && body.bodyEn.trim() ? body.bodyEn : null,
    contentType: isValidContentType(body.contentType) ? body.contentType : null,
    tags: Array.isArray(body.tags)
      ? (body.tags as unknown[]).filter((t): t is string => typeof t === 'string')
      : [],
  };
}

export async function createScriptTemplate(body: Record<string, unknown>) {
  const fields = templateFields(body);
  if (!fields.name) throw new AppError('Template name is required', 400, 'NAME_REQUIRED');

  const templateBody = typeof body.body === 'string' ? body.body : '';
  if (!templateBody.trim()) {
    throw new AppError('Template body is required', 400, 'BODY_REQUIRED');
  }

  return prisma.scriptTemplate.create({
    data: {
      ...fields,
      body: templateBody,
      order: typeof body.order === 'number' ? body.order : 0,
    },
  });
}

export async function updateScriptTemplate(id: number, body: Record<string, unknown>) {
  const existing = await prisma.scriptTemplate.findUnique({ where: { id } });
  if (!existing) throw new AppError('Template not found', 404, 'TEMPLATE_NOT_FOUND');

  const data: Prisma.ScriptTemplateUpdateInput = {};
  const fields = templateFields(body);

  // Partial update: only fields actually present in the body move.
  if (body.name !== undefined) {
    if (!fields.name) throw new AppError('Template name is required', 400, 'NAME_REQUIRED');
    data.name = fields.name;
  }
  if (body.nameEn !== undefined) data.nameEn = fields.nameEn;
  if (body.description !== undefined) data.description = fields.description;
  if (body.descriptionEn !== undefined) data.descriptionEn = fields.descriptionEn;
  if (body.bodyEn !== undefined) data.bodyEn = fields.bodyEn;
  if (body.contentType !== undefined) data.contentType = fields.contentType;
  if (body.tags !== undefined) data.tags = fields.tags;
  if (body.order !== undefined && typeof body.order === 'number') data.order = body.order;
  if (body.body !== undefined) {
    const nextBody = typeof body.body === 'string' ? body.body : '';
    if (!nextBody.trim()) throw new AppError('Template body is required', 400, 'BODY_REQUIRED');
    data.body = nextBody;
  }

  return prisma.scriptTemplate.update({ where: { id }, data });
}

export async function deleteScriptTemplate(id: number) {
  const existing = await prisma.scriptTemplate.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new AppError('Template not found', 404, 'TEMPLATE_NOT_FOUND');
  await prisma.scriptTemplate.delete({ where: { id } });
}

/** Bump `useCount` when a template is applied. Best-effort: a
 * failure here must never block the apply, so the caller ignores
 * the result. */
export async function bumpTemplateUse(id: number) {
  return prisma.scriptTemplate.update({
    where: { id },
    data: { useCount: { increment: 1 } },
    select: { id: true, useCount: true },
  });
}

// ─── Academy reference picker ────────────────────────────────────────────────

/**
 * Feed the "what is this video about?" pickers in the create
 * modal and the Overview tab.
 *
 * Returns published Academy courses and their exams in one call —
 * the picker is a single dialog and two round-trips would make it
 * flash. Payload is intentionally minimal (id/slug/title/code),
 * which keeps the whole catalogue well under the size where
 * pagination would start to matter.
 *
 * Exam titles are stored bilingually as "EN|||VI"; we split and
 * hand back both sides so the picker can label itself in whichever
 * language the studio is currently displaying.
 */
export async function listAcademyRefs() {
  const [courses, exams] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      orderBy: [{ academyType: 'asc' }, { courseCode: 'asc' }, { title: 'asc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        courseCode: true,
        academyType: true,
        semesterId: true,
      },
    }),
    prisma.exam.findMany({
      orderBy: [{ courseId: 'asc' }, { kind: 'asc' }, { code: 'asc' }],
      select: {
        id: true,
        courseId: true,
        kind: true,
        peType: true,
        code: true,
        title: true,
      },
    }),
  ]);

  const splitTitle = (raw: string) => {
    const [en, vi] = raw.split('|||');
    return {
      titleEn: (en ?? raw).trim(),
      titleVi: (vi ?? en ?? raw).trim(),
    };
  };

  return {
    courses,
    exams: exams.map((e) => ({
      id: e.id,
      courseId: e.courseId,
      kind: e.kind,
      peType: e.peType,
      code: e.code,
      ...splitTitle(e.title),
    })),
  };
}
