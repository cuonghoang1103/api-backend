/**
 * Xin key OpenCode (cổng key con LLM).
 * ─────────────────────────────────────────────────────────────────────────
 * Mount: /api/v1/llm-keys (người dùng) · /api/v1/admin/llm-keys (quản trị)
 *
 * Luồng: người dùng Pro gửi đơn → admin duyệt và DÁN key con vừa tạo ở New
 * API → người dùng thấy key. Chưa duyệt thì không thấy gì.
 *
 * ⚠️ `keyValue` là BÍ MẬT THẬT:
 *   - chỉ trả về cho ĐÚNG chủ đơn (`userId === req.userId`);
 *   - danh sách admin chỉ thấy bản che (`keyHien`), không thấy key đầy đủ;
 *   - KHÔNG bao giờ đưa vào `logger` — log đi qua nhiều chỗ và sống lâu hơn
 *     ta tưởng.
 */
import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { keyReplacementLimiter } from '../middleware/orderRateLimit.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { isProEffective } from '../services/pro.service.js';
import { baoAdmin } from '../services/thongBaoAdmin.service.js';
import { coTheTuTaoKey, taoKeyConQuaCanh } from '../services/taoKeyTerminal.js';
import type { ApiResponse } from '../types/index.js';

/** Sáu model cổng rambo đang phục vụ — app/trang hướng dẫn đọc từ đây. */
export const MODEL_OPENCODE = [
  'claude-sonnet-5',
  'claude-sonnet-4-6',
  'claude-opus-4-8',
  'claude-opus-4-7',
  'claude-opus-4-6',
  'claude-haiku-4-5',
] as const;

const BASE_URL = process.env.LLM_KEY_BASE_URL || 'https://api.cuongthai.com/llm/v1';

/**
 * Trần ngữ cảnh KHAI trong `opencode.json`.
 *
 * ⚠️ Con số này KHÔNG phải giới hạn của cổng — nó là thứ OpenCode dùng để
 * quyết định lúc nào nén hội thoại lại. Khai cao hơn thứ cổng phục vụ được
 * thì OpenCode ngừng nén và gửi lên những yêu cầu cổng từ chối; khai thấp
 * thì phí ngữ cảnh. Nên nó phải bám theo phép ĐO, không phải theo quảng cáo.
 *
 * Đã đo được (13/09/2026, ghi ở `services/cong-llm/canh/sua-yeu-cau.mjs`):
 * rambo cắt ngầm MỖI KHỐI nội dung ở ~12.000 ký tự và chỉ giữ ~58 tin nhắn
 * cuối; canh nắn quanh cả hai. 400k ký tự chia 5 tin nhắn đi qua trọn vẹn =
 * 143.718 token. Trần THẬT trên 143k thì chưa ai đo.
 *
 * Để trong env chứ không cứng trong mã frontend: đo xong là đổi một biến ở
 * `/opt/cuonghoangdev/.env` rồi khởi động lại backend, không phải dựng lại
 * cả frontend.
 */
const CONTEXT_TOKEN = Number(process.env.LLM_KEY_CONTEXT_TOKEN || 180_000);
const OUTPUT_TOKEN = Number(process.env.LLM_KEY_OUTPUT_TOKEN || 32_000);

/** "sk-abcdef…1234" — đủ để nhận ra key nào, không đủ để dùng. */
function cheKey(key: string): string {
  const k = key.trim();
  if (k.length <= 12) return `${k.slice(0, 3)}…`;
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

/** Gói mua ở shop đã quá hạn chưa. Key xin tay không có hạn ⇒ luôn còn. */
function daHetHan(r: { expiresAt: Date | null }): boolean {
  return r.expiresAt != null && r.expiresAt.getTime() <= Date.now();
}

/** Dạng trả cho CHỦ đơn — có key đầy đủ khi đã duyệt. */
function choChuDon(r: {
  id: number; status: string; reason: string; keyValue: string | null; quotaUsd: number | null;
  adminNote: string | null; createdAt: Date; resolvedAt: Date | null;
  source?: string; expiresAt?: Date | null;
}) {
  const hetHan = daHetHan({ expiresAt: r.expiresAt ?? null });
  return {
    id: r.id,
    status: r.status,
    reason: r.reason,
    // Chỉ nhả key khi đơn đã duyệt VÀ gói còn hạn. Đơn bị thu hồi hoặc gói
    // hết hạn thì key cũng không còn giá trị — đưa ra chỉ gây hiểu nhầm
    // "key hỏng" rồi mở đơn bảo hành cho thứ đã dùng hết thời hạn.
    key: r.status === 'APPROVED' && !hetHan ? r.keyValue : null,
    quotaUsd: r.quotaUsd,
    adminNote: r.adminNote,
    // SHOP = mua ở /shop (tự cấp ngay), REQUEST = xin ở đây (admin duyệt).
    source: r.source ?? 'REQUEST',
    expiresAt: r.expiresAt?.toISOString() ?? null,
    hetHan,
    createdAt: r.createdAt.toISOString(),
    resolvedAt: r.resolvedAt?.toISOString() ?? null,
  };
}

// ═══════════════════════════ NGƯỜI DÙNG ═══════════════════════════

const router = Router();
router.use(authenticate);

/** Thông tin để dựng trang hướng dẫn — không cần có key mới xem được. */
router.get('/info', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: {
        baseUrl: BASE_URL,
        models: MODEL_OPENCODE,
        contextToken: Number.isFinite(CONTEXT_TOKEN) && CONTEXT_TOKEN > 0 ? CONTEXT_TOKEN : 180_000,
        outputToken: Number.isFinite(OUTPUT_TOKEN) && OUTPUT_TOKEN > 0 ? OUTPUT_TOKEN : 32_000,
        isPro: await isProEffective(req.userId).catch(() => false),
      },
    });
  } catch (err) { next(err); }
});

