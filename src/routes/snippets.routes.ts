/**
 * ============================================================
 * EXP_Hub — Snippets Routes
 * ============================================================
 *
 * Public REST API for the code snippet library:
 * - GET /api/v1/snippets/categories — nested folder tree
 * - GET /api/v1/snippets/tags — list all tags
 * - GET /api/v1/snippets — list snippets (filter/sort/paginate)
 * - GET /api/v1/snippets/search — full-text search
 * - GET /api/v1/snippets/:id — get snippet by ID
 * - GET /api/v1/snippets/slug/:slug — get snippet by slug
 * - POST /api/v1/snippets — create snippet (ADMIN/EDITOR)
 * - PUT /api/v1/snippets/:id — update snippet (ADMIN/EDITOR)
 * - DELETE /api/v1/snippets/:id — delete snippet (ADMIN)
 * - POST /api/v1/snippets/:id/copy — increment copy count
 * - POST /api/v1/snippets/:id/upvote — toggle upvote
 * - POST /api/v1/snippets/:id/bookmark — toggle bookmark
 * - GET /api/v1/snippets/bookmarks — get user's bookmarks
 * - GET /api/v1/snippets/:id/versions — version history
 * - GET /api/v1/snippets/stats — dashboard stats (ADMIN)
 * - POST /api/v1/snippets/bulk-import — bulk import files (ADMIN/EDITOR)
 */

