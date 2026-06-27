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
  getSharedFileDownloadUrl,
  aiSuggestTags,
  getPublicFile,
} from '../services/hub.service.js';
import {
  createShare,
  deleteShare,
  getSharedItem,
  getShareForUser,
  listInboxShares,
  listOutboxShares,
  listUsersSharingWithMe,
  searchUsersForShare,
  updateShare,
} from '../services/hubShare.service.js';

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
    const { name, icon, coverImageUrl, sortOrder } = req.body ?? {};
    if (typeof name !== 'string') {
      throw new AppError('name phai la chuoi', 400, 'INVALID_NAME');
    }
    const folder = await createFolder(req.userId!, {
      name, icon, coverImageUrl, sortOrder,
    });
    res.status(201).json({ success: true, data: folder });
  } catch (err) { next(err); }
});

router.patch('/folders/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const { name, icon, coverImageUrl, sortOrder } = req.body ?? {};
    const folder = await updateFolder(req.userId!, id, {
      name, icon, coverImageUrl, sortOrder,
    });
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
      coverImageUrl: body.coverImageUrl,
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
      coverImageUrl: body.coverImageUrl,
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
      coverImageUrl: body.coverImageUrl,
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

// Recipient-side: download a file that was shared with the caller.
// Only works if a HubShare row exists with permission = view_download.
// 403 otherwise. Mirrors the owner-side /files/:id/url route shape
// so the frontend can use the same response handler.
router.get('/shared-files/:id/url', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('fileId khong hop le', 400, 'INVALID_ID');
    }
    const data = await getSharedFileDownloadUrl(req.userId!, id);
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
      coverImageUrl: body.coverImageUrl,
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

// ─── Hub User-Sharing (Phase 2) ────────────────────────────────
//
// Authenticated endpoints that let a user share a folder, link,
// or file with a specific recipient (view-only + optional
// download). The recipient sees the share in their inbox at
// GET /shares/inbox.
//
// We expose 4 buckets:
//   - Outbox : shares I sent (the owner-side list + revoke)
//   - Inbox  : shares others sent me (the recipient-side list)
//   - Lookup : get a single share (must be owner OR recipient)
//   - Users  : search users to share with + list users sharing
//              with me (drives the sidebar widget)
//
// All write endpoints validate that the caller is the owner
// (or recipient, where applicable). The service layer is the
// authoritative gate; the route layer is just an HTTP shim.

router.post('/shares', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const { recipientId, folderId, linkId, fileId, permission, note } = req.body ?? {};
    const share = await createShare(req.userId!, {
      recipientId,
      folderId,
      linkId,
      fileId,
      permission,
      note,
    });
    res.status(201).json({ success: true, data: share });
  } catch (err) { next(err); }
});

router.get('/shares/outbox', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const shares = await listOutboxShares(req.userId!);
    res.json({ success: true, data: shares });
  } catch (err) { next(err); }
});

router.get('/shares/inbox', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const shares = await listInboxShares(req.userId!);
    res.json({ success: true, data: shares });
  } catch (err) { next(err); }
});

router.get('/shares/users-sharing-with-me', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const users = await listUsersSharingWithMe(req.userId!);
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

router.get('/shares/users-search', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const q = String((req.query.q as string) ?? '');
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const users = await searchUsersForShare(req.userId!, q, limit);
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
});

router.get('/shares/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('shareId khong hop le', 400, 'INVALID_SHARE_ID');
    }
    const share = await getShareForUser(id, req.userId!);
    if (!share) {
      // Indistinguishable from "doesn't exist" — we deliberately
      // don't differentiate 403 from 404 to avoid leaking the
      // share's existence to non-participants.
      throw new AppError('Share khong ton tai', 404, 'SHARE_NOT_FOUND');
    }
    res.json({ success: true, data: share });
  } catch (err) { next(err); }
});

// Recipient-only: fetch the actual item through the share gate.
// Returns the underlying folder/link/file plus the share row so
// the UI can render the "từ @username" badge.
router.get('/shares/:id/item', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('shareId khong hop le', 400, 'INVALID_SHARE_ID');
    }
    const result = await getSharedItem(id, req.userId!);
    if (!result) {
      throw new AppError('Share khong ton tai hoac khong phai cua ban', 404, 'SHARE_NOT_FOUND');
    }
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.patch('/shares/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('shareId khong hop le', 400, 'INVALID_SHARE_ID');
    }
    const { permission, note } = req.body ?? {};
    const updated = await updateShare(req.userId!, id, { permission, note });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

router.delete('/shares/:id', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('shareId khong hop le', 400, 'INVALID_SHARE_ID');
    }
    const result = await deleteShare(req.userId!, id);
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