/** Đơn của chính mình, mới nhất trước. */
router.get('/mine', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const rows = await prisma.llmKeyRequest.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, data: rows.map(choChuDon) });
  } catch (err) { next(err); }
});

/**
 * Gửi đơn xin key.
 *
 * Chặn hai thứ: người chưa Pro, và người đã có đơn đang chờ / đã được cấp.
 * Thiếu chốt thứ hai thì một người gửi mười đơn và admin duyệt nhầm thành
 * mười key — đúng kiểu lỗi đã gặp ở luồng đổi key hỏng.
 */
router.post('/request', keyReplacementLimiter, async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    if (!(await isProEffective(req.userId))) {
      throw new ForbiddenError('Cấp key dùng OpenCode là quyền lợi của tài khoản Pro. Nâng cấp tại /pro.');
    }
    const reason = String((req.body as { reason?: unknown })?.reason ?? '').trim();
    if (reason.length < 20) {
      throw new BadRequestError('Vui lòng mô tả bạn định dùng key vào việc gì (ít nhất 20 ký tự).');
    }
    if (reason.length > 2000) throw new BadRequestError('Mô tả quá dài (tối đa 2000 ký tự).');

    // Gói mua ở shop ĐÃ HẾT HẠN không được chặn đơn mới — người dùng hết hạn
    // rồi thì trở lại đúng vị trí người chưa có key.
    const dangCo = await prisma.llmKeyRequest.findFirst({
      where: {
        userId: req.userId!,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
    if (dangCo) {
      throw new ConflictError(
        dangCo.status === 'PENDING'
          ? 'Bạn đã có một đơn đang chờ duyệt.'
          : 'Bạn đã được cấp key rồi — xem trong trang này.',
      );
    }

    const don = await prisma.llmKeyRequest.create({
      data: { userId: req.userId!, reason },
    });
    logger.info('[llm-key] đơn xin key mới', { requestId: don.id, userId: req.userId });
    // Không `await`: đơn đã ghi xong rồi, báo hỏng không được làm hỏng việc chính.
    void baoAdmin({
      loai: 'XIN_KEY',
      mucDo: 'can_xu_ly',
      tieuDe: 'Có người xin cấp key OpenCode',
      noiDung: reason.slice(0, 300),
      duongDan: '/admin/commerce?tab=llmkey',
      userId: req.userId ?? null,
      entityId: don.id,
      khoaChongTrung: `XIN_KEY:${don.id}`,
    });
    res.status(201).json({ success: true, data: choChuDon(don) });
  } catch (err) { next(err); }
});

// ═══════════════════════════ QUẢN TRỊ ═══════════════════════════

const adminRouter = Router();
adminRouter.use(authenticate, requireAdmin('ROLE_ADMIN'));

adminRouter.get('/', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const rows = await prisma.llmKeyRequest.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { id: true, username: true, fullName: true, email: true } } },
    });
    // Danh sách admin CHỈ thấy bản che. Xem key đầy đủ là việc của chủ đơn.
    res.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        user: r.user,
        reason: r.reason,
        status: r.status,
        keyHien: r.keyHien,
        quotaUsd: r.quotaUsd,
        adminNote: r.adminNote,
        createdAt: r.createdAt.toISOString(),
        resolvedAt: r.resolvedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) { next(err); }
});

/**
 * DUYỆT — admin dán key con vừa tạo ở New API.
 *
 * Body: { key, quotaUsd?, note? }
 *
 * Vì sao admin dán chứ hệ thống không tự tạo: cụm New API chạy ở mạng docker
 * riêng, backend không gọi tới được, và giao diện quản trị của nó cố ý chỉ mở
 * qua SSH tunnel. Admin vốn đã phải vào đó đặt hạn mức cho key — dán thêm một
 * lần không tốn công, mà đổi lại không phải nhét token quản trị của New API
 * vào backend.
 */
