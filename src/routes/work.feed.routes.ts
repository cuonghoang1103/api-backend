/**
 * CT Work — BẢNG TIN NHÓM (Team Feed, 21/10/2026). Hợp đồng: docs/ctw-feed-hop-dong-api.md. Gắn trong work.routes.ts
 * (sau authenticate). Mọi tuyến là top-level `/feed/...` ⇒ KHÔNG nằm trong danh sách trắng của token agent
 * (agentTopRouteAllowed) ⇒ agent 403; service chặn agent lần nữa (feedAccess.assertFeedPerson). Quyền phạm vi kiểm TRONG
 * service (feedAccess / feedRules).
 *
 *   Phạm vi     GET /feed/scopes · PUT /feed/follow · GET /feed/mentionable?workspaceId=&projectId=&q=
 *   Bảng tin    GET /feed?workspaceId=&projectId=&level=&filter=&author=&q=&cursor=&limit= · GET /feed/new-count?since=
 *   Bài         POST /feed/posts · GET|PATCH|DELETE /feed/posts/:id · PUT …/pin · PUT …/moderation · PUT|DELETE …/reaction
 *               GET …/reactions · PUT …/save · PUT …/hide · POST …/report · PUT …/vote
 *   Bình luận   GET|POST /feed/posts/:id/comments · PATCH|DELETE /feed/comments/:cid · PUT|DELETE …/reaction
 *               PUT …/moderation · POST …/report
 *   Tệp         POST /feed/uploads (multipart) · POST /feed/uploads/presign · POST /feed/uploads/:id/complete
 *               POST /feed/uploads/:id/poster (multipart) · PATCH|DELETE /feed/uploads/:id · GET /feed/attachments/:id/url
 *               (xem trước chữ/Office: /feed/attachments/:id/content|preview — work.xemTep.routes.ts)
 *   Link        POST /feed/link-preview { url }
 *   Kiểm duyệt  GET /feed/reports · POST /feed/reports/:id/resolve { action }
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as feed from '../services/work/feed.service.js';
import * as media from '../services/work/feedMedia.service.js';
import { DIRECT_IMAGE_MAX, DIRECT_FILE_MAX, FEED_FILTERS, FOLLOW_LEVELS, POSTER_MAX, REACTION_KINDS } from '../services/work/feedRules.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (res: Response, data: unknown, status = 200) => res.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new BadRequestError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name = 'id') => parse(id, req.params[name]);

function receive(field: string, maxBytes: number) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1, fields: 10 } });
  return (req: Request, res: Response, next: NextFunction) => {
    up.single(field)(req, res, (err: unknown) => {
      if (!err) { next(); return; }
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(`Files must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller here — use the large-file upload for bigger videos and files`, 413, 'WORK_FILE_TOO_LARGE'));
        return;
      }
      next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
    });
  };
}
const utf8Name = (n: string) => { try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; } };
const reaction = z.enum(REACTION_KINDS);
const reportBody = z.object({ reason: z.enum(feed.FEED_REPORT_REASONS), detail: z.string().max(1000).nullable().optional() }).strict();
const clientKey = z.string().max(40).nullable().optional();

// ─── Phạm vi ─────────────────────────────────────────────────────

router.get('/feed/scopes', asyncHandler(async (req, res) => ok(res, await feed.listScopes(callerId(req)))));
router.put('/feed/follow', asyncHandler(async (req, res) => {
  ok(res, await feed.setFollow(callerId(req), parse(z.object({ workspaceId: id, projectId: id.nullable().optional(), level: z.enum(FOLLOW_LEVELS) }).strict(), req.body ?? {})));
}));
router.get('/feed/mentionable', asyncHandler(async (req, res) => {
  ok(res, await feed.mentionable(callerId(req), parse(z.object({ workspaceId: id, projectId: id.optional(), q: z.string().max(60).optional() }), req.query)));
}));

// ─── Bảng tin ────────────────────────────────────────────────────

router.get('/feed', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    workspaceId: id.optional(), projectId: id.optional(), level: z.enum(['workspace']).optional(), filter: z.enum(FEED_FILTERS).optional(),
    author: id.optional(), q: z.string().max(200).optional(), cursor: z.string().max(200).optional(), limit: z.coerce.number().int().min(1).max(50).optional(),
  }), req.query);
  ok(res, await feed.listFeed(callerId(req), q));
}));
router.get('/feed/new-count', asyncHandler(async (req, res) => {
  const q = parse(z.object({ since: z.string().max(40), workspaceId: id.optional(), projectId: id.optional() }), req.query);
  const since = new Date(q.since);
  if (Number.isNaN(since.getTime())) throw new BadRequestError('since: not a valid time', 'VALIDATION_ERROR');
  ok(res, await feed.newCount(callerId(req), { since, workspaceId: q.workspaceId, projectId: q.projectId }));
}));

// ─── Bài ─────────────────────────────────────────────────────────

const pollIn = z.object({ options: z.array(z.string().max(200)).min(2).max(6), multi: z.boolean().optional(), closesAt: z.string().max(40).nullable().optional() }).strict();

router.post('/feed/posts', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    workspaceId: id, projectId: id.nullable().optional(), body: z.string().max(20_000).optional(), attachmentIds: z.array(id).max(20).optional(),
    poll: pollIn.nullable().optional(), commentsOff: z.boolean().optional(), clientKey,
  }).strict(), req.body ?? {});
  ok(res, await feed.createPost(callerId(req), b), 201);
}));
router.get('/feed/posts/:id', asyncHandler(async (req, res) => ok(res, await feed.getPost(callerId(req), P(req)))));
router.patch('/feed/posts/:id', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    body: z.string().max(20_000).optional(), attachmentIds: z.array(id).max(20).optional(), removeAttachmentIds: z.array(id).max(20).optional(),
    alts: z.array(z.object({ id, alt: z.string().max(300).nullable() })).max(20).optional(), commentsOff: z.boolean().optional(),
  }).strict(), req.body ?? {});
  ok(res, await feed.updatePost(callerId(req), P(req), b));
}));
router.delete('/feed/posts/:id', asyncHandler(async (req, res) => ok(res, await feed.deletePost(callerId(req), P(req)))));
router.put('/feed/posts/:id/pin', asyncHandler(async (req, res) => {
  ok(res, await feed.pinPost(callerId(req), P(req), parse(z.object({ pinned: z.boolean() }).strict(), req.body ?? {}).pinned));
}));
router.put('/feed/posts/:id/moderation', asyncHandler(async (req, res) => {
  ok(res, await feed.moderatePost(callerId(req), P(req), parse(z.object({ hidden: z.boolean() }).strict(), req.body ?? {}).hidden));
}));
router.put('/feed/posts/:id/reaction', asyncHandler(async (req, res) => {
  ok(res, await feed.reactPost(callerId(req), P(req), parse(z.object({ kind: reaction }).strict(), req.body ?? {}).kind));
}));
router.delete('/feed/posts/:id/reaction', asyncHandler(async (req, res) => ok(res, await feed.reactPost(callerId(req), P(req), null))));
router.get('/feed/posts/:id/reactions', asyncHandler(async (req, res) => {
  const q = parse(z.object({ kind: reaction.optional(), cursor: z.string().max(200).optional(), limit: z.coerce.number().int().min(1).max(100).optional() }), req.query);
  ok(res, await feed.listReactions(callerId(req), P(req), q));
}));
router.put('/feed/posts/:id/save', asyncHandler(async (req, res) => {
  ok(res, await feed.savePost(callerId(req), P(req), parse(z.object({ saved: z.boolean() }).strict(), req.body ?? {}).saved));
}));
router.put('/feed/posts/:id/hide', asyncHandler(async (req, res) => {
  ok(res, await feed.hidePost(callerId(req), P(req), parse(z.object({ hidden: z.boolean() }).strict(), req.body ?? {}).hidden));
}));
router.post('/feed/posts/:id/report', asyncHandler(async (req, res) => ok(res, await feed.reportPost(callerId(req), P(req), parse(reportBody, req.body ?? {})), 201)));
router.put('/feed/posts/:id/vote', asyncHandler(async (req, res) => {
  ok(res, await feed.votePoll(callerId(req), P(req), parse(z.object({ optionIds: z.array(z.string().max(8)).max(10) }).strict(), req.body ?? {}).optionIds));
}));

// ─── Bình luận ───────────────────────────────────────────────────

router.get('/feed/posts/:id/comments', asyncHandler(async (req, res) => {
  const q = parse(z.object({ parentId: id.optional(), cursor: z.string().max(200).optional(), limit: z.coerce.number().int().min(1).max(50).optional() }), req.query);
  ok(res, await feed.listComments(callerId(req), P(req), q));
}));
router.post('/feed/posts/:id/comments', asyncHandler(async (req, res) => {
  const b = parse(z.object({ body: z.string().min(1).max(8000), parentId: id.nullable().optional(), clientKey }).strict(), req.body ?? {});
  ok(res, await feed.addComment(callerId(req), P(req), b), 201);
}));
router.patch('/feed/comments/:id', asyncHandler(async (req, res) => {
  ok(res, await feed.editComment(callerId(req), P(req), parse(z.object({ body: z.string().min(1).max(8000) }).strict(), req.body ?? {}).body));
}));
router.delete('/feed/comments/:id', asyncHandler(async (req, res) => ok(res, await feed.deleteComment(callerId(req), P(req)))));
router.put('/feed/comments/:id/reaction', asyncHandler(async (req, res) => {
  ok(res, await feed.reactComment(callerId(req), P(req), parse(z.object({ kind: reaction }).strict(), req.body ?? {}).kind));
}));
router.delete('/feed/comments/:id/reaction', asyncHandler(async (req, res) => ok(res, await feed.reactComment(callerId(req), P(req), null))));
router.put('/feed/comments/:id/moderation', asyncHandler(async (req, res) => {
  ok(res, await feed.moderateComment(callerId(req), P(req), parse(z.object({ hidden: z.boolean() }).strict(), req.body ?? {}).hidden));
}));
router.post('/feed/comments/:id/report', asyncHandler(async (req, res) => ok(res, await feed.reportComment(callerId(req), P(req), parse(reportBody, req.body ?? {})), 201)));

// ─── Tệp ─────────────────────────────────────────────────────────

router.post('/feed/uploads', receive('file', Math.max(DIRECT_IMAGE_MAX, DIRECT_FILE_MAX)), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file', 'WORK_FILE_EMPTY');
  const b = parse(z.object({ workspaceId: id, alt: z.string().max(300).optional() }), req.body ?? {});
  ok(res, await media.uploadDirect(callerId(req), { workspaceId: b.workspaceId, buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype, alt: b.alt ?? null }), 201);
}));
router.post('/feed/uploads/presign', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    workspaceId: id, fileName: z.string().min(1).max(255), mime: z.string().max(100), size: z.number().int().positive(), kind: z.enum(['VIDEO', 'FILE']),
  }).strict(), req.body ?? {});
  ok(res, await media.presignUpload(callerId(req), b), 201);
}));
router.post('/feed/uploads/:id/complete', asyncHandler(async (req, res) => {
  const b = parse(z.object({ width: z.number().int().positive().nullable().optional(), height: z.number().int().positive().nullable().optional(), durationMs: z.number().int().nonnegative().nullable().optional() }).strict(), req.body ?? {});
  ok(res, await media.completeUpload(callerId(req), P(req), b));
}));
router.post('/feed/uploads/:id/poster', receive('file', POSTER_MAX), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose an image', 'WORK_FILE_EMPTY');
  ok(res, await media.uploadPoster(callerId(req), P(req), f.buffer));
}));
router.patch('/feed/uploads/:id', asyncHandler(async (req, res) => {
  ok(res, await media.setAlt(callerId(req), P(req), parse(z.object({ alt: z.string().max(300).nullable() }).strict(), req.body ?? {}).alt));
}));
router.delete('/feed/uploads/:id', asyncHandler(async (req, res) => ok(res, await media.deleteDraft(callerId(req), P(req)))));
router.get('/feed/attachments/:id/url', asyncHandler(async (req, res) => {
  const q = parse(z.object({ variant: z.enum(['full', 'thumb', 'poster']).optional(), download: z.enum(['0', '1', 'true', 'false']).optional() }), req.query);
  ok(res, await media.attachmentUrl(callerId(req), P(req), { variant: q.variant, download: q.download === '1' || q.download === 'true' }));
}));

// ─── Link ────────────────────────────────────────────────────────

router.post('/feed/link-preview', asyncHandler(async (req, res) => {
  ok(res, await media.linkPreview(callerId(req), parse(z.object({ url: z.string().min(1).max(2000) }).strict(), req.body ?? {}).url));
}));

// ─── Kiểm duyệt ──────────────────────────────────────────────────

router.get('/feed/reports', asyncHandler(async (req, res) => {
  const q = parse(z.object({
    workspaceId: id.optional(), status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED', 'ALL']).optional(), cursor: z.string().max(200).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }), req.query);
  ok(res, await feed.listReports(callerId(req), q));
}));
router.post('/feed/reports/:id/resolve', asyncHandler(async (req, res) => {
  ok(res, await feed.resolveReport(callerId(req), P(req), parse(z.object({ action: z.enum(['remove', 'dismiss']) }).strict(), req.body ?? {}).action));
}));

export default router;
