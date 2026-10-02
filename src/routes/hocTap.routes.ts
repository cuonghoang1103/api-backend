/**
 * /api/v1/hoc-tap — Huấn luyện học kỳ. Kế hoạch: docs/hoc-tap-coach-plan.md
 *
 * Xác thực: JWT như mọi route, HOẶC token cá nhân `Bearer ctw_…` (tạo ở CT Work →
 * API tokens, quyền write) — đường Claude Code dùng để chấm và giao việc.
 * Chỉ đường token mới được CHẤM TAY (`POST /viec/:id/cham`); JWT thì không, kể cả
 * admin — chủ web cũng là người học, nút "tự tích" là thứ họ yêu cầu bỏ đi.
 */
import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { BadRequestError, ForbiddenError } from '../middleware/errorHandler.js';
import { apiTokenAuth } from '../services/work/apiTokens.service.js';
import * as svc from '../services/hocTap/hocTap.service.js';
import { canHanMuc, chamBangChungAI, chamNen, hanMucAI, traLoiVanDap } from '../services/hocTap/chamBangChung.js';
import { batDauSoanKeHoach, loiHuanLuyen, trangThaiSoan } from '../services/hocTap/keHoachAI.js';
import { prisma } from '../config/database.js';
import { xepLich } from '../services/hocTap/xepLich.js';

const router = Router();
router.use(apiTokenAuth);
router.use((req, res, next) => (req.workToken ? next() : authenticate(req, res, next)));

type H = (req: Request, res: Response) => Promise<unknown>;
const h = (fn: H) => (req: Request, res: Response, next: (e?: unknown) => void) => {
  fn(req, res).then((data) => { if (!res.headersSent) res.json({ success: true, data }); }).catch(next);
};
const id = (req: Request, k = 'id') => {
  const n = Number(req.params[k]);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${k}" không hợp lệ`);
  return n;
};
function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const r = schema.safeParse(body ?? {});
  if (!r.success) throw new BadRequestError(r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  return r.data;
}
/** Người chấm hợp lệ ngoài AI: chỉ Claude Code qua token có quyền write. */
const laNguoiCham = (req: Request) => !!req.workToken?.scopes.includes('write');

const viecSchema = z.object({
  tuan: z.number().int(),
  thu: z.number().int().min(1).max(7).optional(),
  hanChot: z.string().optional(),
  loai: z.string(),
  tieuDe: z.string().min(1).max(255),
  huongDan: z.string().max(20_000).nullish(),
  yeuCauBangChung: z.string().max(4000).nullish(),
  lienKet: z.string().max(500).nullish(),
  thoiLuongPhut: z.number().int().optional(),
  trongSo: z.number().int().optional(),
});

// ─── Tổng quan ───────────────────────────────────────────────────
router.get('/tong-quan', h(async (req) => svc.tongQuan(req.userId!)));
router.get('/han-muc', h(async (req) => hanMucAI(req.userId!)));
router.get('/rui-ro/lich-su', h(async (req) => svc.lichSuRuiRo(req.userId!, Math.min(180, Number(req.query.ngay) || 60))));

/** AI nhận xét tình hình — con số lấy từ mã, AI chỉ diễn đạt. */
router.post('/nhan-xet', h(async (req) => {
  await canHanMuc(req.userId!);
  const tq = await svc.tongQuan(req.userId!);
  if (!tq.hocKy) throw new BadRequestError('Chưa có kỳ học');
  const soLieu = {
    tuan: `${tq.tuan}/${tq.hocKy.soTuan}`,
    tyLeTruotCaKy: tq.ruiRoKy.tyLe,
    mon: tq.mon.map((m) => ({ ma: m.maMon, tyLeTruot: m.ruiRo.tyLe, tienDo: m.ruiRo.tienDo, kyVong: m.ruiRo.kyVong, quaHan: m.ruiRo.quaHan, lyDo: m.ruiRo.lyDo, viecKeTiep: m.viecKeTiep?.tieuDe, thi: m.thiSapToi })),
    viecQuaHan: tq.quaHan.slice(0, 15).map((v) => `${v.maMon}: ${v.tieuDe}`),
    viecHomNay: tq.homNay.slice(0, 10).map((v) => `${v.maMon}: ${v.tieuDe} (${v.thoiLuongPhut}')`),
  };
  return { loi: await loiHuanLuyen(req.userId!, soLieu) };
}));

