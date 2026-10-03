/**
 * ============================================================
 * Agent lập trình — gắn ở /api/v1/agent
 * ============================================================
 *
 * Bộ não của mục "Lập trình" trong app desktop. App giữ hội thoại và chạy tool
 * đọc file trên máy người dùng; route này giữ khoá cổng, prompt hệ thống, bộ
 * tool, và cả hai chốt chặn tiền.
 *
 *   POST /agent/turn    một lượt, trả SSE
 *   GET  /agent/tools   bộ tool + trần hiện hành (app đọc lúc khởi động)
 *
 * ⚠️ VÌ SAO KHÔNG DÙNG LẠI /api/v1/ai/chat: đường đó nhận một `message` và trả
 * về chữ. Agent thì gửi lên cả hội thoại có `role:'tool'`, nhận về `tool_calls`
 * để app chạy, rồi gọi lại — khác giao thức, không phải khác tham số. Nhồi vào
 * cùng một handler thì cả hai cùng khó đọc và mọi thay đổi ở một bên đều có
 * khả năng làm hỏng bên kia.
 */
import { Router, type NextFunction, type Response } from 'express';
import rateLimit from 'express-rate-limit';

import { authenticate } from '../middleware/auth.js';
import { isProEffective, cauChanPro } from '../services/pro.service.js';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse } from '../types/index.js';
import { AGENT_TOOLS, ALL_CAPABILITIES } from '../services/agent/tools.js';
import { soGioCuaSo, tranToken, xemHanMuc } from '../services/agent/quota.js';
import { AgentInputError, runAgentTurn, type AgentEvent } from '../services/agent/turn.js';
import { congAgent, gatewayConfigured, kiemRamboSong, modelFor, ramboDangNghi } from '../services/llm/gateway.js';
import { MODEL_DU_PHONG, MoKhoaLoi, congDuPhong, daCoMatKhau, modelDuPhongAgent, moKhoaDuPhong, tenDuPhong, veDuPhongHopLe } from '../services/agent/congDuPhong.js';
import { dsModelAgent } from '../services/agent/models.js';
import { KeyGiaHanLoi, coKeyGiaHan, nhapKeyGiaHan } from '../services/agent/keyGiaHan.js';
import { datTenViec } from '../services/agent/datTen.js';
import { DS_MUC_NO_LUC } from '../services/agent/turn.js';
import { xemHanMucFable } from '../services/agent/fable.js';
import { dsKyNangSan } from '../services/agent/kyNangSan.js';
import { prisma } from '../config/database.js';
import { baoAdmin } from '../services/thongBaoAdmin.service.js';
import { CompactLoi, compactChuDong } from '../services/agent/compactChuDong.js';
import { hardCapUsd, softCapUsd, todaySpendUsd } from '../services/llm/budget.js';

const router = Router();
router.use(authenticate);

/**
 * CHỈ TÀI KHOẢN PRO.
 *
 * Chốt ở MÁY CHỦ chứ không phải ở app: app tải về máy người dùng, ẩn một cái
 * nút trong app chỉ là ẩn cái nút. `isProEffective` cũng trả true cho admin,
 * nên không cần thêm ngoại lệ riêng cho quản trị viên.
 *
 * 403 chứ không phải 401 — người dùng ĐÃ đăng nhập, chỉ là chưa đủ gói. Phân
 * biệt hai mã này quan trọng ở phía app: 401 làm nó chạy luồng làm mới token
 * rồi thử lại (và thất bại mãi), 403 thì nó hiện lời mời nâng cấp.
 */
async function chiPro(req: any, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
  try {
    if (await isProEffective(req.userId)) return next();
    res.status(403).json({
      success: false,
      message: await cauChanPro(req.userId, 'Chế độ Lập trình là tính năng của tài khoản Pro. Nâng cấp để agent đọc được dự án trên máy bạn.'),
      code: 'PRO_REQUIRED',
    });
  } catch (err) {
    next(err);
  }
}

/** Nginx cắt kết nối im lặng ở 60s — nhịp tim phải thưa hơn thế một cách rõ ràng. */
const KEEPALIVE_MS = 25_000;

/**
 * Bộ tool và các trần đang áp dụng.
 *
 * App đọc lúc khởi động để hiện đúng "agent làm được gì" thay vì đoán theo
 * phiên bản app. Cũng chính là route mà `deploy.sh` gõ vào để biết router đã
 * được gắn thật hay chưa (401 khi chưa đăng nhập = đã gắn; 404 = ảnh cũ).
 */
