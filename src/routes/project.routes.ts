import { Router, type Response, type Request } from 'express';
import crypto from 'node:crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { config } from '../config/env.js';
import { renderProjectMarkdown } from '../services/projectMarkdown.service.js';
import { buildProjectsFeed } from '../services/projectRss.service.js';
import type { ApiResponse } from '../types/index.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
// Public include shape — what's served on /api/v1/projects/*
// ─────────────────────────────────────────────────────────────
// All relations are optional and gracefully empty when not
// configured; the public detail page treats every child as
// optional and renders the corresponding section only if
// the array is non-empty.
const PUBLIC_INCLUDE = {
 skills: { include: { skill: true } },
 milestones: { orderBy: { order: 'asc' as const } },
 features: { orderBy: { order: 'asc' as const } },
 resources: { orderBy: { order: 'asc' as const } },
 listItems: { orderBy: { order: 'asc' as const } },
};

function normalizeProject(project: Record<string, unknown>) {
 const rawImages = project.images;
 let images: string[] = [];
 if (typeof rawImages === 'string' && rawImages.trim()) {
 try {
 images = JSON.parse(rawImages);
 if (!Array.isArray(images)) images = [];
 } catch { images = []; }
 } else if (Array.isArray(rawImages)) {
 images = rawImages;
 }

 const rawTechStack = project.techStack;
 let technologies: string[] = [];
 if (typeof rawTechStack === 'string' && rawTechStack.trim()) {
 technologies = rawTechStack.split(',').map((t: string) => t.trim()).filter(Boolean);
 } else if (Array.isArray(rawTechStack)) {
 technologies = rawTechStack;
 }

 const rawFeatured = (project as Record<string, unknown>).isFeatured;
 const isFeatured = typeof rawFeatured === 'boolean' ? rawFeatured : false;

 // Don't leak admin-only fields to the public. The public
 // routes only ever see published projects, so isPublished
 // is noise — and we never want the raw markdown source
 // (bodyMdx) or the schema code (schemaCode) on the wire
 // to anonymous clients. Admin routes use a different
 // shape (ADMIN_PROJECT_INCLUDE) that includes everything.
 const {
 isPublished: _omitPublished,
 bodyMdx: _omitBodyMdx,
 schemaCode: _omitSchemaCode,
 schemaLang: _omitSchemaLang,
 ...rest
 } = project as Record<string, unknown> & {
 isPublished?: boolean;
 bodyMdx?: string | null;
 schemaCode?: string | null;
 schemaLang?: string | null;
 };

 return {
 ...rest,
 isFeatured,
 featured: isFeatured,
 technologies,
 images,
 };
}

// ─────────────────────────────────────────────────────────────
// Lazy bodyHtml backfill
// ─────────────────────────────────────────────────────────────
// If a project has bodyMdx but bodyHtml is empty/stale, we
// render on first read and persist the result. This means
// projects that pre-date Phase 2 still work without
// forcing the admin to open and re-save each one.

async function ensureBodyHtml(project: {
 id: number;
 bodyMdx: string | null;
 bodyHtml: string | null;
}): Promise<string | null> {
 if (!project.bodyMdx || !project.bodyMdx.trim()) return null;
 if (project.bodyHtml && project.bodyHtml.trim()) return project.bodyHtml;

 try {
 const html = renderProjectMarkdown(project.bodyMdx);
 await prisma.project.update({
 where: { id: project.id },
 data: { bodyHtml: html },
 });
 return html;
 } catch (err) {
 // Rendering failure shouldn't fail the read — return the
 // raw mdx so the client can try its fallback renderer.
 console.error('[projects] lazy backfill failed for', project.id, err);
 return null;
 }
}

