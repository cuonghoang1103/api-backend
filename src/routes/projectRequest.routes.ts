/**
 * Phiếu yêu cầu dự án — hai router:
 *   - công khai  POST /api/v1/project-requests          (form "Nhận dự án" ở /about/quy-trinh)
 *   - admin      /api/v1/admin/project-requests[...]     (duyệt phiếu, tạo dự án CT Work)
 *
 * Nghiệp vụ ở `services/projectRequest.service.ts`.
 */
import { Router, type Request, type RequestHandler, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { z, ZodError } from 'zod';
import { getRedis } from '../config/redis.js';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler, BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { projectRequestLimiter } from '../middleware/orderRateLimit.js';
import {
  CONSENT_VERSION, MANUAL_STATUSES, PRODUCT_TYPES, PROJECT_REQUEST_STATUSES, SECURITY_LEVELS,
  createProjectRequest, createWorkProjectFromRequest, lookupProjectRequest, roleplaySample, workProjectInfo,
} from '../services/projectRequest.service.js';
import { baoAdmin } from '../services/thongBaoAdmin.service.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';

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

/** IP thật: mục PHẢI CÙNG của X-Forwarded-For do proxy của ta ghi (xem `clientIpKey` trong index.ts). */
function clientIp(req: Request): string | null {
  const xff = (req.headers['x-forwarded-for'] as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean);
  return xff?.[xff.length - 1] || req.ip || null;
}

const optText = (max: number) => z.string().trim().max(max).optional().nullable();

const submitSchema = z.object({
  name: z.string().trim().min(2, 'Nhập họ tên').max(120),
  email: z.string().trim().email('Email không hợp lệ').max(254),
  phone: z.string().trim().max(30).regex(/^[0-9+().\s-]*$/, 'SĐT chỉ gồm số và + ( ) . -').optional().nullable(),
  organization: optText(200),
  senderRole: optText(120),
  productTypes: z.array(z.enum(PRODUCT_TYPES)).min(1, 'Chọn ít nhất một loại sản phẩm').max(PRODUCT_TYPES.length),
  needs: z.string().trim().min(20, 'Mô tả nhu cầu ít nhất 20 ký tự').max(10_000),
  businessGoals: optText(5000),
  endUsers: optText(5000),
  existingSystems: optText(5000),
  budgetRange: optText(100),
  desiredDeadline: optText(100),
  securityLevel: z.enum(SECURITY_LEVELS).default('NORMAL'),
  securityNote: optText(5000),
  /** Bắt buộc true — Luật BVDLCN 91/2025/QH15 + Nghị định 356/2025/NĐ-CP: không đồng ý thì không được lưu dữ liệu. */
  consent: z.literal(true, { errorMap: () => ({ message: 'Cần đồng ý xử lý dữ liệu cá nhân để gửi phiếu' }) }),
  consentVersion: z.string().trim().max(30).optional().nullable(),
  source: optText(100),
  /** Bẫy bot: ô ẩn, người thật không bao giờ điền. */
  website: z.string().optional().nullable(),
});

// ─── Công khai ──────────────────────────────────────────────────

export const publicProjectRequestRouter = Router();

publicProjectRequestRouter.post('/', projectRequestLimiter, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const body = parse(submitSchema, req.body);
  // Honeypot dính ⇒ trả "thành công" giả, không lưu, không báo admin — bot
  // không biết mình bị lọc nên không đổi chiến thuật.
  if (body.website && body.website.trim()) {
    res.status(201).json({ success: true, data: { code: null, received: true } });
    return;
  }
  const { website: _hp, consent: _c, ...input } = body;
  const row = await createProjectRequest(input, {
    ip: clientIp(req),
    userAgent: (req.headers['user-agent'] as string | undefined) ?? null,
  });

  // Báo admin (hộp thư + socket + Telegram). Không bao giờ ném — báo hỏng không làm rớt phiếu.
  void baoAdmin({
    loai: 'YEU_CAU_DU_AN',
    tieuDe: `Phiếu yêu cầu dự án ${row.code} — ${row.organization || row.name}`,
    noiDung: `${row.name} <${row.email}> · ${row.productTypes.join(', ')}\n${row.needs.slice(0, 400)}`,
    duongDan: `/admin/project-requests?id=${row.id}`,
    mucDo: 'can_xu_ly',
    entityId: row.id,
    khoaChongTrung: `YEU_CAU_DU_AN:${row.id}`,
  });

  res.status(201).json({ success: true, data: { code: row.code, received: true } });
}));

// ─── Khách tự tra cứu phiếu ─────────────────────────────────────
//
// POST (không GET) để email không nằm trong URL / access log / lịch sử trình duyệt.

/**
 * Giới hạn CHẶT theo IP — chống dò mã phiếu (YC-2026-0001 là số tuần tự, đoán
 * được) ghép với email. Cùng khuôn `taoLimiter` ở middleware/orderRateLimit.ts:
 * bộ đếm Redis, khoá theo IP đuôi phải XFF, FAIL-OPEN khi Redis chết.
 * Khoá CHỈ theo IP (không theo userId): trang tra cứu là công khai.
 */
