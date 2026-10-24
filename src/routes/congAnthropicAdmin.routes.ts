/**
 * /api/v1/admin/cong-anthropic — quản trị cổng Claude CHÍNH HÃNG (17/10/2026).
 * Giao diện: /admin/commerce?tab=anthropic. Hợp đồng: docs/cong-anthropic-chinh-hang.md.
 *
 * ⛔ KHÔNG BAO GIỜ trả khoá thô. Mọi chỗ chỉ có `duoiKhoa` (4 ký tự cuối).
 */
import { Router, type Request, type Response } from 'express';

import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { PHIEN_BAN_API, dsModelChinhHangGoc, gocChinhHang, modelFree } from '../services/agent/anthropicChinhHang/cauHinh.js';
import { BANG_GIA, giaCua } from '../services/agent/anthropicChinhHang/gia.js';
import {
  KhoKeyLoi, danhDauKey, doiThuTu, khoaThoCua, suaKey, themKey, xoaKey, xoaNho,
} from '../services/agent/anthropicChinhHang/khoKey.js';
import { datTranGoi, datTranRieng, docTranGoi, xoaTranRieng } from '../services/agent/anthropicChinhHang/hanMuc.js';
import { daBatMatKhau, datMatKhau, trungMatKhauKhac, type LoaiVe } from '../services/agent/anthropicChinhHang/ve.js';
import { TEN_CONG, bangClassic, bangModel } from '../services/agent/bangModel.js';
import { datGioiHanDefault, docGioiHanDefault, topDefaultHomNay } from '../services/agent/defaultGioiHan.js';
import { datTranModel, docTranModel } from '../services/agent/tranModel.js';
import { datCongTacRambo, trangThaiRambo } from '../services/llm/congTacRambo.js';
import { GiaHanLoi, datMaGiaHan, dsYeuCauAdmin, duyetYeuCau, trangThaiMa } from '../services/agent/maGiaHanTien.js';
import { priceOf, ramboSonic, thuRambo } from '../services/llm/gateway.js';
import { dsKeyAdmin, dsTranRieng, hanMucNguoiAdmin, timNguoi, tongQuanDung } from '../services/agent/anthropicChinhHang/thongKe.js';
import { CAU_HOI_SAN, traLoiThongKe } from '../services/agent/anthropicChinhHang/aiThongKe.js';
import { doiChieu, dsAdminKey } from '../services/agent/anthropicChinhHang/doiChieu.js';
import { dauThangVn } from '../services/agent/anthropicChinhHang/hanMuc.js';
import { prisma } from '../config/database.js';
import { datServerTool, docServerTool, gioiHanModel } from '../services/agent/anthropicChinhHang/caiDat.js';
import { DON_TOOL, TRAN_KY_TU_CHINH_HANG, effortTheoMuc, maxTokensAgent, nguongCompact } from '../services/agent/anthropicChinhHang/cauHinh.js';

const router = Router();
router.use(authenticate, requireAdmin('ROLE_ADMIN'));

const adminId = (req: Request) => (req as any).userId as number | undefined;

function boc(fn: (req: Request, res: Response<ApiResponse>) => Promise<void>) {
  return async (req: Request, res: Response<ApiResponse>, next: (e?: unknown) => void) => {
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof KhoKeyLoi) { next(new AppError(err.message, err.status, 'CONG_ANTHROPIC_KEY')); return; }
      if (err instanceof GiaHanLoi) { next(new AppError(err.message, err.status, err.code)); return; }
      next(err);
    }
  };
}

function idTu(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new BadRequestError('id không hợp lệ');
  return id;
}

