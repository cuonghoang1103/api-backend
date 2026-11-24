/**
 * NHẬN XÉT HỌC TẬP HẰNG TUẦN của CuongMini (tiếng Anh) — phần CSDL + gọi model + email + job, 24/11/2026.
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Luật tính + prompt + kiểm chữ model: `nhanXetTuanThuan.ts` (thuần, có test). Tuyến: `routes/ctlanguage.nhanXetTuan.routes.ts`
 * (`/api/v1/ctlanguage/nhan-xet-tuan`). Bảng: `ielts_nhan_xet_tuan`, `ielts_nhan_xet_cai_dat`.
 *
 * Nhịp:
 *   · Mở trang ⇒ web hỏi danh sách; tuần đã khép gần nhất chưa có báo cáo ⇒ web gọi POST /tao (tạo một lần).
 *   · "Tạo lại": tối đa `TRAN_TAO_LAI` lần mỗi tuần (admin không trần). Báo cáo của tuần đang dở mà tuần đó đã khép ⇒
 *     lần mở sau tự làm lại MỘT lần (không tính vào trần) để số liệu đủ 7 ngày.
 *   · Job Chủ nhật 20:30 giờ VN: CHỈ chạy khi `NHAN_XET_TUAN_CRON=1` (mặc định TẮT), gọi model dạng việc NỀN
 *     (`feature: 'bulk_gen'` ⇒ cần thêm `LLM_BACKGROUND_ENABLED=true`, bị cắt ở trần tiền mềm). Model không gọi được ⇒
 *     job KHÔNG lưu gì (người dùng mở trang sẽ tạo).
 *   · Email tóm tắt: tuỳ chọn của người dùng (mặc định TẮT), chỉ gửi báo cáo tuần ĐÃ KHÉP, mỗi tuần một thư, email đã
 *     xác thực. Đi qua `email.service.ts` (local: hộp thư giả sandbox).
 */
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { laAdmin } from '../pro.service.js';
import { emailService } from '../email.service.js';
import { renderSiteEmail, siteUrl, greetingFor, type EmailBlock } from '../emailLayout.js';
import { khoHtv } from '../ctlanguage/hocTuVung.js';
import {
  KHOA_EN, DUONG, chonDiemYeu, congNgay, dungChiMuc, dungPrompt, dungThuTomTat, docJson, goiYDiemManh, khungTuan,
  kiemNhanXet, lapKeHoach, nguonDuLieu, nhanXetDuPhong, tieuChiNoi, tieuChiViet, tinhSoLieu, tuanCua, tuanDaXongGanNhat, tuanHopLe,
  type ChiMuc, type DuLieuTho, type LuotThiTho, type MucLuc, type NhanXet, type SoLieuTuan,
} from './nhanXetTuanThuan.js';

/** Số lần "Tạo lại" mỗi tuần (ngoài lần tạo đầu). */
export const TRAN_TAO_LAI = 3;
/** Xem/tạo được báo cáo của tối đa ngần này tuần về trước. */
const TUAN_TOI_DA = 12;

/* ── Mục lục khoá (content/ielts/muc-luc-khoa.json) ── */
let mucLucDem: { ml: MucLuc; cm: ChiMuc } | null = null;
export function mucLuc(): { ml: MucLuc; cm: ChiMuc } {
  if (mucLucDem) return mucLucDem;
  let ml: MucLuc = { khoa: {} };
  try {
    ml = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'ielts', 'muc-luc-khoa.json'), 'utf8')) as MucLuc;
  } catch (e) {
    logger.warn('[nhan-xet-tuan] thiếu content/ielts/muc-luc-khoa.json — chạy scripts/ielts-muc-luc-khoa.mts', { error: (e as Error).message });
  }
  mucLucDem = { ml, cm: dungChiMuc(ml) };
  return mucLucDem;
}

