/**
 * Content Creator admin API.
 *
 * Mounted at /api/v1/admin/content (see src/index.ts).
 *
 * All routes require an authenticated admin session — the
 * `authenticate` + `requireAdmin('ROLE_ADMIN')` middleware
 * pattern is identical to admin.routes.ts and the same
 * cookies/admin-role guard is reused.
 *
 * Endpoint inventory (Phase 2):
 * ── Projects (3) ────────────────────────────────────────
 * GET /projects — list (filter by ?status=&type=)
 * POST /projects — create
 * GET /projects/:id — full nested read
 * PUT /projects/:id — upsert (incl. all 6 child relations)
 * DELETE /projects/:id — cascade delete
 * PATCH /projects/:id/status — quick status change (kanban)
 *
 * ── Children (single-purpose, kept simple) ──────────────
 * The PUT /projects/:id endpoint above accepts the full
 * payload and runs an idempotent replaceChildren sync for
 * days/scenes/products/posts/checklistItems, so we do NOT
 * expose per-row POST/PUT/DELETE endpoints here. The editor
 * uses the single upsert call on every autosave.
 *
 * Why one PUT beats many child endpoints:
 * • The editor's debounced autosave already fires one HTTP
 * call per "save window" — splitting it into N calls would
 * only multiply the chance of partial failure.
 * • The `replaceChildren` helper is what guarantees "no
 * duplicates, no data loss" — the same list can be sent
 * repeatedly without side effects.
 * • One transaction = atomic. If anything fails, the project
 * stays in its previous state.
 */
import { Router, Response } from 'express';
import { Prisma, ContentStatus, ContentType } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import {
 ensureUniqueContentSlug,
 replaceChildren,
 toJsonInput,
 toDateOrNull,
} from '../services/content.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// All content routes are admin-only.
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

// ─── helpers ────────────────────────────────────────────────────────────────

function parseId(raw: string, label = 'id'): number {
 const n = parseInt(raw, 10);
 if (!Number.isFinite(n) || n <= 0) {
 throw new AppError(`Invalid ${label}`, 400, 'INVALID_ID');
 }
 return n;
}

/** Coerce an `unknown` body field to `string | null`.
 * Used heavily in the children-sync code so the call sites
 * stay short: `str(d.location)`. Empty strings also become
 * null so we don't pollute the DB with whitespace. */
function str(value: unknown): string | null {
 if (typeof value !== 'string') return null;
 const trimmed = value.trim();
 return trimmed === '' ? null : trimmed;
}

async function assertProject(id: number) {
 const p = await prisma.contentProject.findUnique({ where: { id }, select: { id: true } });
 if (!p) throw new AppError('Content project not found', 404, 'CONTENT_NOT_FOUND');
}

// Full nested include for the editor's GET-by-id response.
const FULL_INCLUDE = {
 days: {
 include: {
 scenes: { orderBy: { order: 'asc' as const } },
 },
 orderBy: { order: 'asc' as const },
 },
 affiliateProducts: { orderBy: { order: 'asc' as const } },
 platformPosts: { orderBy: { order: 'asc' as const } },
 checklistItems: { orderBy: { order: 'asc' as const } },
 performance: true,
} satisfies Prisma.ContentProjectInclude;

const LIGHT_INCLUDE = {
 _count: {
 select: {
 days: true,
 affiliateProducts: true,
 platformPosts: true,
 checklistItems: true,
 },
 },
} satisfies Prisma.ContentProjectInclude;

const isValidStatus = (v: unknown): v is ContentStatus =>
 typeof v === 'string' && (Object.values(ContentStatus) as string[]).includes(v);
const isValidType = (v: unknown): v is ContentType =>
 typeof v === 'string' && (Object.values(ContentType) as string[]).includes(v);

/**
 * Project-level field normalisation. Mirrors the way
 * admin.routes.ts handles PUT /projects/:id: every field is
 * optional, undefined means "leave alone", null means
 * "clear", everything else means "set". Strings are trimmed
 * and defaulted to the previous value.
 */
