/**
 * CT Work — CTW đợt 4b (10/10/2026): SWR302 — hồ sơ Wiegers + dữ liệu & sáu liên kết. Gắn vào work.routes.ts bằng MỘT dòng
 * `router.use` (sau authenticate + chốt cổng khách + khoá chỉnh sửa) ⇒ khách bị cách ly không gọi được tuyến nào ở đây.
 *
 *   GET  /projects/:pid/swr                                   tổng quan (số đếm, trang mẫu đã có, sáu liên kết tóm tắt)
 *   Feature (R5)   GET|POST /swr/features · PATCH|DELETE /swr/features/:fe · POST /swr/features/:fe/links · DELETE …/links/:id
 *   Yêu cầu (R6)   GET /swr/requirements · PUT /swr/requirements/:num · POST /swr/requirements/:num/lifecycle
 *                  GET /swr/requirements/:num/history
 *   Ưu tiên (R12)  GET /swr/priority · POST /swr/priority/rows · PATCH|DELETE /swr/priority/rows/:id · POST /swr/priority/seed
 *   Glossary (R16) GET|POST /swr/glossary · PATCH|DELETE /swr/glossary/:id
 *   DD (R16)       GET|POST /swr/dictionary · PATCH|DELETE /swr/dictionary/:id
 *   Cấu hình       PUT /swr/settings {weights, declaredCounts, ignoredNouns, ignoreNoun}
 *   6 liên kết     GET /swr/six-links
 *   Tài liệu       GET /swr/docs/:kind · POST /swr/docs/:kind/fill · POST /swr/docs/:kind/export · GET /swr/docs/:kind/export.(docx|pdf)
 *                  (kind = vision-scope | use-cases | business-rules | srs | data-dictionary)
 *   Xuất xlsx      GET /swr/export/(priority|glossary|dictionary|features|six-links).xlsx
 *
 * Quyền kiểm TRONG service — route chỉ kiểm đầu vào.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { LIFECYCLE, REQ_TYPES, VS_SECTIONS } from '../services/work/swr.js';
import * as swr from '../services/work/swr.service.js';

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
const P = (req: Request, name: string) => parse(id, req.params[name]);
const feRef = (req: Request) => parse(z.string().regex(/^(?:FE-?)?\d{1,5}$/i, 'Use a feature number or "FE-3"'), req.params.fe);
const kind = (req: Request) => parse(z.enum(swr.DOC_KINDS), req.params.kind);
const fileOut = (res: Response, out: { buffer: Buffer; file: string }, type: string) => {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${out.file.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.file)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buffer);
};
const MIME = { docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } as const;

router.get('/projects/:pid/swr', asyncHandler(async (req, res) => ok(res, await swr.overview(callerId(req), P(req, 'pid')))));

// ─── Feature ─────────────────────────────────────────────────────

router.get('/projects/:pid/swr/features', asyncHandler(async (req, res) => ok(res, await swr.listFeatures(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/features', asyncHandler(async (req, res) => ok(res, await swr.createFeature(callerId(req), P(req, 'pid'), parse(swr.featureInput, req.body)), 201)));
router.patch('/projects/:pid/swr/features/:fe', asyncHandler(async (req, res) => ok(res, await swr.updateFeature(callerId(req), P(req, 'pid'), feRef(req), parse(swr.featureInput.partial().extend({ rev: z.number().int().min(0).optional() }), req.body ?? {})))));
router.delete('/projects/:pid/swr/features/:fe', asyncHandler(async (req, res) => ok(res, await swr.deleteFeature(callerId(req), P(req, 'pid'), feRef(req)))));
router.post('/projects/:pid/swr/features/:fe/links', asyncHandler(async (req, res) => ok(res, await swr.linkFeature(callerId(req), P(req, 'pid'), feRef(req), parse(swr.featureLinkInput, req.body)), 201)));
router.delete('/projects/:pid/swr/features/:fe/links/:id', asyncHandler(async (req, res) => ok(res, await swr.unlinkFeature(callerId(req), P(req, 'pid'), feRef(req), P(req, 'id')))));

// ─── Yêu cầu: phân loại + thuộc tính + vòng đời ──────────────────

router.get('/projects/:pid/swr/requirements', asyncHandler(async (req, res) => {
  const q = parse(z.object({ type: z.enum([...REQ_TYPES, 'UNCLASSIFIED']).optional(), lifecycle: z.enum(LIFECYCLE).optional(), q: z.string().max(200).optional() }), req.query);
  ok(res, await swr.listRequirements(callerId(req), P(req, 'pid'), q));
}));
router.put('/projects/:pid/swr/requirements/:num', asyncHandler(async (req, res) => ok(res, await swr.setRequirementInfo(callerId(req), P(req, 'pid'), P(req, 'num'), parse(swr.requirementInput, req.body ?? {})))));
router.post('/projects/:pid/swr/requirements/:num/lifecycle', asyncHandler(async (req, res) => {
  const b = parse(z.object({ to: z.enum(LIFECYCLE), note: z.string().max(500).nullable().optional() }), req.body);
  ok(res, await swr.setLifecycle(callerId(req), P(req, 'pid'), P(req, 'num'), b.to, b.note));
}));
router.get('/projects/:pid/swr/requirements/:num/history', asyncHandler(async (req, res) => ok(res, await swr.requirementHistory(callerId(req), P(req, 'pid'), P(req, 'num')))));

// ─── Bảng ưu tiên ────────────────────────────────────────────────

router.get('/projects/:pid/swr/priority', asyncHandler(async (req, res) => ok(res, await swr.getPriority(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/priority/rows', asyncHandler(async (req, res) => ok(res, await swr.upsertPriorityRow(callerId(req), P(req, 'pid'), parse(swr.priorityRowInput, req.body)), 201)));
router.patch('/projects/:pid/swr/priority/rows/:id', asyncHandler(async (req, res) => ok(res, await swr.updatePriorityRow(callerId(req), P(req, 'pid'), P(req, 'id'), parse(swr.priorityPatch, req.body ?? {})))));
router.delete('/projects/:pid/swr/priority/rows/:id', asyncHandler(async (req, res) => ok(res, await swr.removePriorityRow(callerId(req), P(req, 'pid'), P(req, 'id')))));
router.post('/projects/:pid/swr/priority/seed', asyncHandler(async (req, res) => ok(res, await swr.seedPriorityRows(callerId(req), P(req, 'pid'), parse(z.object({ kind: z.enum(['FE', 'UC']) }), req.body).kind))));

// ─── Glossary + Data Dictionary ──────────────────────────────────

router.get('/projects/:pid/swr/glossary', asyncHandler(async (req, res) => ok(res, await swr.listGlossary(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/glossary', asyncHandler(async (req, res) => ok(res, await swr.createTerm(callerId(req), P(req, 'pid'), parse(swr.glossaryInput, req.body)), 201)));
router.patch('/projects/:pid/swr/glossary/:id', asyncHandler(async (req, res) => ok(res, await swr.updateTerm(callerId(req), P(req, 'pid'), P(req, 'id'), parse(swr.glossaryInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/swr/glossary/:id', asyncHandler(async (req, res) => ok(res, await swr.deleteTerm(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.get('/projects/:pid/swr/dictionary', asyncHandler(async (req, res) => ok(res, await swr.listDictionary(callerId(req), P(req, 'pid')))));
router.post('/projects/:pid/swr/dictionary', asyncHandler(async (req, res) => ok(res, await swr.createElement(callerId(req), P(req, 'pid'), parse(swr.dataElementInput, req.body)), 201)));
router.patch('/projects/:pid/swr/dictionary/:id', asyncHandler(async (req, res) => ok(res, await swr.updateElement(callerId(req), P(req, 'pid'), P(req, 'id'), parse(swr.dataElementInput.partial(), req.body ?? {})))));
router.delete('/projects/:pid/swr/dictionary/:id', asyncHandler(async (req, res) => ok(res, await swr.deleteElement(callerId(req), P(req, 'pid'), P(req, 'id')))));

router.put('/projects/:pid/swr/settings', asyncHandler(async (req, res) => ok(res, await swr.updateSettings(callerId(req), P(req, 'pid'), parse(swr.settingsInput, req.body ?? {})))));
router.get('/projects/:pid/swr/six-links', asyncHandler(async (req, res) => ok(res, await swr.getSixLinks(callerId(req), P(req, 'pid')))));

// ─── Tài liệu Wiegers ────────────────────────────────────────────

router.get('/projects/:pid/swr/docs/:kind', asyncHandler(async (req, res) => ok(res, await swr.wiegersDoc(callerId(req), P(req, 'pid'), kind(req)))));
router.post('/projects/:pid/swr/docs/:kind/fill', asyncHandler(async (req, res) => {
  const b = parse(z.object({ create: z.boolean().optional(), version: z.number().int().nonnegative().optional(), sections: z.array(z.enum(VS_SECTIONS)).max(10).optional() }), req.body ?? {});
  const r = await swr.fillWiegersPage(callerId(req), P(req, 'pid'), kind(req), b);
  ok(res, r, r.created ? 201 : 200);
}));
router.post('/projects/:pid/swr/docs/:kind/export', asyncHandler(async (req, res) => {
  const b = parse(z.object({ format: z.enum(['docx', 'pdf']), diagrams: z.array(z.string().max(6_000_000).nullable()).max(60).optional() }), req.body);
  fileOut(res, await swr.exportWiegers(callerId(req), P(req, 'pid'), kind(req), b), MIME[b.format]);
}));
router.get('/projects/:pid/swr/docs/:kind/export.:fmt(docx|pdf)', asyncHandler(async (req, res) => {
  const fmt = parse(z.enum(['docx', 'pdf']), req.params.fmt);
  fileOut(res, await swr.exportWiegers(callerId(req), P(req, 'pid'), kind(req), { format: fmt }), MIME[fmt]);
}));

// ─── Xuất xlsx ───────────────────────────────────────────────────

const XLSX = {
  priority: swr.exportPriority, glossary: swr.exportGlossary, dictionary: swr.exportDictionary, features: swr.exportFeatures, 'six-links': swr.exportSixLinks,
} as const;
router.get('/projects/:pid/swr/export/:what(priority|glossary|dictionary|features|six-links).xlsx', asyncHandler(async (req, res) => {
  const what = parse(z.enum(['priority', 'glossary', 'dictionary', 'features', 'six-links']), req.params.what);
  fileOut(res, await XLSX[what](callerId(req), P(req, 'pid')), MIME.xlsx);
}));

export default router;
