/**
 * CT Work — dm5 G4 (27/11/2026): tuyến mới của gói "Code, phát hành, báo cáo theo vai, CR/RAID & dự án mẫu".
 * (Tuyến sửa trên đối tượng sẵn có nằm ở tệp tuyến của đối tượng đó: version ở work.routes, CR/RAID ở work.governance.routes,
 *  code ở work.code.routes.)
 *
 *   GET  /project-blueprints                              thư viện mẫu (5 bộ + nhóm tính năng + xem trước)
 *   POST /workspaces/:wsId/projects/preview               { blueprint, groups } | { fromProjectId } ⇒ xem trước, KHÔNG ghi
 *   GET  /projects/:pid/reports/hours-by-role?from&to&userId   C5: giờ theo vai C1–C5/tuần + cảnh báo
 *
 * Agent: hai tuyến đầu nằm NGOÀI /projects/:pid ⇒ bị chặn mặc định (agentTopRouteAllowed fail-closed); tuyến báo cáo chỉ đọc.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as bp from '../services/work/projectBlueprint.service.js';
import { hoursByRole } from '../services/work/timeActivity.service.js';
import { requireWorkspace } from '../services/work/permissions.js';

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

router.get('/project-blueprints', asyncHandler(async (req, res) => {
  callerId(req);
  ok(res, bp.listBlueprints());
}));

router.post('/workspaces/:wsId/projects/preview', asyncHandler(async (req, res) => {
  const wsId = parse(id, req.params.wsId);
  const body = parse(z.object({ blueprint: z.string().max(40).optional(), groups: z.record(z.string().max(20), z.boolean()).nullable().optional(), fromProjectId: id.optional() })
    .refine((b) => !!b.blueprint !== !!b.fromProjectId, 'Pick a template set OR a project to copy'), req.body ?? {});
  await requireWorkspace(callerId(req), wsId, 'workspace.createProject');
  ok(res, body.fromProjectId ? { kind: 'project', ...(await bp.previewFromProject(callerId(req), wsId, body.fromProjectId)) } : { kind: 'blueprint', ...bp.blueprintPreview(body.blueprint!, body.groups) });
}));

router.get('/projects/:pid/reports/hours-by-role', asyncHandler(async (req, res) => {
  const q = parse(z.object({ from: day.optional(), to: day.optional(), userId: id.optional() }), req.query);
  ok(res, await hoursByRole(callerId(req), parse(id, req.params.pid), q));
}));

export default router;