// ─── Môn ─────────────────────────────────────────────────────────
router.post('/mon', h(async (req) => svc.themMon(req.userId!, parse(z.object({
  hocKyId: z.number().int().optional(), maMon: z.string().min(2).max(30), ten: z.string().max(200).optional(),
  trinhDo: z.string().max(4000).optional(), mucTieu: z.string().max(200).optional(),
}), req.body))));
router.get('/mon/:id', h(async (req) => svc.chiTietMon(req.userId!, id(req))));
router.patch('/mon/:id', h(async (req) => svc.suaMon(req.userId!, id(req), parse(z.object({
  ten: z.string().max(200).optional(), trinhDo: z.string().max(4000).nullish(), mucTieu: z.string().max(200).nullish(),
  mau: z.string().optional(), thuTu: z.number().int().optional(),
}), req.body))));
router.delete('/mon/:id', h(async (req) => { await svc.xoaMon(req.userId!, id(req)); return { ok: true }; }));

// ─── Kế hoạch AI ─────────────────────────────────────────────────
router.post('/mon/:id/ke-hoach', h(async (req) => {
  await canHanMuc(req.userId!);
  const monId = id(req);
  await prisma.monHocKy.findFirstOrThrow({ where: { id: monId, userId: req.userId! } }).catch(() => { throw new BadRequestError('Không tìm thấy môn'); });
  const { ghiChu } = parse(z.object({ ghiChu: z.string().max(2000).optional() }), req.body);
  return { jobId: batDauSoanKeHoach(req.userId!, monId, ghiChu) };
}));
router.get('/ke-hoach/:jobId', h(async (req) => trangThaiSoan(req.userId!, String(req.params.jobId))));
router.post('/mon/:id/ke-hoach/ap-dung', h(async (req) => {
  const monId = id(req);
  const b = parse(z.object({ viec: z.array(viecSchema).min(1).max(300), nenTang: z.array(z.object({ slug: z.string(), ten: z.string(), lyDo: z.string().optional() })).optional() }), req.body);
  const kq = await svc.themViec(req.userId!, monId, b.viec, 'AI');
  if (b.nenTang) await prisma.monHocKy.update({ where: { id: monId }, data: { nenTang: b.nenTang } });
  return kq;
}));

// ─── Việc ────────────────────────────────────────────────────────
/** Thêm việc tay: người học tự thêm (nguồn NGUOI_HOC), hoặc Claude giao qua token. */
router.post('/mon/:id/viec', h(async (req) => {
  const b = parse(z.object({ viec: z.array(viecSchema).min(1).max(300) }), req.body);
  return svc.themViec(req.userId!, id(req), b.viec, laNguoiCham(req) ? 'CLAUDE' : 'NGUOI_HOC');
}));
router.get('/viec/:id', h(async (req) => {
  const v = await svc.viecCuaToi(req.userId!, id(req));
  const bangChung = await prisma.bangChungHoc.findMany({ where: { nhiemVuId: v.id }, orderBy: { lanNop: 'desc' } });
  return { ...v, bangChung };
}));
router.patch('/viec/:id', h(async (req) => svc.suaViec(req.userId!, id(req), parse(viecSchema.partial(), req.body), laNguoiCham(req))));
router.delete('/viec/:id', h(async (req) => { await svc.xoaViec(req.userId!, id(req), laNguoiCham(req)); return { ok: true }; }));
/** Xếp lại giờ học cho mọi việc chưa bắt đầu (sau khi lịch lớp đổi, hoặc muốn làm mới). */
router.post('/xep-lich', h(async (req) => {
  const { tu } = parse(z.object({ tu: z.string().optional() }), req.body);
  const moc = tu ? new Date(tu) : undefined;
  if (moc && Number.isNaN(moc.getTime())) throw new BadRequestError('"tu" không hợp lệ');
  // Chỉ lùi TRONG ngày A: ngày A = 05:00 sáng → 05:00 sáng hôm sau (00:00–05:00 là giờ bù đêm
  // của chính ngày A). Người dùng chốt 02/10: "không được qua ngày khác".
  if (moc) {
    const now = Date.now();
    const VN = 7 * 3_600_000, NGAY = 86_400_000;
    const dauNgayA = Math.floor((now - 5 * 3_600_000 + VN) / NGAY) * NGAY - VN + 5 * 3_600_000; // 05:00 VN của ngày A
    if (moc.getTime() > dauNgayA + NGAY) throw new BadRequestError('Chỉ được lùi lịch trong ngày hôm nay — muộn nhất 05:00 sáng mai (giờ bù đêm).');
  }
  return { daXep: await xepLich(req.userId!, { tu: moc }) };
}));
router.patch('/viec/:id/gio', h(async (req) => {
  const { gioBatDau } = parse(z.object({ gioBatDau: z.string().min(10) }), req.body);
  return svc.doiGio(req.userId!, id(req), new Date(gioBatDau));
}));
router.post('/viec/:id/bat-dau', h(async (req) => svc.batDauViec(req.userId!, id(req))));