// ─── GET /api/v1/projects ─────────────────────────────
router.get('/', async (req, res: Response<ApiResponse>, next) => {
 try {
 const { page = 1, size = 12, keyword, status, category, difficulty } = req.query;
 const pageNum = Math.max(1, parseInt(String(page), 10));
 const sizeNum = Math.min(100, Math.max(1, parseInt(String(size), 10)));
 const skip = (pageNum - 1) * sizeNum;
 const where: Record<string, unknown> = { isPublished: true };
 if (keyword) {
 where.OR = [
 { title: { contains: String(keyword), mode: 'insensitive' } },
 { description: { contains: String(keyword), mode: 'insensitive' } },
 ];
 }
 if (status) where.status = String(status);
 if (category) where.category = String(category);
 if (difficulty) where.difficulty = String(difficulty);

 const [projects, total] = await Promise.all([
 prisma.project.findMany({
 where,
 skip,
 take: sizeNum,
 orderBy: { createdAt: 'desc' },
 include: PUBLIC_INCLUDE,
 }),
 prisma.project.count({ where }),
 ]);

 const normalizedProjects = projects.map((p) => normalizeProject(p as unknown as Record<string, unknown>));

 res.json({
 success: true,
 data: normalizedProjects,
 pagination: {
 page: pageNum,
 limit: sizeNum,
 total,
 totalPages: Math.ceil(total / sizeNum),
 },
 });
 } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/featured ─────────────────────
router.get('/featured', async (req, res: Response<ApiResponse>, next) => {
 try {
 const { size = 6 } = req.query;
 const projects = await prisma.project.findMany({
 where: { isFeatured: true, isPublished: true },
 take: parseInt(String(size), 10),
 orderBy: { createdAt: 'desc' },
 include: PUBLIC_INCLUDE,
 });
 const normalized = projects.map((p) => normalizeProject(p as unknown as Record<string, unknown>));
 res.json({ success: true, data: normalized });
 } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/search ───────────────────────
// Full-text search across title (weight A), description
// (weight B), and bodyMdx (weight C). Uses Postgres'
// `simple` text config so Vietnamese content works
// without a custom dictionary.
//
// We return a lightweight summary rather than the full
// project record so the search results page can render
// 20+ hits cheaply. Each result includes a `snippet`
// field with the first match context (~160 chars before
// and after the first hit in bodyMdx) so the UI can show
// a "matched near…" hint without re-rendering the whole
// markdown.
router.get('/search', async (req, res: Response<ApiResponse>, next): Promise<void> => {
 try {
 const { q, category, difficulty, size = '20' } = req.query;
 const query = String(q ?? '').trim();
 const sizeNum = Math.min(50, Math.max(1, parseInt(String(size), 10)));

 if (!query) {
 res.json({ success: true, data: { results: [], total: 0, query: '' } });
 return;
 }

 // We use websearch_to_tsquery because it handles
 // user-typed queries gracefully (no need to pre-escape
 // operators). For multi-word queries it ANDs the
 // tokens, which matches user expectations.
 const filters: Record<string, unknown> = {
 isPublished: true,
 };
 if (category) filters.category = String(category);
 if (difficulty) filters.difficulty = String(difficulty);

 // Single round-trip: get ranked hits + counts + first
 // hit context. We use $1 / $2 placeholders rather than
 // Prisma's template syntax to keep the SQL readable;
 // the values are still parameterised so SQL injection
 // is not a concern.
 const hits = await prisma.$queryRawUnsafe<
 Array<{
 id: number;
 slug: string;
 title: string;
 description: string | null;
 thumbnailUrl: string | null;
 category: string | null;
 difficulty: string | null;
 viewCount: number;
 likeCount: number;
 rank: number;
 snippet: string | null;
 }>
 >(
 `SELECT
 p.id, p.slug, p.title, p.description, p.thumbnail_url,
 p.category, p.difficulty, p.view_count, p.like_count,
 ts_rank(p.search_vector, websearch_to_tsquery('simple', $1)) AS rank,
 ts_headline(
 'simple',
 -- Concat title + body + description with E'\\n' so ts_headline
 -- can pick matches from any of the three sources that contribute
 -- to the search_vector index. We prefer bodyMdx for context
 -- because it has the most text, but we always include title so
 -- short queries like "ai" still produce a visible <mark> even
 -- when bodyMdx is null. MaxFragments=2 lets us see up to two
 -- separate match windows when the query is multi-word.
 concat_ws(E'\\n', p.title, coalesce(p.body_mdx, ''), coalesce(p.description, '')),
 websearch_to_tsquery('simple', $1),
 'StartSel=<mark>, StopSel=</mark>, MaxWords=25, MinWords=10, MaxFragments=2, ShortWord=2'
 ) AS snippet
 FROM projects p
 WHERE p.is_published = true
 AND p.search_vector @@ websearch_to_tsquery('simple', $1)
 ${category ? 'AND p.category = $2' : ''}
 ${difficulty ? `AND p.difficulty = $${category ? '3' : '2'}` : ''}
 ORDER BY rank DESC, p.created_at DESC
 LIMIT ${sizeNum}`,
 ...[
 query,
 ...(category ? [String(category)] : []),
 ...(difficulty ? [String(difficulty)] : []),
 ],
 );

 const total = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
 `SELECT count(*)::bigint AS count FROM projects p
 WHERE p.is_published = true
 AND p.search_vector @@ websearch_to_tsquery('simple', $1)
 ${category ? 'AND p.category = $2' : ''}
 ${difficulty ? `AND p.difficulty = $${category ? '3' : '2'}` : ''}`,
 ...[
 query,
 ...(category ? [String(category)] : []),
 ...(difficulty ? [String(difficulty)] : []),
 ],
 );

 res.json({
 success: true,
 data: {
 results: hits.map((h) => ({ ...h, rank: Number(h.rank) })),
 total: Number(total[0]?.count ?? 0),
 query,
 },
 });
 } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/feed.xml ─────────────────────
// RSS 2.0 feed. Returns XML with `application/rss+xml`
// content-type so feed readers auto-detect the format.
// Placed BEFORE the /:slug route so Express doesn't
// capture "feed.xml" as a slug.
router.get('/feed.xml', async (_req, res, next) => {
 try {
 const xml = await buildProjectsFeed(30);
 res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
 res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600');
 res.send(xml);
 } catch (error) { next(error); }
});

// ─── GET /api/v1/projects/:slug ───────────────────────
// Public detail. Hides drafts (isPublished=false). Fires a
// fire-and-forget viewCount++ so the counter doesn't slow
// the response. Lazy-renders bodyHtml from bodyMdx on first
// read.
router.get('/:slug', async (req, res: Response<ApiResponse>, next) => {
 try {
 const project = await prisma.project.findUnique({
 where: { slug: req.params.slug },
 include: PUBLIC_INCLUDE,
 });
 if (!project || !project.isPublished) {
 throw new AppError('Project not found', 404);
 }

 // Lazy backfill BEFORE returning so the first visitor
 // already gets the rendered HTML. This is a tiny render
 // (sub-millisecond for typical posts) so we await it.
 const bodyHtml = await ensureBodyHtml({
 id: project.id,
 bodyMdx: project.bodyMdx,
 bodyHtml: project.bodyHtml,
 });
 if (bodyHtml) {
 (project as Record<string, unknown>).bodyHtml = bodyHtml;
 }

 // Fire-and-forget view counter. Not awaited; we don't
 // want the read path to slow down on a counter bump.
 const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
 || req.socket.remoteAddress
 || '0.0.0.0';
 const botUA = /(bot|crawler|spider|preview|facebookexternalhit)/i.test(req.headers['user-agent'] ?? '');
 if (!botUA) {
 prisma.project.update({
 where: { id: project.id },
 data: { viewCount: { increment: 1 } },
 }).catch((err) => console.error('[projects] viewCount++ failed:', err));
 // ip kept available for future per-IP throttling; kept
 // out of logs to avoid noisy access logs.
 void ip;
 }

 const normalized = normalizeProject(project as unknown as Record<string, unknown>);
 res.json({ success: true, data: normalized });
 } catch (error) { next(error); }
});

// ─── POST /api/v1/projects/:slug/like ──────────────────
// Anonymous like. Idempotent per IP via HMAC-SHA256 hash,
// stored in project_likes. The likeCount column on
// projects is incremented only on first like from a given
// IP so the counter stays accurate.
router.post('/:slug/like', async (req: Request, res: Response<ApiResponse>, next): Promise<void> => {
 try {
 const project = await prisma.project.findUnique({
 where: { slug: req.params.slug },
 select: { id: true, isPublished: true, likeCount: true },
 });
 if (!project || !project.isPublished) {
 throw new AppError('Project not found', 404);
 }

 const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
 || req.socket.remoteAddress
 || '0.0.0.0';
 const ipHash = crypto
 .createHmac('sha256', config.signedUrlSecret)
 .update(ip)
 .digest('hex');

 // Try to insert; on duplicate, the unique constraint
 // rejects and we treat it as a successful no-op.
 let alreadyLiked = false;
 try {
 await prisma.projectLike.create({
 data: { projectId: project.id, ipHash },
 });
 } catch (err: unknown) {
 // Prisma error code P2002 = unique constraint violation
 if ((err as { code?: string })?.code === 'P2002') {
 alreadyLiked = true;
 } else {
 throw err;
 }
 }

 if (!alreadyLiked) {
 const updated = await prisma.project.update({
 where: { id: project.id },
 data: { likeCount: { increment: 1 } },
 select: { likeCount: true },
 });
 res.json({ success: true, data: { likeCount: updated.likeCount, alreadyLiked: false } });
 return;
 }

 res.json({ success: true, data: { likeCount: project.likeCount, alreadyLiked: true } });
 } catch (error) { next(error); }
});

// ─── POST /api/v1/projects/:slug/render ────────────────
// Admin-only: force a re-render of bodyHtml from bodyMdx.
// Use after editing markdown directly in the DB, or to
// recover from a corrupted cache.
router.post('/:slug/render', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
 try {
 const project = await prisma.project.findUnique({
 where: { slug: req.params.slug },
 select: { id: true, bodyMdx: true },
 });
 if (!project) throw new AppError('Project not found', 404);
 if (!project.bodyMdx) throw new AppError('Project has no bodyMdx to render', 400);

 const html = renderProjectMarkdown(project.bodyMdx);
 await prisma.project.update({
 where: { id: project.id },
 data: { bodyHtml: html },
 });
 res.json({ success: true, data: { bodyHtml: html } });
 } catch (error) { next(error); }
});

export default router;