function buildProjectPatch(body: Record<string, unknown>, existing: { title: string; slug: string }) {
 const out: Record<string, unknown> = {};

 if (body.title !== undefined) {
 const t = typeof body.title === 'string' ? body.title.trim() : '';
 if (!t) throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
 out.title = t;
 }
 if (body.concept !== undefined) out.concept = body.concept ?? null;
 if (body.mainHook !== undefined) out.mainHook = body.mainHook ?? null;
 if (body.thumbnailUrl !== undefined) out.thumbnailUrl = body.thumbnailUrl ?? null;
 if (body.type !== undefined) {
 if (body.type === null || body.type === '') {
 out.type = ContentType.OTHER;
 } else if (!isValidType(body.type)) {
 throw new AppError('Invalid type', 400, 'INVALID_TYPE');
 } else {
 out.type = body.type;
 }
 }
 if (body.status !== undefined) {
 if (body.status === null || body.status === '') {
 out.status = ContentStatus.IDEA;
 } else if (!isValidStatus(body.status)) {
 throw new AppError('Invalid status', 400, 'INVALID_STATUS');
 } else {
 out.status = body.status;
 }
 }
 if (body.ideaDate !== undefined) out.ideaDate = toDateOrNull(body.ideaDate);
 if (body.filmDate !== undefined) out.filmDate = toDateOrNull(body.filmDate);
 if (body.publishDate !== undefined) out.publishDate = toDateOrNull(body.publishDate);
 if (body.tags !== undefined) {
 out.tags = Array.isArray(body.tags)
 ? (body.tags as unknown[]).filter((t): t is string => typeof t === 'string')
 : [];
 }
 if (body.referenceLinks !== undefined) {
 const j = toJsonInput(body.referenceLinks);
 if (!j.ok) throw new AppError(`referenceLinks: ${j.reason}`, 400, 'INVALID_JSON');
 out.referenceLinks = j.value === null ? Prisma.JsonNull : (j.value as Prisma.InputJsonValue);
 }
 // Ensure title default for slug derivation.
 if (out.title === undefined) out.title = existing.title;
 return out as { title: string } & Record<string, unknown>;
}

// ─── GET /projects ─────────────────────────────────────────────────────────
router.get('/projects', async (req, res: Response<ApiResponse>, next) => {
 try {
 const where: Prisma.ContentProjectWhereInput = {};
 if (typeof req.query.status === 'string' && isValidStatus(req.query.status)) {
 where.status = req.query.status;
 }
 if (typeof req.query.type === 'string' && isValidType(req.query.type)) {
 where.type = req.query.type;
 }
 if (typeof req.query.q === 'string' && req.query.q.trim()) {
 where.OR = [
 { title: { contains: req.query.q.trim(), mode: 'insensitive' } },
 { concept: { contains: req.query.q.trim(), mode: 'insensitive' } },
 ];
 }

 const items = await prisma.contentProject.findMany({
 where,
 orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
 include: LIGHT_INCLUDE,
 });
 res.json({ success: true, data: items });
 } catch (error) { next(error); }
});

// ─── POST /projects ────────────────────────────────────────────────────────
router.post('/projects', async (req, res: Response<ApiResponse>, next) => {
 try {
 const { title, type, status, concept, mainHook, thumbnailUrl, ideaDate, filmDate, publishDate, tags, referenceLinks } = req.body ?? {};
 if (typeof title !== 'string' || !title.trim()) {
 throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
 }
 const slug = await ensureUniqueContentSlug(title);

 const json = (() => {
 if (referenceLinks === undefined) return undefined;
 const j = toJsonInput(referenceLinks);
 if (!j.ok) throw new AppError(`referenceLinks: ${j.reason}`, 400, 'INVALID_JSON');
 return j.value === null ? Prisma.JsonNull : (j.value as Prisma.InputJsonValue);
 })();

 const created = await prisma.contentProject.create({
 data: {
 title: title.trim(),
 slug,
 concept: concept ?? null,
 mainHook: mainHook ?? null,
 thumbnailUrl: thumbnailUrl ?? null,
 type: isValidType(type) ? type : ContentType.OTHER,
 status: isValidStatus(status) ? status : ContentStatus.IDEA,
 ideaDate: toDateOrNull(ideaDate),
 filmDate: toDateOrNull(filmDate),
 publishDate: toDateOrNull(publishDate),
 tags: Array.isArray(tags) ? (tags as unknown[]).filter((t): t is string => typeof t === 'string') : [],
 referenceLinks: json === undefined ? Prisma.JsonNull : json,
 },
 include: FULL_INCLUDE,
 });
 res.status(201).json({ success: true, data: created });
 } catch (error) { next(error); }
});

