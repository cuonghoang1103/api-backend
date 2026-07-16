import { Router, type Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { renderArticle } from '../services/techTrendsRenderer.service.js';
import {
  generateDraft,
  structureFixBug,
  enrichMeta,
  rewriteBody,
  aiStatus,
  summarizeArticle,
  explainCode,
  answerQuestion,
  type RagDoc,
  TECH_TREND_CATEGORIES,
  type TechTrendCategory,
} from '../services/techTrends/ai.service.js';
import { isProEffective } from '../services/pro.service.js';

/**
 * Tech Trends & Insights — public + admin REST API
 *
 * This file exports TWO routers so the mount points in
 * src/index.ts can split them clearly:
 *
 *   - `publicRouter`  → mounted at /api/v1/tech-trends
 *     (read-only, no auth)
 *   - `adminRouter`   → mounted at /api/v1/admin/tech-trends
 *     (full CRUD, ROLE_ADMIN only)
 *
 * Endpoints
 * ─────────
 * Public
 *   GET  /api/v1/tech-trends/categories
 *   GET  /api/v1/tech-trends/articles
 *   GET  /api/v1/tech-trends/articles/:id
 *
 * Admin
 *   GET    /api/v1/admin/tech-trends
 *   POST   /api/v1/admin/tech-trends
 *   PUT    /api/v1/admin/tech-trends/:id
 *   DELETE /api/v1/admin/tech-trends/:id
 *   POST   /api/v1/admin/tech-trends/:id/publish
 *   POST   /api/v1/admin/tech-trends/:id/unpublish
 *
 * The slug field is auto-derived from the title with a
 * numeric suffix on collision. Slug is preserved across
 * edits that don't change the title, so existing links
 * stay stable.
 */

const CATEGORIES = ['TechNews', 'FixBug', 'Experience', 'Interviews'] as const;
type Category = (typeof CATEGORIES)[number];

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureUniqueSlug(baseValue: string, excludeId?: number): Promise<string> {
  const baseSlug = slugify(baseValue) || `article-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.techTrendArticle.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix++}`;
  }
}

/**
 * Render Markdown to HTML + extract TOC for persistence.
 * Called on every write so the cached `bodyHtml` stays in sync
 * with `bodyMdx`. We intentionally cap bodyMdx at ~100KB so
 * a runaway admin pasting a novel doesn't blow up the row.
 */
const MAX_BODY_MDX = 100 * 1024;
function renderBodyMdx(mdx: unknown): { bodyMdx: string | null; bodyHtml: string | null; toc: Prisma.InputJsonValue } {
  if (mdx == null) {
    // Explicit null = clear the rich body. Legacy `body` column
    // remains untouched so existing paragraphs still render.
    // Cast to InputJsonValue so we can either write a JSON
    // array (TocItem[]) or set DB NULL via Prisma.JsonNull.
    return {
      bodyMdx: null,
      bodyHtml: null,
      toc: Prisma.JsonNull as unknown as Prisma.InputJsonValue,
    };
  }
  if (typeof mdx !== 'string') {
    throw new AppError('bodyMdx phai la chuoi', 400, 'INVALID_BODY_MDX');
  }
  if (mdx.length > MAX_BODY_MDX) {
    throw new AppError(`bodyMdx qua dai (toi da ${MAX_BODY_MDX} ky tu)`, 400, 'BODY_MDX_TOO_LONG');
  }
  if (mdx.trim().length === 0) {
    return { bodyMdx: '', bodyHtml: '', toc: [] as unknown as Prisma.InputJsonValue };
  }
  const { html, toc } = renderArticle(mdx);
  return { bodyMdx: mdx, bodyHtml: html, toc: toc as unknown as Prisma.InputJsonValue };
}

const authorInclude = {
  author: {
    select: {
      id: true,
      username: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
    },
  },
} as const;

