/**
 * CT Work — đợt S5c (05/10/2026): HOÀN THIỆN. Gắn VÀO work.routes.ts (một dòng `router.use` ở cuối, sau authenticate +
 * chốt cổng khách) ⇒ mọi tuyến /projects/:pid/** ở đây đã qua `clientPortalRouteAllowed` (khách bị cách ly ⇒ 403
 * CLIENT_PORTAL_ONLY — không thêm mẫu tuyến khách nào).
 *
 *   - Mô-đun mới cho dự án cũ:  GET  /projects/:pid/studio/available · POST /projects/:pid/studio/apply-defaults
 *   - Thùng rác Docs:           GET  /projects/:pid/trash/pages · POST /projects/:pid/trash/pages/:num/restore ·
 *                               DELETE /projects/:pid/trash/pages/:num
 *   - Nhập lại dự án (ZIP S4):  POST /workspaces/:wsId/imports (multipart `file`, ≤ 200 MB) · GET …/imports ·
 *                               GET …/imports/:id · POST …/imports/:id/start · DELETE …/imports/:id
 *
 * Quyền kiểm TRONG service (moduleUpgrade / pageTrash / projectImport) — route chỉ kiểm đầu vào.
 */

import fs from 'node:fs';
import os from 'node:os';
import { Router, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as moduleUpgrade from '../services/work/moduleUpgrade.js';
import * as pageTrash from '../services/work/pageTrash.service.js';
import * as imports from '../services/work/projectImport.service.js';

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
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new BadRequestError(`${where}${first?.message ?? 'Invalid input'}`, 'VALIDATION_ERROR');
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);

// ═══ Mô-đun mới cho dự án cũ ═════════════════════════════════════════

router.get('/projects/:pid/studio/available', asyncHandler(async (req, res) => {
  ok(res, await moduleUpgrade.availableModules(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/studio/apply-defaults', asyncHandler(async (req, res) => {
  ok(res, await moduleUpgrade.applyStudioDefaults(callerId(req), P(req, 'pid')));
}));

// ═══ Thùng rác Docs ══════════════════════════════════════════════════

router.get('/projects/:pid/trash/pages', asyncHandler(async (req, res) => {
  ok(res, await pageTrash.listDeletedPages(callerId(req), P(req, 'pid')));
}));
router.post('/projects/:pid/trash/pages/:num/restore', asyncHandler(async (req, res) => {
  ok(res, await pageTrash.restorePage(callerId(req), P(req, 'pid'), P(req, 'num')));
}));
router.delete('/projects/:pid/trash/pages/:num', asyncHandler(async (req, res) => {
  ok(res, await pageTrash.purgePage(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

// ═══ Nhập lại dự án từ ZIP xuất trọn ═════════════════════════════════

// Tệp tạm trong os.tmpdir (KHÔNG phải đĩa dữ liệu) — service đẩy lên R2 ngay; route xoá tệp tạm trong finally.
const zipUpload = multer({
  storage: multer.diskStorage({ destination: os.tmpdir(), filename: (_req, _f, cb) => cb(null, `ctwork-import-up-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.zip`) }),
  limits: { fileSize: imports.IMPORT_MAX_BYTES, files: 1 },
});

function receiveZip(req: Request, res: Response, next: NextFunction) {
  zipUpload.single('file')(req, res, (err: unknown) => {
    if (!err) { next(); return; }
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError('The file is larger than 200 MB.', 413, 'WORK_IMPORT_TOO_LARGE'));
      return;
    }
    next(new BadRequestError('Could not read the uploaded file', 'WORK_IMPORT_BAD_FILE'));
  });
}

router.post('/workspaces/:wsId/imports', receiveZip, asyncHandler(async (req, res) => {
  const file = req.file;
  try {
    if (!file?.path) throw new BadRequestError('Choose a .zip file exported from CT Work', 'WORK_IMPORT_BAD_FILE');
    ok(res, await imports.uploadImport(callerId(req), P(req, 'wsId'), { path: file.path, originalName: file.originalname || 'project-export.zip', size: file.size }), 201);
  } finally {
    if (file?.path) await fs.promises.rm(file.path, { force: true }).catch(() => {});
  }
}));
router.get('/workspaces/:wsId/imports', asyncHandler(async (req, res) => {
  ok(res, await imports.listImports(callerId(req), P(req, 'wsId')));
}));
router.get('/workspaces/:wsId/imports/:id', asyncHandler(async (req, res) => {
  ok(res, await imports.getImport(callerId(req), P(req, 'wsId'), P(req, 'id')));
}));
router.post('/workspaces/:wsId/imports/:id/start', asyncHandler(async (req, res) => {
  const body = parse(z.object({ key: z.string().min(2).max(10), name: z.string().max(120).nullable().optional() }), req.body);
  ok(res, await imports.startImport(callerId(req), P(req, 'wsId'), P(req, 'id'), body), 202);
}));
router.delete('/workspaces/:wsId/imports/:id', asyncHandler(async (req, res) => {
  ok(res, await imports.cancelImport(callerId(req), P(req, 'wsId'), P(req, 'id')));
}));

export default router;