let loTrinhDem: DuLieuTho['loTrinhTu'] | undefined;
function loTrinhTu(): DuLieuTho['loTrinhTu'] {
  if (loTrinhDem !== undefined) return loTrinhDem;
  try {
    const lt = khoHtv('en').theoNgay;
    loTrinhDem = lt ? lt.nhom.flatMap((n) => n.bai.map((b) => ({ id: b.id, ten: b.ten, k: b.tu.map((t) => t.k) }))) : null;
  } catch (e) {
    logger.warn('[nhan-xet-tuan] không nạp được lộ trình từ vựng', { error: (e as Error).message });
    loTrinhDem = null;
  }
  return loTrinhDem;
}

/* ── Gom dữ liệu thô ── */

const so = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export async function gomDuLieu(userId: number, tuan: string, bayGio = new Date()): Promise<DuLieuTho> {
  const { tuLuc, denLuc } = khungTuan(tuan);
  const truocTu = new Date(tuLuc.getTime() - 7 * 86_400_000);
  const tuNgay35 = congNgay(tuan, -35);
  const khoa = [...KHOA_EN];
  const [tienDo, hocNgay, theTong, theThuoc, onIelts, luot, soLoi, ctlNgay, theCtl, soCtl, ctlThi, xepLop] = await Promise.all([
    prisma.ieltsProgress.findMany({
      where: { userId, stage: { in: khoa }, kind: { in: ['bai', 'baitap'] } },
      select: { stage: true, kind: true, muc: true, xong: true, diem: true, createdAt: true, updatedAt: true }, take: 20_000,
    }),
    prisma.hocNgay.findMany({ where: { userId, stage: { in: khoa }, day: { gte: tuNgay35 } }, select: { day: true } }),
    prisma.ieltsVocabCard.count({ where: { userId } }),
    prisma.ieltsVocabCard.count({ where: { userId, khoang: { gte: 21 } } }),
    prisma.ieltsVocabReview.findMany({
      where: { userId, ngay: { gte: congNgay(tuan, -7), lte: congNgay(tuan, 6) } }, select: { ngay: true, diem: true, moi: true }, take: 10_000,
    }),
    prisma.ieltsCdtAttempt.findMany({
      where: { userId, createdAt: { gte: truocTu, lt: denLuc } },
      select: { kyNang: true, cheDo: true, dung: true, tong: true, band: true, giay: true, createdAt: true, chiTiet: true }, take: 300,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.ieltsMistake.findMany({
      where: { userId },
      select: { kyNang: true, dang: true, lyDo: true, lanSai: true, daXong: true, hanOn: true, createdAt: true, updatedAt: true, lanOnCuoi: true }, take: 5_000,
    }),
    prisma.ctlHoatDongNgay.findMany({
      where: { userId, nn: 'en', ngay: { gte: new Date(`${tuNgay35}T00:00:00Z`) } }, select: { ngay: true, giay: true, theOn: true, goi: true, thi: true },
    }),
    prisma.ctlSoTuMuc.findMany({ where: { userId, loai: 'the', xoa: false, khoa: { startsWith: 'en-' } }, select: { duLieu: true }, take: 20_000 }),
    prisma.ctlSoTuMuc.findMany({ where: { userId, loai: 'so', xoa: false }, select: { khoa: true, duLieu: true } }),
    prisma.ctlLuotThi.findMany({
      where: { userId, nn: 'en', nopLuc: { gte: truocTu, lt: denLuc } }, select: { kyThi: true, cap: true, diem: true, diemToiDa: true, nopLuc: true }, take: 100,
    }),
    prisma.ieltsXepLop.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { tapHieuLuc: true, ngayHieuLuc: true, overall: true } }),
  ]);

  const soHtv = new Set(soCtl.filter((x) => (x.duLieu as { nguon?: unknown } | null)?.nguon === 'hoc-tu-vung:en').map((x) => x.khoa));
  const theCtlTho: DuLieuTho['theCtl'] = [];
  for (const r of theCtl) {
    const d = r.duLieu as { muc?: { chu?: unknown }; themLuc?: unknown; khoangNgay?: unknown; lanOnCuoi?: unknown; denHan?: unknown; so?: unknown } | null;
    if (!d || typeof d.muc?.chu !== 'string' || typeof d.themLuc !== 'string' || typeof d.denHan !== 'string') continue;
    theCtlTho.push({
      chu: d.muc.chu, themLuc: new Date(d.themLuc), khoangNgay: so(d.khoangNgay) ?? 0,
      lanOnCuoi: typeof d.lanOnCuoi === 'string' ? new Date(d.lanOnCuoi) : null, denHan: new Date(d.denHan),
      trongSoHtv: Array.isArray(d.so) && d.so.some((x) => soHtv.has(String(x))),
    });
  }
  const luotThi: LuotThiTho[] = luot.map((l) => {
    const base: LuotThiTho = { kyNang: l.kyNang, cheDo: l.cheDo, dung: l.dung, tong: l.tong, band: l.band, giay: l.giay, createdAt: l.createdAt };
    if (l.kyNang === 'viet') base.tieuChi = tieuChiViet(l.chiTiet);
    if (l.kyNang === 'noi') { const n = tieuChiNoi(l.chiTiet); base.tieuChi = n.tieuChi; base.azure = n.azure; }
    return base;
  });

  return {
    tuan, bayGio, tienDo, ngayHocKhoa: [...new Set(hocNgay.map((h) => h.day))],
    theIelts: { tong: theTong, daThuoc: theThuoc }, onIelts, luotThi, soLoi,
    ctlNgay: ctlNgay.map((c) => ({ ngay: c.ngay.toISOString().slice(0, 10), giay: c.giay, theOn: c.theOn, goi: c.goi, thi: c.thi })),
    theCtl: theCtlTho,
    ctlThi: ctlThi.filter((t): t is typeof t & { nopLuc: Date } => t.nopLuc != null),
    xepLop: xepLop ? { tap: xepLop.tapHieuLuc, ngay: xepLop.ngayHieuLuc, overall: xepLop.overall } : null,
    loTrinhTu: loTrinhTu(),
  };
}