// ─── GET /projects/:id ─────────────────────────────────────────────────────
router.get('/projects/:id', async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const project = await prisma.contentProject.findUnique({
 where: { id },
 include: FULL_INCLUDE,
 });
 if (!project) throw new AppError('Content project not found', 404, 'CONTENT_NOT_FOUND');
 res.json({ success: true, data: project });
 } catch (error) { next(error); }
});

// ─── PUT /projects/:id — full upsert ────────────────────────────────────────
router.put('/projects/:id', async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 const existing = await prisma.contentProject.findUnique({ where: { id } });
 if (!existing) throw new AppError('Content project not found', 404, 'CONTENT_NOT_FOUND');

 const body = (req.body ?? {}) as Record<string, unknown>;
 const patch = buildProjectPatch(body, existing);

 // Re-slug if the title actually changed.
 let slug = existing.slug;
 if (typeof patch.title === 'string' && patch.title !== existing.title) {
 slug = await ensureUniqueContentSlug(patch.title, id);
 }
 patch.slug = slug;

 // ── Children sync ──
 // Each `replaceChildren` runs against the parent. We collect
 // them in a single prisma.$transaction to keep the upsert
 // atomic — if any child write fails the parent fields are
 // rolled back too.
 const { days, affiliateProducts, platformPosts, checklistItems } = body as {
 days?: Array<Record<string, unknown>>;
 affiliateProducts?: Array<Record<string, unknown>>;
 platformPosts?: Array<Record<string, unknown>>;
 checklistItems?: Array<Record<string, unknown>>;
 };

 // Pre-validate enum fields so a bad payload throws *before*
 // we open a transaction.
 if (Array.isArray(days)) {
 for (const d of days) {
 if (d.scenes && !Array.isArray(d.scenes)) {
 throw new AppError('days[].scenes must be an array', 400, 'INVALID_CHILD_SHAPE');
 }
 }
 }

 await prisma.$transaction(async (tx) => {
 // Project-level update.
 await tx.contentProject.update({ where: { id }, data: patch });

 // Days (+ nested scenes) — has to be sequential because
 // scene.sync needs the freshly-created day ids.
 if (Array.isArray(days)) {
 // Delete days not in payload (cascade kills scenes).
 const existingDays = await tx.productionDay.findMany({
 where: { contentProjectId: id },
 select: { id: true },
 });
 const keepIds = new Set<number>();
 for (const d of days) {
 if (d.id == null) continue;
 const n = typeof d.id === 'string' ? parseInt(d.id, 10) : (d.id as number);
 if (Number.isFinite(n) && n > 0) keepIds.add(n);
 }
 const toDelete = existingDays.map((d) => d.id).filter((did) => !keepIds.has(did));
 if (toDelete.length > 0) {
 await tx.productionDay.deleteMany({ where: { id: { in: toDelete } } });
 }

 for (let i = 0; i < days.length; i += 1) {
 const d = days[i];
 const order = i;
 const numericId =
 d.id == null
 ? null
 : typeof d.id === 'string'
 ? parseInt(d.id, 10)
 : (d.id as number);

 const data = {
 contentProjectId: id,
 dayNumber: typeof d.dayNumber === 'number' ? d.dayNumber : i + 1,
 date: toDateOrNull(d.date),
 location: str(d.location),
 notes: str(d.notes),
 order,
 };

 let dayId: number;
 if (numericId && existingDays.some((x) => x.id === numericId)) {
 const updated = await tx.productionDay.update({ where: { id: numericId }, data });
 dayId = updated.id;
 } else {
 const created = await tx.productionDay.create({ data });
 dayId = created.id;
 }

 // Scenes for this day.
 if (Array.isArray(d.scenes)) {
 await syncScenes(tx, dayId, d.scenes as Array<Record<string, unknown>>);
 }
 }
 }

 if (Array.isArray(affiliateProducts)) {
 await replaceChildren({
 delegate: tx.affiliateProduct as unknown as Parameters<typeof replaceChildren>[0]['delegate'],
 parentWhere: { contentProjectId: id },
 items: affiliateProducts as Array<{ id?: number | string | null } & Record<string, unknown>>,
 // `url` is a required column on `affiliate_products`
 // (VarChar(500) NOT NULL). The editor may still save a
 // product the user hasn't linked yet, so we coerce empty
 // strings to '' rather than null to keep the DB happy.
 createData: (p, order) => ({
 contentProjectId: id,
 name: typeof p.name === 'string' ? p.name : '',
 url: typeof p.url === 'string' ? p.url : '',
 discountCode: p.discountCode ?? null,
 commissionPercent:
 typeof p.commissionPercent === 'number' ? p.commissionPercent : null,
 revenue: typeof p.revenue === 'number' ? p.revenue : null,
 notes: p.notes ?? null,
 order,
 }),
 updateData: (p, order) => ({
 name: typeof p.name === 'string' ? p.name : '',
 url: typeof p.url === 'string' ? p.url : '',
 discountCode: p.discountCode ?? null,
 commissionPercent:
 typeof p.commissionPercent === 'number' ? p.commissionPercent : null,
 revenue: typeof p.revenue === 'number' ? p.revenue : null,
 notes: p.notes ?? null,
 order,
 }),
 });
 }

 if (Array.isArray(platformPosts)) {
 await replaceChildren({
 delegate: tx.platformPost as unknown as Parameters<typeof replaceChildren>[0]['delegate'],
 parentWhere: { contentProjectId: id },
 items: platformPosts as Array<{ id?: number | string | null } & Record<string, unknown>>,
 createData: (p, order) => ({
 contentProjectId: id,
 platform: typeof p.platform === 'string' ? p.platform : 'TIKTOK',
 caption: p.caption ?? null,
 hashtags: Array.isArray(p.hashtags)
 ? (p.hashtags as unknown[]).filter((h): h is string => typeof h === 'string')
 : [],
 scheduledTime: toDateOrNull(p.scheduledTime),
 postUrl: p.postUrl ?? null,
 isPublished: Boolean(p.isPublished),
 order,
 }),
 updateData: (p, order) => ({
 platform: typeof p.platform === 'string' ? p.platform : 'TIKTOK',
 caption: p.caption ?? null,
 hashtags: Array.isArray(p.hashtags)
 ? (p.hashtags as unknown[]).filter((h): h is string => typeof h === 'string')
 : [],
 scheduledTime: toDateOrNull(p.scheduledTime),
 postUrl: p.postUrl ?? null,
 isPublished: Boolean(p.isPublished),
 order,
 }),
 });
 }

 if (Array.isArray(checklistItems)) {
 await replaceChildren({
 delegate: tx.checklistItem as unknown as Parameters<typeof replaceChildren>[0]['delegate'],
 parentWhere: { contentProjectId: id },
 items: checklistItems as Array<{ id?: number | string | null } & Record<string, unknown>>,
 createData: (c, order) => ({
 contentProjectId: id,
 phase: typeof c.phase === 'string' ? c.phase : 'PRE',
 label: typeof c.label === 'string' ? c.label : '',
 done: Boolean(c.done),
 order,
 }),
 updateData: (c, order) => ({
 phase: typeof c.phase === 'string' ? c.phase : 'PRE',
 label: typeof c.label === 'string' ? c.label : '',
 done: Boolean(c.done),
 order,
 }),
 });
 }
 });

 const fresh = await prisma.contentProject.findUnique({
 where: { id },
 include: FULL_INCLUDE,
 });
 res.json({ success: true, data: fresh });
 } catch (error) { next(error); }
});