const lookupLimiter: RequestHandler = (() => {
  const limiter = rateLimit({
    windowMs: 15 * 60_000,
    max: parseInt(process.env.PROJECT_REQUEST_LOOKUP_LIMIT || '10', 10),
    store: new RedisStore({
      sendCommand: (async (...args: string[]) => (await getRedis()).sendCommand(args)) as never,
      prefix: 'rl:projreq-lookup:',
    }),
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `ip:${clientIp(req) ?? 'unknown'}`,
    message: {
      success: false,
      message: 'Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau 15 phút. / Too many lookups — please try again in 15 minutes.',
      code: 'LOOKUP_RATE_LIMIT_EXCEEDED',
    },
  });
  return (req, res, next) => limiter(req, res, (err?: unknown) => {
    if (err) logger.warn('[rate-limit] store lỗi — cho qua', { error: err instanceof Error ? err.message : String(err) });
    next();
  });
})();

const lookupSchema = z.object({
  code: z.string().max(40),
  email: z.string().max(254),
});

/** Một lỗi DUY NHẤT cho mọi trường hợp không khớp — không lộ "mã có tồn tại không". */
const LOOKUP_NOT_FOUND = 'Không tìm thấy phiếu khớp với mã và email này. / No request matches this code and email.';

publicProjectRequestRouter.post('/lookup', lookupLimiter, asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const body = parse(lookupSchema, req.body);
  const view = await lookupProjectRequest(body.code, body.email);
  if (!view) throw new NotFoundError(LOOKUP_NOT_FOUND);
  res.setHeader('Cache-Control', 'no-store');
  res.json({ success: true, data: view });
}));

// ─── Admin ──────────────────────────────────────────────────────

export const adminProjectRequestRouter = Router();
adminProjectRequestRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

const listSchema = z.object({
  status: z.enum(PROJECT_REQUEST_STATUSES).optional(),
  roleplay: z.enum(['0', '1']).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

const LIST_SELECT = {
  id: true, code: true, name: true, email: true, organization: true, productTypes: true,
  status: true, isRoleplay: true, securityLevel: true, workProjectId: true, createdAt: true, statusChangedAt: true,
} as const;

adminProjectRequestRouter.get('/', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const f = parse(listSchema, req.query);
  const where: Record<string, unknown> = {};
  if (f.status) where.status = f.status;
  if (f.roleplay) where.isRoleplay = f.roleplay === '1';
  if (f.q) {
    where.OR = [
      { code: { contains: f.q, mode: 'insensitive' } },
      { name: { contains: f.q, mode: 'insensitive' } },
      { email: { contains: f.q, mode: 'insensitive' } },
      { organization: { contains: f.q, mode: 'insensitive' } },
    ];
  }
  const [items, total, byStatus] = await Promise.all([
    prisma.projectRequest.findMany({ where, orderBy: { id: 'desc' }, skip: (f.page - 1) * f.limit, take: f.limit, select: LIST_SELECT }),
    prisma.projectRequest.count({ where }),
    prisma.projectRequest.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  res.json({
    success: true,
    data: {
      items, total, page: f.page, limit: f.limit,
      counts: Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])),
    },
  });
}));

adminProjectRequestRouter.post('/roleplay', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const row = await createProjectRequest(
    { ...roleplaySample(), consentVersion: CONSENT_VERSION },
    { ip: null, userAgent: 'roleplay', isRoleplay: true },
  );
  res.status(201).json({ success: true, data: row });
}));

function idParam(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('id không hợp lệ');
  return id;
}

adminProjectRequestRouter.get('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const row = await prisma.projectRequest.findUnique({ where: { id: idParam(req) } });
  if (!row) throw new NotFoundError('Không tìm thấy phiếu yêu cầu');
  res.json({ success: true, data: { ...row, workProject: await workProjectInfo(row.workProjectId) } });
}));

const patchSchema = z.object({
  status: z.enum(MANUAL_STATUSES as [string, ...string[]]).optional(),
  internalNote: z.string().max(20_000).nullable().optional(),
  /** Lời nhắn CÔNG KHAI — khách thấy ở trang tra cứu. */
  clientNote: z.string().max(5_000).nullable().optional(),
}).refine((b) => b.status !== undefined || b.internalNote !== undefined || b.clientNote !== undefined, { message: 'Không có gì để cập nhật' });

adminProjectRequestRouter.patch('/:id', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const id = idParam(req);
  const body = parse(patchSchema, req.body);
  const cur = await prisma.projectRequest.findUnique({ where: { id }, select: { status: true } });
  if (!cur) throw new NotFoundError('Không tìm thấy phiếu yêu cầu');
  if (body.status && cur.status === 'PROJECT_CREATED') {
    throw new BadRequestError('Phiếu đã có dự án CT Work — không đổi trạng thái được nữa', 'REQUEST_LOCKED');
  }
  const data: Record<string, unknown> = {};
  if (body.internalNote !== undefined) data.internalNote = body.internalNote?.trim() || null;
  if (body.clientNote !== undefined) data.clientNote = body.clientNote?.trim() || null;
  if (body.status && body.status !== cur.status) { data.status = body.status; data.statusChangedAt = new Date(); }
  const row = await prisma.projectRequest.update({ where: { id }, data });
  res.json({ success: true, data: { ...row, workProject: await workProjectInfo(row.workProjectId) } });
}));

adminProjectRequestRouter.post('/:id/create-work-project', asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
  const result = await createWorkProjectFromRequest(req.userId!, idParam(req));
  res.status(result.alreadyExisted ? 200 : 201).json({ success: true, data: result });
}));