adminRouter.post('/:id/approve', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const keyDan = String((req.body as { key?: unknown })?.key ?? '').trim();

    const don = await prisma.llmKeyRequest.findUnique({ where: { id } });
    if (!don) throw new NotFoundError('Đơn không tồn tại');
    if (don.status !== 'PENDING') throw new ConflictError(`Đơn đang ở trạng thái ${don.status}`);

    const quotaRaw = (req.body as { quotaUsd?: unknown })?.quotaUsd;
    const quotaUsd = quotaRaw == null ? null : Math.max(0, Math.floor(Number(quotaRaw) || 0));

    // ── Lấy key: TỰ TẠO nếu admin không dán sẵn ──────────────────────────
    //
    // Admin dán key thì tôn trọng lựa chọn đó (key cũ, key ngoài hệ thống,
    // hoặc lúc cụm cong-llm đang bảo trì). Không dán thì tự tạo ở New API.
    //
    // ⚠️ Tạo key TRƯỚC khi đổi trạng thái đơn. Làm ngược lại thì đơn đã
    // APPROVED mà khâu tạo key hỏng ⇒ người dùng thấy "đã duyệt" nhưng không
    // có key, và đơn không còn PENDING để duyệt lại — kẹt cứng, phải sửa tay
    // trong CSDL.
    let key = keyDan;
    if (!key) {
      if (!coTheTuTaoKey()) {
        throw new BadRequestError(
          'Chưa cắm CANH_KHOA_NOI_BO nên hệ thống không tự tạo key được. Tạo key ở New API rồi dán vào đây.',
        );
      }
      if (!quotaUsd || quotaUsd <= 0) {
        throw new BadRequestError('Nhập hạn mức USD cho mỗi chu kỳ 5 giờ (ví dụ 60) rồi bấm Duyệt.');
      }
      // Tên gắn với ID ĐƠN nên không bao giờ trùng, và tra ngược được: nhìn
      // tên key trong New API là biết nó thuộc đơn nào.
      const vuaTao = await taoKeyConQuaCanh(`web-don-${id}`, quotaUsd);
      if (!vuaTao) throw new BadRequestError('Không tự tạo key được. Dán key thủ công.');
      key = vuaTao.key;
    }
    if (key.length < 12 || /\s/.test(key)) throw new BadRequestError('Key trông không hợp lệ (quá ngắn hoặc có khoảng trắng).');

    // Chốt tranh chấp: hai admin bấm cùng lúc thì chỉ một lượt ăn.
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: {
        status: 'APPROVED',
        keyValue: key,
        keyHien: cheKey(key),
        quotaUsd,
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : null,
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn vừa được người khác xử lý');

    // ⚠️ KHÔNG log `key`.
    logger.info('[llm-key] duyệt cấp key', {
      requestId: id, userId: don.userId, adminId: req.userId, quotaUsd, tuTao: !keyDan,
    });
    // Đơn đã xử lý ⇒ gạch khỏi hộp thư admin, khỏi phải bấm hai lần.
    void prisma.adminNotification
      .updateMany({ where: { khoaChongTrung: `XIN_KEY:${id}` }, data: { daXuLy: true, daDoc: true, docLuc: new Date() } })
      .catch(() => {});
    res.json({ success: true, data: { id, status: 'APPROVED', keyHien: cheKey(key), tuTao: !keyDan } });
  } catch (err) { next(err); }
});

adminRouter.post('/:id/reject', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Không đủ căn cứ',
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn không ở trạng thái từ chối được');
    res.json({ success: true, data: { id, status: 'REJECTED' } });
  } catch (err) { next(err); }
});

/**
 * THU HỒI một key đã cấp.
 *
 * Chỉ đổi trạng thái phía web — key vẫn sống ở New API cho tới khi admin vào
 * đó khoá. Thông điệp trả về nói thẳng điều đó, để không ai tưởng bấm nút này
 * là key hết dùng được.
 */
adminRouter.post('/:id/revoke', async (req: Request, res: Response<ApiResponse>, next) => {
  try {
    const id = Number(req.params.id);
    const hit = await prisma.llmKeyRequest.updateMany({
      where: { id, status: 'APPROVED' },
      data: {
        status: 'REVOKED',
        adminNote: req.body?.note ? String(req.body.note).slice(0, 500) : 'Đã thu hồi',
        resolvedBy: req.userId ?? null,
        resolvedAt: new Date(),
      },
    });
    if (hit.count === 0) throw new ConflictError('Đơn không ở trạng thái thu hồi được');
    res.json({
      success: true,
      data: {
        id,
        status: 'REVOKED',
        nhacNho: 'Người dùng không còn thấy key trên web. PHẢI vào New API khoá key này — thu hồi ở đây không tự khoá nó.',
      },
    });
  } catch (err) { next(err); }
});

export default router;
export { adminRouter };
