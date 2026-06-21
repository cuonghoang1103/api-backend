// ─── Hub — Personal Bookmark Manager (HTTP routes) ───────────────
//
// Authenticated endpoints (mounted at /api/v1/hub):
//   GET    /folders
//   POST   /folders
//   PATCH  /folders/:id
//   DELETE /folders/:id
//   GET    /links
//   POST   /links
//   PATCH  /links/:id
//   DELETE /links/:id
//   POST   /scrape
//   GET    /files
//   POST   /files
//   PATCH  /files/:id
//   DELETE /files/:id
//   GET    /files/:id/url
//   POST   /files/:id/ai-tags
//   GET    /files/presign    — get presigned R2 PUT URL for direct upload
//
// Public endpoint (no auth, exported separately as `hubPublicRouter`):
//   GET    /public/:slug      (links)
//   GET    /files/public/:slug (files)
//
// All mutating routes validate input, all reads/writes are scoped
// by req.userId (set by the `authenticate` middleware) — there is
// no way for a hostile client to read or mutate another user's data
// because the WHERE clause always includes userId.

import { Router, type Response, type Request } from 'express';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import {
  createFolder,
  deleteFolder,
  listFolders,
  updateFolder,
  createLink,
  deleteLink,
  listLinks,
  updateLink,
  scrapeUrl,
  getPublicLink,
  listFiles,
  createFile,
  updateFile,
  deleteFile,
  getSignedFileUrl,
  aiSuggestTags,
  getPublicFile,
} from '../services/hub.service.js';

const router = Router();
router.use(authenticate);

// ─── Folders ─────────────────────────────────────────────────

router.get('/folders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const items = await listFolders(req.userId!);
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

router.post('/folders', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { name, icon, sortOrder } = req.body ?? {};
    if (typeof name !== 'string') {
      throw new AppError('name phai la chuoi', 400, 'INVALID_NAME');
    }
    const folder = await createFolder(req.userId!, { name, icon, sortOrder });
    res.status(201).json({ success: true, data: folder });
  } catch (err) { next(err); }
});

router.patch('/folders/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const { name, icon, sortOrder } = req.body ?? {};
    const folder = await updateFolder(req.userId!, id, { name, icon, sortOrder });
    res.json({ success: true, data: folder });
  } catch (err) { next(err); }
});

router.delete('/folders/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteFolder(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Links ───────────────────────────────────────────────────

router.get('/links', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const raw = req.query.folderId;
    let folderId: number | null | 'all' = 'all';
    if (raw === 'null') {
      folderId = null;
    } else if (raw === 'all' || raw == null) {
      folderId = 'all';
    } else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) {
        throw new AppError('folderId khong hop le', 400, 'INVALID_FOLDER_ID');
      }
      folderId = n;
    }
    const keyword = typeof req.query.q === 'string' ? req.query.q : undefined;
    const result = await listLinks(req.userId!, {
      folderId,
      keyword,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    });
    // Wrap in { data } to match the rest of the API contract —
    // other endpoints all return `{ success, data: <payload> }`,
    // and the frontend's hubApi.listLinks expects `res.data.data`.
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/links', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const body = req.body ?? {};
    const link = await createLink(req.userId!, {
      folderId: body.folderId ?? null,
      url: body.url,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      faviconUrl: body.faviconUrl,
      notes: body.notes,
      tags: body.tags,
      isPublic: body.isPublic,
    });
    res.status(201).json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.patch('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};
    const link = await updateLink(req.userId!, id, {
      folderId: body.folderId,
      url: body.url,
      title: body.title,
      description: body.description,
      thumbnailUrl: body.thumbnailUrl,
      faviconUrl: body.faviconUrl,
      notes: body.notes,
      tags: body.tags,
      isPublic: body.isPublic,
    });
    res.json({ success: true, data: link });
  } catch (err) { next(err); }
});

router.delete('/links/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteLink(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// ─── Scrape ──────────────────────────────────────────────────

router.post('/scrape', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url : '';
    const data = await scrapeUrl(req.userId!, url);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// ─── Files ───────────────────────────────────────────────────

// GET /files/presign — return a presigned R2 PUT URL for direct browser→R2 upload.
// Body: { name: string, mimeType: string }
router.post('/files/presign', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name : '';
    const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : 'application/octet-stream';
    if (!name || name.length > 255) {
      throw new AppError('Ten file 1-255 ky tu', 400, 'INVALID_NAME');
    }
    if (!mimeType) {
      throw new AppError('mimeType la bat buoc', 400, 'MISSING_MIME');
    }
    // Generate a unique R2 key
    const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
    const key = `hub-files/user${req.userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    // We'll implement the presign inline using R2 config
    const { getR2Client } = await import('../config/r2.js');
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const { config } = await import('../config/env.js');
    const client = getR2Client();
    const cmd = new PutObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
      ContentType: mimeType,
    });
    const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 600 });
    res.json({ success: true, data: { uploadUrl, key } });
  } catch (err) { next(err); }
});

// POST /files — register a file after it's been uploaded to R2
router.post('/files', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const body = req.body ?? {};
    if (!body.key || !body.name || !body.mimeType || body.size == null) {
      throw new AppError('key, name, mimeType, size la bat buoc', 400, 'MISSING_FIELDS');
    }
    const file = await createFile(req.userId!, {
      folderId: body.folderId ?? null,
      key: body.key,
      name: body.name,
      mimeType: body.mimeType,
      size: Number(body.size) || 0,
      tags: body.tags,
      notes: body.notes,
      isPublic: body.isPublic,
    });
    res.status(201).json({ success: true, data: file });
  } catch (err) { next(err); }
});

router.get('/files', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const raw = req.query.folderId;
    let folderId: number | null | 'all' = 'all';
    if (raw === 'null') folderId = null;
    else if (raw !== 'all' && raw != null) {
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) {
        throw new AppError('folderId khong hop le', 400, 'INVALID_FOLDER_ID');
      }
      folderId = n;
    }
    const result = await listFiles(req.userId!, {
      folderId,
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      keyword: typeof req.query.q === 'string' ? req.query.q : undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get('/files/:id/url', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const data = await getSignedFileUrl(req.userId!, id);
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

router.patch('/files/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const body = req.body ?? {};
    const file = await updateFile(req.userId!, id, {
      folderId: body.folderId,
      name: body.name,
      tags: body.tags,
      notes: body.notes,
      status: body.status,
      isPublic: body.isPublic,
    });
    res.json({ success: true, data: file });
  } catch (err) { next(err); }
});

router.delete('/files/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteFile(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.post('/files/:id/ai-tags', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const result = await aiSuggestTags(req.userId!, id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

export default router;

// ─── Public router (no auth) ─────────────────────────────────

export const hubPublicRouter = Router();
hubPublicRouter.get('/public/:slug', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug ?? '');
    const link = await getPublicLink(slug);
    if (!link) {
      throw new AppError('Khong tim thay hoac link khong cong khai', 404, 'NOT_FOUND');
    }
    res.json({ success: true, data: link });
  } catch (err) { next(err); }
});

hubPublicRouter.get('/files/public/:slug', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const slug = String(req.params.slug ?? '');
    const file = await getPublicFile(slug);
    if (!file) {
      throw new AppError('Khong tim thay hoac file khong cong khai', 404, 'NOT_FOUND');
    }
    res.json({ success: true, data: file });
  } catch (err) { next(err); }
});
