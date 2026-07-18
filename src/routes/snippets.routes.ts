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
import * as commentsService from '../services/snippets.comments.service.js';
import { assistCode, type ExplainMode } from '../services/snippets.ai.service.js';
import { generateCategoryDoc, commitCategoryDoc, clearCategoryDoc } from '../services/snippets.aiDoc.service.js';

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

// GET /api/v1/snippets/categories/:id/doc — full AI reference doc for a
// technology (fetched on demand; kept OUT of the /categories nav tree to keep
// that payload small). Public: 200 with an empty block list when no doc yet.
router.get('/categories/:id(\\d+)/doc', async (req, res: Response<ApiResponse>, next) => {
  try {
    const doc = await snippetsService.getCategoryDoc(parseInt(req.params.id));
    res.json({ success: true, data: doc });
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

// GET /api/v1/snippets/:id/related
router.get('/:id(\\d+)/related', async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const limit = req.query.limit ? Math.min(12, parseInt(req.query.limit as string)) : 6;
    const related = await snippetsService.getRelatedSnippets(id, limit);
    res.json({ success: true, data: related });
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

// ─── Comments + Reactions ─────────────────────────────────────────────────────────
// Reading is public; posting/reacting requires a login. Edit/delete is
// owner-only (admins may delete for moderation — enforced in the service).

// GET /api/v1/snippets/:id/comments — threaded comments (+ per-comment reactions)
router.get('/:id(\\d+)/comments', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const result = await commentsService.listComments(id, req.user?.userId ?? null);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/:id/comments — add a comment or reply
router.post('/:id(\\d+)/comments', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { content, parentId } = req.body as { content: string; parentId?: number | null };
    const comment = await commentsService.createComment(id, req.user!.userId, content, parentId ?? null);
    res.status(201).json({ success: true, data: comment });
  } catch (error) { next(error); }
});

// PATCH /api/v1/snippets/comments/:cid — edit own comment
router.patch('/comments/:cid(\\d+)', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const cid = parseInt(req.params.cid);
    const { content } = req.body as { content: string };
    await commentsService.editComment(cid, req.user!.userId, content);
    res.json({ success: true, message: 'Comment updated' });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/comments/:cid — delete own comment (admin: any)
router.delete('/comments/:cid(\\d+)', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const cid = parseInt(req.params.cid);
    await commentsService.deleteComment(cid, req.user!.userId);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/comments/:cid/reactions — toggle an emoji on a comment
router.post('/comments/:cid(\\d+)/reactions', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const cid = parseInt(req.params.cid);
    const { emoji } = req.body as { emoji: string };
    const reactions = await commentsService.toggleCommentReaction(cid, req.user!.userId, emoji);
    res.json({ success: true, data: { reactions } });
  } catch (error) { next(error); }
});

// GET /api/v1/snippets/:id/reactions — snippet reaction summary
router.get('/:id(\\d+)/reactions', optionalAuth, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const reactions = await commentsService.summarizeSnippetReactions(id, req.user?.userId ?? null);
    res.json({ success: true, data: { reactions } });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/:id/reactions — toggle an emoji on a snippet
router.post('/:id(\\d+)/reactions', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { emoji } = req.body as { emoji: string };
    const reactions = await commentsService.toggleSnippetReaction(id, req.user!.userId, emoji);
    res.json({ success: true, data: { reactions } });
  } catch (error) { next(error); }
});

// ─── Admin/Editor Routes ────────────────────────────────────────────────────────

// POST /api/v1/snippets/categories
router.post('/categories', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const { name, parentId, sortOrder, description, icon, color, coverImageUrl, docsUrl } = req.body as {
      name: string;
      parentId?: number | null;
      sortOrder?: number;
      description?: string | null;
      icon?: string | null;
      color?: string | null;
      coverImageUrl?: string | null;
      docsUrl?: string | null;
    };

    if (!name?.trim()) {
      throw new BadRequestError('Category name is required');
    }

    const category = await snippetsService.createCategory({
      name, parentId, sortOrder, description, icon, color, coverImageUrl, docsUrl,
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
});

// PUT /api/v1/snippets/categories/:id
router.put('/categories/:id', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, parentId, sortOrder, description, icon, color, coverImageUrl, docsUrl } = req.body as {
      name?: string;
      parentId?: number | null;
      sortOrder?: number;
      description?: string | null;
      icon?: string | null;
      color?: string | null;
      coverImageUrl?: string | null;
      docsUrl?: string | null;
    };

    const category = await snippetsService.updateCategory(id, {
      name, parentId, sortOrder, description, icon, color, coverImageUrl, docsUrl,
    });
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
      codeBlocks?: Array<{ name?: string; language?: string; code?: string }>;
      kind?: 'CODE' | 'NOTE' | 'PROJECT';
      noteContent?: string | null;
      explanation?: string;
      youtubeUrl?: string;
      referenceUrl?: string;
      repoUrl?: string;
      categoryId?: number | null;
      tagIds?: number[];
      variables?: Array<{ key: string; label: string; defaultValue?: string }>;
      previewUrl?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    };

    if (!data.title?.trim()) {
      throw new BadRequestError('Snippet title is required');
    }
    // A snippet needs at least one non-empty code block OR a note section.
    const hasCode = (data.codeBlocks?.some((b) => (b.code ?? '').trim().length > 0)) || !!data.code?.trim();
    const hasNote = !!data.noteContent?.trim();
    if (!hasCode && !hasNote) {
      throw new BadRequestError('Cần ít nhất một khối code hoặc ghi chú');
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
      codeBlocks?: Array<{ name?: string; language?: string; code?: string }>;
      kind?: 'CODE' | 'NOTE' | 'PROJECT';
      noteContent?: string | null;
      explanation?: string;
      youtubeUrl?: string;
      referenceUrl?: string;
      repoUrl?: string;
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

// POST /api/v1/snippets/:id/attachments — register an uploaded file (R2 URL)
router.post('/:id(\\d+)/attachments', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const { fileUrl, originalName, fileType, fileSize } = req.body as {
      fileUrl: string; originalName: string; fileType?: string | null; fileSize?: number | null;
    };
    const attachment = await snippetsService.addAttachment(id, { fileUrl, originalName, fileType, fileSize });
    res.status(201).json({ success: true, data: attachment });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/:id/attachments/:attId
router.delete('/:id(\\d+)/attachments/:attId(\\d+)', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const id = parseInt(req.params.id);
    const attId = parseInt(req.params.attId);
    await snippetsService.deleteAttachment(id, attId);
    res.json({ success: true, message: 'Attachment deleted' });
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

// POST /api/v1/snippets/ai/assist — AI explain / optimize / install for code.
// Authenticated (quota is per-user); the code lives in the request, not the DB,
// so this works on drafts and unsaved edits too. `/ai/...` never collides with
// the numeric `/:id(\d+)` routes above.
router.post('/ai/assist', authenticate, async (req, res: Response<ApiResponse>, next) => {
  try {
    const { mode, code, language, title } = req.body ?? {};
    const result = await assistCode({
      mode: mode as ExplainMode,
      code,
      language,
      title,
      userId: req.user!.userId,
    });
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// ─── Category reference-doc AI (ADMIN/EDITOR) ─────────────────────────────────
// Full-English "what is X / install / usage / combines with" doc per technology.
// generate = preview (no DB write); commit = persist the reviewed blocks.

// POST /api/v1/snippets/admin/ai/doc/generate
router.post('/admin/ai/doc/generate', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const result = await generateCategoryDoc(req.user!.userId, req.body ?? {});
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// POST /api/v1/snippets/admin/ai/doc/commit
router.post('/admin/ai/doc/commit', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    const result = await commitCategoryDoc(req.user!.userId, req.body ?? {});
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// DELETE /api/v1/snippets/categories/:id/doc — clear a category's doc.
router.delete('/categories/:id(\\d+)/doc', authenticate, requireRole('ADMIN', 'EDITOR'), async (req, res: Response<ApiResponse>, next) => {
  try {
    await clearCategoryDoc(parseInt(req.params.id));
    res.json({ success: true, message: 'Doc cleared' });
  } catch (error) { next(error); }
});

export default router;
