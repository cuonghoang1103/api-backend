/**
 * CT Work — CTW Diagram (10/10/2026): DIAGRAM STUDIO. Gắn vào work.routes.ts bằng MỘT dòng `router.use` ở cuối (sau
 * authenticate + chốt cổng khách + khoá chỉnh sửa) ⇒ khách bị cách ly không gọi được tuyến nào ở đây (không có trong
 * CLIENT_ROUTES). Quyền kiểm TRONG diagrams.service — route chỉ kiểm đầu vào.
 *
 *   GET    /projects/:pid/diagrams?type=&status=&useCase=&issue=&q=      danh sách
 *   POST   /projects/:pid/diagrams                                       tạo {format,type,title,source,…}
 *   POST   /projects/:pid/diagrams/generate                              AI vẽ từ dữ liệu ⇒ PROPOSED
 *   POST   /projects/:pid/diagrams/import {fileName, content, base64?, page?, to?}
 *   POST   /projects/:pid/diagrams/fill-report {report: 3|4}
 *   GET    /projects/:pid/diagrams/:n                                    chi tiết + phiên bản + bình luận
 *   PATCH  /projects/:pid/diagrams/:n                                    sửa (nguồn đổi ⇒ phiên bản mới)
 *   DELETE /projects/:pid/diagrams/:n
 *   GET    /projects/:pid/diagrams/:n/versions/:v                       nguồn một phiên bản
 *   POST   /projects/:pid/diagrams/:n/versions/:v/restore
 *   POST   /projects/:pid/diagrams/:n/versions/:v/accept | /discard     đề xuất AI
 *   POST   /projects/:pid/diagrams/:n/approve {parsedOk?} · /unapprove
 *   POST   /projects/:pid/diagrams/:n/embed {page, mode, heading?}      chèn vào trang Docs
 *   GET    /projects/:pid/diagrams/page-headings/:num                    đề mục của trang (chọn chỗ chèn)
 *   POST   /projects/:pid/diagrams/:n/comments · PATCH|DELETE /diagrams/:n/comments/:cid
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import { DIAGRAM_FORMATS, DIAGRAM_STATUSES, DIAGRAM_TYPES, GENERATABLE } from '../services/work/diagram.js';
import * as dg from '../services/work/diagrams.service.js';

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
const optNum = z.number().int().positive().nullable().optional();

const base = {
  title: z.string().max(200).optional(),
  description: z.string().max(20_000).nullable().optional(),
  feature: z.string().max(120).nullable().optional(),
  type: z.enum(DIAGRAM_TYPES).optional(),
  source: z.string().max(6_000_000).optional(),
  issueNumber: optNum, useCase: optNum, pageNumber: optNum, previewImageId: optNum,
  note: z.string().max(300).nullable().optional(),
};

router.get('/projects/:pid/diagrams', asyncHandler(async (req, res) => {
  const q = parse(z.object({ type: z.enum(DIAGRAM_TYPES).optional(), status: z.enum(DIAGRAM_STATUSES).optional(), useCase: id.optional(), issue: id.optional(), q: z.string().max(200).optional() }), req.query);
  ok(res, await dg.listDiagrams(callerId(req), P(req, 'pid'), { type: q.type, status: q.status, useCase: q.useCase, issue: q.issue, text: q.q }));
}));

router.post('/projects/:pid/diagrams', asyncHandler(async (req, res) => {
  const b = parse(z.object({ ...base, format: z.enum(DIAGRAM_FORMATS).optional(), source: z.string().min(1).max(6_000_000) }), req.body);
  ok(res, await dg.createDiagram(callerId(req), P(req, 'pid'), b), 201);
}));

router.post('/projects/:pid/diagrams/generate', asyncHandler(async (req, res) => {
  const b = parse(z.object({
    type: z.enum(GENERATABLE), useCase: z.union([z.number().int().positive(), z.string().max(12)]).nullable().optional(), feature: z.string().max(120).nullable().optional(),
    entities: z.array(z.string().max(80)).max(30).nullable().optional(), source: z.enum(['auto', 'repo', 'dictionary', 'docs', 'workflow']).nullable().optional(),
    instruction: z.string().max(1000).nullable().optional(), title: z.string().max(200).nullable().optional(), issueNumber: optNum, update: optNum,
  }), req.body);
  ok(res, await dg.generateDiagram(callerId(req), P(req, 'pid'), b), 201);
}));

router.post('/projects/:pid/diagrams/import', asyncHandler(async (req, res) => {
  const b = parse(z.object({ fileName: z.string().min(1).max(255), content: z.string().min(1).max(9_000_000), base64: z.boolean().optional(), page: z.number().int().min(0).max(99).optional(), to: z.enum(['mermaid', 'native']).optional(), title: z.string().max(200).nullable().optional() }), req.body);
  ok(res, await dg.importDiagram(callerId(req), P(req, 'pid'), b), 201);
}));

router.post('/projects/:pid/diagrams/fill-report', asyncHandler(async (req, res) => {
  const b = parse(z.object({ report: z.union([z.literal(3), z.literal(4)]) }), req.body);
  ok(res, await dg.fillReport(callerId(req), P(req, 'pid'), b.report));
}));

router.get('/projects/:pid/diagrams/page-headings/:num', asyncHandler(async (req, res) => {
  await dg.diagramCtx(callerId(req), P(req, 'pid'));
  ok(res, await dg.pageHeadings(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

router.get('/projects/:pid/diagrams/:n', asyncHandler(async (req, res) => {
  ok(res, await dg.getDiagram(callerId(req), P(req, 'pid'), P(req, 'n')));
}));

router.patch('/projects/:pid/diagrams/:n', asyncHandler(async (req, res) => {
  const b = parse(z.object({ ...base, rev: z.number().int().min(0).optional() }), req.body);
  ok(res, await dg.updateDiagram(callerId(req), P(req, 'pid'), P(req, 'n'), b));
}));

router.delete('/projects/:pid/diagrams/:n', asyncHandler(async (req, res) => {
  ok(res, await dg.deleteDiagram(callerId(req), P(req, 'pid'), P(req, 'n')));
}));

router.get('/projects/:pid/diagrams/:n/versions/:v', asyncHandler(async (req, res) => {
  ok(res, await dg.getVersion(callerId(req), P(req, 'pid'), P(req, 'n'), P(req, 'v')));
}));

router.post('/projects/:pid/diagrams/:n/versions/:v/restore', asyncHandler(async (req, res) => {
  ok(res, await dg.restoreVersion(callerId(req), P(req, 'pid'), P(req, 'n'), P(req, 'v')));
}));

router.post('/projects/:pid/diagrams/:n/versions/:v/:action(accept|discard)', asyncHandler(async (req, res) => {
  ok(res, await dg.resolveProposal(callerId(req), P(req, 'pid'), P(req, 'n'), P(req, 'v'), req.params.action === 'accept'));
}));

router.post('/projects/:pid/diagrams/:n/:action(approve|unapprove)', asyncHandler(async (req, res) => {
  const b = parse(z.object({ parsedOk: z.boolean().optional() }), req.body ?? {});
  ok(res, await dg.setApproval(callerId(req), P(req, 'pid'), P(req, 'n'), { approve: req.params.action === 'approve', parsedOk: b.parsedOk }));
}));

router.post('/projects/:pid/diagrams/:n/embed', asyncHandler(async (req, res) => {
  const b = parse(z.object({ page: z.number().int().positive(), mode: z.enum(['latest', 'pinned']).optional(), heading: z.string().max(255).nullable().optional() }), req.body);
  ok(res, await dg.embedInPage(callerId(req), P(req, 'pid'), P(req, 'n'), b));
}));

router.post('/projects/:pid/diagrams/:n/comments', asyncHandler(async (req, res) => {
  const b = parse(z.object({ body: z.string().min(1).max(10_000), parentId: optNum, anchor: z.string().max(160).nullable().optional(), versionNumber: optNum }), req.body);
  ok(res, await dg.addComment(callerId(req), P(req, 'pid'), P(req, 'n'), b), 201);
}));

router.patch('/projects/:pid/diagrams/:n/comments/:cid', asyncHandler(async (req, res) => {
  const b = parse(z.object({ resolved: z.boolean().optional(), body: z.string().min(1).max(10_000).optional() }), req.body);
  ok(res, await dg.updateComment(callerId(req), P(req, 'pid'), P(req, 'n'), P(req, 'cid'), b));
}));

router.delete('/projects/:pid/diagrams/:n/comments/:cid', asyncHandler(async (req, res) => {
  ok(res, await dg.deleteComment(callerId(req), P(req, 'pid'), P(req, 'n'), P(req, 'cid')));
}));

export default router;