router.get('/tools', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    // CỐ Ý không chặn Pro ở đây. App gọi route này lúc khởi động để biết có
    // hiện chế độ Lập trình hay không; chặn thì app chỉ nhận 403 và không phân
    // biệt được "chưa đủ gói" với "máy chủ hỏng". Trả `pro: false` thì app hiện
    // được lời mời nâng cấp — một câu mời rõ ràng thay cho một lỗi.
    const pro = await isProEffective(req.userId).catch(() => false);
    res.json({
      success: true,
      data: {
        pro,
        configured: gatewayConfigured(),
        model: modelFor('agent_code'),
        models: dsModelAgent(),
        mucNoLuc: DS_MUC_NO_LUC,
        capabilities: ALL_CAPABILITIES,
        limits: { tokenCap: tranToken(), windowHours: soGioCuaSo() },
        tools: AGENT_TOOLS.map((t) => ({
          name: t.name,
          ring: t.ring,
          capability: t.capability ?? null,
          description: t.description,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Hạn mức 5 giờ còn lại. App gọi khi mở màn hình để vẽ thanh đo ngay, không
 * phải chờ tới lượt agent đầu tiên mới biết mình còn bao nhiêu.
 *
 * (Trong lúc chạy thì KHÔNG cần gọi lại: mỗi khung `done` đã mang theo `quota`.)
 */
/**
 * POST /api/v1/agent/dat-ten — sinh tên ngắn cho một việc.
 *
 * App gọi MỘT LẦN sau lượt đầu tiên. Để app tự cắt câu hỏi thì ba việc cùng
 * bắt đầu bằng "bạn kiểm tra dự án này…" là ba dòng giống hệt nhau.
 */
router.post('/dat-ten', chiPro, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const { cauHoi } = req.body ?? {};
    if (typeof cauHoi !== 'string') throw new AppError('Thiếu cauHoi', 400, 'BAD_INPUT');
    const ten = await datTenViec(cauHoi);
    // `null` KHÔNG phải lỗi: chỗ gọi giữ tên cũ. Trả 200 để app khỏi phải
    // phân biệt "hỏng" với "không đặt được".
    res.json({ success: true, data: { ten } });
  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * CUONG FABLE 5 — hạn mức riêng + xin thêm (26/09/2026)
 * ============================================================
 *
 * GET  /fable      — còn bao nhiêu (app hiện trong menu model + khi bị chặn)
 * POST /fable/xin  — gửi yêu cầu xin thêm cho admin. Body: { lyDo }
 *
 * Duyệt ở `/api/v1/admin/fable` (cuối file) — trang /admin/commerce?tab=fable.
 */
router.get('/fable', chiPro, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await xemHanMucFable(req.userId) });
  } catch (err) { next(err); }
});

router.post('/fable/xin', chiPro, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const lyDo = String((req.body as { lyDo?: unknown })?.lyDo ?? '').trim();
    if (lyDo.length < 10) throw new AppError('Hãy viết ngắn gọn bạn cần thêm để làm gì (ít nhất 10 ký tự).', 400, 'BAD_INPUT');
    if (lyDo.length > 1000) throw new AppError('Lý do quá dài (tối đa 1000 ký tự).', 400, 'BAD_INPUT');
    const h = await xemHanMucFable(req.userId);
    if (h.khongGioiHan) throw new AppError('Tài khoản admin dùng Fable không giới hạn.', 400, 'KHONG_CAN');
    /* Một yêu cầu chờ một lúc: bấm năm lần không được năm lần cộng. */
    if (h.dangChoDuyet) throw new AppError('Bạn đã có một yêu cầu đang chờ admin duyệt.', 409, 'DANG_CHO');
    const don = await prisma.fableQuotaRequest.create({ data: { userId: req.userId, reason: lyDo } });
    logger.info('[fable] xin thêm hạn mức', { id: don.id, userId: req.userId, daDung: h.daDung, tran: h.tran });
    void baoAdmin({
      loai: 'KHAC',
      mucDo: 'can_xu_ly',
      tieuDe: 'Có người xin thêm hạn mức Cuong Fable 5',
      noiDung: `Đã dùng ${h.daDung.toLocaleString('vi-VN')}/${h.tran.toLocaleString('vi-VN')} token. Lý do: ${lyDo.slice(0, 300)}`,
      duongDan: '/admin/commerce?tab=fable',
      userId: req.userId ?? null,
      entityId: don.id,
      khoaChongTrung: `XIN_FABLE:${don.id}`,
    });
    res.status(201).json({ success: true, data: await xemHanMucFable(req.userId) });
  } catch (err) { next(err); }
});

/**
 * CỔNG DỰ PHÒNG (27/09/2026) — modelapi, tính tiền thật, cần mật khẩu admin.
 *
 * GET  /du-phong           — trạng thái: rambo có đang hỏng không, dự phòng đã
 *                            bật chưa, model gì. App gửi kèm `?ve=` để biết vé
 *                            còn dùng được không (đổi mật khẩu là vé chết).
 * POST /du-phong/mo-khoa   — { matKhau } ⇒ { ve, hetHan }. App giữ vé và gửi
 *                            kèm mỗi lượt (`duPhongVe`); vé CHỈ có tác dụng lúc
 *                            rambo hỏng — rambo sống lại là tự về rambo.
 */
router.get('/du-phong', chiPro, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const model = modelDuPhongAgent();
    res.json({
      success: true,
      data: {
        coCongChinh: Boolean(congAgent()),
        congChinhDangHong: ramboDangNghi(),
        /* `?kiem=1`: gõ cửa rambo THẬT (nhớ 30s) — app hỏi sau mỗi việc chạy ở
           dự phòng để biết có nên mời người dùng quay về không. */
        ...(req.query.kiem ? { congChinhSong: congAgent() ? await kiemRamboSong() : false } : {}),
        daBat: await daCoMatKhau(),
        coKhoa: Boolean(congDuPhong(model)),
        model,
        ten: tenDuPhong(model),
        veHopLe: req.query.ve ? await veDuPhongHopLe(req.userId, String(req.query.ve)) : false,
        /* Hai model chọn được (6 Sol mặc định, 6 Astra cho việc khó) + model
           nào gọi được với khoá đang cắm. */
        models: MODEL_DU_PHONG.map((x) => ({ ...x, dungDuoc: Boolean(congDuPhong(x.id)) })),
        macDinh: modelDuPhongAgent(),
      },
    });
  } catch (err) { next(err); }
});

