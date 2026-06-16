// ─── GitHub Repo Hub — HTTP routes ────────────────────────────────
//
// Public endpoints (no auth):
//   GET    /api/v1/repos                       — list published repos
//   GET    /api/v1/repos/tags                  — list all tags used by repos
//   GET    /api/v1/repos/languages             — distinct language list
//   GET    /api/v1/repos/:id                   — single repo detail
//
// Admin endpoints (require ROLE_ADMIN):
//   POST   /api/v1/admin/repos                 — create from GitHub URL
//   PUT    /api/v1/admin/repos/:id             — update review/tags
//   PATCH  /api/v1/admin/repos/:id/status      — toggle DRAFT/PUBLISHED
//   DELETE /api/v1/admin/repos/:id             — delete
//   POST   /api/v1/admin/repos/sync            — refresh all metadata
//   POST   /api/v1/admin/repos/fetch-starred   — pull a user's recent stars
// ──────────────────────────────────────────────────────────────────

import { Router, Response } from 'express';
import { authenticate, optionalAuth, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { prisma } from '../config/database.js';
import {
  createOrUpdateRepoFromUrl,
  deleteRepo,
  fetchStarredAsDrafts,
  listRepos,
  syncAllRepoMetadata,
  updateRepoReview,
  updateRepoStatus,
} from '../services/github.service.js';
import type { ApiResponse } from '../types/index.js';
import type { GithubRepoStatus } from '@prisma/client';

const router = Router();

// ────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/repos
 *
 * Public feed of PUBLISHED repos. Supports:
 *   - `page` (default 1), `pageSize` (default 12, max 50)
 *   - `tagId`    — filter by tag ID
 *   - `tagSlug`  — filter by tag slug
 *   - `language` — filter by primary language (case-insensitive)
 *   - `keyword`  — search in name/description (case-insensitive)
 */
router.get('/', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const page = parseInt(String(req.query.page || '1'), 10);
    const pageSize = parseInt(String(req.query.pageSize || '12'), 10);
    const tagId = req.query.tagId ? parseInt(String(req.query.tagId), 10) : undefined;
    const tagSlug = req.query.tagSlug ? String(req.query.tagSlug) : undefined;
    const language = req.query.language ? String(req.query.language) : undefined;
    const keyword = req.query.keyword ? String(req.query.keyword) : undefined;
    const includeDrafts = String(req.query.includeDrafts || '').toLowerCase() === 'true';

    // Admins can pass ?includeDrafts=true to peek at DRAFT entries.
    // The default for everyone else is PUBLISHED-only.
    const status: GithubRepoStatus = includeDrafts && req.userId ? 'DRAFT' : 'PUBLISHED';

    const result = await listRepos({
      status,
      tagId,
      tagSlug,
      language,
      keyword,
      page,
      pageSize,
    });
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
});

/**
 * GET /api/v1/repos/tags
 *
 * Returns all tags that are attached to at least one repo,
 * plus the count of repos per tag. Used by the public feed
 * sidebar to render the filter chips.
 */
router.get('/tags', async (_req, res: Response<ApiResponse>, next) => {
  try {
    // Group join rows by tag, count entries, return tags.
    // We do this in two queries instead of groupBy so we can
    // surface the slug + name together.
    const joinRows = await prisma.githubRepoTag.findMany({
      select: { tagId: true, tag: { select: { id: true, name: true, slug: true } } },
    });
    const byTag = new Map<number, { id: number; name: string; slug: string; count: number }>();
    for (const row of joinRows) {
      const existing = byTag.get(row.tagId);
      if (existing) {
        existing.count += 1;
      } else {
        byTag.set(row.tagId, { ...row.tag, count: 1 });
      }
    }
    const tags = Array.from(byTag.values()).sort((a, b) => b.count - a.count);
    res.json({ success: true, data: tags });
  } catch (error) { next(error); }
});

/**
 * GET /api/v1/repos/languages
 *
 * Distinct list of primary languages used by PUBLISHED repos,
 * with per-language counts. Sorted by count DESC.
 */
router.get('/languages', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const rows = await prisma.githubRepo.groupBy({
      by: ['language'],
      where: { status: 'PUBLISHED', language: { not: null } },
      _count: { language: true },
    });
    const languages = rows
      .filter((r) => r.language)
      .map((r) => ({ name: r.language as string, count: r._count.language }))
      .sort((a, b) => b.count - a.count);
    res.json({ success: true, data: languages });
  } catch (error) { next(error); }
});

/**
 * GET /api/v1/repos/:id
 *
 * Single repo detail. PUBLIC for PUBLISHED rows, admin-only
 * for DRAFT rows (so curators can preview before going live).
 */
