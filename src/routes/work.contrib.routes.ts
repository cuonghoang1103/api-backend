/**
 * CT Work — ĐÓNG GÓP & HIỆU SUẤT THÀNH VIÊN + ĐÁNH GIÁ CHÉO (10/10/2026). Mọi tuyến sau authenticate, dưới
 * /projects/:pid/contrib — quyền ở contrib.service `contribGate` (ADMIN/TEACHER thấy tất, MEMBER chỉ mình + tổng nhóm,
 * khách/GUEST/agent 403). Agent còn bị chặn ở tầng tuyến (AGENT_DENIED_ROUTES `/contrib`). Khách bị cách ly không có
 * tuyến này trong danh sách trắng cổng khách ⇒ 403 CLIENT_PORTAL_ONLY trước khi tới đây.
 *
 *   GET    /contrib/summary?preset=&from=&to=&sprintId=&stageId=&compare=   bảng thành viên + KPI nhóm + biểu đồ
 *   GET    /contrib/members/:uid?…                                            chi tiết một người (mình, hoặc ai cũng được nếu thấy tất)
 *   GET    /contrib/issues/:num                                               xem theo task: ai đã làm gì trên thẻ
 *   GET    /contrib/export.xlsx?… · /contrib/export.pdf?…                     xuất (người thấy từng thành viên)
 *   PUT    /contrib/settings                                                  { teamVisible?, timezone?, silentDays? } — ADMIN
 *   GET    /contrib/git-authors · PUT /contrib/git-authors                    ánh xạ tác giả commit ⇒ người — ADMIN
 *   GET    /contrib/peer/rounds · POST /contrib/peer/rounds                   đợt đánh giá chéo (tạo: ADMIN/TEACHER)
 *   GET|PATCH|DELETE /contrib/peer/rounds/:id
 *   PUT    /contrib/peer/rounds/:id/reviews/:uid                              { scores, comment } — phiếu của mình
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as contrib from '../services/work/contrib.service.js';
import { exportPdf, exportXlsx } from '../services/work/contribExport.js';
import * as peer from '../services/work/contribPeer.service.js';
import { RANGE_PRESETS } from '../services/work/contribRules.js';

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
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const rangeQ = z.object({
  preset: z.enum(RANGE_PRESETS).optional(),
  from: day.optional(),
  to: day.optional(),
  sprintId: id.optional(),
  stageId: id.optional(),
  compare: z.enum(['0', '1', 'true', 'false']).optional().transform((v) => (v === undefined ? undefined : v === '1' || v === 'true')),
});
const range = (req: Request): contrib.ContribQuery => parse(rangeQ, req.query);

const fileOut = (res: Response, out: { buf: Buffer; fileName: string }, type: string) => {
  res.setHeader('Content-Type', type);
  res.setHeader('Content-Disposition', `attachment; filename="${out.fileName.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(out.fileName)}`);
  res.setHeader('Cache-Control', 'no-store');
  res.send(out.buf);
};

router.get('/projects/:pid/contrib/summary', asyncHandler(async (req, res) => {
  ok(res, await contrib.summary(callerId(req), P(req, 'pid'), range(req)));
}));

router.get('/projects/:pid/contrib/members/:uid', asyncHandler(async (req, res) => {
  ok(res, await contrib.memberDetail(callerId(req), P(req, 'pid'), P(req, 'uid'), range(req)));
}));

router.get('/projects/:pid/contrib/issues/:num', asyncHandler(async (req, res) => {
  ok(res, await contrib.taskView(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

router.get('/projects/:pid/contrib/export.xlsx', asyncHandler(async (req, res) => {
  fileOut(res, await exportXlsx(callerId(req), P(req, 'pid'), range(req)), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}));

router.get('/projects/:pid/contrib/export.pdf', asyncHandler(async (req, res) => {
  fileOut(res, await exportPdf(callerId(req), P(req, 'pid'), range(req)), 'application/pdf');
}));

router.put('/projects/:pid/contrib/settings', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    teamVisible: z.boolean().optional(),
    timezone: z.string().min(1).max(64).optional(),
    silentDays: z.number().int().min(2).max(30).optional(),
  }).strict(), req.body);
  ok(res, await contrib.updateContribSettings(callerId(req), P(req, 'pid'), body));
}));

router.get('/projects/:pid/contrib/git-authors', asyncHandler(async (req, res) => {
  ok(res, await contrib.gitAuthors(callerId(req), P(req, 'pid')));
}));

router.put('/projects/:pid/contrib/git-authors', asyncHandler(async (req, res) => {
  const body = parse(z.object({ identity: z.string().min(1).max(200), userId: id.nullable() }), req.body);
  ok(res, await contrib.setGitIdentity(callerId(req), P(req, 'pid'), body.identity, body.userId));
}));

// ─── Đánh giá chéo ───────────────────────────────────────────────

const criteriaIn = z.array(z.object({ key: z.string().max(32).optional(), label: z.string().min(1).max(60), description: z.string().max(300).optional() })).min(3).max(6);

router.get('/projects/:pid/contrib/peer/rounds', asyncHandler(async (req, res) => {
  ok(res, await peer.listRounds(callerId(req), P(req, 'pid')));
}));

router.post('/projects/:pid/contrib/peer/rounds', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().trim().min(1).max(160),
    scope: z.enum(['SPRINT', 'STAGE', 'CUSTOM']).optional(),
    sprintId: id.nullable().optional(),
    stageId: id.nullable().optional(),
    criteria: criteriaIn.optional(),
    closesAt: z.coerce.date().nullable().optional(),
  }), req.body);
  ok(res, await peer.createRound(callerId(req), P(req, 'pid'), body), 201);
}));

router.get('/projects/:pid/contrib/peer/rounds/:rid', asyncHandler(async (req, res) => {
  ok(res, await peer.getRound(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));

router.patch('/projects/:pid/contrib/peer/rounds/:rid', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    title: z.string().trim().min(1).max(160).optional(),
    status: z.enum(['OPEN', 'CLOSED']).optional(),
    closesAt: z.coerce.date().nullable().optional(),
  }), req.body);
  ok(res, await peer.updateRound(callerId(req), P(req, 'pid'), P(req, 'rid'), body));
}));

router.delete('/projects/:pid/contrib/peer/rounds/:rid', asyncHandler(async (req, res) => {
  ok(res, await peer.deleteRound(callerId(req), P(req, 'pid'), P(req, 'rid')));
}));

router.put('/projects/:pid/contrib/peer/rounds/:rid/reviews/:uid', asyncHandler(async (req, res) => {
  const body = parse(z.object({ scores: z.record(z.number().int().min(1).max(5)), comment: z.string().max(2000).nullable().optional() }), req.body);
  ok(res, await peer.submitReview(callerId(req), P(req, 'pid'), P(req, 'rid'), P(req, 'uid'), body));
}));

export default router;