/** Tổng quan một lần cho cả tab. */
router.get('/', boc(async (_req, res) => {
  res.json({
    success: true,
    data: {
      keys: await dsKeyAdmin(),
      daBatMatKhau: await daBatMatKhau('chung'),
      /* 18/10/2026: khoá RIÊNG của CuongMini Invisible 5.1. */
      daBatMatKhauInvisible: await daBatMatKhau('invisible'),
      tranGoi: await docTranGoi(),
      /* Bảng model CuongMini (thứ tự = danh sách người dùng thấy: free trước, rồi theo năng lực) — admin thấy cả tên thật. */
      bangModel: bangModel().map((m) => ({
        id: m.id, ten: m.ten, model: m.model, cong: m.cong, tenCong: TEN_CONG[m.cong], khoa: m.khoa,
        nangLuc: m.nangLuc, tuongDuong: m.tuongDuong, cuaSoToken: m.cuaSoToken, maxRa: m.maxRa,
        gia: m.cong === 'anthropic' ? giaCua(m.model) : priceOf(m.model),
      })),
      tranModel: await docTranModel(),
      rambo: trangThaiRambo(),
      /* 19/10/2026: nhóm CuongMini Classic (rambo) + chống spam CuongMini Default. */
      bangClassic: bangClassic().map((m) => ({ id: m.id, ten: m.ten, model: m.model, nangLuc: m.nangLuc, tuongDuong: m.tuongDuong })),
      defaultGioiHan: await docGioiHanDefault(),
      modelFree: modelFree(),
      models: dsModelChinhHangGoc().map((m) => ({ ...m, gia: giaCua(m.model) })),
      bangGia: Object.keys(BANG_GIA).map((model) => ({ model, ...giaCua(model) })),
      coAdminKey: dsAdminKey().length > 0,
      goc: gocChinhHang(),
      serverTool: await docServerTool(),
      thamSo: {
        effortMacDinh: effortTheoMuc(undefined),
        maxTokensAgent: maxTokensAgent(),
        compactTokens: nguongCompact(),
        donTool: DON_TOOL,
        tranKyTuHoiThoai: TRAN_KY_TU_CHINH_HANG,
      },
      ghiChu: 'Mọi số USD ở đây là SỐ TỰ ĐO (usage Anthropic trả về × bảng giá trong mã), không phải số dư thật.',
    },
  });
}));

// ─── Key ─────────────────────────────────────────────────────────────

router.post('/keys', boc(async (req, res) => {
  const id = await themKey(req.body ?? {});
  logger.info('[cong-anthropic] admin thêm key', { adminId: adminId(req), keyId: id });
  res.status(201).json({ success: true, data: { id, keys: await dsKeyAdmin() } });
}));

router.patch('/keys/:id', boc(async (req, res) => {
  const id = idTu(req);
  await suaKey(id, req.body ?? {});
  logger.info('[cong-anthropic] admin sửa key', { adminId: adminId(req), keyId: id, truong: Object.keys(req.body ?? {}).filter((k) => k !== 'khoa') });
  res.json({ success: true, data: { keys: await dsKeyAdmin() } });
}));

router.delete('/keys/:id', boc(async (req, res) => {
  const id = idTu(req);
  await xoaKey(id);
  logger.info('[cong-anthropic] admin xoá key', { adminId: adminId(req), keyId: id });
  res.json({ success: true, data: { keys: await dsKeyAdmin() } });
}));

router.put('/keys/thu-tu', boc(async (req, res) => {
  await doiThuTu((req.body as { ids?: unknown })?.ids);
  res.json({ success: true, data: { keys: await dsKeyAdmin() } });
}));

/**
 * "Thử kết nối" — `GET /v1/models` bằng đúng key đó: KHÔNG tốn tiền. Thành
 * công mà key đang `loi` ⇒ mở lại `hoatDong`.
 */
router.post('/keys/:id/thu', boc(async (req, res) => {
  const id = idTu(req);
  const khoa = await khoaThoCua(id);
  const batDau = Date.now();
  let status = 0;
  let models: string[] = [];
  let loi: string | null = null;
  try {
    const r = await fetch(`${gocChinhHang()}/v1/models?limit=100`, {
      headers: { 'x-api-key': khoa, 'anthropic-version': PHIEN_BAN_API },
      signal: AbortSignal.timeout(15_000),
    });
    status = r.status;
    const than = await r.text();
    if (r.ok) {
      const j = JSON.parse(than) as { data?: Array<{ id?: string }> };
      models = (j.data ?? []).map((m) => String(m.id ?? '')).filter(Boolean);
    } else {
      loi = `HTTP ${r.status} ${than.slice(0, 200)}`;
    }
  } catch (err) {
    loi = (err as Error).message;
  }
  const ms = Date.now() - batDau;
  if (!loi) {
    const k = await prisma.anthropicKey.findUnique({ where: { id }, select: { trangThai: true } });
    if (k?.trangThai === 'loi') await prisma.anthropicKey.update({ where: { id }, data: { trangThai: 'hoatDong', loiCuoi: null } });
    xoaNho();
  } else if (status === 401 || status === 403) {
    await danhDauKey(id, 'loi', loi);
  }
  const canCo = dsModelChinhHangGoc().map((m) => m.model);
  res.json({
    success: true,
    data: { ok: !loi, status, ms, loi, soModel: models.length, thieuModel: models.length ? canCo.filter((m) => !models.includes(m)) : [], keys: await dsKeyAdmin() },
  });
}));