router.post('/du-phong/mo-khoa', chiPro, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const matKhau = String((req.body as { matKhau?: unknown })?.matKhau ?? '');
    const kq = await moKhoaDuPhong(req.userId, matKhau.slice(0, 200));
    logger.info('[du-phong] mở khoá cổng dự phòng', { userId: req.userId });
    res.json({ success: true, data: { ...kq, model: modelDuPhongAgent(), ten: tenDuPhong() } });
  } catch (err) {
    if (err instanceof MoKhoaLoi) {
      next(new AppError(err.message, err.code === 'THU_QUA_NHIEU' ? 429 : err.code === 'CHUA_BAT' ? 409 : 403, err.code));
      return;
    }
    next(err);
  }
});

/**
 * GET /ky-nang — kho kỹ năng cài sẵn của AI Code (deploy, máy chủ SSH,
 * database, kiểm thử, bảo mật…). App tải mỗi lượt, đệm 10 phút; sửa file
 * `.md` + deploy backend là mọi người có bản mới, không cần phát hành app.
 * Không chặn Pro: nội dung là hướng dẫn chung, và app gọi nó cả khi đang kiểm
 * quyền.
 */
router.get('/ky-nang', async (_req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({ success: true, data: await dsKyNangSan() });
  } catch (err) { next(err); }
});

/** Dạng trả về chung cho `/usage` và `/gia-han` — app vẽ thẳng lên thanh đo. */
async function goiUsage(userId: number): Promise<Record<string, unknown>> {
  const h = await xemHanMuc(userId);
  return {
    daDung: h.daDung,
    tran: h.tran,
    tranGoc: h.tranGoc,
    giaHan: h.giaHan,
    conLai: h.conLai,
    phanTram: h.phanTram,
    soGio: h.soGio,
    hetHan: h.hetHan,
    hoiLucNao: h.hoiLucNao?.toISOString() ?? null,
    hoiHetLuc: h.hoiHetLuc?.toISOString() ?? null,
    coKeyGiaHan: await coKeyGiaHan(),
    tienNgay: await tienNgay(),
  };
}

/**
 * TRẦN TIỀN NGÀY của cả máy chủ (`llm/budget.ts`) — cho `/usage` của AI Code
 * (03/10/2026). CHỈ trả PHẦN TRĂM, không trả số đô: chi tiêu toàn hệ thống là
 * số liệu kinh doanh, người dùng chỉ cần biết "còn chạy được không / sắp chạm
 * trần chưa". Hỏng đọc sổ ⇒ `null`, không làm hỏng cả `/usage`.
 */
