/**
 * CT Work — "Create with CuongMini" (20/10/2026). Gắn trong work.routes.ts (sau apiTokenAuth + authenticate). Không nằm dưới
 * /projects/:pid ⇒ token agent bị chặn sẵn (agentTopRouteAllowed fail-closed); service còn chặn lần nữa (assertHumanActor).
 * Quyền kiểm TRONG service (taoCuongMini/banNhap.service.ts): chỉ người tạo bản nháp + workspace.createProject.
 *
 *   GET    /workspaces/:wsId/setup/models            ô chọn model (tên CuongMini; header x-cuongmini-ve = vé khoá)
 *   POST   /workspaces/:wsId/setup/unlock            { matKhau, ve? } ⇒ vé khoá chung 48 h (cùng khoá CuongMini CLI)
 *   POST   /workspaces/:wsId/setup/roster            multipart `file` (.xlsx/.csv/.txt) HOẶC { text } ⇒ danh sách thành viên
 *   GET    /workspaces/:wsId/setup-drafts            bản nháp của tôi trong không gian
 *   POST   /workspaces/:wsId/setup-drafts            { mode, input, model } ⇒ bản nháp mới
 *   GET    /setup-drafts/:id                         bản nháp (tiến độ job, tóm tắt, kế hoạch, kết quả)
 *   PATCH  /setup-drafts/:id                         { input?, understanding?, plan?, model?, mode? }
 *   DELETE /setup-drafts/:id
 *   POST   /setup-drafts/:id/files                   multipart `file` + category + note (≤ WORK_MAX_FILE_MB)
 *   POST   /setup-drafts/:id/links                   { url, category, note?, branch? }
 *   DELETE /setup-drafts/:id/sources/:sid
 *   POST   /setup-drafts/:id/understand              { reread?, ve?, model? } ⇒ job đọc & tóm tắt
 *   POST   /setup-drafts/:id/accept                  { understanding?, ve?, reviewFirst?, sendInvites? } ⇒ job lập kế hoạch (+ tạo)
 *   POST   /setup-drafts/:id/revise                  { instruction, ve? } ⇒ job "nhờ CuongMini sửa"
 *   POST   /setup-drafts/:id/rebalance               giao lại + xếp lịch lại (không gọi model)
 *   POST   /setup-drafts/:id/apply                   { sendInvites? } ⇒ job tạo dự án
 *   POST   /setup-drafts/:id/cancel
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import * as svc from '../services/work/taoCuongMini/banNhap.service.js';
import { modelChoGiaoDien } from '../services/work/taoCuongMini/goiModel.js';
import { CAP, SOURCE_CATEGORIES } from '../services/work/taoCuongMini/kieu.js';
import { requireWorkspace, assertHumanActor } from '../services/work/permissions.js';
import { tooLargeMessage } from '../services/work/limits.js';

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
      throw new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR');
    }
    throw err;
  }
}
const idOf = (req: Request, name: string) => parse(z.coerce.number().int().positive(), req.params[name]);

function receive(field: string) {
  const up = multer({ storage: multer.memoryStorage(), limits: { fileSize: CAP.fileBytes, files: 1 } });
  return (req: Request, res: Response, next: NextFunction) => {
    up.single(field)(req, res, (err: unknown) => {
      if (!err) { next(); return; }
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') { next(new AppError(tooLargeMessage(CAP.fileBytes), 413, 'WORK_FILE_TOO_LARGE')); return; }
      next(new BadRequestError('Could not read the uploaded file', 'WORK_BAD_UPLOAD'));
    });
  };
}
/** multer đọc tên tệp theo latin1 ⇒ trả lại UTF-8 (tên tiếng Việt). */
const utf8Name = (n: string) => { try { return Buffer.from(n, 'latin1').toString('utf8'); } catch { return n; } };

const ve = z.string().max(4000).optional();
const modelId = z.enum(['cm-sonic', 'cm-optimum']).optional();

// ─── Model + khoá ───────────────────────────────────────────────

router.get('/workspaces/:wsId/setup/models', asyncHandler(async (req, res) => {
  const uid = callerId(req);
  await requireWorkspace(uid, idOf(req, 'wsId'), 'workspace.createProject');
  ok(res, await modelChoGiaoDien(uid, String(req.headers['x-cuongmini-ve'] ?? '').slice(0, 4000) || undefined));
}));

router.post('/workspaces/:wsId/setup/unlock', asyncHandler(async (req, res) => {
  const uid = callerId(req);
  await assertHumanActor(uid, 'unlock CuongMini models');
  await requireWorkspace(uid, idOf(req, 'wsId'), 'workspace.createProject');
  const b = parse(z.object({ matKhau: z.string().max(200), ve }), req.body ?? {});
  const { moKhoa } = await import('../services/agent/anthropicChinhHang/ve.js');
  const { MoKhoaLoi } = await import('../services/agent/congDuPhong.js');
  try {
    const kq = await moKhoa(uid, b.matKhau, { boCu: b.ve, canMo: 'chung' });
    logger.info('[tao-cuongmini] mở khoá CuongMini Optimum', { userId: uid });
    ok(res, { ve: kq.ve, hetHan: kq.hetHan, unlocked: kq.mo.chung });
  } catch (err) {
    if (err instanceof MoKhoaLoi) {
      const status = err.code === 'THU_QUA_NHIEU' ? 429 : err.code === 'CHUA_BAT' ? 409 : 403;
      const en = err.code === 'THU_QUA_NHIEU' ? 'Too many wrong attempts. Try again in 15 minutes.' : err.code === 'CHUA_BAT' ? 'This model is not available yet.' : 'Wrong key.';
      throw new AppError(en, status, `WORK_SETUP_${err.code}`, { vi: err.message, en });
    }
    throw err;
  }
}));