/* ── Tạo báo cáo ── */

type Dong = Awaited<ReturnType<typeof prisma.ieltsNhanXetTuan.findUnique>>;
const dangTao = new Set<number>();

export function dinhDang(r: NonNullable<Dong>, admin = false) {
  const soLieu = r.soLieu as unknown as SoLieuTuan & { nguonDuLieu?: unknown };
  return {
    tuan: r.tuan, tuNgay: soLieu.tuNgay, denNgay: soLieu.denNgay, dangDo: r.denLuc.getTime() < khungTuan(r.tuan).denLuc.getTime(),
    nguon: r.nguon, model: r.model, lanTao: r.lanTao, conLanTaoLai: admin ? null : Math.max(0, 1 + TRAN_TAO_LAI - r.lanTao),
    taoLuc: r.updatedAt, emailLuc: r.emailLuc,
    soLieu, diemYeu: r.diemYeu, keHoach: r.keHoach, nhanXet: r.nhanXet,
  };
}

/** Gọi model; trả null nếu không gọi được (hết hạn mức, AI tắt, lỗi) — nơi gọi dùng chữ dự phòng. */
async function vietNhanXet(userId: number, s: SoLieuTuan, prompt: { system: string; user: string }, duPhong: NhanXet, nen: boolean) {
  const feature = nen ? 'bulk_gen' : 'language';
  if (!isAiAvailable(feature)) return null;
  if (!(await checkTokenQuota(userId))) return null;
  try {
    const r = await llmComplete({
      step: 'generation', purpose: 'language_weekly', feature, userId,
      system: prompt.system, messages: [{ role: 'user', content: prompt.user }],
      maxTokens: 2500, timeoutMs: 90_000, maxRetries: 1,
    });
    const { nhanXet, soBiThay } = kiemNhanXet(docJson(r.text), duPhong, prompt.user);
    if (soBiThay) logger.warn('[nhan-xet-tuan] thay chữ model bằng chữ dự phòng', { userId, tuan: s.tuan, soBiThay });
    return { nhanXet, model: r.model };
  } catch (e) {
    logger.warn('[nhan-xet-tuan] model hỏng — dùng chữ dự phòng', { userId, tuan: s.tuan, error: (e as Error).message });
    return null;
  }
}

