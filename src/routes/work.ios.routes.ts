/**
 * CT Work — tuyến bổ sung cho app iOS CT Work riêng (18/10/2026). Gắn CUỐI work.routes.ts (đã qua apiTokenAuth +
 * authenticate + 2FA + khoá sửa + chốt /projects/:pid cho agent & khách cổng).
 *
 *   POST /report                                                    báo cáo nội dung (App Store 1.2) — mọi loại, một cửa
 *   POST /projects/:pid/chat/channels/:cid/messages/:mid/report    lối tắt: báo cáo tin chat
 *   POST /projects/:pid/meetings/:num/report                       lối tắt: báo cáo ghi chú cuộc họp
 *   POST /projects/:pid/chat/dm {userId}                           nhắn riêng 1-1 (trả kênh cũ nếu đã có)
 *   GET  /me/agenda?from&to                                        lịch xuyên dự án của tôi
 *   GET  /me/timesheet?week=                                       giờ của tôi trong tuần, mọi dự án
 *   GET  /me/people                                                Thành viên mọi không gian của tôi + trạng thái hoạt động (21/10)
 *   GET  /projects/:pid/dashboards/:dashId                         một dashboard
 *   GET  /projects/:pid/swr/requirements/:num                      một yêu cầu SWR302 (gọn, không dựng cả danh sách)
 *
 * Agent: /report + /me/agenda + /me/timesheet nằm NGOÀI /projects/:pid ⇒ agentTopRouteAllowed chặn (fail-closed);
 * /chat/** và /meetings/:n/report nằm trong AGENT_DENIED_ROUTES. Khách cổng: chỉ báo cáo tin chat (kênh CLIENT họ thấy)
 * + bình luận thẻ (allowlist permissions.ts); `/chat/dm` bị loại khỏi allowlist của khách.
 */

import { Router, type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { prisma } from '../config/database.js';
import { AppError, asyncHandler, NotFoundError, UnauthorizedError } from '../middleware/errorHandler.js';
import { openDm } from '../services/work/chat.service.js';
import { REPORT_KINDS, REPORT_REASONS, reportContent } from '../services/work/contentReport.service.js';
import { myAgenda, myTimesheet } from '../services/work/meAgenda.service.js';
import { getDashboard } from '../services/work/search.service.js';
import { getRequirement } from '../services/work/swr.service.js';
import { listPeople } from '../services/work/people.service.js';
import { loadGate } from '../services/work/twoFactor.js';

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
      throw new AppError(`${where}${first?.message ?? 'Invalid input'}`, 400, 'VALIDATION_ERROR', { errors: err.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: i.message })) });
    }
    throw err;
  }
}
const id = z.coerce.number().int().positive();
const P = (req: Request, name: string) => parse(id, req.params[name]);
const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
/** `detail` (app) hoặc `details` (tuyến bình luận thẻ cũ) — nhận cả hai. */
const reportBody = z.object({
  reason: z.enum(REPORT_REASONS),
  detail: z.string().max(1000).nullable().optional(),
  details: z.string().max(1000).nullable().optional(),
});

// ─── Báo cáo nội dung ────────────────────────────────────────────

router.post('/report', asyncHandler(async (req, res) => {
  const b = parse(reportBody.extend({ kind: z.enum(REPORT_KINDS), id }), req.body);
  ok(res, await reportContent(callerId(req), { kind: b.kind, id: b.id, reason: b.reason, detail: b.detail ?? b.details ?? null }), 201);
}));

router.post('/projects/:pid/chat/channels/:cid/messages/:mid/report', asyncHandler(async (req, res) => {
  const b = parse(reportBody, req.body);
  const mid = P(req, 'mid');
  const m = await prisma.workChannelMessage.findFirst({ where: { id: mid, channelId: P(req, 'cid'), channel: { projectId: P(req, 'pid') } }, select: { id: true } });
  if (!m) throw new NotFoundError('Message not found');
  ok(res, await reportContent(callerId(req), { kind: 'chat_message', id: mid, reason: b.reason, detail: b.detail ?? b.details ?? null }), 201);
}));

router.post('/projects/:pid/meetings/:num/report', asyncHandler(async (req, res) => {
  const b = parse(reportBody, req.body);
  const m = await prisma.workMeeting.findFirst({ where: { projectId: P(req, 'pid'), number: P(req, 'num'), deletedAt: null }, select: { id: true } });
  if (!m) throw new NotFoundError('Meeting not found');
  ok(res, await reportContent(callerId(req), { kind: 'meeting_note', id: m.id, reason: b.reason, detail: b.detail ?? b.details ?? null }), 201);
}));

// ─── Nhắn riêng 1-1 ──────────────────────────────────────────────

router.post('/projects/:pid/chat/dm', asyncHandler(async (req, res) => {
  const { userId } = parse(z.object({ userId: id }), req.body);
  const r = await openDm(callerId(req), P(req, 'pid'), userId);
  ok(res, r, r.created ? 201 : 200);
}));

// ─── Xuyên dự án của tôi ─────────────────────────────────────────

router.get('/me/agenda', asyncHandler(async (req, res) => {
  ok(res, await myAgenda(callerId(req), parse(z.object({ from: ymd.optional(), to: ymd.optional() }), req.query)));
}));
router.get('/me/timesheet', asyncHandler(async (req, res) => {
  ok(res, await myTimesheet(callerId(req), parse(z.object({ week: ymd.optional() }), req.query)));
}));
// Thành viên (21/10/2026, app iOS tab Chat › Thành viên): mọi người cùng không gian + trạng thái hoạt động kiểu Messenger.
// Không gian đang bị cổng 2FA chặn (không phải GRACE) ⇒ bỏ qua, đúng như GET /workspaces không đếm người ở đó.
router.get('/me/people', asyncHandler(async (req, res) => {
  const userId = callerId(req);
  const gate = req.workToken ? new Map() : await loadGate(userId, req.user);
  const boQua = new Set<number>([...gate.entries()].filter(([, g]) => g.state !== 'GRACE').map(([wsId]) => wsId));
  const { getOnlineUserIds } = await import('../socket/messaging.socket.js');
  ok(res, await listPeople(userId, { boQua, dangNoi: getOnlineUserIds() }));
}));

// ─── Đọc gọn một mục ─────────────────────────────────────────────

router.get('/projects/:pid/dashboards/:dashId', asyncHandler(async (req, res) => {
  ok(res, await getDashboard(callerId(req), P(req, 'pid'), P(req, 'dashId')));
}));
router.get('/projects/:pid/swr/requirements/:num', asyncHandler(async (req, res) => {
  ok(res, await getRequirement(callerId(req), P(req, 'pid'), P(req, 'num')));
}));

export default router;