// ─── Đo dùng ─────────────────────────────────────────────────────────

router.get('/dung', boc(async (req, res) => {
  const soNgay = Number(req.query.soNgay) || 30;
  res.json({ success: true, data: await tongQuanDung(soNgay) });
}));

/** Đối chiếu với Admin API của Anthropic (chỉ khi có ANTHROPIC_ADMIN_KEY). */
router.get('/doi-chieu', boc(async (_req, res) => {
  if (!dsAdminKey().length) { res.json({ success: true, data: { coAdminKey: false, toChuc: [] } }); return; }
  const keys = await prisma.anthropicKey.findMany({ select: { id: true, nhan: true, duoiKhoa: true } });
  const tu = dauThangVn();
  const den = new Date();
  const toChuc = await doiChieu(tu, den, keys.map((k) => k.duoiKhoa));
  const tuDo = await prisma.anthropicUsage.groupBy({ by: ['keyId'], where: { createdAt: { gte: tu } }, _sum: { costUsd: true } });
  res.json({
    success: true,
    data: {
      coAdminKey: true, tu: tu.toISOString(), den: den.toISOString(), toChuc,
      tuDo: keys.map((k) => ({ ...k, usd: tuDo.find((r) => r.keyId === k.id)?._sum.costUsd ?? 0 })),
    },
  });
}));

// ─── Trần theo gói / người ───────────────────────────────────────────

router.get('/tran', boc(async (_req, res) => {
  res.json({ success: true, data: { tranGoi: await docTranGoi(), rieng: await dsTranRieng() } });
}));

/** Body: { pro?: {free?:{thang,ngay}, cao?:{thang,ngay}}, key_terminal?: {...} } — null = không giới hạn ô đó. */
router.put('/tran/goi', boc(async (req, res) => {
  const tranGoi = await datTranGoi(req.body);
  logger.info('[cong-anthropic] admin đổi trần gói', { adminId: adminId(req) });
  res.json({ success: true, data: { tranGoi } });
}));

router.get('/tran/tim', boc(async (req, res) => {
  res.json({ success: true, data: await timNguoi(String(req.query.q ?? '')) });
}));

router.get('/tran/nguoi/:id', boc(async (req, res) => {
  res.json({ success: true, data: await hanMucNguoiAdmin(idTu(req)) });
}));

/** Body: { tranThangUsd?, tranNgayUsd?, freeThangUsd?, freeNgayUsd?, ghiChu? } — null/'' = theo gói. */
router.put('/tran/nguoi/:id', boc(async (req, res) => {
  const userId = idTu(req);
  try {
    await datTranRieng(userId, req.body ?? {});
  } catch (err) {
    throw new BadRequestError((err as Error).message);
  }
  logger.info('[cong-anthropic] admin đặt trần riêng', { adminId: adminId(req), userId });
  res.json({ success: true, data: await hanMucNguoiAdmin(userId) });
}));

router.delete('/tran/nguoi/:id', boc(async (req, res) => {
  const userId = idTu(req);
  await xoaTranRieng(userId);
  res.json({ success: true, data: await hanMucNguoiAdmin(userId) });
}));

// ─── AI thống kê chi tiêu (Sonnet 5.5 qua cổng chính hãng) ───────────────

router.get('/ai-thong-ke/cau-hoi', boc(async (_req, res) => {
  res.json({ success: true, data: CAU_HOI_SAN.map((c) => ({ id: c.id, nhan: c.nhan })) });
}));

/** Body: { id: <mã câu hỏi có sẵn> } hoặc { cauHoi: '<chữ tự gõ, ≤300>' }. Model chỉ ĐỀ XUẤT trần; áp dụng bằng PUT /tran/nguoi/:id. */
router.post('/ai-thong-ke', boc(async (req, res) => {
  const b = (req.body ?? {}) as { id?: unknown; cauHoi?: unknown };
  const id = typeof b.id === 'string' ? b.id : undefined;
  if (id && !CAU_HOI_SAN.some((c) => c.id === id)) throw new BadRequestError('Câu hỏi không có trong danh sách');
  const cauHoi = typeof b.cauHoi === 'string' ? b.cauHoi : undefined;
  if (!id && !cauHoi?.trim()) throw new BadRequestError('Thiếu câu hỏi');
  res.setHeader('Cache-Control', 'private, no-store');
  res.json({ success: true, data: await traLoiThongKe(adminId(req)!, { id, cauHoi }) });
}));

// ─── Server tool của Anthropic (web_search / code_execution) — mặc định TẮT ───