import { Router, type Response } from 'express';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { BadRequestError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import * as snippetsService from '../services/snippets.service.js';

const router = Router();

// Helper to get client IP
function getClientIp(req: any): string {
  return (
    (req.headers['cf-connecting-ip'] as string) ||
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

// ─── Public Routes ───────────────────────────────────────────────────────────────

// GET /api/v1/snippets/categories
router.get('/categories', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const categories = await snippetsService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/tags
router.get('/tags', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const tags = await snippetsService.getTags();
    res.json({ success: true, data: tags });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets
router.get('/', async (req, res: Response<ApiResponse>, next) => {
  try {
    const {
      categoryId,
      tagIds,
      language,
      status,
      search,
      sort,
      page,
      limit,
    } = req.query;

    const filters = {
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      tagIds: tagIds
        ? (Array.isArray(tagIds) ? tagIds.map(Number) : [Number(tagIds)])
        : undefined,
      language: language as string | undefined,
      status: status as string | undefined,
      search: search as string | undefined,
      sort: sort as 'popular' | 'newest' | 'upvotes' | undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    };

    const result = await snippetsService.getSnippets(filters);
    res.json({ success: true, data: result.snippets, pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    }});
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/search
router.get('/search', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { q, page, limit } = req.query;

    if (!q || typeof q !== 'string') {
      throw new BadRequestError('Search query is required');
    }

    const result = await snippetsService.searchSnippets(
      q,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 20,
    );

    res.json({ success: true, data: result.snippets, pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    }});
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/stats (public)
router.get('/stats', async (_req, res: Response<ApiResponse>, next) => {
  try {
    const stats = await snippetsService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/:id
router.get('/:id(\\d+)', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const ip = getClientIp(req);
    const snippet = await snippetsService.getSnippetById(id, ip);
    res.json({ success: true, data: snippet });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/slug/:slug
router.get('/slug/:slug', async (req, res: Response<ApiResponse>, next) => {
  try {
    const { slug } = req.params;
    const ip = getClientIp(req);
    const snippet = await snippetsService.getSnippetBySlug(slug, ip);
    res.json({ success: true, data: snippet });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/:id/versions
router.get('/:id(\\d+)/versions', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const versions = await snippetsService.getSnippetVersions(id);
    res.json({ success: true, data: versions });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/:id/copy
router.post('/:id(\\d+)/copy', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const ip = getClientIp(req);
    const { variables } = req.body as { variables?: Record<string, string> };

    const result = await snippetsService.copySnippet(id, ip, variables);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/:id/upvote
router.post('/:id(\\d+)/upvote', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const ip = getClientIp(req);
    const userId = req.user?.userId;

    const result = await snippetsService.toggleUpvote(id, ip, userId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/:id/bookmark
router.post('/:id(\\d+)/bookmark', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const ip = getClientIp(req);
    const userId = req.user?.userId;

    const result = await snippetsService.toggleBookmark(id, ip, userId);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/bookmarks
router.get('/bookmarks/list', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const ip = getClientIp(req);
    const userId = req.user?.userId;

    const result = await snippetsService.getBookmarks(userId, ip);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Admin/Editor Routes ────────────────────────────────────────────────────────

// POST /api/v1/snippets/categories
router.post('/categories', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { name, parentId, sortOrder } = req.body as {
      name: string;
      parentId?: number | null;
      sortOrder?: number;
    };

    if (!name?.trim()) {
      throw new BadRequestError('Category name is required');
    }

    const category = await snippetsService.createCategory({ name, parentId, sortOrder });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
});

// PUT /api/v1/snippets/categories/:id
router.put('/categories/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, parentId, sortOrder } = req.body as {
      name?: string;
      parentId?: number | null;
      sortOrder?: number;
    };

    const category = await snippetsService.updateCategory(id, { name, parentId, sortOrder });
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/categories/:id
router.delete('/categories/:id', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { moveChildrenTo } = req.body as { moveChildrenTo?: number | null };

    await snippetsService.deleteCategory(id, moveChildrenTo);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/tags
router.post('/tags', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { name } = req.body as { name: string };

    if (!name?.trim()) {
      throw new BadRequestError('Tag name is required');
    }

    const tag = await snippetsService.createTag({ name });
    res.status(201).json({ success: true, data: tag });
  } catch (error) { next(error); }
});

// PUT /api/v1/snippets/tags/:id
router.put('/tags/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body as { name: string };

    if (!name?.trim()) {
      throw new BadRequestError('Tag name is required');
    }

    const tag = await snippetsService.updateTag(id, { name });
    res.json({ success: true, data: tag });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/tags/:id
router.delete('/tags/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    await snippetsService.deleteTag(id);
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets
router.post('/', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const data = req.body as {
      title: string;
      description?: string;
      language: string;
      code: string;
      categoryId?: number | null;
      tagIds?: number[];
      variables?: Array<{ key: string; label: string; defaultValue?: string }>;
      previewUrl?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    };

    if (!data.title?.trim()) {
      throw new BadRequestError('Snippet title is required');
    }
    if (!data.code?.trim()) {
      throw new BadRequestError('Snippet code is required');
    }
    if (!data.language?.trim()) {
      throw new BadRequestError('Snippet language is required');
    }

    const snippet = await snippetsService.createSnippet(data, req.user?.userId);
    res.status(201).json({ success: true, data: snippet });
  } catch (error) { next(error); }
});

// PUT /api/v1/snippets/:id
router.put('/:id(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body as {
      title?: string;
      description?: string;
      language?: string;
      code?: string;
      categoryId?: number | null;
      tagIds?: number[];
      variables?: Array<{ key: string; label: string; defaultValue?: string }>;
      previewUrl?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    };

    const snippet = await snippetsService.updateSnippet(id, data, req.user?.userId);
    res.json({ success: true, data: snippet });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/:id
router.delete('/:id(\\d+)', authenticate, requireRole('ADMIN'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    await snippetsService.deleteSnippet(id);
    res.json({ success: true, message: 'Snippet deleted' });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/bulk-import
router.post('/bulk-import', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { files } = req.body as {
      files: Array<{
        title: string;
        description?: string;
        language?: string;
        filename?: string;
        code: string;
        categoryId?: number;
        tags?: string[];
      }>;
      categoryId?: number;
    };

    if (!files?.length) {
      throw new BadRequestError('No files provided');
    }

    const items = files.map(f => ({
      title: f.title,
      description: f.description,
      language: f.language || snippetsService.detectLanguage(f.filename || f.title),
      code: f.code,
      categoryId: f.categoryId || files[0]?.categoryId || req.body.categoryId,
      tags: f.tags,
    }));

    const results = await snippetsService.bulkImportSnippets(items, req.user?.userId);
    res.status(201).json({ success: true, data: results });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/admin/dashboard
router.get('/admin/dashboard', authenticate, requireRole('ADMIN'), async (_req, res: Response<ApiResponse>, next) => {
  try {
    const stats = await snippetsService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) { next(error); }
});

export default router;