async function tienNgay(): Promise<{ phanTram: number; catViecNen: boolean; dungHet: boolean } | null> {
  try {
    const da = await todaySpendUsd();
    const cung = hardCapUsd();
    return {
      phanTram: cung > 0 ? Math.min(100, Math.round((da / cung) * 100)) : 0,
      catViecNen: da >= softCapUsd(),
      dungHet: cung > 0 && da >= cung,
    };
  } catch {
    return null;
  }
}

router.get('/usage', async (req: any, res: Response<ApiResponse>, next) => {
  try {
    res.json({
      success: true,
      data: {
        pro: await isProEffective(req.userId).catch(() => false),
        ...(await goiUsage(req.userId)),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * KEY GIA HẠN (02/10/2026) — `POST /gia-han { key }`.
 *
 * Hết hạn mức token 5 giờ (`AGENT_QUOTA_EXCEEDED`) ⇒ app hỏi key admin đặt ⇒
 * đúng thì cộng `soTokenMoiLan` vào trần (cửa sổ trượt) và trả hạn mức mới; app
 * tự gửi lại đúng lượt vừa bị chặn. Xem `services/agent/keyGiaHan.ts`.
 *
 * Mã lỗi: 409 `KEY_GIA_HAN_CHUA_BAT` · 403 `KEY_GIA_HAN_SAI` (sai HOẶC admin đã
 * đổi key — app xoá key đang nhớ) · 429 `KEY_GIA_HAN_THU_QUA_NHIEU`.
 *
 * Hai lớp chống dò: rate-limit theo người ở đây (10 lần/15 phút, tính cả lần
 * đúng) + khoá 15 phút sau 5 lần SAI trong dịch vụ.
 */
const giaHanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any): string => `gia-han:${req.userId ?? req.ip ?? 'anon'}`,
  message: { success: false, message: 'Nhập key quá nhiều lần. Thử lại sau 15 phút.', code: 'KEY_GIA_HAN_THU_QUA_NHIEU' },
});

router.post('/gia-han', chiPro, giaHanLimiter, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const key = String((req.body as { key?: unknown })?.key ?? '').trim();
    const kq = await nhapKeyGiaHan(req.userId, key.slice(0, 200));
    logger.info('[gia-han] nhập key gia hạn hạn mức AI Code', { userId: req.userId, soToken: kq.soToken });
    res.json({ success: true, data: { soToken: kq.soToken, ...(await goiUsage(req.userId)) } });
  } catch (err) {
    if (err instanceof KeyGiaHanLoi) {
      const status = err.code === 'KEY_GIA_HAN_THU_QUA_NHIEU' ? 429 : err.code === 'KEY_GIA_HAN_CHUA_BAT' ? 409 : 403;
      next(new AppError(err.message, status, err.code));
      return;
    }
    next(err);
  }
});

/**
 * `POST /compact` — lệnh `/compact [ghi chú]` của AI Code (03/10/2026).
 *
 * Thân: `{ messages, giuLuot?, ghiChu? }` (messages = hội thoại app đang giữ,
 * nên gỡ ảnh trước khi gửi). Trả `{ tomTat, deBai, soTinDaGop, soLuotDaGop }`:
 * app thay `soTinDaGop` tin đầu bằng bản tóm tắt TRONG HỘI THOẠI GỬI LÊN, còn
 * bản đầy đủ vẫn trên màn hình. Xem `services/agent/compactChuDong.ts`.
 *
 * Rate-limit riêng: mỗi lần là một lời gọi model (rẻ, nhưng không miễn phí).
 */
const compactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: any): string => `compact:${req.userId ?? req.ip ?? 'anon'}`,
  message: { success: false, message: 'Tóm tắt quá nhiều lần. Thử lại sau 15 phút.', code: 'COMPACT_QUA_NHIEU' },
});

router.post('/compact', chiPro, compactLimiter, async (req: any, res: Response<ApiResponse>, next) => {
  try {
    const b = (req.body ?? {}) as { messages?: unknown; giuLuot?: unknown; ghiChu?: unknown };
    const kq = await compactChuDong(b.messages, { giuLuot: b.giuLuot, ghiChu: b.ghiChu });
    logger.info('[agent/compact] tóm tắt chủ động', {
      userId: req.userId, soTinDaGop: kq.soTinDaGop, daGoiModel: kq.daGoiModel,
    });
    res.json({ success: true, data: kq });
  } catch (err) {
    if (err instanceof CompactLoi) { next(new AppError(err.message, err.status, err.code)); return; }
    next(err);
  }
});