router.get('/:id', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = String(req.params.id);
    const repo = await prisma.githubRepo.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!repo) throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');

    // Drafts are private to admins.
    if (repo.status === 'DRAFT' && !req.userId) {
      throw new AppError('Repo khong ton tai', 404, 'NOT_FOUND');
    }

    res.json({
      success: true,
      data: {
        id: repo.id,
        repoName: repo.repoName,
        owner: repo.owner,
        url: repo.url,
        stars: repo.stars,
        language: repo.language,
        description: repo.description,
        myReview: repo.myReview,
        status: repo.status,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        tags: repo.tags.map((t) => ({ id: t.tag.id, name: t.tag.name, slug: t.tag.slug })),
      },
    });
  } catch (error) { next(error); }
});

// ────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/admin/repos
 *
 * Create a new repo entry from a GitHub URL. The route fetches
 * the live metadata (stars, language, description) and saves
 * everything in one shot. Body:
 *
 *   {
 *     "githubUrl":  "https://github.com/owner/repo",
 *     "myReview":   "Markdown / plain text review…",
 *     "status":     "PUBLISHED" | "DRAFT",
 *     "tagIds":   [1, 2],          // optional
 *     "tagNames": ["Backend", "Payment"]  // optional, new tags created on the fly
 *   }
 */
router.post('/', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { githubUrl, myReview, status, tagIds, tagNames } = req.body || {};
    if (!githubUrl) {
      throw new AppError('githubUrl la bat buoc', 400, 'MISSING_URL');
    }
    const normalizedStatus: GithubRepoStatus =
      status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED';
    const data = await createOrUpdateRepoFromUrl({
      githubUrl: String(githubUrl),
      myReview: String(myReview || ''),
      status: normalizedStatus,
      tagIds: Array.isArray(tagIds) ? tagIds.map((x: unknown) => Number(x)).filter(Number.isFinite) : undefined,
      tagNames: Array.isArray(tagNames) ? tagNames.map((x: unknown) => String(x)) : undefined,
    });
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
});

/**
 * PUT /api/v1/admin/repos/:id
 *
 * Update the review + tags for an existing repo. Does NOT
 * re-fetch from GitHub — use /sync for that.
 */
router.put('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { id } = req.params;
    const { myReview, tagIds, tagNames } = req.body || {};
    if (!myReview) {
      throw new AppError('myReview la bat buoc', 400, 'MISSING_REVIEW');
    }
    const data = await updateRepoReview({
      id,
      myReview: String(myReview),
      tagIds: Array.isArray(tagIds) ? tagIds.map((x: unknown) => Number(x)).filter(Number.isFinite) : undefined,
      tagNames: Array.isArray(tagNames) ? tagNames.map((x: unknown) => String(x)) : undefined,
    });
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

/**
 * PATCH /api/v1/admin/repos/:id/status
 *
 * Toggle DRAFT <-> PUBLISHED without touching any other field.
 * Used by the "Approve" button in the admin draft list.
 */
router.patch('/:id/status', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (status !== 'DRAFT' && status !== 'PUBLISHED') {
      throw new AppError('status phai la DRAFT hoac PUBLISHED', 400, 'INVALID_STATUS');
    }
    const data = await updateRepoStatus(id, status);
    res.json({ success: true, data });
  } catch (error) { next(error); }
});

/**
 * DELETE /api/v1/admin/repos/:id
 *
 * Hard delete. Cascade removes the join rows in
 * github_repo_tags automatically (ON DELETE CASCADE).
 */
router.delete('/:id', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { id } = req.params;
    await deleteRepo(id);
    res.json({ success: true, message: 'Repo deleted' });
  } catch (error) { next(error); }
});

/**
 * POST /api/v1/admin/repos/sync
 *
 * Re-pull stars + language + description for every repo in
 * the database. Useful to run once after deploy and on a
 * cron if you want a "live" feel.
 */
router.post('/sync', authenticate, requireAdmin('ROLE_ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const result = await syncAllRepoMetadata();
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

/**
 * POST /api/v1/admin/repos/fetch-starred
 *
 * Pull the most recently starred repos for a given GitHub
 * user and save them as DRAFT entries. Body:
 *   { "username": "cuonghoang1103", "limit": 10 }
 */
router.post('/fetch-starred', authenticate, requireAdmin('ROLE_ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { username, limit } = req.body || {};
    if (!username || typeof username !== 'string') {
      throw new AppError('username la bat buoc', 400, 'MISSING_USERNAME');
    }
    const safeLimit = limit ? Math.min(Math.max(parseInt(String(limit), 10) || 10, 1), 30) : 10;
    const result = await fetchStarredAsDrafts(username.trim(), safeLimit);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

export default router;
