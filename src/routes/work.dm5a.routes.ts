/**
 * CT Work — dm5 G1 (27/11/2026): cổng quy trình & nhịp vận hành — các tuyến ĐỌC. Gắn trong work.routes.ts bằng `router.use`
 * (sau apiTokenAuth + authenticate + chốt /projects/:pid). Quyền kiểm trong service (project.view / retro team access).
 * Mọi tuyến GHI của gói đi qua tuyến có sẵn: PATCH /projects/:pid (settings — agent bị cấm sẵn), PUT …/transitions,
 * PATCH …/stages/:sid (ngày kế hoạch), PUT …/meetings/:num/actions (loại), POST …/retros/:rid/actions (trigger/verify).
 *
 *   GET /projects/:pid/sprints/:sid/guards   A14 thẻ chưa Ready · A15 ước lượng vs sức chứa × tập trung · A22 tỉ lệ Must
 *   GET /projects/:pid/early-warnings        A18 Blocked > 24h · P1–P2 đứng yên > 48h · burndown phẳng ≥ 3 ngày · thêm phạm vi
 *   GET /projects/:pid/rag                   A19 RAG 4 chiều + % hoàn thành có trọng số
 *   GET /projects/:pid/moscow                A22 ?sprintId= | ?versionId= (trống = mọi thẻ mở)
 *   GET /projects/:pid/board/ages            A18 tuổi thẻ (ngày ở cột hiện tại) cho board
 *   GET /projects/:pid/retros/:rid/facts     A12 số liệu sprint cho retro
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import * as dm5 from '../services/work/dm5a.service.js';
import { retroFacts } from '../services/work/retro.service.js';

const router = Router();

function callerId(req: Request): number {
  const v = req.userId ?? req.user?.userId;
  if (!v) throw new UnauthorizedError();
  return v;
}
const ok = (r: Response, data: unknown) => r.status(200).json({ success: true, data });
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

router.get('/projects/:pid/sprints/:sid/guards', asyncHandler(async (req, res) => { ok(res, await dm5.sprintGuards(callerId(req), P(req, 'pid'), P(req, 'sid'))); }));
router.get('/projects/:pid/early-warnings', asyncHandler(async (req, res) => { ok(res, await dm5.earlyWarnings(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/rag', asyncHandler(async (req, res) => { ok(res, await dm5.projectRag(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/moscow', asyncHandler(async (req, res) => {
  const q = parse(z.object({ sprintId: id.optional(), versionId: id.optional() }), req.query);
  ok(res, await dm5.moscowCheck(callerId(req), P(req, 'pid'), q));
}));
router.get('/projects/:pid/board/ages', asyncHandler(async (req, res) => { ok(res, await dm5.boardAges(callerId(req), P(req, 'pid'))); }));
router.get('/projects/:pid/retros/:rid/facts', asyncHandler(async (req, res) => { ok(res, await retroFacts(callerId(req), P(req, 'pid'), P(req, 'rid'))); }));

export default router;