export async function taoBaoCao(userId: number, tuanV: unknown, o: { lamLai?: boolean; nen?: boolean; bayGio?: Date } = {}) {
  const bayGio = o.bayGio ?? new Date();
  const tuan = tuanV == null || tuanV === '' ? tuanDaXongGanNhat(bayGio) : String(tuanV);
  if (!tuanHopLe(tuan)) throw new BadRequestError('Tuần phải là ngày thứ Hai dạng YYYY-MM-DD');
  const hienTai = tuanCua(bayGio);
  if (tuan > hienTai) throw new BadRequestError('Không tạo được báo cáo cho tuần chưa tới');
  if (tuan < congNgay(hienTai, -7 * TUAN_TOI_DA)) throw new BadRequestError(`Chỉ tạo được báo cáo của ${TUAN_TOI_DA} tuần gần nhất`);
  if (dangTao.has(userId)) throw new AppError('CuongMini đang viết một báo cáo cho bạn, chờ ít giây rồi thử lại.', 409);

  const admin = await laAdmin(userId).catch(() => false);
  const cu = await prisma.ieltsNhanXetTuan.findUnique({ where: { uk_ielts_nhan_xet_tuan: { userId, tuan } } });
  const cuoiTuan = khungTuan(tuan).denLuc;
  // Báo cáo dựng khi tuần còn dở (thiếu > 6 giờ cuối tuần) mà tuần đã khép ⇒ làm lại một lần cho đủ số liệu.
  // Job Chủ nhật 20:30 chỉ thiếu 3,5 giờ ⇒ không làm lại (đỡ gọi model hai lần).
  const cuDo = !!cu && cuoiTuan.getTime() - cu.denLuc.getTime() > 6 * 3_600_000 && bayGio.getTime() >= cuoiTuan.getTime();
  if (cu && !o.lamLai && !cuDo) return { ...dinhDang(cu, admin), moiTao: false };
  if (cu && o.lamLai && !admin && cu.lanTao >= 1 + TRAN_TAO_LAI) {
    throw new AppError(`Tuần này đã tạo lại ${TRAN_TAO_LAI} lần — mỗi tuần tối đa ${TRAN_TAO_LAI} lần để tiết kiệm lượt AI.`, 429);
  }

  dangTao.add(userId);
  try {
    const { ml, cm } = mucLuc();
    const tho = await gomDuLieu(userId, tuan, bayGio);
    const s = tinhSoLieu(tho, ml, cm);
    const yeu = chonDiemYeu(s);
    const manh = goiYDiemManh(s);
    const keHoach = lapKeHoach(s, yeu, ml);
    const duPhong = nhanXetDuPhong(s, yeu, manh);
    const ai = s.trong ? null : await vietNhanXet(userId, s, dungPrompt(s, yeu, manh, keHoach), duPhong, !!o.nen);
    if (o.nen && !ai && !s.trong) return null; // job nền: không có chữ của model thì để người dùng tự tạo khi mở trang
    const data = {
      tuLuc: khungTuan(tuan).tuLuc, denLuc: new Date(Math.min(cuoiTuan.getTime(), bayGio.getTime())),
      soLieu: { ...s, nguonDuLieu: nguonDuLieu(tho, s) } as object, diemYeu: yeu as object, keHoach: keHoach as object,
      nhanXet: (ai?.nhanXet ?? duPhong) as object, nguon: ai ? 'ai' : 'ma', model: ai?.model ?? null,
    };
    const dem = o.lamLai && !cuDo ? 1 : 0;
    const r = await prisma.ieltsNhanXetTuan.upsert({
      where: { uk_ielts_nhan_xet_tuan: { userId, tuan } },
      create: { userId, tuan, ...data },
      update: { ...data, lanTao: { increment: dem } },
    });
    void guiEmailNeuCan(userId, r.id).catch((e: unknown) => logger.warn('[nhan-xet-tuan] gửi email lỗi', { userId, error: (e as Error).message }));
    return { ...dinhDang(r, admin), moiTao: true };
  } finally {
    dangTao.delete(userId);
  }
}