/**
 * Một lượt agent.
 *
 * Thân yêu cầu:
 *   {
 *     messages: [{role:'user'|'assistant'|'tool', …}],   // TOÀN BỘ hội thoại
 *     capabilities: ['fs_read','git_read'],              // app chạy được gì
 *     workspace: { name?, platform?, branch? }           // chỉ để nhắc ngữ cảnh
 *   }
 *
 * Trả về SSE. Khung `done` mang `append` — app nối NGUYÊN VĂN vào cuối hội
 * thoại của mình. Đừng tự dựng lại tin nhắn assistant từ các khung `text`:
 * khung `text` đã bị cắt rác của cổng và không mang `tool_calls`, nối bằng nó
 * thì lượt sau cổng từ chối vì thiếu tin nhắn trả lời cho tool_call.
 */
router.post('/turn', chiPro, async (req: any, res: Response) => {
  // ─── 1. Kiểm đầu vào TRƯỚC khi mở SSE ────────────────────────
  // Mở SSE rồi mới thấy đầu vào sai thì lỗi phải đi trong một khung sự kiện,
  // và app nhận HTTP 200 cho một yêu cầu hỏng. Sai sớm thì sai bằng mã HTTP.
  /*
   * ⚠️ KIỂU NÀY CHÍNH LÀ CHỖ LỖI ẨN NÁU. Nó liệt kê từng trường, nên một
   * trường app GỬI LÊN mà quên khai ở đây sẽ bị vứt trong im lặng — `tsc`
   * không kêu, không có lỗi lúc chạy, và tính năng đó chỉ đơn giản là không
   * bao giờ hoạt động. `agentPhu`/`promptPhu` nằm im như vậy tới 15/09/2026.
   *
   * Thêm trường mới ở app thì PHẢI thêm cả ở đây VÀ ở chỗ dựng đầu vào bên
   * dưới. Hai chỗ, không phải một.
   */
  const body = req.body as {
    messages?: unknown; capabilities?: unknown; workspace?: unknown;
    ghiChuDuAn?: unknown; kyNang?: unknown; mucNoLuc?: unknown; laPhu?: unknown; toolMcp?: unknown;
    model?: unknown; agentPhu?: unknown; promptPhu?: unknown; boNho?: unknown; duPhongVe?: unknown; duPhongModel?: unknown; duPhongGiu?: unknown;
  };
  if (!Array.isArray(body?.messages)) {
    res.status(400).json({ success: false, message: 'Thiếu "messages"', code: 'BAD_MESSAGES' });
    return;
  }

  const workspace = typeof body.workspace === 'object' && body.workspace
    ? {
        name: str((body.workspace as any).name, 120),
        platform: str((body.workspace as any).platform, 20),
        branch: str((body.workspace as any).branch, 120),
      }
    : undefined;

  // Ghi chú dự án: nhận NGUYÊN VĂN rồi cắt ở `runAgentTurn`. Trần thô ở đây chỉ
  // để một app hỏng không đẩy được 50MB vào thân yêu cầu.
  const gc = body.ghiChuDuAn;
  const ghiChuDuAn = gc && typeof gc === 'object'
    && typeof (gc as any).ten === 'string' && typeof (gc as any).noiDung === 'string'
    ? { ten: String((gc as any).ten).slice(0, 80), noiDung: String((gc as any).noiDung).slice(0, 200_000) }
    : undefined;

  /* Kỹ năng: CHỈ tên + mô tả. Trần chặt vì nó vào thẳng prompt hệ thống ở MỌI
     lượt — một mô tả 5000 chữ là một khoản tiền lặp lại mãi. */
  const kn = body.kyNang;
  const kyNang = Array.isArray(kn)
    ? kn
      .filter((x): x is { ten: string; moTa: string } => Boolean(x) && typeof x === 'object'
        && typeof (x as any).ten === 'string' && typeof (x as any).moTa === 'string')
      .slice(0, 40)
      .map((x) => ({ ten: String(x.ten).slice(0, 64), moTa: String(x.moTa).slice(0, 300) }))
    : undefined;

  /*
   * ⚠️ AGENT PHỤ CỦA DỰ ÁN — TRƯỚC 15/09/2026 HAI TRƯỜNG NÀY BỊ VỨT IM LẶNG.
   *
   * App đọc `.claude/agents/*.md` của dự án rồi gửi lên (`loop.ts:904` gửi
   * `agentPhu`, `loop.ts:1293` gửi `promptPhu`), và `turn.ts` có đọc chúng để
   * dựng prompt (`turn.ts:624-625`). Nhưng route này dựng đầu vào bằng cách
   * LIỆT KÊ TỪNG TRƯỜNG, và hai cái đó không có trong danh sách — nên chúng
   * rơi mất ngay tại đây.
   *
   * Hậu quả, và không có lỗi nào để thấy:
   *   • Model KHÔNG BAO GIỜ biết dự án có những agent phụ nào ⇒ nó không gọi.
   *   • Nếu nó có gọi theo `loai`, app đọc đúng thân file rồi gửi lên để bị
   *     vứt ⇒ việc phụ chạy bằng prompt MẶC ĐỊNH. Người dùng viết một agent
   *     phụ chuyên biệt, thấy nó "chạy", nhưng nó chưa từng được dùng.
   *
   * Trần chặt như `kyNang` vì cùng lý do: chúng vào thẳng prompt hệ thống.
   */
  const ap = body.agentPhu;
  const agentPhu = Array.isArray(ap)
    ? ap
      .filter((x): x is { ten: string; moTa: string } => Boolean(x) && typeof x === 'object'
        && typeof (x as any).ten === 'string' && typeof (x as any).moTa === 'string')
      .slice(0, 40)
      .map((x) => ({ ten: String(x.ten).slice(0, 64), moTa: String(x.moTa).slice(0, 300) }))
    : undefined;

  /* `promptPhu` là THÂN của một file agent phụ — dài hơn hẳn mô tả, nhưng chỉ
     đi kèm đúng lượt chạy việc phụ đó chứ không lặp ở mọi lượt. */
  const pp = body.promptPhu;
  const promptPhu = typeof pp === 'string' && pp.trim() ? pp.slice(0, 20_000) : undefined;
  /* Mục lục BỘ NHỚ (26/09/2026) — ⚠️ phải thêm ở CẢ kiểu `body` lẫn chỗ dựng
     đầu vào dưới đây (bẫy "vứt trường im lặng" đã ghi ở trên). */
  const boNho = typeof body.boNho === 'string' && body.boNho.trim() ? body.boNho.slice(0, 2200) : undefined;

  // ─── 2. Mở SSE ───────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // tắt đệm của Nginx, nếu không chữ về theo cục
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.flushHeaders();

  const guiKhung = (e: AgentEvent): void => {
    if (res.writableEnded) return;
    res.write(`data: ${JSON.stringify(e)}\n\n`);
  };

  const nhipTim = setInterval(() => {
    if (!res.writableEnded) res.write(': keepalive\n\n');
  }, KEEPALIVE_MS);

  // Người dùng bấm dừng hoặc đóng app ⇒ huỷ luôn lời gọi tới cổng. Không có
  // dòng này thì lượt vẫn chạy tiếp tới cùng và vẫn bị tính tiền, chỉ khác là
  // không ai đọc kết quả.
  const dungLai = new AbortController();
  req.on('close', () => {
    clearInterval(nhipTim);
    dungLai.abort();
  });

  try {
    await runAgentTurn(
      {
        messages: body.messages,
        capabilities: body.capabilities,
        workspace,
        ...(ghiChuDuAn ? { ghiChuDuAn } : {}),
        ...(kyNang?.length ? { kyNang } : {}),
        ...(agentPhu?.length ? { agentPhu } : {}),
        ...(promptPhu ? { promptPhu } : {}),
        ...(boNho ? { boNho } : {}),
        mucNoLuc: body.mucNoLuc,
        model: body.model,
        duPhongVe: body.duPhongVe,
        duPhongModel: body.duPhongModel,
        duPhongGiu: body.duPhongGiu,
        laPhu: body.laPhu,
        toolMcp: body.toolMcp,
        userId: req.userId,
      },
      guiKhung,
      dungLai.signal,
    );
  } catch (err) {
    if (err instanceof AgentInputError) {
      guiKhung({ type: 'error', error: err.message, code: err.code });
    } else {
      logger.error('agent/turn hỏng', { error: (err as Error).message, userId: req.userId });
      guiKhung({ type: 'error', error: 'Lỗi máy chủ khi chạy agent.', code: 'INTERNAL' });
    }
  } finally {
    clearInterval(nhipTim);
    if (!res.writableEnded) res.end();
  }
});

function str(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
}

export default router;
