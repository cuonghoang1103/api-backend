/**
 * CT Work đợt 1b (08/10/2026) — tài liệu kiểm thử chuẩn FPT (Report 5.1 Unit + 5.2 Integration).
 * Gắn VÀO work.routes.ts (một dòng `router.use` ở cuối, sau authenticate + chốt cổng khách) ⇒ khách bị cách ly ⇒ 403.
 *
 *   Cover:       GET/PUT /projects/:pid/fpt-tests/doc · POST …/changes · PATCH/DELETE …/changes/:id
 *   Unit:        GET/POST /projects/:pid/fpt-tests/unit · GET/PATCH/DELETE …/unit/:fid
 *                PUT …/unit/:fid/matrix (thay trọn, khoá lạc quan `version`) · POST …/unit/:fid/duplicate
 *                POST …/unit/:fid/ai-suggest (đề xuất — KHÔNG ghi)
 *   Integration: GET/POST /projects/:pid/fpt-tests/integration · GET/PATCH/DELETE …/integration/:mid
 *                PUT …/integration/:mid/cases
 *   Excel:       GET  /projects/:pid/fpt-tests/export?report=unit|integration[&module=]
 *                POST /projects/:pid/fpt-tests/import?report=auto|unit|integration&mode=append|replace&dryRun=1
 *                     thân = tệp .xlsx nhị phân (application/octet-stream) — tránh bẫy axios đổi FormData thành JSON.
 *
 * Quyền kiểm TRONG service (fptTests.service) — route chỉ kiểm đầu vào.
 */

import express, { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as fpt from '../services/work/fptTests.service.js';

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
      const where = first?.path.length ? `${first.path.join('.')}: ` : '';
      throw new AppError(`${where}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR', { errors: err.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: i.message })) });
    }
    throw err;
  }
}

const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const B = '/projects/:pid/fpt-tests';

// ─── Cover + Record of change ────────────────────────────────────
router.get(`${B}/doc`, asyncHandler(async (req, res) => ok(res, await fpt.getDoc(callerId(req), P(req, 'pid')))));
router.put(`${B}/doc`, asyncHandler(async (req, res) => ok(res, await fpt.updateDoc(callerId(req), P(req, 'pid'), parse(fpt.docInput, req.body)))));
router.post(`${B}/changes`, asyncHandler(async (req, res) => ok(res, await fpt.addChange(callerId(req), P(req, 'pid'), parse(fpt.changeInput, req.body)), 201)));
router.patch(`${B}/changes/:id`, asyncHandler(async (req, res) => ok(res, await fpt.updateChange(callerId(req), P(req, 'pid'), P(req, 'id'), parse(fpt.changeInput.partial(), req.body)))));
router.delete(`${B}/changes/:id`, asyncHandler(async (req, res) => {
  await fpt.deleteChange(callerId(req), P(req, 'pid'), P(req, 'id'));
  ok(res, { deleted: true });
}));

// ─── Unit test ───────────────────────────────────────────────────
router.get(`${B}/unit`, asyncHandler(async (req, res) => ok(res, await fpt.listFunctions(callerId(req), P(req, 'pid')))));
router.post(`${B}/unit`, asyncHandler(async (req, res) => {
  const body = parse(fpt.functionInput.extend({ starter: z.boolean().optional() }), req.body);
  ok(res, await fpt.createFunction(callerId(req), P(req, 'pid'), body), 201);
}));
router.get(`${B}/unit/:fid`, asyncHandler(async (req, res) => ok(res, await fpt.getFunction(callerId(req), P(req, 'pid'), P(req, 'fid')))));
router.patch(`${B}/unit/:fid`, asyncHandler(async (req, res) => {
  const body = parse(fpt.functionInput.partial(), req.body);
  if (!Object.keys(body).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
  ok(res, await fpt.updateFunction(callerId(req), P(req, 'pid'), P(req, 'fid'), body));
}));
router.delete(`${B}/unit/:fid`, asyncHandler(async (req, res) => {
  await fpt.deleteFunction(callerId(req), P(req, 'pid'), P(req, 'fid'));
  ok(res, { deleted: true });
}));
router.put(`${B}/unit/:fid/matrix`, asyncHandler(async (req, res) => ok(res, await fpt.saveMatrix(callerId(req), P(req, 'pid'), P(req, 'fid'), parse(fpt.matrixInput, req.body)))));
router.post(`${B}/unit/:fid/duplicate`, asyncHandler(async (req, res) => ok(res, await fpt.duplicateFunction(callerId(req), P(req, 'pid'), P(req, 'fid')), 201)));
router.post(`${B}/unit/:fid/ai-suggest`, asyncHandler(async (req, res) => {
  const body = parse(z.object({ signature: z.string().max(8000).nullable().optional(), extra: z.string().max(2000).nullable().optional() }), req.body ?? {});
  ok(res, await fpt.aiSuggest(callerId(req), P(req, 'pid'), P(req, 'fid'), body));
}));

// ─── Integration test ────────────────────────────────────────────
router.get(`${B}/integration`, asyncHandler(async (req, res) => ok(res, await fpt.listModules(callerId(req), P(req, 'pid')))));
router.post(`${B}/integration`, asyncHandler(async (req, res) => ok(res, await fpt.createModule(callerId(req), P(req, 'pid'), parse(fpt.moduleInput, req.body)), 201)));
router.get(`${B}/integration/:mid`, asyncHandler(async (req, res) => ok(res, await fpt.getModule(callerId(req), P(req, 'pid'), P(req, 'mid')))));
router.patch(`${B}/integration/:mid`, asyncHandler(async (req, res) => {
  const body = parse(fpt.moduleInput.partial(), req.body);
  if (!Object.keys(body).length) throw new BadRequestError('Nothing to change', 'VALIDATION_ERROR');
  ok(res, await fpt.updateModule(callerId(req), P(req, 'pid'), P(req, 'mid'), body));
}));
router.delete(`${B}/integration/:mid`, asyncHandler(async (req, res) => {
  await fpt.deleteModule(callerId(req), P(req, 'pid'), P(req, 'mid'));
  ok(res, { deleted: true });
}));
router.put(`${B}/integration/:mid/cases`, asyncHandler(async (req, res) => ok(res, await fpt.saveItCases(callerId(req), P(req, 'pid'), P(req, 'mid'), parse(fpt.itCasesInput, req.body)))));

// ─── Excel ───────────────────────────────────────────────────────
router.get(`${B}/export`, asyncHandler(async (req, res) => {
  const q = parse(z.object({ report: z.enum(['unit', 'integration']), module: z.string().max(120).optional() }), req.query);
  const out = await fpt.exportReport(callerId(req), P(req, 'pid'), q.report, { module: q.module });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
}));

const rawXlsx = express.raw({ type: () => true, limit: fpt.MAX_IMPORT_BYTES + 1024 });
router.post(`${B}/import`, rawXlsx, asyncHandler(async (req, res) => {
  const q = parse(z.object({
    report: z.enum(['auto', 'unit', 'integration']).default('auto'),
    mode: z.enum(['append', 'replace']).default('append'),
    dryRun: z.enum(['0', '1', 'true', 'false']).optional(),
  }), req.query);
  const buf = Buffer.isBuffer(req.body) ? req.body : null;
  if (!buf || !buf.length) throw new BadRequestError('Send the .xlsx file as the request body (application/octet-stream)', 'WORK_IMPORT_NO_FILE');
  ok(res, await fpt.importReport(callerId(req), P(req, 'pid'), buf, { report: q.report, mode: q.mode, dryRun: q.dryRun === '1' || q.dryRun === 'true' }));
}));

export default router;