export async function danhSach(userId: number, bayGio = new Date()) {
  const [ds, caiDat, admin] = await Promise.all([
    prisma.ieltsNhanXetTuan.findMany({
      where: { userId }, orderBy: { tuan: 'desc' }, take: 26,
      select: { tuan: true, denLuc: true, nguon: true, soLieu: true, diemYeu: true, updatedAt: true },
    }),
    layCaiDat(userId),
    laAdmin(userId).catch(() => false),
  ]);
  const tuanGoiY = tuanDaXongGanNhat(bayGio);
  return {
    tuanGoiY, coTuanGoiY: ds.some((d) => d.tuan === tuanGoiY), tuanHienTai: tuanCua(bayGio), tranTaoLai: admin ? null : TRAN_TAO_LAI,
    caiDat,
    ds: ds.map((d) => {
      const s = d.soLieu as unknown as SoLieuTuan;
      return {
        tuan: d.tuan, tuNgay: s.tuNgay, denNgay: s.denNgay, dangDo: d.denLuc.getTime() < khungTuan(d.tuan).denLuc.getTime(),
        nguon: d.nguon, trong: !!s.trong, ngayHoc: s.ngayHoc?.so ?? 0, soNgayTinh: s.soNgayTinh ?? 7, phut: s.phut?.tong ?? 0,
        baiXong: (s.khoa ?? []).reduce((a, k) => a + k.baiXong, 0), soDiemYeu: Array.isArray(d.diemYeu) ? d.diemYeu.length : 0,
        taoLuc: d.updatedAt,
      };
    }),
  };
}

export async function motBaoCao(userId: number, tuan: string) {
  if (!tuanHopLe(tuan)) throw new BadRequestError('Tuần phải là ngày thứ Hai dạng YYYY-MM-DD');
  const r = await prisma.ieltsNhanXetTuan.findUnique({ where: { uk_ielts_nhan_xet_tuan: { userId, tuan } } });
  if (!r) throw new NotFoundError('Chưa có nhận xét cho tuần này');
  return dinhDang(r, await laAdmin(userId).catch(() => false));
}

/* ── Cài đặt + email ── */

export async function layCaiDat(userId: number) {
  const c = await prisma.ieltsNhanXetCaiDat.findUnique({ where: { userId } });
  return { guiEmail: c?.guiEmail ?? false };
}
export async function datCaiDat(userId: number, b: { guiEmail?: unknown }) {
  if (typeof b.guiEmail !== 'boolean') throw new BadRequestError('guiEmail phải là true/false');
  const c = await prisma.ieltsNhanXetCaiDat.upsert({ where: { userId }, create: { userId, guiEmail: b.guiEmail }, update: { guiEmail: b.guiEmail } });
  return { guiEmail: c.guiEmail };
}

export function dungEmail(o: ReturnType<typeof dungThuTomTat>, ten: string | null): { subject: string; html: string; text: string } {
  const blocks: EmailBlock[] = [
    { type: 'p', text: o.tongQuan },
    { type: 'table', title: 'Số liệu tuần', rows: o.rows },
    ...(o.yeu.length ? [{ type: 'callout', tone: 'warning', title: 'Ưu tiên sửa tuần sau', text: o.yeu.join('\n') } as EmailBlock] : []),
    { type: 'p', text: o.loiNhan },
    { type: 'button', label: 'Xem nhận xét + kế hoạch tuần sau', url: o.url },
  ];
  const { html, text } = renderSiteEmail({
    preheader: o.tongQuan.slice(0, 120), eyebrow: 'CuongMini · Tiếng Anh', heading: o.tieuDe, greeting: greetingFor(ten), blocks,
    reason: 'Bạn nhận thư này vì đã bật "Gửi email tóm tắt" ở trang Nhận xét tuần. Tắt bất cứ lúc nào ở chính trang đó.',
    signoff: 'CuongMini',
  });
  return { subject: o.tieuDe, html, text };
}