// Local helper for scene sync — uses the same upsert/insert
// pattern as the day loop. Kept in-file (not the service)
// because it has to share the transaction with its parent.
async function syncScenes(
 tx: Prisma.TransactionClient,
 dayId: number,
 scenes: Array<Record<string, unknown>>,
) {
 const existing = await tx.scene.findMany({
 where: { productionDayId: dayId },
 select: { id: true },
 });
 const existingIds = new Set(existing.map((s) => s.id));
 const keepIds = new Set<number>();

 for (const s of scenes) {
 if (s.id == null) continue;
 const n = typeof s.id === 'string' ? parseInt(s.id, 10) : (s.id as number);
 if (Number.isFinite(n) && n > 0) keepIds.add(n);
 }

 const toDelete = [...existingIds].filter((sid) => !keepIds.has(sid));
 if (toDelete.length > 0) {
 await tx.scene.deleteMany({ where: { id: { in: toDelete } } });
 }

 for (let i = 0; i < scenes.length; i += 1) {
 const s = scenes[i];
 const order = i;
 const numericId =
 s.id == null
 ? null
 : typeof s.id === 'string'
 ? parseInt(s.id, 10)
 : (s.id as number);

 const data = {
 productionDayId: dayId,
 sceneNumber: typeof s.sceneNumber === 'number' ? s.sceneNumber : i + 1,
 sceneType: (typeof s.sceneType === 'string' ? s.sceneType : 'BODY') as Prisma.SceneCreateInput['sceneType'],
 dialogue: str(s.dialogue),
 voiceover: str(s.voiceover),
 action: str(s.action),
 cameraAngle: str(s.cameraAngle),
 shotType: typeof s.shotType === 'string' ? s.shotType as Prisma.SceneCreateInput['shotType'] : null,
 // Schema defines `props` as a single comma-separated string
 // (VarChar(300)), not a list. We accept either shape from
 // the client and normalise here so the editor's UI can be
 // either a chip input or a text input.
 props: (() => {
 if (Array.isArray(s.props)) {
 const filtered = (s.props as unknown[]).filter((x): x is string => typeof x === 'string');
 return filtered.length > 0 ? filtered.join(', ') : null;
 }
 return str(s.props);
 })(),
 brollNotes: str(s.brollNotes),
 editingNotes: str(s.editingNotes),
 durationSeconds: typeof s.durationSeconds === 'number' ? s.durationSeconds : null,
 storyboardImageUrl: str(s.storyboardImageUrl),
 order,
 };

 if (numericId && existingIds.has(numericId)) {
 await tx.scene.update({ where: { id: numericId }, data });
 } else {
 await tx.scene.create({ data });
 }
 }
}

// ─── PATCH /projects/:id/status — kanban drag-drop ─────────────────────────
router.patch('/projects/:id/status', async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 const { status } = req.body ?? {};
 if (!isValidStatus(status)) {
 throw new AppError('Invalid status', 400, 'INVALID_STATUS');
 }
 const updated = await prisma.contentProject.update({
 where: { id },
 data: { status },
 include: LIGHT_INCLUDE,
 });
 res.json({ success: true, data: updated });
 } catch (error) { next(error); }
});

// ─── DELETE /projects/:id ───────────────────────────────────────────────────
router.delete('/projects/:id', async (req, res: Response<ApiResponse>, next) => {
 try {
 const id = parseId(req.params.id);
 await assertProject(id);
 await prisma.contentProject.delete({ where: { id } });
 res.json({ success: true, message: 'Content project deleted' });
 } catch (error) { next(error); }
});

export default router;
