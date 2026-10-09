/**
 * CT Work đợt 5b K-1 (10/10/2026) — bình luận đầy đủ + voice note. Gắn trong work.routes.ts (đã qua apiTokenAuth +
 * authenticate + chốt /projects/:pid + chốt cổng khách). Quyền kiểm TRONG service (commentFiles.service.ts).
 *
 *   POST   /projects/:pid/issues/:num/comment-files   multipart `file` (≤ 25 MB) — tệp cho ô bình luận đi qua backend
 *          (app desktop: CSP chặn PUT thẳng R2; web dùng presign/complete với `forComment: true`)
 *   POST   /projects/:pid/issues/:num/comment-voice   multipart `audio` (≤ 8 MB) + `durationMs` — voice note (≤ 3 phút)
 *   DELETE /projects/:pid/comment-files/:aid           bỏ bản nháp chưa gửi (chỉ người tải lên)
 *   POST   /projects/:pid/attachments/:aid/transcribe  phiên âm lại voice note (lỗi / hết trần / vừa cấu hình khoá)
 *
 * Gửi bình luận kèm tệp/trả lời: POST /projects/:pid/issues/:num/comments { bodyJson, parentId?, attachmentIds? }
 * (tuyến cũ ở work.routes.ts, thêm hai trường). Khách cổng KHÔNG gọi được các tuyến trên (không nằm trong danh sách
 * trắng CLIENT_ROUTES) — họ chỉ nghe/tải tệp của bình luận PUBLIC qua GET /attachments/:aid/url.
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as files from '../services/work/commentFiles.service.js';
import { VOICE_MAX_BYTES } from '../services/work/commentThreads.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}
const ok = (r: Response, data: unknown, status = 200) => r.status(status).json({ success: true, data });
function parse<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  try {
    return schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const first = err.issues[0];
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);

/** Tệp chỉ nằm trong RAM (audio là dữ liệu cá nhân — không ghi đĩa), đẩy thẳng lên R2 trong service. */
function receive(field: string, maxBytes: number, label: string) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxBytes, files: 1 } });
  return (req: Request, res: Response, next: NextFunction) => {
    up.single(field)(req, res, (err: unknown) => {
      if (!err) { next(); return; }
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError(`${label} must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller`, 413, 'WORK_FILE_TOO_LARGE'));
        return;
      }
      next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
    });
  };
}
/** multer đọc tên tệp theo latin1 ⇒ trả lại UTF-8 (tên tiếng Việt). */
const utf8Name = (n: string) => {
  try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; }
};

router.post('/projects/:pid/issues/:num/comment-files', receive('file', files.MAX_COMMENT_FILE_BYTES, 'Files'), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file to attach', 'WORK_FILE_EMPTY');
  ok(res, await files.uploadCommentFile(callerId(req), P(req, 'pid'), P(req, 'num'), { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype }), 201);
}));

router.post('/projects/:pid/issues/:num/comment-voice', receive('audio', VOICE_MAX_BYTES, 'Voice notes'), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('The recording is empty', 'WORK_VOICE_EMPTY');
  const { durationMs } = parse(z.object({ durationMs: z.coerce.number().int().min(0).max(3_600_000) }), req.body ?? {});
  ok(res, await files.uploadVoiceNote(callerId(req), P(req, 'pid'), P(req, 'num'), { buffer: f.buffer, mime: f.mimetype, durationMs }), 201);
}));

router.delete('/projects/:pid/comment-files/:aid', asyncHandler(async (req, res) => {
  ok(res, await files.discardDraft(callerId(req), P(req, 'pid'), P(req, 'aid')));
}));

router.post('/projects/:pid/attachments/:aid/transcribe', asyncHandler(async (req, res) => {
  ok(res, await files.retryTranscription(callerId(req), P(req, 'pid'), P(req, 'aid')));
}));

export default router;