router.put('/server-tools', boc(async (req, res) => {
  const b = (req.body ?? {}) as { webSearch?: unknown; codeExecution?: unknown };
  const v = await datServerTool({
    ...(typeof b.webSearch === 'boolean' ? { webSearch: b.webSearch } : {}),
    ...(typeof b.codeExecution === 'boolean' ? { codeExecution: b.codeExecution } : {}),
  });
  logger.info('[cong-anthropic] admin đổi server tool', { adminId: adminId(req), ...v });
  res.json({ success: true, data: v });
}));

/** Giới hạn THẬT của model (GET /v1/models/{id}, nhớ 1 ngày). */
router.get('/gioi-han', boc(async (_req, res) => {
  const ds = await Promise.all(dsModelChinhHangGoc().map(async (m) => ({ model: m.model, ...(await gioiHanModel(m.model)) })));
  res.json({ success: true, data: ds });
}));

// ─── Khoá (mật khẩu) ─────────────────────────────────────────────────

/**
 * Đặt/đổi một khoá. Body `{ matKhau: string }` (vé cũ của loại đó chết), `{ matKhau: null }`
 * để TẮT loại đó với người thường. Hai khoá PHẢI khác nhau — trùng thì nhập khoá chung là
 * mở luôn Invisible, mất nghĩa "khoá riêng".
 */
async function datKhoa(loai: LoaiVe, req: Request, res: Response<ApiResponse>): Promise<void> {
  const raw = (req.body as { matKhau?: unknown })?.matKhau;
  if (raw === null) {
    await datMatKhau(loai, null);
  } else {
    const mk = String(raw ?? '');
    if (mk.length < 6) throw new BadRequestError('Mật khẩu tối thiểu 6 ký tự. / Password must be at least 6 characters.');
    if (mk.length > 200) throw new BadRequestError('Mật khẩu quá dài. / Password too long.');
    if (await trungMatKhauKhac(loai, mk)) {
      throw new BadRequestError('Hai khoá phải khác nhau (khoá chung ≠ khoá Invisible). / The two keys must differ.');
    }
    await datMatKhau(loai, mk);
  }
  logger.info('[cong-anthropic] admin đổi khoá', { adminId: adminId(req), loai, tat: raw === null });
  res.json({ success: true, data: { daBatMatKhau: await daBatMatKhau('chung'), daBatMatKhauInvisible: await daBatMatKhau('invisible') } });
}

/** Khoá CHUNG — mở mọi model không thuộc nhóm free, trừ Invisible. */
router.put('/mat-khau', boc((req, res) => datKhoa('chung', req, res)));
/** Khoá RIÊNG của CuongMini Invisible 5.1. */
router.put('/mat-khau-invisible', boc((req, res) => datKhoa('invisible', req, res)));

// ─── Trần theo model × người (18/10/2026) ───────────────────────────

/** Body: { [maModel]: { pro?: {thang, ngay}, key_terminal?: {thang, ngay} } } — null = không giới hạn ô đó. */
router.put('/tran-model', boc(async (req, res) => {
  const tranModel = await datTranModel(req.body);
  logger.info('[cong-anthropic] admin đổi trần theo model', { adminId: adminId(req) });
  res.json({ success: true, data: { tranModel } });
}));

// ─── Mã gia hạn theo $ (19/10/2026) — services/agent/maGiaHanTien.ts ─────

/** Trạng thái mã (KHÔNG có băm) + yêu cầu chờ duyệt + 50 lượt gần nhất. */
router.get('/gia-han-tien', boc(async (_req, res) => {
  res.json({ success: true, data: { ma: await trangThaiMa(), ...(await dsYeuCauAdmin()) } });
}));

/** Body `{ ma: string }` đặt/đổi (mã cũ chết ngay) · `{ ma: null }` tắt. Chỉ lưu băm; KHÔNG log mã. */
router.put('/ma-gia-han', boc(async (req, res) => {
  const raw = (req.body as { ma?: unknown })?.ma;
  const kq = await datMaGiaHan(raw === null ? null : String(raw ?? ''));
  logger.info('[gia-han-tien] admin đổi mã gia hạn', { adminId: adminId(req), tat: raw === null, phienBan: kq.phienBan });
  res.json({ success: true, data: kq });
}));

