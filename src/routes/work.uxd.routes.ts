/**
 * CT Work UX-D (09/10/2026) — LINK PREVIEW & ẢNH BÌA.
 *
 * `uxdPublicRoutes` (gắn TRƯỚC authenticate, trước cả tuyến /invites/:token) — dữ liệu rút gọn cho ảnh Open Graph:
 *   GET /public/invite-card/:token            lời mời: workspace, dự án (+bìa), người mời (+ảnh), số thành viên; KHÔNG email
 *   GET /public/share-card/:token             link công khai chỉ đọc: dự án (+bìa), % tiến độ, sprint hiện tại
 *   GET /public/workspace-card/:slug          trang cần đăng nhập: chỉ tên + logo workspace
 *   GET /public/portal-card/:slug/:key        cổng khách: tên + logo workspace + màu dự án
 *   (+ rate-limit dùng chung cho GET /invites/:token — trang mời công khai)
 *   Token sai/hết hạn/đã dùng hết ⇒ 200 `{ status: 'UNAVAILABLE' }` — ảnh trung tính, không dò được gì.
 *   Trần: WORK_PUBLIC_CARD_RPM lượt/phút/IP (mặc định 60) — riêng, ngoài trần chung /api. IP = mục PHẢI NHẤT
 *   của X-Forwarded-For (nginx ghi; Next gọi nội bộ chuyển tiếp IP thật của khách) như index.ts.
 *
 * `default` (sau authenticate, chỉ ADMIN dự án — kiểm trong service):
 *   PUT  /projects/:pid/cover                 { preset?: id|null, positionY?: 0–100 }
 *   POST /projects/:pid/cover/upload?positionY=  thân = byte ảnh PNG/JPEG/WebP ≤ 8 MB ⇒ nén JPEG, lưu R2
 *   POST /projects/:pid/avatar/upload · POST /workspaces/:wsId/logo/upload   thân = byte ảnh ≤ 5 MB ⇒ PNG ≤ 512px
 *        (thay đường presign → PUT thẳng R2 đã hỏng "Failed to fetch" trên production/app desktop)
 */

import express, { Router, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z, ZodError } from 'zod';
import { asyncHandler, BadRequestError, UnauthorizedError } from '../middleware/errorHandler.js';
import * as cards from '../services/work/publicCards.service.js';
import * as cover from '../services/work/projectCover.service.js';
import { COVER_PRESETS } from '../services/work/covers.js';

export const uxdPublicRoutes = Router();
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
const pid = (req: Request) => parse(z.coerce.number().int().positive(), req.params.pid);

/** IP khách: mục phải nhất của X-Forwarded-For (proxy của mình ghi, khách không giả được) — cùng luật index.ts. */
export function clientIp(req: Request): string {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || 'unknown';
}

const cardLimiter = rateLimit({
  windowMs: 60_000,
  max: () => Number(process.env.WORK_PUBLIC_CARD_RPM || 60),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientIp,
  validate: false,
  message: { success: false, message: 'Too many requests. Please try again in a minute.', code: 'RATE_LIMIT_EXCEEDED' },
});

const noStore = (res: Response) => res.setHeader('Cache-Control', 'no-store');

uxdPublicRoutes.get('/invites/:token', cardLimiter); // tuyến gốc ở work.routes.ts — chỉ thêm trần lượt gọi
uxdPublicRoutes.get('/public/invite-card/:token', cardLimiter, asyncHandler(async (req, res) => {
  noStore(res); ok(res, await cards.inviteCard(String(req.params.token)));
}));
uxdPublicRoutes.get('/public/share-card/:token', cardLimiter, asyncHandler(async (req, res) => {
  noStore(res); ok(res, await cards.shareCard(String(req.params.token)));
}));
uxdPublicRoutes.get('/public/workspace-card/:slug', cardLimiter, asyncHandler(async (req, res) => {
  noStore(res); ok(res, await cards.workspaceCard(String(req.params.slug)));
}));
uxdPublicRoutes.get('/public/portal-card/:slug/:key', cardLimiter, asyncHandler(async (req, res) => {
  noStore(res); ok(res, await cards.portalCard(String(req.params.slug), String(req.params.key)));
}));

// ─── Ảnh bìa (sau authenticate) ───────────────────────────────────
router.put('/projects/:pid/cover', asyncHandler(async (req, res) => {
  const body = parse(z.object({
    preset: z.enum(COVER_PRESETS).nullable().optional(),
    positionY: z.number().int().min(0).max(100).optional(),
  }).strict(), req.body ?? {});
  ok(res, await cover.setCover(callerId(req), pid(req), body));
}));
const rawCover = express.raw({ type: () => true, limit: cover.MAX_COVER_BYTES + 1024 });
router.post('/projects/:pid/cover/upload', rawCover, asyncHandler(async (req, res) => {
  const q = parse(z.object({ positionY: z.coerce.number().int().min(0).max(100).optional() }), req.query);
  const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
  ok(res, await cover.uploadCover(callerId(req), pid(req), buf, q.positionY), 201);
}));

// Ảnh dự án / logo workspace qua backend (thay presign → PUT thẳng R2, bị CSP app desktop / CORS bucket chặn ⇒ "Failed to fetch").
const rawBrand = express.raw({ type: () => true, limit: cover.MAX_BRAND_UPLOAD_BYTES + 1024 });
router.post('/projects/:pid/avatar/upload', rawBrand, asyncHandler(async (req, res) => {
  ok(res, await cover.uploadProjectAvatar(callerId(req), pid(req), Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0)), 201);
}));
router.post('/workspaces/:wsId/logo/upload', rawBrand, asyncHandler(async (req, res) => {
  const wsId = parse(z.coerce.number().int().positive(), req.params.wsId);
  ok(res, await cover.uploadWorkspaceLogo(callerId(req), wsId, Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0)), 201);
}));

export default router;