/** Nộp bằng chứng ⇒ AI chấm NỀN; client hỏi lại GET /viec/:id. */
router.post('/viec/:id/nop', h(async (req) => {
  const b = parse(z.object({
    noiDung: z.string().max(30_000).optional(),
    lienKet: z.array(z.string().max(500)).max(10).optional(),
    tep: z.array(z.object({ url: z.string().max(1000), ten: z.string().max(200).optional(), loai: z.string().max(100).optional() })).max(10).optional(),
    khongChamAI: z.boolean().optional(),
  }), req.body);
  if (!b.khongChamAI) await canHanMuc(req.userId!);
  const bc = await svc.nopBangChung(req.userId!, id(req), b);
  // `khongChamAI`: nộp để Claude chấm trong phiên học (không tốn lượt AI web).
  if (!b.khongChamAI) chamNen(bc.id);
  return bc;
}));

/** Trả lời vấn đáp sau khi bằng chứng đạt — đúng ≥ 2/3 câu mới DAT. */
router.post('/viec/:id/van-dap', h(async (req) => {
  await canHanMuc(req.userId!);
  const { traLoi } = parse(z.object({ traLoi: z.array(z.string().max(3000)).min(1).max(3) }), req.body);
  return traLoiVanDap(req.userId!, id(req), traLoi);
}));

router.post('/bang-chung/:id/cham-lai', h(async (req) => {
  await canHanMuc(req.userId!);
  const bc = await prisma.bangChungHoc.findFirst({ where: { id: id(req), userId: req.userId! } });
  if (!bc) throw new BadRequestError('Không tìm thấy lần nộp');
  if (bc.chamLuc) throw new BadRequestError('Lần nộp này đã được chấm — nộp lần mới nếu muốn chấm lại');
  await chamBangChungAI(bc.id);
  return prisma.nhiemVuHoc.findUnique({ where: { id: bc.nhiemVuId } });
}));

/** Claude Code chấm (chỉ token). */
router.post('/viec/:id/cham', h(async (req) => {
  if (!laNguoiCham(req)) throw new ForbiddenError('Chỉ AI hoặc Claude (token write) được chấm — không tự tích được.');
  const b = parse(z.object({
    dat: z.boolean(), diem: z.number().min(0).max(10), nhanXet: z.string().min(1).max(4000),
    loiCanSua: z.array(z.string().max(600)).max(20).default([]), canCaiThien: z.array(z.string().max(600)).max(20).default([]),
    diemManh: z.array(z.string().max(600)).max(10).optional(), bangChung: z.string().max(30_000).optional(),
  }), req.body);
  return svc.chamBoiClaude(req.userId!, id(req), { ...b, loiCanSua: b.loiCanSua ?? [], canCaiThien: b.canCaiThien ?? [] });
}));

export default router;