// Normalize for the public response: prefer the cached
// rich-body fields (bodyHtml + toc) over the legacy `body`
// JsonB column. Legacy articles without bodyMdx fall back to
// joining the paragraph array into a <p>...</p> string so
// the public page still renders something readable.
function serializeForPublic(article: Record<string, unknown>) {
  const bodyMdx = (article.bodyMdx as string | null | undefined) ?? null;
  const bodyHtml = (article.bodyHtml as string | null | undefined) ?? null;
  const toc = (article.toc as unknown) ?? null;
  let html = bodyHtml;
  if (!html) {
    const legacy = article.body as unknown;
    if (Array.isArray(legacy)) {
      // Last-resort fallback for articles written before the
      // TipTap migration. Sanitise each paragraph and wrap in
      // <p>. Safe because we never inject HTML.
      html = (legacy as string[])
        .map((p) => String(p).replace(/</g, '&lt;').replace(/>/g, '&gt;'))
        .map((p) => `<p>${p}</p>`)
        .join('\n');
    } else {
      html = '';
    }
  }
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    // New public read surface: rich body + TOC. `bodyMdx` is
    // intentionally NOT exposed here — only admins need it
    // (they get it via the admin endpoint below).
    bodyHtml: html,
    bodyMdx,
    toc: Array.isArray(toc) ? toc : [],
    category: article.category,
    coverEmoji: article.coverEmoji,
    coverImageUrl: article.coverImageUrl,
    codeBlock: article.codeBlock ?? null,
    tags: (article.tags as string[]) ?? [],
    trendingScore: article.trendingScore,
    isFeatured: article.isFeatured,
    status: article.status,
    readTimeMin: article.readTimeMin,
    author: article.author ?? null,
    viewCount: article.viewCount ?? 0,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}

// ─── Public Router ─────────────────────────────────────────────────────

const publicRouter = Router();