/** Body `{ dongY: boolean, lyDo?: string }` — duyệt (cộng thêm một mức) hoặc từ chối một yêu cầu chờ. */
router.post('/gia-han-tien/:id', boc(async (req, res) => {
  const b = (req.body ?? {}) as { dongY?: unknown; lyDo?: unknown };
  if (typeof b.dongY !== 'boolean') throw new BadRequestError('Thiếu dongY (true/false).');
  const yeuCau = await duyetYeuCau(adminId(req)!, idTu(req), b.dongY, { quyen: 'admin', ...(typeof b.lyDo === 'string' ? { lyDo: b.lyDo } : {}) });
  res.json({ success: true, data: { yeuCau, ...(await dsYeuCauAdmin()) } });
}));

// ─── Công tắc cổng rambo (mặc định TẮT) ─────────────────────────────

/** Body: { bat: boolean }. Env `RAMBO_BAT` (nếu đặt) thắng công tắc này. */
router.put('/rambo', boc(async (req, res) => {
  const bat = (req.body as { bat?: unknown })?.bat === true;
  await datCongTacRambo(bat);
  logger.info('[cong-anthropic] admin đổi công tắc rambo', { adminId: adminId(req), bat });
  res.json({ success: true, data: trangThaiRambo() });
}));

/**
 * NÚT "THỬ RAMBO" (19/10/2026): đọc danh sách model + gọi RẤT NGẮN (`max_tokens: 1`) model của nhóm Classic.
 * Rambo là gói trả trọn ⇒ không tốn tiền theo token. Không bao giờ trả khoá.
 */
router.post('/rambo/thu', boc(async (req, res) => {
  const models = [...new Set([ramboSonic(), ...bangClassic().map((m) => m.model)])];
  const kq = await thuRambo(models);
  logger.info('[cong-anthropic] admin thử rambo', { adminId: adminId(req), ok: kq.models.filter((m) => m.ok).length, tong: kq.models.length });
  res.json({ success: true, data: { ketQua: kq, trangThai: trangThaiRambo() } });
}));

/** Chống spam CuongMini Default — GET đọc, PUT ghi `{ phutNguoi?, ngayFree?, ngayIp? }` (0 = tắt). */
router.get('/default-gioi-han', boc(async (_req, res) => {
  res.json({ success: true, data: await docGioiHanDefault() });
}));
router.put('/default-gioi-han', boc(async (req, res) => {
  const v = await datGioiHanDefault(req.body ?? {});
  logger.info('[cong-anthropic] admin đổi chống spam Default', { adminId: adminId(req), ...v });
  res.json({ success: true, data: v });
}));

/**
 * 22/10/2026 — CuongMini trong CT Work: chống spam của lượt ĐƯỢC TÀI TRỢ (người Pro / nhóm có trưởng nhóm Pro) + chuỗi cổng
 * đang hiệu lực (rambo → chính hãng → modelapi; tên model thật — chỉ admin thấy). PUT `{ phutNguoi?, ngayNguoi?, ngayIp? }`, 0 = tắt.
 */
router.get('/ctwork-ai', boc(async (_req, res) => {
  const { docGioiHanTaiTro } = await import('../services/work/aiTaiTro.js');
  const { chuoiCongHienTai } = await import('../services/work/aiCong.js');
  // 22/10/2026: số lần model trả markup gọi tool dạng chữ (DSML…) theo cổng+model, từ khi tiến trình chạy.
  const { thongKeMarkupTool } = await import('../services/work/aiMarkupTool.js');
  // 24/10/2026: thêm dòng chấm bài phòng thi (rambo Opus 5 → chính hãng Sonnet 5.5 → modelapi) — cùng bảng chuỗi theo việc.
  const { chuoiChamThiHienTai } = await import('../services/exam/aiChamCong.js');
  res.json({ success: true, data: { gioiHan: await docGioiHanTaiTro(), chuoi: { work_assistant: chuoiCongHienTai('work_assistant'), work_spec_review: chuoiCongHienTai('work_spec_review'), work_digest: chuoiCongHienTai('work_digest'), exam_grade: chuoiChamThiHienTai() }, markupTool: thongKeMarkupTool() } });
}));
router.put('/ctwork-ai-gioi-han', boc(async (req, res) => {
  const { datGioiHanTaiTro } = await import('../services/work/aiTaiTro.js');
  const v = await datGioiHanTaiTro(req.body ?? {});
  logger.info('[cong-anthropic] admin đổi chống spam CuongMini CT Work', { adminId: adminId(req), ...v });
  res.json({ success: true, data: v });
}));

/** Ai dùng CuongMini Default nhiều nhất hôm nay (phát hiện lạm dụng) + IP đông nhất. */
router.get('/default-top', boc(async (_req, res) => {
  res.json({ success: true, data: await topDefaultHomNay(20) });
}));

export default router;