/** Gửi tóm tắt một lần cho báo cáo tuần ĐÃ KHÉP, khi người dùng bật tuỳ chọn và email đã xác thực. */
export async function guiEmailNeuCan(userId: number, id: number) {
  const r = await prisma.ieltsNhanXetTuan.findUnique({ where: { id } });
  if (!r || r.emailLuc || r.denLuc.getTime() < khungTuan(r.tuan).denLuc.getTime()) return false;
  const s = r.soLieu as unknown as SoLieuTuan;
  if (s.trong) return false;
  const [caiDat, u] = await Promise.all([
    layCaiDat(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, emailVerified: true, fullName: true, displayName: true, enabled: true } }),
  ]);
  if (!caiDat.guiEmail || !u?.email || !u.emailVerified || u.enabled === false) return false;
  // Đánh dấu TRƯỚC khi gửi: hai lượt tạo chồng nhau không gửi hai thư.
  const { count } = await prisma.ieltsNhanXetTuan.updateMany({ where: { id, emailLuc: null }, data: { emailLuc: new Date() } });
  if (!count) return false;
  const thu = dungEmail(dungThuTomTat(s, r.nhanXet as unknown as NhanXet, (r.diemYeu as unknown as { tieuDe: string; bangChung: string; ma: string; loai: string; muc: number; lienKet: { nhan: string; href: string } }[]) ?? [],
    siteUrl(`${DUONG.nhanXet}?tuan=${r.tuan}`)), u.displayName ?? u.fullName ?? null);
  const kq = await emailService.send({ to: u.email, ...thu });
  if (!kq.success) {
    await prisma.ieltsNhanXetTuan.update({ where: { id }, data: { emailLuc: null } });
    logger.warn('[nhan-xet-tuan] email không gửi được', { userId, error: kq.error });
    return false;
  }
  return true;
}

/* ── Job Chủ nhật tối (mặc định TẮT) ── */

export const cronBat = () => process.env.NHAN_XET_TUAN_CRON === '1';

export async function chayCronTuan(bayGio = new Date()) {
  if (!cronBat()) return { bat: false, tao: 0, boQua: 0 };
  const tuan = tuanCua(bayGio);
  const { tuLuc, denLuc } = khungTuan(tuan);
  const toiDa = Math.max(1, Math.min(2000, Number(process.env.NHAN_XET_TUAN_CRON_TOI_DA) || 100));
  const [a, b, c, d] = await Promise.all([
    prisma.hocNgay.findMany({ where: { stage: { in: [...KHOA_EN] }, day: { gte: tuan, lte: congNgay(tuan, 6) } }, select: { userId: true }, distinct: ['userId'] }),
    prisma.ieltsCdtAttempt.findMany({ where: { createdAt: { gte: tuLuc, lt: denLuc } }, select: { userId: true }, distinct: ['userId'] }),
    prisma.ieltsVocabReview.findMany({ where: { ngay: { gte: tuan, lte: congNgay(tuan, 6) } }, select: { userId: true }, distinct: ['userId'] }),
    prisma.ctlHoatDongNgay.findMany({ where: { nn: 'en', giay: { gt: 0 }, ngay: { gte: new Date(`${tuan}T00:00:00Z`), lte: new Date(`${congNgay(tuan, 6)}T00:00:00Z`) } }, select: { userId: true }, distinct: ['userId'] }),
  ]);
  const ids = [...new Set([...a, ...b, ...c, ...d].map((x) => x.userId))];
  const daCo = new Set((await prisma.ieltsNhanXetTuan.findMany({ where: { tuan, userId: { in: ids } }, select: { userId: true } })).map((x) => x.userId));
  let tao = 0, boQua = 0;
  for (const userId of ids.filter((id) => !daCo.has(id)).slice(0, toiDa)) {
    try {
      const r = await taoBaoCao(userId, tuan, { nen: true, bayGio });
      if (r) tao++; else boQua++;
    } catch (e) {
      boQua++;
      logger.warn('[nhan-xet-tuan] job: lỗi một người', { userId, error: (e as Error).message });
    }
  }
  logger.info('[nhan-xet-tuan] job Chủ nhật xong', { tuan, ungVien: ids.length, tao, boQua });
  return { bat: true, tao, boQua };
}
