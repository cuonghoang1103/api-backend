/**
 * CT Work — ảnh/tệp gửi kèm câu hỏi CuongMini (22/10/2026). Xem `services/work/aiTep.ts`.
 *
 *   POST /projects/:pid/ai/files            multipart `file` (≤ 15 MB) ⇒ { key, name, mime, size, kind }
 *   GET  /projects/:pid/ai/files/url?key=…  ⇒ { url } ký sẵn 5 phút (xem lại tệp đã gửi trong hội thoại)
 *
 * Tải qua backend (multer trong RAM ⇒ R2) như tệp bình luận — chạy được cả app desktop (CSP chặn PUT thẳng R2).
 * Mount SAU authenticate (work.routes.ts); quyền dự án kiểm trong service (`ai.use` để tải, `project.view` để xem).
 */
import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { MAX_AI_FILE_BYTES, taiTepAi, urlTepAi } from '../services/work/aiTep.js';

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
const pid = (req: Request) => parse(z.coerce.number().int().positive(), req.params.pid);

const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_AI_FILE_BYTES, files: 1 } });
function receive(req: Request, res: Response, next: NextFunction) {
  up.single('file')(req, res, (err: unknown) => {
    if (!err) { next(); return; }
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(`Tệp phải ≤ ${Math.round(MAX_AI_FILE_BYTES / 1024 / 1024)} MB. / Files must be ${Math.round(MAX_AI_FILE_BYTES / 1024 / 1024)} MB or smaller.`, 413, 'WORK_FILE_TOO_LARGE'));
      return;
    }
    next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
  });
}
/** multer đọc tên tệp theo latin1 ⇒ trả lại UTF-8 (tên tiếng Việt). */
const utf8Name = (n: string) => {
  try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; }
};

router.post('/projects/:pid/ai/files', receive, asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Chọn một tệp. / Choose a file.', 'WORK_FILE_EMPTY');
  ok(res, await taiTepAi(callerId(req), pid(req), { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype }), 201);
}));

router.get('/projects/:pid/ai/files/url', asyncHandler(async (req, res) => {
  const { key } = parse(z.object({ key: z.string().min(10).max(400) }), req.query);
  ok(res, await urlTepAi(callerId(req), pid(req), key));
}));

export default router;