// ─── Danh sách thành viên ───────────────────────────────────────

router.post('/workspaces/:wsId/setup/roster', receive('file'), asyncHandler(async (req, res) => {
  const uid = callerId(req);
  if (req.file?.buffer?.length) {
    ok(res, await svc.parseRoster(uid, idOf(req, 'wsId'), { file: { buffer: req.file.buffer, fileName: utf8Name(req.file.originalname || 'roster.csv') } }));
    return;
  }
  const b = parse(z.object({ text: z.string().max(400_000) }), req.body ?? {});
  ok(res, await svc.parseRoster(uid, idOf(req, 'wsId'), { text: b.text }));
}));

// ─── Bản nháp ───────────────────────────────────────────────────

router.get('/workspaces/:wsId/setup-drafts', asyncHandler(async (req, res) => {
  ok(res, await svc.listDrafts(callerId(req), idOf(req, 'wsId')));
}));

router.post('/workspaces/:wsId/setup-drafts', asyncHandler(async (req, res) => {
  const b = parse(z.object({ mode: z.enum(['PROJECT', 'WORKSPACE']).optional(), input: z.unknown().optional(), model: modelId }), req.body ?? {});
  ok(res, await svc.createDraft(callerId(req), idOf(req, 'wsId'), b), 201);
}));

router.get('/setup-drafts/:id', asyncHandler(async (req, res) => {
  ok(res, await svc.getDraft(callerId(req), idOf(req, 'id')));
}));

router.patch('/setup-drafts/:id', asyncHandler(async (req, res) => {
  const b = parse(z.object({ input: z.unknown().optional(), understanding: z.unknown().optional(), plan: z.unknown().optional(), model: modelId, mode: z.enum(['PROJECT', 'WORKSPACE']).optional() }), req.body ?? {});
  ok(res, await svc.updateDraft(callerId(req), idOf(req, 'id'), b));
}));

router.delete('/setup-drafts/:id', asyncHandler(async (req, res) => {
  ok(res, await svc.deleteDraft(callerId(req), idOf(req, 'id')));
}));

router.post('/setup-drafts/:id/files', receive('file'), asyncHandler(async (req, res) => {
  const f = req.file;
  if (!f?.buffer?.length) throw new BadRequestError('Choose a file', 'WORK_FILE_EMPTY');
  const meta = parse(z.object({ category: z.enum(SOURCE_CATEGORIES).default('BRIEF'), note: z.string().max(500).optional() }), req.body ?? {});
  ok(res, await svc.addFile(callerId(req), idOf(req, 'id'), { buffer: f.buffer, fileName: utf8Name(f.originalname || 'file'), mime: f.mimetype || 'application/octet-stream' }, meta), 201);
}));

router.post('/setup-drafts/:id/links', asyncHandler(async (req, res) => {
  const b = parse(z.object({ url: z.string().min(4).max(2000), category: z.enum(SOURCE_CATEGORIES).default('OTHER'), note: z.string().max(500).optional(), branch: z.string().max(120).optional() }), req.body ?? {});
  ok(res, await svc.addLink(callerId(req), idOf(req, 'id'), b), 201);
}));

router.delete('/setup-drafts/:id/sources/:sid', asyncHandler(async (req, res) => {
  ok(res, await svc.removeSource(callerId(req), idOf(req, 'id'), parse(z.string().min(1).max(40), req.params.sid)));
}));

router.post('/setup-drafts/:id/understand', asyncHandler(async (req, res) => {
  const b = parse(z.object({ reread: z.string().max(6000).optional(), ve, model: modelId }), req.body ?? {});
  ok(res, await svc.startUnderstand(callerId(req), idOf(req, 'id'), b), 202);
}));

router.post('/setup-drafts/:id/accept', asyncHandler(async (req, res) => {
  const b = parse(z.object({ understanding: z.unknown().optional(), ve, reviewFirst: z.boolean().optional(), sendInvites: z.boolean().optional() }), req.body ?? {});
  ok(res, await svc.acceptUnderstanding(callerId(req), idOf(req, 'id'), b), 202);
}));

router.post('/setup-drafts/:id/revise', asyncHandler(async (req, res) => {
  const b = parse(z.object({ instruction: z.string().min(1).max(4000), ve }), req.body ?? {});
  ok(res, await svc.revise(callerId(req), idOf(req, 'id'), b), 202);
}));

router.post('/setup-drafts/:id/rebalance', asyncHandler(async (req, res) => {
  ok(res, await svc.rebalance(callerId(req), idOf(req, 'id')));
}));

router.post('/setup-drafts/:id/apply', asyncHandler(async (req, res) => {
  const b = parse(z.object({ sendInvites: z.boolean().optional() }), req.body ?? {});
  ok(res, await svc.startApply(callerId(req), idOf(req, 'id'), b), 202);
}));

router.post('/setup-drafts/:id/cancel', asyncHandler(async (req, res) => {
  ok(res, await svc.cancelJob(callerId(req), idOf(req, 'id')));
}));

/* Đầu vào sai mà service tự `parse` (bản nháp, tóm tắt…) ⇒ 400 có đường dẫn trường, không phải 500. */
router.use((err: unknown, _req: Request, _res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const first = err.issues[0];
    next(new AppError(`${first?.path.length ? `${first.path.join('.')}: ` : ''}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR'));
    return;
  }
  next(err);
});

export default router;
