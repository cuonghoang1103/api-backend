/**
 * CT Work — tuyến ĐỌC cho giao diện AI agent (CTW-28 GĐ1 A13–A14). Gắn trong work.routes.ts ngay sau agentsRoutes
 * (đã qua apiTokenAuth + authenticate + chốt /projects/:pid + chốt cổng khách). Service: services/work/agentUi.service.ts.
 *
 *   GET /projects/:pid/agent-leases                 chip lease trên board/backlog/list
 *   GET /me/agents-need-you                          My Work "My agents need you" (token agent ⇒ 403 ở agentTopRouteAllowed)
 *   GET /workspaces/:wsId/agents/:agentId/leases     trang chi tiết agent: lease đang giữ + gần đây kèm mã thẻ
 */

import { Router, type Request } from 'express';
import { z } from 'zod';
import { AppError, asyncHandler, UnauthorizedError } from '../middleware/errorHandler.js';
import { agentLeasesDetail, agentsNeedMe, projectLeases } from '../services/work/agentUi.service.js';

const router = Router();

function callerId(req: Request): number {
  const id = req.userId ?? req.user?.userId;
  if (!id) throw new UnauthorizedError();
  return id;
}

const P = (req: Request, name: string) => {
  const r = z.coerce.number().int().positive().safeParse(req.params[name]);
  if (!r.success) throw new AppError(`${name}: invalid id`, 400, 'VALIDATION_ERROR');
  return r.data;
};

router.get('/projects/:pid/agent-leases', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await projectLeases(callerId(req), P(req, 'pid')) });
}));

router.get('/me/agents-need-you', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await agentsNeedMe(callerId(req)) });
}));

router.get('/workspaces/:wsId/agents/:agentId/leases', asyncHandler(async (req, res) => {
  res.json({ success: true, data: await agentLeasesDetail(callerId(req), P(req, 'wsId'), P(req, 'agentId')) });
}));

export default router;