// GET /api/v1/tech-trends/categories
// Returns the 4 fixed categories with their published-article
// counts. The frontend uses this to render the category
// tab bar with live counts.
publicRouter.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const grouped = await prisma.techTrendArticle.groupBy({
      by: ['category'],
      where: { status: 'PUBLISHED' },
      _count: { _all: true },
    });
    const counts = new Map(grouped.map((g) => [g.category, g._count._all]));

    const data = CATEGORIES.map((c) => ({
      id: c,
      label: c,
      count: counts.get(c) ?? 0,
    }));

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tech-trends/articles
// Paginated, filterable, sortable. Public — only PUBLISHED
// rows are returned. We expose a large default page (size
// = 100) because the frontend does its own bento-grid
// ordering and client-side search; with a small dataset
// one round trip is enough.
publicRouter.get('/articles', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(0, parseInt(req.query.page as string) || 0);
    const size = Math.min(100, Math.max(1, parseInt(req.query.size as string) || 100));
    const skip = page * size;

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (req.query.category && CATEGORIES.includes(req.query.category as Category)) {
      where.category = req.query.category;
    }
    if (req.query.featured === 'true') {
      where.isFeatured = true;
    }
    if (req.query.q) {
      const kw = String(req.query.q);
      where.OR = [
        { title: { contains: kw, mode: 'insensitive' } },
        { summary: { contains: kw, mode: 'insensitive' } },
        { tags: { has: kw } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.techTrendArticle.findMany({
        where,
        skip,
        take: size,
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: authorInclude,
      }),
      prisma.techTrendArticle.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles.map((a) => serializeForPublic(a as unknown as Record<string, unknown>)),
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tech-trends/articles/by-slug/:slug
// Single article read by slug — powers the SSR detail page at
// /tech-trends/[slug]. Increments viewCount (fire-and-forget so
// a transient DB issue never breaks the read). Only PUBLISHED
// articles are exposed publicly. This is the canonical public
// read surface for a single article (the numeric `:id` variant
// below is kept for back-compat).
publicRouter.get('/articles/by-slug/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug || '').trim();
    if (!slug) {
      throw new AppError('Invalid article slug', 400, 'INVALID_SLUG');
    }

    const article = await prisma.techTrendArticle.findUnique({
      where: { slug },
      include: authorInclude,
    });
    if (!article || article.status !== 'PUBLISHED') {
      throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    }

    prisma.techTrendArticle
      .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    res.json({ success: true, data: serializeForPublic(article as unknown as Record<string, unknown>) });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/tech-trends/articles/:id
// Single article read. Increments viewCount (fire-and-forget
// so a transient DB issue never breaks the read).
publicRouter.get('/articles/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid article id', 400, 'INVALID_ID');
    }

    const article = await prisma.techTrendArticle.findUnique({
      where: { id },
      include: authorInclude,
    });
    if (!article || article.status !== 'PUBLISHED') {
      throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    }

    prisma.techTrendArticle
      .update({ where: { id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    res.json({ success: true, data: serializeForPublic(article as unknown as Record<string, unknown>) });
  } catch (error) {
    next(error);
  }
});

// ─── Reader AI (PRO-gated) ─────────────────────────────────────────────
// Reader-facing AI on the public article surface. These REQUIRE auth (to
// identify the user) and Pro entitlement (same line the CV / Interview AI
// uses). Non-Pro / anonymous → 403 with a friendly message the UI turns
// into a /pro upsell. Reuses the interview LLM gateway (no new infra).

const PRO_MESSAGE =
  'Trợ lý AI đọc bài dành cho tài khoản Pro. Nâng cấp tại /pro để dùng TL;DR, hỏi đáp và giải thích code.';

async function assertReaderPro(req: unknown): Promise<number> {
  const userId = (req as { userId?: number }).userId ?? null;
  if (!userId || !(await isProEffective(userId))) {
    throw new AppError(PRO_MESSAGE, 403, 'PRO_REQUIRED');
  }
  return userId;
}

const STOPWORDS = new Set([
  'the', 'and', 'for', 'với', 'các', 'này', 'khi', 'nào', 'gì', 'sao', 'thế', 'như', 'một',
  'that', 'this', 'what', 'how', 'why', 'when', 'là', 'của', 'trong', 'được', 'cho', 'có',
]);

function extractKeywords(q: string): string[] {
  const words = (q.toLowerCase().match(/[\p{L}\p{N}#.+-]{3,}/gu) ?? []).filter((w) => !STOPWORDS.has(w));
  return [...new Set(words)].slice(0, 6);
}

// GET /api/v1/tech-trends/ai/status — auth required; tells the UI whether to
// show reader-AI controls (available = key present, isPro = entitled).
publicRouter.get('/ai/status', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = (req as unknown as { userId?: number }).userId ?? null;
    const isPro = userId ? await isProEffective(userId) : false;
    res.json({ success: true, data: { available: aiStatus().available, isPro } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/tech-trends/articles/:id/tldr — Pro. Summarize one article.
publicRouter.post('/articles/:id/tldr', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = await assertReaderPro(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid article id', 400, 'INVALID_ID');
    const article = await prisma.techTrendArticle.findUnique({ where: { id }, select: { title: true, bodyHtml: true, body: true, status: true } });
    if (!article || article.status !== 'PUBLISHED') throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    const text = article.bodyHtml || (Array.isArray(article.body) ? (article.body as string[]).join('\n') : '');
    const data = await summarizeArticle({ title: article.title, text, userId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/tech-trends/articles/:id/explain-code — Pro. Explain the
// article's Before/After code block.
publicRouter.post('/articles/:id/explain-code', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = await assertReaderPro(req);
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new AppError('Invalid article id', 400, 'INVALID_ID');
    const article = await prisma.techTrendArticle.findUnique({ where: { id }, select: { codeBlock: true, status: true } });
    if (!article || article.status !== 'PUBLISHED') throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    const cb = article.codeBlock as { before?: { lang?: string; lines?: string[] }; after?: { lang?: string; lines?: string[] } } | null;
    if (!cb) throw new AppError('Bài viết này không có khối code', 400, 'NO_CODE_BLOCK');
    const lang = cb.before?.lang || cb.after?.lang || 'code';
    const code =
      `// Before\n${(cb.before?.lines ?? []).join('\n')}\n\n// After\n${(cb.after?.lines ?? []).join('\n')}`;
    const data = await explainCode({ code, lang, userId });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/tech-trends/ask — Pro. Answer a question grounded in the
// published article corpus (lightweight ILIKE retrieval; no vector index).
publicRouter.post('/ask', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const userId = await assertReaderPro(req);
    const question = String((req.body as { question?: unknown }).question ?? '').trim();
    if (!question) throw new AppError('Cần nhập câu hỏi', 400, 'QUESTION_REQUIRED');

    const keys = extractKeywords(question);
    const or: Record<string, unknown>[] = keys.length
      ? keys.flatMap((k) => [
          { title: { contains: k, mode: 'insensitive' } },
          { summary: { contains: k, mode: 'insensitive' } },
          { tags: { has: k } },
        ])
      : [{ title: { contains: question, mode: 'insensitive' } }, { summary: { contains: question, mode: 'insensitive' } }];

    const found = await prisma.techTrendArticle.findMany({
      where: { status: 'PUBLISHED', OR: or },
      orderBy: [{ trendingScore: 'desc' }, { viewCount: 'desc' }],
      take: 5,
      select: { id: true, slug: true, title: true, summary: true, bodyHtml: true },
    });

    const docs: RagDoc[] = found.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      snippet: `${a.summary}\n${a.bodyHtml ?? ''}`,
    }));

    const data = await answerQuestion({ question, docs, userId });
    res.json({
      success: true,
      data: { ...data, sources: found.map((a) => ({ id: a.id, slug: a.slug, title: a.title })) },
    });
  } catch (error) {
    next(error);
  }
});

// ─── Admin Router ──────────────────────────────────────────────────────

const adminRouter = Router();

// All admin routes require ROLE_ADMIN. Apply once at the
// router level so we don't repeat the middleware on each
// route definition.
adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

// GET /api/v1/admin/tech-trends
// Full list including drafts, paginated, filterable.
adminRouter.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = Math.max(0, parseInt(req.query.page as string) || 0);
    const size = Math.min(100, Math.max(1, parseInt(req.query.size as string) || 20));
    const skip = page * size;

    const where: Record<string, unknown> = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.category && CATEGORIES.includes(req.query.category as Category)) {
      where.category = req.query.category;
    }
    if (req.query.q) {
      const kw = String(req.query.q);
      where.OR = [
        { title: { contains: kw, mode: 'insensitive' } },
        { summary: { contains: kw, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.techTrendArticle.findMany({
        where,
        skip,
        take: size,
        orderBy: { updatedAt: 'desc' },
        include: authorInclude,
      }),
      prisma.techTrendArticle.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: { page, limit: size, total, totalPages: Math.ceil(total / size) },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends
adminRouter.post('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const {
      title,
      summary,
      body,
      bodyMdx,
      category,
      coverEmoji,
      coverImageUrl,
      codeBlock,
      tags,
      trendingScore,
      isFeatured,
      status,
      readTimeMin,
      publishedAt,
    } = req.body as Record<string, unknown>;

    if (!title?.toString().trim()) throw new AppError('Title is required', 400, 'TITLE_REQUIRED');
    if (!summary?.toString().trim()) throw new AppError('Summary is required', 400, 'SUMMARY_REQUIRED');
    if (!category || !CATEGORIES.includes(category as Category)) {
      throw new AppError('Category must be one of: TechNews, FixBug, Experience, Interviews', 400, 'INVALID_CATEGORY');
    }
    // Tier 1A — accept either the new bodyMdx (TipTap markdown)
    // OR the legacy `body` (paragraph array). If both are sent
    // we prefer bodyMdx (the canonical source going forward).
    if (bodyMdx == null && !Array.isArray(body)) {
      throw new AppError('bodyMdx (string) hoac body (array) phai co it nhat 1', 400, 'INVALID_BODY');
    }

    const slug = await ensureUniqueSlug(String(title));
    const normalizedStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    const shouldPublish = normalizedStatus === 'PUBLISHED';

    // Render bodyMdx → HTML + TOC. The legacy `body` JsonB
    // column is kept for back-compat with articles written
    // before this migration.
    const rendered = renderBodyMdx(bodyMdx);

    const article = await prisma.techTrendArticle.create({
      data: {
        title: String(title).trim(),
        slug,
        summary: String(summary).trim(),
        body: (Array.isArray(body) ? body : []) as unknown as Prisma.InputJsonValue,
        bodyMdx: rendered.bodyMdx,
        bodyHtml: rendered.bodyHtml,
        toc: rendered.toc,
        category: String(category),
        coverEmoji: coverEmoji ? String(coverEmoji).slice(0, 16) : null,
        coverImageUrl: coverImageUrl ? String(coverImageUrl).slice(0, 500) : null,
        codeBlock: codeBlock && typeof codeBlock === 'object' ? (codeBlock as Prisma.InputJsonValue) : Prisma.JsonNull,
        tags: Array.isArray(tags) ? (tags as string[]).map((t) => String(t).trim()).filter(Boolean) : [],
        trendingScore: Number.isFinite(Number(trendingScore)) ? Math.max(0, Math.min(100, Number(trendingScore))) : 0,
        isFeatured: Boolean(isFeatured),
        status: normalizedStatus,
        readTimeMin: Number.isFinite(Number(readTimeMin)) ? Math.max(1, Math.min(60, Number(readTimeMin))) : 5,
        authorId: (req as unknown as { userId?: number }).userId ?? null,
        publishedAt: shouldPublish ? (publishedAt ? new Date(String(publishedAt)) : new Date()) : null,
      },
      include: authorInclude,
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/admin/tech-trends/:id
adminRouter.put('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid article id', 400, 'INVALID_ID');
    }

    const existing = await prisma.techTrendArticle.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    }

    const {
      title,
      summary,
      body,
      bodyMdx,
      category,
      coverEmoji,
      coverImageUrl,
      codeBlock,
      tags,
      trendingScore,
      isFeatured,
      status,
      readTimeMin,
      publishedAt,
    } = req.body as Record<string, unknown>;

    // Re-derive slug only on title change so existing
    // links stay stable across edits that don't touch
    // the title.
    let nextSlug = existing.slug;
    if (title && String(title).trim() !== existing.title) {
      nextSlug = await ensureUniqueSlug(String(title), id);
    }

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = String(title).trim();
    if (summary !== undefined) data.summary = String(summary).trim();
    // Legacy body field. Kept for back-compat — new admin UI
    // sends `bodyMdx` instead.
    if (body !== undefined) {
      if (!Array.isArray(body)) {
        throw new AppError('Body phai la array (legacy)', 400, 'INVALID_BODY');
      }
      data.body = body as unknown as Prisma.InputJsonValue;
    }
    // Tier 1A — re-render bodyMdx → bodyHtml + TOC whenever
    // the admin sends a new bodyMdx. Sending `null` clears it.
    if (bodyMdx !== undefined) {
      const rendered = renderBodyMdx(bodyMdx);
      data.bodyMdx = rendered.bodyMdx;
      data.bodyHtml = rendered.bodyHtml;
      data.toc = rendered.toc;
    }
    if (category !== undefined) {
      if (!CATEGORIES.includes(category as Category)) {
        throw new AppError('Category must be one of: TechNews, FixBug, Experience, Interviews', 400, 'INVALID_CATEGORY');
      }
      data.category = String(category);
    }
    if (coverEmoji !== undefined) data.coverEmoji = coverEmoji ? String(coverEmoji).slice(0, 16) : null;
    if (coverImageUrl !== undefined) data.coverImageUrl = coverImageUrl ? String(coverImageUrl).slice(0, 500) : null;
    if (codeBlock !== undefined) {
      data.codeBlock = codeBlock && typeof codeBlock === 'object'
        ? (codeBlock as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    }
    if (tags !== undefined) {
      data.tags = Array.isArray(tags)
        ? (tags as unknown[]).map((t) => String(t).trim()).filter(Boolean)
        : [];
    }
    if (trendingScore !== undefined) {
      data.trendingScore = Math.max(0, Math.min(100, Number(trendingScore) || 0));
    }
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (readTimeMin !== undefined) {
      data.readTimeMin = Math.max(1, Math.min(60, Number(readTimeMin) || 5));
    }
    if (status !== undefined) {
      const next = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
      data.status = next;
      // DRAFT → PUBLISHED stamps publishedAt = now.
      // PUBLISHED → DRAFT preserves publishedAt so history
      // is kept (admin can override via the `publishedAt`
      // field on the same request).
      if (next === 'PUBLISHED' && existing.status !== 'PUBLISHED') {
        data.publishedAt = publishedAt ? new Date(String(publishedAt)) : new Date();
      }
    }
    if (publishedAt !== undefined) {
      data.publishedAt = publishedAt ? new Date(String(publishedAt)) : null;
    }
    data.slug = nextSlug;

    const updated = await prisma.techTrendArticle.update({
      where: { id },
      data,
      include: authorInclude,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/admin/tech-trends/:id
adminRouter.delete('/:id', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid article id', 400, 'INVALID_ID');
    }
    const existing = await prisma.techTrendArticle.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    }
    await prisma.techTrendArticle.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends/:id/publish
// Convenience for one-click publish from the admin list.
adminRouter.post('/:id/publish', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid article id', 400, 'INVALID_ID');
    }
    const existing = await prisma.techTrendArticle.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Article not found', 404, 'ARTICLE_NOT_FOUND');
    }
    const updated = await prisma.techTrendArticle.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: existing.publishedAt ?? new Date(),
      },
      include: authorInclude,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends/:id/unpublish
adminRouter.post('/:id/unpublish', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      throw new AppError('Invalid article id', 400, 'INVALID_ID');
    }
    const updated = await prisma.techTrendArticle.update({
      where: { id },
      data: { status: 'DRAFT' },
      include: authorInclude,
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// ─── Admin AI authoring endpoints ──────────────────────────────────────
// All inherit the router-level `authenticate + requireAdmin('ROLE_ADMIN')`.
// They REUSE the interview LLM gateway (no new env/dep/migration) and
// degrade cleanly to a 503 when AI is unavailable.

function adminUserId(req: unknown): number | null {
  return (req as { userId?: number }).userId ?? null;
}

// GET /api/v1/admin/tech-trends/ai/status — lets the UI show/hide AI controls.
adminRouter.get('/ai/status', (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: aiStatus() });
});

// POST /api/v1/admin/tech-trends/ai/draft — topic + notes → full article draft.
adminRouter.post('/ai/draft', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { topic, category, notes } = req.body as Record<string, unknown>;
    const cat = TECH_TREND_CATEGORIES.includes(category as TechTrendCategory)
      ? (category as TechTrendCategory)
      : 'TechNews';
    const data = await generateDraft({
      topic: String(topic ?? ''),
      category: cat,
      notes: notes ? String(notes) : undefined,
      userId: adminUserId(req),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends/ai/fixbug — error/trace → #FixBug post-mortem.
adminRouter.post('/ai/fixbug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { errorText, context } = req.body as Record<string, unknown>;
    const data = await structureFixBug({
      errorText: String(errorText ?? ''),
      context: context ? String(context) : undefined,
      userId: adminUserId(req),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends/ai/enrich — body → summary + tags + SEO meta.
adminRouter.post('/ai/enrich', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { title, bodyMdx, category } = req.body as Record<string, unknown>;
    const data = await enrichMeta({
      title: String(title ?? ''),
      bodyMdx: String(bodyMdx ?? ''),
      category: category ? String(category) : undefined,
      userId: adminUserId(req),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/admin/tech-trends/ai/rewrite — instruction → polished body.
adminRouter.post('/ai/rewrite', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { bodyMdx, instruction } = req.body as Record<string, unknown>;
    const data = await rewriteBody({
      bodyMdx: String(bodyMdx ?? ''),
      instruction: String(instruction ?? ''),
      userId: adminUserId(req),
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export { publicRouter, adminRouter };
export default publicRouter;
